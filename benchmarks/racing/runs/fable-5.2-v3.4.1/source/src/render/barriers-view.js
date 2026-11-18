// Barriers: the visible side of the collision lines. Every barrier is generated from the very
// same per-sample arrays the physics uses (track.barOff / track.barType), so what the car hits
// is what the player sees. Profiles are given as [offset beyond the collision line, height above
// the road plane]: offset 0 is the face the cars touch, positive offsets go away from the road.

import * as THREE from 'three';
import { Geo } from './geo.js';
import { BARRIER_TYPES } from '../world/track.js';
import { hash01, fbm2 } from '../core/rng.js';
import { smoothstep } from '../core/math.js';
import { proxyMesh, mergeForShadow } from './shadow-proxy.js';

const PIECE = 60;   // metres of barrier per static mesh (culling granularity)

const JERSEY = [[0.60, -0.35], [0.60, 0.075], [0.425, 0.28], [0.385, 0.78], [0.365, 0.81], [0.235, 0.81], [0.215, 0.78], [0.175, 0.28], [0.0, 0.075], [0.0, -0.35]];
const WBEAM = [[0.085, 0.79], [0.03, 0.775], [0.0, 0.74], [0.0, 0.70], [0.05, 0.655], [0.075, 0.635], [0.05, 0.615], [0.0, 0.57], [0.0, 0.53], [0.03, 0.495], [0.085, 0.48]];
const DRYSTONE = [[0.62, -0.5], [0.6, 0.3], [0.53, 0.8], [0.44, 1.0], [0.31, 1.06], [0.18, 1.0], [0.08, 0.8], [0.0, 0.3], [0.0, -0.45]];
const ROCK_OFF = [0.02, 0.12, 0.38, 0.7, 1.1, 1.7, 2.6, 3.8, 5.2, 6.6];

/** copy of a frame list whose two ends are pulled in by `gap` metres (joints between blocks) */
function trimEnds(frames, gap) {
  const out = frames.map((f) => ({ ...f }));
  const pull = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z; const t = Math.min(0.45, gap / (Math.hypot(dx, dz) || 1)); a.x += dx * t; a.y += dy * t; a.z += dz * t; };
  pull(out[0], out[1]); pull(out[out.length - 1], out[out.length - 2]);
  return out;
}

/** closes the end of a swept profile; sign +1 faces along the path, -1 against it */
function capFan(g, f, profile, sign) {
  const tx = f.rz * sign, tz = -f.rx * sign;      // path direction: T x up = outward axis
  let co = 0, ch = 0; for (const p of profile) { co += p[0]; ch += p[1]; } co /= profile.length; ch /= profile.length;
  const base = g.vertexCount;
  g.vert(f.x + f.rx * co, f.y + ch, f.z + f.rz * co, tx, 0, tz, co, ch);
  for (const p of profile) g.vert(f.x + f.rx * p[0], f.y + p[1], f.z + f.rz * p[0], tx, 0, tz, p[0], p[1]);
  for (let k = 0; k < profile.length - 1; k++) { if (sign > 0) g.tri(base, base + k + 2, base + k + 1); else g.tri(base, base + k + 1, base + k + 2); }
}

/** surface through rows of points (same count per row), normals from the faces */
export function loft(g, rows, uvScale = 1) {
  const nr = rows.length, np = rows[0].length; const base = g.vertexCount;
  const N = new Float32Array(nr * np * 3);
  const acc = (p, q, r, i0, i1, i2) => {
    const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2], vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const id of [i0, i1, i2]) { N[id * 3] += nx; N[id * 3 + 1] += ny; N[id * 3 + 2] += nz; }
  };
  for (let i = 0; i < nr - 1; i++) for (let k = 0; k < np - 1; k++) {
    const a = i * np + k, b = a + 1, c = a + np, d = c + 1;
    acc(rows[i][k], rows[i + 1][k], rows[i][k + 1], a, c, b); acc(rows[i][k + 1], rows[i + 1][k], rows[i + 1][k + 1], b, c, d);
  }
  let len = 0;
  for (let i = 0; i < nr; i++) {
    if (i > 0) len += Math.hypot(rows[i][0][0] - rows[i - 1][0][0], rows[i][0][2] - rows[i - 1][0][2]);
    let pl = 0;
    for (let k = 0; k < np; k++) {
      const p = rows[i][k]; if (k > 0) { const q = rows[i][k - 1]; pl += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
      const o = (i * np + k) * 3; const l = Math.hypot(N[o], N[o + 1], N[o + 2]) || 1;
      g.vert(p[0], p[1], p[2], N[o] / l, N[o + 1] / l, N[o + 2] / l, len * uvScale, pl * uvScale);
    }
  }
  for (let i = 0; i < nr - 1; i++) for (let k = 0; k < np - 1; k++) { const a = base + i * np + k, b = a + 1, c = a + np, d = c + 1; g.idx.push(a, c, b, b, c, d); }
}

