import * as THREE from 'three';
import {
  CameraMode,
  CarModelId,
  ControlInput,
  GameScreen,
  LightingMode,
  QualityPreset,
  RaceConfig,
  RigidObstacleRecord,
  TrackSpec,
  VolumeSettings,
  WorldValidationReport,
} from './types';
import { TrackSpline } from './world/trackSpline';
import { TerrainSystem } from './world/terrain';
import { RoadSystem, applyRoadPBRTextures, buildRoadSystem } from './world/roadMesh';
import { PhysicsWorld } from './world/physicsWorld';
import { validateWorld } from './world/validateWorld';
import { LoadedAssets, loadAllAssets } from './world/assets';
import { WaterSkySystem, buildWaterSkySystem } from './world/waterSky';
import { VillageSystem, buildVillageSystem } from './world/architecture';
import { FloraSystem, buildFloraSystem } from './world/flora';
import { PropsBridgeSystem, buildPropsAndBridge } from './world/propsAndBridge';
import { ParticleSystem } from './world/particles';
import { CAR_MODELS, LIVERIES } from './cars/carSpecs';
import { CarVisualRig, buildHeroCar } from './cars/carBuilder';
import { VehiclePhysics } from './physics/vehiclePhysics';
import { AIController, AI_PROFILES, computeTestAutopilotInput } from './ai/aiController';
import { RenderPipeline } from './render/pipeline';
import { RacingAudioEngine } from './audio/audioEngine';
import { RaceHUD } from './ui/hud';
import { MenuUI, RaceResultRow } from './ui/menus';
import { clamp } from './utils/rng';

interface RacerEntry {
  id: string;
  name: string;
  isPlayer: boolean;
  carModel: CarModelId;
  liveryIndex: number;
  physics: VehiclePhysics;
  rig: CarVisualRig;
  ai: AIController | null;
  lastOrderRank: number;
}

export class CostaDoradaGame {
  readonly scene = new THREE.Scene();
  readonly pipeline: RenderPipeline;
  readonly audio = new RacingAudioEngine();
  readonly menus: MenuUI;
  hud!: RaceHUD;

  track!: TrackSpline;
  terrain!: TerrainSystem;
  road!: RoadSystem;
  physicsWorld!: PhysicsWorld;
  waterSky!: WaterSkySystem;
  village!: VillageSystem;
  flora!: FloraSystem;
  propsBridge!: PropsBridgeSystem;
  particles!: ParticleSystem;
  assets!: LoadedAssets;
  validationReport!: WorldValidationReport;

  // Garage showcase rig (separate from active race rigs)
  private garageRig: CarVisualRig | null = null;
  private garageCarModel: CarModelId | null = null;
  private garageLiveryIdx = -1;
  private garageTurntableAngle = 0.65;

  // Active 6-car race roster (index 0 = player, 1..5 = AI)
  racers: RacerEntry[] = [];
  allObstacles: RigidObstacleRecord[] = [];
  // Reference car metrics for BOTH car models (audited at runtime!)
  carModelAudit: Record<
    CarModelId,
    { triangles: number; materials: number; hasParentedWheels: boolean; hasCockpit: boolean; hasSteeringWheel: boolean }
  > = {
    aurelia_gtr: { triangles: 0, materials: 0, hasParentedWheels: false, hasCockpit: false, hasSteeringWheel: false },
    solara_corsa: { triangles: 0, materials: 0, hasParentedWheels: false, hasCockpit: false, hasSteeringWheel: false },
  };

  screen: GameScreen = 'loading';
  config: RaceConfig = {
    carModel: 'aurelia_gtr',
    liveryIndex: 0,
    laps: 3,
    difficulty: 'normal',
    lighting: 'golden_hour',
    quality: 'high',
  };
  volumes: VolumeSettings = { master: 0.85, sfx: 0.9, music: 0.45 };

  // Race timing & state
  private raceElapsed = 0;
  private gridIntroTimer = 0;
  private countdownTimer = 0;
  private lastCountdownInt = 4;
  private goBannerTimer = 0;
  private globalTime = 0;
  private physAccum = 0;
  private readonly fixedDt = 1 / 120;
  private lastFrameMs = 0;
  private rafId = 0;

  // Runtime stats & verification hooks
  aiOvertakesCount = 0;
  aiOvertakeLog: Array<{ time: number; passer: string; passed: string; s: number }> = [];
  aiMaxStuckSeconds = 0;
  cameraClipViolations = 0;
  private staticCameraOverride: { pos: THREE.Vector3; look: THREE.Vector3; fov?: number } | null = null;
  private testAutopilot = false;
  private testAutopilotAllowNitro = true;
  private testAutopilotPace = 1.02;
  private testInputOverride: Partial<ControlInput> | null = null;

  // Live video recorder (canvas + post-limiter Web Audio -> volta.webm!)
  private mediaRecorder: MediaRecorder | null = null;
  private videoChunks: Blob[] = [];
  private videoStopResolve: ((blob: Blob) => void) | null = null;

  // Input state
  private keys = new Set<string>();
  private prevGamepadCam = false;
  private prevGamepadPause = false;

  // Live FPS ring buffer
  private frameDeltasMs: number[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly hudRoot: HTMLElement,
    private readonly uiRoot: HTMLElement
  ) {
    this.pipeline = new RenderPipeline(canvas, this.scene);
    this.menus = new MenuUI(uiRoot, {
      onNavigate: (scr) => this.navigateTo(scr),
      onConfigChange: (patch) => this.updateConfig(patch),
      onVolumeChange: (v) => {
        this.volumes = v;
        this.audio.setVolumes(v);
      },
      onStartRace: () => this.startRace(),
      onResume: () => this.setPaused(false),
      onRestart: () => this.startRace(),
      onUIClick: (kind) => {
        void this.audio.unlock().then(() => this.audio.playUISound(kind));
      },
    });
    this.setupEventListeners();
  }

