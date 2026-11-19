# Costa Dorada GP — Phase Gates Verification Log (P1–P6)

All gates were executed and verified against live code, live Three.js scene/renderer inspection, and real Chromium GPU renders on NVIDIA GeForce RTX 3070 Ti (`1920×1080`). No phase was advanced with unresolved failures.

---

## Gate P1 — Track, Colliders, World Invariants & Simcade Driving Core
- **Scope**: Single-source-of-truth `track.json` (`3,278 m` closed loop, `+52.35 m` elevation gain, 4 zones Z1–Z4, anchored Z4 viaduct bridge `[2961.3..3098.4]`, Z3 plaza at `s=2155.3 m`), `TrackSpline`, exact-diagonal `TerrainSystem`, `buildRoadSystem` (shared visual + physics collider mesh), `PhysicsWorld`, `validateWorld()`, 120 Hz fixed-timestep front-axle Ackermann/lateral-slip `VehiclePhysics` + Mini-Nitro (`Shift`), and `AIController`.
- **Defects Caught & Fixed**:
  1. **Bridge abutment terrain poke (`1.917 m`)**: `validateWorld()` flagged terrain poking above the road approach inside the bridge transition blend because `terrain.ts` previously skipped road carving inside `bridgeInterior > 0.001`. **Fix**: Compute road-carved height first and blend ravine depth underneath afterwards -> `maxTerrainPokeAboveRoadM = 0.000 m`.
  2. **Initial lap duration too short (`73.7 s` on 2.91 km)**: Extended `track.json` to `3,278 m` and calibrated `topSpeedKmh` (`141 / 138 km/h`, surging `+20 km/h` on Nitro) so clean race laps run `1:49–2:01`, squarely inside the required `1:45–2:30` window.
  3. **Road edge step `0.160 m > 0.15 m` at `s = 2857.3 m` after island coastline update**: Widened flat road-side terrain shelf to `halfW + 3.8 m` (`4.4 m` in Z3) and adjusted southern shoreline offset -> `maxRoadEdgeStepM = 0.123 m` (`<= 0.15 m`).
- **Final P1 Verdict**: **PASS** (`validateWorld()` = `0` errors; Steering `D` = `+1.854 m` right / `-28.07°` CW, `A` = `-2.017 m` left / `+26.13°` CCW; Nitro accelerates `82.4 -> 95.1 km/h` and drains `0.856 -> 0.100`).

---

## Gate P2 — Hero Cars, Playable Cockpits & Visual Inspection (`s2`, `s15`)
- **Scope**: 100% agent-modeled panelized `Aurelia GT-R` (`22,432` tris LOD0, `20` mats) and `Solara Corsa WB` (`24,128` tris LOD0, `18` mats) with recessed circular wheel arches + dark inner liners, chassis-parented wheel rigs, clearcoat PBR paint, reflective transparent greenhouse glass, and full playable cockpits with live OLED gauges & rotating steering wheel.
- **Defects Caught & Fixed**:
  1. **Blocky nose/headlight bezels & side mirrors in first-pass `s2`**: Replaced protruding box headlight bezels, flat rectangular chin splitter, flat rear fascia, and rectangular wing mirrors with a sculpted 5-row wrap-around curved front nose loft, contoured carbon splitter, flush recessed LED headlamp cavities, smooth wrap-around rear bumper, aerodynamic teardrop side mirrors, and sloped front fender crests (`frontTopY`) meeting the hood seamlessly.
  2. **Night headlight volumetric cone artifact (`s13`, `s14`)**: `ConeGeometry` mesh beams pointed their wide base backward across the foreground road, creating opaque beige triangles. **Fix**: Removed solid cone meshes and calibrated real `THREE.SpotLight` beams (`intensity: 235`, `penumbra: 0.62`) + crisp emissive LED lenses + crimson tail bounce light.
  3. **Cockpit gauge occlusion & mirror sliver (`s15`)**: Steering wheel top rim obscured the bottom of the digital speedometer/RPM display, and side-mirror ellipsoid poked slightly through the mirror glass. **Fix**: Raised the hooded OLED cluster (`+0.037 m`), lowered steering column (`-0.048 m`) with sleek dark Alcantara rim, and offset mirror chrome face `+0.012 m` rearward -> 100% unobstructed `KM/H | GEAR | RPM | NITRO` telemetry and clean mirror reflection.
