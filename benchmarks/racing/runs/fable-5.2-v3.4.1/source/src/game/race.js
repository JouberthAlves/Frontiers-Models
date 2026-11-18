// Race rules: grid, 3-2-1, checkpoints in sequence, laps, live positions, finish and results.
//  - 34 checkpoints along the spline; a lap only counts if every one was crossed in order
//    (a car that cuts the track keeps waiting for the checkpoint it skipped);
//  - positions come from the validated progress (laps + checkpoints + distance since the last one);
//  - the cars are held on the grid until the lights go out: jumping the start is impossible;
//  - the race ends when the player completes the last lap; rivals still running get a projected
//    time, shown with "≈".

import { clamp } from '../core/math.js';

export const COUNTDOWN = 3.0;      // seconds of 3-2-1 before the start
export const GRID_SHOW = 5.0;      // seconds of grid presentation

const CLEAR = 5.5;      // m: a car length and a little more

export class Race {
  constructor(game) {
    this.game = game; this.track = game.world.track; this.L = this.track.length;
    this.cps = this.track.checkpoints; this.cpGap = this.L / this.cps.length;
    this.laps = 3; this.phase = 'idle';      // idle | grid | countdown | racing | finished
    this.t = 0; this.clock = 0; this.entries = []; this.events = []; this.overtakes = 0; this.order = [];
    this.light = 0; this.count = 0;
  }

  /** puts the field on the grid and starts the presentation */
  begin(laps) {
    const g = this.game; this.laps = laps; this.phase = 'grid'; this.t = 0; this.clock = 0; this.events = []; this.overtakes = 0; this.light = 0; this.count = 0; this.results = null;
    g.placeOnGrid();
    this.entries = g.cars.map((car, i) => ({
      car, index: i, name: car.name, isPlayer: car.isPlayer, lapsDone: 0, armed: false, cpNext: 0, cpLastS: car.vehicle.s, prevS: car.vehicle.s,
      lapStart: 0, lapTimes: [], best: null, finished: false, finishTime: null, projected: false, progress: -1e9, place: i + 1, grid: i + 1,
      dist: 0, stuck: 0, off: 0, maxStuck: 0, maxOff: 0,
    }));
    for (const e of this.entries) { e.car.vehicle.frozen = true; e.car.entry = e; }
    this.order = this.entries.slice(); this._rank(true);
  }

  skipPresentation() { if (this.phase === 'grid') this.t = GRID_SHOW; }

  /** tests and captures: after cars were placed by hand, rebuild the progress of every entry from where it is on the lap */
  resync(lapsDone = 0, clock = null) {
    const n = this.cps.length;
    for (const e of this.entries) {
      const s = e.car.vehicle.s; const k = Math.min(n - 1, Math.floor(s / this.cpGap));
      e.armed = true; e.lapsDone = lapsDone; e.cpNext = (k + 1) % n; e.cpLastS = this.cps[k].s; e.prevS = s;
    }
    if (clock !== null) this.clock = clock;
    this._rank(true);
  }

  /** advances the rules by one physics step (called after the cars have moved) */
  step(dt) {
    const g = this.game;
    if (this.phase === 'grid') { this.t += dt; if (this.t >= GRID_SHOW) { this.phase = 'countdown'; this.t = 0; this.count = 3; this._event('count', 3); } return; }
    if (this.phase === 'countdown') {
      this.t += dt; const left = COUNTDOWN - this.t; const c = Math.ceil(left);
      this.light = clamp(Math.floor(this.t / COUNTDOWN * 5) + 1, 0, 5);
      if (c !== this.count && c > 0) { this.count = c; this._event('count', c); }
      if (left <= 0) { this.phase = 'racing'; this.clock = 0; this.light = 0; this.count = 0; for (const e of this.entries) e.car.vehicle.frozen = false; this._event('go'); }
      return;
    }
    if (this.phase !== 'racing' && this.phase !== 'finished') return;
    this.clock += dt;
    for (const e of this.entries) this._track(e, dt);
    this._rank(false);
  }

