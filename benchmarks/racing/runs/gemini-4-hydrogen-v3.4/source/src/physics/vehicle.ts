import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { COLLISION_GROUP_CAR, PhysicsWorld } from './world';
import { TrackSpline } from '../world/track';
import { TerrainField } from '../world/terrain';

export type SurfaceType = 'asphalt' | 'curb' | 'sand' | 'grass' | 'bridge';

export interface CarSpec {
  id: 'veloce' | 'solara';
  name: string;
  mass: number;
  maxEngineForce: number;
  topSpeedMs: number; // ~62 m/s = 223 km/h
  gripFront: number;
  gripRear: number;
  driftGripFactor: number;
  wheelBase: number;
  trackWidth: number;
  wheelRadius: number;
  restLength: number;
  stiffness: number;
  damping: number;
}

export const CAR_SPECS: Record<'veloce' | 'solara', CarSpec> = {
  veloce: {
    id: 'veloce',
    name: 'Veloce GT',
    mass: 1320,
    maxEngineForce: 11200,
    topSpeedMs: 64.0, // ~230 km/h
    gripFront: 10.8,
    gripRear: 10.2,
    driftGripFactor: 0.58,
    wheelBase: 2.68,
    trackWidth: 1.62,
    wheelRadius: 0.35,
    restLength: 0.42,
    stiffness: 42000,
    damping: 4600,
  },
  solara: {
    id: 'solara',
    name: 'Solara RS',
    mass: 1210,
    maxEngineForce: 10800,
    topSpeedMs: 61.5, // ~221 km/h
    gripFront: 11.4,
    gripRear: 9.8,
    driftGripFactor: 0.52,
    wheelBase: 2.54,
    trackWidth: 1.56,
    wheelRadius: 0.34,
    restLength: 0.44,
    stiffness: 39000,
    damping: 4300,
  },
};

export interface VehicleInput {
  throttle: number; // [0, 1]
  brake: number; // [0, 1]
  steer: number; // [-1, 1] (+left, -right)
  handbrake: boolean;
}

export interface WheelState {
  localAnchor: THREE.Vector3;
  isFront: boolean;
  compression: number;
  grounded: boolean;
  contactY: number;
  spinAngle: number;
  steerAngle: number;
  worldPos: THREE.Vector3;
}

export class ArcadeVehicle {
  public readonly index: number;
  public readonly isPlayer: boolean;
  public spec: CarSpec;
  public readonly body: RAPIER.RigidBody;
  public readonly collider: RAPIER.Collider;
  public readonly wheels: WheelState[];

  public readonly pos = new THREE.Vector3();
  public readonly quat = new THREE.Quaternion();
  public readonly vel = new THREE.Vector3();
  public speedMs = 0;
  public forwardSpeedMs = 0;
  public lateralSpeedMs = 0;
  public rpm = 1200;
  public gear = 1;
  public isBraking = false;
  public throttleOut = 0;
  public steerCurrent = 0;
  public skidIntensity = 0;
  public surface: SurfaceType = 'asphalt';
  public bodyRoll = 0;
  public bodyPitch = 0;
  public lastShiftTime = -10;
  public shiftEventCounter = 0;
  public impactImpulse = 0;
  public scrapeIntensity = 0;

  // Race & safety tracking
  public currentS = 0;
  public lastValidS = 0;
  public offTrackTimer = 0;
  public stuckTimer = 0;
  public safetyResets = 0;
  public invariantFailures: string[] = [];

  private readonly physics: PhysicsWorld;
  private readonly track: TrackSpline;
  private readonly terrain: TerrainField;
  private simTime = 0;
  private prevVel = new THREE.Vector3();

