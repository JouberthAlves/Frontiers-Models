# Relatório de Verificação Final — Costa Dourada (Racing-bench V3.4)

## 1. Resumo Executivo e Hardware Testado
- **Hardware / Driver:** `NVIDIA GeForce RTX 3070 Ti` (ANGLE Direct3D11 vs_5_0 ps_5_0), CPU `16` núcleos lógicos (`navigator.hardwareConcurrency`), Chromium Headless `1920×1080` (`npm run verify`).
- **Status Geral:** APROVADO em todos os portões (`P1`–`P6`) com `0` erros de console, `0` requisições externas ou falhas offline, `0` violações geométricas ou de colisão na volta completa (`104,19 s` gravados ao vivo em `volta.webm`).

---

## 2. Desempenho em Zona Densa (Z3 — Vila da Costa, `1920×1080`)
Medição contínua por deltas de `requestAnimationFrame` durante `120` quadros na posição `S5` (`s=2235 m`, maior densidade de casas com molduras/telhados/balcões, iluminação e sombras):

| Preset Gráfico | FPS Médio | 1% Low | Observação |
|---|---:|---:|---|
| **Alta** (`HDR + Bloom + Motion Blur + Shadows 2048²`) | **59,5 FPS** | **30,0 FPS** | Limitado por V-Sync de `60 Hz` do Chromium |
| **Baixa** (`Sem EffectComposer, sombras reduzidas`) | **58,2 FPS** | **29,9 FPS** | Limitado por V-Sync de `60 Hz` no desktop de teste |

---

## 3. Auditoria do Mundo e Grafo de Cena (`scene-stats.json`)
- **`validateWorld()` (`ok: true`, `0` erros):**
  - Comprimento do circuito fechado (`track.json`): `3169,6 m` (faixa alvo: `2500–3500 m`)
  - Rampa máxima longitudinal: `10,26%` (limite: `≤ 14%`)
  - Inclinação lateral máxima (banking): `5,0°` (limite: `≤ 12°`)
  - Raio mínimo de curva: `25,35 m` (limite: `≥ 25 m`)
  - Terreno máximo acima da pista: `-0,0196 m` (`≤ 0,02 m`)
  - Vão máximo borda/terreno: `0,0845 m` (`≤ 0,15 m`)
  - Checkpoints em sequência: `24`, `0` erros; divergência collider Rapier vs visual (60 sondas): `0`
  - Casas na Vila (`Z3`): `80` em `5` variações distintas; `0` sobreposições; `0` violações da faixa de exclusão `≥ 3 m`; `0` violações de aterramento
  - Espécies de vegetação: `4` (`palmeira`, `pinheiro_manso`, `oliveira`, `arbusto`) + samambaias e gramíneas GLTF; densidade mínima de props/vegetação em qualquer janela de `100 m`: `15` (mínimo: `12`)
- **`runSceneGraphAudit()` (`ok: true`, `0` erros):**
  - Carros no grid (`6`): `Veloce GT` (`25.708` triângulos, `9` materiais); `Solara RS` (`25.608` triângulos, `9` materiais) — acima de `≥ 15.000` triângulos e `≥ 6` materiais
  - Detector de caixas (`BoxGeometry` ou `≤ 12` triângulos com dimensão `> 1 m` perto da pista): `0` violações
  - Detector de materiais planos sem `map` + `normalMap`: `0` violações
  - Detector de texturas pequenas (`< 1024 px` / asfalto `< 2048 px`): `0` violações
  - Motor do jogador usando `AudioBuffer` real (`6` loops `.wav` + camadas alternadas): `true`

---

## 4. Áudio e Vídeo da Volta Completa (`volta.webm` + `audio-volta.wav`)
- **Vídeo (`verification/volta.webm`):** `57,1 MB`, `1280×720`, preset **Alta**, câmera de perseguição, `5` IAs na pista do grid (`P6` → chegada em `5º`) até a tela de resultados.
- **Áudio capturado (`verification/audio-volta.wav`):** `20,0 MB`, estéreo `48.000 Hz`, PCM 16-bit, duração `104,19 s`.
  - **Pico real medido no PCM:** **`-8,34 dBFS`** (teto exigido `≤ -1,0 dBFS`)
  - **RMS médio:** **`-21,50 dBFS`**
  - **Vazamento de vozes em 3 reinícios consecutivos:** `[20, 20, 20, 20]` (`0` vozes vazadas)
