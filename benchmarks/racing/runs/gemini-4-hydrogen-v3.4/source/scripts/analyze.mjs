import fs from 'node:fs';
import { PNG } from 'pngjs';

export function analyzeWavBuffer(buf) {
  // Parse standard 44-byte RIFF/WAVE 16-bit PCM header
  const riff = buf.toString('ascii', 0, 4);
  const wave = buf.toString('ascii', 8, 12);
  if (riff !== 'RIFF' || wave !== 'WAVE') {
    throw new Error(`Invalid WAV header: ${riff}/${wave}`);
  }
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bitsPerSample = buf.readUInt16LE(34);
  if (bitsPerSample !== 16) {
    throw new Error(`Expected 16-bit PCM WAV, got ${bitsPerSample}-bit`);
  }

  // Locate 'data' chunk
  let offset = 12;
  let dataSize = 0;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const sz = buf.readUInt32LE(offset + 4);
    if (id === 'data') {
      offset += 8;
      dataSize = Math.min(sz, buf.length - offset);
      break;
    }
    offset += 8 + sz;
  }

  let peak = 0;
  let sumSq = 0;
  const totalSamples = Math.floor(dataSize / 2);
  for (let i = 0; i < totalSamples; i++) {
    const s = Math.abs(buf.readInt16LE(offset + i * 2) / 32768);
    if (s > peak) peak = s;
    sumSq += s * s;
  }
  const rms = totalSamples > 0 ? Math.sqrt(sumSq / totalSamples) : 0;
  const peakDbfs = peak > 1e-7 ? 20 * Math.log10(peak) : -120;
  const rmsDbfs = rms > 1e-7 ? 20 * Math.log10(rms) : -120;
  const durationSec = sampleRate * channels > 0 ? totalSamples / (sampleRate * channels) : 0;

  return {
    sampleRate,
    channels,
    durationSec: Number(durationSec.toFixed(2)),
    peakAmplitude: Number(peak.toFixed(4)),
    peakDbfs: Number(peakDbfs.toFixed(2)),
    rmsDbfs: Number(rmsDbfs.toFixed(2)),
    withinLimiterCeiling: peakDbfs <= -1.0,
  };
}

export function analyzePngMetrics(pngPath, allowLowSky = false) {
  const png = PNG.sync.read(fs.readFileSync(pngPath));
  const { width, height, data } = png;
  const n = width * height;

  let lumSum = 0;
  let lumSqSum = 0;
  let skyPixels = 0;
  let clippedHigh = 0;
  let clippedLow = 0;
  const colorBins = new Uint32Array(4096); // 16 x 16 x 16 RGB quantized bins

  const skyCutRow = Math.floor(height * 0.58);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      lumSum += lum;
      lumSqSum += lum * lum;
      if (r >= 253 && g >= 253 && b >= 253) clippedHigh++;
      if (r <= 3 && g <= 3 && b <= 3) clippedLow++;

      // Sky detector in upper 58% of frame: bright blue or warm golden sky (not green tree leaves!)
      if (y < skyCutRow) {
        const isFoliage = g > r + 8 && g > b + 12;
        const isSkyColor = lum > 0.36 && !isFoliage && (b > 110 || (r > 155 && g > 115));
        if (isSkyColor) skyPixels++;
      }

      const br = r >> 4;
      const bg = g >> 4;
      const bb = b >> 4;
      colorBins[(br << 8) | (bg << 4) | bb]++;
    }
  }

  const meanLum = lumSum / n;
  const variance = Math.max(0, lumSqSum / n - meanLum * meanLum);
  const stdLum = Math.sqrt(variance);
  const skyFraction = skyPixels / n;

  let maxBin = 0;
  for (let i = 0; i < colorBins.length; i++) {
    if (colorBins[i] > maxBin) maxBin = colorBins[i];
  }
  const maxSingleColorShare = maxBin / n;

  const ok =
    meanLum >= 0.25 &&
    meanLum <= 0.75 &&
    stdLum >= 0.12 &&
    maxSingleColorShare <= 0.30 &&
    (allowLowSky || skyFraction >= 0.10);

  return {
    width,
    height,
    meanLuminance: Number(meanLum.toFixed(4)),
    stdLuminance: Number(stdLum.toFixed(4)),
    skyFraction: Number(skyFraction.toFixed(4)),
    maxSingleColorShare: Number(maxSingleColorShare.toFixed(4)),
    clippedWhitePct: Number(((clippedHigh / n) * 100).toFixed(2)),
    clippedBlackPct: Number(((clippedLow / n) * 100).toFixed(2)),
    ok,
  };
}

export function buildContactSheet(pngPaths, cols, thumbW, thumbH, outPath) {
  const rows = Math.ceil(pngPaths.length / cols);
  const sheet = new PNG({ width: cols * thumbW, height: rows * thumbH });
  sheet.data.fill(20); // dark charcoal border

  for (let i = 0; i < pngPaths.length; i++) {
    const src = PNG.sync.read(fs.readFileSync(pngPaths[i]));
    const gx = (i % cols) * thumbW;
    const gy = Math.floor(i / cols) * thumbH;

    for (let ty = 0; ty < thumbH; ty++) {
      const sy = Math.min(src.height - 1, Math.floor((ty / thumbH) * src.height));
      for (let tx = 0; tx < thumbW; tx++) {
        const sx = Math.min(src.width - 1, Math.floor((tx / thumbW) * src.width));
        const si = (sy * src.width + sx) * 4;
        const di = ((gy + ty) * sheet.width + (gx + tx)) * 4;
        sheet.data[di] = src.data[si];
        sheet.data[di + 1] = src.data[si + 1];
        sheet.data[di + 2] = src.data[si + 2];
        sheet.data[di + 3] = 255;
      }
    }
  }

  fs.writeFileSync(outPath, PNG.sync.write(sheet));
}
