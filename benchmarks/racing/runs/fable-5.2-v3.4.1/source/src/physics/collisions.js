// Car x barrier and car x car collisions (2D, in plan).
// Barriers are the two continuous lines of track.json ("sides"): each is a lateral distance from
// the centre line, so the test is a half-space check in track space. A car corner that is beyond
// the line is always pushed back, whatever its speed: nothing can tunnel through a barrier.

import { clamp } from '../core/math.js';

const tmpP = {}, tmpV = {}, pr = {};

/** half extents of the collision box of a car (slightly inside the body shell) */
export function carBox(spec) { return { hl: spec.length / 2 - 0.06, hw: spec.width / 2 - 0.05 }; }

const CORNERS = [[1, -1], [1, 1], [-1, 1], [-1, -1], [0, -1], [0, 1]];

/**
 * Keeps a car between the two barrier lines.
 * The response is deliberately "arcade with weight": the normal speed of the car is removed
 * (little bounce), the wall rubs speed off, and the car is turned towards the wall direction
 * instead of being spun by the full corner impulse.
 * @returns {number} strongest normal impact speed this step (m/s), 0 if none
 */
export function collideBarriers(car, track, dt) {
  const sp = track.spline; const box = car.box || (car.box = carBox(car.spec));
  const c = Math.cos(car.heading), s = Math.sin(car.heading);
  let maxPen = 0, nX = 0, nZ = 0, cX = 0, cZ = 0, cLx = 0, side = 0, count = 0;
  for (let k = 0; k < CORNERS.length; k++) {
    const lx = CORNERS[k][0] * box.hl, lz = CORNERS[k][1] * box.hw;
    const wx = car.x + lx * c - lz * s, wz = car.z + lx * s + lz * c;
    sp.project(wx, wz, car.hint, pr);
    const sd = pr.d < 0 ? 0 : 1; const sg = pr.d < 0 ? -1 : 1;
    const i = pr.i, j = (i + 1) % sp.n, t = pr.t;
    const la = sp.half[i] + track.barOff[sd][i], lb = sp.half[j] + track.barOff[sd][j];
    const pen = Math.abs(pr.d) - (la + (lb - la) * t);
    if (pen <= 0) continue;
    count++;
    if (pen > maxPen) {
      maxPen = pen; side = sd; cX = wx; cZ = wz; cLx = lx;
      const dl = lb - la; // widening of the line per metre along the lap
      const hx = sp.hx[i] + (sp.hx[j] - sp.hx[i]) * t, hz = sp.hz[i] + (sp.hz[j] - sp.hz[i]) * t;
      // inward normal: N = -sg * right + dl * heading, with right = (-hz, hx)
      nX = sg * hz + dl * hx; nZ = -sg * hx + dl * hz;
      const nl = Math.hypot(nX, nZ) || 1; nX /= nl; nZ /= nl;
    }
  }
  if (count === 0) { car.wallContact = 0; return 0; }
  car.wallContact = 1;
  car.x += nX * Math.min(maxPen, 2.0); car.z += nZ * Math.min(maxPen, 2.0);
  const tX = -nZ, tZ = nX;
  let strength = 0;
  car.pointVelocity(cX, cZ, tmpV);
  const vnP = tmpV.x * nX + tmpV.z * nZ;           // normal speed of the touching corner
  const vxW = car.vxWorld, vzW = car.vzWorld;
  const vn = vxW * nX + vzW * nZ, vt = vxW * tX + vzW * tZ;
  if (vnP < 0) {
    strength = -vnP;
    const e = 0.12;
    const dvn = -(1 + e) * Math.min(vn, 0);        // removes the normal speed of the body
    const rub = Math.min(Math.abs(vt), 0.32 * strength + 0.02);
    const m = car.spec.mass;
    car.applyImpulse(car.x, car.z, (nX * dvn - tX * Math.sign(vt) * rub) * m, (nZ * dvn - tZ * Math.sign(vt) * rub) * m);
    // turn the car away from the wall around the touching corner, but only a controlled amount
    const rx = cX - car.x, rz = cZ - car.z;
    const lever = rx * nZ - rz * nX;
    let dr = 0.3 * lever * (-(1 + e) * vnP) * m / car.Iz;
    dr = clamp(dr, -1.1, 1.1);
    car.r = clamp(car.r + dr, -2.4, 2.4);
  }
  // rubbing along the wall: drag plus yaw damping, so the car settles parallel to it
  const vt2 = car.vxWorld * tX + car.vzWorld * tZ;
  const drag = Math.min(Math.abs(vt2), 3.2 * dt);
  car.applyImpulse(car.x, car.z, -tX * Math.sign(vt2) * drag * car.spec.mass, -tZ * Math.sign(vt2) * drag * car.spec.mass);
  car.r *= Math.exp(-6 * dt);
  car.wallScrape = Math.max(car.wallScrape, Math.min(1, Math.abs(vt2) / 22));
  car.lastWall = { x: cX, z: cZ, nx: nX, nz: nZ, side };
  if (strength > 0.8) car.events.push({ type: 'wall', strength, x: cX, z: cZ });
  return strength;
}

