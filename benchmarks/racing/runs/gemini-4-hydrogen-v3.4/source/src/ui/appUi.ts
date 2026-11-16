import { Difficulty } from '../ai/driver';
import { ArcadeVehicle, CAR_SPECS } from '../physics/vehicle';
import { formatRaceTime, RacerProgress } from '../game/raceState';
import { LIVERIES } from '../world/carTextures';
import { TrackSpline } from '../world/track';
import { ZoneId } from '../world/types';

export type GameScreen =
  | 'menu'
  | 'garage'
  | 'config'
  | 'grid_intro'
  | 'countdown'
  | 'racing'
  | 'paused'
  | 'results';

export interface GameConfig {
  carModel: 'veloce' | 'solara';
  liveryIdx: number;
  laps: 3 | 6;
  difficulty: Difficulty;
  quality: 'high' | 'low';
  volMaster: number;
  volSfx: number;
  volMusic: number;
}

export interface UiCallbacks {
  onStartRace: () => void;
  onScreenChange: (screen: GameScreen) => void;
  onGarageChange: (carModel: 'veloce' | 'solara', liveryIdx: number) => void;
  onConfigChange: (cfg: GameConfig) => void;
  onResumeRace: () => void;
  onRestartRace: () => void;
  onReturnToMenu: () => void;
  onUiCue: (kind: 'nav' | 'confirm') => void;
}

const ICONS = {
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6,4 20,12 6,20"/></svg>',
  car: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14v-5l-2.5-5h-9L5 12v5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>',
  sliders: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="11" cy="18" r="2" fill="currentColor"/></svg>',
  flag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
  trophy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M6 4h12v6a6 6 0 0 1-12 0V4z"/><path d="M12 16v5"/><path d="M8 21h8"/></svg>',
};

const ZONE_LABELS: Record<ZoneId, string> = {
  Z1: 'Z1 · ORLA DOURADA',
  Z2: 'Z2 · FALÉSIA MIRANTE',
  Z3: 'Z3 · VILA DA COSTA',
  Z4: 'Z4 · BOSQUE & PONTE',
};

const DIFF_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
};

export class AppUi {
  private readonly root: HTMLElement;
  private readonly callbacks: UiCallbacks;
  public readonly config: GameConfig = {
    carModel: 'veloce',
    liveryIdx: 0,
    laps: 3,
    difficulty: 'normal',
    quality: 'high',
    volMaster: 0.85,
    volSfx: 0.90,
    volMusic: 0.45,
  };
  public screen: GameScreen = 'menu';

  // Overlays
  private menuEl!: HTMLDivElement;
  private garageEl!: HTMLDivElement;
  private configEl!: HTMLDivElement;
  private pauseEl!: HTMLDivElement;
  private resultsEl!: HTMLDivElement;
  private gridBannerEl!: HTMLDivElement;
  private gridBannerTitle!: HTMLHeadingElement;
  private gridBannerSub!: HTMLParagraphElement;
  private countdownEl!: HTMLDivElement;
  private hudEl!: HTMLDivElement;
  private toastEl!: HTMLDivElement;

  // Live HUD elements (mutated directly without recreating DOM)
  private rankEl!: HTMLSpanElement;
  private lapEl!: HTMLElement;
  private zoneEl!: HTMLElement;
  private curTimeEl!: HTMLElement;
  private bestTimeEl!: HTMLElement;
  private speedEl!: HTMLSpanElement;
  private gearEl!: HTMLDivElement;
  private rpmFillEl!: HTMLDivElement;

  // Minimap
  private minimapCanvas!: HTMLCanvasElement;
  private minimapCtx!: CanvasRenderingContext2D;
  private minimapBase!: HTMLCanvasElement;
  private mmScale = 1;
  private mmOffX = 0;
  private mmOffZ = 0;

  // Garage / Results dynamic refs
  private garageStatsEl!: HTMLDivElement;
  private garageModelBtns: HTMLButtonElement[] = [];
  private garageSwatchBtns: HTMLButtonElement[] = [];
  private resultsRowsEl!: HTMLTableSectionElement;
  private resultsSubtitleEl!: HTMLParagraphElement;

  private hudVisibleOverride: boolean | null = null;
  private cutToastTimer = 0;

  constructor(root: HTMLElement, track: TrackSpline, callbacks: UiCallbacks) {
    this.root = root;
    this.callbacks = callbacks;
    this.buildDom(track);
    this.setScreen('menu');
  }

