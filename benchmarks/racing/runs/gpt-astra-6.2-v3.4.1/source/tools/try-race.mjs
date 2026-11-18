import {serve} from './server.mjs';import {openBrowser} from './browser.mjs';import sharp from 'sharp';
const {server,url}=await serve(),b=await openBrowser();
try{const p=await b.newPage({viewport:{width:1440,height:810}});p.on('console',m=>{if(m.type()==='error')console.error(m.text().slice(0,2500));});p.on('pageerror',console.error);
 await p.goto(url+'/?verify');await p.waitForFunction(()=>window.bench,undefined,{timeout:60000});await p.screenshot({path:'verification/gates/menu.png'});
 await p.getByRole('button',{name:'Entrar na garagem'}).click();await p.getByRole('button',{name:'Configurar corrida'}).click();await p.getByRole('button',{name:'Ir para o grid'}).click();await p.waitForSelector('[data-screen="race"]');
 await p.evaluate(()=>bench.manual(true));console.log(await p.evaluate(()=>bench.advance(365)));const summary=await p.evaluate(()=>bench.summary());console.log(summary.phase,summary.time,summary.passes,summary.camHits,summary.voices,summary.vehicles[0],await p.evaluate(()=>bench.stats().engineAudioBuffers));
 await p.screenshot({path:'verification/gates/results.png'});await sharp('verification/gates/menu.png').resize(1152).jpeg({quality:86}).toFile('verification/gates/menu-review.jpg');
}finally{await b.close();server.close();}
