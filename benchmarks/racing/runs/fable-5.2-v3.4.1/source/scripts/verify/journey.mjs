// Tests 1-3 and the data of tests 5, 6 and 8: the game is driven through its real interface with real
// clicks and keys (only the player's steering is given to the autopilot, as the brief allows).
import path from 'node:path';
import { openGame } from '../lib/harness.mjs';
import { out, ensureDir, writeJson, writeFile, sleep, waitState, flow, state, consoleProblems, saveConsole } from './common.mjs';

/** screenshot to a file (written here, with the retry of writeFile, not by the browser driver) */
const snap = async (page, file) => writeFile(file, await page.screenshot({ type: 'png' }));

const NEXT = (id) => `#${id} button.opt-arrow >> nth=1`;

/** menu -> garage (car, colour) -> set-up (laps) -> start, with real clicks; returns when the race is under way */
async function toRace(page, { car, colour, laps, difficulty = 'normal' }, shots = null) {
  await waitState(page, 'menu', 90000); await sleep(700);
  if (shots) await snap(page, shots + '-01-menu.png');
  await page.click('#btn-play'); await waitState(page, 'garage', 15000);
  for (let k = 0; k < 4 && (await flow(page)).options.car !== car; k++) { await page.click(NEXT('opt-car')); await sleep(250); }
  await page.click('#swatch-' + colour);
  await page.waitForFunction(({ car, colour }) => { const g = window.__api.game; return g.options.car === car && g.options.livery === colour && g.player.specId === car && g.player.livery === g.liveries[colour]; }, { car, colour }, { timeout: 15000 });
  await sleep(500); if (shots) await snap(page, shots + '-02-garagem.png');
  await page.click('#btn-garage-next'); await waitState(page, 'setup', 15000);
  for (let k = 0; k < 4 && (await flow(page)).options.laps !== laps; k++) { await page.click(NEXT('opt-laps')); await sleep(120); }
  for (let k = 0; k < 4 && (await flow(page)).options.difficulty !== difficulty; k++) { await page.click(NEXT('opt-difficulty')); await sleep(120); }
  await sleep(250); if (shots) await snap(page, shots + '-03-configuracao.png');
  await page.click('#btn-start'); await waitState(page, 'grid', 15000);
  await sleep(2500); if (shots) await snap(page, shots + '-04-grid.png');
  await waitState(page, 'countdown', 15000); await sleep(1500); if (shots) await snap(page, shots + '-05-largada.png');
  await waitState(page, 'racing', 15000);
}

/**
 * Tests 1 / 2: menu -> car -> N laps with the 5 rivals -> results -> race again.
 * @returns the race summary, integrity counters and console of the run
 */
export async function journey(R, browser, base, check, { id, laps, car, colour, scale, audit = false }) {
  const dir = ensureDir(out('journey')); const shots = path.join(dir, id);
  const { page, logs, externals, context } = await openGame(browser, base, { query: 'auto=1', width: 1280, height: 720 });
  const res = { laps, car, colour, timeScale: scale };
  try {
    await toRace(page, { car, colour, laps }, shots);
    const f0 = await flow(page);
    check(f0.options.car === car && f0.options.livery === colour && f0.options.laps === laps, `set-up not applied: ${JSON.stringify(f0.options)}`);
    check(f0.race.entries.length === 6 && f0.race.entries.filter((e) => !e.player).length === 5, 'the field is not 1 player + 5 rivals');
    check(f0.audio.unlocked && f0.audio.ctx === 'running', `audio graph not running after the clicks (${f0.audio.ctx})`);
    res.audioAtStart = f0.audio;
    if (audit) {
      // test 8 is read here, with the audio graph running (engine sources are real AudioBuffers)
      const a = await page.evaluate(() => window.__api.sceneStats());
      writeJson(out('scene-stats.json'), a); res.sceneAudit = { pass: a.pass, failures: a.failures };
      R.log(`   scene audit: ${a.pass ? 'pass' : 'FAIL ' + a.failures.join('; ')}`);
    }
    await sleep(3000); await snap(page, shots + '-06-corrida.png');
    await page.evaluate((k) => window.__api.timeScale(k), scale);
    await waitState(page, 'results', Math.round(laps * 135 / scale * 1000 * 1.6) + 90000);
    await page.evaluate(() => window.__api.timeScale(1));
    await page.waitForSelector('#btn-again', { timeout: 20000 }); await sleep(500);
    await snap(page, shots + '-07-resultados.png');
    const f = await flow(page), st = await state(page);
    res.race = { clock: f.race.clock, overtakes: f.race.overtakes, aiOvertakes: f.race.aiOvertakes, results: f.race.results, entries: f.race.entries };
    res.integrity = st.integrity; res.cameraViolations = st.camViolations; res.resets = st.log; res.audio = f.audio;
    const rows = await page.$$eval('.res-row:not(.res-head)', (els) => els.length);
    const me = f.race.results.find((r) => r.isPlayer);
    check(f.screen === 'results' && rows === 6, `results screen shows ${rows} rows`);
    check(me && me.laps === laps && me.lapTimes.length === laps, `player completed ${me ? me.laps : '?'} of ${laps} laps`);
    check(f.race.results.map((r) => r.place).join('') === '123456', 'classification is not 1..6');
    check(f.race.results.every((r) => r.time > 0 && isFinite(r.time)), 'a result has no time');
    res.playerLaps = me ? me.lapTimes.map((t) => +t.toFixed(2)) : [];
    res.bestLaps = f.race.results.map((r) => ({ name: r.name, best: r.best === null ? null : +r.best.toFixed(2) }));
    // ---- race again from the results
    await page.click('#btn-again'); await waitState(page, 'grid', 15000);
    const g = await flow(page);
    check(g.race.results === null && g.race.clock === 0 && g.race.entries.every((e) => e.lapsDone === 0 && !e.finished), 'old race state survived "race again"');
    check(g.race.entries.every((e) => e.place === e.index + 1), 'grid order not restored after "race again"');
    check(g.screen === null && !g.paused, 'interface not closed after "race again"');
    await waitState(page, 'racing', 20000); await sleep(1500);
    const g2 = await flow(page);
    check(g2.race.phase === 'racing' && g2.race.clock > 0 && g2.race.clock < 6, 'second race did not start cleanly');
    check(g2.audio.voices <= f0.audio.voices + 6, `voices grew from ${f0.audio.voices} to ${g2.audio.voices} on the second race`);
    res.raceAgain = { state: g2.state, clock: g2.race.clock, voices: g2.audio.voices };
    const problems = consoleProblems(logs, externals); res.console = problems;
    check(problems.length === 0, `console: ${problems.slice(0, 3).join(' | ')}`);
  } finally { saveConsole(id, logs); await context.close(); }
  return res;
}

