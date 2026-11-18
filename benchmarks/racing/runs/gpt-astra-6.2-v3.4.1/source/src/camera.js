import * as T from 'three';
import { clamp } from './track.js';

export function cameraRig(track,camera) {
  let fresh=true;
  const target=new T.Vector3(),pos=new T.Vector3(),eye=new T.Vector3();
  function clear(a,b,inspect=false) {
    const steps=Math.max(3,Math.ceil(a.distanceTo(b)/1.0));
    const nearby=(track.solids||[]).filter(o=>Math.abs(o.x-a.x)<o.radius+10&&Math.abs(o.z-a.z)<o.radius+10);
    for(let i=1;i<=steps;i++){
      const f=i/steps,p=new T.Vector3().lerpVectors(a,b,f);
      const floor=track.terrain.cast(p.x,p.z);
      if(p.y<floor+.21){if(inspect)return false;b.lerpVectors(a,b,Math.max(0,(i-1)/steps));return true;}
      for(const o of nearby){if(p.y>o.y+o.h+.15||p.y<o.y-.15||Math.abs(p.x-o.x)>o.radius+.18||Math.abs(p.z-o.z)>o.radius+.18)continue;
        const dx=p.x-o.x,dz=p.z-o.z,cs=Math.cos(o.yaw),sn=Math.sin(o.yaw);
        if(Math.abs(cs*dx-sn*dz)<o.w*.5+.18&&Math.abs(sn*dx+cs*dz)<o.d*.5+.18){
          if(inspect)return false;b.lerpVectors(a,b,Math.max(0,(i-1)/steps));return true;
        }
      }
    }
    return inspect?true:false;
  }
  return {
    reset(){fresh=true;},
    chase(c,dt,hood=false,snap=false){
      const body=track.point(c.s,c.l);body.y=c.y;const f=track.frame(c.s),h=f.heading+c.angle*.64;
      const fx=Math.sin(h),fz=-Math.cos(h);
      target.set(body.x+fx*13,body.y+1+f.grade*13,body.z+fz*13);
      eye.set(body.x,body.y+1.05,body.z);
      if(hood){pos.set(eye.x+fx*.48,body.y+1.04,eye.z+fz*.48);target.y=body.y+1.02+f.grade*13;}
      else {const back=6.1+c.speed*.021;pos.set(body.x-fx*back,body.y+2.10-f.grade*back,body.z-fz*back);target.y=body.y+.96+f.grade*13;}
      clear(eye,pos);
      camera.position.lerp(pos,fresh||snap||hood?1:1-Math.exp(-dt*10));clear(eye,camera.position);
      camera.up.set(0,1,0);camera.lookAt(target);fresh=false;
      const fov=hood?68:60+clamp(c.speed/47,0,1)*12;
      if(Math.abs(camera.fov-fov)>.02){camera.fov=fov;camera.updateProjectionMatrix();}
    }, clear
  };
}
