import * as THREE from 'three';
import { QualityPreset, RigidObstacleRecord, ZoneId } from '../types';
import { LoadedAssets } from './assets';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';
import { SeededRNG, clamp } from '../utils/rng';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export interface FloraSystem {
  group: THREE.Group;
  speciesNames: string[];
  hasTrees: boolean;
  hasShrubs: boolean;
  hasGroundcover: boolean;
  foliageTranslucencyActive: boolean;
  totalTreeCount: number;
  totalShrubCount: number;
  totalGrassCount: number;
  obstacles: RigidObstacleRecord[];
  update: (timeSec: number, sunDir: THREE.Vector3, isNight: boolean) => void;
  setQuality: (quality: QualityPreset) => void;
}

interface FoliageUniforms {
  uTime: { value: number };
  uSunDir: { value: THREE.Vector3 };
  uSunColor: { value: THREE.Color };
  uTranslucency: { value: number };
}

/**
 * Creates a botanical alpha-cutout PBR material with:
 * - Real scanned ambientCG RGBA leaf/frond/grass texture + normal + roughness
 * - Golden Hour backlight translucency approximation (warm glowing sun through leaves - Ref 10!)
 * - Subtle vertex wind sway
 */
function createFoliageMaterial(
  tex: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture },
  sharedUniforms: FoliageUniforms,
  opts: { color?: number; alphaTest?: number; swayAmp?: number; translucencyMul?: number } = {}
): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: opts.color ?? 0xffffff,
    map: tex.map,
    normalMap: tex.normalMap,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: tex.roughnessMap,
    roughness: 0.90,
    metalness: 0.0,
    envMapIntensity: 0.42,
    alphaTest: opts.alphaTest ?? 0.44,
    side: THREE.DoubleSide,
  });

  const swayAmp = opts.swayAmp ?? 0.09;
  const transMul = opts.translucencyMul ?? 1.0;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = sharedUniforms.uTime;
    shader.uniforms.uSunDir = sharedUniforms.uSunDir;
    shader.uniforms.uSunColor = sharedUniforms.uSunColor;
    shader.uniforms.uTranslucency = sharedUniforms.uTranslucency;
    shader.uniforms.uSwayAmp = { value: swayAmp };
    shader.uniforms.uTransMul = { value: transMul };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTime;
        uniform float uSwayAmp;
        varying vec3 vFolWorldPos;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec4 wInst = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wInst = instanceMatrix * wInst;
        #endif
        vec4 wPos0 = modelMatrix * wInst;
        float swayPhase = uTime * 1.7 + wPos0.x * 0.19 + wPos0.z * 0.23;
        float heightFactor = clamp(position.y * 0.28, 0.0, 1.4);
        transformed.x += sin(swayPhase) * uSwayAmp * heightFactor;
        transformed.z += cos(swayPhase * 0.83) * uSwayAmp * 0.7 * heightFactor;
        vFolWorldPos = wPos0.xyz;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        uniform float uTranslucency;
        uniform float uTransMul;
        varying vec3 vFolWorldPos;`
      )
      .replace(
        '#include <dithering_fragment>',
        `
        // Golden Hour warm foliage backlight translucency (compare Ref 10!)
        vec3 viewDirW = normalize(cameraPosition - vFolWorldPos);
        float backDot = pow(clamp(dot(viewDirW, -uSunDir), 0.0, 1.0), 3.0);
        float rimWrap = 0.16 + 0.84 * backDot;
        vec3 sssTint = diffuseColor.rgb * uSunColor * vec3(1.22, 1.06, 0.42);
        gl_FragColor.rgb += sssTint * rimWrap * uTranslucency * uTransMul * 0.36;
        #include <dithering_fragment>
        `
      );
  };
  mat.customProgramCacheKey = () => `foliage-translucent-sway-${swayAmp}-${transMul}`;
  mat.userData.foliageTranslucency = true;
  return mat;
}

/**
 * Computes smoothed radial canopy normals pointing outward from canopyCenter (blended with +Y up)
 * so foliage cards shade as cohesive lush 3D volumes instead of flat intersecting planes!
 */
function applyRadialCanopyNormals(geom: THREE.BufferGeometry, center: THREE.Vector3, upBias = 0.35): void {
  const pos = geom.attributes.position;
  const norms = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).sub(center);
    v.y += upBias * Math.max(1.0, v.length());
    if (v.lengthSq() < 1e-5) v.set(0, 1, 0);
    else v.normalize();
    norms[i * 3] = v.x;
    norms[i * 3 + 1] = v.y;
    norms[i * 3 + 2] = v.z;
  }
  geom.setAttribute('normal', new THREE.BufferAttribute(norms, 3));
}

function makeCurvedCard(w: number, h: number, bend: number): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(w, h, 2, 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (w * 0.5);
    const ny = y / (h * 0.5);
    pos.setZ(i, -(nx * nx + ny * ny) * bend);
  }
  return g;
}

function normalizeForMerge(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const out = g.index ? g.toNonIndexed() : g.clone();
  if (!out.attributes.normal) out.computeVertexNormals();
  if (!out.attributes.uv) {
    const cnt = out.attributes.position.count;
    out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(cnt * 2), 2));
  }
  // Keep only position, normal, uv
  for (const key of Object.keys(out.attributes)) {
    if (key !== 'position' && key !== 'normal' && key !== 'uv') out.deleteAttribute(key);
  }
  return out;
}

// =============================================================================
// 100% AGENT-MODELED MEDITERRANEAN TREE SPECIES (4 DISTINCT SPECIES!)
// =============================================================================

/** Species 1: Mediterranean Umbrella Stone Pine (Pinus pinea) — tall curving trunk, spreading upper boughs, wide layered umbrella needle crown! */
function buildStonePinePrototype(): { trunkGeom: THREE.BufferGeometry; foliageGeom: THREE.BufferGeometry } {
  const trunkParts: THREE.BufferGeometry[] = [];
  const folParts: THREE.BufferGeometry[] = [];
  const rng = new SeededRNG(101);

  // Tapered slightly curved main trunk (sunk -0.35m below y=0 for grounded roots!)
  const segs = 5;
  let cx = 0, cz = 0;
  for (let i = 0; i < segs; i++) {
    const y0 = -0.35 + i * 1.45;
    const r0 = 0.42 - i * 0.045;
    const r1 = 0.42 - (i + 1) * 0.045;
    const seg = new THREE.CylinderGeometry(r1, r0, 1.52, 8);
    const dx = (rng.next() - 0.5) * 0.25;
    const dz = (rng.next() - 0.5) * 0.25;
    seg.translate(cx + dx * 0.5, y0 + 0.72, cz + dz * 0.5);
    trunkParts.push(normalizeForMerge(seg));
    cx += dx;
    cz += dz;
  }

  // 6 Spreading primary upper boughs reaching up into the wide umbrella crown (y=6.5..9.8m)
  const boughCount = 6;
  for (let b = 0; b < boughCount; b++) {
    const a = (b / boughCount) * Math.PI * 2 + rng.range(-0.2, 0.2);
    const bLen = rng.range(3.0, 4.2);
    const pitch = rng.range(0.55, 0.85);
    const bough = new THREE.CylinderGeometry(0.09, 0.20, bLen, 6);
    bough.translate(0, bLen * 0.5, 0);
    bough.rotateZ(pitch);
    bough.rotateY(a);
    bough.translate(cx, 6.2, cz);
    trunkParts.push(normalizeForMerge(bough));

    // Tip of bough: layered umbrella needle cluster cards!
    const tipX = cx - Math.sin(pitch) * Math.cos(a) * bLen;
    const tipY = 6.2 + Math.cos(pitch) * bLen;
    const tipZ = cz + Math.sin(pitch) * Math.sin(a) * bLen;

    for (let k = 0; k < 5; k++) {
      const card = makeCurvedCard(rng.range(3.4, 4.6), rng.range(2.8, 3.8), 0.45);
      card.rotateX(-Math.PI * 0.38 + rng.range(-0.45, 0.45));
      card.rotateY(rng.range(0, Math.PI * 2));
      card.rotateZ(rng.range(-0.35, 0.35));
      card.translate(
        tipX + rng.range(-1.1, 1.1),
        tipY + rng.range(-0.4, 0.9),
        tipZ + rng.range(-1.1, 1.1)
      );
      folParts.push(normalizeForMerge(card));
    }
  }
  // Crown central dome clusters
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const card = makeCurvedCard(4.2, 3.6, 0.5);
    card.rotateX(-Math.PI * 0.42 + rng.range(-0.3, 0.3));
    card.rotateY(a);
    card.translate(cx + Math.cos(a) * 1.3, 9.1 + rng.range(-0.3, 0.6), cz + Math.sin(a) * 1.3);
    folParts.push(normalizeForMerge(card));
  }

  const trunkGeom = BufferGeometryUtils.mergeGeometries(trunkParts, false)!;
  const foliageGeom = BufferGeometryUtils.mergeGeometries(folParts, false)!;
  applyRadialCanopyNormals(foliageGeom, new THREE.Vector3(cx, 8.2, cz), 0.45);
  return { trunkGeom, foliageGeom };
}

/** Species 2: Coastal Date/Fan Palm (Phoenix / Washingtonia) — curved ringed trunk + 16 gracefully arching feathered fronds! */
function buildCoastalPalmPrototype(): { trunkGeom: THREE.BufferGeometry; foliageGeom: THREE.BufferGeometry } {
  const trunkParts: THREE.BufferGeometry[] = [];
  const folParts: THREE.BufferGeometry[] = [];
  const rng = new SeededRNG(202);

  // Gracefully leaning segmented palm trunk (height ~9.5m, sunk -0.4m below grade)
  const segs = 10;
  let px = 0, py = -0.4, pz = 0;
  const leanX = 1.15;
  const leanZ = 0.45;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs;
    const t1 = (i + 1) / segs;
    const hSeg = 1.04;
    const rBot = lerpRadius(0.38, 0.19, t0) * (1 + (i % 2) * 0.06);
    const rTop = lerpRadius(0.38, 0.19, t1);
    const x0 = leanX * t0 * t0;
    const z0 = leanZ * t0 * t0;
    const x1 = leanX * t1 * t1;
    const z1 = leanZ * t1 * t1;
    const seg = new THREE.CylinderGeometry(rTop, rBot, hSeg + 0.06, 8);
    const dx = x1 - x0;
    const dz = z1 - z0;
    seg.rotateZ(-Math.atan2(dx, hSeg));
    seg.rotateX(Math.atan2(dz, hSeg));
    seg.translate((x0 + x1) * 0.5, py + hSeg * 0.5, (z0 + z1) * 0.5);
    trunkParts.push(normalizeForMerge(seg));
    px = x1;
    py += hSeg;
    pz = z1;
  }

  // Crown base husk
  const crown = new THREE.SphereGeometry(0.34, 8, 6);
  crown.translate(px, py - 0.1, pz);
  trunkParts.push(normalizeForMerge(crown));

  // 16 Arched feathered palm fronds fanning cleanly in 3 elevation tiers (Ref 01!)
  const frondTiers = [
    { count: 6, elev: 0.72, droop: 1.05, len: 3.6, w: 1.55 },
    { count: 6, elev: 0.28, droop: 1.35, len: 4.1, w: 1.72 },
    { count: 4, elev: -0.18, droop: 1.55, len: 3.8, w: 1.60 },
  ];
  for (let tierIdx = 0; tierIdx < frondTiers.length; tierIdx++) {
    const tier = frondTiers[tierIdx];
    for (let i = 0; i < tier.count; i++) {
      const yaw = (i / tier.count) * Math.PI * 2 + tierIdx * 0.52 + rng.range(-0.14, 0.14);
      // Curved multi-segment arched frond ribbon (base at y=0, tip at y=len, UV v=0 at base -> v=1 at tip!)
      const g = new THREE.PlaneGeometry(tier.w, tier.len, 2, 7);
      const pos = g.attributes.position;
      for (let vi = 0; vi < pos.count; vi++) {
        const vx = pos.getX(vi);
        const vy = pos.getY(vi) + tier.len * 0.5; // 0 at stem base -> len at tip
        const frac = vy / tier.len;
        // Graceful palm arch: rises outward then droops naturally at tip!
        const outR = vy * Math.cos(tier.elev) + Math.sin(frac * Math.PI) * 0.35;
        const upY = vy * Math.sin(tier.elev) - Math.pow(frac, 2.15) * tier.droop;
        // Slight V-fold along central frond spine
        const vFold = -Math.abs(vx) * 0.18;
        pos.setXYZ(vi, vx, upY + vFold, outR);
      }
      g.rotateY(yaw);
      g.translate(px, py, pz);
      folParts.push(normalizeForMerge(g));
    }
  }

  const trunkGeom = BufferGeometryUtils.mergeGeometries(trunkParts, false)!;
  const foliageGeom = BufferGeometryUtils.mergeGeometries(folParts, false)!;
  applyRadialCanopyNormals(foliageGeom, new THREE.Vector3(px, py - 0.5, pz), 0.55);
  return { trunkGeom, foliageGeom };
}

/** Species 3: Gnarled Mediterranean Olive Tree (Olea europaea) — twisting split trunk + airy silvery-green rounded crown! */
function buildOlivePrototype(): { trunkGeom: THREE.BufferGeometry; foliageGeom: THREE.BufferGeometry } {
  const trunkParts: THREE.BufferGeometry[] = [];
  const folParts: THREE.BufferGeometry[] = [];
  const rng = new SeededRNG(303);

  // Stocky gnarled lower trunk
  const base = new THREE.CylinderGeometry(0.28, 0.44, 2.0, 8);
  base.translate(0, 0.65, 0);
  trunkParts.push(normalizeForMerge(base));

  // 5 twisting primary limbs
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rng.range(-0.25, 0.25);
    const len = rng.range(1.9, 2.6);
    const tilt = rng.range(0.55, 0.92);
    const limb = new THREE.CylinderGeometry(0.08, 0.18, len, 6);
    limb.translate(0, len * 0.5, 0);
    limb.rotateZ(tilt);
    limb.rotateY(a);
    limb.translate(0, 1.45, 0);
    trunkParts.push(normalizeForMerge(limb));

    const tipX = -Math.sin(tilt) * Math.cos(a) * len;
    const tipY = 1.45 + Math.cos(tilt) * len;
    const tipZ = Math.sin(tilt) * Math.sin(a) * len;

    for (let k = 0; k < 5; k++) {
      const card = makeCurvedCard(rng.range(2.2, 3.0), rng.range(2.0, 2.8), 0.35);
      card.rotateX(rng.range(-1.2, 1.2));
      card.rotateY(rng.range(0, Math.PI * 2));
      card.rotateZ(rng.range(-0.8, 0.8));
      card.translate(
        tipX + rng.range(-0.75, 0.75),
        tipY + rng.range(-0.35, 0.75),
        tipZ + rng.range(-0.75, 0.75)
      );
      folParts.push(normalizeForMerge(card));
    }
  }
  for (let k = 0; k < 5; k++) {
    const card = makeCurvedCard(2.6, 2.4, 0.35);
    card.rotateX(rng.range(-0.8, 0.8));
    card.rotateY((k / 5) * Math.PI * 2);
    card.translate(rng.range(-0.5, 0.5), 3.6 + rng.range(-0.2, 0.5), rng.range(-0.5, 0.5));
    folParts.push(normalizeForMerge(card));
  }

  const trunkGeom = BufferGeometryUtils.mergeGeometries(trunkParts, false)!;
  const foliageGeom = BufferGeometryUtils.mergeGeometries(folParts, false)!;
  applyRadialCanopyNormals(foliageGeom, new THREE.Vector3(0, 3.2, 0), 0.40);
  return { trunkGeom, foliageGeom };
}

/** Species 4: Tall Mediterranean Cypress (Cupressus sempervirens) — iconic slender columnar flame silhouette built from dense layered foliage cards (NEVER a cone primitive!) */
function buildCypressPrototype(): { trunkGeom: THREE.BufferGeometry; foliageGeom: THREE.BufferGeometry } {
  const trunkParts: THREE.BufferGeometry[] = [];
  const folParts: THREE.BufferGeometry[] = [];
  const rng = new SeededRNG(404);

  const trunk = new THREE.CylinderGeometry(0.08, 0.24, 9.2, 7);
  trunk.translate(0, 4.2, 0);
  trunkParts.push(normalizeForMerge(trunk));

  // Layered spiral clusters climbing cleanly from y=1.3m to y=10.6m in natural tapering flame profile
  const tiers = 11;
  for (let t = 0; t < tiers; t++) {
    const frac = t / (tiers - 1);
    const y = 1.4 + frac * 8.8;
    // Natural Italian cypress silhouette: swells quickly near base, tapers gently to crisp spire tip
    const radius = Math.sin(Math.pow(frac, 0.58) * Math.PI) * 1.18 + (1 - frac) * 0.22;
    const cardsInTier = frac > 0.82 ? 3 : 4;
    for (let k = 0; k < cardsInTier; k++) {
      const a = (k / cardsInTier) * Math.PI * 2 + t * 0.85;
      const w = Math.max(0.85, radius * 2.15);
      const h = Math.max(1.15, radius * 2.25);
      const card = makeCurvedCard(w, h, 0.25);
      card.rotateX(rng.range(-0.35, 0.25));
      card.rotateY(a + rng.range(-0.2, 0.2));
      card.translate(Math.cos(a) * radius * 0.42, y, Math.sin(a) * radius * 0.42);
      folParts.push(normalizeForMerge(card));
    }
  }

  const trunkGeom = BufferGeometryUtils.mergeGeometries(trunkParts, false)!;
  const foliageGeom = BufferGeometryUtils.mergeGeometries(folParts, false)!;
  applyRadialCanopyNormals(foliageGeom, new THREE.Vector3(0, 5.4, 0), 0.30);
  return { trunkGeom, foliageGeom };
}

/** Mid-Stratum Mediterranean Maquis Shrub (multi-card layered organic dome — zero primitives!) */
function buildShrubPrototype(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const rng = new SeededRNG(505);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rng.range(-0.2, 0.2);
    const card = makeCurvedCard(rng.range(1.4, 2.0), rng.range(1.15, 1.65), 0.26);
    card.rotateX(rng.range(-0.55, 0.35));
    card.rotateY(a);
    card.translate(Math.cos(a) * 0.38, 0.58 + rng.range(-0.1, 0.25), Math.sin(a) * 0.38);
    parts.push(normalizeForMerge(card));
  }
  const geom = BufferGeometryUtils.mergeGeometries(parts, false)!;
  applyRadialCanopyNormals(geom, new THREE.Vector3(0, 0.65, 0), 0.55);
  return geom;
}

/** Groundcover Coastal Grass Tuft (crossed arched photographic grass blade fans firmly rooted at y=-0.06m!) */
function buildGrassTuftPrototype(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI;
    const g = new THREE.PlaneGeometry(1.15, 0.78, 2, 2);
    const pos = g.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const py = pos.getY(v) + 0.39; // 0..0.78
      const px = pos.getX(v);
      // Root firmly -6cm into terrain so zero tufts ever float!
      pos.setY(v, py - 0.06);
      pos.setZ(v, (py * py) * 0.22 + Math.abs(px) * 0.08);
    }
    g.rotateY(a);
    parts.push(normalizeForMerge(g));
  }
  const geom = BufferGeometryUtils.mergeGeometries(parts, false)!;
  applyRadialCanopyNormals(geom, new THREE.Vector3(0, 0.1, 0), 0.85);
  return geom;
}

function lerpRadius(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function buildFloraSystem(
  track: TrackSpline,
  terrain: TerrainSystem,
  assets: LoadedAssets,
  existingObstacles: RigidObstacleRecord[]
): FloraSystem {
  const group = new THREE.Group();
  group.name = 'flora_system';

  const sharedUniforms: FoliageUniforms = {
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(...track.spec.sunDirectionGoldenHour).normalize() },
    uSunColor: { value: new THREE.Color(0xffc070) },
    uTranslucency: { value: 1.0 },
  };

  // Real scanned Poly Haven Bark Materials
  const barkPineMat = new THREE.MeshStandardMaterial({
    map: assets.textures.bark_pine.map,
    normalMap: assets.textures.bark_pine.normalMap,
    roughnessMap: assets.textures.bark_pine.roughnessMap,
    roughness: 0.92,
    metalness: 0.0,
  });
  const barkPalmMat = new THREE.MeshStandardMaterial({
    map: assets.textures.bark_palm.map,
    normalMap: assets.textures.bark_palm.normalMap,
    roughnessMap: assets.textures.bark_palm.roughnessMap,
    roughness: 0.90,
    metalness: 0.0,
  });

  // Real scanned ambientCG Alpha-Cutout Foliage Materials with Backlight Translucency + Wind Sway!
  const pineFolMat = createFoliageMaterial(assets.textures.cluster_pine, sharedUniforms, {
    color: 0xbfd4a4,
    alphaTest: 0.42,
    swayAmp: 0.08,
    translucencyMul: 1.15,
  });
  const palmFolMat = createFoliageMaterial(assets.textures.cluster_palm_frond, sharedUniforms, {
    color: 0xcce0ac,
    alphaTest: 0.40,
    swayAmp: 0.14,
    translucencyMul: 1.25,
  });
  const oliveFolMat = createFoliageMaterial(assets.textures.cluster_olive, sharedUniforms, {
    color: 0xc4d0b2,
    alphaTest: 0.42,
    swayAmp: 0.07,
    translucencyMul: 1.05,
  });
  const cypressFolMat = createFoliageMaterial(assets.textures.cluster_pine, sharedUniforms, {
    color: 0x8ea87c,
    alphaTest: 0.42,
    swayAmp: 0.06,
    translucencyMul: 0.85,
  });
  const shrubMat = createFoliageMaterial(assets.textures.cluster_shrub, sharedUniforms, {
    color: 0xb0c88e,
    alphaTest: 0.44,
    swayAmp: 0.05,
    translucencyMul: 1.0,
  });
  const grassMat = createFoliageMaterial(assets.textures.cluster_grass_tuft, sharedUniforms, {
    color: 0xbcc684,
    alphaTest: 0.42,
    swayAmp: 0.08,
    translucencyMul: 1.05,
  });

  // Build 100% agent-modeled prototypes
  const pineProto = buildStonePinePrototype();
  const palmProto = buildCoastalPalmPrototype();
  const oliveProto = buildOlivePrototype();
  const cypressProto = buildCypressPrototype();
  const shrubGeom = buildShrubPrototype();
  const grassGeom = buildGrassTuftPrototype();

  const rng = new SeededRNG(track.spec.seed + 777);
  const obstacles: RigidObstacleRecord[] = [];
  const plazaCenter = terrain.getPlazaCenter();

  interface Placement {
    x: number;
    y: number;
    z: number;
    scale: number;
    yaw: number;
    tint: THREE.Color;
    nearTrack: boolean;
  }

  const pineList: Placement[] = [];
  const palmList: Placement[] = [];
  const oliveList: Placement[] = [];
  const cypressList: Placement[] = [];
  const shrubList: Placement[] = [];
  const grassList: Placement[] = [];

  // Helper checking clearance from ALL road segments (strict >= 3.0m exclusion zone for trees!) and existing buildings!
  const isClearForTree = (x: number, z: number, trunkR: number, minRoadEdgeClear = 4.2): boolean => {
    const y = terrain.getHeight(x, z);
    if (y < 1.2) return false; // never plant trees underwater or on wet sand!
    const nearest = track.closestPointXZ(x, z);
    const roadEdgeClear = Math.abs(nearest.lateral) - nearest.sample.width * 0.5 - trunkR;
    if (roadEdgeClear < minRoadEdgeClear) return false;
    // Keep Z4 viaduct bridge deck & ravine arch sightline clear beside the bridge!
    if (nearest.sample.isBridge && Math.abs(nearest.lateral) < nearest.sample.width * 0.5 + 15.0) return false;
    // Don't collide with village buildings or plaza center
    const dPlaza = Math.hypot(x - plazaCenter.x, z - plazaCenter.z);
    if (dPlaza < 14.5) return false;
    for (let i = 0; i < existingObstacles.length; i++) {
      const o = existingObstacles[i];
      const minD = o.radius + trunkR + 2.2;
      if ((x - o.x) ** 2 + (z - o.z) ** 2 < minD * minD) return false;
    }
    return true;
  };

  const pushTree = (
    list: Placement[],
    species: string,
    x: number,
    z: number,
    scale: number,
    trunkR: number,
    tintHex: number,
    nearTrack: boolean
  ) => {
    const y = terrain.getHeight(x, z);
    const tint = new THREE.Color(tintHex);
    tint.offsetHSL(rng.range(-0.025, 0.025), rng.range(-0.08, 0.08), rng.range(-0.09, 0.09));
    list.push({ x, y, z, scale, yaw: rng.range(0, Math.PI * 2), tint, nearTrack });
    obstacles.push({
      id: `tree_${species}_${obstacles.length}`,
      kind: 'tree',
      x,
      y,
      z,
      radius: trunkR,
      height: 8 * scale,
    });
  };

  // ---------------------------------------------------------------------------
  // 1. Z1 Waterfront Palm Promenade & Beach Dune Grasses (Ref 01 & Ref 03!)
  // ---------------------------------------------------------------------------
  const z1 = track.spec.zones[0];
  for (let s = z1.startS + 20; s < z1.endS - 10; s += 19) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    // Tall coastal palms framing BOTH sides of the Golden Hour waterfront straight!
    for (const side of [-1, 1] as const) {
      if (side === -1 && rng.next() > 0.78) continue; // keep sea vistas open & rhythmic like Ref 01!
      const lat = side * (halfW + rng.range(6.0, side === 1 ? 15.0 : 10.5));
      const x = smp.pos.x + smp.flatRight.x * lat;
      const z = smp.pos.z + smp.flatRight.z * lat;
      if (isClearForTree(x, z, 0.48, 4.4)) {
        pushTree(palmList, 'palm', x, z, rng.range(0.88, 1.32), 0.45, 0xd8ebbd, true);
      }
    }
    // Secondary inland coastal pines & cypresses along eastern hill rising behind Z1
    const inlandLat = halfW + rng.range(18, 42);
    const ix = smp.pos.x + smp.flatRight.x * inlandLat;
    const iz = smp.pos.z + smp.flatRight.z * inlandLat;
    if (isClearForTree(ix, iz, 0.5, 5.0)) {
      if (rng.next() < 0.55) pushTree(pineList, 'pine', ix, iz, rng.range(0.9, 1.3), 0.5, 0xcbe0b8, false);
      else pushTree(oliveList, 'olive', ix, iz, rng.range(0.95, 1.35), 0.45, 0xd4dfc8, false);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Z2 Cliffside — Mediterranean Olives, Maquis Scrub & Cypresses clinging to inner cliff ledges
  // ---------------------------------------------------------------------------
  const z2 = track.spec.zones[1];
  for (let s = z2.startS; s < z2.endS; s += 16) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const seaSide = s >= 1175 && s <= 1375 ? 1 : -1;
    const cliffSide = -seaSide;
    // Inner hillside (cliffSide) terraced pines, olives, cypresses (leaving seaSide panorama 100% open!)
    for (let k = 0; k < 2; k++) {
      const lat = cliffSide * (halfW + rng.range(7.5, 34.0));
      const x = smp.pos.x + smp.flatRight.x * lat;
      const z = smp.pos.z + smp.flatRight.z * lat;
      const nrm = terrain.getNormal(x, z);
      if (nrm.y > 0.64 && isClearForTree(x, z, 0.5, 4.6)) {
        const pick = rng.next();
        if (pick < 0.42) pushTree(oliveList, 'olive', x, z, rng.range(0.85, 1.25), 0.45, 0xd5dfc7, Math.abs(lat) < 18);
        else if (pick < 0.74) pushTree(pineList, 'pine', x, z, rng.range(0.85, 1.25), 0.5, 0xc6dab2, Math.abs(lat) < 18);
        else pushTree(cypressList, 'cypress', x, z, rng.range(0.85, 1.25), 0.38, 0x9fb88e, Math.abs(lat) < 18);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Z3 Village — Iconic Tuscan Cypresses, Courtyard Olives & Plaza Framing Trees!
  // ---------------------------------------------------------------------------
  // Plaza framing olive trees & cypresses around perimeter
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.35;
    const tx = plazaCenter.x + Math.cos(a) * 16.5;
    const tz = plazaCenter.z + Math.sin(a) * 16.5;
    if (isClearForTree(tx, tz, 0.42, 4.2)) {
      if (i % 2 === 0) pushTree(oliveList, 'olive', tx, tz, rng.range(0.95, 1.15), 0.4, 0xd9e4ce, true);
      else pushTree(cypressList, 'cypress', tx, tz, rng.range(0.9, 1.15), 0.35, 0xa2bc90, true);
    }
  }
  // Cypress & palm accents woven between village tiers and surrounding coastal hillside!
  const z3 = track.spec.zones[2];
  for (let s = z3.startS; s < z3.endS; s += 18) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    for (const side of [-1, 1] as const) {
      const lat = side * (halfW + rng.range(16.0, 56.0));
      const x = smp.pos.x + smp.flatRight.x * lat;
      const z = smp.pos.z + smp.flatRight.z * lat;
      if (isClearForTree(x, z, 0.45, 5.5)) {
        const pick = rng.next();
        if (pick < 0.45) pushTree(cypressList, 'cypress', x, z, rng.range(0.9, 1.35), 0.38, 0xa0b98c, false);
        else if (pick < 0.78) pushTree(pineList, 'pine', x, z, rng.range(0.9, 1.3), 0.48, 0xc7dbb2, false);
        else pushTree(palmList, 'palm', x, z, rng.range(0.85, 1.15), 0.42, 0xd8ecbe, false);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Z4 Coastal Woods & Descent — LUSH MULTI-STRATA MEDITERRANEAN FOREST (Refs 08, 09, 10!)
  //    Dense foreground, midground & background organic clusters of ALL 4 species + dense shrubs + grass!
  // ---------------------------------------------------------------------------
  const z4 = track.spec.zones[3];
  for (let s = z4.startS - 30; s < z4.endS; s += 7.5) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    // Organic clusters on BOTH sides of Z4 road framing corners tightly with zero bare voids!
    for (const side of [-1, 1] as const) {
      // Foreground forest canopy (5.5m - 19m from road edge)
      const count = smp.isBridge ? 2 : 3;
      for (let k = 0; k < count; k++) {
        const minOff = smp.isBridge ? 11.5 : 5.6;
        const lat = side * (halfW + rng.range(minOff, 22.0));
        const x = smp.pos.x + smp.flatRight.x * lat + rng.range(-3, 3);
        const z = smp.pos.z + smp.flatRight.z * lat + rng.range(-3, 3);
        if (isClearForTree(x, z, 0.52, 4.3)) {
          const r = rng.next();
          // Rich mix of all 4 species — heavy Stone Pines + Olives + Cypresses + lower-elevation Palms!
          const nearCoast = smp.pos.y < 14;
          if (nearCoast && r < 0.35) pushTree(palmList, 'palm', x, z, rng.range(0.85, 1.3), 0.45, 0xd9ecbe, true);
          else if (r < 0.52) pushTree(pineList, 'pine', x, z, rng.range(0.92, 1.48), 0.52, 0xc9deb2, true);
          else if (r < 0.78) pushTree(oliveList, 'olive', x, z, rng.range(0.9, 1.38), 0.45, 0xd7e2c8, true);
          else pushTree(cypressList, 'cypress', x, z, rng.range(0.85, 1.32), 0.38, 0xa2ba90, true);
        }
      }
      // Midground & background dense forest depth (22m - 58m)
      for (let k = 0; k < 2; k++) {
        const lat = side * (halfW + rng.range(22.0, 58.0));
        const x = smp.pos.x + smp.flatRight.x * lat;
        const z = smp.pos.z + smp.flatRight.z * lat;
        if (isClearForTree(x, z, 0.55, 6.0)) {
          const r = rng.next();
          if (r < 0.55) pushTree(pineList, 'pine', x, z, rng.range(1.0, 1.55), 0.52, 0xc0d6aa, false);
          else if (r < 0.80) pushTree(oliveList, 'olive', x, z, rng.range(0.95, 1.35), 0.45, 0xd0dcc0, false);
          else pushTree(cypressList, 'cypress', x, z, rng.range(0.95, 1.4), 0.38, 0x99b286, false);
        }
      }
    }
  }

  // 4b. Interior Coastal Hillside Groves (fills the peninsula valley naturally for S12 overview & distant vistas!)
  for (let i = 0; i < 240; i++) {
    const gx = rng.range(45, 560);
    const gz = rng.range(-390, 440);
    const gy = terrain.getHeight(gx, gz);
    const nrm = terrain.getNormal(gx, gz);
    if (gy > 8 && nrm.y > 0.72 && isClearForTree(gx, gz, 0.55, 8.5)) {
      const r = rng.next();
      if (r < 0.48) pushTree(pineList, 'pine', gx, gz, rng.range(0.95, 1.45), 0.5, 0xc0d6a8, false);
      else if (r < 0.78) pushTree(oliveList, 'olive', gx, gz, rng.range(0.9, 1.35), 0.45, 0xcad8bc, false);
      else pushTree(cypressList, 'cypress', gx, gz, rng.range(0.9, 1.35), 0.38, 0x96b084, false);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. MID-STRATUM SHRUBS & GROUNDCOVER COASTAL GRASS TUFTS ACROSS ALL ZONES (Refs 03, 08, 10!)
  //    (Non-colliding foliage overlapping naturally right up to the road shoulder!)
  // ---------------------------------------------------------------------------
  for (let s = 0; s < track.length; s += 4.5) {
    const smp = track.sampleAtS(s);
    if (smp.isBridge) continue;
    const halfW = smp.width * 0.5;
    const isZ4 = smp.zone === 'Z4';
    const isZ1 = smp.zone === 'Z1';
    const isZ3 = smp.zone === 'Z3';

    // Mid-height shrubs (dense in Z4 & Z2, coastal dune scrub in Z1, garden accents outside Z3 sidewalks)
    const shrubCount = isZ4 ? 5 : isZ3 ? 1 : 3;
    for (let k = 0; k < shrubCount; k++) {
      const side = rng.next() < 0.5 ? -1 : 1;
      const minLat = isZ3 ? halfW + 5.5 : halfW + 2.7;
      const maxLat = isZ4 ? halfW + 30.0 : halfW + 18.0;
      const lat = side * rng.range(minLat, maxLat);
      const x = smp.pos.x + smp.flatRight.x * lat + rng.range(-2, 2);
      const z = smp.pos.z + smp.flatRight.z * lat + rng.range(-2, 2);
      const y = terrain.getHeight(x, z);
      if (y < 1.35) continue;
      // Avoid clipping inside village buildings
      let blocked = false;
      for (let i = 0; i < existingObstacles.length; i++) {
        const o = existingObstacles[i];
        if ((x - o.x) ** 2 + (z - o.z) ** 2 < (o.radius + 1.2) ** 2) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      const tint = new THREE.Color(isZ4 ? 0xc4d8a0 : 0xd2d6a6);
      tint.offsetHSL(rng.range(-0.03, 0.03), rng.range(-0.1, 0.08), rng.range(-0.12, 0.1));
      shrubList.push({
        x,
        y: y - 0.14, // firmly rooted into slope!
        z,
        scale: rng.range(0.75, isZ4 ? 1.55 : 1.15),
        yaw: rng.range(0, Math.PI * 2),
        tint,
        nearTrack: Math.abs(lat) < halfW + 14,
      });
    }

    // Coastal grass tufts right along verges, dunes, and forest floor (zero bare voids!)
    const grassCount = isZ4 ? 8 : isZ1 ? 5 : isZ3 ? 1 : 4;
    for (let k = 0; k < grassCount; k++) {
      const side = rng.next() < 0.5 ? -1 : 1;
      const minLat = isZ3 ? halfW + 4.8 : halfW + 1.55;
      const maxLat = isZ4 ? halfW + 22.0 : isZ1 ? halfW + 20.0 : halfW + 14.0;
      const lat = side * rng.range(minLat, maxLat);
      const x = smp.pos.x + smp.flatRight.x * lat + rng.range(-2, 2);
      const z = smp.pos.z + smp.flatRight.z * lat + rng.range(-2, 2);
      const y = terrain.getHeight(x, z);
      if (y < 1.05) continue;
      const nearest = track.closestPointXZ(x, z, s);
      if (Math.abs(nearest.lateral) < nearest.sample.width * 0.5 + 1.3) continue;
      const tint = new THREE.Color(isZ1 ? 0xd9d292 : isZ4 ? 0xbdd48a : 0xcfcf96);
      tint.offsetHSL(rng.range(-0.03, 0.04), rng.range(-0.12, 0.08), rng.range(-0.12, 0.12));
      grassList.push({
        x,
        y: y - 0.05,
        z,
        scale: rng.range(0.75, 1.45),
        yaw: rng.range(0, Math.PI * 2),
        tint,
        nearTrack: Math.abs(lat) < halfW + 11,
      });
    }
  }

  // Sort every list so `nearTrack` items come FIRST — allowing Low quality preset to smoothly trim distant
  // background instances by adjusting `.count` while keeping 100% of near-track density intact!
  const sortNearFirst = (arr: Placement[]) => arr.sort((a, b) => (a.nearTrack === b.nearTrack ? 0 : a.nearTrack ? -1 : 1));
  sortNearFirst(pineList);
  sortNearFirst(palmList);
  sortNearFirst(oliveList);
  sortNearFirst(cypressList);
  sortNearFirst(shrubList);
  sortNearFirst(grassList);

  const instancedPairs: Array<{ mesh: THREE.InstancedMesh; fullCount: number; nearCount: number }> = [];
  const dummy = new THREE.Object3D();

  const buildInstanced = (
    name: string,
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    list: Placement[],
    castShadow: boolean,
    useColorTint: boolean
  ) => {
    if (list.length === 0) return;
    const im = new THREE.InstancedMesh(geom, mat, list.length);
    im.name = name;
    im.castShadow = castShadow;
    im.receiveShadow = true;
    let nearCount = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      if (p.nearTrack) nearCount++;
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
      if (useColorTint) im.setColorAt(i, p.tint);
    }
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
    instancedPairs.push({ mesh: im, fullCount: list.length, nearCount: Math.max(nearCount, Math.ceil(list.length * 0.55)) });
  };

  buildInstanced('trees_stone_pine_trunks', pineProto.trunkGeom, barkPineMat, pineList, true, false);
  buildInstanced('trees_stone_pine_foliage', pineProto.foliageGeom, pineFolMat, pineList, true, true);
  buildInstanced('trees_coastal_palm_trunks', palmProto.trunkGeom, barkPalmMat, palmList, true, false);
  buildInstanced('trees_coastal_palm_foliage', palmProto.foliageGeom, palmFolMat, palmList, true, true);
  buildInstanced('trees_olive_trunks', oliveProto.trunkGeom, barkPineMat, oliveList, true, false);
  buildInstanced('trees_olive_foliage', oliveProto.foliageGeom, oliveFolMat, oliveList, true, true);
  buildInstanced('trees_cypress_trunks', cypressProto.trunkGeom, barkPineMat, cypressList, true, false);
  buildInstanced('trees_cypress_foliage', cypressProto.foliageGeom, cypressFolMat, cypressList, true, true);
  buildInstanced('flora_maquis_shrubs', shrubGeom, shrubMat, shrubList, false, true);
  buildInstanced('flora_coastal_grass', grassGeom, grassMat, grassList, false, true);

  const update = (timeSec: number, sunDir: THREE.Vector3, isNight: boolean) => {
    sharedUniforms.uTime.value = timeSec;
    sharedUniforms.uSunDir.value.copy(sunDir).normalize();
    sharedUniforms.uSunColor.value.setHex(isNight ? 0x6280b2 : 0xffbe6b);
    sharedUniforms.uTranslucency.value = isNight ? 0.12 : 1.0;
  };

  const setQuality = (quality: QualityPreset) => {
    for (const pair of instancedPairs) {
      pair.mesh.count = quality === 'high' ? pair.fullCount : pair.nearCount;
    }
  };

  return {
    group,
    speciesNames: ['stone_pine', 'coastal_palm', 'mediterranean_olive', 'tuscan_cypress'],
    hasTrees: pineList.length + palmList.length + oliveList.length + cypressList.length > 0,
    hasShrubs: shrubList.length > 0,
    hasGroundcover: grassList.length > 0,
    foliageTranslucencyActive: true,
    totalTreeCount: pineList.length + palmList.length + oliveList.length + cypressList.length,
    totalShrubCount: shrubList.length,
    totalGrassCount: grassList.length,
    obstacles,
    update,
    setQuality,
  };
}
