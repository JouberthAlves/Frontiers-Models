// AI driver. It only produces the same inputs a human does (steer, throttle, brake); the car it
// drives is a regular Vehicle. No teleporting, no rubber band, no speed gifts.
//  - follows the racing line with a pure-pursuit steering law
//  - aims at the braking envelope of its own speed profile: flat out below it, brake along it
//  - sits in the tow of a slower car and pulls out when it is about to catch it, where the line leaves
//    grip to spare; gives the move up before a corner at the limit unless the cars are already side by side
//  - keeps a side gap to a car alongside and never drives into the back of the car ahead

import { clamp, smoothstep, damp } from '../core/math.js';
import { mulberry32 } from '../core/rng.js';
import { CAR_SPECS } from '../physics/car-specs.js';

// Pace of the rivals, from the slowest to the quickest of the five:
//   grip   share of the tyre they are willing to use (their speed profile is computed with it: cornering,
//          braking and traction scale with it)
//   power  how much of the throttle they use on the straights
export const DIFFICULTY = {
  easy: { name: 'Fácil', grip: [0.65, 0.73], power: [0.72, 0.92], aggression: 0.35 },
  normal: { name: 'Normal', grip: [0.72, 0.80], power: [0.76, 0.98], aggression: 0.6 },
  hard: { name: 'Difícil', grip: [0.77, 0.805], power: [0.84, 0.985], aggression: 0.9 },
};
// The two models are different cars: the coupe pulls harder in the middle gears, the hatch is lighter. Left alone
// they could never pass each other on this short, twisty lap (each is held up where the other is strong). The
// rivals therefore race with a balance of performance, as mixed fields do: on the straights each one allows
// itself the acceleration of the weaker model at that speed, scaled by its level (`power`), and SPEC_GRIP evens
// out what is left in the corners. Two rivals of the same level are a match everywhere, a quicker one has the legs
// to go by. The player's car is not limited in any way.
export const SPEC_GRIP = { gt: 0, hatch: 0 };
const VMAX = 95;
const FORCE = {}, DRAG = {}; let REF = null;
function balance() {
  if (REF) return;
  for (const [id, spec] of Object.entries(CAR_SPECS)) {
    const e = spec.engine; const t = FORCE[id] = new Float32Array(VMAX + 1); DRAG[id] = 0.5 * 1.2 * spec.cdA / spec.mass;
    for (let v = 0; v <= VMAX; v++) {
      let f = 0;
      for (const g of e.gears) { const rpm = Math.max(v, 4) / spec.wheelRadius * g * e.final * 9.5493; if (rpm <= e.redline) f = Math.max(f, e.peakTorque * e.curve(Math.max(rpm, e.idle * 1.6) / e.redline) * g * e.final * e.efficiency / spec.wheelRadius); }
      t[v] = f / spec.mass;           // best-gear drive force per unit mass at full throttle
    }
  }
  REF = new Float32Array(VMAX + 1);
  for (let v = 0; v <= VMAX; v++) REF[v] = Math.min(...Object.keys(FORCE).map((id) => FORCE[id][v] - DRAG[id] * v * v));
}
// level of each rival by grid slot (0 = slowest of the five, 1 = quickest). The grid is not in order of pace:
// the quickest starts right behind the slowest and another quick one behind a slow one, so the field moves
// (cars of the same pace on the same engine only follow each other)
export const RIVAL_LEVEL = [0.5, 0.0, 1.0, 0.25, 0.75];
// the player's own car when the tests (or the menu) drive it
export const AUTOPILOT = { grip: 0.79, power: 0.97 };
// throttle of a car that is being passed, once the other has its nose past the door
const YIELD = 0.85;
const PASS_GAP = 2.9;     // lateral distance (centre to centre) a move aims for
const CLEAR_GAP = 2.3;    // from here on the car ahead is not in the way any more (the cars are 1.9 m wide)
const SIDE_GAP = 2.45;    // distance kept to a car alongside
const LANE_RATE = 1.5;    // 1/s: how quickly a lane change happens on a straight

