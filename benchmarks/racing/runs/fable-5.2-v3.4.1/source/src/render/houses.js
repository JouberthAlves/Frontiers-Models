// Procedural architecture. A building is described by the world generator (footprint, floors,
// variation, colours, features) and modelled here for real: plastered or stone walls with
// recessed openings, frames, mullions, sills and surrounds, shutters, doors with steps, balconies
// with railings, awnings, flower boxes, wall lanterns, string courses, cornices, quoins, tile roofs
// with eaves, ridge caps and chimneys. Local frame: origin at the centre of the footprint on the
// ground, +x = street front, z along the street, y up.

import * as THREE from 'three';
import { Geo } from './geo.js';
import { mulberry32 } from '../core/rng.js';

const TAU = Math.PI * 2;
export const FLOOR_H = [3.2, 2.95, 2.85, 2.8];

export const WALL_PALETTE = [0xe9d9b6, 0xe2b98c, 0xd98f6c, 0xf1ead9, 0xc9d6dc, 0xe8c66e, 0xcfa07a, 0xdfd0c0, 0xb9c9b0, 0xe6a98f];
export const SHUTTER_PALETTE = [0x2f6b52, 0x2f5f8a, 0x7a4a2c, 0xf0ece2, 0x8a2f2a, 0x4a6a3a, 0x2a4f6a];

class Parts {
  constructor() { this.base = new Map(); this.detail = new Map(); }
  g(mat, detail = false) { const m = detail ? this.detail : this.base; let g = m.get(mat); if (!g) { g = new Geo(); m.set(mat, g); } return g; }
}
function col(g, hex, k = 1) { const c = new THREE.Color(hex); g.color(c.r * k, c.g * k, c.b * k); return g; }

/**
 * @param u unit description: {hx: half depth, hz: half width, floors, variant, wall: hex, trim: hex, shutter: hex, wallMat, roof: 'gable'|'hip'|'shed',
 *          roofMat, use: 'house'|'shop'|'public'|'kiosk'|'church', attachL, attachR (party walls), feat: {balcony, awning, flowerbox, chimney, lantern, quoins, sign, arch, stairs}, seed}
 * @returns Parts (geometry in the local frame)
 */
