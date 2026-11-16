# Registro de Portões — Costa Dourada (Racing-bench V3.4)

## Portão P1 — Esqueleto
- **Status:** APROVADO
- **Evidências:** `verification/p1-mapa.png`, `verification/p1-chase.png`
- **`validateWorld()`:** `ok: true`, `0` erros
  - Comprimento total: `3169.6 m` (faixa alvo: 2500–3500 m)
  - Inclinação longitudinal máxima: `10.26%` (limite: ≤ 14%)
  - Inclinação lateral máxima: `5.0°` (limite: ≤ 12°)
  - Raio mínimo de curva: `25.35 m` (limite: ≥ 25 m)
  - Terreno acima da pista: `-0.0196 m` (limite: ≤ 0,02 m)
  - Vão borda/terreno: `0.0845 m` (limite: ≤ 0,15 m)
  - Checkpoints: `24` em sequência, `0` erros
  - Consistência collider Rapier vs malha visual: `0` divergências em 60 sondas (terreno + pista)
- **Simulação de 1 volta completa (piloto automático):**
  - Volta completada em `100.1 s` (1:40.1 em ritmo ~90%)
  - `minY = 4.29 m`, `maxY = 55.63 m`
  - `safetyResets = 0`, `invariantFailures = []`, `cameraIntersections = 0`
  - Console errors: `0`
- **Correções feitas durante P1:**
  - Corrigida acumulação de forças do Rapier (`resetForces`/`resetTorques` por sub-step) e unidade do amortecedor de suspensão em `src/physics/vehicle.ts`.
  - Chamado `world.step()` antes das sondas de validação para popular o `QueryPipeline` do Rapier.
  - Afastada a linha de costa sul (`bayCurveZ`) e evitado rebaixamento negativo no interior para eliminar bolsão d'água em Z1.
  - Alinhados `bridgeSpan` (`0.918..0.941`) e o desfiladeiro de Z4 para transição limpa sem recorte de terreno sobre a ponte.

---

## Portão P2 — Luz e carro
- **Status:** APROVADO (com refinamentos iterados após inspeção visual)
- **Evidências:** `verification/p2-s1.png`, `verification/p2-s2.png`
- **`validateWorld()`:** `ok: true`, `0` erros
- **Métricas dos carros finais:**
  - `Veloce GT`: `25.708` triângulos (mínimo: ≥ 15.000), `9` materiais distintos (clearcoat, vidro reflexivo, carbono, liga escovada, liga escura, borracha, pinça anodizada, farol LED, lanterna/freio LED)
  - `Solara RS`: `25.608` triângulos (mínimo: ≥ 15.000), `9` materiais distintos
- **Problemas encontrados e corrigidos na inspeção visual de P2:**
  1. Na primeira renderização de P2, `roadMesh` estava com triângulos invertidos (culling traseiro) revelando o terreno abaixo; corrigida a orientação em `src/world/track.ts`.
  2. Bancos internos ultrapassavam o teto e o teto pintado cobria os vidros; reestruturado `buildSculptedBodyGeometry` com grupos de materiais contínuos (pintura / vidro reflexivo / carbono), interior rebaixado e caixas de roda abertas apontando para cima.
  3. Corrigido o espelhamento das UVs dos números (`07`) no capô e portas, adicionado suporte dos retrovisores e ajustada a exposição/intensidade do HDRI `qwantani_sunset_puresky_2k.hdr` para preservar o degradê azul→ouro e sombras longas e nítidas.
  4. Ajustado `contactShadow.position.y` para `-0.522` após `p2-s2.png` para encostar rente ao asfalto sem cortar os pneus.
- **Comparação com Ref 11 e Ref 01 (gap que será fechado em P3–P6):**
  - Ainda faltam os props da orla, palmeiras, água com ondas/espuma e pós-processamento (bloom/motion blur) — alvos do Portão P3.

---

## Portão P3 — Orla completa (Fatia Vertical Z1)
- **Status:** APROVADO
- **Evidências:** `verification/p3-s1.png`, `verification/p3-s3.png`
- **`validateWorld()`:** `ok: true`, `0` erros (`exclusionViolations: 0`, `groundingViolations: 0`, `colliderMismatch: 0`)
- **Métricas de Z1:**
  - `417` objetos posicionados em Z1 (mínimo de `30` props/vegetação a cada 100 m — acima do mínimo de 12)
  - `21` rochas costeiras com espuma animada ao redor na arrebentação
  - Shader de oceano com profundidade (`DataTexture` do `TerrainField`), ondas multi-frequência, reflexo Fresnel do pôr do sol, areia molhada escurecida e espuma rendada animada
  - Pós-processamento HDR (`UnrealBloomPass` sutil + `RadialMotionBlurShader` com máscara de camada que preserva o carro do jogador nítido a qualquer velocidade)