export class Driver {
  /**
   * @param car Vehicle
   * @param track Track
   * @param line result of buildRacingLine
   * @param profile result of buildSpeedProfile for this car spec and this driver's grip
   * @param opts {grip, aggression: 0..1, seed}
   */
  constructor(car, track, line, profile, opts = {}) {
    this.car = car; this.track = track; this.line = line;
    this.skill = opts.skill ?? 1; this.aggression = opts.aggression ?? 0.6;
    this.seed = (opts.seed ?? 1) >>> 0;
    this.reset();
    this.enabled = true;
    this.debug = {};
    this.setProfile(profile, opts.grip ?? 1, opts.power ?? 1);
  }

  /**
   * A clean slate: everything the driver remembers from one step to the next, including its random sequence.
   * Called when the car is put on the grid or placed by hand, so that a race does not depend on what the driver
   * was doing before (the lap of the menu, the race before).
   */
  reset() {
    this.rand = mulberry32(this.seed);
    this.lane = 0;            // extra lateral offset on top of the racing line (overtaking / avoiding)
    this.laneTarget = 0;
    this.passing = null;      // id of the car being overtaken
    this.passSide = 0; this.passTimer = 0; this.diving = false; this.heldT = 0;
    this.mistake = 0; this.wander = 0; this.wanderT = 0; this.wanderTarget = 0;
    this.stuckT = 0; this.reverseT = 0;
    const inp = this.car.input; inp.steer = 0; inp.throttle = 0; inp.brake = 0; inp.handbrake = 0;
  }

  /**
   * @param profile speed profile of this car (buildSpeedProfile) for the grip this driver uses
   * Also derives how much of the tyre the racing line asks for along the lap at the profile speed (1 = a corner
   * at this driver's limit): overtaking is started where grip is left over, a car off the line slows down where it is not.
   */
  setProfile(profile, grip = 1, power = 1) {
    this.profile = profile; this.grip = grip; balance();
    // a cautious driver is also a little lighter on the throttle: this is what lets a quicker rival go by on a straight
    this.power = clamp(power, 0.5, 1);
    const car = this.car, line = this.line; const n = this.track.spline.n; const mu = car.spec.mu * 0.94 * grip, kdf = 0.5 * 1.2 * car.spec.clA / car.spec.mass;
    const use = this.use && this.use.length === n ? this.use : new Float32Array(n);
    for (let i = 0; i < n; i++) { const vv = profile.v[i]; use[i] = Math.min(1.2, vv * vv * Math.abs(line.kappa[i]) / (mu * (9.81 + kdf * vv * vv))); }
    this.use = use;
    this.aDec = mu * 9.81 * 0.85;     // what is left for braking when the car also has to turn a little
  }

  /** peak grip usage of the line between s + from and s + from + dist */
  useAhead(s, from, dist) {
    const sp = this.track.spline, n = sp.n; let m = 0; const i0 = Math.floor(sp.wrapS(s + from) / sp.ds);
    for (let k = 0; k <= dist; k += 3) { const u = this.use[(i0 + Math.round(k / sp.ds)) % n]; if (u > m) m = u; }
    return m;
  }

  /** signed curvature of the next real corner within dist (0 if none): > 0 turns right */
  cornerAhead(s, dist) {
    const sp = this.track.spline, n = sp.n; const i0 = Math.floor(sp.wrapS(s + 8) / sp.ds);
    for (let k = 0; k <= dist; k += 4) { const i = (i0 + Math.round(k / sp.ds)) % n; if (this.use[i] > 0.55) return this.line.kappa[i]; }
    return 0;
  }

  /** target speed (m/s) at lap distance s: the braking envelope of this driver's profile (flat out below it) */
  speedAt(s) {
    const sp = this.track.spline; const v = sp.sampleArr(this.profile.env || this.profile.v, s);
    return Math.min(this.profile.vTop, v * this.skill);
  }

