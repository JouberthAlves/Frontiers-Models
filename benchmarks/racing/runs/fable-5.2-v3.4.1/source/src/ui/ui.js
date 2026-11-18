// Menus and overlays (DOM): main menu, garage, race set-up, pause, settings, results.
// Works with mouse, keyboard (arrows, Enter, Esc) and gamepad (d-pad, A, B).

import { CAR_SPECS } from '../physics/car-specs.js';
import { CONTROLS_HELP } from '../game/input.js';
import { fmtTime } from '../core/math.js';

const el = (tag, attrs = {}, children = []) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
  for (const c of [].concat(children)) if (c) e.append(c);
  return e;
};
const CAR_INFO = {
  gt: { name: 'GT Coupé', desc: 'Cupê baixo de tração traseira. Mais potência e velocidade final; pede mão leve na saída das curvas.', stats: [['Potência', 0.92], ['Aderência', 0.8], ['Estabilidade', 0.66]] },
  hatch: { name: 'Hatch Esportivo', desc: 'Hatch de tração integral. Mais leve e dócil; sai mais forte das curvas lentas.', stats: [['Potência', 0.78], ['Aderência', 0.84], ['Estabilidade', 0.9]] },
};
const LAPS = [3, 6], DIFFS = [['easy', 'Fácil'], ['normal', 'Normal'], ['hard', 'Difícil']], QUALS = [['low', 'Baixa'], ['high', 'Alta']];

export class UI {
  constructor(root, game) {
    this.root = root; this.game = game; this.screen = null; this.node = null; this.focus = 0; this.stack = [];
    window.addEventListener('keydown', (e) => this._key(e));
  }

  get open() { return !!this.screen; }

  show(name, data = null) {
    if (this.node) this.node.remove();
    this.screen = name; this.node = null; this.focus = 0;
    if (!name) return;
    this.node = this['_' + name](data); this.root.append(this.node);
    const first = this.node.querySelector('[data-default]'); const items = this._items(); this.focus = Math.max(0, first ? items.indexOf(first) : 0); this._paint();
  }
  hide() { this.show(null); }

  // ------------------------------------------------------------------------------------------ navigation
  _items() { return this.node ? [...this.node.querySelectorAll('[data-nav]')] : []; }
  _paint() { this._items().forEach((n, i) => n.classList.toggle('focus', i === this.focus)); }
  _move(d) { const n = this._items().length; if (!n) return; this.focus = (this.focus + d + n) % n; this._paint(); this.game.audio.ui('move'); }
  _act(dir = 0) {
    const it = this._items()[this.focus]; if (!it) return;
    if (it.dataset.nav === 'opt') { if (dir !== 0) it.dispatchEvent(new CustomEvent('step', { detail: dir })); else it.dispatchEvent(new CustomEvent('step', { detail: 1 })); }
    else if (dir === 0) it.click();
  }
  _key(e) {
    if (!this.screen) return;
    const c = e.code;
    if (c === 'ArrowDown' || c === 'KeyS') { this._move(1); e.preventDefault(); }
    else if (c === 'ArrowUp' || c === 'KeyW') { this._move(-1); e.preventDefault(); }
    else if (c === 'ArrowLeft' || c === 'KeyA') { this._act(-1); e.preventDefault(); }
    else if (c === 'ArrowRight' || c === 'KeyD') { this._act(1); e.preventDefault(); }
    else if (c === 'Enter' || c === 'Space') { this._act(0); e.preventDefault(); }
    else if (c === 'Escape' || c === 'Backspace') { const b = this.node.querySelector('[data-back]'); if (b) b.click(); e.preventDefault(); }
  }
  /** gamepad actions forwarded by the game loop */
  pad(input) {
    if (!this.screen) return;
    if (input.take('down')) this._move(1); if (input.take('up')) this._move(-1);
    if (input.take('left_tap')) this._act(-1); if (input.take('right_tap')) this._act(1);
    if (input.take('confirm')) this._act(0);
    if (input.take('back')) { const b = this.node.querySelector('[data-back]'); if (b) b.click(); }
  }

