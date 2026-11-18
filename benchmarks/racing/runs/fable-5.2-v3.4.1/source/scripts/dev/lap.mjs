// Dev tool: drive laps on autopilot in the real game (headless) and report integrity counters.
//   node scripts/dev/lap.mjs [--laps=1] [--scale=6] [--q=low] [--map=out.png]
import fs from 'node:fs';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1&auto=1${opt.q ? '&q=' + opt.q : ''}`, width: 1280, height: 720 });
  const laps = Number(opt.laps || 1), scale = Number(opt.scale || 6);
  const res = await page.evaluate(async ({ laps, scale }) => {
    const api = window.__api, game = api.game; game.state = 'racing'; api.timeScale(scale);
    const L = game.world.track.length; const lapsDone = game.cars.map(() => -1), prevS = game.cars.map((c) => c.vehicle.s), lapT = game.cars.map(() => []), lastT = game.cars.map(() => 0);
    let maxSpeed = 0, minFps = 1e9;
    await new Promise((resolve) => {
      game.hooks.afterStep.push(() => {
        game.cars.forEach((c, i) => { const s = c.vehicle.s; if (prevS[i] > L - 60 && s < 60) { lapsDone[i]++; if (lapsDone[i] > 0) lapT[i].push(+(game.simTime - lastT[i]).toFixed(2)); lastT[i] = game.simTime; } prevS[i] = s; });
        maxSpeed = Math.max(maxSpeed, game.player.vehicle.speed);
        if (lapsDone[5] >= laps || game.simTime > 180 * (laps + 1)) resolve();
      });
    });
    api.timeScale(1); api.pause(true);
    return { simTime: game.simTime, lapsDone, lapT, maxSpeedKmh: maxSpeed * 3.6, integrity: game.integrity, log: game.log, fps: game.fps.value, camViolations: game.cam.violations };
  }, { laps, scale });
  console.log(JSON.stringify(res, null, 1));
  if (opt.map) {
    await page.evaluate(() => { const api = window.__api; api.fog(false); api.freezeTime(12.5); api.topView(); api.render(); api.render(); });
    await page.waitForTimeout(100); await page.screenshot({ path: opt.map }); console.log('wrote', opt.map);
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror');
  if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} finally { await browser.close(); await srv.close(); }
