// Scene audit read from the loaded game at run time (section 13.1, test 8 of the brief): what is
// reported here is measured on the scene graph and on the objects that built it, not declared.
// Used by `npm run verify`, which writes the result to verification/scene-stats.json.

import * as THREE from 'three';
import { auditWorld } from '../world/audit.js';
import { LAYER_SHADOW, LAYER_MASK } from '../render/gfx.js';

const MIN_CAR_TRIS = 15000, MIN_CAR_MATERIALS = 6, MIN_TEX = 1024, MIN_TEX_ASPHALT = 2048;
const tris = (g) => (g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0));
const r2 = (v) => Math.round(v * 100) / 100;

function sizeOf(geometry, matrix = null) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const b = geometry.boundingBox.clone(); if (matrix) b.applyMatrix4(matrix);
  const s = b.getSize(new THREE.Vector3()); return [r2(s.x), r2(s.y), r2(s.z)];
}
/** a primitive that reads as a box: very few triangles and large in at least two axes, or large in volume */
function boxLike(triangles, size, type) {
  if (!(triangles <= 12 || type === 'BoxGeometry')) return false;
  const big = size.filter((v) => v > 1.0).length; return big >= 2 || size[0] * size[1] * size[2] > 1.0;
}

export function sceneAudit(game) {
  const out = { source: 'runtime scene graph and the objects that built it', failures: [] };
  const fail = (m) => out.failures.push(m);
  const shadowOnly = new THREE.Layers(); shadowOnly.set(LAYER_SHADOW); shadowOnly.enable(LAYER_MASK);
  const visibleMesh = (o) => (o.isMesh || o.isInstancedMesh) && !o.userData.noAudit && !(o.layers.mask & ~shadowOnly.mask ? false : true);

  // ---------------------------------------------------------------- cars
  out.cars = [];
  const bySpec = new Map(); for (const car of game.cars) if (!bySpec.has(car.specId)) bySpec.set(car.specId, car);
  for (const [spec, car] of bySpec) {
    const v = car.visual; const mats = new Set(); let body = 0, wheels = 0, detail = 0; const groups = {};
    for (const m of v.lods[0].children) { const t = tris(m.geometry); body += t; groups[m.name.replace(/_lod\d$/, '')] = t; mats.add(m.material.name || m.material.type); }
    for (const w of v.wheels) w.hub.traverse((m) => { if (m.isMesh) { wheels += tris(m.geometry); mats.add(m.material.name || m.material.type); } });
    v.detail.traverse((m) => { if (m.isMesh) { detail += tris(m.geometry); mats.add(m.material.name || m.material.type); } });
    const total = body + wheels + detail;
    const rec = { model: spec, name: car.vehicle.spec.name, trianglesLod0: Math.round(total), bodyTriangles: Math.round(body), wheelTriangles: Math.round(wheels), detailTriangles: Math.round(detail),
      lodBodyTriangles: v.lods.map((g) => Math.round(g.children.reduce((a, m) => a + tris(m.geometry), 0))), bodyGroups: groups, meshesLod0: v.lods[0].children.length + v.wheels.length * 4 + v.detail.children.length,
      materials: [...mats].sort(), materialCount: mats.size, size: [car.vehicle.spec.length, car.vehicle.spec.height, car.vehicle.spec.width] };
    rec.pass = rec.trianglesLod0 >= MIN_CAR_TRIS && rec.materialCount >= MIN_CAR_MATERIALS && rec.meshesLod0 > 1;
    if (!rec.pass) fail(`car ${spec}: ${rec.trianglesLod0} triangles at LOD0, ${rec.materialCount} materials`);
    out.cars.push(rec);
  }
  if (out.cars.length < 2) fail('fewer than two car models in the scene');

  // ---------------------------------------------------------------- box detector
  // The scene is drawn in batches (one mesh per material and cell holds parts of many objects), so a mesh is not
  // an object. Objects are judged whole: cars and free-standing structures by the meshes that make them up,
  // scattered objects by their prototype, buildings by the parts each unit was built from.
  const box = out.boxDetector = { rule: 'an object with <= 12 triangles (or a BoxGeometry) that is larger than 1 m in two axes or 1 m³ in volume', objects: [], batches: [], prototypes: [], buildings: null, flagged: [] };
  const BATCHED = new Set(['terrain', 'road', 'kerb', 'barrier', 'tree', 'rock', 'prop', 'shrub', 'ground', 'pebble']);
  const objs = new Map(), batches = new Map();
  game.scene.traverse((o) => {
    if (!visibleMesh(o) || o.name === 'sky' || o.userData.kind === 'water') return;
    const t = tris(o.geometry) * (o.isInstancedMesh ? 1 : 1);
    let key = null; for (let p = o; p; p = p.parent) if (p.userData && p.userData.kind === 'car') { key = p.name; break; }
    if (!key) {
      const kind = o.userData.kind || '';
      if (BATCHED.has(kind) || o.name.startsWith('building_') || o.name.startsWith('merged_')) {
        const k = o.name.replace(/[0-9]+$/, '').replace(/_lod$/, ''); const e = batches.get(k) || batches.set(k, { name: k, kind, meshes: 0, triangles: 0 }).get(k); e.meshes++; e.triangles += Math.round(t); return;
      }
      key = o.name.split('_')[0] || o.name;                                 // gantry_*, lighthouse_*, bridge_*, start_light_* ...
      if (key === 'start') key = 'gantry';
    }
    const bb = new THREE.Box3(); if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);
    const e = objs.get(key) || objs.set(key, { name: key, meshes: 0, triangles: 0, box: new THREE.Box3(), types: new Set() }).get(key);
    e.meshes++; e.triangles += t; e.box.union(bb); e.types.add(o.geometry.type);
  });
  for (const e of objs.values()) {
    const sz = e.box.getSize(new THREE.Vector3()); const size = [r2(sz.x), r2(sz.y), r2(sz.z)];
    const rec = { name: e.name, meshes: e.meshes, triangles: Math.round(e.triangles), size, boxLike: boxLike(e.triangles, size, e.meshes === 1 ? [...e.types][0] : '') };
    box.objects.push(rec);
    if (rec.boxLike) { box.flagged.push(rec); fail(`box-like object in the scene: ${e.name} (${rec.triangles} triangles, ${size.join(' x ')} m)`); }
  }
  box.batches = [...batches.values()].sort((x, y) => y.triangles - x.triangles);
  // objects that are instanced or baked into cells: judged by their prototype (level of detail 0)
  const scatter = game.worldView.scatter;
  for (const proto of scatter.protos.values()) {
    if (!proto.instances.length) continue; const lod = proto.lods.find((l) => l); if (!lod) continue;
    let t = 0; const bb = new THREE.Box3();
    for (const part of lod.parts) { t += tris(part.geometry); if (!part.geometry.boundingBox) part.geometry.computeBoundingBox(); bb.union(part.geometry.boundingBox); }
    const s = bb.getSize(new THREE.Vector3()); const size = [r2(s.x), r2(s.y), r2(s.z)];
    const rec = { name: proto.name, category: proto.category, instances: proto.instances.length, triangles: Math.round(t), parts: lod.parts.length, size, boxLike: boxLike(t, size, '') };
    box.prototypes.push(rec);
    if (rec.boxLike) { box.flagged.push(rec); fail(`box-like object prototype: ${proto.name} (${rec.triangles} triangles, ${size.join(' x ')} m)`); }
  }
  // buildings: every architectural unit is built from parts (walls with recessed openings, frames, shutters, roof...)
  const units = game.worldView.stats.units || [];
  if (units.length) {
    const t = units.map((u) => u.triangles), m = units.map((u) => u.materials);
    box.buildings = { units: units.length, trianglesMin: Math.min(...t), trianglesMean: Math.round(t.reduce((a, b) => a + b, 0) / t.length), trianglesMax: Math.max(...t), materialsMin: Math.min(...m), materialsMax: Math.max(...m),
      simplest: units.slice().sort((a, b) => a.triangles - b.triangles).slice(0, 3) };
    for (const u of units) if (u.triangles <= 12 || u.materials < 3) { box.flagged.push(u); fail(`building ${u.id} is a primitive (${u.triangles} triangles, ${u.materials} materials)`); }
  } else fail('no building statistics');
  box.pass = box.flagged.length === 0;

  // ---------------------------------------------------------------- flat colour detector + texture resolution
  const flat = out.flatColour = { rule: 'a visible surface material near the track without albedo map and without normal map (glass, emissive lamps and water excepted)', materials: [], flagged: [] };
  const texList = new Map(); const seen = new Map();
  const UTILITY = [
    [/^dfgLUT$/, 'BRDF lookup table of three.js'], [/^tMask[AB]$/, 'terrain layer masks at the resolution of the height field (2 m)'], [/^tNoise$/, 'tiling noise used to break repetition'],
    [/^tHeight$/, 'sea-bed depth of the height field'], [/^tFoam$/, 'shore-distance field for the foam'], [/^tSkyEq$|^tSky$/, 'sky panorama'], [/^tWaterN$|^tFoamTex$/, 'water (excepted by the brief)'],
    [/^tHorizon$|^tTerrainShadow$|^envMap$|ShadowMap|^CSM/, 'lighting data'],
  ];
  const noteTex = (tex, role, mat) => {
    if (!tex || !tex.isTexture || !tex.image) return; const w = tex.image.width || 0, h = tex.image.height || 0; if (!w) return;
    const key = tex.uuid; let e = texList.get(key);
    if (!e) { e = { name: tex.name || '(procedural)', width: w, height: h, roles: [], materials: [] }; texList.set(key, e); }
    if (!e.roles.includes(role)) e.roles.push(role); if (!e.materials.includes(mat)) e.materials.push(mat);
  };
  game.scene.traverse((o) => {
    if (!(o.isMesh || o.isInstancedMesh || o.isPoints) || o.userData.noAudit) return;
    if (!(o.layers.mask & ~shadowOnly.mask)) return;                          // exists only in the shadow / mask passes
    for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
      if (!m) continue; const name = m.name || m.type; let rec = seen.get(m.uuid);
      if (!rec) {
        const u = (m.userData.shader && m.userData.shader.uniforms) || m.uniforms || {};
        const extra = Object.entries(u).filter(([, v]) => v && v.value && v.value.isTexture);
        const pbrExtra = extra.filter(([n]) => !UTILITY.some(([re]) => re.test(n)) && n !== 'map' && n !== 'normalMap');
        rec = { name, type: m.type, albedoMap: !!m.map, normalMap: !!m.normalMap, layerTextures: pbrExtra.map(([n]) => n), meshes: 0, exception: null };
        if (o.isPoints) rec.exception = 'particles (smoke and dust sprites)';
        else if (o.name === 'sky') rec.exception = 'sky dome (panorama)';
        else if (o.userData.kind === 'water') rec.exception = 'water';
        else if (m.userData.glass || /glass/i.test(name)) rec.exception = 'glass';
        else if (m.userData.emissive || (m.emissive && m.emissiveIntensity > 0 && (m.emissive.r + m.emissive.g + m.emissive.b) > 0)) rec.exception = 'emissive lamp';
        rec.flat = !rec.albedoMap && !rec.normalMap && !rec.layerTextures.length;
        seen.set(m.uuid, rec); flat.materials.push(rec);
        noteTex(m.map, 'albedo', name); noteTex(m.normalMap, 'normal', name); noteTex(m.roughnessMap, 'roughness', name);
        for (const [n, v] of extra) noteTex(v.value, UTILITY.some(([re]) => re.test(n)) ? 'utility:' + n : 'layer:' + n, name);
        if (rec.flat && !rec.exception) { flat.flagged.push(rec); fail(`flat-colour material: ${name}`); }
      }
      rec.meshes++;
    }
  });
  flat.pass = flat.flagged.length === 0;
  const tex = out.textures = { rule: `albedo / normal / layer textures of surfaces near the track at least ${MIN_TEX} px, the asphalt ${MIN_TEX_ASPHALT} px`, list: [], flagged: [] };
  for (const e of texList.values()) {
    const pbr = e.roles.some((r) => r === 'albedo' || r === 'normal' || r === 'roughness' || r.startsWith('layer:'));
    const util = e.roles.filter((r) => r.startsWith('utility:')).map((r) => r.slice(8));
    const min = !pbr ? 0 : e.materials.includes('asphalt') && e.roles.some((r) => r === 'albedo' || r === 'normal' || r === 'layer:tAsphalt2') ? MIN_TEX_ASPHALT : MIN_TEX;
    const rec = { ...e, minimum: min || null, note: !pbr ? (UTILITY.find(([re]) => util.some((n) => re.test(n))) || [0, 'utility'])[1] : null };
    rec.pass = Math.min(e.width, e.height) >= min; tex.list.push(rec);
    if (!rec.pass) { tex.flagged.push(rec); fail(`texture ${e.name} is ${e.width} x ${e.height} (minimum ${min}) on ${e.materials.join(', ')}`); }
  }
  tex.list.sort((a, b) => (a.name < b.name ? -1 : 1)); tex.pass = tex.flagged.length === 0;

  // ---------------------------------------------------------------- counts and quotas per zone / window
  const world = auditWorld(game.world);
  out.world = world; for (const f of world.failures) fail('world: ' + f);
  out.counts = {
    objects: game.world.objects.length, uniqueIds: new Set(game.world.objects.map((o) => o.id)).size, byKind: world.objects,
    houses: world.village.units, houseVariations: world.village.variations.length, treeSpecies: Object.keys(world.flora.treeSpecies).length, shrubTypes: world.flora.shrubTypes.length, groundCoverTypes: world.flora.groundTypes.length,
    propsPer100mMin: world.props.min, scatter: { ...scatter.stats },
    sceneMeshes: (() => { let n = 0, t = 0; game.scene.traverse((o) => { if (visibleMesh(o)) { n++; t += tris(o.geometry) * (o.isInstancedMesh ? o.count : 1); } }); return { meshes: n, triangles: Math.round(t) }; })(),
  };

  // ---------------------------------------------------------------- engine sound: recorded samples
  const a = game.audio; const man = a && a.manifest;
  out.engineAudio = !man ? null : {
    graphStarted: !!a.unlocked, playerModel: game.player.specId,
    playerEngineSources: a.engine ? [...a.engine.sets.on, ...a.engine.sets.off].map((b) => ({ rpm: b.rpm, audioBuffer: b.src.buffer instanceof AudioBuffer, seconds: b.src.buffer ? +b.src.buffer.duration.toFixed(2) : 0, loop: b.src.loop })) : [],
    timbres: Object.fromEntries(Object.entries(man.engines).map(([id, e]) => [id, { source: e.source, onThrottleBands: e.on.map((b) => b.rpm), overrunBands: e.off.map((b) => b.rpm), decoded: [...e.on, ...e.off].every((b) => a.buffers[b.file] instanceof AudioBuffer) }])),
  };
  if (out.engineAudio) {
    const e = out.engineAudio; e.pass = Object.values(e.timbres).every((t) => t.onThrottleBands.length >= 4 && t.decoded) && Object.keys(e.timbres).length >= 2
      && (!e.graphStarted || (e.playerEngineSources.length >= 4 && e.playerEngineSources.every((s) => s.audioBuffer)));
    if (!e.pass) fail('player engine sound is not built from recorded samples in at least four rpm bands');
  } else fail('no engine audio');

  out.validation = { ok: game.validation.ok, errors: game.validation.errors };
  if (!game.validation.ok) fail('validateWorld reports errors');
  out.pass = out.failures.length === 0;
  return out;
}
