// Arcade vehicle with weight. Fixed 120 Hz steps.
//  - planar rigid body (surge / sway / yaw) driven by four tyres with slip angles and a friction circle
//  - sprung mass with heave / pitch / roll on four spring-dampers, so load transfer, body roll,
//    squat and dive are real states, not decoration
//  - every wheel reads the ground under it from the world (road mesh rows or terrain height field)
// The player and the AIs are instances of this same class: same forces, same limits.

import { clamp, clamp01, lerp, smoothstep, DEG, damp } from '../core/math.js';
import { SURFACE_PHYS } from './car-specs.js';
import { SURF } from '../world/track.js';

export const PHYS_HZ = 120;
export const PHYS_DT = 1 / PHYS_HZ;
const G = 9.81;
const RHO = 1.2;
const TOW_DRAG = 0.45;       // share of the aerodynamic drag that disappears right behind another car

/**
 * Slipstream: a car running in the wake of another (up to about 36 m behind it, in line with it) meets less air.
 * The same for every car, player included; it is what lets a quicker car get alongside on a straight.
 */
export function slipstream(vehicles, dt) {
  for (const a of vehicles) {
    let tow = 0; const ca = Math.cos(a.heading), sa = Math.sin(a.heading);
    for (const b of vehicles) {
      if (b === a) continue;
      const dx = b.x - a.x, dz = b.z - a.z; const fwd = dx * ca + dz * sa; if (fwd < 2 || fwd > 38) continue;
      const lat = Math.abs(-dx * sa + dz * ca); if (lat > 2.2) continue;
      const k = (1 - (fwd - 2) / 36) * (1 - lat / 2.2) * Math.min(1, b.speed / 25);
      if (k > tow) tow = k;
    }
    a.tow += (tow - a.tow) * Math.min(1, dt * 4);
  }
}

export class Vehicle {
  /**
   * @param spec entry of CAR_SPECS
   * @param ground {sample(x,z,hint,out):void}
   */
  constructor(spec, ground, id = 0) {
    this.spec = spec; this.ground = ground; this.id = id;
    const L = spec.wheelbase;
    this.a = L * (1 - spec.frontWeight); this.b = L * spec.frontWeight; // CG to front / rear axle
    const tw = spec.track / 2;
    this.wheelPos = [[this.a, -tw], [this.a, tw], [-this.b, -tw], [-this.b, tw]];
    const m = spec.mass;
    this.Iz = m * this.a * this.b * spec.yawInertiaK;
    this.Ipitch = m * (L * L) / 5.2; this.Iroll = m * (spec.track * spec.track) / 4.6;
    const wF = m * G * spec.frontWeight / 2, wR = m * G * (1 - spec.frontWeight) / 2;
    this.wStatic = [wF, wF, wR, wR];
    this.kS = [spec.spring[0], spec.spring[0], spec.spring[1], spec.spring[1]];
    this.cS = [spec.damper[0], spec.damper[0], spec.damper[1], spec.damper[1]];
    this.xStatic = this.wStatic.map((w, i) => w / this.kS[i]);
    this.wheels = [0, 1, 2, 3].map((i) => ({
      index: i, x: 0, y: 0, z: 0, groundY: 0, prevGroundY: 0, comp: this.xStatic[i], load: this.wStatic[i], contact: true,
      surf: SURF.ASPHALT, spin: 0, omega: 0, steer: 0, slipLat: 0, slipLong: 0, skid: 0, hint: -1, nx: 0, ny: 1, nz: 0, sTrack: 0, dTrack: 0,
    }));
    this.input = { steer: 0, throttle: 0, brake: 0, handbrake: 0 };
    this.assist = { tc: 1, abs: 1, stability: 1 };
    this.events = [];           // collisions etc. for audio / particles, drained by the game each frame
    this.gripScale = 1; this.powerScale = 1;
    this.tow = 0;               // 0..1: how deep the car sits in the wake of the one ahead (see slipstream())
    this.frozen = false;        // held on the grid during the countdown
    this.reset(0, 0, 0, 0);
  }

