// Shared recipe that turns a car "design sheet" (side silhouette, plan outline, belt line,
// tumblehome, flares, cut-outs, glass / light regions) into implicit fields and then into meshes
// grouped by material. Car frame: x forward, y up (0 = ground), z right; origin under the centre
// of gravity, exactly like the physics (front axle at +a, rear axle at -b).

import {
  Profile, smoothClosed, curve1D, smin, smax, smoothstep, clamp, sdBox, sdEllipsoid, sdCylZ, sdCylX, sdCapsule,
  meshField, splitByField, filterMesh, flipMesh, mergeMeshes, gradient,
} from './sdf-lib.mjs';

const sq = (v) => v * v;

export function makeFields(D) {
  const side = new Profile(smoothClosed(D.side, 16), 0.3, 0.005);
  const planW = curve1D(D.plan);
  const belt = curve1D(D.belt);
  const tumble = curve1D(D.tumble);
  const crown = D.crown ?? 0.07;
  const kEdge = D.kEdge ?? 0.09;
  const shoulder = D.shoulder ?? 0.045;
  const sym = (poly) => new Profile(smoothClosed([...poly, ...poly.slice().reverse().map((p) => [p[0], -p[1], p[2]])], 10), 0.25, 0.006);
  const gl = D.glass;
  const pWind = sym(gl.windshield), pRear = gl.rearTop ? sym(gl.rearTop) : null;
  const pSide = new Profile(smoothClosed(gl.side, 12), 0.25, 0.005);
  const pRearFace = gl.rearFace ? new Profile(smoothClosed([...gl.rearFace, ...gl.rearFace.slice().reverse().map((p) => [-p[0], p[1], p[2]])], 10), 0.25, 0.006) : null;

  function shell(x, y, z) {
    const az = Math.abs(z);
    const ye = y + crown * az * az * smoothstep(0.3, 0.62, y);
    const dS = side.at(x, ye);
    const yb = belt(x);
    let w = planW(x) + 0.022 * Math.max(0, 1 - sq((y - 0.5) / 0.36)) - (D.tuck ?? 0.07) * smoothstep(0.36, 0.14, y);
    const up = smoothstep(yb - 0.06, yb + 0.05, y);
    w -= up * (shoulder + Math.max(0, y - yb) * tumble(x));
    return smax(dS, az - w, kEdge);
  }

  function body(x, y, z) {
    const az = Math.abs(z);
    let d = shell(x, y, z);
    for (const f of D.flares || []) d = smin(d, sdEllipsoid(x, y, az, f[0], f[1], f[2], f[3], f[4], f[5]), f[6] ?? 0.1);
    for (const f of D.scallops || []) d = smax(d, -sdEllipsoid(x, y, az, f[0], f[1], f[2], f[3], f[4], f[5]), f[6] ?? 0.06);
    for (const m of D.mirrors || []) {
      let dm = sdEllipsoid(x, y, az, m.head[0], m.head[1], m.head[2], m.head[3], m.head[4], m.head[5]);
      dm = smin(dm, sdCapsule(x, y, az, m.stalk[0], m.stalk[1], m.stalk[2], m.stalk[3], m.stalk[4], m.stalk[5], m.stalk[6]), 0.02);
      d = smin(d, dm, 0.012);
    }
    // wheel arches
    for (const ax of [D.axleF, D.axleR]) d = smax(d, -sdCylZ(x, y, az, ax, D.wheelR, D.archZ ?? 0.92, D.archR, D.archH ?? 0.34), 0.03);
    // recessed pockets (grilles, intakes, vents, rear panel)
    for (const c of D.cuts || []) d = smax(d, -sdBox(x, y, c.sym === false ? z : az, c.c[0], c.c[1], c.c[2], c.h[0], c.h[1], c.h[2], c.r ?? 0.03), c.k ?? 0.018);
    for (const a of D.adds || []) d = smin(d, sdBox(x, y, az, a.c[0], a.c[1], a.c[2], a.h[0], a.h[1], a.h[2], a.r ?? 0.01), a.k ?? 0.01);
    return d;
  }

  // ---- regions (negative inside)
  function glassField(x, y, z) {
    const az = Math.abs(z); const yb = belt(x);
    let g = Math.max(pWind.at(x, z), yb + 0.02 - y);
    g = Math.min(g, Math.max(pSide.at(x, y), 0.3 - az));
    if (pRear) g = Math.min(g, Math.max(pRear.at(x, z), (gl.rearMinY ?? yb + 0.02) - y));
    if (pRearFace) g = Math.min(g, Math.max(pRearFace.at(z, y), x - (gl.rearFaceMaxX ?? 0)));
    for (const bp of gl.pillars || []) g = Math.max(g, -Math.max(Math.abs(x - bp[0] - (y - 1.0) * (bp[2] || 0)) - bp[1], 0.3 - az));
    return g;
  }
  function pillarField(x, y, z) {
    const az = Math.abs(z); let t = 1e3;
    for (const bp of gl.pillars || []) t = Math.min(t, Math.max(Math.abs(x - bp[0] - (y - 1.0) * (bp[2] || 0)) - bp[1], pSide.at(x, y) - 0.03, 0.3 - az));
    return t;
  }
  function trimField(x, y, z) {
    const az = Math.abs(z);
    let t = glassField(x, y, z) - (D.sealWidth ?? 0.026);
    t = Math.min(t, pillarField(x, y, z));
    t = Math.min(t, y - (D.sillY ?? 0.2));
    // the paint / liner border runs on the smooth wall just inside the arch lip, not on the crease itself
    for (const ax of [D.axleF, D.axleR]) t = Math.min(t, Math.max(sdCylZ(x, y, az, ax, D.wheelR, D.archZ ?? 0.92, D.archR + 0.02, D.archH ?? 0.34), az - (planW(x) - 0.035)));
    for (const c of D.cuts || []) if (c.black !== false) t = Math.min(t, sdBox(x, y, c.sym === false ? z : az, c.c[0], c.c[1], c.c[2], c.h[0] + 0.004, c.h[1] + 0.004, c.h[2] + 0.004, c.r ?? 0.03));
    for (const b of D.blackBoxes || []) t = Math.min(t, sdBox(x, y, az, b.c[0], b.c[1], b.c[2], b.h[0], b.h[1], b.h[2], b.r ?? 0.02));
    return t;
  }
  const rot = (x, z, cx, cz, ang) => { const c = Math.cos(ang), s = Math.sin(ang); const dx = x - cx, dz = z - cz; return [dx * c + dz * s, -dx * s + dz * c]; };
  function headField(x, y, z) {
    const az = Math.abs(z); const h = D.head; const [lx, lz] = rot(x, az, h.c[0], h.c[2], h.yaw || 0);
    return sdEllipsoid(lx, y, lz, 0, h.c[1] + lx * (h.rise || 0), 0, h.r[0], h.r[1], h.r[2]);
  }
  function drlField(x, y, z) {
    const az = Math.abs(z); const h = D.head; const [lx, lz] = rot(x, az, h.c[0], h.c[2], h.yaw || 0);
    const yy = y - (h.c[1] + lx * (h.rise || 0)) - (h.drlY || 0);
    return Math.max(Math.abs(yy) - (h.drlH || 0.012), Math.abs(lx) - h.r[0] * 0.82, Math.abs(lz) - h.r[2] * 0.86);
  }
  function tailField(x, y, z) {
    const az = Math.abs(z); let t = 1e3;
    for (const b of D.tail) t = Math.min(t, sdBox(x, y, az, b.c[0], b.c[1], b.c[2], b.h[0], b.h[1], b.h[2], b.r ?? 0.008));
    return t;
  }
  // ---- cabin interior: an inward-facing shell a few centimetres inside the body, plus seats and dash
  const I = D.interior;
  function cavity(x, y, z) {
    const d = body(x, y, z) + (I.wall ?? 0.05);
    return smax(d, sdBox(x, y, z, (I.x0 + I.x1) / 2, (I.y0 + I.y1) / 2, 0, (I.x1 - I.x0) / 2, (I.y1 - I.y0) / 2, 2, 0.03), 0.02);
  }
  function furniture(x, y, z) {
    const az = Math.abs(z); let d = 1e3;
    for (const s of I.seats) {
      // cushion, reclined backrest, head restraint
      let ds = sdBox(x, y, az, s[0], s[1], s[2], 0.25, 0.065, 0.235, 0.06);
      ds = smin(ds, sdBox(x - (y - s[1]) * -0.22, y, az, s[0] - 0.27, s[1] + 0.33, s[2], 0.07, 0.3, 0.225, 0.06), 0.04);
      ds = smin(ds, sdEllipsoid(x, y, az, s[0] - 0.36, s[1] + 0.69, s[2], 0.07, 0.1, 0.13), 0.03);
      d = Math.min(d, ds);
    }
    d = Math.min(d, sdBox(x, y, z, I.dash[0], I.dash[1], 0, I.dash[2], I.dash[3], I.dash[4], 0.07));
    d = Math.min(d, sdBox(x, y, z, I.console[0], I.console[1], 0, I.console[2], I.console[3], 0.1, 0.04));
    // steering wheel (left-hand drive: driver on -z), rim leaning back
    const w = I.wheel; const wx = x - w[0], wy = y - w[1], wz = z - w[2];
    const ca = Math.cos(0.42), sa = Math.sin(0.42); const ux = wx * ca + wy * sa, uy = -wx * sa + wy * ca;
    const q = Math.hypot(uy, wz) - w[3]; d = Math.min(d, Math.hypot(q, ux) - 0.017);
    d = Math.min(d, sdCapsule(x, y, z, w[0], w[1], w[2], w[0] + 0.3, w[1] - 0.12, w[2], 0.03));
    return d;
  }
  return { D, side, planW, belt, shell, body, glassField, trimField, headField, drlField, tailField, cavity, furniture, pillarField };
}

