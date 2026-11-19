import * as T from 'three';
import config from '../track.json';
import { angle, Course, mix, shoreline, validateWorld } from './course.js';
import { TrackCamera } from './camera.js';
import { carStats, LIVERIES, makeCar, poseCar } from './car.js';
import { roadAndGround, roadMark } from './geometry.js';
import { TextureBank } from './materials.js';
import { Pipeline } from './pipeline.js';
import { FIXED_STEP, Race, readControls, sampleWheelPose } from './simulation.js';
import { makeProps } from './scenery.js';
import { Flora } from './flora.js';
import { makeSea, trackMaterials } from './surfaces.js';
import { buildWaterfront, installLampPool } from './coast.js';
import { buildVillage } from './village.js';
import { buildUplands } from './uplands.js';
import { Interface } from './interface.js';
import { RaceAudio } from './audio.js';
import { TrackEffects } from './effects.js';
import './style.css';

const query = new URLSearchParams(location.search);
const verify = query.has('verify');
const root = document.querySelector('#game');
const course = new Course(config);
let check = validateWorld(course);
if (check.errors.length) throw new Error(check.errors.join('\n'));
const defaults={model:0,livery:0,laps:3,difficulty:'normal',quality:'high',period:'golden',master:.84,sfx:.87,music:.38};
const settings={...defaults};
if (!verify) {
  try {
    const saved=JSON.parse(localStorage.getItem('corsa-settings-v1'));
    for(const [key,def] of Object.entries(defaults)) {
      if(typeof saved?.[key]===typeof def) settings[key]=saved[key];
    }
  } catch { /* Storage can be disabled for a local server. */ }
}
const audio=new RaceAudio();
Object.assign(audio.mix,{master:settings.master,sfx:settings.sfx,music:settings.music});
const ui=new Interface(root,course,settings,{action,option,volume});
await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(62, innerWidth / innerHeight, .12, 7800);
const pipeline = new Pipeline(root, scene, camera, innerWidth, innerHeight);
const cameras = new TrackCamera(camera, course);
const bank = new TextureBank(pipeline.renderer,(loaded,total)=>{
  ui.showLoading(20+Math.round(52*loaded/total),`Loading local assets · ${loaded}/${total}`);
});
const loaded = new Promise((resolve,reject) => {
  bank.manager.onLoad = resolve;
  bank.manager.onError = path => reject(new Error('Could not read ' + path));
});
const environment = pipeline.loadEnvironment(bank.manager);

const materials = trackMaterials(bank);
const terrain = roadAndGround(course,materials);
const props = makeProps(bank);
const flora = new Flora(course,bank);
const coast = buildWaterfront(course,props,flora);
const water = makeSea(bank,coast.waterRocks);
const village = buildVillage(course,props,flora,bank);
const uplands = buildUplands(course,props,flora);
const lighting = installLampPool(scene,[...coast.lamps,...village.lamps],props,8);
scene.add(terrain.group,water.sea,coast.group,coast.plants,village.root,village.vegetation,
  uplands.cliffs,uplands.crossing,uplands.woods,uplands.far);
const line = props.painting;
for (const side of [-1,1]) {
  scene.add(roadMark(course,0,course.length,p=>[side*(p.half-.17)-.049,side*(p.half-.17)+.049],null,line));
}

let race = new Race(course,settings);
const cars = race.cars.map((c, i) => makeCar(bank, c.model, c.livery, i < 2));
cars.forEach(car => scene.add(car.chassis));
pipeline.register(scene);
const effects=new TrackEffects(scene,config.seed);

let mode = 'chase', time = 0, accumulator = 0, visualTime=0;
let phase='home', phaseClock=0, resumePhase='race', countdownNumber=0, live= !verify;
let pilot=false, frameTimings=null, audioRecord=null, startPending=false;
let lastHud=-1;
const history=[];
const togglePad={ camera:false, pause:false };
const keys = new Set();
const warmed = new Set();

function persist() {
  if (!verify) {
    try { localStorage.setItem('corsa-settings-v1',JSON.stringify(settings)); } catch { /* Non-persistent mode. */ }
  }
}

