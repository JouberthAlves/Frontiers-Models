// npm run verify — starts the static server and a GPU-enabled browser, runs every test of section 13 of the
// brief against the real game and writes the evidence to verification/.
//
//   node scripts/verify.mjs [--only=jornadas,estado,anticorte,capturas,varredura,volta,desempenho] [--shots=S1,S5] [--refs=<folder with the 14 reference JPGs>] [--headed]
//
// Tests (section 13.1):  1-2 jornadas   3 estado   4 anticorte   5 IA   6 integridade   7 capturas (S1-S12)
//                        8 cena (scene-stats.json)   9 varredura;   13.2 / vídeo: volta;   13.3: desempenho
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { launchBrowser, startServer } from './lib/harness.mjs';
import { Report, OUT, out, ensureDir, writeJson } from './verify/common.mjs';
import { journey, stateTest, antiCut } from './verify/journey.mjs';
import { shots, findRefs, SHOTS } from './verify/shots.mjs';
import { sweep } from './verify/sweep.mjs';
import { media, perf } from './verify/media.mjs';

const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const only = opt.only ? opt.only.split(',') : null; const want = (k) => !only || only.includes(k);
ensureDir(OUT);
const R = new Report();
const srv = await startServer({});
const { browser, channel } = await launchBrowser({ headless: !opt.headed, extraArgs: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
const env = { date: new Date().toISOString(), browser: `${channel} ${browser.version()}`, os: `${os.type()} ${os.release()} ${os.arch()}`, cpu: `${os.cpus()[0].model.trim()} (${os.cpus().length} threads)`, memoryGB: Math.round(os.totalmem() / 2 ** 30), node: process.version, headless: !opt.headed };
R.log(`verify: ${env.browser} on ${env.os}, ${env.cpu}`);
const refsDir = findRefs(opt.refs);
R.log(refsDir ? `reference images: ${refsDir}` : 'reference images not found (expected in ../refs): the comparison sheets will only hold the captures');
const data = {};

try {
  // ------------------------------------------------------------------ tests 1 and 2: the journeys
  if (want('jornadas')) {
    await R.test('T1', 'Jornada: menu → carro → 3 voltas com 5 IAs → resultados → correr de novo', async (check) => (data.j3 = await journey(R, browser, srv.url, check, { id: 'jornada-3-voltas', laps: 3, car: 'hatch', colour: 2, scale: 8, audit: true })));
    await R.test('T2', 'Jornada com 6 voltas', async (check) => (data.j6 = await journey(R, browser, srv.url, check, { id: 'jornada-6-voltas', laps: 6, car: 'gt', colour: 4, scale: 8 })));
    const races = [['3 voltas', data.j3], ['6 voltas', data.j6]].filter(([, j]) => j && j.race);
    // ---------------------------------------------------------------- test 5: health of the rivals
    await R.test('T5', 'IA: nenhuma parada ou fora da pista por mais de 5 s; ao menos 1 ultrapassagem entre IAs', async (check) => {
      check(races.length === 2, 'the two journeys did not produce a race');
      return races.map(([name, j]) => {
        const ai = j.race.entries.filter((e) => !e.player);
        const worstStop = Math.max(...ai.map((e) => e.maxStuck)), worstOff = Math.max(...ai.map((e) => e.maxOff));
        check(worstStop <= 5, `${name}: a rival stood still for ${worstStop} s`); check(worstOff <= 5, `${name}: a rival was off the track for ${worstOff} s`);
        check(j.race.aiOvertakes >= 1, `${name}: no overtake between rivals`);
        check(ai.every((e) => e.lapsDone >= j.laps - 1), `${name}: a rival is more than a lap behind`);
        return { race: name, rivals: ai.map((e) => ({ name: e.name, laps: e.lapsDone, best: e.best === null ? null : +e.best.toFixed(2), longestStop: e.maxStuck, longestOffTrack: e.maxOff })), overtakes: j.race.overtakes, overtakesBetweenRivals: j.race.aiOvertakes, resets: j.resets.filter((l) => l.name !== 'Você') };
      });
    });
    // ---------------------------------------------------------------- test 6: integrity
    await R.test('T6', 'Integridade: validateWorld sem erros; zero eventos nas corridas; câmera nunca dentro de geometria', async (check) => {
      const stats = fs.existsSync(out('scene-stats.json')) ? JSON.parse(fs.readFileSync(out('scene-stats.json'), 'utf8')) : null;
      check(stats && stats.validation.ok, `validateWorld: ${stats ? stats.validation.errors.join('; ') : 'not read'}`);
      return { validateWorld: stats ? stats.validation : null, races: races.map(([name, j]) => {
        const i = j.integrity; const sum = i.underTerrain + i.throughBarrier + i.outOfWorld + i.wheelFar;
        check(sum === 0, `${name}: integrity events ${JSON.stringify(i)}`); check(i.cameraInside === 0 && j.cameraViolations === 0, `${name}: camera inside geometry (${i.cameraInside} frames)`);
        check(j.resets.filter((l) => l.integrity).length === 0, `${name}: integrity resets in the log`);
        return { race: name, counters: i, cameraFramesInsideGeometry: j.cameraViolations, resetsLogged: j.resets };
      }) };
    });
    // ---------------------------------------------------------------- test 8: scene audit (read during journey 1)
    await R.test('T8', 'Auditoria da cena lida em runtime (scene-stats.json)', async (check) => {
      const a = data.j3 && data.j3.sceneAudit; check(!!a, 'the scene was not audited'); if (!a) return null;
      check(a.pass, a.failures.join('; ')); const s = JSON.parse(fs.readFileSync(out('scene-stats.json'), 'utf8'));
      return { file: 'scene-stats.json', cars: s.cars.map((c) => ({ model: c.model, trianglesLod0: c.trianglesLod0, materials: c.materialCount })), buildings: s.boxDetector.buildings, prototypes: s.boxDetector.prototypes.length, flatColourFlagged: s.flatColour.flagged.length, texturesFlagged: s.textures.flagged.length, counts: s.counts, engineAudio: s.engineAudio && s.engineAudio.pass };
    });
  }
  if (want('estado')) await R.test('T3', 'Pausa/continuar, reiniciar no meio, voltar ao menu: sem estado antigo, sem áudio duplicado, heap estável', async (check) => (data.state = await stateTest(R, browser, srv.url, check)));
  if (want('anticorte')) await R.test('T4', 'Anticorte: cortar a pista não conta volta', async (check) => (data.cut = await antiCut(R, browser, srv.url, check)));
  // ------------------------------------------------------------------ test 7 and section 13.4: screenshots and image sanity
  if (want('capturas')) {
    await R.test('T7', 'Capturas S1–S12 (1920×1080) e sanidade de imagem', async (check) => {
      const m = await shots(R, browser, srv.url, check, { only: opt.shots ? opt.shots.split(',') : null, refsDir });
      if (!opt.shots) { writeJson(out('image-metrics.json'), { ...m, environment: env }); check(Object.keys(m.shots).length === SHOTS.length, 'not every screenshot was produced'); }
      else writeJson(out('logs', 'image-metrics-partial.json'), m);
      return { file: 'image-metrics.json', shots: Object.fromEntries(Object.entries(m.shots).map(([k, v]) => [k, { sky: v.skyFraction, mean: v.luminanceMean, std: v.luminanceStd, bucket: v.dominantBucketShare, fps: v.fps, pass: v.pass }])) };
    });
  }
  // ------------------------------------------------------------------ test 9: camera sweep
  if (want('varredura')) {
    await R.test('T9', 'Varredura de câmera a cada 25 m (Alta): métricas fotográficas em todos os pontos', async (check) => (data.sweep = await sweep(R, browser, srv.url, check, { low: false })));
    await R.test('T9b', 'Varredura de câmera a cada 25 m (Baixa)', async (check) => (data.sweepLow = await sweep(R, browser, srv.url, check, { low: true })));
  }
  // ------------------------------------------------------------------ video and audio of one lap
  if (want('volta')) await R.test('A1', 'Vídeo da volta (volta.webm) e PCM do master após o limiter (audio-volta.wav)', async (check) => (data.media = await media(R, browser, srv.url, check)));
  // ------------------------------------------------------------------ performance
  if (want('desempenho')) await R.test('P1', 'Desempenho em Z3 com 5 IAs, Alta e Baixa, 1920×1080', async (check) => { data.perf = await perf(R, browser, srv.url, check, env); writeJson(out('performance.json'), { ...data.perf, environment: env }); return data.perf; });
} finally {
  await browser.close(); await srv.close();
}

const failed = R.tests.filter((t) => !t.pass);
const summary = { command: 'npm run verify' + (process.argv.length > 2 ? ' -- ' + process.argv.slice(2).join(' ') : ''), partial: !!only, environment: env, references: refsDir ? 'found' : 'not found', pass: failed.length === 0, tests: R.tests };
writeJson(out(only ? path.join('logs', 'results-partial.json') : 'results.json'), summary);
R.log('');
for (const t of R.tests) R.log(`${t.pass ? 'PASS' : 'FAIL'}  ${t.id.padEnd(4)} ${t.title}${t.pass ? '' : '\n        ' + t.failures.join('\n        ')}`);
R.log(failed.length ? `\n${failed.length} test(s) FAILED` : `\nall ${R.tests.length} tests passed`);
R.flush();
process.exit(failed.length ? 1 : 0);
