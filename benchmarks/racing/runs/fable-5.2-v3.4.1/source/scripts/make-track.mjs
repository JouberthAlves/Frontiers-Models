// Authoring tool (dev time only): turns a human-readable layout (straights + arcs with
// clothoid ramps, heights per segment) into track.json, the single source of the world.
// The game never runs this script; it only reads track.json.
//
//   node scripts/make-track.mjs
//
// Conventions: 1 unit = 1 m, x = east, y = up, z = south. Heading theta is measured from
// +x towards +z, so a positive turn angle is a right-hander. Lateral offsets are positive
// to the right of the direction of travel.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TrackSpline } from '../src/world/spline.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEG = Math.PI / 180;
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;

// ---------------------------------------------------------------------------
// 1. Layout. D and E are solved so that the loop closes.
// ---------------------------------------------------------------------------
function layout(D, E) {
  return [
    // Z1 - Orla (sea front), heading west into the setting sun
    { id: 'orla_a', type: 'S', len: 318, yEnd: 3.2, w: 12 },
    // Z2 - Falesia: climb on the south-facing slope of the headland. Most of the height is gained before and after
    // the stacked legs B and C, so that the upper leg does not tower over the lower hairpin and hide the sky there
    { id: 'r1', type: 'A', R: 120, deg: 45, yEnd: 9.0, w: 11.5 },
    { id: 'legA', type: 'S', len: 92, yEnd: 18.5, w: 11 },
    { id: 'h1', type: 'A', R: 34, deg: 135, yEnd: 23.0, w: 11.5 },
    { id: 'legB', type: 'S', len: 190, yEnd: 33.0, w: 11 },
    { id: 'h2', type: 'A', R: 33, deg: -180, yEnd: 35.6, w: 11.5 },
    { id: 'legC', type: 'S', len: 250, yEnd: 42.6, w: 11 },
    { id: 'r2', type: 'A', R: 60, deg: 90, yEnd: 50.2, w: 11 },
    { id: 'legN', type: 'S', len: 205, yEnd: 61.6, w: 11 },
    { id: 'r3', type: 'A', R: 62, deg: 90, yEnd: 63.6, w: 10.5 },
    // Z3 - Vila: hill-top street heading east, with a dog-leg around the square
    { id: 'v1', type: 'S', len: 84, yEnd: 64.0, w: 10 },
    { id: 'vb1', type: 'A', R: 39, deg: 80, yEnd: 63.6, w: 10.5 },
    { id: 'v2', type: 'S', len: 44, yEnd: 63.0, w: 10 },
    { id: 'vb2', type: 'A', R: 39, deg: -80, yEnd: 62.4, w: 10.5 },
    { id: 'v3', type: 'S', len: 132, yEnd: 61.2, w: 10 },
    // Z4 - Bosque: fast descent with a flick, bridge over the inlet, back to the sea front
    { id: 'd', type: 'S', len: D, yEnd: 61.2 - 0.07 * D, w: 11 },
    { id: 'dk1', type: 'A', R: 210, deg: -15, yEnd: 61.2 - 0.07 * D - 6.0, w: 11 },
    { id: 'dk2', type: 'A', R: 210, deg: 15, yEnd: 61.2 - 0.07 * D - 12.0, w: 11 },
    { id: 'd2', type: 'S', len: 46, yEnd: 61.2 - 0.07 * D - 15.2, w: 11 },
    { id: 'sweep', type: 'A', R: 72, deg: 130, yEnd: 20.6, w: 11.5 },
    { id: 'sw', type: 'S', len: 72, yEnd: 16.2, w: 11 },
    { id: 'kink', type: 'A', R: 135, deg: -40, yEnd: 12.2, w: 11 },
    { id: 'e', type: 'S', len: E, yEnd: 10.6, w: 10.5 },
    { id: 'last', type: 'A', R: 46, deg: 90, yEnd: 3.9, w: 11.5 },
    { id: 'orla_b', type: 'S', len: 200, yEnd: 3.2, w: 12 },
  ];
}

const START = { x: 100, z: 0, heading: 180 * DEG };
const H = 0.25; // integration step (m)

