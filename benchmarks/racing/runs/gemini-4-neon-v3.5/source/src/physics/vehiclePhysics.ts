import * as THREE from 'three';
import { CarModelSpec, ControlInput, SurfaceType } from '../types';
import { PhysicsWorld, RaycastSurfaceHit } from '../world/physicsWorld';
import { clamp, lerp } from '../utils/rng';

export interface WheelRuntimeState {
  /** Local chassis mount point (x, y, z) where suspension attaches */
  mountX: number;
  mountY: number;
  mountZ: number;
  isFront: boolean;
  /** Current vertical wheel hub offset relative to rest height (negative = droop, positive = bump compression) */
  suspensionOffset: number;
  /** Local Y steering rotation in radians (+ left, - right) */
  steerYaw: number;
  /** Cumulative local X rolling spin angle in radians */
  spinPitch: number;
  /** Ground contact state */
  grounded: boolean;
  surface: SurfaceType;
  contactY: number;
  airGap: number;
  slipRatio: number;
}

export interface VehicleSafetyLogEntry {
  time: number;
  reason: 'under_terrain' | 'out_of_world' | 'flipped' | 'stuck';
  s: number;
}

export interface VehicleTelemetry {
  speedKmh: number;
  rpm: number;
  gear: number; // 1..6 (0 = reverse)
  nitro: number; // 0..1
  nitroActive: boolean;
  steerVisualNorm: number; // -1 (left) .. +1 (right)
  throttle: number;
  brake: number;
  lateralG: number;
  tireSlip: number; // 0..1
  surface: SurfaceType;
  isBraking: boolean;
  onBridge: boolean;
  justShifted: boolean;
  shiftDir: number; // +1 upshift, -1 downshift, 0 none
  impactStrength: number; // 0..1 impulse this step
  scrapeIntensity: number; // 0..1 continuous guardrail contact
  revLimiterHit: boolean;
}

export class VehiclePhysics {
  readonly id: string;
  readonly spec: CarModelSpec;
  readonly isPlayer: boolean;

  // 3D rigid-body kinematics (local -Z = forward, +X = right, +Y = up)
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  readonly quat = new THREE.Quaternion();
  readonly prevPos = new THREE.Vector3();
  readonly prevQuat = new THREE.Quaternion();

  /** Yaw heading in radians around +Y (0 = facing -Z; positive = turned left / CCW from above) */
  yaw = 0;
  /** Yaw angular rate in rad/s around +Y (positive = turning left / CCW from above; negative = turning right / CW) */
  yawRate = 0;
  /** Smoothed chassis pitch & roll for suspension weight transfer + road slope */
  roadPitch = 0;
  roadRoll = 0;
  bodyPitch = 0;
  bodyRoll = 0;
  verticalVel = 0;
  grounded = true;

  // Powertrain & Nitro
  gear = 1;
  rpm = 1050;
  shiftCutTimer = 0;
  nitro = 0.80;
  nitroActive = false;
  steerSmoothed = 0; // -1 (left) .. +1 (right)

  // Spline progress & Race state
  splineS = 0;
  splineLateral = 0;
  lap = 1;
  nextCheckpoint = 1;
  checkpointsPassed = 0;
  totalProgress = 0;
  lapStartTime = 0;
  currentLapTime = 0;
  bestLapTime = Infinity;
  finished = false;
  finishTime = 0;

  // Safety & runtime invariant counters
  stuckTimer = 0;
  offTrackTimer = 0;
  safetyResetCount = 0;
  underTerrainResets = 0;
  outOfWorldResets = 0;
  maxWheelAirGap = 0;
  safetyLog: VehicleSafetyLogEntry[] = [];

  // 4 chassis-parented wheel runtime states: [FL, FR, RL, RR]
  readonly wheels: [WheelRuntimeState, WheelRuntimeState, WheelRuntimeState, WheelRuntimeState];

  readonly telemetry: VehicleTelemetry = {
    speedKmh: 0,
    rpm: 1050,
    gear: 1,
    nitro: 0.8,
    nitroActive: false,
    steerVisualNorm: 0,
    throttle: 0,
    brake: 0,
    lateralG: 0,
    tireSlip: 0,
    surface: 'asphalt',
    isBraking: false,
    onBridge: false,
    justShifted: false,
    shiftDir: 0,
    impactStrength: 0,
    scrapeIntensity: 0,
    revLimiterHit: false,
  };