/** Test 3: pause / continue, restart in the middle of a race (three times), back to the menu and out again */
export async function stateTest(R, browser, base, check) {
  const { page, logs, externals, context } = await openGame(browser, base, { query: 'auto=1', width: 1280, height: 720 });
  const res = { restarts: [] };
  const settle = async () => { await sleep(1600); return { voices: (await flow(page)).audio.voices, heap: await page.evaluate(() => window.__api.heap()) }; };
  try {
    await toRace(page, { car: 'gt', colour: 0, laps: 3 });
    await sleep(1500);
    // ---- pause / continue (Esc, as a player would)
    await page.keyboard.press('Escape'); await sleep(400);
    const p1 = await flow(page), s1 = await state(page); await sleep(700); const s2 = await state(page);
    check(p1.paused && p1.screen === 'pause', 'Esc did not pause');
    check(s2.steps === s1.steps, 'the simulation advanced while paused');
    res.pause = { paused: p1.paused, screen: p1.screen, stepsWhilePaused: s2.steps - s1.steps };
    await page.keyboard.press('Escape'); await sleep(500);
    const p2 = await flow(page), s3 = await state(page);
    check(!p2.paused && p2.screen === null && s3.steps > s2.steps, 'Esc did not resume');
    await page.keyboard.press('KeyP'); await sleep(300); check((await flow(page)).paused, 'P did not pause');
    await page.click('#btn-resume'); await sleep(300); check(!(await flow(page)).paused, '"Continuar" did not resume');
    // ---- baseline of voices and heap, then three restarts in the middle of the race
    const base0 = await settle(); res.baseline = base0; const f0 = await flow(page);
    for (let k = 1; k <= 3; k++) {
      await page.evaluate(() => window.__api.timeScale(5));
      await page.waitForFunction(() => window.__api.game.race.clock > 14, null, { timeout: 30000 });
      await page.evaluate(() => window.__api.timeScale(1));
      await page.keyboard.press('Escape'); await sleep(300); await page.click('#btn-restart'); await waitState(page, 'grid', 10000);
      const g = await flow(page), st = await state(page);
      check(g.race.clock === 0 && g.race.results === null && g.race.entries.every((e) => e.lapsDone === 0 && e.place === e.index + 1), `restart ${k}: race state not reset`);
      check(!g.paused && g.screen === null && g.particles === 0, `restart ${k}: pause / interface / particles left over`);
      check(st.cars.every((c) => c.speed < 0.2), `restart ${k}: cars not standing on the grid`);
      await waitState(page, 'racing', 20000);
      const m = await settle(); res.restarts.push({ k, ...m });
      check(m.voices === base0.voices, `restart ${k}: ${m.voices} voices, ${base0.voices} before`);
    }
    const last = res.restarts[2]; const fN = await flow(page);
    res.heapGrowthMB = base0.heap === null ? null : +((last.heap - base0.heap) / 1048576).toFixed(2);
    check(base0.heap === null || Math.abs(last.heap - base0.heap) < Math.max(6 * 1048576, base0.heap * 0.06), `heap went from ${(base0.heap / 1048576).toFixed(1)} to ${(last.heap / 1048576).toFixed(1)} MB after 3 restarts`);
    check(fN.audio.engineBuffers === f0.audio.engineBuffers && fN.audio.base === f0.audio.base, 'engine voices duplicated');
    res.voices = { before: base0.voices, afterRestarts: res.restarts.map((r) => r.voices), permanent: fN.audio.base };
    // ---- back to the menu in the middle of the race, then a new race from there
    await page.keyboard.press('Escape'); await sleep(300); await page.click('#btn-quit'); await waitState(page, 'menu', 10000); await sleep(800);
    const m = await flow(page); const hudOn = await page.evaluate(() => window.__api.game.hud.visible);
    check(m.screen === 'menu' && !m.paused && m.race.phase === 'idle' && !hudOn, 'menu reached with race state left over');
    res.menu = { screen: m.screen, phase: m.race.phase, hud: hudOn };
    await page.click('#btn-play'); await waitState(page, 'garage', 10000); await page.click('#btn-garage-next'); await waitState(page, 'setup', 10000);
    await page.click('#btn-start'); await waitState(page, 'grid', 10000);
    const n = await flow(page);
    check(n.race.clock === 0 && n.race.results === null && n.race.entries.every((e) => e.lapsDone === 0), 'new race from the menu started with old state');
    await waitState(page, 'racing', 20000); const v = await settle();
    check(v.voices === base0.voices, `after menu and back: ${v.voices} voices, ${base0.voices} before`);
    res.afterMenu = v;
    const problems = consoleProblems(logs, externals); res.console = problems; check(problems.length === 0, `console: ${problems.slice(0, 3).join(' | ')}`);
  } finally { saveConsole('estado', logs); await context.close(); }
  return res;
}

