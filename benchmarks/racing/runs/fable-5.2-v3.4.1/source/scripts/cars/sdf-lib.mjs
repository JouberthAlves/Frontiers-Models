// Implicit-surface modelling toolkit used to build the two car bodies (dev-time bake, see
// scripts/cars/bake.mjs). The cars are designed here from scratch as signed-distance-like
// fields: side / plan silhouettes, section rules, smooth unions and cuts. The fields are
// meshed with surface nets, vertices are projected back on the true surface, normals come from
// the field gradient, and the mesh is cut cleanly along material boundaries.

export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const mix = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export function smin(a, b, k) { if (k <= 0) return Math.min(a, b); const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return mix(b, a, h) - k * h * (1 - h); }
export function smax(a, b, k) { return -smin(-a, -b, k); }

// ---------------------------------------------------------------------------------------------
// primitives (p = [x, y, z])
// ---------------------------------------------------------------------------------------------
export function sdBox(x, y, z, cx, cy, cz, hx, hy, hz, r = 0) {
  const qx = Math.abs(x - cx) - hx + r, qy = Math.abs(y - cy) - hy + r, qz = Math.abs(z - cz) - hz + r;
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0), oz = Math.max(qz, 0);
  return Math.hypot(ox, oy, oz) + Math.min(Math.max(qx, qy, qz), 0) - r;
}
export function sdEllipsoid(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx, py = (y - cy) / ry, pz = (z - cz) / rz;
  const k0 = Math.hypot(px, py, pz);
  const k1 = Math.hypot(px / rx, py / ry, pz / rz);
  return k1 > 1e-9 ? k0 * (k0 - 1) / k1 : -Math.min(rx, ry, rz);
}
/** cylinder with its axis along z */
export function sdCylZ(x, y, z, cx, cy, cz, r, hz) {
  const d = Math.hypot(x - cx, y - cy) - r, w = Math.abs(z - cz) - hz;
  return Math.min(Math.max(d, w), 0) + Math.hypot(Math.max(d, 0), Math.max(w, 0));
}
/** cylinder with its axis along x */
export function sdCylX(x, y, z, cx, cy, cz, r, hx) {
  const d = Math.hypot(y - cy, z - cz) - r, w = Math.abs(x - cx) - hx;
  return Math.min(Math.max(d, w), 0) + Math.hypot(Math.max(d, 0), Math.max(w, 0));
}
export function sdCapsule(x, y, z, ax, ay, az, bx, by, bz, r) {
  const pax = x - ax, pay = y - ay, paz = z - az, bax = bx - ax, bay = by - ay, baz = bz - az;
  const h = clamp((pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz), 0, 1);
  return Math.hypot(pax - bax * h, pay - bay * h, paz - baz * h) - r;
}
export function sdTorusZ(x, y, z, cx, cy, cz, R, r) {
  const q = Math.hypot(x - cx, y - cy) - R; return Math.hypot(q, z - cz) - r;
}

// ---------------------------------------------------------------------------------------------
// 2D silhouettes
// ---------------------------------------------------------------------------------------------
/** closed Catmull-Rom through key points [x, y, (sharp)] -> dense polygon */
export function smoothClosed(keys, perSeg = 14) {
  const n = keys.length; const out = [];
  for (let i = 0; i < n; i++) {
    const p0 = keys[(i + n - 1) % n], p1 = keys[i], p2 = keys[(i + 1) % n], p3 = keys[(i + 2) % n];
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg, t2 = t * t, t3 = t2 * t;
      // a "sharp" key keeps the curve from overshooting by collapsing the neighbouring tangents
      const a0 = p1[2] ? p1 : p0, a3 = p2[2] ? p2 : p3;
      const f = (k) => 0.5 * (2 * p1[k] + (-a0[k] + p2[k]) * t + (2 * a0[k] - 5 * p1[k] + 4 * p2[k] - a3[k]) * t2 + (-a0[k] + 3 * p1[k] - 3 * p2[k] + a3[k]) * t3);
      out.push([f(0), f(1)]);
    }
  }
  return out;
}

