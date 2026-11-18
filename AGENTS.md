# AGENTS.md

Instructions for any agent (Claude Code, Codex, Cursor…) working in this repository.

## Adding or updating a model run: also update the website

Every current run in this archive is also shown on the website **[frontier-models-ui.vercel.app](https://frontier-models-ui.vercel.app)**, built from the repository **`JouberthAlves/frontier-models-ui`**. Whoever adds models here already has push access to it.

When a run is added, replaced or moved in or out of the current arena (`benchmarks/racing/RUNS.json` or `benchmarks/solar-system/RUNS.json`), the same task is not done until the website shows it. After the archive change is merged:

1. **Make the commit reachable in the fork.** The website links each run's source to `github.com/JouberthAlves/Frontiers-Models/tree/<commit>/…`. If you work in `bielxdh3/Frontiers-Models`, update the fork first ("Sync fork" on GitHub, or push `main` to it). Publishing the site before this leaves broken "Code" links.
2. **Clone the site next to this repository**, so both folders sit side by side: `../frontier-models-ui` and this repository as `../Frontiers-Models` (the folder name the sync script expects; pass `--fork <path>` otherwise).
3. **Follow the site's own guide**: section "Como adicionar um modelo novo" in `frontier-models-ui/AGENTS.md`. In short:
   - `npm install`, then `npm run sync -- --fork ../Frontiers-Models --commit <sha of this repo's main>`, and set `DEFAULT_COMMIT` in `scripts/sync.mjs` to that sha.
   - Racing runs need the 12 scene screenshots (S1–S12) under `source/verification/`; the sync stops and lists any that are missing. If the screenshots show an FPS or other performance counter, add its box to `OVERLAYS` in `scripts/sync.mjs`.
   - Model color and short name: `src/data/models.ts` (rules in the site's AGENTS.md, section "Escolher a cor de um modelo novo").
   - If the run used a different prompt version, update the Racing/Orbitarium intro text in `src/i18n/pt.ts` and `src/i18n/en.ts`.
   - `npm run build && npm run lint`, check the changed section at 375 px and 1440 px.
4. **Commit and push** to `main` of `frontier-models-ui`, in English with a prefix (`added: GPT-X to Racing`). Every push to `main` deploys to production on Vercel, so push only what you checked.

The website never writes to this repository: it only reads it with `git show` during the sync. It shows no scores, rankings or winners, so nothing in this archive needs to change for it.