export class BarriersView {
  constructor(world, sceneMats) {
    this.world = world; this.track = world.track; this.sp = world.track.spline; this.SM = sceneMats;
    this.group = new THREE.Group(); this.group.name = 'barriers';
    this.stats = { metres: {}, meshes: 0, tyreStacks: 0 };
    const sp = this.sp, n = sp.n;
    // corner zones: barriers are painted there
    this.corner = new Uint8Array(n);
    for (let i = 0; i < n; i++) { let m = 0; for (let k = -30; k <= 30; k += 3) m = Math.max(m, Math.abs(sp.kappa[(i + k + n) % n])); this.corner[i] = m > 1 / 140 ? 1 : 0; }
  }

  /** consecutive samples with the same barrier type on one side */
  runs(side) {
    const n = this.sp.n, type = this.track.barType[side]; const out = [];
    let start = 0; while (start < n && type[start] === type[(start + n - 1) % n]) start++;
    if (start === n) return [{ type: type[0], i0: 0, count: n }];
    let i = start;
    do { const t = type[i]; let count = 1; while (type[(i + count) % n] === t && count < n) count++; out.push({ type: t, i0: i, count }); i = (i + count) % n; } while (i !== start);
    return out;
  }

  /** frame on the collision line of one side: position on the (extended) road plane, outward axis */
  frame(side, i) {
    const sp = this.sp, track = this.track; const sg = side === 0 ? -1 : 1;
    const d = sg * (sp.half[i] + track.barOff[side][i]);
    return { x: sp.x[i] + sp.rx[i] * d, y: track.planeHeight(i, 0, d), z: sp.z[i] + sp.rz[i] * d, rx: sp.rx[i] * sg, rz: sp.rz[i] * sg, i, s: i * sp.ds, side };
  }

