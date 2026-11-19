import * as T from 'three';
import { materialShader } from './materials.js';
import { DIRECTIONS } from './pipeline.js';

export const SHORE_GLSL = `
  float shoreLine(float x) {
    return 343.0 + 40.0 * exp(-pow((x-420.0)/225.0, 2.0)) - 13.0 * cos(x/162.0) + 7.0 * sin((x-70.0)/81.0);
  }
  float capeShore(float z) {
    return 565.0+39.0*cos((z+4.0)/162.0)-50.0*smoothstep(158.0,333.0,z);
  }
  float coarseVariation(vec2 p) {
    return .5 + sin(p.x*.038 + p.y*.047 + sin(p.y*.024)*2.1)*.27
      + cos(p.x*.092-p.y*.053 + sin(p.x*.011)*2.8)*.18;
  }
`;

export function trackMaterials(bank) {
  const sand = bank.maps('sand');
  const cliff = bank.maps('limestone');
  const grass = bank.maps('grassland');
  const road = bank.surface('asphalt', {
    name: 'Asphalt with rubber and sandy shoulder', normalScale: new T.Vector2(.79,.79), roughness: .94,
  });
  road.userData.primary = 'asphalt';
  materialShader(road, 'asphalt-local-scans', shader => {
    shader.uniforms.sandMap = { value: sand.map };
    shader.uniforms.sandNormal = { value: sand.normalMap };
    shader.vertexShader = shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 roadWorld;')
      .replace('#include <project_vertex>','#include <project_vertex>\nroadWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      uniform sampler2D sandMap, sandNormal;
      varying vec3 roadWorld;
      ${SHORE_GLSL}
    `).replace('#include <map_fragment>', `
      #include <map_fragment>
      float roadLane = abs(vMapUv.y - 3.5) / 3.5;
      float roadMacro = coarseVariation(roadWorld.xz);
      float roadPatch = texture2D(map, vMapUv*.253 + vec2(.28,.17)).r;
      float rubberTone = exp(-pow((roadLane-.18)*17.0,2.0)) + .55*exp(-pow((roadLane-.52)*23.0,2.0));
      diffuseColor.rgb *= (.96 + roadMacro*.21 + roadPatch*.25) * (1.0-rubberTone*.155);
      float sandyCoast = 1.0 - smoothstep(42.0,109.0,shoreLine(roadWorld.x)-roadWorld.z);
      float bankBlend = smoothstep(.739,1.01,roadLane + (roadMacro-.53)*.13);
      vec3 grains = texture2D(sandMap,roadWorld.xz*.69).rgb;
      float sandDust = bankBlend * mix(.295,.78,sandyCoast);
      diffuseColor.rgb = mix(diffuseColor.rgb, grains*mix(vec3(.58,.57,.55),vec3(.75,.64,.50),sandyCoast),sandDust);
    `).replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      vec3 sandBump = texture2D(sandNormal,roadWorld.xz*.69).xyz*2.0-1.0;
      normal = normalize(mix(normal,tbn*vec3(sandBump.xy*.65,sandBump.z),sandDust));
    `);
  });

  const terrain = bank.surface('earth', {
    name: 'Ground, coastal sand and triplanar cliff', roughness: .99, vertexColors: true,
    normalScale: new T.Vector2(.83,.83),
  });
  terrain.userData.primary = 'terrain';
  terrain.userData.triplanar = cliff.map;
  terrain.userData.layers = [
    { layer: 'shore', albedo:sand.map, normal:sand.normalMap },
    { layer: 'three-axis cliff', albedo:cliff.map, normal:cliff.normalMap },
    { layer: 'coastal grass', albedo:grass.map, normal:grass.normalMap },
  ];
  materialShader(terrain,'land-local-scans',shader => {
    for (const [id, texture] of Object.entries({
      shoreSand:sand.map, shoreSandN:sand.normalMap, cliffRock:cliff.map, cliffRockN:cliff.normalMap,
      grassScan:grass.map, grassScanN:grass.normalMap,
    })) shader.uniforms[id] = { value: texture };
    shader.vertexShader = shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 landWorld;')
      .replace('#include <project_vertex>','#include <project_vertex>\nlandWorld = (modelMatrix * vec4(transformed,1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
      #include <common>
      varying vec3 landWorld;
      uniform sampler2D shoreSand, shoreSandN, cliffRock, cliffRockN, grassScan, grassScanN;
      ${SHORE_GLSL}
      vec4 threeAxes(sampler2D tex, vec3 p, vec3 blend) {
        return texture2D(tex,p.zy)*blend.x + texture2D(tex,p.xz)*blend.y + texture2D(tex,p.xy)*blend.z;
      }
    `).replace('#include <map_fragment>', `
      #include <map_fragment>
      vec3 globalN = inverseTransformDirection(normalize(vNormal), viewMatrix);
      vec3 rockWeights = pow(abs(globalN),vec3(5.0));
      rockWeights /= max(.0001, rockWeights.x+rockWeights.y+rockWeights.z);
      vec3 rockUV = landWorld * .368;
      float shoreDepth = min(shoreLine(landWorld.x)-landWorld.z,(capeShore(landWorld.z)-landWorld.x)*.94);
      float macroLand = coarseVariation(landWorld.xz);
      float sandy = (1.0-smoothstep(41.0,96.0,shoreDepth+macroLand*14.0))
        * (1.0-smoothstep(8.0,21.0,landWorld.y));
      float etched = (1.0-smoothstep(.65,.95,globalN.y))*smoothstep(100.0,250.0,landWorld.x)
        * smoothstep(5.0,12.0,landWorld.y);
      float wet = 1.0 - smoothstep(.03,1.21,landWorld.y+coarseVariation(landWorld.xz)*.27);
      vec2 sandUV = landWorld.xz*.53;
      vec4 sandSample = texture2D(shoreSand,sandUV);
      vec3 sandRGB = sandSample.rgb * mix(.74,.35,wet);
      vec4 highRock = threeAxes(cliffRock,rockUV,rockWeights);
      vec3 lowRock = threeAxes(cliffRock,landWorld*.081,rockWeights).rgb;
      vec3 rockyRGB = highRock.rgb * (.54 + .41*sqrt(lowRock)) * mix(.78,1.29,macroLand);
      float greenBlend = smoothstep(68.0,127.0,shoreDepth) * smoothstep(.18,.74,macroLand) * .79;
      vec3 grassRGB = texture2D(grassScan,landWorld.xz*.29).rgb*vec3(.69,.70,.53);
      vec3 landBase = mix(diffuseColor.rgb*(1.47+macroLand*.56),grassRGB,greenBlend);
      diffuseColor.rgb = mix(mix(landBase,sandRGB,sandy),rockyRGB,etched);
    `).replace('#include <roughnessmap_fragment>', `
      #include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor,sandSample.a*(1.0-.46*wet),sandy);
      roughnessFactor = mix(roughnessFactor,highRock.a,etched);
    `).replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      vec3 sandBump = texture2D(shoreSandN,sandUV).xyz*2.0-1.0;
      vec3 grassBump = texture2D(grassScanN,landWorld.xz*.29).xyz*2.0-1.0;
      normal = normalize(mix(normal,tbn*vec3(grassBump.xy*.64,grassBump.z),greenBlend));
      normal = normalize(mix(normal,tbn*vec3(sandBump.xy*.52,sandBump.z),sandy));
      vec3 rx = texture2D(cliffRockN,rockUV.zy).xyz*2.0-1.0;
      vec3 ry = texture2D(cliffRockN,rockUV.xz).xyz*2.0-1.0;
      vec3 rz = texture2D(cliffRockN,rockUV.xy).xyz*2.0-1.0;
      vec3 slopes = vec3(0.0,rx.y,rx.x)*rockWeights.x + vec3(ry.x,0.0,ry.y)*rockWeights.y
        + vec3(rz.x,rz.y,0.0)*rockWeights.z;
      normal = normalize(mix(normal,mat3(viewMatrix)*normalize(globalN+slopes*.94),etched));
    `);
  });
  return { road, terrain };
}

