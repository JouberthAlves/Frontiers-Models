import {serve} from './server.mjs';
import {openBrowser} from './browser.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
const {server,url}=await serve(),browser=await openBrowser();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 page.on('pageerror',e=>console.error(e));page.on('console',m=>{if(m.type()==='error')console.error(m.text());});
 await page.goto(url+'/?verify');await page.waitForFunction(()=>window.bench,{},{timeout:60000});
 const result=await page.evaluate(()=>({world:bench.validate(),lap:bench.driveLap()}));
 if(!result.world.ok||result.lap.distance<result.lap.length||result.lap.events.length||!(result.lap.wheelGap<1.5))throw Error(JSON.stringify(result));
 await page.evaluate(()=>bench.map());await page.screenshot({path:'verification/gates/p1-aerial.png'});
 await writeFile('verification/gates/p1.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();server.close();}