function setPhase(next,data={}) {
  phase=next;
  ui.screen(phase,data);
  lastHud=-1;
}

function resetRace(configuration) {
  race=new Race(course,configuration);
  cameras.ready=false;
  cameras.clearance=Infinity;
  effects.clear();
  for(const [i,state] of race.cars.entries()) {
    if(cars[i].model===state.model&&cars[i].livery===state.livery) continue;
    pipeline.release(cars[i].chassis);
    cars[i]=makeCar(bank,state.model,state.livery,i<2);
    scene.add(cars[i].chassis);
    pipeline.register(cars[i].chassis);
  }
}

function volume(key,value) {
  settings[key]=value;
  audio.setVolume(key,value);
  persist();
}

function option(key,value) {
  settings[key]=['model','livery','laps'].includes(key)?Number(value):value;
  if(key==='period') pipeline.setPeriod(settings.period);
  if(key==='quality') pipeline.setQuality(settings.quality);
  if(key==='livery'||key==='model') resetRace(settings);
  audio.chime('navigate');
  ui.screen(phase);
  const selected=ui.menu.querySelector(`[data-option="${key}"][data-value="${value}"]`);
  selected?.focus({preventScroll:true});
  persist();
  if(verify) redraw();
}

async function warmAudio() {
  try { await audio.unlock(); }
  catch(error) {
    ui.showLoading(100,'Audio load failed. '+error.message);
    throw error;
  }
}

async function startRace() {
  if(startPending) return;
  startPending=true;
  try {
    await warmAudio();
    pipeline.setQuality(settings.quality);
    pipeline.setPeriod(settings.period);
    audio.menu(false);
    resetRace(settings);
    mode='chase';
    keys.clear();phaseClock=0;countdownNumber=0;
    const preset=settings.quality+'/'+settings.period;
    if(!warmed.has(preset)){
      ui.showLoading(94,'Preparing race lighting');
      redraw();
      await pipeline.precompile();
      warmed.add(preset);
      ui.loading.hidden=true;
    }
    audio.start(race.cars,settings.period);
    setPhase('intro');
    ui.count('Cala di Vetra',true);
    if(verify) redraw();
  } finally {
    startPending=false;
  }
}

function pauseRace() {
  if (phase==='pause') {
    audio.pause(false);
    setPhase(resumePhase);
  } else if (['race','intro','countdown'].includes(phase)) {
    resumePhase=phase;
    keys.clear();
    audio.pause(true);
    setPhase('pause');
  }
}

async function action(id) {
  if(id==='start'||id==='restart') {
    audio.chime('confirm');
    await startRace();
    return;
  }
  if(id==='garage' && !audio.loaded) {
    await warmAudio();
  }
  audio.chime(id==='resume'||id==='garage'||id==='setup'?'confirm':'navigate');
  if(['home','garage','setup'].includes(id)){
    if(id==='home'){
      history.length=0;
      audio.stop();
      resetRace(settings);
      mode='chase';
    }
    audio.menu(true);
    setPhase(id);
  } else if (id==='settings'||id==='controls') {
    history.push(phase);
    setPhase(id);
  } else if(id==='back') {
    setPhase(history.pop()??'home');
  } else if(id==='resume') {
    pauseRace();
  } else if(id==='model-next'||id==='model-previous') {
    option('model',String(1-settings.model));
    ui.menu.querySelector('[data-action='+id+']')?.focus({preventScroll:true});
  }
  if(verify) redraw();
}

function resultRows() {
  const trackDistance=course.length*race.laps;
  return race.cars.map((c,i)=>{
    const remain=Math.max(0,trackDistance-c.progress);
    const pace=c.bestLap<Infinity?course.length/c.bestLap:Math.max(16,c.progress/Math.max(1,race.time));
    const name=['You','A. Marino','L. Costa','M. Fiora','N. Riva','S. Greco'][i];
    return {id:i,name,number:LIVERIES[c.livery].number,time:c.finish??(race.time+remain/pace),approx:c.finish===null};
  }).sort((a,b)=>a.time-b.time);
}