  async init(): Promise<void> {
    this.menus.showLoading(0.03, 'Loading track.json single source of truth...');
    const trackSpec: TrackSpec = await (await fetch('./track.json')).json();

    this.menus.showLoading(0.08, 'Building spline, road mesh & terrain heightfield...');
    this.track = new TrackSpline(trackSpec, 1500);
    this.terrain = new TerrainSystem(this.track);
    this.road = buildRoadSystem(this.track);
    this.physicsWorld = new PhysicsWorld(this.track, this.terrain, this.road.colliderData);
    this.physicsWorld.buildSplineBarriers();

    // Load ALL real scanned CC0 HDRIs & PBR textures
    this.assets = await loadAllAssets(this.pipeline.renderer, (pct, label) => {
      this.menus.showLoading(0.10 + pct * 0.56, label);
    });

    this.menus.showLoading(0.68, 'Applying scanned PBR, 16x anisotropy & Triplanar cliffs...');
    this.terrain.applyPBRTextures({
      sand: this.assets.textures.sand_beach,
      grass: this.assets.textures.grass_med,
      forest: this.assets.textures.forest_floor,
      gravel: this.assets.textures.gravel_verge,
      cliff: this.assets.textures.cliff_rock,
    });
    applyRoadPBRTextures(this.road, this.track, {
      asphaltMain: this.assets.textures.asphalt_main,
      asphaltWorn: this.assets.textures.asphalt_worn,
      sand: this.assets.textures.sand_beach,
      gravel: this.assets.textures.gravel_verge,
      sidewalk: this.assets.textures.sidewalk_stone,
    });

    this.scene.add(this.terrain.mesh);
    this.scene.add(this.road.group);

    this.menus.showLoading(0.73, 'Constructing Mediterranean ocean, cliffs, village & bridge...');
    this.waterSky = buildWaterSkySystem(this.track, this.terrain);
    this.scene.add(this.waterSky.group);

    this.village = buildVillageSystem(this.track, this.terrain, this.assets);
    this.scene.add(this.village.group);

    this.propsBridge = buildPropsAndBridge(this.track, this.terrain, this.assets);
    this.scene.add(this.propsBridge.group);
    this.waterSky.setCoastalRocks(this.propsBridge.coastalRocks);

    this.menus.showLoading(0.80, 'Modeling 4 Mediterranean tree species & multi-strata flora...');
    this.flora = buildFloraSystem(this.track, this.terrain, this.assets, [
      ...this.village.obstacles,
      ...this.propsBridge.obstacles,
    ]);
    this.scene.add(this.flora.group);

    this.particles = new ParticleSystem();
    this.scene.add(this.particles.group);

    // Register rigid world obstacles into PhysicsWorld and run Section 3.2 validateWorld()!
    this.allObstacles = [...this.village.obstacles, ...this.propsBridge.obstacles, ...this.flora.obstacles];
    for (const o of this.allObstacles) this.physicsWorld.addObstacle(o);
    this.validationReport = validateWorld(this.track, this.terrain, this.allObstacles);
    if (!this.validationReport.ok) {
      console.error('[validateWorld] STRUCTURAL INVARIANT ERRORS:', this.validationReport.errors);
    } else {
      console.log('[validateWorld] PASSED cleanly:', this.validationReport.metrics);
    }

    this.menus.showLoading(0.86, 'Auditing procedural hero cars & cockpits...');
    // Audit both hero car models cleanly
    for (const modelId of ['aurelia_gtr', 'solara_corsa'] as CarModelId[]) {
      const sampleRig = buildHeroCar(CAR_MODELS[modelId], LIVERIES[0], this.assets.textures.tire_rubber, false);
      const hasParentedWheels = sampleRig.wheelMounts.every((wm) => wm.parent === sampleRig.chassisGroup);
      this.carModelAudit[modelId] = {
        triangles: sampleRig.triangleCount,
        materials: sampleRig.materialCount,
        hasParentedWheels,
        hasCockpit: !!sampleRig.cockpitGroup && sampleRig.cockpitGroup.children.length > 5,
        hasSteeringWheel: !!sampleRig.steeringWheelPivot && sampleRig.steeringWheelPivot.children.length > 3,
      };
    }

    // Build HUD & apply initial Golden Hour + High lighting + register all materials with CSM!
    this.hud = new RaceHUD(this.hudRoot, this.track);
    this.applyLightingAndQuality();

    // Build initial Garage showcase car so shader pre-compilation includes car shaders too!
    this.ensureGarageShowcaseCar();
    this.pipeline.registerSceneMaterialsForCSM();

    this.menus.showLoading(0.94, 'Pre-compiling WebGL2 shaders...');
    await this.pipeline.precompileShaders();
    this.menus.showLoading(1.0, 'Ready!');

    // Expose verification & telemetry API on window for reproducible automated verification
    this.installVerificationAPI();

    this.navigateTo('menu');
    this.lastFrameMs = performance.now();
    this.loop(this.lastFrameMs);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      this.pipeline.resize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (e.code === 'KeyC' && (this.screen === 'racing' || this.screen === 'countdown')) {
        this.toggleCameraMode();
      } else if (e.code === 'Escape') {
        if (this.screen === 'racing' || this.screen === 'countdown' || this.screen === 'grid_intro') {
          this.setPaused(true);
        } else if (this.screen === 'paused') {
          this.setPaused(false);
        }
      }
      // First keyboard gesture unlocks Web Audio cleanly
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'Enter') {
        void this.audio.unlock();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    window.addEventListener('pointerdown', () => {
      void this.audio.unlock();
    }, { passive: true });
  }

  toggleCameraMode(): void {
    this.pipeline.cameraMode = this.pipeline.cameraMode === 'chase' ? 'cockpit' : 'chase';
    this.pipeline.resetCameraSnap();
    this.audio.playUISound('nav');
  }

  setCameraMode(mode: CameraMode): void {
    this.pipeline.cameraMode = mode;
    this.pipeline.resetCameraSnap();
  }

  applyLightingAndQuality(): void {
    const isNight = this.config.lighting === 'night';
    const isHigh = this.config.quality === 'high';
    this.pipeline.setQuality(this.config.quality);
    this.waterSky.setLightingMode(this.config.lighting, this.scene, this.assets);
    const sunDir = this.waterSky.getSunDirection(this.config.lighting);
    this.pipeline.applyLightingToCSM(this.config.lighting, sunDir);
    this.village.setNightMode(isNight, isHigh);
    this.propsBridge.setNightMode(isNight);
    this.flora.setQuality(this.config.quality);
    this.flora.update(this.globalTime, sunDir, isNight);

    for (let i = 0; i < this.racers.length; i++) {
      // Real SpotLights active on player + 3 nearest/front AI on High (player + 1 AI on Low)
      const allowRealSpots = i === 0 || (isHigh ? i <= 3 : i <= 1);
      this.racers[i].rig.setNightLights(isNight, allowRealSpots);
    }
    if (this.garageRig) {
      this.garageRig.setNightLights(isNight, true);
    }
  }

  updateConfig(patch: Partial<RaceConfig>): void {
    this.config = { ...this.config, ...patch };
    this.applyLightingAndQuality();
    if (this.screen === 'garage') {
      this.ensureGarageShowcaseCar();
    }
    this.menus.render(this.screen, this.config, this.volumes);
  }

  navigateTo(screen: GameScreen): void {
    this.staticCameraOverride = null;
    if (screen === 'menu' || screen === 'garage' || screen === 'setup') {
      this.audio.stopRaceAudio();
      this.clearRaceRacers();
      this.hud.setVisible(false);
      this.hud.setCenterBanner('');
      this.ensureGarageShowcaseCar();
      if (this.garageRig) this.garageRig.root.visible = screen === 'garage' || screen === 'menu';
    }
    this.screen = screen;
    this.menus.render(screen, this.config, this.volumes);
  }

