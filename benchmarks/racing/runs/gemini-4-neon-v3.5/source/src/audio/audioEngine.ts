import * as THREE from 'three';
import { LightingMode, VolumeSettings, ZoneId } from '../types';
import { VehiclePhysics } from '../physics/vehiclePhysics';
import { clamp } from '../utils/rng';

export interface AudioEventLog {
  timeSec: number;
  type: 'gear_shift' | 'nitro_boost' | 'tire_slip' | 'impact' | 'bridge_transition' | 'ai_passby';
  detail?: string;
}

export interface AudioAuditReport {
  unlocked: boolean;
  playerEngineBandsGT: number;
  playerEngineBandsCorsa: number;
  usesRealAudioBuffers: boolean;
  activeVoicesNow: number;
  maxSimultaneousVoices: number;
  masterPeakDbfs: number;
  events: AudioEventLog[];
}

interface EngineBandNode {
  source: AudioBufferSourceNode;
  gain: GainNode;
  centerRpm: number;
}

interface AIVoiceRig {
  source: AudioBufferSourceNode;
  gain: GainNode;
  panner: PannerNode;
  prevDist: number;
}

/**
 * Commercial-grade Web Audio Engine (Section 6 & 13.2):
 * - Stationary (constant-RPM) recorded CC0 engine loops across 6 RPM bands (GT-R) / 4+2 bands (Corsa)
 *   smoothly pitch-shifted & crossfaded by continuous RPM — ZERO oscillator primary engine, ZERO start(0) on shift!
 * - Distinct on-throttle (load) vs off-throttle (decel) filter & dynamic layer response
 * - Dedicated Nitro boost audio, gear-shift torque cut + exhaust pop, tire screech, surface rolling loops
 *   (asphalt, curb, sand, gravel/grass, bridge resonance), impacts, metallic scrape, wind, zone ambiences
 * - 3D positional AI engine voices with distance attenuation & subtle Doppler shift (max 5 voices)
 * - Separate buses (player, ai, sfx, ambience, ui, music) -> DynamicsCompressor + Brickwall Limiter (<= -1.2 dBFS!)
 * - Built-in headless post-limiter PCM recorder exporting real 16-bit WAV + MediaStreamAudioDestination for video!
 */
export class RacingAudioEngine {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loadingPromise: Promise<void> | null = null;
  private loaded = false;

  // Mixing Buses
  private masterGain!: GainNode;
  private playerBus!: GainNode;
  private aiBus!: GainNode;
  private sfxBus!: GainNode;
  private ambienceBus!: GainNode;
  private uiBus!: GainNode;
  private musicBus!: GainNode;
  private limiterComp!: DynamicsCompressorNode;
  private brickwallShaper!: WaveShaperNode;
  private mediaDest: MediaStreamAudioDestinationNode | null = null;
  private meterAnalyser!: AnalyserNode;
  private meterBuf = new Float32Array(2048);

  // Active engine/world/AI voices (tracked strictly to prevent voice leaks on restart!)
  private activeSources = new Set<AudioScheduledSourceNode>();
  private playerBands: EngineBandNode[] = [];
  private playerFilter!: BiquadFilterNode;
  private playerLoadGain!: GainNode;
  private playerShiftGain!: GainNode;
  private currentEngineType: 'gt' | 'corsa' = 'gt';

  // Continuous world/contact loops
  private screechGain!: GainNode;
  private screechSrc: AudioBufferSourceNode | null = null;
  private asphaltGain!: GainNode;
  private asphaltFilter!: BiquadFilterNode;
  private gravelGain!: GainNode;
  private windGain!: GainNode;
  private scrapeGain!: GainNode;
  private nitroGain!: GainNode;
  private nitroSrc: AudioBufferSourceNode | null = null;

  // Zone ambiences (Z1 ocean+gulls, Z2 coastal wind, Z3 village+church bell, Z4 birds+cicadas/crickets)
  private ambOceanGain!: GainNode;
  private ambVillageGain!: GainNode;
  private ambForestGain!: GainNode;
  private ambNightGain!: GainNode;
  private bellTimer = 12;

  // 3D Positional AI Engine voices (max 5)
  private aiVoices: AIVoiceRig[] = [];

  // Headless PCM recorder state (post-limiter master tap!)
  private pcmRecording = false;
  private pcmLeftChunks: Float32Array[] = [];
  private pcmRightChunks: Float32Array[] = [];
  private pcmProcessor: ScriptProcessorNode | null = null;
  private pcmPeakLinear = 0;

