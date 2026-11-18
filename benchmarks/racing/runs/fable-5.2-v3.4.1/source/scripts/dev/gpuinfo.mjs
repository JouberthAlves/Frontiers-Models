// Dev tool: which GPU does the browser render WebGL on? (to try the integrated one on a two-GPU machine)
//   node scripts/dev/gpuinfo.mjs [--args="--force_low_power_gpu"] [--headed]
import { launchBrowser } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const extraArgs = opt.args ? opt.args.split(' ').filter(Boolean) : [];
const { browser, channel } = await launchBrowser({ headless: !opt.headed, extraArgs });
try {
  const page = await (await browser.newContext()).newPage();
  await page.setContent('<canvas id="c"></canvas>');
  const info = await page.evaluate(() => {
    const out = {};
    for (const pref of ['default', 'high-performance', 'low-power']) {
      const c = document.createElement('canvas'); const gl = c.getContext('webgl2', { powerPreference: pref });
      if (!gl) { out[pref] = null; continue; }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      out[pref] = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    }
    return out;
  });
  console.log(channel, JSON.stringify(extraArgs), JSON.stringify(info, null, 1));
} catch (e) { console.error('ERROR', e.message); } finally { await browser.close(); }
