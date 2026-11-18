import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
export async function openBrowser({uncapped=false}={}) {
  const args=['--disable-background-timer-throttling','--disable-renderer-backgrounding','--ignore-gpu-blocklist','--enable-webgl','--enable-unsafe-swiftshader'];
  if(uncapped)args.push('--disable-frame-rate-limit','--disable-gpu-vsync');
  const options={headless:true,args,ignoreDefaultArgs:['--disable-gpu']};
  let failure;
  for(const channel of [undefined,'chrome','msedge']){
    try{return await chromium.launch({...options,channel});}catch(e){failure=e;}
  }
  const result=spawnSync(process.execPath,['node_modules/playwright/cli.js','install','chromium'],{stdio:'inherit'});
  if(result.status!==0)throw failure;return chromium.launch(options);
}
