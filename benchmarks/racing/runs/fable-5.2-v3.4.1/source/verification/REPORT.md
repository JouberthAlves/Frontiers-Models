# REPORT — Circuito Costa Dourada (Racing-bench V3.4.1)

**Falhas declaradas: nenhuma.** Os 12 testes de `npm run verify` passaram na execução que gerou os arquivos desta pasta. O que ficou abaixo do alvo está nas seções 6 (por captura) e 7 (lista geral), e não é escondido.

**Reprodutibilidade conferida.** O verificador foi rodado duas vezes seguidas e mais uma vez num clone limpo do repositório (`git clone` → `npm ci` → `npm run verify`): 12 de 12 testes nas três. Saíram iguais: a classificação e os tempos das duas jornadas, as 12 capturas (diferença máxima de 1/255; 5/255 em 0,01 % dos pixels da S6), as métricas de imagem, os 270 pontos da varredura e o `scene-stats.json`; a volta gravada deu o mesmo tempo e os mesmos eventos. O que varia de uma execução para outra: o pico do áudio (entre −6,4 e −8,0 dBFS nas últimas cinco gravações) e o 1 % low do teste de desempenho (53–58 FPS em Alta, 58–60 em Baixa).

Execução: `npm run verify` em 2026-11-18 · chrome 150.0.7871.127 (sem janela) · Windows_NT 10.0.26300 x64 · AMD Ryzen 7 5700G with Radeon Graphics (16 threads) · 32 GB · GPU ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Ti (0x00002482) Direct3D11 vs_5_0 ps_5_0, D3D11) · 1920×1080.

Os números deste relatório são copiados dos arquivos gerados pelo verificador (`results.json`, `image-metrics.json`, `scene-stats.json`, `sweep/metrics.json`, `audio-volta.json`, `performance.json`) pelo script `scripts/dev/report.mjs`; as avaliações em texto foram escritas depois de abrir cada imagem.

## 1. Testes automatizados (13.1)

| Teste | O que verifica | Resultado | Duração |
| --- | --- | --- | --- |
| T1 | Jornada: menu → carro → 3 voltas com 5 IAs → resultados → correr de novo | passou | 87 s |
| T2 | Jornada com 6 voltas | passou | 122 s |
| T5 | IA: nenhuma parada ou fora da pista por mais de 5 s; ao menos 1 ultrapassagem entre IAs | passou | 0 s |
| T6 | Integridade: validateWorld sem erros; zero eventos nas corridas; câmera nunca dentro de geometria | passou | 0 s |
| T8 | Auditoria da cena lida em runtime (scene-stats.json) | passou | 0 s |
| T3 | Pausa/continuar, reiniciar no meio, voltar ao menu: sem estado antigo, sem áudio duplicado, heap estável | passou | 75 s |
| T4 | Anticorte: cortar a pista não conta volta | passou | 13 s |
| T7 | Capturas S1–S12 (1920×1080) e sanidade de imagem | passou | 61 s |
| T9 | Varredura de câmera a cada 25 m (Alta): métricas fotográficas em todos os pontos | passou | 29 s |
| T9b | Varredura de câmera a cada 25 m (Baixa) | passou | 28 s |
| A1 | Vídeo da volta (volta.webm) e PCM do master após o limiter (audio-volta.wav) | passou | 146 s |
| P1 | Desempenho em Z3 com 5 IAs, Alta e Baixa, 1920×1080 | passou | 48 s |

**T1 — jornada de 3 voltas** (carro hatch, cor 2, cliques reais nos menus, piloto automático só no carro do jogador, tempo acelerado 8×). Ultrapassagens: 4 (3 entre IAs). Reposições de carro: 0. Depois dos resultados, *Correr de novo* volta ao grid com o estado zerado.

| Pos. | Piloto | Carro | Tempo | Voltas (s) |
| --- | --- | --- | --- | --- |
| 1 | IA 1 | GT | 5:32,1 | 114,20 · 108,93 · 108,99 |
| 2 | IA 3 | GT | 5:32,3 | 114,41 · 109,02 · 108,87 |
| 3 | IA 4 | hatch | 5:40,0 | 117,45 · 111,05 · 111,52 |
| 4 | IA 5 | GT | 5:40,2 | 117,81 · 111,13 · 111,24 |
| 5 | Você | hatch | 5:40,6 | 118,11 · 111,12 · 111,37 |
| 6 | IA 2 | hatch | ≈ 5:48,0 | 121,19 · 112,89 |

**T2 — jornada de 6 voltas** (carro GT, cor 4, cliques reais nos menus, piloto automático só no carro do jogador, tempo acelerado 8×). Ultrapassagens: 6 (4 entre IAs). Reposições de carro: 0. Depois dos resultados, *Correr de novo* volta ao grid com o estado zerado.

| Pos. | Piloto | Carro | Tempo | Voltas (s) |
| --- | --- | --- | --- | --- |
| 1 | IA 3 | hatch | 10:41,4 | 111,57 · 105,91 · 105,90 · 105,92 · 106,17 · 105,92 |
| 2 | IA 1 | hatch | 11:00,9 | 114,79 · 109,64 · 109,18 · 108,98 · 108,97 · 109,33 |
| 3 | IA 5 | hatch | 11:01,4 | 115,60 · 109,08 · 109,34 · 109,02 · 108,97 · 109,37 |
| 4 | Você | GT | 11:01,8 | 119,27 · 106,57 · 109,00 · 108,63 · 108,90 · 109,46 |
| 5 | IA 2 | GT | ≈ 11:24,3 | 119,26 · 112,91 · 112,77 · 112,76 · 112,85 |
| 6 | IA 4 | GT | ≈ 11:24,6 | 120,41 · 112,32 · 112,53 · 112,86 · 112,76 |

