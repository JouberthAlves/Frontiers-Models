import * as THREE from 'three';
import { SurfaceType, ZoneId } from '../types';
import { TrackSpline } from './trackSpline';
import { clamp, fbm2D, lerp, smoothstep } from '../utils/rng';

export interface TerrainConfig {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  cellSize: number;
}

export class TerrainSystem {
  readonly cfg: TerrainConfig;
  readonly cols: number;
  readonly rows: number;
  readonly heights: Float32Array;
  readonly splats: Float32Array; // 4 floats per vertex: sand, grass, forest, gravel
  readonly mesh: THREE.Mesh;
  readonly material: THREE.MeshStandardMaterial;
  triplanarActive = false;

  private readonly track: TrackSpline;
  private readonly plazaCenter: THREE.Vector3;
  private readonly plazaRadius: number;

  constructor(track: TrackSpline, cfg?: Partial<TerrainConfig>) {
    this.track = track;
    this.cfg = {
      minX: cfg?.minX ?? -320,
      maxX: cfg?.maxX ?? 940,
      minZ: cfg?.minZ ?? -740,
      maxZ: cfg?.maxZ ?? 740,
      cellSize: cfg?.cellSize ?? 3.0,
    };
    this.cols = Math.ceil((this.cfg.maxX - this.cfg.minX) / this.cfg.cellSize) + 1;
    this.rows = Math.ceil((this.cfg.maxZ - this.cfg.minZ) / this.cfg.cellSize) + 1;
    this.heights = new Float32Array(this.cols * this.rows);
    this.splats = new Float32Array(this.cols * this.rows * 4);

    // Compute exact plaza world center from track spec
    const pSmp = track.sampleAtS(track.spec.plaza.s);
    this.plazaRadius = track.spec.plaza.radius;
    this.plazaCenter = pSmp.pos
      .clone()
      .addScaledVector(pSmp.flatRight, track.spec.plaza.side * track.spec.plaza.offset);

    this.buildHeightfield();

    // Build visual BufferGeometry directly from the exact same heightfield
    const geom = this.buildGeometry();
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.92,
      metalness: 0.0,
    });
    this.mesh = new THREE.Mesh(geom, this.material);
    this.mesh.name = 'terrain_main';
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }

  getPlazaCenter(): THREE.Vector3 {
    return this.plazaCenter.clone();
  }

  private buildHeightfield(): void {
    const { minX, minZ, cellSize } = this.cfg;
    const { cols, rows, track } = this;
    const seed = track.spec.seed;

    // Spatial hash of spline samples for fast O(1) closest-sample lookup per grid vertex
    const bucketSize = 24;
    const buckets = new Map<string, number[]>();
    const samples = track.samples;
    for (let i = 0; i < samples.length; i++) {
      const bx = Math.floor(samples[i].pos.x / bucketSize);
      const bz = Math.floor(samples[i].pos.z / bucketSize);
      const key = `${bx},${bz}`;
      let list = buckets.get(key);
      if (!list) {
        list = [];
        buckets.set(key, list);
      }
      list.push(i);
    }

    const findNearestSample = (x: number, z: number) => {
      const bx = Math.floor(x / bucketSize);
      const bz = Math.floor(z / bucketSize);
      let bestIdx = -1;
      let bestD2 = Infinity;
      // Search 3x3 buckets (~72m radius — covers all road + embankment influence!)
      for (let dz = -2; dz <= 2; dz++) {
        for (let dx = -2; dx <= 2; dx++) {
          const list = buckets.get(`${bx + dx},${bz + dz}`);
          if (!list) continue;
          for (let k = 0; k < list.length; k++) {
            const idx = list[k];
            const p = samples[idx].pos;
            const d2 = (x - p.x) ** 2 + (z - p.z) ** 2;
            if (d2 < bestD2) {
              bestD2 = d2;
              bestIdx = idx;
            }
          }
        }
      }
      if (bestIdx < 0) return null;
      // Refine linearly along tangent using neighbor sample
      const s0 = samples[bestIdx];
      const rx = x - s0.pos.x;
      const rz = z - s0.pos.z;
      const tFlatLen = Math.hypot(s0.tangent.x, s0.tangent.z) || 1;
      const along = (rx * s0.tangent.x + rz * s0.tangent.z) / tFlatLen;
      const sRefined = track.wrapS(s0.s + clamp(along, -track.sampleStep * 1.1, track.sampleStep * 1.1));
      const smp = track.sampleAtS(sRefined);
      const dx = x - smp.pos.x;
      const dz = z - smp.pos.z;
      const lateral = dx * smp.flatRight.x + dz * smp.flatRight.z;
      const distXZ = Math.hypot(dx, dz);
      return { smp, lateral, distXZ };
    };

    const bridge = track.spec.bridge;

    for (let r = 0; r < rows; r++) {
      const z = minZ + r * cellSize;
      for (let c = 0; c < cols; c++) {
        const x = minX + c * cellSize;
        const vIdx = r * cols + c;

        // 1. Natural Mediterranean coastal peninsula topography:
        //    Open turquoise sea wraps BOTH the Western bay (Z1) AND the Northern cliff headland (Z2)!
        const bayCurve = 28 * Math.exp(-(((z + 30) / 310) ** 2)) + 12 * Math.sin(z * 0.0065);
        const southHeadland = smoothstep(390, 620, z) * 90;
        const westShoreX = -32 - bayCurve - southHeadland;
        const dWest = x - westShoreX;

        // Northern coastal cliff shoreline curves cleanly around Z2 and wraps organically down the NE/E edge
        // so the island/peninsula has zero harsh rectangular terrain-boundary cutoffs!
        const northShoreZ =
          -375 - 212 * Math.exp(-(((x - 215) / 225) ** 2)) + smoothstep(420, 820, x) * 145;
        const dNorth = z - northShoreZ;
        const eastShoreX = 885 - smoothstep(250, -340, z) * 105 + Math.sin(z * 0.008) * 24;
        const dEast = eastShoreX - x;
        const southShoreZ = 715 - smoothstep(240, -60, x) * 38 + Math.cos(x * 0.007) * 20;
        const dSouth = southShoreZ - z;

        // Smooth organic Mediterranean island/peninsula coastline (soft-min of all 4 coastal edges!)
        const smin = (a: number, b: number, k: number) => {
          const t = clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
          return lerp(b, a, t) - k * t * (1 - t);
        };
        const distInland = smin(smin(dWest, dNorth, 44), smin(dEast, dSouth, 48), 52);

        const macroNoise = fbm2D(x * 0.0022, z * 0.0022, 4, seed + 11);
        const medNoise = fbm2D(x * 0.0075, z * 0.0075, 3, seed + 29);
        const fineNoise = fbm2D(x * 0.024, z * 0.024, 2, seed + 53);

        let h: number;
        if (distInland < 0) {
          // Gentle sandy seabed shelving into turquoise shallows -> deep Mediterranean azure
          const depthT = clamp(-distInland / 180, 0, 1);
          h = -Math.pow(depthT, 1.2) * 20.0 + medNoise * 0.7;
        } else if (distInland < 36) {
          // Along Z1 western bay: gentle golden sandy beach; along northern cliff cape (z < -390): steeper rocky cliff drop!
          const t = distInland / 36;
          const northCliffFactor = smoothstep(-350, -480, z) * smoothstep(30, 140, x);
          const beachH = t * 2.55 + medNoise * 0.35 * t + fineNoise * 0.12 * t;
          const cliffSlopeH = Math.pow(t, 1.35) * 16.0 + medNoise * 2.2 * t;
          h = lerp(beachH, cliffSlopeH, northCliffFactor);
        } else {
          // Coastal hills rising gently inland toward the Z3 Mediterranean village ridge (keeping valley open to Z1 bay!)
          const hillT = smoothstep(36, 540, distInland);
          const ridgeBoost =
            54 * Math.pow(hillT, 0.96) +
            // Dramatic mountain massif backdrop east of Z3 village (x > 690)
            smoothstep(670, 920, x) * (46 + macroNoise * 26) +
            macroNoise * 14 * hillT +
            medNoise * 4.8 * hillT +
            fineNoise * 0.85;
          h = 2.55 + ridgeBoost;
        }

        // Default splat weights (sand, grass, forest, gravel)
        let wSand = 1.0 - smoothstep(1.8, 7.5, h);
        let wGrass = smoothstep(2.0, 9.0, h) * (0.65 + 0.35 * macroNoise);
        let wForest = smoothstep(10.0, 32.0, h) * smoothstep(80, 380, z);
        let wGravel = 0.0;

        // 2. Flatten Z3 central plaza pad seamlessly onto the hillside
        const dPlaza = Math.hypot(x - this.plazaCenter.x, z - this.plazaCenter.z);
        if (dPlaza < this.plazaRadius + 16) {
          const tP = 1.0 - smoothstep(this.plazaRadius * 0.85, this.plazaRadius + 16, dPlaza);
          const targetPlazaY = this.plazaCenter.y + 0.08;
          h = lerp(h, targetPlazaY, tP);
          wGravel = Math.max(wGravel, tP * 0.9);
          wGrass *= 1 - tP * 0.8;
        }

        // 3. Exact single-source-of-truth road carving + smooth 8-15m embankments
        const near = findNearestSample(x, z);
        if (near) {
          const { smp, lateral } = near;
          const halfW = smp.width * 0.5;
          const absLat = Math.abs(lateral);
          const clampedLat = clamp(lateral, -halfW - 2.0, halfW + 2.0);
          const roadY = track.roadSurfaceY(smp, clampedLat);

          // Check if near Z4 Viaduct Bridge ravine span
          const distFromBridgeStart = smp.s - bridge.startS;
          const distFromBridgeEnd = bridge.endS - smp.s;
          const bridgeInterior =
            smoothstep(4, 22, distFromBridgeStart) * smoothstep(4, 22, distFromBridgeEnd);

          // Always compute road-carved height FIRST so bridge abutments meet the road deck with zero poke!
          const shelfHalf = halfW + (smp.zone === 'Z3' ? 4.4 : 3.8);
          let embankOuter = shelfHalf + 13.5;

          let naturalTarget = h;
          if (smp.zone === 'Z2') {
            // Smoothly blend sea-overlook vs inner-cliff orientation across the switchback bends (zero sharp cliff step!)
            const flipIn = smoothstep(1135, 1205, smp.s);
            const flipOut = 1.0 - smoothstep(1345, 1415, smp.s);
            const switchBlend = flipIn * flipOut; // 0 = sea on -lateral, 1 = sea on +lateral
            const seaWeight = lateral < 0 ? 1.0 - switchBlend : switchBlend;
            const cliffWeight = 1.0 - seaWeight;
            if (absLat > shelfHalf) {
              const cliffRise = smoothstep(shelfHalf, shelfHalf + 18, absLat) * 26.0;
              const cliffTarget = Math.max(h, roadY + cliffRise + medNoise * 4.5);
              const seaDrop = smoothstep(shelfHalf, shelfHalf + 26, absLat) * Math.max(12, roadY - 1.0);
              const seaTarget = Math.min(h, Math.max(-2.0, roadY - 0.55 - seaDrop));
              naturalTarget = lerp(seaTarget, cliffTarget, cliffWeight);
              embankOuter = shelfHalf + 11.0;
            }
          } else if (smp.zone === 'Z1' && lateral < -shelfHalf) {
            const beachDrop = smoothstep(shelfHalf, shelfHalf + 26, absLat) * 2.7;
            naturalTarget = Math.min(h, Math.max(-3.0, roadY - 0.08 - beachDrop));
            embankOuter = shelfHalf + 10.0;
          } else if (smp.zone === 'Z3') {
            const terraceOuter = shelfHalf + 28;
            if (absLat < terraceOuter) {
              const tierStep = lateral > 0 ? 3.2 * smoothstep(shelfHalf + 6, shelfHalf + 22, lateral) : -2.2 * smoothstep(shelfHalf + 6, shelfHalf + 22, absLat);
              const villagePadY = roadY + 0.05 + tierStep;
              const padWeight = 1.0 - smoothstep(shelfHalf + 18, terraceOuter, absLat);
              naturalTarget = lerp(h, villagePadY, padWeight * 0.72);
            }
            embankOuter = shelfHalf + 9.5;
          }

          if (absLat <= halfW - 0.35) {
            h = roadY - 0.12;
          } else if (absLat <= shelfHalf) {
            const tShelf = smoothstep(halfW - 0.35, halfW + 0.65, absLat);
            h = lerp(roadY - 0.12, roadY - 0.03, tShelf);
          } else if (absLat <= embankOuter) {
            const tEmb = smoothstep(shelfHalf, embankOuter, absLat);
            h = lerp(roadY - 0.03, naturalTarget, tEmb);
          } else if (smp.zone === 'Z2' && absLat <= embankOuter + 18) {
            const tOuter = 1.0 - smoothstep(embankOuter, embankOuter + 18, absLat);
            h = lerp(h, naturalTarget, tOuter);
          }

          if (bridgeInterior > 0.001 && absLat < 44) {
            const crossRavine = 1.0 - smoothstep(10, 44, absLat);
            const ravineTargetY = Math.max(1.2, roadY - bridge.ravineDepth - 1.5 + fineNoise * 0.9);
            const carveW = bridgeInterior * crossRavine;
            h = lerp(h, ravineTargetY, carveW);
            wForest = Math.max(wForest, carveW * 0.8);
            wGravel = Math.max(wGravel, carveW * 0.35);
          }

          // Road-verge material blending per zone
          const vergeInfluence = 1.0 - smoothstep(halfW + 0.5, halfW + 7.0, absLat);
          if (vergeInfluence > 0.01) {
            if (smp.zone === 'Z1') {
              wSand = Math.max(wSand, vergeInfluence * 0.95);
              wGrass *= 1 - vergeInfluence * 0.85;
            } else if (smp.zone === 'Z2') {
              wGravel = Math.max(wGravel, vergeInfluence * 0.92);
            } else if (smp.zone === 'Z3') {
              wGravel = Math.max(wGravel, vergeInfluence * 0.85);
              wGrass *= 1 - vergeInfluence * 0.6;
            } else {
              wForest = Math.max(wForest, vergeInfluence * 0.78);
              wGravel = Math.max(wGravel, vergeInfluence * 0.35);
            }
          }
        }

        // Normalize splat weights cleanly
        const sumW = Math.max(1e-4, wSand + wGrass + wForest + wGravel);
        this.heights[vIdx] = h;
        const sIdx = vIdx * 4;
        this.splats[sIdx + 0] = wSand / sumW;
        this.splats[sIdx + 1] = wGrass / sumW;
        this.splats[sIdx + 2] = wForest / sumW;
        this.splats[sIdx + 3] = wGravel / sumW;
      }
    }
  }

  private buildGeometry(): THREE.BufferGeometry {
    const { minX, minZ, cellSize } = this.cfg;
    const { cols, rows, heights, splats } = this;
    const vertCount = cols * rows;
    const positions = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);
    const splatAttr = new Float32Array(vertCount * 4);

    for (let r = 0; r < rows; r++) {
      const z = minZ + r * cellSize;
      for (let c = 0; c < cols; c++) {
        const x = minX + c * cellSize;
        const i = r * cols + c;
        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = heights[i];
        positions[i * 3 + 2] = z;
        // World-scaled UVs (1 tile = 8m)
        uvs[i * 2 + 0] = x / 8.0;
        uvs[i * 2 + 1] = z / 8.0;
        splatAttr[i * 4 + 0] = splats[i * 4 + 0];
        splatAttr[i * 4 + 1] = splats[i * 4 + 1];
        splatAttr[i * 4 + 2] = splats[i * 4 + 2];
        splatAttr[i * 4 + 3] = splats[i * 4 + 3];
      }
    }

    const quadCount = (cols - 1) * (rows - 1);
    const indices = new Uint32Array(quadCount * 6);
    let ptr = 0;
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = r * cols + c;
        const b = a + 1;
        const d = (r + 1) * cols + c;
        const e = d + 1;
        indices[ptr++] = a;
        indices[ptr++] = d;
        indices[ptr++] = b;
        indices[ptr++] = b;
        indices[ptr++] = d;
        indices[ptr++] = e;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geom.setAttribute('aSplat', new THREE.BufferAttribute(splatAttr, 4));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();
    return geom;
  }

  /**
   * Exact bilinear height query — used by physics collider, object grounding raycasts, and validateWorld().
   */
  getHeight(x: number, z: number): number {
    const { minX, minZ, cellSize } = this.cfg;
    const fx = clamp((x - minX) / cellSize, 0, this.cols - 1.0001);
    const fz = clamp((z - minZ) / cellSize, 0, this.rows - 1.0001);
    const c0 = Math.floor(fx);
    const r0 = Math.floor(fz);
    const tx = fx - c0;
    const tz = fz - r0;
    const i00 = r0 * this.cols + c0;
    const h00 = this.heights[i00];
    const h10 = this.heights[i00 + 1];
    const h01 = this.heights[i00 + this.cols];
    const h11 = this.heights[i00 + this.cols + 1];
    // Match exact triangle split diagonal (a-d-b / b-d-e) so physics height matches visual mesh to 0.000m!
    if (tx + tz <= 1.0) {
      return h00 + (h10 - h00) * tx + (h01 - h00) * tz;
    } else {
      return h11 + (h01 - h11) * (1 - tx) + (h10 - h11) * (1 - tz);
    }
  }

  getNormal(x: number, z: number, out = new THREE.Vector3()): THREE.Vector3 {
    const eps = 0.75;
    const hL = this.getHeight(x - eps, z);
    const hR = this.getHeight(x + eps, z);
    const hD = this.getHeight(x, z - eps);
    const hU = this.getHeight(x, z + eps);
    return out.set(hL - hR, 2 * eps, hD - hU).normalize();
  }

  getSurfaceType(x: number, z: number): SurfaceType {
    const { minX, minZ, cellSize } = this.cfg;
    const c = clamp(Math.round((x - minX) / cellSize), 0, this.cols - 1);
    const r = clamp(Math.round((z - minZ) / cellSize), 0, this.rows - 1);
    const sIdx = (r * this.cols + c) * 4;
    const wSand = this.splats[sIdx];
    const wGrass = this.splats[sIdx + 1];
    const wForest = this.splats[sIdx + 2];
    const wGravel = this.splats[sIdx + 3];
    if (wSand >= wGrass && wSand >= wForest && wSand >= wGravel) return 'sand';
    if (wGravel >= wGrass && wGravel >= wForest) return 'gravel';
    return 'grass';
  }

  /**
   * Applies scanned Poly Haven PBR textures + full Triplanar cliff projection + wet-sand shoreline shader.
   */
  applyPBRTextures(textures: {
    sand: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    grass: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    forest: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    gravel: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
    cliff: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };
  }): void {
    const mat = this.material;
    // Set real file-backed base textures on material so scene audit detects real scanned PBR maps natively
    mat.map = textures.grass.map;
    mat.normalMap = textures.grass.normalMap;
    mat.roughnessMap = textures.grass.roughnessMap;
    mat.roughness = 0.94;
    mat.metalness = 0.0;

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSandMap = { value: textures.sand.map };
      shader.uniforms.uSandNorm = { value: textures.sand.normalMap };
      shader.uniforms.uForestMap = { value: textures.forest.map };
      shader.uniforms.uGravelMap = { value: textures.gravel.map };
      shader.uniforms.uCliffMap = { value: textures.cliff.map };
      shader.uniforms.uCliffNorm = { value: textures.cliff.normalMap };
      shader.uniforms.uSeaLevel = { value: this.track.spec.seaLevel };

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
          attribute vec4 aSplat;
          varying vec4 vSplat;
          varying vec3 vWorldPos;
          varying vec3 vWorldNorm;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          vSplat = aSplat;
          vec4 wp = modelMatrix * vec4(transformed, 1.0);
          vWorldPos = wp.xyz;
          vWorldNorm = normalize(mat3(modelMatrix) * objectNormal);`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          uniform sampler2D uSandMap;
          uniform sampler2D uSandNorm;
          uniform sampler2D uForestMap;
          uniform sampler2D uGravelMap;
          uniform sampler2D uCliffMap;
          uniform sampler2D uCliffNorm;
          uniform float uSeaLevel;
          varying vec4 vSplat;
          varying vec3 vWorldPos;
          varying vec3 vWorldNorm;

          vec4 triplanarSample(sampler2D tex, vec3 wp, vec3 wn, float scale) {
            vec3 blend = pow(abs(wn), vec3(4.0));
            blend /= max(blend.x + blend.y + blend.z, 0.0001);
            vec4 cx = texture2D(tex, wp.zy * scale);
            vec4 cy = texture2D(tex, wp.xz * scale);
            vec4 cz = texture2D(tex, wp.xy * scale);
            return cx * blend.x + cy * blend.y + cz * blend.z;
          }`
        )
        .replace(
          '#include <map_fragment>',
          `
          vec2 uvTile = vWorldPos.xz * 0.14;
          vec2 uvMacro = vWorldPos.xz * 0.023;
          float macroVar = 0.88 + 0.24 * sin(vWorldPos.x * 0.021 + sin(vWorldPos.z * 0.017) * 2.2) * cos(vWorldPos.z * 0.019);

          vec3 colSand = mix(texture2D(uSandMap, uvTile * 1.1).rgb, texture2D(uSandMap, uvMacro * 1.4).rgb, 0.28) * vec3(1.16, 1.09, 0.94);
          vec3 colGrass = mix(texture2D(map, uvTile * 0.95).rgb, texture2D(map, uvMacro * 1.2).rgb, 0.30) * vec3(0.76, 1.18, 0.64);
          vec3 colForest = mix(texture2D(uForestMap, uvTile * 0.85).rgb, texture2D(uForestMap, uvMacro * 1.1).rgb, 0.25) * vec3(0.84, 1.08, 0.72);
          vec3 colGravel = mix(texture2D(uGravelMap, uvTile * 1.2).rgb, texture2D(uGravelMap, uvMacro * 1.3).rgb, 0.25) * vec3(1.06, 1.02, 0.94);

          vec4 sw = vSplat;
          vec3 groundCol = (colSand * sw.x + colGrass * sw.y + colForest * sw.z + colGravel * sw.w) * macroVar;

          // Triplanar limestone cliff rock on steep slopes (ZERO vertical UV stretching!)
          vec3 wn = normalize(vWorldNorm);
          float cliffMask = smoothstep(0.89, 0.60, wn.y);
          vec3 cliffNear = triplanarSample(uCliffMap, vWorldPos, wn, 0.085).rgb;
          vec3 cliffFar = triplanarSample(uCliffMap, vWorldPos, wn, 0.022).rgb;
          // Sun-baked warm Mediterranean limestone strata modulation
          float strata = 0.88 + 0.16 * sin(vWorldPos.y * 0.95 + sin(vWorldPos.x * 0.08) * 1.4);
          vec3 colCliff = mix(cliffNear, cliffFar, 0.34) * vec3(1.26, 1.18, 1.04) * strata;
          groundCol = mix(groundCol, colCliff, cliffMask);

          // Wet sand shoreline darkening right above sea level
          float wetBand = (1.0 - smoothstep(uSeaLevel - 0.3, uSeaLevel + 1.15, vWorldPos.y)) * sw.x;
          groundCol = mix(groundCol, groundCol * vec3(0.42, 0.40, 0.38), wetBand * 0.88);

          diffuseColor.rgb *= groundCol;
          `
        )
        .replace(
          '#include <normal_fragment_maps>',
          `
          #include <normal_fragment_maps>
          {
            vec3 wnN = normalize(vWorldNorm);
            float cMaskN = smoothstep(0.89, 0.60, wnN.y);
            if (cMaskN > 0.01) {
              vec3 cB = pow(abs(wnN), vec3(4.0));
              cB /= max(cB.x + cB.y + cB.z, 0.0001);
              vec3 nX = texture2D(uCliffNorm, vWorldPos.zy * 0.085).xyz * 2.0 - 1.0;
              vec3 nY = texture2D(uCliffNorm, vWorldPos.xz * 0.085).xyz * 2.0 - 1.0;
              vec3 nZ = texture2D(uCliffNorm, vWorldPos.xy * 0.085).xyz * 2.0 - 1.0;
              vec3 triW = normalize(
                vec3(wnN.x, wnN.y + nX.y * 0.85, wnN.z + nX.x * 0.85) * cB.x +
                vec3(wnN.x + nY.x * 0.85, wnN.y, wnN.z + nY.y * 0.85) * cB.y +
                vec3(wnN.x + nZ.x * 0.85, wnN.y + nZ.y * 0.85, wnN.z) * cB.z
              );
              vec3 triV = normalize((viewMatrix * vec4(triW, 0.0)).xyz);
              normal = normalize(mix(normal, triV, cMaskN));
            }
          }
          `
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `
          #include <roughnessmap_fragment>
          float wetRoughMask = (1.0 - smoothstep(uSeaLevel - 0.3, uSeaLevel + 0.95, vWorldPos.y)) * vSplat.x;
          roughnessFactor = mix(roughnessFactor, 0.16, wetRoughMask * 0.92);
          `
        );
    };
    mat.customProgramCacheKey = () => 'terrain-triplanar-pbr-v4';
    mat.needsUpdate = true;
    this.triplanarActive = true;
  }
}
