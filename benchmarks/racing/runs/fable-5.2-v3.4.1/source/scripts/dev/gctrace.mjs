// Dev tool: garbage-collector pauses and other long main-thread tasks while the race runs in the village
// (Chrome trace events through the DevTools protocol).
//   node scripts/dev/gctrace.mjs [--q=low] [--secs=12] [--s=1625] [--min=2]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page } = await openGame(browser, srv.url, { query: `auto=1&cap=60${opt.q ? '&q=' + opt.q : ''}`, width: 1920, height: 1080 });
  await page.waitForFunction(() => window.__api.game.state === 'menu', null, { timeout: 90000 });
  await page.evaluate(async (s) => { const api = window.__api; await api.raceNow(3); api.pack(s, 28); api.resync(0, 60); }, Number(opt.s || 1625));
  await page.waitForTimeout(2500);
  const cdp = await page.context().newCDPSession(page);
  const events = []; cdp.on('Tracing.dataCollected', (d) => { for (const e of d.value) events.push(e); });
  const done = new Promise((res) => cdp.once('Tracing.tracingComplete', res));
  await cdp.send('Tracing.start', { traceConfig: { includedCategories: ['devtools.timeline', 'v8', 'disabled-by-default-v8.gc', 'toplevel'] }, transferMode: 'ReportEvents' });
  const secs = Number(opt.secs || 12); await page.waitForTimeout(secs * 1000);
  await cdp.send('Tracing.end'); await done;
  const min = Number(opt.min || 2) * 1000;
  const gc = events.filter((e) => e.ph === 'X' && /GC|Scaveng|MarkCompact|Sweep|Mark/i.test(e.name) && e.dur >= min);
  const byName = new Map(); for (const e of events) if (e.ph === 'X' && /GC|Scaveng|MarkCompact/i.test(e.name)) { const b = byName.get(e.name) || { n: 0, total: 0, max: 0 }; b.n++; b.total += e.dur; b.max = Math.max(b.max, e.dur); byName.set(e.name, b); }
  let t0 = Infinity; for (const e of events) if (e.ts > 0 && e.ts < t0) t0 = e.ts;
  console.log(`events ${events.length}; GC summary over ${secs} s:`);
  for (const [k, b] of [...byName].sort((a, b) => b[1].total - a[1].total).slice(0, 16)) console.log(`  ${k.padEnd(44)} n ${String(b.n).padStart(4)} total ${(b.total / 1000).toFixed(1).padStart(7)} ms  max ${(b.max / 1000).toFixed(1)} ms`);
  console.log(`GC-related slices >= ${min / 1000} ms:`);
  for (const e of gc.sort((a, b) => a.ts - b.ts).slice(0, 60)) console.log(`  t ${((e.ts - t0) / 1e6).toFixed(2)} s  ${e.name}  ${(e.dur / 1000).toFixed(1)} ms ${e.args && e.args.type ? e.args.type : ''} ${e.args && e.args.usedHeapSizeBefore ? `heap ${(e.args.usedHeapSizeBefore / 1048576).toFixed(0)} -> ${(e.args.usedHeapSizeAfter / 1048576).toFixed(0)} MB` : ''}`);
  const long = events.filter((e) => e.ph === 'X' && e.dur >= 12000 && !/GC|Scaveng|Mark|Sweep/i.test(e.name));
  const ln = new Map(); for (const e of long) { const b = ln.get(e.name) || { n: 0, max: 0 }; b.n++; b.max = Math.max(b.max, e.dur); ln.set(e.name, b); }
  console.log('other slices >= 12 ms: ' + [...ln].map(([k, b]) => `${k} x${b.n} (max ${(b.max / 1000).toFixed(1)})`).join(', '));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
