import * as THREE from 'three';
import { CSM } from 'three/addons/csm/CSM.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { N8AOPass } from 'n8ao';
import { CameraMode, LightingMode, QualityPreset } from '../types';
import { PhysicsWorld } from '../world/physicsWorld';
import { VehiclePhysics } from '../physics/vehiclePhysics';
import { CarVisualRig } from '../cars/carBuilder';
import { clamp, lerp } from '../utils/rng';

/**
 * Background-only speed-reactive radial motion blur + subtle sun lens flare glow.
 * Protects the central/lower player car silhouette (in Chase mode) and stays zero in Cockpit/static views
 * so the player's car, cockpit, and HUD are NEVER blurred!
 */
const BackgroundMotionBlurShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uBlurStrength: { value: 0.0 },
    uCenter: { value: new THREE.Vector2(0.5, 0.56) },
    uCarMaskCenter: { value: new THREE.Vector2(0.5, 0.34) },
    uCarMaskRadii: { value: new THREE.Vector2(0.24, 0.22) },
    uSunScreenPos: { value: new THREE.Vector2(0.5, 0.6) },
    uSunFlareStrength: { value: 0.0 },
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
    uniform float uBlurStrength;
    uniform vec2 uCenter;
    uniform vec2 uCarMaskCenter;
    uniform vec2 uCarMaskRadii;
    uniform vec2 uSunScreenPos;
    uniform float uSunFlareStrength;
    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      vec3 col = base.rgb;

      if (uBlurStrength > 0.001) {
        // Elliptical protection mask around player hero car so car paint, rims & decals stay 100% razor sharp!
        vec2 carDelta = (vUv - uCarMaskCenter) / uCarMaskRadii;
        float carProtect = smoothstep(0.75, 1.35, dot(carDelta, carDelta));

        vec2 dir = vUv - uCenter;
        float distEdge = length(dir);
        float radialMask = smoothstep(0.14, 0.72, distEdge) * carProtect;
        float strength = uBlurStrength * radialMask;

        if (strength > 0.0005) {
          vec3 acc = col * 0.28;
          float wSum = 0.28;
          vec2 stepVec = dir * strength * 0.042;
          for (int i = 1; i <= 6; i++) {
            float fi = float(i) / 6.0;
            float w = 1.0 - fi * 0.72;
            vec2 sUv = clamp(vUv - stepVec * fi, vec2(0.001), vec2(0.999));
            acc += texture2D(tDiffuse, sUv).rgb * w;
            wSum += w;
          }
          col = acc / wSum;
        }
      }

      // Subtle golden-hour directional sun anamorphic glare & warm halo (tasteful, never blinding!)
      if (uSunFlareStrength > 0.001) {
        vec2 sd = vUv - uSunScreenPos;
        sd.x *= 1.777;
        float r = length(sd);
        float halo = exp(-r * 5.2) * 0.11 * uSunFlareStrength;
        float streak = exp(-abs(sd.y) * 40.0) * exp(-abs(sd.x) * 2.8) * 0.08 * uSunFlareStrength;
        col += vec3(1.0, 0.74, 0.42) * (halo + streak);
      }

      gl_FragColor = vec4(col, base.a);
    }
  `,
};

export interface PipelineAuditInfo {
  quality: QualityPreset;
  csmActive: boolean;
  csmCascades: number;
  csmShadowMapSize: number;
  aoActive: boolean;
  aoMethod: string;
  toneMapping: string;
  antiAliasing: string;
  msaaSamples: number;
  smaaActive: boolean;
  bloomActive: boolean;
  backgroundMotionBlurActive: boolean;
}

export class RenderPipeline {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  csm!: CSM;
  composer!: EffectComposer;
  renderTarget!: THREE.WebGLRenderTarget;
  renderPass!: RenderPass;
  n8aoPass!: N8AOPass;
  bloomPass!: UnrealBloomPass;
  motionBlurPass!: ShaderPass;
  outputPass!: OutputPass;
  smaaPass!: SMAAPass;

  quality: QualityPreset = 'high';
  lighting: LightingMode = 'golden_hour';
  cameraMode: CameraMode = 'chase';

  // Smooth spring chase camera state
  private readonly camCurrentPos = new THREE.Vector3(0, 6, 20);
  private readonly camCurrentLook = new THREE.Vector3(0, 3, 0);
  private camInitialized = false;
  private readonly sunDirWorld = new THREE.Vector3(-0.46, 0.16, -0.87).normalize();
  private readonly tmpVec = new THREE.Vector3();
  private readonly tmpFwd = new THREE.Vector3();
  private readonly tmpUp = new THREE.Vector3();
  private readonly tmpTargetPos = new THREE.Vector3();
  private readonly tmpLook = new THREE.Vector3();
  private readonly tmpHit = { hit: true, y: 0, normal: new THREE.Vector3(0, 1, 0), surface: 'asphalt' as const };

  constructor(canvas: HTMLCanvasElement, scene: THREE.Scene) {
    this.scene = scene;
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.15, 4200);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.info.autoReset = false;

    this.initCSM('high');
    this.initComposer('high');
  }

  private initCSM(quality: QualityPreset): void {
    if (this.csm) {
      this.csm.remove();
      this.csm.dispose();
    }
    const isHigh = quality === 'high';
    this.csm = new CSM({
      maxFar: isHigh ? 255 : 150,
      cascades: isHigh ? 3 : 2,
      mode: 'custom',
      customSplitsCallback: (cascadeCount: number, near: number, far: number, target: number[]) => {
        if (cascadeCount === 3) {
          // Exact Section 5.7 cascade coverage: near 0-22m (razor sharp around car!), mid 22-85m, far 85-255m!
          target.push(22 / far, 85 / far, 1.0);
        } else {
          target.push(32 / far, 1.0);
        }
      },
      parent: this.scene,
      shadowMapSize: isHigh ? 2048 : 1024,
      lightDirection: this.sunDirWorld.clone().negate(),
      camera: this.camera,
      lightIntensity: 2.8,
      shadowBias: -0.00025,
    });
    this.csm.fade = true;
    for (const light of this.csm.lights) {
      light.shadow.normalBias = 0.035;
      light.shadow.bias = -0.00022;
      light.shadow.radius = 2.2;
    }
    this.applyLightingToCSM(this.lighting, this.sunDirWorld);
  }

  private initComposer(quality: QualityPreset): void {
    if (this.composer) {
      this.n8aoPass?.dispose();
      this.renderTarget?.dispose();
    }

    const isHigh = quality === 'high';
    const dpr = isHigh ? Math.min(window.devicePixelRatio || 1, 1.5) : 0.78;
    this.renderer.setPixelRatio(dpr);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));

    // WebGL2 MSAA 4x multisampled half-float render target for crisp anti-aliased HDR post-processing!
    this.renderTarget = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      samples: isHigh ? 4 : 0,
    });

    this.composer = new EffectComposer(this.renderer, this.renderTarget);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    // Real-time GTAO / SSAO grounding cars, curbs, walls, and foliage!
    this.n8aoPass = new N8AOPass(this.scene, this.camera, w, h);
    this.n8aoPass.setQualityMode(isHigh ? 'Medium' : 'Performance');
    this.n8aoPass.configuration.aoRadius = 2.4;
    this.n8aoPass.configuration.distanceFalloff = 1.15;
    this.n8aoPass.configuration.intensity = isHigh ? 2.15 : 0.0;
    this.n8aoPass.configuration.halfRes = true;
    this.n8aoPass.configuration.depthAwareUpsampling = true;
    this.n8aoPass.configuration.gammaCorrection = false; // OutputPass handles AgX + sRGB cleanly!
    this.n8aoPass.enabled = isHigh;
    this.composer.addPass(this.n8aoPass);

    // Subtle thresholded bloom (sun specular, headlights, brake lights, nitro flames, streetlamps)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      isHigh ? 0.28 : 0.14,
      0.55,
      1.08
    );
    this.bloomPass.enabled = isHigh;
    this.composer.addPass(this.bloomPass);

    // Background-only speed motion blur & subtle sun flare
    this.motionBlurPass = new ShaderPass(BackgroundMotionBlurShader);
    this.motionBlurPass.enabled = isHigh;
    this.composer.addPass(this.motionBlurPass);

    // AgX Filmic Tone Mapping + Linear->sRGB conversion
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);

    // SMAA post-AA pass (guarantees crisp edges on foliage alpha-cutouts, car trims, guardrails!)
    this.smaaPass = new SMAAPass(w, h);
    this.smaaPass.enabled = isHigh;
    this.composer.addPass(this.smaaPass);
  }

  registerMaterialForCSM(mat: THREE.Material): void {
    try {
      if (mat.userData.__csmInstance === this.csm) return;
      // Preserve any custom onBeforeCompile (terrain triplanar/splat, road markings/sand-drift,
      // foliage translucency/wind-sway, village wall-base grime) across CSM setup & quality switches!
      if (!mat.userData.__csmSavedOrig) {
        const defaultOBC = THREE.Material.prototype.onBeforeCompile;
        mat.userData.__origOBC =
          mat.onBeforeCompile && mat.onBeforeCompile !== defaultOBC ? mat.onBeforeCompile : null;
        mat.userData.__origCacheKey = mat.customProgramCacheKey;
        mat.userData.__csmSavedOrig = true;
      }

      const origOBC = mat.userData.__origOBC as
        | ((shader: THREE.WebGLProgramParametersWithUniforms, renderer: THREE.WebGLRenderer) => void)
        | null;
      const origCacheKey = mat.userData.__origCacheKey as (() => string) | undefined;

      this.csm.setupMaterial(mat);
      const csmOBC = mat.onBeforeCompile;

      if (origOBC) {
        mat.onBeforeCompile = (shader, renderer) => {
          csmOBC.call(mat, shader, renderer);
          origOBC.call(mat, shader, renderer);
        };
        const cascades = this.csm.cascades;
        mat.customProgramCacheKey = () =>
          `${origCacheKey ? origCacheKey.call(mat) : 'custom'}_csm${cascades}`;
      }
      mat.userData.__csmInstance = this.csm;
      mat.needsUpdate = true;
    } catch {
      // Ignore non-standard custom materials that don't support CSM chunks
    }
  }

  registerSceneMaterialsForCSM(): void {
    const seen = new Set<THREE.Material>();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (!m || seen.has(m)) continue;
          seen.add(m);
          if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
            this.registerMaterialForCSM(m);
          }
        }
      }
    });
  }

  setQuality(quality: QualityPreset): void {
    if (this.quality === quality) return;
    this.quality = quality;
    this.initCSM(quality);
    this.initComposer(quality);
    this.registerSceneMaterialsForCSM();
  }

  applyLightingToCSM(mode: LightingMode, sunDir: THREE.Vector3): void {
    this.lighting = mode;
    this.sunDirWorld.copy(sunDir).normalize();
    if (!this.csm) return;
    this.csm.lightDirection.copy(this.sunDirWorld).negate();

    const isNight = mode === 'night';
    const col = isNight ? new THREE.Color(0x6b94d8) : new THREE.Color(0xffb868);
    const inten = isNight ? 0.36 : 3.55;
    for (const l of this.csm.lights) {
      l.color.copy(col);
      l.intensity = inten;
    }
    this.renderer.toneMappingExposure = isNight ? 0.96 : 1.04;
    if (this.bloomPass) {
      this.bloomPass.strength = this.quality === 'high' ? (isNight ? 0.26 : 0.14) : 0.12;
      this.bloomPass.threshold = isNight ? 1.28 : 2.10;
    }
  }

  resize(width: number, height: number): void {
    const w = Math.max(1, width);
    const h = Math.max(1, height);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.csm.updateFrustums();
  }

  resetCameraSnap(): void {
    this.camInitialized = false;
  }

  /**
   * Updates Chase (default: ~6m behind, ~1.8m above, speed-reactive FOV 60-75°, spring damping, collision pullback)
   * or Cockpit (first-person inside cabin over dashboard & rotating steering wheel) camera!
   */
  updateGameplayCamera(
    dt: number,
    car: VehiclePhysics,
    rig: CarVisualRig,
    world: PhysicsWorld,
    timeSec: number
  ): void {
    const spdKmh = car.telemetry.speedKmh;
    const nitroBoost = car.telemetry.nitroActive ? 1 : 0;

    if (this.cameraMode === 'cockpit') {
      rig.setCockpitVisible(true);
      rig.root.updateMatrixWorld(true);
      rig.cockpitCameraAnchor.getWorldPosition(this.tmpTargetPos);
      // Subtle realistic road/engine micro-vibration & cornering head-inertia without clipping roof/pillars
      const vibY = Math.sin(timeSec * 36) * 0.0025 * clamp(spdKmh / 120, 0, 1);
      const latShift = clamp(-car.telemetry.lateralG * 0.024, -0.04, 0.04);
      this.tmpFwd.set(0, 0, -1).applyQuaternion(rig.root.quaternion);
      const rgt = new THREE.Vector3(1, 0, 0).applyQuaternion(rig.root.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rig.root.quaternion);

      this.camera.position.copy(this.tmpTargetPos).addScaledVector(rgt, latShift).addScaledVector(up, vibY);
      this.tmpLook.copy(this.camera.position).addScaledVector(this.tmpFwd, 40).addScaledVector(up, -1.05);
      this.camera.up.copy(up);
      this.camera.lookAt(this.tmpLook);

      const targetFov = 64 + clamp(spdKmh / 180, 0, 1) * 7 + nitroBoost * 4;
      this.camera.fov = lerp(this.camera.fov, targetFov, Math.min(1, 8 * dt));
      this.camera.updateProjectionMatrix();

      // Zero motion blur inside cockpit so dashboard/wheel stay 100% sharp!
      this.motionBlurPass.uniforms.uBlurStrength.value = 0.0;
      return;
    }

    // CHASE CAMERA (default)
    rig.setCockpitVisible(false);
    this.camera.up.set(0, 1, 0);

    const sinY = Math.sin(car.yaw);
    const cosY = Math.cos(car.yaw);
    const fwdX = -sinY;
    const fwdZ = -cosY;
    const rgtX = cosY;
    const rgtZ = -sinY;

    // Slight dynamic pullback + FOV widening at speed & nitro
    const speedT = clamp(spdKmh / 160, 0, 1);
    const baseDist = 5.85 + speedT * 0.55 + nitroBoost * 0.45;
    const baseHeight = 1.85 + speedT * 0.10;
    const lateralSwing = clamp(car.telemetry.steerVisualNorm * 0.38, -0.45, 0.45);

    this.tmpTargetPos.set(
      rig.root.position.x - fwdX * baseDist + rgtX * lateralSwing,
      rig.root.position.y + baseHeight,
      rig.root.position.z - fwdZ * baseDist + rgtZ * lateralSwing
    );

    // Camera collision pullback against terrain & nearby barriers/walls (Section 3.3!)
    const hit = world.raycastDown(this.tmpTargetPos.x, this.tmpTargetPos.y + 8, this.tmpTargetPos.z, this.tmpHit);
    const minCamY = hit.y + 0.85;
    if (this.tmpTargetPos.y < minCamY) this.tmpTargetPos.y = minCamY;

    // Keep camera inside horizontal barrier corridor by pulling forward smoothly if crossing a wall
    const camCol = world.resolveHorizontalCollision(this.tmpTargetPos.x, this.tmpTargetPos.y, this.tmpTargetPos.z, 0.75);
    if (camCol.hit) {
      this.tmpTargetPos.x += camCol.pushX * 1.1;
      this.tmpTargetPos.z += camCol.pushZ * 1.1;
    }

    // Look ahead with horizon cleanly in upper third of frame!
    this.tmpLook.set(
      rig.root.position.x + fwdX * 14.0,
      rig.root.position.y + 1.32,
      rig.root.position.z + fwdZ * 14.0
    );

    if (!this.camInitialized) {
      this.camCurrentPos.copy(this.tmpTargetPos);
      this.camCurrentLook.copy(this.tmpLook);
      this.camInitialized = true;
    } else {
      const posAlpha = 1 - Math.exp(-10.5 * dt);
      const lookAlpha = 1 - Math.exp(-14.0 * dt);
      this.camCurrentPos.lerp(this.tmpTargetPos, posAlpha);
      this.camCurrentLook.lerp(this.tmpLook, lookAlpha);
      // Re-enforce ground clearance after spring damping
      const dampHit = world.raycastDown(this.camCurrentPos.x, this.camCurrentPos.y + 8, this.camCurrentPos.z, this.tmpHit);
      if (this.camCurrentPos.y < dampHit.y + 0.75) this.camCurrentPos.y = dampHit.y + 0.75;
    }

    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLook);

    // Speed-reactive FOV (60° -> 75°, widening subtly during Mini-Nitro!)
    const targetFov = 60 + speedT * 10.5 + nitroBoost * 4.5;
    this.camera.fov = lerp(this.camera.fov, targetFov, Math.min(1, 7 * dt));
    this.camera.updateProjectionMatrix();

    // Background-only radial motion blur intensity (player car masked out!)
    const blurAmt = this.quality === 'high' ? clamp((spdKmh - 55) / 105, 0, 1) * 0.50 + nitroBoost * 0.24 : 0;
    this.motionBlurPass.uniforms.uBlurStrength.value = blurAmt;
  }

  setStaticBlurZero(): void {
    this.motionBlurPass.uniforms.uBlurStrength.value = 0.0;
  }

  /**
   * Projects sun direction into screen UV for subtle directional Golden Hour lens flare!
   */
  private updateSunFlareUniform(): void {
    if (this.lighting === 'night' || this.quality === 'low') {
      this.motionBlurPass.uniforms.uSunFlareStrength.value = 0.0;
      return;
    }
    this.tmpVec.copy(this.camera.position).addScaledVector(this.sunDirWorld, 2000);
    this.tmpVec.project(this.camera);
    const camFwd = this.camera.getWorldDirection(this.tmpFwd);
    const facingSun = camFwd.dot(this.sunDirWorld);
    if (facingSun > 0.25 && this.tmpVec.z < 1.0) {
      const sx = this.tmpVec.x * 0.5 + 0.5;
      const sy = this.tmpVec.y * 0.5 + 0.5;
      this.motionBlurPass.uniforms.uSunScreenPos.value.set(sx, sy);
      const edgeFade = clamp(1.0 - Math.max(Math.abs(sx - 0.5), Math.abs(sy - 0.5)) * 1.1, 0, 1);
      this.motionBlurPass.uniforms.uSunFlareStrength.value = smoothFacing(facingSun) * edgeFade;
    } else {
      this.motionBlurPass.uniforms.uSunFlareStrength.value = 0.0;
    }
  }

  render(): void {
    this.renderer.info.reset();
    this.csm.update();
    this.updateSunFlareUniform();
    this.composer.render();
  }

  async precompileShaders(): Promise<void> {
    this.csm.update();
    if (typeof this.renderer.compileAsync === 'function') {
      await this.renderer.compileAsync(this.scene, this.camera);
    } else {
      this.renderer.compile(this.scene, this.camera);
    }
  }

  getAuditInfo(): PipelineAuditInfo {
    const isHigh = this.quality === 'high';
    return {
      quality: this.quality,
      csmActive: !!this.csm && this.csm.cascades >= 2,
      csmCascades: this.csm?.cascades ?? 0,
      csmShadowMapSize: this.csm?.shadowMapSize ?? 0,
      aoActive: !!this.n8aoPass?.enabled,
      aoMethod: this.n8aoPass?.enabled ? 'N8AO (GTAO/HBAO)' : 'disabled (Low preset)',
      toneMapping: this.renderer.toneMapping === THREE.AgXToneMapping ? 'AgX' : 'ACES',
      antiAliasing: isHigh ? 'WebGL2 MSAA 4x + SMAA' : 'Native WebGL AA',
      msaaSamples: this.renderTarget?.samples ?? 0,
      smaaActive: !!this.smaaPass?.enabled,
      bloomActive: !!this.bloomPass?.enabled,
      backgroundMotionBlurActive: !!this.motionBlurPass?.enabled,
    };
  }
}

function smoothFacing(dot: number): number {
  return clamp((dot - 0.25) / 0.72, 0, 1);
}