**T3 — pausa, reinício, menu.** Em pausa a simulação não avança (0 passos); vozes de áudio: 45 antes, 45 / 45 / 45 depois de cada um dos três reinícios, 45 de volta ao menu (45 são as vozes permanentes do grafo: faixas dos motores, rolagem, vento, ambiente). Heap: +0,45 MB depois de três reinícios. Nenhum estado da corrida anterior sobrevive (relógio, voltas, resultados, HUD).

**T4 — anticorte** (34 checkpoints em sequência): cruzar a linha depois de voltar de ré ou de pular da falésia para a ponte não conta volta; a volta que passa por todos os checkpoints conta.

**T5 — IA.**

| Corrida | Maior parada de um rival | Maior tempo fora da pista | Reposições | Ultrapassagens entre rivais |
| --- | --- | --- | --- | --- |
| 3 voltas | 0,21 s | 0,00 s | 0 | 3 |
| 6 voltas | 0,22 s | 0,00 s | 0 | 4 |

Uma ultrapassagem só é contada quando o carro que vinha atrás fica um comprimento inteiro (5,5 m) à frente.

**T6 — integridade.** `validateWorld()`: sem erros. Nas corridas dos testes 1 e 2: 3 voltas: 0 eventos (carro sob o terreno, através de barreira, fora do mundo, roda a mais de 1,5 m do chão), 0 quadros com a câmera dentro de geometria; 6 voltas: 0 eventos (carro sob o terreno, através de barreira, fora do mundo, roda a mais de 1,5 m do chão), 0 quadros com a câmera dentro de geometria.

## 2. Sanidade de imagem das capturas (teste 7)

Limites: céu ≥ 10 % onde exigido; luminância média entre 0,25 e 0,75; desvio padrão ≥ 0,12; nenhum bucket de cor (4 bits por canal) acima de 30 %. FPS medido ao vivo no lugar da captura durante 2 s, com o limitador de 60 Hz do verificador.

| # | Arquivo | Preset | Céu | Luminância | Desvio | Maior bucket | FPS (1 % low) | Isenções |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | `s1-reta-orla.png` | Alta | 29,3 % | 0,416 | 0,275 | 10,1 % | 60 (60) | — |
| S2 | `s2-grid-3-4.png` | Alta | 32,8 % | 0,356 | 0,216 | 9,8 % | não aplicável | — |
| S3 | `s3-praia-espuma.png` | Alta | 45,9 % (não exigido) | 0,597 | 0,178 | 3,0 % | 60 (60) | céu: close de praia e rochas (isenção de céu prevista no teste 7) |
| S4 | `s4-falesia-mirante.png` | Alta | 26,9 % | 0,369 | 0,232 | 8,2 % | 60 (54) | — |
| S5 | `s5-vila-rua.png` | Alta | 14,9 % | 0,396 | 0,225 | 5,7 % | 60 (60) | — |
| S6 | `s6-bosque-luz.png` | Alta | 23,3 % | 0,405 | 0,253 | 7,5 % | 60 (60) | — |
| S7 | `s7-ponte-ou-tunel.png` | Alta | 32,0 % | 0,498 | 0,243 | 3,4 % | 60 (60) | — |
| S8 | `s8-disputa.png` | Alta | 28,8 % | 0,405 | 0,283 | 10,3 % | 60 (58) | — |
| S9 | `s9-close-pista.png` | Alta | 20,9 % (não exigido) | 0,282 | 0,176 | 7,0 % | 60 (60) | céu: close de pista e zebra (isenção de céu prevista no teste 7) |
| S10 | `s10-baixa-vila.png` | Baixa | 14,9 % | 0,411 | 0,219 | 6,5 % | 60 (60) | — |
| S11 | `s11-escala.png` | Alta | 1,6 % (não exigido) | 0,340 | 0,140 | 7,5 % | não aplicável | céu: inspeção estática de escala (isenção de céu prevista no teste 7) |
| S12 | `s12-mapa.png` | Alta | 0,0 % (não exigido) | não aplicável | não aplicável | não aplicável | não aplicável | céu: mapa aéreo de inspeção; mapa de inspeção, não é imagem fotográfica (métricas de composição: não aplicável) |

Todas as 12 passaram. Valores por captura, buckets e motivo de cada isenção: `image-metrics.json`.

## 3. Auditoria da cena (teste 8, `scene-stats.json`)

| Item | Medido | Mínimo |
| --- | --- | --- |
| Carro Aurora GT: triângulos no LOD0 / materiais | 262.806 / 12 | 15.000 / 6 |
| Carro Vento RS: triângulos no LOD0 / materiais | 270.225 / 12 | 15.000 / 6 |
| Detector de caixa | 0 objetos acusados (9 objetos compostos, 120 protótipos e 159 construções examinados inteiros) | 0 |
| Construções: triângulos / materiais por unidade | 450–4568 (média 2123) / 9–15 | — |
| Detector de cor chapada | 0 de 88 materiais | 0 |
| Texturas abaixo da resolução mínima | 0 de 103 | 0 |
| Z2: desnível / curvas | 59,9 m / 5 | 40 m / 3 |
| Z3: extensão da rua | 444,6 m | 400 m |
| Z3: unidades arquitetônicas (a menos de 30 m) | 154 (145), 2–3 andares | 60 |
| Z3: variações arquitetônicas / cores de reboco | 9 (casa com arcada, casa de pescador, sobrado geminado, casa de pedra, café, sobrado alto, comércio, edifício público, igreja) / 16 | 5 |
| Z3: travessas / largo / marco | 5 (6, 6, 6, 7, 5 unidades) / sim / igreja com torre sineira | 2 / 1 / 1 |
| Z3: detalhes | 29 com varanda, 42 com toldo, 75 com floreiras, 100 com chaminé, 12 quintais frontais | ≥ 1 por unidade |
| Espécies arbóreas | azinheira 272, oliveira 565, cipreste 297, pinheiro-manso 651, palmeira 129 | 4 |
| Tipos de arbusto / de forração | giesta, oleandro, alecrim, lentisco, agave / capim de duna, capim seco, tufos de grama, flores, ervas | — |
| Props por 100 m (pior janela da volta) | 14 (total 947) | 12 |
| Motor do jogador ligado a amostras | 12 `AudioBuffer` em loop (hatch) | ≥ 4 faixas |
| Objetos do mundo / ids únicos | 20.243 / 20.243 | iguais |

