// validateWorld(): the invariants of section 3.2 of the brief, checked on the generated data.
// Runs on load in dev mode, in `npm run validate` (Node) and inside `npm run verify`.
// It returns every violation; callers treat a non-empty error list as a hard failure.

import { EXCLUSION, STRIP_COLS } from './track.js';
import { meshHeightAt } from './road-geometry.js';
import { mulberry32 } from '../core/rng.js';

export const LIMITS = {
  terrainAboveRoad: 0.02,   // m, terrain above the road surface inside the track width
  edgeGap: 0.15,            // m, hole or step between the road edge and the terrain
  exclusion: EXCLUSION,     // m, object-free strip beyond the road edge
  baseOffset: 0.3,          // m, object base floating / buried
  maxBankDeg: 12,
  maxGrade: 0.14,
  minRadius: 25,
  colliderVsMesh: 0.005,    // m, physics surface vs rendered road mesh
};

function obbCorners(o) {
  const c = Math.cos(o.rot), s = Math.sin(o.rot);
  const pts = [];
  for (const [ux, uz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const lx = ux * o.hx, lz = uz * o.hz;
    pts.push([o.x + lx * c - lz * s, o.z + lx * s + lz * c]);
  }
  return pts;
}
function obbOverlap(a, b, tol = 0.03) {
  const ca = obbCorners(a), cb = obbCorners(b);
  const axes = [[Math.cos(a.rot), Math.sin(a.rot)], [-Math.sin(a.rot), Math.cos(a.rot)], [Math.cos(b.rot), Math.sin(b.rot)], [-Math.sin(b.rot), Math.cos(b.rot)]];
  for (const [ax, az] of axes) {
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const p of ca) { const v = p[0] * ax + p[1] * az; if (v < a0) a0 = v; if (v > a1) a1 = v; }
    for (const p of cb) { const v = p[0] * ax + p[1] * az; if (v < b0) b0 = v; if (v > b1) b1 = v; }
    if (a1 - tol <= b0 || b1 - tol <= a0) return false;
  }
  return true;
}

/**
 * @param world {{track, terrain, roadGeo, objects:Array}}
 * @returns {{ok:boolean, errors:string[], checks:Object, stats:Object}}
 */
