// Dev tool: close-up stills of one car on the grid from several orbit angles.
//   node scripts/dev/carshots.mjs <prefix> [--car=5] [--views=name:az:el:dist:fov,...] [--query=car=hatch&livery=1] [--w=1280 --h=720]
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const prefix = args.find((a) => !a.startsWith('--')) || '.tmp/car';
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const views = (opt.views || 'f34:32:9:6.2:38,side:90:6:7:34,r34:148:12:6.4:38,front:0:8:6.5:34,top:60:62:8:38').split(',').map((v) => v.split(':'));
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1${opt.query ? '&' + opt.query : ''}`, width: Number(opt.w || 1280), height: Number(opt.h || 720) });
  const car = Number(opt.car ?? 5);
  if (opt.js) await page.evaluate((js) => (0, eval)(js), opt.js);
  for (const [name, az, el, dist, fov] of views) {
    await page.evaluate(({ car, az, el, dist, fov }) => { const api = window.__api; api.pause(true); api.hold(true); api.freezeTime(12.5); api.orbit(car, +az, +el, +dist, +fov); api.render(); api.render(); }, { car, az, el, dist, fov });
    await page.waitForTimeout(120);
    await page.screenshot({ path: `${prefix}-${name}.png` });
    console.log('wrote', `${prefix}-${name}.png`);
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror' || (l.type === 'warning' && /THREE|WebGL|shader/i.test(l.text)));
  if (bad.length) console.log('--- console problems:\n' + bad.slice(0, 12).map((l) => `[${l.type}] ${l.text.slice(0, 700)}`).join('\n'));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
