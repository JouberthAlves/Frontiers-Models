// Keyboard + gamepad. Produces analogue driving inputs and edge-triggered actions.
//   keyboard: arrows / WASD drive, Space handbrake, C camera, R reset, Esc / P pause, Enter confirm
//   gamepad (standard mapping): left stick steer, RT throttle, LT brake, A handbrake, Y camera, X reset, Start pause

import { clamp, approach } from '../core/math.js';

const KEYMAP = {
  ArrowUp: 'throttle', KeyW: 'throttle', ArrowDown: 'brake', KeyS: 'brake',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'handbrake', KeyC: 'camera', KeyR: 'reset', Escape: 'pause', KeyP: 'pause', Enter: 'confirm',
};

export class Input {
  constructor(target = window) {
    this.keys = new Set();
    this.pressed = new Set();       // actions triggered since the last poll (edge)
    this.steer = 0; this.throttle = 0; this.brake = 0; this.handbrake = 0;
    this.gamepadName = null; this.lastDevice = 'keyboard';
    this.sensitivity = 1;
    this._padPrev = {};
    this.enabled = true;
    this.uiMode = false;            // a menu is open: it reads the keyboard itself, only the gamepad edges come through here
    this._down = (e) => {
      const a = KEYMAP[e.code]; if (!a) return;
      if (!this.enabled) return;
      if (['throttle', 'brake', 'left', 'right', 'handbrake'].includes(a) || e.code === 'Space') e.preventDefault();
      if (!this.keys.has(a) && !this.uiMode && !e.repeat) this.pressed.add(a);
      this.keys.add(a); this.lastDevice = 'keyboard';
    };
    this._up = (e) => { const a = KEYMAP[e.code]; if (a) this.keys.delete(a); };
    this._blur = () => this.keys.clear();
    target.addEventListener('keydown', this._down); target.addEventListener('keyup', this._up); window.addEventListener('blur', this._blur);
    window.addEventListener('gamepadconnected', (e) => { this.gamepadName = e.gamepad.id; });
    window.addEventListener('gamepaddisconnected', () => { this.gamepadName = null; });
  }

  /** true once per press */
  take(action) { if (this.pressed.has(action)) { this.pressed.delete(action); return true; } return false; }
  clearPressed() { this.pressed.clear(); }

  _pad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) if (p && p.connected && p.mapping === 'standard') return p;
    for (const p of pads) if (p && p.connected) return p;
    return null;
  }

  /** call once per rendered frame */
  poll(dt, speed = 0) {
    const k = this.keys;
    let steerTarget = (k.has('right') ? 1 : 0) - (k.has('left') ? 1 : 0);
    let thr = k.has('throttle') ? 1 : 0, brk = k.has('brake') ? 1 : 0, hb = k.has('handbrake') ? 1 : 0;
    let analog = false;
    const pad = this._pad();
    if (pad) {
      this.gamepadName = pad.id;
      const dz = (v, d = 0.12) => (Math.abs(v) < d ? 0 : (v - Math.sign(v) * d) / (1 - d));
      const sx = dz(pad.axes[0] || 0);
      const rt = pad.buttons[7] ? pad.buttons[7].value : 0, lt = pad.buttons[6] ? pad.buttons[6].value : 0;
      const b = (i) => !!(pad.buttons[i] && pad.buttons[i].pressed);
      if (Math.abs(sx) > 0.01 || rt > 0.02 || lt > 0.02 || b(0)) this.lastDevice = 'gamepad';
      if (this.lastDevice === 'gamepad') {
        analog = true;
        steerTarget = Math.sign(sx) * Math.pow(Math.abs(sx), 1.6);
        thr = Math.max(thr, rt); brk = Math.max(brk, lt); hb = Math.max(hb, b(0) ? 1 : 0);
      }
      const edge = (i, action) => { const now = b(i); if (now && !this._padPrev[i]) this.pressed.add(action); this._padPrev[i] = now; };
      edge(3, 'camera'); edge(2, 'reset'); edge(9, 'pause'); edge(0, 'confirm'); edge(1, 'back');
      edge(12, 'up'); edge(13, 'down'); edge(14, 'left_tap'); edge(15, 'right_tap');
    }
    if (analog) this.steer = approach(this.steer, steerTarget * this.sensitivity, dt * 9);
    else {
      // keyboard: ramp the wheel, quicker to centre, a little slower at speed for stability
      const rate = steerTarget === 0 ? 5.5 : (Math.sign(steerTarget) !== Math.sign(this.steer) && this.steer !== 0 ? 9 : 3.4 - Math.min(1.4, speed / 60));
      this.steer = approach(this.steer, steerTarget, dt * rate * this.sensitivity);
    }
    this.steer = clamp(this.steer, -1, 1);
    this.throttle = approach(this.throttle, thr, dt * (thr > this.throttle ? 7 : 10));
    this.brake = approach(this.brake, brk, dt * (brk > this.brake ? 9 : 12));
    this.handbrake = hb;
    return this;
  }

  dispose() { window.removeEventListener('keydown', this._down); window.removeEventListener('keyup', this._up); window.removeEventListener('blur', this._blur); }
}

export const CONTROLS_HELP = [
  ['Acelerar', '↑ / W', 'RT'],
  ['Frear / ré', '↓ / S', 'LT'],
  ['Direção', '← → / A D', 'Analógico esquerdo'],
  ['Freio de mão', 'Espaço', 'A'],
  ['Trocar câmera', 'C', 'Y'],
  ['Voltar à pista', 'R', 'X'],
  ['Pausa', 'Esc / P', 'Start'],
];
