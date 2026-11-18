// Procedural wheels: tyre with shoulders and sidewall, alloy rim with spokes and barrel, brake disc
// and caliper. Local frame of a wheel: axle along z, outer face towards +z.

import * as THREE from 'three';

function lathe(profile, segs, uScale = 1) {
  // profile: [[z, r], ...] revolved around the z axis
  const pos = [], uv = [], idx = [];
  let len = 0; const cum = [0];
  for (let i = 1; i < profile.length; i++) { len += Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]); cum.push(len); }
  for (let s = 0; s <= segs; s++) {
    const a = (s / segs) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
    for (let i = 0; i < profile.length; i++) { pos.push(profile[i][1] * c, profile[i][1] * sn, profile[i][0]); uv.push((s / segs) * uScale, cum[i] / len); }
  }
  const n = profile.length;
  for (let s = 0; s < segs; s++) for (let i = 0; i < n - 1; i++) {
    const a = s * n + i, b = a + 1, c = a + n, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.computeVertexNormals();
  // weld the seam normals
  const nor = g.attributes.normal;
  for (let i = 0; i < n; i++) { const a = i, b = segs * n + i; const x = (nor.getX(a) + nor.getX(b)) / 2, y = (nor.getY(a) + nor.getY(b)) / 2, z = (nor.getZ(a) + nor.getZ(b)) / 2; const l = Math.hypot(x, y, z) || 1; nor.setXYZ(a, x / l, y / l, z / l); nor.setXYZ(b, x / l, y / l, z / l); }
  return g;
}

function merge(list) {
  let nv = 0, ni = 0; for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint32Array(ni);
  let vo = 0, io = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
    const ia = g.index.array; for (let i = 0; i < ia.length; i++) idx[io + i] = ia[i] + vo;
    vo += g.attributes.position.count; io += ia.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1)); out.computeBoundingSphere();
  return out;
}