export function buildBuilding(u) {
  if (u.use === 'church') return buildChurch(u);
  const P = new Parts(); const rnd = mulberry32((u.seed || 1) >>> 0);
  const D = u.hx * 2, W = u.hz * 2; const floors = u.floors || 2;
  const heights = []; for (let f = 0; f < floors; f++) heights.push(FLOOR_H[Math.min(f, 3)] * (u.use === 'kiosk' ? 0.88 : 1));
  const Htop = heights.reduce((a, b) => a + b, 0);
  const wallMat = u.wallMat || 'plaster'; const wallCol = u.wall ?? 0xe9d9b6; const trimCol = u.trim ?? 0xf3ecdd; const shutCol = u.shutter ?? 0x2f6b52;
  const feat = u.feat || {};
  const RV = 0.17; // reveal depth of every opening

  // ---- one facade: outward normal n (unit, horizontal), origin at its bottom-left corner seen from outside
  const facade = (name, ox, oz, nx, nz, width, blank) => {
    const ux = nz === 0 ? 0 : (nz > 0 ? 1 : -1) * 1, uz = nx === 0 ? 0 : (nx > 0 ? -1 : 1) * 1; // u = up x n
    const pt = (uu, v, depth = 0) => [ox + ux * uu - nx * depth, v, oz + uz * uu - nz * depth];
    const wall = P.g(wallMat); col(wall, wallCol);
    // openings of this facade
    const ops = [];
    if (!blank) {
      let y0 = 0;
      for (let f = 0; f < floors; f++) {
        const fh = heights[f];
        const bays = name === 'front' ? Math.max(1, Math.round(width / (u.use === 'public' ? 3.4 : 3.0))) : name === 'back' ? Math.max(1, Math.round(width / 3.6)) : Math.max(1, Math.round(width / 4.4));
        const bw = width / bays;
        const doorBay = name === 'front' ? (u.doorBay ?? (bays > 2 ? Math.floor(rnd() * bays) : 0)) : -1;
        for (let b = 0; b < bays; b++) {
          const cu = (b + 0.5) * bw; let o = null;
          if (name === 'front' && f === 0) {
            if (u.use === 'kiosk') o = { kind: 'hatch', w: Math.min(2.6, bw * 0.78), h: 1.25, sill: 1.0 };
            else if (b === doorBay) o = { kind: 'door', w: u.use === 'public' ? 1.5 : 1.05, h: u.use === 'public' ? 2.7 : 2.2, sill: 0, arch: !!feat.arch || u.use === 'public' };
            else if (u.use === 'shop') o = { kind: 'shop', w: Math.min(2.5, bw * 0.8), h: 2.35, sill: 0.3 };
            else o = { kind: 'window', w: 0.95, h: 1.3, sill: 1.05, shutters: true, grille: rnd() < 0.3 };
          } else if (name === 'front') {
            const balc = feat.balcony && f === 1 && (bays < 3 || b === Math.floor(bays / 2) || rnd() < 0.35);
            if (balc) o = { kind: 'balcdoor', w: 1.05, h: 2.15, sill: 0.02, shutters: true, balcony: true };
            else o = { kind: 'window', w: u.use === 'public' ? 1.1 : 0.92, h: u.use === 'public' ? 1.6 : 1.28, sill: 0.95, shutters: u.use !== 'public', flowerbox: !!feat.flowerbox && rnd() < 0.6, arch: u.use === 'public' && f === 1 };
          } else if (name === 'back' || rnd() < 0.7) {
            if (f === 0 && name === 'back' && b === 0) o = { kind: 'door', w: 0.95, h: 2.1, sill: 0 };
            else o = { kind: 'window', w: 0.8, h: 1.15, sill: 1.05, shutters: rnd() < 0.5 };
          }
          if (o) { o.u0 = cu - o.w / 2; o.u1 = cu + o.w / 2; o.v0 = y0 + o.sill; o.v1 = o.v0 + o.h; o.floor = f; o.y0 = y0; ops.push(o); }
        }
        y0 += fh;
      }
    }
    // wall surface: grid cells around the rectangular parts of the openings
    const us = [0, width], vs = [0, Htop];
    for (const o of ops) { us.push(o.u0, o.u1); vs.push(o.v0, o.arch ? o.v1 - o.w / 2 : o.v1); if (o.arch) vs.push(o.v1); }
    const uq = [...new Set(us.map((x) => +x.toFixed(4)))].sort((a, b) => a - b), vq = [...new Set(vs.map((x) => +x.toFixed(4)))].sort((a, b) => a - b);
    const inOp = (cu, cv) => { for (const o of ops) if (cu > o.u0 && cu < o.u1 && cv > o.v0 && cv < o.v1) return o; return null; };
    for (let i = 0; i < uq.length - 1; i++) for (let j = 0; j < vq.length - 1; j++) {
      const cu = (uq[i] + uq[i + 1]) / 2, cv = (vq[j] + vq[j + 1]) / 2; const o = inOp(cu, cv);
      if (o && !(o.arch && cv > o.v1 - o.w / 2)) continue;
      if (o && o.arch) {
        // wall around a semicircular head: fan between the cell corners and the arc
        const r = o.w / 2, cy = o.v1 - r, cx = (o.u0 + o.u1) / 2; const N = 8; const base = wall.vertexCount;
        const add = (uu, v) => { const p = pt(uu, v); return wall.vert(p[0], p[1], p[2], nx, 0, nz, uu, v); };
        for (const sgn of [-1, 1]) {
          const corner = add(cx + sgn * r, o.v1); let prev = add(cx + sgn * r, cy);
          for (let k = 1; k <= N; k++) { const a = (k / N) * Math.PI / 2; const cur = add(cx + sgn * r * Math.cos(a), cy + r * Math.sin(a)); if (sgn > 0) wall.tri(corner, cur, prev); else wall.tri(corner, prev, cur); prev = cur; }
        }
        continue;
      }
      wall.quad(pt(uq[i], vq[j]), pt(uq[i + 1], vq[j]), pt(uq[i + 1], vq[j + 1]), pt(uq[i], vq[j + 1]), 1, [uq[i], vq[j]]);
    }
    // stone plinth and foundation skirt (goes below ground so that slopes never show a gap)
    const pl = P.g(u.use === 'kiosk' ? 'stoneblock' : 'rubble'); col(pl, 0xffffff, 0.92);
    const ph = u.plinth ?? 0.55;
    pl.quad(pt(0, -1.2, -0.03), pt(width, -1.2, -0.03), pt(width, ph, -0.03), pt(0, ph, -0.03), 1);
    pl.quad(pt(0, ph, -0.03), pt(width, ph, -0.03), pt(width, ph, 0), pt(0, ph, 0), 1);
    if (name !== 'front') { /* doors only cut the plinth on the front */ }
    // ---- openings
    for (const o of ops) opening(o, pt, nx, nz, ux, uz, name);
    // ---- horizontal bands: string courses between floors, cornice under the eaves
    if (!blank || name === 'front') {
      const band = P.g('plaster2'); col(band, trimCol);
      let y = 0; for (let f = 0; f < floors - 1; f++) { y += heights[f]; if (u.variant !== 1) boxOn(band, pt, 0, width, y - 0.07, y + 0.07, 0.045); }
      boxOn(band, pt, 0, width, Htop - 0.2, Htop, 0.09);
    }
    // corner stones
    if (feat.quoins && name === 'front') {
      const q = P.g('stoneblock'); col(q, 0xffffff);
      for (let y = ph; y < Htop - 0.4; y += 0.56) { const long = Math.round(y / 0.56) % 2 === 0; const w2 = long ? 0.52 : 0.32; boxOn(q, pt, 0, w2, y, y + 0.5, 0.03); boxOn(q, pt, width - w2, width, y, y + 0.5, 0.03); }
    }
    return { pt, ops };
  };

  // a slab lying on a facade: from u0..u1, v0..v1, standing proud of the wall by `out`
  const boxOn = (g, pt, u0, u1, v0, v1, out) => {
    g.quad(pt(u0, v0, -out), pt(u1, v0, -out), pt(u1, v1, -out), pt(u0, v1, -out), 1, [u0, v0]);
    g.quad(pt(u0, v1, -out), pt(u1, v1, -out), pt(u1, v1, 0), pt(u0, v1, 0), 1);
    g.quad(pt(u0, v0, 0), pt(u1, v0, 0), pt(u1, v0, -out), pt(u0, v0, -out), 1);
    g.quad(pt(u0, v0, 0), pt(u0, v0, -out), pt(u0, v1, -out), pt(u0, v1, 0), 1);
    g.quad(pt(u1, v0, -out), pt(u1, v0, 0), pt(u1, v1, 0), pt(u1, v1, -out), 1);
  };

  const opening = (o, pt, nx, nz, ux, uz, face) => {
    const wall = P.g(wallMat); col(wall, wallCol, 0.86);
    const r = o.arch ? o.w / 2 : 0; const vS = o.v1 - r; // spring line
    // reveals (jambs, sill, head)
    wall.quad(pt(o.u0, o.v0, RV), pt(o.u0, o.v0, 0), pt(o.u0, vS, 0), pt(o.u0, vS, RV), 1);
    wall.quad(pt(o.u1, o.v0, 0), pt(o.u1, o.v0, RV), pt(o.u1, vS, RV), pt(o.u1, vS, 0), 1);
    wall.quad(pt(o.u0, o.v0, 0), pt(o.u0, o.v0, RV), pt(o.u1, o.v0, RV), pt(o.u1, o.v0, 0), 1);
    const cx = (o.u0 + o.u1) / 2;
    if (!o.arch) wall.quad(pt(o.u0, o.v1, RV), pt(o.u0, o.v1, 0), pt(o.u1, o.v1, 0), pt(o.u1, o.v1, RV), 1);
    else for (let k = 0; k < 10; k++) { const a0 = k / 10 * Math.PI, a1 = (k + 1) / 10 * Math.PI; wall.quad(pt(cx + r * Math.cos(a1), vS + r * Math.sin(a1), 0), pt(cx + r * Math.cos(a0), vS + r * Math.sin(a0), 0), pt(cx + r * Math.cos(a0), vS + r * Math.sin(a0), RV), pt(cx + r * Math.cos(a1), vS + r * Math.sin(a1), RV), 1); }
    const isDoor = o.kind === 'door';
    // ---- infill at the back of the reveal
    if (isDoor) {
      const d = P.g('door'); col(d, u.doorColor ?? 0xffffff);
      d.quad(pt(o.u0, o.v0, RV), pt(o.u1, o.v0, RV), pt(o.u1, vS, RV), pt(o.u0, vS, RV), 1);
      const fr = P.g('wood', true); col(fr, 0x5a3d26);
      // planks relief: a few raised panels and the frame
      boxOn(fr, (a, b, c = 0) => pt(a, b, RV + c), o.u0 + 0.12, cx - 0.04, o.v0 + 0.2, o.v0 + 0.95, 0.025);
      boxOn(fr, (a, b, c = 0) => pt(a, b, RV + c), cx + 0.04, o.u1 - 0.12, o.v0 + 0.2, o.v0 + 0.95, 0.025);
      boxOn(fr, (a, b, c = 0) => pt(a, b, RV + c), o.u0 + 0.12, cx - 0.04, o.v0 + 1.1, vS - 0.15, 0.025);
      boxOn(fr, (a, b, c = 0) => pt(a, b, RV + c), cx + 0.04, o.u1 - 0.12, o.v0 + 1.1, vS - 0.15, 0.025);
      const iron = P.g('iron', true); boxOn(iron, (a, b, c = 0) => pt(a, b, RV + c), cx + 0.08, cx + 0.12, o.v0 + 0.98, o.v0 + 1.1, 0.05);
      if (o.arch) { // fanlight
        const gl = P.g('windowglass'); const base = gl.vertexCount; const c0 = pt(cx, vS, RV); gl.vert(c0[0], c0[1], c0[2], nx, 0, nz, 0.5, 0);
        for (let k = 0; k <= 10; k++) { const a = k / 10 * Math.PI; const p = pt(cx + r * Math.cos(a), vS + r * Math.sin(a), RV); gl.vert(p[0], p[1], p[2], nx, 0, nz, 0.5 + 0.5 * Math.cos(a), Math.sin(a)); }
        for (let k = 0; k < 10; k++) gl.tri(base, base + k + 2, base + k + 1);
        col(fr, trimCol); for (let k = 1; k < 5; k++) { const a = k / 5 * Math.PI; const p0 = pt(cx, vS, RV - 0.02), p1 = pt(cx + r * Math.cos(a), vS + r * Math.sin(a), RV - 0.02); fr.tube([p0, p1], 0.018, 4, 1, false); }
        boxOn(fr, (a, b, c = 0) => pt(a, b, RV + c), o.u0, o.u1, vS - 0.04, vS + 0.04, 0.04);
      }
      // door step
      const st = P.g('stoneblock'); col(st, 0xffffff); boxOn(st, pt, o.u0 - 0.2, o.u1 + 0.2, -0.3, 0.14, 0.42);
    } else {
      const gl = P.g(o.kind !== 'hatch' && rnd() < (o.kind === 'shop' ? 0.55 : o.floor > 0 ? 0.24 : 0.12) ? 'windowlit' : 'windowglass');     // some rooms have their lights on
      gl.quad(pt(o.u0, o.v0, RV), pt(o.u1, o.v0, RV), pt(o.u1, vS, RV), pt(o.u0, vS, RV), 1);
      if (o.arch) { const base = gl.vertexCount; const c0 = pt(cx, vS, RV); gl.vert(c0[0], c0[1], c0[2], nx, 0, nz, 0.5, 0); for (let k = 0; k <= 10; k++) { const a = k / 10 * Math.PI; const p = pt(cx + r * Math.cos(a), vS + r * Math.sin(a), RV); gl.vert(p[0], p[1], p[2], nx, 0, nz, 0.5 + 0.5 * Math.cos(a), Math.sin(a)); } for (let k = 0; k < 10; k++) gl.tri(base, base + k + 2, base + k + 1); }
      // frame and glazing bars
      const fr = P.g('wood', true); col(fr, o.kind === 'shop' ? 0x3a3a3a : trimCol);
      const q = (a, b, c = 0) => pt(a, b, RV + c); const t = 0.05;
      boxOn(fr, q, o.u0, o.u0 + t, o.v0, vS, 0.03); boxOn(fr, q, o.u1 - t, o.u1, o.v0, vS, 0.03); boxOn(fr, q, o.u0, o.u1, o.v0, o.v0 + t, 0.03); if (!o.arch) boxOn(fr, q, o.u0, o.u1, o.v1 - t, o.v1, 0.03);
      if (o.kind === 'shop') { boxOn(fr, q, cx - 0.5, cx - 0.46, o.v0, o.v1, 0.03); boxOn(fr, q, o.u0, o.u1, o.v1 - 0.5, o.v1 - 0.46, 0.03); }
      else if (o.kind !== 'hatch') { boxOn(fr, q, cx - 0.02, cx + 0.02, o.v0, vS, 0.03); const nb = o.h > 1.8 ? 3 : 2; for (let k = 1; k < nb; k++) boxOn(fr, q, o.u0, o.u1, o.v0 + (vS - o.v0) * k / nb - 0.015, o.v0 + (vS - o.v0) * k / nb + 0.015, 0.03); }
      if (o.kind === 'hatch') { // serving hatch: wooden counter and a flap propped open
        const wd = P.g('wood'); col(wd, 0xffffff); boxOn(wd, pt, o.u0 - 0.15, o.u1 + 0.15, o.v0 - 0.07, o.v0, 0.38);
      }
    }
    // ---- surround, sill
    if (wallMat !== 'rubble' || u.use === 'public') {
      const sr = P.g('plaster2'); col(sr, trimCol); const m = 0.11;
      boxOn(sr, pt, o.u0 - m, o.u0, o.v0, vS, 0.035); boxOn(sr, pt, o.u1, o.u1 + m, o.v0, vS, 0.035);
      if (!o.arch) boxOn(sr, pt, o.u0 - m, o.u1 + m, o.v1, o.v1 + m, 0.035);
      else for (let k = 0; k < 10; k++) { const a0 = k / 10 * Math.PI, a1 = (k + 1) / 10 * Math.PI; const ro = r + m; sr.quad(pt(cx + r * Math.cos(a0), vS + r * Math.sin(a0), -0.035), pt(cx + ro * Math.cos(a0), vS + ro * Math.sin(a0), -0.035), pt(cx + ro * Math.cos(a1), vS + ro * Math.sin(a1), -0.035), pt(cx + r * Math.cos(a1), vS + r * Math.sin(a1), -0.035), 1); }
    } else {
      // stone houses: timber lintel
      const wd = P.g('wood'); col(wd, 0x6b4a30); boxOn(wd, pt, o.u0 - 0.18, o.u1 + 0.18, o.v1, o.v1 + 0.17, 0.03);
    }
    if (o.kind === 'window' || o.kind === 'hatch') { const sl = P.g('stoneblock'); col(sl, 0xffffff); boxOn(sl, pt, o.u0 - 0.1, o.u1 + 0.1, o.v0 - 0.07, o.v0, 0.09); }
    // ---- shutters, folded open against the wall
    if (o.shutters) {
      const sh = P.g('woodgrey'); col(sh, shutCol); const sw = o.w / 2; const ang = 0.12 + rnd() * 0.2;
      for (const sgn of [-1, 1]) {
        const hingeU = sgn < 0 ? o.u0 : o.u1; const ca = Math.cos(ang), sa = Math.sin(ang);
        const a = pt(hingeU, o.v0, -0.02), b = pt(hingeU + sgn * sw * ca, o.v0, -0.02 - sw * sa);
        const a2 = [a[0], o.v1, a[2]], b2 = [b[0], o.v1, b[2]];
        if (sgn < 0) { sh.quad(b, a, a2, b2, 1); sh.quad(a, b, b2, a2, 1); } else { sh.quad(a, b, b2, a2, 1); sh.quad(b, a, a2, b2, 1); }
        // louvre battens (detail)
        const dt = P.g('woodgrey', true); col(dt, shutCol, 0.8);
        for (const yy of [o.v0 + 0.08, (o.v0 + o.v1) / 2, o.v1 - 0.08]) dt.tube([[a[0] - nx * -0.012, yy, a[2] - nz * -0.012], [b[0] - nx * -0.012, yy, b[2] - nz * -0.012]], 0.018, 4, 1, false);
      }
    }
    // ---- window grille
    if (o.grille) { const ir = P.g('iron', true); col(ir, 0xffffff); for (let k = 0; k <= 5; k++) { const uu = o.u0 + o.w * k / 5; ir.tube([pt(uu, o.v0, 0.02), pt(uu, o.v1, 0.02)], 0.011, 4, 1, false); } for (const vv of [o.v0 + 0.15, o.v1 - 0.15]) ir.tube([pt(o.u0, vv, 0.02), pt(o.u1, vv, 0.02)], 0.011, 4, 1, false); }
    // ---- flower box under the sill
    if (o.flowerbox) flowerBox(pt, o.u0 - 0.05, o.u1 + 0.05, o.v0 - 0.3, nx, nz);
    // ---- balcony
    if (o.balcony) balcony(pt, o.u0 - 0.35, o.u1 + 0.35, o.y0, nx, nz);
  };

  const flowerBox = (pt, u0, u1, v, nx, nz) => {
    const bx = P.g('plaster2'); col(bx, 0xb8683f); boxOn(bx, pt, u0, u1, v, v + 0.2, 0.22);
    const lf = P.g('leaf:flower', true); lf.wind(0.3);
    const n = Math.max(2, Math.round((u1 - u0) / 0.38));
    for (let k = 0; k < n; k++) {
      const uu = u0 + (k + 0.5) * (u1 - u0) / n; const sz = 0.42 + rnd() * 0.16; const tile = rnd() < 0.5 ? [0, 0.5, 0.5, 1] : rnd() < 0.5 ? [0.5, 0.5, 1, 1] : [0, 0, 0.5, 0.5];
      lf.quadUV(pt(uu - sz / 2, v + 0.14, -0.12), pt(uu + sz / 2, v + 0.14, -0.12), pt(uu + sz / 2, v + 0.14 + sz, -0.16), pt(uu - sz / 2, v + 0.14 + sz, -0.16), tile);
      lf.quadUV(pt(uu, v + 0.14, -0.3), pt(uu, v + 0.14, 0.0), pt(uu, v + 0.1 + sz, -0.02), pt(uu, v + 0.1 + sz, -0.34), tile);
    }
  };

  const balcony = (pt, u0, u1, yFloor, nx, nz) => {
    const out = 0.82; const sl = P.g('stoneblock'); col(sl, 0xffffff);
    boxOn(sl, pt, u0, u1, yFloor - 0.13, yFloor - 0.01, out);
    for (const uu of [u0 + 0.12, u1 - 0.26]) { // corbels
      sl.quad(pt(uu, yFloor - 0.5, 0), pt(uu, yFloor - 0.13, -out * 0.8), pt(uu + 0.14, yFloor - 0.13, -out * 0.8), pt(uu + 0.14, yFloor - 0.5, 0), 1);
      sl.quad(pt(uu, yFloor - 0.5, 0), pt(uu, yFloor - 0.13, 0), pt(uu, yFloor - 0.13, -out * 0.8), pt(uu, yFloor - 0.5, 0), 1);
      sl.quad(pt(uu + 0.14, yFloor - 0.5, 0), pt(uu + 0.14, yFloor - 0.13, -out * 0.8), pt(uu + 0.14, yFloor - 0.13, 0), pt(uu + 0.14, yFloor - 0.5, 0), 1);
    }
    const ir = P.g('iron'); col(ir, 0xffffff); const top = yFloor + 0.98, d = out - 0.05;
    ir.tube([pt(u0 + 0.03, top, 0), pt(u0 + 0.03, top, -d), pt(u1 - 0.03, top, -d), pt(u1 - 0.03, top, 0)], 0.022, 5, 1, false);
    ir.tube([pt(u0 + 0.03, yFloor + 0.1, 0), pt(u0 + 0.03, yFloor + 0.1, -d), pt(u1 - 0.03, yFloor + 0.1, -d), pt(u1 - 0.03, yFloor + 0.1, 0)], 0.014, 4, 1, false);
    const bal = P.g('iron', true); col(bal, 0xffffff);
    const nb = Math.round((u1 - u0) / 0.13);
    for (let k = 0; k <= nb; k++) { const uu = u0 + 0.03 + (u1 - u0 - 0.06) * k / nb; bal.tube([pt(uu, yFloor + 0.1, -d), pt(uu, top, -d)], 0.009, 4, 1, false); }
    for (let k = 1; k < 6; k++) { const dd = d * k / 6; bal.tube([pt(u0 + 0.03, yFloor + 0.1, -dd), pt(u0 + 0.03, top, -dd)], 0.009, 4, 1, false); bal.tube([pt(u1 - 0.03, yFloor + 0.1, -dd), pt(u1 - 0.03, top, -dd)], 0.009, 4, 1, false); }
    if (rnd() < 0.6) { // potted plant on the balcony
      const lf = P.g('leaf:flower', true); lf.wind(0.3); const uu = u0 + 0.3 + rnd() * 0.3; const pot = P.g('plaster2', true); col(pot, 0xb8683f);
      const c = pt(uu, yFloor, -out * 0.55); pot.lathe(c[0], c[2], [[0.1, yFloor], [0.15, yFloor + 0.26], [0.13, yFloor + 0.26]], 8);
      for (let k = 0; k < 2; k++) { const a = k * 1.57; const dx = Math.cos(a) * 0.3, dz = Math.sin(a) * 0.3; lf.quadUV([c[0] - dx, yFloor + 0.2, c[2] - dz], [c[0] + dx, yFloor + 0.2, c[2] + dz], [c[0] + dx, yFloor + 0.85, c[2] + dz], [c[0] - dx, yFloor + 0.85, c[2] - dz], [0, 0.5, 0.5, 1]); }
    }
  };

  // ---------------------------------------------------------------- walls
  const hD = D / 2, hW = W / 2;
  const fFront = facade('front', hD, hW, 1, 0, W, false);
  facade('back', -hD, -hW, -1, 0, W, u.use === 'kiosk');
  facade('left', hD, -hW, 0, -1, D, !!u.attachL);    // the face looking towards -z
  facade('right', -hD, hW, 0, 1, D, !!u.attachR);    // the face looking towards +z

  // ---------------------------------------------------------------- awning / sign / lantern / downpipe on the front
  const fpt = fFront.pt;
  if (feat.awning) {
    const shopOps = fFront.ops.filter((o) => o.kind === 'shop' || o.kind === 'hatch' || (o.kind === 'door' && u.use === 'shop'));
    if (shopOps.length) {
      const u0 = Math.min(...shopOps.map((o) => o.u0)) - 0.25, u1 = Math.max(...shopOps.map((o) => o.u1)) + 0.25, top = Math.max(...shopOps.map((o) => o.v1)) + 0.28, out = u.use === 'kiosk' ? 1.5 : 1.25, drop = 0.5;
      const cl = P.g('fabric'); cl.wind(0.25); const ti = u.awningTile ?? Math.floor(rnd() * 4); const r = [(ti % 2) * 0.5 + 0.01, (ti < 2 ? 0.5 : 0) + 0.01, (ti % 2) * 0.5 + 0.49, (ti < 2 ? 0.5 : 0) + 0.49];
      const reps = Math.max(1, Math.round((u1 - u0) / 2.2));
      for (let k = 0; k < reps; k++) { const a = u0 + (u1 - u0) * k / reps, b = u0 + (u1 - u0) * (k + 1) / reps; cl.quadUV(fpt(a, top - drop, -out), fpt(b, top - drop, -out), fpt(b, top, -0.02), fpt(a, top, -0.02), r); cl.quadUV(fpt(a, top - drop - 0.2, -out), fpt(b, top - drop - 0.2, -out), fpt(b, top - drop, -out), fpt(a, top - drop, -out), [r[0], r[1], r[2], r[1] + 0.06]); }
      const ir = P.g('iron', true); col(ir, 0xffffff); for (const uu of [u0, u1]) ir.tube([fpt(uu, top - 0.75, 0), fpt(uu, top - drop, -out)], 0.012, 4, 1, false);
    }
  }
  if (feat.sign !== undefined && feat.sign !== false) {
    const sg = P.g('signs'); const i = feat.sign % 4; const r = [i / 4 + 0.004, 0.0 + 0.004 + 0.0625, (i + 1) / 4 - 0.004, 0.25 - 0.004 - 0.0625];
    const cu = W / 2, v = heights[0] - 0.42; sg.quadUV(fpt(cu - 1.1, v - 0.28, -0.07), fpt(cu + 1.1, v - 0.28, -0.07), fpt(cu + 1.1, v + 0.28, -0.07), fpt(cu - 1.1, v + 0.28, -0.07), r);
    const wd = P.g('wood'); col(wd, 0x4a3524); boxOn(wd, fpt, cu - 1.16, cu + 1.16, v - 0.34, v + 0.34, 0.06);
  }
  if (feat.lantern) {
    const door = fFront.ops.find((o) => o.kind === 'door'); const uu = door ? door.u1 + 0.45 : W * 0.5;
    const ir = P.g('iron', true); col(ir, 0xffffff); ir.tube([fpt(uu, 2.5, 0), fpt(uu, 2.62, -0.3), fpt(uu, 2.5, -0.34)], 0.012, 4, 1, false);
    const c = fpt(uu, 2.3, -0.34); ir.cyl(c[0], 2.47, c[2], 0.09, 0.02, 2.53, 6);
    const gl = P.g('lampglass', true); gl.cyl(c[0], 2.27, c[2], 0.05, 0.075, 2.47, 6, 1, false);
  }
  if (feat.downpipe) { const ir = P.g('iron', true); col(ir, 0x6a6a66); ir.tube([fpt(0.18, 0, -0.06), fpt(0.18, Htop - 0.25, -0.06)], 0.04, 6, 1, false); }

  // ---------------------------------------------------------------- roof
  const ov = u.eaves ?? 0.45, pitch = (u.pitch ?? 24) * Math.PI / 180; const roofMat = u.roofMat || 'rooftile';
  const rf = P.g(roofMat); col(rf, 0xffffff, 0.92 + rnd() * 0.14); const wd = P.g('wood'); col(wd, 0x5b4330);
  const wallG = P.g(wallMat); col(wallG, wallCol);
  const th = 0.11;
  if ((u.roof || 'gable') === 'gable') {
    const run = hD + ov, rise = run * Math.tan(pitch); const yE = Htop, yR = Htop + rise; const zL = -hW - (u.attachL ? 0 : ov * 0.7), zR = hW + (u.attachR ? 0 : ov * 0.7);
    rf.quad([run, yE, zR], [run, yE, zL], [0, yR, zL], [0, yR, zR], 1);
    rf.quad([-run, yE, zL], [-run, yE, zR], [0, yR, zR], [0, yR, zL], 1);
    // fascia, soffit, bargeboards
    wd.quad([run, yE - th, zL], [run, yE - th, zR], [run, yE, zR], [run, yE, zL], 1).quad([-run, yE - th, zR], [-run, yE - th, zL], [-run, yE, zL], [-run, yE, zR], 1);
    wd.quad([hD, yE - th, zL], [hD, yE - th, zR], [run, yE - th, zR], [run, yE - th, zL], 1).quad([-run, yE - th, zL], [-run, yE - th, zR], [-hD, yE - th, zR], [-hD, yE - th, zL], 1);
    for (const [z, s] of [[zL, -1], [zR, 1]]) {
      if (s < 0) { wd.quad([run, yE - th, z], [run, yE, z], [0, yR, z], [0, yR - th, z], 1); wd.quad([0, yR - th, z], [0, yR, z], [-run, yE, z], [-run, yE - th, z], 1); }
      else { wd.quad([run, yE, z], [run, yE - th, z], [0, yR - th, z], [0, yR, z], 1); wd.quad([0, yR, z], [0, yR - th, z], [-run, yE - th, z], [-run, yE, z], 1); }
      // gable wall up to the roof
      const zz = s < 0 ? -hW : hW; const b = wallG.vertexCount; const hr = hD * Math.tan(pitch) + ov * Math.tan(pitch) * 0;
      wallG.vert(hD, Htop, zz, 0, 0, s, hD, Htop); wallG.vert(-hD, Htop, zz, 0, 0, s, -hD, Htop); wallG.vert(0, Htop + run * Math.tan(pitch) - th * 0.5, zz, 0, 0, s, 0, Htop + rise);
      if (s < 0) wallG.tri(b, b + 2, b + 1); else wallG.tri(b, b + 1, b + 2);
    }
    rf.tube([[0, yR + 0.02, zL - 0.02], [0, yR + 0.02, zR + 0.02]], 0.1, 6, 1, true);
    if (feat.chimney) chimney(-hD * 0.45, (rnd() - 0.5) * W * 0.5, Htop + (run - hD * 0.45) * Math.tan(pitch));
  } else if (u.roof === 'hip') {
    const run = hD + ov, rise = run * Math.tan(pitch); const yE = Htop, yR = Htop + rise; const zE = hW + ov; const ridge = Math.max(0, zE - run);
    rf.quad([run, yE, zE], [run, yE, -zE], [0, yR, -ridge], [0, yR, ridge], 1);
    rf.quad([-run, yE, -zE], [-run, yE, zE], [0, yR, ridge], [0, yR, -ridge], 1);
    const tri = (a, b, c) => { const base = rf.vertexCount; const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]; const l = Math.hypot(...n); rf.vert(a[0], a[1], a[2], n[0] / l, n[1] / l, n[2] / l, a[0], 0); rf.vert(b[0], b[1], b[2], n[0] / l, n[1] / l, n[2] / l, b[0], 0); rf.vert(c[0], c[1], c[2], n[0] / l, n[1] / l, n[2] / l, 0, Math.hypot(run, rise)); rf.tri(base, base + 1, base + 2); };
    tri([run, yE, zE], [0, yR, ridge], [-run, yE, zE]); tri([-run, yE, -zE], [0, yR, -ridge], [run, yE, -zE]);
    // fascia + soffit all round
    const ring = [[run, zE], [run, -zE], [-run, -zE], [-run, zE]];
    for (let k = 0; k < 4; k++) { const a = ring[k], b = ring[(k + 1) % 4]; wd.quad([a[0], yE - th, a[1]], [b[0], yE - th, b[1]], [b[0], yE, b[1]], [a[0], yE, a[1]], 1); }
    wd.quad([hD, yE - th, -zE], [hD, yE - th, zE], [run, yE - th, zE], [run, yE - th, -zE], 1).quad([-run, yE - th, -zE], [-run, yE - th, zE], [-hD, yE - th, zE], [-hD, yE - th, -zE], 1);
    wd.quad([-hD, yE - th, hW], [hD, yE - th, hW], [hD, yE - th, zE], [-hD, yE - th, zE], 1).quad([-hD, yE - th, -zE], [hD, yE - th, -zE], [hD, yE - th, -hW], [-hD, yE - th, -hW], 1);
    if (ridge > 0.2) rf.tube([[0, yR + 0.02, -ridge], [0, yR + 0.02, ridge]], 0.1, 6, 1, true);
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) rf.tube([[sx * run, yE + 0.02, sz * zE], [0, yR + 0.03, sz * ridge]], 0.075, 5, 1, false);
    if (feat.chimney) chimney(-hD * 0.4, (rnd() - 0.5) * W * 0.3, Htop + (run - hD * 0.4) * Math.tan(pitch));
  } else { // shed: single slope falling towards the back
    const yF = Htop + D * Math.tan(pitch * 0.6), zE = hW + ov * 0.6;
    rf.quad([hD + ov, yF, zE], [hD + ov, yF, -zE], [-hD - ov, Htop, -zE], [-hD - ov, Htop, zE], 1);
    wd.quad([hD + ov, yF - th, -zE], [hD + ov, yF - th, zE], [hD + ov, yF, zE], [hD + ov, yF, -zE], 1);
    for (const s of [-1, 1]) { const zz = s * hW; const b = wallG.vertexCount; wallG.vert(hD, Htop, zz, 0, 0, s, hD, Htop); wallG.vert(-hD, Htop, zz, 0, 0, s, -hD, Htop); wallG.vert(hD, yF - th, zz, 0, 0, s, hD, yF); if (s < 0) wallG.tri(b, b + 2, b + 1); else wallG.tri(b, b + 1, b + 2); }
    wallG.quad([hD, Htop, hW], [hD, Htop, -hW], [hD, yF - th, -hW], [hD, yF - th, hW], 1);
  }

  function chimney(cx, cz, yBase) {
    const ch = P.g(wallMat); col(ch, wallCol, 0.95); const top = yBase + 1.15;
    ch.box(cx, (yBase - 0.6 + top) / 2, cz, 0.24, (top - yBase + 0.6) / 2, 0.34, 1, '-y');
    const cap = P.g(roofMat); col(cap, 0xffffff); cap.box(cx, top + 0.04, cz, 0.3, 0.04, 0.4);
    cap.quad([cx - 0.28, top + 0.08, cz + 0.36], [cx + 0.28, top + 0.08, cz + 0.36], [cx + 0.28, top + 0.3, cz], [cx - 0.28, top + 0.3, cz], 1).quad([cx + 0.28, top + 0.08, cz - 0.36], [cx - 0.28, top + 0.08, cz - 0.36], [cx - 0.28, top + 0.3, cz], [cx + 0.28, top + 0.3, cz], 1);
  }
  return { parts: P, height: Htop, floors };
}

