import * as THREE from 'three';
import { TrackSpline } from '../world/track';
import { ArcadeVehicle, VehicleInput } from '../physics/vehicle';

export function computeSplineAutopilot(
  vehicle: ArcadeVehicle,
  track: TrackSpline,
  lateralTarget = 0,
  speedScale = 0.88
): VehicleInput {
  const proj = track.projectPointXZ(vehicle.pos.x, vehicle.pos.y, vehicle.pos.z);
  const lookDist = THREE.MathUtils.clamp(12 + vehicle.speedMs * 0.45, 12, 34);
  const ahead = track.sampleAtDistance(proj.s + lookDist);
  const targetPos = ahead.pos.clone().addScaledVector(ahead.right, lateralTarget);

  const toTarget = new THREE.Vector3().subVectors(targetPos, vehicle.pos);
  toTarget.y = 0;
  toTarget.normalize();

  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(vehicle.quat);
  forward.y = 0;
  forward.normalize();

  const left = new THREE.Vector3(1, 0, 0).applyQuaternion(vehicle.quat);
  left.y = 0;
  left.normalize();

  const crossY = forward.z * toTarget.x - forward.x * toTarget.z;
  const dot = THREE.MathUtils.clamp(forward.dot(toTarget), -1, 1);
  // Since left = -right (+X in car space), check dot with left!
  const sideSin = toTarget.dot(left);
  const angleErr = Math.atan2(sideSin, dot);
  void crossY;

  const steer = THREE.MathUtils.clamp(angleErr * 2.4, -1, 1);

  // Target speed from racing line LUT
  const rlIdx = Math.floor((proj.s / track.totalLength) * track.racingLine.length) % track.racingLine.length;
  const rlNext = (rlIdx + 3) % track.racingLine.length;
  const targetSpeed =
    Math.min(track.racingLine[rlIdx].targetSpeed, track.racingLine[rlNext].targetSpeed) * speedScale;

  let throttle = 0;
  let brake = 0;
  if (vehicle.forwardSpeedMs < targetSpeed - 1.5) {
    throttle = THREE.MathUtils.clamp((targetSpeed - vehicle.forwardSpeedMs) / 6.0, 0.25, 1.0);
  } else if (vehicle.forwardSpeedMs > targetSpeed + 2.5) {
    brake = THREE.MathUtils.clamp((vehicle.forwardSpeedMs - targetSpeed) / 10.0, 0.15, 1.0);
  } else {
    throttle = 0.35;
  }

  return { throttle, brake, steer, handbrake: false };
}
