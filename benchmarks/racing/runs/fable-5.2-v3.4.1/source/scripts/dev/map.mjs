// Dev tool: renders a top-view debug map of the generated world data (no browser needed).
//   node scripts/dev/map.mjs [out.png] [scale]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../../src/world/track.js';
import { Terrain } from '../../src/world/terrain.js';
import { writePNG } from '../lib/png.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'track.json'), 'utf8'));
const out = process.argv[2] || path.join(ROOT, '.tmp/map.png');
const scale = Number(process.argv[3] || 1); // pixels per terrain cell
fs.mkdirSync(path.dirname(out), { recursive: true });

const t0 = Date.now();
const track = new Track(json);
const terrain = new Terrain(track);
console.log(`track ${track.length.toFixed(1)} m, terrain ${terrain.nx}x${terrain.nz} built in ${terrain.buildMs} ms (natural ${terrain.tNatural} ms), total ${Date.now() - t0} ms`);

const W = Math.round((terrain.nx - 1) * scale), Hh = Math.round((terrain.nz - 1) * scale);
const img = new Uint8Array(W * Hh * 3);
const sun = { x: -0.6, z: 0.3 };
for (let py = 0; py < Hh; py++) for (let px = 0; px < W; px++) {
  const x = terrain.x0 + (px / scale) * terrain.cell, z = terrain.z0 + (py / scale) * terrain.cell;
  const h = terrain.heightAt(x, z);
  let r, g, b;
  if (h < 0) { const d = Math.min(1, -h / 14); r = 60 - 45 * d; g = 170 - 100 * d; b = 190 - 60 * d; }
  else {
    const t = Math.min(1, h / 90);
    r = 120 + 80 * t; g = 150 + 30 * t; b = 90 + 60 * t;
    const s = terrain.maskAt(terrain.mSand, x, z), ro = terrain.maskAt(terrain.mRock, x, z), f = terrain.maskAt(terrain.mForest, x, z), p = terrain.maskAt(terrain.mPaved, x, z), gr = terrain.maskAt(terrain.mGravel, x, z);
    r = r * (1 - s) + 232 * s; g = g * (1 - s) + 214 * s; b = b * (1 - s) + 160 * s;
    r = r * (1 - f) + 60 * f; g = g * (1 - f) + 110 * f; b = b * (1 - f) + 50 * f;
    r = r * (1 - ro) + 150 * ro; g = g * (1 - ro) + 140 * ro; b = b * (1 - ro) + 130 * ro;
    r = r * (1 - gr) + 170 * gr; g = g * (1 - gr) + 160 * gr; b = b * (1 - gr) + 140 * gr;
    r = r * (1 - p) + 205 * p; g = g * (1 - p) + 195 * p; b = b * (1 - p) + 185 * p;
    const e = 2;
    const sl = (terrain.heightAt(x + e, z) - terrain.heightAt(x - e, z)) * sun.x + (terrain.heightAt(x, z + e) - terrain.heightAt(x, z - e)) * sun.z;
    const sh = Math.max(0.45, Math.min(1.5, 1 - sl * 0.45));
    r *= sh; g *= sh; b *= sh;
    // contour lines every 5 m
    const c = Math.abs(((h / 5) % 1) - 0.5);
    if (c > 0.47) { r *= 0.8; g *= 0.8; b *= 0.8; }
  }
  const o = (py * W + px) * 3; img[o] = Math.max(0, Math.min(255, r)); img[o + 1] = Math.max(0, Math.min(255, g)); img[o + 2] = Math.max(0, Math.min(255, b));
}
function plot(x, z, r, g, b, size = 1) {
  const px = Math.round((x - terrain.x0) / terrain.cell * scale), py = Math.round((z - terrain.z0) / terrain.cell * scale);
  for (let dy = -size + 1; dy < size; dy++) for (let dx = -size + 1; dx < size; dx++) {
    const qx = px + dx, qy = py + dy; if (qx < 0 || qy < 0 || qx >= W || qy >= Hh) continue;
    const o = (qy * W + qx) * 3; img[o] = r; img[o + 1] = g; img[o + 2] = b;
  }
}
const sp = track.spline; const ZC = [[255, 220, 60], [255, 120, 60], [230, 90, 200], [80, 200, 120]];
const p = {};
for (let i = 0; i < sp.n; i++) {
  const s = i * sp.ds;
  for (let d = -sp.half[i]; d <= sp.half[i]; d += 1.5) { sp.pointAt(s, d, p); plot(p.x, p.z, 45, 45, 50); }
  for (let k = 0; k < 2; k++) {
    const sg = k === 0 ? -1 : 1;
    if (track.ext[k][i] > 0) for (let d = sp.half[i]; d <= sp.half[i] + track.ext[k][i]; d += 1) { sp.pointAt(s, sg * d, p); const kb = track.kerb[k][i]; plot(p.x, p.z, kb ? 220 : 190, kb ? 60 : 185, kb ? 60 : 175); }
    sp.pointAt(s, sg * (sp.half[i] + track.barOff[k][i]), p);
    plot(p.x, p.z, track.bridge[i] ? 255 : 200, 30, 30);
  }
  const c = ZC[track.zone[i]]; sp.pointAt(s, 0, p); plot(p.x, p.z, c[0], c[1], c[2]);
}
for (const cp of track.checkpoints) { sp.pointAt(cp.s, 0, p); plot(p.x, p.z, 255, 255, 255, 2); }
sp.pointAt(0, 0, p); plot(p.x, p.z, 255, 255, 255, 4);
writePNG(out, W, Hh, img, 3);
console.log('wrote', out, `${W}x${Hh}`, `x ${terrain.x0}..${terrain.x1}, z ${terrain.z0}..${terrain.z1}`);