function readPose(state,fraction) {
  if(!state.prior||!Number.isFinite(fraction)) return state;
  const prior=state.prior;
  return {
    ...state,
    x:mix(prior.x,state.x,fraction),y:mix(prior.y,state.y,fraction),z:mix(prior.z,state.z,fraction),
    heading:prior.heading+angle(state.heading-prior.heading)*fraction,
    pitch:mix(prior.pitch,state.pitch,fraction),roll:mix(prior.roll,state.roll,fraction),
    steer:mix(prior.steer,state.steer,fraction),spin:prior.spin+angle(state.spin-prior.spin)*fraction,
    wheels:state.wheels.map((wheel,i)=>mix(prior.wheels[i],wheel,fraction)),
  };
}

function framePreview() {
  const orbit=phase==='home'?.29+Math.sin(visualTime*.24)*.18:visualTime*.235;
  cameras.hero(cars[0],orbit);
  const dir=camera.getWorldDirection(new T.Vector3());
  const right=dir.clone().cross(camera.up).normalize();
  const point=cars[0].chassis.localToWorld(new T.Vector3(0,.66,.09)).addScaledVector(right,-2.35);
  camera.lookAt(point);
  cameras.optics(phase==='home'?51:45);
}

function redraw(dt = 0) {
  const p = race.player;
  const night=pipeline.period==='night';
  const fraction=dt>0&&phase==='race'?Math.min(1,accumulator/FIXED_STEP):NaN;
  const renderPoses=race.cars.map(state=>readPose(state,fraction));
  renderPoses.forEach((state, i) => poseCar(cars[i], state, night, Math.hypot(state.x-p.x,state.z-p.z) < 75));
  uplands.far.visible=pipeline.quality==='high';
  village.windows.forEach((mat,i)=>{ mat.emissiveIntensity=night ? [.81,.43,.17,1.27][i] : 0; });
  if (['home','garage','setup'].includes(phase)||(['settings','controls'].includes(phase)&&history[0]!=='pause')) framePreview();
  else if (phase==='intro') {
    const orbit=-1.2+phaseClock*.38;
    cameras.hero(cars[0],orbit);
    cameras.optics(54);
    camera.position.y+=1.3*Math.max(0,1-phaseClock/5);
    camera.lookAt(cars[0].chassis.localToWorld(new T.Vector3(0,.43,-.38)));
  }
  else if (mode === 'hero' || mode === 'second-hero') cameras.hero(cars[mode === 'hero' ? 0 : 1]);
  else if (mode === 'overview') cameras.overview();
  else if (mode === 'shore') {
    const x=course.at(318).x;
    camera.up.set(0,1,0);
    camera.position.set(x-29,1.79,shoreline(x-29)+9.3);
    camera.lookAt(x+22,2.4,shoreline(x+22)-2.9);
    cameras.optics(46,.09);
  } else if (mode === 'surface') {
    const p=course.at(322,5.06), ahead=course.at(344,5.18);
    camera.up.set(0,1,0);
    camera.position.set(p.x,p.y+.475,p.z);
    camera.lookAt(ahead.x,ahead.y+.42,ahead.z);
    cameras.optics(54,.09);
  } else if (mode === 'bridge') {
    const p=course.at(uplands.bridge.from+5,19.75), next=course.at(uplands.bridge.from+20,0.5);
    camera.up.set(0,1,0);
    camera.position.set(p.x,Math.max(course.surface(p.x,p.z).y+2.6,p.y-2.35),p.z);
    camera.lookAt(next.x,next.y-.66,next.z);
    cameras.optics(58,.091);
  } else if (mode === 'cliff') {
    const at=course.at(p.s-7.0,-2.9), next=course.at(p.s+15,6.4);
    camera.up.set(0,1,0);
    camera.position.set(at.x,at.y+4.16,at.z);
    camera.lookAt(next.x,next.y+.42,next.z);
    cameras.optics(56,.123);
  } else if (mode === 'village') {
    cameras.set('chase',cars[0],p,0);
    const toward=course.at(p.s+24,5.4);
    const church=village.landmarks[0];
    const landmark=new T.Vector3(church.x,church.y-4.9,church.z);
    const aim=new T.Vector3(toward.x,toward.y+.9,toward.z).lerp(landmark,.27);
    camera.position.y+=.67;
    camera.lookAt(aim);
    cameras.optics(62,.12);
  } else if (mode === 'pack') {
    cameras.hero(cars[0],-.37);
    cameras.optics(58,.10);
    camera.position.y+=.44;
    camera.lookAt(cars[0].chassis.localToWorld(new T.Vector3(-.94,.54,-1.22)));
  } else if (mode === 'scale') {
    const unit=village.streetfront.find(p=>p.side===1&&p.s>course.zones[2].at+70);
    const at=course.at(unit.s,unit.side*(course.at(unit.s).half+.59));
    const stand=new T.Vector3(at.x,at.y,at.z);
    const parked={...p,x:stand.x,z:stand.z,heading:unit.heading,speed:0,steer:0,accel:0,yawRate:0,pitchTransfer:0,rollTransfer:0};
    sampleWheelPose(course,parked,course.nearest(stand.x,stand.z),1);
    poseCar(cars[0],parked,night);
    camera.up.set(0,1,0);
    camera.position.copy(stand).addScaledVector(unit.front,5.6).add(new T.Vector3(-1.8,1.69,2.2));
    camera.position.y=Math.max(course.surface(camera.position.x,camera.position.z).y+1.7,parked.y+1.95);
    camera.lookAt(stand.x*.52+unit.door.x*.48,parked.y+1.04,stand.z*.52+unit.door.z*.48);
    cameras.optics(53,.08);
  }
  else cameras.set(mode, cars[0], renderPoses[0], dt);
  if(!ui.hud.hidden && (lastHud<0 || dt===0 || visualTime-lastHud>1/28)){
    ui.hudFrame(race);
    lastHud=visualTime;
  }
  const seconds=verify&&!live?race.time:visualTime;
  water.update(seconds,pipeline);
  flora.update(seconds,pipeline.period);
  lighting.update(camera,night);
  if(phase==='race'&&dt>0) {
    effects.update(race,dt,night,pipeline.renderer.domElement.height);
    audio.update(race,dt,pipeline.period);
  }
  pipeline.render(p.speed,p.boosting,mode === 'overview');
}

