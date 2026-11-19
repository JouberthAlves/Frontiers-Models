import { asset } from './materials.js';
import { clamp, smooth, wrap } from './course.js';

const rpmBands = [1120, 2400, 4000, 5670, 7500];
const variants = ['gt','rs'];
const effects = ['rolling','gravel','curb','wind','skid','surf','bells','pines','crickets','scrape','impact','nitro'];
const motorNames = variants.flatMap(car=>['load','coast'].flatMap(layer=>rpmBands.map((_,i)=>`${car}-${layer}-${i}`)));

function gain(context, value, output) {
  const node=context.createGain();
  node.gain.value=value;
  node.connect(output);
  return node;
}

function wavBlob(chunks, rate) {
  const bytes=chunks.reduce((n, chunk)=>n+chunk.byteLength,0);
  const header=new ArrayBuffer(44), view=new DataView(header);
  const str=(name,offset)=>[...name].forEach((ch,i)=>view.setUint8(offset+i,ch.charCodeAt(0)));
  str('RIFF',0); view.setUint32(4,bytes+36,true); str('WAVE',8); str('fmt ',12);
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);
  view.setUint32(24,rate,true);view.setUint32(28,rate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);
  str('data',36);view.setUint32(40,bytes,true);
  return new Blob([header,...chunks],{type:'audio/wav'});
}

export class RaceAudio {
  constructor() {
    this.mix={master:.84,sfx:.87,music:.35};
    this.buffers=new Map();
    this.sources=[];
    this.shots=new Set();
    this.maxVoices=0;
    this.uiVoices=0;
    this.recordStart=null;
    this.markers=[];
    this.history=[];
    this.eventCursor=0;
    this.loaded=false;
    this.raceNodes=null;
    this.menuLayer=null;
  }

  async unlock() {
    if (this.context) {
      await this.context.resume();
      return this.ready;
    }
    const context=this.context=new AudioContext({ latencyHint:'interactive',sampleRate:48000 });
    const compressor=context.createDynamicsCompressor();
    compressor.threshold.value=-12; compressor.knee.value=6; compressor.ratio.value=10;
    compressor.attack.value=.003; compressor.release.value=.12;
    const ceiling=.883;
    this.limiter=context.createWaveShaper();
    const curve=new Float32Array(2049);
    for(let i=0;i<curve.length;i++){
      const x=i*2/(curve.length-1)-1;
      curve[i]=clamp(x,-ceiling,ceiling);
    }
    this.limiter.curve=curve;
    this.limiter.oversample='none';
    compressor.connect(this.limiter);
    this.limiter.connect(context.destination);
    this.master=gain(context,this.mix.master,compressor);
    this.game=gain(context,1,this.master);
    this.buses={
      player:gain(context,1,this.game), ai:gain(context,.68,this.game),
      effects:gain(context,this.mix.sfx,this.game), ambience:gain(context,.49,this.game),
      ui:gain(context,.48,this.master), music:gain(context,this.mix.music,this.master),
    };
    this.ready=Promise.all([...motorNames,...effects].map(async name=>{
      const res=await fetch(asset('audio/'+name+'.wav'));
      if(!res.ok) throw new Error('Could not load audio buffer '+name);
      this.buffers.set(name,await context.decodeAudioData(await res.arrayBuffer()));
    })).then(()=>{this.loaded=true;});
    await context.resume();
    return this.ready;
  }

  setVolume(channel, value) {
    this.mix[channel]=value;
    if(!this.context) return;
    const b=channel==='master'?this.master:channel==='sfx'?this.buses.effects:this.buses.music;
    b.gain.setTargetAtTime(value,this.context.currentTime,.041);
  }

  createLoop(name, destination, start=0) {
    const ctx=this.context, node=ctx.createBufferSource();
    node.buffer=this.buffers.get(name);
    node.loop=true;
    const trim=gain(ctx,0,destination);
    node.connect(trim);
    node.start(ctx.currentTime, start % node.buffer.duration);
    const voice={ node,trim,name,tail:null };
    this.sources.push(voice);
    return voice;
  }

