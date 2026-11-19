import * as THREE from 'three';
import { VehiclePhysics } from '../physics/vehiclePhysics';

interface ParticleSlot {
  active: boolean;
  age: number;
  maxAge: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  sizeStart: number;
  sizeEnd: number;
  color: THREE.Color;
}

/**
 * Lightweight pooled GPU Points/Sprite particle system for tire drift smoke, off-asphalt sand/dust clouds,
 * and nitro exhaust sparks — zero runtime GC allocations!
 */
export class ParticleSystem {
  readonly group = new THREE.Group();
  private readonly maxParticles = 240;
  private readonly slots: ParticleSlot[] = [];
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly geom: THREE.BufferGeometry;
  private readonly points: THREE.Points;
  private cursor = 0;

  constructor() {
    this.group.name = 'particle_system';
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    for (let i = 0; i < this.maxParticles; i++) {
      this.slots.push({
        active: false,
        age: 0,
        maxAge: 1,
        pos: new THREE.Vector3(0, -999, 0),
        vel: new THREE.Vector3(),
        sizeStart: 0.4,
        sizeEnd: 1.6,
        color: new THREE.Color(0xd8d8d8),
      });
      this.positions[i * 3 + 1] = -999;
    }

    // Soft circular puff alpha texture for dust/smoke particles
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, 'rgba(255,255,255,0.72)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.32)');
    g.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const puffTex = new THREE.CanvasTexture(c);

    this.geom = new THREE.BufferGeometry();
    this.geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.45,
      map: puffTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(this.geom, mat);
    this.points.frustumCulled = false;
    this.group.add(this.points);
  }

  private emit(
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number,
    maxAge: number,
    colorHex: number
  ): void {
    const s = this.slots[this.cursor];
    this.cursor = (this.cursor + 1) % this.maxParticles;
    s.active = true;
    s.age = 0;
    s.maxAge = maxAge;
    s.pos.set(x, y, z);
    s.vel.set(vx, vy, vz);
    s.color.setHex(colorHex);
  }

  emitForVehicle(car: VehiclePhysics, dt: number): void {
    const tel = car.telemetry;
    if (tel.speedKmh < 12) return;

    const sinY = Math.sin(car.yaw);
    const cosY = Math.cos(car.yaw);
    const fwdX = -sinY, fwdZ = -cosY;
    const rgtX = cosY, rgtZ = -sinY;

    const offRoad = tel.surface === 'sand' || tel.surface === 'gravel' || tel.surface === 'grass';
    const heavySlip = tel.tireSlip > 0.32;

    if (heavySlip || offRoad) {
      const rate = offRoad ? 0.55 : 0.45;
      if (Math.random() < rate) {
        const rearWheels = [car.wheels[2], car.wheels[3]];
        for (const w of rearWheels) {
          const wx = car.pos.x + rgtX * w.mountX - fwdX * w.mountZ;
          const wz = car.pos.z + rgtZ * w.mountX - fwdZ * w.mountZ;
          const col =
            tel.surface === 'sand'
              ? 0xd9c298
              : tel.surface === 'gravel' || tel.surface === 'grass'
              ? 0xbba88a
              : 0xd8dce0;
          this.emit(
            wx + (Math.random() - 0.5) * 0.25,
            car.pos.y + 0.18,
            wz + (Math.random() - 0.5) * 0.25,
            -car.vel.x * 0.12 + (Math.random() - 0.5) * 1.4,
            0.85 + Math.random() * 1.2,
            -car.vel.z * 0.12 + (Math.random() - 0.5) * 1.4,
            offRoad ? 0.85 : 0.72,
            col
          );
        }
      }
    }

    // Nitro exhaust spark embers
    if (tel.nitroActive && Math.random() < 0.75) {
      const ex = car.pos.x - fwdX * 2.35;
      const ez = car.pos.z - fwdZ * 2.35;
      this.emit(
        ex + (Math.random() - 0.5) * 0.6,
        car.pos.y + 0.32,
        ez + (Math.random() - 0.5) * 0.6,
        -fwdX * 8 + (Math.random() - 0.5) * 1.5,
        0.5 + Math.random() * 0.8,
        -fwdZ * 8 + (Math.random() - 0.5) * 1.5,
        0.24,
        0x66e0ff
      );
    }
    void dt;
  }

  update(dt: number): void {
    for (let i = 0; i < this.maxParticles; i++) {
      const s = this.slots[i];
      if (!s.active) {
        this.positions[i * 3 + 1] = -999;
        continue;
      }
      s.age += dt;
      if (s.age >= s.maxAge) {
        s.active = false;
        this.positions[i * 3 + 1] = -999;
        continue;
      }
      s.pos.addScaledVector(s.vel, dt);
      s.vel.multiplyScalar(1 - Math.min(0.9, 1.8 * dt));
      const fade = 1 - s.age / s.maxAge;
      this.positions[i * 3 + 0] = s.pos.x;
      this.positions[i * 3 + 1] = s.pos.y;
      this.positions[i * 3 + 2] = s.pos.z;
      this.colors[i * 3 + 0] = s.color.r * fade;
      this.colors[i * 3 + 1] = s.color.g * fade;
      this.colors[i * 3 + 2] = s.color.b * fade;
    }
    this.geom.attributes.position.needsUpdate = true;
    this.geom.attributes.color.needsUpdate = true;
  }
}
