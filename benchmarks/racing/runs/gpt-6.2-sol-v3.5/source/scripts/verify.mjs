import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { access, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { startStatic } from './serve.mjs';
import { gameplay, openRace } from './journey.mjs';
import { lapMedia } from './lap-media.mjs';
import { comparisons, sweepNotes } from './visual-notes.mjs';

const directory='verification';
await Promise.all(['compare','sweep','gates'].map(d=>mkdir(`${directory}/${d}`,{recursive:true})));
const records=[], failures=[], browserErrors=[], external=[];
const log=(name,status,data)=>{
  records.push({name,status,data});
  console.log(name+' · '+status);
};
const run=async (name,test)=>{
  try {
    const evidence=await test();
    log(name,'Pass',evidence);
    return evidence;
  } catch(error) {
    failures.push(`${name} — ${error.message}`);
    log(name,'Fail',error.stack);
    return null;
  }
};
const require=createRequire(import.meta.url);
try { await access(chromium.executablePath()); }
catch {
  const installed=spawnSync(process.execPath,[require.resolve('playwright/cli'),'install','chromium','--no-shell','--no-remove'],{stdio:'inherit'});
  if(installed.status!==0) throw new Error('Could not install the Playwright Chromium browser');
}
const {server,url}=await startStatic();
const browser=await chromium.launch({channel:'chromium',args:['--enable-webgl','--enable-unsafe-swiftshader']});
const viewport={width:1920,height:1080};
const browserVersion=browser.version();

async function pageFor(size=viewport) {
  const page=await browser.newPage({viewport:size,acceptDownloads:true});
  page.on('pageerror',e=>browserErrors.push(e.message));
  page.on('console',e=>{if(e.type()==='error') browserErrors.push(e.text());});
  page.on('response',response=>{if(response.status()>=400) browserErrors.push(`${response.status()} ${response.url()}`);});
  page.on('request',request=>{
    const target=request.url();
    if(/^https?:/.test(target)&&!target.startsWith(url)) external.push(target);
  });
  return page;
}

const spec = [
  [1,'waterfront','s1-reta-orla.png',['01-golden-hour-palmeiras.jpg','02-costa-praia-falesia.jpg']],
  [2,'hero','s2-grid-3-4.png',['11-carro-pintura-vidro-rodas.jpg']],
  [3,'shore','s3-praia-espuma.png',['02-costa-praia-falesia.jpg','04-agua-margem-pedras.jpg']],
  [4,'cliff','s4-falesia-mirante.png',['02-costa-praia-falesia.jpg']],
  [5,'village','s5-vila-rua.png',['05-vila-igreja-densidade.jpg','06-vila-pedra-disputa.jpg','07-vila-paredes-velocidade.jpg']],
  [6,'woods','s6-bosque-luz.png',['08-vegetacao-densa.jpg','10-luz-rasante-floresta.jpg']],
  [7,'bridge','s7-ponte-ou-tunel.png',['14-ponte-terreno.jpg']],
  [8,'pack','s8-disputa.png',['09-vegetacao-curva-disputa.jpg','13-pelotao-ia-lado-a-lado.jpg']],
  [9,'surface','s9-close-pista.png',[]],
  [10,'village','s10-baixa-vila.png',[],false,'low'],
  [11,'scale','s11-escala.png',[]],
  [12,'overview','s12-mapa.png',[]],
  [13,'waterfront','s13-night-coast.png',[],true],
  [14,'village','s14-night-village.png',[],true],
  [15,'cockpit','s15-cockpit.png',[]],
];

async function screenshotAndCompare(page) {
  for(const [number,pose,filename,refs,night,quality] of spec){
    await page.evaluate(([pose,night,quality])=>raceGate.shot(pose,night,quality),[pose,night,quality]);
    const png=await page.screenshot({path:`${directory}/${filename}`});
    const dimensions=await sharp(png).metadata();
    assert.equal(dimensions.width,1920);
    assert.equal(dimensions.height,1080);
    if(!refs.length) continue;
    const sources=[png,...refs.map(path=>'refs/'+path)];
    const layers=await Promise.all(sources.map(async (source,i)=>({
      input:await sharp(source).resize(1920,1080,{fit:'contain',background:'#161d22'}).png().toBuffer(),
      left:1920*i,top:0,
    })));
    await sharp({create:{width:1920*layers.length,height:1080,channels:3,background:'#161d22'}})
      .composite(layers).png().toFile(`${directory}/compare/s${number}.png`);
  }
  return {count:spec.length,dimensions:viewport,comparisons:spec.filter(s=>s[3].length).length};
}

async function sweep(page,meters) {
  await page.setViewportSize({width:480,height:270});
  const paths=[];
  const columns=10, width=188, height=118;
  const layers=[];
  for(const quality of ['high','low']){
    for(let distance=0;distance<meters;distance+=25){
      await page.evaluate(([s,q])=>raceGate.sweep(s,q),[distance,quality]);
      const name=quality+'-'+String(distance).padStart(4,'0');
      const file=`${directory}/sweep/${name}.png`;
      const shot=await page.screenshot({path:file,animations:'disabled'});
      const tile=await sharp(shot).resize(width,106).png().toBuffer();
      const x=paths.length%columns*width, y=Math.floor(paths.length/columns)*height;
      layers.push({input:tile,left:x,top:y});
      const tag=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="12"><rect width="100%" height="100%" fill="#20232a"/><text x="5" y="10" font-family="sans-serif" font-size="9" fill="#f3ead0">${quality} · ${distance} m</text></svg>`);
      layers.push({input:tag,left:x,top:y+106});
      paths.push(file);
    }
    console.log(`${quality} circuit sweep captured`);
  }
  await sharp({create:{width:columns*width,height:Math.ceil(paths.length/columns)*height,channels:3,background:'#20232a'}})
    .composite(layers).png().toFile(`${directory}/sweep-sheet.png`);
  return {images:paths.length,spacing:25,meters};
}

function texturePass(map,minimum) {
  return map?.file&&map.width>=minimum&&map.height>=minimum&&!map.procedural;
}

function sceneAudit(snapshot,night) {
  const {pipeline,cars,world,road,primary,plants,village,audio}=snapshot;
  assert.deepEqual(world.errors,[]);
  assert.equal(pipeline.csmLights,3);
  assert.ok(pipeline.cascades.every(pair=>pair.every(n=>n>=2048)));
  assert.ok(pipeline.gtao.active&&pipeline.gtao.depth&&pipeline.msaa>=2&&pipeline.toneMap==='AgX');
  assert.ok(snapshot.triplanar&&snapshot.foliageTransmission>0&&road.anisotropy>=8&&road.resolution>=2048);
  assert.ok(cars.length>=2&&cars[0].model!==cars[1].model);
  for(const car of cars) {
    assert.ok(car.triangles>=15000&&car.materialCount>=6&&car.directWheelHubs===4&&car.interior&&car.steeringWheel);
  }
  for(const row of primary) {
    const min=row.kind==='asphalt'?2048:1024;
    assert.ok(texturePass(row.albedo,min)&&texturePass(row.normal,min),row.name+' requires scanned maps');
    for(const layer of row.layers??[]) assert.ok(texturePass(layer.albedo,1024)&&texturePass(layer.normal,1024),layer.layer);
  }
  assert.ok(village.units>=60&&village.styles.length>=5&&village.tiers.length>=2&&village.alleys>=2);
  assert.ok(['pine','olive','cypress','palm','shrub','grass'].every(name=>plants[name]>0));
  assert.ok(audio.bands.length>=4&&audio.bands.every(b=>b.models.flat().every(l=>l.realAudioBuffer&&l.samples>0)));
  assert.ok(night.lights.streetlights>0&&night.lights.headlights>0);
  return {layers:primary.length,buildingUnits:village.units,night:night.lights,cars:cars.map(c=>c.triangles)};
}

function fps(times) {
  const duration=times.reduce((s,t)=>s+t,0);
  const slowest=[...times].sort((a,b)=>b-a).slice(0,Math.max(1,Math.ceil(times.length*.01)));
  return {
    average:times.length*1000/duration,
    onePercentLow:slowest.length*1000/slowest.reduce((s,t)=>s+t,0),
    frames:times.length, seconds:duration/1000,
  };
}

let metrics=null, footage=null, measurements=null, screenshots=null, sweepResult=null;
try {
  const structural=await pageFor();
  await run('Load built bundle',()=>openRace(structural,url));
  const gameplayPage=await pageFor({width:1440,height:810});
  await run('Playable build journeys',()=>gameplay(gameplayPage,url,log));
  await gameplayPage.close();

  screenshots=await run('15 reproducible screenshots',()=>screenshotAndCompare(structural));
  metrics=await run('Gather live scene and renderer statistics',async()=>{
    const night=await structural.evaluate(()=>{
      raceGate.shot('village',true,'high');
      return raceGate.stats();
    });
    const high=await structural.evaluate(()=>{
      raceGate.shot('village',false,'high');
      return raceGate.stats();
    });
    const testPage=await pageFor({width:960,height:540});
    const {beginRace}=await import('./journey.mjs');
    await openRace(testPage,url);
    await beginRace(testPage);
    high.audio=await testPage.evaluate(()=>raceGate.state().audio);
    await testPage.close();
    const result={lengthMeters:high.world.lengthMeters,day:high,night,browser:browserVersion,cpu:os.cpus()[0].model};
    await writeFile(directory+'/scene-stats.json',JSON.stringify(result,null,2));
    return result;
  });
  if(metrics) await run('Scene, asset and render pipeline audit',()=>sceneAudit(metrics.day,metrics.night));

  measurements=await run('Timed village performance',async()=>{
    const measures=[];
    for(const [quality,night] of [['high',false],['high',true],['low',false]]){
      await structural.evaluate(([quality,night])=>raceGate.shot('village',night,quality),[quality,night]);
      const options=await structural.evaluate(()=>({pipeline:raceGate.stats().pipeline,opponents:raceGate.state().ai.length}));
      const samples=await structural.evaluate(()=>raceGate.measure(6500));
      assert.ok(samples.length>=8);
      measures.push({quality,period:night?'Night':'Golden hour',opponents:options.opponents, gpu:options.pipeline.gpu,...fps(samples)});
    }
    const conditions={cpu:os.cpus()[0].model,gpu:measures[0].gpu,browser:browserVersion,resolution:viewport};
    await writeFile(directory+'/performance.json',JSON.stringify({conditions,measures},null,2));
    return {conditions,measures};
  });
  if(measurements) for(const measure of measurements.measures) {
    if(measure.average<60) {
      failures.push(`${measure.quality} · ${measure.period} averaged ${measure.average.toFixed(1)} FPS on the measured GPU, below 60.`);
    }
  }
  sweepResult=await run('25 m circuit sweep on high and low',()=>{
    return structural.evaluate(()=>raceGate.stats().world.lengthMeters).then(meters=>sweep(structural,meters));
  });
  await structural.close();

  const mediaPage=await pageFor();
  footage=await run('One live lap with post-limiter PCM and muxed video',()=>lapMedia(mediaPage,url,directory));
  await mediaPage.close();
  await run('Local asset requests and browser errors',()=>{
    assert.deepEqual(external,[]);
    assert.deepEqual(browserErrors,[]);
    return {externalRequests:0,browserErrors:0};
  });
  await run('Static build size and reference isolation',async()=>{
    const files=await readdir('dist',{recursive:true,withFileTypes:true});
    assert.ok(!files.some(f=>f.name==='refs'||/^[01]\d-.+\.jpg$/.test(f.name)));
    const sizes=await Promise.all(files.filter(f=>f.isFile()).map(f=>stat(f.parentPath+'/'+f.name)));
    const bytes=sizes.reduce((sum,file)=>sum+file.size,0);
    assert.ok(bytes<=400e6);
    return {bytes,files:sizes.length};
  });
} finally {
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
  await writeFile(directory+'/test-logs.json',JSON.stringify({records,failures,browserErrors,external},null,2));
  await writeFile(directory+'/REPORT.md',report());
}
if(failures.length) process.exitCode=1;

function tStamp(value) {
  return value===null?'unrecorded':Math.floor(value/60).toString().padStart(2,'0')+':'+Math.floor(value%60).toString().padStart(2,'0');
}

function report() {
  const lines=['# Racing Bench V4 verification',''];
  if(failures.length) {
    lines.push('## Failing criteria','',...failures.map(f=>'- '+f),'');
  }
  lines.push('## Runtime results','');
  for(const entry of records) {
    lines.push(`- ${entry.name} · ${entry.status}`);
  }
  const cleanup=records.find(r=>r.name==='Pause, restart and menu cleanup')?.data;
  if(cleanup) lines.push(`- Active race audio voices before and after three restart cycles · ${cleanup.baseline} → ${cleanup.voiceCounts.join(' → ')}`);
  if(metrics) lines.push('- Scene and renderer data were read from the running WebGL build. See [scene-stats.json](scene-stats.json).');
  lines.push('- See the complete [test log](test-logs.json).','');
  if(measurements) {
    const {conditions,measures}=measurements;
    lines.push('## Performance','',`${conditions.gpu} · ${conditions.cpu} · Chromium ${conditions.browser} · ${conditions.resolution.width} × ${conditions.resolution.height}`,'',
      '| Quality | Lighting | AI cars | Average FPS | 1% low FPS |','| --- | --- | ---: | ---: | ---: |',
      ...measures.map(m=>`| ${m.quality} | ${m.period} | ${m.opponents} | ${m.average.toFixed(1)} | ${m.onePercentLow.toFixed(1)} |`),'',
      'All samples were taken during an active race in the village. The Low measurements use the same discrete GPU. See [the timing data](performance.json).','');
  }
  if(footage) {
    lines.push('## Live audio and video','',`The lap took ${footage.lapSeconds.toFixed(2)} s. The post-limiter stereo track contains ${footage.recordSeconds.toFixed(2)} s at ${footage.sampleRate} Hz. Peak level was ${footage.masterPeakDb.toFixed(2)} dBFS, with a maximum of ${footage.maxVoices} simultaneous voices. [PCM WAV](audio-volta.wav) · [WebM with audio](volta.webm)`,'',
      ...footage.cues.map(c=>`- ${tStamp(c.seconds)} · ${c.label}`),'');
  }
  if(screenshots) {
    lines.push('## Side-by-side review','');
    for(const [number,,filename,refs] of spec.filter(s=>s[3].length)) {
      lines.push(`### S${number} — ${filename}`,'',...comparisons[number].map(text=>'- '+text),'',
        `[Capture](${filename}) · [Comparison](compare/s${number}.png)`,'');
    }
  }
  if(sweepResult) {
    lines.push('## Circuit sweep','',`Captured ${sweepResult.images} chase thumbnails in 25 m increments. [Sweep sheet](sweep-sheet.png)`,'',
      ...sweepNotes.map(text=>'- '+text),'');
  }
  return lines.join('\n');
}