**Z3 — janelas de 100 m desde a entrada da vila**

| Janela | Unidades | Frentes urbanizadas | Mínimo | |
| --- | --- | --- | --- | --- |
| 0–100 m | 27 | 23 | 12 | passa |
| 100–200 m | 30 | 23 | 12 | passa |
| 200–300 m | 31 | 27 | 12 | passa |
| 300–400 m | 33 | 25 | 12 | passa |
| 400–445 m (resíduo) | 14 | 12 | — | registrado |

**Z4 — janelas de 100 m desde a entrada do bosque** (até 40 m da pista; `L` = extensão plantável, `f = L/100`)

| Janela | L (m) | f | Árvores | Arbustos | Forração | Cotas (árv. / arb. / forr.) | |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0–100 m | 100 | 1,00 | 66 | 104 | 258 | 16 / 10 / 12 | passa |
| 100–200 m | 100 | 1,00 | 86 | 97 | 285 | 16 / 10 / 12 | passa |
| 200–300 m | 100 | 1,00 | 71 | 114 | 311 | 16 / 10 / 12 | passa |
| 300–400 m | 100 | 1,00 | 80 | 114 | 287 | 16 / 10 / 12 | passa |
| 400–500 m | 100 | 1,00 | 75 | 104 | 314 | 16 / 10 / 12 | passa |
| 500–600 m | 100 | 1,00 | 81 | 102 | 300 | 16 / 10 / 12 | passa |
| 600–700 m | 100 | 1,00 | 80 | 106 | 285 | 16 / 10 / 12 | passa |
| 700–800 m | 100 | 1,00 | 89 | 101 | 305 | 16 / 10 / 12 | passa |
| 800–900 m | 92 | 0,92 | 70 | 94 | 280 | 15 / 10 / 12 | passa |
| 900–1000 m | 0 | 0,00 | 0 | 1 | 8 | 0 / 0 / 0 | isenta (f = 0: toda sobre a ponte) |
| 1000–1069 m (resíduo) | 66 | 0,66 | 48 | 54 | 172 | 11 / 7 / 8 | passa |

A única geometria que reduz `L` é o tabuleiro da ponte (s = 2945,4–3056,0 m, 110,6 m), lido de `track.json`.

## 4. Varredura de câmera a cada 25 m (teste 9)

- **Alta:** 135 pontos, 0 reprovados; céu mínimo 12,4 %, luminância 0,282–0,560, desvio mínimo 0,174, maior bucket 26,9 %. Miniaturas em `sweep/`, folha de contato `sweep-sheet.png`.
- **Baixa:** 135 pontos, 0 reprovados; céu mínimo 12,2 %, luminância 0,284–0,556, desvio mínimo 0,166, maior bucket 26,6 %. Folha de contato `sweep-sheet-low.png`.
- Túnel: não há (a travessia da enseada é uma ponte aberta): nenhum ponto é isento da regra de céu.

Pontos mais próximos dos limites em Alta — céu: s = 575 m (Z2): 12,4 %; s = 550 m (Z2): 12,5 %; s = 1625 m (Z3): 12,7 %. Luminância: s = 550 m (Z2): 0,282; s = 575 m (Z2): 0,287; s = 525 m (Z2): 0,287. Bucket: s = 825 m (Z2): 26,9 %; s = 1475 m (Z2): 24,8 %; s = 1325 m (Z2): 23,6 %.

**Inspeção visual de Z3 e Z4 nas duas folhas (feita quadro a quadro nas linhas s = 1 600–3 100 m):**