- **Final P2 Verdict**: **PASS** (`s2-grid-3-4.png` & `s15-cockpit.png` visually verified; both cars `> 22k` tris LOD0 with parented wheels & active cockpits).

---

## Gate P3 — PBR World, Shaders, CSM, Coastal Geography & Village Density (`s1`, `s3`–`s7`, `s9`–`s12`)
- **Scope**: Bundled real scanned CC0 Poly Haven 2K/1K PBR sets, ambientCG 1024² RGBA botanical foliage clusters, Poly Haven 2K Golden Hour & Night HDRIs, 3-cascade 2048² CSM, N8AO, AgX tone mapping, MSAA 4x + SMAA, Bloom, background-only motion blur, Triplanar cliffs, foliage translucency, San Marco Coastal Village (`238` units, `6` archetypes, `3` depth tiers, `4` alleys, Hero Church + 24 m Campanile), 4 tree species + shrubs + grass, and anchored Z4 viaduct bridge.
- **Defects Caught & Fixed**:
  1. **`CSM.setupMaterial()` overwriting custom `onBeforeCompile` shaders (root cause of missing road lines, missing terrain splat/Triplanar cliffs, missing foliage translucency, missing wall grime)**: Three.js `CSM.js` assigns `material.onBeforeCompile = ...` directly (and `delete`s it on `dispose()`). **Fix**: Preserved `mat.userData.__origOBC` & `customProgramCacheKey` in `RenderPipeline.registerMaterialForCSM()` and chained CSM + custom shaders cleanly across quality switches -> unlocked 4-layer PBR terrain splatting + world-space Triplanar limestone cliffs (albedo + normal) + glossy wet sand + crisp road edge/center/grid/checkered markings + Z1 sand-drift decals + foliage backlight translucency + wall-base grime.
  2. **Z2 outer sea overlook blocked by northern headland elevation**: Carved an organic 4-sided Mediterranean peninsula/island coastline (`smin` of West bay, North cliff cape, East & South coasts) so Z2 overlooks open turquoise Mediterranean sea on the outside while Triplanar limestone cliffs rise on the inside, and `s12-mapa.png` has zero rectangular terrain mesh borders.
  3. **Spiky coastal boulders & staircased Z2 guardrails**: Replaced per-vertex RNG boulder warp with deterministic smooth directional displacement (`IcosahedronGeometry(r, 3)`) and replaced discrete guardrail `BoxGeometry` segments with a continuous spline-extruded W-beam steel ribbon.
  4. **HDRI sun glare blowout on East-facing Z2 shots (`s4`, `s9`, `s15`) & hard white sun sphere (`s1`)**: Aligned Golden Hour HDRI `backgroundRotation.y = 3.45` toward NW bay, replaced hard sun sphere with a soft additive radial atmospheric halo shader, and raised Golden Hour bloom threshold to `2.10`.
  5. **Z4 Viaduct camera backface clip (`s7`) & bridge exit abutment poke (`sweep_3100m.png`)**: Added stone viaduct arches + flared wing walls, moved `s7` camera safely above terrain inside the clear ravine vista, and lowered abutment top to `-1.0 m` below road grade -> zero terrain/masonry poke across all 132 sweep thumbnails.
  6. **Door Z-fighting & empty planters (`s11`, `s5`)**: Separated door jambs/lintel from recessed paneled wood door, added ground-level stone entry aprons bridging cleanly to cobblestone sidewalks, and added crossed rosemary/olive foliage inside Z3 terracotta planters.
- **Final P3 Verdict**: **PASS** (all 15 screenshots + 8 side-by-side comparisons + 132-frame `sweep-sheet.png` visually inspected; `0` synthetic primary maps, `0` materials `< 1024px`, `16x` road anisotropy, `2048×2048` asphalt).

---

