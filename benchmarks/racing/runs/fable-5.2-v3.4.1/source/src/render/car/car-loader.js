// Loads the baked car bodies (assets/cars/<id>.bin, produced by scripts/cars/bake.mjs from the
// implicit car designs of scripts/cars/designs.mjs).

import * as THREE from 'three';

const cache = new Map();

export function loadCarMesh(id) {
  if (cache.has(id)) return cache.get(id);
  const p = (async () => {
    const res = await fetch(`assets/cars/${id}.bin`);
    if (!res.ok) throw new Error(`car mesh ${id}: HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const dv = new DataView(buf);
    const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
    if (magic !== 'CARM') throw new Error('bad car mesh file');
    const jsonLen = dv.getUint32(8, true);
    const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 12, jsonLen)));
    const base = 12 + jsonLen;
    const lods = header.lods.map((lod) => {
      const groups = {};
      for (const g of lod.groups) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buf, base + g.pos, g.vertices * 3), 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(buf, base + g.nor, g.vertices * 4), 4, true));
        geo.setIndex(new THREE.BufferAttribute(new Uint32Array(buf, base + g.idx, g.triangles * 3), 1));
        geo.computeBoundingSphere(); geo.computeBoundingBox();
        geo.userData.triangles = g.triangles;
        groups[g.name] = geo;
      }
      return { cell: lod.cell, triangles: lod.triangles, groups };
    });
    return { id, design: header.design, lods };
  })();
  cache.set(id, p);
  return p;
}