function rampLen(seg) { return seg.type === 'A' ? Math.min(0.35 * seg.R * Math.abs(seg.deg) * DEG, 26) : 0; }
function segLen(seg) { return seg.type === 'S' ? seg.len : seg.R * Math.abs(seg.deg) * DEG + rampLen(seg); }
function kappaAt(seg, sl) {
  if (seg.type === 'S') return 0;
  const lt = rampLen(seg), len = segLen(seg);
  const ramp = Math.min(1, sl / lt, (len - sl) / lt);
  return Math.sign(seg.deg) / seg.R * Math.max(0, ramp);
}

function integrate(segs) {
  let x = START.x, z = START.z, th = START.heading, s = 0;
  const pts = []; // dense analytic centre line
  const bounds = [];
  for (const seg of segs) {
    const len = segLen(seg);
    const steps = Math.max(1, Math.round(len / H)); const h = len / steps;
    bounds.push({ id: seg.id, s0: s, x0: x, z0: z, th0: th, len });
    for (let k = 0; k < steps; k++) {
      const sl = (k + 0.5) * h;
      const kap = kappaAt(seg, sl);
      // midpoint integration
      const thm = th + kap * h * 0.5;
      pts.push({ s, x, z, th, kap: kappaAt(seg, k * h), seg: seg.id });
      x += Math.cos(thm) * h; z += Math.sin(thm) * h; th += kap * h; s += h;
    }
    const b = bounds[bounds.length - 1]; b.s1 = s; b.x1 = x; b.z1 = z; b.th1 = th;
  }
  return { pts, bounds, end: { x, z, th, s } };
}

// --- solve closure for the two free straights (displacement is linear in their lengths)
let D = 220, E = 112;
for (let it = 0; it < 4; it++) {
  const segs = layout(D, E);
  const res = integrate(segs);
  const bd = res.bounds.find((b) => b.id === 'd'), be = res.bounds.find((b) => b.id === 'e');
  const ex = START.x - res.end.x, ez = START.z - res.end.z;
  const a = Math.cos(bd.th0), b = Math.cos(be.th0), c = Math.sin(bd.th0), d = Math.sin(be.th0);
  const det = a * d - b * c;
  D += (ex * d - b * ez) / det; E += (a * ez - c * ex) / det;
}
const SEGS = layout(D, E);
const PATH = integrate(SEGS);
const LA = PATH.end.s; // analytic length
console.log(`closure: D=${D.toFixed(2)} E=${E.toFixed(2)} end=(${PATH.end.x.toFixed(3)}, ${PATH.end.z.toFixed(3)}) heading=${(PATH.end.th / DEG).toFixed(2)} length=${LA.toFixed(1)}`);

// ---------------------------------------------------------------------------
// 2. Height profile: periodic monotone cubic (PCHIP) through the segment ends.
// ---------------------------------------------------------------------------
function pchip(xs, ys) {
  const n = xs.length; const h = [], del = [];
  for (let i = 0; i < n - 1; i++) { h.push(xs[i + 1] - xs[i]); del.push((ys[i + 1] - ys[i]) / h[i]); }
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (del[i - 1] * del[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / del[i - 1] + w2 / del[i]);
    }
  }
  m[0] = del[0]; m[n - 1] = del[n - 2];
  return (x) => {
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const t = (x - xs[i]) / h[i], t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
  };
}
const keyS = [], keyY = [];
{
  const base = PATH.bounds.map((b, i) => ({ s: b.s1, y: SEGS[i].yEnd }));
  for (const off of [-LA, 0, LA]) for (const k of base) { keyS.push(k.s + off); keyY.push(k.y); }
}
const heightAt = pchip(keyS, keyY);

