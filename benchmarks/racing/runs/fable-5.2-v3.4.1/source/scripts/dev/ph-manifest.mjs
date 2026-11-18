// Dev tool: writes assets/polyhaven-sources.json (id, name, authors, page, licence) for every Poly Haven
// asset found under assets/textures and assets/hdri. Used to keep ASSET-LICENSES.md accurate.
import fs from 'node:fs';
import path from 'node:path';
const UA = { 'User-Agent': 'racing-bench-dev-tool' };
const ids = [...fs.readdirSync('assets/textures'), ...fs.readdirSync('assets/hdri').map((f) => f.replace(/_\dk\.hdr$/, ''))];
const out = [];
for (const id of ids) {
  const r = await fetch(`https://api.polyhaven.com/info/${id}`, { headers: UA });
  if (!r.ok) { console.error('no info for', id, r.status); continue; }
  const v = await r.json();
  const dir = fs.existsSync(`assets/textures/${id}`) ? `assets/textures/${id}` : 'assets/hdri';
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(id));
  out.push({ id, name: v.name, type: v.type === 0 ? 'hdri' : v.type === 1 ? 'texture' : 'model', authors: Object.keys(v.authors || {}), page: `https://polyhaven.com/a/${id}`, licence: 'CC0 1.0', files: files.map((f) => `${dir}/${f}`) });
}
fs.writeFileSync('assets/polyhaven-sources.json', JSON.stringify(out, null, 1));
console.log('wrote assets/polyhaven-sources.json with', out.length, 'assets');
