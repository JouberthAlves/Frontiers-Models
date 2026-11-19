import * as T from 'three';
import { EMBANKMENT, SHOULDER, shoreline, smooth, wrap } from './course.js';

export function pointAtOffset(p, offset) {
  return [p.x + p.nx * offset, p.y + p.bank * offset, p.z + p.nz * offset];
}

export function strip(rows, { reverse = false, makeUV = (row, col) => [row, col], makeColor, skipRow = () => false } = {}) {
  const cols = rows[0].length;
  const positions = rows.flat(2);
  const tex = [], colors = [], indices = [];
  rows.forEach((row, i) => row.forEach((point, j) => {
    tex.push(...makeUV(i, j, point));
    if (makeColor) colors.push(...makeColor(i, j, point));
    if (i === rows.length - 1 || j === cols - 1 || skipRow(i)) return;
    const a = i * cols + j, b = a + 1, c = a + cols, d = c + 1;
    indices.push(...(reverse ? [a, c, b, b, c, d] : [a, b, c, b, d, c]));
  }));
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(tex, 2));
  if (makeColor) g.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function roadAndGround(course, mats = {}) {
  const group = new T.Group();
  group.name = 'Circuit and heightfield';
  const { xMin, xMax, zMin, zMax, step } = course.config.terrain;
  const grass = new T.Color(0x788466), soil = new T.Color(0xa19b74);
  const sand = new T.Color(0xc6ae86), wet = new T.Color(0x917a5d), shale = new T.Color(0x9e9887);
  const tint = (x, y, z) => {
    const coast = shoreline(x) - z;
    const variation = .5 + .28 * Math.sin(x * .032 + z * .01) + .16 * Math.cos(z * .078 - x * .015);
    const color = grass.clone().lerp(soil, variation).lerp(sand, 1 - smooth(45, 124, coast));
    color.lerp(shale, smooth(100, 400, x) * smooth(10, 23, y) * (1 - smooth(180, 235, coast)));
    color.lerp(wet, 1 - smooth(.05, 2.05, y));
    return [color.r, color.g, color.b];
  };
  const terrainMaterial = mats.terrain ?? new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const terrain = new T.Mesh(strip(Array.from({ length: course.rows }, (_, j) =>
    Array.from({ length: course.columns }, (_, i) => [xMin + i * step, course.heights[j * course.columns + i], zMin + j * step])), {
    reverse: true,
    makeUV: (_, _j, [x, _y, z]) => [x / 4, z / 4],
    makeColor: (_, _j, [x, y, z]) => tint(x, y, z),
  }), terrainMaterial);
  terrain.name = 'Raycast heightfield';
  terrain.receiveShadow = true;
  group.add(terrain);
  const points = [...course.points, course.points[0]];
  const road = new T.Mesh(strip(points.map(p => [
    pointAtOffset(p, -p.half - SHOULDER), pointAtOffset(p, p.half + SHOULDER),
  ]), {
    makeUV: (i, j) => [i * course.ds / 2.2, j * 7],
  }), mats.road ?? new T.MeshStandardMaterial({ color: 0x424348, roughness: .92 }));
  road.name = 'Raycast asphalt';
  road.receiveShadow = true;
  group.add(road);
  for (const side of [-1, 1]) {
    const verge = new T.Mesh(strip(points.map(p => EMBANKMENT.map(d => course.embankment(p, side, d))), {
      reverse: side < 0,
      makeUV: (_, _j, [x, _y, z]) => [x / 4, z / 4],
      makeColor: (_, _j, [x, y, z]) => tint(x, y, z),
      skipRow: i => course.isBridge((i+.5)*course.ds),
    }), terrainMaterial);
    verge.name = 'Attached embankment';
    verge.receiveShadow = true;
    group.add(verge);
  }
  return { group, road, terrain, bounds: [xMin, xMax, zMin, zMax] };
}

export function roadMark(course, from, to, offsets, color, material = null) {
  const first = Math.floor(from / course.ds), last = Math.ceil(to / course.ds);
  const rows = [];
  const indexAt = i => course.points[wrap(i, course.count)];
  const add = (s, point) => {
    rows.push(offsets(point, s).map(lateral => {
      const pos = pointAtOffset(point, lateral);
      pos[1] = course.roadRay(pos[0], pos[2])?.y ?? pos[1];
      return pos;
    }));
  };
  add(from, course.at(from));
  for (let i = first + 1; i < last; i++) add(i * course.ds, indexAt(i));
  add(to, course.at(to));
  const paint = material ?? new T.MeshStandardMaterial({
    color, roughness: .9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  const mesh = new T.Mesh(strip(rows), paint);
  mesh.receiveShadow = true;
  return mesh;
}

export function cameraSafe(course, camera, target) {
  const original = camera.clone();
  for (let i = 1; i <= 12; i++) {
    const f = i / 12;
    camera.copy(target).lerp(original, f);
    const ground = course.surface(camera.x, camera.z);
    if (ground && camera.y < ground.y + .29) {
      camera.y = ground.y + .31;
      return true;
    }
    if (course.obstacles.some(prop => Math.abs(prop.x - camera.x) < prop.radius + .3
      && Math.abs(prop.z - camera.z) < prop.radius + .3 && camera.y < prop.y + prop.height + .3
      && camera.y > prop.y - .35
      && Math.hypot(camera.x - prop.x, camera.z - prop.z) < prop.radius + .3)) {
      camera.copy(target).lerp(original, Math.max(.17, f - .095));
      return true;
    }
  }
  return false;
}
