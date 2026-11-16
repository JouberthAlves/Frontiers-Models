import * as THREE from 'three';
import {
  createLiveryPaintTexture,
  getSharedCarTextures,
  LIVERIES,
  LiverySpec,
} from './carTextures';

export type CarModelId = 'veloce' | 'solara';

export interface CarVisualInstance {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  wheelSteerGroups: THREE.Group[];
  wheelSpinGroups: THREE.Group[];
  caliperGroups: THREE.Group[];
  brakeLightMat: THREE.MeshStandardMaterial;
  contactShadow: THREE.Mesh;
  triangleCount: number;
  materialCount: number;
}

function catmull1D(keys: [number, number][], t: number): number {
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[keys.length - 1][0]) return keys[keys.length - 1][1];
  let idx = 0;
  while (idx < keys.length - 1 && keys[idx + 1][0] < t) idx++;
  const p0 = keys[Math.max(0, idx - 1)];
  const p1 = keys[idx];
  const p2 = keys[Math.min(keys.length - 1, idx + 1)];
  const p3 = keys[Math.min(keys.length - 1, idx + 2)];
  const span = Math.max(1e-5, p2[0] - p1[0]);
  const u = (t - p1[0]) / span;
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * u +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)
  );
}

interface BodyEnvelope {
  halfLength: number;
  wheelZFront: number;
  wheelZRear: number;
  wheelCutR: number;
  widthKeys: [number, number][];
  beltYKeys: [number, number][];
  topYKeys: [number, number][];
  floorYKeys: [number, number][];
  roofWKeys: [number, number][];
  windshieldV0: number;
  windshieldV1: number;
  rearGlassV0: number;
  rearGlassV1: number;
}

const VELOCE_ENV: BodyEnvelope = {
  halfLength: 2.24,
  wheelZFront: 1.35,
  wheelZRear: -1.35,
  wheelCutR: 0.42,
  widthKeys: [
    [0.0, 0.72], [0.05, 0.89], [0.15, 0.95], [0.26, 0.96],
    [0.44, 0.91], [0.64, 0.93], [0.78, 0.98], [0.92, 0.93], [1.0, 0.80],
  ],
  beltYKeys: [
    [0.0, 0.24], [0.07, 0.42], [0.20, 0.62], [0.38, 0.56],
    [0.62, 0.59], [0.78, 0.69], [0.94, 0.66], [1.0, 0.50],
  ],
  topYKeys: [
    [0.0, 0.25], [0.09, 0.44], [0.24, 0.56], [0.35, 0.64],
    [0.48, 1.07], [0.60, 1.16], [0.73, 1.03], [0.87, 0.72], [0.97, 0.66], [1.0, 0.52],
  ],
  floorYKeys: [
    [0.0, 0.12], [0.12, 0.11], [0.50, 0.12], [0.88, 0.14], [1.0, 0.22],
  ],
  roofWKeys: [
    [0.0, 0.62], [0.34, 0.76], [0.50, 0.64], [0.68, 0.64], [0.86, 0.76], [1.0, 0.70],
  ],
  windshieldV0: 0.355,
  windshieldV1: 0.485,
  rearGlassV0: 0.655,
  rearGlassV1: 0.785,
};

const SOLARA_ENV: BodyEnvelope = {
  halfLength: 2.08,
  wheelZFront: 1.27,
  wheelZRear: -1.27,
  wheelCutR: 0.41,
  widthKeys: [
    [0.0, 0.74], [0.06, 0.89], [0.18, 0.95], [0.36, 0.89],
    [0.64, 0.91], [0.80, 0.96], [0.93, 0.89], [1.0, 0.78],
  ],
  beltYKeys: [
    [0.0, 0.26], [0.08, 0.48], [0.20, 0.65], [0.40, 0.63],
    [0.68, 0.67], [0.82, 0.73], [0.95, 0.69], [1.0, 0.53],
  ],
  topYKeys: [
    [0.0, 0.27], [0.09, 0.52], [0.26, 0.66], [0.37, 0.73],
    [0.50, 1.20], [0.66, 1.30], [0.82, 1.23], [0.94, 0.85], [1.0, 0.55],
  ],
  floorYKeys: [
    [0.0, 0.14], [0.15, 0.13], [0.50, 0.14], [0.88, 0.16], [1.0, 0.24],
  ],
  roofWKeys: [
    [0.0, 0.64], [0.34, 0.78], [0.52, 0.67], [0.76, 0.65], [0.93, 0.73], [1.0, 0.68],
  ],
  windshieldV0: 0.375,
  windshieldV1: 0.495,
  rearGlassV0: 0.785,
  rearGlassV1: 0.895,
};

