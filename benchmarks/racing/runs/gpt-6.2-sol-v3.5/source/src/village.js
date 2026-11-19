import * as T from 'three';
import { randomFrom, SHOULDER, smooth, mix } from './course.js';
import { roadMark, strip } from './geometry.js';
import { block, branch, groundProp, SceneryBatch, textSurface } from './scenery.js';
import { lampPole } from './coast.js';

const styles = [
  { name:'Fisher house', tint:0xd7cab2, roof:0x9a492e, shutter:0x325a57, detail:'shutters' },
  { name:'Ochre town house', tint:0xceaa70, roof:0xd07749, shutter:0x596444, detail:'balcony' },
  { name:'Limestone court house', tint:0xd1c3aa, roof:0x8a5240, shutter:0x2c5a6d, detail:'planters' },
  { name:'Market shop', tint:0xb39876, roof:0xbe6950, shutter:0x426a75, detail:'awning' },
  { name:'Terraced villa', tint:0xc1a391, roof:0x99563b, shutter:0x735a43, detail:'veranda' },
  { name:'San Celso church', tint:0xd7cbb4, roof:0xaa6247, shutter:0x6a6056, detail:'tower' },
];

function castTint(geometry) {
  const p=geometry.attributes.position;
  const values=[];
  for(let i=0;i<p.count;i++){
    const b=.59+.41*smooth(.14,1.0,p.getY(i));
    values.push(b*.994,b*.98,b*.95);
  }
  geometry.setAttribute('color',new T.Float32BufferAttribute(values,3));
  return geometry;
}

function faceCut(width,height,holes) {
  const surface=new T.Shape();
  surface.moveTo(-width/2,0);
  surface.lineTo(width/2,0); surface.lineTo(width/2,height); surface.lineTo(-width/2,height);
  surface.closePath();
  for (const {x,y,w,h} of holes) {
    const hole=new T.Path();
    hole.moveTo(x-w/2,y); hole.lineTo(x-w/2,y+h);
    hole.lineTo(x+w/2,y+h); hole.lineTo(x+w/2,y); hole.closePath();
    surface.holes.push(hole);
  }
  const geom=new T.ShapeGeometry(surface);
  const v=geom.getAttribute('uv');
  for(let i=0;i<v.count;i++) v.setXY(i,v.getX(i)*.46,v.getY(i)*.47);
  return geom;
}

function windowOrDoor(add,opening,m,trim,wood,lit,rng) {
  const {x,y,w,h,door}=opening;
  const windows=door?m.door:lit;
  const edge=door?.113:.085;
  add(block(w,h,.04,x,y+h/2,-.145),windows,false);
  for(const side of [-1,1]) {
    add(block(edge,h+.074,.205,x+(w/2+edge*.49)*side,y+h/2,-.046),trim);
    add(block(w+edge*2,edge,.168,x,y+h/2+(h/2+edge*.31)*side,-.007),trim);
  }
  add(block(w+.26,.079,.32,x,y-.036,.068),trim);
  if (door) {
    add(block(.039,.092,.041,x+w*.35,y+.94,-.114),m.hardware);
  } else {
    add(block(.029,h,.036,x,y+h*.5,-.113),m.mullion,false);
    add(block(w,.026,.038,x,y+h*.45,-.110),m.mullion,false);
    if (rng()<.81) {
      for(const side of [-1,1]) {
        const swing=side*(rng()<.22 ? .31 : .07);
        const shutter=block(w*.345,h*.94,.043).rotateY(swing).translate(x+side*(w*.5+edge+w*.17),y+h*.5,.049);
        add(shutter,wood);
        for(const l of [.08,.39,.77,.91]) {
          add(block(w*.331,.029,.021,x+side*(w*.5+edge+w*.17),y+h*l,.071),m.mullion,false);
        }
      }
    }
  }
}