- **Z3, Alta (s = 1 625–2 050 m, 18 pontos):** fachadas contínuas dos dois lados em todos os pontos; nenhuma casa isolada sem rua. A torre da igreja já aparece ao longe em s = 1 625 m e domina o quadro de s = 1 700 a 1 775 m; o largo abre à esquerda em s = 1 750–1 775 m com árvores e a fachada da igreja; as bocas das travessas aparecem como intervalos curtos entre fachadas, fechados por um edifício ao fundo. Céu entre 13 % e 19 %. Pontos fracos vistos: (1) de s = 1 825 a 1 975 m a rua é longa e reta e as fachadas se repetem em ritmo parecido — os 8 tipos e 16 cores variam, mas a altura dos beirais é quase constante; (2) a calçada larga (4,2 m) deixa uma faixa de pavimento vazia entre a zebra e as casas, sem mobiliário visível em vários quadros.
- **Z3, Baixa:** mesmas fachadas, mesmos volumes e mesma igreja em todos os 18 pontos; não há casa trocada por bloco liso nem lacuna nova. Perde-se o motion blur do asfalto, a oclusão nos cantos e o reflexo na pintura do carro.
- **Z4, Alta (s = 2 075–3 100 m, 42 pontos):** em todos os pontos fora da ponte há copas dos dois lados em pelo menos duas distâncias (pinheiros-mansos altos atrás, oliveiras e ciprestes à frente), arbustos junto às cercas e forração; não há fileira de clones nem clareira artificial. A curva longa (s = 2 550–2 675 m) tem barreira de pneus e o bosque continua atrás dela. De s = 2 925 a 3 050 m a pista está sobre a ponte: mar dos dois lados, parapeito de pedra, e o bosque reaparece no encontro sul. Pontos fracos vistos: (1) a faixa de grama baixa entre a pista e a cerca deixa o primeiro plano aberto — a camada arbustiva começa a ~5 m da borda; (2) em s = 2 175–2 200 m o carro, ao sol rasante contra o fundo em sombra, fica com a pintura estourada para laranja.
- **Z4, Baixa:** os grupos de árvores próximos são os mesmos, com as mesmas silhuetas; a vegetação distante rareia um pouco (alcance de 60 %) mas nenhum trecho fica vazio; a forração próxima continua presente.
- **Resto da volta:** o ponto mais fraco da regra de leitura é o grampo inferior (s = 525–600 m): céu de 12–15 % e a menor luminância da volta, com a câmera de frente para a encosta; vê-se a encosta com árvores e o farol, não é corredor fechado.

## 5. Áudio (13.2) e desempenho (13.3)

**Gravação:** `audio-volta.wav` — PCM do bus master depois do limiter, capturado por um tap `AudioWorklet` dentro do grafo (nenhum dispositivo de áudio envolvido), 48000 Hz, 2 canais, 16 bits, 126,4 s. Começa no primeiro bipe da contagem (3 s antes da luz verde) e cobre a volta inteira (02:02,2) com os cinco rivais; o áudio foi desbloqueado pelos cliques reais nos menus. A mesma volta está em `volta.webm` (Alta, câmera de perseguição, HUD, IAs e som).

| Medida | Valor |
| --- | --- |
| Pico máximo do master | **-6,38 dBFS** (limite −1 dBFS; teto do limiter −1,2 dBFS; menor ganho aplicado pelo limiter 1,000) |
| RMS da gravação | -24,8 dB |
| Máximo de vozes simultâneas | 47 (motores de rivais audíveis ao mesmo tempo: 5, limite 5) |
| Trocas de marcha (34) | 00:07.3 · 00:10.8 · 00:24.8 · 00:25.9 · 00:32.8 · 00:36.1 · 00:39.6 · 00:42.5 … |
| Derrapagens | 00:13.9 · 00:28.5 |
| Colisão | 00:13.5 (barreira, 5.4 m/s) |
| Ponte (entrada–saída) | 01:51.2–01:54.4 |
| Passagem por uma IA | 01:27.7 (IA 2, ultrapassada pelo jogador) · 02:05.7 (IA 4, ultrapassada pelo jogador) |
| Vozes depois de 3 reinícios (teste 3) | 45 / 45 / 45 — iguais às 45 do início |

Instantes em mm:ss a partir do início da gravação. Entradas roteirizadas da volta (disparadas dentro da simulação, por distância): raspão na barreira em s = 150 m; derrapagem em s = 598 m; alívio para ser ultrapassado em s = 1010 m. O restante é o piloto automático correndo contra os rivais.

**Desempenho na Z3** (vila, pelotão completo de 6 carros a partir de s = 1 625 m, medição de 10 s por preset), 1920×1080, ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Ti (0x00002482) Direct3D11 vs_5_0 ps_5_0, D3D11), AMD Ryzen 7 5700G with Radeon Graphics (16 threads), chrome 150.0.7871.127:

| Preset | FPS médio | 1 % low | Quadro médio / p99 / pior | CPU (simulação + render) | Draw calls (sombra) | Resolução interna |
| --- | --- | --- | --- | --- | --- | --- |
| Alta | 60,0 | 55,4 | 16,67 / 16,7 / 21,9 ms | 0,15 + 7,37 ms | 887 (294) | 1920×1080 |
| Baixa | 60,0 | 59,8 | 16,67 / 16,7 / 16,8 ms | 0,15 + 5,23 ms | 718 (236) | 1344×756 |

Medido com o limitador de 60 quadros por segundo do verificador (`?cap=60`): 60 significa que o orçamento de 16,7 ms foi cumprido, e o número é comparável entre monitores de 60, 100 e 144 Hz.

**Medições adicionais, feitas com as ferramentas de `scripts/dev/` e não pelo verificador** (mesma máquina, Chrome sem janela):

| Medição | Alta | Baixa |
| --- | --- | --- |
| FPS sem limitador, pelotão na vila (`perf.mjs`, s = 1 700 e 1 850 m) | 122–136 (1 % low 72–90) | 177–183 (1 % low 111) |
| FPS sem limitador, orla / bosque | 155 / 110 | 213 / 239 |
| Volta inteira a frio com limitador de 60 Hz (`lapspikes.mjs`) | 60 FPS, 1 % low 45, p99 21 ms, pior quadro 30 ms | — |
| Pausas do coletor de lixo em 12 s de corrida (`gctrace.mjs`) | 4 coletas menores de até 1,0 ms e 1 maior de 10 ms | — |

Sem limitador o jogo é limitado pela CPU nesta máquina, e essas medições variaram cerca de ±20 % entre sessões (a mesma posição da vila deu 125–132 FPS em Alta e 231–235 em Baixa numa medição anterior do mesmo dia). O 1 % low do teste do verificador também oscila: entre 54 e 58 FPS em Alta nas últimas quatro execuções completas.

