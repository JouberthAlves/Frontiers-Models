// Procedural Mediterranean flora: five tree species (palm, stone pine, olive, cypress, holm oak),
// shrubs (lentisk, rosemary, broom, oleander, agave) and ground cover (green and dry grass, herbs,
// flowers, dune grass). Trunks and branches are real tube meshes with CC0 bark textures; foliage
// is built from alpha-tested leaf cards whose textures are drawn here, with wind, soft "volume"
// normals, vertex ambient occlusion and a little back-lit translucency.

import * as THREE from 'three';
import { TREE_NEAR } from './scatter.js';
import { Geo } from './geo.js';
import { inject } from './materials.js';
import { mulberry32 } from '../core/rng.js';

const TAU = Math.PI * 2;
const rr = (rnd, a, b) => a + (b - a) * rnd();

// ---------------------------------------------------------------------------------------------
// leaf atlases (1024 x 1024, 2 x 2 tiles unless stated)
// ---------------------------------------------------------------------------------------------
function atlasTexture(size, draw, fill, cutoff = 0.42) {
  const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
  const ctx = cv.getContext('2d'); draw(ctx, size);
  const img = ctx.getImageData(0, 0, size, size); const d = img.data;
  // colour of fully transparent texels = the leaf colour, so that mip-maps do not bleed black fringes
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] < 10) { d[i] = fill[0]; d[i + 1] = fill[1]; d[i + 2] = fill[2]; d[i + 3] = 0; }
  // Mip chain built by hand: box filter, then the alpha of each level is rescaled so that the share of
  // texels that pass the alpha test stays what it is at full size. Without this, cut-out foliage thins
  // out with the distance and thin leaves dissolve against a bright sky.
  const thr = cutoff * 255; const base = new Uint8Array(d.buffer.slice(0));
  let n0 = 0; for (let i = 3; i < base.length; i += 4) if (base[i] > thr) n0++;
  const target = n0 / (size * size);
  const mips = [{ data: base, width: size, height: size }];
  let raw = base, w = size;
  while (w > 1) {
    const nw = w >> 1; const cur = new Uint8Array(nw * nw * 4);
    for (let y = 0; y < nw; y++) for (let x = 0; x < nw; x++) {
      const o = (y * nw + x) * 4, i0 = (y * 2 * w + x * 2) * 4, i1 = i0 + 4, i2 = i0 + w * 4, i3 = i2 + 4;
      for (let c = 0; c < 4; c++) cur[o + c] = (raw[i0 + c] + raw[i1 + c] + raw[i2 + c] + raw[i3 + c] + 2) >> 2;
    }
    let lo = 1, hi = 12;
    for (let it = 0; it < 14; it++) { const k = (lo + hi) / 2; let c = 0; for (let i = 3; i < cur.length; i += 4) if (cur[i] * k > thr) c++; if (c / (nw * nw) < target) lo = k; else hi = k; }
    const k = (lo + hi) / 2; const out = cur.slice(); for (let i = 3; i < out.length; i += 4) out[i] = Math.min(255, Math.round(out[i] * k));
    mips.push({ data: out, width: nw, height: nw }); raw = cur; w = nw;
  }
  const t = new THREE.DataTexture(base, size, size, THREE.RGBAFormat);
  t.mipmaps = mips; t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace; t.flipY = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = 4; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.needsUpdate = true;
  return t;
}
const hsl = (h, s, l, a = 1) => `hsla(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%,${a})`;

function leaf(ctx, x, y, len, wid, ang, color, vein = null) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -wid, len, 0); ctx.quadraticCurveTo(len * 0.5, wid, 0, 0);
  ctx.fillStyle = color; ctx.fill();
  if (vein) { ctx.strokeStyle = vein; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len * 0.92, 0); ctx.stroke(); }
  ctx.restore();
}
function tileClip(ctx, tx, ty, T, pad = 4) { ctx.save(); ctx.beginPath(); ctx.rect(tx * T + pad, ty * T + pad, T - pad * 2, T - pad * 2); ctx.clip(); ctx.translate(tx * T, ty * T); }

