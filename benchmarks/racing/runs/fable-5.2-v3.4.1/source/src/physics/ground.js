// Ground query used by every wheel: the road corridor (same rows as the road mesh) where the
// point is on it, otherwise the terrain height field (same array as the terrain mesh).

import { SURF } from '../world/track.js';

const VERGE_SURF = [SURF.GRASS, SURF.SAND, SURF.GRASS, SURF.GRAVEL, SURF.PAVING];

export class Ground {
  constructor(world) { this.track = world.track; this.terrain = world.terrain; }

  /**
   * @param out receives y, nx, ny, nz, surf, i (hint for the next call), s, d, onRoad, onCorridor
   */
  sample(x, z, hint, out) {
    const track = this.track, terrain = this.terrain;
    const on = track.surfaceAt(x, z, hint, out);
    out.onCorridor = on;
    if (on) return out;
    out.y = terrain.heightAt(x, z);
    const e = 0.75;
    const hx = terrain.heightAt(x + e, z) - terrain.heightAt(x - e, z), hz = terrain.heightAt(x, z + e) - terrain.heightAt(x, z - e);
    const nx = -hx, ny = 2 * e, nz = -hz; const l = Math.hypot(nx, ny, nz) || 1;
    out.nx = nx / l; out.ny = ny / l; out.nz = nz / l;
    out.surf = VERGE_SURF[track.verge[out.side][out.i]] ?? SURF.GRASS;
    return out;
  }

  heightAt(x, z, hint = -1) {
    const o = this._o || (this._o = {});
    return this.sample(x, z, hint, o).y;
  }
}
