import * as THREE from 'three';
import { TrackSpline } from './world/track';
import { TerrainField } from './world/terrain';
import { validateWorld } from './world/validator';
import { PhysicsWorld } from './physics/world';
import { ArcadeVehicle, CAR_SPECS, VehicleInput } from './physics/vehicle';
import { RaceCamera } from './game/camera';
import { setupGoldenHourLighting } from './render/lighting';
import {
  createRoadMaterial,
  createTerrainMaterial,
  loadWorldTextureBank,
} from './world/materials';
import { buildCarVisual, CarVisualInstance } from './world/cars';
import { LIVERIES } from './world/carTextures';
import { createOceanSystem } from './world/ocean';
import { loadPropAssetBank } from './world/gltfAssets';
import { createVegetationPrototypes } from './world/vegetation';
import { buildFullCircuitScenery } from './world/sceneryAll';
import { runSceneGraphAudit, SceneAuditReport } from './world/sceneAudit';
import { ParticleSystem } from './world/particles';
import { PostPipeline } from './render/post';
import { AIDriver, Difficulty } from './ai/driver';
import { GameAudioManager } from './audio/manager';
import { RaceRulesTracker } from './game/raceState';
import { AppUi, GameScreen } from './ui/appUi';
import { TrackData, WorldValidationReport } from './world/types';

const AI_PILOT_NAMES = [
  'Tiago Silva',
  'Mariana Costa',
  'Lucas Ferreira',
  'Sofia Mendes',
  'Diogo Almeida',
];

const GRID_SLOTS: { s: number; lat: number }[] = [
  { s: 41.5, lat: -2.2 }, // P1
  { s: 36.5, lat: 2.2 },  // P2
  { s: 31.5, lat: -2.2 }, // P3
  { s: 26.5, lat: 2.2 },  // P4
  { s: 21.5, lat: -2.2 }, // P5
  { s: 16.5, lat: 2.2 },  // P6 (Player)
];

declare global {
  interface Window {
    __RACE_VERIFY__?: {
      ready: boolean;
      gate: string;
      validation: WorldValidationReport;
      sceneAudit: SceneAuditReport;
      trackLength: number;
      getState: () => {
        screen: GameScreen;
        raceStarted: boolean;
        playerS: number;
        playerLap: number;
        playerRank: number;
        totalRacers: number;
        antiCutBlockedCount: number;
        audioVoices: number;
        playerEngineHasAudioBuffer: boolean;
        quality: 'high' | 'low';
        fps: number;
      };
      setQuality: (q: 'high' | 'low') => void;
      setAutopilot: (enabled: boolean) => void;
      unlockAudio: () => Promise<boolean>;
      startRaceImmediate: (laps?: number, difficulty?: Difficulty) => { audioVoices: number };
      restartRaceImmediate: () => { audioVoices: number };
      teleportPlayer: (s: number, lateral?: number) => void;
      getAudioEvents: () => unknown[];
      startWavCapture: () => void;
      stopWavCapture: () => { wavBase64: string; peakDbfs: number; sampleRate: number; durationSec: number };
      startVideoCapture: () => boolean;
      stopVideoCapture: () => Promise<string>;
      setCameraShot: (
        shot: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9' | 'S10' | 'S11' | 'S12' | 'chase' | 'hood'
      ) => { fps: number };
      stepSimSeconds: (
        seconds: number,
        opts?: { autopilot?: boolean }
      ) => {
        minY: number;
        maxY: number;
        safetyResets: number;
        invariantFailures: string[];
        cameraIntersections: number;
        lapCompleted: boolean;
        lapTimeSec: number;
        playerRank: number;
        playerOvertakes: number;
        maxAiStuckSec: number;
        antiCutBlockedCount: number;
      };
    };
  }
}

function syncCarVisual(vis: CarVisualInstance, veh: ArcadeVehicle, dt: number): void {
  vis.root.position.copy(veh.pos);
  vis.root.quaternion.copy(veh.quat);
  vis.bodyPivot.rotation.z = veh.bodyRoll;
  vis.bodyPivot.rotation.x = veh.bodyPitch;

  for (let i = 0; i < 4; i++) {
    const w = veh.wheels[i];
    vis.wheelSteerGroups[i].rotation.y = w.steerAngle;
    vis.wheelSpinGroups[i].rotation.x = w.spinAngle;
    vis.wheelSteerGroups[i].position.y = -0.18 + w.compression * 0.14;
  }

  const targetBrakeIntensity = veh.isBraking ? 5.5 : 1.3;
  vis.brakeLightMat.emissiveIntensity +=
    (targetBrakeIntensity - vis.brakeLightMat.emissiveIntensity) * Math.min(1, 18 * dt);
}

function setLayerRecursive(obj: THREE.Object3D, layer: number, enabled: boolean): void {
  obj.traverse((child) => {
    if (enabled) child.layers.enable(layer);
    else child.layers.disable(layer);
  });
}

