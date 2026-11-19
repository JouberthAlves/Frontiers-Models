import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // Dynamic gate entry points should never cause discovery to reload a running race.
  optimizeDeps: { noDiscovery: true },
  plugins: [{
    name: 'static-circuit',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'track.json',
        source: readFileSync(new URL('./track.json', import.meta.url)),
      });
    },
  }],
});
