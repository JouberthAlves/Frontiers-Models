// Deterministic world generation. Everything is derived, in this order, from track.json:
//   1. road mesh data           (road-geometry.js)
//   2. road collider            (Track.surfaceAt, same rows as the mesh)
//   3. terrain height field     (terrain.js, graded to the road)
//   4. terrain collider         (Terrain.heightAt, same height field)
//   5. exclusion strips         (EXCLUSION, enforced by the placement code and validateWorld)
//   6. kerbs, barriers, checkpoints (Track, by distance along the spline)
//   7. AI racing line           (ai/racingline.js)
//   8. houses, vegetation, props (placement modules, grounded by height-field ray casts)
// This module has no three.js dependency: it also runs in Node for the automated checks.

import { Track } from './track.js';
import { Terrain } from './terrain.js';
import { buildRoadGeometry } from './road-geometry.js';
import { validateWorld } from './validate.js';
import { buildRacingLine, buildSpeedProfile } from '../ai/racingline.js';
import { CAR_SPECS } from '../physics/car-specs.js';

export function buildWorld(trackJson, opts = {}) {
  const progress = opts.onProgress || (() => {});
  const t0 = Date.now();
  const track = new Track(trackJson);
  progress('track', 0.1);
  const roadGeo = buildRoadGeometry(track);
  progress('road', 0.2);
  const terrain = new Terrain(track);
  progress('terrain', 0.6);
  // AI racing line and the speed profile of each car model on it (also used by the road shader)
  const line = buildRacingLine(track);
  const profiles = {};
  for (const id of Object.keys(CAR_SPECS)) profiles[id] = buildSpeedProfile(track, line, CAR_SPECS[id], 1);
  progress('line', 0.65);
  const world = { json: trackJson, seed: track.seed, track, terrain, roadGeo, line, profiles, objects: [], lists: {}, timings: {} };
  if (opts.populate) opts.populate(world, progress);
  world.timings.buildMs = Date.now() - t0;
  return world;
}

export { validateWorld };