/** Test 4: cutting the track does not count a lap; a lap through every checkpoint does */
export async function antiCut(R, browser, base, check) {
  const { page, logs, context } = await openGame(browser, base, { query: 'dev=1&auto=1&q=low', width: 640, height: 360 });
  let res;
  try {
    res = await page.evaluate(async () => {
      const api = window.__api, game = api.game; api.pause(true); api.hold(true);
      await api.raceNow(1); const L = game.world.track.length; const me = () => game.race.player; const v = game.player.vehicle; const out = { checkpoints: game.race.cps.length, steps: [] };
      const snap = (label) => out.steps.push({ label, s: +v.s.toFixed(1), lapsDone: me().lapsDone, cpNext: me().cpNext, progress: +me().progress.toFixed(1), place: me().place });
      const run = (cond, max = 120 * 200) => { let n = 0; while (!cond() && n++ < max) game.stepSim(); return n; };
      // honest start: across the line and through the first checkpoints
      run(() => v.s > 420 && v.s < 1000); snap('drove 420 m from the grid');
      const cp = me().cpNext;
      // 1. cut: jump to 60 m before the line and cross it
      api.place(5, L - 60, 0, 30); run(() => v.s > 20 && v.s < 300, 120 * 20); snap('teleported to 60 m before the line and crossed it');
      out.cutCounted = me().lapsDone > 0; out.cpKept = me().cpNext === cp;
      // 2. back and forth over the line
      api.place(5, L - 25, 0, 25); run(() => v.s > 15 && v.s < 300, 120 * 20); snap('crossed the line a second time');
      out.backForthCounted = me().lapsDone > 0;
      // 3. skip half of the lap: appear on the bridge and finish the lap from there
      api.place(5, 2960, 0, 30); run(() => v.s > 15 && v.s < 300, 120 * 60); snap('skipped from the cliff road to the bridge and crossed the line');
      out.skipCounted = me().lapsDone > 0;
      // 4. control: back to where the missing checkpoint is, and the rest of the lap driven honestly
      api.place(5, game.race.cps[cp].s - 25, 0, 25); run(() => me().lapsDone > 0 || game.state === 'results', 120 * 200); snap('returned to the missed checkpoint and completed the lap');
      out.honestCounted = me().lapsDone === 1; out.state = game.state;
      return out;
    });
    check(!res.cutCounted && res.cpKept, 'a cut across the line counted as a lap');
    check(!res.backForthCounted, 'crossing the line twice counted as a lap');
    check(!res.skipCounted, 'skipping half of the lap counted as a lap');
    check(res.honestCounted, 'a lap through every checkpoint did not count');
  } finally { saveConsole('anticorte', logs); await context.close(); }
  return res;
}
