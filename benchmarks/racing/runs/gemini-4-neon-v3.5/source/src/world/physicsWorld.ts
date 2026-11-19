import * as THREE from 'three';
import { RigidObstacleRecord, SurfaceType } from '../types';
import { RoadColliderData } from './roadMesh';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';

export interface RaycastSurfaceHit {
  hit: boolean;
  y: number;
  normal: THREE.Vector3;
  surface: SurfaceType;
}

export interface BarrierSegment {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  nx: number; // inward normal toward track
  nz: number;
  minY: number;
  maxY: number;
  kind: 'guardrail' | 'wall' | 'bridge';
}

export interface BarrierCollision {
  hit: boolean;
  pushX: number;
  pushZ: number;
  nx: number;
  nz: number;
  kind: 'guardrail' | 'wall' | 'bridge' | 'obstacle';
}

const SURF_LOOKUP: SurfaceType[] = ['asphalt', 'curb', 'gravel', 'bridge'];

/**
 * Exact spatial-grid triangle-mesh collider built directly from the visual Road Mesh +
 * exact bilinear Terrain Heightfield + Barrier Segments + Rigid Obstacle colliders.
 */
export class PhysicsWorld {
  readonly track: TrackSpline;
  readonly terrain: TerrainSystem;
  readonly roadData: RoadColliderData;
  readonly barriers: BarrierSegment[] = [];
  readonly obstacles: RigidObstacleRecord[] = [];

  private readonly cellSize = 8.0;
  private readonly roadTriGrid = new Map<string, number[]>();
  private readonly barrierGrid = new Map<string, number[]>();
  private readonly obstacleGrid = new Map<string, number[]>();

  constructor(track: TrackSpline, terrain: TerrainSystem, roadData: RoadColliderData) {
    this.track = track;
    this.terrain = terrain;
    this.roadData = roadData;
    this.indexRoadTriangles();
  }

  private gridKey(cx: number, cz: number): string {
    return `${cx},${cz}`;
  }