// width per segment, blended over the segment joints
function widthAt(s) {
  const W = 30; let acc = 0, wsum = 0;
  for (let k = -3; k <= 3; k++) {
    let q = ((s + k * W / 3) % LA + LA) % LA;
    const i = PATH.bounds.findIndex((b) => q >= b.s0 && q < b.s1);
    acc += SEGS[i < 0 ? 0 : i].w; wsum++;
  }
  return acc / wsum;
}
function kappaAnalytic(s) {
  const q = ((s % LA) + LA) % LA;
  const i = Math.min(PATH.pts.length - 1, Math.floor(q / LA * PATH.pts.length));
  return PATH.pts[i].kap;
}
function segIdAt(s) {
  const q = ((s % LA) + LA) % LA;
  const b = PATH.bounds.find((bb) => q >= bb.s0 && q < bb.s1) || PATH.bounds[0];
  return b.id;
}
const VILLAGE = new Set(['v1', 'vb1', 'v2', 'vb2', 'v3']);
const SEGIDS = SEGS.map((q) => q.id);
function bankAt(s) {
  // smoothed, proportional to sqrt(curvature); the village street stays almost flat
  let acc = 0; const N = 9, W = 16;
  for (let k = 0; k < N; k++) {
    const q = s + (k / (N - 1) - 0.5) * 2 * W;
    const kap = kappaAnalytic(q);
    let b = Math.sign(kap) * Math.min(5.5, 40 * Math.sqrt(Math.abs(kap)));
    if (VILLAGE.has(segIdAt(q))) b *= 0.25;
    if (segIdAt(q) === 'e') b = 0;
    acc += b;
  }
  return acc / N;
}

// ---------------------------------------------------------------------------
// 3. Control points: denser where the curvature is higher.
// ---------------------------------------------------------------------------
function pathAt(s) {
  const q = ((s % LA) + LA) % LA;
  const f = q / H; const i = Math.min(PATH.pts.length - 1, Math.floor(f));
  const p = PATH.pts[i]; const t = f - i;
  return { x: p.x + Math.cos(p.th) * t * H, z: p.z + Math.sin(p.th) * t * H, th: p.th };
}
const ctrlS = [];
{
  // uniform spacing: a uniform Catmull-Rom needs evenly spaced points to stay free of overshoot
  const N = Math.round(LA / 9);
  for (let k = 0; k < N; k++) ctrlS.push(k * LA / N);
}
const points = ctrlS.map((s) => {
  const p = pathAt(s);
  return { x: r3(p.x), y: r3(heightAt(s)), z: r3(p.z), w: r2(widthAt(s)), bank: r2(bankAt(s)) };
});

const spline = new TrackSpline(points, 1.0);
const L = spline.length;
console.log(`spline: ${points.length} control points, length ${L.toFixed(2)} m, ${spline.n} samples`);

// --- helpers to express features relative to named layout segments -----------------
const B = Object.fromEntries(PATH.bounds.map((b) => [b.id, b]));
/** analytic point at fraction f of segment id, with lateral offset d (+ right) */
function P(id, f, d = 0) {
  const b = B[id]; const p = pathAt(b.s0 + b.len * f);
  return { x: p.x - Math.sin(p.th) * d, z: p.z + Math.cos(p.th) * d };
}
/** lap distance (on the final spline) of fraction f of segment id */
function S(id, f = 0, extra = 0) {
  const b = B[id]; const p = pathAt(b.s0 + b.len * f + extra);
  const pr = spline.project(p.x, p.z);
  return r1(pr.s);
}
const segRange = (id, f0 = 0, f1 = 1) => [S(id, f0), S(id, f1)];

// ---------------------------------------------------------------------------
// 4. Zones (in lap order, starting at the start/finish line s = 0)
// ---------------------------------------------------------------------------
const zones = [
  { id: 'Z1', name: 'Orla', from: S('last', 0.55), to: S('orla_a', 1) },
  { id: 'Z2', name: 'Falésia', from: S('orla_a', 1), to: S('r3', 0.62) },
  { id: 'Z3', name: 'Vila', from: S('r3', 0.62), to: S('v3', 0.93) },
  { id: 'Z4', name: 'Bosque', from: S('v3', 0.93), to: S('last', 0.55) },
];

