import './build.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {serve} from './server.mjs';import {openBrowser} from './browser.mjs';import {raceTests,lapRecording} from './race-tests.mjs';import {names,imageMetrics,compare,sweep,fps,json} from './measures.mjs';import {performanceTest} from './performance.mjs';import {inspectMedia} from './media-proof.mjs';import {report} from './report.mjs';
const partial=process.argv.includes('--race-only'),photo=process.argv.includes('--visual-only');
await Promise.all(['verification','verification/compare','verification/gates','verification/sweep'].map(s=>mkdir(s,{recursive:true})));
const run={started:new Date().toISOString(),errors:[],console:[],requests:[],stages:[]};
const fail=msg=>{if(!run.errors.includes(msg)){run.errors.push(msg);console.error(msg);}};
const {server,url}=await serve();let browser;
try{
 browser=await openBrowser();let page=await browser.newPage({viewport:{width:1920,height:1080},acceptDownloads:true});
 page.on('pageerror',e=>{run.console.push(String(e));fail('Exceção do navegador — '+String(e));});
 page.on('console',m=>{if(m.type()==='error'){run.console.push(m.text());fail('Erro no console — '+m.text().slice(0,200));}});
 page.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:')){run.requests.push(r.url());fail('Dependência de rede em runtime');}});
 await page.goto(url+'/?verify');await page.waitForFunction(()=>window.bench,undefined,{timeout:90000});
 if(!photo){console.log('Jornadas de 3 e 6 voltas, pausa e reinícios.');await raceTests(page,fail);run.stages.push('jornadas');console.log('Jornadas concluídas.');
   const audio=await lapRecording(page,fail),media=await inspectMedia();await json('media-proof.json',media);
   for(const type of [1,2]){const t=media.webm.tracks.find(t=>t.type===type);if(!t||t.packets<100||Math.abs(t.seconds-media.wav.seconds)>2.5)fail('WebM sem faixa completa de '+(type===1?'vídeo':'áudio'));}
   if(media.wav.peakDB> -1||Math.abs(audio.seconds-media.wav.seconds)>.03)fail('WAV diverge da tomada PCM');
   run.stages.push('PCM e vídeo');console.log('Mídia gravada.',media.wav);
 }else{
   await page.getByRole('button',{name:'Entrar na garagem'}).click();await page.getByRole('button',{name:'Configurar corrida'}).click();await page.getByRole('button',{name:'Ir para o grid'}).click();await page.waitForSelector('[data-screen="race"]');
 }
 const stats=await page.evaluate(()=>bench.stats());await json('scene-stats.json',stats);stats.issues.forEach(fail);if(stats.engineAudioBuffers.length<4)fail('Motor sem quatro faixas conectadas de AudioBuffer');
 if(!partial){
   console.log('Doze composições, comparações e métricas.');const metrics={method:'Rec.709 em sRGB, buckets floor(R/16), floor(G/16), floor(B/16); cobertura real do fundo por oclusão em render target 256×144',captures:{},sweep:{}};
   for(let n=1;n<=12;n++){
     const pose=await page.evaluate(n=>bench.view(n),n),staticView=[2,11,12].includes(n);
     const frames=staticView?null:fps(await page.evaluate(()=>bench.measure(25)));const sky=n===12?null:await page.evaluate(()=>bench.sky());
     const bytes=await page.screenshot({path:'verification/'+names[n],animations:'disabled'});const result=await imageMetrics(bytes,sky,n);
     metrics.captures[names[n]]={...result,fps:frames,fixture:pose};for(const e of result.errors||[])fail('S'+n+' — '+e);await compare(n);
   }
   console.log('Varredura de 25 m em Alta e Baixa.');metrics.sweep.high=await sweep(page,stats,false,fail);metrics.sweep.low=await sweep(page,stats,true,fail);await json('image-metrics.json',metrics);run.stages.push('imagens e varredura');
   await browser.close();browser=null;console.log('Medição da vila a 1080p.');const perf=await performanceTest(url);await json('performance.json',perf);run.stages.push('desempenho');
   for(const k of ['high','low'])if(perf[k].mean<60)fail('FPS médio local abaixo de 60 em '+(k==='high'?'Alta':'Baixa')+' ('+perf[k].mean.toFixed(1)+')');
   console.log('FPS médios',perf.high.mean.toFixed(1),perf.low.mean.toFixed(1));
 }
}catch(e){fail(String(e.stack||e));}finally{if(browser)await browser.close();server.close();run.finished=new Date().toISOString();await json('run.json',run);await writeFile('verification/browser.log',[...run.stages,...run.console,...run.errors].join('\n')+'\n');await report(run);}
if(run.errors.length)process.exitCode=1;else console.log('Verificações executadas passaram.');
