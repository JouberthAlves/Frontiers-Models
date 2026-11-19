import assert from 'node:assert/strict';

export const action = (page,id) => page.locator(`[data-action="${id}"]`).click();
const choose = (page,kind,value) => page.locator(`[data-option="${kind}"][data-value="${value}"]`).click();
const state = page => page.evaluate(()=>raceGate.state());
const advance = (page,seconds,auto=false,draw=true) => page.evaluate(([seconds,auto,draw])=>raceGate.advance(seconds,auto,draw),[seconds,auto,draw]);
const phase = (page,label) => page.waitForFunction(label=>raceGate.state().phase===label,label);

export async function openRace(page,url) {
  await page.goto(url+'?verify');
  await page.waitForFunction(()=>window.raceGate,null,{timeout:120000});
}

export async function beginRace(page,{laps=3,period='golden',quality='high'}={}) {
  await action(page,'garage');
  await phase(page,'garage');
  await action(page,'setup');
  await choose(page,'laps',laps);
  await choose(page,'period',period);
  if(quality!=='high') await choose(page,'quality',quality);
  await action(page,'start');
  await phase(page,'intro');
}

export async function gameplay(page,url,log,capture=async()=>{}) {
  await openRace(page,url);
  await capture('home',page);
  await action(page,'garage');
  await phase(page,'garage');
  await action(page,'model-next');
  await choose(page,'livery',1);
  assert.ok(await page.getByRole('heading',{name:'Nerita RS'}).isVisible());
  await capture('garage',page);
  await action(page,'setup');
  assert.ok(await page.getByRole('heading',{name:'Race setup'}).isVisible());
  await action(page,'start');
  await phase(page,'intro');
  await page.keyboard.down('w');
  let result=await advance(page,7.80,false);
  assert.equal(result.phase,'countdown');
  assert.equal(result.time,0);
  assert.equal(result.player.speed,0);
  await page.keyboard.up('w');

  await advance(page,.28,false);
  await page.keyboard.down('w');
  await advance(page,1.72);
  await page.keyboard.down('Shift');
  result=await advance(page,.94);
  await page.keyboard.up('Shift');
  await page.keyboard.up('w');
  assert.ok(result.player.nitro<.92);
  await page.keyboard.press('c');
  assert.equal((await state(page)).mode,'cockpit');
  await advance(page,1.6,true);
  await page.keyboard.press('c');
  assert.equal((await state(page)).mode,'chase');
  result=await advance(page,410,true);
  assert.equal(result.phase,'results');
  assert.equal(result.player.lap,3);
  assert.ok(result.player.lastLap>=103&&result.player.lastLap<=150);
  assert.deepEqual(result.resets,[]);
  assert.ok(result.minClearance>0&&result.cameraClearance>.21);
  assert.equal(result.ai.length,5);
  assert.ok(result.ai.every(a=>a.longestOff<5&&a.progress>5000));
  assert.ok(result.overtakes>0);
  assert.equal(await page.locator('.result-table tbody tr').count(),6);
  await capture('results',page);
  log('3-lap journey and AI','Pass',{result});

  await action(page,'restart');
  await phase(page,'intro');
  assert.equal((await state(page)).time,0);
  const baseline=(await state(page)).audio.activeVoices;
  const before=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  const voiceCounts=[];
  for(let i=0;i<3;i++){
    await advance(page,11.3,true);
    await page.keyboard.press('Escape');
    const paused=await state(page);
    assert.equal(paused.phase,'pause');
    assert.equal((await advance(page,2)).time,paused.time);
    await action(page,'resume');
    assert.equal((await state(page)).phase,'race');
    await page.keyboard.press('Escape');
    await action(page,'restart');
    await phase(page,'intro');
    voiceCounts.push((await state(page)).audio.activeVoices);
    await page.keyboard.press('Escape');
    await action(page,'home');
    await phase(page,'home');
    assert.equal((await state(page)).audio.aiVoices,0);
    assert.ok((await state(page)).audio.activeVoices<=1);
    await beginRace(page);
  }
  const after=await page.evaluate(()=>performance.memory?.usedJSHeapSize??null);
  assert.ok(voiceCounts.every(v=>v===baseline));
  if(before!==null&&after!==null) assert.ok(after<=before+64*1024*1024,'heap growth is bounded over restarts');
  log('Pause, restart and menu cleanup','Pass',{baseline,voiceCounts,heapBefore:before,heapAfter:after});

  const outcomes=[];
  async function resetForSteering() {
    await advance(page,12.55,false);
    await page.keyboard.down('w');
    return advance(page,1.25,false);
  }
  for(const [key,sign] of [['d',1],['a',-1],['ArrowRight',1],['ArrowLeft',-1]]){
    const initial=await resetForSteering();
    await page.keyboard.down(key);
    const end=await advance(page,.6);
    await page.keyboard.up(key);
    await page.keyboard.up('w');
    const displacement=end.player.lateral-initial.player.lateral;
    const yaw=end.player.heading-initial.player.heading;
    assert.ok(sign*displacement>.35&&sign*yaw>.06,key+' steering direction');
    outcomes.push({key,displacement,yaw});
    await page.keyboard.press('Escape');
    await action(page,'restart');
    await phase(page,'intro');
  }
  const acceleration=[];
  for(const enable of [false,true]) {
    await resetForSteering();
    if(enable) await page.keyboard.down('Shift');
    const end=await advance(page,1);
    if(enable) await page.keyboard.up('Shift');
    await page.keyboard.up('w');
    acceleration.push({speed:end.player.speed,nitro:end.player.nitro});
    await page.keyboard.press('Escape');
    if(!enable){await action(page,'restart');await phase(page,'intro');}
  }
  assert.ok(acceleration[1].speed>acceleration[0].speed+.7&&acceleration[1].nitro<.90);
  log('Steering direction and nitro','Pass',{outcomes,acceleration});
  const cut=await page.evaluate(()=>raceGate.cutTest());
  assert.equal(cut.lap,0);
  assert.equal(cut.missed.valid,false);
  assert.ok(cut.missed.offSeconds>0&&cut.progress>cut.length);
  assert.deepEqual(cut.resets,[]);
  log('Sequential-checkpoint cut rejection','Pass',cut);

  await action(page,'home');
  await beginRace(page,{laps:6,period:'night'});
  await advance(page,9.1,true);
  const nightBoot=await page.evaluate(()=>raceGate.stats());
  assert.equal((await state(page)).period,'night');
  assert.ok(nightBoot.lights.streetlights>0&&nightBoot.lights.headlights>0);
  result=await advance(page,800,true);
  assert.equal(result.phase,'results');
  assert.equal(result.player.lap,6);
  assert.deepEqual(result.resets,[]);
  assert.ok(result.minClearance>0&&result.cameraClearance>.21);
  assert.ok(result.ai.every(a=>a.longestOff<5));
  log('6-lap journey, night start and world integrity','Pass',{result,nightBoot:nightBoot.lights});
  return nightBoot;
}
