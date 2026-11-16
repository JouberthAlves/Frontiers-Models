import RAPIER from '@dimforge/rapier3d-compat';
import { TrackSpline } from './track';
import { TerrainField } from './terrain';
import { RoadMeshData } from './types';

export const COLLISION_GROUP_WORLD = 0x0001;
export const COLLISION_GROUP_CAR = 0x0002;

export class PhysicsWorld {
  public readonly world: RAPIER.World;
  public readonly roadCollider: RAPIER.Collider;
  public readonly terrainCollider: RAPIER.Collider;
  public readonly barrierColliders: RAPIER.Collider[] = [];
  private readonly fixedDt = 1 / 120;
  private accumulator = 0;

  private constructor(
    world: RAPIER.World,
    roadCollider: RAPIER.Collider,
    terrainCollider: RAPIER.Collider
  ) {
    this.world = world;
    this.roadCollider = roadCollider;
    this.terrainCollider = terrainCollider;
  }

  public static async create(
    track: TrackSpline,
    terrain: TerrainField,
    roadData: RoadMeshData
  ): Promise<PhysicsWorld> {
    await RAPIER.init();
    const gravity = { x: 0.0, y: -15.5, z: 0.0 }; // slightly snappy arcade gravity
    const world = new RAPIER.World(gravity);
    world.integrationParameters.dt = 1 / 120;

    // 1. Road TriMesh collider from EXACT same road data as visual mesh
    const roadBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    const roadDesc = RAPIER.ColliderDesc.trimesh(
      roadData.colliderPositions,
      roadData.colliderIndices
    )
      .setFriction(0.95)
      .setRestitution(0.05)
      .setCollisionGroups((COLLISION_GROUP_WORLD << 16) | 0xffff);
    const roadCollider = world.createCollider(roadDesc, roadBody);

    // 2. Terrain Heightfield collider from EXACT same terrain heightfield
    const hf = terrain.buildRapierHeightfieldData();
    const terrainBody = world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(hf.center.x, hf.center.y, hf.center.z)
    );
    const terrainDesc = RAPIER.ColliderDesc.heightfield(
      hf.nrows,
      hf.ncols,
      hf.heights,
      hf.scale
    )
      .setFriction(0.8)
      .setRestitution(0.05)
      .setCollisionGroups((COLLISION_GROUP_WORLD << 16) | 0xffff);
    const terrainCollider = world.createCollider(terrainDesc, terrainBody);

    const pw = new PhysicsWorld(world, roadCollider, terrainCollider);
    pw.buildGuardrailAndSafetyWalls(track);
    // Populate Rapier's QueryPipeline BVH before any spawn/validation raycasts!
    world.step();
    return pw;
  }

  private buildGuardrailAndSafetyWalls(track: TrackSpline): void {
    // Continuous two-sided safety barrier colliders built smoothly from spline!
    // Smoothly transitions at bridge approaches so zero gaps or seams exist.
    const segs = 600;
    const positions: number[] = [];
    const indices: number[] = [];
    let vBase = 0;

    const addContinuousWall = (side: -1 | 1) => {
      const baseStart = vBase;
      for (let i = 0; i <= segs; i++) {
        const s = ((i % segs) / segs) * track.totalLength;
        const samp = track.sampleAtDistance(s);
        const nearBridge =
          s >= track.bridgeStartS - 18 && s <= track.bridgeEndS + 18;
        const offsetExtra = nearBridge
          ? 0.25
          : samp.zone === 'Z2'
            ? (side === -1 ? 1.1 : 1.7)
            : samp.zone === 'Z3'
              ? 2.1
              : 2.5;
        const lat = side * (samp.width * 0.5 + offsetExtra);
        const bx = samp.pos.x + samp.right.x * lat;
        const by = samp.pos.y + samp.right.y * lat - 2.0;
        const bz = samp.pos.z + samp.right.z * lat;

        positions.push(bx, by, bz);
        positions.push(bx, by + 5.2, bz);
        vBase += 2;
      }

      for (let i = 0; i < segs; i++) {
        const a = baseStart + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        // Emit both windings so Rapier tri-mesh collision blocks robustly from either side at high speed
        indices.push(a, b, c, b, d, c);
        indices.push(a, c, b, b, c, d);
      }
    };

    addContinuousWall(-1);
    addContinuousWall(1);

    const wallBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    const wallDesc = RAPIER.ColliderDesc.trimesh(
      new Float32Array(positions),
      new Uint32Array(indices)
    )
      .setFriction(0.16)
      .setRestitution(0.18)
      .setCollisionGroups((COLLISION_GROUP_WORLD << 16) | 0xffff);
    const col = this.world.createCollider(wallDesc, wallBody);
    this.barrierColliders.push(col);
  }

  public addStaticCylinderCollider(x: number, y: number, z: number, radius: number, halfHeight: number): RAPIER.Collider {
    const rb = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(x, y + halfHeight, z)
    );
    const desc = RAPIER.ColliderDesc.cylinder(halfHeight, radius)
      .setFriction(0.25)
      .setRestitution(0.2)
      .setCollisionGroups((COLLISION_GROUP_WORLD << 16) | 0xffff);
    return this.world.createCollider(desc, rb);
  }

  public step(frameDt: number, onSubStep: (dt: number) => void): number {
    const clamped = Math.min(frameDt, 1 / 20);
    this.accumulator += clamped;
    let steps = 0;
    while (this.accumulator >= this.fixedDt && steps < 6) {
      onSubStep(this.fixedDt);
      this.world.step();
      this.accumulator -= this.fixedDt;
      steps++;
    }
    return steps;
  }

  public raycastGround(
    x: number,
    y: number,
    z: number,
    maxDist: number,
    excludeColliderHandle?: number
  ): { hitY: number; normal: { x: number; y: number; z: number }; isRoad: boolean } | null {
    const ray = new RAPIER.Ray({ x, y, z }, { x: 0, y: -1, z: 0 });
    const hit = this.world.castRayAndGetNormal(
      ray,
      maxDist,
      true,
      undefined,
      (COLLISION_GROUP_WORLD << 16) | COLLISION_GROUP_WORLD,
      undefined,
      undefined,
      (col) => col.handle !== excludeColliderHandle
    );
    if (!hit) return null;
    return {
      hitY: y - hit.timeOfImpact,
      normal: hit.normal,
      isRoad: hit.collider.handle === this.roadCollider.handle,
    };
  }
}
