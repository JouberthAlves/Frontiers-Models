// Screenshots S1-S12 (section 13.4), their image metrics (test 7) and the comparison sheets.
// Camera positions are defined here, in track space, and every still is reproducible: the field is
// placed, the simulation advances a fixed number of steps and the frame is rendered with a fixed clock.
import fs from 'node:fs';
import path from 'node:path';
import { openGame } from '../lib/harness.mjs';
import { decodePNG, photoMetrics, judge } from '../lib/image.mjs';
import { out, ensureDir, writeJson, writeFile, consoleProblems, saveConsole, ROOT } from './common.mjs';

// `scene` runs in the page with (api, game); `pose` = [s, d, h, look s, look d, look h, fov, 'road' | 'ground'] is a free
// camera in track space (h above the road plane or above the ground / sea); without it the chase camera is used.
export const SHOTS = [
  { id: 'S1', file: 's1-reta-orla.png', title: 'Reta da orla em velocidade, sol à frente', refs: ['01-golden-hour-palmeiras.jpg', '02-costa-praia-falesia.jpg'],
    scene: 'api.pack(150, 58);', steps: 70, clock: 13.6 },
  { id: 'S2', file: 's2-grid-3-4.png', title: 'Carro no grid, 3/4 frontal baixa (sem HUD)', refs: ['11-carro-pintura-vidro-rodas.jpg'], grid: 0.97, hud: false, fps: false },
  { id: 'S3', file: 's3-praia-espuma.png', title: 'Câmera baixa: areia molhada, espuma, rochas', refs: ['02-costa-praia-falesia.jpg', '04-agua-margem-pedras.jpg'],
    scene: 'api.pack(150, 58);', steps: 20, clock: 13.2, pose: [84, -51, 0.7, 98, -72, 0, 55, 'ground'], exemptSky: 'close de praia e rochas (isenção de céu prevista no teste 7)' },
  { id: 'S4', file: 's4-falesia-mirante.png', title: 'Serpentina com o mar abaixo', refs: ['02-costa-praia-falesia.jpg'],
    scene: 'api.pack(872, 24);', steps: 40, clock: 41.5, pose: [930, 22, 11, 850, -6, -6, 62, 'road'] },
  { id: 'S5', file: 's5-vila-rua.png', title: 'Rua da vila com o marco visível', refs: ['05-vila-igreja-densidade.jpg', '06-vila-pedra-disputa.jpg', '07-vila-paredes-velocidade.jpg'],
    scene: 'api.pack(1735, 30);', steps: 70, clock: 71.8 },
  { id: 'S6', file: 's6-bosque-luz.png', title: 'Bosque com sol rasante', refs: ['08-vegetacao-densa.jpg', '10-luz-rasante-floresta.jpg'],
    scene: 'api.pack(2775, 38);', steps: 70, clock: 93.4 },
  { id: 'S7', file: 's7-ponte-ou-tunel.png', title: 'Entrada da ponte ligada ao terreno', refs: ['14-ponte-terreno.jpg'],
    scene: 'api.pack(2948, 40);', steps: 30, clock: 99.1, pose: [2926, -26, 8, 3005, 4, -7, 55, 'road'], exterior: true },
  { id: 'S8', file: 's8-disputa.png', title: 'Jogador lado a lado com 2+ IAs', refs: ['09-vegetacao-curva-disputa.jpg', '13-pelotao-ia-lado-a-lado.jpg'],
    scene: 'api.pack(236, 55, [[1.4, -3.4], [-0.9, 3.4], [15, -1.7], [25, 1.9], [41, 0.2]], 0);', steps: 36, clock: 16.9 },
  { id: 'S9', file: 's9-close-pista.png', title: 'Close de asfalto, zebra e guardrail', refs: [],
    scene: 'api.pack(520, 20);', steps: 20, clock: 28.3, pose: [569, 4.0, 0.3, 583, 7.3, 0.36, 44, 'road'], exemptSky: 'close de pista e zebra (isenção de céu prevista no teste 7)' },
  { id: 'S10', file: 's10-baixa-vila.png', title: 'Posição de S5 no preset Baixa', refs: [], low: true,
    scene: 'api.pack(1735, 30);', steps: 70, clock: 71.8 },
  { id: 'S11', file: 's11-escala.png', title: 'Carro parado ao lado de uma casa com porta', refs: [], hud: false, fps: false, exemptSky: 'inspeção estática de escala (isenção de céu prevista no teste 7)',
    scene: `const V = game.world.lists.village, t = game.world.track, sp = t.spline;
      const u = V.units.find((q) => q.front && q.row === 'main' && !q.garden && q.sideIndex === 1 && q.archetype === 'townhouse' && q.frontS > 1690 && q.frontS < 1960) || V.units.find((q) => q.front && q.row === 'main' && !q.garden && q.sideIndex === 1);
      const line = sp.sampleArr(sp.half, u.frontS) + sp.sampleArr(t.barOff[1], u.frontS);
      game.cars.forEach((c) => { if (!c.isPlayer) api.place(c.index, u.frontS + 900 + c.index * 12, 0, 0); });
      api.place(5, u.frontS + 0.4, line - 1.45, 0); game.player.vehicle.frozen = true;
      window.__s11 = { s: u.frontS, line, unit: u.id, archetype: u.archetype, floors: u.floors };`,
    steps: 2, poseFrom: 'const q = window.__s11; return [q.s - 1.0, q.line - 12.6, 1.45, q.s + 0.2, q.line, 1.75, 40, "road"];' },
  { id: 'S12', file: 's12-mapa.png', title: 'Vista de cima da volta inteira', refs: [], hud: false, fps: false, map: true,
    exemptSky: 'mapa aéreo de inspeção', exemptPhoto: 'mapa de inspeção, não é imagem fotográfica (métricas de composição: não aplicável)',
    scene: 'game.placeOnGrid();', steps: 2 },
];