function drawPineTile(ctx, T, rnd) {
  // dense tufts of long needles on twigs radiating from the lower centre
  const cx = T * 0.5, cy = T * 0.56;
  ctx.fillStyle = hsl(105, 30, 13, 0.92); ctx.beginPath(); ctx.ellipse(cx, cy, T * 0.27, T * 0.22, 0, 0, TAU); ctx.fill();
  for (let k = 0; k < 26; k++) {
    const a = rr(rnd, 0, TAU), L = rr(rnd, T * 0.16, T * 0.4);
    const ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L * 0.86;
    ctx.strokeStyle = hsl(28, 30, 20); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * T * 0.05, cy + Math.sin(a) * T * 0.05); ctx.lineTo(ex, ey); ctx.stroke();
    for (let j = 0; j < 9; j++) {
      const t = 0.35 + 0.65 * (j / 8); const px = cx + (ex - cx) * t, py = cy + (ey - cy) * t;
      for (let q = 0; q < 16; q++) {
        const na = a + rr(rnd, -1.25, 1.25); const nl = rr(rnd, T * 0.055, T * 0.115);
        ctx.strokeStyle = hsl(rr(rnd, 88, 118), rr(rnd, 30, 46), rr(rnd, 16, 33)); ctx.lineWidth = rr(rnd, 1.6, 2.8);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(na) * nl, py + Math.sin(na) * nl); ctx.stroke();
      }
    }
  }
}
function drawCypressTile(ctx, T, rnd) {
  // flattened scaly sprays
  const cx = T * 0.5, cy = T * 0.9;
  for (let k = 0; k < 150; k++) {
    const t = rnd(), a = -Math.PI / 2 + rr(rnd, -0.62, 0.62) * (1 - t * 0.35);
    const L = T * (0.12 + 0.72 * t); const px = cx + Math.cos(a) * L, py = cy + Math.sin(a) * L;
    ctx.strokeStyle = hsl(rr(rnd, 112, 140), rr(rnd, 24, 36), rr(rnd, 11, 24)); ctx.lineWidth = rr(rnd, 7, 13); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a + rr(rnd, -0.5, 0.5)) * T * 0.07, py + Math.sin(a + rr(rnd, -0.5, 0.5)) * T * 0.07); ctx.stroke();
  }
}
function drawBroadleafTile(ctx, T, rnd, hue, sat, light, leafLen, silver = 0) {
  const cx = T * 0.5, cy = T * 0.55;
  ctx.fillStyle = hsl(hue, sat * 0.8, light * 0.5, 0.9); ctx.beginPath(); ctx.ellipse(cx, cy, T * 0.2, T * 0.17, 0, 0, TAU); ctx.fill();
  for (let k = 0; k < 20; k++) {
    const a = rr(rnd, 0, TAU), L = rr(rnd, T * 0.14, T * 0.42);
    ctx.strokeStyle = hsl(30, 22, 22); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); ctx.stroke();
    const n = Math.round(L / (leafLen * 0.42));
    for (let j = 1; j <= n; j++) for (const sd of [-1, 1]) {
      const t = j / n; const px = cx + Math.cos(a) * L * t, py = cy + Math.sin(a) * L * t;
      const isSilver = rnd() < silver;
      leaf(ctx, px, py, leafLen * rr(rnd, 0.75, 1.2), leafLen * rr(rnd, 0.2, 0.3), a + sd * rr(rnd, 0.5, 1.15), hsl(hue + rr(rnd, -10, 10), isSilver ? sat * 0.45 : sat + rr(rnd, -6, 6), isSilver ? light + 20 : light + rr(rnd, -7, 9)), hsl(hue, sat, light - 8, 0.6));
    }
  }
}
function drawFlowerBushTile(ctx, T, rnd, hue, flowerHue, flowerSat, flowerLight, style) {
  if (style === 'broom') {
    // thin upright green stems loaded with small yellow flowers
    for (let k = 0; k < 70; k++) {
      const x0 = T * rr(rnd, 0.3, 0.7), a = -Math.PI / 2 + rr(rnd, -0.75, 0.75), L = T * rr(rnd, 0.35, 0.82);
      ctx.strokeStyle = hsl(hue + rr(rnd, -8, 8), 34, rr(rnd, 24, 36)); ctx.lineWidth = rr(rnd, 2.2, 3.6);
      ctx.beginPath(); ctx.moveTo(x0, T * 0.96); ctx.quadraticCurveTo(x0 + Math.cos(a) * L * 0.5, T * 0.96 + Math.sin(a) * L * 0.6, x0 + Math.cos(a) * L, T * 0.96 + Math.sin(a) * L); ctx.stroke();
      for (let j = 0; j < 7; j++) { const t = 0.4 + 0.6 * rnd(); ctx.fillStyle = hsl(flowerHue + rr(rnd, -5, 5), flowerSat, flowerLight + rr(rnd, -8, 8)); ctx.beginPath(); ctx.arc(x0 + Math.cos(a) * L * t + rr(rnd, -5, 5), T * 0.96 + Math.sin(a) * L * t + rr(rnd, -5, 5), rr(rnd, 3, 5.5), 0, TAU); ctx.fill(); }
    }
    return;
  }
  if (style === 'rosemary') {
    for (let k = 0; k < 46; k++) {
      const x0 = T * rr(rnd, 0.25, 0.75), a = -Math.PI / 2 + rr(rnd, -0.8, 0.8), L = T * rr(rnd, 0.3, 0.74);
      const ex = x0 + Math.cos(a) * L, ey = T * 0.95 + Math.sin(a) * L;
      ctx.strokeStyle = hsl(40, 16, 26); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, T * 0.95); ctx.lineTo(ex, ey); ctx.stroke();
      for (let j = 0; j < 26; j++) { const t = 0.15 + 0.85 * rnd(); const na = a + (rnd() < 0.5 ? 1 : -1) * rr(rnd, 0.5, 1.1); ctx.strokeStyle = hsl(hue + rr(rnd, -10, 10), 16, rr(rnd, 34, 52)); ctx.lineWidth = 2.4; ctx.beginPath(); const px = x0 + (ex - x0) * t, py = T * 0.95 + (ey - T * 0.95) * t; ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(na) * T * 0.035, py + Math.sin(na) * T * 0.035); ctx.stroke(); }
      for (let j = 0; j < 5; j++) { ctx.fillStyle = hsl(flowerHue + rr(rnd, -8, 8), flowerSat, flowerLight); ctx.beginPath(); ctx.arc(ex + rr(rnd, -6, 6), ey + rr(rnd, -2, 16), rr(rnd, 2.5, 4.5), 0, TAU); ctx.fill(); }
    }
    return;
  }
  drawBroadleafTile(ctx, T, rnd, hue, 36, 26, T * 0.085);
  for (let k = 0; k < 34; k++) {
    const a = rr(rnd, 0, TAU), L = rr(rnd, T * 0.1, T * 0.4); const px = T * 0.5 + Math.cos(a) * L, py = T * 0.55 + Math.sin(a) * L;
    for (let p = 0; p < 5; p++) { const pa = p / 5 * TAU; ctx.fillStyle = hsl(flowerHue + rr(rnd, -6, 6), flowerSat, flowerLight + rr(rnd, -6, 8)); ctx.beginPath(); ctx.ellipse(px + Math.cos(pa) * 6, py + Math.sin(pa) * 6, 6.5, 4.5, pa, 0, TAU); ctx.fill(); }
    ctx.fillStyle = hsl(50, 80, 62); ctx.beginPath(); ctx.arc(px, py, 2.6, 0, TAU); ctx.fill();
  }
}
function drawGrassTile(ctx, T, rnd, hue, sat, l0, l1, n, spread, curl) {
  for (let k = 0; k < n; k++) {
    const x0 = T * (0.5 + rr(rnd, -0.2, 0.2) * spread), lean = rr(rnd, -1, 1) * spread, hgt = T * rr(rnd, 0.45, 0.93);
    const x1 = x0 + lean * T * 0.34, y1 = T * 0.985 - hgt; const cxp = x0 + lean * T * 0.1 * curl, cyp = T * 0.985 - hgt * 0.62;
    const w = rr(rnd, 3.4, 6.5);
    const g = ctx.createLinearGradient(0, T, 0, y1); g.addColorStop(0, hsl(hue + rr(rnd, -8, 8), sat, l0 + rr(rnd, -5, 5))); g.addColorStop(1, hsl(hue + rr(rnd, -6, 12), sat * 0.9, l1 + rr(rnd, -6, 8)));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - w, T * 0.985); ctx.quadraticCurveTo(cxp - w * 0.6, cyp, x1, y1); ctx.quadraticCurveTo(cxp + w * 0.6, cyp, x0 + w, T * 0.985); ctx.closePath(); ctx.fill();
  }
}
function drawHerbTile(ctx, T, rnd, flowers) {
  for (let k = 0; k < 60; k++) leaf(ctx, T * rr(rnd, 0.25, 0.75), T * rr(rnd, 0.55, 0.96), T * rr(rnd, 0.1, 0.2), T * rr(rnd, 0.025, 0.05), -Math.PI / 2 + rr(rnd, -1.2, 1.2), hsl(rr(rnd, 75, 110), rr(rnd, 28, 42), rr(rnd, 24, 40)), hsl(95, 30, 20, 0.5));
  if (flowers) for (let k = 0; k < 26; k++) {
    const x = T * rr(rnd, 0.14, 0.86), y = T * rr(rnd, 0.14, 0.72); const hue = [52, 0, 285, 330][Math.floor(rnd() * 4)], white = rnd() < 0.3;
    ctx.strokeStyle = hsl(95, 30, 30); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x + rr(rnd, -12, 12), T * 0.96); ctx.lineTo(x, y); ctx.stroke();
    for (let p = 0; p < 6; p++) { const pa = p / 6 * TAU; ctx.fillStyle = white ? hsl(50, 20, 92) : hsl(hue, 75, 62); ctx.beginPath(); ctx.ellipse(x + Math.cos(pa) * 8, y + Math.sin(pa) * 8, 7.5, 4.2, pa, 0, TAU); ctx.fill(); }
    ctx.fillStyle = hsl(46, 90, 55); ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU); ctx.fill();
  }
}
function drawFrond(ctx, x0, y0, W, Hh, rnd, dead) {
  // one palm frond lying along +x inside the box (x0, y0, W, Hh): rachis plus leaflet pairs
  const mid = y0 + Hh / 2; const N = 78;
  {
    const env = (t) => Hh * 0.5 * (0.35 + 0.65 * Math.sin(Math.PI * Math.pow(t, 0.62))) * 0.5;
    ctx.fillStyle = dead ? hsl(32, 34, 27) : hsl(104, 34, 15); ctx.beginPath(); ctx.moveTo(x0, mid);
    for (let k = 0; k <= 40; k++) { const t = k / 40; ctx.lineTo(x0 + W * (0.03 + 0.95 * t), mid - env(t)); }
    for (let k = 40; k >= 0; k--) { const t = k / 40; ctx.lineTo(x0 + W * (0.03 + 0.95 * t), mid + env(t)); }
    ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1); const x = x0 + W * (0.03 + 0.95 * t);
    const len = Hh * 0.5 * (0.35 + 0.65 * Math.sin(Math.PI * Math.pow(t, 0.62))) * rr(rnd, 0.86, 1.05);
    for (const sd of [-1, 1]) {
      const ang = sd * rr(rnd, 0.82, 1.12) * (1 - t * 0.45);
      const ex = x + Math.cos(ang) * len * 0.55, ey = mid + Math.sin(ang) * len;
      const base = dead ? hsl(rr(rnd, 28, 40), rr(rnd, 30, 42), rr(rnd, 26, 40)) : hsl(rr(rnd, 92, 118), rr(rnd, 30, 42), rr(rnd, 13, 25));
      ctx.fillStyle = base; ctx.beginPath(); const w = Hh * 0.02 + W * 0.0062;
      ctx.moveTo(x - w, mid); ctx.quadraticCurveTo((x + ex) / 2, (mid + ey) / 2 + sd * 2, ex, ey); ctx.quadraticCurveTo((x + ex) / 2 + w * 1.4, (mid + ey) / 2 - sd * 2, x + w, mid); ctx.closePath(); ctx.fill();
    }
  }
  ctx.strokeStyle = dead ? hsl(34, 35, 30) : hsl(84, 34, 26); ctx.lineWidth = Hh * 0.028; ctx.beginPath(); ctx.moveTo(x0, mid); ctx.lineTo(x0 + W * 0.985, mid); ctx.stroke();
}

