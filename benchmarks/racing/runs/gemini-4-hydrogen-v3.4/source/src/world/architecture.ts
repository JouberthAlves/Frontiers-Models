import * as THREE from 'three';
import { WorldTextureBank } from './materials';
import { TrackSpline } from './track';
import { TerrainField } from './terrain';

export type HouseVariation =
  | 'villa_blue'
  | 'stone_cottage'
  | 'terracotta_tall'
  | 'ochre_balcony'
  | 'cream_awning';

/**
 * Creates a beveled box mesh geometry via ExtrudeGeometry (> 12 tris, never BoxGeometry!)
 * Centered on X/Z, resting at y = 0..h!
 */
export function createBeveledPrism(
  w: number,
  h: number,
  d: number,
  bevel = 0.04
): THREE.BufferGeometry {
  const hw = Math.max(0.05, w * 0.5 - bevel);
  const hd = Math.max(0.05, d * 0.5 - bevel);
  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  const extrudeH = Math.max(0.05, h - bevel * 2);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeH,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  // Normalize UVs smoothly in meters (~1 tile per 3.5m)
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);
    if (ny > 0.6) {
      uv.setXY(i, px / 3.5, pz / 3.5);
    } else if (nx > 0.6) {
      uv.setXY(i, pz / 3.5, py / 3.5);
    } else {
      uv.setXY(i, px / 3.5, py / 3.5);
    }
  }
  uv.needsUpdate = true;
  return g;
}

function createPitchedRoofGeometry(w: number, ridgeH: number, d: number, eaveOverhang = 0.45): THREE.BufferGeometry {
  const hw = w * 0.5 + eaveOverhang;
  const hd = d * 0.5 + eaveOverhang;
  // Extrude triangular gable cross-section along Z!
  const shape = new THREE.Shape();
  shape.moveTo(-hw, 0);
  shape.lineTo(hw, 0);
  shape.lineTo(hw * 0.92, 0.22);
  shape.lineTo(0, ridgeH);
  shape.lineTo(-hw * 0.92, 0.22);
  shape.closePath();

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: hd * 2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 1,
  });
  g.translate(0, 0, -hd);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / 2.2, pos.getZ(i) / 2.2);
  }
  uv.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function createAwningTextures(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#c44b2d' : '#f2eadb';
    ctx.fillRect(i * 64, 0, 64, 1024);
  }
  const nc = document.createElement('canvas');
  nc.width = 1024;
  nc.height = 1024;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 16; i++) {
    nctx.fillStyle = i % 2 === 0 ? 'rgb(138,128,250)' : 'rgb(118,128,250)';
    nctx.fillRect(i * 64, 0, 64, 1024);
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = new THREE.CanvasTexture(nc);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.colorSpace = THREE.NoColorSpace;
  return { map, normalMap };
}

export interface ArchitectureLibrary {
  templates: Record<HouseVariation, THREE.Group>;
  houseRadii: Record<HouseVariation, number>;
  buildChurchLandmark: () => THREE.Group;
  buildUmbrella: (colorHex: number) => THREE.Group;
}

