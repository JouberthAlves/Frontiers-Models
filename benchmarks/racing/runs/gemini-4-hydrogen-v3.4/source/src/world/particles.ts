import * as THREE from 'three';
import { ArcadeVehicle } from '../physics/vehicle';

const MAX_PARTICLES = 360;

function createSoftParticleTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.92)');
  grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.48)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class ParticleSystem {
  public readonly points: THREE.Points;
  private readonly positions = new Float32Array(MAX_PARTICLES * 3);
  private readonly colors = new Float32Array(MAX_PARTICLES * 3);
  private readonly velocities = new Float32Array(MAX_PARTICLES * 3);
  private readonly ages = new Float32Array(MAX_PARTICLES);
  private readonly lifetimes = new Float32Array(MAX_PARTICLES);
  private cursor = 0;
  private emitAccum = 0;

  constructor() {
    const geom = new THREE.BufferGeometry();
    this.ages.fill(999);
    this.positions.fill(-9999);

    geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.55,
      map: createSoftParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(geom, mat);
    this.points.name = 'particles';
    this.points.frustumCulled = false;
  }

  private spawn(
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number,
    r: number,
    g: number,
    b: number,
    life: number
  ): void {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % MAX_PARTICLES;
    const i3 = i * 3;
    this.positions[i3] = x;
    this.positions[i3 + 1] = y;
    this.positions[i3 + 2] = z;
    this.velocities[i3] = vx;
    this.velocities[i3 + 1] = vy;
    this.velocities[i3 + 2] = vz;
    this.colors[i3] = r;
    this.colors[i3 + 1] = g;
    this.colors[i3 + 2] = b;
    this.ages[i] = 0;
    this.lifetimes[i] = life;
  }

  public update(dt: number, vehicles: ArcadeVehicle[]): void {
    this.emitAccum += dt;
    const shouldEmit = this.emitAccum >= 0.028;
    if (shouldEmit) this.emitAccum = 0;

    if (shouldEmit) {
      for (let vIdx = 0; vIdx < vehicles.length; vIdx++) {
        const v = vehicles[vIdx];
        const isOffroad = v.surface === 'sand' || v.surface === 'grass';
        const isSkid = v.skidIntensity > 0.28 && !isOffroad;
        if ((!isOffroad && !isSkid) || v.speedMs < 5.0) continue;

        // Rear wheels are indices 2 and 3
        for (let wIdx = 2; wIdx <= 3; wIdx++) {
          const w = v.wheels[wIdx];
          if (!w || !w.grounded) continue;
          const jx = (Math.random() - 0.5) * 0.35;
          const jz = (Math.random() - 0.5) * 0.35;
          if (isOffroad) {
            const isSand = v.surface === 'sand';
            this.spawn(
              w.worldPos.x + jx,
              w.contactY + 0.14,
              w.worldPos.z + jz,
              v.vel.x * 0.18 + (Math.random() - 0.5) * 1.8,
              1.1 + Math.random() * 1.4,
              v.vel.z * 0.18 + (Math.random() - 0.5) * 1.8,
              isSand ? 0.86 : 0.64,
              isSand ? 0.76 : 0.58,
              isSand ? 0.56 : 0.42,
              0.75 + Math.random() * 0.35
            );
          } else {
            this.spawn(
              w.worldPos.x + jx,
              w.contactY + 0.12,
              w.worldPos.z + jz,
              v.vel.x * 0.12 + (Math.random() - 0.5) * 1.2,
              0.8 + Math.random() * 0.9,
              v.vel.z * 0.12 + (Math.random() - 0.5) * 1.2,
              0.86,
              0.87,
              0.89,
              0.58 + Math.random() * 0.25
            );
          }
        }
      }
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (this.ages[i] >= this.lifetimes[i]) continue;
      this.ages[i] += dt;
      const i3 = i * 3;
      if (this.ages[i] >= this.lifetimes[i]) {
        this.positions[i3 + 1] = -9999;
      } else {
        this.positions[i3] += this.velocities[i3] * dt;
        this.positions[i3 + 1] += this.velocities[i3 + 1] * dt;
        this.positions[i3 + 2] += this.velocities[i3 + 2] * dt;
        this.velocities[i3] *= Math.max(0, 1 - 1.8 * dt);
        this.velocities[i3 + 1] = Math.max(0.2, this.velocities[i3 + 1] - 0.7 * dt);
        this.velocities[i3 + 2] *= Math.max(0, 1 - 1.8 * dt);
      }
    }

    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  public clear(): void {
    this.ages.fill(999);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.positions[i * 3 + 1] = -9999;
    }
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
