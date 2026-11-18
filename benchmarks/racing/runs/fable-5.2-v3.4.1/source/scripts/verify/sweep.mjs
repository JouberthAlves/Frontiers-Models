// Test 9: the chase camera every 25 m of the lap. One thumbnail per point, the photographic metrics of
// test 7 on each of them, and a contact sheet. There is no tunnel on this circuit: no point is exempt.
import fs from 'node:fs';
import path from 'node:path';
import { openGame } from '../lib/harness.mjs';
import { decodePNG, photoMetrics, judge, resize, contactSheet } from '../lib/image.mjs';
import { out, ensureDir, writeJson, writeFile, removeFile, consoleProblems, saveConsole } from './common.mjs';

export async function sweep(R, browser, base, check, { low = false, step = 25 } = {}) {
  const dir = ensureDir(out(low ? 'sweep-low' : 'sweep'));
  for (const f of fs.readdirSync(dir)) if (/^s\d{4}\.png$/.test(f)) removeFile(path.join(dir, f));
  const { page, logs, externals, context } = await openGame(browser, base, { query: `dev=1&auto=1${low ? '&q=low' : ''}`, width: 640, height: 360 });
  const frames = []; const tiles = [];
  try {
    const L = await page.evaluate(() => window.__api.info().trackLength);
    const tunnel = await page.evaluate(() => { const j = window.__api.game.world.json; return j.tunnel || null; });
    for (let s = 0; s < L; s += step) {
      const info = await page.evaluate((s) => {
        const api = window.__api, game = api.game; api.pause(true); api.hold(true); api.freezeTime(12.5); game.particles.clear(); game.cam.t = 0;
        // the rivals wait far away: the frame shows the place
        game.cars.forEach((c) => { if (!c.isPlayer) api.place(c.index, s + 1500 + c.index * 12, 0, 0); });
        api.place(5, s, 0, 28); api.pose(null); api.autopilot(true); api.step(40); api.render(1 / 60); api.step(2); api.render(1 / 60);
        const t = game.world.track;
        return { sky: api.skyFraction(), zone: t.zoneIndexAt(s) + 1, onBridge: t.onBridge(game.player.vehicle.s), camera: game.camera.position.toArray().map((v) => +v.toFixed(1)), check: { terrain: +game.cam.lastCheck.terrain.toFixed(2), barrier: +game.cam.lastCheck.barrier.toFixed(2) } };
      }, s);
      const name = `s${String(Math.round(s)).padStart(4, '0')}.png`;
      // the thumbnails are kept for the High preset (the test); for Low the contact sheet and the metrics are enough
      const buf = await page.screenshot({ type: 'png' }); if (!low) writeFile(path.join(dir, name), buf);
      const img = decodePNG(buf); const m = photoMetrics(img); const fails = judge(m, info.sky, {});
      frames.push({ s, file: name, zone: 'Z' + info.zone, bridge: info.onBridge, tunnel: false, skyFraction: +info.sky.toFixed(4), luminanceMean: m.mean, luminanceStd: m.std, dominantBucketShare: m.bucketShare, cameraClearance: info.check, pass: fails.length === 0, failures: fails });
      tiles.push({ img: resize(img, 320, 180), label: `s=${Math.round(s)} Z${info.zone} ceu ${Math.round(info.sky * 100)}% m.${String(Math.round(m.mean * 100)).padStart(2, '0')}`, bad: fails.length > 0 });
      if (fails.length) check(false, `${low ? 'Baixa' : 'Alta'} s=${s}: ${fails.join('; ')}`);
    }
    writeFile(out(low ? 'sweep-sheet-low.png' : 'sweep-sheet.png'), contactSheet(tiles, 9, 320, 180));
    const summary = {
      preset: low ? 'Baixa' : 'Alta', step, points: frames.length, viewport: [640, 360], camera: 'chase (same camera as the game), player at 28 m/s on the centre line, rivals removed from the frame',
      tunnel: tunnel ? 'present' : 'none on this circuit (the crossing of the inlet is an open bridge): no point is exempt from the sky rule',
      skyMin: Math.min(...frames.map((f) => f.skyFraction)), meanMin: Math.min(...frames.map((f) => f.luminanceMean)), meanMax: Math.max(...frames.map((f) => f.luminanceMean)),
      stdMin: Math.min(...frames.map((f) => f.luminanceStd)), bucketMax: Math.max(...frames.map((f) => f.dominantBucketShare)), failing: frames.filter((f) => !f.pass).length, frames,
    };
    writeJson(path.join(dir, 'metrics.json'), summary);
    R.log(`   sweep ${summary.preset}: ${frames.length} points, sky min ${(summary.skyMin * 100).toFixed(1)} %, mean ${summary.meanMin.toFixed(3)}..${summary.meanMax.toFixed(3)}, std min ${summary.stdMin.toFixed(3)}, bucket max ${(summary.bucketMax * 100).toFixed(1)} %, failing ${summary.failing}`);
    const problems = consoleProblems(logs, externals); check(problems.length === 0, `console: ${problems.slice(0, 3).join(' | ')}`);
    const { frames: _, ...brief } = summary; return brief;
  } finally { saveConsole('varredura-' + (low ? 'baixa' : 'alta'), logs); await context.close(); }
}
