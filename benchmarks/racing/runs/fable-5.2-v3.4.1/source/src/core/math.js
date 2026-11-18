// Small scalar helpers shared by world generation, physics and rendering.

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
export function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function invLerp(a, b, x) { return (x - a) / (b - a); }
export function remap(x, a, b, c, d) { return c + (d - c) * clamp01((x - a) / (b - a)); }
export function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
export function smootherstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
export function sign(x) { return x < 0 ? -1 : 1; }
export function wrap(x, m) { return ((x % m) + m) % m; }
// shortest signed difference a-b on a circle of circumference m
export function wrapDiff(a, b, m) {
  let d = (a - b) % m;
  if (d > m / 2) d -= m; else if (d < -m / 2) d += m;
  return d;
}
export function angDiff(a, b) { return wrapDiff(a, b, TAU); }
export function damp(current, target, lambda, dt) {
  return target + (current - target) * Math.exp(-lambda * dt);
}
export function approach(current, target, maxDelta) {
  if (current < target) return Math.min(target, current + maxDelta);
  return Math.max(target, current - maxDelta);
}
// polynomial smooth minimum (k = blend radius)
export function smin(a, b, k) {
  const h = clamp01(0.5 + 0.5 * (b - a) / k);
  return lerp(b, a, h) - k * h * (1 - h);
}
export function smax(a, b, k) { return -smin(-a, -b, k); }
export function hypot2(x, z) { return Math.sqrt(x * x + z * z); }
export function fmtTime(sec, approx = false) {
  if (!isFinite(sec) || sec < 0) return '--:--.---';
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  const str = `${m}:${s < 10 ? '0' : ''}${s.toFixed(3)}`;
  return approx ? `≈ ${str}` : str;
}