function makeAtlases() {
  const S = 1024, T = 512; const A = {};
  const rnd = mulberry32(90210);
  A.conifer = atlasTexture(S, (ctx) => {
    for (const [tx, ty] of [[0, 0], [1, 0]]) { tileClip(ctx, tx, ty, T); drawPineTile(ctx, T, rnd); ctx.restore(); }
    for (const [tx, ty] of [[0, 1], [1, 1]]) { tileClip(ctx, tx, ty, T); drawCypressTile(ctx, T, rnd); ctx.restore(); }
  }, [34, 52, 26]);
  A.broadleaf = atlasTexture(S, (ctx) => {
    for (const [tx, ty] of [[0, 0], [1, 0]]) { tileClip(ctx, tx, ty, T); drawBroadleafTile(ctx, T, rnd, 86, 22, 40, T * 0.062, 0.3); ctx.restore(); }   // olive
    for (const [tx, ty] of [[0, 1], [1, 1]]) { tileClip(ctx, tx, ty, T); drawBroadleafTile(ctx, T, rnd, 112, 38, 23, T * 0.058); ctx.restore(); }      // holm oak / lentisk
  }, [58, 76, 40]);
  A.palm = atlasTexture(S, (ctx) => { for (let k = 0; k < 4; k++) drawFrond(ctx, 6, k * 256 + 6, S - 12, 244, rnd, k === 3); }, [58, 84, 34]);
  A.flower = atlasTexture(S, (ctx) => {
    tileClip(ctx, 0, 0, T); drawFlowerBushTile(ctx, T, rnd, 105, 335, 70, 68, 'oleander'); ctx.restore();
    tileClip(ctx, 1, 0, T); drawFlowerBushTile(ctx, T, rnd, 95, 52, 88, 56, 'broom'); ctx.restore();
    tileClip(ctx, 0, 1, T); drawFlowerBushTile(ctx, T, rnd, 150, 268, 45, 62, 'rosemary'); ctx.restore();
    // agave leaf: opaque blue-green blade with a pale margin
    tileClip(ctx, 1, 1, T, 0); const g = ctx.createLinearGradient(0, 0, T, 0); g.addColorStop(0, hsl(150, 16, 40)); g.addColorStop(0.5, hsl(160, 22, 31)); g.addColorStop(1, hsl(150, 16, 40)); ctx.fillStyle = g; ctx.fillRect(0, 0, T, T);
    for (let k = 0; k < 40; k++) { ctx.strokeStyle = hsl(155, 18, rr(rnd, 26, 44), 0.35); ctx.lineWidth = rr(rnd, 1, 3); const x = rr(rnd, 0, T); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + rr(rnd, -14, 14), T); ctx.stroke(); } ctx.restore();
  }, [70, 92, 52]);
  A.grass = atlasTexture(S, (ctx) => {
    tileClip(ctx, 0, 0, T); drawGrassTile(ctx, T, rnd, 84, 36, 22, 40, 46, 1.0, 1); ctx.restore();          // green tuft
    tileClip(ctx, 1, 0, T); drawGrassTile(ctx, T, rnd, 46, 44, 34, 62, 52, 1.25, 1.4); ctx.restore();       // dry golden grass
    tileClip(ctx, 0, 1, T); drawGrassTile(ctx, T, rnd, 62, 26, 40, 66, 26, 1.5, 2.2); ctx.restore();        // dune grass
    tileClip(ctx, 1, 1, T); drawHerbTile(ctx, T, rnd, true); ctx.restore();                                 // herbs with flowers
  }, [96, 104, 52]);
  return A;
}
const TILE = { pine: [[0, 0.5, 0.5, 1], [0.5, 0.5, 1, 1]], cypress: [[0, 0, 0.5, 0.5], [0.5, 0, 1, 0.5]], olive: [[0, 0.5, 0.5, 1], [0.5, 0.5, 1, 1]], oak: [[0, 0, 0.5, 0.5], [0.5, 0, 1, 0.5]],
  oleander: [[0, 0.5, 0.5, 1]], broom: [[0.5, 0.5, 1, 1]], rosemary: [[0, 0, 0.5, 0.5]], agave: [[0.5, 0, 1, 0.5]],
  grass: [[0, 0.5, 0.5, 1]], dry: [[0.5, 0.5, 1, 1]], dune: [[0, 0, 0.5, 0.5]], herb: [[0.5, 0, 1, 0.5]] };

