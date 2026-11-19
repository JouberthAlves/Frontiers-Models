import * as THREE from 'three';

export type ZoneId = 'Z1' | 'Z2' | 'Z3' | 'Z4';
export type LightingMode = 'golden_hour' | 'night';
export type QualityPreset = 'high' | 'low';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type CameraMode = 'chase' | 'cockpit';
export type CarModelId = 'aurelia_gtr' | 'solara_corsa';
export type SurfaceType = 'asphalt' | 'curb' | 'sand' | 'gravel' | 'grass' | 'bridge';
export type GameScreen = 'loading' | 'menu' | 'garage' | 'setup' | 'grid_intro' | 'countdown' | 'racing' | 'paused' | 'results';

export interface ControlPointSpec {
  x: number;
  y: number;
  z: number;
  width: number;
  bankDeg: number;
  zone: ZoneId;
}

export interface ZoneSpec {
  id: ZoneId;
  name: string;
  startS: number;
  endS: number;
}

export interface TrackSpec {
  name: string;
  seed: number;
  version: string;
  seaLevel: number;
  startFinishS: number;
  sunDirectionGoldenHour: [number, number, number];
  moonDirectionNight: [number, number, number];
  zones: ZoneSpec[];
  bridge: {
    startS: number;
    endS: number;
    deckThickness: number;
    ravineDepth: number;
  };
  plaza: {
    s: number;
    side: number;
    offset: number;
    radius: number;
  };
  checkpointCount: number;
  controlPoints: ControlPointSpec[];
}

export interface SplineSample {
  s: number;
  u: number;
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  up: THREE.Vector3;
  flatRight: THREE.Vector3;
  width: number;
  bankRad: number;
  curvature: number; // signed: >0 right turn, <0 left turn
  radius: number;
  grade: number;
  zone: ZoneId;
  isBridge: boolean;
}

export interface CheckpointData {
  index: number;
  s: number;
  pos: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
  width: number;
}

export interface LiverySpec {
  id: string;
  name: string;
  number: string;
  primaryHex: number;
  secondaryHex: number;
  accentHex: number;
  caliperHex: number;
  rimHex: number;
}

export interface CarModelSpec {
  id: CarModelId;
  name: string;
  subtitle: string;
  engineType: 'gt' | 'corsa';
  mass: number;
  wheelbase: number;
  frontAxleZ: number; // negative Z (forward)
  rearAxleZ: number;  // positive Z (rear)
  trackWidth: number;
  wheelRadius: number;
  wheelWidth: number;
  maxSteerRad: number;
  engineForce: number;
  topSpeedKmh: number;
  maxRpm: number;
  idleRpm: number;
  redlineRpm: number;
  gearRatios: number[];
  stats: { speed: number; handling: number; accel: number };
}

export interface RaceConfig {
  carModel: CarModelId;
  liveryIndex: number;
  laps: 3 | 6;
  difficulty: Difficulty;
  lighting: LightingMode;
  quality: QualityPreset;
}

export interface VolumeSettings {
  master: number;
  sfx: number;
  music: number;
}

export interface ControlInput {
  throttle: number; // 0..1
  brake: number;    // 0..1
  steer: number;    // -1 (left) .. +1 (right)
  nitro: boolean;
}

export interface RigidObstacleRecord {
  id: string;
  kind: 'building' | 'tree' | 'boulder' | 'pillar' | 'wall';
  x: number;
  y: number;
  z: number;
  radius: number;
  halfX?: number;
  halfZ?: number;
  yaw?: number;
  height: number;
  intentionalSink?: boolean;
  archetype?: string;
  zone?: ZoneId;
  tier?: number;
}

export interface WorldValidationError {
  invariant: string;
  message: string;
  value?: number;
  threshold?: number;
  location?: [number, number, number];
}

export interface WorldValidationReport {
  ok: boolean;
  errors: WorldValidationError[];
  metrics: {
    trackLengthM: number;
    minCornerRadiusM: number;
    maxGradePct: number;
    maxBankingDeg: number;
    maxTerrainPokeAboveRoadM: number;
    maxRoadEdgeStepM: number;
    obstaclesInExclusionZone: number;
    floatingObjectsCount: number;
    overlappingBuildingsCount: number;
    checkpointErrors: number;
  };
}
