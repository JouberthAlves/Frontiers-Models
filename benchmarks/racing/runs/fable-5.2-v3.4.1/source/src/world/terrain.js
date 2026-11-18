// Heightfield terrain, derived from the track: the natural landform is a smooth surface
// interpolated through the track heights (so the land follows the circuit), shaped by the
// coastline of track.json, and then graded ("conformed") so that it always meets the road:
// a flat platform beside the road followed by a 6-15 m talus. The same Float32Array is used
// for the visible mesh, for physics queries and for object placement (ray casts).

import { clamp, clamp01, lerp, smoothstep, smin } from '../core/math.js';
import { fbm2, ridged2, noise2 } from '../core/rng.js';
import { EXCLUSION, TERRAIN_SINK, BARRIER_TYPES } from './track.js';

export const CELL = 2.0;
const BT = Object.fromEntries(BARRIER_TYPES.map((n, i) => [n, i]));

// ---- coastline helpers -------------------------------------------------------------
function chaikin(poly, iterations = 2) {
  let p = poly;
  for (let it = 0; it < iterations; it++) {
    const q = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      q.push({ x: a.x * 0.75 + b.x * 0.25, z: a.z * 0.75 + b.z * 0.25, steep: a.steep * 0.75 + b.steep * 0.25 });
      q.push({ x: a.x * 0.25 + b.x * 0.75, z: a.z * 0.25 + b.z * 0.75, steep: a.steep * 0.25 + b.steep * 0.75 });
    }
    p = q;
  }
  return p;
}

export class Coast {
  constructor(points) {
    this.poly = chaikin(points, 3);
    const n = this.poly.length;
    this.ax = new Float64Array(n); this.az = new Float64Array(n); this.ex = new Float64Array(n); this.ez = new Float64Array(n);
    this.el = new Float64Array(n); this.s0 = new Float32Array(n); this.s1 = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = this.poly[i], b = this.poly[(i + 1) % n];
      this.ax[i] = a.x; this.az[i] = a.z; this.ex[i] = b.x - a.x; this.ez[i] = b.z - a.z;
      this.el[i] = this.ex[i] * this.ex[i] + this.ez[i] * this.ez[i] || 1e-9;
      this.s0[i] = a.steep; this.s1[i] = b.steep;
    }
  }
  /** signed distance to the waterline (+ on land) and the local coast steepness (0 beach .. 1 cliff) */
  query(x, z, out) {
    const n = this.poly.length; let best = Infinity, steep = 0, inside = false;
    for (let i = 0; i < n; i++) {
      const ax = this.ax[i], az = this.az[i], ex = this.ex[i], ez = this.ez[i];
      let t = ((x - ax) * ex + (z - az) * ez) / this.el[i]; if (t < 0) t = 0; else if (t > 1) t = 1;
      const dx = ax + ex * t - x, dz = az + ez * t - z; const d = dx * dx + dz * dz;
      if (d < best) { best = d; steep = this.s0[i] + (this.s1[i] - this.s0[i]) * t; }
      const bz = az + ez;
      if ((az > z) !== (bz > z)) { const xi = ax + (z - az) / ez * ex; if (x < xi) inside = !inside; }
    }
    out.dist = (inside ? 1 : -1) * Math.sqrt(best); out.steep = steep;
    return out;
  }
}

// ---- coarse scalar grid with bilinear sampling ---------------------------------------
class Grid2 {
  constructor(x0, z0, cell, nx, nz) { this.x0 = x0; this.z0 = z0; this.cell = cell; this.nx = nx; this.nz = nz; this.v = new Float32Array(nx * nz); }
  sample(x, z) {
    let fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    fx = clamp(fx, 0, this.nx - 1.001); fz = clamp(fz, 0, this.nz - 1.001);
    const ix = Math.floor(fx), iz = Math.floor(fz); const tx = fx - ix, tz = fz - iz;
    const i = iz * this.nx + ix; const v = this.v;
    return (v[i] * (1 - tx) + v[i + 1] * tx) * (1 - tz) + (v[i + this.nx] * (1 - tx) + v[i + this.nx + 1] * tx) * tz;
  }
}

