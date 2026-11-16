import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.hdr': 'application/octet-stream',
  '.bin': 'application/octet-stream',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
};

export function startServer(rootDir = process.cwd(), port = 4173) {
  const server = http.createServer((req, res) => {
    const rawUrl = (req.url || '/').split('?')[0];
    let relPath = decodeURIComponent(rawUrl);
    if (relPath === '/') relPath = '/index.html';
    const filePath = path.resolve(rootDir, '.' + relPath);
    if (!filePath.startsWith(path.resolve(rootDir))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

if (process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const port = Number(process.env.PORT || 4173);
  const { url } = await startServer(process.cwd(), port);
  console.log(`Static server listening at ${url}`);
}
