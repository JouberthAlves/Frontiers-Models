// Game: owns the world, the renderer, the cars, the race and the main loop.
// Simulation runs in fixed 120 Hz steps (deterministic for a given sequence of inputs);
// rendering happens once per animation frame.
//
// States:  menu -> garage -> setup -> grid -> countdown -> racing -> results -> (grid | menu)
//   menu     the six cars race on their own behind the title (live track)
//   garage   the player's car turns on the sea front; car and colour are chosen here
//   setup    laps, difficulty, quality
//   grid     presentation of the grid (about 5 s), cars held
//   countdown / racing / results; "paused" is a flag on top of the last four
//   drive    dev tools only (?dev=1): free driving, no menus, no rules

import * as THREE from 'three';
import { buildWorld, validateWorld } from '../world/world.js';
import { Ground } from '../physics/ground.js';
import { Vehicle, PHYS_DT, slipstream } from '../physics/vehicle.js';
import { CAR_SPECS, CAR_ORDER } from '../physics/car-specs.js';
import { collideBarriers, collideCars } from '../physics/collisions.js';
import { Driver, DIFFICULTY, RIVAL_LEVEL, SPEC_GRIP, AUTOPILOT } from '../ai/driver.js';
import { buildSpeedProfile } from '../ai/racingline.js';
import { Gfx, QUALITY } from '../render/gfx.js';
import { Environment } from '../render/env.js';
import { Materials } from '../render/materials.js';
import { TerrainView } from '../render/terrain-view.js';
import { RoadView } from '../render/road-view.js';
import { WorldView } from '../render/world-view.js';
import { Sea } from '../render/sea.js';
import { Particles } from '../render/particles.js';
import { ReflectionProbe, LAYER_DETAIL } from '../render/probe.js';
import { GameCamera } from './camera.js';
import { Director } from './director.js';
import { Input } from './input.js';
import { Race } from './race.js';
import { Hud } from '../ui/hud.js';
import { UI } from '../ui/ui.js';
import { AudioSystem } from '../audio/audio.js';
import { clamp, smoothstep, fmtTime } from '../core/math.js';

const STORE = 'cd-options';
const LAPS = [3, 6];        // the two race lengths of the brief (the tests can run any number through the dev API)
const RESULTS_DELAY = 2.6;          // seconds between the flag and the results table

