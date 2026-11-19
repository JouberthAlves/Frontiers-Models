import * as THREE from 'three';
import { RigidObstacleRecord } from '../types';
import { LoadedAssets } from './assets';
import { TerrainSystem } from './terrain';
import { TrackSpline } from './trackSpline';
import { CoastalRockFoamPoint } from './waterSky';
import { SeededRNG } from '../utils/rng';
import { mergeStaticGroupByMaterial } from '../utils/meshMerge';

export interface PropsBridgeSystem {
  group: THREE.Group;
  coastalRocks: CoastalRockFoamPoint[];
  obstacles: RigidObstacleRecord[];
  propCountTotal: number;
  propsPer100m: number;
  setNightMode: (isNight: boolean) => void;
  update: (timeSec: number) => void;
}

/**
 * Builds ALL zone-specific trackside architecture, guardrails, coastal sea rocks, moored boats,
 * beach dune fences, plaza furniture, Start/Finish gantry, and the anchored Z4 Viaduct Bridge!
 * Strictly derived by arc-length along TrackSpline & raycast/height-grounded onto TerrainSystem.
 */
export function buildPropsAndBridge(
  track: TrackSpline,
  terrain: TerrainSystem,
  assets: LoadedAssets
): PropsBridgeSystem {
  const group = new THREE.Group();
  group.name = 'props_and_bridge_system';

  const rng = new SeededRNG(track.spec.seed + 5050);
  const coastalRocks: CoastalRockFoamPoint[] = [];
  const obstacles: RigidObstacleRecord[] = [];
  const nightLights: THREE.PointLight[] = [];
  const boats: Array<{ mesh: THREE.Group; baseY: number; phase: number }> = [];
  let propCountTotal = 0;

  // Real scanned Poly Haven PBR materials
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd2c7b4,
    map: assets.textures.stone_wall.map,
    normalMap: assets.textures.stone_wall.normalMap,
    roughnessMap: assets.textures.stone_wall.roughnessMap,
    roughness: 0.90,
  });
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xc8c3ba,
    map: assets.textures.concrete_bridge.map,
    normalMap: assets.textures.concrete_bridge.normalMap,
    roughnessMap: assets.textures.concrete_bridge.roughnessMap,
    roughness: 0.86,
  });
  const cliffRockMat = new THREE.MeshStandardMaterial({
    color: 0xcec3b0,
    map: assets.textures.cliff_rock.map,
    normalMap: assets.textures.cliff_rock.normalMap,
    normalScale: new THREE.Vector2(1.25, 1.25),
    roughnessMap: assets.textures.cliff_rock.roughnessMap,
    roughness: 0.92,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xb69c7e,
    map: assets.textures.wood_planks.map,
    normalMap: assets.textures.wood_planks.normalMap,
    roughnessMap: assets.textures.wood_planks.roughnessMap,
    roughness: 0.88,
  });
  const plazaStoneMat = new THREE.MeshStandardMaterial({
    color: 0xe0d6c4,
    map: assets.textures.sidewalk_stone.map,
    normalMap: assets.textures.sidewalk_stone.normalMap,
    roughnessMap: assets.textures.sidewalk_stone.roughnessMap,
    roughness: 0.85,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x848f9a,
    metalness: 0.52,
    roughness: 0.54,
  });
  const darkIronMat = new THREE.MeshStandardMaterial({
    color: 0x22262e,
    metalness: 0.72,
    roughness: 0.42,
  });
  const bannerRedMat = new THREE.MeshStandardMaterial({ color: 0xc92c2a, roughness: 0.75, side: THREE.DoubleSide });
  const bannerGoldMat = new THREE.MeshStandardMaterial({ color: 0xe3a82b, roughness: 0.75, side: THREE.DoubleSide });
  const bannerTealMat = new THREE.MeshStandardMaterial({ color: 0x1e7d8c, roughness: 0.75, side: THREE.DoubleSide });
  const chevronMat = new THREE.MeshStandardMaterial({
    color: 0xf4c41c,
    emissive: new THREE.Color(0x664d00),
    emissiveIntensity: 0.25,
    roughness: 0.4,
  });
  const gantryLedMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: new THREE.Color(0xfff0d0),
    emissiveIntensity: 1.5,
    roughness: 0.2,
  });
  const gantrySignMat = new THREE.MeshStandardMaterial({
    color: 0x162230,
    emissive: new THREE.Color(0x2266aa),
    emissiveIntensity: 0.45,
    roughness: 0.35,
  });

  // ===========================================================================
  // 1. Z1 START / FINISH STEEL-TRUSS GANTRY + ILLUMINATED NIGHT FLOODS
  // ===========================================================================
  {
    const sf = track.sampleAtS(track.spec.startFinishS);
    const gantry = new THREE.Group();
    gantry.name = 'start_finish_gantry';
    gantry.position.copy(sf.pos);
    gantry.rotation.y = Math.atan2(-sf.tangent.x, -sf.tangent.z);

    const span = sf.width + 6.4;
    const hG = 7.4;

    // Two anchored twin-leg steel truss towers cleanly outside the 3.0m road edge exclusion zone!
    for (const sx of [-1, 1]) {
      const tx = sx * (span * 0.5);
      // Concrete footing block sunk into ground
      const foot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, 2.2), concreteMat);
      foot.position.set(tx, 0.2, 0);
      foot.castShadow = true;
      foot.receiveShadow = true;
      gantry.add(foot);
      for (const sz of [-0.65, 0.65]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.32, hG, 0.32), darkIronMat);
        leg.position.set(tx, hG * 0.5, sz);
        leg.castShadow = true;
        gantry.add(leg);
      }
      // Cross braces
      for (let b = 0; b < 4; b++) {
        const br = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 1.4), steelMat);
        br.position.set(tx, 1.4 + b * 1.65, 0);
        gantry.add(br);
      }
    }

    // Overhead bridge banner truss & glowing start light pods
    const beamTop = new THREE.Mesh(new THREE.BoxGeometry(span + 0.8, 1.45, 1.45), darkIronMat);
    beamTop.position.set(0, hG, 0);
    beamTop.castShadow = true;
    gantry.add(beamTop);

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(span - 2.0, 1.15, 1.56), gantrySignMat);
    signBoard.position.set(0, hG, 0);
    gantry.add(signBoard);

    // Coastal gold/red motorsport accent bars
    const accentBar = new THREE.Mesh(new THREE.BoxGeometry(span - 1.6, 0.14, 1.62), bannerRedMat);
    accentBar.position.set(0, hG - 0.62, 0);
    gantry.add(accentBar);

    // 5 overhead start lights + 4 downward flood lamps
    for (let k = -2; k <= 2; k++) {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.3), darkIronMat);
      pod.position.set(k * 1.1, hG - 0.95, 0.6);
      gantry.add(pod);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 14), gantryLedMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(k * 1.1, hG - 0.95, 0.76);
      gantry.add(lens);
    }

    // Real Night Floodlights illuminating the Starting Grid!
    for (const fx of [-4.2, 4.2]) {
      const fl = new THREE.PointLight(0xfff0d4, 0, 52, 1.25);
      fl.position.set(fx, hG - 1.2, 0);
      fl.visible = false;
      gantry.add(fl);
      nightLights.push(fl);
    }

    group.add(gantry);
    propCountTotal += 8;
  }

  // ===========================================================================
  // 2. Z1 WATERFRONT: Seaside Stone Promenade Walls, Racing Flags, Beach Dune Fences,
  //    Coastal Sea Boulders (with animated foam rings!), Promenade Lamps & Boats!
  // ===========================================================================
  const z1 = track.spec.zones[0];

  // Low weathered Mediterranean seaside stone walls + colorful trackside banners along Z1
  for (let s = z1.startS + 10; s < z1.endS - 18; s += 12) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);

    // Low seaside stone wall on -1 (beach side) with periodic openings to beach
    if (Math.floor(s / 36) % 3 !== 2) {
      const lat = -(halfW + 2.35);
      const wx = smp.pos.x + smp.flatRight.x * lat;
      const wz = smp.pos.z + smp.flatRight.z * lat;
      const wy = terrain.getHeight(wx, wz);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.05, 11.4), stoneMat);
      wall.position.set(wx, wy + 0.35, wz);
      wall.rotation.y = yaw;
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);
      // Stone cap coping
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 11.55), concreteMat);
      cap.position.set(wx, wy + 0.90, wz);
      cap.rotation.y = yaw;
      group.add(cap);
      propCountTotal += 2;
    }

    // Coastal motorsport flag poles & banners on both sides of Z1!
    if (Math.floor(s / 12) % 2 === 0) {
      for (const side of [-1, 1] as const) {
        const lat = side * (halfW + (side === -1 ? 3.2 : 3.4));
        const fx = smp.pos.x + smp.flatRight.x * lat;
        const fz = smp.pos.z + smp.flatRight.z * lat;
        const fy = terrain.getHeight(fx, fz);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 4.4, 8), steelMat);
        pole.position.set(fx, fy + 2.1, fz);
        group.add(pole);
        const flagMat = (Math.floor(s) + (side > 0 ? 1 : 0)) % 3 === 0 ? bannerRedMat : Math.floor(s) % 2 === 0 ? bannerGoldMat : bannerTealMat;
        const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.95), flagMat);
        flag.position.set(fx + smp.flatRight.x * side * 0.42, fy + 3.25, fz + smp.flatRight.z * side * 0.42);
        flag.rotation.y = yaw + Math.PI * 0.5;
        group.add(flag);
        propCountTotal += 2;
      }
    }

    // Promenade Night flood lamps along Z1 grid & straight
    if (s > 60 && s < 340 && Math.floor(s / 12) % 3 === 0) {
      const lat = halfW + 3.0;
      const lx = smp.pos.x + smp.flatRight.x * lat;
      const lz = smp.pos.z + smp.flatRight.z * lat;
      const ly = terrain.getHeight(lx, lz);
      const lPole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 5.8, 8), darkIronMat);
      lPole.position.set(lx, ly + 2.8, lz);
      group.add(lPole);
      const lHead = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.35), gantryLedMat);
      lHead.position.set(lx - smp.flatRight.x * 0.6, ly + 5.7, lz - smp.flatRight.z * 0.6);
      lHead.rotation.y = yaw;
      group.add(lHead);
      const pt = new THREE.PointLight(0xffdca6, 0, 38, 1.4);
      pt.position.set(lx - smp.flatRight.x * 1.5, ly + 5.3, lz - smp.flatRight.z * 1.5);
      pt.visible = false;
      group.add(pt);
      nightLights.push(pt);
      propCountTotal += 2;
    }

    // Rustic Wooden Slatted Beach Dune Fencing running along the sand dunes (Ref 03!)
    {
      const lat = -(halfW + 13.5 + Math.sin(s * 0.03) * 3.5);
      const dx = smp.pos.x + smp.flatRight.x * lat;
      const dz = smp.pos.z + smp.flatRight.z * lat;
      const dy = terrain.getHeight(dx, dz);
      if (dy > 0.65) {
        const fenceGrp = new THREE.Group();
        fenceGrp.position.set(dx, dy, dz);
        fenceGrp.rotation.y = yaw + rng.range(-0.12, 0.12);
        // 8 wooden slats + twin wire rails per 5m section
        for (let sl = 0; sl < 8; sl++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, rng.range(0.95, 1.25), 0.14), woodMat);
          slat.position.set(0, 0.45, (sl - 3.5) * 0.65);
          slat.rotation.z = rng.range(-0.08, 0.08);
          slat.castShadow = true;
          fenceGrp.add(slat);
        }
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 5.2), woodMat);
        rail1.position.set(0, 0.35, 0);
        fenceGrp.add(rail1);
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 5.2), woodMat);
        rail2.position.set(0, 0.78, 0);
        fenceGrp.add(rail2);
        group.add(fenceGrp);
        propCountTotal += 2;
      }
    }
  }

  // Sculpted Coastal Limestone Sea Boulders along the Z1 shallow water & shoreline (Ref 04!)
  // Uses smooth deterministic direction-based displacement so shared seam vertices stay 100% watertight (ZERO spikes!)
  const makeBoulderGeom = (r: number, seed: number) => {
    const g = new THREE.IcosahedronGeometry(r, 3);
    const pos = g.attributes.position;
    const p1 = seed * 0.73;
    const p2 = seed * 1.19;
    const p3 = seed * 2.07;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
      const len = Math.hypot(vx, vy, vz) || 1;
      const nx = vx / len, ny = vy / len, nz = vz / len;
      const nA = Math.sin(nx * 2.6 + p1) * Math.cos(nz * 2.4 - p2);
      const nB = Math.sin((nx * 1.8 - ny * 2.1 + nz * 1.5) * 2.2 + p3) * 0.45;
      const warp = 0.86 + 0.16 * nA + 0.08 * nB;
      // Flatten underside & slightly dome top like weathered coastal limestone!
      const flatY = ny < 0 ? 0.58 : 0.72;
      pos.setXYZ(i, vx * warp, vy * warp * flatY, vz * warp);
    }
    g.computeVertexNormals();
    return g;
  };

  for (let i = 0; i < 22; i++) {
    const s = 35 + i * 28 + rng.range(-8, 8);
    const smp = track.sampleAtS(s);
    // Find exact waterline on -1 (west sea) side by stepping outward until terrain.getHeight < 0.15
    let lat = -(smp.width * 0.5 + 22);
    for (let step = 0; step < 30; step++) {
      const tx = smp.pos.x + smp.flatRight.x * lat;
      const tz = smp.pos.z + smp.flatRight.z * lat;
      const th = terrain.getHeight(tx, tz);
      if (th < 0.05 && th > -1.9) break;
      lat -= 2.5;
    }
    const rx = smp.pos.x + smp.flatRight.x * (lat + rng.range(-5, 3));
    const rz = smp.pos.z + smp.flatRight.z * (lat + rng.range(-5, 3));
    const rad = rng.range(1.6, 4.2);
    const bMesh = new THREE.Mesh(makeBoulderGeom(rad, 800 + i), cliffRockMat);
    bMesh.position.set(rx, -0.15 + rng.range(-0.2, 0.45), rz);
    bMesh.rotation.y = rng.range(0, Math.PI * 2);
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    group.add(bMesh);
    coastalRocks.push({ x: rx, z: rz, radius: rad * 0.92 });
    propCountTotal++;
  }

  // Moored Mediterranean Sailboats & Fishing Boats bobbing gently in the turquoise bay!
  const hullWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.35, metalness: 0.05 });
  const hullNavyMat = new THREE.MeshStandardMaterial({ color: 0x1b3c5c, roughness: 0.38 });
  for (let b = 0; b < 7; b++) {
    const bx = -105 - rng.range(25, 110);
    const bz = -240 + b * 82 + rng.range(-18, 18);
    const boat = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 6.8), b % 2 === 0 ? hullWhiteMat : hullNavyMat);
    hull.position.y = 0.25;
    boat.add(hull);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.85, 2.4), hullWhiteMat);
    cabin.position.set(0, 1.05, 0.4);
    boat.add(cabin);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 7.6, 8), steelMat);
    mast.position.set(0, 4.3, -0.4);
    boat.add(mast);
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 5.4), hullWhiteMat);
    sail.position.set(0, 4.4, 1.0);
    sail.rotation.y = Math.PI / 2;
    boat.add(sail);
    boat.position.set(bx, 0.0, bz);
    boat.rotation.y = rng.range(0, Math.PI * 2);
    group.add(boat);
    boats.push({ mesh: boat, baseY: 0.0, phase: b * 1.3 });
    propCountTotal += 2;
  }

  // ===========================================================================
  // 3. Z2 CLIFFSIDE: Smooth Continuous Extruded W-Beam Steel Guardrail w/ Concrete Footings,
  //    Chevron Signs & Sculpted Cliff Scree Buttresses on the Inner Cliff Wall!
  // ===========================================================================
  const z2 = track.spec.zones[1];
  const railPostGeom = new THREE.BoxGeometry(0.11, 1.02, 0.11);
  const footingGeom = new THREE.BoxGeometry(0.36, 0.34, 0.36);

  // Build smooth continuous W-beam steel guardrail ribbons following exact road grade & curve (ZERO staircasing!)
  const addContinuousGuardrail = (sStart: number, sEnd: number, side: -1 | 1) => {
    const steps = Math.max(8, Math.ceil((sEnd - sStart) / 3.0));
    // 5-vertex W-beam cross-section profile [lateralOffset, yOffsetAboveRoad]
    const prof: Array<[number, number]> = [
      [0.0, 0.48],
      [-0.08 * side, 0.56],
      [0.02 * side, 0.65],
      [-0.08 * side, 0.74],
      [0.0, 0.82],
      [0.09 * side, 0.82],
      [0.09 * side, 0.48],
    ];
    const pN = prof.length;
    const pos: number[] = [];
    const idx: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const s = sStart + (i / steps) * (sEnd - sStart);
      const smp = track.sampleAtS(s);
      const halfW = smp.width * 0.5;
      const baseLat = side * (halfW + 1.32);
      const baseY = track.roadSurfaceY(smp, side * halfW);
      for (let p = 0; p < pN; p++) {
        const lat = baseLat + prof[p][0];
        const px = smp.pos.x + smp.flatRight.x * lat;
        const pz = smp.pos.z + smp.flatRight.z * lat;
        const py = baseY + prof[p][1];
        pos.push(px, py, pz);
      }
    }
    for (let i = 0; i < steps; i++) {
      for (let p = 0; p < pN; p++) {
        const pNext = (p + 1) % pN;
        const a = i * pN + p;
        const b = i * pN + pNext;
        const d = (i + 1) * pN + p;
        const e = (i + 1) * pN + pNext;
        idx.push(a, d, b, b, d, e);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const mesh = new THREE.Mesh(g, steelMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  // Sea-facing overlook segments along Z2 (matching terrain.ts seaSide!)
  addContinuousGuardrail(z2.startS - 12, 1172, -1);
  addContinuousGuardrail(1176, 1372, 1);
  addContinuousGuardrail(1376, z2.endS + 10, -1);

  for (let s = z2.startS - 12; s < z2.endS + 10; s += 4.2) {
    const smp = track.sampleAtS(s);
    const halfW = smp.width * 0.5;
    const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
    const seaSide: -1 | 1 = s >= 1175 && s <= 1375 ? 1 : -1;

    // Guardrail support posts + grounded concrete footings along seaSide!
    {
      const lat = seaSide * (halfW + 1.38);
      const gx = smp.pos.x + smp.flatRight.x * lat;
      const gz = smp.pos.z + smp.flatRight.z * lat;
      const gy = track.roadSurfaceY(smp, seaSide * halfW);

      const post = new THREE.Mesh(railPostGeom, darkIronMat);
      post.position.set(gx, gy + 0.34, gz);
      post.rotation.y = yaw;
      post.castShadow = true;
      group.add(post);

      const foot = new THREE.Mesh(footingGeom, concreteMat);
      foot.position.set(gx, gy - 0.10, gz);
      foot.rotation.y = yaw;
      group.add(foot);
      propCountTotal++;
    }

    // Reflective yellow chevron corner signs on tight cliff curves!
    if (Math.abs(smp.curvature) > 0.011 && Math.floor(s / 4.2) % 3 === 0) {
      const outerSide = smp.curvature > 0 ? -1 : 1;
      const lat = outerSide * (halfW + 2.35);
      const cx = smp.pos.x + smp.flatRight.x * lat;
      const cz = smp.pos.z + smp.flatRight.z * lat;
      const cy = terrain.getHeight(cx, cz);
      const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.75, 6), darkIronMat);
      signPole.position.set(cx, cy + 0.85, cz);
      group.add(signPole);
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.56, 0.06), chevronMat);
      board.position.set(cx, cy + 1.55, cz);
      board.rotation.y = yaw;
      group.add(board);
      propCountTotal += 2;
    }

    // Sculpted Limestone Scree Boulders bridging inner cliff base to gravel shoulder (-seaSide, cleanly outside 3m exclusion!)
    if (Math.floor(s / 4.2) % 4 === 0) {
      const cliffSide = -seaSide;
      const lat = cliffSide * (halfW + rng.range(6.4, 13.5));
      const bx = smp.pos.x + smp.flatRight.x * lat;
      const bz = smp.pos.z + smp.flatRight.z * lat;
      const by = terrain.getHeight(bx, bz);
      const rad = rng.range(1.4, 3.0);
      const nearest = track.closestPointXZ(bx, bz, s);
      if (Math.abs(nearest.lateral) - nearest.sample.width * 0.5 - rad > 3.2) {
        const rock = new THREE.Mesh(makeBoulderGeom(rad, Math.floor(s * 7)), cliffRockMat);
        rock.position.set(bx, by + rad * 0.22, bz);
        rock.rotation.set(rng.range(-0.25, 0.25), rng.range(0, Math.PI * 2), rng.range(-0.25, 0.25));
        rock.castShadow = true;
        rock.receiveShadow = true;
        group.add(rock);
        obstacles.push({
          id: `cliff_boulder_${obstacles.length}`,
          kind: 'boulder',
          x: bx,
          y: by,
          z: bz,
          radius: rad,
          height: rad * 1.3,
          intentionalSink: true,
        });
        propCountTotal++;
      }
    }
  }

  // ===========================================================================
  // 4. Z3 VILLAGE PLAZA PAVING, SCULPTED FOUNTAIN, CAFE UMBRELLAS, PLANTERS & BOLLARDS!
  // ===========================================================================
  {
    const pc = terrain.getPlazaCenter();
    const py = terrain.getHeight(pc.x, pc.z);

    // Circular Mediterranean stone plaza courtyard slab flush with terrain
    const plazaDisc = new THREE.Mesh(new THREE.CylinderGeometry(track.spec.plaza.radius - 1.5, track.spec.plaza.radius, 0.45, 32), plazaStoneMat);
    plazaDisc.position.set(pc.x, py - 0.14, pc.z);
    plazaDisc.receiveShadow = true;
    group.add(plazaDisc);

    // Tiered Stone Plaza Fountain Centerpiece!
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.95, 16), concreteMat);
    basin.position.set(pc.x, py + 0.48, pc.z);
    basin.castShadow = true;
    basin.receiveShadow = true;
    group.add(basin);
    const fWater = new THREE.Mesh(
      new THREE.CylinderGeometry(3.05, 3.05, 0.1, 16),
      new THREE.MeshPhysicalMaterial({ color: 0x26a8b2, roughness: 0.08, clearcoat: 1.0 })
    );
    fWater.position.set(pc.x, py + 0.88, pc.z);
    group.add(fWater);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 2.4, 12), concreteMat);
    pillar.position.set(pc.x, py + 1.6, pc.z);
    pillar.castShadow = true;
    group.add(pillar);
    const upperBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 0.65, 0.55, 14), concreteMat);
    upperBowl.position.set(pc.x, py + 2.65, pc.z);
    group.add(upperBowl);

    // Plaza Mediterranean Cafe Umbrellas & Wooden Benches
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const ux = pc.x + Math.cos(a) * 8.6;
      const uz = pc.z + Math.sin(a) * 8.6;
      const uPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8), woodMat);
      uPole.position.set(ux, py + 1.25, uz);
      group.add(uPole);
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.65, 8), k % 2 === 0 ? bannerRedMat : bannerGoldMat);
      canopy.position.set(ux, py + 2.55, uz);
      canopy.castShadow = true;
      group.add(canopy);
      const tbl = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 12), woodMat);
      tbl.position.set(ux, py + 0.82, uz);
      group.add(tbl);
      propCountTotal += 3;
    }

    // Z3 Sidewalk Stone Bollards, Wooden Benches & Terracotta Street Planters every 14m!
    const z3 = track.spec.zones[2];
    const bollardGeom = new THREE.CylinderGeometry(0.11, 0.14, 0.82, 8);
    const planterGeom = new THREE.CylinderGeometry(0.38, 0.28, 0.52, 8);
    const planterMat = new THREE.MeshStandardMaterial({ color: 0xb85e3c, roughness: 0.86 });
    const planterBushMat = new THREE.MeshStandardMaterial({
      color: 0x5c7c44,
      map: assets.textures.cluster_shrub.map,
      alphaTest: 0.35,
      roughness: 0.90,
      side: THREE.DoubleSide,
    });
    const bushCardGeom = new THREE.PlaneGeometry(0.75, 0.65);
    const benchSeatGeom = new THREE.BoxGeometry(1.85, 0.10, 0.55);

    for (let s = z3.startS + 6; s < z3.endS - 6; s += 11) {
      const smp = track.sampleAtS(s);
      const halfW = smp.width * 0.5;
      const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
      for (const side of [-1, 1] as const) {
        const latB = side * (halfW + 0.55);
        const bx = smp.pos.x + smp.flatRight.x * latB;
        const bz = smp.pos.z + smp.flatRight.z * latB;
        const by = track.roadSurfaceY(smp, side * halfW) + 0.14;
        const bol = new THREE.Mesh(bollardGeom, darkIronMat);
        bol.position.set(bx, by + 0.40, bz);
        bol.castShadow = true;
        group.add(bol);
        propCountTotal++;

        if (Math.floor(s / 11) % 2 === 0) {
          const latP = side * (halfW + 2.3);
          const px = smp.pos.x + smp.flatRight.x * latP;
          const pz = smp.pos.z + smp.flatRight.z * latP;
          const planter = new THREE.Mesh(planterGeom, planterMat);
          planter.position.set(px, by + 0.26, pz);
          planter.castShadow = true;
          group.add(planter);
          // Crossed photographic Mediterranean rosemary/olive greenery sprouting from terracotta pot!
          for (let g = 0; g < 2; g++) {
            const bush = new THREE.Mesh(bushCardGeom, planterBushMat);
            bush.position.set(px, by + 0.72, pz);
            bush.rotation.y = yaw + g * (Math.PI * 0.5);
            group.add(bush);
          }
          propCountTotal++;
        } else if (side === -1 && Math.floor(s / 11) % 3 === 1) {
          const latBench = -(halfW + 2.25);
          const bx2 = smp.pos.x + smp.flatRight.x * latBench;
          const bz2 = smp.pos.z + smp.flatRight.z * latBench;
          const bench = new THREE.Mesh(benchSeatGeom, woodMat);
          bench.position.set(bx2, by + 0.48, bz2);
          bench.rotation.y = yaw + Math.PI * 0.5;
          bench.castShadow = true;
          group.add(bench);
          propCountTotal++;
        }
      }
    }
  }

  // ===========================================================================
  // 5. Z4 ANCHORED STONE-AND-CONCRETE COASTAL VIADUCT BRIDGE (Ref 14!) + Forest Props!
  //    Heavy tapered masonry piers rooted deep in carved ravine floor, wing-wall abutments
  //    buried cleanly into terrain approaches, underside box girder, stone parapets & bridge lamps!
  // ===========================================================================
  {
    const br = track.spec.bridge;
    const bridgeSegs = 28;
    const brLen = br.endS - br.startS;

    // Continuous concrete bridge underside box-girder + left/right stone parapets & steel rails!
    for (let i = 0; i < bridgeSegs; i++) {
      const s0 = br.startS + (i / bridgeSegs) * brLen;
      const s1 = br.startS + ((i + 1) / bridgeSegs) * brLen;
      const sMid = (s0 + s1) * 0.5;
      const smp = track.sampleAtS(sMid);
      const a = track.sampleAtS(s0);
      const b = track.sampleAtS(s1);
      const segLen = a.pos.distanceTo(b.pos) + 0.35;
      const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
      const pitch = Math.asin(Math.max(-0.3, Math.min(0.3, smp.tangent.y)));

      const deckGrp = new THREE.Group();
      deckGrp.position.copy(smp.pos);
      deckGrp.rotation.set(pitch, yaw, -smp.bankRad, 'YXZ');

      // Heavy underside box-girder soffit
      const girder = new THREE.Mesh(new THREE.BoxGeometry(smp.width + 1.6, br.deckThickness, segLen), concreteMat);
      girder.position.set(0, -br.deckThickness * 0.5 - 0.04, 0);
      girder.castShadow = true;
      girder.receiveShadow = true;
      deckGrp.add(girder);

      // Left & Right Stone/Concrete Safety Parapets + Top Steel Tubular Handrail
      for (const side of [-1, 1] as const) {
        const px = side * (smp.width * 0.5 + 0.58);
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.02, segLen), stoneMat);
        parapet.position.set(px, 0.42, 0);
        parapet.castShadow = true;
        parapet.receiveShadow = true;
        deckGrp.add(parapet);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.14, segLen), concreteMat);
        cap.position.set(px, 0.96, 0);
        deckGrp.add(cap);

        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, segLen, 6), darkIronMat);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(px, 1.24, 0);
        deckGrp.add(rail);
      }

      // Bridge lanterns every 4th segment
      if (i % 4 === 2) {
        for (const side of [-1, 1] as const) {
          const px = side * (smp.width * 0.5 + 0.62);
          const lPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 3.6, 8), darkIronMat);
          lPost.position.set(px, 2.7, 0);
          deckGrp.add(lPost);
          const lBulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), gantryLedMat);
          lBulb.position.set(px - side * 0.25, 4.45, 0);
          deckGrp.add(lBulb);
          if (side === 1) {
            const pt = new THREE.PointLight(0xffb858, 0, 36, 1.4);
            pt.position.set(px - 1.2, 4.2, 0);
            pt.visible = false;
            deckGrp.add(pt);
            nightLights.push(pt);
          }
        }
        propCountTotal += 4;
      }

      group.add(deckGrp);
      propCountTotal += 2;
    }

    // 4 Massive Tapered Stone-Clad Viaduct Piers rooted deeply into the carved ravine floor!
    const pierFracs = [0.20, 0.40, 0.60, 0.80];
    for (const f of pierFracs) {
      const sP = br.startS + f * brLen;
      const smp = track.sampleAtS(sP);
      const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
      const terrY = terrain.getHeight(smp.pos.x, smp.pos.z);
      const pierH = Math.max(4.0, smp.pos.y - terrY + 3.5);

      const pierGrp = new THREE.Group();
      pierGrp.position.set(smp.pos.x, smp.pos.y - br.deckThickness, smp.pos.z);
      pierGrp.rotation.y = yaw;

      // Twin tapered heavy piers + cross pier-cap beam
      const capBeam = new THREE.Mesh(new THREE.BoxGeometry(smp.width + 1.4, 1.3, 2.6), concreteMat);
      capBeam.position.set(0, -0.5, 0);
      capBeam.castShadow = true;
      pierGrp.add(capBeam);

      for (const sx of [-1, 1]) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.62, pierH, 10), stoneMat);
        col.position.set(sx * (smp.width * 0.34), -pierH * 0.5, 0);
        col.castShadow = true;
        col.receiveShadow = true;
        pierGrp.add(col);
      }
      // Cross masonry arch rib linking the twin pier shafts cleanly
      const tieBeam = new THREE.Mesh(new THREE.BoxGeometry(smp.width * 0.72, 1.6, 1.9), stoneMat);
      tieBeam.position.set(0, -pierH * 0.36, 0);
      tieBeam.castShadow = true;
      pierGrp.add(tieBeam);
      group.add(pierGrp);
      propCountTotal += 4;
    }

    // Sweeping Stone Viaduct Arch Ribs spanning between piers under the deck (Ref 14!)
    const spanFracs = [0.10, 0.30, 0.50, 0.70, 0.90];
    const spanLen = brLen * 0.20;
    for (const f of spanFracs) {
      const sSpan = br.startS + f * brLen;
      const smp = track.sampleAtS(sSpan);
      const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
      const pitch = Math.asin(Math.max(-0.3, Math.min(0.3, smp.tangent.y)));
      const archGrp = new THREE.Group();
      archGrp.position.copy(smp.pos);
      archGrp.rotation.set(pitch, yaw, -smp.bankRad, 'YXZ');
      // Semi-elliptical viaduct arch ring on both outer faces of the bridge
      const archR = spanLen * 0.48;
      const archGeom = new THREE.TorusGeometry(archR, 0.85, 8, 20, Math.PI);
      archGeom.rotateY(Math.PI / 2);
      archGeom.scale(1, 0.44, 1);
      for (const sx of [-1, 1]) {
        const archMesh = new THREE.Mesh(archGeom, stoneMat);
        archMesh.position.set(sx * (smp.width * 0.36), -br.deckThickness - archR * 0.44 + 0.45, 0);
        archMesh.castShadow = true;
        archMesh.receiveShadow = true;
        archGrp.add(archMesh);
      }
      group.add(archGrp);
      propCountTotal += 2;
    }

    // Heavy Stone/Concrete Wing-Wall Abutments burying BOTH bridge ends cleanly into terrain embankments (Ref 14!)
    for (const endS of [br.startS + 3, br.endS - 3]) {
      const smp = track.sampleAtS(endS);
      const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
      const abutGrp = new THREE.Group();
      abutGrp.position.set(smp.pos.x, smp.pos.y, smp.pos.z);
      abutGrp.rotation.y = yaw;
      const abut = new THREE.Mesh(new THREE.BoxGeometry(smp.width + 5.2, 13.0, 10.2), stoneMat);
      // Top sits at -1.0m cleanly underneath the -1.8m bridge deck soffit so sloped approaches never poke through!
      abut.position.set(0, -7.5, 0);
      abut.castShadow = true;
      abut.receiveShadow = true;
      abutGrp.add(abut);
      // Flared angled stone wing walls retaining the approach earthworks (kept safely below road edge!)
      for (const sx of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 6.2, 8.5), stoneMat);
        wing.position.set(sx * (smp.width * 0.5 + 3.4), -3.6, 0);
        wing.rotation.y = sx * 0.35;
        wing.castShadow = true;
        wing.receiveShadow = true;
        abutGrp.add(wing);
      }
      group.add(abutGrp);
      propCountTotal += 4;
    }
  }

  // Z4 Roadside Wooden Guide Posts & Guardrails along forest descent bends!
  const z4 = track.spec.zones[3];
  for (let s = z4.startS; s < z4.endS; s += 7.0) {
    const smp = track.sampleAtS(s);
    if (smp.isBridge) continue;
    const halfW = smp.width * 0.5;
    const yaw = Math.atan2(-smp.tangent.x, -smp.tangent.z);
    for (const side of [-1, 1] as const) {
      const lat = side * (halfW + 1.9);
      const gx = smp.pos.x + smp.flatRight.x * lat;
      const gz = smp.pos.z + smp.flatRight.z * lat;
      const gy = terrain.getHeight(gx, gz);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 1.15, 6), woodMat);
      post.position.set(gx, gy + 0.48, gz);
      post.castShadow = true;
      group.add(post);
      // Reflective white/amber marker collar
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.086, 0.14, 6), side === -1 ? chevronMat : gantryLedMat);
      collar.position.set(gx, gy + 0.88, gz);
      group.add(collar);
      // Outer curve timber-backed guardrail beam on fast forest sweepers
      if (Math.abs(smp.curvature) > 0.008 && side === (smp.curvature > 0 ? -1 : 1)) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 7.2), steelMat);
        rail.position.set(gx, gy + 0.65, gz);
        rail.rotation.y = yaw;
        group.add(rail);
      }
      propCountTotal += 2;
    }
  }

  const setNightMode = (isNight: boolean) => {
    gantryLedMat.emissiveIntensity = isNight ? 5.0 : 1.4;
    gantrySignMat.emissiveIntensity = isNight ? 1.8 : 0.4;
    for (const l of nightLights) {
      l.visible = isNight;
      l.intensity = isNight ? 48 : 0;
    }
  };

  const update = (timeSec: number) => {
    for (const b of boats) {
      b.mesh.position.y = b.baseY + Math.sin(timeSec * 1.4 + b.phase) * 0.14;
      b.mesh.rotation.z = Math.sin(timeSec * 1.1 + b.phase) * 0.045;
      b.mesh.rotation.x = Math.cos(timeSec * 0.9 + b.phase) * 0.025;
    }
  };

  // Batch all static props, walls, fences, boulders & bridge masonry by material while keeping bobbing boats dynamic!
  const dynamicBoatSet = new Set<THREE.Object3D>(boats.map((b) => b.mesh));
  mergeStaticGroupByMaterial(group, dynamicBoatSet);

  const propsPer100m = Math.round((propCountTotal / (track.length / 100)) * 10) / 10;

  return {
    group,
    coastalRocks,
    obstacles,
    propCountTotal,
    propsPer100m,
    setNightMode,
    update,
  };
}
