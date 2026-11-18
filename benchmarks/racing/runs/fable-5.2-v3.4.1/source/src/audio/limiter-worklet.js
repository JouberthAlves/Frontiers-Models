// Master limiter (AudioWorklet): one render quantum of look-ahead, linear gain ramps, hard
// ceiling at -1.2 dBFS as a last guarantee. It is the last node before the speakers, so it also
// meters the true output peak and, on request, hands the post-limiter PCM to the main thread
// (the verifier records it to verification/audio-volta.wav).

const CEILING = Math.pow(10, -1.2 / 20);

class MasterLimiter extends AudioWorkletProcessor {
  constructor() {
    super();
    this.delay = [new Float32Array(128), new Float32Array(128)];   // the block that is played next
    this.delayPeak = 0; this.gain = 1; this.release = 0.035;        // gain recovered per block
    this.peak = 0; this.minGain = 1; this.frames = 0; this.recording = false; this.chunk = null; this.fill = 0;
    this.port.onmessage = (e) => {
      if (e.data.rec !== undefined) { this.recording = !!e.data.rec; this.fill = 0; this.chunk = this.recording ? new Float32Array(8192) : null; if (!this.recording) this.port.postMessage({ recEnd: true }); }
      if (e.data.resetPeak) { this.peak = 0; this.minGain = 1; }
    };
  }

  process(inputs, outputs) {
    const inp = inputs[0], out = outputs[0]; const n = out[0].length;
    const l = inp[0] || null, r = inp[1] || l;
    // peak of the incoming block (it will be played in the next call)
    let pin = 0;
    if (l) for (let i = 0; i < n; i++) { const a = Math.abs(l[i]), b = Math.abs(r[i]); if (a > pin) pin = a; if (b > pin) pin = b; }
    const need = (p) => (p > CEILING ? CEILING / p : 1);
    const gD = need(this.delayPeak), gX = need(pin);
    const g0 = Math.min(this.gain, gD);                       // start of this block: already low enough (look-ahead of the previous call)
    let g1 = Math.min(gD, gX); if (g1 > g0) g1 = Math.min(g1, g0 + this.release);
    const dl = this.delay[0], dr = this.delay[1]; const ol = out[0], or = out[1] || out[0];
    let pk = this.peak;
    for (let i = 0; i < n; i++) {
      const g = g0 + (g1 - g0) * (i / n);
      let a = dl[i] * g, b = dr[i] * g;
      if (a > CEILING) a = CEILING; else if (a < -CEILING) a = -CEILING;
      if (b > CEILING) b = CEILING; else if (b < -CEILING) b = -CEILING;
      ol[i] = a; if (or !== ol) or[i] = b;
      const m = Math.max(Math.abs(a), Math.abs(b)); if (m > pk) pk = m;
    }
    this.peak = pk; this.gain = g1; if (g1 < this.minGain) this.minGain = g1;
    if (this.recording) {
      for (let i = 0; i < n; i++) { this.chunk[this.fill++] = ol[i]; this.chunk[this.fill++] = or[i]; }
      if (this.fill >= this.chunk.length) { this.port.postMessage({ pcm: this.chunk }, [this.chunk.buffer]); this.chunk = new Float32Array(8192); this.fill = 0; }
    }
    // keep the incoming block for the next call
    if (l) { dl.set(l); dr.set(r); } else { dl.fill(0); dr.fill(0); }
    this.delayPeak = pin;
    this.frames += n;
    if (this.frames >= 12000) { this.frames = 0; this.port.postMessage({ peak: this.peak, minGain: this.minGain }); }
    return true;
  }
}
registerProcessor('master-limiter', MasterLimiter);