/** exact signed distance to a closed polygon (negative inside) */
export function polygonSDF(poly, x, y) {
  let d = Infinity, inside = false; const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const ax = poly[j][0], ay = poly[j][1], bx = poly[i][0], by = poly[i][1];
    const ex = bx - ax, ey = by - ay, wx = x - ax, wy = y - ay;
    const t = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey || 1e-12), 0, 1);
    const dx = wx - ex * t, dy = wy - ey * t; const dd = dx * dx + dy * dy; if (dd < d) d = dd;
    if ((ay > y) !== (by > y) && x < ax + (y - ay) / (by - ay) * ex) inside = !inside;
  }
  return (inside ? -1 : 1) * Math.sqrt(d);
}

/** polygon SDF baked into a grid for O(1) bilinear lookups */
export class Profile {
  constructor(poly, pad = 0.35, res = 0.006) {
    this.poly = poly;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of poly) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    this.x0 = x0 - pad; this.y0 = y0 - pad; this.res = res;
    this.nx = Math.ceil((x1 - x0 + 2 * pad) / res) + 1; this.ny = Math.ceil((y1 - y0 + 2 * pad) / res) + 1;
    this.d = new Float32Array(this.nx * this.ny);
    for (let j = 0; j < this.ny; j++) for (let i = 0; i < this.nx; i++) this.d[j * this.nx + i] = polygonSDF(poly, this.x0 + i * res, this.y0 + j * res);
    this.bounds = { x0, y0, x1, y1 };
  }
  at(x, y) {
    let fx = (x - this.x0) / this.res, fy = (y - this.y0) / this.res;
    // outside the baked window: clamp and add the distance to the window
    let extra = 0;
    if (fx < 0) { extra += -fx * this.res; fx = 0; } else if (fx > this.nx - 1.001) { extra += (fx - (this.nx - 1.001)) * this.res; fx = this.nx - 1.001; }
    if (fy < 0) { extra += -fy * this.res; fy = 0; } else if (fy > this.ny - 1.001) { extra += (fy - (this.ny - 1.001)) * this.res; fy = this.ny - 1.001; }
    const ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy; const i = iy * this.nx + ix; const d = this.d;
    return (d[i] * (1 - tx) + d[i + 1] * tx) * (1 - ty) + (d[i + this.nx] * (1 - tx) + d[i + this.nx + 1] * tx) * ty + extra;
  }
}