export function makeSea(bank, rocks) {
  const uniforms = {
    sky: { value: null }, sand: { value: bank.texture('sand','a',true) }, tick: { value: 0 },
    night: { value: 0 }, lightDir: { value: DIRECTIONS.golden.clone() },
    skyyaw: { value: .406 }, shoreRocks: { value: rocks.map(p => new T.Vector4(p.x,p.z,p.r,p.phase)) },
  };
  const mat = new T.ShaderMaterial({
    name: 'Wave and shoreline absorption', uniforms,
    vertexShader: `
      varying vec3 ocean;
      void main() {
        ocean=(modelMatrix*vec4(position,1.0)).xyz;
        gl_Position=projectionMatrix*viewMatrix*vec4(ocean,1.0);
      }
    `,
    fragmentShader: `
      varying vec3 ocean;
      uniform sampler2D sky, sand;
      uniform float tick, night, skyyaw;
      uniform vec3 lightDir;
      uniform vec4 shoreRocks[${rocks.length}];
      ${SHORE_GLSL}
      vec2 radiansToUv(vec3 d) {
        return vec2(atan(d.z,d.x)*.1591549431+.5, asin(clamp(d.y,-1.0,1.0))*.3183098862+.5);
      }
      vec3 reflectionColor(vec3 d) {
        vec2 st = radiansToUv(d);
        st.x = fract(st.x+skyyaw*.1591549431);
        return min(texture2D(sky,st).rgb,vec3(6.0));
      }
      void main() {
        vec2 p = ocean.xz;
        vec3 eye = cameraPosition-ocean;
        float distance = length(eye);
        vec3 direction = eye / max(0.2,distance);
        float along=max(p.y-shoreLine(p.x),(p.x-capeShore(p.y))*.94);
        float height = max(.01,along*.119);
        float micro = 1.0-smoothstep(36.0,480.0,distance);
        float a = dot(p,vec2(.053,.464))-tick*1.49;
        float b = dot(p,vec2(-.117,.288))-tick*.92;
        float c = dot(p,vec2(.695,.868))-tick*2.2+.62*sin(a*.76);
        float d = dot(p,vec2(-1.571,2.236))-tick*3.10;
        float e = dot(p,vec2(-3.195,-1.441))+tick*2.01+.67*sin(b*.31);
        vec2 slope = vec2(.003,.041)*cos(a)+vec2(-.016,.026)*cos(b)
          +vec2(.029,.048)*cos(c)+micro*(vec2(-.025,.048)*cos(d)+vec2(-.035,-.023)*cos(e));
        vec3 N=normalize(vec3(-slope.x,1.0,-slope.y));
        float facing = clamp(dot(direction,N),.001,1.0);
        float fresnel = .025+.54*pow(1.0-facing,5.0);
        vec3 ref = reflect(-direction,N);
        vec3 reflected = reflectionColor(ref) * mix(.38,.13,night);
        vec3 bottom = texture2D(sand,(p+3.3*slope)*.51).rgb;
        vec3 turquoise = mix(vec3(.009,.154,.135),vec3(.004,.027,.041),night);
        vec3 deep = mix(vec3(.006,.044,.079),vec3(.003,.010,.022),night);
        vec3 base = mix(deep,turquoise,exp(-height*.097));
        vec3 shallow = bottom * mix(vec3(.40,.63,.50),vec3(.048,.078,.107),night);
        vec3 rgb = mix(mix(base,shallow,exp(-height*1.48)*.91),reflected,fresnel);
        vec3 halfVector=normalize(direction+lightDir);
        float glint = pow(clamp(dot(N,halfVector),0.0,1.0),mix(90.0,180.0,night));
        float narrow = pow(clamp(dot(ref,lightDir),0.0,1.0),mix(26.0,62.0,night));
        rgb += mix(vec3(1.06,.57,.23),vec3(.24,.41,.76),night)*(glint*.47+narrow*.255);
        float ridge=along-.66-sin(p.x*.291-tick*1.48)*.36-sin(p.x*.062+tick*.43)*.74;
        float breakers=exp(-abs(ridge)*2.65) + .53*exp(-abs(ridge-2.32-sin(p.x*.163+tick*1.5)*.73)*3.3)
          + .28*exp(-abs(ridge-4.82-sin(p.x*.044+tick*.86)*.71)*4.2);
        float foamGrain=clamp(.62 + .39 * sin(p.x*3.28+c*1.5)*sin(d+c)+.16*cos(d*1.71+tick*2.0),.09,1.0);
        float rockyFoam=0.0;
        for(int i=0;i<${rocks.length};i++) {
          vec4 rock=shoreRocks[i];
          vec2 v=(p-rock.xy)*vec2(1.0,.92);
          if (abs(v.x)>rock.z*2.1 || abs(v.y)>rock.z*2.1) continue;
          float rad=length(v)+.18*sin(atan(v.y,v.x)*7.0+tick+.95*rock.w);
          rockyFoam=max(rockyFoam,exp(-abs(rad-rock.z-.20*sin(tick*2.0+rock.w))*2.5)*.81);
          rgb *= .80+.20*smoothstep(rock.z*.75,rock.z*1.9,rad);
        }
        float foam = min(.91,(breakers + rockyFoam)*foamGrain)*(1.0-smoothstep(25.0,1000.0,distance));
        rgb=mix(rgb,mix(vec3(.79,.84,.79),vec3(.062,.116,.18),night),foam);
        vec3 blueHaze = mix(vec3(.25,.32,.41),vec3(.004,.010,.025),night);
        vec3 sunHaze = mix(vec3(.67,.45,.29),vec3(.017,.031,.065),night);
        vec3 fog = mix(blueHaze,sunHaze,pow(max(0.0,dot(-direction,lightDir)),4.2));
        rgb=mix(rgb,fog,1.0-exp(-distance*.000535));
        gl_FragColor=vec4(rgb,1.0);
      }
    `,
  });
  const sea = new T.Mesh(new T.PlaneGeometry(30000,30000),mat);
  sea.name = 'Cala sea and surf';
  sea.rotation.x = -Math.PI/2;
  sea.position.y = .027;
  return {
    sea,
    update(elapsed,pipeline) {
      uniforms.tick.value = elapsed;
      uniforms.sky.value = pipeline.hdris?.[pipeline.period];
      uniforms.night.value = Number(pipeline.period === 'night');
      uniforms.skyyaw.value = pipeline.scene.backgroundRotation.y;
      uniforms.lightDir.value.copy(DIRECTIONS[pipeline.period]);
    },
  };
}