export class Game {
  constructor({ canvas, hudCanvas = null, uiRoot = null, params = {} }) {
    this.canvas = canvas; this.hudCanvas = hudCanvas; this.uiRoot = uiRoot; this.params = params;
    this.dev = !!params.dev;
    let saved = {}; try { saved = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { saved = {}; }
    const pick = (v, ok, d) => (ok(v) ? v : d);
    this.options = {
      car: pick(params.car, (v) => !!CAR_SPECS[v], pick(saved.car, (v) => !!CAR_SPECS[v], 'gt')),
      livery: clamp(parseInt(params.livery ?? saved.livery ?? 0, 10) || 0, 0, 5),
      laps: pick(Number(params.laps), (v) => LAPS.includes(v), pick(saved.laps, (v) => LAPS.includes(v), 3)),
      difficulty: pick(params.difficulty, (v) => !!DIFFICULTY[v], pick(saved.difficulty, (v) => !!DIFFICULTY[v], 'normal')),
    };
    this.qualityId = params.q ? (params.q === 'low' ? 'low' : 'high') : (saved.quality === 'low' ? 'low' : 'high');
    this.state = 'loading'; this.stateT = 0;
    this.cars = [];            // {vehicle, driver, visual, isPlayer, name, ...}
    this.player = null; this.focus = null;
    this.simTime = 0; this.acc = 0; this.timeScale = 1; this.paused = false; this.simSteps = 0;
    this.autopilot = !!params.auto;
    this.override = null;      // tests: scripted inputs for the player's car {steer, throttle, brake, handbrake, until, untilHit}
    this.overrideQueue = null; // ... and the ones that follow it [{input, seconds}]
    this.script = null;        // tests: scripted inputs by lap distance [{s, seq: [{input, steerSide?, seconds}]}], fired inside the simulation
    this.log = [];             // integrity / reset events
    this.integrity = { underTerrain: 0, throughBarrier: 0, outOfWorld: 0, wheelFar: 0, cameraInside: 0 };
    this.fps = { frames: 0, time: 0, value: 0, samples: [] };
    this.hooks = { afterStep: [], frame: [] };
    this.freezeTime = null;    // fixed render-time for reproducible captures
    this.races = 0; this._guard = 0; this._visuals = new Map();
  }

  // ------------------------------------------------------------------------------------------ loading
  async load(onProgress = () => {}) {
    const P = (label, f) => onProgress(label, f);
    const tick = () => new Promise((r) => setTimeout(r, 0));
    P('Pista', 0.02);
    this.audio = new AudioSystem(this);
    const audioLoad = this.audio.load().catch((e) => { console.error('audio samples failed to load', e); });
    const json = await (await fetch('track.json')).json();
    let populate = null;
    try { ({ populateWorld: populate } = await import('../world/populate.js')); } catch (e) { if (this.dev) console.warn('populate.js not available yet:', e.message); }
    await tick();
    this.world = buildWorld(json, { populate });
    P('Terreno', 0.16); await tick();
    this.validation = validateWorld(this.world);
    if (!this.validation.ok) { console.error('validateWorld failed:\n' + this.validation.errors.join('\n')); if (this.dev) this._devBanner(`validateWorld: ${this.validation.errors.length} erros`); }
    this.ground = new Ground(this.world);

    this.gfx = new Gfx(this.canvas, this.qualityId);
    this.scene = new THREE.Scene();
    this.env = new Environment(this.gfx, this.scene, this.world);
    await this.env.load('assets/hdri/', (f) => P('Céu', 0.16 + f * 0.14));
    this.cam = new GameCamera(this.world, this.ground);
    this.camera = this.cam.camera;
    this.camera.layers.enable(LAYER_DETAIL);
    this.env.initShadows(this.camera);
    this.probe = new ReflectionProbe(this.gfx, this.scene, this.gfx.quality.probeSize);
    this.gfx.onQuality = () => { this.env.onQualityChanged(); this._applyProbe(); };

    const M = this.materials = new Materials(this.gfx, this.env);
    M.onProgress = (a, b) => P('Texturas', 0.3 + 0.4 * (a / Math.max(1, b)));
    for (const id of TerrainView.textureSets()) M.loadSet(id);
    for (const [id, res] of RoadView.textureSets()) M.loadSet(id, res);
    for (const id of WorldView.textureSets()) M.loadSet(id);
    await M.whenLoaded();
    P('Cenário', 0.72); await tick();

    this.terrainView = new TerrainView(this.world, M, this.env);
    this.scene.add(this.terrainView.build());
    this.roadView = new RoadView(this.world, M, this.env, this.terrainView.noise);
    this.scene.add(this.roadView.build());
    P('Mar', 0.75); await tick();
    this.sea = new Sea(this.world, this.env, this.terrainView.noise);
    this.scene.add(this.sea.mesh);
    P('Vegetação e objetos', 0.77); await tick();
    this.worldView = new WorldView(this.world, M, this.env);
    this.scene.add(this.worldView.build());
    this.particles = new Particles(this);
    this.scene.add(this.particles.points);
    P('Carros', 0.84); await tick();
    const { CarMaterials, LIVERIES } = await import('../render/car/car-materials.js');
    this.carMats = new CarMaterials(this.materials); this.liveries = LIVERIES;
    // both models in every colour are prepared once: changing car in the garage is immediate and allocates nothing later
    await this._buildCars();
    this.input = new Input(window);
    this.director = new Director(this);
    this.race = new Race(this);
    this.race.onEvent = (type, data) => this._raceEvent(type, data);
    if (this.hudCanvas) { this.hud = new Hud(this.hudCanvas, this); this.hud.showFps = !!this.params.fps; }
    if (this.uiRoot) this.ui = new UI(this.uiRoot, this);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => this._visibility());
    // world matrices: everything in the scene is static except the objects listed in this.dynamic, so the automatic
    // update (a walk over every object, once per render pass) is switched off and these are updated by hand
    this.scene.updateMatrixWorld(true);
    this.scene.matrixWorldAutoUpdate = false;
    P('Shaders', 0.9); await tick();
    // pre-compile every program before the first visible frame
    this.cam.update(this.player.vehicle, 1 / 60);
    this.env.update(this.camera, 0);
    this.worldView.update(this.camera, this.gfx.quality); this.sea.update(this.camera);
    for (const o of this.dynamic) o.updateMatrixWorld(true);
    try { await this.gfx.renderer.compileAsync(this.scene, this.camera); } catch (e) { console.warn('compileAsync failed', e); }
    this.gfx.render(this.scene, this.camera, { dt: 1 / 60 });
    P('Enviando o mundo para a placa de vídeo', 0.93); await tick();
    if (!this.params.nowarm) this._prewarm();
    P('Som', 0.96);
    await audioLoad;
    P('Pronto', 1);
    this.ready = true;
    if (this.dev || !this.ui) { this.state = 'drive'; this.placeOnGrid(); } else this.goMenu();
    return this;
  }

