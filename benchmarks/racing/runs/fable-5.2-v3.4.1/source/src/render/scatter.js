// Every repeated object of the scenery (plants, rocks, props, tyre stacks) goes through here.
// The world is cut into cells; inside a cell, objects are drawn in one of two ways:
//   - instanced: one InstancedMesh per (prototype, level of detail, part). Used for heavy models
//     with few shapes (trees up close, rocks, tyre stacks);
//   - merged: the instances of many small prototypes are baked into one static mesh per material
//     and distance band (grass, shrubs, props, distant trees). A cell then costs a handful of draw
//     calls instead of one per prototype, and is culled against every camera (view, shadow
//     cascades) as a whole.
// The visible band / level of detail of a cell depends on its distance to the camera and on the
// quality preset.

import * as THREE from 'three';
import { LAYER_DETAIL } from './probe.js';
import { proxyMesh, mergeForShadow } from './shadow-proxy.js';

const CELL = 48;

/**
 * Merged groups. Each band: distance range (m), cell size (m), whether it casts shadows. Bands with
 * `far` use the far side of their (bigger) cell for the lower limit, so that no object falls into
 * a gap between two grids; the price is a short overlap where both bands are drawn.
 */
// `overview`: the band shown in the inspection map (seen from far above, where the flat far level of a tree is edge-on)
export const MERGE_GROUPS = {
  ground: { q: 'grass', detail: true, bands: [{ r: [0, 42], cell: 48 }, { r: [42, 100], cell: 48 }] },
  pebble: { q: 'grass', detail: true, bands: [{ r: [0, 75], cell: 48 }] },
  shrub: { q: 'vegDistance', detail: true, overview: 1, bands: [{ r: [0, 55], cell: 48, cast: true }, { r: [55, 135], cell: 48, cast: true }, { r: [135, 300], cell: 144, far: true }] },
  prop: { q: 'propDistance', detail: true, bands: [{ r: [0, 120], cell: 48, cast: true }, { r: [120, 650], cell: 144, far: true }] },
  tree: { q: 'vegDistance', detail: false, overview: 0, bands: [{ r: [60, 220], cell: 96, cast: true, far: true }, { r: [220, 640], cell: 240, far: true }] },
  rock: { q: 'propDistance', detail: false, bands: [{ r: [150, 1500], cell: 240, far: true }] },
};
export const TREE_NEAR = 60;    // trees are instanced up to here and merged beyond
const SHADOW_CELL = 96, SHADOW_RANGE = 560;   // shadow proxies: cell size, distance up to which they exist in the shadow pass

export class Scatter {
  constructor() {
    this.group = new THREE.Group(); this.group.name = 'scatter';
    this.protos = new Map();
    this.cells = new Map();
    this.stats = { instances: 0, meshes: 0, mergedVertices: 0, mergedMeshes: 0, instancedMeshes: 0, shadowProxies: 0, shadowVertices: 0 };
  }

  /**
   * @param proto {lods:[{parts:[{geometry, material, castShadow?}], max?:number, merge?:string, band?:number}], category, detail?, shadowMax?}
   *   a level with `merge` is baked into band `band` of that merge group; the others are instanced up to `max` metres
   */
  addPrototype(name, proto) { proto.name = name; proto.instances = []; this.protos.set(name, proto); return proto; }
  has(name) { return this.protos.has(name); }

  /** @param m THREE.Matrix4 world matrix; color optional THREE.Color (multiplies the material colour) */
  add(name, m, color = null) {
    const proto = this.protos.get(name); if (!proto) throw new Error('unknown scatter prototype ' + name);
    proto.instances.push({ m: m.clone(), color });
  }

  _cell(x, z, size = CELL) {
    const ix = Math.floor(x / size), iz = Math.floor(z / size); const key = size + ':' + ix + ',' + iz;
    let c = this.cells.get(key);
    if (!c) { c = { cx: (ix + 0.5) * size, cz: (iz + 0.5) * size, half: size * 0.72, tiers: [], jobs: new Map() }; this.cells.set(key, c); }
    return c;
  }

