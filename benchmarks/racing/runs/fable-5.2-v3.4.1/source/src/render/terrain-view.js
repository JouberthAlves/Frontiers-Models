// Visible terrain: the height field of world/terrain.js cut into chunks with three levels of
// detail, plus a coarse outer ring for the distant land. One material blends seven PBR layers
// (dry ground, green ground, sand, rock, forest floor, paving, gravel) from the control masks that
// the world generator derived from the track, with macro variation and distance-dependent tiling.

import * as THREE from 'three';
import { inject } from './materials.js';

const CHUNK = 64; // cells per chunk side

export const TERRAIN_LAYERS = [
  { id: 'grass_path_2', scale: 5.5 },       // 0 dry ground with tufts
  { id: 'rocky_terrain_02', scale: 7.0 },   // 1 green ground
  { id: 'sand_01', scale: 4.2 },            // 2 beach sand
  { id: 'rock_face_03', scale: 9.0 },       // 3 rock (triplanar on steep faces)
  { id: 'forrest_ground_01', scale: 5.0 },  // 4 forest floor
  { id: 'rectangular_paving', scale: 3.0 }, // 5 paved ground (promenade, village yards)
  { id: 'gravel_ground_01', scale: 3.4 },   // 6 gravel verge
];

const FRAG_PARS = /* glsl */`
uniform sampler2D tMaskA; uniform sampler2D tMaskB; uniform sampler2D tNoise;
uniform mediump sampler2DArray tLayA; uniform mediump sampler2DArray tLayN;   // one array per map type: the D3D11 back end allows 16 samplers
uniform float uLayScale[7];
uniform float uSeaLevel;
varying vec3 vWNormal;
vec3 terrainNormalW;
float terrainRough; float terrainAO;
void layer(int i, vec2 uv, vec2 dx, vec2 dy, float w, float far, inout vec3 alb, inout vec3 nrm, inout float rough, inout float ao) {
  // textureGrad keeps mip selection valid inside the weight branches
  float s = uLayScale[i]; float li = float(i);
  vec2 u1 = uv / s, d1x = dx / s, d1y = dy / s;
  vec4 a = textureGrad(tLayA, vec3(u1, li), d1x, d1y); vec4 n = textureGrad(tLayN, vec3(u1, li), d1x, d1y);
  if (far > 0.01) {
    vec2 u2 = u1 * 0.23 + 0.31;
    a = mix(a, textureGrad(tLayA, vec3(u2, li), d1x * 0.23, d1y * 0.23), far * 0.75);
    n = mix(n, textureGrad(tLayN, vec3(u2, li), d1x * 0.23, d1y * 0.23), far * 0.75);
  }
  alb += a.rgb * w; nrm += vec3(n.xy * 2.0 - 1.0, 0.0) * w; rough += n.b * w; ao += n.a * w;
}
`;

