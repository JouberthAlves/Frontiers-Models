// Procedural props: street and promenade furniture, beach life, rural roadside objects.
// Each builder returns the parts of one prototype grouped by scene material; they are instanced
// by render/scatter.js. Local frame: origin on the ground, +x = "front", +y up.

import * as THREE from 'three';
import { Geo } from './geo.js';
import { mulberry32 } from '../core/rng.js';

const TAU = Math.PI * 2;
const part = (mat) => ({ mat, geo: new Geo() });
const C = (g, hex, k = 1) => { const c = new THREE.Color(hex); g.color(c.r * k, c.g * k, c.b * k); return g; };
const fabricRect = (i) => [(i % 2) * 0.5 + 0.01, (i < 2 ? 0.5 : 0) + 0.01, (i % 2) * 0.5 + 0.49, (i < 2 ? 0.5 : 0) + 0.49];
const signRect = (i, j) => [i / 4 + 0.004, 1 - (j + 1) / 4 + 0.004, (i + 1) / 4 - 0.004, 1 - j / 4 - 0.004];

function lamp() {
  const iron = part('iron'), glass = part('lampglass'); const g = iron.geo;
  g.cyl(0, 0, 0, 0.2, 0.15, 0.12, 8); g.cyl(0, 0.12, 0, 0.13, 0.085, 0.75, 8, 1, false); g.cyl(0, 0.75, 0, 0.1, 0.1, 0.83, 8);
  g.cyl(0, 0.83, 0, 0.06, 0.045, 4.5, 8, 1, false);
  // swan-neck arm reaching over the pavement, lantern hanging from it
  const arm = []; for (let i = 0; i <= 8; i++) { const t = i / 8; arm.push([Math.sin(t * Math.PI * 0.5) * 0.95, 4.5 + Math.sin(t * Math.PI) * 0.55 + 0.25 * t, 0]); }
  g.tube(arm, 0.032, 6, 1, true);
  g.cyl(0.95, 4.42, 0, 0.03, 0.03, 4.75, 6);
  g.cyl(0.95, 4.36, 0, 0.2, 0.05, 4.46, 8); g.cyl(0.95, 3.98, 0, 0.09, 0.1, 4.02, 8);
  for (let k = 0; k < 4; k++) { const a = k / 4 * TAU + 0.785; g.box(0.95 + Math.cos(a) * 0.15, 4.19, Math.sin(a) * 0.15, 0.012, 0.18, 0.012); }
  glass.geo.cyl(0.95, 4.02, 0, 0.1, 0.17, 4.36, 8, 1, false);
  return [iron, glass];
}
function bench() {
  const iron = part('iron'), wood = part('wood'); const g = iron.geo;
  for (const z of [-0.78, 0.78]) { g.box(0.2, 0.22, z, 0.03, 0.22, 0.03); g.box(-0.22, 0.4, z, 0.03, 0.4, 0.03); g.box(0, 0.43, z, 0.26, 0.025, 0.03); g.box(0.22, 0.6, z, 0.025, 0.02, 0.2).box(0.2, 0.52, z, 0.02, 0.09, 0.03); }
  for (let k = 0; k < 5; k++) wood.geo.box(-0.17 + k * 0.095, 0.47, 0, 0.04, 0.016, 0.86);
  for (let k = 0; k < 3; k++) { wood.geo.push().translate(-0.25, 0.6 + k * 0.11, 0).rotateZ(-0.22).box(0, 0, 0, 0.016, 0.045, 0.86).pop(); }
  return [iron, wood];
}
function planter(v) {
  const stone = part(v === 1 ? 'plaster2' : 'concrete'), soil = part('wood'), leaves = part('leaf:flower'), parts = [stone, soil, leaves];
  const rnd = mulberry32(31 + v);
  if (v === 1) { // big terracotta pot
    C(stone.geo, 0xb8683f); stone.geo.lathe(0, 0, [[0.26, 0], [0.3, 0.04], [0.42, 0.42], [0.46, 0.62], [0.5, 0.66], [0.5, 0.72], [0.43, 0.72], [0.4, 0.62]], 14);
    C(soil.geo, 0x3a2a1c).cyl(0, 0.6, 0, 0.4, 0.4, 0.62, 12);
  } else if (v === 2) { C(stone.geo, 0xcfc6b6); stone.geo.lathe(0, 0, [[0.55, 0], [0.62, 0.1], [0.66, 0.5], [0.7, 0.56], [0.7, 0.62], [0.6, 0.62], [0.58, 0.52]], 16); C(soil.geo, 0x3a2a1c).cyl(0, 0.5, 0, 0.58, 0.58, 0.54, 14); }
  else { // rectangular stone planter with a rim
    C(stone.geo, 0xd2c8b6); stone.geo.box(0, 0.26, 0, 0.36, 0.26, 0.85).box(0, 0.55, 0, 0.4, 0.035, 0.89);
    C(soil.geo, 0x3a2a1c).box(0, 0.56, 0, 0.31, 0.03, 0.8);
  }
  // planted: a few leaf cards (uses the flowering-shrub atlas)
  const n = v === 0 ? 7 : 5, top = v === 0 ? 0.58 : 0.66;
  for (let k = 0; k < n; k++) {
    const z = v === 0 ? -0.65 + k * 0.22 : 0, a = rnd() * TAU, sz = 0.55 + rnd() * 0.3; const tile = k % 3 === 0 ? [0.5, 0.5, 1, 1] : k % 3 === 1 ? [0, 0.5, 0.5, 1] : [0, 0, 0.5, 0.5];
    const dx = Math.cos(a) * sz * 0.5, dz = Math.sin(a) * sz * 0.5;
    leaves.geo.quadUV([-dx, top, z - dz], [dx, top, z + dz], [dx, top + sz, z + dz], [-dx, top + sz, z - dz], tile);
    leaves.geo.quadUV([dz, top, z - dx], [-dz, top, z + dx], [-dz, top + sz, z + dx], [dz, top + sz, z - dx], tile);
  }
  return parts;
}
function bin() {
  const iron = part('iron'), wood = part('wood');
  iron.geo.cyl(0, 0, 0, 0.26, 0.26, 0.05, 12).cyl(0, 0.82, 0, 0.29, 0.29, 0.87, 12).cyl(0, 0.05, 0, 0.22, 0.22, 0.82, 10, 1, false);
  for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; wood.geo.push().translate(Math.cos(a) * 0.255, 0.44, Math.sin(a) * 0.255).rotateY(-a).box(0, 0, 0, 0.012, 0.38, 0.045).pop(); }
  return [iron, wood];
}
function flagpole(v) {
  const steel = part('steel'), cloth = part('fabric');
  steel.geo.cyl(0, 0, 0, 0.09, 0.06, 0.25, 8).cyl(0, 0.25, 0, 0.04, 0.028, 7.2, 8, 1, false).cyl(0, 7.2, 0, 0.06, 0.0, 7.32, 8);
  // flag: a grid so that the vertex shader can ripple it; fixed at the pole, free at the fly
  const W = 1.5, Hh = 0.95, nx = 10, ny = 4, r = fabricRect(v % 4); const g = cloth.geo; C(g, 0xffffff, 0.62); const base = g.vertexCount;
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { g.wind(Math.pow(i / nx, 1.2)); g.vert(0, 6.05 + Hh * j / ny, 0.04 + W * i / nx, 1, 0, 0, r[0] + (r[2] - r[0]) * i / nx, r[1] + (r[3] - r[1]) * j / ny); }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = base + j * (nx + 1) + i; g.idx.push(a, a + 1, a + nx + 2, a, a + nx + 2, a + nx + 1); }
  return [steel, cloth];
}
function chair(g, x, z, rot) {
  g.push().translate(x, 0, z).rotateY(rot);
  for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) g.cyl(lx, 0, lz, 0.014, 0.014, 0.45, 5, 1, false);
  g.cyl(0, 0.45, 0, 0.21, 0.21, 0.475, 10); g.cyl(-0.18, 0.47, -0.18, 0.012, 0.012, 0.88, 5, 1, false).cyl(-0.18, 0.47, 0.18, 0.012, 0.012, 0.88, 5, 1, false);
  g.box(-0.18, 0.78, 0, 0.012, 0.1, 0.19);
  g.pop();
}
function cafetable(v) {
  const metal = part('paintmetal'), cloth = part('fabric'); const g = metal.geo;
  C(g, v ? 0x2f6b4a : 0xc8c2b4);
  g.cyl(0, 0, 0, 0.26, 0.24, 0.03, 12).cyl(0, 0.03, 0, 0.03, 0.03, 0.72, 6, 1, false).cyl(0, 0.72, 0, 0.4, 0.4, 0.745, 16);
  chair(g, 0.62, 0.1, Math.PI); chair(g, -0.5, -0.4, 0.6); if (v) chair(g, -0.2, 0.62, -1.4);
  // small tablecloth disc in a striped fabric
  const r = fabricRect(v ? 3 : 1); const c = cloth.geo; const base = c.vertexCount; c.wind(0);
  c.vert(0, 0.75, 0, 0, 1, 0, (r[0] + r[2]) / 2, (r[1] + r[3]) / 2);
  for (let k = 0; k <= 16; k++) { const a = k / 16 * TAU; c.vert(Math.cos(a) * 0.3, 0.75, Math.sin(a) * 0.3, 0, 1, 0, (r[0] + r[2]) / 2 + Math.cos(a) * 0.2, (r[1] + r[3]) / 2 + Math.sin(a) * 0.2); }
  for (let k = 0; k < 16; k++) c.idx.push(base, base + k + 2, base + k + 1);
  return [metal, cloth];
}
function parasol(v) {
  const wood = part('woodgrey'), cloth = part('fabric');
  wood.geo.cyl(0, 0, 0, 0.03, 0.025, 2.35, 6).cyl(0, 0, 0, 0.24, 0.2, 0.07, 10);
  // canopy: 8 panels x 2 facets; every facet has its own apex vertex so that the stripes run radially
  const r = fabricRect(v % 4); const g = cloth.geo; const N = 16, R = 1.38, yTop = 2.36, yRim = 1.9, yMid = 2.2;
  C(g, 0xffffff, 0.8);
  const ring = (k, rad, y) => { const a = k / N * TAU; return [Math.cos(a) * rad, y + (k % 2 ? -0.035 : 0) * (rad / R), Math.sin(a) * rad]; };
  for (let k = 0; k < N; k++) {
    const u0 = r[0] + (r[2] - r[0]) * k / N, u1 = r[0] + (r[2] - r[0]) * (k + 1) / N, v0 = r[1], v1 = r[3];
    const a0 = ring(k, R, yRim), a1 = ring(k + 1, R, yRim), m0 = ring(k, R * 0.5, yMid), m1 = ring(k + 1, R * 0.5, yMid);
    const nrm = (p) => { const l = Math.hypot(p[0], p[2]) || 1; return [p[0] / l * 0.45, 0.89, p[2] / l * 0.45]; };
    const P = (p, u, vv, w) => { const n = nrm(p); g.wind(w); return g.vert(p[0], p[1], p[2], n[0], n[1], n[2], u, vv); };
    const i0 = P(a0, u0, v0, 0.3), i1 = P(a1, u1, v0, 0.3), i2 = P(m1, u1, (v0 + v1) / 2, 0.1), i3 = P(m0, u0, (v0 + v1) / 2, 0.1);
    g.idx.push(i0, i2, i1, i0, i3, i2);
    const t0 = P([0, yTop, 0], u0, v1, 0), t1 = P([0, yTop, 0], u1, v1, 0);
    g.idx.push(i3, t1, i2, i3, t0, t1);
    // scalloped valance
    g.wind(0.6); g.quadUV([a0[0], a0[1] - 0.16, a0[2]], [a1[0], a1[1] - 0.16, a1[2]], a1, a0, [u0, v0, u1, v0 + 0.04]);
  }
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; wood.geo.tube([[0, yTop - 0.05, 0], [Math.cos(a) * R * 0.98, yRim + 0.01, Math.sin(a) * R * 0.98]], 0.008, 4, 1, false); }
  return [wood, cloth];
}
function sunbed() {
  const wood = part('woodgrey'), cloth = part('fabric');
  const g = wood.geo; for (const z of [-0.3, 0.3]) { g.box(0, 0.28, z, 0.95, 0.025, 0.025); for (const x of [-0.8, 0.75]) g.box(x, 0.14, z, 0.025, 0.14, 0.025); }
  for (let k = 0; k < 9; k++) g.box(-0.85 + k * 0.16, 0.31, 0, 0.055, 0.012, 0.33);
  g.push().translate(0.42, 0.3, 0).rotateZ(0.55); for (let k = 0; k < 4; k++) g.box(0.08 + k * 0.16, 0.02, 0, 0.055, 0.012, 0.33); g.pop();
  const r = fabricRect(1); cloth.geo.wind(0);
  cloth.geo.quadUV([-0.9, 0.34, 0.3], [0.42, 0.34, 0.3], [0.42, 0.34, -0.3], [-0.9, 0.34, -0.3], r);
  return [wood, cloth];
}
function slatfence(v) {
  const wood = part('woodgrey'); const g = wood.geo; const rnd = mulberry32(700 + v);
  // 2.4 m of sand fence: thin uneven pickets wired together, leaning a little
  for (let k = 0; k < 17; k++) {
    const z = -1.2 + k * 0.15 + (rnd() - 0.5) * 0.03, h = 1.02 + rnd() * 0.22, lean = (rnd() - 0.5) * 0.14;
    C(g, 0xffffff, 0.75 + rnd() * 0.3);
    g.push().translate(0, -0.15, z).rotateZ(lean).rotateX((rnd() - 0.5) * 0.1).box(0, h / 2, 0, 0.011, h / 2, 0.026).pop();
  }
  C(g, 0x6c6258); g.box(0.014, 0.42, 0, 0.004, 0.004, 1.2).box(0.014, 0.82, 0, 0.004, 0.004, 1.2);
  for (const z of [-1.2, 1.2]) { C(g, 0xd8d0c0); g.cyl(0, -0.3, z, 0.035, 0.03, 1.28, 6); }
  return [wood];
}
function boat(v) {
  const hull = part('woodblue'), inner = part('woodgrey'); const g = hull.geo; const tint = [0xffffff, 0xe9d9c2, 0xd0e4d8][v % 3];
  // lofted hull: stations along x with a rounded V section, pointed bow, transom stern
  const L = 4.3, NS = 9, NC = 7; const st = [];
  for (let i = 0; i <= NS; i++) {
    const t = i / NS; const x = -L / 2 + L * t; const beam = 0.82 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.16 + t * 0.92) * 0.5 + (t > 0.55 ? 0 : 0)), 0.9) * (t > 0.6 ? Math.pow(Math.max(0, 1 - (t - 0.6) / 0.4), 0.62) : 1);
    const sheer = 0.62 + 0.3 * Math.pow(t, 2.2); const keel = 0.05 + 0.5 * Math.pow(Math.max(0, t - 0.72) / 0.28, 2);
    const row = []; for (let c = 0; c <= NC * 2; c++) { const u = c / (NC * 2) * 2 - 1; const a = Math.abs(u); row.push([x, keel + (sheer - keel) * Math.pow(a, 1.7), Math.sign(u) * beam * Math.pow(a, 0.75)]); }
    st.push(row);
  }
  C(g, tint);
  for (let i = 0; i < NS; i++) for (let c = 0; c < NC * 2; c++) g.quad(st[i][c], st[i][c + 1], st[i + 1][c + 1], st[i + 1][c], 1);
  // inside surface (slightly inset), gunwale, thwarts, transom
  C(inner.geo, 0xb9b0a0);
  for (let i = 0; i < NS; i++) for (let c = 0; c < NC * 2; c++) { const q = (p) => [p[0], p[1] + 0.035, p[2] * 0.94]; inner.geo.quad(q(st[i][c + 1]), q(st[i][c]), q(st[i + 1][c]), q(st[i + 1][c + 1]), 1); }
  C(g, [0x1e4f8a, 0xa02c22, 0x1f6b4c][v % 3]);
  for (let i = 0; i < NS; i++) for (const c of [0, NC * 2]) { const a = st[i][c], b = st[i + 1][c]; const sgn = c === 0 ? -1 : 1; g.quad([a[0], a[1] + 0.03, a[2] + sgn * 0.03], [b[0], b[1] + 0.03, b[2] + sgn * 0.03], [b[0], b[1] - 0.09, b[2] + sgn * 0.012], [a[0], a[1] - 0.09, a[2] + sgn * 0.012], 1); g.quad([b[0], b[1] + 0.03, b[2] + sgn * 0.03], [a[0], a[1] + 0.03, a[2] + sgn * 0.03], [a[0], a[1] + 0.03, a[2] * 0.93], [b[0], b[1] + 0.03, b[2] * 0.93], 1); }
  for (let c = 0; c < NC * 2; c++) g.quad(st[0][c + 1], st[0][c], [st[0][c][0], 0.66, st[0][c][2]], [st[0][c + 1][0], 0.66, st[0][c + 1][2]], 1);
  for (const x of [-1.0, 0.25]) inner.geo.box(x, 0.46, 0, 0.11, 0.02, 0.66);
  return [hull, inner];
}
function lifeguard() {
  const wood = part('woodgrey'), cloth = part('fabric'); const g = wood.geo;
  C(g, 0xf0ece2);
  for (const [x, z] of [[-1.05, -1.05], [1.05, -1.05], [-1.05, 1.05], [1.05, 1.05]]) g.push().translate(x, 0, z).rotateZ(-x * 0.07).rotateX(z * 0.07).box(0, 1.15, 0, 0.07, 1.3, 0.07).pop();
  for (let k = 0; k < 11; k++) g.box(0, 2.28, -1.15 + k * 0.23, 1.25, 0.03, 0.105);
  // cabin walls of planks with an opening towards the sea (+x)
  C(g, 0xe9e3d4);
  for (let k = 0; k < 9; k++) { const y = 2.42 + k * 0.2; g.box(-0.95, y, 0, 0.025, 0.095, 0.95); g.box(-0.02, y, -0.95, 0.93, 0.095, 0.025); g.box(-0.02, y, 0.95, 0.93, 0.095, 0.025); if (k < 3) g.box(0.9, y, 0, 0.025, 0.095, 0.95); }
  for (const z of [-0.95, 0.95]) g.box(0.9, 3.4, z, 0.04, 0.9, 0.04);
  // pitched roof and a red band
  C(g, 0xb23a2c);
  g.quad([-1.2, 4.2, -1.15], [-1.2, 4.2, 1.15], [0.05, 4.75, 1.15], [0.05, 4.75, -1.15], 1).quad([1.3, 4.2, 1.15], [1.3, 4.2, -1.15], [0.05, 4.75, -1.15], [0.05, 4.75, 1.15], 1);
  g.quad([-1.2, 4.2, 1.15], [1.3, 4.2, 1.15], [0.05, 4.75, 1.15], [0.05, 4.75, 1.15], 1).quad([1.3, 4.2, -1.15], [-1.2, 4.2, -1.15], [0.05, 4.75, -1.15], [0.05, 4.75, -1.15], 1);
  // railing and ramp
  C(g, 0xf0ece2);
  for (const z of [-1.15, 1.15]) { g.box(1.15, 2.8, z, 0.03, 0.5, 0.03); } g.box(1.22, 3.25, 0, 0.03, 0.03, 1.15).box(1.22, 2.8, 0, 0.02, 0.02, 1.15);
  g.push().translate(-2.25, 1.15, 0).rotateZ(0.72); for (let k = 0; k < 9; k++) g.box(-1.4 + k * 0.36, 0, 0, 0.04, 0.02, 0.45); g.box(0, -0.03, -0.45, 1.6, 0.04, 0.03).box(0, -0.03, 0.45, 1.6, 0.04, 0.03); g.pop();
  // flag
  g.cyl(0.05, 4.75, 0, 0.02, 0.02, 5.9, 5);
  const r = fabricRect(0); const c = cloth.geo; c.wind(0.2); c.quadUV([0.05, 5.4, 0.02], [0.05, 5.4, 0.72], [0.05, 5.85, 0.72], [0.05, 5.85, 0.02], r);
  return [wood, cloth];
}
function sign(v) {
  const steel = part('steel'), face = part('signs');
  steel.geo.cyl(0, 0, 0, 0.035, 0.035, 2.5, 6);
  const tiles = [[0, 0], [2, 0], [0, 1], [1, 1], [1, 0], [3, 0]]; const t = tiles[v % tiles.length]; const r = signRect(t[0], t[1]);
  const wide = t[1] === 0 && t[0] < 2; const w = wide ? 0.8 : 0.36, h = 0.36, y = 2.1;
  face.geo.quadUV([0.04, y - h, -w], [0.04, y - h, w], [0.04, y + h, w], [0.04, y + h, -w], r);
  steel.geo.quad([0.035, y - h, w], [0.035, y - h, -w], [0.035, y + h, -w], [0.035, y + h, w], 1);
  return [steel, face];
}
function woodsign(v) {
  const wood = part('wood'), face = part('signs');
  wood.geo.cyl(0, -0.2, 0, 0.06, 0.05, 2.0, 6);
  const t = [[2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2]][v % 6]; const r = signRect(t[0], t[1]); const rr2 = [r[0], r[1] + (r[3] - r[1]) * 0.2, r[2], r[1] + (r[3] - r[1]) * 0.8];
  wood.geo.box(0.07, 1.55, 0.1, 0.02, 0.2, 0.62);
  face.geo.quadUV([0.095, 1.36, -0.5], [0.095, 1.36, 0.7], [0.095, 1.74, 0.7], [0.095, 1.74, -0.5], rr2);
  return [wood, face];
}
function bollardstone() { const s = part('stoneblock'); s.geo.cyl(0, -0.2, 0, 0.17, 0.13, 0.62, 8, 1, false).cyl(0, 0.62, 0, 0.15, 0.15, 0.7, 8, 1, false).lathe(0, 0, [[0.15, 0.7], [0.12, 0.78], [0.06, 0.83], [0.001, 0.845]], 8); return [s]; }
function milestone(v) { const s = part('stoneblock'); const g = s.geo; C(g, v % 2 ? 0xffffff : 0xe8ded0); for (let k = 0; k < 6; k++) { const a0 = k / 6 * Math.PI, a1 = (k + 1) / 6 * Math.PI; g.quad([0.07, 0.42 + Math.sin(a0) * 0.2, -Math.cos(a0) * 0.2], [0.07, 0.42 + Math.sin(a1) * 0.2, -Math.cos(a1) * 0.2], [-0.07, 0.42 + Math.sin(a1) * 0.2, -Math.cos(a1) * 0.2], [-0.07, 0.42 + Math.sin(a0) * 0.2, -Math.cos(a0) * 0.2], 1); g.quad([0.07, 0.42, 0], [0.07, 0.42 + Math.sin(a0) * 0.2, -Math.cos(a0) * 0.2], [0.07, 0.42 + Math.sin(a1) * 0.2, -Math.cos(a1) * 0.2], [0.07, 0.42, 0], 1); g.quad([-0.07, 0.42, 0], [-0.07, 0.42 + Math.sin(a1) * 0.2, -Math.cos(a1) * 0.2], [-0.07, 0.42 + Math.sin(a0) * 0.2, -Math.cos(a0) * 0.2], [-0.07, 0.42, 0], 1); } g.box(0, 0.1, 0, 0.07, 0.32, 0.2, 1, '+y'); return [s]; }
function crate(v) {
  const wood = part('wood'); const g = wood.geo; const rnd = mulberry32(50 + v);
  const one = (x, y, z, s, rot) => { g.push().translate(x, y, z).rotateY(rot); C(g, 0xffffff, 0.8 + rnd() * 0.25); g.box(0, s, 0, s, s, s); C(g, 0xd9c8a8, 0.9); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.box(a * s, s, b * s, 0.03, s + 0.01, 0.03); g.box(a * s, b * s + s, 0, 0.03, 0.03, s + 0.01); g.box(0, a * s + s, b * s, s + 0.01, 0.03, 0.03); } g.pop(); };
  one(0, 0, 0, 0.4, 0.2); one(0.75, 0, 0.35, 0.32, -0.3); if (v % 2) one(0.1, 0.8, 0.05, 0.3, 0.6);
  return [wood];
}
function barrel(v) {
  const wood = part('wood'), iron = part('iron');
  const one = (x, z) => { wood.geo.lathe(x, z, [[0.001, 0], [0.27, 0], [0.33, 0.3], [0.345, 0.47], [0.33, 0.64], [0.27, 0.94], [0.001, 0.94]], 12); for (const y of [0.1, 0.34, 0.6, 0.84]) { const r = 0.275 + 0.07 * Math.sin(Math.PI * y / 0.94); iron.geo.cyl(x, y - 0.02, z, r + 0.004, r + 0.004, y + 0.02, 12, 1, false); } };
  one(0, 0); if (v % 2) one(0.72, 0.2); if (v === 3) one(0.3, -0.7);
  return [wood, iron];
}
function utilitypole(v) {
  const wood = part('wood'), iron = part('iron'); const g = wood.geo;
  C(g, 0x8b7558); g.cyl(0, -0.4, 0, 0.15, 0.1, 8.6, 8);
  g.box(0, 7.9, 0, 0.05, 0.06, 1.1); g.box(0, 7.3, 0, 0.045, 0.05, 0.8);
  g.push().translate(0, 7.55, 0.5).rotateX(0.75).box(0, 0, 0, 0.02, 0.38, 0.03).pop(); g.push().translate(0, 7.55, -0.5).rotateX(-0.75).box(0, 0, 0, 0.02, 0.38, 0.03).pop();
  for (const z of [-0.95, -0.45, 0.45, 0.95]) iron.geo.cyl(0, 7.96, z, 0.035, 0.02, 8.12, 6);
  for (const z of [-0.65, 0.65]) iron.geo.cyl(0, 7.35, z, 0.03, 0.02, 7.48, 6);
  if (v % 2 === 0) { iron.geo.cyl(0.26, 6.2, 0, 0.2, 0.2, 6.95, 10); iron.geo.box(0.12, 6.55, 0, 0.1, 0.03, 0.04); }
  if (v === 1) { iron.geo.tube([[0, 6.6, 0], [0.55, 6.75, 0], [0.9, 6.6, 0]], 0.02, 5, 1, true); iron.geo.cyl(0.9, 6.42, 0, 0.13, 0.06, 6.6, 8); }
  return [wood, iron];
}
function cairn(v) {
  const rock = part('rock'); const rnd = mulberry32(88 + v); const g = rock.geo; let y = 0;
  for (let k = 0; k < 5 + v % 3; k++) { const r = 0.34 - k * 0.045 + rnd() * 0.05; g.push().translate((rnd() - 0.5) * 0.12, y, (rnd() - 0.5) * 0.12).rotateY(rnd() * 6).scale(1, 0.62, 1); g.lathe(0, 0, [[0.001, 0], [r * 0.8, 0.02], [r, r * 0.5], [r * 0.75, r * 0.95], [0.001, r]], 7); g.pop(); y += r * 0.56; }
  return [rock];
}
function trough() {
  const s = part('stoneblock'), w = part('water_still'); const g = s.geo;
  g.box(0, 0.3, 0, 0.42, 0.3, 0.95, 1, '+y'); g.box(0.36, 0.63, 0, 0.06, 0.03, 0.95).box(-0.36, 0.63, 0, 0.06, 0.03, 0.95).box(0, 0.63, 0.89, 0.3, 0.03, 0.06).box(0, 0.63, -0.89, 0.3, 0.03, 0.06);
  g.quad([-0.3, 0.6, -0.83], [-0.3, 0.6, 0.83], [-0.3, 0.3, 0.83], [-0.3, 0.3, -0.83], 1).quad([0.3, 0.6, 0.83], [0.3, 0.6, -0.83], [0.3, 0.3, -0.83], [0.3, 0.3, 0.83], 1);
  w.geo.quad([-0.3, 0.52, 0.83], [0.3, 0.52, 0.83], [0.3, 0.52, -0.83], [-0.3, 0.52, -0.83], 1);
  return [s, w];
}
function logpile(v) {
  const bark = part('bark:pine_bark'), end = part('wood'); const rnd = mulberry32(60 + v);
  const rows = [[0, 4], [1, 3], [2, 2]]; let n = 0;
  for (const [row, count] of rows) for (let k = 0; k < count; k++) {
    const r = 0.16 + rnd() * 0.05, z = (k - (count - 1) / 2) * 0.36, y = 0.17 + row * 0.29, len = 1.0 + rnd() * 0.25;
    bark.geo.push().translate(0, y, z).rotateZ(Math.PI / 2).cyl(0, -len, 0, r, r, len, 8, 1, false).pop();
    for (const sx of [-1, 1]) { C(end.geo, 0xe2c79a, 0.85 + rnd() * 0.2); const base = end.geo.vertexCount; end.geo.vert(sx * len, y, z, sx, 0, 0, 0.5, 0.5); for (let q = 0; q <= 8; q++) { const a = q / 8 * TAU; end.geo.vert(sx * len, y + Math.cos(a) * r, z + Math.sin(a) * r, sx, 0, 0, 0.5 + Math.cos(a) * 0.1, 0.5 + Math.sin(a) * 0.1); } for (let q = 0; q < 8; q++) { if (sx > 0) end.geo.idx.push(base, base + q + 1, base + q + 2); else end.geo.idx.push(base, base + q + 2, base + q + 1); } }
    n++;
  }
  return [bark, end];
}