  reset(x, z, heading, y = null, speed = 0) {
    this.x = x; this.z = z; this.heading = heading;
    this.u = speed; this.v = 0; this.r = 0;
    const g = this._g || (this._g = {});
    this.hint = -1;
    for (const w of this.wheels) { w.hint = -1; }
    this._updateWheelGround(true);
    const gy = (this.wheels[0].groundY + this.wheels[1].groundY + this.wheels[2].groundY + this.wheels[3].groundY) / 4;
    this.y = y === null ? gy : y; this.vy = 0;
    // start aligned with the ground plane
    const gf = (this.wheels[0].groundY + this.wheels[1].groundY) / 2, gr = (this.wheels[2].groundY + this.wheels[3].groundY) / 2;
    const gl = (this.wheels[0].groundY + this.wheels[2].groundY) / 2, grt = (this.wheels[1].groundY + this.wheels[3].groundY) / 2;
    this.pitch = (gf - gr) / this.spec.wheelbase; this.roll = -(grt - gl) / this.spec.track;
    this.pitchRate = 0; this.rollRate = 0;
    this.steerAngle = 0; this.steerState = 0; this.beta = 0; this.maxSteer = this.spec.steerLock * DEG; this.skid = 0; this.minClear = 0; this.limiting = false;
    this.rpm = this.spec.engine.idle; this.gear = 1; this.shiftTimer = 0; this.shiftCooldown = 0; this.limiterTimer = 0;
    if (speed > 2) {
      const e = this.spec.engine;
      for (let g = 1; g <= e.gears.length; g++) { this.gear = g; this.rpm = speed / this.spec.wheelRadius * e.gears[g - 1] * e.final * 9.5493; if (this.rpm < e.redline * 0.86) break; }
      this.rpm = clamp(this.rpm, e.idle, e.limiter - 120);
    }
    this.throttleEff = 0; this.engineLoad = 0; this.reverse = false; this.thrGear = speed > 2 ? 1 : 0;
    this.speed = Math.abs(speed); this.ax = 0; this.az = 0; this.fxTot = 0; this.fzTot = 0;
    this.airTime = 0; this.onGround = true; this.wallContact = 0; this.wallScrape = 0;
    this.lastShift = 0; this.shiftEvent = 0; this.tow = 0;
    for (let i = 0; i < 4; i++) { const w = this.wheels[i]; w.prevGroundY = w.groundY; w.comp = this.xStatic[i]; w.load = this.wStatic[i]; w.skid = 0; w.omega = speed / this.spec.wheelRadius; w.gDotF = 0; w.gDot = 0; w.spin = 0; }
  }

  get cos() { return Math.cos(this.heading); }
  get sin() { return Math.sin(this.heading); }

  /** world xz of a point given in the car frame (lx forward, lz right) */
  toWorld(lx, lz, out) {
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    out.x = this.x + lx * c - lz * s; out.z = this.z + lx * s + lz * c; return out;
  }

