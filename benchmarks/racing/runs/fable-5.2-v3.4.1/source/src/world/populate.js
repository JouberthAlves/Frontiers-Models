// Object placement (step 8 of the world derivation): houses, plants, rocks and props.
// Every object is positioned in track space (distance along the spline + lateral offset, or a
// position projected back onto the spline), grounded by a height-field ray cast, kept out of the
// exclusion strip, and recorded in world.objects for validateWorld() and the scene audit.
// Same seed -> same world.

import { Rng, hash01, fbm2 } from '../core/rng.js';
import { clamp, lerp, smoothstep } from '../core/math.js';
import { EXCLUSION, BARRIER_TYPES } from './track.js';
import { buildVillage } from './village.js';

const BT = Object.fromEntries(BARRIER_TYPES.map((n, i) => [n, i]));

export class Placer {
  constructor(world) {
    this.world = world; this.track = world.track; this.terrain = world.terrain; this.sp = world.track.spline;
    this.objects = []; this.cell = 4; this.hash = new Map(); this.pr = {};
    this.reserved = [];   // oriented boxes where nothing else may stand (houses, squares, side streets)
    this.nextId = 1;
  }
  rng(name) { let h = this.world.seed >>> 0; for (let i = 0; i < name.length; i++) h = (Math.imul(h ^ name.charCodeAt(i), 16777619)) >>> 0; return new Rng(h); }
  _key(x, z) { return `${Math.floor(x / this.cell)},${Math.floor(z / this.cell)}`; }
  _near(x, z, r) {
    const out = []; const c = this.cell; const n = Math.ceil((r + 6) / c);
    const cx = Math.floor(x / c), cz = Math.floor(z / c);
    for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) { const b = this.hash.get(`${cx + i},${cz + j}`); if (b) for (const o of b) out.push(o); }
    return out;
  }
  reserve(box) { this.reserved.push(box); }
  inReserved(x, z, pad = 0) {
    for (const b of this.reserved) {
      const dx = x - b.x, dz = z - b.z; if (Math.abs(dx) > b.rad + pad || Math.abs(dz) > b.rad + pad) continue;
      const c = Math.cos(b.rot), s = Math.sin(b.rot); const lx = dx * c + dz * s, lz = -dx * s + dz * c;
      if (Math.abs(lx) < b.hx + pad && Math.abs(lz) < b.hz + pad) return true;
    }
    return false;
  }
  /** clearance of a point to the road edge (m) and its lap position */
  edgeInfo(x, z, hint = -1) {
    const pr = this.sp.project(x, z, hint, this.pr);
    return { s: pr.s, d: pr.d, clear: Math.max(Math.abs(pr.d), pr.dist) - this.sp.sampleArr(this.sp.half, pr.s), i: pr.i };
  }
  /**
   * @param o {kind, type, x, z | s, d, r, rot, scale, variant, spacing (extra gap to neighbours), water (allowed in water),
   *           maxSlope, minClear (default EXCLUSION), minY, sink (rocks), noReserve (may stand in reserved areas)}
   * @returns the stored object or null if any rule rejects it
   */
  place(o) {
    const sp = this.sp, terrain = this.terrain;
    let x = o.x, z = o.z;
    if (x === undefined) { const p = sp.pointAt(o.s, o.d, {}); x = p.x; z = p.z; }
    if (!terrain.inBounds(x, z)) return null;
    const r = o.r ?? 0.3;
    const info = this.edgeInfo(x, z);
    if (info.clear - r < (o.minClear ?? EXCLUSION) + 0.05) return null;
    // never outside the barrier-to-road strip rules: nothing between the road and its barrier
    const side = info.d < 0 ? 0 : 1; const bar = this.track.barOff[side][info.i];
    if (!o.allowInsideBarrier && info.clear - r < bar + 0.25) return null;
    // a rock cutting fills the 7 m behind its collision line (render/barriers-view.js)
    if (this.track.barType[side][info.i] === BT.rockwall && info.clear - r < bar + 7.4) return null;
    const y = terrain.heightAt(x, z);
    if (!o.water && y < (o.minY ?? 0.45)) return null;
    if (o.water && (y > (o.maxY ?? 0.2) || y < (o.minYWater ?? -3))) return null;
    if (o.maxSlope !== undefined && terrain.slopeAt(x, z) > o.maxSlope) return null;
    if (!o.noReserve && this.inReserved(x, z, r)) return null;
    const gap = o.spacing ?? 0;
    for (const q of this._near(x, z, r + gap)) {
      if (q.hx !== undefined) {   // oriented footprint (buildings): the point must be outside the box grown by r
        const dx = x - q.x, dz = z - q.z, c = Math.cos(q.rot), sn = Math.sin(q.rot);
        if (Math.abs(dx * c + dz * sn) < q.hx + r && Math.abs(-dx * sn + dz * c) < q.hz + r) return null;
        continue;
      }
      const need = r + q.r + Math.max(gap, q.spacing || 0) * (q.kind === o.kind || o.strict ? 1 : 0.35);
      const dx = q.x - x, dz = q.z - z; if (dx * dx + dz * dz < need * need) return null;
    }
    const obj = {
      id: this.nextId++, kind: o.kind, type: o.type, variant: o.variant ?? 0, x, y: y - (o.sink ?? 0), z, rot: o.rot ?? 0, scale: o.scale ?? 1, r,
      s: info.s, d: info.d, clear: info.clear, zone: this.track.zone[info.i], tint: o.tint ?? 0.5, spacing: gap,
    };
    if (o.data) obj.data = o.data;
    if (o.sy) obj.sy = o.sy;
    if (o.kind === 'rock') obj.sink = o.sink ?? 0;
    this._store(obj);
    return obj;
  }
  /** stores an object that carries its own oriented footprint (houses, landmarks) */
  placeBox(o) {
    const obj = { id: this.nextId++, spacing: 0, tint: 0.5, variant: 0, scale: 1, ...o };
    const info = this.edgeInfo(o.x, o.z); obj.s = info.s; obj.d = info.d; obj.clear = info.clear; obj.zone = this.track.zone[info.i];
    obj.r = Math.hypot(o.hx, o.hz);
    this._store(obj); this.reserve({ x: o.x, z: o.z, rot: o.rot, hx: o.hx + 0.2, hz: o.hz + 0.2, rad: obj.r + 0.5 });
    return obj;
  }
  _store(obj) {
    this.objects.push(obj);
    const k = this._key(obj.x, obj.z); (this.hash.get(k) || this.hash.set(k, []).get(k)).push(obj);
  }
}