  build(scatter) {
    const n = this.sp.n;
    this._registerTyres(scatter);
    for (const side of [0, 1]) for (const run of this.runs(side)) {
      const name = BARRIER_TYPES[run.type];
      this.stats.metres[name] = (this.stats.metres[name] || 0) + run.count;
      if (name === 'none' || name === 'facade' || !this[name]) continue;   // facades: the buildings themselves are the barrier
      for (let a = 0; a < run.count; a += PIECE) {
        const cnt = Math.min(PIECE, run.count - a);
        const frames = []; for (let k = 0; k <= cnt; k++) frames.push(this.frame(side, (run.i0 + a + k) % n));
        if (side === 0) frames.reverse();          // keeps "path direction x up = outward" on both sides
        const parts = new Map(); const P = (mat) => { let g = parts.get(mat); if (!g) { g = new Geo(); parts.set(mat, g); } return g; };
        this[name](P, frames, { side, scatter });
        for (const [mat, g] of parts) this._mesh(mat, g, name);
        // one shadow caster per piece, whatever its materials
        const src = [...parts.values()].filter((g) => g.vertexCount).map((g) => ({ position: g.p, index: g.idx }));
        if (src.length) { const px = proxyMesh(mergeForShadow(src)); px.updateMatrixWorld(true); this.group.add(px); }
      }
    }
    // closures of the village building line where there is no facade (see world/village.js); merged per
    // 200 m cell and material, one shadow proxy per cell
    const V = this.world.lists.village; const cells = new Map();
    if (V) for (const c of V.closures) {
      const len = c.to - c.from; if (len < 0.2) continue; const k = Math.max(1, Math.ceil(len)); const frames = [];
      for (let q = 0; q <= k; q++) frames.push(this.frameAt(c.side, c.from + len * q / k));
      if (c.side === 0) frames.reverse();
      const key = Math.floor(frames[0].x / 200) + ',' + Math.floor(frames[0].z / 200);
      const parts = cells.get(key) || cells.set(key, new Map()).get(key); const P = (mat) => { let g = parts.get(mat); if (!g) { g = new Geo(); parts.set(mat, g); } return g; };
      this['closure_' + c.type](P, frames, { side: c.side, closure: c });
      this.stats.metres['closure:' + c.type] = (this.stats.metres['closure:' + c.type] || 0) + len;
    }
    // walls that are scenery, not barriers (outer edge of the lookout terrace)
    for (const w of this.world.lists.decorWalls || []) {
      const len = w.to - w.from; const k = Math.max(1, Math.ceil(len)); const frames = [];
      for (let q = 0; q <= k; q++) { const s = w.from + len * q / k; const f = this.frameAt(w.side, s); const extra = w.off(s) - this.sp.sampleArr(this.track.barOff[w.side], s); f.x += f.rx * extra; f.z += f.rz * extra; f.y = this.world.terrain.heightAt(f.x, f.z) + 0.02; frames.push(f); }
      if (w.side === 0) frames.reverse();
      const key = 'decor' + Math.round(w.from); const parts = cells.get(key) || cells.set(key, new Map()).get(key); const P = (mat) => { let g = parts.get(mat); if (!g) { g = new Geo(); parts.set(mat, g); } return g; };
      this[w.type](P, frames, { side: w.side });
    }
    for (const parts of cells.values()) {
      for (const [mat, g] of parts) this._mesh(mat, g, 'closure');
      const src = [...parts.values()].filter((g) => g.vertexCount).map((g) => ({ position: g.p, index: g.idx }));
      if (src.length) { const px = proxyMesh(mergeForShadow(src)); px.updateMatrixWorld(true); this.group.add(px); }
    }
    return this.group;
  }

  /** frame on the collision line at any lap distance (closures do not start on whole samples) */
  frameAt(side, s) {
    const sp = this.sp, track = this.track; const sg = side === 0 ? -1 : 1;
    const d = sg * (sp.sampleArr(sp.half, s) + sp.sampleArr(track.barOff[side], s));
    const q = sp.pointAt(s, d, {});
    return { x: q.x, y: track.planeHeight(q.i, q.t, d), z: q.z, rx: q.hx * sg, rz: q.hz * sg, i: Math.round(sp.wrapS(s) / sp.ds) % sp.n, s, side };
  }

