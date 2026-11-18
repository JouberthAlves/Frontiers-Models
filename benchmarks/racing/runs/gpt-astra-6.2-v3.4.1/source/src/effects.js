import * as T from 'three';
import {random} from './track.js';
export function tyreEffects(scene,track){
 const n=96,pos=new Float32Array(n*3),size=new Float32Array(n),color=new Float32Array(n*3),life=new Float32Array(n),rng=random(731);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('pSize',new T.BufferAttribute(size,1));g.setAttribute('color',new T.BufferAttribute(color,3));
 const m=new T.ShaderMaterial({vertexColors:true,transparent:true,depthWrite:false,
 vertexShader:'attribute float pSize;varying vec3 tint;void main(){tint=color;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=pSize*410./max(.1,-p.z);}',
 fragmentShader:'varying vec3 tint;void main(){vec2 q=gl_PointCoord-.5;float d=dot(q,q);float a=.19*smoothstep(.25,.015,d);if(a<.006)discard;gl_FragColor=vec4(tint,a);}'});
 const obj=new T.Points(g,m);obj.frustumCulled=false;scene.add(obj);let index=0,carry=0;
 return {clear(){life.fill(0);size.fill(0);obj.visible=false;},update(cars,dt){obj.visible=true;carry+=dt*27;
  if(carry>=1){carry%=1;for(const c of cars){const off=Math.abs(c.l)>track.frame(c.s).width/2-.4;if(c.speed<6||(!off&&c.slip<.2))continue;
    const i=index++%n,coord=track.point(c.s-1.4,c.l+(rng()<.5?-.8:.8),.21);pos.set(coord.toArray(),i*3);life[i]=1;color.set(off?[.55,.43,.30]:[.55,.56,.56],i*3);}}
  for(let i=0;i<n;i++){if(life[i]>0){life[i]-=dt*.94;pos[i*3]+=.22*dt;pos[i*3+1]+=.65*dt;size[i]=Math.max(0,.11+(1-life[i])*.78)*Math.min(1,Math.max(0,life[i])*4);}else size[i]=0;}
  g.attributes.position.needsUpdate=g.attributes.pSize.needsUpdate=g.attributes.color.needsUpdate=true;
 }};
}