const inR = (s, a, b, L) => (a <= b ? s >= a && s < b : s >= a || s < b);

// ---------------------------------------------------------------------------------------------
// rocks: in the shallows off the beach and around the foot of the cliffs, with foam rings
// ---------------------------------------------------------------------------------------------
function placeRocks(P) {
  const { terrain, track, sp, world } = P; const rnd = P.rng('rocks'); const foam = world.lists.foamSpots = [];
  const tryRock = (x, z, size, inWater) => {
    const sc = size * rnd.range(0.75, 1.3);
    const o = P.place({ kind: 'rock', type: 'rock', variant: rnd.int(0, 4), x, z, r: sc * 0.62, rot: rnd.range(0, 6.28), scale: sc, water: inWater, maxY: 0.35, minYWater: -2.6, minY: 0.2, sink: sc * rnd.range(0.18, 0.42), spacing: 0.2, tint: rnd.f(), minClear: EXCLUSION + 0.5 });
    if (o && inWater && sc > 0.9) foam.push({ x: o.x, z: o.z, r: sc * 1.2 + 0.7 });      // only boulders break the swell into foam
    return o;
  };
  // clusters in the shallows along the sea front
  const z1 = track.zones[0];
  for (let k = 0; k < 13; k++) {
    const s = sp.wrapS(z1.from + 20 + (z1.length - 40) * (k + rnd.range(-0.3, 0.3)) / 13);
    const base = sp.pointAt(s, -(sp.sampleArr(sp.half, s) + rnd.range(44, 62)), {});
    const n = rnd.int(3, 8);
    for (let i = 0; i < n; i++) tryRock(base.x + rnd.gauss() * 4.5, base.z + rnd.gauss() * 3.4 + 2, rnd.range(0.8, 2.6), true);
    // smaller stones strewn around the boulders, in the water and up the wet sand
    for (let i = 0; i < 22; i++) {
      const x = base.x + rnd.gauss() * 7.5, z = base.z + rnd.gauss() * 6.5;
      if (!terrain.inBounds(x, z)) continue;
      tryRock(x, z, rnd.range(0.22, 0.85), terrain.heightAt(x, z) < 0.25);
    }
  }
  // pebbles and small stones along the swash line of the sea front (denser around the rock clusters)
  {
    const H = (s) => sp.sampleArr(sp.half, s); const p = {};
    for (let s = z1.from + 6; s < z1.from + z1.length - 6; s += 2.2) {
      const sw = sp.wrapS(s); const hw = H(sw); let wl = -1;
      for (let dd = hw + 22; dd < hw + 95; dd += 1.5) { sp.pointAt(sw, -dd, p); if (terrain.heightAt(p.x, p.z) < 0.3) { wl = dd; break; } }
      if (wl < 0) continue;
      const n = rnd.int(1, 3);
      for (let k = 0; k < n; k++) {
        sp.pointAt(sw + rnd.range(-1.1, 1.1), -(wl + rnd.gauss() * 2.6 - 0.8), p);
        const sc = rnd.range(0.07, 0.3) * (rnd.f() < 0.12 ? 2 : 1);
        P.place({ kind: 'rock', type: 'pebble', variant: rnd.int(0, 4), x: p.x, z: p.z, r: sc * 0.6, rot: rnd.range(0, 6.28), scale: sc, water: terrain.heightAt(p.x, p.z) < 0.2, maxY: 0.2, minYWater: -0.5, minY: 0.2, sink: sc * rnd.range(0.2, 0.45), spacing: 0.02, tint: rnd.f(), minClear: EXCLUSION + 0.5 });
      }
    }
  }
  // everywhere else: walk the coast, rocks where the shore is steep (cliff feet) or mixed
  const coast = terrain.coast.poly; const m = coast.length;
  for (let i = 0; i < m; i++) {
    const a = coast[i], b = coast[(i + 1) % m]; const len = Math.hypot(b.x - a.x, b.z - a.z);
    const nx = -(b.z - a.z) / len, nz = (b.x - a.x) / len; // either inward or outward; both sides are tried
    for (let t = 0; t < len; t += 5.5) {
      const steep = lerp(a.steep, b.steep, t / len); if (steep < 0.12) continue;
      if (rnd.f() > 0.45 + steep * 0.5) continue;
      const px = a.x + (b.x - a.x) * t / len, pz = a.z + (b.z - a.z) * t / len;
      if (!terrain.inBounds(px, pz) || terrain.trackDist(px, pz) > 330) continue;
      const cnt = rnd.int(1, 3 + Math.round(steep * 3));
      for (let q = 0; q < cnt; q++) {
        const off = rnd.range(-9, 13), lat = rnd.gauss() * 3;
        const x = px + nx * off - nz * lat, z = pz + nz * off + nx * lat;
        const h = terrain.heightAt(x, z);
        tryRock(x, z, rnd.range(1.0, 3.6) * (0.7 + steep * 0.6), h < 0.25);
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Z1 - sea front: promenade furniture on the land side, beach life on the sea side
// ---------------------------------------------------------------------------------------------
function placeOrla(P) {
  const { track, sp } = P; const rnd = P.rng('orla'); const L = sp.length;
  const z = track.zones[0];
  const from = z.from + 34, to = z.from + z.length - 36;     // straight part of the zone
  const H = (s) => sp.sampleArr(sp.half, s);
  const startS = (s) => { const d = Math.abs(sp.deltaS(s, 0)); return d; };
  // ---- start / finish gantry: one post on each side, behind the barriers
  { const hd = sp.pointAt(0, 0, {}).heading; for (const sg of [-1, 1]) P.place({ kind: 'prop', type: 'gantrypost', s: 0, d: sg * (H(0) + 3.5), r: 0.3, rot: hd, minY: 0.3 }); }
  // ---- kiosks / beach bars with terraces (placed first: they reserve their plots)
  let kk = 0;
  for (const f of [0.14, 0.4, 0.66, 0.9]) {
    const sw = sp.wrapS(from + (to - from) * f); const p = sp.pointAt(sw, H(sw) + 12.5, {});
    const y = P.terrain.heightAt(p.x, p.z); const v = kk++ % 3;
    const spec = {
      use: 'kiosk', floors: 1, wallMat: ['woodblue', 'plaster', 'woodgreen'][v], wall: [0xffffff, 0xf1ead9, 0xffffff][v], trim: 0xf3ecdd, shutter: [0xf0ece2, 0x2f5f8a, 0xf0ece2][v],
      roof: ['hip', 'gable', 'hip'][v], roofMat: ['rooftile', 'rooftile2', 'rooftile3'][v], eaves: 0.75, pitch: 21, plinth: 0.3,
      feat: { awning: true, sign: v === 1 ? 1 : 3, lantern: true }, awningTile: (kk + 1) % 4, seed: 500 + kk,
    };
    // front (+x of the building) faces the road: the kiosk stands on the right side of the track
    P.placeBox({ kind: 'house', type: 'kiosk', variant: v, x: p.x, y, z: p.z, rot: p.heading - Math.PI / 2, hx: 2.6, hz: 3.4, floors: 1, tint: rnd.f(), unit: false, spec });
    P.reserve({ x: p.x + Math.cos(p.heading - Math.PI / 2) * 3.4, z: p.z + Math.sin(p.heading - Math.PI / 2) * 3.4, rot: p.heading - Math.PI / 2, hx: 0.9, hz: 3.6, rad: 3.8 });   // under the awning
    for (let q = 0; q < 5; q++) P.place({ kind: 'prop', type: 'cafetable', variant: q % 2, s: sw + rnd.range(-6.5, 6.5), d: H(sw) + rnd.range(6.4, 8.0), r: 0.85, rot: rnd.range(0, 6.28), spacing: 0.5 });
  }
  // ---- land side (right): promenade
  for (let s = from; s < to; s += 13) {
    const sw = sp.wrapS(s); const hw = H(sw); const j = rnd.range(-2.5, 2.5);
    P.place({ kind: 'tree', type: 'palm', variant: rnd.int(0, 2), s: sw + j, d: hw + rnd.range(6.6, 8.8), r: 0.42, rot: rnd.range(0, 6.28), scale: rnd.range(0.85, 1.2), spacing: 3.5, tint: rnd.f() });
  }
  for (let s = from + 6; s < to; s += 26) { const sw = sp.wrapS(s); P.place({ kind: 'prop', type: 'lamp', s: sw, d: H(sw) + 3.75, r: 0.28, rot: sp.pointAt(sw, 0, {}).heading + Math.PI / 2 }); }
  for (let s = from + 15; s < to; s += 19.5) {
    const sw = sp.wrapS(s + rnd.range(-3, 3)); const hd = sp.pointAt(sw, 0, {}).heading;
    const pick = rnd.f();
    if (pick < 0.45) P.place({ kind: 'prop', type: 'bench', s: sw, d: H(sw) + 4.9, r: 1.0, rot: hd + Math.PI, spacing: 0.4 });
    else if (pick < 0.8) P.place({ kind: 'prop', type: 'planter', variant: rnd.int(0, 2), s: sw, d: H(sw) + 4.6, r: 0.95, rot: hd, spacing: 0.4 });
    else P.place({ kind: 'prop', type: 'bin', s: sw, d: H(sw) + 4.3, r: 0.35, rot: hd });
  }
  // flag poles on both sides of the start
  for (let k = -5; k <= 5; k++) { const sw = sp.wrapS(k * 9 + 4); P.place({ kind: 'prop', type: 'flagpole', variant: (k + 6) % 4, s: sw, d: H(sw) + 4.1, r: 0.2, rot: 0 }); }
  // ---- sea side (left): palms just behind the sea wall (their long shadows cross the road), beach life beyond
  for (let s = from + 4; s < to; s += 17) {
    const sw = sp.wrapS(s + rnd.range(-4, 4)); const hw = H(sw);
    if (startS(sw) < 12) continue;
    P.place({ kind: 'tree', type: 'palm', variant: rnd.int(0, 2), s: sw, d: -(hw + rnd.range(4.6, 6.4)), r: 0.42, rot: rnd.range(0, 6.28), scale: rnd.range(0.9, 1.3), spacing: 3, tint: rnd.f() });
  }
  for (let s = from + 9; s < to; s += 30) {
    const sw = sp.wrapS(s + rnd.range(-6, 6)); const hw = H(sw); const n = rnd.int(2, 4); const d0 = rnd.range(11, 21);
    for (let i = 0; i < n; i++) {
      const ss = sw + (i - (n - 1) / 2) * 4.2 + rnd.range(-0.6, 0.6), dd = -(hw + d0 + rnd.range(-1.5, 1.5));
      const o = P.place({ kind: 'prop', type: 'parasol', variant: rnd.int(0, 3), s: ss, d: dd, r: 0.25, rot: rnd.range(0, 6.28), spacing: 0.3, minY: 0.9 });
      // two sun beds in the shade, feet towards the sea
      if (o) { const hd = sp.pointAt(ss, 0, {}).heading; for (const e of [-1.2, 1.2]) P.place({ kind: 'prop', type: 'sunbed', s: ss + e, d: dd - 0.75, r: 0.55, rot: hd + Math.PI / 2 + rnd.range(-0.25, 0.25), spacing: 0.05, minY: 0.8 }); }
    }
  }
  // slatted beach fences running from the wall towards the water
  for (let s = from + 22; s < to; s += 41) {
    const sw = sp.wrapS(s + rnd.range(-8, 8)); const hw = H(sw); const skew = rnd.range(-0.5, 0.5); const n = rnd.int(4, 7);
    for (let i = 0; i < n; i++) {
      const ss = sw + i * 2.4 * skew, dd = -(hw + 4.4 + i * 2.4 * Math.sqrt(1 - skew * skew));
      const hd = sp.pointAt(ss, 0, {}).heading;
      P.place({ kind: 'prop', type: 'slatfence', s: ss, d: dd, r: 0.5, rot: hd + Math.atan2(Math.sqrt(1 - skew * skew), skew) + Math.PI, spacing: 0, minY: 0.9, strict: false });
    }
  }
  for (const f of [0.1, 0.33, 0.58, 0.81]) { const sw = sp.wrapS(from + (to - from) * f + rnd.range(-8, 8)); P.place({ kind: 'prop', type: 'boat', variant: rnd.int(0, 2), s: sw, d: -(H(sw) + rnd.range(24, 33)), r: 2.3, rot: rnd.range(0, 6.28), spacing: 1.5, minY: 0.75 }); }
  { const sw = sp.wrapS(from + (to - from) * 0.47); P.place({ kind: 'prop', type: 'lifeguard', s: sw, d: -(H(sw) + 17), r: 1.7, rot: sp.pointAt(sw, 0, {}).heading - Math.PI / 2, spacing: 2, minY: 0.9 }); }
  // dune grass at the foot of the wall and across the upper beach
  for (let s = from - 20; s < to + 20; s += 2.6) {
    const sw = sp.wrapS(s); const hw = H(sw);
    if (rnd.f() < 0.75) P.place({ kind: 'ground', type: 'beachgrass', variant: rnd.int(0, 2), s: sw + rnd.range(-1, 1), d: -(hw + 3.6 + Math.abs(rnd.gauss()) * 4.5), r: 0.55, rot: rnd.range(0, 6.28), scale: rnd.range(0.7, 1.4), spacing: 0.25, minY: 1.0, tint: rnd.f() });
  }
}

// ---------------------------------------------------------------------------------------------
// roadside furniture everywhere outside the village: keeps every 100 m of track busy
// ---------------------------------------------------------------------------------------------
function placeRoadside(P) {
  const { track, sp, terrain } = P; const rnd = P.rng('roadside'); const L = sp.length;
  const tables = {
    0: ['sign', 'bollardstone', 'crate', 'barrel', 'utilitypole'],
    1: ['delineator', 'milestone', 'sign', 'delineator', 'bollardstone', 'cairn', 'delineator', 'sign', 'utilitypole'],
    2: [],
    3: ['logpile', 'woodsign', 'milestone', 'utilitypole', 'bollardstone', 'sign', 'trough', 'delineator'],
  };
  const R0 = { logpile: 1.2, utilitypole: 0.3, delineator: 0.12, milestone: 0.25, sign: 0.2, bollardstone: 0.22, cairn: 0.4 };
  for (let s = 0; s < L; s += 5.2) {
    const i = Math.floor(s / sp.ds) % sp.n; const zone = track.zone[i]; if (zone === 2) continue;
    if (track.bridge[i] || track.conform[i] < 1) continue;
    const table = tables[zone]; const type = table[Math.floor(rnd.f() * table.length)];
    // never on the side of a rock cutting; otherwise either side
    let side = rnd.f() < 0.5 ? 0 : 1; if (track.barType[side][i] === BT.rockwall) side = 1 - side; if (track.barType[side][i] === BT.rockwall) continue;
    const sg = side === 0 ? -1 : 1; const hw = sp.half[i]; const bar = track.barOff[side][i]; const r = R0[type] ?? 0.4;
    const narrow = track.plat[side][i] < 7.5;
    // on a narrow shoulder the object stands right behind the barrier (still outside the 3 m exclusion strip)
    const d0 = Math.max(EXCLUSION + 0.12, bar + 0.32) + r;
    const o = { kind: 'prop', type, variant: rnd.int(0, 5), s: s + rnd.range(-1.5, 1.5), d: sg * (hw + d0 + (narrow ? rnd.range(0, 0.5) : rnd.range(0.3, 4.5))), r, rot: sp.pointAt(s, 0, {}).heading + (side === 0 ? Math.PI : 0) + rnd.range(-0.12, 0.12), spacing: 1.0, maxSlope: narrow ? 1.2 : 0.55, minY: 0.9 };
    if (type === 'utilitypole') { if (!narrow) o.d = sg * (hw + d0 + rnd.range(1.5, 3.5)); o.spacing = 9; }
    if (type === 'sign' || type === 'woodsign') o.rot = sp.pointAt(s, 0, {}).heading + Math.PI + rnd.range(-0.1, 0.1);      // faces the oncoming cars
    P.place(o);
  }
  // the inlet under the bridge: mooring piles and net stakes standing on the sea bed
  if (world_bridge(P)) {
    const br = P.world.json.bridge; const q = {};
    for (let k = 0; k < 90; k++) {
      const s = rnd.range(br.from - 4, br.to + 4), sg = rnd.f() < 0.5 ? -1 : 1, dd = sp.sampleArr(sp.half, s) + rnd.range(6, 34);
      const p = sp.pointAt(s, sg * dd, q); const y = terrain.heightAt(p.x, p.z); if (y > -0.5 || y < -5.6) continue;
      P.place({ kind: 'prop', type: 'pile', variant: rnd.int(0, 2), x: p.x, z: p.z, r: 0.2, rot: rnd.range(0, 6.28), sy: -y + rnd.range(1.0, 1.9), water: true, maxY: -0.5, minYWater: -5.6, spacing: 2.2, minClear: 5 });
    }
  }
}
const world_bridge = (P) => !!P.world.json.bridge;

// ---------------------------------------------------------------------------------------------
// general flora: grasses, shrubs and scattered trees on every piece of plantable land near the track
// (the dense forest of Z4 and the village greenery are added by their own rules)
// ---------------------------------------------------------------------------------------------
function placeFlora(P) {
  const { track, sp, terrain, world } = P; const rnd = P.rng('flora'); const seed = world.seed;
  const nx = terrain.nx, nz = terrain.nz, cell = terrain.cell;
  const GRASS = ['grasstuft', 'grasstuft', 'drygrass', 'herbs', 'flowers'];
  const SHRUB = ['lentisk', 'rosemary', 'broom', 'lentisk', 'oleander', 'agave'];
  for (let iz = 2; iz < nz - 2; iz += 1) for (let ix = 2; ix < nx - 2; ix += 1) {
    const id = iz * nx + ix; const ns = terrain.nearS[id]; if (ns < 0) continue;
    const ad = Math.abs(terrain.nearD[id]); const i = Math.floor(ns / sp.ds) % sp.n; const hw = sp.half[i];
    const dist = ad - hw; if (dist < EXCLUSION + 0.4 || dist > 62) continue;
    const zone = track.zone[i];
    const sand = terrain.mSand[id] / 255, rock = terrain.mRock[id] / 255, paved = terrain.mPaved[id] / 255, forest = terrain.mForest[id] / 255, gravel = terrain.mGravel[id] / 255;
    const h = terrain.h[id]; if (h < 0.7 || paved > 0.35) continue;
    const u = hash01(ix, iz, seed + 7);
    const x = terrain.x0 + (ix + hash01(ix, iz, seed + 8) - 0.5) * cell, z = terrain.z0 + (iz + hash01(ix, iz, seed + 9) - 0.5) * cell;
    const patch = fbm2(x / 34, z / 34, 3, seed + 61) * 0.5 + 0.5;          // clumping: plants come in patches
    const nearFade = smoothstep(62, 30, dist);
    if (sand > 0.5) { if (u < 0.05 * nearFade && h > 1.6) P.place({ kind: 'ground', type: 'beachgrass', variant: rnd.int(0, 2), x, z, r: 0.5, rot: rnd.range(0, 6.28), scale: rnd.range(0.7, 1.3), spacing: 0.3, tint: rnd.f() }); continue; }
    if (rock > 0.55) { if (u < 0.02) P.place({ kind: 'shrub', type: 'lentisk', variant: rnd.int(0, 2), x, z, r: 0.6, rot: rnd.range(0, 6.28), scale: rnd.range(0.5, 0.9), spacing: 0.5, tint: rnd.f(), maxSlope: 1.1 }); continue; }
    const dens = (0.35 + 0.9 * patch) * (gravel > 0.4 ? 0.35 : 1) * (0.55 + 0.45 * nearFade);
    if (u < 0.3 * dens) {
      P.place({ kind: 'ground', type: GRASS[Math.floor(hash01(ix, iz, seed + 10) * GRASS.length)], variant: rnd.int(0, 2), x, z, r: 0.55, rot: rnd.range(0, 6.28), scale: rnd.range(0.75, 1.35), spacing: 0.15, tint: rnd.f(), maxSlope: 0.9 });
    } else if (u < 0.3 * dens + 0.075 * dens * (zone === 3 ? 0.6 : 1)) {
      const type = SHRUB[Math.floor(hash01(ix, iz, seed + 11) * SHRUB.length)];
      P.place({ kind: 'shrub', type, variant: rnd.int(0, 2), x, z, r: type === 'oleander' ? 1.0 : 0.75, rot: rnd.range(0, 6.28), scale: rnd.range(0.7, 1.3), spacing: 0.6, tint: rnd.f(), maxSlope: 0.85 });
    } else if (u > (zone === 2 ? 0.962 : 0.985) - 0.012 * patch && forest < 0.3 && dist > 6) {
      // lone trees and small groves in the open country: olives, cypresses, pines
      const pick = hash01(ix, iz, seed + 12);
      const type = zone === 0 ? (pick < 0.5 ? 'palm' : pick < 0.8 ? 'olive' : 'pine') : zone === 1 ? (pick < 0.45 ? 'pine' : pick < 0.8 ? 'olive' : 'cypress') : zone === 2 ? (pick < 0.4 ? 'olive' : pick < 0.65 ? 'cypress' : pick < 0.85 ? 'oak' : 'palm') : (pick < 0.4 ? 'olive' : pick < 0.7 ? 'cypress' : 'oak');
      P.place({ kind: 'tree', type, variant: rnd.int(0, 2), x, z, r: 0.5, rot: rnd.range(0, 6.28), scale: rnd.range(0.8, 1.2), spacing: 4.5, tint: rnd.f(), maxSlope: 0.7 });
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Z4 - coastal wood: stone pines and olives in irregular groups, with holm oaks and cypresses, an
// understorey of shrubs, and ground cover from the general flora pass. Density follows a clumping
// field (groves and clearings) and thins out away from the track.
// ---------------------------------------------------------------------------------------------
function placeForest(P) {
  const { track, sp, terrain, world } = P; const rnd = P.rng('forest'); const seed = world.seed;
  const nx = terrain.nx, nz = terrain.nz, cell = terrain.cell;
  const SHRUB = ['lentisk', 'lentisk', 'broom', 'rosemary', 'oleander'];
  for (let iz = 2; iz < nz - 2; iz++) for (let ix = 2; ix < nx - 2; ix++) {
    const id = iz * nx + ix; const ns = terrain.nearS[id]; if (ns < 0) continue;
    const i = Math.floor(ns / sp.ds) % sp.n; if (track.zone[i] !== 3 || track.bridge[i] || track.conform[i] < 1) continue;
    const dist = Math.abs(terrain.nearD[id]) - sp.half[i]; if (dist < EXCLUSION + 0.6 || dist > 118) continue;
    const h = terrain.h[id]; if (h < 1.2 || terrain.mSand[id] > 110 || terrain.mRock[id] > 150 || terrain.mPaved[id] > 90) continue;
    const x = terrain.x0 + (ix + hash01(ix, iz, seed + 81) - 0.5) * cell, z = terrain.z0 + (iz + hash01(ix, iz, seed + 82) - 0.5) * cell;
    const grove = fbm2(x / 46, z / 46, 3, seed + 71);                       // -1..1: groves and clearings
    const kind = fbm2(x / 85, z / 85, 2, seed + 73);                        // which species dominate here
    const near = dist < 40 ? 1 : dist < 78 ? 0.7 : 0.4;
    const dens = clamp(0.62 + 0.85 * grove, 0.1, 1.35) * near;
    const u = hash01(ix, iz, seed + 83);
    if (u < 0.115 * dens) {
      const pick = hash01(ix, iz, seed + 84);
      let type;
      if (kind > 0.12) type = pick < 0.7 ? 'pine' : pick < 0.86 ? 'oak' : 'cypress';             // pine wood
      else if (kind < -0.18) type = pick < 0.66 ? 'olive' : pick < 0.84 ? 'oak' : 'cypress';     // old olive terraces
      else type = pick < 0.36 ? 'pine' : pick < 0.68 ? 'olive' : pick < 0.86 ? 'oak' : 'cypress';
      const big = type === 'pine';
      P.place({ kind: 'tree', type, variant: rnd.int(0, 2), x, z, r: big ? 0.55 : 0.5, rot: rnd.range(0, 6.28), scale: rnd.range(0.82, 1.3) * (type === 'olive' ? 0.95 : 1), spacing: big ? 3.3 : 2.5, tint: rnd.f(), maxSlope: 0.8 });
    } else if (u < 0.115 * dens + 0.06 * (0.5 + 0.5 * dens)) {
      const type = SHRUB[Math.floor(hash01(ix, iz, seed + 85) * SHRUB.length)];
      P.place({ kind: 'shrub', type, variant: rnd.int(0, 2), x, z, r: 0.8, rot: rnd.range(0, 6.28), scale: rnd.range(1.1, 2.1) * (type === 'oleander' ? 0.7 : 1), spacing: 0.4, tint: rnd.f(), maxSlope: 0.9 });
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Z2 - the lookout terrace on the outside of the upper hairpin, and the lighthouse on the headland
// ---------------------------------------------------------------------------------------------
function placeCliff(P) {
  const { track, sp, terrain, world } = P; const rnd = P.rng('cliff'); const places = world.json.places || {}; const q = {};
  world.lists.decorWalls = [];
  const m = places.mirante;
  if (m) {
    const side = m.side === 'L' ? 0 : 1, sg = side ? 1 : -1; const H = (s) => sp.sampleArr(sp.half, s);
    // the paved platform of this side as written in track.json (the terrace), in lap distance
    let a = m.s, b = m.s; const wide = (s) => sp.sampleArr(track.plat[side], s) > 14 && sp.sampleArr(track.barType[side], s) > 0;
    while (wide(a - 1) && m.s - a < 60) a -= 1; while (wide(b + 1) && b - m.s < 60) b += 1;
    a += 3; b -= 3;
    const inner = (s) => H(s) + sp.sampleArr(track.barOff[side], s) + 1.0, outer = (s) => H(s) + sp.sampleArr(track.plat[side], s) - 1.6;
    world.lists.decorWalls.push({ side, from: a, to: b, off: (s) => outer(s) + 0.5 - H(s), type: 'parapet' });
    world.lists.mirante = { s: m.s, side: m.side, from: a, to: b };
    const at = (s, d) => { const p = sp.pointAt(s, sg * d, q); return { x: p.x, z: p.z, heading: p.heading }; };
    const out = (hd) => hd + sg * Math.PI / 2;     // direction pointing away from the road
    // kiosk in the middle, tables around it
    { const p = at(m.s, (inner(m.s) + outer(m.s)) / 2 + 0.5); const y = terrain.heightAt(p.x, p.z);
      P.placeBox({ kind: 'house', type: 'kiosk', variant: 1, x: p.x, y, z: p.z, rot: out(p.heading) + Math.PI, hx: 2.4, hz: 3.0, floors: 1, tint: 0.5, unit: false,
        spec: { use: 'kiosk', floors: 1, wallMat: 'plaster', wall: 0xf1ead9, trim: 0xf3ecdd, shutter: 0x2f5f8a, roof: 'hip', roofMat: 'rooftile', eaves: 0.7, pitch: 21, plinth: 0.3, feat: { awning: true, sign: 1, lantern: true }, awningTile: 1, seed: 777 } });
      for (let k = 0; k < 5; k++) { const t = at(m.s + rnd.range(-9, 9), inner(m.s) + rnd.range(0.8, 3.2)); P.place({ kind: 'prop', type: 'cafetable', variant: k % 2, ...t, r: 0.8, rot: rnd.range(0, 6.28), spacing: 0.3 }); } }
    let k = 0;
    for (let s = a + 3; s < b - 2; s += 7.5) {
      const p = at(s, outer(s) - 0.9); k++;
      if (k % 4 === 2) P.place({ kind: 'prop', type: 'telescope', ...p, r: 0.3, rot: out(p.heading) });
      else P.place({ kind: 'prop', type: 'bench', ...p, r: 0.6, rot: out(p.heading) });       // facing the view
    }
    for (let s = a + 6; s < b; s += 16) { const p = at(s, inner(s) + 0.3); P.place({ kind: 'prop', type: 'lamp', ...p, r: 0.28, rot: out(p.heading) }); }
    for (let s = a + 2; s < b; s += 11) { const p = at(s + 3.5, outer(s) - 0.7); P.place({ kind: 'prop', type: 'planter', variant: 1, ...p, r: 0.45, rot: rnd.range(0, 6.28) }); }
    for (const e of [a + 1.5, m.s, b - 1.5]) { const p = at(e, outer(e) - 0.2); P.place({ kind: 'prop', type: 'flagpole', variant: rnd.int(0, 3), ...p, r: 0.2, rot: 0 }); }
    for (const e of [a + 5, b - 5]) { const p = at(e, inner(e) + 0.2); P.place({ kind: 'prop', type: 'bin', ...p, r: 0.3, rot: 0 }); }
    { const p = at(a + 1, inner(a) + 0.6); P.place({ kind: 'prop', type: 'woodsign', variant: 0, ...p, r: 0.3, rot: p.heading + Math.PI }); }
    for (const [e, type] of [[a + 9, 'pine'], [b - 9, 'pine'], [m.s - 16, 'olive'], [m.s + 16, 'olive']]) { const p = at(e, (inner(e) + outer(e)) / 2 + 1.5); P.place({ kind: 'tree', type, variant: rnd.int(0, 2), ...p, r: 0.5, rot: rnd.range(0, 6.28), scale: rnd.range(0.85, 1.05), tint: rnd.f(), spacing: 2 }); }
  }
  const lh = places.lighthouse;
  if (lh) {
    // the flattest spot of the headland near the position written in track.json
    let best = null; const sg = lh.d < 0 ? -1 : 1;
    for (let s = lh.s - 30; s <= lh.s + 30; s += 3) for (let d = 24; d <= 64; d += 3) {
      const p = sp.pointAt(s, sg * d, q); let lo = 1e9, hi = -1e9;
      for (const [ex, ez] of [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5]]) { const h = terrain.heightAt(p.x + ex, p.z + ez); lo = Math.min(lo, h); hi = Math.max(hi, h); }
      const cost = (hi - lo) * 6 + Math.abs(s - lh.s) * 0.05 + Math.abs(d - Math.abs(lh.d)) * 0.05 - terrain.heightAt(p.x, p.z) * 0.02;
      if (hi - lo < 0.28 && (!best || cost < best.cost)) best = { cost, x: p.x, z: p.z, heading: p.heading };
    }
    if (best) {
      const y = terrain.heightAt(best.x, best.z);
      const o = P.placeBox({ kind: 'house', type: 'lighthouse', variant: 0, x: best.x, y, z: best.z, rot: best.heading - sg * Math.PI / 2, hx: 3.3, hz: 3.3, floors: 8, tint: 0.5, unit: false, landmark: true });
      world.lists.lighthouse = o;
      const c = Math.cos(o.rot), sn = Math.sin(o.rot);
      P.place({ kind: 'prop', type: 'flagpole', variant: 1, x: best.x + c * 5.5 - sn * 2.5, z: best.z + sn * 5.5 + c * 2.5, r: 0.2, rot: 0 });
      P.place({ kind: 'prop', type: 'bench', x: best.x + c * 5.2 + sn * 2.5, z: best.z + sn * 5.2 - c * 2.5, r: 0.6, rot: o.rot });
      P.place({ kind: 'prop', type: 'woodsign', variant: 3, x: best.x + c * 6.5, z: best.z + sn * 6.5, r: 0.3, rot: o.rot });
    }
  }
}

export function populateWorld(world, progress = () => {}) {
  const P = new Placer(world);
  world.lists.foamSpots = [];
  buildVillage(P);          // houses first: they reserve their plots, squares and side streets
  placeCliff(P);
  placeRocks(P);
  placeOrla(P);
  placeRoadside(P);
  placeForest(P);
  placeFlora(P);
  world.objects = P.objects;
  world.placer = P;
  return world;
}

export { inR, BT };
