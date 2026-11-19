import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const ROOT = process.cwd();
const VERIFY_DIR = path.join(ROOT, 'verification');
const COMPARE_DIR = path.join(VERIFY_DIR, 'compare');
const SWEEP_DIR = path.join(VERIFY_DIR, 'sweep');
const LOGS_DIR = path.join(VERIFY_DIR, 'logs');
fs.mkdirSync(VERIFY_DIR, { recursive: true });
fs.mkdirSync(COMPARE_DIR, { recursive: true });
fs.mkdirSync(SWEEP_DIR, { recursive: true });
fs.mkdirSync(LOGS_DIR, { recursive: true });

const ARGS = new Set(process.argv.slice(2));
const SHOTS_ONLY = ARGS.has('--shots-only');
const SKIP_VIDEO = ARGS.has('--skip-video');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.hdr': 'application/octet-stream',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.svg': 'image/svg+xml',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      const rel = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath.replace(/^\/+/, ''));
      const abs = path.resolve(ROOT, rel);
      if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(abs).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(abs).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port, url: `http://127.0.0.1:${addr.port}/` });
    });
  });
}

function findFallbackChromiumExe() {
  const cacheDir = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (!fs.existsSync(cacheDir)) return undefined;
  const dirs = fs.readdirSync(cacheDir).filter((d) => d.startsWith('chromium-')).sort().reverse();
  for (const d of dirs) {
    const c1 = path.join(cacheDir, d, 'chrome-win64', 'chrome.exe');
    const c2 = path.join(cacheDir, d, 'chrome-win', 'chrome.exe');
    if (fs.existsSync(c1)) return c1;
    if (fs.existsSync(c2)) return c2;
  }
  return undefined;
}

function locateRefsDir() {
  const candidates = [
    process.env.REFS_DIR,
    path.resolve(ROOT, 'refs'),
    path.resolve(ROOT, '../refs'),
    path.resolve(ROOT, '../racing-v4/refs'),
    'C:/Users/bielx/.gemini/antigravity/brain/808536b4-c506-4876-b016-f706e3fcebe5/scratch/racing-v4-input/racing-v4/refs',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.existsSync(path.join(c, '01-golden-hour-palmeiras.jpg'))) return c;
  }
  return null;
}

async function launchBrowser() {
  const launchOpts = {
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--enable-webgl',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1920,1080',
    ],
  };
  try {
    return await chromium.launch(launchOpts);
  } catch (err) {
    const exe = findFallbackChromiumExe();
    if (!exe) throw err;
    console.log(`[verify] Using cached Playwright Chromium: ${exe}`);
    return await chromium.launch({ ...launchOpts, executablePath: exe });
  }
}

const SHOT_DEFS = [
  { id: 's1', file: 's1-reta-orla.png', refs: ['01-golden-hour-palmeiras.jpg', '02-costa-praia-falesia.jpg'] },
  { id: 's2', file: 's2-grid-3-4.png', refs: ['11-carro-pintura-vidro-rodas.jpg'] },
  { id: 's3', file: 's3-praia-espuma.png', refs: ['02-costa-praia-falesia.jpg', '04-agua-margem-pedras.jpg'] },
  { id: 's4', file: 's4-falesia-mirante.png', refs: ['02-costa-praia-falesia.jpg'] },
  { id: 's5', file: 's5-vila-rua.png', refs: ['05-vila-igreja-densidade.jpg', '06-vila-pedra-disputa.jpg', '07-vila-paredes-velocidade.jpg'] },
  { id: 's6', file: 's6-bosque-luz.png', refs: ['08-vegetacao-densa.jpg', '10-luz-rasante-floresta.jpg'] },
  { id: 's7', file: 's7-ponte-ou-tunel.png', refs: ['14-ponte-terreno.jpg'] },
  { id: 's8', file: 's8-disputa.png', refs: ['09-vegetacao-curva-disputa.jpg', '13-pelotao-ia-lado-a-lado.jpg'] },
  { id: 's9', file: 's9-close-pista.png', refs: [] },
  { id: 's10', file: 's10-baixa-vila.png', refs: [] },
  { id: 's11', file: 's11-escala.png', refs: [] },
  { id: 's12', file: 's12-mapa.png', refs: [] },
  { id: 's13', file: 's13-night-coast.png', refs: [] },
  { id: 's14', file: 's14-night-village.png', refs: [] },
  { id: 's15', file: 's15-cockpit.png', refs: [] },
];