// ---------------------------------------------------------------------------------------------
// foliage geometry: cards with "volume" normals, AO colour and a wind weight per vertex
// ---------------------------------------------------------------------------------------------
class Foliage {
  constructor() { this.p = []; this.n = []; this.uv = []; this.c = []; this.w = []; this.idx = []; }
  /** card centred at c, spanned by half-vectors R and U; uv rect [u0,v0,u1,v1]; normal blended towards (c - centre) */
  card(c, R, U, rect, centre, ao, wind, bend = 0.7) {
    const base = this.p.length / 3;
    const fn = new THREE.Vector3().crossVectors(R, U).normalize();
    const out = new THREE.Vector3(c.x - centre.x, c.y - centre.y, c.z - centre.z); if (out.lengthSq() < 1e-6) out.set(0, 1, 0); out.normalize();
    if (fn.dot(out) < 0) fn.negate();
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (const [a, b] of corners) {
      const x = c.x + R.x * a + U.x * b, y = c.y + R.y * a + U.y * b, z = c.z + R.z * a + U.z * b;
      this.p.push(x, y, z);
      const nn = new THREE.Vector3(x - centre.x, y - centre.y, z - centre.z).normalize().multiplyScalar(bend).addScaledVector(fn, 1 - bend).normalize();
      this.n.push(nn.x, nn.y, nn.z);
      this.uv.push(a < 0 ? rect[0] : rect[2], b < 0 ? rect[1] : rect[3]);
      const k = ao * (b < 0 ? 0.86 : 1); this.c.push(k, k, k); this.w.push(wind * (b < 0 ? 0.75 : 1));
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  /** free quad strip vertex (palm fronds, grass blades) */
  vert(x, y, z, nx, ny, nz, u, v, ao, wind) { this.p.push(x, y, z); this.n.push(nx, ny, nz); this.uv.push(u, v); this.c.push(ao, ao, ao); this.w.push(wind); return this.p.length / 3 - 1; }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('aWind', new THREE.Float32BufferAttribute(this.w, 1));
    g.setIndex(this.p.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(this.idx, 1) : new THREE.Uint16BufferAttribute(this.idx, 1));
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }
  get triangles() { return this.idx.length / 3; }
}

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function puff(F, rnd, centre, pos, size, rect, cards, ao, wind) {
  // a few crossed cards around one point: reads as a clump of twigs from any direction
  for (let k = 0; k < cards; k++) {
    const a = rr(rnd, 0, TAU), tilt = rr(rnd, -0.5, 0.5);
    const R = V3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(size * 0.5);
    const U = V3(-Math.sin(a) * Math.sin(tilt), Math.cos(tilt), Math.cos(a) * Math.sin(tilt)).multiplyScalar(size * 0.5);
    if (k === cards - 1 && cards > 2) { R.set(size * 0.5, 0, 0); U.set(0, 0.12 * size, size * 0.5); } // one near-horizontal card closes the view from above / below
    F.card(pos, R, U, rect, centre, ao, wind);
  }
}
function trunkPath(rnd, height, lean, wobble, n = 7) {
  const pts = []; const la = rr(rnd, 0, TAU); let x = 0, z = 0;
  for (let i = 0; i <= n; i++) { const t = i / n; x = Math.cos(la) * lean * t * t * height + Math.sin(t * 5 + la) * wobble; z = Math.sin(la) * lean * t * t * height + Math.cos(t * 4.2 + la) * wobble; pts.push([x, t * height - (i === 0 ? 0.25 : 0), z]); }
  return pts;
}
const lodCards = [1, 0.42, 0.18], lodSize = [1, 1.55, 2.3];

function buildPalm(rnd, lod) {
  const bark = new Geo(), F = new Foliage(); const Hh = rr(rnd, 6.8, 9.6);
  const pts = trunkPath(rnd, Hh, rr(rnd, 0.0, 0.035), 0.06, lod === 0 ? 9 : 5);
  const radii = pts.map((p, i) => { const t = i / (pts.length - 1); return (0.175 - 0.04 * t + 0.1 * Math.exp(-t * 9)) + (t > 0.9 ? 0.07 : 0); });
  bark.tube(pts, radii, lod === 0 ? 10 : 6, 0.6);
  const top = V3(pts[pts.length - 1][0], Hh, pts[pts.length - 1][2]);
  const N = [27, 18, 11][lod]; const seg = [7, 5, 3][lod];
  for (let i = 0; i < N; i++) {
    const az = i * 2.39996 + rr(rnd, -0.25, 0.25); const age = i / (N - 1);
    const e0 = (78 - 96 * Math.pow(age, 1.25)) * Math.PI / 180;         // young fronds stand up, old ones hang
    const len = rr(rnd, 3.2, 4.2) * (0.8 + 0.2 * Math.sin(Math.PI * age)); const droop = rr(rnd, 0.8, 1.35);
    const dead = age > 0.93; const row = dead ? 3 : Math.floor(rnd() * 3);
    const v0 = 1 - (row + 1) / 4, v1 = 1 - row / 4; const halfW = 0.56 * [1, 1.15, 1.35][lod];
    let prevL = -1, prevM = -1, prevR = -1; const pos = top.clone();
    const side = V3(-Math.sin(az), 0, Math.cos(az));
    for (let s = 0; s <= seg; s++) {
      const t = s / seg; const pitch = e0 - droop * t * t;
      const dir = V3(Math.cos(az) * Math.cos(pitch), Math.sin(pitch), Math.sin(az) * Math.cos(pitch));
      if (s > 0) pos.addScaledVector(dir, len / seg);
      const upv = V3().crossVectors(side, dir).normalize();
      const w = halfW * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15 + 0.08)));
      const ao = 0.62 + 0.38 * t; const wind = 0.25 + 0.75 * t;
      // shallow V section: the leaflets lift a little from the rachis
      const l = F.vert(pos.x - side.x * w + upv.x * w * 0.3, pos.y - side.y * w + upv.y * w * 0.3, pos.z - side.z * w + upv.z * w * 0.3, upv.x - side.x * 0.4, upv.y, upv.z - side.z * 0.4, t, v0, ao, wind);
      const m = F.vert(pos.x, pos.y, pos.z, upv.x, upv.y, upv.z, t, (v0 + v1) / 2, ao, wind);
      const r = F.vert(pos.x + side.x * w + upv.x * w * 0.3, pos.y + side.y * w + upv.y * w * 0.3, pos.z + side.z * w + upv.z * w * 0.3, upv.x + side.x * 0.4, upv.y, upv.z + side.z * 0.4, t, v1, ao, wind);
      if (s > 0) F.idx.push(prevL, prevM, l, prevM, m, l, prevM, prevR, m, prevR, r, m);
      prevL = l; prevM = m; prevR = r;
    }
  }
  return { bark, F, barkSet: 'palm_tree_bark', atlas: 'palm', height: Hh };
}