async function main() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const uiRoot = document.getElementById('ui-root') as HTMLDivElement;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.88;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const res = await fetch('./track.json');
  const trackData: TrackData = await res.json();
  const track = new TrackSpline(trackData);
  const terrain = new TerrainField(track);
  const roadData = track.buildRoadGeometry(1200);

  const [physics, lighting, texBank, propBank] = await Promise.all([
    PhysicsWorld.create(track, terrain, roadData),
    setupGoldenHourLighting(renderer, scene, trackData.sunDirection),
    loadWorldTextureBank(renderer),
    loadPropAssetBank(),
  ]);

  const roadGeom = new THREE.BufferGeometry();
  roadGeom.setAttribute('position', new THREE.BufferAttribute(roadData.positions, 3));
  roadGeom.setAttribute('normal', new THREE.BufferAttribute(roadData.normals, 3));
  roadGeom.setAttribute('uv', new THREE.BufferAttribute(roadData.uvs, 2));
  roadGeom.setIndex(new THREE.BufferAttribute(roadData.indices, 1));
  roadGeom.computeVertexNormals();
  const roadMesh = new THREE.Mesh(roadGeom, createRoadMaterial(texBank));
  roadMesh.name = 'road';
  roadMesh.receiveShadow = true;
  scene.add(roadMesh);

  const terrainGeom = terrain.buildMeshGeometry();
  const terrainMesh = new THREE.Mesh(terrainGeom, createTerrainMaterial(texBank));
  terrainMesh.name = 'terrain';
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  const ocean = createOceanSystem(terrain, trackData.seaLevel, lighting.sunDir);
  ocean.mesh.name = 'ocean';
  ocean.horizonMesh.name = 'ocean';
  scene.add(ocean.horizonMesh);
  scene.add(ocean.mesh);

  const veg = createVegetationPrototypes(texBank);
  const scenery = buildFullCircuitScenery(track, terrain, texBank, veg, propBank);
  scene.add(scenery.group);
  ocean.setRockFoamCenters(scenery.rockFoamCenters);

  const particles = new ParticleSystem();
  scene.add(particles.points);

  const validation = validateWorld({
    track,
    terrain,
    objects: scenery.objects,
    physicsWorld: physics.world,
    requireScenery: true,
  });

  // Audio system (buffer fetch deferred/triggered cleanly on first interaction or verify hook)
  const audio = new GameAudioManager();

  // Build 6 physics vehicles (slots 0..4 = AI, slot 5 = Player)
  const aiVehicles: ArcadeVehicle[] = [];
  for (let i = 0; i < 5; i++) {
    const model: 'veloce' | 'solara' = i % 2 === 0 ? 'solara' : 'veloce';
    aiVehicles.push(
      new ArcadeVehicle(i, false, CAR_SPECS[model], physics, track, terrain, GRID_SLOTS[i].s, GRID_SLOTS[i].lat)
    );
  }
  const player = new ArcadeVehicle(
    5,
    true,
    CAR_SPECS.veloce,
    physics,
    track,
    terrain,
    GRID_SLOTS[5].s,
    GRID_SLOTS[5].lat
  );
  const allVehicles: ArcadeVehicle[] = [...aiVehicles, player];

  let playerVis: CarVisualInstance = buildCarVisual('veloce', 0);
  setLayerRecursive(playerVis.root, 1, true);
  scene.add(playerVis.root);

  const aiVisuals: CarVisualInstance[] = [];
  for (let i = 0; i < 5; i++) {
    const model: 'veloce' | 'solara' = i % 2 === 0 ? 'solara' : 'veloce';
    const liv = (i + 1) % LIVERIES.length;
    const vis = buildCarVisual(model, liv);
    aiVisuals.push(vis);
    scene.add(vis.root);
  }
  const allVisuals = () => [...aiVisuals, playerVis];

  let sceneAudit = runSceneGraphAudit(
    scene,
    track,
    allVisuals(),
    validation,
    audio.hasPlayerEngineAudioBuffers()
  );

  const raceCam = new RaceCamera(window.innerWidth / window.innerHeight);
  const cineCam = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.25, 16000);
  let activeCamera: THREE.Camera = cineCam;
  const post = new PostPipeline(renderer, scene, activeCamera);

  // Active race state
  let raceStarted = false;
  let aiDrivers: AIDriver[] = [];
  let playerAutopilot = new AIDriver(player, track, 'hard', 0);
  let raceTracker!: RaceRulesTracker;
  let activeLaps = 3;
  let activeDiff: Difficulty = 'normal';
  let gridIntroTimer = 0;
  let countdownTimer = 0;
  let lastCountdownCue = 99;
  let simClock = 0;
  let prevAntiCutCount = 0;
  let verifyOverrideCamera = false;

  // FPS rolling window
  let fpsEstimate = 60;
  let frameCounter = 0;
  let fpsAccumSec = 0;

  function applyVehicleLineup(carModel: 'veloce' | 'solara', playerLivIdx: number): void {
    // Rebuild player visual matching selected car + livery
    scene.remove(playerVis.root);
    playerVis = buildCarVisual(carModel, playerLivIdx);
    setLayerRecursive(playerVis.root, 1, true);
    scene.add(playerVis.root);
    player.setSpec(CAR_SPECS[carModel]);

    // Assign remaining 5 distinct liveries to AIs
    const otherLivs = LIVERIES.filter((l) => l.id !== playerLivIdx);
    for (let i = 0; i < 5; i++) {
      const aiModel: 'veloce' | 'solara' = i % 2 === 0 ? 'solara' : 'veloce';
      const livIdx = otherLivs[i % otherLivs.length].id;
      scene.remove(aiVisuals[i].root);
      aiVisuals[i] = buildCarVisual(aiModel, livIdx);
      scene.add(aiVisuals[i].root);
      aiVehicles[i].setSpec(CAR_SPECS[aiModel]);
    }
  }

  function setupGridAndRace(laps: number, diff: Difficulty, immediateGo: boolean): void {
    activeLaps = laps;
    activeDiff = diff;
    verifyOverrideCamera = false;
    particles.clear();

    applyVehicleLineup(ui.config.carModel, ui.config.liveryIdx);

    for (let i = 0; i < 5; i++) {
      aiVehicles[i].resetToTrack(GRID_SLOTS[i].s, GRID_SLOTS[i].lat);
      aiVehicles[i].safetyResets = 0;
      aiVehicles[i].invariantFailures = [];
    }
    player.resetToTrack(GRID_SLOTS[5].s, GRID_SLOTS[5].lat);
    player.safetyResets = 0;
    player.invariantFailures = [];

    aiDrivers = aiVehicles.map((v, idx) => new AIDriver(v, track, diff, idx));
    playerAutopilot = new AIDriver(player, track, 'hard', 0);
    ui.hideToast();

    const otherLivs = LIVERIES.filter((l) => l.id !== ui.config.liveryIdx);
    const entries = [
      ...aiVehicles.map((v, i) => ({
        vehicleIndex: v.index,
        name: AI_PILOT_NAMES[i],
        carModel: `${v.spec.name} #${otherLivs[i].number}`,
        liveryName: otherLivs[i].name,
        isPlayer: false,
        startS: GRID_SLOTS[i].s,
      })),
      {
        vehicleIndex: player.index,
        name: 'Piloto',
        carModel: `${CAR_SPECS[ui.config.carModel].name} #${LIVERIES[ui.config.liveryIdx].number}`,
        liveryName: LIVERIES[ui.config.liveryIdx].name,
        isPlayer: true,
        startS: GRID_SLOTS[5].s,
      },
    ];
    raceTracker = new RaceRulesTracker(track, activeLaps, entries);
    prevAntiCutCount = 0;

    for (let i = 0; i < 5; i++) syncCarVisual(aiVisuals[i], aiVehicles[i], 0.016);
    syncCarVisual(playerVis, player, 0.016);

    audio.setPaused(false);
    audio.startRaceAudio(ui.config.carModel, aiVehicles.length);

    raceCam.mode = 'chase';
    raceCam.snapToVehicle(player);

    if (immediateGo) {
      raceStarted = true;
      gridIntroTimer = 0;
      countdownTimer = 0;
      activeCamera = raceCam.camera;
      ui.setScreen('racing');
    } else {
      raceStarted = false;
      gridIntroTimer = 4.6;
      countdownTimer = 3.6;
      lastCountdownCue = 99;
      activeCamera = cineCam;
      ui.setScreen('grid_intro');
    }
  }

  function applyQuality(q: 'high' | 'low'): void {
    post.quality = q;
    lighting.setQuality(q);
    renderer.setPixelRatio(q === 'high' ? Math.min(window.devicePixelRatio, 1.5) : 1.0);
  }

  const ui = new AppUi(uiRoot, track, {
    onStartRace: () => {
      void audio.unlockAndInit().then(() => {
        sceneAudit = runSceneGraphAudit(
          scene,
          track,
          allVisuals(),
          validation,
          audio.hasPlayerEngineAudioBuffers()
        );
      });
      setupGridAndRace(ui.config.laps, ui.config.difficulty, false);
    },
    onScreenChange: (screen) => {
      if (screen === 'garage') {
        player.resetToTrack(68, 0);
        syncCarVisual(playerVis, player, 0.016);
      } else if (screen === 'countdown') {
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (screen === 'menu') {
        audio.stopRaceAudio();
        for (let i = 0; i < 5; i++) {
          aiVehicles[i].resetToTrack(GRID_SLOTS[i].s, GRID_SLOTS[i].lat);
          syncCarVisual(aiVisuals[i], aiVehicles[i], 0.016);
        }
        player.resetToTrack(GRID_SLOTS[5].s, GRID_SLOTS[5].lat);
        syncCarVisual(playerVis, player, 0.016);
      }
    },
    onGarageChange: (carModel, liveryIdx) => {
      applyVehicleLineup(carModel, liveryIdx);
      player.resetToTrack(68, 0);
      syncCarVisual(playerVis, player, 0.016);
    },
    onConfigChange: (cfg) => {
      applyQuality(cfg.quality);
      audio.setVolumes(cfg.volMaster, cfg.volSfx, cfg.volMusic);
    },
    onResumeRace: () => {
      audio.setPaused(false);
      ui.setScreen('racing');
    },
    onRestartRace: () => {
      setupGridAndRace(ui.config.laps, ui.config.difficulty, false);
    },
    onReturnToMenu: () => {
      audio.setPaused(false);
      audio.stopRaceAudio();
      raceStarted = false;
      ui.setScreen('menu');
    },
    onUiCue: (kind) => {
      void audio.unlockAndInit().then(() => audio.playUiCue(kind));
    },
  });

  setupGridAndRace(ui.config.laps, ui.config.difficulty, false);
  audio.stopRaceAudio();
  raceStarted = false;
  ui.setScreen('menu');

  // Input handling (Keyboard + Gamepad)
  const keys = new Set<string>();
  let autopilot = false;
  let prevPadCam = false;
  let prevPadPause = false;

  const ensureAudioOnInput = () => {
    if (!audio.hasPlayerEngineAudioBuffers()) {
      void audio.unlockAndInit().then(() => {
        if (ui.screen === 'racing' || ui.screen === 'countdown' || ui.screen === 'grid_intro') {
          audio.startRaceAudio(ui.config.carModel, aiVehicles.length);
        }
        sceneAudit = runSceneGraphAudit(
          scene,
          track,
          allVisuals(),
          validation,
          audio.hasPlayerEngineAudioBuffers()
        );
      });
    }
  };

  window.addEventListener('pointerdown', ensureAudioOnInput);
  window.addEventListener('keydown', (e) => {
    ensureAudioOnInput();
    keys.add(e.code);

    if (ui.screen === 'menu' || ui.screen === 'garage' || ui.screen === 'config' || ui.screen === 'paused' || ui.screen === 'results') {
      if (e.code === 'Escape') {
        e.preventDefault();
        if (ui.screen === 'paused') {
          audio.setPaused(false);
          ui.setScreen('racing');
        } else if (ui.screen === 'garage' || ui.screen === 'config') {
          ui.setScreen('menu');
        }
        return;
      }
      ui.handleMenuKeyDown(e);
      return;
    }

    if (ui.screen === 'grid_intro' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      gridIntroTimer = 0;
      ui.setScreen('countdown');
      return;
    }

    if (e.code === 'KeyC') {
      raceCam.mode = raceCam.mode === 'chase' ? 'hood' : 'chase';
    } else if (e.code === 'KeyR' && ui.screen === 'racing') {
      player.resetToTrack(player.lastValidS, 0);
    } else if (e.code === 'Escape' && (ui.screen === 'racing' || ui.screen === 'countdown')) {
      audio.setPaused(true);
      ui.setScreen('paused');
    }
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    post.resize(window.innerWidth, window.innerHeight);
    const aspect = window.innerWidth / window.innerHeight;
    raceCam.resize(aspect);
    cineCam.aspect = aspect;
    cineCam.updateProjectionMatrix();
  });

  const getPlayerInput = (dt: number): VehicleInput => {
    if (autopilot) return playerAutopilot.computeInput(dt, allVehicles, true);

    let throttle = keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0;
    let brake = keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0;
    let steer =
      (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) -
      (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0);
    let handbrake = keys.has('Space');

    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads && Array.from(pads).find((p) => p && p.connected);
    if (pad) {
      const axis0 = pad.axes[0] ?? 0;
      if (Math.abs(axis0) > 0.12) {
        steer = THREE.MathUtils.clamp(steer - axis0, -1, 1);
      }
      const rt = pad.buttons[7]?.value ?? 0;
      const lt = pad.buttons[6]?.value ?? 0;
      if (rt > 0.05) throttle = Math.max(throttle, rt);
      if (lt > 0.05) brake = Math.max(brake, lt);
      if (pad.buttons[0]?.pressed || pad.buttons[2]?.pressed) handbrake = true;

      const padCam = Boolean(pad.buttons[3]?.pressed);
      if (padCam && !prevPadCam && ui.screen === 'racing') {
        raceCam.mode = raceCam.mode === 'chase' ? 'hood' : 'chase';
      }
      prevPadCam = padCam;

      const padPause = Boolean(pad.buttons[9]?.pressed);
      if (padPause && !prevPadPause) {
        if (ui.screen === 'racing') {
          audio.setPaused(true);
          ui.setScreen('paused');
        } else if (ui.screen === 'paused') {
          audio.setPaused(false);
          ui.setScreen('racing');
        }
      }
      prevPadPause = padPause;
    }

    return { throttle, brake, steer, handbrake };
  };

  // Video capture helper (uses Audio mediaStreamDest + Canvas captureStream)
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];

  // Pre-seed verification camera helper
  function updateCinematicCamera(dt: number): void {
    if (ui.screen === 'menu') {
      const a = simClock * 0.16;
      const gSamp = track.sampleAtDistance(34);
      cineCam.position.set(
        gSamp.pos.x + Math.cos(a) * 34,
        gSamp.pos.y + 8.5 + Math.sin(a * 0.7) * 2.0,
        gSamp.pos.z - 22 + Math.sin(a) * 14
      );
      cineCam.lookAt(gSamp.pos.x - 16, gSamp.pos.y + 2.2, gSamp.pos.z - 2);
      cineCam.fov = 50;
      cineCam.updateProjectionMatrix();
      activeCamera = cineCam;
    } else if (ui.screen === 'garage') {
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quat).normalize();
      const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(player.quat).normalize();
      const sweep = Math.sin(simClock * 0.42) * 0.55;
      const target = player.pos.clone().add(new THREE.Vector3(0, 0.45, 0));
      // Orbit around front-right sunlit 3/4 view, offsetting look left so car sits clearly beside garage card
      const camDir = fwd
        .clone()
        .multiplyScalar(Math.cos(0.65 + sweep))
        .addScaledVector(right, Math.sin(0.65 + sweep))
        .normalize();
      cineCam.position.copy(target).addScaledVector(camDir, 4.75).add(new THREE.Vector3(0, 0.95, 0));
      const screenRight = new THREE.Vector3().subVectors(target, cineCam.position).cross(new THREE.Vector3(0, 1, 0)).normalize();
      cineCam.lookAt(target.clone().addScaledVector(screenRight, -0.88));
      cineCam.fov = 39;
      cineCam.updateProjectionMatrix();
      activeCamera = cineCam;
    } else if (ui.screen === 'grid_intro') {
      const frac = 1 - Math.max(0, Math.min(1, gridIntroTimer / 4.6));
      const g45 = track.sampleAtDistance(44.5);
      const startPos = g45.pos.clone().addScaledVector(g45.right, 4.2).add(new THREE.Vector3(0, 2.2, 0));
      const endPos = player.pos.clone().add(new THREE.Vector3(7.0, 2.1, -1.8));
      cineCam.position.lerpVectors(startPos, endPos, frac * frac * (3 - 2 * frac));
      const lookS = THREE.MathUtils.lerp(32, 20, frac);
      const ls = track.sampleAtDistance(lookS);
      cineCam.lookAt(ls.pos.x, ls.pos.y + 0.85, ls.pos.z);
      cineCam.fov = 52;
      cineCam.updateProjectionMatrix();
      activeCamera = cineCam;
    } else if (ui.screen === 'results') {
      const a = simClock * 0.45;
      cineCam.position.set(
        player.pos.x + Math.cos(a) * 6.5,
        player.pos.y + 2.2,
        player.pos.z + Math.sin(a) * 6.5
      );
      cineCam.lookAt(player.pos.x, player.pos.y + 0.7, player.pos.z);
      cineCam.fov = 48;
      cineCam.updateProjectionMatrix();
      activeCamera = cineCam;
    }
    void dt;
  }

  window.__RACE_VERIFY__ = {
    ready: true,
    gate: 'P5',
    validation,
    sceneAudit,
    trackLength: track.totalLength,
    getState: () => {
      const pr = raceTracker.racers.find((r) => r.isPlayer)!;
      return {
        screen: ui.screen,
        raceStarted,
        playerS: player.currentS,
        playerLap: pr.lap,
        playerRank: pr.rank,
        totalRacers: raceTracker.racers.length,
        antiCutBlockedCount: raceTracker.antiCutBlockedCount,
        audioVoices: audio.getActiveVoiceCount(),
        playerEngineHasAudioBuffer: audio.hasPlayerEngineAudioBuffers(),
        quality: ui.config.quality,
        fps: Number(fpsEstimate.toFixed(1)),
      };
    },
    setQuality: (q) => {
      ui.config.quality = q;
      ui.syncConfigUi();
      applyQuality(q);
    },
    setAutopilot: (enabled) => {
      autopilot = enabled;
    },
    unlockAudio: async () => {
      await audio.unlockAndInit();
      sceneAudit = runSceneGraphAudit(
        scene,
        track,
        allVisuals(),
        validation,
        audio.hasPlayerEngineAudioBuffers()
      );
      if (window.__RACE_VERIFY__) {
        window.__RACE_VERIFY__.sceneAudit = sceneAudit;
      }
      return audio.hasPlayerEngineAudioBuffers();
    },
    startRaceImmediate: (laps = 3, difficulty = 'normal') => {
      ui.config.laps = (laps === 6 ? 6 : 3) as 3 | 6;
      ui.config.difficulty = difficulty;
      ui.syncConfigUi();
      setupGridAndRace(laps, difficulty, true);
      return { audioVoices: audio.getActiveVoiceCount() };
    },
    restartRaceImmediate: () => {
      setupGridAndRace(activeLaps, activeDiff, true);
      return { audioVoices: audio.getActiveVoiceCount() };
    },
    teleportPlayer: (s, lateral = 0) => {
      player.resetToTrack(s, lateral);
      syncCarVisual(playerVis, player, 0.016);
    },
    getAudioEvents: () => [...audio.eventLog],
    startWavCapture: () => audio.startWavCapture(),
    stopWavCapture: () => audio.stopWavCaptureAndEncode(),
    startVideoCapture: () => {
      if (!audio.mediaStreamDest) return false;
      const canvasStream = canvas.captureStream(30);
      const tracks = [
        ...canvasStream.getVideoTracks(),
        ...audio.mediaStreamDest.stream.getAudioTracks(),
      ];
      const combined = new MediaStream(tracks);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordedChunks.push(ev.data);
      };
      mediaRecorder.start(250);
      return true;
    },
    stopVideoCapture: async () => {
      if (!mediaRecorder) return '';
      const rec = mediaRecorder;
      const stopped = new Promise<void>((resolve) => {
        rec.onstop = () => resolve();
      });
      rec.stop();
      await stopped;
      mediaRecorder = null;
      const blob = new Blob(recordedChunks, { type: rec.mimeType || 'video/webm' });
      const buf = await blob.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      }
      return btoa(bin);
    },
    setCameraShot: (shot) => {
      verifyOverrideCamera = true;
      ui.setScreen('racing');
      ui.hideToast();
      const setPackPositions = (baseS: number) => {
        player.resetToTrack(baseS, -1.9);
        aiVehicles[0].resetToTrack(baseS + 13, 2.0);
        aiVehicles[1].resetToTrack(baseS + 26, -1.6);
        aiVehicles[2].resetToTrack(baseS + 40, 1.8);
        aiVehicles[3].resetToTrack(baseS + 58, -1.2);
        aiVehicles[4].resetToTrack(baseS + 75, 1.6);
        syncCarVisual(playerVis, player, 0.016);
        aiVehicles.forEach((v, i) => syncCarVisual(aiVisuals[i], v, 0.016));
      };

      let blurSpeed = 0;
      if (shot === 'S1') {
        ui.setHudVisible(true);
        setPackPositions(240);
        player.speedMs = 52;
        blurSpeed = 52;
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'chase') {
        ui.setHudVisible(true);
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'hood') {
        ui.setHudVisible(true);
        raceCam.mode = 'hood';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'S2') {
        ui.setHudVisible(false);
        player.resetToTrack(26, -2.0);
        aiVehicles[0].resetToTrack(41.5, 2.2);
        syncCarVisual(playerVis, player, 0.016);
        syncCarVisual(aiVisuals[0], aiVehicles[0], 0.016);
        const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quat);
        const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(player.quat);
        cineCam.position.copy(player.pos).addScaledVector(fwd, 4.35).addScaledVector(right, 2.75).add(new THREE.Vector3(0, 0.58, 0));
        cineCam.lookAt(player.pos.clone().addScaledVector(fwd, -0.35).add(new THREE.Vector3(0, 0.25, 0)));
        cineCam.fov = 38;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      } else if (shot === 'S3') {
        ui.setHudVisible(true);
        const targetRock = scenery.rockFoamCenters[4] || { x: -40, z: -102, radius: 2 };
        cineCam.position.set(targetRock.x + 6.5, 1.45, targetRock.z - 5.2);
        cineCam.lookAt(targetRock.x - 10.0, 0.9, targetRock.z + 6.5);
        cineCam.fov = 52;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      } else if (shot === 'S4') {
        ui.setHudVisible(true);
        player.resetToTrack(1215, -1.9);
        aiVehicles[0].resetToTrack(1232, 1.8);
        aiVehicles[1].resetToTrack(1248, -1.5);
        syncCarVisual(playerVis, player, 0.016);
        syncCarVisual(aiVisuals[0], aiVehicles[0], 0.016);
        syncCarVisual(aiVisuals[1], aiVehicles[1], 0.016);
        const samp = track.sampleAtDistance(1188);
        cineCam.position.copy(samp.pos).addScaledVector(samp.right, 2.4).add(new THREE.Vector3(0, 4.2, 0));
        cineCam.lookAt(-150, 18, -10);
        cineCam.fov = 58;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      } else if (shot === 'S5' || shot === 'S10') {
        applyQuality(shot === 'S10' ? 'low' : 'high');
        ui.setHudVisible(true);
        setPackPositions(2235);
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'S6') {
        applyQuality('high');
        ui.setHudVisible(true);
        setPackPositions(2760);
        player.speedMs = 46;
        blurSpeed = 46;
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'S7') {
        ui.setHudVisible(true);
        player.resetToTrack(2918, -1.5);
        aiVehicles[0].resetToTrack(2934, 2.0);
        syncCarVisual(playerVis, player, 0.016);
        syncCarVisual(aiVisuals[0], aiVehicles[0], 0.016);
        const bMid = track.sampleAtDistance(2945);
        cineCam.position.copy(bMid.pos).addScaledVector(bMid.right, 34).addScaledVector(bMid.tangent, -26).add(new THREE.Vector3(0, 2.5, 0));
        cineCam.lookAt(bMid.pos.x, bMid.pos.y - 1.5, bMid.pos.z);
        cineCam.fov = 52;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      } else if (shot === 'S8') {
        ui.setHudVisible(true);
        player.resetToTrack(560, 0.0);
        aiVehicles[0].resetToTrack(561, -3.1);
        aiVehicles[1].resetToTrack(563, 3.1);
        aiVehicles[2].resetToTrack(578, -1.2);
        syncCarVisual(playerVis, player, 0.016);
        syncCarVisual(aiVisuals[0], aiVehicles[0], 0.016);
        syncCarVisual(aiVisuals[1], aiVehicles[1], 0.016);
        syncCarVisual(aiVisuals[2], aiVehicles[2], 0.016);
        player.speedMs = 48;
        blurSpeed = 48;
        raceCam.mode = 'chase';
        raceCam.snapToVehicle(player);
        activeCamera = raceCam.camera;
      } else if (shot === 'S9') {
        ui.setHudVisible(true);
        player.resetToTrack(240, 0);
        aiVehicles.forEach((v, idx) => v.resetToTrack(255 + idx * 14, idx % 2 === 0 ? -1.5 : 1.5));
        syncCarVisual(playerVis, player, 0.016);
        aiVehicles.forEach((v, i) => syncCarVisual(aiVisuals[i], v, 0.016));
        const s9 = track.sampleAtDistance(555);
        const sAhead = track.sampleAtDistance(588);
        cineCam.position
          .copy(s9.pos)
          .addScaledVector(s9.right, s9.width * 0.5 - 1.4)
          .add(new THREE.Vector3(0, 0.88, 0));
        cineCam.lookAt(
          sAhead.pos.x + sAhead.right.x * (sAhead.width * 0.45),
          sAhead.pos.y + 3.2,
          sAhead.pos.z + sAhead.right.z * (sAhead.width * 0.45)
        );
        cineCam.fov = 48;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      } else if (shot === 'S11') {
        ui.setHudVisible(true);
        const h = scenery.objects.find((o) => o.kind === 'house' && o.zone === 'Z3' && o.s > 2050 && o.s < 2350)
          || scenery.objects.find((o) => o.kind === 'house' && o.zone === 'Z3');
        if (h) {
          const samp = track.sampleAtDistance(h.s);
          const sideSign = Math.sign((h.x - samp.pos.x) * samp.right.x + (h.z - samp.pos.z) * samp.right.z) || 1;
          player.resetToTrack(h.s, sideSign * (samp.width * 0.5 - 2.0));
          syncCarVisual(playerVis, player, 0.016);
          cineCam.position
            .copy(player.pos)
            .addScaledVector(samp.tangent, -7.2)
            .addScaledVector(samp.right, -sideSign * 5.2)
            .add(new THREE.Vector3(0, 1.45, 0));
          cineCam.lookAt((player.pos.x + h.x) * 0.5, h.y + 2.0, (player.pos.z + h.z) * 0.5);
          cineCam.fov = 48;
          cineCam.updateProjectionMatrix();
          activeCamera = cineCam;
        }
      } else if (shot === 'S12') {
        ui.setHudVisible(false);
        cineCam.position.set(18, 940, 260);
        cineCam.lookAt(18, 0, 260);
        cineCam.fov = 52;
        cineCam.updateProjectionMatrix();
        activeCamera = cineCam;
      }

      const pr = raceTracker.racers.find((r) => r.isPlayer)!;
      ui.updateHud(0.016, pr, player, allVehicles, track.sampleAtDistance(player.currentS).zone, activeLaps);
      ocean.update(simClock, activeCamera.position);
      scenery.updateAnimations(simClock);
      lighting.updateShadowTarget(activeCamera === cineCam ? cineCam.position : player.pos);
      post.render(activeCamera, blurSpeed, blurSpeed > 5);
      return { fps: Number(fpsEstimate.toFixed(1)) };
    },
    stepSimSeconds: (seconds, opts) => {
      const prevAuto = autopilot;
      autopilot = opts?.autopilot ?? true;
      verifyOverrideCamera = false;
      ui.setScreen('racing');
      raceStarted = true;
      activeCamera = raceCam.camera;

      const steps = Math.round(seconds * 60);
      let minY = Infinity;
      let maxY = -Infinity;
      let prevS = player.currentS;
      let totalProgress = 0;
      let lapCompleted = false;
      let lapTimeSec = 0;

      const aiStuckAccum = new Float64Array(aiVehicles.length);
      const aiMaxStuck = new Float64Array(aiVehicles.length);
      let prevPlayerRank = raceTracker.racers.find((r) => r.isPlayer)!.rank;
      let playerOvertakes = 0;

      for (let i = 0; i < steps; i++) {
        const dt = 1 / 60;
        simClock += dt;
        physics.step(dt, (subDt) => {
          player.step(subDt, getPlayerInput(subDt), true);
          for (let a = 0; a < aiVehicles.length; a++) {
            aiVehicles[a].step(subDt, aiDrivers[a].computeInput(subDt, allVehicles, true), true);
          }
        });
        raceTracker.update(dt, allVehicles, true);
        particles.update(dt, allVehicles);

        const curRank = raceTracker.racers.find((r) => r.isPlayer)!.rank;
        if (curRank < prevPlayerRank) {
          playerOvertakes += prevPlayerRank - curRank;
        }
        prevPlayerRank = curRank;

        for (let a = 0; a < aiVehicles.length; a++) {
          if (aiVehicles[a].speedMs < 1.2) {
            aiStuckAccum[a] += dt;
            if (aiStuckAccum[a] > aiMaxStuck[a]) aiMaxStuck[a] = aiStuckAccum[a];
          } else {
            aiStuckAccum[a] = 0;
          }
        }

        let ds = player.currentS - prevS;
        if (ds < -track.totalLength * 0.5) ds += track.totalLength;
        if (ds > track.totalLength * 0.5) ds -= track.totalLength;
        totalProgress += ds;
        prevS = player.currentS;
        if (player.pos.y < minY) minY = player.pos.y;
        if (player.pos.y > maxY) maxY = player.pos.y;
        if (!lapCompleted && (totalProgress >= track.totalLength || raceTracker.playerFinished)) {
          lapCompleted = true;
          lapTimeSec = (i + 1) / 60;
        }
        if ((i & 1) === 0) {
          raceCam.update(player, dt * 2, physics, terrain);
        }
        if ((i & 3) === 0) {
          audio.update(dt * 4, player, aiVehicles, activeCamera, track.sampleAtDistance(player.currentS).zone);
        }
        if (raceTracker.playerFinished) {
          break;
        }
      }

      syncCarVisual(playerVis, player, 1 / 60);
      aiVehicles.forEach((v, i) => syncCarVisual(aiVisuals[i], v, 1 / 60));
      ocean.update(simClock, activeCamera.position);
      scenery.updateAnimations(simClock);
      lighting.updateShadowTarget(player.pos);
      raceCam.update(player, 1 / 60, physics, terrain);
      post.render(activeCamera, player.speedMs, true);

      const pr = raceTracker.racers.find((r) => r.isPlayer)!;
      ui.updateHud(1 / 60, pr, player, allVehicles, track.sampleAtDistance(player.currentS).zone, activeLaps);
      autopilot = prevAuto;

      let maxAiStuckSec = 0;
      for (const m of aiMaxStuck) if (m > maxAiStuckSec) maxAiStuckSec = m;

      return {
        minY,
        maxY,
        safetyResets: player.safetyResets,
        invariantFailures: [
          ...player.invariantFailures,
          ...aiVehicles.flatMap((v) => v.invariantFailures),
        ],
        cameraIntersections: raceCam.cameraIntersections,
        lapCompleted,
        lapTimeSec,
        playerRank: pr.rank,
        playerOvertakes,
        maxAiStuckSec,
        antiCutBlockedCount: raceTracker.antiCutBlockedCount,
        playerFinished: raceTracker.playerFinished,
      };
    },
  };

  let lastTime = performance.now();
  function animate(now: number) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    // Rolling FPS estimate
    frameCounter++;
    fpsAccumSec += dt;
    if (fpsAccumSec >= 0.4) {
      fpsEstimate = frameCounter / fpsAccumSec;
      frameCounter = 0;
      fpsAccumSec = 0;
    }

    if (ui.screen === 'paused') {
      post.render(activeCamera, 0, false);
      return;
    }

    simClock += dt;

    if (!verifyOverrideCamera) {
      if (ui.screen === 'grid_intro') {
        gridIntroTimer -= dt;
        if (gridIntroTimer <= 0) {
          ui.setScreen('countdown');
        }
      } else if (ui.screen === 'countdown') {
        countdownTimer -= dt;
        const secCeil = Math.ceil(Math.max(0, countdownTimer - 0.6));
        if (secCeil >= 1 && secCeil <= 3) {
          ui.setCountdownText(String(secCeil));
          if (lastCountdownCue !== secCeil) {
            lastCountdownCue = secCeil;
            audio.playUiCue('beep');
          }
        } else {
          ui.setCountdownText('VAI!');
          if (!raceStarted) {
            raceStarted = true;
            audio.playUiCue('go');
          }
          if (countdownTimer <= 0) {
            ui.setScreen('racing');
          }
        }
      }

      if (ui.screen === 'racing' || ui.screen === 'countdown' || ui.screen === 'results') {
        physics.step(dt, (subDt) => {
          player.step(subDt, getPlayerInput(subDt), raceStarted);
          for (let i = 0; i < aiVehicles.length; i++) {
            const aiInp = raceStarted
              ? aiDrivers[i].computeInput(subDt, allVehicles, true)
              : { throttle: 0, brake: 1, steer: 0, handbrake: false };
            aiVehicles[i].step(subDt, aiInp, raceStarted);
          }
        });
        raceTracker.update(dt, allVehicles, raceStarted);
        particles.update(dt, allVehicles);

        if (raceTracker.antiCutBlockedCount > prevAntiCutCount) {
          prevAntiCutCount = raceTracker.antiCutBlockedCount;
          ui.triggerAntiCutToast();
        }
        if (raceTracker.playerFinished && ui.screen === 'racing') {
          audio.playUiCue('finish');
          ui.showResults(raceTracker.racers, activeLaps);
        }
      }

      for (let i = 0; i < 5; i++) syncCarVisual(aiVisuals[i], aiVehicles[i], dt);
      syncCarVisual(playerVis, player, dt);

      if (ui.screen === 'racing' || ui.screen === 'countdown') {
        raceCam.update(player, dt, physics, terrain);
        activeCamera = raceCam.camera;
        const pr = raceTracker.racers.find((r) => r.isPlayer)!;
        const zone = track.sampleAtDistance(player.currentS).zone;
        ui.updateHud(dt, pr, player, allVehicles, zone, activeLaps);
        audio.update(dt, player, aiVehicles, activeCamera, zone);
      } else {
        updateCinematicCamera(dt);
      }
    }

    ocean.update(simClock, activeCamera.position);
    scenery.updateAnimations(simClock);
    lighting.updateShadowTarget(activeCamera === cineCam ? cineCam.position : player.pos);
    post.render(
      activeCamera,
      activeCamera === raceCam.camera ? player.speedMs : 0,
      activeCamera === raceCam.camera && ui.screen === 'racing'
    );
  }
  requestAnimationFrame(animate);
}

main().catch(console.error);
