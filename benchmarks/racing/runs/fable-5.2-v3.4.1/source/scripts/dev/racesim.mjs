// Dev tool: a whole race simulated without rendering (same fixed steps as the game), player on autopilot.
//   node scripts/dev/racesim.mjs [--laps=3] [--difficulty=normal] [--car=gt] [--runs=1] [--trace=5:2440:2760]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1&auto=1&q=low&car=${opt.car || 'gt'}&difficulty=${opt.difficulty || 'normal'}${opt.grip ? '&grip=' + opt.grip : ''}${opt.power ? '&power=' + opt.power : ''}`, width: 640, height: 360 });
  for (let run = 0; run < Number(opt.runs || 1); run++) {
    const res = await page.evaluate(async ({ laps, trace, solo }) => {
      const api = window.__api, game = api.game; api.pause(true); api.hold(true);
      const log0 = game.log.length;
      await api.raceNow(laps);
      if (solo) { game.cars = game.cars.filter((c) => c.isPlayer); game._vehicles = game.cars.map((c) => c.vehicle); }
      const t0 = performance.now(); let steps = 0; const tr = [];
      const sp = game.world.track.spline, line = game.world.line;
      while (game.state !== 'results' && steps < 120 * 220 * laps) {
        game.stepSim(); steps++;
        if (trace && steps % 12 === 0) { const c = game.cars[trace[0]], v = c.vehicle; if (v.s > trace[1] && v.s < trace[2]) tr.push([+v.s.toFixed(0), +v.d.toFixed(1), +sp.sampleArr(line.off, v.s).toFixed(1), +v.speed.toFixed(1), +c.driver.debug.vT.toFixed(1), +v.input.throttle.toFixed(2), +v.input.brake.toFixed(2), +v.input.steer.toFixed(2), +v.beta.toFixed(2), +v.skid.toFixed(2), +c.driver.lane.toFixed(1), c.driver.debug.blocker, +c.driver.debug.busy.toFixed(2)].join(' ')); }
      }
      const s = game.race.summary();
      const hits = { car: [], wall: [] }; for (const c of game.cars) { for (const e of c.vehicle.events) if (e.type === 'car' || e.type === 'wall') hits[e.type].push(e.strength); c.vehicle.events.length = 0; }
      const hs = (a, k) => a.filter((x) => x > k).length;
      const hitSummary = `car contacts ${hits.car.length / 2} (>3 m/s: ${hs(hits.car, 3) / 2}, >6 m/s: ${hs(hits.car, 6) / 2}, max ${Math.max(0, ...hits.car).toFixed(1)}) | wall touches ${hits.wall.length} (>3 m/s: ${hs(hits.wall, 3)}, max ${Math.max(0, ...hits.wall).toFixed(1)})`;
      return { hitSummary, ms: Math.round(performance.now() - t0), steps, clock: s.clock, overtakes: s.overtakes, aiOvertakes: s.aiOvertakes, integrity: game.integrity,
        entries: s.entries.map((e) => `${e.name.padEnd(5)} place ${e.place} laps ${e.lapsDone} best ${e.best ? e.best.toFixed(2) : '-'} laps [${e.lapTimes.map((t) => t.toFixed(1)).join(', ')}] maxStuck ${e.maxStuck} maxOff ${e.maxOff}`),
        results: (s.results || []).map((r) => `${r.place} ${r.name} ${r.time.toFixed(2)}${r.projected ? '≈' : ''}`).join(' | '),
        log: game.log.slice(log0).map((l) => `${l.t} ${l.name} ${l.reason} s=${l.s}`), tr };
    }, { laps: Number(opt.laps || 3), solo: !!opt.solo, trace: opt.trace ? opt.trace.split(':').map(Number) : null });
    console.log(`--- run ${run + 1}: ${res.steps} steps in ${res.ms} ms, race ${res.clock}s, overtakes ${res.overtakes} (between AIs ${res.aiOvertakes}), integrity ${JSON.stringify(res.integrity)}`);
    console.log(res.entries.join('\n')); console.log(res.results); console.log(res.hitSummary); if (res.log.length) console.log('resets:\n  ' + res.log.join('\n  '));
    if (res.tr.length) console.log(res.tr.join('\n'));
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror');
  if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
