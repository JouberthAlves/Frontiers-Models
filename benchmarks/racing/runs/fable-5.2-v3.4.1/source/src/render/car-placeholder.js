// Gate P1 only: a temporary drivable stand-in so that road, terrain, colliders and camera can be
// judged before the final car models exist. It is replaced by render/car/ at gate P2 and is not
// used by the delivered game.

import * as THREE from 'three';

export class PlaceholderCar {
  constructor(spec, color = 0xb02a22) {
    this.spec = spec;
    this.group = new THREE.Group();
    const L = spec.length, W = spec.width, H = spec.height;
    // lofted pill: super-elliptic sections along the length
    const NX = 28, NS = 20; const pos = [], idx = [];
    for (let i = 0; i <= NX; i++) {
      const t = i / NX; const x = (t - 0.5) * L;
      const nose = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t)) ) , 0.42);
      const cab = Math.exp(-Math.pow((t - 0.44) / 0.2, 2));
      const hw = (W / 2) * (0.62 + 0.38 * nose), top = 0.36 + (H - 0.36) * (0.5 * nose + 0.5 * cab) , bot = 0.16;
      for (let k = 0; k < NS; k++) {
        const a = (k / NS) * Math.PI * 2; const cx = Math.cos(a), sy = Math.sin(a);
        const z = Math.sign(cx) * Math.pow(Math.abs(cx), 0.55) * hw;
        const yy = (Math.sign(sy) * Math.pow(Math.abs(sy), 0.6) * 0.5 + 0.5) * (top - bot) + bot;
        pos.push(x, yy, z);
      }
    }
    for (let i = 0; i < NX; i++) for (let k = 0; k < NS; k++) {
      const a = i * NS + k, b = i * NS + (k + 1) % NS, c = a + NS, d = b + NS;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    this.body = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.4 }));
    this.body.castShadow = true; this.group.add(this.body);
    this.wheels = [];
    const wg = new THREE.CylinderGeometry(spec.wheelRadius, spec.wheelRadius, spec.wheelWidth, 24); wg.rotateX(Math.PI / 2);
    const wm = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.85 });
    for (let i = 0; i < 4; i++) { const w = new THREE.Mesh(wg, wm); w.castShadow = true; this.wheels.push(w); }
    this.root = new THREE.Group(); this.root.add(this.group); for (const w of this.wheels) this.root.add(w);
    this.group.rotation.order = 'YZX';
  }

  update(v) {
    this.group.position.set(v.x, v.y, v.z);
    this.group.rotation.set(v.roll, -v.heading, v.pitch);
    const R = v.spec.wheelRadius;
    for (let i = 0; i < 4; i++) {
      const w = v.wheels[i], m = this.wheels[i]; const lx = v.wheelPos[i][0], lz = v.wheelPos[i][1];
      const att = v.y + v.pitch * lx - v.roll * lz;
      m.position.set(w.x, Math.max(w.groundY, att - 0.1) + R, w.z);
      m.rotation.order = 'YXZ'; m.rotation.set(0, -(v.heading + w.steer), -w.spin);
    }
  }
}
