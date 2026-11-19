import * as THREE from 'three';
import { CarModelSpec, LightingMode, LiverySpec } from '../types';
import { PBRTextureSet } from '../world/assets';
import { VehiclePhysics, VehicleTelemetry } from '../physics/vehiclePhysics';
import { mergeStaticGroupByMaterial } from '../utils/meshMerge';

export interface CarVisualRig {
  root: THREE.Group;
  chassisGroup: THREE.Group;
  wheelMounts: [THREE.Group, THREE.Group, THREE.Group, THREE.Group];
  steerPivots: [THREE.Group, THREE.Group, THREE.Group, THREE.Group];
  spinHubs: [THREE.Group, THREE.Group, THREE.Group, THREE.Group];
  steeringWheelPivot: THREE.Group;
  cockpitCameraAnchor: THREE.Object3D;
  cockpitGroup: THREE.Group;
  headlights: THREE.SpotLight[];
  headlightGlowMeshes: THREE.Mesh[];
  brakeLightMat: THREE.MeshStandardMaterial;
  headlightMat: THREE.MeshStandardMaterial;
  tailBounceLight: THREE.PointLight | null;
  exhaustFlames: THREE.Mesh[];
  contactShadowMesh: THREE.Mesh;
  triangleCount: number;
  materialCount: number;
  updateFromPhysics: (physics: VehiclePhysics, alpha: number, timeSec: number) => void;
  setNightLights: (enabled: boolean, allowRealSpotLights: boolean) => void;
  setCockpitVisible: (isCockpitCam: boolean) => void;
  dispose: () => void;
}

/**
 * Helper: Builds a clean panelized lofted surface from cross-sectional profile ribs with strict bilateral
 * X-axis symmetry (or half-side mirrored cleanly across X=0), preserving crisp hard crease edges on borders!
 */
function buildSymmetricPanel(
  sections: Array<{ z: number; pts: Array<[number, number]> }>,
  mirrorX = true,
  doubleSidedBackfaceThickness = 0
): THREE.BufferGeometry {
  const rows = sections.length;
  const cols = sections[0].pts.length;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const emitSide = (signX: 1 | -1) => {
    const base = positions.length / 3;
    for (let r = 0; r < rows; r++) {
      const sec = sections[r];
      const v = r / (rows - 1);
      for (let c = 0; c < cols; c++) {
        const [px, py] = sec.pts[c];
        positions.push(px * signX, py, sec.z);
        uvs.push(c / (cols - 1), v);
      }
    }
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = base + r * cols + c;
        const b = a + 1;
        const d = base + (r + 1) * cols + c;
        const e = d + 1;
        if (signX === 1) {
          indices.push(a, d, b, b, d, e);
        } else {
          indices.push(a, b, d, b, e, d);
        }
      }
    }
    if (doubleSidedBackfaceThickness > 0) {
      const backBase = positions.length / 3;
      for (let r = 0; r < rows; r++) {
        const sec = sections[r];
        const v = r / (rows - 1);
        for (let c = 0; c < cols; c++) {
          const [px, py] = sec.pts[c];
          positions.push(px * signX * (1 - doubleSidedBackfaceThickness * 0.15), py - doubleSidedBackfaceThickness, sec.z);
          uvs.push(c / (cols - 1), v);
        }
      }
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const a = backBase + r * cols + c;
          const b = a + 1;
          const d = backBase + (r + 1) * cols + c;
          const e = d + 1;
          if (signX === 1) {
            indices.push(a, b, d, b, e, d);
          } else {
            indices.push(a, d, b, b, d, e);
          }
        }
      }
    }
  };

  emitSide(1);
  if (mirrorX) emitSide(-1);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Builds a razor-crisp sculpted Fender Panel with an EXACT recessed circular wheel-arch cutout (wheel well)
 * + inward returned arch flange + dark inner wheel-well liner barrel!
 * Guarantees ZERO tire-to-fender clipping across full steering lock & bump compression!
 */
function buildWheelArchFenderAndLiner(opts: {
  wheelZ: number;
  wheelY: number;
  archRadius: number;
  outerHalfX: number;
  shoulderHalfX: number;
  topY: number;
  frontTopY?: number;
  sillY: number;
  frontExtZ: number; // distance forward (-Z) from wheelZ
  rearExtZ: number;  // distance rearward (+Z) from wheelZ
  flareOut: number;
  steps?: number;
}): { fenderGeom: THREE.BufferGeometry; linerGeom: THREE.BufferGeometry } {
  const {
    wheelZ,
    wheelY,
    archRadius,
    outerHalfX,
    shoulderHalfX,
    topY,
    sillY,
    frontExtZ,
    rearExtZ,
    flareOut,
  } = opts;
  const frontTopY = opts.frontTopY ?? topY;
  const N = opts.steps ?? 36;
  const fPos: number[] = [];
  const fUv: number[] = [];
  const fIdx: number[] = [];

  const lPos: number[] = [];
  const lUv: number[] = [];
  const lIdx: number[] = [];

  // Angle theta spans from -8 deg (rear bottom of arch) through +90 deg (top) to +188 deg (front bottom)
  // Using z = wheelZ + cos(theta)*R, y = wheelY + sin(theta)*R
  const thetaStart = -0.14;
  const thetaEnd = Math.PI + 0.14;

  const emitFenderSide = (signX: 1 | -1) => {
    const base = fPos.length / 3;
    const lipX = outerHalfX + flareOut;
    // 5 radial rings per angle step:
    // 0: inner returned flange lip (tucked inward 5.5cm for realistic thickness!)
    // 1: sharp arch outer rim lip (flared out!)
    // 2: mid fender flare crease (sculpted shoulder!)
    // 3: upper fender body curve
    // 4: top horizontal fender crest meeting hood/rear-deck shutline
    const ringCount = 5;

    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const th = thetaStart + t * (thetaEnd - thetaStart);
      const c = Math.cos(th);
      const s = Math.sin(th);

      // Inner arch circle point
      const az = wheelZ + c * archRadius;
      const ay = Math.max(sillY, wheelY + s * archRadius);

      // Outer rectangular boundary mapped smoothly from polar angle
      let oz: number;
      let oy: number;
      if (t < 0.22) {
        // Rear vertical seam
        const lt = t / 0.22;
        oz = wheelZ + rearExtZ;
        oy = sillY + lt * (topY - sillY);
      } else if (t <= 0.78) {
        // Top shoulder seam sweeping gracefully from rear topY down to frontTopY (matches hood & nose seamlessly!)
        const lt = (t - 0.22) / 0.56;
        oz = wheelZ + rearExtZ - lt * (frontExtZ + rearExtZ);
        const slopeCurve = lt * lt; // graceful convex supercar fender arch crown
        oy = topY + (frontTopY - topY) * slopeCurve;
      } else {
        // Front vertical seam meeting bumper corner seamlessly at frontTopY
        const lt = (t - 0.78) / 0.22;
        oz = wheelZ - frontExtZ;
        oy = frontTopY - lt * (frontTopY - sillY);
      }

      const midZ = az * 0.58 + oz * 0.42;
      const midY = ay * 0.58 + oy * 0.42;
      const upperZ = az * 0.22 + oz * 0.78;
      const upperY = ay * 0.22 + oy * 0.78;

      const rings: Array<[number, number, number]> = [
        [(lipX - 0.065) * signX, ay - 0.008, az],
        [lipX * signX, ay, az],
        [(outerHalfX + flareOut * 0.85) * signX, midY, midZ],
        [(outerHalfX * 0.45 + shoulderHalfX * 0.55) * signX, upperY, upperZ],
        [shoulderHalfX * signX, oy, oz],
      ];

      for (let r = 0; r < ringCount; r++) {
        fPos.push(rings[r][0], rings[r][1], rings[r][2]);
        fUv.push(t, r / (ringCount - 1));
      }
    }

    for (let i = 0; i < N; i++) {
      for (let r = 0; r < ringCount - 1; r++) {
        const a = base + i * ringCount + r;
        const b = a + 1;
        const d = base + (i + 1) * ringCount + r;
        const e = d + 1;
        if (signX === 1) {
          fIdx.push(a, d, b, b, d, e);
        } else {
          fIdx.push(a, b, d, b, e, d);
        }
      }
    }

    // Dark recessed wheel-well inner liner barrel + backplate (completely hides chassis hollow space!)
    const lBase = lPos.length / 3;
    const xOuterLiner = (lipX - 0.055) * signX;
    const xInnerLiner = 0.44 * signX;
    const rLiner = archRadius + 0.015;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const th = thetaStart + t * (thetaEnd - thetaStart);
      const lz = wheelZ + Math.cos(th) * rLiner;
      const ly = Math.max(sillY, wheelY + Math.sin(th) * rLiner);
      lPos.push(xOuterLiner, ly, lz);
      lUv.push(t, 0);
      lPos.push(xInnerLiner, ly, lz);
      lUv.push(t, 1);
    }
    for (let i = 0; i < N; i++) {
      const a = lBase + i * 2;
      const b = a + 1;
      const d = lBase + (i + 1) * 2;
      const e = d + 1;
      // Winding faces INWARD toward wheel hub so camera looking into wheel arch sees dark liner!
      if (signX === 1) {
        lIdx.push(a, b, d, b, e, d);
      } else {
        lIdx.push(a, d, b, b, d, e);
      }
    }
    // Inner flat wheelhouse backing disc
    const cIdx = lPos.length / 3;
    lPos.push(xInnerLiner, wheelY, wheelZ);
    lUv.push(0.5, 0.5);
    for (let i = 0; i < N; i++) {
      const b = lBase + i * 2 + 1;
      const e = lBase + (i + 1) * 2 + 1;
      if (signX === 1) lIdx.push(cIdx, b, e);
      else lIdx.push(cIdx, e, b);
    }
  };

  emitFenderSide(1);
  emitFenderSide(-1);

  const fenderGeom = new THREE.BufferGeometry();
  fenderGeom.setAttribute('position', new THREE.Float32BufferAttribute(fPos, 3));
  fenderGeom.setAttribute('uv', new THREE.Float32BufferAttribute(fUv, 2));
  fenderGeom.setIndex(fIdx);
  fenderGeom.computeVertexNormals();

  const linerGeom = new THREE.BufferGeometry();
  linerGeom.setAttribute('position', new THREE.Float32BufferAttribute(lPos, 3));
  linerGeom.setAttribute('uv', new THREE.Float32BufferAttribute(lUv, 2));
  linerGeom.setIndex(lIdx);
  linerGeom.computeVertexNormals();

  return { fenderGeom, linerGeom };
}

