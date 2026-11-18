// Runtime view of track.json: spline samples plus everything that is laid out "by distance
// along the spline" (road sides, aprons, kerbs, barrier lines, zones, bridge, checkpoints, grid).
// The road/apron surface defined here is used both to build the visible mesh (render/road.js)
// and to answer the physics ground queries (surfaceAt): one data set, two consumers.

import { TrackSpline } from './spline.js';
import { clamp, clamp01, lerp, smoothstep } from '../core/math.js';

export const BARRIER_TYPES = ['none', 'seawall', 'concrete', 'tyres', 'guardrail', 'rockwall', 'parapet', 'stonewall', 'facade', 'woodfence', 'bridgeparapet'];
export const VERGE_TYPES = ['none', 'sand', 'grass', 'gravel', 'paved'];
export const APRON_MATS = ['none', 'concrete', 'paving'];
// surface ids shared by physics, audio and particles
export const SURF = { ASPHALT: 0, KERB: 1, SAND: 2, GRASS: 3, GRAVEL: 4, PAVING: 5, CONCRETE: 6, BRIDGE: 7 };
export const SURF_NAMES = ['asphalt', 'kerb', 'sand', 'grass', 'gravel', 'paving', 'concrete', 'bridge'];

export const KERB_W = 1.3;        // kerb strip width (m)
export const KERB_H = 0.045;      // kerb crest above the road plane (m)
export const PAVE_H = 0.05;       // sidewalk level above the road plane (m)
export const STRIP_COLS = 5;      // profile points per side strip
export const EXCLUSION = 3.0;     // no object within this distance of the road edge (m)
export const TERRAIN_SINK = 0.06; // the graded terrain sits this far below the road plane (m)
export const PLANE_EXT = 6.5;     // the banked road plane is extended this far beyond the road edge (m)

function inRange(s, from, to, L) {
  if (from <= to) return s >= from && s < to;
  return s >= from || s < to; // wraps through the start line
}

function blurCircular(arr, radius, passes = 2) {
  const n = arr.length; let src = arr, tmp = new Float32Array(n);
  for (let p = 0; p < passes; p++) {
    let acc = 0; const w = radius * 2 + 1;
    for (let k = -radius; k <= radius; k++) acc += src[((k % n) + n) % n];
    for (let i = 0; i < n; i++) {
      tmp[i] = acc / w;
      acc += src[(i + radius + 1) % n] - src[((i - radius) % n + n) % n];
    }
    const t = src; src = tmp; tmp = t === arr ? new Float32Array(n) : t;
  }
  if (src !== arr) arr.set(src);
  return arr;
}