  _btn(id, label, fn, extra = {}) { return el('button', { id, class: 'btn', 'data-nav': 'btn', ...extra, onclick: () => { this.game.audio.ui(extra['data-back'] !== undefined ? 'back' : 'confirm'); fn(); } }, [el('span', { text: label })]); }
  /** option row: label, value, left / right */
  _opt(id, label, values, get, set) {
    const val = el('span', { class: 'opt-value' }); const idx = () => Math.max(0, values.findIndex((v) => v[0] === get()));
    const paint = () => { val.textContent = values[idx()][1]; };
    const step = (d) => { const i = (idx() + d + values.length) % values.length; set(values[i][0]); paint(); this.game.audio.ui('move'); };
    const row = el('div', { id, class: 'opt', 'data-nav': 'opt' }, [el('span', { class: 'opt-label', text: label }), el('button', { class: 'opt-arrow', text: '‹', tabindex: -1, onclick: () => step(-1) }), val, el('button', { class: 'opt-arrow', text: '›', tabindex: -1, onclick: () => step(1) })]);
    row.addEventListener('step', (e) => step(e.detail)); row.refresh = paint; paint(); return row;
  }
  _slider(id, label, get, set) {
    const fill = el('div', { class: 'slider-fill' }); const num = el('span', { class: 'opt-value' });
    const paint = () => { fill.style.width = `${Math.round(get() * 100)}%`; num.textContent = `${Math.round(get() * 100)}`; };
    const step = (d) => { set(Math.max(0, Math.min(1, Math.round((get() + d * 0.1) * 10) / 10))); paint(); this.game.audio.ui('move'); };
    const bar = el('div', { class: 'slider' }, [fill]);
    bar.addEventListener('click', (e) => { const r = bar.getBoundingClientRect(); set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); paint(); });
    const row = el('div', { id, class: 'opt', 'data-nav': 'opt' }, [el('span', { class: 'opt-label', text: label }), el('button', { class: 'opt-arrow', text: '‹', tabindex: -1, onclick: () => step(-1) }), bar, num, el('button', { class: 'opt-arrow', text: '›', tabindex: -1, onclick: () => step(1) })]);
    row.addEventListener('step', (e) => step(e.detail)); paint(); return row;
  }

  // ------------------------------------------------------------------------------------------ screens
  _menu() {
    const g = this.game;
    return el('div', { class: 'screen menu' }, [
      el('div', { class: 'brand' }, [el('div', { class: 'brand-title', text: 'COSTA DOURADA' }), el('div', { class: 'brand-sub', text: 'circuito costeiro · seis carros · pôr do sol' })]),
      el('div', { class: 'col' }, [
        this._btn('btn-play', 'Correr', () => g.goGarage(), { 'data-default': '' }),
        this._btn('btn-settings', 'Configurações', () => { this.stack.push('menu'); this.show('settings'); }),
      ]),
      el('div', { class: 'hint', text: 'Setas / WASD para navegar e dirigir · Enter confirma · Esc volta' }),
    ]);
  }

  _garage() {
    const g = this.game; const o = g.options;
    const name = el('div', { class: 'car-name' }), desc = el('div', { class: 'car-desc' }), stats = el('div', { class: 'stats' }), sw = el('div', { class: 'swatches' }), col = el('div', { class: 'car-colour' });
    let car = null, colour = null;
    const paint = () => {
      if (car) { car.refresh(); colour.refresh(); }
      const info = CAR_INFO[o.car]; name.textContent = info.name; desc.textContent = info.desc; stats.replaceChildren(...info.stats.map(([l, v]) => el('div', { class: 'stat' }, [el('span', { text: l }), el('div', { class: 'stat-bar' }, [el('i', { style: `width:${Math.round(v * 100)}%` })])])));
      [...sw.children].forEach((n, i) => n.classList.toggle('on', i === o.livery)); col.textContent = g.liveries[o.livery].name;
    };
    g.liveries.forEach((l, i) => sw.append(el('button', { class: 'swatch', id: 'swatch-' + i, title: l.name, style: `background:#${l.color.toString(16).padStart(6, '0')}`, onclick: () => { g.setPlayerCar(o.car, i); paint(); g.audio.ui('move'); } })));
    car = this._opt('opt-car', 'Carro', Object.keys(CAR_SPECS).map((k) => [k, CAR_INFO[k].name]), () => o.car, (v) => { g.setPlayerCar(v, o.livery); paint(); });
    colour = this._opt('opt-colour', 'Cor', g.liveries.map((l, i) => [i, l.name]), () => o.livery, (v) => { g.setPlayerCar(o.car, v); paint(); });
    paint();
    return el('div', { class: 'screen garage' }, [
      el('div', { class: 'head', text: 'Garagem' }),
      el('div', { class: 'panel' }, [name, desc, stats, car, colour, sw, col,
        el('div', { class: 'row' }, [this._btn('btn-garage-back', 'Voltar', () => g.goMenu(), { 'data-back': '' }), this._btn('btn-garage-next', 'Continuar', () => g.goSetup(), { 'data-default': '' })])]),
    ]);
  }

  _setup() {
    const g = this.game; const o = g.options;
    return el('div', { class: 'screen setup' }, [
      el('div', { class: 'head', text: 'Corrida' }),
      el('div', { class: 'panel' }, [
        this._opt('opt-laps', 'Voltas', LAPS.map((n) => [n, String(n)]), () => o.laps, (v) => { o.laps = v; g.saveOptions(); }),
        this._opt('opt-difficulty', 'Dificuldade', DIFFS, () => o.difficulty, (v) => { o.difficulty = v; g.saveOptions(); }),
        this._opt('opt-quality', 'Qualidade', QUALS, () => g.qualityId, (v) => g.setQuality(v)),
        el('div', { class: 'note', text: 'Circuito de 3,37 km · 5 rivais · largada parada' }),
        el('div', { class: 'row' }, [this._btn('btn-setup-back', 'Voltar', () => g.goGarage(), { 'data-back': '' }), this._btn('btn-start', 'Largar', () => g.startRace(), { 'data-default': '' })]),
      ]),
    ]);
  }

  _pause() {
    const g = this.game;
    return el('div', { class: 'screen pause' }, [
      el('div', { class: 'panel narrow' }, [el('div', { class: 'head small', text: 'Pausa' }),
        this._btn('btn-resume', 'Continuar', () => g.resume(), { 'data-default': '', 'data-back': '' }),
        this._btn('btn-restart', 'Reiniciar', () => g.restartRace()),
        this._btn('btn-pause-settings', 'Configurações', () => { this.stack.push('pause'); this.show('settings'); }),
        this._btn('btn-quit', 'Menu', () => g.goMenu()),
      ]),
    ]);
  }

  _settings() {
    const g = this.game; const back = () => this.show(this.stack.pop() || 'menu');
    return el('div', { class: 'screen settings' }, [
      el('div', { class: 'panel wide' }, [el('div', { class: 'head small', text: 'Configurações' }),
        this._opt('set-quality', 'Qualidade', QUALS, () => g.qualityId, (v) => g.setQuality(v)),
        this._slider('set-master', 'Volume geral', () => g.audio.volumes.master, (v) => g.setVolume('master', v)),
        this._slider('set-sfx', 'Efeitos', () => g.audio.volumes.sfx, (v) => g.setVolume('sfx', v)),
        this._slider('set-music', 'Música', () => g.audio.volumes.music, (v) => g.setVolume('music', v)),
        el('div', { class: 'controls' }, [el('div', { class: 'controls-head' }, [el('span', { text: 'Controles' }), el('span', { text: 'Teclado' }), el('span', { text: 'Controle' })]),
          ...CONTROLS_HELP.map(([a, k, p]) => el('div', { class: 'controls-row' }, [el('span', { text: a }), el('span', { text: k }), el('span', { text: p })]))]),
        this._btn('btn-settings-back', 'Voltar', back, { 'data-back': '', 'data-default': '' }),
      ]),
    ]);
  }

  _results(res) {
    const g = this.game; const me = res.find((r) => r.isPlayer);
    const rows = res.map((r) => el('div', { class: 'res-row' + (r.isPlayer ? ' me' : '') }, [
      el('span', { class: 'res-pos', text: String(r.place) }), el('span', { class: 'res-name', text: r.name }), el('span', { class: 'res-car', text: CAR_INFO[r.car].name }),
      el('span', { class: 'res-time', text: fmtTime(r.time, r.projected) }), el('span', { class: 'res-best', text: r.best === null ? '—' : fmtTime(r.best) })]));
    return el('div', { class: 'screen results' }, [
      el('div', { class: 'panel wide' }, [
        el('div', { class: 'head small', text: me.place === 1 ? 'Vitória!' : `Chegada em ${me.place}º` }),
        el('div', { class: 'res-row res-head' }, [el('span', { text: 'Pos' }), el('span', { text: 'Piloto' }), el('span', { text: 'Carro' }), el('span', { text: 'Tempo' }), el('span', { text: 'Melhor volta' })]),
        ...rows,
        el('div', { class: 'note', text: '≈ tempo projetado para quem ainda estava na pista quando você cruzou a linha' }),
        el('div', { class: 'row' }, [this._btn('btn-menu', 'Menu', () => g.goMenu(), { 'data-back': '' }), this._btn('btn-again', 'Correr de novo', () => g.restartRace(), { 'data-default': '' })]),
      ]),
    ]);
  }
}
