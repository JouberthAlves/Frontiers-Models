import * as THREE from 'three';
import {
  Checkpoint,
  ControlPointData,
  RacingLineNode,
  RoadMeshData,
  TrackData,
  TrackSample,
  ZoneId,
} from './types';

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function interpVec(
  a: THREE.Vector3,
  b: THREE.Vector3,
  ta: number,
  tb: number,
  t: number
): THREE.Vector3 {
  const denom = Math.max(1e-6, tb - ta);
  const w = (t - ta) / denom;
  return new THREE.Vector3(
    a.x + (b.x - a.x) * w,
    a.y + (b.y - a.y) * w,
    a.z + (b.z - a.z) * w
  );
}

function evalCatmullRomPoint(
  cps: ControlPointData[],
  segIndex: number,
  u: number
): {
  pos: THREE.Vector3;
  width: number;
  bankingDeg: number;
  zone: ZoneId;
} {
  const n = cps.length;
  const p0 = cps[(segIndex - 1 + n) % n];
  const p1 = cps[segIndex % n];
  const p2 = cps[(segIndex + 1) % n];
  const p3 = cps[(segIndex + 2) % n];

  const v0 = new THREE.Vector3(p0.x, p0.y, p0.z);
  const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
  const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
  const v3 = new THREE.Vector3(p3.x, p3.y, p3.z);

  const tj = (ti: number, pa: THREE.Vector3, pb: THREE.Vector3) =>
    ti + Math.max(0.01, Math.pow(pa.distanceTo(pb), 0.5));

  const t0 = 0;
  const t1 = tj(t0, v0, v1);
  const t2 = tj(t1, v1, v2);
  const t3 = tj(t2, v2, v3);

  const t = t1 + u * (t2 - t1);
  const a1 = interpVec(v0, v1, t0, t1, t);
  const a2 = interpVec(v1, v2, t1, t2, t);
  const a3 = interpVec(v2, v3, t2, t3, t);
  const b1 = interpVec(a1, a2, t0, t2, t);
  const b2 = interpVec(a2, a3, t1, t3, t);
  const pos = interpVec(b1, b2, t1, t2, t);

  const sm = smoothstep(u);
  const width = p1.width + (p2.width - p1.width) * sm;
  const bankingDeg = p1.bankingDeg + (p2.bankingDeg - p1.bankingDeg) * sm;

  return {
    pos,
    width,
    bankingDeg,
    zone: p1.zone,
  };
}

export class TrackSpline {
  public readonly data: TrackData;
  public readonly samples: TrackSample[] = [];
  public readonly totalLength: number;
  public readonly checkpoints: Checkpoint[] = [];
  public readonly racingLine: RacingLineNode[] = [];
  public readonly bridgeStartS: number;
  public readonly bridgeEndS: number;
  private readonly spatialGrid = new Map<string, number[]>();
  private readonly cellSize = 40;

