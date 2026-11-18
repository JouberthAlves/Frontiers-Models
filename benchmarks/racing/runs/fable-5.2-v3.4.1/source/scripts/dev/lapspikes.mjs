// Dev tool: frame pacing over one whole lap from a cold start (60 Hz limiter): where are the long frames?
//   node scripts/dev/lapspikes.mjs [--q=low] [--nowarm] [--min=22]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page } = await openGame(browser, srv.url, { query: `auto=1&cap=60${opt.q ? '&q=' + opt.q : ''}${opt.nowarm ? '&nowarm=1' : ''}`, width: 1920, height: 1080 });
  await page.waitForFunction(() => window.__api.game.state === 'menu', null, { timeout: 90000 });
  const res = await page.evaluate(async (min) => {
    const api = window.__api, game = api.game; await api.raceNow(1);
    const frames = []; let last = performance.now();
    game.hooks.frame.push(() => { const n = performance.now(); frames.push([n - last, game.player.vehicle.s]); last = n; });
    const t0 = performance.now();
    while (game.state !== 'results' && performance.now() - t0 < 170000) await new Promise((r) => setTimeout(r, 250));
    frames.shift(); const gaps = frames.map((f) => f[0]).sort((a, b) => a - b); const n = gaps.length; const worst = gaps.slice(n - Math.max(1, Math.round(n * 0.01)));
    const long = frames.filter((f) => f[0] > min).map((f) => `${f[0].toFixed(0)} ms @ s=${f[1].toFixed(0)}`);
    return { frames: n, seconds: +((performance.now() - t0) / 1000).toFixed(1), fps: +(n / (gaps.reduce((a, b) => a + b, 0) / 1000)).toFixed(1), low1: +(1000 / (worst.reduce((a, b) => a + b, 0) / worst.length)).toFixed(1), p99: +gaps[Math.floor(n * 0.99)].toFixed(1), max: +gaps[n - 1].toFixed(1), longCount: long.length, long: long.slice(0, 60), prewarm: game.prewarmInfo || null };
  }, Number(opt.min || 22));
  console.log(JSON.stringify(res, null, 1));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