function crownTree(rnd, lod, o) {
  // generic trunk + limbs + ellipsoidal crown of leaf puffs (pine, olive, oak)
  const bark = new Geo(), F = new Foliage(); const Hh = rr(rnd, o.h[0], o.h[1]);
  const fork = Hh * rr(rnd, o.fork[0], o.fork[1]);
  const pts = trunkPath(rnd, fork, rr(rnd, 0, o.lean), o.wobble, lod === 0 ? 7 : 4);
  const r0 = rr(rnd, o.r[0], o.r[1]);
  bark.tube(pts, pts.map((p, i) => r0 * (1 - 0.42 * i / (pts.length - 1)) + (i === 0 ? r0 * 0.35 : 0)), lod === 0 ? 9 : 5, 0.7, false);
  const top = pts[pts.length - 1];
  const crx = Hh * rr(rnd, o.cr[0], o.cr[1]), cry = Hh * rr(rnd, o.ch[0], o.ch[1]);
  const centre = V3(top[0] + rr(rnd, -0.4, 0.4), Hh - cry * 0.9, top[2] + rr(rnd, -0.4, 0.4));
  const limbs = lod === 2 ? 0 : Math.round(rr(rnd, o.limbs[0], o.limbs[1]) * (lod === 1 ? 0.6 : 1));
  const tips = [];
  for (let i = 0; i < limbs; i++) {
    const az = i / limbs * TAU + rr(rnd, -0.4, 0.4); const reach = crx * rr(rnd, 0.45, 0.85);
    const end = [centre.x + Math.cos(az) * reach, centre.y - cry * rr(rnd, 0.25, 0.6) + rr(rnd, 0, cry * 0.5), centre.z + Math.sin(az) * reach];
    const mid = [top[0] + (end[0] - top[0]) * 0.45, top[1] + (end[1] - top[1]) * 0.62 + rr(rnd, -0.2, 0.3), top[2] + (end[2] - top[2]) * 0.45];
    bark.tube([[top[0], top[1] - 0.15, top[2]], mid, end], [r0 * 0.5, r0 * 0.3, r0 * 0.1], lod === 0 ? 6 : 4, 0.7, true);
    tips.push(end);
    if (lod === 0) for (let q = 0; q < 2; q++) { const e2 = [end[0] + rr(rnd, -1.2, 1.2), end[1] + rr(rnd, 0.2, 1.0), end[2] + rr(rnd, -1.2, 1.2)]; bark.tube([mid, e2], [r0 * 0.2, r0 * 0.05], 4, 0.7, true); }
  }
  const N = Math.max(5, Math.round(o.puffs * lodCards[lod]));
  for (let i = 0; i < N; i++) {
    // points on (and a little inside) the upper shell of the crown ellipsoid, plus a rim underneath
    const u = rnd(), v = rnd(); const th = u * TAU; const ph = Math.acos(1 - v * (1 + o.under));
    const shell = rr(rnd, 0.72, 1.0);
    const pos = V3(centre.x + Math.sin(ph) * Math.cos(th) * crx * shell, centre.y + Math.cos(ph) * cry * shell, centre.z + Math.sin(ph) * Math.sin(th) * crx * shell);
    const ao = 0.5 + 0.5 * Math.pow(shell, 2) * (0.75 + 0.25 * Math.cos(ph));
    puff(F, rnd, centre, pos, rr(rnd, o.size[0], o.size[1]) * lodSize[lod], o.tiles[Math.floor(rnd() * o.tiles.length)], lod === 0 ? 3 : 2, ao, 0.5 + 0.5 * shell);
  }
  return { bark, F, barkSet: o.bark, atlas: o.atlas, height: Hh };
}
const buildPine = (rnd, lod) => crownTree(rnd, lod, { h: [9, 13], fork: [0.66, 0.76], lean: 0.035, wobble: 0.12, r: [0.26, 0.36], cr: [0.3, 0.4], ch: [0.1, 0.15], limbs: [6, 9], puffs: 78, under: 0.18, size: [1.5, 2.2], tiles: TILE.pine, bark: 'pine_bark', atlas: 'conifer' });
const buildOlive = (rnd, lod) => crownTree(rnd, lod, { h: [4.4, 6.4], fork: [0.26, 0.36], lean: 0.06, wobble: 0.16, r: [0.26, 0.4], cr: [0.4, 0.52], ch: [0.26, 0.36], limbs: [4, 6], puffs: 64, under: 0.55, size: [1.0, 1.5], tiles: TILE.olive, bark: 'bark_willow', atlas: 'broadleaf' });
const buildOak = (rnd, lod) => crownTree(rnd, lod, { h: [6, 8.5], fork: [0.3, 0.4], lean: 0.03, wobble: 0.1, r: [0.28, 0.4], cr: [0.42, 0.55], ch: [0.27, 0.36], limbs: [5, 7], puffs: 84, under: 0.5, size: [1.3, 1.9], tiles: TILE.oak, bark: 'bark_brown_02', atlas: 'broadleaf' });

