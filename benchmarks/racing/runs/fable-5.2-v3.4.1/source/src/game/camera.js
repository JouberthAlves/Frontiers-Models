// Chase camera (default) and bonnet camera.
//  chase: ~6 m behind and ~1.8 m above the car, horizon in the upper third, FOV 60-72 deg with speed,
//         spring-damped, and kept out of the terrain and inside the barrier lines with a smooth pull-in.

import * as THREE from 'three';
import { clamp, damp, lerp, smoothstep, angDiff } from '../core/math.js';

export const CAMERA_NEAR = 0.25, CAMERA_FAR = 9000;

export class GameCamera {
  constructor(world, ground) {
    this.world = world; this.ground = ground;
    this.camera = new THREE.PerspectiveCamera(60, 16 / 9, CAMERA_NEAR, CAMERA_FAR);
    this.mode = 'chase';
    this.yaw = 0; this.boom = 1; this.pos = new THREE.Vector3(); this.look = new THREE.Vector3();
    this.fov = 60; this.shake = 0; this.t = 0;
    this.initialised = false;
    this.violations = 0;      // frames in which the camera ended up inside geometry (dev / tests)
    this.lastCheck = { terrain: 0, barrier: 0 };
    this._pr = {}; this._v = new THREE.Vector3();
  }

  setAspect(a) { this.camera.aspect = a; this.camera.updateProjectionMatrix(); }
  toggle() { this.mode = this.mode === 'chase' ? 'bonnet' : 'chase'; this.initialised = false; return this.mode; }
  snap() { this.initialised = false; }

  /** camera ground clearance and distance inside the barrier line at a world point (negative = violation) */
  clearance(x, y, z, hint) {
    const track = this.world.track, sp = track.spline;
    const gy = this.ground.heightAt(x, z, hint);
    sp.project(x, z, hint, this._pr);
    const side = this._pr.d < 0 ? 0 : 1;
    const lim = track.barrierDist(side, this._pr.s);
    return { terrain: y - gy, barrier: lim - Math.abs(this._pr.d), s: this._pr.s };
  }

  /**
   * Free camera poses (garage, grid presentation): pushes a position back inside the barrier lines and
   * above the ground, the same two limits the chase camera keeps. Returns the clearance that was found.
   */
  constrain(p, hint = -1, margin = 0.45, minHeight = 0.4) {
    const chk = this.clearance(p.x, p.y, p.z, hint);
    if (chk.barrier < margin) {
      const pr = this._pr; const dNew = (pr.d < 0 ? -1 : 1) * Math.max(0, Math.abs(pr.d) - (margin - chk.barrier));
      const q = this.world.track.spline.pointAt(pr.s, dNew, this._q || (this._q = {})); p.x = q.x; p.z = q.z;
    }
    const gy = this.ground.heightAt(p.x, p.z, hint);
    if (p.y < gy + minHeight) p.y = gy + minHeight;
    return chk;
  }

  /** places the camera at a free pose (already constrained) and records the invariant check */
  setPose(pos, look, fov) {
    const cam = this.camera; cam.position.set(pos.x, pos.y, pos.z); cam.up.set(0, 1, 0); cam.lookAt(look.x, look.y, look.z);
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    this.fov = fov; this.initialised = false;
    const cl = this.clearance(pos.x, pos.y, pos.z, -1); this.lastCheck = cl;
    if (cl.terrain < 0.05 || cl.barrier < 0.0) this.violations++;
  }

