import * as THREE from 'three';
import { SurfaceType, ArcadeVehicle } from '../physics/vehicle';
import { ZoneId } from '../world/types';

export interface AudioEventLogEntry {
  timeSec: number;
  kind: 'gear_shift' | 'skid' | 'collision' | 'bridge' | 'ai_pass';
  detail: string;
}

export class GameAudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private loadingPromise: Promise<void> | null = null;

  // Separate mixing buses
  private masterGain!: GainNode;
  private limiter!: DynamicsCompressorNode;
  private outputTrim!: GainNode;
  private playerBus!: GainNode;
  private aiBus!: GainNode;
  private sfxBus!: GainNode;
  private ambientBus!: GainNode;
  private uiBus!: GainNode;
  private musicBus!: GainNode;

  // Recording / verification taps
  public mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private wavTapNode: ScriptProcessorNode | null = null;
  private wavLeftChunks: Float32Array[] = [];
  private wavRightChunks: Float32Array[] = [];
  private isRecordingWav = false;

  // Decoded CC0 buffers
  private engineLoops: AudioBuffer[] = []; // 6 RPM bands
  private engineAlt: AudioBuffer[] = [];
  private sfxCrash: AudioBuffer | null = null;
  private sfxBell: AudioBuffer | null = null;
  private ambWaves: AudioBuffer | null = null;
  private ambWind: AudioBuffer | null = null;
  private ambBirds: AudioBuffer | null = null;
  private ambCicadas: AudioBuffer | null = null;
  private ambSeagulls: AudioBuffer[] = [];
  private noiseBuffer: AudioBuffer | null = null;

  // Active race voice nodes (strictly tracked and cleaned up on restart!)
  private activeSources = new Set<AudioNode>();
  private playerBandSources: { src: AudioBufferSourceNode; gain: GainNode }[] = [];
  private playerAltSource: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private playerFilter!: BiquadFilterNode;
  private playerMasterGain!: GainNode;

  private skidSource: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private rollSource: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private windSource: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private scrapeSource: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;

  private ambSources: {
    waves?: { src: AudioBufferSourceNode; gain: GainNode };
    wind?: { src: AudioBufferSourceNode; gain: GainNode };
    birds?: { src: AudioBufferSourceNode; gain: GainNode };
    cicadas?: { src: AudioBufferSourceNode; gain: GainNode };
  } = {};

  private aiVoices: {
    src: AudioBufferSourceNode;
    panner: PannerNode;
    gain: GainNode;
    active: boolean;
  }[] = [];

  // Volume preferences
  private volMaster = 0.85;
  private volSfx = 0.90;
  private volMusic = 0.45;
  private paused = false;

  // Gameplay event tracking
  private lastShiftCounter = 0;
  private lastCrashTime = -10;
  private lastSeagullTime = 0;
  private lastBellTime = 0;
  private lastBridgeJointS = -100;
  private shiftDipUntil = 0;
  private prevAiDist: number[] = [];
  public eventLog: AudioEventLogEntry[] = [];
  private raceClockSec = 0;
  private lastSkidLog = -10;
  private lastBridgeLog = -10;
  private lastAiPassLog = -10;

  public async unlockAndInit(): Promise<void> {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx({ sampleRate: 48000 });
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volMaster;

      // Hard brickwall-style limiter capping peak strictly <= -1.0 dBFS!
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -3.0;
      this.limiter.knee.value = 1.5;
      this.limiter.ratio.value = 20.0;
      this.limiter.attack.value = 0.001;
      this.limiter.release.value = 0.05;

      this.outputTrim = this.ctx.createGain();
      this.outputTrim.gain.value = 0.84; // -1.5 dB ceiling safety margin

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.outputTrim);
      this.outputTrim.connect(this.ctx.destination);

      // MediaStream destination for volta.webm capture
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.outputTrim.connect(this.mediaStreamDest);

      // Buses
      this.playerBus = this.ctx.createGain();
      this.aiBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.ambientBus = this.ctx.createGain();
      this.uiBus = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();

      this.playerBus.gain.value = 0.72;
      this.aiBus.gain.value = 0.42; // AI never drowns out player
      this.sfxBus.gain.value = this.volSfx;
      this.ambientBus.gain.value = 0.45;
      this.uiBus.gain.value = 0.65;
      this.musicBus.gain.value = this.volMusic;

      this.playerBus.connect(this.masterGain);
      this.aiBus.connect(this.masterGain);
      this.sfxBus.connect(this.masterGain);
      this.ambientBus.connect(this.masterGain);
      this.uiBus.connect(this.masterGain);
      this.musicBus.connect(this.masterGain);

      // Shared white/pink noise buffer for tire skid, rolling, wind, scrape
      this.noiseBuffer = this.createNoiseBuffer(2.0);

      // Decode all CC0 audio assets in parallel
      const loadBuf = async (url: string): Promise<AudioBuffer | null> => {
        try {
          const r = await fetch(url);
          if (!r.ok) return null;
          const arr = await r.arrayBuffer();
          return await this.ctx!.decodeAudioData(arr);
        } catch {
          return null;
        }
      };

      const [
        l0, l1, l2, l3, l4, l5,
        alt0, alt1,
        crash, bell, waves, wind, birds, cicadas, sg1, sg2,
      ] = await Promise.all([
        loadBuf('./assets/audio/engine/loop_0.wav'),
        loadBuf('./assets/audio/engine/loop_1.wav'),
        loadBuf('./assets/audio/engine/loop_2.wav'),
        loadBuf('./assets/audio/engine/loop_3.wav'),
        loadBuf('./assets/audio/engine/loop_4.wav'),
        loadBuf('./assets/audio/engine/loop_5.wav'),
        loadBuf('./assets/audio/engine/engine_alt_0.mp3'),
        loadBuf('./assets/audio/engine/engine_alt_1.mp3'),
        loadBuf('./assets/audio/env/crash.ogg'),
        loadBuf('./assets/audio/env/bell.wav'),
        loadBuf('./assets/audio/env/wave_01.flac'),
        loadBuf('./assets/audio/env/wind_Wind2.ogg'),
        loadBuf('./assets/audio/env/birds.wav'),
        loadBuf('./assets/audio/env/cicadas.ogg'),
        loadBuf('./assets/audio/env/seagull_1.wav'),
        loadBuf('./assets/audio/env/seagull_2.wav'),
      ]);

      this.engineLoops = [l0, l1, l2, l3, l4, l5].filter((b): b is AudioBuffer => b !== null);
      this.engineAlt = [alt0, alt1].filter((b): b is AudioBuffer => b !== null);
      this.sfxCrash = crash;
      this.sfxBell = bell;
      this.ambWaves = waves;
      this.ambWind = wind;
      this.ambBirds = birds;
      this.ambCicadas = cicadas;
      this.ambSeagulls = [sg1, sg2].filter((b): b is AudioBuffer => b !== null);

      this.initialized = true;
    })();

    return this.loadingPromise;
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const sr = this.ctx!.sampleRate;
    const len = Math.floor(sr * seconds);
    const buf = this.ctx!.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    // Smooth pink-ish noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      d[i] = (b0 + b1 + b2 + white * 0.18) * 1.4;
    }
    return buf;
  }

  public hasPlayerEngineAudioBuffers(): boolean {
    return this.engineLoops.length >= 4;
  }

  public getActiveVoiceCount(): number {
    return this.activeSources.size;
  }

  public startRaceAudio(carModel: 'veloce' | 'solara', aiCount: number): void {
    this.stopRaceAudio();
    if (!this.ctx || !this.initialized) return;

    this.raceClockSec = 0;
    this.eventLog = [];
    this.lastShiftCounter = 0;
    this.lastCrashTime = -10;
    this.lastBridgeJointS = -100;
    this.lastSkidLog = -10;
    this.lastBridgeLog = -10;
    this.lastAiPassLog = -10;
    this.prevAiDist = new Array(aiCount).fill(999);

    const now = this.ctx.currentTime;

    // 1. Player 6-band AudioBuffer engine loop + car-specific timbre filter & alt growl
    this.playerFilter = this.ctx.createBiquadFilter();
    this.playerFilter.type = 'lowpass';
    this.playerFilter.frequency.value = carModel === 'veloce' ? 2800 : 2200;
    this.playerFilter.Q.value = 0.9;

    this.playerMasterGain = this.ctx.createGain();
    this.playerMasterGain.gain.value = 0.55;
    this.playerFilter.connect(this.playerMasterGain);
    this.playerMasterGain.connect(this.playerBus);

    for (let i = 0; i < this.engineLoops.length; i++) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.engineLoops[i];
      src.loop = true;
      const g = this.ctx.createGain();
      g.gain.value = i === 0 ? 0.35 : 0.0;
      src.connect(g);
      g.connect(this.playerFilter);
      src.start(now);
      this.activeSources.add(src);
      this.playerBandSources.push({ src, gain: g });
    }

    if (this.engineAlt.length > 0) {
      const altBuf = carModel === 'solara' && this.engineAlt[1] ? this.engineAlt[1] : this.engineAlt[0];
      const src = this.ctx.createBufferSource();
      src.buffer = altBuf;
      src.loop = true;
      const g = this.ctx.createGain();
      g.gain.value = carModel === 'solara' ? 0.25 : 0.10;
      src.connect(g);
      g.connect(this.playerFilter);
      src.start(now);
      this.activeSources.add(src);
      this.playerAltSource = { src, gain: g };
    }

    // 2. Tire skid, surface rolling, wind, and guardrail scrape loops
    const makeLoopNoise = (type: BiquadFilterType, freq: number, q: number, bus: AudioNode) => {
      const src = this.ctx!.createBufferSource();
      src.buffer = this.noiseBuffer!;
      src.loop = true;
      const filter = this.ctx!.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const gain = this.ctx!.createGain();
      gain.gain.value = 0;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(bus);
      src.start(now);
      this.activeSources.add(src);
      return { src, filter, gain };
    };

    this.skidSource = makeLoopNoise('bandpass', 1050, 4.2, this.sfxBus);
    this.rollSource = makeLoopNoise('lowpass', 240, 1.0, this.sfxBus);
    this.windSource = makeLoopNoise('bandpass', 620, 0.7, this.sfxBus);
    this.scrapeSource = makeLoopNoise('bandpass', 1850, 2.4, this.sfxBus);

    // 3. Zone ambient loops
    const makeAmb = (buf: AudioBuffer | null) => {
      if (!buf) return undefined;
      const src = this.ctx!.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const gain = this.ctx!.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(this.ambientBus);
      src.start(now);
      this.activeSources.add(src);
      return { src, gain };
    };

    this.ambSources = {
      waves: makeAmb(this.ambWaves),
      wind: makeAmb(this.ambWind),
      birds: makeAmb(this.ambBirds),
      cicadas: makeAmb(this.ambCicadas),
    };

    // 4. AI 3D Positional Engines (max 5 voices!)
    const aiBuf = this.engineLoops[2] || this.engineLoops[0];
    if (aiBuf) {
      const count = Math.min(5, aiCount);
      for (let i = 0; i < count; i++) {
        const src = this.ctx.createBufferSource();
        src.buffer = aiBuf;
        src.loop = true;
        const panner = this.ctx.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = 8;
        panner.maxDistance = 110;
        panner.rolloffFactor = 1.35;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;
        src.connect(gain);
        gain.connect(panner);
        panner.connect(this.aiBus);
        src.start(now);
        this.activeSources.add(src);
        this.aiVoices.push({ src, panner, gain, active: true });
      }
    }
  }

  public stopRaceAudio(): void {
    for (const node of this.activeSources) {
      try {
        if ('stop' in node && typeof (node as AudioBufferSourceNode).stop === 'function') {
          (node as AudioBufferSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // already stopped
      }
    }
    this.activeSources.clear();
    this.playerBandSources = [];
    this.playerAltSource = null;
    this.skidSource = null;
    this.rollSource = null;
    this.windSource = null;
    this.scrapeSource = null;
    this.ambSources = {};
    this.aiVoices = [];
  }

  public update(
    dt: number,
    player: ArcadeVehicle,
    ais: ArcadeVehicle[],
    camera: THREE.Camera,
    zone: ZoneId
  ): void {
    if (!this.ctx || !this.initialized || this.paused) return;
    this.raceClockSec += dt;
    const now = this.ctx.currentTime;

    // 1. Update Web Audio 3D listener
    const listener = this.ctx.listener;
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    if (listener.positionX) {
      listener.positionX.setTargetAtTime(camera.position.x, now, 0.02);
      listener.positionY.setTargetAtTime(camera.position.y, now, 0.02);
      listener.positionZ.setTargetAtTime(camera.position.z, now, 0.02);
      listener.forwardX.setTargetAtTime(fwd.x, now, 0.02);
      listener.forwardY.setTargetAtTime(fwd.y, now, 0.02);
      listener.forwardZ.setTargetAtTime(fwd.z, now, 0.02);
      listener.upX.setTargetAtTime(up.x, now, 0.02);
      listener.upY.setTargetAtTime(up.y, now, 0.02);
      listener.upZ.setTargetAtTime(up.z, now, 0.02);
    }

    // 2. Player 6-band engine crossfade + throttle brightness + gear shift cut + rev limiter
    if (this.playerBandSources.length > 0) {
      const bandCenters = [1500, 2700, 4000, 5300, 6600, 7900];
      const rpmRaw = Number.isFinite(player.rpm) ? player.rpm : 1250;
      const rpm = THREE.MathUtils.clamp(rpmRaw, 1100, 8250);
      const timbreShift = player.spec.id === 'solara' ? 0.88 : 1.04;

      if (player.shiftEventCounter > this.lastShiftCounter) {
        this.lastShiftCounter = player.shiftEventCounter;
        this.shiftDipUntil = this.raceClockSec + 0.09;
        this.eventLog.push({
          timeSec: this.raceClockSec,
          kind: 'gear_shift',
          detail: `Gear ${player.gear} at ${Math.round(rpm)} RPM`,
        });
        this.triggerShortTransient(95, 0.07, 0.22); // crisp shift exhaust pop
      }

      const limiterCut = rpm > 8050 && Math.floor(this.raceClockSec * 22) % 2 === 0 ? 0.25 : 1.0;
      const shiftDip = this.raceClockSec < this.shiftDipUntil ? 0.32 : 1.0;
      const throttleLoad = 0.55 + 0.45 * player.throttleOut;
      this.playerMasterGain.gain.setTargetAtTime(0.60 * throttleLoad * limiterCut * shiftDip, now, 0.02);

      // Open filter brightly on-throttle, warmer off-throttle
      const cutoff = THREE.MathUtils.lerp(950, 4600, player.throttleOut) * (player.spec.id === 'veloce' ? 1.15 : 0.92);
      this.playerFilter.frequency.setTargetAtTime(cutoff, now, 0.04);

      for (let i = 0; i < this.playerBandSources.length; i++) {
        const band = this.playerBandSources[i];
        const center = bandCenters[i] || 5000;
        const width = 1450;
        const dist = Math.abs(rpm - center);
        const w = Math.max(0, 1 - dist / width);
        const equalPower = Math.sin(w * Math.PI * 0.5);
        const rate = THREE.MathUtils.clamp((rpm / center) * timbreShift, 0.65, 1.55);

        band.gain.gain.setTargetAtTime(equalPower * 0.52, now, 0.025);
        band.src.playbackRate.setTargetAtTime(rate, now, 0.025);
      }

      if (this.playerAltSource) {
        this.playerAltSource.src.playbackRate.setTargetAtTime(
          THREE.MathUtils.clamp((rpm / 4200) * timbreShift, 0.65, 1.5),
          now,
          0.03
        );
        this.playerAltSource.gain.gain.setTargetAtTime(
          (player.spec.id === 'solara' ? 0.26 : 0.10) * throttleLoad,
          now,
          0.03
        );
      }
    }

    // 3. Tires, Surface Rolling, Wind, Bridge Expansion Joints, Collisions
    if (this.skidSource) {
      const sGain = player.skidIntensity * (player.surface === 'sand' ? 0.14 : 0.28);
      this.skidSource.gain.gain.setTargetAtTime(sGain, now, 0.03);
      this.skidSource.filter.frequency.setTargetAtTime(
        player.surface === 'sand' ? 680 : 1050 + player.skidIntensity * 550,
        now,
        0.04
      );
      if (player.skidIntensity > 0.35 && this.raceClockSec - this.lastSkidLog > 4.0) {
        this.lastSkidLog = this.raceClockSec;
        this.eventLog.push({
          timeSec: this.raceClockSec,
          kind: 'skid',
          detail: `Skid ${(player.skidIntensity * 100).toFixed(0)}% on ${player.surface}`,
        });
      }
    }

    if (this.rollSource) {
      const spdFactor = THREE.MathUtils.clamp(player.speedMs / 55, 0, 1);
      const surfCfg: Record<SurfaceType, [number, number]> = {
        asphalt: [210, 0.16],
        curb: [110, 0.36],
        sand: [900, 0.32],
        grass: [540, 0.26],
        bridge: [320, 0.24],
      };
      const [freq, mult] = surfCfg[player.surface];
      const curbPulse = player.surface === 'curb' ? (Math.sin(this.raceClockSec * 85) > 0 ? 1.35 : 0.6) : 1.0;
      this.rollSource.filter.frequency.setTargetAtTime(freq, now, 0.03);
      this.rollSource.gain.gain.setTargetAtTime(spdFactor * mult * curbPulse, now, 0.03);

      // Bridge expansion joints every 18 m while crossing Z4 bridge
      if (player.surface === 'bridge' && player.speedMs > 5) {
        if (this.raceClockSec - this.lastBridgeLog > 6.0) {
          this.lastBridgeLog = this.raceClockSec;
          this.eventLog.push({ timeSec: this.raceClockSec, kind: 'bridge', detail: 'Crossing Z4 Gorge Bridge' });
        }
        if (Math.abs(player.currentS - this.lastBridgeJointS) > 18) {
          this.lastBridgeJointS = player.currentS;
          this.triggerShortTransient(115, 0.06, 0.26);
        }
      }
    }

    if (this.windSource) {
      const wGain = Math.pow(THREE.MathUtils.clamp(player.speedMs / 62, 0, 1), 1.6) * 0.26;
      this.windSource.gain.gain.setTargetAtTime(wGain, now, 0.05);
      this.windSource.filter.frequency.setTargetAtTime(400 + player.speedMs * 14, now, 0.05);
    }

    if (this.scrapeSource) {
      this.scrapeSource.gain.gain.setTargetAtTime(player.scrapeIntensity * 0.25, now, 0.02);
    }

    if (player.impactImpulse > 0.12 && this.raceClockSec - this.lastCrashTime > 0.16) {
      this.lastCrashTime = this.raceClockSec;
      this.playCollisionImpact(player.impactImpulse);
      this.eventLog.push({
        timeSec: this.raceClockSec,
        kind: 'collision',
        detail: `Impact impulse=${player.impactImpulse.toFixed(2)}`,
      });
    }

    // 4. Zone Ambient Crossfade
    if (this.ambSources.waves) {
      this.ambSources.waves.gain.gain.setTargetAtTime(zone === 'Z1' ? 0.35 : zone === 'Z2' ? 0.12 : 0.02, now, 0.35);
    }
    if (this.ambSources.wind) {
      this.ambSources.wind.gain.gain.setTargetAtTime(zone === 'Z2' ? 0.32 : 0.10, now, 0.35);
    }
    if (this.ambSources.birds) {
      this.ambSources.birds.gain.gain.setTargetAtTime(zone === 'Z4' ? 0.30 : zone === 'Z3' ? 0.12 : 0.03, now, 0.35);
    }
    if (this.ambSources.cicadas) {
      this.ambSources.cicadas.gain.gain.setTargetAtTime(zone === 'Z4' ? 0.20 : zone === 'Z2' ? 0.08 : 0.0, now, 0.35);
    }

    // Occasional seagulls in Z1 and distant church bell in Z3
    if (zone === 'Z1' && this.ambSeagulls.length > 0 && this.raceClockSec - this.lastSeagullTime > 12) {
      this.lastSeagullTime = this.raceClockSec;
      const buf = this.ambSeagulls[Math.floor(Math.random() * this.ambSeagulls.length)];
      this.playOneShot(buf, this.ambientBus, 0.16, 0.95 + Math.random() * 0.12);
    }
    if (zone === 'Z3' && this.sfxBell && this.raceClockSec - this.lastBellTime > 18) {
      this.lastBellTime = this.raceClockSec;
      this.playOneShot(this.sfxBell, this.ambientBus, 0.14, 0.85);
    }

    // 5. Positional 3D AI Engines (max 5 voices, nearest 5, silent > 95m)
    const indexedAis = ais
      .map((ai, i) => ({ ai, i, dist: ai.pos.distanceTo(player.pos) }))
      .sort((a, b) => a.dist - b.dist);

    for (let v = 0; v < this.aiVoices.length; v++) {
      const voice = this.aiVoices[v];
      const entry = indexedAis[v];
      if (!entry || entry.dist > 95) {
        voice.gain.gain.setTargetAtTime(0, now, 0.05);
        continue;
      }
      const { ai, i, dist } = entry;
      const p = voice.panner;
      if (p.positionX) {
        p.positionX.setTargetAtTime(ai.pos.x, now, 0.02);
        p.positionY.setTargetAtTime(ai.pos.y, now, 0.02);
        p.positionZ.setTargetAtTime(ai.pos.z, now, 0.02);
      }
      const distGain = THREE.MathUtils.clamp(1 - dist / 95, 0, 1) * 0.34;
      voice.gain.gain.setTargetAtTime(distGain, now, 0.04);

      // Mild Doppler pitch shift
      const toCam = new THREE.Vector3().subVectors(camera.position, ai.pos).normalize();
      const relVel = ai.vel.dot(toCam);
      const doppler = THREE.MathUtils.clamp(1 + relVel / 340, 0.85, 1.15);
      const rate = THREE.MathUtils.clamp((ai.rpm / 4000) * doppler, 0.6, 1.6);
      voice.src.playbackRate.setTargetAtTime(rate, now, 0.03);

      // Log close AI pass-by for verification report
      if (dist < 10 && this.prevAiDist[i] >= 10 && this.raceClockSec - this.lastAiPassLog > 4.0) {
        this.lastAiPassLog = this.raceClockSec;
        this.eventLog.push({
          timeSec: this.raceClockSec,
          kind: 'ai_pass',
          detail: `Close pass with AI #${ai.index} (d=${dist.toFixed(1)}m)`,
        });
      }
      this.prevAiDist[i] = dist;
    }
  }

  private playOneShot(buf: AudioBuffer, bus: AudioNode, gainVal: number, rate = 1.0): void {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    src.connect(g);
    g.connect(bus);
    src.start();
    src.onended = () => {
      try { g.disconnect(); } catch {}
    };
  }

  private playCollisionImpact(impulse: number): void {
    if (!this.ctx) return;
    const vol = THREE.MathUtils.clamp(0.18 + impulse * 0.55, 0.15, 0.75);
    if (this.sfxCrash) {
      this.playOneShot(this.sfxCrash, this.sfxBus, vol, 0.85 + Math.random() * 0.3);
    } else {
      this.triggerShortTransient(75, 0.18, vol);
    }
  }

  private triggerShortTransient(freqHz: number, durSec: number, gainVal: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freqHz, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqHz * 0.45), now + durSec);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + durSec);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + durSec + 0.01);
  }

  public playUiCue(kind: 'nav' | 'confirm' | 'beep' | 'go' | 'finish'): void {
    if (!this.ctx || !this.initialized) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    if (kind === 'nav') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      g.gain.setValueAtTime(0.10, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(g); g.connect(this.uiBus);
      osc.start(now); osc.stop(now + 0.06);
    } else if (kind === 'confirm') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.setValueAtTime(860, now + 0.05);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(g); g.connect(this.uiBus);
      osc.start(now); osc.stop(now + 0.15);
    } else if (kind === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(g); g.connect(this.uiBus);
      osc.start(now); osc.stop(now + 0.20);
    } else if (kind === 'go') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(g); g.connect(this.uiBus);
      osc.start(now); osc.stop(now + 0.36);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(g); g.connect(this.uiBus);
      osc.start(now); osc.stop(now + 0.46);
    }
  }

  public setPaused(p: boolean): void {
    this.paused = p;
    if (!this.ctx || !this.initialized) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(p ? this.volMaster * 0.05 : this.volMaster, now, 0.04);
  }

  public setVolumes(master: number, sfx: number, music: number): void {
    this.volMaster = THREE.MathUtils.clamp(master, 0, 1);
    this.volSfx = THREE.MathUtils.clamp(sfx, 0, 1);
    this.volMusic = THREE.MathUtils.clamp(music, 0, 1);
    if (!this.ctx || !this.initialized) return;
    const now = this.ctx.currentTime;
    if (!this.paused) this.masterGain.gain.setTargetAtTime(this.volMaster, now, 0.03);
    this.sfxBus.gain.setTargetAtTime(this.volSfx, now, 0.03);
    this.playerBus.gain.setTargetAtTime(0.72 * this.volSfx, now, 0.03);
    this.aiBus.gain.setTargetAtTime(0.42 * this.volSfx, now, 0.03);
    this.musicBus.gain.setTargetAtTime(this.volMusic, now, 0.03);
  }

  public startWavCapture(): void {
    if (!this.ctx || !this.initialized) return;
    this.wavLeftChunks = [];
    this.wavRightChunks = [];
    this.isRecordingWav = true;
    if (!this.wavTapNode) {
      this.wavTapNode = this.ctx.createScriptProcessor(4096, 2, 2);
      this.wavTapNode.onaudioprocess = (ev) => {
        if (!this.isRecordingWav) return;
        this.wavLeftChunks.push(new Float32Array(ev.inputBuffer.getChannelData(0)));
        this.wavRightChunks.push(new Float32Array(ev.inputBuffer.getChannelData(1)));
      };
      this.outputTrim.connect(this.wavTapNode);
      const silent = this.ctx.createGain();
      silent.gain.value = 0;
      this.wavTapNode.connect(silent);
      silent.connect(this.ctx.destination);
    }
  }

  public stopWavCaptureAndEncode(): {
    wavBase64: string;
    peakDbfs: number;
    sampleRate: number;
    durationSec: number;
  } {
    this.isRecordingWav = false;
    const sr = this.ctx ? this.ctx.sampleRate : 48000;
    let totalSamples = 0;
    for (const c of this.wavLeftChunks) totalSamples += c.length;

    let maxAbs = 1e-6;
    const buffer = new ArrayBuffer(44 + totalSamples * 4);
    const view = new DataView(buffer);

    const writeStr = (off: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 4, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 2, true); // stereo
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, totalSamples * 4, true);

    let offset = 44;
    for (let ci = 0; ci < this.wavLeftChunks.length; ci++) {
      const L = this.wavLeftChunks[ci];
      const R = this.wavRightChunks[ci];
      for (let i = 0; i < L.length; i++) {
        const sL = Math.max(-1, Math.min(1, L[i]));
        const sR = Math.max(-1, Math.min(1, R[i]));
        maxAbs = Math.max(maxAbs, Math.abs(sL), Math.abs(sR));
        view.setInt16(offset, Math.round(sL * 32767), true);
        view.setInt16(offset + 2, Math.round(sR * 32767), true);
        offset += 4;
      }
    }

    const bytes = new Uint8Array(buffer);
    let bin = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }

    return {
      wavBase64: btoa(bin),
      peakDbfs: Number((20 * Math.log10(maxAbs)).toFixed(2)),
      sampleRate: sr,
      durationSec: Number((totalSamples / sr).toFixed(2)),
    };
  }
}