  // ------------------------------------------------------------------------------------------ village closures
  /** side-street mouth: painted race blocks */
  closure_raceblocks(P, frames, o) {
    const g = P('concrete'); const np = JERSEY.length; let k = 0;
    for (let b = 0; b < frames.length - 1; b += 3) {
      const sub = frames.slice(b, Math.min(frames.length, b + 4)); if (sub.length < 2) continue;
      const blk = trimEnds(sub, 0.02); g.color(0.9, 0.9, 0.88); const base = g.vertexCount; g.sweep(JERSEY, blk, 1);
      const t = k++ % 2 ? [0.74, 0.12, 0.09] : [0.9, 0.89, 0.84];
      for (let f = 0; f < blk.length; f++) for (let q = 2; q <= 7; q++) { const ci = (base + f * np + q) * 3; g.col[ci] = t[0]; g.col[ci + 1] = t[1]; g.col[ci + 2] = t[2]; }
      capFan(g, blk[0], JERSEY, -1); capFan(g, blk[blk.length - 1], JERSEY, 1);
    }
  }
  /** square: low stone wall with an iron railing */
  closure_balustrade(P, frames) {
    this._wall(P, frames, { body: 'stoneblock', cap: 'stoneblock', h: 0.42, th: 0.4, capH: 0.1, back: 0.6, pil: 0 });
    const ir = P('iron'); ir.color(1, 1, 1);
    ir.tube(frames.map((f) => [f.x + f.rx * 0.2, f.y + 1.02, f.z + f.rz * 0.2]), 0.022, 5, 1, false);
    ir.tube(frames.map((f) => [f.x + f.rx * 0.2, f.y + 0.76, f.z + f.rz * 0.2]), 0.014, 4, 1, false);
    frames.forEach((f, k) => { if (k % 2 === 0) ir.cyl(f.x + f.rx * 0.2, f.y + 0.5, f.z + f.rz * 0.2, 0.02, 0.02, f.y + 1.04, 5, 1, false); });
    // stone piers every 8 m carry the railing
    const st = P('stoneblock'); frames.forEach((f, k) => { if (k % 8 !== 0) return; st.push().translate(f.x + f.rx * 0.22, f.y, f.z + f.rz * 0.22).rotateY(Math.atan2(-f.rz, f.rx)).box(0, 0.3, 0, 0.22, 0.9, 0.22, 1, '-y').box(0, 1.24, 0, 0.26, 0.05, 0.26).pop(); });
  }
  /** front garden: low rendered wall with railings and a pair of gate piers in the middle */
  closure_gardenwall(P, frames, o) {
    const k = 0.9 + 0.2 * hash01(Math.round(frames[0].s), 5, o.side);
    P('plasterworn').color(0.93 * k, 0.9 * k, 0.82 * k);
    this._wall(P, frames, { body: 'plasterworn', cap: 'stoneblock', h: 0.78, th: 0.34, capH: 0.09, back: 0.6, pil: 0 });
    const ir = P('iron'); ir.color(1, 1, 1);
    ir.tube(frames.map((f) => [f.x + f.rx * 0.17, f.y + 1.42, f.z + f.rz * 0.17]), 0.018, 5, 1, false);
    for (let q = 0; q < frames.length - 1; q++) for (const t of [0.17, 0.5, 0.83]) { const a = frames[q], b = frames[q + 1]; const x = a.x + (b.x - a.x) * t + a.rx * 0.17, z = a.z + (b.z - a.z) * t + a.rz * 0.17, y = a.y + (b.y - a.y) * t; ir.cyl(x, y + 0.86, z, 0.011, 0.011, y + 1.5, 4, 1, false); }
    const m = frames[Math.floor(frames.length / 2)]; const st = P('stoneblock'); const ang = Math.atan2(-m.rz, m.rx);
    for (const e of [-0.75, 0.75]) st.push().translate(m.x + m.rx * 0.2, m.y, m.z + m.rz * 0.2).rotateY(ang).box(0, 0.5, e, 0.24, 1.2, 0.24, 1, '-y').box(0, 1.76, e, 0.29, 0.06, 0.29).pop();
  }
  /** wall between two houses, with a tile coping and a door when it is wide enough */
  closure_linkwall(P, frames, o) {
    const seed = Math.round(frames[0].s * 7); const k = 0.86 + 0.24 * hash01(seed, 3, o.side); const stone = hash01(seed, 9, o.side) < 0.35;
    const body = stone ? 'rubble' : 'plasterworn'; if (!stone) P(body).color(0.95 * k, 0.9 * k, 0.8 * k); else P(body).color(1, 1, 1);
    const h = 2.25 + 0.5 * hash01(seed, 4, 1);
    this._wall(P, frames, { body, cap: 'rooftile', h, th: 0.36, capH: 0.12, back: 0.8, pil: 0 });
    let len = 0; for (let q = 1; q < frames.length; q++) len += Math.hypot(frames[q].x - frames[q - 1].x, frames[q].z - frames[q - 1].z);
    if (len > 1.7) {
      const a = frames[0], b = frames[frames.length - 1]; const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, my = (a.y + b.y) / 2; const ux = (b.x - a.x) / len, uz = (b.z - a.z) / len;
      const nx = -a.rx, nz = -a.rz;       // towards the road
      const q = (u, v, out) => [mx + ux * u + nx * out, my + v, mz + uz * u + nz * out];
      const d = P('door'); d.color(0.75, 0.7, 0.62); d.quad(q(0.5, 0.05, 0.02), q(-0.5, 0.05, 0.02), q(-0.5, 2.0, 0.02), q(0.5, 2.0, 0.02), 1);
      const s2 = P('stoneblock'); s2.color(1, 1, 1);
      for (const [u0, u1, v0, v1] of [[-0.68, -0.5, 0, 2.0], [0.5, 0.68, 0, 2.0], [-0.68, 0.68, 2.0, 2.2]]) s2.quad(q(u1, v0, 0.05), q(u0, v0, 0.05), q(u0, v1, 0.05), q(u1, v1, 0.05), 1);
    }
  }

