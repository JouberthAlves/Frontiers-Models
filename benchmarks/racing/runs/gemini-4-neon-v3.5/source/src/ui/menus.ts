import { CAR_MODELS, LIVERIES } from '../cars/carSpecs';
import { CarModelId, Difficulty, GameScreen, LightingMode, QualityPreset, RaceConfig, VolumeSettings } from '../types';
import { formatRaceTime } from './hud';

export interface RaceResultRow {
  position: number;
  name: string;
  carName: string;
  number: string;
  isPlayer: boolean;
  totalTimeSec: number;
  projected: boolean;
  bestLapSec: number;
}

export interface MenuCallbacks {
  onNavigate: (screen: GameScreen) => void;
  onConfigChange: (patch: Partial<RaceConfig>) => void;
  onVolumeChange: (v: VolumeSettings) => void;
  onStartRace: () => void;
  onResume: () => void;
  onRestart: () => void;
  onUIClick: (kind: 'nav' | 'confirm') => void;
}

export class MenuUI {
  private readonly root: HTMLElement;
  private readonly cb: MenuCallbacks;

  constructor(container: HTMLElement, callbacks: MenuCallbacks) {
    this.root = container;
    this.cb = callbacks;
  }

  showLoading(pct: number, label: string): void {
    let wrap = this.root.querySelector('.loading-wrap') as HTMLDivElement | null;
    if (!wrap) {
      this.root.innerHTML = `
        <div class="loading-wrap">
          <div class="brand-kicker">MEDITERRANEAN COASTAL CIRCUIT</div>
          <div class="brand-title">COSTA DORADA GP</div>
          <div class="loading-bar-outer"><div class="loading-bar-inner" id="load-fill"></div></div>
          <div class="loading-status" id="load-status">Initializing...</div>
        </div>
      `;
      wrap = this.root.querySelector('.loading-wrap');
    }
    const fill = this.root.querySelector('#load-fill') as HTMLElement | null;
    const st = this.root.querySelector('#load-status') as HTMLElement | null;
    if (fill) fill.style.width = `${Math.round(pct * 100)}%`;
    if (st) st.textContent = `${Math.round(pct * 100)}% · ${label}`;
  }

  clear(): void {
    this.root.innerHTML = '';
  }

