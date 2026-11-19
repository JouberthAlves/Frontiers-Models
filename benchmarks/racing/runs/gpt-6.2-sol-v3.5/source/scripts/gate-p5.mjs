import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { startBrowser } from './browser.mjs';
import { gameplay } from './journey.mjs';

const {browser,server,url}=await startBrowser();
const results=[], errors=[];
try {
  const page=await browser.newPage({viewport:{width:1440,height:810}});
  page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack);});
  page.on('console',e=>{if(e.type()==='error'){errors.push(e.text());console.error(e.text());}});
  await gameplay(page,url,(name,status,data)=>{
    results.push({name,status,data});
    console.log(name,status);
  },async(name,page)=>page.screenshot({path:'verification/gates/p5-'+name+'.png'}));
  const stats=await page.evaluate(()=>raceGate.stats());
  assert.ok(stats.audio.bands.length>=4&&stats.audio.bands.every(b=>b.models.flat().every(entry=>entry.realAudioBuffer)));
  assert.deepEqual(errors,[]);
} finally{
  await writeFile('verification/gates/p5.json',JSON.stringify({results,errors},null,2));
  await browser.close();
  await server.close();
}
