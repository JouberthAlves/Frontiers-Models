import * as THREE from 'three';
import { TerrainField } from './terrain';

export interface OceanSystem {
  mesh: THREE.Mesh;
  horizonMesh: THREE.Mesh;
  update: (timeSec: number, camPos: THREE.Vector3) => void;
  setRockFoamCenters: (rocks: { x: number; z: number; radius: number }[]) => void;
}

export function createOceanSystem(
  terrain: TerrainField,
  seaLevel: number,
  sunDir: THREE.Vector3
): OceanSystem {
  // Bake seabed depth map from TerrainField so water color & shoreline foam derive from the single world source!
  const w = 512;
  const h = 512;
  const depthData = new Uint8Array(w * h * 4);
  const spanX = terrain.maxX - terrain.minX;
  const spanZ = terrain.maxZ - terrain.minZ;

  for (let iy = 0; iy < h; iy++) {
    const tz = iy / (h - 1);
    const wz = terrain.minZ + tz * spanZ;
    for (let ix = 0; ix < w; ix++) {
      const tx = ix / (w - 1);
      const wx = terrain.minX + tx * spanX;
      const groundY = terrain.getHeightAt(wx, wz);
      // Store signed height relative to seaLevel: 0 = -16m deep, 0.5 = 0m shoreline, 1.0 = +16m land
      const norm = THREE.MathUtils.clamp((groundY - seaLevel + 16.0) / 32.0, 0, 1);
      const val = Math.round(norm * 255);
      const idx = (iy * w + ix) * 4;
      depthData[idx] = val;
      depthData[idx + 1] = val;
      depthData[idx + 2] = val;
      depthData[idx + 3] = 255;
    }
  }

  const depthTex = new THREE.DataTexture(depthData, w, h, THREE.RGBAFormat);
  depthTex.minFilter = THREE.LinearFilter;
  depthTex.magFilter = THREE.LinearFilter;
  depthTex.wrapS = THREE.ClampToEdgeWrapping;
  depthTex.wrapT = THREE.ClampToEdgeWrapping;
  depthTex.needsUpdate = true;

  const maxRocks = 24;
  const rockUniformArray: THREE.Vector4[] = [];
  for (let i = 0; i < maxRocks; i++) {
    rockUniformArray.push(new THREE.Vector4(99999, 99999, 1.0, 0));
  }

  const uniforms = {
    uTime: { value: 0 },
    uSunDir: { value: sunDir.clone().normalize() },
    uDepthMap: { value: depthTex },
    uBoundsMin: { value: new THREE.Vector2(terrain.minX, terrain.minZ) },
    uBoundsSize: { value: new THREE.Vector2(spanX, spanZ) },
    uSeaLevel: { value: seaLevel },
    uRocks: { value: rockUniformArray },
    uFogColor: { value: new THREE.Color(0xd49b6c) },
    uFogNear: { value: 210.0 },
    uFogFar: { value: 3600.0 },
  };

  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec3 vWorldPos;
    varying vec2 vWaveSlope;

    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      // Multi-frequency gentle coastal swell
      float w1 = sin(wp.x * 0.055 + wp.z * 0.042 + uTime * 1.45) * 0.09;
      float w2 = cos(wp.x * 0.09 - wp.z * 0.075 + uTime * 1.95) * 0.05;
      float w3 = sin((wp.x - wp.z) * 0.19 - uTime * 2.4) * 0.025;
      wp.y += w1 + w2 + w3;

      float dx = cos(wp.x * 0.055 + wp.z * 0.042 + uTime * 1.45) * 0.055 * 0.09
               - sin(wp.x * 0.09 - wp.z * 0.075 + uTime * 1.95) * 0.09 * 0.05
               + cos((wp.x - wp.z) * 0.19 - uTime * 2.4) * 0.19 * 0.025;
      float dz = cos(wp.x * 0.055 + wp.z * 0.042 + uTime * 1.45) * 0.042 * 0.09
               + sin(wp.x * 0.09 - wp.z * 0.075 + uTime * 1.95) * 0.075 * 0.05
               - cos((wp.x - wp.z) * 0.19 - uTime * 2.4) * 0.19 * 0.025;
      vWaveSlope = vec2(dx, dz);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    uniform vec3 uSunDir;
    uniform sampler2D uDepthMap;
    uniform vec2 uBoundsMin;
    uniform vec2 uBoundsSize;
    uniform float uSeaLevel;
    uniform vec4 uRocks[${maxRocks}];
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    varying vec3 vWorldPos;
    varying vec2 vWaveSlope;

    float wHash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float wNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(wHash(i), wHash(i + vec2(1.0, 0.0)), u.x),
        mix(wHash(i + vec2(0.0, 1.0)), wHash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }
    float wFbm(vec2 p) {
      return wNoise(p) * 0.55 + wNoise(p * 2.13 + 3.7) * 0.30 + wNoise(p * 4.71 - 1.9) * 0.15;
    }

    void main() {
      vec2 uvMap = (vWorldPos.xz - uBoundsMin) / uBoundsSize;
      float inBounds = step(0.0, uvMap.x) * step(uvMap.x, 1.0) * step(0.0, uvMap.y) * step(uvMap.y, 1.0);
      float encodedH = texture2D(uDepthMap, clamp(uvMap, 0.001, 0.999)).r;
      float groundY = mix(-14.0, encodedH * 32.0 - 16.0 + uSeaLevel, inBounds);
      float waterDepth = max(0.0, vWorldPos.y - groundY);

      // Multi-octave animated capillary surface ripples for high-res normal perturbation
      vec2 p1 = vWorldPos.xz * 0.28 + vec2(uTime * 0.42, uTime * 0.24);
      vec2 p2 = vWorldPos.xz * 0.65 - vec2(uTime * 0.35, -uTime * 0.51);
      float n1 = wFbm(p1);
      float n2 = wFbm(p2);
      float nx = (n1 - 0.5) * 0.24 + (wNoise(p2 + vec2(0.2, 0.0)) - n2) * 0.18 + vWaveSlope.x * 1.4;
      float nz = (n2 - 0.5) * 0.24 + (wNoise(p1 + vec2(0.0, 0.2)) - n1) * 0.18 + vWaveSlope.y * 1.4;
      vec3 N = normalize(vec3(-nx, 1.0, -nz));

      vec3 V = normalize(cameraPosition - vWorldPos);
      float NdotV = max(dot(N, V), 0.02);
      float fresnel = 0.03 + 0.97 * pow(1.0 - NdotV, 4.4);

      // Depth-based Mediterranean palette: crystal turquoise shallows -> deep azure offshore
      vec3 colShallow = vec3(0.18, 0.55, 0.56);
      vec3 colMid = vec3(0.05, 0.30, 0.40);
      vec3 colDeep = vec3(0.02, 0.14, 0.26);
      vec3 waterBody = mix(colShallow, colMid, smoothstep(0.2, 2.8, waterDepth));
      waterBody = mix(waterBody, colDeep, smoothstep(2.5, 9.5, waterDepth));

      // Golden hour sky reflection gradient
      vec3 R = reflect(-V, N);
      float sunAlign = max(dot(R, uSunDir), 0.0);
      vec3 skyRefl = mix(vec3(0.20, 0.34, 0.54), vec3(0.95, 0.66, 0.38), smoothstep(0.35, 0.0, max(R.y, 0.0)));
      skyRefl += vec3(1.0, 0.80, 0.52) * pow(sunAlign, 18.0) * 0.85;

      // Crisp GGX-style golden sun glitter on ripples
      vec3 H = normalize(uSunDir + V);
      float NdotH = max(dot(N, H), 0.0);
      float specTight = pow(NdotH, 320.0) * 3.8;
      float specBroad = pow(NdotH, 36.0) * 0.32;
      vec3 sunGlint = vec3(1.0, 0.82, 0.55) * (specTight + specBroad);

      vec3 color = mix(waterBody, skyRefl, fresnel * 0.82) + sunGlint;

      // Animated shoreline surf waves & crisp lacy breaking foam (keep turquoise shallows clear!)
      float foamTex = wFbm(vWorldPos.xz * 0.95 - vec2(0.0, uTime * 0.65));
      float foamLace = wNoise(vWorldPos.xz * 4.5 + vec2(uTime * 0.45, -uTime * 0.55)) * 0.55 +
                       wNoise(vWorldPos.xz * 11.5 - vec2(uTime * 0.3, uTime * 0.4)) * 0.45;
      float surfWave = max(0.0, sin(waterDepth * 6.5 - uTime * 2.5 + foamTex * 3.2));
      float shoreLineFoam = smoothstep(0.36, 0.01, waterDepth) * smoothstep(0.40, 0.72, foamTex * 0.45 + foamLace * 0.65);
      float surfCrests = smoothstep(2.2, 0.15, waterDepth) * pow(surfWave, 4.5) * smoothstep(0.38, 0.72, foamLace);
      float foam = clamp(shoreLineFoam + surfCrests * 0.9, 0.0, 1.0);

      // Animated foam rings & ragged splash spray tightly hugging coastal boulders in the surf!
      for (int i = 0; i < ${maxRocks}; i++) {
        vec4 rk = uRocks[i];
        if (rk.z > 0.1) {
          float distR = length(vWorldPos.xz - rk.xy) - rk.z * (0.75 + 0.35 * foamTex);
          if (distR > -0.6 && distR < 2.2) {
            float ringWave = max(0.0, sin(distR * 4.6 - uTime * 2.8 + foamTex * 3.2));
            float innerSplash = smoothstep(0.55, -0.15, distR) * smoothstep(0.38, 0.72, foamLace);
            float outerRing = smoothstep(2.0, 0.0, max(distR, 0.0)) * pow(ringWave, 3.5) * smoothstep(0.40, 0.74, foamLace);
            foam = max(foam, clamp(innerSplash + outerRing * 0.85, 0.0, 1.0));
          }
        }
      }

      vec3 foamCol = vec3(0.98, 0.95, 0.90) * (0.72 + 0.28 * max(dot(N, uSunDir), 0.0));
      color = mix(color, foamCol, foam * 0.95);

      // Keep white surf foam opaque right onto wet sand edge while clear water stays translucent!
      float waterAlpha = smoothstep(0.0, 0.28, waterDepth);
      float alpha = clamp(max(waterAlpha, foam * 0.92), 0.0, 1.0);
      alpha = mix(0.98, alpha, inBounds);

      // Distance atmospheric horizon haze (same golden fog curve as world!)
      float distCam = length(cameraPosition - vWorldPos);
      float fogF = smoothstep(uFogNear, uFogFar, distCam);
      color = mix(color, uFogColor, fogF);

      gl_FragColor = vec4(color, alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `;

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: true,
  });

  // High-density coastal plane covering terrain bounds + outer bay
  const nearGeom = new THREE.PlaneGeometry(2400, 1800, 220, 160);
  nearGeom.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(nearGeom, mat);
  mesh.position.set(0, seaLevel, -260);
  mesh.renderOrder = 2;

  // Vast outer horizon sea ring (no visible edge at 15 km!)
  const farMat = mat.clone();
  const farGeom = new THREE.PlaneGeometry(24000, 24000, 48, 48);
  farGeom.rotateX(-Math.PI / 2);
  const horizonMesh = new THREE.Mesh(farGeom, farMat);
  horizonMesh.position.set(0, seaLevel - 0.04, 0);
  horizonMesh.renderOrder = 1;

  return {
    mesh,
    horizonMesh,
    update: (timeSec: number, _camPos: THREE.Vector3) => {
      uniforms.uTime.value = timeSec;
      farMat.uniforms.uTime.value = timeSec;
    },
    setRockFoamCenters: (rocks: { x: number; z: number; radius: number }[]) => {
      for (let i = 0; i < maxRocks; i++) {
        if (i < rocks.length) {
          rockUniformArray[i].set(rocks[i].x, rocks[i].z, rocks[i].radius, 1);
          farMat.uniforms.uRocks.value[i].copy(rockUniformArray[i]);
        } else {
          rockUniformArray[i].set(99999, 99999, 0, 0);
        }
      }
    },
  };
}