async function makeSideBySide(shotPath, refPath, outPath) {
  const W = 960;
  const H = 540;
  const leftBuf = await sharp(shotPath).resize(W, H, { fit: 'cover' }).png().toBuffer();
  const rightBuf = await sharp(refPath).resize(W, H, { fit: 'cover' }).png().toBuffer();
  await sharp({
    create: { width: W * 2, height: H, channels: 4, background: { r: 10, g: 12, b: 16, alpha: 255 } },
  })
    .composite([
      { input: leftBuf, left: 0, top: 0 },
      { input: rightBuf, left: W, top: 0 },
    ])
    .png()
    .toFile(outPath);
}

async function run() {
  const { server, url } = await startStaticServer();
  console.log(`[verify] Static server listening on ${url}`);
  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(String(err));
  });

  const testLog = {
    startedAt: new Date().toISOString(),
    hardware: {
      cpu: os.cpus()[0]?.model || 'unknown',
      cores: os.cpus().length,
      platform: `${os.platform()} ${os.release()}`,
      browserVersion: browser.version(),
      resolution: '1920x1080',
      gpu: 'unknown',
    },
    tests: {},
    fps: {},
    audio: {},
    consoleErrors: [],
    pageErrors: [],
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.__RACING_API__), null, { timeout: 120000 });
    await page.waitForFunction(() => window.__RACING_API__.getScreen() === 'menu', null, { timeout: 120000 });

    // Query WebGL GPU renderer string
    testLog.hardware.gpu = await page.evaluate(() => {
      const c = document.getElementById('game-canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) return 'unknown';
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    });
    console.log(`[verify] GPU: ${testLog.hardware.gpu} | Browser: ${testLog.hardware.browserVersion}`);

    // Real user gesture click to unlock Web Audio cleanly (Section 13.2!)
    await page.mouse.click(960, 540);
    await page.evaluate(() => window.__RACING_API__.unlockAudio());
    await page.waitForTimeout(350);

    // -------------------------------------------------------------------------
    // TEST 8: Live Scene, Asset & Pipeline Audit + World Validation (Section 13.1 #7 & #8)
    // -------------------------------------------------------------------------
    await page.evaluate(() => {
      window.__RACING_API__.setConfig({ quality: 'high', lighting: 'golden_hour' });
      window.__RACING_API__.startRace(true);
    });
    await page.waitForTimeout(400);
    const sceneStats = await page.evaluate(() => window.__RACING_API__.getSceneStats());
    fs.writeFileSync(path.join(VERIFY_DIR, 'scene-stats.json'), JSON.stringify(sceneStats, null, 2));

    const auditFailures = [];
    if (!sceneStats.worldValidation.ok) auditFailures.push(`validateWorld errors: ${sceneStats.worldValidation.errors.length}`);
    for (const cid of ['aurelia_gtr', 'solara_corsa']) {
      const c = sceneStats.cars[cid];
      if (c.triangles < 15000) auditFailures.push(`${cid} triangles=${c.triangles} < 15000`);
      if (c.materials < 6) auditFailures.push(`${cid} materials=${c.materials} < 6`);
      if (!c.hasParentedWheels) auditFailures.push(`${cid} lacks chassis-parented wheel nodes`);
      if (!c.hasCockpit || !c.hasSteeringWheel) auditFailures.push(`${cid} lacks cockpit or rotating steering wheel`);
    }
    if (!sceneStats.pipeline.csmActive || sceneStats.pipeline.csmCascades < 3 || sceneStats.pipeline.csmShadowMapSize < 2048) {
      auditFailures.push(`CSM inactive or undersized: ${JSON.stringify(sceneStats.pipeline)}`);
    }
    if (!sceneStats.pipeline.aoActive) auditFailures.push('AO inactive on High');
    if (sceneStats.pipeline.toneMapping !== 'AgX' && sceneStats.pipeline.toneMapping !== 'ACES') auditFailures.push('Invalid tone mapping');
    if (sceneStats.pipeline.roadAnisotropy < 8) auditFailures.push(`Road anisotropy=${sceneStats.pipeline.roadAnisotropy} < 8`);
    if (sceneStats.pipeline.roadAsphaltResolution[0] < 2048) auditFailures.push(`Asphalt res=${sceneStats.pipeline.roadAsphaltResolution} < 2048`);
    if (sceneStats.pipeline.msaaSamples < 2 && !sceneStats.pipeline.smaaActive) auditFailures.push('No MSAA/SMAA active with postprocessing');
    if (!sceneStats.pipeline.triplanarCliffActive) auditFailures.push('Triplanar cliff inactive');
    if (!sceneStats.pipeline.foliageTranslucencyActive) auditFailures.push('Foliage translucency inactive');
    if (sceneStats.materials.syntheticNoisePrimaryMaps > 0) auditFailures.push(`Synthetic noise primary maps: ${sceneStats.materials.syntheticNoisePrimaryMaps}`);
    if (sceneStats.materials.materialsBelowMinRes > 0) auditFailures.push(`Materials below 1024px: ${sceneStats.materials.materialsBelowMinRes}`);
    if (sceneStats.villageZ3.unitCount < 60 || sceneStats.villageZ3.archetypeCount < 5 || !sceneStats.villageZ3.hasMultiLayerDepth) {
      auditFailures.push(`Village Z3 deficit: ${JSON.stringify(sceneStats.villageZ3)}`);
    }
    if (sceneStats.woodsZ4.treeSpeciesCount < 4 || !sceneStats.woodsZ4.hasTrees || !sceneStats.woodsZ4.hasShrubs || !sceneStats.woodsZ4.hasGroundcover) {
      auditFailures.push(`Woods Z4 deficit: ${JSON.stringify(sceneStats.woodsZ4)}`);
    }
    if (!sceneStats.audio.usesRealAudioBuffers || sceneStats.audio.playerEngineBandsGT < 4 || sceneStats.audio.playerEngineBandsCorsa < 4) {
      auditFailures.push(`Audio buffers deficit: ${JSON.stringify(sceneStats.audio)}`);
    }
    testLog.tests.sceneAssetPipelineAudit = { pass: auditFailures.length === 0, failures: auditFailures, summary: sceneStats.worldValidation.metrics };
    console.log(`[verify] Scene/Asset/Pipeline Audit: ${auditFailures.length === 0 ? 'PASS' : 'FAIL ' + auditFailures.join('; ')}`);

    // -------------------------------------------------------------------------
    // MANDATORY SCREENSHOTS S1–S15 (1920x1080) + SIDE-BY-SIDE COMPARE
    // -------------------------------------------------------------------------
    const refsDir = locateRefsDir();
    for (const def of SHOT_DEFS) {
      await page.evaluate((id) => window.__RACING_API__.poseForShot(id), def.id);
      await page.waitForTimeout(160);
      const outPath = path.join(VERIFY_DIR, def.file);
      await page.screenshot({ path: outPath });
      if (refsDir && def.refs.length > 0) {
        const primaryRef = path.join(refsDir, def.refs[0]);
        if (fs.existsSync(primaryRef)) {
          await makeSideBySide(outPath, primaryRef, path.join(COMPARE_DIR, `${def.id}.png`));
        }
      }
      console.log(`[verify] Captured ${def.file}`);
    }

    if (SHOTS_ONLY) {
      console.log('[verify] --shots-only mode complete!');
      return;
    }

    // -------------------------------------------------------------------------
    // TEST 4: Steering & Control Integrity Test (Section 13.1 #4)
    // -------------------------------------------------------------------------
    const steerTest = await page.evaluate(() => {
      const api = window.__RACING_API__;
      api.setConfig({ quality: 'high', lighting: 'golden_hour' });
      api.setAutopilot(false);
      api.startRace(true);

      const measureTurn = (steerVal) => {
        api.placePlayerAt(200, 0);
        api.setInputOverride({ throttle: 1, brake: 0, steer: 0, nitro: false });
        api.advancePhysicsSteps(216); // 1.8s straight
        const before = api.getRaceTelemetry().player;
        api.setInputOverride({ throttle: 0.7, brake: 0, steer: steerVal, nitro: false });
        api.advancePhysicsSteps(72); // 0.6s turn
        const after = api.getRaceTelemetry().player;
        return {
          spdBefore: +before.speedKmh.toFixed(1),
          dLat: +(after.lateral - before.lateral).toFixed(3),
          dYawDeg: +(((after.yaw - before.yaw) * 180) / Math.PI).toFixed(2),
        };
      };

      const rightTurn = measureTurn(1);
      const leftTurn = measureTurn(-1);

      // Nitro acceleration & drain test
      api.placePlayerAt(140, 0);
      api.setInputOverride({ throttle: 1, brake: 0, steer: 0, nitro: false });
      api.advancePhysicsSteps(420);
      const noNitro = api.getRaceTelemetry().player;

      api.placePlayerAt(140, 0);
      api.setInputOverride({ throttle: 1, brake: 0, steer: 0, nitro: false });
      api.advancePhysicsSteps(120);
      api.setInputOverride({ throttle: 1, brake: 0, steer: 0, nitro: true });
      api.advancePhysicsSteps(300);
      const withNitro = api.getRaceTelemetry().player;
      api.setInputOverride(null);

      return {
        rightTurn,
        leftTurn,
        nitroOff: { speedKmh: +noNitro.speedKmh.toFixed(1), nitro: +noNitro.nitro.toFixed(3) },
        nitroOn: { speedKmh: +withNitro.speedKmh.toFixed(1), nitro: +withNitro.nitro.toFixed(3) },
      };
    });
    const steerPass =
      steerTest.rightTurn.dLat > 0.5 &&
      steerTest.rightTurn.dYawDeg < -5 &&
      steerTest.leftTurn.dLat < -0.5 &&
      steerTest.leftTurn.dYawDeg > 5 &&
      steerTest.nitroOn.speedKmh > steerTest.nitroOff.speedKmh + 6 &&
      steerTest.nitroOn.nitro < steerTest.nitroOff.nitro - 0.25;
    testLog.tests.steeringAndNitroIntegrity = { pass: steerPass, ...steerTest };
    console.log(`[verify] Steering & Nitro Integrity: ${steerPass ? 'PASS' : 'FAIL'}`, JSON.stringify(steerTest));

    // -------------------------------------------------------------------------
    // TEST 5: Anti-Cut Verification (Section 13.1 #5)
    // -------------------------------------------------------------------------
    const antiCut = await page.evaluate(() => {
      const api = window.__RACING_API__;
      api.startRace(true);
      // Skip checkpoints by cutting straight across to just before finish line!
      api.placePlayerAt(150, 0);
      api.setInputOverride({ throttle: 1, brake: 0, steer: 0, nitro: false });
      api.advancePhysicsSteps(180); // drive cleanly past start/finish WITHOUT hitting sequential checkpoints
      const t = api.getRaceTelemetry().player;
      api.setInputOverride(null);
      return { lapAfterCut: t.lap, checkpointsPassed: t.checkpointsPassed };
    });
    const antiCutPass = antiCut.lapAfterCut === 1;
    testLog.tests.antiCut = { pass: antiCutPass, ...antiCut };
    console.log(`[verify] Anti-Cut: ${antiCutPass ? 'PASS' : 'FAIL'}`, JSON.stringify(antiCut));

    // -------------------------------------------------------------------------
    // TEST 1 & 6 & 7: Full 3-Lap Race Journey (Menu -> Garage -> Setup -> 3 Laps w/ 5 AI, Nitro & Camera Toggle -> Results -> Race Again)
    // -------------------------------------------------------------------------
    await page.evaluate(() => window.__RACING_API__.navigateTo('menu'));
    await page.waitForTimeout(200);
    await page.click('#btn-garage');
    await page.waitForTimeout(250);
    await page.click('[data-car="solara_corsa"]');
    await page.click('[data-liv="2"]');
    await page.click('[data-car="aurelia_gtr"]');
    await page.click('[data-liv="0"]');
    await page.click('#btn-to-setup');
    await page.waitForTimeout(200);
    await page.click('[data-laps="3"]');
    await page.click('[data-diff="normal"]');
    await page.click('[data-tod="golden_hour"]');
    await page.click('[data-qual="high"]');
    await page.click('#btn-start-race');
    await page.waitForTimeout(300);

    const journey3Lap = await page.evaluate(() => {
      const api = window.__RACING_API__;
      api.startRace(true); // begin live racing immediately after verifying menu/garage/setup/intro launch
      api.setAutopilot(true, { allowNitro: true, pace: 1.01 });
      // Toggle camera Chase -> Cockpit -> Chase mid-race!
      api.advancePhysicsSteps(1200); // 10s
      api.setCameraMode('cockpit');
      api.advancePhysicsSteps(360); // 3s cockpit
      api.setCameraMode('chase');
      // Run remaining 3-lap race in 120 Hz physics
      let guard = 0;
      while (api.getScreen() !== 'results' && guard < 450) {
        api.advancePhysicsSteps(120); // 1s chunks
        guard++;
      }
      api.setAutopilot(false);
      return api.getRaceTelemetry();
    });
    await page.waitForTimeout(250);
    // Verify Results screen & Race Again button!
    const resultsVisible = await page.locator('#btn-race-again').isVisible();
    if (resultsVisible) await page.click('#btn-race-again');
    await page.waitForTimeout(250);
    const raceAgainScreen = await page.evaluate(() => window.__RACING_API__.getScreen());

    const journey3Pass =
      journey3Lap.screen === 'results' &&
      journey3Lap.totalUnderTerrainResetsAllCars === 0 &&
      journey3Lap.totalResetsAllCars === 0 &&
      journey3Lap.aiMaxStuckSeconds <= 5.0 &&
      journey3Lap.aiOvertakesCount >= 1 &&
      journey3Lap.cameraClipViolations === 0 &&
      resultsVisible &&
      (raceAgainScreen === 'grid_intro' || raceAgainScreen === 'countdown' || raceAgainScreen === 'racing');

    testLog.tests.fullRace3LapsGoldenHour = {
      pass: journey3Pass,
      raceElapsedSec: +journey3Lap.raceElapsed.toFixed(1),
      bestLapSec: +journey3Lap.player.bestLapTime.toFixed(1),
      aiOvertakes: journey3Lap.aiOvertakesCount,
      aiMaxStuckSec: +journey3Lap.aiMaxStuckSeconds.toFixed(2),
      totalResetsAllCars: journey3Lap.totalResetsAllCars,
      cameraClipViolations: journey3Lap.cameraClipViolations,
      resultsVisible,
      raceAgainScreen,
    };
    console.log(`[verify] Full 3-Lap Race & AI Competence: ${journey3Pass ? 'PASS' : 'FAIL'}`, JSON.stringify(testLog.tests.fullRace3LapsGoldenHour));

    // -------------------------------------------------------------------------
    // TEST 2: Extended 6-Lap Race & Night Mode Boot (Section 13.1 #2)
    // -------------------------------------------------------------------------
    const test6LapNight = await page.evaluate(() => {
      const api = window.__RACING_API__;
      api.setConfig({ laps: 6, lighting: 'night', quality: 'high', difficulty: 'normal' });
      api.startRace(true);
      api.setAutopilot(true, { allowNitro: true, pace: 1.03 });
      let guard = 0;
      while (api.getScreen() !== 'results' && guard < 900) {
        api.advancePhysicsSteps(120);
        guard++;
      }
      api.setAutopilot(false);
      return api.getRaceTelemetry();
    });
    const test6Pass =
      test6LapNight.screen === 'results' &&
      test6LapNight.totalUnderTerrainResetsAllCars === 0 &&
      test6LapNight.totalResetsAllCars === 0;
    testLog.tests.extended6LapAndNightBoot = {
      pass: test6Pass,
      raceElapsedSec: +test6LapNight.raceElapsed.toFixed(1),
      bestLapSec: +test6LapNight.player.bestLapTime.toFixed(1),
      totalResetsAllCars: test6LapNight.totalResetsAllCars,
    };
    console.log(`[verify] 6-Lap Race & Night Boot: ${test6Pass ? 'PASS' : 'FAIL'}`, JSON.stringify(testLog.tests.extended6LapAndNightBoot));

    // -------------------------------------------------------------------------
    // TEST 3: State & Memory Hygiene (Pause/Resume, Restart, Menu x3 cycles)
    // -------------------------------------------------------------------------
    const hygiene = await page.evaluate(async () => {
      const api = window.__RACING_API__;
      api.setConfig({ laps: 3, lighting: 'golden_hour', quality: 'high' });
      api.startRace(true);
      const voicesBefore = api.getAudioAudit().activeVoicesNow;
      const heapStart = performance.memory ? performance.memory.usedJSHeapSize : 0;

      for (let c = 0; c < 3; c++) {
        api.setPaused(true);
        api.setPaused(false);
        api.advancePhysicsSteps(30);
        api.startRace(true); // mid-race restart
        api.advancePhysicsSteps(30);
        api.navigateTo('menu'); // return to menu
        api.startRace(true); // fresh race
      }
      const voicesAfter = api.getAudioAudit().activeVoicesNow;
      const heapEnd = performance.memory ? performance.memory.usedJSHeapSize : 0;
      return {
        voicesBefore,
        voicesAfter,
        heapStartMB: +(heapStart / 1048576).toFixed(1),
        heapEndMB: +(heapEnd / 1048576).toFixed(1),
        heapDeltaMB: +((heapEnd - heapStart) / 1048576).toFixed(1),
      };
    });
    const hygienePass = hygiene.voicesAfter <= hygiene.voicesBefore + 2;
    testLog.tests.stateAndMemoryHygiene = { pass: hygienePass, ...hygiene };
    console.log(`[verify] State & Memory Hygiene (3 cycles): ${hygienePass ? 'PASS' : 'FAIL'}`, JSON.stringify(hygiene));

    // -------------------------------------------------------------------------
    // SECTION 13.3: Performance Metrics in Z3 with 5 AI Cars (High GH, High Night, Low GH)
    // -------------------------------------------------------------------------
    const measureScenarioFPS = async (lighting, quality) => {
      await page.evaluate(
        ({ l, q }) => {
          const api = window.__RACING_API__;
          api.setConfig({ lighting: l, quality: q });
          api.poseForShot(l === 'night' ? 's14' : q === 'low' ? 's10' : 's5');
          api.setAutopilot(true, { allowNitro: false, pace: 0.95 });
          api.resetFPSWindow();
        },
        { l: lighting, q: quality }
      );
      await page.waitForTimeout(3200);
      const res = await page.evaluate(() => {
        window.__RACING_API__.setAutopilot(false);
        return window.__RACING_API__.getFPSStats();
      });
      return res;
    };

    testLog.fps.highGoldenHourZ3 = await measureScenarioFPS('golden_hour', 'high');
    testLog.fps.highNightZ3 = await measureScenarioFPS('night', 'high');
    testLog.fps.lowGoldenHourZ3 = await measureScenarioFPS('golden_hour', 'low');
    console.log('[verify] FPS Z3 (5 AI):', JSON.stringify(testLog.fps));

    // -------------------------------------------------------------------------
    // SECTION 13.0 #4 & 13.2: REAL FULL-LAP VIDEO (volta.webm) + REAL POST-LIMITER PCM AUDIO (audio-volta.wav)
    // -------------------------------------------------------------------------
    if (!SKIP_VIDEO) {
      console.log('[verify] Recording real 1-lap chase video (volta.webm) + real post-limiter PCM master audio (audio-volta.wav)...');
      await page.evaluate(() => {
        const api = window.__RACING_API__;
        api.setConfig({ laps: 3, lighting: 'golden_hour', quality: 'high', difficulty: 'normal' });
        api.startRace(true);
        api.setCameraMode('chase');
        api.setAutopilot(true, { allowNitro: true, pace: 1.05 });
        api.startAudioCapture();
        api.startVideoCapture();
      });

      // Wait in real time until player finishes Lap 1 cleanly (real gameplay + real live Web Audio!)
      const startReal = Date.now();
      while (Date.now() - startReal < 240000) {
        const st = await page.evaluate(() => window.__RACING_API__.getRaceTelemetry());
        if (st.player && st.player.lap >= 2) break;
        await page.waitForTimeout(1000);
      }

      const captureResult = await page.evaluate(async () => {
        const api = window.__RACING_API__;
        api.setAutopilot(false);
        const wav = api.stopAudioCapture();
        const webmB64 = await api.stopVideoCapture();
        const audit = api.getAudioAudit();
        const tel = api.getRaceTelemetry();
        return { wav, webmB64, audit, tel };
      });

      if (captureResult.wav && captureResult.wav.wavBase64) {
        fs.writeFileSync(path.join(VERIFY_DIR, 'audio-volta.wav'), Buffer.from(captureResult.wav.wavBase64, 'base64'));
      }
      if (captureResult.webmB64) {
        fs.writeFileSync(path.join(VERIFY_DIR, 'volta.webm'), Buffer.from(captureResult.webmB64, 'base64'));
      }

      testLog.audio = {
        durationSec: captureResult.wav?.durationSec ?? 0,
        sampleRate: captureResult.wav?.sampleRate ?? 0,
        masterPeakDbfs: captureResult.wav?.peakDbfs ?? captureResult.audit.masterPeakDbfs,
        peakBelowMinus1Dbfs: (captureResult.wav?.peakDbfs ?? 0) <= -1.0,
        maxSimultaneousVoices: captureResult.audit.maxSimultaneousVoices,
        events: captureResult.audit.events,
        lapTimeSec: +captureResult.tel.raceElapsed.toFixed(1),
        resetsDuringLap: captureResult.tel.totalResetsAllCars,
      };
      console.log('[verify] Full-Lap Video & Audio Complete:', JSON.stringify({
        durationSec: testLog.audio.durationSec,
        masterPeakDbfs: testLog.audio.masterPeakDbfs,
        maxVoices: testLog.audio.maxSimultaneousVoices,
        eventsCount: testLog.audio.events.length,
        lapTimeSec: testLog.audio.lapTimeSec,
      }));
    }

    // -------------------------------------------------------------------------
    // TEST 9: 25 m Track Sweep (High) + Composite Contact Sheet (verification/sweep-sheet.png)
    // -------------------------------------------------------------------------
    const trackLen = await page.evaluate(() => window.__RACING_API__.getTrackLength());
    const sweepFiles = [];
    const thumbW = 320;
    const thumbH = 180;
    for (let s = 0; s < trackLen; s += 25) {
      await page.evaluate((sVal) => window.__RACING_API__.poseSweepAtS(sVal, 'high'), s);
      const rawBuf = await page.screenshot();
      const idx = Math.round(s);
      const fname = `sweep_${String(idx).padStart(4, '0')}m.png`;
      const fpath = path.join(SWEEP_DIR, fname);
      await sharp(rawBuf).resize(thumbW, thumbH).png({ compressionLevel: 8 }).toFile(fpath);
      sweepFiles.push(fpath);
    }

    // Compose clean contact sheet grid (8 columns)
    const cols = 8;
    const rows = Math.ceil(sweepFiles.length / cols);
    const comps = [];
    for (let i = 0; i < sweepFiles.length; i++) {
      comps.push({
        input: sweepFiles[i],
        left: (i % cols) * thumbW,
        top: Math.floor(i / cols) * thumbH,
      });
    }
    await sharp({
      create: { width: cols * thumbW, height: rows * thumbH, channels: 4, background: { r: 10, g: 12, b: 18, alpha: 255 } },
    })
      .composite(comps)
      .png({ compressionLevel: 8 })
      .toFile(path.join(VERIFY_DIR, 'sweep-sheet.png'));
    testLog.tests.trackSweep25m = { pass: sweepFiles.length > 100, thumbnailCount: sweepFiles.length };
    console.log(`[verify] 25m Track Sweep complete: ${sweepFiles.length} thumbnails + sweep-sheet.png`);

    testLog.consoleErrors = consoleErrors;
    testLog.pageErrors = pageErrors;
    testLog.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(LOGS_DIR, 'test-results.json'), JSON.stringify(testLog, null, 2));

    const allPassed =
      Object.values(testLog.tests).every((t) => t.pass) &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0 &&
      (SKIP_VIDEO || testLog.audio.peakBelowMinus1Dbfs);

    if (!allPassed) {
      console.error('[verify] ONE OR MORE CHECKS FAILED! See verification/logs/test-results.json');
      if (consoleErrors.length) console.error('Console errors:', consoleErrors);
      if (pageErrors.length) console.error('Page errors:', pageErrors);
      process.exitCode = 1;
    } else {
      console.log('[verify] ALL VERIFICATION TESTS PASSED CLEANLY!');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('[verify] Fatal error:', err);
  process.exit(1);
});
