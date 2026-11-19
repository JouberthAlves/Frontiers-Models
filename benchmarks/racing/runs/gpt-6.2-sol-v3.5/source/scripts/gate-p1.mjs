import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { startBrowser } from './browser.mjs';

const { browser, server, url } = await startBrowser();
await mkdir('verification/gates', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', error => console.error(error.stack));
  await page.goto(url + '?verify&p1');
  await page.waitForFunction(() => window.p1);
  const metrics = await page.evaluate(() => ({ world: p1.world, length: p1.length }));
  assert.deepEqual(metrics.world.errors, []);
  assert.ok(metrics.length >= 2500 && metrics.length <= 3500);
  const outcomes = {};
  for (const [key, sign] of [['d', 1], ['ArrowRight', 1], ['a', -1], ['ArrowLeft', -1]]) {
    await page.evaluate(() => p1.reset());
    await page.keyboard.down('w');
    const initial = await page.evaluate(() => p1.advance(1.25));
    await page.keyboard.down(key);
    const after = await page.evaluate(() => p1.advance(.6));
    await page.keyboard.up(key);
    await page.keyboard.up('w');
    assert.ok(sign * (after.lateral - initial.lateral) > .35, key + ' lateral direction');
    assert.ok(sign * (after.heading - initial.heading) > .06, key + ' yaw direction');
    outcomes[key] = { displacement: after.lateral - initial.lateral, yaw: after.heading - initial.heading };
  }
  for (const boost of [false, true]) {
    await page.evaluate(() => p1.reset());
    await page.keyboard.down('w');
    await page.evaluate(() => p1.advance(2));
    if (boost) await page.keyboard.down('Shift');
    const result = await page.evaluate(() => p1.advance(1));
    if (boost) await page.keyboard.up('Shift');
    await page.keyboard.up('w');
    outcomes[boost ? 'boost' : 'normal'] = { speed: result.speed, nitro: result.nitro };
  }
  assert.ok(outcomes.boost.speed > outcomes.normal.speed + .65 && outcomes.boost.nitro < .9);
  await page.evaluate(() => {
    p1.reset();
    p1.advance(5, true);
    p1.screenshot(false);
  });
  const chase = await page.screenshot({ path: 'verification/gates/p1-chase.png' });
  await page.evaluate(() => p1.screenshot(true));
  await page.screenshot({ path: 'verification/s12-mapa.png' });
  const lap = await page.evaluate(() => p1.advance(150, true));
  assert.equal(lap.lap, 1);
  assert.ok(lap.lapTime >= 105 && lap.lapTime <= 150, 'lap pace');
  assert.deepEqual(lap.resets, []);
  await sharp({ create: { width: 1920, height: 540, channels: 3, background: 'white' } }).composite([
    { input: await sharp(chase).resize(960, 540).png().toBuffer(), left: 0, top: 0 },
    { input: await sharp('refs/02-costa-praia-falesia.jpg').resize(960, 540).png().toBuffer(), left: 960, top: 0 },
  ]).png().toFile('verification/gates/p1-reference.png');
  const result = { ...metrics, outcomes, lap };
  await writeFile('verification/gates/p1.json', JSON.stringify(result, null, 2));
  console.log(result);
} finally {
  await browser.close();
  await server.close();
}
