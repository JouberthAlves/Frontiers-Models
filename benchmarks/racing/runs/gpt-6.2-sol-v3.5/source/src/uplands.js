import * as T from 'three';
import { randomFrom, smooth, SHOULDER, mix } from './course.js';
import { roadMark, strip } from './geometry.js';
import { block, boulder, groundProp, SceneryBatch, textSurface } from './scenery.js';

function guardRail(course,batch,from,to,side,props) {
  const rows=[];
  const count=Math.ceil((to-from)/1.4);
  for(let i=0;i<=count;i++){
    const s=mix(from,to,i/count), p=course.at(s);
    const rail=course.at(s,side*(p.half+SHOULDER+.22));
    rows.push([
      [rail.x,rail.y+.35,rail.z],
      [rail.x+rail.nx*.053*side,rail.y+.45,rail.z+rail.nz*.053*side],
      [rail.x-rail.nx*.017*side,rail.y+.57,rail.z-rail.nz*.017*side],
      [rail.x+rail.nx*.050*side,rail.y+.685,rail.z+rail.nz*.050*side],
      [rail.x,rail.y+.771,rail.z],
    ]);
  }
  const metal=props.darkMetal;
  metal.side=T.DoubleSide;
  batch.add(strip(rows,{ reverse:side<0,makeUV:(i,j)=>[i*.54,j*.13] }),metal);
  let countProps=0;
  for(let s=from;s<=to;s+=4.7){
    const p=course.at(s);
    const offset=side*(p.half+SHOULDER+.25);
    const at=course.at(s,offset);
    const earth=course.ground(at.x,at.z) ?? at.y;
    const grounded = !course.isBridge(s) ? course.surface(at.x,at.z)?.y ?? earth : at.y;
    const postHeight=Math.max(.72,at.y+.73-grounded);
    const matrix=SceneryBatch.yaw(at.x,grounded,at.z,Math.PI/2-at.heading);
    batch.add(block(.29,.168,.33,0,.018,0),props.stone,matrix);
    batch.add(block(.081,postHeight,.114,0,postHeight/2,0),metal,matrix);
    countProps+=1;
  }
  return countProps;
}

function sign(batch,course,s,props,signMaterial,side,shift=0) {
  const p=course.at(s);
  const at=groundProp(course,s,side*(p.half+2.10+shift));
  const matrix=SceneryBatch.yaw(at.x,at.y,at.z,-Math.PI/2-p.heading);
  batch.add(block(.34,.14,.285,0,.025,0),props.stone,matrix);
  batch.add(block(.048,1.34,.049,-.082,.65,0),props.darkMetal,matrix);
  batch.add(block(.77,.44,.049,.0,1.30,0),props.darkMetal,matrix);
  batch.add(new T.PlaneGeometry(.722,.39).translate(0,1.30,.027),signMaterial,matrix,false);
}

function bridge(course,batch,props,from,to) {
  const len=to-from;
  const centers=[from+len*.25,from+len*.75];
  const shape=s=>{
    const nearest=Math.min(...centers.map(c=>Math.abs(s-c)));
    return Math.sqrt(Math.max(0,1-(nearest/(len*.224))**2));
  };
  const rowsFor=(fn,count=64)=>Array.from({length:count+1},(_,i)=>{
    const s=mix(from,to,i/count), p=course.at(s);
    return fn(s,p);
  });
  const surface=props.stone;
  surface.side=T.DoubleSide;
  for(const side of [-1,1]) {
    batch.add(strip(rowsFor((s,p)=>{
      const edge=course.at(s,side*(p.half+SHOULDER+.06));
      return [[edge.x,edge.y-5.85+shape(s)*4.72,edge.z],[edge.x,edge.y-.017,edge.z]];
    }),{ reverse:side<0,makeUV:(i,j)=>[i*.40,j*2.6] }),surface);
    batch.add(strip(rowsFor((s,p)=>{
      const edge1=course.at(s,side*(p.half+SHOULDER+.105));
      const edge2=course.at(s,side*(p.half+SHOULDER+.170));
      const cutoff=shape(s)*4.72;
      return [[edge1.x,edge1.y-5.84+cutoff,edge1.z],[edge2.x,edge2.y-5.43+cutoff,edge2.z]];
    }),{ reverse:side>0,makeUV:(i,j)=>[i*.54,j*.94] }),surface);
  }
  batch.add(strip(rowsFor((s,p)=>{
    const a=course.at(s,-p.half-SHOULDER), b=course.at(s,p.half+SHOULDER);
    const down= -5.85+shape(s)*4.72;
    return [[a.x,a.y+down,a.z],[b.x,b.y+down,b.z]];
  }),{reverse:true,makeUV:(i,j)=>[i*.43,j*7.1]}),surface);
  for(const [s,width] of [[from+1.9,5.2],[(from+to)/2,2.6],[to-1.9,5.2]]) {
    const p=course.at(s);
    const bottom=Math.min(...[-5,0,5].map(offset=>{
      const n=course.at(s,offset);
      return course.ground(n.x,n.z) ?? p.y-9.0;
    }))-1;
    const deep=p.y-bottom-4.6;
    batch.add(block(2*(p.half+SHOULDER)-.32,deep,width,0,bottom+deep/2-p.y,0),surface,
      SceneryBatch.yaw(p.x,p.y,p.z,Math.PI/2-p.heading));
  }
  for(const side of [-1,1]) guardRail(course,batch,from,to,side,props);
}

