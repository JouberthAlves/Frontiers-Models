// Dev tool: decode compressed audio (ogg / mp3) with the browser's own decoder and write mono
// 16-bit WAV files (44.1 kHz) for the offline sample preparation (scripts/audio/build-samples.py).
//   node scripts/dev/audio-decode.mjs <in-dir inside the project> <out-dir>
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startServer } from '../serve.mjs';

const [inDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const root = path.resolve('.');
const srv = await startServer({});
const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
try {
  const page = await browser.newPage(); await page.goto(srv.url + '/scripts/dev/blank.html').catch(() => {});
  for (const f of fs.readdirSync(inDir).filter((n) => /\.(ogg|mp3|flac|wav)$/i.test(n))) {
    const rel = path.relative(root, path.join(inDir, f)).split(path.sep).join('/');
    const res = await page.evaluate(async (url) => {
      const buf = await (await fetch(url)).arrayBuffer();
      const tmp = new OfflineAudioContext(1, 44100, 44100); const a = await tmp.decodeAudioData(buf);
      const off = new OfflineAudioContext(1, Math.ceil(a.duration * 44100), 44100); const src = off.createBufferSource(); src.buffer = a; src.connect(off.destination); src.start();
      const r = await off.startRendering(); const d = r.getChannelData(0);
      const i16 = new Int16Array(d.length); let peak = 0; for (let i = 0; i < d.length; i++) { const v = Math.max(-1, Math.min(1, d[i])); if (Math.abs(v) > peak) peak = Math.abs(v); i16[i] = Math.round(v * 32767); }
      let bin = ''; const u8 = new Uint8Array(i16.buffer); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      return { b64: btoa(bin), n: d.length, peak, channels: a.numberOfChannels, rate: a.sampleRate, duration: a.duration };
    }, '/' + rel);
    const pcm = Buffer.from(res.b64, 'base64'); const hdr = Buffer.alloc(44);
    hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVEfmt ', 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
    hdr.writeUInt32LE(44100, 24); hdr.writeUInt32LE(88200, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
    const out = path.join(outDir, f.replace(/\.[a-z0-9]+$/i, '.wav')); fs.writeFileSync(out, Buffer.concat([hdr, pcm]));
    console.log(f, '->', path.basename(out), res.duration.toFixed(2) + ' s', res.channels + ' ch @' + res.rate, 'peak', res.peak.toFixed(3));
  }
} finally { await browser.close(); await srv.close(); }