  private indexRoadTriangles(): void {
    const { positions, indices } = this.roadData;
    const triCount = indices.length / 3;
    const cs = this.cellSize;
    for (let t = 0; t < triCount; t++) {
      const i0 = indices[t * 3];
      const i1 = indices[t * 3 + 1];
      const i2 = indices[t * 3 + 2];
      const x0 = positions[i0 * 3], z0 = positions[i0 * 3 + 2];
      const x1 = positions[i1 * 3], z1 = positions[i1 * 3 + 2];
      const x2 = positions[i2 * 3], z2 = positions[i2 * 3 + 2];
      const minC = Math.floor(Math.min(x0, x1, x2) / cs);
      const maxC = Math.floor(Math.max(x0, x1, x2) / cs);
      const minR = Math.floor(Math.min(z0, z1, z2) / cs);
      const maxR = Math.floor(Math.max(z0, z1, z2) / cs);
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const k = this.gridKey(c, r);
          let arr = this.roadTriGrid.get(k);
          if (!arr) {
            arr = [];
            this.roadTriGrid.set(k, arr);
          }
          arr.push(t);
        }
      }
    }
  }

  addBarrierSegment(seg: BarrierSegment): void {
    const idx = this.barriers.length;
    this.barriers.push(seg);
    const cs = this.cellSize;
    const minC = Math.floor((Math.min(seg.ax, seg.bx) - 3) / cs);
    const maxC = Math.floor((Math.max(seg.ax, seg.bx) + 3) / cs);
    const minR = Math.floor((Math.min(seg.az, seg.bz) - 3) / cs);
    const maxR = Math.floor((Math.max(seg.az, seg.bz) + 3) / cs);
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const k = this.gridKey(c, r);
        let arr = this.barrierGrid.get(k);
        if (!arr) {
          arr = [];
          this.barrierGrid.set(k, arr);
        }
        arr.push(idx);
      }
    }
  }

  addObstacle(obs: RigidObstacleRecord): void {
    const idx = this.obstacles.length;
    this.obstacles.push(obs);
    const cs = this.cellSize;
    const pad = obs.radius + 2.0;
    const minC = Math.floor((obs.x - pad) / cs);
    const maxC = Math.floor((obs.x + pad) / cs);
    const minR = Math.floor((obs.z - pad) / cs);
    const maxR = Math.floor((obs.z + pad) / cs);
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const k = this.gridKey(c, r);
        let arr = this.obstacleGrid.get(k);
        if (!arr) {
          arr = [];
          this.obstacleGrid.set(k, arr);
        }
        arr.push(idx);
      }
    }
  }

  /**
   * Builds continuous outer/inner safety barriers derived strictly from TrackSpline arc-length
   * (sea cliffs, bridge parapets, seaside walls, village sidewalks/walls, outer track boundary).
   */
  buildSplineBarriers(): void {
    const segCount = 600;
    const ds = this.track.length / segCount;

    for (let i = 0; i < segCount; i++) {
      const s0 = i * ds;
      const s1 = ((i + 1) % segCount) * ds;
      const a = this.track.sampleAtS(s0);
      const b = this.track.sampleAtS(s1);

      // Build continuous safety barriers on BOTH sides so cars never fly off cliffs or tunnel out of world
      for (const side of [-1, 1] as const) {
        let offsetA: number;
        let offsetB: number;
        let kind: 'guardrail' | 'wall' | 'bridge';

        if (a.isBridge || b.isBridge) {
          offsetA = a.width * 0.5 + 0.65;
          offsetB = b.width * 0.5 + 0.65;
          kind = 'bridge';
        } else if (a.zone === 'Z3') {
          offsetA = a.width * 0.5 + 2.65;
          offsetB = b.width * 0.5 + 2.65;
          kind = 'wall';
        } else if (a.zone === 'Z2') {
          offsetA = a.width * 0.5 + (side === -1 ? 1.35 : 2.1);
          offsetB = b.width * 0.5 + (side === -1 ? 1.35 : 2.1);
          kind = side === -1 ? 'guardrail' : 'wall';
        } else if (a.zone === 'Z1') {
          offsetA = a.width * 0.5 + (side === -1 ? 2.1 : 2.4);
          offsetB = b.width * 0.5 + (side === -1 ? 2.1 : 2.4);
          kind = 'wall';
        } else {
          // Z4 coastal woods
          offsetA = a.width * 0.5 + 2.2;
          offsetB = b.width * 0.5 + 2.2;
          kind = 'guardrail';
        }

        const ax = a.pos.x + a.flatRight.x * side * offsetA;
        const az = a.pos.z + a.flatRight.z * side * offsetA;
        const bx = b.pos.x + b.flatRight.x * side * offsetB;
        const bz = b.pos.z + b.flatRight.z * side * offsetB;

        const dx = bx - ax;
        const dz = bz - az;
        const len = Math.hypot(dx, dz) || 1;
        // Normal pointing INWARD toward the road centerline
        let nx = -dz / len;
        let nz = dx / len;
        const midToCenterX = a.pos.x - ax;
        const midToCenterZ = a.pos.z - az;
        if (nx * midToCenterX + nz * midToCenterZ < 0) {
          nx = -nx;
          nz = -nz;
        }

        const minY = Math.min(a.pos.y, b.pos.y) - 2.0;
        const maxY = Math.max(a.pos.y, b.pos.y) + 3.5;
        this.addBarrierSegment({ ax, az, bx, bz, nx, nz, minY, maxY, kind });
      }
    }
  }

  /**
   * Exact vertical downward raycast against Road Mesh Triangles + Terrain Heightfield.
   * Guarantees chassis/wheels contact the exact visual road/bridge mesh (never a separate plane!).
   */
  raycastDown(x: number, originY: number, z: number, outHit?: RaycastSurfaceHit): RaycastSurfaceHit {
    const res: RaycastSurfaceHit = outHit ?? {
      hit: true,
      y: 0,
      normal: new THREE.Vector3(0, 1, 0),
      surface: 'grass',
    };

    const cs = this.cellSize;
    const c = Math.floor(x / cs);
    const r = Math.floor(z / cs);
    const tris = this.roadTriGrid.get(this.gridKey(c, r));

    let bestRoadY = -Infinity;
    let bestSurf: SurfaceType = 'asphalt';
    let bestNx = 0, bestNy = 1, bestNz = 0;

    if (tris) {
      const { positions, indices, triSurface } = this.roadData;
      for (let k = 0; k < tris.length; k++) {
        const t = tris[k];
        const i0 = indices[t * 3] * 3;
        const i1 = indices[t * 3 + 1] * 3;
        const i2 = indices[t * 3 + 2] * 3;
        const x0 = positions[i0], y0 = positions[i0 + 1], z0 = positions[i0 + 2];
        const x1 = positions[i1], y1 = positions[i1 + 1], z1 = positions[i1 + 2];
        const x2 = positions[i2], y2 = positions[i2 + 1], z2 = positions[i2 + 2];

        // 2D barycentric test in XZ plane
        const v0x = x1 - x0, v0z = z1 - z0;
        const v1x = x2 - x0, v1z = z2 - z0;
        const v2x = x - x0, v2z = z - z0;
        const denom = v0x * v1z - v1x * v0z;
        if (Math.abs(denom) < 1e-8) continue;
        const invD = 1 / denom;
        const u = (v2x * v1z - v1x * v2z) * invD;
        if (u < -1e-4 || u > 1.0001) continue;
        const v = (v0x * v2z - v2x * v0z) * invD;
        if (v < -1e-4 || u + v > 1.0001) continue;

        const y = y0 + u * (y1 - y0) + v * (y2 - y0);
        if (y <= originY + 1.8 && y > bestRoadY) {
          bestRoadY = y;
          bestSurf = SURF_LOOKUP[triSurface[t]] ?? 'asphalt';
          // Triangle normal
          const e1x = x1 - x0, e1y = y1 - y0, e1z = z1 - z0;
          const e2x = x2 - x0, e2y = y2 - y0, e2z = z2 - z0;
          let nx = e1y * e2z - e1z * e2y;
          let ny = e1z * e2x - e1x * e2z;
          let nz = e1x * e2y - e1y * e2x;
          if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
          const nLen = Math.hypot(nx, ny, nz) || 1;
          bestNx = nx / nLen;
          bestNy = ny / nLen;
          bestNz = nz / nLen;
        }
      }
    }

    const terrY = this.terrain.getHeight(x, z);
    if (bestRoadY > -1e5 && bestRoadY >= terrY - 0.08) {
      res.hit = true;
      res.y = bestRoadY;
      res.normal.set(bestNx, bestNy, bestNz);
      res.surface = bestSurf;
      return res;
    }

    res.hit = true;
    res.y = terrY;
    this.terrain.getNormal(x, z, res.normal);
    res.surface = this.terrain.getSurfaceType(x, z);
    return res;
  }

  /**
   * Resolves swept circle/capsule collision of car against nearby barrier segments & rigid obstacles.
   */
  resolveHorizontalCollision(
    x: number,
    y: number,
    z: number,
    radius: number
  ): BarrierCollision {
    const cs = this.cellSize;
    const c0 = Math.floor(x / cs);
    const r0 = Math.floor(z / cs);
    let totalPushX = 0;
    let totalPushZ = 0;
    let hit = false;
    let lastNx = 0;
    let lastNz = 0;
    let hitKind: BarrierCollision['kind'] = 'guardrail';

    const checkedBarriers = new Set<number>();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const list = this.barrierGrid.get(this.gridKey(c0 + dc, r0 + dr));
        if (!list) continue;
        for (let k = 0; k < list.length; k++) {
          const bIdx = list[k];
          if (checkedBarriers.has(bIdx)) continue;
          checkedBarriers.add(bIdx);
          const seg = this.barriers[bIdx];
          if (y < seg.minY || y > seg.maxY) continue;

          const curX = x + totalPushX;
          const curZ = z + totalPushZ;
          const abx = seg.bx - seg.ax;
          const abz = seg.bz - seg.az;
          const abLen2 = abx * abx + abz * abz;
          if (abLen2 < 1e-6) continue;
          const t = Math.max(0, Math.min(1, ((curX - seg.ax) * abx + (curZ - seg.az) * abz) / abLen2));
          const cx = seg.ax + abx * t;
          const cz = seg.az + abz * t;
          const dx = curX - cx;
          const dz = curZ - cz;
          const dist = Math.hypot(dx, dz);
          const signedSide = dx * seg.nx + dz * seg.nz;

          // Push back along inward normal if penetrating or crossing behind barrier
          if (signedSide < radius && dist < radius + 3.5) {
            // Confirm we're actually crossing the barrier plane near the segment (not on far side of loop)
            const pen = radius - signedSide;
            if (pen > 0 && pen < 4.0) {
              totalPushX += seg.nx * pen;
              totalPushZ += seg.nz * pen;
              hit = true;
              lastNx = seg.nx;
              lastNz = seg.nz;
              hitKind = seg.kind;
            }
          }
        }
      }
    }

    // Rigid obstacle circles (buildings, trunks, boulders)
    const checkedObs = new Set<number>();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const list = this.obstacleGrid.get(this.gridKey(c0 + dc, r0 + dr));
        if (!list) continue;
        for (let k = 0; k < list.length; k++) {
          const oIdx = list[k];
          if (checkedObs.has(oIdx)) continue;
          checkedObs.add(oIdx);
          const obs = this.obstacles[oIdx];
          const curX = x + totalPushX;
          const curZ = z + totalPushZ;
          const dx = curX - obs.x;
          const dz = curZ - obs.z;
          const minD = radius + obs.radius;
          const d2 = dx * dx + dz * dz;
          if (d2 < minD * minD && d2 > 1e-6) {
            const d = Math.sqrt(d2);
            const nx = dx / d;
            const nz = dz / d;
            const pen = minD - d;
            totalPushX += nx * pen;
            totalPushZ += nz * pen;
            hit = true;
            lastNx = nx;
            lastNz = nz;
            hitKind = 'obstacle';
          }
        }
      }
    }

    return { hit, pushX: totalPushX, pushZ: totalPushZ, nx: lastNx, nz: lastNz, kind: hitKind };
  }
}
