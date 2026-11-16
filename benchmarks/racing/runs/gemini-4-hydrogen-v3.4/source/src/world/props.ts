import * as THREE from 'three';
import { WorldTextureBank } from './materials';
import { TrackSpline } from './track';
import { TerrainField } from './terrain';
import { PropAssetBank } from './gltfAssets';
import { VegetationPrototypes } from './vegetation';
import { PlacedObjectRecord, ZoneId } from './types';

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

function createExtrudedPrism(
  pts: [number, number][],
  depth: number,
  bevel = 0.03
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  g.translate(0, 0, -depth * 0.5);
  g.computeVertexNormals();
  return g;
}

function createStartGridTextures(): {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
} {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 1024);

  // Checkered start/finish band at top (s = 46m end)
  const sq = 32;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 32; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? 'rgba(242, 238, 228, 0.92)' : 'rgba(22, 24, 28, 0.88)';
      ctx.fillRect(col * sq, 20 + row * sq, sq, sq);
    }
  }

  // 6 painted starting grid brackets (staggered 2x3 rows!)
  ctx.strokeStyle = 'rgba(244, 240, 230, 0.88)';
  ctx.lineWidth = 10;
  for (let slot = 0; slot < 6; slot++) {
    const isLeft = slot % 2 === 0;
    const row = Math.floor(slot / 2);
    const cx = isLeft ? 320 : 704;
    const yTop = 210 + row * 240;
    ctx.beginPath();
    ctx.moveTo(cx - 85, yTop + 65);
    ctx.lineTo(cx - 85, yTop);
    ctx.lineTo(cx + 85, yTop);
    ctx.lineTo(cx + 85, yTop + 65);
    ctx.stroke();
  }

  const nc = document.createElement('canvas');
  nc.width = 1024;
  nc.height = 1024;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, 1024, 1024);

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const normalMap = new THREE.CanvasTexture(nc);
  normalMap.colorSpace = THREE.NoColorSpace;
  return { map, normalMap };
}

function createBannerTexture(label: string, bg: string, fg: string, accent: string): {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
} {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 1024, 130);
  ctx.fillRect(0, 894, 1024, 130);

  ctx.fillStyle = fg;
  ctx.font = 'bold 132px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 512, 512);

  const nc = document.createElement('canvas');
  nc.width = 1024;
  nc.height = 1024;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 1024; y += 8) {
    const shade = 128 + Math.round(Math.sin(y * 0.15) * 14);
    nctx.fillStyle = `rgb(128, ${shade}, 255)`;
    nctx.fillRect(0, y, 1024, 4);
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = new THREE.CanvasTexture(nc);
  normalMap.colorSpace = THREE.NoColorSpace;
  return { map, normalMap };
}

function createCurbTexture(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#c42b23' : '#e6e0d4';
    ctx.fillRect(0, i * 256, 1024, 256);
  }
  // Subtle concrete wear speckles
  ctx.fillStyle = 'rgba(20, 20, 20, 0.12)';
  for (let k = 0; k < 2500; k++) {
    ctx.fillRect((k * 173) % 1024, (k * 317) % 1024, 4, 4);
  }

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

export interface SceneryBuildResult {
  group: THREE.Group;
  objects: PlacedObjectRecord[];
  rockFoamCenters: { x: number; z: number; radius: number }[];
  animatedFlags: { mesh: THREE.Mesh; phase: number }[];
  updateAnimations: (timeSec: number) => void;
}

