import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { startBrowser } from './browser.mjs';

const { browser,server,url }=await startBrowser();
try {
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack);});
  page.on('console',e=>{if(e.type()==='error'){errors.push(e.text());console.error(e.text());}});
  await page.goto(url+'?verify');
  await page.waitForFunction(()=>window.raceGate,null,{timeout:120000});
  const files=[
    [4,'cliff','s4-falesia-mirante.png','02-costa-praia-falesia.jpg'],
    [5,'village','s5-vila-rua.png','05-vila-igreja-densidade.jpg'],
    [6,'woods','s6-bosque-luz.png','08-vegetacao-densa.jpg'],
    [7,'bridge','s7-ponte-ou-tunel.png','14-ponte-terreno.jpg'],
    [8,'pack','s8-disputa.png','13-pelotao-ia-lado-a-lado.jpg'],
    [11,'scale','s11-escala.png',null],
    [13,'waterfront','s13-night-coast.png',null,true],
    [14,'village','s14-night-village.png',null,true],
    [10,'village','s10-baixa-vila.png',null,false,'low'],
  ];
  let night;
  for(const [id,mode,file,ref,isNight,quality] of files){
    await page.evaluate(([mode,night,quality])=>raceGate.shot(mode,night,quality),[mode,isNight,quality]);
    const png=await page.screenshot({path:'verification/'+file,timeout:30000});
    if(id===14) night=await page.evaluate(()=>raceGate.stats());
    if(ref) {
      const left=await sharp(png).resize(850,478).png().toBuffer();
      const right=await sharp('refs/'+ref).resize(850,478).png().toBuffer();
      await sharp({create:{width:1700,height:478,channels:3,background:'#262a30'}})
        .composite([{input:left,left:0,top:0},{input:right,left:850,top:0}]).png().toFile('verification/gates/p4-s'+id+'.png');
    }
  }
  const low=await page.evaluate(()=>raceGate.stats());
  await writeFile('verification/gates/p4.json',JSON.stringify({night,low,errors},null,2));
  assert.deepEqual(errors,[]);
  assert.deepEqual(night.world.errors,[]);
  assert.ok(night.village.units>=60 && night.village.styles.length>=5 && night.village.tiers.length>=2);
  assert.ok(night.lights.streetlights>0&&night.lights.headlights>0);
  assert.ok(night.triplanar&&night.plants.pine>0&&night.plants.olive>0&&night.plants.cypress>0&&night.plants.palm>0);
  console.log(night.village,night.plants,night.lights,night.pipeline);
} finally {
  await browser.close();
  await server.close();
}
