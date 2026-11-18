import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = p => readFileSync(p, 'utf8');
const registry = JSON.parse(read('benchmarks/racing/RUNS.json'));
test('Fable metrics are scoped to the benchmark, with explicit cache and time accounting', () => {
  const run = registry.runs.find(r => r.id === 'fable-5.2-v3.4.1');
  const m = run.execution_metrics;
  assert.equal(m.status, 'owner-reported-not-independently-verified');
  assert.deepEqual(m.excluded_models, ['Haiku 5.5', 'Sonnet 5.5']);
  assert.equal(m.scope, 'benchmark-only-target-model-until-delivery');
  assert.equal(m.model_calls, 817);
  assert.equal(m.wall_clock_minutes, (Date.parse(m.delivered_at_utc) - Date.parse(m.started_at_utc)) / 60000);
  assert.equal(m.wall_clock_minutes, 933);
  assert.equal(m.primary_time_metric, 'active_minutes_estimate');
  assert.equal(m.active_minutes_estimate, 660);
  assert.deepEqual(m.active_minutes_estimate_range, [582,714]);
  assert.ok(m.active_minutes_estimate_range[0] <= m.active_minutes_estimate && m.active_minutes_estimate <= m.active_minutes_estimate_range[1]);
  assert.ok(m.active_minutes_estimate_range[1] <= m.wall_clock_minutes);
  assert.deepEqual(m.tokens, {input_uncached:1654, output:1981943, cache_write:4531425, cache_read:469228912, total:475743934});
  const { total, ...parts } = m.tokens;
  assert.equal(total, Object.values(parts).reduce((a,b) => a+b,0));
  for(const run of registry.runs.filter(r => r.id !== 'fable-5.2-v3.4.1')) assert.equal(run.execution_metrics, undefined);
  assert.match(read('benchmarks/racing/' + m.details), /475,743,934/);
});
test('both README languages show Fable execution metrics and unknown prior values', () => {
  for (const p of ['README.md', 'README-PT-BR.md','benchmarks/racing/README.md','benchmarks/racing/README-PT-BR.md']) {
    const s=read(p);
    const row=s.split('\n').find(l=>l.startsWith('|') && l.includes('**Fable 5.2 (V3.4.1)**'));
    assert.ok(row, p);
    assert.match(row, /475[.,]74/);
    assert.match(row, /~11\s*h/);
    assert.match(s, /\| (?:Active time|Tempo ativo) \|/);
    assert.doesNotMatch(row, /15\s*h\s*33/);
    assert.match(s, /EXECUTION-METRICS\.md/);
    const other=s.split('\n').find(l=>l.startsWith('|') && l.includes('**GPT-6 Astra**'));
    assert.match(other, /\| — \| — \|$/);
  }
});