  private buildDom(track: TrackSpline): void {
    this.root.innerHTML = '';

    // 1. Main Menu
    this.menuEl = document.createElement('div');
    this.menuEl.className = 'overlay-backdrop';
    this.menuEl.innerHTML = `
      <div>
        <div class="brand-header">
          <div class="brand-eyebrow">${ICONS.flag} CIRCUITO COSTEIRO · 3,17 KM</div>
          <h1 class="brand-title">COSTA DOURADA</h1>
          <p class="brand-sub">Circuito mediterrâneo ao entardecer. Orla, falésias, vila em pedra e bosque em corrida única contra 5 rivais.</p>
        </div>
        <nav class="menu-nav" aria-label="Menu principal">
          <button type="button" class="btn btn-primary" data-action="race">
            <span>Correr</span>${ICONS.play}
          </button>
          <button type="button" class="btn" data-action="garage">
            <span>Garagem</span>${ICONS.car}
          </button>
          <button type="button" class="btn" data-action="config">
            <span>Configuração</span>${ICONS.sliders}
          </button>
        </nav>
      </div>
      <div class="menu-footer-strip">
        <span class="pill" data-role="summary-car">Veloce GT · Rosso Corsa #07</span>
        <span class="pill" data-role="summary-race">3 Voltas · Normal · Qualidade Alta</span>
        <span class="pill">Teclado (WASD / Setas) ou Controle</span>
      </div>
    `;
    this.menuEl.querySelector('[data-action="race"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onStartRace();
    });
    this.menuEl.querySelector('[data-action="garage"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.setScreen('garage');
    });
    this.menuEl.querySelector('[data-action="config"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.setScreen('config');
    });
    this.root.appendChild(this.menuEl);

    // 2. Garage (left card leaving right 65% clear for rotating 3D car!)
    this.garageEl = document.createElement('div');
    this.garageEl.className = 'garage-shell hidden';
    const gPanel = document.createElement('div');
    gPanel.className = 'garage-panel';
    gPanel.innerHTML = `
      <h2 class="panel-title">${ICONS.car} Garagem</h2>
      <span class="section-label">Modelo</span>
      <div class="seg-row" data-group="car-model">
        <button type="button" class="seg-btn" data-car="veloce">Veloce GT</button>
        <button type="button" class="seg-btn" data-car="solara">Solara RS</button>
      </div>
      <span class="section-label">Pintura e Número</span>
      <div class="swatch-grid" data-group="livery"></div>
      <div class="stat-bars" data-role="car-stats"></div>
      <div class="panel-actions">
        <button type="button" class="btn" data-action="back">Voltar</button>
        <button type="button" class="btn btn-primary" data-action="race">Correr</button>
      </div>
    `;
    this.garageStatsEl = gPanel.querySelector('[data-role="car-stats"]')!;
    this.garageModelBtns = Array.from(gPanel.querySelectorAll('[data-car]'));
    for (const btn of this.garageModelBtns) {
      btn.addEventListener('click', () => {
        this.callbacks.onUiCue('nav');
        this.config.carModel = btn.dataset.car as 'veloce' | 'solara';
        this.syncGarageUi();
        this.callbacks.onGarageChange(this.config.carModel, this.config.liveryIdx);
      });
    }
    const liveryGrid = gPanel.querySelector('[data-group="livery"]')!;
    for (const liv of LIVERIES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch-btn';
      b.dataset.livery = String(liv.id);
      b.innerHTML = `<span class="swatch-chip" style="background:${liv.primary}"></span><span>#${liv.number} ${liv.name.split(' ')[0]}</span>`;
      b.addEventListener('click', () => {
        this.callbacks.onUiCue('nav');
        this.config.liveryIdx = liv.id;
        this.syncGarageUi();
        this.callbacks.onGarageChange(this.config.carModel, this.config.liveryIdx);
      });
      liveryGrid.appendChild(b);
      this.garageSwatchBtns.push(b);
    }
    gPanel.querySelector('[data-action="back"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.setScreen('menu');
    });
    gPanel.querySelector('[data-action="race"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onStartRace();
    });
    this.garageEl.appendChild(gPanel);
    this.root.appendChild(this.garageEl);

    // 3. Config Overlay
    this.configEl = document.createElement('div');
    this.configEl.className = 'overlay-center hidden';
    const cPanel = document.createElement('div');
    cPanel.className = 'panel-card';
    cPanel.innerHTML = `
      <h2 class="panel-title">${ICONS.sliders} Configuração</h2>
      <span class="section-label">Voltas</span>
      <div class="seg-row" data-group="laps">
        <button type="button" class="seg-btn" data-laps="3">3 Voltas</button>
        <button type="button" class="seg-btn" data-laps="6">6 Voltas</button>
      </div>
      <span class="section-label">Dificuldade dos Rivais</span>
      <div class="seg-row" data-group="diff">
        <button type="button" class="seg-btn" data-diff="easy">Fácil</button>
        <button type="button" class="seg-btn" data-diff="normal">Normal</button>
        <button type="button" class="seg-btn" data-diff="hard">Difícil</button>
      </div>
      <span class="section-label">Qualidade Gráfica</span>
      <div class="seg-row" data-group="quality">
        <button type="button" class="seg-btn" data-qual="high">Alta (HDR + Bloom)</button>
        <button type="button" class="seg-btn" data-qual="low">Baixa (Desempenho)</button>
      </div>
      <span class="section-label">Áudio</span>
      <div class="slider-row"><span>Volume Geral</span><input type="range" min="0" max="100" value="85" data-vol="master"><span class="tabular" data-vlabel="master">85%</span></div>
      <div class="slider-row"><span>Motor & Efeitos</span><input type="range" min="0" max="100" value="90" data-vol="sfx"><span class="tabular" data-vlabel="sfx">90%</span></div>
      <div class="slider-row"><span>Ambiente & UI</span><input type="range" min="0" max="100" value="45" data-vol="music"><span class="tabular" data-vlabel="music">45%</span></div>
      <span class="section-label">Controles</span>
      <div class="controls-grid">
        <div><span class="kbd">W</span> / <span class="kbd">↑</span> Acelerar</div>
        <div><span class="kbd">S</span> / <span class="kbd">↓</span> Freio / Ré</div>
        <div><span class="kbd">A</span> <span class="kbd">D</span> / <span class="kbd">←</span> <span class="kbd">→</span> Direção</div>
        <div><span class="kbd">Espaço</span> Freio de mão</div>
        <div><span class="kbd">C</span> Alternar câmera</div>
        <div><span class="kbd">R</span> Reposicionar pista</div>
        <div><span class="kbd">Esc</span> Pausar</div>
        <div>Controle / Gamepad suportado</div>
      </div>
      <div class="panel-actions">
        <button type="button" class="btn btn-primary" data-action="done">Aplicar e Voltar</button>
      </div>
    `;
    cPanel.querySelectorAll<HTMLButtonElement>('[data-laps]').forEach((b) =>
      b.addEventListener('click', () => {
        this.callbacks.onUiCue('nav');
        this.config.laps = Number(b.dataset.laps) as 3 | 6;
        this.syncConfigUi();
        this.callbacks.onConfigChange({ ...this.config });
      })
    );
    cPanel.querySelectorAll<HTMLButtonElement>('[data-diff]').forEach((b) =>
      b.addEventListener('click', () => {
        this.callbacks.onUiCue('nav');
        this.config.difficulty = b.dataset.diff as Difficulty;
        this.syncConfigUi();
        this.callbacks.onConfigChange({ ...this.config });
      })
    );
    cPanel.querySelectorAll<HTMLButtonElement>('[data-qual]').forEach((b) =>
      b.addEventListener('click', () => {
        this.callbacks.onUiCue('nav');
        this.config.quality = b.dataset.qual as 'high' | 'low';
        this.syncConfigUi();
        this.callbacks.onConfigChange({ ...this.config });
      })
    );
    cPanel.querySelectorAll<HTMLInputElement>('[data-vol]').forEach((inp) =>
      inp.addEventListener('input', () => {
        const key = inp.dataset.vol as 'master' | 'sfx' | 'music';
        const val = Number(inp.value) / 100;
        if (key === 'master') this.config.volMaster = val;
        if (key === 'sfx') this.config.volSfx = val;
        if (key === 'music') this.config.volMusic = val;
        this.syncConfigUi();
        this.callbacks.onConfigChange({ ...this.config });
      })
    );
    cPanel.querySelector('[data-action="done"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.setScreen('menu');
    });
    this.configEl.appendChild(cPanel);
    this.root.appendChild(this.configEl);

    // 4. Grid Banner + Countdown
    this.gridBannerEl = document.createElement('div');
    this.gridBannerEl.className = 'grid-banner hidden';
    this.gridBannerTitle = document.createElement('h2');
    this.gridBannerSub = document.createElement('p');
    this.gridBannerEl.appendChild(this.gridBannerTitle);
    this.gridBannerEl.appendChild(this.gridBannerSub);
    this.root.appendChild(this.gridBannerEl);

    this.countdownEl = document.createElement('div');
    this.countdownEl.className = 'countdown-center tabular hidden';
    this.root.appendChild(this.countdownEl);

    this.toastEl = document.createElement('div');
    this.toastEl.className = 'toast-warn hidden';
    this.toastEl.textContent = 'Atalho detectado — passe pelos setores da pista';
    this.root.appendChild(this.toastEl);

    // 5. Discreet Edge Race HUD
    this.hudEl = document.createElement('div');
    this.hudEl.className = 'race-hud hidden';
    this.hudEl.innerHTML = `
      <div class="hud-top-left">
        <div class="hud-pos-card">
          <div class="hud-rank tabular" data-role="rank">6<small>/6</small></div>
          <div class="hud-meta">
            <strong data-role="lap">VOLTA 1/3</strong>
            <span data-role="zone">Z1 · ORLA DOURADA</span>
          </div>
        </div>
        <div class="hud-timers tabular">
          <span>ATUAL<strong data-role="cur-time">00:00.00</strong></span>
          <span>MELHOR<strong data-role="best-time">--:--.--</strong></span>
        </div>
      </div>
      <div class="hud-top-right">
        <div class="minimap-box">
          <canvas width="176" height="146" data-role="minimap"></canvas>
        </div>
      </div>
      <div class="hud-bottom-right">
        <div class="tach-top">
          <div class="hud-speed tabular" data-role="speed">0<span>km/h</span></div>
          <div class="hud-gear tabular" data-role="gear">N</div>
        </div>
        <div class="rpm-bar"><div class="rpm-fill" data-role="rpm"></div></div>
      </div>
    `;
    this.rankEl = this.hudEl.querySelector('[data-role="rank"]')!;
    this.lapEl = this.hudEl.querySelector('[data-role="lap"]')!;
    this.zoneEl = this.hudEl.querySelector('[data-role="zone"]')!;
    this.curTimeEl = this.hudEl.querySelector('[data-role="cur-time"]')!;
    this.bestTimeEl = this.hudEl.querySelector('[data-role="best-time"]')!;
    this.speedEl = this.hudEl.querySelector('[data-role="speed"]')!;
    this.gearEl = this.hudEl.querySelector('[data-role="gear"]')!;
    this.rpmFillEl = this.hudEl.querySelector('[data-role="rpm"]')!;
    this.minimapCanvas = this.hudEl.querySelector('[data-role="minimap"]')!;
    this.minimapCtx = this.minimapCanvas.getContext('2d')!;
    this.root.appendChild(this.hudEl);

    this.bakeMinimapBase(track);

    // 6. Pause Menu
    this.pauseEl = document.createElement('div');
    this.pauseEl.className = 'overlay-center hidden';
    this.pauseEl.innerHTML = `
      <div class="panel-card" style="width:min(380px, 100%)">
        <h2 class="panel-title">Corrida Pausada</h2>
        <div class="menu-nav" style="width:100%; margin-top:10px">
          <button type="button" class="btn btn-primary" data-action="resume">Continuar</button>
          <button type="button" class="btn" data-action="restart">Reiniciar Corrida</button>
          <button type="button" class="btn" data-action="menu">Voltar ao Menu</button>
        </div>
      </div>
    `;
    this.pauseEl.querySelector('[data-action="resume"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onResumeRace();
    });
    this.pauseEl.querySelector('[data-action="restart"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onRestartRace();
    });
    this.pauseEl.querySelector('[data-action="menu"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onReturnToMenu();
    });
    this.root.appendChild(this.pauseEl);

    // 7. Results Overlay
    this.resultsEl = document.createElement('div');
    this.resultsEl.className = 'overlay-center hidden';
    this.resultsEl.innerHTML = `
      <div class="panel-card" style="width:min(660px, 100%)">
        <h2 class="panel-title">${ICONS.trophy} Resultado da Corrida</h2>
        <p class="brand-sub" data-role="results-sub" style="margin-top:-8px; margin-bottom:10px"></p>
        <table class="results-table tabular">
          <thead>
            <tr><th>Pos</th><th>Piloto</th><th>Carro</th><th>Melhor Volta</th><th>Tempo Total</th></tr>
          </thead>
          <tbody data-role="results-rows"></tbody>
        </table>
        <div class="panel-actions">
          <button type="button" class="btn" data-action="menu">Menu Principal</button>
          <button type="button" class="btn btn-primary" data-action="again">Correr de Novo</button>
        </div>
      </div>
    `;
    this.resultsRowsEl = this.resultsEl.querySelector('[data-role="results-rows"]')!;
    this.resultsSubtitleEl = this.resultsEl.querySelector('[data-role="results-sub"]')!;
    this.resultsEl.querySelector('[data-action="menu"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onReturnToMenu();
    });
    this.resultsEl.querySelector('[data-action="again"]')!.addEventListener('click', () => {
      this.callbacks.onUiCue('confirm');
      this.callbacks.onRestartRace();
    });
    this.root.appendChild(this.resultsEl);

    this.syncGarageUi();
    this.syncConfigUi();
  }

  private bakeMinimapBase(track: TrackSpline): void {
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    this.minimapBase = document.createElement('canvas');
    this.minimapBase.width = w;
    this.minimapBase.height = h;
    const ctx = this.minimapBase.getContext('2d')!;

    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const s of track.samples) {
      if (s.pos.x < minX) minX = s.pos.x;
      if (s.pos.x > maxX) maxX = s.pos.x;
      if (s.pos.z < minZ) minZ = s.pos.z;
      if (s.pos.z > maxZ) maxZ = s.pos.z;
    }
    const pad = 16;
    const spanX = Math.max(1, maxX - minX);
    const spanZ = Math.max(1, maxZ - minZ);
    this.mmScale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanZ);
    this.mmOffX = (w - spanX * this.mmScale) * 0.5 - minX * this.mmScale;
    this.mmOffZ = (h - spanZ * this.mmScale) * 0.5 - minZ * this.mmScale;

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    for (let i = 0; i < track.samples.length; i += 6) {
      const s = track.samples[i];
      const px = s.pos.x * this.mmScale + this.mmOffX;
      const py = s.pos.z * this.mmScale + this.mmOffZ;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(245, 193, 86, 0.65)';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Start/Finish perpendicular tick at s=0
    const s0 = track.sampleAtDistance(0);
    const x0 = s0.pos.x * this.mmScale + this.mmOffX;
    const y0 = s0.pos.z * this.mmScale + this.mmOffZ;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x0 - s0.right.x * 5, y0 - s0.right.z * 5);
    ctx.lineTo(x0 + s0.right.x * 5, y0 + s0.right.z * 5);
    ctx.stroke();
  }

  public syncGarageUi(): void {
    for (const btn of this.garageModelBtns) {
      btn.classList.toggle('active', btn.dataset.car === this.config.carModel);
    }
    for (const btn of this.garageSwatchBtns) {
      btn.classList.toggle('active', Number(btn.dataset.livery) === this.config.liveryIdx);
    }

    const spec = CAR_SPECS[this.config.carModel];
    const topKmh = Math.round(spec.topSpeedMs * 3.6);
    const gripPct = Math.round(((spec.gripFront + spec.gripRear) * 0.5 / 12.0) * 100);
    const agilPct = this.config.carModel === 'solara' ? 92 : 84;
    const spdPct = Math.round((topKmh / 245) * 100);

    this.garageStatsEl.innerHTML = `
      <div class="stat-row"><span>Velocidade Máx</span><div class="stat-track"><div class="stat-fill" style="width:${spdPct}%"></div></div><span class="tabular">${topKmh}</span></div>
      <div class="stat-row"><span>Aderência</span><div class="stat-track"><div class="stat-fill" style="width:${gripPct}%"></div></div><span class="tabular">${gripPct}%</span></div>
      <div class="stat-row"><span>Agilidade</span><div class="stat-track"><div class="stat-fill" style="width:${agilPct}%"></div></div><span class="tabular">${agilPct}%</span></div>
    `;

    const liv = LIVERIES[this.config.liveryIdx];
    const carSum = this.menuEl.querySelector('[data-role="summary-car"]');
    if (carSum) carSum.textContent = `${spec.name} · ${liv.name} #${liv.number}`;
  }

  public syncConfigUi(): void {
    this.configEl.querySelectorAll<HTMLButtonElement>('[data-laps]').forEach((b) =>
      b.classList.toggle('active', Number(b.dataset.laps) === this.config.laps)
    );
    this.configEl.querySelectorAll<HTMLButtonElement>('[data-diff]').forEach((b) =>
      b.classList.toggle('active', b.dataset.diff === this.config.difficulty)
    );
    this.configEl.querySelectorAll<HTMLButtonElement>('[data-qual]').forEach((b) =>
      b.classList.toggle('active', b.dataset.qual === this.config.quality)
    );
    const setSlider = (k: 'master' | 'sfx' | 'music', v: number) => {
      const inp = this.configEl.querySelector<HTMLInputElement>(`[data-vol="${k}"]`);
      const lbl = this.configEl.querySelector<HTMLElement>(`[data-vlabel="${k}"]`);
      const pct = Math.round(v * 100);
      if (inp) inp.value = String(pct);
      if (lbl) lbl.textContent = `${pct}%`;
    };
    setSlider('master', this.config.volMaster);
    setSlider('sfx', this.config.volSfx);
    setSlider('music', this.config.volMusic);

    const raceSum = this.menuEl.querySelector('[data-role="summary-race"]');
    if (raceSum) {
      raceSum.textContent = `${this.config.laps} Voltas · ${DIFF_LABELS[this.config.difficulty]} · Qualidade ${this.config.quality === 'high' ? 'Alta' : 'Baixa'}`;
    }
  }

  public setScreen(screen: GameScreen): void {
    this.screen = screen;
    this.menuEl.classList.toggle('hidden', screen !== 'menu');
    this.garageEl.classList.toggle('hidden', screen !== 'garage');
    this.configEl.classList.toggle('hidden', screen !== 'config');
    this.pauseEl.classList.toggle('hidden', screen !== 'paused');
    this.resultsEl.classList.toggle('hidden', screen !== 'results');
    this.gridBannerEl.classList.toggle('hidden', screen !== 'grid_intro');
    this.countdownEl.classList.toggle('hidden', screen !== 'countdown');

    if (screen === 'grid_intro') {
      const spec = CAR_SPECS[this.config.carModel];
      this.gridBannerTitle.textContent = `COSTA DOURADA · LARGADA (${this.config.laps} VOLTAS)`;
      this.gridBannerSub.textContent = `Você larga em P6 com ${spec.name} · Dificuldade ${DIFF_LABELS[this.config.difficulty]} · Pressione Espaço para pular`;
    }

    this.refreshHudVisibility();
    this.callbacks.onScreenChange(screen);

    // Focus primary interactive button cleanly for keyboard navigation
    const activeContainer =
      screen === 'menu'
        ? this.menuEl
        : screen === 'garage'
          ? this.garageEl
          : screen === 'config'
            ? this.configEl
            : screen === 'paused'
              ? this.pauseEl
              : screen === 'results'
                ? this.resultsEl
                : null;
    if (activeContainer) {
      const focusTarget = activeContainer.querySelector<HTMLButtonElement>('.btn-primary, button');
      focusTarget?.focus();
    }
  }

  public setHudVisible(visible: boolean | null): void {
    this.hudVisibleOverride = visible;
    this.refreshHudVisibility();
  }

  private refreshHudVisibility(): void {
    const defaultShow =
      this.screen === 'racing' || this.screen === 'countdown' || this.screen === 'paused';
    const show = this.hudVisibleOverride !== null ? this.hudVisibleOverride : defaultShow;
    this.hudEl.classList.toggle('hidden', !show);
  }

  public setCountdownText(text: string): void {
    this.countdownEl.textContent = text;
  }

  public triggerAntiCutToast(): void {
    this.cutToastTimer = 2.6;
    this.toastEl.classList.remove('hidden');
  }

  public hideToast(): void {
    this.cutToastTimer = 0;
    this.toastEl.classList.add('hidden');
  }

  public showResults(racers: RacerProgress[], totalLaps: number): void {
    const sorted = [...racers].sort((a, b) => a.rank - b.rank);
    const playerRow = sorted.find((r) => r.isPlayer);
    this.resultsSubtitleEl.textContent = playerRow
      ? `Você cruzou a linha de chegada em ${playerRow.rank}º lugar após ${totalLaps} ${totalLaps === 1 ? 'volta' : 'voltas'}.`
      : `Classificação final após ${totalLaps} ${totalLaps === 1 ? 'volta' : 'voltas'}.`;

    this.resultsRowsEl.innerHTML = sorted
      .map((r) => {
        const bestStr = r.bestLapTimeSec !== null ? formatRaceTime(r.bestLapTimeSec) : '--:--.--';
        const totalStr = r.projectedFinishStr
          ? r.projectedFinishStr
          : r.finishTimeSec !== null
            ? formatRaceTime(r.finishTimeSec)
            : '--:--.--';
        return `<tr class="${r.isPlayer ? 'is-player' : ''}">
          <td>${r.rank}º</td>
          <td>${r.name}${r.isPlayer ? ' (Você)' : ''}</td>
          <td>${r.carModel}</td>
          <td>${bestStr}</td>
          <td>${totalStr}</td>
        </tr>`;
      })
      .join('');

    this.setScreen('results');
  }

  public updateHud(
    dt: number,
    playerRacer: RacerProgress,
    playerVeh: ArcadeVehicle,
    allVehicles: ArcadeVehicle[],
    zone: ZoneId,
    totalLaps: number
  ): void {
    if (this.cutToastTimer > 0) {
      this.cutToastTimer -= dt;
      if (this.cutToastTimer <= 0) this.toastEl.classList.add('hidden');
    }

    this.rankEl.innerHTML = `${playerRacer.rank}<small>/${allVehicles.length}</small>`;
    this.lapEl.textContent = `VOLTA ${Math.min(totalLaps, playerRacer.lap)}/${totalLaps}`;
    this.zoneEl.textContent = ZONE_LABELS[zone];
    this.curTimeEl.textContent = formatRaceTime(playerRacer.currentLapTimeSec);
    this.bestTimeEl.textContent =
      playerRacer.bestLapTimeSec !== null ? formatRaceTime(playerRacer.bestLapTimeSec) : '--:--.--';

    const kmh = Math.round(playerVeh.speedMs * 3.6);
    this.speedEl.innerHTML = `${kmh}<span>km/h</span>`;
    this.gearEl.textContent = playerVeh.forwardSpeedMs < -0.5 ? 'R' : String(Math.max(1, playerVeh.gear));
    const rpmNorm = Math.max(0.08, Math.min(1, (playerVeh.rpm - 900) / (7800 - 900)));
    this.rpmFillEl.style.width = `${(rpmNorm * 100).toFixed(1)}%`;

    // Redraw minimap dots cleanly
    const ctx = this.minimapCtx;
    ctx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
    ctx.drawImage(this.minimapBase, 0, 0);

    for (const v of allVehicles) {
      if (v.isPlayer) continue;
      const mx = v.pos.x * this.mmScale + this.mmOffX;
      const my = v.pos.z * this.mmScale + this.mmOffZ;
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.arc(mx, my, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const px = playerVeh.pos.x * this.mmScale + this.mmOffX;
    const py = playerVeh.pos.z * this.mmScale + this.mmOffZ;
    ctx.fillStyle = '#f5c156';
    ctx.strokeStyle = '#0b121d';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(px, py, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  public handleMenuKeyDown(e: KeyboardEvent): boolean {
    const activeOverlay =
      this.screen === 'menu'
        ? this.menuEl
        : this.screen === 'garage'
          ? this.garageEl
          : this.screen === 'config'
            ? this.configEl
            : this.screen === 'paused'
              ? this.pauseEl
              : this.screen === 'results'
                ? this.resultsEl
                : null;
    if (!activeOverlay) return false;

    const btns = Array.from(activeOverlay.querySelectorAll<HTMLElement>('button, input[type="range"]'));
    if (btns.length === 0) return false;

    const curIdx = btns.indexOf(document.activeElement as HTMLElement);
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
      if (document.activeElement instanceof HTMLInputElement && e.code === 'ArrowRight') return false;
      e.preventDefault();
      const next = btns[(curIdx + 1) % btns.length];
      next.focus();
      this.callbacks.onUiCue('nav');
      return true;
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
      if (document.activeElement instanceof HTMLInputElement && e.code === 'ArrowLeft') return false;
      e.preventDefault();
      const prev = btns[(curIdx - 1 + btns.length) % btns.length];
      prev.focus();
      this.callbacks.onUiCue('nav');
      return true;
    }
    return false;
  }
}
