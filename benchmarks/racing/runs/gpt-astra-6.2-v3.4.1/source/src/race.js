import {clamp,mix,mod} from './track.js';
import {vehicle,drive,gradePilot,STEP} from './drive.js';
export const drivers=['Você','Lia Neri','Tom Vidal','Noa Reis','Ivo Mar','Luz Serra'];
export function checkpoint(track,c,before,after,t){
 const q=c.progress;if(q.finished||after<=before||after-before>1.2)return false;
 const cp=track.checkpoints[q.next],forward=mod(cp.s-mod(before,track.length),track.length);
 if(forward>after-before+1e-7||forward<1e-9)return false;
 if(q.next===0){if(q.started){q.times.push(t-q.lapStart);q.laps++;q.best=Math.min(q.best,q.times.at(-1));}q.started=true;q.lapStart=t;}
 q.next=(q.next+1)%track.checkpoints.length;return true;
}
export class Race {
 constructor(track,opts={}){this.track=track;this.reset(opts);}
 reset(opts=this.opts){
   this.opts={laps:3,difficulty:'normal',...opts};this.time=0;this.intro=0;this.phase='grid';this.log=[];this.passes=0;this.contactCooldown=0;this.pairOrder=new Map();
   const slots=[[-17,-2],[-3,-2],[-6,2],[-10,-2],[-13,2],[-21,2]];
   this.cars=slots.map(([s,l],i)=>{const c=vehicle(this.track,s,l);c.driver=i;c.homeLane=l;c.targetLane=l;c.laneHold=0;c.maxIdle=0;c.maxOff=0;c.lastTrack={s:c.s,l,distance:s};
    c.progress={next:0,laps:0,started:false,lapStart:0,best:Infinity,times:[],finished:0};return c;});
   this.eventsSeen=new Array(6).fill(0);this.lastSlip=false;this.inBridge=false;this.maxCameraIntrusions=0;
 }
 event(type,c,extra={}){this.log.push({t:this.time,type,driver:c.driver,s:c.s,...extra});}
 order(){return [...this.cars].sort((a,b)=>b.distance-a.distance);}
 position(c=this.cars[0]){return this.order().indexOf(c)+1;}
 pilot(c){
   const dif={facil:.88,normal:.99,dificil:1.075}[this.opts.difficulty]??1;
   const bias=[1,.918,.948,1.015,.987,1.048][c.driver];
   let cap=48,lane=c.targetLane;const f=this.track.frame(c.s);
   const nearest=this.cars.filter(v=>v!==c&&v.distance>c.distance&&v.distance-c.distance<27&&Math.abs(v.l-c.l)<2.35)
     .sort((a,b)=>a.distance-b.distance)[0];
   c.laneHold=Math.max(0,c.laneHold-STEP);
   if(nearest&&c.laneHold<=0){
     const candidates=[-3.27,0,3.27].filter(l=>Math.abs(nearest.l-l)>2.16);
     const free=candidates.filter(l=>!this.cars.some(o=>o!==c&&Math.abs(o.distance-c.distance)<9.2&&Math.abs(o.l-l)<1.92));
     free.sort((a,b)=>Math.abs(a-c.l)-Math.abs(b-c.l));
     if(free.length){lane=free[0];c.laneHold=2.3+(c.driver%3)*.33;}else cap=Math.max(7,nearest.speed-.3);
   }else if(!nearest&&c.laneHold<=0){
     lane=clamp(c.homeLane+Math.sin(c.s*.014+c.driver)*.48+f.curve*42,-3.35,3.35);
   }
   c.targetLane=lane;
   return gradePilot(this.track,c,lane,dif*bias,cap);
 }
 testPilot(){
   const c=this.cars[0];let lane=c.s<110?1.7:Math.sin(c.s*.009)*2.2;
   const front=this.cars.slice(1).filter(o=>o.distance>c.distance&&o.distance-c.distance<17&&Math.abs(o.l-lane)<1.8).sort((a,b)=>a.distance-b.distance)[0];
   if(front)lane=front.l>0?-2.65:2.65;
   return gradePilot(this.track,c,lane,1.011);
 }
 step(input,check=false){
   if(this.phase==='paused'||this.phase==='results')return;
   if(this.phase==='grid'||this.phase==='countdown'){
     this.intro+=STEP;this.phase=this.intro<4.9?'grid':this.intro<7.9?'countdown':'race';return;
   }
   this.time+=STEP;this.contactCooldown=Math.max(0,this.contactCooldown-STEP);
   for(const c of this.cars){
     const old=c.distance,cmd=c.driver?this.pilot(c):input;
     drive(this.track,c,cmd,STEP,check);
     c.maxIdle=Math.max(c.maxIdle,c.stalled);c.maxOff=Math.max(c.maxOff,c.off);
     if(Math.abs(c.l)<this.track.frame(c.s).width/2-.75&&c.speed>.5){c.lastTrack.s=c.s;c.lastTrack.l=c.l;c.lastTrack.distance=c.distance;}
     if(c.off>3||c.stalled>3){
       c.s=c.lastTrack.s;c.distance=c.lastTrack.distance;c.l=clamp(c.lastTrack.l,-2.4,2.4);c.y=this.track.surface(c.s,c.l);c.angle=0;c.latSpeed=0;c.speed=0;c.off=0;c.stalled=0;
       this.event('recovery',c);
     }
     for(let i=this.eventsSeen[c.driver];i<c.events.length;i++){const e=c.events[i];this.event(e.type,c,{strength:e.strength});}
     this.eventsSeen[c.driver]=c.events.length;
     if(checkpoint(this.track,c,old,c.distance,this.time)&&c.progress.laps>=this.opts.laps&&!c.progress.finished)c.progress.finished=this.time;
   }
   for(let i=0;i<this.cars.length;i++)for(let j=i+1;j<this.cars.length;j++){
     const a=this.cars[i],b=this.cars[j],dd=b.distance-a.distance,lat=b.l-a.l,sgn=Math.sign(dd)||1,key=i+'-'+j;
     if(this.pairOrder.has(key)&&this.pairOrder.get(key)!==sgn){
       if(i>0)this.passes++;else this.event('pass',a,{other:j});
     }this.pairOrder.set(key,sgn);
     if(Math.abs(dd)>=4.19||Math.abs(lat)>=1.85)continue;
     const side=Math.sign(lat)||1,sideOverlap=1.85-Math.abs(lat),lengthOverlap=4.19-Math.abs(dd);
     const impact=Math.max(.36,Math.abs(a.speed-b.speed),Math.abs(a.latSpeed-b.latSpeed));
     if(sideOverlap<lengthOverlap){
       a.l-=side*sideOverlap*.50;b.l+=side*sideOverlap*.50;a.latSpeed-=side*impact*.16;b.latSpeed+=side*impact*.16;
     }else{
       const rear=dd>0?a:b,front=dd>0?b:a,closing=Math.max(0,rear.speed-front.speed);rear.speed=Math.max(0,rear.speed-.64*closing);front.speed+=closing*.32;
       a.distance-=sgn*lengthOverlap*.5;b.distance+=sgn*lengthOverlap*.5;a.s=mod(a.distance,this.track.length);b.s=mod(b.distance,this.track.length);
     }
     if(this.contactCooldown===0){this.event('collision',a,{other:b.driver,strength:impact});this.contactCooldown=.43;}
   }
   const c=this.cars[0],slip=c.slip>.15;if(slip&&!this.lastSlip)this.event('skid',c);this.lastSlip=slip;
   const bridge=this.track.onBridge(c.s);if(bridge&&!this.inBridge)this.event('bridge',c);this.inBridge=bridge;
   if(c.progress.finished)this.phase='results';
 }
 pause(){if(['race','grid','countdown'].includes(this.phase)){this.beforePause=this.phase;this.phase='paused';}}
 resume(){if(this.phase==='paused')this.phase=this.beforePause;}
 results(){return this.order().map(c=>({driver:c.driver,time:c.progress.finished||this.time+Math.max(0,this.opts.laps*this.track.length-c.distance)/Math.max(10,c.distance/Math.max(1,this.time)),projected:!c.progress.finished})).sort((a,b)=>a.time-b.time);}
}