  constructor(data: TrackData, sampleCount = 2400) {
    this.data = data;
    const cps = data.controlPoints;
    const rawCount = cps.length * 60;
    const rawPts: {
      pos: THREE.Vector3;
      width: number;
      bankingDeg: number;
      zone: ZoneId;
      cumLen: number;
    }[] = [];

    let cumLen = 0;
    let prevPos: THREE.Vector3 | null = null;
    for (let i = 0; i < rawCount; i++) {
      const segPos = (i / rawCount) * cps.length;
      const segIdx = Math.floor(segPos);
      const u = segPos - segIdx;
      const ev = evalCatmullRomPoint(cps, segIdx, u);
      if (prevPos) {
        cumLen += prevPos.distanceTo(ev.pos);
      }
      rawPts.push({ ...ev, cumLen });
      prevPos = ev.pos;
    }
    const closingDist = rawPts[rawPts.length - 1].pos.distanceTo(rawPts[0].pos);
    const totalLen = cumLen + closingDist;
    this.totalLength = totalLen;

    this.bridgeStartS = data.bridgeSpan.startRatio * totalLen;
    this.bridgeEndS = data.bridgeSpan.endRatio * totalLen;

    // Resample uniformly by arc length
    let rIdx = 0;
    for (let i = 0; i < sampleCount; i++) {
      const targetS = (i / sampleCount) * totalLen;
      while (rIdx < rawPts.length - 1 && rawPts[rIdx + 1].cumLen < targetS) {
        rIdx++;
      }
      const a = rawPts[rIdx];
      const b = rawPts[(rIdx + 1) % rawPts.length];
      const aLen = a.cumLen;
      const bLen = rIdx === rawPts.length - 1 ? totalLen : b.cumLen;
      const span = Math.max(1e-6, bLen - aLen);
      const frac = Math.min(1, Math.max(0, (targetS - aLen) / span));

      const pos = new THREE.Vector3().lerpVectors(a.pos, b.pos, frac);
      const width = a.width + (b.width - a.width) * frac;
      const bankingDeg = a.bankingDeg + (b.bankingDeg - a.bankingDeg) * frac;
      const zone = a.zone;
      const isBridge = targetS >= this.bridgeStartS && targetS <= this.bridgeEndS;

      this.samples.push({
        s: targetS,
        u: i / sampleCount,
        pos,
        tangent: new THREE.Vector3(1, 0, 0),
        right: new THREE.Vector3(0, 0, 1),
        up: new THREE.Vector3(0, 1, 0),
        width,
        bankingDeg,
        gradePct: 0,
        curvature: 0,
        zone,
        isBridge,
      });
    }

    // Compute frames, grade, and curvature
    const worldUp = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < sampleCount; i++) {
      const prev = this.samples[(i - 1 + sampleCount) % sampleCount];
      const curr = this.samples[i];
      const next = this.samples[(i + 1) % sampleCount];

      const tang = new THREE.Vector3().subVectors(next.pos, prev.pos);
      const horiz = Math.hypot(tang.x, tang.z);
      curr.gradePct = (tang.y / Math.max(1e-5, horiz)) * 100;
      tang.normalize();
      curr.tangent.copy(tang);

      // Right vector starts horizontal perpendicular to tangent, then rolls by bankingDeg
      const flatRight = new THREE.Vector3().crossVectors(tang, worldUp).normalize();
      const bankRad = THREE.MathUtils.degToRad(curr.bankingDeg);
      const right = flatRight
        .clone()
        .applyAxisAngle(tang, bankRad)
        .normalize();
      const up = new THREE.Vector3().crossVectors(right, tang).normalize();
      curr.right.copy(right);
      curr.up.copy(up);

      // Signed curvature in XZ
      const dx1 = curr.pos.x - prev.pos.x;
      const dz1 = curr.pos.z - prev.pos.z;
      const dx2 = next.pos.x - curr.pos.x;
      const dz2 = next.pos.z - curr.pos.z;
      const d1 = Math.hypot(dx1, dz1);
      const d2 = Math.hypot(dx2, dz2);
      const d3 = Math.hypot(next.pos.x - prev.pos.x, next.pos.z - prev.pos.z);
      const cross = dx1 * dz2 - dz1 * dx2;
      const area2 = Math.abs(cross);
      if (area2 > 1e-6 && d1 > 1e-4 && d2 > 1e-4 && d3 > 1e-4) {
        const radius = (d1 * d2 * d3) / (2 * area2);
        curr.curvature = (cross >= 0 ? 1 : -1) / radius;
      } else {
        curr.curvature = 0;
      }

      // Register in spatial grid
      const gx = Math.floor(curr.pos.x / this.cellSize);
      const gz = Math.floor(curr.pos.z / this.cellSize);
      for (let ox = -1; ox <= 1; ox++) {
        for (let oz = -1; oz <= 1; oz++) {
          const key = `${gx + ox},${gz + oz}`;
          let arr = this.spatialGrid.get(key);
          if (!arr) {
            arr = [];
            this.spatialGrid.set(key, arr);
          }
          arr.push(i);
        }
      }
    }

