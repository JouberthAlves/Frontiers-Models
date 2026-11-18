import { build } from 'esbuild';
import { mkdir, cp } from 'node:fs/promises';

await mkdir('build', { recursive: true });
await build({ entryPoints: ['src/main.js'], bundle: true, format: 'esm', target: 'es2022', outfile: 'build/game.js', minify: true, legalComments: 'eof' });
if (process.argv.includes('--dist')) {
  await mkdir('dist', { recursive: true });
  for (const file of ['index.html','style.css','track.json','build','assets','ASSET-LICENSES.md']) await cp(file, 'dist/' + file, { recursive: true });
}