export class Track {
  constructor(json) {
    this.json = json;
    this.seed = json.seed >>> 0;
    const sp = this.spline = new TrackSpline(json.spline.points, 1.0);
    const n = this.n = sp.n; this.length = sp.length; this.ds = sp.ds;
    const L = sp.length;
    const mkF = () => [new Float32Array(n), new Float32Array(n)];
    const mkU = () => [new Uint8Array(n), new Uint8Array(n)];
    this.barOff = mkF(); this.barType = mkU();
    this.apronW = mkF(); this.apronMat = mkU();
    this.verge = mkU(); this.plat = mkF(); this.tal = mkF();
    this.kerb = mkU();
    this.ext = mkF();               // width of the side strip (apron and/or kerb) beyond the road edge
    this.zone = new Uint8Array(n);  // 0..3 -> Z1..Z4
    this.bridge = new Uint8Array(n);
    this.conform = new Float32Array(n).fill(1); // 1 = terrain is graded to the road, 0 = free (bridge span)

    for (let i = 0; i < n; i++) {
      const s = i * sp.ds;
      for (let zi = 0; zi < json.zones.length; zi++) if (inRange(s, json.zones[zi].from, json.zones[zi].to, L)) this.zone[i] = zi;
      for (const sd of json.sides) {
        if (!inRange(s, sd.from, sd.to, L)) continue;
        const k = sd.side === 'L' ? 0 : 1;
        this.barOff[k][i] = sd.off; this.barType[k][i] = Math.max(0, BARRIER_TYPES.indexOf(sd.barrier));
        this.apronW[k][i] = sd.apron || 0; this.apronMat[k][i] = Math.max(0, APRON_MATS.indexOf(sd.apronMat || 'none'));
        this.verge[k][i] = Math.max(0, VERGE_TYPES.indexOf(sd.verge)); this.plat[k][i] = sd.plat; this.tal[k][i] = sd.tal;
      }
      for (const kb of json.kerbs) if (inRange(s, kb.from, kb.to, L)) this.kerb[kb.side === 'L' ? 0 : 1][i] = 1;
      if (json.bridge && inRange(s, json.bridge.from, json.bridge.to, L)) this.bridge[i] = 1;
    }
    for (let k = 0; k < 2; k++) {
      blurCircular(this.barOff[k], 10); blurCircular(this.plat[k], 14); blurCircular(this.tal[k], 14);
      // aprons keep their exact width where they exist, and taper to zero over a few metres at their ends
      blurCircular(this.apronW[k], 4);
      for (let i = 0; i < n; i++) {
        if (this.apronW[k][i] < 0.25) { this.apronW[k][i] = 0; }
        // the barrier must always stand outside the strip it protects
        let ext = this.apronW[k][i];
        if (this.kerb[k][i]) ext = Math.max(ext, KERB_W);
        this.ext[k][i] = ext;
        if (this.barOff[k][i] < ext + 0.2 && this.barType[k][i] !== 0) this.barOff[k][i] = ext + 0.2;
        if (this.plat[k][i] < Math.max(EXCLUSION + 0.2, this.barOff[k][i] + 1.4)) this.plat[k][i] = Math.max(EXCLUSION + 0.2, this.barOff[k][i] + 1.4);
      }
      // the strip width may only change smoothly (kerb start/end): short linear tapers
      const e = this.ext[k]; const TAPER = 6;
      for (let pass = 0; pass < 2; pass++) {
        for (let q = 0; q < n * 2; q++) {
          const i = pass === 0 ? q % n : (n * 2 - 1 - q) % n;
          const j = pass === 0 ? (i + n - 1) % n : (i + 1) % n;
          if (e[i] < e[j] - KERB_W / TAPER) e[i] = e[j] - KERB_W / TAPER;
        }
      }
      for (let i = 0; i < n; i++) if (this.barOff[k][i] < e[i] + 0.2 && this.barType[k][i] !== 0) this.barOff[k][i] = e[i] + 0.2;
    }
    // terrain conform weight: 0 over the bridge span, ramping back to 1 over the abutments
    if (json.bridge) {
      const RAMP = 5;
      for (let i = 0; i < n; i++) {
        const s = i * sp.ds;
        if (this.bridge[i]) { this.conform[i] = 0; continue; }
        const dA = Math.abs(sp.deltaS(s, json.bridge.from)), dB = Math.abs(sp.deltaS(s, json.bridge.to));
        this.conform[i] = smoothstep(0, RAMP, Math.min(dA, dB));
      }
    }
    // checkpoints: evenly spaced, checkpoint 0 is the start/finish line
    const cpN = json.checkpoints.count;
    this.checkpoints = [];
    for (let c = 0; c < cpN; c++) this.checkpoints.push({ index: c, s: (c * L) / cpN });
    // grid slots (behind the line, staggered)
    this.gridSlots = [];
    const g = json.grid;
    for (let q = 0; q < g.slots; q++) {
      const s = sp.wrapS(g.firstS - q * g.rowGap);
      const d = (q % 2 === 0 ? -1 : 1) * g.lateral;
      this.gridSlots.push({ slot: q + 1, s, d });
    }
    this.zones = json.zones.map((z, i) => ({ ...z, index: i, length: z.to >= z.from ? z.to - z.from : L - z.from + z.to }));
  }

