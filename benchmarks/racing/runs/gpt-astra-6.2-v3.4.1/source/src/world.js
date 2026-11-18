import * as T from 'three';
import {mix,clamp,smooth} from './track.js';
import {V} from './art.js';
export function baseWorld(track,scene,art) {
  const g=track.terrain.geometry,positions=g.attributes.position,weights=[];
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i),shore=x-track.shoreX(z);
    const cliff=smooth(-365,-530,z)*smooth(8,39,shore);
    const soil=smooth(11,49,shore);
    weights.push(soil,cliff,(1-smooth(0,10,Math.abs(shore))));
  }
  g.setAttribute('layer',new T.Float32BufferAttribute(weights,3));
  const terrainMat=art.material('earth',0xffffff,.97).clone();terrainMat.vertexColors=true;
  terrainMat.onBeforeCompile=shader=>{
    shader.uniforms.meadowMap={value:art.textures.meadow.map};
    for(const n of ['sand','rock'])for(const [k,slot] of [['Color','map'],['Normal','normalMap'],['Rough','roughnessMap']])shader.uniforms[n+k]={value:art.textures[n][slot]};
    shader.vertexShader='attribute vec3 layer; varying vec3 strata;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstrata=layer;');
    shader.fragmentShader='varying vec3 strata; uniform sampler2D sandColor, rockColor, sandNormal, rockNormal, sandRough, rockRough, meadowMap;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      vec2 uv=vMapUv;
      vec3 e=texture2D(map,uv*1.25).rgb, s=texture2D(sandColor,uv*.85).rgb, r=texture2D(rockColor,uv*.72).rgb;
      float macro=.86+.19*sin(uv.x*.58+sin(uv.y*.35))+.08*sin(uv.y*.23+uv.x*.11);
      vec3 earth=mix(e,texture2D(map,uv*.42+vec2(.15,.3)).rgb,.29)*vec3(1.25,1.62,.87);
      earth=mix(earth,texture2D(meadowMap,uv*.91).rgb*vec3(1.06,1.04,.84),clamp(.67+.21*sin(uv.x*.48+sin(uv.y*.38)),.23,.93));
      vec3 sand=s*vec3(1.30,1.12,.88)*(1.-strata.z*.39);
      diffuseColor.rgb*=mix(mix(sand,earth,strata.x),r*1.35,strata.y)*macro;
    `).replace('#include <color_fragment>','diffuseColor.rgb *= mix(vec3(1.), vColor, .31);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',T.ShaderChunk.normal_fragment_maps.replace('texture2D( normalMap, vNormalMapUv ).xyz','mix(mix(texture2D(sandNormal,vNormalMapUv*.85).xyz,texture2D(normalMap,vNormalMapUv*1.25).xyz,strata.x),texture2D(rockNormal,vNormalMapUv*.72).xyz,strata.y)'));
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',T.ShaderChunk.roughnessmap_fragment.replace('texelRoughness.g','mix(mix(texture2D(sandRough,vRoughnessMapUv*.85).g,texelRoughness.g,strata.x),texture2D(rockRough,vRoughnessMapUv*.72).g,strata.y)'));
  };
  const terrain=new T.Mesh(g,terrainMat);terrain.receiveShadow=true;terrain.name='Terreno triangulado';scene.add(terrain);
  const roadMat=art.material('road',0xffffff,.95).clone();roadMat.normalScale.set(.65,.65);
  const roadG=track.roadGeometry(f=>-f.width/2,f=>f.width/2),lanes=[];
  for(let i=0;i<=track.n;i++){lanes.push(-1,1);}
  roadG.setAttribute('lateral',new T.Float32BufferAttribute(lanes,1));
  roadMat.onBeforeCompile=shader=>{
    shader.vertexShader='attribute float lateral; varying float crossRoad;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncrossRoad=lateral;');
    shader.fragmentShader='varying float crossRoad;\n'+shader.fragmentShader.replace('#include <map_fragment>',`
      vec2 q=vMapUv; float m=q.y*6.;float x=q.x*6.;
      vec3 t=texture2D(map,q*1.42).rgb; vec3 coarse=texture2D(map,q*.343+vec2(.35,.16)).rgb;
      float grain=clamp(dot(t,vec3(.28,.55,.17))*5.8,.28,1.);
      float rubber=exp(-pow((abs(x)-2.1-.32*sin(m*.033))/.83,2.));
      vec3 asphalt=mix(t,coarse,.235)*vec3(.80,.86,.96)*(.81+.13*sin(m*.057+2.*sin(m*.019))-.26*rubber);
      float wear=smoothstep(.88,1.,abs(crossRoad));
      asphalt=mix(asphalt,coarse*vec3(1.28,1.12,.96),wear*.49);
      float aa=max(fwidth(x),.010);float edge=1.-smoothstep(.046,.046+aa,abs((1.-abs(crossRoad))*5.65-.29));
      float dashstep=mod(m+1.5,10.);float center=(1.-smoothstep(.075,.075+aa,abs(x)))*smoothstep(.03,.11,dashstep)*(1.-smoothstep(3.20,3.28,dashstep));
      float finish=step(.15,m)*step(m,1.31);float check=mod(floor((x+6.)/.57)+floor((m-.15)/.58),2.);
      float grid=0.;
      for(int i=0;i<6;i++){float row=float(i/2)*8.+8.;float lane=mod(float(i),2.)*4.-2.;
        float start=2969.2548-row-mod(float(i),2.)*2.;float zz=m-start;
        float side=1.-smoothstep(.045,.045+aa,abs(abs(x-lane)-1.11));
        float end=1.-smoothstep(.050,.050+aa,abs(zz));
        grid=max(grid,max(side*step(-1.4,zz)*step(zz,0.),end*step(abs(x-lane),1.15)));
      }
      vec3 painted=mix(asphalt,vec3(.65,.62,.53)*(.50+.50*grain),max(max(edge,center),grid)*.86);
      diffuseColor.rgb*=mix(painted,mix(vec3(.027),vec3(.74,.72,.64)*(.6+.4*grain),check),finish*.92);
    `.replace('2969.2548',track.length.toFixed(4)));
  };
  const road=new T.Mesh(roadG,roadMat);road.name='Asfalto';road.receiveShadow=true;scene.add(road);
  return {road,terrain};
}
