import * as T from 'three';
import { clamp, randomFrom, shoreline, SHOULDER } from './course.js';
import { roadMark, strip } from './geometry.js';
import { block, boulder, branch, groundProp, SceneryBatch, textSurface } from './scenery.js';

function stoneWall(course,batch,start,end,props) {
  const offset = p=>p.half+SHOULDER+.22;
  const rows = Array.from({length:Math.ceil((end-start)/1.38)+1},(_,i)=>{
    const s=Math.min(end,start+i*1.38);
    const c=course.at(s), p=course.at(s,offset(c));
    const ground=course.surface(p.x,p.z)?.y ?? p.y;
    return [p.x,ground,p.z,p.y,s,c.nx,c.nz];
  });
  for (const [side,height,width,reverse] of [[1,.63,.19,false],[-1,.63,.19,true]]) {
    const points=rows.map(([x,ground,z,y,_s,nx,nz])=>[
      [x+nx*width*side,ground-.10,z+nz*width*side],
      [x+nx*width*side,y+height,z+nz*width*side],
    ]);
    batch.add(strip(points,{reverse,makeUV:(i,j)=>[rows[i][4]*.86,j*.69]}),props.stone);
  }
  batch.add(strip(rows.map(([x,_ground,z,y,_s,nx,nz])=>[
    [x-nx*.22,y+.67,z-nz*.22],[x+nx*.22,y+.67,z+nz*.22],
  ]),{makeUV:(i,j)=>[rows[i][4]*.89,j*.39]}),props.stone);
}

function flag(batch,p,props,mat,rng) {
  const yaw = SceneryBatch.yaw(p.x,p.y,p.z,Math.PI/2-p.heading);
  const h=2.28+rng()*.75;
  batch.add(branch([0,-.045,0],[0,h,0],.04,.028,9),props.darkMetal,yaw);
  const cloth=[];
  for(let i=0;i<=10;i++){
    const u=i/10;
    const wave=Math.sin(u*7.1+.55)*u*.12;
    cloth.push([[u*.035+wave,h,1.12*u],[u*.035+wave,h-.56+.08*u,1.12*u]]);
  }
  batch.add(strip(cloth,{makeUV:(i,j)=>[i*.1,1-j]}),mat,yaw,false);
}

export function lampPole(batch,p,props,yaw,lamps,{ height=4.1, arm=.97, side=1, strength=185 } = {}) {
  const frame=SceneryBatch.yaw(p.x,p.y,p.z,yaw);
  batch.add(block(.45,.16,.45,0,.069,0),props.stone,frame);
  batch.add(branch([0,0,0],[0,height-.25,0],.058,.039,9),props.darkMetal,frame);
  batch.add(branch([0,height-.25,0],[arm*side,height,0],.042,.029,8),props.darkMetal,frame);
  batch.add(block(.37,.11,.26,arm*side,height-.038,0),props.darkMetal,frame);
  batch.add(block(.285,.027,.20,arm*side,height-.105,0),props.lamp,frame,false);
  lamps.push({
    origin:new T.Vector3(arm*side,height-.16,0).applyMatrix4(frame),
    target:new T.Vector3((arm+2.08)*side,-.05,0).applyMatrix4(frame), strength,
  });
}