function buildCypress(rnd, lod) {
  const bark = new Geo(), F = new Foliage(); const Hh = rr(rnd, 9, 14), Rm = rr(rnd, 0.75, 1.1);
  bark.tube([[0, -0.25, 0], [0, Hh * 0.2, 0]], [0.2, 0.14], 6, 0.7, false);
  const centre = V3(0, Hh * 0.5, 0);
  const N = Math.round(72 * lodCards[lod]);
  for (let i = 0; i < N; i++) {
    const t = (i + rnd()) / N; const y = Hh * (0.06 + 0.94 * t);
    const rad = Rm * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.6) * rr(rnd, 0.6, 1.0);
    const a = rr(rnd, 0, TAU); const pos = V3(Math.cos(a) * rad * 0.55, y, Math.sin(a) * rad * 0.55);
    const sz = rr(rnd, 1.25, 1.9) * lodSize[lod] * (0.6 + 0.4 * Math.sin(Math.PI * t));
    // upright sprays leaning out a little
    const R = V3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(sz * 0.42);
    const U = V3(Math.cos(a) * 0.22, 1, Math.sin(a) * 0.22).normalize().multiplyScalar(sz * 0.62);
    F.card(pos, R, U, TILE.cypress[Math.floor(rnd() * 2)], V3(0, y, 0), 0.55 + 0.45 * t, 0.2 + 0.8 * t, 0.85);
    if (lod < 2) { const R2 = V3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(sz * 0.42); F.card(pos, R2, U, TILE.cypress[Math.floor(rnd() * 2)], V3(0, y, 0), 0.5 + 0.45 * t, 0.2 + 0.8 * t, 0.85); }
  }
  return { bark, F, barkSet: 'bark_willow', atlas: 'conifer', height: Hh };
}

function buildBush(rnd, lod, o) {
  const F = new Foliage(); const R0 = rr(rnd, o.r[0], o.r[1]), Hh = rr(rnd, o.h[0], o.h[1]); const centre = V3(0, Hh * 0.3, 0);
  const N = Math.max(4, Math.round(o.cards * [1, 0.5, 0.3][lod]));
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU + rr(rnd, -0.3, 0.3), rad = R0 * rr(rnd, 0.15, 0.7), y = Hh * rr(rnd, 0.3, 0.62);
    const pos = V3(Math.cos(a) * rad, y, Math.sin(a) * rad); const sz = rr(rnd, o.size[0], o.size[1]) * [1, 1.4, 1.8][lod];
    const lean = rr(rnd, 0.1, 0.5);
    const Rv = V3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(sz * 0.5), U = V3(Math.cos(a) * lean, 1, Math.sin(a) * lean).normalize().multiplyScalar(sz * 0.5);
    F.card(pos, Rv, U, o.tiles[Math.floor(rnd() * o.tiles.length)], centre, 0.6 + 0.4 * (y / Hh), 0.3 + 0.7 * (y / Hh), 0.75);
  }
  // a couple of flat cards close the view from above
  for (let k = 0; k < (lod === 0 ? 2 : 1); k++) { const sz = R0 * 1.5; F.card(V3(rr(rnd, -0.15, 0.15), Hh * 0.62, rr(rnd, -0.15, 0.15)), V3(sz * 0.5, 0, 0), V3(0, 0.08, sz * 0.5), o.tiles[0], centre, 0.95, 0.8, 0.5); }
  return { F, atlas: o.atlas, height: Hh, radius: R0 };
}
function buildAgave(rnd, lod) {
  const F = new Foliage(); const N = lod === 0 ? 15 : 9; const rect = TILE.agave[0];
  for (let i = 0; i < N; i++) {
    const az = i * 2.39996, t = i / N; const el = (18 + 62 * t) * Math.PI / 180; const len = rr(rnd, 0.6, 0.95) * (1.1 - 0.4 * t), w = 0.085 * (1.2 - 0.3 * t);
    const dir = V3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)), side = V3(-Math.sin(az), 0, Math.cos(az)), up = V3().crossVectors(side, dir).normalize();
    let pl = -1, pr2 = -1; const seg = 3;
    for (let s = 0; s <= seg; s++) {
      const q = s / seg; const p = dir.clone().multiplyScalar(len * q).add(V3(0, 0.05 - 0.12 * q * q, 0)); const ww = w * (1 - q * 0.96) * (0.6 + 0.8 * Math.sin(Math.PI * Math.min(1, q + 0.25)));
      const a = F.vert(p.x - side.x * ww, p.y, p.z - side.z * ww, up.x - side.x * 0.5, up.y, up.z - side.z * 0.5, rect[0] + 0.02, rect[1] + (rect[3] - rect[1]) * q, 0.7 + 0.3 * q, 0);
      const b = F.vert(p.x + side.x * ww, p.y, p.z + side.z * ww, up.x + side.x * 0.5, up.y, up.z + side.z * 0.5, rect[2] - 0.02, rect[1] + (rect[3] - rect[1]) * q, 0.7 + 0.3 * q, 0);
      if (s > 0) F.idx.push(pl, pr2, a, pr2, b, a); pl = a; pr2 = b;
    }
  }
  return { F, atlas: 'flower', height: 0.8, radius: 0.8 };
}
function buildGround(rnd, lod, o) {
  // a patch of several tufts
  const F = new Foliage(); const centre = V3(0, -0.5, 0); const n = Math.max(2, Math.round(o.tufts * (lod === 0 ? 1 : 0.5)));
  for (let k = 0; k < n; k++) {
    const a = rr(rnd, 0, TAU), rad = Math.sqrt(rnd()) * o.spread; const cx = Math.cos(a) * rad, cz = Math.sin(a) * rad; const hgt = rr(rnd, o.h[0], o.h[1]), wid = hgt * o.aspect;
    const cards = lod === 0 ? 3 : 2;
    for (let c = 0; c < cards; c++) {
      const ca = c / cards * Math.PI + rr(rnd, -0.3, 0.3);
      F.card(V3(cx, hgt * 0.5 - 0.03, cz), V3(Math.cos(ca) * wid * 0.5, 0, Math.sin(ca) * wid * 0.5), V3(rr(rnd, -0.08, 0.08), hgt * 0.5, rr(rnd, -0.08, 0.08)), o.tiles[Math.floor(rnd() * o.tiles.length)], centre, 0.9, 1, 0.35);
    }
  }
  return { F, atlas: 'grass', height: o.h[1], radius: o.spread };
}