function fountain() {
  const st = part('stoneblock'), w = part('water_still'); const g = st.geo;
  // basin wall (outside, rim, inside), floor, pedestal with an upper bowl and a finial
  g.lathe(0, 0, [[2.25, -0.3], [2.25, 0.1], [2.18, 0.16], [2.18, 0.5], [2.28, 0.56], [2.28, 0.66], [1.92, 0.66], [1.92, 0.2], [0.001, 0.2]], 20);
  g.lathe(0, 0, [[0.5, 0.2], [0.42, 0.34], [0.3, 0.5], [0.24, 1.15], [0.34, 1.3], [0.86, 1.52], [0.9, 1.6], [0.8, 1.6], [0.3, 1.5], [0.16, 1.62], [0.13, 2.05], [0.2, 2.16], [0.12, 2.3], [0.001, 2.36]], 14);
  const disc = (y, r) => { const c = w.geo; const base = c.vertexCount; c.vert(0, y, 0, 0, 1, 0, 0.5, 0.5); for (let k = 0; k <= 20; k++) { const a = k / 20 * TAU; c.vert(Math.cos(a) * r, y, Math.sin(a) * r, 0, 1, 0, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5); } for (let k = 0; k < 20; k++) c.idx.push(base, base + k + 2, base + k + 1); };
  disc(0.52, 1.93); disc(1.57, 0.8);
  return [st, w];
}
function stall(v) {
  const wood = part('wood'), cloth = part('fabric'), goods = part('plaster2'); const g = wood.geo; const rnd = mulberry32(210 + v);
  for (const [x, z] of [[-0.6, -1.15], [0.6, -1.15], [-0.6, 1.15], [0.6, 1.15]]) g.box(x, 1.12, z, 0.035, 1.12, 0.035);
  g.box(0, 0.86, 0, 0.62, 0.025, 1.2).box(0, 0.42, 0, 0.55, 0.02, 1.1);
  const r = fabricRect(v % 4); const c = cloth.geo; C(c, 0xffffff, 0.8); c.wind(0.2);
  c.quadUV([0.95, 2.02, 1.4], [0.95, 2.02, -1.4], [-0.75, 2.38, -1.4], [-0.75, 2.38, 1.4], r);
  c.wind(0.6); c.quadUV([0.95, 1.84, 1.4], [0.95, 1.84, -1.4], [0.95, 2.02, -1.4], [0.95, 2.02, 1.4], [r[0], r[1], r[2], r[1] + 0.05]);
  // crates of produce on the table
  const cols = [0xd9862a, 0xb8322a, 0x7fa23a, 0xe2c23a, 0x8a4a6a];
  for (let k = 0; k < 5; k++) { const z = -0.95 + k * 0.47; C(g, 0xffffff, 0.9); g.box(0.1, 0.95, z, 0.26, 0.07, 0.2); C(goods.geo, cols[(k + v) % 5], 0.9 + rnd() * 0.2); goods.geo.box(0.1, 1.04, z, 0.23, 0.045, 0.17); }
  return [wood, cloth, goods];
}
function clothesline(v) {
  const iron = part('iron'), cloth = part('fabric'); const rnd = mulberry32(330 + v); const hw = 2.25, y = 4.3;
  for (const z of [-hw, hw]) iron.geo.cyl(0, 0, z, 0.03, 0.025, y + 0.1, 6);
  const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([0, y - 0.22 * Math.sin(Math.PI * t), -hw + 2 * hw * t]); }
  iron.geo.tube(pts, 0.008, 4, 1, false);
  const g = cloth.geo; let z = -hw + 0.35;
  while (z < hw - 0.6) {
    const w = 0.45 + rnd() * 0.55, h = 0.55 + rnd() * 0.6, t = (z + w / 2 + hw) / (2 * hw), top = y - 0.22 * Math.sin(Math.PI * t) - 0.01;
    const r = fabricRect(Math.floor(rnd() * 4)); const plain = rnd() < 0.5; C(g, plain ? 0xf2efe6 : 0xffffff, plain ? 1 : 0.75);
    const rr2 = plain ? [r[0] + 0.07, r[1] + 0.02, r[0] + 0.1, r[1] + 0.05] : [r[0], r[1], r[0] + (r[2] - r[0]) * 0.5, r[1] + (r[3] - r[1]) * 0.5];
    g.wind(0.05); const i0 = g.vert(0, top, z, 1, 0, 0, rr2[0], rr2[3]), i1 = g.vert(0, top, z + w, 1, 0, 0, rr2[2], rr2[3]);
    g.wind(0.9); const i2 = g.vert(0, top - h, z + w, 1, 0, 0, rr2[2], rr2[1]), i3 = g.vert(0, top - h, z, 1, 0, 0, rr2[0], rr2[1]);
    g.idx.push(i0, i3, i2, i0, i2, i1);
    z += w + 0.12 + rnd() * 0.25;
  }
  return [iron, cloth];
}

