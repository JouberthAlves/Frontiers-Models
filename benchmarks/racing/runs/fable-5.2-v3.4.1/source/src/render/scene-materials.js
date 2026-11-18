// Shared PBR materials of the scenery (props, barriers, buildings, rocks): one material per
// surface type, built from the CC0 texture sets or drawn procedurally at 1024 px. Parts are tinted
// with vertex colours, so many objects share few materials (few draw calls, few programs).

import * as THREE from 'three';
import { inject } from './materials.js';
import { colorFromFunc, nraFromHeight, fbmTile, vnoise } from './proctex.js';

export const SCENE_SETS = [
  'corrugated_iron', 'rusty_metal_02', 'weathered_brown_planks', 'wood_planks_grey', 'blue_painted_planks', 'green_rough_planks', 'rough_pine_door',
  'concrete_wall_008', 'old_stone_wall', 'yellow_stone_wall', 'rustic_stone_wall', 'white_stucco_02', 'painted_plaster_wall', 'yellow_plaster', 'worn_plaster_wall',
  'clay_roof_tiles_02', 'clay_roof_tiles_03', 'roof_tiles_14', 'rock_face_03', 'cliff_side', 'cobblestone_floor_04', 'stone_pavers', 'brushed_concrete',
];

const TRI_PARS_V = 'varying vec3 vWNrm;';
const TRI_MAIN_V = /* glsl */`
  #ifdef USE_INSTANCING
    vWNrm = normalize(mat3(modelMatrix) * (mat3(instanceMatrix) * normal));
  #else
    vWNrm = normalize(mat3(modelMatrix) * normal);
  #endif
`;
const TRI_PARS_F = /* glsl */`
varying vec3 vWNrm; uniform float uTriScale; uniform float uWetLevel;
vec4 triNRA; vec3 triNormalW;
`;
const TRI_MAP = /* glsl */`
{
  vec3 nW = normalize(vWNrm); vec3 bw = pow(abs(nW), vec3(5.0)); bw /= (bw.x + bw.y + bw.z);
  vec2 ux = vWPos.zy * uTriScale, uy = vWPos.xz * uTriScale, uz = vWPos.xy * uTriScale;
  vec4 a = texture2D(map, ux) * bw.x + texture2D(map, uy) * bw.y + texture2D(map, uz) * bw.z;
  vec4 nx = texture2D(normalMap, ux), ny = texture2D(normalMap, uy), nz = texture2D(normalMap, uz);
  triNRA = nx * bw.x + ny * bw.y + nz * bw.z;
  vec2 tx = nx.xy * 2.0 - 1.0, ty = ny.xy * 2.0 - 1.0, tz = nz.xy * 2.0 - 1.0;
  triNormalW = normalize(nW + (vec3(0.0, tx.y, tx.x) * bw.x + vec3(ty.x, 0.0, ty.y) * bw.y + vec3(tz.x, tz.y, 0.0) * bw.z) * 1.15);
  // wet band just above the water line
  float wet = 1.0 - smoothstep(uWetLevel + 0.12, uWetLevel + 0.8, vWPos.y);
  // under the water line the stone is dark and matt (the water above it does the reflecting)
  float under = 1.0 - smoothstep(uWetLevel - 0.06, uWetLevel + 0.04, vWPos.y);
  diffuseColor.rgb *= a.rgb * mix(1.0, 0.42, wet);
  // ... and silted over: a little below the surface the stone takes the colour of the sea bed around it,
  // so its submerged skirt does not read as a hard-edged shape through the water
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.2, 0.17), smoothstep(0.02, 0.28, uWetLevel - vWPos.y) * 0.8);
  triNRA.b = mix(mix(triNRA.b, 0.5, wet * 0.7), 1.0, under);      // wet stone: darker, a soft sheen (not a mirror of the bright sky)
}
`;

export class SceneMaterials {
  constructor(materials, env) {
    this.M = materials; this.env = env; this.cache = new Map();
    this.aniso = Math.min(materials.gfx.quality.anisotropy, materials.gfx.maxAniso);
  }
  static textureSets() { return SCENE_SETS; }