  /**
   * Sends every geometry and texture to the GPU now. The levels of detail and distance bands that are not in the
   * scene at this moment would otherwise be uploaded the first time they come into view, in the middle of a lap
   * (a long frame every few seconds). One pass over everything into a tiny target does it.
   */
  _prewarm() {
    const r = this.gfx.renderer, scene = this.scene; const undo = []; const t0 = performance.now();
    const sc = this.worldView.scatter; let extra = 0;
    for (const c of sc.cellList) for (const t of c.tiers) for (const m of t.meshes) if (!m.parent) { sc.group.add(m); undo.push(() => sc.group.remove(m)); extra++; }
    const tmp = new THREE.Group(); scene.add(tmp); undo.push(() => scene.remove(tmp));
    for (const c of this.terrainView.chunks) for (const g of c.lods) if (g !== c.mesh.geometry) { const m = new THREE.Mesh(g, c.mesh.material); m.matrixAutoUpdate = false; m.matrixWorld.copy(c.mesh.matrixWorld); tmp.add(m); extra++; }
    scene.traverse((o) => {
      if (!o.visible) { o.visible = true; undo.push(() => { o.visible = false; }); }
      if (o.frustumCulled) { o.frustumCulled = false; undo.push(() => { o.frustumCulled = true; }); }
    });
    const cam = this.camera.clone(); cam.layers.enableAll();
    const rt = new THREE.WebGLRenderTarget(16, 16); const prev = r.getRenderTarget();
    try { r.setRenderTarget(rt); r.render(scene, cam); } catch (e) { console.warn('prewarm failed', e); }
    r.setRenderTarget(prev); rt.dispose();
    for (let i = undo.length - 1; i >= 0; i--) undo[i]();
    this.prewarmInfo = { meshesAdded: extra, ms: Math.round(performance.now() - t0), geometries: r.info.memory.geometries, textures: r.info.memory.textures };
  }

  _devBanner(text) {
    let el = document.getElementById('dev-banner');
    if (!el) { el = document.createElement('div'); el.id = 'dev-banner'; el.style.cssText = 'position:fixed;left:0;top:0;z-index:99;background:#b00;color:#fff;font:12px monospace;padding:4px 8px'; document.body.appendChild(el); }
    el.textContent = text;
  }

  // ------------------------------------------------------------------------------------------ cars
  async _visual(specId, livery) {
    const key = specId + ':' + livery.id;
    if (!this._visuals.has(key)) {
      const { CarModel } = await import('../render/car/car-model.js');
      this._visuals.set(key, await CarModel.create(CAR_SPECS[specId], this.carMats, livery));
    }
    return this._visuals.get(key);
  }

  /** the field for the current choice of car and colour: five rivals, the player in the last grid slot */
  async _buildCars() {
    const track = this.world.track; const LIV = this.liveries;
    const playerSpec = this.options.car, playerLivery = this.options.livery;
    const others = [0, 1, 2, 3, 4, 5].filter((k) => k !== playerLivery);
    const plan = [];
    for (let i = 0; i < 6; i++) {
      const isPlayer = i === 5;
      // the grid alternates the two models; the player's choice takes the last slot
      plan.push({ isPlayer, specId: isPlayer ? playerSpec : CAR_ORDER[(i + (playerSpec === 'gt' ? 1 : 0)) % 2], livery: LIV[isPlayer ? playerLivery : others[i]] });
    }
    const visuals = await Promise.all(plan.map((p) => this._visual(p.specId, p.livery)));
    // ---- from here on synchronous: the main loop never sees a half-built field
    const old = this.cars; const keep = new Set(visuals);
    for (const car of old) if (!keep.has(car.visual)) car.visual.root.removeFromParent();
    this.cars = plan.map((p, i) => {
      const spec = CAR_SPECS[p.specId]; const vehicle = new Vehicle(spec, this.ground, i); const visual = visuals[i];
      if (!visual.root.parent) this.scene.add(visual.root);
      visual.root.visible = true; visual.root.updateMatrixWorld(true);
      const driver = new Driver(vehicle, track, this.world.line, this.world.profiles[p.specId], { skill: 1, aggression: 0.6, seed: 100 + i });
      return { index: i, vehicle, visual, driver, isPlayer: p.isPlayer, specId: p.specId, livery: p.livery, name: p.isPlayer ? 'Você' : `IA ${i + 1}`, lastValidS: 0, offTime: 0, stopTime: 0, odo: 0, shift: 0 };
    });
    this.player = this.cars[5]; this.focus = this.player;
    this._vehicles = this.cars.map((c) => c.vehicle); this._probeHide = this.cars.map((c) => c.visual.root);
    this.dynamic = [...this.cars.map((c) => c.visual.root), this.env.sky, ...this.env.csm.lights, ...this.env.csm.lights.map((l) => l.target)];
    this._applyDifficulty();
    this._applyProbe();
    this.placeOnGrid();
    if (this.audio) this.audio.bindCars();
    if (this.particles) this.particles.clear();
  }

