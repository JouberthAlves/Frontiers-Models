// Builds the vertex/index arrays of the road, its side strips (kerbs, aprons) and edge
// skirts directly from the track rows. Pure data (no three.js) so that the validator can
// compare this mesh with the physics query Track.surfaceAt() in Node as well as in the browser.

import { STRIP_COLS, KERB_W } from './track.js';

class MeshData {
  constructor() { this.pos = []; this.uv = []; this.aux = []; this.idx = []; }
  vert(x, y, z, u, v, a = 0, b = 0) {
    this.pos.push(x, y, z); this.uv.push(u, v); this.aux.push(a, b);
    return this.pos.length / 3 - 1;
  }
  quad(a, b, c, d) { this.idx.push(a, b, c, b, d, c); } // a=(i,c) b=(i,c+1) c=(i+1,c) d=(i+1,c+1)
  finish() {
    const pos = new Float32Array(this.pos), idx = new Uint32Array(this.idx);
    const nor = new Float32Array(pos.length);
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const q of [a, b, c]) { nor[q] += nx; nor[q + 1] += ny; nor[q + 2] += nz; }
    }
    for (let i = 0; i < nor.length; i += 3) {
      const l = Math.hypot(nor[i], nor[i + 1], nor[i + 2]) || 1; nor[i] /= l; nor[i + 1] /= l; nor[i + 2] /= l;
    }
    return { positions: pos, normals: nor, uvs: new Float32Array(this.uv), aux: new Float32Array(this.aux), indices: idx, triangles: idx.length / 3 };
  }
}

/**
 * @param {import('./track.js').Track} track
 * @returns road / kerb / concrete / paving / skirt mesh data. uv = (lateral metres, lap metres).
 * aux of the road = (side-normalised lateral position -1..1, zone index).
 */
export function buildRoadGeometry(track) {
  const sp = track.spline; const n = sp.n; const ds = sp.ds;
  const road = new MeshData(), kerb = new MeshData(), concrete = new MeshData(), paving = new MeshData(), skirt = new MeshData();
  const prof = [new Float32Array(10), new Float32Array(10)];
  const rowRoad = new Int32Array((n + 1) * 2);
  // --- carriageway: one quad per metre, edge to edge (exactly the surface the physics queries)
  for (let r = 0; r <= n; r++) {
    const i = r % n; const v = r * ds;
    const hw = sp.half[i];
    for (let c = 0; c < 2; c++) {
      const d = c === 0 ? -hw : hw;
      rowRoad[r * 2 + c] = road.vert(sp.x[i] + sp.rx[i] * d, sp.y[i] + sp.cs[i] * d, sp.z[i] + sp.rz[i] * d, d, v, c === 0 ? -1 : 1, track.zone[i]);
    }
    if (r > 0) road.quad(rowRoad[(r - 1) * 2], rowRoad[(r - 1) * 2 + 1], rowRoad[r * 2], rowRoad[r * 2 + 1]);
  }
  // --- side strips: kerb / apron profile, plus a skirt that buries the outer edge into the ground
  for (let k = 0; k < 2; k++) {
    const sg = k === 0 ? -1 : 1;
    let prev = null;
    for (let r = 0; r <= n; r++) {
      const i = r % n; const v = r * ds; const hw = sp.half[i];
      const ext = track.ext[k][i];
      const p = track.stripProfile(k, i, prof[0]);
      const isKerb = track.kerb[k][i] === 1 || (track.apronW[k][i] === 0 && ext > 0);
      const mat = track.apronMat[k][i];
      const cur = { ext, isKerb, mat, pts: [], bridge: track.bridge[i] === 1 };
      for (let c = 0; c < STRIP_COLS; c++) {
        const dist = p[c * 2], dy = p[c * 2 + 1]; const d = sg * (hw + dist);
        cur.pts.push([sp.x[i] + sp.rx[i] * d, sp.y[i] + sp.cs[i] * d + dy, sp.z[i] + sp.rz[i] * d, dist, v]);
      }
      if (prev && (prev.ext > 1e-3 || cur.ext > 1e-3)) {
        for (let c = 0; c < STRIP_COLS - 1; c++) {
          const a0 = prev.pts[c], a1 = prev.pts[c + 1], b0 = cur.pts[c], b1 = cur.pts[c + 1];
          if (Math.abs(a1[3] - a0[3]) < 1e-4 && Math.abs(b1[3] - b0[3]) < 1e-4) continue; // collapsed column
          // columns 0..3 span the first KERB_W metres
          const kerbCol = c < 3 && (prev.isKerb || cur.isKerb);
          const m = kerbCol ? kerb : ((prev.mat || cur.mat) === 2 ? paving : concrete);
          const va0 = m.vert(a0[0], a0[1], a0[2], a0[3], a0[4], k, 0), va1 = m.vert(a1[0], a1[1], a1[2], a1[3], a1[4], k, 0);
          const vb0 = m.vert(b0[0], b0[1], b0[2], b0[3], b0[4], k, 0), vb1 = m.vert(b1[0], b1[1], b1[2], b1[3], b1[4], k, 0);
          if (k === 1) m.quad(va0, va1, vb0, vb1); else m.quad(va1, va0, vb1, vb0);
        }
      }
      // skirt from the outermost point (not on the bridge: the deck has its own sides)
      const o = cur.pts[STRIP_COLS - 1];
      cur.sk = cur.bridge ? null : [o, [o[0] + sp.rx[i] * sg * 0.32, o[1] - 0.42, o[2] + sp.rz[i] * sg * 0.32, 0.6, v]];
      if (prev && prev.sk && cur.sk) {
        const a0 = prev.sk[0], a1 = prev.sk[1], b0 = cur.sk[0], b1 = cur.sk[1];
        const va0 = skirt.vert(a0[0], a0[1], a0[2], 0, a0[4], k, 0), va1 = skirt.vert(a1[0], a1[1], a1[2], 0.6, a1[4], k, 0);
        const vb0 = skirt.vert(b0[0], b0[1], b0[2], 0, b0[4], k, 0), vb1 = skirt.vert(b1[0], b1[1], b1[2], 0.6, b1[4], k, 0);
        if (k === 1) skirt.quad(va0, va1, vb0, vb1); else skirt.quad(va1, va0, vb1, vb0);
      }
      prev = cur;
    }
  }
  return { road: road.finish(), kerb: kerb.finish(), concrete: concrete.finish(), paving: paving.finish(), skirt: skirt.finish() };
}

/** height of a mesh (from buildRoadGeometry) under (x,z) by testing triangles near row i; null if not covered */
export function meshHeightAt(mesh, x, z, triStart, triEnd) {
  const p = mesh.positions, idx = mesh.indices;
  for (let t = triStart; t < triEnd; t++) {
    const a = idx[t * 3] * 3, b = idx[t * 3 + 1] * 3, c = idx[t * 3 + 2] * 3;
    const x0 = p[a], z0 = p[a + 2], x1 = p[b], z1 = p[b + 2], x2 = p[c], z2 = p[c + 2];
    const det = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2);
    if (Math.abs(det) < 1e-12) continue;
    const l0 = ((z1 - z2) * (x - x2) + (x2 - x1) * (z - z2)) / det;
    const l1 = ((z2 - z0) * (x - x2) + (x0 - x2) * (z - z2)) / det;
    const l2 = 1 - l0 - l1;
    if (l0 >= -1e-6 && l1 >= -1e-6 && l2 >= -1e-6) return l0 * p[a + 1] + l1 * p[b + 1] + l2 * p[c + 1];
  }
  return null;
}
