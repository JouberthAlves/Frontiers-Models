import RAPIER from '@dimforge/rapier3d-compat';
import { TrackSpline } from './track';
import { TerrainField } from './terrain';
import { PlacedObjectRecord, WorldValidationReport } from './types';

export interface ValidateWorldOptions {
  track: TrackSpline;
  terrain: TerrainField;
  objects?: PlacedObjectRecord[];
  physicsWorld?: RAPIER.World;
  requireScenery?: boolean;
}

export function validateWorld(opts: ValidateWorldOptions): WorldValidationReport {
  const { track, terrain, objects = [], physicsWorld, requireScenery = false } = opts;
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Track spline geometry invariants: length, banking <= 12 deg, grade <= 14%, curve radius >= 25m
  let maxGradePct = 0;
  let maxBankingDeg = 0;
  let minCurveRadius = Infinity;

  const n = track.samples.length;
  for (let i = 0; i < n; i++) {
    const s = track.samples[i];
    const absGrade = Math.abs(s.gradePct);
    const absBank = Math.abs(s.bankingDeg);
    if (absGrade > maxGradePct) maxGradePct = absGrade;
    if (absBank > maxBankingDeg) maxBankingDeg = absBank;

    if (Math.abs(s.curvature) > 1e-6) {
      const r = 1 / Math.abs(s.curvature);
      if (r < minCurveRadius) minCurveRadius = r;
    }
  }

  if (track.totalLength < 2500 || track.totalLength > 3500) {
    errors.push(`Track length ${track.totalLength.toFixed(1)}m outside [2500, 3500]m`);
  }
  if (maxBankingDeg > 12.0) {
    errors.push(`Lateral banking ${maxBankingDeg.toFixed(2)}° exceeds 12° limit`);
  }
  if (maxGradePct > 14.0) {
    errors.push(`Longitudinal slope ${maxGradePct.toFixed(2)}% exceeds 14% limit`);
  }
  if (minCurveRadius < 25.0) {
    errors.push(`Minimum curve radius ${minCurveRadius.toFixed(2)}m below 25m limit`);
  }

  // 2. Terrain vs Road invariants:
  // - Terrain above road surface inside track width > 0.02m
  // - Gap between road edge and terrain > 0.15m (outside bridge span)
  let maxTerrainAboveRoad = -Infinity;
  let maxRoadTerrainGap = 0;

  const checkSamples = 600;
  for (let i = 0; i < checkSamples; i++) {
    const s = (i / checkSamples) * track.totalLength;
    const samp = track.sampleAtDistance(s);
    const hw = samp.width * 0.5;

    // Check across inside of road (-hw*0.95 .. +hw*0.95)
    for (const frac of [-0.9, -0.45, 0, 0.45, 0.9]) {
      const lat = frac * hw;
      const px = samp.pos.x + samp.right.x * lat;
      const pz = samp.pos.z + samp.right.z * lat;
      const roadY = samp.pos.y + samp.right.y * lat + (frac === 0 ? 0.015 : 0);
      const terrY = terrain.getHeightAt(px, pz);
      const above = terrY - roadY;
      if (above > maxTerrainAboveRoad) maxTerrainAboveRoad = above;
    }

    // Check road edge <-> terrain gap (outside bridge interior, > 1m from bridge deck span)
    const inBridgeSpan =
      s >= track.bridgeStartS - 1.5 && s <= track.bridgeEndS + 1.5;
    if (!inBridgeSpan) {
      for (const side of [-1, 1]) {
        const edgeLat = side * (hw + 0.5);
        const ex = samp.pos.x + samp.right.x * edgeLat;
        const ez = samp.pos.z + samp.right.z * edgeLat;
        const edgeY = samp.pos.y + samp.right.y * (side * hw);
        const terrY = terrain.getHeightAt(ex, ez);
        const gap = Math.abs(terrY - edgeY);
        if (gap > maxRoadTerrainGap) maxRoadTerrainGap = gap;
      }
    }
  }

  if (maxTerrainAboveRoad > 0.02) {
    errors.push(
      `Terrain pokes ${maxTerrainAboveRoad.toFixed(3)}m above road surface inside track (> 0.02m)`
    );
  }
  if (maxRoadTerrainGap > 0.15) {
    errors.push(
      `Road-edge to terrain gap ${maxRoadTerrainGap.toFixed(3)}m exceeds 0.15m limit`
    );
  }

  // 3. Verify Rapier Physics Heightfield & Road Collider match analytical terrain/road!
  let colliderMismatch = 0;
  if (physicsWorld) {
    for (let i = 0; i < 40; i++) {
      const rx = -450 + ((i * 197) % 900) + 0.37;
      const rz = -150 + ((i * 313) % 750) + 0.61;
      const proj = track.projectPointXZ(rx, 0, rz);
      if (proj.distToEdge < 6) continue;
      const ray = new RAPIER.Ray({ x: rx, y: 250, z: rz }, { x: 0, y: -1, z: 0 });
      const hit = physicsWorld.castRay(ray, 400, true);
      if (!hit) {
        colliderMismatch++;
        warnings.push(`Collider probe miss at (${rx}, ${rz})`);
      } else {
        const hitY = 250 - hit.timeOfImpact;
        const expectedY = terrain.getHeightAt(rx, rz);
        const diff = Math.abs(hitY - expectedY);
        if (diff > 0.6) {
          colliderMismatch++;
          warnings.push(`Terrain collider diff ${diff.toFixed(2)}m at (${rx}, ${rz}): hit=${hitY.toFixed(2)}, exp=${expectedY.toFixed(2)}`);
        }
      }
    }
    // Check 20 road centerline points
    for (let i = 0; i < 20; i++) {
      const s = (i / 20) * track.totalLength;
      const samp = track.sampleAtDistance(s);
      const ray = new RAPIER.Ray(
        { x: samp.pos.x, y: samp.pos.y + 5, z: samp.pos.z },
        { x: 0, y: -1, z: 0 }
      );
      const hit = physicsWorld.castRay(ray, 20, true);
      if (!hit || Math.abs(samp.pos.y + 5 - hit.timeOfImpact - (samp.pos.y + 0.015)) > 0.15) {
        colliderMismatch++;
        warnings.push(`Road collider diff at s=${s.toFixed(1)}`);
      }
    }
    if (colliderMismatch > 0) {
      errors.push(`Rapier collider vs visual mesh mismatch detected (${colliderMismatch} probes)`);
    }
  }

  // 4. Checkpoints on track and strictly sequential
  let checkpointErrors = 0;
  let prevS = -1;
  for (let i = 0; i < track.checkpoints.length; i++) {
    const cp = track.checkpoints[i];
    if (cp.index !== i || cp.s <= prevS || cp.s >= track.totalLength) {
      checkpointErrors++;
    }
    const proj = track.projectPointXZ(cp.pos.x, cp.pos.y, cp.pos.z);
    if (proj.distToEdge > -1.0) {
      checkpointErrors++;
    }
    prevS = cp.s;
  }
  if (checkpointErrors > 0) {
    errors.push(`Invalid or out-of-sequence checkpoints (${checkpointErrors})`);
  }

  // 5. Exclusion band (>= 3m beyond road edge), Grounding (<= 0.3m), House overlaps
  let exclusionViolations = 0;
  let groundingViolations = 0;
  let houseOverlaps = 0;

  const houses: PlacedObjectRecord[] = [];
  const houseVariations = new Set<string>();
  const vegSpecies = new Set<string>();
  const binCounts = new Int32Array(Math.ceil(track.totalLength / 100));

  for (const obj of objects) {
    if (obj.kind === 'bridge') continue;
    const proj = track.projectPointXZ(obj.x, obj.y, obj.z);
    // Exclusion zone: >= 3.0 m beyond road edge, accounting for object footprint radius
    const clearDist = proj.distToEdge - obj.radius;
    if (clearDist < 2.95) {
      exclusionViolations++;
    }

    const terrY = terrain.getHeightAt(obj.x, obj.z);
    const diff = obj.y - terrY;
    if (obj.canSink) {
      // Rocks can sink slightly, but never float > 0.3 m above terrain
      if (diff > 0.3) groundingViolations++;
    } else {
      if (Math.abs(diff) > 0.3) groundingViolations++;
    }

    if (obj.kind === 'house' || obj.kind === 'landmark') {
      houses.push(obj);
      if (obj.kind === 'house' && obj.variation) houseVariations.add(obj.variation);
    }
    if ((obj.kind === 'tree' || obj.kind === 'bush') && obj.variation) {
      vegSpecies.add(obj.variation);
    }

    const bin = Math.min(
      binCounts.length - 1,
      Math.max(0, Math.floor(proj.s / 100))
    );
    if (proj.distToEdge < 45) {
      binCounts[bin]++;
    }
  }

  // House-vs-house overlap check (circle or oriented margin)
  for (let i = 0; i < houses.length; i++) {
    for (let j = i + 1; j < houses.length; j++) {
      const a = houses[i];
      const b = houses[j];
      const d = Math.hypot(a.x - b.x, a.z - b.z);
      if (d < a.radius + b.radius - 0.15) {
        houseOverlaps++;
      }
    }
  }

  if (exclusionViolations > 0) {
    errors.push(`${exclusionViolations} objects violate the >= 3m road exclusion band`);
  }
  if (groundingViolations > 0) {
    errors.push(`${groundingViolations} objects float or bury > 0.3m relative to terrain`);
  }
  if (houseOverlaps > 0) {
    errors.push(`${houseOverlaps} overlapping houses detected`);
  }

  const houseCountZ3 = houses.filter((h) => h.zone === 'Z3').length;
  // Exclude partial last bin (< 100m remainder) when computing minPropsPer100m
  const fullBins = Math.floor(track.totalLength / 100);
  let minPropsPer100m = fullBins > 0 ? Infinity : 0;
  for (let b = 0; b < fullBins; b++) {
    if (binCounts[b] < minPropsPer100m) minPropsPer100m = binCounts[b];
  }
  if (!isFinite(minPropsPer100m)) minPropsPer100m = 0;

  if (requireScenery) {
    if (houseCountZ3 < 25) {
      errors.push(`Z3 house count ${houseCountZ3} below minimum 25`);
    }
    if (houseVariations.size < 5) {
      errors.push(`House variations ${houseVariations.size} below minimum 5`);
    }
    if (vegSpecies.size < 4) {
      errors.push(`Vegetation species ${vegSpecies.size} below minimum 4`);
    }
    if (minPropsPer100m < 12) {
      errors.push(`Minimum props/vegetation per 100m is ${minPropsPer100m} (< 12)`);
    }
  } else {
    if (objects.length === 0) {
      warnings.push('Scenery checks skipped (P1 skeleton mode)');
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      totalLength: Number(track.totalLength.toFixed(1)),
      maxGradePct: Number(maxGradePct.toFixed(2)),
      maxBankingDeg: Number(maxBankingDeg.toFixed(2)),
      minCurveRadius: Number(minCurveRadius.toFixed(2)),
      maxTerrainAboveRoad: Number(maxTerrainAboveRoad.toFixed(4)),
      maxRoadTerrainGap: Number(maxRoadTerrainGap.toFixed(4)),
      exclusionViolations,
      groundingViolations,
      houseOverlaps,
      checkpointErrors,
      colliderMismatch,
      houseCountZ3,
      houseVariations: houseVariations.size,
      vegetationSpecies: vegSpecies.size,
      minPropsPer100m,
    },
  };
}
