# ASSET LICENSES — Costa Dourada (Racing-bench V3.4)

Todos os assets externos utilizados neste projeto são **CC0 (Domínio Público)**, armazenados localmente em `assets/` para execução 100% offline sem requisições a CDNs externas. Todos os modelos dos carros dos jogadores e rivais (`Veloce GT` e `Solara RS`) foram modelados proceduralmente no código (`src/world/cars.ts` e `src/world/carTextures.ts`), sem uso de malhas baixadas.

## 1. Skybox / HDRI (Poly Haven — CC0)
- `assets/hdri/qwantani_sunset_puresky_2k.hdr` — Poly Haven (`qwantani_sunset_puresky`, 2K EXR/HDR, Licença CC0) — Iluminação IBL e céu de pôr do sol mediterrâneo.

## 2. Texturas PBR (Poly Haven — CC0)
Todas com mapas `diff.jpg`, `nor.jpg` e `rough.jpg` (`asphalt_02` em `2048×2048`, demais em `1024×1024`):
- `assets/textures/asphalt_02/` — Poly Haven (`asphalt_02`, CC0) — Asfalto da pista.
- `assets/textures/coast_sand_01/` — Poly Haven (`coast_sand_01`, CC0) — Areia seca e molhada da orla.
- `assets/textures/aerial_grass_rock/` — Poly Haven (`aerial_grass_rock`, CC0) — Grama e solo costeiro.
- `assets/textures/forrest_ground_01/` — Poly Haven (`forrest_ground_01`, CC0) — Solo do bosque em Z4.
- `assets/textures/cliff_side/` — Poly Haven (`cliff_side`, CC0) — Rochas e escarpas em Z2/Z4.
- `assets/textures/clay_roof_tiles_02/` — Poly Haven (`clay_roof_tiles_02`, CC0) — Telhados de barro na vila.
- `assets/textures/blue_plaster_wall/` — Poly Haven (`blue_plaster_wall`, CC0) — Fachadas azuis da vila.
- `assets/textures/clay_plaster/` — Poly Haven (`clay_plaster`, CC0) — Fachadas terracota/ocre da vila.
- `assets/textures/white_stucco/` — Poly Haven (`white_stucco`, CC0) — Fachadas brancas e igreja.
- `assets/textures/beige_wall_001/` — Poly Haven (`beige_wall_001`, CC0) — Fachadas creme/bege da vila.
- `assets/textures/rustic_stone_wall/` — Poly Haven (`rustic_stone_wall`, CC0) — Muretas, embasamentos, pilares da ponte e campanário.
- `assets/textures/cobblestone_02/` — Poly Haven (`cobblestone_02`, CC0) — Calçamento da praça da igreja.
- `assets/textures/oak_wood_planks/` — Poly Haven (`oak_wood_planks`, CC0) — Portas, venezianas, postes e cercas de duna.
- `assets/textures/bark_brown_01/` — Poly Haven (`bark_brown_01`, CC0) — Troncos das palmeiras, pinheiros mansos e oliveiras.
- `assets/textures/metal_plate/` — Poly Haven (`metal_plate`, CC0) — Guardrails metálicos e pórtico de largada.

## 3. Modelos 3D GLTF (Poly Haven — CC0)
Todos em formato 1K GLTF com texturas locais embaralhadas em `assets/models/`:
- `assets/models/boulder_01/` — Poly Haven (`boulder_01`, CC0) — Matacões nas encostas e falésias.
- `assets/models/coast_rocks_01/` — Poly Haven (`coast_rocks_01`, CC0) — Rochas costeiras na arrebentação de Z1.
- `assets/models/coast_rocks_02/` — Poly Haven (`coast_rocks_02`, CC0) — Formações rochosas da praia e costeira.
- `assets/models/fern_02/` — Poly Haven (`fern_02`, CC0) — Samambaias no bosque de Z4.
- `assets/models/painted_wooden_bench/` — Poly Haven (`painted_wooden_bench`, CC0) — Bancos no calçadão e praça.
- `assets/models/ceramic_pot/` — Poly Haven (`ceramic_pot`, CC0) — Vasos mediterrâneos na orla e vila.
- `assets/models/wine_barrel_01/` — Poly Haven (`wine_barrel_01`, CC0) — Barris nas fachadas/plaza da vila.

## 4. Áudio e Efeitos Sonoros (OpenGameArt — CC0)
- `assets/audio/engine/loop_0.wav` .. `loop_5.wav` — OpenGameArt CC0 — 6 loops reais de motor em diferentes faixas de RPM para mistura contínua com crossfade no carro do jogador e motores 3D da IA.
- `assets/audio/engine/engine_alt_0.mp3`, `engine_alt_1.mp3` — OpenGameArt CC0 — Camadas adicionais para diferenciar timbre entre `Veloce GT` e `Solara RS`.
- `assets/audio/env/wave_01.flac` — OpenGameArt CC0 — Som ambiente de ondas do mar na Orla (Z1).
- `assets/audio/env/seagull_1.wav`, `seagull_2.wav` — OpenGameArt CC0 — Gaivotas costeiras periódicas em Z1.
- `assets/audio/env/birds.wav` — OpenGameArt CC0 — Pássaros no bosque (Z4) e vila (Z3).
- `assets/audio/env/cicadas.ogg` — OpenGameArt CC0 — Cigarras mediterrâneas ao entardecer.
- `assets/audio/env/wind_Wind.ogg`, `wind_Wind2.ogg`, `wind_Wind3.ogg` — OpenGameArt CC0 — Vento costeiro e de altitude (Z2 Falésia).
- `assets/audio/env/bell.wav` — OpenGameArt CC0 — Sinos do campanário em Z3 e pistas sonoras de UI.
- `assets/audio/env/crash.ogg` — OpenGameArt CC0 — Impactos e colisões físicas.