/**
 * Builds seamless multi-material sculpted bodywork:
 * - Material Group 0: Clearcoat Metallic Paint (hood, fenders, doors, A/B/C pillars, roof, rear deck)
 * - Material Group 1: Tinted Reflective Glass (windshield, side windows, rear glass)
 * - Material Group 2: Matte Carbon Trim (front grille mouth, lower valance, window gaskets)
 */
function buildSculptedBodyGeometry(env: BodyEnvelope): THREE.BufferGeometry {
  const nZ = 96;
  const nU = 60;
  const positions = new Float32Array(nZ * nU * 3);
  const uvs = new Float32Array(nZ * nU * 2);

  // Store per-vertex metadata to classify quad material cleanly
  const vertV = new Float32Array(nZ * nU);
  const vertS = new Float32Array(nZ * nU);
  const vertXNorm = new Float32Array(nZ * nU);

  for (let iz = 0; iz < nZ; iz++) {
    const v = iz / (nZ - 1); // 0 = nose (+Z), 1 = tail (-Z)
    const capShrink =
      v < 0.025 ? Math.sqrt(v / 0.025) : v > 0.975 ? Math.sqrt((1 - v) / 0.025) : 1.0;

    const z = (1 - 2 * v) * env.halfLength;
    const hw = catmull1D(env.widthKeys, v) * (0.68 + 0.32 * capShrink);
    const beltY = catmull1D(env.beltYKeys, v);
    const topY = catmull1D(env.topYKeys, v);
    const floorY = catmull1D(env.floorYKeys, v);
    const roofW = Math.min(hw * 0.92, catmull1D(env.roofWKeys, v)) * (0.72 + 0.28 * capShrink);

    const dFront = Math.abs(z - env.wheelZFront);
    const dRear = Math.abs(z - env.wheelZRear);
    const archDist = Math.min(dFront, dRear);
    const archFactor =
      archDist < env.wheelCutR
        ? Math.sqrt(Math.max(0, 1 - (archDist / env.wheelCutR) ** 2))
        : 0;
    const flare =
      archDist < env.wheelCutR * 1.38 && archDist > env.wheelCutR * 0.72
        ? Math.sin(((archDist - env.wheelCutR * 0.72) / (env.wheelCutR * 0.66)) * Math.PI) * 0.042
        : 0;
    // Lift rocker sill into a clean semicircular wheel arch cutout around both axles!
    const archLiftY = archFactor > 0 ? Math.max(floorY, 0.14 + env.wheelCutR * archFactor * 0.96) : floorY;

    for (let iu = 0; iu < nU; iu++) {
      const u = iu / (nU - 1);
      const mirror = u > 0.5 ? -1 : 1; // +1 = left (+X), -1 = right (-X)
      const s = u <= 0.5 ? u * 2 : (1 - u) * 2; // 0 = bottom center, 1 = top center

      let xAbs = 0;
      let y = floorY;

      if (s < 0.26) {
        const t = s / 0.26;
        xAbs = hw * 0.88 * Math.sin(t * Math.PI * 0.5);
        // Smoothly transition from underbody floorY up to semicircular wheel-arch lip at outer rocker (t -> 1)
        const sillBase = floorY + (archLiftY - floorY) * Math.pow(t, 1.6);
        y = sillBase + (beltY - sillBase) * 0.12 * Math.pow(t, 2.2);
      } else if (s < 0.66) {
        const t = (s - 0.26) / 0.40;
        const bulge = Math.sin(t * Math.PI) * 0.052;
        xAbs = hw * (0.88 + 0.12 * Math.sin(t * Math.PI * 0.5)) + bulge + flare;
        const sillTop = floorY + (archLiftY - floorY) * 1.0;
        const baseArchY = sillTop + (beltY - sillTop) * 0.12;
        y = Math.max(baseArchY, floorY + (beltY - floorY) * (0.13 + 0.87 * t));
      } else {
        const t = (s - 0.66) / 0.34;
        const startX = hw + flare;
        const smoothT = t * t * (3 - 2 * t);
        if (t < 0.48) {
          const st = t / 0.48;
          xAbs = THREE.MathUtils.lerp(startX, roofW, st);
        } else {
          const ct = (t - 0.48) / 0.52;
          xAbs = roofW * Math.cos(ct * Math.PI * 0.5);
        }
        const archCrown = Math.sin(Math.min(1, smoothT * 0.95 + 0.05) * Math.PI * 0.5);
        y = beltY + (topY - beltY) * archCrown;
      }

      // Gently tuck inside the lower arch lip without folding polygons
      if (archFactor > 0 && s > 0.12 && s < 0.32) {
        xAbs = Math.min(xAbs, hw - 0.16 * archFactor);
      }

      if (iz === 0 || iz === nZ - 1) {
        xAbs *= 0.25;
        y = (floorY + topY) * 0.5;
      }

      const x = mirror * xAbs;
      const idx = (iz * nU + iu) * 3;
      positions[idx] = x;
      positions[idx + 1] = y - 0.36; // aggressive planted stance
      positions[idx + 2] = z;

      // Planar/flank UV mapping:
      // - Top surface (s >= 0.65): U centered at 0.5 (constant-width stripes & upright hood badge!)
      // - Flanks (s < 0.65): Left flank maps to U=[0.04..0.22], Right flank maps to U=[0.78..0.96]
      let texU: number;
      if (s >= 0.64) {
        texU = 0.5 - x * 0.24; // left (+X) -> <0.5, right (-X) -> >0.5, so viewed from front/above reads left-to-right!
      } else {
        const flankT = (s - 0.20) / 0.44;
        texU = mirror > 0 ? 0.04 + Math.max(0, flankT) * 0.16 : 0.96 - Math.max(0, flankT) * 0.16;
      }
      const texV = 1.0 - v; // top of canvas V=1? Wait: flipY=true => V=1 is top of canvas (nose), V=0 is bottom (tail)!

      uvs[(iz * nU + iu) * 2] = THREE.MathUtils.clamp(texU, 0.01, 0.99);
      uvs[(iz * nU + iu) * 2 + 1] = THREE.MathUtils.clamp(texV, 0.01, 0.99);

      vertV[iz * nU + iu] = v;
      vertS[iz * nU + iu] = s;
      vertXNorm[iz * nU + iu] = roofW > 0.05 ? xAbs / roofW : 0;
    }
  }

  const paintIndices: number[] = [];
  const glassIndices: number[] = [];
  const trimIndices: number[] = [];

  for (let iz = 0; iz < nZ - 1; iz++) {
    for (let iu = 0; iu < nU - 1; iu++) {
      const a = iz * nU + iu;
      const b = a + 1;
      const c = (iz + 1) * nU + iu;
      const d = c + 1;

      const vMid = 0.25 * (vertV[a] + vertV[b] + vertV[c] + vertV[d]);
      const sMid = 0.25 * (vertS[a] + vertS[b] + vertS[c] + vertS[d]);
      const xN = 0.25 * (vertXNorm[a] + vertXNorm[b] + vertXNorm[c] + vertXNorm[d]);

      // Classify quad into Paint (0), Glass (1), or Carbon Trim (2)
      const inWindshield =
        vMid >= env.windshieldV0 &&
        vMid <= env.windshieldV1 &&
        sMid >= 0.69 &&
        xN < 0.86;
      const inRearGlass =
        vMid >= env.rearGlassV0 &&
        vMid <= env.rearGlassV1 &&
        sMid >= 0.70 &&
        xN < 0.84;
      const inSideWindow =
        vMid >= env.windshieldV0 + 0.05 &&
        vMid <= env.rearGlassV0 + 0.01 &&
        sMid >= 0.69 &&
        sMid <= 0.83 &&
        Math.abs(vMid - 0.565) > 0.014;

      const inFrontGrille = vMid < 0.045 && sMid > 0.24 && sMid < 0.62 && xN < 0.68;
      const inRearValance = vMid > 0.96 && sMid > 0.14 && sMid < 0.56 && xN < 0.72;
      const inWindowTrim =
        !inWindshield &&
        !inRearGlass &&
        !inSideWindow &&
        ((vMid >= env.windshieldV0 + 0.03 &&
          vMid <= env.rearGlassV0 + 0.02 &&
          Math.abs(vMid - 0.565) <= 0.014 &&
          sMid >= 0.69 &&
          sMid <= 0.84) ||
          (vMid >= env.windshieldV0 + 0.04 &&
            vMid <= env.rearGlassV0 + 0.01 &&
            sMid >= 0.675 &&
            sMid < 0.69));

      if (inWindshield || inRearGlass || inSideWindow) {
        glassIndices.push(a, c, b, b, c, d);
      } else if (inFrontGrille || inRearValance || inWindowTrim) {
        trimIndices.push(a, c, b, b, c, d);
      } else {
        paintIndices.push(a, c, b, b, c, d);
      }
    }
  }

  const allIndices = new Uint32Array(
    paintIndices.length + glassIndices.length + trimIndices.length
  );
  allIndices.set(paintIndices, 0);
  allIndices.set(glassIndices, paintIndices.length);
  allIndices.set(trimIndices, paintIndices.length + glassIndices.length);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(new THREE.BufferAttribute(allIndices, 1));
  geom.clearGroups();
  geom.addGroup(0, paintIndices.length, 0);
  geom.addGroup(paintIndices.length, glassIndices.length, 1);
  geom.addGroup(paintIndices.length + glassIndices.length, trimIndices.length, 2);
  geom.computeVertexNormals();
  return geom;
}

