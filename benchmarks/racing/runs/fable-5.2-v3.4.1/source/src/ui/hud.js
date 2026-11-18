// Head-up display, drawn on a 2D canvas above the 3D view: position, lap, lap times, speed,
// gear / rev bar, minimap, countdown and messages. Kept small and to the corners.
// What never changes during a race (panels, labels, the outline of the track, the unlit rev bar) is drawn once
// into a layer and copied; only the figures are drawn every time.

import { fmtTime } from '../core/math.js';

const FONT = '"Bahnschrift", "DIN Alternate", "Roboto Condensed", "Segoe UI", sans-serif';
const INK = '#f4efe6', DIM = 'rgba(244,239,230,0.62)', AMBER = '#ffb347';
const REV_N = 28;

export class Hud {
  constructor(canvas, game) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.game = game; this.visible = false; this.msg = null; this.msgT = 0; this.showFps = false;
    this.k = 1; this.w = 1; this.h = 1;
    this.layer = document.createElement('canvas'); this.lctx = this.layer.getContext('2d'); this.layerKey = '';
    const sp = game.world.track.spline, b = sp.bounds; const n = Math.ceil(sp.n / 6);
    this.mapXZ = new Float32Array(n * 2); for (let i = 0, q = 0; i < sp.n; i += 6, q++) { this.mapXZ[q * 2] = sp.x[i]; this.mapXZ[q * 2 + 1] = sp.z[i]; }
    this.mapBox = { x0: b.minX, z0: b.minZ, w: b.maxX - b.minX, h: b.maxZ - b.minZ };
    this.mm = { ox: 0, oy: 0, sc: 1 }; this.colors = new Map();
  }

  resize(w, h) {
    const dpr = Math.min(2, window.devicePixelRatio || 1); this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    this.w = this.canvas.width; this.h = this.canvas.height; this.k = this.h / 1080; this.layerKey = '';
  }
  message(text, seconds = 2.2, sub = null) { this.msg = { text, sub }; this.msgT = seconds; }
  clear() { this.ctx.clearRect(0, 0, this.w, this.h); }

  _panel(c, x, y, w, h, r = 10) { c.beginPath(); c.roundRect(x, y, w, h, r * this.k); c.fillStyle = 'rgba(10,12,18,0.46)'; c.fill(); }
  _text(c, t, x, y, size, color = INK, align = 'left', weight = 600, italic = false) {
    c.font = `${italic ? 'italic ' : ''}${weight} ${Math.round(size * this.k)}px ${FONT}`; c.textAlign = align; c.textBaseline = 'alphabetic';
    c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = 6 * this.k; c.fillStyle = color; c.fillText(t, x, y); c.shadowBlur = 0;
  }
  _css(hex) { let s = this.colors.get(hex); if (!s) { s = '#' + hex.toString(16).padStart(6, '0'); this.colors.set(hex, s); } return s; }

  /** the parts that stay the same for a whole race */
  _buildLayer(eng) {
    const L = this.layer, c = this.lctx, k = this.k, W = this.w, H = this.h; const m = 34 * k;
    L.width = W; L.height = H; c.clearRect(0, 0, W, H);
    // position and lap (top left)
    this._panel(c, m, m, 236 * k, 118 * k);
    this._text(c, 'VOLTA', m + 150 * k, m + 46 * k, 17, DIM, 'left', 500);
    // times (top right)
    const tw = 300 * k; this._panel(c, W - m - tw, m, tw, 118 * k);
    this._text(c, 'TEMPO', W - m - tw + 20 * k, m + 34 * k, 15, DIM, 'left', 500);
    this._text(c, 'MELHOR', W - m - tw + 20 * k, m + 82 * k, 15, DIM, 'left', 500);
    // speed, gear, revs (bottom right)
    const sw = 330 * k, sh = 150 * k, sx = W - m - sw, sy = H - m - sh; this._panel(c, sx, sy, sw, sh);
    this._text(c, 'km/h', sx + sw - 90 * k, sy + 92 * k, 20, DIM, 'left', 500);
    const bw = (sw - 60 * k) / REV_N; const redFrom = (eng.redline - 800) / (eng.limiter - 800) - 0.1;
    for (let i = 0; i < REV_N; i++) { c.fillStyle = i / REV_N > redFrom ? 'rgba(255,90,60,0.28)' : 'rgba(244,239,230,0.2)'; c.fillRect(sx + 30 * k + i * bw, sy + 112 * k, bw - 3 * k, (12 + 8 * (i / REV_N)) * k); }
    // minimap (bottom left)
    const mw = 250 * k, mh = 210 * k, mx = m, my = H - m - mh; this._panel(c, mx, my, mw, mh);
    const b = this.mapBox; const sc = Math.min((mw - 30 * k) / b.w, (mh - 30 * k) / b.h); const ox = mx + (mw - b.w * sc) / 2 - b.x0 * sc, oy = my + (mh - b.h * sc) / 2 - b.z0 * sc;
    this.mm.ox = ox; this.mm.oy = oy; this.mm.sc = sc;
    const P = this.mapXZ; c.beginPath(); c.moveTo(ox + P[0] * sc, oy + P[1] * sc); for (let i = 2; i < P.length; i += 2) c.lineTo(ox + P[i] * sc, oy + P[i + 1] * sc); c.closePath();
    c.lineJoin = 'round'; c.strokeStyle = 'rgba(0,0,0,0.6)'; c.lineWidth = 7 * k; c.stroke(); c.strokeStyle = 'rgba(244,239,230,0.85)'; c.lineWidth = 3.2 * k; c.stroke();
    c.fillStyle = INK; c.fillRect(ox + P[0] * sc - 2 * k, oy + P[1] * sc - 6 * k, 4 * k, 12 * k);
  }

  draw(dt) {
    const c = this.ctx, k = this.k, W = this.w, H = this.h; const g = this.game, race = g.race;
    c.clearRect(0, 0, W, H);
    if (this.showFps) this._text(c, `${Math.round(g.fps.value)} FPS`, W / 2, 26 * k, 18, 'rgba(244,239,230,0.75)', 'center', 500);
    if (!this.visible || !race || !race.entries.length) return;
    const me = race.player, v = g.player.vehicle; const m = 34 * k; const eng = v.spec.engine;
    const key = `${W}x${H}:${v.spec.id}`; if (key !== this.layerKey) { this._buildLayer(eng); this.layerKey = key; }
    c.drawImage(this.layer, 0, 0);
    // ---- position and lap (top left)
    const place = String(me.place);
    this._text(c, place, m + 22 * k, m + 86 * k, 84, AMBER, 'left', 700, true);
    this._text(c, `/${race.entries.length}`, m + 22 * k + c.measureText(place).width + 6 * k, m + 86 * k, 34, 'rgba(244,239,230,0.8)', 'left', 600, true);
    this._text(c, `${Math.min(race.laps, me.lapsDone + 1)}/${race.laps}`, m + 150 * k, m + 88 * k, 40, INK, 'left', 700);
    // ---- times (top right)
    this._text(c, fmtTime(race.phase === 'racing' || race.phase === 'finished' ? race.lapTime(me) : 0), W - m - 20 * k, m + 46 * k, 40, INK, 'right', 700);
    this._text(c, me.best === null ? '--:--.---' : fmtTime(me.best), W - m - 20 * k, m + 88 * k, 26, AMBER, 'right', 600);
    this._text(c, 'TOTAL ' + fmtTime(race.clock), W - m - 20 * k, m + 110 * k, 14, DIM, 'right', 500);
    // ---- speed, gear, revs (bottom right)
    const sw = 330 * k, sh = 150 * k, sx = W - m - sw, sy = H - m - sh;
    this._text(c, String(Math.round(v.kmh)), sx + sw - 96 * k, sy + 92 * k, 82, INK, 'right', 700, true);
    this._text(c, v.reverse ? 'R' : String(v.gear), sx + 30 * k, sy + 92 * k, 82, AMBER, 'left', 700, true);
    const r01 = Math.max(0, Math.min(1, (v.rpm - 800) / (eng.limiter - 800))); const bw = (sw - 60 * k) / REV_N; const redFrom = (eng.redline - 800) / (eng.limiter - 800) - 0.1;
    for (let i = 0; i < REV_N && i / REV_N < r01; i++) { c.fillStyle = i / REV_N > redFrom ? '#ff5a3c' : INK; c.fillRect(sx + 30 * k + i * bw, sy + 112 * k, bw - 3 * k, (12 + 8 * (i / REV_N)) * k); }
    this._text(c, `${Math.round(v.rpm / 10) * 10} rpm`, sx + sw - 30 * k, sy + 30 * k, 15, DIM, 'right', 500);
    // ---- minimap (bottom left): the cars
    const mm = this.mm;
    for (let i = 0; i < race.entries.length; i++) {
      const e = race.entries[i]; if (e.isPlayer) continue; const q = e.car.vehicle;
      c.beginPath(); c.arc(mm.ox + q.x * mm.sc, mm.oy + q.z * mm.sc, 4.6 * k, 0, 6.3); c.fillStyle = this._css(e.car.livery.color); c.fill(); c.lineWidth = 1.4 * k; c.strokeStyle = 'rgba(0,0,0,0.7)'; c.stroke();
    }
    c.beginPath(); c.arc(mm.ox + v.x * mm.sc, mm.oy + v.z * mm.sc, 6.5 * k, 0, 6.3); c.fillStyle = AMBER; c.fill(); c.lineWidth = 2 * k; c.strokeStyle = '#111'; c.stroke();
    // ---- centre: countdown and messages
    if (race.phase === 'countdown' && race.count > 0) this._text(c, String(race.count), W / 2, H * 0.36, 190, INK, 'center', 700, true);
    if (this.msgT > 0 && this.msg) {
      this.msgT -= dt; const a = Math.min(1, this.msgT / 0.35); c.globalAlpha = a;
      this._text(c, this.msg.text, W / 2, H * 0.3, 78, AMBER, 'center', 700, true);
      if (this.msg.sub) this._text(c, this.msg.sub, W / 2, H * 0.3 + 46 * k, 28, INK, 'center', 600);
      c.globalAlpha = 1;
    }
  }
}
