import * as T from 'three';
import { CSM } from 'three/addons/csm/CSM.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { asset } from './materials.js';

const cd = Math.PI / 180;
export const DIRECTIONS = {
  golden: new T.Vector3(Math.cos(17 * cd) * Math.cos(4.66 * cd), Math.sin(4.66 * cd), Math.sin(17 * cd) * Math.cos(4.66 * cd)),
  night: new T.Vector3(Math.cos(28 * cd) * Math.cos(17.05 * cd), Math.sin(17.05 * cd), Math.sin(28 * cd) * Math.cos(17.05 * cd)),
};
const ROTATIONS = { golden: 23.2539 * cd, night: 7.5957 * cd };

class FrameAO extends GTAOPass {
  setSize(width, height) {
    const factor = this.qualityScale ?? .5;
    super.setSize(Math.round(width * factor), Math.round(height * factor));
  }

  render(renderer, writeBuffer, readBuffer, dt, mask) {
    this.sourceDepth = readBuffer.depthTexture;
    this.setGBuffer(this.sourceDepth);
    super.render(renderer, writeBuffer, readBuffer, dt, mask);
  }
}

const speedGlassShader = {
  uniforms: {
    tDiffuse: { value: null }, tDepth: { value: null }, strength: { value: 0 },
    clip: { value: new T.Vector2(.11, 8000) }, lightUV: { value: new T.Vector3(-2, -2, 0) },
    flareTint: { value: new T.Color(0xffbe82) }, aspect: { value: 1.78 },
  },
  vertexShader: `
    varying vec2 fUv;
    void main() { fUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    #include <packing>
    varying vec2 fUv;
    uniform sampler2D tDiffuse, tDepth;
    uniform vec2 clip;
    uniform vec3 lightUV, flareTint;
    uniform float aspect, strength;
    void main() {
      vec3 rgb = texture2D(tDiffuse, fUv).rgb;
      float dist = -perspectiveDepthToViewZ(texture2D(tDepth, fUv).x, clip.x, clip.y);
      float mask = smoothstep(10.5, 18.0, dist);
      if (mask * strength > .0002) {
        vec2 offset = (fUv - vec2(.5, .49)) * mask * strength;
        vec3 b = rgb * .37;
        for (int i = 1; i <= 3; i++) {
          vec2 p = clamp(fUv + offset * float(i), .001, .999);
          float distance = -perspectiveDepthToViewZ(texture2D(tDepth, p).x, clip.x, clip.y);
          b += mix(rgb, texture2D(tDiffuse, p).rgb, smoothstep(10.5, 18.0, distance)) * .21;
        }
        rgb = b;
      }
      vec2 d = (fUv - lightUV.xy) * vec2(aspect, 1.0);
      float haze = exp(-dot(d, d) * 30.0) * .058 + exp(-dot(d, d) * 590.0) * .18;
      vec2 g = (fUv - (vec2(.5) + (.5 - lightUV.xy) * .42)) * vec2(aspect, 1.0);
      float ghost = exp(-dot(g, g) * 410.0) * .024;
      gl_FragColor = vec4(rgb + (haze + ghost) * flareTint * lightUV.z, 1.0);
    }
  `,
};