  /** standard material from a texture set, tinted by vertex colours; texture covers `size` metres */
  set(key, set, { size = 2, color = 0xffffff, metalness = 0, roughness = 1, side = THREE.FrontSide, vertexColors = true, res = '1k' } = {}) {
    if (this.cache.has(key)) return this.cache.get(key);
    const m = this.M.std({ set, res, repeat: 1 / size, color, metalness, roughness, side, vertexColors });
    m.name = key; this.cache.set(key, m); return m;
  }
  get(key) {
    if (this.cache.has(key)) return this.cache.get(key);
    const S = (k, set, o) => this.set(k, set, o);
    switch (key) {
      case 'iron': return S(key, 'corrugated_iron', { size: 1.2, color: 0x1e2221, metalness: 0.55, roughness: 0.9 });
      case 'steel': return S(key, 'corrugated_iron', { size: 1.5, color: 0xaeb2b6, metalness: 0.85, roughness: 0.75 });
      case 'paintmetal': return S(key, 'rusty_metal_02', { size: 1.6, color: 0xffffff, metalness: 0.3, roughness: 0.8 });
      case 'wood': return S(key, 'weathered_brown_planks', { size: 1.6 });
      case 'woodgrey': return S(key, 'wood_planks_grey', { size: 1.6 });
      case 'woodblue': return S(key, 'blue_painted_planks', { size: 1.6 });
      case 'woodgreen': return S(key, 'green_rough_planks', { size: 1.6 });
      case 'door': return S(key, 'rough_pine_door', { size: 1.4 });
      case 'concrete': return S(key, 'concrete_wall_008', { size: 2.4 });
      case 'stone': return S(key, 'old_stone_wall', { size: 2.2 });
      case 'stoneblock': return S(key, 'yellow_stone_wall', { size: 2.4 });
      case 'rubble': return S(key, 'rustic_stone_wall', { size: 2.4 });
      case 'plaster': return S(key, 'white_stucco_02', { size: 3.0 });
      case 'plaster2': return S(key, 'painted_plaster_wall', { size: 3.0 });
      case 'plasterworn': return S(key, 'worn_plaster_wall', { size: 3.2 });
      case 'plasterochre': return S(key, 'yellow_plaster', { size: 3.0 });
      case 'rooftile': return S(key, 'clay_roof_tiles_02', { size: 2.2 });
      case 'rooftile2': return S(key, 'clay_roof_tiles_03', { size: 2.2 });
      case 'rooftile3': return S(key, 'roof_tiles_14', { size: 2.4 });
      case 'cobble': return S(key, 'cobblestone_floor_04', { size: 2.6 });
      case 'pavers': return S(key, 'stone_pavers', { size: 2.2 });
      case 'rock': return this._rock();
      case 'rockfar': return this._rock('rock_face_03', 'rockfar');     // merged distant rocks (not instanced)
      case 'cliff': return this._rock('cliff_side', 'cliff', 0.16, 0xd9cdb8);
      case 'fabric': return this._fabric();
      case 'signs': return this._signs();
      case 'lampglass': return this._emissive(key, 0xfff0d2, new THREE.Color(1.0, 0.78, 0.45), 3.2);
      case 'windowglass': return this._glass();
      case 'windowlit': { const m = this._emissive(key, 0x2a2118, new THREE.Color(1.0, 0.66, 0.32), 1.5); m.roughness = 0.12; m.userData.glass = true; return m; }
      case 'rubber': return this._rubber();
      case 'galv': return this._galv();
      case 'banner': return this._banner();
      case 'blackmetal': return S(key, 'corrugated_iron', { size: 1.4, color: 0x0c0d0e, metalness: 0.4, roughness: 0.8, vertexColors: false });
      case 'water_still': return this._emissive(key, 0x16343a, new THREE.Color(0, 0, 0), 0);
      default: throw new Error('unknown scene material ' + key);
    }
  }

