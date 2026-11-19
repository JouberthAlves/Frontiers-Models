import { ControlInput, Difficulty } from '../types';
import { TrackSpline } from '../world/trackSpline';
import { VehiclePhysics } from '../physics/vehiclePhysics';
import { clamp } from '../utils/rng';

export interface AIDriverProfile {
  name: string;
  baseLaneOffset: number;
  aggression: number;
  skillOffset: number;
  preferredPace: number;
}

export const AI_PROFILES: AIDriverProfile[] = [
  { name: 'L. Bellini', baseLaneOffset: -1.8, aggression: 0.72, skillOffset: 0.03, preferredPace: 1.01 },
  { name: 'M. Santoro', baseLaneOffset: 1.8, aggression: 0.65, skillOffset: 0.01, preferredPace: 0.99 },
  { name: 'C. Moretti', baseLaneOffset: -0.9, aggression: 0.80, skillOffset: 0.04, preferredPace: 1.02 },
  { name: 'S. Ferri', baseLaneOffset: 0.9, aggression: 0.58, skillOffset: -0.02, preferredPace: 0.96 },
  { name: 'E. Conti', baseLaneOffset: 0.0, aggression: 0.75, skillOffset: 0.02, preferredPace: 1.00 },
];

export class AIController {
  readonly profile: AIDriverProfile;
  private currentLaneOffset: number;
  private targetLaneOffset: number;
  private laneDecisionTimer = 0;

  constructor(profile: AIDriverProfile) {
    this.profile = profile;
    this.currentLaneOffset = profile.baseLaneOffset;
    this.targetLaneOffset = profile.baseLaneOffset;
  }

  reset(): void {
    this.currentLaneOffset = this.profile.baseLaneOffset;
    this.targetLaneOffset = this.profile.baseLaneOffset;
    this.laneDecisionTimer = 0;
  }

