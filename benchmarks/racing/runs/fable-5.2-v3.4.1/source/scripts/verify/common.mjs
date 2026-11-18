// Shared plumbing of the verifier: output folders, logging, test bookkeeping, binary transfers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const OUT = path.join(ROOT, 'verification');
export const LOGS = path.join(OUT, 'logs');

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(1).padStart(4, '0')}`;
export const out = (...p) => path.join(OUT, ...p);
export function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); return d; }
const pauseSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
/**
 * Writes a file, trying again when the system refuses for a moment. On Windows a file that was just written is
 * often held for a few hundred milliseconds by something else (virus scanner, indexer, thumbnail cache, a sync
 * client) and opening it again for writing fails with EBUSY / EPERM / UNKNOWN; a second run of the verifier over
 * the files of the first one would then fail for no reason of its own.
 */
export function writeFile(file, data) {
  let err = null;
  for (let k = 0; k < 10; k++) {
    try { fs.writeFileSync(file, data); return; } catch (e) {
      err = e; if (!/^(UNKNOWN|EBUSY|EPERM|EACCES|EINVAL|EMFILE)$/.test(String(e.code))) throw e;
      pauseSync(150 * (k + 1));
    }
  }
  throw err;
}
export function removeFile(file) {
  for (let k = 0; k < 10; k++) { try { fs.unlinkSync(file); return; } catch (e) { if (e.code === 'ENOENT') return; if (k === 9) throw e; pauseSync(150 * (k + 1)); } }
}
export function writeJson(file, data) { ensureDir(path.dirname(file)); writeFile(file, JSON.stringify(data, null, 1)); }

/** collects the outcome of every test; nothing stops at the first failure */
export class Report {
  constructor() { this.tests = []; this.lines = []; this.t0 = Date.now(); ensureDir(LOGS); }
  log(...a) { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); const line = `[${((Date.now() - this.t0) / 1000).toFixed(1).padStart(6)}s] ${s}`; this.lines.push(line); console.log(line); }
  /** @param fn async (check) => details; check(cond, message) records a failure when cond is false */
  async test(id, title, fn) {
    const t = { id, title, pass: true, failures: [], details: null, seconds: 0 }; const t0 = Date.now();
    const check = (cond, msg) => { if (!cond) { t.pass = false; t.failures.push(msg); this.log(`   FAIL ${id}: ${msg}`); } return !!cond; };
    this.log(`>> ${id} ${title}`);
    try { t.details = await fn(check); } catch (e) { t.pass = false; t.failures.push('exception: ' + (e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e))); this.log(`   ERROR ${id}: ${e && e.message ? e.message : e}`); }
    t.seconds = +((Date.now() - t0) / 1000).toFixed(1); this.tests.push(t);
    this.log(`<< ${id} ${t.pass ? 'PASS' : 'FAIL'} (${t.seconds} s)`);
    return t;
  }
  get(id) { return this.tests.find((t) => t.id === id); }
  flush() { writeFile(path.join(LOGS, 'verify.log'), this.lines.join('\n') + '\n'); }
}

/** console problems of a page: errors, page errors, failed or external requests, WebGL / shader warnings */
export function consoleProblems(logs, externals = []) {
  const bad = logs.filter((l) => l.type === 'error' || l.type === 'pageerror' || l.type === 'requestfailed' || (l.type === 'warning' && /WebGL|THREE|shader|GL_|deprecat/i.test(l.text) && !/GPU stall due to ReadPixels/i.test(l.text)));
  return [...new Set(bad.map((l) => `[${l.type}] ${l.text.slice(0, 300)}`)), ...externals.map((u) => `[external request] ${u}`)];
}
export function saveConsole(name, logs) { writeFile(path.join(LOGS, `console-${name}.log`), logs.map((l) => `[${l.type}] ${l.text}`).join('\n') + '\n'); }

/** pulls a binary result that the page keeps (api._rec.wav through audioChunk, api._bin through binChunk) */
export async function pullBinary(page, fn, bytes) {
  const parts = []; const STEP = 3 * 1024 * 1024;
  for (let off = 0; off < bytes; off += STEP) parts.push(Buffer.from(await page.evaluate(({ fn, off, STEP }) => window.__api[fn](off, STEP), { fn, off, STEP }), 'base64'));
  return Buffer.concat(parts);
}

export const waitState = (page, s, timeout = 60000) => page.waitForFunction((st) => window.__api && window.__api.game.state === st, s, { timeout });
export const flow = (page) => page.evaluate(() => window.__api.flow());
export const state = (page) => page.evaluate(() => window.__api.state());