  /**
   * Pace of the rivals for the chosen difficulty: each one drives the speed profile of its own car computed for the
   * share of the grip it uses (the player's own driver is only used by the tests and by the menu).
   */
  _applyDifficulty() {
    const diff = DIFFICULTY[this.options.difficulty] || DIFFICULTY.normal; const cache = this._profiles || (this._profiles = new Map());
    const P = this.params; const mix = (r, k) => r[0] + (r[1] - r[0]) * k;
    this.cars.forEach((car, i) => {
      const base = car.isPlayer ? (P.grip ? Number(P.grip) : AUTOPILOT.grip) : mix(diff.grip, RIVAL_LEVEL[i]);
      const power = car.isPlayer ? (P.power ? Number(P.power) : AUTOPILOT.power) : mix(diff.power, RIVAL_LEVEL[i]);
      const grip = +(base + (SPEC_GRIP[car.specId] || 0)).toFixed(3);
      const key = car.specId + ':' + grip;
      if (!cache.has(key)) cache.set(key, buildSpeedProfile(this.world.track, this.world.line, CAR_SPECS[car.specId], grip));
      car.driver.setProfile(cache.get(key), grip, power); car.driver.skill = 1; car.driver.aggression = diff.aggression;
    });
  }

  /** car materials reflect the dynamic probe on High, the static sky on Low */
  _applyProbe() {
    const on = this.gfx.quality.probe; this.probe.enabled = on;
    if (on && !this.probe.texture) {
      const pv = this.player.vehicle;
      this.probe.refresh(new THREE.Vector3(pv.x, pv.y + 1.0, pv.z), this.cars.map((c) => c.visual.root));
    }
    const tex = on ? this.probe.texture : null;
    const seen = new Set();
    for (const car of this.cars) car.visual.root.traverse((o) => {
      if (!o.isMesh || seen.has(o.material) || o.material.isMeshBasicMaterial) return; seen.add(o.material);
      const m = o.material; if (m.userData.envBase === undefined) m.userData.envBase = m.envMapIntensity ?? 1;
      m.envMap = tex; m.envMapIntensity = m.userData.envBase * (on ? 1 : this.env.envIntensity);
    });
    this.probeDirty = true;
  }

  placeOnGrid() {
    const track = this.world.track; const p = {};
    this.cars.forEach((car, i) => {
      const slot = track.gridSlots[i];
      track.pos(slot.s, slot.d, p);
      // grid spawn by ray cast on the road surface (Vehicle.reset reads the ground under each wheel)
      car.vehicle.reset(p.x, p.z, p.heading); car.vehicle.frozen = false; car.vehicle.events.length = 0;
      car.lastValidS = car.vehicle.s; car.offTime = 0; car.stopTime = 0; car.odo = -i * (track.json.grid.rowGap || 8); car.shift = 0;
      car.driver.reset(); car.visual.brake = 0;
    });
    this.acc = 0; this.override = null; this.overrideQueue = null;
    this.cam.snap(); if (this.gfx) this.gfx.cutCamera();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    this.gfx.resize(w, h); this.cam.setAspect(w / h);
    if (this.hud) this.hud.resize(w, h);
  }

  // ------------------------------------------------------------------------------------------ flow
  _ui(name, data = null) {
    if (this.ui) this.ui.show(name, data);
    if (this.input) { this.input.uiMode = !!name; this.input.clearPressed(); }
    this._guard = 2;
  }
  _enter(state) { this.state = state; this.stateT = 0; }

  goMenu() {
    this.paused = false; this.audio.setPaused(false);
    this._enter('menu'); this.race.phase = 'idle';
    for (const c of this.cars) c.visual.root.visible = true;
    this.placeOnGrid(); this.worldView.setStartLights(0); this.particles.clear();
    if (this.hud) { this.hud.visible = false; this.hud.msgT = 0; }
    this.cam.mode = 'chase'; this.director.startMenu(); this.probeDirty = true;
    this.audio.setScene(0.3); this.audio.music(true);
    this._ui('menu');
  }

  _garageScene() {
    this.paused = false; this.audio.setPaused(false); this.race.phase = 'idle';
    for (const c of this.cars) { c.visual.root.visible = c.isPlayer; c.vehicle.frozen = true; c.vehicle.input.throttle = 0; }
    this.focus = this.player; this.director.enterGarage(); this.particles.clear(); this.probeDirty = true;
    if (this.hud) this.hud.visible = false;
    this.audio.setScene(0.3); this.audio.music(true);
  }
  goGarage() { if (this.state !== 'setup') this._garageScene(); this._enter('garage'); this._ui('garage'); }
  goSetup() { if (this.state !== 'garage') this._garageScene(); this._enter('setup'); this._ui('setup'); }

