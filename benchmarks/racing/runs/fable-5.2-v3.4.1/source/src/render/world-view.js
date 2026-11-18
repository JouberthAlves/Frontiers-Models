// Everything that stands on the terrain: instanced rocks, plants and props (world.objects),
// barriers, buildings and the start gantry. Nothing is placed here: positions come from the
// deterministic world generator; this module only turns them into meshes.

import * as THREE from 'three';
import { Geo } from './geo.js';
import { Scatter } from './scatter.js';
import { Plants } from './plants.js';
import { SceneMaterials, buildRockGeometry } from './scene-materials.js';
import { PROP_BUILDERS } from './props.js';
import { BarriersView } from './barriers-view.js';
import { emitBuilding } from './houses.js';
import { buildBridge } from './bridge.js';
import { LAYER_DETAIL } from './probe.js';
import { proxyMesh, mergeForShadow, castsShadow } from './shadow-proxy.js';

const BUILDING_CELL = 200;

export class WorldView {
  constructor(world, materials, env) {
    this.world = world; this.M = materials; this.env = env;
    this.SM = new SceneMaterials(materials, env); this.plants = new Plants(materials, env);
    this.scatter = new Scatter();
    this.group = new THREE.Group(); this.group.name = 'world';
    this.detail = [];          // {mesh, x, z, max}: small parts hidden in the distance
    this.startLights = [];     // materials of the five start lamps
    this.stats = { buildings: 0, buildingTris: 0 };
  }
  static textureSets() { return [...new Set([...SceneMaterials.textureSets(), ...Plants.textureSets()])]; }

  material(key) {
    if (key.startsWith('leaf:')) return this.plants.foliageMaterial(key.slice(5));
    if (key.startsWith('bark:')) return this.plants.barkMaterial(key.slice(5));
    return this.SM.get(key);
  }
  /** BufferGeometry of a Geo for a given material (vertex-colour materials always get a colour attribute) */
  geometry(geo, mat) { if (mat.vertexColors && !geo.col) geo.color(1, 1, 1); return geo.build(); }

  build() {
    const world = this.world, sc = this.scatter, objs = world.objects;
    // ---- rocks: 5 shapes x 3 levels of detail, triplanar rock material
    const rockMat = this.SM.get('rock');
    for (let v = 0; v < 5; v++) {
      const rg = (d) => ({ geometry: buildRockGeometry(11 + v * 7, d), material: rockMat });
      sc.addPrototype('rock_' + v, { lods: [{ parts: [rg(3)], max: 70 }, { parts: [rg(2)], max: 150 }, { parts: [{ geometry: buildRockGeometry(11 + v * 7, 1), material: this.SM.get('rockfar') }], merge: 'rock', band: 0 }], category: 'rock', shadowLod: 2 });
    }
    // pebbles: low-poly stones merged per cell, only drawn close to the camera
    for (let v = 0; v < 5; v++) sc.addPrototype('pebble_' + v, { lods: [{ parts: [{ geometry: buildRockGeometry(40 + v * 5, 1), material: this.SM.get('rockfar') }], merge: 'pebble', band: 0 }], category: 'ground' });
    // ---- plants and props that the world actually uses
    const usedPlants = new Set(), usedProps = new Set();
    for (const o of objs) { if (o.kind === 'tree' || o.kind === 'shrub' || o.kind === 'ground') usedPlants.add(o.type); else if (o.kind === 'prop') usedProps.add(o.type); }
    for (const t of usedPlants) this.plants.register(sc, t);
    for (const t of usedProps) {
      const b = PROP_BUILDERS[t]; if (!b) continue;
      for (let v = 0; v < b.variants; v++) {
        const parts = b.build(v).filter((p) => p.geo.vertexCount).map((p) => { const mat = this.material(p.mat); return { geometry: this.geometry(p.geo, mat), material: mat, castShadow: !mat.userData.emissive }; });
        // merged per cell; tall or large props stay visible in the far band
        sc.addPrototype(`${t}_${v}`, { lods: [{ parts, merge: 'prop', band: 0 }, b.max[1] >= 500 ? { parts, merge: 'prop', band: 1 } : null], category: 'prop' });
      }
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), tilt = new THREE.Quaternion(), axis = new THREE.Vector3(), pos = new THREE.Vector3(), scl = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
    for (const o of objs) {
      let name = null, color = null;
      if (o.kind === 'rock') { name = (o.type === 'pebble' ? 'pebble_' : 'rock_') + (o.variant % 5); const k = 0.8 + 0.3 * o.tint; color = new THREE.Color(k, k * 0.985, k * 0.96); }
      else if (o.kind === 'tree' || o.kind === 'shrub' || o.kind === 'ground') { name = `${o.type}_${o.variant % 3}`; color = this.plants.tint(o.type, o.tint); }
      else if (o.kind === 'prop' && PROP_BUILDERS[o.type]) name = `${o.type}_${o.variant % PROP_BUILDERS[o.type].variants}`;
      if (!name) continue;
      q.setFromAxisAngle(Y, -o.rot); pos.set(o.x, o.y, o.z); scl.setScalar(o.scale || 1);
      if (o.sy) scl.y *= o.sy;
      if (o.kind === 'rock') {
        // every stone lies differently: tilted and squashed by its own seed
        const h1 = (o.id * 0.6180339) % 1, h2 = (o.id * 0.3819660 + 0.37) % 1, h3 = (o.id * 0.7548777 + 0.11) % 1;
        tilt.setFromAxisAngle(axis.set(Math.cos(h1 * 6.283), 0, Math.sin(h1 * 6.283)), (h2 - 0.5) * 0.9); q.premultiply(tilt);
        scl.set(o.scale * (0.85 + 0.35 * h3), o.scale * (0.62 + 0.5 * h2), o.scale * (0.85 + 0.35 * h1));
      }
      sc.add(name, m.compose(pos, q, scl), color);
    }
    // ---- barriers (tyre stacks are instanced through the same scatter)
    this.barriers = new BarriersView(world, this.SM);
    this.group.add(this.barriers.build(sc));
    this.group.add(sc.build());
    this._buildings();
    this._gantry();
    this.bridge = buildBridge(world, this.SM); if (this.bridge) this.group.add(this.bridge);
    this._lighthouse();
    return this.group;
  }

