class MasterPCM extends AudioWorkletProcessor {
 constructor(){super();this.active=false;this.block=new Int16Array(8192);this.index=0;this.peak=0;
   this.port.onmessage=e=>{if(e.data==='start'){this.active=true;this.index=0;this.peak=0;}
     if(e.data==='stop'){this.flush();this.active=false;this.port.postMessage({end:true,peak:this.peak});}};
 }
 flush(){if(this.index){const pcm=this.block.slice(0,this.index);this.port.postMessage({pcm},[pcm.buffer]);this.index=0;}}
 process(inputs){const ch=inputs[0];if(this.active&&ch.length){const l=ch[0],r=ch[1]||l;
   for(let i=0;i<l.length;i++){this.peak=Math.max(this.peak,Math.abs(l[i]),Math.abs(r[i]));this.block[this.index++]=Math.round(Math.max(-1,Math.min(1,l[i]))*32767);this.block[this.index++]=Math.round(Math.max(-1,Math.min(1,r[i]))*32767);if(this.index===this.block.length)this.flush();}}
   return true;
 }
}registerProcessor('master-pcm',MasterPCM);
