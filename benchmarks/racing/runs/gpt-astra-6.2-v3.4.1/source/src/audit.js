import * as T from 'three';

export function sceneAudit(scene,track,cars) {
 const ids=new Map(),materials=new Set(),primitiveProblems=[],geometryKinds=new Map();
 scene.traverse(o=>{
   if(!o.isMesh)return;
   for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);
   for(const item of o.userData.entities||[]){if(item.infrastructure||item.s===undefined)continue;ids.set(item.id,item);
     if(!geometryKinds.has(item.id))geometryKinds.set(item.id,new Set());geometryKinds.get(item.id).add(o.geometry.uuid);}
 });
 const entities=[...ids.values()],windows=[],props=[],issues=[];
 const group=(list,k)=>list.filter(o=>o.kind===k).length;
 const fullTown=entities.filter(e=>e.kind==='house'&&e.zone==='vila'&&Math.abs(e.l)<30),species=[...new Set(entities.filter(o=>o.kind==='tree').map(o=>o.species))];
 for(const z of track.zones.slice(2))for(let s=z.s;s<z.end;s+=100){
   const end=Math.min(z.end,s+100),length=end-s,complete=length>99.999,forest=z.id==='bosque';
   const exStart=Math.max(s,track.bridge.start),exEnd=Math.min(end,track.bridge.end),excluded=forest?Math.max(0,exEnd-exStart):0,plantable=length-excluded;
   const list=entities.filter(o=>o.s>=s&&o.s<end&&Math.abs(o.l)<=(forest?40:30));
   const row={zone:z.id,start:s,end,complete,eligibleMetres:plantable,L:plantable,f:plantable/100,excluded:excluded?[{geometry:'bridge deck, track.json',start:exStart,end:exEnd}]:[],
     fronts:list.filter(o=>o.urban&&o.kind==='house').length,trees:group(list,'tree'),shrubs:group(list,'shrub'),cover:group(list,'cover'),
     species:[...new Set(list.filter(o=>o.species).map(o=>o.species))],uniqueInstances:list.map(o=>o.id),
     quota:forest?{trees:Math.ceil(16*plantable/100-1e-8),shrubs:Math.ceil(10*plantable/100-1e-8),cover:Math.ceil(12*plantable/100-1e-8)}:{fronts:12}};
   if(complete)for(const [k,q] of Object.entries(row.quota))if(row[k]<q)issues.push(z.id+' '+Math.round(s)+' '+k+' = '+row[k]+' / '+q);
   windows.push(row);
 }
 for(let s=0;s<track.length;s+=100){const end=Math.min(s+100,track.length),list=entities.filter(o=>o.s>=s&&o.s<end&&o.kind==='prop');
   props.push({from:s,to:end,count:list.length});if(end-s>99.9&&list.length<12)issues.push('Props at '+s+' = '+list.length);}
 if(fullTown.length<60||new Set(fullTown.map(o=>o.variant)).size<5||species.length<4)issues.push('Insufficient buildings or species');
 for(const h of fullTown)if((geometryKinds.get(h.id)?.size||0)<2)primitiveProblems.push(h.id);
 const renderCars=cars.map(c=>{let triangles=0,meshes=0;const cm=new Set();
   c.root.traverse(o=>{if(!o.isMesh||o===c.root)return;meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;cm.add(o.material.uuid);});
   return {name:c.root.name,lod0Triangles:triangles,materials:cm.size,meshes};});
 if(renderCars.some(c=>c.lod0Triangles<15000||c.materials<6||c.meshes<2))issues.push('Car mesh/material audit');
 const problems=[];
 for(const m of materials){if(m.isShaderMaterial||m.emissiveIntensity>0&&m.emissive?.getHex()>0||m.name==='Vidro fumê')continue;
   if(!m.map&&!m.normalMap)problems.push('Flat material '+m.name);
   for(const tex of [m.map,m.normalMap,m.roughnessMap,m.alphaMap].filter(Boolean)){
     const im=tex.image;if(im&&Math.min(im.width,im.height)<1024)problems.push('Small texture '+tex.name);}
 }
 if(primitiveProblems.length||problems.length)issues.push(...primitiveProblems,...new Set(problems));
 return {length:track.length,zones:track.zones,bridge:track.bridge,units:fullTown.length,architecturalVariants:new Set(fullTown.map(o=>o.variant)).size,treeSpecies:species,
   objects:entities.length,cars:renderCars,windows,props,issues,instances:entities.map(({id,kind,s,l,species,variant,x,y,z})=>({id,kind,s,l,species,variant,x,y,z}))};
}
export function photographSky(renderer,scene,camera,dome,hud) {
 const w=256,h=144,target=new T.WebGLRenderTarget(w,h),data=new Uint8Array(w*h*4);
 const bg=scene.background,old=renderer.getRenderTarget(),clear=renderer.getClearColor(new T.Color()),alpha=renderer.getClearAlpha();
 dome.visible=false;scene.background=new T.Color(0xff00ff);renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,w,h,data);
 const mask=document.createElement('canvas');mask.width=w;mask.height=h;const ctx=mask.getContext('2d');ctx.drawImage(hud,0,0,w,h);const overlay=ctx.getImageData(0,0,w,h).data;
 let sky=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=4*(y*w+x);if(data[i]>251&&data[i+1]<4&&data[i+2]>251)sky+=1-overlay[4*((h-1-y)*w+x)+3]/255;}
 renderer.setRenderTarget(old);scene.background=bg;dome.visible=true;renderer.setClearColor(clear,alpha);target.dispose();
 return sky/(w*h);
}
