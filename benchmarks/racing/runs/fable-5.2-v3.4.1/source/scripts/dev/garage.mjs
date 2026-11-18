// Dev tool: the garage view with look-development variants, cropped on the car.
//   node scripts/dev/garage.mjs [--out=.tmp/garage/v] [--spin=1.3] [--car=gt] [--livery=0] [--w=1280 --h=720] [--crop=540,250,1280,520] "name=js" "name2=js2" ...
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const variants = args.filter((a) => !a.startsWith('--')).map((a) => { const i = a.indexOf('='); return i < 0 ? [a, ''] : [a.slice(0, i), a.slice(i + 1)]; });
if (!variants.length) variants.push(['base', '']);
const out = opt.out || '.tmp/garage/v'; fs.mkdirSync(path.dirname(out), { recursive: true });
const W = Number(opt.w || 1280), H = Number(opt.h || 720);
const crop = (opt.crop || `${Math.round(W * 0.42)},${Math.round(H * 0.33)},${W},${Math.round(H * 0.74)}`).split(',').map(Number);
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1&car=${opt.car || 'gt'}&livery=${opt.livery || 0}${opt.query ? '&' + opt.query : ''}`, width: W, height: H });
  for (const [name, js] of variants) {
    await page.evaluate(async ({ js, spin }) => {
      const api = window.__api, game = api.game; api.pause(true); api.hold(true); api.freezeTime(12.5);
      game.goGarage(); game.ui.hide(); game.director.spin = spin;
      if (js) await (0, eval)(`(async () => { const api = window.__api, game = api.game; ${js} })()`);
      for (let i = 0; i < 4; i++) { game.director.spin = spin; api.render(1 / 60); }
    }, { js, spin: Number(opt.spin ?? 1.3) });
    await page.waitForTimeout(120);
    const file = `${out}-${name}.png`;
    await page.screenshot({ path: file, clip: { x: crop[0], y: crop[1], width: crop[2] - crop[0], height: crop[3] - crop[1] } });
    console.log('wrote', file);
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror');
  if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
