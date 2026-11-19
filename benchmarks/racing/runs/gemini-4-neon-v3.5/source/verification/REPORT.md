# Costa Dorada GP — Final Verification Report

## 1. Test Environment & Reproduction
- **Command**: `npm ci && npm run verify` (exited with code `0`, `0` console errors, `0` page errors)
- **Offline Play Command**: `npx serve .` (serves root `index.html` cleanly with zero external network requests; App + Assets + Dist size: **`138.46 MB`**, well under the 400 MB limit)
- **CPU**: AMD Ryzen 7 5700G (16 logical cores)
- **GPU**: NVIDIA GeForce RTX 3070 Ti (`ANGLE Direct3D11 vs_5_0 ps_5_0`)
- **OS / Browser**: Windows (`win32 10.0.26300`), Chromium `159.0.8154.6` @ **`1920×1080`**

---

## 2. Performance Benchmarks (Z3 San Marco Village, 5 AI Cars, `1920×1080`)
| Scenario | Preset | Lighting | Avg FPS | 1% Low FPS | Samples |
| --- | --- | --- | ---: | ---: | ---: |
| Z3 Village + 5 AI | **High** (3×2048² CSM, N8AO, MSAA 4x+SMAA, Bloom, Motion Blur) | Golden Hour | **51.7** | 20.0 | 192 |
| Z3 Village + 5 AI | **High** (above + Night SpotLights & 18 Z3 sodium PointLights) | Night | **58.8** | 30.0 | 191 |
| Z3 Village + 5 AI | **Low** (2×1024² CSM, native AA, trimmed distant flora) | Golden Hour | **60.0** | 59.5 | 195 |

*(Headless Chromium `requestAnimationFrame` caps at 60 Hz vsync.)*

---

## 3. Live Scene, Asset & Pipeline Audit (`verification/scene-stats.json`)
- **World Invariants (`validateWorld()`)**: **PASS (`0` errors)** — Track length `3,278 m`, min corner radius `29.6 m`, max grade `10.6%`, max banking `5.0°`, `maxTerrainPokeAboveRoadM = 0.000 m`, `maxRoadEdgeStepM = 0.123 m`, `0` obstacles in 3.0 m exclusion zone, `0` floating objects, `0` overlapping buildings, `0` checkpoint errors.
- **Hero Cars (100% agent-modeled in TypeScript, zero external 3D models)**:
  - `Aurelia GT-R`: **`22,432` tris LOD0**, `20` materials, chassis-parented wheels, full playable cockpit & live rotating steering wheel.
  - `Solara Corsa WB`: **`24,128` tris LOD0**, `18` materials, chassis-parented wheels, full playable cockpit & live rotating steering wheel.
- **Rendering Pipeline (High)**: 3-cascade `2048×2048` CSM (`csmActive: true`), `N8AO (GTAO/HBAO)`, `AgX` tone mapping, `WebGL2 MSAA 4x + SMAA`, thresholded `Bloom`, background-only `Motion Blur` (player car masked), `16x` road anisotropy, `2048×2048` scanned asphalt maps, `Triplanar` cliff rock (albedo + normal), `Foliage` backlight translucency.
- **Texture & Material Purity**: `40` primary textured PBR materials, **`0`** synthetic `<canvas>`/`DataTexture` primary surface maps, **`0`** primary textures below `1024×1024`.
- **World Richness**:
  - **Z3 San Marco Village**: **`238`** architectural units across **`6`** archetypes (`terracotta_house`, `coastal_shop`, `hillside_villa`, `blue_plaster_cottage`, `stone_palazzo`, `coastal_church` w/ 24 m Campanile), 3 urban depth tiers (`113` Tier 1, `65` Tier 2, `59` Tier 3), `4` branching cobbled side alleys, and open stone central Plaza.
  - **Flora & Z4 Woods**: **`4`** distinct tree species (`stone_pine`, `coastal_palm`, `mediterranean_olive`, `tuscan_cypress` — `1,161` trees), `1,656` mid-stratum shrubs, `2,677` grass tufts.
  - **Props & Landmarks**: `1,391` props (`42.4 / 100 m`) + anchored stone-arch Z4 coastal viaduct bridge.
- **Renderer Frame Budget (High Z3 w/ 6 cars)**: `1,193` total calls across CSM+N8AO+Main+Post, `402` geometries, `115` textures, `16x` max anisotropy.

---

