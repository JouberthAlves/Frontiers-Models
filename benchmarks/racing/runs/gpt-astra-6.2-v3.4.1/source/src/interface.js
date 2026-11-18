import {models,paints,numbers} from './cars.js';
import {drivers} from './race.js';
export const timeLabel=(t,ms=true)=>{if(!Number.isFinite(t))return '—:––';const sec=Math.floor(t%60);return Math.floor(t/60)+':'+String(sec).padStart(2,'0')+(ms?'.'+String(Math.floor((t%1)*1000)).padStart(3,'0'):'');};
const icons={
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',back:'<path d="m14 5-7 7 7 7"/>',gear:'<path d="m10 3-1 3-3 1-2-1-2 4 3 2v2l-2 2 2 4 3-1 2 1 1 2h4l1-3 2-1 3 1 2-4-3-2v-2l2-2-2-4-3 1-2-1-1-2Z"/><circle cx="12" cy="12" r="3"/>',
 sound:'<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',mute:'<path d="m3 9 4 0 5-4v14l-5-4H3zm13 1 5 5m0-5-5 5"/>',
 pause:'<path d="M8 5v14m8-14v14"/>',flag:'<path d="M5 21V4m1 1c5-5 8 5 15 0l-2 9c-5 4-8-5-13-1"/>',
 mountain:'<path d="m2 18 8-13 4 6 2-3 6 10zM7 10l3 2 2-3"/>',
 track:'<path d="M6 18C0 15 5 5 9 6s2 5 6 4 8-2 6 3-6 0-8 3-5 6-7 2Z"/>',pin:'<path d="M18 10c0 4-6 10-6 10S6 14 6 10a6 6 0 1 1 12 0Z"/><circle cx="12" cy="10" r="2"/>',
 car:'<path d="m3 15 1-6 3-1 2-3h6l3 4 3 1v5z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>',
 game:'<path d="M7 6h10c3 0 6 10 3 12-2 1-4-3-6-3h-4c-3 0-4 4-6 3C1 16 4 6 7 6Z"/><path d="M8 9v5m-2-2h5m5-1h.1m2 2h.1"/>',
 close:'<path d="m5 5 14 14m0-14L5 19"/>'};
export const icon=(k)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[k]+'</svg>';
const brand='<div class="brand"><span class="brandmark"><i></i><i></i><i></i></span><b>ESTREITO</b><small>RACING</small></div>';
const btn=(act,txt,css='',symbol='')=>'<button data-act="'+act+'" class="'+css+'">'+(symbol?icon(symbol):'')+txt+'</button>';
function trackPath(track){const pts=track.stations.filter((_,i)=>i%7===0),xs=pts.map(p=>p.x),zs=pts.map(p=>p.z),x=Math.min(...xs),z=Math.min(...zs),w=Math.max(...xs)-x,h=Math.max(...zs)-z;
 return {xy:p=>[12+(p.x-x)/h*116,12+(p.z-z)/h*116],pts,w:24+116*w/h,h:140};}
export function courseSVG(track){const m=trackPath(track),points=m.pts.map(p=>m.xy(p).map(v=>v.toFixed(1)).join(',')).join(' '),[x,y]=m.xy(m.pts[0]);
 return '<svg class="course" viewBox="0 0 '+m.w+' 140" aria-label="Traçado da Costa Dourada"><polygon points="'+points+'" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><circle cx="'+x+'" cy="'+y+'" r="3.9" fill="#ff7542"/></svg>';}
