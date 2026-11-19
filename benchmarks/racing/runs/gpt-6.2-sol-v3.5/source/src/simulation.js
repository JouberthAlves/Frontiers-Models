import { angle, clamp, mix, SHOULDER, smooth, wrap } from './course.js';

export const FIXED_STEP = 1 / 120;
export const VEHICLE = { wheelbase: 2.66, axle: 1.33, track: .81, tire: .353, clearance: .156 };
export const NEUTRAL = Object.freeze({ steer: 0, throttle: 0, brake: 0, boost: false });
const GEAR_ENDS = [14.8, 23, 31, 41, 51, 64];
const GRID_LANES = [-2.16, 2.16, -2.16, 2.16, -2.16, 2.16];

export function steerLimit(speed) {
  return mix(.54, .105, smooth(13, 53, Math.abs(speed)));
}

function projectCar(car) {
  car.x = car.rearX + Math.cos(car.heading) * VEHICLE.axle;
  car.z = car.rearZ + Math.sin(car.heading) * VEHICLE.axle;
}

function subtractAtPose(car, dx, dz) {
  car.rearX -= dx;
  car.rearZ -= dz;
  car.x -= dx;
  car.z -= dz;
}

export function sampleWheelPose(course, car, nearest, dt) {
  const fx = Math.cos(car.heading), fz = Math.sin(car.heading);
  const nx = -fz, nz = fx;
  const wheel = [];
  for (const fore of [-1, 1]) {
    for (const side of [1, -1]) {
      const x = car.x + fx * fore * VEHICLE.axle + nx * side * VEHICLE.track;
      const z = car.z + fz * fore * VEHICLE.axle + nz * side * VEHICLE.track;
      const result = course.surface(x, z);
      if (!result) return false;
      wheel.push(result.y);
    }
  }
  const plate = (wheel[0] + wheel[1] + wheel[2] + wheel[3]) / 4;
  const pitch = -Math.atan2(wheel[2] + wheel[3] - wheel[0] - wheel[1], 2 * VEHICLE.wheelbase);
  const roll = Math.atan2(wheel[1] + wheel[3] - wheel[0] - wheel[2], 4 * VEHICLE.track);
  const center = course.surface(car.x, car.z, nearest);
  if (!center || center.y < -.40) return false;
  car.surface = center.surface;
  car.y = Math.max(plate, center.y - .035);
  const pitchTransfer = clamp(car.accel * .0042, -.047, .040);
  const rollTransfer = clamp(car.speed * car.yawRate * .0033, -.057, .057);
  const k = 1 - Math.exp(-dt * 12);
  car.pitchTransfer = mix(car.pitchTransfer, -pitchTransfer, k);
  car.rollTransfer = mix(car.rollTransfer, rollTransfer, k);
  car.pitch = pitch + car.pitchTransfer;
  car.roll = roll + car.rollTransfer;
  car.wheels = wheel.map((height, i) => height - car.y
    + (i < 2 ? -1 : 1) * Math.sin(car.pitch) * VEHICLE.axle
    + (i % 2 === 0 ? 1 : -1) * Math.sin(car.roll) * VEHICLE.track);
  car.lowestChassis = car.y + VEHICLE.clearance - center.y;
  for(const [fore,side] of [[-1.78,-.63],[-1.78,.63],[1.79,-.63],[1.79,.63]]) {
    const floor=course.surface(car.x+fx*fore+nx*side,car.z+fz*fore+nz*side);
    if(floor) {
      const chassisY=car.y+VEHICLE.clearance-Math.sin(car.pitch)*fore-Math.sin(car.roll)*side;
      car.lowestChassis=Math.min(car.lowestChassis,chassisY-floor.y);
    }
  }
  return true;
}

function gripAcceleration(car, control) {
  const grip = car.surface === 'asphalt' ? 17.2 : car.surface === 'curb' ? 13.8 : 8.1;
  return grip * (1 - .21 * control.brake) * (1 - .10 * control.throttle * smooth(.21, .52, Math.abs(car.steer)));
}

