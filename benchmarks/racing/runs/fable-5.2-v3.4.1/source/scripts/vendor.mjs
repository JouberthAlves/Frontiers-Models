// Dev tool: copies the three.js runtime files the game imports from node_modules into lib/three,
// so the delivered site is fully static and offline (no bundler, no CDN).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'node_modules/three');
const DST = path.join(ROOT, 'lib/three');
const files = [
  ['build/three.module.js', 'three.module.js'],
  ['build/three.core.js', 'three.core.js'],
  ['LICENSE', 'LICENSE'],
  ['examples/jsm/csm/CSM.js', 'addons/csm/CSM.js'],
  ['examples/jsm/csm/CSMFrustum.js', 'addons/csm/CSMFrustum.js'],
  ['examples/jsm/csm/CSMShader.js', 'addons/csm/CSMShader.js'],
  ['examples/jsm/loaders/HDRLoader.js', 'addons/loaders/HDRLoader.js'],
];
for (const [from, to] of files) {
  const dst = path.join(DST, to);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(SRC, from), dst);
}
const pkg = JSON.parse(fs.readFileSync(path.join(SRC, 'package.json'), 'utf8'));
fs.writeFileSync(path.join(DST, 'VERSION.txt'), `three ${pkg.version} (MIT) - copied from node_modules by scripts/vendor.mjs\n`);
console.log(`vendored three ${pkg.version}: ${files.length} files`);