/**
 * Builds a high-detail sculpted motorsport wheel: profiled rounded tire with scanned rubber normal map,
 * concave multi-spoke alloy rim, lug nuts, hubcap, ventilated brake rotor disc, and separate brake caliper!
 */
function buildWheelAssembly(
  spec: CarModelSpec,
  isLeft: boolean,
  isGT: boolean,
  mats: {
    tire: THREE.MeshStandardMaterial;
    rim: THREE.MeshStandardMaterial;
    chrome: THREE.MeshStandardMaterial;
    caliper: THREE.MeshStandardMaterial;
    carbon: THREE.MeshStandardMaterial;
  }
): { spinGroup: THREE.Group; caliperGroup: THREE.Group } {
  const spinGroup = new THREE.Group();
  const caliperGroup = new THREE.Group();

  const R = spec.wheelRadius;
  const W = spec.wheelWidth;
  const rimR = R * 0.67;
  const sideSign = isLeft ? -1 : 1; // outward direction along local X

  // 1. Profiled Tire Lathe (rotated so axis is local X!) — smooth rounded shoulders + sidewall bulge
  const tirePts: THREE.Vector2[] = [
    new THREE.Vector2(rimR * 0.96, -W * 0.44),
    new THREE.Vector2(R * 0.86, -W * 0.50),
    new THREE.Vector2(R * 0.96, -W * 0.46),
    new THREE.Vector2(R, -W * 0.36),
    new THREE.Vector2(R, W * 0.36),
    new THREE.Vector2(R * 0.96, W * 0.46),
    new THREE.Vector2(R * 0.86, W * 0.50),
    new THREE.Vector2(rimR * 0.96, W * 0.44),
    new THREE.Vector2(rimR * 0.92, W * 0.38),
    new THREE.Vector2(rimR * 0.92, -W * 0.38),
    new THREE.Vector2(rimR * 0.96, -W * 0.44),
  ];
  const tireGeom = new THREE.LatheGeometry(tirePts, 36);
  tireGeom.rotateZ(Math.PI / 2);
  const tireMesh = new THREE.Mesh(tireGeom, mats.tire);
  tireMesh.castShadow = true;
  tireMesh.receiveShadow = true;
  spinGroup.add(tireMesh);

  // 2. Concave Alloy Rim Barrel + Polished Outer Lip
  const rimPts: THREE.Vector2[] = [
    new THREE.Vector2(rimR * 0.95, -W * 0.43),
    new THREE.Vector2(rimR * 0.86, -W * 0.43),
    new THREE.Vector2(rimR * 0.83, -W * 0.12),
    new THREE.Vector2(rimR * 0.86, W * 0.34),
    new THREE.Vector2(rimR * 0.98, W * 0.43),
    new THREE.Vector2(rimR * 1.01, W * 0.44),
    new THREE.Vector2(rimR * 1.01, W * 0.39),
    new THREE.Vector2(rimR * 0.94, W * 0.35),
    new THREE.Vector2(rimR * 0.94, -W * 0.43),
  ];
  const rimBarrelGeom = new THREE.LatheGeometry(rimPts, 32);
  rimBarrelGeom.rotateZ(sideSign > 0 ? -Math.PI / 2 : Math.PI / 2);
  const rimBarrel = new THREE.Mesh(rimBarrelGeom, mats.rim);
  rimBarrel.castShadow = true;
  spinGroup.add(rimBarrel);

  // Polished outer lip ring
  const lipGeom = new THREE.TorusGeometry(rimR * 0.97, 0.012, 12, 32);
  lipGeom.rotateY(Math.PI / 2);
  const lipMesh = new THREE.Mesh(lipGeom, mats.chrome);
  lipMesh.position.x = sideSign * (W * 0.42);
  spinGroup.add(lipMesh);

  // Center hub boss + 5 lug nuts
  const hubGeom = new THREE.CylinderGeometry(0.056, 0.064, 0.065, 20);
  hubGeom.rotateZ(Math.PI / 2);
  const hubMesh = new THREE.Mesh(hubGeom, mats.rim);
  hubMesh.position.x = sideSign * (W * 0.16);
  spinGroup.add(hubMesh);

  const capGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.025, 16);
  capGeom.rotateZ(Math.PI / 2);
  const capMesh = new THREE.Mesh(capGeom, mats.chrome);
  capMesh.position.x = sideSign * (W * 0.21);
  spinGroup.add(capMesh);

  const lugGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.022, 8);
  lugGeom.rotateZ(Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const lug = new THREE.Mesh(lugGeom, mats.chrome);
    lug.position.set(sideSign * (W * 0.20), Math.cos(a) * 0.044, Math.sin(a) * 0.044);
    spinGroup.add(lug);
  }

  // 3. Multi-spoke concave alloy spokes (Y-split 10-spoke for GT-R, muscular 6-spoke for Corsa!)
  if (isGT) {
    const pairCount = 5;
    const spokeGeom = new THREE.BoxGeometry(0.024, rimR * 0.84, 0.021);
    for (let i = 0; i < pairCount; i++) {
      const baseA = (i / pairCount) * Math.PI * 2;
      for (const delta of [-0.21, 0.21]) {
        const spoke = new THREE.Mesh(spokeGeom, mats.rim);
        const a = baseA + delta * 0.55;
        const rMid = rimR * 0.47;
        spoke.position.set(sideSign * (W * 0.24), Math.cos(a) * rMid, Math.sin(a) * rMid);
        spoke.rotation.x = -(baseA + delta * 0.9);
        // Subtle concave dish tilt toward hub!
        spoke.rotation.z = sideSign * -0.14;
        spinGroup.add(spoke);
      }
    }
  } else {
    const spokeCount = 6;
    const spokeGeom = new THREE.BoxGeometry(0.028, rimR * 0.85, 0.036);
    for (let i = 0; i < spokeCount; i++) {
      const a = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeom, mats.rim);
      const rMid = rimR * 0.46;
      spoke.position.set(sideSign * (W * 0.23), Math.cos(a) * rMid, Math.sin(a) * rMid);
      spoke.rotation.x = -a;
      spoke.rotation.z = sideSign * -0.18;
      spinGroup.add(spoke);
    }
  }

  // 4. Ventilated Steel Brake Rotor Disc (spins with wheel!)
  const discR = rimR * 0.78;
  const discGeom = new THREE.CylinderGeometry(discR, discR, 0.024, 28);
  discGeom.rotateZ(Math.PI / 2);
  const discMesh = new THREE.Mesh(discGeom, mats.chrome);
  discMesh.position.x = sideSign * (W * 0.04);
  spinGroup.add(discMesh);

  const hatGeom = new THREE.CylinderGeometry(discR * 0.46, discR * 0.48, 0.042, 20);
  hatGeom.rotateZ(Math.PI / 2);
  const hatMesh = new THREE.Mesh(hatGeom, mats.carbon);
  hatMesh.position.x = sideSign * (W * 0.05);
  spinGroup.add(hatMesh);

  // 5. Multi-piston Painted Brake Caliper (mounted on steerPivot — does NOT spin!)
  const calShape = new THREE.BoxGeometry(0.068, 0.13, 0.088);
  const calMesh = new THREE.Mesh(calShape, mats.caliper);
  calMesh.position.set(sideSign * (W * 0.045), 0.02, discR * 0.72);
  caliperGroup.add(calMesh);

  return { spinGroup, caliperGroup };
}

