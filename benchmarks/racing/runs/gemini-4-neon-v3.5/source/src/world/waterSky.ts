import * as THREE from 'three';
import { LightingMode } from '../types';
import { LoadedAssets } from './assets';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';
import { fbm2D } from '../utils/rng';

export interface CoastalRockFoamPoint {
  x: number;
  z: number;
  radius: number;
}

export interface WaterSkySystem {
  group: THREE.Group;
  oceanMesh: THREE.Mesh;
  sunDiscMesh: THREE.Mesh;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  moonDirLight: THREE.DirectionalLight;
  setLightingMode: (mode: LightingMode, scene: THREE.Scene, assets: LoadedAssets) => void;
  setFogDensityOverride: (density: number | null, scene: THREE.Scene) => void;
  setCoastalRocks: (rocks: CoastalRockFoamPoint[]) => void;
  update: (timeSec: number, cameraPos: THREE.Vector3) => void;
  getSunDirection: (mode: LightingMode) => THREE.Vector3;
}

const MAX_FOAM_ROCKS = 24;

export function buildWaterSkySystem(
  track: TrackSpline,
  terrain: TerrainSystem
): WaterSkySystem {
  const group = new THREE.Group();
  group.name = 'water_sky_system';

  const sunDirGolden = new THREE.Vector3(...track.spec.sunDirectionGoldenHour).normalize();
  const moonDirNight = new THREE.Vector3(...track.spec.moonDirectionNight).normalize();

  // ---------------------------------------------------------------------------
  // 1. Pre-baked Bathymetry / Water Depth DataTexture sampled directly from exact TerrainSystem!
  //    NOTE: This is an internal bathymetry heightfield lookup buffer for the water shader (NOT a surface texture!).
  // ---------------------------------------------------------------------------
  const depthSize = 256;
  const depthData = new Float32Array(depthSize * depthSize);
  const { minX, maxX, minZ, maxZ } = terrain.cfg;
  const seaY = track.spec.seaLevel;

  for (let r = 0; r < depthSize; r++) {
    const z = minZ + (r / (depthSize - 1)) * (maxZ - minZ);
    for (let c = 0; c < depthSize; c++) {
      const x = minX + (c / (depthSize - 1)) * (maxX - minX);
      const h = terrain.getHeight(x, z);
      // Water depth positive underwater, negative on dry land
      depthData[r * depthSize + c] = seaY - h;
    }
  }
  const depthTex = new THREE.DataTexture(depthData, depthSize, depthSize, THREE.RedFormat, THREE.FloatType);
  depthTex.minFilter = THREE.LinearFilter;
  depthTex.magFilter = THREE.LinearFilter;
  depthTex.wrapS = THREE.ClampToEdgeWrapping;
  depthTex.wrapT = THREE.ClampToEdgeWrapping;
  depthTex.needsUpdate = true;

  const rockUniformArr: THREE.Vector4[] = [];
  for (let i = 0; i < MAX_FOAM_ROCKS; i++) rockUniformArr.push(new THREE.Vector4(99999, 99999, 1, 0));

  // ---------------------------------------------------------------------------
  // 2. Depth-Shaded Animated Mediterranean Sea Mesh (extends 12 km to horizon — ZERO cut-off!)
  // ---------------------------------------------------------------------------
  const oceanUniforms = {
    uTime: { value: 0 },
    uSunDir: { value: sunDirGolden.clone() },
    uSunColor: { value: new THREE.Color(0xffb86b) },
    uSkyHorizon: { value: new THREE.Color(0xf2b98a) },
    uSkyZenith: { value: new THREE.Color(0x3a6494) },
    uShallowColor: { value: new THREE.Color(0x28b8b0) },
    uMidColor: { value: new THREE.Color(0x0c5c7a) },
    uDeepColor: { value: new THREE.Color(0x072542) },
    uFogColor: { value: new THREE.Color(0xe6b58c) },
    uFogDensity: { value: 0.00052 },
    uNightFactor: { value: 0.0 },
    uDepthTex: { value: depthTex },
    uTerrainBounds: { value: new THREE.Vector4(minX, minZ, maxX - minX, maxZ - minZ) },
    uRocks: { value: rockUniformArr },
    uRockCount: { value: 0 },
  };

  const oceanMat = new THREE.ShaderMaterial({
    uniforms: oceanUniforms,
    transparent: true,
    depthWrite: true,
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vWorldPos;
      varying float vWaveH;

      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        // Subtle multi-frequency coastal swell displacement near camera
        float dist = length(wp.xz - cameraPosition.xz);
        float atten = 1.0 - smoothstep(140.0, 900.0, dist);
        float w1 = sin(wp.x * 0.09 + wp.z * 0.05 + uTime * 1.45) * 0.14;
        float w2 = cos(wp.x * 0.045 - wp.z * 0.11 + uTime * 1.15) * 0.10;
        float w3 = sin((wp.x + wp.z) * 0.19 - uTime * 2.1) * 0.045;
        float wh = (w1 + w2 + w3) * atten;
        wp.y += wh;
        vWaveH = wh;
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uSkyHorizon;
      uniform vec3 uSkyZenith;
      uniform vec3 uShallowColor;
      uniform vec3 uMidColor;
      uniform vec3 uDeepColor;
      uniform vec3 uFogColor;
      uniform float uFogDensity;
      uniform float uNightFactor;
      uniform sampler2D uDepthTex;
      uniform vec4 uTerrainBounds;
      uniform vec4 uRocks[${MAX_FOAM_ROCKS}];
      uniform int uRockCount;

      varying vec3 vWorldPos;
      varying float vWaveH;

      float waveHeight(vec2 p, float t) {
        float h = 0.0;
        h += sin(dot(p, vec2(0.17, 0.09)) + t * 1.65) * 0.16;
        h += sin(dot(p, vec2(-0.11, 0.21)) + t * 1.32) * 0.12;
        h += sin(dot(p, vec2(0.39, -0.27)) + t * 2.40) * 0.065;
        h += sin(dot(p, vec2(-0.62, -0.45)) + t * 3.15) * 0.032;
        h += sin(dot(p, vec2(1.15, 0.85)) - t * 3.90) * 0.016;
        return h;
      }

      vec3 calcWaterNormal(vec2 p, float t, float detailAtten) {
        float eps = 0.28;
        float h0 = waveHeight(p, t);
        float hx = waveHeight(p + vec2(eps, 0.0), t);
        float hz = waveHeight(p + vec2(0.0, eps), t);
        vec3 n = normalize(vec3((h0 - hx) * detailAtten, eps * 1.45, (h0 - hz) * detailAtten));
        return n;
      }

      void main() {
        vec2 uvDepth = (vWorldPos.xz - uTerrainBounds.xy) / uTerrainBounds.zw;
        bool inBounds = uvDepth.x >= 0.01 && uvDepth.x <= 0.99 && uvDepth.y >= 0.01 && uvDepth.y <= 0.99;
        float depth = inBounds ? texture2D(uDepthTex, uvDepth).r : 18.0;

        // Clip cleanly slightly inland so sand dry beach stays dry
        if (depth < -0.22) discard;

        vec3 V = normalize(cameraPosition - vWorldPos);
        float camDist = length(cameraPosition - vWorldPos);
        float detailAtten = mix(1.0, 0.22, smoothstep(80.0, 1400.0, camDist));
        vec3 N = calcWaterNormal(vWorldPos.xz, uTime, detailAtten);

        // Fresnel reflection factor (Schlick)
        float NdotV = max(dot(N, V), 0.001);
        float fresnel = 0.03 + 0.97 * pow(1.0 - NdotV, 4.6);

        // Depth-based coastal color absorption: luminous turquoise -> Mediterranean azure -> deep cobalt!
        float shallowT = smoothstep(0.0, 2.8, depth);
        float deepT = smoothstep(2.2, 11.5, depth);
        vec3 waterBody = mix(uShallowColor, uMidColor, shallowT);
        waterBody = mix(waterBody, uDeepColor, deepT);

        // Warm sun-scatter glow in translucent turquoise shallows (Ref 04!)
        float sss = pow(max(dot(V, -uSunDir + N * 0.4), 0.0), 2.5) * (1.0 - deepT) * (1.0 - uNightFactor * 0.85);
        waterBody += vec3(0.08, 0.46, 0.44) * sss * 0.85;

        // Reflected sky gradient (rich azure zenith -> warm golden horizon)
        vec3 R = reflect(-V, N);
        float rUp = clamp(R.y, 0.0, 1.0);
        vec3 skyRefl = mix(uSkyHorizon, uSkyZenith, pow(rUp, 0.45));

        // Glistening Sun / Moon specular path across waves!
        vec3 H = normalize(uSunDir + V);
        float specTight = pow(max(dot(N, H), 0.0), mix(340.0, 200.0, uNightFactor)) * mix(4.6, 2.0, uNightFactor);
        float specBroad = pow(max(dot(N, H), 0.0), 28.0) * mix(0.62, 0.18, uNightFactor);
        vec3 sunSpec = uSunColor * (specTight + specBroad);

        // Animated shoreline wave-wash & crisp white coastal foam!
        float shoreBand = 1.0 - smoothstep(-0.08, 1.55, depth);
        float washWave = sin(depth * 7.2 - uTime * 2.3 + sin(vWorldPos.z * 0.14) * 2.2);
        float lacyNoise = sin(vWorldPos.x * 1.7 + uTime * 0.9) * cos(vWorldPos.z * 1.9 - uTime * 1.1) * 0.5 + 0.5;
        float shoreFoam = smoothstep(0.18, 0.68, shoreBand * (0.72 + 0.45 * washWave) + lacyNoise * shoreBand * 0.48);
        // Secondary breaking ripple foam band slightly offshore
        float surfLine = exp(-pow((depth - 0.95) / 0.38, 2.0)) * smoothstep(0.08, 0.82, washWave * 0.5 + 0.5) * (0.48 + 0.52 * lacyNoise);

        // Animated foam rings wrapping cleanly around coastal boulders in the water (Ref 04!)
        float rockFoam = 0.0;
        for (int i = 0; i < ${MAX_FOAM_ROCKS}; i++) {
          if (i >= uRockCount) break;
          vec4 rk = uRocks[i];
          float d = length(vWorldPos.xz - rk.xy) - rk.z;
          if (d < 4.2 && d > -0.6) {
            float ringPulse = 0.5 + 0.5 * sin(d * 4.2 - uTime * 2.8 + float(i) * 1.7);
            float f = (1.0 - smoothstep(0.0, 2.9, max(0.0, d))) * (0.62 + 0.48 * ringPulse) * (0.55 + 0.45 * lacyNoise);
            rockFoam = max(rockFoam, smoothstep(0.24, 0.68, f));
          }
        }

        float totalFoam = clamp(max(max(shoreFoam, surfLine * 0.85), rockFoam * 0.98), 0.0, 1.0);
        vec3 foamColor = mix(vec3(0.99, 0.97, 0.93), vec3(0.36, 0.44, 0.58), uNightFactor);

        // Keep rich Mediterranean turquoise/cobalt color readable even at low grazing shoreline angles!
        vec3 col = mix(waterBody, skyRefl, fresnel * 0.54) + sunSpec;
        col = mix(col, foamColor, totalFoam * 0.92);

        // Directional aerial perspective / horizon haze matching sky seamlessly
        float fogFactor = 1.0 - exp(-pow(camDist * uFogDensity, 1.45));
        float sunGlow = pow(max(dot(-V, uSunDir), 0.0), 5.0) * (1.0 - uNightFactor);
        vec3 finalFog = mix(uFogColor, uSunColor * 1.08, sunGlow * 0.45);
        col = mix(col, finalFog, clamp(fogFactor, 0.0, 0.98));

        // Translucent shallows fade softly onto wet sand at depth -> 0
        float alpha = clamp(smoothstep(-0.14, 0.42, depth) + totalFoam * 0.65, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  // High-detail inner bay mesh (smooth wave displacement) + vast 12 km outer sea skirt!
  const oceanGeom = new THREE.PlaneGeometry(14000, 14000, 140, 140);
  oceanGeom.rotateX(-Math.PI / 2);
  const oceanMesh = new THREE.Mesh(oceanGeom, oceanMat);
  oceanMesh.name = 'mediterranean_ocean';
  oceanMesh.position.set(-1200, seaY, 0);
  oceanMesh.renderOrder = 2;
  group.add(oceanMesh);

  // ---------------------------------------------------------------------------
  // 3. Distant Horizon Coastal Mountain Backdrop Ring (Mediterranean silhouette framing Refs 01 & 02!)
  // ---------------------------------------------------------------------------
  const backdropPts = 128;
  const bPos: number[] = [];
  const bCol: number[] = [];
  const bIdx: number[] = [];
  const rInner = 1350;
  const rOuter = 2300;
  const cLow = new THREE.Color(0x6d747a);
  const cHigh = new THREE.Color(0x9a8f82);

  for (let i = 0; i <= backdropPts; i++) {
    const a = (i / backdropPts) * Math.PI * 2;
    const cx = 240 + Math.cos(a) * rInner;
    const cz = Math.sin(a) * rInner;
    const ox = 240 + Math.cos(a) * rOuter;
    const oz = Math.sin(a) * rOuter;
    // Open unobstructed ocean horizon toward West (-X, cos(a) < -0.35), distant headland ridges North/East/South!
    const landMask = THREE.MathUtils.smoothstep(Math.cos(a), -0.58, 0.15);
    const n1 = Math.max(0, fbm2D(Math.cos(a) * 3.1, Math.sin(a) * 3.1, 4, 901) * 0.5 + 0.5);
    const peakY = landMask * (45 + n1 * 185);

    bPos.push(cx, -8, cz);
    bCol.push(cLow.r, cLow.g, cLow.b);
    bPos.push(ox, peakY, oz);
    const mixC = cLow.clone().lerp(cHigh, Math.min(1, peakY / 180));
    bCol.push(mixC.r, mixC.g, mixC.b);
  }
  for (let i = 0; i < backdropPts; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    bIdx.push(a, c, b, b, c, d);
  }
  const backdropGeom = new THREE.BufferGeometry();
  backdropGeom.setAttribute('position', new THREE.Float32BufferAttribute(bPos, 3));
  backdropGeom.setAttribute('color', new THREE.Float32BufferAttribute(bCol, 3));
  backdropGeom.setIndex(bIdx);
  backdropGeom.computeVertexNormals();
  const backdropMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const backdropMesh = new THREE.Mesh(backdropGeom, backdropMat);
  backdropMesh.name = 'distant_coastal_mountains';
  group.add(backdropMesh);

  // Soft Glowing Atmospheric Sun / Moon Corona Halo (ZERO hard flat circle cutout!)
  const sunDiscUniforms = {
    uCoreColor: { value: new THREE.Color(0xfff4d8) },
    uHaloColor: { value: new THREE.Color(0xff9b42) },
    uIsNight: { value: 0.0 },
  };
  const sunDiscMat = new THREE.ShaderMaterial({
    uniforms: sunDiscUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCoreColor;
      uniform vec3 uHaloColor;
      uniform float uIsNight;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - vec2(0.5)) * 2.0;
        if (d > 1.0) discard;
        float core = exp(-d * d * mix(38.0, 62.0, uIsNight));
        float innerHalo = exp(-d * d * 8.5) * mix(0.62, 0.35, uIsNight);
        float outerGlow = pow(max(0.0, 1.0 - d), 3.0) * mix(0.32, 0.14, uIsNight);
        vec3 col = uCoreColor * core * 1.85 + uHaloColor * (innerHalo + outerGlow);
        float alpha = clamp(core + innerHalo + outerGlow, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
  const sunDiscMesh = new THREE.Mesh(new THREE.PlaneGeometry(540, 540), sunDiscMat);
  sunDiscMesh.name = 'sun_moon_disc';
  sunDiscMesh.renderOrder = 1;
  group.add(sunDiscMesh);

  // ---------------------------------------------------------------------------
  // 4. Lighting Rig (Golden Hour warm key vs cool shadow fill; Night moonlit dark atmosphere)
  // ---------------------------------------------------------------------------
  const hemiLight = new THREE.HemisphereLight(0x6b94c8, 0x463a2f, 0.36);
  group.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0x4b6382, 0.14);
  group.add(ambientLight);

  // Subtle moonlight fill for night speculars
  const moonDirLight = new THREE.DirectionalLight(0x7ca2d8, 0.0);
  moonDirLight.position.copy(moonDirNight).multiplyScalar(250);
  group.add(moonDirLight);

  const getSunDirection = (mode: LightingMode) =>
    mode === 'golden_hour' ? sunDirGolden.clone() : moonDirNight.clone();

  let baseFogDensity = 0.00048;

  const setLightingMode = (mode: LightingMode, scene: THREE.Scene, assets: LoadedAssets) => {
    const isNight = mode === 'night';

    if (!isNight) {
      // GOLDEN HOUR: Low warm golden sun ahead-left on Z1, crisp cool-tinted deep shadows!
      scene.environment = assets.envGolden;
      scene.background = assets.hdriGolden;
      scene.backgroundBlurriness = 0.0;
      scene.backgroundIntensity = 0.82;
      scene.environmentIntensity = 0.76;
      // Align HDRI sun cleanly with sunDirGolden (NW over bay) so East-facing Z2 shots have zero blinding washout!
      scene.backgroundRotation.set(0, 3.45, 0);
      scene.environmentRotation.set(0, 3.45, 0);
      baseFogDensity = 0.00046;
      scene.fog = new THREE.FogExp2(0xe4b588, baseFogDensity);

      hemiLight.color.setHex(0x6b96cc); // cool sky bounce in shadows!
      hemiLight.groundColor.setHex(0x443528);
      hemiLight.intensity = 0.34;
      ambientLight.color.setHex(0x4c6890);
      ambientLight.intensity = 0.10;
      moonDirLight.intensity = 0.0;

      oceanUniforms.uSunDir.value.copy(sunDirGolden);
      oceanUniforms.uSunColor.value.setHex(0xffbe70);
      oceanUniforms.uSkyHorizon.value.setHex(0xf3be8b);
      oceanUniforms.uSkyZenith.value.setHex(0x285a90);
      oceanUniforms.uShallowColor.value.setHex(0x14c6be);
      oceanUniforms.uMidColor.value.setHex(0x09608c);
      oceanUniforms.uDeepColor.value.setHex(0x05244a);
      oceanUniforms.uFogColor.value.setHex(0xe4b588);
      oceanUniforms.uFogDensity.value = baseFogDensity;
      oceanUniforms.uNightFactor.value = 0.0;

      sunDiscUniforms.uCoreColor.value.setHex(0xfff4d6);
      sunDiscUniforms.uHaloColor.value.setHex(0xff9b40);
      sunDiscUniforms.uIsNight.value = 0.0;
      sunDiscMesh.scale.setScalar(1.0);
    } else {
      // NIGHT MODE: Deep crisp moonlit Mediterranean night so warm amber lamps & bright headlights POP!
      scene.environment = assets.envNight;
      scene.background = assets.hdriNight;
      scene.backgroundBlurriness = 0.0;
      scene.backgroundIntensity = 0.36;
      scene.environmentIntensity = 0.24;
      scene.backgroundRotation.set(0, 0.6, 0);
      scene.environmentRotation.set(0, 0.6, 0);
      baseFogDensity = 0.00086;
      scene.fog = new THREE.FogExp2(0x050a16, baseFogDensity);

      hemiLight.color.setHex(0x182b4d);
      hemiLight.groundColor.setHex(0x06090f);
      hemiLight.intensity = 0.18;
      ambientLight.color.setHex(0x0c1628);
      ambientLight.intensity = 0.10;
      moonDirLight.intensity = 0.24;

      oceanUniforms.uSunDir.value.copy(moonDirNight);
      oceanUniforms.uSunColor.value.setHex(0xa8c8ff);
      oceanUniforms.uSkyHorizon.value.setHex(0x0d192e);
      oceanUniforms.uSkyZenith.value.setHex(0x040812);
      oceanUniforms.uShallowColor.value.setHex(0x092b3a);
      oceanUniforms.uMidColor.value.setHex(0x051629);
      oceanUniforms.uDeepColor.value.setHex(0x030b18);
      oceanUniforms.uFogColor.value.setHex(0x050a16);
      oceanUniforms.uFogDensity.value = baseFogDensity;
      oceanUniforms.uNightFactor.value = 1.0;

      sunDiscUniforms.uCoreColor.value.setHex(0xdbeaff);
      sunDiscUniforms.uHaloColor.value.setHex(0x5278b8);
      sunDiscUniforms.uIsNight.value = 1.0;
      sunDiscMesh.scale.setScalar(0.65);
    }
  };

  const setFogDensityOverride = (density: number | null, scene: THREE.Scene) => {
    const d = density !== null ? density : baseFogDensity;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = d;
    }
    oceanUniforms.uFogDensity.value = d;
  };

  const setCoastalRocks = (rocks: CoastalRockFoamPoint[]) => {
    const n = Math.min(rocks.length, MAX_FOAM_ROCKS);
    oceanUniforms.uRockCount.value = n;
    for (let i = 0; i < n; i++) {
      rockUniformArr[i].set(rocks[i].x, rocks[i].z, rocks[i].radius, 1);
    }
  };

  const update = (timeSec: number, cameraPos: THREE.Vector3) => {
    oceanUniforms.uTime.value = timeSec;
    const dir = oceanUniforms.uSunDir.value;
    sunDiscMesh.position.copy(cameraPos).addScaledVector(dir, 2600);
    sunDiscMesh.lookAt(cameraPos);
  };

  return {
    group,
    oceanMesh,
    sunDiscMesh,
    hemiLight,
    ambientLight,
    moonDirLight,
    setLightingMode,
    setFogDensityOverride,
    setCoastalRocks,
    update,
    getSunDirection,
  };
}
