import {readFile} from 'node:fs/promises';
export async function inspectMedia(){
 const wav=await readFile('verification/audio-volta.wav');if(wav.toString('ascii',0,4)!=='RIFF'||wav.toString('ascii',36,40)!=='data')throw Error('WAV inválido');
 const rate=wav.readUInt32LE(24),channels=wav.readUInt16LE(22);let peak=0,ss=0;
 for(let i=44;i<wav.length;i+=2){const v=wav.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(v));ss+=v*v;}
 const b=await readFile('verification/volta.webm'),tracks=[],counts={},last={},first={};let scale=1e6;
 function vint(off,id=false){const a=b[off];if(!a)return null;let n=1,mask=128;while(!(a&mask)){n++;mask>>=1;}if(off+n>b.length)return null;
   let v=id?a:(a&(mask-1)),unknown=!id&&v===mask-1;for(let i=1;i<n;i++){v=v*256+b[off+i];unknown=unknown&&b[off+i]===255;}return {n,v,unknown};}
 function integer(start,end){let x=0;for(let i=start;i<end;i++)x=x*256+b[i];return x;}
 function walk(off,end,track=null,cluster=0,depth=0,openCluster=false){
   if(depth>12)return;
   while(off<end){const id=vint(off,true);if(!id)return off;if(openCluster&&[0x1f43b675,0x1c53bb6b,0x1549a966,0x1654ae6b].includes(id.v))return off;
    const size=vint(off+id.n);if(!size)return off;const a=off+id.n+size.n;let z=size.unknown?end:Math.min(end,a+size.v);if(z<a)return off;
    switch(id.v){
     case 0x18538067:case 0x1549a966:case 0x1654ae6b:case 0xe0:case 0xe1:case 0xa0:walk(a,z,track,cluster,depth+1);break;
     case 0x1f43b675:{const next=walk(a,z,null,0,depth+1,size.unknown);if(size.unknown)z=next;break;}
     case 0xae:{const t={};tracks.push(t);walk(a,z,t,0,depth+1);break;}
     case 0x2ad7b1:scale=integer(a,z);break;case 0xe7:cluster=integer(a,z);break;
     case 0xd7:if(track)track.number=integer(a,z);break;case 0x83:if(track)track.type=integer(a,z);break;case 0x86:if(track)track.codec=b.toString('ascii',a,z);break;
     case 0xb0:if(track)track.width=integer(a,z);break;case 0xba:if(track)track.height=integer(a,z);break;
     case 0xa3:case 0xa1:{const t=vint(a),time=cluster+b.readInt16BE(a+t.n);first[t.v]??=time;last[t.v]=Math.max(last[t.v]||0,time);counts[t.v]=(counts[t.v]||0)+1;break;}
    }
    if(z<=off)return off;off=z;
   }return off;
 }
 walk(0,b.length);
 return {wav:{sampleRate:rate,channels,seconds:(wav.length-44)/2/rate/channels,peakDB:20*Math.log10(peak),rmsDB:10*Math.log10(ss/((wav.length-44)/2))},webm:{tracks:tracks.map(t=>({...t,packets:counts[t.number]||0,seconds:((last[t.number]||0)-(first[t.number]||0))*scale/1e9})),bytes:b.length}};
}
