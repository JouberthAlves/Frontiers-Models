import * as THREE from 'three';
import { WorldTextureBank } from './materials';
import { TrackSpline } from './track';
import { TerrainField } from './terrain';
import { PropAssetBank } from './gltfAssets';
import { VegetationPrototypes } from './vegetation';
import {
  buildCurbRibbon,
  buildGuardrailRibbon,
  buildZ1CoastlineScenery,
  SceneryBuildResult,
} from './props';
import {
  buildZ4GorgeBridge,
  createArchitectureLibrary,
  createBeveledPrism,
  HouseVariation,
} from './architecture';
import { PlacedObjectRecord, ZoneId } from './types';

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

function createChevronSignTexture(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1f2630';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.fillStyle = '#e8aa2a';
  ctx.beginPath();
  ctx.moveTo(220, 140);
  ctx.lineTo(540, 140);
  ctx.lineTo(820, 512);
  ctx.lineTo(540, 884);
  ctx.lineTo(220, 884);
  ctx.lineTo(500, 512);
  ctx.closePath();
  ctx.fill();

  const nc = document.createElement('canvas');
  nc.width = 1024;
  nc.height = 1024;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, 1024, 1024);

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = new THREE.CanvasTexture(nc);
  normalMap.colorSpace = THREE.NoColorSpace;
  return { map, normalMap };
}