  build() {
    const tmp = new THREE.Vector3();
    const qKey = (cat) => (cat === 'prop' || cat === 'rock' ? 'propDistance' : cat === 'ground' ? 'grass' : 'vegDistance');
    for (const proto of this.protos.values()) {
      if (!proto.instances.length) continue;
      const byCell = new Map();
      for (const inst of proto.instances) { tmp.setFromMatrixPosition(inst.m); const c = this._cell(tmp.x, tmp.z); (byCell.get(c) || byCell.set(c, []).get(c)).push(inst); }
      this.stats.instances += proto.instances.length;
      // shadow casters: the instances of this prototype join the proxy of their (coarser) cell
      const sl = proto.category === 'ground' ? null : (proto.shadowLod !== undefined ? proto.lods[proto.shadowLod] : (proto.lods[1] || proto.lods[0]));
      if (sl) for (const inst of proto.instances) {
        tmp.setFromMatrixPosition(inst.m); const sc = this._cell(tmp.x, tmp.z, SHADOW_CELL);
        for (const part of sl.parts) {
          if (part.castShadow === false) continue;
          const cut = part.material.alphaTest > 0 && part.material.map; const k = cut ? 'a' + part.material.map.uuid : 'o';
          const e = sc.shadow || (sc.shadow = new Map()); (e.get(k) || e.set(k, { map: cut ? part.material.map : null, src: [] }).get(k)).src.push({ position: part.geometry.attributes.position.array, uv: cut ? part.geometry.attributes.uv.array : null, index: part.geometry.index ? part.geometry.index.array : null, matrix: inst.m });
        }
      }
      for (const [cell, list] of byCell) {
        let min = 0;
        proto.lods.forEach((lod, li) => {
          if (!lod) return;
          if (lod.merge) {
            // queued: baked once every prototype has been distributed (merged bands have their own grid)
            const band = lod.band || 0; const size = MERGE_GROUPS[lod.merge].bands[band].cell; const jk = lod.merge + '|' + band;
            for (const inst of list) {
              tmp.setFromMatrixPosition(inst.m); const mc = this._cell(tmp.x, tmp.z, size);
              const jobs = mc.jobs.get(jk) || mc.jobs.set(jk, []).get(jk);
              for (const part of lod.parts) jobs.push({ part, inst });
            }
            return;
          }
          const meshes = [];
          for (const part of lod.parts) {
            const im = new THREE.InstancedMesh(part.geometry, part.material, list.length);
            for (let i = 0; i < list.length; i++) { im.setMatrixAt(i, list[i].m); if (list[i].color) im.setColorAt(i, list[i].color); }
            im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
            im.computeBoundingSphere(); im.computeBoundingBox();
            im.castShadow = false; im.receiveShadow = part.receiveShadow !== false;
            im.matrixAutoUpdate = false; im.name = `${proto.name}_lod${li}`; im.updateMatrixWorld(true);
            im.userData.kind = proto.category; im.userData.proto = proto.name; im.userData.castWanted = im.castShadow;
            if (proto.detail) im.layers.set(LAYER_DETAIL);
            meshes.push(im); this.stats.meshes++; this.stats.instancedMeshes++;
          }
          cell.tiers.push({ min, max: lod.max, q: qKey(proto.category), meshes, visible: false });
          min = lod.max;
        });
      }
    }
    // ---- merged bands
    for (const cell of this.cells.values()) {
      for (const [jk, jobs] of cell.jobs) {
        const [gname, bandStr] = jk.split('|'); const g = MERGE_GROUPS[gname], band = +bandStr; const bd = g.bands[band]; const range = bd.r;
        const byMat = new Map();
        for (const j of jobs) { const cast = !!bd.cast && j.part.castShadow !== false; const k = j.part.material.uuid + (cast ? '|c' : '|n'); const e = byMat.get(k) || byMat.set(k, { material: j.part.material, cast, jobs: [] }).get(k); e.jobs.push(j); }
        const meshes = [];
        for (const e of byMat.values()) {
          const mesh = new THREE.Mesh(bake(e.jobs), e.material);
          mesh.castShadow = false; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false; mesh.updateMatrixWorld(true);
          mesh.name = `merged_${gname}${band}`; mesh.userData.kind = gname === 'tree' ? 'tree' : gname; mesh.userData.merged = true; mesh.userData.castWanted = e.cast;
          if (g.detail) mesh.layers.set(LAYER_DETAIL);
          meshes.push(mesh); this.stats.meshes++; this.stats.mergedMeshes++; this.stats.mergedVertices += mesh.geometry.attributes.position.count;
        }
        cell.tiers.push({ min: range[0], max: range[1], q: g.q, meshes, visible: false, far: !!bd.far, overview: band === (g.overview ?? g.bands.length - 1) && (!!bd.far || g.overview !== undefined) });
      }
      cell.jobs = null;
      if (cell.shadow) {
        const meshes = [];
        for (const e of cell.shadow.values()) { const mesh = proxyMesh(mergeForShadow(e.src, !!e.map), e.map); mesh.updateMatrixWorld(true); meshes.push(mesh); this.stats.shadowProxies++; this.stats.shadowVertices += mesh.geometry.attributes.position.count; }
        cell.tiers.push({ min: 0, max: SHADOW_RANGE, q: null, meshes, visible: false });
        cell.shadow = null;
      }
    }
    this.cellList = [...this.cells.values()];
    return this.group;
  }

