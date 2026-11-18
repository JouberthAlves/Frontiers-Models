// Dev tool: frame-rate probe. Places the player at several lap distances, lets the game run on
// autopilot (uncapped frame rate) and reports average / 1%-low FPS, draw calls and triangles.
//   node scripts/dev/perf.mjs [--q=low] [--w=1920 --h=1080] [--at=40,600,1800,2500] [--secs=4]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({ uncapped: true });
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1&auto=1${opt.q ? '&q=' + opt.q : ''}`, width: Number(opt.w || 1920), height: Number(opt.h || 1080) });
  const at = (opt.at || '40,600,1800,2500').split(',').map(Number);
  for (const s of at) {
    const r = await page.evaluate(async ({ s, secs }) => {
      const api = window.__api, game = api.game; game.state = 'racing';
      // the whole field around the player, like in a race
      game.cars.forEach((c, i) => api.place(i, s - (5 - i) * 9, (i % 2 ? 1 : -1) * 2.2, 40));
      api.pause(false); api.hold(false);
      await new Promise((r) => setTimeout(r, 1200));
      const times = []; let last = performance.now();
      await new Promise((resolve) => { const t0 = last; const f = () => { const n = performance.now(); times.push(n - last); last = n; if (n - t0 < secs * 1000) requestAnimationFrame(f); else resolve(); }; requestAnimationFrame(f); });
      times.sort((a, b) => a - b); const avg = times.reduce((a, b) => a + b, 0) / times.length; const p99 = times[Math.floor(times.length * 0.99)];
      return { s, frames: times.length, avgFps: +(1000 / avg).toFixed(1), low1Fps: +(1000 / p99).toFixed(1), cpuMs: api.state().timing, draw: { ...game.gfx.stats } };
    }, { s, secs: Number(opt.secs || 4) });
    console.log(JSON.stringify(r));
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror');
  if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} finally { await browser.close(); await srv.close(); }