function boxAxes(car, box) {
  const c = Math.cos(car.heading), s = Math.sin(car.heading);
  return { fx: c, fz: s, rx: -s, rz: c, hl: box.hl, hw: box.hw };
}

/** oriented-box overlap test; returns the minimum translation (from A to B) and a contact point */
function satBoxes(a, A, b, Bx) {
  const dx = b.x - a.x, dz = b.z - a.z;
  let best = Infinity, bnx = 0, bnz = 0;
  const axes = [[A.fx, A.fz], [A.rx, A.rz], [Bx.fx, Bx.fz], [Bx.rx, Bx.rz]];
  for (let k = 0; k < 4; k++) {
    const ax = axes[k][0], az = axes[k][1];
    const ra = A.hl * Math.abs(A.fx * ax + A.fz * az) + A.hw * Math.abs(A.rx * ax + A.rz * az);
    const rb = Bx.hl * Math.abs(Bx.fx * ax + Bx.fz * az) + Bx.hw * Math.abs(Bx.rx * ax + Bx.rz * az);
    const dist = dx * ax + dz * az;
    const ov = ra + rb - Math.abs(dist);
    if (ov <= 0) return null;
    if (ov < best) { best = ov; const sg = dist < 0 ? -1 : 1; bnx = ax * sg; bnz = az * sg; }
  }
  return { depth: best, nx: bnx, nz: bnz };
}

function supportPoint(car, box, nx, nz, out) {
  // point of the box furthest along (nx, nz); averages the two corners when an edge is facing
  const c = Math.cos(car.heading), s = Math.sin(car.heading);
  const df = nx * c + nz * s, dr = -nx * s + nz * c;
  let lx = Math.abs(df) < 0.12 ? 0 : Math.sign(df) * box.hl;
  let lz = Math.abs(dr) < 0.12 ? 0 : Math.sign(dr) * box.hw;
  out.x = car.x + lx * c - lz * s; out.z = car.z + lx * s + lz * c; return out;
}

/** resolves contacts between all pairs of cars; returns the list of impacts {a,b,strength,x,z} */
export function collideCars(cars) {
  const impacts = [];
  for (let i = 0; i < cars.length; i++) {
    const a = cars[i]; const boxA = a.box || (a.box = carBox(a.spec));
    for (let j = i + 1; j < cars.length; j++) {
      const b = cars[j]; const boxB = b.box || (b.box = carBox(b.spec));
      const dx = b.x - a.x, dz = b.z - a.z;
      if (dx * dx + dz * dz > 36) continue;
      if (Math.abs(a.y - b.y) > 2.5) continue;
      const hit = satBoxes(a, boxAxes(a, boxA), b, boxAxes(b, boxB));
      if (!hit) continue;
      const { nx, nz, depth } = hit;
      // separate (mass weighted)
      const ma = a.spec.mass, mb = b.spec.mass; const tot = ma + mb;
      const corr = depth * 0.9;
      a.x -= nx * corr * (mb / tot); a.z -= nz * corr * (mb / tot);
      b.x += nx * corr * (ma / tot); b.z += nz * corr * (ma / tot);
      // contact point: midway between the two facing support points
      const pa = supportPoint(a, boxA, nx, nz, {}), pb = supportPoint(b, boxB, -nx, -nz, {});
      const cx = (pa.x + pb.x) / 2, cz = (pa.z + pb.z) / 2;
      const va = a.pointVelocity(cx, cz, {}), vb = b.pointVelocity(cx, cz, {});
      const rvx = vb.x - va.x, rvz = vb.z - va.z;
      const vn = rvx * nx + rvz * nz;
      if (vn >= 0) continue;
      const rax = cx - a.x, raz = cz - a.z, rbx = cx - b.x, rbz = cz - b.z;
      const ran = rax * nz - raz * nx, rbn = rbx * nz - rbz * nx;
      const invM = 1 / ma + 1 / mb + (ran * ran) / a.Iz + (rbn * rbn) / b.Iz;
      const e = 0.22;
      const jn = -(1 + e) * vn / invM;
      const tx = -nz, tz = nx; const vt = rvx * tx + rvz * tz;
      const rat = rax * tz - raz * tx, rbt = rbx * tz - rbz * tx;
      const invMt = 1 / ma + 1 / mb + (rat * rat) / a.Iz + (rbt * rbt) / b.Iz;
      const jt = clamp(-vt / invMt, -0.3 * jn, 0.3 * jn);
      const jx = nx * jn + tx * jt, jz = nz * jn + tz * jt;
      a.applyImpulse(cx, cz, -jx, -jz); b.applyImpulse(cx, cz, jx, jz);
      const strength = -vn;
      impacts.push({ a: a.id, b: b.id, strength, x: cx, z: cz });
      if (strength > 0.5) { a.events.push({ type: 'car', strength, x: cx, z: cz, other: b.id }); b.events.push({ type: 'car', strength, x: cx, z: cz, other: a.id }); }
    }
  }
  return impacts;
}
