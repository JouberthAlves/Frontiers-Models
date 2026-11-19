import { CatmullRomCurve3, Vector3 } from 'three';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const mix = (a, b, f) => a + (b - a) * f;
export const wrap = (n, length) => ((n % length) + length) % length;
export const angle = n => Math.atan2(Math.sin(n), Math.cos(n));

export function smooth(a, b, value) {
  const t = clamp((value - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export function randomFrom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function shoreline(x) {
  return 343 + 40 * Math.exp(-(((x - 420) / 225) ** 2)) - 13 * Math.cos(x / 162) + 7 * Math.sin((x - 70) / 81);
}

export function eastShore(z) {
  return 565 + 39 * Math.cos((z + 4) / 162) - 50 * smooth(158, 333, z);
}

function groundShape(x, z) {
  const shore = Math.min(shoreline(x) - z, (eastShore(z)-x)*.94);
  const cape = smooth(105, 390, x);
  const hills = 17 * Math.sin((x + 505) / 277) ** 2 + 18 * Math.exp(-(((x - 320) / 210) ** 2));
  const inland = smooth(1, 328, shore) * (42 + hills);
  const cliff = smooth(0, 49, shore) * (1 - smooth(65, 250, shore)) * cape * 39;
  const erosion = smooth(5, 135, shore) *
    (3.1 * Math.sin(x * .019 - z * .016 + 2 * Math.sin(z * .008)) * Math.cos(z * .013 + x * .009)
      + 1.8 * Math.cos(z * .054 + x * .047 + 2 * Math.sin(x * .013))
      + .9 * Math.sin(x * .107 + z * .093));
  return shore < 0 ? shore * (.14 + cape * .25) : .10 * Math.min(shore, 75) + inland + cliff + erosion;
}

function vertexHeight(point, side) {
  return [point.x + point.nx * side, point.y + point.bank * side, point.z + point.nz * side];
}

function triangleHeight(x, z, a, b, c) {
  const det = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]);
  if (Math.abs(det) < 1e-8) return null;
  const u = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / det;
  const v = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / det;
  const w = 1 - u - v;
  return Math.min(u, v, w) >= -1e-6 ? a[1] * u + b[1] * v + c[1] * w : null;
}

export const SHOULDER = 1.65;
export const EMBANKMENT = [0, 1.4, 3.2, 6, 10, 15];

export class Course {
  constructor(config) {
    this.config = config;
    const controls = config.controls;
    const curve = new CatmullRomCurve3(controls.map(({ p }) => new Vector3(...p)), true, 'centripetal');
    curve.arcLengthDivisions = controls.length * 128;
    const lengths = curve.getLengths();
    this.length = lengths.at(-1);
    this.count = Math.ceil(this.length / 1.35);
    this.ds = this.length / this.count;
    this.start = config.startOffset;
    this.zones = config.zones.map(zone => ({ ...zone, at: lengths[zone.control * 128] }));
    this.checkpoints = Array.from({ length: config.checkpoints }, (_, i) => this.length * (i + 1) / config.checkpoints);
    this.points = [];
    for (let i = 0; i < this.count; i++) {
      const s = i * this.ds;
      const parameter = curve.getUtoTmapping(i / this.count);
      const p = curve.getPoint(parameter);
      const vector = curve.getTangent(parameter);
      const heading = Math.atan2(vector.z, vector.x);
      const j = Math.min(Math.floor(parameter * controls.length), controls.length - 1);
      const local = smooth(0, 1, parameter * controls.length - j);
      const here = controls[j];
      const next = controls[(j + 1) % controls.length];
      this.points.push({
        x: p.x, y: p.y, z: p.z, s, heading,
        nx: -Math.sin(heading), nz: Math.cos(heading),
        half: mix(here.width, next.width, local) / 2,
        bank: Math.tan(mix(here.bank, next.bank, local) * Math.PI / 180),
      });
    }
    this.points.forEach((p, index) => {
      const before = this.points[wrap(index - 3, this.count)];
      const after = this.points[wrap(index + 3, this.count)];
      p.curvature = angle(after.heading - before.heading) / (6 * this.ds);
      p.grade = (after.y - before.y) / (6 * this.ds);
    });
    this.bins = new Map();
    this.earthBins = new Map();
    this.points.forEach((point, i) => {
      for (const [size, bins] of [[48, this.bins], [128, this.earthBins]]) {
        const bx = Math.floor(point.x / size), bz = Math.floor(point.z / size);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            const key = (bx + dx) * 65536 + bz + dz;
            if (!bins.has(key)) bins.set(key, []);
            bins.get(key).push(i);
          }
        }
      }
    });
    this.obstacles = [];
    this.buildHeightfield();
  }

  zone(s) {
    const wrapped = wrap(s, this.length);
    return Math.max(0, this.zones.findLastIndex(zone => wrapped >= zone.at));
  }

  at(s, offset = 0) {
    const wrapped = wrap(s, this.length);
    const index = Math.floor(wrapped / this.ds);
    const a = this.points[index];
    const b = this.points[(index + 1) % this.count];
    const f = (wrapped - a.s) / this.ds;
    const heading = a.heading + angle(b.heading - a.heading) * f;
    const nx = -Math.sin(heading), nz = Math.cos(heading);
    const bank = mix(a.bank, b.bank, f);
    return {
      x: mix(a.x, b.x, f) + nx * offset,
      y: mix(a.y, b.y, f) + bank * offset,
      z: mix(a.z, b.z, f) + nz * offset,
      s: wrapped, index, heading, nx, nz, bank,
      half: mix(a.half, b.half, f), curvature: mix(a.curvature, b.curvature, f),
      grade: mix(a.grade, b.grade, f),
    };
  }

  nearest(x, z, fallback = true, earth = false) {
    const size = earth ? 128 : 48;
    const key = Math.floor(x / size) * 65536 + Math.floor(z / size);
    const ids = (earth ? this.earthBins : this.bins).get(key);
    if (!ids && !fallback) return null;
    let best = Infinity, index = 0, fraction = 0, lateral = 0;
    const scan = ids ?? this.points.keys();
    for (const i of scan) {
      const a = this.points[i], b = this.points[(i + 1) % this.count];
      const dx = b.x - a.x, dz = b.z - a.z;
      const t = clamp(((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz), 0, 1);
      const ox = x - a.x - dx * t, oz = z - a.z - dz * t;
      const square = ox * ox + oz * oz;
      if (square < best) {
        best = square;
        index = i;
        fraction = t;
        lateral = ox * a.nx + oz * a.nz;
      }
    }
    return { index, s: wrap((index + fraction) * this.ds, this.length), distance: Math.sqrt(best), lateral };
  }

  roadside(point, offset) {
    const x = point.x + point.nx * offset, z = point.z + point.nz * offset;
    const edge = Math.sign(offset) * (point.half + SHOULDER);
    const gap = Math.abs(offset - edge);
    let base = groundShape(x, z);
    const fall = .11 + .10 * smooth(20, 110, shoreline(x) - z);
    const village = smooth(this.zones[2].at - 52, this.zones[2].at + 12, point.s)
      * (1 - smooth(this.zones[3].at - 12, this.zones[3].at + 52, point.s));
    const terrace = Math.min(7.4, Math.max(0,gap-11)*.146);
    base = mix(base, point.y - 1.0 + terrace, village * (1 - smooth(62, 112, gap)));
    if (this.zone(point.s)===1 && offset>0) {
      base -= 13.5*smooth(320,435,point.x)*smooth(14,61,gap)*(1-smooth(95,117,gap));
    }
    const near = point.y + point.bank * edge - gap * fall;
    return mix(near, base, smooth(3.0, 34, gap));
  }

  buildHeightfield() {
    const { xMin, xMax, zMin, zMax, step } = this.config.terrain;
    this.columns = Math.round((xMax - xMin) / step) + 1;
    this.rows = Math.round((zMax - zMin) / step) + 1;
    this.heights = new Float32Array(this.columns * this.rows);
    for (let iz = 0; iz < this.rows; iz++) {
      for (let ix = 0; ix < this.columns; ix++) {
        const x = xMin + ix * step, z = zMin + iz * step;
        const closest = this.nearest(x, z, false, true);
        let y = groundShape(x, z);
        if (closest && closest.distance < 125) {
          const p = this.at(closest.s);
          const offset = closest.lateral;
          const d = closest.distance - p.half - SHOULDER;
          y = d < 0 ? p.y + p.bank * offset : this.roadside(p, offset);
          y -= .7 * (1 - smooth(8, 16, d));
          if (this.zone(p.s) === 3) {
            const bridgeAt = this.zones[3].at + 133;
            y -= 13.4 * (1 - smooth(16, 33, Math.abs(p.s - bridgeAt))) * (1 - smooth(37, 101, closest.distance));
          }
        }
        this.heights[iz * this.columns + ix] = y;
      }
    }
  }

  ground(x, z) {
    const { xMin, zMin, step } = this.config.terrain;
    const dx = (x - xMin) / step, dz = (z - zMin) / step;
    const i = Math.floor(dx), j = Math.floor(dz);
    if (i < 0 || j < 0 || i >= this.columns - 1 || j >= this.rows - 1) return null;
    const u = dx - i, v = dz - j, index = j * this.columns + i;
    const a = this.heights[index], b = this.heights[index + 1];
    const c = this.heights[index + this.columns], d = this.heights[index + this.columns + 1];
    return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v);
  }

  isBridge(s) {
    return Math.abs(s - this.zones[3].at - 133) < 22;
  }

  embankment(point, side, distance) {
    const offset = side * (point.half + SHOULDER + distance);
    const v = vertexHeight(point, offset);
    const cut = 1 - smooth(13, 23, Math.abs(point.s - this.zones[3].at - 133));
    const blend = smooth(3, 15, distance);
    v[1] = mix(this.roadside(point, offset), this.ground(v[0], v[2]), blend) - .03 * blend;
    if (distance && cut > 0) {
      v[1] = mix(v[1], this.ground(v[0], v[2]) - .04, cut);
    }
    return v;
  }

  roadRay(x, z, closest = this.nearest(x, z, false)) {
    if (!closest || closest.distance > 9) return null;
    for (const delta of [0, -1, 1, -2, 2]) {
      const a = this.points[wrap(closest.index + delta, this.count)];
      const b = this.points[wrap(closest.index + delta + 1, this.count)];
      const al = vertexHeight(a, -a.half - SHOULDER);
      const ar = vertexHeight(a, a.half + SHOULDER);
      const bl = vertexHeight(b, -b.half - SHOULDER);
      const br = vertexHeight(b, b.half + SHOULDER);
      const y = triangleHeight(x, z, al, ar, bl) ?? triangleHeight(x, z, ar, br, bl);
      if (y !== null) {
        const abs = Math.abs(closest.lateral);
        const half = this.at(closest.s).half;
        return { y, surface: abs < half ? 'asphalt' : 'curb' };
      }
    }
    return null;
  }

  surface(x, z, closest = this.nearest(x, z, false)) {
    const road = this.roadRay(x, z, closest);
    if (road) return road;
    const ground = this.ground(x, z);
    let y = ground;
    if (closest && closest.distance < 23 && !this.isBridge(closest.s)) {
      const side = Math.sign(closest.lateral);
      for (const delta of [0, -1, 1]) {
        const a = this.points[wrap(closest.index + delta, this.count)];
        const b = this.points[wrap(closest.index + delta + 1, this.count)];
        for (let i = 0; i < EMBANKMENT.length - 1; i++) {
          const al = this.embankment(a, side, EMBANKMENT[i]);
          const ar = this.embankment(a, side, EMBANKMENT[i + 1]);
          const bl = this.embankment(b, side, EMBANKMENT[i]);
          const br = this.embankment(b, side, EMBANKMENT[i + 1]);
          const hit = triangleHeight(x, z, al, ar, bl) ?? triangleHeight(x, z, ar, br, bl);
          if (hit !== null) y = Math.max(y ?? -Infinity, hit);
        }
      }
    }
    if (y === null) return null;
    return { y, surface: z > shoreline(x) - 65 ? 'sand' : 'dirt' };
  }

  rail(s, side) {
    const zone = this.zone(s);
    if (this.isBridge(s)) return true;
    if (zone === 0) return side > 0 && s > 115 && s < this.zones[1].at - 22;
    if (zone === 1) return side > 0;
    return false;
  }
}

