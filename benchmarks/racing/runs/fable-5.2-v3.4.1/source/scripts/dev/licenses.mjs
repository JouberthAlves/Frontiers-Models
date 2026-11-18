// Dev tool: writes ASSET-LICENSES.md from the manifests that the fetch scripts keep next to the assets.
//   node scripts/dev/licenses.mjs
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ph = JSON.parse(readFileSync(join(root, 'assets/polyhaven-sources.json'), 'utf8'));
const au = JSON.parse(readFileSync(join(root, 'scripts/audio/sources.json'), 'utf8'));
const size = (p) => { try { return statSync(join(root, p)).size; } catch { return 0; } };
const mb = (n) => (n / 1048576).toFixed(1);
const dirSize = (d) => { let n = 0; for (const e of readdirSync(join(root, d), { withFileTypes: true })) n += e.isDirectory() ? dirSize(join(d, e.name)) : statSync(join(root, d, e.name)).size; return n; };

const tex = ph.filter((e) => e.type === 'texture'), hdri = ph.filter((e) => e.type === 'hdri');
const L = [];
L.push('# Licenças dos assets', '');
L.push('Todo asset de terceiros empacotado no jogo é **CC0 1.0** (dedicação ao domínio público) e está gravado localmente em `assets/` — o jogo não baixa nada em tempo de execução. Nenhum arquivo de `refs/` (as imagens de referência do benchmark) faz parte do build: elas são lidas de fora do projeto apenas pelo verificador, para montar as folhas de comparação.', '');
L.push('| Origem | Itens | Licença | Tamanho no build |', '| --- | --- | --- | --- |');
L.push(`| Poly Haven — texturas PBR | ${tex.length} conjuntos (albedo, normal, ARM) | CC0 1.0 | ${mb(dirSize('assets/textures'))} MB |`);
L.push(`| Poly Haven — HDRI | ${hdri.length} | CC0 1.0 | ${mb(dirSize('assets/hdri'))} MB |`);
L.push(`| Freesound — gravações CC0 | ${au.sounds.length} sons de origem → ${readdirSync(join(root, 'assets/audio')).filter((f) => f.endsWith('.wav')).length} amostras | CC0 1.0 | ${mb(dirSize('assets/audio'))} MB |`);
L.push(`| Próprios — modelos dos carros | 2 (\`assets/cars/gt.bin\`, \`assets/cars/hatch.bin\`) | obra original deste projeto | ${mb(dirSize('assets/cars'))} MB |`);
L.push('');
L.push('## Texturas PBR — Poly Haven (CC0 1.0)', '');
L.push('Baixadas de https://polyhaven.com pelo script `scripts/dev/ph.mjs` (mapas `diff`, `nor_gl` e `arm`). O asfalto da pista é 2K; as demais superfícies próximas da pista são 1K ou 2K.', '');
L.push('| Asset | Autor(es) | Página | Resolução |', '| --- | --- | --- | --- |');
for (const e of tex) { const res = (e.files[0].match(/_(\dk)\./) || [])[1] || ''; L.push(`| ${e.name} (\`${e.id}\`) | ${e.authors.join(', ')} | ${e.page} | ${res.toUpperCase()} |`); }
L.push('');
L.push('## HDRI — Poly Haven (CC0 1.0)', '');
L.push('| Asset | Autor(es) | Página | Arquivo |', '| --- | --- | --- | --- |');
for (const e of hdri) L.push(`| ${e.name} (\`${e.id}\`) | ${e.authors.join(', ')} | ${e.page} | \`${e.files[0]}\` |`);
L.push('');
L.push('## Áudio — Freesound (CC0 1.0)', '');
L.push('Cada gravação abaixo está publicada no Freesound sob CC0 1.0 (licença conferida na página de cada som). `scripts/audio/fetch.mjs` baixa as gravações e `scripts/audio/build-samples.py` recorta, normaliza e fecha os loops que ficam em `assets/audio/` (o mapa amostra → gravação de origem está em `assets/audio/manifest.json`). O motor do jogador e dos rivais toca **somente** essas gravações (faixas de giro com crossfade); síntese é usada apenas nos sons de interface, na contagem de largada e na música do menu.', '');
L.push('| Uso no jogo | Som | Autor | Página |', '| --- | --- | --- | --- |');
for (const s of au.sounds) L.push(`| ${s.use} | ${s.name} | ${s.author} | https://freesound.org/s/${s.id}/ |`);
L.push('');
L.push('## Conteúdo próprio (gerado por código deste repositório)', '');
L.push('- **Carros:** os dois modelos são projetados como campos de distância em `scripts/cars/designs.mjs` e convertidos em malha por `scripts/cars/bake.mjs` → `assets/cars/*.bin`. Não derivam de nenhum modelo de terceiros.');
L.push('- **Pista e mundo:** `track.json` (gerado por `scripts/make-track.mjs`), terreno, casas, igreja, ponte, farol, barreiras, vegetação (malhas e atlas de folhas), props, mar e céu complementar são gerados em tempo de carga pelos módulos de `src/world/` e `src/render/`.');
L.push('- **Texturas procedurais:** reboco, telhas pintadas, madeira pintada, metal galvanizado, faixas da pista, placas, faixa do pórtico e atlas de folhagem são desenhados em canvas por `src/render/proctex.js` e `src/render/scene-materials.js`.');
L.push('- **Sons sintetizados:** bipes da interface, contagem de largada, bandeirada e a música do menu (`src/audio/audio.js`).');
L.push('- **Fontes:** o jogo usa as fontes do sistema (pilha `Bahnschrift`, `DIN Alternate`, `Roboto Condensed`, `Segoe UI`, sans-serif); nenhum arquivo de fonte é distribuído.');
L.push('');
L.push('## Bibliotecas de código', '');
L.push('| Biblioteca | Versão | Licença | Onde |', '| --- | --- | --- | --- |');
L.push(`| three.js | ${readFileSync(join(root, 'lib/three/VERSION.txt'), 'utf8').trim().split(/\s+/)[1]} | MIT (\`lib/three/LICENSE\`) | \`lib/three/\` (cópia local, sem CDN) |`);
L.push('| Playwright | 1.65.1 | Apache-2.0 | apenas `devDependencies`, usado por `npm run verify`; não faz parte do jogo |');
L.push('');
L.push('Nenhuma implementação, asset ou código de outro jogo foi consultado ou copiado, e nenhum asset foi produzido por IA generativa externa.');
L.push('');
writeFileSync(join(root, 'ASSET-LICENSES.md'), L.join('\n'));
console.log(`ASSET-LICENSES.md: ${tex.length} texture sets, ${hdri.length} HDRI, ${au.sounds.length} sounds`);
