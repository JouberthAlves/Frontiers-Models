import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const watch = process.argv.includes('--watch');
fs.mkdirSync('build', { recursive: true });

const ctx = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'build/app.js',
  format: 'esm',
  target: 'es2022',
  sourcemap: true,
  minify: !watch,
  logLevel: 'info',
  loader: {
    '.wasm': 'binary',
  },
});

if (watch) {
  await ctx.watch();
  console.log('Watching src/...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log('Build complete: build/app.js');
}
