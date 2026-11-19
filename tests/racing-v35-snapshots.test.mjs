import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const base='benchmarks/racing/';
const registry=JSON.parse(readFileSync(base+'RUNS.json','utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
test('V3.5 exact prompt and 14 original reference blobs are pinned',()=>{
 const p=registry.prompts['racing-v3.5'];
 const b=readFileSync(base+p.path);
 assert.equal(registry.current_prompt,'racing-v3.5');
 assert.equal(b.length,45194);
 assert.equal(createHash('sha256').update(b).digest('hex'),'feb07b3f3bde403633e4b24cb2b2106a9aa24423d4af5f80f3f16cf9326dc874');
 assert.equal(git('rev-parse','HEAD:'+base+p.reference_directory),'7524fe4f8ab4aae5627111eabccf21f5da64f241');
 assert.equal(git('ls-tree','-r','HEAD:'+base+p.reference_directory).split('\n').length,14);
});
for(const [id,tree,count,bytes] of [
 ['gpt-6.2-sol-v3.5','1f58b8853028da4a11313384a7cb93cf1af883db',553,458536992],
 ['gemini-4-neon-v3.5','4ccc5fb42e260614b31684634839ee9befe0a59d',319,304909004]
])test(id+' preserves source and prompt association',()=>{
 const r=registry.runs.find(x=>x.id===id),m=JSON.parse(readFileSync(base+r.manifest));
 assert.ok(registry.current_arena.includes(id));
 assert.equal(r.source_tree,tree);
 assert.equal(git('rev-parse','HEAD:'+base+r.archive_path),tree);
 assert.equal(m.files.length,count);
 assert.equal(m.files.reduce((s,f)=>s+f.bytes,0),bytes);
 assert.equal(r.prompt,registry.prompts['racing-v3.5'].path);
 const url=id==='gpt-6.2-sol-v3.5'?'https://racing-gpt-6.2-sol.biel.dev.br/':'https://racing-gemini-4-neon.biel.dev.br/';
 assert.equal(r.live_url,url);
 assert.equal(r.site_url,url);
 for(const path of ['README.md','README-PT-BR.md',base+'README.md',base+'README-PT-BR.md']) {
  const row=readFileSync(path,'utf8').split('\n').find(l=>l.startsWith('|')&&l.includes(id+'/source/'));
  assert.ok(row?.includes(']('+url+')'),path);
 }
 assert.ok(r.execution_metrics);
 assert.equal(r.execution_metrics.active_minutes_estimate,null);
 const ls=execFileSync('git',['ls-tree','-r','-z','HEAD:'+base+r.archive_path],{encoding:'utf8'}).split('\0').filter(Boolean);
 assert.deepEqual(ls,m.files.map(f=>f.mode+' blob '+f.git_blob_sha1+'\t'+f.path));
});