export function interfaceFor(ui,track,options,sound,onAction){
 let page='',shown='',panel='',returnPage='',pending=false;
 const action=(name)=>onAction(name,api);
 ui.addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(!b)return;const name=b.dataset.act;
  if(name!=='mute')sound.tone(560,.055,.065);
  if(name==='settings'||name==='controls'){returnPage=page;panel=name;render();return;}
  if(name==='close'){panel='';render();return;}
  if(name==='mute'){sound.muted=!sound.muted;sound.setVolumes();render();return;}
  if(name.startsWith('choose:')){const [,k,v]=name.split(':');options[k]=['car','color','laps'].includes(k)?Number(v):v;action('change-'+k);render();return;}
  action(name);
 });
 ui.addEventListener('input',e=>{const name=e.target.dataset.volume;if(!name)return;sound[name]=Number(e.target.value)/100;sound.setVolumes();e.target.nextElementSibling.textContent=e.target.value+'%';action('volume');});
 const top=()=>'<header>'+brand+'<div class="top-actions">'+btn('mute','<span class="sr">Som</span>','icon-btn',sound.muted?'mute':'sound')+btn('settings','<span class="sr">Configurações</span>','icon-btn','gear')+'</div></header>';
 const foot=()=>'<footer><span>'+icon('pin')+' Santa Lume <i></i> Litoral mediterrâneo</span>'+btn('controls',icon('game')+' Controles','foot-control')+'</footer>';
 const primary=(id,s)=>btn(id,'<span>'+s+'</span>'+icon('arrow'),'primary');
 const back=(id='menu')=>btn(id,'Voltar','back','back');
 const title=(b,main)=>'<div class="kicker"><i></i>'+b+'</div><h1 class="sub-title">'+main+'</h1>';
 const toggle=(k,items)=>'<div class="choices">'+items.map(([v,label])=>'<button data-act="choose:'+k+':'+v+'" aria-pressed="'+(options[k]===v)+'" class="'+(options[k]===v?'selected':'')+'">'+label+'</button>').join('')+'</div>';
 function controls(){return '<dl class="bindings"><div><dt>Acelerar</dt><dd>↑ / W <em>RT</em></dd></div><div><dt>Frear</dt><dd>↓ / S <em>LT</em></dd></div><div><dt>Esterçar</dt><dd>← → / A D <em>Analógico E</em></dd></div><div><dt>Alternar câmera</dt><dd>C <em>Y</em></dd></div><div><dt>Pausar</dt><dd>Esc / P <em>Menu</em></dd></div></dl>';}
 function render(){
   ui.className=page+(panel?' with-dialog':'');ui.dataset.screen=page;let h='';
   if(page==='menu'){
     h=top()+'<section class="menu-copy"><div class="kicker"><i></i> Grande prêmio costeiro</div><h1 class="event-title">Costa<br><em>Dourada</em></h1><div class="event-info"><span>'+icon('track')+' 2,97 km</span><i></i><span>'+icon('car')+' 6 pilotos</span></div>'+primary('garage','Entrar na garagem')+'</section>'+
       '<aside class="route-card">'+courseSVG(track)+'<div><small>Circuito</small><strong>Santa Lume</strong><span>Asfalto · Pôr do sol</span></div></aside>'+foot();
   }else if(page==='garage'){
     const c=models[options.car];h=top()+'<section class="side-panel">'+back()+title('Garagem','Seu carro')+'<div class="car-select">'+models.map((v,i)=>'<button class="'+(i===options.car?'chosen':'')+'" data-act="choose:car:'+i+'"><small>'+v.type+'</small><b>'+v.name+'</b></button>').join('')+'</div><div class="label">Pintura <span>'+paints[options.color].name+'</span></div><div class="swatches">'+paints.map((p,i)=>'<button data-act="choose:color:'+i+'" class="'+(i===options.color?'active':'')+'" style="--paint:#'+p.hex.toString(16).padStart(6,'0')+'" aria-label="'+p.name+'" aria-pressed="'+(i===options.color)+'"></button>').join('')+'</div>'+primary('setup','Configurar corrida')+'</section>'+foot();
   }else if(page==='setup'){
     h=top()+'<section class="side-panel">'+back('garage')+title('Costa Dourada','Configurar corrida')+'<div class="label">Voltas</div>'+toggle('laps',[[3,'3 voltas'],[6,'6 voltas']])+'<div class="label">Dificuldade</div>'+toggle('difficulty',[['facil','Fácil'],['normal','Normal'],['dificil','Difícil']])+'<div class="label">Qualidade gráfica</div>'+toggle('quality',[['low','Baixa'],['high','Alta']])+primary('start','Ir para o grid')+'</section>'+foot();
   }else if(page==='race'){h='<div class="race-tools">'+btn('pause','<span class="sr">Pausar corrida</span>','icon-btn','pause')+'</div>';}
   else if(page==='paused'){h=top()+'<section class="side-panel">'+title('Costa Dourada','Corrida pausada')+primary('resume','Continuar')+btn('restart','Reiniciar corrida','secondary')+btn('menu','Voltar ao menu','secondary')+'</section>';}
   else if(page==='results'){const race=api.race;h=top()+'<section class="results-panel">'+title('Bandeirada final','Resultados')+'<div class="result-meta">Costa Dourada · '+options.laps+' voltas</div><ol class="classification">'+race.results().map((row,i)=>'<li class="'+(!row.driver?'is-player':'')+'"><b>'+String(i+1).padStart(2,'0')+'</b><span>'+drivers[row.driver]+'</span><time>'+(row.projected?'≈ ':'')+timeLabel(row.time)+'</time></li>').join('')+'</ol>'+primary('restart','Correr de novo')+btn('menu','Voltar ao menu','secondary')+'</section>';}
   if(panel){
     h+='<div class="veil"><section class="dialog" role="dialog" aria-modal="true" aria-label="'+(panel==='settings'?'Configurações':'Controles')+'">'+btn('close','<span class="sr">Fechar</span>','icon-btn x','close')+title('Estreito Racing',panel==='settings'?'Configurações':'Controles');
     if(panel==='settings'){h+='<div class="label">Qualidade gráfica</div>'+toggle('quality',[['low','Baixa'],['high','Alta']])+'<div class="sliders">'+[['masterVolume','Geral'],['effectsVolume','Efeitos'],['musicVolume','Música']].map(([id,n])=>'<label>'+n+'<input type="range" min="0" max="100" data-volume="'+id+'" value="'+Math.round(sound[id]*100)+'"><output>'+Math.round(sound[id]*100)+'%</output></label>').join('')+'</div>'+btn('controls','Ver controles','secondary');}else h+=controls();h+='</section></div>';
   }
   ui.innerHTML=h;
 }
 const api={get page(){return page;},get panel(){return panel;},race:null,show(p){page=p;panel='';render();},render,
  escape(){if(panel){panel='';render();}else if(page==='race')action('pause');else if(page==='paused')action('resume');else if(page==='setup')action('garage');else if(page==='garage')action('menu');},
  confirm(){const scope=panel?ui.querySelector('.dialog'):ui;if(document.activeElement?.matches('button')&&scope.contains(document.activeElement))document.activeElement.click();else(scope.querySelector('.primary')||scope.querySelector('button'))?.click();},
  move(dir){const list=[...(panel?ui.querySelector('.dialog'):ui).querySelectorAll('button,input')];if(!list.length)return;const i=list.indexOf(document.activeElement);list[(i+dir+list.length)%list.length].focus();}
 };return api;
}
export function instruments(canvas,track){
 const ctx=canvas.getContext('2d'),m=trackPath(track),path=new Path2D();m.pts.forEach((p,i)=>{const [x,y]=m.xy(p);if(i)path.lineTo(x,y);else path.moveTo(x,y);});path.closePath();
 return (race,shown=true)=>{
  const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);if(!shown)return;
  const scale=Math.max(.62,Math.min(H/860,W/1400)),w=W/scale,h=H/scale;ctx.save();ctx.scale(scale,scale);
  const c=race.cars[0],state=c.progress;const txt=(s,x,y,size=15,color='#f8f4e9',weight=600,align='left')=>{ctx.textAlign=align;ctx.fillStyle=color;ctx.font=weight+' '+size+'px "Bahnschrift","Arial Narrow",Arial';ctx.fillText(s,x,y);};
  const panel=(x,y,ww,hh)=>{const g=ctx.createLinearGradient(x,y,x+ww,y);g.addColorStop(0,'rgba(13,21,24,.88)');g.addColorStop(1,'rgba(20,30,34,.50)');ctx.fillStyle=g;ctx.fillRect(x,y,ww,hh);};
  if(race.phase==='grid'){txt('GRID DE LARGADA',27,h-64,12,'#ffab75',750);txt('Costa Dourada',26,h-29,33);ctx.restore();return;}
  panel(24,24,169,83);ctx.fillStyle='#ff7749';ctx.fillRect(24,24,4,83);
  txt('POSIÇÃO',39,47,11,'#d2d2ca',700);txt(String(race.position()).padStart(2,'0'),38,88,40,'#fff8ed',800);txt('/ 06',96,86,18,'#bdc4bc');
  txt('VOLTA',139,47,11,'#d2d2ca',700);txt(Math.min(race.opts.laps,state.laps+1)+'/'+race.opts.laps,139,80,22);
  panel(w-249,24,190,66);txt('VOLTA ATUAL',w-235,48,10,'#d4d0c5');txt(timeLabel(race.time-state.lapStart),w-70,48,16,'#fff9e8',650,'right');
  txt('MELHOR',w-235,74,10,'#d4d0c5');txt(timeLabel(state.best),w-70,75,16,'#ffc494',650,'right');
  ctx.save();ctx.translate(43,h-157);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=6.8;ctx.strokeStyle='rgba(15,23,24,.66)';ctx.stroke(path);ctx.lineWidth=2.4;ctx.strokeStyle='#e6e1ce';ctx.stroke(path);
  for(const car of [...race.cars.slice(1),c]){const [x,y]=m.xy(track.frame(car.s));ctx.beginPath();ctx.arc(x,y,car===c?4.7:2.8,0,Math.PI*2);ctx.fillStyle=car===c?'#ff6b38':'#f5eac4';ctx.fill();}ctx.restore();
  panel(w-211,h-110,184,83);txt(Math.round(c.speed*3.6).toString().padStart(3,'0'),w-201,h-52,46,'#fff7ea',800);txt('KM/H',w-198,h-35,10,'#d5cec1',650);
  txt('MARCHA',w-73,h-81,9,'#dfd5c9',600,'center');txt(c.gear,w-73,h-45,32,'#ff9060',750,'center');ctx.fillStyle='#575b55';ctx.fillRect(w-210,h-114,184,4);ctx.fillStyle=c.rpm>6070?'#ff542b':'#ffa15b';ctx.fillRect(w-210,h-114,184*c.rpm/7000,4);
  if(race.phase==='countdown'||(race.phase==='race'&&race.time<.85)){const label=race.phase==='countdown'?String(Math.max(1,Math.ceil(7.9-race.intro))):'VAI';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=16;txt(label,w/2,h*.40,91,'#ffefe2',850,'center');}
  ctx.restore();
 };
}
