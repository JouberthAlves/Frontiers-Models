import * as THREE from 'three';
import { WorldTextureBank } from './materials';

export type VegetationSpecies = 'palmeira' | 'pinheiro_manso' | 'oliveira' | 'arbusto';

export interface VegetationPrototypes {
  palmTrunkMat: THREE.MeshStandardMaterial;
  barkMat: THREE.MeshStandardMaterial;
  palmFrondMat: THREE.MeshStandardMaterial;
  pineCanopyMat: THREE.MeshStandardMaterial;
  oliveCanopyMat: THREE.MeshStandardMaterial;
  shrubMat: THREE.MeshStandardMaterial;
  grassTuftMat: THREE.MeshStandardMaterial;
  palmTrunkGeom: THREE.BufferGeometry;
  palmCrownGeom: THREE.BufferGeometry;
  pineTrunkGeom: THREE.BufferGeometry;
  pineCrownGeom: THREE.BufferGeometry;
  oliveTrunkGeom: THREE.BufferGeometry;
  oliveCrownGeom: THREE.BufferGeometry;
  shrubGeom: THREE.BufferGeometry;
  grassTuftGeom: THREE.BufferGeometry;
}

function createCanvas(size = 1024): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return [c, c.getContext('2d')!];
}

function heightToNormal(heightCanvas: HTMLCanvasElement, strength = 2.2): THREE.CanvasTexture {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const src = heightCanvas.getContext('2d')!.getImageData(0, 0, w, h).data;
  const [outC, outCtx] = createCanvas(w);
  const outImg = outCtx.createImageData(w, h);
  const dst = outImg.data;
  const at = (x: number, y: number) => src[(Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))) * 4] / 255;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      let nx = -dx, ny = -dy, nz = 1.0;
      const inv = 1 / Math.hypot(nx, ny, nz);
      nx *= inv; ny *= inv; nz *= inv;
      const i = (y * w + x) * 4;
      dst[i] = Math.round((nx * 0.5 + 0.5) * 255);
      dst[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      dst[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      dst[i + 3] = 255;
    }
  }
  outCtx.putImageData(outImg, 0, 0);
  const tex = new THREE.CanvasTexture(outC);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

function buildPalmFrondTextures(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const [c, ctx] = createCanvas(1024);
  const [hc, hCtx] = createCanvas(1024);
  ctx.clearRect(0, 0, 1024, 1024);
  hCtx.fillStyle = '#505050';
  hCtx.fillRect(0, 0, 1024, 1024);

  // Central rachis stem from bottom (512, 1010) to top (512, 36)
  ctx.strokeStyle = '#6f7e34';
  ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(512, 1010); ctx.lineTo(512, 42); ctx.stroke();
  hCtx.strokeStyle = '#d8d8d8';
  hCtx.lineWidth = 18;
  hCtx.beginPath(); hCtx.moveTo(512, 1010); hCtx.lineTo(512, 42); hCtx.stroke();

  // Feather leaflets along both sides of frond
  const rand = seededRand(42);
  for (let i = 0; i < 64; i++) {
    const t = i / 63;
    const y = 960 - t * 880;
    const env = Math.sin(Math.pow(t, 0.72) * Math.PI);
    const len = 60 + env * 365;
    for (const side of [-1, 1]) {
      const tipX = 512 + side * len * (0.9 + rand() * 0.14);
      const tipY = y - 105 - (1 - t) * 40 + (rand() - 0.5) * 30;
      const g = Math.round(92 + rand() * 44);
      const r = Math.round(52 + rand() * 34);
      ctx.fillStyle = `rgb(${r}, ${g}, 28)`;
      ctx.beginPath();
      ctx.moveTo(512, y + 6);
      ctx.quadraticCurveTo(512 + side * len * 0.52, y - 55, tipX, tipY);
      ctx.quadraticCurveTo(512 + side * len * 0.45, y - 18, 512, y - 8);
      ctx.closePath();
      ctx.fill();

      hCtx.fillStyle = `rgb(${Math.round(130 + rand() * 60)},150,150)`;
      hCtx.beginPath();
      hCtx.moveTo(512, y + 6);
      hCtx.quadraticCurveTo(512 + side * len * 0.52, y - 55, tipX, tipY);
      hCtx.quadraticCurveTo(512 + side * len * 0.45, y - 18, 512, y - 8);
      hCtx.closePath();
      hCtx.fill();
    }
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap: heightToNormal(hc, 2.0) };
}

