// Sunset environment: CC0 HDRI (sky dome + image-based light), a directional sun in the same
// direction and colour, cascaded shadow maps that follow the camera, a baked terrain shadow
// (the sun never moves) and the distance-fog parameters shared by every material.

import * as THREE from 'three';
import { LAYER_SHADOW, LAYER_MASK } from './gfx.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { CSM } from 'three/addons/csm/CSM.js';
import { DEG } from '../core/math.js';

const SKY_VS = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;               // always on the far plane
}`;
const SKY_FS = /* glsl */`
precision highp float;
varying vec3 vDir;
uniform sampler2D tSky; uniform float uIntensity; uniform float uMax;
uniform sampler2D tHorizon;
void main() {
  vec3 d = normalize(vDir);
  vec2 uv = vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5);
  vec3 c = min(textureGrad(tSky, uv, vec2(0.0), vec2(0.0)).rgb, vec3(uMax));
  // below the horizon the sky fades into the haze colour of that direction (sea / land cover it anyway)
  vec3 hz = texture2D(tHorizon, vec2(uv.x, 0.5)).rgb;
  c = mix(c, hz, smoothstep(0.0, -0.06, d.y));
  gl_FragColor = vec4(c * uIntensity, 1.0);
}`;

export class Environment {
  constructor(gfx, scene, world) {
    this.gfx = gfx; this.scene = scene; this.world = world;
    const sun = world.json.sun;
    this.sunHeading = sun.heading * DEG;
    this.sunElevation = sun.elevation * DEG;
    this.sunDir = new THREE.Vector3();
    this.sunColor = new THREE.Color(1.0, 0.58, 0.28);
    this.sunIntensity = 13.5;
    this.envIntensity = 0.55;
    this.skyIntensity = 0.62;
    // uniforms shared by all patched materials (see materials.js)
    this.uniforms = {
      uSunDir: { value: this.sunDir },
      tHorizon: { value: null },
      uFog: { value: new THREE.Vector4(150, 0.00042, 0.012, 1.0) },     // start (m), density, height falloff, strength
      tTerrainShadow: { value: null },
      uTerrainRect: { value: new THREE.Vector4(0, 0, 1, 1) },           // x0, z0, 1/sizeX, 1/sizeZ
      uTime: { value: 0 },
      uWind: { value: new THREE.Vector4(1, 0, 0.6, 1.0) },              // dir x, dir z, strength, gust
      uSkyK: { value: 0.34 },                                           // sky dome intensity (the fog colour follows it)
    };
  }

  async load(base = 'assets/hdri/', onProgress = () => {}) {
    const meta = this.meta = await (await fetch(base + 'meta.json')).json();
    const loader = new HDRLoader();
    const tex = await new Promise((res, rej) => loader.load(base + meta.file, res, (e) => onProgress(e.total ? e.loaded / e.total : 0), rej));
    onProgress(1);
    const { width: w, height: h, data } = tex.image;
    // --- rotate the panorama (roll its columns) so that its sun sits at the heading given by track.json
    const uTarget = (this.sunHeading / (2 * Math.PI) + 0.5) % 1;
    const shift = ((Math.round((uTarget - meta.sunU) * w) % w) + w) % w;
    if (shift !== 0) {
      const row = new Uint16Array(w * 4);
      for (let y = 0; y < h; y++) {
        const o = y * w * 4; row.set(data.subarray(o, o + w * 4));
        data.set(row.subarray(0, (w - shift) * 4), o + shift * 4);
        data.set(row.subarray((w - shift) * 4), o);
      }
    }
    // golden-hour grade of the panorama itself: warmer and a little deeper around the sun, so that the sky
    // dome, the image-based light and the fog colour all carry the same peach haze
    {
      const lut0 = new Float32Array(65536); for (let i = 0; i < 65536; i++) lut0[i] = THREE.DataUtils.fromHalfFloat(i);
      const sunX = Math.round(uTarget * w), sunY = Math.round((0.5 - meta.sunElevationDeg / 180) * h);
      const spanX = Math.round(w * 0.3), y0 = Math.round(h * 0.12), y1 = Math.round(h * 0.56);
      for (let y = y0; y < y1; y++) {
        const el = (0.5 - (y + 0.5) / h) * Math.PI;
        for (let dx = -spanX; dx <= spanX; dx++) {
          const x = ((sunX + dx) % w + w) % w; const az = dx / w * 2 * Math.PI;
          // angular distance to the sun (small-angle form is enough for a soft weight)
          const dEl = el - this.sunElevationFromMeta(meta), ang = Math.hypot(az * Math.cos(el), dEl);
          const k = Math.exp(-ang * ang / 0.42) * (1 - Math.max(0, Math.min(1, (el - 0.9) / 0.4)));
          if (k < 0.01) continue;
          const o = (y * w + x) * 4;
          const r = lut0[data[o]], g = lut0[data[o + 1]], b = lut0[data[o + 2]];
          data[o] = THREE.DataUtils.toHalfFloat(Math.min(60000, r * (1 + 0.22 * k)));
          data[o + 1] = THREE.DataUtils.toHalfFloat(Math.min(60000, g * (1 - 0.1 * k)));
          data[o + 2] = THREE.DataUtils.toHalfFloat(Math.min(60000, b * (1 - 0.38 * k)));
        }
      }
    }
    this.sunElevation = meta.sunElevationDeg * DEG;
    const ce = Math.cos(this.sunElevation);
    this.sunDir.set(ce * Math.cos(this.sunHeading), Math.sin(this.sunElevation), ce * Math.sin(this.sunHeading)).normalize();
    this.gfx.sunDir.copy(this.sunDir);
    tex.mapping = THREE.EquirectangularReflectionMapping; tex.wrapS = THREE.RepeatWrapping; tex.needsUpdate = true;
    this.skyTexture = tex;

    // --- small float copy for lighting: the sun disc is clamped so reflections do not fire-fly
    const lut = new Float32Array(65536);
    for (let i = 0; i < 65536; i++) lut[i] = THREE.DataUtils.fromHalfFloat(i);
    const SW = 1024, SH = 512, fx = w / SW, fy = h / SH;
    const small = new Float32Array(SW * SH * 4);
    const CLAMP = 48;
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
      let r = 0, g = 0, b = 0;
      for (let dy = 0; dy < fy; dy++) for (let dx = 0; dx < fx; dx++) {
        const o = ((y * fy + dy) * w + x * fx + dx) * 4;
        r += Math.min(lut[data[o]], CLAMP); g += Math.min(lut[data[o + 1]], CLAMP); b += Math.min(lut[data[o + 2]], CLAMP);
      }
      const k = 1 / (fx * fy); const o = (y * SW + x) * 4;
      small[o] = r * k; small[o + 1] = g * k; small[o + 2] = b * k; small[o + 3] = 1;
    }
    const smallHalf = new Uint16Array(small.length);
    for (let i = 0; i < small.length; i++) smallHalf[i] = THREE.DataUtils.toHalfFloat(small[i]);
    const smallTex = new THREE.DataTexture(smallHalf, SW, SH, THREE.RGBAFormat, THREE.HalfFloatType);
    smallTex.mapping = THREE.EquirectangularReflectionMapping; smallTex.colorSpace = THREE.LinearSRGBColorSpace;
    smallTex.minFilter = THREE.LinearFilter; smallTex.magFilter = THREE.LinearFilter; smallTex.flipY = true; smallTex.wrapS = THREE.RepeatWrapping;
    smallTex.needsUpdate = true;
    this.skySmall = smallTex;
    const pmrem = new THREE.PMREMGenerator(this.gfx.renderer);
    this.envRT = pmrem.fromEquirectangular(smallTex);
    pmrem.dispose();
    this.scene.environment = this.envRT.texture;
    this.scene.environmentIntensity = this.envIntensity;

    // --- haze colour per direction: average of the band just above the horizon, used by the fog
    const HW = 256; const hz = new Float32Array(HW * 4);
    // image rows: flipY = true means row 0 of the data is the bottom of the panorama? HDR data is stored top row first
    // and uploaded flipped, so texture v = 1 is data row 0 (zenith). Elevation e maps to row (0.5 - e/180deg) * SH.
    const r0 = Math.floor((0.5 - 5.5 / 180) * SH), r1 = Math.floor((0.5 - 0.3 / 180) * SH);
    for (let x = 0; x < HW; x++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = r0; y <= r1; y++) for (let dx = -6; dx < SW / HW + 6; dx++) {
        const xx = ((x * (SW / HW) + dx) % SW + SW) % SW; const o = (y * SW + xx) * 4;
        r += Math.min(small[o], 3.2); g += Math.min(small[o + 1], 3.2); b += Math.min(small[o + 2], 3.2); n++;
      }
      hz[x * 4] = r / n; hz[x * 4 + 1] = g / n; hz[x * 4 + 2] = b / n; hz[x * 4 + 3] = 1;
    }
    this.horizonData = hz;
    const hzHalf = new Uint16Array(hz.length); for (let i = 0; i < hz.length; i++) hzHalf[i] = THREE.DataUtils.toHalfFloat(hz[i]);
    const hzTex = new THREE.DataTexture(hzHalf, HW, 1, THREE.RGBAFormat, THREE.HalfFloatType);
    hzTex.wrapS = THREE.RepeatWrapping; hzTex.minFilter = THREE.LinearFilter; hzTex.magFilter = THREE.LinearFilter; hzTex.needsUpdate = true;
    this.uniforms.tHorizon.value = hzTex;

    // --- sky dome
    const geo = new THREE.SphereGeometry(1, 48, 24);
    this.skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, depthTest: true, fog: false, toneMapped: false,
      uniforms: { tSky: { value: tex }, uIntensity: this.uniforms.uSkyK, uMax: { value: 320 }, tHorizon: this.uniforms.tHorizon },
    });
    this.sky = new THREE.Mesh(geo, this.skyMat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -1000; this.sky.name = 'sky';
    this.sky.userData.noAudit = true;
    this.scene.add(this.sky);

    // --- sun colour: warm aureole of the panorama, a little desaturated so that lit surfaces keep their hue
    const a = meta.sunAureoleRGB, g = meta.sunGlowRGB;
    const mx = (c) => Math.max(c[0], c[1], c[2]);
    const mixc = [0, 1, 2].map((i) => 0.45 * a[i] / mx(a) + 0.55 * g[i] / mx(g));
    this.sunColor.setRGB(mixc[0], mixc[1], mixc[2]);
    this.gfx.mats.final.uniforms.uSunColor.value.copy(this.sunColor);
    this._bakeTerrainShadow();
    return this;
  }

  sunElevationFromMeta(meta) { return meta.sunElevationDeg * DEG; }

  /** cascaded shadow maps around a fixed-FOV proxy of the game camera (stable when the FOV breathes with speed) */
  initShadows(camera) {
    const q = this.gfx.quality;
    this.proxyCam = new THREE.PerspectiveCamera(75, camera.aspect, camera.near, camera.far);
    this.csm = new CSM({
      camera: this.proxyCam, parent: this.scene, cascades: 3, maxFar: q.shadowFar, mode: 'custom',
      customSplitsCallback: (n, near, far, target) => { for (const b of this.gfx.quality.shadowBreaks) target.push(b); },
      shadowMapSize: q.shadowSize, lightDirection: this.sunDir.clone().negate(), lightIntensity: this.sunIntensity,
      lightNear: 1, lightFar: 3200, lightMargin: 520, shadowBias: -0.00004,
    });
    this.csm.fade = true;
    this.shadowRefresh = 3;
    this._applyShadowSettings();
    this.csm.updateFrustums();
    return this.csm;
  }

  _applyShadowSettings() {
    const q = this.gfx.quality; const nb = [0.035, 0.1, 0.34];
    this.csm.lights.forEach((l, i) => {
      l.color.copy(this.sunColor); l.intensity = this.sunIntensity;
      l.shadow.normalBias = nb[i] * (2048 / q.shadowSize); l.shadow.radius = 1.6;
      if (l.shadow.mapSize.x !== q.shadowSize) { l.shadow.mapSize.set(q.shadowSize, q.shadowSize); if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; } }
      l.userData.noAudit = true; l.layers.enable(LAYER_SHADOW); l.layers.enable(LAYER_MASK);
    });
    this.csm.maxFar = q.shadowFar;
  }

  onQualityChanged() {
    if (!this.csm) return;
    this._applyShadowSettings(); this.csm.updateFrustums();
  }

  update(camera, dt) {
    this.uniforms.uTime.value += dt;
    if (this.sky) { this.sky.position.copy(camera.position); this.sky.scale.setScalar(camera.far * 0.9); }
    if (this.csm) {
      const p = this.proxyCam;
      if (p.aspect !== camera.aspect || p.near !== camera.near) { p.aspect = camera.aspect; p.near = camera.near; p.far = camera.far; p.updateProjectionMatrix(); this.csm.updateFrustums(); }
      p.position.copy(camera.position); p.quaternion.copy(camera.quaternion); p.updateMatrixWorld(true);
      this.csm.update();
      // the near cascade is redrawn every frame, the two far ones on alternate frames (each keeps the
      // matrix it was rendered with, so a one-frame-old map stays consistent)
      this.shadowFrame = (this.shadowFrame || 0) + 1; const all = this.shadowRefresh > 0; if (all) this.shadowRefresh--;
      this.csm.lights.forEach((l, i) => { l.shadow.autoUpdate = false; l.shadow.needsUpdate = all || i === 0 || (this.shadowFrame + i) % 2 === 0; });
    }
  }

  /**
   * The sun is fixed, so the shadow that the terrain casts on itself and on everything standing on it
   * is baked once: for every height-field node, the height below which a point is in the shadow of the
   * land between it and the sun. One sweep over the grid, column by column, away from the sun.
   */
  _bakeTerrainShadow() {
    const t = this.world.terrain; const nx = t.nx, nz = t.nz, cell = t.cell, H = t.h;
    const S = new Float32Array(nx * nz);
    const lx = Math.cos(this.sunHeading), lz = Math.sin(this.sunHeading); // horizontal direction towards the sun
    const tanE = Math.tan(this.sunElevation);
    const alongX = Math.abs(lx) >= Math.abs(lz);
    const n1 = alongX ? nx : nz, n2 = alongX ? nz : nx;
    const major = alongX ? lx : lz, minor = alongX ? lz : lx;
    const dir = major > 0 ? -1 : 1;                 // sweep direction: away from the sun
    const stepLen = cell / Math.abs(major);         // distance travelled per column
    const shift = minor * stepLen / cell;           // fractional offset (in cells) of the upstream sample
    const drop = stepLen * tanE;
    const idx = (a, b) => (alongX ? b * nx + a : a * nx + b);
    for (let q = 0; q < n1; q++) {
      const a = dir > 0 ? q : n1 - 1 - q;
      const up = a - dir;                            // column towards the sun
      for (let b = 0; b < n2; b++) {
        if (up < 0 || up >= n1) { S[idx(a, b)] = -1e4; continue; }
        const fb = b + shift; const b0 = Math.floor(fb), fr = fb - b0;
        const c0 = Math.min(n2 - 1, Math.max(0, b0)), c1 = Math.min(n2 - 1, Math.max(0, b0 + 1));
        const i0 = idx(up, c0), i1 = idx(up, c1);
        const v0 = Math.max(H[i0], S[i0]), v1 = Math.max(H[i1], S[i1]);
        S[idx(a, b)] = v0 + (v1 - v0) * fr - drop;
      }
    }
    this.terrainShadow = S;
    const half = new Uint16Array(nx * nz);
    for (let i = 0; i < S.length; i++) half[i] = THREE.DataUtils.toHalfFloat(Math.max(-200, Math.min(900, S[i])));
    const tex = new THREE.DataTexture(half, nx, nz, THREE.RedFormat, THREE.HalfFloatType);
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true;
    this.uniforms.tTerrainShadow.value = tex;
    // texel centres sit on the height-field nodes
    this.uniforms.uTerrainRect.value.set(t.x0 - 0.5 * cell, t.z0 - 0.5 * cell, 1 / (nx * cell), 1 / (nz * cell));
  }

  /** 0..1 sun visibility of a world point with respect to the baked terrain shadow (CPU side, for gameplay / audio) */
  sunAt(x, y, z) {
    const t = this.world.terrain; if (!this.terrainShadow || !t.inBounds(x, z)) return 1;
    const ix = Math.min(t.nx - 1, Math.max(0, Math.round((x - t.x0) / t.cell))), iz = Math.min(t.nz - 1, Math.max(0, Math.round((z - t.z0) / t.cell)));
    const s = this.terrainShadow[iz * t.nx + ix];
    return Math.min(1, Math.max(0, (y - s + 0.4) / 0.8));
  }
}
