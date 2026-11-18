import * as T from 'three';
import { mix,smooth,mod } from './track.js';
import { V,part,patch,sunVector } from './art.js';
import { Scenery,palm,roadItems,gantry,grove } from './scenery.js';

export function coastWorld(track,scene,art) {
 const sets=new Scenery(scene,track,art),items=roadItems(art),rng=sets.rng,rocks=[],palms=[palm(art,0),palm(art,1),palm(art,2)];
 const reef=new T.Group(),cliff=sets.scan('cliff'),grass=sets.scan('grass',0xb0a97b),shrub=sets.scan('shrub',0xa4aa7c);
 for(let k=0;k<3;k++){const geo=new T.IcosahedronGeometry(1,5),pos=geo.attributes.position,uv=geo.attributes.uv;
   for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),d=.89+.13*Math.sin(x*5+z*3+k)*Math.cos(y*4-z*4)+.065*Math.cos(x*13+y*8);
     pos.setXYZ(i,x*d*(.31-k*.045)+.16*k-.12,Math.max(-.12,y*d*.19+.060)-k*.017,z*d*(.34-k*.04)+.14*Math.sin(k*2.31));
     uv.setXY(i,uv.getX(i)*1.7,uv.getY(i)*1.35);}
   geo.computeVertexNormals();part(reef,geo,art.material('rock',k%2?0x958b7d:0xaca49b,.76));}
 const groves=[grove(art,0),grove(art,1)];
 const origin=track.frame(0),shoreLo=-155,shoreEnd=track.zones[0].end;
 for(let s=shoreLo;s<shoreEnd;s+=6.8){
   const f=track.frame(s),d=(track.shoreX(f.z)-f.x)/f.rx;
   if(rng()<.78)sets.add(items.fence,s,d+9.2+rng()*1.3,{kind:'prop',radius:1.59,yaw:-f.heading+.14*(rng()-.5),range:245});
   sets.add(items.post,s,9.4+Math.sin(s*.039)*.27,{kind:'prop',radius:.12,range:225});
   if(rng()<.46)sets.add(items.fence,s,13+rng()*1.7,{kind:'prop',radius:1.58,range:190});
   if(rng()<.47){
     const l=d+2-rng()*7,size=2.9+rng()*4.9,angle=rng()*6.28;
     const o=sets.add(reef,s,l,{kind:'rock',radius:size*.48,scale:[size,1.16*size,size*.87],yaw:angle,sink:-.13,range:410});
     rocks.push({x:o.x,z:o.z,r:size*.51});
   }
   for(const side of [-1,1])for(let j=0;j<3;j++){
     const dist=side<0?13+rng()*Math.max(4,Math.abs(d)-19):12+rng()*45,ss=s+rng()*7,l=side*dist;
     const sh=rng()<.36&&side>0,scale=(sh?1.5:1.1)+rng()*(sh?1.9:1.5);
     sets.add(sh?shrub:grass,ss,l,{kind:sh?'shrub':'cover',species:sh?'lentisco':'capim-das-dunas',radius:.53*scale,scale:[scale,scale*(sh?1.17:.95),scale],yaw:rng()*6.28,range:sh?150:100});
   }
 }
 for(let s=shoreLo;s<shoreEnd;s+=11+rng()*8){
   const group=2+Math.floor(rng()*4);
   for(let k=0;k<group;k++){const ss=s+rng()*17,l=19+rng()*63,scale=5.2+rng()*8.2,variant=Math.floor(rng()*2);
     sets.add(groves[variant],ss,l,{kind:'tree',species:'árvore costeira',radius:scale*.49,scale:[scale,scale*(.79+rng()*.22),scale],yaw:rng()*6.28,range:730,tint:rng()<.45?0xe3e5bf:0xffffff});}
 }
 const sprayFocus=track.frame(154),shore=(track.shoreX(sprayFocus.z)-sprayFocus.x)/sprayFocus.rx;
 for(let i=0;i<9;i++){const size=i===0?6.1:1.7+rng()*4,offset=i===0?0:rng()*11-5.5;
   const r=sets.add(reef,154+offset,shore-1.9+(i===0?0:rng()*7-3.5),{kind:'rock',radius:size*.49,scale:[size,size*.98,size*.89],yaw:rng()*6.28,sink:-.14,range:360});
   rocks.unshift({x:r.x,z:r.z,r:size*.42});}
 for(let s=-116;s<shoreEnd;s+=19+rng()*18){
   const side=rng()<.48?-1:1,l=side*(12.7+rng()*6);
   sets.add(palms[Math.floor(rng()*3)],s,l,{kind:'tree',species:'palmeira',radius:3.5,scale:.84+rng()*.43,yaw:rng()*6.28,range:490});
   if(rng()<.5)sets.add(palms[Math.floor(rng()*3)],s+4+rng()*4,l+side*3.4,{kind:'tree',species:'palmeira',radius:3.35,scale:.64+rng()*.37,yaw:rng()*6.28,range:490});
 }
 for(let s=-130;s<shoreEnd;s+=30){
   sets.add(items.lamp,s,10.4,{kind:'prop',radius:.72,range:460});
   if(s<140||s>445)sets.add(items.flag,s+8,-9.9,{kind:'prop',radius:.97,range:320,yaw:-track.frame(s).heading+1.13});
   if(s>-40&&s<355){sets.add(items.bench,s+12,-12.2,{kind:'prop',radius:1.03,range:190});}
   const f=track.frame(s),d=(track.shoreX(f.z)-f.x)/f.rx;
   if(rng()<.42&&s>30)sets.add(items.parasol,s+4,d+7.2,{kind:'prop',radius:1.3,scale:.86+rng()*.2,yaw:rng()*6,range:260});
 }
 const arch=gantry(art);const obj={id:'gantry',kind:'structure',x:origin.x,z:origin.z};
 sets.instance(arch,new T.Matrix4().compose(track.point(0),track.quaternion(0),V(1,1,1)),obj);
 // Stone transition between the promenade and fine dune sand follows the terrain collider.
 const pavement=patch(3,Math.ceil((shoreEnd-shoreLo)/3),(u,v)=>{
   const f=track.frame(mix(shoreLo,shoreEnd,v)),l=-f.width/2-.18-u*3.45;
   const x=f.x+l*f.rx,z=f.z+l*f.rz;return V(x,track.terrain.cast(x,z)+.041,z);});
 const uv=pavement.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.8,uv.getY(i)*(shoreEnd-shoreLo)/4);
 const walk=part(scene,pavement,art.material('pavers',0xb3a18c,.90));walk.castShadow=false;
 const ocean=sea(track,scene,art,rocks);
 sets.flush();
 return {sets,items,palms,reef,cliff,grass,shrub,groves,rocks,ocean};
}
function sea(track,scene,art,rocks){
 const coast=track.stations[0],bank=track.data.points[track.zones[1].start][2],time={value:0},count=32;
 const byStart=rocks.slice().sort((a,b)=>Math.abs(a.z-track.frame(154).z)-Math.abs(b.z-track.frame(154).z)).slice(0,count);
 const rockVec=Array.from({length:count},(_,i)=>{const r=byStart[i];return r?V(r.x,r.z,r.r):V(1e5,1e5,1);});
 const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{clock:time,sunDir:{value:sunVector},skyTex:{value:art.sky},rockCenters:{value:rockVec},origin:{value:new T.Vector2(coast.x,coast.z)},cliffZ:{value:bank}},
 vertexShader:`varying vec3 pt;uniform float clock;
 void main(){pt=(modelMatrix*vec4(position,1.)).xyz;pt.y+=.047*sin(pt.z*.67+clock*1.1+pt.x*.25)+.061*sin(pt.x*.41+pt.z*.14-clock*.96);gl_Position=projectionMatrix*viewMatrix*vec4(pt,1.);}`,
 fragmentShader:`
 varying vec3 pt; uniform float clock,cliffZ;uniform vec2 origin;uniform vec3 sunDir,rockCenters[32];uniform sampler2D skyTex;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.13,311.77)))*43758.5453);}
 float noise(vec2 p){vec2 f=fract(p);f=f*f*(3.-2.*f);vec2 i=floor(p);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 float wave(vec2 p){float off=noise(p*.24+clock*.085)*2.4;return .064*sin(p.x*.63+p.y*.18+clock*1.16+off)+.039*sin(p.x*1.22-p.y*.49-clock*1.55+.85*sin(p.y*.34)+off)+.021*sin(p.x*2.94+p.y*1.62+clock*2.12+off*1.2)+.016*sin(p.x*4.65-p.y*2.71-clock*1.73)+.029*noise(p*2.6+clock*.31);}
 void main(){vec2 p=pt.xz;float sx=origin.x-36.+7.*sin((p.y-origin.y)*.016)+4.*sin((p.y+67.)*.034)+smoothstep(0.,1.,(cliffZ+14.-p.y)/239.)*78.+smoothstep(0.,1.,(cliffZ-150.-p.y)/480.)*160.;
 float dist=sx-p.x, depth=max(0.,dist*.123);vec3 view=normalize(cameraPosition-pt);float h=wave(p);
 float lod=1.-smoothstep(70.,260.,distance(cameraPosition,pt));vec3 n=normalize(vec3((h-wave(p+vec2(.13,0)))/.13,.85,(h-wave(p+vec2(0,.13)))/.13)*vec3(.37+lod*.63,1.,.37+lod*.63));
 vec3 r=reflect(-view,n);
 float f=.025+.75*pow(1.-max(0.,dot(view,n)),4.4);vec3 sky=mix(vec3(.71,.49,.34),vec3(.20,.38,.50),smoothstep(.035,.65,r.y));
 float gold=pow(max(0.,dot(r,sunDir)),mix(92.,305.,lod));
 vec3 water=mix(vec3(.080,.38,.30),vec3(.017,.13,.17),smoothstep(.1,3.9,depth));
 water*=.87+.18*noise(p*.095)+.035*sin(p.x*2.4+sin(p.y)+clock);
 vec3 col=mix(water,sky,f)+vec3(3.4,1.77,.70)*gold;
 float shore=dist+1.1*sin(p.y*.29+clock*.9)+.72*sin(p.y*.87-clock*.75)+.42*noise(p*.87);
 float foam=exp(-pow((shore-1.2)/1.4,2.))+.69*exp(-pow((shore-4.0-.9*sin(clock+p.y*.23))/.54,2.));
 if(depth<3.4 && lod>.0){for(int i=0;i<32;i++){vec3 rock=rockCenters[i];float rim=length((p-rock.xy)*vec2(1.,.90))-rock.z*.76+.18*sin(clock*1.3+p.y*2.2);foam=max(foam,exp(-abs(rim)*2.2));}}
 float fray=noise(p*4.3+vec2(clock*.39,0))*.36+noise(p*1.31-vec2(clock*.33,.0))*.36+noise(p*12.7+clock*.19)*.28;
 foam=smoothstep(.33,.92,foam*(.18+fray*1.33));col=mix(col,vec3(.98,.94,.82),foam*.82);
 col=mix(col,vec3(.60,.44,.34),smoothstep(200.,1750.,distance(cameraPosition,pt))*.69);
 gl_FragColor=vec4(col,clamp(.45+depth*.27+f*.6+foam*.52,.46,1.));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 const mesh=new T.Mesh(new T.PlaneGeometry(12500,9000,200,150).rotateX(-Math.PI/2),mat);mesh.position.set(-2300,track.data.seaLevel+.026,-220);mesh.renderOrder=1;scene.add(mesh);
 return {update(t){time.value=t;},mesh};
}
