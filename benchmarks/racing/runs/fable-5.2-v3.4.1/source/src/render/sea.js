// The sea: a polar mesh that follows the camera out to the horizon. Gerstner waves in several
// frequencies (damped where the water gets shallow), sky and sun reflection with Fresnel, colour
// and opacity from the real water depth (the terrain height field), animated foam along the
// beach and around rocks, baked terrain shadow, and the same distance fog as everything else.

import * as THREE from 'three';
import { FRAG_FOG } from './materials.js';
import { nraFromHeight, fbmTile, hash2 } from './proctex.js';

const WAVES = [
  // dir x, dir z, wavelength (m), amplitude (m), steepness
  [0.22, -0.975, 47, 0.2, 0.55], [-0.36, -0.933, 24, 0.115, 0.5], [0.58, -0.815, 12.5, 0.06, 0.42], [-0.1, -0.995, 7.2, 0.032, 0.35],
];

const VS = /* glsl */`
uniform float uTime; uniform sampler2D tHeight; uniform vec4 uTerrainRect; uniform float uSeaLevel;
uniform vec4 uWave[4]; uniform vec2 uWaveDir[4];
varying vec3 vWPos; varying vec3 vWaveN; varying float vBed;
void main() {
  vec3 wp = (modelMatrix * vec4(position, 1.0)).xyz;
  vec2 tuv = (wp.xz - uTerrainRect.xy) * uTerrainRect.zw;
  float bed = -30.0;
  if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) bed = texture2D(tHeight, tuv).r;
  float depth = max(0.0, uSeaLevel - bed);
  float damp = smoothstep(0.05, 2.8, depth);
  vec3 p = wp; vec3 n = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < 4; i++) {
    float k = 6.2831853 / uWave[i].x; float a = uWave[i].y * damp; float q = uWave[i].z;
    float ph = k * dot(uWaveDir[i], wp.xz) - sqrt(9.81 * k) * uTime + uWave[i].w;
    float c = cos(ph), s = sin(ph);
    p.xz += q * a * uWaveDir[i] * c; p.y += a * s;
    n.xz -= uWaveDir[i] * (k * a * c); n.y -= q * k * a * s;
  }
  // run-up: a few centimetres of slow swell in the shallows move the waterline back and forth in scallops
  float shallows = 1.0 - smoothstep(0.25, 1.4, depth);
  p.y += shallows * (0.034 * sin(wp.x * 0.27 + wp.z * 0.19 + uTime * 0.7) + 0.03 * sin(wp.x * 0.11 - wp.z * 0.13 + uTime * 0.45) + 0.02 * sin(wp.x * 0.61 + wp.z * 0.37 + uTime * 1.1));
  vWPos = p; vWaveN = n; vBed = bed;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

const FS = /* glsl */`
precision highp float;
uniform float uTime; uniform sampler2D tHeight; uniform vec4 uTerrainRect; uniform float uSeaLevel;
uniform sampler2D tSkyEq; uniform sampler2D tWaterN; uniform sampler2D tFoam; uniform sampler2D tNoise; uniform sampler2D tFoamTex;
uniform sampler2D tTerrainShadow; uniform sampler2D tHorizon; uniform vec4 uFog; uniform vec3 uSunDir; uniform float uSkyK;
uniform vec3 uSunColor; uniform float uSunPower; uniform float uGlint;
varying vec3 vWPos; varying vec3 vWaveN; varying float vBed;
vec3 skyAt(vec3 d) {
  d.y = max(d.y, 0.02); d = normalize(d);
  vec2 uv = vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(d.y) * 0.31830989 + 0.5);
  return textureGrad(tSkyEq, uv, vec2(0.0), vec2(0.0)).rgb * uSkyK;
}
void main() {
  vec2 tuv = (vWPos.xz - uTerrainRect.xy) * uTerrainRect.zw;
  bool inRect = tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0;
  float bed = inRect ? texture2D(tHeight, tuv).r : -30.0;
  float depth = max(0.0, vWPos.y - bed);
  vec3 toCam = cameraPosition - vWPos; float dist = length(toCam); vec3 V = toCam / dist;
  // ---- surface normal: analytic waves + three scrolling detail layers
  float calm = smoothstep(0.0, 1.6, depth);
  vec2 d1 = texture2D(tWaterN, vWPos.xz * 0.047 + uTime * vec2(0.011, 0.021)).xy * 2.0 - 1.0;
  vec2 d2 = texture2D(tWaterN, vWPos.xz * 0.0125 + uTime * vec2(-0.007, 0.0055)).xy * 2.0 - 1.0;
  vec2 d3 = texture2D(tWaterN, vWPos.xz * 0.21 + uTime * vec2(0.031, -0.024)).xy * 2.0 - 1.0;
  float fine = 1.0 / (1.0 + dist * 0.012);
  vec2 dn = (d1 * 0.9 + d2 * 1.3 + d3 * 0.6 * fine) * (0.17 + 0.27 * calm);
  vec3 N = normalize(vec3(vWaveN.x + dn.x, vWaveN.y, vWaveN.z + dn.y));
  // far away the micro-normals average out: flatten to avoid sparkling noise
  N = normalize(mix(N, vec3(0.0, 1.0, 0.0), smoothstep(300.0, 2500.0, dist) * 0.75));
  float NdV = max(dot(N, V), 0.0);
  // wave slopes that a pixel cannot resolve: the sea never becomes a perfect mirror at the horizon
  float slope = mix(0.11, 0.2, smoothstep(40.0, 900.0, dist));
  float NdVe = min(1.0, sqrt(NdV * NdV + slope * slope));
  float F = 0.02 + 0.98 * pow(1.0 - NdVe, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y) + slope * 0.85;      // tilted facets reflect the sky above the horizon
  vec3 refl = skyAt(R);
  // ---- baked terrain shadow (cliffs shade the water)
  float sun = 1.0;
  if (inRect) { float sh = texture2D(tTerrainShadow, tuv).r; sun = smoothstep(sh - 0.3, sh + 1.1, vWPos.y); }
  // ---- sun glitter
  vec3 Hh = normalize(V + uSunDir);
  float spec = pow(max(dot(N, Hh), 0.0), 520.0) * 26.0 + pow(max(dot(N, Hh), 0.0), 60.0) * 0.5;
  // ---- water body: turquoise in the shallows, deep blue offshore; lit by the sky and a little sun
  vec3 skyIrr = vec3(0.55, 0.72, 0.98) * 0.62;
  vec3 shallow = vec3(0.07, 0.44, 0.42), deep = vec3(0.012, 0.085, 0.135);
  vec3 body = mix(shallow, deep, 1.0 - exp(-depth * 0.3));
  body *= skyIrr * 0.75 + uSunColor * uSunPower * 0.018 * sun;
  float opacity = 1.0 - exp(-depth * 1.25);
  vec3 col = body * (1.0 - F) + refl * F + uSunColor * uSunPower * 0.32 * spec * sun * uGlint;
  // glitter path: the unresolved facets between the camera and the sun
  {
    float azc = max(dot(normalize(-V.xz), normalize(uSunDir.xz)), 0.0);
    float path = pow(azc, mix(700.0, 70.0, smoothstep(0.015, 0.3, NdV))) * smoothstep(25.0, 260.0, dist);
    float tw = texture2D(tNoise, vWPos.xz * 0.37 + uTime * vec2(0.09, 0.05)).g * texture2D(tNoise, vWPos.xz * 0.11 - uTime * vec2(0.04, 0.07)).r;
    float sparkle = mix(smoothstep(0.2, 0.42, tw) * 2.2, 1.0, smoothstep(120.0, 900.0, dist));
    col += uSunColor * uSunPower * path * (0.03 + 0.11 * sparkle) * sun * calm * uGlint;
  }
  opacity = mix(opacity, 1.0, clamp(F + spec * 0.2, 0.0, 1.0));
  // ---- foam: bubbly band at the waterline that opens into a net, lines left by earlier waves, rings around rocks
  float t = uTime * 0.55;
  vec3 nz = texture2D(tNoise, vWPos.xz * 0.055 + vec2(t * 0.035, t * 0.012)).rgb;
  vec3 nz2 = texture2D(tNoise, vWPos.xz * 0.31 - vec2(t * 0.02, t * 0.045)).rgb;
  vec2 drift = vec2(t * 0.03, t * 0.05);
  vec3 fa = texture2D(tFoamTex, vWPos.xz * 0.21 + drift + (nz2.rg - 0.5) * 0.05).rgb;
  vec3 fb = texture2D(tFoamTex, vWPos.xz * 0.062 - drift * 0.6 + (nz.rg - 0.5) * 0.08).rgb;
  float swash = 0.1 * sin(t * 1.35 + vWPos.x * 0.043 + nz.r * 4.5) + (nz.g - 0.5) * 0.2;
  float edge = 1.0 - smoothstep(0.015, 0.2 + swash, depth);
  float pattern = max(max(fa.r * 0.75, fb.r), fb.b * 0.8);
  // the band is not continuous: patches a few metres long with clear water between them
  float patchy = smoothstep(0.3, 0.62, nz.b + 0.35 * edge);
  float solid = smoothstep(0.5, 0.82, edge + (fa.g - 0.5) * 0.3) * mix(0.25, 1.0, patchy);
  float net = pattern * smoothstep(0.02, 0.4, edge);
  float foam = max(solid * (0.74 + 0.26 * fa.g), net * 0.9);
  float lines = smoothstep(0.5, 0.95, sin(depth * 9.0 + t * 1.6 + nz.g * 6.0)) * (1.0 - smoothstep(0.25, 1.6, depth)) * smoothstep(0.08, 0.22, depth);
  foam = max(foam, lines * (0.25 + 0.75 * fb.r) * 0.8);
  float rocks = inRect ? texture2D(tFoam, tuv).r : 0.0;
  float ring = smoothstep(0.2, 0.75, rocks + (nz2.r - 0.5) * 0.55 + 0.13 * sin(uTime * 1.6 + nz.b * 6.28));
  ring *= 1.0 - smoothstep(1.4, 3.2, depth) * 0.85;      // in deep water the swell hardly breaks on a submerged rock
  foam = clamp(max(foam, ring * (0.06 + 0.94 * pattern * pattern)), 0.0, 1.0);     // a net of foam around the boulders, not a veil
  vec3 foamCol = vec3(0.86, 0.9, 0.93) * (skyIrr * 0.62 + uSunColor * uSunPower * 0.075 * sun);
  col = mix(col, foamCol, foam);
  opacity = max(opacity, foam);
  // hairline of water at the very edge fades out instead of ending in a hard line
  opacity *= smoothstep(0.0, 0.035, depth);
  gl_FragColor = vec4(col, opacity);
  ${FRAG_FOG}
}`;

/** tileable cellular texture: R = thin web between small cells, G = bubble shading (0 centre, 1 wall), B = coarse web */
function makeFoamTexture(size = 512) {
  const data = new Uint8Array(size * size * 4);
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const layer = (cells, seed) => {
    const pts = new Float32Array(cells * cells * 2);
    for (let j = 0; j < cells; j++) for (let i = 0; i < cells; i++) { pts[(j * cells + i) * 2] = hash2(i, j, seed); pts[(j * cells + i) * 2 + 1] = hash2(i, j, seed + 7); }
    return (u, v, out) => {
      const x = u * cells, y = v * cells; const ix = Math.floor(x), iy = Math.floor(y); let f1 = 9, f2 = 9;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const cx = ((ix + di) % cells + cells) % cells, cy = ((iy + dj) % cells + cells) % cells;
        const d = Math.hypot(ix + di + pts[(cy * cells + cx) * 2] - x, iy + dj + pts[(cy * cells + cx) * 2 + 1] - y);
        if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
      }
      out[0] = f1; out[1] = f2;
    };
  };
  const A = layer(22, 3), B = layer(9, 11); const a = [0, 0], b = [0, 0];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    A(x / size, y / size, a); B(x / size, y / size, b); const o = (y * size + x) * 4;
    data[o] = Math.round(255 * (1 - sm(0.0, 0.16, a[1] - a[0])));
    data[o + 1] = Math.round(255 * Math.min(1, a[0] * 1.15));
    data[o + 2] = Math.round(255 * (1 - sm(0.0, 0.2, b[1] - b[0])));
    data[o + 3] = 255;
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 4; t.needsUpdate = true;
  return t;
}

export class Sea {
  constructor(world, env, noiseTex) {
    this.world = world; this.env = env;
    const t = world.terrain;
    // ---- terrain height as a texture (water depth)
    const half = new Uint16Array(t.nx * t.nz);
    for (let i = 0; i < half.length; i++) half[i] = THREE.DataUtils.toHalfFloat(t.h[i]);
    const hTex = new THREE.DataTexture(half, t.nx, t.nz, THREE.RedFormat, THREE.HalfFloatType);
    hTex.minFilter = hTex.magFilter = THREE.LinearFilter; hTex.wrapS = hTex.wrapT = THREE.ClampToEdgeWrapping; hTex.needsUpdate = true;
    this.heightTex = hTex;
    // ---- foam mask around rocks standing in the water (and bridge piers), half resolution
    const FR = 1.0;   // metres per texel
    const fw = Math.ceil((t.x1 - t.x0) / FR), fh = Math.ceil((t.z1 - t.z0) / FR); const fm = new Uint8Array(fw * fh);
    for (const sp of world.lists.foamSpots || []) {
      const cx = (sp.x - t.x0) / FR, cz = (sp.z - t.z0) / FR, rr = sp.r / FR;
      for (let j = Math.max(0, Math.floor(cz - rr - 1)); j <= Math.min(fh - 1, Math.ceil(cz + rr + 1)); j++) for (let i = Math.max(0, Math.floor(cx - rr - 1)); i <= Math.min(fw - 1, Math.ceil(cx + rr + 1)); i++) {
        const d = Math.hypot(i + 0.5 - cx, j + 0.5 - cz) / rr; if (d >= 1) continue;
        // a ring: nothing over the stone itself, strongest where the swell breaks around it
        const v = Math.round(255 * Math.min(1, 4.6 * d * d * d * (1 - d * d))); if (v > fm[j * fw + i]) fm[j * fw + i] = v;
      }
    }
    const fTex = new THREE.DataTexture(fm, fw, fh, THREE.RedFormat, THREE.UnsignedByteType);
    fTex.minFilter = fTex.magFilter = THREE.LinearFilter; fTex.needsUpdate = true;
    // ---- detail normals of the water surface (tileable noise turned into a normal map)
    const wn = nraFromHeight(512, (u, v) => fbmTile(u, v, 21, 5, 5) * 0.06 + fbmTile(u, v, 33, 13, 3) * 0.02, { strength: 50 });
    const eu = env.uniforms;
    const uniforms = {
      uTime: eu.uTime, tHeight: { value: hTex }, uTerrainRect: eu.uTerrainRect, uSeaLevel: { value: t.seaLevel },
      uWave: { value: WAVES.map((w, i) => new THREE.Vector4(w[2], w[3], w[4], i * 1.7)) }, uWaveDir: { value: WAVES.map((w) => new THREE.Vector2(w[0], w[1]).normalize()) },
      tSkyEq: { value: env.skySmall }, tWaterN: { value: wn }, tFoam: { value: fTex }, tNoise: { value: noiseTex }, tFoamTex: { value: makeFoamTexture(512) },
      tTerrainShadow: eu.tTerrainShadow, tHorizon: eu.tHorizon, uFog: eu.uFog, uSunDir: eu.uSunDir, uSkyK: eu.uSkyK,
      uSunColor: { value: env.sunColor }, uSunPower: { value: env.sunIntensity }, uGlint: { value: 1 },
    };
    this.material = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms, transparent: true, depthWrite: true, fog: false, toneMapped: false });
    this.material.name = 'sea_water'; this.material.userData.water = true;
    // ---- polar mesh: dense near the camera, sparse towards the horizon
    const rings = []; let r = 1.5; while (r < 9000) { rings.push(r); r *= r < 120 ? 1.11 : r < 900 ? 1.2 : 1.42; } rings.push(9200);
    const SEG = 112; const pos = [0, 0, 0], idx = [];
    for (const rr of rings) for (let s = 0; s < SEG; s++) { const a = (s / SEG) * Math.PI * 2; pos.push(Math.cos(a) * rr, 0, Math.sin(a) * rr); }
    for (let s = 0; s < SEG; s++) idx.push(0, 1 + (s + 1) % SEG, 1 + s);
    for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < SEG; s++) {
      const a = 1 + k * SEG + s, b = 1 + k * SEG + (s + 1) % SEG, c = a + SEG, d = b + SEG;
      idx.push(a, b, c, b, d, c);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx);
    this.mesh = new THREE.Mesh(geo, this.material); this.mesh.frustumCulled = false; this.mesh.renderOrder = 1; this.mesh.name = 'sea';
    this.mesh.userData.kind = 'water';
    this.seaLevel = t.seaLevel;
  }

  update(camera) {
    // snap to whole metres so that the mesh does not swim against the waves
    this.mesh.position.set(Math.round(camera.position.x), this.seaLevel, Math.round(camera.position.z));
    this.mesh.updateMatrixWorld();
  }
}