export class Pipeline {
  constructor(root, scene, camera, width, height) {
    this.scene = scene;
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.domElement.setAttribute('aria-label', 'Cala di Vetra 3D circuit');
    this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.toneMapping = T.AgXToneMapping;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.info.autoReset = false;
    root.prepend(this.renderer.domElement);
    this.fill = new T.HemisphereLight(0xcce4ff, 0xa18169, .43);
    this.scene.add(this.fill);
    this.sky = new T.Mesh(new T.SphereGeometry(4100,40,24),new T.ShaderMaterial({
      name:'Graded HDR sky', side:T.BackSide,depthWrite:false,
      uniforms:{ panorama:{value:null}, yaw:{value:0}, dusk:{value:0}, keyLight:{value:DIRECTIONS.golden.clone()} },
      vertexShader:`
        varying vec3 sight;
        void main(){ sight=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
      `,
      fragmentShader:`
        uniform sampler2D panorama;
        uniform float yaw,dusk;
        uniform vec3 keyLight;
        varying vec3 sight;
        void main(){
          vec3 direction=normalize(sight);
          vec2 st=vec2(fract(atan(direction.z,direction.x)*.15915494+.5+yaw*.15915494),asin(direction.y)*.31830989+.5);
          vec3 image=texture2D(panorama,st).rgb*mix(.83,.19,dusk);
          float lightness=dot(image,vec3(.2126,.7152,.0722));
          image/=1.0+max(0.0,lightness-.71)*mix(.265,.094,dusk);
          float sunset=pow(max(0.0,dot(direction,keyLight)),5.3)*exp(-max(direction.y,0.0)*4.9);
          image*=mix(mix(vec3(.86,.95,1.11),vec3(1.19,.89,.69),.13+.77*sunset),vec3(.77,.89,1.14),dusk);
          image+=vec3(.17,.055,.016)*sunset*(1.0-dusk);
          gl_FragColor=vec4(image,1.0);
        }
      `,
    }));
    this.sky.name='Sky panorama';
    this.sky.frustumCulled=false;
    this.sky.renderOrder=-90;
    this.scene.add(this.sky);
    this.scene.fog = new T.FogExp2(0xb4b7c2, .00085);
    this.materials = new Set();
    this.period = 'golden';
    const samples = Math.min(4, this.renderer.capabilities.maxSamples);
    const target = new T.WebGLRenderTarget(width, height, {
      type: T.HalfFloatType, samples, depthTexture: new T.DepthTexture(width, height, T.UnsignedIntType),
    });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(scene, camera));
    this.ao = new FrameAO(scene, camera, width, height, { depthTexture: target.depthTexture },
      { radius: 2.25, thickness: .76, distanceExponent: 1.25, samples: 12 },
      { radius: 4, samples: 10, normalPhi: 8 });
    this.ao.blendIntensity = .83;
    this.composer.addPass(this.ao);
    this.speedGlass = new ShaderPass(speedGlassShader);
    this.composer.addPass(this.speedGlass);
    this.bloom = new UnrealBloomPass(new T.Vector2(width, height), .145, .41, 1.69);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.setQuality('high');
  }

  async loadEnvironment(manager) {
    const hdr = new HDRLoader(manager);
    const [golden, night] = await Promise.all([hdr.loadAsync(asset('golden.hdr')), hdr.loadAsync(asset('night.hdr'))]);
    for (const t of [golden, night]) t.mapping = T.EquirectangularReflectionMapping;
    this.hdris = { golden, night };
    this.setPeriod(this.period);
  }

  setPeriod(period) {
    this.period = period;
    const night = period === 'night';
    if (this.hdris) {
      this.scene.environment = this.hdris[period];
      this.scene.background = new T.Color(night ? 0x0b1422 : 0x9da7af);
      this.scene.backgroundRotation.y = this.scene.environmentRotation.y = ROTATIONS[period];
      this.sky.material.uniforms.panorama.value = this.hdris[period];
      this.sky.material.uniforms.yaw.value = ROTATIONS[period];
      this.sky.material.uniforms.dusk.value = Number(night);
      this.sky.material.uniforms.keyLight.value.copy(DIRECTIONS[period]);
    }
    this.scene.backgroundIntensity = night ? .23 : .91;
    this.scene.environmentIntensity = night ? .20 : .38;
    this.scene.fog.color.set(night ? 0x0c1625 : 0xa9aab5);
    this.scene.fog.density = night ? .00108 : .00078;
    this.fill.color.set(night ? 0x829acd : 0xc7e2ff);
    this.fill.groundColor.set(night ? 0x6d6c87 : 0xa38469);
    this.fill.intensity = night ? .17 : .38;
    this.renderer.toneMappingExposure = night ? .94 : 1.07;
    this.csm.lightDirection.copy(DIRECTIONS[period]).negate();
    this.csm.lights.forEach(light => {
      light.color.set(night ? 0xacccff : 0xffbb78);
      light.intensity = night ? .38 : 3.85;
    });
    this.speedGlass.uniforms.flareTint.value.set(night ? 0x849cd1 : 0xffb47c);
  }

  applyShadows(mat) {
    this.csm.setupMaterial(mat);
    const fn = mat.userData.extension;
    if (fn) {
      const apply = mat.onBeforeCompile.bind(mat);
      mat.onBeforeCompile = shader => { apply(shader); fn(shader); };
    }
    mat.needsUpdate = true;
  }

  register(root) {
    root.traverse(object => {
      if (!object.isMesh) return;
      for (const mat of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!mat.isMeshStandardMaterial || this.materials.has(mat)) continue;
        this.materials.add(mat);
        this.applyShadows(mat);
      }
    });
  }

  release(root) {
    const old=new Set();
    root.traverse(object=>{
      if(!object.isMesh) return;
      object.geometry.dispose();
      old.add(object.material);
    });
    old.forEach(mat=>{
      this.csm.shaders.delete(mat);
      this.materials.delete(mat);
      if(mat.name==='Illuminated gauge display') mat.map.dispose();
      mat.dispose();
    });
    root.removeFromParent();
  }

  setQuality(quality) {
    if (quality === this.quality) return;
    this.quality = quality;
    const high = quality === 'high';
    if (this.csm) {
      this.csm.lights.forEach(light => light.shadow.dispose());
      this.csm.remove();
      this.csm.dispose();
    }
    this.csm = new CSM({
      camera: this.camera, parent: this.scene, cascades: high ? 3 : 2,
      maxFar: high ? 250 : 113, mode: 'custom',
      customSplitsCallback: (_count, _near, far, out) => out.push(...(high ? [21 / far, 81 / far, 1] : [21 / far, 1])),
      shadowMapSize: high ? 2048 : 1024, shadowBias: -.00010, lightMargin: 88,
      lightNear: .5, lightFar: 450,
    });
    this.csm.fade = true;
    this.csm.lights.forEach(light => {
      light.shadow.normalBias = .032;
      light.shadow.radius = high ? 2.5 : 1.4;
    });
    this.materials.forEach(mat => this.applyShadows(mat));
    this.ao.qualityScale = high ? .54 : .36;
    this.ao.updateGtaoMaterial({ samples: high ? 12 : 6 });
    this.bloom.enabled = high;
    const requestedSamples = Math.min(high ? 4 : 2, this.renderer.capabilities.maxSamples);
    for (const target of [this.composer.renderTarget1, this.composer.renderTarget2]) {
      if (target.samples !== requestedSamples) {
        target.samples = requestedSamples;
        target.dispose();
      }
    }
    this.setPeriod(this.period);
    this.resize(this.width, this.height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    const ratio = this.quality === 'high' ? 1 : .78;
    this.renderer.setSize(Math.floor(width * ratio), Math.floor(height * ratio), false);
    this.composer.setSize(Math.floor(width * ratio), Math.floor(height * ratio));
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.csm.updateFrustums();
  }

  async precompile() {
    this.csm.update();
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  render(speed = 0, boost = false, overview = false) {
    this.renderer.info.reset();
    this.sky.position.copy(this.camera.position);
    this.sky.visible=!overview;
    this.csm.update();
    const uv = DIRECTIONS[this.period].clone().multiplyScalar(4800).add(this.camera.position).project(this.camera);
    const dot = this.camera.getWorldDirection(new T.Vector3()).dot(DIRECTIONS[this.period]);
    this.speedGlass.uniforms.lightUV.value.set(uv.x * .5 + .5, uv.y * .5 + .5,
      !overview && dot > .3 && uv.z < 1.01 ? (this.period === 'night' ? .30 : 1) : 0);
    this.speedGlass.uniforms.clip.value.set(this.camera.near, this.camera.far);
    this.speedGlass.uniforms.aspect.value = this.camera.aspect;
    this.speedGlass.uniforms.strength.value = overview ? 0 : Math.min(.015, Math.max(0, speed - 12) * .00025 + (boost ? .0029 : 0));
    // The render pass writes to the current read buffer. AO retains that depth even after its color swap.
    this.speedGlass.uniforms.tDepth.value = this.composer.readBuffer.depthTexture;
    this.composer.render();
  }

  stats() {
    const gl = this.renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      gpu: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      webgl: gl.getParameter(gl.VERSION), quality: this.quality,
      cascades: this.csm.lights.map(light => [light.shadow.mapSize.width, light.shadow.mapSize.height]),
      csmLights: this.csm.lights.filter(light => light.castShadow).length,
      gtao: { active: this.ao.enabled, size: [this.ao.width, this.ao.height], depth: !!this.ao.sourceDepth },
      toneMap: this.renderer.toneMapping === T.AgXToneMapping ? 'AgX' : this.renderer.toneMapping,
      msaa: this.composer.readBuffer.samples,
      bloom: this.bloom.enabled, passes: this.composer.passes.map(p => ({
        effect:p===this.ao?'GTAO':p===this.speedGlass?'Distance-masked motion blur and flare':
          p===this.bloom?'Thresholded bloom':p instanceof RenderPass?'Scene render':'AgX output',
        enabled:p.enabled,
      })),
      calls: this.renderer.info.render.calls,
      renderedTriangles: this.renderer.info.render.triangles,
      memory: { ...this.renderer.info.memory },
    };
  }
}
