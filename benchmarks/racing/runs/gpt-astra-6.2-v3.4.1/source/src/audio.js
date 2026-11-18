import {clamp,mix} from './track.js';
const tags=['ext-idle','ext-low','ext-mid','ext-high','int-idle','int-low','int-mid','int-high','tyre','gravel','impact','surf','town','forest'];
export async function audioFiles(progress=()=>{}){const raw={},n=tags.length;let done=0;
 await Promise.all(tags.map(async name=>{const res=await fetch('./assets/audio/'+name+'.mp3');if(!res.ok)throw Error('Áudio '+name);raw[name]=await res.arrayBuffer();progress(++done/n);}));return raw;}
function polished(ctx,b,name){
 const engine=name.startsWith('ext-')||name.startsWith('int-'),ambient=['surf','forest','town'].includes(name),sr=b.sampleRate;
 const head=Math.min(Math.floor(b.length*.025),Math.floor(sr*(ambient?1.2:.12))),n=Math.min(b.length-head,Math.floor(sr*(engine?4:ambient?23:name==='impact'?1.15:5.5)));
 const overlap=Math.min(Math.floor(n*.095),Math.round(sr*(ambient?.38:.055))),len=n-overlap,out=ctx.createBuffer(1,len,sr),x=out.getChannelData(0),source=new Float32Array(n);
 for(let ch=0;ch<b.numberOfChannels;ch++){const a=b.getChannelData(ch);for(let i=0;i<n;i++)source[i]+=a[head+i]/b.numberOfChannels;}
 let ss=0,pk=0;for(let i=0;i<len;i++){
   x[i]=i<overlap?mix(source[len+i],source[i],i/overlap):source[i];ss+=x[i]*x[i];pk=Math.max(pk,Math.abs(x[i]));}
 const gain=Math.min((engine?.245:ambient?.15:.18)/Math.max(.003,Math.sqrt(ss/len)),.95/Math.max(.01,pk));
 for(let i=0;i<len;i++)x[i]*=gain;return out;
}
export class Sound {
 constructor(raw){this.raw=raw;this.ctx=null;this.buffers={};this.nodes=[];this.transients=new Set();this.masterVolume=.78;this.effectsVolume=.87;this.musicVolume=.3;this.muted=false;this.maxVoices=0;this.activeAI=0;this.maxAI=0;this.logIndex=0;}
 async unlock(){
   if(this.ready){await this.ctx.resume();return this.ready;}
   this.ctx=new AudioContext({sampleRate:48000,latencyHint:'interactive'});
   this.ready=this.ctx.resume().then(()=>this.initialize());return this.ready;
 }
 async initialize(){const c=this.ctx;this.bus={};
   const mixBus=c.createGain(),lim=c.createDynamicsCompressor(),ceiling=c.createWaveShaper(),master=c.createGain();
   lim.threshold.value=-8;lim.knee.value=3;lim.ratio.value=18;lim.attack.value=.003;lim.release.value=.10;
   const curve=new Float32Array(4097);for(let i=0;i<curve.length;i++){const x=i/2048-1;curve[i]=.867*Math.tanh(1.35*x);}ceiling.curve=curve;
   for(const name of ['player','ai','effects','ambient','ui','music']){const bus=c.createGain();this.bus[name]=bus;bus.connect(mixBus);}
   this.master=master;mixBus.connect(master).connect(lim).connect(ceiling);this.post=ceiling;ceiling.connect(c.destination);this.media=c.createMediaStreamDestination();ceiling.connect(this.media);
   await c.audioWorklet.addModule('./assets/audio/pcm-worklet.js');this.tap=new AudioWorkletNode(c,'master-pcm',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]});
   const silent=c.createGain();silent.gain.value=0;ceiling.connect(this.tap).connect(silent).connect(c.destination);
   this.tap.port.onmessage=e=>{if(e.data.pcm)this.pcm?.push(e.data.pcm);if(e.data.end)this.finishPCM?.(e.data.peak);};
   await Promise.all(tags.map(async s=>{this.buffers[s]=polished(c,await c.decodeAudioData(this.raw[s].slice(0)),s);}));
   const wind=c.createBuffer(1,96000,c.sampleRate),a=wind.getChannelData(0);let last=0,seed=19321;
   for(let i=0;i<a.length;i++){seed=(1664525*seed+1013904223)>>>0;last=(last+.11*(seed/2147483648-1))*.94;a[i]=last*.97;}
   this.buffers.wind=wind;this.setVolumes();this.prepared=true;
 }
 setVolumes(){if(!this.master)return;const t=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.muted?0:this.masterVolume,t,.025);
   this.bus.effects.gain.setTargetAtTime(this.effectsVolume,t,.05);this.bus.music.gain.setTargetAtTime(this.musicVolume,t,.05);}
 loop(key,bus,spatial=false,type='lowpass'){const c=this.ctx,src=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter();
  src.buffer=this.buffers[key];src.loop=true;gain.gain.value=0;filter.type=type;filter.frequency.value=15000;filter.Q.value=.52;
  src.connect(filter).connect(gain);let pan;if(spatial){pan=c.createPanner();pan.panningModel='equalpower';pan.distanceModel='inverse';pan.refDistance=7;pan.maxDistance=95;pan.rolloffFactor=1.0;gain.connect(pan).connect(this.bus[bus]);}else gain.connect(this.bus[bus]);
  src.start();const v={src,gain,filter,pan,key};this.nodes.push(v);return v;
 }
 start(style=0){
  if(!this.prepared)return;this.stop();this.style=style;this.logIndex=0;this.maxVoices=0;this.maxAI=0;this.lastStage='';this.lastBell=-40;
  const a=style?'int-':'ext-',b=style?'ext-':'int-';this.layers=['idle','low','mid','high'].map(k=>[this.loop(a+k,'player'),this.loop(b+k,'player')]);
  this.ai=Array.from({length:5},(_,i)=>this.loop(i%2?'int-mid':'ext-mid','ai',true));
  this.roll=this.loop('gravel','effects');this.skid=this.loop('tyre','effects');this.scrape=this.loop('impact','effects');this.air=this.loop('wind','ambient');
  this.zones=[this.loop('surf','ambient'),this.loop('wind','ambient'),this.loop('town','ambient'),this.loop('forest','ambient')];
  this.initialVoices=this.nodes.length;
 }
 stop(){for(const n of this.nodes){n.src.stop();n.src.disconnect();n.filter.disconnect();n.gain.disconnect();n.pan?.disconnect();}for(const src of this.transients){src.stop();src.disconnect();}this.transients.clear();this.nodes=[];this.activeAI=0;}
 tone(f,duration=.10,volume=.10,bus='ui'){if(!this.prepared)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g).connect(this.bus[bus]);this.transients.add(o);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();this.transients.delete(o);};}
 hit(force){const c=this.ctx,g=c.createGain(),s=c.createBufferSource();s.buffer=this.buffers.impact;s.playbackRate.value=.77+Math.min(force,9)*.045;g.gain.value=clamp(.09+force*.045,.1,.62);s.connect(g).connect(this.bus.effects);s.start(c.currentTime,.025,.47);this.transients.add(s);s.onended=()=>{s.disconnect();g.disconnect();this.transients.delete(s);};}
 update(race){
  if(!this.prepared||!this.nodes.length)return;const c=race.cars[0],t=this.ctx.currentTime,track=race.track,active=!['paused','results'].includes(race.phase);
  for(const name of ['player','ai','ambient'])this.bus[name].gain.setTargetAtTime(active?1:.012,t,.07);
  this.bus.effects.gain.setTargetAtTime(active?this.effectsVolume:.008,t,.04);
  const set=(v,g,rate=1,hz=15000)=>{v.gain.gain.setTargetAtTime(g,t,.055);v.src.playbackRate.setTargetAtTime(clamp(rate,.35,2.45),t,.032);v.filter.frequency.setTargetAtTime(hz,t,.047);};
  const rpm=c.rpm,centres=[1050,2400,4100,6300];let b=0;while(b<2&&rpm>centres[b+1])b++;
  const blend=clamp((rpm-centres[b])/(centres[b+1]-centres[b]),0,1);
  for(let i=0;i<4;i++){const weight=i===b?Math.cos(blend*Math.PI/2):i===b+1?Math.sin(blend*Math.PI/2):0;
    const rate=(this.style?.94:1.02)*rpm/centres[i],cut=c.shift>.035?.41:1;
    set(this.layers[i][0],weight*(.58+.45*c.throttle)*cut,rate,3200+7500*c.throttle);set(this.layers[i][1],weight*(.18+.39*(1-c.throttle))*cut,rate*.99,2400+2300*(1-c.throttle));}
  const f=track.frame(c.s),player=track.point(c.s,c.l),listener=this.ctx.listener;
  for(const [key,v] of [['positionX',player.x],['positionY',c.y+1],['positionZ',player.z],['forwardX',f.tx],['forwardY',0],['forwardZ',f.tz],['upX',0],['upY',1],['upZ',0]])if(listener[key])listener[key].setTargetAtTime(v,t,.027);
  this.activeAI=0;
  for(let i=0;i<5;i++){const o=race.cars[i+1],pos=track.point(o.s,o.l),v=this.ai[i],delta=pos.distanceTo(player),gain=delta>87?0:.29*(1-smoothRange(53,88,delta));if(gain>.002)this.activeAI++;
    v.pan.positionX.setTargetAtTime(pos.x,t,.033);v.pan.positionY.setTargetAtTime(o.y+.62,t,.033);v.pan.positionZ.setTargetAtTime(pos.z,t,.033);
    set(v,gain,o.rpm/4100*(1+clamp((o.speed-c.speed)/340,-.075,.075)*Math.sign(c.distance-o.distance)),5800);}
  this.maxAI=Math.max(this.maxAI,this.activeAI);
  const off=Math.abs(c.l)>f.width/2-.45,bridge=track.onBridge(c.s),edge=Math.abs(f.curve)>.0068&&Math.abs(c.l)>f.width/2-.85;
  set(this.roll,clamp(c.speed/36,0,1)*(off?.23:bridge?.19:edge?.14:.061),off?.77:bridge?1.33:1.02,off?4700:bridge?1450:edge?2200:710);
  set(this.skid,Math.min(.52,c.slip*.48),.81+Math.min(.53,c.slip*.28),6400);
  set(this.scrape,c.wall*.19,.62,2200);set(this.air,.027+c.speed*.0024,1+c.speed*.008,540+c.speed*26);
  const zone=track.zone(c.s),index=track.zones.indexOf(zone),inZone=c.s-zone.s,blendZone=clamp(inZone/28,0,1);
  for(let i=0;i<4;i++){const w=i===index?blendZone:i===(index+3)%4?1-blendZone:0;set(this.zones[i],w*(i===2?.26:.34),1,i===2?1900:11500);}
  if(index===2&&race.time-this.lastBell>16&&active){for(const [f,v] of [[392,.075],[783,.035],[1078,.020]])this.tone(f,1.08,v,'ambient');this.lastBell=race.time;}
  for(let i=this.logIndex;i<race.log.length;i++){const e=race.log[i];if((e.type==='collision'&&(e.driver===0||e.other===0))||(e.type==='barrier'&&e.driver===0))this.hit(e.strength||1);}
  this.logIndex=race.log.length;
  const stage=race.phase==='countdown'?String(Math.max(1,Math.ceil(7.9-race.intro))):race.phase;
  if(stage!==this.lastStage){if(['1','2','3','race','results'].includes(stage))this.tone(stage==='race'?940:stage==='results'?1174:510,stage==='race'?.29:.13,.16);this.lastStage=stage;}
  this.maxVoices=Math.max(this.maxVoices,this.nodes.length+this.transients.size);
 }
 beginPCM(){this.pcm=[];this.tap.port.postMessage('start');}
 endPCM(){return new Promise(resolve=>{this.finishPCM=peak=>{
   const samples=this.pcm.reduce((n,a)=>n+a.length,0),buf=new ArrayBuffer(44+samples*2),v=new DataView(buf),label=(off,s)=>{for(let i=0;i<s.length;i++)v.setUint8(off+i,s.charCodeAt(i));};
   label(0,'RIFF');v.setUint32(4,36+samples*2,true);label(8,'WAVE');label(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,this.ctx.sampleRate,true);v.setUint32(28,this.ctx.sampleRate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);label(36,'data');v.setUint32(40,samples*2,true);
   const pcm=new Int16Array(buf,44);let o=0;for(const a of this.pcm){pcm.set(a,o);o+=a.length;}this.pcm=null;resolve({blob:new Blob([buf],{type:'audio/wav'}),seconds:samples/(2*this.ctx.sampleRate),peakDB:20*Math.log10(Math.max(peak,1e-12)),sampleRate:this.ctx.sampleRate});};this.tap.port.postMessage('stop');});}
}
function smoothRange(a,b,x){const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
