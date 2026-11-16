import * as THREE from 'three';
import { TrackSpline } from './track';
import { WorldValidationReport } from './types';
import { CarVisualInstance } from './cars';

export interface SceneAuditReport {
  ok: boolean;
  errors: string[];
  cars: { index: number; triangles: number; materials: number }[];
  boxViolations: string[];
  flatMaterialViolations: string[];
  smallTextureViolations: string[];
  worldMetrics: WorldValidationReport['metrics'];
  playerEngineHasAudioBuffer: boolean;
}

function getTextureSize(tex: THREE.Texture | null | undefined): [number, number] | null {
  if (!tex || !tex.image) return null;
  const img = tex.image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number };
  const w = img.width || img.videoWidth || 0;
  const h = img.height || img.videoHeight || 0;
  return w > 0 && h > 0 ? [w, h] : null;
}

export function runSceneGraphAudit(
  scene: THREE.Scene,
  track: TrackSpline,
  cars: CarVisualInstance[],
  validation: WorldValidationReport,
  playerEngineHasAudioBuffer: boolean
): SceneAuditReport {
  const errors: string[] = [];
  const boxViolations: string[] = [];
  const flatMaterialViolations: string[] = [];
  const smallTextureViolations: string[] = [];

  // 1. Cars triangle & material counts
  const carStats = cars.map((c, idx) => {
    if (c.triangleCount < 15000) {
      errors.push(`Car ${idx} triangles ${c.triangleCount} < 15000`);
    }
    if (c.materialCount < 6) {
      errors.push(`Car ${idx} materials ${c.materialCount} < 6`);
    }
    return { index: idx, triangles: c.triangleCount, materials: c.materialCount };
  });

  // 2. Traverse scene graph near track (< 50 m) for Box Detector, Flat-Color Detector, and Texture Res!
  const box3 = new THREE.Box3();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  const seenMats = new Set<string>();

  scene.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (!obj.visible) return;
    if (obj.name === 'contact-shadow' || obj.name === 'ocean' || obj.name === 'sky') return;

    // Ignore InstancedMesh bounding box at origin; instead check prototype or instance sample
    if (obj instanceof THREE.InstancedMesh) {
      const g = obj.geometry;
      const tris = g.index ? g.index.count / 3 : (g.attributes.position?.count || 0) / 3;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) checkMaterial(m, obj.name || 'instanced', tris);
      return;
    }

    box3.setFromObject(obj);
    box3.getSize(size);
    box3.getCenter(center);

    const proj = track.projectPointXZ(center.x, center.y, center.z);
    const maxDim = Math.max(size.x, size.y, size.z);
    const nearTrack = proj.distToEdge < 50 || maxDim > 80;
    if (!nearTrack) return;

    const g = obj.geometry;
    const tris = g.index ? g.index.count / 3 : (g.attributes.position?.count || 0) / 3;

    // Box detector: BoxGeometry or <= 12 triangles with > 1m in any axis (skip transparent decals/glass)
    const isBox = g instanceof THREE.BoxGeometry;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const isAllTransparentOrWater = mats.every((m) => m instanceof THREE.ShaderMaterial || m.transparent);
    if (!isAllTransparentOrWater && maxDim > 1.0 && (isBox || tris <= 12)) {
      const msg = `${obj.name || 'mesh'} (${g.type}, ${tris} tris, maxDim=${maxDim.toFixed(2)}m)`;
      if (!boxViolations.includes(msg)) boxViolations.push(msg);
    }

    for (const m of mats) {
      checkMaterial(m, obj.name || 'mesh', tris);
    }
  });

  function checkMaterial(m: THREE.Material, label: string, _tris: number): void {
    if (seenMats.has(m.uuid)) return;
    seenMats.add(m.uuid);
    if (m instanceof THREE.ShaderMaterial) return; // custom ocean/sky shaders
    if (m instanceof THREE.MeshBasicMaterial && m.transparent) return; // contact shadow / flare
    // Exempt glass & emissive lights
    if (m.transparent && m.opacity < 0.95) return;
    if (m instanceof THREE.MeshStandardMaterial && m.emissiveIntensity > 0.5) return;

    if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
      if (!m.map || !m.normalMap) {
        flatMaterialViolations.push(`${label} (${m.name || m.type}, map=${Boolean(m.map)}, nor=${Boolean(m.normalMap)})`);
      }
      const mapSize = getTextureSize(m.map);
      if (mapSize && Math.min(mapSize[0], mapSize[1]) < 1024) {
        smallTextureViolations.push(`${label} map ${mapSize[0]}x${mapSize[1]}`);
      }
      const norSize = getTextureSize(m.normalMap);
      if (norSize && Math.min(norSize[0], norSize[1]) < 1024) {
        smallTextureViolations.push(`${label} normalMap ${norSize[0]}x${norSize[1]}`);
      }
    }
  }

  if (boxViolations.length > 0) {
    errors.push(`Box detector violations: ${boxViolations.slice(0, 5).join(', ')}`);
  }
  if (flatMaterialViolations.length > 0) {
    errors.push(`Flat material violations: ${flatMaterialViolations.slice(0, 5).join(', ')}`);
  }
  if (smallTextureViolations.length > 0) {
    errors.push(`Small texture (<1024) violations: ${smallTextureViolations.slice(0, 5).join(', ')}`);
  }

  // World scenery counts
  if (!validation.ok) {
    errors.push(...validation.errors);
  }
  if (!playerEngineHasAudioBuffer) {
    errors.push('Player engine audio does not use AudioBuffer samples');
  }

  return {
    ok: errors.length === 0,
    errors,
    cars: carStats,
    boxViolations,
    flatMaterialViolations,
    smallTextureViolations,
    worldMetrics: validation.metrics,
    playerEngineHasAudioBuffer,
  };
}