/** bakes a building's local geometry into world space and appends it to per-material accumulators */
export function emitBuilding(u, acc) {
  const res = buildBuilding(u);
  const m = new THREE.Matrix4().makeRotationY(-u.rot).setPosition(u.x, u.y, u.z);
  const e = m.elements;
  for (const [tier, map] of [['base', res.parts.base], ['detail', res.parts.detail]]) for (const [mat, g] of map) {
    if (!g.vertexCount) continue;
    const key = tier + '|' + mat; let dst = acc.get(key); if (!dst) { dst = new Geo(); acc.set(key, dst); }
    const base = dst.vertexCount;
    for (let i = 0; i < g.p.length; i += 3) {
      const x = g.p[i], y = g.p[i + 1], z = g.p[i + 2];
      dst.p.push(e[0] * x + e[8] * z + e[12], y + e[13], e[2] * x + e[10] * z + e[14]);
      const nx = g.n[i], ny = g.n[i + 1], nz = g.n[i + 2];
      dst.n.push(e[0] * nx + e[8] * nz, ny, e[2] * nx + e[10] * nz);
    }
    for (const v of g.uv) dst.uv.push(v);
    if (g.col || dst.col) { if (!dst.col) dst.col = new Array(base * 3).fill(1); if (g.col) { for (const v of g.col) dst.col.push(v); while (dst.col.length < dst.p.length) dst.col.push(1); } else for (let i = 0; i < g.p.length; i++) dst.col.push(1); }
    if (g.w || dst.w) { if (!dst.w) dst.w = new Array(base).fill(0); if (g.w) { for (const v of g.w) dst.w.push(v); while (dst.w.length < dst.p.length / 3) dst.w.push(0); } else for (let i = 0; i < g.p.length / 3; i++) dst.w.push(0); }
    for (const i of g.idx) dst.idx.push(i + base);
  }
  return res;
}