  private readonly tmpHit: RaycastSurfaceHit = {
    hit: true,
    y: 0,
    normal: new THREE.Vector3(0, 1, 0),
    surface: 'asphalt',
  };
  private readonly tmpFwd = new THREE.Vector3();
  private readonly tmpRight = new THREE.Vector3();
  private readonly tmpUp = new THREE.Vector3();
  private readonly tmpEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private readonly avgNormal = new THREE.Vector3(0, 1, 0);

  constructor(id: string, spec: CarModelSpec, isPlayer: boolean) {
    this.id = id;
    this.spec = spec;
    this.isPlayer = isPlayer;
    this.rpm = spec.idleRpm;

    const hx = spec.trackWidth * 0.5;
    const restHubY = spec.wheelRadius;
    this.wheels = [
      this.makeWheel(-hx, restHubY, spec.frontAxleZ, true),  // FL
      this.makeWheel(hx, restHubY, spec.frontAxleZ, true),   // FR
      this.makeWheel(-hx, restHubY, spec.rearAxleZ, false),  // RL
      this.makeWheel(hx, restHubY, spec.rearAxleZ, false),   // RR
    ];
  }

  private makeWheel(x: number, y: number, z: number, isFront: boolean): WheelRuntimeState {
    return {
      mountX: x,
      mountY: y,
      mountZ: z,
      isFront,
      suspensionOffset: 0,
      steerYaw: 0,
      spinPitch: 0,
      grounded: true,
      surface: 'asphalt',
      contactY: 0,
      airGap: 0,
      slipRatio: 0,
    };
  }

  /**
   * Places the vehicle onto the road/terrain via exact surface raycast (NEVER hardcoded Y!).
   */
  spawnAtSpline(world: PhysicsWorld, s: number, lateral: number): void {
    const smp = world.track.sampleAtS(s);
    const px = smp.pos.x + smp.flatRight.x * lateral;
    const pz = smp.pos.z + smp.flatRight.z * lateral;
    const hit = world.raycastDown(px, smp.pos.y + 4.0, pz, this.tmpHit);

    this.pos.set(px, hit.y, pz);
    this.vel.set(0, 0, 0);
    // Tangent points forward along track; our local forward is -Z -> yaw = atan2(-tx, -tz)
    this.yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
    this.yawRate = 0;
    this.roadPitch = Math.asin(clamp(smp.tangent.y, -0.35, 0.35));
    this.roadRoll = -smp.bankRad;
    this.bodyPitch = 0;
    this.bodyRoll = 0;
    this.verticalVel = 0;
    this.grounded = true;
    this.gear = 1;
    this.rpm = this.spec.idleRpm;
    this.shiftCutTimer = 0;
    this.nitro = 0.80;
    this.nitroActive = false;
    this.steerSmoothed = 0;
    this.splineS = world.track.wrapS(s);
    this.splineLateral = lateral;
    this.stuckTimer = 0;
    this.offTrackTimer = 0;

    this.updateOrientationQuaternion();
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);

