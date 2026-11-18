import {build} from 'esbuild';
import {openBrowser} from './browser.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import sharp from 'sharp';
const code=`
import * as T from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const r=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});r.setSize(1024,1024);r.setClearColor(0,0);document.body.append(r.domElement);
window.bake=async(name)=>{
 const scene=new T.Scene(),tree=(await new GLTFLoader().loadAsync('/'+name+'/tree.gltf')).scene;scene.add(tree);
 const alpha=await new T.TextureLoader().loadAsync('/'+name+'/alpha.jpg');alpha.flipY=false;
 tree.traverse(o=>{if(!o.isMesh)return;const m=o.material;if(m.name.includes('leaves')){m.alphaTest=.38;m.alphaMap=alpha;m.side=T.DoubleSide;m.transparent=false;}m.metalness=0;});
 const bb=new T.Box3().setFromObject(tree),center=bb.getCenter(new T.Vector3()),size=bb.getSize(new T.Vector3()),extent=Math.max(...size.toArray())*1.035;
 const ambient=new T.HemisphereLight(0xfff0d4,0x62674d,1.8),sun=new T.DirectionalLight(0xffde99,2.1);sun.position.set(-7,9,2);scene.add(sun,ambient);
 const tiles=[];for(let axis=0;axis<2;axis++)for(let i=0;i<3;i++){
  const dim=axis?size.x:size.z,dist=extent*2,near=dist-dim*.505+(i*dim*1.01/3),far=near+dim*1.01/3+.003;
  const c=new T.OrthographicCamera(-extent/2,extent/2,extent/2,-extent/2,near,far);
  c.position.copy(center);if(axis)c.position.x+=dist;else c.position.z+=dist;c.lookAt(center);r.render(scene,c);tiles.push(r.domElement.toDataURL('image/png').split(',')[1]);
 }return {tiles,shape:{x:size.x/extent,y:size.y/extent,z:size.z/extent}};
};`;
const js=(await build({stdin:{contents:code,resolveDir:process.cwd()},write:false,bundle:true,format:'iife'})).outputFiles[0].contents;
const server=http.createServer(async(req,res)=>{try{if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<body><script src="/bake.js"></script>');}if(req.url==='/bake.js'){res.setHeader('Content-Type','text/javascript');return res.end(js);}
 const p=decodeURIComponent(req.url.slice(1));if(!/^island_tree_0[12]\/[a-zA-Z0-9_./-]+$/.test(p)||p.includes('..'))throw Error();
 res.end(await readFile(path.join('tools/staging',p)));}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await openBrowser();
try{const page=await browser.newPage();page.on('pageerror',console.error);await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.bake);
 const meta=[];for(const [i,name] of ['island_tree_02','island_tree_01'].entries()){const {tiles,shape}=await page.evaluate(n=>window.bake(n),name);
 const layers=tiles.map((tile,j)=>({input:Buffer.from(tile,'base64'),left:j%3*1024,top:Math.floor(j/3)*1024}));
 await sharp({create:{width:3072,height:2048,channels:4,background:'#00000000'}}).composite(layers).webp({quality:92,alphaQuality:100}).toFile('assets/surfaces/grove'+i+'.webp');
 meta.push(shape);console.log(name,shape);}
 await writeFile('assets/geometry/grove.json',JSON.stringify(meta));
}finally{await browser.close();server.close();}