function drive(car, control, dt, time, events) {
  car.braking = control.brake > .15 && car.speed > .2;
  car.load = mix(car.load, control.throttle * (1 - control.brake), Math.min(1, dt * 9));
  const speed = Math.abs(car.speed);
  const rally = car.model === 1;
  const cap = (rally ? 60 : 62) + (car.boosting ? 4.75 : 0);
  const revCap = GEAR_ENDS[car.gear - 1] + (car.gear === 6 && car.boosting ? 4.75 : 0);
  const rpmTarget = car.speed < 0 ? 1500 + speed * 580 : 1200 + speed / revCap * 6800;
  car.rpm = mix(car.rpm, clamp(Math.max(rpmTarget, 1100 + control.throttle * 1200), 1000, 8080), Math.min(1, dt * 18));
  const canBoost = control.boost && control.throttle > .3 && car.speed > 3 && car.nitro > .002;
  if (canBoost && !car.boosting) events('nitro', car, time);
  car.boosting = canBoost;
  const drag = .31 + speed * speed * .00107 + (car.surface === 'asphalt' ? 0 : 1.15);
  const power = (rally ? 7.8 : 8.05) * (1 - .52 * clamp(speed / cap, 0, 1));
  let acceleration = control.throttle * power * (canBoost ? 1.22 : 1) * (time < car.shiftUntil ? .16 : 1);
  if (car.speed > .02) acceleration -= drag + control.brake * 13.8;
  if (car.speed < -.02) acceleration += drag + control.throttle * 6.5;
  if (control.brake > .1 && car.speed < .05 && control.throttle < .1) acceleration = -control.brake * Math.max(0, 4.2 + car.speed * .35);
  car.accel = acceleration;
  const nextSpeed = car.speed + acceleration * dt;
  car.speed = control.throttle < .02 && control.brake < .02 && car.speed * nextSpeed < 0
    ? 0
    : clamp(nextSpeed, -11, cap + .7);
  if (speed > cap) car.speed -= (speed - cap) * dt * 1.9;

  let newGear = car.gear;
  if (car.speed > GEAR_ENDS[car.gear - 1] * .975 && car.gear < 6) newGear += 1;
  if (car.gear > 1 && car.speed < GEAR_ENDS[car.gear - 2] * .75) newGear -= 1;
  if (newGear !== car.gear && time > car.shiftUntil) {
    car.gear = newGear;
    car.shiftUntil = time + .115;
    events('shift', car, time);
  }

  const targetSteer = control.steer * steerLimit(speed);
  car.steer = mix(car.steer, targetSteer, Math.min(1, dt * (speed > 20 ? 7.1 : 10.7)));
  const requested = Math.tan(car.steer) / VEHICLE.wheelbase;
  const grip = gripAcceleration(car, control);
  const limited = clamp(requested, -grip / Math.max(1, speed ** 2), grip / Math.max(1, speed ** 2));
  const wantedSlip = Math.sign(requested) * smooth(grip * .87, grip * 2, Math.abs(requested * speed ** 2))
    * (control.brake > .3 ? .19 : .10);
  car.slip = mix(car.slip, wantedSlip, Math.min(1, dt * (wantedSlip ? 4.0 : 6.7)));
  if (Math.abs(car.slip) > .07 && time - car.lastSlip > 1.7) {
    events('slip', car, time);
    car.lastSlip = time;
  }
  const yawRate = car.speed * limited;
  car.yawRate = yawRate;
  // The reference point is the rear axle. The steered front axle sets curvature.
  const travelAngle = car.heading + yawRate * dt / 2 - car.slip;
  car.rearX += Math.cos(travelAngle) * car.speed * dt;
  car.rearZ += Math.sin(travelAngle) * car.speed * dt;
  car.heading = angle(car.heading + yawRate * dt);
  car.spin = wrap(car.spin + car.speed * dt / VEHICLE.tire, 2 * Math.PI);
  projectCar(car);

  const clean = car.surface === 'asphalt' && time - car.lastImpact > 1.8;
  const recharge = clean && speed > 16 ? .013 + .025 * smooth(.05, .14, Math.abs(car.slip)) : 0;
  car.nitro = clamp(car.nitro + (canBoost ? -.165 : recharge) * dt, 0, 1);
}