function roof(add,w,d,height,hips,tiles,trim,rng) {
  const width=w*.5+.26, depth=d*.5+.26;
  const pitch=.27+rng()*.13, top=height+width*pitch;
  const ridge=depth*(hips?.62:.998);
  const rows=(side)=>[
    [[0,top,-ridge],[width*side,height,-depth]],
    [[0,top,ridge],[width*side,height,depth]],
  ];
  for(const side of [-1,1]) {
    add(strip(rows(side),{ reverse:side>0,makeUV:(i,j)=>[i*depth*1.21,j*width*1.17] }),tiles);
    add(block(.072,.081,depth*2.014,side*width,height-.024,0),trim);
  }
  for(const side of [-1,1]) {
    const gable=strip([
      [[-width,height,side*depth],[width,height,side*depth]],
      [[-.003,top,side*(hips?ridge:depth)],[.003,top,side*(hips?ridge:depth)]],
    ],{ reverse:side<0,makeUV:(i,j)=>[j*width*1.8,i*1.12] });
    add(gable,hips?tiles:trim);
  }
  add(branch([0,top+.021,-ridge-.09],[0,top+.021,ridge+.09],.094,.094,12),tiles);
  for(const side of [-1,1]){
    for(let s=-depth+.1;s<depth-.06;s+=.39) {
      add(branch([side*(width-.15),height+.08,s],[side*(width+.072),height-.004,s],.051,.046,7),tiles,false);
    }
  }
  return top;
}

function placeBuilding(course,s,side,distance,w,d,style,layer) {
  const base=groundProp(course,s,side*distance);
  if (!base) return null;
  const radius=Math.hypot(w/2+.32,d/2+.44);
  const nearest=course.nearest(base.x,base.z);
  if (nearest.distance-radius < course.at(nearest.s).half+3.07) return null;
  if (course.obstacles.some(p=>p.kind==='building' && Math.hypot(p.x-base.x,p.z-base.z)<p.radius+radius+.64)) return null;
  const p={...base,radius,kind:'building',style:styles[style].name,layer,side,sunk:true};
  course.obstacles.push(p);
  return p;
}

function baseFooting(course,p,matrix,w,d) {
  const elevations = [];
  for (const x of [-1,0,1]) {
    for (const z of [-1,0,1]) {
      const target = new T.Vector3(x*w/2,0,z*d/2).applyMatrix4(matrix);
      elevations.push(course.surface(target.x,target.z)?.y ?? p.y);
    }
  }
  return { low:Math.min(...elevations),high:Math.max(...elevations) };
}

