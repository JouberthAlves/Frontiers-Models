# Dev tool: pitch track / level of WAV files (mono 16-bit): fundamental by autocorrelation in
# 0.3 s frames, to check how steady an engine recording is and at which firing frequency it runs.
#   python scripts/dev/audio_info.py file.wav [...]
import sys, wave
import numpy as np

def read(path):
    w = wave.open(path, 'rb'); n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels()
    d = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768.0
    if ch > 1: d = d.reshape(-1, ch).mean(axis=1)
    return d, sr

def pitch(x, sr, fmin=18.0, fmax=260.0):
    x = x - x.mean(); n = len(x)
    f = np.fft.rfft(x * np.hanning(n), 2 * n); ac = np.fft.irfft(f * np.conj(f))[:n]; ac /= ac[0] + 1e-12
    lo, hi = int(sr / fmax), min(n - 1, int(sr / fmin))
    k = lo + int(np.argmax(ac[lo:hi])); return sr / k, ac[k]

for path in sys.argv[1:]:
    x, sr = read(path); fr = int(0.3 * sr); rows = []
    for a in range(0, len(x) - fr, fr // 2):
        f0, c = pitch(x[a:a + fr], sr); rows.append((f0, c))
    f = np.array([r[0] for r in rows]); c = np.array([r[1] for r in rows])
    spec = np.abs(np.fft.rfft(x * np.hanning(len(x)))); freqs = np.fft.rfftfreq(len(x), 1 / sr)
    cent = (spec * freqs).sum() / spec.sum(); top = freqs[np.argsort(spec)[-6:]][::-1]
    print('%s: %.2f s, rms %.3f, peak %.3f | f0 median %.1f Hz (min %.1f max %.1f, corr %.2f) | centroid %.0f Hz | strongest %s' % (
        path.split('/')[-1], len(x) / sr, np.sqrt((x ** 2).mean()), np.abs(x).max(), np.median(f), f.min(), f.max(), np.median(c), cent, ' '.join('%.0f' % t for t in top)))
