// Procedural textures drawn at load time (no external image): height fields turned into
// normal maps, kerb stripes, grunge. Kept at 1024 px or more when used near the track.

import * as THREE from 'three';

export function makeCanvas(w, h = w) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

/** seeded 2D value noise helper for canvas work */
export function hash2(x, y, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
export function vnoise(x, y, s = 0, period = 0) {
  const x0 = Math.floor(x), y0 = Math.floor(y); const tx = x - x0, ty = y - y0;
  const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
  const w = (v) => (period ? ((v % period) + period) % period : v);
  const a = hash2(w(x0), w(y0), s), b = hash2(w(x0 + 1), w(y0), s), c = hash2(w(x0), w(y0 + 1), s), d = hash2(w(x0 + 1), w(y0 + 1), s);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
export function fbmTile(x, y, s, period, oct = 4) {
  let v = 0, a = 0.5, t = 0, p = period;
  for (let o = 0; o < oct; o++) { v += vnoise(x * p, y * p, s + o * 13, p) * a; t += a; a *= 0.5; p *= 2; }
  return v / t;
}

/**
 * Normal map (RG) + roughness (B) + AO (A) texture from a height function, same packing as the
 * photographic sets (Materials.loadSet).
 * @param height (u, v) -> height in "texel units" (0..1 u,v), tileable
 */
export function nraFromHeight(size, height, { strength = 2.0, rough = (u, v, h) => 0.8, ao = (u, v, h) => 1, anisotropy = 4 } = {}) {
  const H = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) H[y * size + x] = height(x / size, y / size);
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const xl = (x + size - 1) % size, xr = (x + 1) % size, yu = (y + size - 1) % size, yd = (y + 1) % size;
    const dx = (H[y * size + xr] - H[y * size + xl]) * strength, dy = (H[yd * size + x] - H[yu * size + x]) * strength;
    // image rows go down, texture v goes up (flipY): +v is -y
    let nx = -dx, ny = dy, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l;
    const o = (y * size + x) * 4; const h = H[y * size + x];
    out[o] = Math.round((nx * 0.5 + 0.5) * 255); out[o + 1] = Math.round((ny * 0.5 + 0.5) * 255);
    out[o + 2] = Math.round(Math.max(0, Math.min(1, rough(x / size, y / size, h))) * 255);
    out[o + 3] = Math.round(Math.max(0, Math.min(1, ao(x / size, y / size, h))) * 255);
  }
  const t = new THREE.DataTexture(out, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.flipY = true; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = anisotropy; t.colorSpace = THREE.NoColorSpace; t.needsUpdate = true;
  return t;
}

/** sRGB colour texture from a per-pixel function returning [r,g,b] in 0..255 (optionally alpha) */
export function colorFromFunc(size, fn, { anisotropy = 4, alpha = false, height = size } = {}) {
  const out = new Uint8Array(size * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < size; x++) {
    const c = fn(x / size, y / height); const o = (y * size + x) * 4;
    out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = alpha ? c[3] : 255;
  }
  const t = new THREE.DataTexture(out, size, height, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.flipY = true; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = anisotropy; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  return t;
}