  zoneIndexAt(s) { return this.zone[Math.floor(this.spline.wrapS(s) / this.ds) % this.n]; }
  zoneAt(s) { return this.zones[this.zoneIndexAt(s)]; }
  onBridge(s) { return this.bridge[Math.floor(this.spline.wrapS(s) / this.ds) % this.n] === 1; }
  /** distance travelled inside a zone from its entry (for the 100 m windows of the audit) */
  zoneOffset(zoneIndex, s) {
    const z = this.zones[zoneIndex]; let o = this.spline.wrapS(s) - z.from; if (o < 0) o += this.length; return o;
  }

  // -------------------------------------------------------------------------
  // Cross-section of the corridor (road + side strips). dist = distance beyond the road edge.
  // Returns the height above the (extended) road plane. The mesh uses the same numbers.
  // -------------------------------------------------------------------------
  stripProfile(side, i, out) {
    // 5 profile points: [dist, dy] ; clamped to the strip width so that columns collapse cleanly
    const ext = this.ext[side][i];
    const hasKerb = this.kerb[side][i] === 1;
    const mat = this.apronW[side][i] > 0 ? this.apronMat[side][i] : 0;
    const ha = mat === 2 ? PAVE_H : 0;         // paving is slightly raised, concrete strips are flush
    const hk = hasKerb ? KERB_H : ha;
    const taper = hasKerb ? 1 : clamp01(ext / KERB_W);
    const d1 = Math.min(0.25, ext), d2 = Math.min(1.05, ext), d3 = Math.min(KERB_W, ext);
    out[0] = 0; out[1] = 0;
    out[2] = d1; out[3] = hk * taper;
    out[4] = d2; out[5] = hk * taper;
    out[6] = d3; out[7] = ha;
    out[8] = ext; out[9] = ha;
    return out;
  }

  /** height above the extended road plane at lateral distance `dist` beyond the edge (side strip only) */
  stripHeight(side, i, dist) {
    const p = this._sp || (this._sp = new Float32Array(10));
    this.stripProfile(side, i, p);
    for (let c = 0; c < STRIP_COLS - 1; c++) {
      const a = p[c * 2], b = p[c * 2 + 2];
      if (dist <= b || c === STRIP_COLS - 2) {
        const t = b - a > 1e-6 ? clamp01((dist - a) / (b - a)) : 1;
        return lerp(p[c * 2 + 1], p[c * 2 + 3], t);
      }
    }
    return 0;
  }

  /** lateral distance from the centre line to the barrier line (always positive) */
  barrierDist(side, s) {
    const sp = this.spline; const fs = sp.wrapS(s) / sp.ds; let a = Math.floor(fs); const t = fs - a; a %= this.n; const b = (a + 1) % this.n;
    return lerp(sp.half[a] + this.barOff[side][a], sp.half[b] + this.barOff[side][b], t);
  }

  /**
   * Physics / gameplay query of the corridor surface under a world point.
   * Uses the very same rows of vertices that render/road.js turns into the road mesh.
   * @returns {boolean} true if (x,z) is on the road or its side strips; fills out {y,nx,ny,nz,surf,s,d,i}
   */
  surfaceAt(x, z, hint, out) {
    const sp = this.spline; const n = this.n;
    const pr = sp.project(x, z, hint, out);
    const i = pr.i, t = pr.t, d = pr.d; const j = (i + 1) % n;
    const half = lerp(sp.half[i], sp.half[j], t);
    const ad = Math.abs(d); const side = d < 0 ? 0 : 1; const sg = d < 0 ? -1 : 1;
    const ext = lerp(this.ext[side][i], this.ext[side][j], t);
    out.onRoad = ad <= half; out.half = half; out.side = side;
    if (ad > half + ext) return false;
    // plane of the road row interpolated along the segment (rows are 1 m apart: the bilinear
    // patch and the two mesh triangles differ by well under a millimetre; validateWorld checks it)
    let y = lerp(sp.y[i], sp.y[j], t) + lerp(sp.cs[i], sp.cs[j], t) * d;
    if (ad <= half) {
      // on the carriageway: interpolate the actual triangles of the road mesh (rows i-1 .. i+2)
      let ym = this._quadHeight(i, x, z);
      if (ym !== ym) { ym = this._quadHeight((i + 1) % n, x, z); if (ym !== ym) ym = this._quadHeight((i + n - 1) % n, x, z); }
      if (ym === ym) y = ym;
    }
    let surf = this.bridge[i] ? SURF.BRIDGE : SURF.ASPHALT;
    if (ad > half) {
      const dist = ad - half;
      y += lerp(this.stripHeight(side, i, dist), this.stripHeight(side, j, dist), t);
      // same rule as the mesh builder: the first KERB_W metres are kerb where a kerb (or its taper) exists
      const kerbLike = (this.kerb[side][i] === 1 || this.apronW[side][i] === 0) && dist <= KERB_W;
      if (kerbLike) surf = SURF.KERB;
      else surf = this.apronMat[side][i] === 2 ? SURF.PAVING : SURF.CONCRETE;
    }
    out.y = y;
    // normal of the banked, sloped plane
    out.nx = lerp(sp.nx[i], sp.nx[j], t); out.ny = lerp(sp.ny[i], sp.ny[j], t); out.nz = lerp(sp.nz[i], sp.nz[j], t);
    out.surf = surf;
    return true;
  }