    this.buildCheckpoints();
    this.buildRacingLine();
  }

  public wrapS(s: number): number {
    const L = this.totalLength;
    return ((s % L) + L) % L;
  }

  public sampleAtDistance(s: number): TrackSample {
    const sw = this.wrapS(s);
    const n = this.samples.length;
    const fIdx = (sw / this.totalLength) * n;
    const i0 = Math.floor(fIdx) % n;
    const i1 = (i0 + 1) % n;
    const frac = fIdx - Math.floor(fIdx);
    const a = this.samples[i0];
    const b = this.samples[i1];

    const pos = new THREE.Vector3().lerpVectors(a.pos, b.pos, frac);
    const tangent = new THREE.Vector3().lerpVectors(a.tangent, b.tangent, frac).normalize();
    const right = new THREE.Vector3().lerpVectors(a.right, b.right, frac).normalize();
    const up = new THREE.Vector3().crossVectors(right, tangent).normalize();

    return {
      s: sw,
      u: sw / this.totalLength,
      pos,
      tangent,
      right,
      up,
      width: a.width + (b.width - a.width) * frac,
      bankingDeg: a.bankingDeg + (b.bankingDeg - a.bankingDeg) * frac,
      gradePct: a.gradePct + (b.gradePct - a.gradePct) * frac,
      curvature: a.curvature + (b.curvature - a.curvature) * frac,
      zone: frac < 0.5 ? a.zone : b.zone,
      isBridge: sw >= this.bridgeStartS && sw <= this.bridgeEndS,
    };
  }

  public projectPointXZ(
    x: number,
    y: number,
    z: number
  ): {
    sample: TrackSample;
    s: number;
    lateral: number;
    distToCenterXZ: number;
    distToEdge: number;
    heightDiff: number;
  } {
    const gx = Math.floor(x / this.cellSize);
    const gz = Math.floor(z / this.cellSize);
    const candidates = this.spatialGrid.get(`${gx},${gz}`);

    let bestIdx = 0;
    let bestD2 = Infinity;
    const n = this.samples.length;

    if (candidates && candidates.length > 0) {
      for (const idx of candidates) {
        const p = this.samples[idx].pos;
        const d2 = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIdx = idx;
        }
      }
    } else {
      for (let i = 0; i < n; i++) {
        const p = this.samples[i].pos;
        const d2 = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z);
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIdx = i;
        }
      }
    }

    // Refine locally between prev, curr, next segments
    let bestSample = this.samples[bestIdx];
    const prevIdx = (bestIdx - 1 + n) % n;
    const nextIdx = (bestIdx + 1) % n;
    const refinePairs: [number, number][] = [
      [prevIdx, bestIdx],
      [bestIdx, nextIdx],
    ];
    let bestRefS = bestSample.s;
    let minRefD2 = bestD2;

    for (const [ia, ib] of refinePairs) {
      const pa = this.samples[ia].pos;
      const pb = this.samples[ib].pos;
      const vx = pb.x - pa.x;
      const vz = pb.z - pa.z;
      const len2 = vx * vx + vz * vz;
      if (len2 < 1e-8) continue;
      const t = Math.max(0, Math.min(1, ((x - pa.x) * vx + (z - pa.z) * vz) / len2));
      const px = pa.x + vx * t;
      const pz = pa.z + vz * t;
      const d2 = (px - x) * (px - x) + (pz - z) * (pz - z);
      if (d2 < minRefD2) {
        minRefD2 = d2;
        const sa = this.samples[ia].s;
        const sb = ib === 0 ? this.totalLength : this.samples[ib].s;
        bestRefS = this.wrapS(sa + (sb - sa) * t);
      }
    }

    bestSample = this.sampleAtDistance(bestRefS);
    const dx = x - bestSample.pos.x;
    const dz = z - bestSample.pos.z;
    const lateral = dx * bestSample.right.x + dz * bestSample.right.z;
    const distToCenterXZ = Math.hypot(dx, dz);
    const halfW = bestSample.width * 0.5;
    // Account for banking height along lateral offset
    const surfaceY = bestSample.pos.y + bestSample.right.y * lateral;

    return {
      sample: bestSample,
      s: bestSample.s,
      lateral,
      distToCenterXZ,
      distToEdge: Math.abs(lateral) - halfW,
      heightDiff: y - surfaceY,
    };
  }

  public getRoadSurfaceYAt(x: number, z: number): { y: number; insideRoad: boolean; distToEdge: number; sample: TrackSample } {
    const proj = this.projectPointXZ(x, 0, z);
    const surfaceY = proj.sample.pos.y + proj.sample.right.y * proj.lateral;
    return {
      y: surfaceY,
      insideRoad: proj.distToEdge <= 0,
      distToEdge: proj.distToEdge,
      sample: proj.sample,
    };
  }

  public buildRoadGeometry(subdivAlong = 1200): RoadMeshData {
    // Visual cross-section: 5 vertices across width:
    // 0: left shoulder skirt bottom (-halfW - 0.55, -0.30)
    // 1: left road outer edge (-halfW - 0.45, -0.01)
    // 2: left asphalt edge (-halfW, 0)
    // 3: center crown (0, 0.015)
    // 4: right asphalt edge (+halfW, 0)
    // 5: right road outer edge (+halfW + 0.45, -0.01)
    // 6: right shoulder skirt bottom (+halfW + 0.55, -0.30)
    const ringVerts = 7;
    const totalRings = subdivAlong + 1; // close seam UV cleanly
    const positions = new Float32Array(totalRings * ringVerts * 3);
    const normals = new Float32Array(totalRings * ringVerts * 3);
    const uvs = new Float32Array(totalRings * ringVerts * 2);

    // Collider uses clean 3-vertex-wide flat/crowned driving surface (+0.5m safety lip on edges)
    const colVerts = 3;
    const colliderPositions = new Float32Array(totalRings * colVerts * 3);

    const pTmp = new THREE.Vector3();
    for (let i = 0; i < totalRings; i++) {
      const s = (i / subdivAlong) * this.totalLength;
      const samp = this.sampleAtDistance(s);
      const hw = samp.width * 0.5;
      const offsets: [number, number, number][] = [
        [-hw - 0.55, -0.30, -0.08],
        [-hw - 0.45, -0.01, -0.04],
        [-hw, 0.0, 0.0],
        [0.0, 0.015, 0.5],
        [hw, 0.0, 1.0],
        [hw + 0.45, -0.01, 1.04],
        [hw + 0.55, -0.30, 1.08],
      ];

      for (let j = 0; j < ringVerts; j++) {
        const [lat, upOff, uCoord] = offsets[j];
        pTmp
          .copy(samp.pos)
          .addScaledVector(samp.right, lat)
          .addScaledVector(samp.up, upOff);
        const vi = (i * ringVerts + j) * 3;
        positions[vi] = pTmp.x;
        positions[vi + 1] = pTmp.y;
        positions[vi + 2] = pTmp.z;

        normals[vi] = samp.up.x;
        normals[vi + 1] = samp.up.y;
        normals[vi + 2] = samp.up.z;

        const ti = (i * ringVerts + j) * 2;
        uvs[ti] = uCoord;
        uvs[ti + 1] = s / 12.0; // tile asphalt nicely every 12 m
      }

      // Collider vertices: left edge (-hw - 0.35), center (0), right edge (+hw + 0.35)
      const colOffsets = [-hw - 0.35, 0, hw + 0.35];
      for (let j = 0; j < colVerts; j++) {
        pTmp
          .copy(samp.pos)
          .addScaledVector(samp.right, colOffsets[j])
          .addScaledVector(samp.up, j === 1 ? 0.015 : 0.0);
        const ci = (i * colVerts + j) * 3;
        colliderPositions[ci] = pTmp.x;
        colliderPositions[ci + 1] = pTmp.y;
        colliderPositions[ci + 2] = pTmp.z;
      }
    }

    const indicesList: number[] = [];
    const colIndicesList: number[] = [];
    for (let i = 0; i < subdivAlong; i++) {
      for (let j = 0; j < ringVerts - 1; j++) {
        const a = i * ringVerts + j;
        const b = a + 1;
        const c = (i + 1) * ringVerts + j;
        const d = c + 1;
        // Front face upward: (b - a) x (c - a) = right x tangent = +up!
        indicesList.push(a, b, c, b, d, c);
      }
      for (let j = 0; j < colVerts - 1; j++) {
        const a = i * colVerts + j;
        const b = a + 1;
        const c = (i + 1) * colVerts + j;
        const d = c + 1;
        colIndicesList.push(a, b, c, b, d, c);
      }
    }

    return {
      positions,
      normals,
      uvs,
      indices: new Uint32Array(indicesList),
      colliderPositions,
      colliderIndices: new Uint32Array(colIndicesList),
    };
  }

  private buildCheckpoints(): void {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const s = (i / count) * this.totalLength;
      const samp = this.sampleAtDistance(s);
      this.checkpoints.push({
        index: i,
        s,
        pos: samp.pos.clone(),
        tangent: samp.tangent.clone(),
        right: samp.right.clone(),
        width: samp.width,
        zone: samp.zone,
      });
    }
  }

  private buildRacingLine(): void {
    const count = 300;
    const rawSpeeds: number[] = [];
    const nodes: RacingLineNode[] = [];

    for (let i = 0; i < count; i++) {
      const s = (i / count) * this.totalLength;
      const samp = this.sampleAtDistance(s);
      // Look ahead for curvature to compute smooth apex lateral offset
      const look = this.sampleAtDistance(s + 24);
      const avgCurv = 0.6 * samp.curvature + 0.4 * look.curvature;
      const maxOffset = samp.width * 0.24;
      // Positive curvature turns right (+right), so hug inside apex along +avgCurv
      const lateralOffset = THREE.MathUtils.clamp(avgCurv * 125, -maxOffset, maxOffset);
      const pos = samp.pos.clone().addScaledVector(samp.right, lateralOffset);

      // Physics-informed max corner speed: v = sqrt(mu * g * R)
      const absCurv = Math.max(Math.abs(samp.curvature), Math.abs(look.curvature), 1e-4);
      const radius = 1 / absCurv;
      const maxSpeed = 62.0; // ~223 km/h top speed
      const cornerSpeed = Math.min(maxSpeed, Math.sqrt(15.5 * radius));
      rawSpeeds.push(Math.max(18.0, cornerSpeed));

      nodes.push({
        s,
        pos,
        tangent: samp.tangent.clone(),
        lateralOffset,
        targetSpeed: cornerSpeed,
      });
    }

    // Backward braking propagation pass so AI brakes BEFORE corners!
    const maxBrakeDecel = 14.5; // m/s^2
    for (let pass = 0; pass < 2; pass++) {
      for (let i = count - 1; i >= 0; i--) {
        const next = nodes[(i + 1) % count];
        const curr = nodes[i];
        const ds = this.totalLength / count;
        const reachable = Math.sqrt(next.targetSpeed * next.targetSpeed + 2 * maxBrakeDecel * ds);
        curr.targetSpeed = Math.min(curr.targetSpeed, reachable);
      }
    }

    // Forward acceleration smoothing
    const maxAccel = 9.0;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < count; i++) {
        const prev = nodes[(i - 1 + count) % count];
        const curr = nodes[i];
        const ds = this.totalLength / count;
        const reachable = Math.sqrt(prev.targetSpeed * prev.targetSpeed + 2 * maxAccel * ds);
        curr.targetSpeed = Math.min(curr.targetSpeed, reachable);
      }
    }

    this.racingLine.push(...nodes);
  }
}
