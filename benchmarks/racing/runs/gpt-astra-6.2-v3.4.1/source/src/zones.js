import * as T from 'three';
import {V,bar,part,pack,patch,line,leafLighting} from './art.js';
import {box,canvasSign} from './scenery.js';
import {building,bellTower} from './village.js';
import {mix,mod,random,clamp} from './track.js';

function tree(art,species,variant) {
 const g=new T.Group(),m=art.material,rng=random(1234+species.length*741+variant*81),bark=m('bark',species==='oliveira'?0xb4ac92:0x9c846a,.96);
 const cypress=species==='cipreste',pine=species==='pinheiro-manso',height=cypress?9:pine?9.7:5.1,canopy=art.groveMaps[(variant+1)%2];
 const foliage=new T.MeshStandardMaterial({map:canopy,normalMap:art.textures.finish.normalMap,roughnessMap:art.textures.finish.roughnessMap,
  color:pine?0xb8cb99:cypress?0x95ae89:0xdde0b6,alphaTest:.26,side:T.DoubleSide,roughness:.96,normalScale:new T.Vector2(.035,.035)});
 leafLighting(foliage);
 const stem=(a,b,ra,rb)=>bar(g,a,b,ra,bark,9,rb);
 const fork=V(.18+.31*rng(),height*(pine?.57:cypress?.71:.39),.12);
 stem(V(0,-.14,0),fork,pine?.32:.23,.14);
 const crowns=cypress?5:pine?6:5;
 for(let i=0;i<crowns;i++){
  const a=i*2.4+rng()*.48,t=i/(crowns-1),rad=cypress?.29:(pine?2.31:1.56)*(.57+.49*rng());
  const tip=V(Math.cos(a)*rad,cypress?height*(.27+.65*t):height*(.66+.13*t),Math.sin(a)*rad);
  const joint=V(mix(fork.x,tip.x,.49),mix(fork.y,tip.y,.64),mix(fork.z,tip.z,.55));
  stem(fork,joint,.12,.08);stem(joint,tip,.085,.025);
  const w=cypress?(1.8-t*.96):(pine?4.20:3.3)*(.78+rng()*.37),h=cypress?2.9-t*.65:(pine?2.1:2.4)*(.83+.27*rng());
  for(let axis=0;axis<3;axis++){
   const geo=new T.PlaneGeometry(w,h,3,3),uv=geo.attributes.uv,norm=geo.attributes.normal;
   for(let j=0;j<uv.count;j++){const u=uv.getX(j),v=uv.getY(j);uv.setXY(j,(u*.89+.055+(i+axis)%3)/3,(.38+v*.60+((axis+i)%2))/2);norm.setXYZ(j,(u-.5)*.6,.94,.29);}
   geo.rotateY(axis*Math.PI/3+a);geo.translate(tip.x,tip.y+h*.23,tip.z);part(g,geo,foliage);
  }
 }
 return pack(g);
}
function ribbon(scene,track,s0,s1,from,to,m,height=.045) {
 const g=patch(4,Math.max(3,Math.ceil((s1-s0)/2)),(u,v)=>{
  const s=mix(s0,s1,v),f=track.frame(s),l=mix(from,to,u),x=f.x+f.rx*l,z=f.z+f.rz*l;
  return V(x,track.terrain.cast(x,z)+height,z);});
 const uv=g.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*(to-from)/3,uv.getY(k)*(s1-s0)/3);
 m.side=T.DoubleSide;const mesh=part(scene,g,m);mesh.castShadow=false;return mesh;
}
function bridge(scene,track,art){
 const br=track.bridge,m=art.material,stone=m('stone',0xcfb99b,.94),cap=m('pavers',0xddd1b5,.89),iron=m('finish',0x6c7770,.61,.58),width=track.frame(br.start).width/2+.98;
 const n=3,span=(br.end-br.start)/n;
 const archBase=u=>-8.2+6.45*Math.pow(Math.max(0,Math.sin(u*Math.PI)),.66);
 function masonry(g){const uv=g.attributes.uv,pos=g.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)*.59+pos.getZ(i)*.81)/3.1,pos.getY(i)/3.1);stone.side=T.DoubleSide;return part(scene,g,stone);}
 for(let j=0;j<=n;j++){
   const s=br.start+span*j,thick=j===0||j===n?1.15:.87;
   for(const edge of [-width,width]){const face=patch(4,8,(u,v)=>{const ss=s+(u-.5)*thick*2,p=track.point(ss,edge);const base=Math.min(track.terrain.cast(p.x,p.z)-.36,p.y-8.55);p.y=mix(base,p.y-.16,v);return p;});masonry(face);}
   for(const end of [-1,1]){const face=patch(12,8,(u,v)=>{const p=track.point(s+end*thick,mix(-width,width,u));const base=Math.min(track.terrain.cast(p.x,p.z)-.36,p.y-8.55);p.y=mix(base,p.y-7.63,v);return p;});masonry(face);}
 }
 for(let j=0;j<n;j++){const s=br.start+j*span;const soffit=patch(24,4,(u,v)=>track.point(s+span*u,mix(-width,width,v),archBase(u)));masonry(soffit);}
 for(const side of [-1,1]){
   const edge=side*width;
   for(let j=0;j<n;j++){
     const start=br.start+span*j;
     for(const face of [-.28,.28]){const geom=patch(22,3,(u,v)=>{
       return track.point(start+u*span,edge+face,mix(archBase(u),-.12,v));},side===1);
       masonry(geom);}
   }
   const points=[];for(let s=br.start-1;s<=br.end+1;s+=2.3){const a=track.point(s,edge,.03),b=track.point(s,edge,1.01);bar(scene,a,b,.059,iron,8);points.push(b);}
   line(scene,points,.073,cap,8);line(scene,points.map(p=>p.clone().add(V(0,-.44,0))),.040,iron,6);
 }
 const deck=track.roadGeometry(-width,width,-.14,br.start-.5,br.end+.5,1.4);part(scene,deck,stone);
}
export function allZones(track,scene,art,coast) {
 const {sets,items,grass,shrub,groves,cliff,reef}=coast;
 const rng=sets.rng,m=art.material,z2=track.zones[1],z3=track.zones[2],z4=track.zones[3];
 const families=['pinheiro-manso','oliveira','cipreste'],trees=Object.fromEntries(families.map(name=>[name,[tree(art,name,0),tree(art,name,1)]]));
 const homes=Array.from({length:8},(_,i)=>building(art,i));
 const pavers=m('pavers',0xc8b9a4,.91),streetDetails=new T.Group(),railSheet=new T.Group();
 const railMetal=m('finish',0x89938b,.49,.67),railPost=m('finish',0x586461,.65,.55);railMetal.side=T.DoubleSide;
 const thicket=new T.Group(),tuft=new T.Group();
 const leaf=leafLighting(new T.MeshStandardMaterial({map:art.bushMap,normalMap:art.textures.finish.normalMap,roughnessMap:art.textures.finish.roughnessMap,side:T.DoubleSide,roughness:.95,alphaTest:.22,color:0xf1efc9}));
 const blade=leafLighting(new T.MeshStandardMaterial({map:art.wildGrass,normalMap:art.textures.grain.normalMap,roughnessMap:art.textures.grain.roughnessMap,side:T.DoubleSide,alphaTest:.27,color:0xe0d6a9}));
 for(let i=0;i<7;i++){
   const g=new T.PlaneGeometry(1.35,1.08,2,2);
   g.rotateY(i*2.4);g.translate(Math.sin(i*2.4)*.15,.32,Math.cos(i*2.4)*.14);part(thicket,g,leaf);
   const b=new T.PlaneGeometry(1.85,1.19);b.rotateY(i*1.97);b.translate(Math.cos(i)*.36,.48,Math.sin(i)*.36);part(tuft,b,blade);
 }
 pack(thicket);pack(tuft);
 const shorePlant=(s,l,kind='shrub')=>{const sz=kind==='cover'?.88+rng()*1.17:1.96+rng()*2.6;
   sets.add(kind==='cover'?tuft:thicket,s,l,{kind,species:kind==='cover'?'gramínea':'lentisco',radius:sz*.72,scale:[sz,sz*(kind==='shrub'?.87:.81),sz],yaw:rng()*6.28,range:kind==='cover'?105:185,tint:rng()<.4?0xd2c6a5:0xffffff});};
 for(let s=z2.s+2;s<z2.end;s+=5.4){
   const f=track.frame(s),side=f.curve>0?-1:1;
   const rs=s-2.7,re=Math.min(z2.end,s+2.7),offset=side*(f.width/2+.61);
   const strip=patch(4,8,(u,v)=>track.point(mix(rs,re,u),offset+side*.061*Math.cos(v*4*Math.PI),.55+v*.32));
   part(railSheet,strip,railMetal);
   const top=track.point(s,offset+side*.12,.86),ground=track.terrain.cast(top.x,top.z);
   bar(railSheet,V(top.x,ground-.09,top.z),top,.065,railPost,7);
   if(Math.floor((s-z2.s)/5.4)%2===0)sets.add(items.post,s+1,side*(9.5+rng()),{kind:'prop',radius:.12,range:190});
   if(rng()<.39){const sz=7+rng()*9,off=-side*(17+sz*.50+rng()*6);
     sets.add(cliff,s,off,{kind:'rock',radius:sz*.51,scale:[sz,sz*(1.45+rng()),sz*.90],yaw:Math.PI*.5-f.heading+(rng()-.5)*.74,sink:-.64,range:640});}
   shorePlant(s+(rng()-.5)*3,side*(12+rng()*20),rng()<.55?'cover':'shrub');
   if(rng()<.66){const dir=rng()<.5?-1:1;sets.add(groves[Math.floor(rng()*2)],s+2,dir*(17+rng()*40),{kind:'tree',species:'árvore costeira',radius:4.4,scale:5+rng()*5.6,yaw:rng()*6.28,range:550});}
 }
 pack(railSheet);scene.add(railSheet);
 for(let s=z2.s+8;s<z2.end;s+=20)sets.add(items.fence,s,track.frame(s).curve>0?-12:12,{kind:'prop',radius:1.59,range:205});
 for(const side of [-1,1])ribbon(scene,track,z3.s-8,z3.end+7,side*5.46,side*10.50,pavers,.094);
 const step=13.05,rows=Math.ceil((z3.end-z3.s)/step),plaza=z3.s+164.0;
 for(const side of [-1,1]){
   for(let i=0;i<rows;i++){
     const s=z3.s+4.0+i*step+(side===-1?3.2:0)+(rng()-.5)*1.2;if(s>=z3.end-1)continue;
     const variant=(i*3+(side===1?2:5)+Math.floor(rng()*3))%8,house=homes[variant],setback=side===1&&Math.abs(s-plaza)<23?24:15.5+rng()*2.3;
     const f=track.frame(s),yaw=Math.atan2(-side*f.rx,-side*f.rz);
     sets.add(house.root,s,side*setback,{kind:'house',urban:true,variant,solid:true,w:house.w+.49,d:house.d+1.1,h:house.h,
       radius:Math.hypot(house.w+.49,house.d+1.1)/2,yaw,range:680});
     const bays=variant===0||variant===5?2:3,j=variant%2?bays-1:0,doorX=-house.w/2+(j+.5)*house.w/bays,doorS=s-side*doorX;
     ribbon(streetDetails,track,doorS-.79,doorS+.79,side*10.1,side*(setback-house.d/2+.1),pavers,.093);
     if(i%6===2){const a=s+step*.51;ribbon(scene,track,a-1.8,a+1.8,side*6.05,side*31,pavers,.145);}
     if(i%3===0)sets.add(items.lamp,s+2.2,side*9.8,{kind:'prop',radius:.73,range:330});
     else sets.add(items.bench,s+3.4,side*10.18,{kind:'prop',radius:.97,range:150});
     if(i%3===1||i%6===0){const off=side*(26+rng()*4);sets.add(trees['cipreste'][i%2],s+4.7,off,{kind:'tree',species:'cipreste',radius:2.2,scale:.77+rng()*.29,yaw:rng()*6.28,range:450});}
     if(i%4===0)shorePlant(s+4.9,side*12.1);
   }
 }
 ribbon(scene,track,plaza-14.4,plaza+14.4,6.3,21.6,pavers,.15);
 const pf=track.frame(plaza);
 sets.add(bellTower(art),plaza,36.3,{kind:'landmark',solid:true,radius:7.8,w:12.8,d:11.2,h:23.55,yaw:Math.atan2(-pf.rx,-pf.rz),range:1400});
 for(let i=0;i<3;i++){sets.add(items.bench,plaza-9+i*8,18.0,{kind:'prop',radius:1,range:180,yaw:-pf.heading-.5});
   sets.add(groves[i%2],plaza-10+i*10,20.3,{kind:'tree',species:'árvore costeira',radius:2.9,scale:4.8,yaw:rng()*6.28,range:450});}
 for(let s=z3.s+1;s<z3.end;s+=11.1)sets.add(items.post,s,(Math.floor(s)%2?1:-1)*9.3,{kind:'prop',radius:.12,range:110});
 pack(streetDetails);scene.add(streetDetails);bridge(scene,track,art);
 for(let start=z4.s;start<z4.end;start+=100){
   const end=Math.min(z4.end,start+100),segments=[];
   for(let s=start+.65;s<end-.35;s+=1)if(!track.onBridge(s))segments.push(s);
   if(!segments.length)continue;
   const put=(j,n)=>segments[Math.min(segments.length-1,Math.floor((j+.12+.75*rng())/n*segments.length))];
   for(const kind of ['tree','shrub','cover']){
     const n=Math.ceil(({tree:62,shrub:100,cover:155})[kind]*segments.length/100);
     for(let j=0;j<n;j++){
       const s=put(j,n),side=(j+Math.floor((start-z4.s)/100))%2?-1:1;
       const dist=(kind==='tree'?15.1:12.1)+rng()*(kind==='tree'?22.2:22.9);
       if(kind==='tree'){
         const pick=rng(),name=pick<.49?families[0]:pick<.78?families[1]:families[2],scale=.73+rng()*.61;
         sets.add(trees[name][Math.floor(rng()*2)],s,side*dist,{kind,species:name,radius:(name===families[0]?4.2:3.2)*scale,scale,yaw:rng()*6.28,range:520,tint:rng()<.28?0xd9d9bb:0xffffff});
       }else shorePlant(s,side*dist,kind);
     }
   }
   for(let j=0;j<segments.length*.38;j++){const side=j%2?1:-1,scale=8+rng()*8;
     sets.add(groves[j%2],put(j,Math.ceil(segments.length*.38)),side*(35+rng()*96),{kind:'tree',species:'árvore costeira',radius:scale*.48,scale:[scale,scale*(.95+rng()*.20),scale],yaw:rng()*6.28,range:720});}
 }
 for(let s=z4.s;s<z4.end;s+=6.5){const side=Math.floor(s/6.5)%2?1:-1;
   if(track.onBridge(s))continue;
   sets.add(items.post,s,side*9.4,{kind:'prop',radius:.13,range:140});
   if(!track.onBridge(s)&&rng()<.56)sets.add(items.fence,s,side*(12.7+rng()*3),{kind:'prop',radius:1.58,range:170});
 }
 for(const s of [track.bridge.start-13,track.bridge.start-4,track.bridge.end+4,track.bridge.end+13])for(const side of [-1,1])
   sets.add(s===track.bridge.start-4||s===track.bridge.end+4?items.lamp:items.flag,s,side*10.6,{kind:'prop',radius:.98,range:350});
 // Alternating kerb stones follow the banked road mesh.
 const curbMaterial=[m('plaster',0xe2d4b4,.87),m('plaster',0x98422e,.88)];
 const curbGroup=new T.Group();
 for(const f of track.stations){if(Math.abs(f.curve)<.0068)continue;for(const sign of [-1,1]){const a=f.width*.5*sign;
   const g=track.roadGeometry(a-sign*.34,a,.028,f.s,f.s+track.step,track.step);const p=part(curbGroup,g,curbMaterial[Math.floor(f.s/track.step)%2]);p.material.side=T.DoubleSide;p.castShadow=false;}}
 pack(curbGroup);scene.add(curbGroup);sets.flush();
 return {plaza,homes,trees};
}
