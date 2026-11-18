// Image statistics and contact sheets for the verifier, in plain Node (no native image library).
import { decodePNG, encodePNG } from './png.mjs';

/**
 * Photographic sanity metrics of section 13.1 (test 7), measured on the 8-bit picture as it is saved:
 *   mean / std   Rec.709 luma of the display-encoded values, 0..1
 *   bucket       share of the most frequent quantised colour (4 bits per channel: floor(R/16), floor(G/16), floor(B/16))
 * @param img {width, height, data: RGBA}
 */
export function photoMetrics(img) {
  const d = img.data, n = img.width * img.height; let sum = 0, sum2 = 0; const hist = new Uint32Array(4096);
  for (let i = 0; i < n; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
    const y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; sum += y; sum2 += y * y;
    hist[((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)]++;
  }
  const mean = sum / n, std = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
  let best = 0; for (let k = 1; k < 4096; k++) if (hist[k] > hist[best]) best = k;
  const top = [...hist.keys()].sort((a, b) => hist[b] - hist[a]).slice(0, 3).map((k) => ({ bucket: [k >> 8, (k >> 4) & 15, k & 15], share: +(hist[k] / n).toFixed(4) }));
  return { mean: +mean.toFixed(4), std: +std.toFixed(4), bucketShare: +(hist[best] / n).toFixed(4), bucket: [best >> 8, (best >> 4) & 15, best & 15], topBuckets: top };
}

export const LIMITS = { sky: 0.10, meanMin: 0.25, meanMax: 0.75, std: 0.12, bucket: 0.30 };

/** applies the limits; `exempt` lists the metrics that do not apply to this picture (with the reason kept by the caller) */
export function judge(m, sky, exempt = {}) {
  const fails = [];
  if (!exempt.sky && sky !== null && sky < LIMITS.sky) fails.push(`sky ${(sky * 100).toFixed(1)} % < 10 %`);
  if (!exempt.photo) {
    if (m.mean < LIMITS.meanMin || m.mean > LIMITS.meanMax) fails.push(`mean luminance ${m.mean.toFixed(3)} outside 0.25..0.75`);
    if (m.std < LIMITS.std) fails.push(`luminance std ${m.std.toFixed(3)} < 0.12`);
    if (m.bucketShare > LIMITS.bucket) fails.push(`one quantised colour covers ${(m.bucketShare * 100).toFixed(1)} % > 30 %`);
  }
  return fails;
}

/** box-filter resize of an RGBA image to RGBA */
export function resize(img, w, h) {
  const out = new Uint8Array(w * h * 4), src = img.data, W = img.width, H = img.height;
  for (let y = 0; y < h; y++) {
    const y0 = Math.floor(y * H / h), y1 = Math.max(y0 + 1, Math.floor((y + 1) * H / h));
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * W / w), x1 = Math.max(x0 + 1, Math.floor((x + 1) * W / w));
      let r = 0, g = 0, b = 0, c = 0;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) { const o = (yy * W + xx) * 4; r += src[o]; g += src[o + 1]; b += src[o + 2]; c++; }
      const o = (y * w + x) * 4; out[o] = r / c; out[o + 1] = g / c; out[o + 2] = b / c; out[o + 3] = 255;
    }
  }
  return { width: w, height: h, data: out };
}

// 5 x 7 bitmap font for the labels of the contact sheets (digits, a few letters and signs)
const GLYPHS = {
  '0': '01110,10001,10011,10101,11001,10001,01110', '1': '00100,01100,00100,00100,00100,00100,01110', '2': '01110,10001,00001,00010,00100,01000,11111',
  '3': '11110,00001,00001,01110,00001,00001,11110', '4': '00010,00110,01010,10010,11111,00010,00010', '5': '11111,10000,11110,00001,00001,10001,01110',
  '6': '00110,01000,10000,11110,10001,10001,01110', '7': '11111,00001,00010,00100,01000,01000,01000', '8': '01110,10001,10001,01110,10001,10001,01110',
  '9': '01110,10001,10001,01111,00001,00010,01100', 's': '00000,00000,01111,10000,01110,00001,11110', '=': '00000,00000,11111,00000,11111,00000,00000',
  'Z': '11111,00001,00010,00100,01000,10000,11111', '%': '11000,11001,00010,00100,01000,10011,00011', '.': '00000,00000,00000,00000,00000,01100,01100',
  ' ': '00000,00000,00000,00000,00000,00000,00000', 'c': '00000,00000,01110,10000,10000,10001,01110', 'e': '00000,00000,01110,10001,11111,10000,01110',
  'u': '00000,00000,10001,10001,10001,10011,01101', 'm': '00000,00000,11010,10101,10101,10001,10001', 'd': '00001,00001,01101,10011,10001,10001,01111',
  'x': '00000,00000,10001,01010,00100,01010,10001', '-': '00000,00000,00000,11111,00000,00000,00000', ':': '00000,01100,01100,00000,01100,01100,00000',
  'F': '11111,10000,10000,11110,10000,10000,10000', 'A': '01110,10001,10001,11111,10001,10001,10001', 'L': '10000,10000,10000,10000,10000,10000,11111',
  'H': '10001,10001,10001,11111,10001,10001,10001', 'B': '11110,10001,10001,11110,10001,10001,11110', 'I': '01110,00100,00100,00100,00100,00100,01110',
};
export function drawText(img, x, y, text, rgb = [255, 255, 255], scale = 1) {
  for (const ch of text) {
    const g = (GLYPHS[ch] || GLYPHS[' ']).split(',');
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === '1') {
      for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
        const px = x + c * scale + sx, py = y + r * scale + sy; if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;
        const o = (py * img.width + px) * 4; img.data[o] = rgb[0]; img.data[o + 1] = rgb[1]; img.data[o + 2] = rgb[2]; img.data[o + 3] = 255;
      }
    }
    x += 6 * scale;
  }
}
export function fillRect(img, x, y, w, h, rgb) {
  for (let yy = Math.max(0, y); yy < Math.min(img.height, y + h); yy++) for (let xx = Math.max(0, x); xx < Math.min(img.width, x + w); xx++) { const o = (yy * img.width + xx) * 4; img.data[o] = rgb[0]; img.data[o + 1] = rgb[1]; img.data[o + 2] = rgb[2]; img.data[o + 3] = 255; }
}
export function blit(dst, src, x, y) {
  for (let yy = 0; yy < src.height; yy++) { const o = ((y + yy) * dst.width + x) * 4; dst.data.set(src.data.subarray(yy * src.width * 4, (yy + 1) * src.width * 4), o); }
}

/**
 * Contact sheet of labelled thumbnails.
 * @param tiles [{img: RGBA image already at tile size, label, bad?}]
 */
export function contactSheet(tiles, cols, tw, th) {
  const rows = Math.ceil(tiles.length / cols); const sheet = { width: cols * tw, height: rows * th, data: new Uint8Array(cols * tw * rows * th * 4) };
  for (let i = 3; i < sheet.data.length; i += 4) sheet.data[i] = 255;
  tiles.forEach((t, i) => {
    const x = (i % cols) * tw, y = Math.floor(i / cols) * th; blit(sheet, t.img, x, y);
    fillRect(sheet, x, y, Math.min(tw, t.label.length * 6 + 6), 11, t.bad ? [170, 0, 0] : [0, 0, 0]); drawText(sheet, x + 3, y + 2, t.label);
  });
  return encodePNG(sheet.width, sheet.height, sheet.data, 4);
}

export { decodePNG, encodePNG };
