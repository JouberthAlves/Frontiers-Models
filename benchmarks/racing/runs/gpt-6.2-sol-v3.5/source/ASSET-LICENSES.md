# Asset licenses

Corsa di Vetra uses original meshes for both cars, the cabins, track, architecture, vegetation, landscape and props. The locally bundled external files below are CC0. The benchmark JPGs remain in `refs/` for comparison captures and have the original rights stated by the benchmark. The static build contains the game assets and original work.

## Poly Haven scans and skies

Images were converted to WebP at the listed map dimensions. The suffixes `-a`, `-n`, `-r` and `-o` identify color, OpenGL tangent normals, roughness and ambient occlusion. The scanned sand and limestone albedo files also pack roughness in alpha for the shared terrain shader. The tread and rubber diffuse maps were desaturated. Scuba Suede was downsampled from 2048 × 2004 to 1024². [Poly Haven CC0 terms](https://polyhaven.com/license)

| Bundled stem | Size | Application | Source |
| --- | ---: | --- | --- |
| `golden.hdr` | 4096 × 2048 | Golden Hour sky and reflections | [Kloppenheim 06, pure sky](https://polyhaven.com/a/kloppenheim_06_puresky) |
| `night.hdr` | 4096 × 2048 | Night sky and reflections | [Kloppenheim 02, pure sky](https://polyhaven.com/a/kloppenheim_02_puresky) |
| `asphalt` | 2048² | Asphalt color, relief and response | [Asphalt Track](https://polyhaven.com/a/asphalt_track) |
| `sand` | 1024² | Dunes, beach, wet sand and drift onto road | [Coast Sand 01](https://polyhaven.com/a/coast_sand_01) |
| `earth` | 1024² | Forest floor and exposed earth | [Forest Ground 04](https://polyhaven.com/a/forest_ground_04) |
| `grassland` | 1024² | Grassy slopes and pastures | [Grass Ground](https://polyhaven.com/a/grass_ground) |
| `limestone` | 1024² | Triplanar cliff layer and generated boulders | [Marble Cliff 02](https://polyhaven.com/a/marble_cliff_02) |
| `stone` | 1024² | Parapets, masonry, frames, plinths and bridge | [White Sandstone Blocks 02](https://polyhaven.com/a/white_sandstone_blocks_02) |
| `pavers` | 1024² | Sidewalks, alleys and plaza paving | [Pavement 02](https://polyhaven.com/a/pavement_02) |
| `plaster` | 1024² | Stucco facade variants | [White Stucco](https://polyhaven.com/a/white_stucco) |
| `tile` | 1024² | Terracotta roof tiles | [Clay Roof Tiles 02](https://polyhaven.com/a/clay_roof_tiles_02) |
| `wood` | 1024² | Shutters, doors, fences and seating | [Weathered Brown Planks](https://polyhaven.com/a/weathered_brown_planks) |
| `metal` | 1024² | Guardrails, hardware and trackside structures | [Rusty Metal 05](https://polyhaven.com/a/rusty_metal_05) |
| `bark` | 1024² | Olive and cypress trunks and branches | [Bark Brown 02](https://polyhaven.com/a/bark_brown_02) |
| `pine` | 1024² | Pine trunks and branches | [Pine Bark](https://polyhaven.com/a/pine_bark) |
| `palm` | 1024² | Palm trunk and frond stems | [Palm Tree Bark](https://polyhaven.com/a/palm_tree_bark) |
| `rubber` | 1024² | Car tire wall texture | [Rubberized Track](https://polyhaven.com/a/rubberized_track) |
| `tread` | 2048² | Car tire tread, image maps only | [Old Tyre texture channels](https://polyhaven.com/a/old_tyre) |
| `suede` | 1024² | Cockpit upholstery and awning fabric | [Scuba Suede](https://polyhaven.com/a/scuba_suede) |

## ambientCG botanical atlases

Each atlas is 1024², with the provided opacity combined with color and the original normal and roughness maps converted to WebP. Leaf Set 026 was downsampled from the 2048 × 1024 source. The tree and plant structure, branching and leaf card geometry are original. [ambientCG CC0 terms](https://docs.ambientcg.com/license/)

| Bundled stem | Primary use | Source |
| --- | --- | --- |
| `leaves` | Olive canopy leaves | [Leaf Set 024](https://ambientcg.com/view?id=LeafSet024) |
| `needles` | Pine and cypress needle branches | [Leaf Set 019](https://ambientcg.com/view?id=LeafSet019) |
| `grass` | Groundcover blades and palm leaflets | [Foliage 008](https://ambientcg.com/view?id=Foliage008) |
| `frond` | Shrub leaves and window-box foliage | [Leaf Set 026](https://ambientcg.com/view?id=LeafSet026) |

## Audio samples

The soundtrack and effects use CC0 recording excerpts, equalized and trimmed with overlapping loop seams as needed. The load and coast engine layers use different windows. The Veloce uses the GT source between 0.40 and 3.21 s plus the idle loop. The Nerita uses short idle windows at 9.30 and 11.38 s and rev windows between 15.87 and 21.01 s. Runtime playback blends five bands per model and layer without restarting the sources on a shift. Countdown, confirmation and finish tones are original UI cues.

| Bundled clip | Use | CC0 source |
| --- | --- | --- |
| `gt-load-*`, `gt-coast-*` | Veloce engine | [Car Go Fast! by Beetlemuse](https://freesound.org/people/Beetlemuse/sounds/678961/) and [Racing Car Engine Sound Loops by domasx2](https://opengameart.org/content/racing-car-engine-sound-loops) |
| `rs-load-*`, `rs-coast-*` | Nerita engine | [3008 start, idle, rev and shutoff by Mihacappy](https://freesound.org/people/Mihacappy/sounds/815853/) |
| `rolling.wav` | Asphalt and bridge rolling | [Car rolling on asphalt by orlandorizo](https://freesound.org/people/orlandorizo/sounds/591079/) |
| `curb.wav` | Curb contact | [Car tyres on cobbled street by pnwheeler](https://freesound.org/people/pnwheeler/sounds/831720/) |
| `gravel.wav` | Sand and loose surface contact | [Car Tires Start and Stop on Gravel Shoulder by UnplugTheFridge](https://freesound.org/people/UnplugTheFridge/sounds/529225/) |
| `skid.wav` | Tire slip | [Car peels off by therisingorder](https://freesound.org/people/therisingorder/sounds/271337/) |
| `wind.wav`, `nitro.wav` | Cliff wind and layered boost rush | [Nice windy beach by xkeril](https://freesound.org/people/xkeril/sounds/637117/) |
| `surf.wav` | Surf, gulls and menu ambience | [Waves and seagulls on the beach close to Lisbon by Felix Blume](https://freesound.org/people/felix.blume/sounds/468452/) |
| `bells.wav` | Village ambience | [Bells distant in town by ivolipa](https://freesound.org/people/ivolipa/sounds/266525/) |
| `pines.wav` | Daytime woodland ambience | [Cicadas, light wind and birds in Catalunya by Juno24](https://freesound.org/people/Juno24/sounds/845256/) |
| `crickets.wav` | Night woodland ambience | [Crickets at night in a forest by LukaCafuka](https://freesound.org/people/LukaCafuka/sounds/750874/) |
| `impact.wav`, `scrape.wav` | Impact, scrape and short boost ignition accent | [Metalic bang crash by Sadiquecat](https://freesound.org/people/Sadiquecat/sounds/855682/) |

## Library

Three.js provides WebGL rendering, post-processing and shadow cascades. The runtime dependency and its version are in `package-lock.json`. [Three.js MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