  constructor(
    index: number,
    isPlayer: boolean,
    spec: CarSpec,
    physics: PhysicsWorld,
    track: TrackSpline,
    terrain: TerrainField,
    spawnS: number,
    spawnLateral: number
  ) {
    this.index = index;
    this.isPlayer = isPlayer;
    this.spec = spec;
    this.physics = physics;
    this.track = track;
    this.terrain = terrain;

    const samp = track.sampleAtDistance(spawnS);
    const wx = samp.pos.x + samp.right.x * spawnLateral;
    const wz = samp.pos.z + samp.right.z * spawnLateral;

    // Raycast spawn onto actual road collider (never fixed height!)
    const hit = physics.raycastGround(wx, samp.pos.y + 4.0, wz, 15.0);
    const groundY = hit ? hit.hitY : samp.pos.y;
    const spawnY = groundY + 0.56;

    const m = new THREE.Matrix4().makeBasis(samp.right, samp.up, samp.tangent.clone().negate());
    // Wait: Three.js forward is -Z when facing tangent, or let's use +Z = forward:
    // Let's standardize car local frame: +Z = forward, +Y = up, -X = right (Wait: right-handed: X x Y = Z => if Y=up, Z=forward, then X = up x forward = LEFT!).
    // Check: left = cross(up, tangent). Since right = cross(tangent, up), left = -right!
    const left = samp.right.clone().negate();
    m.makeBasis(left, samp.up, samp.tangent);
    const spawnQuat = new THREE.Quaternion().setFromRotationMatrix(m);

    const rbDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(wx, spawnY, wz)
      .setRotation({ x: spawnQuat.x, y: spawnQuat.y, z: spawnQuat.z, w: spawnQuat.w })
      .setLinearDamping(0.08)
      .setAngularDamping(2.6)
      .setCcdEnabled(true);
    this.body = physics.world.createRigidBody(rbDesc);

    // Compute exact mass & inertia via cuboid collider (chassis clearance above ground)
    const colDesc = RAPIER.ColliderDesc.cuboid(0.92, 0.34, 2.15)
      .setTranslation(0, 0.16, 0)
      .setMass(spec.mass)
      .setFriction(0.15)
      .setRestitution(0.12)
      .setCollisionGroups((COLLISION_GROUP_CAR << 16) | 0xffff);
    this.collider = physics.world.createCollider(colDesc, this.body);

    const hw = spec.trackWidth * 0.5;
    const hb = spec.wheelBase * 0.5;
    const wy = -0.14; // anchor relative to chassis body center
    this.wheels = [
      { localAnchor: new THREE.Vector3(hw, wy, hb), isFront: true, compression: 0, grounded: true, contactY: groundY, spinAngle: 0, steerAngle: 0, worldPos: new THREE.Vector3() },
      { localAnchor: new THREE.Vector3(-hw, wy, hb), isFront: true, compression: 0, grounded: true, contactY: groundY, spinAngle: 0, steerAngle: 0, worldPos: new THREE.Vector3() },
      { localAnchor: new THREE.Vector3(hw, wy, -hb), isFront: false, compression: 0, grounded: true, contactY: groundY, spinAngle: 0, steerAngle: 0, worldPos: new THREE.Vector3() },
      { localAnchor: new THREE.Vector3(-hw, wy, -hb), isFront: false, compression: 0, grounded: true, contactY: groundY, spinAngle: 0, steerAngle: 0, worldPos: new THREE.Vector3() },
    ];

    this.currentS = track.wrapS(spawnS);
    this.lastValidS = this.currentS;
    this.syncTransforms();
  }

  public syncTransforms(): void {
    const t = this.body.translation();
    const r = this.body.rotation();
    const v = this.body.linvel();
    this.pos.set(t.x, t.y, t.z);
    this.quat.set(r.x, r.y, r.z, r.w);
    this.vel.set(v.x, v.y, v.z);
    this.speedMs = this.vel.length();
  }

  public setSpec(spec: CarSpec): void {
    this.spec = spec;
    this.collider.setMass(spec.mass);
    const hw = spec.trackWidth * 0.5;
    const hb = spec.wheelBase * 0.5;
    this.wheels[0].localAnchor.set(hw, -0.14, hb);
    this.wheels[1].localAnchor.set(-hw, -0.14, hb);
    this.wheels[2].localAnchor.set(hw, -0.14, -hb);
    this.wheels[3].localAnchor.set(-hw, -0.14, -hb);
  }

