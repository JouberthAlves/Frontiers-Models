import { clamp,mix,mod,wrapAngle } from './track.js';

export const STEP=1/120;
export function vehicle(track,s=0,l=0) {
  return { s:mod(s,track.length),distance:s,l,angle:0,speed:0,latSpeed:0,steer:0,roll:0,pitch:0,slip:0,
    tyrePhase:0,y:track.surface(s,l),throttle:0,brake:0,gear:1,rpm:1100,shift:0,stalled:0,off:0,wall:0,
    lastSafe:{s:mod(s,track.length),l},events:[],maxWheelGap:0,minClearance:Infinity,driver:0 };
}
export function gradePilot(track,c,lane=0,pace=1,cap=60) {
  const ahead=Math.max(12,c.speed*1.7),near=track.frame(c.s),bend=track.frame(c.s+ahead),far=track.frame(c.s+ahead*1.85);
  const curvature=Math.max(Math.abs(near.curve)*.87,Math.abs(bend.curve),Math.abs(far.curve)*.8,.0009);
  const target=Math.min(cap,31.5,Math.sqrt(9.3/curvature))*pace;
  const turn=near.curve*c.speed/Math.max(.2,turnRate(c.speed));
  const wantedAngle=clamp((lane-c.l)*.11,-.27,.27);
  return {gas:clamp((target-c.speed)*.85+.20,0,1),brake:clamp((c.speed-target-.4)*.31,0,1),
    steer:clamp(turn+wrapAngle(wantedAngle-c.angle)*2.75,-1,1)};
}
function turnRate(speed) {return Math.min(1.95,Math.abs(speed)*.21)/(1+Math.abs(speed)*.025);}
export function drive(track,c,input,dt,check=false) {
  const f=track.frame(c.s),oldSpeed=c.speed;
  c.throttle=clamp(input.gas||0,0,1);c.brake=clamp(input.brake||0,0,1);
  c.steer=mix(c.steer,clamp(input.steer||0,-1,1),1-Math.exp(-dt*7));
  const rough=Math.abs(c.l)>f.width/2-.3;
  const acceleration=c.throttle*(8.15-4.15*clamp(c.speed/55,0,1))*(c.shift>0?.36:1)-c.brake*13.5-.30-c.speed*c.speed*.00255-f.grade*5.5-(rough?2.8:0);
  c.speed=clamp(c.speed+acceleration*dt,0,59);
  const turn=c.steer*turnRate(c.speed);
  const ds=c.speed*Math.cos(c.angle)/Math.max(.69,1-f.curve*c.l)*dt;
  c.angle=clamp(c.angle+turn*dt-f.curve*ds,-.97,.97);
  const wantLat=Math.sin(c.angle)*c.speed;
  c.latSpeed=mix(c.latSpeed,wantLat,1-Math.exp(-dt*(rough?4:7.3)));
  c.l+=c.latSpeed*dt;c.distance+=ds;c.s=mod(c.s+ds,track.length);
  const cliff=f.s>=track.zones[1].s&&f.s<track.zones[1].end,rail=track.onBridge(f.s)||(cliff&&Math.sign(c.l)===(f.curve>0?-1:1));
  let barrier=rail?f.width/2+.62-.91:41;
  if(rough&&track.collisionBins){const band=Math.floor(c.s/25),candidates=track.collisionBins.get(band)||[];
    for(const o of candidates){if(Math.sign(o.l)!==Math.sign(c.l))continue;
      const longitudinal=Math.min(mod(o.s-c.s,track.length),mod(c.s-o.s,track.length));
      if(longitudinal<(o.kind==='house'?o.w/2:o.radius)+1.9)barrier=Math.min(barrier,Math.abs(o.l)-(o.kind==='house'?o.d/2:Math.min(.46,o.radius))-.92);}
  }
  c.wall=0;if(Math.abs(c.l)>barrier){
    const impact=Math.abs(c.latSpeed),sign=Math.sign(c.l);
    if(impact>2)c.events.push({type:'barrier',s:c.s,strength:impact});
    c.l=sign*barrier;c.wall=clamp(impact/3+.08,0,1);c.speed=Math.max(0,c.speed-impact*.12-.65*dt);
    c.angle=-sign*Math.min(.085,impact*.015);c.latSpeed=-sign*impact*.12;
  }
  c.slip=Math.abs(wantLat-c.latSpeed)*.15+Math.max(0,Math.abs(turn*c.speed)-7)*.10;
  c.roll=mix(c.roll,clamp(turn*c.speed*.008,-.065,.065),1-Math.exp(-dt*6));
  c.pitch=mix(c.pitch,clamp((c.speed-oldSpeed)*.008/dt,-.05,.055),1-Math.exp(-dt*5));
  c.tyrePhase+=c.speed*dt/.334;c.shift=Math.max(0,c.shift-dt);
  const ratios=[0,34,55,82,114,151,205],kmh=c.speed*3.6;
  if(c.gear<6&&kmh>ratios[c.gear]*.985&&c.shift===0){c.gear++;c.shift=.14;c.events.push({type:'gear',s:c.s});}
  if(c.gear>1&&kmh<ratios[c.gear-1]*.74&&c.shift===0){c.gear--;c.shift=.10;c.events.push({type:'gear',s:c.s});}
  c.rpm=clamp(1020+kmh/ratios[c.gear]*5660+c.throttle*180,1000,6950);
  c.y=track.surface(c.s,c.l);
  let invalid=!Number.isFinite(c.y);
  if(check&&!invalid){
    const ground=track.terrain, center=track.point(c.s,c.l),fw=track.frame(c.s);
    const floor=ground.cast(center.x,center.z);
    c.minClearance=Math.min(c.minClearance,c.y+.18-floor);
    if(c.y+.18<floor-.02)invalid=true;
    for(const longitudinal of [-1.34,1.34])for(const lateral of [-.81,.81]){
      const ds=longitudinal*Math.cos(c.angle)-lateral*Math.sin(c.angle),dl=longitudinal*Math.sin(c.angle)+lateral*Math.cos(c.angle);
      const expected=c.y+ds*fw.grade+dl*fw.bank;
      const contact=track.surface(c.s+ds,c.l+dl),gap=Math.abs(expected-contact);c.maxWheelGap=Math.max(c.maxWheelGap,gap);
      if(!Number.isFinite(contact)||gap>1.5)invalid=true;
    }
  }
  if(invalid){c.events.push({type:'integrity-reset',s:c.s});c.s=c.lastSafe.s;c.l=c.lastSafe.l;c.speed=0;c.angle=0;c.latSpeed=0;c.y=track.surface(c.s,c.l);}
  else {c.lastSafe.s=c.s;c.lastSafe.l=c.l;}
  c.off=rough?c.off+dt:0;c.stalled=c.speed<.18?c.stalled+dt:0;
}
