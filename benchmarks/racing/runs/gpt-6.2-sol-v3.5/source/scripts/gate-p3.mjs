import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { startBrowser } from './browser.mjs';

const { browser, server, url } = await startBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(error.stack); });
  page.on('console', message => { if (message.type() === 'error') { errors.push(message.text()); console.error(message.text()); } });
  await page.goto(url + '?verify');
  await page.waitForFunction(() => window.raceGate, null, { timeout: 90000 });
  for (const [name,file,night] of [
    ['waterfront','s1-reta-orla.png',false],['shore','s3-praia-espuma.png',false],
    ['surface','s9-close-pista.png',false],['hero','s2-grid-3-4.png',false],
  ]) {
    await page.evaluate(([name,night])=>raceGate.shot(name,night),[name,night]);
    await page.screenshot({ path:'verification/'+file });
  }
  for (const [s,shot,references] of [
    [1,'s1-reta-orla.png',['01-golden-hour-palmeiras.jpg','02-costa-praia-falesia.jpg']],
    [3,'s3-praia-espuma.png',['02-costa-praia-falesia.jpg','04-agua-margem-pedras.jpg']],
  ]) {
    const inputs=[`verification/${shot}`,...references.map(file=>'refs/'+file)];
    const layout=await Promise.all(inputs.map(async (path,i)=>({ input:await sharp(path).resize(640,360).png().toBuffer(),left:640*i,top:0 })));
    await sharp({ create:{ width:1920,height:360,channels:3,background:'white' } }).composite(layout).png().toFile(`verification/gates/p3-s${s}.png`);
  }
  const stats=await page.evaluate(()=>raceGate.stats());
  await writeFile('verification/gates/p3.json',JSON.stringify({ ...stats, errors },null,2));
  assert.deepEqual(errors,[]);
  assert.deepEqual(stats.world.errors,[]);
  assert.ok(stats.rockFoamSources>5 && stats.road.resolution>=2048 && stats.road.anisotropy>=8);
  assert.ok(stats.coastProps>=80 && stats.coastalPlants.palm>=20);
  console.log(stats.road, stats.coastalPlants, stats.coastProps, stats.rockFoamSources);
} finally {
  await browser.close();
  await server.close();
}
