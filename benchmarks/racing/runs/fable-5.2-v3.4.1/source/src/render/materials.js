// Texture loading and the material factory. Every lit material of the game goes through
// Materials.patch(): it hooks the cascaded sun shadows, the baked terrain shadow, the distance
// fog that matches the sky, and (optionally) packed normal/roughness/AO maps, wind, or
// material-specific shader code.

import * as THREE from 'three';

const TEX_BASE = 'assets/textures/';

// ---------------------------------------------------------------------------------------------
// shader snippets
// ---------------------------------------------------------------------------------------------
const PARS_COMMON = /* glsl */`
varying vec3 vWPos;
uniform vec3 uSunDir;
uniform sampler2D tHorizon;
uniform vec4 uFog;
uniform sampler2D tTerrainShadow;
uniform vec4 uTerrainRect;
uniform float uTime;
uniform float uSkyK;
`;

const VERT_WPOS = /* glsl */`
#include <project_vertex>
{
  vec4 wPosP = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    wPosP = instanceMatrix * wPosP;
  #endif
  vWPos = (modelMatrix * wPosP).xyz;
}
`;

const FRAG_TERRAIN_SUN = /* glsl */`
float terrainSun = 1.0;
{
  vec2 tuv = (vWPos.xz - uTerrainRect.xy) * uTerrainRect.zw;
  if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
    float sh = texture2D(tTerrainShadow, tuv).r;
    terrainSun = smoothstep(sh - 0.3, sh + 1.1, vWPos.y);
  }
}
`;

export const FRAG_FOG = /* glsl */`
{
  vec3 fv = vWPos - cameraPosition; float fd = length(fv); vec3 fdir = fv / max(fd, 1e-3);
  // exponential height fog that only starts in the distance
  float h0 = cameraPosition.y, h1 = vWPos.y; float k = uFog.z;
  float dh = h1 - h0;
  float hterm = abs(dh) > 0.5 ? (exp(-k * max(h0, 0.0)) - exp(-k * max(h1, 0.0))) / (k * dh) : exp(-k * max(h0, 0.0));
  float tau = max(0.0, fd - uFog.x) * uFog.y * clamp(hterm, 0.0, 1.5);
  float sunAmt = max(0.0, dot(fdir, uSunDir));
  tau *= 1.0 + 1.6 * sunAmt * sunAmt;
  float ff = (1.0 - exp(-tau)) * uFog.w;
  vec3 fc = texture2D(tHorizon, vec2(atan(fdir.z, fdir.x) * 0.15915494 + 0.5, 0.5)).rgb * uSkyK;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fc, ff);
}
`;

const FRAG_ROUGH_NRA = /* glsl */`
vec4 nraTex = texture2D( normalMap, vNormalMapUv );
float roughnessFactor = roughness * nraTex.b;
`;
const FRAG_NORMAL_NRA = /* glsl */`
{
  vec3 mapN = vec3( nraTex.xy * 2.0 - 1.0, 0.0 );
  mapN.z = sqrt( max( 0.0, 1.0 - dot( mapN.xy, mapN.xy ) ) );
  mapN.xy *= normalScale;
  normal = normalize( tbn * mapN );
}
`;
const FRAG_AO_NRA = /* glsl */`
{
  float ambientOcclusion = mix( 1.0, nraTex.a, 0.9 );
  reflectedLight.indirectDiffuse *= ambientOcclusion;
  #if defined( USE_ENVMAP ) && defined( STANDARD )
    float dotNVao = saturate( dot( geometryNormal, geometryViewDir ) );
    reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNVao, ambientOcclusion, material.roughness );
  #endif
}
`;

let materialSerial = 0;

// three.js rotates the taps of its shadow filter per pixel with a noise pattern, which suits renderers that
// accumulate frames (temporal anti-aliasing). This one does not: on smooth surfaces (car paint under the shade
// of a tree) the penumbra showed as a checker pattern. Fixed taps, a few more of them, give a clean soft edge.
export const SHADOW_TAPS = 8;
{
  const src = THREE.ShaderChunk.shadowmap_pars_fragment;
  const re = /float phi = interleavedGradientNoise\( gl_FragCoord\.xy \) \* PI2;\s*shadow = \(\s*(?:texture\( shadowMap, vec3\( shadowCoord\.xy \+ vogelDiskSample\( \d, 5, phi \) \* radius, shadowCoord\.z \) \)\s*\+?\s*){5}\) \* 0\.2;/;
  if (re.test(src)) {
    THREE.ShaderChunk.shadowmap_pars_fragment = src.replace(re, `shadow = 0.0;
				for ( int k = 0; k < ${SHADOW_TAPS}; k ++ ) shadow += texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( k, ${SHADOW_TAPS}, 0.6 ) * radius, shadowCoord.z ) );
				shadow /= ${SHADOW_TAPS}.0;`);
  } else console.warn('shadow filter of this three.js build was not recognised: keeping its own');
}

export class Materials {
  constructor(gfx, env) {
    this.gfx = gfx; this.env = env;
    this.sets = new Map();
    this.pending = [];
    this.loaded = 0; this.total = 0;
    this.all = new Set();          // every patched material (for quality changes / audits)
    this.onProgress = null;
    this._lightsChunk = null;
  }