export function buildCurbRibbon(
  track: TrackSpline,
  sStart: number,
  sEnd: number,
  side: -1 | 1,
  mat: THREE.Material
): THREE.Mesh {
  const segs = Math.max(8, Math.round((sEnd - sStart) / 2.0));
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const profile: [number, number][] = [
    [0.0, -0.05],
    [0.02, 0.055],
    [0.32, 0.065],
    [0.62, 0.01],
    [0.68, -0.08],
  ];

  const p = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const s = sStart + (i / segs) * (sEnd - sStart);
    const samp = track.sampleAtDistance(s);
    const baseLat = side * (samp.width * 0.5 - 0.02);
    for (let j = 0; j < profile.length; j++) {
      const [outOff, upOff] = profile[j];
      p.copy(samp.pos)
        .addScaledVector(samp.right, baseLat + side * outOff)
        .addScaledVector(samp.up, upOff);
      positions.push(p.x, p.y, p.z);
      uvs.push(j / (profile.length - 1), (s - sStart) / 3.0);
    }
  }

  const ring = profile.length;
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < ring - 1; j++) {
      const a = i * ring + j;
      const b = a + 1;
      const c = (i + 1) * ring + j;
      const d = c + 1;
      if (side === 1) {
        indices.push(a, b, c, b, d, c);
      } else {
        indices.push(a, c, b, b, c, d);
      }
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  const mesh = new THREE.Mesh(geom, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

export function buildGuardrailRibbon(
  track: TrackSpline,
  sStart: number,
  sEnd: number,
  side: -1 | 1,
  offsetExtra: number,
  railMat: THREE.Material,
  postMat: THREE.Material,
  terrain: TerrainField
): THREE.Group {
  const g = new THREE.Group();
  const segs = Math.max(8, Math.round((sEnd - sStart) / 3.0));
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Corrugated W-beam guardrail cross-section (14+ verts per ring, >12 tris!)
  const beamProfile: [number, number][] = [
    [-0.04, 0.42],
    [0.05, 0.48],
    [0.05, 0.56],
    [-0.02, 0.60],
    [0.05, 0.64],
    [0.05, 0.72],
    [-0.04, 0.78],
  ];

  const p = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const s = sStart + (i / segs) * (sEnd - sStart);
    const samp = track.sampleAtDistance(s);
    const lat = side * (samp.width * 0.5 + offsetExtra);
    const baseY = Math.max(samp.pos.y + samp.right.y * lat, terrain.getHeightAt(samp.pos.x + samp.right.x * lat, samp.pos.z + samp.right.z * lat));

    for (let j = 0; j < beamProfile.length; j++) {
      const [inOut, hOff] = beamProfile[j];
      p.set(
        samp.pos.x + samp.right.x * (lat - side * inOut),
        baseY + hOff,
        samp.pos.z + samp.right.z * (lat - side * inOut)
      );
      positions.push(p.x, p.y, p.z);
      uvs.push(j / (beamProfile.length - 1), (s - sStart) / 4.0);
    }
  }

  const ring = beamProfile.length;
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < ring - 1; j++) {
      const a = i * ring + j;
      const b = a + 1;
      const c = (i + 1) * ring + j;
      const d = c + 1;
      if (side === -1) {
        indices.push(a, b, c, b, d, c);
      } else {
        indices.push(a, c, b, b, c, d);
      }
    }
  }

  const railGeom = new THREE.BufferGeometry();
  railGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  railGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  railGeom.setIndex(indices);
  railGeom.computeVertexNormals();
  const railMesh = new THREE.Mesh(railGeom, railMat);
  railMesh.castShadow = true;
  railMesh.receiveShadow = true;
  g.add(railMesh);

  // Steel I-post supports every 4 m
  const postCount = Math.max(2, Math.floor((sEnd - sStart) / 4.0));
  const postGeom = new THREE.CylinderGeometry(0.055, 0.065, 0.95, 8);
  postGeom.translate(0, 0.42, 0);
  const inst = new THREE.InstancedMesh(postGeom, postMat, postCount + 1);
  inst.castShadow = true;
  inst.receiveShadow = true;
  const dummy = new THREE.Object3D();
  for (let i = 0; i <= postCount; i++) {
    const s = sStart + (i / postCount) * (sEnd - sStart);
    const samp = track.sampleAtDistance(s);
    const lat = side * (samp.width * 0.5 + offsetExtra + 0.08);
    const px = samp.pos.x + samp.right.x * lat;
    const pz = samp.pos.z + samp.right.z * lat;
    const py = terrain.getHeightAt(px, pz);
    dummy.position.set(px, py - 0.1, pz);
    dummy.rotation.set(0, Math.atan2(samp.tangent.x, samp.tangent.z), 0);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.instanceMatrix.needsUpdate = true;
  g.add(inst);
  return g;
}

