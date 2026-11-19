import { LIVERIES, MODELS } from './car.js';

const mark = `<svg viewBox="0 0 48 38" width="41" height="33" fill="none" aria-hidden="true"><path d="M2 32 16 5h9L11 32H2ZM17 32 31 5h6L23 32h-6ZM32 32 45 5h2L35 32h-3Z" fill="currentColor"/><path d="M4 35h35" stroke="currentColor" stroke-width="1"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const action = (label,id,classes='secondary') => `<button class="${classes}" type="button" data-action="${id}">${label}${classes==='primary'?arrow:''}</button>`;
const rgb = hex => '#'+hex.toString(16).padStart(6,'0');
const padded = (n,places=2) => String(n).padStart(places,'0');

export function clock(seconds) {
  if (!Number.isFinite(seconds)) return '—:——.———';
  const ms=Math.max(0,Math.floor(seconds*1000));
  return `${padded(Math.floor(ms/60000))}:${padded(Math.floor(ms/1000)%60)}.${padded(ms%1000,3)}`;
}

function header(label, settings=true) {
  return `<header class="masthead"><div class="brand">${mark}<span>Corsa <i>di</i> Vetra</span></div>
    <div class="screen-id">${label}</div>${settings?action('Settings','settings','quiet'):''}</header>`;
}

function options(id,title,list,value) {
  return `<fieldset><legend>${title}</legend><div class="segmented">${list.map(([label,key])=>
    `<button type="button" data-option="${id}" data-value="${key}" aria-pressed="${String(value)===String(key)}">${label}</button>`
  ).join('')}</div></fieldset>`;
}

function volume(name,text,value) {
  return `<label class="slider"><span>${text}</span><input type="range" min="0" max="100" value="${Math.round(value*100)}" data-volume="${name}" aria-label="${text}"><output>${Math.round(value*100)}%</output></label>`;
}

function trackMap(course) {
  const sampled=course.points.filter((_,i)=>i%9===0);
  const x0=Math.min(...sampled.map(p=>p.x)), z0=Math.min(...sampled.map(p=>p.z));
  const x1=Math.max(...sampled.map(p=>p.x)), z1=Math.max(...sampled.map(p=>p.z));
  const scale=Math.min(166/(x1-x0),77/(z1-z0));
  const ox=(184-(x1-x0)*scale)/2, oz=(99-(z1-z0)*scale)/2;
  const at=(x,z)=>[(x-x0)*scale+ox,(z-z0)*scale+oz];
  const path=sampled.map((p,i)=>{
    const [x,z]=at(p.x,p.z);
    return (i?'L':'M')+x.toFixed(2)+','+z.toFixed(2);
  }).join(' ')+' Z';
  const finish=course.at(course.start);
  const [fx,fz]=at(finish.x,finish.z);
  return { at, path, fx,fz };
}

export class Interface {
  constructor(root, course, settings, bindings) {
    this.course=course;this.settings=settings;this.bindings=bindings;
    this.menu=document.createElement('section');this.menu.id='menu';this.menu.className='menu-layer';
    this.hud=document.createElement('section');this.hud.id='hud';this.hud.className='hud';this.hud.hidden=true;
    this.display=document.createElement('div');this.display.className='countdown';this.display.hidden=true;
    this.display.setAttribute('aria-live','polite');
    this.loading=document.createElement('section');this.loading.className='boot-screen';this.loading.setAttribute('role','status');
    this.loading.innerHTML=`<div class="boot-mark">${mark}<strong>Corsa di Vetra</strong></div>
      <progress max="100" value="1" aria-label="Loading circuit assets"></progress><span data-build-label>Building the circuit</span>`;
    root.append(this.menu,this.hud,this.display,this.loading);
    this.menu.addEventListener('click',e=>{
      const button=e.target.closest('button');
      if(!button) return;
      if(button.dataset.action) bindings.action(button.dataset.action);
      else if(button.dataset.option) bindings.option(button.dataset.option,button.dataset.value);
    });
    this.menu.addEventListener('input',e=>{
      const key=e.target.dataset.volume;
      if(!key) return;
      const value=Number(e.target.value);
      e.target.nextElementSibling.textContent=value+'%';
      bindings.volume(key,value/100);
    });
    this.map=trackMap(course);
    this.buildHud();
  }

  showLoading(progress,label) {
    this.loading.hidden=false;
    this.loading.querySelector('progress').value=progress;
    this.loading.querySelector('[data-build-label]').textContent=label;
  }

  buildHud() {
    const total=248;
    const track=`<path class="map-base" d="${this.map.path}"/><path class="map-line" d="${this.map.path}"/>`;
    const dots=Array.from({length:6},(_,i)=>`<circle data-map-car="${i}" r="${i===0?3.6:2.5}" class="${i===0?'map-player':'map-ai'}"/>`).join('');
    this.hud.innerHTML=`
      <div class="position instrument"><span class="hud-label">Position</span><div><strong data-position>01</strong><span class="divisor"> / 06</span></div></div>
      <div class="timing instrument">
        <div class="lap-reading"><span class="hud-label">Lap</span><strong data-lap>1</strong><span class="divisor" data-laps> / 3</span></div>
        <div class="times"><span>Lap time</span><b data-time>00:00.000</b><span>Best</span><b data-best>—</b></div>
      </div>
      <div class="map instrument"><span class="hud-label">Cala di Vetra</span>
        <svg viewBox="0 0 184 99" aria-label="Live circuit map" role="img">${track}
          <path class="map-finish" d="M${this.map.fx},${this.map.fz-4} v8"/>${dots}
        </svg>
      </div>
      <div class="dial instrument">
        <svg class="tach" viewBox="0 0 260 219" aria-label="RPM tachometer" role="img">
          <path class="tach-base" d="M55 193 A103 103 0 1 1 205 193" pathLength="${total}"/>
          <path class="tach-marks" d="M55 193 A103 103 0 1 1 205 193" pathLength="${total}"/>
          <path class="tach-value" d="M55 193 A103 103 0 1 1 205 193" pathLength="${total}" data-rpm/>
          <path class="tach-redline" d="M187 37 A103 103 0 0 1 228 151"/>
        </svg>
        <span class="gear" data-gear>1</span><strong class="speed" data-speed>0</strong><span class="speed-unit">km/h</span>
        <div class="boost"><span>Nitro</span><div class="nitro-track"><div data-nitro></div></div><strong data-nitro-value>100</strong><span>%</span></div>
      </div>`;
    this.instruments=Object.fromEntries(['position','lap','laps','time','best','gear','speed','rpm','nitro','nitro-value'].map(
      key=>[key,this.hud.querySelector('[data-'+key+']')]));
    this.dots=[...this.hud.querySelectorAll('[data-map-car]')];
  }

  hudFrame(race) {
    const p=race.player, hud=this.instruments;
    hud.position.textContent=padded(race.order.indexOf(0)+1);
    hud.lap.textContent=Math.min(race.laps,p.lap+1);
    hud.laps.textContent=' / '+race.laps;
    hud.time.textContent=clock(p.lapStarted?race.time-p.lapTime:0);
    hud.best.textContent=clock(p.bestLap);
    hud.gear.textContent=p.speed<-.15?'R':p.gear;
    hud.speed.textContent=Math.floor(Math.abs(p.speed)*3.6);
    hud.rpm.style.strokeDasharray=`${Math.min(248,Math.max(10,p.rpm/8100*248))} 248`;
    hud.nitro.style.transform=`scaleX(${p.nitro})`;
    hud['nitro-value'].textContent=Math.round(p.nitro*100);
    this.hud.classList.toggle('boosting',p.boosting);
    race.cars.forEach((car,i)=>{
      const xy=this.map.at(car.x,car.z);
      this.dots[i].setAttribute('cx',xy[0].toFixed(2));this.dots[i].setAttribute('cy',xy[1].toFixed(2));
    });
  }

  count(label='',intro=false) {
    if(this.display.textContent!==label) this.display.textContent=label;
    this.display.hidden=!label;
    this.display.classList.toggle('small',intro);
  }

  screen(name,data={}) {
    this.name=name;
    this.menu.dataset.screen=name;
    const s=this.settings;
    this.hud.hidden=!['race','intro','countdown','pause'].includes(name);
    if(!['intro','countdown','race'].includes(name)) this.count();
    if(name==='race'||name==='intro'||name==='countdown'){
      this.menu.hidden=true;
      return;
    }
    this.menu.hidden=false;
    let content='';
    switch(name) {
      case 'home':
        content=`${header('')}<div class="home-copy">
          <div class="circuit-caption"><span>Cala di Vetra</span><span>${(this.course.length/1000).toFixed(3)} km</span></div>
          <h1>Corsa<span>di</span><br>Vetra</h1>
          <div class="menu-actions">${action('Enter garage','garage','primary')}${action('Controls','controls','quiet')}</div>
          </div><footer class="home-foot"><span class="small-line"></span> Single-player race <span class="separator">/</span> 5 opponents</footer>`;
        break;
      case 'garage': {
        const c=MODELS[s.model];
        const paints=LIVERIES.map((l,i)=>`<button class="swatch" type="button" aria-label="${l.name} · ${l.number}" aria-pressed="${s.livery===i}" data-option="livery" data-value="${i}" style="--paint:${rgb(l.paint)};--accent:${rgb(l.accent)}"><span>${l.number}</span></button>`).join('');
        content=`${header('Garage')}<div class="panel garage-panel">
          <p class="kicker">${c.family}</p><h1>${c.name}</h1><p class="spec">${c.note}</p>
          <div class="model-nav">${action('‹  Previous','model-previous')}${action('Next  ›','model-next')}</div>
          <div class="livery"><span class="hud-label">Livery</span><strong>${LIVERIES[s.livery].name}</strong><div class="swatches">${paints}</div></div>
          <div class="menu-actions">${action('Race setup','setup','primary')}${action('Back','home','quiet')}</div></div>`;
        break;
      }
      case 'setup':
        content=`${header('Race setup')}<div class="panel setup-panel"><h1>Race setup</h1>
          <p class="spec">Cala di Vetra <span class="separator">/</span> 5 opponents</p>
          ${options('laps','Laps',[['3 laps',3],['6 laps',6]],s.laps)}
          ${options('difficulty','Difficulty',[['Easy','easy'],['Normal','normal'],['Hard','hard']],s.difficulty)}
          ${options('period','Time of day',[['Golden hour','golden'],['Night','night']],s.period)}
          ${options('quality','Graphics quality',[['Low','low'],['High','high']],s.quality)}
          <div class="menu-actions">${action('Start race','start','primary')}${action('Garage','garage','quiet')}</div></div>`;
        break;
      case 'pause':
        content=`<div class="dialog"><p class="kicker">Cala di Vetra</p><h1>Paused</h1><div class="stack">
          ${action('Resume','resume','primary')}${action('Restart race','restart')}${action('Settings','settings')}${action('Main menu','home')}</div></div>`;
        break;
      case 'settings':
        content=`<div class="dialog wide"><h1>Settings</h1>
          ${options('quality','Graphics quality',[['Low','low'],['High','high']],s.quality)}
          ${volume('master','Master volume',s.master)}${volume('sfx','Effects volume',s.sfx)}${volume('music','Music and menu ambience',s.music)}
          <div class="menu-actions">${action('Done','back','primary')}${action('Controls','controls','quiet')}</div></div>`;
        break;
      case 'controls':
        content=`<div class="dialog wide"><h1>Controls</h1><table class="control-table">
          <thead><tr><th scope="col">Action</th><th scope="col">Keyboard</th><th scope="col">Gamepad</th></tr></thead>
          <tbody>
          ${[
            ['Accelerate','W / ↑','RT'],['Brake or reverse','S / ↓','LT'],['Steer','A / D or ← / →','Left stick'],
            ['Mini-nitro','Shift','A / X / RB'],['Change camera','C','Y / Triangle'],['Pause','Esc','Start'],
          ].map(([name,key,pad])=>`<tr><th scope="row">${name}</th><td><kbd>${key}</kbd></td><td>${pad}</td></tr>`).join('')}
          </tbody></table><div class="menu-actions">${action('Back','back','primary')}</div></div>`;
        break;
      case 'results':
        content=`<div class="dialog results-dialog"><p class="kicker">Cala di Vetra <span class="separator">/</span> ${s.laps} laps</p>
          <h1>Race results</h1><table class="result-table"><thead><tr><th scope="col">Place</th><th scope="col">Driver</th><th scope="col">Finish time</th></tr></thead>
          <tbody>${data.rows.map((row,i)=>`<tr class="${row.id===0?'your-result':''}"><td>${padded(i+1)}</td><th scope="row"><span class="driver-number">${row.number}</span>${row.name}</th><td>${row.approx?'≈ ':''}${clock(row.time)}</td></tr>`).join('')}</tbody></table>
          <div class="result-best"><span class="hud-label">Best lap</span> ${clock(data.best)}</div>
          <div class="menu-actions">${action('Race again','restart','primary')}${action('Main menu','home','quiet')}</div></div>`;
        break;
    }
    this.menu.innerHTML=content;
  }
}