// ---------------------------------------------------------------------------
// 5. Road sides: barrier line, apron, verge, graded platform and talus widths.
//    Numeric values are smoothed along the lap by the runtime (track.js).
// ---------------------------------------------------------------------------
const kerbs = [];
const sides = [];
function side(from, to, which, barrier, off, o = {}) {
  sides.push({ from, to, side: which, barrier, off, apron: o.apron || 0, apronMat: o.apronMat || null,
    verge: o.verge || 'grass', plat: o.plat ?? Math.max(3.2, off + 1.6), tal: o.tal ?? 9 });
}
// --- Z1
side(S('last', 0.9), S('orla_a', 0.93), 'L', 'seawall', 2.2, { apron: 2.2, apronMat: 'concrete', verge: 'sand', plat: 4.2, tal: 7 });
side(S('last', 0.9), S('orla_a', 0.93), 'R', 'concrete', 1.8, { apron: 1.8, apronMat: 'concrete', verge: 'paved', plat: 17, tal: 11 });
// --- R1: sand run-off on the outside
side(S('orla_a', 0.93), S('r1', 0.25), 'L', 'tyres', 7, { verge: 'sand', plat: 9, tal: 9 });
side(S('r1', 0.25), S('legA', 0.2), 'L', 'tyres', 13, { verge: 'sand', plat: 15, tal: 9 });
side(S('orla_a', 0.93), S('legA', 0.2), 'R', 'guardrail', 2.6, { verge: 'grass', plat: 4.4, tal: 9 });
// --- leg A (NW): downhill on the left, rock on the right
side(S('legA', 0.2), S('h1', 0.05), 'L', 'guardrail', 1.6, { verge: 'gravel', plat: 3.4, tal: 9 });
side(S('legA', 0.2), S('h1', 0.05), 'R', 'rockwall', 1.8, { verge: 'gravel', plat: 3.2, tal: 7 });
// --- H1 (right hairpin): rock on the outside
side(S('h1', 0.05), S('legB', 0.08), 'L', 'rockwall', 2.2, { verge: 'gravel', plat: 3.6, tal: 7 });
side(S('h1', 0.05), S('legB', 0.08), 'R', 'guardrail', 2.2, { verge: 'gravel', plat: 3.8, tal: 8 });
// --- leg B (east): downhill on the right
side(S('legB', 0.08), S('h2', 0.04), 'L', 'rockwall', 1.8, { verge: 'gravel', plat: 3.2, tal: 7 });
side(S('legB', 0.08), S('h2', 0.04), 'R', 'guardrail', 1.6, { verge: 'gravel', plat: 3.4, tal: 9 });
// --- H2 (left hairpin): viewpoint (mirante) on the outside
side(S('h2', 0.04), S('legC', 0.06), 'L', 'rockwall', 2.2, { verge: 'gravel', plat: 3.6, tal: 7 });
side(S('h2', 0.04), S('h2', 0.2), 'R', 'parapet', 2.4, { apron: 2.4, apronMat: 'paving', verge: 'paved', plat: 6, tal: 10 });
side(S('h2', 0.2), S('h2', 0.8), 'R', 'parapet', 2.4, { apron: 2.4, apronMat: 'paving', verge: 'paved', plat: 17, tal: 11 });
side(S('h2', 0.8), S('legC', 0.06), 'R', 'parapet', 2.4, { apron: 2.4, apronMat: 'paving', verge: 'paved', plat: 6, tal: 10 });
// --- leg C (west): downhill on the left
side(S('legC', 0.06), S('r2', 0.05), 'L', 'guardrail', 1.6, { verge: 'gravel', plat: 3.4, tal: 9 });
side(S('legC', 0.06), S('r2', 0.05), 'R', 'rockwall', 1.8, { verge: 'gravel', plat: 3.2, tal: 7 });
// --- R2 + leg N: sea cliff on the left
side(S('r2', 0.05), S('legN', 0.1), 'L', 'guardrail', 2.6, { verge: 'gravel', plat: 5, tal: 10 });
side(S('r2', 0.05), S('legN', 0.1), 'R', 'rockwall', 2.2, { verge: 'gravel', plat: 3.6, tal: 8 });
side(S('legN', 0.1), S('r3', 0.25), 'L', 'guardrail', 1.8, { verge: 'grass', plat: 4, tal: 9 });
side(S('legN', 0.1), S('r3', 0.25), 'R', 'stonewall', 2.6, { verge: 'grass', plat: 4.6, tal: 10 });
side(S('r3', 0.25), S('r3', 0.55), 'L', 'stonewall', 3.2, { verge: 'grass', plat: 14, tal: 11 });
side(S('r3', 0.25), S('r3', 0.55), 'R', 'stonewall', 3.0, { verge: 'grass', plat: 14, tal: 11 });
// --- Z3 village: sidewalks up to the building line
side(S('r3', 0.55), S('d', 0.07), 'L', 'facade', 4.2, { apron: 4.2, apronMat: 'paving', verge: 'paved', plat: 40, tal: 13 });
side(S('r3', 0.55), S('d', 0.07), 'R', 'facade', 4.2, { apron: 4.2, apronMat: 'paving', verge: 'paved', plat: 40, tal: 13 });
// --- Z4 descent
side(S('d', 0.07), S('sweep', 0.1), 'L', 'woodfence', 4.0, { verge: 'grass', plat: 6, tal: 11 });
side(S('d', 0.07), S('sweep', 0.1), 'R', 'woodfence', 4.0, { verge: 'grass', plat: 6, tal: 11 });
kerbs.push({ from: S('dk1', 0.3), to: S('dk1', 0.8), side: 'L' }, { from: S('dk2', 0.3), to: S('dk2', 0.8), side: 'R' });
side(S('sweep', 0.1), S('sweep', 0.35), 'L', 'tyres', 6, { verge: 'grass', plat: 8, tal: 11 });
side(S('sweep', 0.35), S('sw', 0.2), 'L', 'tyres', 10, { verge: 'grass', plat: 12, tal: 11 });
side(S('sweep', 0.1), S('sw', 0.2), 'R', 'guardrail', 2.8, { verge: 'grass', plat: 4.6, tal: 10 });
side(S('sw', 0.2), S('kink', 0.1), 'L', 'woodfence', 3.6, { verge: 'grass', plat: 5.4, tal: 11 });
side(S('sw', 0.2), S('kink', 0.1), 'R', 'woodfence', 3.6, { verge: 'grass', plat: 5.4, tal: 11 });
side(S('kink', 0.1), S('e', 0.02), 'L', 'woodfence', 3.2, { verge: 'grass', plat: 5, tal: 10 });
side(S('kink', 0.1), S('e', 0.02), 'R', 'guardrail', 4.2, { verge: 'grass', plat: 6, tal: 10 });
// bridge approaches + span (the exact span is in "bridge" below)
const BR_N = 15, BR_S = 13; // metres of approach on firm ground at each end of segment e
const bridge = { from: S('e', 0, BR_N), to: S('e', 1, -BR_S) };
side(S('e', 0.02), bridge.from, 'L', 'guardrail', 1.5, { verge: 'gravel', plat: 3.4, tal: 8 });
side(S('e', 0.02), bridge.from, 'R', 'guardrail', 1.5, { verge: 'gravel', plat: 3.4, tal: 8 });
side(bridge.from, bridge.to, 'L', 'bridgeparapet', 0.9, { apron: 0.9, apronMat: 'concrete', verge: 'none', plat: 3.2, tal: 6 });
side(bridge.from, bridge.to, 'R', 'bridgeparapet', 0.9, { apron: 0.9, apronMat: 'concrete', verge: 'none', plat: 3.2, tal: 6 });
side(bridge.to, S('last', 0.12), 'L', 'guardrail', 1.5, { verge: 'gravel', plat: 3.4, tal: 8 });
side(bridge.to, S('last', 0.12), 'R', 'guardrail', 1.5, { verge: 'gravel', plat: 3.4, tal: 8 });
// --- last corner: gravel/sand trap on the outside
side(S('last', 0.12), S('last', 0.4), 'L', 'tyres', 7, { verge: 'sand', plat: 9, tal: 9 });
side(S('last', 0.4), S('last', 0.9), 'L', 'tyres', 11, { verge: 'sand', plat: 13, tal: 9 });
side(S('last', 0.12), S('last', 0.9), 'R', 'concrete', 2.4, { verge: 'grass', plat: 5, tal: 10 });

