import * as THREE from 'three';

export interface LiverySpec {
  id: number;
  number: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  caliper: string;
}

export const LIVERIES: LiverySpec[] = [
  { id: 0, number: '07', name: 'Rosso Corsa', primary: '#b5161f', secondary: '#f3efe6', accent: '#d9a441', caliper: '#e6b800' },
  { id: 1, number: '14', name: 'Azzurro Costa', primary: '#1b5f9e', secondary: '#ffffff', accent: '#ff7a22', caliper: '#ff3b1f' },
  { id: 2, number: '22', name: 'Argento Sol', primary: '#cfd6de', secondary: '#1e2530', accent: '#d63026', caliper: '#d62424' },
  { id: 3, number: '03', name: 'Verde Pino', primary: '#1c523b', secondary: '#e6c989', accent: '#ffffff', caliper: '#d9a441' },
  { id: 4, number: '88', name: 'Ambra Tramonto', primary: '#d9631e', secondary: '#181c24', accent: '#f5ede0', caliper: '#ff521b' },
  { id: 5, number: '51', name: 'Perla Notte', primary: '#202632', secondary: '#45b7d1', accent: '#f2f2f2', caliper: '#32b8d9' },
];

function createCanvas(size = 1024): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function heightCanvasToNormalTexture(heightCanvas: HTMLCanvasElement, strength = 2.4): THREE.CanvasTexture {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const src = heightCanvas.getContext('2d')!.getImageData(0, 0, w, h).data;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d')!;
  const outImg = outCtx.createImageData(w, h);
  const dst = outImg.data;

  const sample = (x: number, y: number) => {
    const wx = ((x % w) + w) % w;
    const wy = ((y % h) + h) % h;
    return src[(wy * w + wx) * 4] / 255;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (sample(x + 1, y) - sample(x - 1, y)) * strength;
      const dy = (sample(x, y + 1) - sample(x, y - 1)) * strength;
      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;
      const inv = 1 / Math.hypot(nx, ny, nz);
      nx *= inv;
      ny *= inv;
      nz *= inv;
      const idx = (y * w + x) * 4;
      dst[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      dst[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      dst[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      dst[idx + 3] = 255;
    }
  }
  outCtx.putImageData(outImg, 0, 0);

  const tex = new THREE.CanvasTexture(outCanvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export interface SharedCarTextures {
  tireMap: THREE.CanvasTexture;
  tireNormal: THREE.CanvasTexture;
  carbonMap: THREE.CanvasTexture;
  carbonNormal: THREE.CanvasTexture;
  alloyMap: THREE.CanvasTexture;
  alloyNormal: THREE.CanvasTexture;
  paintNormal: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
}

let cachedShared: SharedCarTextures | null = null;

export function getSharedCarTextures(): SharedCarTextures {
  if (cachedShared) return cachedShared;

  // 1. Tire Tread & Sidewall 1024x1024
  const [tCol, tCtx] = createCanvas(1024);
  const [tH, thCtx] = createCanvas(1024);
  tCtx.fillStyle = '#181a1e';
  tCtx.fillRect(0, 0, 1024, 1024);
  thCtx.fillStyle = '#909090';
  thCtx.fillRect(0, 0, 1024, 1024);

  tCtx.fillStyle = '#0e1013';
  thCtx.fillStyle = '#303030';
  for (const gx of [340, 460, 564, 684]) {
    tCtx.fillRect(gx - 12, 0, 24, 1024);
    thCtx.fillRect(gx - 12, 0, 24, 1024);
  }
  tCtx.strokeStyle = '#0e1013';
  thCtx.strokeStyle = '#383838';
  tCtx.lineWidth = 14;
  thCtx.lineWidth = 14;
  for (let y = 0; y < 1024; y += 32) {
    tCtx.beginPath(); tCtx.moveTo(240, y); tCtx.lineTo(440, y + 20);
    tCtx.moveTo(784, y); tCtx.lineTo(584, y + 20); tCtx.stroke();
    thCtx.beginPath(); thCtx.moveTo(240, y); thCtx.lineTo(440, y + 20);
    thCtx.moveTo(784, y); thCtx.lineTo(584, y + 20); thCtx.stroke();
  }
  tCtx.strokeStyle = '#24272d';
  thCtx.strokeStyle = '#b4b4b4';
  tCtx.lineWidth = 6;
  thCtx.lineWidth = 6;
  for (const rx of [120, 170, 854, 904]) {
    tCtx.beginPath(); tCtx.moveTo(rx, 0); tCtx.lineTo(rx, 1024); tCtx.stroke();
    thCtx.beginPath(); thCtx.moveTo(rx, 0); thCtx.lineTo(rx, 1024); thCtx.stroke();
  }
  const tireMap = new THREE.CanvasTexture(tCol);
  tireMap.wrapS = THREE.RepeatWrapping;
  tireMap.wrapT = THREE.RepeatWrapping;
  tireMap.colorSpace = THREE.SRGBColorSpace;
  const tireNormal = heightCanvasToNormalTexture(tH, 3.0);

  // 2. Carbon Weave 1024x1024
  const [cCol, cCtx] = createCanvas(1024);
  const [cH, chCtx] = createCanvas(1024);
  cCtx.fillStyle = '#181a1f';
  cCtx.fillRect(0, 0, 1024, 1024);
  chCtx.fillStyle = '#707070';
  chCtx.fillRect(0, 0, 1024, 1024);
  const cell = 16;
  for (let y = 0; y < 1024; y += cell) {
    for (let x = 0; x < 1024; x += cell) {
      const diag = ((x / cell + y / cell) & 1) === 0;
      cCtx.fillStyle = diag ? '#252830' : '#14161b';
      cCtx.fillRect(x, y, cell - 1, cell - 1);
      chCtx.fillStyle = diag ? '#a8a8a8' : '#585858';
      chCtx.fillRect(x, y, cell - 1, cell - 1);
    }
  }
  const carbonMap = new THREE.CanvasTexture(cCol);
  carbonMap.wrapS = THREE.RepeatWrapping;
  carbonMap.wrapT = THREE.RepeatWrapping;
  carbonMap.repeat.set(8, 8);
  carbonMap.colorSpace = THREE.SRGBColorSpace;
  const carbonNormal = heightCanvasToNormalTexture(cH, 1.4);
  carbonNormal.repeat.set(8, 8);

  // 3. Brushed Gunmetal Alloy 1024x1024
  const [aCol, aCtx] = createCanvas(1024);
  const [aH, ahCtx] = createCanvas(1024);
  aCtx.fillStyle = '#aeb5c0';
  aCtx.fillRect(0, 0, 1024, 1024);
  ahCtx.fillStyle = '#808080';
  ahCtx.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 1024; y += 2) {
    const shade = 168 + Math.round(Math.sin(y * 1.7) * 14 + Math.cos(y * 0.43) * 10);
    aCtx.fillStyle = `rgb(${shade},${shade + 3},${shade + 7})`;
    aCtx.fillRect(0, y, 1024, 2);
    const hVal = 128 + Math.round(Math.sin(y * 1.7) * 18);
    ahCtx.fillStyle = `rgb(${hVal},${hVal},${hVal})`;
    ahCtx.fillRect(0, y, 1024, 2);
  }
  const alloyMap = new THREE.CanvasTexture(aCol);
  alloyMap.wrapS = THREE.RepeatWrapping;
  alloyMap.wrapT = THREE.RepeatWrapping;
  alloyMap.colorSpace = THREE.SRGBColorSpace;
  const alloyNormal = heightCanvasToNormalTexture(aH, 0.8);

  // 4. Micro panel-seam normal 1024x1024
  const [pH, phCtx] = createCanvas(1024);
  phCtx.fillStyle = '#808080';
  phCtx.fillRect(0, 0, 1024, 1024);
  phCtx.strokeStyle = '#404040';
  phCtx.lineWidth = 3;
  // Subtle door and hood shutline seams
  phCtx.strokeRect(320, 320, 384, 420);
  const paintNormal = heightCanvasToNormalTexture(pH, 0.9);

  // 5. Soft radial contact shadow decal 1024x1024
  const [sCol, sCtx] = createCanvas(1024);
  sCtx.clearRect(0, 0, 1024, 1024);
  const grad = sCtx.createRadialGradient(512, 512, 100, 512, 512, 490);
  grad.addColorStop(0, 'rgba(5, 7, 10, 0.86)');
  grad.addColorStop(0.55, 'rgba(5, 7, 10, 0.62)');
  grad.addColorStop(0.84, 'rgba(5, 7, 10, 0.18)');
  grad.addColorStop(1, 'rgba(5, 7, 10, 0.0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 1024, 1024);
  const contactShadowMap = new THREE.CanvasTexture(sCol);
  contactShadowMap.colorSpace = THREE.SRGBColorSpace;

  cachedShared = {
    tireMap,
    tireNormal,
    carbonMap,
    carbonNormal,
    alloyMap,
    alloyNormal,
    paintNormal,
    contactShadowMap,
  };
  return cachedShared;
}

/**
 * Generates a 1024x1024 racing livery texture mapped via clean planar body UVs:
 * - u in [0.0..0.5]: Left/Right body flank (x = lateral/sideways along car length)
 * - Actually we use planar world-local UV:
 *   U = 0.5 + x / 2.2 (for top) and V = 1 - (z / 4.6 + 0.5) (nose at top V=0, tail at bottom V=1)
 *   Notice: top-down UV has U=[0.22..0.78] = car width [-0.62..+0.62..+1.0],
 *   and flank bands on far left U=[0.0..0.20] and far right U=[0.80..1.0]!
 */
export function createLiveryPaintTexture(livery: LiverySpec): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024);
  ctx.fillStyle = livery.primary;
  ctx.fillRect(0, 0, 1024, 1024);

  // Twin uniform-width racing stripes down the top center (U around 0.5 -> px 512)
  ctx.fillStyle = livery.secondary;
  ctx.fillRect(468, 0, 34, 1024);
  ctx.fillRect(522, 0, 34, 1024);

  // Accent outer pinstripes
  ctx.fillStyle = livery.accent;
  ctx.fillRect(454, 0, 8, 1024);
  ctx.fillRect(562, 0, 8, 1024);

  // Side accent rocker stripe along flanks (left flank U ~ 0.10, right flank U ~ 0.90)
  ctx.fillStyle = livery.secondary;
  ctx.fillRect(28, 150, 22, 740);
  ctx.fillRect(974, 150, 22, 740);
  ctx.fillStyle = livery.accent;
  ctx.fillRect(54, 150, 10, 740);
  ctx.fillRect(960, 150, 10, 740);

  // Door roundel + number on LEFT & RIGHT flanks (rotated cleanly so both read upright & un-mirrored!)
  for (const [cx, rot] of [[130, Math.PI / 2], [894, -Math.PI / 2]] as [number, number][]) {
    ctx.save();
    ctx.translate(cx, 520);
    ctx.rotate(rot);
    ctx.fillStyle = '#f8f6f0';
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = livery.accent;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#14171c';
    ctx.font = 'bold 58px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(livery.number, 0, 3);
    ctx.restore();
  }

  // Hood number badge (upright when viewed from the front!)
  ctx.save();
  ctx.translate(512, 235);
  ctx.rotate(Math.PI);
  ctx.fillStyle = '#f8f6f0';
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = livery.accent;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#14171c';
  ctx.font = 'bold 46px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(livery.number, 0, 3);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.flipY = true;
  return tex;
}
