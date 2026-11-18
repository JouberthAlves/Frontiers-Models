// Dev tool (not used at runtime): query / download CC0 assets from Poly Haven (https://polyhaven.com, all assets CC0).
//   node scripts/dev/ph.mjs list hdris "sunrise-sunset"        -> ids with categories / tags
//   node scripts/dev/ph.mjs info <id>                           -> available files
//   node scripts/dev/ph.mjs get <id> <res> <dest dir> [maps..]  -> download texture maps (jpg) or hdri (hdr)
import fs from 'node:fs';
import path from 'node:path';
const API = 'https://api.polyhaven.com';
const UA = { 'User-Agent': 'racing-bench-dev-tool' };
const j = async (u) => { const r = await fetch(u, { headers: UA }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };
const [cmd, a, b, c, ...rest] = process.argv.slice(2);
if (cmd === 'list') {
  const all = await j(`${API}/assets?t=${a}${b ? `&c=${encodeURIComponent(b)}` : ''}`);
  const filter = c ? c.split(',') : [];
  for (const [id, v] of Object.entries(all)) {
    const tags = [...(v.categories || []), ...(v.tags || [])];
    if (filter.length && !filter.every((f) => tags.some((t) => t.includes(f)) || id.includes(f))) continue;
    console.log(id.padEnd(38), (v.categories || []).join(','), '|', (v.tags || []).slice(0, 8).join(','), v.evs_cap ? `| evs ${v.evs_cap}` : '');
  }
} else if (cmd === 'info') {
  const f = await j(`${API}/files/${a}`);
  const walk = (o, p) => { for (const [k, v] of Object.entries(o)) { if (v && v.url) console.log(p + k, v.size, v.url); else if (v && typeof v === 'object') walk(v, p + k + '/'); } };
  walk(f, '');
} else if (cmd === 'get') {
  const f = await j(`${API}/files/${a}`);
  const res = b, dest = c; fs.mkdirSync(dest, { recursive: true });
  const out = [];
  if (f.hdri) {
    const e = f.hdri[res].hdr; out.push([e.url, path.join(dest, path.basename(e.url))]);
  } else {
    const maps = rest.length ? rest : ['Diffuse', 'nor_gl', 'arm'];
    for (const m of maps) {
      const e = f[m]?.[res]?.jpg || f[m]?.[res]?.png; if (!e) { console.error('missing map', m, 'for', a, 'have', Object.keys(f).join(',')); continue; }
      out.push([e.url, path.join(dest, path.basename(e.url))]);
    }
  }
  for (const [url, file] of out) {
    const r = await fetch(url, { headers: UA }); if (!r.ok) throw new Error(`${r.status} ${url}`);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    console.log('saved', file, fs.statSync(file).size);
  }
}
