import * as T from 'three';
import {Circuit,clamp,mod} from './track.js';
import {vehicle,drive,gradePilot,STEP} from './drive.js';
import {cameraRig} from './camera.js';
import {loadArt,lightRig,V} from './art.js';
import {createCar,numbers} from './cars.js';
import {baseWorld} from './world.js';
import {coastWorld} from './coast.js';
import {allZones} from './zones.js';
import {sceneAudit,photographSky} from './audit.js';
import {Race,checkpoint} from './race.js';
import {Sound,audioFiles} from './audio.js';
import {interfaceFor,instruments} from './interface.js';
import {tyreEffects} from './effects.js';
import {captureLap,saveBlob} from './recorder.js';
import {optics} from './optics.js';

const verify=new URLSearchParams(location.search).has('verify'),dev=verify||['localhost','127.0.0.1'].includes(location.hostname);
const canvas=document.querySelector('#scene'),hud=document.querySelector('#instruments'),ui=document.querySelector('#ui');
ui.innerHTML='<div class="loader"><div class="brand"><span class="brandmark"><i></i><i></i><i></i></span><b>ESTREITO</b><small>RACING</small></div><progress max="1" value="0"></progress><span>Preparando Costa Dourada</span></div>';
const progress=ui.querySelector('progress');let artProgress=0,audioProgress=0;
const showProgress=()=>{progress.value=.05+.66*artProgress+.13*audioProgress;};
const [data,art,rawAudio]=await Promise.all([fetch('./track.json').then(r=>r.json()),loadArt(v=>{artProgress=v;showProgress();}),audioFiles(v=>{audioProgress=v;showProgress();})]);
const track=new Circuit(data),sound=new Sound(rawAudio),options={car:0,color:0,laps:3,difficulty:'normal',quality:'high'};
try{if(!verify){const saved=JSON.parse(localStorage.getItem('estreito-settings')||'{}');Object.assign(options,saved.options||{});for(const k of ['masterVolume','effectsVolume','musicVolume','muted'])if(k in saved)sound[k]=saved[k];}}catch{}
const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:verify,powerPreference:'high-performance'}),scene=new T.Scene();
const camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.19,4500),lights=lightRig(scene,renderer,art),world=baseWorld(track,scene,art);
const coast=coastWorld(track,scene,art),district=allZones(track,scene,art,coast),effects=tyreEffects(scene,track);
const photographicFog=scene.fog,renderMotion=optics(renderer);
track.solids=track.objects.filter(o=>o.solid);track.collisionBins=new Map();
for(const o of track.objects.filter(o=>o.solid||o.kind==='tree'))for(const off of [-17,0,17]){const k=Math.floor(mod(o.s+off,track.length)/25);if(!track.collisionBins.has(k))track.collisionBins.set(k,[]);track.collisionBins.get(k).push(o);}
const worldCheck=dev?track.validateWorld():null;if(worldCheck&&!worldCheck.ok)throw Error(JSON.stringify(worldCheck));
const rig=cameraRig(track,camera),paintHUD=instruments(hud,track),race=new Race(track,options),keys=new Set(),garageCache=new Map();
let fleet=[],capture=null,fixture=null,hood=false,manual=false,auto=false,fixed=0,recording=null,recordPending=false,recordResult=null;
let last=performance.now(),acc=0,screenTime=0,lightTarget=V(),lastHudPage='',lastPad=[],menuCar=vehicle(track,-9.0,-1.97);
let rollingFrames=[],frameSerie=null,camHits=0,launching=false;
const getCar=(style,color)=>{const key=style+'-'+color;if(!garageCache.has(key)){const m=createCar(art,style,color,numbers[color]);m.root.visible=false;garageCache.set(key,m);scene.add(m.root);}return garageCache.get(key);};
function arrange(){for(const m of garageCache.values())m.root.visible=false;const cs=[options.color,...Array.from({length:6},(_,i)=>i).filter(i=>i!==options.color)];
 fleet=cs.map((c,i)=>getCar(i===0?options.car:i%2,c));}