async function boot() {
  await Promise.all([loaded, environment]);
  check = validateWorld(course);
  if (check.errors.length) throw new Error(check.errors.join('\n'));
  ui.showLoading(77,'Preparing graphics shaders');
  pipeline.setQuality(settings.quality);
  setPhase('home');
  for(const period of ['golden','night']){
    pipeline.setPeriod(period);
    redraw();
    await pipeline.precompile();
    warmed.add(settings.quality+'/'+period);
  }
  pipeline.setPeriod(settings.period);
  redraw();
  ui.loading.hidden=true;
  window.addEventListener('resize', () => {
    pipeline.resize(innerWidth, innerHeight);
    redraw();
  });
  if (verify) {
    window.raceGate = {
      shot(name, night = false, quality = 'high') {
        pipeline.setPeriod(night ? 'night' : 'golden');
        pipeline.setQuality(quality);
        resetRace(defaults);
        const s={
          cockpit:course.zones[1].at+147, waterfront:178, shore:306, surface:331,
          cliff:course.zones[1].at+450, village:village.square-21, woods:course.zones[3].at+269,
          bridge:uplands.bridge.from+14.3, pack:217, scale:course.zones[2].at+77,
        }[name];
        if(s!==undefined) while (race.player.s < s && race.time < 125) race.step(undefined,true);
        mode = ['waterfront','woods'].includes(name) ? 'chase' : name;
        setPhase('race');
        if(['hero','second-hero','scale','overview'].includes(name)) ui.hud.hidden=true;
        redraw();
        return { steer: race.player.steer, wheel:cars[0].wheel.rotation.z, period:pipeline.period };
      },
      stats: () => {
        const units=village.root.children.map(node=>node.userData.unit).filter(Boolean);
        const active=(obj)=>obj.isSpotLight && obj.intensity > 0 && obj.visible;
        const primary=[...pipeline.materials].filter(m=>m.userData.primary).map(m=>{
          const describe=t=>t?{ file:t.userData.file??null,width:t.image?.width??null,height:t.image?.height??null,
            procedural:Boolean(t.isCanvasTexture||t.isDataTexture),anisotropy:t.anisotropy }:null;
          return {name:m.name,kind:m.userData.primary,albedo:describe(m.map),normal:describe(m.normalMap),
            layers:m.userData.layers?.map(l=>({layer:l.layer,albedo:describe(l.albedo),normal:describe(l.normal)}))};
        });
        return {
          world:check, pipeline:pipeline.stats(), cars:cars.slice(0,2).map(carStats),
          plants:flora.counts, coastalPlants:flora.counts, coastProps:coast.propCount, rockFoamSources:coast.waterRocks.length,
          road:{ anisotropy:materials.road.map.anisotropy, resolution:materials.road.map.image.width },
          triplanar:Boolean(materials.terrain.userData.triplanar),
          foliageTransmission:flora.transmission.value,
          village:{ units:units.length,styles:[...new Set(units.map(u=>u.archetype))],tiers:[...new Set(units.map(u=>u.tier))],alleys:village.alleys.length },
          lights:{ streetlights:lighting.pool.filter(active).length, headlights:cars.filter(c=>active(c.lamp)).length },
          bridge:uplands.bridge, cliffProps:uplands.cliffProps, woodsProps:uplands.woodsProps, primary, audio:audio.stats(),
        };
      },
      state,
      sweep(meters,quality) {
        pipeline.setQuality(quality);pipeline.setPeriod('golden');
        const p=race.player, at=course.at(meters);
        Object.assign(p,{x:at.x,z:at.z,s:at.s,y:at.y,heading:at.heading,pitch:0,roll:0,steer:0,speed:22,boosting:false});
        sampleWheelPose(course,p,course.nearest(p.x,p.z),1);
        mode='chase';setPhase('race');redraw();
      },
      advance(seconds,autopilot=false,draw=true) {
        const frames=Math.ceil(seconds/FIXED_STEP);
        for(let i=0;i<frames;i++){
          tick(autopilot);
          if(i%40===0&&phase==='race'){
            poseCar(cars[0],race.player,pipeline.period==='night');
            cameras.set(mode,cars[0],race.player);
          }
          if(phase==='results') break;
        }
        if(draw) redraw();
        return state();
      },
      cutTest() {
        const test=new Race(course,{laps:3,opponents:0});
        const p=test.player;
        let missed=null;
        const first=course.checkpoints[0];
        while(test.time<160 && p.progress<course.length+10){
          p.laneTarget=p.progress>first-50 && p.progress<first+2.2 ? -9.8 : -1.7;
          test.step(undefined,true);
          if(!missed&&p.progress>=first){
            missed={valid:p.validLap,offset:p.lateral,offSeconds:p.offTime};
          }
        }
        return {lap:p.lap,missed,progress:p.progress,length:course.length,maxOffSeconds:p.longestOff,resets:test.resets};
      },
      async startRecording() {
        if(audioRecord) throw new Error('Recording is already active');
        audioRecord=await audio.record(pipeline.renderer.domElement);
        pilot=driveForCapture;
        live=true;time=performance.now();
      },
      async endRecording() {
        live=false;pilot=false;
        const result=await audioRecord();
        audioRecord=null;
        const link=(blob)=>({url:URL.createObjectURL(blob),bytes:blob.size});
        return {video:link(result.video),audio:link(result.wav),peak:result.peak,sampleRate:result.sampleRate,events:race.events, markers:result.markers,
          raceTime:race.time,lap:race.player.lastLap,lapStart:race.events.find(e=>e.type==='lap'&&e.car===0)?.time-race.player.lastLap};
      },
      async measure(duration) {
        frameTimings=[];
        mode='chase';
        pilot=true;
        live=true;time=performance.now();
        await new Promise(resolve=>setTimeout(resolve,duration));
        live=false;pilot=false;
        const output=frameTimings;
        frameTimings=null;
        return output;
      },
    };
  }
  time=performance.now();
  requestAnimationFrame(frame);
  document.documentElement.dataset.ready = 'true';
}