export function validateWorld(course) {
  const errors = new Map();
  const fail = (label, detail) => {
    if (!errors.has(label)) errors.set(label, detail);
  };
  const metrics = { lengthMeters:course.length, minRadius: Infinity, maxGrade: 0, maxBank: 0, maxEdgeStep: 0, maxTerrainPoke: 0 };
  for (const p of course.points) {
    const radius = 1 / Math.max(Math.abs(p.curvature), 1e-9);
    metrics.minRadius = Math.min(radius, metrics.minRadius);
    const bank = Math.abs(Math.atan(p.bank) * 180 / Math.PI);
    metrics.maxBank = Math.max(bank, metrics.maxBank);
    metrics.maxGrade = Math.max(Math.abs(p.grade), metrics.maxGrade);
    if (radius < 25) fail('Corner radius below 25 m', p.s);
    if (Math.abs(p.grade) > .14) fail('Longitudinal grade above 14%', p.s);
    if (bank > 12) fail('Bank above 12 degrees', p.s);
    for (const width of [-1, -.5, 0, .5, 1]) {
      const [x, y, z] = vertexHeight(p, width * p.half);
      const poke = course.ground(x, z) - y;
      metrics.maxTerrainPoke = Math.max(metrics.maxTerrainPoke, poke);
      if (poke > .02) fail('Terrain pokes through asphalt', p.s);
    }
    for (const side of [-1, 1]) {
      const edge = vertexHeight(p, side * (p.half + SHOULDER));
      const adjacent = course.embankment(p, side, 0);
      const step = Math.abs(edge[1] - adjacent[1]);
      metrics.maxEdgeStep = Math.max(metrics.maxEdgeStep, step);
      if (step > .15) fail('Gap at the road edge', p.s);
    }
  }
  course.checkpoints.forEach((offset, i) => {
    const p = course.at(course.start + offset);
    if (offset <= (course.checkpoints[i - 1] ?? 0) || !course.roadRay(p.x, p.z)) fail('Invalid checkpoint', i);
  });
  for (const [i, prop] of course.obstacles.entries()) {
    const nearest = course.nearest(prop.x, prop.z);
    if (nearest.distance - prop.radius < course.at(nearest.s).half + 3) fail('Rigid obstacle inside exclusion zone', i);
    const y = course.surface(prop.x, prop.z)?.y;
    if (y === undefined || (!prop.sunk && Math.abs(y - prop.y) > .30)) fail('Ungrounded obstacle', i);
    if (prop.kind === 'building' && course.obstacles.slice(0, i).some(other =>
      other.kind === 'building' && Math.hypot(prop.x - other.x, prop.z - other.z) < prop.radius + other.radius)) {
      fail('Overlapping buildings', i);
    }
  }
  return { errors: [...errors].map(([label, detail]) => `${label} at ${detail}`), ...metrics };
}
