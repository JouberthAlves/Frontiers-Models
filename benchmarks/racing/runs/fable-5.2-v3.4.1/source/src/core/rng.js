// Deterministic random numbers and noise. Nothing in the simulation or the world
// generator may call Math.random(): the same seed must always give the same world.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashInt(a, b = 0, c = 0) {
  let h = (Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1) ^ Math.imul(c | 0, 0x9e3779b1)) >>> 0;
  h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

export function hash01(a, b = 0, c = 0) {
  return hashInt(a, b, c) / 4294967296;
}

export function strSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// Small helper object around a seeded generator.
export class Rng {
  constructor(seed) { this.next = mulberry32(seed >>> 0); }
  f() { return this.next(); }
  range(a, b) { return a + (b - a) * this.next(); }
  int(a, b) { return Math.floor(a + (b - a + 1) * this.next()); }
  pick(arr) { return arr[Math.floor(this.next() * arr.length) % arr.length]; }
  chance(p) { return this.next() < p; }
  sign() { return this.next() < 0.5 ? -1 : 1; }
  gauss() {
    // sum of 4 uniforms, variance ~1/3 -> scaled to ~unit variance
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
}

// ---------------------------------------------------------------------------
// 2D gradient noise (seeded), fbm and ridged variants.
// ---------------------------------------------------------------------------
const GX = new Float32Array(256), GZ = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const a = (i / 256) * Math.PI * 2;
  GX[i] = Math.cos(a); GZ[i] = Math.sin(a);
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

export function noise2(x, z, seed = 0) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const u = fade(xf), v = fade(zf);
  const h00 = hashInt(xi, zi, seed) & 255;
  const h10 = hashInt(xi + 1, zi, seed) & 255;
  const h01 = hashInt(xi, zi + 1, seed) & 255;
  const h11 = hashInt(xi + 1, zi + 1, seed) & 255;
  const n00 = GX[h00] * xf + GZ[h00] * zf;
  const n10 = GX[h10] * (xf - 1) + GZ[h10] * zf;
  const n01 = GX[h01] * xf + GZ[h01] * (zf - 1);
  const n11 = GX[h11] * (xf - 1) + GZ[h11] * (zf - 1);
  const a = n00 + (n10 - n00) * u;
  const b = n01 + (n11 - n01) * u;
  return (a + (b - a) * v) * 1.41421356; // roughly [-1, 1]
}

export function fbm2(x, z, octaves = 4, seed = 0, lac = 2.03, gain = 0.5) {
  let amp = 1, f = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise2(x * f, z * f, seed + o * 131);
    norm += amp;
    amp *= gain; f *= lac;
  }
  return sum / norm;
}

export function ridged2(x, z, octaves = 4, seed = 0, lac = 2.07, gain = 0.5) {
  let amp = 1, f = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    const n = 1 - Math.abs(noise2(x * f, z * f, seed + o * 173));
    sum += amp * n * n;
    norm += amp;
    amp *= gain; f *= lac;
  }
  return sum / norm; // [0, 1]
}