  /**
   * @param car Vehicle (with x,y,z, heading, speed, pitch, roll)
   */
  update(car, dt, opts = {}) {
    this.t += dt;
    const cam = this.camera; const spec = car.spec;
    const speed = car.speed; const vmax = 62;
    const sp01 = clamp(speed / vmax, 0, 1);
    if (this.mode === 'bonnet') {
      const c = Math.cos(car.heading), s = Math.sin(car.heading);
      const lx = spec.wheelbase * 0.18, ly = spec.height * 0.86;
      const px = car.x + lx * c, pz = car.z + lx * s;
      const py = car.y + ly + car.pitch * lx;
      cam.position.set(px, py, pz);
      const pitch = car.pitch * 0.9;
      this._v.set(px + c * 20, py + Math.sin(pitch) * 20 - 0.9, pz + s * 20);
      cam.up.set(Math.sin(car.roll) * -s * -1, 1, Math.sin(car.roll) * c * -1).normalize();
      cam.lookAt(this._v);
      this.fov = damp(this.fov, 64 + 8 * sp01 * sp01, 4, dt);
      cam.fov = this.fov; cam.updateProjectionMatrix();
      this.initialised = true;
      this.lastCheck = { terrain: 1, barrier: 1 };
      return;
    }
    // ---- chase: yaw follows the direction of travel (so slides show the car at an angle), with a spring
    const moving = speed > 4;
    const velYaw = moving ? Math.atan2(car.vzWorld, car.vxWorld) : car.heading;
    const targetYaw = car.heading + clamp(angDiff(velYaw, car.heading), -0.5, 0.5) * 0.55;
    if (!this.initialised) { this.yaw = targetYaw; this.boom = 1; }
    this.yaw += angDiff(targetYaw, this.yaw) * (1 - Math.exp(-dt * (5.5 + sp01 * 2.5)));
    // the cinematic shots (menu, finish) reuse this camera with another boom: longer, lower, swung round the car
    const dist = (opts.dist ?? 6.0) + 0.5 * sp01; const height = opts.height ?? 1.8; const minBoom = opts.minBoom ?? 0.22;
    const c = Math.cos(this.yaw + (opts.yawOffset || 0)), s = Math.sin(this.yaw + (opts.yawOffset || 0));
    // desired position; pull in along the boom while it is inside terrain or beyond a barrier
    let boomTarget = 1;
    const baseY = car.y;
    for (let it = 0; it < 6; it++) {
      const k = boomTarget;
      const x = car.x - c * dist * k, z = car.z - s * dist * k, y = baseY + height * (0.55 + 0.45 * k) + 0.15 * (1 - k);
      const cl = this.clearance(x, y, z, car.hint);
      if (cl.terrain > 0.5 && cl.barrier > 0.45) break;
      boomTarget -= 0.13;
      if (boomTarget < minBoom) { boomTarget = minBoom; break; }
    }
    // shrink quickly, grow back slowly: the "recuo suave"
    this.boom = boomTarget < this.boom ? damp(this.boom, boomTarget, 16, dt) : damp(this.boom, boomTarget, 2.2, dt);
    const k = this.boom;
    let px = car.x - c * dist * k, pz = car.z - s * dist * k, py = baseY + height * (0.55 + 0.45 * k) + 0.15 * (1 - k);
    // hard limits (the spring above is only for comfort): if the smoothed position is still beyond a barrier
    // line, take the pulled-in boom at once; if even that is outside (car pressed against a wall, tail first),
    // slide the camera sideways back inside the line
    let chk = this.clearance(px, py, pz, car.hint);
    if (chk.barrier < 0.35) {
      this.boom = Math.min(this.boom, boomTarget); const k2 = this.boom;
      px = car.x - c * dist * k2; pz = car.z - s * dist * k2; py = baseY + height * (0.55 + 0.45 * k2) + 0.15 * (1 - k2);
      chk = this.clearance(px, py, pz, car.hint);
      if (chk.barrier < 0.35) {
        const pr = this._pr; const dNew = (pr.d < 0 ? -1 : 1) * Math.max(0, Math.abs(pr.d) - (0.35 - chk.barrier));
        const q = this.world.track.spline.pointAt(pr.s, dNew, this._q || (this._q = {})); px = q.x; pz = q.z;
      }
    }
    // final safety: never below the ground under the camera
    const gy = this.ground.heightAt(px, pz, car.hint);
    if (py < gy + 0.55) py = gy + 0.55;
    if (!this.initialised) { this.pos.set(px, py, pz); }
    // vertical spring so that crests and dips do not jolt the frame
    this.pos.x = px; this.pos.z = pz; this.pos.y = Math.max(gy + 0.55, damp(this.pos.y, py, 9, dt));
    // look a little ahead of the car, low, so that the horizon sits on the upper third
    const ch = Math.cos(car.heading), sh = Math.sin(car.heading);
    const lookAhead = opts.lookAhead ?? 2.6;
    const ty = baseY + (opts.lookHeight ?? 0.22) + car.pitch * 2.0;
    const tx = car.x + ch * lookAhead, tz = car.z + sh * lookAhead;
    if (!this.initialised) this.look.set(tx, ty, tz);
    this.look.x = tx; this.look.z = tz; this.look.y = damp(this.look.y, ty, 7, dt);
    cam.position.copy(this.pos);
    // speed vibration and kerb / off-road rumble
    const rough = opts.rough || 0;
    const amp = (0.004 + 0.012 * sp01 * sp01 + rough * 0.022) * (opts.shakeScale ?? 1);
    cam.position.y += Math.sin(this.t * 47) * amp + Math.sin(this.t * 31.3) * amp * 0.6;
    cam.position.x += Math.sin(this.t * 39.1) * amp * 0.5;
    cam.up.set(0, 1, 0);
    cam.lookAt(this.look);
    const fovT = (opts.fov ?? 60) + (opts.fovGain ?? 12) * smoothstep(0.05, 1, sp01);
    this.fov = this.initialised ? damp(this.fov, fovT, 3, dt) : fovT;
    cam.fov = this.fov; cam.updateProjectionMatrix();
    this.initialised = true;
    // dev invariant: record if the final camera position is inside geometry
    const cl = this.clearance(cam.position.x, cam.position.y, cam.position.z, car.hint);
    this.lastCheck = cl;
    if (cl.terrain < 0.05 || cl.barrier < 0.0) this.violations++;
  }
}
