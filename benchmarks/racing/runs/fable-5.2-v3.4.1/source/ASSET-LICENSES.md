# Licenças dos assets

Todo asset de terceiros empacotado no jogo é **CC0 1.0** (dedicação ao domínio público) e está gravado localmente em `assets/` — o jogo não baixa nada em tempo de execução. Nenhum arquivo de `refs/` (as imagens de referência do benchmark) faz parte do build: elas são lidas de fora do projeto apenas pelo verificador, para montar as folhas de comparação.

| Origem | Itens | Licença | Tamanho no build |
| --- | --- | --- | --- |
| Poly Haven — texturas PBR | 37 conjuntos (albedo, normal, ARM) | CC0 1.0 | 90.6 MB |
| Poly Haven — HDRI | 1 | CC0 1.0 | 16.1 MB |
| Freesound — gravações CC0 | 34 sons de origem → 40 amostras | CC0 1.0 | 9.3 MB |
| Próprios — modelos dos carros | 2 (`assets/cars/gt.bin`, `assets/cars/hatch.bin`) | obra original deste projeto | 13.3 MB |

## Texturas PBR — Poly Haven (CC0 1.0)

Baixadas de https://polyhaven.com pelo script `scripts/dev/ph.mjs` (mapas `diff`, `nor_gl` e `arm`). O asfalto da pista é 2K; as demais superfícies próximas da pista são 1K ou 2K.

| Asset | Autor(es) | Página | Resolução |
| --- | --- | --- | --- |
| Asphalt 02 (`asphalt_02`) | Rob Tuytel | https://polyhaven.com/a/asphalt_02 | 2K |
| Asphalt 04 (`asphalt_04`) | Jenelle van Heerden, Sergej Majboroda | https://polyhaven.com/a/asphalt_04 | 2K |
| Bark Brown 02 (`bark_brown_02`) | Rob Tuytel | https://polyhaven.com/a/bark_brown_02 | 1K |
| Bark Willow (`bark_willow`) | Dario Barresi, Dimitrios Savva | https://polyhaven.com/a/bark_willow | 1K |
| Blue Painted Planks (`blue_painted_planks`) | Rob Tuytel | https://polyhaven.com/a/blue_painted_planks | 1K |
| Brushed Concrete  (`brushed_concrete`) | Dario Barresi, Dimitrios Savva | https://polyhaven.com/a/brushed_concrete | 1K |
| Clay Roof Tiles 02 (`clay_roof_tiles_02`) | Amal Kumar | https://polyhaven.com/a/clay_roof_tiles_02 | 1K |
| Clay Roof Tiles 03 (`clay_roof_tiles_03`) | Amal Kumar | https://polyhaven.com/a/clay_roof_tiles_03 | 1K |
| Cliff Side (`cliff_side`) | James Ray Cock, Jenelle van Heerden, Dario Barresi | https://polyhaven.com/a/cliff_side | 1K |
| Cobblestone Floor 04 (`cobblestone_floor_04`) | Rob Tuytel | https://polyhaven.com/a/cobblestone_floor_04 | 1K |
| Concrete Wall 008 (`concrete_wall_008`) | Dario Barresi, Charlotte Baglioni | https://polyhaven.com/a/concrete_wall_008 | 1K |
| Corrugated Iron (`corrugated_iron`) | Jenelle van Heerden, Dimitrios Savva | https://polyhaven.com/a/corrugated_iron | 1K |
| Damp Beach Sand (`damp_beach_sand`) | Dimitrios Savva | https://polyhaven.com/a/damp_beach_sand | 1K |
| Dry Decay Leaves (`dry_decay_leaves`) | Amal Kumar | https://polyhaven.com/a/dry_decay_leaves | 1K |
| Forest Ground 01 (`forrest_ground_01`) | Rob Tuytel | https://polyhaven.com/a/forrest_ground_01 | 1K |
| Grass Path 2 (`grass_path_2`) | Rob Tuytel | https://polyhaven.com/a/grass_path_2 | 1K |
| Gravel Ground 01 (`gravel_ground_01`) | Rob Tuytel | https://polyhaven.com/a/gravel_ground_01 | 1K |
| Green Rough Planks (`green_rough_planks`) | Rob Tuytel | https://polyhaven.com/a/green_rough_planks | 1K |
| Old Stone Wall (`old_stone_wall`) | Charlotte Baglioni | https://polyhaven.com/a/old_stone_wall | 1K |
| Painted Plaster Wall (`painted_plaster_wall`) | Amal Kumar | https://polyhaven.com/a/painted_plaster_wall | 1K |
| Palm Tree Bark (`palm_tree_bark`) | Dimitrios Savva, Rico Cilliers | https://polyhaven.com/a/palm_tree_bark | 1K |
| Pine Bark (`pine_bark`) | Dimitrios Savva | https://polyhaven.com/a/pine_bark | 1K |
| Rectangular Paving (`rectangular_paving`) | Dimitrios Savva | https://polyhaven.com/a/rectangular_paving | 1K |
| Rocky Terrain 02 (`rocky_terrain_02`) | Amal Kumar | https://polyhaven.com/a/rocky_terrain_02 | 1K |
| Rock Face 03 (`rock_face_03`) | Dario Barresi, Rico Cilliers | https://polyhaven.com/a/rock_face_03 | 1K |
| Roof Tiles 14 (`roof_tiles_14`) | Rob Tuytel | https://polyhaven.com/a/roof_tiles_14 | 1K |
| Rough Pine Door (`rough_pine_door`) | Dimitrios Savva | https://polyhaven.com/a/rough_pine_door | 1K |
| Rustic Stone Wall (`rustic_stone_wall`) | Dimitrios Savva | https://polyhaven.com/a/rustic_stone_wall | 1K |
| Rusty Metal 02 (`rusty_metal_02`) | Rob Tuytel | https://polyhaven.com/a/rusty_metal_02 | 1K |
| Sand 01 (`sand_01`) | Rob Tuytel | https://polyhaven.com/a/sand_01 | 1K |
| Stone Pavers (`stone_pavers`) | Amal Kumar | https://polyhaven.com/a/stone_pavers | 1K |
| Weathered Brown Planks (`weathered_brown_planks`) | Dimitrios Savva, Rico Cilliers | https://polyhaven.com/a/weathered_brown_planks | 1K |
| White Stucco 02 (`white_stucco_02`) | Dimitrios Savva | https://polyhaven.com/a/white_stucco_02 | 1K |
| Wood Planks Grey (`wood_planks_grey`) | Rob Tuytel | https://polyhaven.com/a/wood_planks_grey | 1K |
| Worn Plaster Wall (`worn_plaster_wall`) | Dimitrios Savva | https://polyhaven.com/a/worn_plaster_wall | 1K |
| Yellow Plaster (`yellow_plaster`) | Rob Tuytel | https://polyhaven.com/a/yellow_plaster | 1K |
| Yellow Stone Wall (`yellow_stone_wall`) | Sơn Nguyễn | https://polyhaven.com/a/yellow_stone_wall | 1K |

