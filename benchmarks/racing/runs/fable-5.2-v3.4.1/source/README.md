# Circuito Costa Dourada

Jogo de corrida 3D para navegador desktop: um circuito costeiro de 3,37 km ao pôr do sol, contra 5 rivais. Entrada do **Racing-bench V3.4.1 — Race-First Visual Edition**.

Site estático, sem etapa de build e sem nenhum acesso à rede em tempo de execução: three.js r187 está em `lib/`, texturas, HDRI, áudio e modelos em `assets/`.

## Como rodar

```bash
npm start
```

Abre um servidor estático em `http://localhost:8080/` (qualquer outro servidor estático apontado para a raiz do projeto serve; `npm start` não precisa de `npm ci`). Requer um navegador com WebGL 2 (Chrome ou Edge recentes) e, para o servidor incluído, Node 18 ou mais novo.

Fluxo: **Menu** (a pista ao vivo, com os carros rodando) → **Garagem** (2 carros, 6 cores, o carro girando na luz do entardecer) → **Configuração** (voltas, dificuldade, qualidade) → apresentação do grid → 3-2-1 → **Corrida** → **Resultados** → *Correr de novo* ou *Menu*. Pausa com Esc (continuar, reiniciar, menu); em *Configurações* (no menu e na pausa) ficam a qualidade, os volumes geral, de efeitos e de música e a lista de controles.

## Controles

| Ação | Teclado | Gamepad |
| --- | --- | --- |
| Acelerar | ↑ ou W | gatilho direito |
| Frear / ré | ↓ ou S | gatilho esquerdo |
| Direção | ← → ou A D | alavanca esquerda |
| Freio de mão | Espaço | A |
| Trocar a câmera (perseguição / capô) | C | Y |
| Voltar para a pista | R | X |
| Pausa | Esc ou P | Start |
| Confirmar / pular a apresentação | Enter | A |

Câmbio automático. Cortar a pista não conta volta: os 34 checkpoints têm de ser passados em ordem. Um carro que fica mais de 3 s fora da pista ou parado é recolocado no último ponto válido.

## A pista

Uma volta de 3 367 m, gerada inteira a partir de `track.json` (fonte única: estrada, terreno, colisão, barreiras, vila, vegetação e linha de corrida derivam dele):

1. **Orla** — reta de largada entre a praia e o calçadão, palmeiras, quiosques, pórtico de largada.
2. **Falésia** — subida em serpentina de 60 m de desnível, mirante e farol.
3. **Vila** — 445 m de rua entre sobrados, travessas, largo com chafariz e a igreja com torre.
4. **Bosque** — pinheiros-mansos, oliveiras e ciprestes, curva longa e a ponte de pedra de 5 arcos sobre a enseada.

## Rivais

Os cinco rivais dirigem o mesmo modelo físico do jogador (só produzem volante, acelerador e freio; não há teleporte nem elástico). Cada um tem um nível próprio de aderência usada e de aceleração na reta, por dificuldade; o grid não sai em ordem de ritmo, de modo que os mais rápidos têm de abrir caminho. Regras de pista que eles seguem: ficam no vácuo e saem quando têm velocidade ou reta para concluir, escolhem o lado de dentro da próxima curva, deixam espaço para quem está ao lado, cedem a curva a quem chega por dentro emparelhado e não disputam na reta uma posição já perdida. O vácuo (até 45 % menos arrasto a menos de 36 m atrás de outro carro) vale para todos, jogador incluído. Como os dois modelos têm curvas de potência diferentes, os rivais correm com equilíbrio de desempenho entre modelos; o carro do jogador nunca é limitado.

## Qualidade

| Preset | O que muda |
| --- | --- |
| **Alta** | resolução nativa, MSAA 4×, sombras em cascata 2048², oclusão de ambiente, motion blur, raios de sol, sonda de reflexo dinâmica nos carros |
| **Baixa** | 70 % da resolução interna com FXAA, sombras 1024² mais curtas, sem AO / motion blur / raios / sonda, vegetação e props com alcance menor |

As texturas, as formas das casas e os grupos de árvores próximos são os mesmos nos dois presets.

## Verificação

```bash
npm ci
npm run verify
```

Sobe o servidor, abre o Chrome (ou Edge, ou o Chromium do Playwright) com GPU, roda todos os testes da seção 13 do benchmark e grava tudo em `verification/`: `results.json`, `scene-stats.json`, `image-metrics.json`, `performance.json`, as 12 capturas, `compare/` (captura ao lado da referência), `sweep/` + `sweep-sheet.png`, `volta.webm`, `audio-volta.wav` e `logs/`. O comando termina com código 1 se algum teste falhar. Leva cerca de 10 minutos. `GATES.md` e `REPORT.md` não são reescritos pelo verificador: o relatório é montado por `node scripts/dev/report.mjs` a partir desses arquivos, com as avaliações escritas à mão.

O verificador usa o Chrome ou o Edge instalados no sistema (não baixa navegador). Se a máquina não tiver nenhum dos dois, instale o Chromium do Playwright antes: `npx playwright install chromium`.

As imagens de referência do benchmark **não** fazem parte do projeto. O verificador procura a pasta com os 14 JPGs em `--refs=<pasta>`, na variável `RACING_REFS`, em `./refs`, `../refs` ou `../../refs`; sem ela, as folhas de `compare/` trazem só a captura.