  // ------------------------------------------------------------------------------------------ buildings
  _buildings() {
    const houses = this.world.objects.filter((o) => o.kind === 'house' && o.spec); if (!houses.length) return;
    const cells = new Map();
    for (const h of houses) { const key = `${Math.floor(h.x / BUILDING_CELL)},${Math.floor(h.z / BUILDING_CELL)}`; (cells.get(key) || cells.set(key, []).get(key)).push(h); }
    for (const list of cells.values()) {
      const acc = new Map(); let cx = 0, cz = 0;
      for (const h of list) {
        const res = emitBuilding({ ...h.spec, x: h.x, y: h.y, z: h.z, rot: h.rot, hx: h.hx, hz: h.hz }, acc); cx += h.x; cz += h.z; this.stats.buildings++;
        // what each unit is made of (read by the scene audit)
        let t = 0; const mats = new Set(); for (const map of [res.parts.base, res.parts.detail]) for (const [mat, g] of map) if (g.vertexCount) { t += g.triangleCount; mats.add(mat); }
        (this.stats.units || (this.stats.units = [])).push({ id: h.id, type: h.type, archetype: h.archetype || h.type, floors: h.floors, triangles: Math.round(t), materials: mats.size, footprint: [+(h.hz * 2).toFixed(1), +(h.hx * 2).toFixed(1)] });
      }
      cx /= list.length; cz /= list.length;
      for (const [key, g] of acc) {
        if (!g.vertexCount) continue;
        const [tier, matKey] = key.split('|'); const mat = this.material(matKey);
        const mesh = new THREE.Mesh(this.geometry(g, mat), mat); mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
        mesh.name = `building_${tier}_${matKey}`; mesh.userData.kind = 'building'; this.stats.buildingTris += g.triangleCount;
        mesh.castShadow = false;
        if (tier === 'detail') { mesh.layers.set(LAYER_DETAIL); this.detail.push({ mesh, x: cx, z: cz, max: 170 }); }
        this.group.add(mesh);
      }
      // one shadow caster for the whole block (walls, roofs, balconies, awnings)
      const src = [...acc].filter(([key, g]) => g.vertexCount && key.startsWith('base|') && !key.includes('windowglass')).map(([, g]) => ({ position: g.p, index: g.idx }));
      if (src.length) { const px = proxyMesh(mergeForShadow(src)); px.updateMatrixWorld(true); this.group.add(px); }
    }
  }

