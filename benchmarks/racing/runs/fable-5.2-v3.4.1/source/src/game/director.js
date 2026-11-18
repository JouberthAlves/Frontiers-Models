// Cameras that are not the driver's: the live race behind the menu, the garage, the grid
// presentation and the finish. They all obey the same two limits as the chase camera: above the
// ground and inside the barrier lines (every object of the world stands outside those lines).

import { clamp, lerp, smootherstep } from '../core/math.js';
import { GRID_SHOW } from './race.js';

// shots of the menu: the chase boom swung round one of the cars; cut every few seconds
const MENU_SHOTS = [
  { t: 10, who: 5, dist: 9.5, height: 3.0, yaw: 0.22, drift: 0.012, fov: 50, look: 5.0 },                    // high behind the last car: the field ahead
  { t: 8, who: 1, dist: 8.2, height: 1.25, yaw: Math.PI - 0.5, drift: -0.02, fov: 46, look: 0.4, minBoom: 0.5 }, // from ahead of a front runner, the pack behind it
  { t: 8, who: 3, dist: 7.0, height: 1.05, yaw: 1.3, drift: 0.03, fov: 48, look: 1.2 },                      // tracking alongside
  { t: 9, who: 4, dist: 5.4, height: 0.95, yaw: -0.2, drift: 0.015, fov: 56, look: 6.0 },                    // low behind
  { t: 8, who: 0, dist: 8.0, height: 1.6, yaw: Math.PI + 0.55, drift: 0.02, fov: 46, look: 0.4, minBoom: 0.5 }, // the leader from the front, other side
];

// where the car is shown in the garage (lap distance, lateral offset) and where the camera stands
// on the cliff road before the village: nothing stands between the car and the low sun there (no shadow of
// a palm across the paint), and the village with its church tower is the backdrop
const GARAGE = { s: 1480, d: 2.0, camAz: 2.27, dist: 8.0, height: 1.02, fov: 36, shift: 1.4, lookY: 0.58, spin: 0.42 };

export class Director {
  constructor(game) {
    this.game = game; this.shot = -1; this.shotT = 0; this.orbit = 0; this.subject = null; this.spin = 0; this.finishT = 0;
    this._p = {}; this._a = { x: 0, y: 0, z: 0 }; this._b = { x: 0, y: 0, z: 0 };
    // dev: try other show spots from the URL (?gs=lap distance&gd=offset&gaz=camera azimuth&gdist=&gh=&gfov=)
    const P = game.params; const num = (k, d) => (P[k] !== undefined && isFinite(Number(P[k])) ? Number(P[k]) : d);
    this.G = { ...GARAGE, s: num('gs', GARAGE.s), d: num('gd', GARAGE.d), camAz: num('gaz', GARAGE.camAz), dist: num('gdist', GARAGE.dist), height: num('gh', GARAGE.height), fov: num('gfov', GARAGE.fov) };
  }

  // ------------------------------------------------------------------------------------------ menu
  startMenu() { this.shot = -1; this.shotT = 0; }

  /** cars ordered by the distance covered since they left the grid */
  _ranked() { return this.game.cars.slice().sort((a, b) => b.odo - a.odo); }

  menu(dt) {
    const g = this.game; this.shotT -= dt;
    if (this.shotT <= 0 || !this.subject) {
      this.shot = (this.shot + 1) % MENU_SHOTS.length; const sh = MENU_SHOTS[this.shot];
      this.shotT = sh.t; this.orbit = 0; this.subject = this._ranked()[sh.who];
      g.cam.mode = 'chase'; g.cam.snap(); g.gfx.cutCamera();
    }
    const sh = MENU_SHOTS[this.shot]; this.orbit += sh.drift * dt;
    g.cam.update(this.subject.vehicle, dt, { dist: sh.dist, height: sh.height, yawOffset: sh.yaw + this.orbit, fov: sh.fov, fovGain: 4, lookAhead: sh.look, lookHeight: 0.45, minBoom: sh.minBoom, shakeScale: 0.35 });
    return this.subject;
  }

  // ------------------------------------------------------------------------------------------ garage
  /** puts the player's car on the show spot; the others are hidden by the game */
  enterGarage() {
    const g = this.game; const G = this.G; const track = g.world.track; const p = track.pos(G.s, G.d, this._p);
    const v = g.player.vehicle; this.spin = p.heading + 2.5; v.reset(p.x, p.z, this.spin); v.frozen = true;
    g.player.lastValidS = v.s; this.spot = { x: p.x, y: v.y, z: p.z };
    g.cam.snap(); g.gfx.cutCamera();
  }