/** piecewise-smooth 1D curve through [x, value] keys (monotone x), cubic Hermite with Catmull-Rom tangents */
export function curve1D(keys) {
  const xs = keys.map((k) => k[0]), ys = keys.map((k) => k[1]); const n = xs.length;
  const m = ys.map((_, i) => (i === 0 ? (ys[1] - ys[0]) / (xs[1] - xs[0]) : i === n - 1 ? (ys[n - 1] - ys[n - 2]) / (xs[n - 1] - xs[n - 2]) : (ys[i + 1] - ys[i - 1]) / (xs[i + 1] - xs[i - 1])));
  return (x) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

// ---------------------------------------------------------------------------------------------
// meshing: naive surface nets
// ---------------------------------------------------------------------------------------------
/**
 * @param f (x,y,z) -> signed value (negative inside)
 * @param b {min:[x,y,z], max:[x,y,z]}
 * @returns {{pos:number[], tri:number[]}} outward-facing triangles
 */
export function surfaceNets(f, b, cell) {
  const nx = Math.ceil((b.max[0] - b.min[0]) / cell) + 1, ny = Math.ceil((b.max[1] - b.min[1]) / cell) + 1, nz = Math.ceil((b.max[2] - b.min[2]) / cell) + 1;
  const V = new Float32Array(nx * ny * nz);
  for (let k = 0; k < nz; k++) { const z = b.min[2] + k * cell; for (let j = 0; j < ny; j++) { const y = b.min[1] + j * cell; let o = (k * ny + j) * nx; for (let i = 0; i < nx; i++) V[o++] = f(b.min[0] + i * cell, y, z); } }
  const vid = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1);
  const pos = [];
  const sx = 1, sy = nx, sz = nx * ny;
  const cornerOff = [0, sx, sy, sx + sy, sz, sz + sx, sz + sy, sz + sx + sy];
  const cornerPos = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const o = (k * ny + j) * nx + i;
    let mask = 0; const v = [];
    for (let c = 0; c < 8; c++) { const val = V[o + cornerOff[c]]; v.push(val); if (val < 0) mask |= 1 << c; }
    if (mask === 0 || mask === 255) continue;
    let px = 0, py = 0, pz = 0, cnt = 0;
    for (const [a, bb] of edges) {
      if (((mask >> a) & 1) === ((mask >> bb) & 1)) continue;
      const t = v[a] / (v[a] - v[bb]);
      px += cornerPos[a][0] + (cornerPos[bb][0] - cornerPos[a][0]) * t; py += cornerPos[a][1] + (cornerPos[bb][1] - cornerPos[a][1]) * t; pz += cornerPos[a][2] + (cornerPos[bb][2] - cornerPos[a][2]) * t; cnt++;
    }
    vid[(k * (ny - 1) + j) * (nx - 1) + i] = pos.length / 3;
    pos.push(b.min[0] + (i + px / cnt) * cell, b.min[1] + (j + py / cnt) * cell, b.min[2] + (k + pz / cnt) * cell);
  }
  const tri = [];
  const cellId = (i, j, k) => vid[(k * (ny - 1) + j) * (nx - 1) + i];
  const quad = (a, bq, c, d, flip) => { if (a < 0 || bq < 0 || c < 0 || d < 0) return; if (flip) tri.push(a, c, bq, a, d, c); else tri.push(a, bq, c, a, c, d); };
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const o = (k * ny + j) * nx + i; const s0 = V[o] < 0;
    // edge along +x: shared by cells (i, j-1..j, k-1..k)
    if (s0 !== (V[o + sx] < 0)) quad(cellId(i, j - 1, k - 1), cellId(i, j, k - 1), cellId(i, j, k), cellId(i, j - 1, k), !s0);
    // edge along +y
    if (s0 !== (V[o + sy] < 0)) quad(cellId(i - 1, j, k - 1), cellId(i - 1, j, k), cellId(i, j, k), cellId(i, j, k - 1), !s0);
    // edge along +z
    if (s0 !== (V[o + sz] < 0)) quad(cellId(i - 1, j - 1, k), cellId(i, j - 1, k), cellId(i, j, k), cellId(i - 1, j, k), !s0);
  }
  return { pos, tri };
}

export function gradient(f, x, y, z, h = 0.003) {
  return [f(x + h, y, z) - f(x - h, y, z), f(x, y + h, z) - f(x, y - h, z), f(x, y, z + h) - f(x, y, z - h)];
}

/** pulls every vertex onto the zero set of f (a few Newton steps along the gradient) */
export function projectToSurface(mesh, f, iters = 3, maxMove = 0.02) {
  const p = mesh.pos;
  for (let i = 0; i < p.length; i += 3) {
    let x = p[i], y = p[i + 1], z = p[i + 2]; const x0 = x, y0 = y, z0 = z;
    for (let it = 0; it < iters; it++) {
      const v = f(x, y, z); const g = gradient(f, x, y, z, 0.002); const g2 = (g[0] * g[0] + g[1] * g[1] + g[2] * g[2]) / (0.004 * 0.004);
      if (g2 < 1e-6) break;
      const s = v / g2; x -= s * g[0] / 0.004; y -= s * g[1] / 0.004; z -= s * g[2] / 0.004;
    }
    const m = Math.hypot(x - x0, y - y0, z - z0);
    if (m > maxMove) { const k = maxMove / m; x = x0 + (x - x0) * k; y = y0 + (y - y0) * k; z = z0 + (z - z0) * k; }
    p[i] = x; p[i + 1] = y; p[i + 2] = z;
  }
  return mesh;
}