function buildExtrudedPart(
  points2D: [number, number][],
  depth: number,
  bevelSize = 0.012
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points2D[0][0], points2D[0][1]);
  for (let i = 1; i < points2D.length; i++) {
    shape.lineTo(points2D[i][0], points2D[i][1]);
  }
  shape.closePath();
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geom.translate(0, 0, -depth * 0.5);
  return geom;
}

function buildSculptedTireGeometry(radius: number, width: number): THREE.LatheGeometry {
  const hw = width * 0.5;
  const rInner = radius * 0.62;
  const pts: THREE.Vector2[] = [];
  const profileSteps = 22;
  for (let i = 0; i <= profileSteps; i++) {
    const t = i / profileSteps;
    const ang = t * Math.PI;
    const xOffset = -hw * Math.cos(ang);
    const crown = Math.pow(Math.sin(ang), 0.42);
    const r = rInner + (radius - rInner) * crown;
    pts.push(new THREE.Vector2(r, xOffset));
  }
  const geom = new THREE.LatheGeometry(pts, 44);
  geom.rotateZ(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

function buildSculptedRimBarrel(radius: number, width: number): THREE.LatheGeometry {
  const hw = width * 0.45;
  const rBead = radius * 0.65;
  const rInner = radius * 0.57;
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(rBead, -hw),
    new THREE.Vector2(rInner, -hw * 0.72),
    new THREE.Vector2(rInner * 0.96, hw * 0.55),
    new THREE.Vector2(rBead, hw),
    new THREE.Vector2(rBead * 0.93, hw),
    new THREE.Vector2(rInner * 0.91, hw * 0.45),
    new THREE.Vector2(rInner * 0.91, -hw * 0.65),
  ];
  const geom = new THREE.LatheGeometry(pts, 40);
  geom.rotateZ(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

function countTriangles(obj: THREE.Object3D): number {
  let tris = 0;
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const g = child.geometry;
      if (g.index) {
        tris += g.index.count / 3;
      } else if (g.attributes.position) {
        tris += g.attributes.position.count / 3;
      }
    }
  });
  return Math.round(tris);
}