// ---------------------------------------------------------------------------------------------
// church with bell tower (the landmark of the village)
// ---------------------------------------------------------------------------------------------
/** flat polygon with holes (THREE.Shape, x = u, y = v) laid on the plane origin + u * U + v * V, facing U x V */
function addShape(g, shape, origin, U, V) {
  const sg = new THREE.ShapeGeometry(shape, 12); const pos = sg.attributes.position, idx = sg.index; const base = g.vertexCount;
  const nx = U[1] * V[2] - U[2] * V[1], ny = U[2] * V[0] - U[0] * V[2], nz = U[0] * V[1] - U[1] * V[0];
  for (let i = 0; i < pos.count; i++) { const a = pos.getX(i), b = pos.getY(i); g.vert(origin[0] + U[0] * a + V[0] * b, origin[1] + U[1] * a + V[1] * b, origin[2] + U[2] * a + V[2] * b, nx, ny, nz, a, b); }
  for (let i = 0; i < idx.count; i += 3) g.tri(base + idx.getX(i), base + idx.getX(i + 1), base + idx.getX(i + 2));
  sg.dispose();
}
/** outline of an arched opening: [[u, v], ...] counter-clockwise */
function archOutline(cu, v0, w, h, seg = 12) {
  const r = w / 2, vs = v0 + h - r; const pts = [[cu - r, v0], [cu + r, v0]];
  for (let k = 0; k <= seg; k++) { const a = k / seg * Math.PI; pts.push([cu + r * Math.cos(a), vs + r * Math.sin(a)]); }
  return pts;
}
function circleOutline(cu, cv, r, seg = 20) { const pts = []; for (let k = 0; k < seg; k++) { const a = k / seg * Math.PI * 2; pts.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]); } return pts; }
const pathOf = (pts) => new THREE.Path(pts.map((q) => new THREE.Vector2(q[0], q[1])));

