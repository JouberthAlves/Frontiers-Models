import {openBrowser} from './browser.mjs';import os from 'node:os';import {fps} from './measures.mjs';
export async function performanceTest(url){
 const b=await openBrowser({uncapped:true});try{
 const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',console.error);await p.goto(url+'/?verify');await p.waitForFunction(()=>window.bench,undefined,{timeout:90000});
 await p.getByRole('button',{name:'Entrar na garagem'}).click();await p.getByRole('button',{name:'Configurar corrida'}).click();await p.getByRole('button',{name:'Ir para o grid'}).click();await p.waitForSelector('[data-screen="race"]');
 const cdp=await b.newBrowserCDPSession();const hw=await cdp.send('SystemInfo.getInfo');
 const result={gpu:await p.evaluate(()=>bench.gpu()),cpu:os.cpus()[0]?.model,os:os.type()+' '+os.release(),browser:b.version(),resolution:'1920×1080',devices:hw.gpu.devices.map(v=>({vendor:v.vendorString,model:v.deviceString})),mode:'Chromium headless, rAF sem limite de VSync, seis carros simulados na vila'};
 for(const [name,low] of [['high',false],['low',true]]){
   await p.evaluate(v=>bench.perf(v),low);await p.evaluate(()=>bench.measure(48));result[name]=fps(await p.evaluate(()=>bench.measure(180)));
 }
 return result;
 }finally{await b.close();}
}
