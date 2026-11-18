// Visual of one car: baked body (three LODs, one mesh per material), four wheels that spin,
// steer and follow the suspension, brake lights, exhaust tips and a contact shadow.

import * as THREE from 'three';
import { loadCarMesh } from './car-loader.js';
import { buildWheelGeometry, WHEEL_SPECS } from './wheels.js';
import { LAYER_MASK } from '../gfx.js';
import { LAYER_DETAIL } from '../probe.js';
import { proxyMesh, mergeForShadow, sourceOf } from '../shadow-proxy.js';

const wheelGeoCache = new Map();
function wheelGeometry(id) { if (!wheelGeoCache.has(id)) wheelGeoCache.set(id, buildWheelGeometry(WHEEL_SPECS[id])); return wheelGeoCache.get(id); }

let exhaustGeo = null;
function exhaustGeometry() {
  if (exhaustGeo) return exhaustGeo;
  // short polished tube, open at the back (axis along x)
  const pts = []; const R = 0.046, r = 0.038, len = 0.16;
  for (const [x, rad] of [[0, r], [0, R], [-len, R], [-len, R * 0.4], [-len + 0.01, r * 0.2], [-0.012, r]]) pts.push(new THREE.Vector2(rad, x));
  const g = new THREE.LatheGeometry(pts, 20); g.rotateZ(-Math.PI / 2); g.computeVertexNormals();
  exhaustGeo = g; return g;
}

export class CarModel {
  /**
   * @param spec physical spec (CAR_SPECS entry)
   * @param meshData result of loadCarMesh
   * @param mats result of CarMaterials.forCar
   */
  constructor(spec, meshData, mats, livery) {
    this.spec = spec; this.data = meshData; this.mats = mats; this.livery = livery;
    this.root = new THREE.Group(); this.root.name = `car_${spec.id}_${livery.id}`;
    this.root.userData.kind = 'car';
    this.body = new THREE.Group(); this.body.rotation.order = 'YZX'; this.root.add(this.body);
    this.lods = [];
    const matOf = { paint: mats.paint, glass: mats.glass, trim: mats.trim, lamp: mats.lamp, drl: mats.drl, tail: mats.tail, interior: mats.interior };
    meshData.lods.forEach((lod, li) => {
      const g = new THREE.Group(); g.visible = li === 0; g.userData.lod = li; g.userData.triangles = lod.triangles;
      for (const [name, geo] of Object.entries(lod.groups)) {
        if (li === 2 && name === 'interior') continue;                    // not visible through the glass at that distance
        const m = new THREE.Mesh(geo, matOf[name]); m.name = `${name}_lod${li}`;
        m.castShadow = false;
        m.receiveShadow = name !== 'glass';
        if (name === 'glass') m.renderOrder = 5;
        if (name !== 'paint' && name !== 'glass' && name !== 'trim') m.layers.set(LAYER_DETAIL);   // the reflection probe only needs the shell
        g.add(m);
      }
      this.body.add(g); this.lods.push(g);
    });
    // shadows: one position-only proxy per car (body shell of a lower level of detail + four plain
    // wheels), swapped with the distance. The visible meshes never cast. The shell of the shadow proxy is
    // pulled a few centimetres inwards along its normals: a coarser shell is never exactly where the visible
    // one is, and where it stood proud of it the car would shade its own paint in blotches.
    const wheelSrc = () => {
      const src = []; const R0 = spec.wheelRadius, hw = spec.wheelWidth / 2, wb = spec.wheelbase, tw = spec.track / 2;
      const a = wb * (1 - spec.frontWeight), bb = wb * spec.frontWeight;
      for (const [lx, lz] of [[a, -tw], [a, tw], [-bb, -tw], [-bb, tw]]) { const c = new THREE.CylinderGeometry(R0, R0, hw * 2, 14); c.rotateX(Math.PI / 2); c.translate(lx, R0, lz); src.push(sourceOf(c)); }
      return src;
    };
    const inset = (geo, d) => {
      const p = geo.attributes.position.array, nr = geo.attributes.normal, n = nr.array, k = nr.itemSize, q = nr.normalized ? 1 / 127 : 1; const out = new Float32Array(p.length);
      for (let i = 0, j = 0; i < p.length; i += 3, j += k) { out[i] = p[i] - n[j] * q * d; out[i + 1] = p[i + 1] - n[j + 1] * q * d; out[i + 2] = p[i + 2] - n[j + 2] * q * d; }
      return { position: out, index: geo.index ? geo.index.array : null };
    };
    this.shadowProxies = [1, 2].map((li) => {
      const src = wheelSrc(), ins = wheelSrc();
      for (const name of ['paint', 'trim', 'lamp', 'glass']) { const geo = meshData.lods[li].groups[name]; if (geo) { src.push(sourceOf(geo)); ins.push(inset(geo, li === 1 ? 0.04 : 0.07)); } }
      // the exact shell is the car's silhouette in the motion-blur mask, the inset one casts the shadow (one draw each)
      const mask = proxyMesh(mergeForShadow(src)); mask.layers.set(LAYER_MASK); mask.castShadow = false; mask.name = 'blur_mask';
      const shadow = proxyMesh(mergeForShadow(ins));
      for (const m of [mask, shadow]) { m.matrixAutoUpdate = true; m.visible = li === 1; this.body.add(m); }
      return { mask, shadow };
    });
    // exhaust tips (kept on LOD 0 and 1)
    this.detail = new THREE.Group();
    for (const e of meshData.design.exhausts || []) for (const sgn of [-1, 1]) {
      const m = new THREE.Mesh(exhaustGeometry(), mats.chrome); m.position.set(e[0] + 0.015, e[1], e[2] * sgn); m.castShadow = false; m.layers.set(LAYER_DETAIL); m.name = 'exhaust';
      this.detail.add(m);
    }
    this.body.add(this.detail);
    // wheels live in world space (they follow the ground, not the body)
    const wg = wheelGeometry(spec.id);
    this.wheels = [];
    for (let i = 0; i < 4; i++) {
      const hub = new THREE.Group(); hub.rotation.order = 'YXZ';
      const flip = new THREE.Group(); if (i % 2 === 0) flip.rotation.y = Math.PI; hub.add(flip);     // left wheels face -z
      const spin = new THREE.Group(); flip.add(spin);
      const tire = new THREE.Mesh(wg.tire, mats.tire), rim = new THREE.Mesh(wg.rim, livery.rim === 'silver' ? mats.rimSilver : mats.rimDark), disc = new THREE.Mesh(wg.disc, mats.disc);
      const cal = new THREE.Mesh(wg.caliper, mats.caliper);
      // front calipers sit behind the axle, rear ones ahead of it; left wheels are mirrored
      const ang = i < 2 ? 2.62 : 0.52; cal.rotation.z = i % 2 === 0 ? Math.PI - ang : ang;
      for (const m of [tire, rim, disc, cal]) { m.castShadow = false; m.receiveShadow = true; if (m !== tire) m.layers.set(LAYER_DETAIL); }
      tire.name = 'tire'; rim.name = 'rim'; disc.name = 'brake_disc'; cal.name = 'caliper';
      spin.add(tire, rim, disc); flip.add(cal);
      this.root.add(hub); this.wheels.push({ hub, spin, flip, cal, disc });
    }
    // contact shadow
    const bl = new THREE.PlaneGeometry(spec.length * 1.16, spec.width * 1.3); bl.rotateX(-Math.PI / 2);
    this.blob = new THREE.Mesh(bl, mats.blob); this.blob.layers.set(LAYER_DETAIL); this.blob.renderOrder = 2; this.blob.name = 'contact_shadow'; this.blob.rotation.order = 'YZX';
    this.root.add(this.blob);
    this.lod = 0; this.brake = 0;
    this.triangles = { body: meshData.lods.map((l) => l.triangles), wheels: 4 * (wg.tire.index.count + wg.rim.index.count + wg.disc.index.count + wg.caliper.index.count) / 3 };
  }