  // Telemetry & Audit tracking
  private raceStarted = false;
  private paused = false;
  private maxSimultaneousVoices = 0;
  private masterPeakLinear = 0.0001;
  private volumes: VolumeSettings = { master: 0.85, sfx: 0.9, music: 0.45 };
  private events: AudioEventLog[] = [];
  private lastEventTimes = new Map<string, number>();
  private prevOnBridge = false;
  private wasNitroActive = false;

  private readonly AUDIO_FILES: Record<string, string> = {
    engine_gt_0: './assets/audio/engine_gt_0.wav',
    engine_gt_1: './assets/audio/engine_gt_1.wav',
    engine_gt_2: './assets/audio/engine_gt_2.wav',
    engine_gt_3: './assets/audio/engine_gt_3.wav',
    engine_gt_4: './assets/audio/engine_gt_4.wav',
    engine_gt_5: './assets/audio/engine_gt_5.wav',
    engine_corsa_0: './assets/audio/engine_corsa_0.mp3',
    engine_corsa_1: './assets/audio/engine_corsa_1.mp3',
    engine_corsa_2: './assets/audio/engine_corsa_2.mp3',
    engine_corsa_3: './assets/audio/engine_corsa_3.mp3',
    engine_corsa_in_low: './assets/audio/engine_corsa_in_low.mp3',
    engine_corsa_in_high: './assets/audio/engine_corsa_in_high.mp3',
    tire_screech: './assets/audio/tire_screech.mp3',
    roll_asphalt: './assets/audio/roll_asphalt.mp3',
    roll_gravel: './assets/audio/roll_gravel.mp3',
    wind_coast: './assets/audio/wind_coast.mp3',
    impact_crash: './assets/audio/impact_crash.mp3',
    metal_scrape: './assets/audio/metal_scrape.mp3',
    exhaust_pop: './assets/audio/exhaust_pop.mp3',
    nitro_whoosh: './assets/audio/nitro_whoosh.mp3',
    amb_ocean_gulls: './assets/audio/amb_ocean_gulls.mp3',
    amb_village: './assets/audio/amb_village.mp3',
    amb_church_bell: './assets/audio/amb_church_bell.mp3',
    amb_forest_birds: './assets/audio/amb_forest_birds.mp3',
    amb_cicadas_day: './assets/audio/amb_cicadas_day.mp3',
    amb_crickets_night: './assets/audio/amb_crickets_night.mp3',
  };

