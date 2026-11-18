// Tyre smoke, dust and sand kicked up by the wheels: one pool of camera-facing sprites,
// simulated on the CPU (a few hundred at most) and drawn in a single call.

import { mulberry32 } from '../core/rng.js';
import * as THREE from 'three';
import { SURF } from '../world/track.js';
import { LAYER_DETAIL } from './probe.js';

const MAX = 900;
// kind -> [albedo r, g, b, life min, life max, size0, size1, alpha, rise, spread, drag]
const KIND = {
  smoke: [0.80, 0.80, 0.82, 0.9, 1.7, 0.45, 2.7, 0.30, 0.9, 0.55, 1.6],
  dust: [0.47, 0.40, 0.30, 0.9, 1.6, 0.55, 3.2, 0.34, 1.3, 1.1, 1.3],
  grit: [0.52, 0.49, 0.44, 0.8, 1.4, 0.5, 2.8, 0.36, 1.2, 1.2, 1.4],
  sand: [0.66, 0.55, 0.38, 0.55, 1.1, 0.35, 1.9, 0.44, 1.7, 1.5, 2.2],
};

const VS = /* glsl */`
attribute vec4 aData;      // size (m), alpha, rotation, seed
attribute vec3 aColor;
uniform float uScale; uniform float uMaxSize;
varying float vAlpha; varying vec3 vColor; varying float vRot; varying float vSeed;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(0.05, -mv.z);
  gl_PointSize = min(uMaxSize, aData.x * uScale / dist);
  // a puff the camera drives into fades instead of filling the frame
  vAlpha = aData.y * smoothstep(0.7, 3.2, dist);
  vColor = aColor; vRot = aData.z; vSeed = aData.w;
}`;
const FS = /* glsl */`
precision highp float;
varying float vAlpha; varying vec3 vColor; varying float vRot; varying float vSeed;
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float c = cos(vRot), s = sin(vRot); vec2 q = mat2(c, -s, s, c) * p;
  float n = vn(q * 2.1 + vSeed * 31.0) * 0.62 + vn(q * 4.7 + vSeed * 17.0) * 0.38;
  float r = length(p) + (n - 0.5) * 0.62;
  float a = smoothstep(1.0, 0.18, r) * vAlpha * (0.7 + 0.5 * n);
  if (a < 0.004) discard;
  // a hint of volume: the top of the puff catches more light than its base
  vec3 col = vColor * (0.82 + 0.3 * (0.5 - p.y) + 0.16 * (n - 0.5));
  gl_FragColor = vec4(col, a);
}`;