function house(batch,course,p,w,d,style,rng,m,landmarks,lamps) {
  const yaw=Math.atan2(-p.nx*p.side,-p.nz*p.side);
  const base=SceneryBatch.yaw(p.x,p.y,p.z,yaw);
  const { low,high }=baseFooting(course,p,base,w,d);
  const localHeight=Math.max(.03,high-p.y+.02);
  const footDepth=Math.max(.35,high-low+.29);
  const matrix=SceneryBatch.yaw(p.x,p.y+localHeight,p.z,yaw);
  const design=styles[style], skin=m.stucco[style], wood=m.shutters[style], tiles=m.tiles[style];
  const floors=style===5 ? 2 : (style===3||style===4||rng()<.31?3:2);
  const story=2.79+rng()*.20;
  const height=floors*story;
  p.height=height+localHeight+2.2;
  const wallZ=d/2;
  const add=(g,mat,casts=true)=>batch.add(g,mat,matrix,casts);
  add(block(w+.22,footDepth,d+.22,0,-footDepth/2+.034,0),m.stone);
  add(block(w+.25,.19,d+.24,0,.174,0),m.stone);
  add(block(w+.24,.16,d+.22,0,height-.10,0),m.trim);
  const doorHeight=2.12;
  for(const [index,faceWidth,far,rot] of [
    [0,w,wallZ,0],[1,d,w/2,Math.PI/2],[2,w,wallZ,Math.PI],[3,d,w/2,-Math.PI/2],
  ]){
    const openings=[];
    const offsetMatrix=new T.Matrix4().makeRotationY(rot).setPosition(Math.sin(rot)*far,0,Math.cos(rot)*far);
    const emit=(geom,mat,casts=true)=>add(geom.applyMatrix4(offsetMatrix),mat,casts);
    const windows=faceWidth>8.5?3:2;
    for (let f=0;f<floors;f++){
      for(let k=0;k<windows;k++){
        const x=(k-(windows-1)/2)*faceWidth/(windows+1);
        if(index===0 && f===0 && k===Math.floor(windows/2)){
          openings.push({x,y:.105,w:style===3?1.32:style===5?1.45:.94,h:doorHeight,door:true});
        } else if (f>0 || rng()>.18) {
          openings.push({x,y:f*story+(f>.0?.88:.96),w:1.04+(index===0&&style===3&&f===0?.32:rng()*.14),h:1.25+rng()*.17});
        }
      }
    }
    emit(castTint(faceCut(faceWidth,height,openings)),skin);
    for (const opening of openings) {
      windowOrDoor(emit,opening,m,m.trim,wood,m.windows[Math.floor(rng()*m.windows.length)],rng);
    }
    if (index===0) {
      const x=openings.find(e=>e.door)?.x ?? 0;
      const word=style===3?m.marketSign:style===5?m.churchSign:null;
      if(word) emit(new T.PlaneGeometry(2.24,.32).translate(x,2.59,.052),word,false);
      for (let j=0;j<Math.max(1,Math.ceil(localHeight/.18));j++ ) {
        const stepY=-.15*j-.028;
        emit(block(1.53,.183,.85+j*.24,x,stepY,.34+j*.106),m.stone);
      }
    }
  }
  const top=roof(add,w,d,height,style===2||style===4,tiles,m.roofTrim,rng);
  if (style!==5) {
    add(block(.54,.96,.67,-w*.27,top-.24,-d*.22),m.stone);
    add(block(.65,.16,.77,-w*.27,top+.251,-d*.22),m.roofTrim);
  }
  if (design.detail==='balcony'||design.detail==='veranda') {
    const span=w*(style===4?.64:.48), level=story+.82;
    add(block(span,.124,.92,.02,level,wallZ+.43),m.stone);
    add(block(span,.046,.049,.02,level+.78,wallZ+.91),m.hardware);
    for(let x=-span*.5+.06;x<span*.5-.012;x+=.19) {
      add(branch([x,level+.052,wallZ+.88],[x,level+.78,wallZ+.88],.015,.014,5),m.hardware);
    }
    for(const sign of [-1,1]){
      add(block(.046,.044,.89,span*.5*sign,level+.78,wallZ+.47),m.hardware);
      add(branch([span*.33*sign,level-.55,wallZ],[span*.33*sign,level-.041,wallZ+.75],.045,.024,6),m.stone);
    }
  }
  if (design.detail==='awning' || design.detail==='veranda') {
    const level=style===3?2.62:story+2.30;
    const width=w*.70;
    for(let i=0;i<11;i++){
      const x=(i-5)*width/11;
      const canopy=block(width/11+.014,.036,1.27).rotateX(.22).translate(x,level,wallZ+.57);
      add(canopy,i%2 ? m.canopyStripe : m.canopyLight,false);
      add(block(width/11+.005,.20,.033,x,level-.21,wallZ+1.20),i%2 ? m.canopyStripe : m.canopyLight,false);
    }
    for(const x of [-width*.46,width*.46]) {
      add(branch([x,level-.42,wallZ],[x,level-.13,wallZ+1.13],.029,.028,6),m.hardware);
    }
  }
  if (design.detail==='planters'||design.detail==='shutters') {
    for(const x of [-w*.36,w*.36]){
      add(block(.86,.25,.36,x,story+.659,wallZ+.2),m.roofTrim);
      add(new T.IcosahedronGeometry(.31,1).scale(1.3,.40,.56).translate(x,story+.823,wallZ+.20),m.hedge,false);
    }
  }
  if(style===5){
    const tx=w*.22, tz=-d*.28, towerTop=height+6.1;
    add(block(2.6,towerTop,2.58,tx,towerTop/2,tz),m.stone);
    add(block(2.79,.28,2.81,tx,towerTop-.4,tz),m.trim);
    for(const rot of [0,Math.PI/2,Math.PI,-Math.PI/2]){
      const arch=new T.Shape(); arch.moveTo(-.54,0);arch.lineTo(.54,0);arch.lineTo(.54,1.0);
      arch.absarc(0,1.0,.54,0,Math.PI,false);arch.lineTo(-.54,0);
      add(new T.ShapeGeometry(arch).translate(0,towerTop-2.46,1.297).rotateY(rot).translate(tx,0,tz),m.door,false);
      add(new T.SphereGeometry(.190,10,7).scale(1,1.43,.24).rotateY(rot).translate(tx+Math.sin(rot)*1.31,towerTop-1.52,tz+Math.cos(rot)*1.31),m.hardware);
    }
    add(new T.CylinderGeometry(.48,1.39,1.31,4).rotateY(Math.PI/4).translate(tx,towerTop+.38,tz),tiles);
    add(new T.ConeGeometry(.52,1.1,8).translate(tx,towerTop+1.38,tz),tiles);
    add(branch([tx,towerTop+1.84,tz],[tx,towerTop+2.62,tz],.036,.035,7),m.hardware);
    add(branch([tx-.28,towerTop+2.36,tz],[tx+.28,towerTop+2.36,tz],.035,.035,7),m.hardware);
    add(new T.TorusGeometry(.87,.09,12,32).translate(-w*.09,height-1.64,wallZ+.022),m.stone);
    add(new T.CircleGeometry(.81,32).translate(-w*.09,height-1.64,wallZ+.055),m.windows[1],false);
    add(block(.125,1.48,.033,-w*.09,height-1.64,wallZ+.085),m.hardware);
    add(block(1.48,.125,.034,-w*.09,height-1.64,wallZ+.085),m.hardware);
    landmarks.push({ x:p.x,y:p.y+towerTop,z:p.z });
    lamps.push({
      origin:new T.Vector3(-w*.21,.38,wallZ+5.7).applyMatrix4(matrix),
      target:new T.Vector3(tx,towerTop-3.3,tz).applyMatrix4(matrix),strength:532,
    });
    p.height=towerTop+2.6;
  }
  p.door=new T.Vector3(0,doorHeight*.5,wallZ+.38).applyMatrix4(matrix);
  p.front=new T.Vector3(0,0,1).applyAxisAngle(new T.Vector3(0,1,0),yaw);
}