export function startGrid(course,batch,props,lamps) {
  const p=course.at(course.start);
  const rightSide=[-1,1];
  const gantryYaw=Math.PI/2-p.heading;
  const support = p.half + 2.40;
  for(const side of rightSide) {
    const spot=groundProp(course,course.start,side*support);
    const yaw=SceneryBatch.yaw(spot.x,spot.y,spot.z,gantryYaw);
    batch.add(block(.92,.32,.89,0,.13,0),props.stone,yaw);
    for(const w of [-1,1]){
      batch.add(block(.15,5.51,.17,w*.245,2.77,0),props.darkMetal,yaw);
      batch.add(branch([w*.24,.32,0],[-w*.24,1.2,0],.027,.027,6),props.darkMetal,yaw);
      batch.add(branch([w*.24,1.51,0],[-w*.24,2.4,0],.027,.027,6),props.darkMetal,yaw);
      batch.add(branch([w*.24,2.75,0],[-w*.24,3.7,0],.027,.027,6),props.darkMetal,yaw);
      batch.add(branch([w*.24,4.01,0],[-w*.24,4.9,0],.027,.027,6),props.darkMetal,yaw);
    }
  }
  const matrix = SceneryBatch.yaw(p.x,p.y,p.z,gantryYaw);
  batch.add(block(support*2+.6,1.05,.64,0,5.09,0),props.darkMetal,matrix);
  batch.add(block(support*2+.66,.092,.71,0,5.62,0),props.stone,matrix);
  batch.add(block(support*2+.66,.085,.71,0,4.56,0),props.stone,matrix);
  const letterMap = textSurface('C A L A   D I   V E T R A','#f5db9a','#222c30','700 64px Segoe UI');
  const sign = new T.MeshStandardMaterial({
    map:letterMap, emissiveMap:letterMap, emissive:0xffbd73, emissiveIntensity:.26, roughness:.55,
    name:'Start gantry circuit lettering',
  });
  for(const side of rightSide){
    batch.add(new T.PlaneGeometry(8.42,.84).rotateY(side<0?Math.PI:0).translate(0,5.09,side*.332),sign,matrix,false);
    for(const x of [-5.25,5.25]) {
      batch.add(block(.66,.20,.43,x,4.45,side*.23),props.darkMetal,matrix);
      batch.add(block(.50,.12,.046,x,4.43,side*.468),props.lamp,matrix,false);
      lamps.push({
        origin:new T.Vector3(x,4.38,side*.44).applyMatrix4(matrix),
        target:new T.Vector3(x*.32,.07,side*6.5).applyMatrix4(matrix),strength:410,
      });
    }
  }
  const trackWidth= p.half*2-.41;
  for(let i=0;i<32;i++){
    const w=trackWidth/32;
    const start=course.start-(i%2===0?.30:.02);
    const from=-trackWidth/2+i*w;
    batch.add(roadMark(course,start,start+.28,()=>[from,from+w],null,props.painting).geometry,props.painting,null,false);
  }
  for(let i=0;i<6;i++) {
    const x=i%2===0?-2.16:2.16;
    const s=course.start-5.8*(Math.floor(i/2)+1)-(i%2?1:.0);
    for (const [a,b,l,r] of [[s+2.75,s+2.91,x-1.14,x+1.14],[s+.30,s+2.75,x-1.14,x-1.025],[s+.30,s+2.75,x+1.025,x+1.14]]){
      const mark=roadMark(course,a,b,()=>[l,r],null,props.painting);
      batch.add(mark.geometry,props.painting,null,false);
    }
  }
}

