import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const contentType={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.webp':'image/webp','.hdr':'application/octet-stream','.wav':'audio/wav',
};

export async function startStatic(port=0) {
  await stat(resolve(root,'index.html'));
  const server=createServer(async (req,res)=>{
    try {
      if(req.method!=='GET'&&req.method!=='HEAD'){
        res.writeHead(405,{Allow:'GET, HEAD'}).end();
        return;
      }
      const path=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
      const file=resolve(root,'.'+(path==='/'?'/index.html':path));
      if(!file.startsWith(root+sep)){
        res.writeHead(403).end();
        return;
      }
      const info=await stat(file);
      if(!info.isFile()){
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200,{'Content-Type':contentType[extname(file)]??'application/octet-stream','Content-Length':info.size});
      if(req.method==='HEAD') res.end();
      else createReadStream(file).pipe(res);
    } catch(error) {
      res.writeHead(error?.code==='ENOENT'?404:400).end();
    }
  });
  await new Promise((done,fail)=>server.once('error',fail).listen(port,'127.0.0.1',done));
  return {server,url:`http://127.0.0.1:${server.address().port}/`};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const {url}=await startStatic(Number(process.argv[2]??4173));
  console.log('Corsa di Vetra is available at '+url);
}