  /** height of the road mesh quad between rows i and i+1 under (x,z); NaN if the point is outside it */
  _quadHeight(i, x, z) {
    const sp = this.spline; const j = (i + 1) % this.n;
    const hi = sp.half[i], hj = sp.half[j];
    // same vertices as road-geometry.js: A0/B0 = row i left/right, A1/B1 = row j left/right
    const a0x = sp.x[i] - sp.rx[i] * hi, a0z = sp.z[i] - sp.rz[i] * hi, a0y = sp.y[i] - sp.cs[i] * hi;
    const b0x = sp.x[i] + sp.rx[i] * hi, b0z = sp.z[i] + sp.rz[i] * hi, b0y = sp.y[i] + sp.cs[i] * hi;
    const a1x = sp.x[j] - sp.rx[j] * hj, a1z = sp.z[j] - sp.rz[j] * hj, a1y = sp.y[j] - sp.cs[j] * hj;
    const b1x = sp.x[j] + sp.rx[j] * hj, b1z = sp.z[j] + sp.rz[j] * hj, b1y = sp.y[j] + sp.cs[j] * hj;
    // triangles (A0, B0, A1) and (B0, B1, A1)
    let det = (b0z - a1z) * (a0x - a1x) + (a1x - b0x) * (a0z - a1z);
    let l0 = ((b0z - a1z) * (x - a1x) + (a1x - b0x) * (z - a1z)) / det;
    let l1 = ((a1z - a0z) * (x - a1x) + (a0x - a1x) * (z - a1z)) / det;
    let l2 = 1 - l0 - l1;
    const E = -1e-5;
    if (l0 >= E && l1 >= E && l2 >= E) return l0 * a0y + l1 * b0y + l2 * a1y;
    det = (b1z - a1z) * (b0x - a1x) + (a1x - b1x) * (b0z - a1z);
    l0 = ((b1z - a1z) * (x - a1x) + (a1x - b1x) * (z - a1z)) / det;
    l1 = ((a1z - b0z) * (x - a1x) + (b0x - a1x) * (z - a1z)) / det;
    l2 = 1 - l0 - l1;
    if (l0 >= E && l1 >= E && l2 >= E) return l0 * b0y + l1 * b1y + l2 * a1y;
    return NaN;
  }

  /**
   * Height of the road plane extended sideways (no strips) at a track-space position; used to
   * grade the terrain. The cross slope is only carried PLANE_EXT metres past the road edge, so
   * wide platforms (promenade, village, viewpoint) stay level.
   */
  planeHeight(i, t, d) {
    const sp = this.spline; const j = (i + 1) % this.n;
    const lim = lerp(sp.half[i], sp.half[j], t) + PLANE_EXT;
    const dc = d < -lim ? -lim : d > lim ? lim : d;
    return lerp(sp.y[i], sp.y[j], t) + lerp(sp.cs[i], sp.cs[j], t) * dc;
  }

  /** world position on the road plane at lap distance s and lateral offset d (+ right) */
  pos(s, d = 0, out = {}) { return this.spline.pointAt(s, d, out); }
}

export { inRange, blurCircular };
