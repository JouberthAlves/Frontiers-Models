import * as T from 'three';
import {V,part,pack,patch,bar,ellipsoid} from './art.js';
import {box,canvasSign} from './scenery.js';
import {random} from './track.js';

const wallTints=[0xe6c99c,0xe6a17f,0xd4d7b7,0xc7d8d0,0xf2dfb6,0xbba48e,0xdcb28c,0xebcf9c];
const shutters=[0x485b50,0x4f6664,0x53676b,0x584c3b,0x5f7161,0x364e50,0x77604d,0x4a6976];
const names=['Casa do Cais','Mercearia','Café Maré','Pensão Lume','Padaria','Oficina','Livraria','Mercado'];
export function building(art,variant){
 const root=new T.Group(),rng=random(7000+variant*529),m=art.material;
 const w=6.5+(variant%4)*.69,d=5.6+(variant%3)*.77,floors=variant===3||variant===6?3:2,h=floors*2.88+.35,z=d*.5;
 const wall=m(variant===5?'stone':'plaster',wallTints[variant],.94),trim=m('plaster',0xf1dfbe,.85),rock=m('stone',0xa29880,.95),tile=m('tiles',variant%2?0xb37654:0xa16147,.91),green=m('timber',shutters[variant],.83);
 const dark=m('timber',0x574437,.85),steel=m('finish',0x424b46,.57,.52),glass=m('finish',0x486367,.27,.39),inside=m('plaster',0x393b36,.94);
 const facade=(x,y,ww,hh,mat=wall,zz=z,dd=.22)=>box(root,x,y,zz,ww,hh,dd,mat);
 box(root,0,h/2-.60,-.14,w,h+1.2,d-.31,wall);
 facade(0,-.16,w+.20,.53,rock,z+.03,.35);
 const bays=variant===0||variant===5?2:3,bw=w/bays,opening=1.07;
 for(let level=0;level<floors;level++){
   const y=level*2.88+.14,lintel=y+2.31;
   for(let j=0;j<bays;j++){
     const x=-w/2+bw*(j+.5),isDoor=level===0&&j===(variant%2?bays-1:0),bottom=isDoor?y:y+.85;
     const ow=isDoor?1.10:opening,top=lintel;
     for(const s of [-1,1])facade(x+s*(bw+ow)/4,y+1.45,(bw-ow)/2+.012,2.9);
     facade(x,(top+y+2.90)/2,ow+.012,y+2.90-top);
     if(!isDoor)facade(x,(y+bottom)/2,ow+.012,bottom-y);
     facade(x,(top+bottom)/2,ow,top-bottom,isDoor?dark:glass,z+.004,.05);
     for(const s of [-1,1]){
       facade(x+s*(ow/2+.037),(top+bottom)/2,.082,top-bottom+.15,trim,z+.13,.10);
       if(!isDoor){facade(x+s*(ow*.5+.235),(top+bottom)/2,.33,top-bottom+.035,green,z+.113,.107);
         for(let l=0;l<4;l++)facade(x+s*(ow*.5+.235),bottom+.23+l*.27,.276,.025,dark,z+.174,.035);}
     }
     facade(x,top+.047,ow+.23,.12,trim,z+.16,.16);facade(x,bottom-.003,ow+.29,.109,trim,z+.175,.26);
     if(isDoor){
       for(let k=0;k<3;k++)facade(x,bottom+.44+k*.54,.77,.37,dark,z+.066,.046);
       ellipsoid(root,x+.34,bottom+1.04,z+.127,.045,.039,.045,steel,10);
       for(let k=0;k<2;k++)box(root,x,.03+k*.078,z+.33-k*.13,1.43-k*.12,.106,.49-k*.09,rock);
     }else{
       facade(x,(top+bottom)/2,.041,top-bottom,green,z+.075,.044);facade(x,top-.31,ow,.042,green,z+.075,.044);
       if(level===1 && (j+variant)%2===0){
         const bz=z+.60;box(root,x,bottom-.04,bz,1.60,.17,.85,trim);
         for(let k=0;k<7;k++)bar(root,V(x-.73+k*.245,bottom,bz+.37),V(x-.73+k*.245,bottom+.72,bz+.37),.016,steel,5);
         bar(root,V(x-.78,bottom+.74,bz+.37),V(x+.78,bottom+.74,bz+.37),.028,steel,6);
         for(const s of [-1,1])bar(root,V(x+s*.76,bottom+.73,bz+.37),V(x+s*.76,bottom+.73,z+.12),.024,steel,6);
       }
     }
   }
   facade(0,y+2.78,w+.13,.10,trim,z+.08,.33);
 }
 for(const sign of [-1,1]){
   for(let j=0;j<2;j++)for(let k=0;k<floors;k++){
     const cx=sign*(w/2+.018),yy=.20+1.55+k*2.88,zz=-d*.25+j*d*.48;
     box(root,cx,yy,zz,.095,1.4,1.02,trim);box(root,cx+sign*.055,yy,zz,.035,1.20,.86,glass);
     box(root,cx+sign*.075,yy-.1,zz,.039,.039,.86,green);
   }
 }
 const rise=1.02+(variant%3)*.27,over=.35;
 for(const sign of [-1,1]){
   const roof=patch(40,12,(u,v)=>{const x=(u-.5)*(w+2*over),zz=sign*(z+over)*v;
     return V(x,h+rise*(1-v)+.044*Math.cos(u*2*Math.PI*24),zz);},sign<0);
   const roofUV=roof.attributes.uv;for(let i=0;i<roofUV.count;i++)roofUV.setXY(i,roofUV.getX(i)*2.6,roofUV.getY(i)*1.4);
   const roofM=tile;roofM.side=T.DoubleSide;part(root,roof,roofM);
   box(root,0,h-.015,sign*(z+over-.02),w+over*2,.137,.12,dark);
 }
 for(const side of [-1,1]){
   const geo=patch(2,8,(u,v)=>V(side*w/2,h+rise*(1-Math.abs(2*u-1))*v,(u-.5)*d),side<0);wall.side=T.DoubleSide;part(root,geo,wall);
 }
 bar(root,V(-w*.5-over,h+rise,0),V(w*.5+over,h+rise,0),.105,tile,10);
 box(root,w*.27,h+rise*.83,-d*.21,.53,1.04,.51,rock);box(root,w*.27,h+rise*.83+.54,-d*.21,.68,.13,.65,trim);
 if(variant%3!==0){
   const aw=m('plaster',variant%2?0x9f6346:0x627e74,.85),width=w*.71;
   for(let i=0;i<8;i++){
     const x=(i-3.5)*width/8,g=patch(2,5,(u,v)=>V(x+(u-.5)*width/8,2.81-.29*v-.08*v*v,z+.11+.90*v));const cloth=i%2?aw:trim;cloth.side=T.DoubleSide;part(root,g,cloth);
     box(root,x,2.34,z+.99,width/8,.19,.025,cloth);
   }
   const sign=canvasSign(names[variant],'#324b46','#f0dfbc',{size:228,stretch:1.5});part(root,new T.PlaneGeometry(w*.66,.48),sign,0,3.22,z+.156);
 }
 pack(root);return {root,w,d,h:h+rise};
}
export function bellTower(art){
 const g=new T.Group(),m=art.material,warm=m('plaster',0xf1d3a4,.92),stone=m('stone',0xdac8a6,.95),roof=m('tiles',0xb56d47,.86),iron=m('finish',0x69573c,.65,.69);
 box(g,-3,4.0,-3,9.5,9.0,12,stone);
 for(const sign of [-1,1]){
   const p=patch(6,3,(u,v)=>V(-3+sign*u*5.12,10.28-u*2.03,-9.5+v*13.0),sign===-1);roof.side=T.DoubleSide;part(g,p,roof);
 }
 box(g,3.4,7.5,0,3.95,15.8,4.0,warm);
 for(const y of [1.1,8.0,13.8,15.2])box(g,3.4,y,0,4.25,.27,4.3,stone);
 for(const x of [1.84,4.96])for(const z of [-1.56,1.56])box(g,x,17.02,z,.81,3.69,.82,stone);
 for(const z of [-1.9,1.9]){
   const arch=new T.Shape();arch.absarc(0,0,1.48,0,Math.PI,false);arch.lineTo(-1.08,0);arch.absarc(0,0,1.08,Math.PI,0,true);arch.closePath();
   const ag=new T.ExtrudeGeometry(arch,{depth:.31,bevelEnabled:false,curveSegments:18});part(g,ag,warm,3.4,17.12,z);
 }
 const bell=new T.LatheGeometry([[.24,.62],[.39,.43],[.48,-.04],[.67,-.40],[.70,-.49],[.59,-.49]].map(([r,h])=>new T.Vector2(r,h)),30);
 part(g,bell,iron,3.4,17.0,0);bar(g,V(3.4,17.5,0),V(3.4,18.64,0),.082,iron);
 box(g,3.4,18.84,0,4.54,.36,4.52,stone);const dome=new T.ConeGeometry(3.03,3.23,4);dome.rotateY(Math.PI/4);part(g,dome,roof,3.4,20.60);
 bar(g,V(3.4,22.18,0),V(3.4,23.55,0),.057,iron);bar(g,V(3.01,23.12,0),V(3.79,23.12,0),.049,iron);
 return pack(g);
}
