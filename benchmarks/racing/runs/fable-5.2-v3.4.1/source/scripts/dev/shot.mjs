// Dev tool: load the game headless and save screenshots.
//   node scripts/dev/shot.mjs <out-prefix> [--q=low] [--w=1280 --h=720] [--js="expr run in page before each shot"] [--shots=top,chase,...]
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const prefix = args.find((a) => !a.startsWith('--')) || '.tmp/shot';
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const W = Number(opt.w || 1280), H = Number(opt.h || 720);
const srv = await startServer({});
const { browser, channel } = await launchBrowser({});
const t0 = Date.now();
let page, logs;
try {
  ({ page, logs } = await openGame(browser, srv.url, { query: `dev=1${opt.q ? '&q=' + opt.q : ''}${opt.query ? '&' + opt.query : ''}`, width: W, height: H }));
  console.log(`loaded in ${Date.now() - t0} ms on ${channel}`);
  const info = await page.evaluate(() => window.__api.info());
  console.log('gpu:', info.gpu.renderer, '| validation ok:', info.validation.ok, '| track', info.trackLength.toFixed(0), 'm');
  if (!info.validation.ok) console.log(info.validation.errors.slice(0, 10).join('\n'));
  const shots = (opt.shots || 'top,chase').split(',');
  for (const name of shots) {
    await page.evaluate(async ({ name, js }) => {
      const api = window.__api; api.pause(true); api.hold(true); api.freezeTime(12.5);
      if (name === 'top') api.topView();
      else if (name === 'chase') api.pose(null);
      else if (name.startsWith('s')) { // s<distance>[_d[_speed]]  chase camera behind the player placed at that lap distance
        const [s, d, v] = name.slice(1).split('_').map(Number);
        api.place(5, s, d || 0, v ?? 30); api.pose(null); api.autopilot(true); api.step(45); api.render(1 / 60); api.step(2);
      } else if (name.startsWith('k')) { // k<s>_<speed>  chase camera, the whole field around the player
        const [s, v] = name.slice(1).split('_').map(Number);
        api.pack(s, v ?? 50); api.pose(null); api.autopilot(true); api.step(70); api.render(1 / 60); api.step(2);
      } else if (name.startsWith('t')) { // t<s>_<d>_<h>_<ls>_<ld>_<lh>[_fov]  camera and target in track space (h = height above the road)
        const v = name.slice(1).split('_').map(Number); const c = api.trackPoint(v[0], v[1]), l = api.trackPoint(v[3], v[4]);
        api.pose([c.x, c.y + v[2], c.z], [l.x, l.y + v[5], l.z], v[6] || 60);
      } else if (name.startsWith('g')) { // g<s>_<d>_<h>_<ls>_<ld>_<lh>[_fov]  like t, but heights above the ground (or the sea)
        const v = name.slice(1).split('_').map(Number); const c = api.trackPoint(v[0], v[1]), l = api.trackPoint(v[3], v[4]);
        api.pose([c.x, Math.max(0, api.groundHeight(c.x, c.z)) + v[2], c.z], [l.x, Math.max(0, api.groundHeight(l.x, l.z)) + v[5], l.z], v[6] || 60);
      } else if (name.startsWith('p')) { // p<x>_<y>_<z>_<lx>_<ly>_<lz>[_fov]
        const v = name.slice(1).split('_').map(Number); api.pose([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[6] || 60);
      }
      if (js) await (0, eval)(`(async () => { const api = window.__api, game = api.game; ${js} })()`);
      if (!name.startsWith('s') && !name.startsWith('k')) api.render(1 / 60);
      api.render(1 / 60);
    }, { name, js: opt.js || '' });
    await page.waitForTimeout(150);
    const file = `${prefix}-${name}.png`;
    await page.screenshot({ path: file });
    const st = await page.evaluate(() => { const s = window.__api.state(); return { draw: s.draw, sky: window.__api.skyFraction(), integrity: s.integrity }; });
    console.log('wrote', file, JSON.stringify(st));
  }
} catch (e) {
  console.error('ERROR', e.message);
} finally {
  const bad = (logs || []).filter((l) => l.type === 'error' || l.type === 'pageerror' || l.type === 'requestfailed' || (l.type === 'warning' && /WebGL|THREE|shader/i.test(l.text)));
  if (bad.length) console.log('--- console problems:\n' + bad.slice(0, 25).map((l) => `[${l.type}] ${l.text.slice(0, 600)}`).join('\n'));
  await browser.close(); await srv.close();
}
