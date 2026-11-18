// Sound. Web Audio graph:
//
//   player engine ─┐
//   rival engines ─┤ (panner per car)
//   tyres, wind,   ├─ world bus ─ low-pass (pause) ─┐
//   impacts        │                                ├─ master gain ─ limiter worklet ─ speakers
//   ambience ──────┘                 UI bus ────────┤                       └─ PCM tap (verifier)
//                                    music bus ─────┘
//
// Engines are recorded loops in several rpm bands (assets/audio/manifest.json), cross-faded by
// rpm and pitched so that the firing frequency follows the simulated engine speed; an "on
// throttle" and an "overrun" set are mixed by the load. Everything is created once and reused:
// restarting a race never adds voices.

import { mulberry32 } from '../core/rng.js';
import { clamp, smoothstep } from '../core/math.js';
import { SURF } from '../world/track.js';

const BASE = 'assets/audio/';
const TC = 0.035;                 // smoothing of gains and rates (s)

class EngineVoice {
  /** @param bands {on:[...], off:[...]} of the manifest; `lite` uses four on-throttle bands only (rivals) */
  constructor(audio, def, out, lite) {
    this.audio = audio; this.out = out; const ctx = audio.ctx;
    this.gain = ctx.createGain(); this.gain.gain.value = 0; this.gain.connect(out);
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.frequency.value = 9000; this.filter.Q.value = 0.5; this.filter.connect(this.gain);
    const pick = (list, n) => (list.length <= n ? list : Array.from({ length: n }, (_, i) => list[Math.round(i * (list.length - 1) / (n - 1))]));
    this.sets = { on: pick(def.on, lite ? 4 : def.on.length).map((b) => this._band(b)), off: lite ? [] : def.off.map((b) => this._band(b)) };
    this.load = 0; this.cut = 1;
  }
  _band(b) {
    const ctx = this.audio.ctx; const src = ctx.createBufferSource(); src.buffer = this.audio.buffers[b.file]; src.loop = true;
    const g = ctx.createGain(); g.gain.value = 0; src.connect(g); g.connect(this.filter); this.audio._start(src, this.audio.rand() * 0.3);
    return { rpm: b.rpm, src, g };
  }
  _mix(set, rpm, level, t) {
    const n = set.length; if (!n) return;
    let k = 0; while (k < n - 1 && rpm > set[k + 1].rpm) k++;
    const a = set[k], b = set[Math.min(n - 1, k + 1)]; const f = a === b ? 0 : clamp((rpm - a.rpm) / (b.rpm - a.rpm), 0, 1);
    for (let i = 0; i < n; i++) {
      const w = set[i] === a ? Math.cos(f * Math.PI / 2) : set[i] === b ? Math.sin(f * Math.PI / 2) : 0;
      set[i].g.gain.setTargetAtTime(w * level, t, TC);
      if (w > 0.001) set[i].src.playbackRate.setTargetAtTime(clamp(rpm / set[i].rpm, 0.35, 2.8) * this.rate, t, 0.02);
    }
  }
  /** @param rpm engine speed; throttle 0..1; level overall gain; rate extra pitch factor (Doppler) */
  update(rpm, throttle, level, dt, rate = 1, cut = 1) {
    const t = this.audio.ctx.currentTime; this.rate = rate;
    this.load += (throttle - this.load) * Math.min(1, dt * (throttle > this.load ? 22 : 7));
    const L = this.load;
    this._mix(this.sets.on, rpm, this.sets.off.length ? 0.22 + 0.78 * Math.pow(L, 0.8) : 0.5 + 0.5 * L, t);
    this._mix(this.sets.off, rpm, (1 - L) * 0.85, t);
    this.filter.frequency.setTargetAtTime(2600 + 9500 * L, t, 0.05);
    this.gain.gain.setTargetAtTime(level * cut, t, cut < 1 ? 0.008 : 0.03);
  }
  dispose() { for (const s of [...this.sets.on, ...this.sets.off]) { try { s.src.stop(); } catch (e) { /* already stopped */ } s.g.disconnect(); } this.filter.disconnect(); this.gain.disconnect(); }
}