## 4. Automated Test Results (`verification/logs/test-results.json`)
| # | Test | Result | Key Metrics |
| --- | --- | --- | --- |
| 1 | Scene / Asset / Pipeline / `validateWorld()` Audit | **PASS** | `0` failures, `0` world invariant errors |
| 2 | Steering (`D`/`A`) & Mini-Nitro (`Shift`) Integrity | **PASS** | `D`: `+1.854 m` lat / `-28.07°` CW; `A`: `-2.017 m` lat / `+26.13°` CCW; Nitro: `82.4 -> 95.1 km/h`, drain `0.856 -> 0.100` |
| 3 | Anti-Cut Sequential Checkpoint Enforcement | **PASS** | Cutting directly to Start/Finish stays on `lap = 1` (`checkpointsPassed = 0`) |
| 4 | Full 3-Lap Race (Menu -> Garage -> Setup -> Race + Cockpit Toggle -> Results -> Race Again) | **PASS** | `341.0 s` total, best lap **`112.3 s` (`1:52.3`)**, **`31` AI overtakes**, `aiMaxStuckSec = 0.17 s`, **`0` resets**, `0` camera clip violations, Results + Race Again verified |
| 5 | Extended 6-Lap Race & Night Mode Boot | **PASS** | `668.8 s` total, best lap **`109.1 s` (`1:49.1`)**, **`0` resets** |
| 6 | State & Memory Hygiene (Pause/Restart/Menu ×3) | **PASS** | `heapStartMB = 803`, `heapEndMB = 803` (`delta = 0.0 MB`), `0` leaked audio voices |
| 7 | Full-Lap Real Video (`volta.webm`) & Real Post-Limiter Audio (`audio-volta.wav`) | **PASS** | `116.48 s` @ `48 kHz` (`21.33 MB` WAV, `51.78 MB` WebM), lap **`116.7 s` (`1:56.7`)**, peak **`-7.20 dBFS` (`<= -1.0 dBFS`)**, `21` max voices, `30` events (`ai_passby`, `gear_shift`, `nitro_boost`, `bridge_transition`), **`0` resets** |
| 8 | 25 m Track Sweep & Contact Sheet | **PASS** | `132` thumbnails (`verification/sweep/`) + `verification/sweep-sheet.png` |
| 9 | Console & Page Error Gate | **PASS** | `0` console errors, `0` uncaught page errors |

---

## 5. Visual Inspection Summary (Screenshots `s1`–`s15` & 25 m Sweep)
- `s1-reta-orla.png` (vs Ref 01): Golden Hour low sun halo ahead over turquoise bay, long palm shadows across weathered marked tarmac, crisp red Aurelia GT-R with background-only speed motion blur and sharp SVG HUD.
- `s2-grid-3-4.png` (vs Ref 11): Low front 3/4 view on painted starting grid boxes showing smooth wedge fender-to-hood surfacing, flush twin-LED headlights, contoured carbon splitter, recessed dark wheel wells, alloy rims/calipers, clear reflective cabin glass, and emerald Solara Corsa WB behind.
- `s3-praia-espuma.png` (vs Refs 02/04): Low shoreline angle showcasing glossy wet golden sand reflecting sunlight, smooth organic weathered coastal limestone boulders, turquoise shallows with animated white surf foam, sailboats, and palm promenade.
- `s4-falesia-mirante.png` (vs Ref 02): High Z2 limestone cliffside curve with craggy world-space Triplanar rock face rising right, smooth continuous extruded W-beam steel guardrail on grounded footings left, and open Mediterranean sea vista below.
- `s5-vila-rua.png` (vs Refs 05/06/07): San Marco Village street vista displaying multi-tier terracotta, coastal-blue, ochre, and limestone buildings, wrought-iron balconies, louvered shutters, raised cobblestone sidewalks, greenery-filled terracotta planters, and the Hero Church Campanile spire rising ahead.
- `s6-bosque-luz.png` (vs Refs 08/10): Z4 coastal pine woods with Stone Pines, olives, cypresses, shrubs, and grass tufts under warm grazing Golden Hour light with backlight translucency and clean forest road delineation.
- `s7-ponte-ou-tunel.png` (vs Ref 14): Unobstructed ravine angle of the anchored Z4 coastal viaduct bridge highlighting sweeping stone arches, paired tapered masonry piers with cross-ties planted cleanly into the wooded valley floor, concrete girder deck, and flared stone wing-wall abutments.
- `s8-disputa.png` (vs Refs 09/13): Tight wheel-to-wheel 5-car pack battle through San Marco Village showing varied models/liveries, grounded shadows, active brake lights, and multi-tier hillside townscape.
- `s9-close-pista.png`: Close-up road inspection confirming crisp 16x anisotropic asphalt grain/cracks, weathered white edge line, flush curb/gravel shoulder transition, smooth continuous steel guardrail, and Triplanar cliff rock.
- `s10-baixa-vila.png`: Exact S5 camera pose on Low preset maintaining full readability, clean shadows, and complete architectural silhouette at locked `60.0 FPS`.
- `s11-escala.png`: True 1:1 scale proof with Aurelia GT-R parked directly beside a Z3 residence's framed `2.15 m` paneled wooden front door, ground-flush cobblestone sidewalk, stone entry apron, and terracotta planter.
- `s12-mapa.png`: Clear top-down aerial overview of the entire `3.28 km` organic Mediterranean coastal island circuit surrounded by turquoise shallows and cobalt sea with zero rectangular terrain edge cutoffs.
- `s13-night-coast.png`: High-contrast starry Night Mode along Z2 cliffs showing real warm SpotLight headlight pools illuminating tarmac and Triplanar cliff walls, dark moonlit turquoise sea, sleek guardrail reflections, and crimson tail-light glow.
- `s14-night-village.png`: High-contrast Night Mode pack race through San Marco Village featuring starry indigo sky, warm glowing windows, amber sodium streetlamps, illuminated Church belfry, crisp headlights, and red tarmac brake reflections with zero whiteout bloom.
- `s15-cockpit.png`: First-person Cockpit View mid-corner on Z2 cliffs with 100% unobstructed luminous OLED cluster (`KM/H | GEAR | RPM | NITRO`), rotated dark Alcantara steering wheel with shift paddles, clean teardrop chrome side mirror, and wide windshield vista over guardrail, sea, and cliffs.
- `sweep-sheet.png` (132 frames @ 25 m intervals): Full 360° loop audit confirming zero terrain poke, zero bridge abutment clipping, smooth cliff transitions, continuous road markings/barriers, and cohesive multi-zone Mediterranean transitions across all `3,278 m`.