export class Race {
  constructor(course, { laps = 3, difficulty = 'normal', model = 0, livery = 0, opponents = 5 } = {}) {
    this.course = course;
    this.laps = laps;
    this.difficulty = difficulty;
    this.time = 0;
    this.finished = false;
    this.events = [];
    this.resets = [];
    this.overtakes = 0;
    this.minChassisClearance = Infinity;
    this.cars = Array.from({ length: opponents + 1 }, (_, id) => {
      const lane = GRID_LANES[id];
      const progress = -5.8 * (Math.floor(id / 2) + 1) - (id % 2 ? 1.0 : 0);
      const pos = course.at(course.start + progress, lane);
      const car = {
        id, model: id === 0 ? model : id % 2, livery: id === 0 ? livery : (livery + id) % 6,
        x: pos.x, z: pos.z, y: pos.y, heading: pos.heading, pitch: 0, roll: 0, wheels: [0, 0, 0, 0],
        rearX: pos.x - Math.cos(pos.heading) * VEHICLE.axle, rearZ: pos.z - Math.sin(pos.heading) * VEHICLE.axle,
        steer: 0, speed: 0, accel: 0, spin: 0, lap: 0, rpm: 1120, gear: 1, shiftUntil: 0, load: 0,
        pitchTransfer: 0, rollTransfer: 0, yawRate: 0, nitro: 1, boosting: false, braking: false,
        slip: 0, lastImpact: -10, lastSlip: -10, surface: 'asphalt', s: pos.s, progress,
        lane, laneTarget: lane, lateral: lane, nextDecision: id * .14, nextCheckpoint: 0, baseLap: 0,
        validLap: true, lapStarted: false, lapTime: 0, bestLap: Infinity, lastLap: null, offTime: 0,
        lastValid: pos.s, zone: course.zone(pos.s), bridge: false, finish: null, longestOff: 0,
      };
      if (!sampleWheelPose(course, car, course.nearest(car.x, car.z), 1)) throw new Error('Grid ray missed course');
      return car;
    });
    this.player = this.cars[0];
    this.order = this.cars.map(c => c.id);
    this.lastPass = new Map();
    this.record = (type, car, time, details) => {
      if (this.events.length < 6000) this.events.push({ type, car: car.id, time, ...details });
    };
    this.paces = this.cars.map(car => this.makePace(car));
  }

  makePace(car) {
    const behavior = this.difficulty === 'easy' ? .87 : this.difficulty === 'hard' ? 1.055 : 1;
    const vmax = car.id === 0 ? 24.85 : (23.2 + .51 * (car.id % 3) + .29 * car.id) * behavior;
    const lateral = car.id === 0 ? 14.6 : 14.0 * behavior;
    const pace = Float32Array.from(this.course.points, point =>
      Math.min(vmax, Math.sqrt(lateral / Math.max(.0001, Math.abs(point.curvature)))));
    for (let i = pace.length * 2 - 1; i >= 0; i--) {
      const n = i % pace.length;
      pace[n] = Math.min(pace[n], Math.sqrt(pace[(n + 1) % pace.length] ** 2 + 2 * 4.5 * this.course.ds));
    }
    return pace;
  }

  driver(car) {
    const course = this.course;
    const look = clamp(5.1 + car.speed * .39, 7.3, 18);
    if (this.time >= car.nextDecision) {
      const assertive = this.difficulty === 'hard' ? 30 : this.difficulty === 'easy' ? 17 : 25;
      const blocked = this.cars.some(other => {
        const gap = other.progress - car.progress;
        return other !== car && gap > .4 && gap < assertive
          && Math.abs(other.lateral - car.laneTarget) < 2.06
          && other.speed < this.paces[car.id][course.at(car.s + 8).index] - .15;
      });
      const alternate = [-2.65, 2.65, 0].find(lane => Math.abs(lane - car.laneTarget) > 2.35
        && this.cars.every(other => {
          const gap = other.progress - car.progress;
          return other === car || gap < -9 || gap > 18
            || (Math.abs(other.lateral - lane) > 2.18 && Math.abs(other.laneTarget - lane) > 2.18);
        }));
      if (blocked && alternate !== undefined && Math.abs(car.lateral - car.laneTarget) < 1.2) {
        car.laneTarget = alternate;
        car.nextDecision = this.time + 4.1;
      } else {
        car.nextDecision = this.time + .55 + (car.id % 3) * .21;
      }
    }
    const apex = clamp(course.at(car.s + 7).curvature * 22, -.38, .38);
    car.lane = mix(car.lane, car.laneTarget + apex, Math.min(1, FIXED_STEP * .67));
    const target = course.at(car.s + look, car.lane);
    const aim = angle(Math.atan2(target.z - car.rearZ, target.x - car.rearX) - car.heading);
    const distance = Math.hypot(target.x - car.rearX, target.z - car.rearZ);
    let want = this.paces[car.id][course.at(car.s + 4).index];
    for (const other of this.cars) {
      if (other === car || other.finish) continue;
      const gap = other.progress - car.progress;
      if (gap > 0 && gap < 14 && Math.abs(other.lateral - car.lateral) < 1.93) {
        want = Math.min(want, Math.max(2.8, other.speed + (gap - 5.4) * 1.35));
      }
    }
    const change = want - car.speed;
    return {
      steer: clamp(Math.atan2(2 * VEHICLE.wheelbase * Math.sin(aim), distance) / steerLimit(car.speed), -1, 1),
      throttle: change > -.35 ? clamp(.27 + change * .41, 0, 1) : 0,
      brake: clamp((-change - .65) * .23, 0, .88),
      boost: car.id === 0 && this.time > 8 && car.nitro > .20 && Math.abs(aim) < .075 && change > .7,
    };
  }