  _mesh(matKey, g, name) {
    if (!g.vertexCount) return;
    const mat = this.SM.get(matKey); if (mat.vertexColors && !g.col) g.color(1, 1, 1);
    const mesh = new THREE.Mesh(g.build(), mat); mesh.castShadow = false; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
    mesh.name = 'barrier_' + name; mesh.userData.kind = 'barrier';
    this.group.add(mesh); this.stats.meshes++;
  }

  // ------------------------------------------------------------------------------------------ types
  /** concrete blocks, 4 m each, with joints; painted red / white through the corners */
  concrete(P, frames, o) {
    const g = P('concrete'); const BL = 4, np = JERSEY.length;
    for (let b = 0; b < frames.length - 1; b += BL) {
      const sub = frames.slice(b, Math.min(frames.length, b + BL + 1)); if (sub.length < 2) continue;
      const blk = trimEnds(sub, 0.02); const i0 = Math.min(sub[0].i, sub[sub.length - 1].i); const idx = Math.floor(i0 / BL);
      const k = 0.86 + 0.22 * hash01(idx, 7, o.side); g.color(k, k * 0.99, k * 0.97);
      const base = g.vertexCount; g.sweep(JERSEY, blk, 1);
      if (this.corner[i0]) {
        const t = idx % 2 ? [0.74, 0.12, 0.09] : [0.9, 0.89, 0.84];
        for (let f = 0; f < blk.length; f++) for (let q = 2; q <= 7; q++) { const ci = (base + f * np + q) * 3; g.col[ci] = t[0]; g.col[ci + 1] = t[1]; g.col[ci + 2] = t[2]; }
      }
      capFan(g, blk[0], JERSEY, -1); capFan(g, blk[blk.length - 1], JERSEY, 1);
    }
  }

  /** masonry wall with a cap stone and (optionally) regular piers */
  _wall(P, frames, w) {
    const a = w.th - 0.03, b = 0.03, t = w.h + w.capH;
    const gb = P(w.body);
    gb.sweep([[a, -w.back], [a, w.h]], frames, 1);
    gb.sweep([[b, w.h], [b, -0.45]], frames, 1);
    const gc = P(w.cap);
    gc.sweep([[w.th, w.h - 0.01], [w.th, t - 0.03], [w.th - 0.03, t], [0.03, t], [0, t - 0.03], [0, w.h - 0.01]], frames, 1);
    if (w.pil) for (const f of frames) {
      if (f.i % w.pil !== 0) continue;
      const hw = (w.th + 0.1) / 2, ang = Math.atan2(-f.rz, f.rx);
      gb.push().translate(f.x + f.rx * hw, f.y, f.z + f.rz * hw).rotateY(ang).box(0, (w.pilH - w.back) / 2, 0, hw, (w.pilH + w.back) / 2, hw, 1, '+y-y').pop();
      gc.push().translate(f.x + f.rx * hw, f.y, f.z + f.rz * hw).rotateY(ang).box(0, w.pilH + 0.05, 0, hw + 0.035, 0.05, hw + 0.035);
      // low pyramid on top of the pier
      const q = hw * 0.85, y0 = w.pilH + 0.1, y1 = w.pilH + 0.24;
      gc.quad([-q, y0, q], [q, y0, q], [0, y1, 0], [0, y1, 0], 1).quad([q, y0, q], [q, y0, -q], [0, y1, 0], [0, y1, 0], 1).quad([q, y0, -q], [-q, y0, -q], [0, y1, 0], [0, y1, 0], 1).quad([-q, y0, -q], [-q, y0, q], [0, y1, 0], [0, y1, 0], 1);
      gc.pop();
    }
  }
  seawall(P, frames) { this._wall(P, frames, { body: 'stoneblock', cap: 'concrete', h: 0.68, th: 0.5, capH: 0.11, back: 2.4, pil: 8, pilH: 0.98 }); }
  parapet(P, frames) { this._wall(P, frames, { body: 'stone', cap: 'stoneblock', h: 0.84, th: 0.45, capH: 0.12, back: 3.6, pil: 0 }); }
  bridgeparapet(P, frames) {
    this._wall(P, frames, { body: 'stone', cap: 'stoneblock', h: 0.88, th: 0.5, capH: 0.13, back: 1.7, pil: 10, pilH: 1.22 });
    // a lantern on every other pier
    const ir = P('iron'), gl = P('lampglass'); ir.color(1, 1, 1);
    for (const f of frames) { if (f.i % 20 !== 0) continue; const x = f.x + f.rx * 0.3, z = f.z + f.rz * 0.3, y = f.y + 1.46;
      ir.cyl(x, y, z, 0.05, 0.035, y + 1.5, 6, 1, false).cyl(x, y + 1.5, z, 0.16, 0.05, y + 1.56, 6).cyl(x, y + 1.88, z, 0.05, 0.19, y + 1.96, 6);
      gl.cyl(x, y + 1.56, z, 0.09, 0.14, y + 1.88, 6, 1, false); }
  }