  render(
    screen: GameScreen,
    config: RaceConfig,
    volumes: VolumeSettings,
    results?: RaceResultRow[]
  ): void {
    if (screen === 'racing' || screen === 'grid_intro' || screen === 'countdown') {
      this.clear();
      return;
    }

    if (screen === 'menu') {
      this.root.innerHTML = `
        <div class="menu-screen">
          <div>
            <div class="brand-kicker">MEDITERRANEAN GRAND PRIX · 3.28 KM COASTAL CIRCUIT</div>
            <div class="brand-title">COSTA<br/>DORADA GP</div>
            <div class="brand-sub">6-Car Coastal Circuit Racing · Golden Hour &amp; Moonlit Night · Chase &amp; Cockpit View</div>
            <div class="menu-nav">
              <button class="btn-gp primary" id="btn-play"><span>RACE SETUP</span><span>›</span></button>
              <button class="btn-gp" id="btn-garage"><span>GARAGE &amp; LIVERIES</span><span>›</span></button>
              <button class="btn-gp" id="btn-quick"><span>QUICK RACE</span><span>›</span></button>
            </div>
          </div>
          <div class="menu-footer">
            <span>WASD / ARROWS DRIVE</span>
            <span>SHIFT MINI-NITRO</span>
            <span>C CHASE / COCKPIT</span>
            <span>ESC PAUSE</span>
          </div>
        </div>
      `;
      this.bind('#btn-play', 'confirm', () => this.cb.onNavigate('setup'));
      this.bind('#btn-garage', 'nav', () => this.cb.onNavigate('garage'));
      this.bind('#btn-quick', 'confirm', () => this.cb.onStartRace());
      return;
    }

    if (screen === 'garage') {
      const car = CAR_MODELS[config.carModel];
      const liv = LIVERIES[config.liveryIndex];
      const swatches = LIVERIES.map(
        (l, idx) =>
          `<button class="swatch-btn ${idx === config.liveryIndex ? 'active' : ''}" data-liv="${idx}" style="background:#${l.primaryHex.toString(16).padStart(6, '0')}">${l.number}</button>`
      ).join('');

      this.root.innerHTML = `
        <div class="menu-screen garage-mode">
          <div>
            <div class="brand-kicker">GARAGE SHOWCASE</div>
            <div class="panel-card">
              <div class="panel-heading">${car.name}</div>
              <div style="font-size:13px;color:#9fb0c7;margin:-10px 0 18px;">${car.subtitle}</div>

              <div class="option-row">
                <span class="option-label">SELECT CAR MODEL</span>
                <div class="seg-group">
                  <button class="seg-btn ${config.carModel === 'aurelia_gtr' ? 'active' : ''}" data-car="aurelia_gtr">Aurelia GT-R</button>
                  <button class="seg-btn ${config.carModel === 'solara_corsa' ? 'active' : ''}" data-car="solara_corsa">Solara Corsa WB</button>
                </div>
              </div>

              <div class="option-row">
                <span class="option-label">LIVERY &amp; NUMBER · ${liv.name.toUpperCase()} #${liv.number}</span>
                <div class="swatch-grid">${swatches}</div>
              </div>

              <div class="option-row">
                <span class="option-label">SHOWCASE LIGHTING</span>
                <div class="seg-group">
                  <button class="seg-btn ${config.lighting === 'golden_hour' ? 'active' : ''}" data-tod="golden_hour">Golden Hour</button>
                  <button class="seg-btn ${config.lighting === 'night' ? 'active' : ''}" data-tod="night">Night</button>
                </div>
              </div>

              <div style="margin-top:16px;">
                <div class="spec-bar-row"><span>TOP SPEED</span><div class="spec-track"><div class="spec-fill" style="width:${car.stats.speed}%"></div></div><span>${car.stats.speed}</span></div>
                <div class="spec-bar-row"><span>HANDLING</span><div class="spec-track"><div class="spec-fill" style="width:${car.stats.handling}%"></div></div><span>${car.stats.handling}</span></div>
                <div class="spec-bar-row"><span>ACCEL</span><div class="spec-track"><div class="spec-fill" style="width:${car.stats.accel}%"></div></div><span>${car.stats.accel}</span></div>
              </div>

              <div class="actions-row">
                <button class="btn-gp" id="btn-back-menu"><span>BACK</span></button>
                <button class="btn-gp primary" id="btn-to-setup"><span>RACE SETUP ›</span></button>
              </div>
            </div>
          </div>
          <div class="menu-footer"><span>ROTATING 3D SHOWCASE · 100% PROCEDURAL BODYWORK &amp; COCKPIT</span></div>
        </div>
      `;

      this.root.querySelectorAll<HTMLButtonElement>('[data-car]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ carModel: b.dataset.car as CarModelId });
        };
      });
      this.root.querySelectorAll<HTMLButtonElement>('[data-liv]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ liveryIndex: Number(b.dataset.liv) });
        };
      });
      this.root.querySelectorAll<HTMLButtonElement>('[data-tod]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ lighting: b.dataset.tod as LightingMode });
        };
      });
      this.bind('#btn-back-menu', 'nav', () => this.cb.onNavigate('menu'));
      this.bind('#btn-to-setup', 'confirm', () => this.cb.onNavigate('setup'));
      return;
    }

    if (screen === 'setup') {
      const car = CAR_MODELS[config.carModel];
      const liv = LIVERIES[config.liveryIndex];
      this.root.innerHTML = `
        <div class="menu-screen centered">
          <div class="panel-card">
            <div class="brand-kicker">COSTA DORADA GP · 6 CARS</div>
            <div class="panel-heading">RACE SETUP</div>
            <div style="font-size:13px;color:#cbd5e1;margin:-10px 0 18px;">Car: <strong>${car.name}</strong> · ${liv.name} #${liv.number}</div>

            <div class="option-row">
              <span class="option-label">RACE DISTANCE (LAPS)</span>
              <div class="seg-group">
                <button class="seg-btn ${config.laps === 3 ? 'active' : ''}" data-laps="3">3 Laps</button>
                <button class="seg-btn ${config.laps === 6 ? 'active' : ''}" data-laps="6">6 Laps</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">AI DIFFICULTY</span>
              <div class="seg-group">
                <button class="seg-btn ${config.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">Easy</button>
                <button class="seg-btn ${config.difficulty === 'normal' ? 'active' : ''}" data-diff="normal">Normal</button>
                <button class="seg-btn ${config.difficulty === 'hard' ? 'active' : ''}" data-diff="hard">Hard</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">TIME OF DAY</span>
              <div class="seg-group">
                <button class="seg-btn ${config.lighting === 'golden_hour' ? 'active' : ''}" data-tod="golden_hour">Golden Hour</button>
                <button class="seg-btn ${config.lighting === 'night' ? 'active' : ''}" data-tod="night">Night</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">GRAPHICS QUALITY</span>
              <div class="seg-group">
                <button class="seg-btn ${config.quality === 'high' ? 'active' : ''}" data-qual="high">High (CSM + AO + AA)</button>
                <button class="seg-btn ${config.quality === 'low' ? 'active' : ''}" data-qual="low">Low (60+ FPS iGPU)</button>
              </div>
            </div>

            <div class="actions-row">
              <button class="btn-gp" id="btn-setup-garage"><span>GARAGE</span></button>
              <button class="btn-gp primary" id="btn-start-race"><span>START RACE ›</span></button>
            </div>
          </div>
        </div>
      `;

      this.root.querySelectorAll<HTMLButtonElement>('[data-laps]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ laps: Number(b.dataset.laps) as 3 | 6 });
        };
      });
      this.root.querySelectorAll<HTMLButtonElement>('[data-diff]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ difficulty: b.dataset.diff as Difficulty });
        };
      });
      this.root.querySelectorAll<HTMLButtonElement>('[data-tod]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ lighting: b.dataset.tod as LightingMode });
        };
      });
      this.root.querySelectorAll<HTMLButtonElement>('[data-qual]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ quality: b.dataset.qual as QualityPreset });
        };
      });
      this.bind('#btn-setup-garage', 'nav', () => this.cb.onNavigate('garage'));
      this.bind('#btn-start-race', 'confirm', () => this.cb.onStartRace());
      return;
    }

    if (screen === 'paused') {
      this.root.innerHTML = `
        <div class="menu-screen centered">
          <div class="panel-card">
            <div class="brand-kicker">RACE PAUSED</div>
            <div class="panel-heading">SETTINGS &amp; CONTROLS</div>

            <div class="option-row">
              <span class="option-label">QUALITY PRESET</span>
              <div class="seg-group">
                <button class="seg-btn ${config.quality === 'high' ? 'active' : ''}" data-qual="high">High</button>
                <button class="seg-btn ${config.quality === 'low' ? 'active' : ''}" data-qual="low">Low</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">AUDIO VOLUMES</span>
              <div class="slider-row"><span>Master</span><input id="vol-master" type="range" min="0" max="100" value="${Math.round(volumes.master * 100)}"/><span>${Math.round(volumes.master * 100)}%</span></div>
              <div class="slider-row"><span>SFX / Engine</span><input id="vol-sfx" type="range" min="0" max="100" value="${Math.round(volumes.sfx * 100)}"/><span>${Math.round(volumes.sfx * 100)}%</span></div>
              <div class="slider-row"><span>Music</span><input id="vol-music" type="range" min="0" max="100" value="${Math.round(volumes.music * 100)}"/><span>${Math.round(volumes.music * 100)}%</span></div>
            </div>

            <div class="controls-grid">
              <div><span class="kbd">W / ↑</span>Accelerate</div>
              <div><span class="kbd">S / ↓</span>Brake / Reverse</div>
              <div><span class="kbd">A / D</span>Steer Left / Right</div>
              <div><span class="kbd">SHIFT</span>Mini-Nitro Boost</div>
              <div><span class="kbd">C</span>Chase / Cockpit</div>
              <div><span class="kbd">ESC</span>Pause / Resume</div>
            </div>

            <div class="actions-row" style="margin-top:20px;">
              <button class="btn-gp primary" id="btn-resume"><span>RESUME</span></button>
              <button class="btn-gp" id="btn-restart"><span>RESTART</span></button>
              <button class="btn-gp" id="btn-quit"><span>MENU</span></button>
            </div>
          </div>
        </div>
      `;

      this.root.querySelectorAll<HTMLButtonElement>('[data-qual]').forEach((b) => {
        b.onclick = () => {
          this.cb.onUIClick('nav');
          this.cb.onConfigChange({ quality: b.dataset.qual as QualityPreset });
        };
      });

      const bindSlider = (id: string, key: keyof VolumeSettings) => {
        const el = this.root.querySelector(id) as HTMLInputElement | null;
        if (!el) return;
        el.oninput = () => {
          const nv = { ...volumes, [key]: Number(el.value) / 100 };
          volumes[key] = nv[key];
          if (el.nextElementSibling) el.nextElementSibling.textContent = `${el.value}%`;
          this.cb.onVolumeChange(nv);
        };
      };
      bindSlider('#vol-master', 'master');
      bindSlider('#vol-sfx', 'sfx');
      bindSlider('#vol-music', 'music');

      this.bind('#btn-resume', 'confirm', () => this.cb.onResume());
      this.bind('#btn-restart', 'confirm', () => this.cb.onRestart());
      this.bind('#btn-quit', 'nav', () => this.cb.onNavigate('menu'));
      return;
    }

    if (screen === 'results') {
      const rows = (results ?? [])
        .map(
          (r) => `
          <tr class="${r.isPlayer ? 'player-row' : ''}">
            <td>#${r.position}</td>
            <td>${r.name} ${r.isPlayer ? '(YOU)' : ''}</td>
            <td>${r.carName} #${r.number}</td>
            <td>${r.projected ? '≈ ' : ''}${formatRaceTime(r.totalTimeSec)}</td>
            <td>${formatRaceTime(r.bestLapSec)}</td>
          </tr>
        `
        )
        .join('');

      const playerRow = (results ?? []).find((r) => r.isPlayer);
      this.root.innerHTML = `
        <div class="menu-screen centered">
          <div class="panel-card wide">
            <div class="brand-kicker">CHECKERED FLAG · COSTA DORADA GP</div>
            <div class="panel-heading">${playerRow ? `FINISHED P${playerRow.position}` : 'RACE COMPLETE'}</div>
            <table class="results-table">
              <thead>
                <tr><th>POS</th><th>DRIVER</th><th>CAR</th><th>TOTAL TIME</th><th>BEST LAP</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="actions-row">
              <button class="btn-gp primary" id="btn-race-again"><span>RACE AGAIN ›</span></button>
              <button class="btn-gp" id="btn-res-menu"><span>MAIN MENU</span></button>
            </div>
          </div>
        </div>
      `;
      this.bind('#btn-race-again', 'confirm', () => this.cb.onStartRace());
      this.bind('#btn-res-menu', 'nav', () => this.cb.onNavigate('menu'));
    }
  }

  private bind(sel: string, kind: 'nav' | 'confirm', fn: () => void): void {
    const el = this.root.querySelector<HTMLButtonElement>(sel);
    if (el) {
      el.onclick = () => {
        this.cb.onUIClick(kind);
        fn();
      };
    }
  }
}
