import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.hdr':'application/octet-stream','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav' };
export async function serve(port = 0) {
  const server = http.createServer(async (req,res) => {
    const url = new URL(req.url, 'http://localhost');
    const p = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    if (!/^\/(index\.html|style\.css|track\.json|favicon\.ico|build\/[\w./-]+|assets\/[\w./-]+)$/.test(p) || p.includes('..')) { res.writeHead(404).end(); return; }
    const file = path.join(root, p);
    try {
      const info = await stat(file);
      if (!info.isFile()) throw Error();
      res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-cache'});
      createReadStream(file).pipe(res);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve,reject) => server.once('error',reject).listen(port,'127.0.0.1',resolve));
  return { server, url:'http://127.0.0.1:' + server.address().port };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const {url} = await serve(Number(process.env.PORT || 4173));
  console.log(url);
}
