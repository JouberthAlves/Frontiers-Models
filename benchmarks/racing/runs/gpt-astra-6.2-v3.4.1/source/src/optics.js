import * as T from 'three';
import {sunVector,V} from './art.js';

export function optics(renderer){
 const target=new T.WebGLRenderTarget(8,8,{type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter});
 target.depthTexture=new T.DepthTexture(8,8,T.UnsignedIntType);
 const u={colorBuffer:{value:target.texture},depth:{value:target.depthTexture},inverseP:{value:new T.Matrix4()},projection:{value:new T.Matrix4()},
  travel:{value:V()},bodies:{value:Array.from({length:6},()=>new T.Vector4())},sunUV:{value:new T.Vector2()},texel:{value:new T.Vector2()}};
 const mat=new T.ShaderMaterial({uniforms:u,depthTest:false,depthWrite:false,
  vertexShader:'varying vec2 at;void main(){at=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:`varying vec2 at;uniform sampler2D colorBuffer,depth;uniform mat4 inverseP,projection;uniform vec3 travel;uniform vec4 bodies[6];uniform vec2 sunUV,texel;
  void main(){
    vec3 c=texture2D(colorBuffer,at).rgb;float z=texture2D(depth,at).r;
    vec4 vp=inverseP*vec4(at*2.-1.,z*2.-1.,1.);vec4 old=projection*vec4(vp.xyz/vp.w+travel,1.);
    vec2 motion=clamp(at-(old.xy/old.w*.5+.5),vec2(-.011),vec2(.011));
    float mask=0.;for(int i=0;i<6;i++){vec4 body=bodies[i];mask=max(mask,step(body.x,at.x)*step(at.x,body.z)*step(body.y,at.y)*step(at.y,body.w));}
    vec3 blur=(texture2D(colorBuffer,at-motion*.33).rgb+texture2D(colorBuffer,at-motion*.72).rgb)*.5;
    c=mix(c,blur,(1.-mask)*.61*step(z,.9997));
    vec3 bright=max(texture2D(colorBuffer,at+texel*2.5).rgb-vec3(1.4),0.)+max(texture2D(colorBuffer,at-texel*2.5).rgb-vec3(1.4),0.);
    c+=bright*.012;
    if(sunUV.x>0.&&sunUV.x<1.&&sunUV.y>0.&&sunUV.y<1.&&texture2D(depth,sunUV).r>.9998){
      vec2 q=(at-sunUV)*vec2(1.76,1.);float haze=exp(-dot(q,q)*90.);
      vec2 g=(at-(.5+(.5-sunUV)*.53))*vec2(1.76,1.);float ghost=exp(-dot(g,g)*620.);
      c+=vec3(.066,.032,.012)*haze+vec3(.010,.013,.011)*ghost;
    }
    gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`});
 const scene=new T.Scene(),g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const screen=new T.Mesh(g,mat);screen.frustumCulled=false;scene.add(screen);
 const camera2D=new T.Camera(),dims=new T.Vector2(),corners=[];
 for(const x of [-1.09,1.09])for(const y of [-.04,1.57])for(const z of [-2.39,2.39])corners.push(V(x,y,z));
 return (world,camera,models,car,f,hood)=>{
  renderer.getDrawingBufferSize(dims);if(target.width!==dims.x||target.height!==dims.y){target.setSize(dims.x,dims.y);u.texel.value.set(1/dims.x,1/dims.y);}
  camera.updateMatrixWorld();
  u.inverseP.value.copy(camera.projectionMatrixInverse);u.projection.value.copy(camera.projectionMatrix);
  u.travel.value.set(f.tx,f.grade,f.tz).transformDirection(camera.matrixWorldInverse).multiplyScalar(car.speed*.0105);
  for(let i=0;i<models.length;i++){const rect=u.bodies.value[i],model=models[i].root;rect.set(1,1,0,0);if(!model.visible)continue;model.updateWorldMatrix(true,false);
    for(const q of corners){const p=q.clone().applyMatrix4(model.matrixWorld).project(camera);if(p.z>=1||p.z< -1)continue;const x=p.x*.5+.5,y=p.y*.5+.5;
      rect.x=Math.min(rect.x,x-.002);rect.z=Math.max(rect.z,x+.002);rect.y=Math.min(rect.y,y-.002);rect.w=Math.max(rect.w,y+.002);}}
  if(hood)u.bodies.value[0].set(0,0,1,.34);
  const sp=camera.position.clone().addScaledVector(sunVector,950).project(camera);u.sunUV.value.set(sp.x*.5+.5,sp.z<=1?sp.y*.5+.5:-1);
  renderer.setRenderTarget(target);renderer.render(world,camera);renderer.setRenderTarget(null);renderer.render(scene,camera2D);
 };
}