    for (const w of this.wheels) {
      w.suspensionOffset = 0;
      w.steerYaw = 0;
      w.grounded = true;
      w.contactY = hit.y;
      w.airGap = 0;
      w.surface = hit.surface;
    }
  }

  private updateOrientationQuaternion(): void {
    // YXZ Euler: yaw around +Y, pitch around local +X (+pitch lifts nose -Z up), roll around local +Z
    this.tmpEuler.set(this.roadPitch + this.bodyPitch, this.yaw, this.roadRoll + this.bodyRoll, 'YXZ');
    this.quat.setFromEuler(this.tmpEuler);
  }

  /**
   * Fixed-timestep (120 Hz) front-axle simcade vehicle physics step.
   */
  step(dt: number, input: ControlInput, world: PhysicsWorld, raceTime: number, allowDriving = true): void {
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);

    this.telemetry.justShifted = false;
    this.telemetry.shiftDir = 0;
    this.telemetry.impactStrength = 0;
    this.telemetry.scrapeIntensity = 0;
    this.telemetry.revLimiterHit = false;

    const effThrottle = allowDriving ? clamp(input.throttle, 0, 1) : 0;
    const effBrake = allowDriving ? clamp(input.brake, 0, 1) : 1;
    const targetSteer = allowDriving ? clamp(input.steer, -1, 1) : 0;

    // 1. Horizontal basis vectors from current yaw (local -Z forward, +X right)
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const fwdX = -sinY;
    const fwdZ = -cosY;
    const rightX = cosY;
    const rightZ = -sinY;

    // Current local longitudinal & lateral velocities
    const vFwd = this.vel.x * fwdX + this.vel.z * fwdZ;
    const vRight = this.vel.x * rightX + this.vel.z * rightZ;
    const speedMs = Math.hypot(vFwd, vRight);
    const speedKmh = speedMs * 3.6;

    // 2. Speed-sensitive steering response & damping (Section 8.2)
    //    Full authority < 60 km/h, smooth progressive damping > 120 km/h
    const steerSpeedRate = Math.abs(targetSteer) > Math.abs(this.steerSmoothed) ? 8.5 : 11.0;
    this.steerSmoothed += (targetSteer - this.steerSmoothed) * Math.min(1, steerSpeedRate * dt);
    const speedDamp =
      speedKmh <= 60
        ? 1.0
        : lerp(1.0, 0.34, clamp((speedKmh - 60) / 160, 0, 1));
    // Positive steerRightRad = wheels turned RIGHT (toward +X)
    const steerRightRad = this.steerSmoothed * this.spec.maxSteerRad * speedDamp;

    // 3. 4-Wheel Surface Raycasts (from exact road mesh + terrain heightfield!)
    let groundedCount = 0;
    let avgContactY = 0;
    this.avgNormal.set(0, 0, 0);
    let dominantSurface: SurfaceType = 'asphalt';
    const surfacePriority: Record<SurfaceType, number> = {
      bridge: 5,
      asphalt: 4,
      curb: 3,
      gravel: 2,
      sand: 1,
      grass: 0,
    };
    let bestSurfPrio = -1;

    // Ackermann wheel angles (inner wheel turns slightly sharper than outer)
    const L = this.spec.wheelbase;
    const tw = this.spec.trackWidth;
    let flYaw = -steerRightRad;
    let frYaw = -steerRightRad;
    if (Math.abs(steerRightRad) > 0.005) {
      const turnR = L / Math.tan(Math.abs(steerRightRad));
      const inner = Math.atan(L / Math.max(1.2, turnR - tw * 0.5));
      const outer = Math.atan(L / (turnR + tw * 0.5));
      const innerC = Math.min(this.spec.maxSteerRad, inner);
      const outerC = Math.min(this.spec.maxSteerRad, outer);
      if (steerRightRad > 0) {
        // Turning RIGHT: FR is inner, FL is outer; local Y rotation is negative!
        frYaw = -innerC;
        flYaw = -outerC;
      } else {
        // Turning LEFT: FL is inner, FR is outer; local Y rotation is positive!
        flYaw = innerC;
        frYaw = outerC;
      }
    }

    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      // Transform local mount point into world XZ
      const wx = this.pos.x + rightX * w.mountX - fwdX * w.mountZ;
      const wz = this.pos.z + rightZ * w.mountX - fwdZ * w.mountZ;
      const hit = world.raycastDown(wx, this.pos.y + 1.8, wz, this.tmpHit);
      w.contactY = hit.y;
      w.surface = hit.surface;

      // Wheel hub ground height expected at rest is pos.y (since pos.y is bottom of tires at rest)
      const relGround = hit.y - this.pos.y;
      w.airGap = Math.max(0, -relGround);
      if (w.airGap > this.maxWheelAirGap) this.maxWheelAirGap = w.airGap;

      // Suspension travel clamped strictly to [-0.07m droop, +0.085m bump] -> ZERO fender clipping!
      if (relGround > -0.28) {
        w.grounded = true;
        groundedCount++;
        avgContactY += hit.y;
        this.avgNormal.add(hit.normal);
        const targetSusp = clamp(relGround * 0.65, -0.06, 0.08);
        w.suspensionOffset = lerp(w.suspensionOffset, targetSusp, Math.min(1, 22 * dt));
      } else {
        w.grounded = false;
        w.suspensionOffset = lerp(w.suspensionOffset, -0.065, Math.min(1, 14 * dt));
      }

      if (w.isFront) {
        w.steerYaw = i === 0 ? flYaw : frYaw;
      } else {
        w.steerYaw = 0;
      }

      // Spin wheel forward: local -Z forward -> rolling forward rotates wheel top toward -Z (negative local X rotation!)
      w.spinPitch -= (vFwd / this.spec.wheelRadius) * dt;

      if (surfacePriority[w.surface] > bestSurfPrio) {
        bestSurfPrio = surfacePriority[w.surface];
        dominantSurface = w.surface;
      }
    }

    this.grounded = groundedCount >= 2;
    if (groundedCount > 0) {
      avgContactY /= groundedCount;
      this.avgNormal.normalize();
    } else {
      this.avgNormal.set(0, 1, 0);
    }

    // 4. Vertical suspension & terrain contact constraint (chassis NEVER penetrates below ground!)
    const centerHit = world.raycastDown(this.pos.x, this.pos.y + 1.8, this.pos.z, this.tmpHit);
    const targetGroundY = groundedCount > 0 ? Math.max(avgContactY, centerHit.y) : centerHit.y;

    if (this.pos.y <= targetGroundY + 0.14 && this.verticalVel <= 1.2) {
      // Firmly planted on road/terrain surface with smooth spring follow
      this.pos.y = lerp(this.pos.y, targetGroundY, Math.min(1, 30 * dt));
      if (this.pos.y < targetGroundY) this.pos.y = targetGroundY;
      this.verticalVel = 0;
      this.grounded = true;
    } else {
      this.verticalVel -= 18.5 * dt;
      this.pos.y += this.verticalVel * dt;
      if (this.pos.y < targetGroundY) {
        this.pos.y = targetGroundY;
        this.verticalVel = 0;
        this.grounded = true;
      }
    }

    // 5. Surface grip & rolling resistance multipliers
    let gripMult = 1.0;
    let rollDrag = 0.015;
    if (dominantSurface === 'curb') {
      gripMult = 0.96;
      rollDrag = 0.022;
    } else if (dominantSurface === 'gravel') {
      gripMult = 0.78;
      rollDrag = 0.055;
    } else if (dominantSurface === 'sand') {
      gripMult = 0.70;
      rollDrag = 0.095;
    } else if (dominantSurface === 'grass') {
      gripMult = 0.74;
      rollDrag = 0.075;
    }

    // 6. Mini-Nitro (`Shift`) charge & drain logic (Section 8.2)
    const wantNitro = allowDriving && input.nitro && effThrottle > 0.15 && this.nitro > 0.015 && vFwd > 4;
    this.nitroActive = wantNitro;
    if (this.nitroActive) {
      this.nitro = Math.max(0, this.nitro - 0.28 * dt);
    } else if (allowDriving && this.grounded) {
      const onPaved = dominantSurface === 'asphalt' || dominantSurface === 'bridge' || dominantSurface === 'curb';
      if (onPaved && speedKmh > 55) {
        const driftBonus = this.telemetry.tireSlip > 0.18 ? 0.15 : 0.0;
        this.nitro = Math.min(1, this.nitro + (0.042 + driftBonus) * dt);
      }
    }

    // 7. Gearbox, RPM & Longitudinal Engine/Braking Force
    const spec = this.spec;
    const effTopSpeedMs = (spec.topSpeedKmh + (this.nitroActive ? 20 : 0)) / 3.6;

    if (this.shiftCutTimer > 0) this.shiftCutTimer = Math.max(0, this.shiftCutTimer - dt);

    // Automatic racing gearbox (forward gears 1..6; reverse gear 0 when stopped & holding brake)
    let isReversing = false;
    if (effBrake > 0.2 && vFwd < 0.8 && effThrottle < 0.1) {
      isReversing = true;
      this.gear = 0;
    } else {
      if (this.gear === 0) this.gear = 1;
      // Compute wheel-coupled RPM in current gear
      const finalDrive = 4.45;
      const wheelRpm = Math.max(0, vFwd) / (2 * Math.PI * spec.wheelRadius) * 60;
      const coupledRpm = wheelRpm * spec.gearRatios[this.gear - 1] * finalDrive;
      const targetRpm = allowDriving
        ? Math.max(spec.idleRpm + effThrottle * 1900, coupledRpm)
        : spec.idleRpm + (input.throttle * 4200); // allow revving on grid during 3-2-1 countdown!

      if (targetRpm > spec.redlineRpm * 0.96 && this.gear < spec.gearRatios.length && vFwd > 8) {
        this.gear++;
        this.shiftCutTimer = 0.095;
        this.telemetry.justShifted = true;
        this.telemetry.shiftDir = 1;
      } else if (coupledRpm < spec.redlineRpm * 0.44 && this.gear > 1) {
        this.gear--;
        this.shiftCutTimer = 0.05;
        this.telemetry.justShifted = true;
        this.telemetry.shiftDir = -1;
      }

      const newCoupled = wheelRpm * spec.gearRatios[this.gear - 1] * finalDrive;
      const desiredRpm = allowDriving
        ? clamp(Math.max(spec.idleRpm + effThrottle * 1400, newCoupled), spec.idleRpm, spec.maxRpm)
        : clamp(spec.idleRpm + input.throttle * 4800, spec.idleRpm, spec.redlineRpm);
      const rpmRate = desiredRpm > this.rpm ? 12.0 : 9.0;
      this.rpm += (desiredRpm - this.rpm) * Math.min(1, rpmRate * dt);
      if (this.rpm >= spec.maxRpm - 120 && effThrottle > 0.5) {
        this.telemetry.revLimiterHit = true;
        this.rpm -= 260;
      }
    }

    // Longitudinal drive / brake / drag forces
    let fLong = 0;
    if (this.grounded) {
      if (isReversing) {
        fLong = -spec.engineForce * 0.45 * effBrake;
        if (vFwd < -14) fLong = 0;
      } else {
        // Torque curve + gear advantage
        const rpmNorm = clamp((this.rpm - spec.idleRpm) / (spec.redlineRpm - spec.idleRpm), 0, 1);
        const torqueShape = 0.72 + 0.34 * Math.sin(rpmNorm * Math.PI * 0.85);
        const gearMult = 0.62 + 0.28 * (spec.gearRatios[Math.max(0, this.gear - 1)] / 2.2);
        const speedFade = clamp(1.0 - Math.pow(Math.max(0, vFwd) / effTopSpeedMs, 2.6), 0, 1);
        const shiftMult = this.shiftCutTimer > 0 ? 0.15 : 1.0;
        const nitroMult = this.nitroActive ? 1.24 : 1.0;
        const driveForce = effThrottle * spec.engineForce * torqueShape * gearMult * speedFade * shiftMult * nitroMult * gripMult;

        // Strong predictable simcade braking
        const brakeForce = effBrake * spec.mass * 20.5 * gripMult * Math.sign(vFwd);
        fLong = driveForce - (Math.abs(vFwd) > 0.25 ? brakeForce : 0);

        // Engine braking when off-throttle
        if (effThrottle < 0.05 && Math.abs(vFwd) > 0.5) {
          fLong -= Math.sign(vFwd) * spec.mass * 1.4;
        }
      }
      // Road grade gravity projection along car forward vector
      const gradeSin = clamp(this.avgNormal.x * fwdX + this.avgNormal.z * fwdZ, -0.25, 0.25);
      fLong += spec.mass * 9.81 * gradeSin;
    }

    // Aerodynamic drag + rolling resistance
    const aeroDrag = 0.48 * vFwd * Math.abs(vFwd);
    const rolling = spec.mass * 9.81 * rollDrag * Math.sign(vFwd) * (Math.abs(vFwd) > 0.1 ? 1 : 0);
    fLong -= aeroDrag + rolling;

    // 8. TRUE FRONT-AXLE BICYCLE / 4-WHEEL LATERAL-SLIP PHYSICS (Section 8.2 — ZERO center-pivot rotation!)
    //    Coordinate reminder:
    //    - steerRightRad > 0 => front wheels pointed RIGHT (+X)
    //    - yawRateRight = -this.yawRate (> 0 means turning RIGHT / clockwise from above)
    const lf = Math.abs(spec.frontAxleZ);
    const lr = Math.abs(spec.rearAxleZ);
    const weightFront = spec.mass * 9.81 * (lr / (lf + lr));
    const weightRear = spec.mass * 9.81 * (lf / (lf + lr));
    const muPeak = 1.62 * gripMult;

    let fLatTotal = 0;
    let yawTorqueY = 0; // around +Y (+ = CCW/left, - = CW/right)
    let peakSlip = 0;

    if (this.grounded && speedMs > 0.35) {
      const yawRateRight = -this.yawRate;
      const vLongSafe = Math.max(Math.abs(vFwd), 2.5);
      const signFwd = vFwd >= 0 ? 1 : -1;

      // Local lateral velocity at front axle (z = -lf) and rear axle (z = +lr)
      const vLatFront = vRight + yawRateRight * lf;
      const vLatRear = vRight - yawRateRight * lr;

      // Slip angles (positive slip => tire pushes RIGHT/+X on car!)
      // Moving forward: wheel points at +steerRightRad, axle moves at atan2(vLatFront, vFwd)
      const alphaFront = signFwd * steerRightRad - Math.atan2(vLatFront, vLongSafe);
      const alphaRear = -Math.atan2(vLatRear, vLongSafe);

      // Simplified Pacejka lateral tire curve (high crisp cornering stiffness, smooth progressive saturation for recoverable drifts)
      const pacejka = (alpha: number, loadN: number, stiffness: number, muScale: number): number => {
        const maxF = loadN * muPeak * muScale;
        const B = stiffness;
        const C = 1.38;
        return maxF * Math.sin(C * Math.atan(B * alpha));
      };

      // Weight transfer during braking shifts grip slightly forward -> allows controlled drift entry on brake + steer!
      const brakeShift = effBrake * 0.14;
      const loadF = weightFront * (1 + brakeShift);
      const loadR = weightRear * (1 - brakeShift * 0.9);

      const fyFront = pacejka(alphaFront, loadF, 7.6, 1.03);
      const fyRear = pacejka(alphaRear, loadR, 8.2, 1.02);

      // Gentle simcade self-stabilizing counter-steer yaw damping so slides feel awesome & recoverable
      const stabilityDamp = -yawRateRight * spec.mass * 1.15;

      fLatTotal = fyFront + fyRear;
      // Rightward force (+fyFront) at front axle produces CLOCKWISE (negative Y) yaw torque!
      // Rightward force (+fyRear) at rear axle produces COUNTERCLOCKWISE (positive Y) yaw torque!
      const yawTorqueRight = lf * fyFront - lr * fyRear + stabilityDamp;
      yawTorqueY = -yawTorqueRight;

      peakSlip = clamp(Math.max(Math.abs(alphaFront), Math.abs(alphaRear)) / 0.45, 0, 1);
    } else if (this.grounded) {
      // At near-zero speed, bleed tiny velocities cleanly to 0
      fLatTotal = -vRight * spec.mass * 12.0;
      this.yawRate *= Math.max(0, 1 - 12 * dt);
    }

    // Integrate linear & angular velocities
    const accelFwd = fLong / spec.mass;
    const accelRight = fLatTotal / spec.mass;
    const newVFwd = vFwd + accelFwd * dt;
    const newVRight = vRight + accelRight * dt;

    // Gentle low-speed stop clamp
    const stopClamp = Math.abs(newVFwd) < 0.12 && effThrottle < 0.05 && effBrake > 0.2 ? 0 : newVFwd;

    this.vel.x = fwdX * stopClamp + rightX * newVRight;
    this.vel.z = fwdZ * stopClamp + rightZ * newVRight;

    const izz = spec.mass * (lf * lf + lr * lr) * 0.68;
    this.yawRate += (yawTorqueY / izz) * dt;
    this.yawRate = clamp(this.yawRate, -2.6, 2.6);
    this.yaw += this.yawRate * dt;

    // Advance position
    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;

    // 9. Barrier & Rigid Obstacle Swept Collision Resolution (zero tunneling, zero sticky walls!)
    const col = world.resolveHorizontalCollision(this.pos.x, this.pos.y, this.pos.z, 1.05);
    if (col.hit) {
      this.pos.x += col.pushX;
      this.pos.z += col.pushZ;
      const vn = this.vel.x * col.nx + this.vel.z * col.nz;
      if (vn < 0) {
        const impactSpd = -vn;
        this.telemetry.impactStrength = clamp((impactSpd - 1.5) / 18, 0, 1);
        // Elastic-damped bounce along inward normal + smooth tangential slide (never sticky!)
        const restitution = 0.28;
        this.vel.x -= (1 + restitution) * vn * col.nx;
        this.vel.z -= (1 + restitution) * vn * col.nz;
        // Mild tangential scrape friction
        const tx = -col.nz;
        const tz = col.nx;
        const vt = this.vel.x * tx + this.vel.z * tz;
        this.vel.x -= tx * vt * Math.min(0.25, 1.8 * dt);
        this.vel.z -= tz * vt * Math.min(0.25, 1.8 * dt);
        this.telemetry.scrapeIntensity = clamp(Math.abs(vt) / 28, 0.08, 1);
        this.yawRate *= 0.65;
      } else {
        const tx = -col.nz;
        const tz = col.nx;
        const vt = Math.abs(this.vel.x * tx + this.vel.z * tz);
        if (vt > 2.0) this.telemetry.scrapeIntensity = clamp(vt / 32, 0.05, 0.8);
      }
    }

    // Re-clamp Y cleanly after horizontal move so car never dips below road/terrain even on steep slopes
    const postHit = world.raycastDown(this.pos.x, this.pos.y + 1.8, this.pos.z, this.tmpHit);
    if (this.pos.y < postHit.y) {
      this.pos.y = postHit.y;
      if (this.verticalVel < 0) this.verticalVel = 0;
    }

    // 10. Road slope alignment + Weight-Transfer Body Pitch & Roll (Section 5.1)
    // Align chassis pitch/roll smoothly to exact road/terrain normal
    const targetRoadPitch = Math.asin(clamp(-(this.avgNormal.x * fwdX + this.avgNormal.z * fwdZ), -0.32, 0.32));
    const targetRoadRoll = Math.asin(clamp(-(this.avgNormal.x * rightX + this.avgNormal.z * rightZ), -0.32, 0.32));
    this.roadPitch = lerp(this.roadPitch, targetRoadPitch, Math.min(1, 14 * dt));
    this.roadRoll = lerp(this.roadRoll, targetRoadRoll, Math.min(1, 14 * dt));

    // Dynamic body roll (turns right => leans left, positive Z roll!) & pitch (accel => nose lifts +pitch; brake => nose dives -pitch)
    const latG = clamp(accelRight / 9.81, -2.5, 2.5);
    const longG = clamp(accelFwd / 9.81, -2.2, 2.0);
    const targetBodyRoll = clamp(latG * 0.032, -0.068, 0.068);
    const targetBodyPitch = clamp(longG * 0.022, -0.048, 0.042);
    this.bodyRoll = lerp(this.bodyRoll, targetBodyRoll, Math.min(1, 11 * dt));
    this.bodyPitch = lerp(this.bodyPitch, targetBodyPitch, Math.min(1, 11 * dt));

    this.updateOrientationQuaternion();

    // 11. Track Spline Projection & Safety Reset Guard (Section 3.3)
    const nearest = world.track.closestPointXZ(this.pos.x, this.pos.z, this.splineS);
    this.splineS = nearest.sample.s;
    this.splineLateral = nearest.lateral;

    // Runtime invariant checks (under terrain, out of world, flipped, stuck > 3 s)
    const terrY = world.terrain.getHeight(this.pos.x, this.pos.z);
    const outBounds =
      this.pos.x < world.terrain.cfg.minX + 10 ||
      this.pos.x > world.terrain.cfg.maxX - 10 ||
      this.pos.z < world.terrain.cfg.minZ + 10 ||
      this.pos.z > world.terrain.cfg.maxZ - 10;

    this.tmpUp.set(0, 1, 0).applyQuaternion(this.quat);
    const isFlipped = this.tmpUp.y < 0.35;
    const isUnderTerrain = this.pos.y < Math.min(terrY, postHit.y) - 1.5;

    if (allowDriving) {
      const offRoad = Math.abs(this.splineLateral) > nearest.sample.width * 0.5 + 4.5;
      if (offRoad || (speedKmh < 4 && (effThrottle > 0.3 || !this.isPlayer))) {
        this.stuckTimer += dt;
      } else {
        this.stuckTimer = 0;
      }
    } else {
      this.stuckTimer = 0;
    }

    if (isUnderTerrain || outBounds || isFlipped || this.stuckTimer > 3.2) {
      const reason: VehicleSafetyLogEntry['reason'] = isUnderTerrain
        ? 'under_terrain'
        : outBounds
        ? 'out_of_world'
        : isFlipped
        ? 'flipped'
        : 'stuck';
      this.safetyResetCount++;
      if (isUnderTerrain) this.underTerrainResets++;
      if (outBounds) this.outOfWorldResets++;
      this.safetyLog.push({ time: raceTime, reason, s: this.splineS });
      this.spawnAtSpline(world, this.splineS, 0);
    }

    // 12. Update Telemetry
    const finalSpdKmh = Math.hypot(this.vel.x, this.vel.z) * 3.6;
    this.telemetry.speedKmh = finalSpdKmh;
    this.telemetry.rpm = this.rpm;
    this.telemetry.gear = this.gear;
    this.telemetry.nitro = this.nitro;
    this.telemetry.nitroActive = this.nitroActive;
    this.telemetry.steerVisualNorm = this.steerSmoothed;
    this.telemetry.throttle = effThrottle;
    this.telemetry.brake = effBrake;
    this.telemetry.lateralG = latG;
    this.telemetry.tireSlip = peakSlip;
    this.telemetry.surface = dominantSurface;
    this.telemetry.isBraking = effBrake > 0.15 && vFwd > 1.5;
    this.telemetry.onBridge = nearest.sample.isBridge;

    for (const w of this.wheels) w.slipRatio = peakSlip;
  }

  /**
   * Resolves credible car-vs-car impulse collision with separation and sliding (zero tunneling/stickiness).
   */
  static resolveCarPair(a: VehiclePhysics, b: VehiclePhysics): number {
    // Two-circle hull approximation (front & rear circles of radius 0.96m at z = +/-1.15m)
    const aSin = Math.sin(a.yaw), aCos = Math.cos(a.yaw);
    const bSin = Math.sin(b.yaw), bCos = Math.cos(b.yaw);
    const offsets = [-1.15, 1.15];
    const minDist = 1.88;
    let maxImpact = 0;

    for (const oa of offsets) {
      const ax = a.pos.x - aSin * (-oa);
      const az = a.pos.z - aCos * (-oa);
      for (const ob of offsets) {
        const bx = b.pos.x - bSin * (-ob);
        const bz = b.pos.z - bCos * (-ob);
        const dx = bx - ax;
        const dz = bz - az;
        const d2 = dx * dx + dz * dz;
        if (d2 < minDist * minDist && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const nz = dz / d;
          const pen = (minDist - d) * 0.52;
          a.pos.x -= nx * pen;
          a.pos.z -= nz * pen;
          b.pos.x += nx * pen;
          b.pos.z += nz * pen;

          const rvx = b.vel.x - a.vel.x;
          const rvz = b.vel.z - a.vel.z;
          const vn = rvx * nx + rvz * nz;
          if (vn < 0) {
            const j = -(1 + 0.35) * vn * 0.5;
            a.vel.x -= nx * j;
            a.vel.z -= nz * j;
            b.vel.x += nx * j;
            b.vel.z += nz * j;
            const imp = clamp(-vn / 18, 0, 1);
            if (imp > maxImpact) maxImpact = imp;
          }
        }
      }
    }
    if (maxImpact > 0.05) {
      a.telemetry.impactStrength = Math.max(a.telemetry.impactStrength, maxImpact);
      b.telemetry.impactStrength = Math.max(b.telemetry.impactStrength, maxImpact);
    }
    return maxImpact;
  }

  getForwardVector(out = new THREE.Vector3()): THREE.Vector3 {
    return out.set(0, 0, -1).applyQuaternion(this.quat).normalize();
  }

  getRightVector(out = new THREE.Vector3()): THREE.Vector3 {
    return out.set(1, 0, 0).applyQuaternion(this.quat).normalize();
  }
}