  // ------------------------------------------------------------------------------------------ start gantry
  _gantry() {
    const posts = this.world.objects.filter((o) => o.type === 'gantrypost').sort((a, b) => a.d - b.d); if (posts.length < 2) return;
    const [a, b] = posts; const span = Math.hypot(b.x - a.x, b.z - a.z);
    const Lx = (b.x - a.x) / span, Lz = (b.z - a.z) / span;
    const y0 = Math.min(a.y, b.y), yTop = Math.max(a.y, b.y) + 6.7, yBeam = yTop - 0.5;
    const truss = new Geo(), dark = new Geo(), banner = new Geo();
    const ang = Math.atan2(-Lz, Lx);      // local +x: from the left post to the right post; local +z: towards the grid
    for (const g of [truss, dark, banner]) g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2).rotateY(ang);
    const X = [1, 0, 0], Yv = [0, 1, 0], Z = [0, 0, 1], hs = span / 2;
    const box = (g, p0, p1, A, B, hw, hd, nseg, rc = 0.04, rl = 0.021) => {
      const at = (t, sa, sb) => [p0[0] + (p1[0] - p0[0]) * t + A[0] * hw * sa + B[0] * hd * sb, p0[1] + (p1[1] - p0[1]) * t + A[1] * hw * sa + B[1] * hd * sb, p0[2] + (p1[2] - p0[2]) * t + A[2] * hw * sa + B[2] * hd * sb];
      for (const [sa, sb] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) g.tube([at(0, sa, sb), at(1, sa, sb)], rc, 6, 1, true);
      const faces = [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]];
      for (const [c0, c1] of faces) for (let k = 0; k < nseg; k++) {
        const t0 = k / nseg, t1 = (k + 1) / nseg; const p = k % 2 ? c0 : c1, r = k % 2 ? c1 : c0;
        g.tube([at(t0, p[0], p[1]), at(t1, r[0], r[1])], rl, 4, 1, false);
        g.tube([at(t1, c0[0], c0[1]), at(t1, c1[0], c1[1])], rl, 4, 1, false);
      }
    };
    truss.color(1, 1, 1);
    for (const sx of [-1, 1]) {
      const yb = (sx < 0 ? a.y : b.y);
      box(truss, [sx * hs, yb - 0.4, 0], [sx * hs, yTop, 0], X, Z, 0.3, 0.3, 12);
      dark.box(sx * hs, yb + 0.06, 0, 0.5, 0.1, 0.5);     // base plate
    }
    box(truss, [-hs - 0.3, yBeam, 0], [hs + 0.3, yBeam, 0], Yv, Z, 0.45, 0.3, Math.round(span / 0.62));
    // banner boards on both faces of the beam
    const bw = hs - 0.55, by0 = yBeam - 0.52, by1 = yBeam + 0.52;
    banner.quadUV([-bw, by0, 0.34], [bw, by0, 0.34], [bw, by1, 0.34], [-bw, by1, 0.34], [0, 0, 1, 1]);
    banner.quadUV([bw, by0, -0.34], [-bw, by0, -0.34], [-bw, by1, -0.34], [bw, by1, -0.34], [0, 0, 1, 1]);
    // start lights: a black housing hung under the beam, five lamps facing the grid
    const ly = yBeam - 1.02;
    dark.box(0, ly, 0.0, 1.45, 0.24, 0.09);
    dark.cyl(-1.1, ly + 0.24, 0, 0.025, 0.025, yBeam - 0.45, 5, 1, false).cyl(1.1, ly + 0.24, 0, 0.025, 0.025, yBeam - 0.45, 5, 1, false);
    const add = (geo, mat, name, cast = true) => { const mesh = new THREE.Mesh(this.geometry(geo, mat), mat); if (cast) castsShadow(mesh); mesh.receiveShadow = true; mesh.matrixAutoUpdate = false; mesh.name = name; mesh.userData.kind = 'structure'; this.group.add(mesh); return mesh; };
    add(truss, this.SM.get('galv'), 'gantry_truss');
    add(dark, this.SM.get('blackmetal'), 'gantry_dark');
    add(banner, this.SM.get('banner'), 'gantry_banner');
    for (let k = 0; k < 5; k++) {
      const g = new Geo(); g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2).rotateY(ang);
      const cx = (k - 2) * 0.56; const base = g.vertexCount;
      g.vert(cx, ly, 0.095, 0, 0, 1, 0.5, 0.5);
      for (let s = 0; s <= 16; s++) { const t = s / 16 * Math.PI * 2; g.vert(cx + Math.cos(t) * 0.19, ly + Math.sin(t) * 0.19, 0.095, 0, 0, 1, 0.5 + Math.cos(t) * 0.5, 0.5 + Math.sin(t) * 0.5); }
      for (let s = 0; s < 16; s++) g.tri(base, base + s + 1, base + s + 2);
      const mat = this.M.patch(new THREE.MeshStandardMaterial({ color: 0x1a0606, emissive: new THREE.Color(1.0, 0.06, 0.02), emissiveIntensity: 0, roughness: 0.3, metalness: 0 }), { key: 'emissive' });
      mat.userData.emissive = true; mat.name = 'start_lamp'; this.startLights.push(mat);
      add(g, mat, 'start_light_' + k, false);
    }
  }

  // ------------------------------------------------------------------------------------------ lighthouse
  _lighthouse() {
    const o = this.world.lists.lighthouse; if (!o) return;
    const wall = new Geo(), iron = new Geo(), glass = new Geo(), cap = new Geo(), stone = new Geo();
    for (const g of [wall, iron, glass, cap, stone]) g.translate(o.x, o.y, o.z).rotateY(-o.rot);
    const H = 21;      // height of the gallery floor
    stone.color(1, 1, 1); stone.lathe(0, 0, [[3.2, -1.5], [3.2, 0.9], [3.05, 1.0], [2.9, 1.0]], 20);
    // tapering tower, white with two red bands
    const bands = [[0.9, 0.93], [5.2, 0.93], [5.2, 0.72], [8.4, 0.72], [8.4, 0.93], [13.4, 0.93], [13.4, 0.72], [16.6, 0.72], [16.6, 0.93], [H, 0.93]];
    const rad = (y) => 2.9 - 1.15 * Math.pow(y / H, 0.9);
    for (let k = 0; k < bands.length - 1; k += 2) {
      const [y0, c] = bands[k], y1 = bands[k + 1][0]; if (c > 0.8) wall.color(0.93, 0.92, 0.88); else wall.color(0.74, 0.16, 0.12);
      const prof = []; for (let j = 0; j <= 4; j++) { const y = y0 + (y1 - y0) * j / 4; prof.push([rad(y), y]); } wall.lathe(0, 0, prof, 22);
    }
    // door and small windows up the shaft (dark insets)
    const dark = new Geo(); dark.translate(o.x, o.y, o.z).rotateY(-o.rot);
    dark.box(rad(2.0) - 0.02, 2.0, 0, 0.06, 1.05, 0.55);
    for (const [y, a] of [[6.6, 0.6], [10.8, -0.9], [15.0, 0.3]]) dark.push().rotateY(a).box(rad(y) - 0.03, y, 0, 0.06, 0.45, 0.24).pop();
    // gallery: corbelled deck and railing
    stone.lathe(0, 0, [[rad(H), H - 0.5], [2.75, H - 0.1], [2.75, H + 0.12], [1.5, H + 0.12]], 22);
    iron.color(1, 1, 1); const ring = (r, y, t) => { const pts = []; for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; pts.push([Math.cos(a) * r, y, Math.sin(a) * r]); } iron.tube(pts, t, 5, 1, false); };
    ring(2.65, H + 1.1, 0.03); ring(2.65, H + 0.62, 0.018);
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; iron.cyl(Math.cos(a) * 2.65, H + 0.12, Math.sin(a) * 2.65, 0.02, 0.02, H + 1.12, 4, 1, false); }
    // lantern room: glazed drum with mullions, lamp inside, domed copper roof with a ball
    wall.color(0.93, 0.92, 0.88); wall.lathe(0, 0, [[1.55, H + 0.12], [1.55, H + 0.95], [1.45, H + 0.95]], 18);
    glass.lathe(0, 0, [[1.42, H + 0.95], [1.42, H + 3.1]], 18);
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; iron.cyl(Math.cos(a) * 1.45, H + 0.95, Math.sin(a) * 1.45, 0.035, 0.035, H + 3.1, 4, 1, false); }
    cap.color(0.25, 0.42, 0.36); cap.lathe(0, 0, [[1.75, H + 3.05], [1.7, H + 3.25], [1.3, H + 3.9], [0.7, H + 4.4], [0.18, H + 4.6], [0.16, H + 4.95], [0.26, H + 5.1], [0.001, H + 5.3]], 18);
    const lamp = new Geo(); lamp.translate(o.x, o.y, o.z); lamp.cyl(0, H + 1.3, 0, 0.55, 0.55, H + 2.7, 10);
    const add = (g, key, cast = true) => { const mat = this.SM.get(key); const m = new THREE.Mesh(this.geometry(g, mat), mat); if (cast) castsShadow(m); m.receiveShadow = true; m.matrixAutoUpdate = false; m.name = 'lighthouse_' + key; m.userData.kind = 'building'; this.group.add(m); };
    add(wall, 'plaster2'); add(stone, 'stoneblock'); add(iron, 'iron', false); add(glass, 'windowglass', false); add(cap, 'paintmetal'); add(dark, 'blackmetal', false); add(lamp, 'lampglass', false);
  }

  /** lamps of the start gantry: n = how many are lit (0..5) */
  setStartLights(n) { this.startLights.forEach((m, k) => { m.emissiveIntensity = k < n ? 7 : 0; }); }

  update(camera, quality) {
    this.scatter.update(camera, quality);
    const px = camera.position.x, pz = camera.position.z;
    const det = this.detail, kd = quality.propDistance, pad = BUILDING_CELL * 0.7;
    for (let i = 0; i < det.length; i++) { const d = det[i]; const dx = px - d.x, dz = pz - d.z, r = d.max * kd + pad; d.mesh.visible = dx * dx + dz * dz < r * r; }
  }
}