## Gate P4 — Night Mode Lighting & Contrast (`s13`, `s14`)
- **Scope**: Full Night Mode switch (`kloppenheim_02_puresky` HDRI, dark indigo fog, player + nearest rival real `SpotLight` headlights, glowing lenses on all 6 cars, crimson tail bounce, 18 real warm amber sodium Z3 streetlamps, lit building windows, church belfry & facade uplights, Z1 gantry & Z4 bridge floodlights).
- **Defects Caught & Fixed**:
  1. **Over-bright center hotspot in packed Z3 Night traffic (`s14`)**: Reduced concurrent active AI `SpotLight` pairs from 4 cars to player + 1 nearest rival (4 crisp SpotLights + emissive lenses on all 6 cars), calibrated `SpotLight.intensity = 235`, and tuned Night `bloomPass` (`strength: 0.26, threshold: 1.28`) -> dramatic dark starry sky with warm amber pools and zero whiteout.
- **Final P4 Verdict**: **PASS** (`s13-night-coast.png` & `s14-night-village.png` visually verified; `58.8 FPS` in Z3 Night with 5 AI cars).

---

## Gate P5 — Multi-Band CC0 Audio Pipeline & Full-Lap Master Capture (`audio-volta.wav`)
- **Scope**: 26 bundled CC0 recordings (6 stationary RPM loops for GT-R, 4 exterior + 2 interior stationary RPM loops for Corsa, tire screech, asphalt/gravel roll, coastal wind, impact, scrape, exhaust pop, nitro whoosh, ocean/gulls, village, church bell, forest birds, cicadas/crickets), 6-bus mix into `DynamicsCompressor` + `-1.31 dBFS` brickwall limiter, 3D spatial AI Doppler voices, and real post-limiter PCM master capture.
- **Defects Caught & Fixed**:
  1. **OS 192 kHz default AudioContext inflating WAV to 143 MB**: Explicitly initialized `new AudioContext({ sampleRate: 48000 })` (with safe fallback) -> clean studio 48 kHz 16-bit stereo `audio-volta.wav` (`21.33 MB` for `116.48 s`).
- **Final P5 Verdict**: **PASS** (`masterPeakDbfs: -7.20 dBFS <= -1.0 dBFS`, `maxSimultaneousVoices: 21`, `30` logged dynamic events across `ai_passby`, `gear_shift`, `nitro_boost`, `bridge_transition`; `0` audio errors or voice leaks across 3 Pause/Restart/Menu cycles).

---

## Gate P6 — Performance Optimization, 6-Car Stability & Full Automated Verification (`npm ci && npm run verify`)
- **Defects Caught & Fixed**:
  1. **Severe CPU draw-call bottleneck (`9,377` draw calls -> `8.8 FPS` High / `21.2 FPS` Low in Z3)**: 238 multi-part buildings + props + 6 detailed cars submitted ~9,300 separate static `THREE.Mesh` objects across 4 shadow/main passes. **Fix**: Implemented `mergeStaticGroupByMaterial()` (`src/utils/meshMerge.ts`) batching static meshes by `(material, castShadow, receiveShadow)` in `architecture.ts`, `propsAndBridge.ts`, and `carBuilder.ts`, skipped redundant CSM re-registration on restarts, disabled shadow casting on small groundcover shrubs, and added `CarVisualRig.dispose()` for zero memory leaks. **Result**: Draw calls fell `8×` (`9,377 -> 1,193` across all CSM + N8AO + main + post passes), JS heap fell `3×` (`2,498 MB -> 803 MB`, `0 MB` delta), and Z3 5-AI FPS jumped `6×` (`8.8 -> 51.7 FPS` High Golden Hour, `9.1 -> 58.8 FPS` High Night, `21.2 -> 60.0 FPS` Low Golden Hour).
  2. **Test autopilot starting-grid resets (`totalResetsAllCars = 2` in 3-lap / `4` in 6-lap)**: Headless 6-car diagnostic proved all 5 AI cars already had `0` resets, while `computeTestAutopilotInput` lacked lane smoothing & side-by-side separation off the start grid. **Fix**: Routed `computeTestAutopilotInput` through the same smooth lane-planning, side-by-side separation, and curvature-braking `AIController` -> **`totalResetsAllCars = 0`** across 1-lap, 3-lap, and 6-lap races (`aiMaxStuckSec = 0.17 s`, `31` overtakes).
- **Final P6 Verdict**: **PASS** (`npm ci && npm run verify` exited with code `0`; all 9 automated checks + `volta.webm` + `audio-volta.wav` + `s1`–`s15` + 132-frame `sweep-sheet.png` green with `0` console/page errors; total app+assets+dist footprint `138.46 MB <= 400 MB`).
