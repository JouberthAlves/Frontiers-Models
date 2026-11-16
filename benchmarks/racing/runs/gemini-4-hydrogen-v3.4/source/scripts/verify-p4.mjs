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
await page.waitForFunction(() => window.__RACE_VERIFY__?.ready === true, null, { timeout: 35000 });

const info = await page.evaluate(() => ({
  validation: window.__RACE_VERIFY__.validation,
  sceneAudit: window.__RACE_VERIFY__.sceneAudit,
}));
console.log('P4 Validation:', JSON.stringify(info.validation, null, 2));
console.log('P4 SceneAudit:', JSON.stringify(info.sceneAudit, null, 2));

for (const shot of ['S4', 'S5', 'S6', 'S7', 'S11']) {
  await page.evaluate((s) => window.__RACE_VERIFY__.setCameraShot(s), shot);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `verification/p4-${shot.toLowerCase()}.png` });
}

console.log('Console Errors:', consoleErrors);

await browser.close();
server.close();

if (!info.validation.ok || !info.sceneAudit.ok || consoleErrors.length > 0) {
  process.exit(1);
}
