// Section 13.0 item 4 and section 13.2: one full lap in High, chase camera, with the rivals, recorded as
// video (3D view + HUD + sound) and as the PCM of the master bus after the limiter.
// The player's car is driven by the autopilot; three short scripted inputs make sure the lap contains what
// the report has to point at (a brush against a barrier, a slide, a pass): they are real inputs to the real car.
import fs from 'node:fs';
import { openGame } from '../lib/harness.mjs';
import { out, writeJson, writeFile, sleep, waitState, flow, state, pullBinary, consoleProblems, saveConsole, mmss } from './common.mjs';

const NEXT = (id) => `#${id} button.opt-arrow >> nth=1`;

function wavInfo(buf) {
  const sr = buf.readUInt32LE(24), ch = buf.readUInt16LE(22), bits = buf.readUInt16LE(34); const data = buf.subarray(44); const n = Math.floor(data.length / 2);
  let peak = 0, sum = 0; for (let i = 0; i < n; i++) { const v = Math.abs(data.readInt16LE(i * 2)); if (v > peak) peak = v; sum += v * v; }
  return { sampleRate: sr, channels: ch, bits, seconds: +(n / ch / sr).toFixed(2), peak: +(peak / 32768).toFixed(5), peakDb: +(20 * Math.log10(Math.max(1, peak) / 32768)).toFixed(2), rmsDb: +(10 * Math.log10(Math.max(1e-12, sum / n) / (32768 * 32768))).toFixed(2) };
}

export async function media(R, browser, base, check) {
  // (VERIFY_VOLTA_QUERY: extra page options for a development check, e.g. cap=40 to record the same lap at another frame pacing)
  const { page, logs, externals, context } = await openGame(browser, base, { query: 'auto=1&difficulty=easy' + (process.env.VERIFY_VOLTA_QUERY ? '&' + process.env.VERIFY_VOLTA_QUERY : ''), width: 1280, height: 720 });
  const res = {};
  try {
    // real clicks: they are the user gesture that lets the browser start the Web Audio graph
    await waitState(page, 'menu', 90000); await sleep(600);
    await page.click('#btn-play'); await waitState(page, 'garage', 15000); await sleep(400);
    await page.click('#btn-garage-next'); await waitState(page, 'setup', 15000);
    for (let k = 0; k < 4 && (await flow(page)).options.laps !== 3; k++) { await page.click(NEXT('opt-laps')); await sleep(120); }
    await page.click('#btn-start'); await waitState(page, 'grid', 15000);
    const f0 = await flow(page);
    check(f0.audio.unlocked && f0.audio.ctx === 'running' && f0.audio.tap, `audio graph: ${JSON.stringify({ unlocked: f0.audio.unlocked, ctx: f0.audio.ctx, tap: f0.audio.tap })}`);
    check(f0.options.quality === 'high', 'the lap is not in the High preset');
    await waitState(page, 'countdown', 15000);
    res.video = await page.evaluate(() => window.__api.videoStart({ fps: 30, bitrate: 3200000 }));
    await page.evaluate(() => window.__api.audioStart());
    const t0 = Date.now();
    await waitState(page, 'racing', 15000);
    // scripted inputs, by lap distance, fired inside the simulation (the same lap every time): a light brush against
    // the nearer barrier of the sea front (a short pull at the wheel, then straight on until the car touches), a slide
    // with the hand brake out of the lower hairpin, a lift on the cliff straight so that the car behind goes by
    await page.evaluate((list) => window.__api.script(list), [
      { s: 150, what: 'raspão na barreira', seq: [{ input: {}, steerSide: 0.14, seconds: 0.45 }, { input: { steer: 0, untilHit: true }, seconds: 3.0 }] },
      { s: 598, what: 'derrapagem', seq: [{ input: { handbrake: 1, steer: 0.55, throttle: 0.2 }, seconds: 0.5 }] },
      { s: 1010, what: 'alívio para ser ultrapassado', seq: [{ input: { throttle: 0, brake: 0.35 }, seconds: 1.6 }] },
    ]);
    let lapDone = false;
    while (!lapDone && Date.now() - t0 < 200000) {
      const st = await page.evaluate(() => { const g = window.__api.game; return { laps: g.race.player.lapsDone, state: g.state }; });
      lapDone = st.laps >= 1 || st.state === 'results';
      if (!lapDone) await sleep(100);
    }
    const fired = await page.evaluate(() => window.__api.scriptFired());
    await sleep(1200);
    const lapInfo = await page.evaluate(() => { const g = window.__api.game, e = g.race.player; return { lap: e.lapTimes[0] || null, place: e.place, clock: g.race.clock, integrity: g.integrity, log: g.log.slice(-10) }; });
    const a = await page.evaluate(() => window.__api.audioStop());
    const v = await page.evaluate(() => window.__api.videoStop());
    check(!!a && a.bytes > 44, 'no PCM was recorded'); check(!!v && v.bytes > 500000, 'no video was recorded');
    const wav = await pullBinary(page, 'audioChunk', a.bytes); writeFile(out('audio-volta.wav'), wav);
    const webm = await pullBinary(page, 'binChunk', v.bytes); writeFile(out('volta.webm'), webm);
    const w = wavInfo(wav);
    const ev = a.events; const first = (type) => ev.filter((e) => e.type === type).map((e) => e.t);
    const instants = { gearChange: first('gear'), skid: first('skid'), collision: ev.filter((e) => e.type === 'collision').map((e) => ({ t: e.t, with: e.with, strength: e.strength })), bridgeIn: first('bridge-in'), bridgeOut: first('bridge-out'), pass: ev.filter((e) => e.type === 'pass').map((e) => ({ t: e.t, rival: e.rival, by: e.by })) };
    res.audio = {
      file: 'audio-volta.wav', method: 'AudioWorklet tap on the master bus, after the limiter (no audio device involved)', ...w, peakDbInPage: +a.peakDb.toFixed(2), limiterMinGain: +a.limiterMinGain.toFixed(3),
      maxSimultaneousVoices: a.maxVoices, maxRivalEnginesAudible: a.maxAiVoices, recordedSeconds: +a.seconds.toFixed(1), lapTime: lapInfo.lap, lapTimeText: lapInfo.lap ? mmss(lapInfo.lap) : null,
      startsAt: 'first beep of the countdown (3 s before the green light)', scripted: fired,
      instants: { gearChanges: instants.gearChange.map(mmss), skids: instants.skid.map(mmss), collisions: instants.collision.map((c) => `${mmss(c.t)} (${c.with === 'wall' ? 'barreira' : 'carro'}, ${c.strength} m/s)`), bridge: instants.bridgeIn.map((t, i) => `${mmss(t)}–${instants.bridgeOut[i] !== undefined ? mmss(instants.bridgeOut[i]) : '?'}`), passes: instants.pass.map((p) => `${mmss(p.t)} (${p.rival}, ${p.by === 'player' ? 'ultrapassada pelo jogador' : 'ultrapassou o jogador'})`) },
      events: ev,
    };
    res.video = { file: 'volta.webm', ...v, preset: 'Alta', camera: 'perseguição', lap: lapInfo.lap };
    res.lap = lapInfo;
    check(w.peakDb <= -1.0, `master peak ${w.peakDb} dBFS is above -1 dBFS`);
    check(lapInfo.lap !== null && w.seconds >= lapInfo.lap, `recording (${w.seconds} s) shorter than the lap (${lapInfo.lap})`);
    check(instants.gearChange.length > 0, 'no gear change in the recorded lap'); check(instants.skid.length > 0, 'no skid in the recorded lap');
    check(instants.collision.length > 0, 'no collision in the recorded lap'); check(instants.bridgeIn.length > 0, 'the bridge was not crossed in the recorded lap');
    check(instants.pass.length > 0, 'no pass by / of a rival in the recorded lap');
    check(w.rmsDb > -45, `the recording is nearly silent (${w.rmsDb} dB RMS)`);
    writeJson(out('audio-volta.json'), res.audio);
    R.log(`   lap ${lapInfo.lap ? lapInfo.lap.toFixed(2) : '?'} s; wav ${w.seconds} s, peak ${w.peakDb} dBFS, rms ${w.rmsDb} dB, voices max ${a.maxVoices}; webm ${(v.bytes / 1048576).toFixed(1)} MB ${v.mime}`);
    const problems = consoleProblems(logs, externals); check(problems.length === 0, `console: ${problems.slice(0, 3).join(' | ')}`);
  } finally { saveConsole('volta', logs); await context.close(); }
  return res;
}

