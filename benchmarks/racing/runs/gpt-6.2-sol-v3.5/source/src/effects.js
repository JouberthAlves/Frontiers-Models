import * as T from 'three';
import { randomFrom, smooth } from './course.js';

export class TrackEffects {
  constructor(scene,seed) {
    this.rng=randomFrom(seed+13);
    this.puffs=[];
    this.capacity=320;
    this.positions=new Float32Array(this.capacity*3);
    this.colors=new Float32Array(this.capacity*3);
    this.attributes=new Float32Array(this.capacity*2);
    this.geo=new T.BufferGeometry();
    this.geo.setAttribute('position',new T.BufferAttribute(this.positions,3).setUsage(T.DynamicDrawUsage));
    this.geo.setAttribute('shade',new T.BufferAttribute(this.colors,3).setUsage(T.DynamicDrawUsage));
    this.geo.setAttribute('shape',new T.BufferAttribute(this.attributes,2).setUsage(T.DynamicDrawUsage));
    const shader=new T.ShaderMaterial({
      name:'Tire smoke, dust and exhaust',
      transparent:true, depthWrite:false,
      uniforms:{ viewport:{value:innerHeight}, night:{value:0} },
      vertexShader:`attribute vec3 shade; attribute vec2 shape; uniform float viewport; varying vec3 c; varying float alpha;
        void main() { vec4 v=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*v;
          gl_PointSize=clamp(viewport*shape.x/max(1.5,-v.z),1.0,88.0);c=shade;alpha=shape.y; }`,
      fragmentShader:`varying vec3 c; varying float alpha; uniform float night;
        void main() { vec2 uv=(gl_PointCoord-.5)*2.0; float r=dot(uv,uv);float a=pow(max(0.,1.-r),2.6)*alpha;
          gl_FragColor=vec4(c*mix(1.0,.61,night),a); }`,
    });
    this.points=new T.Points(this.geo,shader);
    this.points.name='Driving particles';
    this.points.frustumCulled=false;
    this.points.renderOrder=10;
    scene.add(this.points);
    this.clear();
  }

  clear(){ this.puffs=[]; this.geo.setDrawRange(0,0); }

  update(race,dt,night,height) {
    const rng=this.rng;
    const p=race.player;
    const slipping=smooth(.04,.16,Math.abs(p.slip))*smooth(6,20,Math.abs(p.speed));
    const dusty=(p.surface==='sand'||p.surface==='dirt')&&Math.abs(p.speed)>3;
    const add=(side,flames)=>{
      const x=Math.cos(p.heading), z=Math.sin(p.heading);
      const origin=flames?2.27:1.39;
      const size=flames?.16:.45;
      const life=flames?.17+rng()*.08:.53+rng()*.54;
      this.puffs.push({x:p.x-x*origin-z*side,y:p.y+(flames?.279:.115),z:p.z-z*origin+x*side,
        vx:-x*(flames?6.2:1.8)+(rng()-.5)*.72,vy:flames?.22:1.14+rng()*.65,
        vz:-z*(flames?6.2:1.8)+(rng()-.5)*.72,
        color:flames?[3.1,.75,.13]:dusty?[.72,.48,.26]:[.61,.66,.67],
        life,max:life,size,opacity:flames?.91:dusty?.35:.26,flames});
    };
    if (p.boosting) { add(.61,true); add(-.61,true); }
    if ((dusty || slipping>.23) && rng()<dt*(dusty?39:17+slipping*30)) {
      add(.805,false);add(-.805,false);
    }
    this.puffs=this.puffs.filter(puff=>puff.life>dt).slice(-this.capacity);
    this.puffs.forEach((a,i)=>{
      a.life-=dt;a.x+=dt*a.vx;a.y+=dt*a.vy;a.z+=dt*a.vz;
      this.positions.set([a.x,a.y,a.z],i*3);
      this.colors.set(a.color,i*3);
      const life=a.life/a.max;
      this.attributes.set([a.size*(a.flames?life+.3:2.48-1.4*life),a.opacity*life],i*2);
    });
    this.geo.setDrawRange(0,this.puffs.length);
    for(const attr of Object.values(this.geo.attributes)) attr.needsUpdate=true;
    this.points.material.uniforms.night.value=Number(night);
    this.points.material.uniforms.viewport.value=height;
  }
}