  _updateWheelGround(first = false) {
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    const g = this._gq || (this._gq = {});
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i]; const lx = this.wheelPos[i][0], lz = this.wheelPos[i][1];
      w.x = this.x + lx * c - lz * s; w.z = this.z + lx * s + lz * c;
      this.ground.sample(w.x, w.z, w.hint, g);
      w.hint = g.i; w.prevGroundY = first ? g.y : w.groundY; w.groundY = g.y; w.surf = g.surf;
      w.nx = g.nx; w.ny = g.ny; w.nz = g.nz; w.sTrack = g.s; w.dTrack = g.d;
    }
    // track-space position of the car centre (lap progress, lateral offset)
    this.ground.sample(this.x, this.z, this.hint, g);
    this.hint = g.i; this.s = g.s; this.d = g.d; this.centerGroundY = g.y; this.onRoad = g.onRoad; this.centerSurf = g.surf;
  }

  step(dt = PHYS_DT) {
    const spec = this.spec, eng = spec.engine, inp = this.input;
    const m = spec.mass, R = spec.wheelRadius;
    this._updateWheelGround();
    const ws = this.wheels;

    // ------------------------------------------------------------------ suspension (heave / pitch / roll)
    let fSum = 0, mPitch = 0, mRoll = 0, contacts = 0;
    const comp = this._comp || (this._comp = [0, 0, 0, 0]);
    // hard floor against the fresh ground heights: the sprung mass can never sink through the bump
    // stops. The body then simply follows the ground (no bounce).
    {
      let minClear = Infinity, gDotMean = 0;
      for (let i = 0; i < 4; i++) {
        const w = ws[i]; const lx = this.wheelPos[i][0], lz = this.wheelPos[i][1];
        const cl = this.y + this.pitch * lx - this.roll * lz - w.groundY; if (cl < minClear) minClear = cl;
        w.gDot = clamp((w.groundY - w.prevGroundY) / dt, -9, 9);
        w.gDotF = w.gDotF === undefined ? w.gDot : w.gDotF + (w.gDot - w.gDotF) * 0.5;
        gDotMean += w.gDot * 0.25;
      }
      const floor = -(spec.rideHeight - 0.03);
      if (minClear < floor) { this.y += floor - minClear; if (this.vy < gDotMean) this.vy = gDotMean; minClear = floor; }
      this.minClear = minClear;
    }
    for (let i = 0; i < 4; i++) {
      const w = ws[i]; const lx = this.wheelPos[i][0], lz = this.wheelPos[i][1];
      const yAtt = this.y + this.pitch * lx - this.roll * lz;
      const yAttDot = this.vy + this.pitchRate * lx - this.rollRate * lz;
      const x = this.xStatic[i] + (w.groundY - yAtt);
      const xDot = w.gDotF - yAttDot;
      comp[i] = x; w.comp = x; w._xDot = xDot;
    }
    for (let i = 0; i < 4; i++) {
      const w = ws[i]; const x = comp[i];
      let F = 0;
      if (x > 0) {
        const cd = w._xDot > 0 ? this.cS[i] * 0.9 : this.cS[i] * 1.5; // bump / rebound
        F = this.kS[i] * x + cd * w._xDot;
        if (x > this.xStatic[i] + spec.bump) F += this.kS[i] * 7 * (x - this.xStatic[i] - spec.bump);
        // anti-roll bar: couples left and right of the same axle
        const other = comp[i ^ 1]; const arb = spec.arb[i < 2 ? 0 : 1];
        F += arb * (x - Math.max(other, 0));
        F = clamp(F, 0, this.wStatic[i] * 7);
      }
      w.contact = x > 0; if (w.contact) contacts++;
      w.load = F;
      const lx = this.wheelPos[i][0], lz = this.wheelPos[i][1];
      fSum += F; mPitch += F * lx; mRoll -= F * lz;
    }
    this.onGround = contacts > 0;
    this.airTime = contacts === 0 ? this.airTime + dt : 0;

    // ------------------------------------------------------------------ driver inputs -> steering
    const u = this.u, v = this.v;
    const speed = Math.hypot(u, v); this.speed = speed;
    const mu0 = spec.mu * this.gripScale;
    // steering lock shrinks with speed so that full input always asks for about the grip limit
    const lock = spec.steerLock * DEG;
    // geometric angle for the tightest turn the tyres can hold at this speed + the slip angle of peak grip
    const need = Math.atan(spec.wheelbase * mu0 * G * 1.2 / Math.max(u * u, 9)) + spec.peakSlip * 1.15;
    const maxSteer = Math.min(lock, need);
    this.maxSteer = maxSteer;
    let steerTarget = clamp(inp.steer, -1, 1) * maxSteer;
    // countersteer assist: lean the wheels towards the direction of travel when the tail steps out
    const beta = speed > 3 ? Math.atan2(v, Math.abs(u)) : 0;
    this.beta = beta;
    if (this.assist.stability > 0 && speed > 6) steerTarget += clamp(beta * 0.55, -0.22, 0.22) * this.assist.stability * smoothstep(0.03, 0.12, Math.abs(beta));
    steerTarget = clamp(steerTarget, -lock, lock);
    const rate = (Math.abs(steerTarget) < Math.abs(this.steerAngle) ? 5.2 : 3.4) * lock;
    this.steerAngle += clamp(steerTarget - this.steerAngle, -rate * dt, rate * dt);
    const delta = this.steerAngle;
    ws[0].steer = delta; ws[1].steer = delta;

    // ------------------------------------------------------------------ engine / gearbox
    let throttle = clamp01(inp.throttle), brake = clamp01(inp.brake);
    // brake at standstill engages reverse; in reverse the pedals swap roles
    if (!this.frozen) {
      if (!this.reverse && brake > 0.5 && throttle < 0.1 && u < 0.6 && u > -0.5 && this._revHold > 0.25) this.reverse = true;
      if (this.reverse && throttle > 0.3 && u > -1.0) this.reverse = false;
    }
    this._revHold = (brake > 0.5 && Math.abs(u) < 0.6) ? (this._revHold || 0) + dt : 0;
    if (this.reverse) { const t = throttle; throttle = brake; brake = t; }
    if (this.frozen) { brake = 1; }
    let drivenSpeed = 0, dw = 0;
    for (let i = 0; i < 4; i++) { const share = spec.drive[i < 2 ? 0 : 1]; if (share > 0) { drivenSpeed += (u - this.r * this.wheelPos[i][1]); dw++; } }
    drivenSpeed = dw ? drivenSpeed / dw : u;
    const gearRatio = this.reverse ? -eng.reverse : eng.gears[this.gear - 1];
    const ratio = gearRatio * eng.final;
    const rpmWheel = Math.abs(drivenSpeed) / R * Math.abs(ratio) * 9.5493;
    // clutch slip at launch: the engine may spin faster than the wheels at low speed
    const launch = lerp(eng.idle, eng.redline * 0.58, throttle);
    let rpmTarget = Math.max(rpmWheel, this.frozen ? lerp(eng.idle, eng.redline * 0.72, clamp01(inp.throttle)) : Math.min(launch, rpmWheel + 2600));
    rpmTarget = Math.max(rpmTarget, eng.idle);
    this.shiftEvent = 0;
    if (this.shiftTimer > 0) {
      this.shiftTimer -= dt;
    }
    this.shiftCooldown -= dt;
    // the gearbox reads a throttle that rises at once and falls slowly: a short lift does not send it up a gear
    this.thrGear = throttle > this.thrGear ? throttle : damp(this.thrGear, throttle, 2.0, dt);
    if (!this.reverse && !this.frozen && this.shiftTimer <= 0 && this.shiftCooldown <= 0 && contacts >= 2) {
      const upAt = eng.redline * lerp(0.62, 0.965, clamp01(this.thrGear * 1.3));
      if (this.gear < eng.gears.length && rpmWheel > upAt) {
        this.gear++; this.shiftTimer = eng.shiftTime; this.shiftCooldown = eng.shiftTime + 0.22; this.shiftEvent = 1;
      } else if (this.gear > 1) {
        const lower = rpmWheel * eng.gears[this.gear - 2] / eng.gears[this.gear - 1];
        const downAt = eng.redline * lerp(0.80, 0.9, clamp01(Math.max(throttle, brake)));
        // kick-down: the foot goes down in too high a gear and the lower one still has revs to spare
        const kick = throttle > 0.85 && lower < eng.redline * 0.86;
        if (kick || (lower < downAt * 0.92 && rpmWheel < eng.redline * lerp(0.36, 0.56, clamp01(throttle)))) {
          this.gear--; this.shiftTimer = eng.shiftTime * 0.8; this.shiftCooldown = eng.shiftTime + 0.16; this.shiftEvent = -1;
        }
      }
    }
    // engine speed follows its target with a little inertia; limiter bounces at the top
    this.rpm = damp(this.rpm, rpmTarget, this.frozen || rpmWheel < rpmTarget - 50 ? 9 : 26, dt);
    let cut = this.shiftTimer > 0 ? 0 : 1;
    if (this.rpm >= eng.limiter) { this.limiterTimer = 0.07; }
    if (this.limiterTimer > 0) { this.limiterTimer -= dt; cut = 0; this.rpm = Math.min(this.rpm, eng.limiter - 60); }
    this.limiting = this.limiterTimer > 0;
    this.throttleEff = damp(this.throttleEff, throttle * cut, 30, dt);
    const tq = eng.peakTorque * eng.curve(this.rpm / eng.redline) * this.powerScale;
    let engineTorque = tq * this.throttleEff - (1 - this.throttleEff) * eng.engineBrake * eng.peakTorque * clamp01((this.rpm - eng.idle) / (eng.redline - eng.idle)) * (this.shiftTimer > 0 ? 0 : 1);
    this.engineLoad = this.throttleEff;
    let driveForce = this.frozen ? 0 : engineTorque * ratio * eng.efficiency / R; // total, at the contact patches (signed)

    // ------------------------------------------------------------------ tyres
    const cosD = Math.cos(delta), sinD = Math.sin(delta);
    let fx = 0, fz = 0, mz = 0;
    const down = 0.5 * RHO * spec.clA * u * u;
    const hb = clamp01(inp.handbrake);
    let scrubMax = 0;
    for (let i = 0; i < 4; i++) {
      const w = ws[i]; const lx = this.wheelPos[i][0], lz = this.wheelPos[i][1];
      const front = i < 2;
      const vxw = u - this.r * lz, vzw = v + this.r * lx;
      const cd = front ? cosD : 1, sd = front ? sinD : 0;
      const vLong = vxw * cd + vzw * sd, vLat = -vxw * sd + vzw * cd;
      const sp = SURFACE_PHYS[w.surf] || SURFACE_PHYS[0];
      const Fz = w.load;
      let mu = mu0 * sp[0];
      // load sensitivity: a heavily loaded tyre gives a little less grip per newton
      mu *= 1 - 0.07 * clamp((Fz / this.wStatic[i]) - 1, -1, 2);
      const cap = mu * Fz;
      let Fx = 0, Fy = 0;
      if (w.contact && cap > 1) {
        // --- lateral demand first: slip angle through a simplified magic formula
        const alpha = Math.atan2(vLat, Math.max(Math.abs(vLong), 3.0));
        const Bc = spec.corneringB * (front ? 1 : 1.08), Cc = spec.corneringC;
        let fyN = Math.sin(Cc * Math.atan(Bc * alpha));
        // keep most of the peak when sliding wide so drifts are controllable
        const aa = Math.abs(alpha);
        if (aa > 0.18) fyN = Math.sign(alpha) * lerp(Math.abs(fyN), spec.peakFalloff, smoothstep(0.18, 0.6, aa));
        // what is left of the friction circle for driving / braking once the tyre corners this hard
        const latUse = Math.min(1, Math.abs(fyN));
        // --- longitudinal demand
        const share = spec.drive[front ? 0 : 1] / 2;
        let demand = driveForce * share;
        if (this.assist.tc > 0) {
          // traction control keeps the tyre inside the circle; relaxed while the driver holds a slide on purpose
          const relax = 1 + 0.9 * smoothstep(0.14, 0.32, Math.abs(beta)) * clamp01(throttle * 1.2 - 0.2) * (this.assist.tc < 1 ? 1.4 : 1);
          const lim = cap * Math.sqrt(Math.max(0.05, 1 - latUse * latUse * 0.93)) * relax;
          if (Math.abs(demand) > lim) demand = Math.sign(demand) * lim;
        }
        let brakeF = brake * spec.brakeForce * (front ? spec.brakeBias : 1 - spec.brakeBias) / 2;
        // stability under braking: the rear brakes let go as the car starts to rotate, so the tail keeps its side grip
        if (!front && this.assist.stability > 0) brakeF *= 1 - 0.85 * this.assist.stability * smoothstep(0.035, 0.15, Math.abs(beta));
        if (this.assist.abs > 0) brakeF = Math.min(brakeF, cap * Math.sqrt(Math.max(0.12, 1 - latUse * latUse * 0.8)));
        let locked = false;
        if (!front && hb > 0.05) { brakeF = Math.max(brakeF, cap * 1.05 * hb); locked = hb > 0.5; demand *= 1 - hb; }
        const roll = sp[1] * Fz;
        // brakes and rolling drag oppose the motion and can only bring the wheel to rest
        const resist = brakeF + roll;
        const stopF = Math.abs(vLong) * m / (4 * dt);
        Fx = demand - Math.sign(vLong) * Math.min(resist, stopF + Math.abs(demand));
        let latCap = cap * (locked ? 0.55 : 1);
        Fy = -fyN * latCap;
        // --- friction circle
        const usedX = clamp(Math.abs(Fx) / cap, 0, 1.6);
        if (usedX > 1) { w.slipLong = usedX - 1; Fx = Math.sign(Fx) * cap; } else w.slipLong = 0;
        const room = Math.sqrt(Math.max(0.06, 1 - Math.min(1, usedX * usedX)));
        if (Math.abs(fyN) > room) Fy *= room / Math.abs(fyN);
        w.slipLat = vLat; w.alpha = alpha;
        // skid intensity for sound / smoke / marks
        const latSlide = smoothstep(0.1, 0.34, aa) * smoothstep(3, 12, Math.hypot(vLong, vLat));
        const longSlide = Math.max(clamp01(w.slipLong * 1.6), locked ? smoothstep(2, 9, Math.abs(vLong)) : 0);
        const lockSlide = this.assist.abs > 0 ? 0 : 0;
        w.skid = damp(w.skid, Math.max(latSlide, longSlide, lockSlide), 14, dt);
        if (w.skid > scrubMax) scrubMax = w.skid;
        // wheel rotation (visual): spins up under power when traction is exceeded, stops when locked
        const free = vLong / R;
        const targetOmega = locked ? 0 : free * (1 + Math.sign(demand || 1) * w.slipLong * 0.8);
        w.omega = damp(w.omega, targetOmega, 30, dt);
      } else {
        w.slipLong = 0; w.skid = damp(w.skid, 0, 10, dt); w.alpha = 0;
        w.omega = damp(w.omega, vLong / R + (front ? 0 : driveForce * 0.0004), 2, dt);
      }
      w.spin += w.omega * dt;
      w.fx = Fx; w.fy = Fy;
      const FxC = Fx * cd - Fy * sd, FzC = Fx * sd + Fy * cd;
      fx += FxC; fz += FzC; mz += lx * FzC - lz * FxC;
    }
    this.skid = scrubMax;

    // ------------------------------------------------------------------ aero, slope gravity
    fx -= 0.5 * RHO * spec.cdA * u * Math.abs(u) * (1 - TOW_DRAG * this.tow);
    fz -= 0.5 * RHO * spec.cdA * 2.2 * v * Math.abs(v);
    let nxAvg = 0, nyAvg = 0, nzAvg = 0;
    for (const w of ws) { nxAvg += w.nx; nyAvg += w.ny; nzAvg += w.nz; }
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    if (contacts > 0 && nyAvg > 0.1) {
      const gxW = G * nxAvg / nyAvg, gzW = G * nzAvg / nyAvg; // horizontal pull of gravity on the slope (world)
      fx += m * (gxW * c + gzW * s);
      fz += m * (-gxW * s + gzW * c);
    }
    // gentle yaw damping keeps the car settled at speed; a touch of aerodynamic stability too
    mz -= this.r * (900 + 14 * speed) * this.assist.stability;
    mz -= v * Math.abs(u) * 2.2 * this.assist.stability;

    // ------------------------------------------------------------------ integrate the planar body
    const ax = fx / m, az = fz / m;
    this.ax = ax; this.az = az; this.fxTot = fx; this.fzTot = fz;
    this.u += (ax + this.r * this.v) * dt;
    this.v += (az - this.r * this.u) * dt;
    this.r += (mz / this.Iz) * dt;
    if (this.frozen) { this.u = 0; this.v = 0; this.r = 0; }
    // rest: static friction holds a stopped car
    if (throttle < 0.02 && Math.abs(this.u) < 0.25 && Math.abs(this.v) < 0.25 && (brake > 0.1 || contacts > 2)) {
      if (Math.abs(ax) < 2.2) { this.u *= 0.8; this.v *= 0.8; this.r *= 0.8; }
    }
    this.x += (this.u * c - this.v * s) * dt;
    this.z += (this.u * s + this.v * c) * dt;
    this.heading += this.r * dt;
    if (this.heading > Math.PI) this.heading -= 2 * Math.PI; else if (this.heading < -Math.PI) this.heading += 2 * Math.PI;

    // ------------------------------------------------------------------ integrate the sprung mass
    const h = spec.cgHeight;
    this.vy += ((fSum - down) / m - G) * dt;
    this.pitchRate += ((mPitch + fx * h * 0.72 + down * (spec.aeroBalance - spec.frontWeight) * spec.wheelbase * 0.0) / this.Ipitch) * dt;
    this.rollRate += ((mRoll - fz * h * 0.9) / this.Iroll) * dt;
    this.y += this.vy * dt; this.pitch += this.pitchRate * dt; this.roll += this.rollRate * dt;
    this.pitch = clamp(this.pitch, -0.6, 0.6); this.roll = clamp(this.roll, -0.6, 0.6);
    this.speed = Math.hypot(this.u, this.v);
    this.wallScrape = damp(this.wallScrape, 0, 8, dt);
  }

  /** impulse (N*s) applied at a world point; used by the collision solver */
  applyImpulse(wx, wz, jx, jz) {
    const c = Math.cos(this.heading), s = Math.sin(this.heading); const m = this.spec.mass;
    const jl = jx * c + jz * s, jr = -jx * s + jz * c;
    this.u += jl / m; this.v += jr / m;
    const dx = wx - this.x, dz = wz - this.z;
    this.r += (dx * jz - dz * jx) / this.Iz;
  }

  /** world velocity of a world point rigidly attached to the car */
  pointVelocity(wx, wz, out) {
    const c = Math.cos(this.heading), s = Math.sin(this.heading);
    const vx = this.u * c - this.v * s, vz = this.u * s + this.v * c;
    const dx = wx - this.x, dz = wz - this.z;
    out.x = vx - this.r * dz; out.z = vz + this.r * dx; return out;
  }

  get vxWorld() { return this.u * Math.cos(this.heading) - this.v * Math.sin(this.heading); }
  get vzWorld() { return this.u * Math.sin(this.heading) + this.v * Math.cos(this.heading); }
  get kmh() { return this.speed * 3.6; }
}
