// Dev tool: where do the long frames come from? Runs the race in Z3 with the 60 Hz limiter and breaks every
// frame down into its parts (simulation, render, HUD, audio, particles, the rest).
//   node scripts/dev/spikes.mjs [--q=low] [--secs=15] [--s=1625] [--nohud=1] [--w=1920 --h=1080] [--cap=60] [--js="..."]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({ extraArgs: opt.noflags ? [] : opt.onlygc ? ['--js-flags=--expose-gc'] : opt.onlymem ? ['--enable-precise-memory-info'] : ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `auto=1${opt.cap === '0' ? '' : '&cap=' + (opt.cap || 60)}${opt.q ? '&q=' + opt.q : ''}`, width: Number(opt.w || 1920), height: Number(opt.h || 1080) });
  await page.waitForFunction(() => window.__api.game.state === 'menu', null, { timeout: 90000 });
  const res = await page.evaluate(async ({ secs, s, nohud, js }) => {
    const api = window.__api, game = api.game; await api.raceNow(3); api.pack(s, 28); api.resync(0, 60);
    if (nohud) game.hud.visible = false;
    if (js) await (0, eval)(`(async () => { const api = window.__api, game = api.game; ${js} })()`);
    const acc = { sim: 0, render: 0, hud: 0, audio: 0, particles: 0, env: 0, probe: 0, gfx: 0, world: 0, cars: 0 };
    const wrap = (obj, name, key) => { const f = obj[name].bind(obj); obj[name] = (...a) => { const t = performance.now(); const r = f(...a); acc[key] += performance.now() - t; return r; }; };
    wrap(game, 'stepSim', 'sim'); wrap(game, 'renderFrame', 'render'); wrap(game.hud, 'draw', 'hud'); wrap(game.audio, 'update', 'audio'); wrap(game.particles, 'update', 'particles'); wrap(game.env, 'update', 'env'); wrap(game.probe, 'update', 'probe'); wrap(game.gfx, 'render', 'gfx'); wrap(game.worldView, 'update', 'world'); wrap(game.terrainView, 'update', 'world'); for (const c of game.cars) wrap(c.visual, 'update', 'cars');
    const frames = []; let last = performance.now(); const frame0 = game.frame.bind(game);
    game.frame = (dt) => { for (const k in acc) acc[k] = 0; const t = performance.now(); frame0(dt); const end = performance.now(); frames.push({ gap: t - last, total: end - t, ...acc, heap: performance.memory.usedJSHeapSize }); last = t; };
    await new Promise((r) => setTimeout(r, 2500)); frames.length = 0; api.pack(s, 28);
    await new Promise((r) => setTimeout(r, secs * 1000));
    const n = frames.length; const gaps = frames.map((f) => f.gap).sort((a, b) => a - b); const sum = gaps.reduce((a, b) => a + b, 0);
    const mean = (k) => +(frames.reduce((a, f) => a + f[k], 0) / n).toFixed(2); const worst = gaps.slice(n - Math.max(1, Math.round(n * 0.01)));
    const long = frames.map((f, i) => ({ i, ...f })).filter((f) => f.gap > 21 || f.total > 14);
    let gcs = 0; for (let i = 1; i < n; i++) if (frames[i].heap < frames[i - 1].heap - 2e6) gcs++;
    return { frames: n, fps: +(n / (sum / 1000)).toFixed(1), low1: +(1000 / (worst.reduce((a, b) => a + b, 0) / worst.length)).toFixed(1), p50: +gaps[n >> 1].toFixed(1), p99: +gaps[Math.floor(n * 0.99)].toFixed(1), max: +gaps[n - 1].toFixed(1),
      mean: { total: mean('total'), sim: mean('sim'), render: mean('render'), env: mean('env'), probe: mean('probe'), gfx: mean('gfx'), world: mean('world'), cars: mean('cars'), hud: mean('hud'), audio: mean('audio'), particles: mean('particles') }, heapMB: Math.round(frames[n - 1].heap / 1048576), heapDrops: gcs,
      long: long.slice(0, 40).map((f) => `#${f.i} gap ${f.gap.toFixed(1)} total ${f.total.toFixed(1)} sim ${f.sim.toFixed(1)} render ${f.render.toFixed(1)} [env ${f.env.toFixed(1)} probe ${f.probe.toFixed(1)} gfx ${f.gfx.toFixed(1)} world ${f.world.toFixed(1)} cars ${f.cars.toFixed(1)}] hud ${f.hud.toFixed(1)} audio ${f.audio.toFixed(1)} part ${f.particles.toFixed(1)} heap ${(f.heap / 1048576).toFixed(0)}`), longCount: long.length };
  }, { secs: Number(opt.secs || 15), s: Number(opt.s || 1625), nohud: !!opt.nohud, js: opt.js || '' });
  console.log(JSON.stringify(res, null, 1));
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror'); if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