  _rock(set = 'rock_face_03', key = 'rock', scale = 0.34, color = 0xb9ae9e) {
    const s = this.M.set(set);
    const m = new THREE.MeshStandardMaterial({ map: s.map, normalMap: s.nra, color, roughness: 1, metalness: 0 });
    this.M.patch(m, {
      key: 'triplanar', uniforms: { uTriScale: { value: scale }, uWetLevel: { value: 0 } },
      vertexPars: TRI_PARS_V, vertexMain: TRI_MAIN_V, fragmentPars: TRI_PARS_F,
      hooks: [(shader) => {
        let fs = shader.fragmentShader;
        fs = inject(fs, '#include <map_fragment>', TRI_MAP);
        fs = inject(fs, '#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * triNRA.b;');
        fs = inject(fs, '#include <normal_fragment_maps>', 'normal = normalize((viewMatrix * vec4(triNormalW, 0.0)).xyz);');
        fs = inject(fs, '#include <aomap_fragment>', 'reflectedLight.indirectDiffuse *= mix(1.0, triNRA.a, 0.9);');
        // the low sun does not reach the submerged faces: at that angle the water surface reflects it away
        if (!fs.includes('directLight.color *= terrainSun;')) throw new Error('shader anchor not found: terrainSun');
        fs = fs.split('directLight.color *= terrainSun;').join('directLight.color *= terrainSun * smoothstep(uWetLevel - 0.12, uWetLevel + 0.03, vWPos.y);');
        shader.fragmentShader = fs;
      }],
    });
    m.name = key; this.cache.set(key, m); return m;
  }

  _fabric() {
    // 2 x 2 striped canvases (red, blue, yellow, green on off-white) with a woven normal map
    const cols = [[196, 44, 36], [38, 84, 156], [226, 170, 30], [36, 128, 84]];
    const map = colorFromFunc(1024, (u, v) => {
      const tx = u < 0.5 ? 0 : 1, ty = v < 0.5 ? 0 : 1; const c = cols[ty * 2 + tx];
      const lu = (u * 2) % 1; const stripe = Math.floor(lu * 8) % 2 === 0;
      const n = 0.9 + 0.1 * vnoise(u * 300, v * 300, 5) - 0.06 * fbmTile(u, v, 3, 6, 3);
      const base = stripe ? c : [236, 230, 216];
      return [base[0] * n, base[1] * n, base[2] * n];
    }, { anisotropy: this.aniso });
    const nra = nraFromHeight(1024, (u, v) => (Math.sin(u * 1024 * 0.8) * Math.sin(v * 1024 * 0.8)) * 0.002 + fbmTile(u, v, 9, 4, 3) * 0.02, { strength: 24, rough: () => 0.9, anisotropy: this.aniso });
    const m = this.M.patch(new THREE.MeshStandardMaterial({ map, normalMap: nra, roughness: 1, metalness: 0, side: THREE.DoubleSide, vertexColors: true }), {
      key: 'fabric', nra: true, uniforms: { uWind: this.env.uniforms.uWind },
      vertexPars: 'attribute float aWind; uniform vec4 uWind;\n#ifndef USE_INSTANCING\nattribute vec3 aBase;\n#endif',
      vertexMain: /* glsl */`{
        #ifdef USE_INSTANCING
          vec3 ip = instanceMatrix[3].xyz;
        #else
          vec3 ip = vec3(aBase.x, 0.0, aBase.z);
        #endif
        float ph = dot(ip.xz, vec2(0.61, 0.33));
        float wv = sin(uTime * 5.2 + ph + position.x * 3.1 + position.y * 1.4) * 0.5 + sin(uTime * 8.3 + ph * 2.0 + position.x * 5.7) * 0.25;
        transformed += normal * wv * aWind * 0.11 * uWind.w;
      }`,
    });
    m.name = 'fabric'; this.cache.set('fabric', m); return m;
  }