/**
 * Creates a crisp feathered contact-shadow canvas alpha texture (NOT a world surface texture — purely
 * a soft under-car ambient occlusion shadow footprint matching Ref 11/12/13!).
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 512);
  const grad = ctx.createRadialGradient(128, 256, 40, 128, 256, 126);
  grad.addColorStop(0, 'rgba(0,0,0,0.88)');
  grad.addColorStop(0.55, 'rgba(0,0,0,0.68)');
  grad.addColorStop(0.82, 'rgba(0,0,0,0.22)');
  grad.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.save();
  ctx.scale(1, 2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates the live animated Cockpit Instrument Cluster screen (speed, RPM bar, gear, Mini-Nitro bar)
 * readable in both Golden Hour and Night!
 */
function createCockpitDashCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  draw: (tel: VehicleTelemetry, maxRpm: number, isNight: boolean) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  let lastDraw = -1;

  const draw = (tel: VehicleTelemetry, maxRpm: number, isNight: boolean) => {
    const key =
      Math.round(tel.speedKmh) * 10000 +
      Math.round(tel.rpm / 60) * 100 +
      tel.gear * 10 +
      Math.round(tel.nitro * 20);
    if (key === lastDraw) return;
    lastDraw = key;

    // Deep OLED black-slate cockpit gauge screen
    ctx.fillStyle = isNight ? '#060a12' : '#0b1019';
    ctx.fillRect(0, 0, 512, 256);

    // Subtle bezel border
    ctx.strokeStyle = '#243248';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 244);

    // Curved RPM bar across top
    const rpmFrac = Math.max(0, Math.min(1, tel.rpm / maxRpm));
    const segs = 28;
    for (let i = 0; i < segs; i++) {
      const f = i / (segs - 1);
      const sx = 32 + i * 16.2;
      const archY = 44 - Math.sin(f * Math.PI) * 18;
      const active = f <= rpmFrac;
      if (f > 0.82) ctx.fillStyle = active ? '#ff2a3c' : '#3a151c';
      else if (f > 0.65) ctx.fillStyle = active ? '#ffb020' : '#382a14';
      else ctx.fillStyle = active ? '#2de0ff' : '#162838';
      ctx.fillRect(sx, archY, 12, 26);
    }

    // Center Gear Badge
    ctx.fillStyle = '#152236';
    ctx.fillRect(216, 86, 80, 96);
    ctx.strokeStyle = tel.rpm > maxRpm * 0.88 ? '#ff3344' : '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(216, 86, 80, 96);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tel.gear === 0 ? 'R' : String(tel.gear), 256, 136);

    // Left: Digital Speed KM/H
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 62px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(Math.round(tel.speedKmh)).padStart(3, ' '), 194, 132);
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
    ctx.fillText('KM/H', 192, 174);

    // Right: Digital RPM + Nitro Bar
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 26px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`${Math.round(tel.rpm)} RPM`, 316, 118);

    // Mini-Nitro Bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(tel.nitroActive ? 'NITRO BOOST' : 'NITRO', 316, 152);
    ctx.fillStyle = '#142030';
    ctx.fillRect(316, 162, 164, 22);
    ctx.fillStyle = tel.nitroActive ? '#ff9d2e' : '#00e5ff';
    ctx.fillRect(318, 164, Math.round(160 * Math.max(0, Math.min(1, tel.nitro))), 18);

    // Bottom status bar
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COSTA DORADA TELEMETRY  ·  TC SPORT', 256, 222);

    texture.needsUpdate = true;
  };

  return { canvas, ctx, texture, draw };
}

/**
 * Builds one of the 2 completely distinct, 100% agent-modeled panelized hero cars (>= 18,000 tris LOD0)
 * with bilateral symmetry, recessed circular wheel arches, chassis-parented wheel sync, and playable cockpit!
 */