export function buildUplands(course,props,flora) {
  const rng=randomFrom(course.config.seed+3345);
  const cliffs=new SceneryBatch('Limestone cut and retaining hardware');
  const woods=new SceneryBatch('Pines, olives, cypress and understory');
  const far=new SceneryBatch('Far tree canopy');
  const cross=new SceneryBatch('Ponticello bridge and descent hardware');
  const start=course.zones[1].at,village=course.zones[2].at,forest=course.zones[3].at;
  let cliffProps=guardRail(course,cliffs,start,village,1,props);
  const chevron=new T.MeshStandardMaterial({
    name:'Reflective curve chevron',map:textSurface('❯ ❯','#f6dc95','#253137','700 140px Segoe UI',352,180),roughness:.57,
  });
  const white=props.painting;
  for (let s=start+16;s<village-16;s+=17.2+rng()*11.1) {
    const apex=course.at(s+11).curvature;
    const outer=apex>.0?-1:1;
    if(Math.abs(apex)>.007) {sign(cliffs,course,s,props,chevron,outer);cliffProps++;}
    const p=course.at(s);
    for(let j=0;j<4;j++){
      const rad=3.8+rng()*6.1;
      const d=p.half+rad+4.2+j*7.4+rng()*3.4;
      const place=groundProp(course,s+j*6.1,-d,rad,{kind:'rock',height:rad*1.35,sunk:true});
      if (!place) continue;
      const near = j===0;
      const height=rad*(near?1.28:1.12+rng()*.43);
      cliffs.add(boulder(Math.floor(s*79+j*.17),[rad,height,rad*(.78+rng()*.46)],2),props.rock,
        SceneryBatch.yaw(place.x,place.y-height*.19,place.z,rng()*Math.PI));
      if (j===1) {
        flora.plant(woods,s+8,-d-5.6,rng()<.63?'pine':'cypress',.67+rng()*.45);
      }
      for(let k=0;k<3;k++) {
        flora.plant(woods,s+rng()*12,-p.half-4.36-rng()*9,k===2?'grass':'shrub',.53+rng()*1.14,false);
      }
      cliffProps++;
    }
    if(rng()<.52){
      flora.plant(woods,s,p.half+7.1+rng()*8.4,'olive',.58+rng()*.69);
      flora.plant(woods,s+5,p.half+7.7+rng()*8.8,'shrub',1.01);
    }
  }
  for(let s=start+3;s<village-3;s+=14.3) {
    const mark=roadMark(course,s,s+4.35,()=>[-.055,.055],null,white);
    cliffs.add(mark.geometry,white,null,false);
  }
  const bridgeFrom=forest+111,bridgeTo=forest+155;
  bridge(course,cross,props,bridgeFrom,bridgeTo);
  const bridgePlate=new T.MeshStandardMaterial({
    name:'Bridge approach sign',map:textSurface('P O N T E','#f8e4aa','#295060','780 68px Segoe UI',460,118),roughness:.60,
  });
  sign(cross,course,bridgeFrom-16.2,props,bridgePlate,1);
  sign(cross,course,bridgeTo+3.7,props,bridgePlate,-1);
  let woodsProps=2;
  const choices=['pine','olive','pine','cypress','pine','olive','cypress','palm'];
  for (let s=forest+6;s<course.length-5;s+=8.0+rng()*5.8) {
    if (course.isBridge(s)) continue;
    const p=course.at(s);
    for (const side of [-1,1]) {
      if (rng()<.85) {
        const origin=groundProp(course,s,side*(p.half+2.49));
        const matrix=SceneryBatch.yaw(origin.x,origin.y,origin.z,Math.PI/2-p.heading);
        cross.add(block(.14,.59,.141,0,.254,0),props.stone,matrix);
        cross.add(block(.10,.14,.011,0,.49,.080),props.ochre,matrix,false);
        woodsProps++;
      }
      const cluster=.43+.57*smooth(-.3,.6,Math.sin(s*.047+side)+Math.cos(s*.076)*.37);
      for(let i=0;i<2+Math.floor(cluster*2);i++){
        const pick=choices[Math.floor(rng()*choices.length)];
        flora.plant(woods,s+i*4+rng()*4,side*(p.half+4.95+i*6.2+rng()*7.2),pick,.69+rng()*.54);
      }
      for(let j=0;j<8;j++){
        flora.plant(woods,s+rng()*11.2,side*(p.half+1.73+rng()*11.4),j%3?'shrub':'grass',.57+rng()*1.24,false);
      }
      for(let j=0;j<4+Math.round(cluster*4);j++){
        const kind=choices[Math.floor(rng()*7)];
        flora.plant(far,s+rng()*14,side*(p.half+26+rng()*60),kind,.69+rng()*.65,false);
      }
    }
  }
  return { cliffs:cliffs.finish(), woods:woods.finish(), far:far.finish(), crossing:cross.finish(),
    bridge:{ from:bridgeFrom,to:bridgeTo }, cliffProps, woodsProps };
}
