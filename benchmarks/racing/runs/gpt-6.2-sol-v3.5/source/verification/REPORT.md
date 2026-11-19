# Racing Bench V4 verification

## Runtime results

- Load built bundle · Pass
- 3-lap journey and AI · Pass
- Pause, restart and menu cleanup · Pass
- Steering direction and nitro · Pass
- Sequential-checkpoint cut rejection · Pass
- 6-lap journey, night start and world integrity · Pass
- Playable build journeys · Pass
- 15 reproducible screenshots · Pass
- Gather live scene and renderer statistics · Pass
- Scene, asset and render pipeline audit · Pass
- Timed village performance · Pass
- 25 m circuit sweep on high and low · Pass
- One live lap with post-limiter PCM and muxed video · Pass
- Local asset requests and browser errors · Pass
- Static build size and reference isolation · Pass
- Active race audio voices before and after three restart cycles · 25 → 25 → 25 → 25
- Scene and renderer data were read from the running WebGL build. See [scene-stats.json](scene-stats.json).
- See the complete [test log](test-logs.json).

## Performance

ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Ti (0x00002482) Direct3D11 vs_5_0 ps_5_0, D3D11) · AMD Ryzen 7 5700G with Radeon Graphics          · Chromium 159.0.8154.6 · 1920 × 1080

| Quality | Lighting | AI cars | Average FPS | 1% low FPS |
| --- | --- | ---: | ---: | ---: |
| high | Golden hour | 5 | 87.1 | 46.0 |
| high | Night | 5 | 93.0 | 49.8 |
| low | Golden hour | 5 | 97.2 | 26.9 |

All samples were taken during an active race in the village. The Low measurements use the same discrete GPU. See [the timing data](performance.json).

## Live audio and video

The lap took 107.38 s. The post-limiter stereo track contains 108.65 s at 48000 Hz. Peak level was -2.81 dBFS, with a maximum of 32 simultaneous voices. [PCM WAV](audio-volta.wav) · [WebM with audio](volta.webm)

- 00:02 · Gear shift
- 00:02 · Nitro boost
- 00:08 · Tire slip
- 00:09 · Impact
- 01:30 · Bridge entry
- 00:10 · AI pass

## Side-by-side review

### S1 — s1-reta-orla.png

- The setting sun produces a bright strip along the asphalt. Ref 01 spreads the orange backlight farther around the car silhouette.
- The palm leaflets are visible, with slimmer crowns and longer clear gaps between trunks than Ref 01.
- The view across Cala’s bay starts behind a low sandstone wall. Ref 02 puts the curved beach in an uninterrupted foreground-to-horizon vista.

[Capture](s1-reta-orla.png) · [Comparison](compare/s1.png)

### S2 — s2-grid-3-4.png

- The Veloce’s bonnet has sharply cut vent borders and a broad single central plane. Ref 11 changes curvature across more of the rear quarter and bumper.
- The Veloce’s brake disc and caliper sit behind thin silver spokes. Ref 11 has a darker barrel, deeper-looking rim and higher contrast around the brakes.
- The Veloce glazing is light enough to reveal the seats. Ref 11 has stronger dark building reflections in the glass and paint.

[Capture](s2-grid-3-4.png) · [Comparison](compare/s2.png)

### S3 — s3-praia-espuma.png

- The foam follows narrow parallel lines and circles at the limestone rocks. Ref 04 shows more irregular broken foam around the rock edges.
- The water in the foreground is clearer and greener. Ref 04 has darker reflections between the breaking waves.
- The limestone break at the horizon has a lower profile than the distant serrated ridge in Ref 02.

[Capture](s3-praia-espuma.png) · [Comparison](compare/s3.png)

### S4 — s4-falesia-mirante.png

- The right rail and contour of the cape reveal the sea; Ref 02 exposes a longer stretch of beach below the car.
- The rock formations along the inside verge have smaller overhangs and fewer exposed fractures than Ref 02.
- The smoother, banked asphalt and guardrail establish a highway scale, while Ref 02 frames dirt ruts and rough scree in the immediate foreground.

[Capture](s4-falesia-mirante.png) · [Comparison](compare/s4.png)

### S5 — s5-vila-rua.png

- Stucco, shutters and rows behind the streetfront are visible. The village roofs have more uniform red tones than Ref 05.
- Cala uses wider paved space between the facades. Ref 06 brings the stone walls and props closer to the moving cars.
- The village’s recesses and sidewalk shadows remain quite clean and hard-edged. Ref 07 shows more color variation where plaster meets the street.

[Capture](s5-vila-rua.png) · [Comparison](compare/s5.png)

### S6 — s6-bosque-luz.png

- The branch and shrub layers leave gaps of dry ground from the chase camera. Ref 08 shows thicker groundcover at the tire line.
- The pine crowns are thin enough to transmit the light and have more individually visible branch clusters than Ref 10.
- Cala has warm highlights between tree shadows with little airborne dust; the light in Ref 10 has a broader amber haze.

[Capture](s6-bosque-luz.png) · [Comparison](compare/s6.png)

### S7 — s7-ponte-ou-tunel.png

- The two shallow arches sit directly in the ravine. Ref 14 shows the deck against a wider valley and taller distant mountains.
- Cala’s masonry repeats more regularly across the abutments. Ref 14 has more exposed rock mixed into the base of the structure.
- The S7 camera is close to the outer deck, which gives the rails greater visual weight than the more distant framing of Ref 14.

[Capture](s7-ponte-ou-tunel.png) · [Comparison](compare/s7.png)

### S8 — s8-disputa.png

- The cars hold a visible side-by-side line. Ref 13 compresses the gaps and fills more of the frame with the chasing cars.
- Cala’s six numbers and body colors carry the grid identity. Ref 13 has stronger differences in headlight and roof profiles.
- The strip of sun on the road is subtle, with less streaking across scenery than the corner background in Ref 09.

[Capture](s8-disputa.png) · [Comparison](compare/s8.png)

## Circuit sweep

Captured 212 chase thumbnails in 25 m increments. [Sweep sheet](sweep-sheet.png)

- The waterfront stays open to the sky and sea. Palm spacing and the exposed hillside around 400–600 m leave more bare ground than Ref 01.
- The steep limestone faces around 675–900 m keep texture scale. Lane paint sits on the road in both presets. The bridge edge exposes the notch across the ravine.
- Second and third roof tiers show through the streetfront gaps around the village. Several gaps between lamps still have few street-level props.
- Low retains the shrubs and trees near the verge. The distant canopy is thinner around the woods entrance and ravine.
