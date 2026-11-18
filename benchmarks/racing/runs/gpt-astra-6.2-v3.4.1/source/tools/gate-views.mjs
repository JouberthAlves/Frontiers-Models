import {serve} from './server.mjs';
import {openBrowser} from './browser.mjs';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const gate=process.argv[2],nums=process.argv.slice(3).map(Number);
const refs={1:[1,2],2:[11],3:[2,4],4:[2],5:[5,6,7],6:[8,10],7:[14],8:[9,13]};
const {server,url}=await serve(),browser=await openBrowser();
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];
 page.on('pageerror',e=>{errors.push(String(e));console.error(e);});
 page.on('console',m=>{if(m.type()==='error'){console.error(m.text().slice(0,4000));errors.push(m.text());}});
 await page.goto(url+'/?verify');await page.waitForFunction(()=>window.bench,undefined,{timeout:90000});
 const valid=await page.evaluate(()=>bench.validate());if(!valid.ok)throw Error(JSON.stringify(valid));console.log(valid,await page.evaluate(()=>bench.gpu()));
 const files=await readdir('tools/references');
 for(const n of nums){
   await page.evaluate(n=>bench.view(n),n);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const file='verification/gates/'+gate+'-s'+n+'.png';await page.screenshot({path:file});
   const sources=[file,...(refs[n]||[]).map(id=>'tools/references/'+files.find(f=>f.startsWith(String(id).padStart(2,'0')+'-')))];
   const images=await Promise.all(sources.map(async (p,i)=>({input:await sharp(p).resize(640,360,{fit:'cover'}).png().toBuffer(),left:i*640,top:0})));
   await sharp({create:{width:640*sources.length,height:360,channels:3,background:'#161717'}}).composite(images).jpeg({quality:90}).toFile('verification/gates/'+gate+'-compare-s'+n+'.jpg');
 }
 if(errors.length)throw Error(errors.join('\n').slice(0,4000));
}finally{await browser.close();server.close();}