  /** garage: another model or colour. The field is rebuilt (cached visuals), the car stays on the show spot. */
  setPlayerCar(specId, livery) {
    if (!CAR_SPECS[specId]) return; livery = clamp(livery | 0, 0, 5);
    if (specId === this.options.car && livery === this.options.livery) return;
    this.options.car = specId; this.options.livery = livery; this.saveOptions();
    this._carsPending = (this._carsPending || Promise.resolve()).then(() => this._buildCars()).then(() => {
      if (this.state === 'garage' || this.state === 'setup') { const spin = this.director.spin; this._garageScene(); this.director.spin = spin; }
    });
    return this._carsPending;
  }

  async startRace() {
    if (this._carsPending) await this._carsPending;
    this.paused = false; this.audio.setPaused(false);
    for (const c of this.cars) c.visual.root.visible = true;
    this._applyDifficulty();
    this.race.begin(this.options.laps);            // cars on the grid, held
    this._enter('grid'); this.races++; this.focus = this.player;
    this.cam.mode = 'chase'; this.worldView.setStartLights(0); this.particles.clear(); this.probeDirty = true;
    if (this.hud) { this.hud.visible = false; this.hud.msgT = 0; }
    this.audio.setScene(1); this.audio.music(false);
    this._ui(null);
  }
  restartRace() { return this.startRace(); }

  pause() {
    if (this.paused || !(this.state === 'grid' || this.state === 'countdown' || this.state === 'racing')) return;
    this.paused = true; this.audio.setPaused(true); this._ui('pause');
  }
  resume() { if (!this.paused) return; this.paused = false; this.audio.setPaused(false); this._ui(null); }

  setQuality(id) {
    this.qualityId = id === 'low' ? 'low' : 'high';
    this.gfx.setQuality(this.qualityId); this.resize(); this.saveOptions();
  }
  setVolume(kind, v) { this.audio.setVolume(kind, v); }
  saveOptions() { try { localStorage.setItem(STORE, JSON.stringify({ ...this.options, quality: this.qualityId })); } catch (e) { /* private mode */ } }

  _visibility() {
    if (document.hidden) { this.pause(); this.audio.suspend(true); } else this.audio.suspend(false);
  }

  _raceEvent(type, data) {
    const hud = this.hud; const race = this.race;
    if (type === 'count') {
      if (this.state === 'grid') { this._enter('countdown'); this.cam.mode = 'chase'; this.cam.snap(); this.gfx.cutCamera(); if (hud) hud.visible = true; }
      this.audio.countdown(data);
    } else if (type === 'go') {
      this._enter('racing'); this.audio.go(); if (hud) hud.message('VAI!', 1.3);
    } else if (type === 'lap' && data.car === this.player.index) {
      if (data.lap < race.laps) { this.audio.lapBeep(); if (hud) hud.message(data.lap === race.laps - 1 ? 'ÚLTIMA VOLTA' : `VOLTA ${data.lap + 1}`, 2.2, fmtTime(data.time)); }
    } else if (type === 'end') {
      this._enter('results'); this.director.startFinish(); this.audio.flag();
      const me = race.results.find((r) => r.isPlayer);
      if (hud) hud.message('CHEGADA', RESULTS_DELAY + 0.4, `${me.place}º lugar`);
    }
  }

  /** tests: the next scripted input of the queue, or back to the driver */
  _nextOverride() {
    const q = this.overrideQueue; const n = q && q.length ? q.shift() : null;
    this.override = n ? { ...n.input, until: this.simTime + n.seconds } : null;
  }

