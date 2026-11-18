import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const id = 'fable-5.2-v3.4.1';
const dir = 'benchmarks/racing/';
const registry = JSON.parse(readFileSync(dir + 'RUNS.json'));
const run = registry.runs.find(x => x.id === id);
test('Fable 5.2 V3.4.1 replaces Sonnet; pinned tree and all 487 blobs preserved', () => {
  assert.ok(registry.current_arena.includes(id));
  assert.ok(registry.superseded_runs.includes('sonnet-5.5-v3.4'));
  assert.ok(!registry.current_arena.includes('sonnet-5.5-v3.4'));
  assert.equal(run.display_label, 'Fable 5.2 (V3.4.1)');
  assert.equal(run.prompt, 'prompts/racing-v3.4/racing-v3.4.1.md');
  assert.equal(run.source_commit, '6de1bddaae4b66868e0004098a5bce4132a6ee14');
  assert.equal(run.source_tree, 'fb67cb8a19667dd68abdae4cb800b6f8a66b7ab4');
  assert.equal(run.live_url, null);
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD:' + dir + run.archive_path], {encoding:'utf8'}).trim(), run.source_tree);
  const manifest = JSON.parse(readFileSync(dir + run.manifest));
  assert.equal(manifest.file_count, 487);
  assert.equal(manifest.files.length, 487);
  assert.equal(manifest.total_bytes, 387397734);
  assert.equal(manifest.source_commit, run.source_commit);
  assert.equal(manifest.source_tree, run.source_tree);
  const listing = execFileSync('git', ['ls-tree', '-r', '-z', 'HEAD:' + dir + run.archive_path], {encoding:'utf8'}).split('\0').filter(Boolean);
  assert.deepEqual(listing, manifest.files.map(f => f.mode + ' blob ' + f.git_blob_sha1 + '\t' + f.path));
  let total = 0;
  for (const f of manifest.files) {
    const blob = execFileSync('git', ['cat-file', 'blob', f.git_blob_sha1], {maxBuffer: 100*1024*1024});
    assert.equal(blob.length, f.bytes);
    assert.equal(createHash('sha256').update(blob).digest('hex'), f.sha256);
    total += blob.length;
  }
  assert.equal(total, manifest.total_bytes);
});
test('Fable has a model-named local link and plain model name in SVG and version in source links', () => {
  const svg = readFileSync('assets/frontier-models-hero-v7.svg','utf8');
  assert.ok(svg.includes('>Fable 5.2</text>'));
  assert.ok(!svg.includes('Fable 5.2 (V3.4.1)'));
  assert.ok(!svg.includes('Sonnet 5.5'));
  for (const p of ['README.md','README-PT-BR.md','benchmarks/racing/README.md','benchmarks/racing/README-PT-BR.md']) {
    const source = (p.startsWith('benchmarks/') ? './runs/' : './benchmarks/racing/runs/') + id + '/source/';
    assert.ok(readFileSync(p,'utf8').includes('[Fable 5.2 (V3.4.1)](' + source + ')'));
  }
});