/** runs in the page: sets one still up and returns what was measured there */
async function pageShot(shot) {
  const api = window.__api, game = api.game; const run = (src) => (src ? new Function('api', 'game', src)(api, game) : undefined);
  const tp = (s, d, h, mode) => { const p = api.trackPoint(s, d); return [p.x, (mode === 'ground' ? Math.max(0, api.groundHeight(p.x, p.z)) : p.y) + h, p.z]; };
  const setPose = (P) => api.pose(tp(P[0], P[1], P[2], P[7]), tp(P[3], P[4], P[5], P[7]), P[6]);
  const res = { id: shot.id };
  api.hold(false); api.pause(false); api.freezeTime(null); api.mapMode(false); api.pose(null); api.autopilot(true); api.timeScale(1);
  if (shot.grid !== undefined) {
    // the presentation of the grid, straight from the game: its own camera, no HUD
    await game.startRace(); api.pause(true); api.hold(true); api.freezeTime(12.5); game.particles.clear();
    game.race.t = shot.grid * 5.0; api.render(1 / 60); api.render(1 / 60);
    res.state = game.state; res.hud = game.hud.visible; res.sky = api.skyFraction(); res.fps = null;
    res.camera = { position: game.camera.position.toArray().map((v) => +v.toFixed(2)), fov: +game.camera.fov.toFixed(1), check: game.cam.lastCheck };
    return res;
  }
  if (game.state !== 'racing') await api.raceNow(3);
  const hudWas = game.hud.visible; game.hud.visible = shot.hud !== false;
  // ---- live for a moment: the frame rate at this place, cars moving
  if (shot.fps !== false) {
    run(shot.scene); if (shot.pose) setPose(shot.pose);
    await api.measureFps(0.6);                                   // let what the new place needs reach the GPU first
    const m = await api.measureFps(2.0); res.fps = { fps: m.fps, low1: m.low1, frames: m.frames, cpuMs: m.cpuMs, drawCalls: m.draw.calls };
  } else res.fps = null;
  // ---- the still: placed again, fixed number of steps, fixed clock
  api.pause(true); api.hold(true); api.freezeTime(12.5); api.pose(null); game.particles.clear(); game.cam.t = 0;
  run(shot.scene);
  if (shot.clock !== undefined) api.resync(0, shot.clock);
  api.step(shot.steps ?? 60);
  if (shot.map) { api.mapMode(true); res.map = api.topView(); }
  const P = shot.poseFrom ? new Function(shot.poseFrom)() : shot.pose;
  if (P) setPose(P);
  api.render(1 / 60); api.render(1 / 60);
  res.state = game.state; res.hud = game.hud.visible; res.sky = api.skyFraction(); res.quality = game.gfx.quality.id;
  res.camera = { mode: P ? 'free (track space)' : shot.map ? 'top view' : 'chase', position: game.camera.position.toArray().map((v) => +v.toFixed(2)), fov: +game.camera.fov.toFixed(1) };
  res.player = { s: +game.player.vehicle.s.toFixed(1), d: +game.player.vehicle.d.toFixed(2), kmh: Math.round(game.player.vehicle.kmh), place: game.race.player ? game.race.player.place : null };
  res.rivalsWithin60m = game.cars.filter((c) => !c.isPlayer && Math.hypot(c.vehicle.x - game.player.vehicle.x, c.vehicle.z - game.player.vehicle.z) < 60).length;
  if (window.__s11 && shot.id === 'S11') res.scale = window.__s11;
  game.hud.visible = hudWas;
  return res;
}