function driveForCapture(r,current) {
  const p=r.player;
  if(p.progress>16&&p.progress<101) return {...current,throttle:1,boost:true};
  if(p.progress>159&&p.progress<172) return {...current,steer:.69,throttle:.63,brake:.14};
  if(p.progress>172&&p.progress<180&&p.lateral<4.8) return {...current,steer:.36,throttle:.62};
  return current;
}

function state() {
  const p=race.player;
  return {
    phase,mode,period:pipeline.period,quality:pipeline.quality,time:race.time,laps:race.laps,
    player:{lap:p.lap,lastLap:p.lastLap,bestLap:p.bestLap,speed:p.speed,rpm:p.rpm,steer:p.steer,
      wheel:cars[0].wheel.rotation.z,nitro:p.nitro,lateral:p.lateral,heading:angle(p.heading-course.at(p.s).heading),
      progress:p.progress,s:p.s,x:p.x,z:p.z,finish:p.finish,validLap:p.validLap},
    ai:race.cars.slice(1).map(c=>({id:c.id,lap:c.lap,progress:c.progress,longestOff:c.longestOff})),
    resets:race.resets,overtakes:race.overtakes,events:race.events.length,minClearance:race.minChassisClearance,
    cameraClearance:cameras.clearance,audio:audio.stats(),
  };
}

