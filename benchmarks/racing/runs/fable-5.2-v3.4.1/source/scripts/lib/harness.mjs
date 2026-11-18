// Shared by the verifier and the dev tools: starts the static server and a GPU-enabled browser.
import { chromium } from 'playwright';
import { startServer } from '../serve.mjs';

export const GPU_ARGS = [
  '--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--enable-webgl', '--enable-accelerated-2d-canvas',
  '--autoplay-policy=user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows', '--force-device-scale-factor=1', '--hide-scrollbars',
];
export const UNCAPPED_ARGS = ['--disable-frame-rate-limit', '--disable-gpu-vsync'];

/** launches Chrome / Edge / bundled Chromium, whichever is available */
export async function launchBrowser({ headless = true, uncapped = false, extraArgs = [] } = {}) {
  const args = [...GPU_ARGS, ...(uncapped ? UNCAPPED_ARGS : []), ...extraArgs];
  if (process.platform !== 'win32') { const i = args.indexOf('--use-angle=d3d11'); if (i >= 0) args.splice(i, 1); }
  const errors = [];
  for (const channel of ['chrome', 'msedge', undefined]) {
    try {
      const browser = await chromium.launch({ headless, channel, args });
      return { browser, channel: channel || 'chromium (playwright)' };
    } catch (e) { errors.push(`${channel || 'chromium'}: ${String(e.message).split('\n')[0]}`); }
  }
  throw new Error('No Chromium-based browser could be started. Install Chrome/Edge or run "npx playwright install chromium".\n' + errors.join('\n'));
}

export async function openGame(browser, baseUrl, { query = '', width = 1920, height = 1080, onConsole = null, timeout = 180000, recordVideo = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...(recordVideo ? { recordVideo } : {}) });
  const page = await context.newPage();
  const logs = [];
  page.on('console', (m) => { const e = { type: m.type(), text: m.text() }; logs.push(e); if (onConsole) onConsole(e); });
  page.on('pageerror', (e) => { const x = { type: 'pageerror', text: String(e.stack || e) }; logs.push(x); if (onConsole) onConsole(x); });
  page.on('requestfailed', (r) => { logs.push({ type: 'requestfailed', text: `${r.url()} ${r.failure()?.errorText}` }); });
  const externals = [];
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(baseUrl) && !u.startsWith('data:') && !u.startsWith('blob:') && !u.startsWith('about:')) externals.push(u); });
  await page.goto(`${baseUrl}/${query ? '?' + query : ''}`, { waitUntil: 'load' });
  await page.waitForFunction(() => (window.__api && window.__api.ready) || window.__loadError, null, { timeout });
  const err = await page.evaluate(() => window.__loadError || null);
  if (err) throw new Error('game failed to load: ' + err);
  await page.waitForFunction(() => !document.getElementById('loading'), null, { timeout: 15000 }).catch(() => {});
  return { context, page, logs, externals };
}

export { startServer };