export class Terrain {
  /**
   * @param {import('./track.js').Track} track
   */
  constructor(track, opts = {}) {
    const t0 = Date.now();
    this.track = track; const sp = track.spline; const json = track.json;
    this.seed = track.seed; this.seaLevel = json.seaLevel || 0;
    const b = sp.bounds;
    const cell = this.cell = CELL;
    this.x0 = Math.floor((b.minX - 310) / 16) * 16; this.z0 = Math.floor((b.minZ - 250) / 16) * 16;
    const x1 = Math.ceil((b.maxX + 310) / 16) * 16, z1 = Math.ceil((b.maxZ + 200) / 16) * 16;
    this.nx = Math.round((x1 - this.x0) / cell) + 1; this.nz = Math.round((z1 - this.z0) / cell) + 1;
    this.x1 = x1; this.z1 = z1;
    const nx = this.nx, nz = this.nz;
    this.h = new Float32Array(nx * nz);
    this.coast = new Coast(json.coast);

    // --- coarse fields: coast distance / steepness, distance to track, interpolated base surface
    const cc = 8;
    const cnx = Math.round((x1 - this.x0) / cc) + 1, cnz = Math.round((z1 - this.z0) / cc) + 1;
    const gDist = this.gCoast = new Grid2(this.x0, this.z0, cc, cnx, cnz);
    const gSteep = this.gSteep = new Grid2(this.x0, this.z0, cc, cnx, cnz);
    const q = {};
    for (let iz = 0; iz < cnz; iz++) for (let ix = 0; ix < cnx; ix++) {
      this.coast.query(this.x0 + ix * cc, this.z0 + iz * cc, q);
      gDist.v[iz * cnx + ix] = q.dist; gSteep.v[iz * cnx + ix] = q.steep;
    }
    const bc = 16;
    const bnx = Math.round((x1 - this.x0) / bc) + 1, bnz = Math.round((z1 - this.z0) / bc) + 1;
    const gBase = this.gBase = new Grid2(this.x0, this.z0, bc, bnx, bnz);
    const gTrackD = this.gTrackD = new Grid2(this.x0, this.z0, bc, bnx, bnz);
    const sub = []; for (let i = 0; i < sp.n; i += 8) sub.push(i);
    for (let iz = 0; iz < bnz; iz++) for (let ix = 0; ix < bnx; ix++) {
      const x = this.x0 + ix * bc, z = this.z0 + iz * bc;
      let sw = 0, sh = 0, dmin = Infinity;
      for (let k = 0; k < sub.length; k++) {
        const i = sub[k]; const dx = sp.x[i] - x, dz = sp.z[i] - z; const d2 = dx * dx + dz * dz;
        if (d2 < dmin) dmin = d2;
        const w = 1 / Math.pow(d2 + 60, 1.6);
        sw += w; sh += w * sp.y[i];
      }
      gBase.v[iz * bnx + ix] = sh / sw; gTrackD.v[iz * bnx + ix] = Math.sqrt(dmin);
    }

    // --- natural landform
    const h = this.h;
    for (let iz = 0; iz < nz; iz++) {
      const z = this.z0 + iz * cell;
      for (let ix = 0; ix < nx; ix++) {
        const x = this.x0 + ix * cell;
        h[iz * nx + ix] = this.naturalHeight(x, z);
      }
    }
    this.tNatural = Date.now() - t0;

    // --- grade the terrain to the road (platform + talus), see header
    this._conform();
    this._buildMasks();
    this.buildMs = Date.now() - t0;
  }

  /** landform before grading; also used for the far, low-resolution ring outside the height field */
  naturalHeight(x, z) {
    const seed = this.seed;
    const cd = this.gCoast.sample(x, z) + 5 * noise2(x / 55, z / 55, seed + 3);
    const steep = this.gSteep.sample(x, z);
    if (cd <= 0) {
      // sea bed: beaches shelve gently, cliffs drop off
      const d = -cd;
      const beach = -(0.034 * d + 0.9 * (1 - Math.exp(-d / 26)));
      const cliff = -(5.5 * (1 - Math.exp(-d / 7)) + 0.03 * d);
      return Math.max(-26, lerp(beach, cliff, steep)) + 0.25 * noise2(x / 13, z / 13, seed + 5) * smoothstep(0, 20, d);
    }
    const dTrack = this.gTrackD.sample(x, z);
    let hh = this.gBase.sample(x, z);
    const a = smoothstep(22, 120, dTrack);
    hh += a * (fbm2(x / 150, z / 150, 4, seed + 11) * 10 + fbm2(x / 41, z / 41, 3, seed + 17) * 2.4);
    hh += smoothstep(9, 26, dTrack) * fbm2(x / 11, z / 11, 3, seed + 23) * 0.35;
    // hills behind the village (north) for the backdrop
    const north = smoothstep(-640, -1500, z);
    hh += north * (60 + 90 * ridged2(x / 520, z / 520, 4, seed + 29));
    // coastal profile: the land must come down to the waterline
    const beachCap = 0.085 * cd * Math.exp(-cd / 60) + 0.03 * cd + Math.max(0, cd - 46) * 0.55 + 0.12 * noise2(x / 6, z / 6, seed + 31) * smoothstep(3, 14, cd);
    const cliffCap = 2.1 * cd + 6 * ridged2(x / 24, z / 24, 3, seed + 37) * smoothstep(0, 10, cd);
    const cap = lerp(beachCap, cliffCap, smoothstep(0.1, 0.75, steep));
    return smin(hh, cap, 2.5);
  }