**Baixa em GPU integrada: não medido.** A GPU integrada desta máquina (Radeon do Ryzen 7 5700G) está desativada e o navegador só enxerga a RTX 3070 Ti, portanto a meta de 60 FPS em GPU integrada **não tem prova nesta entrega**. O que foi medido para estimar a folga: na RTX 3070 Ti o preset Baixa roda limitado pela CPU (4–5 ms por quadro) e mantém 196 FPS com a janela em 3840×2160 e 101 FPS em 7680×4320 (resolução interna de 16,3 megapixels); disso sai um custo de GPU de cerca de 0,6 ms por megapixel, ou 1–1,5 ms por quadro em 1080p. Uma GPU integrada recente é de 6 a 10 vezes mais lenta que essa placa, o que colocaria o quadro entre 6 e 15 ms — dentro do orçamento de 16,7 ms, mas isso é estimativa, não medição.

## 6. Capturas — autoavaliação contra o veto (5.8) e contra as referências

Cada comparação está em `compare/sN.png` (a captura ao lado das referências indicadas, no mesmo tamanho). As diferenças abaixo foram escritas depois de abrir cada folha.

### S1 — `s1-reta-orla.png` · reta da orla em velocidade, sol à frente

Comparada com `01-golden-hour-palmeiras.jpg` e `02-costa-praia-falesia.jpg` em `compare/s1.png`. Gameplay em Alta, câmera de perseguição, HUD, quatro rivais à frente a 199 km/h.

**Veto (5.8):** nenhum item. Carro apoiado no chão com sombra longa, céu em 29 % do quadro, sol visível, mar com reflexo, sombras nítidas das palmeiras e dos carros, sem pop-in. Ponto fraco: o asfalto ocupa quase metade do quadro — tem trincas, faixas e o brilho rasante do sol, mas é a área menos rica da imagem.

**Diferenças concretas em relação à referência:**

1. A referência 01 tem névoa/poeira volumétrica espessa e iluminada que engole a base das palmeiras e apaga o horizonte; no nosso quadro o ar é limpo: sol com halo moderado, horizonte nítido, palmeiras visíveis até o pé.
2. O carro da referência ocupa um terço do quadro e a pintura reflete o céu rosa e laranja com contorno de luz nas bordas da asa; o nosso aparece menor, em contraluz, com a traseira quase toda em sombra e só a faixa da lanterna acesa — o reflexo do pôr do sol na pintura mal se lê.
3. Na referência o asfalto tem um reflexo largo e quente, com a textura borrada pelo movimento; o nosso é fosco e cinza, com o brilho do sol restrito a uma faixa estreita entre os carros.
4. As palmeiras da referência têm copas cheias e caídas, com saia de folhas secas e troncos grossos; as nossas têm frondes mais finas e limpas e troncos lisos.
5. A referência 02 mostra uma serra ao fundo e rochas no primeiro plano; o nosso horizonte são morros baixos e o mar plano, sem relevo distante.

**Abaixo do alvo:**

- Atmosfera volumétrica (poeira iluminada) e reflexo do céu na pintura em contraluz.

### S2 — `s2-grid-3-4.png` · carro no grid, 3/4 frontal baixa (sem HUD)

Comparada com `11-carro-pintura-vidro-rodas.jpg` em `compare/s2.png`. Último quadro da apresentação do grid: câmera a 0,5 m do chão, à frente e à esquerda do carro do jogador (GT, vermelho, número 7).

**Veto (5.8):** nenhum item. Superfícies curvas contínuas, vidro com reflexo e interior visível (não é preto chapado), rodas com raios, disco e pinça, faróis emissivos, sombra de contato sob o carro. Ponto fraco: o carro está de costas para o sol, então a frente recebe só luz de céu e a sombra de contato é discreta — a frente parece um pouco "solta" do chão.

**Diferenças concretas em relação à referência:**

1. O carro da referência 11 tem kit aerodinâmico complexo (asa traseira alta com suportes, para-lamas alargados com saídas de ar, difusor com aletas, placa e emblemas); o nosso GT tem superfícies lisas: só lâmina dianteira, ducktail e prateleira de difusor, e a entrada de ar inferior é uma faixa escura única.
2. A referência está dentro de um galpão em ruínas com feixes de luz volumétricos atravessando o telhado e contorno de luz forte no carro; o nosso carro está a céu aberto, de costas para o sol, com luz difusa e chapada na frente e céu azul-acinzentado ao fundo.
3. As rodas da referência são de seis raios fundos, com letras no flanco do pneu e disco bem visível; as nossas têm cinco raios duplos escuros, flanco só com frisos, e o disco quase some atrás dos raios.
4. A pintura da referência reflete as vigas do galpão com contornos nítidos; a nossa reflete um gradiente largo e suave de céu — não há no entorno do grid nada de alto contraste para refletir.
5. O chão da referência é concreto empoeirado com detritos e manchas de luz; o nosso é asfalto uniforme com trincas e a caixa branca do grid.
6. Faróis: a referência (traseira) tem lanternas com elementos internos e profundidade de lente; os nossos faróis são uma lâmina de LED fina dentro de uma carcaça escura.

**Abaixo do alvo:**

- Detalhe de modelagem do carro (asa, saídas de ar reais, linhas de painel com rebaixo, interior dos faróis) — registrado desde o P2 e não resolvido.
- Luz no grid: o carro olha para longe do sol.

### S3 — `s3-praia-espuma.png` · câmera baixa: areia molhada, espuma, rochas

