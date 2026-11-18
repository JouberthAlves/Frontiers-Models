// AI racing line and speed profile, derived from the track spline:
//  - lateral offset per sample that minimises curvature inside the usable road width
//  - target speed per sample from the curvature of that line, with a backward (braking) and a
//    forward (traction / power) pass, for a given car spec
// The road shader also reads the offset to lay the rubber on the same line.

import { clamp, lerp } from '../core/math.js';
import { SURF } from '../world/track.js';

const G = 9.81;

function relax(pts, lim, cx, cz, rx, rz, iters, omega) {
  // pts: {o: Float64Array offsets} on a coarse closed polyline; Gauss-Seidel on the bending energy
  const n = cx.length; const o = pts;
  const px = new Float64Array(n), pz = new Float64Array(n);
  for (let i = 0; i < n; i++) { px[i] = cx[i] + rx[i] * o[i]; pz[i] = cz[i] + rz[i] * o[i]; }
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      const a2 = (i + n - 2) % n, a1 = (i + n - 1) % n, b1 = (i + 1) % n, b2 = (i + 2) % n;
      const Ax = px[a2] - 2 * px[a1] + cx[i], Az = pz[a2] - 2 * pz[a1] + cz[i];
      const Bx = px[a1] + px[b1] - 2 * cx[i], Bz = pz[a1] + pz[b1] - 2 * cz[i];
      const Cx = cx[i] - 2 * px[b1] + px[b2], Cz = cz[i] - 2 * pz[b1] + pz[b2];
      const Ar = Ax * rx[i] + Az * rz[i], Br = Bx * rx[i] + Bz * rz[i], Cr = Cx * rx[i] + Cz * rz[i];
      let t = (2 * Br - Ar - Cr) / 6;
      t = o[i] + (t - o[i]) * omega;
      t = clamp(t, -lim[0][i], lim[1][i]);
      o[i] = t; px[i] = cx[i] + rx[i] * t; pz[i] = cz[i] + rz[i] * t;
    }
  }
}

export function buildRacingLine(track) {
  const sp = track.spline; const n = sp.n;
  const margin = 1.75; // half a car plus a safety gap to the edge of the asphalt
  const limFull = [new Float64Array(n), new Float64Array(n)];
  for (let i = 0; i < n; i++) for (let k = 0; k < 2; k++) {
    // a kerb adds a little usable width on its side
    limFull[k][i] = Math.max(0.3, sp.half[i] - margin + (track.kerb[k][i] ? 0.55 : 0));
  }
  let off = null;
  for (const step of [16, 8, 4]) {
    const m = Math.floor(n / step);
    const cx = new Float64Array(m), cz = new Float64Array(m), rx = new Float64Array(m), rz = new Float64Array(m);
    const lim = [new Float64Array(m), new Float64Array(m)]; const o = new Float64Array(m);
    for (let q = 0; q < m; q++) {
      const i = Math.min(n - 1, Math.round(q * n / m));
      cx[q] = sp.x[i]; cz[q] = sp.z[i]; rx[q] = sp.rx[i]; rz[q] = sp.rz[i];
      // the limit of a coarse node is the tightest limit of the samples it stands for
      let l0 = Infinity, l1 = Infinity;
      for (let k = -(step >> 1); k <= (step >> 1); k++) { const j = ((i + k) % n + n) % n; l0 = Math.min(l0, limFull[0][j]); l1 = Math.min(l1, limFull[1][j]); }
      lim[0][q] = l0; lim[1][q] = l1;
      if (off) { const f = q * off.length / m; const a = Math.floor(f) % off.length, b = (a + 1) % off.length; o[q] = clamp(lerp(off[a], off[b], f - Math.floor(f)), -l0, l1); }
    }
    relax(o, lim, cx, cz, rx, rz, step === 4 ? 700 : 500, 1.35);
    off = o;
  }
  // resample to the 1 m samples with a periodic Catmull-Rom, then a light smoothing pass
  const m = off.length; const line = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const f = i * m / n; const a = Math.floor(f); const t = f - a;
    const p0 = off[(a + m - 1) % m], p1 = off[a % m], p2 = off[(a + 1) % m], p3 = off[(a + 2) % m];
    line[i] = clamp(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t), -limFull[0][i], limFull[1][i]);
  }
  // positions, curvature of the line (smoothed finite differences over +-3 m)
  const x = new Float64Array(n), z = new Float64Array(n), kappa = new Float32Array(n);
  for (let i = 0; i < n; i++) { x[i] = sp.x[i] + sp.rx[i] * line[i]; z[i] = sp.z[i] + sp.rz[i] * line[i]; }
  const W = 3;
  for (let i = 0; i < n; i++) {
    const a = (i + n - W) % n, b = (i + W) % n;
    const x1 = x[i] - x[a], z1 = z[i] - z[a], x2 = x[b] - x[i], z2 = z[b] - z[i];
    const l1 = Math.hypot(x1, z1), l2 = Math.hypot(x2, z2);
    const cross = x1 * z2 - z1 * x2; const dot = x1 * x2 + z1 * z2;
    kappa[i] = Math.atan2(cross, dot) / ((l1 + l2) / 2);
  }
  const ks = new Float32Array(n);
  for (let i = 0; i < n; i++) { let acc = 0; for (let k = -2; k <= 2; k++) acc += kappa[((i + k) % n + n) % n]; ks[i] = acc / 5; }
  return { off: line, x, z, kappa: ks, limits: limFull };
}