const FRAG_MAP = /* glsl */`
{
  vec2 wuv = vWPos.xz;
  vec2 muv = (wuv - uTerrainRect.xy) * uTerrainRect.zw;
  vec4 mA = texture2D(tMaskA, muv); vec4 mB = texture2D(tMaskB, muv);
  float camDist = length(vWPos - cameraPosition);
  vec3 nW = normalize(vWNormal);
  float slope = 1.0 - nW.y;
  vec3 nz1 = texture2D(tNoise, wuv * 0.0037).rgb;
  vec3 nz2 = texture2D(tNoise, wuv * 0.021 + 0.37).rgb;
  vec3 nz3 = texture2D(tNoise, wuv * 0.13 + 0.11).rgb;
  float dn = nz3.r - 0.5;
  // ---- layer weights (priority compositing: dry < green < forest < gravel < sand < rock < paved)
  float wGreen = smoothstep(0.4, 0.62, nz1.r * 0.65 + nz2.g * 0.35 + mB.g * 0.35);
  float wForest = smoothstep(0.3, 0.7, mA.b + (nz2.r - 0.5) * 0.45);
  float wGravel = smoothstep(0.35, 0.65, mB.r + dn * 0.3);
  float wSand = smoothstep(0.35, 0.65, mA.r + dn * 0.3);
  float wRock = max(smoothstep(0.4, 0.7, mA.g + dn * 0.4), smoothstep(0.3, 0.46, slope + dn * 0.1));
  float wPaved = smoothstep(0.42, 0.58, mA.a + dn * 0.06);
  float w0 = 1.0, w1 = wGreen, w2, w3, w4, w5, w6;
  w0 *= 1.0 - w1;
  w4 = wForest; w0 *= 1.0 - w4; w1 *= 1.0 - w4;
  w6 = wGravel; w0 *= 1.0 - w6; w1 *= 1.0 - w6; w4 *= 1.0 - w6;
  w2 = wSand; w0 *= 1.0 - w2; w1 *= 1.0 - w2; w4 *= 1.0 - w2; w6 *= 1.0 - w2;
  w3 = wRock; w0 *= 1.0 - w3; w1 *= 1.0 - w3; w4 *= 1.0 - w3; w6 *= 1.0 - w3; w2 *= 1.0 - w3;
  w5 = wPaved; w0 *= 1.0 - w5; w1 *= 1.0 - w5; w4 *= 1.0 - w5; w6 *= 1.0 - w5; w2 *= 1.0 - w5; w3 *= 1.0 - w5;
  vec2 dx = dFdx(wuv), dy = dFdy(wuv);
  float far = smoothstep(28.0, 95.0, camDist);
  vec3 alb = vec3(0.0), nrm = vec3(0.0); float rough = 0.0, ao = 0.0;
  if (w0 > 0.004) layer(0, wuv, dx, dy, w0, far, alb, nrm, rough, ao);
  if (w1 > 0.004) layer(1, wuv, dx, dy, w1, far, alb, nrm, rough, ao);
  if (w2 > 0.004) layer(2, wuv, dx, dy, w2, far, alb, nrm, rough, ao);
  if (w4 > 0.004) layer(4, wuv, dx, dy, w4, far, alb, nrm, rough, ao);
  if (w5 > 0.004) layer(5, wuv, dx, dy, w5, 0.0, alb, nrm, rough, ao);
  if (w6 > 0.004) layer(6, wuv, dx, dy, w6, far, alb, nrm, rough, ao);
  // tangent frame of the top projection (u = +x, v = +z)
  vec3 T = normalize(vec3(1.0, 0.0, 0.0) - nW * nW.x);
  vec3 Bv = cross(T, nW);
  vec3 nAcc = T * nrm.x + Bv * nrm.y;
  if (w3 > 0.004) {
    // rock: project along the dominant axis so cliffs are not smeared
    vec3 an = abs(nW);
    vec2 ruv; vec3 rT; vec3 rB;
    if (an.y > 0.72) { ruv = wuv; rT = T; rB = Bv; }
    else if (an.x > an.z) { float sg = sign(nW.x); ruv = vec2(vWPos.z * sg, vWPos.y); rT = vec3(0.0, 0.0, sg); rB = vec3(0.0, 1.0, 0.0); }
    else { float sg = -sign(nW.z); ruv = vec2(vWPos.x * sg, vWPos.y); rT = vec3(sg, 0.0, 0.0); rB = vec3(0.0, 1.0, 0.0); }
    float rs = uLayScale[3];
    vec2 rdx = dFdx(ruv) / rs, rdy = dFdy(ruv) / rs;
    // guard the derivative jump where the projection axis switches
    rdx = clamp(rdx, -0.25, 0.25); rdy = clamp(rdy, -0.25, 0.25);
    vec4 ra = textureGrad(tLayA, vec3(ruv / rs, 3.0), rdx, rdy), rn = textureGrad(tLayN, vec3(ruv / rs, 3.0), rdx, rdy);
    if (far > 0.01) { ra = mix(ra, textureGrad(tLayA, vec3(ruv / rs * 0.27 + 0.4, 3.0), rdx * 0.27, rdy * 0.27), far * 0.7); rn = mix(rn, textureGrad(tLayN, vec3(ruv / rs * 0.27 + 0.4, 3.0), rdx * 0.27, rdy * 0.27), far * 0.7); }
    // warm, slightly brighter limestone tint
    alb += ra.rgb * vec3(1.12, 1.04, 0.94) * w3; rough += rn.b * w3; ao += rn.a * w3;
    vec2 rxy = rn.xy * 2.0 - 1.0;
    nAcc += (rT * rxy.x + rB * rxy.y) * w3 * 1.25;
  }
  // ---- macro variation: large patches of hue / brightness break the tiling
  float mv = (nz1.g - 0.5) * 0.36 + (nz2.b - 0.5) * 0.2;
  alb *= 1.0 + mv * (1.0 - w5 * 0.6);
  alb = mix(alb, alb * vec3(1.06, 0.98, 0.86), smoothstep(0.45, 0.75, nz1.b) * (w0 + w1) * 0.8);
  // green ground and forest floor are dry-summer coloured rather than lawn green
  alb = mix(alb, alb * vec3(1.12, 1.0, 0.72), (w1 * 0.55 + w4 * 0.35));
  // paving reads cooler / cleaner
  // ---- wet sand near the waterline: darker and glossy
  float wet = w2 * (1.0 - smoothstep(uSeaLevel + 0.1, uSeaLevel + 0.62 + nz2.r * 0.25, vWPos.y));
  alb *= mix(1.0, 0.52, wet);
  rough = mix(rough, 0.2, wet * 0.85);
  // under water the bed fades to the water colour (the sea surface adds the rest)
  float under = smoothstep(uSeaLevel, uSeaLevel - 2.5, vWPos.y);
  alb = mix(alb, alb * vec3(0.5, 0.75, 0.8), under);
  diffuseColor.rgb = alb;
  terrainNormalW = normalize(nW + nAcc * (0.9 - 0.5 * wet));
  terrainRough = clamp(rough, 0.08, 1.0);
  terrainAO = ao;
}
`;

