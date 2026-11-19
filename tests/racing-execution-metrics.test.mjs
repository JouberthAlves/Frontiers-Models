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
  for(const run of registry.runs.filter(r => !['fable-5.2-v3.4.1','gpt-astra-6.2-v3.4.1','gpt-6.2-sol-v3.5','gemini-4-neon-v3.5'].includes(r.id))) assert.equal(run.execution_metrics, undefined);
  assert.match(read('benchmarks/racing/' + m.details), /475,743,934/);
});
test('both README languages show Fable execution metrics and unknown prior values', () => {
  for (const p of ['README.md', 'README-PT-BR.md','benchmarks/racing/README.md','benchmarks/racing/README-PT-BR.md']) {
    const s=read(p);
    const row=s.split('\n').find(l=>l.startsWith('|') && l.includes('**Fable 5.2 (V3.4.1)**'));
    assert.ok(row, p);
    assert.match(row, /475[.,]74/);
    assert.match(row, /~11\s*h/);
    assert.match(s, /\| (?:Time|Tempo) \|/);
    assert.doesNotMatch(row, /15\s*h\s*33/);
    assert.match(s, /EXECUTION-METRICS\.md/);
    const other=s.split('\n').find(l=>l.startsWith('|') && l.includes('**Opus 5.5**') && l.includes('opus-5.5-v3.4/source/'));
    assert.match(other, /\| — \| — \|$/);
  }
});

test('Astra quota is not a token count and elapsed interval is not active time', () => {
 const m = registry.runs.find(r => r.id === 'gpt-astra-6.2-v3.4.1').execution_metrics;
 assert.equal(m.tokens, null);
 assert.equal(m.weekly_quota_percent, 21);
 assert.equal(m.quota_is_approximate, true);
 assert.equal(m.quota_reported_chat_weekly_percent, 21.55);
 assert.equal(m.quota_reported_astra_model_share_percent, 98);
 assert.equal(m.active_minutes_estimate, null);
 assert.equal(m.observed_elapsed_minutes, 302);
 assert.equal((Date.parse(m.observed_end_local)-Date.parse(m.observed_start_local))/60000, 302);
 assert.equal(m.final_verification_seconds, 170.198);
 for (const p of ['README.md','README-PT-BR.md','benchmarks/racing/README.md','benchmarks/racing/README-PT-BR.md']) {
  const s=read(p), row=s.split('\n').find(l => l.startsWith('|') && l.includes('**GPT-6.2 Astra (V3.4.1)**'));
  assert.ok(row && row.includes('](https://racing-gpt-6.2-astra.biel.dev.br/)'),p);
  assert.ok(row && row.includes('~21%\\*'),p);
  assert.ok(row.includes('02') || (p === 'README.md' && row.includes('~5h')),p);
  assert.ok(s.includes('Plus'),p);
 }
});

test('V3.5 resource metrics preserve confirmed quota and transcript totals',()=>{
 const n=registry.runs.find(r=>r.id==='gemini-4-neon-v3.5').execution_metrics;
 const s=registry.runs.find(r=>r.id==='gpt-6.2-sol-v3.5').execution_metrics;
 assert.equal(n.status,'local-transcript-verified');
 assert.equal(n.reported_total_execution_seconds,10999);
 assert.equal((Date.parse(n.delivered_at_utc)-Date.parse(n.started_at_utc))/1000,10999);
 assert.equal(n.tokens.input_uncached+n.tokens.output,4000360);
 assert.equal(n.token_subtotal_input_output,4000360);
 assert.equal(n.tokens.input_uncached+n.tokens.output+n.tokens.cache_read,33076190);
 assert.equal(n.tokens.total,33076190);
 assert.deepEqual(n.checkpoint_tokens,{input_uncached:389898,output:9118});
 assert.equal(n.model_calls,139);
 assert.equal(n.active_minutes_estimate,null);
 assert.equal(s.weekly_quota_percent,5.75);
 assert.equal(s.reported_execution_minutes,82);
 assert.equal(s.tokens,null);
 assert.equal(s.active_minutes_estimate,null);
 for(const p of ['README.md','README-PT-BR.md','benchmarks/racing/README.md','benchmarks/racing/README-PT-BR.md']){
  const lines=read(p).split('\n');
  assert.match(lines.find(l=>l.includes('**Gemini 4 Neon (V3.5)**')), /33[.,]08.*3h 03.*19s/);
  assert.match(lines.find(l=>l.includes('**GPT-6.2 Sol (V3.5)**')), /5[.,]75%.*1h 22/);
 }
});