## HDRI — Poly Haven (CC0 1.0)

| Asset | Autor(es) | Página | Arquivo |
| --- | --- | --- | --- |
| Qwantani Sunset (Pure Sky) (`qwantani_sunset_puresky`) | Greg Zaal, Jarod Guest | https://polyhaven.com/a/qwantani_sunset_puresky | `assets/hdri/qwantani_sunset_puresky_4k.hdr` |

## Áudio — Freesound (CC0 1.0)

Cada gravação abaixo está publicada no Freesound sob CC0 1.0 (licença conferida na página de cada som). `scripts/audio/fetch.mjs` baixa as gravações e `scripts/audio/build-samples.py` recorta, normaliza e fecha os loops que ficam em `assets/audio/` (o mapa amostra → gravação de origem está em `assets/audio/manifest.json`). O motor do jogador e dos rivais toca **somente** essas gravações (faixas de giro com crossfade); síntese é usada apenas nos sons de interface, na contagem de largada e na música do menu.

| Uso no jogo | Som | Autor | Página |
| --- | --- | --- | --- |
| GT engine, idle band | 19_500_D6.wav | Chippy569 | https://freesound.org/s/162506/ |
| GT engine, idle band (second microphone) | 19_500_4062.wav | Chippy569 | https://freesound.org/s/162507/ |
| GT engine, 2550 rpm band | 19_2500_D6.wav | Chippy569 | https://freesound.org/s/162509/ |
| GT engine, 2550 rpm band (second microphone) | 19_2500_4062.wav | Chippy569 | https://freesound.org/s/162510/ |
| GT engine, 6200 rpm band | 20_6500_D6.wav | Chippy569 | https://freesound.org/s/162512/ |
| GT engine, 6200 rpm band (second microphone) | 20_6500_4062.wav | Chippy569 | https://freesound.org/s/162513/ |
| GT engine, mid band cut from the acceleration | Acceleration Sweep - 4062.wav | Chippy569 | https://freesound.org/s/162499/ |
| GT engine, upper-mid band cut from the acceleration | 17_ShortSweep_D6.wav | Chippy569 | https://freesound.org/s/162501/ |
| GT engine, overrun (off-throttle) character | 18_MedSweep_4062.wav | Chippy569 | https://freesound.org/s/162502/ |
| hatch engine, idle band | SFX_Car_Engine_Outside_Idle.wav | GiocoSound | https://freesound.org/s/401552/ |
| hatch engine, low band | SFX_Car_Engine_Outside_RPMLow.wav | GiocoSound | https://freesound.org/s/401556/ |
| hatch engine, mid band | SFX_Car_Engine_Outside_RPMMed.wav | GiocoSound | https://freesound.org/s/401555/ |
| hatch engine, high band | SFX_Car_Engine_Outside_RPMHigh.wav | GiocoSound | https://freesound.org/s/401551/ |
| hatch engine, off-throttle layer | SFX_Car_Engine_Inside_Idle.wav | GiocoSound | https://freesound.org/s/401550/ |
| hatch engine, off-throttle layer | SFX_Car_Engine_Inside_RPMLow.wav | GiocoSound | https://freesound.org/s/401548/ |
| hatch engine, off-throttle layer | SFX_Car_Engine_Inside_RPMMed.wav | GiocoSound | https://freesound.org/s/401547/ |
| hatch engine, off-throttle layer | SFX_Car_Engine_Inside_RPMHigh.wav | GiocoSound | https://freesound.org/s/401549/ |
| tyre squeal | Chrysler LHS tire squeal 01 (04-25-2009).wav | audible-edge | https://freesound.org/s/71736/ |
| tyre squeal | Chrysler LHS tire squeal 03 (04-25-2009).wav | audible-edge | https://freesound.org/s/71738/ |
| tyre scrub / wheelspin | Nissan Maxima burnout (04-25-2009).wav | audible-edge | https://freesound.org/s/71740/ |
| tyre roll on asphalt, wind noise | Car_interior_driving.wav | Lydmakeren | https://freesound.org/s/510479/ |
| tyre roll on sand / gravel / grass | Honda CRV 2014 Interior Gravel Road 03 | loganzsound | https://freesound.org/s/784177/ |
| wind with speed, cliff ambience | WIND_loop | kevinklang | https://freesound.org/s/841982/ |
| collision | Collision | qubodup | https://freesound.org/s/332058/ |
| collision | Fast Collision | qubodup | https://freesound.org/s/332056/ |
| light contact | Metal Hit 2 | dslrguide | https://freesound.org/s/321482/ |
| continuous scrape on barriers | Scraping Metal | cb9382 | https://freesound.org/s/877949/ |
| gear change clunk | Car Engine Contact Recording-Mini Cooper S 2019_Gear Shift.wav | TheLittleCrow | https://freesound.org/s/669623/ |
| Z1 ambience: waves | Ambiance_Ocean_Ribeira_Grande_Loop_Stereo_02 | Nox_Sound | https://freesound.org/s/829629/ |
| Z1 ambience: seagulls | Seagulls on Roof | GlassOfOrange | https://freesound.org/s/647344/ |
| Z3 ambience: distant voices | Village square voices birds | Martin.Sadoux | https://freesound.org/s/422585/ |
| Z3 ambience: distant bells | distant church wedding bells | mudflea2 | https://freesound.org/s/703590/ |
| Z4 ambience: birds | Forest_Birds (loop) 02.wav | VKProduktion | https://freesound.org/s/231537/ |
| Z4 ambience: cicadas | cicadas.wav | laughatlantic | https://freesound.org/s/320113/ |

