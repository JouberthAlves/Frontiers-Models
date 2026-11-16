import { TrackSpline } from '../world/track';
import { ArcadeVehicle } from '../physics/vehicle';

export interface RacerProgress {
  vehicleIndex: number;
  name: string;
  carModel: string;
  liveryName: string;
  isPlayer: boolean;
  lap: number; // 1-based active lap
  lastCheckpoint: number; // 0..N-1 sequential
  checkpointsPassedInLap: number;
  lastS: number;
  totalProgressMeters: number;
  lapStartTimeSec: number;
  bestLapTimeSec: number | null;
  currentLapTimeSec: number;
  finished: boolean;
  finishTimeSec: number | null;
  projectedFinishStr: string | null;
  rank: number;
}

export class RaceRulesTracker {
  public readonly track: TrackSpline;
  public readonly totalLaps: number;
  public readonly racers: RacerProgress[] = [];
  public raceClockSec = 0;
  public playerFinished = false;
  public antiCutBlockedCount = 0;

  constructor(
    track: TrackSpline,
    totalLaps: number,
    entries: {
      vehicleIndex: number;
      name: string;
      carModel: string;
      liveryName: string;
      isPlayer: boolean;
      startS: number;
    }[]
  ) {
    this.track = track;
    this.totalLaps = totalLaps;

    for (const e of entries) {
      this.racers.push({
        vehicleIndex: e.vehicleIndex,
        name: e.name,
        carModel: e.carModel,
        liveryName: e.liveryName,
        isPlayer: e.isPlayer,
        lap: 1,
        lastCheckpoint: 0,
        checkpointsPassedInLap: 1,
        lastS: e.startS,
        totalProgressMeters: e.startS - track.totalLength, // grid is just behind s=0 or at s=12..42
        lapStartTimeSec: 0,
        bestLapTimeSec: null,
        currentLapTimeSec: 0,
        finished: false,
        finishTimeSec: null,
        projectedFinishStr: null,
        rank: 1,
      });
      // Since grid spawns at s=10..42m AFTER s=0 start line, start progress cleanly at e.startS!
      this.racers[this.racers.length - 1].totalProgressMeters = e.startS;
    }
  }

  public update(dt: number, vehicles: ArcadeVehicle[], raceStarted: boolean): void {
    if (!raceStarted) return;
    this.raceClockSec += dt;
    const cpCount = this.track.checkpoints.length;
    const L = this.track.totalLength;

    for (let i = 0; i < this.racers.length; i++) {
      const r = this.racers[i];
      const v = vehicles[r.vehicleIndex];
      if (!v || r.finished) continue;

      r.currentLapTimeSec = this.raceClockSec - r.lapStartTimeSec;

      // Determine current nearest sequential checkpoint
      const s = v.currentS;
      const expectedNext = (r.lastCheckpoint + 1) % cpCount;
      const cp = this.track.checkpoints[expectedNext];
      const distToNextCp = Math.hypot(v.pos.x - cp.pos.x, v.pos.z - cp.pos.z);

      // Advance checkpoint ONLY sequentially (within generous road corridor radius 24m)
      if (distToNextCp < 24.0) {
        r.lastCheckpoint = expectedNext;
        r.checkpointsPassedInLap++;
      } else {
        // Also allow +2 skip if driving super fast across a checkpoint frame, never skip >= 4!
        const next2 = (r.lastCheckpoint + 2) % cpCount;
        const cp2 = this.track.checkpoints[next2];
        if (Math.hypot(v.pos.x - cp2.pos.x, v.pos.z - cp2.pos.z) < 22.0) {
          r.lastCheckpoint = next2;
          r.checkpointsPassedInLap += 2;
        }
      }

      // Detect start/finish line crossing (lastS near L -> s near 0)
      const crossedFinishForward = r.lastS > L * 0.78 && s < L * 0.22;
      if (crossedFinishForward) {
        // Require at least 80% of sequential checkpoints passed in this lap (anti-cut!)
        if (r.checkpointsPassedInLap >= Math.floor(cpCount * 0.8)) {
          const lapDuration = this.raceClockSec - r.lapStartTimeSec;
          if (r.bestLapTimeSec === null || lapDuration < r.bestLapTimeSec) {
            r.bestLapTimeSec = lapDuration;
          }
          r.lapStartTimeSec = this.raceClockSec;

          if (r.lap >= this.totalLaps) {
            r.finished = true;
            r.finishTimeSec = this.raceClockSec;
            r.totalProgressMeters = this.totalLaps * L + s;
            if (r.isPlayer) {
              this.playerFinished = true;
              this.computeProjectedTimesForRemaining();
            }
          } else {
            r.lap++;
            r.checkpointsPassedInLap = 1;
            r.lastCheckpoint = 0;
          }
        } else {
          // Shortcut detected — lap does NOT count!
          this.antiCutBlockedCount++;
        }
      }

      if (!r.finished) {
        // Continuous smooth progress anchored to completed laps + spline progress
        // Clamp s near start line if checkpoints weren't passed yet so cutting doesn't boost rank
        const validProgress =
          r.checkpointsPassedInLap < 4 && s > L * 0.5
            ? 0
            : s;
        r.totalProgressMeters = (r.lap - 1) * L + validProgress;
      }
      r.lastS = s;
    }

    // Rank racers cleanly
    const sorted = [...this.racers].sort((a, b) => {
      if (a.finished && b.finished) return (a.finishTimeSec ?? 0) - (b.finishTimeSec ?? 0);
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.totalProgressMeters - a.totalProgressMeters;
    });
    for (let idx = 0; idx < sorted.length; idx++) {
      sorted[idx].rank = idx + 1;
    }
  }

  private computeProjectedTimesForRemaining(): void {
    const targetTotal = this.totalLaps * this.track.totalLength;
    for (const r of this.racers) {
      if (r.finished) continue;
      const done = Math.max(100, r.totalProgressMeters);
      const avgSpeed = done / Math.max(1, this.raceClockSec);
      const remaining = Math.max(0, targetTotal - done);
      const projSec = this.raceClockSec + remaining / Math.max(18, avgSpeed);
      r.finishTimeSec = projSec;
      r.projectedFinishStr = formatRaceTime(projSec) + ' ≈';
    }
  }
}

export function formatRaceTime(sec: number): string {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  const ms = Math.floor((s - Math.floor(s)) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}
