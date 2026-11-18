// Dev tool: load the game headless, run a JS snippet in the page and print its JSON result.
//   node scripts/dev/eval.mjs "<js body, may use api / game, must return a value>" [--s=40] [--q=low] [--w=1280 --h=720]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const js = args.find((a) => !a.startsWith('--')) || 'return api.info();';
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1${opt.q ? '&q=' + opt.q : ''}${opt.auto ? '&auto=1' : ''}${opt.car ? '&car=' + opt.car : ''}${opt.difficulty ? '&difficulty=' + opt.difficulty : ''}`, width: Number(opt.w || 1280), height: Number(opt.h || 720) });
  const res = await page.evaluate(async ({ js, s }) => {
    const api = window.__api, game = api.game; api.pause(true); api.hold(true);
    if (s !== null) { game.cars.forEach((c, i) => api.place(i, s - (5 - i) * 9, (i % 2 ? 1 : -1) * 2.2, 40)); api.pose(null); api.render(1 / 60); api.render(1 / 60); }
    return await (0, eval)(`(async () => { const api = window.__api, game = api.game; ${js} })()`);
  }, { js, s: opt.s !== undefined ? Number(opt.s) : null });
  console.log(JSON.stringify(res, null, 1));
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror' || (l.type === 'warning' && /WebGL|THREE|shader/i.test(l.text)));
  if (bad.length) console.log('--- console problems:\n' + bad.slice(0, 12).map((b) => `[${b.type}] ${b.text.slice(0, 400)}`).join('\n'));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
