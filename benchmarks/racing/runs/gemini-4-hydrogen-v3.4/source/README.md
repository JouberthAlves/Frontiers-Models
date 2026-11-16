# Costa Dourada — Circuito Costeiro 3D

Jogo de corrida arcade 3D em circuito costeiro fechado ao entardecer (pôr do sol mediterrâneo), construído com Three.js, Rapier3D e Web Audio API para execução 100% estática e offline.

## Como Executar

> Requer Node.js ≥ 20. Todos os assets estão armazenados localmente em `assets/`.

```bash
# 1. Instalar dependências e compilar o bundle em build/app.js
npm ci
npm run build

# 2. Subir o servidor HTTP estático local na raiz do projeto
npm run serve
```

Em seguida abra a URL local exibida no terminal (por padrão `http://127.0.0.1:4173`). O jogo também funciona com qualquer servidor estático apontado para a raiz (`index.html`), sem acesso à internet.

## Verificação Automatizada

```bash
npm run verify
```

Executa a suíte completa em Chromium headless (`1920×1080` + gravação `1280×720`):
- Validação determinística do circuito, colliders e grafo de cena (`verification/scene-stats.json`)
- Testes de volta completa vs. 5 IAs, anti-atalho, imobilidade na contagem e 3 reinícios sem vazamento de vozes de áudio
- Captura de `s1`..`s12`, comparações em `verification/compare/`, varredura a cada `25 m` em `verification/sweep/` + `verification/sweep-sheet.png`
- Gravação em tempo real da volta completa (`verification/volta.webm` e `verification/audio-volta.wav`) e relatório em `verification/REPORT.md`

## Controles

| Ação | Teclado | Gamepad (Controle) |
|---|---|---|
| Acelerar | `W` ou `↑` | Gatilho Direito (`RT` / `R2`) |
| Freio / Ré | `S` ou `↓` | Gatilho Esquerdo (`LT` / `L2`) |
| Direção | `A`/`D` ou `←`/`→` | Analógico Esquerdo |
| Freio de mão | `Espaço` | Botão `A` / `X` |
| Alternar câmera (Chase / Capô) | `C` | Botão `Y` / `△` |
| Reposicionar carro na pista | `R` | — |
| Pausar / Retomar | `Esc` | `Start` / `Menu` |
| Navegação nos menus | `↑`/`↓`/`←`/`→` + `Enter` | Mouse / Teclado |

## Hardware Testado e Desempenho

- **GPU:** `NVIDIA GeForce RTX 3070 Ti` (ANGLE Direct3D11, `16` núcleos de CPU)
- **Resolução de teste:** `1920×1080` na zona mais densa (`Z3` — Vila com 80 casas + igreja)
  - **Qualidade Alta (`HDR + Bloom + Motion Blur + Sombras 2048²`):** média **`59,5 FPS`** (1% low: `30,0 FPS`, limitado por V-Sync de `60 Hz`)
  - **Qualidade Baixa:** média **`58,2 FPS`** (1% low: `29,9 FPS`, limitado por V-Sync de `60 Hz`)

## Estrutura do Projeto

- `track.json` — Fonte única da verdade do circuito fechado (`3169,6 m`, 4 zonas: `Orla`, `Falésia`, `Vila`, `Bosque`)
- `src/world/` — Geração procedural da estrada, terreno (`TerrainField`), oceano, vegetação, arquitetura, carros (`Veloce GT` e `Solara RS`), partículas e auditorias
- `src/physics/` — Mundo Rapier3D e veículo arcade com suspensão por raycast e recuperação segura
- `src/ai/` — Pilotos IA (`Fácil`, `Normal`, `Difícil`) com desvio e ultrapassagem
- `src/audio/` — Motor Web Audio API com 6 bandas reais de `.wav`, ambientação por zona e limitador master (`-8,34 dBFS` medido)
- `src/render/` — Iluminação HDRI Golden Hour e pós-processamento com máscara do carro do jogador
- `src/ui/` — Interface completa (Menu, Garagem, Configuração, Grid, Contagem, HUD, Pausa, Resultados)

## Limitações Conhecidas

- A taxa de quadros no monitor/navegador de teste sofre teto de `60 FPS` por V-Sync.
- Na vista aérea zenital extrema (`S12`, a `940 m` de altitude), as bordas externas do heightfield retangular (`1480×1040 m`) ficam visíveis contra o plano oceânico.
- Copas de árvores estilizadas baseadas em cartões cruzados exibem discretas linhas de interseção horizontais sob contraluz forte (`S6`).
- Todos os créditos CC0 dos assets locais estão documentados em [`ASSET-LICENSES.md`](ASSET-LICENSES.md).