  // ------------------------------------------------------------------------------------------ simulation
  stepSim() {
    const dt = PHYS_DT; const track = this.world.track; const st = this.state; const L = track.length;
    const vehicles = this._vehicles; const race = this.race;
    const human = !this.autopilot && (st === 'racing' || st === 'countdown' || st === 'grid' || st === 'drive');
    slipstream(vehicles, dt);
    for (const car of this.cars) {
      const v = car.vehicle;
      if (car.isPlayer && human) {
        const inp = this.input; v.input.steer = inp.steer; v.input.throttle = inp.throttle; v.input.brake = inp.brake; v.input.handbrake = inp.handbrake;
      } else {
        car.driver.update(dt, vehicles);
        // held on the grid: the engines idle during the presentation and are blipped while the lights come on
        if (v.frozen) v.input.throttle = race.phase === 'countdown' ? smoothstep(0.4, 2.4, race.t) * (0.2 + 0.6 * Math.max(0, Math.sin(race.t * 6.0 + car.index * 1.9))) : 0;
        if (car.isPlayer && this.script && race.player && race.player.armed && !this.override) {
          // (decided here, on the fixed step, and not by a timer outside: the same lap every time it is recorded)
          for (const ev of this.script) if (!ev.done && v.s >= ev.s && v.s < ev.s + 60) {
            ev.done = true; ev.firedAt = Math.round(v.s); const side = v.d > 0 ? 1 : -1;
            this.overrideQueue = ev.seq.map((q) => ({ seconds: q.seconds, input: q.steerSide !== undefined ? { ...q.input, steer: q.steerSide * side } : q.input }));
            this._nextOverride(); break;
          }
        }
        if (car.isPlayer && this.override) {
          const o = this.override; if (this.simTime >= o.until) this._nextOverride();
          else { for (const k of ['steer', 'throttle', 'brake', 'handbrake']) if (o[k] !== undefined) v.input[k] = o[k]; }
        }
      }
      const s0 = v.s;
      v.step(dt);
      if (v.shiftEvent) car.shift = v.shiftEvent;
      collideBarriers(v, track, dt);
      if (car.isPlayer && this.override && this.override.untilHit && v.events.some((e) => e.type === 'wall')) this._nextOverride();
      let ds = v.s - s0; if (ds < -L / 2) ds += L; else if (ds > L / 2) ds -= L;
      if (ds > 0 && ds < 30) car.odo += ds;
    }
    collideCars(vehicles);
    for (const car of this.cars) this._integrity(car, dt);
    if (st === 'grid' || st === 'countdown' || st === 'racing' || st === 'results') race.step(dt);
    this.simTime += dt; this.simSteps++;
    for (const h of this.hooks.afterStep) h(dt);
  }

  /** runtime invariants of section 3.3: checked every step, violations are logged and the car is reset */
  _integrity(car, dt) {
    const v = car.vehicle; const track = this.world.track; const t = this.world.terrain;
    let reason = null;
    if (!isFinite(v.x) || !isFinite(v.y) || !isFinite(v.z) || v.y < -40 || !t.inBounds(v.x, v.z)) { reason = 'out-of-world'; this.integrity.outOfWorld++; }
    else if (v.y < v.centerGroundY - 0.3) { reason = 'under-terrain'; this.integrity.underTerrain++; }
    else {
      const side = v.d < 0 ? 0 : 1;
      if (Math.abs(v.d) > track.barrierDist(side, v.s) + 1.2) { reason = 'through-barrier'; this.integrity.throughBarrier++; }
    }
    if (!reason) {
      // every wheel touches a surface or is closer than 1.5 m to it, unless the car is really airborne
      for (let i = 0; i < 4; i++) {
        const w = v.wheels[i]; const att = v.y + v.pitch * v.wheelPos[i][0] - v.roll * v.wheelPos[i][1];
        if (att - w.groundY > 1.5 && v.airTime <= 0) { this.integrity.wheelFar++; reason = 'wheel-far'; break; }
      }
    }
    if (reason) { this.resetCar(car, reason, true); return; }
    const live = this.state === 'racing' || this.state === 'menu' || this.state === 'results';
    if (v.onRoad || Math.abs(v.d) <= track.spline.sampleArr(track.spline.half, v.s) + 1) { car.lastValidS = v.s; car.offTime = 0; } else car.offTime += dt;
    car.stopTime = (v.speed < 0.8 && !v.frozen && live) ? car.stopTime + dt : 0;
    if (live && (car.offTime > 3 || car.stopTime > 3)) this.resetCar(car, car.offTime > 3 ? 'off-track-3s' : 'stopped-3s', false);
  }

  resetCar(car, reason, integrity) {
    const track = this.world.track; const p = {};
    const s = car.lastValidS; const half = track.spline.sampleArr(track.spline.half, s);
    track.pos(s, clamp(car.vehicle.d || 0, -half + 1.6, half - 1.6), p);
    this.log.push({ t: +this.simTime.toFixed(3), race: this.races, state: this.state, car: car.index, name: car.name, reason, integrity: !!integrity, s: +s.toFixed(1), from: [+(+car.vehicle.x).toFixed(1), +(+car.vehicle.y).toFixed(1), +(+car.vehicle.z).toFixed(1)] });
    const frozen = car.vehicle.frozen;
    car.vehicle.reset(p.x, p.z, p.heading); car.vehicle.frozen = frozen;
    car.offTime = 0; car.stopTime = 0;
    if (car === this.focus) { this.cam.snap(); this.gfx.cutCamera(); }
    if (this.dev) console.warn('car reset', car.name, reason);
  }