function delineator(v) {
  // roadside reflector post: white, black band, red or amber reflector towards the traffic
  const p = part('paintmetal'), sg = part('signs'); const g = p.geo;
  C(g, 0xe8e6de); g.box(0, 0.45, 0, 0.035, 0.6, 0.055);
  C(g, 0x151515); g.box(0, 0.84, 0, 0.037, 0.09, 0.057);
  C(g, v % 2 ? 0xd8a020 : 0xc8261c, 1.2); g.box(0.04, 0.84, 0, 0.004, 0.05, 0.03);
  return [p];
}
function pile(v) {
  // mooring pile / net stake: unit height, scaled to the depth of the water where it stands
  const w = part('woodgrey'); const g = w.geo; C(g, 0x8a7a66);
  g.cyl(0, 0, 0, 0.13, 0.11, 0.9, 8, 1, false);
  C(g, [0xd8d4c8, 0xb8382c, 0x2c5f8a][v % 3]); g.cyl(0, 0.9, 0, 0.115, 0.1, 1.0, 8);
  return [w];
}
function telescope() {
  // coin-operated viewer of the lookout
  const m = part('paintmetal'), ir = part('iron'); const g = m.geo;
  ir.geo.cyl(0, 0, 0, 0.17, 0.13, 0.06, 10).cyl(0, 0.06, 0, 0.05, 0.045, 1.25, 8, 1, false);
  C(g, 0x2f5f8a); g.push().translate(0, 1.42, 0).rotateZ(0.12).box(0, 0, 0, 0.2, 0.13, 0.17).pop();
  C(g, 0x1a1a1a); for (const z of [-0.08, 0.08]) g.push().translate(0.2, 1.45, z).rotateZ(-Math.PI / 2 + 0.12).cyl(0, 0, 0, 0.05, 0.06, 0.1, 8).pop();
  return [m, ir];
}

