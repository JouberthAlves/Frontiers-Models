import './styles/main.css';
import { CostaDoradaGame } from './game';

async function bootstrap() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud-root') as HTMLElement;
  const uiRoot = document.getElementById('ui-root') as HTMLElement;

  const game = new CostaDoradaGame(canvas, hudRoot, uiRoot);
  try {
    await game.init();
  } catch (err) {
    console.error('[CostaDoradaGP] Fatal startup error:', err);
    uiRoot.innerHTML = `<div class="loading-wrap"><div class="brand-title" style="font-size:32px;">INITIALIZATION ERROR</div><pre style="margin-top:16px;color:#f87171;max-width:720px;white-space:pre-wrap;">${String(
      err
    )}</pre></div>`;
  }
}

void bootstrap();