  private ensureGarageShowcaseCar(): void {
    if (
      this.garageRig &&
      this.garageCarModel === this.config.carModel &&
      this.garageLiveryIdx === this.config.liveryIndex
    ) {
      this.garageRig.setNightLights(this.config.lighting === 'night', true);
      return;
    }
    if (this.garageRig) {
      this.scene.remove(this.garageRig.root);
      this.garageRig = null;
    }
    const spec = CAR_MODELS[this.config.carModel];
    const liv = LIVERIES[this.config.liveryIndex];
    const rig = buildHeroCar(spec, liv, this.assets.textures.tire_rubber, true);
    // Park hero car cleanly on the Z1 Waterfront Starting Grid slot via raycast!
    const sfS = this.track.spec.startFinishS - 12;
    const smp = this.track.sampleAtS(sfS);
    const hit = this.physicsWorld.raycastDown(smp.pos.x, smp.pos.y + 4, smp.pos.z);
    rig.root.position.set(smp.pos.x, hit.y, smp.pos.z);
    rig.root.rotation.y = Math.atan2(-smp.tangent.x, -smp.tangent.z);
    rig.setNightLights(this.config.lighting === 'night', true);
    this.scene.add(rig.root);
    this.pipeline.registerSceneMaterialsForCSM();
    this.garageRig = rig;
    this.garageCarModel = this.config.carModel;
    this.garageLiveryIdx = this.config.liveryIndex;
  }

  private clearRaceRacers(): void {
    for (const r of this.racers) {
      this.scene.remove(r.rig.root);
      r.rig.dispose();
    }
    this.racers = [];
  }

  /**
   * Starts a clean 6-car race from the staggered Waterfront starting grid (Grid Intro -> 3-2-1 -> GO!).
   */
  startRace(skipGridIntro = false): void {
    this.staticCameraOverride = null;
    this.audio.stopRaceAudio();
    this.clearRaceRacers();
    if (this.garageRig) this.garageRig.root.visible = false;

    this.raceElapsed = 0;
    this.physAccum = 0;
    this.aiOvertakesCount = 0;
    this.aiOvertakeLog = [];
    this.aiMaxStuckSeconds = 0;
    this.cameraClipViolations = 0;
    this.pipeline.cameraMode = 'chase';
    this.pipeline.resetCameraSnap();

    // Assign 6 unique liveries (player gets chosen livery; 5 AI get remaining 5!)
    const aiLiveryOrder = [0, 1, 2, 3, 4, 5].filter((i) => i !== this.config.liveryIndex);
    const startS = this.track.spec.startFinishS;
    const isNight = this.config.lighting === 'night';
    const isHigh = this.config.quality === 'high';

    // Grid slots: staggered 2x3 behind Start/Finish (Player starts P4 or P6 -> P4 for immediate pack action!)
    // Actually let's place Player in P4 (middle of the pack!) so wheel-to-wheel overtakes happen right off the start!
    const gridSlots = [
      { s: startS - 10, lat: -2.2 }, // P1
      { s: startS - 16, lat: 2.2 },  // P2
      { s: startS - 22, lat: -2.2 }, // P3
      { s: startS - 28, lat: 2.2 },  // P4 (Player!)
      { s: startS - 34, lat: -2.2 }, // P5
      { s: startS - 40, lat: 2.2 },  // P6
    ];

    const rosterDefs: Array<{
      id: string;
      name: string;
      isPlayer: boolean;
      carModel: CarModelId;
      liveryIdx: number;
      slotIdx: number;
      aiIdx: number;
    }> = [
      {
        id: 'player',
        name: 'Driver',
        isPlayer: true,
        carModel: this.config.carModel,
        liveryIdx: this.config.liveryIndex,
        slotIdx: 3,
        aiIdx: -1,
      },
      ...AI_PROFILES.map((p, idx) => ({
        id: `ai_${idx + 1}`,
        name: p.name,
        isPlayer: false,
        carModel: (idx % 2 === 0 ? 'aurelia_gtr' : 'solara_corsa') as CarModelId,
        liveryIdx: aiLiveryOrder[idx],
        slotIdx: idx < 3 ? idx : idx + 1,
        aiIdx: idx,
      })),
    ];

    for (let i = 0; i < rosterDefs.length; i++) {
      const def = rosterDefs[i];
      const spec = CAR_MODELS[def.carModel];
      const liv = LIVERIES[def.liveryIdx];
      const phys = new VehiclePhysics(def.id, spec, def.isPlayer);
      const slot = gridSlots[def.slotIdx];
      phys.spawnAtSpline(this.physicsWorld, slot.s, slot.lat);
      phys.lap = 1;
      phys.nextCheckpoint = 1;
      phys.checkpointsPassed = 0;
      phys.totalProgress = -((startS - slot.s + this.track.length) % this.track.length);

      const allowRealSpots = def.isPlayer || (isHigh && i <= 1);
      const rig = buildHeroCar(spec, liv, this.assets.textures.tire_rubber, allowRealSpots);
      rig.setNightLights(isNight, allowRealSpots);
      rig.updateFromPhysics(phys, 1.0, this.globalTime);
      this.scene.add(rig.root);

      this.racers.push({
        id: def.id,
        name: def.name,
        isPlayer: def.isPlayer,
        carModel: def.carModel,
        liveryIndex: def.liveryIdx,
        physics: phys,
        rig,
        ai: def.aiIdx >= 0 ? new AIController(AI_PROFILES[def.aiIdx]) : null,
        lastOrderRank: def.slotIdx + 1,
      });
    }

    this.pipeline.registerSceneMaterialsForCSM();
    this.applyLightingAndQuality();

    // Start Audio Engine loops cleanly after user gesture (zero voice duplication!)
    const playerSpec = CAR_MODELS[this.config.carModel];
    void this.audio.unlock().then(() => {
      this.audio.startRaceAudio(playerSpec.engineType, 5);
    });

    this.menus.clear();
    this.hud.setVisible(true);

    if (skipGridIntro) {
      this.screen = 'racing';
      this.hud.setCenterBanner('');
      this.gridIntroTimer = 0;
      this.countdownTimer = 0;
    } else {
      this.screen = 'grid_intro';
      this.gridIntroTimer = 4.8; // ~5 s dramatic Grid Intro camera flyby (Section 10!)
      this.countdownTimer = 3.2;
      this.lastCountdownInt = 4;
      this.hud.setCenterBanner(
        `<div class="intro-title">COSTA DORADA GP</div><div class="intro-sub">${this.config.laps} LAPS · ${
          this.config.lighting === 'night' ? 'MOONLIT NIGHT' : 'GOLDEN HOUR'
        } · ${this.config.difficulty.toUpperCase()}</div>`
      );
    }
  }

  setPaused(paused: boolean): void {
    if (paused && (this.screen === 'racing' || this.screen === 'countdown' || this.screen === 'grid_intro')) {
      this.screen = 'paused';
      this.audio.setPaused(true);
      this.menus.render('paused', this.config, this.volumes);
    } else if (!paused && this.screen === 'paused') {
      this.screen = this.gridIntroTimer > 0 ? 'grid_intro' : this.countdownTimer > 0 ? 'countdown' : 'racing';
      this.audio.setPaused(false);
      this.menus.clear();
      this.lastFrameMs = performance.now();
    }
  }