  /** dry-stone field wall: uneven crest, slightly bulging faces */
  stonewall(P, frames, o) {
    const g = P('rubble'); const rows = []; const last = DRYSTONE.length - 1;
    for (const f of frames) {
      const hs = 0.92 + 0.14 * fbm2(f.s / 5.3, 2.1 + o.side * 9.7, 2, 71);
      rows.push(DRYSTONE.map(([po, ph], k) => {
        const j = hash01(f.i, k, 91 + o.side) - 0.5;
        const oo = Math.max(0, po + (k > 0 && k < last ? j * 0.06 : 0)), hh = ph > 0.5 ? ph * hs + j * 0.05 : ph;
        return [f.x + f.rx * oo, f.y + hh, f.z + f.rz * oo];
      }));
    }
    loft(g, rows, 1);
  }

  /** steel W-beam on posts every 2 m */
  guardrail(P, frames) {
    const g = P('galv');
    g.color(1, 1, 1);
    g.sweep(WBEAM, frames, 1);
    g.sweep(WBEAM.slice().reverse().map(([a, b]) => [a + 0.006, b]), frames, 1);
    g.color(0.8, 0.8, 0.82);
    for (const f of frames) {
      if (f.i % 2) continue;
      g.push().translate(f.x + f.rx * 0.165, f.y + 0.08, f.z + f.rz * 0.165).rotateY(Math.atan2(-f.rz, f.rx));
      g.box(0, 0, 0, 0.035, 0.68, 0.05).box(-0.06, 0.555, 0, 0.03, 0.09, 0.04);
      g.pop();
    }
  }

  /** timber fence: round posts, two rails */
  woodfence(P, frames, o) {
    const g = P('woodgrey');
    for (const f of frames) {
      if (f.i % 3) continue;
      const k = 0.78 + 0.34 * hash01(f.i, 3, o.side); g.color(k, k * 0.98, k * 0.95);
      const lean = (hash01(f.i, 5, o.side) - 0.5) * 0.09;
      g.push().translate(f.x + f.rx * 0.17, f.y, f.z + f.rz * 0.17).rotateZ(lean).cyl(0, -0.5, 0, 0.078, 0.066, 1.16 + 0.1 * hash01(f.i, 9, 1), 7).pop();
    }
    g.color(0.9, 0.88, 0.84);
    for (const [h, r, sd] of [[0.95, 0.05, 17], [0.52, 0.055, 29]]) {
      const pts = frames.map((f) => [f.x + f.rx * 0.062, f.y + h + (hash01(f.i, sd, o.side) - 0.5) * 0.045, f.z + f.rz * 0.062]);
      g.tube(pts, r, 5, 1, false);
    }
  }