  start(states, period) {
    if(!this.loaded) return;
    this.stop();
    const ctx=this.context;
    const type=variants[states[0].model];
    const engine=['load','coast'].map(layer=>rpmBands.map((_,i)=>this.createLoop(`${type}-${layer}-${i}`,this.buses.player,i*.029)));
    const ai=states.slice(1).map((state,i)=>{
      const pan=ctx.createPanner();
      pan.panningModel='HRTF';pan.distanceModel='inverse';pan.refDistance=3.7;pan.maxDistance=100;pan.rolloffFactor=1.27;
      pan.connect(this.buses.ai);
      const voice=this.createLoop(variants[state.model]+'-load-2',pan,i*.071);
      voice.tail=pan;
      return { voice,pan,lastDistance:0 };
    });
    const layers={};
    for(const name of ['rolling','gravel','curb','wind','skid','scrape','surf','bells','pines','crickets']){
      const background=['surf','bells','pines','crickets'].includes(name);
      layers[name]=this.createLoop(name,background?this.buses.ambience:this.buses.effects,background?3.5:.07);
    }
    this.raceNodes={engine,ai,layers,period};
    this.eventCursor=0;
    this.game.gain.setTargetAtTime(1,ctx.currentTime,.022);
    this.maxVoices=Math.max(this.maxVoices,this.voiceCount());
  }

  voiceCount() {
    return this.sources.length+this.shots.size;
  }

  disposeShot(entry) {
    if(!this.shots.delete(entry)) return;
    entry.node.disconnect(); entry.trim.disconnect();
  }

  oneShot(name, volume, rate=1) {
    if(!this.loaded||this.shots.size>=9) return;
    const ctx=this.context, node=ctx.createBufferSource(), trim=gain(ctx,volume,this.buses.effects);
    node.buffer=this.buffers.get(name);
    node.playbackRate.value=rate;
    node.connect(trim);
    const reference={node,trim};
    this.shots.add(reference);
    node.onended=()=>this.disposeShot(reference);
    node.start();
    this.maxVoices=Math.max(this.maxVoices,this.voiceCount());
  }

  chime(kind) {
    if (!this.context || this.context.state!=='running') return;
    const cues={
      navigate:[[435,.033,0]],confirm:[[545,.075,0],[741,.087,.055]],
      count:[[414,.175,0]], go:[[621,.22,0],[829,.23,.013]], finish:[[437,.26,0],[583,.30,.11],[874,.31,.23]],
    };
    for (const [hz,len,start] of cues[kind]??[]) {
      const t=this.context.currentTime+start, oscillator=this.context.createOscillator();
      oscillator.type='sine'; oscillator.frequency.value=hz;
      const envelope=gain(this.context,.0,this.buses.ui);
      oscillator.connect(envelope);
      envelope.gain.setValueAtTime(.0,t);
      envelope.gain.linearRampToValueAtTime(.22,t+.009);
      envelope.gain.exponentialRampToValueAtTime(.001,t+len);
      oscillator.start(t);oscillator.stop(t+len+.04);
      this.uiVoices++;
      this.maxVoices=Math.max(this.maxVoices,this.voiceCount()+this.uiVoices);
      oscillator.onended=()=>{this.uiVoices--;oscillator.disconnect();envelope.disconnect();};
    }
  }

  menu(active) {
    if(!this.loaded) return;
    if(active && !this.menuLayer) {
      const entry=this.createLoop('surf',this.buses.music,2.9);
      entry.trim.gain.setTargetAtTime(.23,this.context.currentTime,.22);
      this.menuLayer=entry;
    } else if(!active && this.menuLayer) {
      const entry=this.menuLayer, now=this.context.currentTime;
      entry.trim.gain.setTargetAtTime(0,now,.056);
      entry.node.onended=()=>{entry.node.disconnect();entry.trim.disconnect();};
      try { entry.node.stop(now+.27); } catch { /* already stopping */ }
      this.sources=this.sources.filter(voice=>voice!==entry);
      this.menuLayer=null;
    }
  }