  private readPlayerInput(): ControlInput {
    if (this.testInputOverride) {
      return {
        throttle: this.testInputOverride.throttle ?? 0,
        brake: this.testInputOverride.brake ?? 0,
        steer: this.testInputOverride.steer ?? 0,
        nitro: this.testInputOverride.nitro ?? false,
      };
    }
    if (this.testAutopilot && this.racers.length > 0) {
      return computeTestAutopilotInput(
        this.racers[0].physics,
        this.racers.map((r) => r.physics),
        this.track,
        { allowNitro: this.testAutopilotAllowNitro, paceMultiplier: this.testAutopilotPace }
      );
    }

    let throttle = this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0;
    let brake = this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0;
    let steer = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) steer -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) steer += 1;
    let nitro = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');

    // Standard Gamepad API support (RT accel, LT brake, Left Stick steer, A/X/RB nitro, Y cam, Start pause)
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads[0];
    if (pad) {
      const rt = pad.buttons[7]?.value ?? 0;
      const lt = pad.buttons[6]?.value ?? 0;
      if (rt > 0.08) throttle = Math.max(throttle, rt);
      if (lt > 0.08) brake = Math.max(brake, lt);
      const axisX = pad.axes[0] ?? 0;
      if (Math.abs(axisX) > 0.12) steer = clamp(axisX, -1, 1);
      if (pad.buttons[0]?.pressed || pad.buttons[2]?.pressed || pad.buttons[5]?.pressed) nitro = true;
      const camBtn = !!pad.buttons[3]?.pressed;
      if (camBtn && !this.prevGamepadCam && this.screen === 'racing') this.toggleCameraMode();
      this.prevGamepadCam = camBtn;
      const pauseBtn = !!pad.buttons[9]?.pressed;
      if (pauseBtn && !this.prevGamepadPause) this.setPaused(this.screen !== 'paused');
      this.prevGamepadPause = pauseBtn;
    }

    return { throttle, brake, steer, nitro };
  }

  /**
   * Updates sequential checkpoints (anti-cut!), lap counters, race completion, and genuine AI overtake log!
   */
  private updateRaceProgress(dt: number): void {
    const cps = this.track.checkpoints;
    const totalCps = cps.length;
    const startS = this.track.spec.startFinishS;

    for (const r of this.racers) {
      const p = r.physics;
      if (p.finished) continue;

      p.currentLapTime = Math.max(0, this.raceElapsed - p.lapStartTime);

      // Check sequential checkpoint crossing (MUST be on-track within road width + small curb margin -> Anti-Cut!)
      const nextCp = cps[p.nextCheckpoint];
      const distToCp = Math.hypot(p.pos.x - nextCp.pos.x, p.pos.z - nextCp.pos.z);
      const maxAllowedLat = nextCp.width * 0.5 + 4.5;
      if (distToCp < nextCp.width * 0.85 + 6.5 && Math.abs(p.splineLateral) <= maxAllowedLat) {
        p.checkpointsPassed++;
        if (p.nextCheckpoint === 0 && p.checkpointsPassed >= totalCps) {
          // Valid complete lap!
          const lapDuration = this.raceElapsed - p.lapStartTime;
          if (lapDuration < p.bestLapTime && lapDuration > 15) p.bestLapTime = lapDuration;
          p.lapStartTime = this.raceElapsed;
          p.currentLapTime = 0;

          if (p.lap >= this.config.laps) {
            p.finished = true;
            p.finishTime = this.raceElapsed;
            if (r.isPlayer) {
              this.finishRace();
              return;
            }
          } else {
            p.lap++;
          }
        }
        p.nextCheckpoint = (p.nextCheckpoint + 1) % totalCps;
      }

      // Compute continuous spline-derived race progress
      const relS = this.track.wrapS(p.splineS - startS);
      // Handle just-before-start negative offset on lap 1 before crossing CP1
      const effRelS = p.checkpointsPassed === 0 && relS > this.track.length * 0.5 ? relS - this.track.length : relS;
      p.totalProgress = (p.lap - 1) * this.track.length + effRelS;

      // Track AI competence (stuck/off-track timer)
      if (!r.isPlayer && p.stuckTimer > this.aiMaxStuckSeconds) {
        this.aiMaxStuckSeconds = p.stuckTimer;
      }
    }

    // Sort standings by spline progress & log genuine AI overtakes!
    const sorted = [...this.racers].sort((a, b) => {
      if (a.physics.finished && b.physics.finished) return a.physics.finishTime - b.physics.finishTime;
      if (a.physics.finished) return -1;
      if (b.physics.finished) return 1;
      return b.physics.totalProgress - a.physics.totalProgress;
    });

    for (let rank = 0; rank < sorted.length; rank++) {
      const r = sorted[rank];
      const newRank = rank + 1;
      if (!r.isPlayer && newRank < r.lastOrderRank && this.raceElapsed > 4.0) {
        const passed = sorted[rank + 1];
        if (passed && !passed.isPlayer) {
          this.aiOvertakesCount++;
          this.aiOvertakeLog.push({
            time: Math.round(this.raceElapsed * 100) / 100,
            passer: r.name,
            passed: passed.name,
            s: Math.round(r.physics.splineS),
          });
        }
      }
      r.lastOrderRank = newRank;
    }
    void dt;
  }

  private finishRace(): void {
    this.screen = 'results';
    this.hud.setVisible(false);
    this.hud.setCenterBanner('');
    this.audio.playUISound('finish');

    const totalRaceDist = this.config.laps * this.track.length;
    const sorted = [...this.racers].sort((a, b) => {
      if (a.physics.finished && b.physics.finished) return a.physics.finishTime - b.physics.finishTime;
      if (a.physics.finished) return -1;
      if (b.physics.finished) return 1;
      return b.physics.totalProgress - a.physics.totalProgress;
    });

    const rows: RaceResultRow[] = sorted.map((r, idx) => {
      const p = r.physics;
      let totalTime = p.finishTime;
      let projected = false;
      if (!p.finished) {
        projected = true;
        const remainingDist = Math.max(10, totalRaceDist - p.totalProgress);
        const avgSpeedMs = Math.max(18, p.totalProgress / Math.max(1, this.raceElapsed));
        totalTime = this.raceElapsed + remainingDist / avgSpeedMs;
      }
      return {
        position: idx + 1,
        name: r.name,
        carName: CAR_MODELS[r.carModel].name,
        number: LIVERIES[r.liveryIndex].number,
        isPlayer: r.isPlayer,
        totalTimeSec: totalTime,
        projected,
        bestLapSec: p.bestLapTime,
      };
    });

    this.menus.render('results', this.config, this.volumes, rows);
  }

  private stepFixedPhysics(dt: number): void {
    const allowDriving = this.screen === 'racing';
    const playerInput = this.readPlayerInput();
    const allPhys = this.racers.map((r) => r.physics);

    for (let i = 0; i < this.racers.length; i++) {
      const r = this.racers[i];
      const inp = r.isPlayer
        ? playerInput
        : allowDriving && r.ai
        ? r.ai.computeInput(r.physics, allPhys, this.track, this.config.difficulty, dt)
        : { throttle: 0, brake: 1, steer: 0, nitro: false };
      r.physics.step(dt, inp, this.physicsWorld, this.raceElapsed, allowDriving);
    }

    // Car-vs-car pairwise collisions
    for (let i = 0; i < this.racers.length; i++) {
      for (let j = i + 1; j < this.racers.length; j++) {
        VehiclePhysics.resolveCarPair(this.racers[i].physics, this.racers[j].physics);
      }
    }

    if (allowDriving) {
      this.raceElapsed += dt;
      this.updateRaceProgress(dt);
    }
  }

  private loop = (nowMs: number): void => {
    this.rafId = requestAnimationFrame(this.loop);
    const rawDtMs = nowMs - this.lastFrameMs;
    this.lastFrameMs = nowMs;
    const dt = Math.min(rawDtMs / 1000, 0.05);
    this.globalTime += dt;

    // Record FPS window (last 300 frames)
    if (rawDtMs > 0.5 && rawDtMs < 500) {
      this.frameDeltasMs.push(rawDtMs);
      if (this.frameDeltasMs.length > 300) this.frameDeltasMs.shift();
    }

    // Update animated coastal world (waves, moored boats, foliage sway)
    const sunDir = this.waterSky.getSunDirection(this.config.lighting);
    this.waterSky.update(this.globalTime, this.pipeline.camera.position);
    this.propsBridge.update(this.globalTime);
    this.flora.update(this.globalTime, sunDir, this.config.lighting === 'night');

    // Screen-specific camera & physics orchestration
    if (this.staticCameraOverride) {
      this.pipeline.camera.position.copy(this.staticCameraOverride.pos);
      this.pipeline.camera.up.set(0, 1, 0);
      this.pipeline.camera.lookAt(this.staticCameraOverride.look);
      if (this.staticCameraOverride.fov) {
        this.pipeline.camera.fov = this.staticCameraOverride.fov;
        this.pipeline.camera.updateProjectionMatrix();
      }
      this.pipeline.setStaticBlurZero();
    } else if (this.screen === 'menu' || this.screen === 'setup') {
      // Live scenic coastal track background sweep along Z1 waterfront & bay!
      const s = this.track.wrapS(this.track.spec.startFinishS - 45 + Math.sin(this.globalTime * 0.11) * 140);
      const smp = this.track.sampleAtS(s);
      const camPos = smp.pos
        .clone()
        .addScaledVector(smp.flatRight, -11.5)
        .add(new THREE.Vector3(0, 6.2, 0));
      const lookSmp = this.track.sampleAtS(s + 58);
      this.pipeline.camera.position.copy(camPos);
      this.pipeline.camera.lookAt(lookSmp.pos.x, lookSmp.pos.y + 1.8, lookSmp.pos.z);
      this.pipeline.camera.fov = 58;
      this.pipeline.camera.updateProjectionMatrix();
      this.pipeline.setStaticBlurZero();
    } else if (this.screen === 'garage') {
      // Rotating 3D showcase right on the coastal waterfront grid in chosen lighting!
      this.garageTurntableAngle += dt * 0.32;
      if (this.garageRig) {
        const carPos = this.garageRig.root.position;
        const r = 5.4;
        const cx = carPos.x + Math.sin(this.garageTurntableAngle) * r;
        const cz = carPos.z + Math.cos(this.garageTurntableAngle) * r;
        this.pipeline.camera.position.set(cx, carPos.y + 1.48, cz);
        // Offset look slightly left so car sits cleanly right-of-center beside the Garage card!
        this.pipeline.camera.lookAt(carPos.x - 0.85, carPos.y + 0.72, carPos.z);
        this.pipeline.camera.fov = 46;
        this.pipeline.camera.updateProjectionMatrix();
        this.pipeline.setStaticBlurZero();
      }
    } else if (this.screen === 'grid_intro' || this.screen === 'countdown' || this.screen === 'racing') {
      // Step 120 Hz fixed-timestep vehicle physics!
      this.physAccum += dt;
      let steps = 0;
      while (this.physAccum >= this.fixedDt && steps < 8) {
        this.stepFixedPhysics(this.fixedDt);
        this.physAccum -= this.fixedDt;
        steps++;
      }
      const alpha = clamp(this.physAccum / this.fixedDt, 0, 1);

      // Update ALL car visual rigs (chassis + parented wheels in exact same render step!) & particles!
      for (const r of this.racers) {
        r.rig.updateFromPhysics(r.physics, alpha, this.globalTime);
        this.particles.emitForVehicle(r.physics, dt);
      }
      this.particles.update(dt);

      const player = this.racers[0];

      // Grid Intro (~4.8 s) -> 3-2-1 Countdown -> Racing!
      if (this.screen === 'grid_intro') {
        this.gridIntroTimer -= dt;
        const prog = clamp(1 - this.gridIntroTimer / 4.8, 0, 1);
        const startS = this.track.spec.startFinishS;
        const camS = startS - 48 + prog * 44;
        const smp = this.track.sampleAtS(camS);
        const sideSwing = Math.sin(prog * Math.PI) * 5.2 - 3.6;
        this.pipeline.camera.position.set(
          smp.pos.x + smp.flatRight.x * sideSwing,
          smp.pos.y + 2.4 + (1 - prog) * 2.2,
          smp.pos.z + smp.flatRight.z * sideSwing
        );
        const lookP = player.rig.root.position;
        this.pipeline.camera.lookAt(lookP.x, lookP.y + 0.9, lookP.z);
        this.pipeline.setStaticBlurZero();

        if (this.gridIntroTimer <= 0) {
          this.screen = 'countdown';
          this.pipeline.resetCameraSnap();
        }
      } else if (this.screen === 'countdown') {
        this.countdownTimer -= dt;
        const num = Math.ceil(this.countdownTimer);
        if (num < this.lastCountdownInt && num >= 1) {
          this.lastCountdownInt = num;
          this.hud.setCenterBanner(`<div class="countdown-num">${num}</div>`);
          this.audio.playUISound('count');
        }
        this.pipeline.updateGameplayCamera(dt, player.physics, player.rig, this.physicsWorld, this.globalTime);
        if (this.countdownTimer <= 0) {
          this.screen = 'racing';
          this.goBannerTimer = 1.1;
          this.hud.setCenterBanner('<div class="countdown-num go">GO!</div>');
          this.audio.playUISound('go');
        }
      } else {
        if (this.goBannerTimer > 0) {
          this.goBannerTimer -= dt;
          if (this.goBannerTimer <= 0) this.hud.setCenterBanner('');
        }
        this.pipeline.updateGameplayCamera(dt, player.physics, player.rig, this.physicsWorld, this.globalTime);
      }

      // Check camera collision invariant (never below terrain!)
      const camGround = this.terrain.getHeight(this.pipeline.camera.position.x, this.pipeline.camera.position.z);
      if (this.pipeline.camera.position.y < camGround - 0.1) {
        this.cameraClipViolations++;
      }

      // Update Audio Engine & HUD
      const zone = this.track.getZoneForS(player.physics.splineS);
      this.audio.update(
        dt,
        this.raceElapsed,
        player.physics,
        this.racers.slice(1).map((r) => r.physics),
        this.pipeline.camera,
        zone,
        this.config.lighting,
        this.pipeline.cameraMode === 'cockpit'
      );
      this.hud.update(
        player.physics,
        this.racers.slice(1).map((r) => r.physics),
        player.lastOrderRank,
        this.config.laps,
        zone,
        this.pipeline.cameraMode
      );
    }

    this.pipeline.render();
  };

  // ===========================================================================
  // LIVE RUNTIME AUDIT & DETERMINISTIC VERIFICATION API (Section 13!)
  // ===========================================================================
  private collectLiveSceneStats() {
    // Inspect LIVE scene graph & renderer materials!
    const roadAniso = this.road.asphaltMaterial.map?.anisotropy ?? 0;
    const roadImg = this.road.asphaltMaterial.map?.image as { width?: number; height?: number } | undefined;

    let syntheticNoisePrimaryMaps = 0;
    let materialsBelowMinRes = 0;
    let totalPrimaryTexturedMats = 0;
    const seenMats = new Set<THREE.Material>();

    this.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (!m || seenMats.has(m)) continue;
        seenMats.add(m);
        if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
          if (m.map) {
            totalPrimaryTexturedMats++;
            const src = (m.map.userData?.sourceUrl as string) || '';
            const isCanvasOrData =
              m.map instanceof THREE.CanvasTexture || m.map instanceof THREE.DataTexture;
            if (isCanvasOrData && !obj.name.includes('cockpit') && !obj.name.includes('contact_shadow')) {
              syntheticNoisePrimaryMaps++;
            }
            const im = m.map.image as { width?: number; height?: number } | undefined;
            if (src && im && ((im.width ?? 0) < 1024 || (im.height ?? 0) < 1024)) {
              materialsBelowMinRes++;
            }
          }
        }
      }
    });

    const pipe = this.pipeline.getAuditInfo();
    const audioReport = this.audio.getAuditReport();

    return {
      generatedAt: new Date().toISOString(),
      renderer: {
        calls: this.pipeline.renderer.info.render.calls,
        triangles: this.pipeline.renderer.info.render.triangles,
        geometries: this.pipeline.renderer.info.memory.geometries,
        textures: this.pipeline.renderer.info.memory.textures,
        maxAnisotropy: this.assets.maxAnisotropy,
      },
      worldValidation: this.validationReport,
      cars: this.carModelAudit,
      pipeline: {
        ...pipe,
        roadAnisotropy: roadAniso,
        roadAsphaltResolution: [roadImg?.width ?? 0, roadImg?.height ?? 0],
        triplanarCliffActive: this.terrain.triplanarActive,
        foliageTranslucencyActive: this.flora.foliageTranslucencyActive,
      },
      materials: {
        totalPrimaryTexturedMats,
        syntheticNoisePrimaryMaps,
        materialsBelowMinRes,
      },
      villageZ3: {
        unitCount: this.village.unitCount,
        archetypes: this.village.archetypes,
        archetypeCount: this.village.archetypes.length,
        tierCounts: this.village.tierCounts,
        hasMultiLayerDepth: this.village.tierCounts.tier2 >= 15 && this.village.tierCounts.tier3 >= 10,
        alleyCount: this.village.alleyCount,
      },
      woodsZ4: {
        treeSpecies: this.flora.speciesNames,
        treeSpeciesCount: this.flora.speciesNames.length,
        hasTrees: this.flora.hasTrees,
        hasShrubs: this.flora.hasShrubs,
        hasGroundcover: this.flora.hasGroundcover,
        totalTrees: this.flora.totalTreeCount,
        totalShrubs: this.flora.totalShrubCount,
        totalGrassTufts: this.flora.totalGrassCount,
      },
      props: {
        totalProps: this.propsBridge.propCountTotal,
        propsPer100m: this.propsBridge.propsPer100m,
      },
      audio: audioReport,
    };
  }

  /**
   * Reproducible in-code camera poses for EVERY mandatory screenshot S1–S15 (Section 13.4)!
   */
  private poseForShot(shotId: string): void {
    this.staticCameraOverride = null;
    this.waterSky.setFogDensityOverride(null, this.scene);

    // Helper: spawn active race cleanly if needed, set speed/pose for live gameplay shot
    const prepareLivePose = (
      s: number,
      lat: number,
      speedKmh: number,
      lighting: LightingMode,
      quality: QualityPreset,
      showHud: boolean,
      camMode: CameraMode = 'chase',
      steerVisual = 0,
      packNearPlayer = false
    ) => {
      if (this.config.lighting !== lighting || this.config.quality !== quality) {
        this.config.lighting = lighting;
        this.config.quality = quality;
        this.applyLightingAndQuality();
      }
      if (this.racers.length === 0 || this.screen !== 'racing') {
        this.startRace(true);
      }
      this.screen = 'racing';
      this.menus.clear();
      this.hud.setVisible(showHud);
      this.hud.setCenterBanner('');
      this.setCameraMode(camMode);

      const p = this.racers[0].physics;
      p.spawnAtSpline(this.physicsWorld, s, lat);
      const fwd = p.getForwardVector();
      p.vel.copy(fwd).multiplyScalar(speedKmh / 3.6);
      p.telemetry.speedKmh = speedKmh;
      p.telemetry.rpm = 5400 + (speedKmh / 150) * 2400;
      p.telemetry.gear = speedKmh > 125 ? 5 : speedKmh > 95 ? 4 : speedKmh > 65 ? 3 : 2;
      p.telemetry.steerVisualNorm = steerVisual;
      p.steerSmoothed = steerVisual;
      if (Math.abs(steerVisual) > 0.05) {
        p.wheels[0].steerYaw = -steerVisual * 0.34;
        p.wheels[1].steerYaw = -steerVisual * 0.38;
      }
      this.racers[0].rig.updateFromPhysics(p, 1.0, this.globalTime);

      // Position AI cars organically ahead/beside player so gameplay shots feel alive!
      const offsets = packNearPlayer
        ? [
            { ds: 4.5, lat: -2.5 },
            { ds: 7.2, lat: 2.3 },
            { ds: 13.5, lat: -0.6 },
            { ds: 19.0, lat: 2.0 },
            { ds: -9.0, lat: -1.8 },
          ]
        : [
            { ds: 18, lat: -2.0 },
            { ds: 34, lat: 1.9 },
            { ds: 56, lat: -1.2 },
            { ds: -20, lat: 1.6 },
            { ds: 88, lat: 0.4 },
          ];
      for (let i = 1; i < this.racers.length; i++) {
        const o = offsets[i - 1];
        const ai = this.racers[i].physics;
        ai.spawnAtSpline(this.physicsWorld, s + o.ds, o.lat);
        const af = ai.getForwardVector();
        ai.vel.copy(af).multiplyScalar((speedKmh * 0.96) / 3.6);
        this.racers[i].rig.updateFromPhysics(ai, 1.0, this.globalTime);
      }

      // Snap gameplay camera cleanly
      this.pipeline.resetCameraSnap();
      this.pipeline.updateGameplayCamera(0.016, p, this.racers[0].rig, this.physicsWorld, this.globalTime);
      const zone = this.track.getZoneForS(p.splineS);
      this.hud.update(
        p,
        this.racers.slice(1).map((r) => r.physics),
        packNearPlayer ? 3 : 2,
        this.config.laps,
        zone,
        camMode
      );
    };

    switch (shotId) {
      case 's1': {
        // Golden Hour waterfront straight at speed, low sun ahead!
        prepareLivePose(265, 1.0, 146, 'golden_hour', 'high', true, 'chase', 0, false);
        break;
      }
      case 's2': {
        // Hero car on grid, low front 3/4 angle (NO HUD; verify panelized surfacing, wheel arches, glass!)
        prepareLivePose(this.track.spec.startFinishS - 18, 0, 0, 'golden_hour', 'high', false, 'chase', 0.28, false);
        const p = this.racers[0].rig.root.position;
        const f = this.racers[0].physics.getForwardVector();
        const r = this.racers[0].physics.getRightVector();
        this.staticCameraOverride = {
          pos: p.clone().addScaledVector(f, 3.85).addScaledVector(r, -2.55).add(new THREE.Vector3(0, 1.02, 0)),
          look: p.clone().addScaledVector(f, -0.15).add(new THREE.Vector3(0, 0.64, 0)),
          fov: 42,
        };
        break;
      }
      case 's3': {
        // Low shoreline shot: wet sand, animated foam, coastal rocks & turquoise sea!
        prepareLivePose(290, 0, 118, 'golden_hour', 'high', false, 'chase');
        const smp = this.track.sampleAtS(295);
        const rock = this.propsBridge.coastalRocks[6] ?? { x: -55, z: 40, radius: 2.5 };
        this.staticCameraOverride = {
          pos: new THREE.Vector3(rock.x + 15.5, 2.55, rock.z + 18.0),
          look: new THREE.Vector3(rock.x - 4.0, 0.55, rock.z - 14.0),
          fov: 52,
        };
        void smp;
        break;
      }
      case 's4': {
        // High Z2 limestone cliffside overlook curving above the turquoise sea (Ref 02: Triplanar rock right, steel guardrail & open sea left!)
        prepareLivePose(985, -0.6, 98, 'golden_hour', 'high', true, 'chase', 0.22, false);
        break;
      }
      case 's5': {
        // Village street showing multi-depth rooftops, props, Plaza & Hero Church Bell Tower looming ahead (Ref 05!)
        prepareLivePose(this.track.spec.plaza.s - 66, 0.9, 86, 'golden_hour', 'high', true, 'chase', 0.08, false);
        break;
      }
      case 's6': {
        // Coastal woods with grazing golden-hour light & foliage translucency!
        prepareLivePose(2770, 0.0, 112, 'golden_hour', 'high', true, 'chase', -0.15, false);
        break;
      }
      case 's7': {
        // Viaduct bridge anchored cleanly into wooded ravine terrain (unobstructed view of arches, piers, abutments & deck!)
        prepareLivePose(this.track.spec.bridge.startS + 44, 0.2, 118, 'golden_hour', 'high', true, 'chase', 0, false);
        const brView = this.track.sampleAtS(this.track.spec.bridge.startS + 28);
        const brLook = this.track.sampleAtS(this.track.spec.bridge.startS + 78);
        const camPos = brView.pos.clone().addScaledVector(brView.flatRight, -18.5);
        const terrY = this.terrain.getHeight(camPos.x, camPos.z);
        camPos.y = Math.max(terrY + 3.2, brView.pos.y - 3.0);
        this.staticCameraOverride = {
          pos: camPos,
          look: brLook.pos.clone().add(new THREE.Vector3(0, -3.5, 0)),
          fov: 54,
        };
        break;
      }
      case 's8': {
        // Wheel-to-wheel pack battle with 2+ AI cars!
        prepareLivePose(2030, 0.6, 98, 'golden_hour', 'high', true, 'chase', 0.15, true);
        break;
      }
      case 's9': {
        // Close-up of sharp anisotropic asphalt, white edge line, curb, shoulder transition & smooth continuous steel guardrail!
        prepareLivePose(860, -2.0, 96, 'golden_hour', 'high', true, 'chase');
        const smp = this.track.sampleAtS(865);
        this.staticCameraOverride = {
          pos: smp.pos.clone().addScaledVector(smp.flatRight, -3.1).add(new THREE.Vector3(0, 0.96, 0)),
          look: smp.pos.clone().addScaledVector(smp.tangent, 24).addScaledVector(smp.flatRight, -4.6).add(new THREE.Vector3(0, 0.35, 0)),
          fov: 48,
        };
        break;
      }
      case 's10': {
        // Exact S5 camera pose on Low preset!
        prepareLivePose(this.track.spec.plaza.s - 66, 0.9, 86, 'golden_hour', 'low', true, 'chase', 0.08, false);
        break;
      }
      case 's11': {
        // Scale proof: hero car parked directly beside a Z3 village building & its 2.15m front door!
        const anc = this.village.scaleProofAnchor;
        prepareLivePose(anc.carParkS, anc.carParkLateral, 0, 'golden_hour', 'high', false, 'chase');
        const carPos = this.racers[0].rig.root.position;
        const doorPos = anc.doorPos;
        const mid = carPos.clone().lerp(doorPos, 0.45);
        const tangent = this.track.sampleAtS(anc.carParkS).tangent;
        this.staticCameraOverride = {
          pos: mid.clone().addScaledVector(tangent, -7.8).addScaledVector(anc.facingDir, 3.6).add(new THREE.Vector3(0, 1.35, 0)),
          look: mid.clone().add(new THREE.Vector3(0, 0.85, 0)),
          fov: 46,
        };
        break;
      }
      case 's12': {
        // Top-down overview of the ENTIRE coastal circuit (clear aerial visibility without heavy ground fog!)
        prepareLivePose(200, 0, 0, 'golden_hour', 'high', false, 'chase');
        this.waterSky.setFogDensityOverride(0.00003, this.scene);
        this.staticCameraOverride = {
          pos: new THREE.Vector3(295, 1180, 15),
          look: new THREE.Vector3(295, 0, 14),
          fov: 54,
        };
        break;
      }
      case 's13': {
        // Night Mode: coastal cliffside at speed showing bright real headlight beams, moonlit sea & HUD!
        prepareLivePose(920, -0.5, 108, 'night', 'high', true, 'chase', 0.14, false);
        break;
      }
      case 's14': {
        // Night Mode: Z3 village street showing warm amber streetlamps, lit windows, red tail lights & headlights!
        prepareLivePose(this.track.spec.plaza.s - 56, 0.5, 84, 'night', 'high', true, 'chase', 0.08, true);
        break;
      }
      case 's15': {
        // Cockpit View: first-person inside cabin mid-corner overlooking coastal cliff & sea with unobstructed OLED cluster!
        prepareLivePose(975, -0.5, 96, 'golden_hour', 'high', true, 'cockpit', 0.58, false);
        break;
      }
    }
    this.pipeline.render();
  }

  private poseSweepAtS(s: number, quality: QualityPreset): void {
    this.staticCameraOverride = null;
    this.waterSky.setFogDensityOverride(null, this.scene);
    if (this.config.quality !== quality || this.config.lighting !== 'golden_hour') {
      this.config.quality = quality;
      this.config.lighting = 'golden_hour';
      this.applyLightingAndQuality();
    }
    if (this.racers.length === 0 || this.screen !== 'racing') {
      this.startRace(true);
    }
    this.screen = 'racing';
    this.menus.clear();
    this.hud.setVisible(false);
    this.setCameraMode('chase');
    const p = this.racers[0].physics;
    p.spawnAtSpline(this.physicsWorld, s, 0);
    p.vel.copy(p.getForwardVector()).multiplyScalar(22);
    this.racers[0].rig.updateFromPhysics(p, 1.0, this.globalTime);
    this.pipeline.resetCameraSnap();
    this.pipeline.updateGameplayCamera(0.016, p, this.racers[0].rig, this.physicsWorld, this.globalTime);
    this.pipeline.setStaticBlurZero();
    this.pipeline.render();
  }

  private installVerificationAPI(): void {
    (window as unknown as Record<string, unknown>).__RACING_API__ = {
      getScreen: () => this.screen,
      getTrackLength: () => this.track.length,
      getValidationReport: () => this.validationReport,
      getSceneStats: () => this.collectLiveSceneStats(),
      setConfig: (patch: Partial<RaceConfig>) => this.updateConfig(patch),
      navigateTo: (scr: GameScreen) => this.navigateTo(scr),
      startRace: (skipIntro = false) => this.startRace(skipIntro),
      setPaused: (p: boolean) => this.setPaused(p),
      setCameraMode: (m: CameraMode) => this.setCameraMode(m),
      setAutopilot: (enabled: boolean, opts?: { allowNitro?: boolean; pace?: number }) => {
        this.testAutopilot = enabled;
        this.testAutopilotAllowNitro = opts?.allowNitro ?? true;
        this.testAutopilotPace = opts?.pace ?? 1.02;
      },
      setInputOverride: (inp: Partial<ControlInput> | null) => {
        this.testInputOverride = inp;
      },
      poseForShot: (shotId: string) => this.poseForShot(shotId),
      poseSweepAtS: (s: number, quality: QualityPreset = 'high') => this.poseSweepAtS(s, quality),
      unlockAudio: () => this.audio.unlock(),
      startAudioCapture: () => this.audio.startMasterPCMCapture(),
      stopAudioCapture: () => this.audio.stopMasterPCMCapture(),
      getAudioAudit: () => this.audio.getAuditReport(),
      startVideoCapture: () => {
        const videoStream = this.canvas.captureStream(30);
        const audioStream = this.audio.getMediaStream();
        const tracks = [...videoStream.getVideoTracks(), ...(audioStream ? audioStream.getAudioTracks() : [])];
        const combined = new MediaStream(tracks);
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm';
        this.videoChunks = [];
        this.mediaRecorder = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: 4_500_000 });
        this.mediaRecorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) this.videoChunks.push(ev.data);
        };
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.videoChunks, { type: mime });
          this.videoStopResolve?.(blob);
          this.videoStopResolve = null;
        };
        this.mediaRecorder.start(500);
      },
      stopVideoCapture: async (): Promise<string> => {
        if (!this.mediaRecorder) return '';
        const blob = await new Promise<Blob>((resolve) => {
          this.videoStopResolve = resolve;
          this.mediaRecorder!.stop();
        });
        this.mediaRecorder = null;
        const arr = new Uint8Array(await blob.arrayBuffer());
        let bin = '';
        const chunk = 0x8000;
        for (let i = 0; i < arr.length; i += chunk) {
          bin += String.fromCharCode(...arr.subarray(i, i + chunk));
        }
        return btoa(bin);
      },
      /** Fast deterministic simulation advance (uses the exact same 120 Hz physics & race rules!) */
      advancePhysicsSteps: (steps: number) => {
        for (let i = 0; i < steps; i++) {
          this.stepFixedPhysics(this.fixedDt);
          if (this.screen === 'results') break;
        }
        for (const r of this.racers) r.rig.updateFromPhysics(r.physics, 1.0, this.globalTime);
      },
      /** Teleport player to specific spline location for anti-cut / steering / Z3 FPS setup */
      placePlayerAt: (s: number, lateral: number) => {
        if (this.racers.length === 0) return;
        this.racers[0].physics.spawnAtSpline(this.physicsWorld, s, lateral);
        this.racers[0].rig.updateFromPhysics(this.racers[0].physics, 1.0, this.globalTime);
        this.pipeline.resetCameraSnap();
      },
      getRaceTelemetry: () => {
        const p = this.racers[0]?.physics;
        return {
          screen: this.screen,
          raceElapsed: this.raceElapsed,
          player: p
            ? {
                x: p.pos.x,
                y: p.pos.y,
                z: p.pos.z,
                yaw: p.yaw,
                s: p.splineS,
                lateral: p.splineLateral,
                speedKmh: p.telemetry.speedKmh,
                gear: p.telemetry.gear,
                rpm: p.telemetry.rpm,
                nitro: p.nitro,
                nitroActive: p.nitroActive,
                lap: p.lap,
                checkpointsPassed: p.checkpointsPassed,
                nextCheckpoint: p.nextCheckpoint,
                finished: p.finished,
                bestLapTime: p.bestLapTime,
                safetyResetCount: p.safetyResetCount,
                underTerrainResets: p.underTerrainResets,
                outOfWorldResets: p.outOfWorldResets,
                maxWheelAirGap: p.maxWheelAirGap,
              }
            : null,
          aiOvertakesCount: this.aiOvertakesCount,
          aiOvertakeLog: this.aiOvertakeLog,
          aiMaxStuckSeconds: this.aiMaxStuckSeconds,
          totalResetsAllCars: this.racers.reduce((acc, r) => acc + r.physics.safetyResetCount, 0),
          totalUnderTerrainResetsAllCars: this.racers.reduce((acc, r) => acc + r.physics.underTerrainResets, 0),
          cameraClipViolations: this.cameraClipViolations,
        };
      },
      resetFPSWindow: () => {
        this.frameDeltasMs = [];
      },
      getFPSStats: () => {
        if (this.frameDeltasMs.length === 0) return { avgFps: 0, low1PctFps: 0, samples: 0 };
        const sorted = [...this.frameDeltasMs].sort((a, b) => a - b);
        const avgMs = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        const p99Idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));
        const p99Ms = sorted[p99Idx];
        return {
          avgFps: Math.round((1000 / avgMs) * 10) / 10,
          low1PctFps: Math.round((1000 / p99Ms) * 10) / 10,
          samples: sorted.length,
        };
      },
    };
  }
}
