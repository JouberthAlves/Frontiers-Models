// GLSL of the post-processing chain. Everything works on the linear HDR scene buffer; tone
// mapping (AgX) and the sRGB transfer happen once, in the final pass.

export const VS_FULLSCREEN = /* glsl */`
out vec2 vUv;
void main() {
  // one triangle covering the screen (position attribute holds clip-space xy)
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const COMMON = /* glsl */`
precision highp float;
in vec2 vUv;
uniform vec2 uTexel;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`;

const DEPTH = /* glsl */`
uniform sampler2D tDepth;
uniform float uNear; uniform float uFar;
uniform mat4 uProjInv;
float rawDepth(vec2 uv) { return textureLod(tDepth, uv, 0.0).x; }
float viewZ(float d) { return (uNear * uFar) / ((uFar - uNear) * d - uFar); }   // negative in front of the camera
vec3 viewPos(vec2 uv, float d) {
  vec4 clip = vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  vec4 v = uProjInv * clip; return v.xyz / v.w;
}
`;

// ------------------------------------------------------------------ ambient occlusion (half resolution)
export const FS_AO = /* glsl */`
${COMMON}${DEPTH}
uniform float uRadius; uniform float uProjScale; uniform float uFrame;
out vec4 outColor;
float hash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
void main() {
  float d = rawDepth(vUv);
  if (d >= 0.99999) { outColor = vec4(1.0, 1.0, 0.0, 1.0); return; }
  vec3 P = viewPos(vUv, d);
  // normal from the depth buffer, taking the shorter derivative on each axis
  vec3 Pr = viewPos(vUv + vec2(uTexel.x, 0.0), rawDepth(vUv + vec2(uTexel.x, 0.0)));
  vec3 Pl = viewPos(vUv - vec2(uTexel.x, 0.0), rawDepth(vUv - vec2(uTexel.x, 0.0)));
  vec3 Pu = viewPos(vUv + vec2(0.0, uTexel.y), rawDepth(vUv + vec2(0.0, uTexel.y)));
  vec3 Pd = viewPos(vUv - vec2(0.0, uTexel.y), rawDepth(vUv - vec2(0.0, uTexel.y)));
  vec3 dx = abs(Pr.z - P.z) < abs(P.z - Pl.z) ? Pr - P : P - Pl;
  vec3 dy = abs(Pu.z - P.z) < abs(P.z - Pd.z) ? Pu - P : P - Pd;
  vec3 N = normalize(cross(dx, dy));
  float dist = -P.z;
  float rad = min(uRadius * uProjScale / dist, 0.09);     // screen-space radius (uv units, vertical)
  float fade = 1.0 - smoothstep(60.0, 110.0, dist);
  if (rad < uTexel.y * 1.5 || fade <= 0.0) { outColor = vec4(1.0, dist / uFar, 0.0, 1.0); return; }
  float a0 = hash(gl_FragCoord.xy + uFrame * 0.0) * 6.2831853;
  float occ = 0.0;
  const int N_S = 10;
  for (int i = 0; i < N_S; i++) {
    float t = (float(i) + 0.5) / float(N_S);
    float ang = a0 + float(i) * 2.399963;
    vec2 off = vec2(cos(ang), sin(ang)) * rad * sqrt(t) * vec2(uTexel.x / uTexel.y, 1.0);
    vec2 suv = vUv + off;
    vec3 S = viewPos(suv, rawDepth(suv));
    vec3 v = S - P;
    float vv = dot(v, v);
    float vn = dot(v, N);
    float w = max(0.0, 1.0 - vv / (uRadius * uRadius * 2.2));
    occ += max(0.0, vn - 0.02 * dist * 0.05 - 0.012) / (vv + 0.004) * w;
  }
  occ = clamp(1.0 - occ * (2.0 * uRadius / float(N_S)) * 1.15, 0.0, 1.0);
  outColor = vec4(mix(1.0, occ, fade), dist / uFar, 0.0, 1.0);
}`;

export const FS_AO_BLUR = /* glsl */`
${COMMON}
uniform sampler2D tAO; uniform vec2 uDir;
out vec4 outColor;
void main() {
  vec2 c = texture(tAO, vUv).xy;
  float sum = c.x * 0.28, wsum = 0.28;
  for (int i = 1; i <= 3; i++) {
    float w0 = i == 1 ? 0.22 : i == 2 ? 0.1 : 0.04;
    for (int s = -1; s <= 1; s += 2) {
      vec2 t = textureLod(tAO, vUv + uDir * uTexel * float(i * s), 0.0).xy;
      float w = w0 * max(0.0, 1.0 - abs(t.y - c.y) / (0.02 * c.y + 1e-5));
      sum += t.x * w; wsum += w;
    }
  }
  outColor = vec4(sum / wsum, c.y, 0.0, 1.0);
}`;

// ------------------------------------------------------------------ composite: AO + camera motion blur
export const FS_COMPOSITE = /* glsl */`
${COMMON}${DEPTH}
uniform sampler2D tScene; uniform sampler2D tAO; uniform sampler2D tMask;
uniform mat4 uReproject;        // current clip -> previous clip
uniform float uBlur;            // 0 = off
uniform float uAOStrength;
uniform float uAOEnabled;
out vec4 outColor;
float hash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
vec3 shade(vec2 uv) {
  vec3 c = texture(tScene, uv).rgb;
  return c;
}
void main() {
  float d = rawDepth(vUv);
  vec3 col = texture(tScene, vUv).rgb;
  float mask = texture(tMask, vUv).r;
  if (uBlur > 0.0 && mask < 0.5) {
    vec4 clip = vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
    vec4 prev = uReproject * clip;
    vec2 puv = prev.xy / max(prev.w, 1e-4) * 0.5 + 0.5;
    vec2 vel = (vUv - puv) * uBlur;
    float len = length(vel);
    float maxLen = 0.045;
    if (len > maxLen) vel *= maxLen / len;
    if (len > uTexel.y * 0.75) {
      float j = hash(gl_FragCoord.xy) - 0.5;
      vec3 acc = col; float wsum = 1.0;
      const int N_S = 9;
      for (int i = 0; i < N_S; i++) {
        float t = (float(i) + 0.5 + j) / float(N_S) - 0.5;
        vec2 suv = vUv + vel * t;
        float m = textureLod(tMask, suv, 0.0).r;
        float w = (1.0 - step(0.5, m)) * step(0.0, suv.x) * step(suv.x, 1.0) * step(0.0, suv.y) * step(suv.y, 1.0);
        acc += textureLod(tScene, suv, 0.0).rgb * w; wsum += w;
      }
      col = acc / wsum;
    }
  }
  if (uAOEnabled > 0.5) {
    float ao = texture(tAO, vUv).x;
    // keep bright speculars and the sky clean: occlusion mostly acts on diffuse-range values
    float keep = smoothstep(1.5, 5.0, luma(col));
    col *= mix(mix(1.0, ao, uAOStrength), 1.0, keep);
  }
  outColor = vec4(col, 1.0);
}`;

// ------------------------------------------------------------------ bloom (dual filtering)
export const FS_BLOOM_DOWN = /* glsl */`
${COMMON}
uniform sampler2D tSrc; uniform float uThreshold; uniform float uFirst;
out vec4 outColor;
vec3 pre(vec3 c) {
  if (uFirst < 0.5) return c;
  c = min(c, vec3(64.0));
  float l = luma(c);
  float soft = clamp(l - uThreshold + 0.5, 0.0, 1.0); soft = soft * soft * 0.5;
  float k = max(soft, l - uThreshold) / max(l, 1e-4);
  return c * k;
}
void main() {
  // 13-tap downsample (Jimenez), firefly-safe on the first level
  vec2 t = uTexel;
  vec3 a = pre(texture(tSrc, vUv + t * vec2(-2.0, 2.0)).rgb), b = pre(texture(tSrc, vUv + t * vec2(0.0, 2.0)).rgb), c = pre(texture(tSrc, vUv + t * vec2(2.0, 2.0)).rgb);
  vec3 d = pre(texture(tSrc, vUv + t * vec2(-2.0, 0.0)).rgb), e = pre(texture(tSrc, vUv).rgb), f = pre(texture(tSrc, vUv + t * vec2(2.0, 0.0)).rgb);
  vec3 g = pre(texture(tSrc, vUv + t * vec2(-2.0, -2.0)).rgb), h = pre(texture(tSrc, vUv + t * vec2(0.0, -2.0)).rgb), i = pre(texture(tSrc, vUv + t * vec2(2.0, -2.0)).rgb);
  vec3 j = pre(texture(tSrc, vUv + t * vec2(-1.0, 1.0)).rgb), k = pre(texture(tSrc, vUv + t * vec2(1.0, 1.0)).rgb);
  vec3 l = pre(texture(tSrc, vUv + t * vec2(-1.0, -1.0)).rgb), m = pre(texture(tSrc, vUv + t * vec2(1.0, -1.0)).rgb);
  vec3 col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  outColor = vec4(col, 1.0);
}`;

export const FS_BLOOM_UP = /* glsl */`
${COMMON}
uniform sampler2D tSrc; uniform sampler2D tAdd; uniform float uRadius;
out vec4 outColor;
void main() {
  vec2 t = uTexel * uRadius;
  vec3 c = texture(tSrc, vUv + t * vec2(-1.0, 1.0)).rgb + texture(tSrc, vUv + t * vec2(1.0, 1.0)).rgb + texture(tSrc, vUv + t * vec2(-1.0, -1.0)).rgb + texture(tSrc, vUv + t * vec2(1.0, -1.0)).rgb;
  c += 2.0 * (texture(tSrc, vUv + t * vec2(0.0, 1.0)).rgb + texture(tSrc, vUv + t * vec2(0.0, -1.0)).rgb + texture(tSrc, vUv + t * vec2(1.0, 0.0)).rgb + texture(tSrc, vUv + t * vec2(-1.0, 0.0)).rgb);
  c += 4.0 * texture(tSrc, vUv).rgb;
  outColor = vec4(c / 16.0 + texture(tAdd, vUv).rgb, 1.0);
}`;

// ------------------------------------------------------------------ sun shafts (quarter resolution)
export const FS_SHAFTS = /* glsl */`
${COMMON}
uniform sampler2D tDepth; uniform sampler2D tScene;
uniform vec2 uSun;            // sun position in uv
uniform float uSunVisible;    // 0..1 (in front of the camera)
uniform float uAspect;
out vec4 outColor;
float hash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
void main() {
  if (uSunVisible <= 0.001) { outColor = vec4(0.0); return; }
  vec2 dir = uSun - vUv;
  float distSun = length(dir * vec2(uAspect, 1.0));
  const int N_S = 24;
  vec2 stepv = dir / float(N_S) * 0.92;
  float j = hash(gl_FragCoord.xy);
  vec2 uv = vUv + stepv * j;
  float acc = 0.0; float decay = 1.0;
  for (int i = 0; i < N_S; i++) {
    float sky = step(0.99999, textureLod(tDepth, uv, 0.0).x);
    // only the bright part of the sky around the sun feeds the shafts
    vec2 ds = (uv - uSun) * vec2(uAspect, 1.0);
    float near = exp(-dot(ds, ds) * 9.0);
    acc += sky * near * decay;
    decay *= 0.955;
    uv += stepv;
  }
  acc /= float(N_S);
  float fall = exp(-distSun * 1.6);
  outColor = vec4(vec3(acc * fall * uSunVisible), 1.0);
}`;

// ------------------------------------------------------------------ final: bloom + shafts + flare, tone map, grade, sRGB
export const FS_FINAL = /* glsl */`
${COMMON}
#include <tonemapping_pars_fragment>
uniform sampler2D tColor; uniform sampler2D tBloom; uniform sampler2D tShafts; uniform sampler2D tMeter;
uniform float uBloom; uniform float uShafts; uniform vec3 uSunColor;
uniform vec2 uSun; uniform float uSunVisible; uniform float uAspect; uniform float uFlare;
uniform float uTime; uniform float uVignette; uniform float uGrain; uniform float uSaturation; uniform float uContrast;
uniform float uFxaa; uniform float uTonemap; uniform float uHue;
out vec4 outColor;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 fetch(vec2 uv) { return texture(tColor, uv).rgb; }
vec3 fxaa(vec2 uv) {
  // compact FXAA on the HDR colour (luma in a perceptual-ish space)
  vec3 cM = fetch(uv);
  if (uFxaa < 0.5) return cM;
  vec3 cN = fetch(uv + vec2(0.0, uTexel.y)), cS = fetch(uv - vec2(0.0, uTexel.y)), cE = fetch(uv + vec2(uTexel.x, 0.0)), cW = fetch(uv - vec2(uTexel.x, 0.0));
  #define L(c) sqrt(luma(c / (1.0 + c)))
  float lM = L(cM), lN = L(cN), lS = L(cS), lE = L(cE), lW = L(cW);
  float lMin = min(lM, min(min(lN, lS), min(lE, lW))), lMax = max(lM, max(max(lN, lS), max(lE, lW)));
  float range = lMax - lMin;
  if (range < max(0.03, lMax * 0.12)) return cM;
  vec2 dir = vec2(-((lN + lS) - 2.0 * lM) * 0.0 + (lS - lN), (lE - lW));
  dir = vec2(-(lN - lS), (lW - lE));
  float rcp = 1.0 / (min(abs(dir.x), abs(dir.y)) + 0.02);
  dir = clamp(dir * rcp, -4.0, 4.0) * uTexel;
  vec3 a = 0.5 * (fetch(uv + dir * (1.0 / 3.0 - 0.5)) + fetch(uv + dir * (2.0 / 3.0 - 0.5)));
  vec3 b = a * 0.5 + 0.25 * (fetch(uv - dir * 0.5) + fetch(uv + dir * 0.5));
  float lB = L(b);
  return (lB < lMin || lB > lMax) ? a : b;
}
void main() {
  vec3 col = fxaa(vUv);
  col += texture(tBloom, vUv).rgb * uBloom;
  col += texture(tShafts, vUv).rgb * uSunColor * uShafts;
  // discreet lens flare: two soft ghosts and a faint halo on the sun axis
  if (uFlare > 0.0 && uSunVisible > 0.0) {
    vec2 c = vec2(0.5); vec2 axis = c - uSun;
    float f = 0.0;
    vec2 g1 = uSun + axis * 1.45, g2 = uSun + axis * 0.6, g3 = uSun + axis * 1.9;
    vec2 q;
    q = (vUv - g1) * vec2(uAspect, 1.0); f += 0.10 * smoothstep(0.05, 0.0, length(q));
    q = (vUv - g2) * vec2(uAspect, 1.0); f += 0.07 * smoothstep(0.025, 0.0, length(q));
    q = (vUv - g3) * vec2(uAspect, 1.0); f += 0.035 * (smoothstep(0.1, 0.085, length(q)) - smoothstep(0.085, 0.06, length(q)) * 0.8);
    col += uSunColor * f * uFlare * uSunVisible;
  }
  // tone map (AgX) then a light grade in display space
  col *= toneMappingExposure * texture(tMeter, vec2(0.5)).r;
  vec3 scene = col;
  if (uTonemap < 0.5) col = AgXToneMapping(col);
  else if (uTonemap < 1.5) col = ACESFilmicToneMapping(col);
  else col = NeutralToneMapping(col);
  // The curve works per channel: a saturated colour in strong light (red paint in the last sun) drifts towards
  // orange and then white. Part of the hue the scene had is given back: the same proportions between the channels,
  // at the brightness the curve arrived at. Not for the very brightest (the sun and its glare still burn to white).
  float pk = max(scene.r, max(scene.g, scene.b));
  if (uHue > 0.0 && pk > 1e-4) {
    vec3 kept = scene / pk * max(col.r, max(col.g, col.b));
    col = mix(col, kept, uHue * (1.0 - smoothstep(1.5, 9.0, pk)));
  }
  float l = luma(col);
  col = mix(vec3(l), col, uSaturation);
  col = (col - 0.5) * uContrast + 0.5;
  // vignette
  vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0);
  col *= 1.0 - uVignette * smoothstep(0.35, 1.05, length(v));
  col = clamp(col, 0.0, 1.0);
  outColor = sRGBTransferOETF(vec4(col, 1.0));
  // dither / grain after the transfer function to hide banding in the sky gradient
  outColor.rgb += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * uGrain;
}`;

// Light meter. Estimates how bright the frame would be on screen with the exposure of the place alone and
// answers with a gain (one texel, eased in time): nothing inside the comfortable band, more light for a frame
// that would come out dark (the camera facing a shaded hillside), less for one that would wash out.
export const FS_METER = /* glsl */`
${COMMON}
#include <tonemapping_pars_fragment>
uniform sampler2D tColor; uniform sampler2D tPrev; uniform float uTonemap; uniform float uRate;
uniform vec4 uBand;   // dark limit, bright limit, power, largest gain
uniform float uGuard; // brightest channel the subject may reach before the gain is held back (0 = off)
out vec4 outColor;
void main() {
  float sum = 0.0, subject = 0.0;
  for (int j = 0; j < 9; j++) for (int i = 0; i < 16; i++) {
    vec2 uv = (vec2(float(i), float(j)) + 0.5) / vec2(16.0, 9.0);
    vec3 c = 0.25 * (texture(tColor, uv + vec2(-0.012, -0.02)).rgb + texture(tColor, uv + vec2(0.012, -0.02)).rgb
                   + texture(tColor, uv + vec2(-0.012, 0.02)).rgb + texture(tColor, uv + vec2(0.012, 0.02)).rgb);
    c = min(c, vec3(64.0)) * toneMappingExposure;
    if (uTonemap < 0.5) c = AgXToneMapping(c);
    else if (uTonemap < 1.5) c = ACESFilmicToneMapping(c);
    else c = NeutralToneMapping(c);
    vec3 d = sRGBTransferOETF(vec4(clamp(c, 0.0, 1.0), 1.0)).rgb;
    sum += luma(d);
    // the middle of the frame is the subject (the car, in the chase view): its brightest channel
    if (i >= 6 && i <= 9 && j >= 3 && j <= 4) subject = max(subject, max(d.r, max(d.g, d.b)));
  }
  float m = max(sum / 144.0, 0.02);
  float k = m < uBand.x ? min(uBand.w, pow(uBand.x / m, uBand.z)) : (m > uBand.y ? max(0.75, pow(uBand.y / m, uBand.z)) : 1.0);
  // expose for the shade, but not at the price of a burnt subject: a car in the last sun in front of a hillside
  // in shadow keeps its colour (and a frame whose middle is already burnt is taken down a little)
  if (uGuard > 0.0) k = min(k, clamp(uGuard / max(subject, 0.05), 0.8, 9.0));
  float prev = texture(tPrev, vec2(0.5)).r;
  outColor = vec4(vec3(mix(prev, k, uRate)), 1.0);
}`;

// flat mask of the cars (kept sharp by the motion blur)
export const FS_COPY = /* glsl */`
${COMMON}
uniform sampler2D tSrc;
out vec4 outColor;
void main() { outColor = texture(tSrc, vUv); }`;
