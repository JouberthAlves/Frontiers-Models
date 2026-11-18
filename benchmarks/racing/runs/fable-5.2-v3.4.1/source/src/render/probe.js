// Dynamic reflection probe: a small cube map rendered around the player's car, one face per
// frame, pre-filtered by three.js into the environment map of the car materials. Trees, walls and
// rivals slide over the clear coat instead of a static sky. High preset only.

import * as THREE from 'three';

export const LAYER_DETAIL = 4; // small objects that the probe does not need (main camera only)

export class ReflectionProbe {
  constructor(gfx, scene, size = 256) {
    this.gfx = gfx; this.scene = scene;
    this.rt = new THREE.WebGLCubeRenderTarget(size, { type: THREE.HalfFloatType, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    this.rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
    this.cam = new THREE.CubeCamera(0.4, 1200, this.rt);
    this.cam.layers.set(0);
    for (const c of this.cam.children) c.layers.set(0);
    this.face = 0; this.ready = false; this.enabled = true;
    this.hidden = [];
    // the pre-filtered (PMREM) version is generated here, between frames: letting three.js do it lazily
    // would run it in the middle of a material set-up and exhaust the texture units
    this.pmrem = new THREE.PMREMGenerator(gfx.renderer);
    this.env = null;
  }

  get texture() { return this.env ? this.env.texture : null; }

  _filter() {
    const r = this.gfx.renderer; const prev = r.getRenderTarget();
    this.env = this.pmrem.fromCubemap(this.rt.texture, this.env);
    r.setRenderTarget(prev);
  }

  _render(faces) {
    const r = this.gfx.renderer; const scene = this.scene;
    for (const o of this.hidden) o.visible = false;
    const prevTarget = r.getRenderTarget();
    // the shadow maps of this frame's main view are reused: no extra shadow passes for the probe
    const prevAuto = r.shadowMap.autoUpdate; r.shadowMap.autoUpdate = false;
    this.cam.updateMatrixWorld(true);
    for (const f of faces) {
      r.setRenderTarget(this.rt, f);
      r.clear(true, true, false);
      r.render(scene, this.cam.children[f]);
    }
    r.setRenderTarget(prevTarget);
    r.shadowMap.autoUpdate = prevAuto;
    for (const o of this.hidden) o.visible = true;
  }

  /** full refresh (load time, camera cuts) */
  refresh(pos, hidden = []) {
    this.hidden = hidden;
    this.cam.position.copy(pos);
    if (!this.ready) { for (const o of hidden) o.visible = false; this.cam.update(this.gfx.renderer, this.scene); for (const o of hidden) o.visible = true; this.ready = true; }
    else this._render([0, 1, 2, 3, 4, 5]);
    this._filter();
    this.face = 0;
  }

  /** incremental refresh: one face per call, the filtered map is rebuilt once per full turn */
  update(pos, hidden = []) {
    if (!this.enabled) return;
    if (!this.ready) { this.refresh(pos, hidden); return; }
    this.hidden = hidden;
    this.tick = (this.tick || 0) + 1; if (this.tick % 2) return;     // one face every other frame
    if (this.face === 0) this.cam.position.copy(pos);
    this._render([this.face]);
    this.face += 1;
    if (this.face >= 6) { this.face = 0; this._filter(); }
  }
}
