import * as THREE from 'three';
import { TrackSpline } from './track';
import { ZoneId } from './types';

function hash2D(ix: number, iz: number, seed: number): number {
  let n = ix * 374761393 + iz * 668265263 + seed * 1442695041;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

function valueNoise2D(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);

  const a = hash2D(ix, iz, seed);
  const b = hash2D(ix + 1, iz, seed);
  const c = hash2D(ix, iz + 1, seed);
  const d = hash2D(ix + 1, iz + 1, seed);

  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

export function fbm2D(x: number, z: number, seed: number, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    val += amp * valueNoise2D(x * freq, z * freq, seed + i * 97);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return val / norm;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export class TerrainField {
  public readonly minX = -720;
  public readonly maxX = 760;
  public readonly minZ = -280;
  public readonly maxZ = 760;
  public readonly step = 2.5;
  public readonly cols: number;
  public readonly rows: number;
  public readonly heights: Float32Array;
  public readonly trackDist: Float32Array;
  public readonly trackZone: Uint8Array;
  public readonly seed: number;

  constructor(track: TrackSpline) {
    this.seed = track.data.seed;
    this.cols = Math.round((this.maxX - this.minX) / this.step);
    this.rows = Math.round((this.maxZ - this.minZ) / this.step);
    const vx = this.cols + 1;
    const vz = this.rows + 1;
    const total = vx * vz;

    this.heights = new Float32Array(total);
    this.trackDist = new Float32Array(total);
    this.trackDist.fill(1e6);
    this.trackZone = new Uint8Array(total);

    const closestS = new Float32Array(total);
    const closestRoadY = new Float32Array(total);
    const closestEdgeY = new Float32Array(total);
    const closestHalfW = new Float32Array(total);
    const closestIsBridge = new Uint8Array(total);
    const closestLatSigned = new Float32Array(total);

    // Wide 95 m influence radius so surrounding hills, village terraces, and cliff slopes harmonize with roadY!
    const segCount = 1200;
    const influenceRadius = 95.0;

    for (let i = 0; i < segCount; i++) {
      const sA = (i / segCount) * track.totalLength;
      const sB = ((i + 1) / segCount) * track.totalLength;
      const a = track.sampleAtDistance(sA);
      const b = track.sampleAtDistance(sB);

      const minSegX = Math.min(a.pos.x, b.pos.x) - influenceRadius;
      const maxSegX = Math.max(a.pos.x, b.pos.x) + influenceRadius;
      const minSegZ = Math.min(a.pos.z, b.pos.z) - influenceRadius;
      const maxSegZ = Math.max(a.pos.z, b.pos.z) + influenceRadius;

      const ix0 = Math.max(0, Math.floor((minSegX - this.minX) / this.step));
      const ix1 = Math.min(this.cols, Math.ceil((maxSegX - this.minX) / this.step));
      const iz0 = Math.max(0, Math.floor((minSegZ - this.minZ) / this.step));
      const iz1 = Math.min(this.rows, Math.ceil((maxSegZ - this.minZ) / this.step));

      const vxSeg = b.pos.x - a.pos.x;
      const vzSeg = b.pos.z - a.pos.z;
      const len2 = vxSeg * vxSeg + vzSeg * vzSeg;
      if (len2 < 1e-8) continue;

      const midZone = a.zone === 'Z1' ? 1 : a.zone === 'Z2' ? 2 : a.zone === 'Z3' ? 3 : 4;

      for (let iz = iz0; iz <= iz1; iz++) {
        const wz = this.minZ + iz * this.step;
        for (let ix = ix0; ix <= ix1; ix++) {
          const wx = this.minX + ix * this.step;
          const t = Math.max(0, Math.min(1, ((wx - a.pos.x) * vxSeg + (wz - a.pos.z) * vzSeg) / len2));
          const px = a.pos.x + vxSeg * t;
          const pz = a.pos.z + vzSeg * t;
          const d = Math.hypot(wx - px, wz - pz);
          const idx = iz * vx + ix;

          if (d < this.trackDist[idx]) {
            this.trackDist[idx] = d;
            this.trackZone[idx] = midZone;
            const sInterp = sA + (sB - sA) * t;
            closestS[idx] = sInterp;

            const rx = a.right.x + (b.right.x - a.right.x) * t;
            const ry = a.right.y + (b.right.y - a.right.y) * t;
            const rz = a.right.z + (b.right.z - a.right.z) * t;
            const rLen = Math.hypot(rx, ry, rz) || 1;
            const rnx = rx / rLen;
            const rny = ry / rLen;
            const rnz = rz / rLen;

            const py = a.pos.y + (b.pos.y - a.pos.y) * t;
            const hw = (a.width + (b.width - a.width) * t) * 0.5;
            const lateral = (wx - px) * rnx + (wz - pz) * rnz;
            const clampedLat = Math.max(-hw, Math.min(hw, lateral));

            closestRoadY[idx] = py + rny * lateral;
            closestEdgeY[idx] = py + rny * clampedLat;
            closestHalfW[idx] = hw;
            closestLatSigned[idx] = lateral;
            closestIsBridge[idx] =
              sInterp >= track.bridgeStartS && sInterp <= track.bridgeEndS ? 1 : 0;
          }
        }
      }
    }

    const bStart = track.bridgeStartS;
    const bEnd = track.bridgeEndS;

    for (let iz = 0; iz < vz; iz++) {
      const wz = this.minZ + iz * this.step;
      for (let ix = 0; ix < vx; ix++) {
        const wx = this.minX + ix * this.step;
        const idx = iz * vx + ix;

        let natY = this.computeNaturalCoastalHeight(wx, wz);
        const d = this.trackDist[idx];

        if (d < influenceRadius) {
          const hw = closestHalfW[idx];
          const roadY = closestRoadY[idx];
          const edgeY = closestEdgeY[idx];
          const s = closestS[idx];
          const zCode = this.trackZone[idx];
          const latSigned = closestLatSigned[idx];
          const nDetail = fbm2D(wx * 0.025, wz * 0.025, this.seed + 55, 3) - 0.5;

          // Compute natural zone-coherent hillside/terrace target around the road!
          let zoneTargetY = natY;
          if (zCode === 3) {
            // Z3 Vila: Open-air coastal town terrace! Gentle street-level slope (+/- 2.5m) out to ~42m,
            // rising smoothly into scenic distant hills beyond 48m so houses NEVER hang on cliffs!
            const outerBeyondPlaza = smoothstep(32, 85, d);
            const gentleTownSlope = (latSigned < 0 ? 1.8 : -1.2) * smoothstep(hw + 3, 28, d) + nDetail * 1.6 * smoothstep(hw + 4, 24, d);
            const townLevel = edgeY + gentleTownSlope;
            zoneTargetY = townLevel * (1 - outerBeyondPlaza) + natY * outerBeyondPlaza;
          } else if (zCode === 4) {
            // Z4 Bosque: Rolling forested valley slopes (+8..14m hillside, dropping to gorge under bridge)
            const forestHill = (latSigned < 0 ? 8.5 : 4.5) * smoothstep(hw + 3, 42, d) + nDetail * 3.5 * smoothstep(hw + 4, 30, d);
            const outerBlend = smoothstep(35, 92, d);
            const forestTarget = Math.min(edgeY + forestHill, Math.max(edgeY - 3, natY));
            zoneTargetY = forestTarget * (1 - outerBlend) + natY * outerBlend;
            if (closestIsBridge[idx]) {
              zoneTargetY = natY; // Ravine drops cleanly beneath Z4 bridge!
            }
          } else if (zCode === 2) {
            // Z2 Falésia: Coastal cliff road — let sea-facing south/west side drop naturally toward Z1 bay/ocean,
            // while inland north/east hillside rises gently into craggy Mediterranean rock cliffs!
            const isInlandRise = wz > 235 || (wx > -220 && wz > 175);
            const cliffProfile = isInlandRise
              ? 13.0 * smoothstep(hw + 4, 48, d) + nDetail * 4.0 * smoothstep(hw + 5, 35, d)
              : -12.0 * smoothstep(hw + 4, 44, d);
            const outerBlend = smoothstep(32, 85, d);
            zoneTargetY = (edgeY + cliffProfile) * (1 - outerBlend) + natY * outerBlend;
          } else {
            // Z1 Orla: preserve sandy beach & sea slope on seaside (+latSigned), soft hillside inland (-latSigned)
            const outerBlend = smoothstep(hw + 2.4, 34, d);
            zoneTargetY = (edgeY - 0.04) * (1 - outerBlend) + natY * outerBlend;
          }

          // Bridge factor: 0 outside bridge, smoothly 1 in middle of bridge span
          let bridgeFactor = 0;
          if (closestIsBridge[idx]) {
            const distIntoBridge = Math.min(s - bStart, bEnd - s);
            bridgeFactor = smoothstep(2.0, 12.0, distIntoBridge);
          }

          if (d <= hw + 0.35) {
            const targetRoadBed = roadY - 0.06;
            this.heights[idx] =
              bridgeFactor > 0
                ? targetRoadBed * (1 - bridgeFactor) + Math.min(natY, roadY - 3.5) * bridgeFactor
                : targetRoadBed;
          } else if (d <= hw + 2.4) {
            const targetShoulder = edgeY - 0.04;
            this.heights[idx] =
              bridgeFactor > 0
                ? targetShoulder * (1 - bridgeFactor) + Math.min(natY, roadY - 3.5) * bridgeFactor
                : targetShoulder;
          } else {
            const outerDist = d - (hw + 2.4);
            const blend = smoothstep(0, 14.0, outerDist);
            const nonBridgeY = (edgeY - 0.04) * (1 - blend) + zoneTargetY * blend;
            this.heights[idx] =
              bridgeFactor > 0
                ? nonBridgeY * (1 - bridgeFactor) + natY * bridgeFactor
                : nonBridgeY;
          }
        } else {
          this.heights[idx] = natY;
        }
      }
    }
  }

  private computeNaturalCoastalHeight(x: number, z: number): number {
    const bayCurveZ = -108 + 20 * Math.sin(x * 0.0045) + 12 * Math.cos(x * 0.009);
    const westCliffX = -538 - Math.max(0, (z - 40) * 0.22) + 20 * Math.sin(z * 0.008);

    const dSouth = z - bayCurveZ;
    const dWest = x - westCliffX;
    const coastDist = Math.min(dSouth, dWest);

    const nLarge = fbm2D(x * 0.0032, z * 0.0032, this.seed, 4);
    const nMed = fbm2D(x * 0.012, z * 0.012, this.seed + 31, 3);
    const nFine = fbm2D(x * 0.045, z * 0.045, this.seed + 79, 2);

    if (coastDist < 0) {
      return Math.max(-16.0, coastDist * 0.24 + (nMed - 0.5) * 0.8);
    }

    // Gentle Mediterranean coastal hills (capped cleanly around ~52-62m rather than 92m canyons!)
    const beachFactor = smoothstep(0, 32, coastDist);
    const hillRise =
      smoothstep(25, 280, Math.max(0, z + 30)) * (26 + 24 * nLarge) +
      smoothstep(480, 740, z) * (10 + 18 * nLarge);

    const westernHeadland =
      smoothstep(-520, -280, x) * smoothstep(60, 260, z) * (12 + 12 * nMed);

    // Coastal gorge beneath Z4 bridge centered around (510, 55)
    const gx0 = 435, gz0 = 95, gx1 = 610, gz1 = 22;
    const gvx = gx1 - gx0, gvz = gz1 - gz0;
    const glen2 = gvx * gvx + gvz * gvz;
    const gt = Math.max(0, Math.min(1, ((x - gx0) * gvx + (z - gz0) * gvz) / glen2));
    const gorgeDist = Math.hypot(x - (gx0 + gvx * gt), z - (gz0 + gvz * gt));
    const gorgeCut = 1 - smoothstep(18, 56, gorgeDist);

    const rawInland =
      beachFactor * (2.6 + nMed * 2.2 + (nFine - 0.5) * 0.6) +
      hillRise +
      westernHeadland +
      nLarge * 8 * smoothstep(20, 140, coastDist);

    const gorgeFloor = 1.6 + (nFine - 0.5) * 0.5;
    return Math.max(
      coastDist > 12 ? 1.0 : 0.0,
      rawInland * (1 - gorgeCut * 0.92) + gorgeFloor * (gorgeCut * 0.92)
    );
  }

  public getHeightAt(x: number, z: number): number {
    const fx = (x - this.minX) / this.step;
    const fz = (z - this.minZ) / this.step;
    if (fx < 0 || fx >= this.cols || fz < 0 || fz >= this.rows) {
      return this.computeNaturalCoastalHeight(x, z);
    }
    const ix = Math.min(this.cols - 1, Math.floor(fx));
    const iz = Math.min(this.rows - 1, Math.floor(fz));
    const tx = fx - ix;
    const tz = fz - iz;
    const vx = this.cols + 1;

    const h00 = this.heights[iz * vx + ix];
    const h10 = this.heights[iz * vx + (ix + 1)];
    const h01 = this.heights[(iz + 1) * vx + ix];
    const h11 = this.heights[(iz + 1) * vx + (ix + 1)];

    const h0 = h00 + (h10 - h00) * tx;
    const h1 = h01 + (h11 - h01) * tx;
    return h0 + (h1 - h0) * tz;
  }

  public getSlopeAt(x: number, z: number): number {
    const e = 1.5;
    const hx = (this.getHeightAt(x + e, z) - this.getHeightAt(x - e, z)) / (2 * e);
    const hz = (this.getHeightAt(x, z + e) - this.getHeightAt(x, z - e)) / (2 * e);
    return Math.hypot(hx, hz);
  }

  public getNormalAt(x: number, z: number): THREE.Vector3 {
    const e = 1.5;
    const hx = (this.getHeightAt(x + e, z) - this.getHeightAt(x - e, z)) / (2 * e);
    const hz = (this.getHeightAt(x, z + e) - this.getHeightAt(x, z - e)) / (2 * e);
    return new THREE.Vector3(-hx, 1, -hz).normalize();
  }

  public getZoneAt(x: number, z: number): ZoneId {
    const fx = Math.round((x - this.minX) / this.step);
    const fz = Math.round((z - this.minZ) / this.step);
    if (fx >= 0 && fx <= this.cols && fz >= 0 && fz <= this.rows) {
      const zCode = this.trackZone[fz * (this.cols + 1) + fx];
      if (zCode === 1) return 'Z1';
      if (zCode === 2) return 'Z2';
      if (zCode === 3) return 'Z3';
      if (zCode === 4) return 'Z4';
    }
    return z > 380 ? 'Z3' : x < -100 ? 'Z2' : x > 380 ? 'Z4' : 'Z1';
  }

  public buildMeshGeometry(): THREE.BufferGeometry {
    const vx = this.cols + 1;
    const vz = this.rows + 1;
    const count = vx * vz;

    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const splat = new Float32Array(count * 4);

    for (let iz = 0; iz < vz; iz++) {
      const wz = this.minZ + iz * this.step;
      for (let ix = 0; ix < vx; ix++) {
        const wx = this.minX + ix * this.step;
        const idx = iz * vx + ix;
        const y = this.heights[idx];

        positions[idx * 3] = wx;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = wz;

        uvs[idx * 2] = (wx - this.minX) / 24.0;
        uvs[idx * 2 + 1] = (wz - this.minZ) / 24.0;

        const ixL = Math.max(0, ix - 1);
        const ixR = Math.min(this.cols, ix + 1);
        const izD = Math.max(0, iz - 1);
        const izU = Math.min(this.rows, iz + 1);
        const dhx = (this.heights[iz * vx + ixR] - this.heights[iz * vx + ixL]) / ((ixR - ixL) * this.step);
        const dhz = (this.heights[izU * vx + ix] - this.heights[izD * vx + ix]) / ((izU - izD) * this.step);
        const slope = Math.hypot(dhx, dhz);

        const sandW = 1 - smoothstep(2.2, 6.0, y);
        const wetW = 1 - smoothstep(-0.2, 1.35, y);
        const rockW = smoothstep(0.42, 0.85, slope);
        const forestW =
          smoothstep(340, 470, wx) * (1 - smoothstep(280, 410, wz)) * smoothstep(2.5, 8.0, y);

        splat[idx * 4] = sandW;
        splat[idx * 4 + 1] = wetW;
        splat[idx * 4 + 2] = rockW;
        splat[idx * 4 + 3] = forestW;
      }
    }

    const indices = new Uint32Array(this.cols * this.rows * 6);
    let ptr = 0;
    for (let iz = 0; iz < this.rows; iz++) {
      for (let ix = 0; ix < this.cols; ix++) {
        const a = iz * vx + ix;
        const b = a + 1;
        const c = (iz + 1) * vx + ix;
        const d = c + 1;
        indices[ptr++] = a;
        indices[ptr++] = c;
        indices[ptr++] = b;
        indices[ptr++] = b;
        indices[ptr++] = c;
        indices[ptr++] = d;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geom.setAttribute('aSplat', new THREE.BufferAttribute(splat, 4));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeVertexNormals();
    return geom;
  }

  public buildRapierHeightfieldData(): {
    nrows: number;
    ncols: number;
    heights: Float32Array;
    scale: { x: number; y: number; z: number };
    center: { x: number; y: number; z: number };
  } {
    const vx = this.cols + 1;
    const vz = this.rows + 1;
    const colMajor = new Float32Array(vx * vz);
    for (let ix = 0; ix < vx; ix++) {
      for (let iz = 0; iz < vz; iz++) {
        colMajor[ix * vz + iz] = this.heights[iz * vx + ix];
      }
    }
    return {
      nrows: this.rows,
      ncols: this.cols,
      heights: colMajor,
      scale: {
        x: this.maxX - this.minX,
        y: 1.0,
        z: this.maxZ - this.minZ,
      },
      center: {
        x: (this.minX + this.maxX) * 0.5,
        y: 0,
        z: (this.minZ + this.maxZ) * 0.5,
      },
    };
  }
}
