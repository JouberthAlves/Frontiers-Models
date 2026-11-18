// Development-time tool (not part of the build or of `npm run verify`): downloads the CC0
// recordings listed in sources.json from Freesound (HQ previews), checks the licence on each
// sound page and decodes them to WAV with the browser's decoder, for build-samples.py.
//   node scripts/audio/fetch.mjs            -> .tmp/audio/raw/<key>.ogg, .tmp/audio/wav/<key>.wav
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const src = JSON.parse(fs.readFileSync(path.join(here, 'sources.json'), 'utf8'));
const raw = '.tmp/audio/raw', wav = '.tmp/audio/wav'; fs.mkdirSync(raw, { recursive: true });
const UA = { 'User-Agent': 'Mozilla/5.0 (asset download; CC0 sounds)' };
const meta = [];
for (const s of src.sounds) {
  const out = path.join(raw, s.key + '.ogg');
  const page = await (await fetch(`https://freesound.org/s/${s.id}/`, { headers: UA })).text();
  const cc0 = /creativecommons\.org\/publicdomain\/zero\/1\.0/.test(page);
  const mp3 = (page.match(/data-mp3="([^"]+)"/) || [])[1];
  const url = (page.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || `https://freesound.org/s/${s.id}/`;
  if (!cc0 || !mp3) { console.error(`SKIPPED ${s.key} (${s.id}): licence is not CC0 or no preview`); continue; }
  if (!fs.existsSync(out)) { const r = await fetch(mp3.replace('-lq.mp3', '-hq.ogg'), { headers: UA }); fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); }
  meta.push({ ...s, url, license: 'CC0 1.0', bytes: fs.statSync(out).size });
  console.log('ok', s.key.padEnd(14), s.id, (fs.statSync(out).size / 1024).toFixed(0) + ' kB', url);
}
fs.writeFileSync('.tmp/audio/fetched.json', JSON.stringify(meta, null, 1));
console.log(execFileSync('node', ['scripts/dev/audio-decode.mjs', raw, wav]).toString().split('\n').slice(-3).join('\n'));
