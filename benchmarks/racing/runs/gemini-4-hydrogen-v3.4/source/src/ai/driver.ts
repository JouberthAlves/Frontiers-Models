import * as THREE from 'three';
import { TrackSpline } from '../world/track';
import { ArcadeVehicle, VehicleInput } from '../physics/vehicle';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface AIDriverProfile {
  baseSpeedScale: number;
  preferredLane: number;
  aggressiveness: number;
}

export class AIDriver {
  public readonly vehicle: ArcadeVehicle;
  private readonly track: TrackSpline;
  private readonly profile: AIDriverProfile;
  private dynamicLane = 0;
  private laneHoldTimer = 0;

  constructor(
    vehicle: ArcadeVehicle,
    track: TrackSpline,
    difficulty: Difficulty,
    slotIndex: number
  ) {
    this.vehicle = vehicle;
    this.track = track;

    const diffScale =
      difficulty === 'easy' ? 0.77 : difficulty === 'normal' ? 0.89 : 0.98;
    // Small natural pace spread across the 5 AIs so racing pack splits and overtakes organically!
    const packSpread = [0.03, 0.015, 0.0, -0.02, -0.04][slotIndex % 5];
    const laneSlots = [-1.8, 1.8, -0.8, 1.2, -2.1];

    this.profile = {
      baseSpeedScale: diffScale + packSpread,
      preferredLane: laneSlots[slotIndex % laneSlots.length],
      aggressiveness: difficulty === 'hard' ? 1.0 : difficulty === 'normal' ? 0.7 : 0.45,
    };
    this.dynamicLane = this.profile.preferredLane;
  }

  public computeInput(
    dt: number,
    allVehicles: ArcadeVehicle[],
    raceStarted: boolean
  ): VehicleInput {
    if (!raceStarted) {
      return { throttle: 0, brake: 1, steer: 0, handbrake: false };
    }

    const v = this.vehicle;
    const proj = this.track.projectPointXZ(v.pos.x, v.pos.y, v.pos.z);
    const halfSafe = proj.sample.width * 0.5 - 2.05;

    // 1. Scan nearby vehicles ahead for overtaking & collision avoidance
    let carAheadClose: { dist: number; latDiff: number; relSpeed: number; otherLat: number } | null = null;
    let sideBlockerLeft = false;
    let sideBlockerRight = false;

    for (const other of allVehicles) {
      if (other.index === v.index) continue;
      let ds = other.currentS - proj.s;
      if (ds < -this.track.totalLength * 0.5) ds += this.track.totalLength;
      if (ds > this.track.totalLength * 0.5) ds -= this.track.totalLength;

      const otherProj = this.track.projectPointXZ(other.pos.x, other.pos.y, other.pos.z);
      const latDiff = otherProj.lateral - proj.lateral;

      if (ds > -4.5 && ds < 5.5) {
        if (latDiff > 0 && latDiff < 3.6) sideBlockerRight = true;
        if (latDiff < 0 && latDiff > -3.6) sideBlockerLeft = true;
      }

      if (ds > 2.0 && ds < 34.0 && Math.abs(latDiff) < 3.4) {
        if (!carAheadClose || ds < carAheadClose.dist) {
          carAheadClose = {
            dist: ds,
            latDiff,
            relSpeed: v.forwardSpeedMs - other.forwardSpeedMs,
            otherLat: otherProj.lateral,
          };
        }
      }
    }

    this.laneHoldTimer = Math.max(0, this.laneHoldTimer - dt);
    if (carAheadClose && this.laneHoldTimer <= 0) {
      // Pick the clearer side to overtake!
      const spaceLeft = carAheadClose.otherLat - (-halfSafe);
      const spaceRight = halfSafe - carAheadClose.otherLat;
      let chosen = this.profile.preferredLane;
      if (spaceRight > spaceLeft && !sideBlockerRight && spaceRight > 2.2) {
        chosen = THREE.MathUtils.clamp(carAheadClose.otherLat + 3.1, -halfSafe, halfSafe);
      } else if (!sideBlockerLeft && spaceLeft > 2.2) {
        chosen = THREE.MathUtils.clamp(carAheadClose.otherLat - 3.1, -halfSafe, halfSafe);
      }
      this.dynamicLane = chosen;
      this.laneHoldTimer = 1.4;
    } else if (!carAheadClose && this.laneHoldTimer <= 0) {
      this.dynamicLane += (this.profile.preferredLane - this.dynamicLane) * Math.min(1, 1.5 * dt);
    }

    // 2. Steer toward lookahead spline point with dynamic racing/passing lateral offset
    const lookDist = THREE.MathUtils.clamp(11.5 + v.speedMs * 0.42, 11.5, 32);
    const ahead = this.track.sampleAtDistance(proj.s + lookDist);
    const rlAheadIdx =
      Math.floor((ahead.s / this.track.totalLength) * this.track.racingLine.length) %
      this.track.racingLine.length;
    const rlLat = this.track.racingLine[rlAheadIdx].lateralOffset;
    const targetLat = THREE.MathUtils.clamp(
      rlLat * 0.45 + this.dynamicLane * 0.55,
      -halfSafe,
      halfSafe
    );

    const targetPos = ahead.pos.clone().addScaledVector(ahead.right, targetLat);
    const toTarget = new THREE.Vector3().subVectors(targetPos, v.pos);
    toTarget.y = 0;
    toTarget.normalize();

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(v.quat);
    forward.y = 0;
    forward.normalize();
    const left = new THREE.Vector3(1, 0, 0).applyQuaternion(v.quat);
    left.y = 0;
    left.normalize();

    const dot = THREE.MathUtils.clamp(forward.dot(toTarget), -1, 1);
    const sideSin = toTarget.dot(left);
    const angleErr = Math.atan2(sideSin, dot);
    const steer = THREE.MathUtils.clamp(angleErr * 2.3, -1, 1);

    // 3. Curvature-derived target speed + braking distance + car-ahead spacing brake
    const rlIdx =
      Math.floor((proj.s / this.track.totalLength) * this.track.racingLine.length) %
      this.track.racingLine.length;
    const rlNext2 = (rlIdx + 2) % this.track.racingLine.length;
    const rlNext5 = (rlIdx + 5) % this.track.racingLine.length;
    let targetSpeed =
      Math.min(
        this.track.racingLine[rlIdx].targetSpeed,
        this.track.racingLine[rlNext2].targetSpeed,
        this.track.racingLine[rlNext5].targetSpeed * 1.06
      ) * this.profile.baseSpeedScale;

    // Slow gently only if very close behind a blocking car and closing speed is positive
    if (carAheadClose && carAheadClose.dist < 7.5 && carAheadClose.relSpeed > 1.0 && Math.abs(carAheadClose.latDiff) < 1.8) {
      targetSpeed = Math.min(targetSpeed, Math.max(14, v.forwardSpeedMs - 3.5 * (1 - this.profile.aggressiveness * 0.45)));
    }

    let throttle = 0;
    let brake = 0;
    if (v.forwardSpeedMs < targetSpeed - 1.2) {
      throttle = THREE.MathUtils.clamp((targetSpeed - v.forwardSpeedMs) / 5.5, 0.3, 1.0);
    } else if (v.forwardSpeedMs > targetSpeed + 2.2) {
      brake = THREE.MathUtils.clamp((v.forwardSpeedMs - targetSpeed) / 9.0, 0.2, 1.0);
    } else {
      throttle = 0.42;
    }

    return { throttle, brake, steer, handbrake: false };
  }
}