## Conteúdo próprio (gerado por código deste repositório)

- **Carros:** os dois modelos são projetados como campos de distância em `scripts/cars/designs.mjs` e convertidos em malha por `scripts/cars/bake.mjs` → `assets/cars/*.bin`. Não derivam de nenhum modelo de terceiros.
- **Pista e mundo:** `track.json` (gerado por `scripts/make-track.mjs`), terreno, casas, igreja, ponte, farol, barreiras, vegetação (malhas e atlas de folhas), props, mar e céu complementar são gerados em tempo de carga pelos módulos de `src/world/` e `src/render/`.
- **Texturas procedurais:** reboco, telhas pintadas, madeira pintada, metal galvanizado, faixas da pista, placas, faixa do pórtico e atlas de folhagem são desenhados em canvas por `src/render/proctex.js` e `src/render/scene-materials.js`.
- **Sons sintetizados:** bipes da interface, contagem de largada, bandeirada e a música do menu (`src/audio/audio.js`).
- **Fontes:** o jogo usa as fontes do sistema (pilha `Bahnschrift`, `DIN Alternate`, `Roboto Condensed`, `Segoe UI`, sans-serif); nenhum arquivo de fonte é distribuído.

## Bibliotecas de código

| Biblioteca | Versão | Licença | Onde |
| --- | --- | --- | --- |
| three.js | 0.187.0 | MIT (`lib/three/LICENSE`) | `lib/three/` (cópia local, sem CDN) |
| Playwright | 1.65.1 | Apache-2.0 | apenas `devDependencies`, usado por `npm run verify`; não faz parte do jogo |

Nenhuma implementação, asset ou código de outro jogo foi consultado ou copiado, e nenhum asset foi produzido por IA generativa externa.