// ---------------------------------------------------------------------------
// 6. Kerbs (zebras), by distance along the spline
// ---------------------------------------------------------------------------
const kerb = (from, to, which) => kerbs.push({ from, to, side: which });
kerb(S('r1', 0.2), S('r1', 0.8), 'R'); kerb(S('r1', 0.7), S('legA', 0.3), 'L');
kerb(S('h1', 0.12), S('h1', 0.88), 'R'); kerb(S('h1', 0.8), S('legB', 0.12), 'L');
kerb(S('h2', 0.12), S('h2', 0.88), 'L'); kerb(S('h2', 0.8), S('legC', 0.09), 'R');
kerb(S('r2', 0.2), S('r2', 0.8), 'R'); kerb(S('r2', 0.75), S('legN', 0.2), 'L');
kerb(S('r3', 0.2), S('r3', 0.8), 'R');
kerb(S('vb1', 0.15), S('vb1', 0.85), 'R'); kerb(S('vb1', 0.8), S('v2', 0.6), 'L');
kerb(S('vb2', 0.15), S('vb2', 0.85), 'L'); kerb(S('vb2', 0.8), S('v3', 0.14), 'R');
kerb(S('sweep', 0.3), S('sweep', 0.75), 'R'); kerb(S('sweep', 0.8), S('sw', 0.4), 'L');
kerb(S('kink', 0.25), S('kink', 0.75), 'L');
kerb(S('last', 0.2), S('last', 0.8), 'R'); kerb(S('last', 0.72), S('orla_b', 0.18), 'L');