  // ------------------------------------------------------------------------------------------ main loop
  start() {
    let last = performance.now();
    const cap = Number(this.params.cap) || 0;
    if (cap > 0) {
      // ?cap=60 (used by the verifier): frames on a fixed clock instead of the display's, so that a measured frame
      // rate means the same on a 60, 100 or 144 Hz screen. The wait for each deadline cannot be a timer (browser
      // timers follow the timer resolution of the system: a few milliseconds late on a quiet machine) and cannot
      // be a tight loop of messages either (tens of thousands of event objects per second: the garbage collector
      // then produces the long frames that were to be measured). So: wait in place for half a millisecond, looking
      // at the clock every few microseconds, give the browser a turn, and so on until the deadline.
      // A frame that overruns its slot is followed at once by the next one, so that a late frame costs its own
      // time and not a whole extra period.
      const period = 1000 / cap; let next = last + period; const ch = new MessageChannel(); let sink = 0;
      const turn = () => ch.port2.postMessage(0);
      const tick = () => {
        let now = performance.now();
        if (now < next) {
          const until = Math.min(next, now + 0.5);
          // (the sum lives in a local: a captured variable would be boxed on every addition)
          while (now < until) { let acc = 0; for (let i = 0; i < 20000; i++) acc = (acc + i) | 0; sink = acc & 1023; now = performance.now(); }
          if (now < next) { turn(); return; }
        }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; next += period; if (next < now - period) next = now;
        try { this.frame(dt); } finally { turn(); }      // an error in one frame must not stop the clock
      };
      ch.port1.onmessage = tick; this._capSink = () => sink; setTimeout(tick, 0);
      return;
    }
    const loop = (now) => {
      this._raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      this.frame(dt);
    };
    this._raf = requestAnimationFrame(loop);
  }

  /** edge-triggered controls outside the menus */
  _controls() {
    const inp = this.input; const st = this.state;
    if (this._guard > 0) { this._guard--; inp.clearPressed(); return; }
    if (this.ui && this.ui.open) {
      this.ui.pad(inp);
      if (this.paused && inp.take('pause')) this.resume();
      inp.clearPressed(); return;
    }
    if (inp.take('pause')) this.pause();
    if (st === 'grid') { if (inp.take('confirm') || inp.take('handbrake')) this.race.skipPresentation(); }
    else if (st === 'results') { if (inp.take('confirm') || inp.take('handbrake')) this.stateT = Math.max(this.stateT, RESULTS_DELAY); }
    if (st === 'racing' || st === 'countdown' || st === 'drive') {
      if (inp.take('camera')) { this.cam.toggle(); this.gfx.cutCamera(); }
      if (inp.take('reset') && st !== 'countdown') this.resetCar(this.player, 'manual', false);
    }
    inp.clearPressed();
  }

  frame(dt) {
    if (!this.ready || this.holdFrame) return;   // holdFrame: captures render explicitly through the dev API
    this.frameStart = performance.now();          // (read by the frame-rate probe of the tests)
    const pv = this.player.vehicle;
    this.input.uiMode = !!(this.ui && this.ui.open);
    this.input.poll(dt, pv.speed);
    this._controls();
    const st = this.state;
    this.stateT += dt;
    if (this.state === 'results' && this.ui && !this.ui.open && this.stateT >= RESULTS_DELAY) { if (this.hud) this.hud.visible = false; this._ui('results', this.race.results); }
    const t0 = performance.now();
    const simulating = !this.paused && st !== 'garage' && st !== 'setup' && st !== 'loading';
    if (simulating) {
      this.acc += dt * this.timeScale;
      let n = 0; const cap = Math.max(10, Math.ceil(this.timeScale * 3));     // more than 10 only when a test accelerates time
      while (this.acc >= PHYS_DT && n < cap) { this.stepSim(); this.acc -= PHYS_DT; n++; }
      if (n === cap) this.acc = 0;
    }
    const t1 = performance.now();
    this.renderFrame(dt, this.manualCamera ? { keepCamera: true, blurScale: 0 } : {});
    const t2 = performance.now(); const T = this.timing || (this.timing = { sim: 0, render: 0 });
    T.sim += (t1 - t0 - T.sim) * 0.05; T.render += (t2 - t1 - T.render) * 0.05; T.lastSim = t1 - t0; T.lastRender = t2 - t1;
    // sound and effects read what happened in this frame's steps, then the event lists are emptied
    this.particles.update(this.paused ? 0 : dt * this.timeScale, this.camera, this.gfx.quality, simulating);
    this.audio.update(dt);
    for (const car of this.cars) car.vehicle.events.length = 0;
    // the figures of the HUD change no faster than every other frame
    if (this.hud) { this._hudDt = (this._hudDt || 0) + dt; if ((this._hudN = (this._hudN | 0) + 1) & 1) { this.hud.draw(this._hudDt); this._hudDt = 0; } }
    // fps
    const f = this.fps; f.frames++; f.time += dt;
    if (f.time >= 0.5) { f.value = f.frames / f.time; f.frames = 0; f.time = 0; }
    for (const h of this.hooks.frame) h(dt);
  }

