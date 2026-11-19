import * as T from 'three';
import { materialShader } from './materials.js';
import { randomFrom } from './course.js';
import { branch, SceneryBatch, groundProp } from './scenery.js';
import { DIRECTIONS } from './pipeline.js';

const cell = (x,y,w,h) => [x,1-y-h,w,h];
const grassCells = [
  cell(.025,.034,.95,.109), cell(.020,.161,.95,.146), cell(.044,.333,.925,.149),
  cell(.018,.481,.95,.140),cell(.037,.613,.918,.075),cell(.021,.714,.900,.088),cell(.011,.834,.931,.113),
];
const needleCells = [cell(.312,.050,.447,.228),cell(.065,.313,.841,.285),cell(.043,.610,.906,.350)];
const leafCells = [[.011,.028,.966,.956]];
const shrubCells = [[.012,.478,.975,.482]];

class Blades {
  constructor() { this.pos=[]; this.uv=[]; this.nrm=[]; this.index=[]; }

  add(a,b,width,rect,center,bend=.07,twist=0) {
    const base = new T.Vector3(...a), tip = new T.Vector3(...b);
    const length = base.distanceTo(tip);
    const direction = tip.clone().sub(base).normalize();
    const side = new T.Vector3(direction.z, twist, -direction.x).normalize().multiplyScalar(width / 2);
    const normalUp = new T.Vector3(0,1,0);
    let k=this.pos.length/3;
    for (let i=0;i<=3;i++) {
      const t=i/3;
      const target=base.clone().lerp(tip,t).addScaledVector(normalUp,bend*Math.sin(t*Math.PI)*length);
      for (const j of [-1,1]) {
        const p=target.clone().addScaledVector(side,j*(1-.22*t));
        this.pos.push(p.x,p.y,p.z);
        this.uv.push(rect[0]+rect[2]*t,rect[1]+rect[3]*(j+1)/2);
        const radial=p.clone().sub(center);
        radial.y=radial.y*.58+.46;
        radial.normalize();
        this.nrm.push(radial.x,radial.y,radial.z);
      }
      if (i<3) this.index.push(k,k+1,k+2,k+1,k+3,k+2);
      k+=2;
    }
  }

  finish() {
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(this.pos,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(this.uv,2));
    g.setAttribute('normal',new T.Float32BufferAttribute(this.nrm,3));
    g.setIndex(this.index);
    return g;
  }
}