- **Problemas encontrados e corrigidos na inspeção visual de P3:**
  1. Na primeira passagem, `coast_rocks_01` do Poly Haven tinha escala nativa ~20 m, gerando rochas de 60 m que invadiam a câmera; normalizados todos os modelos GLTF por tamanho real em metros em `src/world/gltfAssets.ts`.
  2. Frondes das palmeiras inclinavam para cima como cálice; reorientadas radialmente em 3 camadas arqueadas com caimento natural em `src/world/vegetation.ts`.
  3. 5 objetos em curvas violavam a faixa de exclusão de 3 m por curvatura local; adicionada guarda `isClearOfExclusion()` em cada posicionamento de `src/world/props.ts`.
  4. Espuma na praia/rochas estava leitosa demais na primeira captura de S3; refinada com ruído de alta frequência rendado e variação irregular nos anéis das rochas.

---

## Portão P4 — Zonas 2–4 completas (Falésia, Vila, Bosque + Ponte)
- **Status:** APROVADO
- **Evidências:** `verification/p4-s4.png`, `verification/p4-s5.png`, `verification/p4-s6.png`, `verification/p4-s7.png`, `verification/p4-s11.png`
- **`validateWorld()`:** `ok: true`, `0` erros (`exclusionViolations: 0`, `groundingViolations: 0`, `houseOverlaps: 0`, `colliderMismatch: 0`)
- **`runSceneGraphAudit()`:** `ok: true`, `0` erros (`boxViolations: []`, `flatMaterialViolations: []`, `smallTextureViolations: []`)
  - Console errors: `0`
- **Métricas de Z2–Z4 e Auditoria de Cena:**
  - `Veloce GT`: `25.708` triângulos, `9` materiais; `Solara RS`: `25.608` triângulos, `9` materiais
  - `Z3` Vila: `80` casas em `5` variações arquitetônicas (embasamento em pedra chanfrado, janelas recuadas com venezianas, porta `2,1 m`, telhado em barro com beiral, sacadas/toldos/floreiras/chaminés), além da Igreja com Campanário e praça central
  - Vegetação: `4` espécies distintas (`palmeira`, `pinheiro_manso`, `oliveira`, `arbusto`) + gramíneas e samambaias GLTF (`fern_02`)
  - Densidade mínima em qualquer trecho de `100 m`: `15` props/vegetação (mínimo exigido: `12`)
  - `playerEngineHasAudioBuffer`: `true` (6 loops `.wav` pré-carregados)
- **Problemas encontrados e corrigidos na inspeção visual de P4:**
  1. Na primeira renderização de Z3/Z4, `TerrainField` erguia taludes de até `~90 m` formando cânions ao redor da pista; reescrita a escultura do terreno em `src/world/terrain.ts` com faixa de influência harmônica de `95 m` e limite suave de colinas mediterrâneas (`52–62 m`).
  2. As caixas de roda internas em `src/world/cars.ts` rotacionavam metade abaixo do eixo; corrigida a rotação (`rotateZ(Math.PI / 2)` puro) mantendo o arco apenas acima do pneu (`p4-s11.png`).
  3. Na primeira captura `p4-s4.png`, a câmera de `S4` em `s=1094` apontava contra o morro interno sem mostrar os carros nem a baía; reposicionada para o mirante em `s=1188` olhando sobre a curva de Z2, os dois carros, a costa de Z1 com palmeiras e o mar ao entardecer.

---

## Portão P5 — Corrida, IA, Áudio, Regras e UI Completa
- **Status:** APROVADO
- **Evidências:** `verification/p5-menu.png`, `verification/p5-garage.png`, `verification/p5-config.png`, `verification/p5-grid.png`, `verification/p5-pause.png`, `verification/p5-hud.png`, `verification/p5-s8-disputa.png`, `verification/p5-results.png`
- **Testes automatizados (`scripts/verify-p5.mjs`):**
  - Fluxo completo Menu → Garagem (troca `Veloce GT` / `Solara RS` + 6 pinturas) → Configuração (`3/6 voltas`, `Fácil/Normal/Difícil`, `Alta/Baixa`, volumes, controles) → Apresentação do Grid (~4,6 s) → Contagem `3-2-1-VAI!` (imobilidade garantida antes do sinal verde: `countdownBlockedMovement: true`) → Pausa (`Esc`) → Resultados finais (com tempos projetados `≈` quando aplicável)
  - Áudio Web Audio (`GameAudioManager`): `playerEngineHasAudioBuffer: true` (6 bandas `.wav` + camadas alternadas por carro), crossfade por RPM, ganho de aceleração, corte de troca de marcha/limitador, derrapagem, rolagem por superfície e juntas da ponte, vento, impactos, ambientes por zona e até 5 motores 3D da IA; teste de 3 reinícios consecutivos com `0` vozes vazadas (`[20, 20, 20, 20]`)
  - Regra anti-atalho: `antiCutBlockedCount: 1` e `antiCutKeptLap1: true` ao pular setores para `s=3060`
  - Corrida completa de 1 volta vs 5 IAs: `lapCompleted: true`, `playerFinished: true`, `playerOvertakes: 3`, `maxAiStuckSec: 0`, `safetyResets: 0`, `invariantFailures: []`, `cameraIntersections: 0`, `consoleErrors: []`, `failedRequests: []`