  _conform() {
    const track = this.track, sp = track.spline; const n = sp.n;
    const nx = this.nx, nz = this.nz, cell = this.cell, x0 = this.x0, z0 = this.z0;
    const N = nx * nz;
    // two candidate track "portions" per node (nearest sample of each)
    const sI = [new Int32Array(N).fill(-1), new Int32Array(N).fill(-1)];
    const sD = [new Float32Array(N).fill(1e30), new Float32Array(N).fill(1e30)];
    const samePortion = (a, bb) => { let d = Math.abs(a - bb); if (d > n / 2) d = n - d; return d < 110; };
    for (let i = 0; i < n; i++) {
      const cx = sp.x[i], cz = sp.z[i];
      const R = sp.half[i] + Math.max(track.plat[0][i] + track.tal[0][i], track.plat[1][i] + track.tal[1][i]) + 52;
      const ix0 = Math.max(0, Math.floor((cx - R - x0) / cell)), ix1 = Math.min(nx - 1, Math.ceil((cx + R - x0) / cell));
      const iz0 = Math.max(0, Math.floor((cz - R - z0) / cell)), iz1 = Math.min(nz - 1, Math.ceil((cz + R - z0) / cell));
      const R2 = R * R;
      for (let iz = iz0; iz <= iz1; iz++) {
        const dz = z0 + iz * cell - cz;
        for (let ix = ix0; ix <= ix1; ix++) {
          const dx = x0 + ix * cell - cx; const d2 = dx * dx + dz * dz;
          if (d2 > R2) continue;
          const id = iz * nx + ix;
          const a0 = sI[0][id], a1 = sI[1][id];
          if (a0 < 0) { sI[0][id] = i; sD[0][id] = d2; }
          else if (samePortion(i, a0)) { if (d2 < sD[0][id]) { sI[0][id] = i; sD[0][id] = d2; } }
          else if (a1 < 0) { sI[1][id] = i; sD[1][id] = d2; }
          else if (samePortion(i, a1)) { if (d2 < sD[1][id]) { sI[1][id] = i; sD[1][id] = d2; } }
          else if (d2 < Math.max(sD[0][id], sD[1][id])) { const k = sD[0][id] > sD[1][id] ? 0 : 1; sI[k][id] = i; sD[k][id] = d2; }
        }
      }
    }
    const pr = {};
    const h = this.h; const seed = this.seed;
    this.nearS = new Float32Array(N).fill(-1);   // lap distance of the dominant portion (for masks / zones)
    this.nearD = new Float32Array(N).fill(1e9);  // signed lateral distance to it
    this.confW = new Float32Array(N);
    for (let id = 0; id < N; id++) {
      if (sI[0][id] < 0) continue;
      const x = x0 + (id % nx) * cell, z = z0 + Math.floor(id / nx) * cell;
      let sumA = 0, sumH = 0, sumOff = 0, wMax = 0, bestA = -1, ceil = Infinity;
      for (let k = 0; k < 2; k++) {
        const hint = sI[k][id]; if (hint < 0) continue;
        sp.project(x, z, hint, pr);
        const i = pr.i, t = pr.t, j = (i + 1) % n; const d = pr.d; const side = d < 0 ? 0 : 1;
        // true distance to the centre line: equals |d| at a perpendicular foot, larger when this
        // candidate is not a local minimum (then it must not be mistaken for a point on the road)
        const ad = Math.max(Math.abs(d), pr.dist);
        const half = lerp(sp.half[i], sp.half[j], t);
        // points beyond the ends of a segment fan (inside of tight corners) are measured radially
        const plat = lerp(track.plat[side][i], track.plat[side][j], t), tal = lerp(track.tal[side][i], track.tal[side][j], t);
        const core = half + plat;
        const conf = lerp(track.conform[i], track.conform[j], t);
        const w = (1 - smoothstep(core, core + tal, ad)) * conf;
        const H = track.planeHeight(i, t, d < 0 ? -ad : ad) - TERRAIN_SINK;
        const delta = Math.max(0, ad - (half + EXCLUSION));
        const a = (w + 1e-4) / Math.pow(delta + 0.05, 4);
        // cut (rock wall) / fill (guard rail) slopes just beyond the talus
        const bt = track.barType[side][i];
        let amp = 0;
        if (bt === BT.rockwall) amp = 8.5 * (0.75 + 0.5 * fbm2(x / 23, z / 23, 2, seed + 41));
        else if (bt === BT.guardrail) amp = -3.6;
        else if (bt === BT.parapet) amp = -5.0;
        else if (bt === BT.seawall) amp = -0.85;
        const off = amp * conf * smoothstep(core, core + tal, ad) * (1 - smoothstep(core + tal + 8, core + tal + 46, ad));
        sumA += a; sumH += a * H; sumOff += a * off;
        // under and beside the bridge deck the ground is free, but it may never rise above the deck
        if (conf < 1 && ad < half + 6) ceil = Math.min(ceil, H - (1 - conf) * 1.2);
        if (w > wMax) wMax = w;
        if (a > bestA) { bestA = a; this.nearS[id] = pr.s; this.nearD[id] = d; }
      }
      if (sumA <= 0) continue;
      const Hc = sumH / sumA, off = sumOff / sumA;
      const nat = h[id];
      // never raise the sea bed / waterline with a cut slope, never dig below it with a fill slope
      const natOff = nat > 0.6 ? Math.max(0.5, nat + off) : nat;
      h[id] = Math.min(lerp(natOff, Hc, wMax), ceil);
      this.confW[id] = wMax;
    }
  }