function villageMats(bank,props) {
  const scan=(id,args)=>{
    const mat=bank.surface(id,{ side:T.DoubleSide,...args },{ao:id!=='frond'});
    mat.userData.primary=id;
    return mat;
  };
  const label=(s,fill,bg)=>new T.MeshStandardMaterial({ map:textSurface(s,fill,bg,'650 64px Segoe UI'),roughness:.74 });
  return {
    stucco:styles.map(s=>scan('plaster',{ name:s.name+' stucco',color:s.tint,vertexColors:true })),
    shutters:styles.map(s=>scan('wood',{ name:s.name+' painted shutters',color:s.shutter })),
    tiles:styles.map(s=>scan('tile',{ name:s.name+' tiles',color:s.roof })),
    stone:props.stone,
    trim:scan('stone',{color:0xe0d3b9,name:'Shaped window stone'}),
    roofTrim:scan('stone',{color:0xb99581,name:'Roof edge stone'}),
    door:scan('wood',{color:0x594236,name:'Recessed doors and arcades'}),
    mullion:scan('wood',{ color:0x312e29,name:'Glazing mullions' }),
    hardware:props.darkMetal,
    paving:scan('pavers',{ name:'Village laid stone pavers',color:0xa79d8c,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1 }),
    canopyStripe:scan('suede',{ name:'Ocher linen awnings',color:0xb05836,roughness:1 }),
    canopyLight:scan('suede',{ name:'Ivory linen awnings',color:0xccba85,roughness:1 }),
    hedge:scan('frond',{color:0x8aa370,name:'Window-box leaves',alphaTest:.28}),
    windows:[0xd8a26d,0x9a714a,0x2e474f,0xc09870].map((color,i)=>new T.MeshStandardMaterial({
      name:'Recessed glazing '+i, color:0x4b5b60,roughness:.28,metalness:.30,emissive:color,emissiveIntensity:0,
    })),
    marketSign:label('M E R C A T O','#efdfc7','#624536'),
    churchSign:label('S A N   C E L S O','#f0dec0','#604838'),
  };
}

function paving(batch,course,from,to,left,right,material,layer=.0) {
  const count=Math.ceil((to-from)/1.8);
  const rows=Array.from({length:count+1},(_,index)=>{
    const s=mix(from,to,index/count), p=course.at(s);
    return Array.from({length:7},(_,j)=>{
      const offset=mix(left(p),right(p),j/6);
      const spot=course.at(s,offset);
      const ground=course.surface(spot.x,spot.z)?.y ?? spot.y;
      return [spot.x,ground+layer,spot.z];
    });
  });
  batch.add(strip(rows,{ makeUV:(i,j,[x,_y,z])=>[x*.55,z*.55] }),material,null,false);
}

