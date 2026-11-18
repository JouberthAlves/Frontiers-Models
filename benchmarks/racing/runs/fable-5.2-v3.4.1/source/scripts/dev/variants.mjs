// Dev tool: one camera, several look variants (each variant = a JS snippet run in the page).
//   node scripts/dev/variants.mjs <out-prefix> <shot> "<js A>" "<js B>" ...   (shot syntax as in shot.mjs: s.. / t.. / g..)
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';

const [prefix, shot, ...variants] = process.argv.slice(2);
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const srv = await startServer({});
const { browser } = await launchBrowser({});
let page, logs;
try {
  ({ page, logs } = await openGame(browser, srv.url, { query: 'dev=1', width: 1280, height: 720 }));
  await page.evaluate(async (name) => {
    const api = window.__api; api.pause(true); api.hold(true); api.freezeTime(12.5);
    const v = name.slice(1).split('_').map(Number);
    if (name[0] === 'k') { api.pack(v[0], v[1] ?? 50); api.pose(null); api.autopilot(true); api.step(70); api.render(1 / 60); api.step(2); }
    else if (name[0] === 's') { api.place(5, v[0], v[1] || 0, v[2] ?? 30); api.pose(null); api.autopilot(true); api.step(45); api.render(1 / 60); api.step(2); }
    else {
      const c = api.trackPoint(v[0], v[1]), l = api.trackPoint(v[3], v[4]); const g = name[0] === 'g';
      api.pose([c.x, (g ? Math.max(0, api.groundHeight(c.x, c.z)) : c.y) + v[2], c.z], [l.x, (g ? Math.max(0, api.groundHeight(l.x, l.z)) : l.y) + v[5], l.z], v[6] || 60);
    }
  }, shot);
  for (let i = 0; i < Math.max(1, variants.length); i++) {
    await page.evaluate(async (js) => { const api = window.__api; if (js) await (0, eval)(`(async () => { const api = window.__api, game = api.game; ${js} })()`); api.render(1 / 60); api.render(1 / 60); }, variants[i] || '');
    await page.waitForTimeout(120);
    const file = `${prefix}-${String.fromCharCode(97 + i)}.png`;
    await page.screenshot({ path: file });
    console.log('wrote', file, '<=', variants[i] || '(default)');
  }
} catch (e) { console.error('ERROR', e.message); } finally {
  const bad = (logs || []).filter((l) => l.type === 'error' || l.type === 'pageerror' || (l.type === 'warning' && /WebGL|THREE|shader/i.test(l.text)));
  if (bad.length) console.log('--- console problems:\n' + bad.slice(0, 15).map((l) => `[${l.type}] ${l.text.slice(0, 500)}`).join('\n'));
  await browser.close(); await srv.close();
}