Comparada com `02-costa-praia-falesia.jpg` e `04-agua-margem-pedras.jpg` em `compare/s3.png`. Câmera a 1,1 m da areia molhada, olhando ao longo da linha d'água para o poente; HUD da corrida em curso.

**Veto (5.8):** nenhum item. Mar com ondulação em várias escalas e reflexo do sol, espuma na linha d'água e em volta das rochas maiores, areia molhada mais escura que a seca. Ponto fraco: poucas rochas no quadro e espuma fina — a imagem é limpa demais para um close.

**Diferenças concretas em relação à referência:**

1. Na referência 04 a água é transparente e refrata o fundo de seixos; a nossa não refrata: a parte rasa mostra só o reflexo do céu e um escurecimento com a profundidade, e a base submersa das rochas vira uma mancha escura.
2. A referência 04 tem dezenas de pedras arredondadas de tamanhos variados, com brilho molhado e sombra de contato; o nosso quadro tem cerca de dez rochas angulosas e espaçadas sobre areia uniforme.
3. Na referência há respingos e água revolvida pelos veículos; não temos partículas de água nem veículos na água.
4. A referência 02 mostra o mar passando de turquesa a azul profundo e uma praia longa com várias linhas de arrebentação; o nosso mar ao pôr do sol é cinza-azulado com uma única linha d'água e faixas tênues de espuma.
5. A referência 04 é emoldurada por arbustos e árvores na margem; o nosso close não tem vegetação no quadro (o capim de duna fica mais acima, fora do enquadramento).

**Abaixo do alvo:**

- Refração / cáusticas na água rasa e densidade de pedras na linha d'água — registrado desde o P3 e não resolvido.

### S4 — `s4-falesia-mirante.png` · serpentina com o mar abaixo

Comparada com `02-costa-praia-falesia.jpg` em `compare/s4.png`. Vista do mirante sobre o grampo superior da falésia (s ≈ 880 m), com o pelotão na curva e o mar ao fundo.

**Veto (5.8):** nenhum item. Estrada com zebras, faixas e mureta de pedra; terraço pavimentado com quiosque, bancos e placas; mar e horizonte visíveis (céu 27 %). Ponto fraco: o grampo está na sombra do fim de tarde e o talude interno é um monte baixo com textura de rocha esticada e uma faixa escura na base.

**Diferenças concretas em relação à referência:**

1. A referência tem um paredão de rocha alto e estratificado, com fraturas e blocos soltos em primeiro plano; o nosso tem um monte arredondado de ~5 m dentro do grampo, com textura de rocha esticada nas faces íngremes.
2. Na referência a baía aparece de cima com gradiente turquesa, praia em curva e uma serra no horizonte; no nosso quadro o mar é uma faixa azul-escura sob a névoa, sem praia à vista e sem relevo distante.
3. A encosta da referência é coberta de arbustos, cactos e pedras soltas; a nossa tem terraço pavimentado limpo e grama, com poucas árvores e arbustos.
4. A referência tem sol alto, sombras duras e cores saturadas; o nosso grampo fica na sombra do morro ao entardecer: pouco contraste no chão, só as copas pegam luz.
5. Os veículos da referência levantam poeira e ocupam o quadro; os nossos carros aparecem pequenos e sem poeira.

**Abaixo do alvo:**

- Falta um paredão de rocha alto neste enquadramento (o corte em rocha tem 3–5 m).
- Textura de rocha esticada em faces quase verticais.

### S5 — `s5-vila-rua.png` · rua da vila com o marco visível

Comparada com `05-vila-igreja-densidade.jpg` e `06-vila-pedra-disputa.jpg` e `07-vila-paredes-velocidade.jpg` em `compare/s5.png`. Gameplay em Alta na rua da vila (s ≈ 1 750 m, junto ao largo), a 93 km/h, com dois rivais à frente; a igreja com a torre sineira fecha a perspectiva à esquerda.

**Veto (5.8):** nenhum item. Fachadas sucessivas dos dois lados, janelas com moldura e venezianas, portas, beirais de telha, toldos, calçada, largo com árvores, céu aberto (15 %). Ponto fraco: a casa de pedra à direita mostra o padrão da textura de pedra em escala grande.

**Diferenças concretas em relação à referência:**

1. As referências 05–07 estão a pleno sol, com sombras duras e fachadas saturadas; a nossa rua está na sombra do sol baixo: fachadas com luz difusa de céu, e só a torre e o alto das paredes recebem sol direto.
2. As casas de pedra da referência 06 têm águas-furtadas, empenas, janelas de sacada e trepadeiras; as nossas são volumes simples de dois ou três andares com telhado de duas ou quatro águas, sem águas-furtadas nem trepadeiras.
3. A igreja da referência 05 tem frontão com nicho, arco de sino e reboco manchado pelo tempo, além de pessoas e barracas; a nossa tem fachada ocre lisa com óculo e torre quadrada, e não há figuras humanas (fora do escopo).
4. Na referência 07 as paredes passam a um metro do carro, com rastros fortes de motion blur e o carro nítido; a nossa rua tem 4,2 m de calçada de cada lado, então as paredes ficam mais longe e a sensação de velocidade é menor.
5. O asfalto das referências tem remendos e bordas com mato; o nosso é limpo, com zebras vermelhas e brancas — leitura de circuito dentro da vila.

**Abaixo do alvo:**

- Rua na sombra (consequência do sol a 6° e da orientação da rua).
- Riqueza de volumes das casas (sem águas-furtadas, sacadas salientes ou trepadeiras).

### S6 — `s6-bosque-luz.png` · bosque com sol rasante