  garage(dt) {
    const g = this.game; const G = this.G; const v = g.player.vehicle; const sp = this.spot;
    // the car turns slowly on the spot, as on a turntable (same wheels on the same ground)
    this.spin += G.spin * dt; if (this.spin > Math.PI) this.spin -= 2 * Math.PI;
    v.x = sp.x; v.z = sp.z; v.heading = this.spin; v.u = 0; v.v = 0; v.r = 0; v._updateWheelGround(true);
    v.y += (v.centerGroundY - v.y) * Math.min(1, dt * 10); v.vy = 0; v.pitch *= 0.9; v.roll *= 0.9; v.steerAngle = 0.18; v.wheels[0].steer = 0.18; v.wheels[1].steer = 0.18;
    const a = G.camAz; const pos = this._a, look = this._b;
    pos.x = sp.x + Math.cos(a) * G.dist; pos.z = sp.z + Math.sin(a) * G.dist; pos.y = sp.y + G.height;
    g.cam.constrain(pos, -1, 0.6, 0.5);
    // the menu panel covers the left third: frame the car to the right of the centre
    const fx = sp.x - pos.x, fz = sp.z - pos.z, fl = Math.hypot(fx, fz) || 1;
    look.x = sp.x + (fz / fl) * G.shift; look.z = sp.z - (fx / fl) * G.shift; look.y = sp.y + G.lookY;
    g.cam.setPose(pos, look, G.fov);
  }

  // ------------------------------------------------------------------------------------------ grid presentation
  /**
   * A dolly down the middle of the grid, between the two columns of cars, that ends low in front of the
   * player's car (three-quarter view). u = 0..1 over the presentation; the last quarter holds the final pose.
   */
  gridPose(u, pos, look) {
    const g = this.game; const track = g.world.track; const slots = track.gridSlots; const me = slots[g.player.index];
    const side = me.d < 0 ? -1 : 1;                         // the camera stays on the inner side of the player's column
    const k = smootherstep(0, 0.74, u);
    // track-space key poses: [s, d, height]
    const P0 = [slots[0].s + 5.0, -0.25 * side, 3.7], P2 = [me.s + 5.1, me.d - side * 2.55, 0.6];
    const P1 = [lerp(P0[0], P2[0], 0.55), 0.0, 1.9];
    const L0 = [slots[0].s - 24, 0, 0.5], L2 = [me.s - 0.35, me.d - side * 0.1, 0.56];
    const L1 = [lerp(L0[0], L2[0], 0.6), me.d * 0.5, 0.5];
    const bez = (A, C, B, t, i) => { const c = 2 * C[i] - (A[i] + B[i]) / 2; return (1 - t) * (1 - t) * A[i] + 2 * (1 - t) * t * c + t * t * B[i]; };
    const q = this._p;
    track.pos(bez(P0, P1, P2, k, 0), bez(P0, P1, P2, k, 1), q); pos.x = q.x; pos.z = q.z; pos.y = q.y + bez(P0, P1, P2, k, 2);
    track.pos(bez(L0, L1, L2, k, 0), bez(L0, L1, L2, k, 1), q); look.x = q.x; look.z = q.z; look.y = q.y + bez(L0, L1, L2, k, 2);
    return lerp(46, 40, k);
  }

  grid(dt) {
    const g = this.game; const u = clamp(g.race.t / GRID_SHOW, 0, 1);
    const fov = this.gridPose(u, this._a, this._b);
    g.cam.constrain(this._a, -1, 0.5, 0.35);
    g.cam.setPose(this._a, this._b, fov);
  }

  // ------------------------------------------------------------------------------------------ finish
  startFinish() { this.finishT = 0; this.game.cam.mode = 'chase'; }

  finish(dt) {
    const g = this.game; this.finishT += dt;
    // swings from the chase position round to the front of the car while it cools down
    const k = smootherstep(0.3, 3.2, this.finishT);
    g.cam.update(g.player.vehicle, dt, { dist: lerp(6, 7.6, k), height: lerp(1.8, 1.35, k), yawOffset: k * (Math.PI - 0.62) + Math.max(0, this.finishT - 3.2) * 0.03, fov: lerp(60, 46, k), fovGain: lerp(12, 3, k), lookAhead: lerp(2.6, 0.3, k), lookHeight: lerp(0.22, 0.5, k), minBoom: lerp(0.22, 0.5, k), shakeScale: 1 - 0.7 * k });
  }
}