  collideCars() {
    for (let i = 0; i < this.cars.length - 1; i++) {
      for (let j = i + 1; j < this.cars.length; j++) {
        const a = this.cars[i], b = this.cars[j];
        if (Math.abs(a.y - b.y) > 2.1 || Math.hypot(a.x - b.x, a.z - b.z) > 4.9) continue;
        const ax = Math.cos(a.heading), az = Math.sin(a.heading);
        const bx = Math.cos(b.heading), bz = Math.sin(b.heading);
        for (const ai of [-1.16, 0, 1.16]) {
          for (const bi of [-1.16, 0, 1.16]) {
            const dx = b.x + bx * bi - a.x - ax * ai;
            const dz = b.z + bz * bi - a.z - az * ai;
            const d = Math.hypot(dx, dz);
            if (d > 1.99 || d < .0001) continue;
            const nx = dx / d, nz = dz / d;
            const force = (1.99 - d) * .51;
            subtractAtPose(a, nx * force, nz * force);
            subtractAtPose(b, -nx * force, -nz * force);
            const an = ax * nx + az * nz;
            const bn = bx * nx + bz * nz;
            const impact = Math.max(0, a.speed * an - b.speed * bn);
            a.speed -= impact * an * .42;
            b.speed += impact * bn * .42;
            if (impact > 1.1) {
              this.impact(a, impact, 'car');
              this.impact(b, impact, 'car');
            }
          }
        }
      }
    }
  }

  impact(car, amount, kind) {
    if (this.time - car.lastImpact > .32) this.record('impact', car, this.time, { amount, kind });
    car.lastImpact = this.time;
  }

  reset(car, reason) {
    const p = this.course.at(car.lastValid, car.id ? car.lane : 0);
    this.resets.push({ reason, car: car.id, time: this.time });
    car.rearX = p.x - Math.cos(p.heading) * VEHICLE.axle;
    car.rearZ = p.z - Math.sin(p.heading) * VEHICLE.axle;
    car.speed = 0;
    car.heading = p.heading;
    car.slip = 0;
    car.offTime = 0;
    car.s = p.s;
    car.validLap = false;
    projectCar(car);
    sampleWheelPose(this.course, car, this.course.nearest(car.x, car.z), 1);
  }

  resolveCourse(car) {
    const course = this.course;
    let nearest = course.nearest(car.x, car.z, false);
    if (!nearest) return this.reset(car, 'out of world');
    let p = course.at(nearest.s);
    const side = Math.sign(nearest.lateral);
    const turn = angle(car.heading - p.heading);
    const reach = Math.abs(Math.sin(turn)) * 1.95 + Math.abs(Math.cos(turn)) * .97;
    const boundary = p.half + SHOULDER + .20 - reach;
    if (course.rail(nearest.s, side) && Math.abs(nearest.lateral) > boundary) {
      const penetrate = Math.abs(nearest.lateral) - boundary;
      if (penetrate > 2.8 && Math.abs(nearest.lateral) < p.half + 10) return this.reset(car, 'barrier tunneling');
      if (penetrate < 2.8) {
        subtractAtPose(car, p.nx * side * penetrate, p.nz * side * penetrate);
        const impact = Math.max(0, car.speed * Math.sin(turn) * side);
        car.speed *= 1 - clamp(impact * .032, .002, .58);
        car.heading = angle(car.heading - turn * .09);
        projectCar(car);
        if (impact > 1.1) this.impact(car, impact, 'rail');
        nearest = course.nearest(car.x, car.z);
        p = course.at(nearest.s);
      }
    }
    if (nearest.distance > p.half + 1.7) {
      for (const prop of course.obstacles) {
        const dx = car.x - prop.x, dz = car.z - prop.z;
        const threshold = prop.radius + 1.0;
        if (Math.abs(dx) > threshold || Math.abs(dz) > threshold) continue;
        const d = Math.hypot(dx, dz);
        if (d >= threshold || d < .001) continue;
        const f = (threshold - d) / d;
        subtractAtPose(car, -dx * f, -dz * f);
        if (Math.abs(car.speed) > 2) this.impact(car, Math.abs(car.speed), prop.kind);
        car.speed *= -.14;
      }
    }
    if (!sampleWheelPose(course, car, nearest, FIXED_STEP)) return this.reset(car, 'unraycastable or submerged surface');
    const abs = Math.abs(nearest.lateral);
    car.lateral = nearest.lateral;
    const onCourse = abs < p.half + .45;
    if (car.lowestChassis < 0) return this.reset(car, 'chassis below surface');
    this.minChassisClearance = Math.min(this.minChassisClearance, car.lowestChassis);
    if (!onCourse) {
      car.offTime += FIXED_STEP;
      car.longestOff = Math.max(car.longestOff, car.offTime);
      if (abs > p.half + 5 || car.offTime > .7) car.validLap = false;
      if (car.offTime > 3) return this.reset(car, 'stuck off-course');
    } else {
      car.offTime = 0;
      car.lastValid = nearest.s;
    }
    const delta = wrap(nearest.s - car.s + course.length / 2, course.length) - course.length / 2;
    car.s = nearest.s;
    if (Math.abs(delta) > 5) car.validLap = false;
    this.checkLap(car, car.progress + delta, onCourse);
    const bridge = course.isBridge(car.s);
    if (bridge && !car.bridge) this.record('bridge', car, this.time);
    car.bridge = bridge;
    car.zone = course.zone(car.s);
  }

