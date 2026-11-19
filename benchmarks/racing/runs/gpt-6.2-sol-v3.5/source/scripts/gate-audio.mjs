import assert from 'node:assert/strict';
import { startBrowser } from './browser.mjs';
import { lapMedia } from './lap-media.mjs';

const {browser,server,url}=await startBrowser();
try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},acceptDownloads:true});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  await lapMedia(page,url);
  assert.deepEqual(errors,[]);
}finally{
  await browser.close();
  await server.close();
}
