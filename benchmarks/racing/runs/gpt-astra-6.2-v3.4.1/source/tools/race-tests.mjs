import {stat} from 'node:fs/promises';
import {json} from './measures.mjs';
const screen=(page,name)=>page.waitForSelector('[data-screen="'+name+'"]',{timeout:45000});
const click=(p,n)=>p.getByRole('button',{name:n,exact:true}).click();
export async function journeyToGrid(p,laps){
 await click(p,'Entrar na garagem');await screen(p,'garage');await click(p,'Configurar corrida');await screen(p,'setup');
 await click(p,laps+' voltas');await click(p,'Ir para o grid');await screen(p,'race');
}
export async function raceTests(page,fail) {
 const test={races:[],restarts:[],controlChecks:{}};const cdp=await page.context().newCDPSession(page);await cdp.send('HeapProfiler.enable');
 await page.evaluate(()=>bench.manual(true));await journeyToGrid(page,3);
 await page.keyboard.press('ArrowUp');await page.evaluate(()=>bench.advance(2));const intro=await page.evaluate(()=>bench.summary());
 test.controlChecks.falseStart=intro.time===0&&intro.phase==='grid';if(!test.controlChecks.falseStart)fail('Largada antecipada');
 await page.evaluate(()=>bench.advance(418));await screen(page,'results');const three=await page.evaluate(()=>bench.summary());test.races.push(three);
 await click(page,'Correr de novo');await screen(page,'race');await page.evaluate(()=>bench.advance(19));
 await page.keyboard.press('c');test.controlChecks.hood=(await page.evaluate(()=>bench.controls())).hood;await page.keyboard.press('c');
 await click(page,'Pausar corrida');await screen(page,'paused');const pt=(await page.evaluate(()=>bench.summary())).time;
 await page.waitForTimeout(120);test.controlChecks.paused=(await page.evaluate(()=>bench.summary())).time===pt;await click(page,'Continuar');await screen(page,'race');
 test.controlChecks.resumed=(await page.evaluate(()=>bench.controls())).phase==='race';
 async function restartSample(){await cdp.send('HeapProfiler.collectGarbage');const mem=await cdp.send('Runtime.getHeapUsage'),s=await page.evaluate(()=>bench.summary());return {bytes:mem.usedSize,voices:s.voices,initial:s.initialVoices,phase:s.phase};}
 test.baseline=await restartSample();
 for(let i=0;i<3;i++){await page.evaluate(()=>bench.advance(12));await click(page,'Pausar corrida');await click(page,'Reiniciar corrida');await screen(page,'race');await page.waitForFunction(()=>bench.controls().phase==='grid');test.restarts.push(await restartSample());}
 await click(page,'Pausar corrida');await click(page,'Voltar ao menu');await screen(page,'menu');test.menuVoices=(await page.evaluate(()=>bench.summary())).voices;
 await journeyToGrid(page,6);await page.evaluate(()=>bench.advance(790));await screen(page,'results');test.races.push(await page.evaluate(()=>bench.summary()));
 test.anticut=await page.evaluate(()=>bench.cut());test.world=await page.evaluate(()=>bench.validate());
 for(const [i,s] of test.races.entries()){const laps=i?6:3;
  if(s.laps!==laps||s.phase!=='results')fail('Jornada de '+laps+' voltas');
  if(s.passes<1||s.vehicles.slice(1).some(c=>c.maxIdle>5||c.maxOff>5))fail('IA na corrida de '+laps+' voltas');
  if(s.camHits||s.events.some(e=>e.type==='integrity-reset')||s.vehicles.some(c=>c.wheelGap>1.5||c.bodyClearance<-.02))fail('Integridade na corrida de '+laps+' voltas');
  if(s.results.some(r=>r.driver!==0&&r.time>s.time&&!r.projected))fail('Classificação projetada');
 }
 if(Object.values(test.controlChecks).some(v=>!v))fail('Controles e pausa');
 if(test.restarts.some(r=>r.voices!==test.baseline.initial||r.bytes>test.baseline.bytes+Math.max(16e6,test.baseline.bytes*.2))||test.menuVoices!==0)fail('Limpeza de vozes ou heap');
 if(!test.anticut.first||test.anticut.jump||test.anticut.lap||test.anticut.laps||!test.world.ok)fail('Checkpoints ou validação de mundo');
 await json('race-tests.json',test);await click(page,'Voltar ao menu');await screen(page,'menu');
 return test;
}
export async function lapRecording(page,fail){
 await page.evaluate(()=>bench.record());await journeyToGrid(page,3);console.log('Volta em tempo real e PCM do master em andamento.');
 await page.waitForFunction(()=>bench.recordReady(),undefined,{polling:350,timeout:360000});
 const meta=await page.evaluate(()=>bench.recordMeta());
 for(const [kind,file] of [['video','volta.webm'],['audio','audio-volta.wav']]){
   const download=page.waitForEvent('download');await page.evaluate(k=>bench.download(k),kind);await (await download).saveAs('verification/'+file);
   if((await stat('verification/'+file)).size<1024)fail('Gravação vazia '+file);
 }
 if(meta.peakDB>-1||meta.peakDB< -65||meta.seconds<80||meta.maxAI>5||!meta.videoType.includes('opus'))fail('Prova de áudio ou vídeo');
 const events=meta.events.filter(e=>e.driver===0||e.other===0);meta.markers=Object.fromEntries(['gear','skid','collision','bridge','pass'].map(k=>[k,events.find(e=>e.type===k)?.recordTime??null]));
 for(const [k,t] of Object.entries(meta.markers))if(t===null)fail('Evento ausente na volta gravada — '+k);
 await json('audio-metrics.json',meta);await page.getByRole('button',{name:'Pausar corrida'}).click();return meta;
}