export class AudioSystem {
  constructor(game) {
    // its own random sequence (loop phases, pitch of the impacts, the bells): the same mix on every run
    this.rand = mulberry32(20261117);
    this.game = game; this.ctx = null; this.ready = false; this.unlocked = false; this.buffers = {}; this.manifest = null;
    this.volumes = { master: 0.8, sfx: 0.9, music: 0.5 };
    try { Object.assign(this.volumes, JSON.parse(localStorage.getItem('cd-volumes') || '{}')); } catch (e) { /* defaults */ }
    this.stats = { voices: 0, maxVoices: 0, started: 0, aiActive: 0, maxAiActive: 0, peak: 0, limiterMinGain: 1 };
    this.log = []; this.recStart = null; this.rec = null; this.paused = false; this.musicOn = false; this.loops = {}; this.ai = []; this.engine = null;
    this.state = { squeal: 0, bridge: false, skidT: -9, crashT: -9, zoneBell: 30, passT: {} }; this.sceneK = 0.3;
  }

  // ------------------------------------------------------------------------------------------ loading
  /** decodes every sample with an offline context: no AudioContext exists before the first user gesture */
  async load(onProgress = () => {}) {
    this.manifest = await (await fetch(BASE + 'manifest.json')).json();
    const files = new Set(); for (const e of Object.values(this.manifest.engines)) for (const b of [...e.on, ...e.off]) files.add(b.file);
    for (const s of Object.values(this.manifest.sounds)) files.add(s.file);
    const dec = new OfflineAudioContext(1, 1, 44100); let done = 0; const list = [...files];
    await Promise.all(list.map(async (f) => { const buf = await (await fetch(BASE + f)).arrayBuffer(); this.buffers[f] = await dec.decodeAudioData(buf); onProgress(++done / list.length); }));
    this.ready = true;
  }