export function computeNormals(mesh, f, h = 0.004) {
  const p = mesh.pos; const n = new Array(p.length);
  for (let i = 0; i < p.length; i += 3) {
    const g = gradient(f, p[i], p[i + 1], p[i + 2], h); const l = Math.hypot(g[0], g[1], g[2]) || 1;
    n[i] = g[0] / l; n[i + 1] = g[1] / l; n[i + 2] = g[2] / l;
  }
  mesh.nor = n; return mesh;
}

/**
 * Cuts a mesh along the zero set of a scalar field g: returns [part where g < 0, part where g >= 0].
 * Triangles that straddle the boundary are clipped, so material borders are smooth curves.
 */
export function splitByField(mesh, g, f = null) {
  const p = mesh.pos, nrm = mesh.nor; const nv = p.length / 3;
  const val = new Float32Array(nv);
  for (let i = 0; i < nv; i++) val[i] = g(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
  const A = { pos: [], nor: [], tri: [] }, B = { pos: [], nor: [], tri: [] };
  const mapA = new Map(), mapB = new Map();
  const getV = (part, map, key, x, y, z, nx, ny, nz) => {
    let id = map.get(key); if (id !== undefined) return id;
    id = part.pos.length / 3; part.pos.push(x, y, z); part.nor.push(nx, ny, nz); map.set(key, id); return id;
  };
  const vert = (part, map, i) => getV(part, map, i, p[i * 3], p[i * 3 + 1], p[i * 3 + 2], nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]);
  const cut = (part, map, i, j) => {
    const key = i < j ? `${i}_${j}` : `${j}_${i}`; let id = map.get(key); if (id !== undefined) return id;
    const t = val[i] / (val[i] - val[j]);
    let x = p[i * 3] + (p[j * 3] - p[i * 3]) * t, y = p[i * 3 + 1] + (p[j * 3 + 1] - p[i * 3 + 1]) * t, z = p[i * 3 + 2] + (p[j * 3 + 2] - p[i * 3 + 2]) * t;
    let nx = nrm[i * 3] + (nrm[j * 3] - nrm[i * 3]) * t, ny = nrm[i * 3 + 1] + (nrm[j * 3 + 1] - nrm[i * 3 + 1]) * t, nz = nrm[i * 3 + 2] + (nrm[j * 3 + 2] - nrm[i * 3 + 2]) * t;
    const l = Math.hypot(nx, ny, nz) || 1;
    return getV(part, map, key, x, y, z, nx / l, ny / l, nz / l);
  };
  for (let t = 0; t < mesh.tri.length; t += 3) {
    const ids = [mesh.tri[t], mesh.tri[t + 1], mesh.tri[t + 2]];
    const neg = ids.map((i) => val[i] < 0); const cnt = neg.filter(Boolean).length;
    if (cnt === 3) { A.tri.push(vert(A, mapA, ids[0]), vert(A, mapA, ids[1]), vert(A, mapA, ids[2])); continue; }
    if (cnt === 0) { B.tri.push(vert(B, mapB, ids[0]), vert(B, mapB, ids[1]), vert(B, mapB, ids[2])); continue; }
    // rotate so that the lone vertex comes first
    const lone = cnt === 1 ? neg.indexOf(true) : neg.indexOf(false);
    const a = ids[lone], b = ids[(lone + 1) % 3], c = ids[(lone + 2) % 3];
    const [P1, M1, P2, M2] = cnt === 1 ? [A, mapA, B, mapB] : [B, mapB, A, mapA];
    // lone side: triangle (a, ab, ac); other side: quad (ab, b, c, ac)
    P1.tri.push(vert(P1, M1, a), cut(P1, M1, a, b), cut(P1, M1, a, c));
    const ab = cut(P2, M2, a, b), ac = cut(P2, M2, a, c), vb = vert(P2, M2, b), vc = vert(P2, M2, c);
    P2.tri.push(ab, vb, vc, ab, vc, ac);
  }
  return [A, B];
}

