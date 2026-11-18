// Dev tool: V8 CPU profile of the running game (top functions by self time).
//   node scripts/dev/jsprof.mjs [--s=40] [--q=low] [--secs=4] [--top=45]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({ uncapped: true });
try {
  const { page } = await openGame(browser, srv.url, { query: `dev=1&auto=1${opt.q ? '&q=' + opt.q : ''}`, width: 1920, height: 1080 });
  await page.evaluate((s) => { const api = window.__api, game = api.game; game.state = 'racing'; game.cars.forEach((c, i) => api.place(i, s - (5 - i) * 9, (i % 2 ? 1 : -1) * 2.2, 40)); api.pause(false); api.hold(false); window.__frames = 0; game.hooks.frame.push(() => { window.__frames++; }); }, Number(opt.s || 40));
  await page.waitForTimeout(1000);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 100 });
  const f0 = await page.evaluate(() => window.__frames);
  await cdp.send('Profiler.start');
  const secs = Number(opt.secs || 4); await page.waitForTimeout(secs * 1000);
  const { profile } = await cdp.send('Profiler.stop');
  const frames = (await page.evaluate(() => window.__frames)) - f0;
  const self = new Map(); const dt = profile.timeDeltas; const byId = new Map(profile.nodes.map((n) => [n.id, n]));
  let total = 0;
  profile.samples.forEach((id, i) => { const n = byId.get(id); const f = n.callFrame; const key = `${f.functionName || '(anonymous)'} ${f.url.split('/').slice(-2).join('/')}:${f.lineNumber + 1}`; self.set(key, (self.get(key) || 0) + dt[i]); total += dt[i]; });
  const rows = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, Number(opt.top || 45));
  console.log(`frames ${frames} in ${secs}s (${(frames / secs).toFixed(1)} fps); sampled ${(total / 1000).toFixed(0)} ms`);
  for (const [k, v] of rows) console.log(`${(v / 1000 / frames).toFixed(3)} ms/frame  ${(v / total * 100).toFixed(1)}%  ${k}`);
} finally { await browser.close(); await srv.close(); }