arrange();progress.value=.91;
const app=interfaceFor(ui,track,options,sound,action);app.race=race;
const save=()=>{if(!verify)try{localStorage.setItem('estreito-settings',JSON.stringify({options,masterVolume:sound.masterVolume,effectsVolume:sound.effectsVolume,musicVolume:sound.musicVolume,muted:sound.muted}));}catch{}};
function resize(){const low=options.quality==='low';renderer.setPixelRatio(low?.70:Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight,false);
 hud.width=innerWidth;hud.height=innerHeight;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
 const size=low?1024:2048;if(lights.light.shadow.mapSize.x!==size){lights.light.shadow.mapSize.set(size,size);lights.light.shadow.map?.dispose();lights.light.shadow.map=null;}
}
onresize=resize;resize();
async function unlock(){try{await sound.unlock();}catch(e){console.error('Falha no áudio',e);throw e;}}
ui.addEventListener('pointerdown',()=>{if(!sound.ready)void unlock();},{once:true});
async function action(name){
 if(name==='volume'||name.startsWith('change-')){if(name==='change-quality')resize();if(name==='change-car'||name==='change-color')arrange();save();return;}
 if(name==='garage'||name==='setup'){app.show(name);screenTime=0;void unlock();return;}
 if(name==='start'||name==='restart'){
   if(launching)return;launching=true;try{const audioReady=unlock();if(navigator.userActivation?.hasBeenActive)await audioReady;
     fixed=0;race.reset(options);arrange();if(sound.prepared)sound.start(options.car);else audioReady.then(()=>{if(app.page==='race')sound.start(options.car);});
     effects.clear();rig.reset();app.show('race');hood=false;acc=0;screenTime=0;camHits=0;last=performance.now();}finally{launching=false;}return;
 }
 if(name==='pause'&&app.page==='race'){race.pause();app.show('paused');sound.update(race);keys.clear();return;}
 if(name==='resume'&&app.page==='paused'){race.resume();app.show('race');acc=0;last=performance.now();return;}
 if(name==='menu'){sound.stop();effects.clear();keys.clear();fixed=0;app.show('menu');screenTime=0;rig.reset();return;}
}
addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;
 if(e.code==='Escape'||e.code==='KeyP'){app.escape();return;}if(e.code==='KeyC'&&app.page==='race'){hood=!hood;rig.reset();return;}
 if(app.page!=='race'){if(e.code==='Enter'&&!e.target.closest?.('button')){e.preventDefault();app.confirm();}if(e.code==='ArrowDown'||e.code==='ArrowRight')app.move(1);if(e.code==='ArrowUp'||e.code==='ArrowLeft')app.move(-1);}
});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();if(app.page==='race'&&!verify)action('pause');});
function controls(){
 const pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean);let steer=+(keys.has('ArrowRight')||keys.has('KeyD'))-+(keys.has('ArrowLeft')||keys.has('KeyA'));
 let gas=+(keys.has('ArrowUp')||keys.has('KeyW')),brake=+(keys.has('ArrowDown')||keys.has('KeyS'));
 if(pad){const now=pad.buttons.map(b=>b.pressed),hit=n=>now[n]&&!lastPad[n];if(hit(9))app.escape();if(hit(3)&&app.page==='race'){hood=!hood;rig.reset();}
   if(app.page!=='race'){if(hit(0))app.confirm();if(hit(1))app.escape();if(hit(12)||hit(14))app.move(-1);if(hit(13)||hit(15))app.move(1);}
   lastPad=now;if(Math.abs(pad.axes[0]||0)>.09)steer=pad.axes[0];gas=Math.max(gas,pad.buttons[7]?.value||0);brake=Math.max(brake,pad.buttons[6]?.value||0);}
 return {gas,brake,steer};
}
function projection(fov,near=.19){if(camera.fov!==fov||camera.near!==near){camera.fov=fov;camera.near=near;camera.updateProjectionMatrix();}}
function lookFrom(eye,target,fov=42){camera.position.copy(eye);const ground=track.terrain.cast(eye.x,eye.z);if(Number.isFinite(ground))camera.position.y=Math.max(camera.position.y,ground+.23);camera.up.set(0,1,0);camera.lookAt(target);projection(fov);}
function showroom(){
 const c=menuCar,menu=app.page==='menu',garage=app.page==='garage',p=track.point(c.s,c.l);p.y=c.y;fleet.forEach((g,i)=>g.root.visible=i===0);fleet[0].update(c,track);
 const a=garage?1.00+screenTime*.135:menu?.92+Math.sin(screenTime*.055)*.042:-.83;
 const dist=menu?6.6:garage?6.25:7.05,off=V(Math.sin(a)*dist,menu?1.25:1.48,Math.cos(a)*dist),right=V(Math.cos(a),0,-Math.sin(a));
 const focus=p.clone().addScaledVector(right,-(menu?1.37:1.59));focus.y+=menu?.76:.71;
 lookFrom(p.clone().add(off),focus,menu?34:36);lightTarget.copy(p);
}
function poseCars(cars){const player=cars[0];for(let i=0;i<fleet.length;i++){
 const car=cars[i],g=fleet[i];g.root.visible=i===0||Math.min(mod(car.s-player.s,track.length),mod(player.s-car.s,track.length))<285;
 if(g.root.visible)g.update(car,track);
 }lightTarget.copy(fleet[0].root.position);}