  _track(e, dt) {
    const v = e.car.vehicle; const s = v.s, L = this.L; const n = this.cps.length;
    let ds = s - e.prevS; if (ds < -L / 2) ds += L; else if (ds > L / 2) ds -= L;
    // checkpoints are only taken moving forwards, a short step at a time (a teleport crosses nothing)
    if (ds > 0 && ds < 30) {
      for (let guard = 0; guard < 3; guard++) {
        const cp = this.cps[e.cpNext]; let rel = cp.s - e.prevS; if (rel < -L / 2) rel += L; else if (rel > L / 2) rel -= L;
        if (rel <= 0 || rel > ds) break;
        e.cpLastS = cp.s;
        if (e.cpNext === 0) { if (e.armed) this._lap(e); else { e.armed = true; e.lapStart = 0; } }
        e.cpNext = (e.cpNext + 1) % n;
      }
      e.dist += ds;
    }
    e.prevS = s;
    // validated progress: never further than the next checkpoint the car still owes
    let since = s - e.cpLastS; if (since < -L / 2) since += L; else if (since > L / 2) since -= L;
    const done = e.armed ? ((e.cpNext + n - 1) % n) * this.cpGap : -this.cpGap;
    e.progress = e.lapsDone * L + done + clamp(since, 0, this.cpGap);
    if (!e.armed) e.progress = -Math.max(0, L - s);
    // health statistics for the tests: longest time stopped / off the track while racing
    if (this.phase === 'racing' && !e.finished) {
      e.stuck = v.speed < 1.0 ? e.stuck + dt : 0; e.maxStuck = Math.max(e.maxStuck, e.stuck);
      const half = this.track.spline.sampleArr(this.track.spline.half, s);
      e.off = Math.abs(v.d) > half + 1.5 ? e.off + dt : 0; e.maxOff = Math.max(e.maxOff, e.off);
    }
  }

  _lap(e) {
    const t = this.clock - e.lapStart; e.lapTimes.push(t); e.lapStart = this.clock; e.lapsDone++;
    if (e.best === null || t < e.best) e.best = t;
    this._event('lap', { car: e.index, lap: e.lapsDone, time: t });
    if (e.lapsDone >= this.laps && !e.finished) {
      e.finished = true; e.finishTime = this.clock; this._event('finish', { car: e.index, time: this.clock });
      if (e.isPlayer) this._end();
    }
  }

  /** the player has finished: classify everybody; cars still running get a projected time */
  _end() {
    this.phase = 'finished';
    for (const e of this.entries) {
      if (e.finished) continue;
      const total = this.laps * this.L; const doneDist = Math.max(1, e.progress); const avg = doneDist / Math.max(1, this.clock);
      e.finishTime = this.clock + Math.max(0, total - e.progress) / Math.max(5, avg); e.projected = true;
    }
    this.results = this.entries.slice().sort((a, b) => a.finishTime - b.finishTime).map((e, i) => ({
      place: i + 1, name: e.name, isPlayer: e.isPlayer, car: e.car.specId, livery: e.car.livery.id, time: e.finishTime, projected: e.projected,
      best: e.best, laps: e.lapsDone, lapTimes: e.lapTimes.slice(),
    }));
    this._event('end');
  }

  _rank(initial) {
    this.order.sort((a, b) => (b.finished - a.finished) || (a.finished && b.finished ? a.finishTime - b.finishTime : b.progress - a.progress));
    this.order.forEach((e, i) => { e.place = i + 1; });
    if (initial) this.pairs = new Map();
    if (initial || this.phase === 'racing') {
      // an overtake counts when it is done: a car that was behind another is now a full length clear of it
      // (two cars trading the nose side by side through a corner are a fight, not a string of overtakes)
      const es = this.entries;
      for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
        const a = es[i], b = es[j]; if (a.finished || b.finished) continue;
        const key = i * 16 + j; const d = a.progress - b.progress; const lead = this.pairs.get(key);
        if (lead === undefined) this.pairs.set(key, d >= 0 ? i : j);
        else if (lead === i && d < -CLEAR) { this.pairs.set(key, j); if (d > -30) this._overtake(b, a); }
        else if (lead === j && d > CLEAR) { this.pairs.set(key, i); if (d < 30) this._overtake(a, b); }
      }
    }
  }
  _overtake(by, of) { this.overtakes++; this._event('overtake', { by: by.index, of: of.index, ai: !by.isPlayer && !of.isPlayer }); }

  _event(type, data = null) { this.events.push({ t: +this.clock.toFixed(3), type, data }); if (this.onEvent) this.onEvent(type, data); }

  get player() { return this.entries.find((e) => e.isPlayer); }
  /** time of the current lap of an entry */
  lapTime(e) { return e.armed ? this.clock - e.lapStart : this.clock; }
  summary() {
    return {
      phase: this.phase, laps: this.laps, clock: +this.clock.toFixed(3), overtakes: this.overtakes,
      aiOvertakes: this.events.filter((ev) => ev.type === 'overtake' && ev.data.ai).length,
      entries: this.entries.map((e) => ({ index: e.index, name: e.name, player: e.isPlayer, place: e.place, lapsDone: e.lapsDone, cpNext: e.cpNext, best: e.best, lapTimes: e.lapTimes, finished: e.finished, finishTime: e.finishTime, projected: e.projected, maxStuck: +e.maxStuck.toFixed(2), maxOff: +e.maxOff.toFixed(2), progress: +e.progress.toFixed(1) })),
      results: this.results || null,
    };
  }
}
