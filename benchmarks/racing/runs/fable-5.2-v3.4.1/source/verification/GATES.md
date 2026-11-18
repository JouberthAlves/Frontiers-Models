# GATES — registro dos portões (seção 12 do Racing-bench V3.4.1)

Cada portão lista o que foi construído, a evidência gerada pelo código, o que estava **abaixo do alvo** quando o portão foi avaliado e o que foi corrigido antes de avançar. As imagens de cada portão ficam em `verification/gates/`.

---

## P1 — Esqueleto

**Construído:** `track.json` (gerado por `scripts/make-track.mjs`, 374 pontos de controle, 3367 m), spline amostrada a 1 m, malha da estrada + faixas laterais, collider da estrada (mesmas linhas de vértices da malha), terreno heightfield 801×537 @ 2 m conformado à estrada, collider do terreno (mesmo heightfield), barreiras em espaço de pista, física do veículo (120 Hz), carro-placeholder dirigível, câmera de perseguição com colisão.

**Evidência**

| Verificação | Resultado |
| --- | --- |
| `validateWorld()` (Node, `npm run validate`, e no carregamento em `?dev=1`) | **OK**, 0 erros |
| terreno acima da estrada dentro da pista | pior caso −0,052 m (terreno sempre ≥ 5 cm abaixo; limite +0,02 m) |
| vão borda da estrada × terreno | pior caso 0,118 m (limite 0,15 m); trecho isento: tabuleiro da ponte + encontros, fechado por guarda-corpos |
| inclinação lateral / longitudinal / raio mínimo | 5,5° / 9,8 % / 27,2 m (limites 12° / 14 % / 25 m) |
| checkpoints | 34, na pista e em sequência |
| collider × malha da estrada | diferença máxima 0,000 m em 4000 amostras (o collider interpola os mesmos triângulos) |
| 1 volta dirigida (piloto automático, 6 carros, no navegador, `scripts/dev/lap.mjs`) | volta completa; **0** eventos de carro sob o terreno, atravessando barreira, fora do mundo ou roda a > 1,5 m; **0** quadros com a câmera dentro de geometria |
| vista de cima da volta inteira | `gates/p1-top.png` |

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. O terreno ficava até 13 cm **acima** da estrada onde a plataforma larga da vila encostava em outro trecho (r3/legN): a conformação tratava um ponto distante do trecho vizinho como se estivesse "sobre a pista". Corrigido usando a distância real ao eixo (não só a componente lateral) e mistura ponderada entre trechos.
2. Nos encontros da ponte o terreno natural subia acima do tabuleiro. Corrigido com um teto de altura sob/ao lado do tabuleiro.
3. O collider da estrada diferia da malha em até 6 mm em curvas inclinadas (interpolação bilinear × triângulos). O collider passou a interpolar exatamente os triângulos da malha (erro 0).
4. O carro "decolava" em descidas fortes: o batente de segurança da suspensão comparava a carroceria com alturas de solo do passo anterior. Corrigido (o batente usa o solo atual e a carroceria apenas acompanha o chão).
5. O GT (tração traseira) rodava nas saídas de curva com o piloto automático. O controle de tração passou a respeitar o círculo de atrito (prioriza a força lateral).
6. Volta ideal de 78 s (fora da faixa 1:45–2:30 do briefing). Aderência e potência reduzidas, vila redesenhada com cotovelo, última curva mais fechada, pernas da serpentina mais longas: volta ideal ≈ 100 s, IA/piloto automático ≈ 1:44–1:51 com tráfego.
7. O shader do terreno estourava o limite de 16 samplers do backend D3D11 (ANGLE). As 7 camadas PBR passaram para dois `sampler2DArray`.

**Ainda abaixo do alvo ao fechar o P1 (tratado nos portões seguintes, não é escopo do P1):** carro é um placeholder (P2); não há mar, praia nem barreiras visíveis (P3); o terreno visto de cima mostra manchas verde/cinza muito contrastadas (ajuste de materiais no P3); sem casas, vegetação e props (P3/P4).

---

## P2 — Luz e carro

**Construído:** HDRI CC0 de pôr do sol (Poly Haven `qwantani_sunset_puresky`, sol a 6,1°) como céu, luz ambiente e reflexos; sol direcional na mesma direção, cor derivada da auréola do HDRI; sombras em cascata (3 cascatas, PCF, câmera-proxy de FOV fixo para não cintilar quando o FOV varia com a velocidade); sombra do relevo pré-calculada (o sol é fixo); pipeline HDR (AO, motion blur com máscara dos carros, bloom, raios de sol, flare, ACES, sRGB); **carros finais**: dois modelos projetados como campos de distância (`scripts/cars/designs.mjs`) e convertidos em malha (`scripts/cars/bake.mjs`), pintura clearcoat com faixas/número/linhas de fechamento, vidro com reflexo e transparência sobre interior escuro, cromo, borracha, plástico fosco, faróis e lanternas emissivos, rodas com raios, disco e pinça, sombra de contato, luz de freio; sonda de reflexo dinâmica (cubemap ao redor do carro do jogador).

**Evidência**

| Verificação | Resultado |
| --- | --- |
| `gates/p2-s1.png` (perseguição a 187 km/h na orla, sol à frente) | sombra longa do carro visível na pista; céu = 35 % do quadro (medido no depth buffer) |
| `gates/p2-s2.png` (grid, 3/4 frontal baixa, sem HUD) | carro final com todos os materiais |
| triângulos LOD0 | GT 244 mil (carroceria) + rodas; hatch 252 mil + rodas (mínimo exigido: 15 mil) |
| materiais distintos por carro | 12 (pintura, vidro, plástico, interior, carcaça do farol, farol emissivo, lanterna emissiva, cromo, pneu, aro, disco, pinça) |

**S2 × referência 11 — diferenças concretas (abaixo do alvo)**

