# Gate results

## P1 — Skeleton and handling

Browser checks passed for the 2,637.96 m circuit, 25.46 m minimum radius, 11.66% maximum grade, and 4.10° maximum bank. The first uninterrupted timed lap took 105.81 s. The A/D and arrow-key tests produced the expected lateral and yaw signs. A one-second Shift input increased exit speed by 1.39 m/s and consumed 16.5 percentage points of nitro. The browser recorded zero safety resets.

The first map showed rectangular heightfield transitions at the village and noisy depth overlap on the road. A wider terrain query and gradual village grading removed the discontinuities. A tighter overhead depth range cleaned up the route outline. Ref 02 shows the shoreline folding below a steep, rocky foreground; the skeleton establishes the bay and the climb, with shoreline materials and rock detail scheduled for the waterfront and cliff gates. See [the chase comparison](gates/p1-reference.png) and [measurements](gates/p1.json).

## P2 — Pipeline, cars and cockpit

The browser counted 55,154 triangles in the Veloce GT and 53,090 in the Nerita RS. Both cars had four chassis-parented wheel hubs, separate PBR materials and a live instrument display. The cockpit capture recorded 0.208 radians at its steering-wheel node during a right turn. Four-sample MSAA, depth-derived GTAO, AgX and three 2048² shadow cascades were active on the RTX 3070 Ti. World validation remained clean.

The first review caught grille panels breaking through the bumper, mirrored door numbers and excessive headlight bloom. Curved grille insets, corrected numbers and a lower bloom gain resolved those defects. Moving the cockpit eye back exposed the wheel and more of the dash. The stationary view shows open wheel wells; the game updates the hubs and body together. Compared with Ref 11, the shoulder surfaces have fewer compound curves, the brake hardware is less exposed and the paint has simpler environmental reflections. See [the car comparison](gates/p2-reference.png) and [live scene measurements](gates/p2.json).

## P3 — Waterfront

World checks passed with 2048² scanned asphalt, 16× anisotropy and 30 animated rock-foam sources. The gate capture showed gravel and rubber tint at grazing incidence, a visible shore break and a continuous, grounded parapet. Thicker, overlapping palm leaflets and lower sky and water bloom brought out the silhouettes and coast. The source images still show thicker palm crowns, deeper graded beach contours and more irregular wave fronts than this scene. See [the straight](gates/p3-s1.png) and [the surf](gates/p3-s3.png).

## P4 — Uplands and night

The live scene counted 203 buildings across six archetypes and three tiers. Night capture recorded six active car headlights and eight active streetlights. Both quality settings retained four tree species, shrubs and groundcover near the road. The first review found that the embankment masked the bridge soffit and the cliff shot faced a hill. Splitting the verge at the bridge deck exposed the stone arches. Adding the east shore and reshaping the overlook exposed the sea beyond the guardrail. The scale capture moved to a raycast road-shoulder pose, where the four-wheel plate is unobstructed. Terrain and asphalt shaders remained active after packing roughness into the scanned sand and cliff texture alpha channels. See [the live scene measurements](gates/p4.json).

## P5 — Race flow, AI, audio and HUD

The Playwright journeys completed three and six laps through the menu and race screens. Steering, nitro, lap cut rejection, camera toggles, AI passing, pause and restart passed. Three restart cycles returned to the same runtime voice count. A missing plant AO texture was caught during the new missing-asset check and removed from that material’s inputs. The live A/V run captured a 107.38 s lap, all six requested audio events and a −2.34 dBFS master peak. See [the gameplay log](gates/p5.json).

## P6 — Final static build

The first static audit found that two 1K source variants had a shorter edge below 1024 pixels. Replacing them with downsampled 2K botanical and fabric scans passed the live audit. The rebuilt course completed both 25 m sweeps and the six-lap and three-lap journeys. The off-track cut test crossed a real checkpoint off the asphalt, drove beyond finish distance and received zero laps. The measured 1080p averages were 87.1 FPS on High in Golden Hour, 93.0 FPS on High at Night and 97.2 FPS on Low in Golden Hour on the RTX 3070 Ti.

The final one-lap recording has VP8 video, live Opus audio and a matching 48 kHz post-limiter WAV. The master peaked at −2.81 dBFS. The clean build occupied 80.9 MB and the browser reported zero external requests and zero errors. See [the report](REPORT.md), [performance](performance.json) and [the audio test](audio-test.json).
