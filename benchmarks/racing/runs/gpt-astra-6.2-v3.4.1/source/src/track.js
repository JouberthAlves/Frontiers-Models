import * as T from 'three';
import Delaunator from 'delaunator';

export const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
export const mix = (a,b,t) => a+(b-a)*t;
export const mod = (v,n) => (v % n + n) % n;
export const wrapAngle = a => Math.atan2(Math.sin(a),Math.cos(a));
export function smooth(a,b,v) { const t=clamp((v-a)/(b-a),0,1); return t*t*(3-2*t); }
export function random(seed) { return () => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; }; }
const up = new T.Vector3(0,1,0);
export class Circuit {
  constructor(data) {
    this.data=data;
    const controls=data.points.map(p=>new T.Vector3(p[0],p[1],p[2]));
    const spline=new T.CatmullRomCurve3(controls,true,'centripetal');
    spline.arcLengthDivisions=controls.length*180;
    const lengths=spline.getLengths(spline.arcLengthDivisions);
    this.length=lengths.at(-1);
    this.controlS=controls.map((v,i)=>lengths[i*180]);
    this.n=Math.ceil(this.length/data.stationSpacing);
    this.step=this.length/this.n;
    this.stations=Array.from({length:this.n},(_,i)=>{
      const s=i*this.step, u=spline.getUtoTmapping(i/this.n), pos=spline.getPoint(u), tan=spline.getTangent(u);
      const k=Math.min(controls.length-1,Math.floor(u*controls.length)), f=u*controls.length-k;
      const p=data.points[k], q=data.points[(k+1)%controls.length];
      const h=Math.hypot(tan.x,tan.z), tx=tan.x/h,tz=tan.z/h;
      return {s,x:pos.x,y:pos.y,z:pos.z,tx,tz,rx:-tz,rz:tx,heading:Math.atan2(tx,-tz),
        width:mix(p[3],q[3],f),bank:Math.tan(mix(p[4],q[4],f)*Math.PI/180),grade:tan.y/h};
    });
    this.stations.forEach((p,i)=>{p.curve=wrapAngle(this.stations[(i+1)%this.n].heading-this.stations[mod(i-1,this.n)].heading)/(2*this.step);});
    this.zones=data.zones.map((z,i)=>({...z,s:this.controlS[z.start],end:i+1<data.zones.length?this.controlS[data.zones[i+1].start]:this.length}));
    const start=this.controlS[data.bridge.fromControl]+data.bridge.offset;
    this.bridge={start,end:start+data.bridge.length};
    this.checkpoints=Array.from({length:data.checkpointCount},(_,i)=>({id:i,s:this.length*i/data.checkpointCount,l:0}));
    this.objects=[];
    this.terrain=this.makeTerrain();
  }
  zone(s) { s=mod(s,this.length); return this.zones.find(z=>s>=z.s&&s<z.end)||this.zones[0]; }
  onBridge(s) { return s>=this.bridge.start && s<=this.bridge.end; }
  frame(s) {
    const v=mod(s,this.length)/this.step, i=Math.floor(v), a=this.stations[i%this.n], b=this.stations[(i+1)%this.n], t=v-i;
    const heading=a.heading+wrapAngle(b.heading-a.heading)*t,tx=Math.sin(heading),tz=-Math.cos(heading);
    return {s:mod(s,this.length),x:mix(a.x,b.x,t),z:mix(a.z,b.z,t),y:mix(a.y,b.y,t),tx,tz,rx:-tz,rz:tx,
      heading,width:mix(a.width,b.width,t),grade:mix(a.grade,b.grade,t),curve:mix(a.curve,b.curve,t),bank:mix(a.bank,b.bank,t)};
  }
  point(s,l=0,y=0) { const f=this.frame(s);return new T.Vector3(f.x+f.rx*l,f.y+f.bank*l+y,f.z+f.rz*l); }
  nearest(x,z) {
    let best=Infinity, coarse=0;
    const a=this.stations,n=this.n;
    for(let i=0;i<n;i+=10){const p=a[i],d=(x-p.x)**2+(z-p.z)**2;if(d<best){best=d;coarse=i;}}
    let s=0; best=Infinity;
    for(let j=-11;j<=11;j++){
      const i=mod(coarse+j,n),p=a[i],q=a[(i+1)%n],dx=q.x-p.x,dz=q.z-p.z;
      const t=clamp(((x-p.x)*dx+(z-p.z)*dz)/(dx*dx+dz*dz),0,1);
      const d=(x-p.x-t*dx)**2+(z-p.z-t*dz)**2;
      if(d<best){best=d;s=(i+t)*this.step;}
    }
    const f=this.frame(s),l=(x-f.x)*f.rx+(z-f.z)*f.rz;
    return {f,s:f.s,l,d:Math.sqrt(best)};
  }
  shoreX(z) {
    const p=this.stations[0], cliff=this.data.points[this.zones[1].start];
    return p.x-36+7*Math.sin((z-p.z)*0.016)+4*Math.sin((z+67)*0.034)
      + smooth(cliff[2]+14,cliff[2]-225,z)*78 + smooth(cliff[2]-150,cliff[2]-630,z)*160;
  }
  earth(x,z,near=this.nearest(x,z)) {
    const {f,l,d}=near, distance=d-f.width/2;
    const apron=f.y+l*f.bank-0.035;
    const shore=x-this.shoreX(z);
    const n=Math.sin(x*.023+z*.012)*Math.cos(z*.020-x*.008)+.42*Math.sin(x*.063-z*.033);
    const beach=shore*.123 + n*.19*smooth(1,18,Math.abs(shore));
    const rockZone=smooth(-360,-530,z);
    let sum=0, elevation=0;
    for(const c of this.data.points){const w=1/((x-c[0])**2+(z-c[2])**2+1100)**1.65;sum+=w;elevation+=w*c[1];}
    const base=mix(f.y,elevation/sum,smooth(15,78,d));
    const upland=base-1.3+Math.min(58,d*.17)*(0.45+n*.40)+n*2.1+Math.min(45,d*.13)*smooth(500,740,x);
    let natural=mix(beach,upland,smooth(9,54+rockZone*13,shore));
    natural-=smooth(-580,-765,z)*48;
    natural-=smooth(530,960,z)*16;
    const bridge=this.bridge;
    if(f.s>bridge.start-28 && f.s<bridge.end+28) {
      const cut=smooth(bridge.start-28,bridge.start+4,f.s)*(1-smooth(bridge.end-4,bridge.end+28,f.s));
      natural-=cut*13;
    }
    const head=this.data.points[11],ox=this.stations[0].x;
    const ridge=(cx,cz,wx,wz,h,phase)=>{const q=((x-cx)/wx)**2+((z-cz)/wz)**2;
      return h*(1-q)+Math.min(1,Math.max(0,1.4-q))*(9*Math.sin(x*.020+phase)+6*Math.cos(z*.039+x*.009)+4*Math.sin(x*.058-z*.037));};
    const rockyLand=Math.max(ridge(ox-104,head[2]-265,393,115,83,1.8),ridge(ox-367,head[2]-463,488,126,112,3.2),ridge(ox-906,head[2]+256,115,309,53,.7));
    const deckCut=9.6*smooth(bridge.start,bridge.start+5,f.s)*(1-smooth(bridge.end-5,bridge.end,f.s));
    const village=this.zones[2],urban=smooth(village.s-19,village.s+12,f.s)*(1-smooth(village.end-8,village.end+22,f.s));
    return mix(apron,Math.max(natural,rockyLand),smooth(0,13,distance)*mix(1,smooth(17,41,distance),urban))-deckCut*(1-smooth(4,18,distance));
  }
  makeTerrain() {
    const pts=[], colors=[], uvs=[], all=[], keys=new Set();
    const add=(x,z,y,near)=>{
      const key=Math.round(x*256)+','+Math.round(z*256);if(keys.has(key))return;keys.add(key);
      const r=near||this.nearest(x,z); const height=y??this.earth(x,z,r);
      all.push([x,z]);pts.push(x,height,z);uvs.push(x/5.8,z/5.8);
      const shore=x-this.shoreX(z);
      const cliff=smooth(-370,-530,z)*smooth(10,34,shore);
      const green=smooth(12,78,shore)*(1-.82*cliff);
      const noise=.5+.24*Math.sin(x*.100+z*.075)+.16*Math.sin(x*.24-z*.11);
      const c=new T.Color().setRGB(mix(.69,.18,green)+noise*.054,mix(.49,.235,green)+noise*.05,mix(.29,.099,green)+noise*.035);
      c.lerp(new T.Color(.34,.27,.205),cliff*.77);
      const wet=1-smooth(0,8,Math.abs(shore));c.multiplyScalar(1-.38*wet);
      colors.push(c.r,c.g,c.b);
    };
    for(let i=0;i<this.n;i++){
      const f=this.stations[i];
      for(const l of [-14,-9,-f.width/2,0,f.width/2,9,14]){
        const x=f.x+f.rx*l,z=f.z+f.rz*l,r={f,l,d:Math.abs(l)};
        add(x,z,this.earth(x,z,r),r);
      }
    }
    const grid=(range,step,cut)=>{
      for(let z=range[2];z<=range[3];z+=step)for(let x=range[0];x<=range[1];x+=step){
        if(cut?.(x,z))continue;
        const near=this.nearest(x,z);if(near.d>16)add(x,z,undefined,near);
      }
    };
    grid([-120,630,-690,600],9);
    grid([-950,1570,-1790,1590],40,(x,z)=>x>=-120&&x<=630&&z>=-690&&z<=600);
    const tri=Delaunator.from(all).triangles;
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(pts,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));
    const idx=Array.from(tri);
    const a=idx[0]*3,b=idx[1]*3,c=idx[2]*3;
    if((pts[b+2]-pts[a+2])*(pts[c]-pts[a])-(pts[b]-pts[a])*(pts[c+2]-pts[a+2])<0)for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    geo.setIndex(idx);geo.computeVertexNormals();
    const bins=new Map(), cell=24;
    for(let i=0;i<idx.length;i+=3){
      const aa=idx[i]*3,bb=idx[i+1]*3,cc=idx[i+2]*3;
      const xs=[pts[aa],pts[bb],pts[cc]],zs=[pts[aa+2],pts[bb+2],pts[cc+2]];
      for(let iz=Math.floor(Math.min(...zs)/cell);iz<=Math.floor(Math.max(...zs)/cell);iz++)for(let ix=Math.floor(Math.min(...xs)/cell);ix<=Math.floor(Math.max(...xs)/cell);ix++){
        const k=ix+','+iz;if(!bins.has(k))bins.set(k,[]);bins.get(k).push(i);
      }
    }
    const cast=(x,z)=>{
      const list=bins.get(Math.floor(x/cell)+','+Math.floor(z/cell))||[];
      for(const i of list){
        const a=idx[i]*3,b=idx[i+1]*3,c=idx[i+2]*3;
        const ax=pts[a],az=pts[a+2],bx=pts[b],bz=pts[b+2],cx=pts[c],cz=pts[c+2];
        const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);
        if(Math.abs(den)<1e-12)continue;
        const u=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,v=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den;
        if(u>=-.00001&&v>=-.00001&&u+v<=1.00001)return u*pts[a+1]+v*pts[b+1]+(1-u-v)*pts[c+1];
      }
      return NaN;
    };
    return {geometry:geo,cast};
  }
  surface(s,l=0) {
    const f=this.frame(s);
    if(Math.abs(l)<=f.width/2+(this.onBridge(f.s)?.98:0)) return f.y+f.bank*l;
    return this.terrain.cast(f.x+f.rx*l,f.z+f.rz*l);
  }
  roadGeometry(left,right,elevation=0,from=0,to=this.length,spacing=this.step) {
    const pos=[],uv=[],idx=[],n=Math.ceil((to-from)/spacing);
    for(let i=0;i<=n;i++){
      const s=mix(from,to,i/n),f=this.frame(s);
      for(const fn of [left,right]){
        const l=typeof fn==='function'?fn(f):fn;
        pos.push(f.x+f.rx*l,f.y+f.bank*l+elevation,f.z+f.rz*l);uv.push(l/6,s/6);
      }
      if(i<n){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
  }
  quaternion(s) {
    const f=this.frame(s),ahead=new T.Vector3(f.tx,f.grade,f.tz).normalize(),right=new T.Vector3(f.rx,f.bank,f.rz).normalize();
    const normal=new T.Vector3().crossVectors(right,ahead).normalize();right.crossVectors(ahead,normal).normalize();
    return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(right,normal,ahead.negate()));
  }
  validateWorld() {
    const errors=[], record=(s)=>{if(errors.length<24)errors.push(s);};
    let maxRise=-Infinity,maxGap=0,minRadius=Infinity,maxGrade=0,maxBank=0;
    for(const p of this.stations){
      maxBank=Math.max(maxBank,Math.abs(Math.atan(p.bank)*180/Math.PI));maxGrade=Math.max(maxGrade,Math.abs(p.grade));minRadius=Math.min(minRadius,1/Math.max(.000001,Math.abs(p.curve)));
      for(const a of [-1,-.5,0,.5,1]) {
        const l=a*p.width/2,x=p.x+p.rx*l,z=p.z+p.rz*l,ground=this.terrain.cast(x,z),delta=ground-(p.y+p.bank*l);
        if(!Number.isFinite(ground))record('Missing terrain at '+p.s);
        maxRise=Math.max(maxRise,delta);if(Math.abs(a)===1)maxGap=Math.max(maxGap,this.onBridge(p.s)?Math.abs(this.surface(p.s,l)-(p.y+p.bank*l)):Math.abs(delta));
      }
    }
    if(maxRise>.02||maxGap>.15)record('Road seam outside tolerance');
    if(minRadius<25||maxGrade>.14||maxBank>12)record('Undrivable curve or slope');
    if(this.checkpoints.some((p,i)=>p.id!==i||p.s<0||Math.abs(p.l)>this.frame(p.s).width/2||(i&&p.s<=this.checkpoints[i-1].s)))record('Invalid checkpoint sequence');
    const homes=[];
    for(const o of this.objects){
      const near=this.nearest(o.x,o.z);
      if(near.d-o.radius<near.f.width/2+3-.02)record(o.id+' intrudes on verge');
      const y=this.terrain.cast(o.x,o.z);if(!Number.isFinite(y)||(o.kind!=='rock'&&Math.abs(o.y-y)>.30))record(o.id+' base height');
      if(o.kind==='house'){
        for(const h of homes)if(footprintsOverlap(o,h))record(o.id+' overlaps '+h.id);
        homes.push(o);
      }
    }
    return {ok:!errors.length,errors,length:this.length,stations:this.n,minRadius,maxGrade,maxBank,maxTerrainAboveRoad:maxRise,maxEdgeGap:maxGap,objects:this.objects.length};
  }
}
export function footprintsOverlap(a,b) {
  if(Math.hypot(a.x-b.x,a.z-b.z)>a.radius+b.radius)return false;
  const vectors=o=>[[Math.cos(o.yaw),-Math.sin(o.yaw)],[Math.sin(o.yaw),Math.cos(o.yaw)]];
  const av=vectors(a),bv=vectors(b),dot=(p,q)=>p[0]*q[0]+p[1]*q[1];
  for(const axis of [...av,...bv]){
    const half=(o,v)=>Math.abs(dot(axis,v[0]))*o.w/2+Math.abs(dot(axis,v[1]))*o.d/2;
    if(Math.abs(dot(axis,[a.x-b.x,a.z-b.z]))>=half(a,av)+half(b,bv))return false;
  }
  return true;
}
