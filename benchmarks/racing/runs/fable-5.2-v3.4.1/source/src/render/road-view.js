// Road surface meshes built from world/road-geometry.js (the same rows the physics queries).
// The asphalt material layers, on top of a 2K PBR set: patches of older asphalt, macro tone
// variation, worn dusty edges, rubber on the racing line (heavier in braking zones), painted
// edge / centre lines, the start line and the grid boxes.

import * as THREE from 'three';
import { inject } from './materials.js';
import { nraFromHeight, colorFromFunc, vnoise, fbmTile } from './proctex.js';

const ROAD_PARS_V = /* glsl */`
attribute vec4 aRoad;
varying vec4 vRoad; varying vec2 vRoadUv;
`;
const ROAD_PARS_F = /* glsl */`
varying vec4 vRoad; varying vec2 vRoadUv;
uniform sampler2D tAsphalt2; uniform sampler2D tNoise;
uniform float uLapLength; uniform vec2 uGrid[6]; uniform float uSandDrift;
float roadPaint; float roadRubber; float roadWear;
`;
const ROAD_MAP = /* glsl */`
#include <map_fragment>
{
  float u = vRoadUv.x, s = vRoadUv.y; float halfW = vRoad.y;
  vec2 wuv = vWPos.xz;
  vec3 nzA = texture2D(tNoise, wuv * 0.0061).rgb;
  vec3 nzB = texture2D(tNoise, wuv * 0.047 + 0.3).rgb;
  vec3 nzC = texture2D(tNoise, vec2(u * 0.31, s * 0.013)).rgb;   // streaks stretched along the road
  // patches of an older, lighter surface
  vec3 a2 = texture2D(tAsphalt2, vMapUv * 0.83 + 0.21).rgb;
  float patchW = smoothstep(0.5, 0.58, nzA.r * 0.7 + nzB.g * 0.3);
  diffuseColor.rgb = mix(diffuseColor.rgb, a2 * 0.74, patchW * 0.7);
  diffuseColor.rgb *= 0.9 + (nzA.g - 0.5) * 0.34 + (nzB.b - 0.5) * 0.14;
  // worn, dusty edges; sand blown over the edge next to the beach
  float edge = smoothstep(halfW - 2.4, halfW - 0.1, abs(u) + (nzB.r - 0.5) * 1.1);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.2 + vec3(0.04, 0.034, 0.024), edge * 0.62);
  float beachSide = vRoad.z < 0.5 ? smoothstep(halfW - 1.9, halfW + 0.1, -u + (nzB.g - 0.5) * 1.6) : 0.0;
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.62, 0.53, 0.38), beachSide * 0.5 * uSandDrift);
  // rubber laid on the racing line, two tyre tracks, heavier where the cars brake
  float dl = u - vRoad.x;
  float rub = exp(-dl * dl / 3.4) * (0.28 + 0.72 * vRoad.w) * (0.5 + 0.5 * nzC.r);
  float tracks = exp(-pow(abs(dl) - 0.8, 2.0) / 0.1);
  rub = clamp(rub * (0.7 + 0.6 * tracks), 0.0, 1.0);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.4, rub * 0.8);
  // paint
  float aa = fwidth(u) * 1.1 + 0.003;
  float paint = 1.0 - smoothstep(0.075 - aa, 0.075 + aa, abs(abs(u) - (halfW - 0.34)));
  float sLine = min(s, uLapLength - s);
  float startArea = 1.0 - smoothstep(60.0, 75.0, min(s, (uLapLength - s) * 0.92));
  float aas = fwidth(s) * 1.1 + 0.003;
  float dashPos = fract(s / 12.0) * 12.0;
  float dash = smoothstep(0.0, aas, dashPos) * (1.0 - smoothstep(3.0, 3.0 + aas, dashPos));
  paint = max(paint, (1.0 - smoothstep(0.065 - aa, 0.065 + aa, abs(u))) * dash * (1.0 - startArea));
  // start / finish: chequered band
  float inBand = (1.0 - smoothstep(0.6, 0.6 + aas, sLine)) * (1.0 - smoothstep(halfW - 0.55, halfW - 0.5, abs(u)));
  float chk = mod(floor(u / 0.4) + floor((s + 0.6) / 0.4), 2.0);
  // grid boxes: a bar in front of each car and two short side marks
  float grid = 0.0;
  for (int i = 0; i < 6; i++) {
    float ds = s - uGrid[i].x; float du = u - uGrid[i].y;
    float bar = (1.0 - smoothstep(0.08, 0.08 + aas, abs(ds - 2.55))) * (1.0 - smoothstep(1.25, 1.25 + aa, abs(du)));
    float side = (1.0 - smoothstep(0.07, 0.07 + aa, abs(abs(du) - 1.25))) * smoothstep(1.2, 1.2 + aas, ds) * (1.0 - smoothstep(2.55, 2.55 + aas, ds));
    grid = max(grid, max(bar, side));
  }
  paint = max(paint, grid);
  float wear = smoothstep(0.2, 0.62, nzB.r * 0.6 + nzC.g * 0.55);
  paint *= mix(0.5, 1.0, wear) * (1.0 - rub * 0.55);
  vec3 paintCol = vec3(0.8, 0.78, 0.72);
  diffuseColor.rgb = mix(diffuseColor.rgb, paintCol, paint);
  diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.06), paintCol, chk), inBand * 0.92);
  roadPaint = max(paint, inBand * chk); roadRubber = rub; roadWear = edge;
}
`;