function buildFoliageClusterTexture(
  palette: string[],
  leafSize: [number, number],
  count: number,
  seed: number,
  needleStyle = false
): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const [c, ctx] = createCanvas(1024);
  const [hc, hCtx] = createCanvas(1024);
  ctx.clearRect(0, 0, 1024, 1024);
  hCtx.fillStyle = '#404040';
  hCtx.fillRect(0, 0, 1024, 1024);

  const rand = seededRand(seed);
  // Subtle woody twigs radiating from center
  ctx.strokeStyle = '#463829';
  for (let b = 0; b < 14; b++) {
    const a = (b / 14) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const r = 220 + rand() * 190;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(512, 512);
    ctx.lineTo(512 + Math.cos(a) * r, 512 + Math.sin(a) * r);
    ctx.stroke();
  }

  for (let i = 0; i < count; i++) {
    const rad = Math.pow(rand(), 0.55) * 430;
    const ang = rand() * Math.PI * 2;
    const cx = 512 + Math.cos(ang) * rad;
    const cy = 512 + Math.sin(ang) * rad;
    const rot = ang + (rand() - 0.5) * 1.4;
    const col = palette[Math.floor(rand() * palette.length)];
    const w = leafSize[0] * (0.7 + rand() * 0.65);
    const h = leafSize[1] * (0.7 + rand() * 0.65);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = col;
    if (needleStyle) {
      for (let n = -3; n <= 3; n++) {
        ctx.beginPath();
        ctx.ellipse(n * 4, 0, w * 0.22, h, n * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    hCtx.save();
    hCtx.translate(cx, cy);
    hCtx.rotate(rot);
    const hv = Math.round(135 + rand() * 105);
    hCtx.fillStyle = `rgb(${hv},${hv},${hv})`;
    hCtx.beginPath();
    hCtx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    hCtx.fill();
    hCtx.restore();
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap: heightToNormal(hc, 2.2) };
}

function buildDuneGrassTexture(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const [c, ctx] = createCanvas(1024);
  const [hc, hCtx] = createCanvas(1024);
  ctx.clearRect(0, 0, 1024, 1024);
  hCtx.fillStyle = '#404040';
  hCtx.fillRect(0, 0, 1024, 1024);

  const rand = seededRand(909);
  for (let i = 0; i < 65; i++) {
    const bx = 240 + rand() * 544;
    const topX = bx + (bx - 512) * (0.35 + rand() * 0.85);
    const topY = 90 + rand() * 380;
    const ctrlX = (bx + topX) * 0.5 + (rand() - 0.5) * 40;
    const ctrlY = 520;
    const hueChoice = rand();
    ctx.strokeStyle = hueChoice < 0.4 ? '#8a7f49' : hueChoice < 0.8 ? '#5d6b38' : '#a8965c';
    ctx.lineWidth = 8 + rand() * 6;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx, 1020); ctx.quadraticCurveTo(ctrlX, ctrlY, topX, topY); ctx.stroke();

    hCtx.strokeStyle = '#c8c8c8';
    hCtx.lineWidth = 10;
    hCtx.beginPath(); hCtx.moveTo(bx, 1020); hCtx.quadraticCurveTo(ctrlX, ctrlY, topX, topY); hCtx.stroke();
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap: heightToNormal(hc, 1.8) };
}

function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVerts = 0;
  let totalIdx = 0;
  for (const g of geos) {
    totalVerts += g.attributes.position.count;
    totalIdx += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(totalVerts * 3);
  const nor = new Float32Array(totalVerts * 3);
  const uv = new Float32Array(totalVerts * 2);
  const idx = new Uint32Array(totalIdx);

  let vOff = 0;
  let iOff = 0;
  for (const g of geos) {
    const p = g.attributes.position.array as Float32Array;
    const n = g.attributes.normal.array as Float32Array;
    const u = g.attributes.uv.array as Float32Array;
    const count = g.attributes.position.count;
    pos.set(p, vOff * 3);
    nor.set(n, vOff * 3);
    uv.set(u, vOff * 2);
    if (g.index) {
      const gi = g.index.array;
      for (let k = 0; k < gi.length; k++) idx[iOff + k] = gi[k] + vOff;
      iOff += gi.length;
    } else {
      for (let k = 0; k < count; k++) idx[iOff + k] = k + vOff;
      iOff += count;
    }
    vOff += count;
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

function buildCurvedTube(pts: THREE.Vector3[], rBottom: number, rTop: number, tubularSegs = 12, radialSegs = 8): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts);
  const geom = new THREE.TubeGeometry(curve, tubularSegs, 1, radialSegs, false);
  const pos = geom.attributes.position;
  for (let i = 0; i <= tubularSegs; i++) {
    const t = i / tubularSegs;
    const r = THREE.MathUtils.lerp(rBottom, rTop, t);
    const center = curve.getPointAt(t);
    for (let j = 0; j <= radialSegs; j++) {
      const vi = i * (radialSegs + 1) + j;
      const vx = pos.getX(vi) - center.x;
      const vy = pos.getY(vi) - center.y;
      const vz = pos.getZ(vi) - center.z;
      pos.setXYZ(vi, center.x + vx * r, center.y + vy * r, center.z + vz * r);
    }
  }
  geom.computeVertexNormals();
  return geom;
}

function buildCrossedCardCluster(
  centers: { pos: THREE.Vector3; radius: number; tilt?: number }[]
): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const c of centers) {
    for (const rotY of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
      const p = new THREE.PlaneGeometry(c.radius * 2, c.radius * 1.85, 2, 2);
      // Slight dome bow on each foliage card so lighting catches curves instead of flat planes!
      const pa = p.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i);
        const y = pa.getY(i);
        pa.setZ(i, (1 - (x * x + y * y) / (c.radius * c.radius * 2.2)) * c.radius * 0.25);
      }
      p.computeVertexNormals();
      p.rotateX(c.tilt ?? 0.25);
      p.rotateY(rotY);
      p.translate(c.pos.x, c.pos.y, c.pos.z);
      parts.push(p);
    }
    // Horizontal umbrella crown card
    const h = new THREE.PlaneGeometry(c.radius * 2.1, c.radius * 2.1, 2, 2);
    h.rotateX(-Math.PI / 2);
    h.translate(c.pos.x, c.pos.y + c.radius * 0.15, c.pos.z);
    parts.push(h);
  }
  return mergeGeometries(parts);
}

