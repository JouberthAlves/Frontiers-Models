import {serve} from './server.mjs';import {openBrowser} from './browser.mjs';import sharp from 'sharp';import {writeFile} from 'node:fs/promises';
const {server,url}=await serve(),browser=await openBrowser();
try{const page=await browser.newPage({viewport:{width:384,height:216}});page.on('pageerror',console.error);await page.goto(url+'/?verify');await page.waitForFunction(()=>window.bench);
 const stats=await page.evaluate(()=>bench.stats());console.log('Units',stats.units,'issues',stats.issues);
 await writeFile('verification/gates/p4-density.json',JSON.stringify({...stats,instances:undefined},null,2));
 for(const low of [false,true]){
 const shots=[];for(let s=stats.zones[2].s;s<stats.length;s+=25){const capture=await page.evaluate(({s,low})=>bench.sweep(s,low),{s,low});shots.push(Buffer.from(capture.split(',')[1],'base64'));}
 const tiles=await Promise.all(shots.map(async(b,i)=>({input:await sharp(b).resize(160,90).jpeg().toBuffer(),left:i%8*160,top:Math.floor(i/8)*90})));
 await sharp({create:{width:1280,height:Math.ceil(tiles.length/8)*90,channels:3,background:'#222222'}}).composite(tiles).jpeg({quality:89}).toFile('verification/gates/p4-'+(low?'baixa':'alta')+'-sweep.jpg');}
 if(stats.issues.length)throw Error(stats.issues.join(', '));
}finally{await browser.close();server.close();}