/** a bar swept from (r0) to (r1) along a radial direction, with a rounded six-sided section */
function spoke(angle, r0, r1, w0, w1, d0, d1, zFace, concave, sweep = 0) {
  const pos = [], idx = []; const steps = 7;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; const r = r0 + (r1 - r0) * t;
    const a = angle + sweep * (1 - t) * (1 - t);
    const w = w0 + (w1 - w0) * t, d = d0 + (d1 - d0) * t;
    const z = zFace - concave * (1 - t * t);
    const cx = Math.cos(a), cy = Math.sin(a), tx = -cy, ty = cx;
    // section: face is at z, body goes inwards (-z)
    const sec = [[-w / 2, 0], [-w / 2 + w * 0.18, 0.006], [w / 2 - w * 0.18, 0.006], [w / 2, 0], [w / 2 * 0.7, -d], [-w / 2 * 0.7, -d]];
    for (const [u, v] of sec) pos.push(cx * r + tx * u, cy * r + ty * u, z + v);
  }
  for (let s = 0; s < steps; s++) for (let k = 0; k < 6; k++) {
    const a = s * 6 + k, b = s * 6 + (k + 1) % 6, c = a + 6, d = b + 6;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/**
 * @param o {R, W, rimR, spokes, twin, concave, discR}
 * @returns {{tire, rim, disc, caliper}} BufferGeometries
 */
export function buildWheelGeometry(o) {
  const { R, W, rimR } = o; const hw = W / 2;
  // ---- tyre: bead, bulging sidewall, rounded shoulder, slightly crowned tread
  const half = [[hw - 0.016, rimR - 0.004], [hw - 0.002, rimR + 0.012], [hw + 0.007, rimR + 0.038], [hw + 0.008, R - 0.05], [hw + 0.002, R - 0.028], [hw - 0.012, R - 0.012], [hw - 0.034, R - 0.003], [hw * 0.45, R], [0, R + 0.001]];
  const prof = [...half.map((p) => [-p[0], p[1]]), ...half.slice(0, -1).reverse()];
  const tire = lathe(prof, 64, 28);
  // ---- rim barrel (seen through the spokes) and outer lip
  const barrel = lathe([[-hw + 0.02, rimR + 0.006], [-hw + 0.032, rimR - 0.008], [-0.03, rimR - 0.03], [hw - 0.07, rimR - 0.024], [hw - 0.03, rimR - 0.008], [hw - 0.014, rimR + 0.007], [hw - 0.01, rimR + 0.004], [hw - 0.022, rimR - 0.012]], 48, 1);
  const zFace = hw - 0.02;
  const parts = [barrel];
  const n = o.spokes;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    if (o.twin) { parts.push(spoke(a - 0.105, 0.05, rimR - 0.012, 0.03, 0.02, 0.034, 0.02, zFace, o.concave, 0.05)); parts.push(spoke(a + 0.105, 0.05, rimR - 0.012, 0.03, 0.02, 0.034, 0.02, zFace, o.concave, -0.05)); }
    else parts.push(spoke(a, 0.05, rimR - 0.012, 0.05, 0.03, 0.036, 0.02, zFace, o.concave, 0));
  }
  // hub with centre cap and wheel nuts
  parts.push(lathe([[zFace - o.concave - 0.05, 0.085], [zFace - o.concave - 0.004, 0.08], [zFace - o.concave + 0.004, 0.066], [zFace - o.concave + 0.012, 0.034], [zFace - o.concave + 0.014, 0.0001]], 24, 1));
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.3; const nut = lathe([[zFace - o.concave - 0.002, 0.011], [zFace - o.concave + 0.014, 0.011], [zFace - o.concave + 0.016, 0.0001]], 6, 1); nut.translate(Math.cos(a) * 0.052, Math.sin(a) * 0.052, 0); parts.push(nut); }
  const rim = merge(parts);
  // ---- brake disc with hat
  const zd = 0.0;
  const disc = lathe([[zd - 0.014, 0.085], [zd - 0.014, o.discR], [zd + 0.014, o.discR], [zd + 0.014, 0.1], [zd + 0.05, 0.085], [zd + 0.05, 0.03]], 40, 1);
  // ---- caliper: a rounded block wrapped around the top-rear of the disc
  const cp = [], ci = []; const A0 = -0.42, A1 = 0.42, steps = 8;
  const sec = [[o.discR - 0.085, -0.045], [o.discR - 0.085, 0.045], [o.discR - 0.07, 0.058], [o.discR + 0.008, 0.058], [o.discR + 0.02, 0.04], [o.discR + 0.02, -0.04], [o.discR + 0.008, -0.058], [o.discR - 0.07, -0.058]];
  for (let s = 0; s <= steps; s++) { const a = A0 + (A1 - A0) * (s / steps); for (const [r, z] of sec) cp.push(Math.cos(a) * r, Math.sin(a) * r, z); }
  for (let s = 0; s < steps; s++) for (let k = 0; k < 8; k++) { const a = s * 8 + k, b = s * 8 + (k + 1) % 8, c = a + 8, d = b + 8; ci.push(a, c, b, b, c, d); }
  // end caps
  for (const s of [0, steps]) { const base = cp.length / 3; const a = A0 + (A1 - A0) * (s / steps); let mr = 0, mz = 0; for (const [r, z] of sec) { mr += r / 8; mz += z / 8; } cp.push(Math.cos(a) * mr, Math.sin(a) * mr, mz); for (let k = 0; k < 8; k++) { const p = s * 8 + k, q = s * 8 + (k + 1) % 8; if (s === 0) ci.push(base, p, q); else ci.push(base, q, p); } }
  const caliper = new THREE.BufferGeometry();
  caliper.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); caliper.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(cp.length / 3 * 2), 2));
  caliper.setIndex(ci); caliper.computeVertexNormals();
  return { tire, rim, disc, caliper };
}

export const WHEEL_SPECS = {
  gt: { R: 0.345, W: 0.30, rimR: 0.2425, spokes: 5, twin: true, concave: 0.045, discR: 0.195 },
  hatch: { R: 0.33, W: 0.255, rimR: 0.23, spokes: 10, twin: false, concave: 0.022, discR: 0.18 },
};