Comparada com `08-vegetacao-densa.jpg` e `10-luz-rasante-floresta.jpg` em `compare/s6.png`. Gameplay em Alta na descida do bosque (s ≈ 2 800 m), a 133 km/h, dois rivais à frente.

**Veto (5.8):** nenhum item. Árvores de espécies e portes diferentes dos dois lados, arbustos junto à cerca, forração, céu em 23 % do quadro, sombras das copas na pista. Ponto fraco: a margem tem ~4 m de grama baixa antes da cerca, o que abre o quadro mais do que as referências.

**Diferenças concretas em relação à referência:**

1. A referência 10 tem feixes de luz volumétricos entre os troncos e poeira iluminada; nós temos apenas um brilho em espaço de tela junto ao sol, e o ar é limpo.
2. Na referência 08 a vegetação em camadas (samambaias, capim alto, folhas largas) chega à borda da pista e invade o primeiro plano; a nossa margem tem grama baixa e uma cerca de madeira antes das árvores.
3. Os pinheiros da referência 10 são altos, de tronco reto e copa fechada, sobre um chão de folhas secas alaranjadas com manchas de sol; os nossos pinheiros-mansos e oliveiras têm 8–10 m, copas baixas e arredondadas, sobre grama verde e marrom uniforme.
4. Nas referências a pista é de terra e os carros levantam poeira; a nossa é asfalto limpo, sem partículas neste quadro.
5. De meia distância, as copas das nossas árvores mostram os cartões de folha em blocos; as das referências têm ramos e folhas finos.

**Abaixo do alvo:**

- Luz volumétrica e vegetação alta encostada na pista (a faixa de exclusão de 3 m é respeitada, mas falta capim alto logo depois dela).

### S7 — `s7-ponte-ou-tunel.png` · entrada da ponte ligada ao terreno

Comparada com `14-ponte-terreno.jpg` em `compare/s7.png`. Câmera externa (a ponte é aberta) sobre o barranco do encontro norte, com o pelotão atravessando os cinco arcos de pedra sobre a enseada.

**Veto (5.8):** nenhum item. A ponte nasce do terreno sem vão (encontros entrando no barranco, guarda-corpos contínuos), pilares até a água, mar e horizonte visíveis (céu 32 %). Ponto fraco: a textura de rocha do barranco estica nas faces íngremes e a água da enseada é lisa demais ao longe.

**Diferenças concretas em relação à referência:**

1. A referência mostra a ponte de longe, cruzando um vale seco, com falésias estratificadas e uma serra ao fundo; a nossa aparece em diagonal a partir do encontro, sobre uma enseada azul, com o bosque baixo e o mar ao fundo — sem relevo distante.
2. O primeiro plano da referência é rico em poeira, plantas do deserto, pedras e veículos fora da pista; o nosso tem barranco de rocha com textura esticada, alguns blocos grandes e grama.
3. O céu da referência tem nuvens volumosas e balões; o nosso é um gradiente liso nesta direção.
4. A enseada tem um azul saturado, de dia claro, que destoa do tom dourado do resto da volta (ela reflete o céu do lado oposto ao sol); a referência não tem água para comparar, mas a coerência de cor é um ponto fraco nosso.
5. A caminhonete da referência levanta uma nuvem de poeira; não há partículas no nosso quadro.

**Abaixo do alvo:**

- Projeção da textura de rocha em faces quase verticais — registrado no P4 e não resolvido.

### S8 — `s8-disputa.png` · jogador lado a lado com 2+ IAs

Comparada com `09-vegetacao-curva-disputa.jpg` e `13-pelotao-ia-lado-a-lado.jpg` em `compare/s8.png`. Gameplay em Alta na reta da orla, a 190 km/h: o hatch azul à esquerda, o carro do jogador no meio e o GT amarelo à direita, emparelhados; outros três rivais à frente.

**Veto (5.8):** nenhum item. Três carros apoiados no chão com sombras longas e separadas, sem interpenetração; sol, mar e palmeiras; motion blur só no fundo.

**Diferenças concretas em relação à referência:**

1. Nas referências 09 e 13 a câmera está baixa e à frente do pelotão (3/4 frontal), com os carros enormes no quadro e rodas e faróis legíveis; a nossa é a câmera de perseguição do jogo, por trás e por cima, com os três carros vistos de traseira em tamanho médio.
2. Os carros das referências estão a pleno sol, com cores saturadas e reflexos de árvores e céu na pintura; os nossos estão em contraluz: traseiras quase em silhueta, só as faixas de lanterna e um fio de luz no contorno do GT amarelo.
3. Nas referências o cenário abraça a pista (árvores de outono, casas, taludes); o nosso trecho é a orla aberta, com palmeiras espaçadas e mureta baixa — o cenário fica longe dos carros.
4. A referência 13 tem cinco carros porta com porta enchendo a pista; nós temos três emparelhados com cerca de um metro entre eles e os outros três como pontos à frente.
5. As referências têm motion blur radial forte em todo o fundo; o nosso é discreto e aparece quase só no asfalto próximo.

**Abaixo do alvo:**

- Leitura dos carros em contraluz (as cores só aparecem quando o sol está de lado).

### S9 — `s9-close-pista.png` · close de asfalto, zebra e guard-rail

Sem referência indicada (`compare/s9.png` traz só a captura). Câmera baixa na entrada do grampo inferior da falésia (s ≈ 520 m): asfalto em primeiro plano, zebra vermelha e branca, guard-rail galvanizado com postes, corte de rocha e encosta ao fundo, um rival na curva.