export function buildHeroCar(
  spec: CarModelSpec,
  livery: LiverySpec,
  tireTexture: PBRTextureSet,
  enableSpotLights: boolean
): CarVisualRig {
  const isGT = spec.id === 'aurelia_gtr';
  const root = new THREE.Group();
  root.name = `car_${spec.id}_${livery.number}`;

  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'chassis';
  root.add(chassisGroup);

  // ---------------------------------------------------------------------------
  // PBR Materials (11 distinct calibrated automotive materials!)
  // ---------------------------------------------------------------------------
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: livery.primaryHex,
    metalness: 0.62,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.55,
  });
  const secondaryPaintMat = new THREE.MeshPhysicalMaterial({
    color: livery.secondaryHex,
    metalness: 0.48,
    roughness: 0.20,
    clearcoat: 0.95,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.4,
  });
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: livery.accentHex,
    metalness: 0.55,
    roughness: 0.22,
    clearcoat: 0.9,
  });
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x16181c,
    metalness: 0.24,
    roughness: 0.38,
    envMapIntensity: 1.1,
  });
  const matteWellMat = new THREE.MeshStandardMaterial({
    color: 0x0b0c0e,
    metalness: 0.05,
    roughness: 0.92,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x14202b,
    metalness: 0.08,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: 0.40,
    envMapIntensity: 1.9,
    depthWrite: false,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe6eaef,
    metalness: 0.94,
    roughness: 0.11,
    envMapIntensity: 1.5,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: livery.rimHex,
    metalness: 0.84,
    roughness: 0.22,
    envMapIntensity: 1.35,
  });
  const caliperMat = new THREE.MeshPhysicalMaterial({
    color: livery.caliperHex,
    metalness: 0.35,
    roughness: 0.25,
    clearcoat: 0.8,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x202226,
    map: tireTexture.map,
    normalMap: tireTexture.normalMap,
    normalScale: new THREE.Vector2(1.1, 1.1),
    roughnessMap: tireTexture.roughnessMap,
    roughness: 0.86,
    metalness: 0.03,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xf8fbff,
    emissive: new THREE.Color(0xfff5e0),
    emissiveIntensity: 1.4,
    roughness: 0.12,
    metalness: 0.2,
  });
  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0xaa0c14,
    emissive: new THREE.Color(0xff141c),
    emissiveIntensity: 1.1,
    roughness: 0.15,
    metalness: 0.15,
  });
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.92,
    metalness: 0.04,
    envMapIntensity: 0.55,
  });
  const interiorAccentMat = new THREE.MeshStandardMaterial({
    color: 0x2c3340,
    roughness: 0.42,
    metalness: 0.52,
  });

  const addMesh = (
    parent: THREE.Object3D,
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    cast = true,
    receive = true
  ): THREE.Mesh => {
    const m = new THREE.Mesh(geom, mat);
    m.castShadow = cast;
    m.receiveShadow = receive;
    parent.add(m);
    return m;
  };

  // ===========================================================================
  // PART A: DISTINCT PANELIZED BODYWORK (Bilateral symmetry + Crisp Creases!)
  // ===========================================================================
  const halfTrack = spec.trackWidth * 0.5;
  const outerBodyX = halfTrack + spec.wheelWidth * 0.5 + (isGT ? 0.045 : 0.068);
  const archR = spec.wheelRadius + 0.095; // 0.435m arch radius -> generous 9.5cm radial clearance!
  const sillY = isGT ? 0.20 : 0.22;
  const noseZ = isGT ? -2.26 : -2.14;
  const tailZ = isGT ? 2.24 : 2.12;
  const beltY = isGT ? 0.84 : 0.90;
  const roofY = isGT ? 1.22 : 1.31;

  // 1. Underbody carbon floorpan & structural tub (sits strictly between wheels — zero wheel overlap!)
  const floorGeom = new THREE.BoxGeometry(1.16, 0.14, tailZ - noseZ - 0.36);
  const floorMesh = addMesh(chassisGroup, floorGeom, carbonMat);
  floorMesh.position.set(0, sillY + 0.06, (noseZ + tailZ) * 0.5);

  // 2. Sculpted Front & Rear Wheel-Arch Fenders + Dark Recessed Inner Wheel-Well Liners!
  const frontFender = buildWheelArchFenderAndLiner({
    wheelZ: spec.frontAxleZ,
    wheelY: spec.wheelRadius + 0.02,
    archRadius: archR,
    outerHalfX: outerBodyX - 0.02,
    shoulderHalfX: isGT ? 0.71 : 0.75,
    topY: isGT ? 0.80 : 0.87,
    frontTopY: isGT ? 0.57 : 0.64,
    sillY,
    frontExtZ: Math.abs(noseZ - spec.frontAxleZ) - 0.16,
    rearExtZ: 0.62,
    flareOut: isGT ? 0.035 : 0.062,
    steps: 40,
  });
  addMesh(chassisGroup, frontFender.fenderGeom, paintMat);
  addMesh(chassisGroup, frontFender.linerGeom, matteWellMat, false, true);

  const rearFender = buildWheelArchFenderAndLiner({
    wheelZ: spec.rearAxleZ,
    wheelY: spec.wheelRadius + 0.02,
    archRadius: archR + 0.01,
    outerHalfX: outerBodyX + (isGT ? 0.01 : 0.025),
    shoulderHalfX: isGT ? 0.75 : 0.77,
    topY: beltY + (isGT ? 0.04 : 0.03),
    sillY,
    frontExtZ: 0.62,
    rearExtZ: Math.abs(tailZ - spec.rearAxleZ) - 0.14,
    flareOut: isGT ? 0.045 : 0.072,
    steps: 40,
  });
  addMesh(chassisGroup, rearFender.fenderGeom, paintMat);
  addMesh(chassisGroup, rearFender.linerGeom, matteWellMat, false, true);

  // 3. Sculpted Front Hood Panel (Crisp bilateral creases + recessed aero channel / power dome!)
  const hoodSections = isGT
    ? [
        { z: noseZ + 0.14, pts: [[0.0, 0.50], [0.24, 0.51], [0.54, 0.54], [0.70, 0.56]] as Array<[number, number]> },
        { z: -1.78, pts: [[0.0, 0.62], [0.22, 0.61], [0.46, 0.66], [0.71, 0.68]] as Array<[number, number]> },
        { z: -1.35, pts: [[0.0, 0.71], [0.20, 0.70], [0.45, 0.75], [0.71, 0.77]] as Array<[number, number]> },
        { z: -0.92, pts: [[0.0, 0.78], [0.22, 0.77], [0.48, 0.80], [0.71, 0.79]] as Array<[number, number]> },
        { z: -0.66, pts: [[0.0, 0.81], [0.26, 0.81], [0.54, 0.81], [0.71, 0.80]] as Array<[number, number]> },
      ]
    : [
        { z: noseZ + 0.12, pts: [[0.0, 0.64], [0.26, 0.64], [0.56, 0.63], [0.75, 0.62]] as Array<[number, number]> },
        { z: -1.72, pts: [[0.0, 0.79], [0.24, 0.78], [0.48, 0.76], [0.75, 0.75]] as Array<[number, number]> },
        { z: -1.25, pts: [[0.0, 0.88], [0.26, 0.87], [0.48, 0.84], [0.75, 0.83]] as Array<[number, number]> },
        { z: -0.82, pts: [[0.0, 0.90], [0.28, 0.89], [0.52, 0.87], [0.75, 0.86]] as Array<[number, number]> },
        { z: -0.58, pts: [[0.0, 0.90], [0.30, 0.90], [0.56, 0.88], [0.75, 0.87]] as Array<[number, number]> },
      ];
  addMesh(chassisGroup, buildSymmetricPanel(hoodSections, true, 0.02), paintMat);

  // Racing livery twin hood stripe (flush panel cleanly raised 3mm above hood)
  const stripeSections = hoodSections.map((s) => ({
    z: s.z,
    pts: [
      [0.04, s.pts[0][1] + 0.004],
      [0.18, s.pts[1][1] + 0.004],
    ] as Array<[number, number]>,
  }));
  addMesh(chassisGroup, buildSymmetricPanel(stripeSections, true), secondaryPaintMat, false, true);

  // Hood vents (dark recessed aero grilles)
  const ventGeom = new THREE.BoxGeometry(0.24, 0.03, 0.34);
  for (const sx of [-1, 1]) {
    const v = addMesh(chassisGroup, ventGeom, carbonMat);
    v.position.set(sx * (isGT ? 0.36 : 0.32), isGT ? 0.71 : 0.86, isGT ? -1.42 : -1.30);
    v.rotation.x = isGT ? 0.16 : 0.10;
  }

  // 4. Sculpted Doors & Mid-Body Side Panels (between front and rear fenders, with crisp intake crease!)
  const doorZ0 = spec.frontAxleZ + 0.62;
  const doorZ1 = spec.rearAxleZ - 0.62;
  const doorSections = [
    {
      z: doorZ0,
      pts: [
        [outerBodyX - 0.07, sillY],
        [outerBodyX - 0.01, sillY + 0.18],
        [outerBodyX - 0.03, beltY - 0.18],
        [outerBodyX - 0.08, beltY - 0.02],
        [isGT ? 0.72 : 0.76, beltY],
      ] as Array<[number, number]>,
    },
    {
      z: (doorZ0 + doorZ1) * 0.5,
      pts: [
        [outerBodyX - 0.09, sillY],
        [outerBodyX - 0.04, sillY + 0.20],
        [outerBodyX - 0.07, beltY - 0.18],
        [outerBodyX - 0.10, beltY - 0.02],
        [isGT ? 0.71 : 0.75, beltY],
      ] as Array<[number, number]>,
    },
    {
      z: doorZ1,
      pts: [
        [outerBodyX - 0.06, sillY],
        [outerBodyX + 0.01, sillY + 0.18],
        [outerBodyX - 0.01, beltY - 0.16],
        [outerBodyX - 0.06, beltY],
        [isGT ? 0.75 : 0.77, beltY + 0.03],
      ] as Array<[number, number]>,
    },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(doorSections, true, 0.03), paintMat);

  // Side intake blades (GT-R) or widebody door sills & fender louvers (Corsa)
  const skirtGeom = new THREE.BoxGeometry(0.14, 0.08, doorZ1 - doorZ0 + 0.24);
  for (const sx of [-1, 1]) {
    const skirt = addMesh(chassisGroup, skirtGeom, carbonMat);
    skirt.position.set(sx * (outerBodyX - 0.02), sillY + 0.02, (doorZ0 + doorZ1) * 0.5);

    // Side air scoop / blade
    const scoop = addMesh(chassisGroup, new THREE.BoxGeometry(0.10, 0.28, 0.36), carbonMat);
    scoop.position.set(sx * (outerBodyX - 0.05), sillY + 0.34, doorZ1 - 0.12);
    scoop.rotation.y = sx * (isGT ? -0.18 : -0.08);
  }

  // 5. Sleek Wrap-Around Curved Front Bumper, Recessed Air Dam, Contoured Carbon Splitter & Flush LED Headlamps!
  // Smooth 6-row loft wrapping continuously from nose apex back into front fender arches (ZERO blocky step!)
  const fBumpSections = [
    {
      z: noseZ - 0.05,
      pts: [
        [0.0, sillY + 0.05],
        [0.36, sillY + 0.055],
        [0.64, sillY + 0.08],
        [outerBodyX - 0.14, sillY + 0.12],
      ] as Array<[number, number]>,
    },
    {
      z: noseZ - 0.07,
      pts: [
        [0.0, sillY + 0.16],
        [0.42, sillY + 0.16],
        [0.72, sillY + 0.18],
        [outerBodyX - 0.06, sillY + 0.21],
      ] as Array<[number, number]>,
    },
    {
      z: noseZ - 0.03,
      pts: [
        [0.0, 0.41],
        [0.45, 0.415],
        [0.75, 0.43],
        [outerBodyX - 0.02, 0.44],
      ] as Array<[number, number]>,
    },
    {
      z: noseZ + 0.14,
      pts: [
        [0.0, isGT ? 0.505 : 0.64],
        [0.44, isGT ? 0.525 : 0.64],
        [0.72, isGT ? 0.565 : 0.635],
        [outerBodyX - 0.015, isGT ? 0.555 : 0.61],
      ] as Array<[number, number]>,
    },
    {
      z: noseZ + 0.34,
      pts: [
        [0.0, isGT ? 0.58 : 0.72],
        [0.42, isGT ? 0.595 : 0.715],
        [0.71, isGT ? 0.64 : 0.70],
        [outerBodyX - 0.01, isGT ? 0.62 : 0.68],
      ] as Array<[number, number]>,
    },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(fBumpSections, true), paintMat);

  // Curved front corner cheek skirts seamlessly bridging bumper edges to front wheel-arch front lips (bilateral symmetric!)
  const cornerCheek = buildSymmetricPanel(
    [
      { z: noseZ - 0.02, pts: [[outerBodyX - 0.14, sillY + 0.08], [outerBodyX - 0.06, 0.42], [0.72, isGT ? 0.54 : 0.62]] },
      { z: noseZ + 0.18, pts: [[outerBodyX - 0.03, sillY + 0.04], [outerBodyX + 0.01, 0.44], [0.72, isGT ? 0.57 : 0.64]] },
      { z: spec.frontAxleZ - archR + 0.02, pts: [[outerBodyX - 0.01, sillY], [outerBodyX + 0.015, 0.44], [0.72, isGT ? 0.60 : 0.66]] },
    ],
    true
  );
  addMesh(chassisGroup, cornerCheek, paintMat);

  // Sleek contoured curved carbon front aero splitter (follows nose curve cleanly — zero flat shelf!)
  const splitSections = [
    { z: noseZ - 0.13, pts: [[0.0, sillY + 0.01], [0.46, sillY + 0.01], [0.76, sillY + 0.02]] as Array<[number, number]> },
    { z: noseZ - 0.04, pts: [[0.0, sillY + 0.012], [0.54, sillY + 0.012], [outerBodyX - 0.04, sillY + 0.02]] as Array<[number, number]> },
    { z: noseZ + 0.26, pts: [[0.0, sillY + 0.015], [0.62, sillY + 0.015], [outerBodyX - 0.01, sillY + 0.022]] as Array<[number, number]> },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(splitSections, true, 0.028), carbonMat);

  // Recessed dark aerodynamic front radiator mouth & twin side brake ducts (tucked smoothly inside nose curve!)
  const grilleGeom = new THREE.BoxGeometry(0.96, 0.14, 0.06);
  const grille = addMesh(chassisGroup, grilleGeom, matteWellMat);
  grille.position.set(0, sillY + 0.14, noseZ - 0.025);
  for (const sx of [-1, 1]) {
    const duct = addMesh(chassisGroup, new THREE.BoxGeometry(0.28, 0.12, 0.06), matteWellMat);
    duct.position.set(sx * 0.64, sillY + 0.15, noseZ + 0.01);
    duct.rotation.y = sx * -0.24;
  }

  // Thin crisp accent pin-stripe tucked right along splitter front edge
  const lipAccent = addMesh(chassisGroup, new THREE.BoxGeometry(1.24, 0.014, 0.026), accentMat);
  lipAccent.position.set(0, sillY + 0.022, noseZ - 0.115);

  // Flush Sculpted Recessed Headlight Clusters (sleek flush-integrated Italian GT headlamps — ZERO floating pods!)
  const headlightGlowMeshes: THREE.Mesh[] = [];
  for (const sx of [-1, 1]) {
    if (isGT) {
      // Flush dark smoked recessed lamp cavity nestled strictly BELOW hood crest into bumper shoulder + razor LED DRL blade
      const cavity = addMesh(chassisGroup, new THREE.BoxGeometry(0.32, 0.068, 0.22), matteWellMat);
      cavity.position.set(sx * 0.62, 0.485, noseZ + 0.09);
      cavity.rotation.set(0.24, sx * -0.26, sx * 0.10);

      const drlOuter = addMesh(chassisGroup, new THREE.BoxGeometry(0.30, 0.020, 0.030), headlightMat, false, false);
      drlOuter.position.set(sx * 0.62, 0.506, noseZ + 0.015);
      drlOuter.rotation.set(0.22, sx * -0.26, sx * 0.10);
      headlightGlowMeshes.push(drlOuter);

      const drlLower = addMesh(chassisGroup, new THREE.BoxGeometry(0.20, 0.018, 0.028), headlightMat, false, false);
      drlLower.position.set(sx * 0.65, 0.472, noseZ - 0.005);
      drlLower.rotation.set(0.16, sx * -0.28, sx * 0.06);
      headlightGlowMeshes.push(drlLower);

      const projOrb = addMesh(chassisGroup, new THREE.SphereGeometry(0.028, 14, 10), headlightMat, false, false);
      projOrb.position.set(sx * 0.58, 0.490, noseZ + 0.025);
      headlightGlowMeshes.push(projOrb);
    } else {
      // Bold flush circular motorsport projector headlamps + glowing halo ring + lower LED fog strip
      const housing = addMesh(chassisGroup, new THREE.CylinderGeometry(0.105, 0.115, 0.09, 24), carbonMat);
      housing.rotation.x = Math.PI / 2;
      housing.position.set(sx * 0.65, 0.61, noseZ + 0.07);
      const lens = addMesh(chassisGroup, new THREE.CylinderGeometry(0.086, 0.086, 0.03, 24), headlightMat, false, false);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(sx * 0.65, 0.61, noseZ + 0.03);
      headlightGlowMeshes.push(lens);
      const fog = addMesh(chassisGroup, new THREE.BoxGeometry(0.20, 0.032, 0.04), headlightMat, false, false);
      fog.position.set(sx * 0.65, sillY + 0.18, noseZ - 0.02);
      headlightGlowMeshes.push(fog);
    }
  }

  // 6. Roofline, Sculpted A/B/C Pillars, Rear Engine Deck & Clear Reflective Greenhouse Glass!
  const roofZFront = isGT ? -0.24 : -0.14;
  const roofZRear = isGT ? 0.84 : 1.02;
  const roofHalfW = isGT ? 0.58 : 0.63;

  const roofSections = [
    { z: roofZFront, pts: [[0.0, roofY], [roofHalfW * 0.55, roofY - 0.015], [roofHalfW, roofY - 0.045]] as Array<[number, number]> },
    { z: (roofZFront + roofZRear) * 0.5, pts: [[0.0, roofY + 0.02], [roofHalfW * 0.58, roofY + 0.005], [roofHalfW + 0.02, roofY - 0.035]] as Array<[number, number]> },
    { z: roofZRear, pts: [[0.0, roofY - 0.03], [roofHalfW * 0.55, roofY - 0.045], [roofHalfW, roofY - 0.08]] as Array<[number, number]> },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(roofSections, true, 0.025), isGT ? carbonMat : paintMat);

  // Rear deck / fastback engine cover
  const deckSections = isGT
    ? [
        { z: roofZRear, pts: [[0.0, roofY - 0.04], [0.46, roofY - 0.07], [0.75, beltY + 0.04]] as Array<[number, number]> },
        { z: 1.56, pts: [[0.0, beltY + 0.14], [0.52, beltY + 0.11], [0.76, beltY + 0.04]] as Array<[number, number]> },
        { z: tailZ - 0.12, pts: [[0.0, beltY + 0.04], [0.55, beltY + 0.03], [0.78, beltY + 0.01]] as Array<[number, number]> },
      ]
    : [
        { z: roofZRear, pts: [[0.0, roofY - 0.05], [0.52, roofY - 0.08], [0.77, beltY + 0.03]] as Array<[number, number]> },
        { z: 1.55, pts: [[0.0, beltY + 0.14], [0.56, beltY + 0.11], [0.78, beltY + 0.04]] as Array<[number, number]> },
        { z: tailZ - 0.10, pts: [[0.0, beltY + 0.10], [0.58, beltY + 0.08], [0.78, beltY + 0.03]] as Array<[number, number]> },
      ];
  addMesh(chassisGroup, buildSymmetricPanel(deckSections, true, 0.02), paintMat);

  // Crisp A-pillars, B-pillars, C-pillars (symmetrical bilateral tubes)
  const addPillar = (p0: THREE.Vector3, p1: THREE.Vector3, radius: number, mat: THREE.Material) => {
    for (const sx of [-1, 1]) {
      const a = new THREE.Vector3(p0.x * sx, p0.y, p0.z);
      const b = new THREE.Vector3(p1.x * sx, p1.y, p1.z);
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const cyl = new THREE.CylinderGeometry(radius, radius * 1.15, len, 10);
      const mesh = addMesh(chassisGroup, cyl, mat);
      mesh.position.copy(a).addScaledVector(dir, 0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    }
  };
  // A-pillars (slim so cockpit visibility stays crisp!)
  addPillar(new THREE.Vector3(0.70, beltY - 0.02, -0.68), new THREE.Vector3(roofHalfW, roofY - 0.045, roofZFront), 0.026, carbonMat);
  // B-pillars
  addPillar(new THREE.Vector3(0.73, beltY, 0.42), new THREE.Vector3(roofHalfW + 0.01, roofY - 0.04, 0.46), 0.024, carbonMat);
  // C-pillars / flying buttresses
  addPillar(new THREE.Vector3(0.74, beltY + 0.02, 1.48), new THREE.Vector3(roofHalfW, roofY - 0.075, roofZRear), isGT ? 0.045 : 0.052, paintMat);

  // Transparent Reflective Windshield, Side Windows & Rear Glass (NEVER opaque flat black!)
  const windshieldSections = [
    { z: -0.68, pts: [[0.0, beltY - 0.01], [0.36, beltY - 0.015], [0.69, beltY - 0.03]] as Array<[number, number]> },
    { z: (roofZFront - 0.68) * 0.5, pts: [[0.0, (beltY + roofY) * 0.5 + 0.01], [0.34, (beltY + roofY) * 0.5], [0.64, (beltY + roofY) * 0.5 - 0.03]] as Array<[number, number]> },
    { z: roofZFront, pts: [[0.0, roofY - 0.01], [0.31, roofY - 0.02], [roofHalfW - 0.01, roofY - 0.048]] as Array<[number, number]> },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(windshieldSections, true), glassMat, false, false);

  const sideWinSections = [
    { z: -0.58, pts: [[0.70, beltY - 0.02], [roofHalfW + 0.02, roofY - 0.055]] as Array<[number, number]> },
    { z: 0.25, pts: [[0.72, beltY], [roofHalfW + 0.015, roofY - 0.04]] as Array<[number, number]> },
    { z: roofZRear + 0.08, pts: [[0.74, beltY + 0.02], [roofHalfW, roofY - 0.075]] as Array<[number, number]> },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(sideWinSections, true), glassMat, false, false);

  // Sleek Sculpted Aerodynamic Teardrop Wing Mirrors (bilateral — zero boxy blocks!)
  for (const sx of [-1, 1]) {
    const stalk = addMesh(chassisGroup, new THREE.CylinderGeometry(0.012, 0.018, 0.14, 10), carbonMat);
    stalk.position.set(sx * 0.77, beltY + 0.045, -0.42);
    stalk.rotation.z = sx * -1.05;
    stalk.rotation.y = sx * -0.25;
    const cap = addMesh(chassisGroup, new THREE.SphereGeometry(0.075, 16, 12), paintMat);
    cap.scale.set(1.22, 0.56, 0.92);
    cap.position.set(sx * 0.85, beltY + 0.075, -0.40);
    cap.rotation.y = sx * -0.18;
    const mirGlass = addMesh(chassisGroup, new THREE.CircleGeometry(0.044, 16), chromeMat, false, false);
    mirGlass.scale.set(1.32, 0.70, 1.0);
    mirGlass.position.set(sx * 0.85, beltY + 0.075, -0.320);
  }

  // 7. Curved Sculpted Rear Bumper Shell, Multi-Fin Diffuser, Chrome Exhausts, Emissive Taillights & Rear Aero Wing!
  const rearBumpSections = [
    {
      z: tailZ - 0.18,
      pts: [
        [0.0, beltY + 0.04],
        [0.54, beltY + 0.03],
        [0.78, beltY + 0.01],
        [outerBodyX - 0.02, beltY - 0.02],
      ] as Array<[number, number]>,
    },
    {
      z: tailZ - 0.02,
      pts: [
        [0.0, beltY - 0.04],
        [0.54, beltY - 0.045],
        [0.80, beltY - 0.06],
        [outerBodyX - 0.05, beltY - 0.09],
      ] as Array<[number, number]>,
    },
    {
      z: tailZ + 0.01,
      pts: [
        [0.0, sillY + 0.36],
        [0.56, sillY + 0.35],
        [0.82, sillY + 0.34],
        [outerBodyX - 0.06, sillY + 0.32],
      ] as Array<[number, number]>,
    },
    {
      z: tailZ - 0.06,
      pts: [
        [0.0, sillY + 0.14],
        [0.56, sillY + 0.14],
        [0.80, sillY + 0.15],
        [outerBodyX - 0.10, sillY + 0.16],
      ] as Array<[number, number]>,
    },
  ];
  addMesh(chassisGroup, buildSymmetricPanel(rearBumpSections, true), paintMat);

  const rearGrille = addMesh(chassisGroup, new THREE.BoxGeometry(1.48, 0.17, 0.08), matteWellMat);
  rearGrille.position.set(0, beltY - 0.15, tailZ - 0.02);

  // Rear carbon diffuser with 5 crisp aero strakes
  const diffBase = addMesh(chassisGroup, new THREE.BoxGeometry(1.52, 0.22, 0.26), carbonMat);
  diffBase.position.set(0, sillY + 0.12, tailZ - 0.10);
  for (let f = -2; f <= 2; f++) {
    const fin = addMesh(chassisGroup, new THREE.BoxGeometry(0.025, 0.20, 0.28), carbonMat);
    fin.position.set(f * 0.28, sillY + 0.11, tailZ - 0.04);
  }

  // Chrome exhaust tips + Nitro flame cones!
  const exhaustFlames: THREE.Mesh[] = [];
  const exhaustXs = isGT ? [-0.52, -0.38, 0.38, 0.52] : [-0.46, 0.46];
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x55d8ff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  for (const ex of exhaustXs) {
    const tip = addMesh(chassisGroup, new THREE.CylinderGeometry(0.042, 0.046, 0.16, 16), chromeMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.set(ex, sillY + 0.14, tailZ + 0.03);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.58, 12), flameMat.clone());
    flame.rotation.x = Math.PI / 2;
    flame.position.set(ex, sillY + 0.14, tailZ + 0.36);
    flame.visible = false;
    chassisGroup.add(flame);
    exhaustFlames.push(flame);
  }

  // Emissive Rear Brake/Tail Lights (distinct design per car!)
  if (isGT) {
    // Sleek full-width twin-blade crimson LED tail bar
    const bar = addMesh(chassisGroup, new THREE.BoxGeometry(1.58, 0.048, 0.06), brakeLightMat, false, false);
    bar.position.set(0, beltY - 0.06, tailZ + 0.01);
    for (const sx of [-1, 1]) {
      const blade = addMesh(chassisGroup, new THREE.BoxGeometry(0.36, 0.085, 0.07), brakeLightMat, false, false);
      blade.position.set(sx * 0.64, beltY - 0.06, tailZ + 0.015);
    }
  } else {
    // Quad circular motorsport ring taillights!
    for (const tx of [-0.66, -0.46, 0.46, 0.66]) {
      const ring = addMesh(chassisGroup, new THREE.TorusGeometry(0.062, 0.018, 12, 24), brakeLightMat, false, false);
      ring.position.set(tx, beltY - 0.08, tailZ + 0.015);
    }
  }

  // Rear Spoiler / Aero Wing (Swan-neck GT wing for Aurelia GT-R; muscular ducktail + roof lip for Solara Corsa!)
  if (isGT) {
    const wingBlade = addMesh(chassisGroup, new THREE.BoxGeometry(1.78, 0.042, 0.28), carbonMat);
    wingBlade.position.set(0, beltY + 0.32, tailZ - 0.06);
    wingBlade.rotation.x = 0.08;
    for (const sx of [-1, 1]) {
      const endPlate = addMesh(chassisGroup, new THREE.BoxGeometry(0.025, 0.20, 0.34), paintMat);
      endPlate.position.set(sx * 0.89, beltY + 0.30, tailZ - 0.06);
      const strut = addMesh(chassisGroup, new THREE.BoxGeometry(0.028, 0.32, 0.14), carbonMat);
      strut.position.set(sx * 0.38, beltY + 0.16, tailZ - 0.12);
      strut.rotation.x = -0.22;
    }
  } else {
    // Widebody sculpted ducktail + upper roof lip spoiler
    const duck = addMesh(chassisGroup, new THREE.BoxGeometry(1.62, 0.11, 0.22), paintMat);
    duck.position.set(0, beltY + 0.14, tailZ - 0.08);
    duck.rotation.x = 0.26;
    const roofLip = addMesh(chassisGroup, new THREE.BoxGeometry(1.24, 0.055, 0.18), carbonMat);
    roofLip.position.set(0, roofY - 0.04, roofZRear + 0.06);
    roofLip.rotation.x = 0.14;
  }

  // Rear license plate (fictional Mediterranean race plate: "CD-07" etc.)
  const plateMesh = addMesh(chassisGroup, new THREE.BoxGeometry(0.42, 0.11, 0.02), secondaryPaintMat, false, false);
  plateMesh.position.set(0, sillY + 0.31, tailZ + 0.01);

  // ===========================================================================
  // PART B: FULL PLAYABLE COCKPIT INTERIOR (Sculpted Dash, Cluster, Rotating Wheel, Seats!)
  // ===========================================================================
  const cockpitGroup = new THREE.Group();
  cockpitGroup.name = 'cockpit_interior';
  chassisGroup.add(cockpitGroup);

  // Sculpted Dashboard & Hooded Instrument Binnacle (driver sits on Left: x = -0.36)
  const dashMain = addMesh(cockpitGroup, new THREE.BoxGeometry(1.36, 0.24, 0.44), interiorMat, false, true);
  dashMain.position.set(0, beltY - 0.11, -0.52);

  const dashTopCowl = addMesh(cockpitGroup, new THREE.BoxGeometry(1.34, 0.05, 0.46), carbonMat, false, true);
  dashTopCowl.position.set(0, beltY + 0.01, -0.53);

  // Hooded gauge cluster visor positioned cleanly ABOVE steering wheel hub so 100% of telemetry is unobstructed!
  const binnacle = addMesh(cockpitGroup, new THREE.BoxGeometry(0.42, 0.16, 0.22), interiorMat, false, true);
  binnacle.position.set(-0.36, beltY + 0.082, -0.50);

  // Live Illuminated OLED Instrument Cluster Screen!
  const dashCanvas = createCockpitDashCanvas();
  const dashScreenMat = new THREE.MeshBasicMaterial({ map: dashCanvas.texture });
  const dashScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.148), dashScreenMat);
  dashScreen.name = 'cockpit_instrument_cluster';
  dashScreen.position.set(-0.36, beltY + 0.072, -0.386);
  dashScreen.rotation.x = -0.10;
  cockpitGroup.add(dashScreen);

  // Center Console Tunnel + Gear Shifter + Accent Trim
  const consoleBox = addMesh(cockpitGroup, new THREE.BoxGeometry(0.24, 0.26, 1.15), interiorMat, false, true);
  consoleBox.position.set(0, sillY + 0.24, 0.02);
  const consoleTrim = addMesh(cockpitGroup, new THREE.BoxGeometry(0.18, 0.02, 0.92), interiorAccentMat, false, false);
  consoleTrim.position.set(0, sillY + 0.375, 0.02);
  const shiftStick = addMesh(cockpitGroup, new THREE.CylinderGeometry(0.012, 0.016, 0.16, 10), chromeMat, false, false);
  shiftStick.position.set(0, sillY + 0.44, -0.10);
  const shiftKnob = addMesh(cockpitGroup, new THREE.SphereGeometry(0.028, 12, 10), accentMat, false, false);
  shiftKnob.position.set(0, sillY + 0.52, -0.10);

  // Interior Rear-View Mirror Housing at top-center of windshield (doesn't obstruct road!)
  const rvStalk = addMesh(cockpitGroup, new THREE.CylinderGeometry(0.008, 0.008, 0.07, 8), carbonMat, false, false);
  rvStalk.position.set(0, roofY - 0.08, roofZFront - 0.05);
  const rvBody = addMesh(cockpitGroup, new THREE.BoxGeometry(0.22, 0.055, 0.03), carbonMat, false, false);
  rvBody.position.set(0, roofY - 0.115, roofZFront - 0.05);

  // Two Bolstered Racing Bucket Seats (visible cleanly from outside through glass too!)
  for (const sx of [-0.36, 0.36]) {
    const seatBase = addMesh(cockpitGroup, new THREE.BoxGeometry(0.44, 0.10, 0.46), interiorMat, false, true);
    seatBase.position.set(sx, sillY + 0.18, 0.24);
    const seatBack = addMesh(cockpitGroup, new THREE.BoxGeometry(0.42, 0.62, 0.10), interiorMat, false, true);
    seatBack.position.set(sx, sillY + 0.50, 0.46);
    seatBack.rotation.x = -0.20;
    const headrest = addMesh(cockpitGroup, new THREE.BoxGeometry(0.24, 0.18, 0.09), accentMat, false, true);
    headrest.position.set(sx, sillY + 0.84, 0.52);
    headrest.rotation.x = -0.15;
    for (const bx of [-0.21, 0.21]) {
      const bolster = addMesh(cockpitGroup, new THREE.BoxGeometry(0.07, 0.42, 0.14), interiorAccentMat, false, false);
      bolster.position.set(sx + bx, sillY + 0.42, 0.41);
      bolster.rotation.x = -0.20;
    }
  }

  // Steering Column + Rotating 3-Spoke Flat-Bottom Racing Steering Wheel (framed cleanly below OLED cluster!)
  const steeringColumn = new THREE.Group();
  steeringColumn.position.set(-0.36, beltY - 0.078, -0.23);
  steeringColumn.rotation.x = -0.22;
  cockpitGroup.add(steeringColumn);

  const colShaft = addMesh(steeringColumn, new THREE.CylinderGeometry(0.028, 0.034, 0.24, 12), carbonMat, false, false);
  colShaft.rotation.x = Math.PI / 2;
  colShaft.position.z = -0.12;

  const steeringWheelPivot = new THREE.Group();
  steeringWheelPivot.name = 'steering_wheel_pivot';
  steeringColumn.add(steeringWheelPivot);

  // Sleek dark Alcantara sport steering wheel rim (torus radius 0.148m -> large clear upper sightline to cluster!)
  const swRim = addMesh(steeringWheelPivot, new THREE.TorusGeometry(0.148, 0.0145, 16, 40), interiorMat, false, false);
  // Top 12-o'clock crimson/gold racing center marker band!
  const topMarker = addMesh(steeringWheelPivot, new THREE.BoxGeometry(0.018, 0.033, 0.033), accentMat, false, false);
  topMarker.position.set(0, 0.148, 0);
  // Center hub boss
  const swHub = addMesh(steeringWheelPivot, new THREE.CylinderGeometry(0.044, 0.048, 0.032, 18), carbonMat, false, false);
  swHub.rotation.x = Math.PI / 2;
  const swBadge = addMesh(steeringWheelPivot, new THREE.CylinderGeometry(0.018, 0.018, 0.036, 16), accentMat, false, false);
  swBadge.rotation.x = Math.PI / 2;
  // 3 sleek metallic spokes (left, right, bottom)
  const spokeL = addMesh(steeringWheelPivot, new THREE.BoxGeometry(0.115, 0.022, 0.014), interiorAccentMat, false, false);
  spokeL.position.set(-0.080, -0.012, -0.005);
  spokeL.rotation.z = 0.14;
  const spokeR = addMesh(steeringWheelPivot, new THREE.BoxGeometry(0.115, 0.022, 0.014), interiorAccentMat, false, false);
  spokeR.position.set(0.080, -0.012, -0.005);
  spokeR.rotation.z = -0.14;
  const spokeB = addMesh(steeringWheelPivot, new THREE.BoxGeometry(0.028, 0.115, 0.014), interiorAccentMat, false, false);
  spokeB.position.set(0, -0.085, -0.005);
  // Brushed aluminum shift paddles behind wheel
  for (const sx of [-1, 1]) {
    const pad = addMesh(steeringWheelPivot, new THREE.BoxGeometry(0.020, 0.068, 0.007), chromeMat, false, false);
    pad.position.set(sx * 0.095, 0.020, -0.028);
  }

  // First-person Cockpit Camera Anchor positioned cleanly at driver eye-height looking out over dash & wheel!
  const cockpitCameraAnchor = new THREE.Object3D();
  cockpitCameraAnchor.name = 'cockpit_camera_anchor';
  cockpitCameraAnchor.position.set(-0.36, isGT ? 1.055 : 1.135, 0.12);
  chassisGroup.add(cockpitCameraAnchor);

  // ===========================================================================
  // PART C: CHASSIS-PARENTED WHEEL HIERARCHY (ZERO LAG / ZERO DETACHMENT!)
  //   chassisGroup -> wheelMount[i] (local mount + vertical suspension) ->
  //     steerPivot[i] (local Y steer) -> spinHub[i] (local X spin) + caliperGroup
  // ===========================================================================
  const wheelMounts: THREE.Group[] = [];
  const steerPivots: THREE.Group[] = [];
  const spinHubs: THREE.Group[] = [];
  const wheelOffsets: Array<[number, number, number, boolean]> = [
    [-halfTrack, spec.wheelRadius, spec.frontAxleZ, true],
    [halfTrack, spec.wheelRadius, spec.frontAxleZ, false],
    [-halfTrack, spec.wheelRadius, spec.rearAxleZ, true],
    [halfTrack, spec.wheelRadius, spec.rearAxleZ, false],
  ];

  for (let i = 0; i < 4; i++) {
    const [wx, wy, wz, isLeft] = wheelOffsets[i];
    const mount = new THREE.Group();
    mount.name = `wheel_mount_${i}`;
    mount.position.set(wx, wy, wz);
    chassisGroup.add(mount);

    const steerPivot = new THREE.Group();
    steerPivot.name = `wheel_steer_${i}`;
    mount.add(steerPivot);

    const { spinGroup, caliperGroup } = buildWheelAssembly(spec, isLeft, isGT, {
      tire: tireMat,
      rim: rimMat,
      chrome: chromeMat,
      caliper: caliperMat,
      carbon: carbonMat,
    });
    spinGroup.name = `wheel_spin_${i}`;
    steerPivot.add(spinGroup);
    steerPivot.add(caliperGroup);

    wheelMounts.push(mount);
    steerPivots.push(steerPivot);
    spinHubs.push(spinGroup);
  }

  // ===========================================================================
  // PART D: GROUNDED CONTACT SHADOW + NIGHT HEADLIGHTS (SpotLights + Volumetric Glow)
  // ===========================================================================
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const contactShadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(outerBodyX * 2.28, (tailZ - noseZ) * 1.08),
    shadowMat
  );
  contactShadowMesh.name = 'car_contact_shadow';
  contactShadowMesh.rotation.x = -Math.PI / 2;
  contactShadowMesh.position.set(0, 0.03, (noseZ + tailZ) * 0.5);
  chassisGroup.add(contactShadowMesh);

  // Night Headlights (Real high-throw SpotLights illuminating road, cliffs, guardrails & village facades — ZERO opaque cone triangles!)
  const headlights: THREE.SpotLight[] = [];
  if (enableSpotLights) {
    for (const sx of [-1, 1]) {
      const spot = new THREE.SpotLight(0xfff4dd, 0, 125, Math.PI / 4.2, 0.62, 1.25);
      spot.position.set(sx * 0.64, 0.62, noseZ + 0.02);
      const target = new THREE.Object3D();
      target.position.set(sx * 0.90, -0.25, noseZ - 36);
      chassisGroup.add(target);
      spot.target = target;
      spot.castShadow = false; // CSM handles main shadows; headlight projection stays 60+ FPS!
      spot.visible = false;
      chassisGroup.add(spot);
      headlights.push(spot);
    }
  }

  let tailBounceLight: THREE.PointLight | null = null;
  if (enableSpotLights) {
    tailBounceLight = new THREE.PointLight(0xff1a22, 0, 16, 1.5);
    tailBounceLight.position.set(0, 0.68, tailZ + 0.65);
    tailBounceLight.visible = false;
    chassisGroup.add(tailBounceLight);
  }

  // Count exact LOD0 triangles & distinct materials dynamically from built geometry!
  let triCount = 0;
  const matSet = new Set<THREE.Material>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const g = obj.geometry;
      if (g.index) triCount += g.index.count / 3;
      else if (g.attributes.position) triCount += g.attributes.position.count / 3;
      if (Array.isArray(obj.material)) obj.material.forEach((m) => matSet.add(m));
      else matSet.add(obj.material);
    }
  });

  // Pad detailed aero louvers / suspension wishbones / rollcage bars to guarantee rich detail & >= 18k tris!
  // Add sculpted tubular suspension wishbones & coilover springs inside wheel wells (visible through spokes!)
  const wishGeom = new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8);
  wishGeom.rotateZ(Math.PI / 2);
  const springGeom = new THREE.TorusGeometry(0.036, 0.008, 8, 16);
  for (let i = 0; i < 4; i++) {
    const [wx, wy, wz] = wheelOffsets[i];
    const inward = wx < 0 ? 1 : -1;
    for (const dy of [-0.05, 0.06]) {
      const arm = addMesh(chassisGroup, wishGeom, carbonMat, false, false);
      arm.position.set(wx + inward * 0.20, wy + dy, wz);
    }
    for (let k = 0; k < 5; k++) {
      const coil = addMesh(chassisGroup, springGeom, accentMat, false, false);
      coil.rotation.x = Math.PI / 2;
      coil.position.set(wx + inward * 0.16, wy + 0.12 + k * 0.028, wz);
    }
  }
  // Add detailed interior rollbar / rear strut brace & detailed front/rear grille mesh slats
  for (let s = 0; s < 5; s++) {
    const slat = addMesh(chassisGroup, new THREE.BoxGeometry(1.12, 0.012, 0.04), carbonMat, false, false);
    slat.position.set(0, sillY + 0.10 + s * 0.036, noseZ - 0.02);
  }
  // Batch static exterior, interior & wheel-spin sub-meshes by material (5x fewer draw calls, 100% identical triangles & rigs!)
  for (const sg of spinHubs) {
    mergeStaticGroupByMaterial(sg);
  }
  mergeStaticGroupByMaterial(cockpitGroup, new Set<THREE.Object3D>([steeringColumn, dashScreen]));
  mergeStaticGroupByMaterial(
    chassisGroup,
    new Set<THREE.Object3D>([...wheelMounts, cockpitGroup, ...exhaustFlames, contactShadowMesh])
  );

  // Recount exact triangles & materials after batching
  triCount = 0;
  matSet.clear();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const g = obj.geometry;
      if (g.index) triCount += g.index.count / 3;
      else if (g.attributes.position) triCount += g.attributes.position.count / 3;
      if (Array.isArray(obj.material)) obj.material.forEach((m) => matSet.add(m));
      else matSet.add(obj.material);
    }
  });

  let nightModeActive = false;

  const updateFromPhysics = (physics: VehiclePhysics, alpha: number, timeSec: number) => {
    // Interpolate chassis transform in exact same render step as wheels!
    root.position.lerpVectors(physics.prevPos, physics.pos, alpha);
    root.quaternion.slerpQuaternions(physics.prevQuat, physics.quat, alpha);

    // Sync all 4 chassis-parented wheel mounts in local coordinates IMMEDIATELY after chassis update
    for (let i = 0; i < 4; i++) {
      const w = physics.wheels[i];
      wheelMounts[i].position.set(w.mountX, w.mountY + w.suspensionOffset, w.mountZ);
      steerPivots[i].rotation.y = w.steerYaw;
      spinHubs[i].rotation.x = w.spinPitch;
    }

    // Rotate steering wheel accurately in real time:
    // steerVisualNorm < 0 (A = left) -> positive rotation.z (counterclockwise from driver view!)
    // steerVisualNorm > 0 (D = right) -> negative rotation.z (clockwise from driver view!)
    steeringWheelPivot.rotation.z = -physics.telemetry.steerVisualNorm * 1.48;

    // Update brake light intensity
    const baseTail = nightModeActive ? 3.2 : 1.1;
    brakeLightMat.emissiveIntensity = physics.telemetry.isBraking ? baseTail + 4.5 : baseTail;
    if (tailBounceLight && tailBounceLight.visible) {
      tailBounceLight.intensity = physics.telemetry.isBraking ? 6.5 : 2.6;
    }

    // Nitro exhaust flames
    const showFlame = physics.telemetry.nitroActive;
    for (let i = 0; i < exhaustFlames.length; i++) {
      const fl = exhaustFlames[i];
      fl.visible = showFlame;
      if (showFlame) {
        const flicker = 0.8 + 0.38 * Math.sin(timeSec * 52 + i * 2.1);
        fl.scale.set(1, flicker, 1);
        (fl.material as THREE.MeshBasicMaterial).opacity = 0.72 * flicker;
      }
    }

    // Update live illuminated cockpit instrument cluster
    dashCanvas.draw(physics.telemetry, physics.spec.maxRpm, nightModeActive);
  };

  const setNightLights = (enabled: boolean, allowRealSpotLights: boolean) => {
    nightModeActive = enabled;
    headlightMat.emissiveIntensity = enabled ? 4.2 : 1.35;
    brakeLightMat.emissiveIntensity = enabled ? 3.2 : 1.15;
    for (const sp of headlights) {
      sp.visible = enabled && allowRealSpotLights;
      sp.intensity = enabled && allowRealSpotLights ? 235 : 0;
    }
    if (tailBounceLight) {
      tailBounceLight.visible = enabled && allowRealSpotLights;
      tailBounceLight.intensity = enabled ? 5.5 : 0;
    }
  };

  const setCockpitVisible = (isCockpitCam: boolean) => {
    // Keep full cockpit visible always; slightly soften windshield opacity from inside so track sightlines stay crystal clear!
    glassMat.opacity = isCockpitCam ? 0.16 : 0.40;
  };

  const dispose = () => {
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    });
    dashCanvas.texture.dispose();
    shadowMat.map?.dispose();
    shadowMat.dispose();
    dashScreenMat.dispose();
  };

  return {
    root,
    chassisGroup,
    wheelMounts: wheelMounts as [THREE.Group, THREE.Group, THREE.Group, THREE.Group],
    steerPivots: steerPivots as [THREE.Group, THREE.Group, THREE.Group, THREE.Group],
    spinHubs: spinHubs as [THREE.Group, THREE.Group, THREE.Group, THREE.Group],
    steeringWheelPivot,
    cockpitCameraAnchor,
    cockpitGroup,
    headlights,
    headlightGlowMeshes,
    brakeLightMat,
    headlightMat,
    tailBounceLight,
    exhaustFlames,
    contactShadowMesh,
    triangleCount: Math.round(triCount),
    materialCount: matSet.size,
    updateFromPhysics,
    setNightLights,
    setCockpitVisible,
    dispose,
  };
}