export function buildCarVisual(model: CarModelId, liveryIdx: number): CarVisualInstance {
  const livery: LiverySpec = LIVERIES[liveryIdx % LIVERIES.length];
  const tex = getSharedCarTextures();
  const paintMap = createLiveryPaintTexture(livery);
  const env = model === 'veloce' ? VELOCE_ENV : SOLARA_ENV;

  const paintMat = new THREE.MeshPhysicalMaterial({
    map: paintMap,
    normalMap: tex.paintNormal,
    normalScale: new THREE.Vector2(0.3, 0.3),
    metalness: 0.48,
    roughness: 0.20,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.85,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x09131e,
    metalness: 0.15,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 0.76,
    envMapIntensity: 2.5,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    map: tex.carbonMap,
    normalMap: tex.carbonNormal,
    roughness: 0.52,
    metalness: 0.16,
    envMapIntensity: 1.0,
  });

  const alloyMat = new THREE.MeshStandardMaterial({
    map: tex.alloyMap,
    normalMap: tex.alloyNormal,
    color: 0xd0d6de,
    metalness: 0.90,
    roughness: 0.18,
    envMapIntensity: 1.7,
  });

  const darkAlloyMat = new THREE.MeshStandardMaterial({
    map: tex.alloyMap,
    normalMap: tex.alloyNormal,
    color: 0x262b33,
    metalness: 0.85,
    roughness: 0.28,
    envMapIntensity: 1.2,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    map: tex.tireMap,
    normalMap: tex.tireNormal,
    normalScale: new THREE.Vector2(0.95, 0.95),
    roughness: 0.84,
    metalness: 0.04,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    map: tex.alloyMap,
    normalMap: tex.alloyNormal,
    color: new THREE.Color(livery.caliper),
    metalness: 0.65,
    roughness: 0.24,
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e8,
    emissive: 0xffeed0,
    emissiveIntensity: 3.4,
    roughness: 0.1,
  });

  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0xbb1010,
    emissive: 0xff1616,
    emissiveIntensity: 1.4,
    roughness: 0.12,
  });

  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  // 1. Main seamless 3-material sculpted body + flush glass greenhouse!
  const bodyGeom = buildSculptedBodyGeometry(env);
  const bodyMesh = new THREE.Mesh(bodyGeom, [paintMat, glassMat, carbonMat]);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyPivot.add(bodyMesh);

  // 2. Dark cabin interior tub + seats + dash + steering wheel (safely inside glass!)
  const interiorHeightMax = model === 'veloce' ? 0.50 : 0.62;
  const seatPts: [number, number][] = [
    [-0.18, 0.0], [0.18, 0.0], [0.20, 0.24], [0.13, interiorHeightMax],
    [0.0, interiorHeightMax + 0.04], [-0.13, interiorHeightMax], [-0.20, 0.24],
  ];
  const seatGeom = buildExtrudedPart(seatPts, 0.18, 0.025);
  for (const sx of [-0.32, 0.32]) {
    const seat = new THREE.Mesh(seatGeom, carbonMat);
    seat.position.set(sx, -0.10, -0.20);
    bodyPivot.add(seat);
  }
  const dashGeom = new THREE.CylinderGeometry(0.13, 0.17, 1.16, 16);
  dashGeom.rotateZ(Math.PI / 2);
  const dash = new THREE.Mesh(dashGeom, carbonMat);
  dash.position.set(0, 0.24, 0.36);
  bodyPivot.add(dash);

  const steerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.018, 10, 22),
    carbonMat
  );
  steerRing.position.set(0.32, 0.28, 0.22);
  steerRing.rotation.x = -0.35;
  bodyPivot.add(steerRing);

  // Dark inner floor pan & OPEN-ENDED wheel well arch tubs strictly in upper half (sin(theta)>=0 => y' >= 0!)
  const wellTubGeom = new THREE.CylinderGeometry(
    0.37,
    0.37,
    0.28,
    24,
    1,
    true,
    0,
    Math.PI
  );
  // rotateZ(PI/2) maps (x=r*sin(theta), y, z=r*cos(theta)) -> (-y, +r*sin(theta), +r*cos(theta)) => strictly upper half!
  wellTubGeom.rotateZ(Math.PI / 2);
  const wellMat = carbonMat.clone();
  wellMat.side = THREE.DoubleSide;
  for (const [wx, wz] of [
    [0.64, env.wheelZFront], [-0.64, env.wheelZFront],
    [0.64, env.wheelZRear], [-0.64, env.wheelZRear],
  ]) {
    const tub = new THREE.Mesh(wellTubGeom, wellMat);
    tub.position.set(wx, -0.18, wz);
    bodyPivot.add(tub);
  }

  // 3. Sculpted tucked front splitter + rear diffuser + swan-neck rear airfoil wing
  const hl = env.halfLength;
  const splitterPts: [number, number][] = [
    [-0.80, -0.22], [0.80, -0.22], [0.76, 0.06], [0.50, 0.14],
    [-0.50, 0.14], [-0.76, 0.06],
  ];
  const splitterGeom = buildExtrudedPart(splitterPts, 0.024, 0.008);
  splitterGeom.rotateX(Math.PI / 2);
  const splitter = new THREE.Mesh(splitterGeom, carbonMat);
  splitter.position.set(0, -0.22, hl - 0.22);
  splitter.castShadow = true;
  bodyPivot.add(splitter);

  // Tucked rear diffuser fins (flush under rear valance!)
  const finPts: [number, number][] = [[0, 0], [0.20, 0], [0.16, 0.11], [0, 0.08]];
  const finGeom = buildExtrudedPart(finPts, 0.018, 0.004);
  finGeom.rotateY(Math.PI / 2);
  for (const fx of [-0.48, -0.24, 0, 0.24, 0.48]) {
    const fin = new THREE.Mesh(finGeom, carbonMat);
    fin.position.set(fx, -0.17, -hl + 0.16);
    bodyPivot.add(fin);
  }

  // Sleek cambered airfoil rear wing
  const wingW = model === 'veloce' ? 1.56 : 1.38;
  const wingY = model === 'veloce' ? 0.56 : 0.98;
  const wingZ = model === 'veloce' ? -hl + 0.22 : -hl + 0.34;
  const airfoilPts: [number, number][] = [
    [-0.14, 0.02], [-0.04, 0.038], [0.14, 0.01], [0.14, -0.008], [-0.06, 0.004],
  ];
  const wingBlade = buildExtrudedPart(airfoilPts, wingW, 0.006);
  wingBlade.rotateY(Math.PI / 2);
  const wingMesh = new THREE.Mesh(wingBlade, carbonMat);
  wingMesh.position.set(0, wingY, wingZ);
  wingMesh.castShadow = true;
  bodyPivot.add(wingMesh);

  const epPts: [number, number][] = [[-0.14, -0.05], [0.14, -0.02], [0.12, 0.06], [-0.14, 0.04]];
  const epGeom = buildExtrudedPart(epPts, 0.014, 0.004);
  epGeom.rotateY(Math.PI / 2);
  const strutPts: [number, number][] = [[-0.06, 0], [0.05, 0], [0.02, 0.22], [-0.05, 0.22]];
  const strutGeom = buildExtrudedPart(strutPts, 0.018, 0.004);
  strutGeom.rotateY(Math.PI / 2);

  for (const side of [-1, 1]) {
    const ep = new THREE.Mesh(epGeom, paintMat);
    ep.position.set(side * (wingW * 0.5 + 0.01), wingY, wingZ);
    ep.castShadow = true;
    bodyPivot.add(ep);

    const st = new THREE.Mesh(strutGeom, carbonMat);
    st.position.set(side * 0.30, wingY - 0.21, wingZ);
    st.castShadow = true;
    bodyPivot.add(st);
  }

  // Solara rally roof scoop seated flush on crown
  if (model === 'solara') {
    const scoopPts: [number, number][] = [[-0.13, -0.02], [0.13, -0.02], [0.09, 0.055], [-0.09, 0.055]];
    const scoopGeom = buildExtrudedPart(scoopPts, 0.34, 0.01);
    const scoop = new THREE.Mesh(scoopGeom, carbonMat);
    scoop.position.set(0, 0.875, -0.22);
    scoop.castShadow = true;
    bodyPivot.add(scoop);
  }

  // Sculpted teardrop wing mirrors WITH attached carbon stalks into door shoulder!
  const mirrorPts: [number, number][] = [[0, 0], [0.11, 0.015], [0.09, 0.06], [0.02, 0.065]];
  const mirrorGeom = buildExtrudedPart(mirrorPts, 0.06, 0.01);
  const stalkPts: [number, number][] = [[0, 0], [0.14, 0.05], [0.14, 0.075], [0, 0.028]];
  const stalkGeom = buildExtrudedPart(stalkPts, 0.035, 0.005);
  for (const side of [-1, 1]) {
    const stalk = new THREE.Mesh(stalkGeom, carbonMat);
    stalk.position.set(side * 0.78, 0.26, 0.56);
    if (side < 0) stalk.scale.x = -1;
    bodyPivot.add(stalk);

    const m = new THREE.Mesh(mirrorGeom, paintMat);
    m.position.set(side * 0.90, 0.31, 0.54);
    m.rotation.y = side * 0.22;
    m.castShadow = true;
    bodyPivot.add(m);
  }

  // Chrome/Alloy exhaust pipes
  const pipeGeom = new THREE.CylinderGeometry(0.044, 0.048, 0.14, 18, 1, false);
  pipeGeom.rotateX(Math.PI / 2);
  const pipeOffsets = model === 'veloce' ? [-0.46, -0.35, 0.35, 0.46] : [-0.11, 0.11];
  for (const px of pipeOffsets) {
    const pipe = new THREE.Mesh(pipeGeom, alloyMat);
    pipe.position.set(px, -0.12, -hl + 0.09);
    bodyPivot.add(pipe);
  }

  // Sleek flush smoked light housings + sharp thin LED light bars seated snugly on bumper contour
  const headHousingGeom = buildExtrudedPart([[-0.15, -0.018], [0.15, 0.008], [0.12, 0.044], [-0.15, 0.028]], 0.05, 0.005);
  const headLedGeom = buildExtrudedPart([[-0.13, 0.0], [0.13, 0.018], [0.11, 0.034], [-0.13, 0.016]], 0.03, 0.003);
  const tailHousingGeom = buildExtrudedPart([[-0.22, -0.015], [0.22, -0.015], [0.20, 0.038], [-0.20, 0.038]], 0.05, 0.004);
  const tailLedGeom = buildExtrudedPart([[-0.20, 0.0], [0.20, 0.0], [0.18, 0.026], [-0.18, 0.026]], 0.03, 0.003);

  for (const side of [-1, 1]) {
    const hh = new THREE.Mesh(headHousingGeom, carbonMat);
    hh.position.set(side * 0.56, 0.01, hl - 0.22);
    hh.rotation.set(0.18, side * 0.28, 0);
    bodyPivot.add(hh);

    const hlMesh = new THREE.Mesh(headLedGeom, headlightMat);
    hlMesh.position.set(side * 0.56, 0.018, hl - 0.195);
    hlMesh.rotation.set(0.18, side * 0.28, 0);
    bodyPivot.add(hlMesh);

    const th = new THREE.Mesh(tailHousingGeom, carbonMat);
    th.position.set(side * 0.54, 0.15, -hl + 0.075);
    th.rotation.y = -side * 0.16;
    bodyPivot.add(th);

    const tlMesh = new THREE.Mesh(tailLedGeom, brakeLightMat);
    tlMesh.position.set(side * 0.54, 0.156, -hl + 0.052);
    tlMesh.rotation.y = -side * 0.16;
    bodyPivot.add(tlMesh);
  }

  // 4. Four High-Detail Wheel + Gunmetal Twin-Spoke + Rotor + Caliper Assemblies
  const wheelRadius = model === 'veloce' ? 0.35 : 0.34;
  const tireWidth = 0.29;
  const tireGeom = buildSculptedTireGeometry(wheelRadius, tireWidth);
  const barrelGeom = buildSculptedRimBarrel(wheelRadius, tireWidth);
  const spokePts: [number, number][] = [[-0.014, 0.04], [0.014, 0.04], [0.009, wheelRadius * 0.60], [-0.009, wheelRadius * 0.60]];
  const spokeGeom = buildExtrudedPart(spokePts, 0.022, 0.004);
  const rotorGeom = new THREE.CylinderGeometry(wheelRadius * 0.50, wheelRadius * 0.50, 0.024, 28);
  rotorGeom.rotateZ(Math.PI / 2);
  const caliperPts: [number, number][] = [[-0.042, -0.065], [0.042, -0.045], [0.036, 0.075], [-0.036, 0.055]];
  const caliperGeom = buildExtrudedPart(caliperPts, 0.05, 0.007);
  const hubGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.075, 16);
  hubGeom.rotateZ(Math.PI / 2);

  const hw = model === 'veloce' ? 0.83 : 0.82;
  const wheelCoords: [number, number, number][] = [
    [hw, -0.18, env.wheelZFront],
    [-hw, -0.18, env.wheelZFront],
    [hw, -0.18, env.wheelZRear],
    [-hw, -0.18, env.wheelZRear],
  ];

  const wheelSteerGroups: THREE.Group[] = [];
  const wheelSpinGroups: THREE.Group[] = [];
  const caliperGroups: THREE.Group[] = [];

  for (let i = 0; i < 4; i++) {
    const [wx, wy, wz] = wheelCoords[i];
    const sideSign = wx >= 0 ? 1 : -1;

    const steerG = new THREE.Group();
    steerG.position.set(wx, wy, wz);
    root.add(steerG);

    const spinG = new THREE.Group();
    steerG.add(spinG);

    const tire = new THREE.Mesh(tireGeom, tireMat);
    tire.castShadow = true;
    spinG.add(tire);

    const barrel = new THREE.Mesh(barrelGeom, darkAlloyMat);
    spinG.add(barrel);

    const hub = new THREE.Mesh(hubGeom, darkAlloyMat);
    hub.position.x = sideSign * 0.04;
    spinG.add(hub);

    // 5 twin-spoke pairs (10 spokes total) with brushed gunmetal finish
    for (let s = 0; s < 5; s++) {
      const baseAng = (s / 5) * Math.PI * 2;
      for (const offsetAng of [-0.14, 0.14]) {
        const sp = new THREE.Mesh(spokeGeom, alloyMat);
        sp.position.x = sideSign * 0.068;
        sp.rotation.y = Math.PI / 2;
        sp.rotation.x = baseAng + offsetAng;
        spinG.add(sp);
      }
    }

    const rotor = new THREE.Mesh(rotorGeom, alloyMat);
    rotor.position.x = -sideSign * 0.015;
    spinG.add(rotor);

    const calG = new THREE.Group();
    steerG.add(calG);
    const caliper = new THREE.Mesh(caliperGeom, caliperMat);
    caliper.position.set(sideSign * 0.032, 0.04, -wheelRadius * 0.34);
    calG.add(caliper);

    wheelSteerGroups.push(steerG);
    wheelSpinGroups.push(spinG);
    caliperGroups.push(calG);
  }

  // 5. Soft Contact Shadow Quad under car
  const shadowGeo = new THREE.PlaneGeometry(2.8, 5.2);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: tex.contactShadowMap,
    transparent: true,
    depthWrite: false,
    opacity: 0.94,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.name = 'contact-shadow';
  contactShadow.position.y = -0.522;
  root.add(contactShadow);

  return {
    root,
    bodyPivot,
    wheelSteerGroups,
    wheelSpinGroups,
    caliperGroups,
    brakeLightMat,
    contactShadow,
    triangleCount: countTriangles(root),
    materialCount: 9,
  };
}