/** Section 13.3: frame rate in the village (Z3) with the five rivals, High and Low, 1920 x 1080 */
export async function perf(R, browser, base, check, info) {
  const res = { resolution: [1920, 1080], place: 'Z3 (vila), pelotão completo a partir de s = 1625 m, 10 s', note: 'measured with the frame limiter of the verifier (?cap=60): 60 means the 16.7 ms budget is met; the figure without a limiter depends on the machine and is given in the README. A frame time is the interval between the starts of two consecutive frames (the step the game animates with); cpuMs is the mean over the measurement', presets: {} };
  for (const q of ['high', 'low']) {
    const { page, logs, context } = await openGame(browser, base, { query: `auto=1&cap=60&q=${q}`, width: 1920, height: 1080 });
    try {
      await waitState(page, 'menu', 90000);
      const m = await page.evaluate(async () => {
        const api = window.__api, game = api.game; await api.raceNow(3); api.pack(1625, 28); api.resync(0, 60);
        await api.measureFps(2.5);                          // let the frame pacing settle
        api.pack(1625, 28);
        const r = await api.measureFps(10);
        const v = game.player.vehicle; return { ...r, endS: +v.s.toFixed(0), zoneAtEnd: game.world.track.zoneIndexAt(v.s) + 1, quality: game.gfx.quality.id, internal: [game.gfx.iw, game.gfx.ih], gpu: game.gfx.gpu.renderer };
      });
      res.presets[q] = m; res.gpu = m.gpu;
      R.log(`   ${q}: ${m.fps} fps, 1% low ${m.low1}, frame mean ${m.frameMsMean} ms / p99 ${m.frameMsP99} ms, cpu sim ${m.cpuMs.sim} ms + render ${m.cpuMs.render} ms, ${m.draw.calls} draw calls, internal ${m.internal.join('x')}`);
      check(m.zoneAtEnd === 3, `${q}: the measurement left Z3`);
      check(m.fps >= 59.0, `${q}: ${m.fps} fps average in Z3 (target: 60 with the limiter)`);
    } finally { saveConsole('desempenho-' + q, logs); await context.close(); }
  }
  res.cpu = info.cpu; res.browser = info.browser; res.os = info.os;
  return res;
}
