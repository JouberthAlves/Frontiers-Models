// Dev tool: chase-camera frame every 25 m of the lap, assembled into contact sheets.
//   node scripts/dev/sweep.mjs <out-prefix> [--from=0 --to=3367] [--step=25] [--cols=6] [--q=low]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const prefix = args.find((a) => !a.startsWith('--')) || '.tmp/sweep';
fs.mkdirSync(path.dirname(prefix), { recursive: true });
const srv = await startServer({}); const { browser } = await launchBrowser({});
try {
  const { page, logs } = await openGame(browser, srv.url, { query: `dev=1${opt.q ? '&q=' + opt.q : ''}`, width: 640, height: 360 });
  const L = await page.evaluate(() => window.__api.info().trackLength);
  const from = Number(opt.from || 0), to = Math.min(L, Number(opt.to || L)), step = Number(opt.step || 25);
  const frames = []; const dir = prefix + '-frames'; fs.mkdirSync(dir, { recursive: true });
  for (let s = from; s < to; s += step) {
    const info = await page.evaluate(async (s) => {
      const api = window.__api, game = api.game; api.pause(true); api.hold(true); api.freezeTime(12.5);
      // the rivals wait far away so that the frame shows the scenery
      game.cars.forEach((c) => { if (!c.isPlayer) api.place(c.index, s + 1500 + c.index * 12, 0, 0); });
      api.place(5, s, 0, 28); api.pose(null); api.autopilot(true); api.step(40); api.render(1 / 60); api.step(2); api.render(1 / 60);
      return { sky: api.skyFraction(), zone: game.world.track.zoneIndexAt(s) + 1, integrity: game.integrity };
    }, s);
    const file = path.join(dir, `s${String(Math.round(s)).padStart(4, '0')}.png`);
    await page.screenshot({ path: file }); frames.push({ s, file, ...info });
  }
  fs.writeFileSync(prefix + '.json', JSON.stringify(frames.map(({ file, ...r }) => r), null, 1));
  const cols = Number(opt.cols || 6);
  const py = `
import sys, json
from PIL import Image, ImageDraw
frames = json.load(open(sys.argv[1])); prefix = sys.argv[2]; cols = int(sys.argv[3]); rows = 5
W, H = 320, 180
for page in range(0, len(frames), cols * rows):
    part = frames[page:page + cols * rows]
    sheet = Image.new('RGB', (W * cols, H * ((len(part) + cols - 1) // cols)))
    for i, f in enumerate(part):
        im = Image.open(f['file']).convert('RGB').resize((W, H), Image.LANCZOS)
        d = ImageDraw.Draw(im); d.rectangle((0, 0, 118, 13), fill=(0, 0, 0)); d.text((3, 1), 's=%d  Z%d  ceu %d%%' % (f['s'], f['zone'], round(f['sky'] * 100)), fill=(255, 255, 255))
        sheet.paste(im, ((i % cols) * W, (i // cols) * H))
    sheet.save('%s-%d.png' % (prefix, page // (cols * rows) + 1)); print('wrote %s-%d.png' % (prefix, page // (cols * rows) + 1))
`;
  const tmp = prefix + '-frames.json'; fs.writeFileSync(tmp, JSON.stringify(frames));
  fs.writeFileSync(prefix + '-sheet.py', py);
  console.log(execFileSync('python', [prefix + '-sheet.py', tmp, prefix, String(cols)]).toString().trim());
  const sky = frames.map((f) => f.sky); console.log(`frames ${frames.length}, sky min ${(Math.min(...sky) * 100).toFixed(1)} % at s=${frames[sky.indexOf(Math.min(...sky))].s}`);
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror' || (l.type === 'warning' && /WebGL|THREE|shader/i.test(l.text)));
  if (bad.length) console.log('--- console problems:\n' + bad.slice(0, 10).map((b) => `[${b.type}] ${b.text.slice(0, 400)}`).join('\n'));
} finally { await browser.close(); await srv.close(); }
