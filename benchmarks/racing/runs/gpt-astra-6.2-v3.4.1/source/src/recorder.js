export function saveBlob(blob,filename){const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
export function captureLap(sceneCanvas,hud,sound){
 const surface=document.createElement('canvas');surface.width=1920;surface.height=1080;const g=surface.getContext('2d',{alpha:false});
 const stream=surface.captureStream(30);for(const channel of sound.media.stream.getAudioTracks())stream.addTrack(channel);
 const type=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
 const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:6400000,audioBitsPerSecond:128000});
 const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 const draw=()=>{g.drawImage(sceneCanvas,0,0,1920,1080);g.drawImage(hud,0,0,1920,1080);};
 draw();sound.beginPCM();recorder.start(1000);
 return {draw,async finish(){const stopped=new Promise(r=>recorder.onstop=r);recorder.stop();const pcm=await sound.endPCM();await stopped;stream.getVideoTracks().forEach(t=>t.stop());const video=new Blob(chunks,{type:'video/webm'});
   return {video,audio:pcm.blob,seconds:pcm.seconds,peakDB:pcm.peakDB,sampleRate:pcm.sampleRate,videoType:recorder.mimeType,maxVoices:sound.maxVoices,maxAI:sound.maxAI};}};
}
