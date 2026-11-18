import * as T from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export function patch(nx,ny,fn,reverse=false) {
  const p=[],uv=[],ind=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const q=fn(i/nx,j/ny);p.push(q.x,q.y,q.z);uv.push(i/nx,j/ny);
    if(i<nx&&j<ny){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;
      if(reverse)ind.push(a,b,c,b,d,c);else ind.push(a,c,b,b,c,d);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ind);g.computeVertexNormals();return g;
}
export function part(parent,g,m,x=0,y=0,z=0) {
  const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function bar(parent,a,b,r,m,sides=8,r2=r) {
  const d=b.clone().sub(a),g=new T.CylinderGeometry(r2,r,d.length(),sides);
  const mesh=part(parent,g,m);mesh.position.addVectors(a,b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return mesh;
}
export function line(parent,points,r,mat,sides=6){
  const c=new T.CatmullRomCurve3(points);return part(parent,new T.TubeGeometry(c,Math.max(8,points.length*5),r,sides,false),mat);
}
export function ellipsoid(parent,x,y,z,wx,wy,wz,m,res=20){
  const g=new T.SphereGeometry(1,res,Math.max(8,res/2));g.scale(wx,wy,wz);return part(parent,g,m,x,y,z);
}
export function pack(group) {
  group.updateWorldMatrix(true,true);
  const inverse=group.matrixWorld.clone().invert(),batches=new Map();
  group.traverse(o=>{
    if(!o.isMesh||o.isInstancedMesh)return;
    const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
    for(const k of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(k))geo.deleteAttribute(k);
    if(!geo.attributes.uv)geo.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(geo.attributes.position.count*2),2));
    geo.applyMatrix4(inverse.clone().multiply(o.matrixWorld));
    if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(geo);
  });
  group.clear();
  for(const [m,geos] of batches){const geo=mergeGeometries(geos,false);geo.computeBoundingSphere();part(group,geo,m);for(const g of geos)g.dispose();}
  return group;
}
export async function loadArt(progress=()=>{}) {
  const names=['road','sand','earth','meadow','rock','finish','grain','plaster','timber','tiles','stone','rubber','reef','cliff','shrub','grass','needles','leaves','bark','pavers'],textures={};
  const alphas=['shrub','grass','needles','leaves'],geometryNames=['reef','cliff','shrub','grass'],scans={};
  const groveMaps=[];let groveShapes,wildGrass,bushMap;
  let done=0;const total=names.length*3+2+alphas.length+geometryNames.length+5;
  const loader=new T.TextureLoader(), promises=[];
  for(const name of names){
    textures[name]={};
    for(const [slot,file] of [['map','color'],['normalMap','normal'],['roughnessMap','rough']]){
      promises.push(loader.loadAsync('./assets/surfaces/'+name+'-'+file+'.jpg').then(t=>{
        t.colorSpace=slot==='map'?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;t.name=name+' '+file;
        textures[name][slot]=t;progress(++done/total);
      }));
    }
  }
  for(const name of alphas)promises.push(loader.loadAsync('./assets/surfaces/'+name+'-alpha.jpg').then(t=>{t.name=name+' alpha';textures[name].alphaMap=t;progress(++done/total);}));
  for(let i=0;i<2;i++)promises.push(loader.loadAsync('./assets/surfaces/grove'+i+'.webp').then(t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;groveMaps[i]=t;progress(++done/total);}));
  promises.push(loader.loadAsync('./assets/surfaces/wild-grass.webp').then(t=>{t.colorSpace=T.SRGBColorSpace;wildGrass=t;progress(++done/total);}));
  promises.push(loader.loadAsync('./assets/surfaces/lentisco.webp').then(t=>{t.colorSpace=T.SRGBColorSpace;bushMap=t;progress(++done/total);}));
  promises.push(fetch('./assets/geometry/grove.json').then(r=>r.json()).then(s=>{groveShapes=s;progress(++done/total);}));
  for(const name of geometryNames)promises.push((async()=>{
    const [desc,buffer]=await Promise.all([fetch('./assets/geometry/'+name+'.json').then(r=>r.json()),fetch('./assets/geometry/'+name+'.bin').then(r=>r.arrayBuffer())]);
    const attrs=new T.InterleavedBuffer(new Float32Array(buffer,0,desc.vertices*8),8),g=new T.BufferGeometry();
    for(const [key,n,off] of [['position',3,0],['normal',3,3],['uv',2,6]])g.setAttribute(key,new T.InterleavedBufferAttribute(attrs,n,off));
    g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,desc.vertices*32,desc.indices),1));g.computeBoundingSphere();scans[name]=g;progress(++done/total);
  })());
  const hdr=new HDRLoader().loadAsync('./assets/surfaces/coastal-sky.hdr').then(t=>{progress(++done/total);return t;});
  const hdrlight=new HDRLoader().loadAsync('./assets/surfaces/coastal-light.hdr').then(t=>{progress(++done/total);return t;});
  await Promise.all(promises);const [sky,environment]=await Promise.all([hdr,hdrlight]);
  const cache=new Map();
  function material(name,color=0xffffff,roughness=.78,metalness=0) {
    const key=[name,color,roughness,metalness].join('/');
    if(!cache.has(key)){
      const m=new T.MeshStandardMaterial({...textures[name],color,metalness,roughness,normalScale:new T.Vector2(.40,.40)});
      if(alphas.includes(name)){m.side=T.DoubleSide;m.alphaTest=.43;m.forceSinglePass=true;}
      m.name=key;cache.set(key,m);
    }
    return cache.get(key);
  }
  return {textures,sky,environment,material,scans,groveMaps,groveShapes,wildGrass,bushMap};
}
export function leafLighting(m){m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(mat3(viewMatrix)*vec3(.11,.96,.19)+normal*.18);totalEmissiveRadiance+=diffuseColor.rgb*.48;');};return m;}
export const sunVector=V(-.32,.127,-.94).normalize();
export function lightRig(scene,renderer,art) {
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  const phi=Math.atan2(sunVector.z,sunVector.x);
  const angle=(1255/2048-.5)*Math.PI*2-phi;
  const skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{tSky:{value:art.sky},sunDir:{value:sunVector},angle:{value:angle}},
    vertexShader:'varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}',
    fragmentShader:`
      varying vec3 vDir; uniform sampler2D tSky; uniform vec3 sunDir; uniform float angle;
      void main(){vec3 d=normalize(vDir);
        vec2 uv=vec2(fract((atan(d.z,d.x)+angle)/6.2831853+.5),asin(clamp(d.y-.039,-1.,1.))/3.14159265+.5);
        vec3 hdr=texture2D(tSky,uv).rgb;
        float horizon=exp(-max(d.y,0.)*7.);
        vec3 sky=hdr*mix(vec3(.56,.83,1.10),vec3(1.67,.82,.47),horizon)*.69;
        float beam=max(dot(d,sunDir),0.);
        sky+=vec3(1.15,.48,.13)*pow(beam,21.)*.39+vec3(8.,5.2,1.8)*smoothstep(.99978,.99996,beam);
        sky=mix(sky,vec3(.6,.45,.34),smoothstep(.025,-.045,d.y));
        gl_FragColor=vec4(sky,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const dome=new T.Mesh(new T.SphereGeometry(1800,64,32),skyMat);dome.renderOrder=-100;dome.frustumCulled=false;scene.add(dome);
  art.environment.mapping=T.EquirectangularReflectionMapping;
  scene.environment=art.environment;scene.environmentRotation.y=angle;scene.environmentIntensity=.7;
  scene.fog=new T.Fog(0xd9b8a2,160,1350);
  const light=new T.DirectionalLight(0xffd1a2,3.5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);
  Object.assign(light.shadow.camera,{near:1,far:315,left:-45,right:45,top:42,bottom:-42});
  light.shadow.camera.updateProjectionMatrix();light.shadow.normalBias=.014;light.shadow.bias=-.00018;
  scene.add(light,light.target,new T.HemisphereLight(0xb8d4e4,0x866d57,.46));
  return {light,dome,update(camera,target){dome.position.copy(camera.position);const x=Math.round(target.x*6)/6,z=Math.round(target.z*6)/6;
    light.target.position.set(x,target.y,z);light.position.copy(light.target.position).addScaledVector(sunVector,160);}};
}