export function buildWaterfront(course,props,flora) {
  const rng=randomFrom(course.config.seed+113);
  const batch=new SceneryBatch('Waterfront buildings, rock and flags');
  const leaves=new SceneryBatch('Waterfront palms and dune cover');
  const lamps=[];
  startGrid(course,batch,props,lamps);
  const end=course.zones[1].at;
  const stripes=['#1c4453','#9e582e','#5e5a37'].map((background,i)=>new T.MeshStandardMaterial({
    name:'Cala pennant '+(i+1),map:textSurface('V E T R A','#f4e4bc',background,'750 83px Segoe UI',500,280),
    side:T.DoubleSide,roughness:.90,
  }));
  stoneWall(course,batch,115,end-22,props);
  const waterRocks=[];
  let nonFlora=6;
  for(let s=28;s<end-9;s+=6.4+rng()*2.8){
    const p=course.at(s);
    const coast=(shoreline(p.x)-p.z)/Math.max(.60,p.nz);
    if(s>119&&s<end-29) {
      const wall=course.at(s,p.half+SHOULDER+.22);
      batch.add(block(.50,.76,.48,0,.303,0),props.stone,SceneryBatch.yaw(wall.x,wall.y,wall.z,Math.PI/2-wall.heading));
      nonFlora++;
    }
    const dune=groundProp(course,s,clamp(coast-11-rng()*4,14,63));
    if(dune) {
      const matrix=SceneryBatch.yaw(dune.x,dune.y,dune.z,Math.PI/2-dune.heading);
      batch.add(block(.106,.63,.115,0,.27,0),props.wood,matrix,false);
      if(rng()<.83) batch.add(block(.060,.085,7.2,0,.493,3.4),props.wood,matrix,false);
      nonFlora++;
    }
    if(rng()<.73) flora.plant(leaves,s,p.half+3.2+rng()*3.6,'grass',.88+rng()*1.24,false);
    if(rng()<.51) flora.plant(leaves,s,-p.half-2.35-rng()*4.3,'grass',.81+rng()*1.2,false);
    if(rng()<.56) flora.plant(leaves,s,Math.min(40,coast*.67)+rng()*6,'shrub',.65+rng());
    if(rng()<.23) {
      const side=rng()<.64?-1:1;
      const planted=p.half+4.9+rng()*8.3;
      flora.plant(leaves,s,side*planted,'palm',.81+rng()*.47);
    }
  }
  for (let s=21;s<end-9;s+=26+rng()*20) {
    flora.plant(leaves,s,-(pHalf(course,s)+5.4+rng()*9.6),'palm',.83+rng()*.56);
    if(rng()>.16) flora.plant(leaves,s+8,pHalf(course,s)+6.1+rng()*9.53,'palm',.81+rng()*.34);
    const lamp=groundProp(course,s,-pHalf(course,s)-2.08);
    lampPole(batch,lamp,props,Math.PI/2-lamp.heading,lamps,{ side:-1,height:3.85,strength:172 });
    nonFlora++;
  }
  for(let s=123;s<end-35;s+=21+rng()*9) {
    const p=groundProp(course,s,pHalf(course,s)+2.19);
    flag(batch,p,props,stripes[Math.floor(rng()*stripes.length)],rng);
    nonFlora++;
  }
  for(let s=126;s<end-32;s+=13.5+rng()*11) {
    const skirt=pHalf(course,s);
    for(let i=0;i<7;i++){
      flora.plant(leaves,s+rng()*12,-skirt-3.8-rng()*16,i===2?'grass':'shrub',.60+rng()*1.46,false);
    }
    if(rng()<.72) flora.plant(leaves,s+4,-skirt-14-rng()*19,'olive',.79+rng()*.55);
  }
  for(let s=136;s<end-1;s+=30+rng()*23) {
    const p=course.at(s);
    const line=(shoreline(p.x)-p.z)/Math.max(.60,p.nz);
    for(let j=0;j<3;j++){
      const side=line-2.5+rng()*13.2;
      const rad=1.0+rng()*2.76;
      const stone=groundProp(course,s+rng()*11.5,side,rad,{kind:'rock',height:rad,sunk:true});
      if(!stone) continue;
      const top = Math.max(-.49,stone.y)+rad*.22;
      batch.add(boulder(Math.round(s+j*33),[rad,rad*.58,rad*(.72+rng()*.28)],2),props.rock,
        SceneryBatch.yaw(stone.x,top,stone.z,rng()*8));
      if(waterRocks.length<30 && stone.z>=shoreline(stone.x)-1.9) {
        waterRocks.push({ x:stone.x,z:stone.z,r:rad*.83,phase:rng()*6.28 });
      }
      nonFlora++;
    }
  }
  return { group:batch.finish(), plants:leaves.finish(), lamps, waterRocks, propCount:nonFlora };
}

const pHalf=(course,s)=>course.at(s).half;

export function installLampPool(scene, lamps, props, size=11) {
  const pool=Array.from({length:size},()=>{
    const lamp=new T.SpotLight(0xffad61,0,25,.73,.72,1.78);
    scene.add(lamp,lamp.target);
    return lamp;
  });
  return {
    pool,
    update(camera,night,budget=size) {
      props.lamp.emissiveIntensity=night?3.15:.11;
      const near=night?[...lamps].sort((a,b)=>a.origin.distanceToSquared(camera.position)-b.origin.distanceToSquared(camera.position)):[];
      pool.forEach((light,i)=>{
        light.visible=night;
        const fixture=i<budget?near[i]:null;
        if(fixture&&fixture.origin.distanceToSquared(camera.position)<24000){
          light.position.copy(fixture.origin); light.target.position.copy(fixture.target); light.intensity=fixture.strength;
        } else light.intensity=0;
      });
    },
  };
}