function gridCam(){
 const c=race.cars[0],p=track.point(c.s,c.l),a=.82-.54*(race.intro/4.9),f=track.frame(c.s);
 const eye=p.clone().addScaledVector(V(f.rx,0,f.rz),-Math.cos(a)*5.25).addScaledVector(V(f.tx,0,f.tz),Math.sin(a)*5.25);eye.y+=1.08+race.intro*.062;
 lookFrom(eye,p.clone().add(V(0,.60,0)),40);
}
function driveCam(dt,inspect=false){const c=race.cars[0];if(race.phase==='grid')gridCam();else{rig.chase(c,dt,hood);
 if(inspect){const eye=track.point(c.s,c.l,1.05),p=camera.position;if(p.y<track.terrain.cast(p.x,p.z)+.10||!rig.clear(eye,p,true))camHits++;}}}
function simulation(dt,input,testing=false){
 acc+=dt;while(acc>=STEP){race.step(auto&&verify?race.testPilot():input,dev);acc-=STEP;}
 if(race.phase==='results'&&app.page==='race'){app.show('results');sound.update(race);sound.tone(880,.25,.13);}
}
function quality(low){options.quality=low?'low':'high';resize();}
function renderNow(low=options.quality==='low'){
 coast.sets.cull(camera,low,fixed===12);lights.update(camera,lightTarget);coast.ocean.update(fixed?19:app.page==='race'?race.time:screenTime);
 const running=fixed?([1,5,6,8,9].includes(fixed)?fixture:null):(app.page==='race'&&race.phase==='race'?race:null);
 if(!low&&running&&running.cars[0].speed>4){const c=running.cars[0];renderMotion(scene,camera,fleet,c,track.frame(c.s),hood&&!fixed);}else renderer.render(scene,camera);
}
function tick(now){
 const elapsed=Math.max(.0001,(now-last)/1000);last=now;rollingFrames.push(elapsed);if(rollingFrames.length>120)rollingFrames.shift();if(frameSerie)frameSerie.push(elapsed);
 const dt=Math.min(.125,elapsed),input=controls();screenTime+=dt;
 if(!fixed){
   if(['menu','garage','setup'].includes(app.page)){showroom();paintHUD(race,false);}
   else{
     if(app.page==='race'&&!manual)simulation(dt,input);
     poseCars(race.cars);if(app.page==='race'){driveCam(dt,dev);effects.update(race.cars,dt);}sound.update(race);paintHUD(race,app.page==='race');
   }
   renderNow();
   if(recordPending&&race.phase==='race'&&race.cars[0].progress.started){recordPending=false;recording=captureLap(canvas,hud,sound);capture={start:race.time,startLog:race.log.length,startLap:race.cars[0].progress.laps};}
   if(recording){recording.draw();if(race.cars[0].progress.laps>capture.startLap){const r=recording;recording=null;const lapTime=race.time-capture.start,events=race.log.slice(capture.startLog).map(e=>({...e,recordTime:e.t-capture.start}));
     r.finish().then(out=>{recordResult={...out,events,lapTime};});}}
 }else if(fixed>0){renderNow();}
 requestAnimationFrame(tick);
}
arrange();for(const g of fleet)g.root.visible=true;for(const c of race.cars)fleet[c.driver].update(c,track);
showroom();for(const c of fleet)c.root.visible=true;await renderer.compileAsync(scene,camera);renderMotion(scene,camera,fleet,menuCar,track.frame(menuCar.s),false);progress.value=1;app.show('menu');showroom();renderNow();last=performance.now();requestAnimationFrame(tick);
if(verify){
 const cache=new Map();
 function recordedState(n){
   const d= n===1?74:n===2?-17:n===3?154:n===4?track.zones[1].s+452:n===5||n===10?district.plaza-66:n===6?track.zones[3].s+713:n===7?track.bridge.start-13:n===9?track.zones[1].s+154:0;
   const key=n===8?'duel':d;if(cache.has(key))return cache.get(key);
   const sim=new Race(track,{...options,laps:3,difficulty:'normal'});sim.phase='race';
   for(let i=0;i<25000;i++){const c=sim.cars[0];if(n===8){const close=sim.cars.slice(1).filter(o=>Math.abs(o.distance-c.distance)<1.75);
     if(c.distance>600&&close.some(o=>o.l<c.l-1.65)&&close.some(o=>o.l>c.l+1.65))break;
    }else if(c.distance>=d)break;sim.step(n===8?gradePilot(track,c,0,.91):sim.testPilot(),true);}
   cache.set(key,sim);return sim;
 }
 function view(n){
   fixed=n;quality(n===10);effects.clear();ui.style.visibility='hidden';rig.reset();camera.near=.19;camera.up.set(0,1,0);camera.updateProjectionMatrix();scene.fog=n===12?null:photographicFog;
   const sim=recordedState(n),c=sim.cars[0];fixture=sim;poseCars(sim.cars);const p=track.point(c.s,c.l);
   if(n===12){camera.position.set(240,1370,-37);camera.up.set(0,0,-1);camera.lookAt(240,0,-37);projection(52,500);}
   else if(n===2){const f=track.frame(c.s);const eye=p.clone().addScaledVector(V(f.rx,0,f.rz),-3.55).addScaledVector(V(f.tx,0,f.tz),4.23).add(V(0,.96,0));lookFrom(eye,p.clone().add(V(0,.55,0)),38);}
   else if(n===3){const f=track.frame(154),x=track.shoreX(f.z);lookFrom(V(x+6.9,1.72,f.z+5.7),V(x-3.6,.43,f.z-3.8),61);lightTarget.set(x,0,f.z);}
   else if(n===4){lookFrom(p.clone().add(V(13.2,7.6,7.5)),p.clone().add(V(-7.0,-.44,-2.9)),54);}
   else if(n===7){const eye=track.point(track.bridge.start-5.5,18.7,.83),target=track.point(track.bridge.start+4.7,0,-.75);lookFrom(eye,target,66);}
   else if(n===8){const eye=track.point(c.s+8.55,c.l+2.10,1.12);lookFrom(eye,p.clone().add(V(0,.69,0)),53);}
   else if(n===9){const f=track.frame(c.s),side=Math.sign(f.curve)||1;const eye=track.point(c.s-3.2,side*(f.width/2-.55),.40),target=track.point(c.s+5.5,side*(f.width/2-.8),.18);lookFrom(eye,target,62);}
   else if(n===11){const house=track.objects.find(o=>o.kind==='house'&&o.l>0&&o.variant===0);const parking=vehicle(track,house.s,house.l-house.d/2-1.57);
     fleet.forEach((g,i)=>g.root.visible=i===0);fleet[0].update(parking,track);const f=track.frame(house.s),car=track.point(parking.s,parking.l);car.y=parking.y;
     const eye=car.clone().addScaledVector(V(f.rx,0,f.rz),-7.8).addScaledVector(V(f.tx,0,f.tz),-2.3).add(V(0,1.46,0));
     lookFrom(eye,car.clone().addScaledVector(V(f.rx,0,f.rz),1.9).add(V(0,1.08,0)),43);lightTarget.copy(car);}
   else{rig.chase(c,0,false,true);}
   renderNow();paintHUD(sim,![2,11,12].includes(n));if(n===12)drawMap();return {time:sim.time,distance:c.distance,positions:sim.cars.map(o=>({s:o.s,l:o.l})),low:n===10};
 }
 function drawMap(){const g=hud.getContext('2d'),w=hud.width,h=hud.height,project=p=>track.point(p.s,0,.1).project(camera);
   const colors=['#f6c274','#d78053','#ede0bf','#99cbae'];for(const [i,z] of track.zones.entries()){g.beginPath();for(let s=z.s;s<z.end+2.3;s+=2.3){const a=project({s:Math.min(s,z.end)}),x=(a.x+1)*w/2,y=(1-a.y)*h/2;if(s===z.s)g.moveTo(x,y);else g.lineTo(x,y);}g.strokeStyle=colors[i];g.lineWidth=3.5;g.stroke();}
   g.fillStyle='rgba(20,32,30,.82)';g.fillRect(38,h-183,246,145);g.fillStyle='#f2e8d4';g.font='bold 22px Arial';g.fillText('Costa Dourada',55,h-148);track.zones.forEach((z,i)=>{g.fillStyle=colors[i];g.fillRect(55,h-129+i*21,16,3);g.fillStyle='#efe8d5';g.font='14px Arial';g.fillText(z.name,82,h-124+i*21);});}
 function sweep(s,low){fixed=101;scene.fog=photographicFog;ui.style.visibility='hidden';paintHUD(race,false);const c=vehicle(track,s,0);fleet.forEach((g,i)=>g.root.visible=i===0);fleet[0].update(c,track);lightTarget.copy(fleet[0].root.position);camera.near=.19;camera.updateProjectionMatrix();rig.chase(c,0,false,true);renderNow(low);return canvas.toDataURL('image/jpeg',.91);}
 function resumeView(){fixed=0;scene.fog=photographicFog;ui.style.visibility='';quality(false);rig.reset();app.show('menu');}
 function stepMany(seconds){
   manual=true;const until=Math.min(seconds,900);let steps=0;for(let tm=0;tm<until&&app.page==='race';tm+=1/30){
     simulation(1/30,race.testPilot(),true);driveCam(1/30,true);steps++;
   }poseCars(race.cars);paintHUD(race,app.page==='race');renderNow();sound.update(race);return {steps,phase:race.phase};
 }
 function summary(){return {phase:race.phase,time:race.time,position:race.position(),passes:race.passes,camHits,laps:race.cars[0].progress.laps,vehicles:race.cars.map(c=>({driver:c.driver,laps:c.progress.laps,lapTimes:c.progress.times,maxIdle:c.maxIdle,maxOff:c.maxOff,wheelGap:c.maxWheelGap,bodyClearance:c.minClearance})),events:race.log,voices:sound.nodes.length,initialVoices:sound.initialVoices,maxAI:sound.maxAI,results:race.results()};}
 window.bench={validate:()=>track.validateWorld(),stats:()=>({...sceneAudit(scene,track,fleet),engineAudioBuffers:sound.layers?.flat().filter(l=>l.src.buffer instanceof AudioBuffer).map(l=>({key:l.key,duration:l.src.buffer.duration}))||[]}),view,map:()=>view(12),sweep,sky:()=>photographSky(renderer,scene,camera,lights.dome,hud),resetView:resumeView,quality,
  perf:low=>{fixed=0;manual=false;auto=true;quality(low);ui.style.visibility='';race.reset(options);race.phase='race';for(const c of race.cars){c.distance+=track.zones[2].s+104;c.s=mod(c.distance,track.length);c.speed=26;c.y=track.surface(c.s,c.l);}app.show('race');rig.reset();poseCars(race.cars);driveCam(0);},
  manual:on=>{manual=on;auto=on;},advance:stepMany,summary,controls:()=>({hood,phase:race.phase,screen:app.page}),record:()=>{recordPending=true;recordResult=null;auto=true;manual=false;},
  recordReady:()=>!!recordResult,recordMeta:()=>{const {audio,video,...meta}=recordResult;return {...meta,videoBytes:video.size,audioBytes:audio.size};},download:kind=>saveBlob(recordResult[kind],kind==='audio'?'audio-volta.wav':'volta.webm'),
  gpu:()=>{const gl=renderer.getContext(),d=gl.getExtension('WEBGL_debug_renderer_info');return d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);},
  measure:async(count=40)=>{frameSerie=[];for(let i=0;i<count+1;i++)await new Promise(requestAnimationFrame);const ds=frameSerie.slice(1);frameSerie=null;return ds;},
  cut:()=>{const c=vehicle(track,0);c.progress={next:0,laps:0,started:false,lapStart:0,best:Infinity,times:[]};const first=checkpoint(track,c,-.12,.18,.1);
    const jump=checkpoint(track,c,1,track.length+.18,1);const lap=checkpoint(track,c,track.length-.12,track.length+.18,2);return {first,jump,lap,laps:c.progress.laps,expected:c.progress.next};},
  driveLap:()=>{const c=vehicle(track);let elapsed=0;while(c.distance<track.length&&elapsed<240){drive(track,c,gradePilot(track,c),STEP,true);elapsed+=STEP;}return {elapsed,distance:c.distance,length:track.length,events:c.events.filter(e=>e.type!=='gear'),wheelGap:c.maxWheelGap,bodyClearance:c.minClearance};}
 };
}