// ---------------------------------------------------------------------------
// 7. Coastline (land polygon, clockwise seen from above) with a steepness per vertex:
//    0 = beach profile, 1 = cliff. All vertices are placed relative to the layout.
// ---------------------------------------------------------------------------
const coast = [];
const cv = (p, steep) => coast.push({ x: r1(p.x), z: r1(p.z), steep });
const abs = (x, z) => ({ x, z });
const pe = P('e', 0), pe1 = P('e', 1);
const xE = pe.x;                         // the bridge runs north-south at this x
const zN = pe.z + BR_N + 10;             // north waterline under the bridge
const zS = pe1.z - BR_S - 10;            // south waterline under the bridge
// south beach, from the east end to the west end (waterline 58 m left of the centre line)
cv(P('last', 0.78, -118), 0.25);
for (let f = 0.1; f <= 1.001; f += 0.3) cv(P('orla_b', f, -58 - 4 * Math.sin(f * 7)), 0);
for (let f = 0.0; f <= 1.001; f += 0.125) cv(P('orla_a', f, -58 - 5 * Math.sin(f * 9 + 1)), 0);
// headland: beach narrows, cliffs start
cv(P('r1', 0.45, -70), 0.2);
cv(P('r1', 1.0, -76), 0.6);
cv(P('legA', 0.7, -84), 0.9);
cv(P('h1', 0.3, -92), 1);
cv(P('h1', 0.55, -122), 1);
{ const c = P('legC', 1); cv(abs(c.x - 78, c.z + 70), 1); cv(abs(c.x - 150, c.z + 38), 1); cv(abs(c.x - 176, c.z - 20), 1); }
cv(P('r2', 0.75, -86), 1);
cv(P('legN', 0.5, -64), 1);
cv(P('legN', 1.0, -66), 1);
cv(P('r3', 0.4, -104), 1);
{ const c = P('r3', 1); cv(abs(c.x - 150, c.z - 150), 1); cv(abs(c.x - 260, c.z - 420), 1); cv(abs(c.x - 300, c.z - 900), 1); }
// far north (off map) and back down the east coast
{ const c = P('d', 1); cv(abs(c.x + 330, c.z - 900), 1); cv(abs(c.x + 250, c.z - 420), 1); cv(abs(c.x + 190, c.z - 150), 1); }
cv(P('sweep', 0.35, -118), 0.9);
cv(P('sweep', 0.75, -108), 0.9);
cv(P('sw', 0.6, -100), 0.8);
// inlet: north shore (east -> west), head, south shore (west -> east)
cv(abs(xE + 122, zN - 14), 0.8);
cv(abs(xE + 56, zN - 2), 0.7);
cv(abs(xE, zN), 0.7);
cv(abs(xE - 52, zN + 6), 0.6);
cv(abs(xE - 92, (zN + zS) / 2 - 4), 0.15);
cv(abs(xE - 56, zS - 5), 0.5);
cv(abs(xE, zS), 0.7);
cv(abs(xE + 58, zS + 1), 0.7);
cv(abs(xE + 120, zS + 12), 0.7);
cv(P('last', 0.3, -122), 0.5);

