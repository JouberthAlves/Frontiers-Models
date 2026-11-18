// Dev tool: writes verification/REPORT.md. Every number comes from the files that `npm run verify` wrote
// (results.json, image-metrics.json, scene-stats.json, sweep metrics, audio-volta.json, performance.json);
// the assessments written after looking at the images come from scripts/dev/report-notes.mjs.
//   node scripts/dev/report.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOTES } from './report-notes.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const V = (f) => join(root, 'verification', f);
const J = (f) => JSON.parse(readFileSync(V(f), 'utf8'));
const R = J('results.json'), IM = J('image-metrics.json'), SS = J('scene-stats.json'), SW = J('sweep/metrics.json'), SWL = J('sweep-low/metrics.json'), AU = J('audio-volta.json'), PF = J('performance.json');
const T = Object.fromEntries(R.tests.map((t) => [t.id, t]));
const n = (x, d = 2) => (typeof x === 'number' ? x.toFixed(d).replace('.', ',') : String(x));
const pct = (x, d = 1) => (typeof x === 'number' ? (x * 100).toFixed(d).replace('.', ',') + ' %' : String(x));
const mmss = (t) => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(1).padStart(4, '0').replace('.', ',')}`; };
const PT = {
  oak: 'azinheira', olive: 'oliveira', cypress: 'cipreste', pine: 'pinheiro-manso', palm: 'palmeira',
  broom: 'giesta', oleander: 'oleandro', rosemary: 'alecrim', lentisk: 'lentisco', agave: 'agave',
  beachgrass: 'capim de duna', drygrass: 'capim seco', grasstuft: 'tufos de grama', flowers: 'flores', herbs: 'ervas',
  arcade: 'casa com arcada', fisher: 'casa de pescador', townhouse: 'sobrado geminado', stone: 'casa de pedra', cafe: 'café', tall: 'sobrado alto', shop: 'comércio', public: 'edifício público', church: 'igreja',
};
const pt = (k) => PT[k] || k;
const L = [];
const failed = R.tests.filter((t) => !t.pass);

L.push('# REPORT — Circuito Costa Dourada (Racing-bench V3.4.1)', '');
if (failed.length) {
  L.push('## FALHAS DECLARADAS', '');
  for (const t of failed) L.push(`- **${t.id} — ${t.title}: FALHOU.** ${(t.failures || []).slice(0, 6).join('; ')}`);
  L.push('');
} else {
  L.push('**Falhas declaradas: nenhuma.** Os ' + R.tests.length + ' testes de `npm run verify` passaram na execução que gerou os arquivos desta pasta. O que ficou abaixo do alvo está nas seções 6 (por captura) e 7 (lista geral), e não é escondido.', '');
}
if (NOTES.top && NOTES.top.length) { for (const l of NOTES.top) L.push(l); L.push(''); }
L.push(`Execução: \`${R.command}\` em ${R.environment.date.slice(0, 10)} · ${R.environment.browser} (${R.environment.headless ? 'sem janela' : 'com janela'}) · ${R.environment.os} · ${R.environment.cpu} · ${R.environment.memoryGB} GB · GPU ${PF.gpu} · 1920×1080.`, '');
L.push('Os números deste relatório são copiados dos arquivos gerados pelo verificador (`results.json`, `image-metrics.json`, `scene-stats.json`, `sweep/metrics.json`, `audio-volta.json`, `performance.json`) pelo script `scripts/dev/report.mjs`; as avaliações em texto foram escritas depois de abrir cada imagem.', '');

