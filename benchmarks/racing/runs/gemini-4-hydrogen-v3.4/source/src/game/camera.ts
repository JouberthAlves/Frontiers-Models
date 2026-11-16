import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { ArcadeVehicle } from '../physics/vehicle';
import { PhysicsWorld, COLLISION_GROUP_WORLD } from '../physics/world';
import { TerrainField } from '../world/terrain';

export type CameraMode = 'chase' | 'hood';

export class RaceCamera {
  public readonly camera: THREE.PerspectiveCamera;
  public mode: CameraMode = 'chase';
  private readonly currentPos = new THREE.Vector3();
  private readonly currentLook = new THREE.Vector3();
  private initialized = false;
  public cameraIntersections = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(62, aspect, 0.25, 16000);
  }

  public resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public snapToVehicle(vehicle: ArcadeVehicle): void {
    this.initialized = false;
    this.update(vehicle, 0.016, null, null);
  }

  public update(
    vehicle: ArcadeVehicle,
    dt: number,
    physics: PhysicsWorld | null,
    terrain: TerrainField | null
  ): void {
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(vehicle.quat).normalize();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(vehicle.quat).normalize();
    const speedRatio = THREE.MathUtils.clamp(vehicle.speedMs / 62.0, 0, 1);

    if (this.mode === 'hood') {
      const hoodPos = vehicle.pos
        .clone()
        .addScaledVector(up, 0.92)
        .addScaledVector(forward, 0.72);
      const hoodLook = hoodPos.clone().addScaledVector(forward, 30.0).addScaledVector(up, -0.4);
      this.camera.position.copy(hoodPos);
      this.camera.lookAt(hoodLook);
      this.camera.fov = THREE.MathUtils.lerp(64, 76, speedRatio);
      this.camera.updateProjectionMatrix();
      this.initialized = false;
      return;
    }

    // Chase camera: ~6m back, ~1.8m above, horizon in upper third
    const horizFwd = new THREE.Vector3(forward.x, 0, forward.z);
    if (horizFwd.lengthSq() < 1e-4) horizFwd.set(0, 0, 1);
    horizFwd.normalize();

    const chaseDist = THREE.MathUtils.lerp(6.1, 5.5, speedRatio);
    const chaseHeight = 1.85;
    const desiredPos = vehicle.pos
      .clone()
      .addScaledVector(horizFwd, -chaseDist)
      .add(new THREE.Vector3(0, chaseHeight + Math.max(0, -forward.y) * 1.2, 0));

    // Look slightly above the car toward the road ahead so horizon sits cleanly in upper third
    const desiredLook = vehicle.pos
      .clone()
      .addScaledVector(forward, 10.5)
      .add(new THREE.Vector3(0, 1.35, 0));

    if (!this.initialized) {
      this.currentPos.copy(desiredPos);
      this.currentLook.copy(desiredLook);
      this.initialized = true;
    } else {
      const posStiff = 1 - Math.exp(-10.5 * dt);
      const lookStiff = 1 - Math.exp(-15.0 * dt);
      this.currentPos.lerp(desiredPos, posStiff);
      this.currentLook.lerp(desiredLook, lookStiff);
    }

    // Camera collision avoidance against world & terrain
    const pivot = vehicle.pos.clone().add(new THREE.Vector3(0, 1.35, 0));
    const camDir = new THREE.Vector3().subVectors(this.currentPos, pivot);
    const camDist = camDir.length();
    if (physics && camDist > 0.2) {
      const dirN = camDir.clone().divideScalar(camDist);
      const ray = new RAPIER.Ray(
        { x: pivot.x, y: pivot.y, z: pivot.z },
        { x: dirN.x, y: dirN.y, z: dirN.z }
      );
      const hit = physics.world.castRay(
        ray,
        camDist,
        true,
        undefined,
        (COLLISION_GROUP_WORLD << 16) | COLLISION_GROUP_WORLD
      );
      if (hit && hit.timeOfImpact < camDist - 0.15) {
        const safeDist = Math.max(1.8, hit.timeOfImpact - 0.35);
        this.currentPos.copy(pivot).addScaledVector(dirN, safeDist);
      }
    }

    if (terrain) {
      const floorY = terrain.getHeightAt(this.currentPos.x, this.currentPos.z);
      if (this.currentPos.y < floorY + 0.55) {
        this.currentPos.y = floorY + 0.55;
      }
      if (this.currentPos.y < floorY - 0.05) {
        this.cameraIntersections++;
      }
    }

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLook);
    this.camera.fov = THREE.MathUtils.lerp(60, 75, speedRatio);
    this.camera.updateProjectionMatrix();
  }
}