export function createArchitectureLibrary(texBank: WorldTextureBank): ArchitectureLibrary {
  const makeMat = (
    set: { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture },
    tintHex: number,
    rough = 0.88
  ) =>
    new THREE.MeshStandardMaterial({
      map: set.map,
      normalMap: set.normalMap,
      roughnessMap: set.roughnessMap,
      color: tintHex,
      roughness: rough,
    });

  const roofMat = makeMat(texBank.roofTiles, 0xd8b298, 0.82);
  const stoneMat = makeMat(texBank.stoneWall, 0xddd4c4, 0.90);
  const woodDarkMat = makeMat(texBank.woodPlanks, 0x6e4a2e, 0.84);
  const shutterBlueMat = makeMat(texBank.woodPlanks, 0x456b84, 0.78);
  const shutterGreenMat = makeMat(texBank.woodPlanks, 0x4c6b48, 0.78);
  const shutterOchreMat = makeMat(texBank.woodPlanks, 0x9b6e35, 0.78);
  const metalMat = makeMat(texBank.metalPlate, 0x2a2f36, 0.55);
  const leafPotMat = makeMat(texBank.grassRock, 0x3f662b, 0.85);
  const flowerMat = makeMat(texBank.plasterClay, 0xd94848, 0.7);

  const windowGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x162432,
    roughness: 0.08,
    metalness: 0.25,
    clearcoat: 1.0,
    envMapIntensity: 1.8,
  });

  const awningTex = createAwningTextures();
  const awningMat = new THREE.MeshStandardMaterial({
    map: awningTex.map,
    normalMap: awningTex.normalMap,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });

  // Shared recessed window unit (stone frame + dark glass + open side shutters)
  const frameOuterG = createBeveledPrism(1.22, 1.56, 0.16, 0.03);
  const glassPaneG = createBeveledPrism(0.92, 1.24, 0.08, 0.01);
  const shutterG = createBeveledPrism(0.42, 1.32, 0.06, 0.015);
  const sillG = createBeveledPrism(1.36, 0.12, 0.24, 0.02);

  // Real 2.1m door unit (step + arched/beveled stone surround + 2.1m paneled oak door!)
  const doorFrameG = createBeveledPrism(1.48, 2.28, 0.22, 0.04);
  const doorLeafG = createBeveledPrism(1.12, 2.10, 0.12, 0.02);
  const doorStepG = createBeveledPrism(1.85, 0.18, 0.65, 0.03);

  const buildWindowUnit = (shutterMat: THREE.Material) => {
    const wg = new THREE.Group();
    const frame = new THREE.Mesh(frameOuterG, stoneMat);
    frame.castShadow = true;
    wg.add(frame);

    const glass = new THREE.Mesh(glassPaneG, windowGlassMat);
    glass.position.set(0, 0.16, 0.03);
    wg.add(glass);

    const sill = new THREE.Mesh(sillG, stoneMat);
    sill.position.set(0, -0.05, 0.06);
    wg.add(sill);

    for (const side of [-1, 1]) {
      const sh = new THREE.Mesh(shutterG, shutterMat);
      sh.position.set(side * 0.80, 0.12, 0.08);
      sh.rotation.y = -side * 0.22;
      sh.castShadow = true;
      wg.add(sh);
    }
    return wg;
  };

  const buildDoorUnit = () => {
    const dg = new THREE.Group();
    const step = new THREE.Mesh(doorStepG, stoneMat);
    step.position.set(0, 0, 0.28);
    step.receiveShadow = true;
    dg.add(step);

    const frame = new THREE.Mesh(doorFrameG, stoneMat);
    frame.position.set(0, 0.14, 0.06);
    frame.castShadow = true;
    dg.add(frame);

    const leaf = new THREE.Mesh(doorLeafG, woodDarkMat);
    leaf.position.set(0, 0.16, 0.12);
    dg.add(leaf);
    return dg;
  };

  const buildBalcony = (w: number) => {
    const bg = new THREE.Group();
    const slab = new THREE.Mesh(createBeveledPrism(w, 0.18, 1.05, 0.03), stoneMat);
    slab.castShadow = true;
    bg.add(slab);
    const railTop = new THREE.Mesh(createBeveledPrism(w, 0.08, 0.08, 0.02), metalMat);
    railTop.position.set(0, 0.96, 0.46);
    bg.add(railTop);
    const barG = new THREE.CylinderGeometry(0.022, 0.022, 0.92, 8);
    barG.translate(0, 0.46, 0);
    for (let x = -w * 0.46; x <= w * 0.46 + 0.01; x += 0.26) {
      const bar = new THREE.Mesh(barG, metalMat);
      bar.position.set(x, 0.12, 0.46);
      bg.add(bar);
    }
    return bg;
  };

  const buildPlanter = () => {
    const pg = new THREE.Group();
    const box = new THREE.Mesh(createBeveledPrism(1.15, 0.28, 0.34, 0.02), stoneMat);
    pg.add(box);
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 1), leafPotMat);
    bush.scale.set(1.8, 0.85, 0.9);
    bush.position.set(0, 0.34, 0);
    pg.add(bush);
    for (const fx of [-0.32, 0, 0.32]) {
      const fl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11, 1), flowerMat);
      fl.position.set(fx, 0.42, 0.06);
      pg.add(fl);
    }
    return pg;
  };

  const buildChimney = () => {
    const cg = new THREE.Group();
    const stack = new THREE.Mesh(createBeveledPrism(0.68, 2.2, 0.68, 0.04), stoneMat);
    stack.castShadow = true;
    cg.add(stack);
    const cap = new THREE.Mesh(createBeveledPrism(0.84, 0.14, 0.84, 0.03), roofMat);
    cap.position.y = 2.15;
    cg.add(cap);
    return cg;
  };

  const configs: {
    id: HouseVariation;
    w: number;
    d: number;
    floors: number;
    wallMat: THREE.Material;
    shutterMat: THREE.Material;
    hasBalcony: boolean;
    hasAwning: boolean;
    hasChimney: boolean;
    hasPlanters: boolean;
  }[] = [
    {
      id: 'villa_blue',
      w: 8.8,
      d: 7.4,
      floors: 2,
      wallMat: makeMat(texBank.plasterBlue, 0xcadceb, 0.90),
      shutterMat: shutterOchreMat,
      hasBalcony: true,
      hasAwning: false,
      hasChimney: true,
      hasPlanters: true,
    },
    {
      id: 'stone_cottage',
      w: 8.2,
      d: 7.0,
      floors: 2,
      wallMat: stoneMat,
      shutterMat: shutterGreenMat,
      hasBalcony: false,
      hasAwning: false,
      hasChimney: true,
      hasPlanters: true,
    },
    {
      id: 'terracotta_tall',
      w: 9.4,
      d: 7.8,
      floors: 3,
      wallMat: makeMat(texBank.plasterClay, 0xe8b596, 0.88),
      shutterMat: shutterBlueMat,
      hasBalcony: true,
      hasAwning: true,
      hasChimney: true,
      hasPlanters: false,
    },
    {
      id: 'ochre_balcony',
      w: 8.6,
      d: 7.2,
      floors: 3,
      wallMat: makeMat(texBank.plasterBeige, 0xe8c98a, 0.89),
      shutterMat: shutterGreenMat,
      hasBalcony: true,
      hasAwning: false,
      hasChimney: false,
      hasPlanters: true,
    },
    {
      id: 'cream_awning',
      w: 9.2,
      d: 7.6,
      floors: 2,
      wallMat: makeMat(texBank.plasterWhite, 0xf2ebe0, 0.88),
      shutterMat: shutterBlueMat,
      hasBalcony: false,
      hasAwning: true,
      hasChimney: true,
      hasPlanters: true,
    },
  ];

  const templates = {} as Record<HouseVariation, THREE.Group>;
  const houseRadii = {} as Record<HouseVariation, number>;

  for (const cfg of configs) {
    const hg = new THREE.Group();
    const floorH = 3.1;
    const totalH = cfg.floors * floorH;

    // Ground-hugging stone foundation plinth extending -2.8m underground so sloped hillside terrain NEVER shows air beneath!
    const plinth = new THREE.Mesh(
      createBeveledPrism(cfg.w + 0.35, 3.3, cfg.d + 0.35, 0.05),
      stoneMat
    );
    plinth.position.y = -2.8;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    hg.add(plinth);

    // Main multi-story body
    const body = new THREE.Mesh(createBeveledPrism(cfg.w, totalH, cfg.d, 0.08), cfg.wallMat);
    body.position.y = 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    hg.add(body);

    // Overhanging pitched terracotta roof
    const roof = new THREE.Mesh(createPitchedRoofGeometry(cfg.w, 2.35, cfg.d, 0.55), roofMat);
    roof.position.y = 0.15 + totalH;
    roof.castShadow = true;
    roof.receiveShadow = true;
    hg.add(roof);

    // Front (+Z) and Back (-Z) 2.1m Door + Recessed Windows
    const frontZ = cfg.d * 0.5;
    const doorFront = buildDoorUnit();
    doorFront.position.set(-cfg.w * 0.22, 0.0, frontZ);
    hg.add(doorFront);

    const doorBack = buildDoorUnit();
    doorBack.position.set(cfg.w * 0.22, 0.0, -frontZ);
    doorBack.rotation.y = Math.PI;
    hg.add(doorBack);

    // Ground-floor window beside door + Upper-floor windows on front, back, & sides!
    for (let fl = 0; fl < cfg.floors; fl++) {
      const wy = 0.88 + fl * floorH;
      const xSlots = fl === 0 ? [cfg.w * 0.22] : [-cfg.w * 0.24, cfg.w * 0.24];
      for (const wx of xSlots) {
        const wf = buildWindowUnit(cfg.shutterMat);
        wf.position.set(wx, wy, frontZ + 0.02);
        hg.add(wf);
        if (cfg.hasPlanters && fl === 1) {
          const pl = buildPlanter();
          pl.position.set(wx, wy - 0.28, frontZ + 0.22);
          hg.add(pl);
        }
      }
      // Back facade windows
      for (const wx of fl === 0 ? [-cfg.w * 0.22] : [-cfg.w * 0.24, cfg.w * 0.24]) {
        const wb = buildWindowUnit(cfg.shutterMat);
        wb.position.set(wx, wy, -frontZ - 0.02);
        wb.rotation.y = Math.PI;
        hg.add(wb);
      }
      // Side facade windows
      if (fl >= 1) {
        for (const side of [-1, 1]) {
          const ws = buildWindowUnit(cfg.shutterMat);
          ws.position.set(side * (cfg.w * 0.5 + 0.02), wy, 0);
          ws.rotation.y = side * (Math.PI / 2);
          hg.add(ws);
        }
      }
    }

    if (cfg.hasBalcony) {
      const balc = buildBalcony(3.4);
      balc.position.set(0, floorH + 0.25, frontZ + 0.48);
      hg.add(balc);
    }

    if (cfg.hasAwning) {
      const aw = new THREE.Mesh(
        createBeveledPrism(cfg.w * 0.62, 0.10, 1.8, 0.02),
        awningMat
      );
      aw.position.set(0, 2.75, frontZ + 0.78);
      aw.rotation.x = 0.28;
      aw.castShadow = true;
      hg.add(aw);
    }

    if (cfg.hasChimney) {
      const ch = buildChimney();
      ch.position.set(cfg.w * 0.28, totalH + 0.6, -cfg.d * 0.18);
      hg.add(ch);
    }

    templates[cfg.id] = hg;
    houseRadii[cfg.id] = Math.hypot(cfg.w * 0.5, cfg.d * 0.5) + 0.8;
  }

  const buildChurchLandmark = (): THREE.Group => {
    const cg = new THREE.Group();
    const creamMat = makeMat(texBank.plasterWhite, 0xf0e4cf, 0.88);
    const bronzeMat = makeMat(texBank.metalPlate, 0xc99c4a, 0.35);

    // Stone plinth
    const plinth = new THREE.Mesh(createBeveledPrism(14.0, 3.6, 20.0, 0.08), stoneMat);
    plinth.position.y = -3.0;
    plinth.receiveShadow = true;
    cg.add(plinth);

    // Main nave
    const nave = new THREE.Mesh(createBeveledPrism(12.2, 8.8, 18.0, 0.1), creamMat);
    nave.position.y = 0.2;
    nave.castShadow = true;
    nave.receiveShadow = true;
    cg.add(nave);

    // Pitched terracotta nave roof
    const naveRoof = new THREE.Mesh(createPitchedRoofGeometry(12.2, 3.2, 18.0, 0.6), roofMat);
    naveRoof.position.y = 9.0;
    naveRoof.castShadow = true;
    cg.add(naveRoof);

    // Tall Campanário Bell Tower (21m tall — unmistakable landmark across Z2/Z3/Z4!)
    const tower = new THREE.Mesh(createBeveledPrism(4.6, 17.5, 4.6, 0.08), stoneMat);
    tower.position.set(-4.6, 0.2, 6.8);
    tower.castShadow = true;
    tower.receiveShadow = true;
    cg.add(tower);

    // Belfry open-arch crown + bronze bell + spire roof + cross
    for (const [ox, oz] of [[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]]) {
      const col = new THREE.Mesh(createBeveledPrism(0.75, 3.4, 0.75, 0.04), creamMat);
      col.position.set(-4.6 + ox, 17.7, 6.8 + oz);
      col.castShadow = true;
      cg.add(col);
    }
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.72, 1.1, 18), bronzeMat);
    bell.position.set(-4.6, 19.2, 6.8);
    cg.add(bell);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(3.3, 4.4, 8, 2), roofMat);
    spire.rotation.y = Math.PI / 8;
    spire.position.set(-4.6, 23.2, 6.8);
    spire.castShadow = true;
    cg.add(spire);

    // Church Cross
    const vCross = new THREE.Mesh(createBeveledPrism(0.18, 1.8, 0.18, 0.02), bronzeMat);
    vCross.position.set(-4.6, 25.1, 6.8);
    cg.add(vCross);
    const hCross = new THREE.Mesh(createBeveledPrism(1.1, 0.18, 0.18, 0.02), bronzeMat);
    hCross.position.set(-4.6, 26.2, 6.8);
    cg.add(hCross);

    // Grand Arched Entrance Portal & Rose Window on front (+Z)
    const portal = buildDoorUnit();
    portal.scale.set(1.5, 1.4, 1.2);
    portal.position.set(1.2, 0.0, 9.02);
    cg.add(portal);

    const roseFrame = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.18, 12, 28), stoneMat);
    roseFrame.position.set(1.2, 6.6, 9.05);
    cg.add(roseFrame);
    const roseGlass = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.12, 24), windowGlassMat);
    roseGlass.rotation.x = Math.PI / 2;
    roseGlass.position.set(1.2, 6.6, 9.0);
    cg.add(roseGlass);

    // Arched side nave windows on both flanks so church looks richly detailed from street!
    for (const side of [-1, 1]) {
      for (const wz of [-5.2, -0.8, 3.6]) {
        const sw = buildWindowUnit(shutterOchreMat);
        sw.scale.set(1.2, 1.45, 1.0);
        sw.position.set(side * 6.12, 3.8, wz);
        sw.rotation.y = side * (Math.PI / 2);
        cg.add(sw);
      }
    }

    return cg;
  };

  const buildUmbrella = (colorHex: number): THREE.Group => {
    const ug = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.5, 10), woodDarkMat);
    pole.position.y = 1.25;
    pole.castShadow = true;
    ug.add(pole);

    const canopyMat = makeMat(texBank.plasterWhite, colorHex, 0.85);
    canopyMat.side = THREE.DoubleSide;
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.65, 16, 2, true), canopyMat);
    canopy.position.y = 2.55;
    canopy.castShadow = true;
    ug.add(canopy);

    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 16), woodDarkMat);
    table.position.y = 0.78;
    table.castShadow = true;
    ug.add(table);
    return ug;
  };

  return {
    templates,
    houseRadii,
    buildChurchLandmark,
    buildUmbrella,
  };
}

