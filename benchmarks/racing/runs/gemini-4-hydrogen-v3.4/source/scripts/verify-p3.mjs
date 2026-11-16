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
  z1Stats: window.__RACE_VERIFY__.z1Stats,
}));
console.log('P3 Info:', JSON.stringify(info, null, 2));

// Accelerate 4.5 seconds down Z1 straight so S1 shows real speed, motion blur, & AI ahead!
await page.evaluate(() => window.__RACE_VERIFY__.stepSimSeconds(4.5));
await page.evaluate(() => window.__RACE_VERIFY__.setCameraShot('S1'));
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p3-s1.png' });

await page.evaluate(() => window.__RACE_VERIFY__.setCameraShot('S3'));
await page.waitForTimeout(250);
await page.screenshot({ path: 'verification/p3-s3.png' });

console.log('Console Errors:', consoleErrors);

await browser.close();
server.close();

if (!info.validation.ok || info.z1Stats.z1MinPropsPer100m < 12 || consoleErrors.length > 0) {
  process.exit(1);
}