  /** first user gesture: build the graph and start the permanent voices */
  async unlock() {
    if (this.unlocked || this._unlocking || !this.ready) return; this._unlocking = true;
    // a fixed rate, whatever the output device runs at: the same sound and the same recording on every machine
    const AC = window.AudioContext || window.webkitAudioContext; let ctx;
    try { ctx = new AC({ latencyHint: 'interactive', sampleRate: 48000 }); } catch (e) { ctx = new AC({ latencyHint: 'interactive' }); }
    this.ctx = ctx;
    const G = (v = 1) => { const g = ctx.createGain(); g.gain.value = v; return g; };
    this.master = G(this.volumes.master);
    try {
      await ctx.audioWorklet.addModule('src/audio/limiter-worklet.js');
      this.limiter = new AudioWorkletNode(ctx, 'master-limiter', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
      this.limiter.port.onmessage = (e) => {
        const d = e.data; if (d.pcm && this.rec) this.rec.push(d.pcm);
        if (d.peak !== undefined) { this.stats.peak = Math.max(this.stats.peak, d.peak); this.stats.limiterMinGain = Math.min(this.stats.limiterMinGain, d.minGain); }
        if (d.recEnd && this._recDone) { this._recDone(); this._recDone = null; }
      };
    } catch (e) {
      // no AudioWorklet: a compressor set up as a limiter keeps the master safe (no PCM tap in that case)
      console.warn('AudioWorklet unavailable, using a compressor as limiter:', e.message);
      const c = this.limiter = ctx.createDynamicsCompressor(); c.threshold.value = -4; c.knee.value = 0; c.ratio.value = 20; c.attack.value = 0.002; c.release.value = 0.12; this.noTap = true;
    }
    this.master.connect(this.limiter); this.limiter.connect(ctx.destination);
    this.worldLp = ctx.createBiquadFilter(); this.worldLp.type = 'lowpass'; this.worldLp.frequency.value = 20000; this.worldLp.connect(this.master);
    this.world = G(this.volumes.sfx * this.sceneK); this.world.connect(this.worldLp);
    this.bus = { player: G(0.9), ai: G(0.5), sfx: G(0.9), amb: G(0.55), ui: G(0.5 * this.volumes.sfx), music: G(0.5 * this.volumes.music) };
    for (const k of ['player', 'ai', 'sfx', 'amb']) this.bus[k].connect(this.world);
    this.bus.ui.connect(this.master); this.bus.music.connect(this.master);
    // permanent loops: tyres, wind, scrape, ambience
    const loop = (name, bus, rate = 1) => { const src = ctx.createBufferSource(); src.buffer = this.buffers[this.manifest.sounds[name].file]; src.loop = true; src.playbackRate.value = rate; const g = G(0); src.connect(g); g.connect(bus); this._start(src, this.rand() * 0.5); return { src, g }; };
    for (const n of ['squeal', 'scrub', 'roll_asphalt', 'roll_kerb', 'roll_gravel', 'roll_grass', 'wind', 'scrape']) this.loops[n] = loop(n, this.bus.sfx);
    // bridge: the same road-noise recording, an octave lower through a band-pass (the hollow deck)
    { const src = ctx.createBufferSource(); src.buffer = this.buffers[this.manifest.sounds.roll_asphalt.file]; src.loop = true; src.playbackRate.value = 0.62; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 170; f.Q.value = 1.4; const g = G(0); src.connect(f); f.connect(g); g.connect(this.bus.sfx); this._start(src); this.loops.roll_bridge = { src, g }; }
    for (const n of ['amb_sea', 'amb_gulls', 'amb_village', 'amb_birds', 'amb_cicadas']) this.loops[n] = loop(n, this.bus.amb);
    this.loops.amb_wind = loop('wind', this.bus.amb, 0.6);
    this.unlocked = true;
    this.bindCars();
    this.stats.base = this.stats.voices;       // permanent voices: engine bands and loops
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    if (this._wantMusic) this.music(true);
  }

  _start(src, offset = 0) { this.stats.voices++; this.stats.started++; if (this.stats.voices > this.stats.maxVoices) this.stats.maxVoices = this.stats.voices; src.onended = () => { this.stats.voices--; }; src.start(0, offset); return src; }

  /** (re)creates the engine voices for the cars of the current field; called whenever the cars are rebuilt */
  bindCars() {
    if (!this.unlocked) return;
    if (this.engine) this.engine.dispose(); for (const a of this.ai) { a.voice.dispose(); a.panner.disconnect(); }
    this.engine = null;
    this.ai = []; const ctx = this.ctx; const g = this.game;
    this.engine = new EngineVoice(this, this.manifest.engines[g.player.specId], this.bus.player, false);
    for (const car of g.cars) {
      if (car.isPlayer) continue;
      const p = ctx.createPanner(); p.panningModel = 'equalpower'; p.distanceModel = 'inverse'; p.refDistance = 6; p.rolloffFactor = 1.3; p.maxDistance = 220; p.connect(this.bus.ai);
      this.ai.push({ car, panner: p, voice: new EngineVoice(this, this.manifest.engines[car.specId], p, true), dist: 999, side: 0 });
    }
    this.state.passT = {};
  }

  // ------------------------------------------------------------------------------------------ one-shots and UI
  _shot(name, bus, gain = 1, rate = 1) {
    if (!this.unlocked) return; const ctx = this.ctx; const src = ctx.createBufferSource(); src.buffer = this.buffers[this.manifest.sounds[name].file]; src.playbackRate.value = rate;
    const g = ctx.createGain(); g.gain.value = gain; src.connect(g); g.connect(bus); src.addEventListener('ended', () => g.disconnect()); this._start(src);
  }
  _tone(freq, dur, type = 'sine', gain = 0.5, when = 0, glide = 0) {
    if (!this.unlocked) return; const ctx = this.ctx; const t = ctx.currentTime + when; const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t); if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(this.bus.ui); this.stats.voices++; this.stats.started++; if (this.stats.voices > this.stats.maxVoices) this.stats.maxVoices = this.stats.voices;
    o.onended = () => { this.stats.voices--; g.disconnect(); }; o.start(t); o.stop(t + dur + 0.03);
  }
  ui(kind) {
    if (kind === 'move') this._tone(620, 0.05, 'triangle', 0.25);
    else if (kind === 'confirm') { this._tone(660, 0.07, 'triangle', 0.35); this._tone(990, 0.1, 'triangle', 0.35, 0.06); }
    else if (kind === 'back') { this._tone(520, 0.07, 'triangle', 0.3); this._tone(390, 0.1, 'triangle', 0.3, 0.06); }
  }
  countdown(n) { this._tone(440, 0.22, 'square', 0.22); this._tone(880, 0.22, 'sine', 0.2); }
  go() { this._tone(880, 0.7, 'square', 0.24); this._tone(1760, 0.7, 'sine', 0.2); }
  flag() { [523, 659, 784, 1047, 1319].forEach((f, i) => this._tone(f, 0.32, 'triangle', 0.35, i * 0.11)); }
  lapBeep() { this._tone(990, 0.09, 'sine', 0.25); this._tone(1320, 0.12, 'sine', 0.25, 0.09); }