export class Flora {
  constructor(course,bank) {
    this.course=course;
    this.rng=randomFrom(course.config.seed+212);
    this.tick={value:0};
    this.light={value:DIRECTIONS.golden.clone()};
    this.transmission={value:.305};
    this.materials={};
    this.counts={ palm:0,pine:0,olive:0,cypress:0,shrub:0,grass:0 };
    this.bark=Object.fromEntries(['bark','pine','palm'].map(id=>[id,bank.surface(id,{ color:0xb2aa9d,name:id+' bark',roughness:.94 })]));
    Object.values(this.bark).forEach(mat=>{mat.userData.primary='bark';});
    for (const [species,map,colors] of [
      ['palm','grass',[0x739555,0x90a566,0x839258]],['olive','leaves',[0x7d8a64,0x899574,0x687252]],
      ['pine','needles',[0x728a52,0x88945e,0x5e7d4c]],['cypress','needles',[0x576e55,0x627d51,0x435b4a]],
      ['shrub','frond',[0x859750,0x8c8850,0x87a465]],['grass','grass',[0xb7a26e,0x8b9754,0xa6a25a]],
    ]) {
      this.materials[species]=colors.map((color,i)=>{
        const mat=bank.surface(map,{
          name:`${species} leaf layer ${i+1}`,color,roughness:1,alphaTest:species==='palm'?.185:.30,side:T.DoubleSide,
          normalScale:new T.Vector2(.35,.35),
        },{ao:false});
        mat.userData.primary='foliage';
        mat.userData.transmission=this.transmission;
        return materialShader(mat,'botanical-alpha-wind-translucency',shader=>{
          Object.assign(shader.uniforms,{ leafTime:this.tick, leafSun:this.light, sunTransmission:this.transmission });
          shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float leafTime;')
            .replace('#include <begin_vertex>',`
              #include <begin_vertex>
              float leafPhase=transformed.x*.087+transformed.z*.067;
              transformed.x+=sin(leafTime*1.76+leafPhase)*.055 + cos(leafTime*2.5+leafPhase*2.1)*.027;
              transformed.z+=sin(leafTime*1.22+leafPhase*1.2)*.038;
            `);
          shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`
              #include <common>
              uniform vec3 leafSun;
              uniform float sunTransmission;
            `).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=max(.86,roughnessFactor);')
            .replace('#include <emissivemap_fragment>',`
              #include <emissivemap_fragment>
              vec3 viewSun=normalize(mat3(viewMatrix)*leafSun);
              float optical=pow(clamp(dot(-normalize(vViewPosition),viewSun),0.0,1.0),1.49);
              float thinLeaf=.27+.73*max(0.0,-dot(normal,viewSun));
              totalEmissiveRadiance+=diffuseColor.rgb*vec3(1.59,.93,.41)*thinLeaf*optical*sunTransmission;
            `);
        });
      });
    }
  }

  update(time,period) {
    this.tick.value=time;
    this.light.value.copy(DIRECTIONS[period]);
    this.transmission.value=period==='golden'?.71:.035;
  }

  plant(batch,s,lateral,species,scale=1,shadow=true) {
    const rng=this.rng;
    const wood=species!=='grass' && species!=='shrub';
    const radius=wood ? (species==='olive'?.42:.24)*scale : 0;
    const p=groundProp(this.course,s,lateral,radius,{kind:'trunk',height:8*scale,species});
    if (!p || p.y<.19) return;
    const rotation=SceneryBatch.yaw(p.x,p.y-.015,p.z,rng()*Math.PI*2);
    const mat=this.materials[species][Math.floor(rng()*3)];
    const blades=new Blades();
    const add=(a,b,w,rect,center,bend,twist)=>blades.add(a,b,w,rect,center,bend,twist);
    const pick=options=>options[Math.floor(rng()*options.length)];
    const stalk=(a,b,r,r2,mat,sides=8)=>batch.add(branch(a,b,r,r2,sides),mat,rotation,shadow && wood);
    if (species==='palm') {
      const h=scale*(6.4+rng()*2.9);
      const lean=(rng()-.29)*1.14, tilt=(rng()-.42)*.65;
      const trunk=(t)=>[lean*t*t,h*t,tilt*t*t];
      for (let i=0;i<8;i++) {
        const t=i/8;
        stalk(trunk(t),trunk(t+.125),scale*(.235-.105*t),scale*(.235-.105*(t+.125)),this.bark.palm,10);
      }
      const center=new T.Vector3(lean,h,tilt);
      for (let i=0;i<18;i++) {
        const angle=i*Math.PI*2/18 + rng()*.25;
        const length=scale*(2.10+rng()*1.55);
        const wave=.29+rng()*.41;
        const path=t=>[lean+Math.cos(angle)*length*t, h+length*(wave*Math.sin(t*2.55)-.44*t*t),tilt+Math.sin(angle)*length*t];
        for (let j=0;j<4;j++) stalk(path(j/4),path((j+1)/4),.029*(1-j/4)*scale,.019*(1-j/4)*scale,this.bark.palm,5);
        for (let j=1;j<=14;j++) {
          const t = .05+j*.061;
          const base=path(t);
          for (const side of [-1,1]) {
            const spread=length*(.14+.23*Math.sin(t*Math.PI))*(.87+rng()*.26);
            const dir=angle+side*(.44+1.035*(1-t));
            const end=[base[0]+Math.cos(dir)*spread,base[1]-spread*(.085+t*.24),base[2]+Math.sin(dir)*spread];
            add(base,end,scale*(.48-.20*t),pick(grassCells),center,.20,.26*side);
          }
        }
      }
    } else if (species==='pine' || species==='olive' || species==='cypress') {
      const pine=species==='pine', olive=species==='olive', cypress=species==='cypress';
      const h=scale*(pine?8.1:olive?5.0:10.2), radius=scale*(pine?3.7:olive?2.7:1.31);
      const stem=[(rng()-.5)*.9*scale,h*.65,(rng()-.5)*.85*scale], bark=pine?this.bark.pine:this.bark.bark;
      stalk([0,-.03,0],[stem[0]*.34,h*.34,stem[2]*.34],(olive?.36:.23)*scale,.18*scale,bark,9);
      stalk([stem[0]*.34,h*.34,stem[2]*.34],stem,.18*scale,.125*scale,bark,8);
      stalk(stem,[stem[0]*1.63,h*.98,stem[2]*1.46],.119*scale,.040*scale,bark,7);
      const count=cypress?17:pine?10:12;
      for (let i=0;i<count;i++) {
        const th=(i*2.399957)+(rng()-.5)*.36;
        const factor=(i+.5)/count;
        const dist=radius*(cypress ? Math.sin(Math.PI*(.22+.76*factor)) : (.58+rng()*.43));
        const crownY=h*(cypress?.25+.75*factor:pine?.82+rng()*.18:.56+rng()*.44);
        const tip=[stem[0]+Math.cos(th)*dist,crownY,stem[2]+Math.sin(th)*dist];
        const joint=[stem[0]+Math.cos(th)*dist*.48,cypress?crownY-h*.05:crownY-h*.15,stem[2]+Math.sin(th)*dist*.48];
        const origin=[stem[0]*(cypress?factor:.83),cypress?crownY-h*.084:h*(.47+rng()*.26),stem[2]*.82];
        stalk(origin,joint,scale*(cypress?.039:.085),.039*scale,bark,6);
        stalk(joint,tip,.039*scale,.012*scale,bark,5);
        const center=new T.Vector3(stem[0], cypress?crownY:h*.77, stem[2]);
        for (let j=0;j<(cypress?9:12);j++) {
          const phi=th+(rng()-.5)*4.18;
          const at=joint.map((v,k)=>v+(tip[k]-v)*(.48+rng()*.53));
          at[1]+=(rng()-.36)*scale*(cypress?.87:pine?.67:1.08);
          const length=scale*(cypress?1.22:pine?2.16:1.59)*(.53+rng()*.52);
          const end=[at[0]+Math.cos(phi)*length,at[1]+(rng()-.33)*length*.76,at[2]+Math.sin(phi)*length];
          add(at,end,length*(olive?.78:.72),pick(olive?leafCells:needleCells),center,.16,(rng()-.5)*.87);
        }
      }
    } else {
      const grassy=species==='grass';
      const center=new T.Vector3(0,0,0);
      for(let i=0;i<(grassy?15:32);i++){
        const phi=i*2.399957+rng()*.42, length=scale*(.19+rng()*.70);
        const a=[(rng()-.5)*scale*.36,rng()*scale*.12,(rng()-.5)*scale*.36];
        const rise=scale*(grassy?.31+rng()*.61:.37+rng()*.67);
        const b=[Math.cos(phi)*length+a[0],rise,Math.sin(phi)*length+a[2]];
        add(a,b,length*(grassy?.21:.71),pick(grassy?grassCells:shrubCells),center,.48,(rng()-.5)*1.22);
      }
    }
    batch.add(blades.finish(),mat,rotation,shadow && wood);
    this.counts[species]++;
  }
}