export const PROP_BUILDERS = {
  delineator: { build: delineator, variants: 2, max: [120, 300], shadow: 30 },
  pile: { build: pile, variants: 3, max: [200, 700], shadow: 60 },
  telescope: { build: telescope, variants: 1, max: [120, 300], shadow: 40 },
  fountain: { build: fountain, variants: 1, max: [200, 700], shadow: 120 },
  stall: { build: stall, variants: 4, max: [140, 420], shadow: 80 },
  clothesline: { build: clothesline, variants: 3, max: [140, 420], shadow: 60 },
  lamp: { build: lamp, variants: 1, max: [140, 520], shadow: 120 },
  bench: { build: bench, variants: 1, max: [110, 300], shadow: 60 },
  planter: { build: planter, variants: 3, max: [110, 320], shadow: 60 },
  bin: { build: bin, variants: 1, max: [90, 220], shadow: 40 },
  flagpole: { build: flagpole, variants: 4, max: [160, 600], shadow: 140 },
  cafetable: { build: cafetable, variants: 2, max: [100, 260], shadow: 50 },
  parasol: { build: parasol, variants: 4, max: [150, 520], shadow: 110 },
  sunbed: { build: sunbed, variants: 1, max: [100, 260], shadow: 40 },
  slatfence: { build: slatfence, variants: 3, max: [130, 380], shadow: 60 },
  boat: { build: boat, variants: 3, max: [170, 600], shadow: 90 },
  lifeguard: { build: lifeguard, variants: 1, max: [260, 900], shadow: 200 },
  sign: { build: sign, variants: 6, max: [140, 420], shadow: 60 },
  woodsign: { build: woodsign, variants: 6, max: [130, 380], shadow: 60 },
  bollardstone: { build: bollardstone, variants: 1, max: [110, 300], shadow: 40 },
  milestone: { build: milestone, variants: 2, max: [100, 260], shadow: 30 },
  crate: { build: crate, variants: 2, max: [110, 300], shadow: 50 },
  barrel: { build: barrel, variants: 4, max: [110, 300], shadow: 50 },
  utilitypole: { build: utilitypole, variants: 3, max: [220, 800], shadow: 200 },
  cairn: { build: cairn, variants: 3, max: [110, 300], shadow: 40 },
  trough: { build: trough, variants: 1, max: [110, 300], shadow: 40 },
  logpile: { build: logpile, variants: 2, max: [130, 380], shadow: 60 },
};
