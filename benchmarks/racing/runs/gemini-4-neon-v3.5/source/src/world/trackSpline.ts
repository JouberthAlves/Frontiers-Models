import * as THREE from 'three';
import { CheckpointData, SplineSample, TrackSpec, ZoneId } from '../types';
import { clamp, lerp } from '../utils/rng';

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export class TrackSpline {
  readonly spec: TrackSpec;
  readonly curve: THREE.CatmullRomCurve3;
  readonly length: number;
  readonly samples: SplineSample[];
  readonly checkpoints: CheckpointData[];
  readonly sampleStep: number;
  readonly minRadius: number;
  readonly maxGrade: number;
  readonly maxBankingDeg: number;

  // Coarse grid acceleration for closest-point queries
  private readonly cpParamU: number[];

  constructor(spec: TrackSpec, sampleCount = 1500) {
    this.spec = spec;
    const pts = spec.controlPoints.map((cp) => new THREE.Vector3(cp.x, cp.y, cp.z));
    this.curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal', 0.5);
    this.length = this.curve.getLength();
    this.sampleStep = this.length / sampleCount;

    // Map each control point to its arc-length parameter u in [0, 1)
    const denseN = 1200;
    const densePts: THREE.Vector3[] = [];
    for (let i = 0; i < denseN; i++) densePts.push(this.curve.getPointAt(i / denseN));
    this.cpParamU = spec.controlPoints.map((cp) => {
      let bestU = 0;
      let bestD = Infinity;
      for (let i = 0; i < denseN; i++) {
        const p = densePts[i];
        const d = (p.x - cp.x) ** 2 + (p.y - cp.y) ** 2 + (p.z - cp.z) ** 2;
        if (d < bestD) {
          bestD = d;
          bestU = i / denseN;
        }
      }
      return bestU;
    });

    // Ensure monotonic u values for interpolation around wrap
    const rawSamples: SplineSample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const u = i / sampleCount;
      const s = u * this.length;
      const pos = this.curve.getPointAt(u);
      const tangent = this.curve.getTangentAt(u).normalize();
      const flatRight = new THREE.Vector3().crossVectors(tangent, WORLD_UP).normalize();
      const baseUp = new THREE.Vector3().crossVectors(flatRight, tangent).normalize();

      const { width, bankDeg } = this.interpolateControlAttrs(u);
      const bankRad = THREE.MathUtils.degToRad(bankDeg);
      // Positive bankDeg banks right side UP (inward banking for right turns)
      const right = flatRight
        .clone()
        .multiplyScalar(Math.cos(bankRad))
        .addScaledVector(baseUp, Math.sin(bankRad))
        .normalize();
      const up = new THREE.Vector3().crossVectors(right, tangent).normalize();

      const zone = this.getZoneForS(s);
      const isBridge = s >= spec.bridge.startS && s <= spec.bridge.endS;

      rawSamples.push({
        s,
        u,
        pos,
        tangent,
        right,
        up,
        flatRight,
        width,
        bankRad,
        curvature: 0,
        radius: 1e6,
        grade: 0,
        zone,
        isBridge,
      });
    }

    let minR = Infinity;
    let maxG = 0;
    let maxB = 0;
    const span = 2;
    for (let i = 0; i < sampleCount; i++) {
      const prev = rawSamples[(i - span + sampleCount) % sampleCount];
      const curr = rawSamples[i];
      const next = rawSamples[(i + span) % sampleCount];
      const ds = 2 * span * this.sampleStep;

      const t1x = prev.tangent.x;
      const t1z = prev.tangent.z;
      const l1 = Math.hypot(t1x, t1z) || 1;
      const t2x = next.tangent.x;
      const t2z = next.tangent.z;
      const l2 = Math.hypot(t2x, t2z) || 1;
      const dot = clamp((t1x * t2x + t1z * t2z) / (l1 * l2), -1, 1);
      // Signed cross product in XZ: positive => clockwise (right turn)
      const crossY = (t1z * t2x - t1x * t2z) / (l1 * l2);
      const signedAngle = Math.sign(crossY) * Math.acos(dot);
      curr.curvature = signedAngle / ds;
      curr.radius = Math.abs(curr.curvature) > 1e-5 ? 1 / Math.abs(curr.curvature) : 1e6;

      const horizDist = Math.hypot(next.pos.x - prev.pos.x, next.pos.z - prev.pos.z);
      curr.grade = (next.pos.y - prev.pos.y) / Math.max(0.01, horizDist);

      if (curr.radius < minR) minR = curr.radius;
      if (Math.abs(curr.grade) > maxG) maxG = Math.abs(curr.grade);
      const bDeg = Math.abs(THREE.MathUtils.radToDeg(curr.bankRad));
      if (bDeg > maxB) maxB = bDeg;
    }

    this.samples = rawSamples;
    this.minRadius = minR;
    this.maxGrade = maxG;
    this.maxBankingDeg = maxB;

    // Sequential checkpoints starting cleanly at startFinishS
    this.checkpoints = [];
    const cpCount = spec.checkpointCount;
    for (let i = 0; i < cpCount; i++) {
      const s = this.wrapS(spec.startFinishS + (i / cpCount) * this.length);
      const smp = this.sampleAtS(s);
      this.checkpoints.push({
        index: i,
        s,
        pos: smp.pos.clone(),
        tangent: smp.tangent.clone(),
        right: smp.right.clone(),
        width: smp.width,
      });
    }
  }

  private interpolateControlAttrs(u: number): { width: number; bankDeg: number } {
    const cps = this.spec.controlPoints;
    const n = cps.length;
    // Find segment i -> (i+1)%n enclosing u
    let i0 = n - 1;
    let i1 = 0;
    let localT = 0;
    for (let i = 0; i < n; i++) {
      const uA = this.cpParamU[i];
      const uB = i + 1 < n ? this.cpParamU[i + 1] : this.cpParamU[0] + 1;
      const uTest = u < this.cpParamU[0] ? u + 1 : u;
      if (uTest >= uA && uTest <= uB) {
        i0 = i;
        i1 = (i + 1) % n;
        const span = Math.max(1e-5, uB - uA);
        localT = clamp((uTest - uA) / span, 0, 1);
        break;
      }
    }
    // Smooth hermite easing on banking/width transitions
    const t = localT * localT * (3 - 2 * localT);
    return {
      width: lerp(cps[i0].width, cps[i1].width, t),
      bankDeg: lerp(cps[i0].bankDeg, cps[i1].bankDeg, t),
    };
  }

  wrapS(s: number): number {
    let r = s % this.length;
    if (r < 0) r += this.length;
    return r;
  }

  deltaS(fromS: number, toS: number): number {
    let d = this.wrapS(toS) - this.wrapS(fromS);
    if (d > this.length * 0.5) d -= this.length;
    if (d < -this.length * 0.5) d += this.length;
    return d;
  }

  getZoneForS(s: number): ZoneId {
    const ws = this.wrapS(s);
    for (const z of this.spec.zones) {
      if (ws >= z.startS && ws < z.endS) return z.id;
    }
    return this.spec.zones[this.spec.zones.length - 1].id;
  }

  sampleAtS(s: number): SplineSample {
    const ws = this.wrapS(s);
    const fIdx = (ws / this.length) * this.samples.length;
    const i0 = Math.floor(fIdx) % this.samples.length;
    const i1 = (i0 + 1) % this.samples.length;
    const t = fIdx - Math.floor(fIdx);
    const a = this.samples[i0];
    const b = this.samples[i1];

    const pos = a.pos.clone().lerp(b.pos, t);
    const tangent = a.tangent.clone().lerp(b.tangent, t).normalize();
    const right = a.right.clone().lerp(b.right, t).normalize();
    const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
    const flatRight = new THREE.Vector3().crossVectors(tangent, WORLD_UP).normalize();

    return {
      s: ws,
      u: ws / this.length,
      pos,
      tangent,
      right,
      up,
      flatRight,
      width: lerp(a.width, b.width, t),
      bankRad: lerp(a.bankRad, b.bankRad, t),
      curvature: lerp(a.curvature, b.curvature, t),
      radius: lerp(a.radius, b.radius, t),
      grade: lerp(a.grade, b.grade, t),
      zone: this.getZoneForS(ws),
      isBridge: ws >= this.spec.bridge.startS && ws <= this.spec.bridge.endS,
    };
  }

  /**
   * Returns exact closest spline point to (x, z), with signed lateral offset (+right, -left) and sample.
   */
  closestPointXZ(
    x: number,
    z: number,
    hintS?: number
  ): { sample: SplineSample; lateral: number; distXZ: number } {
    const N = this.samples.length;
    let bestIdx = 0;
    let bestD2 = Infinity;

    if (hintS !== undefined) {
      const centerIdx = Math.floor((this.wrapS(hintS) / this.length) * N);
      const searchWindow = 85;
      for (let k = -searchWindow; k <= searchWindow; k++) {
        const idx = (centerIdx + k + N) % N;
        const p = this.samples[idx].pos;
        const dx = x - p.x;
        const dz = z - p.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIdx = idx;
        }
      }
      // Fallback to full scan if car jumped far from hint
      if (bestD2 > 45 * 45) {
        for (let i = 0; i < N; i += 3) {
          const p = this.samples[i].pos;
          const d2 = (x - p.x) ** 2 + (z - p.z) ** 2;
          if (d2 < bestD2) {
            bestD2 = d2;
            bestIdx = i;
          }
        }
      }
    } else {
      // Coarse stride 4 then refine locally
      for (let i = 0; i < N; i += 4) {
        const p = this.samples[i].pos;
        const d2 = (x - p.x) ** 2 + (z - p.z) ** 2;
        if (d2 < bestD2) {
          bestD2 = d2;
          bestIdx = i;
        }
      }
    }

    // Refine around bestIdx
    const baseIdx = bestIdx;
    for (let k = -5; k <= 5; k++) {
      const idx = (baseIdx + k + N) % N;
      const p = this.samples[idx].pos;
      const d2 = (x - p.x) ** 2 + (z - p.z) ** 2;
      if (d2 < bestD2) {
        bestD2 = d2;
        bestIdx = idx;
      }
    }

    // Sub-sample projection onto tangent
    const s0 = this.samples[bestIdx];
    const dx = x - s0.pos.x;
    const dz = z - s0.pos.z;
    const tFlatLen = Math.hypot(s0.tangent.x, s0.tangent.z) || 1;
    const along = (dx * s0.tangent.x + dz * s0.tangent.z) / tFlatLen;
    const refinedS = this.wrapS(s0.s + clamp(along, -this.sampleStep * 1.2, this.sampleStep * 1.2));
    const sample = this.sampleAtS(refinedS);
    const rx = x - sample.pos.x;
    const rz = z - sample.pos.z;
    const lateral = rx * sample.flatRight.x + rz * sample.flatRight.z;
    const distXZ = Math.hypot(rx, rz);
    return { sample, lateral, distXZ };
  }

  /**
   * Computes exact surface height of road cross-section at (s, lateral).
   */
  roadSurfaceY(sample: SplineSample, lateral: number): number {
    return sample.pos.y + lateral * Math.sin(sample.bankRad);
  }
}
