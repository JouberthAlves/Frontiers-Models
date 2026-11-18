// Materials of the cars: clear-coated paint with livery, number and shut lines; tinted glass that
// keeps its reflections while letting the dark cabin show through; chrome, rubber, matte plastic,
// emissive lamps; rims, discs and calipers.

import * as THREE from 'three';
import { inject } from '../materials.js';
import { colorFromFunc, nraFromHeight, fbmTile, vnoise, hash2 } from '../proctex.js';

export const LIVERIES = [
  { id: 'rosso', name: 'Vermelho Corsa', color: 0xb1141b, metal: 0.25, stripe: 0xf2efe6, stripes: 1, number: 7, numberColor: '#b1141b', caliper: 0xe3ac0a, rim: 'silver' },
  { id: 'azul', name: 'Azul Atlântico', color: 0x0f3a8f, metal: 0.75, stripe: 0xffffff, stripes: 0, number: 23, numberColor: '#0f3a8f', caliper: 0xd92a1c, rim: 'silver' },
  { id: 'amarelo', name: 'Amarelo Sol', color: 0xe3ac0a, metal: 0.2, stripe: 0x141414, stripes: 1, number: 5, numberColor: '#141414', caliper: 0xb1141b, rim: 'dark' },
  { id: 'branco', name: 'Branco Pérola', color: 0xe8e6df, metal: 0.45, stripe: 0xc0271f, stripes: 1, number: 12, numberColor: '#c0271f', caliper: 0xc0271f, rim: 'dark' },
  { id: 'verde', name: 'Verde Oliva', color: 0x10492f, metal: 0.7, stripe: 0xd8b24a, stripes: 0, number: 44, numberColor: '#10492f', caliper: 0xd8b24a, rim: 'silver' },
  { id: 'grafite', name: 'Grafite', color: 0x25272c, metal: 0.8, stripe: 0xff6a1f, stripes: 1, number: 81, numberColor: '#25272c', caliper: 0xff6a1f, rim: 'silver' },
];

const MAX_GAPS = 10;
const SHADOW_PUSH = 2.6;      // see Materials.patch: the smooth shell grazes the low sun

const PAINT_PARS_V = 'varying vec3 vObjPos; varying vec3 vObjNrm;';
const PAINT_PARS_F = /* glsl */`
varying vec3 vObjPos; varying vec3 vObjNrm;
uniform vec3 uStripeColor; uniform vec3 uStripe;      // on/off, offset from the centre line, half width
uniform vec4 uDecalSide; uniform vec4 uDecalTop;
uniform vec4 uGapPlane[${MAX_GAPS}]; uniform vec3 uGapMin[${MAX_GAPS}]; uniform vec3 uGapMax[${MAX_GAPS}];
uniform float uDirt; uniform float uFlake; uniform float uFlakeScale;
float carGap; float carDust;
`;
const PAINT_MAP = /* glsl */`
{
  vec3 op = vObjPos; vec3 on = normalize(vObjNrm); vec3 ops = vec3(op.x, op.y, abs(op.z));
  // stripes along the top surfaces
  float topness = smoothstep(0.3, 0.62, on.y);
  float sw = fwidth(op.z) + 0.0015;
  float st = (1.0 - smoothstep(uStripe.z - sw, uStripe.z + sw, abs(abs(op.z) - uStripe.y))) * topness * uStripe.x;
  diffuseColor.rgb = mix(diffuseColor.rgb, uStripeColor, st);
  // race number: both sides and the bonnet (the livery texture holds the roundel, alpha = coverage)
  vec2 duv = (op.xy - uDecalSide.xy) / uDecalSide.zw;
  if (abs(on.z) > 0.4 && duv.x > 0.0 && duv.x < 1.0 && duv.y > 0.0 && duv.y < 1.0) {
    if (op.z < 0.0) duv.x = 1.0 - duv.x;
    vec4 dc = texture2D(map, duv); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a);
  }
  vec2 tuv = (vec2(op.z, op.x) - uDecalTop.xy) / uDecalTop.zw;
  if (on.y > 0.45 && tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
    vec4 dc = texture2D(map, vec2(1.0 - tuv.x, 1.0 - tuv.y)); diffuseColor.rgb = mix(diffuseColor.rgb, dc.rgb, dc.a);
  }
  // shut lines
  float gap = 1.0;
  for (int i = 0; i < ${MAX_GAPS}; i++) {
    vec3 a = step(uGapMin[i], ops) * step(ops, uGapMax[i]);
    float d = abs(dot(uGapPlane[i].xyz, ops) + uGapPlane[i].w);
    gap = min(gap, mix(1.0, d, a.x * a.y * a.z));
  }
  float px = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));
  carGap = 1.0 - smoothstep(0.0022, 0.0022 + px * 1.3 + 0.0008, gap);
  diffuseColor.rgb *= mix(1.0, 0.06, carGap);
  // road dust on the lower body
  carDust = smoothstep(0.55, 0.15, op.y) * uDirt;
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.3, 0.25, 0.19), carDust * 0.45);
}
`;
const GRAIN_NORMAL = (scaleU, strengthU) => /* glsl */`
{
  vec3 gon = normalize(vObjNrm);
  vec2 guv = abs(gon.y) > 0.6 ? vObjPos.xz : (abs(gon.z) > abs(gon.x) ? vObjPos.xy : vObjPos.zy);
  vec3 gr = texture2D(normalMap, guv * ${scaleU}).rgb - 0.5;
  normal = normalize(normal + gr * ${strengthU});
}
`;

