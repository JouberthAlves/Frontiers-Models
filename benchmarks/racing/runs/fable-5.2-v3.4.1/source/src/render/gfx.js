// Renderer, quality presets and the HDR post-processing chain.
//   scene (HDR, MSAA) -> [AO] -> composite (AO + camera motion blur, cars masked) -> bloom / sun shafts
//   -> final (flare, AgX tone mapping, grade, vignette, sRGB)

import * as THREE from 'three';
import { VS_FULLSCREEN, FS_AO, FS_AO_BLUR, FS_COMPOSITE, FS_BLOOM_DOWN, FS_BLOOM_UP, FS_SHAFTS, FS_FINAL, FS_METER, FS_COPY } from './post-shaders.js';

export const LAYER_DEFAULT = 0;
export const LAYER_MASK = 2;      // cars: excluded from the motion blur
export const LAYER_NOREFLECT = 3; // objects skipped by the reflection probe
export const LAYER_SHADOW = 5;    // shadow casters (see shadow-proxy.js): the only layer the shadow pass renders

export const QUALITY = {
  high: {
    id: 'high', name: 'Alta', scale: 1.0, msaa: 4, shadowSize: 2048, shadowFar: 380, shadowBreaks: [0.085, 0.3, 1.0],
    ao: true, motionBlur: true, shafts: true, flare: true, fxaa: false, bloomLevels: 5,
    probe: true, probeSize: 256, vegDistance: 1.0, propDistance: 1.0, grass: 1.0, anisotropy: 8, terrainLod: 1.0, particles: 1.0,
  },
  low: {
    id: 'low', name: 'Baixa', scale: 0.7, msaa: 0, shadowSize: 1024, shadowFar: 170, shadowBreaks: [0.16, 0.45, 1.0],
    ao: false, motionBlur: false, shafts: false, flare: false, fxaa: true, bloomLevels: 4,
    probe: false, probeSize: 128, vegDistance: 0.6, propDistance: 0.7, grass: 0.45, anisotropy: 4, terrainLod: 0.6, particles: 0.5,
  },
};

// The renderer's own draw order (group, render order, material, depth) with comparators that only return small
// integers: the fractional difference of two depths is a new heap number on every comparison of every sort.
function opaqueSort(a, b) {
  if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
  if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
  if (a.material.id !== b.material.id) return a.material.id - b.material.id;
  if (a.materialVariant !== b.materialVariant) return a.materialVariant - b.materialVariant;
  if (a.z !== b.z) return a.z < b.z ? -1 : 1;
  return a.id - b.id;
}
function transparentSort(a, b) {
  if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
  if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
  if (a.z !== b.z) return a.z < b.z ? 1 : -1;
  return a.id - b.id;
}

function makeRT(w, h, opts = {}) {
  const rt = new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
    type: opts.type ?? THREE.HalfFloatType, format: opts.format ?? THREE.RGBAFormat,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: !!opts.depth, stencilBuffer: false,
    samples: opts.samples || 0, generateMipmaps: false,
  });
  if (opts.depthTexture) {
    rt.depthTexture = new THREE.DepthTexture(w, h);
    rt.depthTexture.type = THREE.UnsignedIntType; rt.depthTexture.format = THREE.DepthFormat;
    rt.depthTexture.minFilter = THREE.NearestFilter; rt.depthTexture.magFilter = THREE.NearestFilter;
  }
  rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
  return rt;
}

function pass(fragmentShader, uniforms) {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3, vertexShader: VS_FULLSCREEN, fragmentShader, uniforms,
    depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending,
  });
}

export class Gfx {
  constructor(canvas, qualityId = 'high') {
    this.canvas = canvas;
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(1);
    renderer.setOpaqueSort(opaqueSort); renderer.setTransparentSort(transparentSort);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.info.autoReset = false;
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 1);
    const gl = renderer.getContext();
    this.gl = gl;
    this.gpu = this._gpuInfo(gl);
    this.maxAniso = renderer.capabilities.getMaxAnisotropy();
    this.quality = QUALITY[qualityId] || QUALITY.high;