/** removes triangles for which keep(cx, cy, cz, n) is false (centroid test) and compacts vertices */
export function filterMesh(mesh, keep) {
  const p = mesh.pos, n = mesh.nor; const out = { pos: [], nor: [], tri: [] }; const map = new Map();
  const v = (i) => { let id = map.get(i); if (id === undefined) { id = out.pos.length / 3; out.pos.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]); out.nor.push(n[i * 3], n[i * 3 + 1], n[i * 3 + 2]); map.set(i, id); } return id; };
  for (let t = 0; t < mesh.tri.length; t += 3) {
    const a = mesh.tri[t], b = mesh.tri[t + 1], c = mesh.tri[t + 2];
    const cx = (p[a * 3] + p[b * 3] + p[c * 3]) / 3, cy = (p[a * 3 + 1] + p[b * 3 + 1] + p[c * 3 + 1]) / 3, cz = (p[a * 3 + 2] + p[b * 3 + 2] + p[c * 3 + 2]) / 3;
    if (keep(cx, cy, cz)) out.tri.push(v(a), v(b), v(c));
  }
  return out;
}

export function flipMesh(mesh) {
  for (let t = 0; t < mesh.tri.length; t += 3) { const a = mesh.tri[t + 1]; mesh.tri[t + 1] = mesh.tri[t + 2]; mesh.tri[t + 2] = a; }
  for (let i = 0; i < mesh.nor.length; i++) mesh.nor[i] = -mesh.nor[i];
  return mesh;
}

export function mergeMeshes(list) {
  const out = { pos: [], nor: [], tri: [] };
  for (const m of list) { const base = out.pos.length / 3; for (const v of m.pos) out.pos.push(v); for (const v of m.nor) out.nor.push(v); for (const i of m.tri) out.tri.push(i + base); }
  return out;
}

/** uniform Laplacian relaxation: evens out the zig-zag that surface nets leave along creases */
export function relaxMesh(mesh, iters = 1, lambda = 0.35) {
  const nv = mesh.pos.length / 3; const adj = new Array(nv);
  for (let i = 0; i < nv; i++) adj[i] = new Set();
  for (let t = 0; t < mesh.tri.length; t += 3) { const a = mesh.tri[t], b = mesh.tri[t + 1], c = mesh.tri[t + 2]; adj[a].add(b); adj[a].add(c); adj[b].add(a); adj[b].add(c); adj[c].add(a); adj[c].add(b); }
  for (let it = 0; it < iters; it++) {
    const p = mesh.pos; const q = new Array(p.length);
    for (let i = 0; i < nv; i++) {
      let x = 0, y = 0, z = 0; const n = adj[i].size;
      if (!n) { q[i * 3] = p[i * 3]; q[i * 3 + 1] = p[i * 3 + 1]; q[i * 3 + 2] = p[i * 3 + 2]; continue; }
      for (const j of adj[i]) { x += p[j * 3]; y += p[j * 3 + 1]; z += p[j * 3 + 2]; }
      q[i * 3] = p[i * 3] + (x / n - p[i * 3]) * lambda; q[i * 3 + 1] = p[i * 3 + 1] + (y / n - p[i * 3 + 1]) * lambda; q[i * 3 + 2] = p[i * 3 + 2] + (z / n - p[i * 3 + 2]) * lambda;
    }
    mesh.pos = q;
  }
  return mesh;
}

/** full pipeline for one field: mesh, relax, project, normals */
export function meshField(f, bounds, cell, { project = 3, normalH = 0.004, relax = 2 } = {}) {
  const m = surfaceNets(f, bounds, cell);
  if (relax) relaxMesh(m, relax, 0.4);
  if (project) projectToSurface(m, f, project, cell * 0.45);
  computeNormals(m, f, normalH);
  return m;
}
