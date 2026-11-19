import fs from 'node:fs';
import path from 'node:path';

const distHtmlPath = path.resolve('dist/src/app.html');
const fallbackDistHtmlPath = path.resolve('dist/app.html');
const srcPath = fs.existsSync(distHtmlPath) ? distHtmlPath : fallbackDistHtmlPath;

if (!fs.existsSync(srcPath)) {
  throw new Error(`Expected built HTML at ${distHtmlPath} or ${fallbackDistHtmlPath}`);
}

let html = fs.readFileSync(srcPath, 'utf8');
// Single-pass rewrite of relative dist paths (../../app.js, ../app.js, ./app.js) -> ./dist/app.js
html = html.replace(/(src|href)="(?:\.\.\/)+|\.\/(?!dist\/)/g, (m, attr) =>
  attr ? `${attr}="./dist/` : './dist/'
);
html = html.replace(/(src|href)="\.\/(?!dist\/)/g, '$1="./dist/');

fs.writeFileSync(path.resolve('index.html'), html, 'utf8');
console.log('[sync-root-index] Wrote root index.html:');
console.log(html.trim());