/** side-by-side sheet: the capture and its reference(s), all at the same size */
async function compareSheet(page, shot, pngBuf, refsDir) {
  const refs = shot.refs.map((name) => { const f = refsDir ? path.join(refsDir, name) : null; return { name, data: f && fs.existsSync(f) ? 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64') : null }; });
  const url = await page.evaluate(async ({ mine, refs, id, title }) => {
    const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
    const W = 960, H = 540, CAP = 44; const n = 1 + Math.max(1, refs.length);
    const cv = document.createElement('canvas'); cv.width = W * n; cv.height = H + CAP; const c = cv.getContext('2d');
    c.fillStyle = '#14161c'; c.fillRect(0, 0, cv.width, cv.height);
    c.drawImage(await load(mine), 0, CAP, W, H);
    c.font = '600 20px "Segoe UI", Arial, sans-serif'; c.textBaseline = 'middle'; c.fillStyle = '#f4efe6';
    c.fillText(`${id} — este jogo (npm run verify): ${title}`, 14, CAP / 2);
    if (!refs.length) { c.fillStyle = '#9aa0ab'; c.fillText('sem referência indicada para esta captura (tabela 13.4)', W + 14, CAP / 2); c.fillStyle = '#1d2028'; c.fillRect(W, CAP, W, H); }
    for (let i = 0; i < refs.length; i++) {
      const x = W * (i + 1); c.fillStyle = '#f4efe6'; c.fillText(`referência ${refs[i].name}`, x + 14, CAP / 2);
      if (refs[i].data) c.drawImage(await load(refs[i].data), x, CAP, W, H);
      else { c.fillStyle = '#1d2028'; c.fillRect(x, CAP, W, H); c.fillStyle = '#c9a26b'; c.fillText('referência não encontrada: a pasta refs/ fica ao lado do projeto, fora do build', x + 14, CAP + 40); }
    }
    return cv.toDataURL('image/png');
  }, { mine: 'data:image/png;base64,' + pngBuf.toString('base64'), refs, id: shot.id, title: shot.title });
  return { buffer: Buffer.from(url.split(',')[1], 'base64'), missing: refs.filter((r) => !r.data).map((r) => r.name) };
}

export function findRefs(arg) {
  const cands = [arg, process.env.RACING_REFS, path.join(ROOT, 'refs'), path.join(ROOT, '..', 'refs'), path.join(ROOT, '..', '..', 'refs')].filter(Boolean);
  return cands.find((d) => fs.existsSync(path.join(d, '01-golden-hour-palmeiras.jpg'))) || null;
}

export async function shots(R, browser, base, check, { only = null, refsDir = null } = {}) {
  ensureDir(out('compare')); const metrics = { generatedBy: 'npm run verify', resolution: [1920, 1080], frameRate: 'measured live at each place for 2 s with the frame limiter of the verifier (?cap=60), so that the figure is comparable between machines; a frame time is the interval between the starts of two consecutive frames', limits: { sky: '>= 10 % (depth buffer at the far plane, measured on the 3D frame)', mean: '0.25..0.75', std: '>= 0.12', bucket: '<= 30 % (4 bits per channel)' }, shots: {} };
  const list = SHOTS.filter((s) => !only || only.includes(s.id));
  for (const low of [false, true]) {
    const group = list.filter((s) => !!s.low === low); if (!group.length) continue;
    const { page, logs, externals, context } = await openGame(browser, base, { query: `auto=1&cap=60${low ? '&q=low' : ''}`, width: 1920, height: 1080 });
    const helper = await context.newPage(); await page.bringToFront();      // the helper only composes the comparison sheets; the game stays in front
    try {
      await page.waitForFunction(() => window.__api.game.state === 'menu', null, { timeout: 90000 });
      for (const shot of group) {
        const info = await page.evaluate(pageShot, shot); await page.waitForTimeout(120);
        const file = out(shot.file); const buf = await page.screenshot({ type: 'png' }); writeFile(file, buf);
        const m = photoMetrics(decodePNG(buf));
        const exempt = { sky: !!shot.exemptSky, photo: !!shot.exemptPhoto };
        const fails = judge(m, info.sky, exempt);
        const cmp = await compareSheet(helper, shot, buf, refsDir); writeFile(out('compare', shot.id.toLowerCase() + '.png'), cmp.buffer);
        metrics.shots[shot.id] = {
          file: shot.file, content: shot.title, preset: low ? 'Baixa' : 'Alta', hud: info.hud, state: info.state, camera: info.camera, player: info.player, rivalsWithin60m: info.rivalsWithin60m,
          skyFraction: +info.sky.toFixed(4), skyRequired: !exempt.sky, skyExemption: shot.exemptSky || null,
          luminanceMean: exempt.photo ? 'não aplicável' : m.mean, luminanceStd: exempt.photo ? 'não aplicável' : m.std, dominantBucketShare: exempt.photo ? 'não aplicável' : m.bucketShare, dominantBucket: m.bucket, topBuckets: m.topBuckets,
          photoExemption: shot.exemptPhoto || null, measuredRaw: exempt.photo ? { mean: m.mean, std: m.std, bucketShare: m.bucketShare } : undefined,
          fps: info.fps ? info.fps.fps : 'não aplicável (captura estática)', fpsLow1: info.fps ? info.fps.low1 : 'não aplicável', frameCpuMs: info.fps ? info.fps.cpuMs : null, drawCalls: info.fps ? info.fps.drawCalls : null,
          compare: `compare/${shot.id.toLowerCase()}.png`, references: shot.refs, referencesMissing: cmp.missing, scale: info.scale, pass: fails.length === 0, failures: fails,
        };
        R.log(`   ${shot.id} ${shot.file}: sky ${(info.sky * 100).toFixed(1)} %, mean ${m.mean.toFixed(3)}, std ${m.std.toFixed(3)}, bucket ${(m.bucketShare * 100).toFixed(1)} %, fps ${info.fps ? info.fps.fps : '-'}${fails.length ? '  FAIL: ' + fails.join('; ') : ''}`);
        check(fails.length === 0, `${shot.id}: ${fails.join('; ')}`);
        if (shot.grid !== undefined) check(info.state === 'grid' && info.hud === false, 'S2 was not taken in the grid presentation without HUD');
        if (shot.id === 'S8') check(info.rivalsWithin60m >= 2, `S8 has ${info.rivalsWithin60m} rivals near the player`);
        if (cmp.missing.length) R.log(`   (reference images missing for ${shot.id}: ${cmp.missing.join(', ')})`);
      }
      const problems = consoleProblems(logs, externals); check(problems.length === 0, `console (${low ? 'low' : 'high'}): ${problems.slice(0, 3).join(' | ')}`);
    } finally { saveConsole('capturas-' + (low ? 'baixa' : 'alta'), logs); await context.close(); }
  }
  return metrics;
}