function orient(mesh) {
  // make sure triangles face the same way as the field gradient
  const p = mesh.pos, n = mesh.nor; let s = 0;
  for (let t = 0; t < mesh.tri.length; t += 3) {
    const a = mesh.tri[t] * 3, b = mesh.tri[t + 1] * 3, c = mesh.tri[t + 2] * 3;
    const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2], vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2];
    s += (uy * vz - uz * vy) * n[a] + (uz * vx - ux * vz) * n[a + 1] + (ux * vy - uy * vx) * n[a + 2];
  }
  if (s < 0) for (let t = 0; t < mesh.tri.length; t += 3) { const q = mesh.tri[t + 1]; mesh.tri[t + 1] = mesh.tri[t + 2]; mesh.tri[t + 2] = q; }
  return mesh;
}

/** builds every material group of one car at a given voxel size */
export function buildCar(D, cell, { detail = true } = {}) {
  const F = makeFields(D);
  const pad = 0.12;
  const bounds = { min: [D.bounds.x0 - pad, 0.02, -(D.bounds.w + pad)], max: [D.bounds.x1 + pad, D.bounds.h + pad, D.bounds.w + pad] };
  const t0 = Date.now();
  let m = orient(meshField(F.body, bounds, cell, { project: 3, normalH: Math.max(0.004, cell * 0.25) }));
  const groups = {};
  let rest;
  [groups.glass, rest] = splitByField(m, F.glassField);
  let head; [head, rest] = splitByField(rest, F.headField);
  [groups.drl, groups.lamp] = splitByField(head, F.drlField);
  [groups.tail, rest] = splitByField(rest, F.tailField);
  [groups.trim, groups.paint] = splitByField(rest, F.trimField);
  // interior shell (seen through the glass): inward facing, removed where it would hide the windows
  const I = D.interior;
  const ib = { min: [I.x0 - 0.1, I.y0 - 0.1, -(D.bounds.w + 0.05)], max: [I.x1 + 0.1, I.y1 + 0.12, D.bounds.w + 0.05] };
  const icell = Math.max(cell * 1.5, 0.03);
  let cav = orient(meshField(F.cavity, ib, icell, { project: 2, normalH: 0.006 }));
  const wall = I.wall ?? 0.05;
  cav = filterMesh(cav, (x, y, z) => {
    const g = gradient(F.body, x, y, z, 0.004); const l = Math.hypot(g[0], g[1], g[2]) || 1;
    // the point of the outer skin in front of this piece of lining
    return F.glassField(x + g[0] / l * wall, y + g[1] / l * wall, z + g[2] / l * wall) > 0.012;
  });
  flipMesh(cav);
  const furn = orient(meshField(F.furniture, ib, icell, { project: 2, normalH: 0.006 }));
  groups.interior = mergeMeshes([cav, furn]);
  const tris = Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.tri.length / 3]));
  return { groups, tris, ms: Date.now() - t0, fields: F };
}