export class Particles {
  constructor(game) {
    this.rand = mulberry32(977);     // own random sequence, restarted by clear(): the same puff in every capture
    this.game = game; this.n = 0; this.head = 0; this.alive = 0;
    this.px = new Float32Array(MAX); this.py = new Float32Array(MAX); this.pz = new Float32Array(MAX);
    this.vx = new Float32Array(MAX); this.vy = new Float32Array(MAX); this.vz = new Float32Array(MAX);
    this.age = new Float32Array(MAX).fill(1e9); this.life = new Float32Array(MAX).fill(1); this.kind = new Array(MAX).fill(null);
    this.rot = new Float32Array(MAX); this.rotV = new Float32Array(MAX); this.seed = new Float32Array(MAX); this.lit = new Float32Array(MAX);
    const geo = this.geometry = new THREE.BufferGeometry();
    this.aPos = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3); this.aData = new THREE.BufferAttribute(new Float32Array(MAX * 4), 4); this.aCol = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    for (const a of [this.aPos, this.aData, this.aCol]) a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.aPos); geo.setAttribute('aData', this.aData); geo.setAttribute('aColor', this.aCol); geo.setDrawRange(0, 0);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VS, fragmentShader: FS, uniforms: { uScale: { value: 500 }, uMaxSize: { value: 600 } },
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending, toneMapped: false,
    });
    this.points = new THREE.Points(geo, this.material); this.points.frustumCulled = false; this.points.renderOrder = 20; this.points.name = 'particles';
    this.points.layers.set(LAYER_DETAIL); this.points.matrixAutoUpdate = false;
    this.acc = new Float32Array(24);      // emission remainder per car wheel (6 cars x 4)
    this.stats = { alive: 0, emitted: 0 };
    // light of the scene on a matt puff: low sun plus sky (linear, same scale as the lit surfaces)
    const env = game.env; const sun = env.sunColor; const k = env.sunIntensity / Math.PI * 0.42;
    this.sun = [sun.r * k, sun.g * k, sun.b * k]; this.sky = [0.34, 0.36, 0.42];
  }

  clear() { this.rand = mulberry32(977); this.age.fill(1e9); this.alive = 0; this.geometry.setDrawRange(0, 0); this.acc.fill(0); }

  _emit(kind, x, y, z, vx, vy, vz, lit) {
    const i = this.head; this.head = (this.head + 1) % MAX; const K = KIND[kind];
    this.px[i] = x; this.py[i] = y; this.pz[i] = z; this.vx[i] = vx; this.vy[i] = vy; this.vz[i] = vz;
    this.age[i] = 0; this.life[i] = K[3] + this.rand() * (K[4] - K[3]); this.kind[i] = K;
    this.rot[i] = this.rand() * 6.283; this.rotV[i] = (this.rand() - 0.5) * 1.6; this.seed[i] = this.rand(); this.lit[i] = lit;
    this.stats.emitted++;
  }

  /** @param dt frame time (s); emission follows the simulated cars, so it stops with the simulation */
  update(dt, camera, quality, simulating) {
    const g = this.game; const rate = quality.particles ?? 1; const cx = camera.position.x, cz = camera.position.z;
    if (simulating && dt > 0) {
      for (const car of g.cars) {
        const v = car.vehicle; if (!car.visual.root.visible || v.frozen) continue;
        if (Math.hypot(v.x - cx, v.z - cz) > 110) continue;
        const sp = v.speed; if (sp < 2.5) { if (!(v.input.throttle > 0.6)) continue; }
        // shade of the place: the village street and the wood lie in shadow at this hour
        const zone = g.world.track.zoneIndexAt(v.s); const lit = zone === 2 ? 0.22 : zone === 3 ? 0.3 : 1.0;
        const vxw = v.vxWorld, vzw = v.vzWorld;
        for (let w = 0; w < 4; w++) {
          const wh = v.wheels[w]; if (!wh.contact) continue;
          let kind = null, per = 0;
          const slide = Math.max(wh.skid, Math.min(1, (wh.slipLong || 0) * 2.2));
          if (wh.surf === SURF.SAND) { kind = 'sand'; per = (16 + 60 * slide) * Math.min(1, sp / 16); }
          else if (wh.surf === SURF.GRASS) { kind = 'dust'; per = (7 + 46 * slide) * Math.min(1, sp / 20); }
          else if (wh.surf === SURF.GRAVEL) { kind = 'grit'; per = (14 + 56 * slide) * Math.min(1, sp / 18); }
          else if (slide > 0.32) { kind = 'smoke'; per = 62 * (slide - 0.32) / 0.68 * (wh.surf === SURF.KERB ? 0.5 : 1); }
          if (!kind) continue;
          const k = car.index * 4 + w; this.acc[k] += per * rate * dt;
          const K = KIND[kind];
          while (this.acc[k] >= 1) {
            this.acc[k] -= 1; const j = this.rand();
            this._emit(kind, wh.x - vxw * dt * j + (this.rand() - 0.5) * 0.25, wh.groundY + 0.12 + this.rand() * 0.15, wh.z - vzw * dt * j + (this.rand() - 0.5) * 0.25,
              vxw * (kind === 'smoke' ? 0.1 : 0.22) + (this.rand() - 0.5) * K[9] * 2, K[8] * (0.5 + this.rand()), vzw * (kind === 'smoke' ? 0.1 : 0.22) + (this.rand() - 0.5) * K[9] * 2, lit);
          }
        }
      }
    }
    // integrate and pack the live ones
    const P = this.aPos.array, D = this.aData.array, C = this.aCol.array; let n = 0; const wind = g.env.uniforms.uWind.value;
    for (let i = 0; i < MAX; i++) {
      if (this.age[i] >= this.life[i]) continue;
      if (simulating) {
        const K = this.kind[i]; this.age[i] += dt; if (this.age[i] >= this.life[i]) continue;
        const dr = Math.exp(-K[10] * dt);
        this.vx[i] = this.vx[i] * dr + wind.x * 0.35 * dt; this.vz[i] = this.vz[i] * dr + wind.y * 0.35 * dt; this.vy[i] = this.vy[i] * dr + 0.25 * dt;
        this.px[i] += this.vx[i] * dt; this.py[i] += this.vy[i] * dt; this.pz[i] += this.vz[i] * dt; this.rot[i] += this.rotV[i] * dt;
      }
      const K = this.kind[i]; const t = this.age[i] / this.life[i];
      P[n * 3] = this.px[i]; P[n * 3 + 1] = this.py[i]; P[n * 3 + 2] = this.pz[i];
      const grow = 1 - (1 - t) * (1 - t);
      D[n * 4] = K[5] + (K[6] - K[5]) * grow; D[n * 4 + 1] = K[7] * Math.min(1, t * 9) * (1 - t) * (1 - t); D[n * 4 + 2] = this.rot[i]; D[n * 4 + 3] = this.seed[i];
      const L = this.lit[i];
      C[n * 3] = K[0] * (this.sky[0] + this.sun[0] * L); C[n * 3 + 1] = K[1] * (this.sky[1] + this.sun[1] * L); C[n * 3 + 2] = K[2] * (this.sky[2] + this.sun[2] * L);
      n++;
    }
    this.alive = n; this.stats.alive = n;
    this.geometry.setDrawRange(0, n);
    if (n) { this.aPos.needsUpdate = true; this.aData.needsUpdate = true; this.aCol.needsUpdate = true; }
    const u = this.material.uniforms; u.uScale.value = g.gfx.ih / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)); u.uMaxSize.value = g.gfx.ih * 0.7;
  }
}