// ---------------------------------------------------------------------------
// 8. Landmarks and designed places, always relative to the spline
// ---------------------------------------------------------------------------
const grid = { slots: 6, firstS: -7, rowGap: 8.5, lateral: 2.7 };
const checkpoints = { count: Math.round(L / 100) };
const places = {
  startGantry: { s: 0 },
  mirante: { s: S('h2', 0.5), side: 'R' },
  lighthouse: { s: S('r2', 0.45), d: -56 },
  // the square lies on the outside of the first village corner, the church closes its far side
  plaza: { s: S('vb1', 0.5), side: 'L', length: 58, depth: 38 },
  church: { s: S('vb1', 0.5), side: 'L', d: -34 },
  sideStreets: [
    { s: S('v1', 0.42), side: 'L', width: 5.2 },
    { s: S('v1', 0.78), side: 'R', width: 4.6 },
    { s: S('v2', 0.6), side: 'R', width: 4.8 },
    { s: S('v3', 0.3), side: 'L', width: 5.0 },
    { s: S('v3', 0.62), side: 'R', width: 4.4 },
  ],
};

const out = {
  name: 'Costa do Sol',
  comment: 'Single source of the world. Generated by scripts/make-track.mjs; x = east, y = up, z = south, metres. bank in degrees (+ = right side lower). s = distance along the lap from the start/finish line.',
  version: 1,
  seed: 341117,
  seaLevel: 0,
  sun: { heading: 165, elevation: 8.5 },
  length: r2(L),
  spline: { type: 'catmull-rom', closed: true, points },
  zones, sides, kerbs, bridge, coast, grid, checkpoints, places,
  segments: PATH.bounds.map((b) => ({ id: b.id, from: S(b.id, 0), to: S(b.id, 1) })),
};
fs.writeFileSync(path.join(ROOT, 'track.json'), JSON.stringify(out, null, 1).replace(/\{\n\s+"x": ([-\d.]+),\n\s+"y": ([-\d.]+),\n\s+"z": ([-\d.]+),\n\s+"w": ([-\d.]+),\n\s+"bank": ([-\d.]+)\n\s+\}/g, '{ "x": $1, "y": $2, "z": $3, "w": $4, "bank": $5 }').replace(/\{\n\s+"x": ([-\d.]+),\n\s+"z": ([-\d.]+),\n\s+"steep": ([-\d.]+)\n\s+\}/g, '{ "x": $1, "z": $2, "steep": $3 }'));
// quick report
let minR = Infinity, maxGrade = 0, maxBank = 0, minY = Infinity, maxY = -Infinity;
for (let i = 0; i < spline.n; i++) {
  const k = Math.abs(spline.kappa[i]); if (k > 1e-6) minR = Math.min(minR, 1 / k);
  maxGrade = Math.max(maxGrade, Math.abs(spline.grade[i])); maxBank = Math.max(maxBank, Math.abs(spline.bank[i]) / DEG);
  minY = Math.min(minY, spline.y[i]); maxY = Math.max(maxY, spline.y[i]);
}
let minRs = 0; for (let i = 0; i < spline.n; i++) { const k = Math.abs(spline.kappa[i]); if (k > 1e-6 && Math.abs(1 / k - minR) < 1e-6) minRs = i * spline.ds; }
console.log(`min radius ${minR.toFixed(1)} m at s=${minRs.toFixed(0)}, max grade ${(maxGrade * 100).toFixed(1)} %, max bank ${maxBank.toFixed(1)} deg, height ${minY.toFixed(1)}..${maxY.toFixed(1)} m`);
console.log('zones:', zones.map((z) => `${z.id} ${z.from}->${z.to}`).join('  '));
console.log('bridge:', bridge, 'bounds', JSON.stringify(spline.bounds));
