import * as THREE from 'three';
import { SurfaceType } from '../types';
import { TrackSpline } from './trackSpline';

export interface RoadColliderData {
  positions: Float32Array;
  indices: Uint32Array;
  triSurface: Uint8Array; // 0=asphalt, 1=curb, 2=gravel, 3=bridge
}

export interface RoadSystem {
  group: THREE.Group;
  asphaltMesh: THREE.Mesh;
  shoulderMesh: THREE.Mesh;
  sidewalkMesh: THREE.Mesh;
  asphaltMaterial: THREE.MeshStandardMaterial;
  shoulderMaterial: THREE.MeshStandardMaterial;
  sidewalkMaterial: THREE.MeshStandardMaterial;
  colliderData: RoadColliderData;
}

export function buildRoadSystem(track: TrackSpline): RoadSystem {
  const group = new THREE.Group();
  group.name = 'road_system';

  const rings = 1200;
  const ds = track.length / rings;

  // ---------------------------------------------------------------------------
  // 1. Main Asphalt Ribbon (cross-section: 6 verts per ring for banking accuracy)
  //    u in [0..1] across road width, v = s / 6.5 (for crisp 2048px asphalt tiles)
  // ---------------------------------------------------------------------------
  const roadCols = 6;
  const roadVerts = (rings + 1) * roadCols;
  const rPos = new Float32Array(roadVerts * 3);
  const rNorm = new Float32Array(roadVerts * 3);
  const rUv = new Float32Array(roadVerts * 2);
  // Custom vertex attr: (sMeters, zoneCode 0..3, isBridge 0..1, widthMeters)
  const rMeta = new Float32Array(roadVerts * 4);
  const rIdx = new Uint32Array(rings * (roadCols - 1) * 6);

  const zoneToCode = (z: string) => (z === 'Z1' ? 0 : z === 'Z2' ? 1 : z === 'Z3' ? 2 : 3);

  for (let i = 0; i <= rings; i++) {
    const s = (i % rings) * ds;
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const zCode = zoneToCode(smp.zone);
    const bridgeFlag = smp.isBridge ? 1 : 0;

    for (let c = 0; c < roadCols; c++) {
      const frac = c / (roadCols - 1); // 0 = left edge, 1 = right edge
      const lat = (frac * 2 - 1) * halfW;
      // Subtle road crown (+2.5 cm in center) for realistic visual & specular highlight
      const crown = Math.sin(frac * Math.PI) * 0.025;
      const vx = smp.pos.x + smp.right.x * lat + smp.up.x * crown;
      const vy = smp.pos.y + smp.right.y * lat + smp.up.y * crown;
      const vz = smp.pos.z + smp.right.z * lat + smp.up.z * crown;

      const idx = i * roadCols + c;
      rPos[idx * 3 + 0] = vx;
      rPos[idx * 3 + 1] = vy;
      rPos[idx * 3 + 2] = vz;
      rNorm[idx * 3 + 0] = smp.up.x;
      rNorm[idx * 3 + 1] = smp.up.y;
      rNorm[idx * 3 + 2] = smp.up.z;
      rUv[idx * 2 + 0] = frac;
      rUv[idx * 2 + 1] = (i * ds) / 6.0;
      rMeta[idx * 4 + 0] = s;
      rMeta[idx * 4 + 1] = zCode;
      rMeta[idx * 4 + 2] = bridgeFlag;
      rMeta[idx * 4 + 3] = smp.width;
    }
  }

  let ptr = 0;
  for (let i = 0; i < rings; i++) {
    for (let c = 0; c < roadCols - 1; c++) {
      const a = i * roadCols + c;
      const b = a + 1;
      const d = (i + 1) * roadCols + c;
      const e = d + 1;
      rIdx[ptr++] = a;
      rIdx[ptr++] = b;
      rIdx[ptr++] = d;
      rIdx[ptr++] = b;
      rIdx[ptr++] = e;
      rIdx[ptr++] = d;
    }
  }

  const roadGeom = new THREE.BufferGeometry();
  roadGeom.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  roadGeom.setAttribute('normal', new THREE.BufferAttribute(rNorm, 3));
  roadGeom.setAttribute('uv', new THREE.BufferAttribute(rUv, 2));
  roadGeom.setAttribute('aRoadMeta', new THREE.BufferAttribute(rMeta, 4));
  roadGeom.setIndex(new THREE.BufferAttribute(rIdx, 1));
  roadGeom.computeVertexNormals();

  const asphaltMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.78,
    metalness: 0.04,
  });
  const asphaltMesh = new THREE.Mesh(roadGeom, asphaltMaterial);
  asphaltMesh.name = 'road_asphalt';
  asphaltMesh.receiveShadow = true;
  asphaltMesh.castShadow = false;
  group.add(asphaltMesh);

  // ---------------------------------------------------------------------------
  // 2. Integrated Shoulders / Curbs (Z1/Z2/Z4) + Raised Stone Sidewalks (Z3)
  //    Flush with road edges, outer lip sunk -0.22 m into terrain shelf (zero seams!)
  // ---------------------------------------------------------------------------
  const shPos: number[] = [];
  const shUv: number[] = [];
  const shIdx: number[] = [];
  const swPos: number[] = [];
  const swUv: number[] = [];
  const swIdx: number[] = [];

  // Collider arrays combine EXACT road asphalt triangles + shoulder/curb triangles
  const colPos: number[] = Array.from(rPos);
  const colIdx: number[] = Array.from(rIdx);
  const colSurf: number[] = new Array(rIdx.length / 3).fill(0);
  // Mark bridge deck triangles as surface 3 ('bridge')
  for (let i = 0; i < rings; i++) {
    const sMid = ((i + 0.5) % rings) * ds;
    if (sMid >= track.spec.bridge.startS && sMid <= track.spec.bridge.endS) {
      const triStart = i * (roadCols - 1) * 2;
      for (let t = 0; t < (roadCols - 1) * 2; t++) colSurf[triStart + t] = 3;
    }
  }

  // Helper to append a ribbon profile along both sides of the road
  const addProfileQuadStrip = (
    targetPos: number[],
    targetUv: number[],
    targetIdx: number[],
    sIdxStart: number,
    sIdxEnd: number,
    side: -1 | 1,
    profile: Array<[number, number, number]>, // [offsetFromEdge, dy, uCoord]
    addToCollider: boolean,
    surfCode: number
  ) => {
    const pLen = profile.length;
    const baseVert = targetPos.length / 3;
    const colBaseVert = colPos.length / 3;
    const segs = sIdxEnd - sIdxStart;
    if (segs <= 0) return;

    for (let k = 0; k <= segs; k++) {
      const ringI = sIdxStart + k;
      const s = (ringI % rings) * ds;
      const smp = track.sampleAtS(s);
      const halfW = smp.width * 0.5;
      const vCoord = (ringI * ds) / 4.0;
      for (let p = 0; p < pLen; p++) {
        const [off, dy, uCoord] = profile[p];
        const lat = side * (halfW + off);
        const vx = smp.pos.x + smp.right.x * lat + smp.up.x * dy;
        const vy = smp.pos.y + smp.right.y * lat + smp.up.y * dy;
        const vz = smp.pos.z + smp.right.z * lat + smp.up.z * dy;
        targetPos.push(vx, vy, vz);
        targetUv.push(uCoord, vCoord);
        if (addToCollider) colPos.push(vx, vy, vz);
      }
    }

    for (let k = 0; k < segs; k++) {
      for (let p = 0; p < pLen - 1; p++) {
        const a = baseVert + k * pLen + p;
        const b = a + 1;
        const d = baseVert + (k + 1) * pLen + p;
        const e = d + 1;
        if (side === 1) {
          targetIdx.push(a, b, d, b, e, d);
        } else {
          targetIdx.push(a, d, b, b, d, e);
        }
        if (addToCollider) {
          const ca = colBaseVert + k * pLen + p;
          const cb = ca + 1;
          const cd = colBaseVert + (k + 1) * pLen + p;
          const ce = cd + 1;
          if (side === 1) {
            colIdx.push(ca, cb, cd, cb, ce, cd);
          } else {
            colIdx.push(ca, cd, cb, cb, cd, ce);
          }
          colSurf.push(surfCode, surfCode);
        }
      }
    }
  };

  // Partition rings into contiguous Z3 (sidewalk) vs non-Z3 (beveled curb + gravel/sand shoulder)
  let runStart = 0;
  let runIsZ3 = track.sampleAtS(0).zone === 'Z3';
  const flushRun = (startI: number, endI: number, isZ3: boolean) => {
    for (const side of [-1, 1] as const) {
      if (isZ3) {
        // Raised Mediterranean stone curb + 2.8m wide cobblestone sidewalk + sunk outer edge
        const swProfile: Array<[number, number, number]> = [
          [-0.02, 0.0, 0.0],
          [0.08, 0.13, 0.06],
          [0.32, 0.14, 0.14],
          [2.9, 0.14, 1.0],
          [3.1, -0.35, 1.12],
        ];
        addProfileQuadStrip(swPos, swUv, swIdx, startI, endI, side, swProfile, true, 1);
      } else {
        // Flush low curb + 2.1m graded verge shoulder tapering cleanly into terrain shelf
        const shProfile: Array<[number, number, number]> = [
          [-0.02, 0.0, 0.0],
          [0.28, 0.045, 0.15],
          [0.52, 0.01, 0.28],
          [2.2, -0.055, 0.9],
          [2.55, -0.26, 1.0],
        ];
        addProfileQuadStrip(shPos, shUv, shIdx, startI, endI, side, shProfile, true, 1);
      }
    }
  };

  for (let i = 1; i <= rings; i++) {
    const s = (i % rings) * ds;
    const smp = track.sampleAtS(s);
    const isZ3 = smp.zone === 'Z3';
    if (isZ3 !== runIsZ3 || i === rings) {
      flushRun(runStart, i, runIsZ3);
      runStart = i;
      runIsZ3 = isZ3;
    }
  }

  const shGeom = new THREE.BufferGeometry();
  shGeom.setAttribute('position', new THREE.Float32BufferAttribute(shPos, 3));
  shGeom.setAttribute('uv', new THREE.Float32BufferAttribute(shUv, 2));
  shGeom.setIndex(shIdx);
  shGeom.computeVertexNormals();
  const shoulderMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8d2c6,
    roughness: 0.9,
    metalness: 0.02,
  });
  const shoulderMesh = new THREE.Mesh(shGeom, shoulderMaterial);
  shoulderMesh.name = 'road_shoulders';
  shoulderMesh.receiveShadow = true;
  group.add(shoulderMesh);

  const swGeom = new THREE.BufferGeometry();
  swGeom.setAttribute('position', new THREE.Float32BufferAttribute(swPos, 3));
  swGeom.setAttribute('uv', new THREE.Float32BufferAttribute(swUv, 2));
  swGeom.setIndex(swIdx);
  swGeom.computeVertexNormals();
  const sidewalkMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6dfd3,
    roughness: 0.88,
    metalness: 0.02,
  });
  const sidewalkMesh = new THREE.Mesh(swGeom, sidewalkMaterial);
  sidewalkMesh.name = 'village_sidewalks';
  sidewalkMesh.receiveShadow = true;
  sidewalkMesh.castShadow = true;
  group.add(sidewalkMesh);

  return {
    group,
    asphaltMesh,
    shoulderMesh,
    sidewalkMesh,
    asphaltMaterial,
    shoulderMaterial,
    sidewalkMaterial,
    colliderData: {
      positions: new Float32Array(colPos),
      indices: new Uint32Array(colIdx),
      triSurface: new Uint8Array(colSurf),
    },
  };
}

