import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const id = 'gemini-4-hydrogen-v3.4';
const runRoot = resolve(root, 'benchmarks/racing/runs', id);
const snapshot = resolve(runRoot, 'source');
const catalog = JSON.parse(readFileSync(resolve(root, 'benchmarks/racing/RUNS.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(resolve(runRoot, 'SOURCE-FILES.json'), 'utf8'));
const hash = (algorithm, bytes) => createHash(algorithm).update(bytes).digest('hex');

function walk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = prefix ? prefix + '/' + entry.name : entry.name;
    const full = join(dir, entry.name);
    assert.equal(entry.isSymbolicLink(), false, 'symlink not allowed: ' + name);
    if (entry.isDirectory()) return walk(full, name);
    assert.ok(entry.isFile(), 'unexpected file type: ' + name);
    return [name];
  }).sort();
}

test('Gemini 4 Hydrogen V3.4: complete 319-file, byte-exact upstream source snapshot', () => {
  const run = catalog.runs.find(item => item.id === id);
  assert.ok(run && catalog.current_arena.includes(id));
  assert.equal(run.model, 'Gemini 4 Hydrogen');
  assert.equal(run.live_url, 'https://racing-gemini-4-hydrogen.biel.dev.br/');
  assert.equal(run.site_url, run.live_url);
  assert.equal(run.site_status, 'owner-provided-url-reachability-not-independently-verified');
  assert.equal(run.source_repository, null);
  assert.equal(run.gameplay_verification, 'not-independently-verified');
  assert.equal(run.archival_status, 'complete-tracked-git-snapshot-no-history-bundle');
  assert.equal(run.git_bundle, null);
  assert.equal(run.source_commit, 'dd66f1157269126af067faacef0e7f1725d3c7d6');
  assert.equal(run.source_tree, '40ed6333751c590955985b1b197175ee5aa984aa');
  assert.equal(manifest.format, 'git-blob-byte-exact-v1');
  assert.equal(manifest.source_repository, null);
  assert.equal(manifest.source_commit, run.source_commit);
  assert.equal(manifest.source_tree, run.source_tree);
  assert.equal(manifest.file_count, 319);
  assert.equal(manifest.total_bytes, 379164707);
  assert.deepEqual(manifest.lfs_pointer_paths, []);
  assert.equal(manifest.repository_bundle, null);
  assert.equal(manifest.files.length, 319);
  assert.equal(run.source_file_count, manifest.file_count);
  assert.equal(run.source_bytes, manifest.total_bytes);

  const seen = new Set();
  let bytesTotal = 0;
  for (const file of manifest.files) {
    assert.ok(file.path && !file.path.startsWith('/') &&
      file.path.split('/').every(part => part && part !== '.' && part !== '..') &&
      !file.path.includes('\\'), 'unsafe path: ' + file.path);
    assert.ok(!seen.has(file.path), 'duplicate: ' + file.path);
    seen.add(file.path);
    assert.ok(file.mode === '100644' || file.mode === '100755', 'unexpected file mode: ' + file.path);
    const path = resolve(snapshot, ...file.path.split('/'));
    assert.ok(path.startsWith(snapshot + sep), 'path outside snapshot');
    assert.ok(lstatSync(path).isFile(), file.path);
    const data = readFileSync(path);
    assert.equal(data.length, file.bytes, file.path);
    assert.equal(hash('sha256', data), file.sha256, file.path);
    const gitHeader = Buffer.from('blob ' + data.length + '\0');
    assert.equal(hash('sha1', Buffer.concat([gitHeader, data])), file.git_blob_sha1, file.path);
    bytesTotal += data.length;
  }
  assert.equal(bytesTotal, manifest.total_bytes);
  assert.deepEqual(walk(snapshot), [...seen].sort());
  const provenance = readFileSync(resolve(runRoot, 'SOURCE-PROVENANCE.md'), 'utf8');
  assert.match(provenance, /319 files/);
  assert.match(provenance, /source\/\]\(\.\/source\/\)/);
  assert.doesNotMatch(provenance, /github\.com\/bielxdh3\/gemini-mvp/);
});

test('Gemini 4 Hydrogen has the owner-provided gameplay URL and locally archived model-named source', () => {
  for (const path of ['README.md', 'README-PT-BR.md',
    'benchmarks/racing/README.md', 'benchmarks/racing/README-PT-BR.md']) {
    const text = readFileSync(resolve(root, path), 'utf8');
    const prefix = path.startsWith('benchmarks/racing/') ? './runs/' : './benchmarks/racing/runs/';
    assert.ok(text.includes('[Gemini 4 Hydrogen](' + prefix + id + '/source/)'), path);
    assert.ok(text.includes('](https://racing-gemini-4-hydrogen.biel.dev.br/)'), path + ' missing owner-provided game URL');
    assert.ok(!text.includes('github.com/bielxdh3/gemini-mvp'), path);
  }
});