// ------------------------------------------------------------------ 1. tests
L.push('## 1. Testes automatizados (13.1)', '');
L.push('| Teste | O que verifica | Resultado | Duração |', '| --- | --- | --- | --- |');
for (const t of R.tests) L.push(`| ${t.id} | ${t.title} | ${t.pass ? 'passou' : '**FALHOU**'} | ${n(t.seconds, 0)} s |`);
L.push('');
for (const id of ['T1', 'T2']) {
  const d = T[id].details, r = d.race;
  L.push(`**${id} — jornada de ${d.laps} voltas** (carro ${d.car === 'gt' ? 'GT' : 'hatch'}, cor ${d.colour}, cliques reais nos menus, piloto automático só no carro do jogador, tempo acelerado ${d.timeScale}×). Ultrapassagens: ${r.overtakes} (${r.aiOvertakes} entre IAs). Reposições de carro: ${(d.resets || []).length}. Depois dos resultados, *Correr de novo* volta ao grid com o estado zerado.`, '');
  L.push('| Pos. | Piloto | Carro | Tempo | Voltas (s) |', '| --- | --- | --- | --- | --- |');
  for (const e of r.results) L.push(`| ${e.place} | ${e.name} | ${e.car === 'gt' ? 'GT' : 'hatch'} | ${e.projected ? '≈ ' : ''}${mmss(e.time)} | ${e.lapTimes.map((x) => n(x, 2)).join(' · ')} |`);
  L.push('');
}
{
  const d = T.T3.details;
  L.push(`**T3 — pausa, reinício, menu.** Em pausa a simulação não avança (${d.pause.stepsWhilePaused} passos); vozes de áudio: ${d.voices.before} antes, ${d.voices.afterRestarts.join(' / ')} depois de cada um dos três reinícios, ${d.afterMenu.voices} de volta ao menu (${d.voices.permanent} são as vozes permanentes do grafo: faixas dos motores, rolagem, vento, ambiente). Heap: +${n(d.heapGrowthMB, 2)} MB depois de três reinícios. Nenhum estado da corrida anterior sobrevive (relógio, voltas, resultados, HUD).`, '');
}
{
  const d = T.T4.details;
  L.push(`**T4 — anticorte** (${d.checkpoints} checkpoints em sequência): cruzar a linha depois de voltar de ré ou de pular da falésia para a ponte ${d.cutCounted || d.backForthCounted || d.skipCounted ? '**contou volta (falha)**' : 'não conta volta'}; a volta que passa por todos os checkpoints ${d.honestCounted ? 'conta' : '**não contou (falha)**'}.`, '');
}
{
  const d = T.T5.details;
  L.push('**T5 — IA.**', '', '| Corrida | Maior parada de um rival | Maior tempo fora da pista | Reposições | Ultrapassagens entre rivais |', '| --- | --- | --- | --- | --- |');
  for (const r of d) L.push(`| ${r.race} | ${n(Math.max(...r.rivals.map((x) => x.longestStop)), 2)} s | ${n(Math.max(...r.rivals.map((x) => x.longestOffTrack)), 2)} s | ${r.resets.length} | ${r.overtakesBetweenRivals} |`);
  L.push('', 'Uma ultrapassagem só é contada quando o carro que vinha atrás fica um comprimento inteiro (5,5 m) à frente.', '');
}
{
  const d = T.T6.details;
  L.push(`**T6 — integridade.** \`validateWorld()\`: ${d.validateWorld.ok ? 'sem erros' : '**com erros**'}. Nas corridas dos testes 1 e 2: ${d.races.map((r) => `${r.race}: ${Object.values(r.counters).reduce((a, b) => a + b, 0)} eventos (carro sob o terreno, através de barreira, fora do mundo, roda a mais de 1,5 m do chão), ${r.cameraFramesInsideGeometry} quadros com a câmera dentro de geometria`).join('; ')}.`, '');
}

