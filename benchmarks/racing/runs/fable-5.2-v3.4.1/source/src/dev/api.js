// Test / capture hooks used by `npm run verify` and the dev tools (window.__api). They drive the
// real game: the same simulation steps, the same renderer. Nothing here is used in normal play.

import * as THREE from 'three';
import { PHYS_DT } from '../physics/vehicle.js';
import { sceneAudit } from './scene-audit.js';

export function installDevApi(game) {
  const tmp = {};
  const api = {
    game,
    get ready() { return !!game.ready; },
    info() {
      return {
        gpu: game.gfx.gpu, quality: game.gfx.quality.id, size: [game.gfx.width, game.gfx.height], internal: [game.gfx.iw, game.gfx.ih],
        trackLength: game.world.track.length, validation: { ok: game.validation.ok, errors: game.validation.errors, checks: game.validation.checks },
        cars: game.cars.map((c) => ({ index: c.index, name: c.name, spec: c.specId, player: c.isPlayer })),
      };
    },
    state() {
      return {
        t: game.simTime, steps: game.simSteps, state: game.state, fps: game.fps.value, integrity: { ...game.integrity }, log: game.log.slice(-50), camViolations: game.cam.violations,
        draw: { ...game.gfx.stats }, timing: game.timing ? { sim: +game.timing.sim.toFixed(2), render: +game.timing.render.toFixed(2) } : null,
        cars: game.cars.map((c) => { const v = c.vehicle; return { i: c.index, s: v.s, d: v.d, x: v.x, y: v.y, z: v.z, speed: v.speed, gear: v.gear, rpm: v.rpm, onRoad: v.onRoad, air: v.airTime }; }),
      };
    },
    pause(b = true) { game.paused = b; },
    /** stop the animation-frame rendering: the canvas keeps the last frame rendered through render() */
    hold(b = true) { game.holdFrame = b; },
    autopilot(b = true) { game.autopilot = b; },
    timeScale(k) { game.timeScale = k; },
    /** advance the simulation by n fixed steps without rendering */
    step(n = 1) { for (let i = 0; i < n; i++) game.stepSim(); return game.simTime; },
    /** put a car on the track at lap distance s, lateral offset d, with a given speed (m/s) */
    place(index, s, d = 0, speed = 0) {
      const car = game.cars[index]; const p = game.world.track.pos(s, d, tmp);
      car.vehicle.reset(p.x, p.z, p.heading, null, speed);
      car.lastValidS = car.vehicle.s; car.offTime = 0; car.stopTime = 0;
      // the driver starts from a clean slate too, so that a placed scene is the same on every run
      car.driver.reset(); car.visual.brake = 0;
      if (car.isPlayer) { game.cam.snap(); game.gfx.cutCamera(); }
      return { x: p.x, y: car.vehicle.y, z: p.z, heading: p.heading };
    },
    /** the whole field in racing order around lap distance s: the player in the middle of the pack */
    pack(s, speed = 50, layout = [[16, -2.3], [33, 1.5], [55, -0.8], [-13, 2.4], [84, 0.6]], playerD = 1.2) {
      let k = 0;
      game.cars.forEach((c) => { if (c.isPlayer) api.place(c.index, s, playerD, speed); else { const o = layout[k++ % layout.length]; api.place(c.index, s + o[0], o[1], speed); } });
    },
    /** fixed render clock (sea, wind, noise) for reproducible stills; null = live */
    freezeTime(t) { game.freezeTime = t; },
    /** free camera pose; pass null to return to the game camera */
    pose(pos, look, fov = 60) {
      if (!pos) { game.manualCamera = false; game.cam.snap(); game.gfx.cutCamera(); return; }
      game.manualCamera = true;
      const cam = game.camera; cam.position.set(pos[0], pos[1], pos[2]); cam.up.set(0, 1, 0); cam.fov = fov; cam.updateProjectionMatrix();
      cam.lookAt(new THREE.Vector3(look[0], look[1], look[2])); game.gfx.cutCamera();
    },
    /** top view of the whole lap, north up */
    topView(margin = 1.12) {
      const b = game.world.track.spline.bounds; const cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
      const cam = game.camera; const fov = 24; const aspect = cam.aspect;
      const halfH = Math.max((b.maxZ - b.minZ) / 2 + 90, ((b.maxX - b.minX) / 2 + 90) / aspect) * margin;
      const h = halfH / Math.tan(THREE.MathUtils.degToRad(fov / 2));
      game.manualCamera = true; cam.position.set(cx, h, cz); cam.up.set(0, 0, -1); cam.fov = fov; cam.updateProjectionMatrix(); cam.lookAt(cx, 0, cz); game.gfx.cutCamera();
      return { cx, cz, height: h };
    },
    /** render one frame now (used while paused); with a manual pose the chase camera is left alone */
    render(dt = 1 / 60, blurScale) {
      game.renderFrame(dt, { keepCamera: !!game.manualCamera, blurScale: game.manualCamera ? (blurScale ?? 0) : blurScale });
      if (game.hud) game.hud.draw(0);
      return game.gfx.stats;
    },
    carPose(index) { const v = game.cars[index].vehicle; return { x: v.x, y: v.y, z: v.z, heading: v.heading, spec: v.spec.id, livery: game.cars[index].livery.id }; },
    /** camera on an orbit around a car: azimuth measured from the car's nose (deg, + towards its right), elevation (deg) */
    orbit(index, az, el, dist, fov = 40, lookUp = 0.55) {
      const v = game.cars[index].vehicle; const a = v.heading + az * Math.PI / 180, e = el * Math.PI / 180;
      const pos = [v.x + Math.cos(a) * Math.cos(e) * dist, v.y + lookUp + Math.sin(e) * dist, v.z + Math.sin(a) * Math.cos(e) * dist];
      api.pose(pos, [v.x, v.y + lookUp, v.z], fov);
      return pos;
    },
    skyFraction() { return game.gfx.measureSky(); },
    /** distance fog on / off (the inspection map is rendered without it) */
    fog(on = true) { game.env.uniforms.uFog.value.w = on ? 1 : 0; },
    /** inspection map: no fog and no sun glint on the sea (seen from straight above it is only a white patch) */
    mapMode(on = true) { api.fog(!on); const u = game.sea.material.uniforms.uGlint; if (u) u.value = on ? 0 : 1; game.worldView.scatter.overview = !!on; },
    /** look-development knobs (dev only) */
    look(o = {}) {
      const f = game.gfx.mats.final.uniforms;
      if (o.tonemap !== undefined) f.uTonemap.value = o.tonemap;
      if (o.exposure !== undefined) game.gfx.exposure = o.exposure;
      if (o.saturation !== undefined) f.uSaturation.value = o.saturation;
      if (o.contrast !== undefined) f.uContrast.value = o.contrast;
      if (o.sun !== undefined) { game.env.sunIntensity = o.sun; game.env.csm.lights.forEach((l) => { l.intensity = o.sun; }); }
      if (o.env !== undefined) { game.env.envIntensity = o.env; game.scene.environmentIntensity = o.env; }
      if (o.sky !== undefined) game.env.uniforms.uSkyK.value = o.sky;
      return { exposure: game.gfx.exposure, sun: game.env.sunIntensity, env: game.scene.environmentIntensity };
    },
    setQuality(id) { game.qualityId = id === 'low' ? 'low' : 'high'; game.gfx.setQuality(id); game.resize(); },
    // ---------------------------------------------------------------- flow, race and sound (tests)
    flow() {
      const a = game.audio;
      return {
        state: game.state, paused: game.paused, screen: game.ui ? game.ui.screen : null, races: game.races, options: { ...game.options, quality: game.qualityId },
        race: game.race ? game.race.summary() : null, particles: game.particles ? game.particles.stats.alive : 0,
        audio: a ? { ready: a.ready, unlocked: a.unlocked, ctx: a.ctx ? a.ctx.state : null, sampleRate: a.ctx ? a.ctx.sampleRate : null, ...a.stats, engineBuffers: a.engine ? [...a.engine.sets.on, ...a.engine.sets.off].filter((b) => b.src.buffer instanceof AudioBuffer).length : 0, buffers: Object.keys(a.buffers).length, tap: !a.noTap } : null,
        heap: performance.memory ? performance.memory.usedJSHeapSize : null,
      };
    },
    /** audit of the loaded scene (test 8 of the verifier) */
    sceneStats() { return sceneAudit(game); },
    click(id) { const el = document.getElementById(id); if (!el) return false; el.click(); return true; },
    skipGrid() { game.race.skipPresentation(); },
    /** scripted inputs for the player's car for a while (the autopilot must be on): a real wall touch, a real slide */
    drive(o, seconds) { game.overrideQueue = null; game.override = { ...o, until: game.simTime + seconds }; },
    /** scripted inputs one after the other: [{input, seconds}]; an input with untilHit ends when the car touches a barrier */
    driveSeq(list) { game.overrideQueue = list.slice(); game._nextOverride(); },
    /** scripted inputs by lap distance of the player's first lap: [{s, what, seq: [{input, steerSide?, seconds}]}] (steerSide: towards the nearer barrier) */
    script(list) { game.script = list ? list.map((e) => ({ ...e, done: false, firedAt: null })) : null; },
    scriptFired() { return (game.script || []).filter((e) => e.done).map((e) => ({ what: e.what, s: e.firedAt })); },
    /** a race in progress for the captures: started through the game flow, then the field is placed by hand */
    async raceNow(laps = 3) {
      game.options.laps = laps; await game.startRace(); game.race.skipPresentation();
      for (let i = 0; i < 2000 && game.race.phase !== 'racing'; i++) game.stepSim();
      return game.state;
    },
    resync(lapsDone = 1, clock = null) { game.race.resync(lapsDone, clock); },
    /** frame-time statistics of the live game over a few seconds (the frame rate is capped by the display) */
    /**
     * Frame pacing over a few seconds. A frame time is the interval between the starts of two consecutive frames:
     * the step the game animates with, and what a display with vertical sync shows (a frame that takes 6 ms and
     * one that takes 12 ms are both on time; one that overruns its slot delays the next start and counts in full).
     */
    measureFps(seconds = 3) {
      return new Promise((resolve) => {
        // (the first frame seen only sets the clock: the game may have been held still for a capture until now)
        const times = []; let last = null, t0 = null; let sim = 0, render = 0, k = 0;
        const h = () => {
          const now = game.frameStart; if (last === null) { last = t0 = now; return; }
          times.push(now - last); last = now;
          if (game.timing) { sim += game.timing.lastSim; render += game.timing.lastRender; k++; }
          if (now - t0 < seconds * 1000 || times.length < 2) return;
          game.hooks.frame.splice(game.hooks.frame.indexOf(h), 1);
          const s = times.slice().sort((a, b) => a - b), n = s.length, sum = s.reduce((a, b) => a + b, 0); const worst = s.slice(n - Math.max(1, Math.round(n * 0.01)));
          resolve({ frames: n, seconds: +(sum / 1000).toFixed(2), fps: +(n / (sum / 1000)).toFixed(1), low1: +(1000 / (worst.reduce((a, b) => a + b, 0) / worst.length)).toFixed(1), frameMsMean: +(sum / n).toFixed(2), frameMsP99: +s[Math.floor(n * 0.99)].toFixed(1), frameMsMax: +s[n - 1].toFixed(1),
            frameTime: 'interval between the starts of consecutive frames',
            cpuMs: k ? { sim: +(sim / k).toFixed(2), render: +(render / k).toFixed(2) } : null, draw: { ...game.gfx.stats } });
        };
        game.hooks.frame.push(h);
      });
    },
    /** records what the player sees (3D view + HUD) and hears (master bus after the limiter) to a WebM */
    async videoStart({ fps = 30, bitrate = 3200000 } = {}) {
      const W = game.gfx.width, H = game.gfx.height; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
      const draw = () => { ctx.drawImage(game.canvas, 0, 0, W, H); if (game.hudCanvas) ctx.drawImage(game.hudCanvas, 0, 0, W, H); };
      game.hooks.frame.push(draw);
      const stream = cv.captureStream(fps); const a = game.audio; let dest = null;
      if (a && a.unlocked) { dest = a.ctx.createMediaStreamDestination(); a.limiter.connect(dest); for (const t of dest.stream.getAudioTracks()) stream.addTrack(t); }
      const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrate, audioBitsPerSecond: 128000 }); const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.start(1000); api._video = { rec, chunks, draw, dest, mime, t0: performance.now(), W, H };
      return { mime, width: W, height: H, audio: !!dest };
    },
    async videoStop() {
      const v = api._video; if (!v) return null;
      await new Promise((res) => { v.rec.onstop = res; v.rec.stop(); });
      game.hooks.frame.splice(game.hooks.frame.indexOf(v.draw), 1);
      if (v.dest) { try { game.audio.limiter.disconnect(v.dest); } catch (e) { /* already gone */ } }
      api._bin = await new Blob(v.chunks, { type: v.mime }).arrayBuffer(); api._video = null;
      return { bytes: api._bin.byteLength, seconds: +((performance.now() - v.t0) / 1000).toFixed(1), mime: v.mime, width: v.W, height: v.H, audio: !!v.dest };
    },
    binChunk(offset, size) {
      const u = new Uint8Array(api._bin, offset, Math.min(size, api._bin.byteLength - offset)); let str = '';
      for (let i = 0; i < u.length; i += 0x8000) str += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return btoa(str);
    },
    heap() { if (window.gc) { window.gc(); window.gc(); } return performance.memory ? performance.memory.usedJSHeapSize : null; },
    async audioStart() { return game.audio.startRecording(); },
    async audioStop() { const r = await game.audio.stopRecording(); if (!r) return null; api._rec = r; const { wav, ...meta } = r; return { ...meta, bytes: wav.byteLength }; },
    /** the recorded WAV, in base64 pieces (large results do not travel well through the test protocol in one go) */
    audioChunk(offset, size) {
      const u = new Uint8Array(api._rec.wav, offset, Math.min(size, api._rec.wav.byteLength - offset)); let str = '';
      for (let i = 0; i < u.length; i += 0x8000) str += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return btoa(str);
    },
    /** world position of a track-space point, on the road surface */
    trackPoint(s, d = 0) { const p = game.world.track.pos(s, d, {}); return { x: p.x, y: p.y, z: p.z, heading: p.heading }; },
    groundHeight(x, z) { return game.ground.heightAt(x, z); },
  };
  window.__game = game; window.__api = api;
  return api;
}
