import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const RadialMotionBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    tPlayerMask: { value: null },
    uBlurAmount: { value: 0.0 },
    uCenter: { value: new THREE.Vector2(0.5, 0.44) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D tPlayerMask;
    uniform float uBlurAmount;
    uniform vec2 uCenter;
    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      if (uBlurAmount < 0.001) {
        gl_FragColor = base;
        return;
      }

      // Sample player mask with slight dilation so blurred background never bleeds onto sharp car edge
      float m0 = texture2D(tPlayerMask, vUv).r;
      float m1 = texture2D(tPlayerMask, vUv + vec2(0.004, 0.004)).r;
      float m2 = texture2D(tPlayerMask, vUv - vec2(0.004, 0.004)).r;
      float m3 = texture2D(tPlayerMask, vUv + vec2(-0.004, 0.004)).r;
      float m4 = texture2D(tPlayerMask, vUv + vec2(0.004, -0.004)).r;
      float playerMask = clamp(max(m0, max(max(m1, m2), max(m3, m4))), 0.0, 1.0);

      vec2 dir = vUv - uCenter;
      float dist = length(dir);
      // Zero blur near focal center, stronger toward screen edges
      float radialFactor = smoothstep(0.14, 0.72, dist);
      float strength = uBlurAmount * radialFactor * (1.0 - playerMask);

      if (strength < 0.0005) {
        gl_FragColor = base;
        return;
      }

      vec3 accum = base.rgb;
      float wSum = 1.0;
      const int SAMPLES = 8;
      for (int i = 1; i <= SAMPLES; i++) {
        float t = float(i) / float(SAMPLES);
        vec2 sampleUv = clamp(vUv - dir * (strength * t), 0.001, 0.999);
        float sMask = texture2D(tPlayerMask, sampleUv).r;
        float w = 1.0 - sMask;
        accum += texture2D(tDiffuse, sampleUv).rgb * w;
        wSum += w;
      }
      gl_FragColor = vec4(accum / wSum, base.a);
    }
  `,
};

export class PostPipeline {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private composer: EffectComposer;
  private renderPass: RenderPass;
  private bloomPass: UnrealBloomPass;
  private motionPass: ShaderPass;
  private outputPass: OutputPass;
  private readonly maskRT: THREE.WebGLRenderTarget;
  private readonly whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private readonly clearBlack = new THREE.Color(0x000000);
  public quality: 'high' | 'low' = 'high';

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.renderer = renderer;
    this.scene = scene;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const rt = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    this.composer = new EffectComposer(renderer, rt);
    this.composer.setSize(w, h);

    this.renderPass = new RenderPass(scene, camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.18, // subtle bloom strength
      0.38, // radius
      1.22  // HDR threshold so ONLY sun disc & bright speculars/emissives bloom
    );
    this.motionPass = new ShaderPass(RadialMotionBlurShader);
    this.outputPass = new OutputPass();

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.motionPass);
    this.composer.addPass(this.outputPass);

    this.maskRT = new THREE.WebGLRenderTarget(512, 288, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    this.motionPass.uniforms.tPlayerMask.value = this.maskRT.texture;
  }

  public resize(width: number, height: number): void {
    this.composer.setSize(width, height);
    this.bloomPass.setSize(width, height);
  }

  public setCamera(camera: THREE.Camera): void {
    this.renderPass.camera = camera;
  }

  public render(
    camera: THREE.Camera,
    speedMs: number,
    allowMotionBlur = true
  ): void {
    this.renderPass.camera = camera;

    if (this.quality === 'low') {
      this.renderer.render(this.scene, camera);
      return;
    }

    const blurAmt =
      allowMotionBlur && speedMs > 16
        ? THREE.MathUtils.clamp(((speedMs - 16) / 48) * 0.042, 0, 0.045)
        : 0;
    this.motionPass.uniforms.uBlurAmount.value = blurAmt;

    if (blurAmt > 0.001) {
      // Render player mask on layer 1 cleanly without background
      const prevBg = this.scene.background;
      const prevFog = this.scene.fog;
      const prevOverride = this.scene.overrideMaterial;
      const prevClearCol = this.renderer.getClearColor(new THREE.Color());
      const prevClearAlpha = this.renderer.getClearAlpha();

      this.scene.background = null;
      this.scene.fog = null;
      this.scene.overrideMaterial = this.whiteMat;
      camera.layers.set(1);

      this.renderer.setRenderTarget(this.maskRT);
      this.renderer.setClearColor(this.clearBlack, 1);
      this.renderer.clear();
      this.renderer.render(this.scene, camera);

      camera.layers.set(0);
      this.scene.background = prevBg;
      this.scene.fog = prevFog;
      this.scene.overrideMaterial = prevOverride;
      this.renderer.setClearColor(prevClearCol, prevClearAlpha);
      this.renderer.setRenderTarget(null);
    }

    this.composer.render();
  }
}