    // fullscreen triangle
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    this.fsMesh = new THREE.Mesh(geo, null); this.fsMesh.frustumCulled = false;
    this.fsScene = new THREE.Scene(); this.fsScene.add(this.fsMesh);
    this.fsCam = new THREE.Camera();

    const u = (v) => ({ value: v });
    this.mats = {
      ao: pass(FS_AO, { tDepth: u(null), uNear: u(0.3), uFar: u(9000), uProjInv: u(new THREE.Matrix4()), uTexel: u(new THREE.Vector2()), uRadius: u(0.75), uProjScale: u(1), uFrame: u(0) }),
      aoBlur: pass(FS_AO_BLUR, { tAO: u(null), uDir: u(new THREE.Vector2(1, 0)), uTexel: u(new THREE.Vector2()) }),
      composite: pass(FS_COMPOSITE, {
        tScene: u(null), tAO: u(null), tMask: u(null), tDepth: u(null), uNear: u(0.3), uFar: u(9000), uProjInv: u(new THREE.Matrix4()),
        uReproject: u(new THREE.Matrix4()), uBlur: u(0), uAOStrength: u(0.85), uAOEnabled: u(1), uTexel: u(new THREE.Vector2()),
      }),
      bloomDown: pass(FS_BLOOM_DOWN, { tSrc: u(null), uThreshold: u(1.35), uFirst: u(0), uTexel: u(new THREE.Vector2()) }),
      bloomUp: pass(FS_BLOOM_UP, { tSrc: u(null), tAdd: u(null), uRadius: u(1.0), uTexel: u(new THREE.Vector2()) }),
      shafts: pass(FS_SHAFTS, { tDepth: u(null), tScene: u(null), uSun: u(new THREE.Vector2()), uSunVisible: u(0), uAspect: u(1.78), uTexel: u(new THREE.Vector2()) }),
      final: pass(FS_FINAL, {
        tColor: u(null), tBloom: u(null), tShafts: u(null), uBloom: u(0.055), uShafts: u(0.36), uSunColor: u(new THREE.Color(1, 0.62, 0.3)),
        uSun: u(new THREE.Vector2()), uSunVisible: u(0), uAspect: u(1.78), uFlare: u(0.5), uTime: u(0), uVignette: u(0.22), uGrain: u(0.012),
        uSaturation: u(1.1), uContrast: u(1.0), uFxaa: u(0), uTonemap: u(1), uHue: u(0.5), uTexel: u(new THREE.Vector2()), toneMappingExposure: u(1.0), tMeter: u(null),
      }),
      meter: pass(FS_METER, { tColor: u(null), tPrev: u(null), uTonemap: u(1), uRate: u(1), uBand: u(new THREE.Vector4(0.30, 0.62, 1.6, 1.9)), uGuard: u(0), uTexel: u(new THREE.Vector2()), toneMappingExposure: u(1.0) }),
      copy: pass(FS_COPY, { tSrc: u(null), uTexel: u(new THREE.Vector2()) }),
    };
    this.maskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false });
    this.black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); this.black.needsUpdate = true;
    this.white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1); this.white.needsUpdate = true;
    // light meter: the gain lives in a single texel that is eased from frame to frame (two targets, swapped)
    this.meterRT = [makeRT(1, 1), makeRT(1, 1)]; this.meterIdx = 0; this.meterReady = false; this.autoExposure = true;

    this.exposure = 0.86;      // ACES filmic
    this.exposureScale = 1;    // art-directed per place (see Game.renderFrame)
    // brightest channel the middle of the frame may reach before the meter holds its gain back; 0 = off. Off: on
    // this lap it would leave the lower hairpin (a sunlit car in front of a hillside in shadow) too dark as a whole
    this.subjectGuard = 0;
    this.shaftScale = 1;
    this.sunDir = new THREE.Vector3(0, 1, 0);
    this.prevViewProj = new THREE.Matrix4(); this.hasPrev = false; this.cut = true;
    this._m1 = new THREE.Matrix4(); this._m2 = new THREE.Matrix4(); this._v = new THREE.Vector3(); this._v2 = new THREE.Vector3();
    this.frame = 0; this.time = 0;
    this.stats = { calls: 0, triangles: 0, shadowCalls: 0 };
    this.hudEnabled = true;
    this.width = 0; this.height = 0;
    this.resize(canvas.clientWidth || 1280, canvas.clientHeight || 720);
  }

  _gpuInfo(gl) {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE), maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
    };
  }

  setQuality(id) {
    const q = QUALITY[id] || QUALITY.high;
    if (q === this.quality && this.rt) return;
    this.quality = q;
    this._allocate();
    if (this.onQuality) this.onQuality(q);
  }

  resize(w, h) {
    w = Math.max(2, Math.floor(w)); h = Math.max(2, Math.floor(h));
    if (w === this.width && h === this.height && this.rt) return;
    this.width = w; this.height = h;
    this.renderer.setSize(w, h, false);
    this._allocate();
  }

  _allocate() {
    const q = this.quality;
    if (this.rt) for (const k of Object.keys(this.rt)) { const r = this.rt[k]; if (Array.isArray(r)) r.forEach((x) => x.dispose()); else r.dispose(); }
    const W = Math.max(2, Math.round(this.width * q.scale)), H = Math.max(2, Math.round(this.height * q.scale));
    this.iw = W; this.ih = H;
    const rt = this.rt = {};
    rt.scene = makeRT(W, H, { samples: q.msaa, depth: true, depthTexture: true });
    rt.mask = makeRT(W >> 1, H >> 1, { type: THREE.UnsignedByteType, depth: true });
    rt.ao = makeRT(W >> 1, H >> 1, { type: THREE.UnsignedByteType }); rt.aoB = makeRT(W >> 1, H >> 1, { type: THREE.UnsignedByteType });
    rt.comp = makeRT(W, H);
    rt.shafts = makeRT(W >> 2, H >> 2, { type: THREE.UnsignedByteType });
    rt.down = []; rt.up = [];
    for (let i = 0; i < q.bloomLevels; i++) {
      const w = Math.max(2, W >> (i + 1)), h = Math.max(2, H >> (i + 1));
      rt.down.push(makeRT(w, h)); if (i < q.bloomLevels - 1) rt.up.push(makeRT(w, h));
    }
    this.cut = true;
  }

  /**
   * Updates the shadow maps that are due (see Environment.update). The scene is rendered with a camera
   * that sees nothing but LAYER_SHADOW and whose frustum is empty, so three.js runs the shadow pass
   * and draws no colour at all. Every other render of the frame reuses these maps.
   */
  renderShadows(scene) {
    const r = this.renderer; if (!r.shadowMap.enabled) return;
    if (!this._shadowCam) {
      this._shadowCam = new THREE.PerspectiveCamera(1, 1, 0.1, 0.11); this._shadowCam.position.set(0, -1e6, 0); this._shadowCam.layers.set(LAYER_SHADOW);
      this._shadowCam.updateMatrixWorld(); this._shadowRT = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false });
    }
    r.shadowMap.needsUpdate = true;
    r.setRenderTarget(this._shadowRT);
    r.render(scene, this._shadowCam);
    r.shadowMap.needsUpdate = false;
  }

  _draw(material, target) {
    this.fsMesh.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.fsScene, this.fsCam);
  }

  /**
   * @param opts {dt, blurScale (0..1), hud}
   */
  render(scene, camera, opts = {}) {
    const r = this.renderer, q = this.quality, rt = this.rt, m = this.mats;
    const dt = opts.dt ?? 1 / 60; const wasCut = this.cut;
    this.frame++; this.time += dt;
    r.info.reset();
    camera.updateMatrixWorld();
    // ---- sun shadows: a pass of their own that only sees the casters on LAYER_SHADOW
    this.renderShadows(scene);
    this.stats.shadowCalls = r.info.render.calls;
    // ---- scene
    r.setRenderTarget(rt.scene);
    r.clear(true, true, false);
    r.render(scene, camera);
    this.stats.calls = r.info.render.calls; this.stats.triangles = r.info.render.triangles;
    // ---- mask of the cars (sharp in the motion blur)
    const doBlur = q.motionBlur && !this.cut && (opts.blurScale ?? 1) > 0.01;
    if (q.motionBlur) {
      const bg = scene.background, om = scene.overrideMaterial, lay = camera.layers.mask;
      scene.background = null; scene.overrideMaterial = this.maskMaterial; camera.layers.set(LAYER_MASK);
      r.setRenderTarget(rt.mask); r.setClearColor(0x000000, 1); r.clear(true, true, false);
      r.render(scene, camera);
      scene.background = bg; scene.overrideMaterial = om; camera.layers.mask = lay;
    }
    // ---- shared uniforms
    const projInv = camera.projectionMatrixInverse;
    const texFull = this._v2.set(1 / this.iw, 1 / this.ih, 0);
    // ---- ambient occlusion
    if (q.ao) {
      const a = m.ao.uniforms;
      a.tDepth.value = rt.scene.depthTexture; a.uNear.value = camera.near; a.uFar.value = camera.far; a.uProjInv.value.copy(projInv);
      a.uTexel.value.set(1 / rt.ao.width, 1 / rt.ao.height);
      a.uProjScale.value = 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      this._draw(m.ao, rt.ao);
      const b = m.aoBlur.uniforms; b.uTexel.value.set(1 / rt.ao.width, 1 / rt.ao.height);
      b.tAO.value = rt.ao.texture; b.uDir.value.set(1, 0); this._draw(m.aoBlur, rt.aoB);
      b.tAO.value = rt.aoB.texture; b.uDir.value.set(0, 1); this._draw(m.aoBlur, rt.ao);
    }
    // ---- composite (AO + motion blur)
    {
      const c = m.composite.uniforms;
      c.tScene.value = rt.scene.texture; c.tDepth.value = rt.scene.depthTexture; c.tAO.value = q.ao ? rt.ao.texture : this.white;
      c.tMask.value = q.motionBlur ? rt.mask.texture : this.black;
      c.uNear.value = camera.near; c.uFar.value = camera.far; c.uProjInv.value.copy(projInv);
      c.uTexel.value.set(texFull.x, texFull.y); c.uAOEnabled.value = q.ao ? 1 : 0;
      const viewProj = this._m1.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      if (doBlur && this.hasPrev) {
        c.uReproject.value.copy(this.prevViewProj).multiply(this._m2.copy(viewProj).invert());
        // shutter of about 1/90 s whatever the frame rate
        c.uBlur.value = (opts.blurScale ?? 1) * Math.min(2, Math.max(0.35, (1 / 90) / Math.max(dt, 1e-3)));
      } else c.uBlur.value = 0;
      this.prevViewProj.copy(viewProj); this.hasPrev = true; this.cut = false;
      this._draw(m.composite, rt.comp);
    }
    // ---- sun position on screen
    const sunP = this._v.copy(camera.position).addScaledVector(this.sunDir, 5000).project(camera);
    const fwd = camera.getWorldDirection(new THREE.Vector3());
    const facing = fwd.dot(this.sunDir);
    const sunUv = { x: sunP.x * 0.5 + 0.5, y: sunP.y * 0.5 + 0.5 };
    const edge = Math.max(Math.abs(sunP.x), Math.abs(sunP.y));
    const sunVisible = facing > 0.05 ? Math.max(0, Math.min(1, (1.9 - edge) / 0.9)) * Math.min(1, (facing - 0.05) * 6) : 0;
    const aspect = this.iw / this.ih;
    // ---- sun shafts
    if (q.shafts) {
      const s = m.shafts.uniforms;
      s.tDepth.value = rt.scene.depthTexture; s.tScene.value = rt.comp.texture; s.uSun.value.set(sunUv.x, sunUv.y); s.uSunVisible.value = sunVisible;
      s.uAspect.value = aspect; s.uTexel.value.set(1 / rt.shafts.width, 1 / rt.shafts.height);
      this._draw(m.shafts, rt.shafts);
    }
    // ---- bloom
    {
      const d = m.bloomDown.uniforms, up = m.bloomUp.uniforms; const n = rt.down.length;
      for (let i = 0; i < n; i++) {
        const src = i === 0 ? rt.comp : rt.down[i - 1];
        d.tSrc.value = src.texture; d.uFirst.value = i === 0 ? 1 : 0; d.uTexel.value.set(1 / src.width, 1 / src.height);
        this._draw(m.bloomDown, rt.down[i]);
      }
      for (let i = n - 2; i >= 0; i--) {
        const src = i === n - 2 ? rt.down[n - 1] : rt.up[i + 1];
        up.tSrc.value = src.texture; up.tAdd.value = rt.down[i].texture; up.uTexel.value.set(1 / src.width, 1 / src.height);
        this._draw(m.bloomUp, rt.up[i]);
      }
    }
    // ---- light meter (after a camera cut the gain is taken at once, otherwise it eases like an eye adapting)
    {
      const a = m.meter.uniforms; const next = 1 - this.meterIdx;
      a.tColor.value = rt.comp.texture; a.tPrev.value = this.meterRT[this.meterIdx].texture; a.uTonemap.value = m.final.uniforms.uTonemap.value;
      a.toneMappingExposure.value = this.exposure * this.exposureScale;
      a.uRate.value = !this.autoExposure ? 1 : (wasCut || !this.meterReady || opts.snapExposure) ? 1 : Math.min(1, dt * 2.2);
      a.uGuard.value = this.autoExposure ? this.subjectGuard : 0.0; a.uBand.value.w = this.autoExposure ? 1.9 : 1.0; a.uBand.value.x = this.autoExposure ? 0.30 : 0.0; a.uBand.value.y = this.autoExposure ? 0.62 : 9.0;
      this._draw(m.meter, this.meterRT[next]); this.meterIdx = next; this.meterReady = true;
      m.final.uniforms.tMeter.value = this.meterRT[next].texture;
    }
    // ---- final
    {
      const f = m.final.uniforms;
      f.tColor.value = rt.comp.texture; f.tBloom.value = rt.up[0].texture; f.tShafts.value = q.shafts ? rt.shafts.texture : this.black;
      f.uSun.value.set(sunUv.x, sunUv.y); f.uSunVisible.value = sunVisible; f.uAspect.value = aspect; f.uFlare.value = q.flare ? 0.5 : 0;
      f.uTime.value = opts.fixedNoise ? 0 : this.time; f.uFxaa.value = q.fxaa ? 1 : 0; f.uTexel.value.set(texFull.x, texFull.y);
      f.toneMappingExposure.value = this.exposure * this.exposureScale;
      f.uShafts.value = 0.36 * this.shaftScale;
      this.renderer.setViewport(0, 0, this.width, this.height);
      this._draw(m.final, null);
    }
    this.sunVisible = sunVisible;
  }

  /** marks a camera cut: no motion blur across it */
  cutCamera() { this.cut = true; }

  /** fraction of the frame covered by sky (depth == far), measured on the scene depth buffer */
  measureSky() {
    // rendered into a small byte target through the copy pass with a depth->mask shader would need
    // another program; reading the mask through the shafts material keeps this dependency-free.
    const r = this.renderer; const W = 240, H = 135;
    if (!this._skyRT) {
      this._skyRT = makeRT(W, H, { type: THREE.UnsignedByteType });
      this._skyMat = pass(/* glsl */`precision highp float; in vec2 vUv; uniform sampler2D tDepth; out vec4 o; void main(){ float d = texture(tDepth, vUv).x; o = vec4(vec3(step(0.99999, d)), 1.0); }`, { tDepth: { value: null } });
      this._skyBuf = new Uint8Array(W * H * 4);
    }
    this._skyMat.uniforms.tDepth.value = this.rt.scene.depthTexture;
    this._draw(this._skyMat, this._skyRT);
    r.readRenderTargetPixels(this._skyRT, 0, 0, W, H, this._skyBuf);
    r.setRenderTarget(null);
    let n = 0; for (let i = 0; i < W * H; i++) if (this._skyBuf[i * 4] > 127) n++;
    return n / (W * H);
  }
}