  /**
   * Exposure by place, like a photographer would: the village street and the wood lie in the shade of the
   * low sun and get a longer exposure than the open sea front. Blended over 70 m around the zone limits
   * and eased in time; a camera cut takes the target at once.
   */
  _placeExposure(dt) {
    const track = this.world.track, sp = track.spline; const cam = this.camera.position;
    // local search from the last sample, global search after a jump (camera cut, teleport in the tests)
    const lp = this._expLast || (this._expLast = { x: 1e9, z: 1e9 }); const jumped = Math.hypot(cam.x - lp.x, cam.z - lp.z) > 25; lp.x = cam.x; lp.z = cam.z;
    const pr = sp.project(cam.x, cam.z, jumped ? -1 : (this._expHint ?? -1), this._expPr || (this._expPr = {})); this._expHint = pr.i;
    const K = [1.0, 1.0, 1.55, 1.36], SH = [1.0, 1.0, 1.3, 2.1];      // exposure, strength of the sun shafts (dusty air under the trees)
    let w = 0, acc = 0, sh = 0;
    for (const off of [-70, -35, 0, 35, 70]) { const z = track.zoneIndexAt(pr.s + off); acc += K[z]; sh += SH[z]; w++; }
    const target = acc / w, shTarget = sh / w;
    const g = this.gfx; const snap = this.gfx.cut || this.holdFrame || !this._expInit; const k = snap ? 1 : Math.min(1, dt * 1.5);
    g.exposureScale += (target - g.exposureScale) * k; g.shaftScale += (shTarget - g.shaftScale) * k;
    this._expInit = true;
  }

  /** the camera of the current state; returns the strength of the motion blur */
  _camera(dt) {
    const st = this.state; const pv = this.player.vehicle; this.focus = this.player;
    let blur = 0;
    if (st === 'menu') { this.focus = this.director.menu(dt); blur = 0.6 * Math.min(1, this.focus.vehicle.speed / 18); }
    else if (st === 'garage' || st === 'setup') this.director.garage(dt);
    else if (st === 'grid') { this.director.grid(dt); blur = 0.25; }
    else if (st === 'results') { this.director.finish(dt); blur = Math.min(1, pv.speed / 18); }
    else {
      const rough = Math.max(...pv.wheels.map((w) => (w.contact ? [0, 1, 0.5, 0.45, 0.55, 0.2, 0.05, 0.1][w.surf] || 0 : 0))) * Math.min(1, pv.speed / 25);
      this.cam.update(pv, dt, { rough });
      blur = Math.min(1, pv.speed / 18);
    }
    if (this.cam.lastCheck.terrain < 0.05 || this.cam.lastCheck.barrier < 0) this.integrity.cameraInside++;
    return blur;
  }

  renderFrame(dt, opts = {}) {
    let blurScale = 0;
    if (!opts.keepCamera) blurScale = this._camera(dt);
    for (const car of this.cars) if (car.visual.root.visible) car.visual.update(car.vehicle, dt, this.camera, this.gfx.quality);
    this.worldView.setStartLights(this.state === 'countdown' ? this.race.light : 0);
    if (this.freezeTime !== null) this.env.uniforms.uTime.value = this.freezeTime;
    this._placeExposure(dt);
    if (this.gfx.cut || this.holdFrame) this.env.shadowRefresh = 2;   // camera cuts and still captures redraw every cascade
    this.env.update(this.camera, this.freezeTime !== null ? 0 : dt);
    this.terrainView.update(this.camera, this.gfx.quality);
    this.worldView.update(this.camera, this.gfx.quality);
    this.sea.update(this.camera);
    for (const o of this.dynamic) o.updateMatrixWorld(true);
    if (this.probe.enabled) {
      const fv = this.focus.vehicle; const pp = this._probePos || (this._probePos = new THREE.Vector3());
      pp.set(fv.x, fv.y + 1.0, fv.z);
      if (this.probeDirty || this.gfx.cut) { this.probe.refresh(pp, this._probeHide); this.probeDirty = false; } else this.probe.update(pp, this._probeHide);
    }
    this.gfx.render(this.scene, this.camera, { dt, blurScale: opts.blurScale ?? blurScale, fixedNoise: this.freezeTime !== null });
  }
}

export { QUALITY, DIFFICULTY };