function buildChurch(u) {
  const P = new Parts(); const W = u.naveW || 9.6, D = u.naveD || 17, H = u.naveH || 8.2, TW = u.towerW || 4.6, TH = u.towerH || 21, ts = u.towerSide || 1;
  const wallMat = u.wallMat || 'plasterochre', wallCol = u.wall ?? 0xead9ae, trimCol = u.trim ?? 0xf4eedf;
  const hD = D / 2, hW = W / 2, RV = 0.32, pitch = 31 * Math.PI / 180, ov = 0.55;
  const rise = hW * Math.tan(pitch);
  const wall = P.g(wallMat), stone = P.g('stoneblock'), trim = P.g('plaster2'), roof = P.g(u.roofMat || 'rooftile'), glass = P.g('windowglass'), wood = P.g('door'), iron = P.g('iron');
  col(wall, wallCol); col(stone, 0xffffff); col(trim, trimCol); col(roof, 0xffffff); col(wood, 0x8a6a4a);
  // a wall plane: origin at its bottom-left corner seen from outside, U along the wall, V up; `depth` pushes into the building
  const plane = (ox, oz, nx, nz) => {
    const ux = nz, uz = -nx; const O = [ox, 0, oz], U = [ux, 0, uz], V = [0, 1, 0];
    const pt = (a, b, depth = 0) => [ox + ux * a - nx * depth, b, oz + uz * a - nz * depth];
    return { O, U, V, pt, n: [nx, 0, nz] };
  };
  // reveal of an opening (outline in wall coordinates, counter-clockwise), plus what fills it at the back
  const reveal = (pl, outline, fill, fillCol) => {
    col(wall, wallCol, 0.84);
    for (let k = 0; k < outline.length; k++) { const a = outline[k], b = outline[(k + 1) % outline.length]; wall.quad(pl.pt(b[0], b[1], 0), pl.pt(a[0], a[1], 0), pl.pt(a[0], a[1], RV), pl.pt(b[0], b[1], RV), 1); }
    col(wall, wallCol);
    const g = P.g(fill); if (fillCol !== undefined) col(g, fillCol);
    const sh = new THREE.Shape(outline.map((q) => new THREE.Vector2(q[0], q[1])));
    const O = pl.pt(0, 0, RV); addShape(g, sh, O, pl.U, pl.V);
  };
  // moulding that follows an outline, standing proud of the wall
  const surround = (pl, outline, width, out, closed = false) => {
    const cu = outline.reduce((t, q) => t + q[0], 0) / outline.length, cv = outline.reduce((t, q) => t + q[1], 0) / outline.length;
    const grow = (q) => { const dx = q[0] - cu, dy = q[1] - cv, l = Math.hypot(dx, dy) || 1; return [q[0] + dx / l * width, q[1] + dy / l * width]; };
    const m = closed ? outline.length : outline.length - 1;
    for (let k = closed ? 0 : 1; k < m; k++) { const a = outline[k], b = outline[(k + 1) % outline.length], a2 = grow(a), b2 = grow(b);
      trim.quad(pl.pt(a[0], a[1], -out), pl.pt(b[0], b[1], -out), pl.pt(b2[0], b2[1], -out), pl.pt(a2[0], a2[1], -out), 1);
      trim.quad(pl.pt(a2[0], a2[1], -out), pl.pt(b2[0], b2[1], -out), pl.pt(b2[0], b2[1], 0), pl.pt(a2[0], a2[1], 0), 1); }
  };
  const wallShape = (w, h, gable, holes) => {
    const pts = [[0, -1.2], [w, -1.2], [w, h]]; if (gable) pts.push([w / 2, h + gable]); pts.push([0, h]);
    const sh = new THREE.Shape(pts.map((q) => new THREE.Vector2(q[0], q[1]))); for (const hl of holes) sh.holes.push(pathOf(hl)); return sh;
  };

  // ---- front: portal, oculus, pediment
  const fr = plane(hD, hW, 1, 0);
  const portal = archOutline(W / 2, 0.45, 2.5, 4.3), oculus = circleOutline(W / 2, 6.55, 0.95);
  addShape(wall, wallShape(W, H, rise, [portal, oculus]), fr.O, fr.U, fr.V);
  reveal(fr, portal, 'door', 0x7c5b3c); reveal(fr, oculus, 'windowglass');
  surround(fr, portal, 0.34, 0.09); surround(fr, oculus, 0.24, 0.07, true);
  // door: two leaves suggested by a centre post and rails, iron studs
  { const q = (a, b, c = 0) => fr.pt(a, b, RV + c); const dg = P.g('wood', true); col(dg, 0x4a3524);
    for (const [u0, u1, v0, v1] of [[W / 2 - 0.05, W / 2 + 0.05, 0.45, 3.5], [W / 2 - 1.2, W / 2 + 1.2, 3.42, 3.56], [W / 2 - 1.2, W / 2 + 1.2, 1.55, 1.65]]) {
      dg.quad(q(u0, v0, -0.05), q(u1, v0, -0.05), q(u1, v1, -0.05), q(u0, v1, -0.05), 1); }
    col(iron, 0xffffff); for (const du of [-0.62, 0.62]) for (const dv of [1.0, 2.2, 3.0]) { const c = q(W / 2 + du, dv, -0.06); iron.box(c[0], c[1], c[2], 0.03, 0.05, 0.05); } }
  // steps
  for (let k = 0; k < 3; k++) stone.box(hD + 0.45 + k * 0.38, 0.45 - (k + 0.5) * 0.15 - 0.6, 0, 0.5 + k * 0.38 - k * 0.19, 0.6 + 0.075, 2.3 + (2 - k) * 0.0, 1, '-y');
  // corner pilasters and raking cornice of the pediment
  for (const zc of [hW - 0.32, -hW + 0.32]) stone.box(hD + 0.05, H / 2 - 0.3, zc, 0.09, H / 2 + 0.3, 0.34, 1, '-y');
  for (const sg of [-1, 1]) { const a = fr.pt(sg < 0 ? W + 0.25 : -0.25, H - 0.12, 0), b = fr.pt(W / 2, H + rise + 0.02, 0); trim.tube([[a[0] + 0.12, a[1], a[2]], [b[0] + 0.12, b[1], b[2]]], 0.13, 6, 1, false); }
  col(trim, trimCol); { const a = fr.pt(-0.05, H - 0.1, -0.1), b = fr.pt(W + 0.05, H - 0.1, -0.1); trim.tube([a, b], 0.1, 6, 1, false); }
  // cross on the apex
  col(iron, 0xffffff); iron.box(hD - 0.1, H + rise + 0.75, 0, 0.045, 0.75, 0.045).box(hD - 0.1, H + rise + 1.05, 0, 0.045, 0.045, 0.32);

  // ---- side walls with tall arched windows and buttresses, back wall
  for (const sg of [-1, 1]) {
    const pl = sg > 0 ? plane(-hD, hW, 0, 1) : plane(hD, -hW, 0, -1);
    const holes = []; const nwin = 3;
    for (let k = 0; k < nwin; k++) { const cu = D * (k + 0.5) / nwin + (sg > 0 ? 1 : -1) * 0.0; if (sg === ts && (sg > 0 ? cu > D - TW - 0.8 : cu < TW + 0.8)) continue; holes.push(archOutline(cu, 3.0, 1.15, 3.5)); }
    addShape(wall, wallShape(D, H, 0, holes), pl.O, pl.U, pl.V);
    for (const hl of holes) { reveal(pl, hl, 'windowglass'); surround(pl, hl, 0.2, 0.06); }
    for (let k = 0; k <= nwin; k++) { const cu = D * k / nwin; const c = pl.pt(Math.min(D - 0.35, Math.max(0.35, cu)), 0, -0.3); stone.box(c[0], 3.0, c[2], pl.n[0] ? 0.3 : 0.36, 4.2, pl.n[0] ? 0.36 : 0.3, 1, '-y'); }
  }
  { const pl = plane(-hD, -hW, -1, 0); addShape(wall, wallShape(W, H, rise, []), pl.O, pl.U, pl.V); }
  // plinth all round
  col(stone, 0xffffff, 0.95);
  for (const [ox, oz, nx, nz, w] of [[hD, hW, 1, 0, W], [-hD, -hW, -1, 0, W], [-hD, hW, 0, 1, D], [hD, -hW, 0, -1, D]]) { const pl = plane(ox, oz, nx, nz);
    stone.quad(pl.pt(0, -1.2, -0.05), pl.pt(w, -1.2, -0.05), pl.pt(w, 0.75, -0.05), pl.pt(0, 0.75, -0.05), 1); stone.quad(pl.pt(0, 0.75, -0.05), pl.pt(w, 0.75, -0.05), pl.pt(w, 0.75, 0), pl.pt(0, 0.75, 0), 1); }

  // ---- nave roof: ridge along the depth of the building
  { const run = hW + ov, yE = H - ov * Math.tan(pitch), yR = H + rise; const x0 = -hD - 0.3, x1 = hD + 0.3;
    roof.quad([x1, yE, run], [x0, yE, run], [x0, yR, 0], [x1, yR, 0], 1); roof.quad([x0, yE, -run], [x1, yE, -run], [x1, yR, 0], [x0, yR, 0], 1);
    const wd = P.g('wood'); col(wd, 0x5b4330);
    for (const sg of [-1, 1]) wd.quad([x0, yE - 0.1, sg * run], [x1, yE - 0.1, sg * run], [x1, yE, sg * run], [x0, yE, sg * run], 1);
    wd.quad([x0, yE - 0.1, hW], [x1, yE - 0.1, hW], [x1, yE - 0.1, run], [x0, yE - 0.1, run], 1).quad([x0, yE - 0.1, -run], [x1, yE - 0.1, -run], [x1, yE - 0.1, -hW], [x0, yE - 0.1, -hW], 1);
    roof.tube([[x0 - 0.02, yR + 0.03, 0], [x1 + 0.02, yR + 0.03, 0]], 0.11, 6, 1, true); }

  // ---- bell tower on one shoulder of the facade
  { const tx1 = hD - 0.25, tx0 = tx1 - TW, tz0 = ts > 0 ? hW - 0.1 : -hW + 0.1 - TW, tz1 = tz0 + TW; const yB = TH - 5.2, yT = TH - 1.2;      // belfry stage
    const faces = [[tx1, tz1, 1, 0], [tx0, tz0, -1, 0], [tx0, tz1, 0, 1], [tx1, tz0, 0, -1]];
    for (const [ox, oz, nx, nz] of faces) {
      const pl = plane(ox, oz, nx, nz); const bell = archOutline(TW / 2, yB + 0.5, 1.5, 2.9); const slit = [[TW / 2 - 0.22, 9.0], [TW / 2 + 0.22, 9.0], [TW / 2 + 0.22, 10.6], [TW / 2 - 0.22, 10.6]];
      addShape(wall, wallShape(TW, TH, 0, [bell, slit]), pl.O, pl.U, pl.V);
      reveal(pl, slit, 'windowglass'); surround(pl, bell, 0.22, 0.07);
      // the belfry is open: reveal only, dark interior behind
      col(wall, wallCol, 0.8); for (let k = 0; k < bell.length; k++) { const a = bell[k], b = bell[(k + 1) % bell.length]; wall.quad(pl.pt(b[0], b[1], 0), pl.pt(a[0], a[1], 0), pl.pt(a[0], a[1], 0.45), pl.pt(b[0], b[1], 0.45), 1); } col(wall, wallCol);
      // string courses and cornice
      for (const [v, t, o] of [[yB, 0.12, 0.1], [yT + 0.55, 0.16, 0.16], [6.2, 0.1, 0.07]]) { trim.quad(pl.pt(-o, v - t, -o), pl.pt(TW + o, v - t, -o), pl.pt(TW + o, v + t, -o), pl.pt(-o, v + t, -o), 1); trim.quad(pl.pt(-o, v + t, -o), pl.pt(TW + o, v + t, -o), pl.pt(TW + o, v + t, 0), pl.pt(-o, v + t, 0), 1); trim.quad(pl.pt(-o, v - t, 0), pl.pt(TW + o, v - t, 0), pl.pt(TW + o, v - t, -o), pl.pt(-o, v - t, -o), 1); }
      stone.quad(pl.pt(0, -1.2, -0.05), pl.pt(TW, -1.2, -0.05), pl.pt(TW, 0.75, -0.05), pl.pt(0, 0.75, -0.05), 1);
    }
    const cx = (tx0 + tx1) / 2, cz = (tz0 + tz1) / 2;
    // dark core and floor of the belfry, the bell
    const dark = P.g('iron'); col(dark, 0x0a0a0a); dark.box(cx, (yB + yT) / 2 + 0.4, cz, TW / 2 - 0.46, (yT - yB) / 2 + 0.3, TW / 2 - 0.46, 1, '-y');
    const bz = P.g('paintmetal', true); col(bz, 0x8a6a30); for (const [dx, dz] of [[TW / 2 - 0.2, 0], [-TW / 2 + 0.2, 0], [0, TW / 2 - 0.2], [0, -TW / 2 + 0.2]]) bz.lathe(cx + dx * 0.0, cz + dz * 0.0, [[0.001, yB + 2.65], [0.16, yB + 2.6], [0.24, yB + 2.2], [0.3, yB + 1.75], [0.42, yB + 1.45], [0.44, yB + 1.38]], 10);
    // pyramid roof with a cross
    const e = TW / 2 + 0.35, yR0 = TH, yR1 = TH + 3.4;
    for (const [ax, az, bx, bz2] of [[e, e, e, -e], [e, -e, -e, -e], [-e, -e, -e, e], [-e, e, e, e]]) roof.quad([cx + ax, yR0, cz + az], [cx + bx, yR0, cz + bz2], [cx, yR1, cz], [cx, yR1, cz], 1);
    const wd = P.g('wood'); col(wd, 0x5b4330); wd.box(cx, yR0 - 0.06, cz, e, 0.06, e);
    col(iron, 0xffffff); iron.box(cx, yR1 + 0.7, cz, 0.04, 0.8, 0.04).box(cx, yR1 + 1.05, cz, 0.04, 0.04, 0.3).cyl(cx, yR1 - 0.1, cz, 0.12, 0.05, yR1 + 0.15, 8);
  }
  return { parts: P, height: TH + 3.4, floors: 3 };
}