export class CarMaterials {
  constructor(materials) {
    this.M = materials; this.gfx = materials.gfx;
    const aniso = Math.min(8, this.gfx.maxAniso);
    // fine random grain: metallic flakes of the paint, texture of plastics, fabric and cast metal
    this.grain = colorFromFunc(1024, (u, v) => {
      const x = Math.floor(u * 1024), y = Math.floor(v * 1024);
      return [hash2(x, y, 1) * 255, hash2(x, y, 2) * 255, hash2(x, y, 3) * 255];
    }, { anisotropy: aniso });
    this.grain.colorSpace = THREE.NoColorSpace;
    // tyre: tread band in the middle of v, sidewalls outside; u repeats around the wheel
    const treadZone = (v) => v > 0.3 && v < 0.7;
    this.tireNra = nraFromHeight(1024, (u, v) => {
      if (treadZone(v)) {
        const t = (v - 0.3) / 0.4;
        let h = 1;
        for (const g of [0.2, 0.42, 0.58, 0.8]) h = Math.min(h, Math.min(1, Math.abs(t - g) / 0.035));           // circumferential grooves
        const sipe = Math.abs((((u * 4 + (t < 0.5 ? t : 1 - t) * 0.9) % 1) + 1) % 1 - 0.5);                         // angled lateral sipes
        h = Math.min(h, Math.min(1, sipe / 0.06));
        return h * 0.02;
      }
      const s = v < 0.3 ? v / 0.3 : (1 - v) / 0.3;
      return 0.004 * Math.sin(s * 40) + (s > 0.45 && s < 0.6 ? 0.006 : 0);                                         // sidewall ribs and a raised band
    }, { strength: 45, rough: (u, v) => (treadZone(v) ? 0.9 : 0.78) + 0.08 * fbmTile(u, v, 3, 8, 3), anisotropy: aniso });
    this.tireMap = colorFromFunc(1024, (u, v) => {
      const n = fbmTile(u, v, 9, 6, 4); const dust = treadZone(v) ? 0.5 + 0.5 * n : 0.25 * n;
      const k = 22 + 16 * n; return [k + dust * 20, k + dust * 16, k + dust * 11];
    }, { anisotropy: aniso });
    this.discNra = nraFromHeight(1024, (u, v) => 0.5 * Math.sin(v * 600) * 0.002 + fbmTile(u * 0.2, v, 5, 8, 3) * 0.002, { strength: 30, rough: () => 0.42, anisotropy: aniso });
    // soft round shadow under each car
    this.blob = colorFromFunc(1024, (u, v) => {
      const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2;
      const r = Math.pow(Math.pow(Math.abs(dx), 2.6) + Math.pow(Math.abs(dy), 2.6), 1 / 2.6);
      const a = Math.max(0, 1 - r); return [0, 0, 0, Math.min(255, Math.pow(a, 1.25) * 300)];
    }, { alpha: true, anisotropy: 1 });
    this.blob.wrapS = this.blob.wrapT = THREE.ClampToEdgeWrapping;
    this.shared = {};
    this._buildShared();
  }

