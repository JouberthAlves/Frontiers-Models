// Shadow casters. Sun shadows are rendered in a pass of their own (Gfx.renderShadows) that only
// sees objects on LAYER_SHADOW. Most of the scenery does not cast with its visible meshes (one
// draw per material, per object, per cascade would cost far too many draw calls); instead each
// cell / barrier piece / building block / car carries one merged, position-only "proxy" mesh that
// lives on LAYER_SHADOW and is never drawn by the view camera. Leaf cards keep their cut-out
// silhouette: proxies of alpha-tested materials carry UVs and the leaf atlas.

import * as THREE from 'three';
import { LAYER_SHADOW } from './gfx.js';

let opaque = null; const cutout = new Map();

export function proxyMaterial(map = null, alphaTest = 0.42) {
  if (!map) { if (!opaque) { opaque = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); opaque.name = 'shadow_proxy'; } return opaque; }
  let m = cutout.get(map.uuid);
  if (!m) { m = new THREE.MeshBasicMaterial({ map, alphaTest, side: THREE.DoubleSide }); m.name = 'shadow_proxy_cutout'; cutout.set(map.uuid, m); }
  return m;
}

/** mesh that exists only in the shadow pass */
export function proxyMesh(geometry, map = null) {
  const m = new THREE.Mesh(geometry, proxyMaterial(map));
  m.layers.set(LAYER_SHADOW); m.castShadow = true; m.receiveShadow = false; m.matrixAutoUpdate = false;
  m.name = 'shadow_proxy'; m.userData.kind = 'shadowproxy'; m.userData.noAudit = true;
  return m;
}

/** lets a visible mesh cast shadows with its own geometry (few, simple objects only) */
export function castsShadow(mesh) { mesh.castShadow = true; mesh.layers.enable(LAYER_SHADOW); return mesh; }

/**
 * Merges position (and optionally uv) data into one geometry.
 * @param sources [{position: array-like xyz, uv?: array-like, index?: array-like, matrix?: THREE.Matrix4}]
 */
export function mergeForShadow(sources, withUV = false) {
  let nv = 0, ni = 0;
  for (const s of sources) { const n = s.position.length / 3; nv += n; ni += s.index ? s.index.length : n; }
  const pos = new Float32Array(nv * 3), uv = withUV ? new Float32Array(nv * 2) : null, idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  let vo = 0, io = 0;
  for (const s of sources) {
    const P = s.position, n = P.length / 3, e = s.matrix ? s.matrix.elements : null;
    if (e) for (let i = 0; i < n; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2], o = (vo + i) * 3; pos[o] = e[0] * x + e[4] * y + e[8] * z + e[12]; pos[o + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]; pos[o + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]; }
    else pos.set(P, vo * 3);
    if (uv && s.uv) uv.set(s.uv, vo * 2);
    if (s.index) { const I = s.index; for (let i = 0; i < I.length; i++) idx[io + i] = I[i] + vo; io += I.length; } else { for (let i = 0; i < n; i++) idx[io + i] = vo + i; io += n; }
    vo += n;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (uv) g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}

/** source record of a BufferGeometry */
export function sourceOf(geometry, matrix = null) {
  return { position: geometry.attributes.position.array, uv: geometry.attributes.uv ? geometry.attributes.uv.array : null, index: geometry.index ? geometry.index.array : null, matrix };
}