  // ------------------------------------------------------------------------------------------ textures
  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('failed to load ' + url));
      img.src = url;
    });
  }

  _tick() { this.loaded++; if (this.onProgress) this.onProgress(this.loaded, this.total); }

  /**
   * Loads a Poly Haven PBR set: albedo (sRGB) + one packed linear texture (RG = normal xy, B = roughness, A = AO).
   * @returns {Promise<{map:THREE.Texture, nra:THREE.Texture, size:number}>}
   */
  loadSet(id, res = '1k') {
    const key = id + '@' + res;
    if (this.sets.has(key)) return this.sets.get(key).promise;
    this.total += 3;
    const entry = { id, res, map: null, nra: null };
    const base = `${TEX_BASE}${id}/${id}_`;
    entry.promise = (async () => {
      const [dImg, nImg, aImg] = await Promise.all([
        this._loadImage(`${base}diff_${res}.jpg`).then((i) => { this._tick(); return i; }),
        this._loadImage(`${base}nor_gl_${res}.jpg`).then((i) => { this._tick(); return i; }),
        this._loadImage(`${base}arm_${res}.jpg`).then((i) => { this._tick(); return i; }),
      ]);
      const aniso = Math.min(this.gfx.quality.anisotropy, this.gfx.maxAniso);
      const map = new THREE.Texture(dImg);
      map.colorSpace = THREE.SRGBColorSpace; map.wrapS = map.wrapT = THREE.RepeatWrapping; map.anisotropy = aniso;
      map.generateMipmaps = true; map.minFilter = THREE.LinearMipmapLinearFilter; map.needsUpdate = true; map.name = id + '_diff';
      const w = nImg.width, h = nImg.height;
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(nImg, 0, 0); const nd = ctx.getImageData(0, 0, w, h).data;
      ctx.drawImage(aImg, 0, 0, w, h); const ad = ctx.getImageData(0, 0, w, h).data;
      const out = new Uint8Array(w * h * 4);
      for (let i = 0; i < w * h; i++) { const o = i * 4; out[o] = nd[o]; out[o + 1] = nd[o + 1]; out[o + 2] = ad[o + 1]; out[o + 3] = ad[o]; }
      const nra = new THREE.DataTexture(out, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
      nra.colorSpace = THREE.NoColorSpace; nra.wrapS = nra.wrapT = THREE.RepeatWrapping; nra.anisotropy = aniso; nra.flipY = true;
      nra.generateMipmaps = true; nra.minFilter = THREE.LinearMipmapLinearFilter; nra.magFilter = THREE.LinearFilter; nra.needsUpdate = true; nra.name = id + '_nra';
      entry.map = map; entry.nra = nra; entry.size = w;
      return entry;
    })();
    this.sets.set(key, entry);
    this.pending.push(entry.promise);
    return entry.promise;
  }

  set(id, res = '1k') { const e = this.sets.get(id + '@' + res); if (!e || !e.map) throw new Error('texture set not loaded: ' + id); return e; }
  async whenLoaded() { await Promise.all(this.pending); }

  /**
   * Stacks same-sized textures into one 2D array texture (one sampler for many layers).
   * Rows are stored bottom-up so that v behaves like the flipY 2D textures.
   */
  arrayTexture(textures, srgb, size = 1024) {
    const n = textures.length; const data = new Uint8Array(size * size * 4 * n);
    const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    textures.forEach((t, li) => {
      let px;
      if (t.isDataTexture) {
        if (t.image.width !== size) throw new Error('array texture layers must be ' + size + ' px');
        px = t.image.data;
      } else { ctx.drawImage(t.image, 0, 0, size, size); px = ctx.getImageData(0, 0, size, size).data; }
      const base = li * size * size * 4; const row = size * 4;
      for (let y = 0; y < size; y++) data.set(px.subarray(y * row, y * row + row), base + (size - 1 - y) * row);
    });
    const tex = new THREE.DataArrayTexture(data, size, size, n);
    tex.format = THREE.RGBAFormat; tex.type = THREE.UnsignedByteType; tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(this.gfx.quality.anisotropy, this.gfx.maxAniso); tex.needsUpdate = true;
    tex.userData.layerSize = size;
    return tex;
  }

  /** copy of a texture with its own repeat / offset (shares the GPU image) */
  tiled(tex, rx, ry = rx) { const t = tex.clone(); t.repeat.set(rx, ry); t.needsUpdate = true; return t; }

  /** canvas-drawn texture (procedural decals, kerbs, liveries, leaves ...) */
  canvasTexture(size, draw, { srgb = true, repeat = true, height = size, mips = true } = {}) {
    const cv = document.createElement('canvas'); cv.width = size; cv.height = height;
    const ctx = cv.getContext('2d'); draw(ctx, size, height);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = Math.min(this.gfx.quality.anisotropy, this.gfx.maxAniso);
    t.generateMipmaps = mips; t.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter; t.needsUpdate = true;
    return t;
  }

  // ------------------------------------------------------------------------------------------ materials
  /**
   * Standard PBR material from a texture set.
   * @param p {set, res, color, repeat, roughness, metalness, normalScale, side, alphaTest, transparent, physical, ...three params, patch:{}}
   */
  std(p = {}) {
    const { set, res, repeat, patch, physical, ...rest } = p;
    const params = { ...rest };
    let usesNra = false;
    if (set) {
      const s = this.set(set, res || '1k');
      const r = repeat ?? 1;
      params.map = r === 1 ? s.map : this.tiled(s.map, r);
      params.normalMap = r === 1 ? s.nra : this.tiled(s.nra, r);
      if (params.roughness === undefined) params.roughness = 1;
      usesNra = true;
    }
    const mat = physical ? new THREE.MeshPhysicalMaterial(params) : new THREE.MeshStandardMaterial(params);
    return this.patch(mat, { nra: usesNra, ...(patch || {}) });
  }

  _lights() {
    // the (CSM-enhanced) light loop with the baked terrain shadow applied to the sun
    if (!this._lightsChunk || this._lightsSrc !== THREE.ShaderChunk.lights_fragment_begin) {
      this._lightsSrc = THREE.ShaderChunk.lights_fragment_begin;
      this._lightsChunk = this._lightsSrc.replace(/getDirectionalLightInfo\( ([A-Za-z\[\]0-9]+), directLight \);/g, 'getDirectionalLightInfo( $1, directLight ); directLight.color *= terrainSun;');
    }
    return this._lightsChunk;
  }

  /**
   * @param opts {nra:boolean, key:string, uniforms:Object, vertexPars, vertexMain (after begin_vertex), fragmentPars, hooks:[(shader)=>void], fog:boolean, csm:boolean,
   *              sunSpecular:number (scale of the direct specular),
   *              shadowPush:number (scale of the normal offset of the shadow lookup: smooth glossy surfaces that
   *              graze the low sun, like car paint, need more of it than textured ones to stay free of acne)}
   */
  patch(mat, opts = {}) {
    const env = this.env; const self = this;
    const csm = opts.csm !== false && env.csm;
    if (csm) env.csm.setupMaterial(mat);
    const csmHook = csm ? mat.onBeforeCompile : null;
    const key = `p${opts.key || ''}|${opts.nra ? 'n' : ''}|${opts.fog === false ? 'nf' : ''}|${csm ? 'c' : ''}|${opts.sunSpecular ?? ''}|${opts.shadowPush ?? ''}`;
    mat.userData.patchKey = key;
    mat.userData.serial = ++materialSerial;
    mat.onBeforeCompile = function (shader, renderer) {
      if (csmHook) csmHook(shader, renderer);
      Object.assign(shader.uniforms, env.uniforms, opts.uniforms || {});
      // ---- vertex
      let vs = shader.vertexShader;
      vs = vs.replace('#include <common>', `#include <common>\n${PARS_COMMON}\n${opts.vertexPars || ''}`);
      if (opts.vertexMain) vs = vs.replace('#include <begin_vertex>', `#include <begin_vertex>\n${opts.vertexMain}`);
      vs = vs.replace('#include <project_vertex>', VERT_WPOS);
      if (opts.shadowPush) vs = inject(vs, '#include <shadowmap_vertex>', inject(THREE.ShaderChunk.shadowmap_vertex, 'directionalLightShadows[ i ].shadowNormalBias', `directionalLightShadows[ i ].shadowNormalBias * ${Number(opts.shadowPush).toFixed(2)}`));
      shader.vertexShader = vs;
      // ---- fragment
      let fs = shader.fragmentShader;
      fs = fs.replace('#include <common>', `#include <common>\n${PARS_COMMON}\n${opts.fragmentPars || ''}`);
      if (opts.nra) {
        fs = fs.replace('#include <roughnessmap_fragment>', FRAG_ROUGH_NRA);
        fs = fs.replace('#include <normal_fragment_maps>', FRAG_NORMAL_NRA);
        fs = fs.replace('#include <aomap_fragment>', FRAG_AO_NRA);
      }
      if (fs.includes('#include <lights_fragment_begin>')) {
        fs = fs.replace('#include <lights_fragment_begin>', FRAG_TERRAIN_SUN + self._lights());
      }
      // rough, self-shadowing surfaces (foliage, bark) must not light up with the grazing-angle sheen of a
      // smooth dielectric when they are seen against the low sun
      if (opts.sunSpecular !== undefined) fs = fs.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
reflectedLight.directSpecular *= ${Number(opts.sunSpecular).toFixed(3)};`);
      if (opts.fog !== false) fs = fs.replace('#include <fog_fragment>', FRAG_FOG);
      shader.fragmentShader = fs;
      if (opts.hooks) for (const h of opts.hooks) h(shader);
      mat.userData.shader = shader;
    };
    mat.customProgramCacheKey = () => key;
    this.all.add(mat);
    return mat;
  }
}

/** replaces a piece of GLSL and fails loudly if the anchor is missing (three.js internals may change) */
export function inject(src, anchor, replacement) {
  if (!src.includes(anchor)) throw new Error('shader anchor not found: ' + anchor);
  return src.replace(anchor, replacement);
}
