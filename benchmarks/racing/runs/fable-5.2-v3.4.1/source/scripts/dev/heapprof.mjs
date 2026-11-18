// Dev tool: which code allocates while the race runs? Sampling heap profile (allocations, including collected
// ones) of a few seconds of racing in the village.
//   node scripts/dev/heapprof.mjs [--q=low] [--secs=8] [--s=1625]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, context } = await openGame(browser, srv.url, { query: `auto=1&cap=60${opt.q ? '&q=' + opt.q : ''}`, width: 1920, height: 1080 });
  await page.waitForFunction(() => window.__api.game.state === 'menu', null, { timeout: 90000 });
  await page.evaluate(async (s) => { const api = window.__api; await api.raceNow(3); api.pack(s, 28); api.resync(0, 60); }, Number(opt.s || 1625));
  await page.waitForTimeout(2500);
  const cdp = await context.newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  await cdp.send('HeapProfiler.startSampling', { samplingInterval: 16384, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  const secs = Number(opt.secs || 8); await page.waitForTimeout(secs * 1000);
  const { profile } = await cdp.send('HeapProfiler.stopSampling');
  const self = new Map(); let total = 0;
  const walk = (n, stack) => {
    const f = n.callFrame; const name = `${f.functionName || '(anonymous)'} ${f.url.split('/').slice(-2).join('/')}:${f.lineNumber + 1}`;
    if (n.selfSize) { self.set(name, (self.get(name) || 0) + n.selfSize); total += n.selfSize; }
    for (const c of n.children || []) walk(c, stack);
  };
  walk(profile.head, []);
  console.log(`allocated ${(total / 1048576).toFixed(1)} MB in ${secs} s (${(total / 1048576 / secs).toFixed(2)} MB/s)`);
  for (const [k, v] of [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 28)) console.log(`${(v / 1048576 / secs).toFixed(3).padStart(8)} MB/s  ${k}`);
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
