import assert from 'node:assert/strict';
import { open, writeFile } from 'node:fs/promises';
import { beginRace, openRace } from './journey.mjs';

async function saveBlob(page,entry,relativePath) {
  const pending=page.waitForEvent('download',{timeout:45000});
  await page.evaluate(([url,name])=>{
    const a=document.createElement('a');
    a.href=url;a.download=name;a.click();
  },[entry.url,relativePath.split('/').at(-1)]);
  const download=await pending;
  await download.saveAs(relativePath);
  await page.evaluate(url=>URL.revokeObjectURL(url),entry.url);
}

export async function lapMedia(page,url,folder='verification') {
  await openRace(page,url);
  await beginRace(page);
  const intro=await page.evaluate(()=>raceGate.advance(8.025,false));
  assert.equal(intro.phase,'race');
  assert.equal(intro.mode,'chase');
  await page.evaluate(()=>raceGate.startRecording());
  console.log('Recording one live lap with five AI cars.');
  try {
    await page.waitForFunction(()=>raceGate.state().player.lap>=1,null,{timeout:245000});
  } catch(error) {
    console.error('Lap capture stalled:',await page.evaluate(()=>raceGate.state()));
    throw error;
  }
  const live=await page.evaluate(()=>raceGate.state());
  const media=await page.evaluate(()=>raceGate.endRecording());
  await saveBlob(page,media.video,folder+'/volta.webm');
  await saveBlob(page,media.audio,folder+'/audio-volta.wav');
  const audio=await open(folder+'/audio-volta.wav');
  const header=Buffer.alloc(44);
  try { await audio.read(header,0,44,0); } finally { await audio.close(); }
  const waveSeconds=header.readUInt32LE(40)/header.readUInt32LE(28);
  const masterPeakDb=20*Math.log10(media.peak);
  const film=await open(folder+'/volta.webm');
  const ebml=Buffer.alloc(16384);
  try { await film.read(ebml,0,ebml.length,0); } finally { await film.close(); }
  const muxed=ebml.subarray(0,4).toString('hex')==='1a45dfa3'&&ebml.includes('A_OPUS')&&
    (ebml.includes('V_VP8')||ebml.includes('V_VP9'));
  const cueMap={shift:'Gear shift',nitro:'Nitro boost',slip:'Tire slip',impact:'Impact',bridge:'Bridge entry',overtake:'AI pass'};
  const cues=Object.entries(cueMap).map(([kind,label])=>{
    const marker=media.markers.find(e=>e.kind===kind);
    return {label,seconds:marker?.time??null,raceTime:marker?.raceTime??null};
  });
  const data={
    lapSeconds:media.lap, recordSeconds:waveSeconds, sampleRate:media.sampleRate,
    masterPeakDb, maxVoices:live.audio.maxVoices, audioBytes:media.audio.bytes, videoBytes:media.video.bytes,
    cues, resets:live.resets, muxed,
  };
  await writeFile(folder+'/audio-test.json',JSON.stringify(data,null,2));
  assert.equal(header.toString('ascii',0,4),'RIFF');
  assert.ok(muxed,'The WebM includes both an authored-scene video track and the live Opus audio track');
  assert.ok(waveSeconds>=media.lap && media.video.bytes>1000000);
  assert.ok(media.peak>.06&&masterPeakDb<=-1);
  assert.ok(cues.every(c=>c.seconds!==null));
  assert.deepEqual(live.resets,[]);
  console.log('Live lap recorded:',JSON.stringify(data));
  return data;
}