```bash
npm run verify -- --refs=/caminho/para/refs
npm run verify -- --only=capturas --shots=S1,S5
npm run verify -- --only=jornadas,estado,anticorte,varredura,volta,desempenho
npm run validate
```

`npm run validate` roda `validateWorld()` e a auditoria de densidade em Node, sem navegador.

Os FPS são medidos com um limitador de 60 quadros por segundo próprio do verificador (`?cap=60`), para que o número signifique a mesma coisa num monitor de 60, 100 ou 144 Hz; o FPS sem limite aparece no relatório como dado adicional.

## Parâmetros de URL

| Parâmetro | Efeito |
| --- | --- |
| `q=high` \| `q=low` | preset de qualidade |
| `car=gt` \| `car=hatch`, `livery=0..5`, `laps=3` \| `6`, `difficulty=easy` \| `normal` \| `hard` | opções iniciais |
| `fps=1` | mostra o FPS no HUD |
| `auto=1` | piloto automático no carro do jogador (usado só pelos testes) |
| `cap=60` | limitador de quadros do verificador |
| `dev=1` | modo de desenvolvimento: pula o menu, expõe `window.__api`, roda `validateWorld()` na carga |

## Estrutura

```
index.html            página única
track.json            fonte única do mundo (gerada por scripts/make-track.mjs)
src/world/            pista, terreno, vila, população de objetos, validateWorld, auditoria
src/physics/          veículo (120 Hz), pneus, colisões
src/ai/               linha de corrida, perfil de velocidade, piloto
src/game/             estados do jogo, corrida, câmera, diretor de câmeras, entrada
src/render/           céu/luz, materiais, terreno, mar, casas, vegetação, props, carros, pós-processamento
src/audio/            motor por amostras, buses, limiter (AudioWorklet)
src/ui/               menus e HUD
scripts/verify.mjs    npm run verify
scripts/              geração da pista, dos carros e das amostras de áudio; ferramentas de desenvolvimento
verification/         provas geradas pelo verificador, GATES.md e REPORT.md
```

## Hardware testado e desempenho

| | |
| --- | --- |
| GPU | NVIDIA GeForce RTX 3070 Ti (Direct3D 11 via ANGLE) |
| CPU | AMD Ryzen 7 5700G (8 núcleos, 16 threads) |
| Memória | 32 GB |
| Sistema | Windows 11 |
| Navegador | Chrome 150 |
| Resolução | 1920×1080 |

Na vila (Z3), com os seis carros juntos:

| Preset | Com o limitador de 60 Hz do verificador | Sem limitador (`node scripts/dev/perf.mjs`) |
| --- | --- | --- |
| Alta | 60,0 FPS, 1 % low 55,4, CPU de render 7,4 ms por quadro | 122–136 FPS (1 % low 72–90) |
| Baixa | 60,0 FPS, 1 % low 59,8, CPU de render 5,2 ms por quadro | 177–183 FPS (1 % low 111) |

Sem limitador o jogo é limitado pela CPU (6–9 ms de render por quadro) e os números variam cerca de ±20 % de uma medição para outra nesta máquina; fora da vila mediu-se 155 FPS na orla e 110 no bosque em Alta, 213 e 239 em Baixa. Uma volta inteira a frio, com o limitador, fica em 60 FPS com 1 % low de 45 e pior quadro de 30 ms.

**Baixa em GPU integrada não foi medida**: a GPU integrada desta máquina está desativada e o navegador só enxerga a placa dedicada. O que existe é uma estimativa de folga: nesta placa o preset Baixa ainda roda a 196 FPS com a janela em 3840×2160 e a 101 FPS em 7680×4320, o que dá cerca de 1–1,5 ms de GPU por quadro em 1080p; uma GPU integrada recente é de 6 a 10 vezes mais lenta. Detalhes em `verification/REPORT.md`, seção 5.

## Limitações conhecidas

A lista completa, com as diferenças em relação às imagens de referência, está em `verification/REPORT.md` (seções 6 e 7). As principais:

- **Baixa não foi medida numa GPU integrada** (ver acima).
- **Atmosfera e água:** não há luz volumétrica nem poeira iluminada; a água não refrata o fundo e não tem respingos.
- **Carros:** superfícies lisas, sem asa nem saídas de ar modeladas; as linhas de painel são desenhadas no shader.
- **Luz:** com o sol a 6°, a rua da vila e os grampos da falésia ficam na sombra; a exposição automática compensa, e um carro ao sol contra um fundo em sombra fica com a pintura muito clara.
- **Rocha e vegetação:** a textura de rocha estica em faces quase verticais; as copas são cartões de folha, que aparecem em blocos a meia distância.
- **IA:** em Difícil os rivais andam muito próximos em ritmo e há poucas ultrapassagens; um rival atingido de lado com força pode rodar e ser recolocado na pista pela regra dos 3 s.
- **Navegador:** testado no Chrome 150 no Windows; requer WebGL 2. Firefox e Safari não foram testados.
- **Memória:** cerca de 700 MB em uso durante a corrida.
- **Câmbio** só automático; sem replay, sem modo foto e sem outros modos — fora do escopo do benchmark.

## Licenças

Todos os assets de terceiros são CC0 (Poly Haven e Freesound); ver `ASSET-LICENSES.md`. three.js é MIT.
