// Closed Catmull-Rom spline through the control points of track.json, resampled
// at a constant arc-length step. Every other piece of the world (road mesh,
// colliders, terrain, barriers, checkpoints, AI line, object placement) reads
// these samples: this is the single source of truth for the circuit.

import { DEG } from '../core/math.js';

function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function crD(p0, p1, p2, p3, t) {
  const t2 = t * t;
  return 0.5 * ((-p0 + p2) + 2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) * t + 3 * (-p0 + 3 * p1 - 3 * p2 + p3) * t2);
}
function crDD(p0, p1, p2, p3, t) {
  return 0.5 * (2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) + 6 * (-p0 + 3 * p1 - 3 * p2 + p3) * t);
}

export class TrackSpline {
  /**
   * @param {Array<{x:number,y:number,z:number,w:number,bank:number}>} pts control points (closed loop)
   * @param {number} step target arc-length step between samples (m)
   */
  constructor(pts, step = 1.0) {
    this.points = pts;
    const K = pts.length;
    const SUB = 48;
    const at = (k) => pts[((k % K) + K) % K];
    const evalAt = (u, out) => {
      let k = Math.floor(u); const t = u - k; k = ((k % K) + K) % K;
      const a = at(k - 1), b = at(k), c = at(k + 1), d = at(k + 2);
      out.x = cr(a.x, b.x, c.x, d.x, t); out.y = cr(a.y, b.y, c.y, d.y, t); out.z = cr(a.z, b.z, c.z, d.z, t);
      out.dx = crD(a.x, b.x, c.x, d.x, t); out.dy = crD(a.y, b.y, c.y, d.y, t); out.dz = crD(a.z, b.z, c.z, d.z, t);
      out.ddx = crDD(a.x, b.x, c.x, d.x, t); out.ddz = crDD(a.z, b.z, c.z, d.z, t);
      out.w = cr(a.w, b.w, c.w, d.w, t); out.bank = cr(a.bank, b.bank, c.bank, d.bank, t);
      return out;
    };
    // fine arc-length table
    const M = K * SUB;
    const cum = new Float64Array(M + 1);
    const tmp = {}; let px = 0, py = 0, pz = 0;
    for (let m = 0; m <= M; m++) {
      evalAt(m / SUB, tmp);
      if (m > 0) cum[m] = cum[m - 1] + Math.hypot(tmp.x - px, tmp.y - py, tmp.z - pz);
      px = tmp.x; py = tmp.y; pz = tmp.z;
    }
    const L = cum[M];
    const n = Math.max(8, Math.round(L / step));
    const ds = L / n;
    this.length = L; this.n = n; this.ds = ds;
    const f32 = () => new Float32Array(n);
    this.x = new Float64Array(n); this.y = new Float64Array(n); this.z = new Float64Array(n);
    this.tx = f32(); this.ty = f32(); this.tz = f32();       // unit tangent (3D)
    this.hx = f32(); this.hz = f32();                         // unit horizontal heading
    this.rx = f32(); this.rz = f32();                         // horizontal unit lateral axis (to the right)
    this.cs = f32();                                          // cross slope: dy per metre of lateral offset (bank)
    this.nx = f32(); this.ny = f32(); this.nz = f32();       // surface normal
    this.w = f32(); this.half = f32(); this.bank = f32();    // width, half width, bank (rad, + = right side lower)
    this.kappa = f32();                                       // signed curvature in plan (+ = right turn)
    this.grade = f32();                                       // dy / d(horizontal)
    this.u = f32();                                           // spline parameter of each sample
    let m = 0;
    for (let j = 0; j < n; j++) {
      const s = j * ds;
      while (m < M - 1 && cum[m + 1] < s) m++;
      const seg = cum[m + 1] - cum[m];
      const f = seg > 1e-9 ? (s - cum[m]) / seg : 0;
      const u = (m + f) / SUB;
      evalAt(u, tmp);
      this.u[j] = u;
      this.x[j] = tmp.x; this.y[j] = tmp.y; this.z[j] = tmp.z;
      const dl = Math.hypot(tmp.dx, tmp.dy, tmp.dz) || 1;
      const tx = tmp.dx / dl, ty = tmp.dy / dl, tz = tmp.dz / dl;
      this.tx[j] = tx; this.ty[j] = ty; this.tz[j] = tz;
      const dh = Math.hypot(tmp.dx, tmp.dz) || 1;
      const hx = tmp.dx / dh, hz = tmp.dz / dh;
      this.hx[j] = hx; this.hz[j] = hz;
      this.kappa[j] = (tmp.dx * tmp.ddz - tmp.dz * tmp.ddx) / (dh * dh * dh);
      this.grade[j] = tmp.dy / dh;
      this.w[j] = tmp.w; this.half[j] = tmp.w * 0.5;
      const b = tmp.bank * DEG; this.bank[j] = b;
      // cross-section line of the road at this sample: P(d) = c + (rx, cs, rz) * d, with
      // (rx, rz) the horizontal unit vector to the right and cs = -tan(bank)
      const rx = -hz, rz = hx, cs = -Math.tan(b);
      this.rx[j] = rx; this.rz[j] = rz; this.cs[j] = cs;
      // normal = normalize((rx, cs, rz) x t)
      let nx = cs * tz - rz * ty, ny = rz * tx - rx * tz, nz = rx * ty - cs * tx;
      const nl = Math.hypot(nx, ny, nz) || 1;
      this.nx[j] = nx / nl; this.ny[j] = ny / nl; this.nz[j] = nz / nl;
    }
    this._buildGrid();
  }