  _buildMasks() {
    // control maps for the terrain material and for placement rules (0..255)
    const track = this.track, sp = track.spline; const nx = this.nx, nz = this.nz, N = nx * nz;
    const cell = this.cell; const seed = this.seed;
    const sand = this.mSand = new Uint8Array(N), rock = this.mRock = new Uint8Array(N), forest = this.mForest = new Uint8Array(N), paved = this.mPaved = new Uint8Array(N);
    const gravel = this.mGravel = new Uint8Array(N);
    const VERGE = { none: 0, sand: 1, grass: 2, gravel: 3, paved: 4 };
    const n = sp.n;
    // paved rectangles of the village behind the building line: the side streets and the church square
    const rects = []; const places = track.json.places || {}; const q = {};
    const rectAt = (s, sideName, halfB, depth) => {
      const side = sideName === 'L' ? 0 : 1, sg = side ? 1 : -1; const d = sg * (sp.sampleArr(sp.half, s) + sp.sampleArr(track.barOff[side], s));
      const o = sp.pointAt(s, d, q); rects.push({ x: o.x, z: o.z, rx: o.hx * sg, rz: o.hz * sg, fx: Math.cos(o.heading), fz: Math.sin(o.heading), halfB, depth });
    };
    for (const st of places.sideStreets || []) rectAt(st.s, st.side, st.width / 2 + 0.9, 33);
    if (places.plaza) rectAt(places.plaza.s, places.plaza.side, places.plaza.length / 2 + 1.5, 21);
    const inRect = (x, z) => { for (const r of rects) { const dx = x - r.x, dz = z - r.z; const a = dx * r.rx + dz * r.rz, b = dx * r.fx + dz * r.fz; if (a > -4 && a < r.depth && Math.abs(b) < r.halfB) return true; } return false; };
    for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
      const id = iz * nx + ix; const x = this.x0 + ix * cell, z = this.z0 + iz * cell;
      const cd = this.gCoast.sample(x, z), steep = this.gSteep.sample(x, z), hh = this.h[id];
      // beach sand
      let s = (1 - smoothstep(0.25, 0.6, steep)) * (1 - smoothstep(3.2, 5.0, hh)) * (1 - smoothstep(52, 74, cd + 6 * noise2(x / 30, z / 30, seed + 51)));
      if (cd < 0) s = 1 - smoothstep(0.3, 0.7, steep);
      // slope
      const hx = this.h[iz * nx + Math.min(nx - 1, ix + 1)] - this.h[iz * nx + Math.max(0, ix - 1)];
      const hz = this.h[Math.min(nz - 1, iz + 1) * nx + ix] - this.h[Math.max(0, iz - 1) * nx + ix];
      const slope = Math.hypot(hx, hz) / (2 * cell);
      let r = smoothstep(0.62, 1.0, slope + 0.12 * noise2(x / 9, z / 9, seed + 53));
      if (cd > 0 && cd < 40 && steep > 0.5) r = Math.max(r, smoothstep(0.35, 0.7, slope));
      let g = 0, p = 0, f = 0;
      const ns = this.nearS[id];
      if (ns >= 0) {
        const i = Math.floor(ns / sp.ds) % n; const d = this.nearD[id]; const side = d < 0 ? 0 : 1; const ad = Math.abs(d);
        const core = sp.half[i] + track.plat[side][i];
        const inPlat = 1 - smoothstep(core - 0.5, core + 2.5, ad);
        const v = track.verge[side][i];
        if (v === VERGE.sand) s = Math.max(s, inPlat);
        else if (v === VERGE.gravel) g = inPlat;
        else if (v === VERGE.paved) {
          p = inPlat;
          // in the village the fronts stand on paving; behind them come yards and gardens
          if (track.barType[side][i] === BT.facade) { const lineD = sp.half[i] + track.barOff[side][i]; p = inRect(x, z) ? inPlat : inPlat * (1 - smoothstep(lineD + 10.5, lineD + 13.5, ad)); }
        }
        if (track.zone[i] === 3 && !track.bridge[i]) {
          // fades in and out along the lap and has a ragged outer edge: no straight border seen from above
          const edge = 34 * fbm2(x / 38, z / 38, 3, seed + 61), e2 = 70 * (fbm2(x / 30, z / 30, 3, seed + 67) - 0.5);
          const zl = track.zones[3].length, zo = track.zoneOffset(3, ns); const ends = smoothstep(0, 60, zo + e2) * smoothstep(0, 60, zl - zo + e2);
          f = (1 - smoothstep(60, 115, ad + edge)) * smoothstep(sp.half[i] + 2, sp.half[i] + 7, ad) * ends;
        }
      }
      f = Math.max(f, smoothstep(0.1, 0.5, fbm2(x / 120, z / 120, 3, seed + 57)) * 0.8 * smoothstep(40, 90, this.gTrackD.sample(x, z)));
      if (hh < 0.4 || s > 0.5) f = 0;
      sand[id] = Math.round(clamp01(s) * 255); rock[id] = Math.round(clamp01(r) * 255);
      gravel[id] = Math.round(clamp01(g) * 255); paved[id] = Math.round(clamp01(p) * 255); forest[id] = Math.round(clamp01(f) * 255);
    }
  }

  inBounds(x, z) { return x >= this.x0 && x <= this.x1 && z >= this.z0 && z <= this.z1; }

  /** terrain height; inside the height field it interpolates the exact triangles of the mesh */
  heightAt(x, z) {
    const fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    if (fx < 0 || fz < 0 || fx > this.nx - 1 || fz > this.nz - 1) return this.naturalHeight(x, z);
    let ix = Math.floor(fx), iz = Math.floor(fz);
    if (ix >= this.nx - 1) ix = this.nx - 2; if (iz >= this.nz - 1) iz = this.nz - 2;
    const tx = fx - ix, tz = fz - iz; const i = iz * this.nx + ix; const h = this.h;
    const h00 = h[i], h10 = h[i + 1], h01 = h[i + this.nx], h11 = h[i + this.nx + 1];
    // quads are split along the (0,0)-(1,1) diagonal, same as the render mesh
    if (tx >= tz) return h00 + (h10 - h00) * tx + (h11 - h10) * tz;
    return h00 + (h11 - h01) * tx + (h01 - h00) * tz;
  }

  normalAt(x, z, out = {}) {
    const e = this.cell;
    const hx = this.heightAt(x + e, z) - this.heightAt(x - e, z), hz = this.heightAt(x, z + e) - this.heightAt(x, z - e);
    const nx = -hx, ny = 2 * e, nz = -hz; const l = Math.hypot(nx, ny, nz) || 1;
    out.x = nx / l; out.y = ny / l; out.z = nz / l; return out;
  }

  slopeAt(x, z) {
    const e = this.cell;
    const hx = this.heightAt(x + e, z) - this.heightAt(x - e, z), hz = this.heightAt(x, z + e) - this.heightAt(x, z - e);
    return Math.hypot(hx, hz) / (2 * e);
  }

  maskAt(mask, x, z) {
    const ix = clamp(Math.round((x - this.x0) / this.cell), 0, this.nx - 1), iz = clamp(Math.round((z - this.z0) / this.cell), 0, this.nz - 1);
    return mask[iz * this.nx + ix] / 255;
  }
  coastDist(x, z) { return this.gCoast.sample(x, z); }
  coastSteep(x, z) { return this.gSteep.sample(x, z); }
  trackDist(x, z) { return this.gTrackD.sample(x, z); }
}
