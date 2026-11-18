import * as T from 'three';
import {V,part,patch,line,bar,ellipsoid,pack} from './art.js';
import {mix,clamp,smooth} from './track.js';

export const paints=[{name:'Vermelho brasa',hex:0xb92719},{name:'Marfim',hex:0xe9dfbf},{name:'Azul maré',hex:0x26778d},{name:'Verde pinhal',hex:0x36624e},{name:'Ouro solar',hex:0xe1a338},{name:'Azul noite',hex:0x344760}];
export const numbers=['27','08','61','34','72','19'];
export const models=[{name:'Vela GT',type:'Cupê gran turismo'},{name:'Bruma RS',type:'Hatch esportivo'}];
const span=(a,b,t)=>mix(a,b,t);
function profile(stops,z){
  if(z<=stops[0][0])return stops[0][1];
  for(let i=1;i<stops.length;i++)if(z<=stops[i][0]){
    const a=stops[i-1],b=stops[i],pr=stops[Math.max(0,i-2)],nx=stops[Math.min(stops.length-1,i+1)];
    const t=(z-a[0])/(b[0]-a[0]),m0=(b[1]-pr[1])/Math.max(.01,b[0]-pr[0])*(b[0]-a[0]),m1=(nx[1]-a[1])/Math.max(.01,nx[0]-a[0])*(b[0]-a[0]);
    return (2*t*t*t-3*t*t+1)*a[1]+(t*t*t-2*t*t+t)*m0+(-2*t*t*t+3*t*t)*b[1]+(t*t*t-t*t)*m1;
  }return stops.at(-1)[1];
}
function lettering(text,plate=false) {
  const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d');
  if(plate){ctx.fillStyle='#171d20';ctx.fillRect(0,270,1024,480);ctx.strokeStyle='#a59e86';ctx.lineWidth=13;ctx.strokeRect(25,294,974,430);}
  ctx.fillStyle=plate?'#e0d8bc':'#eee8d5';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=plate?'bold 220px Arial':'italic 900 590px Arial';ctx.fillText(text,505,525);
  if(!plate){ctx.fillRect(174,790,676,10);ctx.font='bold 64px Arial';ctx.fillText('E S T R E I T O',500,860);}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;
  return new T.MeshStandardMaterial({map:t,transparent:true,alphaTest:.17,roughness:.52,metalness:.15,side:T.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
}
function rotorWheel(art,side,style) {
  const wheel=new T.Group(),rolling=new T.Group();wheel.add(rolling);
  const mat=art.material,tyre=mat('rubber',0x343331,.92),silver=mat('finish',0xb8b7af,.28,.91),spoke=mat('finish',style?0x555951:0x6a6862,.30,.86);
  const iron=mat('grain',0x8b8983,.54,.76),black=mat('rubber',0x181b1d,.83),brake=mat('finish',0xdf5630,.32,.45);
  const cyl=(radius,length,x,m)=>{const g=new T.CylinderGeometry(radius,radius,length,60);g.rotateZ(Math.PI/2);return part(rolling,g,m,x,0,0);};
  const casing=[[.214,-.115],[.273,-.128],[.313,-.119],[.334,-.090],[.337,-.058],[.337,.065],[.330,.105],[.313,.123],[.275,.134],[.232,.135],[.217,.118],[.217,-.115]];
  const rubberGeo=new T.LatheGeometry(casing.map(([radius,x])=>new T.Vector2(radius,x)),72);rubberGeo.rotateZ(-Math.PI/2);part(rolling,rubberGeo,tyre);
  const outer=.119*side;
  const ring=(radius,tube,x,m)=>{const g=new T.TorusGeometry(radius,tube,8,64);g.rotateY(Math.PI/2);return part(rolling,g,m,x);};
  ring(.311,.0028,side*.124,black);ring(.285,.002,side*.133,tyre);ring(.233,.013,outer,silver);ring(.212,.008,outer-.011*side,spoke);
  cyl(.185,.013,side*.056,iron);cyl(.092,.047,side*.075,spoke);cyl(.050,.039,outer,silver);
  for(let j=0;j<7;j++){const a=j/7*Math.PI*2+.1;
    for(const v of [-1,1]){const poly=[[.048,a+.05],[.12,a+v*.095],[.224,a+v*.20+.09],[.224,a+v*.20-.015],[.098,a-.10],[.043,a-.15]];
      const coords=poly.map(([r,b])=>new T.Vector2(Math.cos(b)*r,Math.sin(b)*r));const sh=new T.Shape(coords);
      const geo=new T.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:1,curveSegments:2});geo.rotateY(side*Math.PI/2);
      part(rolling,geo,spoke,outer-side*.009);}
    for(let k=0;k<3;k++){
      const rad=.135+k*.013,b=a+k*.10;
      const disc=new T.CircleGeometry(.004,6);disc.rotateY(side*Math.PI/2);part(rolling,disc,black,side*.064,Math.cos(b)*rad,Math.sin(b)*rad);
    }
  }
  for(let i=0;i<5;i++){const a=i*2*Math.PI/5;ellipsoid(rolling,side*.146,.031*Math.cos(a),.031*Math.sin(a),.007,.009,.009,black,10);}
  pack(rolling);ellipsoid(wheel,side*.072,.018,.152,.037,.088,.042,brake,16);
  return {wheel,rolling};
}
export function createCar(art,style=0,color=0,number=numbers[color]) {
  const root=new T.Group(),shell=new T.Group(),trim=new T.Group(),wheels=[];
  root.name=models[style].name;root.userData.kind='car';root.add(shell);shell.add(trim);
  const mat=art.material;
  const paint=new T.MeshPhysicalMaterial({...art.textures.finish,color:paints[color].hex,metalness:.58,roughness:.30,clearcoat:1,clearcoatRoughness:.075,envMapIntensity:1.36,normalScale:new T.Vector2(.055,.055),side:T.DoubleSide});paint.name='Carroceria perolizada';
  const glass=new T.MeshPhysicalMaterial({color:0x273e48,metalness:.33,roughness:.105,clearcoat:1,clearcoatRoughness:.055,envMapIntensity:1.5,transparent:true,opacity:.92,side:T.DoubleSide});glass.name='Vidro fumê';
  const black=mat('rubber',0x222629,.75,.15),lacquer=mat('finish',0x1b2225,.28,.39),alloy=mat('finish',0xb3aaa0,.29,.85),stripe=mat('finish',color===1?0x302d29:0xe2d5b5,.43,.38);
  const seat=mat('rubber',0x3e3b36,.95);
  const led=new T.MeshStandardMaterial({color:0xfff0d4,emissive:0xffe9c0,emissiveIntensity:1.75});led.name='Farol';
  const tail=new T.MeshStandardMaterial({color:0x9c0710,emissive:0xfb1625,emissiveIntensity:.78});tail.name='Lanterna';
  const A=style?-2.04:-2.25,B=style?2.01:2.23, frontAxle=style?-1.21:-1.36,rearAxle=style?1.22:1.36;
  const widths=[[A,.72],[A+.17,.87],[frontAxle,.974],[-.50,.913],[.40,.922],[rearAxle,.987],[B-.22,.947],[B,.835]];
  const centerH=style?[[A,.57],[-1.65,.70],[-.90,.85],[-.50,.87],[.7,.89],[1.41,.91],[B,.87]]:
    [[A,.54],[-1.91,.64],[-1.48,.694],[-.80,.76],[-.31,.784],[.76,.77],[1.42,.78],[1.90,.86],[B,.785]];
  const width=z=>profile(widths,z);
  const top=(u,z)=>{
    const a=Math.abs(u),wa=width(z),base=profile(centerH,z);
    const haunch=.064+.087*Math.exp(-((z-frontAxle)**2)/.37)+.105*Math.exp(-((z-rearAxle)**2)/.53);
    const crown=haunch*Math.exp(-((a-.82)**2)/.025)-Math.pow(a,8)*.050+.022*(1-a*a);
    const sweep=a*a*(.215*(1-smooth(A,A+.62,z))-.13*smooth(B-.5,B,z));
    return V(u*wa,base+crown,z+sweep);
  };
  const wheelArch=z=>{
    const d=Math.min(Math.abs(z-frontAxle),Math.abs(z-rearAxle)),r=.375;
    return d<r?.338+Math.sqrt(Math.max(0,r*r-d*d)):.172;
  };
  const sidePoint=(sign,z,t)=>{
    const p=top(sign,z),wa=width(z);
    const sill=wheelArch(p.z);const waist=.021*Math.sin(Math.PI*t)-.087*Math.pow(t,3);
    const scallop=.037*Math.sin(Math.PI*t)*Math.exp(-((z-.35)**2)/.5);
    return V(sign*(wa+waist-scallop),mix(p.y,sill,t),p.z);
  };
  part(trim,patch(44,116,(u,v)=>top(u*2-1,mix(A,B,v))),paint);
  for(const sign of [-1,1]){
    part(trim,patch(108,14,(u,v)=>sidePoint(sign,mix(A,B,u),v),sign===1),paint);
    for(const ax of [frontAxle,rearAxle]){
      const pts=[];for(let i=0;i<=26;i++){const a=Math.PI*i/26,z=ax+Math.cos(a)*.377;pts.push(V(sign*(width(z)+.008),.338+Math.sin(a)*.377,z));}
      line(trim,pts,.0135,paint);const liner=new T.TorusGeometry(.349,.027,8,56,Math.PI);liner.rotateY(Math.PI/2);part(trim,liner,black,sign*.883,.333,ax);
    }
    const sill=[V(sign*.878,.18,frontAxle+.34),V(sign*.943,.154,-.55),V(sign*.960,.163,.48),V(sign*.938,.207,rearAxle-.32)];line(trim,sill,.043,lacquer,8);
    const doorPts=[[-.73,.08],[-.65,.42],[-.52,.76],[.32,.78],[.68,.63],[.76,.27],[.71,.045]].map(([z,t])=>sidePoint(sign,z,t).add(V(sign*.002,0,0)));line(trim,doorPts,.0034,black,5);
    const handle=sidePoint(sign,.56,.15);ellipsoid(trim,handle.x+sign*.008,handle.y,handle.z,.013,.012,.073,lacquer,16);
    const nmat=lettering(number);
    const sticker=patch(16,8,(u,v)=>{const p=sidePoint(sign,mix(sign===1?.32:-.38,sign===1?-.38:.32,u),mix(.15,.74,1-v));p.x+=sign*.008;p.y+=.009;return p;});
    part(trim,sticker,nmat);
    const stalk=V(sign*.77,.846,style?-.67:-.39);bar(trim,stalk,stalk.clone().add(V(sign*.176,.11,-.05)),.020,black,8);
    const m=ellipsoid(trim,sign*.999,.97,stalk.z-.037,.123,.052,.122,paint,26);m.rotation.z=-sign*.12;
    ellipsoid(trim,sign*1.008,.966,stalk.z+.038,.097,.038,.043,alloy,16);
  }
  function capPoint(front,k,v){
    const z=front?A:B,cap=top(k,z),edge=sidePoint(1,z,1-v);
    const lower=mix(.165,.172,k*k),contour=.063*Math.sin(v*Math.PI)-.033*Math.exp(-((v-.39)**2)/.016);
    return V(k*edge.x,mix(lower,cap.y,v),cap.z+(front?-1:1)*contour*(1-k*k));
  }
  function fascia(z,front){
    part(trim,patch(60,24,(u,v)=>capPoint(front,u*2-1,v),!front),paint);
  }
  fascia(A,true);fascia(B,false);
  const cfront=style?-1.14:-.88, roofFront=style?-.54:-.21,roofRear=style?.74:.47, back=style?1.69:1.53;
  const roofTop=style?1.45:1.245;
  const cabinRise=z=>{
    const base=style?.83:.751;
    return profile([[cfront,base],[roofFront-.17,roofTop-.075],[roofFront,roofTop-.018],[(roofFront+roofRear)/2,roofTop],[roofRear,roofTop-.025],[back-.16,style?1.07:.845],[back,style?.89:.78]],z);
  };
  const belt=z=>(style?.838:.768)+.035*Math.sin((z-cfront)/(back-cfront)*Math.PI);
  const cabWidth=z=>profile([[cfront,.76],[roofFront,.625],[roofRear,.634],[back,.78]],z);
  const cab=(u,z)=>V(u*cabWidth(z),cabinRise(z)-.045*Math.pow(Math.abs(u),2),z+.049*(u*u)*Math.sign(z));
  for(const [z0,z1,m] of [[cfront,roofFront,glass],[roofFront,roofRear,paint],[roofRear,back,glass]]){
    part(trim,patch(32,26,(u,v)=>cab(2*u-1,mix(z0,z1,v))),m);
  }
  for(const sign of [-1,1]){
    const wind=(z,t)=>{const p=cab(sign,z);return V(mix(sign*(width(z)*.91),p.x,t),mix(belt(z),p.y,t),mix(z,p.z,t));};
    part(trim,patch(54,14,(u,v)=>wind(mix(cfront,back,u),v),sign===1),glass);
    for(const z of [roofFront,style?.22:.25,roofRear+.045]){
      const points=[wind(z+(z===roofFront?-.38:.10),0),wind(z+(z===roofFront?-.2:.04),.5),wind(z,1)];
      line(trim,points,z===roofFront?.032:.025,z===roofFront?paint:lacquer,8);
    }
    const beltPts=[],roofPts=[];for(let i=0;i<=18;i++){const z=mix(cfront,back,i/18);beltPts.push(wind(z,0));roofPts.push(wind(z,1));}
    line(trim,beltPts,.014,alloy);line(trim,roofPts,.019,paint,8);
    ellipsoid(trim,sign*.385,.826,.28,.256,.293,.173,seat,20);
  }
  for(const z of [cfront,back])line(trim,Array.from({length:15},(_,i)=>cab(i/7-1,z)),.013,black);
  const decal=(a,b,m,z1,z2,surface,offset=.004)=>part(trim,patch(8,42,(u,v)=>{const p=surface(mix(a,b,u),mix(z1,z2,v));p.y+=offset;return p;}),m);
  for(const [aa,bb] of [[-.455,-.404],[-.386,-.369]]){
    decal(aa,bb,stripe,A+.06,cfront-.04,top);decal(aa,bb,stripe,roofFront+.02,roofRear-.02,cab);decal(aa,bb,stripe,back+.05,B-.06,top);
  }
  const grille=(front,mid,width,floor,height,splay)=>{
    const p=(u,v)=>{const k=mid+(u*2-1)*width*(1+splay*(v-.5)), inset=1-.24*Math.pow(Math.abs(u*2-1),5);
      return capPoint(front,k,floor+height*inset*v).add(V(0,0,front?-.010:.010));};
    part(trim,patch(30,12,p,!front),black);
    const edge=[...Array.from({length:15},(_,j)=>p(j/14,0)),...Array.from({length:15},(_,j)=>p(1-j/14,1)),p(0,0)];
    for(let i=1;i<edge.length;i++)bar(trim,edge[i-1],edge[i],.0085,lacquer,6);
    for(let j=0;j<5;j++)line(trim,Array.from({length:10},(_,i)=>p(.035+i/9*.93,.105+j*.18).add(V(0,0,front?-.008:.008))),.0056,lacquer,5);
    for(let j=0;j<11;j++)bar(trim,p(.04+j*.092,.07),p(.065+j*.092,.93),.0026,black,4);
  };
  grille(true,0,.51,.098,.49,-.24);
  grille(true,-.776,.149,.153,.412,.39);grille(true,.776,.149,.153,.412,.39);
  for(const sign of [-1,1]){
    const head=(t,v)=>{const x=mix(.45,.958,t),spread=(.025+.13*Math.sin(t*Math.PI)**.63);
      const z=mix(A+.053,A+.51,t*t)+(v-.32)*spread,p=top(sign*x,z);return p.add(V(0,.010,0));};
    part(trim,patch(32,10,(u,v)=>head(u,v),sign===-1),lacquer);
    line(trim,Array.from({length:16},(_,i)=>head(i/15,.13).add(V(0,.009,0))),.009,led);
    for(let i=0;i<3;i++){const p=head(.29+i*.18,.65);ellipsoid(trim,p.x,p.y+.008,p.z,.026,.009,.017,alloy,12);}
    for(let i=0;i<3;i++){const pts=Array.from({length:7},(_,j)=>top(sign*(.43+j*.027),-.99+i*.051+j*.009).add(V(0,.004,0)));line(trim,pts,.009,lacquer,5);}
    const pts=Array.from({length:14},(_,i)=>{const u=(.33+i/13*.65)*sign,p=top(u,B);return V(p.x,p.y-.092+.012*Math.sin(i*.3),p.z+.045);});
    line(trim,pts,.046,lacquer,10);line(trim,pts.map(p=>p.clone().add(V(0,.011,.046))),.0125,tail,8);
    line(trim,pts.slice(3).map(p=>p.clone().add(V(0,-.016,.044))),.007,tail);
    const ext=new T.CylinderGeometry(.060,.072,.13,28,1,true);ext.rotateX(Math.PI/2);part(trim,ext,alloy,sign*.587,.242,B+.013);
    const hole=new T.CircleGeometry(.05,24);part(trim,hole,black,sign*.587,.242,B+.084);
  }
  grille(false,0,.85,.07,.27,.33);
  for(const x of [-.48,-.28,0,.28,.48]){const fin=new T.BoxGeometry(.015,.106,.28);part(trim,fin,black,x,.183,B-.033);}
  const badge=lettering(style?'B R S':'V E L A',true);part(trim,patch(8,5,(u,v)=>V((u-.5)*.52,.432+v*.16,B+.059),true),badge);
  for(const front of [true,false]){
    const zz=front?A:B;const points=Array.from({length:23},(_,i)=>{const p=top((i/11-1)*1.01,zz);p.z+=front?-.02:.015;p.y=.174;return p;});line(trim,points,.031,lacquer,8);
  }
  const wingZ=style?back-.03:B-.23,wingY=style?roofTop-.13:1.03;
  for(const sign of [-1,1])bar(trim,V(sign*.54,style?1.06:.82,wingZ-.02),V(sign*.56,wingY,wingZ+.043),.025,lacquer,6);
  part(trim,patch(34,8,(u,v)=>{const x=(u-.5)*(style?1.47:1.91);return V(x,wingY+.025*x*x+.019*Math.sin(v*Math.PI),wingZ+(v-.5)*.198+.05*x*x);}),style?paint:lacquer);
  const bladeWidth=style?1.47:1.91;
  part(trim,patch(36,15,(u,v)=>{const x=(u-.5)*bladeWidth,a=v*Math.PI*2;return V(x,wingY+.022*x*x-.010+.022*Math.sin(a),wingZ+.099*Math.cos(a)+.05*x*x);}),style?paint:lacquer);
  for(const sign of [-1,1]){const sh=new T.Shape([new T.Vector2(-.13,-.025),new T.Vector2(.13,-.018),new T.Vector2(.116,.072),new T.Vector2(-.074,.055)]);const g=new T.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelSize:.007,bevelThickness:.004,bevelSegments:2});g.rotateY(Math.PI/2);part(trim,g,lacquer,sign*bladeWidth*.50,wingY+.008,wingZ+.044);}
  for(const ax of [frontAxle,rearAxle])for(const sign of [-1,1]){
    const {wheel,rolling}=rotorWheel(art,sign,style);wheel.position.set(sign*.852,.337,ax);root.add(wheel);wheels.push({wheel,rolling,steers:ax===frontAxle});
  }
  pack(trim);
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=1024;const ctx=shadowCanvas.getContext('2d');
  const shadow=ctx.createRadialGradient(512,512,90,512,512,504);shadow.addColorStop(0,'rgba(18,12,8,.64)');shadow.addColorStop(.65,'rgba(18,12,8,.53)');shadow.addColorStop(1,'rgba(18,12,8,0)');
  ctx.fillStyle=shadow;ctx.fillRect(0,0,1024,1024);
  const shadowMat=new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const shadowMesh=new T.Mesh(new T.PlaneGeometry(2.8,5.3).rotateX(-Math.PI/2),shadowMat);shadowMesh.position.y=.014;root.add(shadowMesh);
  return {root,shell,wheels,paint,tail,style,color,update(c,track){
    root.position.copy(track.point(c.s,c.l));root.position.y=c.y;root.quaternion.copy(track.quaternion(c.s));root.rotateY(-c.angle);
    shell.rotation.z=-c.roll;shell.rotation.x=c.pitch*.48;shell.position.y=.006*Math.sin(c.tyrePhase*.42)*Math.min(c.speed/35,1);
    const f=track.frame(c.s);
    for(const w of wheels){const x=w.wheel.position.x,z=-w.wheel.position.z,ds=z*Math.cos(c.angle)-x*Math.sin(c.angle),dl=z*Math.sin(c.angle)+x*Math.cos(c.angle);
      const tyreContact=track.surface(c.s+ds,c.l+dl);w.wheel.position.y=.337+clamp(tyreContact-c.y-ds*f.grade-dl*f.bank,-.10,.10);
      w.wheel.rotation.y=w.steers?-c.steer*.42:0;w.rolling.rotation.x=-c.tyrePhase;}
    tail.emissiveIntensity=c.brake>.14?3.5:.72;
  }};
}
