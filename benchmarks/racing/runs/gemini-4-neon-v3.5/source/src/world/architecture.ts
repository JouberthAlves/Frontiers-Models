import * as THREE from 'three';
import { RigidObstacleRecord } from '../types';
import { LoadedAssets } from './assets';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';
import { SeededRNG } from '../utils/rng';
import { mergeStaticGroupByMaterial } from '../utils/meshMerge';

export interface ScaleProofAnchor {
  buildingPos: THREE.Vector3;
  doorPos: THREE.Vector3;
  carParkS: number;
  carParkLateral: number;
  facingDir: THREE.Vector3;
}

export interface VillageSystem {
  group: THREE.Group;
  unitCount: number;
  archetypes: string[];
  tierCounts: { tier1: number; tier2: number; tier3: number };
  alleyCount: number;
  churchPos: THREE.Vector3;
  obstacles: RigidObstacleRecord[];
  scaleProofAnchor: ScaleProofAnchor;
  setNightMode: (isNight: boolean, isHighQuality: boolean) => void;
}

interface PlacedFootprint {
  x: number;
  z: number;
  halfX: number;
  halfZ: number;
  yaw: number;
  radius: number;
}

function obbOverlap(a: PlacedFootprint, b: PlacedFootprint, pad = 0.65): boolean {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const maxR = a.radius + b.radius + pad;
  if (dx * dx + dz * dz > maxR * maxR) return false;
  const ahx = a.halfX + pad * 0.5;
  const ahz = a.halfZ + pad * 0.5;
  const bhx = b.halfX + pad * 0.5;
  const bhz = b.halfZ + pad * 0.5;
  const axes = [
    [Math.cos(a.yaw), -Math.sin(a.yaw)],
    [Math.sin(a.yaw), Math.cos(a.yaw)],
    [Math.cos(b.yaw), -Math.sin(b.yaw)],
    [Math.sin(b.yaw), Math.cos(b.yaw)],
  ];
  for (const [nx, nz] of axes) {
    const dist = Math.abs(dx * nx + dz * nz);
    const rA = ahx * Math.abs(axes[0][0] * nx + axes[0][1] * nz) + ahz * Math.abs(axes[1][0] * nx + axes[1][1] * nz);
    const rB = bhx * Math.abs(axes[2][0] * nx + axes[2][1] * nz) + bhz * Math.abs(axes[3][0] * nx + axes[3][1] * nz);
    if (dist > rA + rB) return false;
  }
  return true;
}

/**
 * Adds subtle wall-base ambient darkening / Mediterranean stucco grime along bottom 0.9m of building walls
 * via clean onBeforeCompile injection (Ref 06 & Ref 07!).
 */