export function validateWorld(world, opts = {}) {
  const { track, terrain } = world; const sp = track.spline; const n = sp.n;
  const errors = []; const checks = {};
  const maxErr = opts.maxErrorsPerCheck || 8;
  const add = (name, list, worst, detail) => {
    checks[name] = { pass: list.length === 0, violations: list.length, worst, ...detail };
    for (let i = 0; i < Math.min(list.length, maxErr); i++) errors.push(`${name}: ${list[i]}`);
    if (list.length > maxErr) errors.push(`${name}: ... and ${list.length - maxErr} more`);
  };
  const p = {};

  // 1. terrain above the road surface (carriageway and side strips)
  {
    const bad = []; let worst = -Infinity;
    for (let i = 0; i < n; i++) {
      const s = i * sp.ds; const hw = sp.half[i];
      const eL = track.ext[0][i], eR = track.ext[1][i];
      const steps = 14;
      for (let q = 0; q <= steps; q++) {
        const d = -(hw + eL) + (2 * hw + eL + eR) * (q / steps);
        sp.pointAt(s, d, p);
        const surf = {}; if (!track.surfaceAt(p.x, p.z, i, surf)) continue;
        const dh = terrain.heightAt(p.x, p.z) - surf.y;
        if (dh > worst) worst = dh;
        if (dh > LIMITS.terrainAboveRoad) bad.push(`terrain ${dh.toFixed(3)} m above the road at s=${s.toFixed(0)} d=${d.toFixed(1)}`);
      }
    }
    add('terrain-above-road', bad, +worst.toFixed(4), { limit: LIMITS.terrainAboveRoad });
  }

  // 2. gap (hole or step) between the edge of the road corridor and the terrain
  {
    const bad = []; let worst = 0; const exempt = [];
    for (let i = 0; i < n; i++) {
      const s = i * sp.ds; const hw = sp.half[i];
      if (track.conform[i] < 0.999) { exempt.push(i); continue; } // bridge span and its abutments (parapets, no ground beside the deck)
      for (let k = 0; k < 2; k++) {
        const sg = k === 0 ? -1 : 1;
        for (const where of ['road', 'strip']) {
          const dEdge = where === 'road' ? hw : hw + track.ext[k][i];
          if (where === 'strip' && track.ext[k][i] < 0.01) continue;
          sp.pointAt(s, sg * (dEdge - 0.02), p);
          const surf = {}; if (!track.surfaceAt(p.x, p.z, i, surf)) continue;
          sp.pointAt(s, sg * (dEdge + (where === 'road' && track.ext[k][i] > 0.01 ? -0.02 : 0.06)), p);
          const gap = Math.abs(surf.y - terrain.heightAt(p.x, p.z));
          if (gap > worst) worst = gap;
          if (gap > LIMITS.edgeGap) bad.push(`${gap.toFixed(3)} m between the ${where} edge and the terrain at s=${s.toFixed(0)} side=${k === 0 ? 'L' : 'R'}`);
        }
      }
    }
    let exFrom = null, exTo = null;
    if (exempt.length) { exFrom = exempt[0] * sp.ds; exTo = (exempt[exempt.length - 1] + 1) * sp.ds; }
    add('road-edge-gap', bad, +worst.toFixed(4), { limit: LIMITS.edgeGap, exemptSpan: exempt.length ? { from: exFrom, to: exTo, reason: 'bridge deck and abutments: the deck is closed by parapets, there is no ground beside it' } : null });
    // the exempt span must really be protected by bridge parapets on both sides
    const badB = [];
    for (const i of exempt) for (let k = 0; k < 2; k++) if (track.barType[k][i] === 0) badB.push(`no barrier beside the bridge at s=${(i * sp.ds).toFixed(0)}`);
    add('bridge-closed-by-barriers', badB, badB.length, {});
  }

  // 3. road geometry limits
  {
    const badBank = [], badGrade = [], badRad = []; let wb = 0, wg = 0, wr = Infinity;
    for (let i = 0; i < n; i++) {
      const s = i * sp.ds;
      const bank = Math.abs(sp.bank[i]) * 180 / Math.PI; if (bank > wb) wb = bank;
      if (bank > LIMITS.maxBankDeg) badBank.push(`bank ${bank.toFixed(1)} deg at s=${s.toFixed(0)}`);
      const g = Math.abs(sp.grade[i]); if (g > wg) wg = g;
      if (g > LIMITS.maxGrade) badGrade.push(`grade ${(g * 100).toFixed(1)} % at s=${s.toFixed(0)}`);
      const k = Math.abs(sp.kappa[i]); const r = k > 1e-6 ? 1 / k : Infinity; if (r < wr) wr = r;
      if (r < LIMITS.minRadius) badRad.push(`radius ${r.toFixed(1)} m at s=${s.toFixed(0)}`);
    }
    add('bank', badBank, +wb.toFixed(2), { limit: LIMITS.maxBankDeg });
    add('grade', badGrade, +(wg * 100).toFixed(2), { limitPercent: LIMITS.maxGrade * 100 });
    add('radius', badRad, +wr.toFixed(2), { limit: LIMITS.minRadius });
  }

  // 4. checkpoints: on the road and in sequence
  {
    const bad = []; let prev = -1;
    for (const cp of track.checkpoints) {
      if (!(cp.s > prev)) bad.push(`checkpoint ${cp.index} out of sequence (s=${cp.s})`);
      prev = cp.s;
      sp.pointAt(cp.s, 0, p); const surf = {};
      if (!track.surfaceAt(p.x, p.z, -1, surf) || !surf.onRoad) bad.push(`checkpoint ${cp.index} is not on the road`);
      if (cp.s < 0 || cp.s >= track.length) bad.push(`checkpoint ${cp.index} outside the lap`);
    }
    if (track.checkpoints.length < 4) bad.push('fewer than 4 checkpoints');
    add('checkpoints', bad, track.checkpoints.length, {});
  }

  // 5. the physics surface is the rendered road mesh
  if (world.roadGeo) {
    const bad = []; let worst = 0; const rand = mulberry32(1234);
    const mesh = world.roadGeo.road;
    for (let q = 0; q < 4000; q++) {
      const i = Math.floor(rand() * n); const s = (i + rand()) * sp.ds;
      sp.pointAt(s, (rand() * 2 - 1) * sp.half[i] * 0.98, p);
      const surf = {}; if (!track.surfaceAt(p.x, p.z, i, surf) || !surf.onRoad) continue;
      const t0 = Math.max(0, (i - 2) * 2), t1 = Math.min(mesh.triangles, (i + 3) * 2);
      const hm = meshHeightAt(mesh, p.x, p.z, t0, t1);
      if (hm === null) continue;
      const e = Math.abs(hm - surf.y); if (e > worst) worst = e;
      if (e > LIMITS.colliderVsMesh) bad.push(`collider differs from the road mesh by ${e.toFixed(4)} m at s=${s.toFixed(0)}`);
    }
    add('collider-equals-road-mesh', bad, +worst.toFixed(5), { limit: LIMITS.colliderVsMesh });
  }

  // 6. objects: exclusion strip, base on the ground, houses not overlapping
  const objects = world.objects || [];
  {
    const badEx = [], badBase = []; let minClear = Infinity, worstBase = 0;
    const pr = {};
    for (const o of objects) {
      // footprint sample points
      let pts;
      if (o.hx !== undefined) { pts = obbCorners(o); pts.push([o.x, o.z]); for (let q = 0; q < 4; q++) pts.push([(pts[q][0] + pts[(q + 1) % 4][0]) / 2, (pts[q][1] + pts[(q + 1) % 4][1]) / 2]); }
      else { const r = o.r || 0; pts = [[o.x, o.z], [o.x + r, o.z], [o.x - r, o.z], [o.x, o.z + r], [o.x, o.z - r]]; }
      let clear = Infinity;
      for (const q of pts) {
        sp.project(q[0], q[1], -1, pr);
        const c = Math.abs(pr.d) - sp.sampleArr(sp.half, pr.s);
        if (c < clear) clear = c;
      }
      if (clear < minClear) minClear = clear;
      if (clear < LIMITS.exclusion) badEx.push(`${o.kind}/${o.type} at (${o.x.toFixed(1)}, ${o.z.toFixed(1)}) is ${clear.toFixed(2)} m from the road edge`);
      // base height against the terrain (bridge structure and wall-mounted items are not ground objects)
      if (o.noGround) continue;
      const basePts = o.hx !== undefined ? [...obbCorners(o), [o.x, o.z]] : [[o.x, o.z]];
      let worstO = 0;
      for (const q of basePts) {
        const dh = o.y - terrain.heightAt(q[0], q[1]);
        const v = o.kind === 'rock' ? Math.max(0, dh) : Math.abs(dh);
        if (v > worstO) worstO = v;
      }
      if (worstO > worstBase) worstBase = worstO;
      if (worstO > LIMITS.baseOffset) badBase.push(`${o.kind}/${o.type} at (${o.x.toFixed(1)}, ${o.z.toFixed(1)}): base ${worstO.toFixed(2)} m off the terrain`);
    }
    add('exclusion-strip', badEx, objects.length ? +minClear.toFixed(2) : null, { limit: LIMITS.exclusion, objects: objects.length });
    add('object-base-on-terrain', badBase, +worstBase.toFixed(3), { limit: LIMITS.baseOffset });
    const houses = objects.filter((o) => o.kind === 'house' || o.kind === 'landmark');
    const badOv = [];
    for (let a = 0; a < houses.length; a++) for (let b = a + 1; b < houses.length; b++) {
      const A = houses[a], Bb = houses[b];
      const rr = Math.hypot(A.hx, A.hz) + Math.hypot(Bb.hx, Bb.hz);
      if (Math.abs(A.x - Bb.x) > rr || Math.abs(A.z - Bb.z) > rr) continue;
      if (obbOverlap(A, Bb)) badOv.push(`houses ${A.id} and ${Bb.id} overlap near (${A.x.toFixed(1)}, ${A.z.toFixed(1)})`);
    }
    add('houses-overlap', badOv, badOv.length, { houses: houses.length });
  }

  const stats = {
    trackLength: +track.length.toFixed(2), samples: n,
    terrain: { nx: terrain.nx, nz: terrain.nz, cell: terrain.cell },
    objects: objects.length,
  };
  return { ok: errors.length === 0, errors, checks, stats };
}

export { obbCorners, obbOverlap };