**Veto (5.8):** nenhum item. O asfalto tem agregado, trincas, faixa de borda e borracha; a zebra tem relevo e tinta gasta; o guard-rail tem perfil em W, postes e sombra. Céu em 21 % (não exigido nesta captura). Ponto fraco: a luminância média é 0,28, a mais baixa das doze — o grampo está na sombra — e o corte de rocha aparece como uma faixa escura contínua contra a encosta clara.

**Abaixo do alvo:**

- Quadro escuro (0,28 de luminância média, limite 0,25).
- A parede de rocha em sombra lê como uma faixa escura uniforme.

### S10 — `s10-baixa-vila.png` · posição de S5 em Baixa

Sem referência indicada (`compare/s10.png` traz só a captura). Mesma posição, mesma câmera e mesmo instante da S5, no preset Baixa (resolução interna 1344×756 com FXAA, sem AO, sem motion blur, sem sonda de reflexo, sombras 1024²).

**Veto (5.8):** nenhum item. As mesmas casas, com as mesmas formas, texturas, toldos e a igreja; as árvores do largo continuam lá. Diferenças visíveis para a S5: bordas um pouco mais moles (70 % da resolução), sem escurecimento de oclusão nos cantos, sombras mais curtas e menos definidas, pintura do carro mais clara e sem o reflexo do entorno.

**Abaixo do alvo:**

- O carro perde o reflexo dinâmico e fica com a pintura mais chapada em Baixa.

### S11 — `s11-escala.png` · carro parado ao lado de uma casa com porta (escala)

Sem referência indicada (`compare/s11.png` traz só a captura). Inspeção estática, vista de frente para a fachada: o GT (4,56 m de comprimento, 1,24 m de altura) parado diante de três sobrados da rua da vila (s ≈ 1 710 m). Sem HUD.

**Veto (5.8):** nenhum item. Portas de 2,1 m com moldura (a porta tem ~1,7 vez a altura do carro), janelas com recuo, venezianas e floreira, pé-direito de ~3 m por andar, toldo listrado, soleira e calçada. Céu não exigido (1,6 %). Ponto fraco: desvio de luminância 0,14 — a fachada em sombra é um quadro de pouco contraste.

**Abaixo do alvo:**

- Fachadas vistas de frente e na sombra mostram pouca profundidade (beirais e molduras projetam pouca sombra com o sol atrás das casas).

### S12 — `s12-mapa.png` · vista de cima da volta inteira

Sem referência indicada (`compare/s12.png` traz só a captura). Mapa de inspeção: câmera a 2 km de altura, toda a península, sem HUD. Não é imagem fotográfica (métricas de composição não aplicáveis; valores brutos registrados em `image-metrics.json`).

**Veto (5.8):** não aplicável como imagem de gameplay. Serve para conferir que a estrada fecha, que o terreno encosta nela em toda a volta, que a vila (telhados, no alto do mapa), a ponte sobre a enseada (à direita) e a serpentina da falésia (à esquerda) estão onde `track.json` diz e que não há objeto sobre a pista. Neste modo o mar é desenhado sem brilho especular e a vegetação no nível de detalhe distante, para a leitura não depender do ângulo do sol.

**Abaixo do alvo:**

- A serpentina da falésia lê mal de cima: as pernas ficam próximas e o relevo não aparece numa vista vertical.

## 7. O que ficou abaixo do alvo

- **Baixa não foi medida numa GPU integrada** (ver seção 5). É a única meta numérica da seção 11 sem prova direta.
- **Atmosfera:** não há luz volumétrica nem poeira iluminada (referências 01 e 10); só névoa de distância, raios em espaço de tela e flare discreto.
- **Água:** sem refração do fundo, sem cáusticas e sem respingos (referência 04); a espuma é fina.
- **Carro:** superfícies lisas, sem asa, sem saídas de ar modeladas, linhas de painel desenhadas no shader, faróis sem elementos internos (referência 11).
- **Exposição:** a rua da vila e o grampo inferior ficam na sombra do sol a 6°; o fotômetro sobe a exposição nesses trechos e um carro ao sol rasante contra fundo em sombra fica com a pintura muito clara (visível em s ≈ 825 m e s ≈ 2 175 m). Limitar o ganho pelo assunto resolvia a pintura, mas derrubava a luminância média do grampo inferior para 0,19–0,23; a proteção ficou desligada.
- **Rocha:** a textura estica em faces quase verticais (S4, S7) e o corte de rocha em sombra lê como faixa escura (S9).
- **Vegetação:** copas em cartões de folha que aparecem em blocos a meia distância; falta capim alto encostado na faixa de exclusão.
- **Vila:** volumes simples (sem águas-furtadas, sacadas salientes, trepadeiras); calçada larga com pouco mobiliário no trecho reto.
- **IA:** em Difícil os cinco rivais ficam a menos de 2 s por volta uns dos outros e há poucas ultrapassagens (1–4 por corrida de 3 voltas). Um rival atingido de lado com força pode rodar para a área de escape e ser recolocado pela regra dos 3 s.
- **Texturas** em JPEG (não KTX2/Basis): 91 MB em `assets/textures`, 131 MB em `assets/` no total; o jogo inteiro (sem `verification/`) tem cerca de 135 MB.
- **Memória:** cerca de 700 MB reportados por `performance.memory` (inclui os buffers de geometria mantidos em CPU depois do envio à GPU).
- **Margens das métricas de imagem:** na varredura, o maior bucket de cor é 26,9 % (s = 825 m; limite 30 %), a menor luminância é 0,282 (s = 550 m; limite 0,25) e o menor céu é 12,4 % (s = 575 m; limite 10 %); nas capturas, o menor desvio é 0,140 (S11; limite 0,12) e a menor luminância é 0,282 (S9).