  /** rock cutting: a craggy face that rises from the road side and merges into the hillside behind */
  rockwall(P, frames, o) {
    const g = P('cliff'); const T = this.world.terrain; const rows = []; const last = ROCK_OFF.length - 1;
    for (const f of frames) {
      const s = f.s; const H = 3.2 + 1.5 * fbm2(s / 19, 3.7 + o.side * 5.1, 3, 77);
      const row = [];
      for (let k = 0; k <= last; k++) {
        const n1 = fbm2(s / 3.1, k * 0.83 + 11.3 + o.side * 3.3, 3, 31), n2 = fbm2(s / 9.0, k * 0.4 + 5.1, 2, 57);
        const oo = k === 0 ? ROCK_OFF[0] : Math.max(0.03, ROCK_OFF[k] + n1 * 0.28 * Math.min(1, k / 2) + n2 * 0.5 * smoothstep(0, 3, k));
        const x = f.x + f.rx * oo, z = f.z + f.rz * oo; const ty = T.heightAt(x, z);
        const front = H * (1 - Math.exp(-ROCK_OFF[k] / 0.55)) * (1 - 0.55 * smoothstep(1.7, 6.6, ROCK_OFF[k]));
        let y;
        if (k === 0) y = f.y - 0.6;
        else if (k === last) y = ty - 0.8;
        else {
          // behind the crest the rock runs into the hillside (up or down to it): no ridge with a hollow behind
          const face = f.y + front + n1 * 0.22;
          y = Math.max(face + (ty + 0.1 - face) * smoothstep(2.2, 6.2, ROCK_OFF[k]), ty + 0.3 * smoothstep(5.2, 2.0, ROCK_OFF[k]));
        }
        row.push([x, y, z]);
      }
      rows.push(row);
    }
    loft(g, rows, 1);
  }

  /** tyre wall: two staggered rows of four-tyre stacks, the front row painted in groups */
  tyres(P, frames, o) {
    const sc = o.scatter; const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pos = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), Y = new THREE.Vector3(0, 1, 0);
    const white = new THREE.Color(0.86, 0.85, 0.8), red = new THREE.Color(0.7, 0.1, 0.08), black = new THREE.Color(0.05, 0.05, 0.055);
    for (let i = 0; i < frames.length - 1; i++) {
      const a = frames[i], b = frames[i + 1];
      for (let h = 0; h < 2; h++) for (let row = 0; row < 2; row++) {
        const t = h * 0.5 + row * 0.25; const off = 0.275 + row * 0.47;
        const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, z = a.z + (b.z - a.z) * t;
        const rx = a.rx + (b.rx - a.rx) * t, rz = a.rz + (b.rz - a.rz) * t;
        const id = Math.min(a.i, b.i) * 4 + h * 2 + row;
        pos.set(x + rx * off, y - 0.05, z + rz * off); q.setFromAxisAngle(Y, hash01(id, 3, o.side) * 6.283);
        m.compose(pos, q, one);
        const grp = Math.floor(Math.min(a.i, b.i) / 3) % 2;
        sc.add('tyrestack', m, row === 0 ? (grp ? red : white) : black);
        this.stats.tyreStacks++;
      }
    }
  }

  _registerTyres(scatter) {
    const mat = this.SM.get('rubber');
    const stack = (seg, prof, n = 4, dy = 0.2) => { const g = new Geo(); g.color(1, 1, 1); for (let k = 0; k < n; k++) g.lathe(0, 0, prof.map(([r, y]) => [r, y + k * dy]), seg); return g.build(); };
    const P0 = [[0.165, 0.03], [0.185, 0.0], [0.25, 0.0], [0.275, 0.035], [0.275, 0.16], [0.25, 0.195], [0.185, 0.195], [0.165, 0.165], [0.165, 0.03]];
    const P1 = [[0.17, 0.0], [0.275, 0.0], [0.275, 0.195], [0.17, 0.195]];
    scatter.addPrototype('tyrestack', {
      lods: [
        { parts: [{ geometry: stack(10, P0), material: mat }], max: 60 },
        { parts: [{ geometry: stack(7, P1), material: mat }], max: 200 },
        { parts: [{ geometry: stack(6, [[0.275, 0], [0.275, 0.8], [0.17, 0.8]], 1), material: mat }], max: 700 },
      ], category: 'prop', shadowMax: 110,
    });
  }
}
