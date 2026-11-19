import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { startBrowser } from './browser.mjs';

const { browser, server, url } = await startBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(error.stack); });
  page.on('console', entry => {
    if (entry.type() === 'error') { errors.push(entry.text()); console.error(entry.text()); }
  });
  await page.goto(url + '?verify');
  await page.waitForFunction(() => window.raceGate, null, { timeout: 90000 });
  const shots = [
    ['hero', 's2-grid-3-4.png', false], ['second-hero','gates/p2-nerita.png',false],
    ['cockpit','s15-cockpit.png',false], ['hero','gates/p2-night.png',true],
  ];
  const poses = {};
  for (const [mode,path,night] of shots) {
    poses[path] = await page.evaluate(([mode,night])=>raceGate.shot(mode,night),[mode,night]);
    await page.screenshot({ path: 'verification/' + path });
  }
  const stats = await page.evaluate(() => raceGate.stats());
  await writeFile('verification/gates/p2.json',JSON.stringify({ ...stats, poses, errors },null,2));
  await sharp({ create: {width:1920,height:540,channels:3,background:'white'} }).composite([
    { input:await sharp('verification/s2-grid-3-4.png').resize(960,540).png().toBuffer(),left:0,top:0 },
    { input:await sharp('refs/11-carro-pintura-vidro-rodas.jpg').resize(960,540).png().toBuffer(),left:960,top:0 },
  ]).png().toFile('verification/gates/p2-reference.png');
  assert.deepEqual(errors, []);
  assert.deepEqual(stats.world.errors, []);
  assert.equal(stats.pipeline.csmLights,3);
  assert.equal(stats.pipeline.toneMap,'AgX');
  assert.ok(stats.pipeline.gtao.active && stats.pipeline.msaa > 0);
  for (const car of stats.cars) {
    assert.ok(car.triangles >= 15000 && car.materialCount >= 6 && car.directWheelHubs === 4 && car.steeringWheel && car.instrumentDisplay);
  }
  assert.ok(Math.abs(poses['s15-cockpit.png'].wheel) > .05);
  console.log(stats.pipeline, stats.cars.map(c => ({ model:c.model, triangles:c.triangles })), poses['s15-cockpit.png']);
} finally {
  await browser.close();
  await server.close();
}
