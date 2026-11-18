// Dev tool: where does the frame time go? Runs the same view with parts of the scene switched off.
//   node scripts/dev/profile.mjs [--s=40] [--q=low] [--w=1920 --h=1080] [--only=name,name]
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const srv = await startServer({}); const { browser } = await launchBrowser({ uncapped: true });
const VARIANTS = {
  baseline: ['', ''],
  noScatter: ['game.worldView.scatter.group.visible = false;', 'game.worldView.scatter.group.visible = true;'],
  noWorld: ['game.worldView.group.visible = false;', 'game.worldView.group.visible = true;'],
  noCars: ['game.cars.forEach((c) => { c.visual.root.visible = false; });', 'game.cars.forEach((c) => { c.visual.root.visible = true; });'],
  noTerrain: ['game.terrainView.group.visible = false;', 'game.terrainView.group.visible = true;'],
  noSea: ['game.sea.mesh.visible = false;', 'game.sea.mesh.visible = true;'],
  noShadows: ['game.gfx.renderer.shadowMap.enabled = false; game.env.csm.lights.forEach((l) => { l.castShadow = false; });', 'game.gfx.renderer.shadowMap.enabled = true; game.env.csm.lights.forEach((l) => { l.castShadow = true; });'],
  noProbe: ['game._probeWas = game.probe.enabled; game.probe.enabled = false;', 'game.probe.enabled = game._probeWas;'],
  simOnly: ['game._rf = game.renderFrame; game.renderFrame = () => {};', 'game.renderFrame = game._rf;'],
  low: ['api.setQuality("low");', 'api.setQuality("high");'],
};
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1&auto=1${opt.q ? '&q=' + opt.q : ''}`, width: Number(opt.w || 1920), height: Number(opt.h || 1080) });
  const s = Number(opt.s || 40);
  const names = opt.only ? opt.only.split(',') : Object.keys(VARIANTS);
  for (const name of names) {
    const [on, off] = VARIANTS[name];
    const r = await page.evaluate(async ({ s, on, off }) => {
      const api = window.__api, game = api.game; game.state = 'racing';
      game.cars.forEach((c, i) => api.place(i, s - (5 - i) * 9, (i % 2 ? 1 : -1) * 2.2, 40));
      (0, eval)(`(() => { const api = window.__api, game = api.game; ${on} })()`);
      api.pause(false); api.hold(false);
      await new Promise((r) => setTimeout(r, 900));
      const times = []; let last = performance.now();
      await new Promise((resolve) => { const t0 = last; const f = () => { const n = performance.now(); times.push(n - last); last = n; if (n - t0 < 2500) requestAnimationFrame(f); else resolve(); }; requestAnimationFrame(f); });
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const draw = { ...game.gfx.stats };
      (0, eval)(`(() => { const api = window.__api, game = api.game; ${off} })()`);
      return { ms: +avg.toFixed(2), fps: +(1000 / avg).toFixed(1), draw };
    }, { s, on, off });
    console.log(name.padEnd(10), JSON.stringify(r));
  }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror');
  if (bad.length) console.log('console errors:', bad.slice(0, 5).map((b) => b.text.slice(0, 300)));
} finally { await browser.close(); await srv.close(); }
