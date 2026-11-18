// Small procedural-geometry kit used by barriers, props, houses and plants. Everything is
// accumulated into plain arrays and turned into one BufferGeometry per material, with UVs in
// metres (so tiling PBR textures keep their real-world scale).

import * as THREE from 'three';

export class Geo {
  constructor() { this.p = []; this.n = []; this.uv = []; this.idx = []; this.col = null; this.m = new THREE.Matrix4(); this._stack = []; this._nm = new THREE.Matrix3(); this._v = new THREE.Vector3(); }
  get vertexCount() { return this.p.length / 3; }
  get triangleCount() { return this.idx.length / 3; }

  // ---- transform stack
  push() { this._stack.push(this.m.clone()); return this; }
  pop() { this.m.copy(this._stack.pop()); return this; }
  identity() { this.m.identity(); return this; }
  translate(x, y, z) { this.m.multiply(new THREE.Matrix4().makeTranslation(x, y, z)); return this; }
  rotateY(a) { this.m.multiply(new THREE.Matrix4().makeRotationY(a)); return this; }
  rotateX(a) { this.m.multiply(new THREE.Matrix4().makeRotationX(a)); return this; }
  rotateZ(a) { this.m.multiply(new THREE.Matrix4().makeRotationZ(a)); return this; }
  scale(x, y = x, z = x) { this.m.multiply(new THREE.Matrix4().makeScale(x, y, z)); return this; }

  vert(x, y, z, nx, ny, nz, u, v) {
    const e = this.m.elements;
    this.p.push(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
    // normals: rotation part only (uniform scale assumed; non-uniform scale is renormalised)
    let ax = e[0] * nx + e[4] * ny + e[8] * nz, ay = e[1] * nx + e[5] * ny + e[9] * nz, az = e[2] * nx + e[6] * ny + e[10] * nz;
    const l = Math.hypot(ax, ay, az) || 1; this.n.push(ax / l, ay / l, az / l);
    this.uv.push(u, v);
    if (this.col) this.col.push(this._c[0], this._c[1], this._c[2]);
    if (this.w) this.w.push(this._w);
    return this.p.length / 3 - 1;
  }
  /** wind weight (attribute aWind) for everything added afterwards: cloth, flags */
  wind(v) { if (!this.w) this.w = new Array(this.p.length / 3).fill(0); this._w = v; return this; }
  /** planar quad with explicit texture rectangle [u0, v0, u1, v1] (atlas tiles) */
  quadUV(a, b, c, d, r) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const i0 = this.vert(a[0], a[1], a[2], nx, ny, nz, r[0], r[1]), i1 = this.vert(b[0], b[1], b[2], nx, ny, nz, r[2], r[1]);
    const i2 = this.vert(c[0], c[1], c[2], nx, ny, nz, r[2], r[3]), i3 = this.vert(d[0], d[1], d[2], nx, ny, nz, r[0], r[3]);
    this.quadIdx(i0, i1, i2, i3); return this;
  }
  /** surface of revolution around +y from a profile [[radius, y], ...] */
  lathe(cx, cz, profile, seg = 12, uvScale = 1) {
    const base = this.vertexCount; const np = profile.length; let len = 0; const pl = [0];
    for (let k = 1; k < np; k++) { len += Math.hypot(profile[k][0] - profile[k - 1][0], profile[k][1] - profile[k - 1][1]); pl.push(len); }
    for (let s = 0; s <= seg; s++) {
      const a = (s / seg) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      for (let k = 0; k < np; k++) {
        const p0 = profile[Math.max(0, k - 1)], p1 = profile[Math.min(np - 1, k + 1)];
        const dr = p1[0] - p0[0], dy = p1[1] - p0[1]; const dl = Math.hypot(dr, dy) || 1;
        this.vert(cx + c * profile[k][0], profile[k][1], cz + sn * profile[k][0], c * dy / dl, -dr / dl, sn * dy / dl, (s / seg) * 2 * Math.PI * 0.4 * uvScale, pl[k] * uvScale);
      }
    }
    for (let s = 0; s < seg; s++) for (let k = 0; k < np - 1; k++) { const a = base + s * np + k, b = a + 1, c = a + np, d = c + 1; this.idx.push(a, b, c, b, d, c); }
    return this;
  }
  /** per-vertex colour for everything added afterwards (multiplies the texture) */
  color(r, g, b) { if (!this.col) { this.col = new Array(this.p.length).fill(1); } this._c = [r, g, b]; return this; }
  tri(a, b, c) { this.idx.push(a, b, c); }
  quadIdx(a, b, c, d) { this.idx.push(a, b, c, a, c, d); }

