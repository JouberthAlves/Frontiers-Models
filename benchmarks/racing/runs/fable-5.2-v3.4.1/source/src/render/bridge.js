// The bridge of Z4: a stone viaduct of five arches over the inlet, generated from the bridge span
// of track.json. Deck level, width and parapets come from the road data (the parapets themselves
// are barriers, built by barriers-view.js); the piers go down to the sea bed read from the height
// field, and the abutments run into the banks so that the bridge is tied to the terrain.

import * as THREE from 'three';
import { Geo } from './geo.js';
import { proxyMesh, mergeForShadow } from './shadow-proxy.js';

const ARCHES = 5, PIER_W = 3.0, SPRING = -7.6, RISE = 5.9, ABUT = 7.0, SEG = 18;

export function buildBridge(world, SM) {
  const br = world.json.bridge; if (!br) return null;
  const track = world.track, sp = track.spline, terrain = world.terrain;
  const group = new THREE.Group(); group.name = 'bridge';
  const s0 = br.from - ABUT, s1 = br.to + ABUT; const q = {};
  const W = (s) => sp.sampleArr(sp.half, s) + sp.sampleArr(track.barOff[1], s) + 0.5;
  /** world point of the side face `sg` at lap distance s, v metres above the road level */
  const at = (s, sg, v) => { const p = sp.pointAt(s, sg * W(s), q); return [p.x, track.planeHeight(p.i, p.t, sg * W(s)) + v, p.z]; };
  const groundV = (s, sg) => { const p = sp.pointAt(s, sg * W(s), q); return terrain.heightAt(p.x, p.z) - p.y; };
  // openings between the supports
  const a0 = br.from + 1.5, a1 = br.to - 1.5; const clear = (a1 - a0 - (ARCHES - 1) * PIER_W) / ARCHES;
  const openings = []; for (let k = 0; k < ARCHES; k++) { const a = a0 + k * (clear + PIER_W); openings.push([a, a + clear]); }
  const arc = (a, b, k) => { const t = k / SEG * Math.PI; return [(a + b) / 2 - Math.cos(t) * (b - a) / 2, SPRING + Math.sin(t) * RISE]; };
  const stone = new Geo(), block = new Geo();

  for (const sg of [1, -1]) {
    // depth of each support on this side: a metre into the ground under its footprint
    const bottom = (sa, sb) => { let m = 1e9; for (let s = sa; s <= sb + 1e-6; s += (sb - sa) / 4) m = Math.min(m, groundV(s, sg), groundV(s, -sg)); return Math.min(m - 1.2, SPRING - 0.5); };
    const pts = [[s0, -0.06], [s1, -0.06]];                    // top edge (the parapet stands on it)
    // back along the underside, from the far abutment to the near one
    let prevEdge = s1;
    for (let k = ARCHES - 1; k >= -1; k--) {
      const sa = k >= 0 ? openings[k][1] : s0; const b = bottom(sa, prevEdge);
      pts.push([prevEdge, b], [sa, b]);                         // foot of the support
      if (k < 0) break;
      const [a, bb] = openings[k]; for (let j = SEG; j >= 0; j--) pts.push(arc(a, bb, j));   // over the opening
      prevEdge = a;
    }
    // side face
    const shape = new THREE.Shape(pts.map(([s, v]) => new THREE.Vector2(sg > 0 ? s - s0 : s1 - s, v)));
    const sgm = new THREE.ShapeGeometry(shape); const pos = sgm.attributes.position, idx = sgm.index; const base = stone.vertexCount;
    const pr = sp.pointAt(br.from, 0, q); const nx = pr.hx * sg, nz = pr.hz * sg;
    for (let i = 0; i < pos.count; i++) { const u = pos.getX(i), v = pos.getY(i); const w = at(sg > 0 ? s0 + u : s1 - u, sg, v); stone.vert(w[0], w[1], w[2], nx, 0, nz, u, v); }
    for (let i = 0; i < idx.count; i += 3) stone.tri(base + idx.getX(i), base + idx.getX(i + 1), base + idx.getX(i + 2));
    sgm.dispose();
    // voussoir ring of each arch and the string course under the parapet, standing proud of the face
    const out = (p, d) => [p[0] + nx * d, p[1], p[2] + nz * d];
    for (const [a, b] of openings) for (let j = 0; j < SEG; j++) {
      const p0 = arc(a, b, j), p1 = arc(a, b, j + 1); const cx = (a + b) / 2;
      const grow = (p) => { const dx = p[0] - cx, dy = p[1] - SPRING, l = Math.hypot(dx / ((b - a) / 2), dy / RISE) || 1; return [p[0] + dx / l / ((b - a) / 2) * 0.55, p[1] + dy / l / RISE * 0.55]; };
      const g0 = grow(p0), g1 = grow(p1);
      const A = out(at(p0[0], sg, p0[1]), 0.07), B = out(at(p1[0], sg, p1[1]), 0.07), C = out(at(g1[0], sg, g1[1]), 0.07), D = out(at(g0[0], sg, g0[1]), 0.07);
      if (sg > 0) block.quad(A, B, C, D, 1); else block.quad(B, A, D, C, 1);
    }
    for (let s = s0; s < s1 - 0.01; s += 4) { const e = Math.min(s1, s + 4);
      const A = out(at(s, sg, -0.42), 0.1), B = out(at(e, sg, -0.42), 0.1), C = out(at(e, sg, -0.1), 0.1), D = out(at(s, sg, -0.1), 0.1);
      if (sg > 0) block.quad(A, B, C, D, 1); else block.quad(B, A, D, C, 1);
      const A2 = at(s, sg, -0.42), B2 = at(e, sg, -0.42); if (sg > 0) block.quad(A2, B2, B, A, 1); else block.quad(B2, A2, A, B, 1); }
  }
  // underside of the arches and the inner faces of the piers, across the full width
  const face = (A, B, C, D, towards) => { // orient the quad so that it faces `towards`
    const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = D[0] - A[0], vy = D[1] - A[1], vz = D[2] - A[2];
    const n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx]; const d = (towards[0] - A[0]) * n[0] + (towards[1] - A[1]) * n[1] + (towards[2] - A[2]) * n[2];
    if (d >= 0) stone.quad(A, B, C, D, 1); else stone.quad(B, A, D, C, 1);
  };
  for (const [a, b] of openings) {
    const mid = at((a + b) / 2, 0.001, SPRING - 2);
    for (let j = 0; j < SEG; j++) { const p0 = arc(a, b, j), p1 = arc(a, b, j + 1); face(at(p0[0], 1, p0[1]), at(p1[0], 1, p1[1]), at(p1[0], -1, p1[1]), at(p0[0], -1, p0[1]), mid); }
    for (const s of [a, b]) { const bt = Math.min(groundV(s, 1), groundV(s, -1)) - 6; face(at(s, 1, bt), at(s, 1, SPRING), at(s, -1, SPRING), at(s, -1, bt), mid); }
  }
  const add = (g, key) => { const mat = SM.get(key); if (mat.vertexColors && !g.col) g.color(1, 1, 1); const m = new THREE.Mesh(g.build(), mat); m.receiveShadow = true; m.castShadow = false; m.matrixAutoUpdate = false; m.name = 'bridge_' + key; m.userData.kind = 'bridge'; group.add(m); return m; };
  add(stone, 'stone'); add(block, 'stoneblock');
  const px = proxyMesh(mergeForShadow([{ position: stone.p, index: stone.idx }])); group.add(px);
  group.userData.stats = { arches: ARCHES, span: +(br.to - br.from).toFixed(1), clearSpan: +clear.toFixed(1), triangles: stone.triangleCount + block.triangleCount };
  return group;
}