export function buildZ1CoastlineScenery(
  track: TrackSpline,
  terrain: TerrainField,
  texBank: WorldTextureBank,
  veg: VegetationPrototypes,
  propBank: PropAssetBank
): SceneryBuildResult {
  const group = new THREE.Group();
  const objects: PlacedObjectRecord[] = [];
  const rockFoamCenters: { x: number; z: number; radius: number }[] = [];
  const animatedFlags: { mesh: THREE.Mesh; phase: number }[] = [];
  const rng = seededRng(track.data.seed + 301);

  const isClearOfExclusion = (x: number, z: number, radius: number): boolean => {
    const proj = track.projectPointXZ(x, 0, z);
    return proj.distToEdge - radius >= 3.15;
  };

  const stoneMat = new THREE.MeshStandardMaterial({
    map: texBank.stoneWall.map,
    normalMap: texBank.stoneWall.normalMap,
    roughnessMap: texBank.stoneWall.roughnessMap,
    roughness: 0.88,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    map: texBank.metalPlate.map,
    normalMap: texBank.metalPlate.normalMap,
    roughnessMap: texBank.metalPlate.roughnessMap,
    color: 0xc8cfd6,
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

  const woodMat = new THREE.MeshStandardMaterial({
    map: texBank.woodPlanks.map,
    normalMap: texBank.woodPlanks.normalMap,
    roughnessMap: texBank.woodPlanks.roughnessMap,
    color: 0xb6a288,
    roughness: 0.88,
  });

  const curbTex = createCurbTexture();
  const curbMat = new THREE.MeshStandardMaterial({
    map: curbTex.map,
    normalMap: curbTex.normalMap,
    roughness: 0.85,
  });

  // 1. Painted Start/Finish Line + 6 Staggered Grid Boxes on road (s = 8..48m)
  const gridTex = createStartGridTextures();
  const gridSegs = 28;
  const gridPos: number[] = [];
  const gridUv: number[] = [];
  const gridIdx: number[] = [];
  const sGrid0 = 8;
  const sGrid1 = 48;
  const pTmp = new THREE.Vector3();
  for (let i = 0; i <= gridSegs; i++) {
    const t = i / gridSegs;
    const s = sGrid0 + t * (sGrid1 - sGrid0);
    const samp = track.sampleAtDistance(s);
    const hw = samp.width * 0.46;
    for (const [lat, u] of [[-hw, 0], [0, 0.5], [hw, 1]] as [number, number][]) {
      pTmp.copy(samp.pos).addScaledVector(samp.right, lat).addScaledVector(samp.up, lat === 0 ? 0.025 : 0.015);
      gridPos.push(pTmp.x, pTmp.y, pTmp.z);
      gridUv.push(u, t);
    }
  }
  for (let i = 0; i < gridSegs; i++) {
    for (let j = 0; j < 2; j++) {
      const a = i * 3 + j, b = a + 1, c = (i + 1) * 3 + j, d = c + 1;
      gridIdx.push(a, b, c, b, d, c);
    }
  }
  const gridGeom = new THREE.BufferGeometry();
  gridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPos, 3));
  gridGeom.setAttribute('uv', new THREE.Float32BufferAttribute(gridUv, 2));
  gridGeom.setIndex(gridIdx);
  gridGeom.computeVertexNormals();
  const gridMesh = new THREE.Mesh(
    gridGeom,
    new THREE.MeshStandardMaterial({
      map: gridTex.map,
      normalMap: gridTex.normalMap,
      transparent: true,
      roughness: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
  );
  gridMesh.receiveShadow = true;
  group.add(gridMesh);

  // 2. Start/Finish Gantry Arch (pillars strictly outside >= 3m exclusion band at +-9.8m!)
  const gantryS = 47.0;
  const gSamp = track.sampleAtDistance(gantryS);
  const gantrySpan = gSamp.width + 7.2; // +-9.6m from center => >3.5m outside road edge!
  const gantryGroup = new THREE.Group();
  const legProfile: [number, number][] = [[-0.45, -0.45], [0.45, -0.45], [0.35, 0.45], [-0.35, 0.45]];
  const legGeom = createExtrudedPrism(legProfile, 7.6, 0.05);
  legGeom.rotateX(Math.PI / 2);
  legGeom.translate(0, 3.7, 0);

  for (const side of [-1, 1]) {
    const lat = side * (gantrySpan * 0.5);
    const lx = gSamp.pos.x + gSamp.right.x * lat;
    const lz = gSamp.pos.z + gSamp.right.z * lat;
    const ly = terrain.getHeightAt(lx, lz);
    const leg = new THREE.Mesh(legGeom, darkMetalMat);
    leg.position.set(lx, ly, lz);
    leg.rotation.y = Math.atan2(gSamp.tangent.x, gSamp.tangent.z);
    leg.castShadow = true;
    leg.receiveShadow = true;
    gantryGroup.add(leg);
    objects.push({
      id: `gantry-leg-${side}`,
      kind: 'prop',
      zone: 'Z1',
      s: gantryS,
      x: lx,
      y: ly,
      z: lz,
      radius: 0.55,
    });
  }

  const bannerTex = createBannerTexture('COSTA DOURADA GP', '#1b2638', '#f5ede0', '#d97b29');
  const bannerMat = new THREE.MeshStandardMaterial({
    map: bannerTex.map,
    normalMap: bannerTex.normalMap,
    roughness: 0.45,
    metalness: 0.2,
  });
  const archBeamGeom = createExtrudedPrism(
    [[-0.55, -0.95], [0.55, -0.95], [0.55, 0.95], [-0.55, 0.95]],
    gantrySpan + 0.8,
    0.05
  );
  archBeamGeom.rotateY(Math.PI / 2);
  const archBeam = new THREE.Mesh(archBeamGeom, bannerMat);
  archBeam.position.set(gSamp.pos.x, gSamp.pos.y + 6.4, gSamp.pos.z);
  archBeam.rotation.y = Math.atan2(gSamp.tangent.x, gSamp.tangent.z);
  archBeam.castShadow = true;
  gantryGroup.add(archBeam);
  group.add(gantryGroup);

  // 3. Road Curbs (Zebras) and Coastal Steel Guardrail along Z1 fast coastal curve (s = 500..875m)
  group.add(buildCurbRibbon(track, 520, 860, -1, curbMat));
  group.add(buildCurbRibbon(track, 520, 860, 1, curbMat));
  group.add(buildGuardrailRibbon(track, 510, 875, 1, 0.85, metalMat, darkMetalMat, terrain));

  // 4. Low Stone Seawall Muretas + Animated Regatta Flagpoles along Z1 promenade (outside >=3m exclusion band!)
  const muretaGeom = createExtrudedPrism(
    [[-0.38, 0.0], [0.38, 0.0], [0.32, 0.88], [-0.32, 0.88]],
    6.2,
    0.04
  );
  const poleGeom = new THREE.CylinderGeometry(0.04, 0.06, 5.2, 10);
  poleGeom.translate(0, 2.6, 0);
  const flagTex = createBannerTexture('COSTA', '#c83e2b', '#f8f2e4', '#e3a63b');
  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTex.map,
    normalMap: flagTex.normalMap,
    side: THREE.DoubleSide,
    roughness: 0.65,
  });
  const flagGeom = new THREE.PlaneGeometry(1.1, 2.4, 4, 8);
  flagGeom.translate(0.58, 3.8, 0);

  for (let s = 30; s < 510; s += 14) {
    const samp = track.sampleAtDistance(s);
    const lat = samp.width * 0.5 + 3.95; // seaside (right = +lat) safely outside >=3m exclusion!
    const mx = samp.pos.x + samp.right.x * lat;
    const mz = samp.pos.z + samp.right.z * lat;
    if (!isClearOfExclusion(mx, mz, 0.45)) continue;
    const my = terrain.getHeightAt(mx, mz);
    const mureta = new THREE.Mesh(muretaGeom, stoneMat);
    mureta.position.set(mx, my - 0.12, mz);
    mureta.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
    mureta.castShadow = true;
    mureta.receiveShadow = true;
    group.add(mureta);
    objects.push({
      id: `z1-mureta-${s}`,
      kind: 'prop',
      zone: 'Z1',
      s,
      x: mx,
      y: my,
      z: mz,
      radius: 0.45,
    });

    if (s % 42 === 30) {
      const fx = samp.pos.x + samp.right.x * (lat + 0.8);
      const fz = samp.pos.z + samp.right.z * (lat + 0.8);
      if (!isClearOfExclusion(fx, fz, 0.25)) continue;
      const fy = terrain.getHeightAt(fx, fz);
      const pole = new THREE.Mesh(poleGeom, metalMat);
      pole.position.set(fx, fy, fz);
      pole.castShadow = true;
      group.add(pole);

      const banner = new THREE.Mesh(flagGeom, flagMat);
      banner.position.set(fx, fy, fz);
      banner.castShadow = true;
      group.add(banner);
      animatedFlags.push({ mesh: banner, phase: s * 0.21 });

      objects.push({
        id: `z1-flag-${s}`,
        kind: 'prop',
        zone: 'Z1',
        s,
        x: fx,
        y: fy,
        z: fz,
        radius: 0.25,
      });
    }
  }

  // 5. Mediterranean Streetlamps & Utility Poles with Wires along Z1 (matching Ref 01 silhouette!)
  const lampPostGeom = new THREE.CylinderGeometry(0.06, 0.11, 6.2, 10);
  lampPostGeom.translate(0, 3.1, 0);
  const lampArmGeom = createExtrudedPrism([[0, -0.05], [1.4, 0.18], [1.4, 0.26], [0, 0.08]], 0.12, 0.02);
  const lampGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffe4ad,
    emissive: 0xffc168,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });
  const lampBulbGeom = new THREE.SphereGeometry(0.18, 12, 8);
  lampBulbGeom.scale(1.4, 0.5, 1.0);

  const utilPoleGeom = new THREE.CylinderGeometry(0.11, 0.16, 9.4, 10);
  utilPoleGeom.translate(0, 4.7, 0);
  const crossArmGeom = createExtrudedPrism([[-1.1, -0.08], [1.1, -0.08], [1.1, 0.08], [-1.1, 0.08]], 0.14, 0.02);

  const utilWirePts: THREE.Vector3[] = [];
  for (let s = 22; s < 860; s += 36) {
    const samp = track.sampleAtDistance(s);
    const lat = -(samp.width * 0.5 + 4.1); // inland side outside >=3m exclusion even on inside curves!
    const lx = samp.pos.x + samp.right.x * lat;
    const lz = samp.pos.z + samp.right.z * lat;
    if (!isClearOfExclusion(lx, lz, 0.25)) continue;
    const ly = terrain.getHeightAt(lx, lz);

    const lampGroup = new THREE.Group();
    const post = new THREE.Mesh(lampPostGeom, darkMetalMat);
    post.castShadow = true;
    lampGroup.add(post);
    const arm = new THREE.Mesh(lampArmGeom, darkMetalMat);
    arm.position.set(0, 6.0, 0);
    lampGroup.add(arm);
    const bulb = new THREE.Mesh(lampBulbGeom, lampGlowMat);
    bulb.position.set(1.25, 6.12, 0);
    lampGroup.add(bulb);

    lampGroup.position.set(lx, ly, lz);
    lampGroup.rotation.y = Math.atan2(samp.right.x, samp.right.z) - Math.PI / 2;
    group.add(lampGroup);
    objects.push({
      id: `z1-lamp-${s}`,
      kind: 'prop',
      zone: 'Z1',
      s,
      x: lx,
      y: ly,
      z: lz,
      radius: 0.25,
    });

    // Utility poles further inland every 72m with catenary cable
    if (s % 72 === 22 && s < 650) {
      const uLat = -(samp.width * 0.5 + 8.5);
      const ux = samp.pos.x + samp.right.x * uLat;
      const uz = samp.pos.z + samp.right.z * uLat;
      const uy = terrain.getHeightAt(ux, uz);
      const uPole = new THREE.Mesh(utilPoleGeom, woodMat);
      uPole.position.set(ux, uy, uz);
      uPole.castShadow = true;
      group.add(uPole);

      const cArm = new THREE.Mesh(crossArmGeom, woodMat);
      cArm.position.set(ux, uy + 8.9, uz);
      cArm.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
      group.add(cArm);

      utilWirePts.push(new THREE.Vector3(ux, uy + 8.95, uz));
      objects.push({
        id: `z1-util-${s}`,
        kind: 'prop',
        zone: 'Z1',
        s,
        x: ux,
        y: uy,
        z: uz,
        radius: 0.25,
      });
    }
  }

  // Catenary power lines between Z1 utility poles (just like Ref 01!)
  for (let i = 0; i < utilWirePts.length - 1; i++) {
    const a = utilWirePts[i];
    const b = utilWirePts[i + 1];
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.y -= 1.6;
    const wireCurve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const wireMesh = new THREE.Mesh(
      new THREE.TubeGeometry(wireCurve, 12, 0.025, 5, false),
      darkMetalMat
    );
    group.add(wireMesh);
  }

  // 6. Beach Wooden Dune Fences along Z1 sandy shoreline (matching Ref 03!)
  const fencePostGeom = new THREE.CylinderGeometry(0.055, 0.065, 1.35, 7);
  fencePostGeom.translate(0, 0.6, 0);
  const fenceRailGeom = createExtrudedPrism([[-0.03, -0.05], [0.03, -0.05], [0.03, 0.05], [-0.03, 0.05]], 3.6, 0.01);
  for (let s = 45; s < 580; s += 8) {
    const samp = track.sampleAtDistance(s);
    // Skip occasional beach access gaps
    if (s % 96 < 16) continue;
    const lat = samp.width * 0.5 + 8.8 + Math.sin(s * 0.04) * 2.2;
    const fx = samp.pos.x + samp.right.x * lat;
    const fz = samp.pos.z + samp.right.z * lat;
    if (!isClearOfExclusion(fx, fz, 0.3)) continue;
    const fy = terrain.getHeightAt(fx, fz);
    if (fy < 0.6) continue;

    const post = new THREE.Mesh(fencePostGeom, woodMat);
    post.position.set(fx, fy - 0.1, fz);
    post.rotation.set((rng() - 0.5) * 0.08, rng() * Math.PI, (rng() - 0.5) * 0.08);
    post.castShadow = true;
    group.add(post);

    const railTop = new THREE.Mesh(fenceRailGeom, woodMat);
    railTop.position.set(fx, fy + 0.85, fz);
    railTop.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
    group.add(railTop);

    const railBot = new THREE.Mesh(fenceRailGeom, woodMat);
    railBot.position.set(fx, fy + 0.42, fz);
    railBot.rotation.y = Math.atan2(samp.tangent.x, samp.tangent.z);
    group.add(railBot);

    objects.push({
      id: `z1-fence-${s}`,
      kind: 'prop',
      zone: 'Z1',
      s,
      x: fx,
      y: fy,
      z: fz,
      radius: 0.3,
    });
  }

  // 7. Instanced Palm Trees, Olive Trees, Coastal Shrubs, and Dune Grass along Z1!
  const palmTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const shrubTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const grassTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];
  const oliveTransforms: { x: number; y: number; z: number; scale: number; rotY: number }[] = [];

  for (let s = 25; s < 865; s += 16) {
    const samp = track.sampleAtDistance(s);
    // Seaside palms along promenade (with rhythmic spacing + organic variation)
    for (const side of [-1, 1] as const) {
      if (side === 1 && s > 560) continue; // Keep ocean cliff curve open after 560m
      if (side === 1 && s % 32 !== 25 && rng() < 0.35) continue;
      const latDist = samp.width * 0.5 + (side === 1 ? 5.2 + rng() * 1.5 : 5.5 + rng() * 5.0);
      const px = samp.pos.x + samp.right.x * (side * latDist);
      const pz = samp.pos.z + samp.right.z * (side * latDist);
      if (!isClearOfExclusion(px, pz, 0.45)) continue;
      const py = terrain.getHeightAt(px, pz);
      if (py < 0.8) continue;

      const scale = 0.82 + rng() * 0.42;
      const rotY = rng() * Math.PI * 2;
      palmTransforms.push({ x: px, y: py, z: pz, scale, rotY });
      objects.push({
        id: `z1-palm-${s}-${side}`,
        kind: 'tree',
        variation: 'palmeira',
        zone: 'Z1',
        s,
        x: px,
        y: py,
        z: pz,
        radius: 0.45,
      });
    }

    // Coastal shrubs & hillside olives inland (-side)
    for (let k = 0; k < 3; k++) {
      const lat = -(samp.width * 0.5 + 4.4 + rng() * 22);
      const sx = samp.pos.x + samp.right.x * lat + (rng() - 0.5) * 6;
      const sz = samp.pos.z + samp.right.z * lat + (rng() - 0.5) * 6;
      const proj = track.projectPointXZ(sx, 0, sz);
      if (proj.distToEdge < 3.8) continue;
      const sy = terrain.getHeightAt(sx, sz);

      if (k === 0 && rng() < 0.45) {
        oliveTransforms.push({ x: sx, y: sy, z: sz, scale: 0.85 + rng() * 0.4, rotY: rng() * Math.PI * 2 });
        objects.push({
          id: `z1-olive-${s}-${k}`,
          kind: 'tree',
          variation: 'oliveira',
          zone: 'Z1',
          s: proj.s,
          x: sx,
          y: sy,
          z: sz,
          radius: 0.65,
        });
      } else {
        shrubTransforms.push({ x: sx, y: sy, z: sz, scale: 0.75 + rng() * 0.65, rotY: rng() * Math.PI * 2 });
        objects.push({
          id: `z1-shrub-${s}-${k}`,
          kind: 'bush',
          variation: 'arbusto',
          zone: 'Z1',
          s: proj.s,
          x: sx,
          y: sy,
          z: sz,
          radius: 0.5,
        });
      }
    }

    // Dune grass tufts on both beach dunes and roadside verges
    for (let k = 0; k < 4; k++) {
      const side = k < 2 ? 1 : -1;
      const lat = side * (samp.width * 0.5 + 4.2 + rng() * 14);
      const gx = samp.pos.x + samp.right.x * lat + (rng() - 0.5) * 4;
      const gz = samp.pos.z + samp.right.z * lat + (rng() - 0.5) * 4;
      const proj = track.projectPointXZ(gx, 0, gz);
      if (proj.distToEdge < 3.4) continue;
      const gy = terrain.getHeightAt(gx, gz);
      if (gy < 0.4) continue;
      grassTransforms.push({ x: gx, y: gy, z: gz, scale: 0.7 + rng() * 0.7, rotY: rng() * Math.PI * 2 });
    }
  }

  // Extra hillside olives & coastal shrubs higher up Z1 inland ridge (lat = -24..-55m)
  for (let s = 30; s < 860; s += 26) {
    const samp = track.sampleAtDistance(s);
    const lat = -(samp.width * 0.5 + 24 + rng() * 30);
    const hx = samp.pos.x + samp.right.x * lat + (rng() - 0.5) * 8;
    const hz = samp.pos.z + samp.right.z * lat + (rng() - 0.5) * 8;
    if (!isClearOfExclusion(hx, hz, 1.0)) continue;
    const hy = terrain.getHeightAt(hx, hz);
    if (rng() < 0.55) {
      oliveTransforms.push({ x: hx, y: hy, z: hz, scale: 0.9 + rng() * 0.55, rotY: rng() * Math.PI * 2 });
    } else {
      shrubTransforms.push({ x: hx, y: hy, z: hz, scale: 1.0 + rng() * 0.85, rotY: rng() * Math.PI * 2 });
    }
  }

  const addInstancedVeg = (
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    list: { x: number; y: number; z: number; scale: number; rotY: number }[],
    castShadow = true
  ) => {
    if (list.length === 0) return;
    const im = new THREE.InstancedMesh(geom, mat, list.length);
    im.castShadow = castShadow;
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

  addInstancedVeg(veg.palmTrunkGeom, veg.palmTrunkMat, palmTransforms);
  addInstancedVeg(veg.palmCrownGeom, veg.palmFrondMat, palmTransforms);
  addInstancedVeg(veg.oliveTrunkGeom, veg.barkMat, oliveTransforms);
  addInstancedVeg(veg.oliveCrownGeom, veg.oliveCanopyMat, oliveTransforms);
  addInstancedVeg(veg.shrubGeom, veg.shrubMat, shrubTransforms);
  addInstancedVeg(veg.grassTuftGeom, veg.grassTuftMat, grassTransforms, false);

  // 8. Coastal Boulders & Shoreline Rock Clusters in Surf (Poly Haven CC0 GLTF models!)
  const rockTemplates = [propBank.coastRocks01, propBank.coastRocks02, propBank.boulder01];
  for (let i = 0; i < 22; i++) {
    const s = 45 + i * 35;
    const samp = track.sampleAtDistance(s);
    // Walk outward toward the sea (+right) until terrain drops right into the surf zone (y ~ -0.3..+0.25)
    let bestX = samp.pos.x;
    let bestZ = samp.pos.z;
    let bestY = samp.pos.y;
    for (let dist = samp.width * 0.5 + 14; dist < 115; dist += 1.5) {
      const tx = samp.pos.x + samp.right.x * dist;
      const tz = samp.pos.z + samp.right.z * dist;
      const ty = terrain.getHeightAt(tx, tz);
      bestX = tx; bestZ = tz; bestY = ty;
      if (ty <= -0.05) break;
    }
    const tmpl = rockTemplates[i % rockTemplates.length];
    const scale = 1.0 + rng() * 1.15;
    const worldRad = Math.max(1.2, tmpl.radius * scale * 0.85);
    if (!isClearOfExclusion(bestX, bestZ, worldRad)) continue;

    const clone = tmpl.scene.clone(true);
    const sinkY = bestY - 0.18 * scale;
    clone.position.set(bestX, sinkY, bestZ);
    clone.rotation.y = rng() * Math.PI * 2;
    clone.scale.setScalar(scale);
    group.add(clone);

    if (i % 2 === 0) {
      for (let sub = 0; sub < 2; sub++) {
        const subX = bestX + (rng() - 0.5) * 4.5;
        const subZ = bestZ + (rng() - 0.5) * 4.5;
        const subY = terrain.getHeightAt(subX, subZ);
        const subScale = 0.45 + rng() * 0.55;
        if (isClearOfExclusion(subX, subZ, 1.0)) {
          const sc = propBank.boulder01.scene.clone(true);
          sc.position.set(subX, subY - 0.12, subZ);
          sc.rotation.y = rng() * Math.PI * 2;
          sc.scale.setScalar(subScale);
          group.add(sc);
        }
      }
    }

    if (bestY < 0.7) {
      rockFoamCenters.push({ x: bestX, z: bestZ, radius: worldRad * 0.65 });
    }
    objects.push({
      id: `z1-surfrock-${i}`,
      kind: 'rock',
      zone: 'Z1',
      s,
      x: bestX,
      y: sinkY,
      z: bestZ,
      radius: worldRad,
      canSink: true,
    });
  }

  // Also add wooden promenade benches & ceramic planters near Z1 start promenade!
  for (let s = 60; s < 460; s += 55) {
    const samp = track.sampleAtDistance(s);
    const lat = samp.width * 0.5 + 5.0;
    const bx = samp.pos.x + samp.right.x * lat;
    const bz = samp.pos.z + samp.right.z * lat;
    if (!isClearOfExclusion(bx, bz, 0.7)) continue;
    const by = terrain.getHeightAt(bx, bz);
    if (by < 1.2) continue;

    const bench = propBank.woodenBench.scene.clone(true);
    bench.position.set(bx, by, bz);
    bench.rotation.y = Math.atan2(-samp.right.x, -samp.right.z);
    group.add(bench);
    objects.push({
      id: `z1-bench-${s}`,
      kind: 'prop',
      zone: 'Z1',
      s,
      x: bx,
      y: by,
      z: bz,
      radius: 0.7,
    });

    const pot = propBank.ceramicPot.scene.clone(true);
    pot.position.set(bx + samp.tangent.x * 2.2, terrain.getHeightAt(bx + samp.tangent.x * 2.2, bz + samp.tangent.z * 2.2), bz + samp.tangent.z * 2.2);
    pot.scale.setScalar(1.3);
    group.add(pot);
    objects.push({
      id: `z1-pot-${s}`,
      kind: 'prop',
      zone: 'Z1',
      s: s + 2.2,
      x: pot.position.x,
      y: pot.position.y,
      z: pot.position.z,
      radius: 0.45,
    });
  }

  // Flag wave animation update
  const updateAnimations = (timeSec: number) => {
    for (const f of animatedFlags) {
      f.mesh.rotation.y = Math.sin(timeSec * 2.8 + f.phase) * 0.22 + 0.3;
    }
  };

  return {
    group,
    objects,
    rockFoamCenters,
    animatedFlags,
    updateAnimations,
  };
}