function makeNoiseTexture(size = 256) {
  // tileable value noise, three independent channels, several octaves
  const data = new Uint8Array(size * size * 4);
  const rnd = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const sm = (t) => t * t * (3 - 2 * t);
  const oct = (x, y, p, s) => {
    const fx = x * p / size, fy = y * p / size; const x0 = Math.floor(fx), y0 = Math.floor(fy); const tx = sm(fx - x0), ty = sm(fy - y0);
    const a = rnd(x0 % p, y0 % p, s), b = rnd((x0 + 1) % p, y0 % p, s), c = rnd(x0 % p, (y0 + 1) % p, s), d = rnd((x0 + 1) % p, (y0 + 1) % p, s);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) for (let ch = 0; ch < 3; ch++) {
    let v = 0, amp = 0.5, tot = 0;
    for (let o = 0; o < 5; o++) { v += oct(x, y, 4 << o, ch * 17 + o) * amp; tot += amp; amp *= 0.5; }
    data[(y * size + x) * 4 + ch] = Math.max(0, Math.min(255, Math.round((v / tot - 0.5) * 1.7 * 255 + 127.5)));
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}

export class TerrainView {
  constructor(world, materials, env) {
    this.world = world; this.terrain = world.terrain; this.materials = materials; this.env = env;
    this.group = new THREE.Group(); this.group.name = 'terrain';
    this.chunks = [];
    this.noise = makeNoiseTexture(256);
  }

  static textureSets() { return TERRAIN_LAYERS.map((l) => l.id); }

  build() {
    const t = this.terrain; const M = this.materials;
    // ---- control masks
    const N = t.nx * t.nz;
    const a = new Uint8Array(N * 4), b = new Uint8Array(N * 4);
    for (let i = 0; i < N; i++) {
      a[i * 4] = t.mSand[i]; a[i * 4 + 1] = t.mRock[i]; a[i * 4 + 2] = t.mForest[i]; a[i * 4 + 3] = t.mPaved[i];
      b[i * 4] = t.mGravel[i]; b[i * 4 + 1] = t.mForest[i] > 60 ? 180 : 0; b[i * 4 + 2] = 0; b[i * 4 + 3] = 255;
    }
    const mk = (d) => { const tx = new THREE.DataTexture(d, t.nx, t.nz, THREE.RGBAFormat); tx.minFilter = tx.magFilter = THREE.LinearFilter; tx.wrapS = tx.wrapT = THREE.ClampToEdgeWrapping; tx.needsUpdate = true; return tx; };
    this.maskA = mk(a); this.maskB = mk(b);
    const sets = TERRAIN_LAYERS.map((l) => M.set(l.id));
    const uniforms = {
      tMaskA: { value: this.maskA }, tMaskB: { value: this.maskB }, tNoise: { value: this.noise },
      tLayA: { value: M.arrayTexture(sets.map((s) => s.map), true) }, tLayN: { value: M.arrayTexture(sets.map((s) => s.nra), false) },
      uLayScale: { value: TERRAIN_LAYERS.map((l) => l.scale) }, uSeaLevel: { value: t.seaLevel },
    };
    const mat = new THREE.MeshStandardMaterial({ map: sets[0].map, normalMap: sets[0].nra, roughness: 1, metalness: 0 });
    M.patch(mat, {
      key: 'terrain', uniforms,
      vertexPars: 'varying vec3 vWNormal;',
      vertexMain: 'vWNormal = normalize(mat3(modelMatrix) * normal);',
      fragmentPars: FRAG_PARS,
      hooks: [(shader) => {
        let fs = shader.fragmentShader;
        fs = inject(fs, '#include <map_fragment>', FRAG_MAP);
        fs = inject(fs, '#include <roughnessmap_fragment>', 'float roughnessFactor = terrainRough;');
        fs = inject(fs, '#include <normal_fragment_maps>', 'normal = normalize((viewMatrix * vec4(terrainNormalW, 0.0)).xyz);');
        fs = inject(fs, '#include <aomap_fragment>', 'reflectedLight.indirectDiffuse *= mix(1.0, terrainAO, 0.85);');
        shader.fragmentShader = fs;
      }],
    });
    mat.name = 'terrain'; mat.userData.layers = TERRAIN_LAYERS.map((l) => l.id);
    this.material = mat;
    // ---- chunks
    const cx = Math.ceil((t.nx - 1) / CHUNK), cz = Math.ceil((t.nz - 1) / CHUNK);
    for (let j = 0; j < cz; j++) for (let i = 0; i < cx; i++) {
      const ix0 = i * CHUNK, iz0 = j * CHUNK; const ix1 = Math.min(t.nx - 1, ix0 + CHUNK), iz1 = Math.min(t.nz - 1, iz0 + CHUNK);
      let maxH = -Infinity, minH = Infinity;
      for (let z = iz0; z <= iz1; z++) for (let x = ix0; x <= ix1; x++) { const h = t.h[z * t.nx + x]; if (h > maxH) maxH = h; if (h < minH) minH = h; }
      if (maxH < t.seaLevel - 5) continue; // deep sea bed is never seen
      const lods = [1, 2, 4].map((step) => this._chunkGeometry(ix0, iz0, ix1, iz1, step));
      const mesh = new THREE.Mesh(lods[0], mat);
      mesh.receiveShadow = true; mesh.castShadow = false; mesh.matrixAutoUpdate = false; mesh.name = `terrain_${i}_${j}`;
      mesh.userData.kind = 'terrain';
      const cxw = t.x0 + (ix0 + ix1) / 2 * t.cell, czw = t.z0 + (iz0 + iz1) / 2 * t.cell;
      this.chunks.push({ mesh, lods, cx: cxw, cz: czw, cy: (minH + maxH) / 2, r: Math.hypot((ix1 - ix0) * t.cell, (iz1 - iz0) * t.cell) / 2, lod: 0 });
      this.group.add(mesh);
    }
    this._buildFarRing(mat);
    return this.group;
  }

  _chunkGeometry(ix0, iz0, ix1, iz1, step) {
    const t = this.terrain; const cell = t.cell;
    const xs = []; for (let x = ix0; x < ix1; x += step) xs.push(x); xs.push(ix1);
    const zs = []; for (let z = iz0; z < iz1; z += step) zs.push(z); zs.push(iz1);
    const nx = xs.length, nz = zs.length;
    const skirt = step > 1 || true;
    const nv = nx * nz + (skirt ? 2 * (nx + nz) : 0);
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
    const H = (x, z) => t.h[Math.min(t.nz - 1, Math.max(0, z)) * t.nx + Math.min(t.nx - 1, Math.max(0, x))];
    let v = 0;
    const put = (x, z, drop) => {
      const wx = t.x0 + x * cell, wz = t.z0 + z * cell;
      pos[v * 3] = wx; pos[v * 3 + 1] = H(x, z) - drop; pos[v * 3 + 2] = wz;
      const hx = H(x + 1, z) - H(x - 1, z), hz = H(x, z + 1) - H(x, z - 1);
      const l = Math.hypot(hx, 2 * cell, hz);
      nor[v * 3] = -hx / l; nor[v * 3 + 1] = 2 * cell / l; nor[v * 3 + 2] = -hz / l;
      uv[v * 2] = wx; uv[v * 2 + 1] = wz;
      return v++;
    };
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) put(xs[i], zs[j], 0);
    const idx = [];
    for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      // split along the (0,0)-(1,1) diagonal: same triangles as Terrain.heightAt
      idx.push(a, c, d, a, d, b);
    }
    if (skirt) {
      const drop = 1.5 * step;
      const edge = (list, flip) => {
        const base = [];
        for (const [x, z, id] of list) base.push([id, put(x, z, drop)]);
        for (let k = 0; k < base.length - 1; k++) {
          const [a, a2] = base[k], [b, b2] = base[k + 1];
          if (flip) idx.push(a, a2, b, b, a2, b2); else idx.push(a, b, a2, b, b2, a2);
        }
      };
      edge(xs.map((x, i) => [x, zs[0], i]), false);
      edge(xs.map((x, i) => [x, zs[nz - 1], (nz - 1) * nx + i]), true);
      edge(zs.map((z, j) => [xs[0], z, j * nx]), true);
      edge(zs.map((z, j) => [xs[nx - 1], z, j * nx + nx - 1]), false);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(nv > 65535 ? new THREE.BufferAttribute(new Uint32Array(idx), 1) : new THREE.BufferAttribute(new Uint16Array(idx), 1));
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }

  /** distant land outside the height field: a coarse grid of the same landform function */
  _buildFarRing(mat) {
    const t = this.terrain; const step = 48; const R = 5200;
    const x0 = Math.floor((t.x0 - R) / step) * step, x1 = Math.ceil((t.x1 + R) / step) * step;
    const z0 = Math.floor((t.z0 - R) / step) * step, z1 = Math.ceil((t.z1 + 600) / step) * step;
    const nx = (x1 - x0) / step + 1, nz = (z1 - z0) / step + 1;
    const pos = [], nor = [], uv = [], idx = []; const map = new Int32Array(nx * nz).fill(-1);
    const inside = (x, z) => x > t.x0 + step && x < t.x1 - step && z > t.z0 + step && z < t.z1 - step;
    const hCache = new Float32Array(nx * nz);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + i * step, z = z0 + j * step;
      // the ring overlaps the height field by one step and sits a little lower there: no cracks, no z-fight
      hCache[j * nx + i] = t.naturalHeight(Math.max(t.x0 - 4000, x), z) - (x >= t.x0 && x <= t.x1 && z >= t.z0 && z <= t.z1 ? 2.5 : 0);
    }
    const hh = (i, j) => hCache[Math.min(nz - 1, Math.max(0, j)) * nx + Math.min(nx - 1, Math.max(0, i))];
    for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const xa = x0 + i * step, za = z0 + j * step;
      if (inside(xa, za) && inside(xa + step, za + step)) continue;
      if (Math.max(hh(i, j), hh(i + 1, j), hh(i, j + 1), hh(i + 1, j + 1)) < -3) continue;
      const vid = (ii, jj) => {
        const k = jj * nx + ii; if (map[k] >= 0) return map[k];
        const x = x0 + ii * step, z = z0 + jj * step;
        pos.push(x, hh(ii, jj), z);
        const hx = hh(ii + 1, jj) - hh(ii - 1, jj), hz = hh(ii, jj + 1) - hh(ii, jj - 1); const l = Math.hypot(hx, 2 * step, hz);
        nor.push(-hx / l, 2 * step / l, -hz / l); uv.push(x, z);
        return (map[k] = pos.length / 3 - 1);
      };
      const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1);
      idx.push(a, c, d, a, d, b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uv), 2));
    g.setIndex(idx);
    const mesh = new THREE.Mesh(g, mat); mesh.receiveShadow = false; mesh.matrixAutoUpdate = false; mesh.name = 'terrain_far';
    mesh.userData.kind = 'terrain';
    this.far = mesh; this.group.add(mesh);
  }

  /** picks the level of detail of every chunk from the camera distance */
  update(camera, quality) {
    const k = quality.terrainLod;
    const px = camera.position.x, pz = camera.position.z; const chunks = this.chunks;
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]; const dx = px - c.cx, dz = pz - c.cz; const d = Math.max(0, Math.sqrt(dx * dx + dz * dz) - c.r);
      const lod = d < 230 * k ? 0 : d < 620 * k ? 1 : 2;
      if (lod !== c.lod) { c.lod = lod; c.mesh.geometry = c.lods[lod]; }
    }
  }

  triangleCount() { let n = 0; for (const c of this.chunks) n += c.mesh.geometry.index.count / 3; return n; }
}