  _buildGrid() {
    const cell = 24;
    let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < this.n; i++) {
      if (this.x[i] < minX) minX = this.x[i]; if (this.x[i] > maxX) maxX = this.x[i];
      if (this.z[i] < minZ) minZ = this.z[i]; if (this.z[i] > maxZ) maxZ = this.z[i];
    }
    this.bounds = { minX, minZ, maxX, maxZ };
    const pad = cell * 2;
    this.gx0 = minX - pad; this.gz0 = minZ - pad; this.gcell = cell;
    this.gnx = Math.ceil((maxX - minX + pad * 2) / cell); this.gnz = Math.ceil((maxZ - minZ + pad * 2) / cell);
    const buckets = new Array(this.gnx * this.gnz);
    for (let i = 0; i < this.n; i++) {
      const cx = Math.floor((this.x[i] - this.gx0) / cell), cz = Math.floor((this.z[i] - this.gz0) / cell);
      const id = cz * this.gnx + cx;
      (buckets[id] || (buckets[id] = [])).push(i);
    }
    this.buckets = buckets;
  }

  idx(i) { const n = this.n; return ((i % n) + n) % n; }
  wrapS(s) { const L = this.length; return ((s % L) + L) % L; }
  /** signed shortest distance along the lap from s0 to s1 */
  deltaS(s1, s0) {
    const L = this.length; let d = (s1 - s0) % L;
    if (d > L / 2) d -= L; else if (d < -L / 2) d += L;
    return d;
  }

  /** nearest sample index to (x,z); global search through the grid (slow path) */
  nearestGlobal(x, z) {
    const cell = this.gcell;
    const cx = Math.floor((x - this.gx0) / cell), cz = Math.floor((z - this.gz0) / cell);
    let best = -1, bestD = Infinity;
    const maxR = Math.max(this.gnx, this.gnz);
    for (let r = 0; r <= maxR; r++) {
      const x0 = cx - r, x1 = cx + r, z0 = cz - r, z1 = cz + r;
      for (let gz = z0; gz <= z1; gz++) {
        if (gz < 0 || gz >= this.gnz) continue;
        const edgeRow = gz === z0 || gz === z1;
        for (let gx = x0; gx <= x1; gx += (edgeRow ? 1 : Math.max(1, x1 - x0))) {
          if (gx < 0 || gx >= this.gnx) continue;
          const b = this.buckets[gz * this.gnx + gx];
          if (!b) continue;
          for (let q = 0; q < b.length; q++) {
            const i = b[q]; const dx = this.x[i] - x, dz = this.z[i] - z; const d = dx * dx + dz * dz;
            if (d < bestD) { bestD = d; best = i; }
          }
        }
      }
      if (best >= 0 && bestD <= (r * cell) * (r * cell)) break;
    }
    return best;
  }

  /** nearest sample index searching +-window samples around a hint index (fast path) */
  nearestLocal(x, z, hint, window = 40) {
    const n = this.n; let best = hint, bestD = Infinity;
    for (let k = -window; k <= window; k++) {
      const i = ((hint + k) % n + n) % n;
      const dx = this.x[i] - x, dz = this.z[i] - z; const d = dx * dx + dz * dz;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /**
   * Track-space coordinates of a world point.
   * @returns {{i:number,t:number,s:number,d:number}} segment index, fraction, distance along lap, signed lateral offset (+ = right)
   */
  project(x, z, hint = -1, out = {}) {
    const n = this.n;
    let i0 = hint >= 0 ? this.nearestLocal(x, z, hint) : this.nearestGlobal(x, z);
    // choose between segment [i0-1,i0] and [i0,i0+1]
    let bi = i0, bt = 0, bd = Infinity;
    for (let k = -1; k <= 0; k++) {
      const a = ((i0 + k) % n + n) % n, b = (a + 1) % n;
      const ax = this.x[a], az = this.z[a];
      const ex = this.x[b] - ax, ez = this.z[b] - az;
      const el = ex * ex + ez * ez || 1e-9;
      let t = ((x - ax) * ex + (z - az) * ez) / el;
      if (t < 0) t = 0; else if (t > 1) t = 1;
      const qx = ax + ex * t - x, qz = az + ez * t - z; const d = qx * qx + qz * qz;
      if (d < bd) { bd = d; bi = a; bt = t; }
    }
    const a = bi, b = (a + 1) % n;
    const cx = this.x[a] + (this.x[b] - this.x[a]) * bt, cz = this.z[a] + (this.z[b] - this.z[a]) * bt;
    // horizontal right vector (-hz, hx) interpolated
    const hx = this.hx[a] + (this.hx[b] - this.hx[a]) * bt, hz = this.hz[a] + (this.hz[b] - this.hz[a]) * bt;
    const hl = Math.hypot(hx, hz) || 1;
    out.i = a; out.t = bt; out.s = (a + bt) * this.ds;
    out.d = ((x - cx) * (-hz) + (z - cz) * hx) / hl;
    out.dist = Math.sqrt(bd); // true distance to the centre line (>= |d|; larger when the foot is clamped)
    return out;
  }

  /** world position of a track-space point (s along the lap, d = horizontal lateral offset, on the banked road plane) */
  pointAt(s, d = 0, out = {}) {
    const n = this.n; const fs = this.wrapS(s) / this.ds;
    let a = Math.floor(fs); const t = fs - a; a = a % n; const b = (a + 1) % n;
    const L = (p) => p[a] + (p[b] - p[a]) * t;
    const rx = L(this.rx), rz = L(this.rz), rl = Math.hypot(rx, rz) || 1;
    out.x = L(this.x) + (rx / rl) * d; out.y = L(this.y) + L(this.cs) * d; out.z = L(this.z) + (rz / rl) * d;
    out.hx = L(this.hx); out.hz = L(this.hz);
    const hl = Math.hypot(out.hx, out.hz) || 1; out.hx /= hl; out.hz /= hl;
    out.tx = L(this.tx); out.ty = L(this.ty); out.tz = L(this.tz);
    out.heading = Math.atan2(out.hz, out.hx);
    out.i = a; out.t = t;
    return out;
  }

  /** linear interpolation of a per-sample array at distance s */
  sampleArr(arr, s) {
    const n = this.n; const fs = this.wrapS(s) / this.ds;
    let a = Math.floor(fs); const t = fs - a; a = a % n; const b = (a + 1) % n;
    return arr[a] + (arr[b] - arr[a]) * t;
  }
}