export function createVegetationPrototypes(texBank: WorldTextureBank): VegetationPrototypes {
  const palmTex = buildPalmFrondTextures();
  const pineTex = buildFoliageClusterTexture(['#2b4a26', '#35592b', '#416932', '#233c1e'], [9, 36], 620, 101, true);
  const oliveTex = buildFoliageClusterTexture(['#5d6e4a', '#70825b', '#81926a', '#4a5a3a'], [18, 42], 480, 202, false);
  const shrubTex = buildFoliageClusterTexture(['#3b5829', '#4f6d34', '#607d3f', '#2f4721'], [22, 38], 420, 303, false);
  const grassTex = buildDuneGrassTexture();

  const barkMat = new THREE.MeshStandardMaterial({
    map: texBank.bark.map,
    normalMap: texBank.bark.normalMap,
    roughnessMap: texBank.bark.roughnessMap,
    roughness: 0.92,
  });

  const palmTrunkMat = new THREE.MeshStandardMaterial({
    map: texBank.bark.map,
    normalMap: texBank.bark.normalMap,
    color: 0x9c8266,
    roughness: 0.9,
  });

  const makeFoliageMat = (pair: { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture }, rough = 0.72) =>
    new THREE.MeshStandardMaterial({
      map: pair.map,
      normalMap: pair.normalMap,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      roughness: rough,
      metalness: 0.02,
    });

  const palmFrondMat = makeFoliageMat(palmTex, 0.65);
  const pineCanopyMat = makeFoliageMat(pineTex, 0.78);
  const oliveCanopyMat = makeFoliageMat(oliveTex, 0.72);
  const shrubMat = makeFoliageMat(shrubTex, 0.78);
  const grassTuftMat = makeFoliageMat(grassTex, 0.8);

  // 1. Palmeira (curved ringed trunk + 22 outward-arching drooping fronds in 3 tiers!)
  const palmTrunkGeom = buildCurvedTube(
    [
      new THREE.Vector3(0, -0.15, 0),
      new THREE.Vector3(0.18, 2.2, 0.08),
      new THREE.Vector3(0.42, 4.8, 0.14),
      new THREE.Vector3(0.36, 7.2, 0.06),
      new THREE.Vector3(0.28, 8.6, 0.0),
    ],
    0.30,
    0.16,
    14,
    9
  );
  const palmFronds: THREE.BufferGeometry[] = [];
  // 3 tiers: lower drooping skirt (8), mid spreading (8), upper fountain (6)
  const tierSpecs = [
    { count: 8, len: 3.4, wid: 1.5, pitchUp: 0.25, droop: 1.85, angleOff: 0.0 },
    { count: 8, len: 3.2, wid: 1.4, pitchUp: 0.72, droop: 1.55, angleOff: 0.39 },
    { count: 6, len: 2.5, wid: 1.15, pitchUp: 1.18, droop: 1.05, angleOff: 0.2 },
  ];
  for (const tier of tierSpecs) {
    for (let i = 0; i < tier.count; i++) {
      const ang = (i / tier.count) * Math.PI * 2 + tier.angleOff;
      // Plane extends along +Z from 0 (stem base) to tier.len (tip), width along X!
      const f = new THREE.PlaneGeometry(tier.wid, tier.len, 2, 7);
      // Convert default XY plane (width=X, height=Y) into XZ frond extending along +Z (0..len)
      f.translate(0, tier.len * 0.5, 0);
      f.rotateX(Math.PI / 2); // now Y=0, Z runs 0 -> +tier.len (wait: Plane +Y rotated +90 deg X goes to +Z!)
      const pa = f.attributes.position;
      for (let k = 0; k < pa.count; k++) {
        const x = pa.getX(k);
        const z = pa.getZ(k);
        const t = THREE.MathUtils.clamp(z / tier.len, 0, 1);
        // Arch upward initially then droop strongly downward toward the tip!
        const yArch = Math.sin(t * Math.PI * 0.78) * tier.pitchUp - t * t * tier.droop;
        const vFold = -Math.abs(x) * 0.24; // natural V-groove cross section of palm leaf!
        pa.setXYZ(k, x * (1.0 - t * 0.25), yArch + vFold, z * 0.94);
      }
      f.computeVertexNormals();
      f.rotateY(ang);
      f.translate(0.28, 8.5, 0.0);
      palmFronds.push(f);
    }
  }
  const palmCrownGeom = mergeGeometries(palmFronds);

  // 2. Pinheiro-Manso (tall Mediterranean stone pine with forked upper limbs + broad flat-topped layered needle canopy)
  const pineTrunkGeom = mergeGeometries([
    buildCurvedTube(
      [new THREE.Vector3(0, -0.15, 0), new THREE.Vector3(-0.15, 2.8, 0.1), new THREE.Vector3(0.08, 6.2, -0.05), new THREE.Vector3(0, 8.6, 0)],
      0.38,
      0.18,
      12,
      8
    ),
    buildCurvedTube([new THREE.Vector3(0.04, 6.0, -0.02), new THREE.Vector3(1.1, 7.6, 0.5), new THREE.Vector3(1.8, 8.8, 0.8)], 0.16, 0.08, 6, 6),
    buildCurvedTube([new THREE.Vector3(0.04, 6.2, -0.02), new THREE.Vector3(-1.2, 7.8, -0.4), new THREE.Vector3(-1.9, 8.9, -0.7)], 0.15, 0.07, 6, 6),
    buildCurvedTube([new THREE.Vector3(0.02, 6.4, 0.02), new THREE.Vector3(0.2, 7.9, -1.1), new THREE.Vector3(0.3, 8.9, -1.7)], 0.14, 0.07, 6, 6),
  ]);
  const pineCrownGeom = buildCrossedCardCluster([
    { pos: new THREE.Vector3(0, 9.5, 0), radius: 2.8, tilt: 0.18 },
    { pos: new THREE.Vector3(1.8, 9.0, 0.8), radius: 2.2, tilt: 0.2 },
    { pos: new THREE.Vector3(-1.9, 9.1, -0.7), radius: 2.2, tilt: 0.2 },
    { pos: new THREE.Vector3(0.3, 9.1, -1.7), radius: 2.0, tilt: 0.2 },
    { pos: new THREE.Vector3(-0.4, 8.8, 1.6), radius: 2.0, tilt: 0.2 },
  ]);

  // 3. Oliveira (gnarled split trunk + rounded silvery-green canopy)
  const oliveTrunkGeom = mergeGeometries([
    buildCurvedTube(
      [new THREE.Vector3(0, -0.15, 0), new THREE.Vector3(0.18, 1.1, -0.12), new THREE.Vector3(-0.1, 2.2, 0.08)],
      0.34,
      0.20,
      8,
      7
    ),
    buildCurvedTube([new THREE.Vector3(-0.08, 1.8, 0.06), new THREE.Vector3(0.8, 2.7, 0.4), new THREE.Vector3(1.1, 3.3, 0.6)], 0.14, 0.07, 5, 6),
    buildCurvedTube([new THREE.Vector3(-0.08, 1.8, 0.06), new THREE.Vector3(-0.85, 2.8, -0.35), new THREE.Vector3(-1.2, 3.4, -0.5)], 0.13, 0.06, 5, 6),
  ]);
  const oliveCrownGeom = buildCrossedCardCluster([
    { pos: new THREE.Vector3(0, 3.65, 0), radius: 1.7, tilt: 0.25 },
    { pos: new THREE.Vector3(1.15, 3.35, 0.6), radius: 1.35, tilt: 0.32 },
    { pos: new THREE.Vector3(-1.15, 3.55, -0.45), radius: 1.3, tilt: 0.28 },
    { pos: new THREE.Vector3(0.2, 3.25, -0.95), radius: 1.2, tilt: 0.3 },
    { pos: new THREE.Vector3(-0.6, 3.9, 0.85), radius: 1.1, tilt: 0.24 },
  ]);

  // 4. Arbusto (coastal Mediterranean scrub bush)
  const shrubGeom = buildCrossedCardCluster([
    { pos: new THREE.Vector3(0, 0.72, 0), radius: 0.95, tilt: 0.35 },
    { pos: new THREE.Vector3(0.45, 0.58, 0.35), radius: 0.68, tilt: 0.4 },
    { pos: new THREE.Vector3(-0.4, 0.60, -0.3), radius: 0.70, tilt: 0.4 },
  ]);

  // 5. Dune Grass Tuft
  const grassParts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(1.4, 1.05, 1, 1);
    g.translate(0, 0.48, 0);
    g.rotateY((i / 3) * Math.PI);
    grassParts.push(g);
  }
  const grassTuftGeom = mergeGeometries(grassParts);

  return {
    palmTrunkMat,
    barkMat,
    palmFrondMat,
    pineCanopyMat,
    oliveCanopyMat,
    shrubMat,
    grassTuftMat,
    palmTrunkGeom,
    palmCrownGeom,
    pineTrunkGeom,
    pineCrownGeom,
    oliveTrunkGeom,
    oliveCrownGeom,
    shrubGeom,
    grassTuftGeom,
  };
}
