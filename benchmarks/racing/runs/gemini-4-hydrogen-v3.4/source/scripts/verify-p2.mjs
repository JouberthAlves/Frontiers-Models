import { chromium } from 'playwright';
import { startServer } from './serve.mjs';
import fs from 'node:fs';

fs.mkdirSync('verification', { recursive: true });
const { server, url } = await startServer(process.cwd(), 0);

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'],
});

const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(err.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__RACE_VERIFY__?.ready === true, null, { timeout: 30000 });

const info = await page.evaluate(() => ({
  validation: window.__RACE_VERIFY__.validation,
  carStats: window.__RACE_VERIFY__.carStats,
}));
console.log('P2 Info:', JSON.stringify(info, null, 2));

await page.evaluate(() => window.__RACE_VERIFY__.setCameraShot('S1'));
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p2-s1.png' });

await page.evaluate(() => window.__RACE_VERIFY__.setCameraShot('S2'));
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p2-s2.png' });

console.log('Console Errors:', consoleErrors);

await browser.close();
server.close();

if (
  !info.validation.ok ||
  info.carStats.veloceTris < 15000 ||
  info.carStats.solaraTris < 15000 ||
  consoleErrors.length > 0
) {
  process.exit(1);
}
