import sharp from 'sharp';
import {readdir,mkdir,readFile,writeFile,stat} from 'node:fs/promises';
export const names=['','s1-reta-orla.png','s2-grid-3-4.png','s3-praia-espuma.png','s4-falesia-mirante.png','s5-vila-rua.png','s6-bosque-luz.png','s7-ponte-ou-tunel.png','s8-disputa.png','s9-close-pista.png','s10-baixa-vila.png','s11-escala.png','s12-mapa.png'];
export const references={1:[1,2],2:[11],3:[2,4],4:[2],5:[5,6,7],6:[8,10],7:[14],8:[9,13]};
export function fps(ds){const clean=ds.filter(v=>v>0);const sorted=[...clean].sort((a,b)=>b-a),slow=sorted.slice(0,Math.max(1,Math.ceil(sorted.length*.01)));return {frames:clean.length,mean:clean.length/clean.reduce((a,b)=>a+b,0),onePercentLow:slow.length/slow.reduce((a,b)=>a+b,0),milliseconds:clean.map(n=>+(n*1000).toFixed(3))};}
export async function imageMetrics(bytes,sky,n){
 if(n===12)return {applicable:false,reason:'Mapa aéreo de inspeção',sky:null};
 const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true}),hist=new Uint32Array(4096);
 let sum=0,sq=0,pixels=info.width*info.height;
 for(let i=0;i<data.length;i+=3){const r=data[i],g=data[i+1],b=data[i+2],y=(.2126*r+.7152*g+.0722*b)/255;sum+=y;sq+=y*y;hist[((r>>4)<<8)|((g>>4)<<4)|(b>>4)]++;}
 const ordered=Array.from(hist,(count,idx)=>[idx,count]).filter(([,c])=>c).sort((a,b)=>b[1]-a[1]),mean=sum/pixels,sd=Math.sqrt(sq/pixels-mean*mean),largest=ordered[0][1]/pixels;
 const exemptions={3:'Enquadramento baixo da praia e das rochas',9:'Inspeção próxima do asfalto e da zebra',11:'Inspeção estática de escala'};
 const needSky=!(n in exemptions),errors=[];if(mean<.25||mean>.75)errors.push('luminância');if(sd<.12)errors.push('desvio');if(largest>.30)errors.push('cor dominante');if(needSky&&sky<.10)errors.push('céu');
 return {width:info.width,height:info.height,mean,standardDeviation:sd,sky,skyRequired:needSky,skyExemption:exemptions[n]||null,largestBucketFraction:largest,buckets:Object.fromEntries(ordered.map(([k,v])=>[k.toString(16).padStart(3,'0'),v])),errors};
}
const out='verification';
export async function compare(n){const images=await readdir('tools/references'),a=out+'/'+names[n];
 let panels=[{name:'COSTA DOURADA  /  S'+n,file:a},...(references[n]||[]).map(i=>({name:'REFERÊNCIA '+String(i).padStart(2,'0'),file:'tools/references/'+images.find(f=>f.startsWith(String(i).padStart(2,'0')+'-'))}))];
 if(n===10)panels.push({name:'MESMO PONTO  /  ALTA',file:out+'/'+names[5]});
 if(n===12){const {Circuit}=await import('../src/track.js'),course=new Circuit(JSON.parse(await readFile('track.json','utf8'))),xs=course.stations.map(p=>p.x),zs=course.stations.map(p=>p.z),minZ=Math.min(...zs),minX=Math.min(...xs),maxX=Math.max(...xs),scale=370/(Math.max(...zs)-minZ);
   const points=course.stations.map(p=>[(360+(p.x-(minX+maxX)/2)*scale).toFixed(2),(16+(p.z-minZ)*scale).toFixed(2)].join(',')).join(' ');
   panels.push({name:'TRAÇADO  /  SPLINE DE TRACK.JSON',input:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="720" height="405"><rect width="720" height="405" fill="#233332"/><polygon points="'+points+'" fill="none" stroke="#efd2a6" stroke-width="3"/></svg>')});}
 if(n===9||n===11)panels.push({name:n===9?'DETALHE DO REVESTIMENTO':'DETALHE DO CARRO E DA PORTA',file:a,crop:true});
 const w=720,h=405,bar=32,list=[];
 for(const [i,p] of panels.entries()){
   let input=sharp(p.input||p.file);if(p.crop)input=input.extract({left:440,top:330,width:960,height:540});
   list.push({input:await input.resize(w,h,{fit:'cover'}).png().toBuffer(),left:i*w,top:bar});
   list.push({input:Buffer.from('<svg width="'+w+'" height="'+bar+'" xmlns="http://www.w3.org/2000/svg"><text x="13" y="22" font-family="Arial" font-weight="bold" font-size="13" fill="#e7ddc9">'+p.name+'</text></svg>'),left:i*w,top:0});
 }
 await sharp({create:{width:w*panels.length,height:h+bar,channels:3,background:'#202b2b'}}).composite(list).png().toFile(out+'/compare/s'+n+'.png');
}
export async function sweep(page,track,low,fail){
 const dir=out+'/sweep/'+(low?'baixa':'alta');await mkdir(dir,{recursive:true});await page.setViewportSize({width:384,height:216});
 await page.evaluate(low=>bench.quality(low),low);
 const rows=[],tiles=[];for(let s=0;s<track.length;s+=25){
   const v=await page.evaluate(({s,low})=>{const shot=bench.sweep(s,low);return {shot,sky:bench.sky()};},{s,low}),data=Buffer.from(v.shot.split(',')[1],'base64');
   const name='m'+String(s).padStart(4,'0')+'.jpg';await writeFile(dir+'/'+name,data);
   const metrics=await imageMetrics(data,v.sky,0);const {buckets,...simple}=metrics;rows.push({s,file:name,...simple});
   if(metrics.errors.length)fail('Varredura '+(low?'Baixa':'Alta')+' '+s+' m — '+metrics.errors.join(', '));
   const i=tiles.length/2,x=i%10*144,y=Math.floor(i/10)*100;
   tiles.push({input:await sharp(data).resize(144,81).jpeg({quality:83}).toBuffer(),left:x,top:y});
   tiles.push({input:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="144" height="19"><text x="4" y="14" fill="#d7cfb9" font-family="Arial" font-size="11">'+s+' m</text></svg>'),left:x,top:y+81});
 }
 await sharp({create:{width:1440,height:Math.ceil(rows.length/10)*100,channels:3,background:'#182321'}}).composite(tiles).png().toFile(out+'/'+(low?'sweep-baixa-sheet':'sweep-sheet')+'.png');
 return rows;
}
export const json=(filename,value)=>writeFile(out+'/'+filename,JSON.stringify(value,null,2));
