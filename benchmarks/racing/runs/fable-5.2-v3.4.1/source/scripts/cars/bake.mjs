// Dev-time bake of the two car bodies: implicit design -> meshes per material and LOD.
//   node scripts/cars/bake.mjs [gt|hatch] [--fast]
// Output: assets/cars/<id>.bin (all LODs) - loaded by src/render/car/car-loader.js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DESIGNS } from './designs.mjs';
import { buildCar } from './car-builder.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const fast = args.includes('--fast');
const ids = args.filter((a) => !a.startsWith('--'));
const LODS = fast ? [0.035] : [0.019, 0.038, 0.075];

for (const id of ids.length ? ids : Object.keys(DESIGNS)) {
  const D = DESIGNS[id];
  const header = { id, version: 1, lods: [], design: { axleF: D.axleF, axleR: D.axleR, wheelR: D.wheelR, exhausts: D.exhausts, bounds: D.bounds, gaps: D.gaps, decalSide: D.decalSide, decalTop: D.decalTop } };
  const chunks = []; let offset = 0;
  const push = (typed) => { const buf = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength); const pad = (4 - (buf.length % 4)) % 4; chunks.push(buf); if (pad) chunks.push(Buffer.alloc(pad)); const o = offset; offset += buf.length + pad; return o; };
  LODS.forEach((cell, li) => {
    const t0 = Date.now();
    const car = buildCar(D, cell);
    const lod = { cell, groups: [] }; let total = 0;
    for (const [name, m] of Object.entries(car.groups)) {
      if (!m.tri.length) continue;
      const pos = new Float32Array(m.pos); const nor = new Int8Array(m.nor.length / 3 * 4);
      for (let i = 0, j = 0; i < m.nor.length; i += 3, j += 4) { nor[j] = Math.round(m.nor[i] * 127); nor[j + 1] = Math.round(m.nor[i + 1] * 127); nor[j + 2] = Math.round(m.nor[i + 2] * 127); }
      const idx = new Uint32Array(m.tri);
      lod.groups.push({ name, vertices: pos.length / 3, triangles: idx.length / 3, pos: push(pos), nor: push(nor), idx: push(idx) });
      total += idx.length / 3;
    }
    lod.triangles = total; header.lods.push(lod);
    console.log(`${id} lod${li} cell ${cell} m: ${total} triangles in ${Date.now() - t0} ms  ${JSON.stringify(car.tris)}`);
  });
  const json = Buffer.from(JSON.stringify(header)); const jpad = (4 - (json.length % 4)) % 4;
  const head = Buffer.alloc(12); head.write('CARM', 0, 'ascii'); head.writeUInt32LE(1, 4); head.writeUInt32LE(json.length + jpad, 8);
  fs.mkdirSync(path.join(ROOT, 'assets/cars'), { recursive: true });
  const out = path.join(ROOT, `assets/cars/${id}.bin`);
  fs.writeFileSync(out, Buffer.concat([head, json, Buffer.alloc(jpad, 0x20), ...chunks]));
  console.log('wrote', out, (fs.statSync(out).size / 1e6).toFixed(2), 'MB');
}
