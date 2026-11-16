import { chromium } from 'playwright';
import { startServer } from './serve.mjs';
import { analyzeWavBuffer, analyzePngMetrics, buildContactSheet } from './analyze.mjs';
import fs from 'node:fs';
import path from 'node:path';

const VERIFY_DIR = path.resolve(process.cwd(), 'verification');
const SWEEP_DIR = path.join(VERIFY_DIR, 'sweep');
const COMPARE_DIR = path.join(VERIFY_DIR, 'compare');
const REFS_DIR =
  'C:/Users/bielx/.gemini/antigravity/brain/23c8471c-2fed-49b7-846c-3f0a4b2b1a83/scratch/racing-v3.4/refs';

fs.mkdirSync(VERIFY_DIR, { recursive: true });
fs.mkdirSync(SWEEP_DIR, { recursive: true });
fs.mkdirSync(COMPARE_DIR, { recursive: true });

// Clean old sweep PNGs before regenerating
for (const f of fs.readdirSync(SWEEP_DIR)) {
  if (f.endsWith('.png')) fs.unlinkSync(path.join(SWEEP_DIR, f));
}

const logLines = [];
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  logLines.push(line);
};

function fmtMmSs(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const { server, url } = await startServer(process.cwd(), 0);
const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=d3d11',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--autoplay-policy=no-user-gesture-required',
  ],
});

const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const consoleErrors = [];
const failedRequests = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(err.message));
page.on('requestfailed', (req) => failedRequests.push(`${req.url()} (${req.failure()?.errorText})`));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__RACE_VERIFY__?.ready === true, null, { timeout: 35000 });

const hwInfo = await page.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  const dbg = gl?.getExtension('WEBGL_debug_renderer_info');
  return {
    renderer: dbg && gl ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'WebGL2',
    vendor: dbg && gl ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : 'Unknown',
    cores: navigator.hardwareConcurrency || 0,
  };
});
log(`Hardware: ${JSON.stringify(hwInfo)}`);

// 1. Unlock Audio & Collect Scene Audit + Validation
const hasAudioBuffers = await page.evaluate(() => window.__RACE_VERIFY__.unlockAudio());
const stats = await page.evaluate(() => ({
  validation: window.__RACE_VERIFY__.validation,
  sceneAudit: window.__RACE_VERIFY__.sceneAudit,
  trackLength: window.__RACE_VERIFY__.trackLength,
}));
fs.writeFileSync(path.join(VERIFY_DIR, 'scene-stats.json'), JSON.stringify(stats, null, 2));
log(`Validation ok=${stats.validation.ok} errors=${stats.validation.errors.length}`);
log(`SceneAudit ok=${stats.sceneAudit.ok} audioBuffers=${hasAudioBuffers}`);

