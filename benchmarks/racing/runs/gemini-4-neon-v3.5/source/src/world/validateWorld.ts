import { RigidObstacleRecord, WorldValidationError, WorldValidationReport } from '../types';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';

/**
 * Section 3.2 Structural Invariants Auditor.
 * Runs automatically on load in dev mode and inside all automated verification suites.
 */
export function validateWorld(
  track: TrackSpline,
  terrain: TerrainSystem,
  obstacles: RigidObstacleRecord[]
): WorldValidationReport {
  const errors: WorldValidationError[] = [];

  // 1. Track geometry invariants: banking <= 12 deg, grade <= 14%, corner radius >= 25 m
  if (track.maxBankingDeg > 12.0) {
    errors.push({
      invariant: 'road_banking',
      message: `Road banking ${track.maxBankingDeg.toFixed(2)}° exceeds 12° threshold`,
      value: track.maxBankingDeg,
      threshold: 12.0,
    });
  }
  const maxGradePct = track.maxGrade * 100;
  if (maxGradePct > 14.0) {
    errors.push({
      invariant: 'longitudinal_grade',
      message: `Longitudinal grade ${maxGradePct.toFixed(2)}% exceeds 14% threshold`,
      value: maxGradePct,
      threshold: 14.0,
    });
  }
  if (track.minRadius < 25.0) {
    errors.push({
      invariant: 'corner_radius',
      message: `Minimum corner radius ${track.minRadius.toFixed(2)} m below 25 m minimum`,
      value: track.minRadius,
      threshold: 25.0,
    });
  }

  // 2. Terrain vs Road invariants:
  //    - Terrain poking above road surface inside road width > 0.02 m
  //    - Gap or vertical step between road edge and terrain > 0.15 m (excluding bridge span)
  let maxPoke = 0;
  let maxEdgeStep = 0;
  const checkCount = 600;
  const bridge = track.spec.bridge;

  for (let i = 0; i < checkCount; i++) {
    const s = (i / checkCount) * track.length;
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const onBridge = s >= bridge.startS - 2 && s <= bridge.endS + 2;

    // Sample 7 points across road interior
    for (let k = -3; k <= 3; k++) {
      const lat = (k / 3) * (halfW - 0.15);
      const px = smp.pos.x + smp.right.x * lat;
      const pz = smp.pos.z + smp.right.z * lat;
      const roadY = track.roadSurfaceY(smp, lat);
      const terrY = terrain.getHeight(px, pz);
      const poke = terrY - roadY;
      if (poke > maxPoke) maxPoke = poke;
      if (poke > 0.02) {
        errors.push({
          invariant: 'terrain_poke_road',
          message: `Terrain pokes ${poke.toFixed(3)} m above road at s=${s.toFixed(1)}m lat=${lat.toFixed(1)}m`,
          value: poke,
          threshold: 0.02,
          location: [px, roadY, pz],
        });
      }
    }

    // Check road edge step on both sides outside bridge
    if (!onBridge) {
      for (const side of [-1, 1] as const) {
        const edgeLat = side * (halfW + 0.5);
        const px = smp.pos.x + smp.right.x * edgeLat;
        const pz = smp.pos.z + smp.right.z * edgeLat;
        const roadY = track.roadSurfaceY(smp, side * halfW);
        const terrY = terrain.getHeight(px, pz);
        const step = Math.abs(terrY - roadY);
        if (step > maxEdgeStep) maxEdgeStep = step;
        if (step > 0.15) {
          errors.push({
            invariant: 'road_edge_step',
            message: `Road edge step ${step.toFixed(3)} m exceeds 0.15 m at s=${s.toFixed(1)}m side=${side}`,
            value: step,
            threshold: 0.15,
            location: [px, roadY, pz],
          });
        }
      }
    }
  }

  // 3. Rigid obstacle exclusion zone (>= 3.0 m beyond road edge) & terrain grounding (<= 0.30 m)
  let obstaclesInExclusion = 0;
  let floatingObjects = 0;
  const buildings: RigidObstacleRecord[] = [];

  for (const obs of obstacles) {
    if (obs.kind === 'building') buildings.push(obs);

    // Check 3.0 m exclusion zone for buildings, tree trunks, boulders
    if (obs.kind === 'building' || obs.kind === 'tree' || obs.kind === 'boulder') {
      const nearest = track.closestPointXZ(obs.x, obs.z);
      const roadEdgeDist = Math.abs(nearest.lateral) - nearest.sample.width * 0.5 - obs.radius;
      if (roadEdgeDist < 3.0) {
        obstaclesInExclusion++;
        errors.push({
          invariant: 'exclusion_zone',
          message: `Rigid ${obs.kind} '${obs.id}' intrudes into 3m exclusion zone (clearance=${roadEdgeDist.toFixed(2)}m)`,
          value: roadEdgeDist,
          threshold: 3.0,
          location: [obs.x, obs.y, obs.z],
        });
      }
    }

    // Ground contact check (excluding rocks and sloped building foundations intentionally sunk)
    if (!obs.intentionalSink && obs.kind !== 'boulder') {
      const terrY = terrain.getHeight(obs.x, obs.z);
      const deltaY = Math.abs(obs.y - terrY);
      if (deltaY > 0.30) {
        floatingObjects++;
        errors.push({
          invariant: 'object_grounding',
          message: `Object '${obs.id}' (${obs.kind}) base offset ${deltaY.toFixed(3)} m exceeds 0.30 m`,
          value: deltaY,
          threshold: 0.3,
          location: [obs.x, obs.y, obs.z],
        });
      }
    }
  }

  // 4. Overlapping buildings (2D OBB/SAT or bounding check)
  let overlappingBuildings = 0;
  for (let i = 0; i < buildings.length; i++) {
    const a = buildings[i];
    for (let j = i + 1; j < buildings.length; j++) {
      const b = buildings[j];
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const dist = Math.hypot(dx, dz);
      const minSep = (a.radius + b.radius) * 0.86;
      if (dist < minSep) {
        // Precise 2D OBB SAT check if half-extents exist
        if (a.halfX && a.halfZ && b.halfX && b.halfZ) {
          if (obbOverlap2D(a.x, a.z, a.halfX - 0.05, a.halfZ - 0.05, a.yaw ?? 0, b.x, b.z, b.halfX - 0.05, b.halfZ - 0.05, b.yaw ?? 0)) {
            overlappingBuildings++;
            errors.push({
              invariant: 'overlapping_buildings',
              message: `Buildings '${a.id}' and '${b.id}' overlap (center dist=${dist.toFixed(2)}m)`,
              location: [a.x, a.y, a.z],
            });
          }
        } else {
          overlappingBuildings++;
          errors.push({
            invariant: 'overlapping_buildings',
            message: `Buildings '${a.id}' and '${b.id}' overlap (dist=${dist.toFixed(2)}m)`,
            location: [a.x, a.y, a.z],
          });
        }
      }
    }
  }

  // 5. Checkpoints on-track and strictly monotonic in race sequence
  let checkpointErrors = 0;
  let prevRelS = -1;
  for (const cp of track.checkpoints) {
    const nearest = track.closestPointXZ(cp.pos.x, cp.pos.z, cp.s);
    if (Math.abs(nearest.lateral) > cp.width * 0.5) {
      checkpointErrors++;
      errors.push({
        invariant: 'checkpoint_offtrack',
        message: `Checkpoint #${cp.index} is off-track (lat=${nearest.lateral.toFixed(2)}m)`,
        location: [cp.pos.x, cp.pos.y, cp.pos.z],
      });
    }
    const relS = track.wrapS(cp.s - track.spec.startFinishS);
    if (relS <= prevRelS && cp.index > 0) {
      checkpointErrors++;
      errors.push({
        invariant: 'checkpoint_sequence',
        message: `Checkpoint #${cp.index} out of sequence (relS=${relS.toFixed(1)} <= ${prevRelS.toFixed(1)})`,
      });
    }
    prevRelS = relS;
  }

  return {
    ok: errors.length === 0,
    errors,
    metrics: {
      trackLengthM: Math.round(track.length * 10) / 10,
      minCornerRadiusM: Math.round(track.minRadius * 10) / 10,
      maxGradePct: Math.round(maxGradePct * 100) / 100,
      maxBankingDeg: Math.round(track.maxBankingDeg * 100) / 100,
      maxTerrainPokeAboveRoadM: Math.round(maxPoke * 1000) / 1000,
      maxRoadEdgeStepM: Math.round(maxEdgeStep * 1000) / 1000,
      obstaclesInExclusionZone: obstaclesInExclusion,
      floatingObjectsCount: floatingObjects,
      overlappingBuildingsCount: overlappingBuildings,
      checkpointErrors,
    },
  };
}

function obbOverlap2D(
  ax: number, az: number, ahx: number, ahz: number, ayaw: number,
  bx: number, bz: number, bhx: number, bhz: number, byaw: number
): boolean {
  const axes = [
    [Math.cos(ayaw), -Math.sin(ayaw)],
    [Math.sin(ayaw), Math.cos(ayaw)],
    [Math.cos(byaw), -Math.sin(byaw)],
    [Math.sin(byaw), Math.cos(byaw)],
  ];
  const aUx = axes[0][0], aUz = axes[0][1];
  const aVx = axes[1][0], aVz = axes[1][1];
  const bUx = axes[2][0], bUz = axes[2][1];
  const bVx = axes[3][0], bVz = axes[3][1];
  const dx = bx - ax;
  const dz = bz - az;

  for (const [nx, nz] of axes) {
    const dist = Math.abs(dx * nx + dz * nz);
    const rA = ahx * Math.abs(aUx * nx + aUz * nz) + ahz * Math.abs(aVx * nx + aVz * nz);
    const rB = bhx * Math.abs(bUx * nx + bUz * nz) + bhz * Math.abs(bVx * nx + bVz * nz);
    if (dist > rA + rB) return false;
  }
  return true;
}