1. A referência tem aerodinâmica agressiva (asa traseira com suportes, para-lamas alargados com saídas de ar, difusor com aletas); o nosso GT tem superfícies lisas com apenas ducktail, lâmina frontal e prateleira de difusor — sem asa, e as saídas do capô são só rebaixos rasos.
2. Na referência a pintura reflete a estrutura do galpão com faixas nítidas e tem contorno de luz forte nas bordas superiores; no P2 a nossa pintura reflete só o gradiente do céu e o asfalto (ainda não há cenário em volta), então os brilhos são largos e suaves.
3. As rodas da referência são de seis raios fundos, com letras no flanco do pneu e disco ventilado bem visível; as nossas têm cinco raios duplos, flanco só com frisos e o disco fica quase escondido atrás dos raios.
4. Os faróis/lanternas da referência têm elementos internos (LEDs, refletores, profundidade de lente); os nossos são uma faixa emissiva dentro de uma carcaça escura e uma barra de luz traseira plana.
5. As linhas de porta/capô são desenhadas no shader (escurecimento de 2–3 mm), sem rebaixo real; não há maçanetas nem tampa de combustível.
6. O chão da referência é concreto úmido com reflexo; o nosso asfalto é seco e a sombra de contato é mais difusa.
7. A referência tem feixes de luz volumétricos; no nosso quadro só há névoa de horizonte (os raios de sol em espaço de tela só aparecem com o sol no quadro).

**S1:** sombras visíveis (a sombra do carro percorre ~12 m em direção à câmera), céu à vista, sol à frente com brilho rasante no asfalto.

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. Imagem lavada e carro "salmão" com AgX → trocado para ACES (exposição 0,86, saturação +10 %).
2. Número espelhado na porta direita → projeção corrigida.
3. Serrilhado ("zíper") nas bordas do vidro e no lábio dos arcos de roda (artefato do surface nets em vincos) → relaxação Laplaciana antes da projeção na superfície e borda pintura/caixa de roda deslocada para a parede lisa.
4. Céu branco-acinzentado na direção do sol → graduação quente do próprio HDRI ao redor do sol (céu, névoa e luz ambiente usam o mesmo dado).
5. As capturas perdiam o motion blur (o loop de animação redesenhava o quadro parado) → API de captura com quadro retido.
6. A sonda de reflexo estourava as 16 unidades de textura (filtragem PMREM aninhada na configuração do material) → filtragem feita entre quadros.

**Ainda abaixo do alvo ao fechar o P2 (registrado para o polimento P6):** itens 1, 3, 4 e 5 da comparação acima (detalhe de modelagem do carro). Itens 2, 6 e 7 dependem do cenário e são reavaliados no P3.


---

## P3 — Orla completa (fatia vertical)

**Critério:** Z1 com mar, praia, espuma e props; S1 e S3 comparáveis às referências 01, 02 e 04. Z1 precisa parecer pronta antes de começar Z2.

**O que entrou**

