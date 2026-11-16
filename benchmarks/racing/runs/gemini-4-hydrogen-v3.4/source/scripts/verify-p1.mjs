import { chromium } from 'playwright';
import { startServer } from './serve.mjs';
import fs from 'node:fs';

fs.mkdirSync('verification', { recursive: true });
const { server, url } = await startServer(process.cwd(), 0);

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(err.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__RACE_VERIFY__?.ready === true, null, { timeout: 20000 });

const val = await page.evaluate(() => window.__RACE_VERIFY__.validation);
console.log('P1 Validation:', JSON.stringify(val, null, 2));

await page.evaluate(() => window.__RACE_VERIFY__.captureTopDownMap());
await page.waitForTimeout(200);
await page.screenshot({ path: 'verification/p1-mapa.png' });

await page.evaluate(() => window.__RACE_VERIFY__.restoreChaseCamera());
await page.waitForTimeout(200);
await page.screenshot({ path: 'verification/p1-chase.png' });

// Drive 1 full lap via stepSimSeconds (140s max)
const sim = await page.evaluate(() => window.__RACE_VERIFY__.stepSimSeconds(145));
console.log('P1 Full Lap Sim:', JSON.stringify(sim, null, 2));
const telem = await page.evaluate(() => window.__RACE_VERIFY__.getVehicleTelemetry());
console.log('P1 Post-Lap Telemetry:', JSON.stringify(telem, null, 2));
console.log('Console Errors:', consoleErrors);

await browser.close();
server.close();

if (!val.ok || !sim.lapCompleted || sim.safetyResets > 0 || sim.invariantFailures.length > 0 || consoleErrors.length > 0) {
  process.exit(1);
}