  pause(value) {
    if(this.context) this.game.gain.setTargetAtTime(value ? .012 : 1,this.context.currentTime,.065);
  }

  stop() {
    for(const entry of this.sources) {
      try { entry.node.stop(); } catch { /* source has already ended */ }
      entry.node.disconnect();entry.trim.disconnect();entry.tail?.disconnect();
    }
    for(const entry of [...this.shots]) {
      try { entry.node.stop(); } catch { /* source has already ended */ }
      this.disposeShot(entry);
    }
    this.sources=[];
    this.raceNodes=null;
    this.menuLayer=null;
  }

  update(race,dt,period) {
    if (!this.raceNodes) return;
    const {engine,ai,layers}=this.raceNodes;
    const ctx=this.context, t=ctx.currentTime;
    const smoothGain=(voice,value,decay=.10)=>voice.trim.gain.setTargetAtTime(value,t,decay);
    const p=race.player, v=Math.abs(p.speed);
    const shift=race.time<p.shiftUntil;
    let i=rpmBands.findIndex(x=>p.rpm<x)-1;
    if(i<0) i=p.rpm<rpmBands[0]?0:rpmBands.length-2;
    const gap=clamp((p.rpm-rpmBands[i])/(rpmBands[i+1]-rpmBands[i]),0,1);
    const load=clamp(p.load+(p.boosting?.14:0),0,1);
    const gearCut=shift?.27:1;
    for(let j=0;j<rpmBands.length;j++){
      const blend=j===i?Math.sqrt(1-gap):j===i+1?Math.sqrt(gap):0;
      for(const [layer, weight] of [[0,.095+load*.47],[1,.36*(1-load)]]){
        const voice=engine[layer][j];
        voice.node.playbackRate.setTargetAtTime(clamp(p.rpm/rpmBands[j],.63,1.53),t,.051);
        smoothGain(voice,blend*weight*gearCut,.039);
      }
    }
    ctx.listener.positionX.value=p.x;ctx.listener.positionY.value=p.y+.87;ctx.listener.positionZ.value=p.z;
    ctx.listener.forwardX.value=Math.cos(p.heading);ctx.listener.forwardZ.value=Math.sin(p.heading);
    ctx.listener.upY.value=1;
    ai.forEach(({voice,pan},index)=>{
      const c=race.cars[index+1];
      const distance=Math.hypot(c.x-p.x,c.z-p.z);
      const entry=ai[index];
      const velocity=entry.lastDistance && dt>.001?(entry.lastDistance-distance)/dt:0;
      entry.lastDistance=distance;
      pan.positionX.value=c.x;pan.positionY.value=c.y+.48;pan.positionZ.value=c.z;
      voice.node.playbackRate.setTargetAtTime(clamp(c.rpm/4150,.62,1.62)*(1+clamp(velocity/440,-.089,.089)),t,.075);
      smoothGain(voice,(1-smooth(65,108,distance))*(.22+.077*c.load),.10);
    });
    smoothGain(layers.rolling,smooth(2,40,v)*(.082+(p.bridge?.17:0))*(p.surface==='asphalt'?1:.155));
    layers.rolling.node.playbackRate.setTargetAtTime(.58+v*.028,t,.14);
    smoothGain(layers.curb,p.surface==='curb'?smooth(1,22,v)*.19:0,.043);
    smoothGain(layers.gravel,p.surface==='sand'||p.surface==='dirt'?smooth(1,22,v)*.285:0,.045);
    layers.gravel.node.playbackRate.setTargetAtTime(.68+v*.024,t,.13);
    smoothGain(layers.wind,(v*.0044+Number(p.zone===1)*.05)*(period==='night'?.75:1));
    smoothGain(layers.skid,smooth(.025,.15,Math.abs(p.slip))*smooth(4,21,v)*.29,.059);
    smoothGain(layers.scrape,race.time-p.lastImpact<.08&&v>5?.105:0,.052);
    const z=race.course.zones, s=wrap(p.s,race.course.length);
    const village=smooth(z[2].at-38,z[2].at+38,s)*(1-smooth(z[3].at-35,z[3].at+35,s));
    const woods=smooth(z[3].at-28,z[3].at+44,s);
    smoothGain(layers.surf,(.25*(1-smooth(z[1].at-111,z[1].at+87,s))+.21*smooth(race.course.length-85,race.course.length-14,s))*(period==='night'?.58:1),.28);
    smoothGain(layers.bells,village*(period==='night'?.105:.20),.36);
    smoothGain(layers.pines,woods*(period==='night'?.04:.22),.31);
    smoothGain(layers.crickets,(period==='night'?.14:.009)*(woods+.38*village),.30);
    while(this.eventCursor<race.events.length){
      const e=race.events[this.eventCursor++];
      if(race.time-e.time>.18) continue;
      if(this.recordStart!==null && (e.car===0||e.type==='overtake')){
        this.markers.push({kind:e.type,time:t-this.recordStart,raceTime:e.time,car:e.car});
      }
      if(e.type==='impact'&&e.car===0) this.oneShot('impact',clamp(e.amount*.029,.079,.52),e.kind==='rail'?.96:.87);
      if(e.type==='nitro'&&e.car===0){
        this.oneShot('nitro',.52,1.34);
        this.oneShot('impact',.095,1.66);
      }
    }
  }

