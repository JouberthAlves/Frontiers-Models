// Entry point: reads the URL options, shows the loading screen with real progress, starts the game.
//   ?q=low       start in the Low preset           ?dev=1   dev tools: free driving, no menus
//   ?auto=1      autopilot for the player (tests)   ?fps=1   FPS counter
//   ?car=gt|hatch  ?livery=0..5  ?laps=1|3|6  ?difficulty=easy|normal|hard   (otherwise the saved choices)
//   ?cap=60      frames on a fixed 60 Hz clock instead of the display's (verifier: comparable frame rates)

import { Game } from './game/game.js';
import { installDevApi } from './dev/api.js';

const params = Object.fromEntries(new URLSearchParams(location.search).entries());
const canvas = document.getElementById('gl');
const loading = document.getElementById('loading');
const bar = document.getElementById('loading-bar');
const label = document.getElementById('loading-label');
const pct = document.getElementById('loading-pct');

const game = new Game({ canvas, hudCanvas: document.getElementById('hud'), uiRoot: document.getElementById('ui'), params });
installDevApi(game);

// browsers only let the Web Audio graph start after a user gesture: the first key or click builds it
const unlock = () => {
  const a = game.audio; if (!a) return;
  if (!a.unlocked) a.unlock(); else if (a.ctx.state === 'suspended' && !document.hidden) a.ctx.resume().catch(() => {});
};
window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock);

game.load((text, f) => {
  bar.style.transform = `scaleX(${Math.max(0, Math.min(1, f))})`;
  label.textContent = text; pct.textContent = `${Math.round(f * 100)}%`;
}).then(() => {
  loading.classList.add('done');
  setTimeout(() => loading.remove(), 700);
  game.start();
}).catch((err) => {
  console.error(err);
  label.textContent = 'Falha ao carregar: ' + (err && err.message ? err.message : err);
  loading.classList.add('error');
  window.__loadError = String(err && err.stack ? err.stack : err);
});
