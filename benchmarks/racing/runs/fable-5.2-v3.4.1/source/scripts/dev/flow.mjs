// Dev tool: walks through the real game flow with real clicks (menu -> garage -> set-up -> grid ->
// race -> results) and saves a screenshot of every stage.
//   node scripts/dev/flow.mjs [--out=.tmp/flow] [--laps=1] [--scale=8] [--q=low] [--stop=menu|garage|setup|grid|race] [--car=hatch] [--colour=3] [--w=1280 --h=720] [--manual=1]
import fs from 'node:fs';
import path from 'node:path';
import { launchBrowser, openGame, startServer } from '../lib/harness.mjs';
const opt = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || '1']; }));
const out = opt.out || '.tmp/flow'; fs.mkdirSync(out, { recursive: true });
const W = Number(opt.w || 1280), H = Number(opt.h || 720);
const srv = await startServer({}); const { browser } = await launchBrowser({});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let logs = [];
try {
  const o = await openGame(browser, srv.url, { query: `${opt.manual ? '' : 'auto=1&'}laps=${opt.laps || 1}${opt.q ? '&q=' + opt.q : ''}${opt.fps ? '&fps=1' : ''}${opt.query ? '&' + opt.query : ''}`, width: W, height: H, onConsole: (e) => logs.push(e) });
  const page = o.page;
  const shot = async (name) => { await page.screenshot({ path: path.join(out, name + '.png') }); console.log('shot', name); };
  const flow = () => page.evaluate(() => window.__api.flow());
  const waitState = (st, timeout = 120000) => page.waitForFunction((s) => window.__api.game.state === s, st, { timeout });
  await waitState('menu'); await sleep(1500); await shot('01-menu');
  if (opt.stop === 'menu') { await sleep(Number(opt.wait || 0) * 1000); await shot('01-menu-b'); throw 0; }
  await page.click('#btn-play'); await waitState('garage'); await sleep(900); await shot('02-garage');
  if (opt.car) { for (let i = 0; i < 1; i++) await page.keyboard.press('ArrowRight'); await sleep(700); await shot('02-garage-car'); }
  if (opt.colour) { await page.click('#swatch-' + opt.colour); await sleep(700); await shot('02-garage-colour'); }
  if (opt.stop === 'garage') { await sleep(Number(opt.wait || 2) * 1000); await shot('02-garage-b'); throw 0; }
  await page.click('#btn-garage-next'); await waitState('setup'); await sleep(400); await shot('03-setup');
  if (opt.stop === 'setup') throw 0;
  await page.click('#btn-start'); await waitState('grid');
  await sleep(500); await shot('04-grid-a'); await sleep(2000); await shot('04-grid-b'); await sleep(2000); await shot('04-grid-c');
  await waitState('countdown'); await sleep(1600); await shot('05-countdown');
  if (opt.stop === 'grid') throw 0;
  await waitState('racing'); await sleep(5000); await shot('06-race-a');
  console.log('audio', JSON.stringify((await flow()).audio));
  // pause and resume
  await page.keyboard.press('Escape'); await sleep(500); await shot('07-pause'); console.log('paused', (await flow()).paused);
  await page.keyboard.press('Escape'); await sleep(300); console.log('resumed', !(await flow()).paused);
  if (opt.stop === 'race') throw 0;
  await page.evaluate((k) => window.__api.timeScale(k), Number(opt.scale || 8));
  await waitState('results', 600000); await page.evaluate(() => window.__api.timeScale(1));
  await sleep(1200); await shot('08-finish'); await sleep(2500); await shot('09-results');
  const f = await flow();
  console.log(JSON.stringify({ state: f.state, screen: f.screen, results: f.race.results, entries: f.race.entries.map((e) => ({ n: e.name, laps: e.lapsDone, best: e.best, stuck: e.maxStuck, off: e.maxOff })), overtakes: f.race.overtakes, ai: f.race.aiOvertakes, audio: f.audio }, null, 1));
  const st = await page.evaluate(() => window.__api.state());
  console.log('integrity', JSON.stringify(st.integrity), 'camViolations', st.camViolations, 'log', JSON.stringify(st.log));
} catch (e) { if (e !== 0) console.error('ERROR', e && e.message ? e.message : e); } finally {
  const page = browser.contexts()[0]?.pages()[0];
  if (page) { const fin = await page.evaluate(() => (window.__api ? JSON.stringify({ state: window.__api.game.state, err: window.__loadError || null }) : 'no api')).catch(() => ''); console.log('final', fin); }
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror' || l.type === 'requestfailed' || (l.type === 'warning' && !/GPU stall|willReadFrequently/i.test(l.text)));
  if (bad.length) console.log(`--- console problems (${bad.length}):`, [...new Set(bad.map((b) => `[${b.type}] ${b.text.slice(0, 500)}`))].slice(0, 15));
  await browser.close(); await srv.close();
}