/**
 * Enhances the main asphalt material with real scanned 2048px asphalt_main + asphalt_worn anti-tiling,
 * flush painted road markings, start/finish checkered line + grid boxes, and Z1 sand-drift edge decals
 * rendered purely inside the road shader (ZERO floating quads!).
 */
export function applyRoadPBRTextures(
  road: RoadSystem,
  track: TrackSpline,
  textures: {
    asphaltMain: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture; aoMap?: THREE.Texture };
    asphaltWorn: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    sand: { map: THREE.Texture; normalMap: THREE.Texture };
    gravel: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    sidewalk: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
  }
): void {
  const mat = road.asphaltMaterial;
  mat.map = textures.asphaltMain.map;
  mat.normalMap = textures.asphaltMain.normalMap;
  mat.normalScale.set(1.35, 1.35);
  mat.roughnessMap = textures.asphaltMain.roughnessMap;
  if (textures.asphaltMain.aoMap) mat.aoMap = textures.asphaltMain.aoMap;
  mat.roughness = 0.84;
  mat.metalness = 0.03;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWornMap = { value: textures.asphaltWorn.map };
    shader.uniforms.uSandMap = { value: textures.sand.map };
    shader.uniforms.uStartS = { value: track.spec.startFinishS };
    shader.uniforms.uTrackLen = { value: track.length };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec4 aRoadMeta;
        varying vec4 vRoadMeta;
        varying vec2 vRoadUv;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vRoadMeta = aRoadMeta;
        vRoadUv = uv;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D uWornMap;
        uniform sampler2D uSandMap;
        uniform float uStartS;
        uniform float uTrackLen;
        varying vec4 vRoadMeta;
        varying vec2 vRoadUv;`
      )
      .replace(
        '#include <map_fragment>',
        `
        vec2 uvMain = vec2(vRoadUv.x * 2.2, vRoadUv.y * 1.15);
        vec2 uvWorn = vec2(vRoadUv.x * 1.4, vRoadUv.y * 0.42);
        vec3 colA = texture2D(map, uvMain).rgb;
        vec3 colB = texture2D(uWornMap, uvWorn).rgb;

        float s = vRoadMeta.x;
        float zone = vRoadMeta.y;
        float u = vRoadUv.x; // 0 = left edge, 1 = right edge

        // Anti-tiling macro blend & dual wheel-track rubber darkening
        float macroBlend = 0.5 + 0.5 * sin(s * 0.043 + u * 3.1) * cos(s * 0.019 - u * 1.8);
        vec3 roadCol = mix(colA, colB, macroBlend * 0.45);
        // Darken asphalt slightly to realistic weathered Mediterranean tarmac
        roadCol *= 0.80;

        // Subtle racing-line rubber tracks around u=0.28 and u=0.72
        float track1 = exp(-pow((u - 0.30) / 0.10, 2.0));
        float track2 = exp(-pow((u - 0.70) / 0.10, 2.0));
        float rubber = (track1 + track2) * 0.14;
        roadCol *= (1.0 - rubber);

        // Crisp white edge lines (weathered by asphalt grain)
        float edgeDist = min(u, 1.0 - u);
        float edgeLine = smoothstep(0.052, 0.046, edgeDist) * smoothstep(0.020, 0.026, edgeDist);
        // Center dashed line (skip right on start/finish grid zone)
        float dsStart = abs(mod(s - uStartS + uTrackLen * 0.5, uTrackLen) - uTrackLen * 0.5);
        float dash = step(0.45, fract(s / 10.0));
        float centerLine = smoothstep(0.011, 0.006, abs(u - 0.5)) * dash * smoothstep(14.0, 24.0, dsStart);

        // Checkered Start/Finish line at uStartS (2m wide strip)
        float sfMask = smoothstep(1.3, 1.1, dsStart);
        float chkU = floor(u * 20.0);
        float chkS = floor((s - uStartS + 1.2) * 1.8);
        float checker = mod(chkU + chkS, 2.0);

        // Painted starting grid boxes behind start line (6 staggered slots: 10..48m behind uStartS)
        float behindStart = mod(uStartS - s + uTrackLen, uTrackLen);
        float gridLine = 0.0;
        if (behindStart > 6.0 && behindStart < 48.0) {
          for (int g = 0; g < 6; g++) {
            float gs = 9.0 + float(g) * 6.5;
            float gu = (mod(float(g), 2.0) < 0.5) ? 0.32 : 0.68;
            float frontBar = smoothstep(0.28, 0.18, abs(behindStart - gs)) * smoothstep(0.11, 0.095, abs(u - gu));
            float sideBars = smoothstep(0.015, 0.008, abs(abs(u - gu) - 0.105)) * step(gs, behindStart) * step(behindStart, gs + 2.2);
            gridLine = max(gridLine, max(frontBar, sideBars));
          }
        }

        // Paint weathering (asphalt pores show subtly through paint)
        float paintWear = clamp(0.68 + colA.r * 0.45, 0.55, 0.96);
        vec3 paintCol = vec3(0.90, 0.89, 0.85);
        roadCol = mix(roadCol, paintCol, max(edgeLine * 0.82, max(centerLine * 0.72, gridLine * 0.85)) * paintWear);
        if (sfMask > 0.01) {
          vec3 chkCol = mix(vec3(0.08, 0.08, 0.09), vec3(0.93, 0.92, 0.90), checker);
          roadCol = mix(roadCol, chkCol, sfMask * 0.90);
        }

        // Z1 Waterfront sand-drift transition softly encroaching on outer road edge (ZERO floating decals!)
        if (zone < 0.5) {
          float driftWave = 0.5 + 0.5 * sin(s * 0.065) * cos(s * 0.027 + 1.3);
          float driftReach = 0.04 + driftWave * 0.13;
          float leftDrift = (1.0 - smoothstep(0.0, driftReach, u)) * (0.45 + 0.55 * driftWave);
          float rightDrift = (1.0 - smoothstep(0.0, driftReach * 0.55, 1.0 - u)) * 0.42;
          float sandMask = clamp(max(leftDrift, rightDrift), 0.0, 0.86);
          vec3 sandCol = texture2D(uSandMap, vec2(u * 2.4, vRoadUv.y * 1.1)).rgb;
          roadCol = mix(roadCol, sandCol, sandMask);
        }

        // Subtle outer verge grime/dust blend on edges for grounded contact with curbs/shoulders
        float vergeDust = 1.0 - smoothstep(0.0, 0.055, edgeDist);
        roadCol = mix(roadCol, roadCol * vec3(0.92, 0.89, 0.83), vergeDust * 0.45);

        diffuseColor.rgb *= roadCol;
        `
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `
        #include <roughnessmap_fragment>
        // Slightly glossier rubber tracks & painted markings catch Golden Hour sunset sheen!
        float rTrack = exp(-pow((vRoadUv.x - 0.30) / 0.11, 2.0)) + exp(-pow((vRoadUv.x - 0.70) / 0.11, 2.0));
        roughnessFactor = clamp(roughnessFactor - rTrack * 0.16, 0.32, 0.95);
        `
      );
  };
  mat.customProgramCacheKey = () => 'road-asphalt-markings-sanddrift-v4';
  mat.needsUpdate = true;

  road.shoulderMaterial.map = textures.gravel.map;
  road.shoulderMaterial.normalMap = textures.gravel.normalMap;
  road.shoulderMaterial.roughnessMap = textures.gravel.roughnessMap;
  road.shoulderMaterial.needsUpdate = true;

  road.sidewalkMaterial.map = textures.sidewalk.map;
  road.sidewalkMaterial.normalMap = textures.sidewalk.normalMap;
  road.sidewalkMaterial.roughnessMap = textures.sidewalk.roughnessMap;
  road.sidewalkMaterial.needsUpdate = true;
}
