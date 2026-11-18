# Development-time tool: turns the CC0 recordings fetched by fetch.mjs (.tmp/audio/wav/*.wav) into
# the game's samples (assets/audio/*.wav + manifest.json).
#   python scripts/audio/build-samples.py
#
# Engine loops. Every loop is a real recording:
#   - steady recordings are cut to a whole number of engine cycles and cross-faded at the seam;
#   - bands that exist only inside a recorded acceleration are cut from it and "pitch-flattened":
#     the window is resampled along the measured firing-frequency curve so that the pitch is
#     constant, then looped the same way.
# The manifest stores the firing frequency of each loop, so that the game can play it at
# playbackRate = (rpm / 30) / firingHz (four-cylinder, four-stroke: firing frequency = rpm / 30).
import json, os, sys, wave
import numpy as np
from scipy import signal

SRC = '.tmp/audio/wav/'
OUT = 'assets/audio/'
os.makedirs(OUT, exist_ok=True)
manifest = {'engines': {}, 'sounds': {}}
log = []

def read(key):
    w = wave.open(SRC + key + '.wav', 'rb'); sr = w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0, sr

def write(name, y, sr):
    y = np.clip(y, -1, 1); w = wave.open(OUT + name + '.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
    return {'file': name + '.wav', 'seconds': round(len(y) / sr, 3), 'rate': sr}

def rms(y): return float(np.sqrt(np.mean(y ** 2)) + 1e-12)
def norm(y, target_db=-20.0, peak_db=-1.5):
    y = y * (10 ** (target_db / 20) / rms(y)); p = np.abs(y).max(); lim = 10 ** (peak_db / 20)
    return y * (lim / p) if p > lim else y
def hp(y, sr, fc): b, a = signal.butter(2, fc / (sr / 2), 'high'); return signal.filtfilt(b, a, y)
def lp(y, sr, fc): b, a = signal.butter(2, fc / (sr / 2), 'low'); return signal.filtfilt(b, a, y)
def resample(y, sr, sr2): return signal.resample_poly(y, sr2, sr) if sr2 != sr else y

def firing(x, sr, lo, hi, harm=(1, 2, 3, 4)):
    """firing frequency of a short steady frame: harmonic comb on a zero-padded spectrum, refined by parabola"""
    n = len(x); sp = np.abs(np.fft.rfft(x * np.hanning(n), 8 * n)); df = sr / (8 * n)
    fs = np.arange(lo, hi, 0.25); e = np.array([sum(sp[int(round(f * h / df))] for h in harm) for f in fs]); k = int(np.argmax(e))
    if 0 < k < len(fs) - 1:
        a, b, c = e[k - 1], e[k], e[k + 1]; k = k + 0.5 * (a - c) / (a - 2 * b + c + 1e-12)
    return lo + k * 0.25

def loop(y, sr, fire_hz, seconds, xfade=0.05, cyl=4):
    """seamless loop: the seam is put where the signal best repeats itself (normalised correlation of the
    cross-fade window, searched over half an engine cycle around a whole number of cycles), then cross-faded"""
    cyc = cyl * sr / fire_hz; X = int(xfade * sr); span = int(cyc * 0.5)
    k = max(2, int(round(seconds * sr / cyc)))
    while k * cyc + span + 2 * X + 8 > len(y) and k > 2: k -= 1
    Nc = int(round(k * cyc)); best = None
    for a in np.linspace(X, max(X, len(y) - Nc - span - 2), 16).astype(int):
        u = y[a - X:a]; lo = a + Nc - span - X; hi = a + Nc + span
        if lo < 0 or hi > len(y): continue
        seg = y[lo:hi]; num = np.correlate(seg, u, 'valid'); en = np.sqrt(np.convolve(seg ** 2, np.ones(X), 'valid')) * np.linalg.norm(u) + 1e-12
        c = num / en; j = int(np.argmax(c))
        if best is None or c[j] > best[0]: best = (float(c[j]), a, Nc - span + j)
    c, a, N = best; out = y[a:a + N].copy(); t = np.linspace(0, np.pi / 2, X)
    out[N - X:] = y[a + N - X:a + N] * np.cos(t) ** 2 + y[a - X:a] * np.sin(t) ** 2
    return out, c

def flatten(x, sr, t0, t1, f_of_t, f_ref):
    """resamples x[t0:t1] along its firing-frequency curve so that the result has constant pitch f_ref"""
    n0, n1 = int(t0 * sr), int(t1 * sr); t = np.arange(n0, n1) / sr
    phase = np.cumsum(f_of_t(t)) / sr                     # firings elapsed
    k = np.arange(0, phase[-1] - phase[0], f_ref / sr) + phase[0]
    pos = np.interp(k, phase, np.arange(n0, n1).astype(np.float64))
    i = np.floor(pos).astype(int); fr = pos - i; i = np.clip(i, 0, len(x) - 2)
    return x[i] * (1 - fr) + x[i + 1] * fr

def rpm_curve(x, sr, t_a, rpm_a, t_b, rpm_b, tol=0.14):
    """firing frequency along a recorded acceleration: comb search around a straight-line guess, cubic fit"""
    ts, fs = [], []; win = int(0.09 * sr)
    for a in range(int(t_a * sr), int(t_b * sr) - win, int(0.03 * sr)):
        tc = (a + win / 2) / sr; guess = (rpm_a + (rpm_b - rpm_a) * (tc - t_a) / (t_b - t_a)) / 30
        f = firing(x[a:a + win], sr, guess * (1 - tol), guess * (1 + tol)); ts.append(tc); fs.append(f)
    ts, fs = np.array(ts), np.array(fs); p = np.polyfit(ts, fs, 3); res = fs - np.polyval(p, ts)
    keep = np.abs(res) < 2.5 * np.std(res) + 1e-9; p = np.polyfit(ts[keep], fs[keep], 3)
    return (lambda t: np.polyval(p, t)), float(np.std(fs[keep] - np.polyval(p, ts[keep])))

def engine_band(name, y, sr, fire_hz, seconds, gain_db=-20.0, xf=0.05):
    lo, c = loop(y, sr, fire_hz, seconds, xf); lo = norm(hp(np.tile(lo, 3), sr, 22)[len(lo):2 * len(lo)], gain_db)
    f_meas = firing(np.tile(lo, 4)[:int(0.6 * sr)] if len(lo) < 0.6 * sr else lo[:int(0.6 * sr)], sr, fire_hz * 0.93, fire_hz * 1.07)
    e = write(name, lo, sr); e.update({'firingHz': round(f_meas, 2), 'rpm': int(round(f_meas * 30)), 'seam': round(c, 3)})
    log.append('%-18s %5.2f s  firing %6.1f Hz = %5d rpm  seam corr %.3f' % (name, e['seconds'], f_meas, e['rpm'], c))
    return e

# ------------------------------------------------------------------------------------------ GT: sporty four, exhaust microphone
def build_gt():
    on, off = [], []
    idle, sr = read('gt_idle'); idle_b, _ = read('gt_idle_b'); mix = idle * 0.75 + idle_b[:len(idle)] * 1.6
    on.append(engine_band('gt_on_0', mix, sr, firing(mix[:int(0.8 * sr)], sr, 38, 50), 1.5))
    sw, _ = read('gt_sweep_b')                       # short acceleration, 1740 -> 3690 rpm then 3800 -> 6600 rpm
    f1, e1 = rpm_curve(sw, sr, 0.06, 1700, 0.92, 3700); f2, e2 = rpm_curve(sw, sr, 1.0, 3800, 1.95, 6250)
    log.append('gt sweep: fit residual %.2f Hz / %.2f Hz' % (e1, e2))
    for i, (curve, tc, half) in enumerate([(f1, 0.27, 0.2), (f1, 0.62, 0.28), (f2, 1.28, 0.27), (f2, 1.55, 0.3), (f2, 1.72, 0.22)]):
        fr = float(curve(np.array([tc]))[0]); y = flatten(sw, sr, tc - half, tc + half, curve, fr)
        on.append(engine_band('gt_on_%d' % (i + 1), y, sr, fr, 0.5, xf=0.03))
    hi, _ = read('gt_6500'); on.append(engine_band('gt_on_6', hi, sr, firing(hi[:int(0.8 * sr)], sr, 190, 225), 1.2, xf=0.04))
    # overrun layer: no-load recordings, darker
    st, _ = read('gt_2500'); dec, _ = read('gt_sweep_c')
    tail = dec[int(5.2 * sr):int(8.3 * sr)]
    off.append(engine_band('gt_off_0', lp(tail, sr, 2600), sr, firing(tail[:int(0.8 * sr)], sr, 38, 52), 1.5, -23))
    off.append(engine_band('gt_off_1', lp(st, sr, 3000), sr, firing(st[:int(0.8 * sr)], sr, 78, 92), 1.6, -23))
    hb, _ = read('gt_6500_b'); off.append(engine_band('gt_off_2', lp(hb, sr, 4200), sr, firing(hb[:int(0.8 * sr)], sr, 190, 225), 1.2, -23, xf=0.04))
    return {'on': on, 'off': off, 'cylinders': 4, 'source': 'Chippy569 (Freesound, CC0)'}

# ------------------------------------------------------------------------------------------ hatch: everyday four, outside / inside microphones
def build_hatch():
    on, off = [], []
    for i, (k, lo, hi, secs) in enumerate([('hatch_idle', 24, 32, 2.2), ('hatch_low', 44, 54, 1.6), ('hatch_med', 62, 72, 2.0), ('hatch_high', 80, 90, 1.5)]):
        y, sr = read(k); on.append(engine_band('hatch_on_%d' % i, y, sr, firing(y[:int(0.9 * sr)], sr, lo, hi), secs))
        z, _ = read(k + '_in'); off.append(engine_band('hatch_off_%d' % i, z, sr, firing(z[:int(0.9 * sr)], sr, lo, hi), secs, -23))
    # upper bands: the brighter microphone of the recorded acceleration (1050 -> 7100 rpm in 3.7 s)
    sw, sr = read('gt_sweep_a'); curve, err = rpm_curve(sw, sr, 0.5, 1130, 4.15, 7050, tol=0.1)
    log.append('hatch upper bands: fit residual %.2f Hz' % err)
    for i, (tc, half) in enumerate([(1.85, 0.3), (2.45, 0.32), (3.1, 0.32), (3.72, 0.3)]):
        fr = float(curve(np.array([tc]))[0]); y = hp(flatten(sw, sr, tc - half, tc + half, curve, fr), sr, 70)
        on.append(engine_band('hatch_on_%d' % (i + 4), y, sr, fr, 0.55, xf=0.03))
    return {'on': on, 'off': off, 'cylinders': 4, 'source': 'GiocoSound, Chippy569 (Freesound, CC0)'}

# ------------------------------------------------------------------------------------------ everything else
def steadiest(x, sr, seconds, loud=True, start=0.0, end=None):
    """window of the given length with the highest (or lowest) level and the flattest envelope"""
    n = int(seconds * sr); hop = int(0.25 * sr); a0 = int(start * sr); a1 = (len(x) if end is None else int(end * sr)) - n; best = None
    for a in range(a0, max(a0 + 1, a1), hop):
        seg = x[a:a + n]; env = np.array([rms(seg[i:i + hop]) for i in range(0, n - hop, hop)])
        score = (np.mean(env) if loud else -np.mean(env)) / (1e-9 + np.mean(env)) * 0 + (np.mean(env) * (1 if loud else -1)) - 2.0 * np.std(env)
        if best is None or score > best[0]: best = (score, a)
    return x[best[1]:best[1] + n], best[1] / sr

def plain_loop(y, sr, xfade):
    X = int(xfade * sr); N = len(y) - X; out = y[X:X + N].copy(); t = np.linspace(0, np.pi / 2, X)
    out[N - X:] = y[N:N + X] * np.cos(t) ** 2 + y[:X] * np.sin(t) ** 2
    return out

def sound(name, y, sr, db, sr_out=32000, **extra):
    e = write(name, norm(resample(y, sr, sr_out), db), sr_out); e.update(extra); manifest['sounds'][name] = e
    log.append('%-18s %5.2f s' % (name, e['seconds'])); return e

def build_rest():
    x, sr = read('squeal_b'); seg, at = steadiest(hp(x, sr, 300), sr, 1.5); sound('squeal', plain_loop(seg, sr, 0.2), sr, -18, loop=True)
    x, sr = read('skid'); seg, at = steadiest(hp(x, sr, 120), sr, 1.8); sound('scrub', plain_loop(seg, sr, 0.25), sr, -20, loop=True)
    x, sr = read('road'); seg, at = steadiest(hp(x, sr, 90), sr, 4.5); road = plain_loop(seg, sr, 0.5); sound('roll_asphalt', road, sr, -22, loop=True)
    # kerb: the same road noise, chopped by the stones of the kerb (about 0.45 m apart)
    t = np.arange(len(road)) / sr; sound('roll_kerb', lp(road, sr, 900) * (0.25 + 0.75 * (np.sin(2 * np.pi * 21 * t) > 0.2)), sr, -19, loop=True)
    x, sr = read('gravel'); seg, at = steadiest(hp(x, sr, 120), sr, 4.5); gr = plain_loop(seg, sr, 0.5); sound('roll_gravel', gr, sr, -20, loop=True)
    sound('roll_grass', lp(gr, sr, 1500), sr, -22, loop=True)
    x, sr = read('wind'); sound('wind', plain_loop(hp(x, sr, 60)[:int(11 * sr)], sr, 1.0), sr, -22, loop=True)
    for k, n, secs in [('crash_a', 'crash_0', 0.9), ('crash_b', 'crash_1', 0.3), ('crash_c', 'crash_2', 0.7)]:
        x, sr = read(k); y = x[:int(secs * sr)].copy(); f = int(0.04 * sr); y[-f:] *= np.linspace(1, 0, f); sound(n, y, sr, -14)
    x, sr = read('scrape'); seg, at = steadiest(hp(x, sr, 200), sr, 1.8, start=2.0); sound('scrape', plain_loop(seg, sr, 0.25), sr, -20, loop=True)
    # gear change: the sharpest short transient of the recording
    x, sr = read('shift'); y = hp(x, sr, 150); hop = int(0.01 * sr); env = np.array([rms(y[i:i + hop]) for i in range(0, len(y) - hop, hop)])
    k = int(np.argmax(env[5:-40] / (np.convolve(env, np.ones(30) / 30, 'same')[5:-40] + 1e-4))) + 5; a = max(0, k * hop - int(0.02 * sr)); seg = y[a:a + int(0.3 * sr)].copy(); f = int(0.08 * sr); seg[-f:] *= np.linspace(1, 0, f)
    sound('shift', seg, sr, -18)
    # ambience
    x, sr = read('sea'); sound('amb_sea', plain_loop(x[:int(22 * sr)], sr, 1.5), sr, -22, loop=True)
    x, sr = read('gulls'); seg, at = steadiest(hp(x, sr, 400), sr, 9.0); sound('amb_gulls', plain_loop(seg, sr, 0.8), sr, -24, loop=True)
    x, sr = read('village'); seg, at = steadiest(hp(x, sr, 150), sr, 18.0, start=20, end=300); sound('amb_village', plain_loop(seg, sr, 1.5), sr, -24, loop=True)
    x, sr = read('bells'); y = hp(x, sr, 150); f = int(0.5 * sr); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); sound('amb_bells', y, sr, -22)
    x, sr = read('birds'); sound('amb_birds', plain_loop(hp(x, sr, 500)[:int(21 * sr)], sr, 1.2), sr, -24, loop=True)
    x, sr = read('cicadas'); seg, at = steadiest(hp(x, sr, 800), sr, 12.0); sound('amb_cicadas', plain_loop(seg, sr, 1.0), sr, -26, loop=True)

manifest['engines']['gt'] = build_gt()
manifest['engines']['hatch'] = build_hatch()
build_rest()
json.dump(manifest, open(OUT + 'manifest.json', 'w'), indent=1)
print('\n'.join(log))
size = sum(os.path.getsize(OUT + f) for f in os.listdir(OUT)); print('assets/audio: %d files, %.1f MB' % (len(os.listdir(OUT)), size / 1e6))