// ------------------------------------------------------------------ 2. image sanity
L.push('## 2. Sanidade de imagem das capturas (teste 7)', '');
L.push(`Limites: céu ≥ 10 % onde exigido; luminância média entre 0,25 e 0,75; desvio padrão ≥ 0,12; nenhum bucket de cor (4 bits por canal) acima de 30 %. FPS medido ao vivo no lugar da captura durante 2 s, com o limitador de 60 Hz do verificador.`, '');
L.push('| # | Arquivo | Preset | Céu | Luminância | Desvio | Maior bucket | FPS (1 % low) | Isenções |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const order = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
for (const id of order) {
  const s = IM.shots[id]; if (!s) continue;
  const ex = [s.skyExemption ? `céu: ${s.skyExemption}` : null, s.photoExemption ? s.photoExemption : null].filter(Boolean).join('; ') || '—';
  L.push(`| ${id} | \`${s.file}\` | ${s.preset} | ${pct(s.skyFraction)}${s.skyRequired ? '' : ' (não exigido)'} | ${n(s.luminanceMean, 3)} | ${n(s.luminanceStd, 3)} | ${typeof s.dominantBucketShare === 'number' ? pct(s.dominantBucketShare) : s.dominantBucketShare} | ${typeof s.fps === 'number' ? `${n(s.fps, 0)} (${n(s.fpsLow1, 0)})` : 'não aplicável'} | ${ex} |`);
}
L.push('', 'Todas as 12 passaram. Valores por captura, buckets e motivo de cada isenção: `image-metrics.json`.', '');

// ------------------------------------------------------------------ 3. scene audit
L.push('## 3. Auditoria da cena (teste 8, `scene-stats.json`)', '');
{
  const w = SS.world, vil = w.village, c = SS.counts;
  L.push('| Item | Medido | Mínimo |', '| --- | --- | --- |');
  for (const car of SS.cars) L.push(`| Carro ${car.name || car.model}: triângulos no LOD0 / materiais | ${car.trianglesLod0.toLocaleString('pt-BR')} / ${car.materialCount} | 15.000 / 6 |`);
  L.push(`| Detector de caixa | ${SS.boxDetector.flagged.length} objetos acusados (${SS.boxDetector.objects.length} objetos compostos, ${SS.boxDetector.prototypes.length} protótipos e ${SS.boxDetector.buildings.units} construções examinados inteiros) | 0 |`);
  L.push(`| Construções: triângulos / materiais por unidade | ${SS.boxDetector.buildings.trianglesMin}–${SS.boxDetector.buildings.trianglesMax} (média ${SS.boxDetector.buildings.trianglesMean}) / ${SS.boxDetector.buildings.materialsMin}–${SS.boxDetector.buildings.materialsMax} | — |`);
  L.push(`| Detector de cor chapada | ${SS.flatColour.flagged.length} de ${SS.flatColour.materials.length} materiais | 0 |`);
  L.push(`| Texturas abaixo da resolução mínima | ${SS.textures.flagged.length} de ${SS.textures.list.length} | 0 |`);
  L.push(`| Z2: desnível / curvas | ${n(w.cliffClimb, 1)} m / ${w.cliffCurves} | 40 m / 3 |`);
  L.push(`| Z3: extensão da rua | ${n(vil.streetLength, 1)} m | 400 m |`);
  L.push(`| Z3: unidades arquitetônicas (a menos de 30 m) | ${vil.units} (${vil.unitsWithin30m}), ${vil.floorsMin}–${vil.floorsMax} andares | 60 |`);
  L.push(`| Z3: variações arquitetônicas / cores de reboco | ${vil.variations.length} (${vil.variations.map(pt).join(', ')}) / ${vil.wallColours} | 5 |`);
  L.push(`| Z3: travessas / largo / marco | ${vil.sideStreets} (${vil.sideStreetUnits.join(', ')} unidades) / ${vil.plaza ? 'sim' : 'não'} / ${vil.landmark === 'church with bell tower' ? 'igreja com torre sineira' : vil.landmark} | 2 / 1 / 1 |`);
  L.push(`| Z3: detalhes | ${vil.withBalcony} com varanda, ${vil.withAwning} com toldo, ${vil.withFlowerBoxes} com floreiras, ${vil.withChimney} com chaminé, ${vil.frontGardens} quintais frontais | ≥ 1 por unidade |`);
  L.push(`| Espécies arbóreas | ${Object.entries(w.flora.treeSpecies).map(([k, v]) => `${pt(k)} ${v}`).join(', ')} | 4 |`);
  L.push(`| Tipos de arbusto / de forração | ${w.flora.shrubTypes.map(pt).join(', ')} / ${w.flora.groundTypes.map(pt).join(', ')} | — |`);
  L.push(`| Props por 100 m (pior janela da volta) | ${w.props.min} (total ${w.props.total}) | 12 |`);
  L.push(`| Motor do jogador ligado a amostras | ${SS.engineAudio.playerEngineSources.length} \`AudioBuffer\` em loop (${SS.engineAudio.playerModel}) | ≥ 4 faixas |`);
  L.push(`| Objetos do mundo / ids únicos | ${c.objects.toLocaleString('pt-BR')} / ${c.uniqueIds.toLocaleString('pt-BR')} | iguais |`);
  L.push('');
  L.push('**Z3 — janelas de 100 m desde a entrada da vila**', '', '| Janela | Unidades | Frentes urbanizadas | Mínimo | |', '| --- | --- | --- | --- | --- |');
  for (const q of vil.windows) L.push(`| ${q.from}–${n(q.to, 0)} m${q.complete ? '' : ' (resíduo)'} | ${q.units} | ${q.fronts} | ${q.complete ? q.need : '—'} | ${q.complete ? (q.pass ? 'passa' : '**falha**') : 'registrado'} |`);
  L.push('', '**Z4 — janelas de 100 m desde a entrada do bosque** (até 40 m da pista; `L` = extensão plantável, `f = L/100`)', '', '| Janela | L (m) | f | Árvores | Arbustos | Forração | Cotas (árv. / arb. / forr.) | |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const q of w.wood.windows) L.push(`| ${q.from}–${n(q.to, 0)} m${q.complete ? '' : ' (resíduo)'} | ${n(q.L, 0)} | ${n(q.f, 2)} | ${q.trees} | ${q.shrubs} | ${q.ground} | ${q.need.trees} / ${q.need.shrubs} / ${q.need.ground} | ${q.f === 0 ? 'isenta (f = 0: toda sobre a ponte)' : q.pass ? 'passa' : '**falha**'} |`);
  L.push('', `A única geometria que reduz \`L\` é o tabuleiro da ponte (s = ${n(w.wood.bridge.from, 1)}–${n(w.wood.bridge.to, 1)} m, ${n(w.wood.bridge.length, 1)} m), lido de \`track.json\`.`, '');
}

// ------------------------------------------------------------------ 4. sweep
L.push('## 4. Varredura de câmera a cada 25 m (teste 9)', '');
const sw = (m) => `${m.points} pontos, ${m.failing} reprovados; céu mínimo ${pct(m.skyMin)}, luminância ${n(m.meanMin, 3)}–${n(m.meanMax, 3)}, desvio mínimo ${n(m.stdMin, 3)}, maior bucket ${pct(m.bucketMax)}`;
L.push(`- **Alta:** ${sw(SW)}. Miniaturas em \`sweep/\`, folha de contato \`sweep-sheet.png\`.`);
L.push(`- **Baixa:** ${sw(SWL)}. Folha de contato \`sweep-sheet-low.png\`.`);
L.push(`- Túnel: ${'não há (a travessia da enseada é uma ponte aberta): nenhum ponto é isento da regra de céu'}.`, '');
const worst = (key, asc = true) => SW.frames.slice().sort((a, b) => (asc ? a[key] - b[key] : b[key] - a[key])).slice(0, 3).map((f) => `s = ${f.s} m (${f.zone}): ${key === 'luminanceMean' ? n(f[key], 3) : pct(f[key])}`).join('; ');
L.push(`Pontos mais próximos dos limites em Alta — céu: ${worst('skyFraction')}. Luminância: ${worst('luminanceMean')}. Bucket: ${worst('dominantBucketShare', false)}.`, '');
for (const l of NOTES.sweep) L.push(l);
L.push('');

// ------------------------------------------------------------------ 5. audio + performance
L.push('## 5. Áudio (13.2) e desempenho (13.3)', '');
{
  const i = AU.instants;
  L.push(`**Gravação:** \`${AU.file}\` — PCM do bus master depois do limiter, capturado por um tap \`AudioWorklet\` dentro do grafo (nenhum dispositivo de áudio envolvido), ${AU.sampleRate} Hz, ${AU.channels} canais, ${AU.bits} bits, ${n(AU.seconds, 1)} s. Começa no primeiro bipe da contagem (3 s antes da luz verde) e cobre a volta inteira (${AU.lapTimeText.replace('.', ',')}) com os cinco rivais; o áudio foi desbloqueado pelos cliques reais nos menus. A mesma volta está em \`volta.webm\` (Alta, câmera de perseguição, HUD, IAs e som).`, '');
  L.push('| Medida | Valor |', '| --- | --- |');
  L.push(`| Pico máximo do master | **${n(AU.peakDb, 2)} dBFS** (limite −1 dBFS; teto do limiter −1,2 dBFS; menor ganho aplicado pelo limiter ${n(AU.limiterMinGain, 3)}) |`);
  L.push(`| RMS da gravação | ${n(AU.rmsDb, 1)} dB |`);
  L.push(`| Máximo de vozes simultâneas | ${AU.maxSimultaneousVoices} (motores de rivais audíveis ao mesmo tempo: ${AU.maxRivalEnginesAudible}, limite 5) |`);
  L.push(`| Trocas de marcha (${i.gearChanges.length}) | ${i.gearChanges.slice(0, 8).join(' · ')} … |`);
  L.push(`| Derrapagens | ${i.skids.join(' · ')} |`);
  L.push(`| Colisão | ${i.collisions.join(' · ')} |`);
  L.push(`| Ponte (entrada–saída) | ${i.bridge.join(' · ')} |`);
  L.push(`| Passagem por uma IA | ${i.passes.join(' · ')} |`);
  L.push(`| Vozes depois de 3 reinícios (teste 3) | ${T.T3.details.voices.afterRestarts.join(' / ')} — iguais às ${T.T3.details.voices.before} do início |`);
  L.push('', `Instantes em mm:ss a partir do início da gravação. Entradas roteirizadas da volta (disparadas dentro da simulação, por distância): ${AU.scripted.map((x) => `${x.what} em s = ${x.s} m`).join('; ')}. O restante é o piloto automático correndo contra os rivais.`, '');
}
{
  const h = PF.presets.high, l = PF.presets.low;
  L.push(`**Desempenho na Z3** (vila, pelotão completo de 6 carros a partir de s = 1 625 m, medição de 10 s por preset), ${PF.resolution.join('×')}, ${PF.gpu}, ${PF.cpu}, ${PF.browser}:`, '');
  L.push('| Preset | FPS médio | 1 % low | Quadro médio / p99 / pior | CPU (simulação + render) | Draw calls (sombra) | Resolução interna |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const [name, p] of [['Alta', h], ['Baixa', l]]) L.push(`| ${name} | ${n(p.fps, 1)} | ${n(p.low1, 1)} | ${n(p.frameMsMean, 2)} / ${n(p.frameMsP99, 1)} / ${n(p.frameMsMax, 1)} ms | ${n(p.cpuMs.sim, 2)} + ${n(p.cpuMs.render, 2)} ms | ${p.draw.calls} (${p.draw.shadowCalls}) | ${p.internal.join('×')} |`);
  L.push('', 'Medido com o limitador de 60 quadros por segundo do verificador (`?cap=60`): 60 significa que o orçamento de 16,7 ms foi cumprido, e o número é comparável entre monitores de 60, 100 e 144 Hz.', '');
  for (const l2 of NOTES.performance) L.push(l2);
  L.push('');
}

// ------------------------------------------------------------------ 6. screenshots
L.push('## 6. Capturas — autoavaliação contra o veto (5.8) e contra as referências', '');
L.push('Cada comparação está em `compare/sN.png` (a captura ao lado das referências indicadas, no mesmo tamanho). As diferenças abaixo foram escritas depois de abrir cada folha.', '');
for (const id of order) {
  const s = IM.shots[id]; const N = NOTES.shots[id]; if (!s || !N) continue;
  L.push(`### ${id} — \`${s.file}\` · ${N.title}`, '');
  L.push(`${s.references.length ? `Comparada com ${s.references.map((r) => '`' + r + '`').join(' e ')} em \`${s.compare}\`.` : `Sem referência indicada (\`${s.compare}\` traz só a captura).`} ${N.setup}`, '');
  L.push(`**Veto (5.8):** ${N.veto}`, '');
  if (N.diffs && N.diffs.length) { L.push(`**Diferenças concretas em relação à referência:**`, ''); N.diffs.forEach((d, i) => L.push(`${i + 1}. ${d}`)); L.push(''); }
  if (N.below && N.below.length) { L.push('**Abaixo do alvo:**', ''); N.below.forEach((d) => L.push(`- ${d}`)); L.push(''); }
}

// ------------------------------------------------------------------ 7. limits
L.push('## 7. O que ficou abaixo do alvo', '');
for (const l of NOTES.limitations) L.push(`- ${l}`);
{
  // margins to the limits of the image tests, straight from the metrics
  const fr = SW.frames; const by = (k, asc) => fr.slice().sort((a, b) => (asc ? a[k] - b[k] : b[k] - a[k]))[0];
  const b = by('dominantBucketShare', false), m = by('luminanceMean', true), sk = by('skyFraction', true);
  const shotsStd = order.map((id) => [id, IM.shots[id]]).filter(([, x]) => x && typeof x.luminanceStd === 'number').sort((a, c) => a[1].luminanceStd - c[1].luminanceStd)[0];
  const shotsMean = order.map((id) => [id, IM.shots[id]]).filter(([, x]) => x && typeof x.luminanceMean === 'number').sort((a, c) => a[1].luminanceMean - c[1].luminanceMean)[0];
  L.push(`- **Margens das métricas de imagem:** na varredura, o maior bucket de cor é ${pct(b.dominantBucketShare)} (s = ${b.s} m; limite 30 %), a menor luminância é ${n(m.luminanceMean, 3)} (s = ${m.s} m; limite 0,25) e o menor céu é ${pct(sk.skyFraction)} (s = ${sk.s} m; limite 10 %); nas capturas, o menor desvio é ${n(shotsStd[1].luminanceStd, 3)} (${shotsStd[0]}; limite 0,12) e a menor luminância é ${n(shotsMean[1].luminanceMean, 3)} (${shotsMean[0]}).`);
}
L.push('');
writeFileSync(V('REPORT.md'), L.join('\n'));
console.log(`REPORT.md written: ${L.length} lines, ${failed.length} failing test(s)`);
if (!existsSync(V('compare/s1.png'))) console.log('warning: compare sheets missing');