  /** soft generated pad for the menus (music is optional in the brief; nothing plays during the race) */
  music(on) {
    this._wantMusic = on; if (!this.unlocked || on === this.musicOn) return; this.musicOn = on; const ctx = this.ctx;
    if (!on) { if (this._music) { const m = this._music; m.g.gain.setTargetAtTime(0, ctx.currentTime, 0.25); setTimeout(() => { for (const o of m.osc) { try { o.stop(); } catch (e) { /* stopped */ } } m.g.disconnect(); }, 900); this._music = null; } return; }
    const g = ctx.createGain(); g.gain.value = 0; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(g); g.connect(this.bus.music);
    const chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 207.7, 246.9]]; const osc = [];
    for (let v = 0; v < 3; v++) for (const det of [-4, 5]) { const o = ctx.createOscillator(); o.type = 'triangle'; o.detune.value = det; const t0 = ctx.currentTime; for (let k = 0; k < 400; k++) o.frequency.setValueAtTime(chords[k % 4][v], t0 + k * 4.5); o.connect(lp); osc.push(o); this.stats.voices++; this.stats.started++; o.onended = () => { this.stats.voices--; }; o.start(); }
    if (this.stats.voices > this.stats.maxVoices) this.stats.maxVoices = this.stats.voices;
    g.gain.setTargetAtTime(0.16, ctx.currentTime, 1.2); this._music = { g, osc };
  }

  setVolume(kind, v) {
    this.volumes[kind] = v; try { localStorage.setItem('cd-volumes', JSON.stringify(this.volumes)); } catch (e) { /* private mode */ }
    if (!this.unlocked) return; const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.volumes.master, t, 0.03); this._world(0.03);
    this.bus.ui.gain.setTargetAtTime(0.5 * this.volumes.sfx, t, 0.03); this.bus.music.gain.setTargetAtTime(0.5 * this.volumes.music, t, 0.03);
  }
  /** pause: the world is muffled and turned down, the UI stays clear */
  setPaused(p) {
    this.paused = p; if (!this.unlocked) return; const t = this.ctx.currentTime;
    this.worldLp.frequency.setTargetAtTime(p ? 320 : 20000, t, 0.06); this._world(0.06);
  }
  _world(tc) { this.world.gain.setTargetAtTime(this.volumes.sfx * (this.paused ? 0.3 : 1) * this.sceneK, this.ctx.currentTime, tc); }
  /** menus: the world keeps playing quietly behind the interface (k = level of the world bus, 1 in the race) */
  setScene(k) { this.sceneK = k; if (this.unlocked) this._world(0.25); }
  /** the tab was hidden / shown */
  suspend(b) { if (this.ctx) { if (b) this.ctx.suspend().catch(() => {}); else this.ctx.resume().catch(() => {}); } }
  _event(type, data) { if (this.recStart !== null) this.log.push({ t: +(this.ctx.currentTime - this.recStart).toFixed(2), type, ...(data || {}) }); }

  // ------------------------------------------------------------------------------------------ per frame
  update(dt) {
    if (!this.unlocked || !this.engine) return; const g = this.game, ctx = this.ctx, t = ctx.currentTime; const v = g.player.vehicle; const S = this.state;
    const set = (loop, gain, rate) => { loop.g.gain.setTargetAtTime(gain, t, TC); if (rate !== undefined) loop.src.playbackRate.setTargetAtTime(rate, t, TC); };
    const active = g.state !== 'garage' && g.state !== 'setup';
    // ---- player engine: shift cut, limiter stutter
    const eng = v.spec.engine; let cut = 1;
    if (v.shiftTimer > 0) cut = 0.12; else if (v.limiting) cut = (Math.floor(t * 26) % 2) ? 0.15 : 1;
    if (g.player.shift) { this._shot('shift', this.bus.player, 0.55, g.player.shift > 0 ? 1 : 0.85); this._event('gear', { gear: v.gear }); g.player.shift = 0; }
    const thr = v.frozen ? clamp(v.input.throttle, 0, 1) : clamp(v.throttleEff ?? v.input.throttle, 0, 1);
    this.engine.update(v.rpm, thr, 0.55 + 0.45 * clamp((v.rpm - eng.idle) / (eng.redline - eng.idle), 0, 1), dt, 1, cut);
    // ---- tyres and surfaces
    const sp = v.speed; let hard = 0, kerb = 0, loose = 0, grass = 0, spin = 0;
    for (let i = 0; i < 4; i++) {
      const w = v.wheels[i]; if (!w.contact) continue;
      if (w.surf === SURF.KERB) kerb++; else if (w.surf === SURF.SAND || w.surf === SURF.GRAVEL) loose++; else if (w.surf === SURF.GRASS) grass++; else hard++;
      spin = Math.max(spin, Math.abs(w.slipLong || 0));
    }
    const sq = smoothstep(0.22, 0.85, v.skid) * clamp(sp / 9, 0, 1) * (hard + kerb) / 4;
    set(this.loops.squeal, sq * 0.8, 0.8 + 0.35 * clamp(sp / 60, 0, 1) + 0.1 * v.skid);
    if (sq > 0.3 && S.squeal <= 0.3 && t - S.skidT > 2) { S.skidT = t; this._event('skid'); } S.squeal = sq;
    set(this.loops.scrub, smoothstep(0.35, 1.2, spin) * clamp(1 - sp / 22, 0, 1) * 0.5 + (loose / 4) * smoothstep(0.2, 0.8, v.skid) * 0.4, 0.9 + sp / 80);
    const roll = Math.sqrt(clamp(sp / 62, 0, 1)); const onBridge = v.centerSurf === SURF.BRIDGE;
    set(this.loops.roll_asphalt, roll * 0.55 * (hard / 4) * (onBridge ? 0.45 : 1), 0.55 + sp / 55);
    set(this.loops.roll_bridge, onBridge ? roll * 1.0 : 0, 0.5 + sp / 110);
    set(this.loops.roll_kerb, (kerb / 4) * clamp(sp / 14, 0, 1) * 0.9, 0.5 + sp / 38);
    set(this.loops.roll_gravel, (loose / 4) * clamp(sp / 16, 0, 1) * 0.9, 0.7 + sp / 60);
    set(this.loops.roll_grass, (grass / 4) * clamp(sp / 16, 0, 1) * 0.8, 0.7 + sp / 60);
    if (onBridge !== S.bridge) { S.bridge = onBridge; this._event(onBridge ? 'bridge-in' : 'bridge-out'); }
    set(this.loops.wind, Math.pow(clamp(sp / 66, 0, 1), 2) * 0.6, 0.7 + sp / 95);
    set(this.loops.scrape, clamp(v.wallScrape || 0, 0, 1) * clamp(sp / 12, 0.15, 1) * 0.8, 0.8 + sp / 90);
    // ---- collisions of the player (the game drains the event list after particles have seen it)
    let hit = null; for (const e of v.events) if ((e.type === 'wall' || e.type === 'car') && (!hit || e.strength > hit.strength)) hit = e;
    if (hit && t - S.crashT > 0.14) {
      const f = hit.strength; S.crashT = t;
      this._shot(f > 6 ? 'crash_0' : f > 2.8 ? 'crash_1' : 'crash_2', this.bus.sfx, clamp(f / 9, 0.18, 1), 0.9 + this.rand() * 0.2); this._event('collision', { strength: +f.toFixed(1), with: hit.type });
    }
    // ---- rivals: positional, light Doppler, the far ones fall silent
    const cam = g.camera; const L = ctx.listener; const fw = this._fw || (this._fw = { x: 0, y: 0, z: -1 });
    { const m = cam.matrixWorld.elements; fw.x = -m[8]; fw.y = -m[9]; fw.z = -m[10]; }
    if (L.positionX) { L.positionX.value = cam.position.x; L.positionY.value = cam.position.y; L.positionZ.value = cam.position.z; L.forwardX.value = fw.x; L.forwardY.value = fw.y; L.forwardZ.value = fw.z; L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0; }
    else { L.setPosition(cam.position.x, cam.position.y, cam.position.z); L.setOrientation(fw.x, fw.y, fw.z, 0, 1, 0); }
    let act = 0; const ch = Math.cos(v.heading), sh = Math.sin(v.heading);
    for (const a of this.ai) {
      const w = a.car.vehicle; const dx = w.x - cam.position.x, dy = w.y + 0.5 - cam.position.y, dz = w.z - cam.position.z; const d = Math.hypot(dx, dy, dz);
      const closing = dt > 0 ? (d - a.dist) / dt : 0; a.dist = d;
      const near = d < 115 && a.car.visual.root.visible; if (near) act++;
      if (a.panner.positionX) { a.panner.positionX.setTargetAtTime(w.x, t, 0.03); a.panner.positionY.setTargetAtTime(w.y + 0.5, t, 0.03); a.panner.positionZ.setTargetAtTime(w.z, t, 0.03); } else a.panner.setPosition(w.x, w.y + 0.5, w.z);
      const dop = clamp(1 - clamp(closing, -40, 40) / 343 * 0.7, 0.9, 1.1);
      a.voice.update(w.rpm, clamp(w.throttleEff ?? 0.6, 0, 1), near && active ? 0.9 * smoothstep(115, 80, d) : 0, dt, dop);
      // passing: the rival changes from ahead to behind (or the opposite) within a few metres
      const side = Math.sign((w.x - v.x) * ch + (w.z - v.z) * sh); const dd = Math.hypot(w.x - v.x, w.z - v.z);
      if (a.side && side && side !== a.side && dd < 9 && g.state === 'racing' && t - (S.passT[a.car.index] || -9) > 3) { S.passT[a.car.index] = t; this._event('pass', { rival: a.car.name, by: side < 0 ? 'player' : 'rival' }); }
      if (side) a.side = side;
    }
    this.stats.aiActive = act; if (act > this.stats.maxAiActive) this.stats.maxAiActive = act;
    this.bus.ai.gain.setTargetAtTime(0.5 / Math.sqrt(Math.max(1, act * 0.6)), t, 0.1);          // the pack never drowns the player
    // ---- ambience by place: sea by the distance to the shore, the rest by zone (blended over 80 m)
    const track = g.world.track; const zw = [0, 0, 0, 0]; for (const off of [-80, -40, 0, 40, 80]) zw[track.zoneIndexAt(v.s + off)] += 0.2;
    const shore = smoothstep(300, 40, g.world.terrain.coastDist(v.x, v.z));
    set(this.loops.amb_sea, 0.25 + 0.75 * shore * (0.5 + 0.5 * zw[0]));
    set(this.loops.amb_gulls, zw[0] * 0.8 * shore);
    set(this.loops.amb_wind, zw[1] * 0.75);
    set(this.loops.amb_village, zw[2] * 0.9);
    set(this.loops.amb_birds, zw[3] * 0.75); set(this.loops.amb_cicadas, zw[3] * 0.4 + zw[1] * 0.15);
    S.zoneBell -= dt * (zw[2] > 0.5 ? 1 : 0); if (S.zoneBell <= 0) { S.zoneBell = 38 + this.rand() * 30; this._shot('amb_bells', this.bus.amb, 0.9); }
  }

  // ------------------------------------------------------------------------------------------ recording (verifier)
  startRecording() { if (!this.unlocked) return false; this.rec = []; this.log = []; this.recStart = this.ctx.currentTime; this.stats.peak = 0; this.stats.limiterMinGain = 1; this.stats.maxVoices = this.stats.voices; this.stats.maxAiActive = 0; this.limiter.port.postMessage({ rec: true, resetPeak: true }); return true; }
  async stopRecording() {
    if (!this.rec) return null;
    await new Promise((res) => { this._recDone = res; this.limiter.port.postMessage({ rec: false }); setTimeout(res, 500); });
    const chunks = this.rec; this.rec = null; const seconds = this.ctx.currentTime - this.recStart; this.recStart = null;
    let n = 0; for (const c of chunks) n += c.length; const pcm = new Int16Array(n); let o = 0, peak = 0;
    for (const c of chunks) for (let i = 0; i < c.length; i++) { const s = c[i]; const a = Math.abs(s); if (a > peak) peak = a; pcm[o++] = Math.max(-32768, Math.min(32767, Math.round(s * 32767))); }
    const sr = this.ctx.sampleRate; const wav = new ArrayBuffer(44 + pcm.length * 2); const dv = new DataView(wav); const W = (p, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(p + i, s.charCodeAt(i)); };
    W(0, 'RIFF'); dv.setUint32(4, 36 + pcm.length * 2, true); W(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); W(36, 'data'); dv.setUint32(40, pcm.length * 2, true);
    new Int16Array(wav, 44).set(pcm);
    return { wav, seconds, sampleRate: sr, frames: pcm.length / 2, peak, peakDb: peak > 0 ? 20 * Math.log10(peak) : -Infinity, maxVoices: this.stats.maxVoices, maxAiVoices: this.stats.maxAiActive, limiterMinGain: this.stats.limiterMinGain, events: this.log.slice() };
  }
}