- **Timestamps de eventos sonoros observados na volta:**
  - `00:00` — Arranque em `Gear 1` (`1270 RPM`) + passagem próxima de IA `#4` (`d = 6,7 m`, PannerNode 3D)
  - `00:02` / `00:03` / `00:07` — Trocas de marcha ascendentes `Gear 2` (`6951 RPM`) → `Gear 3` (`7023 RPM`) → `Gear 4` (`7510 RPM`) com corte momentâneo de troca
  - `00:30`–`00:33` — Reduções na subida da Falésia (`Gear 3 → 2 → 1`)
  - `00:37` / `00:40` / `01:10` — Retomadas `Gear 2 → 3 → 4` ao entrar na Vila (`Z3`)
  - `01:27` e `01:34` — Passagens próximas de IA `#3` (`d = 10,0 m`) no descenso de `Z4`
  - `01:35` — Travessia da ponte do desfiladeiro de `Z4` (`bridge`, som de rolagem + pulso de juntas de dilatação)
  - `01:38` — Redução `Gear 3` (`3158 RPM`) antes da reta final

---

## 5. Varredura e Sanidade de Imagem (`S1`–`S12` e `sweep/`)
- **Varredura (`verification/sweep/` + `verification/sweep-sheet.png`):** `127` capturas a cada `25 m` ao longo de `3169,6 m`; **`0` falhas de sanidade** em todo o percurso.
- **Métricas de `S1`–`S12` (`verification/image-metrics.json`):**

| ID | Arquivo | Luminância Média | Desvio Padrão | Céu Visível | Cor Única Máx. | Status |
|---|---|---:|---:|---:|---:|---|
| S1 | `s1-reta-orla-60fps.png` | 0,5829 | 0,2702 | 46,21% | 7,41% | PASS |
| S2 | `s2-grid-3-4-60fps.png` | 0,3786 | 0,2238 | 21,34% | 9,33% | PASS |
| S3 | `s3-praia-espuma-60fps.png` | 0,6591 | 0,1972 | 43,13% | 7,78% | PASS |
| S4 | `s4-falesia-mirante-60fps.png` | 0,4869 | 0,2409 | 47,56% | 5,06% | PASS |
| S5 | `s5-vila-rua-60fps.png` | 0,4123 | 0,2410 | 36,58% | 6,57% | PASS |
| S6 | `s6-bosque-luz-60fps.png` | 0,4423 | 0,2398 | 31,30% | 5,15% | PASS |
| S7 | `s7-ponte-60fps.png` | 0,5334 | 0,2765 | 38,00% | 8,67% | PASS |
| S8 | `s8-disputa-60fps.png` | 0,5715 | 0,2939 | 46,86% | 7,28% | PASS |
| S9 | `s9-close-pista-60fps.png` | 0,6700 | 0,2747 | 51,93% | 9,64% | PASS |
| S10 | `s10-baixa-vila-58fps.png` | 0,4106 | 0,2413 | 36,27% | 6,52% | PASS |
| S11 | `s11-escala-60fps.png` | 0,3830 | 0,2580 | 29,01% | 11,16% | PASS |
| S12 | `s12-mapa-60fps.png` | 0,3723 | 0,0888 | 20,40% | 11,77% | Mapa zenital (fora do critério S1–S9) |

---

## 6. Autoavaliação Visual e Diferenças Concretas vs. Referências (`compare/s1.png`..`s9.png`)

### S1 — Reta da Orla em velocidade (`compare/s1.png` vs. Ref 01)
- **Avaliação:** Boa legibilidade do degradê azul→ouro, motion blur radial preservando o `Veloce GT #07` nítido, sombras alongadas na pista e pelotão visível à frente. Abaixo do alvo no brilho especular do asfalto e na riqueza atmosférica das nuvens/palmeiras.
- **Diferenças concretas vs. Ref 01:**
  1. Na Ref 01, o asfalto apresenta reflexo especular intenso e espalhamento dourado do sol lateral esquerdo; no S1, o asfalto permanece fosco/seco com o sol posicionado à frente-direita.
  2. As copas das palmeiras da Ref 01 possuem volume denso e silhueta sobre nuvens rosa/violeta; no S1 as palmeiras têm menos frondes e céu mais limpo sem nuvens volumétricas baixas.
  3. O ângulo da Ref 01 é 3/4 traseiro bem baixo com difusor/grade e placa detalhadas, ao passo que S1 usa câmera chase simétrica com linhas mais simples na traseira.

