// Village layout (Z3). Everything is laid out in track space and derived from track.json:
// the building line is the collision line of the 'facade' sides, the side streets, the square and
// the church come from json.places. The result is a small coastal town: two continuous street
// fronts (terraced houses, shops, public buildings, the odd front garden or alley), side streets
// lined with houses, a church square with a fountain, and the closures that mark the collision
// line where there is no facade (race barriers across the side streets, a balustrade along the
// square, garden walls, link walls between houses).
// No three.js here: this runs in Node for validateWorld() and the density audit.

import { BARRIER_TYPES } from './track.js';
import { clamp } from '../core/math.js';

const BT = Object.fromEntries(BARRIER_TYPES.map((n, i) => [n, i]));

const WALLS = [0xe9d9b6, 0xe2b98c, 0xd98f6c, 0xf1ead9, 0xc9d6dc, 0xe8c66e, 0xcfa07a, 0xdfd0c0, 0xb9c9b0, 0xe6a98f, 0xf0dfa8, 0xd7b7a0, 0xc4b59d, 0xf2e3cf];
const SHUTTERS = [0x2f6b52, 0x2f5f8a, 0x7a4a2c, 0xf0ece2, 0x8a2f2a, 0x4a6a3a, 0x2a4f6a, 0x5a5348];
const DOORS = [0xffffff, 0xc9b79a, 0x9fb6c4, 0x8fae95, 0xb98a7a, 0xd9cdb8];

/**
 * Architectural variations. w: front width (m), d: depth, floors: choices, weight: how common.
 * Every variation carries at least one of balcony / awning / flower boxes / chimney (section 5.3).
 */
export const ARCHETYPES = [
  { id: 'townhouse', name: 'sobrado de reboco, 2 andares', use: 'house', w: [5.6, 7.6], d: [7.5, 9.5], floors: [2], weight: 5, wallMat: ['plaster', 'plaster2'], roof: 'gable', feat: { flowerbox: true, chimney: true, lantern: 0.5, downpipe: 0.5 } },
  { id: 'tall', name: 'sobrado de 3 andares com varanda', use: 'house', w: [5.8, 7.8], d: [8, 10], floors: [3], weight: 4, wallMat: ['plaster2', 'plasterworn'], roof: 'hip', feat: { balcony: true, chimney: 0.6, lantern: 0.5, downpipe: 0.6 } },
  { id: 'stone', name: 'casa de pedra com lintel de madeira', use: 'house', w: [6, 8.5], d: [7.5, 9], floors: [2], weight: 3, wallMat: ['rubble'], roof: 'gable', feat: { chimney: true, flowerbox: 0.5, lantern: 0.4 }, wall: 0xffffff },
  { id: 'shop', name: 'comércio com vitrine e toldo', use: 'shop', w: [6.2, 8.4], d: [8, 10], floors: [2, 2, 3], weight: 4, wallMat: ['plaster', 'plasterochre', 'plaster2'], roof: 'gable', feat: { awning: true, sign: true, balcony: 0.35, lantern: 0.6 } },
  { id: 'public', name: 'edifício público com cunhais e portal em arco', use: 'public', w: [9.5, 12.5], d: [9, 11], floors: [2], weight: 1, wallMat: ['plaster', 'stoneblock'], roof: 'hip', feat: { quoins: true, arch: true, balcony: true, lantern: true, chimney: 0.5 } },
  { id: 'arcade', name: 'casa ocre de 3 andares com portal em arco', use: 'house', w: [6.4, 8.2], d: [8, 9.5], floors: [3], weight: 2, wallMat: ['plasterochre'], roof: 'gable', feat: { arch: true, flowerbox: true, chimney: 0.7, downpipe: 0.5 } },
  { id: 'fisher', name: 'casa estreita de pescador', use: 'house', w: [4.5, 5.6], d: [7, 8.5], floors: [2], weight: 4, wallMat: ['plaster', 'plasterworn', 'plaster2'], roof: 'gable', feat: { flowerbox: 0.7, chimney: true, lantern: 0.3 } },
  { id: 'cafe', name: 'café / restaurante com toldo largo', use: 'shop', w: [7.5, 9.5], d: [8.5, 10], floors: [2], weight: 2, wallMat: ['plaster2', 'plaster'], roof: 'hip', feat: { awning: true, sign: true, flowerbox: 0.6, lantern: true } },
];