  /** planar quad from 4 corners (counter-clockwise seen from the front), uv in metres along its edges */
  quad(a, b, c, d, uvScale = 1, uv0 = [0, 0]) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const lu = Math.hypot(ux, uy, uz), lv = Math.hypot(vx, vy, vz);
    const i0 = this.vert(a[0], a[1], a[2], nx, ny, nz, uv0[0], uv0[1]);
    const i1 = this.vert(b[0], b[1], b[2], nx, ny, nz, uv0[0] + lu * uvScale, uv0[1]);
    const i2 = this.vert(c[0], c[1], c[2], nx, ny, nz, uv0[0] + lu * uvScale, uv0[1] + lv * uvScale);
    const i3 = this.vert(d[0], d[1], d[2], nx, ny, nz, uv0[0], uv0[1] + lv * uvScale);
    this.quadIdx(i0, i1, i2, i3);
    return this;
  }

  /** axis-aligned box centred at (cx, cy, cz) with half sizes; optional omitted faces ("+y", "-y", ...) */
  box(cx, cy, cz, hx, hy, hz, uvScale = 1, skip = '') {
    const x0 = cx - hx, x1 = cx + hx, y0 = cy - hy, y1 = cy + hy, z0 = cz - hz, z1 = cz + hz;
    if (!skip.includes('+z')) this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], uvScale);
    if (!skip.includes('-z')) this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], uvScale);
    if (!skip.includes('+x')) this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], uvScale);
    if (!skip.includes('-x')) this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], uvScale);
    if (!skip.includes('+y')) this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], uvScale);
    if (!skip.includes('-y')) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], uvScale);
    return this;
  }

  /** frustum / cylinder along +y from y0 to y1 with radii r0, r1 */
  cyl(cx, y0, cz, r0, r1, y1, seg = 10, uvScale = 1, caps = true, uOff = 0) {
    const base = this.vertexCount; const h = y1 - y0; const slope = (r0 - r1) / h;
    for (let s = 0; s <= seg; s++) {
      const a = (s / seg) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      const nl = Math.hypot(1, slope); const u = uOff + (s / seg) * 2 * Math.PI * Math.max(r0, r1) * uvScale;
      this.vert(cx + c * r0, y0, cz + sn * r0, c / nl, slope / nl, sn / nl, u, 0);
      this.vert(cx + c * r1, y1, cz + sn * r1, c / nl, slope / nl, sn / nl, u, h * uvScale);
    }
    for (let s = 0; s < seg; s++) { const a = base + s * 2; this.idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3); }
    if (caps) {
      if (r1 > 1e-4) { const c0 = this.vert(cx, y1, cz, 0, 1, 0, 0, 0); const b = this.vertexCount; for (let s = 0; s <= seg; s++) { const a = (s / seg) * Math.PI * 2; this.vert(cx + Math.cos(a) * r1, y1, cz + Math.sin(a) * r1, 0, 1, 0, Math.cos(a) * r1 * uvScale, Math.sin(a) * r1 * uvScale); } for (let s = 0; s < seg; s++) this.idx.push(c0, b + s + 1, b + s); }
      if (r0 > 1e-4) { const c0 = this.vert(cx, y0, cz, 0, -1, 0, 0, 0); const b = this.vertexCount; for (let s = 0; s <= seg; s++) { const a = (s / seg) * Math.PI * 2; this.vert(cx + Math.cos(a) * r0, y0, cz + Math.sin(a) * r0, 0, -1, 0, Math.cos(a) * r0 * uvScale, Math.sin(a) * r0 * uvScale); } for (let s = 0; s < seg; s++) this.idx.push(c0, b + s, b + s + 1); }
    }
    return this;
  }

  /** tube along a polyline of points [x,y,z] with a radius per point (branches, rails, cables) */
  tube(pts, radii, seg = 6, uvScale = 1, capEnd = true) {
    const base = this.vertexCount; let len = 0; const up = new THREE.Vector3(0, 1, 0);
    const T = new THREE.Vector3(), B = new THREE.Vector3(), N = new THREE.Vector3();
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
      if (i === 0) { N.crossVectors(T, Math.abs(T.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize(); } else { N.sub(T.clone().multiplyScalar(N.dot(T))).normalize(); }
      B.crossVectors(T, N).normalize();
      if (i > 0) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
      const r = Array.isArray(radii) ? radii[i] : radii;
      for (let s = 0; s <= seg; s++) {
        const ang = (s / seg) * Math.PI * 2, c = Math.cos(ang), sn = Math.sin(ang);
        const nx = N.x * c + B.x * sn, ny = N.y * c + B.y * sn, nz = N.z * c + B.z * sn;
        this.vert(pts[i][0] + nx * r, pts[i][1] + ny * r, pts[i][2] + nz * r, nx, ny, nz, (s / seg) * 2 * Math.PI * r * uvScale * 2, len * uvScale);
      }
    }
    const row = seg + 1;
    for (let i = 0; i < pts.length - 1; i++) for (let s = 0; s < seg; s++) { const a = base + i * row + s, b = a + 1, c = a + row, d = c + 1; this.idx.push(a, c, b, b, c, d); }
    if (capEnd) { const last = pts[pts.length - 1]; const c0 = this.vert(last[0], last[1], last[2], T.x, T.y, T.z, 0, 0); const b = base + (pts.length - 1) * row; for (let s = 0; s < seg; s++) this.idx.push(c0, b + s, b + s + 1); }
    return this;
  }

  /**
   * Sweeps a 2D profile [[offset, height], ...] (open polyline) along a path of frames
   * {x, y, z, rx, rz} (rx, rz = unit lateral axis). Used for walls, rails, kerb stones.
   */
  sweep(profile, frames, uvScale = 1, closed = false, v0 = 0) {
    const base = this.vertexCount; const np = profile.length;
    let plen = 0; const pl = [0]; for (let k = 1; k < np; k++) { plen += Math.hypot(profile[k][0] - profile[k - 1][0], profile[k][1] - profile[k - 1][1]); pl.push(plen); }
    let len = v0;
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i];
      if (i > 0) len += Math.hypot(f.x - frames[i - 1].x, f.z - frames[i - 1].z);
      for (let k = 0; k < np; k++) {
        const a = profile[Math.max(0, k - 1)], b = profile[Math.min(np - 1, k + 1)];
        let dn = b[0] - a[0], dh = b[1] - a[1]; const dl = Math.hypot(dn, dh) || 1; // profile tangent
        // normal = tangent rotated: (dh, -dn) in (lateral, up)
        const nl = dh / dl, nu = -dn / dl;
        this.vert(f.x + f.rx * profile[k][0], f.y + profile[k][1], f.z + f.rz * profile[k][0], f.rx * nl, nu, f.rz * nl, len * uvScale, pl[k] * uvScale);
      }
    }
    // profile order convention: up the +lateral face, across the top, down the -lateral face (outward normals)
    for (let i = 0; i < frames.length - 1; i++) for (let k = 0; k < np - 1; k++) { const a = base + i * np + k, b = a + 1, c = a + np, d = c + 1; this.idx.push(a, c, b, b, c, d); }
    return this;
  }

  /** appends another Geo (same attribute layout) */
  add(other) {
    const base = this.vertexCount;
    for (const v of other.p) this.p.push(v); for (const v of other.n) this.n.push(v); for (const v of other.uv) this.uv.push(v);
    for (const i of other.idx) this.idx.push(i + base);
    if (this.col || other.col) { if (!this.col) this.col = new Array(base * 3).fill(1); if (other.col) for (const v of other.col) this.col.push(v); else for (let i = 0; i < other.p.length; i++) this.col.push(1); }
    return this;
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.col) { while (this.col.length < this.p.length) this.col.push(1); g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3)); }
    if (this.w) { while (this.w.length < this.p.length / 3) this.w.push(0); g.setAttribute('aWind', new THREE.Float32BufferAttribute(this.w, 1)); }
    g.setIndex(this.p.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(this.idx, 1) : new THREE.Uint16BufferAttribute(this.idx, 1));
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }
}

/** merges BufferGeometries with position / normal / uv (and optional colour) */
export function mergeGeometries(list) {
  let nv = 0, ni = 0; let hasCol = false;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; if (g.attributes.color) hasCol = true; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), col = hasCol ? new Float32Array(nv * 3).fill(1) : null;
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  let vo = 0, io = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
    if (col && g.attributes.color) col.set(g.attributes.color.array, vo * 3);
    const ia = g.index.array; for (let i = 0; i < ia.length; i++) idx[io + i] = ia[i] + vo;
    vo += g.attributes.position.count; io += ia.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (col) out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1)); out.computeBoundingSphere(); out.computeBoundingBox();
  return out;
}