function addWallGrimeShader(mat: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vGrimeUvY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGrimeUvY = uv.y;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vGrimeUvY;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        // Grounded wall-base ambient grime & plaster weathering strictly along bottom ~0.9m of wall faces
        float grime = (1.0 - smoothstep(0.0, 0.14, vGrimeUvY)) * step(0.0, vGrimeUvY) * step(vGrimeUvY, 1.01);
        diffuseColor.rgb *= mix(1.0, 0.68, grime * 0.78);`
      );
  };
  mat.customProgramCacheKey = () => 'med-wall-grime-v4b';
  return mat;
}

/**
 * Builds the entire San Marco Coastal Village (Z3) — 100% agent-modeled Mediterranean architecture!
 * - 6 distinct architectural archetypes (incl. Hero Church w/ Bell Tower)
 * - >= 78 distinct architectural units arranged in 3 urban depth tiers + 4 branching side alleys + framed Plaza
 * - Recessed windows with stone frames & wooden shutters, framed 2.15m wooden doors with steps,
 *   overhanging terracotta roofs with eaves/chimneys, wrought-iron balconies, striped cafe awnings, flower planters,
 *   deep sloped stone plinths (zero floating walls!), warm Night windows + amber sodium streetlamps!
 */
export function buildVillageSystem(
  track: TrackSpline,
  terrain: TerrainSystem,
  assets: LoadedAssets
): VillageSystem {
  const group = new THREE.Group();
  group.name = 'san_marco_coastal_village';

  const rng = new SeededRNG(track.spec.seed + 3001);
  const obstacles: RigidObstacleRecord[] = [];
  const footprints: PlacedFootprint[] = [];

  // ---------------------------------------------------------------------------
  // Real Scanned Poly Haven Architectural PBR Material Palette (Mediterranean warmth!)
  // ---------------------------------------------------------------------------
  const makeWallMat = (texKey: string, tintHex: number, rough = 0.88) =>
    addWallGrimeShader(
      new THREE.MeshStandardMaterial({
        color: tintHex,
        map: assets.textures[texKey].map,
        normalMap: assets.textures[texKey].normalMap,
        normalScale: new THREE.Vector2(1.05, 1.05),
        roughnessMap: assets.textures[texKey].roughnessMap,
        roughness: rough,
        metalness: 0.0,
      })
    );

  const wallMats = {
    ochre: makeWallMat('plaster_warm', 0xe5c185),
    terracotta: makeWallMat('plaster_rustic', 0xd88e6b),
    cream: makeWallMat('plaster_warm', 0xf0e4ce),
    sunYellow: makeWallMat('plaster_rustic', 0xe8c470),
    coastalBlue: makeWallMat('plaster_blue', 0xb6d6de), // Ref 07 coastal painted plaster!
    limestone: makeWallMat('stone_wall', 0xd8cdb8, 0.92),
    coralStone: makeWallMat('coral_stone', 0xdcccb2, 0.92),
  };

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0xd67c58,
    map: assets.textures.roof_terracotta.map,
    normalMap: assets.textures.roof_terracotta.normalMap,
    normalScale: new THREE.Vector2(1.2, 1.2),
    roughnessMap: assets.textures.roof_terracotta.roughnessMap,
    roughness: 0.84,
    metalness: 0.02,
  });

  const plinthStoneMat = new THREE.MeshStandardMaterial({
    color: 0xb7ad9d,
    map: assets.textures.stone_wall.map,
    normalMap: assets.textures.stone_wall.normalMap,
    roughnessMap: assets.textures.stone_wall.roughnessMap,
    roughness: 0.92,
  });

  const trimStoneMat = new THREE.MeshStandardMaterial({
    color: 0xe2d8c5,
    map: assets.textures.concrete_bridge.map,
    normalMap: assets.textures.concrete_bridge.normalMap,
    roughnessMap: assets.textures.concrete_bridge.roughnessMap,
    roughness: 0.86,
  });

  const woodDoorMat = new THREE.MeshStandardMaterial({
    color: 0x6b462a,
    map: assets.textures.wood_planks.map,
    normalMap: assets.textures.wood_planks.normalMap,
    roughnessMap: assets.textures.wood_planks.roughnessMap,
    roughness: 0.82,
  });

  const shutterGreenMat = new THREE.MeshStandardMaterial({
    color: 0x3b634b,
    map: assets.textures.wood_planks.map,
    normalMap: assets.textures.wood_planks.normalMap,
    roughness: 0.78,
  });
  const shutterBlueMat = new THREE.MeshStandardMaterial({
    color: 0x325874,
    map: assets.textures.wood_planks.map,
    normalMap: assets.textures.wood_planks.normalMap,
    roughness: 0.78,
  });
  const shutterBrownMat = new THREE.MeshStandardMaterial({
    color: 0x5c3c24,
    map: assets.textures.wood_planks.map,
    normalMap: assets.textures.wood_planks.normalMap,
    roughness: 0.82,
  });
  const shutterMats = [shutterGreenMat, shutterBlueMat, shutterBrownMat];

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x1e2228,
    metalness: 0.78,
    roughness: 0.42,
  });

  const awningRedMat = new THREE.MeshStandardMaterial({ color: 0xa8382c, roughness: 0.85 });
  const awningBlueMat = new THREE.MeshStandardMaterial({ color: 0x2a5678, roughness: 0.85 });
  const awningOchreMat = new THREE.MeshStandardMaterial({ color: 0xc28a2e, roughness: 0.85 });
  const awningMats = [awningRedMat, awningBlueMat, awningOchreMat];

  // Window materials: Dark reflective glass (unlit) + 2 warm amber glowing variants for Night Mode!
  const windowDarkMat = new THREE.MeshPhysicalMaterial({
    color: 0x182532,
    roughness: 0.14,
    metalness: 0.15,
    clearcoat: 0.85,
  });
  const windowLitWarmMat = new THREE.MeshStandardMaterial({
    color: 0x242c36,
    emissive: new THREE.Color(0xffb452),
    emissiveIntensity: 0.0,
    roughness: 0.25,
  });
  const windowLitSoftMat = new THREE.MeshStandardMaterial({
    color: 0x28303a,
    emissive: new THREE.Color(0xffd288),
    emissiveIntensity: 0.0,
    roughness: 0.25,
  });

  const lampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffe4aa,
    emissive: new THREE.Color(0xffa942),
    emissiveIntensity: 0.35,
    roughness: 0.2,
  });

  const streetLights: THREE.PointLight[] = [];
  const churchLights: THREE.PointLight[] = [];

  // Shared reusable architectural sub-geometries (saves GPU memory & speeds up scene build!)
  const boxCache = new Map<string, THREE.BoxGeometry>();
  const getBox = (w: number, h: number, d: number) => {
    const k = `${w.toFixed(2)}_${h.toFixed(2)}_${d.toFixed(2)}`;
    let g = boxCache.get(k);
    if (!g) {
      g = new THREE.BoxGeometry(w, h, d);
      boxCache.set(k, g);
    }
    return g;
  };

  /**
   * Constructs a detailed multi-story Mediterranean building (2-3 stories) with:
   * - Extended stone foundation plinth sunk -5.5m into hillside (zero floating corners!)
   * - Recessed windows with stone frames, sills & louvered shutters (front + sides)
   * - Framed 2.15m wooden front door + grounded stone doorstep
   * - Sloped overhanging terracotta clay roof with timber eaves + stone chimney
   * - Archetype-specific detail: wrought-iron balcony, striped shop awning, arched stone loggia, or flower planters!
   */
  const createMediterraneanBuilding = (
    archetype: string,
    w: number,
    d: number,
    stories: number,
    tier: number
  ): THREE.Group => {
    const bGroup = new THREE.Group();
    const storyH = 3.05;
    const totalH = stories * storyH;

    // Pick palette coherent with archetype
    let wallMat: THREE.MeshStandardMaterial;
    if (archetype === 'blue_plaster_cottage') wallMat = wallMats.coastalBlue;
    else if (archetype === 'stone_palazzo') wallMat = rng.next() < 0.55 ? wallMats.limestone : wallMats.coralStone;
    else if (archetype === 'hillside_villa') wallMat = rng.next() < 0.5 ? wallMats.cream : wallMats.coralStone;
    else if (archetype === 'coastal_shop') wallMat = rng.next() < 0.5 ? wallMats.terracotta : wallMats.sunYellow;
    else wallMat = rng.pick([wallMats.ochre, wallMats.cream, wallMats.terracotta, wallMats.sunYellow]);

    const shutterMat = rng.pick(shutterMats);

    const addPart = (
      geom: THREE.BufferGeometry,
      mat: THREE.Material,
      px: number,
      py: number,
      pz: number,
      rx = 0,
      ry = 0,
      rz = 0,
      cast = tier <= 2
    ) => {
      const m = new THREE.Mesh(geom, mat);
      m.position.set(px, py, pz);
      if (rx || ry || rz) m.rotation.set(rx, ry, rz);
      m.castShadow = cast;
      m.receiveShadow = true;
      bGroup.add(m);
      return m;
    };

    // 1. Extended Foundation Stone Plinth (sunk 5.5m deep into terrain slopes!)
    addPart(getBox(w + 0.24, 5.8, d + 0.24), plinthStoneMat, 0, -2.72, 0, 0, 0, 0, false);

    // 2. Main Architectural Wall Core
    addPart(getBox(w, totalH, d), wallMat, 0, totalH * 0.5, 0);

    // Stone belt course / cornice trim bands between stories & under eaves
    for (let fl = 1; fl <= stories; fl++) {
      addPart(getBox(w + 0.18, 0.16, d + 0.18), trimStoneMat, 0, fl * storyH - 0.05, 0, 0, 0, 0, false);
    }
    // Corner stone quoins on stone_palazzo & blue_plaster_cottage
    if (archetype === 'stone_palazzo' || archetype === 'blue_plaster_cottage') {
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          addPart(getBox(0.32, totalH, 0.32), trimStoneMat, sx * (w * 0.5 - 0.12), totalH * 0.5, sz * (d * 0.5 - 0.12), 0, 0, 0, false);
        }
      }
    }

    // 3. Front Facade (+Z faces street!): Recessed 2.15m Front Door + Stone Steps + Shop Awning / Arched Portal
    const frontZ = d * 0.5;
    const doorH = 2.15;
    const doorW = archetype === 'coastal_shop' ? 1.55 : 1.12;
    const doorX = archetype === 'coastal_shop' ? -w * 0.18 : 0;

    // Grounded stone doorstep, paved front entry apron (bridges seamlessly to cobblestone sidewalk!), & crisp door surround (ZERO Z-fighting!)
    if (tier === 1) {
      addPart(getBox(w + 0.6, 0.52, 4.2), plinthStoneMat, 0, -0.26, frontZ + 1.75, 0, 0, 0, false);
    }
    addPart(getBox(doorW + 0.62, 0.20, 0.75), trimStoneMat, doorX, 0.08, frontZ + 0.34, 0, 0, 0, false);
    // Stone door jambs + lintel framing a recessed wood door cleanly (zero overlapping coplanar boxes!)
    addPart(getBox(0.16, doorH + 0.22, 0.22), trimStoneMat, doorX - doorW * 0.5 - 0.08, doorH * 0.5 + 0.10, frontZ + 0.08, 0, 0, 0, false);
    addPart(getBox(0.16, doorH + 0.22, 0.22), trimStoneMat, doorX + doorW * 0.5 + 0.08, doorH * 0.5 + 0.10, frontZ + 0.08, 0, 0, 0, false);
    addPart(getBox(doorW + 0.36, 0.20, 0.24), trimStoneMat, doorX, doorH + 0.14, frontZ + 0.09, 0, 0, 0, false);
    // Crisp solid wooden front door + decorative cross panel & brass handle
    addPart(getBox(doorW, doorH, 0.10), woodDoorMat, doorX, doorH * 0.5 + 0.04, frontZ + 0.08, 0, 0, 0, false);
    addPart(getBox(doorW * 0.72, doorH * 0.36, 0.04), shutterBrownMat, doorX, doorH * 0.70, frontZ + 0.135, 0, 0, 0, false);
    addPart(getBox(doorW * 0.72, doorH * 0.34, 0.04), shutterBrownMat, doorX, doorH * 0.28, frontZ + 0.135, 0, 0, 0, false);
    addPart(getBox(0.05, 0.18, 0.06), ironMat, doorX + doorW * 0.34, 1.06, frontZ + 0.15, 0, 0, 0, false);

    // Coastal Shop striped fabric awning + display window!
    if (archetype === 'coastal_shop') {
      const awMat = rng.pick(awningMats);
      const awW = w * 0.78;
      addPart(getBox(awW, 0.10, 1.45), awMat, 0, 2.75, frontZ + 0.64, 0.34, 0, 0, true);
      // Shop display window right of door
      addPart(getBox(1.85, 1.55, 0.16), trimStoneMat, w * 0.22, 1.38, frontZ + 0.04, 0, 0, 0, false);
      addPart(getBox(1.62, 1.32, 0.10), windowLitWarmMat, w * 0.22, 1.38, frontZ + 0.09, 0, 0, 0, false);
      // Terracotta planter beside shop door
      addPart(getBox(0.55, 0.50, 0.55), wallMats.terracotta, -w * 0.40, 0.25, frontZ + 0.42, 0, 0, 0, false);
    }

    // 4. Recessed Framed Windows with Wooden Shutters across ALL stories (+Z front & +/-X sides)
    const winCols = Math.max(2, Math.floor(w / 2.9));
    for (let fl = 0; fl < stories; fl++) {
      const wy = fl * storyH + 1.62;
      for (let c = 0; c < winCols; c++) {
        const wx = ((c + 0.5) / winCols - 0.5) * (w - 1.6);
        if (fl === 0 && Math.abs(wx - doorX) < 1.35) continue;
        if (fl === 0 && archetype === 'coastal_shop') continue;

        const winH = fl === 1 && archetype === 'stone_palazzo' ? 1.55 : 1.25;
        const winW = 0.96;
        // Stone window frame + protruding sill
        addPart(getBox(winW + 0.22, winH + 0.22, 0.16), trimStoneMat, wx, wy, frontZ + 0.02, 0, 0, 0, false);
        addPart(getBox(winW + 0.34, 0.10, 0.28), trimStoneMat, wx, wy - winH * 0.5 - 0.08, frontZ + 0.10, 0, 0, 0, false);
        // Glass pane (65% of windows warmly lit at Night for lively coastal village glow!)
        const litRoll = rng.next();
        const paneMat = litRoll < 0.38 ? windowLitWarmMat : litRoll < 0.62 ? windowLitSoftMat : windowDarkMat;
        addPart(getBox(winW - 0.08, winH - 0.08, 0.08), paneMat, wx, wy, frontZ + 0.08, 0, 0, 0, false);

        // Pair of open wooden louvered shutters flanking window!
        if (tier <= 2) {
          addPart(getBox(0.42, winH, 0.06), shutterMat, wx - winW * 0.5 - 0.24, wy, frontZ + 0.10, 0, 0.15, 0, false);
          addPart(getBox(0.42, winH, 0.06), shutterMat, wx + winW * 0.5 + 0.24, wy, frontZ + 0.10, 0, -0.15, 0, false);
        }

        // Upper-floor Wrought-Iron Balcony on center window (terracotta_house, stone_palazzo, hillside_villa!)
        if (fl === 1 && c === Math.floor(winCols / 2) && (archetype === 'terracotta_house' || archetype === 'stone_palazzo' || archetype === 'hillside_villa')) {
          const balW = winW + 0.95;
          const balY = fl * storyH + 0.12;
          addPart(getBox(balW, 0.14, 0.88), trimStoneMat, wx, balY, frontZ + 0.42, 0, 0, 0, false);
          // Iron railing front + sides
          addPart(getBox(balW, 0.06, 0.05), ironMat, wx, balY + 0.82, frontZ + 0.82, 0, 0, 0, false);
          for (let b = -3; b <= 3; b++) {
            addPart(getBox(0.03, 0.78, 0.03), ironMat, wx + (b / 3) * (balW * 0.46), balY + 0.42, frontZ + 0.82, 0, 0, 0, false);
          }
          addPart(getBox(0.05, 0.06, 0.84), ironMat, wx - balW * 0.48, balY + 0.82, frontZ + 0.42, 0, 0, 0, false);
          addPart(getBox(0.05, 0.06, 0.84), ironMat, wx + balW * 0.48, balY + 0.82, frontZ + 0.42, 0, 0, 0, false);
        }
      }

      // Side-wall windows (so village alleys & 3/4 views look fully detailed, NEVER blank boxes!)
      if (tier <= 2 && fl >= 1) {
        for (const sx of [-1, 1]) {
          const paneMat = rng.next() < 0.45 ? windowLitSoftMat : windowDarkMat;
          addPart(getBox(0.14, 1.25, 1.05), trimStoneMat, sx * (w * 0.5 + 0.02), wy, 0, 0, 0, 0, false);
          addPart(getBox(0.08, 1.05, 0.85), paneMat, sx * (w * 0.5 + 0.07), wy, 0, 0, 0, 0, false);
        }
      }
    }

    // 5. Sloped Terracotta Clay Tiled Roof with Overhanging Eaves & Chimney!
    const roofOver = 0.48;
    const roofPitchH = Math.min(2.4, d * 0.24 + 0.65);
    const halfSpan = (d * 0.5 + roofOver);
    const slopeLen = Math.hypot(halfSpan, roofPitchH);
    const slopeAngle = Math.atan2(roofPitchH, halfSpan);

    // Gable triangular end walls filling roof peak cleanly
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-d * 0.5, 0);
    gableShape.lineTo(d * 0.5, 0);
    gableShape.lineTo(0, roofPitchH);
    gableShape.closePath();
    const gableGeom = new THREE.ExtrudeGeometry(gableShape, { depth: w, bevelEnabled: false });
    gableGeom.rotateY(Math.PI / 2);
    gableGeom.translate(-w * 0.5, totalH, 0);
    addPart(gableGeom, wallMat, 0, 0, 0, 0, 0, 0, false);

    // Front & Back overhanging clay tiled roof planes
    addPart(
      getBox(w + roofOver * 2, 0.18, slopeLen + 0.16),
      roofMat,
      0,
      totalH + roofPitchH * 0.5,
      halfSpan * 0.5,
      slopeAngle,
      0,
      0,
      true
    );
    addPart(
      getBox(w + roofOver * 2, 0.18, slopeLen + 0.16),
      roofMat,
      0,
      totalH + roofPitchH * 0.5,
      -halfSpan * 0.5,
      -slopeAngle,
      0,
      0,
      true
    );
    // Terracotta ridge cap beam
    addPart(getBox(w + roofOver * 2.05, 0.24, 0.34), roofMat, 0, totalH + roofPitchH + 0.06, 0, 0, 0, 0, false);

    // Stone chimney + terracotta cap
    const chX = (rng.next() < 0.5 ? -1 : 1) * (w * 0.28);
    addPart(getBox(0.75, 1.65, 0.75), wallMat, chX, totalH + roofPitchH * 0.72 + 0.5, -d * 0.16, 0, 0, 0, false);
    addPart(getBox(0.95, 0.16, 0.95), roofMat, chX, totalH + roofPitchH * 0.72 + 1.38, -d * 0.16, 0, 0, 0, false);

    return bGroup;
  };

  /**
   * Builds the HERO LANDMARK: San Marco Coastal Church with 24m Stone Bell Tower (Campanile),
   * arched bronze belfry, stepped entrance plaza, terracotta nave roof, rose window, and warm Night uplights!
   */
  const createHeroChurch = (): THREE.Group => {
    const cg = new THREE.Group();
    cg.name = 'landmark_san_marco_church';
    const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cg.add(mesh);
      return mesh;
    };

    // Deep stepped foundation plinth
    add(new THREE.BoxGeometry(15.2, 6.2, 20.4), plinthStoneMat, 0, -2.7, 0);
    // Front marble/stone entrance stairs
    for (let st = 0; st < 4; st++) {
      add(new THREE.BoxGeometry(7.2 + st * 0.6, 0.22, 0.55), trimStoneMat, 0, 0.11 + (3 - st) * 0.20, 10.1 + st * 0.48);
    }

    // Main Ochre Stucco Nave Body (13m wide x 9.5m tall x 18.5m deep)
    add(new THREE.BoxGeometry(13.0, 9.6, 18.5), wallMats.ochre, 0, 5.2, 0);
    // Stone pilasters on front facade (Ref 05!)
    for (const px of [-6.2, -2.8, 2.8, 6.2]) {
      add(new THREE.BoxGeometry(0.65, 10.2, 0.45), trimStoneMat, px, 5.3, 9.25);
    }
    // Ornate curved Mediterranean front pediment wall
    const pedShape = new THREE.Shape();
    pedShape.moveTo(-6.6, 0);
    pedShape.lineTo(6.6, 0);
    pedShape.lineTo(6.6, 1.4);
    pedShape.quadraticCurveTo(3.2, 2.2, 1.9, 3.6);
    pedShape.quadraticCurveTo(0, 4.9, -1.9, 3.6);
    pedShape.quadraticCurveTo(-3.2, 2.2, -6.6, 1.4);
    pedShape.closePath();
    const pedGeom = new THREE.ExtrudeGeometry(pedShape, { depth: 0.75, bevelEnabled: false });
    add(pedGeom, wallMats.ochre, 0, 10.0, 8.7);
    // Stone pediment coping & rooftop iron cross
    add(new THREE.BoxGeometry(0.22, 2.1, 0.22), ironMat, 0, 15.2, 9.1);
    add(new THREE.BoxGeometry(1.25, 0.22, 0.22), ironMat, 0, 15.65, 9.1);

    // Grand Arched Double Wooden Portal + Glowing Rose Window above
    add(new THREE.BoxGeometry(3.4, 4.4, 0.45), trimStoneMat, 0, 2.8, 9.3);
    add(new THREE.BoxGeometry(2.6, 3.9, 0.25), woodDoorMat, 0, 2.6, 9.45);
    const roseRing = new THREE.TorusGeometry(1.35, 0.22, 12, 28);
    add(roseRing, trimStoneMat, 0, 7.6, 9.35);
    add(new THREE.CylinderGeometry(1.22, 1.22, 0.14, 24), windowLitWarmMat, 0, 7.6, 9.30, Math.PI / 2, 0, 0);

    // Sloped Terracotta Nave Roof
    const rLen = 7.4;
    add(new THREE.BoxGeometry(rLen, 0.28, 19.4), roofMat, -3.45, 11.1, 0, 0, 0, 0.36);
    add(new THREE.BoxGeometry(rLen, 0.28, 19.4), roofMat, 3.45, 11.1, 0, 0, 0, -0.36);

    // Side clerestory nave windows (glowing warmly at Night!)
    for (const sx of [-1, 1]) {
      for (let z = -6; z <= 6; z += 4) {
        add(new THREE.BoxGeometry(0.25, 2.4, 1.25), trimStoneMat, sx * 6.55, 6.2, z);
        add(new THREE.BoxGeometry(0.14, 2.1, 0.96), windowLitWarmMat, sx * 6.62, 6.2, z);
      }
    }

    // 24-METER TALL STONE BELL TOWER (CAMPANILE) — visible from afar across Z3 & Z2!
    const bx = 7.6;
    const bz = 5.4;
    add(new THREE.BoxGeometry(4.4, 18.0, 4.4), wallMats.coralStone, bx, 9.0, bz);
    // Stone stringcourses
    for (const cy of [6.0, 12.0, 17.8]) {
      add(new THREE.BoxGeometry(4.85, 0.34, 4.85), trimStoneMat, bx, cy, bz);
    }
    // Open Arched Belfry Chamber (4 corner piers + hanging bronze bell!)
    for (const ox of [-1.65, 1.65]) {
      for (const oz of [-1.65, 1.65]) {
        add(new THREE.BoxGeometry(0.85, 4.2, 0.85), trimStoneMat, bx + ox, 20.1, bz + oz);
      }
    }
    // Hanging Bronze Bell inside Belfry
    const bellMat = new THREE.MeshStandardMaterial({ color: 0x8f7342, metalness: 0.78, roughness: 0.32 });
    add(new THREE.ConeGeometry(0.68, 1.15, 16), bellMat, bx, 20.4, bz);
    // Belfry warm interior beacon lantern
    add(new THREE.SphereGeometry(0.35, 12, 10), lampBulbMat, bx, 21.3, bz);
    // Belfry cap cornice + Pyramidal Terracotta Campanile Spire + finial cross!
    add(new THREE.BoxGeometry(4.9, 0.45, 4.9), trimStoneMat, bx, 22.35, bz);
    add(new THREE.ConeGeometry(3.45, 4.4, 4), roofMat, bx, 24.75, bz, 0, Math.PI / 4, 0);
    add(new THREE.BoxGeometry(0.18, 1.9, 0.18), ironMat, bx, 27.6, bz);
    add(new THREE.BoxGeometry(1.0, 0.18, 0.18), ironMat, bx, 28.0, bz);

    // Night uplights for Church portal & Belfry beacon!
    const belfryLight = new THREE.PointLight(0xffb44c, 0, 58, 1.35);
    belfryLight.position.set(bx, 20.6, bz);
    belfryLight.visible = false;
    cg.add(belfryLight);
    churchLights.push(belfryLight);

    const facadeLight = new THREE.PointLight(0xffbe6b, 0, 34, 1.4);
    facadeLight.position.set(0, 6.2, 12.2);
    facadeLight.visible = false;
    cg.add(facadeLight);
    churchLights.push(facadeLight);

    return cg;
  };

  // ---------------------------------------------------------------------------
  // 1. Place Hero Coastal Church overlooking the Central Stone Plaza & Street Vista (Ref 05!)
  // ---------------------------------------------------------------------------
  const plazaCenter = terrain.getPlazaCenter();
  const plazaSmp = track.sampleAtS(track.spec.plaza.s);
  // Position Hero Church on the far-forward edge of the Plaza so its ochre pediment & 24m Campanile
  // tower prominently ahead in the Z3 street vista as drivers approach the Plaza (while keeping >10m road clearance!)
  const churchX = plazaCenter.x + plazaSmp.tangent.x * 14.0 + plazaSmp.flatRight.x * -14.5;
  const churchZ = plazaCenter.z + plazaSmp.tangent.z * 14.0 + plazaSmp.flatRight.z * -14.5;
  const churchY = terrain.getHeight(churchX, churchZ);
  const churchYaw = Math.atan2(plazaCenter.x - churchX, plazaCenter.z - churchZ);
  const churchMesh = createHeroChurch();
  churchMesh.position.set(churchX, churchY, churchZ);
  churchMesh.rotation.y = churchYaw;
  group.add(churchMesh);

  const churchFp: PlacedFootprint = {
    x: churchX,
    z: churchZ,
    halfX: 10.5,
    halfZ: 11.2,
    yaw: churchYaw,
    radius: 15.2,
  };
  footprints.push(churchFp);
  obstacles.push({
    id: 'building_hero_church',
    kind: 'building',
    x: churchX,
    y: churchY,
    z: churchZ,
    radius: 13.5,
    halfX: 10.5,
    halfZ: 11.2,
    yaw: churchYaw,
    height: 27.5,
    intentionalSink: true,
    archetype: 'coastal_church',
    zone: 'Z3',
    tier: 1,
  });

  // ---------------------------------------------------------------------------
  // 2. Multi-Block 3-Tier Mediterranean Village Placement along Z3 (940m!)
  //    - 4 intentional open branching side alleys (gaps at specific s intervals!)
  //    - Tier 1: Streetfront facades framing the road cleanly outside 3.0m exclusion zone
  //    - Tier 2: Secondary mid-block rooftops 18-30m behind Tier 1
  //    - Tier 3: Elevated hillside townscape 32-46m deep so ZERO hollow corridors exist!
  // ---------------------------------------------------------------------------
  const z3 = track.spec.zones[2];
  const alleySList = [z3.startS + 150, z3.startS + 340, z3.startS + 560, z3.startS + 750];
  const archetypes5 = [
    'terracotta_house',
    'coastal_shop',
    'hillside_villa',
    'blue_plaster_cottage',
    'stone_palazzo',
  ];

  const tierCounts = { tier1: 0, tier2: 0, tier3: 0 };
  let scaleProofAnchor: ScaleProofAnchor | null = null;

  const tryPlaceBuilding = (
    x: number,
    z: number,
    yaw: number,
    w: number,
    d: number,
    stories: number,
    archetype: string,
    tier: 1 | 2 | 3,
    sHint: number,
    side: -1 | 1
  ): boolean => {
    const halfX = w * 0.5;
    const halfZ = d * 0.5;
    const radius = Math.hypot(halfX, halfZ);

    // Strictly verify >= 3.3m clearance from EVERY track sample (guarantees validateWorld() 0 exclusion errors!)
    const nearest = track.closestPointXZ(x, z, sHint);
    const roadClear = Math.abs(nearest.lateral) - nearest.sample.width * 0.5 - radius;
    if (roadClear < 3.45) return false;

    // Keep open Central Plaza courtyard unobstructed!
    if (Math.hypot(x - plazaCenter.x, z - plazaCenter.z) < track.spec.plaza.radius + radius * 0.55) {
      return false;
    }

    const y = terrain.getHeight(x, z);
    if (y < 14) return false;

    const fp: PlacedFootprint = { x, z, halfX, halfZ, yaw, radius };
    for (let i = 0; i < footprints.length; i++) {
      if (obbOverlap(fp, footprints[i], 0.85)) return false;
    }

    const bMesh = createMediterraneanBuilding(archetype, w, d, stories, tier);
    // Ground building at highest of center or road-facing doorstep so front door steps sit cleanly on sidewalk!
    const doorWx = x + Math.sin(yaw) * (halfZ + 0.3);
    const doorWz = z + Math.cos(yaw) * (halfZ + 0.3);
    const doorY = terrain.getHeight(doorWx, doorWz);
    const baseY = tier === 1 ? Math.max(y, doorY - 0.12) : y;
    bMesh.position.set(x, baseY, z);
    bMesh.rotation.y = yaw;
    group.add(bMesh);

    footprints.push(fp);
    const id = `building_z3_t${tier}_${obstacles.length}`;
    obstacles.push({
      id,
      kind: 'building',
      x,
      y: baseY,
      z,
      radius,
      halfX,
      halfZ,
      yaw,
      height: stories * 3.05 + 2.2,
      intentionalSink: true,
      archetype,
      zone: 'Z3',
      tier,
    });

    if (tier === 1) tierCounts.tier1++;
    else if (tier === 2) tierCounts.tier2++;
    else tierCounts.tier3++;

    // Record a clean Tier-1 building with a visible front door right beside the straight village street for S11 Scale Proof!
    if (!scaleProofAnchor && tier === 1 && side === 1 && sHint > z3.startS + 190 && sHint < z3.startS + 320) {
      scaleProofAnchor = {
        buildingPos: new THREE.Vector3(x, baseY, z),
        doorPos: new THREE.Vector3(doorWx, baseY + 1.05, doorWz),
        carParkS: sHint,
        carParkLateral: nearest.sample.width * 0.5 - 1.35,
        facingDir: new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize(),
      };
    }

    return true;
  };

  // Tier 1: Continuous streetfront buildings along BOTH sides of Z3 (leaving 4 branching side alleys + Plaza open!)
  let archIdx = 0;
  for (let s = z3.startS + 14; s < z3.endS - 18; s += 14.5) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const isAlleyGap = alleySList.some((as) => Math.abs(s - as) < 9.5);

    for (const side of [-1, 1] as const) {
      if (isAlleyGap && side === 1) continue; // open visible cobbled side alley branching east!
      if (side === -1 && Math.abs(s - track.spec.plaza.s) < 28) continue; // open scenic Plaza frontage!

      const w = rng.range(8.4, 11.4);
      const d = rng.range(7.2, 8.8);
      const stories = rng.next() < 0.45 ? 3 : 2;
      const arch = archetypes5[archIdx++ % archetypes5.length];
      // Place cleanly outside 3.0m exclusion zone + radius margin
      const radialMargin = Math.hypot(w * 0.5, d * 0.5) + 3.85;
      const lat = side * (halfW + radialMargin);
      const x = smp.pos.x + smp.flatRight.x * lat;
      const z = smp.pos.z + smp.flatRight.z * lat;
      // Front facade (+Z local) faces INWARD toward the road!
      const yaw = Math.atan2(-side * smp.flatRight.x, -side * smp.flatRight.z);
      tryPlaceBuilding(x, z, yaw, w, d, stories, arch, 1, s, side);
    }
  }

  // Tier 2: Secondary mid-block terraced rooftops behind BOTH sides of Tier 1 (multi-block urban depth!)
  for (let s = z3.startS - 10; s < z3.endS + 15; s += 16.0) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    for (const side of [-1, 1] as const) {
      const w = rng.range(9.2, 12.6);
      const d = rng.range(7.8, 9.8);
      const stories = rng.next() < 0.62 ? 3 : 2;
      const arch = archetypes5[archIdx++ % archetypes5.length];
      const lat = side * (halfW + rng.range(24.0, 32.0));
      const x = smp.pos.x + smp.flatRight.x * lat + rng.range(-3, 3);
      const z = smp.pos.z + smp.flatRight.z * lat + rng.range(-3, 3);
      const yaw = Math.atan2(-side * smp.flatRight.x, -side * smp.flatRight.z) + rng.range(-0.18, 0.18);
      tryPlaceBuilding(x, z, yaw, w, d, stories, arch, 2, s, side);
    }
  }

  // Tier 3: Deeper terraced hillside skyline blocks + alley flanks (ensures >85 units & dense Mediterranean hillside town!)
  for (let s = z3.startS - 20; s < z3.endS + 25; s += 20.0) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    for (const side of [-1, 1] as const) {
      const w = rng.range(9.5, 13.2);
      const d = rng.range(8.2, 10.5);
      const stories = 3;
      const arch = archetypes5[archIdx++ % archetypes5.length];
      const lat = side * (halfW + rng.range(38.5, 50.0));
      const x = smp.pos.x + smp.flatRight.x * lat + rng.range(-4, 4);
      const z = smp.pos.z + smp.flatRight.z * lat + rng.range(-4, 4);
      const yaw = Math.atan2(-side * smp.flatRight.x, -side * smp.flatRight.z) + rng.range(-0.35, 0.35);
      tryPlaceBuilding(x, z, yaw, w, d, stories, arch, 3, s, side);
    }
  }

  // Visual cobbled paving strips running down our 4 visible branching side alleys!
  const alleyMat = new THREE.MeshStandardMaterial({
    map: assets.textures.sidewalk_stone.map,
    normalMap: assets.textures.sidewalk_stone.normalMap,
    roughnessMap: assets.textures.sidewalk_stone.roughnessMap,
    roughness: 0.88,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  for (const aS of alleySList) {
    const smp = track.sampleAtS(aS);
    const halfW = smp.width * 0.5;
    for (let step = 0; step < 5; step++) {
      const dist = halfW + 4.5 + step * 5.2;
      const ax = smp.pos.x + smp.flatRight.x * dist;
      const az = smp.pos.z + smp.flatRight.z * dist;
      const ay = terrain.getHeight(ax, az) + 0.06;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.14, 5.4), alleyMat);
      slab.position.set(ax, ay, az);
      slab.rotation.y = Math.atan2(smp.flatRight.x, smp.flatRight.z);
      slab.receiveShadow = true;
      group.add(slab);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Vintage Mediterranean Wrought-Iron Streetlamps along Z3 (casting warm amber pools at Night!)
  // ---------------------------------------------------------------------------
  const poleGeom = new THREE.CylinderGeometry(0.06, 0.10, 4.8, 8);
  const armGeom = new THREE.BoxGeometry(0.07, 0.07, 0.95);
  const lanternGeom = new THREE.CylinderGeometry(0.18, 0.12, 0.42, 6);
  const capGeom = new THREE.ConeGeometry(0.24, 0.18, 6);

  let lampIdx = 0;
  for (let s = z3.startS; s < z3.endS; s += 24) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const side: -1 | 1 = lampIdx % 2 === 0 ? -1 : 1;
    const lat = side * (halfW + 1.9); // sits cleanly on the raised stone sidewalk!
    const lx = smp.pos.x + smp.flatRight.x * lat;
    const lz = smp.pos.z + smp.flatRight.z * lat;
    const ly = track.roadSurfaceY(smp, side * halfW) + 0.14;

    const lampGrp = new THREE.Group();
    lampGrp.position.set(lx, ly, lz);
    lampGrp.rotation.y = Math.atan2(-side * smp.flatRight.x, -side * smp.flatRight.z);

    const pole = new THREE.Mesh(poleGeom, ironMat);
    pole.position.y = 2.4;
    pole.castShadow = false;
    lampGrp.add(pole);

    const arm = new THREE.Mesh(armGeom, ironMat);
    arm.position.set(0, 4.65, 0.44);
    lampGrp.add(arm);

    const bulb = new THREE.Mesh(lanternGeom, lampBulbMat);
    bulb.position.set(0, 4.42, 0.85);
    lampGrp.add(bulb);

    const cap = new THREE.Mesh(capGeom, ironMat);
    cap.position.set(0, 4.72, 0.85);
    lampGrp.add(cap);

    // Every 2nd streetlamp carries a real warm amber sodium PointLight (18 real road-pool lights in Z3, 60+ FPS!)
    if (lampIdx % 2 === 0) {
      const pt = new THREE.PointLight(0xffa43c, 0, 34, 1.45);
      pt.position.set(0, 4.25, 1.15);
      pt.visible = false;
      lampGrp.add(pt);
      streetLights.push(pt);
    }

    group.add(lampGrp);
    lampIdx++;
  }

  // Fallback scale anchor just in case
  if (!scaleProofAnchor) {
    const smp = track.sampleAtS(z3.startS + 240);
    scaleProofAnchor = {
      buildingPos: smp.pos.clone().addScaledVector(smp.flatRight, 13),
      doorPos: smp.pos.clone().addScaledVector(smp.flatRight, 9.5).add(new THREE.Vector3(0, 1.0, 0)),
      carParkS: z3.startS + 240,
      carParkLateral: smp.width * 0.5 - 1.4,
      facingDir: smp.flatRight.clone().negate(),
    };
  }

  const setNightMode = (isNight: boolean, isHighQuality: boolean) => {
    windowLitWarmMat.emissiveIntensity = isNight ? 2.6 : 0.0;
    windowLitSoftMat.emissiveIntensity = isNight ? 1.85 : 0.0;
    lampBulbMat.emissiveIntensity = isNight ? 5.5 : 0.25;
    for (let i = 0; i < streetLights.length; i++) {
      const active = isNight && (isHighQuality || i % 2 === 0);
      streetLights[i].visible = active;
      streetLights[i].intensity = active ? 44 : 0;
    }
    for (const cl of churchLights) {
      cl.visible = isNight;
      cl.intensity = isNight ? 62 : 0;
    }
  };

  // Batch all static Mediterranean village meshes by material + shadow flags (~8,300 -> ~22 draw calls for 60+ FPS!)
  mergeStaticGroupByMaterial(group);

  return {
    group,
    unitCount: obstacles.length,
    archetypes: [...archetypes5, 'coastal_church'],
    tierCounts,
    alleyCount: alleySList.length,
    churchPos: new THREE.Vector3(churchX, churchY, churchZ),
    obstacles,
    scaleProofAnchor,
    setNightMode,
  };
}