  _signs() {
    const map = this.M.canvasTexture(1024, (ctx, s) => {
      const T = s / 4; ctx.fillStyle = '#d8d8d2'; ctx.fillRect(0, 0, s, s);
      const tile = (i, j, f) => { ctx.save(); ctx.translate(i * T, j * T); ctx.beginPath(); ctx.rect(0, 0, T, T); ctx.clip(); f(); ctx.restore(); };
      // row 0: chevron boards (yellow / black, red / white)
      for (const [i, a, b] of [[0, '#e8b90c', '#141414'], [1, '#c32a22', '#f2efe8']]) tile(i, 0, () => { ctx.fillStyle = a; ctx.fillRect(0, 0, T, T); ctx.fillStyle = b; for (let k = -1; k < 3; k++) { ctx.beginPath(); const x = k * T * 0.5; ctx.moveTo(x, 0); ctx.lineTo(x + T * 0.25, 0); ctx.lineTo(x + T * 0.5, T * 0.5); ctx.lineTo(x + T * 0.25, T); ctx.lineTo(x, T); ctx.lineTo(x + T * 0.25, T * 0.5); ctx.closePath(); ctx.fill(); } });
      // round signs: red ring, blue with arrow
      tile(2, 0, () => { ctx.fillStyle = '#f4f2ec'; ctx.beginPath(); ctx.arc(T / 2, T / 2, T * 0.47, 0, 6.3); ctx.fill(); ctx.lineWidth = T * 0.11; ctx.strokeStyle = '#c3231c'; ctx.beginPath(); ctx.arc(T / 2, T / 2, T * 0.4, 0, 6.3); ctx.stroke(); ctx.fillStyle = '#151515'; ctx.font = `700 ${T * 0.42}px Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('60', T / 2, T * 0.53); });
      tile(3, 0, () => { ctx.fillStyle = '#1c55a8'; ctx.beginPath(); ctx.arc(T / 2, T / 2, T * 0.47, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#f4f2ec'; ctx.lineWidth = T * 0.09; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(T * 0.3, T * 0.62); ctx.lineTo(T * 0.6, T * 0.62); ctx.lineTo(T * 0.6, T * 0.32); ctx.stroke(); ctx.beginPath(); ctx.moveTo(T * 0.47, T * 0.44); ctx.lineTo(T * 0.6, T * 0.28); ctx.lineTo(T * 0.73, T * 0.44); ctx.stroke(); });
      // row 1: warning triangles (bend left / right), direction boards
      for (const [i, flip] of [[0, 1], [1, -1]]) tile(i, 1, () => { ctx.fillStyle = '#c3231c'; ctx.beginPath(); ctx.moveTo(T / 2, T * 0.05); ctx.lineTo(T * 0.97, T * 0.92); ctx.lineTo(T * 0.03, T * 0.92); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#f4f2ec'; ctx.beginPath(); ctx.moveTo(T / 2, T * 0.24); ctx.lineTo(T * 0.8, T * 0.82); ctx.lineTo(T * 0.2, T * 0.82); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#151515'; ctx.lineWidth = T * 0.055; ctx.beginPath(); ctx.moveTo(T * 0.5 - flip * T * 0.08, T * 0.78); ctx.quadraticCurveTo(T * 0.5 - flip * T * 0.08, T * 0.56, T * 0.5 + flip * T * 0.1, T * 0.46); ctx.stroke(); });
      const board = (i, j, bg, txt, arrow) => tile(i, j, () => { ctx.fillStyle = bg; ctx.fillRect(0, T * 0.2, T, T * 0.6); ctx.strokeStyle = '#f4f2ec'; ctx.lineWidth = T * 0.03; ctx.strokeRect(T * 0.03, T * 0.23, T * 0.94, T * 0.54); ctx.fillStyle = '#f4f2ec'; ctx.font = `700 ${T * 0.2}px Bahnschrift, "Arial Narrow", Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, T * 0.5, T * 0.45); ctx.font = `700 ${T * 0.2}px Arial`; ctx.fillText(arrow, T * 0.5, T * 0.66); });
      board(2, 1, '#7a4a23', 'MIRANTE', '→'); board(3, 1, '#7a4a23', 'VILA', '↑');
      board(0, 2, '#1c55a8', 'PRAIA', '←'); board(1, 2, '#7a4a23', 'FAROL', '→'); board(2, 2, '#20603a', 'BOSQUE', '↑'); board(3, 2, '#1c55a8', 'PORTO', '←');
      // row 3: plain painted boards (shop names without any real brand)
      const shop = (i, bg, fg, txt) => tile(i, 3, () => { ctx.fillStyle = bg; ctx.fillRect(0, T * 0.25, T, T * 0.5); ctx.fillStyle = fg; ctx.font = `italic 700 ${T * 0.19}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, T * 0.5, T * 0.5); });
      shop(0, '#efe7d2', '#7a2a20', 'Padaria'); shop(1, '#1f3d5c', '#f0e6c8', 'Café do Sol'); shop(2, '#2f5a3c', '#f3ecd6', 'Mercearia'); shop(3, '#7a2a20', '#f3ecd6', 'Bar da Praia');
    }, { repeat: false });
    const nra = nraFromHeight(1024, (u, v) => fbmTile(u, v, 4, 16, 3) * 0.01, { strength: 20, rough: () => 0.55 });
    const m = this.M.patch(new THREE.MeshStandardMaterial({ map, normalMap: nra, roughness: 1, metalness: 0.1, side: THREE.DoubleSide }), { key: 'signs', nra: true });
    m.name = 'signs'; this.cache.set('signs', m); return m;
  }
  _emissive(key, color, emissive, intensity) {
    const m = this.M.patch(new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness: 0.25, metalness: 0 }), { key: 'emissive' });
    m.name = key; m.userData.emissive = true; this.cache.set(key, m); return m;
  }
  _glass() {
    // window panes: dark, glossy, reflect the sky (no transparency needed: rooms are dark)
    const m = this.M.patch(new THREE.MeshStandardMaterial({ color: 0x1a2630, roughness: 0.08, metalness: 0.0, envMapIntensity: 1.6 }), { key: 'wglass' });
    m.name = 'windowglass'; m.userData.glass = true; this.cache.set('windowglass', m); return m;
  }
  _rubber() {
    // neutral light rubber with a tread pattern: stacks are tinted per instance (black, white or red paint)
    const map = colorFromFunc(1024, (u, v) => { const n = fbmTile(u, v, 7, 8, 4); const groove = Math.abs(((u * 28) % 1) - 0.5) < 0.1 ? 0.72 : 1; const k = (168 + 60 * n) * groove; return [k, k, k]; }, { anisotropy: this.aniso });
    const nra = nraFromHeight(1024, (u, v) => (Math.abs(((u * 28) % 1) - 0.5) < 0.1 ? -0.012 : 0) + fbmTile(u, v, 5, 12, 3) * 0.006, { strength: 30, rough: () => 0.86 });
    const m = this.M.patch(new THREE.MeshStandardMaterial({ map, normalMap: nra, roughness: 1, metalness: 0, vertexColors: true }), { nra: true });
    m.name = 'rubber'; this.cache.set('rubber', m); return m;
  }
  _galv() {
    // galvanised steel (guard rails, trusses): bright, slightly mottled, satin
    const map = colorFromFunc(1024, (u, v) => { const n = fbmTile(u, v, 3, 24, 3), q = fbmTile(u, v, 9, 4, 3); const k = 158 + 46 * n + 26 * (q - 0.5); return [k, k * 1.01, k * 1.03]; }, { anisotropy: this.aniso });
    const nra = nraFromHeight(1024, (u, v) => fbmTile(u, v, 5, 32, 3) * 0.012, { strength: 18, rough: (u, v) => 0.4 + 0.28 * fbmTile(u, v, 7, 6, 3), anisotropy: this.aniso });
    const m = this.M.patch(new THREE.MeshStandardMaterial({ map, normalMap: nra, roughness: 1, metalness: 0.88, vertexColors: true }), { nra: true });
    m.name = 'galv'; this.cache.set('galv', m); return m;
  }
  _banner() {
    // start / finish banner: chequered ends, circuit name (an invented place, no real brand)
    // drawn in a 2048 x 256 layout stretched to 2048 x 1024: the cloth is 17 m long and 1 m high
    const map = this.M.canvasTexture(2048, (ctx, w, hh) => {
      const h = 256; ctx.scale(1, hh / h);
      ctx.fillStyle = '#12233f'; ctx.fillRect(0, 0, w, h);
      const q = h / 4; for (const x0 of [0, w - q * 6]) for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) { ctx.fillStyle = (i + j) % 2 ? '#f2efe6' : '#0b0b0c'; ctx.fillRect(x0 + i * q, j * q, q, q); }
      ctx.fillStyle = '#e8862a'; ctx.fillRect(q * 6, h - 18, w - q * 12, 18); ctx.fillRect(q * 6, 0, w - q * 12, 18);
      ctx.fillStyle = '#f4f0e4'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.round(h * 0.5)}px Bahnschrift, "Arial Narrow", Arial, sans-serif`;
      ctx.fillText('CIRCUITO  COSTA  DOURADA', w / 2, h * 0.52);
    }, { height: 1024, repeat: false });
    const m = this.M.patch(new THREE.MeshStandardMaterial({ map, roughness: 0.6, metalness: 0, side: THREE.DoubleSide }), {});
    m.name = 'banner'; this.cache.set('banner', m); return m;
  }
}

/** faceted-but-soft rock: displaced icosphere, normals half way between flat and smooth */
export function buildRockGeometry(seed, detail) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position; const v = new THREE.Vector3();
  const h3 = (x, y, z, s) => { const q = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + s * 4.1) * 43758.5453; return q - Math.floor(q); };
  const n3 = (x, y, z, s) => { const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z); const fx = x - xi, fy = y - yi, fz = z - zi; const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), sz = fz * fz * (3 - 2 * fz); let r = 0; for (let k = 0; k < 8; k++) { const a = k & 1, b = (k >> 1) & 1, c = (k >> 2) & 1; r += h3(xi + a, yi + b, zi + c, s) * (a ? sx : 1 - sx) * (b ? sy : 1 - sy) * (c ? sz : 1 - sz); } return r; };
  const sq = [0.72 + h3(seed, 1, 2, 3) * 0.3, 0.55 + h3(seed, 4, 5, 6) * 0.25, 0.8 + h3(seed, 7, 8, 9) * 0.3];
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    let d = 1 + 0.42 * (n3(v.x * 1.6 + seed, v.y * 1.6, v.z * 1.6, seed) - 0.5) + 0.2 * (n3(v.x * 3.7, v.y * 3.7 + seed, v.z * 3.7, seed + 3) - 0.5);
    // chiselled planes: snap part of the surface to a few cutting planes
    for (let k = 0; k < 9; k++) { const ax = h3(seed, k, 1, 1) * 2 - 1, ay = h3(seed, k, 2, 1) * 1.3 - 0.3, az = h3(seed, k, 3, 1) * 2 - 1; const l = Math.hypot(ax, ay, az); const dot = (v.x * ax + v.y * ay + v.z * az) / l; if (dot > 0.5) d = Math.min(d, (0.66 + 0.26 * h3(seed, k, 4, 1)) / dot); }
    p.setXYZ(i, v.x * d * sq[0], v.y * d * sq[1], v.z * d * sq[2]);
  }
  g.computeVertexNormals();           // flat (the polyhedron is not indexed)
  const flat = g.attributes.normal.array.slice();
  // smooth normals by averaging over coincident vertices, then blend
  const map = new Map(); const nrm = g.attributes.normal;
  for (let i = 0; i < p.count; i++) { const key = `${Math.round(p.getX(i) * 1e3)},${Math.round(p.getY(i) * 1e3)},${Math.round(p.getZ(i) * 1e3)}`; const e = map.get(key) || map.set(key, [0, 0, 0]).get(key); e[0] += flat[i * 3]; e[1] += flat[i * 3 + 1]; e[2] += flat[i * 3 + 2]; }
  for (let i = 0; i < p.count; i++) { const e = map.get(`${Math.round(p.getX(i) * 1e3)},${Math.round(p.getY(i) * 1e3)},${Math.round(p.getZ(i) * 1e3)}`); const l = Math.hypot(e[0], e[1], e[2]) || 1; v.set(flat[i * 3] * 0.72 + e[0] / l * 0.28, flat[i * 3 + 1] * 0.72 + e[1] / l * 0.28, flat[i * 3 + 2] * 0.72 + e[2] / l * 0.28).normalize(); nrm.setXYZ(i, v.x, v.y, v.z); }
  g.setIndex([...Array(p.count).keys()]);
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}
