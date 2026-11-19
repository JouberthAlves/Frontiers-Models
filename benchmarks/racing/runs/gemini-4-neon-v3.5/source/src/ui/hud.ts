import { CameraMode, ZoneId } from '../types';
import { TrackSpline } from '../world/trackSpline';
import { VehiclePhysics } from '../physics/vehiclePhysics';
import { clamp } from '../utils/rng';

export function formatRaceTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '--:--.--';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.floor((sec * 100) % 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

const ZONE_LABELS: Record<ZoneId, string> = {
  Z1: 'Z1 · WATERFRONT PROMENADE',
  Z2: 'Z2 · LIMESTONE CLIFFSIDE',
  Z3: 'Z3 · SAN MARCO VILLAGE',
  Z4: 'Z4 · PINE WOODS & VIADUCT',
};

/**
 * Commercial SVG + Geometric Motorsport HUD:
 * - Position, Lap counter, Current & Best Lap times, Zone & Camera indicator
 * - Custom Vector SVG Minimap derived directly from TrackSpline
 * - Custom SVG Curved Tachometer + Animated Needle + Digital KM/H + Gear + Mini-Nitro Gauge!
 */
export class RaceHUD {
  private readonly root: HTMLElement;
  private readonly layer: HTMLDivElement;

  private posNumEl!: HTMLElement;
  private lapValEl!: HTMLElement;
  private curTimeEl!: HTMLElement;
  private bestTimeEl!: HTMLElement;
  private zoneNameEl!: HTMLElement;
  private camHintEl!: HTMLElement;
  private centerBannerEl!: HTMLElement;

  // Tachometer SVG elements
  private rpmArcEl!: SVGPathElement;
  private rpmNeedleEl!: SVGLineElement;
  private speedTextEl!: SVGTextElement;
  private gearTextEl!: SVGTextElement;
  private nitroArcEl!: SVGPathElement;
  private nitroLabelEl!: SVGTextElement;

  // Minimap SVG elements
  private mapMinX = 0;
  private mapMinZ = 0;
  private mapScale = 1;
  private mapOffX = 0;
  private mapOffY = 0;
  private aiDots: SVGCircleElement[] = [];
  private playerArrow!: SVGPolygonElement;

  constructor(container: HTMLElement, track: TrackSpline) {
    this.root = container;
    this.layer = document.createElement('div');
    this.layer.className = 'hud-layer hidden';
    this.root.innerHTML = '';
    this.root.appendChild(this.layer);

    this.buildDOM(track);
  }

  private buildDOM(track: TrackSpline): void {
    // Compute SVG minimap projection directly from TrackSpline
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < track.samples.length; i += 6) {
      const p = track.samples[i].pos;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }
    const pad = 22;
    const spanX = Math.max(1, maxX - minX);
    const spanZ = Math.max(1, maxZ - minZ);
    const viewSize = 200;
    this.mapScale = (viewSize - pad * 2) / Math.max(spanX, spanZ);
    this.mapMinX = minX;
    this.mapMinZ = minZ;
    this.mapOffX = (viewSize - spanX * this.mapScale) * 0.5;
    this.mapOffY = (viewSize - spanZ * this.mapScale) * 0.5;

    const toMap = (x: number, z: number): [number, number] => [
      this.mapOffX + (x - this.mapMinX) * this.mapScale,
      this.mapOffY + (z - this.mapMinZ) * this.mapScale,
    ];

    const pts: string[] = [];
    for (let i = 0; i < track.samples.length; i += 6) {
      const p = track.samples[i].pos;
      const [mx, my] = toMap(p.x, p.z);
      pts.push(`${mx.toFixed(1)},${my.toFixed(1)}`);
    }
    const sf = track.sampleAtS(track.spec.startFinishS);
    const [sfX, sfY] = toMap(sf.pos.x, sf.pos.z);

    // Precompute SVG arc paths for curved motorsport tachometer (radius 96, center 166, 134)
    const tachBgPath = describeArc(166, 134, 96, -132, 108);
    const redlinePath = describeArc(166, 134, 96, 62, 108);
    const nitroBgPath = describeArc(166, 134, 114, -126, 46);

    // Tick marks along tachometer arc
    let ticksSvg = '';
    for (let t = 0; t <= 8; t++) {
      const deg = -132 + (t / 8) * 240;
      const rad = ((deg - 90) * Math.PI) / 180;
      const x1 = 166 + Math.cos(rad) * 82;
      const y1 = 134 + Math.sin(rad) * 82;
      const x2 = 166 + Math.cos(rad) * 92;
      const y2 = 134 + Math.sin(rad) * 92;
      const tx = 166 + Math.cos(rad) * 68;
      const ty = 134 + Math.sin(rad) * 68 + 4;
      const col = t >= 7 ? '#ef3340' : '#cbd5e1';
      ticksSvg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="2.2" />`;
      ticksSvg += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" fill="${col}" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="11" font-weight="700" text-anchor="middle">${t}</text>`;
    }

    this.layer.innerHTML = `
      <div class="hud-top">
        <div class="hud-race-strip">
          <div class="hud-pos-block">
            <div class="hud-pos-inner">
              <div>
                <span class="hud-pos-label">POS</span>
                <span class="hud-pos-num" id="hud-pos-num">1</span>
              </div>
              <span class="hud-pos-total">/ 6</span>
            </div>
          </div>
          <div class="hud-meta-block">
            <div class="hud-meta-inner">
              <div class="hud-stat">
                <span class="hud-stat-label">LAP</span>
                <span class="hud-stat-val accent" id="hud-lap-val">1 / 3</span>
              </div>
              <div class="hud-stat">
                <span class="hud-stat-label">CURRENT</span>
                <span class="hud-stat-val" id="hud-cur-time">00:00.00</span>
              </div>
              <div class="hud-stat">
                <span class="hud-stat-label">BEST LAP</span>
                <span class="hud-stat-val" id="hud-best-time">--:--.--</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hud-zone-pill">
          <div>
            <div class="hud-zone-name" id="hud-zone-name">Z1 · WATERFRONT PROMENADE</div>
            <div class="hud-cam-hint" id="hud-cam-hint">CHASE CAM · [C] COCKPIT · [SHIFT] NITRO</div>
          </div>
        </div>
      </div>

      <div class="hud-center-banner" id="hud-center-banner"></div>

      <div class="hud-bottom">
        <div class="hud-minimap-wrap">
          <svg class="hud-minimap-svg" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(8,14,24,0.68)"/>
                <stop offset="88%" stop-color="rgba(8,14,24,0.44)"/>
                <stop offset="100%" stop-color="rgba(8,14,24,0.0)"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#mapBg)" stroke="rgba(255,255,255,0.14)" stroke-width="1.2"/>
            <polygon points="${pts.join(' ')}" fill="none" stroke="rgba(10,14,22,0.88)" stroke-width="9" stroke-linejoin="round"/>
            <polygon points="${pts.join(' ')}" fill="none" stroke="rgba(226,232,240,0.88)" stroke-width="4.2" stroke-linejoin="round"/>
            <rect x="${(sfX - 5).toFixed(1)}" y="${(sfY - 2).toFixed(1)}" width="10" height="4" fill="#f5b952" stroke="#080c14" stroke-width="0.8"/>
            <g id="minimap-cars"></g>
          </svg>
        </div>

        <div class="hud-tach-wrap">
          <svg class="hud-tach-svg" viewBox="0 0 320 230">
            <defs>
              <linearGradient id="rpmGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22d3ee"/>
                <stop offset="68%" stop-color="#f5b952"/>
                <stop offset="100%" stop-color="#ef3340"/>
              </linearGradient>
              <linearGradient id="nitroGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#67e8f9"/>
              </linearGradient>
              <radialGradient id="dialBg" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="rgba(10,16,28,0.86)"/>
                <stop offset="82%" stop-color="rgba(10,16,28,0.68)"/>
                <stop offset="100%" stop-color="rgba(10,16,28,0.0)"/>
              </radialGradient>
            </defs>
            <circle cx="166" cy="134" r="106" fill="url(#dialBg)"/>
            <!-- Outer Curved Mini-Nitro Gauge -->
            <path d="${nitroBgPath}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="7.5" stroke-linecap="round"/>
            <path id="hud-nitro-arc" d="${nitroBgPath}" fill="none" stroke="url(#nitroGrad)" stroke-width="7.5" stroke-linecap="round"/>
            <text id="hud-nitro-label" x="62" y="212" fill="#22d3ee" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="11" font-weight="800" letter-spacing="2">NITRO</text>

            <!-- Main Curved Tachometer Arc -->
            <path d="${tachBgPath}" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="11" stroke-linecap="butt"/>
            <path d="${redlinePath}" fill="none" stroke="rgba(239,51,64,0.34)" stroke-width="11"/>
            <path id="hud-rpm-arc" d="${tachBgPath}" fill="none" stroke="url(#rpmGrad)" stroke-width="11" stroke-linecap="butt"/>
            ${ticksSvg}

            <!-- Animated Tachometer Needle -->
            <line id="hud-rpm-needle" x1="166" y1="134" x2="166" y2="48" stroke="#f5b952" stroke-width="3" stroke-linecap="round"/>
            <circle cx="166" cy="134" r="7" fill="#0f172a" stroke="#f5b952" stroke-width="2.2"/>

            <!-- Digital Speed & Gear Readout -->
            <rect x="206" y="138" width="46" height="46" rx="4" fill="rgba(245,185,82,0.18)" stroke="#f5b952" stroke-width="1.8"/>
            <text id="hud-gear-text" x="229" y="172" fill="#ffffff" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="32" font-weight="900" font-style="italic" text-anchor="middle">1</text>

            <text id="hud-speed-text" x="195" y="176" fill="#ffffff" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="52" font-weight="900" font-style="italic" text-anchor="end">0</text>
            <text x="195" y="195" fill="#9fb0c7" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" text-anchor="end">KM/H</text>
          </svg>
        </div>
      </div>
    `;

    this.posNumEl = this.layer.querySelector('#hud-pos-num')!;
    this.lapValEl = this.layer.querySelector('#hud-lap-val')!;
    this.curTimeEl = this.layer.querySelector('#hud-cur-time')!;
    this.bestTimeEl = this.layer.querySelector('#hud-best-time')!;
    this.zoneNameEl = this.layer.querySelector('#hud-zone-name')!;
    this.camHintEl = this.layer.querySelector('#hud-cam-hint')!;
    this.centerBannerEl = this.layer.querySelector('#hud-center-banner')!;

    this.rpmArcEl = this.layer.querySelector('#hud-rpm-arc')!;
    this.rpmNeedleEl = this.layer.querySelector('#hud-rpm-needle')!;
    this.speedTextEl = this.layer.querySelector('#hud-speed-text')!;
    this.gearTextEl = this.layer.querySelector('#hud-gear-text')!;
    this.nitroArcEl = this.layer.querySelector('#hud-nitro-arc')!;
    this.nitroLabelEl = this.layer.querySelector('#hud-nitro-label')!;

    const mapCars = this.layer.querySelector('#minimap-cars')!;
    const svgNS = 'http://www.w3.org/2000/svg';
    this.aiDots = [];
    for (let i = 0; i < 5; i++) {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('r', '4.2');
      c.setAttribute('fill', '#e2e8f0');
      c.setAttribute('stroke', '#080c14');
      c.setAttribute('stroke-width', '1.4');
      mapCars.appendChild(c);
      this.aiDots.push(c);
    }
    const poly = document.createElementNS(svgNS, 'polygon');
    poly.setAttribute('points', '0,-7.5 5.5,6 0,3 -5.5,6');
    poly.setAttribute('fill', '#f5b952');
    poly.setAttribute('stroke', '#080c14');
    poly.setAttribute('stroke-width', '1.2');
    mapCars.appendChild(poly);
    this.playerArrow = poly;
  }

  setVisible(visible: boolean): void {
    this.layer.classList.toggle('hidden', !visible);
  }

  setCenterBanner(html: string): void {
    this.centerBannerEl.innerHTML = html;
  }

  update(
    player: VehiclePhysics,
    aiCars: VehiclePhysics[],
    position: number,
    totalLaps: number,
    zone: ZoneId,
    camMode: CameraMode
  ): void {
    const tel = player.telemetry;
    this.posNumEl.textContent = String(position);
    this.lapValEl.textContent = `${Math.min(player.lap, totalLaps)} / ${totalLaps}`;
    this.curTimeEl.textContent = formatRaceTime(player.currentLapTime);
    this.bestTimeEl.textContent = formatRaceTime(player.bestLapTime);
    this.zoneNameEl.textContent = ZONE_LABELS[zone];
    this.camHintEl.textContent =
      camMode === 'cockpit'
        ? 'COCKPIT VIEW · [C] CHASE · [SHIFT] NITRO'
        : 'CHASE CAM · [C] COCKPIT · [SHIFT] NITRO';

    // Update SVG Tachometer Arc & Needle
    const rpmFrac = clamp(tel.rpm / player.spec.maxRpm, 0, 1);
    const rpmEndDeg = -132 + Math.max(0.01, rpmFrac) * 240;
    this.rpmArcEl.setAttribute('d', describeArc(166, 134, 96, -132, rpmEndDeg));
    const needleRad = ((rpmEndDeg - 90) * Math.PI) / 180;
    this.rpmNeedleEl.setAttribute('x2', (166 + Math.cos(needleRad) * 86).toFixed(1));
    this.rpmNeedleEl.setAttribute('y2', (134 + Math.sin(needleRad) * 86).toFixed(1));

    this.speedTextEl.textContent = String(Math.round(tel.speedKmh));
    this.gearTextEl.textContent = tel.gear === 0 ? 'R' : String(tel.gear);

    // Update Curved Mini-Nitro Gauge
    const nitroFrac = clamp(tel.nitro, 0, 1);
    const nitroEndDeg = -126 + Math.max(0.01, nitroFrac) * 172;
    this.nitroArcEl.setAttribute('d', describeArc(166, 134, 114, -126, nitroEndDeg));
    this.nitroArcEl.setAttribute('stroke', tel.nitroActive ? '#ff9d2e' : 'url(#nitroGrad)');
    this.nitroLabelEl.textContent = tel.nitroActive ? 'BOOST!' : 'NITRO';
    this.nitroLabelEl.setAttribute('fill', tel.nitroActive ? '#ff9d2e' : '#22d3ee');

    // Update SVG Minimap markers
    for (let i = 0; i < this.aiDots.length && i < aiCars.length; i++) {
      const a = aiCars[i];
      const mx = this.mapOffX + (a.pos.x - this.mapMinX) * this.mapScale;
      const my = this.mapOffY + (a.pos.z - this.mapMinZ) * this.mapScale;
      this.aiDots[i].setAttribute('cx', mx.toFixed(1));
      this.aiDots[i].setAttribute('cy', my.toFixed(1));
    }
    const px = this.mapOffX + (player.pos.x - this.mapMinX) * this.mapScale;
    const py = this.mapOffY + (player.pos.z - this.mapMinZ) * this.mapScale;
    // yaw=0 faces -Z (up on minimap!), positive yaw rotates CCW (left -> negative SVG rotation)
    const svgDeg = (-player.yaw * 180) / Math.PI;
    this.playerArrow.setAttribute('transform', `translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${svgDeg.toFixed(1)})`);
  }
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = polarToCartesian(cx, cy, r, endDeg);
  const [ex, ey] = polarToCartesian(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? '0' : '1';
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}