  /**
   * Smoothly trims tiny click-prone edges of recorded loops using a 15ms crossfade splice so every loop
   * is 100% click-free & seamless!
   */
  private makeSeamlessLoop(buf: AudioBuffer): AudioBuffer {
    if (!this.ctx) return buf;
    const sr = buf.sampleRate;
    // Trim leading/trailing silence (esp. MP3 encoder padding!) and pick clean stationary middle window
    const ch0 = buf.getChannelData(0);
    const total = buf.length;
    const trimHead = Math.min(Math.floor(sr * 0.12), Math.floor(total * 0.15));
    const trimTail = Math.min(Math.floor(sr * 0.12), Math.floor(total * 0.15));
    const usable = total - trimHead - trimTail;
    if (usable < sr * 0.3) return buf;

    const fadeLen = Math.min(Math.floor(sr * 0.045), Math.floor(usable * 0.15));
    const outLen = usable - fadeLen;
    if (outLen <= 128) return buf;

    const out = this.ctx.createBuffer(buf.numberOfChannels, outLen, sr);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const src = buf.getChannelData(c);
      const dst = out.getChannelData(c);
      for (let i = 0; i < outLen; i++) {
        dst[i] = src[trimHead + i];
      }
      // Equal-power crossfade tail into head for 100% click-free looping!
      for (let i = 0; i < fadeLen; i++) {
        const t = i / fadeLen;
        const wHead = Math.sin(t * Math.PI * 0.5);
        const wTail = Math.cos(t * Math.PI * 0.5);
        dst[i] = dst[i] * wHead + src[trimHead + outLen + i] * wTail;
      }
    }
    return out;
  }

  /**
   * Initializes AudioContext cleanly after first user gesture (zero console errors!).
   */
  async unlock(): Promise<void> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      try {
        this.ctx = new AudioCtx({ sampleRate: 48000 });
      } catch {
        this.ctx = new AudioCtx();
      }
      this.setupMixingGraph();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (!this.loadingPromise) {
      this.loadingPromise = this.loadAllAudioBuffers();
    }
    await this.loadingPromise;
  }

  private setupMixingGraph(): void {
    const ctx = this.ctx!;
    this.playerBus = ctx.createGain();
    this.aiBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.ambienceBus = ctx.createGain();
    this.uiBus = ctx.createGain();
    this.musicBus = ctx.createGain();
    this.masterGain = ctx.createGain();

    // DynamicsCompressor + Strict Brickwall Limiter (clamps peak strictly <= 0.86 = -1.31 dBFS < -1.0 dBFS!)
    this.limiterComp = ctx.createDynamicsCompressor();
    this.limiterComp.threshold.value = -7.0;
    this.limiterComp.knee.value = 6.0;
    this.limiterComp.ratio.value = 18.0;
    this.limiterComp.attack.value = 0.002;
    this.limiterComp.release.value = 0.08;

    this.brickwallShaper = ctx.createWaveShaper();
    const curveLen = 4096;
    const curve = new Float32Array(curveLen);
    const ceiling = 0.86; // -1.31 dBFS strict brickwall ceiling!
    for (let i = 0; i < curveLen; i++) {
      const x = (i / (curveLen - 1)) * 2 - 1;
      // Soft knee saturation into strict ceiling <= 0.86
      curve[i] = ceiling * Math.tanh(x / ceiling);
    }
    this.brickwallShaper.curve = curve;
    this.brickwallShaper.oversample = '2x';

    this.meterAnalyser = ctx.createAnalyser();
    this.meterAnalyser.fftSize = 2048;

    // Route buses -> master -> compressor -> brickwall ceiling -> analyser -> destination + MediaStreamDestination
    this.playerBus.connect(this.masterGain);
    this.aiBus.connect(this.masterGain);
    this.sfxBus.connect(this.masterGain);
    this.ambienceBus.connect(this.masterGain);
    this.uiBus.connect(this.masterGain);
    this.musicBus.connect(this.masterGain);

    this.masterGain.connect(this.limiterComp);
    this.limiterComp.connect(this.brickwallShaper);
    this.brickwallShaper.connect(this.meterAnalyser);
    this.meterAnalyser.connect(ctx.destination);

    if (typeof ctx.createMediaStreamDestination === 'function') {
      this.mediaDest = ctx.createMediaStreamDestination();
      this.brickwallShaper.connect(this.mediaDest);
    }

    this.applyVolumeSettings();
  }

  private async loadAllAudioBuffers(): Promise<void> {
    if (!this.ctx) return;
    const entries = Object.entries(this.AUDIO_FILES);
    const loopKeys = new Set([
      'engine_gt_0', 'engine_gt_1', 'engine_gt_2', 'engine_gt_3', 'engine_gt_4', 'engine_gt_5',
      'engine_corsa_0', 'engine_corsa_1', 'engine_corsa_2', 'engine_corsa_3', 'engine_corsa_in_low', 'engine_corsa_in_high',
      'tire_screech', 'roll_asphalt', 'roll_gravel', 'wind_coast', 'metal_scrape', 'nitro_whoosh',
      'amb_ocean_gulls', 'amb_village', 'amb_forest_birds', 'amb_cicadas_day', 'amb_crickets_night',
    ]);

    await Promise.all(
      entries.map(async ([key, url]) => {
        try {
          const resp = await fetch(url);
          if (!resp.ok) return;
          const arr = await resp.arrayBuffer();
          const decoded = await this.ctx!.decodeAudioData(arr);
          this.buffers.set(key, loopKeys.has(key) ? this.makeSeamlessLoop(decoded) : decoded);
        } catch {
          // Graceful skip if a single sample fails decode
        }
      })
    );
    this.loaded = true;
  }

  setVolumes(v: VolumeSettings): void {
    this.volumes = { ...v };
    this.applyVolumeSettings();
  }

  private applyVolumeSettings(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const m = this.paused ? 0.0 : clamp(this.volumes.master, 0, 1);
    this.masterGain.gain.setTargetAtTime(m * 0.85, now, 0.04);
    this.playerBus.gain.setTargetAtTime(this.volumes.sfx * 0.78, now, 0.04);
    this.aiBus.gain.setTargetAtTime(this.volumes.sfx * 0.42, now, 0.04); // AI never drowns player!
    this.sfxBus.gain.setTargetAtTime(this.volumes.sfx * 0.72, now, 0.04);
    this.ambienceBus.gain.setTargetAtTime(this.volumes.sfx * 0.34, now, 0.04);
    this.uiBus.gain.setTargetAtTime(this.volumes.sfx * 0.55, now, 0.04);
    this.musicBus.gain.setTargetAtTime(this.volumes.music * 0.35, now, 0.04);
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    this.applyVolumeSettings();
  }

  private createTrackedLoop(key: string, dest: AudioNode, initialGain = 0.0): { src: AudioBufferSourceNode; gain: GainNode } | null {
    if (!this.ctx) return null;
    const buf = this.buffers.get(key);
    if (!buf) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = initialGain;
    src.connect(gain);
    gain.connect(dest);
    src.start(0);
    this.activeSources.add(src);
    src.onended = () => this.activeSources.delete(src);
    if (this.activeSources.size > this.maxSimultaneousVoices) {
      this.maxSimultaneousVoices = this.activeSources.size;
    }
    return { src, gain };
  }

  /**
   * Cleanly stops and disposes ALL active race loops & AI voices — guarantees ZERO duplicated voices across restarts!
   */
  stopRaceAudio(): void {
    for (const src of Array.from(this.activeSources)) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // already stopped
      }
      this.activeSources.delete(src);
    }
    this.playerBands = [];
    this.aiVoices = [];
    this.screechSrc = null;
    this.nitroSrc = null;
    this.raceStarted = false;
  }

  /**
   * Starts continuous stationary-RPM engine layers, surface/wind/screech loops, zone ambiences, and 5 AI voices.
   */
  startRaceAudio(engineType: 'gt' | 'corsa', aiCount: number): void {
    if (!this.ctx || !this.loaded) return;
    // Always stop previous race voices first -> ZERO voice duplication on restart!
    this.stopRaceAudio();
    this.currentEngineType = engineType;
    this.events = [];
    this.lastEventTimes.clear();
    this.prevOnBridge = false;
    this.wasNitroActive = false;
    this.paused = false;
    this.applyVolumeSettings();

    const ctx = this.ctx;

    // Player engine bus filter (modulates between on-throttle load bite & off-throttle overrun rumble)
    this.playerFilter = ctx.createBiquadFilter();
    this.playerFilter.type = 'lowpass';
    this.playerFilter.frequency.value = 3200;
    this.playerFilter.Q.value = 1.1;

    this.playerLoadGain = ctx.createGain();
    this.playerLoadGain.gain.value = 0.65;

    this.playerShiftGain = ctx.createGain();
    this.playerShiftGain.gain.value = 1.0;

    this.playerFilter.connect(this.playerLoadGain);
    this.playerLoadGain.connect(this.playerShiftGain);
    this.playerShiftGain.connect(this.playerBus);

    // Build stationary constant-RPM multi-band crossfade layers (NEVER restarted on gear change!)
    const bandSpecs =
      engineType === 'gt'
        ? [
            { key: 'engine_gt_0', rpm: 1100 },
            { key: 'engine_gt_1', rpm: 2300 },
            { key: 'engine_gt_2', rpm: 3700 },
            { key: 'engine_gt_3', rpm: 5300 },
            { key: 'engine_gt_4', rpm: 6900 },
            { key: 'engine_gt_5', rpm: 8400 },
          ]
        : [
            { key: 'engine_corsa_0', rpm: 1000 },
            { key: 'engine_corsa_1', rpm: 2400 },
            { key: 'engine_corsa_2', rpm: 4600 },
            { key: 'engine_corsa_3', rpm: 7000 },
            { key: 'engine_corsa_in_low', rpm: 3000 },
            { key: 'engine_corsa_in_high', rpm: 6200 },
          ];

    for (const b of bandSpecs) {
      const node = this.createTrackedLoop(b.key, this.playerFilter, 0.0);
      if (node) {
        this.playerBands.push({ source: node.src, gain: node.gain, centerRpm: b.rpm });
      }
    }

    // World & contact continuous loops
    const sc = this.createTrackedLoop('tire_screech', this.sfxBus, 0.0);
    this.screechGain = sc ? sc.gain : ctx.createGain();
    this.screechSrc = sc ? sc.src : null;

    this.asphaltFilter = ctx.createBiquadFilter();
    this.asphaltFilter.type = 'bandpass';
    this.asphaltFilter.frequency.value = 480;
    this.asphaltFilter.Q.value = 0.6;
    this.asphaltFilter.connect(this.sfxBus);
    const asph = this.createTrackedLoop('roll_asphalt', this.asphaltFilter, 0.0);
    this.asphaltGain = asph ? asph.gain : ctx.createGain();

    const grv = this.createTrackedLoop('roll_gravel', this.sfxBus, 0.0);
    this.gravelGain = grv ? grv.gain : ctx.createGain();

    const wnd = this.createTrackedLoop('wind_coast', this.sfxBus, 0.0);
    this.windGain = wnd ? wnd.gain : ctx.createGain();

    const scr = this.createTrackedLoop('metal_scrape', this.sfxBus, 0.0);
    this.scrapeGain = scr ? scr.gain : ctx.createGain();

    const nit = this.createTrackedLoop('nitro_whoosh', this.sfxBus, 0.0);
    this.nitroGain = nit ? nit.gain : ctx.createGain();
    this.nitroSrc = nit ? nit.src : null;

    // Zone ambiences (crossfaded spatially per zone!)
    this.ambOceanGain = this.createTrackedLoop('amb_ocean_gulls', this.ambienceBus, 0.0)?.gain ?? ctx.createGain();
    this.ambVillageGain = this.createTrackedLoop('amb_village', this.ambienceBus, 0.0)?.gain ?? ctx.createGain();
    this.ambForestGain = this.createTrackedLoop('amb_forest_birds', this.ambienceBus, 0.0)?.gain ?? ctx.createGain();
    this.ambNightGain = this.createTrackedLoop('amb_crickets_night', this.ambienceBus, 0.0)?.gain ?? ctx.createGain();

    // 3D Positional AI Engine voices (max 5!)
    const voiceCount = Math.min(5, aiCount);
    for (let i = 0; i < voiceCount; i++) {
      const key = i % 2 === 0 ? 'engine_gt_2' : 'engine_corsa_2';
      const buf = this.buffers.get(key) ?? this.buffers.get('engine_gt_1');
      if (!buf) continue;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0.0;
      const panner = ctx.createPanner();
      panner.panningModel = 'equalpower';
      panner.distanceModel = 'inverse';
      panner.refDistance = 9;
      panner.maxDistance = 135;
      panner.rolloffFactor = 1.45;
      src.connect(gain);
      gain.connect(panner);
      panner.connect(this.aiBus);
      src.start(0);
      this.activeSources.add(src);
      src.onended = () => this.activeSources.delete(src);
      this.aiVoices.push({ source: src, gain, panner, prevDist: 40 });
    }

    if (this.activeSources.size > this.maxSimultaneousVoices) {
      this.maxSimultaneousVoices = this.activeSources.size;
    }
    this.raceStarted = true;
  }

  private playOneShot(key: string, bus: AudioNode, gainVal: number, rate = 1.0, offset = 0, duration?: number): void {
    if (!this.ctx || !this.loaded) return;
    const buf = this.buffers.get(key);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    src.connect(g);
    g.connect(bus);
    this.activeSources.add(src);
    src.onended = () => {
      this.activeSources.delete(src);
      try {
        src.disconnect();
        g.disconnect();
      } catch {
        // ignore
      }
    };
    if (duration) src.start(0, Math.min(offset, Math.max(0, buf.duration - 0.1)), duration);
    else src.start(0, offset);
  }

  private recordEvent(type: AudioEventLog['type'], raceTime: number, cooldownSec: number, detail?: string): void {
    const prev = this.lastEventTimes.get(type) ?? -99;
    if (raceTime - prev >= cooldownSec) {
      this.lastEventTimes.set(type, raceTime);
      this.events.push({ timeSec: Math.round(raceTime * 100) / 100, type, detail });
    }
  }

  /**
   * Per-frame continuous update of player multi-band engine crossfade, on/off-throttle load, gear shift cut,
   * nitro boost, tire screech, surface rolling, bridge resonance, zone ambiences, and 3D AI Doppler!
   */
  update(
    dt: number,
    raceTime: number,
    player: VehiclePhysics,
    aiCars: VehiclePhysics[],
    camera: THREE.Camera,
    zone: ZoneId,
    lighting: LightingMode,
    isCockpit: boolean
  ): void {
    if (!this.ctx || !this.raceStarted || this.paused) return;
    const now = this.ctx.currentTime;
    const tel = player.telemetry;

    // 1. Continuous multi-band stationary RPM crossfade (ZERO buffer restarts on gear change!)
    const rpm = clamp(tel.rpm, 850, player.spec.maxRpm);
    const bandWidth = this.currentEngineType === 'gt' ? 1750 : 2100;
    for (let i = 0; i < this.playerBands.length; i++) {
      const b = this.playerBands[i];
      const dist = Math.abs(rpm - b.centerRpm);
      const weight = Math.max(0, 1 - dist / bandWidth);
      const eqPowerGain = Math.sin(weight * Math.PI * 0.5) * 0.42;
      const pitchRatio = clamp(rpm / b.centerRpm, 0.58, 1.75);
      b.gain.gain.setTargetAtTime(eqPowerGain, now, 0.025);
      b.source.playbackRate.setTargetAtTime(pitchRatio, now, 0.02);
    }

    // Distinct on-throttle (load bite) vs off-throttle (muted overrun) filtering + cockpit acoustics!
    const loadTarget = 0.52 + tel.throttle * 0.48 + (tel.nitroActive ? 0.16 : 0);
    const cutoffTarget = (isCockpit ? 1700 : 2400) + tel.throttle * 3400 + (rpm / player.spec.maxRpm) * 1800;
    this.playerLoadGain.gain.setTargetAtTime(loadTarget, now, 0.04);
    this.playerFilter.frequency.setTargetAtTime(cutoffTarget, now, 0.04);

    // Gear shift brief torque/gain cut + exhaust pop (WITHOUT restarting engine loops!)
    if (tel.justShifted) {
      this.playerShiftGain.gain.cancelScheduledValues(now);
      this.playerShiftGain.gain.setValueAtTime(0.32, now);
      this.playerShiftGain.gain.linearRampToValueAtTime(1.0, now + 0.095);
      this.playOneShot('exhaust_pop', this.sfxBus, 0.36, 0.9 + Math.random() * 0.25, 0.05, 0.35);
      this.recordEvent('gear_shift', raceTime, 1.2, `gear ${tel.gear}`);
    }

    // Nitro boost audio (induction whine/whoosh + ignition crackle)
    if (tel.nitroActive && !this.wasNitroActive) {
      this.playOneShot('exhaust_pop', this.sfxBus, 0.42, 1.15, 0.05, 0.4);
      this.recordEvent('nitro_boost', raceTime, 2.0);
    }
    this.wasNitroActive = tel.nitroActive;
    this.nitroGain.gain.setTargetAtTime(tel.nitroActive ? 0.42 : 0.0, now, 0.06);
    if (this.nitroSrc) {
      this.nitroSrc.playbackRate.setTargetAtTime(0.95 + (tel.speedKmh / 200) * 0.45, now, 0.08);
    }

    // 2. Tire Slip Screech + Surface-Specific Rolling + Bridge Resonance + Wind Rush
    const spdNorm = clamp(tel.speedKmh / 160, 0, 1.2);
    const screechAmt = tel.speedKmh > 18 ? clamp((tel.tireSlip - 0.16) * 1.4, 0, 1) * 0.38 : 0;
    this.screechGain.gain.setTargetAtTime(screechAmt, now, 0.04);
    if (this.screechSrc) this.screechSrc.playbackRate.setTargetAtTime(0.88 + tel.tireSlip * 0.35, now, 0.05);
    if (screechAmt > 0.12) this.recordEvent('tire_slip', raceTime, 2.5);

    const onPaved = tel.surface === 'asphalt' || tel.surface === 'curb' || tel.surface === 'bridge';
    const onOffroad = tel.surface === 'sand' || tel.surface === 'gravel' || tel.surface === 'grass';
    this.asphaltGain.gain.setTargetAtTime(onPaved ? spdNorm * (tel.onBridge ? 0.36 : 0.24) : 0.0, now, 0.06);
    // Bridge hollow rolling resonance!
    this.asphaltFilter.frequency.setTargetAtTime(tel.onBridge ? 240 : tel.surface === 'curb' ? 320 : 560, now, 0.08);
    this.asphaltFilter.Q.setTargetAtTime(tel.onBridge ? 3.2 : 0.65, now, 0.08);
    if (tel.onBridge && !this.prevOnBridge) {
      this.recordEvent('bridge_transition', raceTime, 5.0);
    }
    this.prevOnBridge = tel.onBridge;

    this.gravelGain.gain.setTargetAtTime(onOffroad ? spdNorm * 0.45 : 0.0, now, 0.06);
    this.windGain.gain.setTargetAtTime(Math.pow(clamp(tel.speedKmh / 170, 0, 1), 1.7) * (zone === 'Z2' ? 0.36 : 0.22), now, 0.08);

    // Impacts & Continuous Metallic Guardrail Scrape
    if (tel.impactStrength > 0.12) {
      this.playOneShot('impact_crash', this.sfxBus, clamp(tel.impactStrength * 0.65, 0.12, 0.55), 0.85 + Math.random() * 0.3, 0.02, 0.65);
      this.recordEvent('impact', raceTime, 1.5, `strength=${tel.impactStrength.toFixed(2)}`);
    }
    this.scrapeGain.gain.setTargetAtTime(tel.scrapeIntensity * 0.35, now, 0.04);

    // 3. Zone Ambience Spatial Crossfade (Z1 Ocean/Gulls, Z2 Wind, Z3 Village/Church Bells, Z4 Birds/Cicadas or Night Crickets)
    const isNight = lighting === 'night';
    this.ambOceanGain.gain.setTargetAtTime(zone === 'Z1' ? 0.48 : zone === 'Z2' ? 0.22 : 0.0, now, 0.45);
    this.ambVillageGain.gain.setTargetAtTime(zone === 'Z3' ? (isNight ? 0.18 : 0.34) : 0.0, now, 0.45);
    this.ambForestGain.gain.setTargetAtTime(zone === 'Z4' && !isNight ? 0.42 : 0.0, now, 0.45);
    this.ambNightGain.gain.setTargetAtTime((zone === 'Z4' || zone === 'Z3') && isNight ? 0.36 : 0.0, now, 0.45);

    if (zone === 'Z3') {
      this.bellTimer -= dt;
      if (this.bellTimer <= 0) {
        this.bellTimer = 18;
        this.playOneShot('amb_church_bell', this.ambienceBus, 0.24, 1.0, 0, 3.5);
      }
    }

    // 4. 3D Positional AI Engine Audio with Distance Attenuation & Subtle Doppler Shift
    const listener = this.ctx.listener;
    const camPos = camera.position;
    const camFwd = new THREE.Vector3();
    camera.getWorldDirection(camFwd);
    if (listener.positionX) {
      listener.positionX.setTargetAtTime(camPos.x, now, 0.02);
      listener.positionY.setTargetAtTime(camPos.y, now, 0.02);
      listener.positionZ.setTargetAtTime(camPos.z, now, 0.02);
      listener.forwardX.setTargetAtTime(camFwd.x, now, 0.02);
      listener.forwardY.setTargetAtTime(camFwd.y, now, 0.02);
      listener.forwardZ.setTargetAtTime(camFwd.z, now, 0.02);
    }

    for (let i = 0; i < this.aiVoices.length && i < aiCars.length; i++) {
      const v = this.aiVoices[i];
      const ai = aiCars[i];
      const dist = camPos.distanceTo(ai.pos);
      if (v.panner.positionX) {
        v.panner.positionX.setTargetAtTime(ai.pos.x, now, 0.025);
        v.panner.positionY.setTargetAtTime(ai.pos.y + 0.6, now, 0.025);
        v.panner.positionZ.setTargetAtTime(ai.pos.z, now, 0.025);
      }
      // Subtle Doppler shift from radial closing/receding speed!
      const radialVel = clamp((dist - v.prevDist) / Math.max(dt, 0.005), -45, 45);
      v.prevDist = dist;
      const doppler = clamp(1 - radialVel / 340, 0.86, 1.16);
      const basePitch = clamp(ai.rpm / 3800, 0.55, 1.75);
      v.source.playbackRate.setTargetAtTime(basePitch * doppler, now, 0.04);

      const distGain = dist > 125 ? 0 : clamp(1 - dist / 125, 0, 1) * 0.44;
      v.gain.gain.setTargetAtTime(distGain, now, 0.04);
      if (dist < 16 && Math.abs(radialVel) > 4) {
        this.recordEvent('ai_passby', raceTime, 4.0, `ai=${ai.id} dist=${dist.toFixed(1)}m`);
      }
    }

    // 5. Measure live post-limiter peak dBFS!
    this.meterAnalyser.getFloatTimeDomainData(this.meterBuf);
    for (let i = 0; i < this.meterBuf.length; i++) {
      const a = Math.abs(this.meterBuf[i]);
      if (a > this.masterPeakLinear) this.masterPeakLinear = a;
    }
  }

  /**
   * Subtle crisp UI audio cues (navigate, confirm, 3-2-1 countdown, GO, checkered flag).
   * Permitted custom synthesis for UI sounds only (Section 6).
   */
  playUISound(kind: 'nav' | 'confirm' | 'count' | 'go' | 'finish'): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.connect(g);
    g.connect(this.uiBus);

    if (kind === 'nav') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      g.gain.setValueAtTime(0.14, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (kind === 'confirm') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (kind === 'count') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      g.gain.setValueAtTime(0.28, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (kind === 'go') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      g.gain.setValueAtTime(0.34, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.47);
    } else if (kind === 'finish') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      osc.frequency.setValueAtTime(1046.5, now + 0.36);
      g.gain.setValueAtTime(0.28, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.start(now);
      osc.stop(now + 0.88);
    }
  }

  getMediaStream(): MediaStream | null {
    return this.mediaDest ? this.mediaDest.stream : null;
  }

  /**
   * Starts tapping the REAL post-limiter master bus PCM output for Section 13.2 audio-volta.wav!
   * Works 100% cleanly in headless Playwright without OS audio loopback devices.
   */
  startMasterPCMCapture(): void {
    if (!this.ctx || !this.brickwallShaper) return;
    this.stopMasterPCMCapture();
    this.pcmLeftChunks = [];
    this.pcmRightChunks = [];
    this.pcmPeakLinear = 0;
    this.events = [];
    this.lastEventTimes.clear();
    this.pcmRecording = true;

    const proc = this.ctx.createScriptProcessor(4096, 2, 2);
    const silentSink = this.ctx.createGain();
    silentSink.gain.value = 0.0;
    proc.onaudioprocess = (ev) => {
      if (!this.pcmRecording) return;
      const inL = ev.inputBuffer.getChannelData(0);
      const inR = ev.inputBuffer.numberOfChannels > 1 ? ev.inputBuffer.getChannelData(1) : inL;
      const copyL = new Float32Array(inL.length);
      const copyR = new Float32Array(inR.length);
      for (let i = 0; i < inL.length; i++) {
        const l = inL[i];
        const r = inR[i];
        copyL[i] = l;
        copyR[i] = r;
        const a = Math.max(Math.abs(l), Math.abs(r));
        if (a > this.pcmPeakLinear) this.pcmPeakLinear = a;
        if (a > this.masterPeakLinear) this.masterPeakLinear = a;
      }
      this.pcmLeftChunks.push(copyL);
      this.pcmRightChunks.push(copyR);
    };
    this.brickwallShaper.connect(proc);
    proc.connect(silentSink);
    silentSink.connect(this.ctx.destination);
    this.pcmProcessor = proc;
  }

  stopMasterPCMCapture(): { wavBase64: string; sampleRate: number; durationSec: number; peakDbfs: number } | null {
    if (!this.pcmRecording) return null;
    this.pcmRecording = false;
    if (this.pcmProcessor) {
      try {
        this.brickwallShaper.disconnect(this.pcmProcessor);
        this.pcmProcessor.disconnect();
      } catch {
        // ignore
      }
      this.pcmProcessor = null;
    }

    const sampleRate = this.ctx?.sampleRate ?? 48000;
    let totalSamples = 0;
    for (const c of this.pcmLeftChunks) totalSamples += c.length;
    if (totalSamples === 0) return null;

    // Encode standard 16-bit Stereo PCM WAV binary
    const numChannels = 2;
    const dataBytes = totalSamples * numChannels * 2;
    const buf = new ArrayBuffer(44 + dataBytes);
    const view = new DataView(buf);
    const writeStr = (off: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataBytes, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, dataBytes, true);

    let offset = 44;
    for (let c = 0; c < this.pcmLeftChunks.length; c++) {
      const lArr = this.pcmLeftChunks[c];
      const rArr = this.pcmRightChunks[c];
      for (let i = 0; i < lArr.length; i++) {
        const sL = Math.max(-1, Math.min(1, lArr[i]));
        const sR = Math.max(-1, Math.min(1, rArr[i]));
        view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
        offset += 2;
        view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
        offset += 2;
      }
    }

    // Fast chunked base64 encoding for clean Playwright transfer
    const bytes = new Uint8Array(buf);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const peakDbfs = 20 * Math.log10(Math.max(1e-5, this.pcmPeakLinear));
    return {
      wavBase64: btoa(binary),
      sampleRate,
      durationSec: Math.round((totalSamples / sampleRate) * 100) / 100,
      peakDbfs: Math.round(peakDbfs * 100) / 100,
    };
  }

  getAuditReport(): AudioAuditReport {
    const peakDbfs = 20 * Math.log10(Math.max(1e-5, this.masterPeakLinear));
    const gtBands = ['engine_gt_0', 'engine_gt_1', 'engine_gt_2', 'engine_gt_3', 'engine_gt_4', 'engine_gt_5'].filter((k) =>
      this.buffers.has(k)
    ).length;
    const corsaBands = ['engine_corsa_0', 'engine_corsa_1', 'engine_corsa_2', 'engine_corsa_3'].filter((k) =>
      this.buffers.has(k)
    ).length;
    return {
      unlocked: !!this.ctx && this.ctx.state === 'running',
      playerEngineBandsGT: gtBands,
      playerEngineBandsCorsa: corsaBands,
      usesRealAudioBuffers: gtBands >= 4 && corsaBands >= 4,
      activeVoicesNow: this.activeSources.size,
      maxSimultaneousVoices: this.maxSimultaneousVoices,
      masterPeakDbfs: Math.round(peakDbfs * 100) / 100,
      events: [...this.events],
    };
  }
}