/**
 * Speed profile of a car spec on the racing line.
 * @param grip scales the lateral/longitudinal acceleration the driver is willing to use (skill / difficulty)
 */
export function buildSpeedProfile(track, line, spec, grip = 1) {
  const sp = track.spline; const n = sp.n; const ds = sp.ds;
  const v = new Float32Array(n);
  const mu = spec.mu * 0.94 * grip;
  const kdf = 0.5 * 1.2 * spec.clA / spec.mass;        // downforce per unit mass per v^2
  const kdrag = 0.5 * 1.2 * spec.cdA / spec.mass;
  const eng = spec.engine;
  const vTop = eng.redline / 9.5493 / (eng.gears[eng.gears.length - 1] * eng.final) * spec.wheelRadius;
  for (let i = 0; i < n; i++) {
    const k = Math.abs(line.kappa[i]);
    const den = k - mu * kdf;
    let vc = den > 1e-5 ? Math.sqrt(mu * G / den) : vTop;
    // off-camber / banking: the road bank helps (or hurts) a little
    const bankHelp = Math.sign(line.kappa[i]) * Math.sin(sp.bank[i]) * G;
    if (k > 1e-4) vc = Math.sqrt(Math.max(4, vc * vc + bankHelp / k * 0.8));
    v[i] = Math.min(vc, vTop);
  }
  const aMax = (vv) => mu * (G + kdf * vv * vv);
  // backward pass: braking, sharing the tyre with the cornering force
  for (let pass = 0; pass < 2; pass++) for (let q = n * 2 - 1; q >= 0; q--) {
    const i = q % n, j = (i + 1) % n;
    const vv = v[j]; const lat = vv * vv * Math.abs(line.kappa[i]);
    const am = aMax(vv);
    const room = Math.sqrt(Math.max(0.04, 1 - Math.min(1, (lat / am) ** 2)));
    const grade = sp.grade[i]; // uphill helps braking
    const a = Math.min(am * 0.86 * room, spec.brakeForce / spec.mass * 0.92) + kdrag * vv * vv + G * grade;
    const lim = Math.sqrt(vv * vv + 2 * Math.max(1, a) * ds);
    if (lim < v[i]) v[i] = lim;
  }
  // the envelope: the highest speed from which the car can still make every corner ahead. This is what a driver
  // aims at; how fast the engine gets it there (next pass) depends on the day: a tow, a slope, a bad exit
  const env = Float32Array.from(v);
  // forward pass: traction and engine power
  const driveShare = spec.drive[1] >= 0.99 ? 0.56 : spec.drive[0] >= 0.99 ? 0.52 : 0.9;
  for (let pass = 0; pass < 2; pass++) for (let q = 0; q < n * 2; q++) {
    const i = q % n, j = (i + n - 1) % n;
    const vv = Math.max(v[j], 3); const lat = vv * vv * Math.abs(line.kappa[i]);
    const am = aMax(vv);
    const room = Math.sqrt(Math.max(0.04, 1 - Math.min(1, (lat / am) ** 2)));
    // engine: best gear force at this speed
    let f = 0;
    for (const gr of eng.gears) {
      const rpm = vv / spec.wheelRadius * gr * eng.final * 9.5493;
      if (rpm > eng.redline) continue;
      const tq = eng.peakTorque * eng.curve(Math.max(rpm, eng.idle * 1.6) / eng.redline);
      f = Math.max(f, tq * gr * eng.final * eng.efficiency / spec.wheelRadius);
    }
    const a = Math.min(f / spec.mass, am * driveShare * room * 0.95) - kdrag * vv * vv - G * sp.grade[i] - 0.15;
    const lim = Math.sqrt(vv * vv + 2 * Math.max(0.2, a) * ds);
    if (lim < v[i]) v[i] = lim;
  }
  let t = 0; for (let i = 0; i < n; i++) t += ds / Math.max(v[i], 1);
  return { v, env, lapTime: t, vTop };
}