  stats() {
    return {
      state:this.context?.state??'locked',
      decoded:this.buffers.size,
      bands:rpmBands.map((rpm,i)=>({rpm,models:variants.map(type=>['load','coast'].map(layer=>{
        const buffer=this.buffers.get(`${type}-${layer}-${i}`);
        return { realAudioBuffer:buffer instanceof AudioBuffer, samples:buffer?.length??0 };
      }))})),
      activeVoices:this.voiceCount(), maxVoices:this.maxVoices, aiVoices:this.raceNodes?.ai.length??0,
    };
  }

  async record(canvas) {
    const ctx=this.context;
    if(!this.tapLoaded){
      await ctx.audioWorklet.addModule(asset('audio-tap.js'));
      this.tapLoaded=true;
    }
    const tap=new AudioWorkletNode(ctx,'master-tap',{outputChannelCount:[2]});
    const silent=gain(ctx,0,ctx.destination);
    this.limiter.connect(tap);
    tap.connect(silent);
    const bus=ctx.createMediaStreamDestination();
    this.limiter.connect(bus);
    const visuals=canvas.captureStream(43);
    bus.stream.getAudioTracks().forEach(track=>visuals.addTrack(track));
    const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')?'video/webm;codecs=vp8,opus':'video/webm';
    const recorder=new MediaRecorder(visuals,{mimeType:mime,videoBitsPerSecond:7400000,audioBitsPerSecond:192000});
    const video=[];
    const stopped=new Promise(resolve=>{
      recorder.ondataavailable=e=>{if(e.data.size) video.push(e.data);};
      recorder.onstop=resolve;
    });
    const chunks=[];
    const audio=new Promise(resolve=>{
      tap.port.onmessage=({data})=>{
        if(data.chunk) chunks.push(data.chunk);
        if(data.done) resolve({ peak:data.peak, wav:wavBlob(chunks,ctx.sampleRate) });
      };
    });
    recorder.start(2000);
    this.markers=[];
    this.recordStart=ctx.currentTime;
    tap.port.postMessage('start');
    return async ()=>{
      recorder.stop();
      tap.port.postMessage('stop');
      const [pcm]=await Promise.all([audio,stopped]);
      this.limiter.disconnect(tap);this.limiter.disconnect(bus);
      tap.disconnect();silent.disconnect();tap.port.close();
      visuals.getTracks().forEach(track=>track.stop());
      this.recordStart=null;
      return { video:new Blob(video,{type:'video/webm'}),wav:pcm.wav,peak:pcm.peak,sampleRate:ctx.sampleRate,markers:[...this.markers] };
    };
  }
}
