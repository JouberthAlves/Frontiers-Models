import * as THREE from 'three';

export type ZoneId = 'Z1' | 'Z2' | 'Z3' | 'Z4';

export interface ControlPointData {
  x: number;
  y: number;
  z: number;
  width: number;
  bankingDeg: number;
  zone: ZoneId;
}

export interface TrackData {
  name: string;
  seed: number;
  seaLevel: number;
  sunDirection: [number, number, number];
  bridgeSpan: {
    startRatio: number;
    endRatio: number;
  };
  controlPoints: ControlPointData[];
}

export interface TrackSample {
  s: number; // arc distance from start in meters
  u: number; // normalized [0, 1)
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  up: THREE.Vector3;
  width: number;
  bankingDeg: number;
  gradePct: number;
  curvature: number; // signed 1/radius in XZ (+ left or right)
  zone: ZoneId;
  isBridge: boolean;
}

export interface RoadMeshData {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  colliderPositions: Float32Array;
  colliderIndices: Uint32Array;
}

export interface Checkpoint {
  index: number;
  s: number;
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  width: number;
  zone: ZoneId;
}

export interface RacingLineNode {
  s: number;
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  lateralOffset: number;
  targetSpeed: number; // m/s
}

export interface PlacedObjectRecord {
  id: string;
  kind: 'house' | 'landmark' | 'tree' | 'bush' | 'rock' | 'prop' | 'bridge';
  zone: ZoneId;
  s: number;
  x: number;
  y: number; // base Y
  z: number;
  radius: number; // footprint radius for exclusion / overlap checks
  halfExtents?: [number, number, number];
  rotationY?: number;
  canSink?: boolean;
  variation?: string;
}

export interface WorldValidationReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    totalLength: number;
    maxGradePct: number;
    maxBankingDeg: number;
    minCurveRadius: number;
    maxTerrainAboveRoad: number;
    maxRoadTerrainGap: number;
    exclusionViolations: number;
    groundingViolations: number;
    houseOverlaps: number;
    checkpointErrors: number;
    colliderMismatch: number;
    houseCountZ3: number;
    houseVariations: number;
    vegetationSpecies: number;
    minPropsPer100m: number;
  };
}