function obbOverlap(a, b, pad = 0) {
  // separating-axis test of two oriented boxes {x, z, rot, hx, hz} (hx along the front direction)
  const dx = b.x - a.x, dz = b.z - a.z;
  for (const o of [a, b]) for (const k of [0, 1]) {
    const ang = o.rot + k * Math.PI / 2; const ax = Math.cos(ang), az = Math.sin(ang);
    const ra = Math.abs(Math.cos(a.rot - ang)) * a.hx + Math.abs(Math.sin(a.rot - ang)) * a.hz;
    const rb = Math.abs(Math.cos(b.rot - ang)) * b.hx + Math.abs(Math.sin(b.rot - ang)) * b.hz;
    if (Math.abs(dx * ax + dz * az) > ra + rb + pad) return false;
  }
  return true;
}

export function buildVillage(P) {
  const { world, track, sp, terrain } = P; const json = world.json; const places = json.places || {};
  const V = world.lists.village = { units: [], plaza: null, streets: [], closures: [], church: null, archetypes: ARCHETYPES.map((a) => ({ id: a.id, name: a.name })) };
  const zone = track.zones[2]; if (!zone) return;
  const rnd = P.rng('village'); const n = sp.n; const L = sp.length;
  const idx = (s) => Math.floor(sp.wrapS(s) / sp.ds) % n;
  // span of the facade barrier on each side (the building line), from the per-sample arrays
  const span = [0, 1].map((side) => { let a = -1, b = -1; for (let i = 0; i < n; i++) if (track.barType[side][i] === BT.facade) { if (a < 0) a = i; b = i; } return { from: a * sp.ds + 1.5, to: (b + 1) * sp.ds - 1.5 }; });
  const half = (s) => sp.sampleArr(sp.half, s), line = (side, s) => half(s) + sp.sampleArr(track.barOff[side], s);
  const kappa = (s) => sp.sampleArr(sp.kappa, s);
  const sgn = (side) => (side ? 1 : -1);
  /** track distance that a chord of length w takes on the building line of `side` around s */
  const along = (side, s, w, extra = 0) => w / clamp(1 - kappa(s) * sgn(side) * (line(side, s) + extra), 0.55, 1.6);
  const P2 = {};
  const at = (s, d) => { const p = sp.pointAt(s, d, P2); return { x: p.x, z: p.z, heading: p.heading }; };

  // ---- openings of the building line: side streets and the square
  const openings = [[], []];
  for (const st of places.sideStreets || []) {
    const side = st.side === 'L' ? 0 : 1; const w = along(side, st.s, st.width + 0.6);
    openings[side].push({ kind: 'street', from: st.s - w / 2, to: st.s + w / 2, s: st.s, width: st.width });
  }
  const pz = places.plaza;
  if (pz) { const side = pz.side === 'L' ? 0 : 1; const w = along(side, pz.s, pz.length); openings[side].push({ kind: 'plaza', from: pz.s - w / 2, to: pz.s + w / 2, s: pz.s }); }
  for (const o of openings) o.sort((a, b) => a.from - b.from);

  const boxes = [];           // every footprint placed so far (overlap tests)
  const usedColors = [];
  const pickColor = () => { let c; for (let k = 0; k < 8; k++) { c = rnd.pick(WALLS); if (!usedColors.slice(-2).includes(c)) break; } usedColors.push(c); return c; };
  const weightSum = ARCHETYPES.reduce((a, b) => a + b.weight, 0);
  const pickArch = (filter) => { for (let k = 0; k < 30; k++) { let r = rnd.f() * weightSum; for (const a of ARCHETYPES) { r -= a.weight; if (r <= 0) { if (!filter || filter(a)) return a; break; } } } return ARCHETYPES[0]; };
  let serial = 0;

  /** creates one architectural unit; returns null if its footprint would overlap another one */
  const addUnit = (arch, o) => {
    const box = { x: o.x, z: o.z, rot: o.rot, hx: o.depth / 2, hz: o.width / 2 };
    for (const b of boxes) if (obbOverlap(box, b, 0.04)) return null;
    const y = terrain.heightAt(o.x, o.z);
    { const c = Math.cos(o.rot), sn = Math.sin(o.rot);
      for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const qx = o.x + c * a * box.hx - sn * b * box.hz, qz = o.z + sn * a * box.hx + c * b * box.hz; if (Math.abs(terrain.heightAt(qx, qz) - y) > 0.22) return null; } }
    const floors = o.floors || rnd.pick(arch.floors); const f = arch.feat; const on = (v) => v === true || (typeof v === 'number' && rnd.f() < v);
    const feat = { balcony: on(f.balcony), awning: on(f.awning), flowerbox: on(f.flowerbox), chimney: on(f.chimney), lantern: on(f.lantern), quoins: on(f.quoins), arch: on(f.arch), downpipe: on(f.downpipe) };
    if (f.sign) feat.sign = rnd.int(0, 3);
    if (!feat.balcony && !feat.awning && !feat.flowerbox && !feat.chimney) feat.chimney = true;
    const wallMat = rnd.pick(arch.wallMat);
    const spec = {
      use: arch.use, floors, wallMat, wall: arch.wall ?? (wallMat === 'stoneblock' ? 0xffffff : pickColor()), trim: wallMat === 'rubble' ? 0xe6dcc8 : rnd.pick([0xf3ecdd, 0xf6f1e6, 0xe9e0cc]),
      shutter: rnd.pick(SHUTTERS), shutterMat: rnd.pick(['woodgreen', 'woodblue', 'woodgrey']), doorColor: rnd.pick(DOORS),
      roof: arch.roof, roofMat: rnd.pick(['rooftile', 'rooftile', 'rooftile2', 'rooftile3']), eaves: rnd.range(0.38, 0.6), pitch: rnd.range(20, 27), plinth: rnd.range(0.35, 0.7),
      feat, awningTile: rnd.int(0, 3), seed: 9000 + serial * 37, variant: ARCHETYPES.indexOf(arch), attachL: !!o.attachL, attachR: !!o.attachR,
    };
    const obj = P.placeBox({ kind: 'house', type: arch.use === 'house' ? 'house' : arch.use, variant: ARCHETYPES.indexOf(arch), x: o.x, y, z: o.z, rot: o.rot, hx: o.depth / 2, hz: o.width / 2, floors, tint: rnd.f(), unit: true, front: !!o.front, row: o.row, archetype: arch.id, spec });
    boxes.push(box); V.units.push(obj); serial++;
    return obj;
  };

  // ---- 1. the two street fronts
  // skyline of the street: a three-storey front never stands next to another one nor opposite one, so the street
  // stays open to the sky all along (and the roof line steps up and down as in an old town)
  const tall = [[], []];
  const tallNear = (side, a, b) => tall[side].some((t) => b > t[0] - 7 && a < t[1] + 7);
  for (const side of [0, 1]) {
    const sg = sgn(side); const ops = openings[side]; let s = span[side].from; let prev = null; let guard = 0;
    while (s < span[side].to - 2 && guard++ < 4000) {
      const inside = ops.find((o) => s >= o.from - 0.05 && s < o.to);
      if (inside) {
        V.closures.push({ side, from: inside.from, to: inside.to, type: inside.kind === 'plaza' ? 'balustrade' : 'raceblocks' });
        s = inside.to; prev = null; continue;
      }
      const next = ops.find((o) => o.from > s); const end = Math.min(span[side].to, next ? next.from : 1e9);
      const room = (end - s) * clamp(1 - kappa(s) * sg * line(side, s), 0.55, 1.6);        // metres of building line left before the next opening
      if (room < 4.3) { V.closures.push({ side, from: s, to: end, type: 'linkwall' }); s = end; prev = null; continue; }
      // occasionally an alley closed by a wall with a gate, or a house set back behind a front garden
      if (prev && room > 14 && rnd.f() < 0.1) { const g = along(side, s, rnd.range(1.4, 2.4)); V.closures.push({ side, from: s, to: s + g, type: 'linkwall' }); s += g; prev = null; continue; }
      const garden = room > 16 && rnd.f() < 0.12;
      const corner = !prev || room < 12;
      const allow3 = !(prev && prev.floors === 3) && !tallNear(1 - side, s, s + 9) && !tallNear(side, s, s + 9);
      const arch = pickArch((a) => a.w[0] <= room && (!garden || a.use === 'house') && (a.id !== 'public' || room > 13) && (allow3 || a.floors.includes(2)));
      let w = rnd.range(arch.w[0], Math.min(arch.w[1], room)); if (room - w < 4.3) w = Math.min(room, arch.w[1] + 2.4);
      const depth = rnd.range(arch.d[0], arch.d[1]); const setback = garden ? rnd.range(2.8, 3.8) : 0.04;
      let placed = null, sc = 0, ds = 0;
      for (let tries = 0; tries < 60 && !placed; tries++) {
        ds = along(side, s, w, setback); sc = s + ds / 2;
        const p = at(sc, sg * (line(side, sc) + setback + depth / 2));
        // right side: +z of the building is the direction of travel; left side: the opposite
        placed = addUnit(arch, { x: p.x, z: p.z, rot: p.heading - sg * Math.PI / 2, width: w, depth, front: true, row: 'main', floors: allow3 ? 0 : 2, attachR: side === 1 ? false : !!prev && !garden, attachL: side === 0 ? false : !!prev && !garden });
        if (!placed) s += 0.2;
      }
      if (!placed) { s += 0.5; prev = null; continue; }
      placed.frontS = sc; placed.garden = garden; placed.sideIndex = side;
      if (placed.floors === 3) tall[side].push([s, s + ds]);
      // party wall towards the previous unit of the row
      if (prev && !garden && !prev.garden) { if (side === 1) prev.spec.attachR = true; else prev.spec.attachL = true; } else { placed.spec.attachL = false; placed.spec.attachR = false; }
      if (garden) V.closures.push({ side, from: s, to: s + ds, type: 'gardenwall', unit: placed.id });
      // the slit left on the outside of a bend between two straight fronts is closed by a short wall
      if (prev && prev.endS !== undefined && s - prev.endS > 0.25) V.closures.push({ side, from: prev.endS, to: s, type: 'linkwall' });
      s += ds; placed.endS = s; prev = placed;
    }
    if (span[side].to - s > 0.3 && !ops.some((o) => s >= o.from && s < o.to)) V.closures.push({ side, from: s, to: span[side].to, type: 'linkwall' });
  }

  /** a row of units along `dir` starting at `p0`; each one faces `face`; steps on when a footprint is taken */
  const row = (p0, dir, face, from, to, opts) => {
    let dist = from, count = 0, misses = 0; const out = [];
    while (dist < to && count < (opts.max || 9) && misses < 8) {
      const arch = opts.first && count === 0 ? opts.first : pickArch(opts.filter); const w = rnd.range(arch.w[0], arch.w[1]), depth = rnd.range(opts.depth[0], opts.depth[1]);
      if (dist + w > to + 0.5) break;
      const cx = p0.x + dir.x * (dist + w / 2) + face.x * -(depth / 2), cz = p0.z + dir.z * (dist + w / 2) + face.z * -(depth / 2);
      const u = addUnit(arch, { x: cx, z: cz, rot: Math.atan2(face.z, face.x), width: w, depth, front: !!opts.front, row: opts.row });
      if (!u) { dist += 1.0; misses++; continue; }
      out.push(u); count++; misses = 0; dist += w + (opts.gap && rnd.f() < 0.25 ? rnd.range(1.2, 2.2) : 0.06);
    }
    return { units: out, end: dist };
  };

  // ---- 2. side streets: houses along both edges, a terminal building closing the view
  for (const st of places.sideStreets || []) {
    const side = st.side === 'L' ? 0 : 1; const sg = sgn(side); const base = at(st.s, 0); const hd = base.heading;
    const fx = Math.cos(hd), fz = Math.sin(hd), rx = Math.cos(hd + Math.PI / 2) * sg, rz = Math.sin(hd + Math.PI / 2) * sg;   // along the track, away from it
    const o = at(st.s, sg * line(side, st.s)); const street = { s: st.s, side: st.side, width: st.width, x: o.x, z: o.z, ax: rx, az: rz, fx, fz, length: 0, units: 0 };
    for (const e of [-1, 1]) {
      // edge line of the street on side e; houses stand behind it and face the street
      const p0 = { x: o.x + fx * e * (st.width / 2 + 0.05), z: o.z + fz * e * (st.width / 2 + 0.05) };
      const r = row(p0, { x: rx, z: rz }, { x: -fx * e, z: -fz * e }, 9.0, 31, { filter: (a) => a.id !== 'public' && a.id !== 'cafe', depth: [7, 8.6], row: 'street', gap: true, max: 3 });
      for (const u of r.units) { u.street = st.s; street.units++; }
      street.length = Math.max(street.length, r.end);
    }
    // terminal building facing back down the street
    { const arch = pickArch((a) => a.use === 'house' && a.id !== 'fisher'); const w = Math.max(st.width + 2.5, rnd.range(arch.w[0], arch.w[1])), depth = 7.2; const dist = Math.min(street.length + 1.5, 30.5);
      const u = addUnit(arch, { x: o.x + rx * (dist + depth / 2), z: o.z + rz * (dist + depth / 2), rot: Math.atan2(-rz, -rx), width: w, depth, front: false, row: 'street-end' }); if (u) { street.units++; u.street = st.s; } street.length = dist; }
    V.streets.push(street);
    P.reserve({ x: o.x + rx * street.length / 2, z: o.z + rz * street.length / 2, rot: Math.atan2(rz, rx), hx: street.length / 2, hz: st.width / 2, rad: street.length / 2 + st.width });
  }

  // ---- 3. church square
  if (pz) {
    const side = pz.side === 'L' ? 0 : 1; const sg = sgn(side); const c0 = at(pz.s, 0); const hd = c0.heading;
    const fx = Math.cos(hd), fz = Math.sin(hd), rx = Math.cos(hd + Math.PI / 2) * sg, rz = Math.sin(hd + Math.PI / 2) * sg;
    const o = at(pz.s, sg * line(side, pz.s));               // middle of the square's street edge
    const ch = places.church; const churchClear = ch ? Math.abs(ch.d) - half(pz.s) : 28;
    const frontDist = churchClear - line(side, pz.s) + half(pz.s) - 8.5;       // from the building line to the church front
    const plaza = V.plaza = { s: pz.s, side: pz.side, x: o.x, z: o.z, ax: rx, az: rz, fx, fz, length: pz.length, depth: frontDist, rot: Math.atan2(rz, rx) };
    // church: nave 9.6 m wide, 17 m deep, tower on its left shoulder
    if (ch) {
      const cx = o.x + rx * (frontDist + 8.5), cz = o.z + rz * (frontDist + 8.5); const y = terrain.heightAt(cx, cz);
      const obj = P.placeBox({ kind: 'house', type: 'church', variant: 100, x: cx, y, z: cz, rot: Math.atan2(-rz, -rx), hx: 8.5, hz: 9.6, floors: 3, tint: 0.5, unit: true, front: true, row: 'plaza', archetype: 'church', landmark: true,
        spec: { use: 'church', wall: 0xead9ae, trim: 0xf4eedf, wallMat: 'plasterochre', roofMat: 'rooftile', seed: 4242, naveW: 9.6, naveD: 17, naveH: 8.2, towerW: 4.6, towerH: 21.5, towerSide: 1 } });
      boxes.push({ x: cx, z: cz, rot: obj.rot, hx: 8.5, hz: 9.6 }); V.units.push(obj); V.church = obj;
    }
    // back row on both sides of the church, facing the street across the square
    const cafe = ARCHETYPES.find((a) => a.id === 'cafe');
    for (const e of [-1, 1]) {
      const p0 = { x: o.x + rx * frontDist, z: o.z + rz * frontDist };
      const r = row(p0, { x: fx * e, z: fz * e }, { x: -rx, z: -rz }, 9.9, pz.length / 2 + 7, { filter: (a) => a.id !== 'public', first: e === 1 ? cafe : null, depth: [7.5, 9], row: 'plaza', front: true, max: 3 });
      if (e === 1 && r.units[0] && r.units[0].archetype === 'cafe') plaza.cafe = r.units[0];
    }
    // the two short sides: houses facing the square
    for (const e of [-1, 1]) {
      const p0 = { x: o.x + fx * e * (pz.length / 2 + 0.3), z: o.z + fz * e * (pz.length / 2 + 0.3) };
      row(p0, { x: rx, z: rz }, { x: -fx * e, z: -fz * e }, 1.0, frontDist - 0.4, { filter: (a) => a.id !== 'public' && a.id !== 'cafe', depth: [7, 8.5], row: 'plaza-side', max: 2 });
    }
    P.reserve({ x: o.x + rx * frontDist / 2, z: o.z + rz * frontDist / 2, rot: plaza.rot, hx: frontDist / 2, hz: pz.length / 2, rad: Math.hypot(frontDist, pz.length) / 2 + 1 });
  }
  // ---- 4. life: square, side streets and front gardens are furnished (everything stands beyond the building line)
  const inBox = (x, z, r) => { for (const b of boxes) { const dx = x - b.x, dz = z - b.z, c = Math.cos(b.rot), sn = Math.sin(b.rot); if (Math.abs(dx * c + dz * sn) < b.hx + r && Math.abs(-dx * sn + dz * c) < b.hz + r) return true; } return false; };
  const put = (o) => (inBox(o.x, o.z, (o.r ?? 0.3) * 0.8) ? null : P.place({ noReserve: true, minY: 2, ...o }));
  if (V.plaza) {
    const z = V.plaza; const W = (a, b) => ({ x: z.x + z.ax * a + z.fx * b, z: z.z + z.az * a + z.fz * b });      // a: away from the street, b: along it
    const face = (dx, dz) => Math.atan2(dz, dx);
    const cA = z.depth * 0.5;
    put({ kind: 'prop', type: 'fountain', ...W(cA, 0), r: 2.4, rot: 0 });
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.52; const p = W(cA + Math.cos(a) * 4.6, Math.sin(a) * 4.6); const c = W(cA, 0); put({ kind: 'prop', type: 'bench', ...p, r: 0.9, rot: face(c.x - p.x, c.z - p.z) }); }
    for (const [a, b, type] of [[cA - 3.5, -15, 'oak'], [cA + 3.5, -15, 'olive'], [cA - 3.5, 15, 'olive'], [cA + 3.5, 15, 'oak'], [cA + 5, -24, 'cypress'], [cA + 5, 24, 'cypress']]) put({ kind: 'tree', type, variant: rnd.int(0, 2), ...W(a, b), r: 0.5, rot: rnd.range(0, 6.28), scale: rnd.range(0.75, 0.95), tint: rnd.f() });
    for (const [a, b] of [[1.6, -22], [1.6, -7.5], [1.6, 7.5], [1.6, 22], [z.depth - 1.6, -20], [z.depth - 1.6, 20]]) put({ kind: 'prop', type: 'lamp', ...W(a, b), r: 0.28, rot: face(z.ax, z.az) + (a < 5 ? 0 : Math.PI) });
    for (let k = -4; k <= 4; k++) if (k !== 0) put({ kind: 'prop', type: 'planter', variant: 1, ...W(1.1, k * 6.2), r: 0.5, rot: rnd.range(0, 6.28) });
    for (const b of [-3.6, 3.6]) put({ kind: 'prop', type: 'planter', variant: 2, ...W(z.depth - 1.4, b), r: 0.72, rot: 0 });
    for (const b of [-26, 26]) put({ kind: 'prop', type: 'bin', ...W(3.4, b), r: 0.3, rot: 0 });
    for (const [a, b, v] of [[5.2, -9.5, 0], [5.2, 10.5, 1], [10.5, -22, 2]]) put({ kind: 'prop', type: 'stall', variant: v, ...W(a, b), r: 1.5, rot: face(-z.ax, -z.az) + rnd.range(-0.2, 0.2) });
    if (z.cafe) { const u = z.cafe; const fxu = Math.cos(u.rot), fzu = Math.sin(u.rot);
      for (let k = 0; k < 6; k++) { const a = u.hx + 1.6 + (k % 2) * 2.1, b = (Math.floor(k / 2) - 1) * 2.6 + rnd.range(-0.3, 0.3); put({ kind: 'prop', type: 'cafetable', variant: k % 2, x: u.x + fxu * a - fzu * b, z: u.z + fzu * a + fxu * b, r: 0.8, rot: rnd.range(0, 6.28), spacing: 0.2 }); }
      for (const b of [-2.6, 2.6]) put({ kind: 'prop', type: 'parasol', variant: rnd.int(0, 3), x: u.x + fxu * (u.hx + 2.7) - fzu * b, z: u.z + fzu * (u.hx + 2.7) + fxu * b, r: 0.2, rot: 0 }); }
  }
  for (const st of V.streets) {
    const W = (a, b) => ({ x: st.x + st.ax * a + st.fx * b, z: st.z + st.az * a + st.fz * b }); const hw = st.width / 2; const dirA = Math.atan2(st.az, st.ax);
    put({ kind: 'prop', type: 'lamp', ...W(5.5, -hw + 0.35), r: 0.25, rot: dirA + Math.PI / 2 });
    put({ kind: 'prop', type: 'lamp', ...W(19, hw - 0.35), r: 0.25, rot: dirA - Math.PI / 2 });
    for (const [a, e] of [[3.2, -1], [7.5, 1], [12.5, -1], [16.5, 1], [22, -1]]) put({ kind: 'prop', type: 'planter', variant: 1, ...W(a + rnd.range(-0.6, 0.6), e * (hw - 0.45)), r: 0.42, rot: rnd.range(0, 6.28) });
    put({ kind: 'prop', type: rnd.f() < 0.5 ? 'barrel' : 'crate', variant: rnd.int(0, 3), ...W(9.5, hw - 0.6), r: 0.6, rot: rnd.range(0, 6.28) });
    put({ kind: 'prop', type: 'crate', variant: rnd.int(0, 1), ...W(14.5, -hw + 0.6), r: 0.6, rot: rnd.range(0, 6.28) });
    put({ kind: 'prop', type: 'bench', ...W(11, -hw + 0.45), r: 0.5, rot: dirA + Math.PI / 2, spacing: 0 });
    put({ kind: 'prop', type: 'bin', ...W(4.2, hw - 0.4), r: 0.28, rot: 0 });
    for (const a of [6.5, 15, 24]) put({ kind: 'prop', type: 'clothesline', variant: rnd.int(0, 2), ...W(a + rnd.range(-1, 1), 0), r: 0.1, rot: dirA, spacing: 0 });
    put({ kind: 'prop', type: 'woodsign', variant: rnd.int(0, 5), ...W(2.2, -hw + 0.4), r: 0.3, rot: dirA + Math.PI });
  }
  for (const u of V.units) {
    if (!u.garden) continue;
    // front garden between the low wall on the building line and the set-back facade
    const fxu = Math.cos(u.rot), fzu = Math.sin(u.rot); const G = (a, b) => ({ x: u.x + fxu * (u.hx + a) - fzu * b, z: u.z + fzu * (u.hx + a) + fxu * b });
    put({ kind: 'prop', type: 'planter', variant: 1, ...G(0.7, -1.0), r: 0.4, rot: rnd.range(0, 6.28) });
    put({ kind: 'prop', type: 'planter', variant: 1, ...G(0.7, 1.0), r: 0.4, rot: rnd.range(0, 6.28) });
    put({ kind: 'shrub', type: rnd.pick(['oleander', 'rosemary', 'broom']), variant: rnd.int(0, 2), ...G(1.9, u.hz - 1.3), r: 0.6, rot: rnd.range(0, 6.28), scale: rnd.range(0.7, 1.0), tint: rnd.f() });
    put({ kind: 'tree', type: rnd.pick(['cypress', 'olive']), variant: rnd.int(0, 2), ...G(1.8, -u.hz + 1.4), r: 0.45, rot: rnd.range(0, 6.28), scale: rnd.range(0.55, 0.75), tint: rnd.f() });
    put({ kind: 'prop', type: 'bench', ...G(0.5, 0), r: 0.5, rot: u.rot, spacing: 0 });
  }
  V.stats = { units: V.units.length, front: V.units.filter((u) => u.front).length, archetypes: [...new Set(V.units.map((u) => u.archetype))].length };
}

export { obbOverlap };
