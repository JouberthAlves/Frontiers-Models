// Dev tool: CPU time of each step of a frame (ms, averaged), measured by wrapping the real methods.
//   node scripts/dev/cpu.mjs [--s=40] [--q=low] [--secs=3]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({ uncapped: true });
try {
  const { page } = await openGame(browser, srv.url, { query: `dev=1&auto=1${opt.q ? '&q=' + opt.q : ''}`, width: 1920, height: 1080 });
  const res = await page.evaluate(async ({ s, secs }) => {
    const api = window.__api, game = api.game; game.state = 'racing';
    game.cars.forEach((c, i) => api.place(i, s - (5 - i) * 9, (i % 2 ? 1 : -1) * 2.2, 40));
    const T = {}; let frames = 0;
    const wrap = (obj, name, label) => { const f = obj[name]; obj[name] = function (...a) { const t0 = performance.now(); const r = f.apply(this, a); T[label] = (T[label] || 0) + performance.now() - t0; return r; }; };
    wrap(game, 'stepSim', 'sim'); wrap(game, 'renderFrame', 'renderFrame(total)');
    wrap(game.env, 'update', 'env.update'); wrap(game.terrainView, 'update', 'terrain.update'); wrap(game.worldView, 'update', 'world.update'); wrap(game.cam, 'update', 'camera');
    wrap(game.probe, 'update', 'probe'); wrap(game.gfx, 'render', 'gfx.render(total)'); wrap(game.gfx, 'renderShadows', 'gfx.shadows');
    for (const c of game.cars) wrap(c.visual, 'update', 'cars.update');
    // the renderer itself, split by render target
    const r = game.gfx.renderer; const rr = r.render.bind(r); const names = new Map([[game.gfx.rt.scene, 'r:scene'], [game.gfx.rt.mask, 'r:mask']]);
    r.render = (scene, cam) => { const t0 = performance.now(); rr(scene, cam); const tg = r.getRenderTarget(); const k = scene === game.scene ? (names.get(tg) || (tg === game.gfx._shadowRT ? 'r:shadow' : 'r:probe')) : 'r:post'; T[k] = (T[k] || 0) + performance.now() - t0; T['n:' + k] = (T['n:' + k] || 0) + 1; };
    game.hooks.frame.push(() => { frames++; });
    api.pause(false); api.hold(false);
    await new Promise((res2) => setTimeout(res2, 800)); for (const k of Object.keys(T)) T[k] = 0; frames = 0;
    await new Promise((res2) => setTimeout(res2, secs * 1000));
    const out = { frames, fps: +(frames / secs).toFixed(1) };
    for (const [k, v] of Object.entries(T)) out[k] = +(v / frames).toFixed(k.startsWith('n:') ? 1 : 3);
    out.draw = { ...game.gfx.stats };
    return out;
  }, { s: Number(opt.s || 40), secs: Number(opt.secs || 3) });
  console.log(JSON.stringify(res, null, 1));
} finally { await browser.close(); await srv.close(); }