export function makeKerbTextures(aniso) {
  const size = 1024;
  // v (along the lap): two blocks, red then white. u: across the kerb.
  const map = colorFromFunc(size, (u, v) => {
    const red = v < 0.5;
    const n = fbmTile(u, v, 5, 6, 4), g = vnoise(u * 90, v * 90, 3);
    const joint = Math.min(Math.abs(v - 0.5), Math.min(v, 1 - v)) < 0.004 ? 0.55 : 1;
    const dirt = 0.72 + 0.34 * n - (u < 0.2 ? (0.2 - u) * 1.3 : 0) * (0.5 + 0.5 * g);
    const scuff = Math.max(0, vnoise(u * 5, v * 60, 9) - 0.62) * 1.6;
    const base = red ? [176, 32, 28] : [226, 222, 212];
    const k = Math.max(0.25, dirt) * joint * (1 - scuff * 0.55);
    return [base[0] * k, base[1] * k, base[2] * k];
  }, { anisotropy: aniso });
  const nra = nraFromHeight(size, (u, v) => {
    // serrated ribs across the kerb, flat joints between the blocks
    const rib = Math.abs(((v * 32) % 1) - 0.5) * 2;
    return rib * 0.012 + fbmTile(u, v, 7, 24, 3) * 0.004;
  }, { strength: 60, rough: (u, v) => 0.62 + 0.25 * fbmTile(u, v, 11, 8, 3), anisotropy: aniso });
  return { map, nra };
}

export class RoadView {
  constructor(world, materials, env, noiseTex) {
    this.world = world; this.materials = materials; this.env = env; this.noise = noiseTex;
    this.group = new THREE.Group(); this.group.name = 'road';
  }

  static textureSets() { return [['asphalt_02', '2k'], ['asphalt_04', '2k'], ['brushed_concrete', '1k'], ['stone_pavers', '1k']]; }

  _geometry(md, extra) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(md.positions, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(md.normals, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(md.uvs, 2));
    if (extra) for (const k of Object.keys(extra)) g.setAttribute(k, extra[k]);
    g.setIndex(new THREE.BufferAttribute(md.indices, 1));
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }

  build() {
    const world = this.world, track = world.track, sp = track.spline, M = this.materials;
    const geo = world.roadGeo; const n = sp.n;
    const aniso = Math.min(this.materials.gfx.quality.anisotropy * 2, this.materials.gfx.maxAniso);
    // ---- carriageway: per-vertex racing line offset, half width, zone, braking intensity
    const line = world.line, prof = world.profiles.gt;
    const aRoad = new Float32Array((n + 1) * 2 * 4);
    for (let r = 0; r <= n; r++) {
      const i = r % n;
      let brake = 0;
      for (let k = 2; k <= 26; k += 4) brake = Math.max(brake, (prof.v[i] - prof.v[(i + k) % n]) / (k * 0.45));
      brake = Math.max(0, Math.min(1, brake + Math.min(1, Math.abs(line.kappa[i]) * 22) * 0.55));
      for (let c = 0; c < 2; c++) { const o = (r * 2 + c) * 4; aRoad[o] = line.off[i]; aRoad[o + 1] = sp.half[i]; aRoad[o + 2] = track.zone[i]; aRoad[o + 3] = brake; }
    }
    const asphalt = M.set('asphalt_02', '2k'), asphalt2 = M.set('asphalt_04', '2k');
    asphalt.map.anisotropy = aniso; asphalt.nra.anisotropy = aniso;
    const map = M.tiled(asphalt.map, 1 / 4.5), nra = M.tiled(asphalt.nra, 1 / 4.5);
    const a2 = M.tiled(asphalt2.map, 1); a2.anisotropy = aniso;
    const grid = track.gridSlots.map((g) => new THREE.Vector2(g.s, g.d));
    const roadMat = new THREE.MeshStandardMaterial({ map, normalMap: nra, roughness: 0.92, metalness: 0, normalScale: new THREE.Vector2(0.9, 0.9) });
    M.patch(roadMat, {
      key: 'road', nra: true,
      uniforms: { tAsphalt2: { value: a2 }, tNoise: { value: this.noise }, uLapLength: { value: sp.length }, uGrid: { value: grid }, uSandDrift: { value: 1 } },
      vertexPars: ROAD_PARS_V, vertexMain: 'vRoad = aRoad; vRoadUv = uv;', fragmentPars: ROAD_PARS_F,
      hooks: [(shader) => {
        let fs = shader.fragmentShader;
        fs = inject(fs, '#include <map_fragment>', ROAD_MAP);
        // paint is smoother, rubber is glossier, worn edges are rougher
        fs = inject(fs, 'float roughnessFactor = roughness * nraTex.b;', 'float roughnessFactor = roughness * nraTex.b;\n{ float gz = 1.0 - abs(normalize(cameraPosition - vWPos).y); gz *= gz * gz; roughnessFactor = mix(roughnessFactor, min(roughnessFactor, 0.4), 0.8 * gz * gz); }\nroughnessFactor = mix(roughnessFactor, 0.52, roadPaint * 0.8);\nroughnessFactor = mix(roughnessFactor, roughnessFactor * 0.7, roadRubber);\nroughnessFactor = mix(roughnessFactor, min(1.0, roughnessFactor * 1.12), roadWear);');
        shader.fragmentShader = fs;
      }],
    });
    roadMat.name = 'asphalt';
    const road = new THREE.Mesh(this._geometry(geo.road, { aRoad: new THREE.BufferAttribute(aRoad, 4) }), roadMat);
    road.name = 'road'; road.receiveShadow = true; road.matrixAutoUpdate = false; road.userData.kind = 'road';
    this.group.add(road); this.road = road; this.roadMaterial = roadMat;

    // ---- kerbs
    const kt = makeKerbTextures(aniso);
    kt.map.repeat.set(1 / 1.3, 1 / 4); kt.nra.repeat.set(1 / 1.3, 1 / 4);
    const kerbMat = M.patch(new THREE.MeshStandardMaterial({ map: kt.map, normalMap: kt.nra, roughness: 1, metalness: 0 }), { key: 'kerb', nra: true });
    kerbMat.name = 'kerb';
    if (geo.kerb.triangles > 0) { const m = new THREE.Mesh(this._geometry(geo.kerb), kerbMat); m.name = 'kerbs'; m.receiveShadow = true; m.matrixAutoUpdate = false; m.userData.kind = 'kerb'; this.group.add(m); }
    // ---- concrete strips, paved sidewalks, edge skirts
    const concMat = M.std({ set: 'brushed_concrete', repeat: 1 / 2.6, color: 0xb9b3a8 }); concMat.name = 'apron_concrete';
    const paveMat = M.std({ set: 'stone_pavers', repeat: 1 / 2.2, color: 0xd9cfc0 }); paveMat.name = 'sidewalk_paving';
    const skirtMat = M.std({ set: 'brushed_concrete', repeat: 1 / 2.0, color: 0x6f675c }); skirtMat.name = 'road_skirt';
    for (const [md, mat, name] of [[geo.concrete, concMat, 'aprons_concrete'], [geo.paving, paveMat, 'sidewalks'], [geo.skirt, skirtMat, 'road_skirt']]) {
      if (md.triangles === 0) continue;
      const m = new THREE.Mesh(this._geometry(md), mat); m.name = name; m.receiveShadow = true; m.matrixAutoUpdate = false; m.userData.kind = 'road';
      this.group.add(m);
    }
    return this.group;
  }
}