  _grainPatch(key, scale, strength, extra = {}) {
    return {
      key: 'cargrain' + key, vertexPars: PAINT_PARS_V, vertexMain: 'vObjPos = position; vObjNrm = normal;',
      fragmentPars: 'varying vec3 vObjPos; varying vec3 vObjNrm;',
      hooks: [(shader) => { shader.fragmentShader = inject(shader.fragmentShader, '#include <normal_fragment_maps>', GRAIN_NORMAL(scale.toFixed(1), strength.toFixed(3))); }],
      shadowPush: SHADOW_PUSH, ...extra,
    };
  }

  _buildShared() {
    const M = this.M, S = this.shared;
    S.trim = M.patch(new THREE.MeshStandardMaterial({ color: 0x0d0d0e, roughness: 0.6, metalness: 0.1, normalMap: this.grain }), this._grainPatch('t', 30, 0.16)); S.trim.name = 'car_plastic_matte';
    S.interior = M.patch(new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.9, metalness: 0, normalMap: this.grain }), this._grainPatch('i', 40, 0.3)); S.interior.name = 'car_interior';
    S.lamp = M.patch(new THREE.MeshPhysicalMaterial({ color: 0x23262b, roughness: 0.12, metalness: 0.95, clearcoat: 1, clearcoatRoughness: 0.03, normalMap: this.grain }), this._grainPatch('l', 60, 0.03)); S.lamp.name = 'car_lamp_housing';
    S.chrome = M.patch(new THREE.MeshStandardMaterial({ color: 0x8a8d92, roughness: 0.16, metalness: 1, normalMap: this.grain, envMapIntensity: 0.8 }), this._grainPatch('c', 60, 0.03)); S.chrome.name = 'car_chrome';
    S.drl = M.patch(new THREE.MeshStandardMaterial({ color: 0x8a8a8a, emissive: new THREE.Color(1, 0.94, 0.84), emissiveIntensity: 5, roughness: 0.2 }), { key: 'cardrl' }); S.drl.name = 'car_headlight_emissive';
    S.glass = this._glass();
    S.tire = M.patch(new THREE.MeshStandardMaterial({ map: this.tireMap, normalMap: this.tireNra, roughness: 1, metalness: 0 }), { key: 'cartire', nra: true }); S.tire.name = 'car_rubber';
    S.disc = M.patch(new THREE.MeshStandardMaterial({ color: 0x8d8f93, normalMap: this.discNra, roughness: 1, metalness: 0.9 }), { key: 'cardisc', nra: true }); S.disc.name = 'car_brake_disc';
    S.rimDark = M.patch(new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.32, metalness: 0.95, normalMap: this.grain, side: THREE.DoubleSide }), this._grainPatch('r', 50, 0.05)); S.rimDark.name = 'car_rim_gunmetal';
    S.rimSilver = M.patch(new THREE.MeshStandardMaterial({ color: 0xb9bcc2, roughness: 0.22, metalness: 1, normalMap: this.grain, side: THREE.DoubleSide }), this._grainPatch('r', 50, 0.05)); S.rimSilver.name = 'car_rim_silver';
    S.blob = new THREE.MeshBasicMaterial({ map: this.blob, transparent: true, depthWrite: false, opacity: 0.62, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    S.blob.name = 'car_contact_shadow'; S.blob.userData.decal = true;
  }

  _glass() {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0x0b1316, roughness: 0.02, metalness: 0, transparent: true, opacity: 0.46, depthWrite: false, envMapIntensity: 1.35,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      specularIntensity: 1, ior: 1.52,
    });
    this.M.patch(m, {
      key: 'carglass', shadowPush: SHADOW_PUSH,
      hooks: [(shader) => {
        // the tint is attenuated by the opacity, the reflection is not: glass stays glossy while see-through
        shader.fragmentShader = inject(shader.fragmentShader, 'vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;', 'vec3 outgoingLight = totalDiffuse * diffuseColor.a + totalSpecular + totalEmissiveRadiance;');
      }],
    });
    m.name = 'car_glass'; m.userData.glass = true;
    return m;
  }

  /** number roundel texture of one livery */
  numberTexture(livery) {
    return this.M.canvasTexture(1024, (ctx, s) => {
      ctx.clearRect(0, 0, s, s);
      ctx.beginPath(); ctx.arc(s / 2, s / 2, s * 0.46, 0, Math.PI * 2); ctx.fillStyle = '#f3f1ea'; ctx.fill();
      ctx.lineWidth = s * 0.022; ctx.strokeStyle = livery.numberColor; ctx.stroke();
      ctx.fillStyle = livery.numberColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const txt = String(livery.number);
      ctx.font = `italic 700 ${txt.length > 1 ? s * 0.5 : s * 0.62}px Bahnschrift, "Arial Narrow", Arial, sans-serif`;
      ctx.fillText(txt, s / 2 - s * 0.01, s / 2 + s * 0.035);
    }, { repeat: false });
  }

  /** per-car materials: paint (livery), tail lamps (brake light), caliper */
  forCar(design, livery) {
    const M = this.M;
    const gaps = (design.gaps || []).slice(0, MAX_GAPS);
    const pad = (arr, fill) => { const out = arr.slice(); while (out.length < MAX_GAPS) out.push(fill()); return out; };
    const uniforms = {
      uStripeColor: { value: new THREE.Color(livery.stripe) }, uStripe: { value: new THREE.Vector3(livery.stripes, 0.19, 0.075) },
      uDecalSide: { value: new THREE.Vector4(...design.decalSide) }, uDecalTop: { value: new THREE.Vector4(...design.decalTop) },
      uGapPlane: { value: pad(gaps.map((g) => new THREE.Vector4(...g.p)), () => new THREE.Vector4(0, 1, 0, 100)) },
      uGapMin: { value: pad(gaps.map((g) => new THREE.Vector3(...g.min)), () => new THREE.Vector3(9, 9, 9)) },
      uGapMax: { value: pad(gaps.map((g) => new THREE.Vector3(...g.max)), () => new THREE.Vector3(9, 9, 9)) },
      uDirt: { value: 0.5 }, uFlake: { value: 0.02 + 0.07 * livery.metal }, uFlakeScale: { value: 60 },
    };
    const paint = new THREE.MeshPhysicalMaterial({
      color: livery.color, metalness: livery.metal * 0.8, roughness: 0.52 - 0.14 * livery.metal, clearcoat: 1, clearcoatRoughness: 0.03,
      map: this.numberTexture(livery), normalMap: this.grain, envMapIntensity: 1.2, specularIntensity: 0.7,
    });
    M.patch(paint, {
      key: 'carpaint', shadowPush: SHADOW_PUSH, uniforms, vertexPars: PAINT_PARS_V, vertexMain: 'vObjPos = position; vObjNrm = normal;', fragmentPars: PAINT_PARS_F,
      hooks: [(shader) => {
        let fs = shader.fragmentShader;
        fs = inject(fs, '#include <map_fragment>', PAINT_MAP);
        fs = inject(fs, '#include <roughnessmap_fragment>', 'float roughnessFactor = roughness;\nroughnessFactor = mix(roughnessFactor, 0.9, max(carGap, carDust * 0.6));');
        fs = inject(fs, '#include <normal_fragment_maps>', GRAIN_NORMAL('uFlakeScale', 'uFlake'));
        fs = inject(fs, '#include <lights_physical_fragment>', '#include <lights_physical_fragment>\nmaterial.clearcoat *= (1.0 - carGap) * (1.0 - carDust * 0.7);');
        shader.fragmentShader = fs;
      }],
    });
    paint.name = 'car_paint_clearcoat';
    const tail = M.patch(new THREE.MeshStandardMaterial({ color: 0x3a0606, emissive: new THREE.Color(1, 0.04, 0.02), emissiveIntensity: 1.1, roughness: 0.25 }), { key: 'cartail' });
    tail.name = 'car_taillight_emissive';
    const caliper = M.patch(new THREE.MeshStandardMaterial({ color: livery.caliper, roughness: 0.45, metalness: 0.3, normalMap: this.grain }), this._grainPatch('k', 50, 0.08));
    caliper.name = 'car_caliper';
    return { paint, tail, caliper, ...this.shared };
  }
}
