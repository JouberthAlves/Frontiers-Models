// Dev tool: stills out of verification/volta.webm (to look at what the recorded lap shows).
//   node scripts/dev/frames.mjs [--t=5,20,40,60,80,100] [--out=.tmp/volta] [--w=960]
import fs from 'node:fs';
import { launchBrowser, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const times = (opt.t || '5,20,40,60,80,100').split(',').map(Number); const dir = opt.out || '.tmp/volta'; fs.mkdirSync(dir, { recursive: true });
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const w = Number(opt.w || 960), h = Math.round(w * 9 / 16);
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.setContent(`<body style="margin:0;background:#000"><video id="v" src="${srv.url}/verification/volta.webm" style="width:${w}px;height:${h}px" muted preload="auto"></video></body>`);
  await page.waitForFunction(() => document.getElementById('v').readyState >= 1, null, { timeout: 30000 });
  const info = await page.evaluate(() => { const v = document.getElementById('v'); return { duration: v.duration, w: v.videoWidth, h: v.videoHeight }; });
  console.log(JSON.stringify(info));
  for (const t of times) {
    await page.evaluate((t) => new Promise((res) => { const v = document.getElementById('v'); v.onseeked = () => res(); v.currentTime = t; }), t);
    await page.waitForTimeout(150);
    const f = `${dir}/t${String(t).padStart(3, '0')}.png`; await page.screenshot({ path: f }); console.log(f);
  }
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); await srv.close(); }
