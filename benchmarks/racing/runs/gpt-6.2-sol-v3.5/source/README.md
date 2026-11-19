# Corsa di Vetra

Corsa di Vetra is an offline desktop-browser racing game for Racing Bench V4. Choose the Veloce GT or Nerita RS, pick one of six numbered liveries, and race five AI drivers in Golden Hour or Night. The fictional 2.638 km Cala di Vetra circuit runs through the waterfront, cliffs, village and coastal woods.

## Run the game

Use Node.js 22.12 or later and a current desktop browser with WebGL 2. Run these commands from the project directory.

```sh
npm ci
npm run build
npm run play
```

Open [Corsa di Vetra](http://127.0.0.1:4173/). The browser loads scripts, textures, sky panoramas and sound from the local server. Any static HTTP server can serve the contents of `dist/`, including its root `index.html` and `track.json`. The built folder can be copied to an offline machine. Start the game from its HTTP address so module imports and audio worklets can load.

## Controls

| Action | Keyboard | Gamepad |
| --- | --- | --- |
| Accelerate | W or ↑ | Right trigger |
| Brake or reverse | S or ↓ | Left trigger |
| Steer | A/D or ←/→ | Left stick |
| Mini-nitro | Either Shift key | A, X or right bumper |
| Chase / cockpit | C | Y or Triangle |
| Pause / resume | Esc | Start |

Nitro recharges during clean, fast driving and charges faster in a controlled slide. Three laps, Normal AI and Golden Hour are the default. Settings controls graphics quality and volume.

## Verify

```sh
npm ci
npm run verify
```

Verification uses Playwright Chromium and a local static server. The first run can install the matching Chromium build through Playwright. A complete run includes a real-time lap, two circuit sweeps and live rendering measurements. Keep the supplied `refs/` beside the source for the comparison sheets.

The [verification report](verification/REPORT.md) records the browser, GPU, CPU, measured frame rates, known failures, and limitations from visual review. The [gate log](verification/GATES.md) describes the corrections made after the staged captures. [Asset provenance](ASSET-LICENSES.md) identifies the CC0 photographic and audio sources.

## Tested performance

Measurements were taken during active racing in the village with five AI cars. The test system used an NVIDIA GeForce RTX 3070 Ti, AMD Ryzen 7 5700G, and Chromium 159.0.8154.6 at 1920 × 1080.

| Preset | Lighting | Average FPS | 1% low FPS |
| --- | --- | ---: | ---: |
| High | Golden Hour | 87.1 | 46.0 |
| High | Night | 93.0 | 49.8 |
| Low | Golden Hour | 97.2 | 26.8 |

## Known limitations

- The visual comparisons document gaps in foliage density, masonry variation, car reflections, and the scale of the cliff vistas against the supplied commercial references.
- Verification can measure the Low preset on the detected adapter. Testing on a modern integrated GPU requires an available integrated adapter. Driving and the keyboard path were tested in Chromium, with gamepad controls mapped to the standard layout.
- Engine layers loop short slices edited from real recordings. The five mapped bands are game control points. The source sessions document RPM values for only part of the material.
