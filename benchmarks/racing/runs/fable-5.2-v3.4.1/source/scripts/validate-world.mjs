// npm run validate — builds the world from track.json in Node and runs validateWorld().
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWorld, validateWorld } from '../src/world/world.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'track.json'), 'utf8'));
let populate = null;
try { ({ populateWorld: populate } = await import('../src/world/populate.js')); } catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; }
const world = buildWorld(json, { populate });
const res = validateWorld(world);
for (const [name, c] of Object.entries(res.checks)) {
  const { pass, violations, worst, ...rest } = c;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name.padEnd(28)} worst=${worst}  ${JSON.stringify(rest)}`);
}
console.log(`world built in ${world.timings.buildMs} ms, ${world.objects.length} objects`);
if (!res.ok) { console.error('\nvalidateWorld FAILED:\n  ' + res.errors.join('\n  ')); process.exit(1); }
console.log('validateWorld OK');

// density / composition audit (quotas of sections 4, 5.3 and 5.4)
const { auditWorld } = await import('../src/world/audit.js');
const audit = auditWorld(world);
console.log(`audit: props per 100 m (min) ${audit.props.min} | village: ${audit.village.unitsWithin30m} units within 30 m, fronts per window ${audit.village.windows.map((w) => w.fronts).join('/')}, ${audit.village.variations.length} variations | wood: trees per window ${audit.wood.windows.map((w) => w.trees).join('/')} | Z2 climb ${audit.cliffClimb} m, ${audit.cliffCurves} curves`);
if (process.argv.includes('--json')) { fs.mkdirSync(path.join(ROOT, '.tmp'), { recursive: true }); fs.writeFileSync(path.join(ROOT, '.tmp', 'audit.json'), JSON.stringify(audit, null, 1)); }
if (!audit.pass) { console.error('\naudit FAILED:\n  ' + audit.failures.join('\n  ')); process.exit(1); }
console.log('audit OK');