- **Problemas encontrados e corrigidos em P5:**
  1. Quando `raceStarted === false`, a força de freio em `src/physics/vehicle.ts` caía no ramo de marcha à ré e movimentava os carros para trás na contagem; adicionado travamento explícito enquanto `!raceStarted` e exigido `throttle < 0.02` para ré.
  2. Ao sair da ré em baixa velocidade antes do cooldown de troca de marcha, `gear === 0` indexava `gearMaxSpeeds[-1]` gerando `NaN` no `RPM` e erro no `AudioParam.setTargetAtTime`; corrigida a indexação segura e reset imediato ao sair da ré em `vehicle.ts`.
  3. Descontinuidades de offset na entrada da ponte em `src/physics/world.ts` permitiram que 1 carro escorregasse do tabuleiro; reconstruída a barreira contínua dupla-face com transição suave para `+0.25 m` na ponte.
  4. O sinal de `lateralOffset` na linha de corrida em `src/world/track.ts` estava invertido (`-avgCurv`), levando o pelotão pela borda externa das curvas; corrigido para `+avgCurv`, mantendo os carros no ápice interno e produzindo ultrapassagens limpas.

---

## Portão P6 — Polimento, Preset Baixa e Verificação Completa (`npm run verify`)
- **Status:** APROVADO
- **Evidências:** `verification/volta.webm`, `verification/audio-volta.wav`, `verification/s1`..`s12`, `verification/compare/s1.png`..`s9.png`, `verification/sweep-sheet.png`, `verification/scene-stats.json`, `verification/image-metrics.json`, `verification/verify-log.txt`, `verification/REPORT.md`
- **Desempenho na Vila (Z3, `1920×1080`) em GPU `NVIDIA GeForce RTX 3070 Ti`:**
  - Preset **Alta**: média **`59,5 FPS`** (1% low: `30,0 FPS`) — limitado por V-Sync de `60 Hz`
  - Preset **Baixa**: média **`58,2 FPS`** (1% low: `29,9 FPS`) — path leve sem `EffectComposer` nem sombras de alta resolução
- **Sanidade de Imagem (`S1`–`S11`):**
  - Todas as capturas `S1`–`S11` aprovaram luminância média (`0,3786–0,6700`), desvio padrão (`0,1972–0,2939`), fração de céu (`21,34%–51,93%`) e concentração máxima de cor única (`5,06%–11,16%`)
  - `S12` (mapa zenital a `940 m`) apresentou `stdLuminance = 0,0888` pela predominância de água e terreno contínuo visto de cima (fora do critério S1–S9)
- **Varredura e Vídeo da Volta Completa:**
  - `sweep/`: `127` quadros a cada `25 m` ao longo de `3169,6 m` (`0` falhas de sanidade; prancha em `verification/sweep-sheet.png`)
  - `volta.webm` (`57,1 MB`, `1280×720` Alta em tempo real com 5 IAs e áudio) e `audio-volta.wav` (`20,0 MB`, `104,19 s` estéreos a `48 kHz`): pico real **`-8,34 dBFS`** (teto ≤ `-1,0 dBFS`), RMS `-21,50 dBFS`
  - Eventos sonoros registrados: trocas de marcha (`00:00`, `00:02`, `00:03`, `00:07`, `00:30`, `00:31`, `00:33`, `00:37`, `00:40`, `01:10`, `01:38`), passagem próxima de IA (`00:00`, `01:27`, `01:34`) e travessia da ponte Z4 (`01:35`)
- **Auditoria e Invariantes (`scene-stats.json` e volta completa):**
  - `validateWorld()`: `ok: true`, `0` erros
  - `runSceneGraphAudit()`: `ok: true`, `0` violações de caixa/material/textura, `playerEngineHasAudioBuffer: true`, todos os 6 carros com `25.608` ou `25.708` triângulos e `9` materiais
  - Volta determinística: `finished: true`, `rank: 5`, `overtakes: 1`, `maxAiStuck: 0.00s`, `resets: 0`, `invariants: 0`, `camIntersections: 0`, `consoleErrors: 0`, `failedRequests: 0`