  /**
   * Shows the right band / level of detail of every cell. A quarter of the cells is looked at per frame (the bands
   * overlap by far more than the camera travels in four frames); all of them at once when the camera jumps, the
   * preset changes or the overview is switched.
   */
  update(camera, quality) {
    const px = camera.position.x, pz = camera.position.z; const list = this.cellList, n = list.length; const overview = !!this.overview;
    const all = this._px === undefined || Math.abs(px - this._px) + Math.abs(pz - this._pz) > 12 || overview !== this._ov || quality !== this._q;
    this._px = px; this._pz = pz; this._ov = overview; this._q = quality;
    const phase = this._phase = ((this._phase | 0) + 1) & 3; const group = this.group;
    for (let i = all ? 0 : phase; i < n; i += all ? 1 : 4) {
      const c = list[i]; const dx = px - c.cx, dz = pz - c.cz; const dc = Math.sqrt(dx * dx + dz * dz); const d = dc > c.half ? dc - c.half : 0, df = dc + c.half;
      const tiers = c.tiers;
      for (let j = 0; j < tiers.length; j++) {
        // overview (inspection map from far above): the coarsest level of everything, whatever the distance
        const t = tiers[j]; const k = t.q ? quality[t.q] : 1; const vis = overview ? !!t.overview : (t.far ? df : d) >= t.min * k && d < t.max * k;
        if (vis !== t.visible) { t.visible = vis; const ms = t.meshes; for (let q = 0; q < ms.length; q++) { if (vis) group.add(ms[q]); else group.remove(ms[q]); } }
      }
    }
  }
}

/**
 * Bakes instances into one static geometry (world space). Attributes: position, normal (bytes),
 * uv, color (geometry colour x instance tint), aWind (0 where the source has none) and aBase
 * (instance origin x, height above the instance base, origin z) which the wind shaders use in
 * place of the instance matrix.
 */
function bake(jobs) {
  let nv = 0, ni = 0;
  for (const j of jobs) { const g = j.part.geometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const pos = new Float32Array(nv * 3), nor = new Int8Array(nv * 3), uv = new Float32Array(nv * 2), col = new Uint16Array(nv * 3), wind = new Uint8Array(nv), base = new Uint16Array(nv * 3);
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  const H = THREE.DataUtils.toHalfFloat; const one = H(1);
  let vo = 0, io = 0;
  for (const j of jobs) {
    const g = j.part.geometry; const e = j.inst.m.elements; const c = j.inst.color;
    const P = g.attributes.position.array, N = g.attributes.normal.array, U = g.attributes.uv ? g.attributes.uv.array : null, C = g.attributes.color ? g.attributes.color.array : null, W = g.attributes.aWind ? g.attributes.aWind.array : null;
    const n = g.attributes.position.count; const cr = c ? c.r : 1, cg = c ? c.g : 1, cb = c ? c.b : 1;
    const hx = H(e[12]), hz = H(e[14]);
    for (let i = 0; i < n; i++) {
      const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; const o = (vo + i) * 3;
      pos[o] = e[0] * x + e[4] * y + e[8] * z + e[12]; pos[o + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]; pos[o + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
      const a = N[i * 3], b = N[i * 3 + 1], d = N[i * 3 + 2];
      let nx = e[0] * a + e[4] * b + e[8] * d, ny = e[1] * a + e[5] * b + e[9] * d, nz = e[2] * a + e[6] * b + e[10] * d; const l = 127 / (Math.hypot(nx, ny, nz) || 1);
      nor[o] = Math.round(nx * l); nor[o + 1] = Math.round(ny * l); nor[o + 2] = Math.round(nz * l);
      if (U) { uv[(vo + i) * 2] = U[i * 2]; uv[(vo + i) * 2 + 1] = U[i * 2 + 1]; }
      if (C) { col[o] = H(C[i * 3] * cr); col[o + 1] = H(C[i * 3 + 1] * cg); col[o + 2] = H(C[i * 3 + 2] * cb); } else if (c) { col[o] = H(cr); col[o + 1] = H(cg); col[o + 2] = H(cb); } else { col[o] = one; col[o + 1] = one; col[o + 2] = one; }
      if (W) wind[vo + i] = Math.max(0, Math.min(255, Math.round(W[i] * 255)));
      base[o] = hx; base[o + 1] = H(y); base[o + 2] = hz;
    }
    if (g.index) { const I = g.index.array; for (let i = 0; i < I.length; i++) idx[io + i] = I[i] + vo; io += I.length; } else { for (let i = 0; i < n; i++) idx[io + i] = vo + i; io += n; }
    vo += n;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3, true));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const ca = new THREE.BufferAttribute(col, 3); ca.gpuType = THREE.FloatType; ca.isFloat16BufferAttribute = true; out.setAttribute('color', ca);
  out.setAttribute('aWind', new THREE.BufferAttribute(wind, 1, true));
  const ba = new THREE.BufferAttribute(base, 3); ba.isFloat16BufferAttribute = true; out.setAttribute('aBase', ba);
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere(); out.computeBoundingBox();
  return out;
}

export const SCATTER_CELL = CELL;