function toggleCamera() {
  if(!['race','countdown','intro'].includes(phase)) return;
  mode=mode==='cockpit'?'chase':'cockpit';
  cameras.ready=false;
  if(verify) redraw();
}

function tick(autopilot=pilot,gp=null) {
  if(phase==='intro'){
    phaseClock+=FIXED_STEP;
    if(phaseClock>=5){
      phaseClock=0;
      countdownNumber=3;setPhase('countdown');
      ui.count('3');audio.chime('count');
    }
  } else if(phase==='countdown') {
    phaseClock+=FIXED_STEP;
    const digit=3-Math.floor(phaseClock);
    if(digit>0&&countdownNumber!==digit){
      countdownNumber=digit;ui.count(String(digit));audio.chime('count');
    } else if(digit<=0) {
      phaseClock=0;setPhase('race');ui.count('Go');audio.chime('go');
    }
  } else if(phase==='race'){
    race.step(readControls(keys,gp),autopilot);
    if(ui.display.textContent==='Go'&&race.time>.73) ui.count();
    if(race.finished) {
      audio.stop();audio.chime('finish');
      setPhase('results',{rows:resultRows(),best:race.player.bestLap});
    }
  }
}

function frame(now) {
  const elapsed=(now-time)/1000;
  time = now;
  if(live) {
    const dt=Math.min(.16,elapsed);
    if(frameTimings&&elapsed>.001) frameTimings.push(elapsed*1000);
    if(phase!=='pause') visualTime+=dt;
    const gp=navigator.getGamepads?.()[0];
    const cameraButton=gp?.buttons[3]?.pressed??false, pauseButton=gp?.buttons[9]?.pressed??false;
    if (cameraButton&&!togglePad.camera) toggleCamera();
    if (pauseButton&&!togglePad.pause) pauseRace();
    togglePad.camera=cameraButton;togglePad.pause=pauseButton;
    accumulator+=dt;
    while(accumulator>=FIXED_STEP) {
      tick(pilot,gp);
      accumulator-=FIXED_STEP;
    }
    redraw(dt);
  }
  requestAnimationFrame(frame);
}

window.addEventListener('keydown', e => {
  keys.add(e.code);
  if (!e.repeat && e.code === 'KeyC') toggleCamera();
  if (!e.repeat && e.code === 'Escape') {
    if(phase==='settings'||phase==='controls') action('back');
    else pauseRace();
  }
  if (['race','intro','countdown'].includes(phase) && (e.code.startsWith('Arrow')||e.code.startsWith('Shift'))) e.preventDefault();
});
window.addEventListener('keyup', e => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

boot().catch(error => {
  ui.showLoading(100,'Unable to start WebGL. '+error.message);
  throw error;
});