export function buildZ4GorgeBridge(
  track: TrackSpline,
  terrain: TerrainField,
  texBank: WorldTextureBank
): THREE.Group {
  const g = new THREE.Group();
  const concreteMat = new THREE.MeshStandardMaterial({
    map: texBank.stoneWall.map,
    normalMap: texBank.stoneWall.normalMap,
    roughnessMap: texBank.stoneWall.roughnessMap,
    color: 0xd0c8b8,
    roughness: 0.88,
  });
  const railMat = new THREE.MeshStandardMaterial({
    map: texBank.metalPlate.map,
    normalMap: texBank.metalPlate.normalMap,
    roughnessMap: texBank.metalPlate.roughnessMap,
    color: 0xbac2cc,
    metalness: 0.75,
    roughness: 0.35,
  });

  const s0 = track.bridgeStartS - 5.0;
  const s1 = track.bridgeEndS + 5.0;
  const segs = 36;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Cross-section profile of bridge deck + side curb parapets (10 verts per ring)
  // Leaves road surface y=0 untouched while adding solid concrete deck underside (-1.35m) & raised side parapets (+0.85m)!
  const profile: [number, number][] = [
    [-0.75, -0.05],
    [-0.75, 0.85],
    [-0.45, 0.85],
    [-0.45, -1.25],
    [0.0, -1.35], // center underside
    [0.45, -1.25],
    [0.45, 0.85],
    [0.75, 0.85],
    [0.75, -0.05],
  ];

  const p = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const s = s0 + (i / segs) * (s1 - s0);
    const samp = track.sampleAtDistance(s);
    const hw = samp.width * 0.5;
    for (let j = 0; j < profile.length; j++) {
      const [sideOff, upOff] = profile[j];
      const lat =
        j < 4
          ? -hw + sideOff
          : j === 4
          ? 0
          : hw + sideOff;
      p.copy(samp.pos).addScaledVector(samp.right, lat).addScaledVector(samp.up, upOff);
      positions.push(p.x, p.y, p.z);
      uvs.push(j / (profile.length - 1), (s - s0) / 5.0);
    }
  }

  const ring = profile.length;
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < ring - 1; j++) {
      const a = i * ring + j;
      const b = a + 1;
      const c = (i + 1) * ring + j;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  // Left & Right side parapet continuous bridge deck beam (explicit solid underside girder + piers)
  const deckGeom = new THREE.BufferGeometry();
  deckGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  deckGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  deckGeom.setIndex(indices);
  deckGeom.computeVertexNormals();
  const deckMat = concreteMat.clone();
  deckMat.side = THREE.DoubleSide;
  const deckMesh = new THREE.Mesh(deckGeom, deckMat);
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  g.add(deckMesh);

  // Tapered concrete bridge piers anchored down into ravine floor + embankment abutments at both ends!
  for (const frac of [0.06, 0.34, 0.66, 0.94]) {
    const s = s0 + frac * (s1 - s0);
    const samp = track.sampleAtDistance(s);
    const isAbutment = frac < 0.1 || frac > 0.9;
    for (const side of isAbutment ? [0] : [-3.8, 3.8]) {
      const px = samp.pos.x + samp.right.x * side;
      const pz = samp.pos.z + samp.right.z * side;
      const floorY = terrain.getHeightAt(px, pz);
      const deckBotY = samp.pos.y - 1.1;
      const pierH = Math.max(2.5, deckBotY - floorY + 2.2);

      const pierGeom = isAbutment
        ? createBeveledPrism(samp.width + 2.2, pierH, 4.5, 0.12)
        : new THREE.CylinderGeometry(0.85, 1.15, pierH, 12);
      if (!isAbutment) pierGeom.translate(0, pierH * 0.5, 0);

      const pier = new THREE.Mesh(pierGeom, concreteMat);
      pier.position.set(px, floorY - 1.5, pz);
      pier.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
      pier.castShadow = true;
      pier.receiveShadow = true;
      g.add(pier);
    }
  }

  // Top steel handrails along both bridge parapets
  for (const side of [-1, 1] as const) {
    const railPts: THREE.Vector3[] = [];
    for (let i = 0; i <= segs; i++) {
      const s = s0 + (i / segs) * (s1 - s0);
      const samp = track.sampleAtDistance(s);
      railPts.push(
        samp.pos
          .clone()
          .addScaledVector(samp.right, side * (samp.width * 0.5 + 0.6))
          .addScaledVector(samp.up, 1.05)
      );
    }
    const curve = new THREE.CatmullRomCurve3(railPts);
    const rMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, 0.065, 8, false), railMat);
    rMesh.castShadow = true;
    g.add(rMesh);
  }

  return g;
}