### S2 — Grid 3/4 frontal sem HUD (`compare/s2.png` vs. Ref 11)
- **Avaliação:** Carro com `25.708` triângulos, pintura clearcoat, vidros translúcidos com bancos/volante internos, números `#07` nítidos sem espelhamento, aros 5 raios duplos com discos/pinças e sombra de contato limpa no asfalto 2K. Abaixo do alvo na complexidade de micro-componentes e iluminação dramática de hangar.
- **Diferenças concretas vs. Ref 11:**
  1. A Ref 11 se passa sob estrutura metálica com feixes de luz volumétricos oblíquos; S2 ocorre a céu aberto no grid da orla sob sol direto.
  2. O carro da Ref 11 inclui para-lama ventilado, dutos laterais profundos, placa e frestas escurecidas bem marcadas; nosso `Veloce GT` tem superfície contínua mais lisa com menos recortes mecânicos.
  3. O piso na Ref 11 exibe reflexos especulares variados no pavimento úmido, enquanto S2 mostra asfalto seco uniforme.

### S3 — Praia, areia molhada, espuma e rochas (`compare/s3.png` vs. Ref 04)
- **Avaliação:** Transição clara de areia molhada escurecida na maré, degradê raso azul-turquesa→safira, anéis de espuma ao redor das rochas costeiras e reflexo dourado no horizonte. Abaixo do alvo em diversidade de pedregulhos na margem e vegetação junto à água.
- **Diferenças concretas vs. Ref 04:**
  1. A Ref 04 mostra veículos atravessando raso riacho com splashes 3D e galhos retorcidos em primeiro plano; S3 foca apenas a faixa de arrebentação sem carros dentro d'água.
  2. A margem esquerda da Ref 04 acumula dezenas de pedras médias variadas e folhagem pendente; em S3 há poucas rochas maiores espaçadas sobre areia mais lisa.
  3. A água da Ref 04 reflete copas escuras próximas; em S3 o mar aberto reflete principalmente o brilho do entardecer.

### S4 — Serpentina da Falésia e Mirante (`compare/s4.png` vs. Ref 02)
- **Avaliação:** Mostra a curva elevada de Z2 com zebras e guardrail, carros em disputa e a costa de Z1 com palmeiras e mar ao fundo sem obstrução do terreno. Abaixo do alvo em verticalidade dos paredões rochosos internos e textura de rocha exposta.
- **Diferenças concretas vs. Ref 02:**
  1. A Ref 02 ocorre em pista de terra batida com grande paredão vertical de rocha clara à esquerda; S4 é uma rodovia asfaltada cercada por taludes de grama/terra mais suaves.
  2. A baía na Ref 02 desenha um arco de areia extenso acompanhado por cordilheira alta no horizonte; em S4 a costa de Z1 vista de cima parece mais retilínea e sem cadeias de montanhas atrás.
  3. Os veículos da Ref 02 erguem densa poeira suspensa no primeiro plano, enquanto em S4 os carros correm limpos sobre asfalto.

### S5 — Rua da Vila e Igreja (`compare/s5.png` vs. Ref 05)
- **Avaliação:** Rua a céu aberto com casas coloridas em 5 variações (toldos, sacadas, venezianas, embasamentos em pedra, chaminés) e a torre/campanário da igreja bem enquadrada. Abaixo do alvo em acabamento orgânico do entorno e vida urbana.
- **Diferenças concretas vs. Ref 05:**
  1. A Ref 05 traz igreja de fachada barroca complexa com pessoas na praça e vegetação densa entre os prédios; S5 apresenta fachada geométrica mais limpa e praça sem personagens.
  2. O fundo atrás da igreja na Ref 05 é fechado por morros altos e pinheiros contínuos; em S5 os fundos atrás das casas descem para um horizonte mais aberto e plano.
  3. O leito da rua na Ref 05 mistura terra e pedra irregular, enquanto S5 possui asfalto limpo e fileira regular de casas ao longo da via.

