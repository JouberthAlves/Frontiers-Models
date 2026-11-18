import * as T from 'three';
import { V,part,bar,line,patch,pack,ellipsoid,leafLighting } from './art.js';
import { random,mod,mix } from './track.js';

export function box(parent,x,y,z,w,h,d,m) {return part(parent,new T.BoxGeometry(w,h,d),m,x,y,z);}
export function canvasSign(text,bg,fg,opts={}) {
  const c=document.createElement('canvas');c.width=2048;c.height=1024;
  const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,2048,1024);
  if(opts.pattern){g.fillStyle=opts.pattern;for(let i=-3;i<13;i++){g.beginPath();g.moveTo(140*i,0);g.lineTo(140*i+80,0);g.lineTo(140*i-150,1024);g.lineTo(140*i-230,1024);g.fill();}}
  g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.font='italic 900 '+(opts.size||235)+'px Arial';
  g.save();g.translate(1024,512);g.scale(1,opts.stretch||1);g.fillText(text,0,0,1850);g.restore();
  const t=new T.CanvasTexture(c);t.name=text;t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;
  return new T.MeshStandardMaterial({map:t,roughness:.71,side:T.DoubleSide});
}
export class Scenery {
  constructor(scene,track,art) {this.scene=scene;this.track=track;this.art=art;this.batch=new Map();this.chunks=[];this.serial=0;this.rng=random(track.data.seed);this.templates={};}
  scan(name,color=0xffffff) {const g=new T.Group();part(g,this.art.scans[name],this.art.material(name,color,.93));return g;}
  add(template,s,l,opts={}) {
    const f=this.track.frame(s),x=f.x+f.rx*l,z=f.z+f.rz*l,y=this.track.terrain.cast(x,z);
    const scale=opts.scale||1,sc=Array.isArray(scale)?V(...scale):V(scale,scale,scale);
    const yaw=opts.yaw??-f.heading, pos=V(x,y+(opts.sink||0),z);
    const transform=new T.Matrix4().compose(pos,new T.Quaternion().setFromEuler(new T.Euler(opts.tilt||0,yaw,opts.roll||0,'YXZ')),sc);
    const rp=this.track.nearest(x,z);
    const entity={id:(opts.kind||'structure')+'-'+(++this.serial),kind:opts.kind||'structure',species:opts.species,variant:opts.variant,
      x,z,y:pos.y,s:rp.s,l:rp.l,radius:opts.radius??.28,w:opts.w||.5,d:opts.d||.5,h:opts.h||1,yaw,solid:!!opts.solid,
      urban:opts.urban||false,zone:this.track.zone(rp.s).id,infrastructure:!!opts.infrastructure};
    if(!entity.infrastructure)this.track.objects.push(entity);
    this.instance(template,transform,entity,opts);
    return entity;
  }
  instance(template,transform,entity,opts={}) {
    template.updateMatrixWorld(true);
    const tile=Math.floor(entity.x/90)+','+Math.floor(entity.z/90);
    template.traverse(o=>{if(!o.isMesh)return;
      const key=tile+'|'+o.geometry.uuid+o.material.uuid+'|'+(opts.range||850);
      if(!this.batch.has(key))this.batch.set(key,{tile,geo:o.geometry,material:o.material,mats:[],ids:[],tints:[],range:opts.range||850,cast:opts.cast!==false});
      const r=this.batch.get(key);r.mats.push(new T.Matrix4().multiplyMatrices(transform,o.matrixWorld));r.ids.push(entity);r.tints.push(opts.tint??0xffffff);
    });
  }
  flush() {
    for(const r of this.batch.values()){
      const mesh=new T.InstancedMesh(r.geo,r.material,r.mats.length);
      for(let i=0;i<r.mats.length;i++){mesh.setMatrixAt(i,r.mats[i]);mesh.setColorAt(i,new T.Color(r.tints[i]));}
      mesh.castShadow=r.cast;mesh.receiveShadow=true;mesh.computeBoundingSphere();mesh.userData.entities=r.ids;mesh.userData.range=r.range;
      this.scene.add(mesh);this.chunks.push(mesh);
    }
    this.batch.clear();
  }
  cull(camera,low=false,map=false){
    for(const m of this.chunks){const p=m.boundingSphere,range=m.userData.range*(low?.64:1)+p.radius;m.visible=map||camera.position.distanceToSquared(p.center)<range*range;}
  }
}
export function palm(art,variant=0) {
  const g=new T.Group(),rng=random(6341+variant*351),h=7.2+variant*.61,lean=.50+rng()*.48;
  const mat=art.material, bark=mat('bark',0xa39176,.95),leaf=mat('grain',0x536537,.89);
  leaf.side=T.DoubleSide;
  const trunk=new T.CatmullRomCurve3([V(0,0,0),V(.04,h*.32,0),V(lean*.36,h*.74,.12),V(lean,h,.24)]);
  const trunkG=patch(15,44,(u,v)=>{const p=trunk.getPoint(v),a=u*Math.PI*2,r=(.255*(1-v)+.130*v)*(1+.075*Math.sin(v*125));return p.add(V(r*Math.cos(a),0,r*Math.sin(a)));},false);
  part(g,trunkG,bark);
  const tip=trunk.getPoint(1),p=[],idx=[],uv=[],col=[];
  const leaflets=(a,len,lift,fall)=>{
    const radial=V(Math.cos(a),0,Math.sin(a)),right=V(-Math.sin(a),0,Math.cos(a));
    const bend=(t)=>tip.clone().addScaledVector(radial,len*t).add(V(0,Math.sin(t*Math.PI)*lift-t*t*fall,0));
    const stemPoints=Array.from({length:8},(_,i)=>bend(i/7));line(g,stemPoints,.020,mat('timber',0x807c40,.91),5);
    for(let i=0;i<28;i++)for(const side of [-1,1]){
      const t=.045+i/30,base=bend(t),span=(.19+.61*Math.pow(Math.sin(t*Math.PI),.65))*(1+.18*rng());
      const mid=base.clone().addScaledVector(right,side*span*.52).addScaledVector(radial,.14);
      const end=base.clone().addScaledVector(right,side*span).addScaledVector(radial,.30+.19*t).add(V(0,-span*(.26+.35*t),0));
      const k=p.length/3,wd=.046+.026*(1-t);
      const points=[base.clone().addScaledVector(radial,-wd),base.clone().addScaledVector(radial,wd),mid.clone().addScaledVector(radial,-wd*.78),mid.clone().addScaledVector(radial,wd*.78),end];
      const shade=.71+rng()*.29;for(const v of points){p.push(v.x,v.y,v.z);col.push(shade,.86+shade*.13,.73+shade*.20);}
      uv.push(0,0,1,0,0,.55,1,.55,.5,1);idx.push(k,k+1,k+2,k+2,k+1,k+3,k+2,k+3,k+4);
    }
  };
  for(let j=0;j<19;j++){const a=j*2.39996+rng()*.25,layer=j/19;
    leaflets(a,2.2+rng()*.94-layer*.70,.60+rng()*.47+layer*1.1,1.2-layer*2.3+rng()*.51);}
  const fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(p,3));fg.setAttribute('color',new T.Float32BufferAttribute(col,3));fg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));fg.setIndex(idx);fg.computeVertexNormals();part(g,fg,leaf);
  for(let i=0;i<7;i++)ellipsoid(g,tip.x+Math.cos(i)*.17,tip.y-.15-i%3*.09,tip.z+Math.sin(i)*.17,.125,.19,.12,mat('bark',0x776139,.90),10);
  return pack(g);
}
export function grove(art,i){
 const group=new T.Group(),shape=art.groveShapes[i],m=new T.MeshStandardMaterial({map:art.groveMaps[i],normalMap:art.textures.finish.normalMap,roughnessMap:art.textures.finish.roughnessMap,normalScale:new T.Vector2(.035,.035),color:0xd2daa9,side:T.DoubleSide,roughness:.92,alphaTest:.28});
 m.name='Copa e ramos costeiros '+i;
 leafLighting(m);
 for(let axis=0;axis<2;axis++)for(let j=0;j<3;j++){
   const d=(1-j)*((axis?shape.x:shape.z)/3),g=new T.PlaneGeometry(1,1,4,4);
   const uv=g.attributes.uv,pos=g.attributes.position,norm=g.attributes.normal;
   for(let k=0;k<uv.count;k++){
     uv.setXY(k,(uv.getX(k)+j)/3,(uv.getY(k)+(axis?0:1))/2);
     const x=pos.getX(k),y=pos.getY(k);
     norm.setXYZ(k,x*.7,.89+Math.max(0,y)*.6,.30);
   }
   if(axis){g.rotateY(Math.PI/2);g.translate(d,shape.y/2,0);}else g.translate(0,shape.y/2,d);
   part(group,g,m);
 }return pack(group);
}
export function roadItems(art) {
 const m=art.material,iron=m('finish',0x555d59,.45,.67),stone=m('pavers',0xe1ccb0,.92),wood=m('timber',0x9c7953,.96),white=m('plaster',0xe5decb,.80),red=m('finish',0xa53624,.62);
 const post=new T.Group();
 part(post,new T.CylinderGeometry(.074,.11,.82,12),white,0,.41);part(post,new T.CylinderGeometry(.081,.085,.115,12),red,0,.66);part(post,new T.CylinderGeometry(.082,.09,.037,12),iron,0,.817);
 const fence=new T.Group();for(const z of [-1.55,1.55]){
   const b=box(fence,0,.61,z,.11,1.22,.13,wood);b.rotation.z=.028*Math.sign(z);
 }for(const y of [.41,.86])bar(fence,V(0,y,-1.55),V(0,y,1.55),.036,wood,5);
 const lamp=new T.Group();bar(lamp,V(0,0,0),V(0,5.9,0),.094,iron,10,.052);line(lamp,[V(0,5.73,0),V(0,6.05,.07),V(0,6.15,.41),V(0,6.09,.68)],.052,iron);
 ellipsoid(lamp,0,6.06,.67,.13,.082,.28,iron,14);ellipsoid(lamp,0,6.016,.68,.109,.041,.249,white,12);part(lamp,new T.CylinderGeometry(.14,.21,.34,12),stone,0,.17);
 const flag=new T.Group(),flagM=canvasSign('ESTREITO','#a92e20','#f5e9cf',{size:232});bar(flag,V(0,0,0),V(0,4.9,0),.047,iron,10,.031);
 const banner=patch(12,8,(u,v)=>V(Math.sin(u*3+v*1.1)*u*.12,1.5+v*3.35-.23*u*u,-u*.92));part(flag,banner,flagM);
 const bench=new T.Group();for(const z of [-.62,.62]){box(bench,0,.22,z,.41,.44,.16,stone);}for(let i=0;i<4;i++)box(bench,-.17+i*.11,.47,0,.09,.079,1.86,wood);
 for(let i=0;i<2;i++)box(bench,.24,.70+i*.16,0,.07,.12,1.80,wood);
 const parasol=new T.Group();bar(parasol,V(),V(.03,2.36,0),.037,wood);const cloth=m('plaster',0xe9d6ad,.89),coral=m('plaster',0xab5937,.89);
 for(let k=0;k<12;k++){const g=patch(4,5,(u,v)=>{const a=(k+u)*Math.PI/6,r=.016+v*1.22;return V(Math.cos(a)*r,2.38-v*.51-.07*Math.sin(u*Math.PI)*v,Math.sin(a)*r);});const c=k%2?cloth:coral;c.side=T.DoubleSide;part(parasol,g,c);}
 const rail=new T.Group();
 for(const z of [-1.8,1.8]){box(rail,0,.48,z,.11,.96,.16,iron);box(rail,.057,.74,z,.028,.16,.08,white);}
 part(rail,patch(8,2,(u,v)=>V(.10+.048*Math.cos(u*4*Math.PI),.55+u*.37,(v-.5)*4),true),iron);
 return Object.fromEntries(Object.entries({post,fence,lamp,flag,bench,parasol,rail}).map(([k,g])=>[k,pack(g)]));
}
export function gantry(art) {
  const g=new T.Group(),m=art.material,legs=m('finish',0x303c3c,.46,.63),red=m('finish',0xb43221,.45,.36),light=m('plaster',0xdacfbc,.88);
  for(const x of [-7.13,7.13]){
    box(g,x,.28,0,.82,.56,1.29,light);
    for(const z of [-.36,.36])bar(g,V(x,.5,z),V(x,5.18,z),.11,legs,8);
    for(let j=0;j<5;j++)bar(g,V(x,.6+j*.9,-.36),V(x,1.50+j*.9,.36),.042,red,6);
  }
  for(const z of [-.33,.33])for(const y of [5.1,5.96])bar(g,V(-7.22,y,z),V(7.22,y,z),.063,legs);
  for(let i=0;i<15;i++)bar(g,V(-7+i,5.12,-.33),V(-6+i,5.95,-.33),.039,light,6);
  const sign=canvasSign('C O S T A   D O U R A D A','#203533','#f1e6c9',{size:160,stretch:3.5});
  box(g,0,5.55,.02,13.9,.94,.56,legs);for(const z of [-.282,.319]){const f=part(g,new T.PlaneGeometry(13.85,.87),sign,0,5.55,z);if(z<0)f.rotation.y=Math.PI;}
  for(const x of [-5.75,5.75])for(let n=0;n<4;n++){const q=box(g,x+n*.20,5.55,.333,.090,.70,.028,n%2?light:red);q.rotation.z=-.34;}
  return pack(g);
}