function createCurbTex(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#c42b23' : '#e6e0d4';
    ctx.fillRect(0, i * 256, 1024, 256);
  }
  ctx.fillStyle = 'rgba(20, 20, 20, 0.12)';
  for (let k = 0; k < 2500; k++) ctx.fillRect((k * 173) % 1024, (k * 317) % 1024, 4, 4);

  const nc = document.createElement('canvas');
  nc.width = 1024;
  nc.height = 1024;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 4; i++) {
    nctx.fillStyle = 'rgb(128,165,245)';
    nctx.fillRect(0, i * 256, 1024, 8);
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

export function buildFullCircuitScenery(
  track: TrackSpline,
  terrain: TerrainField,
  texBank: WorldTextureBank,
  veg: VegetationPrototypes,
  propBank: PropAssetBank
): SceneryBuildResult {
  // Start with Z1 vertical slice
  const z1 = buildZ1CoastlineScenery(track, terrain, texBank, veg, propBank);
  const group = z1.group;
  const objects = z1.objects;
  const rng = seededRng(track.data.seed + 777);

  const isClearOfExclusion = (x: number, z: number, radius: number): boolean => {
    const proj = track.projectPointXZ(x, 0, z);
    return proj.distToEdge - radius >= 3.15;
  };

  const metalMat = new THREE.MeshStandardMaterial({
    map: texBank.metalPlate.map,
    normalMap: texBank.metalPlate.normalMap,
    roughnessMap: texBank.metalPlate.roughnessMap,
    color: 0xc5ccd4,
    metalness: 0.72,
    roughness: 0.36,
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    map: texBank.metalPlate.map,
    normalMap: texBank.metalPlate.normalMap,
    roughnessMap: texBank.metalPlate.roughnessMap,
    color: 0x2c333d,
    metalness: 0.65,
    roughness: 0.44,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    map: texBank.stoneWall.map,
    normalMap: texBank.stoneWall.normalMap,
    roughnessMap: texBank.stoneWall.roughnessMap,
    roughness: 0.88,
  });

  const cobbleMat = new THREE.MeshStandardMaterial({
    map: texBank.cobblestone.map,
    normalMap: texBank.cobblestone.normalMap,
    roughnessMap: texBank.cobblestone.roughnessMap,
    roughness: 0.86,
  });

  const cliffMat = new THREE.MeshStandardMaterial({
    map: texBank.cliffRock.map,
    normalMap: texBank.cliffRock.normalMap,
    roughnessMap: texBank.cliffRock.roughnessMap,
    roughness: 0.92,
  });

  const curbTex = createCurbTex();
  const curbMat = new THREE.MeshStandardMaterial({
    map: curbTex.map,
    normalMap: curbTex.normalMap,
    roughness: 0.85,
  });

  const chevronTex = createChevronSignTexture();
  const chevronMat = new THREE.MeshStandardMaterial({
    map: chevronTex.map,
    normalMap: chevronTex.normalMap,
    roughness: 0.45,
  });

  // ==========================================================
  // Z2 — FALÉSIA (875..1917 m): Serpentine Cliffs, Guardrails, Curbs, Mirante!
  // ==========================================================
  // Continuous cliff-side guardrail along outer drop-offs & inner bends
  group.add(buildGuardrailRibbon(track, 875, 1915, 1, 0.75, metalMat, darkMetalMat, terrain));
  group.add(buildGuardrailRibbon(track, 880, 1460, -1, 0.85, metalMat, darkMetalMat, terrain));
  // Corner curbs (zebras) on serpentine apexes
  for (const [cs, ce, side] of [
    [930, 1080, -1],
    [1100, 1260, 1],
    [1290, 1440, -1],
    [1490, 1680, 1],
    [1720, 1890, -1],
  ] as [number, number, -1 | 1][]) {
    group.add(buildCurbRibbon(track, cs, ce, side, curbMat));
  }

  // Z2 Chevron signs & stone bollards + cliff boulders along serpentine
  const signPostG = new THREE.CylinderGeometry(0.05, 0.06, 2.2, 8);
  signPostG.translate(0, 1.1, 0);
  const signPanelG = createBeveledPrism(1.15, 0.95, 0.08, 0.02);
  const bollardG = new THREE.CylinderGeometry(0.16, 0.20, 0.95, 10);
  bollardG.translate(0, 0.46, 0);

  const pineTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const oliveTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const shrubTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const palmTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];

  const rockTemplates = [propBank.coastRocks01, propBank.coastRocks02, propBank.boulder01];

  for (let s = 890; s < 1910; s += 20) {
    const samp = track.sampleAtDistance(s);
    const absCurv = Math.abs(samp.curvature);

    // Place chevron signs on outside of sharper bends (> 1/120m curvature)
    if (absCurv > 0.008 && s % 40 < 20) {
      const outSide = samp.curvature > 0 ? 1 : -1;
      const lat = outSide * (samp.width * 0.5 + 3.9);
      const sx = samp.pos.x + samp.right.x * lat;
      const sz = samp.pos.z + samp.right.z * lat;
      if (isClearOfExclusion(sx, sz, 0.55)) {
        const sy = terrain.getHeightAt(sx, sz);
        const sg = new THREE.Group();
        const post = new THREE.Mesh(signPostG, darkMetalMat);
        post.castShadow = true;
        sg.add(post);
        const panel = new THREE.Mesh(signPanelG, chevronMat);
        panel.position.y = 1.85;
        panel.castShadow = true;
        sg.add(panel);
        sg.position.set(sx, sy, sz);
        sg.rotation.y = Math.atan2(-samp.tangent.x, -samp.tangent.z);
        if (samp.curvature < 0) panel.rotation.z = Math.PI;
        group.add(sg);
        objects.push({
          id: `z2-sign-${s}`,
          kind: 'prop',
          zone: 'Z2',
          s,
          x: sx,
          y: sy,
          z: sz,
          radius: 0.55,
        });
      }
    }

    // Cliff rock formations along inland rock wall (-right / hillside side)
    for (const side of [-1, 1] as const) {
      const lat = side * (samp.width * 0.5 + 5.5 + rng() * 8.0);
      const rx = samp.pos.x + samp.right.x * lat;
      const rz = samp.pos.z + samp.right.z * lat;
      const ry = terrain.getHeightAt(rx, rz);
      const slope = terrain.getSlopeAt(rx, rz);

      if (slope > 0.35 && rng() < 0.72) {
        const tmpl = rockTemplates[Math.floor(rng() * rockTemplates.length)];
        const scale = 1.0 + rng() * 1.4;
        const rad = Math.max(1.0, tmpl.radius * scale * 0.8);
        if (isClearOfExclusion(rx, rz, rad)) {
          const rk = tmpl.scene.clone(true);
          const sink = ry - 0.35 * scale;
          rk.position.set(rx, sink, rz);
          rk.rotation.y = rng() * Math.PI * 2;
          rk.scale.setScalar(scale);
          group.add(rk);
          objects.push({
            id: `z2-rock-${s}-${side}`,
            kind: 'rock',
            zone: 'Z2',
            s,
            x: rx,
            y: sink,
            z: rz,
            radius: rad,
            canSink: true,
          });
        }
      }
    }

    // Roadside stone bollards & Mediterranean shrubs/olives/pines
    for (let k = 0; k < 3; k++) {
      const side = k === 0 ? 1 : -1;
      const lat = side * (samp.width * 0.5 + 4.2 + rng() * 14);
      const vx = samp.pos.x + samp.right.x * lat;
      const vz = samp.pos.z + samp.right.z * lat;
      const rad = k === 0 ? 0.45 : 0.7;
      if (!isClearOfExclusion(vx, vz, rad)) continue;
      const vy = terrain.getHeightAt(vx, vz);

      if (k === 0 && s % 40 === 10) {
        const b = new THREE.Mesh(bollardG, cliffMat);
        b.position.set(vx, vy, vz);
        b.castShadow = true;
        group.add(b);
        objects.push({
          id: `z2-bollard-${s}`,
          kind: 'prop',
          zone: 'Z2',
          s,
          x: vx,
          y: vy,
          z: vz,
          radius: 0.25,
        });
      } else if (k === 1 && rng() < 0.55) {
        if (rng() < 0.45) {
          pineTransforms.push({ x: vx, y: vy, z: vz, scale: 0.8 + rng() * 0.4, rotY: rng() * Math.PI * 2 });
          objects.push({ id: `z2-pine-${s}`, kind: 'tree', variation: 'pinheiro_manso', zone: 'Z2', s, x: vx, y: vy, z: vz, radius: 0.55 });
        } else {
          oliveTransforms.push({ x: vx, y: vy, z: vz, scale: 0.85 + rng() * 0.45, rotY: rng() * Math.PI * 2 });
          objects.push({ id: `z2-olive-${s}`, kind: 'tree', variation: 'oliveira', zone: 'Z2', s, x: vx, y: vy, z: vz, radius: 0.6 });
        }
      } else {
        shrubTransforms.push({ x: vx, y: vy, z: vz, scale: 0.8 + rng() * 0.7, rotY: rng() * Math.PI * 2 });
        objects.push({ id: `z2-shrub-${s}-${k}`, kind: 'bush', variation: 'arbusto', zone: 'Z2', s, x: vx, y: vy, z: vz, radius: 0.5 });
      }
    }
  }

  // Z2 Mirante Overlook terrace (s = 1580..1650m overlooking Z1 bay!)
  const mSamp = track.sampleAtDistance(1615);
  const mLat = -(mSamp.width * 0.5 + 5.2); // overlook side facing south toward Z1 bay!
  const mx = mSamp.pos.x + mSamp.right.x * mLat;
  const mz = mSamp.pos.z + mSamp.right.z * mLat;
  if (isClearOfExclusion(mx, mz, 1.2)) {
    const my = terrain.getHeightAt(mx, mz);
    const bench = propBank.woodenBench.scene.clone(true);
    bench.position.set(mx, my, mz);
    bench.rotation.y = Math.atan2(-mSamp.right.x, -mSamp.right.z);
    group.add(bench);
    objects.push({ id: 'z2-mirante-bench', kind: 'prop', zone: 'Z2', s: 1615, x: mx, y: my, z: mz, radius: 0.8 });

    const pot = propBank.ceramicPot.scene.clone(true);
    const px2 = mx + mSamp.tangent.x * 2.5;
    const pz2 = mz + mSamp.tangent.z * 2.5;
    const py2 = terrain.getHeightAt(px2, pz2);
    pot.position.set(px2, py2, pz2);
    group.add(pot);
    objects.push({ id: 'z2-mirante-pot', kind: 'prop', zone: 'Z2', s: 1617, x: px2, y: py2, z: pz2, radius: 0.45 });
  }

  // ==========================================================
  // Z3 — VILA (1917..2591 m): Open-Air Village (>=25 houses, >=5 variations, Church Plaza!)
  // ==========================================================
  const arch = createArchitectureLibrary(texBank);
  const variations: HouseVariation[] = [
    'villa_blue',
    'stone_cottage',
    'terracotta_tall',
    'ochre_balcony',
    'cream_awning',
  ];

  const placedHouses: { x: number; z: number; radius: number }[] = [];

  // 1. Place the Church Bell-Tower Landmark overlooking the Z3 Town Plaza at s = 2285m!
  const plazaS = 2285;
  const pSamp = track.sampleAtDistance(plazaS);
  const churchLat = -(pSamp.width * 0.5 + 19.5); // inland side of plaza
  const churchX = pSamp.pos.x + pSamp.right.x * churchLat;
  const churchZ = pSamp.pos.z + pSamp.right.z * churchLat;
  const churchY = terrain.getHeightAt(churchX, churchZ);
  const churchRadius = 11.8;
  const church = arch.buildChurchLandmark();
  church.position.set(churchX, churchY, churchZ);
  church.rotation.y = Math.atan2(pSamp.right.x, pSamp.right.z); // front portal faces street!
  group.add(church);
  placedHouses.push({ x: churchX, z: churchZ, radius: churchRadius });
  objects.push({
    id: 'z3-church-landmark',
    kind: 'landmark',
    variation: 'church_campanario',
    zone: 'Z3',
    s: plazaS,
    x: churchX,
    y: churchY,
    z: churchZ,
    radius: churchRadius,
  });

  // Grounded cobblestone plaza terrace in front of church (outside road edge)
  const plazaDeckG = createBeveledPrism(28.0, 2.6, 13.0, 0.12);
  const plazaLat = -(pSamp.width * 0.5 + 9.8);
  const plX = pSamp.pos.x + pSamp.right.x * plazaLat;
  const plZ = pSamp.pos.z + pSamp.right.z * plazaLat;
  const plY = terrain.getHeightAt(plX, plZ);
  const plazaDeck = new THREE.Mesh(plazaDeckG, cobbleMat);
  plazaDeck.position.set(plX, plY - 2.45, plZ);
  plazaDeck.rotation.y = Math.atan2(pSamp.tangent.x, pSamp.tangent.z);
  plazaDeck.receiveShadow = true;
  group.add(plazaDeck);

  // Café umbrellas, benches, barrels, ceramic flower pots on the Town Plaza!
  const umbrellaColors = [0xd46a43, 0x3b6e8c, 0xd8a848, 0x9b3b34];
  for (let i = 0; i < 4; i++) {
    const uS = plazaS - 12 + i * 8;
    const uSamp = track.sampleAtDistance(uS);
    const uLat = -(uSamp.width * 0.5 + 6.2 + (i % 2) * 2.2);
    const ux = uSamp.pos.x + uSamp.right.x * uLat;
    const uz = uSamp.pos.z + uSamp.right.z * uLat;
    if (!isClearOfExclusion(ux, uz, 1.4)) continue;
    const uy = terrain.getHeightAt(ux, uz);
    const umb = arch.buildUmbrella(umbrellaColors[i % umbrellaColors.length]);
    umb.position.set(ux, uy, uz);
    group.add(umb);
    objects.push({ id: `z3-plaza-umb-${i}`, kind: 'prop', zone: 'Z3', s: uS, x: ux, y: uy, z: uz, radius: 1.1 });

    const barrel = propBank.wineBarrel.scene.clone(true);
    barrel.position.set(ux + uSamp.tangent.x * 1.9, terrain.getHeightAt(ux + uSamp.tangent.x * 1.9, uz + uSamp.tangent.z * 1.9), uz + uSamp.tangent.z * 1.9);
    group.add(barrel);
    objects.push({ id: `z3-plaza-barrel-${i}`, kind: 'prop', zone: 'Z3', s: uS + 1.9, x: barrel.position.x, y: barrel.position.y, z: barrel.position.z, radius: 0.45 });
  }

  // 2. Pack >= 34 Colorful Mediterranean Village Houses along both sides of Z3 (ZERO overlaps!)
  let houseCounter = 0;
  for (let s = 1922; s <= 2586; s += 7) {
    const samp = track.sampleAtDistance(s);
    for (const side of [-1, 1] as const) {
      // Leave open scenic plaza front near church (2260..2315 on inland side -1)
      if (side === -1 && Math.abs(s - plazaS) < 28) continue;

      const varName = variations[(houseCounter + (side === 1 ? 2 : 0)) % variations.length];
      const rad = arch.houseRadii[varName];
      // Place house front cleanly 4.5..9m beyond road edge (center at halfW + rad + 3.8..7.5)
      const distOut = samp.width * 0.5 + rad + 3.5 + ((houseCounter * 17) % 5) * 0.85;
      const hx = samp.pos.x + samp.right.x * (side * distOut);
      const hz = samp.pos.z + samp.right.z * (side * distOut);

      // Verify distance from ENTIRE spline (prevents encroaching on adjacent curves!)
      const proj = track.projectPointXZ(hx, 0, hz);
      if (proj.distToEdge - rad < 3.25) continue;
      if (proj.distToCenterXZ > 29.0) continue; // Keep within 30m of track per spec!

      // Check zero overlaps with ALL existing houses / church!
      let overlaps = false;
      for (const other of placedHouses) {
        if (Math.hypot(hx - other.x, hz - other.z) < rad + other.radius + 0.6) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      const hy = terrain.getHeightAt(hx, hz);
      const house = arch.templates[varName].clone(true);
      house.position.set(hx, hy, hz);
      // Orient front facade (+Z) squarely toward the street centerline!
      const dirToRoadX = samp.pos.x - hx;
      const dirToRoadZ = samp.pos.z - hz;
      house.rotation.y = Math.atan2(dirToRoadX, dirToRoadZ);
      group.add(house);

      placedHouses.push({ x: hx, z: hz, radius: rad });
      objects.push({
        id: `z3-house-${houseCounter}`,
        kind: 'house',
        variation: varName,
        zone: 'Z3',
        s: proj.s,
        x: hx,
        y: hy,
        z: hz,
        radius: rad,
      });
      houseCounter++;
    }
  }

  // Z3 Village Street Props: stone sidewalk curbs, streetlamps, low walls, flower pots, benches, olive/palm trees!
  const lampPostG = new THREE.CylinderGeometry(0.055, 0.095, 5.4, 10);
  lampPostG.translate(0, 2.7, 0);
  const lampHeadG = new THREE.SphereGeometry(0.22, 12, 8);
  const lampGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffe4ad,
    emissive: 0xffbf60,
    emissiveIntensity: 2.3,
    roughness: 0.2,
  });
  const lowWallG = createBeveledPrism(0.55, 0.95, 5.4, 0.04);

  for (let s = 1922; s <= 2585; s += 20) {
    const samp = track.sampleAtDistance(s);
    for (const side of [-1, 1] as const) {
      const lat = side * (samp.width * 0.5 + 3.85);
      const px = samp.pos.x + samp.right.x * lat;
      const pz = samp.pos.z + samp.right.z * lat;
      if (!isClearOfExclusion(px, pz, 0.45)) continue;
      const py = terrain.getHeightAt(px, pz);

      if (s % 40 === 2) {
        const lg = new THREE.Group();
        const post = new THREE.Mesh(lampPostG, darkMetalMat);
        post.castShadow = true;
        lg.add(post);
        const head = new THREE.Mesh(lampHeadG, lampGlowMat);
        head.position.y = 5.45;
        lg.add(head);
        lg.position.set(px, py, pz);
        group.add(lg);
        objects.push({ id: `z3-lamp-${s}-${side}`, kind: 'prop', zone: 'Z3', s, x: px, y: py, z: pz, radius: 0.3 });
      } else {
        const wall = new THREE.Mesh(lowWallG, stoneMat);
        wall.position.set(px, py - 0.1, pz);
        wall.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);
        objects.push({ id: `z3-wall-${s}-${side}`, kind: 'prop', zone: 'Z3', s, x: px, y: py, z: pz, radius: 0.38 });
      }

      // Ceramic flower pots & benches along village sidewalk
      const potLat = side * (samp.width * 0.5 + 4.4);
      const ptx = samp.pos.x + samp.right.x * potLat;
      const ptz = samp.pos.z + samp.right.z * potLat;
      if (isClearOfExclusion(ptx, ptz, 0.45)) {
        const pty = terrain.getHeightAt(ptx, ptz);
        const pot = propBank.ceramicPot.scene.clone(true);
        pot.position.set(ptx, pty, ptz);
        group.add(pot);
        objects.push({ id: `z3-pot-${s}-${side}`, kind: 'prop', zone: 'Z3', s, x: ptx, y: pty, z: ptz, radius: 0.4 });
      }

      // Olive trees & palms nestled between village plots
      if (s % 30 < 15) {
        const tLat = side * (samp.width * 0.5 + 7.2);
        const tx = samp.pos.x + samp.right.x * tLat;
        const tz = samp.pos.z + samp.right.z * tLat;
        let hitHouse = false;
        for (const h of placedHouses) {
          if (Math.hypot(tx - h.x, tz - h.z) < h.radius + 1.5) { hitHouse = true; break; }
        }
        if (!hitHouse && isClearOfExclusion(tx, tz, 0.7)) {
          const ty = terrain.getHeightAt(tx, tz);
          if (side === 1 && rng() < 0.35) {
            palmTransforms.push({ x: tx, y: ty, z: tz, scale: 0.8 + rng() * 0.3, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z3-palm-${s}`, kind: 'tree', variation: 'palmeira', zone: 'Z3', s, x: tx, y: ty, z: tz, radius: 0.45 });
          } else {
            oliveTransforms.push({ x: tx, y: ty, z: tz, scale: 0.85 + rng() * 0.35, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z3-olive-${s}-${side}`, kind: 'tree', variation: 'oliveira', zone: 'Z3', s, x: tx, y: ty, z: tz, radius: 0.6 });
          }
        }
      }
    }
  }

  // ==========================================================
  // Z4 — BOSQUE E PONTE (2591..3169 m): Dense Stone Pine + Olive Forest & Gorge Bridge!
  // ==========================================================
  // Gorge Bridge structure!
  group.add(buildZ4GorgeBridge(track, terrain, texBank));
  // Guardrails & Curbs leading into/out of Bridge & final fast turn
  group.add(buildGuardrailRibbon(track, 2600, track.bridgeStartS - 2, 1, 0.8, metalMat, darkMetalMat, terrain));
  group.add(buildGuardrailRibbon(track, track.bridgeEndS + 2, 3155, -1, 0.85, metalMat, darkMetalMat, terrain));
  group.add(buildCurbRibbon(track, 2650, 2890, -1, curbMat));
  group.add(buildCurbRibbon(track, 2995, 3150, 1, curbMat));

  for (let s = 2595; s < 3162; s += 11) {
    const samp = track.sampleAtDistance(s);
    // Avoid placing tall trees directly across the open bridge span!
    const nearBridge = s >= track.bridgeStartS - 12 && s <= track.bridgeEndS + 12;

    for (const side of [-1, 1] as const) {
      // Layer 1: Roadside Pine / Olive Canopy (4.6..14 m out)
      if (!nearBridge) {
        const lat1 = side * (samp.width * 0.5 + 4.6 + rng() * 9.0);
        const tx = samp.pos.x + samp.right.x * lat1 + (rng() - 0.5) * 3;
        const tz = samp.pos.z + samp.right.z * lat1 + (rng() - 0.5) * 3;
        if (isClearOfExclusion(tx, tz, 0.7)) {
          const ty = terrain.getHeightAt(tx, tz);
          if (rng() < 0.68) {
            pineTransforms.push({ x: tx, y: ty, z: tz, scale: 0.85 + rng() * 0.5, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z4-pine1-${s}-${side}`, kind: 'tree', variation: 'pinheiro_manso', zone: 'Z4', s, x: tx, y: ty, z: tz, radius: 0.65 });
          } else {
            oliveTransforms.push({ x: tx, y: ty, z: tz, scale: 0.9 + rng() * 0.45, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z4-olive1-${s}-${side}`, kind: 'tree', variation: 'oliveira', zone: 'Z4', s, x: tx, y: ty, z: tz, radius: 0.6 });
          }
        }
      }

      // Layer 2: Deep Forest Backdrop Pines (15..36 m out) — skip over bridge gorge so deck stays clear!
      if (!nearBridge) {
        const lat2 = side * (samp.width * 0.5 + 15 + rng() * 20);
        const dx = samp.pos.x + samp.right.x * lat2 + (rng() - 0.5) * 5;
        const dz = samp.pos.z + samp.right.z * lat2 + (rng() - 0.5) * 5;
        const p2 = track.projectPointXZ(dx, 0, dz);
        const nearBridgeProj = p2.s >= track.bridgeStartS - 18 && p2.s <= track.bridgeEndS + 18;
        if (!nearBridgeProj && isClearOfExclusion(dx, dz, 0.8)) {
          const dy = terrain.getHeightAt(dx, dz);
          if (dy > 1.2) {
            pineTransforms.push({ x: dx, y: dy, z: dz, scale: 0.95 + rng() * 0.55, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z4-pine2-${s}-${side}`, kind: 'tree', variation: 'pinheiro_manso', zone: 'Z4', s, x: dx, y: dy, z: dz, radius: 0.65 });
          }
        }
      }

      // Layer 3: Forest Understory Shrubs & Ferns along verges
      if (!nearBridge) {
        const lat3 = side * (samp.width * 0.5 + 4.1 + rng() * 7.5);
        const fx = samp.pos.x + samp.right.x * lat3;
        const fz = samp.pos.z + samp.right.z * lat3;
        if (isClearOfExclusion(fx, fz, 0.55)) {
          const fy = terrain.getHeightAt(fx, fz);
          if (s % 22 === 0 && side === 1) {
            const fern = propBank.fern02.scene.clone(true);
            fern.position.set(fx, fy, fz);
            fern.rotation.y = rng() * Math.PI * 2;
            fern.scale.setScalar(1.1 + rng() * 0.6);
            group.add(fern);
            objects.push({ id: `z4-fern-${s}-${side}`, kind: 'bush', variation: 'arbusto', zone: 'Z4', s, x: fx, y: fy, z: fz, radius: 0.45 });
          } else {
            shrubTransforms.push({ x: fx, y: fy, z: fz, scale: 0.8 + rng() * 0.7, rotY: rng() * Math.PI * 2 });
            objects.push({ id: `z4-shrub-${s}-${side}`, kind: 'bush', variation: 'arbusto', zone: 'Z4', s, x: fx, y: fy, z: fz, radius: 0.5 });
          }
        }
      }
    }
  }

  // ==========================================================
  // Guarantee >= 14 objects per 100m bin across ALL 31 bins!
  // ==========================================================
  const fullBins = Math.floor(track.totalLength / 100);
  const binCounts = new Int32Array(fullBins);
  for (const obj of objects) {
    const p = track.projectPointXZ(obj.x, obj.y, obj.z);
    const b = Math.floor(p.s / 100);
    if (b >= 0 && b < fullBins && p.distToEdge < 45) binCounts[b]++;
  }

  for (let b = 0; b < fullBins; b++) {
    let attempts = 0;
    while (binCounts[b] < 15 && attempts < 40) {
      attempts++;
      const s = b * 100 + 8 + ((attempts * 23) % 84);
      const samp = track.sampleAtDistance(s);
      const side = attempts % 2 === 0 ? 1 : -1;
      const lat = side * (samp.width * 0.5 + 4.4 + (attempts % 5) * 2.2);
      const sx = samp.pos.x + samp.right.x * lat;
      const sz = samp.pos.z + samp.right.z * lat;
      if (!isClearOfExclusion(sx, sz, 0.55)) continue;
      const sy = terrain.getHeightAt(sx, sz);
      if (sy < 0.5) continue;

      if (samp.zone === 'Z2' && attempts % 3 === 0) {
        const rock = propBank.boulder01.scene.clone(true);
        rock.position.set(sx, sy - 0.15, sz);
        rock.scale.setScalar(0.8 + rng() * 0.6);
        group.add(rock);
        objects.push({ id: `fill-rock-${b}-${attempts}`, kind: 'rock', zone: samp.zone, s, x: sx, y: sy - 0.15, z: sz, radius: 0.9, canSink: true });
      } else {
        shrubTransforms.push({ x: sx, y: sy, z: sz, scale: 0.8 + rng() * 0.6, rotY: rng() * Math.PI * 2 });
        objects.push({ id: `fill-shrub-${b}-${attempts}`, kind: 'bush', variation: 'arbusto', zone: samp.zone, s, x: sx, y: sy, z: sz, radius: 0.5 });
      }
      binCounts[b]++;
    }
  }

  // Add all Z2-Z4 Instanced Vegetation meshes
  const addInstanced = (
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    list: { x: number; y: number; z: number; scale: number; rotY: number }[]
  ) => {
    if (list.length === 0) return;
    const im = new THREE.InstancedMesh(geom, mat, list.length);
    im.castShadow = true;
    im.receiveShadow = true;
    const d = new THREE.Object3D();
    for (let i = 0; i < list.length; i++) {
      d.position.set(list[i].x, list[i].y, list[i].z);
      d.rotation.set(0, list[i].rotY, 0);
      d.scale.setScalar(list[i].scale);
      d.updateMatrix();
      im.setMatrixAt(i, d.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
    group.add(im);
  };

  addInstanced(veg.palmTrunkGeom, veg.palmTrunkMat, palmTransforms);
  addInstanced(veg.palmCrownGeom, veg.palmFrondMat, palmTransforms);
  addInstanced(veg.pineTrunkGeom, veg.barkMat, pineTransforms);
  addInstanced(veg.pineCrownGeom, veg.pineCanopyMat, pineTransforms);
  addInstanced(veg.oliveTrunkGeom, veg.barkMat, oliveTransforms);
  addInstanced(veg.oliveCrownGeom, veg.oliveCanopyMat, oliveTransforms);
  addInstanced(veg.shrubGeom, veg.shrubMat, shrubTransforms);

  return {
    group,
    objects,
    rockFoamCenters: z1.rockFoamCenters,
    animatedFlags: z1.animatedFlags,
    updateAnimations: z1.updateAnimations,
  };
}
