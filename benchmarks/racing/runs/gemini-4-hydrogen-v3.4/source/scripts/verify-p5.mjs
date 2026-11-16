import { chromium } from 'playwright';
import { startServer } from './serve.mjs';
import fs from 'node:fs';

fs.mkdirSync('verification', { recursive: true });
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

// 1. Capture Menu -> Garage -> Config -> Grid Intro -> Countdown -> Pause
await page.waitForTimeout(350);
await page.screenshot({ path: 'verification/p5-menu.png' });

await page.click('[data-action="garage"]');
await page.waitForTimeout(300);
await page.click('[data-car="solara"]');
await page.click('[data-livery="1"]');
await page.waitForTimeout(400);
await page.screenshot({ path: 'verification/p5-garage.png' });
await page.click('[data-car="veloce"]');
await page.click('[data-livery="0"]');
await page.click('[data-action="back"]');
await page.waitForTimeout(200);

await page.click('[data-action="config"]');
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p5-config.png' });
await page.click('[data-action="done"]');
await page.waitForTimeout(200);

// Start race through UI flow
await page.click('[data-action="race"]');
await page.waitForTimeout(400);
const gridState = await page.evaluate(() => window.__RACE_VERIFY__.getState());
await page.screenshot({ path: 'verification/p5-grid.png' });

// Skip grid intro with Space -> enters 3-2-1 countdown; verify car does NOT move early
await page.keyboard.press('Space');
await page.waitForTimeout(250);
const cdState0 = await page.evaluate(() => window.__RACE_VERIFY__.getState());
await page.keyboard.down('KeyW');
await page.waitForTimeout(1000);
const cdState1 = await page.evaluate(() => window.__RACE_VERIFY__.getState());
await page.keyboard.up('KeyW');

// Wait through remaining countdown (~2.8s) until racing starts, then test Esc Pause
await page.waitForFunction(() => window.__RACE_VERIFY__.getState().screen === 'racing', null, { timeout: 10000 });
await page.keyboard.press('Escape');
await page.waitForTimeout(250);
const pauseState = await page.evaluate(() => window.__RACE_VERIFY__.getState());
await page.screenshot({ path: 'verification/p5-pause.png' });
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

// 2. Audio Buffer + 3x Restart Voice-Leak Check
const hasBuffers = await page.evaluate(() => window.__RACE_VERIFY__.unlockAudio());
const audioVoices = await page.evaluate(() => {
  const counts = [];
  const base = window.__RACE_VERIFY__.startRaceImmediate(1, 'normal').audioVoices;
  counts.push(base);
  for (let i = 0; i < 3; i++) {
    counts.push(window.__RACE_VERIFY__.restartRaceImmediate().audioVoices);
  }
  return counts;
});

// 3. Anti-cut shortcut test
const antiCut = await page.evaluate(() => {
  window.__RACE_VERIFY__.startRaceImmediate(1, 'normal');
  window.__RACE_VERIFY__.teleportPlayer(3060, 0);
  return window.__RACE_VERIFY__.stepSimSeconds(10, { autopilot: true });
});

// 4. Full 1-Lap Race vs 5 AIs (check overtakes, stuck=0, invariants=0, results screen)
await page.evaluate(() => {
  window.__RACE_VERIFY__.startRaceImmediate(1, 'normal');
  window.__RACE_VERIFY__.setAutopilot(true);
});
let totalOvertakes = 0;
let maxAiStuck = 0;
let lapResult = null;
for (let chunk = 0; chunk < 14; chunk++) {
  const r = await page.evaluate(() => window.__RACE_VERIFY__.stepSimSeconds(12, { autopilot: true }));
  totalOvertakes += r.playerOvertakes;
  if (r.maxAiStuckSec > maxAiStuck) maxAiStuck = r.maxAiStuckSec;
  lapResult = r;
  if (chunk === 1) {
    // Capture live HUD screenshot mid-race cleanly while autopilot remains active!
    await page.screenshot({ path: 'verification/p5-hud.png' });
  }
  if (r.playerFinished) break;
}
await page.evaluate(() => window.__RACE_VERIFY__.setAutopilot(false));

// Allow animate tick to show Results screen cleanly
await page.waitForTimeout(300);
const endState = await page.evaluate(() => window.__RACE_VERIFY__.getState());
await page.screenshot({ path: 'verification/p5-results.png' });

// 5. Capture S8 pack racing screenshot with HUD visible
await page.evaluate(() => window.__RACE_VERIFY__.setCameraShot('S8'));
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p5-s8-disputa.png' });

const summary = {
  gridScreen: gridState.screen,
  countdownScreen: cdState0.screen,
  countdownBlockedMovement: Math.abs(cdState1.playerS - cdState0.playerS) < 0.25 && !cdState1.raceStarted,
  pauseScreen: pauseState.screen,
  hasBuffers,
  audioVoices3xRestart: audioVoices,
  audioLeakedVoices: Math.max(...audioVoices) - Math.min(...audioVoices),
  antiCutBlockedCount: antiCut.antiCutBlockedCount,
  antiCutKeptLap1: antiCut.playerRank >= 1 && !antiCut.lapCompleted,
  lapCompleted: lapResult?.lapCompleted,
  playerFinished: lapResult?.playerFinished,
  endScreen: endState.screen,
  playerRank: lapResult?.playerRank,
  totalOvertakes,
  maxAiStuckSec: Number(maxAiStuck.toFixed(2)),
  safetyResets: lapResult?.safetyResets,
  invariantFailures: lapResult?.invariantFailures,
  cameraIntersections: lapResult?.cameraIntersections,
  failedRequests,
  consoleErrors,
};

console.log('P5 Summary:', JSON.stringify(summary, null, 2));

await browser.close();
server.close();

const ok =
  summary.gridScreen === 'grid_intro' &&
  summary.countdownScreen === 'countdown' &&
  summary.countdownBlockedMovement &&
  summary.pauseScreen === 'paused' &&
  summary.hasBuffers &&
  summary.audioLeakedVoices === 0 &&
  summary.audioVoices3xRestart[0] >= 12 &&
  summary.antiCutBlockedCount >= 1 &&
  summary.antiCutKeptLap1 &&
  summary.playerFinished &&
  summary.endScreen === 'results' &&
  summary.totalOvertakes >= 1 &&
  summary.maxAiStuckSec < 5.0 &&
  summary.invariantFailures.length === 0 &&
  summary.cameraIntersections === 0 &&
  failedRequests.length === 0 &&
  consoleErrors.length === 0;

if (!ok) {
  process.exit(1);
}