- **Mar** (`src/render/sea.js`): malha polar que acompanha a câmera, 4 ondas de Gerstner amortecidas no raso, cor e opacidade pela profundidade real (campo de altura do terreno), reflexo do céu com Fresnel de superfície rugosa, trilha de brilho do sol, espuma (faixa borbulhante na linha d'água que se abre em rede, linhas deixadas por ondas anteriores, anéis em volta das pedras grandes) e avanço/recuo da lâmina d'água.
- **Barreiras** (`src/render/barriers-view.js`): mureta de pedra com pilaretes (lado do mar), blocos de concreto de 4 m com juntas, pintados de vermelho/branco nas curvas, pilhas de pneus, guard-rail, corte em rocha, muro de pedra seca, cerca de madeira e parapeito da ponte — todas geradas a partir de `track.barOff` / `track.barType`, os mesmos vetores usados pela colisão. Só as barreiras da orla foram inspecionadas em imagem neste portão; as das outras zonas ficam para a inspeção do P4.
- **Flora procedural** (`src/render/plants.js`): 5 espécies de árvore, 5 de arbusto e 5 de cobertura rasteira, cartões de folha com recorte alfa, 3 variantes e 3 níveis de detalhe cada; mipmaps do atlas com cobertura preservada (a copa não rareia com a distância).
- **Props** (`src/render/props.js`): 21 tipos (poste, banco, floreira, lixeira, mastro com bandeira, mesa de café, guarda-sol, espreguiçadeira, cerca de areia, barco, posto de salva-vidas, placas, marcos, caixotes, barris, poste de energia etc.).
- **Quiosques** (`src/render/houses.js`): construções com aberturas rebaixadas, balcão, toldo, placa, beiral e telhado de telha — o mesmo gerador que fará a vila no P4.
- **Pórtico de largada** em treliça com faixa "CIRCUITO COSTA DOURADA" e cinco luzes de largada (acendem no P5).
- **Pedras**: 829 pedras e blocos + 484 seixos na linha d'água, cada um com inclinação e achatamento próprios.

**Evidências**

| Verificação | Resultado |
| --- | --- |
| `validateWorld()` | OK — 16 800 objetos; faixa de exclusão: menor folga 3,06 m (limite 3,0); base dos objetos a no máx. 1,7 cm do terreno |
| Props por janela completa de 100 m em Z1 (562 m) | 48, 68, 68, 61, 59 (mínimo exigido: 12) |
| Objetos em Z1 | 794 pedras, 327 props, 126 árvores, 273 arbustos, 1 416 tufos de cobertura, 4 quiosques |
| `gates/p3-s1.png` (pelotão a 209 km/h na reta da orla, sol à frente) | céu = 27 % do quadro; luminância média 0,435, desvio 0,283; maior bucket de cor (4 bits/canal) 13,6 % |
| `gates/p3-s3.png` (câmera a 0,7 m da areia molhada) | céu = 46 %; luminância média 0,650, desvio 0,176; maior bucket 5,4 % |
| Volta completa em piloto automático com 6 carros | 0 eventos de integridade (carro sob o terreno, através de barreira, fora do mundo, roda longe do chão, câmera dentro de geometria); voltas das IAs 104,3–109,8 s |
| FPS, Alta, 1920×1080, 6 carros juntos (RTX 3070 Ti, Chrome headless sem limite de quadros) | 104–118 de média, 1 % low 67–84, em s = 40, 150, 250 e 900 m; CPU de render 8–10 ms por quadro |

**S1 × referências 01 e 02 — diferenças concretas (abaixo do alvo)**

1. A referência 01 tem poeira/névoa volumétrica espessa e iluminada perto do chão, que apaga o horizonte; a nossa névoa é só uma faixa fina de distância e uma nuvem do HDRI — menos profundidade atmosférica.
2. As palmeiras da referência têm copas mais cheias e desgrenhadas (dezenas de frondes sobrepostas, saia de folhas secas) e troncos grossos com textura marcada; as nossas têm 27 frondes limpas e tronco liso.
3. A beira da estrada na referência é natural (arbustos secos, acostamento de areia, postes com fios); a nossa é de circuito (mureta e blocos de concreto) e os postes de energia não têm cabos.
4. Na referência o reflexo do sol no asfalto é uma faixa larga e muito brilhante, com brita solta na borda; o nosso brilho rasante existe mas é mais contido e a borda da pista é limpa.
5. O carro da referência tem muito mais detalhe de superfície (asa, difusor, placa, entradas de ar); o nosso tem traseira lisa (já registrado no P2 para o P6).
6. A referência 02 mostra montanhas ao fundo e gradiente turquesa com o fundo do mar visível no raso; no nosso quadro o mar ao pôr do sol tem pouco contraste e ao fundo só há morros baixos.

**S3 × referências 02 e 04 — diferenças concretas (abaixo do alvo)**

1. Na referência 04 a água é transparente com refração: as pedras submersas aparecem deformadas e com cáusticas; a nossa água não refrata — a parte submersa das pedras aparece como uma forma mais escura de contorno duro.
2. As pedras da referência são muitas, arredondadas, de tamanhos variados, com brilho molhado e sombra de contato, sobre lama com gravetos e folhas; as nossas são poucas no quadro, facetadas (o polígono aparece de perto) e estão sobre areia uniforme.
3. A referência 02 tem várias linhas de onda quebrando e faixas de algas na praia; a nossa tem uma única faixa de espuma, com rede celular de padrão regular, e a linha d'água quase reta.
4. A referência 04 tem vegetação (arbusto, árvore) emoldurando a margem e respingos; o nosso close não tem vegetação no quadro (o capim de duna fica mais acima na praia) nem partículas de água.
5. A areia da referência tem marcas (pegadas, sulcos, detritos); a nossa só tem ondulações suaves da textura e seixos pequenos.

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. **Desempenho:** a primeira versão rodava a ~23 FPS em Alta a 1080p (≈2 500 draw calls). Causas e correções: (a) uma malha instanciada por protótipo × célula → objetos pequenos fundidos por célula e faixa de distância (`src/render/scatter.js`), com células maiores para as faixas distantes; (b) cada objeto redesenhado em 3 cascatas de sombra → sombras projetadas por malhas-proxy fundidas numa passada própria (`src/render/shadow-proxy.js`), cascatas distantes em quadros alternados; (c) a sonda de reflexo re-renderizava as sombras → reaproveita os mapas do quadro, uma face a cada dois quadros; (d) three.js recalculava as matrizes de ~1 500 objetos estáticos 4× por quadro → atualização automática desligada, lista curta de objetos dinâmicos; (e) o estado das luzes mudava entre passadas e revalidava todos os materiais → luzes visíveis em todas as passadas; (f) materiais alternando entre malha instanciada e não instanciada → instâncias separadas. Resultado: 104–118 FPS.
2. **Céu estourado em branco** na direção do sol → intensidade da cúpula 0,62 → 0,34 (as nuvens laranja do HDRI voltaram a aparecer).
3. **Mar sem horizonte** (espelho perfeito do céu claro no ângulo rasante) → Fresnel com inclinação mínima das ondas não resolvidas e reflexo desviado acima do horizonte; adicionada a trilha de brilho do sol.
4. **Espuma** era uma faixa branca lisa de ~15 m e um véu poligonal em volta das pedras → faixa estreita e quebrada em manchas, rede celular, anéis só nas pedras grandes e em forma de rede.
5. **Palmeiras** com tronco de 0,8 m de diâmetro e copas bege contra o sol → tronco 0,35–0,55 m; o bege era o brilho especular rasante de um dielétrico liso aplicado a folhas e casca, reduzido para 12 % (folhagem) e 30 % (casca); frondes com lâmina central sólida e mais folíolos.
6. **Guarda-sóis** com listras concêntricas (um único vértice no topo) → 8 gomos com listras radiais e saia recortada.
7. **Pedras** pareciam domos lisos e a parte molhada espelhava o céu (aspecto de vidro) → mais planos de corte e sombreamento mais duro, pose própria por pedra, brilho molhado suave, parte submersa escura e sem sol direto.
8. **Câmera** atravessava a linha da cerca quando o carro rodava na área de escape (18 quadros numa volta) → limite rígido além da mola: se a posição suavizada ainda estiver além da barreira, recua de imediato e, se preciso, desliza de volta para dentro da linha. Volta repetida: 0 quadros.
9. **Bandeiras e tecidos** estouravam em branco ao sol baixo → albedo reduzido.

**Ainda abaixo do alvo ao fechar o P3**

- Itens 1–4 e 6 da comparação da S1 e 1–5 da S3 (acima). O mais visível é a falta de refração/cáusticas na água rasa e a pouca névoa volumétrica; ambos entram na lista de polimento do P6.
- **IA na curva longa (s ≈ 2 590 m):** na volta de teste, dois carros (o do jogador em piloto automático, vindo do fundo do pelotão, e a IA 2) alargaram a entrada, ficaram mais de 3 s na área de escape e foram reposicionados pela regra de 3 s fora da pista (reset registrado, não é evento de integridade). A frenagem fora da linha ideal precisa de margem — correção marcada para o P5, junto com as regras de corrida.
- O preset Baixa ainda não foi medido.


---

## P4 — Zonas 2 a 4 (falésia, vila, bosque, ponte)

**Critério:** S4–S7 aprovadas; `validateWorld()` sem erros; cotas de unidades / frentes urbanizadas e de árvores / massas arbustivas / forração por trecho cumpridas; tecido urbano e flora diversa comprovados na varredura de 25 m.

**O que entrou**

- **Z2 Falésia:** corte em rocha de um lado e guard-rail do outro; terraço do mirante no grampo superior (s ≈ 860–925 m) com quiosque, mesas, bancos virados para a vista, lunetas, postes, floreiras, mastros e mureta externa; farol branco e vermelho de 26 m no promontório (visível da perna oeste e da subida); perna oeste (s ≈ 1330–1530 m) a 58–63 m de altura e a ~65 m do mar.
- **Z3 Vila** (`src/world/village.js`): gerada a partir da linha de fachada e de `places` do `track.json`. Duas frentes contínuas de sobrados geminados, 5 travessas com casas dos dois lados e um edifício fechando a perspectiva, largo da igreja com chafariz, feira, bancos, árvores e café com mesas; 8 quintais frontais com mureta e grade; muros de ligação com portão entre casas. Onde não há fachada, a linha de colisão é marcada por blocos de corrida (bocas das travessas) e balaustrada de pedra e ferro (largo). Pavimento só nas ruas, travessas e largo; os fundos de lote são quintais com oliveiras, ciprestes, carvalhos e palmeiras.
- **Igreja com torre sineira** de 25 m (marco), com portal em arco, óculo, contrafortes, sinos e telhado piramidal.
- **Z4 Bosque:** pinheiros-mansos, oliveiras, azinheiras e ciprestes em bosques e clareiras (campo de agrupamento), sub-bosque de lentisco, giesta, alecrim e oleandro, forração de gramíneas, ervas e flores.
- **Ponte** (`src/render/bridge.js`): viaduto de pedra de 5 arcos (vão livre de 19,1 m cada) sobre a enseada, pilares até o fundo do mar lido do campo de alturas, encontros entrando nas margens, parapeitos com pilaretes e lanternas; estacas de amarração na enseada.
- **Auditoria de densidade** (`src/world/audit.js`), executada em `npm run validate`: props por 100 m, unidades e frentes por janela de Z3, árvores / arbustos / forração por janela de Z4 com `L` e `f`, desnível e curvas de Z2.
- **Exposição por lugar:** a rua da vila e o bosque ficam na sombra do sol baixo e recebem exposição mais longa (×1,55 e ×1,36), com transição de 70 m; raios de sol mais fortes sob as árvores.

**Evidências**

| Verificação | Resultado |
| --- | --- |
| `validateWorld()` | OK — 20 144 objetos, 156 construções sem sobreposição, base a no máx. 0,22 m do terreno (limite 0,3) |
| Z2: desnível / curvas | 60,1 m (mínimo 40) / 5 curvas (mínimo 3) |
| Z3: extensão da rua | 444,7 m (mínimo 400) |
| Z3: unidades arquitetônicas | 150 (142 a menos de 30 m da pista; mínimo 60); 2–3 andares |
| Z3: frentes urbanizadas por janela de 100 m | 20 / 23 / 25 / 25 (mínimo 12); resíduo de 44,7 m: 11 |
| Z3: variações / cores de reboco | 8 tipos + igreja / 16 cores |
| Z3: detalhes | 37 com varanda, 34 com toldo, 68 com floreiras, 103 com chaminé; toda unidade tem ao menos um |
| Z3: travessas / largo / marco | 5 travessas (7, 6, 6, 5, 7 unidades) / largo da igreja com chafariz / igreja com torre |
| Z4: árvores por janela de 100 m (até 40 m) | 63, 86, 71, 80, 75, 81, 80, 89 (mínimo 16) |
| Z4: arbustos / forração por janela | 98–114 (mínimo 10) / 263–314 (mínimo 12) |
| Z4: janela 800–900 m (ponte parcial) | L = 92 m, f = 0,92 → cotas 15 / 10 / 12; tem 70 / 94 / 280 |
| Z4: janela 900–1000 m (toda sobre a ponte) | L = 0, f = 0 → isenta |
| Z4: resíduo de 68,7 m | L = 65,7 m, f = 0,657 → cotas 11 / 7 / 8; tem 48 / 54 / 172 |
| Espécies arbóreas | pinheiro 651, oliveira 564, cipreste 289, azinheira 272, palmeira 129 |
| Props por 100 m (volta inteira) | mínimo 14 (exigido 12) |
| Varredura de 25 m (135 quadros) | sem trecho estéril em Z3/Z4; céu ≥ 10 % em toda a vila; mínimo da volta 1,9 % em s = 550 m (ver abaixo) |
| Volta completa em piloto automático | 0 eventos de integridade; voltas das IAs 104,3–109,8 s |
| FPS, Alta, 1920×1080, 6 carros juntos | mirante 102, falésia 112, vila 87, bosque 130, curva longa 109, ponte 159; 1 % low entre 61 e 86 |
| `gates/p4-s4.png` | céu 26 %; luminância 0,370 ± 0,242; maior bucket 7,4 % |
| `gates/p4-s5.png` | céu 14 %; luminância 0,433 ± 0,231; maior bucket 8,7 % |
| `gates/p4-s6.png` | céu 21 %; luminância 0,424 ± 0,259; maior bucket 10,7 % |
| `gates/p4-s7.png` | céu 39 %; luminância 0,514 ± 0,253; maior bucket 6,4 % |

**S4 × referência 02 — diferenças concretas (abaixo do alvo)**

1. A referência tem um paredão de rocha alto, com estratos e blocos soltos; o nosso corte em rocha tem ~4 m e não há falésia alta dentro deste quadro (ela fica na perna oeste).
2. Na referência a baía aparece de cima com gradiente turquesa e montanhas ao fundo; no nosso quadro o mar é uma faixa distante e escura ao entardecer, sem praia visível nem serras.
3. A encosta da referência é coberta de arbustos, cactos e pedras soltas; a nossa tem terraço pavimentado limpo e talude de grama com poucos pinheiros.
4. Luz: a referência tem sol alto com sombras nítidas; o nosso grampo está na sombra do fim de tarde, com pouco contraste.
5. Os veículos da referência levantam poeira; ainda não há partículas.

**S5 × referências 05, 06 e 07 — diferenças concretas (abaixo do alvo)**

1. As referências estão a pleno sol; a nossa rua está na sombra do sol baixo — fachadas com luz difusa e azulada, só a torre e os telhados pegam sol direto.
2. As casas de pedra da referência 06 têm relevo rico (águas-furtadas, empenas, janelas de sacada, trepadeiras); as nossas são volumes simples com telhado de duas ou quatro águas, sem águas-furtadas.
3. A igreja da referência 05 tem frontão barroco, nicho com imagem e reboco manchado pelo tempo; a nossa tem fachada ocre lisa com óculo e reboco uniforme.
4. Nas referências há pessoas, veículos estacionados e vegetação entre as construções; na nossa rua não há figuras humanas (fora do escopo) e o verde fica no largo e nos quintais.
5. Na referência 07 as paredes passam a centímetros do carro; a nossa rua tem calçada de 3,4 m de cada lado, então a sensação de velocidade entre paredes é menor.

**S6 × referências 08 e 10 — diferenças concretas (abaixo do alvo)**

1. A referência 10 tem feixes de luz volumétricos entre os troncos e poeira iluminada; nós temos apenas raios em espaço de tela a partir do sol e névoa de distância.
2. Nas referências a vegetação baixa (samambaias, capim alto, bananeiras) chega à borda da pista e invade o quadro; a nossa margem tem 3–4 m de grama baixa (faixa de exclusão) antes da cerca e dos arbustos.
3. Os pinheiros da referência 10 são altos, de tronco reto, com galhos finos; os nossos pinheiros-mansos têm ~10 m e copa em cartões de folha, que de perto mostra os planos.
4. O chão da referência tem folhas secas alaranjadas e manchas de sol; o nosso tem asfalto escuro na sombra e grama uniforme.
5. Não há poeira nem partículas atrás dos carros.

**S7 × referência 14 — diferenças concretas (abaixo do alvo)**

1. A referência mostra a ponte de lado, sobre um leito seco, com falésias e uma serra ao fundo; a nossa aparece em diagonal a partir do encontro, sobre uma enseada, com o bosque ao fundo e sem relevo distante.
2. O primeiro plano da referência é rico (poeira, plantas do deserto, pedras, veículos fora da pista); o nosso tem barranco de rocha e grama com poucas pedras grandes.
3. A textura de rocha do barranco estica nas faces quase verticais (projeção triplanar com pouca variação).
4. Céu da referência com nuvens e balões; o nosso é um gradiente liso nessa direção.
5. A luz do fim de tarde deixa o paramento da ponte com pouco contraste; os arcos mais distantes se confundem com a sombra.

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. **Bosque ralo:** a primeira versão cumpria a cota (21–30 árvores por janela) mas parecia savana — árvores soltas sobre chão vazio. Densidade triplicada (63–89 por janela), arbustos maiores, plantio estendido até 118 m da pista.
2. **Pavimento em todo o platô da vila** (pátios vazios de 40 m atrás das casas) → pavimento limitado às frentes, travessas e largo; fundos de lote plantados.
3. **Props rejeitados perto das casas** (o posicionador tratava cada casa como um círculo de 6 m) → teste de caixa orientada; janelas de 100 m abaixo de 12 props (falésia, vila, ponte) corrigidas com balizadores, marcos e placas atrás do guard-rail, mobiliário das travessas e estacas na enseada.
4. **Rua da vila e bosque escuros** (luminância média 0,265 na S5, no limite de 0,25) → exposição por lugar; S5 0,433 e S6 0,424.
5. **Casas sobre o talude** na entrada da vila (base a 0,31 m do terreno) → unidade só é criada se os quatro cantos estiverem a menos de 0,22 m da altura do centro.
6. **Vila pesada** (1 % low de 41 FPS) → fechamentos fundidos por célula de 200 m, um único material de veneziana, blocos de construção maiores; 1 % low 63.

**Ainda abaixo do alvo ao fechar o P4**

- Itens das quatro comparações acima; os de maior efeito visual (feixes volumétricos, partículas de poeira, variação da textura de rocha) vão para o P6.
- **Grampo inferior (s ≈ 525–600 m):** a câmera de perseguição fica de frente para a encosta e o céu cai para 2–9 % do quadro por ~75 m; não é corredor fechado (vê-se a encosta com vegetação e a estrada de cima), mas é o ponto mais fraco da regra de leitura.
- **IA na curva longa** (registrado no P3): dois carros ainda saem e são reposicionados pela regra dos 3 s — correção no P5.
- O preset Baixa ainda não foi medido.


---

## P5 — Corrida

**Critério:** testes 13.1 e 13.2 passando.

**O que entrou**

- **Regras da corrida** (`src/game/race.js`): 34 checkpoints em ordem (anticorte), voltas 1/3/6, apresentação do grid (~5 s, pulável), luzes 3-2-1, classificação ao vivo, tempos por volta, resultado com tempo projetado para quem ainda está na pista, reposição de carro parado ou fora da pista por mais de 3 s. Uma ultrapassagem só é contada quando o carro que vinha atrás fica um comprimento inteiro (5,5 m) à frente — dois carros trocando o nariz lado a lado numa curva são uma disputa, não uma série de ultrapassagens.
- **Fluxo completo** (`src/game/game.js`, `src/ui/`): Menu com a pista ao vivo e câmeras de TV → Garagem (2 carros, 6 cores, carro girando na luz do entardecer) → Configuração → Grid → Largada → Corrida → Resultados → Correr de novo / Menu; pausa, opções (qualidade e três volumes), HUD (posição, volta, tempos, velocidade, marcha, conta-giros, minimapa), teclado e gamepad.
- **IA** (`src/ai/driver.js`): perseguição pura da linha de corrida; o alvo de velocidade é o envelope de frenagem do próprio perfil, com freio antecipado pela inclinação do envelope; cinco níveis por dificuldade (aderência usada e aceleração na reta), grid fora da ordem de ritmo; equilíbrio de desempenho entre os dois modelos; regras de tráfego: seguir no vácuo com distância que encolhe com a velocidade de aproximação, reação à luz de freio do carro da frente, três gatilhos de ultrapassagem (alcançar com sobra, mergulho por dentro, sair do vácuo quando está sendo segurado), lado escolhido pelo interior da próxima curva, velocidade mantida enquanto a saída lateral cabe no espaço que resta, espaço absoluto para quem está ao lado, envelope de velocidade próprio da faixa por dentro, curva cedida a quem chega por dentro emparelhado, sem disputa na reta de posição já perdida.
- **Vácuo** (`src/physics/vehicle.js`): até 45 % menos arrasto a menos de 36 m atrás de outro carro, para todos.
- **Áudio** (`src/audio/`): motor por amostras gravadas (GT: 7 faixas com carga + 3 sem carga; hatch: 8 + 4), crossfade de potência igual entre faixas e entre carga / sem carga, dois timbres; rolagem por superfície, vento, cantada e arrasto de pneu, raspagem, três batidas, troca de marcha; ambiente por zona (mar e gaivotas, vento da falésia, vozes e sinos da vila, pássaros e cigarras do bosque), eco sob a ponte; buses jogador / rivais / efeitos / ambiente → mundo → passa-baixa de pausa → master; música e interface direto no master; limiter em `AudioWorklet` com teto de −1,2 dBFS e saída de PCM para o verificador.
- **Partículas** (`src/render/particles.js`): fumaça de pneu, poeira, brita e areia, 900 no máximo.
- **Diretor de câmeras** (`src/game/director.js`): cinco planos de menu, garagem na estrada da falésia, dolly do grid terminando em 3/4 frontal baixa do carro do jogador, câmera de chegada.
- **Verificador** (`scripts/verify.mjs` e `scripts/verify/`): os testes 1–9 da seção 13.1, a gravação da volta (13.0 item 4 e 13.2) e o desempenho (13.3) num único comando.

**Evidência — `npm run verify` completo (12 testes, 587 s, tudo aprovado)**

| Teste | Resultado |
| --- | --- |
| T1 Jornada 3 voltas (hatch, cor 2, cliques reais) | concluída; voltas do vencedor 114,20 / 108,93 / 108,99 s; 4 ultrapassagens (3 entre IAs); correr de novo volta ao grid |
| T2 Jornada 6 voltas (GT, cor 4) | concluída; melhor volta 105,90 s (IA 3); 6 ultrapassagens (4 entre IAs) |
| T3 Pausa / reiniciar / menu | 0 passos de simulação em pausa; vozes de áudio 45 antes, 45 / 45 / 45 depois de três reinícios e 45 de volta ao menu; heap +1,07 MB |
| T4 Anticorte | atalho pela linha, ida e volta e salto da falésia para a ponte não contam volta; a volta honesta conta |
| T5 IA | maior parada 0,22 s, nenhum rival fora da pista, 0 reposições; ultrapassagens entre rivais: 3 e 4 |
| T6 Integridade | `validateWorld()` OK; 0 eventos (carro sob o terreno, através de barreira, fora do mundo, roda longe) e 0 quadros de câmera dentro de geometria nas duas corridas |
| T7 Capturas S1–S12 | as 12 aprovadas (céu 14,9–45,9 % onde exigido, luminância 0,28–0,61, desvio 0,14–0,29, maior bucket 9,4 %) |
| T8 Auditoria da cena | carros com 262 806 e 270 225 triângulos e 12 materiais; 159 construções (450–4 568 triângulos, 9–15 materiais); 0 materiais chapados, 0 texturas abaixo do mínimo; motor ligado a `AudioBuffer` |
| T9 / T9b Varredura de 25 m | 135 / 135 pontos aprovados em Alta e em Baixa (céu mínimo 12,4 % / 12,2 %, luminância 0,277–0,572, maior bucket 26,1 %) |
| A1 Volta gravada | volta 2:00,3; `audio-volta.wav` 124,5 s, pico −7,2 dBFS, RMS −24,8 dB, 47 vozes no máximo; `volta.webm` 36,4 MB (VP9 + Opus); troca de marcha, derrapagem, raspão na barreira (5,2 m/s), ponte e duas ultrapassagens presentes |
| P1 Desempenho em Z3, 1080p, com limitador de 60 Hz | Alta 60 FPS (1 % low 34,6; CPU de render 7,8 ms); Baixa 60 FPS (1 % low 34,8; CPU de render 4,8 ms) |

As jornadas são determinísticas: duas execuções seguidas do verificador com o mesmo código deram os mesmos tempos de volta ao centésimo.

Imagens deste portão: `gates/p5-s8.png` (disputa lado a lado), `gates/p5-resultados.png`, `gates/p5-volta-quadros.jpg` (dez quadros de `volta.webm`).

**Corridas simuladas (3 voltas, jogador em piloto automático largando em 6º, `scripts/dev/racesim.mjs`)**

| Dificuldade | Ultrapassagens (entre IAs) | Contatos carro–carro acima de 3 m/s | Melhor volta |
| --- | --- | --- | --- |
| Fácil | 6 (2) e 8 (4) | 0 e 0 | 1:48,2 |
| Normal | 7 (4) e 7 (4) | 0 e 0 (um toque de 0,8 m/s) | 1:46,0 |
| Difícil | 1 (1) e 4 (1) | 0 e 0 (um toque de 1,2 m/s) | 1:47,1 |

(dois valores = jogador de GT e de hatch)

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. **IA saía na curva longa** (pendência do P3/P4): frenagem só proporcional ao erro e ultrapassagem por fora → freio antecipado pelo envelope, alvo no envelope de frenagem, trocas de faixa mais lentas sob frenagem, alívio do freio traseiro quando o carro escorrega. 0 saídas de pista nas jornadas.
2. **Batidas traseiras entre IAs** (até 10–15 m/s) → distância de seguimento com limite pela frenagem possível e reação à luz de freio.
3. **A regra de seguimento acabou com as ultrapassagens** — o T5 falhou duas vezes ("no overtake between rivals"). Causas encontradas e corrigidas uma a uma: (a) o limite de aproximação tratava o carro da frente como parede e não deixava ninguém chegar com velocidade em reta → critério de velocidade relativa em trecho aberto; (b) o acelerador proporcional estacionava o carro 5 m atrás, a meio pedal, sem nunca se considerar "segurado" → ganho firme atrás de outro carro; (c) quem saía para passar tinha de igualar a velocidade até estar 2,45 m ao lado → velocidade mantida enquanto a saída lateral cabe no espaço; (d) o hatch ficava sem folga de acelerador frente ao GT e o câmbio subia marcha cedo em alívios curtos → equilíbrio de desempenho por tabela de força e memória de acelerador no câmbio; (e) o freio antecipado do envelope disparava em reta atrás de tráfego → só atua perto do envelope; (f) diferença de reta pequena demais entre níveis → faixa de aceleração mais larga por dificuldade e grid embaralhado por ritmo; (g) quem passava por dentro freava cedo demais (penalidade de raio aplicada ao envelope inteiro) e perdia a posição na curva → envelope próprio da faixa com a mesma desaceleração; (h) disputas lado a lado terminavam a favor de quem estava por fora → a curva é de quem chega por dentro emparelhado.
4. **Toques de 4–5 m/s** depois do item 3: um carro já livre por fora escolhia passar por dentro e cruzava atrás do outro sem limite de velocidade → fica do lado em que já está quando não há tempo de cruzar, e o teste de "está no meu caminho" considera para onde a linha do carro vai, não só onde ele está.
5. **Contagem de ultrapassagens** contava cada troca de nariz (16 "ultrapassagens" numa corrida com a ordem final quase igual à do grid) → histerese de um comprimento de carro.
6. **Voltas abaixo de 1:45** depois das melhorias de frenagem → níveis recalibrados; melhor volta de um rival 1:45,9.
7. **Garagem:** sombra de palmeira atravessando o carro e sombra pontilhada na pintura → novo local (estrada da falésia, s = 1480 m), PCF de 8 amostras fixas, malha de sombra do carro recuada 4–7 cm, afastamento maior do mapa de sombra nos materiais do carro.
8. **Varredura:** céu de 3–9 % no grampo inferior (pendência do P4) e 9,2–9,9 % em quatro pontos da vila; quadros escuros na falésia → cotas da serpentina redistribuídas (o grampo passa a olhar para o vale), rua da vila 0,8 m mais larga de cada lado e sem sobrados de três andares frente a frente, fotômetro de exposição automática. 135 / 135 em Alta e em Baixa.
9. **Auditoria da cena:** o detector de caixa acusava lotes fundidos (cada lote era julgado como um objeto) → objetos julgados inteiros; textura do guard-rail 512² e faixa do pórtico 2048×256 → 1024² e 2048×1024.
10. **Medida de FPS** dependia do monitor (100 Hz) e de a aba estar na frente → limitador próprio de 60 Hz e aba do jogo em primeiro plano.
11. **Áudio:** contexto a 192 kHz no Chrome sem cabeça → 48 kHz fixo; `unlock()` marcava o áudio como pronto antes de o grafo existir → marca só no fim.
12. **Mapa S12** com reflexo do sol estourado no mar e sem árvores → modo de mapa (sem brilho especular do mar, vegetação no nível de detalhe distante em todo o mapa).
13. **HUD** mostrava 2ª marcha a 190 km/h nas capturas → o reposicionamento escolhe a marcha pela velocidade.
14. **Resultado da corrida anterior** sobrevivia ao reinício → limpo no início de cada corrida.
15. **Vídeo da volta:** o toque roteirizado na barreira era uma batida de 9,5 m/s seguida de rodada → raspão em duas fases (um toque no volante e reta até encostar): 5,2 m/s, o carro segue alinhado.

**Ainda abaixo do alvo ao fechar o P5 (vai para o P6)**

- **1 % low de 35 FPS** com média de 60 nos dois presets: quadros esporádicos de 23–36 ms que não dependem da carga de render (a Baixa tem o mesmo 1 % low com 4,8 ms de CPU) — heap de ~717 MB e ~18 MB/s de lixo por quadro.
- **Difícil** tem poucas ultrapassagens (1–4 por corrida): os cinco rivais ficam a menos de 2 s por volta uns dos outros.
- **Maior bucket de cor da varredura: 26,1 %** (limite 30 %) — margem pequena num ponto da volta.
- Um rival tocado de lado com força pelo jogador pode rodar para a área de escape e ser recolocado pela regra dos 3 s.
- O preset Baixa ainda não foi medido numa GPU integrada.


---

## P6 — Polimento

**Critério:** seção 13 completa.

**O que entrou**

- **Pré-carga na GPU** (`Game._prewarm`): depois de compilar os shaders, um passe sobre todas as malhas (inclusive os níveis de detalhe e as faixas de distância que ainda não estão em cena, e os três níveis de cada pedaço de terreno) num alvo de 16×16 envia toda a geometria e todas as texturas à placa de vídeo durante a carga (0,8 s; 3 645 geometrias, 125 texturas).
- **Menos trabalho e menos lixo por quadro:** a faixa de detalhe da vegetação é reavaliada em um quarto das células por quadro (todas de uma vez quando a câmera salta ou o preset muda); o HUD copia uma camada pronta (painéis, rótulos, traçado do minimapa, conta-giros apagado) e só desenha os números, a cada dois quadros; a ordenação das listas de desenho usa comparadores que só devolvem inteiros; `Math.hypot` saiu dos laços por quadro.
- **Limitador de 60 Hz do verificador** refeito (ver item 1 abaixo) e sonda de FPS com definição explícita: tempo de quadro = intervalo entre o início de dois quadros seguidos.
- **Imagem:** o mapeamento de tons devolve parte do matiz original às cores saturadas em luz forte (a curva ACES por canal empurrava a pintura vermelha ao sol para laranja), sem tocar nos brilhos extremos (o sol continua estourando para branco).
- **Escopo:** a opção de 1 volta saiu do menu (o enunciado pede 3 ou 6).
- **Volta gravada:** entradas roteirizadas disparadas dentro da simulação (por passo fixo e distância), não por relógio do Node; toque na barreira trocado por um raspão.
- **Documentos:** `README.md`, `ASSET-LICENSES.md` (gerado dos manifestos), `REPORT.md` (números copiados dos JSON do verificador por `scripts/dev/report.mjs`; avaliações escritas à mão em `scripts/dev/report-notes.mjs`).
- **Ferramentas de medição** em `scripts/dev/`: `spikes.mjs` (quadros longos por etapa), `gctrace.mjs` (pausas do coletor de lixo pelos eventos de trace do Chrome), `heapprof.mjs` (quem aloca), `lapspikes.mjs` (volta inteira a frio), `gpuinfo.mjs`.

**Evidência — `npm run verify` completo: 12 de 12 testes aprovados (608 s)**

| Medida | Resultado |
| --- | --- |
| Desempenho em Z3, Alta, 1080p, limitador de 60 Hz | 60,0 FPS, 1 % low 55,4, p99 16,7 ms, pior quadro 21,9 ms, CPU de render 7,4 ms |
| Desempenho em Z3, Baixa (1344×756 internos) | 60,0 FPS, 1 % low 59,8, p99 16,7 ms, pior quadro 16,8 ms, CPU de render 5,2 ms |
| Sem limitador (`scripts/dev/perf.mjs`) | Alta: 122–136 FPS na vila (1 % low 72–90), 155 na orla, 110 no bosque; Baixa: 177–183 na vila (1 % low 111), 213 na orla, 239 no bosque. Estes números variam cerca de ±20 % de uma medição para outra nesta máquina |
| Volta inteira a frio com limitador (`lapspikes.mjs`) | 60 FPS, 1 % low 45, p99 21 ms, pior quadro 30 ms; 34 de 6 942 quadros acima de 22 ms, espalhados pela volta — nenhuma travada concentrada numa troca de zona |
| Coletor de lixo em 12 s de corrida (`gctrace.mjs`) | 4 coletas menores de até 1,0 ms e 1 coleta maior de 10 ms (antes: 6 menores de até 9,7 ms) |
| Lixo por quadro (`heapprof.mjs`) | 11,6 MB/s (antes 18,5 MB/s) |
| Jornadas | 3 voltas: 4 ultrapassagens (3 entre IAs); 6 voltas: 6 (4 entre IAs); 0 reposições, 0 eventos de integridade |
| Capturas e varredura | 12 capturas aprovadas; varredura 135 / 135 em Alta e 135 / 135 em Baixa (céu mínimo 12,2 %, luminância mínima 0,282, maior bucket 26,9 %) |
| Volta gravada | 02:02,2; pico -6,38 dBFS; 47 vozes no máximo |

Imagem deste portão: `gates/p6-capturas.jpg` (as doze capturas finais).

**Reprodutibilidade — duas execuções completas seguidas do verificador, mesmo código**

| Item | Resultado |
| --- | --- |
| Testes | 12 de 12 nas duas |
| Capturas S1–S12 | 4 de 12 idênticas bit a bit; nas demais, no máximo 0,01 % dos pixels diferem, por até 5/255 (`s6-bosque-luz.png`); nenhum pixel difere por mais de 8/255 |
| Métricas das capturas (céu, luminância, desvio, bucket) | maior diferença absoluta 0,0000 |
| Métricas da varredura (135 pontos, Alta) | maior diferença absoluta 0,0000 |
| Jornadas (classificação e tempos) | idênticas |
| Volta gravada | tempos de volta 122,18 e 122,18 s; pico -6,76 e -6,38 dBFS |
| FPS em Z3 (Alta / Baixa) | 60,0 / 60,0 e 60,0 / 60,0; 1 % low 57,5 / 59,8 e 55,4 / 59,8 |
| Clone limpo (`git clone` → `npm ci` → `npm run verify`) | 12 de 12; jornadas, capturas (diferença máxima de 1/255), métricas de imagem, varredura e `scene-stats.json` iguais aos entregues; volta gravada 122,18 s com os mesmos eventos, pico −7,41 dBFS; 60 FPS nos dois presets, 1 % low 53,5 / 59,2 |

**Abaixo do alvo encontrado neste portão e corrigido antes de avançar**

1. **1 % low de 35 FPS com média de 60** (pendência do P5). O perfil mostrou que a causa era o próprio limitador do verificador, em duas etapas: (a) a primeira versão girava a espera inteira num `MessageChannel` — dezenas de milhares de objetos de evento por segundo, que deixavam cada coleta de lixo com 5–18 ms; (b) a segunda usava um temporizador para a maior parte da espera, e funcionou (1 % low 56) até a resolução de temporizador do sistema voltar ao padrão, quando os `setTimeout` passaram a chegar 5–12 ms atrasados (1 % low 35 de novo). A versão final não usa temporizador: espera no lugar por meio milissegundo, olhando o relógio a cada poucos microssegundos, cede a vez ao navegador e repete até o prazo. Coletas menores caíram para até 1 ms.
2. **18,5 MB/s de lixo por quadro** → 11,6 MB/s (laço da vegetação, HUD, ordenação). O que resta é quase todo dos setters de uniform do three.js e do boxing de números na física e na IA.
3. **Envio de geometria e textura à GPU no meio da volta** (níveis de detalhe que entravam em cena pela primeira vez) → pré-carga na carga. Na medição da volta a frio a diferença ficou dentro do ruído (pior quadro de 27–30 ms com e sem a pré-carga); ela foi mantida porque custa 0,8 s de carga e tira da corrida um trabalho que não precisa estar lá.
4. **Pintura do carro "neon"** quando o carro pega o sol rasante contra fundo em sombra → mapeamento de tons com preservação de matiz. Uma proteção do assunto no fotômetro foi testada e **retirada**: resolvia a pintura, mas derrubava a luminância média do grampo inferior para 0,19–0,23 (quatro pontos da varredura reprovados).
5. **Opção de 1 volta** no menu, fora do escopo do enunciado → removida.
6. **Volta gravada não reproduzível** (as entradas roteirizadas eram disparadas por um laço do Node, com 40 ms de incerteza) → disparadas dentro da simulação; duas execuções dão a mesma volta.
7. **Falha do T7 numa execução de ensaio** ("promise was garbage collected"): a sonda de FPS recém-alterada usava o instante de um quadro antigo quando o jogo vinha de uma captura parada, lançava uma exceção dentro do quadro e parava o laço do limitador → a sonda só conta a partir do primeiro quadro que vê, e o laço do limitador agora sobrevive a uma exceção num quadro.
8. **A largada não partia de um estado limpo.** Repetir a mesma corrida na mesma página dava outro resultado (o gerador aleatório, o alvo de faixa e as últimas entradas de cada piloto vinham da volta do menu ou da corrida anterior), e a volta gravada mudava com o ritmo de quadros (122,78 s a 40 Hz contra 123,30 s a 100 Hz). Agora cada piloto volta a um estado inicial completo ao ser posto no grid (`Driver.reset()`), e o acumulador de passos é zerado. Conferido: cinco execuções da mesma corrida (só passos, quadros de 10 ms, quadros de 25 ms, e repetições) terminam com os seis carros na mesma posição ao milímetro, e a volta gravada dá 122,18 s tanto a 100 Hz quanto a 40 Hz, com os mesmos eventos.
9. **Variações aleatórias do áudio e das partículas** (`Math.random` na fase dos loops do motor, no tom das batidas, nos sinos e na fumaça) → sequência própria com semente fixa. O pico da gravação variava ±0,8 dB entre execuções; nas duas últimas a diferença foi de 0,4 dB.
10. **Falha de escrita em disco na segunda execução seguida** (`UNKNOWN: unknown error, open …\compare\s1.png` e `…\volta.webm`): no Windows um arquivo recém-gravado fica preso por instantes (antivírus, indexador) → todas as gravações do verificador passam por uma função que tenta de novo.
11. **Capturas com pequenas diferenças entre execuções** (até 1 % dos pixels em S5, S8 e S11): o ângulo de rotação das rodas e o brilho da luz de freio não eram zerados ao posicionar um carro e dependiam de quantos quadros a medição de FPS anterior tinha durado → zerados no reposicionamento.
12. **`README.md` e `ASSET-LICENSES.md`** não existiam → escritos.

**Ainda abaixo do alvo ao fechar o P6** (detalhado na seção 7 do `REPORT.md`)

- **Baixa não foi medida numa GPU integrada**: a GPU integrada desta máquina está desativada. Só há uma estimativa de folga (Baixa mantém 196 FPS a 3840×2160 e 101 FPS a 7680×4320 na RTX 3070 Ti).
- Sem luz volumétrica nem poeira iluminada; água sem refração; carro sem asa nem detalhes modelados; textura de rocha esticada em faces íngremes; copas em cartões de folha — as diferenças registradas desde P2–P4 que não foram resolvidas.
- A rua da vila e os grampos ficam na sombra do sol a 6°; o fotômetro compensa, e um carro ao sol contra fundo em sombra ainda fica com a pintura muito clara.
- Em Difícil há poucas ultrapassagens (1–4 por corrida de 3 voltas).
- Margens pequenas em três métricas de imagem: maior bucket da varredura 26,9 % (limite 30 %), menor luminância 0,282 (limite 0,25), desvio da S11 0,14 (limite 0,12).