const SPECIES = {
  // trees
  palm: { cat: 'tree', build: buildPalm, max: [75, 210, 620], tint: [[0.8, 0.9, 0.78], [1.0, 1.04, 0.92]] },
  pine: { cat: 'tree', build: buildPine, max: [80, 220, 640], tint: [[0.9, 0.98, 0.88], [1.08, 1.1, 1.0]] },
  olive: { cat: 'tree', build: buildOlive, max: [70, 200, 560], tint: [[0.92, 0.98, 0.9], [1.1, 1.1, 1.05]] },
  cypress: { cat: 'tree', build: buildCypress, max: [80, 220, 640], tint: [[0.88, 0.96, 0.88], [1.05, 1.08, 1.0]] },
  oak: { cat: 'tree', build: buildOak, max: [75, 210, 600], tint: [[0.9, 0.98, 0.86], [1.08, 1.1, 0.98]] },
  // shrubs
  lentisk: { cat: 'shrub', build: (r, l) => buildBush(r, l, { r: [0.7, 1.15], h: [0.8, 1.4], cards: 16, size: [0.9, 1.4], tiles: TILE.oak, atlas: 'broadleaf' }), max: [55, 130, 300], tint: [[0.86, 0.96, 0.82], [1.1, 1.1, 1.0]] },
  oleander: { cat: 'shrub', build: (r, l) => buildBush(r, l, { r: [0.9, 1.3], h: [1.6, 2.5], cards: 18, size: [1.1, 1.6], tiles: TILE.oleander, atlas: 'flower' }), max: [55, 130, 300], tint: [[0.92, 0.95, 0.9], [1.08, 1.05, 1.05]] },
  broom: { cat: 'shrub', build: (r, l) => buildBush(r, l, { r: [0.6, 0.95], h: [1.0, 1.7], cards: 14, size: [1.0, 1.5], tiles: TILE.broom, atlas: 'flower' }), max: [50, 120, 280], tint: [[0.92, 0.95, 0.85], [1.08, 1.08, 1.0]] },
  rosemary: { cat: 'shrub', build: (r, l) => buildBush(r, l, { r: [0.5, 0.8], h: [0.55, 0.95], cards: 12, size: [0.7, 1.0], tiles: TILE.rosemary, atlas: 'flower' }), max: [45, 110, 240], tint: [[0.9, 0.95, 0.92], [1.08, 1.05, 1.08]] },
  agave: { cat: 'shrub', build: buildAgave, max: [45, 120, 0], tint: [[0.9, 0.95, 0.92], [1.06, 1.05, 1.05]] },
  // ground cover
  grasstuft: { cat: 'ground', build: (r, l) => buildGround(r, l, { tufts: 6, spread: 0.85, h: [0.32, 0.55], aspect: 1.1, tiles: TILE.grass }), max: [42, 95, 0], tint: [[0.85, 0.95, 0.8], [1.12, 1.1, 1.0]] },
  drygrass: { cat: 'ground', build: (r, l) => buildGround(r, l, { tufts: 6, spread: 0.9, h: [0.5, 0.95], aspect: 0.9, tiles: TILE.dry }), max: [45, 100, 0], tint: [[0.9, 0.9, 0.8], [1.1, 1.08, 1.0]] },
  herbs: { cat: 'ground', build: (r, l) => buildGround(r, l, { tufts: 5, spread: 0.8, h: [0.22, 0.36], aspect: 1.6, tiles: [...TILE.herb, ...TILE.grass] }), max: [36, 80, 0], tint: [[0.88, 0.95, 0.85], [1.1, 1.08, 1.0]] },
  flowers: { cat: 'ground', build: (r, l) => buildGround(r, l, { tufts: 6, spread: 0.85, h: [0.28, 0.46], aspect: 1.3, tiles: TILE.herb }), max: [38, 85, 0], tint: [[0.95, 0.95, 0.9], [1.08, 1.08, 1.05]] },
  beachgrass: { cat: 'ground', build: (r, l) => buildGround(r, l, { tufts: 4, spread: 0.6, h: [0.55, 0.9], aspect: 0.75, tiles: TILE.dune }), max: [45, 110, 0], tint: [[0.92, 0.95, 0.85], [1.08, 1.06, 1.0]] },
};
export const PLANT_TYPES = Object.keys(SPECIES);
export const TREE_SPECIES = Object.entries(SPECIES).filter(([, v]) => v.cat === 'tree').map(([k]) => k);
const VARIANTS = 3;

