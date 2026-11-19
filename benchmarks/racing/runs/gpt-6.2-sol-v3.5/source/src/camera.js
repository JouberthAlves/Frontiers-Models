import * as T from 'three';
import { cameraSafe } from './geometry.js';
import { clamp, mix } from './course.js';

export class TrackCamera {
  constructor(camera, course) {
    this.camera = camera;
    this.course = course;
    this.aim = new T.Vector3();
    this.position = new T.Vector3();
    this.ready = false;
    this.mode = '';
    this.clearance = Infinity;
  }

  optics(fov, near = .102, far = 7800, ease = 1) {
    this.camera.fov = mix(this.camera.fov, fov, ease);
    this.camera.near = near;
    this.camera.far = far;
    this.camera.updateProjectionMatrix();
  }

  set(mode, car, state, dt = 0) {
    const camera = this.camera;
    const fresh = mode !== this.mode || !this.ready || !dt;
    const ease = fresh ? 1 : 1 - Math.exp(-dt * 8);
    camera.up.set(0, 1, 0);
    this.mode = mode;
    this.ready = true;
    if (mode === 'cockpit') {
      const eye = car.eye.clone();
      eye.x -= state.steer * .026;
      eye.y += Math.sin(state.spin * 2 + state.x) * .0025 * clamp(Math.abs(state.speed) / 20, 0, 1);
      const location = car.chassis.localToWorld(eye.clone());
      const forward = car.chassis.localToWorld(eye.clone().add(new T.Vector3(-.17, -.365, 12)));
      camera.position.copy(location);
      camera.lookAt(forward);
      this.optics(63 + Number(state.boosting) * 3, .055, 7800, ease);
    } else {
      const speed = Math.abs(state.speed);
      const h = state.heading - state.slip * .27;
      const dx = Math.cos(h), dz = Math.sin(h);
      const setback = 6.18 + .020 * speed;
      const desired = new T.Vector3(state.x-dx*setback, state.y+2.21+speed*.003, state.z-dz*setback);
      const target = new T.Vector3(state.x+dx*5.0, state.y+.42, state.z+dz*5.0);
      this.position.lerp(desired, ease);
      this.aim.lerp(target, ease);
      camera.position.copy(this.position);
      cameraSafe(this.course, camera.position, new T.Vector3(state.x,state.y+1.28,state.z));
      camera.lookAt(this.aim);
      this.optics(clamp(57+speed*.23,57,72) + Number(state.boosting)*3, .12, 7800, ease);
    }
    const floor = this.course.surface(camera.position.x, camera.position.z);
    if (floor) this.clearance = Math.min(this.clearance, camera.position.y - floor.y);
  }

  hero(car, orbit = 0) {
    this.ready = false;
    this.camera.up.set(0,1,0);
    this.optics(38,.10);
    this.camera.position.copy(car.chassis.localToWorld(new T.Vector3(4.65*Math.cos(orbit)+4.55*Math.sin(orbit),1.45,4.55*Math.cos(orbit)-4.65*Math.sin(orbit))));
    this.camera.lookAt(car.chassis.localToWorld(new T.Vector3(0,.58,.08)));
  }

  overview() {
    this.ready = false;
    this.optics(39,750,2300);
    this.camera.up.set(0,0,-1);
    this.camera.position.set(-39,1270,55);
    this.camera.lookAt(-39, 0, 55);
  }
}