// 2. Measure Z3 Village FPS in High and Low presets
async function measureZ3Fps(quality) {
  await page.evaluate((q) => {
    window.__RACE_VERIFY__.setQuality(q);
    window.__RACE_VERIFY__.setCameraShot('S5');
  }, quality);
  await page.waitForTimeout(300);
  return await page.evaluate(async () => {
    const deltas = [];
    await new Promise((resolve) => {
      let last = performance.now();
      let count = 0;
      const tick = (now) => {
        const d = now - last;
        last = now;
        if (count > 5) deltas.push(d);
        count++;
        if (deltas.length >= 120 || count > 220) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const fpsSamples = deltas.map((d) => 1000 / Math.max(1, d)).sort((a, b) => a - b);
    const meanFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
    const p1Idx = Math.max(0, Math.floor(fpsSamples.length * 0.01));
    return {
      meanFps: Number(meanFps.toFixed(1)),
      low1PctFps: Number(fpsSamples[p1Idx].toFixed(1)),
      samples: fpsSamples.length,
    };
  });
}

const perfHighZ3 = await measureZ3Fps('high');
const perfLowZ3 = await measureZ3Fps('low');
log(`Z3 Perf High: mean=${perfHighZ3.meanFps} fps, 1%low=${perfHighZ3.low1PctFps} fps`);
log(`Z3 Perf Low:  mean=${perfLowZ3.meanFps} fps, 1%low=${perfLowZ3.low1PctFps} fps`);
await page.evaluate(() => window.__RACE_VERIFY__.setQuality('high'));

// 3. 3x Restart Voice-Leak Test & Anti-Cut Shortcut Test
const voiceCounts = await page.evaluate(() => {
  const arr = [window.__RACE_VERIFY__.startRaceImmediate(1, 'normal').audioVoices];
  for (let i = 0; i < 3; i++) arr.push(window.__RACE_VERIFY__.restartRaceImmediate().audioVoices);
  return arr;
});
const leakedVoices = Math.max(...voiceCounts) - Math.min(...voiceCounts);
log(`Audio 3x Restart Voices: [${voiceCounts.join(', ')}] (leaked=${leakedVoices})`);

const antiCut = await page.evaluate(() => {
  window.__RACE_VERIFY__.startRaceImmediate(1, 'normal');
  window.__RACE_VERIFY__.teleportPlayer(3060, 0);
  return window.__RACE_VERIFY__.stepSimSeconds(10, { autopilot: true });
});
log(`Anti-cut blockedCount=${antiCut.antiCutBlockedCount}, lapCompleted=${antiCut.lapCompleted}`);

// 4. S1..S12 Screenshots at 1920x1080 + Image Metrics
const shotDefs = [
  { id: 'S1', slug: 'reta-orla', allowLowSky: false, ref: '01-golden-hour-palmeiras.jpg' },
  { id: 'S2', slug: 'grid-3-4', allowLowSky: false, ref: '11-carro-pintura-vidro-rodas.jpg' },
  { id: 'S3', slug: 'praia-espuma', allowLowSky: false, ref: '04-agua-margem-pedras.jpg' },
  { id: 'S4', slug: 'falesia-mirante', allowLowSky: false, ref: '02-costa-praia-falesia.jpg' },
  { id: 'S5', slug: 'vila-rua', allowLowSky: false, ref: '05-vila-igreja-densidade.jpg' },
  { id: 'S6', slug: 'bosque-luz', allowLowSky: false, ref: '08-vegetacao-densa.jpg' },
  { id: 'S7', slug: 'ponte', allowLowSky: true, ref: '14-ponte-terreno.jpg' },
  { id: 'S8', slug: 'disputa', allowLowSky: false, ref: '13-pelotao-ia-lado-a-lado.jpg' },
  { id: 'S9', slug: 'close-pista', allowLowSky: false, ref: '09-vegetacao-curva-disputa.jpg' },
  { id: 'S10', slug: 'baixa-vila', allowLowSky: false, ref: null },
  { id: 'S11', slug: 'escala', allowLowSky: false, ref: null },
  { id: 'S12', slug: 'mapa', allowLowSky: true, ref: null },
];

// Clean old top-level sN-*.png screenshots
for (const f of fs.readdirSync(VERIFY_DIR)) {
  if (/^s\d+-.*\.png$/.test(f)) fs.unlinkSync(path.join(VERIFY_DIR, f));
}

const imageMetrics = {};
const savedShotPaths = {};
for (const def of shotDefs) {
  await page.evaluate((id) => window.__RACE_VERIFY__.setCameraShot(id), def.id);
  await page.waitForTimeout(260);
  const fpsTag = Math.round(def.id === 'S10' ? perfLowZ3.meanFps : perfHighZ3.meanFps);
  const fname = `${def.id.toLowerCase()}-${def.slug}-${fpsTag}fps.png`;
  const outPath = path.join(VERIFY_DIR, fname);
  await page.screenshot({ path: outPath });
  savedShotPaths[def.id] = outPath;
  imageMetrics[def.id] = {
    file: fname,
    ...analyzePngMetrics(outPath, def.allowLowSky),
  };
  log(`Captured ${fname} | metrics=${JSON.stringify(imageMetrics[def.id])}`);
}
await page.evaluate(() => window.__RACE_VERIFY__.setQuality('high'));
fs.writeFileSync(path.join(VERIFY_DIR, 'image-metrics.json'), JSON.stringify(imageMetrics, null, 2));

// 5. Generate compare/s1.png..s9.png against local refs (if available)
if (fs.existsSync(REFS_DIR)) {
  for (const def of shotDefs.slice(0, 9)) {
    const refPath = path.join(REFS_DIR, def.ref);
    const ourPath = savedShotPaths[def.id];
    if (!fs.existsSync(refPath) || !fs.existsSync(ourPath)) continue;
    const refB64 = fs.readFileSync(refPath).toString('base64');
    const ourB64 = fs.readFileSync(ourPath).toString('base64');
    const compB64 = await page.evaluate(
      async ({ refSrc, ourSrc, label }) => {
        const loadImg = (src) =>
          new Promise((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = src;
          });
        const [imgRef, imgOur] = await Promise.all([loadImg(refSrc), loadImg(ourSrc)]);
        const pw = 960;
        const ph = 540;
        const c = document.createElement('canvas');
        c.width = pw * 2;
        c.height = ph;
        const ctx = c.getContext('2d');
        ctx.drawImage(imgRef, 0, 0, pw, ph);
        ctx.drawImage(imgOur, pw, 0, pw, ph);
        ctx.fillStyle = 'rgba(0,0,0,0.68)';
        ctx.fillRect(10, 10, 190, 28);
        ctx.fillRect(pw + 10, 10, 210, 28);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`REF (${label})`, 20, 29);
        ctx.fillText(`COSTA DOURADA (${label})`, pw + 20, 29);
        return c.toDataURL('image/png').split(',')[1];
      },
      {
        refSrc: `data:image/jpeg;base64,${refB64}`,
        ourSrc: `data:image/png;base64,${ourB64}`,
        label: def.id,
      }
    );
    fs.writeFileSync(path.join(COMPARE_DIR, `${def.id.toLowerCase()}.png`), Buffer.from(compB64, 'base64'));
  }
  log('Generated compare/s1.png..s9.png');
}

// 6. Chase Sweep every 25 m along full track (~127 frames) + sweep-sheet.png
await page.setViewportSize({ width: 960, height: 540 });
await page.evaluate(() => {
  window.__RACE_VERIFY__.startRaceImmediate(1, 'normal');
});
const sweepPaths = [];
let sweepFailed = 0;
for (let s = 0; s < stats.trackLength; s += 25) {
  await page.evaluate((dist) => {
    window.__RACE_VERIFY__.teleportPlayer(dist, 0);
    window.__RACE_VERIFY__.setCameraShot('chase');
  }, s);
  const sp = path.join(SWEEP_DIR, `sweep_${String(Math.round(s)).padStart(4, '0')}.png`);
  await page.screenshot({ path: sp });
  const m = analyzePngMetrics(sp, true);
  if (m.meanLuminance < 0.18 || m.stdLuminance < 0.08) sweepFailed++;
  sweepPaths.push(sp);
}
buildContactSheet(sweepPaths, 10, 240, 135, path.join(VERIFY_DIR, 'sweep-sheet.png'));
log(`Chase Sweep: ${sweepPaths.length} frames, sanityFailures=${sweepFailed}`);

// 7. Record Full 1-Lap Video (volta.webm) & Audio WAV (audio-volta.wav) in real-time High @ 1280x720
await page.setViewportSize({ width: 1280, height: 720 });
await page.evaluate(() => {
  window.__RACE_VERIFY__.setQuality('high');
  window.__RACE_VERIFY__.startRaceImmediate(1, 'normal');
  window.__RACE_VERIFY__.setAutopilot(true);
  window.__RACE_VERIFY__.startWavCapture();
  window.__RACE_VERIFY__.startVideoCapture();
});

// Drive live realtime frame loop until player finishes Lap 1 (timeout 240s)
const t0 = Date.now();
while (Date.now() - t0 < 240000) {
  const st = await page.evaluate(() => window.__RACE_VERIFY__.getState());
  if (st.screen === 'results') break;
  await page.waitForTimeout(500);
}

const recOut = await page.evaluate(async () => {
  window.__RACE_VERIFY__.setAutopilot(false);
  const wav = window.__RACE_VERIFY__.stopWavCapture();
  const webmBase64 = await window.__RACE_VERIFY__.stopVideoCapture();
  const events = window.__RACE_VERIFY__.getAudioEvents();
  const st = window.__RACE_VERIFY__.getState();
  return { wav, webmBase64, events, endScreen: st.screen, rank: st.playerRank };
});

const wavBuf = Buffer.from(recOut.wav.wavBase64, 'base64');
fs.writeFileSync(path.join(VERIFY_DIR, 'audio-volta.wav'), wavBuf);
if (recOut.webmBase64) {
  fs.writeFileSync(path.join(VERIFY_DIR, 'volta.webm'), Buffer.from(recOut.webmBase64, 'base64'));
}
const wavStats = analyzeWavBuffer(wavBuf);
log(`Audio WAV: ${JSON.stringify(wavStats)}, EndScreen=${recOut.endScreen}, Rank=${recOut.rank}`);
for (const ev of recOut.events.slice(0, 18)) {
  log(`Audio Event [${fmtMmSs(ev.timeSec)}] ${ev.kind}: ${ev.detail}`);
}

// 8. Final Physics Determinism Run (110s stepped lap check for zero invariants & overtakes)
await page.evaluate(() => window.__RACE_VERIFY__.startRaceImmediate(1, 'normal'));
let totalOvertakes = 0;
let maxAiStuckSec = 0;
let lapRes = null;
for (let c = 0; c < 12; c++) {
  const r = await page.evaluate(() => window.__RACE_VERIFY__.stepSimSeconds(10, { autopilot: true }));
  totalOvertakes += r.playerOvertakes;
  if (r.maxAiStuckSec > maxAiStuckSec) maxAiStuckSec = r.maxAiStuckSec;
  lapRes = r;
  if (r.playerFinished) break;
}
log(
  `Lap Audit: finished=${lapRes?.playerFinished} rank=${lapRes?.playerRank} overtakes=${totalOvertakes} maxAiStuck=${maxAiStuckSec.toFixed(2)}s resets=${lapRes?.safetyResets} invariants=${lapRes?.invariantFailures.length} camIntersections=${lapRes?.cameraIntersections}`
);
log(`ConsoleErrors=${consoleErrors.length}, FailedRequests=${failedRequests.length}`);

fs.writeFileSync(path.join(VERIFY_DIR, 'verify-log.txt'), logLines.join('\n') + '\n');

await browser.close();
server.close();

const s1to9Ok = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'].every((id) => imageMetrics[id]?.ok);
const allOk =
  stats.validation.ok &&
  stats.sceneAudit.ok &&
  hasAudioBuffers &&
  leakedVoices === 0 &&
  antiCut.antiCutBlockedCount >= 1 &&
  s1to9Ok &&
  sweepFailed === 0 &&
  wavStats.withinLimiterCeiling &&
  recOut.endScreen === 'results' &&
  lapRes?.playerFinished &&
  lapRes?.invariantFailures.length === 0 &&
  lapRes?.cameraIntersections === 0 &&
  maxAiStuckSec < 5.0 &&
  totalOvertakes >= 1 &&
  perfHighZ3.meanFps >= 50 &&
  perfLowZ3.meanFps >= 30 &&
  consoleErrors.length === 0 &&
  failedRequests.length === 0;

if (!allOk) {
  console.error('Verification failed! Check verification/verify-log.txt and verification/image-metrics.json');
  process.exit(1);
}