  public resetToTrack(s: number, lateral = 0): void {
    const samp = this.track.sampleAtDistance(s);
    const wx = samp.pos.x + samp.right.x * lateral;
    const wz = samp.pos.z + samp.right.z * lateral;
    const hit = this.physics.raycastGround(wx, samp.pos.y + 4.0, wz, 15.0, this.collider.handle);
    const gy = hit ? hit.hitY : samp.pos.y;
    const left = samp.right.clone().negate();
    const m = new THREE.Matrix4().makeBasis(left, samp.up, samp.tangent);
    const q = new THREE.Quaternion().setFromRotationMatrix(m);

    this.body.resetForces(true);
    this.body.resetTorques(true);
    this.body.setTranslation({ x: wx, y: gy + 0.58, z: wz }, true);
    this.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.rpm = 1200;
    this.gear = 1;
    this.lastShiftTime = -10;
    this.skidIntensity = 0;
    this.impactImpulse = 0;
    this.scrapeIntensity = 0;
    this.prevVel.set(0, 0, 0);
    this.offTrackTimer = 0;
    this.stuckTimer = 0;
    this.currentS = this.track.wrapS(s);
    this.lastValidS = this.currentS;
    this.syncTransforms();
  }

  public step(dt: number, input: VehicleInput, raceStarted: boolean): void {
    this.simTime += dt;
    this.syncTransforms();

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quat).normalize();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat).normalize();
    const left = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat).normalize();

    this.forwardSpeedMs = this.vel.dot(forward);
    this.lateralSpeedMs = this.vel.dot(left);

    const throttle = raceStarted ? THREE.MathUtils.clamp(input.throttle, 0, 1) : 0;
    const brake = raceStarted ? THREE.MathUtils.clamp(input.brake, 0, 1) : 1.0;
    const targetSteer = raceStarted ? THREE.MathUtils.clamp(input.steer, -1, 1) : 0;

    // Speed-sensitive steering response
    const speedFactor = THREE.MathUtils.clamp(this.speedMs / 55.0, 0, 1);
    const maxSteerDeg = THREE.MathUtils.lerp(33, 12, Math.pow(speedFactor, 0.72));
    const steerRate = 6.5;
    this.steerCurrent += (targetSteer - this.steerCurrent) * Math.min(1, steerRate * dt);
    const steerRad = THREE.MathUtils.degToRad(maxSteerDeg) * this.steerCurrent;

    // 4-wheel raycast suspension + ground contact
    let groundedCount = 0;
    let onRoadCount = 0;
    const rayMax = this.spec.wheelRadius + this.spec.restLength;
    const forceAccum = new THREE.Vector3();
    const torqueAccum = new THREE.Vector3();

    for (const w of this.wheels) {
      w.steerAngle = w.isFront ? steerRad : 0;
      const worldAnchor = w.localAnchor.clone().applyQuaternion(this.quat).add(this.pos);
      const rayDir = up.clone().negate();

      // Cast down along car's down vector (or world down if upright)
      const castDir = up.y > 0.5 ? new THREE.Vector3(0, -1, 0) : rayDir;
      const ray = new RAPIER.Ray(
        { x: worldAnchor.x, y: worldAnchor.y + 0.15, z: worldAnchor.z },
        { x: castDir.x, y: castDir.y, z: castDir.z }
      );
      const worldHit = this.physics.world.castRay(
        ray,
        rayMax + 0.15,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        (c) => c.handle === this.physics.roadCollider.handle || c.handle === this.physics.terrainCollider.handle
      );

      if (worldHit) {
        const dist = worldHit.timeOfImpact - 0.15;
        const compression = THREE.MathUtils.clamp(
          (this.spec.restLength - (dist - this.spec.wheelRadius)) / this.spec.restLength,
          0,
          1
        );
        const prevComp = w.grounded ? w.compression : compression;
        w.compression = compression;
        w.grounded = true;
        w.contactY = worldAnchor.y - dist;
        groundedCount++;
        if (worldHit.collider.handle === this.physics.roadCollider.handle) {
          onRoadCount++;
        }

        // Convert normalized compression delta to physical damper velocity (m/s)
        const compVelMeters = THREE.MathUtils.clamp(
          ((compression - prevComp) * this.spec.restLength) / dt,
          -4.0,
          4.0
        );
        const springF = THREE.MathUtils.clamp(
          compression * this.spec.stiffness + compVelMeters * this.spec.damping,
          0,
          this.spec.mass * 16.0
        );
        const fVec = new THREE.Vector3(0, springF, 0);
        forceAccum.add(fVec);
        const rArm = worldAnchor.clone().sub(this.pos);
        torqueAccum.add(new THREE.Vector3().crossVectors(rArm, fVec));

        w.worldPos.set(
          worldAnchor.x,
          worldAnchor.y - Math.max(0.05, dist - this.spec.wheelRadius),
          worldAnchor.z
        );
      } else {
        w.compression = Math.max(0, w.compression - dt * 5);
        w.grounded = false;
        w.worldPos.copy(worldAnchor).addScaledVector(up, -this.spec.restLength);
      }
      w.spinAngle += (this.forwardSpeedMs / this.spec.wheelRadius) * dt;
    }

    // Track spline projection & surface detection
    const proj = this.track.projectPointXZ(this.pos.x, this.pos.y, this.pos.z);
    this.currentS = proj.s;
    const roadEdgeDist = proj.distToEdge;

    if (proj.sample.isBridge && onRoadCount > 0) {
      this.surface = 'bridge';
    } else if (onRoadCount > 0 && roadEdgeDist > -0.7 && roadEdgeDist <= 0.4) {
      this.surface = 'curb';
    } else if (onRoadCount > 0 || roadEdgeDist <= 0.1) {
      this.surface = 'asphalt';
    } else if (this.pos.y < 3.6 && proj.sample.zone === 'Z1') {
      this.surface = 'sand';
    } else {
      this.surface = 'grass';
    }

    const surfaceGripMult =
      this.surface === 'sand' ? 0.62 : this.surface === 'grass' ? 0.75 : 1.0;
    const surfaceDragMult =
      this.surface === 'sand' ? 2.4 : this.surface === 'grass' ? 1.65 : 1.0;

    // Longitudinal & Lateral forces when at least 1 wheel grounded
    this.throttleOut = throttle;
    this.isBraking = brake > 0.1 && this.forwardSpeedMs > 1.0;

    if (groundedCount > 0) {
      const groundScale = groundedCount / 4;

      // Engine & Brake
      let longForce = 0;
      const topSpeed = this.spec.topSpeedMs * (this.surface === 'sand' ? 0.68 : this.surface === 'grass' ? 0.78 : 1.0);
      const speedRatio = THREE.MathUtils.clamp(this.forwardSpeedMs / topSpeed, 0, 1.05);

      if (!raceStarted) {
        // Hold grid position rigidly until start signal (never engage reverse!)
        longForce = -this.forwardSpeedMs * 16000;
      } else {
        if (throttle > 0.02) {
          // Strong punchy low-end torque tapering gently near top speed
          const torqueCurve = Math.max(0.18, 1.15 - Math.pow(speedRatio, 1.35));
          longForce += throttle * this.spec.maxEngineForce * torqueCurve;
        }

        if (brake > 0.02) {
          if (this.forwardSpeedMs > 0.35) {
            longForce -= brake * 18500;
          } else if (throttle < 0.02 && this.forwardSpeedMs > -18.0) {
            // Reverse gear only after coming to a stop in live race
            longForce -= brake * 6500;
          }
        }

        // Aerodynamic + rolling drag
        const aeroDrag = (0.42 * this.speedMs * this.speedMs + 28 * this.speedMs) * surfaceDragMult;
        longForce -= Math.sign(this.forwardSpeedMs) * aeroDrag;
        if (throttle < 0.02 && brake < 0.02 && Math.abs(this.forwardSpeedMs) < 1.5) {
          longForce -= this.forwardSpeedMs * 1400;
        }
      }

      forceAccum.addScaledVector(forward, longForce * groundScale);

      // Lateral tire grip (arcade-tuned bicycle/4-wheel lateral damping + drift slip)
      const handbrakeMult = input.handbrake ? this.spec.driftGripFactor : 1.0;
      const latGrip =
        this.spec.gripRear *
        surfaceGripMult *
        handbrakeMult *
        (this.forwardSpeedMs > 25 ? 0.94 : 1.0);
      const latForce = -this.lateralSpeedMs * this.spec.mass * latGrip * 0.45 * groundScale;
      forceAccum.addScaledVector(left, latForce);

      // Yaw steering torque (smooth, responsive turn-in + countersteer stability)
      const dirSign = this.forwardSpeedMs >= -0.5 ? 1 : -1;
      const steerSpeedGain = THREE.MathUtils.clamp(Math.abs(this.forwardSpeedMs) / 7.5, 0, 1);
      const targetYawRate =
        dirSign *
        this.steerCurrent *
        steerSpeedGain *
        (input.handbrake ? 2.45 : 1.85) *
        THREE.MathUtils.lerp(1.25, 0.72, speedFactor);
      const angVel = this.body.angvel();
      const yawErr = targetYawRate - angVel.y;
      torqueAccum.y += yawErr * this.spec.mass * 3.8 * groundScale;

      // Self-righting roll/pitch stabilization so arcade collisions don't flip unfairly
      const worldUp = new THREE.Vector3(0, 1, 0);
      const tiltAxis = new THREE.Vector3().crossVectors(up, worldUp);
      torqueAccum.addScaledVector(tiltAxis, this.spec.mass * 14.0);

      // Downforce at speed
      forceAccum.y -= 1.65 * this.speedMs * this.speedMs * 0.4;
    }

    // Apply forces (Rapier retains user forces/torques between steps unless reset!)
    this.body.resetForces(true);
    this.body.resetTorques(true);
    this.body.addForce({ x: forceAccum.x, y: forceAccum.y, z: forceAccum.z }, true);
    this.body.addTorque({ x: torqueAccum.x, y: torqueAccum.y, z: torqueAccum.z }, true);

    // Visual body roll & pitch
    const targetRoll = THREE.MathUtils.clamp(-this.lateralSpeedMs * 0.009 - this.steerCurrent * speedFactor * 0.04, -0.09, 0.09);
    const targetPitch = THREE.MathUtils.clamp((throttle * 0.025 - (this.isBraking ? brake * 0.04 : 0)), -0.05, 0.04);
    this.bodyRoll += (targetRoll - this.bodyRoll) * Math.min(1, 10 * dt);
    this.bodyPitch += (targetPitch - this.bodyPitch) * Math.min(1, 10 * dt);

    // Automatic 6-speed gearbox & RPM calculation
    this.updateDrivetrain(dt, throttle);

    // Slip / skid intensity for audio + smoke
    const slipSpeed = Math.abs(this.lateralSpeedMs);
    const rawSkid =
      groundedCount > 0 && this.speedMs > 5
        ? THREE.MathUtils.clamp((slipSpeed - 2.6) / 9.0 + (input.handbrake && this.speedMs > 8 ? 0.45 : 0), 0, 1)
        : 0;
    this.skidIntensity += (rawSkid - this.skidIntensity) * Math.min(1, 12 * dt);

    // Collision impulse detection (sudden delta-v)
    const dv = this.vel.distanceTo(this.prevVel);
    this.impactImpulse = dv > 2.2 ? THREE.MathUtils.clamp((dv - 2.2) / 14.0, 0, 1) : 0;
    this.scrapeIntensity =
      Math.abs(proj.lateral) > proj.sample.width * 0.5 + 0.4 && this.speedMs > 3 && dv > 0.25
        ? THREE.MathUtils.clamp(this.speedMs / 35.0, 0, 1)
        : 0;
    this.prevVel.copy(this.vel);

    // Track safety & runtime invariants (Section 3.3 + 8)
    this.checkSafetyAndInvariants(dt, up, proj.distToEdge, raceStarted && throttle > 0.2);
  }

  private updateDrivetrain(dt: number, throttle: number): void {
    const gearMaxSpeeds = [0, 15.5, 26.0, 37.5, 48.0, 56.5, 66.0];
    const absF = Math.max(0, this.forwardSpeedMs);
    const prevGear = this.gear;

    if (this.forwardSpeedMs < -0.5) {
      this.gear = 0; // Reverse
      this.rpm = 1400 + Math.min(4800, Math.abs(this.forwardSpeedMs) * 260);
    } else {
      let targetGear = this.gear < 1 ? 1 : this.gear;
      if (targetGear < 6 && absF > gearMaxSpeeds[targetGear] * 0.96) {
        targetGear++;
      } else if (targetGear > 1 && absF < gearMaxSpeeds[targetGear - 1] * 0.76) {
        targetGear--;
      }
      if (targetGear !== prevGear && (prevGear < 1 || this.simTime - this.lastShiftTime > 0.35)) {
        this.gear = targetGear;
        this.lastShiftTime = this.simTime;
        this.shiftEventCounter++;
      }
      const safeGear = Math.max(1, Math.min(6, this.gear));
      const gMin = safeGear === 1 ? 0 : gearMaxSpeeds[safeGear - 1] * 0.62;
      const gMax = gearMaxSpeeds[safeGear];
      const frac = THREE.MathUtils.clamp((absF - gMin) / Math.max(1, gMax - gMin), 0, 1.06);
      const targetRpm = 1250 + frac * 6850 + (this.skidIntensity * 500 + throttle * 250);
      const nextRpm = this.rpm + (Math.min(8250, targetRpm) - this.rpm) * Math.min(1, 14 * dt);
      this.rpm = Number.isFinite(nextRpm) ? nextRpm : 1250;
    }
  }

  private checkSafetyAndInvariants(dt: number, up: THREE.Vector3, distToEdge: number, isTryingToDrive = false): void {
    const road = this.track.getRoadSurfaceYAt(this.pos.x, this.pos.z);
    const terrY = this.terrain.getHeightAt(this.pos.x, this.pos.z);
    const expectedFloorY = road.insideRoad ? road.y : terrY;

    // Check if car dropped below road/terrain surface!
    if (this.pos.y < expectedFloorY - 0.05 || this.pos.y < -8.0) {
      this.invariantFailures.push(
        `Vehicle ${this.index} fell below surface at s=${this.currentS.toFixed(1)} (y=${this.pos.y.toFixed(2)} vs floor=${expectedFloorY.toFixed(2)})`
      );
      this.safetyResets++;
      this.resetToTrack(this.lastValidS, 0);
      return;
    }

    if (distToEdge < 1.2) {
      this.lastValidS = this.currentS;
      this.offTrackTimer = 0;
    } else if (distToEdge > 3.5) {
      this.offTrackTimer += dt;
    }

    // Auto-reset if flipped, stuck off-track > 3.2s, or physically jammed while driving > 3.5s
    if (up.y < 0.3) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 1.2) {
        this.safetyResets++;
        this.resetToTrack(this.lastValidS, 0);
        return;
      }
    } else if (this.offTrackTimer > 3.2) {
      this.safetyResets++;
      this.resetToTrack(this.lastValidS, 0);
      return;
    } else if (isTryingToDrive && this.speedMs < 1.2) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 3.5) {
        this.safetyResets++;
        this.resetToTrack(this.lastValidS, 0);
        return;
      }
    } else {
      this.stuckTimer = 0;
    }
  }
}