  static async create(spec, carMaterials, livery) {
    const data = await loadCarMesh(spec.id);
    return new CarModel(spec, data, carMaterials.forCar(data.design, livery), livery);
  }

  setLod(l) { if (l === this.lod) return; this.lods[this.lod].visible = false; this.lods[l].visible = true; this.lod = l; this.detail.visible = l < 2; for (let k = 0; k < 2; k++) { const on = k === 0 ? l === 0 : l > 0; this.shadowProxies[k].mask.visible = on; this.shadowProxies[k].shadow.visible = on; } for (const w of this.wheels) { w.disc.visible = l === 0; w.cal.visible = l === 0; } }

  /** @param v Vehicle */
  update(v, dt, camera = null, quality = null) {
    this.body.position.set(v.x, v.y, v.z);
    this.body.rotation.set(v.roll, -v.heading, v.pitch);
    const R = v.spec.wheelRadius;
    for (let i = 0; i < 4; i++) {
      const w = v.wheels[i], m = this.wheels[i]; const lx = v.wheelPos[i][0], lz = v.wheelPos[i][1];
      const att = v.y + v.pitch * lx - v.roll * lz;
      m.hub.position.set(w.x, Math.max(w.groundY, att - 0.11) + R, w.z);
      m.hub.rotation.set(0, -(v.heading + (i < 2 ? w.steer : 0)), 0);
      // spin about the axle (z): forward motion rolls the top of the wheel forwards
      m.spin.rotation.z = (i % 2 === 0 ? 1 : -1) * w.spin;
    }
    // contact shadow sits on the ground under the body
    this.blob.position.set(v.x, (v.wheels[0].groundY + v.wheels[1].groundY + v.wheels[2].groundY + v.wheels[3].groundY) / 4 + 0.025, v.z);
    this.blob.rotation.set(v.roll, -v.heading, v.pitch);
    // brake lights
    const braking = v.frozen ? 0 : Math.max(v.input.brake > 0.05 && !v.reverse ? 1 : 0, v.reverse && v.input.throttle > 0.05 ? 1 : 0);
    this.brake += (braking - this.brake) * Math.min(1, dt * 22);
    this.mats.tail.emissiveIntensity = 1.1 + 7.5 * this.brake;
    if (camera) {
      const d = Math.hypot(camera.position.x - v.x, camera.position.y - v.y, camera.position.z - v.z);
      const high = !quality || quality.id === 'high';
      this.setLod(high ? (d < 16 ? 0 : d < 55 ? 1 : 2) : (d < 28 ? 1 : 2));
    }
  }

  dispose() { this.root.removeFromParent(); }
}