  checkLap(car, next, onCourse) {
    const previous = car.progress;
    car.progress = next;
    if (car.finish || next <= previous) return;
    if (previous < 0 && next >= 0) {
      car.lapTime = this.time;
      car.lapStarted = true;
    }
    const checkpoints = this.course.checkpoints;
    const checkpoint = car.baseLap + checkpoints[car.nextCheckpoint];
    if (next < checkpoint) return;
    if (!onCourse || previous >= checkpoint || next >= checkpoint + 5) car.validLap = false;
    car.nextCheckpoint++;
    if (car.nextCheckpoint < checkpoints.length) return;
    car.baseLap += this.course.length;
    car.nextCheckpoint = 0;
    if (car.validLap && car.lapStarted) {
      car.lap++;
      car.lastLap = this.time - car.lapTime;
      car.bestLap = Math.min(car.bestLap, car.lastLap);
      this.record('lap', car, this.time, { lap: car.lap, seconds: car.lastLap });
      if (car.lap === this.laps) {
        car.finish = this.time;
        if (car.id === 0) this.finished = true;
      }
    }
    car.validLap = onCourse;
    car.lapStarted = true;
    car.lapTime = this.time;
  }

  step(control = NEUTRAL, auto = false) {
    if (this.finished) return;
    this.time += FIXED_STEP;
    for (const car of this.cars) {
      Object.assign(car.prior??={}, { x:car.x,y:car.y,z:car.z,heading:car.heading,pitch:car.pitch,roll:car.roll,
        wheels:car.wheels,steer:car.steer,spin:car.spin });
      const input = car.id ? this.driver(car) : typeof auto==='function' ? auto(this,this.driver(car)) : auto ? this.driver(car) : control;
      drive(car, input, FIXED_STEP, this.time, this.record);
    }
    this.collideCars();
    for (const car of this.cars) this.resolveCourse(car);
    const previous = this.order;
    this.order = [...this.cars].sort((a, b) => (b.lap - a.lap) || b.progress - a.progress).map(c => c.id);
    if (this.time > 4 && previous.some((id, index) => id !== this.order[index])) {
      this.order.forEach((id, index) => {
        const passed = this.order[index + 1];
        if (!id || !passed || previous.indexOf(id) < previous.indexOf(passed)) return;
        const key = `${id}:${passed}`;
        if (this.time - (this.lastPass.get(key) ?? 0) < 3) return;
        this.lastPass.set(key, this.time);
        this.overtakes++;
        this.record('overtake', this.cars[id], this.time, { passed });
      });
    }
  }
}

export function readControls(keys, gamepad) {
  const steer = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  const axis = gamepad?.axes[0] ?? 0;
  const stick = Math.abs(axis) > .12 ? Math.sign(axis) * (Math.abs(axis) - .12) / .88 : 0;
  const button = index => gamepad?.buttons[index];
  return {
    steer: clamp(steer + stick, -1, 1),
    throttle: Math.max(Number(keys.has('KeyW') || keys.has('ArrowUp')), button(7)?.value ?? 0),
    brake: Math.max(Number(keys.has('KeyS') || keys.has('ArrowDown')), button(6)?.value ?? 0),
    boost: keys.has('ShiftLeft') || keys.has('ShiftRight') || [0, 2, 5].some(i => button(i)?.pressed),
  };
}