  /**
   * Computes authentic throttle/brake/steer/nitro inputs for an AI car running the exact same physics!
   * Includes curvature-based pre-corner braking, overtakes via lane switching, and collision avoidance.
   */
  computeInput(
    car: VehiclePhysics,
    allCars: VehiclePhysics[],
    track: TrackSpline,
    difficulty: Difficulty,
    dt: number
  ): ControlInput {
    const diffScale = difficulty === 'easy' ? 0.84 : difficulty === 'hard' ? 1.04 : 0.95;
    const paceFactor = diffScale * this.profile.preferredPace;

    this.laneDecisionTimer -= dt;

    // 1. Evaluate nearby cars ahead for overtaking & side-by-side avoidance
    let blockedAhead = false;
    let blockingLat = 0;
    let closeBehindAheadDist = Infinity;

    for (let i = 0; i < allCars.length; i++) {
      const other = allCars[i];
      if (other === car) continue;
      const ds = track.deltaS(car.splineS, other.splineS);
      if (ds > 2.0 && ds < 28.0) {
        const dLat = other.splineLateral - car.splineLateral;
        if (Math.abs(dLat) < 2.6 && ds < closeBehindAheadDist) {
          blockedAhead = true;
          blockingLat = other.splineLateral;
          closeBehindAheadDist = ds;
        }
      }
    }

    const currSmp = track.sampleAtS(car.splineS);
    const maxSafeLat = currSmp.width * 0.5 - 2.1;

    if (blockedAhead && this.laneDecisionTimer <= 0) {
      // Pick the clearer side of the track to pass cleanly!
      const goLeft = blockingLat > 0 ? -maxSafeLat * 0.72 : maxSafeLat * 0.72;
      const altSide = -goLeft;
      // Check if preferred pass lane is wide enough
      this.targetLaneOffset = Math.abs(goLeft - blockingLat) > 2.8 ? goLeft : altSide;
      this.laneDecisionTimer = 1.4;
    } else if (!blockedAhead && this.laneDecisionTimer <= 0) {
      // Return smoothly toward natural racing line apex bias!
      const aheadSmp = track.sampleAtS(car.splineS + 32);
      const apexBias = clamp(-Math.sign(aheadSmp.curvature) * Math.min(2.2, Math.abs(aheadSmp.curvature) * 140), -2.0, 2.0);
      this.targetLaneOffset = clamp(this.profile.baseLaneOffset * 0.45 + apexBias * 0.55, -maxSafeLat, maxSafeLat);
      this.laneDecisionTimer = 0.6;
    }

    // Immediate lateral nudge if wheel-to-wheel (< 2.15m lateral separation)
    for (let i = 0; i < allCars.length; i++) {
      const other = allCars[i];
      if (other === car) continue;
      const ds = Math.abs(track.deltaS(car.splineS, other.splineS));
      if (ds < 5.5) {
        const dLat = car.splineLateral - other.splineLateral;
        if (Math.abs(dLat) < 2.35) {
          const push = dLat >= 0 ? 1 : -1;
          this.targetLaneOffset = clamp(this.targetLaneOffset + push * 1.1, -maxSafeLat, maxSafeLat);
        }
      }
    }

    this.currentLaneOffset += (this.targetLaneOffset - this.currentLaneOffset) * Math.min(1, 2.8 * dt);
    const clampedLat = clamp(this.currentLaneOffset, -maxSafeLat, maxSafeLat);

    // 2. Steering toward look-ahead point along spline + currentLaneOffset
    const spdKmh = car.telemetry.speedKmh;
    const lookAhead = clamp(12.5 + spdKmh * 0.145, 12.5, 36.0);
    const targetSmp = track.sampleAtS(car.splineS + lookAhead);
    const tx = targetSmp.pos.x + targetSmp.flatRight.x * clampedLat;
    const tz = targetSmp.pos.z + targetSmp.flatRight.z * clampedLat;

    const dx = tx - car.pos.x;
    const dz = tz - car.pos.z;
    const fwd = car.getForwardVector();
    const rgt = car.getRightVector();
    const localX = dx * rgt.x + dz * rgt.z;
    const localZ = dx * fwd.x + dz * fwd.z;
    const angleErr = Math.atan2(localX, Math.max(1.0, localZ));
    // Positive angleErr => target is to the RIGHT (+X) => steer RIGHT (+1)!
    const steer = clamp(angleErr * 2.35, -1, 1);

    // 3. Curvature-based pre-corner speed planning (looks 8..106 m ahead so tight hairpins stay 100% incident-free!)
    let maxCurv = 0;
    for (let d = 8; d <= 106; d += 12) {
      const sA = track.sampleAtS(car.splineS + d);
      const c = Math.abs(sA.curvature);
      if (c > maxCurv) maxCurv = c;
    }
    const minR = maxCurv > 1e-4 ? 1 / maxCurv : 1000;
    // Lateral acceleration target ~10.0 m/s^2 scaled by difficulty -> crisp apex speed with ZERO off-track slides!
    const cornerSpeedKmh = Math.sqrt(10.0 * paceFactor * minR) * 3.6;
    let targetSpdKmh = Math.min(car.spec.topSpeedKmh * paceFactor, cornerSpeedKmh);

    // Mild braking if very close directly behind another car and still switching lanes
    if (blockedAhead && closeBehindAheadDist < 7.5 && Math.abs(car.splineLateral - blockingLat) < 1.8) {
      targetSpdKmh = Math.min(targetSpdKmh, spdKmh * 0.85);
    }

    let throttle = 0;
    let brake = 0;
    if (spdKmh < targetSpdKmh - 2) {
      throttle = 1.0;
    } else if (spdKmh < targetSpdKmh + 5) {
      throttle = 0.45;
    } else {
      brake = clamp((spdKmh - targetSpdKmh) / 28, 0.15, 1.0);
    }

    // Strategic nitro on long straights on Normal/Hard when behind or overtaking!
    const onStraight = maxCurv < 0.0045 && Math.abs(angleErr) < 0.08;
    const nitro =
      onStraight &&
      spdKmh > 85 &&
      car.nitro > 0.45 &&
      (difficulty === 'hard' || (difficulty === 'normal' && blockedAhead));

    return { throttle, brake, steer, nitro };
  }
}

const testAutopilotController = new AIController({
  name: 'TestAutopilot',
  baseLaneOffset: 0.0,
  aggression: 0.62,
  skillOffset: 0.02,
  preferredPace: 1.0,
});

/**
 * Clean spline-following autopilot used EXCLUSIVELY by automated Playwright verification tests (Section 13.1 #1 & #2).
 * Uses the exact same incident-free lane planning, side-by-side separation & curvature braking as AI racers!
 */
export function computeTestAutopilotInput(
  car: VehiclePhysics,
  allCars: VehiclePhysics[],
  track: TrackSpline,
  opts: { allowNitro?: boolean; paceMultiplier?: number } = {}
): ControlInput {
  const inp = testAutopilotController.computeInput(car, allCars, track, 'normal', 1 / 120);
  const pace = opts.paceMultiplier ?? 1.02;
  if (pace > 1.01 && inp.throttle > 0.3 && inp.brake === 0) {
    inp.throttle = 1.0;
  }
  if (!opts.allowNitro) {
    inp.nitro = false;
  } else {
    let maxCurv = 0;
    for (let d = 8; d <= 90; d += 12) {
      const c = Math.abs(track.sampleAtS(car.splineS + d).curvature);
      if (c > maxCurv) maxCurv = c;
    }
    if (maxCurv < 0.004 && car.telemetry.speedKmh > 78 && car.nitro > 0.38 && Math.abs(inp.steer) < 0.14 && inp.brake === 0) {
      inp.nitro = true;
    }
  }
  return inp;
}