const FOLIAGE_VERT = /* glsl */`
{
  // wind: slow sway of the whole plant plus a faster flutter of the leaves
  #ifdef USE_INSTANCING
    vec3 ipos = instanceMatrix[3].xyz; float hgt = max(position.y, 0.0);
  #else
    vec3 ipos = vec3(aBase.x, 0.0, aBase.z); float hgt = max(aBase.y, 0.0);   // merged cells: baked per vertex
  #endif
  float ph = dot(ipos.xz, vec2(0.37, 0.71));
  float sway = sin(uTime * 1.25 + ph) * 0.6 + sin(uTime * 2.3 + ph * 1.7) * 0.25;
  float flutter = sin(uTime * 6.5 + ph * 3.0 + position.x * 2.1 + position.z * 1.7 + position.y * 1.3);
  transformed.xz += uWind.xy * (sway * 0.018 * hgt * uWind.z + flutter * 0.022 * aWind * uWind.w);
  transformed.y += flutter * 0.012 * aWind * uWind.w;
}
`;

export class Plants {
  constructor(materials, env) {
    this.M = materials; this.env = env;
    this.atlases = makeAtlases();
    this.foliageMats = {}; this.barkMats = {};
    this.protoInfo = {};
  }
  static textureSets() { return ['palm_tree_bark', 'pine_bark', 'bark_willow', 'bark_brown_02']; }

  /** `instanced` selects a separate instance: a material shared by instanced and plain meshes would switch program at every draw */
  foliageMaterial(atlas, instanced = false) {
    const ck = atlas + (instanced ? '#i' : '');
    if (this.foliageMats[ck]) return this.foliageMats[ck];
    const env = this.env;
    const m = new THREE.MeshStandardMaterial({ map: this.atlases[atlas], alphaTest: 0.42, side: THREE.DoubleSide, vertexColors: true, roughness: 0.72, metalness: 0 });
    m.alphaToCoverage = this.M.gfx.quality.msaa > 0;
    this.M.patch(m, {
      key: 'foliage', sunSpecular: 0.12, uniforms: { uWind: env.uniforms.uWind, uSunColorF: { value: env.sunColor }, uSunPowerF: { value: env.sunIntensity } },
      vertexPars: 'attribute float aWind; uniform vec4 uWind;\n#ifndef USE_INSTANCING\nattribute vec3 aBase;\n#endif', vertexMain: FOLIAGE_VERT,
      fragmentPars: 'uniform vec3 uSunColorF; uniform float uSunPowerF;',
      hooks: [(shader) => {
        let fs = shader.fragmentShader;
        // leaf cards are lit as one soft volume: no flipping of the normal on back faces
        fs = inject(fs, '#include <normal_fragment_maps>', 'normal = normalize(vNormal);');
        // light shining through the leaves when the sun is behind them
        fs = inject(fs, '#include <opaque_fragment>', `{
          vec3 Vw = normalize(cameraPosition - vWPos);
          float through = pow(max(dot(-Vw, uSunDir), 0.0), 3.0);
          outgoingLight += diffuseColor.rgb * uSunColorF * uSunPowerF * 0.07 * through * terrainSun;
        }\n#include <opaque_fragment>`);
        shader.fragmentShader = fs;
      }],
    });
    m.name = 'foliage_' + atlas; m.userData.foliage = true;
    this.foliageMats[ck] = m;
    return m;
  }
  barkMaterial(set, instanced = false) {
    const ck = set + (instanced ? '#i' : '');
    if (this.barkMats[ck]) return this.barkMats[ck];
    const m = this.M.std({ set, repeat: 1, color: set === 'palm_tree_bark' ? 0x8f7c66 : 0xffffff, patch: { sunSpecular: 0.3 } }); m.name = 'bark_' + set;
    this.barkMats[ck] = m; return m;
  }

  /** registers the prototypes of one plant type (variants x LODs) in the scatter */
  register(scatter, type) {
    const sp = SPECIES[type]; if (!sp) throw new Error('unknown plant ' + type);
    const info = { variants: [], cat: sp.cat }; this.protoInfo[type] = info;
    for (let v = 0; v < VARIANTS; v++) {
      const lods = [];
      for (let l = 0; l < 3; l++) {
        if (!sp.max[l]) continue;
        const rnd = mulberry32(1000 + v * 77 + type.length * 13 + type.charCodeAt(0) * 7);   // same seed for all LODs of a variant: same silhouette
        const res = sp.build(rnd, l);
        const inst = sp.cat === 'tree' && l === 0;      // the only level drawn with instancing
        const parts = [{ geometry: res.F.build(), material: this.foliageMaterial(res.atlas, inst), castShadow: sp.cat !== 'ground' }];
        if (res.bark && res.bark.vertexCount) parts.push({ geometry: res.bark.build(), material: this.barkMaterial(res.barkSet, inst), castShadow: true });
        // small plants are merged per cell; trees are instanced up close and merged in the distance
        const lod = { parts, max: sp.max[l] };
        if (sp.cat !== 'tree') { lod.merge = sp.cat; lod.band = l; } else if (l > 0) { lod.merge = 'tree'; lod.band = l - 1; } else lod.max = TREE_NEAR;
        lods.push(lod);
        if (l === 0) info.variants.push({ triangles: res.F.triangles + (res.bark ? res.bark.triangleCount : 0), height: res.height });
      }
      scatter.addPrototype(`${type}_${v}`, { lods, category: sp.cat, detail: sp.cat === 'ground', shadowMax: sp.cat === 'tree' ? 260 : 70 });
    }
    return info;
  }
  tint(type, t) { const sp = SPECIES[type]; const a = sp.tint[0], b = sp.tint[1]; return new THREE.Color(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t); }
}