### S6 — Bosque e luz rasante (`compare/s6.png` vs. Ref 08)
- **Avaliação:** Descida rápida cercada por pinheiros-mansos e oliveiras com troncos curvos, zebras vermelhas/brancas e sol baixo entrando pelo fim da descida. Abaixo do alvo na estratificação rasteira de samambaias/capim alto e raios volumétricos filtrados.
- **Diferenças concretas vs. Ref 08:**
  1. A Ref 08 possui sub-bosque muito denso (folhagem larga, samambaias e capim cobrindo as margens) com raios volumétricos atravessando a névoa; em S6 as copas ficam mais altas e espaçadas sobre grama limpa.
  2. Em S6 há faixas de copas horizontais visíveis nos cards cruzados quando observadas de lado; na Ref 08 a folhagem é mais volumosa e irregular.
  3. A Ref 08 mostra carros de rali levantando poeira em estrada de terra, ao passo que S6 usa pista asfaltada.

### S7 — Ponte do Desfiladeiro integrada ao terreno (`compare/s7.png` vs. Ref 14)
- **Avaliação:** A ponte de pedra se apoia em quatro pilares firmes sobre o fundo do desfiladeiro, com cabeceiras contínuas nas duas encostas, zero descolamento e longas sombras ao entardecer. Abaixo do alvo em detalhe geológico das paredes do vale.
- **Diferenças concretas vs. Ref 14:**
  1. A Ref 14 mostra viaduto de vão largo visto de baixo com montanha rochosa ao fundo e balões distantes; S7 foca a ponte de pedra vista de lado contra o sol rasante.
  2. O chão sob o vão em S7 tem poucos arbustos espaçados, com menos blocos de pedra e vegetação rasteira do que o primeiro plano da Ref 14.
  3. O bloom solar direto atrás dos pinheiros à direita em S7 estoura levemente o contorno das copas, enquanto a Ref 14 mantém contraste nítido no céu azul.

### S8 — Pelotão lado a lado (`compare/s8.png` vs. Ref 13)
- **Avaliação:** Disputa genuína lado a lado entre `Veloce GT #07`, `Solara RS` e rivais com pinturas distintas, sombras longas na pista e leitura imediata do HUD. Abaixo do alvo em variação de altitude/enquadramento cinematográfico e árvores densas ao redor.
- **Diferenças concretas vs. Ref 13:**
  1. A Ref 13 enquadra pela frente com foco invertido nos capôs/faróis e pilotos visíveis no interior; S8 usa câmera chase traseira acompanhando a disputa na orla.
  2. O entorno na Ref 13 é fechado por casas de madeira e árvores de outono vibrantes dos dois lados; S8 se passa em área costeira aberta à direita para a praia e o oceano.
  3. O desfoque de movimento na Ref 13 borra fortemente as laterais mantendo todos os carros dianteiros nítidos; em S8 apenas o carro do jogador é mascarado do blur radial.

### S9 — Close de pista, zebra e borda (`compare/s9.png`)
- **Avaliação:** Boa visibilidade da granulação 2K do asfalto com fissuras e mapa normal, linha branca contínua, zebra tricolor em relevo, postes costeiros e mar dourado. Ponto fraco: neste ângulo da orla (`s=555`), a borda direita possui cerca de madeira de duna em vez do guardrail metálico presente na esquerda/Z2 (`s4-falesia-mirante` mostra o guardrail metálico junto à zebra).

### S10–S12 — Baixa (`58 FPS`), Escala (`11`) e Mapa (`12`)
- **S10 (`s10-baixa-vila-58fps.png`):** Mantém casas, igreja e carros perfeitamente legíveis em preset Baixa com `58,2 FPS` na vila (sem `EffectComposer` e com sombras simplificadas).
- **S11 (`s11-escala-60fps.png`):** Carro estacionado na guia confirma proporção real coerente diante da porta de `2,1 m` e fachada de 2–3 andares.
- **S12 (`s12-mapa-60fps.png`):** Circuito fechado completo de `3,17 km` sem quebras; ponto fraco visível nos cantos retangulares da ilha de terreno (`1480×1040 m`) onde a transição com o oceano distante forma borda reta na vista aérea.