export function buildVillage(course,props,flora,bank) {
  const rng=randomFrom(course.config.seed+608);
  const batch=new SceneryBatch('Vetra stone and stucco blocks');
  const vegetation=new SceneryBatch('Vetra terraces and plaza trees');
  const m=villageMats(bank,props);
  const lamps=[], landmarks=[], streetfront=[];
  const begin=course.zones[2].at, end=course.zones[3].at;
  const square=begin+286;
  const alleys=[begin+116,begin+481,begin+622];
  const h=p=>p.half+SHOULDER-.06;
  paving(batch,course,begin+2,end-4,p=>-h(p)-3.25,p=>-h(p),m.paving,.047);
  paving(batch,course,begin+2,end-4,h,p=>h(p)+3.25,m.paving,.047);
  for(let s=begin+4;s<end-7;s+=12.7) {
    batch.add(roadMark(course,s,s+3.46,()=>[-.056,.056],null,props.painting).geometry,props.painting,null,false);
  }
  for(const s of alleys){
    paving(batch,course,s-2.85,s+2.85,p=>-h(p)-25,p=>-h(p)-2.7,m.paving,.031);
    paving(batch,course,s-2.95,s+2.95,p=>h(p)+2.5,p=>h(p)+24,m.paving,.031);
  }
  paving(batch,course,square-37,square+31,p=>h(p)+1.2,p=>h(p)+21.4,m.paving,.039);
  for (let s=begin+11;s<end-6;s+=17.3+rng()*4.2){
    for(const side of [-1,1]){
      const lamp=groundProp(course,s,side*(course.at(s).half+3.43));
      lampPole(batch,lamp,props,Math.PI/2-lamp.heading,lamps,{ side,height:3.66+((s%3)*.11),strength:199 });
      if(rng()<.46) {
        const post=groundProp(course,s+3.5,side*(course.at(s).half+2.21));
        const transform=SceneryBatch.yaw(post.x,post.y,post.z);
        batch.add(block(.30,.40,.31,0,.16,0),props.stone,transform);
      }
    }
  }
  for(const step of [-32,-16,14,28]){
    const s=square+step;
    const p=course.at(s);
    const off=p.half+10.6+rng()*3.3;
    flora.plant(vegetation,s,off,'olive',1.09+rng()*.24);
    const bench=groundProp(course,s-2.1,off-4.4);
    const yaw=SceneryBatch.yaw(bench.x,bench.y,bench.z,Math.PI/2-bench.heading);
    batch.add(block(1.51,.092,.43,0,.44,0),props.wood,yaw);
    for(const x of [-.59,.59]) batch.add(block(.12,.43,.41,x,.216,0),props.stone,yaw);
  }
  const church=placeBuilding(course,square+7,1,34.2,11.3,12.7,5,2);
  if (church) house(batch,course,church,11.3,12.7,5,rng,m,landmarks,lamps);
  for(const tier of [0,1,2]){
    for (const side of [-1,1]){
      for(let s=begin+11.3+tier*7.3;s<end-12;s+=(tier===0?13.4:19.9)+rng()*5.3){
        if (tier<=1&&alleys.some(a=>Math.abs(s-a)<(tier===0?9.3:7.2))) continue;
        if (side===1 && tier===0 && Math.abs(s-square)<32.1) continue;
        if (side===1 && tier===1 && Math.abs(s-square)<13.8) continue;
        const style=Math.floor(rng()*5);
        const w=7.01+rng()*3.4, d=5.71+rng()*2.4;
        const distance=course.at(s).half+(tier===0?9.88:24.1+(tier-1)*18.4)+rng()*(tier===0?1.96:6.5);
        const place=placeBuilding(course,s,side,distance,w,d,style,tier+1);
        if (!place) continue;
        house(batch,course,place,w,d,style,rng,m,landmarks,lamps);
        if(tier===0) streetfront.push(place);
        if(rng()<.24){
          const species=rng()<.46?'cypress':'olive';
          flora.plant(vegetation,s-5.7,side*(distance+2.1),species,.78+rng()*.29);
        }
      }
    }
  }
  const root=batch.finish();
  for(const p of course.obstacles.filter(p=>p.kind==='building')){
    const marker=new T.Object3D();
    marker.name=p.style;
    marker.position.set(p.x,p.y,p.z);
    marker.userData.unit={ archetype:p.style,tier:p.layer };
    root.add(marker);
  }
  return { root, vegetation:vegetation.finish(), windows:m.windows, lamps, landmarks,streetfront, square,alleys };
}