  update(dt, cars) {
    const car = this.car, track = this.track, sp = track.spline, line = this.line;
    const inp = car.input;
    if (!this.enabled) return;
    const v = car.speed; const s = car.s;
    const half = sp.sampleArr(sp.half, s);
    const myD = car.d;

    // ---------------------------------------------------------------- what the lap asks for just ahead
    const busy = this.useAhead(s, 4, 14 + v * 1.0);
    const sLook = s + 2 + v * 0.06;
    const vLine = this.speedAt(sLook);
    // planned deceleration of the envelope: the brake follows it (feed-forward) and the speed error only trims it,
    // so the car reaches the corner at the planned speed instead of a little above it
    const span = clamp(v * 0.4, 6, 24);
    const vAhead = this.speedAt(sLook + span);
    const aPlan = (vAhead * vAhead - vLine * vLine) / (2 * span);
    const ff = aPlan < -0.8 ? clamp(-aPlan * car.spec.mass / car.spec.brakeForce * 0.92, 0, 1) : 0;
    const braking = ff > 0.2 && v > vLine - 4;

    // ---------------------------------------------------------------- traffic
    let limitV = Infinity; let wantLane = 0; let sideHold = 0; let blocker = null, blockerGap = Infinity; let leadBrake = 0; let yielding = false;
    let holdMin = -Infinity, holdMax = Infinity;
    for (const o of cars) {
      if (o === car) continue;
      const ds = sp.deltaS(o.s, s);            // + = other is ahead
      if (ds < -9 || ds > 70) continue;
      const dd = o.d - myD;                    // + = other is to my right
      const closing = v - o.speed;
      const lenGap = ds - 4.7;                 // bumper to bumper (roughly)
      // --- a car alongside: keep a side gap, do not turn into it
      if (ds > -5.2 && ds < 5.2 && Math.abs(dd) < 3.3) {
        sideHold += (dd > 0 ? -1 : 1) * (3.3 - Math.abs(dd)) * 0.9;
        // the space it is in is taken, whatever the racing line would like to do there
        if (dd > 0) holdMax = Math.min(holdMax, o.d - SIDE_GAP); else holdMin = Math.max(holdMin, o.d + SIDE_GAP);
        // a car that has its nose past this one's door and is still gaining has made its move: do not drag-race it
        if (ds > -2.4 && o.speed > v + 0.2 && Math.abs(dd) > 2.0) yielding = true;
        // into a corner the car on the inside has the corner as soon as it is level, the one on the outside only
        // when it is clearly ahead: drop back and slot in behind it
        if (busy > 0.6 || braking) {
          const kC = this.cornerAhead(s, 30 + v * 2); const onInside = kC !== 0 && dd * kC > 0;
          if (ds > (onInside ? -0.5 : 2.5)) limitV = Math.min(limitV, o.speed - 1.5);
        }
        // really side by side: only the gap matters. A car whose tail is ahead of this nose and that overlaps in
        // width is in the way, however close: it is handled as the car ahead (lift, do not push)
        // (the same for one a little to the side that is much slower: it is about to be in the way)
        if (!((ds > 0.8 && Math.abs(dd) < 2.0) || (ds > 0.5 && closing > 2.0 && Math.abs(dd) < 2.7))) continue;
      }
      if (ds <= 0) continue;
      // --- a slower car ahead in my path: beside it now, or where the line this car is on goes through its place
      const there = Math.abs(o.d - (sp.sampleArr(line.off, o.s) + this.lane));
      const lateralClear = Math.min(Math.abs(dd), there) - 2.25;
      const horizon = 7 + v * 0.9 + Math.max(0, closing) * 2.2;
      if (lenGap < horizon && lateralClear < 0.6) {
        if (lenGap < blockerGap) { blockerGap = lenGap; blocker = o; }
      }
    }
    if (blocker) {
      const o = blocker; const dd = o.d - myD; const closing = v - o.speed;
      const roomR = (half - 1.25) - (o.d + 2.5), roomL = (half - 1.25) + (o.d - 2.5);
      // side: the one of the move under way; otherwise the inside of the next corner, however far it is (the racing
      // line of the car ahead moves away from that side on the way there and the move ends on the inside line under
      // braking); when there is no room there yet, the wider side
      let side = 0;
      const kNear = this.cornerAhead(s, 40 + v * 3); const insideNear = kNear > 0.004 ? 1 : kNear < -0.004 ? -1 : 0;
      const kNext = kNear || this.cornerAhead(s, 520); const inside = kNext > 0.004 ? 1 : kNext < -0.004 ? -1 : 0;
      const ttc0 = closing > 0.15 ? blockerGap / closing : Infinity;
      const mySide = dd < 0 ? 1 : -1;        // the side of it this car is on
      if (this.passing !== null && this.passSide) side = this.passSide;
      else if (Math.abs(dd) > 1.6 && (mySide > 0 ? roomR : roomL) > 0.2 && ttc0 < 4) side = mySide;
      else if (inside !== 0 && (inside > 0 ? roomR : roomL) > 0.3) side = inside;
      else if (roomR > 0.2 || roomL > 0.2) side = (roomR + (dd < 0 ? 0.8 : 0)) > (roomL + (dd > 0 ? 0.8 : 0)) ? 1 : -1;
      const room = side > 0 ? roomR : side < 0 ? roomL : 0;
      const under = this.passing === o.id;
      const ttc = closing > 0.15 ? blockerGap / closing : Infinity;
      const straight = busy < 0.5 && !braking;
      // three ways into a move:
      //  - catching the car ahead on a stretch that leaves grip to spare (the tow is kept until then)
      //  - out-braking it on the inside of the corner that is coming
      //  - held up by it (through the corner before, in its tow now): out of its wake as soon as the road straightens,
      //    when the straight is long enough to get it done or the move ends on the inside of the next corner
      const open = straight && blockerGap < 16 && ttc < 1.5 + this.aggression * 0.9;
      const dive = side === insideNear && insideNear !== 0 && closing > 1.0 && blockerGap < 9 && busy < 1.05;
      const runway = side === inside || this.useAhead(s, 4, 30 + v * 3.5) < 0.6;
      const squeeze = straight && runway && ((this.heldT > 0.5 && blockerGap < 9) || (closing > 0.3 && blockerGap < 10 && inp.throttle > 0.5));
      // a move under way goes on while the stretch allows it, or once the cars overlap; an inside move goes on while it gains
      const go = side !== 0 && room > 0.1 && (under ? (busy < 0.9 || blockerGap < 2.0 || (this.diving && closing > -0.8)) : (open || dive || squeeze));
      if (go && !under) this.diving = !open;
      if (go) {
        this.passing = o.id; this.passSide = side; this.passTimer = 2.2;
        wantLane = o.d + side * PASS_GAP - sp.sampleArr(line.off, s + 12);
      } else if (under) { this.passing = null; this.passSide = 0; this.passTimer = 0; this.diving = false; this.heldT = 0; }
      // never drive into the back of the car ahead: match its speed as the gap closes
      const safe = 2.2 + (1 - this.aggression) * 2.0;
      // in the way: until this car is out on the side it passes on (it may have to cross behind the other first);
      // without a move, when it is beside it now or sits where this car's line takes it
      const out = (myD - o.d) * side;
      const there = Math.abs(o.d - (sp.sampleArr(line.off, o.s) + this.lane));
      if (go ? out < CLEAR_GAP : (Math.abs(dd) < CLEAR_GAP || there < CLEAR_GAP)) {
        // the closing speed the brakes can still take off inside the gap that is left. Against a car that is slowing
        // down or about to (its brake lights, a braking zone, a corner) that is its speed now at the place where it
        // is now; on an open stretch only the difference in speed has to go
        const gapB = Math.max(0, blockerGap - 1.2);
        const slowing = braking || busy > 0.6 || o.ax < -2.5;
        const cap = slowing ? Math.sqrt(o.speed * o.speed + 2 * (busy > 0.6 ? 6.0 : 9.0) * gapB) : o.speed + Math.sqrt(2 * 5.0 * gapB);
        let allow = Math.min(o.speed + (blockerGap - safe) * 0.9, cap);
        if (go) {
          // pulling out of its path: the gap only has to last until the car is clear sideways
          const rem = Math.max(PASS_GAP - CLEAR_GAP + 0.01, PASS_GAP - out);
          const tClear = Math.log(rem / (PASS_GAP - CLEAR_GAP)) / (braking || busy > 0.7 ? 0.85 : LANE_RATE) + 0.3;
          allow = Math.max(allow, o.speed + Math.max(0, blockerGap - 1.5) / tClear);
        } else if (o.ax < -2.5) {
          // brake lights right ahead: slow down with it instead of waiting for the gap to close
          leadBrake = clamp((-o.ax - 1.0) * car.spec.mass / car.spec.brakeForce, 0, 1) * (1 - smoothstep(7, 16, blockerGap)) * smoothstep(-2.5, 0, v - allow);
        }
        limitV = Math.min(limitV, Math.max(allow, o.speed * 0.6));
      }
      // held up: the car ahead, not the lap, is what sets the speed
      if (limitV < vLine - 0.8 && v > limitV - 1.2 && blockerGap < 9) this.heldT += dt; else this.heldT = Math.max(0, this.heldT - dt * 2);
    } else this.heldT = Math.max(0, this.heldT - dt * 2);
    if (this.passTimer > 0) {
      this.passTimer -= dt;
      if (!blocker && this.passTimer > 0 && this.passing !== null) {
        // keep the lane until clear of the car being passed
        const o = cars.find((q) => q.id === this.passing);
        if (o) { const ds = sp.deltaS(o.s, s); if (ds > -7 && ds < 9) { wantLane = o.d + this.passSide * PASS_GAP - sp.sampleArr(line.off, s + 12); this.passTimer = Math.max(this.passTimer, 0.4); } else this.passTimer = 0; }
      }
      if (this.passTimer <= 0) { this.passing = null; this.passSide = 0; this.diving = false; }
    }
    wantLane += clamp(sideHold, -2.2, 2.2);
    // small, slow wander so the cars do not all trace the same pixel line
    this.wanderT -= dt;
    if (this.wanderT <= 0) { this.wanderT = 2 + this.rand() * 3; this.wanderTarget = (this.rand() - 0.5) * 0.7; }
    this.wander = damp(this.wander, this.wanderTarget || 0, 0.8, dt);
    this.laneTarget = wantLane + this.wander;
    // a lane change is a lateral move in time, whatever the speed: about 3 m/s² for a full car width, gentler
    // under braking and where the line is already near the limit
    this.lane = damp(this.lane, this.laneTarget, braking || busy > 0.7 ? 0.85 : LANE_RATE, dt);

    // ---------------------------------------------------------------- steering (pure pursuit)
    const look = clamp(5.5 + v * 0.26, 7, 30);
    const sT = s + look;
    let offT = sp.sampleArr(line.off, sT) + this.lane;
    const lim0 = sp.sampleArr(line.limits[0], sT) + 0.5, lim1 = sp.sampleArr(line.limits[1], sT) + 0.5;
    offT = clamp(offT, -lim0, lim1);
    // room for a car alongside (as far as the road allows)
    if (holdMax < Infinity) offT = Math.min(offT, Math.max(holdMax, -lim0));
    if (holdMin > -Infinity) offT = Math.max(offT, Math.min(holdMin, lim1));
    const tgt = sp.pointAt(sT, offT, this._p || (this._p = {}));
    const dx = tgt.x - car.x, dz = tgt.z - car.z;
    const c = Math.cos(car.heading), sn = Math.sin(car.heading);
    const lx = dx * c + dz * sn, lz = -dx * sn + dz * c;
    const l2 = lx * lx + lz * lz;
    const kap = l2 > 1 ? 2 * lz / l2 : 0;
    const aLat = kap * v * v;
    const aMax = car.spec.mu * 9.81 + 0.5 * 1.2 * car.spec.clA / car.spec.mass * v * v * car.spec.mu;
    let delta = Math.atan(car.spec.wheelbase * kap) + Math.sign(kap) * car.spec.peakSlip * 0.92 * Math.min(1, Math.abs(aLat) / aMax);
    // damp the yaw when the tail steps out
    delta += clamp(car.beta * 0.6, -0.12, 0.12);
    inp.steer = clamp(delta / Math.max(car.maxSteer || 0.3, 0.02), -1, 1);

    // ---------------------------------------------------------------- speed
    let vT = Math.min(vLine, limitV);
    // the profile holds on the racing line: a car that is off it (overtaking, alongside, recovering) has to
    // bend its path more than the line does, so it gives speed away where the line is already near the limit
    const offLine = Math.abs(myD - sp.sampleArr(line.off, s));
    const busyNow = this.useAhead(s, 0, 10 + v * 1.1);
    // a car holding a lane through a corner turns on the radius of that lane, not on the wide arc of the line:
    // slower on the inside (and it gains ground there), and the braking for that speed has to start in time
    let ffLane = 0;
    if (offLine > 0.5) {
      const w = smoothstep(0.5, 2.2, offLine); const n = sp.n, i0 = Math.floor(sp.wrapS(s + 2) / sp.ds), span = Math.ceil((v * 2.8 + 12) / sp.ds);
      const pv = this.profile.v, aDec = this.aDec; let lim = Infinity, far = false;
      for (let k = 0; k <= span; k += 2) {
        const i = (i0 + k) % n; const kT = sp.kappa[i], kL = Math.abs(line.kappa[i]);
        if (kL > 0.004 && Math.abs(kT) > 0.004) {
          const rMine = Math.max(6, 1 / Math.abs(kT) - myD * Math.sign(kT));
          const q = 1 - (1 - Math.sqrt(clamp(rMine * kL, 0.56, 1))) * w;
          if (q < 0.995) { const vk = pv[i] * q * this.skill; const cand = Math.sqrt(vk * vk + 2 * aDec * k * sp.ds); if (cand < lim) { lim = cand; far = k * sp.ds > 6; } }
        }
      }
      if (lim < vT) { vT = lim; if (far) ffLane = clamp(aDec * car.spec.mass / car.spec.brakeForce * 0.92, 0, 1) * smoothstep(-3, -0.5, v - lim); }
    }
    vT *= 1 - 0.014 * Math.min(offLine, 4.5) * smoothstep(0.4, 0.88, busyNow);
    // lift when the car is asked for more grip than it has
    const over = Math.abs(car.beta);
    if (over > 0.16) vT *= 1 - smoothstep(0.16, 0.5, over) * 0.35;
    // off the asphalt: come back gently instead of spinning the wheels on sand or grass
    if (!car.onRoad && Math.abs(myD) > half + 0.4) vT = Math.min(vT, 15);
    const err = vT - v;
    // the feed-forward belongs to the envelope: it only acts when the car is up at it, not when traffic holds
    // the car well below (then the envelope's braking curve is still far above the car)
    const ffNow = Math.max(ff * smoothstep(-4, -1, v - vLine), leadBrake, ffLane);
    const brake = ffNow + (-err - 0.2) * 0.32;
    if (brake > 0.03) {
      // a hard turn of the wheel and full brakes do not go together: the tail would come round
      inp.throttle = 0; inp.brake = clamp(brake, 0, 1) * (1 - 0.45 * smoothstep(0.4, 0.95, Math.abs(inp.steer)));
    } else if (err >= 0) {
      inp.brake = 0;
      // feed the power in as the steering unwinds
      const steerUse = Math.abs(inp.steer);
      // balance of performance: the throttle that gives this car the reference acceleration at this speed
      const vi = Math.min(VMAX, v | 0), id = car.spec.id;
      const bop = clamp((this.power * REF[vi] + DRAG[id] * v * v) / Math.max(0.5, FORCE[id][vi]), 0.25, 1);
      const maxThr = bop * (yielding ? YIELD : 1) * (1 - 0.45 * smoothstep(0.55, 1.0, steerUse) * smoothstep(0.5, 0.95, Math.abs(aLat) / aMax));
      // close under the envelope in a braking zone: a trailing throttle, the brake is about to come.
      // Behind another car the throttle follows the gap firmly, so the car sits in its tow instead of hanging back
      inp.throttle = clamp(0.12 + err * (limitV < vLine ? 1.5 : 0.55), 0, ffNow > 0.05 && err < 1.2 ? 0.3 : maxThr);
    } else {
      inp.throttle = err > -0.6 ? 0.1 : 0; inp.brake = 0;
    }
    inp.handbrake = 0;

    // ---------------------------------------------------------------- unstick: reverse out of a wall
    if (!car.frozen) {
      if (v < 1.2 && inp.throttle > 0.3) this.stuckT += dt; else this.stuckT = Math.max(0, this.stuckT - dt * 2);
      if (this.stuckT > 1.4 && this.reverseT <= 0) { this.reverseT = 1.3; this.stuckT = 0; }
      if (this.reverseT > 0) {
        this.reverseT -= dt;
        inp.throttle = 0; inp.brake = 1; inp.steer = -inp.steer;
        if (this.reverseT <= 0) { car.reverse = false; }
      }
    }
    this.debug.vT = vT; this.debug.look = look; this.debug.blocker = blocker ? blocker.id : -1; this.debug.ff = ff; this.debug.busy = busyNow; this.debug.limitV = limitV; this.debug.vLine = vLine; this.debug.gap = blockerGap; this.debug.held = this.heldT; this.debug.yielding = yielding;
  }
}
