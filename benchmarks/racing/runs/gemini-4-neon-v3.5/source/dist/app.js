var nh=Object.defineProperty;var ih=(s,e,t)=>e in s?nh(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var B=(s,e,t)=>ih(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ir="174",sh=0,ko=1,rh=2,rc=1,ac=2,Dn=3,Qn=0,Jt=1,qt=2,Nn=0,Zi=1,Rs=2,Ho=3,Go=4,ah=5,ui=100,oh=101,lh=102,ch=103,hh=104,uh=200,dh=201,fh=202,ph=203,Ia=204,Ua=205,mh=206,gh=207,vh=208,xh=209,Sh=210,Mh=211,yh=212,wh=213,bh=214,Na=0,Fa=1,za=2,Qi=3,Oa=4,Ba=5,ka=6,Ha=7,oc=0,Th=1,_h=2,Yn=0,lc=1,cc=2,hc=3,uc=4,dc=5,_r=6,fc=7,pc=300,Ji=301,$i=302,Ps=303,Ga=304,Ur=306,vi=1e3,Bt=1001,Va=1002,Mt=1003,Ah=1004,ks=1005,gt=1006,Yr=1007,Xn=1008,zn=1009,mc=1010,gc=1011,Ds=1012,To=1013,yn=1014,Zt=1015,Ct=1016,_o=1017,Ao=1018,xi=1020,vc=35902,xc=1021,Sc=1022,It=1023,Mc=1024,yc=1025,qn=1026,Si=1027,Fs=1028,Eo=1029,wc=1030,Co=1031,Ro=1033,xr=33776,Sr=33777,Mr=33778,yr=33779,Wa=35840,Xa=35841,Ya=35842,qa=35843,Za=36196,Ka=37492,ja=37496,Qa=37808,Ja=37809,$a=37810,eo=37811,to=37812,no=37813,io=37814,so=37815,ro=37816,ao=37817,oo=37818,lo=37819,co=37820,ho=37821,wr=36492,uo=36494,fo=36495,bc=36283,po=36284,mo=36285,go=36286,Eh=3200,Ch=3201,Tc=0,Rh=1,Mn="",Vt="srgb",Mi="srgb-linear",Ar="linear",dt="srgb",Ci=7680,Vo=519,Ph=512,Dh=513,Lh=514,_c=515,Ih=516,Uh=517,Nh=518,Fh=519,Wo=35044,Xo="300 es",Un=2e3,Er=2001;class ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yo=1234567;const ys=Math.PI/180,es=180/Math.PI;function bi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[s&255]+Ht[s>>8&255]+Ht[s>>16&255]+Ht[s>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function nt(s,e,t){return Math.max(e,Math.min(t,s))}function Po(s,e){return(s%e+e)%e}function zh(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Oh(s,e,t){return s!==e?(t-s)/(e-s):0}function ws(s,e,t){return(1-t)*s+t*e}function Bh(s,e,t,n){return ws(s,e,1-Math.exp(-t*n))}function kh(s,e=1){return e-Math.abs(Po(s,e*2)-e)}function Hh(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Gh(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Vh(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Wh(s,e){return s+Math.random()*(e-s)}function Xh(s){return s*(.5-Math.random())}function Yh(s){s!==void 0&&(Yo=s);let e=Yo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qh(s){return s*ys}function Zh(s){return s*es}function Kh(s){return(s&s-1)===0&&s!==0}function jh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Qh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Jh(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Xi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Xt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Cr={DEG2RAD:ys,RAD2DEG:es,generateUUID:bi,clamp:nt,euclideanModulo:Po,mapLinear:zh,inverseLerp:Oh,lerp:ws,damp:Bh,pingpong:kh,smoothstep:Hh,smootherstep:Gh,randInt:Vh,randFloat:Wh,randFloatSpread:Xh,seededRandom:Yh,degToRad:qh,radToDeg:Zh,isPowerOfTwo:Kh,ceilPowerOfTwo:jh,floorPowerOfTwo:Qh,setQuaternionFromProperEuler:Jh,normalize:Xt,denormalize:Xi};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class tt{constructor(e,t,n,i,r,a,o,l,c){tt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=i[0],p=i[3],m=i[6],w=i[1],y=i[4],x=i[7],b=i[2],E=i[5],_=i[8];return r[0]=a*v+o*w+l*b,r[3]=a*p+o*y+l*E,r[6]=a*m+o*x+l*_,r[1]=c*v+h*w+u*b,r[4]=c*p+h*y+u*E,r[7]=c*m+h*x+u*_,r[2]=d*v+f*w+g*b,r[5]=d*p+f*y+g*E,r[8]=d*m+f*x+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(qr.makeScale(e,t)),this}rotate(e){return this.premultiply(qr.makeRotation(-e)),this}translate(e,t){return this.premultiply(qr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qr=new tt;function Ac(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Ls(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function $h(){const s=Ls("canvas");return s.style.display="block",s}const qo={};function li(s){s in qo||(qo[s]=!0,console.warn(s))}function eu(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function tu(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function nu(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Zo=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ko=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function iu(){const s={enabled:!0,workingColorSpace:Mi,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===dt&&(i.r=Fn(i.r),i.g=Fn(i.g),i.b=Fn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(i.r=Ki(i.r),i.g=Ki(i.g),i.b=Ki(i.b))),i},fromWorkingColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},toWorkingColorSpace:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Mn?Ar:this.spaces[i].transfer},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Mi]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:Zo,fromXYZ:Ko,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Zo,fromXYZ:Ko,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}}),s}const at=iu();function Fn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ki(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ri;class su{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ri===void 0&&(Ri=Ls("canvas")),Ri.width=e.width,Ri.height=e.height;const n=Ri.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ri}return t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ls("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Fn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Fn(t[n]/255)*255):t[n]=Fn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ru=0;class Do{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=bi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Zr(i[a].image)):r.push(Zr(i[a]))}else r=Zr(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Zr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?su.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let au=0;class Ut extends ss{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=Bt,i=Bt,r=gt,a=Xn,o=It,l=zn,c=Ut.DEFAULT_ANISOTROPY,h=Mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=bi(),this.name="",this.source=new Do(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vi:e.x=e.x-Math.floor(e.x);break;case Bt:e.x=e.x<0?0:1;break;case Va:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vi:e.y=e.y-Math.floor(e.y);break;case Bt:e.y=e.y<0?0:1;break;case Va:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=pc;Ut.DEFAULT_ANISOTROPY=1;class ut{constructor(e=0,t=0,n=0,i=1){ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,x=(f+1)/2,b=(m+1)/2,E=(h+d)/4,_=(u+v)/4,C=(g+p)/4;return y>x&&y>b?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=E/n,r=_/n):x>b?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=E/i,r=C/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=_/r,i=C/r),this.set(n,i,r,t),this}let w=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(p-g)/w,this.y=(u-v)/w,this.z=(d-h)/w,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ou extends ss{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ut(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Do(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tt extends ou{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ec extends Ut{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Bt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class lu extends Ut{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Bt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class yi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let p=1-o;const m=l*d+c*f+h*g+u*v,w=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){const b=Math.sqrt(y),E=Math.atan2(b,m*w);p=Math.sin(p*E)/b,o=Math.sin(o*E)/b}const x=o*w;if(l=l*p+d*x,c=c*p+f*x,h=h*p+g*x,u=u*p+v*x,p===1-o){const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-o*f,e[t+2]=c*g+h*f+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Kr.copy(this).projectOnVector(e),this.sub(Kr)}reflect(e){return this.sub(Kr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Kr=new I,jo=new yi;class Jn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hs.copy(n.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(us),Gs.subVectors(this.max,us),Pi.subVectors(e.a,us),Di.subVectors(e.b,us),Li.subVectors(e.c,us),Bn.subVectors(Di,Pi),kn.subVectors(Li,Di),ni.subVectors(Pi,Li);let t=[0,-Bn.z,Bn.y,0,-kn.z,kn.y,0,-ni.z,ni.y,Bn.z,0,-Bn.x,kn.z,0,-kn.x,ni.z,0,-ni.x,-Bn.y,Bn.x,0,-kn.y,kn.x,0,-ni.y,ni.x,0];return!jr(t,Pi,Di,Li,Gs)||(t=[1,0,0,0,1,0,0,0,1],!jr(t,Pi,Di,Li,Gs))?!1:(Vs.crossVectors(Bn,kn),t=[Vs.x,Vs.y,Vs.z],jr(t,Pi,Di,Li,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Tn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Tn=[new I,new I,new I,new I,new I,new I,new I,new I],un=new I,Hs=new Jn,Pi=new I,Di=new I,Li=new I,Bn=new I,kn=new I,ni=new I,us=new I,Gs=new I,Vs=new I,ii=new I;function jr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ii.fromArray(s,r);const o=i.x*Math.abs(ii.x)+i.y*Math.abs(ii.y)+i.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const cu=new Jn,ds=new I,Qr=new I;class Ti{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):cu.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ds.subVectors(e,this.center);const t=ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ds,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ds.copy(e.center).add(Qr)),this.expandByPoint(ds.copy(e.center).sub(Qr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new I,Jr=new I,Ws=new I,Hn=new I,$r=new I,Xs=new I,ea=new I;class Cc{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Jr.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),Hn.copy(this.origin).sub(Jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ws),o=Hn.dot(this.direction),l=-Hn.dot(Ws),c=Hn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Jr).addScaledVector(Ws,d),f}intersectSphere(e,t){_n.subVectors(e.center,this.origin);const n=_n.dot(this.direction),i=_n.dot(_n)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,i,r){$r.subVectors(t,e),Xs.subVectors(n,e),ea.crossVectors($r,Xs);let a=this.direction.dot(ea),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Hn.subVectors(this.origin,e);const l=o*this.direction.dot(Xs.crossVectors(Hn,Xs));if(l<0)return null;const c=o*this.direction.dot($r.cross(Hn));if(c<0||l+c>a)return null;const h=-o*Hn.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ze{constructor(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,p){Ze.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,p)}set(e,t,n,i,r,a,o,l,c,h,u,d,f,g,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ze().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Ii.setFromMatrixColumn(e,0).length(),r=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;t[0]=d-v*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,v=o*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hu,e,uu)}lookAt(e,t,n){const i=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),Gn.crossVectors(n,nn),Gn.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),Gn.crossVectors(n,nn)),Gn.normalize(),Ys.crossVectors(nn,Gn),i[0]=Gn.x,i[4]=Ys.x,i[8]=nn.x,i[1]=Gn.y,i[5]=Ys.y,i[9]=nn.y,i[2]=Gn.z,i[6]=Ys.z,i[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],w=n[3],y=n[7],x=n[11],b=n[15],E=i[0],_=i[4],C=i[8],M=i[12],S=i[1],D=i[5],z=i[9],U=i[13],H=i[2],ee=i[6],W=i[10],Q=i[14],X=i[3],te=i[7],N=i[11],O=i[15];return r[0]=a*E+o*S+l*H+c*X,r[4]=a*_+o*D+l*ee+c*te,r[8]=a*C+o*z+l*W+c*N,r[12]=a*M+o*U+l*Q+c*O,r[1]=h*E+u*S+d*H+f*X,r[5]=h*_+u*D+d*ee+f*te,r[9]=h*C+u*z+d*W+f*N,r[13]=h*M+u*U+d*Q+f*O,r[2]=g*E+v*S+p*H+m*X,r[6]=g*_+v*D+p*ee+m*te,r[10]=g*C+v*z+p*W+m*N,r[14]=g*M+v*U+p*Q+m*O,r[3]=w*E+y*S+x*H+b*X,r[7]=w*_+y*D+x*ee+b*te,r[11]=w*C+y*z+x*W+b*N,r[15]=w*M+y*U+x*Q+b*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],v=e[7],p=e[11],m=e[15];return g*(+r*l*u-i*c*u-r*o*d+n*c*d+i*o*f-n*l*f)+v*(+t*l*f-t*c*d+r*a*d-i*a*f+i*c*h-r*l*h)+p*(+t*c*u-t*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+m*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],v=e[13],p=e[14],m=e[15],w=u*p*c-v*d*c+v*l*f-o*p*f-u*l*m+o*d*m,y=g*d*c-h*p*c-g*l*f+a*p*f+h*l*m-a*d*m,x=h*v*c-g*u*c+g*o*f-a*v*f-h*o*m+a*u*m,b=g*u*l-h*v*l-g*o*d+a*v*d+h*o*p-a*u*p,E=t*w+n*y+i*x+r*b;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const _=1/E;return e[0]=w*_,e[1]=(v*d*r-u*p*r-v*i*f+n*p*f+u*i*m-n*d*m)*_,e[2]=(o*p*r-v*l*r+v*i*c-n*p*c-o*i*m+n*l*m)*_,e[3]=(u*l*r-o*d*r-u*i*c+n*d*c+o*i*f-n*l*f)*_,e[4]=y*_,e[5]=(h*p*r-g*d*r+g*i*f-t*p*f-h*i*m+t*d*m)*_,e[6]=(g*l*r-a*p*r-g*i*c+t*p*c+a*i*m-t*l*m)*_,e[7]=(a*d*r-h*l*r+h*i*c-t*d*c-a*i*f+t*l*f)*_,e[8]=x*_,e[9]=(g*u*r-h*v*r-g*n*f+t*v*f+h*n*m-t*u*m)*_,e[10]=(a*v*r-g*o*r+g*n*c-t*v*c-a*n*m+t*o*m)*_,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*f-t*o*f)*_,e[12]=b*_,e[13]=(h*v*i-g*u*i+g*n*d-t*v*d-h*n*p+t*u*p)*_,e[14]=(g*o*i-a*v*i-g*n*l+t*v*l+a*n*p-t*o*p)*_,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*_,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,v=a*h,p=a*u,m=o*u,w=l*c,y=l*h,x=l*u,b=n.x,E=n.y,_=n.z;return i[0]=(1-(v+m))*b,i[1]=(f+x)*b,i[2]=(g-y)*b,i[3]=0,i[4]=(f-x)*E,i[5]=(1-(d+m))*E,i[6]=(p+w)*E,i[7]=0,i[8]=(g+y)*_,i[9]=(p-w)*_,i[10]=(1-(d+v))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Ii.set(i[0],i[1],i[2]).length();const a=Ii.set(i[4],i[5],i[6]).length(),o=Ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],dn.copy(this);const c=1/r,h=1/a,u=1/o;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,t.setFromRotationMatrix(dn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=Un){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,g;if(o===Un)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Er)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=Un){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(a-r),d=(t+e)*c,f=(n+i)*h;let g,v;if(o===Un)g=(a+r)*u,v=-2*u;else if(o===Er)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new I,dn=new Ze,hu=new I(0,0,0),uu=new I(1,1,1),Gn=new I,Ys=new I,nn=new I,Qo=new Ze,Jo=new yi;class gn{constructor(e=0,t=0,n=0,i=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jo.setFromEuler(this),this.setFromQuaternion(Jo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class Rc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let du=0;const $o=new I,Ui=new yi,An=new Ze,qs=new I,fs=new I,fu=new I,pu=new yi,el=new I(1,0,0),tl=new I(0,1,0),nl=new I(0,0,1),il={type:"added"},mu={type:"removed"},Ni={type:"childadded",child:null},ta={type:"childremoved",child:null};class At extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:du++}),this.uuid=bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=At.DEFAULT_UP.clone();const e=new I,t=new gn,n=new yi,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ze},normalMatrix:{value:new tt}}),this.matrix=new Ze,this.matrixWorld=new Ze,this.matrixAutoUpdate=At.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.premultiply(Ui),this}rotateX(e){return this.rotateOnAxis(el,e)}rotateY(e){return this.rotateOnAxis(tl,e)}rotateZ(e){return this.rotateOnAxis(nl,e)}translateOnAxis(e,t){return $o.copy(e).applyQuaternion(this.quaternion),this.position.add($o.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(el,e)}translateY(e){return this.translateOnAxis(tl,e)}translateZ(e){return this.translateOnAxis(nl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(An.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qs.copy(e):qs.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?An.lookAt(fs,qs,this.up):An.lookAt(qs,fs,this.up),this.quaternion.setFromRotationMatrix(An),i&&(An.extractRotation(i.matrixWorld),Ui.setFromRotationMatrix(An),this.quaternion.premultiply(Ui.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(il),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mu),ta.child=e,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),An.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),An.multiply(e.parent.matrixWorld)),e.applyMatrix4(An),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(il),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,e,fu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,pu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}At.DEFAULT_UP=new I(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new I,En=new I,na=new I,Cn=new I,Fi=new I,zi=new I,sl=new I,ia=new I,sa=new I,ra=new I,aa=new ut,oa=new ut,la=new ut;class mn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),fn.subVectors(e,t),i.cross(fn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){fn.subVectors(i,t),En.subVectors(n,t),na.subVectors(e,t);const a=fn.dot(fn),o=fn.dot(En),l=fn.dot(na),c=En.dot(En),h=En.dot(na),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Cn.x),l.addScaledVector(a,Cn.y),l.addScaledVector(o,Cn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return aa.setScalar(0),oa.setScalar(0),la.setScalar(0),aa.fromBufferAttribute(e,t),oa.fromBufferAttribute(e,n),la.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(aa,r.x),a.addScaledVector(oa,r.y),a.addScaledVector(la,r.z),a}static isFrontFacing(e,t,n,i){return fn.subVectors(n,t),En.subVectors(e,t),fn.cross(En).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),fn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return mn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Fi.subVectors(i,n),zi.subVectors(r,n),ia.subVectors(e,n);const l=Fi.dot(ia),c=zi.dot(ia);if(l<=0&&c<=0)return t.copy(n);sa.subVectors(e,i);const h=Fi.dot(sa),u=zi.dot(sa);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Fi,a);ra.subVectors(e,r);const f=Fi.dot(ra),g=zi.dot(ra);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(zi,o);const p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return sl.subVectors(r,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(sl,o);const m=1/(p+v+d);return a=v*m,o=d*m,t.copy(n).addScaledVector(Fi,a).addScaledVector(zi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Pc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function ca(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,at.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=at.workingColorSpace){return this.r=e,this.g=t,this.b=n,at.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=at.workingColorSpace){if(e=Po(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ca(a,r,e+1/3),this.g=ca(a,r,e),this.b=ca(a,r,e-1/3)}return at.toWorkingColorSpace(this,i),this}setStyle(e,t=Vt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Vt){const n=Pc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}copyLinearToSRGB(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return at.fromWorkingColorSpace(Gt.copy(this),e),Math.round(nt(Gt.r*255,0,255))*65536+Math.round(nt(Gt.g*255,0,255))*256+Math.round(nt(Gt.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=at.workingColorSpace){at.fromWorkingColorSpace(Gt.copy(this),t);const n=Gt.r,i=Gt.g,r=Gt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=at.workingColorSpace){return at.fromWorkingColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=Vt){at.fromWorkingColorSpace(Gt.copy(this),e);const t=Gt.r,n=Gt.g,i=Gt.b;return e!==Vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Vn),this.setHSL(Vn.h+e,Vn.s+t,Vn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vn),e.getHSL(Zs);const n=ws(Vn.h,Zs.h,t),i=ws(Vn.s,Zs.s,t),r=ws(Vn.l,Zs.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new ze;ze.NAMES=Pc;let gu=0;class _i extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gu++}),this.uuid=bi(),this.name="",this.type="Material",this.blending=Zi,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ia,this.blendDst=Ua,this.blendEquation=ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Zi&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ia&&(n.blendSrc=this.blendSrc),this.blendDst!==Ua&&(n.blendDst=this.blendDst),this.blendEquation!==ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ji extends _i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=oc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ln=vu();function vu(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function xu(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=nt(s,-65504,65504),Ln.floatView[0]=s;const e=Ln.uint32View[0],t=e>>23&511;return Ln.baseTable[t]+((e&8388607)>>Ln.shiftTable[t])}function Su(s){const e=s>>10;return Ln.uint32View[0]=Ln.mantissaTable[Ln.offsetTable[e]+(s&1023)]+Ln.exponentTable[e],Ln.floatView[0]}class Ks{static toHalfFloat(e){return xu(e)}static fromHalfFloat(e){return Su(e)}}const Dt=new I,js=new xe;let Mu=0;class vt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Mu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Wo,this.updateRanges=[],this.gpuType=Zt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)js.fromBufferAttribute(this,t),js.applyMatrix3(e),this.setXY(t,js.x,js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Xi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array),i=Xt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Xt(t,this.array),n=Xt(n,this.array),i=Xt(i,this.array),r=Xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Wo&&(e.usage=this.usage),e}}class Dc extends vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Lc extends vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class et extends vt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let yu=0;const on=new Ze,ha=new At,Oi=new I,sn=new Jn,ps=new Jn,zt=new I;class xt extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ac(e)?Lc:Dc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,n){return on.makeTranslation(e,t,n),this.applyMatrix4(on),this}scale(e,t,n){return on.makeScale(e,t,n),this.applyMatrix4(on),this}lookAt(e){return ha.lookAt(e),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new et(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];sn.setFromBufferAttribute(r),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ps.setFromBufferAttribute(o),this.morphTargetsRelative?(zt.addVectors(sn.min,ps.min),sn.expandByPoint(zt),zt.addVectors(sn.max,ps.max),sn.expandByPoint(zt)):(sn.expandByPoint(ps.min),sn.expandByPoint(ps.max))}sn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)zt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(zt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)zt.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(e,c),zt.add(Oi)),i=Math.max(i,n.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new I,l[C]=new I;const c=new I,h=new I,u=new I,d=new xe,f=new xe,g=new xe,v=new I,p=new I;function m(C,M,S){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,S),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,S),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(D),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),o[C].add(v),o[M].add(v),o[S].add(v),l[C].add(p),l[M].add(p),l[S].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let C=0,M=w.length;C<M;++C){const S=w[C],D=S.start,z=S.count;for(let U=D,H=D+z;U<H;U+=3)m(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const y=new I,x=new I,b=new I,E=new I;function _(C){b.fromBufferAttribute(i,C),E.copy(b);const M=o[C];y.copy(M),y.sub(b.multiplyScalar(b.dot(M))).normalize(),x.crossVectors(E,M);const D=x.dot(l[C])<0?-1:1;a.setXYZW(C,y.x,y.y,y.z,D)}for(let C=0,M=w.length;C<M;++C){const S=w[C],D=S.start,z=S.count;for(let U=D,H=D+z;U<H;U+=3)_(e.getX(U+0)),_(e.getX(U+1)),_(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let m=0;m<h;m++)d[g++]=c[f++]}return new vt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new xt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rl=new Ze,si=new Cc,Qs=new Ti,al=new I,Js=new I,$s=new I,er=new I,ua=new I,tr=new I,ol=new I,nr=new I;class Ee extends At{constructor(e=new xt,t=new ji){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(ua.fromBufferAttribute(u,e),a?tr.addScaledVector(ua,h):tr.addScaledVector(ua.sub(t),h))}t.add(tr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(r),si.copy(e.ray).recast(e.near),!(Qs.containsPoint(si.origin)===!1&&(si.intersectSphere(Qs,al)===null||si.origin.distanceToSquared(al)>(e.far-e.near)**2))&&(rl.copy(r).invert(),si.copy(e.ray).applyMatrix4(rl),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,si)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=a[p.materialIndex],w=Math.max(p.start,f.start),y=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let x=w,b=y;x<b;x+=3){const E=o.getX(x),_=o.getX(x+1),C=o.getX(x+2);i=ir(this,m,e,n,c,h,u,E,_,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const w=o.getX(p),y=o.getX(p+1),x=o.getX(p+2);i=ir(this,a,e,n,c,h,u,w,y,x),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=a[p.materialIndex],w=Math.max(p.start,f.start),y=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let x=w,b=y;x<b;x+=3){const E=x,_=x+1,C=x+2;i=ir(this,m,e,n,c,h,u,E,_,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const w=p,y=p+1,x=p+2;i=ir(this,a,e,n,c,h,u,w,y,x),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function wu(s,e,t,n,i,r,a,o){let l;if(e.side===Jt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===Qn,o),l===null)return null;nr.copy(o),nr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(nr);return c<t.near||c>t.far?null:{distance:c,point:nr.clone(),object:s}}function ir(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Js),s.getVertexPosition(l,$s),s.getVertexPosition(c,er);const h=wu(s,e,t,n,Js,$s,er,ol);if(h){const u=new I;mn.getBarycoord(ol,Js,$s,er,u),i&&(h.uv=mn.getInterpolatedAttribute(i,o,l,c,u,new xe)),r&&(h.uv1=mn.getInterpolatedAttribute(r,o,l,c,u,new xe)),a&&(h.normal=mn.getInterpolatedAttribute(a,o,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new I,materialIndex:0};mn.getNormal(Js,$s,er,d.normal),h.face=d,h.barycoord=u}return h}class Re extends xt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new et(c,3)),this.setAttribute("normal",new et(h,3)),this.setAttribute("uv",new et(u,2));function g(v,p,m,w,y,x,b,E,_,C,M){const S=x/_,D=b/C,z=x/2,U=b/2,H=E/2,ee=_+1,W=C+1;let Q=0,X=0;const te=new I;for(let N=0;N<W;N++){const O=N*D-U;for(let le=0;le<ee;le++){const Se=le*S-z;te[v]=Se*w,te[p]=O*y,te[m]=H,c.push(te.x,te.y,te.z),te[v]=0,te[p]=0,te[m]=E>0?1:-1,h.push(te.x,te.y,te.z),u.push(le/_),u.push(1-N/C),Q+=1}}for(let N=0;N<C;N++)for(let O=0;O<_;O++){const le=d+O+ee*N,Se=d+O+ee*(N+1),Z=d+(O+1)+ee*(N+1),k=d+(O+1)+ee*N;l.push(le,Se,k),l.push(Se,Z,k),X+=6}o.addGroup(f,X,M),f+=X,d+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Re(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ts(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Yt(s){const e={};for(let t=0;t<s.length;t++){const n=ts(s[t]);for(const i in n)e[i]=n[i]}return e}function bu(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Ic(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:at.workingColorSpace}const Zn={clone:ts,merge:Yt};var Tu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_u=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ft extends _i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tu,this.fragmentShader=_u,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=bu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Uc extends At{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ze,this.projectionMatrix=new Ze,this.projectionMatrixInverse=new Ze,this.coordinateSystem=Un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wn=new I,ll=new xe,cl=new xe;class Qt extends Uc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=es*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return es*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z),Wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z)}getViewSize(e,t){return this.getViewBounds(e,ll,cl),t.subVectors(cl,ll)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ys*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Bi=-90,ki=1;class Au extends At{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Qt(Bi,ki,e,t);i.layers=this.layers,this.add(i);const r=new Qt(Bi,ki,e,t);r.layers=this.layers,this.add(r);const a=new Qt(Bi,ki,e,t);a.layers=this.layers,this.add(a);const o=new Qt(Bi,ki,e,t);o.layers=this.layers,this.add(o);const l=new Qt(Bi,ki,e,t);l.layers=this.layers,this.add(l);const c=new Qt(Bi,ki,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Un)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Er)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Nc extends Ut{constructor(e,t,n,i,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ji,super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Eu extends Tt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Nc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Re(5,5,5),r=new ft({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Nn});r.uniforms.tEquirect.value=t;const a=new Ee(i,r),o=t.minFilter;return t.minFilter===Xn&&(t.minFilter=gt),new Au(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}class pt extends At{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Cu={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cu)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new pt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class bs{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=t}clone(){return new bs(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Ru extends At{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class zs extends Ut{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Mt,h=Mt,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hl extends vt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hi=new Ze,ul=new Ze,sr=[],dl=new Jn,Pu=new Ze,ms=new Ee,gs=new Ti;class Fc extends Ee{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new hl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Pu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),dl.copy(e.boundingBox).applyMatrix4(Hi),this.boundingBox.union(dl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hi),gs.copy(e.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(gs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(ms.geometry=this.geometry,ms.material=this.material,ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gs.copy(this.boundingSphere),gs.applyMatrix4(n),e.ray.intersectsSphere(gs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Hi),ul.multiplyMatrices(n,Hi),ms.matrixWorld=ul,ms.raycast(e,sr);for(let a=0,o=sr.length;a<o;a++){const l=sr[a];l.instanceId=r,l.object=this,t.push(l)}sr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new hl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new zs(new Float32Array(i*this.count),i,this.count,Fs,Zt));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const fa=new I,Du=new I,Lu=new tt;class ci{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=fa.subVectors(n,t).cross(Du.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(fa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Lu.getNormalMatrix(e),i=this.coplanarPoint(fa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new Ti,rr=new I;class Lo{constructor(e=new ci,t=new ci,n=new ci,i=new ci,r=new ci,a=new ci){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Un){const n=this.planes,i=e.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],g=i[9],v=i[10],p=i[11],m=i[12],w=i[13],y=i[14],x=i[15];if(n[0].setComponents(l-r,d-c,p-f,x-m).normalize(),n[1].setComponents(l+r,d+c,p+f,x+m).normalize(),n[2].setComponents(l+a,d+h,p+g,x+w).normalize(),n[3].setComponents(l-a,d-h,p-g,x-w).normalize(),n[4].setComponents(l-o,d-u,p-v,x-y).normalize(),t===Un)n[5].setComponents(l+o,d+u,p+v,x+y).normalize();else if(t===Er)n[5].setComponents(o,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(rr.x=i.normal.x>0?e.max.x:e.min.x,rr.y=i.normal.y>0?e.max.y:e.min.y,rr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(rr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zc extends _i{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const fl=new Ze,vo=new Cc,ar=new Ti,or=new I;class Iu extends At{constructor(e=new xt,t=new zc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(i),ar.radius+=r,e.ray.intersectsSphere(ar)===!1)return;fl.copy(i).invert(),vo.copy(e.ray).applyMatrix4(fl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,v=f;g<v;g++){const p=c.getX(g);or.fromBufferAttribute(u,p),pl(or,p,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,v=f;g<v;g++)or.fromBufferAttribute(u,g),pl(or,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pl(s,e,t,n,i,r,a){const o=vo.distanceSqToPoint(s);if(o<t){const l=new I;vo.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Nr extends Ut{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ts extends Ut{constructor(e,t,n,i,r,a,o,l,c,h=qn){if(h!==qn&&h!==Si)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=yn),n===void 0&&h===Si&&(n=xi),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Mt,this.minFilter=l!==void 0?l:Mt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Do(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class wn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new xe:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,i=[],r=[],a=[],o=new I,l=new Ze;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(nt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(nt(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Io extends wn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new xe){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Uu extends Io{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Uo(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const lr=new I,pa=new Uo,ma=new Uo,ga=new Uo;class Oc extends wn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(lr.subVectors(i[0],i[1]).add(i[0]),c=lr);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(lr.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=lr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),pa.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,p),ma.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,p),ga.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,p)}else this.curveType==="catmullrom"&&(pa.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),ma.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ga.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(pa.calc(l),ma.calc(l),ga.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function ml(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function Nu(s,e){const t=1-s;return t*t*e}function Fu(s,e){return 2*(1-s)*s*e}function zu(s,e){return s*s*e}function _s(s,e,t,n){return Nu(s,e)+Fu(s,t)+zu(s,n)}function Ou(s,e){const t=1-s;return t*t*t*e}function Bu(s,e){const t=1-s;return 3*t*t*s*e}function ku(s,e){return 3*(1-s)*s*s*e}function Hu(s,e){return s*s*s*e}function As(s,e,t,n,i){return Ou(s,e)+Bu(s,t)+ku(s,n)+Hu(s,i)}class Bc extends wn{constructor(e=new xe,t=new xe,n=new xe,i=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new xe){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(As(e,i.x,r.x,a.x,o.x),As(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Gu extends wn{constructor(e=new I,t=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(As(e,i.x,r.x,a.x,o.x),As(e,i.y,r.y,a.y,o.y),As(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class kc extends wn{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vu extends wn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hc extends wn{constructor(e=new xe,t=new xe,n=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new xe){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(_s(e,i.x,r.x,a.x),_s(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wu extends wn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(_s(e,i.x,r.x,a.x),_s(e,i.y,r.y,a.y),_s(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gc extends wn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(ml(o,l.x,c.x,h.x,u.x),ml(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new xe().fromArray(i))}return this}}var xo=Object.freeze({__proto__:null,ArcCurve:Uu,CatmullRomCurve3:Oc,CubicBezierCurve:Bc,CubicBezierCurve3:Gu,EllipseCurve:Io,LineCurve:kc,LineCurve3:Vu,QuadraticBezierCurve:Hc,QuadraticBezierCurve3:Wu,SplineCurve:Gc});class Xu extends wn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new xo[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new xo[i.type]().fromJSON(i))}return this}}class gl extends Xu{constructor(e){super(),this.type="Path",this.currentPoint=new xe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new kc(this.currentPoint.clone(),new xe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new Hc(this.currentPoint.clone(),new xe(e,t),new xe(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new Bc(this.currentPoint.clone(),new xe(e,t),new xe(n,i),new xe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Gc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new Io(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Rr extends xt{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=nt(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/t,u=new I,d=new xe,f=new I,g=new I,v=new I;let p=0,m=0;for(let w=0;w<=e.length-1;w++)switch(w){case 0:p=e[w+1].x-e[w].x,m=e[w+1].y-e[w].y,f.x=m*1,f.y=-p,f.z=m*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:p=e[w+1].x-e[w].x,m=e[w+1].y-e[w].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(g)}for(let w=0;w<=t;w++){const y=n+w*h*i,x=Math.sin(y),b=Math.cos(y);for(let E=0;E<=e.length-1;E++){u.x=e[E].x*x,u.y=e[E].y,u.z=e[E].x*b,a.push(u.x,u.y,u.z),d.x=w/t,d.y=E/(e.length-1),o.push(d.x,d.y);const _=l[3*E+0]*x,C=l[3*E+1],M=l[3*E+0]*b;c.push(_,C,M)}}for(let w=0;w<t;w++)for(let y=0;y<e.length-1;y++){const x=y+w*e.length,b=x,E=x+e.length,_=x+e.length+1,C=x+1;r.push(b,E,C),r.push(_,C,E)}this.setIndex(r),this.setAttribute("position",new et(a,3)),this.setAttribute("uv",new et(o,2)),this.setAttribute("normal",new et(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rr(e.points,e.segments,e.phiStart,e.phiLength)}}class No extends xt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new I,h=new xe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new et(a,3)),this.setAttribute("normal",new et(o,3)),this.setAttribute("uv",new et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new No(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Qe extends xt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],p=n/2;let m=0;w(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new et(u,3)),this.setAttribute("normal",new et(d,3)),this.setAttribute("uv",new et(f,2));function w(){const x=new I,b=new I;let E=0;const _=(t-e)/n;for(let C=0;C<=r;C++){const M=[],S=C/r,D=S*(t-e)+e;for(let z=0;z<=i;z++){const U=z/i,H=U*l+o,ee=Math.sin(H),W=Math.cos(H);b.x=D*ee,b.y=-S*n+p,b.z=D*W,u.push(b.x,b.y,b.z),x.set(ee,_,W).normalize(),d.push(x.x,x.y,x.z),f.push(U,1-S),M.push(g++)}v.push(M)}for(let C=0;C<i;C++)for(let M=0;M<r;M++){const S=v[M][C],D=v[M+1][C],z=v[M+1][C+1],U=v[M][C+1];(e>0||M!==0)&&(h.push(S,D,U),E+=3),(t>0||M!==r-1)&&(h.push(D,z,U),E+=3)}c.addGroup(m,E,0),m+=E}function y(x){const b=g,E=new xe,_=new I;let C=0;const M=x===!0?e:t,S=x===!0?1:-1;for(let z=1;z<=i;z++)u.push(0,p*S,0),d.push(0,S,0),f.push(.5,.5),g++;const D=g;for(let z=0;z<=i;z++){const H=z/i*l+o,ee=Math.cos(H),W=Math.sin(H);_.x=M*W,_.y=p*S,_.z=M*ee,u.push(_.x,_.y,_.z),d.push(0,S,0),E.x=ee*.5+.5,E.y=W*.5*S+.5,f.push(E.x,E.y),g++}for(let z=0;z<i;z++){const U=b+z,H=D+z;x===!0?h.push(H,H+1,U):h.push(H+1,H,U),C+=3}c.addGroup(m,C,x===!0?1:2),m+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class mi extends Qe{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new mi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fo extends xt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new et(r,3)),this.setAttribute("normal",new et(r.slice(),3)),this.setAttribute("uv",new et(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(w){const y=new I,x=new I,b=new I;for(let E=0;E<t.length;E+=3)f(t[E+0],y),f(t[E+1],x),f(t[E+2],b),l(y,x,b,w)}function l(w,y,x,b){const E=b+1,_=[];for(let C=0;C<=E;C++){_[C]=[];const M=w.clone().lerp(x,C/E),S=y.clone().lerp(x,C/E),D=E-C;for(let z=0;z<=D;z++)z===0&&C===E?_[C][z]=M:_[C][z]=M.clone().lerp(S,z/D)}for(let C=0;C<E;C++)for(let M=0;M<2*(E-C)-1;M++){const S=Math.floor(M/2);M%2===0?(d(_[C][S+1]),d(_[C+1][S]),d(_[C][S])):(d(_[C][S+1]),d(_[C+1][S+1]),d(_[C+1][S]))}}function c(w){const y=new I;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(w),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function h(){const w=new I;for(let y=0;y<r.length;y+=3){w.x=r[y+0],w.y=r[y+1],w.z=r[y+2];const x=p(w)/2/Math.PI+.5,b=m(w)/Math.PI+.5;a.push(x,1-b)}g(),u()}function u(){for(let w=0;w<a.length;w+=6){const y=a[w+0],x=a[w+2],b=a[w+4],E=Math.max(y,x,b),_=Math.min(y,x,b);E>.9&&_<.1&&(y<.2&&(a[w+0]+=1),x<.2&&(a[w+2]+=1),b<.2&&(a[w+4]+=1))}}function d(w){r.push(w.x,w.y,w.z)}function f(w,y){const x=w*3;y.x=e[x+0],y.y=e[x+1],y.z=e[x+2]}function g(){const w=new I,y=new I,x=new I,b=new I,E=new xe,_=new xe,C=new xe;for(let M=0,S=0;M<r.length;M+=9,S+=6){w.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),E.set(a[S+0],a[S+1]),_.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),b.copy(w).add(y).add(x).divideScalar(3);const D=p(b);v(E,S+0,w,D),v(_,S+2,y,D),v(C,S+4,x,D)}}function v(w,y,x,b){b<0&&w.x===1&&(a[y]=w.x-1),x.x===0&&x.z===0&&(a[y]=b/2/Math.PI+.5)}function p(w){return Math.atan2(w.z,-w.x)}function m(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fo(e.vertices,e.indices,e.radius,e.details)}}class So extends gl{constructor(e){super(e),this.uuid=bi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new gl().fromJSON(i))}return this}}class Yu{static triangulate(e,t,n=2){const i=t&&t.length,r=i?t[0]*n:e.length;let a=Vc(e,0,r,n,!0);const o=[];if(!a||a.next===a.prev)return o;let l,c,h,u,d,f,g;if(i&&(a=Qu(e,t,a,n)),e.length>80*n){l=h=e[0],c=u=e[1];for(let v=n;v<r;v+=n)d=e[v],f=e[v+1],d<l&&(l=d),f<c&&(c=f),d>h&&(h=d),f>u&&(u=f);g=Math.max(h-l,u-c),g=g!==0?32767/g:0}return Is(a,o,n,l,c,g,0),o}}function Vc(s,e,t,n,i){let r,a;if(i===ld(s,e,t,n)>0)for(r=e;r<t;r+=n)a=vl(r,s[r],s[r+1],a);else for(r=t-n;r>=e;r-=n)a=vl(r,s[r],s[r+1],a);return a&&Fr(a,a.next)&&(Ns(a),a=a.next),a}function wi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Fr(t,t.next)||_t(t.prev,t,t.next)===0)){if(Ns(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Is(s,e,t,n,i,r,a){if(!s)return;!a&&r&&nd(s,n,i,r);let o=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?Zu(s,n,i,r):qu(s)){e.push(l.i/t|0),e.push(s.i/t|0),e.push(c.i/t|0),Ns(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=Ku(wi(s),e,t),Is(s,e,t,n,i,r,2)):a===2&&ju(s,e,t,n,i,r):Is(wi(s),e,t,n,i,r,1);break}}}function qu(s){const e=s.prev,t=s,n=s.next;if(_t(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=i<r?i<a?i:a:r<a?r:a,u=o<l?o<c?o:c:l<c?l:c,d=i>r?i>a?i:a:r>a?r:a,f=o>l?o>c?o:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Yi(i,o,r,l,a,c,g.x,g.y)&&_t(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Zu(s,e,t,n){const i=s.prev,r=s,a=s.next;if(_t(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=o<l?o<c?o:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,v=o>l?o>c?o:c:l>c?l:c,p=h>u?h>d?h:d:u>d?u:d,m=Mo(f,g,e,t,n),w=Mo(v,p,e,t,n);let y=s.prevZ,x=s.nextZ;for(;y&&y.z>=m&&x&&x.z<=w;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=p&&y!==i&&y!==a&&Yi(o,h,l,u,c,d,y.x,y.y)&&_t(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==i&&x!==a&&Yi(o,h,l,u,c,d,x.x,x.y)&&_t(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=m;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=p&&y!==i&&y!==a&&Yi(o,h,l,u,c,d,y.x,y.y)&&_t(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=w;){if(x.x>=f&&x.x<=v&&x.y>=g&&x.y<=p&&x!==i&&x!==a&&Yi(o,h,l,u,c,d,x.x,x.y)&&_t(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Ku(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!Fr(i,r)&&Wc(i,n,n.next,r)&&Us(i,r)&&Us(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Ns(n),Ns(n.next),n=s=r),n=n.next}while(n!==s);return wi(n)}function ju(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&rd(a,o)){let l=Xc(a,o);a=wi(a,a.next),l=wi(l,l.next),Is(a,e,t,n,i,r,0),Is(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Qu(s,e,t,n){const i=[];let r,a,o,l,c;for(r=0,a=e.length;r<a;r++)o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=Vc(s,o,l,n,!1),c===c.next&&(c.steiner=!0),i.push(sd(c));for(i.sort(Ju),r=0;r<i.length;r++)t=$u(i[r],t);return t}function Ju(s,e){return s.x-e.x}function $u(s,e){const t=ed(s,e);if(!t)return e;const n=Xc(t,s);return wi(n,n.next),wi(t,t.next)}function ed(s,e){let t=e,n=-1/0,i;const r=s.x,a=s.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===r))return i}t=t.next}while(t!==e);if(!i)return null;const o=i,l=i.x,c=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=l&&r!==t.x&&Yi(a<c?r:n,a,l,c,a<c?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),Us(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&td(i,t)))&&(i=t,h=u)),t=t.next;while(t!==o);return i}function td(s,e){return _t(s.prev,s,e.prev)<0&&_t(e.next,s,s.next)<0}function nd(s,e,t,n){let i=s;do i.z===0&&(i.z=Mo(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,id(i)}function id(s){let e,t,n,i,r,a,o,l,c=1;do{for(t=s,s=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(a>1);return s}function Mo(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function sd(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Yi(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function rd(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!ad(s,e)&&(Us(s,e)&&Us(e,s)&&od(s,e)&&(_t(s.prev,s,e.prev)||_t(s,e.prev,e))||Fr(s,e)&&_t(s.prev,s,s.next)>0&&_t(e.prev,e,e.next)>0)}function _t(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Fr(s,e){return s.x===e.x&&s.y===e.y}function Wc(s,e,t,n){const i=hr(_t(s,e,t)),r=hr(_t(s,e,n)),a=hr(_t(t,n,s)),o=hr(_t(t,n,e));return!!(i!==r&&a!==o||i===0&&cr(s,t,e)||r===0&&cr(s,n,e)||a===0&&cr(t,s,n)||o===0&&cr(t,e,n))}function cr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function hr(s){return s>0?1:s<0?-1:0}function ad(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Wc(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Us(s,e){return _t(s.prev,s,s.next)<0?_t(s,e,s.next)>=0&&_t(s,s.prev,e)>=0:_t(s,e,s.prev)<0||_t(s,s.next,e)<0}function od(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Xc(s,e){const t=new yo(s.i,s.x,s.y),n=new yo(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function vl(s,e,t,n){const i=new yo(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ns(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function yo(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ld(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class Es{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Es.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];xl(e),Sl(n,e);let a=e.length;t.forEach(xl);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Sl(n,t[l]);const o=Yu.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function xl(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Sl(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Pr extends xt{constructor(e=new So([new xe(.5,.5),new xe(-.5,.5),new xe(-.5,-.5),new xe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new et(i,3)),this.setAttribute("uv",new et(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,w=t.UVGenerator!==void 0?t.UVGenerator:cd;let y,x=!1,b,E,_,C;m&&(y=m.getSpacedPoints(h),x=!0,d=!1,b=m.computeFrenetFrames(h,!1),E=new I,_=new I,C=new I),d||(p=0,f=0,g=0,v=0);const M=o.extractPoints(c);let S=M.shape;const D=M.holes;if(!Es.isClockWise(S)){S=S.reverse();for(let Y=0,ne=D.length;Y<ne;Y++){const R=D[Y];Es.isClockWise(R)&&(D[Y]=R.reverse())}}const U=Es.triangulateShape(S,D),H=S;for(let Y=0,ne=D.length;Y<ne;Y++){const R=D[Y];S=S.concat(R)}function ee(Y,ne,R){return ne||console.error("THREE.ExtrudeGeometry: vec does not exist"),Y.clone().addScaledVector(ne,R)}const W=S.length,Q=U.length;function X(Y,ne,R){let fe,ue,Te;const j=Y.x-ne.x,J=Y.y-ne.y,re=R.x-Y.x,P=R.y-Y.y,T=j*j+J*J,$=j*P-J*re;if(Math.abs($)>Number.EPSILON){const oe=Math.sqrt(T),pe=Math.sqrt(re*re+P*P),he=ne.x-J/oe,Ae=ne.y+j/oe,ve=R.x-P/pe,Me=R.y+re/pe,Fe=((ve-he)*P-(Me-Ae)*re)/(j*P-J*re);fe=he+j*Fe-Y.x,ue=Ae+J*Fe-Y.y;const we=fe*fe+ue*ue;if(we<=2)return new xe(fe,ue);Te=Math.sqrt(we/2)}else{let oe=!1;j>Number.EPSILON?re>Number.EPSILON&&(oe=!0):j<-Number.EPSILON?re<-Number.EPSILON&&(oe=!0):Math.sign(J)===Math.sign(P)&&(oe=!0),oe?(fe=-J,ue=j,Te=Math.sqrt(T)):(fe=j,ue=J,Te=Math.sqrt(T/2))}return new xe(fe/Te,ue/Te)}const te=[];for(let Y=0,ne=H.length,R=ne-1,fe=Y+1;Y<ne;Y++,R++,fe++)R===ne&&(R=0),fe===ne&&(fe=0),te[Y]=X(H[Y],H[R],H[fe]);const N=[];let O,le=te.concat();for(let Y=0,ne=D.length;Y<ne;Y++){const R=D[Y];O=[];for(let fe=0,ue=R.length,Te=ue-1,j=fe+1;fe<ue;fe++,Te++,j++)Te===ue&&(Te=0),j===ue&&(j=0),O[fe]=X(R[fe],R[Te],R[j]);N.push(O),le=le.concat(O)}for(let Y=0;Y<p;Y++){const ne=Y/p,R=f*Math.cos(ne*Math.PI/2),fe=g*Math.sin(ne*Math.PI/2)+v;for(let ue=0,Te=H.length;ue<Te;ue++){const j=ee(H[ue],te[ue],fe);F(j.x,j.y,-R)}for(let ue=0,Te=D.length;ue<Te;ue++){const j=D[ue];O=N[ue];for(let J=0,re=j.length;J<re;J++){const P=ee(j[J],O[J],fe);F(P.x,P.y,-R)}}}const Se=g+v;for(let Y=0;Y<W;Y++){const ne=d?ee(S[Y],le[Y],Se):S[Y];x?(_.copy(b.normals[0]).multiplyScalar(ne.x),E.copy(b.binormals[0]).multiplyScalar(ne.y),C.copy(y[0]).add(_).add(E),F(C.x,C.y,C.z)):F(ne.x,ne.y,0)}for(let Y=1;Y<=h;Y++)for(let ne=0;ne<W;ne++){const R=d?ee(S[ne],le[ne],Se):S[ne];x?(_.copy(b.normals[Y]).multiplyScalar(R.x),E.copy(b.binormals[Y]).multiplyScalar(R.y),C.copy(y[Y]).add(_).add(E),F(C.x,C.y,C.z)):F(R.x,R.y,u/h*Y)}for(let Y=p-1;Y>=0;Y--){const ne=Y/p,R=f*Math.cos(ne*Math.PI/2),fe=g*Math.sin(ne*Math.PI/2)+v;for(let ue=0,Te=H.length;ue<Te;ue++){const j=ee(H[ue],te[ue],fe);F(j.x,j.y,u+R)}for(let ue=0,Te=D.length;ue<Te;ue++){const j=D[ue];O=N[ue];for(let J=0,re=j.length;J<re;J++){const P=ee(j[J],O[J],fe);x?F(P.x,P.y+y[h-1].y,y[h-1].x+R):F(P.x,P.y,u+R)}}}Z(),k();function Z(){const Y=i.length/3;if(d){let ne=0,R=W*ne;for(let fe=0;fe<Q;fe++){const ue=U[fe];V(ue[2]+R,ue[1]+R,ue[0]+R)}ne=h+p*2,R=W*ne;for(let fe=0;fe<Q;fe++){const ue=U[fe];V(ue[0]+R,ue[1]+R,ue[2]+R)}}else{for(let ne=0;ne<Q;ne++){const R=U[ne];V(R[2],R[1],R[0])}for(let ne=0;ne<Q;ne++){const R=U[ne];V(R[0]+W*h,R[1]+W*h,R[2]+W*h)}}n.addGroup(Y,i.length/3-Y,0)}function k(){const Y=i.length/3;let ne=0;L(H,ne),ne+=H.length;for(let R=0,fe=D.length;R<fe;R++){const ue=D[R];L(ue,ne),ne+=ue.length}n.addGroup(Y,i.length/3-Y,1)}function L(Y,ne){let R=Y.length;for(;--R>=0;){const fe=R;let ue=R-1;ue<0&&(ue=Y.length-1);for(let Te=0,j=h+p*2;Te<j;Te++){const J=W*Te,re=W*(Te+1),P=ne+fe+J,T=ne+ue+J,$=ne+ue+re,oe=ne+fe+re;ce(P,T,$,oe)}}}function F(Y,ne,R){l.push(Y),l.push(ne),l.push(R)}function V(Y,ne,R){ie(Y),ie(ne),ie(R);const fe=i.length/3,ue=w.generateTopUV(n,i,fe-3,fe-2,fe-1);se(ue[0]),se(ue[1]),se(ue[2])}function ce(Y,ne,R,fe){ie(Y),ie(ne),ie(fe),ie(ne),ie(R),ie(fe);const ue=i.length/3,Te=w.generateSideWallUV(n,i,ue-6,ue-3,ue-2,ue-1);se(Te[0]),se(Te[1]),se(Te[3]),se(Te[1]),se(Te[2]),se(Te[3])}function ie(Y){i.push(l[Y*3+0]),i.push(l[Y*3+1]),i.push(l[Y*3+2])}function se(Y){r.push(Y.x),r.push(Y.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return hd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new xo[i.type]().fromJSON(i)),new Pr(n,e.options)}}const cd={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new xe(r,a),new xe(o,l),new xe(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],g=e[i*3+2],v=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new xe(a,1-l),new xe(c,1-u),new xe(d,1-g),new xe(v,1-m)]:[new xe(o,1-l),new xe(h,1-u),new xe(f,1-g),new xe(p,1-m)]}};function hd(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class zo extends Fo{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zo(e.radius,e.detail)}}class $t extends xt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],g=[],v=[],p=[];for(let m=0;m<h;m++){const w=m*d-a;for(let y=0;y<c;y++){const x=y*u-r;g.push(x,-w,0),v.push(0,0,1),p.push(y/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let w=0;w<o;w++){const y=w+c*m,x=w+c*(m+1),b=w+1+c*(m+1),E=w+1+c*m;f.push(y,x,E),f.push(x,b,E)}this.setIndex(f),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(v,3)),this.setAttribute("uv",new et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.width,e.height,e.widthSegments,e.heightSegments)}}class Kn extends xt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new I,d=new I,f=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){const w=[],y=m/n;let x=0;m===0&&a===0?x=.5/t:m===n&&l===Math.PI&&(x=-.5/t);for(let b=0;b<=t;b++){const E=b/t;u.x=-e*Math.cos(i+E*r)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(i+E*r)*Math.sin(a+y*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),p.push(E+x,1-y),w.push(c++)}h.push(w)}for(let m=0;m<n;m++)for(let w=0;w<t;w++){const y=h[m][w+1],x=h[m][w],b=h[m+1][w],E=h[m+1][w+1];(m!==0||a>0)&&f.push(y,x,E),(m!==n-1||l<Math.PI)&&f.push(x,b,E)}this.setIndex(f),this.setAttribute("position",new et(g,3)),this.setAttribute("normal",new et(v,3)),this.setAttribute("uv",new et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class jn extends xt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new I,u=new I,d=new I;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){const v=g/i*r,p=f/n*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(v),u.y=(e+t*Math.cos(p))*Math.sin(v),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){const v=(i+1)*f+g-1,p=(i+1)*(f-1)+g-1,m=(i+1)*(f-1)+g,w=(i+1)*f+g;a.push(v,p,w),a.push(p,m,w)}this.setIndex(a),this.setAttribute("position",new et(o,3)),this.setAttribute("normal",new et(l,3)),this.setAttribute("uv",new et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ud extends ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Xe extends _i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tc,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class In extends Xe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class dd extends _i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fd extends _i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Dr={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class pd{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const md=new pd;class Os{constructor(e){this.manager=e!==void 0?e:md,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Os.DEFAULT_MATERIAL_NAME="__DEFAULT";const Rn={};class gd extends Error{constructor(e,t){super(e),this.response=t}}class vd extends Os{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Dr.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Rn[e]!==void 0){Rn[e].push({onLoad:t,onProgress:n,onError:i});return}Rn[e]=[],Rn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Rn[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let v=0;const p=new ReadableStream({start(m){w();function w(){u.read().then(({done:y,value:x})=>{if(y)m.close();else{v+=x.byteLength;const b=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:f});for(let E=0,_=h.length;E<_;E++){const C=h[E];C.onProgress&&C.onProgress(b)}m.enqueue(x),w()}},y=>{m.error(y)})}}});return new Response(p)}else throw new gd(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Dr.add(e,c);const h=Rn[e];delete Rn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=Rn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Rn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class xd extends Os{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Dr.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=Ls("img");function l(){h(),Dr.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Sd extends Os{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new zs,o=new vd(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}c.image!==void 0?a.image=c.image:c.data!==void 0&&(a.image.width=c.width,a.image.height=c.height,a.image.data=c.data),a.wrapS=c.wrapS!==void 0?c.wrapS:Bt,a.wrapT=c.wrapT!==void 0?c.wrapT:Bt,a.magFilter=c.magFilter!==void 0?c.magFilter:gt,a.minFilter=c.minFilter!==void 0?c.minFilter:gt,a.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(a.colorSpace=c.colorSpace),c.flipY!==void 0&&(a.flipY=c.flipY),c.format!==void 0&&(a.format=c.format),c.type!==void 0&&(a.type=c.type),c.mipmaps!==void 0&&(a.mipmaps=c.mipmaps,a.minFilter=Xn),c.mipmapCount===1&&(a.minFilter=gt),c.generateMipmaps!==void 0&&(a.generateMipmaps=c.generateMipmaps),a.needsUpdate=!0,t&&t(a,c)},n,i),a}}class Md extends Os{constructor(e){super(e)}load(e,t,n,i){const r=new Ut,a=new xd(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class rs extends At{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class yd extends rs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const va=new Ze,Ml=new I,yl=new I;class Oo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.map=null,this.mapPass=null,this.matrix=new Ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lo,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ml.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ml),yl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(yl),t.updateMatrixWorld(),va.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(va),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(va)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class wd extends Oo{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=es*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class bd extends rs{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new wd}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const wl=new Ze,vs=new I,xa=new I;class Td extends Oo{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xe(4,2),this._viewportCount=6,this._viewports=[new ut(2,1,1,1),new ut(0,1,1,1),new ut(3,1,1,1),new ut(1,1,1,1),new ut(3,0,1,1),new ut(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vs.setFromMatrixPosition(e.matrixWorld),n.position.copy(vs),xa.copy(n.position),xa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(xa),n.updateMatrixWorld(),i.makeTranslation(-vs.x,-vs.y,-vs.z),wl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wl)}}class gi extends rs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Td}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class zr extends Uc{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class _d extends Oo{constructor(){super(new zr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Yc extends rs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.shadow=new _d}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ad extends rs{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ed extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class Cd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=bl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=bl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function bl(){return performance.now()}function Tl(s,e,t,n){const i=Rd(n);switch(t){case xc:return s*e;case Mc:return s*e;case yc:return s*e*2;case Fs:return s*e/i.components*i.byteLength;case Eo:return s*e/i.components*i.byteLength;case wc:return s*e*2/i.components*i.byteLength;case Co:return s*e*2/i.components*i.byteLength;case Sc:return s*e*3/i.components*i.byteLength;case It:return s*e*4/i.components*i.byteLength;case Ro:return s*e*4/i.components*i.byteLength;case xr:case Sr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Mr:case yr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Xa:case qa:return Math.max(s,16)*Math.max(e,8)/4;case Wa:case Ya:return Math.max(s,8)*Math.max(e,8)/2;case Za:case Ka:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ja:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case $a:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case eo:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case to:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case no:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case io:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case so:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case ro:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ao:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case oo:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case lo:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case co:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ho:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case wr:case uo:case fo:return Math.ceil(s/4)*Math.ceil(e/4)*16;case bc:case po:return Math.ceil(s/4)*Math.ceil(e/4)*8;case mo:case go:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Rd(s){switch(s){case zn:case mc:return{byteLength:1,components:1};case Ds:case gc:case Ct:return{byteLength:2,components:1};case _o:case Ao:return{byteLength:2,components:4};case yn:case To:case Zt:return{byteLength:4,components:1};case vc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ir}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ir);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function qc(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Pd(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Dd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ld=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Id=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ud=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Od=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,kd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Wd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Xd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Yd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$d=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ef=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,nf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,af=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,of=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lf="gl_FragColor = linearToOutputTexel( gl_FragColor );",cf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,df=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ff=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Mf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Tf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_f=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Af=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ef=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Df=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,If=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Uf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ff=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Of=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Hf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Zf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Qf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$f=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ep=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,np=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ip=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ap=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,up=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,pp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,mp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,vp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Sp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Mp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_p=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ap=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Up=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Np=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Op=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Bp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Hp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Gp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Yp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,jp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Jp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$p=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,em=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,im=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,om=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,cm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:Dd,alphahash_pars_fragment:Ld,alphamap_fragment:Id,alphamap_pars_fragment:Ud,alphatest_fragment:Nd,alphatest_pars_fragment:Fd,aomap_fragment:zd,aomap_pars_fragment:Od,batching_pars_vertex:Bd,batching_vertex:kd,begin_vertex:Hd,beginnormal_vertex:Gd,bsdfs:Vd,iridescence_fragment:Wd,bumpmap_pars_fragment:Xd,clipping_planes_fragment:Yd,clipping_planes_pars_fragment:qd,clipping_planes_pars_vertex:Zd,clipping_planes_vertex:Kd,color_fragment:jd,color_pars_fragment:Qd,color_pars_vertex:Jd,color_vertex:$d,common:ef,cube_uv_reflection_fragment:tf,defaultnormal_vertex:nf,displacementmap_pars_vertex:sf,displacementmap_vertex:rf,emissivemap_fragment:af,emissivemap_pars_fragment:of,colorspace_fragment:lf,colorspace_pars_fragment:cf,envmap_fragment:hf,envmap_common_pars_fragment:uf,envmap_pars_fragment:df,envmap_pars_vertex:ff,envmap_physical_pars_fragment:Tf,envmap_vertex:pf,fog_vertex:mf,fog_pars_vertex:gf,fog_fragment:vf,fog_pars_fragment:xf,gradientmap_pars_fragment:Sf,lightmap_pars_fragment:Mf,lights_lambert_fragment:yf,lights_lambert_pars_fragment:wf,lights_pars_begin:bf,lights_toon_fragment:_f,lights_toon_pars_fragment:Af,lights_phong_fragment:Ef,lights_phong_pars_fragment:Cf,lights_physical_fragment:Rf,lights_physical_pars_fragment:Pf,lights_fragment_begin:Df,lights_fragment_maps:Lf,lights_fragment_end:If,logdepthbuf_fragment:Uf,logdepthbuf_pars_fragment:Nf,logdepthbuf_pars_vertex:Ff,logdepthbuf_vertex:zf,map_fragment:Of,map_pars_fragment:Bf,map_particle_fragment:kf,map_particle_pars_fragment:Hf,metalnessmap_fragment:Gf,metalnessmap_pars_fragment:Vf,morphinstance_vertex:Wf,morphcolor_vertex:Xf,morphnormal_vertex:Yf,morphtarget_pars_vertex:qf,morphtarget_vertex:Zf,normal_fragment_begin:Kf,normal_fragment_maps:jf,normal_pars_fragment:Qf,normal_pars_vertex:Jf,normal_vertex:$f,normalmap_pars_fragment:ep,clearcoat_normal_fragment_begin:tp,clearcoat_normal_fragment_maps:np,clearcoat_pars_fragment:ip,iridescence_pars_fragment:sp,opaque_fragment:rp,packing:ap,premultiplied_alpha_fragment:op,project_vertex:lp,dithering_fragment:cp,dithering_pars_fragment:hp,roughnessmap_fragment:up,roughnessmap_pars_fragment:dp,shadowmap_pars_fragment:fp,shadowmap_pars_vertex:pp,shadowmap_vertex:mp,shadowmask_pars_fragment:gp,skinbase_vertex:vp,skinning_pars_vertex:xp,skinning_vertex:Sp,skinnormal_vertex:Mp,specularmap_fragment:yp,specularmap_pars_fragment:wp,tonemapping_fragment:bp,tonemapping_pars_fragment:Tp,transmission_fragment:_p,transmission_pars_fragment:Ap,uv_pars_fragment:Ep,uv_pars_vertex:Cp,uv_vertex:Rp,worldpos_vertex:Pp,background_vert:Dp,background_frag:Lp,backgroundCube_vert:Ip,backgroundCube_frag:Up,cube_vert:Np,cube_frag:Fp,depth_vert:zp,depth_frag:Op,distanceRGBA_vert:Bp,distanceRGBA_frag:kp,equirect_vert:Hp,equirect_frag:Gp,linedashed_vert:Vp,linedashed_frag:Wp,meshbasic_vert:Xp,meshbasic_frag:Yp,meshlambert_vert:qp,meshlambert_frag:Zp,meshmatcap_vert:Kp,meshmatcap_frag:jp,meshnormal_vert:Qp,meshnormal_frag:Jp,meshphong_vert:$p,meshphong_frag:em,meshphysical_vert:tm,meshphysical_frag:nm,meshtoon_vert:im,meshtoon_frag:sm,points_vert:rm,points_frag:am,shadow_vert:om,shadow_frag:lm,sprite_vert:cm,sprite_frag:hm},Ne={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Sn={basic:{uniforms:Yt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Yt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new ze(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Yt([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Yt([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Yt([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new ze(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Yt([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Yt([Ne.points,Ne.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Yt([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Yt([Ne.common,Ne.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Yt([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Yt([Ne.sprite,Ne.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:Yt([Ne.common,Ne.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:Yt([Ne.lights,Ne.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Sn.physical={uniforms:Yt([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const ur={r:0,b:0,g:0},ai=new gn,um=new Ze;function dm(s,e,t,n,i,r,a){const o=new ze(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function v(y){let x=!1;const b=g(y);b===null?m(o,l):b&&b.isColor&&(m(b,1),x=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(y,x){const b=g(x);b&&(b.isCubeTexture||b.mapping===Ur)?(h===void 0&&(h=new Ee(new Re(1,1,1),new ft({name:"BackgroundCubeMaterial",uniforms:ts(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,_,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ai.copy(x.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=b,h.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(um.makeRotationFromEuler(ai)),h.material.toneMapped=at.getTransfer(b.colorSpace)!==dt,(u!==b||d!==b.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=b,d=b.version,f=s.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new Ee(new $t(2,2),new ft({name:"BackgroundMaterial",uniforms:ts(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=at.getTransfer(b.colorSpace)!==dt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(u!==b||d!==b.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=b,d=b.version,f=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function m(y,x){y.getRGB(ur,Ic(s)),n.buffers.color.setClear(ur.r,ur.g,ur.b,x,a)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,x=1){o.set(y),l=x,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,m(o,l)},render:v,addToRenderList:p,dispose:w}}function fm(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(S,D,z,U,H){let ee=!1;const W=u(U,z,D);r!==W&&(r=W,c(r.object)),ee=f(S,U,z,H),ee&&g(S,U,z,H),H!==null&&e.update(H,s.ELEMENT_ARRAY_BUFFER),(ee||a)&&(a=!1,x(S,D,z,U),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return s.createVertexArray()}function c(S){return s.bindVertexArray(S)}function h(S){return s.deleteVertexArray(S)}function u(S,D,z){const U=z.wireframe===!0;let H=n[S.id];H===void 0&&(H={},n[S.id]=H);let ee=H[D.id];ee===void 0&&(ee={},H[D.id]=ee);let W=ee[U];return W===void 0&&(W=d(l()),ee[U]=W),W}function d(S){const D=[],z=[],U=[];for(let H=0;H<t;H++)D[H]=0,z[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:U,object:S,attributes:{},index:null}}function f(S,D,z,U){const H=r.attributes,ee=D.attributes;let W=0;const Q=z.getAttributes();for(const X in Q)if(Q[X].location>=0){const N=H[X];let O=ee[X];if(O===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(O=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(O=S.instanceColor)),N===void 0||N.attribute!==O||O&&N.data!==O.data)return!0;W++}return r.attributesNum!==W||r.index!==U}function g(S,D,z,U){const H={},ee=D.attributes;let W=0;const Q=z.getAttributes();for(const X in Q)if(Q[X].location>=0){let N=ee[X];N===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(N=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(N=S.instanceColor));const O={};O.attribute=N,N&&N.data&&(O.data=N.data),H[X]=O,W++}r.attributes=H,r.attributesNum=W,r.index=U}function v(){const S=r.newAttributes;for(let D=0,z=S.length;D<z;D++)S[D]=0}function p(S){m(S,0)}function m(S,D){const z=r.newAttributes,U=r.enabledAttributes,H=r.attributeDivisors;z[S]=1,U[S]===0&&(s.enableVertexAttribArray(S),U[S]=1),H[S]!==D&&(s.vertexAttribDivisor(S,D),H[S]=D)}function w(){const S=r.newAttributes,D=r.enabledAttributes;for(let z=0,U=D.length;z<U;z++)D[z]!==S[z]&&(s.disableVertexAttribArray(z),D[z]=0)}function y(S,D,z,U,H,ee,W){W===!0?s.vertexAttribIPointer(S,D,z,H,ee):s.vertexAttribPointer(S,D,z,U,H,ee)}function x(S,D,z,U){v();const H=U.attributes,ee=z.getAttributes(),W=D.defaultAttributeValues;for(const Q in ee){const X=ee[Q];if(X.location>=0){let te=H[Q];if(te===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(te=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(te=S.instanceColor)),te!==void 0){const N=te.normalized,O=te.itemSize,le=e.get(te);if(le===void 0)continue;const Se=le.buffer,Z=le.type,k=le.bytesPerElement,L=Z===s.INT||Z===s.UNSIGNED_INT||te.gpuType===To;if(te.isInterleavedBufferAttribute){const F=te.data,V=F.stride,ce=te.offset;if(F.isInstancedInterleavedBuffer){for(let ie=0;ie<X.locationSize;ie++)m(X.location+ie,F.meshPerAttribute);S.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let ie=0;ie<X.locationSize;ie++)p(X.location+ie);s.bindBuffer(s.ARRAY_BUFFER,Se);for(let ie=0;ie<X.locationSize;ie++)y(X.location+ie,O/X.locationSize,Z,N,V*k,(ce+O/X.locationSize*ie)*k,L)}else{if(te.isInstancedBufferAttribute){for(let F=0;F<X.locationSize;F++)m(X.location+F,te.meshPerAttribute);S.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let F=0;F<X.locationSize;F++)p(X.location+F);s.bindBuffer(s.ARRAY_BUFFER,Se);for(let F=0;F<X.locationSize;F++)y(X.location+F,O/X.locationSize,Z,N,O*k,O/X.locationSize*F*k,L)}}else if(W!==void 0){const N=W[Q];if(N!==void 0)switch(N.length){case 2:s.vertexAttrib2fv(X.location,N);break;case 3:s.vertexAttrib3fv(X.location,N);break;case 4:s.vertexAttrib4fv(X.location,N);break;default:s.vertexAttrib1fv(X.location,N)}}}}w()}function b(){C();for(const S in n){const D=n[S];for(const z in D){const U=D[z];for(const H in U)h(U[H].object),delete U[H];delete D[z]}delete n[S]}}function E(S){if(n[S.id]===void 0)return;const D=n[S.id];for(const z in D){const U=D[z];for(const H in U)h(U[H].object),delete U[H];delete D[z]}delete n[S.id]}function _(S){for(const D in n){const z=n[D];if(z[S.id]===void 0)continue;const U=z[S.id];for(const H in U)h(U[H].object),delete U[H];delete z[S.id]}}function C(){M(),a=!0,r!==i&&(r=i,c(r.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:M,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:p,disableUnusedAttributes:w}}function pm(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function mm(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(_){return!(_!==It&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const C=_===Ct&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==zn&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&_!==Zt&&!C)}function l(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),w=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,E=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:w,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:b,maxSamples:E}}function gm(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new ci,o=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const w=r?0:n,y=w*4;let x=m.clippingState||null;l.value=x,x=h(g,d,y,f);for(let b=0;b!==y;++b)x[b]=t[b];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=f+v*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(p===null||p.length<m)&&(p=new Float32Array(m));for(let y=0,x=f;y!==v;++y,x+=4)a.copy(u[y]).applyMatrix4(w,o),a.normal.toArray(p,x),p[x+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function vm(s){let e=new WeakMap;function t(a,o){return o===Ps?a.mapping=Ji:o===Ga&&(a.mapping=$i),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ps||o===Ga)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Eu(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const qi=4,_l=[.125,.215,.35,.446,.526,.582],di=20,Sa=new zr,Al=new ze;let Ma=null,ya=0,wa=0,ba=!1;const hi=(1+Math.sqrt(5))/2,Gi=1/hi,El=[new I(-hi,Gi,0),new I(hi,Gi,0),new I(-Gi,0,hi),new I(Gi,0,hi),new I(0,hi,-Gi),new I(0,hi,Gi),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],xm=new I;class wo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=xm}=r;Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),wa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ma,ya,wa),this._renderer.xr.enabled=ba,e.scissorTest=!1,dr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ji||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),wa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gt,minFilter:gt,generateMipmaps:!1,type:Ct,format:It,colorSpace:Mi,depthBuffer:!1},i=Cl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Sm(r)),this._blurMaterial=Mm(r,e,t)}return i}_compileMaterial(e){const t=new Ee(this._lodPlanes[0],e);this._renderer.compile(t,Sa)}_sceneToCubeUV(e,t,n,i,r){const l=new Qt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Al),u.toneMapping=Yn,u.autoClear=!1;const g=new ji({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1}),v=new Ee(new Re,g);let p=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,p=!0):(g.color.copy(Al),p=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));const x=this._cubeSize;dr(i,y*x,w>2?x:0,x,x),u.setRenderTarget(i),p&&u.render(v,l),u.render(e,l)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ji||e.mapping===$i;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new Ee(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;dr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Sa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=El[(i-r-1)%El.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ee(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*di-1),v=r/g,p=isFinite(r)?1+Math.floor(h*v):di;p>di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${di}`);const m=[];let w=0;for(let _=0;_<di;++_){const C=_/v,M=Math.exp(-C*C/2);m.push(M),_===0?w+=M:_<p&&(w+=2*M)}for(let _=0;_<m.length;_++)m[_]=m[_]/w;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const x=this._sizeLods[i],b=3*x*(i>y-qi?i-y+qi:0),E=4*(this._cubeSize-x);dr(t,b,E,3*x,2*x),l.setRenderTarget(t),l.render(u,Sa)}}function Sm(s){const e=[],t=[],n=[];let i=s;const r=s-qi+1+_l.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-qi?l=_l[a-s+qi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,p=2,m=1,w=new Float32Array(v*g*f),y=new Float32Array(p*g*f),x=new Float32Array(m*g*f);for(let E=0;E<f;E++){const _=E%3*2/3-1,C=E>2?0:-1,M=[_,C,0,_+2/3,C,0,_+2/3,C+1,0,_,C,0,_+2/3,C+1,0,_,C+1,0];w.set(M,v*g*E),y.set(d,p*g*E);const S=[E,E,E,E,E,E];x.set(S,m*g*E)}const b=new xt;b.setAttribute("position",new vt(w,v)),b.setAttribute("uv",new vt(y,p)),b.setAttribute("faceIndex",new vt(x,m)),e.push(b),i>qi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Cl(s,e,t){const n=new Tt(s,e,t);return n.texture.mapping=Ur,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function dr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Mm(s,e,t){const n=new Float32Array(di),i=new I(0,1,0);return new ft({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Rl(){return new ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Pl(){return new ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Bo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ym(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ps||l===Ga,h=l===Ji||l===$i;if(c||h){let u=e.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new wo(s)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new wo(s)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function wm(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&li("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function bm(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const w=f.array;v=f.version;for(let y=0,x=w.length;y<x;y+=3){const b=w[y+0],E=w[y+1],_=w[y+2];d.push(b,E,E,_,_,b)}}else if(g!==void 0){const w=g.array;v=g.version;for(let y=0,x=w.length/3-1;y<x;y+=3){const b=y+0,E=y+1,_=y+2;d.push(b,E,E,_,_,b)}}else return;const p=new(Ac(d)?Lc:Dc)(d,1);p.version=v;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Tm(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*a),t.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*a,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let p=0;for(let m=0;m<g;m++)p+=f[m];t.update(p,n,1)}function u(d,f,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)c(d[m]/a,f[m],v[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let m=0;for(let w=0;w<g;w++)m+=f[w]*v[w];t.update(m,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function _m(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Am(s,e,t){const n=new WeakMap,i=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var f=S;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),v===!0&&(x=2),p===!0&&(x=3);let b=o.attributes.position.count*x,E=1;b>e.maxTextureSize&&(E=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const _=new Float32Array(b*E*4*u),C=new Ec(_,b,E,u);C.type=Zt,C.needsUpdate=!0;const M=x*4;for(let D=0;D<u;D++){const z=m[D],U=w[D],H=y[D],ee=b*E*4*D;for(let W=0;W<z.count;W++){const Q=W*M;g===!0&&(i.fromBufferAttribute(z,W),_[ee+Q+0]=i.x,_[ee+Q+1]=i.y,_[ee+Q+2]=i.z,_[ee+Q+3]=0),v===!0&&(i.fromBufferAttribute(U,W),_[ee+Q+4]=i.x,_[ee+Q+5]=i.y,_[ee+Q+6]=i.z,_[ee+Q+7]=0),p===!0&&(i.fromBufferAttribute(H,W),_[ee+Q+8]=i.x,_[ee+Q+9]=i.y,_[ee+Q+10]=i.z,_[ee+Q+11]=H.itemSize===4?i.w:1)}}d={count:u,texture:C,size:new xe(b,E)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Em(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Zc=new Ut,Dl=new Ts(1,1),Kc=new Ec,jc=new lu,Qc=new Nc,Ll=[],Il=[],Ul=new Float32Array(16),Nl=new Float32Array(9),Fl=new Float32Array(4);function as(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Ll[i];if(r===void 0&&(r=new Float32Array(i),Ll[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Nt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ft(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Or(s,e){let t=Il[e];t===void 0&&(t=new Int32Array(e),Il[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Cm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Rm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2fv(this.addr,e),Ft(t,e)}}function Pm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;s.uniform3fv(this.addr,e),Ft(t,e)}}function Dm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4fv(this.addr,e),Ft(t,e)}}function Lm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;Fl.set(n),s.uniformMatrix2fv(this.addr,!1,Fl),Ft(t,n)}}function Im(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;Nl.set(n),s.uniformMatrix3fv(this.addr,!1,Nl),Ft(t,n)}}function Um(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ft(t,e)}else{if(Nt(t,n))return;Ul.set(n),s.uniformMatrix4fv(this.addr,!1,Ul),Ft(t,n)}}function Nm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Fm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2iv(this.addr,e),Ft(t,e)}}function zm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;s.uniform3iv(this.addr,e),Ft(t,e)}}function Om(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4iv(this.addr,e),Ft(t,e)}}function Bm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function km(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2uiv(this.addr,e),Ft(t,e)}}function Hm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;s.uniform3uiv(this.addr,e),Ft(t,e)}}function Gm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4uiv(this.addr,e),Ft(t,e)}}function Vm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Dl.compareFunction=_c,r=Dl):r=Zc,t.setTexture2D(e||r,i)}function Wm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||jc,i)}function Xm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Qc,i)}function Ym(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Kc,i)}function qm(s){switch(s){case 5126:return Cm;case 35664:return Rm;case 35665:return Pm;case 35666:return Dm;case 35674:return Lm;case 35675:return Im;case 35676:return Um;case 5124:case 35670:return Nm;case 35667:case 35671:return Fm;case 35668:case 35672:return zm;case 35669:case 35673:return Om;case 5125:return Bm;case 36294:return km;case 36295:return Hm;case 36296:return Gm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return Ym}}function Zm(s,e){s.uniform1fv(this.addr,e)}function Km(s,e){const t=as(e,this.size,2);s.uniform2fv(this.addr,t)}function jm(s,e){const t=as(e,this.size,3);s.uniform3fv(this.addr,t)}function Qm(s,e){const t=as(e,this.size,4);s.uniform4fv(this.addr,t)}function Jm(s,e){const t=as(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function $m(s,e){const t=as(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function e0(s,e){const t=as(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function t0(s,e){s.uniform1iv(this.addr,e)}function n0(s,e){s.uniform2iv(this.addr,e)}function i0(s,e){s.uniform3iv(this.addr,e)}function s0(s,e){s.uniform4iv(this.addr,e)}function r0(s,e){s.uniform1uiv(this.addr,e)}function a0(s,e){s.uniform2uiv(this.addr,e)}function o0(s,e){s.uniform3uiv(this.addr,e)}function l0(s,e){s.uniform4uiv(this.addr,e)}function c0(s,e,t){const n=this.cache,i=e.length,r=Or(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Zc,r[a])}function h0(s,e,t){const n=this.cache,i=e.length,r=Or(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||jc,r[a])}function u0(s,e,t){const n=this.cache,i=e.length,r=Or(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Qc,r[a])}function d0(s,e,t){const n=this.cache,i=e.length,r=Or(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),Ft(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Kc,r[a])}function f0(s){switch(s){case 5126:return Zm;case 35664:return Km;case 35665:return jm;case 35666:return Qm;case 35674:return Jm;case 35675:return $m;case 35676:return e0;case 5124:case 35670:return t0;case 35667:case 35671:return n0;case 35668:case 35672:return i0;case 35669:case 35673:return s0;case 5125:return r0;case 36294:return a0;case 36295:return o0;case 36296:return l0;case 35678:case 36198:case 36298:case 36306:case 35682:return c0;case 35679:case 36299:case 36307:return h0;case 35680:case 36300:case 36308:case 36293:return u0;case 36289:case 36303:case 36311:case 36292:return d0}}class p0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qm(t.type)}}class m0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=f0(t.type)}}class g0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function zl(s,e){s.seq.push(e),s.map[e.id]=e}function v0(s,e,t){const n=s.name,i=n.length;for(Ta.lastIndex=0;;){const r=Ta.exec(n),a=Ta.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){zl(t,c===void 0?new p0(o,s,e):new m0(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new g0(o),zl(t,u)),t=u}}}class br{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);v0(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Ol(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const x0=37297;let S0=0;function M0(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Bl=new tt;function y0(s){at._getMatrix(Bl,at.workingColorSpace,s);const e=`mat3( ${Bl.elements.map(t=>t.toFixed(4))} )`;switch(at.getTransfer(s)){case Ar:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function kl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+M0(s.getShaderSource(e),a)}else return i}function w0(s,e){const t=y0(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function b0(s,e){let t;switch(e){case lc:t="Linear";break;case cc:t="Reinhard";break;case hc:t="Cineon";break;case uc:t="ACESFilmic";break;case _r:t="AgX";break;case fc:t="Neutral";break;case dc:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fr=new I;function T0(){at.getLuminanceCoefficients(fr);const s=fr.x.toFixed(4),e=fr.y.toFixed(4),t=fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function A0(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function E0(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Ms(s){return s!==""}function Hl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const C0=/^[ \t]*#include +<([\w\d./]+)>/gm;function bo(s){return s.replace(C0,P0)}const R0=new Map;function P0(s,e){let t=$e[e];if(t===void 0){const n=R0.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return bo(t)}const D0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vl(s){return s.replace(D0,L0)}function L0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Wl(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function I0(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===rc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===ac?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Dn&&(e="SHADOWMAP_TYPE_VSM"),e}function U0(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ji:case $i:e="ENVMAP_TYPE_CUBE";break;case Ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function N0(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case $i:e="ENVMAP_MODE_REFRACTION";break}return e}function F0(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case oc:e="ENVMAP_BLENDING_MULTIPLY";break;case Th:e="ENVMAP_BLENDING_MIX";break;case _h:e="ENVMAP_BLENDING_ADD";break}return e}function z0(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function O0(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=I0(t),c=U0(t),h=N0(t),u=F0(t),d=z0(t),f=_0(t),g=A0(r),v=i.createProgram();let p,m,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ms).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`)):(p=[Wl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),m=[Wl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Yn?"#define TONE_MAPPING":"",t.toneMapping!==Yn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Yn?b0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,w0("linearToOutputTexel",t.outputColorSpace),T0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ms).join(`
`)),a=bo(a),a=Hl(a,t),a=Gl(a,t),o=bo(o),o=Hl(o,t),o=Gl(o,t),a=Vl(a),o=Vl(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Xo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=w+p+a,x=w+m+o,b=Ol(i,i.VERTEX_SHADER,y),E=Ol(i,i.FRAGMENT_SHADER,x);i.attachShader(v,b),i.attachShader(v,E),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function _(D){if(s.debug.checkShaderErrors){const z=i.getProgramInfoLog(v).trim(),U=i.getShaderInfoLog(b).trim(),H=i.getShaderInfoLog(E).trim();let ee=!0,W=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(ee=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,b,E);else{const Q=kl(i,b,"vertex"),X=kl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+z+`
`+Q+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(U===""||H==="")&&(W=!1);W&&(D.diagnostics={runnable:ee,programLog:z,vertexShader:{log:U,prefix:p},fragmentShader:{log:H,prefix:m}})}i.deleteShader(b),i.deleteShader(E),C=new br(i,v),M=E0(i,v)}let C;this.getUniforms=function(){return C===void 0&&_(this),C};let M;this.getAttributes=function(){return M===void 0&&_(this),M};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(v,x0)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=S0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=E,this}let B0=0;class k0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new H0(e),t.set(e,n)),n}}class H0{constructor(e){this.id=B0++,this.code=e,this.usedTimes=0}}function G0(s,e,t,n,i,r,a){const o=new Rc,l=new k0,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,S,D,z,U){const H=z.fog,ee=U.geometry,W=M.isMeshStandardMaterial?z.environment:null,Q=(M.isMeshStandardMaterial?t:e).get(M.envMap||W),X=Q&&Q.mapping===Ur?Q.image.height:null,te=g[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const N=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,O=N!==void 0?N.length:0;let le=0;ee.morphAttributes.position!==void 0&&(le=1),ee.morphAttributes.normal!==void 0&&(le=2),ee.morphAttributes.color!==void 0&&(le=3);let Se,Z,k,L;if(te){const it=Sn[te];Se=it.vertexShader,Z=it.fragmentShader}else Se=M.vertexShader,Z=M.fragmentShader,l.update(M),k=l.getVertexShaderID(M),L=l.getFragmentShaderID(M);const F=s.getRenderTarget(),V=s.state.buffers.depth.getReversed(),ce=U.isInstancedMesh===!0,ie=U.isBatchedMesh===!0,se=!!M.map,Y=!!M.matcap,ne=!!Q,R=!!M.aoMap,fe=!!M.lightMap,ue=!!M.bumpMap,Te=!!M.normalMap,j=!!M.displacementMap,J=!!M.emissiveMap,re=!!M.metalnessMap,P=!!M.roughnessMap,T=M.anisotropy>0,$=M.clearcoat>0,oe=M.dispersion>0,pe=M.iridescence>0,he=M.sheen>0,Ae=M.transmission>0,ve=T&&!!M.anisotropyMap,Me=$&&!!M.clearcoatMap,Fe=$&&!!M.clearcoatNormalMap,we=$&&!!M.clearcoatRoughnessMap,Ie=pe&&!!M.iridescenceMap,ke=pe&&!!M.iridescenceThicknessMap,De=he&&!!M.sheenColorMap,be=he&&!!M.sheenRoughnessMap,We=!!M.specularMap,Oe=!!M.specularColorMap,Ke=!!M.specularIntensityMap,q=Ae&&!!M.transmissionMap,Ce=Ae&&!!M.thicknessMap,ge=!!M.gradientMap,me=!!M.alphaMap,Pe=M.alphaTest>0,Le=!!M.alphaHash,Ve=!!M.extensions;let st=Yn;M.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(st=s.toneMapping);const lt={shaderID:te,shaderType:M.type,shaderName:M.name,vertexShader:Se,fragmentShader:Z,defines:M.defines,customVertexShaderID:k,customFragmentShaderID:L,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:ie,batchingColor:ie&&U._colorsTexture!==null,instancing:ce,instancingColor:ce&&U.instanceColor!==null,instancingMorph:ce&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:F===null?s.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Mi,alphaToCoverage:!!M.alphaToCoverage,map:se,matcap:Y,envMap:ne,envMapMode:ne&&Q.mapping,envMapCubeUVHeight:X,aoMap:R,lightMap:fe,bumpMap:ue,normalMap:Te,displacementMap:d&&j,emissiveMap:J,normalMapObjectSpace:Te&&M.normalMapType===Rh,normalMapTangentSpace:Te&&M.normalMapType===Tc,metalnessMap:re,roughnessMap:P,anisotropy:T,anisotropyMap:ve,clearcoat:$,clearcoatMap:Me,clearcoatNormalMap:Fe,clearcoatRoughnessMap:we,dispersion:oe,iridescence:pe,iridescenceMap:Ie,iridescenceThicknessMap:ke,sheen:he,sheenColorMap:De,sheenRoughnessMap:be,specularMap:We,specularColorMap:Oe,specularIntensityMap:Ke,transmission:Ae,transmissionMap:q,thicknessMap:Ce,gradientMap:ge,opaque:M.transparent===!1&&M.blending===Zi&&M.alphaToCoverage===!1,alphaMap:me,alphaTest:Pe,alphaHash:Le,combine:M.combine,mapUv:se&&v(M.map.channel),aoMapUv:R&&v(M.aoMap.channel),lightMapUv:fe&&v(M.lightMap.channel),bumpMapUv:ue&&v(M.bumpMap.channel),normalMapUv:Te&&v(M.normalMap.channel),displacementMapUv:j&&v(M.displacementMap.channel),emissiveMapUv:J&&v(M.emissiveMap.channel),metalnessMapUv:re&&v(M.metalnessMap.channel),roughnessMapUv:P&&v(M.roughnessMap.channel),anisotropyMapUv:ve&&v(M.anisotropyMap.channel),clearcoatMapUv:Me&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Fe&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ie&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:De&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:be&&v(M.sheenRoughnessMap.channel),specularMapUv:We&&v(M.specularMap.channel),specularColorMapUv:Oe&&v(M.specularColorMap.channel),specularIntensityMapUv:Ke&&v(M.specularIntensityMap.channel),transmissionMapUv:q&&v(M.transmissionMap.channel),thicknessMapUv:Ce&&v(M.thicknessMap.channel),alphaMapUv:me&&v(M.alphaMap.channel),vertexTangents:!!ee.attributes.tangent&&(Te||T),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!ee.attributes.uv&&(se||me),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:V,skinning:U.isSkinnedMesh===!0,morphTargets:ee.morphAttributes.position!==void 0,morphNormals:ee.morphAttributes.normal!==void 0,morphColors:ee.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:le,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:st,decodeVideoTexture:se&&M.map.isVideoTexture===!0&&at.getTransfer(M.map.colorSpace)===dt,decodeVideoTextureEmissive:J&&M.emissiveMap.isVideoTexture===!0&&at.getTransfer(M.emissiveMap.colorSpace)===dt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===qt,flipSided:M.side===Jt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ve&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&M.extensions.multiDraw===!0||ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return lt.vertexUv1s=c.has(1),lt.vertexUv2s=c.has(2),lt.vertexUv3s=c.has(3),c.clear(),lt}function m(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)S.push(D),S.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(w(S,M),y(S,M),S.push(s.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function w(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function y(M,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const S=g[M.type];let D;if(S){const z=Sn[S];D=Zn.clone(z.uniforms)}else D=M.uniforms;return D}function b(M,S){let D;for(let z=0,U=h.length;z<U;z++){const H=h[z];if(H.cacheKey===S){D=H,++D.usedTimes;break}}return D===void 0&&(D=new O0(s,S,M,r),h.push(D)),D}function E(M){if(--M.usedTimes===0){const S=h.indexOf(M);h[S]=h[h.length-1],h.pop(),M.destroy()}}function _(M){l.remove(M)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:x,acquireProgram:b,releaseProgram:E,releaseShaderCache:_,programs:h,dispose:C}}function V0(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function W0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Xl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Yl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u,d,f,g,v,p){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:p},s[e]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=v,m.group=p),e++,m}function o(u,d,f,g,v,p){const m=a(u,d,f,g,v,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(u,d,f,g,v,p){const m=a(u,d,f,g,v,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function c(u,d){t.length>1&&t.sort(u||W0),n.length>1&&n.sort(d||Xl),i.length>1&&i.sort(d||Xl)}function h(){for(let u=e,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function X0(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new Yl,s.set(n,[a])):i>=r.length?(a=new Yl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Y0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new ze};break;case"SpotLight":t={position:new I,direction:new I,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function q0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Z0=0;function K0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function j0(s){const e=new Y0,t=q0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new Ze,a=new Ze;function o(c){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,w=0,y=0,x=0,b=0,E=0,_=0;c.sort(K0);for(let M=0,S=c.length;M<S;M++){const D=c[M],z=D.color,U=D.intensity,H=D.distance,ee=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=z.r*U,u+=z.g*U,d+=z.b*U;else if(D.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(D.sh.coefficients[W],U);_++}else if(D.isDirectionalLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Q=D.shadow,X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=ee,n.directionalShadowMatrix[f]=D.shadow.matrix,w++}n.directional[f]=W,f++}else if(D.isSpotLight){const W=e.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(z).multiplyScalar(U),W.distance=H,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,n.spot[v]=W;const Q=D.shadow;if(D.map&&(n.spotLightMap[b]=D.map,b++,Q.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[v]=Q.matrix,D.castShadow){const X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,n.spotShadow[v]=X,n.spotShadowMap[v]=ee,x++}v++}else if(D.isRectAreaLight){const W=e.get(D);W.color.copy(z).multiplyScalar(U),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),n.rectArea[p]=W,p++}else if(D.isPointLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const Q=D.shadow,X=t.get(D);X.shadowIntensity=Q.intensity,X.shadowBias=Q.bias,X.shadowNormalBias=Q.normalBias,X.shadowRadius=Q.radius,X.shadowMapSize=Q.mapSize,X.shadowCameraNear=Q.camera.near,X.shadowCameraFar=Q.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=ee,n.pointShadowMatrix[g]=D.shadow.matrix,y++}n.point[g]=W,g++}else if(D.isHemisphereLight){const W=e.get(D);W.skyColor.copy(D.color).multiplyScalar(U),W.groundColor.copy(D.groundColor).multiplyScalar(U),n.hemi[m]=W,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ne.LTC_FLOAT_1,n.rectAreaLTC2=Ne.LTC_FLOAT_2):(n.rectAreaLTC1=Ne.LTC_HALF_1,n.rectAreaLTC2=Ne.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==w||C.numPointShadows!==y||C.numSpotShadows!==x||C.numSpotMaps!==b||C.numLightProbes!==_)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+b-E,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=_,C.directionalLength=f,C.pointLength=g,C.spotLength=v,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=w,C.numPointShadows=y,C.numSpotShadows=x,C.numSpotMaps=b,C.numLightProbes=_,n.version=Z0++)}function l(c,h){let u=0,d=0,f=0,g=0,v=0;const p=h.matrixWorldInverse;for(let m=0,w=c.length;m<w;m++){const y=c[m];if(y.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(p),u++}else if(y.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(p),f++}else if(y.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:n}}function ql(s){const e=new j0(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Q0(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new ql(s),e.set(i,[o])):r>=a.length?(o=new ql(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const J0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function eg(s,e,t){let n=new Lo;const i=new xe,r=new xe,a=new ut,o=new dd({depthPacking:Ch}),l=new fd,c={},h=t.maxTextureSize,u={[Qn]:Jt,[Jt]:Qn,[qt]:qt},d=new ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:J0,fragmentShader:$0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new xt;g.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ee(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rc;let m=this.type;this.render=function(E,_,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;const M=s.getRenderTarget(),S=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),z=s.state;z.setBlending(Nn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const U=m!==Dn&&this.type===Dn,H=m===Dn&&this.type!==Dn;for(let ee=0,W=E.length;ee<W;ee++){const Q=E[ee],X=Q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const te=X.getFrameExtents();if(i.multiply(te),r.copy(X.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/te.x),i.x=r.x*te.x,X.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/te.y),i.y=r.y*te.y,X.mapSize.y=r.y)),X.map===null||U===!0||H===!0){const O=this.type!==Dn?{minFilter:Mt,magFilter:Mt}:{};X.map!==null&&X.map.dispose(),X.map=new Tt(i.x,i.y,O),X.map.texture.name=Q.name+".shadowMap",X.camera.updateProjectionMatrix()}s.setRenderTarget(X.map),s.clear();const N=X.getViewportCount();for(let O=0;O<N;O++){const le=X.getViewport(O);a.set(r.x*le.x,r.y*le.y,r.x*le.z,r.y*le.w),z.viewport(a),X.updateMatrices(Q,O),n=X.getFrustum(),x(_,C,X.camera,Q,this.type)}X.isPointLightShadow!==!0&&this.type===Dn&&w(X,C),X.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(M,S,D)};function w(E,_){const C=e.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Tt(i.x,i.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(_,null,C,d,v,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(_,null,C,f,v,null)}function y(E,_,C,M){let S=null;const D=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)S=D;else if(S=C.isPointLight===!0?l:o,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0){const z=S.uuid,U=_.uuid;let H=c[z];H===void 0&&(H={},c[z]=H);let ee=H[U];ee===void 0&&(ee=S.clone(),H[U]=ee,_.addEventListener("dispose",b)),S=ee}if(S.visible=_.visible,S.wireframe=_.wireframe,M===Dn?S.side=_.shadowSide!==null?_.shadowSide:_.side:S.side=_.shadowSide!==null?_.shadowSide:u[_.side],S.alphaMap=_.alphaMap,S.alphaTest=_.alphaTest,S.map=_.map,S.clipShadows=_.clipShadows,S.clippingPlanes=_.clippingPlanes,S.clipIntersection=_.clipIntersection,S.displacementMap=_.displacementMap,S.displacementScale=_.displacementScale,S.displacementBias=_.displacementBias,S.wireframeLinewidth=_.wireframeLinewidth,S.linewidth=_.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const z=s.properties.get(S);z.light=C}return S}function x(E,_,C,M,S){if(E.visible===!1)return;if(E.layers.test(_.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===Dn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const U=e.update(E),H=E.material;if(Array.isArray(H)){const ee=U.groups;for(let W=0,Q=ee.length;W<Q;W++){const X=ee[W],te=H[X.materialIndex];if(te&&te.visible){const N=y(E,te,M,S);E.onBeforeShadow(s,E,_,C,U,N,X),s.renderBufferDirect(C,null,U,N,E,X),E.onAfterShadow(s,E,_,C,U,N,X)}}}else if(H.visible){const ee=y(E,H,M,S);E.onBeforeShadow(s,E,_,C,U,ee,null),s.renderBufferDirect(C,null,U,ee,E,null),E.onAfterShadow(s,E,_,C,U,ee,null)}}const z=E.children;for(let U=0,H=z.length;U<H;U++)x(z[U],_,C,M,S)}function b(E){E.target.removeEventListener("dispose",b);for(const C in c){const M=c[C],S=E.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const tg={[Na]:Fa,[za]:ka,[Oa]:Ha,[Qi]:Ba,[Fa]:Na,[ka]:za,[Ha]:Oa,[Ba]:Qi};function ng(s,e){function t(){let q=!1;const Ce=new ut;let ge=null;const me=new ut(0,0,0,0);return{setMask:function(Pe){ge!==Pe&&!q&&(s.colorMask(Pe,Pe,Pe,Pe),ge=Pe)},setLocked:function(Pe){q=Pe},setClear:function(Pe,Le,Ve,st,lt){lt===!0&&(Pe*=st,Le*=st,Ve*=st),Ce.set(Pe,Le,Ve,st),me.equals(Ce)===!1&&(s.clearColor(Pe,Le,Ve,st),me.copy(Ce))},reset:function(){q=!1,ge=null,me.set(-1,0,0,0)}}}function n(){let q=!1,Ce=!1,ge=null,me=null,Pe=null;return{setReversed:function(Le){if(Ce!==Le){const Ve=e.get("EXT_clip_control");Ce?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT);const st=Pe;Pe=null,this.setClear(st)}Ce=Le},getReversed:function(){return Ce},setTest:function(Le){Le?F(s.DEPTH_TEST):V(s.DEPTH_TEST)},setMask:function(Le){ge!==Le&&!q&&(s.depthMask(Le),ge=Le)},setFunc:function(Le){if(Ce&&(Le=tg[Le]),me!==Le){switch(Le){case Na:s.depthFunc(s.NEVER);break;case Fa:s.depthFunc(s.ALWAYS);break;case za:s.depthFunc(s.LESS);break;case Qi:s.depthFunc(s.LEQUAL);break;case Oa:s.depthFunc(s.EQUAL);break;case Ba:s.depthFunc(s.GEQUAL);break;case ka:s.depthFunc(s.GREATER);break;case Ha:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}me=Le}},setLocked:function(Le){q=Le},setClear:function(Le){Pe!==Le&&(Ce&&(Le=1-Le),s.clearDepth(Le),Pe=Le)},reset:function(){q=!1,ge=null,me=null,Pe=null,Ce=!1}}}function i(){let q=!1,Ce=null,ge=null,me=null,Pe=null,Le=null,Ve=null,st=null,lt=null;return{setTest:function(it){q||(it?F(s.STENCIL_TEST):V(s.STENCIL_TEST))},setMask:function(it){Ce!==it&&!q&&(s.stencilMask(it),Ce=it)},setFunc:function(it,bt,yt){(ge!==it||me!==bt||Pe!==yt)&&(s.stencilFunc(it,bt,yt),ge=it,me=bt,Pe=yt)},setOp:function(it,bt,yt){(Le!==it||Ve!==bt||st!==yt)&&(s.stencilOp(it,bt,yt),Le=it,Ve=bt,st=yt)},setLocked:function(it){q=it},setClear:function(it){lt!==it&&(s.clearStencil(it),lt=it)},reset:function(){q=!1,Ce=null,ge=null,me=null,Pe=null,Le=null,Ve=null,st=null,lt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,p=null,m=null,w=null,y=null,x=null,b=null,E=null,_=new ze(0,0,0),C=0,M=!1,S=null,D=null,z=null,U=null,H=null;const ee=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Q=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(X)[1]),W=Q>=1):X.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),W=Q>=2);let te=null,N={};const O=s.getParameter(s.SCISSOR_BOX),le=s.getParameter(s.VIEWPORT),Se=new ut().fromArray(O),Z=new ut().fromArray(le);function k(q,Ce,ge,me){const Pe=new Uint8Array(4),Le=s.createTexture();s.bindTexture(q,Le),s.texParameteri(q,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(q,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ve=0;Ve<ge;Ve++)q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,me,0,s.RGBA,s.UNSIGNED_BYTE,Pe):s.texImage2D(Ce+Ve,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Pe);return Le}const L={};L[s.TEXTURE_2D]=k(s.TEXTURE_2D,s.TEXTURE_2D,1),L[s.TEXTURE_CUBE_MAP]=k(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),L[s.TEXTURE_2D_ARRAY]=k(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),L[s.TEXTURE_3D]=k(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),F(s.DEPTH_TEST),a.setFunc(Qi),ue(!1),Te(ko),F(s.CULL_FACE),R(Nn);function F(q){h[q]!==!0&&(s.enable(q),h[q]=!0)}function V(q){h[q]!==!1&&(s.disable(q),h[q]=!1)}function ce(q,Ce){return u[q]!==Ce?(s.bindFramebuffer(q,Ce),u[q]=Ce,q===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=Ce),q===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function ie(q,Ce){let ge=f,me=!1;if(q){ge=d.get(Ce),ge===void 0&&(ge=[],d.set(Ce,ge));const Pe=q.textures;if(ge.length!==Pe.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let Le=0,Ve=Pe.length;Le<Ve;Le++)ge[Le]=s.COLOR_ATTACHMENT0+Le;ge.length=Pe.length,me=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,me=!0);me&&s.drawBuffers(ge)}function se(q){return g!==q?(s.useProgram(q),g=q,!0):!1}const Y={[ui]:s.FUNC_ADD,[oh]:s.FUNC_SUBTRACT,[lh]:s.FUNC_REVERSE_SUBTRACT};Y[ch]=s.MIN,Y[hh]=s.MAX;const ne={[uh]:s.ZERO,[dh]:s.ONE,[fh]:s.SRC_COLOR,[Ia]:s.SRC_ALPHA,[Sh]:s.SRC_ALPHA_SATURATE,[vh]:s.DST_COLOR,[mh]:s.DST_ALPHA,[ph]:s.ONE_MINUS_SRC_COLOR,[Ua]:s.ONE_MINUS_SRC_ALPHA,[xh]:s.ONE_MINUS_DST_COLOR,[gh]:s.ONE_MINUS_DST_ALPHA,[Mh]:s.CONSTANT_COLOR,[yh]:s.ONE_MINUS_CONSTANT_COLOR,[wh]:s.CONSTANT_ALPHA,[bh]:s.ONE_MINUS_CONSTANT_ALPHA};function R(q,Ce,ge,me,Pe,Le,Ve,st,lt,it){if(q===Nn){v===!0&&(V(s.BLEND),v=!1);return}if(v===!1&&(F(s.BLEND),v=!0),q!==ah){if(q!==p||it!==M){if((m!==ui||x!==ui)&&(s.blendEquation(s.FUNC_ADD),m=ui,x=ui),it)switch(q){case Zi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Rs:s.blendFunc(s.ONE,s.ONE);break;case Ho:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Go:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}else switch(q){case Zi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Rs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Ho:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Go:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",q);break}w=null,y=null,b=null,E=null,_.set(0,0,0),C=0,p=q,M=it}return}Pe=Pe||Ce,Le=Le||ge,Ve=Ve||me,(Ce!==m||Pe!==x)&&(s.blendEquationSeparate(Y[Ce],Y[Pe]),m=Ce,x=Pe),(ge!==w||me!==y||Le!==b||Ve!==E)&&(s.blendFuncSeparate(ne[ge],ne[me],ne[Le],ne[Ve]),w=ge,y=me,b=Le,E=Ve),(st.equals(_)===!1||lt!==C)&&(s.blendColor(st.r,st.g,st.b,lt),_.copy(st),C=lt),p=q,M=!1}function fe(q,Ce){q.side===qt?V(s.CULL_FACE):F(s.CULL_FACE);let ge=q.side===Jt;Ce&&(ge=!ge),ue(ge),q.blending===Zi&&q.transparent===!1?R(Nn):R(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),a.setFunc(q.depthFunc),a.setTest(q.depthTest),a.setMask(q.depthWrite),r.setMask(q.colorWrite);const me=q.stencilWrite;o.setTest(me),me&&(o.setMask(q.stencilWriteMask),o.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),o.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),J(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?F(s.SAMPLE_ALPHA_TO_COVERAGE):V(s.SAMPLE_ALPHA_TO_COVERAGE)}function ue(q){S!==q&&(q?s.frontFace(s.CW):s.frontFace(s.CCW),S=q)}function Te(q){q!==sh?(F(s.CULL_FACE),q!==D&&(q===ko?s.cullFace(s.BACK):q===rh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):V(s.CULL_FACE),D=q}function j(q){q!==z&&(W&&s.lineWidth(q),z=q)}function J(q,Ce,ge){q?(F(s.POLYGON_OFFSET_FILL),(U!==Ce||H!==ge)&&(s.polygonOffset(Ce,ge),U=Ce,H=ge)):V(s.POLYGON_OFFSET_FILL)}function re(q){q?F(s.SCISSOR_TEST):V(s.SCISSOR_TEST)}function P(q){q===void 0&&(q=s.TEXTURE0+ee-1),te!==q&&(s.activeTexture(q),te=q)}function T(q,Ce,ge){ge===void 0&&(te===null?ge=s.TEXTURE0+ee-1:ge=te);let me=N[ge];me===void 0&&(me={type:void 0,texture:void 0},N[ge]=me),(me.type!==q||me.texture!==Ce)&&(te!==ge&&(s.activeTexture(ge),te=ge),s.bindTexture(q,Ce||L[q]),me.type=q,me.texture=Ce)}function $(){const q=N[te];q!==void 0&&q.type!==void 0&&(s.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function oe(){try{s.compressedTexImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function pe(){try{s.compressedTexImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function he(){try{s.texSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ae(){try{s.texSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ve(){try{s.compressedTexSubImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Me(){try{s.compressedTexSubImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Fe(){try{s.texStorage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function we(){try{s.texStorage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function Ie(){try{s.texImage2D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function ke(){try{s.texImage3D(...arguments)}catch(q){console.error("THREE.WebGLState:",q)}}function De(q){Se.equals(q)===!1&&(s.scissor(q.x,q.y,q.z,q.w),Se.copy(q))}function be(q){Z.equals(q)===!1&&(s.viewport(q.x,q.y,q.z,q.w),Z.copy(q))}function We(q,Ce){let ge=c.get(Ce);ge===void 0&&(ge=new WeakMap,c.set(Ce,ge));let me=ge.get(q);me===void 0&&(me=s.getUniformBlockIndex(Ce,q.name),ge.set(q,me))}function Oe(q,Ce){const me=c.get(Ce).get(q);l.get(Ce)!==me&&(s.uniformBlockBinding(Ce,me,q.__bindingPointIndex),l.set(Ce,me))}function Ke(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},te=null,N={},u={},d=new WeakMap,f=[],g=null,v=!1,p=null,m=null,w=null,y=null,x=null,b=null,E=null,_=new ze(0,0,0),C=0,M=!1,S=null,D=null,z=null,U=null,H=null,Se.set(0,0,s.canvas.width,s.canvas.height),Z.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:F,disable:V,bindFramebuffer:ce,drawBuffers:ie,useProgram:se,setBlending:R,setMaterial:fe,setFlipSided:ue,setCullFace:Te,setLineWidth:j,setPolygonOffset:J,setScissorTest:re,activeTexture:P,bindTexture:T,unbindTexture:$,compressedTexImage2D:oe,compressedTexImage3D:pe,texImage2D:Ie,texImage3D:ke,updateUBOMapping:We,uniformBlockBinding:Oe,texStorage2D:Fe,texStorage3D:we,texSubImage2D:he,texSubImage3D:Ae,compressedTexSubImage2D:ve,compressedTexSubImage3D:Me,scissor:De,viewport:be,reset:Ke}}function ig(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,T){return f?new OffscreenCanvas(P,T):Ls("canvas")}function v(P,T,$){let oe=1;const pe=re(P);if((pe.width>$||pe.height>$)&&(oe=$/Math.max(pe.width,pe.height)),oe<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const he=Math.floor(oe*pe.width),Ae=Math.floor(oe*pe.height);u===void 0&&(u=g(he,Ae));const ve=T?g(he,Ae):u;return ve.width=he,ve.height=Ae,ve.getContext("2d").drawImage(P,0,0,he,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+pe.width+"x"+pe.height+") to ("+he+"x"+Ae+")."),ve}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+pe.width+"x"+pe.height+")."),P;return P}function p(P){return P.generateMipmaps}function m(P){s.generateMipmap(P)}function w(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(P,T,$,oe,pe=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he=T;if(T===s.RED&&($===s.FLOAT&&(he=s.R32F),$===s.HALF_FLOAT&&(he=s.R16F),$===s.UNSIGNED_BYTE&&(he=s.R8)),T===s.RED_INTEGER&&($===s.UNSIGNED_BYTE&&(he=s.R8UI),$===s.UNSIGNED_SHORT&&(he=s.R16UI),$===s.UNSIGNED_INT&&(he=s.R32UI),$===s.BYTE&&(he=s.R8I),$===s.SHORT&&(he=s.R16I),$===s.INT&&(he=s.R32I)),T===s.RG&&($===s.FLOAT&&(he=s.RG32F),$===s.HALF_FLOAT&&(he=s.RG16F),$===s.UNSIGNED_BYTE&&(he=s.RG8)),T===s.RG_INTEGER&&($===s.UNSIGNED_BYTE&&(he=s.RG8UI),$===s.UNSIGNED_SHORT&&(he=s.RG16UI),$===s.UNSIGNED_INT&&(he=s.RG32UI),$===s.BYTE&&(he=s.RG8I),$===s.SHORT&&(he=s.RG16I),$===s.INT&&(he=s.RG32I)),T===s.RGB_INTEGER&&($===s.UNSIGNED_BYTE&&(he=s.RGB8UI),$===s.UNSIGNED_SHORT&&(he=s.RGB16UI),$===s.UNSIGNED_INT&&(he=s.RGB32UI),$===s.BYTE&&(he=s.RGB8I),$===s.SHORT&&(he=s.RGB16I),$===s.INT&&(he=s.RGB32I)),T===s.RGBA_INTEGER&&($===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),$===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),$===s.UNSIGNED_INT&&(he=s.RGBA32UI),$===s.BYTE&&(he=s.RGBA8I),$===s.SHORT&&(he=s.RGBA16I),$===s.INT&&(he=s.RGBA32I)),T===s.RGB&&$===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),T===s.RGBA){const Ae=pe?Ar:at.getTransfer(oe);$===s.FLOAT&&(he=s.RGBA32F),$===s.HALF_FLOAT&&(he=s.RGBA16F),$===s.UNSIGNED_BYTE&&(he=Ae===dt?s.SRGB8_ALPHA8:s.RGBA8),$===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),$===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function x(P,T){let $;return P?T===null||T===yn||T===xi?$=s.DEPTH24_STENCIL8:T===Zt?$=s.DEPTH32F_STENCIL8:T===Ds&&($=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===yn||T===xi?$=s.DEPTH_COMPONENT24:T===Zt?$=s.DEPTH_COMPONENT32F:T===Ds&&($=s.DEPTH_COMPONENT16),$}function b(P,T){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Mt&&P.minFilter!==gt?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function E(P){const T=P.target;T.removeEventListener("dispose",E),C(T),T.isVideoTexture&&h.delete(T)}function _(P){const T=P.target;T.removeEventListener("dispose",_),S(T)}function C(P){const T=n.get(P);if(T.__webglInit===void 0)return;const $=P.source,oe=d.get($);if(oe){const pe=oe[T.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&M(P),Object.keys(oe).length===0&&d.delete($)}n.remove(P)}function M(P){const T=n.get(P);s.deleteTexture(T.__webglTexture);const $=P.source,oe=d.get($);delete oe[T.__cacheKey],a.memory.textures--}function S(P){const T=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(T.__webglFramebuffer[oe]))for(let pe=0;pe<T.__webglFramebuffer[oe].length;pe++)s.deleteFramebuffer(T.__webglFramebuffer[oe][pe]);else s.deleteFramebuffer(T.__webglFramebuffer[oe]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[oe])}else{if(Array.isArray(T.__webglFramebuffer))for(let oe=0;oe<T.__webglFramebuffer.length;oe++)s.deleteFramebuffer(T.__webglFramebuffer[oe]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let oe=0;oe<T.__webglColorRenderbuffer.length;oe++)T.__webglColorRenderbuffer[oe]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[oe]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const $=P.textures;for(let oe=0,pe=$.length;oe<pe;oe++){const he=n.get($[oe]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove($[oe])}n.remove(P)}let D=0;function z(){D=0}function U(){const P=D;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),D+=1,P}function H(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function ee(P,T){const $=n.get(P);if(P.isVideoTexture&&j(P),P.isRenderTargetTexture===!1&&P.version>0&&$.__version!==P.version){const oe=P.image;if(oe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z($,P,T);return}}t.bindTexture(s.TEXTURE_2D,$.__webglTexture,s.TEXTURE0+T)}function W(P,T){const $=n.get(P);if(P.version>0&&$.__version!==P.version){Z($,P,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,$.__webglTexture,s.TEXTURE0+T)}function Q(P,T){const $=n.get(P);if(P.version>0&&$.__version!==P.version){Z($,P,T);return}t.bindTexture(s.TEXTURE_3D,$.__webglTexture,s.TEXTURE0+T)}function X(P,T){const $=n.get(P);if(P.version>0&&$.__version!==P.version){k($,P,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture,s.TEXTURE0+T)}const te={[vi]:s.REPEAT,[Bt]:s.CLAMP_TO_EDGE,[Va]:s.MIRRORED_REPEAT},N={[Mt]:s.NEAREST,[Ah]:s.NEAREST_MIPMAP_NEAREST,[ks]:s.NEAREST_MIPMAP_LINEAR,[gt]:s.LINEAR,[Yr]:s.LINEAR_MIPMAP_NEAREST,[Xn]:s.LINEAR_MIPMAP_LINEAR},O={[Ph]:s.NEVER,[Fh]:s.ALWAYS,[Dh]:s.LESS,[_c]:s.LEQUAL,[Lh]:s.EQUAL,[Nh]:s.GEQUAL,[Ih]:s.GREATER,[Uh]:s.NOTEQUAL};function le(P,T){if(T.type===Zt&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===gt||T.magFilter===Yr||T.magFilter===ks||T.magFilter===Xn||T.minFilter===gt||T.minFilter===Yr||T.minFilter===ks||T.minFilter===Xn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,te[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,te[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,te[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,N[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,N[T.minFilter]),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,O[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Mt||T.minFilter!==ks&&T.minFilter!==Xn||T.type===Zt&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Se(P,T){let $=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",E));const oe=T.source;let pe=d.get(oe);pe===void 0&&(pe={},d.set(oe,pe));const he=H(T);if(he!==P.__cacheKey){pe[he]===void 0&&(pe[he]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,$=!0),pe[he].usedTimes++;const Ae=pe[P.__cacheKey];Ae!==void 0&&(pe[P.__cacheKey].usedTimes--,Ae.usedTimes===0&&M(T)),P.__cacheKey=he,P.__webglTexture=pe[he].texture}return $}function Z(P,T,$){let oe=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(oe=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(oe=s.TEXTURE_3D);const pe=Se(P,T),he=T.source;t.bindTexture(oe,P.__webglTexture,s.TEXTURE0+$);const Ae=n.get(he);if(he.version!==Ae.__version||pe===!0){t.activeTexture(s.TEXTURE0+$);const ve=at.getPrimaries(at.workingColorSpace),Me=T.colorSpace===Mn?null:at.getPrimaries(T.colorSpace),Fe=T.colorSpace===Mn||ve===Me?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let we=v(T.image,!1,i.maxTextureSize);we=J(T,we);const Ie=r.convert(T.format,T.colorSpace),ke=r.convert(T.type);let De=y(T.internalFormat,Ie,ke,T.colorSpace,T.isVideoTexture);le(oe,T);let be;const We=T.mipmaps,Oe=T.isVideoTexture!==!0,Ke=Ae.__version===void 0||pe===!0,q=he.dataReady,Ce=b(T,we);if(T.isDepthTexture)De=x(T.format===Si,T.type),Ke&&(Oe?t.texStorage2D(s.TEXTURE_2D,1,De,we.width,we.height):t.texImage2D(s.TEXTURE_2D,0,De,we.width,we.height,0,Ie,ke,null));else if(T.isDataTexture)if(We.length>0){Oe&&Ke&&t.texStorage2D(s.TEXTURE_2D,Ce,De,We[0].width,We[0].height);for(let ge=0,me=We.length;ge<me;ge++)be=We[ge],Oe?q&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,be.width,be.height,Ie,ke,be.data):t.texImage2D(s.TEXTURE_2D,ge,De,be.width,be.height,0,Ie,ke,be.data);T.generateMipmaps=!1}else Oe?(Ke&&t.texStorage2D(s.TEXTURE_2D,Ce,De,we.width,we.height),q&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,we.width,we.height,Ie,ke,we.data)):t.texImage2D(s.TEXTURE_2D,0,De,we.width,we.height,0,Ie,ke,we.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Oe&&Ke&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,De,We[0].width,We[0].height,we.depth);for(let ge=0,me=We.length;ge<me;ge++)if(be=We[ge],T.format!==It)if(Ie!==null)if(Oe){if(q)if(T.layerUpdates.size>0){const Pe=Tl(be.width,be.height,T.format,T.type);for(const Le of T.layerUpdates){const Ve=be.data.subarray(Le*Pe/be.data.BYTES_PER_ELEMENT,(Le+1)*Pe/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,Le,be.width,be.height,1,Ie,Ve)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,be.width,be.height,we.depth,Ie,be.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,De,be.width,be.height,we.depth,0,be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?q&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,be.width,be.height,we.depth,Ie,ke,be.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ge,De,be.width,be.height,we.depth,0,Ie,ke,be.data)}else{Oe&&Ke&&t.texStorage2D(s.TEXTURE_2D,Ce,De,We[0].width,We[0].height);for(let ge=0,me=We.length;ge<me;ge++)be=We[ge],T.format!==It?Ie!==null?Oe?q&&t.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,be.width,be.height,Ie,be.data):t.compressedTexImage2D(s.TEXTURE_2D,ge,De,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?q&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,be.width,be.height,Ie,ke,be.data):t.texImage2D(s.TEXTURE_2D,ge,De,be.width,be.height,0,Ie,ke,be.data)}else if(T.isDataArrayTexture)if(Oe){if(Ke&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,De,we.width,we.height,we.depth),q)if(T.layerUpdates.size>0){const ge=Tl(we.width,we.height,T.format,T.type);for(const me of T.layerUpdates){const Pe=we.data.subarray(me*ge/we.data.BYTES_PER_ELEMENT,(me+1)*ge/we.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,me,we.width,we.height,1,Ie,ke,Pe)}T.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,we.width,we.height,we.depth,Ie,ke,we.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,De,we.width,we.height,we.depth,0,Ie,ke,we.data);else if(T.isData3DTexture)Oe?(Ke&&t.texStorage3D(s.TEXTURE_3D,Ce,De,we.width,we.height,we.depth),q&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,we.width,we.height,we.depth,Ie,ke,we.data)):t.texImage3D(s.TEXTURE_3D,0,De,we.width,we.height,we.depth,0,Ie,ke,we.data);else if(T.isFramebufferTexture){if(Ke)if(Oe)t.texStorage2D(s.TEXTURE_2D,Ce,De,we.width,we.height);else{let ge=we.width,me=we.height;for(let Pe=0;Pe<Ce;Pe++)t.texImage2D(s.TEXTURE_2D,Pe,De,ge,me,0,Ie,ke,null),ge>>=1,me>>=1}}else if(We.length>0){if(Oe&&Ke){const ge=re(We[0]);t.texStorage2D(s.TEXTURE_2D,Ce,De,ge.width,ge.height)}for(let ge=0,me=We.length;ge<me;ge++)be=We[ge],Oe?q&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,Ie,ke,be):t.texImage2D(s.TEXTURE_2D,ge,De,Ie,ke,be);T.generateMipmaps=!1}else if(Oe){if(Ke){const ge=re(we);t.texStorage2D(s.TEXTURE_2D,Ce,De,ge.width,ge.height)}q&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ie,ke,we)}else t.texImage2D(s.TEXTURE_2D,0,De,Ie,ke,we);p(T)&&m(oe),Ae.__version=he.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function k(P,T,$){if(T.image.length!==6)return;const oe=Se(P,T),pe=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+$);const he=n.get(pe);if(pe.version!==he.__version||oe===!0){t.activeTexture(s.TEXTURE0+$);const Ae=at.getPrimaries(at.workingColorSpace),ve=T.colorSpace===Mn?null:at.getPrimaries(T.colorSpace),Me=T.colorSpace===Mn||Ae===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Fe=T.isCompressedTexture||T.image[0].isCompressedTexture,we=T.image[0]&&T.image[0].isDataTexture,Ie=[];for(let me=0;me<6;me++)!Fe&&!we?Ie[me]=v(T.image[me],!0,i.maxCubemapSize):Ie[me]=we?T.image[me].image:T.image[me],Ie[me]=J(T,Ie[me]);const ke=Ie[0],De=r.convert(T.format,T.colorSpace),be=r.convert(T.type),We=y(T.internalFormat,De,be,T.colorSpace),Oe=T.isVideoTexture!==!0,Ke=he.__version===void 0||oe===!0,q=pe.dataReady;let Ce=b(T,ke);le(s.TEXTURE_CUBE_MAP,T);let ge;if(Fe){Oe&&Ke&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,We,ke.width,ke.height);for(let me=0;me<6;me++){ge=Ie[me].mipmaps;for(let Pe=0;Pe<ge.length;Pe++){const Le=ge[Pe];T.format!==It?De!==null?Oe?q&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe,0,0,Le.width,Le.height,De,Le.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe,We,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Oe?q&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe,0,0,Le.width,Le.height,De,be,Le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe,We,Le.width,Le.height,0,De,be,Le.data)}}}else{if(ge=T.mipmaps,Oe&&Ke){ge.length>0&&Ce++;const me=re(Ie[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,We,me.width,me.height)}for(let me=0;me<6;me++)if(we){Oe?q&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ie[me].width,Ie[me].height,De,be,Ie[me].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,We,Ie[me].width,Ie[me].height,0,De,be,Ie[me].data);for(let Pe=0;Pe<ge.length;Pe++){const Ve=ge[Pe].image[me].image;Oe?q&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe+1,0,0,Ve.width,Ve.height,De,be,Ve.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe+1,We,Ve.width,Ve.height,0,De,be,Ve.data)}}else{Oe?q&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,De,be,Ie[me]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,We,De,be,Ie[me]);for(let Pe=0;Pe<ge.length;Pe++){const Le=ge[Pe];Oe?q&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe+1,0,0,De,be,Le.image[me]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Pe+1,We,De,be,Le.image[me])}}}p(T)&&m(s.TEXTURE_CUBE_MAP),he.__version=pe.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function L(P,T,$,oe,pe,he){const Ae=r.convert($.format,$.colorSpace),ve=r.convert($.type),Me=y($.internalFormat,Ae,ve,$.colorSpace),Fe=n.get(T),we=n.get($);if(we.__renderTarget=T,!Fe.__hasExternalTextures){const Ie=Math.max(1,T.width>>he),ke=Math.max(1,T.height>>he);pe===s.TEXTURE_3D||pe===s.TEXTURE_2D_ARRAY?t.texImage3D(pe,he,Me,Ie,ke,T.depth,0,Ae,ve,null):t.texImage2D(pe,he,Me,Ie,ke,0,Ae,ve,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),Te(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,oe,pe,we.__webglTexture,0,ue(T)):(pe===s.TEXTURE_2D||pe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,oe,pe,we.__webglTexture,he),t.bindFramebuffer(s.FRAMEBUFFER,null)}function F(P,T,$){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer){const oe=T.depthTexture,pe=oe&&oe.isDepthTexture?oe.type:null,he=x(T.stencilBuffer,pe),Ae=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=ue(T);Te(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ve,he,T.width,T.height):$?s.renderbufferStorageMultisample(s.RENDERBUFFER,ve,he,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,he,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ae,s.RENDERBUFFER,P)}else{const oe=T.textures;for(let pe=0;pe<oe.length;pe++){const he=oe[pe],Ae=r.convert(he.format,he.colorSpace),ve=r.convert(he.type),Me=y(he.internalFormat,Ae,ve,he.colorSpace),Fe=ue(T);$&&Te(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Fe,Me,T.width,T.height):Te(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Fe,Me,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,Me,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function V(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const oe=n.get(T.depthTexture);oe.__renderTarget=T,(!oe.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),ee(T.depthTexture,0);const pe=oe.__webglTexture,he=ue(T);if(T.depthTexture.format===qn)Te(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,pe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,pe,0);else if(T.depthTexture.format===Si)Te(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,pe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,pe,0);else throw new Error("Unknown depthTexture format")}function ce(P){const T=n.get(P),$=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const oe=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),oe){const pe=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,oe.removeEventListener("dispose",pe)};oe.addEventListener("dispose",pe),T.__depthDisposeCallback=pe}T.__boundDepthTexture=oe}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");V(T.__webglFramebuffer,P)}else if($){T.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[oe]),T.__webglDepthbuffer[oe]===void 0)T.__webglDepthbuffer[oe]=s.createRenderbuffer(),F(T.__webglDepthbuffer[oe],P,!1);else{const pe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=T.__webglDepthbuffer[oe];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,pe,s.RENDERBUFFER,he)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),F(T.__webglDepthbuffer,P,!1);else{const oe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pe=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,oe,s.RENDERBUFFER,pe)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function ie(P,T,$){const oe=n.get(P);T!==void 0&&L(oe.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),$!==void 0&&ce(P)}function se(P){const T=P.texture,$=n.get(P),oe=n.get(T);P.addEventListener("dispose",_);const pe=P.textures,he=P.isWebGLCubeRenderTarget===!0,Ae=pe.length>1;if(Ae||(oe.__webglTexture===void 0&&(oe.__webglTexture=s.createTexture()),oe.__version=T.version,a.memory.textures++),he){$.__webglFramebuffer=[];for(let ve=0;ve<6;ve++)if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer[ve]=[];for(let Me=0;Me<T.mipmaps.length;Me++)$.__webglFramebuffer[ve][Me]=s.createFramebuffer()}else $.__webglFramebuffer[ve]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer=[];for(let ve=0;ve<T.mipmaps.length;ve++)$.__webglFramebuffer[ve]=s.createFramebuffer()}else $.__webglFramebuffer=s.createFramebuffer();if(Ae)for(let ve=0,Me=pe.length;ve<Me;ve++){const Fe=n.get(pe[ve]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&Te(P)===!1){$.__webglMultisampledFramebuffer=s.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let ve=0;ve<pe.length;ve++){const Me=pe[ve];$.__webglColorRenderbuffer[ve]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,$.__webglColorRenderbuffer[ve]);const Fe=r.convert(Me.format,Me.colorSpace),we=r.convert(Me.type),Ie=y(Me.internalFormat,Fe,we,Me.colorSpace,P.isXRRenderTarget===!0),ke=ue(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,ke,Ie,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,$.__webglColorRenderbuffer[ve])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&($.__webglDepthRenderbuffer=s.createRenderbuffer(),F($.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){t.bindTexture(s.TEXTURE_CUBE_MAP,oe.__webglTexture),le(s.TEXTURE_CUBE_MAP,T);for(let ve=0;ve<6;ve++)if(T.mipmaps&&T.mipmaps.length>0)for(let Me=0;Me<T.mipmaps.length;Me++)L($.__webglFramebuffer[ve][Me],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Me);else L($.__webglFramebuffer[ve],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0);p(T)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let ve=0,Me=pe.length;ve<Me;ve++){const Fe=pe[ve],we=n.get(Fe);t.bindTexture(s.TEXTURE_2D,we.__webglTexture),le(s.TEXTURE_2D,Fe),L($.__webglFramebuffer,P,Fe,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,0),p(Fe)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let ve=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ve=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ve,oe.__webglTexture),le(ve,T),T.mipmaps&&T.mipmaps.length>0)for(let Me=0;Me<T.mipmaps.length;Me++)L($.__webglFramebuffer[Me],P,T,s.COLOR_ATTACHMENT0,ve,Me);else L($.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,ve,0);p(T)&&m(ve),t.unbindTexture()}P.depthBuffer&&ce(P)}function Y(P){const T=P.textures;for(let $=0,oe=T.length;$<oe;$++){const pe=T[$];if(p(pe)){const he=w(P),Ae=n.get(pe).__webglTexture;t.bindTexture(he,Ae),m(he),t.unbindTexture()}}}const ne=[],R=[];function fe(P){if(P.samples>0){if(Te(P)===!1){const T=P.textures,$=P.width,oe=P.height;let pe=s.COLOR_BUFFER_BIT;const he=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ae=n.get(P),ve=T.length>1;if(ve)for(let Me=0;Me<T.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Me=0;Me<T.length;Me++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(pe|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(pe|=s.STENCIL_BUFFER_BIT)),ve){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Me]);const Fe=n.get(T[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Fe,0)}s.blitFramebuffer(0,0,$,oe,0,0,$,oe,pe,s.NEAREST),l===!0&&(ne.length=0,R.length=0,ne.push(s.COLOR_ATTACHMENT0+Me),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ne.push(he),R.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,R)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ne))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ve)for(let Me=0;Me<T.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,Ae.__webglColorRenderbuffer[Me]);const Fe=n.get(T[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Fe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function ue(P){return Math.min(i.maxSamples,P.samples)}function Te(P){const T=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function j(P){const T=a.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function J(P,T){const $=P.colorSpace,oe=P.format,pe=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||$!==Mi&&$!==Mn&&(at.getTransfer($)===dt?(oe!==It||pe!==zn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),T}function re(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=z,this.setTexture2D=ee,this.setTexture2DArray=W,this.setTexture3D=Q,this.setTextureCube=X,this.rebindTextures=ie,this.setupRenderTarget=se,this.updateRenderTargetMipmap=Y,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=ce,this.setupFrameBufferTexture=L,this.useMultisampledRTT=Te}function sg(s,e){function t(n,i=Mn){let r;const a=at.getTransfer(i);if(n===zn)return s.UNSIGNED_BYTE;if(n===_o)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ao)return s.UNSIGNED_SHORT_5_5_5_1;if(n===vc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===mc)return s.BYTE;if(n===gc)return s.SHORT;if(n===Ds)return s.UNSIGNED_SHORT;if(n===To)return s.INT;if(n===yn)return s.UNSIGNED_INT;if(n===Zt)return s.FLOAT;if(n===Ct)return s.HALF_FLOAT;if(n===xc)return s.ALPHA;if(n===Sc)return s.RGB;if(n===It)return s.RGBA;if(n===Mc)return s.LUMINANCE;if(n===yc)return s.LUMINANCE_ALPHA;if(n===qn)return s.DEPTH_COMPONENT;if(n===Si)return s.DEPTH_STENCIL;if(n===Fs)return s.RED;if(n===Eo)return s.RED_INTEGER;if(n===wc)return s.RG;if(n===Co)return s.RG_INTEGER;if(n===Ro)return s.RGBA_INTEGER;if(n===xr||n===Sr||n===Mr||n===yr)if(a===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===xr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===xr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Wa||n===Xa||n===Ya||n===qa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Wa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===qa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Za||n===Ka||n===ja)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Za||n===Ka)return a===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ja)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qa||n===Ja||n===$a||n===eo||n===to||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qa)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ja)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$a)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===eo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===to)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===no)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===io)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===so)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ro)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ao)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===oo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===lo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===co)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ho)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wr||n===uo||n===fo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===wr)return a===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===uo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===fo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===bc||n===po||n===mo||n===go)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===wr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===po)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===mo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===go)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const rg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ag=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class og{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Ut,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ft({vertexShader:rg,fragmentShader:ag,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ee(new $t(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lg extends ss{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=new og,p=t.getContextAttributes();let m=null,w=null;const y=[],x=[],b=new xe;let E=null;const _=new Qt;_.viewport=new ut;const C=new Qt;C.viewport=new ut;const M=[_,C],S=new Ed;let D=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let k=y[Z];return k===void 0&&(k=new da,y[Z]=k),k.getTargetRaySpace()},this.getControllerGrip=function(Z){let k=y[Z];return k===void 0&&(k=new da,y[Z]=k),k.getGripSpace()},this.getHand=function(Z){let k=y[Z];return k===void 0&&(k=new da,y[Z]=k),k.getHandSpace()};function U(Z){const k=x.indexOf(Z.inputSource);if(k===-1)return;const L=y[k];L!==void 0&&(L.update(Z.inputSource,Z.frame,c||a),L.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",H),i.removeEventListener("inputsourceschange",ee);for(let Z=0;Z<y.length;Z++){const k=x[Z];k!==null&&(x[Z]=null,y[Z].disconnect(k))}D=null,z=null,v.reset(),e.setRenderTarget(m),f=null,d=null,u=null,i=null,w=null,Se.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",H),i.addEventListener("inputsourceschange",ee),p.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(b),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let L=null,F=null,V=null;p.depth&&(V=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,L=p.stencil?Si:qn,F=p.stencil?xi:yn);const ce={colorFormat:t.RGBA8,depthFormat:V,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(ce),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new Tt(d.textureWidth,d.textureHeight,{format:It,type:zn,depthTexture:new Ts(d.textureWidth,d.textureHeight,F,void 0,void 0,void 0,void 0,void 0,void 0,L),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const L={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,L),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new Tt(f.framebufferWidth,f.framebufferHeight,{format:It,type:zn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Se.setContext(i),Se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function ee(Z){for(let k=0;k<Z.removed.length;k++){const L=Z.removed[k],F=x.indexOf(L);F>=0&&(x[F]=null,y[F].disconnect(L))}for(let k=0;k<Z.added.length;k++){const L=Z.added[k];let F=x.indexOf(L);if(F===-1){for(let ce=0;ce<y.length;ce++)if(ce>=x.length){x.push(L),F=ce;break}else if(x[ce]===null){x[ce]=L,F=ce;break}if(F===-1)break}const V=y[F];V&&V.connect(L)}}const W=new I,Q=new I;function X(Z,k,L){W.setFromMatrixPosition(k.matrixWorld),Q.setFromMatrixPosition(L.matrixWorld);const F=W.distanceTo(Q),V=k.projectionMatrix.elements,ce=L.projectionMatrix.elements,ie=V[14]/(V[10]-1),se=V[14]/(V[10]+1),Y=(V[9]+1)/V[5],ne=(V[9]-1)/V[5],R=(V[8]-1)/V[0],fe=(ce[8]+1)/ce[0],ue=ie*R,Te=ie*fe,j=F/(-R+fe),J=j*-R;if(k.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(J),Z.translateZ(j),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),V[10]===-1)Z.projectionMatrix.copy(k.projectionMatrix),Z.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{const re=ie+j,P=se+j,T=ue-J,$=Te+(F-J),oe=Y*se/P*re,pe=ne*se/P*re;Z.projectionMatrix.makePerspective(T,$,oe,pe,re,P),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function te(Z,k){k===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(k.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let k=Z.near,L=Z.far;v.texture!==null&&(v.depthNear>0&&(k=v.depthNear),v.depthFar>0&&(L=v.depthFar)),S.near=C.near=_.near=k,S.far=C.far=_.far=L,(D!==S.near||z!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),D=S.near,z=S.far),_.layers.mask=Z.layers.mask|2,C.layers.mask=Z.layers.mask|4,S.layers.mask=_.layers.mask|C.layers.mask;const F=Z.parent,V=S.cameras;te(S,F);for(let ce=0;ce<V.length;ce++)te(V[ce],F);V.length===2?X(S,_,C):S.projectionMatrix.copy(_.projectionMatrix),N(Z,S,F)};function N(Z,k,L){L===null?Z.matrix.copy(k.matrixWorld):(Z.matrix.copy(L.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(k.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(k.projectionMatrix),Z.projectionMatrixInverse.copy(k.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=es*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let O=null;function le(Z,k){if(h=k.getViewerPose(c||a),g=k,h!==null){const L=h.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let F=!1;L.length!==S.cameras.length&&(S.cameras.length=0,F=!0);for(let ie=0;ie<L.length;ie++){const se=L[ie];let Y=null;if(f!==null)Y=f.getViewport(se);else{const R=u.getViewSubImage(d,se);Y=R.viewport,ie===0&&(e.setRenderTargetTextures(w,R.colorTexture,d.ignoreDepthValues?void 0:R.depthStencilTexture),e.setRenderTarget(w))}let ne=M[ie];ne===void 0&&(ne=new Qt,ne.layers.enable(ie),ne.viewport=new ut,M[ie]=ne),ne.matrix.fromArray(se.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(se.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(Y.x,Y.y,Y.width,Y.height),ie===0&&(S.matrix.copy(ne.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),F===!0&&S.cameras.push(ne)}const V=i.enabledFeatures;if(V&&V.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&u){const ie=u.getDepthInformation(L[0]);ie&&ie.isValid&&ie.texture&&v.init(e,ie,i.renderState)}}for(let L=0;L<y.length;L++){const F=x[L],V=y[L];F!==null&&V!==void 0&&V.update(F,k,c||a)}O&&O(Z,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),g=null}const Se=new qc;Se.setAnimationLoop(le),this.setAnimationLoop=function(Z){O=Z},this.dispose=function(){}}}const oi=new gn,cg=new Ze;function hg(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Ic(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,w,y,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,x)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,w,y):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Jt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Jt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const w=e.get(m),y=w.envMap,x=w.envMapRotation;y&&(p.envMap.value=y,oi.copy(x),oi.x*=-1,oi.y*=-1,oi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),p.envMapRotation.value.setFromMatrix4(cg.makeRotationFromEuler(oi)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,w,y){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*w,p.scale.value=y*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,w){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Jt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const w=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function ug(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,y){const x=y.program;n.uniformBlockBinding(w,x)}function c(w,y){let x=i[w.id];x===void 0&&(g(w),x=h(w),i[w.id]=x,w.addEventListener("dispose",p));const b=y.program;n.updateUBOMapping(w,b);const E=e.render.frame;r[w.id]!==E&&(d(w),r[w.id]=E)}function h(w){const y=u();w.__bindingPointIndex=y;const x=s.createBuffer(),b=w.__size,E=w.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,b,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,x),x}function u(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const y=i[w.id],x=w.uniforms,b=w.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let E=0,_=x.length;E<_;E++){const C=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,S=C.length;M<S;M++){const D=C[M];if(f(D,E,M,b)===!0){const z=D.__offset,U=Array.isArray(D.value)?D.value:[D.value];let H=0;for(let ee=0;ee<U.length;ee++){const W=U[ee],Q=v(W);typeof W=="number"||typeof W=="boolean"?(D.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,z+H,D.__data)):W.isMatrix3?(D.__data[0]=W.elements[0],D.__data[1]=W.elements[1],D.__data[2]=W.elements[2],D.__data[3]=0,D.__data[4]=W.elements[3],D.__data[5]=W.elements[4],D.__data[6]=W.elements[5],D.__data[7]=0,D.__data[8]=W.elements[6],D.__data[9]=W.elements[7],D.__data[10]=W.elements[8],D.__data[11]=0):(W.toArray(D.__data,H),H+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,z,D.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(w,y,x,b){const E=w.value,_=y+"_"+x;if(b[_]===void 0)return typeof E=="number"||typeof E=="boolean"?b[_]=E:b[_]=E.clone(),!0;{const C=b[_];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return b[_]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(w){const y=w.uniforms;let x=0;const b=16;for(let _=0,C=y.length;_<C;_++){const M=Array.isArray(y[_])?y[_]:[y[_]];for(let S=0,D=M.length;S<D;S++){const z=M[S],U=Array.isArray(z.value)?z.value:[z.value];for(let H=0,ee=U.length;H<ee;H++){const W=U[H],Q=v(W),X=x%b,te=X%Q.boundary,N=X+te;x+=te,N!==0&&b-N<Q.storage&&(x+=b-N),z.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=Q.storage}}}const E=x%b;return E>0&&(x+=b-E),w.__size=x,w.__cache={},this}function v(w){const y={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(y.boundary=4,y.storage=4):w.isVector2?(y.boundary=8,y.storage=8):w.isVector3||w.isColor?(y.boundary=16,y.storage=12):w.isVector4?(y.boundary=16,y.storage=16):w.isMatrix3?(y.boundary=48,y.storage=48):w.isMatrix4?(y.boundary=64,y.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),y}function p(w){const y=w.target;y.removeEventListener("dispose",p);const x=a.indexOf(y.__bindingPointIndex);a.splice(x,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function m(){for(const w in i)s.deleteBuffer(i[w]);a=[],i={},r={}}return{bind:l,update:c,dispose:m}}class dg{constructor(e={}){const{canvas:t=$h(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),v=new Int32Array(4);let p=null,m=null;const w=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Vt,this.toneMapping=Yn,this.toneMappingExposure=1;const x=this;let b=!1,E=0,_=0,C=null,M=-1,S=null;const D=new ut,z=new ut;let U=null;const H=new ze(0);let ee=0,W=t.width,Q=t.height,X=1,te=null,N=null;const O=new ut(0,0,W,Q),le=new ut(0,0,W,Q);let Se=!1;const Z=new Lo;let k=!1,L=!1;this.transmissionResolutionScale=1;const F=new Ze,V=new Ze,ce=new I,ie=new ut,se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Y=!1;function ne(){return C===null?X:1}let R=n;function fe(A,G){return t.getContext(A,G)}try{const A={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ir}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Pe,!1),t.addEventListener("webglcontextcreationerror",Le,!1),R===null){const G="webgl2";if(R=fe(G,A),R===null)throw fe(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let ue,Te,j,J,re,P,T,$,oe,pe,he,Ae,ve,Me,Fe,we,Ie,ke,De,be,We,Oe,Ke,q;function Ce(){ue=new wm(R),ue.init(),Oe=new sg(R,ue),Te=new mm(R,ue,e,Oe),j=new ng(R,ue),Te.reverseDepthBuffer&&d&&j.buffers.depth.setReversed(!0),J=new _m(R),re=new V0,P=new ig(R,ue,j,re,Te,Oe,J),T=new vm(x),$=new ym(x),oe=new Pd(R),Ke=new fm(R,oe),pe=new bm(R,oe,J,Ke),he=new Em(R,pe,oe,J),De=new Am(R,Te,P),we=new gm(re),Ae=new G0(x,T,$,ue,Te,Ke,we),ve=new hg(x,re),Me=new X0,Fe=new Q0(ue),ke=new dm(x,T,$,j,he,f,l),Ie=new eg(x,he,Te),q=new ug(R,J,Te,j),be=new pm(R,ue,J),We=new Tm(R,ue,J),J.programs=Ae.programs,x.capabilities=Te,x.extensions=ue,x.properties=re,x.renderLists=Me,x.shadowMap=Ie,x.state=j,x.info=J}Ce();const ge=new lg(x,R);this.xr=ge,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const A=ue.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=ue.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(A){A!==void 0&&(X=A,this.setSize(W,Q,!1))},this.getSize=function(A){return A.set(W,Q)},this.setSize=function(A,G,ae=!0){if(ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=A,Q=G,t.width=Math.floor(A*X),t.height=Math.floor(G*X),ae===!0&&(t.style.width=A+"px",t.style.height=G+"px"),this.setViewport(0,0,A,G)},this.getDrawingBufferSize=function(A){return A.set(W*X,Q*X).floor()},this.setDrawingBufferSize=function(A,G,ae){W=A,Q=G,X=ae,t.width=Math.floor(A*ae),t.height=Math.floor(G*ae),this.setViewport(0,0,A,G)},this.getCurrentViewport=function(A){return A.copy(D)},this.getViewport=function(A){return A.copy(O)},this.setViewport=function(A,G,ae,de){A.isVector4?O.set(A.x,A.y,A.z,A.w):O.set(A,G,ae,de),j.viewport(D.copy(O).multiplyScalar(X).round())},this.getScissor=function(A){return A.copy(le)},this.setScissor=function(A,G,ae,de){A.isVector4?le.set(A.x,A.y,A.z,A.w):le.set(A,G,ae,de),j.scissor(z.copy(le).multiplyScalar(X).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(A){j.setScissorTest(Se=A)},this.setOpaqueSort=function(A){te=A},this.setTransparentSort=function(A){N=A},this.getClearColor=function(A){return A.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor(...arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha(...arguments)},this.clear=function(A=!0,G=!0,ae=!0){let de=0;if(A){let K=!1;if(C!==null){const _e=C.texture.format;K=_e===Ro||_e===Co||_e===Eo}if(K){const _e=C.texture.type,Ue=_e===zn||_e===yn||_e===Ds||_e===xi||_e===_o||_e===Ao,Be=ke.getClearColor(),He=ke.getClearAlpha(),je=Be.r,Je=Be.g,Ye=Be.b;Ue?(g[0]=je,g[1]=Je,g[2]=Ye,g[3]=He,R.clearBufferuiv(R.COLOR,0,g)):(v[0]=je,v[1]=Je,v[2]=Ye,v[3]=He,R.clearBufferiv(R.COLOR,0,v))}else de|=R.COLOR_BUFFER_BIT}G&&(de|=R.DEPTH_BUFFER_BIT),ae&&(de|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(de)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Pe,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),ke.dispose(),Me.dispose(),Fe.dispose(),re.dispose(),T.dispose(),$.dispose(),he.dispose(),Ke.dispose(),q.dispose(),Ae.dispose(),ge.dispose(),ge.removeEventListener("sessionstart",Rt),ge.removeEventListener("sessionend",en),ln.stop()};function me(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Pe(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const A=J.autoReset,G=Ie.enabled,ae=Ie.autoUpdate,de=Ie.needsUpdate,K=Ie.type;Ce(),J.autoReset=A,Ie.enabled=G,Ie.autoUpdate=ae,Ie.needsUpdate=de,Ie.type=K}function Le(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Ve(A){const G=A.target;G.removeEventListener("dispose",Ve),st(G)}function st(A){lt(A),re.remove(A)}function lt(A){const G=re.get(A).programs;G!==void 0&&(G.forEach(function(ae){Ae.releaseProgram(ae)}),A.isShaderMaterial&&Ae.releaseShaderCache(A))}this.renderBufferDirect=function(A,G,ae,de,K,_e){G===null&&(G=se);const Ue=K.isMesh&&K.matrixWorld.determinant()<0,Be=cs(A,G,ae,de,K);j.setMaterial(de,Ue);let He=ae.index,je=1;if(de.wireframe===!0){if(He=pe.getWireframeAttribute(ae),He===void 0)return;je=2}const Je=ae.drawRange,Ye=ae.attributes.position;let rt=Je.start*je,ct=(Je.start+Je.count)*je;_e!==null&&(rt=Math.max(rt,_e.start*je),ct=Math.min(ct,(_e.start+_e.count)*je)),He!==null?(rt=Math.max(rt,0),ct=Math.min(ct,He.count)):Ye!=null&&(rt=Math.max(rt,0),ct=Math.min(ct,Ye.count));const Pt=ct-rt;if(Pt<0||Pt===1/0)return;Ke.setup(K,de,Be,ae,He);let Et,ot=be;if(He!==null&&(Et=oe.get(He),ot=We,ot.setIndex(Et)),K.isMesh)de.wireframe===!0?(j.setLineWidth(de.wireframeLinewidth*ne()),ot.setMode(R.LINES)):ot.setMode(R.TRIANGLES);else if(K.isLine){let qe=de.linewidth;qe===void 0&&(qe=1),j.setLineWidth(qe*ne()),K.isLineSegments?ot.setMode(R.LINES):K.isLineLoop?ot.setMode(R.LINE_LOOP):ot.setMode(R.LINE_STRIP)}else K.isPoints?ot.setMode(R.POINTS):K.isSprite&&ot.setMode(R.TRIANGLES);if(K.isBatchedMesh)if(K._multiDrawInstances!==null)li("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount,K._multiDrawInstances);else if(ue.get("WEBGL_multi_draw"))ot.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{const qe=K._multiDrawStarts,Ot=K._multiDrawCounts,ht=K._multiDrawCount,hn=He?oe.get(He).bytesPerElement:1,Ei=re.get(de).currentProgram.getUniforms();for(let tn=0;tn<ht;tn++)Ei.setValue(R,"_gl_DrawID",tn),ot.render(qe[tn]/hn,Ot[tn])}else if(K.isInstancedMesh)ot.renderInstances(rt,Pt,K.count);else if(ae.isInstancedBufferGeometry){const qe=ae._maxInstanceCount!==void 0?ae._maxInstanceCount:1/0,Ot=Math.min(ae.instanceCount,qe);ot.renderInstances(rt,Pt,Ot)}else ot.render(rt,Pt)};function it(A,G,ae){A.transparent===!0&&A.side===qt&&A.forceSinglePass===!1?(A.side=Jt,A.needsUpdate=!0,cn(A,G,ae),A.side=Qn,A.needsUpdate=!0,cn(A,G,ae),A.side=qt):cn(A,G,ae)}this.compile=function(A,G,ae=null){ae===null&&(ae=A),m=Fe.get(ae),m.init(G),y.push(m),ae.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),A!==ae&&A.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(m.pushLight(K),K.castShadow&&m.pushShadow(K))}),m.setupLights();const de=new Set;return A.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;const _e=K.material;if(_e)if(Array.isArray(_e))for(let Ue=0;Ue<_e.length;Ue++){const Be=_e[Ue];it(Be,ae,K),de.add(Be)}else it(_e,ae,K),de.add(_e)}),m=y.pop(),de},this.compileAsync=function(A,G,ae=null){const de=this.compile(A,G,ae);return new Promise(K=>{function _e(){if(de.forEach(function(Ue){re.get(Ue).currentProgram.isReady()&&de.delete(Ue)}),de.size===0){K(A);return}setTimeout(_e,10)}ue.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let bt=null;function yt(A){bt&&bt(A)}function Rt(){ln.stop()}function en(){ln.start()}const ln=new qc;ln.setAnimationLoop(yt),typeof self<"u"&&ln.setContext(self),this.setAnimationLoop=function(A){bt=A,ge.setAnimationLoop(A),A===null?ln.stop():ln.start()},ge.addEventListener("sessionstart",Rt),ge.addEventListener("sessionend",en),this.render=function(A,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ge.enabled===!0&&ge.isPresenting===!0&&(ge.cameraAutoUpdate===!0&&ge.updateCamera(G),G=ge.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,G,C),m=Fe.get(A,y.length),m.init(G),y.push(m),V.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Z.setFromProjectionMatrix(V),L=this.localClippingEnabled,k=we.init(this.clippingPlanes,L),p=Me.get(A,w.length),p.init(),w.push(p),ge.enabled===!0&&ge.isPresenting===!0){const _e=x.xr.getDepthSensingMesh();_e!==null&&On(_e,G,-1/0,x.sortObjects)}On(A,G,0,x.sortObjects),p.finish(),x.sortObjects===!0&&p.sort(te,N),Y=ge.enabled===!1||ge.isPresenting===!1||ge.hasDepthSensing()===!1,Y&&ke.addToRenderList(p,A),this.info.render.frame++,k===!0&&we.beginShadows();const ae=m.state.shadowsArray;Ie.render(ae,A,G),k===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const de=p.opaque,K=p.transmissive;if(m.setupLights(),G.isArrayCamera){const _e=G.cameras;if(K.length>0)for(let Ue=0,Be=_e.length;Ue<Be;Ue++){const He=_e[Ue];Ai(de,K,A,He)}Y&&ke.render(A);for(let Ue=0,Be=_e.length;Ue<Be;Ue++){const He=_e[Ue];xn(p,A,He,He.viewport)}}else K.length>0&&Ai(de,K,A,G),Y&&ke.render(A),xn(p,A,G);C!==null&&_===0&&(P.updateMultisampleRenderTarget(C),P.updateRenderTargetMipmap(C)),A.isScene===!0&&A.onAfterRender(x,A,G),Ke.resetDefaultState(),M=-1,S=null,y.pop(),y.length>0?(m=y[y.length-1],k===!0&&we.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,w.pop(),w.length>0?p=w[w.length-1]:p=null};function On(A,G,ae,de){if(A.visible===!1)return;if(A.layers.test(G.layers)){if(A.isGroup)ae=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(G);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Z.intersectsSprite(A)){de&&ie.setFromMatrixPosition(A.matrixWorld).applyMatrix4(V);const Ue=he.update(A),Be=A.material;Be.visible&&p.push(A,Ue,Be,ae,ie.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Z.intersectsObject(A))){const Ue=he.update(A),Be=A.material;if(de&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ie.copy(A.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),ie.copy(Ue.boundingSphere.center)),ie.applyMatrix4(A.matrixWorld).applyMatrix4(V)),Array.isArray(Be)){const He=Ue.groups;for(let je=0,Je=He.length;je<Je;je++){const Ye=He[je],rt=Be[Ye.materialIndex];rt&&rt.visible&&p.push(A,Ue,rt,ae,ie.z,Ye)}}else Be.visible&&p.push(A,Ue,Be,ae,ie.z,null)}}const _e=A.children;for(let Ue=0,Be=_e.length;Ue<Be;Ue++)On(_e[Ue],G,ae,de)}function xn(A,G,ae,de){const K=A.opaque,_e=A.transmissive,Ue=A.transparent;m.setupLightsView(ae),k===!0&&we.setGlobalState(x.clippingPlanes,ae),de&&j.viewport(D.copy(de)),K.length>0&&kt(K,G,ae),_e.length>0&&kt(_e,G,ae),Ue.length>0&&kt(Ue,G,ae),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function Ai(A,G,ae,de){if((ae.isScene===!0?ae.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[de.id]===void 0&&(m.state.transmissionRenderTarget[de.id]=new Tt(1,1,{generateMipmaps:!0,type:ue.has("EXT_color_buffer_half_float")||ue.has("EXT_color_buffer_float")?Ct:zn,minFilter:Xn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:at.workingColorSpace}));const _e=m.state.transmissionRenderTarget[de.id],Ue=de.viewport||D;_e.setSize(Ue.z*x.transmissionResolutionScale,Ue.w*x.transmissionResolutionScale);const Be=x.getRenderTarget();x.setRenderTarget(_e),x.getClearColor(H),ee=x.getClearAlpha(),ee<1&&x.setClearColor(16777215,.5),x.clear(),Y&&ke.render(ae);const He=x.toneMapping;x.toneMapping=Yn;const je=de.viewport;if(de.viewport!==void 0&&(de.viewport=void 0),m.setupLightsView(de),k===!0&&we.setGlobalState(x.clippingPlanes,de),kt(A,ae,de),P.updateMultisampleRenderTarget(_e),P.updateRenderTargetMipmap(_e),ue.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let Ye=0,rt=G.length;Ye<rt;Ye++){const ct=G[Ye],Pt=ct.object,Et=ct.geometry,ot=ct.material,qe=ct.group;if(ot.side===qt&&Pt.layers.test(de.layers)){const Ot=ot.side;ot.side=Jt,ot.needsUpdate=!0,bn(Pt,ae,de,Et,ot,qe),ot.side=Ot,ot.needsUpdate=!0,Je=!0}}Je===!0&&(P.updateMultisampleRenderTarget(_e),P.updateRenderTargetMipmap(_e))}x.setRenderTarget(Be),x.setClearColor(H,ee),je!==void 0&&(de.viewport=je),x.toneMapping=He}function kt(A,G,ae){const de=G.isScene===!0?G.overrideMaterial:null;for(let K=0,_e=A.length;K<_e;K++){const Ue=A[K],Be=Ue.object,He=Ue.geometry,je=de===null?Ue.material:de,Je=Ue.group;Be.layers.test(ae.layers)&&bn(Be,G,ae,He,je,Je)}}function bn(A,G,ae,de,K,_e){A.onBeforeRender(x,G,ae,de,K,_e),A.modelViewMatrix.multiplyMatrices(ae.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),K.onBeforeRender(x,G,ae,de,A,_e),K.transparent===!0&&K.side===qt&&K.forceSinglePass===!1?(K.side=Jt,K.needsUpdate=!0,x.renderBufferDirect(ae,G,de,K,A,_e),K.side=Qn,K.needsUpdate=!0,x.renderBufferDirect(ae,G,de,K,A,_e),K.side=qt):x.renderBufferDirect(ae,G,de,K,A,_e),A.onAfterRender(x,G,ae,de,K,_e)}function cn(A,G,ae){G.isScene!==!0&&(G=se);const de=re.get(A),K=m.state.lights,_e=m.state.shadowsArray,Ue=K.state.version,Be=Ae.getParameters(A,K.state,_e,G,ae),He=Ae.getProgramCacheKey(Be);let je=de.programs;de.environment=A.isMeshStandardMaterial?G.environment:null,de.fog=G.fog,de.envMap=(A.isMeshStandardMaterial?$:T).get(A.envMap||de.environment),de.envMapRotation=de.environment!==null&&A.envMap===null?G.environmentRotation:A.envMapRotation,je===void 0&&(A.addEventListener("dispose",Ve),je=new Map,de.programs=je);let Je=je.get(He);if(Je!==void 0){if(de.currentProgram===Je&&de.lightsStateVersion===Ue)return Bs(A,Be),Je}else Be.uniforms=Ae.getUniforms(A),A.onBeforeCompile(Be,x),Je=Ae.acquireProgram(Be,He),je.set(He,Je),de.uniforms=Be.uniforms;const Ye=de.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ye.clippingPlanes=we.uniform),Bs(A,Be),de.needsLights=Gr(A),de.lightsStateVersion=Ue,de.needsLights&&(Ye.ambientLightColor.value=K.state.ambient,Ye.lightProbe.value=K.state.probe,Ye.directionalLights.value=K.state.directional,Ye.directionalLightShadows.value=K.state.directionalShadow,Ye.spotLights.value=K.state.spot,Ye.spotLightShadows.value=K.state.spotShadow,Ye.rectAreaLights.value=K.state.rectArea,Ye.ltc_1.value=K.state.rectAreaLTC1,Ye.ltc_2.value=K.state.rectAreaLTC2,Ye.pointLights.value=K.state.point,Ye.pointLightShadows.value=K.state.pointShadow,Ye.hemisphereLights.value=K.state.hemi,Ye.directionalShadowMap.value=K.state.directionalShadowMap,Ye.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Ye.spotShadowMap.value=K.state.spotShadowMap,Ye.spotLightMatrix.value=K.state.spotLightMatrix,Ye.spotLightMap.value=K.state.spotLightMap,Ye.pointShadowMap.value=K.state.pointShadowMap,Ye.pointShadowMatrix.value=K.state.pointShadowMatrix),de.currentProgram=Je,de.uniformsList=null,Je}function ls(A){if(A.uniformsList===null){const G=A.currentProgram.getUniforms();A.uniformsList=br.seqWithValue(G.seq,A.uniforms)}return A.uniformsList}function Bs(A,G){const ae=re.get(A);ae.outputColorSpace=G.outputColorSpace,ae.batching=G.batching,ae.batchingColor=G.batchingColor,ae.instancing=G.instancing,ae.instancingColor=G.instancingColor,ae.instancingMorph=G.instancingMorph,ae.skinning=G.skinning,ae.morphTargets=G.morphTargets,ae.morphNormals=G.morphNormals,ae.morphColors=G.morphColors,ae.morphTargetsCount=G.morphTargetsCount,ae.numClippingPlanes=G.numClippingPlanes,ae.numIntersection=G.numClipIntersection,ae.vertexAlphas=G.vertexAlphas,ae.vertexTangents=G.vertexTangents,ae.toneMapping=G.toneMapping}function cs(A,G,ae,de,K){G.isScene!==!0&&(G=se),P.resetTextureUnits();const _e=G.fog,Ue=de.isMeshStandardMaterial?G.environment:null,Be=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Mi,He=(de.isMeshStandardMaterial?$:T).get(de.envMap||Ue),je=de.vertexColors===!0&&!!ae.attributes.color&&ae.attributes.color.itemSize===4,Je=!!ae.attributes.tangent&&(!!de.normalMap||de.anisotropy>0),Ye=!!ae.morphAttributes.position,rt=!!ae.morphAttributes.normal,ct=!!ae.morphAttributes.color;let Pt=Yn;de.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Pt=x.toneMapping);const Et=ae.morphAttributes.position||ae.morphAttributes.normal||ae.morphAttributes.color,ot=Et!==void 0?Et.length:0,qe=re.get(de),Ot=m.state.lights;if(k===!0&&(L===!0||A!==S)){const Wt=A===S&&de.id===M;we.setState(de,A,Wt)}let ht=!1;de.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Ot.state.version||qe.outputColorSpace!==Be||K.isBatchedMesh&&qe.batching===!1||!K.isBatchedMesh&&qe.batching===!0||K.isBatchedMesh&&qe.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&qe.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&qe.instancing===!1||!K.isInstancedMesh&&qe.instancing===!0||K.isSkinnedMesh&&qe.skinning===!1||!K.isSkinnedMesh&&qe.skinning===!0||K.isInstancedMesh&&qe.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&qe.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&qe.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&qe.instancingMorph===!1&&K.morphTexture!==null||qe.envMap!==He||de.fog===!0&&qe.fog!==_e||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==we.numPlanes||qe.numIntersection!==we.numIntersection)||qe.vertexAlphas!==je||qe.vertexTangents!==Je||qe.morphTargets!==Ye||qe.morphNormals!==rt||qe.morphColors!==ct||qe.toneMapping!==Pt||qe.morphTargetsCount!==ot)&&(ht=!0):(ht=!0,qe.__version=de.version);let hn=qe.currentProgram;ht===!0&&(hn=cn(de,G,K));let Ei=!1,tn=!1,hs=!1;const wt=hn.getUniforms(),rn=qe.uniforms;if(j.useProgram(hn.program)&&(Ei=!0,tn=!0,hs=!0),de.id!==M&&(M=de.id,tn=!0),Ei||S!==A){j.buffers.depth.getReversed()?(F.copy(A.projectionMatrix),tu(F),nu(F),wt.setValue(R,"projectionMatrix",F)):wt.setValue(R,"projectionMatrix",A.projectionMatrix),wt.setValue(R,"viewMatrix",A.matrixWorldInverse);const jt=wt.map.cameraPosition;jt!==void 0&&jt.setValue(R,ce.setFromMatrixPosition(A.matrixWorld)),Te.logarithmicDepthBuffer&&wt.setValue(R,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(de.isMeshPhongMaterial||de.isMeshToonMaterial||de.isMeshLambertMaterial||de.isMeshBasicMaterial||de.isMeshStandardMaterial||de.isShaderMaterial)&&wt.setValue(R,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,tn=!0,hs=!0)}if(K.isSkinnedMesh){wt.setOptional(R,K,"bindMatrix"),wt.setOptional(R,K,"bindMatrixInverse");const Wt=K.skeleton;Wt&&(Wt.boneTexture===null&&Wt.computeBoneTexture(),wt.setValue(R,"boneTexture",Wt.boneTexture,P))}K.isBatchedMesh&&(wt.setOptional(R,K,"batchingTexture"),wt.setValue(R,"batchingTexture",K._matricesTexture,P),wt.setOptional(R,K,"batchingIdTexture"),wt.setValue(R,"batchingIdTexture",K._indirectTexture,P),wt.setOptional(R,K,"batchingColorTexture"),K._colorsTexture!==null&&wt.setValue(R,"batchingColorTexture",K._colorsTexture,P));const an=ae.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&De.update(K,ae,hn),(tn||qe.receiveShadow!==K.receiveShadow)&&(qe.receiveShadow=K.receiveShadow,wt.setValue(R,"receiveShadow",K.receiveShadow)),de.isMeshGouraudMaterial&&de.envMap!==null&&(rn.envMap.value=He,rn.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),de.isMeshStandardMaterial&&de.envMap===null&&G.environment!==null&&(rn.envMapIntensity.value=G.environmentIntensity),tn&&(wt.setValue(R,"toneMappingExposure",x.toneMappingExposure),qe.needsLights&&Hr(rn,hs),_e&&de.fog===!0&&ve.refreshFogUniforms(rn,_e),ve.refreshMaterialUniforms(rn,de,X,Q,m.state.transmissionRenderTarget[A.id]),br.upload(R,ls(qe),rn,P)),de.isShaderMaterial&&de.uniformsNeedUpdate===!0&&(br.upload(R,ls(qe),rn,P),de.uniformsNeedUpdate=!1),de.isSpriteMaterial&&wt.setValue(R,"center",K.center),wt.setValue(R,"modelViewMatrix",K.modelViewMatrix),wt.setValue(R,"normalMatrix",K.normalMatrix),wt.setValue(R,"modelMatrix",K.matrixWorld),de.isShaderMaterial||de.isRawShaderMaterial){const Wt=de.uniformsGroups;for(let jt=0,Xr=Wt.length;jt<Xr;jt++){const ti=Wt[jt];q.update(ti,hn),q.bind(ti,hn)}}return hn}function Hr(A,G){A.ambientLightColor.needsUpdate=G,A.lightProbe.needsUpdate=G,A.directionalLights.needsUpdate=G,A.directionalLightShadows.needsUpdate=G,A.pointLights.needsUpdate=G,A.pointLightShadows.needsUpdate=G,A.spotLights.needsUpdate=G,A.spotLightShadows.needsUpdate=G,A.rectAreaLights.needsUpdate=G,A.hemisphereLights.needsUpdate=G}function Gr(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return _},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(A,G,ae){re.get(A.texture).__webglTexture=G,re.get(A.depthTexture).__webglTexture=ae;const de=re.get(A);de.__hasExternalTextures=!0,de.__autoAllocateDepthBuffer=ae===void 0,de.__autoAllocateDepthBuffer||ue.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),de.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,G){const ae=re.get(A);ae.__webglFramebuffer=G,ae.__useDefaultFramebuffer=G===void 0};const Vr=R.createFramebuffer();this.setRenderTarget=function(A,G=0,ae=0){C=A,E=G,_=ae;let de=!0,K=null,_e=!1,Ue=!1;if(A){const He=re.get(A);if(He.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(R.FRAMEBUFFER,null),de=!1;else if(He.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(He.__hasExternalTextures)P.rebindTextures(A,re.get(A.texture).__webglTexture,re.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ye=A.depthTexture;if(He.__boundDepthTexture!==Ye){if(Ye!==null&&re.has(Ye)&&(A.width!==Ye.image.width||A.height!==Ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const je=A.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Ue=!0);const Je=re.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Je[G])?K=Je[G][ae]:K=Je[G],_e=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?K=re.get(A).__webglMultisampledFramebuffer:Array.isArray(Je)?K=Je[ae]:K=Je,D.copy(A.viewport),z.copy(A.scissor),U=A.scissorTest}else D.copy(O).multiplyScalar(X).floor(),z.copy(le).multiplyScalar(X).floor(),U=Se;if(ae!==0&&(K=Vr),j.bindFramebuffer(R.FRAMEBUFFER,K)&&de&&j.drawBuffers(A,K),j.viewport(D),j.scissor(z),j.setScissorTest(U),_e){const He=re.get(A.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+G,He.__webglTexture,ae)}else if(Ue){const He=re.get(A.texture),je=G;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,He.__webglTexture,ae,je)}else if(A!==null&&ae!==0){const He=re.get(A.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,He.__webglTexture,ae)}M=-1},this.readRenderTargetPixels=function(A,G,ae,de,K,_e,Ue){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ue!==void 0&&(Be=Be[Ue]),Be){j.bindFramebuffer(R.FRAMEBUFFER,Be);try{const He=A.texture,je=He.format,Je=He.type;if(!Te.textureFormatReadable(je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Te.textureTypeReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=A.width-de&&ae>=0&&ae<=A.height-K&&R.readPixels(G,ae,de,K,Oe.convert(je),Oe.convert(Je),_e)}finally{const He=C!==null?re.get(C).__webglFramebuffer:null;j.bindFramebuffer(R.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(A,G,ae,de,K,_e,Ue){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Be=re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ue!==void 0&&(Be=Be[Ue]),Be){const He=A.texture,je=He.format,Je=He.type;if(!Te.textureFormatReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Te.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=A.width-de&&ae>=0&&ae<=A.height-K){j.bindFramebuffer(R.FRAMEBUFFER,Be);const Ye=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ye),R.bufferData(R.PIXEL_PACK_BUFFER,_e.byteLength,R.STREAM_READ),R.readPixels(G,ae,de,K,Oe.convert(je),Oe.convert(Je),0);const rt=C!==null?re.get(C).__webglFramebuffer:null;j.bindFramebuffer(R.FRAMEBUFFER,rt);const ct=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await eu(R,ct,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ye),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,_e),R.deleteBuffer(Ye),R.deleteSync(ct),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,G=null,ae=0){A.isTexture!==!0&&(li("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,A=arguments[1]);const de=Math.pow(2,-ae),K=Math.floor(A.image.width*de),_e=Math.floor(A.image.height*de),Ue=G!==null?G.x:0,Be=G!==null?G.y:0;P.setTexture2D(A,0),R.copyTexSubImage2D(R.TEXTURE_2D,ae,0,0,Ue,Be,K,_e),j.unbindTexture()};const Wr=R.createFramebuffer(),ye=R.createFramebuffer();this.copyTextureToTexture=function(A,G,ae=null,de=null,K=0,_e=null){A.isTexture!==!0&&(li("WebGLRenderer: copyTextureToTexture function signature has changed."),de=arguments[0]||null,A=arguments[1],G=arguments[2],_e=arguments[3]||0,ae=null),_e===null&&(K!==0?(li("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_e=K,K=0):_e=0);let Ue,Be,He,je,Je,Ye,rt,ct,Pt;const Et=A.isCompressedTexture?A.mipmaps[_e]:A.image;if(ae!==null)Ue=ae.max.x-ae.min.x,Be=ae.max.y-ae.min.y,He=ae.isBox3?ae.max.z-ae.min.z:1,je=ae.min.x,Je=ae.min.y,Ye=ae.isBox3?ae.min.z:0;else{const an=Math.pow(2,-K);Ue=Math.floor(Et.width*an),Be=Math.floor(Et.height*an),A.isDataArrayTexture?He=Et.depth:A.isData3DTexture?He=Math.floor(Et.depth*an):He=1,je=0,Je=0,Ye=0}de!==null?(rt=de.x,ct=de.y,Pt=de.z):(rt=0,ct=0,Pt=0);const ot=Oe.convert(G.format),qe=Oe.convert(G.type);let Ot;G.isData3DTexture?(P.setTexture3D(G,0),Ot=R.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(P.setTexture2DArray(G,0),Ot=R.TEXTURE_2D_ARRAY):(P.setTexture2D(G,0),Ot=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,G.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,G.unpackAlignment);const ht=R.getParameter(R.UNPACK_ROW_LENGTH),hn=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ei=R.getParameter(R.UNPACK_SKIP_PIXELS),tn=R.getParameter(R.UNPACK_SKIP_ROWS),hs=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,Et.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Et.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,je),R.pixelStorei(R.UNPACK_SKIP_ROWS,Je),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ye);const wt=A.isDataArrayTexture||A.isData3DTexture,rn=G.isDataArrayTexture||G.isData3DTexture;if(A.isDepthTexture){const an=re.get(A),Wt=re.get(G),jt=re.get(an.__renderTarget),Xr=re.get(Wt.__renderTarget);j.bindFramebuffer(R.READ_FRAMEBUFFER,jt.__webglFramebuffer),j.bindFramebuffer(R.DRAW_FRAMEBUFFER,Xr.__webglFramebuffer);for(let ti=0;ti<He;ti++)wt&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,re.get(A).__webglTexture,K,Ye+ti),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,re.get(G).__webglTexture,_e,Pt+ti)),R.blitFramebuffer(je,Je,Ue,Be,rt,ct,Ue,Be,R.DEPTH_BUFFER_BIT,R.NEAREST);j.bindFramebuffer(R.READ_FRAMEBUFFER,null),j.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(K!==0||A.isRenderTargetTexture||re.has(A)){const an=re.get(A),Wt=re.get(G);j.bindFramebuffer(R.READ_FRAMEBUFFER,Wr),j.bindFramebuffer(R.DRAW_FRAMEBUFFER,ye);for(let jt=0;jt<He;jt++)wt?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,an.__webglTexture,K,Ye+jt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,an.__webglTexture,K),rn?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Wt.__webglTexture,_e,Pt+jt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Wt.__webglTexture,_e),K!==0?R.blitFramebuffer(je,Je,Ue,Be,rt,ct,Ue,Be,R.COLOR_BUFFER_BIT,R.NEAREST):rn?R.copyTexSubImage3D(Ot,_e,rt,ct,Pt+jt,je,Je,Ue,Be):R.copyTexSubImage2D(Ot,_e,rt,ct,je,Je,Ue,Be);j.bindFramebuffer(R.READ_FRAMEBUFFER,null),j.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else rn?A.isDataTexture||A.isData3DTexture?R.texSubImage3D(Ot,_e,rt,ct,Pt,Ue,Be,He,ot,qe,Et.data):G.isCompressedArrayTexture?R.compressedTexSubImage3D(Ot,_e,rt,ct,Pt,Ue,Be,He,ot,Et.data):R.texSubImage3D(Ot,_e,rt,ct,Pt,Ue,Be,He,ot,qe,Et):A.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,_e,rt,ct,Ue,Be,ot,qe,Et.data):A.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,_e,rt,ct,Et.width,Et.height,ot,Et.data):R.texSubImage2D(R.TEXTURE_2D,_e,rt,ct,Ue,Be,ot,qe,Et);R.pixelStorei(R.UNPACK_ROW_LENGTH,ht),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,hn),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ei),R.pixelStorei(R.UNPACK_SKIP_ROWS,tn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,hs),_e===0&&G.generateMipmaps&&R.generateMipmap(Ot),j.unbindTexture()},this.copyTextureToTexture3D=function(A,G,ae=null,de=null,K=0){return A.isTexture!==!0&&(li("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ae=arguments[0]||null,de=arguments[1]||null,A=arguments[2],G=arguments[3],K=arguments[4]||0),li('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,G,ae,de,K)},this.initRenderTarget=function(A){re.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),j.unbindTexture()},this.resetState=function(){E=0,_=0,C=null,j.reset(),Ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=at._getDrawingBufferColorSpace(e),t.unpackColorSpace=at._getUnpackColorSpace()}}class $n{constructor(e){B(this,"state");this.state=e>>>0}next(){let e=this.state=this.state+1831565813|0,t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}range(e,t){return e+this.next()*(t-e)}int(e,t){return Math.floor(this.range(e,t+1))}pick(e){return e[Math.floor(this.next()*e.length)%e.length]}}function pr(s,e,t){let n=Math.imul(s,374761393)+Math.imul(e,668265263)+Math.imul(t,1442695041);return n=(n^n>>>13)>>>0,n=Math.imul(n,1274126177)>>>0,((n^n>>>16)>>>0)/4294967296}function fg(s,e,t=1337){const n=Math.floor(s),i=Math.floor(e),r=s-n,a=e-i,o=r*r*(3-2*r),l=a*a*(3-2*a),c=pr(n,i,t),h=pr(n+1,i,t),u=pr(n,i+1,t),d=pr(n+1,i+1,t);return c+(h-c)*o+(u-c)*l+(c-h-u+d)*o*l}function Tr(s,e,t=4,n=1337){let i=0,r=.5,a=1,o=0;for(let l=0;l<t;l++)i+=(fg(s*a,e*a,n+l*97)*2-1)*r,o+=r,r*=.5,a*=2.02;return i/o}function mt(s,e,t){const n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)}function Ge(s,e,t){return s<e?e:s>t?t:s}function St(s,e,t){return s+(e-s)*t}const Zl=new I(0,1,0);class pg{constructor(e,t=1500){B(this,"spec");B(this,"curve");B(this,"length");B(this,"samples");B(this,"checkpoints");B(this,"sampleStep");B(this,"minRadius");B(this,"maxGrade");B(this,"maxBankingDeg");B(this,"cpParamU");this.spec=e;const n=e.controlPoints.map(d=>new I(d.x,d.y,d.z));this.curve=new Oc(n,!0,"centripetal",.5),this.length=this.curve.getLength(),this.sampleStep=this.length/t;const i=1200,r=[];for(let d=0;d<i;d++)r.push(this.curve.getPointAt(d/i));this.cpParamU=e.controlPoints.map(d=>{let f=0,g=1/0;for(let v=0;v<i;v++){const p=r[v],m=(p.x-d.x)**2+(p.y-d.y)**2+(p.z-d.z)**2;m<g&&(g=m,f=v/i)}return f});const a=[];for(let d=0;d<t;d++){const f=d/t,g=f*this.length,v=this.curve.getPointAt(f),p=this.curve.getTangentAt(f).normalize(),m=new I().crossVectors(p,Zl).normalize(),w=new I().crossVectors(m,p).normalize(),{width:y,bankDeg:x}=this.interpolateControlAttrs(f),b=Cr.degToRad(x),E=m.clone().multiplyScalar(Math.cos(b)).addScaledVector(w,Math.sin(b)).normalize(),_=new I().crossVectors(E,p).normalize(),C=this.getZoneForS(g),M=g>=e.bridge.startS&&g<=e.bridge.endS;a.push({s:g,u:f,pos:v,tangent:p,right:E,up:_,flatRight:m,width:y,bankRad:b,curvature:0,radius:1e6,grade:0,zone:C,isBridge:M})}let o=1/0,l=0,c=0;const h=2;for(let d=0;d<t;d++){const f=a[(d-h+t)%t],g=a[d],v=a[(d+h)%t],p=2*h*this.sampleStep,m=f.tangent.x,w=f.tangent.z,y=Math.hypot(m,w)||1,x=v.tangent.x,b=v.tangent.z,E=Math.hypot(x,b)||1,_=Ge((m*x+w*b)/(y*E),-1,1),C=(w*x-m*b)/(y*E),M=Math.sign(C)*Math.acos(_);g.curvature=M/p,g.radius=Math.abs(g.curvature)>1e-5?1/Math.abs(g.curvature):1e6;const S=Math.hypot(v.pos.x-f.pos.x,v.pos.z-f.pos.z);g.grade=(v.pos.y-f.pos.y)/Math.max(.01,S),g.radius<o&&(o=g.radius),Math.abs(g.grade)>l&&(l=Math.abs(g.grade));const D=Math.abs(Cr.radToDeg(g.bankRad));D>c&&(c=D)}this.samples=a,this.minRadius=o,this.maxGrade=l,this.maxBankingDeg=c,this.checkpoints=[];const u=e.checkpointCount;for(let d=0;d<u;d++){const f=this.wrapS(e.startFinishS+d/u*this.length),g=this.sampleAtS(f);this.checkpoints.push({index:d,s:f,pos:g.pos.clone(),tangent:g.tangent.clone(),right:g.right.clone(),width:g.width})}}interpolateControlAttrs(e){const t=this.spec.controlPoints,n=t.length;let i=n-1,r=0,a=0;for(let l=0;l<n;l++){const c=this.cpParamU[l],h=l+1<n?this.cpParamU[l+1]:this.cpParamU[0]+1,u=e<this.cpParamU[0]?e+1:e;if(u>=c&&u<=h){i=l,r=(l+1)%n;const d=Math.max(1e-5,h-c);a=Ge((u-c)/d,0,1);break}}const o=a*a*(3-2*a);return{width:St(t[i].width,t[r].width,o),bankDeg:St(t[i].bankDeg,t[r].bankDeg,o)}}wrapS(e){let t=e%this.length;return t<0&&(t+=this.length),t}deltaS(e,t){let n=this.wrapS(t)-this.wrapS(e);return n>this.length*.5&&(n-=this.length),n<-this.length*.5&&(n+=this.length),n}getZoneForS(e){const t=this.wrapS(e);for(const n of this.spec.zones)if(t>=n.startS&&t<n.endS)return n.id;return this.spec.zones[this.spec.zones.length-1].id}sampleAtS(e){const t=this.wrapS(e),n=t/this.length*this.samples.length,i=Math.floor(n)%this.samples.length,r=(i+1)%this.samples.length,a=n-Math.floor(n),o=this.samples[i],l=this.samples[r],c=o.pos.clone().lerp(l.pos,a),h=o.tangent.clone().lerp(l.tangent,a).normalize(),u=o.right.clone().lerp(l.right,a).normalize(),d=new I().crossVectors(u,h).normalize(),f=new I().crossVectors(h,Zl).normalize();return{s:t,u:t/this.length,pos:c,tangent:h,right:u,up:d,flatRight:f,width:St(o.width,l.width,a),bankRad:St(o.bankRad,l.bankRad,a),curvature:St(o.curvature,l.curvature,a),radius:St(o.radius,l.radius,a),grade:St(o.grade,l.grade,a),zone:this.getZoneForS(t),isBridge:t>=this.spec.bridge.startS&&t<=this.spec.bridge.endS}}closestPointXZ(e,t,n){const i=this.samples.length;let r=0,a=1/0;if(n!==void 0){const y=Math.floor(this.wrapS(n)/this.length*i),x=85;for(let b=-x;b<=x;b++){const E=(y+b+i)%i,_=this.samples[E].pos,C=e-_.x,M=t-_.z,S=C*C+M*M;S<a&&(a=S,r=E)}if(a>2025)for(let b=0;b<i;b+=3){const E=this.samples[b].pos,_=(e-E.x)**2+(t-E.z)**2;_<a&&(a=_,r=b)}}else for(let y=0;y<i;y+=4){const x=this.samples[y].pos,b=(e-x.x)**2+(t-x.z)**2;b<a&&(a=b,r=y)}const o=r;for(let y=-5;y<=5;y++){const x=(o+y+i)%i,b=this.samples[x].pos,E=(e-b.x)**2+(t-b.z)**2;E<a&&(a=E,r=x)}const l=this.samples[r],c=e-l.pos.x,h=t-l.pos.z,u=Math.hypot(l.tangent.x,l.tangent.z)||1,d=(c*l.tangent.x+h*l.tangent.z)/u,f=this.wrapS(l.s+Ge(d,-this.sampleStep*1.2,this.sampleStep*1.2)),g=this.sampleAtS(f),v=e-g.pos.x,p=t-g.pos.z,m=v*g.flatRight.x+p*g.flatRight.z,w=Math.hypot(v,p);return{sample:g,lateral:m,distXZ:w}}roadSurfaceY(e,t){return e.pos.y+t*Math.sin(e.bankRad)}}class mg{constructor(e,t){B(this,"cfg");B(this,"cols");B(this,"rows");B(this,"heights");B(this,"splats");B(this,"mesh");B(this,"material");B(this,"triplanarActive",!1);B(this,"track");B(this,"plazaCenter");B(this,"plazaRadius");this.track=e,this.cfg={minX:(t==null?void 0:t.minX)??-320,maxX:(t==null?void 0:t.maxX)??940,minZ:(t==null?void 0:t.minZ)??-740,maxZ:(t==null?void 0:t.maxZ)??740,cellSize:(t==null?void 0:t.cellSize)??3},this.cols=Math.ceil((this.cfg.maxX-this.cfg.minX)/this.cfg.cellSize)+1,this.rows=Math.ceil((this.cfg.maxZ-this.cfg.minZ)/this.cfg.cellSize)+1,this.heights=new Float32Array(this.cols*this.rows),this.splats=new Float32Array(this.cols*this.rows*4);const n=e.sampleAtS(e.spec.plaza.s);this.plazaRadius=e.spec.plaza.radius,this.plazaCenter=n.pos.clone().addScaledVector(n.flatRight,e.spec.plaza.side*e.spec.plaza.offset),this.buildHeightfield();const i=this.buildGeometry();this.material=new Xe({color:16777215,roughness:.92,metalness:0}),this.mesh=new Ee(i,this.material),this.mesh.name="terrain_main",this.mesh.receiveShadow=!0,this.mesh.castShadow=!0}getPlazaCenter(){return this.plazaCenter.clone()}buildHeightfield(){const{minX:e,minZ:t,cellSize:n}=this.cfg,{cols:i,rows:r,track:a}=this,o=a.spec.seed,l=24,c=new Map,h=a.samples;for(let f=0;f<h.length;f++){const g=Math.floor(h[f].pos.x/l),v=Math.floor(h[f].pos.z/l),p=`${g},${v}`;let m=c.get(p);m||(m=[],c.set(p,m)),m.push(f)}const u=(f,g)=>{const v=Math.floor(f/l),p=Math.floor(g/l);let m=-1,w=1/0;for(let H=-2;H<=2;H++)for(let ee=-2;ee<=2;ee++){const W=c.get(`${v+ee},${p+H}`);if(W)for(let Q=0;Q<W.length;Q++){const X=W[Q],te=h[X].pos,N=(f-te.x)**2+(g-te.z)**2;N<w&&(w=N,m=X)}}if(m<0)return null;const y=h[m],x=f-y.pos.x,b=g-y.pos.z,E=Math.hypot(y.tangent.x,y.tangent.z)||1,_=(x*y.tangent.x+b*y.tangent.z)/E,C=a.wrapS(y.s+Ge(_,-a.sampleStep*1.1,a.sampleStep*1.1)),M=a.sampleAtS(C),S=f-M.pos.x,D=g-M.pos.z,z=S*M.flatRight.x+D*M.flatRight.z,U=Math.hypot(S,D);return{smp:M,lateral:z,distXZ:U}},d=a.spec.bridge;for(let f=0;f<r;f++){const g=t+f*n;for(let v=0;v<i;v++){const p=e+v*n,m=f*i+v,w=28*Math.exp(-(((g+30)/310)**2))+12*Math.sin(g*.0065),y=mt(390,620,g)*90,x=-32-w-y,b=p-x,E=-375-212*Math.exp(-(((p-215)/225)**2))+mt(420,820,p)*145,_=g-E,M=885-mt(250,-340,g)*105+Math.sin(g*.008)*24-p,D=715-mt(240,-60,p)*38+Math.cos(p*.007)*20-g,z=(L,F,V)=>{const ce=Ge(.5+.5*(F-L)/V,0,1);return St(F,L,ce)-V*ce*(1-ce)},U=z(z(b,_,44),z(M,D,48),52),H=Tr(p*.0022,g*.0022,4,o+11),ee=Tr(p*.0075,g*.0075,3,o+29),W=Tr(p*.024,g*.024,2,o+53);let Q;if(U<0){const L=Ge(-U/180,0,1);Q=-Math.pow(L,1.2)*20+ee*.7}else if(U<36){const L=U/36,F=mt(-350,-480,g)*mt(30,140,p),V=L*2.55+ee*.35*L+W*.12*L,ce=Math.pow(L,1.35)*16+ee*2.2*L;Q=St(V,ce,F)}else{const L=mt(36,540,U);Q=2.55+(54*Math.pow(L,.96)+mt(670,920,p)*(46+H*26)+H*14*L+ee*4.8*L+W*.85)}let X=1-mt(1.8,7.5,Q),te=mt(2,9,Q)*(.65+.35*H),N=mt(10,32,Q)*mt(80,380,g),O=0;const le=Math.hypot(p-this.plazaCenter.x,g-this.plazaCenter.z);if(le<this.plazaRadius+16){const L=1-mt(this.plazaRadius*.85,this.plazaRadius+16,le),F=this.plazaCenter.y+.08;Q=St(Q,F,L),O=Math.max(O,L*.9),te*=1-L*.8}const Se=u(p,g);if(Se){const{smp:L,lateral:F}=Se,V=L.width*.5,ce=Math.abs(F),ie=Ge(F,-V-2,V+2),se=a.roadSurfaceY(L,ie),Y=L.s-d.startS,ne=d.endS-L.s,R=mt(4,22,Y)*mt(4,22,ne),fe=V+(L.zone==="Z3"?4.4:3.8);let ue=fe+13.5,Te=Q;if(L.zone==="Z2"){const J=mt(1135,1205,L.s),re=1-mt(1345,1415,L.s),P=J*re,$=1-(F<0?1-P:P);if(ce>fe){const oe=mt(fe,fe+18,ce)*26,pe=Math.max(Q,se+oe+ee*4.5),he=mt(fe,fe+26,ce)*Math.max(12,se-1),Ae=Math.min(Q,Math.max(-2,se-.55-he));Te=St(Ae,pe,$),ue=fe+11}}else if(L.zone==="Z1"&&F<-fe){const J=mt(fe,fe+26,ce)*2.7;Te=Math.min(Q,Math.max(-3,se-.08-J)),ue=fe+10}else if(L.zone==="Z3"){const J=fe+28;if(ce<J){const re=F>0?3.2*mt(fe+6,fe+22,F):-2.2*mt(fe+6,fe+22,ce),P=se+.05+re,T=1-mt(fe+18,J,ce);Te=St(Q,P,T*.72)}ue=fe+9.5}if(ce<=V-.35)Q=se-.12;else if(ce<=fe){const J=mt(V-.35,V+.65,ce);Q=St(se-.12,se-.03,J)}else if(ce<=ue){const J=mt(fe,ue,ce);Q=St(se-.03,Te,J)}else if(L.zone==="Z2"&&ce<=ue+18){const J=1-mt(ue,ue+18,ce);Q=St(Q,Te,J)}if(R>.001&&ce<44){const J=1-mt(10,44,ce),re=Math.max(1.2,se-d.ravineDepth-1.5+W*.9),P=R*J;Q=St(Q,re,P),N=Math.max(N,P*.8),O=Math.max(O,P*.35)}const j=1-mt(V+.5,V+7,ce);j>.01&&(L.zone==="Z1"?(X=Math.max(X,j*.95),te*=1-j*.85):L.zone==="Z2"?O=Math.max(O,j*.92):L.zone==="Z3"?(O=Math.max(O,j*.85),te*=1-j*.6):(N=Math.max(N,j*.78),O=Math.max(O,j*.35)))}const Z=Math.max(1e-4,X+te+N+O);this.heights[m]=Q;const k=m*4;this.splats[k+0]=X/Z,this.splats[k+1]=te/Z,this.splats[k+2]=N/Z,this.splats[k+3]=O/Z}}}buildGeometry(){const{minX:e,minZ:t,cellSize:n}=this.cfg,{cols:i,rows:r,heights:a,splats:o}=this,l=i*r,c=new Float32Array(l*3),h=new Float32Array(l*2),u=new Float32Array(l*4);for(let p=0;p<r;p++){const m=t+p*n;for(let w=0;w<i;w++){const y=e+w*n,x=p*i+w;c[x*3+0]=y,c[x*3+1]=a[x],c[x*3+2]=m,h[x*2+0]=y/8,h[x*2+1]=m/8,u[x*4+0]=o[x*4+0],u[x*4+1]=o[x*4+1],u[x*4+2]=o[x*4+2],u[x*4+3]=o[x*4+3]}}const d=(i-1)*(r-1),f=new Uint32Array(d*6);let g=0;for(let p=0;p<r-1;p++)for(let m=0;m<i-1;m++){const w=p*i+m,y=w+1,x=(p+1)*i+m,b=x+1;f[g++]=w,f[g++]=x,f[g++]=y,f[g++]=y,f[g++]=x,f[g++]=b}const v=new xt;return v.setAttribute("position",new vt(c,3)),v.setAttribute("uv",new vt(h,2)),v.setAttribute("aSplat",new vt(u,4)),v.setIndex(new vt(f,1)),v.computeVertexNormals(),v}getHeight(e,t){const{minX:n,minZ:i,cellSize:r}=this.cfg,a=Ge((e-n)/r,0,this.cols-1.0001),o=Ge((t-i)/r,0,this.rows-1.0001),l=Math.floor(a),c=Math.floor(o),h=a-l,u=o-c,d=c*this.cols+l,f=this.heights[d],g=this.heights[d+1],v=this.heights[d+this.cols],p=this.heights[d+this.cols+1];return h+u<=1?f+(g-f)*h+(v-f)*u:p+(v-p)*(1-h)+(g-p)*(1-u)}getNormal(e,t,n=new I){const r=this.getHeight(e-.75,t),a=this.getHeight(e+.75,t),o=this.getHeight(e,t-.75),l=this.getHeight(e,t+.75);return n.set(r-a,2*.75,o-l).normalize()}getSurfaceType(e,t){const{minX:n,minZ:i,cellSize:r}=this.cfg,a=Ge(Math.round((e-n)/r),0,this.cols-1),l=(Ge(Math.round((t-i)/r),0,this.rows-1)*this.cols+a)*4,c=this.splats[l],h=this.splats[l+1],u=this.splats[l+2],d=this.splats[l+3];return c>=h&&c>=u&&c>=d?"sand":d>=h&&d>=u?"gravel":"grass"}applyPBRTextures(e){const t=this.material;t.map=e.grass.map,t.normalMap=e.grass.normalMap,t.roughnessMap=e.grass.roughnessMap,t.roughness=.94,t.metalness=0,t.onBeforeCompile=n=>{n.uniforms.uSandMap={value:e.sand.map},n.uniforms.uSandNorm={value:e.sand.normalMap},n.uniforms.uForestMap={value:e.forest.map},n.uniforms.uGravelMap={value:e.gravel.map},n.uniforms.uCliffMap={value:e.cliff.map},n.uniforms.uCliffNorm={value:e.cliff.normalMap},n.uniforms.uSeaLevel={value:this.track.spec.seaLevel},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
          attribute vec4 aSplat;
          varying vec4 vSplat;
          varying vec3 vWorldPos;
          varying vec3 vWorldNorm;`).replace("#include <begin_vertex>",`#include <begin_vertex>
          vSplat = aSplat;
          vec4 wp = modelMatrix * vec4(transformed, 1.0);
          vWorldPos = wp.xyz;
          vWorldNorm = normalize(mat3(modelMatrix) * objectNormal);`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
          uniform sampler2D uSandMap;
          uniform sampler2D uSandNorm;
          uniform sampler2D uForestMap;
          uniform sampler2D uGravelMap;
          uniform sampler2D uCliffMap;
          uniform sampler2D uCliffNorm;
          uniform float uSeaLevel;
          varying vec4 vSplat;
          varying vec3 vWorldPos;
          varying vec3 vWorldNorm;

          vec4 triplanarSample(sampler2D tex, vec3 wp, vec3 wn, float scale) {
            vec3 blend = pow(abs(wn), vec3(4.0));
            blend /= max(blend.x + blend.y + blend.z, 0.0001);
            vec4 cx = texture2D(tex, wp.zy * scale);
            vec4 cy = texture2D(tex, wp.xz * scale);
            vec4 cz = texture2D(tex, wp.xy * scale);
            return cx * blend.x + cy * blend.y + cz * blend.z;
          }`).replace("#include <map_fragment>",`
          vec2 uvTile = vWorldPos.xz * 0.14;
          vec2 uvMacro = vWorldPos.xz * 0.023;
          float macroVar = 0.88 + 0.24 * sin(vWorldPos.x * 0.021 + sin(vWorldPos.z * 0.017) * 2.2) * cos(vWorldPos.z * 0.019);

          vec3 colSand = mix(texture2D(uSandMap, uvTile * 1.1).rgb, texture2D(uSandMap, uvMacro * 1.4).rgb, 0.28) * vec3(1.16, 1.09, 0.94);
          vec3 colGrass = mix(texture2D(map, uvTile * 0.95).rgb, texture2D(map, uvMacro * 1.2).rgb, 0.30) * vec3(0.76, 1.18, 0.64);
          vec3 colForest = mix(texture2D(uForestMap, uvTile * 0.85).rgb, texture2D(uForestMap, uvMacro * 1.1).rgb, 0.25) * vec3(0.84, 1.08, 0.72);
          vec3 colGravel = mix(texture2D(uGravelMap, uvTile * 1.2).rgb, texture2D(uGravelMap, uvMacro * 1.3).rgb, 0.25) * vec3(1.06, 1.02, 0.94);

          vec4 sw = vSplat;
          vec3 groundCol = (colSand * sw.x + colGrass * sw.y + colForest * sw.z + colGravel * sw.w) * macroVar;

          // Triplanar limestone cliff rock on steep slopes (ZERO vertical UV stretching!)
          vec3 wn = normalize(vWorldNorm);
          float cliffMask = smoothstep(0.89, 0.60, wn.y);
          vec3 cliffNear = triplanarSample(uCliffMap, vWorldPos, wn, 0.085).rgb;
          vec3 cliffFar = triplanarSample(uCliffMap, vWorldPos, wn, 0.022).rgb;
          // Sun-baked warm Mediterranean limestone strata modulation
          float strata = 0.88 + 0.16 * sin(vWorldPos.y * 0.95 + sin(vWorldPos.x * 0.08) * 1.4);
          vec3 colCliff = mix(cliffNear, cliffFar, 0.34) * vec3(1.26, 1.18, 1.04) * strata;
          groundCol = mix(groundCol, colCliff, cliffMask);

          // Wet sand shoreline darkening right above sea level
          float wetBand = (1.0 - smoothstep(uSeaLevel - 0.3, uSeaLevel + 1.15, vWorldPos.y)) * sw.x;
          groundCol = mix(groundCol, groundCol * vec3(0.42, 0.40, 0.38), wetBand * 0.88);

          diffuseColor.rgb *= groundCol;
          `).replace("#include <normal_fragment_maps>",`
          #include <normal_fragment_maps>
          {
            vec3 wnN = normalize(vWorldNorm);
            float cMaskN = smoothstep(0.89, 0.60, wnN.y);
            if (cMaskN > 0.01) {
              vec3 cB = pow(abs(wnN), vec3(4.0));
              cB /= max(cB.x + cB.y + cB.z, 0.0001);
              vec3 nX = texture2D(uCliffNorm, vWorldPos.zy * 0.085).xyz * 2.0 - 1.0;
              vec3 nY = texture2D(uCliffNorm, vWorldPos.xz * 0.085).xyz * 2.0 - 1.0;
              vec3 nZ = texture2D(uCliffNorm, vWorldPos.xy * 0.085).xyz * 2.0 - 1.0;
              vec3 triW = normalize(
                vec3(wnN.x, wnN.y + nX.y * 0.85, wnN.z + nX.x * 0.85) * cB.x +
                vec3(wnN.x + nY.x * 0.85, wnN.y, wnN.z + nY.y * 0.85) * cB.y +
                vec3(wnN.x + nZ.x * 0.85, wnN.y + nZ.y * 0.85, wnN.z) * cB.z
              );
              vec3 triV = normalize((viewMatrix * vec4(triW, 0.0)).xyz);
              normal = normalize(mix(normal, triV, cMaskN));
            }
          }
          `).replace("#include <roughnessmap_fragment>",`
          #include <roughnessmap_fragment>
          float wetRoughMask = (1.0 - smoothstep(uSeaLevel - 0.3, uSeaLevel + 0.95, vWorldPos.y)) * vSplat.x;
          roughnessFactor = mix(roughnessFactor, 0.16, wetRoughMask * 0.92);
          `)},t.customProgramCacheKey=()=>"terrain-triplanar-pbr-v4",t.needsUpdate=!0,this.triplanarActive=!0}}function gg(s){const e=new pt;e.name="road_system";const t=1200,n=s.length/t,i=6,r=(t+1)*i,a=new Float32Array(r*3),o=new Float32Array(r*3),l=new Float32Array(r*2),c=new Float32Array(r*4),h=new Uint32Array(t*(i-1)*6),u=te=>te==="Z1"?0:te==="Z2"?1:te==="Z3"?2:3;for(let te=0;te<=t;te++){const N=te%t*n,O=s.sampleAtS(N),le=O.width*.5,Se=u(O.zone),Z=O.isBridge?1:0;for(let k=0;k<i;k++){const L=k/(i-1),F=(L*2-1)*le,V=Math.sin(L*Math.PI)*.025,ce=O.pos.x+O.right.x*F+O.up.x*V,ie=O.pos.y+O.right.y*F+O.up.y*V,se=O.pos.z+O.right.z*F+O.up.z*V,Y=te*i+k;a[Y*3+0]=ce,a[Y*3+1]=ie,a[Y*3+2]=se,o[Y*3+0]=O.up.x,o[Y*3+1]=O.up.y,o[Y*3+2]=O.up.z,l[Y*2+0]=L,l[Y*2+1]=te*n/6,c[Y*4+0]=N,c[Y*4+1]=Se,c[Y*4+2]=Z,c[Y*4+3]=O.width}}let d=0;for(let te=0;te<t;te++)for(let N=0;N<i-1;N++){const O=te*i+N,le=O+1,Se=(te+1)*i+N,Z=Se+1;h[d++]=O,h[d++]=le,h[d++]=Se,h[d++]=le,h[d++]=Z,h[d++]=Se}const f=new xt;f.setAttribute("position",new vt(a,3)),f.setAttribute("normal",new vt(o,3)),f.setAttribute("uv",new vt(l,2)),f.setAttribute("aRoadMeta",new vt(c,4)),f.setIndex(new vt(h,1)),f.computeVertexNormals();const g=new Xe({color:16777215,roughness:.78,metalness:.04}),v=new Ee(f,g);v.name="road_asphalt",v.receiveShadow=!0,v.castShadow=!1,e.add(v);const p=[],m=[],w=[],y=[],x=[],b=[],E=Array.from(a),_=Array.from(h),C=new Array(h.length/3).fill(0);for(let te=0;te<t;te++){const N=(te+.5)%t*n;if(N>=s.spec.bridge.startS&&N<=s.spec.bridge.endS){const O=te*(i-1)*2;for(let le=0;le<(i-1)*2;le++)C[O+le]=3}}const M=(te,N,O,le,Se,Z,k,L,F)=>{const V=k.length,ce=te.length/3,ie=E.length/3,se=Se-le;if(!(se<=0)){for(let Y=0;Y<=se;Y++){const ne=le+Y,R=ne%t*n,fe=s.sampleAtS(R),ue=fe.width*.5,Te=ne*n/4;for(let j=0;j<V;j++){const[J,re,P]=k[j],T=Z*(ue+J),$=fe.pos.x+fe.right.x*T+fe.up.x*re,oe=fe.pos.y+fe.right.y*T+fe.up.y*re,pe=fe.pos.z+fe.right.z*T+fe.up.z*re;te.push($,oe,pe),N.push(P,Te),E.push($,oe,pe)}}for(let Y=0;Y<se;Y++)for(let ne=0;ne<V-1;ne++){const R=ce+Y*V+ne,fe=R+1,ue=ce+(Y+1)*V+ne,Te=ue+1;Z===1?O.push(R,fe,ue,fe,Te,ue):O.push(R,ue,fe,fe,ue,Te);{const j=ie+Y*V+ne,J=j+1,re=ie+(Y+1)*V+ne,P=re+1;Z===1?_.push(j,J,re,J,P,re):_.push(j,re,J,J,re,P),C.push(F,F)}}}};let S=0,D=s.sampleAtS(0).zone==="Z3";const z=(te,N,O)=>{for(const le of[-1,1])O?M(y,x,b,te,N,le,[[-.02,0,0],[.08,.13,.06],[.32,.14,.14],[2.9,.14,1],[3.1,-.35,1.12]],!0,1):M(p,m,w,te,N,le,[[-.02,0,0],[.28,.045,.15],[.52,.01,.28],[2.2,-.055,.9],[2.55,-.26,1]],!0,1)};for(let te=1;te<=t;te++){const N=te%t*n,le=s.sampleAtS(N).zone==="Z3";(le!==D||te===t)&&(z(S,te,D),S=te,D=le)}const U=new xt;U.setAttribute("position",new et(p,3)),U.setAttribute("uv",new et(m,2)),U.setIndex(w),U.computeVertexNormals();const H=new Xe({color:14209734,roughness:.9,metalness:.02}),ee=new Ee(U,H);ee.name="road_shoulders",ee.receiveShadow=!0,e.add(ee);const W=new xt;W.setAttribute("position",new et(y,3)),W.setAttribute("uv",new et(x,2)),W.setIndex(b),W.computeVertexNormals();const Q=new Xe({color:15130579,roughness:.88,metalness:.02}),X=new Ee(W,Q);return X.name="village_sidewalks",X.receiveShadow=!0,X.castShadow=!0,e.add(X),{group:e,asphaltMesh:v,shoulderMesh:ee,sidewalkMesh:X,asphaltMaterial:g,shoulderMaterial:H,sidewalkMaterial:Q,colliderData:{positions:new Float32Array(E),indices:new Uint32Array(_),triSurface:new Uint8Array(C)}}}function vg(s,e,t){const n=s.asphaltMaterial;n.map=t.asphaltMain.map,n.normalMap=t.asphaltMain.normalMap,n.normalScale.set(1.35,1.35),n.roughnessMap=t.asphaltMain.roughnessMap,t.asphaltMain.aoMap&&(n.aoMap=t.asphaltMain.aoMap),n.roughness=.84,n.metalness=.03,n.onBeforeCompile=i=>{i.uniforms.uWornMap={value:t.asphaltWorn.map},i.uniforms.uSandMap={value:t.sand.map},i.uniforms.uStartS={value:e.spec.startFinishS},i.uniforms.uTrackLen={value:e.length},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
        attribute vec4 aRoadMeta;
        varying vec4 vRoadMeta;
        varying vec2 vRoadUv;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vRoadMeta = aRoadMeta;
        vRoadUv = uv;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
        uniform sampler2D uWornMap;
        uniform sampler2D uSandMap;
        uniform float uStartS;
        uniform float uTrackLen;
        varying vec4 vRoadMeta;
        varying vec2 vRoadUv;`).replace("#include <map_fragment>",`
        vec2 uvMain = vec2(vRoadUv.x * 2.2, vRoadUv.y * 1.15);
        vec2 uvWorn = vec2(vRoadUv.x * 1.4, vRoadUv.y * 0.42);
        vec3 colA = texture2D(map, uvMain).rgb;
        vec3 colB = texture2D(uWornMap, uvWorn).rgb;

        float s = vRoadMeta.x;
        float zone = vRoadMeta.y;
        float u = vRoadUv.x; // 0 = left edge, 1 = right edge

        // Anti-tiling macro blend & dual wheel-track rubber darkening
        float macroBlend = 0.5 + 0.5 * sin(s * 0.043 + u * 3.1) * cos(s * 0.019 - u * 1.8);
        vec3 roadCol = mix(colA, colB, macroBlend * 0.45);
        // Darken asphalt slightly to realistic weathered Mediterranean tarmac
        roadCol *= 0.80;

        // Subtle racing-line rubber tracks around u=0.28 and u=0.72
        float track1 = exp(-pow((u - 0.30) / 0.10, 2.0));
        float track2 = exp(-pow((u - 0.70) / 0.10, 2.0));
        float rubber = (track1 + track2) * 0.14;
        roadCol *= (1.0 - rubber);

        // Crisp white edge lines (weathered by asphalt grain)
        float edgeDist = min(u, 1.0 - u);
        float edgeLine = smoothstep(0.052, 0.046, edgeDist) * smoothstep(0.020, 0.026, edgeDist);
        // Center dashed line (skip right on start/finish grid zone)
        float dsStart = abs(mod(s - uStartS + uTrackLen * 0.5, uTrackLen) - uTrackLen * 0.5);
        float dash = step(0.45, fract(s / 10.0));
        float centerLine = smoothstep(0.011, 0.006, abs(u - 0.5)) * dash * smoothstep(14.0, 24.0, dsStart);

        // Checkered Start/Finish line at uStartS (2m wide strip)
        float sfMask = smoothstep(1.3, 1.1, dsStart);
        float chkU = floor(u * 20.0);
        float chkS = floor((s - uStartS + 1.2) * 1.8);
        float checker = mod(chkU + chkS, 2.0);

        // Painted starting grid boxes behind start line (6 staggered slots: 10..48m behind uStartS)
        float behindStart = mod(uStartS - s + uTrackLen, uTrackLen);
        float gridLine = 0.0;
        if (behindStart > 6.0 && behindStart < 48.0) {
          for (int g = 0; g < 6; g++) {
            float gs = 9.0 + float(g) * 6.5;
            float gu = (mod(float(g), 2.0) < 0.5) ? 0.32 : 0.68;
            float frontBar = smoothstep(0.28, 0.18, abs(behindStart - gs)) * smoothstep(0.11, 0.095, abs(u - gu));
            float sideBars = smoothstep(0.015, 0.008, abs(abs(u - gu) - 0.105)) * step(gs, behindStart) * step(behindStart, gs + 2.2);
            gridLine = max(gridLine, max(frontBar, sideBars));
          }
        }

        // Paint weathering (asphalt pores show subtly through paint)
        float paintWear = clamp(0.68 + colA.r * 0.45, 0.55, 0.96);
        vec3 paintCol = vec3(0.90, 0.89, 0.85);
        roadCol = mix(roadCol, paintCol, max(edgeLine * 0.82, max(centerLine * 0.72, gridLine * 0.85)) * paintWear);
        if (sfMask > 0.01) {
          vec3 chkCol = mix(vec3(0.08, 0.08, 0.09), vec3(0.93, 0.92, 0.90), checker);
          roadCol = mix(roadCol, chkCol, sfMask * 0.90);
        }

        // Z1 Waterfront sand-drift transition softly encroaching on outer road edge (ZERO floating decals!)
        if (zone < 0.5) {
          float driftWave = 0.5 + 0.5 * sin(s * 0.065) * cos(s * 0.027 + 1.3);
          float driftReach = 0.04 + driftWave * 0.13;
          float leftDrift = (1.0 - smoothstep(0.0, driftReach, u)) * (0.45 + 0.55 * driftWave);
          float rightDrift = (1.0 - smoothstep(0.0, driftReach * 0.55, 1.0 - u)) * 0.42;
          float sandMask = clamp(max(leftDrift, rightDrift), 0.0, 0.86);
          vec3 sandCol = texture2D(uSandMap, vec2(u * 2.4, vRoadUv.y * 1.1)).rgb;
          roadCol = mix(roadCol, sandCol, sandMask);
        }

        // Subtle outer verge grime/dust blend on edges for grounded contact with curbs/shoulders
        float vergeDust = 1.0 - smoothstep(0.0, 0.055, edgeDist);
        roadCol = mix(roadCol, roadCol * vec3(0.92, 0.89, 0.83), vergeDust * 0.45);

        diffuseColor.rgb *= roadCol;
        `).replace("#include <roughnessmap_fragment>",`
        #include <roughnessmap_fragment>
        // Slightly glossier rubber tracks & painted markings catch Golden Hour sunset sheen!
        float rTrack = exp(-pow((vRoadUv.x - 0.30) / 0.11, 2.0)) + exp(-pow((vRoadUv.x - 0.70) / 0.11, 2.0));
        roughnessFactor = clamp(roughnessFactor - rTrack * 0.16, 0.32, 0.95);
        `)},n.customProgramCacheKey=()=>"road-asphalt-markings-sanddrift-v4",n.needsUpdate=!0,s.shoulderMaterial.map=t.gravel.map,s.shoulderMaterial.normalMap=t.gravel.normalMap,s.shoulderMaterial.roughnessMap=t.gravel.roughnessMap,s.shoulderMaterial.needsUpdate=!0,s.sidewalkMaterial.map=t.sidewalk.map,s.sidewalkMaterial.normalMap=t.sidewalk.normalMap,s.sidewalkMaterial.roughnessMap=t.sidewalk.roughnessMap,s.sidewalkMaterial.needsUpdate=!0}const xg=["asphalt","curb","gravel","bridge"];class Sg{constructor(e,t,n){B(this,"track");B(this,"terrain");B(this,"roadData");B(this,"barriers",[]);B(this,"obstacles",[]);B(this,"cellSize",8);B(this,"roadTriGrid",new Map);B(this,"barrierGrid",new Map);B(this,"obstacleGrid",new Map);this.track=e,this.terrain=t,this.roadData=n,this.indexRoadTriangles()}gridKey(e,t){return`${e},${t}`}indexRoadTriangles(){const{positions:e,indices:t}=this.roadData,n=t.length/3,i=this.cellSize;for(let r=0;r<n;r++){const a=t[r*3],o=t[r*3+1],l=t[r*3+2],c=e[a*3],h=e[a*3+2],u=e[o*3],d=e[o*3+2],f=e[l*3],g=e[l*3+2],v=Math.floor(Math.min(c,u,f)/i),p=Math.floor(Math.max(c,u,f)/i),m=Math.floor(Math.min(h,d,g)/i),w=Math.floor(Math.max(h,d,g)/i);for(let y=m;y<=w;y++)for(let x=v;x<=p;x++){const b=this.gridKey(x,y);let E=this.roadTriGrid.get(b);E||(E=[],this.roadTriGrid.set(b,E)),E.push(r)}}}addBarrierSegment(e){const t=this.barriers.length;this.barriers.push(e);const n=this.cellSize,i=Math.floor((Math.min(e.ax,e.bx)-3)/n),r=Math.floor((Math.max(e.ax,e.bx)+3)/n),a=Math.floor((Math.min(e.az,e.bz)-3)/n),o=Math.floor((Math.max(e.az,e.bz)+3)/n);for(let l=a;l<=o;l++)for(let c=i;c<=r;c++){const h=this.gridKey(c,l);let u=this.barrierGrid.get(h);u||(u=[],this.barrierGrid.set(h,u)),u.push(t)}}addObstacle(e){const t=this.obstacles.length;this.obstacles.push(e);const n=this.cellSize,i=e.radius+2,r=Math.floor((e.x-i)/n),a=Math.floor((e.x+i)/n),o=Math.floor((e.z-i)/n),l=Math.floor((e.z+i)/n);for(let c=o;c<=l;c++)for(let h=r;h<=a;h++){const u=this.gridKey(h,c);let d=this.obstacleGrid.get(u);d||(d=[],this.obstacleGrid.set(u,d)),d.push(t)}}buildSplineBarriers(){const t=this.track.length/600;for(let n=0;n<600;n++){const i=n*t,r=(n+1)%600*t,a=this.track.sampleAtS(i),o=this.track.sampleAtS(r);for(const l of[-1,1]){let c,h,u;a.isBridge||o.isBridge?(c=a.width*.5+.65,h=o.width*.5+.65,u="bridge"):a.zone==="Z3"?(c=a.width*.5+2.65,h=o.width*.5+2.65,u="wall"):a.zone==="Z2"?(c=a.width*.5+(l===-1?1.35:2.1),h=o.width*.5+(l===-1?1.35:2.1),u=l===-1?"guardrail":"wall"):a.zone==="Z1"?(c=a.width*.5+(l===-1?2.1:2.4),h=o.width*.5+(l===-1?2.1:2.4),u="wall"):(c=a.width*.5+2.2,h=o.width*.5+2.2,u="guardrail");const d=a.pos.x+a.flatRight.x*l*c,f=a.pos.z+a.flatRight.z*l*c,g=o.pos.x+o.flatRight.x*l*h,v=o.pos.z+o.flatRight.z*l*h,p=g-d,m=v-f,w=Math.hypot(p,m)||1;let y=-m/w,x=p/w;const b=a.pos.x-d,E=a.pos.z-f;y*b+x*E<0&&(y=-y,x=-x);const _=Math.min(a.pos.y,o.pos.y)-2,C=Math.max(a.pos.y,o.pos.y)+3.5;this.addBarrierSegment({ax:d,az:f,bx:g,bz:v,nx:y,nz:x,minY:_,maxY:C,kind:u})}}}raycastDown(e,t,n,i){const r=i??{hit:!0,y:0,normal:new I(0,1,0),surface:"grass"},a=this.cellSize,o=Math.floor(e/a),l=Math.floor(n/a),c=this.roadTriGrid.get(this.gridKey(o,l));let h=-1/0,u="asphalt",d=0,f=1,g=0;if(c){const{positions:p,indices:m,triSurface:w}=this.roadData;for(let y=0;y<c.length;y++){const x=c[y],b=m[x*3]*3,E=m[x*3+1]*3,_=m[x*3+2]*3,C=p[b],M=p[b+1],S=p[b+2],D=p[E],z=p[E+1],U=p[E+2],H=p[_],ee=p[_+1],W=p[_+2],Q=D-C,X=U-S,te=H-C,N=W-S,O=e-C,le=n-S,Se=Q*N-te*X;if(Math.abs(Se)<1e-8)continue;const Z=1/Se,k=(O*N-te*le)*Z;if(k<-1e-4||k>1.0001)continue;const L=(Q*le-O*X)*Z;if(L<-1e-4||k+L>1.0001)continue;const F=M+k*(z-M)+L*(ee-M);if(F<=t+1.8&&F>h){h=F,u=xg[w[x]]??"asphalt";const V=D-C,ce=z-M,ie=U-S,se=H-C,Y=ee-M,ne=W-S;let R=ce*ne-ie*Y,fe=ie*se-V*ne,ue=V*Y-ce*se;fe<0&&(R=-R,fe=-fe,ue=-ue);const Te=Math.hypot(R,fe,ue)||1;d=R/Te,f=fe/Te,g=ue/Te}}}const v=this.terrain.getHeight(e,n);return h>-1e5&&h>=v-.08?(r.hit=!0,r.y=h,r.normal.set(d,f,g),r.surface=u,r):(r.hit=!0,r.y=v,this.terrain.getNormal(e,n,r.normal),r.surface=this.terrain.getSurfaceType(e,n),r)}resolveHorizontalCollision(e,t,n,i){const r=this.cellSize,a=Math.floor(e/r),o=Math.floor(n/r);let l=0,c=0,h=!1,u=0,d=0,f="guardrail";const g=new Set;for(let p=-1;p<=1;p++)for(let m=-1;m<=1;m++){const w=this.barrierGrid.get(this.gridKey(a+m,o+p));if(w)for(let y=0;y<w.length;y++){const x=w[y];if(g.has(x))continue;g.add(x);const b=this.barriers[x];if(t<b.minY||t>b.maxY)continue;const E=e+l,_=n+c,C=b.bx-b.ax,M=b.bz-b.az,S=C*C+M*M;if(S<1e-6)continue;const D=Math.max(0,Math.min(1,((E-b.ax)*C+(_-b.az)*M)/S)),z=b.ax+C*D,U=b.az+M*D,H=E-z,ee=_-U,W=Math.hypot(H,ee),Q=H*b.nx+ee*b.nz;if(Q<i&&W<i+3.5){const X=i-Q;X>0&&X<4&&(l+=b.nx*X,c+=b.nz*X,h=!0,u=b.nx,d=b.nz,f=b.kind)}}}const v=new Set;for(let p=-1;p<=1;p++)for(let m=-1;m<=1;m++){const w=this.obstacleGrid.get(this.gridKey(a+m,o+p));if(w)for(let y=0;y<w.length;y++){const x=w[y];if(v.has(x))continue;v.add(x);const b=this.obstacles[x],E=e+l,_=n+c,C=E-b.x,M=_-b.z,S=i+b.radius,D=C*C+M*M;if(D<S*S&&D>1e-6){const z=Math.sqrt(D),U=C/z,H=M/z,ee=S-z;l+=U*ee,c+=H*ee,h=!0,u=U,d=H,f="obstacle"}}}return{hit:h,pushX:l,pushZ:c,nx:u,nz:d,kind:f}}}function Mg(s,e,t){const n=[];s.maxBankingDeg>12&&n.push({invariant:"road_banking",message:`Road banking ${s.maxBankingDeg.toFixed(2)}° exceeds 12° threshold`,value:s.maxBankingDeg,threshold:12});const i=s.maxGrade*100;i>14&&n.push({invariant:"longitudinal_grade",message:`Longitudinal grade ${i.toFixed(2)}% exceeds 14% threshold`,value:i,threshold:14}),s.minRadius<25&&n.push({invariant:"corner_radius",message:`Minimum corner radius ${s.minRadius.toFixed(2)} m below 25 m minimum`,value:s.minRadius,threshold:25});let r=0,a=0;const o=600,l=s.spec.bridge;for(let v=0;v<o;v++){const p=v/o*s.length,m=s.sampleAtS(p),w=m.width*.5,y=p>=l.startS-2&&p<=l.endS+2;for(let x=-3;x<=3;x++){const b=x/3*(w-.15),E=m.pos.x+m.right.x*b,_=m.pos.z+m.right.z*b,C=s.roadSurfaceY(m,b),S=e.getHeight(E,_)-C;S>r&&(r=S),S>.02&&n.push({invariant:"terrain_poke_road",message:`Terrain pokes ${S.toFixed(3)} m above road at s=${p.toFixed(1)}m lat=${b.toFixed(1)}m`,value:S,threshold:.02,location:[E,C,_]})}if(!y)for(const x of[-1,1]){const b=x*(w+.5),E=m.pos.x+m.right.x*b,_=m.pos.z+m.right.z*b,C=s.roadSurfaceY(m,x*w),M=e.getHeight(E,_),S=Math.abs(M-C);S>a&&(a=S),S>.15&&n.push({invariant:"road_edge_step",message:`Road edge step ${S.toFixed(3)} m exceeds 0.15 m at s=${p.toFixed(1)}m side=${x}`,value:S,threshold:.15,location:[E,C,_]})}}let c=0,h=0;const u=[];for(const v of t){if(v.kind==="building"&&u.push(v),v.kind==="building"||v.kind==="tree"||v.kind==="boulder"){const p=s.closestPointXZ(v.x,v.z),m=Math.abs(p.lateral)-p.sample.width*.5-v.radius;m<3&&(c++,n.push({invariant:"exclusion_zone",message:`Rigid ${v.kind} '${v.id}' intrudes into 3m exclusion zone (clearance=${m.toFixed(2)}m)`,value:m,threshold:3,location:[v.x,v.y,v.z]}))}if(!v.intentionalSink&&v.kind!=="boulder"){const p=e.getHeight(v.x,v.z),m=Math.abs(v.y-p);m>.3&&(h++,n.push({invariant:"object_grounding",message:`Object '${v.id}' (${v.kind}) base offset ${m.toFixed(3)} m exceeds 0.30 m`,value:m,threshold:.3,location:[v.x,v.y,v.z]}))}}let d=0;for(let v=0;v<u.length;v++){const p=u[v];for(let m=v+1;m<u.length;m++){const w=u[m],y=p.x-w.x,x=p.z-w.z,b=Math.hypot(y,x),E=(p.radius+w.radius)*.86;b<E&&(p.halfX&&p.halfZ&&w.halfX&&w.halfZ?yg(p.x,p.z,p.halfX-.05,p.halfZ-.05,p.yaw??0,w.x,w.z,w.halfX-.05,w.halfZ-.05,w.yaw??0)&&(d++,n.push({invariant:"overlapping_buildings",message:`Buildings '${p.id}' and '${w.id}' overlap (center dist=${b.toFixed(2)}m)`,location:[p.x,p.y,p.z]})):(d++,n.push({invariant:"overlapping_buildings",message:`Buildings '${p.id}' and '${w.id}' overlap (dist=${b.toFixed(2)}m)`,location:[p.x,p.y,p.z]})))}}let f=0,g=-1;for(const v of s.checkpoints){const p=s.closestPointXZ(v.pos.x,v.pos.z,v.s);Math.abs(p.lateral)>v.width*.5&&(f++,n.push({invariant:"checkpoint_offtrack",message:`Checkpoint #${v.index} is off-track (lat=${p.lateral.toFixed(2)}m)`,location:[v.pos.x,v.pos.y,v.pos.z]}));const m=s.wrapS(v.s-s.spec.startFinishS);m<=g&&v.index>0&&(f++,n.push({invariant:"checkpoint_sequence",message:`Checkpoint #${v.index} out of sequence (relS=${m.toFixed(1)} <= ${g.toFixed(1)})`})),g=m}return{ok:n.length===0,errors:n,metrics:{trackLengthM:Math.round(s.length*10)/10,minCornerRadiusM:Math.round(s.minRadius*10)/10,maxGradePct:Math.round(i*100)/100,maxBankingDeg:Math.round(s.maxBankingDeg*100)/100,maxTerrainPokeAboveRoadM:Math.round(r*1e3)/1e3,maxRoadEdgeStepM:Math.round(a*1e3)/1e3,obstaclesInExclusionZone:c,floatingObjectsCount:h,overlappingBuildingsCount:d,checkpointErrors:f}}}function yg(s,e,t,n,i,r,a,o,l,c){const h=[[Math.cos(i),-Math.sin(i)],[Math.sin(i),Math.cos(i)],[Math.cos(c),-Math.sin(c)],[Math.sin(c),Math.cos(c)]],u=h[0][0],d=h[0][1],f=h[1][0],g=h[1][1],v=h[2][0],p=h[2][1],m=h[3][0],w=h[3][1],y=r-s,x=a-e;for(const[b,E]of h){const _=Math.abs(y*b+x*E),C=t*Math.abs(u*b+d*E)+n*Math.abs(f*b+g*E),M=o*Math.abs(v*b+p*E)+l*Math.abs(m*b+w*E);if(_>C+M)return!1}return!0}class wg extends Sd{constructor(e){super(e),this.type=Ct}parse(e){const a=function(C,M){switch(C){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(M||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(M||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(M||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(M||""))}},u=function(C,M,S){M=M||1024;let z=C.pos,U=-1,H=0,ee="",W=String.fromCharCode.apply(null,new Uint16Array(C.subarray(z,z+128)));for(;0>(U=W.indexOf(`
`))&&H<M&&z<C.byteLength;)ee+=W,H+=W.length,z+=128,W+=String.fromCharCode.apply(null,new Uint16Array(C.subarray(z,z+128)));return-1<U?(C.pos+=H+U+1,ee+W.slice(0,U)):!1},d=function(C){const M=/^#\?(\S+)/,S=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,H={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let ee,W;for((C.pos>=C.byteLength||!(ee=u(C)))&&a(1,"no header found"),(W=ee.match(M))||a(3,"bad initial token"),H.valid|=1,H.programtype=W[1],H.string+=ee+`
`;ee=u(C),ee!==!1;){if(H.string+=ee+`
`,ee.charAt(0)==="#"){H.comments+=ee+`
`;continue}if((W=ee.match(S))&&(H.gamma=parseFloat(W[1])),(W=ee.match(D))&&(H.exposure=parseFloat(W[1])),(W=ee.match(z))&&(H.valid|=2,H.format=W[1]),(W=ee.match(U))&&(H.valid|=4,H.height=parseInt(W[1],10),H.width=parseInt(W[2],10)),H.valid&2&&H.valid&4)break}return H.valid&2||a(3,"missing format specifier"),H.valid&4||a(3,"missing image size specifier"),H},f=function(C,M,S){const D=M;if(D<8||D>32767||C[0]!==2||C[1]!==2||C[2]&128)return new Uint8Array(C);D!==(C[2]<<8|C[3])&&a(3,"wrong scanline width");const z=new Uint8Array(4*M*S);z.length||a(4,"unable to allocate buffer space");let U=0,H=0;const ee=4*D,W=new Uint8Array(4),Q=new Uint8Array(ee);let X=S;for(;X>0&&H<C.byteLength;){H+4>C.byteLength&&a(1),W[0]=C[H++],W[1]=C[H++],W[2]=C[H++],W[3]=C[H++],(W[0]!=2||W[1]!=2||(W[2]<<8|W[3])!=D)&&a(3,"bad rgbe scanline format");let te=0,N;for(;te<ee&&H<C.byteLength;){N=C[H++];const le=N>128;if(le&&(N-=128),(N===0||te+N>ee)&&a(3,"bad scanline data"),le){const Se=C[H++];for(let Z=0;Z<N;Z++)Q[te++]=Se}else Q.set(C.subarray(H,H+N),te),te+=N,H+=N}const O=D;for(let le=0;le<O;le++){let Se=0;z[U]=Q[le+Se],Se+=D,z[U+1]=Q[le+Se],Se+=D,z[U+2]=Q[le+Se],Se+=D,z[U+3]=Q[le+Se],U+=4}X--}return z},g=function(C,M,S,D){const z=C[M+3],U=Math.pow(2,z-128)/255;S[D+0]=C[M+0]*U,S[D+1]=C[M+1]*U,S[D+2]=C[M+2]*U,S[D+3]=1},v=function(C,M,S,D){const z=C[M+3],U=Math.pow(2,z-128)/255;S[D+0]=Ks.toHalfFloat(Math.min(C[M+0]*U,65504)),S[D+1]=Ks.toHalfFloat(Math.min(C[M+1]*U,65504)),S[D+2]=Ks.toHalfFloat(Math.min(C[M+2]*U,65504)),S[D+3]=Ks.toHalfFloat(1)},p=new Uint8Array(e);p.pos=0;const m=d(p),w=m.width,y=m.height,x=f(p.subarray(p.pos),w,y);let b,E,_;switch(this.type){case Zt:_=x.length/4;const C=new Float32Array(_*4);for(let S=0;S<_;S++)g(x,S*4,C,S*4);b=C,E=Zt;break;case Ct:_=x.length/4;const M=new Uint16Array(_*4);for(let S=0;S<_;S++)v(x,S*4,M,S*4);b=M,E=Ct;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:w,height:y,data:b,header:m.string,gamma:m.gamma,exposure:m.exposure,type:E}}setDataType(e){return this.type=e,this}load(e,t,n,i){function r(a,o){switch(a.type){case Zt:case Ct:a.colorSpace=Mi,a.minFilter=gt,a.magFilter=gt,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,i)}}const _a=[{key:"asphalt_main",dir:"asphalt_main",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"asphalt_worn",dir:"asphalt_worn",albedoFile:"albedo.jpg",hasAo:!1,repeat:[1,1],anisotropy:16},{key:"sand_beach",dir:"sand_beach",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"cliff_rock",dir:"cliff_rock",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"grass_med",dir:"grass_med",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"forest_floor",dir:"forest_floor",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"gravel_verge",dir:"gravel_verge",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"sidewalk_stone",dir:"sidewalk_stone",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,1],anisotropy:16},{key:"plaster_warm",dir:"plaster_warm",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"plaster_rustic",dir:"plaster_rustic",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"plaster_blue",dir:"plaster_blue",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"stone_wall",dir:"stone_wall",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"coral_stone",dir:"coral_stone",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"roof_terracotta",dir:"roof_terracotta",albedoFile:"albedo.jpg",hasAo:!0,repeat:[3,2],anisotropy:8},{key:"concrete_bridge",dir:"concrete_bridge",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:12},{key:"wood_planks",dir:"wood_planks",albedoFile:"albedo.jpg",hasAo:!0,repeat:[2,2],anisotropy:8},{key:"bark_pine",dir:"bark_pine",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,3],anisotropy:8},{key:"bark_palm",dir:"bark_palm",albedoFile:"albedo.jpg",hasAo:!0,repeat:[1,4],anisotropy:8},{key:"tire_rubber",dir:"tire_rubber",albedoFile:"albedo.jpg",hasAo:!1,repeat:[4,2],anisotropy:8},{key:"cluster_pine",dir:"cluster_pine",albedoFile:"albedo.png",hasAo:!1,repeat:[1,1],anisotropy:8},{key:"cluster_palm_frond",dir:"cluster_palm_frond",albedoFile:"albedo.png",hasAo:!1,repeat:[1,1],anisotropy:8},{key:"cluster_olive",dir:"cluster_olive",albedoFile:"albedo.png",hasAo:!1,repeat:[1,1],anisotropy:8},{key:"cluster_shrub",dir:"cluster_shrub",albedoFile:"albedo.png",hasAo:!1,repeat:[1,1],anisotropy:8},{key:"cluster_grass_tuft",dir:"cluster_grass_tuft",albedoFile:"albedo.png",hasAo:!1,repeat:[1,1],anisotropy:8}];async function bg(s,e){const t=s.capabilities.getMaxAnisotropy(),n=new Md,i=new wg,r=new wo(s);r.compileEquirectangularShader();const a=_a.length+2;let o=0;const l=p=>{o++,e==null||e(Math.min(1,o/a),p)},c=(p,m,w,y)=>new Promise((x,b)=>{n.load(p,E=>{E.wrapS=vi,E.wrapT=vi,E.repeat.set(w[0],w[1]),E.anisotropy=Math.min(y,t),E.colorSpace=m?Vt:Mn,E.userData.sourceUrl=p,E.needsUpdate=!0,x(E)},void 0,E=>b(new Error(`Failed to load texture ${p}: ${String(E)}`)))}),[h,u]=await Promise.all([i.loadAsync("./assets/hdri/golden_hour.hdr").then(p=>(p.mapping=Ps,p.userData.sourceUrl="./assets/hdri/golden_hour.hdr",l("Golden Hour HDRI"),p)),i.loadAsync("./assets/hdri/night.hdr").then(p=>(p.mapping=Ps,p.userData.sourceUrl="./assets/hdri/night.hdr",l("Night HDRI"),p))]),d=r.fromEquirectangular(h).texture,f=r.fromEquirectangular(u).texture;r.dispose();const g={},v=6;for(let p=0;p<_a.length;p+=v){const m=_a.slice(p,p+v);await Promise.all(m.map(async w=>{const y=`./assets/textures/${w.dir}`,x=w.repeat??[1,1],b=Math.min(w.anisotropy??8,t),[E,_,C,M]=await Promise.all([c(`${y}/${w.albedoFile}`,!0,x,b),c(`${y}/normal.jpg`,!1,x,b),c(`${y}/roughness.jpg`,!1,x,b),w.hasAo?c(`${y}/ao.jpg`,!1,x,b):Promise.resolve(void 0)]);w.dir.startsWith("cluster_")&&(E.wrapS=Bt,E.wrapT=Bt,_.wrapS=Bt,_.wrapT=Bt,C.wrapS=Bt,C.wrapT=Bt);const S=E.image;g[w.key]={name:w.key,map:E,normalMap:_,roughnessMap:C,aoMap:M,width:(S==null?void 0:S.width)??1024,height:(S==null?void 0:S.height)??1024,anisotropy:E.anisotropy,sourceUrl:`${y}/${w.albedoFile}`},l(`Texture ${w.key}`)}))}return{hdriGolden:h,hdriNight:u,envGolden:d,envNight:f,textures:g,maxAnisotropy:t}}const mr=24;function Tg(s,e){const t=new pt;t.name="water_sky_system";const n=new I(...s.spec.sunDirectionGoldenHour).normalize(),i=new I(...s.spec.moonDirectionNight).normalize(),r=256,a=new Float32Array(r*r),{minX:o,maxX:l,minZ:c,maxZ:h}=e.cfg,u=s.spec.seaLevel;for(let k=0;k<r;k++){const L=c+k/(r-1)*(h-c);for(let F=0;F<r;F++){const V=o+F/(r-1)*(l-o),ce=e.getHeight(V,L);a[k*r+F]=u-ce}}const d=new zs(a,r,r,Fs,Zt);d.minFilter=gt,d.magFilter=gt,d.wrapS=Bt,d.wrapT=Bt,d.needsUpdate=!0;const f=[];for(let k=0;k<mr;k++)f.push(new ut(99999,99999,1,0));const g={uTime:{value:0},uSunDir:{value:n.clone()},uSunColor:{value:new ze(16758891)},uSkyHorizon:{value:new ze(15907210)},uSkyZenith:{value:new ze(3826836)},uShallowColor:{value:new ze(2668720)},uMidColor:{value:new ze(810106)},uDeepColor:{value:new ze(468290)},uFogColor:{value:new ze(15119756)},uFogDensity:{value:52e-5},uNightFactor:{value:0},uDepthTex:{value:d},uTerrainBounds:{value:new ut(o,c,l-o,h-c)},uRocks:{value:f},uRockCount:{value:0}},v=new ft({uniforms:g,transparent:!0,depthWrite:!0,vertexShader:`
      uniform float uTime;
      varying vec3 vWorldPos;
      varying float vWaveH;

      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        // Subtle multi-frequency coastal swell displacement near camera
        float dist = length(wp.xz - cameraPosition.xz);
        float atten = 1.0 - smoothstep(140.0, 900.0, dist);
        float w1 = sin(wp.x * 0.09 + wp.z * 0.05 + uTime * 1.45) * 0.14;
        float w2 = cos(wp.x * 0.045 - wp.z * 0.11 + uTime * 1.15) * 0.10;
        float w3 = sin((wp.x + wp.z) * 0.19 - uTime * 2.1) * 0.045;
        float wh = (w1 + w2 + w3) * atten;
        wp.y += wh;
        vWaveH = wh;
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uSkyHorizon;
      uniform vec3 uSkyZenith;
      uniform vec3 uShallowColor;
      uniform vec3 uMidColor;
      uniform vec3 uDeepColor;
      uniform vec3 uFogColor;
      uniform float uFogDensity;
      uniform float uNightFactor;
      uniform sampler2D uDepthTex;
      uniform vec4 uTerrainBounds;
      uniform vec4 uRocks[${mr}];
      uniform int uRockCount;

      varying vec3 vWorldPos;
      varying float vWaveH;

      float waveHeight(vec2 p, float t) {
        float h = 0.0;
        h += sin(dot(p, vec2(0.17, 0.09)) + t * 1.65) * 0.16;
        h += sin(dot(p, vec2(-0.11, 0.21)) + t * 1.32) * 0.12;
        h += sin(dot(p, vec2(0.39, -0.27)) + t * 2.40) * 0.065;
        h += sin(dot(p, vec2(-0.62, -0.45)) + t * 3.15) * 0.032;
        h += sin(dot(p, vec2(1.15, 0.85)) - t * 3.90) * 0.016;
        return h;
      }

      vec3 calcWaterNormal(vec2 p, float t, float detailAtten) {
        float eps = 0.28;
        float h0 = waveHeight(p, t);
        float hx = waveHeight(p + vec2(eps, 0.0), t);
        float hz = waveHeight(p + vec2(0.0, eps), t);
        vec3 n = normalize(vec3((h0 - hx) * detailAtten, eps * 1.45, (h0 - hz) * detailAtten));
        return n;
      }

      void main() {
        vec2 uvDepth = (vWorldPos.xz - uTerrainBounds.xy) / uTerrainBounds.zw;
        bool inBounds = uvDepth.x >= 0.01 && uvDepth.x <= 0.99 && uvDepth.y >= 0.01 && uvDepth.y <= 0.99;
        float depth = inBounds ? texture2D(uDepthTex, uvDepth).r : 18.0;

        // Clip cleanly slightly inland so sand dry beach stays dry
        if (depth < -0.22) discard;

        vec3 V = normalize(cameraPosition - vWorldPos);
        float camDist = length(cameraPosition - vWorldPos);
        float detailAtten = mix(1.0, 0.22, smoothstep(80.0, 1400.0, camDist));
        vec3 N = calcWaterNormal(vWorldPos.xz, uTime, detailAtten);

        // Fresnel reflection factor (Schlick)
        float NdotV = max(dot(N, V), 0.001);
        float fresnel = 0.03 + 0.97 * pow(1.0 - NdotV, 4.6);

        // Depth-based coastal color absorption: luminous turquoise -> Mediterranean azure -> deep cobalt!
        float shallowT = smoothstep(0.0, 2.8, depth);
        float deepT = smoothstep(2.2, 11.5, depth);
        vec3 waterBody = mix(uShallowColor, uMidColor, shallowT);
        waterBody = mix(waterBody, uDeepColor, deepT);

        // Warm sun-scatter glow in translucent turquoise shallows (Ref 04!)
        float sss = pow(max(dot(V, -uSunDir + N * 0.4), 0.0), 2.5) * (1.0 - deepT) * (1.0 - uNightFactor * 0.85);
        waterBody += vec3(0.08, 0.46, 0.44) * sss * 0.85;

        // Reflected sky gradient (rich azure zenith -> warm golden horizon)
        vec3 R = reflect(-V, N);
        float rUp = clamp(R.y, 0.0, 1.0);
        vec3 skyRefl = mix(uSkyHorizon, uSkyZenith, pow(rUp, 0.45));

        // Glistening Sun / Moon specular path across waves!
        vec3 H = normalize(uSunDir + V);
        float specTight = pow(max(dot(N, H), 0.0), mix(340.0, 200.0, uNightFactor)) * mix(4.6, 2.0, uNightFactor);
        float specBroad = pow(max(dot(N, H), 0.0), 28.0) * mix(0.62, 0.18, uNightFactor);
        vec3 sunSpec = uSunColor * (specTight + specBroad);

        // Animated shoreline wave-wash & crisp white coastal foam!
        float shoreBand = 1.0 - smoothstep(-0.08, 1.55, depth);
        float washWave = sin(depth * 7.2 - uTime * 2.3 + sin(vWorldPos.z * 0.14) * 2.2);
        float lacyNoise = sin(vWorldPos.x * 1.7 + uTime * 0.9) * cos(vWorldPos.z * 1.9 - uTime * 1.1) * 0.5 + 0.5;
        float shoreFoam = smoothstep(0.18, 0.68, shoreBand * (0.72 + 0.45 * washWave) + lacyNoise * shoreBand * 0.48);
        // Secondary breaking ripple foam band slightly offshore
        float surfLine = exp(-pow((depth - 0.95) / 0.38, 2.0)) * smoothstep(0.08, 0.82, washWave * 0.5 + 0.5) * (0.48 + 0.52 * lacyNoise);

        // Animated foam rings wrapping cleanly around coastal boulders in the water (Ref 04!)
        float rockFoam = 0.0;
        for (int i = 0; i < ${mr}; i++) {
          if (i >= uRockCount) break;
          vec4 rk = uRocks[i];
          float d = length(vWorldPos.xz - rk.xy) - rk.z;
          if (d < 4.2 && d > -0.6) {
            float ringPulse = 0.5 + 0.5 * sin(d * 4.2 - uTime * 2.8 + float(i) * 1.7);
            float f = (1.0 - smoothstep(0.0, 2.9, max(0.0, d))) * (0.62 + 0.48 * ringPulse) * (0.55 + 0.45 * lacyNoise);
            rockFoam = max(rockFoam, smoothstep(0.24, 0.68, f));
          }
        }

        float totalFoam = clamp(max(max(shoreFoam, surfLine * 0.85), rockFoam * 0.98), 0.0, 1.0);
        vec3 foamColor = mix(vec3(0.99, 0.97, 0.93), vec3(0.36, 0.44, 0.58), uNightFactor);

        // Keep rich Mediterranean turquoise/cobalt color readable even at low grazing shoreline angles!
        vec3 col = mix(waterBody, skyRefl, fresnel * 0.54) + sunSpec;
        col = mix(col, foamColor, totalFoam * 0.92);

        // Directional aerial perspective / horizon haze matching sky seamlessly
        float fogFactor = 1.0 - exp(-pow(camDist * uFogDensity, 1.45));
        float sunGlow = pow(max(dot(-V, uSunDir), 0.0), 5.0) * (1.0 - uNightFactor);
        vec3 finalFog = mix(uFogColor, uSunColor * 1.08, sunGlow * 0.45);
        col = mix(col, finalFog, clamp(fogFactor, 0.0, 0.98));

        // Translucent shallows fade softly onto wet sand at depth -> 0
        float alpha = clamp(smoothstep(-0.14, 0.42, depth) + totalFoam * 0.65, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `}),p=new $t(14e3,14e3,140,140);p.rotateX(-Math.PI/2);const m=new Ee(p,v);m.name="mediterranean_ocean",m.position.set(-1200,u,0),m.renderOrder=2,t.add(m);const w=128,y=[],x=[],b=[],E=1350,_=2300,C=new ze(7173242),M=new ze(10129282);for(let k=0;k<=w;k++){const L=k/w*Math.PI*2,F=240+Math.cos(L)*E,V=Math.sin(L)*E,ce=240+Math.cos(L)*_,ie=Math.sin(L)*_,se=Cr.smoothstep(Math.cos(L),-.58,.15),Y=Math.max(0,Tr(Math.cos(L)*3.1,Math.sin(L)*3.1,4,901)*.5+.5),ne=se*(45+Y*185);y.push(F,-8,V),x.push(C.r,C.g,C.b),y.push(ce,ne,ie);const R=C.clone().lerp(M,Math.min(1,ne/180));x.push(R.r,R.g,R.b)}for(let k=0;k<w;k++){const L=k*2,F=L+1,V=L+2,ce=L+3;b.push(L,V,F,F,V,ce)}const S=new xt;S.setAttribute("position",new et(y,3)),S.setAttribute("color",new et(x,3)),S.setIndex(b),S.computeVertexNormals();const D=new Xe({vertexColors:!0,roughness:.96,metalness:0,side:qt}),z=new Ee(S,D);z.name="distant_coastal_mountains",t.add(z);const U={uCoreColor:{value:new ze(16774360)},uHaloColor:{value:new ze(16751426)},uIsNight:{value:0}},H=new ft({uniforms:U,transparent:!0,depthWrite:!1,blending:Rs,fog:!1,vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 uCoreColor;
      uniform vec3 uHaloColor;
      uniform float uIsNight;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - vec2(0.5)) * 2.0;
        if (d > 1.0) discard;
        float core = exp(-d * d * mix(38.0, 62.0, uIsNight));
        float innerHalo = exp(-d * d * 8.5) * mix(0.62, 0.35, uIsNight);
        float outerGlow = pow(max(0.0, 1.0 - d), 3.0) * mix(0.32, 0.14, uIsNight);
        vec3 col = uCoreColor * core * 1.85 + uHaloColor * (innerHalo + outerGlow);
        float alpha = clamp(core + innerHalo + outerGlow, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `}),ee=new Ee(new $t(540,540),H);ee.name="sun_moon_disc",ee.renderOrder=1,t.add(ee);const W=new yd(7050440,4602415,.36);t.add(W);const Q=new Ad(4940674,.14);t.add(Q);const X=new Yc(8168152,0);X.position.copy(i).multiplyScalar(250),t.add(X);const te=k=>k==="golden_hour"?n.clone():i.clone();let N=48e-5;return{group:t,oceanMesh:m,sunDiscMesh:ee,hemiLight:W,ambientLight:Q,moonDirLight:X,setLightingMode:(k,L,F)=>{k==="night"?(L.environment=F.envNight,L.background=F.hdriNight,L.backgroundBlurriness=0,L.backgroundIntensity=.36,L.environmentIntensity=.24,L.backgroundRotation.set(0,.6,0),L.environmentRotation.set(0,.6,0),N=86e-5,L.fog=new bs(330262,N),W.color.setHex(1583949),W.groundColor.setHex(395535),W.intensity=.18,Q.color.setHex(792104),Q.intensity=.1,X.intensity=.24,g.uSunDir.value.copy(i),g.uSunColor.value.setHex(11061503),g.uSkyHorizon.value.setHex(858414),g.uSkyZenith.value.setHex(264210),g.uShallowColor.value.setHex(600890),g.uMidColor.value.setHex(333353),g.uDeepColor.value.setHex(199448),g.uFogColor.value.setHex(330262),g.uFogDensity.value=N,g.uNightFactor.value=1,U.uCoreColor.value.setHex(14412543),U.uHaloColor.value.setHex(5404856),U.uIsNight.value=1,ee.scale.setScalar(.65)):(L.environment=F.envGolden,L.background=F.hdriGolden,L.backgroundBlurriness=0,L.backgroundIntensity=.82,L.environmentIntensity=.76,L.backgroundRotation.set(0,3.45,0),L.environmentRotation.set(0,3.45,0),N=46e-5,L.fog=new bs(14988680,N),W.color.setHex(7050956),W.groundColor.setHex(4470056),W.intensity=.34,Q.color.setHex(5007504),Q.intensity=.1,X.intensity=0,g.uSunDir.value.copy(n),g.uSunColor.value.setHex(16760432),g.uSkyHorizon.value.setHex(15974027),g.uSkyZenith.value.setHex(2644624),g.uShallowColor.value.setHex(1361598),g.uMidColor.value.setHex(614540),g.uDeepColor.value.setHex(336970),g.uFogColor.value.setHex(14988680),g.uFogDensity.value=N,g.uNightFactor.value=0,U.uCoreColor.value.setHex(16774358),U.uHaloColor.value.setHex(16751424),U.uIsNight.value=0,ee.scale.setScalar(1))},setFogDensityOverride:(k,L)=>{const F=k!==null?k:N;L.fog instanceof bs&&(L.fog.density=F),g.uFogDensity.value=F},setCoastalRocks:k=>{const L=Math.min(k.length,mr);g.uRockCount.value=L;for(let F=0;F<L;F++)f[F].set(k[F].x,k[F].z,k[F].radius,1)},update:(k,L)=>{g.uTime.value=k;const F=g.uSunDir.value;ee.position.copy(L).addScaledVector(F,2600),ee.lookAt(L)},getSunDirection:te}}function vn(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new xt;let c=0;for(let h=0;h<s.length;++h){const u=s[h];let d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0;const u=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=s[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Kl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const g=Kl(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Kl(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new vt(a,t,n);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<t;g++){const v=h.getComponent(d,g);o.setComponent(d+u,g,v)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function Cs(s,e=new Set){var d,f;s.updateMatrixWorld(!0);const t=new Ze().copy(s.matrixWorld).invert(),n=new Ze,i=g=>{let v=g;for(;v&&v!==s;){if(e.has(v))return!0;v=v.parent}return!1},r=new Map,a=new Map;let o=1;const l=[],c=[];s.traverse(g=>{if(!(g===s||i(g))){if(g instanceof rs&&g.parent!==s){const v=new I;g.getWorldPosition(v),c.push({light:g,worldPos:v})}if(g instanceof Ee&&!(g instanceof Fc)){if(Array.isArray(g.material))return;const v=g.material;let p=a.get(v);p||(p=o++,a.set(v,p));const m=`${p}_${g.castShadow?1:0}_${g.receiveShadow?1:0}`;let w=r.get(m);w||(w={mat:v,castShadow:g.castShadow,receiveShadow:g.receiveShadow,geoms:[]},r.set(m,w));const y=g.geometry.index?g.geometry.toNonIndexed():g.geometry.clone();if(n.multiplyMatrices(t,g.matrixWorld),y.applyMatrix4(n),y.attributes.normal||y.computeVertexNormals(),!y.attributes.uv){const x=y.attributes.position.count;y.setAttribute("uv",new vt(new Float32Array(x*2),2))}for(const x of Object.keys(y.attributes))x!=="position"&&x!=="normal"&&x!=="uv"&&y.deleteAttribute(x);w.geoms.push(y),l.push(g)}}});for(const{light:g,worldPos:v}of c){const p=v.clone().applyMatrix4(t);(d=g.parent)==null||d.remove(g),g.position.copy(p),s.add(g)}for(const g of l)(f=g.parent)==null||f.remove(g);const h=g=>{for(let v=g.children.length-1;v>=0;v--){const p=g.children[v];e.has(p)||(h(p),p.type==="Group"&&p.children.length===0&&g.remove(p))}};h(s);let u=0;for(const[,g]of r){if(g.geoms.length===0)continue;const v=vn(g.geoms,!1);for(const m of g.geoms)m.dispose();if(!v)continue;v.computeBoundingSphere();const p=new Ee(v,g.mat);p.name=`${s.name}_batch_${u}`,p.castShadow=g.castShadow,p.receiveShadow=g.receiveShadow,s.add(p),u++}return{beforeMeshes:l.length,afterMeshes:u}}function _g(s,e,t=.65){const n=e.x-s.x,i=e.z-s.z,r=s.radius+e.radius+t;if(n*n+i*i>r*r)return!1;const a=s.halfX+t*.5,o=s.halfZ+t*.5,l=e.halfX+t*.5,c=e.halfZ+t*.5,h=[[Math.cos(s.yaw),-Math.sin(s.yaw)],[Math.sin(s.yaw),Math.cos(s.yaw)],[Math.cos(e.yaw),-Math.sin(e.yaw)],[Math.sin(e.yaw),Math.cos(e.yaw)]];for(const[u,d]of h){const f=Math.abs(n*u+i*d),g=a*Math.abs(h[0][0]*u+h[0][1]*d)+o*Math.abs(h[1][0]*u+h[1][1]*d),v=l*Math.abs(h[2][0]*u+h[2][1]*d)+c*Math.abs(h[3][0]*u+h[3][1]*d);if(f>g+v)return!1}return!0}function Ag(s){return s.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying float vGrimeUvY;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vGrimeUvY = uv.y;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying float vGrimeUvY;`).replace("#include <color_fragment>",`#include <color_fragment>
        // Grounded wall-base ambient grime & plaster weathering strictly along bottom ~0.9m of wall faces
        float grime = (1.0 - smoothstep(0.0, 0.14, vGrimeUvY)) * step(0.0, vGrimeUvY) * step(vGrimeUvY, 1.01);
        diffuseColor.rgb *= mix(1.0, 0.68, grime * 0.78);`)},s.customProgramCacheKey=()=>"med-wall-grime-v4b",s}function Eg(s,e,t){const n=new pt;n.name="san_marco_coastal_village";const i=new $n(s.spec.seed+3001),r=[],a=[],o=(j,J,re=.88)=>Ag(new Xe({color:J,map:t.textures[j].map,normalMap:t.textures[j].normalMap,normalScale:new xe(1.05,1.05),roughnessMap:t.textures[j].roughnessMap,roughness:re,metalness:0})),l={ochre:o("plaster_warm",15057285),terracotta:o("plaster_rustic",14192235),cream:o("plaster_warm",15787214),sunYellow:o("plaster_rustic",15254640),coastalBlue:o("plaster_blue",11982558),limestone:o("stone_wall",14208440,.92),coralStone:o("coral_stone",14470322,.92)},c=new Xe({color:14056536,map:t.textures.roof_terracotta.map,normalMap:t.textures.roof_terracotta.normalMap,normalScale:new xe(1.2,1.2),roughnessMap:t.textures.roof_terracotta.roughnessMap,roughness:.84,metalness:.02}),h=new Xe({color:12037533,map:t.textures.stone_wall.map,normalMap:t.textures.stone_wall.normalMap,roughnessMap:t.textures.stone_wall.roughnessMap,roughness:.92}),u=new Xe({color:14866629,map:t.textures.concrete_bridge.map,normalMap:t.textures.concrete_bridge.normalMap,roughnessMap:t.textures.concrete_bridge.roughnessMap,roughness:.86}),d=new Xe({color:7030314,map:t.textures.wood_planks.map,normalMap:t.textures.wood_planks.normalMap,roughnessMap:t.textures.wood_planks.roughnessMap,roughness:.82}),f=new Xe({color:3892043,map:t.textures.wood_planks.map,normalMap:t.textures.wood_planks.normalMap,roughness:.78}),g=new Xe({color:3299444,map:t.textures.wood_planks.map,normalMap:t.textures.wood_planks.normalMap,roughness:.78}),v=new Xe({color:6044708,map:t.textures.wood_planks.map,normalMap:t.textures.wood_planks.normalMap,roughness:.82}),p=[f,g,v],m=new Xe({color:1974824,metalness:.78,roughness:.42}),w=new Xe({color:11024428,roughness:.85}),y=new Xe({color:2774648,roughness:.85}),x=new Xe({color:12749358,roughness:.85}),b=[w,y,x],E=new In({color:1582386,roughness:.14,metalness:.15,clearcoat:.85}),_=new Xe({color:2370614,emissive:new ze(16757842),emissiveIntensity:0,roughness:.25}),C=new Xe({color:2633786,emissive:new ze(16765576),emissiveIntensity:0,roughness:.25}),M=new Xe({color:16770218,emissive:new ze(16755010),emissiveIntensity:.35,roughness:.2}),S=[],D=[],z=new Map,U=(j,J,re)=>{const P=`${j.toFixed(2)}_${J.toFixed(2)}_${re.toFixed(2)}`;let T=z.get(P);return T||(T=new Re(j,J,re),z.set(P,T)),T},H=(j,J,re,P,T)=>{const $=new pt,oe=3.05,pe=P*oe;let he;j==="blue_plaster_cottage"?he=l.coastalBlue:j==="stone_palazzo"?he=i.next()<.55?l.limestone:l.coralStone:j==="hillside_villa"?he=i.next()<.5?l.cream:l.coralStone:j==="coastal_shop"?he=i.next()<.5?l.terracotta:l.sunYellow:he=i.pick([l.ochre,l.cream,l.terracotta,l.sunYellow]);const Ae=i.pick(p),ve=(me,Pe,Le,Ve,st,lt=0,it=0,bt=0,yt=T<=2)=>{const Rt=new Ee(me,Pe);return Rt.position.set(Le,Ve,st),(lt||it||bt)&&Rt.rotation.set(lt,it,bt),Rt.castShadow=yt,Rt.receiveShadow=!0,$.add(Rt),Rt};ve(U(J+.24,5.8,re+.24),h,0,-2.72,0,0,0,0,!1),ve(U(J,pe,re),he,0,pe*.5,0);for(let me=1;me<=P;me++)ve(U(J+.18,.16,re+.18),u,0,me*oe-.05,0,0,0,0,!1);if(j==="stone_palazzo"||j==="blue_plaster_cottage")for(const me of[-1,1])for(const Pe of[-1,1])ve(U(.32,pe,.32),u,me*(J*.5-.12),pe*.5,Pe*(re*.5-.12),0,0,0,!1);const Me=re*.5,Fe=2.15,we=j==="coastal_shop"?1.55:1.12,Ie=j==="coastal_shop"?-J*.18:0;if(T===1&&ve(U(J+.6,.52,4.2),h,0,-.26,Me+1.75,0,0,0,!1),ve(U(we+.62,.2,.75),u,Ie,.08,Me+.34,0,0,0,!1),ve(U(.16,Fe+.22,.22),u,Ie-we*.5-.08,Fe*.5+.1,Me+.08,0,0,0,!1),ve(U(.16,Fe+.22,.22),u,Ie+we*.5+.08,Fe*.5+.1,Me+.08,0,0,0,!1),ve(U(we+.36,.2,.24),u,Ie,Fe+.14,Me+.09,0,0,0,!1),ve(U(we,Fe,.1),d,Ie,Fe*.5+.04,Me+.08,0,0,0,!1),ve(U(we*.72,Fe*.36,.04),v,Ie,Fe*.7,Me+.135,0,0,0,!1),ve(U(we*.72,Fe*.34,.04),v,Ie,Fe*.28,Me+.135,0,0,0,!1),ve(U(.05,.18,.06),m,Ie+we*.34,1.06,Me+.15,0,0,0,!1),j==="coastal_shop"){const me=i.pick(b),Pe=J*.78;ve(U(Pe,.1,1.45),me,0,2.75,Me+.64,.34,0,0,!0),ve(U(1.85,1.55,.16),u,J*.22,1.38,Me+.04,0,0,0,!1),ve(U(1.62,1.32,.1),_,J*.22,1.38,Me+.09,0,0,0,!1),ve(U(.55,.5,.55),l.terracotta,-J*.4,.25,Me+.42,0,0,0,!1)}const ke=Math.max(2,Math.floor(J/2.9));for(let me=0;me<P;me++){const Pe=me*oe+1.62;for(let Le=0;Le<ke;Le++){const Ve=((Le+.5)/ke-.5)*(J-1.6);if(me===0&&Math.abs(Ve-Ie)<1.35||me===0&&j==="coastal_shop")continue;const st=me===1&&j==="stone_palazzo"?1.55:1.25,lt=.96;ve(U(lt+.22,st+.22,.16),u,Ve,Pe,Me+.02,0,0,0,!1),ve(U(lt+.34,.1,.28),u,Ve,Pe-st*.5-.08,Me+.1,0,0,0,!1);const it=i.next(),bt=it<.38?_:it<.62?C:E;if(ve(U(lt-.08,st-.08,.08),bt,Ve,Pe,Me+.08,0,0,0,!1),T<=2&&(ve(U(.42,st,.06),Ae,Ve-lt*.5-.24,Pe,Me+.1,0,.15,0,!1),ve(U(.42,st,.06),Ae,Ve+lt*.5+.24,Pe,Me+.1,0,-.15,0,!1)),me===1&&Le===Math.floor(ke/2)&&(j==="terracotta_house"||j==="stone_palazzo"||j==="hillside_villa")){const yt=lt+.95,Rt=me*oe+.12;ve(U(yt,.14,.88),u,Ve,Rt,Me+.42,0,0,0,!1),ve(U(yt,.06,.05),m,Ve,Rt+.82,Me+.82,0,0,0,!1);for(let en=-3;en<=3;en++)ve(U(.03,.78,.03),m,Ve+en/3*(yt*.46),Rt+.42,Me+.82,0,0,0,!1);ve(U(.05,.06,.84),m,Ve-yt*.48,Rt+.82,Me+.42,0,0,0,!1),ve(U(.05,.06,.84),m,Ve+yt*.48,Rt+.82,Me+.42,0,0,0,!1)}}if(T<=2&&me>=1)for(const Le of[-1,1]){const Ve=i.next()<.45?C:E;ve(U(.14,1.25,1.05),u,Le*(J*.5+.02),Pe,0,0,0,0,!1),ve(U(.08,1.05,.85),Ve,Le*(J*.5+.07),Pe,0,0,0,0,!1)}}const De=.48,be=Math.min(2.4,re*.24+.65),We=re*.5+De,Oe=Math.hypot(We,be),Ke=Math.atan2(be,We),q=new So;q.moveTo(-re*.5,0),q.lineTo(re*.5,0),q.lineTo(0,be),q.closePath();const Ce=new Pr(q,{depth:J,bevelEnabled:!1});Ce.rotateY(Math.PI/2),Ce.translate(-J*.5,pe,0),ve(Ce,he,0,0,0,0,0,0,!1),ve(U(J+De*2,.18,Oe+.16),c,0,pe+be*.5,We*.5,Ke,0,0,!0),ve(U(J+De*2,.18,Oe+.16),c,0,pe+be*.5,-We*.5,-Ke,0,0,!0),ve(U(J+De*2.05,.24,.34),c,0,pe+be+.06,0,0,0,0,!1);const ge=(i.next()<.5?-1:1)*(J*.28);return ve(U(.75,1.65,.75),he,ge,pe+be*.72+.5,-re*.16,0,0,0,!1),ve(U(.95,.16,.95),c,ge,pe+be*.72+1.38,-re*.16,0,0,0,!1),$},ee=()=>{const j=new pt;j.name="landmark_san_marco_church";const J=(Me,Fe,we,Ie,ke,De=0,be=0,We=0)=>{const Oe=new Ee(Me,Fe);return Oe.position.set(we,Ie,ke),Oe.rotation.set(De,be,We),Oe.castShadow=!0,Oe.receiveShadow=!0,j.add(Oe),Oe};J(new Re(15.2,6.2,20.4),h,0,-2.7,0);for(let Me=0;Me<4;Me++)J(new Re(7.2+Me*.6,.22,.55),u,0,.11+(3-Me)*.2,10.1+Me*.48);J(new Re(13,9.6,18.5),l.ochre,0,5.2,0);for(const Me of[-6.2,-2.8,2.8,6.2])J(new Re(.65,10.2,.45),u,Me,5.3,9.25);const re=new So;re.moveTo(-6.6,0),re.lineTo(6.6,0),re.lineTo(6.6,1.4),re.quadraticCurveTo(3.2,2.2,1.9,3.6),re.quadraticCurveTo(0,4.9,-1.9,3.6),re.quadraticCurveTo(-3.2,2.2,-6.6,1.4),re.closePath();const P=new Pr(re,{depth:.75,bevelEnabled:!1});J(P,l.ochre,0,10,8.7),J(new Re(.22,2.1,.22),m,0,15.2,9.1),J(new Re(1.25,.22,.22),m,0,15.65,9.1),J(new Re(3.4,4.4,.45),u,0,2.8,9.3),J(new Re(2.6,3.9,.25),d,0,2.6,9.45);const T=new jn(1.35,.22,12,28);J(T,u,0,7.6,9.35),J(new Qe(1.22,1.22,.14,24),_,0,7.6,9.3,Math.PI/2,0,0);const $=7.4;J(new Re($,.28,19.4),c,-3.45,11.1,0,0,0,.36),J(new Re($,.28,19.4),c,3.45,11.1,0,0,0,-.36);for(const Me of[-1,1])for(let Fe=-6;Fe<=6;Fe+=4)J(new Re(.25,2.4,1.25),u,Me*6.55,6.2,Fe),J(new Re(.14,2.1,.96),_,Me*6.62,6.2,Fe);const oe=7.6,pe=5.4;J(new Re(4.4,18,4.4),l.coralStone,oe,9,pe);for(const Me of[6,12,17.8])J(new Re(4.85,.34,4.85),u,oe,Me,pe);for(const Me of[-1.65,1.65])for(const Fe of[-1.65,1.65])J(new Re(.85,4.2,.85),u,oe+Me,20.1,pe+Fe);const he=new Xe({color:9401154,metalness:.78,roughness:.32});J(new mi(.68,1.15,16),he,oe,20.4,pe),J(new Kn(.35,12,10),M,oe,21.3,pe),J(new Re(4.9,.45,4.9),u,oe,22.35,pe),J(new mi(3.45,4.4,4),c,oe,24.75,pe,0,Math.PI/4,0),J(new Re(.18,1.9,.18),m,oe,27.6,pe),J(new Re(1,.18,.18),m,oe,28,pe);const Ae=new gi(16757836,0,58,1.35);Ae.position.set(oe,20.6,pe),Ae.visible=!1,j.add(Ae),D.push(Ae);const ve=new gi(16760427,0,34,1.4);return ve.position.set(0,6.2,12.2),ve.visible=!1,j.add(ve),D.push(ve),j},W=e.getPlazaCenter(),Q=s.sampleAtS(s.spec.plaza.s),X=W.x+Q.tangent.x*14+Q.flatRight.x*-14.5,te=W.z+Q.tangent.z*14+Q.flatRight.z*-14.5,N=e.getHeight(X,te),O=Math.atan2(W.x-X,W.z-te),le=ee();le.position.set(X,N,te),le.rotation.y=O,n.add(le);const Se={x:X,z:te,halfX:10.5,halfZ:11.2,yaw:O,radius:15.2};a.push(Se),r.push({id:"building_hero_church",kind:"building",x:X,y:N,z:te,radius:13.5,halfX:10.5,halfZ:11.2,yaw:O,height:27.5,intentionalSink:!0,archetype:"coastal_church",zone:"Z3",tier:1});const Z=s.spec.zones[2],k=[Z.startS+150,Z.startS+340,Z.startS+560,Z.startS+750],L=["terracotta_house","coastal_shop","hillside_villa","blue_plaster_cottage","stone_palazzo"],F={tier1:0,tier2:0,tier3:0};let V=null;const ce=(j,J,re,P,T,$,oe,pe,he,Ae)=>{const ve=P*.5,Me=T*.5,Fe=Math.hypot(ve,Me),we=s.closestPointXZ(j,J,he);if(Math.abs(we.lateral)-we.sample.width*.5-Fe<3.45||Math.hypot(j-W.x,J-W.z)<s.spec.plaza.radius+Fe*.55)return!1;const ke=e.getHeight(j,J);if(ke<14)return!1;const De={x:j,z:J,halfX:ve,halfZ:Me,yaw:re,radius:Fe};for(let ge=0;ge<a.length;ge++)if(_g(De,a[ge],.85))return!1;const be=H(oe,P,T,$,pe),We=j+Math.sin(re)*(Me+.3),Oe=J+Math.cos(re)*(Me+.3),Ke=e.getHeight(We,Oe),q=pe===1?Math.max(ke,Ke-.12):ke;be.position.set(j,q,J),be.rotation.y=re,n.add(be),a.push(De);const Ce=`building_z3_t${pe}_${r.length}`;return r.push({id:Ce,kind:"building",x:j,y:q,z:J,radius:Fe,halfX:ve,halfZ:Me,yaw:re,height:$*3.05+2.2,intentionalSink:!0,archetype:oe,zone:"Z3",tier:pe}),pe===1?F.tier1++:pe===2?F.tier2++:F.tier3++,!V&&pe===1&&Ae===1&&he>Z.startS+190&&he<Z.startS+320&&(V={buildingPos:new I(j,q,J),doorPos:new I(We,q+1.05,Oe),carParkS:he,carParkLateral:we.sample.width*.5-1.35,facingDir:new I(Math.sin(re),0,Math.cos(re)).normalize()}),!0};let ie=0;for(let j=Z.startS+14;j<Z.endS-18;j+=14.5){const J=s.sampleAtS(j),re=J.width*.5,P=k.some(T=>Math.abs(j-T)<9.5);for(const T of[-1,1]){if(P&&T===1||T===-1&&Math.abs(j-s.spec.plaza.s)<28)continue;const $=i.range(8.4,11.4),oe=i.range(7.2,8.8),pe=i.next()<.45?3:2,he=L[ie++%L.length],Ae=Math.hypot($*.5,oe*.5)+3.85,ve=T*(re+Ae),Me=J.pos.x+J.flatRight.x*ve,Fe=J.pos.z+J.flatRight.z*ve,we=Math.atan2(-T*J.flatRight.x,-T*J.flatRight.z);ce(Me,Fe,we,$,oe,pe,he,1,j,T)}}for(let j=Z.startS-10;j<Z.endS+15;j+=16){const J=s.sampleAtS(j),re=J.width*.5;for(const P of[-1,1]){const T=i.range(9.2,12.6),$=i.range(7.8,9.8),oe=i.next()<.62?3:2,pe=L[ie++%L.length],he=P*(re+i.range(24,32)),Ae=J.pos.x+J.flatRight.x*he+i.range(-3,3),ve=J.pos.z+J.flatRight.z*he+i.range(-3,3),Me=Math.atan2(-P*J.flatRight.x,-P*J.flatRight.z)+i.range(-.18,.18);ce(Ae,ve,Me,T,$,oe,pe,2,j,P)}}for(let j=Z.startS-20;j<Z.endS+25;j+=20){const J=s.sampleAtS(j),re=J.width*.5;for(const P of[-1,1]){const T=i.range(9.5,13.2),$=i.range(8.2,10.5),oe=3,pe=L[ie++%L.length],he=P*(re+i.range(38.5,50)),Ae=J.pos.x+J.flatRight.x*he+i.range(-4,4),ve=J.pos.z+J.flatRight.z*he+i.range(-4,4),Me=Math.atan2(-P*J.flatRight.x,-P*J.flatRight.z)+i.range(-.35,.35);ce(Ae,ve,Me,T,$,oe,pe,3,j,P)}}const se=new Xe({map:t.textures.sidewalk_stone.map,normalMap:t.textures.sidewalk_stone.normalMap,roughnessMap:t.textures.sidewalk_stone.roughnessMap,roughness:.88,polygonOffset:!0,polygonOffsetFactor:-1});for(const j of k){const J=s.sampleAtS(j),re=J.width*.5;for(let P=0;P<5;P++){const T=re+4.5+P*5.2,$=J.pos.x+J.flatRight.x*T,oe=J.pos.z+J.flatRight.z*T,pe=e.getHeight($,oe)+.06,he=new Ee(new Re(5.6,.14,5.4),se);he.position.set($,pe,oe),he.rotation.y=Math.atan2(J.flatRight.x,J.flatRight.z),he.receiveShadow=!0,n.add(he)}}const Y=new Qe(.06,.1,4.8,8),ne=new Re(.07,.07,.95),R=new Qe(.18,.12,.42,6),fe=new mi(.24,.18,6);let ue=0;for(let j=Z.startS;j<Z.endS;j+=24){const J=s.sampleAtS(j),re=J.width*.5,P=ue%2===0?-1:1,T=P*(re+1.9),$=J.pos.x+J.flatRight.x*T,oe=J.pos.z+J.flatRight.z*T,pe=s.roadSurfaceY(J,P*re)+.14,he=new pt;he.position.set($,pe,oe),he.rotation.y=Math.atan2(-P*J.flatRight.x,-P*J.flatRight.z);const Ae=new Ee(Y,m);Ae.position.y=2.4,Ae.castShadow=!1,he.add(Ae);const ve=new Ee(ne,m);ve.position.set(0,4.65,.44),he.add(ve);const Me=new Ee(R,M);Me.position.set(0,4.42,.85),he.add(Me);const Fe=new Ee(fe,m);if(Fe.position.set(0,4.72,.85),he.add(Fe),ue%2===0){const we=new gi(16753724,0,34,1.45);we.position.set(0,4.25,1.15),we.visible=!1,he.add(we),S.push(we)}n.add(he),ue++}if(!V){const j=s.sampleAtS(Z.startS+240);V={buildingPos:j.pos.clone().addScaledVector(j.flatRight,13),doorPos:j.pos.clone().addScaledVector(j.flatRight,9.5).add(new I(0,1,0)),carParkS:Z.startS+240,carParkLateral:j.width*.5-1.4,facingDir:j.flatRight.clone().negate()}}const Te=(j,J)=>{_.emissiveIntensity=j?2.6:0,C.emissiveIntensity=j?1.85:0,M.emissiveIntensity=j?5.5:.25;for(let re=0;re<S.length;re++){const P=j&&(J||re%2===0);S[re].visible=P,S[re].intensity=P?44:0}for(const re of D)re.visible=j,re.intensity=j?62:0};return Cs(n),{group:n,unitCount:r.length,archetypes:[...L,"coastal_church"],tierCounts:F,alleyCount:k.length,churchPos:new I(X,N,te),obstacles:r,scaleProofAnchor:V,setNightMode:Te}}function Vi(s,e,t={}){const n=new Xe({color:t.color??16777215,map:s.map,normalMap:s.normalMap,normalScale:new xe(.55,.55),roughnessMap:s.roughnessMap,roughness:.9,metalness:0,envMapIntensity:.42,alphaTest:t.alphaTest??.44,side:qt}),i=t.swayAmp??.09,r=t.translucencyMul??1;return n.onBeforeCompile=a=>{a.uniforms.uTime=e.uTime,a.uniforms.uSunDir=e.uSunDir,a.uniforms.uSunColor=e.uSunColor,a.uniforms.uTranslucency=e.uTranslucency,a.uniforms.uSwayAmp={value:i},a.uniforms.uTransMul={value:r},a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
        uniform float uTime;
        uniform float uSwayAmp;
        varying vec3 vFolWorldPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vec4 wInst = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wInst = instanceMatrix * wInst;
        #endif
        vec4 wPos0 = modelMatrix * wInst;
        float swayPhase = uTime * 1.7 + wPos0.x * 0.19 + wPos0.z * 0.23;
        float heightFactor = clamp(position.y * 0.28, 0.0, 1.4);
        transformed.x += sin(swayPhase) * uSwayAmp * heightFactor;
        transformed.z += cos(swayPhase * 0.83) * uSwayAmp * 0.7 * heightFactor;
        vFolWorldPos = wPos0.xyz;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        uniform float uTranslucency;
        uniform float uTransMul;
        varying vec3 vFolWorldPos;`).replace("#include <dithering_fragment>",`
        // Golden Hour warm foliage backlight translucency (compare Ref 10!)
        vec3 viewDirW = normalize(cameraPosition - vFolWorldPos);
        float backDot = pow(clamp(dot(viewDirW, -uSunDir), 0.0, 1.0), 3.0);
        float rimWrap = 0.16 + 0.84 * backDot;
        vec3 sssTint = diffuseColor.rgb * uSunColor * vec3(1.22, 1.06, 0.42);
        gl_FragColor.rgb += sssTint * rimWrap * uTranslucency * uTransMul * 0.36;
        #include <dithering_fragment>
        `)},n.customProgramCacheKey=()=>`foliage-translucent-sway-${i}-${r}`,n.userData.foliageTranslucency=!0,n}function os(s,e,t=.35){const n=s.attributes.position,i=new Float32Array(n.count*3),r=new I;for(let a=0;a<n.count;a++)r.fromBufferAttribute(n,a).sub(e),r.y+=t*Math.max(1,r.length()),r.lengthSq()<1e-5?r.set(0,1,0):r.normalize(),i[a*3]=r.x,i[a*3+1]=r.y,i[a*3+2]=r.z;s.setAttribute("normal",new vt(i,3))}function ns(s,e,t){const n=new $t(s,e,2,2),i=n.attributes.position;for(let r=0;r<i.count;r++){const a=i.getX(r),o=i.getY(r),l=a/(s*.5),c=o/(e*.5);i.setZ(r,-(l*l+c*c)*t)}return n}function Kt(s){const e=s.index?s.toNonIndexed():s.clone();if(e.attributes.normal||e.computeVertexNormals(),!e.attributes.uv){const t=e.attributes.position.count;e.setAttribute("uv",new vt(new Float32Array(t*2),2))}for(const t of Object.keys(e.attributes))t!=="position"&&t!=="normal"&&t!=="uv"&&e.deleteAttribute(t);return e}function Cg(){const s=[],e=[],t=new $n(101),n=5;let i=0,r=0;for(let c=0;c<n;c++){const h=-.35+c*1.45,u=.42-c*.045,d=.42-(c+1)*.045,f=new Qe(d,u,1.52,8),g=(t.next()-.5)*.25,v=(t.next()-.5)*.25;f.translate(i+g*.5,h+.72,r+v*.5),s.push(Kt(f)),i+=g,r+=v}const a=6;for(let c=0;c<a;c++){const h=c/a*Math.PI*2+t.range(-.2,.2),u=t.range(3,4.2),d=t.range(.55,.85),f=new Qe(.09,.2,u,6);f.translate(0,u*.5,0),f.rotateZ(d),f.rotateY(h),f.translate(i,6.2,r),s.push(Kt(f));const g=i-Math.sin(d)*Math.cos(h)*u,v=6.2+Math.cos(d)*u,p=r+Math.sin(d)*Math.sin(h)*u;for(let m=0;m<5;m++){const w=ns(t.range(3.4,4.6),t.range(2.8,3.8),.45);w.rotateX(-Math.PI*.38+t.range(-.45,.45)),w.rotateY(t.range(0,Math.PI*2)),w.rotateZ(t.range(-.35,.35)),w.translate(g+t.range(-1.1,1.1),v+t.range(-.4,.9),p+t.range(-1.1,1.1)),e.push(Kt(w))}}for(let c=0;c<8;c++){const h=c/8*Math.PI*2,u=ns(4.2,3.6,.5);u.rotateX(-Math.PI*.42+t.range(-.3,.3)),u.rotateY(h),u.translate(i+Math.cos(h)*1.3,9.1+t.range(-.3,.6),r+Math.sin(h)*1.3),e.push(Kt(u))}const o=vn(s,!1),l=vn(e,!1);return os(l,new I(i,8.2,r),.45),{trunkGeom:o,foliageGeom:l}}function Rg(){const s=[],e=[],t=new $n(202),n=10;let i=0,r=-.4,a=0;const o=1.15,l=.45;for(let f=0;f<n;f++){const g=f/n,v=(f+1)/n,p=1.04,m=jl(.38,.19,g)*(1+f%2*.06),w=jl(.38,.19,v),y=o*g*g,x=l*g*g,b=o*v*v,E=l*v*v,_=new Qe(w,m,p+.06,8),C=b-y,M=E-x;_.rotateZ(-Math.atan2(C,p)),_.rotateX(Math.atan2(M,p)),_.translate((y+b)*.5,r+p*.5,(x+E)*.5),s.push(Kt(_)),i=b,r+=p,a=E}const c=new Kn(.34,8,6);c.translate(i,r-.1,a),s.push(Kt(c));const h=[{count:6,elev:.72,droop:1.05,len:3.6,w:1.55},{count:6,elev:.28,droop:1.35,len:4.1,w:1.72},{count:4,elev:-.18,droop:1.55,len:3.8,w:1.6}];for(let f=0;f<h.length;f++){const g=h[f];for(let v=0;v<g.count;v++){const p=v/g.count*Math.PI*2+f*.52+t.range(-.14,.14),m=new $t(g.w,g.len,2,7),w=m.attributes.position;for(let y=0;y<w.count;y++){const x=w.getX(y),b=w.getY(y)+g.len*.5,E=b/g.len,_=b*Math.cos(g.elev)+Math.sin(E*Math.PI)*.35,C=b*Math.sin(g.elev)-Math.pow(E,2.15)*g.droop,M=-Math.abs(x)*.18;w.setXYZ(y,x,C+M,_)}m.rotateY(p),m.translate(i,r,a),e.push(Kt(m))}}const u=vn(s,!1),d=vn(e,!1);return os(d,new I(i,r-.5,a),.55),{trunkGeom:u,foliageGeom:d}}function Pg(){const s=[],e=[],t=new $n(303),n=new Qe(.28,.44,2,8);n.translate(0,.65,0),s.push(Kt(n));for(let a=0;a<5;a++){const o=a/5*Math.PI*2+t.range(-.25,.25),l=t.range(1.9,2.6),c=t.range(.55,.92),h=new Qe(.08,.18,l,6);h.translate(0,l*.5,0),h.rotateZ(c),h.rotateY(o),h.translate(0,1.45,0),s.push(Kt(h));const u=-Math.sin(c)*Math.cos(o)*l,d=1.45+Math.cos(c)*l,f=Math.sin(c)*Math.sin(o)*l;for(let g=0;g<5;g++){const v=ns(t.range(2.2,3),t.range(2,2.8),.35);v.rotateX(t.range(-1.2,1.2)),v.rotateY(t.range(0,Math.PI*2)),v.rotateZ(t.range(-.8,.8)),v.translate(u+t.range(-.75,.75),d+t.range(-.35,.75),f+t.range(-.75,.75)),e.push(Kt(v))}}for(let a=0;a<5;a++){const o=ns(2.6,2.4,.35);o.rotateX(t.range(-.8,.8)),o.rotateY(a/5*Math.PI*2),o.translate(t.range(-.5,.5),3.6+t.range(-.2,.5),t.range(-.5,.5)),e.push(Kt(o))}const i=vn(s,!1),r=vn(e,!1);return os(r,new I(0,3.2,0),.4),{trunkGeom:i,foliageGeom:r}}function Dg(){const s=[],e=[],t=new $n(404),n=new Qe(.08,.24,9.2,7);n.translate(0,4.2,0),s.push(Kt(n));const i=11;for(let o=0;o<i;o++){const l=o/(i-1),c=1.4+l*8.8,h=Math.sin(Math.pow(l,.58)*Math.PI)*1.18+(1-l)*.22,u=l>.82?3:4;for(let d=0;d<u;d++){const f=d/u*Math.PI*2+o*.85,g=Math.max(.85,h*2.15),v=Math.max(1.15,h*2.25),p=ns(g,v,.25);p.rotateX(t.range(-.35,.25)),p.rotateY(f+t.range(-.2,.2)),p.translate(Math.cos(f)*h*.42,c,Math.sin(f)*h*.42),e.push(Kt(p))}}const r=vn(s,!1),a=vn(e,!1);return os(a,new I(0,5.4,0),.3),{trunkGeom:r,foliageGeom:a}}function Lg(){const s=[],e=new $n(505);for(let n=0;n<9;n++){const i=n/9*Math.PI*2+e.range(-.2,.2),r=ns(e.range(1.4,2),e.range(1.15,1.65),.26);r.rotateX(e.range(-.55,.35)),r.rotateY(i),r.translate(Math.cos(i)*.38,.58+e.range(-.1,.25),Math.sin(i)*.38),s.push(Kt(r))}const t=vn(s,!1);return os(t,new I(0,.65,0),.55),t}function Ig(){const s=[];for(let t=0;t<3;t++){const n=t/3*Math.PI,i=new $t(1.15,.78,2,2),r=i.attributes.position;for(let a=0;a<r.count;a++){const o=r.getY(a)+.39,l=r.getX(a);r.setY(a,o-.06),r.setZ(a,o*o*.22+Math.abs(l)*.08)}i.rotateY(n),s.push(Kt(i))}const e=vn(s,!1);return os(e,new I(0,.1,0),.85),e}function jl(s,e,t){return s+(e-s)*t}function Ug(s,e,t,n){const i=new pt;i.name="flora_system";const r={uTime:{value:0},uSunDir:{value:new I(...s.spec.sunDirectionGoldenHour).normalize()},uSunColor:{value:new ze(16760944)},uTranslucency:{value:1}},a=new Xe({map:t.textures.bark_pine.map,normalMap:t.textures.bark_pine.normalMap,roughnessMap:t.textures.bark_pine.roughnessMap,roughness:.92,metalness:0}),o=new Xe({map:t.textures.bark_palm.map,normalMap:t.textures.bark_palm.normalMap,roughnessMap:t.textures.bark_palm.roughnessMap,roughness:.9,metalness:0}),l=Vi(t.textures.cluster_pine,r,{color:12571812,alphaTest:.42,swayAmp:.08,translucencyMul:1.15}),c=Vi(t.textures.cluster_palm_frond,r,{color:13426860,alphaTest:.4,swayAmp:.14,translucencyMul:1.25}),h=Vi(t.textures.cluster_olive,r,{color:12898482,alphaTest:.42,swayAmp:.07,translucencyMul:1.05}),u=Vi(t.textures.cluster_pine,r,{color:9349244,alphaTest:.42,swayAmp:.06,translucencyMul:.85}),d=Vi(t.textures.cluster_shrub,r,{color:11585678,alphaTest:.44,swayAmp:.05,translucencyMul:1}),f=Vi(t.textures.cluster_grass_tuft,r,{color:12371588,alphaTest:.42,swayAmp:.08,translucencyMul:1.05}),g=Cg(),v=Rg(),p=Pg(),m=Dg(),w=Lg(),y=Ig(),x=new $n(s.spec.seed+777),b=[],E=e.getPlazaCenter(),_=[],C=[],M=[],S=[],D=[],z=[],U=(k,L,F,V=4.2)=>{if(e.getHeight(k,L)<1.2)return!1;const ie=s.closestPointXZ(k,L);if(Math.abs(ie.lateral)-ie.sample.width*.5-F<V||ie.sample.isBridge&&Math.abs(ie.lateral)<ie.sample.width*.5+15||Math.hypot(k-E.x,L-E.z)<14.5)return!1;for(let ne=0;ne<n.length;ne++){const R=n[ne],fe=R.radius+F+2.2;if((k-R.x)**2+(L-R.z)**2<fe*fe)return!1}return!0},H=(k,L,F,V,ce,ie,se,Y)=>{const ne=e.getHeight(F,V),R=new ze(se);R.offsetHSL(x.range(-.025,.025),x.range(-.08,.08),x.range(-.09,.09)),k.push({x:F,y:ne,z:V,scale:ce,yaw:x.range(0,Math.PI*2),tint:R,nearTrack:Y}),b.push({id:`tree_${L}_${b.length}`,kind:"tree",x:F,y:ne,z:V,radius:ie,height:8*ce})},ee=s.spec.zones[0];for(let k=ee.startS+20;k<ee.endS-10;k+=19){const L=s.sampleAtS(k),F=L.width*.5;for(const se of[-1,1]){if(se===-1&&x.next()>.78)continue;const Y=se*(F+x.range(6,se===1?15:10.5)),ne=L.pos.x+L.flatRight.x*Y,R=L.pos.z+L.flatRight.z*Y;U(ne,R,.48,4.4)&&H(C,"palm",ne,R,x.range(.88,1.32),.45,14216125,!0)}const V=F+x.range(18,42),ce=L.pos.x+L.flatRight.x*V,ie=L.pos.z+L.flatRight.z*V;U(ce,ie,.5,5)&&(x.next()<.55?H(_,"pine",ce,ie,x.range(.9,1.3),.5,13361336,!1):H(M,"olive",ce,ie,x.range(.95,1.35),.45,13950920,!1))}const W=s.spec.zones[1];for(let k=W.startS;k<W.endS;k+=16){const L=s.sampleAtS(k),F=L.width*.5,ce=-(k>=1175&&k<=1375?1:-1);for(let ie=0;ie<2;ie++){const se=ce*(F+x.range(7.5,34)),Y=L.pos.x+L.flatRight.x*se,ne=L.pos.z+L.flatRight.z*se;if(e.getNormal(Y,ne).y>.64&&U(Y,ne,.5,4.6)){const fe=x.next();fe<.42?H(M,"olive",Y,ne,x.range(.85,1.25),.45,14016455,Math.abs(se)<18):fe<.74?H(_,"pine",Y,ne,x.range(.85,1.25),.5,13032114,Math.abs(se)<18):H(S,"cypress",Y,ne,x.range(.85,1.25),.38,10467470,Math.abs(se)<18)}}}for(let k=0;k<6;k++){const L=k/6*Math.PI*2+.35,F=E.x+Math.cos(L)*16.5,V=E.z+Math.sin(L)*16.5;U(F,V,.42,4.2)&&(k%2===0?H(M,"olive",F,V,x.range(.95,1.15),.4,14279886,!0):H(S,"cypress",F,V,x.range(.9,1.15),.35,10665104,!0))}const Q=s.spec.zones[2];for(let k=Q.startS;k<Q.endS;k+=18){const L=s.sampleAtS(k),F=L.width*.5;for(const V of[-1,1]){const ce=V*(F+x.range(16,56)),ie=L.pos.x+L.flatRight.x*ce,se=L.pos.z+L.flatRight.z*ce;if(U(ie,se,.45,5.5)){const Y=x.next();Y<.45?H(S,"cypress",ie,se,x.range(.9,1.35),.38,10533260,!1):Y<.78?H(_,"pine",ie,se,x.range(.9,1.3),.48,13097906,!1):H(C,"palm",ie,se,x.range(.85,1.15),.42,14216382,!1)}}}const X=s.spec.zones[3];for(let k=X.startS-30;k<X.endS;k+=7.5){const L=s.sampleAtS(k),F=L.width*.5;for(const V of[-1,1]){const ce=L.isBridge?2:3;for(let ie=0;ie<ce;ie++){const se=L.isBridge?11.5:5.6,Y=V*(F+x.range(se,22)),ne=L.pos.x+L.flatRight.x*Y+x.range(-3,3),R=L.pos.z+L.flatRight.z*Y+x.range(-3,3);if(U(ne,R,.52,4.3)){const fe=x.next();L.pos.y<14&&fe<.35?H(C,"palm",ne,R,x.range(.85,1.3),.45,14281918,!0):fe<.52?H(_,"pine",ne,R,x.range(.92,1.48),.52,13229746,!0):fe<.78?H(M,"olive",ne,R,x.range(.9,1.38),.45,14148296,!0):H(S,"cypress",ne,R,x.range(.85,1.32),.38,10664592,!0)}}for(let ie=0;ie<2;ie++){const se=V*(F+x.range(22,58)),Y=L.pos.x+L.flatRight.x*se,ne=L.pos.z+L.flatRight.z*se;if(U(Y,ne,.55,6)){const R=x.next();R<.55?H(_,"pine",Y,ne,x.range(1,1.55),.52,12637866,!1):R<.8?H(M,"olive",Y,ne,x.range(.95,1.35),.45,13688e3,!1):H(S,"cypress",Y,ne,x.range(.95,1.4),.38,10072710,!1)}}}}for(let k=0;k<240;k++){const L=x.range(45,560),F=x.range(-390,440),V=e.getHeight(L,F),ce=e.getNormal(L,F);if(V>8&&ce.y>.72&&U(L,F,.55,8.5)){const ie=x.next();ie<.48?H(_,"pine",L,F,x.range(.95,1.45),.5,12637864,!1):ie<.78?H(M,"olive",L,F,x.range(.9,1.35),.45,13293756,!1):H(S,"cypress",L,F,x.range(.9,1.35),.38,9875588,!1)}}for(let k=0;k<s.length;k+=4.5){const L=s.sampleAtS(k);if(L.isBridge)continue;const F=L.width*.5,V=L.zone==="Z4",ce=L.zone==="Z1",ie=L.zone==="Z3",se=V?5:ie?1:3;for(let ne=0;ne<se;ne++){const R=x.next()<.5?-1:1,fe=ie?F+5.5:F+2.7,ue=V?F+30:F+18,Te=R*x.range(fe,ue),j=L.pos.x+L.flatRight.x*Te+x.range(-2,2),J=L.pos.z+L.flatRight.z*Te+x.range(-2,2),re=e.getHeight(j,J);if(re<1.35)continue;let P=!1;for(let $=0;$<n.length;$++){const oe=n[$];if((j-oe.x)**2+(J-oe.z)**2<(oe.radius+1.2)**2){P=!0;break}}if(P)continue;const T=new ze(V?12900512:13817510);T.offsetHSL(x.range(-.03,.03),x.range(-.1,.08),x.range(-.12,.1)),D.push({x:j,y:re-.14,z:J,scale:x.range(.75,V?1.55:1.15),yaw:x.range(0,Math.PI*2),tint:T,nearTrack:Math.abs(Te)<F+14})}const Y=V?8:ce?5:ie?1:4;for(let ne=0;ne<Y;ne++){const R=x.next()<.5?-1:1,fe=ie?F+4.8:F+1.55,ue=V?F+22:ce?F+20:F+14,Te=R*x.range(fe,ue),j=L.pos.x+L.flatRight.x*Te+x.range(-2,2),J=L.pos.z+L.flatRight.z*Te+x.range(-2,2),re=e.getHeight(j,J);if(re<1.05)continue;const P=s.closestPointXZ(j,J,k);if(Math.abs(P.lateral)<P.sample.width*.5+1.3)continue;const T=new ze(ce?14275218:V?12440714:13619094);T.offsetHSL(x.range(-.03,.04),x.range(-.12,.08),x.range(-.12,.12)),z.push({x:j,y:re-.05,z:J,scale:x.range(.75,1.45),yaw:x.range(0,Math.PI*2),tint:T,nearTrack:Math.abs(Te)<F+11})}}const te=k=>k.sort((L,F)=>L.nearTrack===F.nearTrack?0:L.nearTrack?-1:1);te(_),te(C),te(M),te(S),te(D),te(z);const N=[],O=new At,le=(k,L,F,V,ce,ie)=>{if(V.length===0)return;const se=new Fc(L,F,V.length);se.name=k,se.castShadow=ce,se.receiveShadow=!0;let Y=0;for(let ne=0;ne<V.length;ne++){const R=V[ne];R.nearTrack&&Y++,O.position.set(R.x,R.y,R.z),O.rotation.set(0,R.yaw,0),O.scale.setScalar(R.scale),O.updateMatrix(),se.setMatrixAt(ne,O.matrix),ie&&se.setColorAt(ne,R.tint)}se.instanceMatrix.needsUpdate=!0,se.instanceColor&&(se.instanceColor.needsUpdate=!0),se.computeBoundingSphere(),i.add(se),N.push({mesh:se,fullCount:V.length,nearCount:Math.max(Y,Math.ceil(V.length*.55))})};le("trees_stone_pine_trunks",g.trunkGeom,a,_,!0,!1),le("trees_stone_pine_foliage",g.foliageGeom,l,_,!0,!0),le("trees_coastal_palm_trunks",v.trunkGeom,o,C,!0,!1),le("trees_coastal_palm_foliage",v.foliageGeom,c,C,!0,!0),le("trees_olive_trunks",p.trunkGeom,a,M,!0,!1),le("trees_olive_foliage",p.foliageGeom,h,M,!0,!0),le("trees_cypress_trunks",m.trunkGeom,a,S,!0,!1),le("trees_cypress_foliage",m.foliageGeom,u,S,!0,!0),le("flora_maquis_shrubs",w,d,D,!1,!0),le("flora_coastal_grass",y,f,z,!1,!0);const Se=(k,L,F)=>{r.uTime.value=k,r.uSunDir.value.copy(L).normalize(),r.uSunColor.value.setHex(F?6455474:16760427),r.uTranslucency.value=F?.12:1},Z=k=>{for(const L of N)L.mesh.count=k==="high"?L.fullCount:L.nearCount};return{group:i,speciesNames:["stone_pine","coastal_palm","mediterranean_olive","tuscan_cypress"],hasTrees:_.length+C.length+M.length+S.length>0,hasShrubs:D.length>0,hasGroundcover:z.length>0,foliageTranslucencyActive:!0,totalTreeCount:_.length+C.length+M.length+S.length,totalShrubCount:D.length,totalGrassCount:z.length,obstacles:b,update:Se,setQuality:Z}}function Ng(s,e,t){const n=new pt;n.name="props_and_bridge_system";const i=new $n(s.spec.seed+5050),r=[],a=[],o=[],l=[];let c=0;const h=new Xe({color:13813684,map:t.textures.stone_wall.map,normalMap:t.textures.stone_wall.normalMap,roughnessMap:t.textures.stone_wall.roughnessMap,roughness:.9}),u=new Xe({color:13157306,map:t.textures.concrete_bridge.map,normalMap:t.textures.concrete_bridge.normalMap,roughnessMap:t.textures.concrete_bridge.roughnessMap,roughness:.86}),d=new Xe({color:13550512,map:t.textures.cliff_rock.map,normalMap:t.textures.cliff_rock.normalMap,normalScale:new xe(1.25,1.25),roughnessMap:t.textures.cliff_rock.roughnessMap,roughness:.92}),f=new Xe({color:11967614,map:t.textures.wood_planks.map,normalMap:t.textures.wood_planks.normalMap,roughnessMap:t.textures.wood_planks.roughnessMap,roughness:.88}),g=new Xe({color:14735044,map:t.textures.sidewalk_stone.map,normalMap:t.textures.sidewalk_stone.normalMap,roughnessMap:t.textures.sidewalk_stone.roughnessMap,roughness:.85}),v=new Xe({color:8687514,metalness:.52,roughness:.54}),p=new Xe({color:2237998,metalness:.72,roughness:.42}),m=new Xe({color:13184042,roughness:.75,side:qt}),w=new Xe({color:14919723,roughness:.75,side:qt}),y=new Xe({color:1998220,roughness:.75,side:qt}),x=new Xe({color:16040988,emissive:new ze(6704384),emissiveIntensity:.25,roughness:.4}),b=new Xe({color:16777215,emissive:new ze(16773328),emissiveIntensity:1.5,roughness:.2}),E=new Xe({color:1450544,emissive:new ze(2254506),emissiveIntensity:.45,roughness:.35});{const N=s.sampleAtS(s.spec.startFinishS),O=new pt;O.name="start_finish_gantry",O.position.copy(N.pos),O.rotation.y=Math.atan2(-N.tangent.x,-N.tangent.z);const le=N.width+6.4,Se=7.4;for(const F of[-1,1]){const V=F*(le*.5),ce=new Ee(new Re(1.5,1.4,2.2),u);ce.position.set(V,.2,0),ce.castShadow=!0,ce.receiveShadow=!0,O.add(ce);for(const ie of[-.65,.65]){const se=new Ee(new Re(.32,Se,.32),p);se.position.set(V,Se*.5,ie),se.castShadow=!0,O.add(se)}for(let ie=0;ie<4;ie++){const se=new Ee(new Re(.16,.14,1.4),v);se.position.set(V,1.4+ie*1.65,0),O.add(se)}}const Z=new Ee(new Re(le+.8,1.45,1.45),p);Z.position.set(0,Se,0),Z.castShadow=!0,O.add(Z);const k=new Ee(new Re(le-2,1.15,1.56),E);k.position.set(0,Se,0),O.add(k);const L=new Ee(new Re(le-1.6,.14,1.62),m);L.position.set(0,Se-.62,0),O.add(L);for(let F=-2;F<=2;F++){const V=new Ee(new Re(.45,.45,.3),p);V.position.set(F*1.1,Se-.95,.6),O.add(V);const ce=new Ee(new Qe(.14,.14,.08,14),b);ce.rotation.x=Math.PI/2,ce.position.set(F*1.1,Se-.95,.76),O.add(ce)}for(const F of[-4.2,4.2]){const V=new gi(16773332,0,52,1.25);V.position.set(F,Se-1.2,0),V.visible=!1,O.add(V),o.push(V)}n.add(O),c+=8}const _=s.spec.zones[0];for(let N=_.startS+10;N<_.endS-18;N+=12){const O=s.sampleAtS(N),le=O.width*.5,Se=Math.atan2(-O.tangent.x,-O.tangent.z);if(Math.floor(N/36)%3!==2){const Z=-(le+2.35),k=O.pos.x+O.flatRight.x*Z,L=O.pos.z+O.flatRight.z*Z,F=e.getHeight(k,L),V=new Ee(new Re(.48,1.05,11.4),h);V.position.set(k,F+.35,L),V.rotation.y=Se,V.castShadow=!0,V.receiveShadow=!0,n.add(V);const ce=new Ee(new Re(.62,.14,11.55),u);ce.position.set(k,F+.9,L),ce.rotation.y=Se,n.add(ce),c+=2}if(Math.floor(N/12)%2===0)for(const Z of[-1,1]){const k=Z*(le+(Z===-1?3.2:3.4)),L=O.pos.x+O.flatRight.x*k,F=O.pos.z+O.flatRight.z*k,V=e.getHeight(L,F),ce=new Ee(new Qe(.04,.055,4.4,8),v);ce.position.set(L,V+2.1,F),n.add(ce);const ie=(Math.floor(N)+(Z>0?1:0))%3===0?m:Math.floor(N)%2===0?w:y,se=new Ee(new $t(.75,1.95),ie);se.position.set(L+O.flatRight.x*Z*.42,V+3.25,F+O.flatRight.z*Z*.42),se.rotation.y=Se+Math.PI*.5,n.add(se),c+=2}if(N>60&&N<340&&Math.floor(N/12)%3===0){const Z=le+3,k=O.pos.x+O.flatRight.x*Z,L=O.pos.z+O.flatRight.z*Z,F=e.getHeight(k,L),V=new Ee(new Qe(.07,.11,5.8,8),p);V.position.set(k,F+2.8,L),n.add(V);const ce=new Ee(new Re(.75,.22,.35),b);ce.position.set(k-O.flatRight.x*.6,F+5.7,L-O.flatRight.z*.6),ce.rotation.y=Se,n.add(ce);const ie=new gi(16768166,0,38,1.4);ie.position.set(k-O.flatRight.x*1.5,F+5.3,L-O.flatRight.z*1.5),ie.visible=!1,n.add(ie),o.push(ie),c+=2}{const Z=-(le+13.5+Math.sin(N*.03)*3.5),k=O.pos.x+O.flatRight.x*Z,L=O.pos.z+O.flatRight.z*Z,F=e.getHeight(k,L);if(F>.65){const V=new pt;V.position.set(k,F,L),V.rotation.y=Se+i.range(-.12,.12);for(let se=0;se<8;se++){const Y=new Ee(new Re(.06,i.range(.95,1.25),.14),f);Y.position.set(0,.45,(se-3.5)*.65),Y.rotation.z=i.range(-.08,.08),Y.castShadow=!0,V.add(Y)}const ce=new Ee(new Re(.04,.05,5.2),f);ce.position.set(0,.35,0),V.add(ce);const ie=new Ee(new Re(.04,.05,5.2),f);ie.position.set(0,.78,0),V.add(ie),n.add(V),c+=2}}}const C=(N,O)=>{const le=new zo(N,3),Se=le.attributes.position,Z=O*.73,k=O*1.19,L=O*2.07;for(let F=0;F<Se.count;F++){const V=Se.getX(F),ce=Se.getY(F),ie=Se.getZ(F),se=Math.hypot(V,ce,ie)||1,Y=V/se,ne=ce/se,R=ie/se,fe=Math.sin(Y*2.6+Z)*Math.cos(R*2.4-k),ue=Math.sin((Y*1.8-ne*2.1+R*1.5)*2.2+L)*.45,Te=.86+.16*fe+.08*ue,j=ne<0?.58:.72;Se.setXYZ(F,V*Te,ce*Te*j,ie*Te)}return le.computeVertexNormals(),le};for(let N=0;N<22;N++){const O=35+N*28+i.range(-8,8),le=s.sampleAtS(O);let Se=-(le.width*.5+22);for(let V=0;V<30;V++){const ce=le.pos.x+le.flatRight.x*Se,ie=le.pos.z+le.flatRight.z*Se,se=e.getHeight(ce,ie);if(se<.05&&se>-1.9)break;Se-=2.5}const Z=le.pos.x+le.flatRight.x*(Se+i.range(-5,3)),k=le.pos.z+le.flatRight.z*(Se+i.range(-5,3)),L=i.range(1.6,4.2),F=new Ee(C(L,800+N),d);F.position.set(Z,-.15+i.range(-.2,.45),k),F.rotation.y=i.range(0,Math.PI*2),F.castShadow=!0,F.receiveShadow=!0,n.add(F),r.push({x:Z,z:k,radius:L*.92}),c++}const M=new Xe({color:16052714,roughness:.35,metalness:.05}),S=new Xe({color:1784924,roughness:.38});for(let N=0;N<7;N++){const O=-105-i.range(25,110),le=-240+N*82+i.range(-18,18),Se=new pt,Z=new Ee(new Re(2.4,1.1,6.8),N%2===0?M:S);Z.position.y=.25,Se.add(Z);const k=new Ee(new Re(1.7,.85,2.4),M);k.position.set(0,1.05,.4),Se.add(k);const L=new Ee(new Qe(.06,.08,7.6,8),v);L.position.set(0,4.3,-.4),Se.add(L);const F=new Ee(new $t(2.8,5.4),M);F.position.set(0,4.4,1),F.rotation.y=Math.PI/2,Se.add(F),Se.position.set(O,0,le),Se.rotation.y=i.range(0,Math.PI*2),n.add(Se),l.push({mesh:Se,baseY:0,phase:N*1.3}),c+=2}const D=s.spec.zones[1],z=new Re(.11,1.02,.11),U=new Re(.36,.34,.36),H=(N,O,le)=>{const Se=Math.max(8,Math.ceil((O-N)/3)),Z=[[0,.48],[-.08*le,.56],[.02*le,.65],[-.08*le,.74],[0,.82],[.09*le,.82],[.09*le,.48]],k=Z.length,L=[],F=[];for(let ie=0;ie<=Se;ie++){const se=N+ie/Se*(O-N),Y=s.sampleAtS(se),ne=Y.width*.5,R=le*(ne+1.32),fe=s.roadSurfaceY(Y,le*ne);for(let ue=0;ue<k;ue++){const Te=R+Z[ue][0],j=Y.pos.x+Y.flatRight.x*Te,J=Y.pos.z+Y.flatRight.z*Te,re=fe+Z[ue][1];L.push(j,re,J)}}for(let ie=0;ie<Se;ie++)for(let se=0;se<k;se++){const Y=(se+1)%k,ne=ie*k+se,R=ie*k+Y,fe=(ie+1)*k+se,ue=(ie+1)*k+Y;F.push(ne,fe,R,R,fe,ue)}const V=new xt;V.setAttribute("position",new et(L,3)),V.setIndex(F),V.computeVertexNormals();const ce=new Ee(V,v);ce.castShadow=!0,ce.receiveShadow=!0,n.add(ce)};H(D.startS-12,1172,-1),H(1176,1372,1),H(1376,D.endS+10,-1);for(let N=D.startS-12;N<D.endS+10;N+=4.2){const O=s.sampleAtS(N),le=O.width*.5,Se=Math.atan2(-O.tangent.x,-O.tangent.z),Z=N>=1175&&N<=1375?1:-1;{const k=Z*(le+1.38),L=O.pos.x+O.flatRight.x*k,F=O.pos.z+O.flatRight.z*k,V=s.roadSurfaceY(O,Z*le),ce=new Ee(z,p);ce.position.set(L,V+.34,F),ce.rotation.y=Se,ce.castShadow=!0,n.add(ce);const ie=new Ee(U,u);ie.position.set(L,V-.1,F),ie.rotation.y=Se,n.add(ie),c++}if(Math.abs(O.curvature)>.011&&Math.floor(N/4.2)%3===0){const L=(O.curvature>0?-1:1)*(le+2.35),F=O.pos.x+O.flatRight.x*L,V=O.pos.z+O.flatRight.z*L,ce=e.getHeight(F,V),ie=new Ee(new Qe(.04,.04,1.75,6),p);ie.position.set(F,ce+.85,V),n.add(ie);const se=new Ee(new Re(.68,.56,.06),x);se.position.set(F,ce+1.55,V),se.rotation.y=Se,n.add(se),c+=2}if(Math.floor(N/4.2)%4===0){const L=-Z*(le+i.range(6.4,13.5)),F=O.pos.x+O.flatRight.x*L,V=O.pos.z+O.flatRight.z*L,ce=e.getHeight(F,V),ie=i.range(1.4,3),se=s.closestPointXZ(F,V,N);if(Math.abs(se.lateral)-se.sample.width*.5-ie>3.2){const Y=new Ee(C(ie,Math.floor(N*7)),d);Y.position.set(F,ce+ie*.22,V),Y.rotation.set(i.range(-.25,.25),i.range(0,Math.PI*2),i.range(-.25,.25)),Y.castShadow=!0,Y.receiveShadow=!0,n.add(Y),a.push({id:`cliff_boulder_${a.length}`,kind:"boulder",x:F,y:ce,z:V,radius:ie,height:ie*1.3,intentionalSink:!0}),c++}}}{const N=e.getPlazaCenter(),O=e.getHeight(N.x,N.z),le=new Ee(new Qe(s.spec.plaza.radius-1.5,s.spec.plaza.radius,.45,32),g);le.position.set(N.x,O-.14,N.z),le.receiveShadow=!0,n.add(le);const Se=new Ee(new Qe(3.4,3.8,.95,16),u);Se.position.set(N.x,O+.48,N.z),Se.castShadow=!0,Se.receiveShadow=!0,n.add(Se);const Z=new Ee(new Qe(3.05,3.05,.1,16),new In({color:2533554,roughness:.08,clearcoat:1}));Z.position.set(N.x,O+.88,N.z),n.add(Z);const k=new Ee(new Qe(.45,.65,2.4,12),u);k.position.set(N.x,O+1.6,N.z),k.castShadow=!0,n.add(k);const L=new Ee(new Qe(1.45,.65,.55,14),u);L.position.set(N.x,O+2.65,N.z),n.add(L);for(let R=0;R<6;R++){const fe=R/6*Math.PI*2,ue=N.x+Math.cos(fe)*8.6,Te=N.z+Math.sin(fe)*8.6,j=new Ee(new Qe(.04,.04,2.5,8),f);j.position.set(ue,O+1.25,Te),n.add(j);const J=new Ee(new mi(1.75,.65,8),R%2===0?m:w);J.position.set(ue,O+2.55,Te),J.castShadow=!0,n.add(J);const re=new Ee(new Qe(.62,.62,.08,12),f);re.position.set(ue,O+.82,Te),n.add(re),c+=3}const F=s.spec.zones[2],V=new Qe(.11,.14,.82,8),ce=new Qe(.38,.28,.52,8),ie=new Xe({color:12082748,roughness:.86}),se=new Xe({color:6061124,map:t.textures.cluster_shrub.map,alphaTest:.35,roughness:.9,side:qt}),Y=new $t(.75,.65),ne=new Re(1.85,.1,.55);for(let R=F.startS+6;R<F.endS-6;R+=11){const fe=s.sampleAtS(R),ue=fe.width*.5,Te=Math.atan2(-fe.tangent.x,-fe.tangent.z);for(const j of[-1,1]){const J=j*(ue+.55),re=fe.pos.x+fe.flatRight.x*J,P=fe.pos.z+fe.flatRight.z*J,T=s.roadSurfaceY(fe,j*ue)+.14,$=new Ee(V,p);if($.position.set(re,T+.4,P),$.castShadow=!0,n.add($),c++,Math.floor(R/11)%2===0){const oe=j*(ue+2.3),pe=fe.pos.x+fe.flatRight.x*oe,he=fe.pos.z+fe.flatRight.z*oe,Ae=new Ee(ce,ie);Ae.position.set(pe,T+.26,he),Ae.castShadow=!0,n.add(Ae);for(let ve=0;ve<2;ve++){const Me=new Ee(Y,se);Me.position.set(pe,T+.72,he),Me.rotation.y=Te+ve*(Math.PI*.5),n.add(Me)}c++}else if(j===-1&&Math.floor(R/11)%3===1){const oe=-(ue+2.25),pe=fe.pos.x+fe.flatRight.x*oe,he=fe.pos.z+fe.flatRight.z*oe,Ae=new Ee(ne,f);Ae.position.set(pe,T+.48,he),Ae.rotation.y=Te+Math.PI*.5,Ae.castShadow=!0,n.add(Ae),c++}}}}{const N=s.spec.bridge,O=28,le=N.endS-N.startS;for(let L=0;L<O;L++){const F=N.startS+L/O*le,V=N.startS+(L+1)/O*le,ce=(F+V)*.5,ie=s.sampleAtS(ce),se=s.sampleAtS(F),Y=s.sampleAtS(V),ne=se.pos.distanceTo(Y.pos)+.35,R=Math.atan2(-ie.tangent.x,-ie.tangent.z),fe=Math.asin(Math.max(-.3,Math.min(.3,ie.tangent.y))),ue=new pt;ue.position.copy(ie.pos),ue.rotation.set(fe,R,-ie.bankRad,"YXZ");const Te=new Ee(new Re(ie.width+1.6,N.deckThickness,ne),u);Te.position.set(0,-N.deckThickness*.5-.04,0),Te.castShadow=!0,Te.receiveShadow=!0,ue.add(Te);for(const j of[-1,1]){const J=j*(ie.width*.5+.58),re=new Ee(new Re(.56,1.02,ne),h);re.position.set(J,.42,0),re.castShadow=!0,re.receiveShadow=!0,ue.add(re);const P=new Ee(new Re(.68,.14,ne),u);P.position.set(J,.96,0),ue.add(P);const T=new Ee(new Qe(.04,.04,ne,6),p);T.rotation.x=Math.PI/2,T.position.set(J,1.24,0),ue.add(T)}if(L%4===2){for(const j of[-1,1]){const J=j*(ie.width*.5+.62),re=new Ee(new Qe(.05,.08,3.6,8),p);re.position.set(J,2.7,0),ue.add(re);const P=new Ee(new Kn(.22,10,8),b);if(P.position.set(J-j*.25,4.45,0),ue.add(P),j===1){const T=new gi(16758872,0,36,1.4);T.position.set(J-1.2,4.2,0),T.visible=!1,ue.add(T),o.push(T)}}c+=4}n.add(ue),c+=2}const Se=[.2,.4,.6,.8];for(const L of Se){const F=N.startS+L*le,V=s.sampleAtS(F),ce=Math.atan2(-V.tangent.x,-V.tangent.z),ie=e.getHeight(V.pos.x,V.pos.z),se=Math.max(4,V.pos.y-ie+3.5),Y=new pt;Y.position.set(V.pos.x,V.pos.y-N.deckThickness,V.pos.z),Y.rotation.y=ce;const ne=new Ee(new Re(V.width+1.4,1.3,2.6),u);ne.position.set(0,-.5,0),ne.castShadow=!0,Y.add(ne);for(const fe of[-1,1]){const ue=new Ee(new Qe(1.18,1.62,se,10),h);ue.position.set(fe*(V.width*.34),-se*.5,0),ue.castShadow=!0,ue.receiveShadow=!0,Y.add(ue)}const R=new Ee(new Re(V.width*.72,1.6,1.9),h);R.position.set(0,-se*.36,0),R.castShadow=!0,Y.add(R),n.add(Y),c+=4}const Z=[.1,.3,.5,.7,.9],k=le*.2;for(const L of Z){const F=N.startS+L*le,V=s.sampleAtS(F),ce=Math.atan2(-V.tangent.x,-V.tangent.z),ie=Math.asin(Math.max(-.3,Math.min(.3,V.tangent.y))),se=new pt;se.position.copy(V.pos),se.rotation.set(ie,ce,-V.bankRad,"YXZ");const Y=k*.48,ne=new jn(Y,.85,8,20,Math.PI);ne.rotateY(Math.PI/2),ne.scale(1,.44,1);for(const R of[-1,1]){const fe=new Ee(ne,h);fe.position.set(R*(V.width*.36),-N.deckThickness-Y*.44+.45,0),fe.castShadow=!0,fe.receiveShadow=!0,se.add(fe)}n.add(se),c+=2}for(const L of[N.startS+3,N.endS-3]){const F=s.sampleAtS(L),V=Math.atan2(-F.tangent.x,-F.tangent.z),ce=new pt;ce.position.set(F.pos.x,F.pos.y,F.pos.z),ce.rotation.y=V;const ie=new Ee(new Re(F.width+5.2,13,10.2),h);ie.position.set(0,-7.5,0),ie.castShadow=!0,ie.receiveShadow=!0,ce.add(ie);for(const se of[-1,1]){const Y=new Ee(new Re(1.1,6.2,8.5),h);Y.position.set(se*(F.width*.5+3.4),-3.6,0),Y.rotation.y=se*.35,Y.castShadow=!0,Y.receiveShadow=!0,ce.add(Y)}n.add(ce),c+=4}}const ee=s.spec.zones[3];for(let N=ee.startS;N<ee.endS;N+=7){const O=s.sampleAtS(N);if(O.isBridge)continue;const le=O.width*.5,Se=Math.atan2(-O.tangent.x,-O.tangent.z);for(const Z of[-1,1]){const k=Z*(le+1.9),L=O.pos.x+O.flatRight.x*k,F=O.pos.z+O.flatRight.z*k,V=e.getHeight(L,F),ce=new Ee(new Qe(.08,.1,1.15,6),f);ce.position.set(L,V+.48,F),ce.castShadow=!0,n.add(ce);const ie=new Ee(new Qe(.086,.086,.14,6),Z===-1?x:b);if(ie.position.set(L,V+.88,F),n.add(ie),Math.abs(O.curvature)>.008&&Z===(O.curvature>0?-1:1)){const se=new Ee(new Re(.14,.28,7.2),v);se.position.set(L,V+.65,F),se.rotation.y=Se,n.add(se)}c+=2}}const W=N=>{b.emissiveIntensity=N?5:1.4,E.emissiveIntensity=N?1.8:.4;for(const O of o)O.visible=N,O.intensity=N?48:0},Q=N=>{for(const O of l)O.mesh.position.y=O.baseY+Math.sin(N*1.4+O.phase)*.14,O.mesh.rotation.z=Math.sin(N*1.1+O.phase)*.045,O.mesh.rotation.x=Math.cos(N*.9+O.phase)*.025},X=new Set(l.map(N=>N.mesh));Cs(n,X);const te=Math.round(c/(s.length/100)*10)/10;return{group:n,coastalRocks:r,obstacles:a,propCountTotal:c,propsPer100m:te,setNightMode:W,update:Q}}class Fg{constructor(){B(this,"group",new pt);B(this,"maxParticles",240);B(this,"slots",[]);B(this,"positions");B(this,"colors");B(this,"geom");B(this,"points");B(this,"cursor",0);this.group.name="particle_system",this.positions=new Float32Array(this.maxParticles*3),this.colors=new Float32Array(this.maxParticles*3);for(let a=0;a<this.maxParticles;a++)this.slots.push({active:!1,age:0,maxAge:1,pos:new I(0,-999,0),vel:new I,sizeStart:.4,sizeEnd:1.6,color:new ze(14211288)}),this.positions[a*3+1]=-999;const e=document.createElement("canvas");e.width=64,e.height=64;const t=e.getContext("2d"),n=t.createRadialGradient(32,32,4,32,32,30);n.addColorStop(0,"rgba(255,255,255,0.72)"),n.addColorStop(.5,"rgba(255,255,255,0.32)"),n.addColorStop(1,"rgba(255,255,255,0.0)"),t.fillStyle=n,t.fillRect(0,0,64,64);const i=new Nr(e);this.geom=new xt,this.geom.setAttribute("position",new vt(this.positions,3)),this.geom.setAttribute("color",new vt(this.colors,3));const r=new zc({size:1.45,map:i,vertexColors:!0,transparent:!0,opacity:.55,depthWrite:!1,sizeAttenuation:!0});this.points=new Iu(this.geom,r),this.points.frustumCulled=!1,this.group.add(this.points)}emit(e,t,n,i,r,a,o,l){const c=this.slots[this.cursor];this.cursor=(this.cursor+1)%this.maxParticles,c.active=!0,c.age=0,c.maxAge=o,c.pos.set(e,t,n),c.vel.set(i,r,a),c.color.setHex(l)}emitForVehicle(e,t){const n=e.telemetry;if(n.speedKmh<12)return;const i=Math.sin(e.yaw),r=Math.cos(e.yaw),a=-i,o=-r,l=r,c=-i,h=n.surface==="sand"||n.surface==="gravel"||n.surface==="grass";if(n.tireSlip>.32||h){const d=h?.55:.45;if(Math.random()<d){const f=[e.wheels[2],e.wheels[3]];for(const g of f){const v=e.pos.x+l*g.mountX-a*g.mountZ,p=e.pos.z+c*g.mountX-o*g.mountZ,m=n.surface==="sand"?14271128:n.surface==="gravel"||n.surface==="grass"?12298378:14212320;this.emit(v+(Math.random()-.5)*.25,e.pos.y+.18,p+(Math.random()-.5)*.25,-e.vel.x*.12+(Math.random()-.5)*1.4,.85+Math.random()*1.2,-e.vel.z*.12+(Math.random()-.5)*1.4,h?.85:.72,m)}}}if(n.nitroActive&&Math.random()<.75){const d=e.pos.x-a*2.35,f=e.pos.z-o*2.35;this.emit(d+(Math.random()-.5)*.6,e.pos.y+.32,f+(Math.random()-.5)*.6,-a*8+(Math.random()-.5)*1.5,.5+Math.random()*.8,-o*8+(Math.random()-.5)*1.5,.24,6742271)}}update(e){for(let t=0;t<this.maxParticles;t++){const n=this.slots[t];if(!n.active){this.positions[t*3+1]=-999;continue}if(n.age+=e,n.age>=n.maxAge){n.active=!1,this.positions[t*3+1]=-999;continue}n.pos.addScaledVector(n.vel,e),n.vel.multiplyScalar(1-Math.min(.9,1.8*e));const i=1-n.age/n.maxAge;this.positions[t*3+0]=n.pos.x,this.positions[t*3+1]=n.pos.y,this.positions[t*3+2]=n.pos.z,this.colors[t*3+0]=n.color.r*i,this.colors[t*3+1]=n.color.g*i,this.colors[t*3+2]=n.color.b*i}this.geom.attributes.position.needsUpdate=!0,this.geom.attributes.color.needsUpdate=!0}}const fi={aurelia_gtr:{id:"aurelia_gtr",name:"Aurelia GT-R",subtitle:"Mid-Engine Coastal GT Coupe · V8 High-Rev",engineType:"gt",mass:1340,wheelbase:2.68,frontAxleZ:-1.36,rearAxleZ:1.32,trackWidth:1.66,wheelRadius:.34,wheelWidth:.27,maxSteerRad:.44,engineForce:10200,topSpeedKmh:141,idleRpm:1050,redlineRpm:8400,maxRpm:8800,gearRatios:[3.25,2.22,1.64,1.28,1.04,.86],stats:{speed:94,handling:91,accel:92}},solara_corsa:{id:"solara_corsa",name:"Solara Corsa WB",subtitle:"Widebody Tarmac Coupe · Turbo Flat-4",engineType:"corsa",mass:1260,wheelbase:2.58,frontAxleZ:-1.3,rearAxleZ:1.28,trackWidth:1.72,wheelRadius:.335,wheelWidth:.28,maxSteerRad:.46,engineForce:9900,topSpeedKmh:138,idleRpm:950,redlineRpm:7600,maxRpm:8e3,gearRatios:[3.4,2.3,1.68,1.3,1.05,.88],stats:{speed:89,handling:96,accel:94}}},pi=[{id:"rosso_corsa",name:"Rosso Amalfi",number:"07",primaryHex:12852260,secondaryHex:16052454,accentHex:15119394,caliperHex:16761856,rimHex:2500912},{id:"bianco_perla",name:"Bianco Perla",number:"12",primaryHex:15461872,secondaryHex:1448224,accentHex:14231086,caliperHex:14231086,rimHex:1842980},{id:"azzurro_costa",name:"Azzurro Costa",number:"24",primaryHex:1730744,secondaryHex:16119802,accentHex:16747546,caliperHex:16742144,rimHex:13685980},{id:"giallo_sol",name:"Giallo Solare",number:"33",primaryHex:15247378,secondaryHex:1645343,accentHex:1645343,caliperHex:14231086,rimHex:2237739},{id:"verde_pineta",name:"Verde Pineta",number:"58",primaryHex:1596476,secondaryHex:15260085,accentHex:13935672,caliperHex:15251492,rimHex:12099696},{id:"argento_falesia",name:"Argento Falesia",number:"88",primaryHex:10134704,secondaryHex:1778220,accentHex:1684936,caliperHex:1684936,rimHex:2303790}];function pn(s,e=!0,t=0){const n=s.length,i=s[0].pts.length,r=[],a=[],o=[],l=h=>{const u=r.length/3;for(let d=0;d<n;d++){const f=s[d],g=d/(n-1);for(let v=0;v<i;v++){const[p,m]=f.pts[v];r.push(p*h,m,f.z),a.push(v/(i-1),g)}}for(let d=0;d<n-1;d++)for(let f=0;f<i-1;f++){const g=u+d*i+f,v=g+1,p=u+(d+1)*i+f,m=p+1;h===1?o.push(g,p,v,v,p,m):o.push(g,v,p,v,m,p)}if(t>0){const d=r.length/3;for(let f=0;f<n;f++){const g=s[f],v=f/(n-1);for(let p=0;p<i;p++){const[m,w]=g.pts[p];r.push(m*h*(1-t*.15),w-t,g.z),a.push(p/(i-1),v)}}for(let f=0;f<n-1;f++)for(let g=0;g<i-1;g++){const v=d+f*i+g,p=v+1,m=d+(f+1)*i+g,w=m+1;h===1?o.push(v,p,m,p,w,m):o.push(v,m,p,p,m,w)}}};l(1),e&&l(-1);const c=new xt;return c.setAttribute("position",new et(r,3)),c.setAttribute("uv",new et(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function Ql(s){const{wheelZ:e,wheelY:t,archRadius:n,outerHalfX:i,shoulderHalfX:r,topY:a,sillY:o,frontExtZ:l,rearExtZ:c,flareOut:h}=s,u=s.frontTopY??a,d=s.steps??36,f=[],g=[],v=[],p=[],m=[],w=[],y=-.14,x=Math.PI+.14,b=C=>{const M=f.length/3,S=i+h,D=5;for(let Q=0;Q<=d;Q++){const X=Q/d,te=y+X*(x-y),N=Math.cos(te),O=Math.sin(te),le=e+N*n,Se=Math.max(o,t+O*n);let Z,k;if(X<.22){const se=X/.22;Z=e+c,k=o+se*(a-o)}else if(X<=.78){const se=(X-.22)/.56;Z=e+c-se*(l+c);const Y=se*se;k=a+(u-a)*Y}else{const se=(X-.78)/.22;Z=e-l,k=u-se*(u-o)}const L=le*.58+Z*.42,F=Se*.58+k*.42,V=le*.22+Z*.78,ce=Se*.22+k*.78,ie=[[(S-.065)*C,Se-.008,le],[S*C,Se,le],[(i+h*.85)*C,F,L],[(i*.45+r*.55)*C,ce,V],[r*C,k,Z]];for(let se=0;se<D;se++)f.push(ie[se][0],ie[se][1],ie[se][2]),g.push(X,se/(D-1))}for(let Q=0;Q<d;Q++)for(let X=0;X<D-1;X++){const te=M+Q*D+X,N=te+1,O=M+(Q+1)*D+X,le=O+1;C===1?v.push(te,O,N,N,O,le):v.push(te,N,O,N,le,O)}const z=p.length/3,U=(S-.055)*C,H=.44*C,ee=n+.015;for(let Q=0;Q<=d;Q++){const X=Q/d,te=y+X*(x-y),N=e+Math.cos(te)*ee,O=Math.max(o,t+Math.sin(te)*ee);p.push(U,O,N),m.push(X,0),p.push(H,O,N),m.push(X,1)}for(let Q=0;Q<d;Q++){const X=z+Q*2,te=X+1,N=z+(Q+1)*2,O=N+1;C===1?w.push(X,te,N,te,O,N):w.push(X,N,te,te,N,O)}const W=p.length/3;p.push(H,t,e),m.push(.5,.5);for(let Q=0;Q<d;Q++){const X=z+Q*2+1,te=z+(Q+1)*2+1;C===1?w.push(W,X,te):w.push(W,te,X)}};b(1),b(-1);const E=new xt;E.setAttribute("position",new et(f,3)),E.setAttribute("uv",new et(g,2)),E.setIndex(v),E.computeVertexNormals();const _=new xt;return _.setAttribute("position",new et(p,3)),_.setAttribute("uv",new et(m,2)),_.setIndex(w),_.computeVertexNormals(),{fenderGeom:E,linerGeom:_}}function zg(s,e,t,n){const i=new pt,r=new pt,a=s.wheelRadius,o=s.wheelWidth,l=a*.67,c=e?-1:1,h=[new xe(l*.96,-o*.44),new xe(a*.86,-o*.5),new xe(a*.96,-o*.46),new xe(a,-o*.36),new xe(a,o*.36),new xe(a*.96,o*.46),new xe(a*.86,o*.5),new xe(l*.96,o*.44),new xe(l*.92,o*.38),new xe(l*.92,-o*.38),new xe(l*.96,-o*.44)],u=new Rr(h,36);u.rotateZ(Math.PI/2);const d=new Ee(u,n.tire);d.castShadow=!0,d.receiveShadow=!0,i.add(d);const f=[new xe(l*.95,-o*.43),new xe(l*.86,-o*.43),new xe(l*.83,-o*.12),new xe(l*.86,o*.34),new xe(l*.98,o*.43),new xe(l*1.01,o*.44),new xe(l*1.01,o*.39),new xe(l*.94,o*.35),new xe(l*.94,-o*.43)],g=new Rr(f,32);g.rotateZ(c>0?-Math.PI/2:Math.PI/2);const v=new Ee(g,n.rim);v.castShadow=!0,i.add(v);const p=new jn(l*.97,.012,12,32);p.rotateY(Math.PI/2);const m=new Ee(p,n.chrome);m.position.x=c*(o*.42),i.add(m);const w=new Qe(.056,.064,.065,20);w.rotateZ(Math.PI/2);const y=new Ee(w,n.rim);y.position.x=c*(o*.16),i.add(y);const x=new Qe(.032,.032,.025,16);x.rotateZ(Math.PI/2);const b=new Ee(x,n.chrome);b.position.x=c*(o*.21),i.add(b);const E=new Qe(.008,.008,.022,8);E.rotateZ(Math.PI/2);for(let H=0;H<5;H++){const ee=H/5*Math.PI*2,W=new Ee(E,n.chrome);W.position.set(c*(o*.2),Math.cos(ee)*.044,Math.sin(ee)*.044),i.add(W)}if(t){const ee=new Re(.024,l*.84,.021);for(let W=0;W<5;W++){const Q=W/5*Math.PI*2;for(const X of[-.21,.21]){const te=new Ee(ee,n.rim),N=Q+X*.55,O=l*.47;te.position.set(c*(o*.24),Math.cos(N)*O,Math.sin(N)*O),te.rotation.x=-(Q+X*.9),te.rotation.z=c*-.14,i.add(te)}}}else{const ee=new Re(.028,l*.85,.036);for(let W=0;W<6;W++){const Q=W/6*Math.PI*2,X=new Ee(ee,n.rim),te=l*.46;X.position.set(c*(o*.23),Math.cos(Q)*te,Math.sin(Q)*te),X.rotation.x=-Q,X.rotation.z=c*-.18,i.add(X)}}const _=l*.78,C=new Qe(_,_,.024,28);C.rotateZ(Math.PI/2);const M=new Ee(C,n.chrome);M.position.x=c*(o*.04),i.add(M);const S=new Qe(_*.46,_*.48,.042,20);S.rotateZ(Math.PI/2);const D=new Ee(S,n.carbon);D.position.x=c*(o*.05),i.add(D);const z=new Re(.068,.13,.088),U=new Ee(z,n.caliper);return U.position.set(c*(o*.045),.02,_*.72),r.add(U),{spinGroup:i,caliperGroup:r}}function Og(){const s=document.createElement("canvas");s.width=256,s.height=512;const e=s.getContext("2d");e.clearRect(0,0,256,512);const t=e.createRadialGradient(128,256,40,128,256,126);t.addColorStop(0,"rgba(0,0,0,0.88)"),t.addColorStop(.55,"rgba(0,0,0,0.68)"),t.addColorStop(.82,"rgba(0,0,0,0.22)"),t.addColorStop(1,"rgba(0,0,0,0.0)"),e.save(),e.scale(1,2),e.fillStyle=t,e.fillRect(0,0,256,256),e.restore();const n=new Nr(s);return n.colorSpace=Vt,n}function Bg(){const s=document.createElement("canvas");s.width=512,s.height=256;const e=s.getContext("2d"),t=new Nr(s);t.colorSpace=Vt;let n=-1;return{canvas:s,ctx:e,texture:t,draw:(r,a,o)=>{const l=Math.round(r.speedKmh)*1e4+Math.round(r.rpm/60)*100+r.gear*10+Math.round(r.nitro*20);if(l===n)return;n=l,e.fillStyle=o?"#060a12":"#0b1019",e.fillRect(0,0,512,256),e.strokeStyle="#243248",e.lineWidth=4,e.strokeRect(6,6,500,244);const c=Math.max(0,Math.min(1,r.rpm/a)),h=28;for(let u=0;u<h;u++){const d=u/(h-1),f=32+u*16.2,g=44-Math.sin(d*Math.PI)*18,v=d<=c;d>.82?e.fillStyle=v?"#ff2a3c":"#3a151c":d>.65?e.fillStyle=v?"#ffb020":"#382a14":e.fillStyle=v?"#2de0ff":"#162838",e.fillRect(f,g,12,26)}e.fillStyle="#152236",e.fillRect(216,86,80,96),e.strokeStyle=r.rpm>a*.88?"#ff3344":"#38bdf8",e.lineWidth=3,e.strokeRect(216,86,80,96),e.fillStyle="#ffffff",e.font='bold 64px "Segoe UI", system-ui, sans-serif',e.textAlign="center",e.textBaseline="middle",e.fillText(r.gear===0?"R":String(r.gear),256,136),e.fillStyle="#f8fafc",e.font='bold 62px "Segoe UI", system-ui, sans-serif',e.textAlign="right",e.fillText(String(Math.round(r.speedKmh)).padStart(3," "),194,132),e.fillStyle="#7dd3fc",e.font='bold 18px "Segoe UI", system-ui, sans-serif',e.fillText("KM/H",192,174),e.textAlign="left",e.fillStyle="#cbd5e1",e.font='bold 26px "Segoe UI", system-ui, sans-serif',e.fillText(`${Math.round(r.rpm)} RPM`,316,118),e.fillStyle="#94a3b8",e.font='bold 15px "Segoe UI", system-ui, sans-serif',e.fillText(r.nitroActive?"NITRO BOOST":"NITRO",316,152),e.fillStyle="#142030",e.fillRect(316,162,164,22),e.fillStyle=r.nitroActive?"#ff9d2e":"#00e5ff",e.fillRect(318,164,Math.round(160*Math.max(0,Math.min(1,r.nitro))),18),e.fillStyle="#64748b",e.font='bold 14px "Segoe UI", system-ui, sans-serif',e.textAlign="center",e.fillText("COSTA DORADA TELEMETRY  ·  TC SPORT",256,222),t.needsUpdate=!0}}}function Aa(s,e,t,n){const i=s.id==="aurelia_gtr",r=new pt;r.name=`car_${s.id}_${e.number}`;const a=new pt;a.name="chassis",r.add(a);const o=new In({color:e.primaryHex,metalness:.62,roughness:.16,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.55}),l=new In({color:e.secondaryHex,metalness:.48,roughness:.2,clearcoat:.95,clearcoatRoughness:.06,envMapIntensity:1.4}),c=new In({color:e.accentHex,metalness:.55,roughness:.22,clearcoat:.9}),h=new Xe({color:1447964,metalness:.24,roughness:.38,envMapIntensity:1.1}),u=new Xe({color:723982,metalness:.05,roughness:.92}),d=new In({color:1318955,metalness:.08,roughness:.05,clearcoat:1,clearcoatRoughness:.04,transparent:!0,opacity:.4,envMapIntensity:1.9,depthWrite:!1}),f=new Xe({color:15133423,metalness:.94,roughness:.11,envMapIntensity:1.5}),g=new Xe({color:e.rimHex,metalness:.84,roughness:.22,envMapIntensity:1.35}),v=new In({color:e.caliperHex,metalness:.35,roughness:.25,clearcoat:.8}),p=new Xe({color:2105894,map:t.map,normalMap:t.normalMap,normalScale:new xe(1.1,1.1),roughnessMap:t.roughnessMap,roughness:.86,metalness:.03}),m=new Xe({color:16317439,emissive:new ze(16774624),emissiveIntensity:1.4,roughness:.12,metalness:.2}),w=new Xe({color:11144212,emissive:new ze(16716828),emissiveIntensity:1.1,roughness:.15,metalness:.15}),y=new Xe({color:1119e3,roughness:.92,metalness:.04,envMapIntensity:.55}),x=new Xe({color:2896704,roughness:.42,metalness:.52}),b=(ye,A,G,ae=!0,de=!0)=>{const K=new Ee(A,G);return K.castShadow=ae,K.receiveShadow=de,ye.add(K),K},E=s.trackWidth*.5,_=E+s.wheelWidth*.5+(i?.045:.068),C=s.wheelRadius+.095,M=i?.2:.22,S=i?-2.26:-2.14,D=i?2.24:2.12,z=i?.84:.9,U=i?1.22:1.31,H=new Re(1.16,.14,D-S-.36);b(a,H,h).position.set(0,M+.06,(S+D)*.5);const W=Ql({wheelZ:s.frontAxleZ,wheelY:s.wheelRadius+.02,archRadius:C,outerHalfX:_-.02,shoulderHalfX:i?.71:.75,topY:i?.8:.87,frontTopY:i?.57:.64,sillY:M,frontExtZ:Math.abs(S-s.frontAxleZ)-.16,rearExtZ:.62,flareOut:i?.035:.062,steps:40});b(a,W.fenderGeom,o),b(a,W.linerGeom,u,!1,!0);const Q=Ql({wheelZ:s.rearAxleZ,wheelY:s.wheelRadius+.02,archRadius:C+.01,outerHalfX:_+(i?.01:.025),shoulderHalfX:i?.75:.77,topY:z+(i?.04:.03),sillY:M,frontExtZ:.62,rearExtZ:Math.abs(D-s.rearAxleZ)-.14,flareOut:i?.045:.072,steps:40});b(a,Q.fenderGeom,o),b(a,Q.linerGeom,u,!1,!0);const X=i?[{z:S+.14,pts:[[0,.5],[.24,.51],[.54,.54],[.7,.56]]},{z:-1.78,pts:[[0,.62],[.22,.61],[.46,.66],[.71,.68]]},{z:-1.35,pts:[[0,.71],[.2,.7],[.45,.75],[.71,.77]]},{z:-.92,pts:[[0,.78],[.22,.77],[.48,.8],[.71,.79]]},{z:-.66,pts:[[0,.81],[.26,.81],[.54,.81],[.71,.8]]}]:[{z:S+.12,pts:[[0,.64],[.26,.64],[.56,.63],[.75,.62]]},{z:-1.72,pts:[[0,.79],[.24,.78],[.48,.76],[.75,.75]]},{z:-1.25,pts:[[0,.88],[.26,.87],[.48,.84],[.75,.83]]},{z:-.82,pts:[[0,.9],[.28,.89],[.52,.87],[.75,.86]]},{z:-.58,pts:[[0,.9],[.3,.9],[.56,.88],[.75,.87]]}];b(a,pn(X,!0,.02),o);const te=X.map(ye=>({z:ye.z,pts:[[.04,ye.pts[0][1]+.004],[.18,ye.pts[1][1]+.004]]}));b(a,pn(te,!0),l,!1,!0);const N=new Re(.24,.03,.34);for(const ye of[-1,1]){const A=b(a,N,h);A.position.set(ye*(i?.36:.32),i?.71:.86,i?-1.42:-1.3),A.rotation.x=i?.16:.1}const O=s.frontAxleZ+.62,le=s.rearAxleZ-.62,Se=[{z:O,pts:[[_-.07,M],[_-.01,M+.18],[_-.03,z-.18],[_-.08,z-.02],[i?.72:.76,z]]},{z:(O+le)*.5,pts:[[_-.09,M],[_-.04,M+.2],[_-.07,z-.18],[_-.1,z-.02],[i?.71:.75,z]]},{z:le,pts:[[_-.06,M],[_+.01,M+.18],[_-.01,z-.16],[_-.06,z],[i?.75:.77,z+.03]]}];b(a,pn(Se,!0,.03),o);const Z=new Re(.14,.08,le-O+.24);for(const ye of[-1,1]){b(a,Z,h).position.set(ye*(_-.02),M+.02,(O+le)*.5);const G=b(a,new Re(.1,.28,.36),h);G.position.set(ye*(_-.05),M+.34,le-.12),G.rotation.y=ye*(i?-.18:-.08)}const k=[{z:S-.05,pts:[[0,M+.05],[.36,M+.055],[.64,M+.08],[_-.14,M+.12]]},{z:S-.07,pts:[[0,M+.16],[.42,M+.16],[.72,M+.18],[_-.06,M+.21]]},{z:S-.03,pts:[[0,.41],[.45,.415],[.75,.43],[_-.02,.44]]},{z:S+.14,pts:[[0,i?.505:.64],[.44,i?.525:.64],[.72,i?.565:.635],[_-.015,i?.555:.61]]},{z:S+.34,pts:[[0,i?.58:.72],[.42,i?.595:.715],[.71,i?.64:.7],[_-.01,i?.62:.68]]}];b(a,pn(k,!0),o);const L=pn([{z:S-.02,pts:[[_-.14,M+.08],[_-.06,.42],[.72,i?.54:.62]]},{z:S+.18,pts:[[_-.03,M+.04],[_+.01,.44],[.72,i?.57:.64]]},{z:s.frontAxleZ-C+.02,pts:[[_-.01,M],[_+.015,.44],[.72,i?.6:.66]]}],!0);b(a,L,o);const F=[{z:S-.13,pts:[[0,M+.01],[.46,M+.01],[.76,M+.02]]},{z:S-.04,pts:[[0,M+.012],[.54,M+.012],[_-.04,M+.02]]},{z:S+.26,pts:[[0,M+.015],[.62,M+.015],[_-.01,M+.022]]}];b(a,pn(F,!0,.028),h);const V=new Re(.96,.14,.06);b(a,V,u).position.set(0,M+.14,S-.025);for(const ye of[-1,1]){const A=b(a,new Re(.28,.12,.06),u);A.position.set(ye*.64,M+.15,S+.01),A.rotation.y=ye*-.24}b(a,new Re(1.24,.014,.026),c).position.set(0,M+.022,S-.115);const se=[];for(const ye of[-1,1])if(i){const A=b(a,new Re(.32,.068,.22),u);A.position.set(ye*.62,.485,S+.09),A.rotation.set(.24,ye*-.26,ye*.1);const G=b(a,new Re(.3,.02,.03),m,!1,!1);G.position.set(ye*.62,.506,S+.015),G.rotation.set(.22,ye*-.26,ye*.1),se.push(G);const ae=b(a,new Re(.2,.018,.028),m,!1,!1);ae.position.set(ye*.65,.472,S-.005),ae.rotation.set(.16,ye*-.28,ye*.06),se.push(ae);const de=b(a,new Kn(.028,14,10),m,!1,!1);de.position.set(ye*.58,.49,S+.025),se.push(de)}else{const A=b(a,new Qe(.105,.115,.09,24),h);A.rotation.x=Math.PI/2,A.position.set(ye*.65,.61,S+.07);const G=b(a,new Qe(.086,.086,.03,24),m,!1,!1);G.rotation.x=Math.PI/2,G.position.set(ye*.65,.61,S+.03),se.push(G);const ae=b(a,new Re(.2,.032,.04),m,!1,!1);ae.position.set(ye*.65,M+.18,S-.02),se.push(ae)}const Y=i?-.24:-.14,ne=i?.84:1.02,R=i?.58:.63,fe=[{z:Y,pts:[[0,U],[R*.55,U-.015],[R,U-.045]]},{z:(Y+ne)*.5,pts:[[0,U+.02],[R*.58,U+.005],[R+.02,U-.035]]},{z:ne,pts:[[0,U-.03],[R*.55,U-.045],[R,U-.08]]}];b(a,pn(fe,!0,.025),i?h:o);const ue=i?[{z:ne,pts:[[0,U-.04],[.46,U-.07],[.75,z+.04]]},{z:1.56,pts:[[0,z+.14],[.52,z+.11],[.76,z+.04]]},{z:D-.12,pts:[[0,z+.04],[.55,z+.03],[.78,z+.01]]}]:[{z:ne,pts:[[0,U-.05],[.52,U-.08],[.77,z+.03]]},{z:1.55,pts:[[0,z+.14],[.56,z+.11],[.78,z+.04]]},{z:D-.1,pts:[[0,z+.1],[.58,z+.08],[.78,z+.03]]}];b(a,pn(ue,!0,.02),o);const Te=(ye,A,G,ae)=>{for(const de of[-1,1]){const K=new I(ye.x*de,ye.y,ye.z),_e=new I(A.x*de,A.y,A.z),Ue=new I().subVectors(_e,K),Be=Ue.length(),He=new Qe(G,G*1.15,Be,10),je=b(a,He,ae);je.position.copy(K).addScaledVector(Ue,.5),je.quaternion.setFromUnitVectors(new I(0,1,0),Ue.normalize())}};Te(new I(.7,z-.02,-.68),new I(R,U-.045,Y),.026,h),Te(new I(.73,z,.42),new I(R+.01,U-.04,.46),.024,h),Te(new I(.74,z+.02,1.48),new I(R,U-.075,ne),i?.045:.052,o);const j=[{z:-.68,pts:[[0,z-.01],[.36,z-.015],[.69,z-.03]]},{z:(Y-.68)*.5,pts:[[0,(z+U)*.5+.01],[.34,(z+U)*.5],[.64,(z+U)*.5-.03]]},{z:Y,pts:[[0,U-.01],[.31,U-.02],[R-.01,U-.048]]}];b(a,pn(j,!0),d,!1,!1);const J=[{z:-.58,pts:[[.7,z-.02],[R+.02,U-.055]]},{z:.25,pts:[[.72,z],[R+.015,U-.04]]},{z:ne+.08,pts:[[.74,z+.02],[R,U-.075]]}];b(a,pn(J,!0),d,!1,!1);for(const ye of[-1,1]){const A=b(a,new Qe(.012,.018,.14,10),h);A.position.set(ye*.77,z+.045,-.42),A.rotation.z=ye*-1.05,A.rotation.y=ye*-.25;const G=b(a,new Kn(.075,16,12),o);G.scale.set(1.22,.56,.92),G.position.set(ye*.85,z+.075,-.4),G.rotation.y=ye*-.18;const ae=b(a,new No(.044,16),f,!1,!1);ae.scale.set(1.32,.7,1),ae.position.set(ye*.85,z+.075,-.32)}const re=[{z:D-.18,pts:[[0,z+.04],[.54,z+.03],[.78,z+.01],[_-.02,z-.02]]},{z:D-.02,pts:[[0,z-.04],[.54,z-.045],[.8,z-.06],[_-.05,z-.09]]},{z:D+.01,pts:[[0,M+.36],[.56,M+.35],[.82,M+.34],[_-.06,M+.32]]},{z:D-.06,pts:[[0,M+.14],[.56,M+.14],[.8,M+.15],[_-.1,M+.16]]}];b(a,pn(re,!0),o),b(a,new Re(1.48,.17,.08),u).position.set(0,z-.15,D-.02),b(a,new Re(1.52,.22,.26),h).position.set(0,M+.12,D-.1);for(let ye=-2;ye<=2;ye++)b(a,new Re(.025,.2,.28),h).position.set(ye*.28,M+.11,D-.04);const $=[],oe=i?[-.52,-.38,.38,.52]:[-.46,.46],pe=new ji({color:5626111,transparent:!0,opacity:0,blending:Rs,depthWrite:!1});for(const ye of oe){const A=b(a,new Qe(.042,.046,.16,16),f);A.rotation.x=Math.PI/2,A.position.set(ye,M+.14,D+.03);const G=new Ee(new mi(.055,.58,12),pe.clone());G.rotation.x=Math.PI/2,G.position.set(ye,M+.14,D+.36),G.visible=!1,a.add(G),$.push(G)}if(i){b(a,new Re(1.58,.048,.06),w,!1,!1).position.set(0,z-.06,D+.01);for(const A of[-1,1])b(a,new Re(.36,.085,.07),w,!1,!1).position.set(A*.64,z-.06,D+.015)}else for(const ye of[-.66,-.46,.46,.66])b(a,new jn(.062,.018,12,24),w,!1,!1).position.set(ye,z-.08,D+.015);if(i){const ye=b(a,new Re(1.78,.042,.28),h);ye.position.set(0,z+.32,D-.06),ye.rotation.x=.08;for(const A of[-1,1]){b(a,new Re(.025,.2,.34),o).position.set(A*.89,z+.3,D-.06);const ae=b(a,new Re(.028,.32,.14),h);ae.position.set(A*.38,z+.16,D-.12),ae.rotation.x=-.22}}else{const ye=b(a,new Re(1.62,.11,.22),o);ye.position.set(0,z+.14,D-.08),ye.rotation.x=.26;const A=b(a,new Re(1.24,.055,.18),h);A.position.set(0,U-.04,ne+.06),A.rotation.x=.14}b(a,new Re(.42,.11,.02),l,!1,!1).position.set(0,M+.31,D+.01);const Ae=new pt;Ae.name="cockpit_interior",a.add(Ae),b(Ae,new Re(1.36,.24,.44),y,!1,!0).position.set(0,z-.11,-.52),b(Ae,new Re(1.34,.05,.46),h,!1,!0).position.set(0,z+.01,-.53),b(Ae,new Re(.42,.16,.22),y,!1,!0).position.set(-.36,z+.082,-.5);const we=Bg(),Ie=new ji({map:we.texture}),ke=new Ee(new $t(.35,.148),Ie);ke.name="cockpit_instrument_cluster",ke.position.set(-.36,z+.072,-.386),ke.rotation.x=-.1,Ae.add(ke),b(Ae,new Re(.24,.26,1.15),y,!1,!0).position.set(0,M+.24,.02),b(Ae,new Re(.18,.02,.92),x,!1,!1).position.set(0,M+.375,.02),b(Ae,new Qe(.012,.016,.16,10),f,!1,!1).position.set(0,M+.44,-.1),b(Ae,new Kn(.028,12,10),c,!1,!1).position.set(0,M+.52,-.1),b(Ae,new Qe(.008,.008,.07,8),h,!1,!1).position.set(0,U-.08,Y-.05),b(Ae,new Re(.22,.055,.03),h,!1,!1).position.set(0,U-.115,Y-.05);for(const ye of[-.36,.36]){b(Ae,new Re(.44,.1,.46),y,!1,!0).position.set(ye,M+.18,.24);const G=b(Ae,new Re(.42,.62,.1),y,!1,!0);G.position.set(ye,M+.5,.46),G.rotation.x=-.2;const ae=b(Ae,new Re(.24,.18,.09),c,!1,!0);ae.position.set(ye,M+.84,.52),ae.rotation.x=-.15;for(const de of[-.21,.21]){const K=b(Ae,new Re(.07,.42,.14),x,!1,!1);K.position.set(ye+de,M+.42,.41),K.rotation.x=-.2}}const Ce=new pt;Ce.position.set(-.36,z-.078,-.23),Ce.rotation.x=-.22,Ae.add(Ce);const ge=b(Ce,new Qe(.028,.034,.24,12),h,!1,!1);ge.rotation.x=Math.PI/2,ge.position.z=-.12;const me=new pt;me.name="steering_wheel_pivot",Ce.add(me),b(me,new jn(.148,.0145,16,40),y,!1,!1),b(me,new Re(.018,.033,.033),c,!1,!1).position.set(0,.148,0);const Le=b(me,new Qe(.044,.048,.032,18),h,!1,!1);Le.rotation.x=Math.PI/2;const Ve=b(me,new Qe(.018,.018,.036,16),c,!1,!1);Ve.rotation.x=Math.PI/2;const st=b(me,new Re(.115,.022,.014),x,!1,!1);st.position.set(-.08,-.012,-.005),st.rotation.z=.14;const lt=b(me,new Re(.115,.022,.014),x,!1,!1);lt.position.set(.08,-.012,-.005),lt.rotation.z=-.14,b(me,new Re(.028,.115,.014),x,!1,!1).position.set(0,-.085,-.005);for(const ye of[-1,1])b(me,new Re(.02,.068,.007),f,!1,!1).position.set(ye*.095,.02,-.028);const bt=new At;bt.name="cockpit_camera_anchor",bt.position.set(-.36,i?1.055:1.135,.12),a.add(bt);const yt=[],Rt=[],en=[],ln=[[-E,s.wheelRadius,s.frontAxleZ,!0],[E,s.wheelRadius,s.frontAxleZ,!1],[-E,s.wheelRadius,s.rearAxleZ,!0],[E,s.wheelRadius,s.rearAxleZ,!1]];for(let ye=0;ye<4;ye++){const[A,G,ae,de]=ln[ye],K=new pt;K.name=`wheel_mount_${ye}`,K.position.set(A,G,ae),a.add(K);const _e=new pt;_e.name=`wheel_steer_${ye}`,K.add(_e);const{spinGroup:Ue,caliperGroup:Be}=zg(s,de,i,{tire:p,rim:g,chrome:f,caliper:v,carbon:h});Ue.name=`wheel_spin_${ye}`,_e.add(Ue),_e.add(Be),yt.push(K),Rt.push(_e),en.push(Ue)}const On=new ji({map:Og(),transparent:!0,opacity:.78,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),xn=new Ee(new $t(_*2.28,(D-S)*1.08),On);xn.name="car_contact_shadow",xn.rotation.x=-Math.PI/2,xn.position.set(0,.03,(S+D)*.5),a.add(xn);const Ai=[];if(n)for(const ye of[-1,1]){const A=new bd(16774365,0,125,Math.PI/4.2,.62,1.25);A.position.set(ye*.64,.62,S+.02);const G=new At;G.position.set(ye*.9,-.25,S-36),a.add(G),A.target=G,A.castShadow=!1,A.visible=!1,a.add(A),Ai.push(A)}let kt=null;n&&(kt=new gi(16718370,0,16,1.5),kt.position.set(0,.68,D+.65),kt.visible=!1,a.add(kt));let bn=0;const cn=new Set;r.traverse(ye=>{if(ye instanceof Ee){const A=ye.geometry;A.index?bn+=A.index.count/3:A.attributes.position&&(bn+=A.attributes.position.count/3),Array.isArray(ye.material)?ye.material.forEach(G=>cn.add(G)):cn.add(ye.material)}});const ls=new Qe(.014,.014,.34,8);ls.rotateZ(Math.PI/2);const Bs=new jn(.036,.008,8,16);for(let ye=0;ye<4;ye++){const[A,G,ae]=ln[ye],de=A<0?1:-1;for(const K of[-.05,.06])b(a,ls,h,!1,!1).position.set(A+de*.2,G+K,ae);for(let K=0;K<5;K++){const _e=b(a,Bs,c,!1,!1);_e.rotation.x=Math.PI/2,_e.position.set(A+de*.16,G+.12+K*.028,ae)}}for(let ye=0;ye<5;ye++)b(a,new Re(1.12,.012,.04),h,!1,!1).position.set(0,M+.1+ye*.036,S-.02);for(const ye of en)Cs(ye);Cs(Ae,new Set([Ce,ke])),Cs(a,new Set([...yt,Ae,...$,xn])),bn=0,cn.clear(),r.traverse(ye=>{if(ye instanceof Ee){const A=ye.geometry;A.index?bn+=A.index.count/3:A.attributes.position&&(bn+=A.attributes.position.count/3),Array.isArray(ye.material)?ye.material.forEach(G=>cn.add(G)):cn.add(ye.material)}});let cs=!1;const Hr=(ye,A,G)=>{r.position.lerpVectors(ye.prevPos,ye.pos,A),r.quaternion.slerpQuaternions(ye.prevQuat,ye.quat,A);for(let K=0;K<4;K++){const _e=ye.wheels[K];yt[K].position.set(_e.mountX,_e.mountY+_e.suspensionOffset,_e.mountZ),Rt[K].rotation.y=_e.steerYaw,en[K].rotation.x=_e.spinPitch}me.rotation.z=-ye.telemetry.steerVisualNorm*1.48;const ae=cs?3.2:1.1;w.emissiveIntensity=ye.telemetry.isBraking?ae+4.5:ae,kt&&kt.visible&&(kt.intensity=ye.telemetry.isBraking?6.5:2.6);const de=ye.telemetry.nitroActive;for(let K=0;K<$.length;K++){const _e=$[K];if(_e.visible=de,de){const Ue=.8+.38*Math.sin(G*52+K*2.1);_e.scale.set(1,Ue,1),_e.material.opacity=.72*Ue}}we.draw(ye.telemetry,ye.spec.maxRpm,cs)},Gr=(ye,A)=>{cs=ye,m.emissiveIntensity=ye?4.2:1.35,w.emissiveIntensity=ye?3.2:1.15;for(const G of Ai)G.visible=ye&&A,G.intensity=ye&&A?235:0;kt&&(kt.visible=ye&&A,kt.intensity=ye?5.5:0)},Vr=ye=>{d.opacity=ye?.16:.4},Wr=()=>{var ye;r.traverse(A=>{A instanceof Ee&&A.geometry.dispose()}),we.texture.dispose(),(ye=On.map)==null||ye.dispose(),On.dispose(),Ie.dispose()};return{root:r,chassisGroup:a,wheelMounts:yt,steerPivots:Rt,spinHubs:en,steeringWheelPivot:me,cockpitCameraAnchor:bt,cockpitGroup:Ae,headlights:Ai,headlightGlowMeshes:se,brakeLightMat:w,headlightMat:m,tailBounceLight:kt,exhaustFlames:$,contactShadowMesh:xn,triangleCount:Math.round(bn),materialCount:cn.size,updateFromPhysics:Hr,setNightLights:Gr,setCockpitVisible:Vr,dispose:Wr}}class Jl{constructor(e,t,n){B(this,"id");B(this,"spec");B(this,"isPlayer");B(this,"pos",new I);B(this,"vel",new I);B(this,"quat",new yi);B(this,"prevPos",new I);B(this,"prevQuat",new yi);B(this,"yaw",0);B(this,"yawRate",0);B(this,"roadPitch",0);B(this,"roadRoll",0);B(this,"bodyPitch",0);B(this,"bodyRoll",0);B(this,"verticalVel",0);B(this,"grounded",!0);B(this,"gear",1);B(this,"rpm",1050);B(this,"shiftCutTimer",0);B(this,"nitro",.8);B(this,"nitroActive",!1);B(this,"steerSmoothed",0);B(this,"splineS",0);B(this,"splineLateral",0);B(this,"lap",1);B(this,"nextCheckpoint",1);B(this,"checkpointsPassed",0);B(this,"totalProgress",0);B(this,"lapStartTime",0);B(this,"currentLapTime",0);B(this,"bestLapTime",1/0);B(this,"finished",!1);B(this,"finishTime",0);B(this,"stuckTimer",0);B(this,"offTrackTimer",0);B(this,"safetyResetCount",0);B(this,"underTerrainResets",0);B(this,"outOfWorldResets",0);B(this,"maxWheelAirGap",0);B(this,"safetyLog",[]);B(this,"wheels");B(this,"telemetry",{speedKmh:0,rpm:1050,gear:1,nitro:.8,nitroActive:!1,steerVisualNorm:0,throttle:0,brake:0,lateralG:0,tireSlip:0,surface:"asphalt",isBraking:!1,onBridge:!1,justShifted:!1,shiftDir:0,impactStrength:0,scrapeIntensity:0,revLimiterHit:!1});B(this,"tmpHit",{hit:!0,y:0,normal:new I(0,1,0),surface:"asphalt"});B(this,"tmpFwd",new I);B(this,"tmpRight",new I);B(this,"tmpUp",new I);B(this,"tmpEuler",new gn(0,0,0,"YXZ"));B(this,"avgNormal",new I(0,1,0));this.id=e,this.spec=t,this.isPlayer=n,this.rpm=t.idleRpm;const i=t.trackWidth*.5,r=t.wheelRadius;this.wheels=[this.makeWheel(-i,r,t.frontAxleZ,!0),this.makeWheel(i,r,t.frontAxleZ,!0),this.makeWheel(-i,r,t.rearAxleZ,!1),this.makeWheel(i,r,t.rearAxleZ,!1)]}makeWheel(e,t,n,i){return{mountX:e,mountY:t,mountZ:n,isFront:i,suspensionOffset:0,steerYaw:0,spinPitch:0,grounded:!0,surface:"asphalt",contactY:0,airGap:0,slipRatio:0}}spawnAtSpline(e,t,n){const i=e.track.sampleAtS(t),r=i.pos.x+i.flatRight.x*n,a=i.pos.z+i.flatRight.z*n,o=e.raycastDown(r,i.pos.y+4,a,this.tmpHit);this.pos.set(r,o.y,a),this.vel.set(0,0,0),this.yaw=Math.atan2(-i.tangent.x,-i.tangent.z),this.yawRate=0,this.roadPitch=Math.asin(Ge(i.tangent.y,-.35,.35)),this.roadRoll=-i.bankRad,this.bodyPitch=0,this.bodyRoll=0,this.verticalVel=0,this.grounded=!0,this.gear=1,this.rpm=this.spec.idleRpm,this.shiftCutTimer=0,this.nitro=.8,this.nitroActive=!1,this.steerSmoothed=0,this.splineS=e.track.wrapS(t),this.splineLateral=n,this.stuckTimer=0,this.offTrackTimer=0,this.updateOrientationQuaternion(),this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat);for(const l of this.wheels)l.suspensionOffset=0,l.steerYaw=0,l.grounded=!0,l.contactY=o.y,l.airGap=0,l.surface=o.surface}updateOrientationQuaternion(){this.tmpEuler.set(this.roadPitch+this.bodyPitch,this.yaw,this.roadRoll+this.bodyRoll,"YXZ"),this.quat.setFromEuler(this.tmpEuler)}step(e,t,n,i,r=!0){this.prevPos.copy(this.pos),this.prevQuat.copy(this.quat),this.telemetry.justShifted=!1,this.telemetry.shiftDir=0,this.telemetry.impactStrength=0,this.telemetry.scrapeIntensity=0,this.telemetry.revLimiterHit=!1;const a=r?Ge(t.throttle,0,1):0,o=r?Ge(t.brake,0,1):1,l=r?Ge(t.steer,-1,1):0,c=Math.sin(this.yaw),h=Math.cos(this.yaw),u=-c,d=-h,f=h,g=-c,v=this.vel.x*u+this.vel.z*d,p=this.vel.x*f+this.vel.z*g,m=Math.hypot(v,p),w=m*3.6,y=Math.abs(l)>Math.abs(this.steerSmoothed)?8.5:11;this.steerSmoothed+=(l-this.steerSmoothed)*Math.min(1,y*e);const x=w<=60?1:St(1,.34,Ge((w-60)/160,0,1)),b=this.steerSmoothed*this.spec.maxSteerRad*x;let E=0,_=0;this.avgNormal.set(0,0,0);let C="asphalt";const M={bridge:5,asphalt:4,curb:3,gravel:2,sand:1,grass:0};let S=-1;const D=this.spec.wheelbase,z=this.spec.trackWidth;let U=-b,H=-b;if(Math.abs(b)>.005){const De=D/Math.tan(Math.abs(b)),be=Math.atan(D/Math.max(1.2,De-z*.5)),We=Math.atan(D/(De+z*.5)),Oe=Math.min(this.spec.maxSteerRad,be),Ke=Math.min(this.spec.maxSteerRad,We);b>0?(H=-Oe,U=-Ke):(U=Oe,H=Ke)}for(let De=0;De<4;De++){const be=this.wheels[De],We=this.pos.x+f*be.mountX-u*be.mountZ,Oe=this.pos.z+g*be.mountX-d*be.mountZ,Ke=n.raycastDown(We,this.pos.y+1.8,Oe,this.tmpHit);be.contactY=Ke.y,be.surface=Ke.surface;const q=Ke.y-this.pos.y;if(be.airGap=Math.max(0,-q),be.airGap>this.maxWheelAirGap&&(this.maxWheelAirGap=be.airGap),q>-.28){be.grounded=!0,E++,_+=Ke.y,this.avgNormal.add(Ke.normal);const Ce=Ge(q*.65,-.06,.08);be.suspensionOffset=St(be.suspensionOffset,Ce,Math.min(1,22*e))}else be.grounded=!1,be.suspensionOffset=St(be.suspensionOffset,-.065,Math.min(1,14*e));be.isFront?be.steerYaw=De===0?U:H:be.steerYaw=0,be.spinPitch-=v/this.spec.wheelRadius*e,M[be.surface]>S&&(S=M[be.surface],C=be.surface)}this.grounded=E>=2,E>0?(_/=E,this.avgNormal.normalize()):this.avgNormal.set(0,1,0);const ee=n.raycastDown(this.pos.x,this.pos.y+1.8,this.pos.z,this.tmpHit),W=E>0?Math.max(_,ee.y):ee.y;this.pos.y<=W+.14&&this.verticalVel<=1.2?(this.pos.y=St(this.pos.y,W,Math.min(1,30*e)),this.pos.y<W&&(this.pos.y=W),this.verticalVel=0,this.grounded=!0):(this.verticalVel-=18.5*e,this.pos.y+=this.verticalVel*e,this.pos.y<W&&(this.pos.y=W,this.verticalVel=0,this.grounded=!0));let Q=1,X=.015;C==="curb"?(Q=.96,X=.022):C==="gravel"?(Q=.78,X=.055):C==="sand"?(Q=.7,X=.095):C==="grass"&&(Q=.74,X=.075);const te=r&&t.nitro&&a>.15&&this.nitro>.015&&v>4;if(this.nitroActive=te,this.nitroActive)this.nitro=Math.max(0,this.nitro-.28*e);else if(r&&this.grounded&&(C==="asphalt"||C==="bridge"||C==="curb")&&w>55){const be=this.telemetry.tireSlip>.18?.15:0;this.nitro=Math.min(1,this.nitro+(.042+be)*e)}const N=this.spec,O=(N.topSpeedKmh+(this.nitroActive?20:0))/3.6;this.shiftCutTimer>0&&(this.shiftCutTimer=Math.max(0,this.shiftCutTimer-e));let le=!1;if(o>.2&&v<.8&&a<.1)le=!0,this.gear=0;else{this.gear===0&&(this.gear=1);const De=4.45,be=Math.max(0,v)/(2*Math.PI*N.wheelRadius)*60,We=be*N.gearRatios[this.gear-1]*De;(r?Math.max(N.idleRpm+a*1900,We):N.idleRpm+t.throttle*4200)>N.redlineRpm*.96&&this.gear<N.gearRatios.length&&v>8?(this.gear++,this.shiftCutTimer=.095,this.telemetry.justShifted=!0,this.telemetry.shiftDir=1):We<N.redlineRpm*.44&&this.gear>1&&(this.gear--,this.shiftCutTimer=.05,this.telemetry.justShifted=!0,this.telemetry.shiftDir=-1);const Ke=be*N.gearRatios[this.gear-1]*De,q=r?Ge(Math.max(N.idleRpm+a*1400,Ke),N.idleRpm,N.maxRpm):Ge(N.idleRpm+t.throttle*4800,N.idleRpm,N.redlineRpm),Ce=q>this.rpm?12:9;this.rpm+=(q-this.rpm)*Math.min(1,Ce*e),this.rpm>=N.maxRpm-120&&a>.5&&(this.telemetry.revLimiterHit=!0,this.rpm-=260)}let Se=0;if(this.grounded){if(le)Se=-N.engineForce*.45*o,v<-14&&(Se=0);else{const be=Ge((this.rpm-N.idleRpm)/(N.redlineRpm-N.idleRpm),0,1),We=.72+.34*Math.sin(be*Math.PI*.85),Oe=.62+.28*(N.gearRatios[Math.max(0,this.gear-1)]/2.2),Ke=Ge(1-Math.pow(Math.max(0,v)/O,2.6),0,1),q=this.shiftCutTimer>0?.15:1,Ce=this.nitroActive?1.24:1,ge=a*N.engineForce*We*Oe*Ke*q*Ce*Q,me=o*N.mass*20.5*Q*Math.sign(v);Se=ge-(Math.abs(v)>.25?me:0),a<.05&&Math.abs(v)>.5&&(Se-=Math.sign(v)*N.mass*1.4)}const De=Ge(this.avgNormal.x*u+this.avgNormal.z*d,-.25,.25);Se+=N.mass*9.81*De}const Z=.48*v*Math.abs(v),k=N.mass*9.81*X*Math.sign(v)*(Math.abs(v)>.1?1:0);Se-=Z+k;const L=Math.abs(N.frontAxleZ),F=Math.abs(N.rearAxleZ),V=N.mass*9.81*(F/(L+F)),ce=N.mass*9.81*(L/(L+F)),ie=1.62*Q;let se=0,Y=0,ne=0;if(this.grounded&&m>.35){const De=-this.yawRate,be=Math.max(Math.abs(v),2.5),We=v>=0?1:-1,Oe=p+De*L,Ke=p-De*F,q=We*b-Math.atan2(Oe,be),Ce=-Math.atan2(Ke,be),ge=(bt,yt,Rt,en)=>yt*ie*en*Math.sin(1.38*Math.atan(Rt*bt)),me=o*.14,Pe=V*(1+me),Le=ce*(1-me*.9),Ve=ge(q,Pe,7.6,1.03),st=ge(Ce,Le,8.2,1.02),lt=-De*N.mass*1.15;se=Ve+st,Y=-(L*Ve-F*st+lt),ne=Ge(Math.max(Math.abs(q),Math.abs(Ce))/.45,0,1)}else this.grounded&&(se=-p*N.mass*12,this.yawRate*=Math.max(0,1-12*e));const R=Se/N.mass,fe=se/N.mass,ue=v+R*e,Te=p+fe*e,j=Math.abs(ue)<.12&&a<.05&&o>.2?0:ue;this.vel.x=u*j+f*Te,this.vel.z=d*j+g*Te;const J=N.mass*(L*L+F*F)*.68;this.yawRate+=Y/J*e,this.yawRate=Ge(this.yawRate,-2.6,2.6),this.yaw+=this.yawRate*e,this.pos.x+=this.vel.x*e,this.pos.z+=this.vel.z*e;const re=n.resolveHorizontalCollision(this.pos.x,this.pos.y,this.pos.z,1.05);if(re.hit){this.pos.x+=re.pushX,this.pos.z+=re.pushZ;const De=this.vel.x*re.nx+this.vel.z*re.nz;if(De<0){const be=-De;this.telemetry.impactStrength=Ge((be-1.5)/18,0,1);const We=.28;this.vel.x-=(1+We)*De*re.nx,this.vel.z-=(1+We)*De*re.nz;const Oe=-re.nz,Ke=re.nx,q=this.vel.x*Oe+this.vel.z*Ke;this.vel.x-=Oe*q*Math.min(.25,1.8*e),this.vel.z-=Ke*q*Math.min(.25,1.8*e),this.telemetry.scrapeIntensity=Ge(Math.abs(q)/28,.08,1),this.yawRate*=.65}else{const be=-re.nz,We=re.nx,Oe=Math.abs(this.vel.x*be+this.vel.z*We);Oe>2&&(this.telemetry.scrapeIntensity=Ge(Oe/32,.05,.8))}}const P=n.raycastDown(this.pos.x,this.pos.y+1.8,this.pos.z,this.tmpHit);this.pos.y<P.y&&(this.pos.y=P.y,this.verticalVel<0&&(this.verticalVel=0));const T=Math.asin(Ge(-(this.avgNormal.x*u+this.avgNormal.z*d),-.32,.32)),$=Math.asin(Ge(-(this.avgNormal.x*f+this.avgNormal.z*g),-.32,.32));this.roadPitch=St(this.roadPitch,T,Math.min(1,14*e)),this.roadRoll=St(this.roadRoll,$,Math.min(1,14*e));const oe=Ge(fe/9.81,-2.5,2.5),pe=Ge(R/9.81,-2.2,2),he=Ge(oe*.032,-.068,.068),Ae=Ge(pe*.022,-.048,.042);this.bodyRoll=St(this.bodyRoll,he,Math.min(1,11*e)),this.bodyPitch=St(this.bodyPitch,Ae,Math.min(1,11*e)),this.updateOrientationQuaternion();const ve=n.track.closestPointXZ(this.pos.x,this.pos.z,this.splineS);this.splineS=ve.sample.s,this.splineLateral=ve.lateral;const Me=n.terrain.getHeight(this.pos.x,this.pos.z),Fe=this.pos.x<n.terrain.cfg.minX+10||this.pos.x>n.terrain.cfg.maxX-10||this.pos.z<n.terrain.cfg.minZ+10||this.pos.z>n.terrain.cfg.maxZ-10;this.tmpUp.set(0,1,0).applyQuaternion(this.quat);const we=this.tmpUp.y<.35,Ie=this.pos.y<Math.min(Me,P.y)-1.5;if(r?Math.abs(this.splineLateral)>ve.sample.width*.5+4.5||w<4&&(a>.3||!this.isPlayer)?this.stuckTimer+=e:this.stuckTimer=0:this.stuckTimer=0,Ie||Fe||we||this.stuckTimer>3.2){const De=Ie?"under_terrain":Fe?"out_of_world":we?"flipped":"stuck";this.safetyResetCount++,Ie&&this.underTerrainResets++,Fe&&this.outOfWorldResets++,this.safetyLog.push({time:i,reason:De,s:this.splineS}),this.spawnAtSpline(n,this.splineS,0)}const ke=Math.hypot(this.vel.x,this.vel.z)*3.6;this.telemetry.speedKmh=ke,this.telemetry.rpm=this.rpm,this.telemetry.gear=this.gear,this.telemetry.nitro=this.nitro,this.telemetry.nitroActive=this.nitroActive,this.telemetry.steerVisualNorm=this.steerSmoothed,this.telemetry.throttle=a,this.telemetry.brake=o,this.telemetry.lateralG=oe,this.telemetry.tireSlip=ne,this.telemetry.surface=C,this.telemetry.isBraking=o>.15&&v>1.5,this.telemetry.onBridge=ve.sample.isBridge;for(const De of this.wheels)De.slipRatio=ne}static resolveCarPair(e,t){const n=Math.sin(e.yaw),i=Math.cos(e.yaw),r=Math.sin(t.yaw),a=Math.cos(t.yaw),o=[-1.15,1.15],l=1.88;let c=0;for(const h of o){const u=e.pos.x-n*-h,d=e.pos.z-i*-h;for(const f of o){const g=t.pos.x-r*-f,v=t.pos.z-a*-f,p=g-u,m=v-d,w=p*p+m*m;if(w<l*l&&w>1e-6){const y=Math.sqrt(w),x=p/y,b=m/y,E=(l-y)*.52;e.pos.x-=x*E,e.pos.z-=b*E,t.pos.x+=x*E,t.pos.z+=b*E;const _=t.vel.x-e.vel.x,C=t.vel.z-e.vel.z,M=_*x+C*b;if(M<0){const S=-1.35*M*.5;e.vel.x-=x*S,e.vel.z-=b*S,t.vel.x+=x*S,t.vel.z+=b*S;const D=Ge(-M/18,0,1);D>c&&(c=D)}}}}return c>.05&&(e.telemetry.impactStrength=Math.max(e.telemetry.impactStrength,c),t.telemetry.impactStrength=Math.max(t.telemetry.impactStrength,c)),c}getForwardVector(e=new I){return e.set(0,0,-1).applyQuaternion(this.quat).normalize()}getRightVector(e=new I){return e.set(1,0,0).applyQuaternion(this.quat).normalize()}}const $l=[{name:"L. Bellini",baseLaneOffset:-1.8,aggression:.72,skillOffset:.03,preferredPace:1.01},{name:"M. Santoro",baseLaneOffset:1.8,aggression:.65,skillOffset:.01,preferredPace:.99},{name:"C. Moretti",baseLaneOffset:-.9,aggression:.8,skillOffset:.04,preferredPace:1.02},{name:"S. Ferri",baseLaneOffset:.9,aggression:.58,skillOffset:-.02,preferredPace:.96},{name:"E. Conti",baseLaneOffset:0,aggression:.75,skillOffset:.02,preferredPace:1}];class Jc{constructor(e){B(this,"profile");B(this,"currentLaneOffset");B(this,"targetLaneOffset");B(this,"laneDecisionTimer",0);this.profile=e,this.currentLaneOffset=e.baseLaneOffset,this.targetLaneOffset=e.baseLaneOffset}reset(){this.currentLaneOffset=this.profile.baseLaneOffset,this.targetLaneOffset=this.profile.baseLaneOffset,this.laneDecisionTimer=0}computeInput(e,t,n,i,r){const o=(i==="easy"?.84:i==="hard"?1.04:.95)*this.profile.preferredPace;this.laneDecisionTimer-=r;let l=!1,c=0,h=1/0;for(let te=0;te<t.length;te++){const N=t[te];if(N===e)continue;const O=n.deltaS(e.splineS,N.splineS);if(O>2&&O<28){const le=N.splineLateral-e.splineLateral;Math.abs(le)<2.6&&O<h&&(l=!0,c=N.splineLateral,h=O)}}const d=n.sampleAtS(e.splineS).width*.5-2.1;if(l&&this.laneDecisionTimer<=0){const te=c>0?-d*.72:d*.72,N=-te;this.targetLaneOffset=Math.abs(te-c)>2.8?te:N,this.laneDecisionTimer=1.4}else if(!l&&this.laneDecisionTimer<=0){const te=n.sampleAtS(e.splineS+32),N=Ge(-Math.sign(te.curvature)*Math.min(2.2,Math.abs(te.curvature)*140),-2,2);this.targetLaneOffset=Ge(this.profile.baseLaneOffset*.45+N*.55,-d,d),this.laneDecisionTimer=.6}for(let te=0;te<t.length;te++){const N=t[te];if(N===e)continue;if(Math.abs(n.deltaS(e.splineS,N.splineS))<5.5){const le=e.splineLateral-N.splineLateral;if(Math.abs(le)<2.35){const Se=le>=0?1:-1;this.targetLaneOffset=Ge(this.targetLaneOffset+Se*1.1,-d,d)}}}this.currentLaneOffset+=(this.targetLaneOffset-this.currentLaneOffset)*Math.min(1,2.8*r);const f=Ge(this.currentLaneOffset,-d,d),g=e.telemetry.speedKmh,v=Ge(12.5+g*.145,12.5,36),p=n.sampleAtS(e.splineS+v),m=p.pos.x+p.flatRight.x*f,w=p.pos.z+p.flatRight.z*f,y=m-e.pos.x,x=w-e.pos.z,b=e.getForwardVector(),E=e.getRightVector(),_=y*E.x+x*E.z,C=y*b.x+x*b.z,M=Math.atan2(_,Math.max(1,C)),S=Ge(M*2.35,-1,1);let D=0;for(let te=8;te<=106;te+=12){const N=n.sampleAtS(e.splineS+te),O=Math.abs(N.curvature);O>D&&(D=O)}const z=D>1e-4?1/D:1e3,U=Math.sqrt(10*o*z)*3.6;let H=Math.min(e.spec.topSpeedKmh*o,U);l&&h<7.5&&Math.abs(e.splineLateral-c)<1.8&&(H=Math.min(H,g*.85));let ee=0,W=0;g<H-2?ee=1:g<H+5?ee=.45:W=Ge((g-H)/28,.15,1);const X=D<.0045&&Math.abs(M)<.08&&g>85&&e.nitro>.45&&(i==="hard"||i==="normal"&&l);return{throttle:ee,brake:W,steer:S,nitro:X}}}const kg=new Jc({name:"TestAutopilot",baseLaneOffset:0,aggression:.62,skillOffset:.02,preferredPace:1});function Hg(s,e,t,n={}){const i=kg.computeInput(s,e,t,"normal",.008333333333333333);if((n.paceMultiplier??1.02)>1.01&&i.throttle>.3&&i.brake===0&&(i.throttle=1),!n.allowNitro)i.nitro=!1;else{let a=0;for(let o=8;o<=90;o+=12){const l=Math.abs(t.sampleAtS(s.splineS+o).curvature);l>a&&(a=l)}a<.004&&s.telemetry.speedKmh>78&&s.nitro>.38&&Math.abs(i.steer)<.14&&i.brake===0&&(i.nitro=!0)}return i}const Ea=new Ze;class Br{constructor(e){e=e||{},this.zNear=e.webGL===!0?-1:0,this.vertices={near:[new I,new I,new I,new I],far:[new I,new I,new I,new I]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,t){const n=this.zNear,i=e.elements[11]===0;return Ea.copy(e).invert(),this.vertices.near[0].set(1,1,n),this.vertices.near[1].set(1,-1,n),this.vertices.near[2].set(-1,-1,n),this.vertices.near[3].set(-1,1,n),this.vertices.near.forEach(function(r){r.applyMatrix4(Ea)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(r){r.applyMatrix4(Ea);const a=Math.abs(r.z);i?r.z*=Math.min(t/a,1):r.multiplyScalar(Math.min(t/a,1))}),this.vertices}split(e,t){for(;e.length>t.length;)t.push(new Br);t.length=e.length;for(let n=0;n<e.length;n++){const i=t[n];if(n===0)for(let r=0;r<4;r++)i.vertices.near[r].copy(this.vertices.near[r]);else for(let r=0;r<4;r++)i.vertices.near[r].lerpVectors(this.vertices.near[r],this.vertices.far[r],e[n-1]);if(n===e.length-1)for(let r=0;r<4;r++)i.vertices.far[r].copy(this.vertices.far[r]);else for(let r=0;r<4;r++)i.vertices.far[r].lerpVectors(this.vertices.near[r],this.vertices.far[r],e[n])}}toSpace(e,t){for(let n=0;n<4;n++)t.vertices.near[n].copy(this.vertices.near[n]).applyMatrix4(e),t.vertices.far[n].copy(this.vertices.far[n]).applyMatrix4(e)}}const ec={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+$e.lights_pars_begin},tc=new Ze,Ca=new Br({webGL:!0}),Pn=new I,xs=new Jn,Ra=[],Pa=[],Da=new Ze,nc=new Ze,Gg=new I(0,1,0);class Vg{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new I(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new Br({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this.createLights(),this.updateFrustums(),this.injectInclude()}createLights(){for(let e=0;e<this.cascades;e++){const t=new Yc(16777215,this.lightIntensity);t.castShadow=!0,t.shadow.mapSize.width=this.shadowMapSize,t.shadow.mapSize.height=this.shadowMapSize,t.shadow.camera.near=this.lightNear,t.shadow.camera.far=this.lightFar,t.shadow.bias=this.shadowBias,this.parent.add(t),this.parent.add(t.target),this.lights.push(t)}}initCascades(){const e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}updateShadowBounds(){const e=this.frustums;for(let t=0;t<e.length;t++){const i=this.lights[t].shadow.camera,r=this.frustums[t],a=r.vertices.near,o=r.vertices.far,l=o[0];let c;l.distanceTo(o[2])>l.distanceTo(a[2])?c=o[2]:c=a[2];let h=l.distanceTo(c);if(this.fade){const u=this.camera,d=Math.max(u.far,this.maxFar),f=r.vertices.far[0].z/(d-u.near),g=.25*Math.pow(f,2)*(d-u.near);h+=g}i.left=-h/2,i.right=h/2,i.top=h/2,i.bottom=-h/2,i.updateProjectionMatrix()}}getBreaks(){const e=this.camera,t=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":n(this.cascades,e.near,t,this.breaks);break;case"logarithmic":i(this.cascades,e.near,t,this.breaks);break;case"practical":r(this.cascades,e.near,t,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,t,this.breaks);break}function n(a,o,l,c){for(let h=1;h<a;h++)c.push((o+(l-o)*h/a)/l);c.push(1)}function i(a,o,l,c){for(let h=1;h<a;h++)c.push(o*(l/o)**(h/a)/l);c.push(1)}function r(a,o,l,c,h){Ra.length=0,Pa.length=0,i(a,o,l,Pa),n(a,o,l,Ra);for(let u=1;u<a;u++)h.push(Cr.lerp(Ra[u-1],Pa[u-1],c));h.push(1)}}update(){const e=this.camera,t=this.frustums;Da.lookAt(new I,this.lightDirection,Gg),nc.copy(Da).invert();for(let n=0;n<t.length;n++){const i=this.lights[n],r=i.shadow.camera,a=(r.right-r.left)/this.shadowMapSize,o=(r.top-r.bottom)/this.shadowMapSize;tc.multiplyMatrices(nc,e.matrixWorld),t[n].toSpace(tc,Ca);const l=Ca.vertices.near,c=Ca.vertices.far;xs.makeEmpty();for(let h=0;h<4;h++)xs.expandByPoint(l[h]),xs.expandByPoint(c[h]);xs.getCenter(Pn),Pn.z=xs.max.z+this.lightMargin,Pn.x=Math.floor(Pn.x/a)*a,Pn.y=Math.floor(Pn.y/o)*o,Pn.applyMatrix4(Da),i.position.copy(Pn),i.target.position.copy(Pn),i.target.position.x+=this.lightDirection.x,i.target.position.y+=this.lightDirection.y,i.target.position.z+=this.lightDirection.z}}injectInclude(){$e.lights_fragment_begin=ec.lights_fragment_begin,$e.lights_pars_begin=ec.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");const t=[],n=this,i=this.shaders;e.onBeforeCompile=function(r){const a=Math.min(n.camera.far,n.maxFar);n.getExtendedBreaks(t),r.uniforms.CSM_cascades={value:t},r.uniforms.cameraNear={value:n.camera.near},r.uniforms.shadowFar={value:a},i.set(e,r)},i.set(e,null)}updateUniforms(){const e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(n,i){if(n!==null){const r=n.uniforms;this.getExtendedBreaks(r.CSM_cascades.value),r.cameraNear.value=this.camera.near,r.shadowFar.value=e}!this.fade&&"CSM_FADE"in i.defines?(delete i.defines.CSM_FADE,i.needsUpdate=!0):this.fade&&!("CSM_FADE"in i.defines)&&(i.defines.CSM_FADE="",i.needsUpdate=!0)},this)}getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new xe);e.length=this.breaks.length;for(let t=0;t<this.cascades;t++){const n=this.breaks[t],i=this.breaks[t-1]||0;e[t].x=i,e[t].y=n}}updateFrustums(){this.getBreaks(),this.initCascades(),this.updateShadowBounds(),this.updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){const e=this.shaders;e.forEach(function(t,n){delete n.onBeforeCompile,delete n.defines.USE_CSM,delete n.defines.CSM_CASCADES,delete n.defines.CSM_FADE,t!==null&&(delete t.uniforms.CSM_cascades,delete t.uniforms.cameraNear,delete t.uniforms.shadowFar),n.needsUpdate=!0}),e.clear()}}const $c={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ei{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Wg=new zr(-1,1,1,-1,0,1);class Xg extends xt{constructor(){super(),this.setAttribute("position",new et([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new et([0,2,0,0,2,0],2))}}const Yg=new Xg;class kr{constructor(e){this._mesh=new Ee(Yg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Wg)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class eh extends ei{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Zn.clone(e.uniforms),this.material=new ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new kr(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ic extends ei{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class qg extends ei{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Zg{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new xe);this._width=n.width,this._height=n.height,t=new Tt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ct}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new eh($c),this.copyPass.material.blending=Nn,this.clock=new Cd}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ic!==void 0&&(a instanceof ic?n=!0:a instanceof qg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Kg extends ei{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ze}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i}}const jg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ze(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class is extends ei{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new ze(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Tt(r,a,{type:Ct}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new Tt(r,a,{type:Ct});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new Tt(r,a,{type:Ct});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=jg;this.highPassUniforms=Zn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ft({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new xe(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=$c;this.copyUniforms=Zn.clone(h.uniforms),this.blendMaterial=new ft({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Rs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ze,this.oldClearAlpha=1,this.basic=new ji,this.fsQuad=new kr(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new xe(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=is.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=is.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeparableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}is.BlurDirectionX=new xe(1,0);is.BlurDirectionY=new xe(0,1);const Qg={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Jg extends ei{constructor(){super();const e=Qg;this.uniforms=Zn.clone(e.uniforms),this.material=new ud({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new kr(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},at.getTransfer(this._outputColorSpace)===dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===lc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===cc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===hc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===uc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===_r?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===fc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===dc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const gr={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new xe(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},vr={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new xe(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},La={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new xe(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};class $g extends ei{constructor(e,t){super(),this.edgesRT=new Tt(e,t,{depthBuffer:!1,type:Ct}),this.edgesRT.texture.name="SMAAPass.edges",this.weightsRT=new Tt(e,t,{depthBuffer:!1,type:Ct}),this.weightsRT.texture.name="SMAAPass.weights";const n=this,i=new Image;i.src=this.getAreaTexture(),i.onload=function(){n.areaTexture.needsUpdate=!0},this.areaTexture=new Ut,this.areaTexture.name="SMAAPass.area",this.areaTexture.image=i,this.areaTexture.minFilter=gt,this.areaTexture.generateMipmaps=!1,this.areaTexture.flipY=!1;const r=new Image;r.src=this.getSearchTexture(),r.onload=function(){n.searchTexture.needsUpdate=!0},this.searchTexture=new Ut,this.searchTexture.name="SMAAPass.search",this.searchTexture.image=r,this.searchTexture.magFilter=Mt,this.searchTexture.minFilter=Mt,this.searchTexture.generateMipmaps=!1,this.searchTexture.flipY=!1,this.uniformsEdges=Zn.clone(gr.uniforms),this.uniformsEdges.resolution.value.set(1/e,1/t),this.materialEdges=new ft({defines:Object.assign({},gr.defines),uniforms:this.uniformsEdges,vertexShader:gr.vertexShader,fragmentShader:gr.fragmentShader}),this.uniformsWeights=Zn.clone(vr.uniforms),this.uniformsWeights.resolution.value.set(1/e,1/t),this.uniformsWeights.tDiffuse.value=this.edgesRT.texture,this.uniformsWeights.tArea.value=this.areaTexture,this.uniformsWeights.tSearch.value=this.searchTexture,this.materialWeights=new ft({defines:Object.assign({},vr.defines),uniforms:this.uniformsWeights,vertexShader:vr.vertexShader,fragmentShader:vr.fragmentShader}),this.uniformsBlend=Zn.clone(La.uniforms),this.uniformsBlend.resolution.value.set(1/e,1/t),this.uniformsBlend.tDiffuse.value=this.weightsRT.texture,this.materialBlend=new ft({uniforms:this.uniformsBlend,vertexShader:La.vertexShader,fragmentShader:La.fragmentShader}),this.fsQuad=new kr(null)}render(e,t,n){this.uniformsEdges.tDiffuse.value=n.texture,this.fsQuad.material=this.materialEdges,e.setRenderTarget(this.edgesRT),this.clear&&e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialWeights,e.setRenderTarget(this.weightsRT),this.clear&&e.clear(),this.fsQuad.render(e),this.uniformsBlend.tColor.value=n.texture,this.fsQuad.material=this.materialBlend,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e))}setSize(e,t){this.edgesRT.setSize(e,t),this.weightsRT.setSize(e,t),this.materialEdges.uniforms.resolution.value.set(1/e,1/t),this.materialWeights.uniforms.resolution.value.set(1/e,1/t),this.materialBlend.uniforms.resolution.value.set(1/e,1/t)}getAreaTexture(){return"data:image/png;base64,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"}getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}dispose(){this.edgesRT.dispose(),this.weightsRT.dispose(),this.areaTexture.dispose(),this.searchTexture.dispose(),this.materialEdges.dispose(),this.materialWeights.dispose(),this.materialBlend.dispose(),this.fsQuad.dispose()}}class ev extends xt{constructor(){super();B(this,"boundingSphere",new Ti);this.setAttribute("position",new vt(new Float32Array([-1,-1,3,-1,-1,3]),2)),this.setAttribute("uv",new vt(new Float32Array([0,0,2,0,0,2]),2))}computeBoundingSphere(){}}const tv=new ev,nv=new zr;class Wi{constructor(e){this._mesh=new Ee(tv,e),this._mesh.frustumCulled=!1}render(e){e.render(this._mesh,nv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}dispose(){this._mesh.material.dispose(),this._mesh.geometry.dispose()}}const iv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},sceneNormal:{value:null},projMat:{value:new Ze},viewMat:{value:new Ze},projViewMat:{value:new Ze},projectionMatrixInv:{value:new Ze},viewMatrixInv:{value:new Ze},cameraPos:{value:new I},resolution:{value:new xe},biasAdjustment:{value:new xe},time:{value:0},samples:{value:[]},bluenoise:{value:null},distanceFalloff:{value:1},radius:{value:5},near:{value:.1},far:{value:1e3},ortho:{value:!1},screenSpaceRadius:{value:!1},frame:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1);
}`,fragmentShader:`
    #define SAMPLES 16
    #define FSAMPLES 16.0
uniform sampler2D sceneDiffuse;
uniform highp sampler2D sceneNormal;
uniform highp sampler2D sceneDepth;
uniform mat4 projectionMatrixInv;
uniform mat4 viewMatrixInv;
uniform mat4 projMat;
uniform mat4 viewMat;
uniform mat4 projViewMat;
uniform vec3 cameraPos;
uniform vec2 resolution;
uniform vec2 biasAdjustment;
uniform float time;
uniform vec3[SAMPLES] samples;
uniform float radius;
uniform float distanceFalloff;
uniform float near;
uniform float far;
uniform float frame;
uniform bool ortho;
uniform bool screenSpaceRadius;
uniform sampler2D bluenoise;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      /*return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);*/
       #ifdef ORTHO

       return linearize_depth_ortho(d, nearZ, farZ);

        #else
        return linearize_depth(linDepth, nearZ, farZ);
        #endif
    }

    vec3 getWorldPosLog(vec3 posS) {
      vec2 uv = posS.xy;
      float z = posS.z;
      float nearZ =near;
      float farZ = far;
      float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
      vec4 wpos = projectionMatrixInv * clipVec;
      return wpos.xyz / wpos.w;
    }
    vec3 getWorldPos(float depth, vec2 coord) {
      #ifdef LOGDEPTH
        #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
        #endif
      #endif
      #ifdef ORTHO
        float z = depth * 2. - 1.;
        vec4 clipSpacePosition = vec4(coord * 2. - 1., z, 1.);
        vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
        viewSpacePosition.xyz /= viewSpacePosition.w;
        return viewSpacePosition.xyz;
      #else
        vec2 ndc = coord * 2. - 1.;
        float ndcZ = depth * 2. - 1.;
        mat4 Q = projectionMatrixInv;
        vec3 view = vec3(Q[0][0] * ndc.x + Q[3][0], Q[1][1] * ndc.y + Q[3][1], Q[3][2]);
        float invW = 1. / (Q[2][3] * ndcZ + Q[3][3]);
        return view * invW;
      #endif
  }

  vec3 computeNormal(vec3 worldPos, vec2 vUv) {
    ivec2 p = ivec2(vUv * resolution);
    #ifdef REVERSEDEPTH
    float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
    float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
    float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
    float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
    float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
    float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
    float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
    float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
    float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
    #else
    float c0 = texelFetch(sceneDepth, p, 0).x;
    float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
    float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
    float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
    float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
    float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
    float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
    float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
    float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
    #endif

    float dl = abs((2.0 * l1 - l2) - c0);
    float dr = abs((2.0 * r1 - r2) - c0);
    float db = abs((2.0 * b1 - b2) - c0);
    float dt = abs((2.0 * t1 - t2) - c0);

    vec3 ce = getWorldPos(c0, vUv).xyz;

    vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                          : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
    vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                          : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;

    return normalize(cross(dpdx, dpdy));
}

mat3 makeRotationZ(float theta) {
	float c = cos(theta);
	float s = sin(theta);
	return mat3(c, - s, 0,
			s,  c, 0,
			0,  0, 1);
  }

void main() {
      vec4 diffuse = texture2D(sceneDiffuse, vUv);
      #ifdef REVERSEDEPTH
      float depth = 1.0 - texture2D(sceneDepth, vUv).x;
      #else
      float depth = texture2D(sceneDepth, vUv).x;
      #endif
      if (depth == 1.0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
        return;
      }
      vec3 worldPos = getWorldPos(depth, vUv);
      #ifdef HALFRES
        vec3 normal = texture2D(sceneNormal, vUv).rgb;
      #else
        vec3 normal = computeNormal(worldPos, vUv);
      #endif
      vec4 noise = texture2D(bluenoise, gl_FragCoord.xy / 128.0);
      vec2 harmoniousNumbers = vec2(
        1.618033988749895,
        1.324717957244746
      );
      noise.rg += harmoniousNumbers * frame;
      noise.rg = fract(noise.rg);
        vec3 helperVec = vec3(0.0, 1.0, 0.0);
        if (dot(helperVec, normal) > 0.99) {
          helperVec = vec3(1.0, 0.0, 0.0);
        }
        vec3 tangent = normalize(cross(helperVec, normal));
        vec3 bitangent = cross(normal, tangent);
        mediump mat3 tbn = mat3(tangent, bitangent, normal) *  makeRotationZ( noise.r * 3.1415962 * 2.0) ;

      mediump float occluded = 0.0;
      mediump float totalWeight = 0.0;
      float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : radiusToUse * distanceFalloff * 0.2;
      float bias = (min(
        0.1,
        distanceFalloffToUse * 0.1
      ) / near) * fwidth(distance(worldPos, cameraPos)) / radiusToUse;
      bias = biasAdjustment.x + biasAdjustment.y * bias;
      mediump float offsetMove = noise.g;
      mediump float offsetMoveInv = 1.0 / FSAMPLES;
      float farTimesNear = far * near;
      float farMinusNear = far - near;
      
      for(int i = 0; i < SAMPLES; i++) {
        mediump vec3 sampleDirection = tbn * samples[i];

        float moveAmt = fract(offsetMove);
        offsetMove += offsetMoveInv;
        vec3 samplePos = worldPos + radiusToUse * moveAmt * sampleDirection;
        vec4 offset = projMat * vec4(samplePos, 1.0);
        offset.xyz /= offset.w;
        offset.xyz = offset.xyz * 0.5 + 0.5;
        
        if (all(greaterThan(offset.xyz * (1.0 - offset.xyz), vec3(0.0)))) {
          #ifdef REVERSEDEPTH
          float sampleDepth = 1.0 - textureLod(sceneDepth, offset.xy, 0.0).x;
          #else
          float sampleDepth = textureLod(sceneDepth, offset.xy, 0.0).x;
          #endif

          /*#ifdef LOGDEPTH
          float distSample = linearize_depth_log(sampleDepth, near, far);
      #else
          #ifdef ORTHO
              float distSample = near + farMinusNear * sampleDepth;
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif*/
      #ifdef ORTHO
          float distSample = near + sampleDepth * farMinusNear;
      #else
          #ifdef LOGDEPTH
              float distSample = linearize_depth_log(sampleDepth, near, far);
          #else
              float distSample = (farTimesNear) / (far - sampleDepth * farMinusNear);
          #endif
      #endif
      
      #ifdef ORTHO
          float distWorld = near + offset.z * farMinusNear;
      #else
          float distWorld = (farTimesNear) / (far - offset.z * farMinusNear);
      #endif
          
          mediump float rangeCheck = smoothstep(0.0, 1.0, distanceFalloffToUse / (abs(distSample - distWorld)));
          vec2 diff = gl_FragCoord.xy - floor(offset.xy * resolution);
          occluded += rangeCheck * float(distSample != distWorld) * float(sampleDepth != depth) * step(distSample + bias, distWorld) * step(
            1.0,
            dot(diff, diff)
          );
          
          totalWeight ++;
        }
      }
      float occ = clamp(1.0 - occluded / (totalWeight == 0.0 ? 1.0 : totalWeight), 0.0, 1.0);
      gl_FragColor = vec4(occ, 0.5 + 0.5 * normal);
}`},sv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},transparencyDWFalse:{value:null},transparencyDWTrue:{value:null},transparencyDWTrueDepth:{value:null},transparencyAware:{value:!1},projMat:{value:new Ze},viewMat:{value:new Ze},projectionMatrixInv:{value:new Ze},viewMatrixInv:{value:new Ze},cameraPos:{value:new I},resolution:{value:new xe},color:{value:new I(0,0,0)},blueNoise:{value:null},downsampledDepth:{value:null},time:{value:0},intensity:{value:10},renderMode:{value:0},gammaCorrection:{value:!1},ortho:{value:!1},near:{value:.1},far:{value:1e3},screenSpaceRadius:{value:!1},radius:{value:0},distanceFalloff:{value:1},fog:{value:!1},fogExp:{value:!1},fogDensity:{value:0},fogNear:{value:1/0},fogFar:{value:1/0},colorMultiply:{value:!0},aoTones:{value:0}},depthWrite:!1,depthTest:!1,vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1);
		}`,fragmentShader:`
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform highp sampler2D downsampledDepth;
    uniform highp sampler2D transparencyDWFalse;
    uniform highp sampler2D transparencyDWTrue;
    uniform highp sampler2D transparencyDWTrueDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform vec2 resolution;
    uniform vec3 color;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform float intensity;
    uniform float renderMode;
    uniform float near;
    uniform float far;
    uniform float aoTones;
    uniform bool gammaCorrection;
    uniform bool ortho;
    uniform bool screenSpaceRadius;
    uniform bool fog;
    uniform bool fogExp;
    uniform bool colorMultiply;
    uniform bool transparencyAware;
    uniform float fogDensity;
    uniform float fogNear;
    uniform float fogFar;
    uniform float radius;
    uniform float distanceFalloff;
    uniform vec3 cameraPos;
    varying vec2 vUv;
    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }
    highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
      return nearZ + (farZ - nearZ) * d;
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
      float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
      float a = farZ / (farZ - nearZ);
      float b = farZ * nearZ / (nearZ - farZ);
      float linDepth = a + b / depth;
      return ortho ? linearize_depth_ortho(
        linDepth,
        nearZ,
        farZ
      ) :linearize_depth(linDepth, nearZ, farZ);
    }
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
        #ifdef LOGDEPTH
          #ifndef ORTHO
            return getWorldPosLog(vec3(coord, depth));
          #endif
        #endif
      //  }
        #ifdef ORTHO
          float z = depth * 2. - 1.;
          vec4 clipSpacePosition = vec4(coord * 2. - 1., z, 1.);
          vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
          viewSpacePosition.xyz /= viewSpacePosition.w;
          return viewSpacePosition.xyz;
        #else
          vec2 ndc = coord * 2. - 1.;
          float ndcZ = depth * 2. - 1.;
          mat4 Q = projectionMatrixInv;
          vec3 view = vec3(Q[0][0] * ndc.x + Q[3][0], Q[1][1] * ndc.y + Q[3][1], Q[3][2]);
          float invW = 1. / (Q[2][3] * ndcZ + Q[3][3]);
          return view * invW;
        #endif
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      #ifdef REVERSEDEPTH
      float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
      float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #else
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #endif
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }

    #include <common>
    #include <dithering_pars_fragment>
    void main() {
        //vec4 texel = texture2D(tDiffuse, vUv);//vec3(0.0);
        vec4 sceneTexel = texture2D(sceneDiffuse, vUv);
        #ifdef REVERSEDEPTH
        float depth = 1.0 - texture2D(sceneDepth, vUv).x;
        #else
        float depth = texture2D(sceneDepth, vUv).x;
        #endif
        #ifdef HALFRES 
        vec4 texel = vec4(0.0);
        if (depth == 1.0) {
            texel = vec4(1.0, 0.0, 0.0, 1.0);
        } else {
        vec3 worldPos = getWorldPos(depth, vUv);
        vec3 normal = computeNormal(getWorldPos(depth, vUv), vUv);
       // vec4 texel = texture2D(tDiffuse, vUv);
       // Find closest depth;
       float totalWeight = 0.0;
       float radiusToUse = screenSpaceRadius ? distance(
        worldPos,
        getWorldPos(depth, vUv +
          vec2(radius, 0.0) / resolution)
      ) : radius;
      float distanceFalloffToUse =screenSpaceRadius ?
          radiusToUse * distanceFalloff
      : distanceFalloff;
        for(float x = -1.0; x <= 1.0; x++) {
            for(float y = -1.0; y <= 1.0; y++) {
                vec2 offset = vec2(x, y);
                ivec2 p = ivec2(
                    (vUv * resolution * 0.5) + offset
                );
                vec2 pUv = vec2(p) / (resolution * 0.5);
                float sampleDepth = texelFetch(downsampledDepth,p, 0).x;
                vec4 sampleInfo = texelFetch(tDiffuse, p, 0);
                vec3 normalSample = sampleInfo.gba * 2.0 - 1.0;
                vec3 worldPosSample = getWorldPos(sampleDepth, pUv);
                float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
                float rangeCheck = exp(-1.0 * tangentPlaneDist * (1.0 / distanceFalloffToUse)) * max(dot(normal, normalSample), 0.0);
                float weight = rangeCheck;
                totalWeight += weight;
                texel += sampleInfo * weight;
            }
        }
        if (totalWeight == 0.0) {
            texel = texture2D(tDiffuse, vUv);
        } else {
            texel /= totalWeight;
        }
    }
        #else
        vec4 texel = texture2D(tDiffuse, vUv);
        #endif

        #ifdef LOGDEPTH
        texel.r = clamp(texel.r, 0.0, 1.0);
        if (texel.r == 0.0) {
          texel.r = 1.0;
        }
        #endif
     
        float finalAo = pow(texel.r, intensity);
        if (aoTones > 0.0) {
            finalAo = ceil(finalAo * aoTones) / aoTones;
        }
        float fogFactor;
        float fogDepth = distance(
            cameraPos,
            getWorldPos(depth, vUv)
        );
        if (fog) {
            if (fogExp) {
                fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
            } else {
                fogFactor = smoothstep( fogNear, fogFar, fogDepth );
            }
        }
        if (transparencyAware) {
            float transparencyDWOff = texture2D(transparencyDWFalse, vUv).a;
            float transparencyDWOn = texture2D(transparencyDWTrue, vUv).a;
            float adjustmentFactorOff = transparencyDWOff;
            #ifdef REVERSEDEPTH
            float depthSample = 1.0 - texture2D(sceneDepth, vUv).r;
            float trueDepthSample = 1.0 - texture2D(transparencyDWTrueDepth, vUv).r;
            #else
            float depthSample = texture2D(sceneDepth, vUv).r;
            float trueDepthSample = texture2D(transparencyDWTrueDepth, vUv).r;
            #endif
            float adjustmentFactorOn = (1.0 - transparencyDWOn) * (
                trueDepthSample == depthSample ? 1.0 : 0.0
            );
            float adjustmentFactor = max(adjustmentFactorOff, adjustmentFactorOn);
            finalAo = mix(finalAo, 1.0, adjustmentFactor);
        }
        finalAo = mix(finalAo, 1.0, fogFactor);
        vec3 aoApplied = color * mix(vec3(1.0), sceneTexel.rgb, float(colorMultiply));
        if (renderMode == 0.0) {
            gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 1.0) {
            gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
        } else if (renderMode == 2.0) {
            gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
        } else if (renderMode == 3.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(sceneTexel.rgb, aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        } else if (renderMode == 4.0) {
            if (vUv.x < 0.5) {
                gl_FragColor = vec4( sceneTexel.rgb, sceneTexel.a);
            } else if (abs(vUv.x - 0.5) < 1.0 / resolution.x) {
                gl_FragColor = vec4(1.0);
            } else {
                gl_FragColor = vec4( mix(vec3(1.0), aoApplied, 1.0 - finalAo), sceneTexel.a);
            }
        }
        #include <dithering_fragment>
        if (gammaCorrection) {
            gl_FragColor = sRGBTransferOETF(gl_FragColor);
        }
    }
    `},rv={uniforms:{sceneDiffuse:{value:null},sceneDepth:{value:null},tDiffuse:{value:null},projMat:{value:new Ze},viewMat:{value:new Ze},projectionMatrixInv:{value:new Ze},viewMatrixInv:{value:new Ze},cameraPos:{value:new I},resolution:{value:new xe},time:{value:0},r:{value:5},blueNoise:{value:null},radius:{value:12},worldRadius:{value:5},index:{value:0},poissonDisk:{value:[]},distanceFalloff:{value:1},near:{value:.1},far:{value:1e3},screenSpaceRadius:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1.0);
		}`,fragmentShader:`
		uniform sampler2D sceneDiffuse;
    uniform highp sampler2D sceneDepth;
    uniform sampler2D tDiffuse;
    uniform sampler2D blueNoise;
    uniform mat4 projectionMatrixInv;
    uniform mat4 viewMatrixInv;
    uniform vec2 resolution;
    uniform float r;
    uniform float radius;
     uniform float worldRadius;
    uniform float index;
     uniform float near;
     uniform float far;
     uniform float distanceFalloff;
     uniform bool screenSpaceRadius;
    varying vec2 vUv;

    highp float linearize_depth(highp float d, highp float zNear,highp float zFar)
    {
        highp float z_n = 2.0 * d - 1.0;
        return 2.0 * zNear * zFar / (zFar + zNear - z_n * (zFar - zNear));
    }
    highp float linearize_depth_log(highp float d, highp float nearZ,highp float farZ) {
     float depth = pow(2.0, d * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     return linearize_depth(linDepth, nearZ, farZ);
   }
   highp float linearize_depth_ortho(highp float d, highp float nearZ, highp float farZ) {
     return nearZ + (farZ - nearZ) * d;
   }
   vec3 getWorldPosLog(vec3 posS) {
     vec2 uv = posS.xy;
     float z = posS.z;
     float nearZ =near;
     float farZ = far;
     float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
     float a = farZ / (farZ - nearZ);
     float b = farZ * nearZ / (nearZ - farZ);
     float linDepth = a + b / depth;
     vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
     vec4 wpos = projectionMatrixInv * clipVec;
     return wpos.xyz / wpos.w;
   }
    vec3 getWorldPos(float depth, vec2 coord) {
     #ifdef LOGDEPTH
      #ifndef ORTHO
          return getWorldPosLog(vec3(coord, depth));
      #endif
     #endif
        
        #ifdef ORTHO
          float z = depth * 2. - 1.;
          vec4 clipSpacePosition = vec4(coord * 2. - 1., z, 1.);
          vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
          viewSpacePosition.xyz /= viewSpacePosition.w;
          return viewSpacePosition.xyz;
        #else
          vec2 ndc = coord * 2. - 1.;
          float ndcZ = depth * 2. - 1.;
          mat4 Q = projectionMatrixInv;
          vec3 view = vec3(Q[0][0] * ndc.x + Q[3][0], Q[1][1] * ndc.y + Q[3][1], Q[3][2]);
          float invW = 1.0 / (Q[2][3] * ndcZ + Q[3][3]);
          return view * invW;
        #endif
    }
    #include <common>
    #define NUM_SAMPLES 16
    uniform vec2 poissonDisk[NUM_SAMPLES];
    void main() {
        const float pi = 3.14159;
        vec2 texelSize = vec2(1.0 / resolution.x, 1.0 / resolution.y);
        vec2 uv = vUv;
        vec4 data = texture2D(tDiffuse, vUv);
        float occlusion = data.r;
        float baseOcc = data.r;
        vec3 normal = data.gba * 2.0 - 1.0;
        float count = 1.0;
        float d = texture2D(sceneDepth, vUv).x;
        if (d == 1.0) {
          gl_FragColor = data;
          return;
        }
        vec3 worldPos = getWorldPos(d, vUv);
        float size = radius;
        float angle;
        if (index == 0.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).w * PI2;
        } else if (index == 1.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).z * PI2;
        } else if (index == 2.0) {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).y * PI2;
        } else {
             angle = texture2D(blueNoise, gl_FragCoord.xy / 128.0).x * PI2;
        }

        mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        float radiusToUse = screenSpaceRadius ? distance(
          worldPos,
          getWorldPos(d, vUv +
            vec2(worldRadius, 0.0) / resolution)
        ) : worldRadius;
        float distanceFalloffToUse =screenSpaceRadius ?
        radiusToUse * distanceFalloff
    : radiusToUse * distanceFalloff * 0.2;

        float invDistance = (1.0 / distanceFalloffToUse);
        for(int i = 0; i < NUM_SAMPLES; i++) {
            vec2 offset = (rotationMatrix * poissonDisk[i]) * texelSize * size;
            vec4 dataSample = texture2D(tDiffuse, uv + offset);
            float occSample = dataSample.r;
            vec3 normalSample = dataSample.gba * 2.0 - 1.0;
            float dSample = texture2D(sceneDepth, uv + offset).x;
            vec3 worldPosSample = getWorldPos(dSample, uv + offset);
            float tangentPlaneDist = abs(dot(worldPosSample - worldPos, normal));
            float rangeCheck = float(dSample != 1.0) * exp(-1.0 * tangentPlaneDist * invDistance ) * max(dot(normal, normalSample), 0.0);
            occlusion += occSample * rangeCheck;
            count += rangeCheck;
        }
        if (count > 0.0) {
          occlusion /= count;
        }
        occlusion = clamp(occlusion, 0.0, 1.0);
        if (occlusion == 0.0) {
          occlusion = 1.0;
        }
        gl_FragColor = vec4(occlusion, 0.5 + 0.5 * normal);
    }
    `},av={uniforms:{sceneDepth:{value:null},resolution:{value:new xe},near:{value:.1},far:{value:1e3},viewMatrixInv:{value:new Ze},projectionMatrixInv:{value:new Ze},logDepth:{value:!1},ortho:{value:!1}},depthWrite:!1,depthTest:!1,vertexShader:`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1);
    }`,fragmentShader:`
    uniform highp sampler2D sceneDepth;
    uniform vec2 resolution;
    uniform float near;
    uniform float far;
    uniform bool logDepth;
    uniform bool ortho;
    uniform mat4 viewMatrixInv;
    uniform mat4 projectionMatrixInv;
    varying vec2 vUv;
    layout(location = 1) out vec4 gNormal;
    vec3 getWorldPosLog(vec3 posS) {
        vec2 uv = posS.xy;
        float z = posS.z;
        float nearZ =near;
        float farZ = far;
        float depth = pow(2.0, z * log2(farZ + 1.0)) - 1.0;
        float a = farZ / (farZ - nearZ);
        float b = farZ * nearZ / (nearZ - farZ);
        float linDepth = a + b / depth;
        vec4 clipVec = vec4(uv, linDepth, 1.0) * 2.0 - 1.0;
        vec4 wpos = projectionMatrixInv * clipVec;
        return wpos.xyz / wpos.w;
      }
      vec3 getWorldPos(float depth, vec2 coord) {
        if (logDepth && !ortho) {
          return getWorldPosLog(vec3(coord, depth));
        }
        if (ortho) {
          float z = depth * 2. - 1.;
          vec4 clipSpacePosition = vec4(coord * 2. - 1., z, 1.);
          vec4 viewSpacePosition = projectionMatrixInv * clipSpacePosition;
          viewSpacePosition.xyz /= viewSpacePosition.w;
          return viewSpacePosition.xyz;
        }
        vec2 ndc = coord * 2. - 1.;
        float ndcZ = depth * 2. - 1.;
        mat4 Q = projectionMatrixInv;
        vec3 view = vec3(Q[0][0] * ndc.x + Q[3][0], Q[1][1] * ndc.y + Q[3][1], Q[3][2]);
        float invW = 1. / (Q[2][3] * ndcZ + Q[3][3]);
        return view * invW;
    }
  
    vec3 computeNormal(vec3 worldPos, vec2 vUv) {
      ivec2 p = ivec2(vUv * resolution);
      #ifdef REVERSEDEPTH
      float c0 = 1.0 - texelFetch(sceneDepth, p, 0).x;
      float l2 = 1.0 - texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = 1.0 - texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = 1.0 - texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = 1.0 - texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = 1.0 - texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = 1.0 - texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #else
      float c0 = texelFetch(sceneDepth, p, 0).x;
      float l2 = texelFetch(sceneDepth, p - ivec2(2, 0), 0).x;
      float l1 = texelFetch(sceneDepth, p - ivec2(1, 0), 0).x;
      float r1 = texelFetch(sceneDepth, p + ivec2(1, 0), 0).x;
      float r2 = texelFetch(sceneDepth, p + ivec2(2, 0), 0).x;
      float b2 = texelFetch(sceneDepth, p - ivec2(0, 2), 0).x;
      float b1 = texelFetch(sceneDepth, p - ivec2(0, 1), 0).x;
      float t1 = texelFetch(sceneDepth, p + ivec2(0, 1), 0).x;
      float t2 = texelFetch(sceneDepth, p + ivec2(0, 2), 0).x;
      #endif
  
      float dl = abs((2.0 * l1 - l2) - c0);
      float dr = abs((2.0 * r1 - r2) - c0);
      float db = abs((2.0 * b1 - b2) - c0);
      float dt = abs((2.0 * t1 - t2) - c0);
  
      vec3 ce = getWorldPos(c0, vUv).xyz;
  
      vec3 dpdx = (dl < dr) ? ce - getWorldPos(l1, (vUv - vec2(1.0 / resolution.x, 0.0))).xyz
                            : -ce + getWorldPos(r1, (vUv + vec2(1.0 / resolution.x, 0.0))).xyz;
      vec3 dpdy = (db < dt) ? ce - getWorldPos(b1, (vUv - vec2(0.0, 1.0 / resolution.y))).xyz
                            : -ce + getWorldPos(t1, (vUv + vec2(0.0, 1.0 / resolution.y))).xyz;
  
      return normalize(cross(dpdx, dpdy));
  }
    void main() {
        vec2 uv = vUv - vec2(0.5) / resolution;
        vec2 pixelSize = vec2(1.0) / resolution;
        highp vec2[4] uvSamples;
        uvSamples[0] = uv;
        uvSamples[1] = uv + vec2(pixelSize.x, 0.0);
        uvSamples[2] = uv + vec2(0.0, pixelSize.y);
        uvSamples[3] = uv + pixelSize;
        #ifdef REVERSEDEPTH
        float depth00 = 1.0 - texture2D(sceneDepth, uvSamples[0]).r;
        float depth10 = 1.0 - texture2D(sceneDepth, uvSamples[1]).r;
        float depth01 = 1.0 - texture2D(sceneDepth, uvSamples[2]).r;
        float depth11 = 1.0 - texture2D(sceneDepth, uvSamples[3]).r;
        #else
        float depth00 = texture2D(sceneDepth, uvSamples[0]).r;
        float depth10 = texture2D(sceneDepth, uvSamples[1]).r;
        float depth01 = texture2D(sceneDepth, uvSamples[2]).r;
        float depth11 = texture2D(sceneDepth, uvSamples[3]).r;
        #endif
        float minDepth = min(min(depth00, depth10), min(depth01, depth11));
        float maxDepth = max(max(depth00, depth10), max(depth01, depth11));
        float targetDepth = minDepth;
        // Checkerboard pattern to avoid artifacts
        if (mod(gl_FragCoord.x + gl_FragCoord.y, 2.0) > 0.5) { 
            targetDepth = maxDepth;
        }
        int chosenIndex = 0;
        float[4] samples;
        samples[0] = depth00;
        samples[1] = depth10;
        samples[2] = depth01;
        samples[3] = depth11;
        for(int i = 0; i < 4; ++i) {
            if (samples[i] == targetDepth) {
                chosenIndex = i;
                break;
            }
        }
        gl_FragColor = vec4(samples[chosenIndex], 0.0, 0.0, 1.0);
        gNormal = vec4(computeNormal(
            getWorldPos(samples[chosenIndex], uvSamples[chosenIndex]), uvSamples[chosenIndex]
        ), 0.0);
    }`},ov="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",lv=Uint8Array.from(atob(ov),s=>s.charCodeAt(0));var cv=lv;const hv=parseInt(Ir.replace(/\D+/g,"")),uv=hv>=162?class extends Tt{constructor(s=1,e=1,t=1,n={}){super(s,e,{...n,count:t}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}:class extends Tt{constructor(s=1,e=1,t=1,n={}){super(s,e,n),this.isWebGLMultipleRenderTargets=!0;const i=this.texture;this.texture=[];for(let r=0;r<t;r++)this.texture[r]=i.clone(),this.texture[r].isRenderTargetTexture=!0}setSize(s,e,t=1){if(this.width!==s||this.height!==e||this.depth!==t){this.width=s,this.height=e,this.depth=t;for(let n=0,i=this.texture.length;n<i;n++)this.texture[n].image.width=s,this.texture[n].image.height=e,this.texture[n].image.depth=t;this.dispose()}this.viewport.set(0,0,s,e),this.scissor.set(0,0,s,e)}copy(s){this.dispose(),this.width=s.width,this.height=s.height,this.depth=s.depth,this.scissor.copy(s.scissor),this.scissorTest=s.scissorTest,this.viewport.copy(s.viewport),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,s.depthTexture!==null&&(this.depthTexture=s.depthTexture.clone()),this.texture.length=0;for(let e=0,t=s.texture.length;e<t;e++)this.texture[e]=s.texture[e].clone(),this.texture[e].isRenderTargetTexture=!0;return this}};function th(s,e,t){if(e.getQueryParameter(s,e.QUERY_RESULT_AVAILABLE)){const r=e.getQueryParameter(s,e.QUERY_RESULT)/1e6;t.lastTime=t.lastTime===0?r:t.timeRollingAverage*t.lastTime+(1-t.timeRollingAverage)*r}else setTimeout(()=>{th(s,e,t)},1)}const Lt={Default:1,Log:2,Reverse:3};class dv extends ei{constructor(e,t,n=512,i=512){super(),this.width=n,this.height=i,this.clear=!0,this.camera=t,this.scene=e,this.configuration=new Proxy({aoSamples:16,aoRadius:5,aoTones:0,denoiseSamples:8,denoiseRadius:12,distanceFalloff:1,intensity:5,denoiseIterations:2,renderMode:0,biasOffset:0,biasMultiplier:0,color:new ze(0,0,0),gammaCorrection:!0,depthBufferType:Lt.Default,screenSpaceRadius:!1,halfRes:!1,depthAwareUpsampling:!0,autoRenderBeauty:!0,colorMultiply:!0,transparencyAware:!1,stencil:!1,accumulate:!1},{set:(r,a,o)=>{const l=r[a];return r[a]=o,o.equals?o.equals(l)||this.firstFrame():l!==o&&this.firstFrame(),a==="aoSamples"&&l!==o&&this.configureAOPass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),a==="denoiseSamples"&&l!==o&&this.configureDenoisePass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),a==="halfRes"&&l!==o&&(this.configureAOPass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.configureHalfResTargets(),this.configureEffectCompositer(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.setSize(this.width,this.height)),a==="depthAwareUpsampling"&&l!==o&&this.configureEffectCompositer(this.configuration.depthBufferType,this.camera.isOrthographicCamera),a==="transparencyAware"&&l!==o&&(this.autoDetectTransparency=!1,this.configureTransparencyTarget()),a==="stencil"&&l!==o&&(this.beautyRenderTarget.dispose(),this.beautyRenderTarget=new Tt(this.width,this.height,{minFilter:gt,magFilter:Mt,type:Ct,format:It,stencilBuffer:o}),this.beautyRenderTarget.depthTexture=new Ts(this.width,this.height,o?xi:yn),this.beautyRenderTarget.depthTexture.format=o?Si:qn),!0}}),this.samples=[],this.samplesDenoise=[],this.autoDetectTransparency=!0,this.frame=0,this.lastViewMatrix=new Ze,this.lastProjectionMatrix=new Ze,this.beautyRenderTarget=new Tt(this.width,this.height,{minFilter:gt,magFilter:Mt,type:Ct,format:It,stencilBuffer:!1}),this.beautyRenderTarget.depthTexture=new Ts(this.width,this.height,yn),this.beautyRenderTarget.depthTexture.format=qn,this.configureEffectCompositer(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.configureSampleDependentPasses(),this.configureHalfResTargets(),this.detectTransparency(),this.configureTransparencyTarget(),this.writeTargetInternal=new Tt(this.width,this.height,{minFilter:gt,magFilter:gt,depthBuffer:!1,format:It}),this.readTargetInternal=new Tt(this.width,this.height,{minFilter:gt,magFilter:gt,depthBuffer:!1,format:It}),this.accumulationRenderTarget=new Tt(this.width,this.height,{minFilter:gt,magFilter:gt,depthBuffer:!1,format:It,type:Ct,stencilBuffer:!1,depthBuffer:!1,alpha:!0}),this.bluenoise=new zs(cv,128,128),this.accumulationQuad=new Wi(new ft({uniforms:{frame:{value:0},tDiffuse:{value:null}},transparent:!0,opacity:1,vertexShader:`
             varying vec2 vUv;
             void main() {
                 vUv = uv;
                 gl_Position = vec4(position, 1);
             }`,fragmentShader:`
             uniform sampler2D tDiffuse;
             uniform float frame;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    gl_FragColor = vec4(color.rgb, 1.0 / (frame + 1.0));
                }
                `})),this.bluenoise.colorSpace=Mn,this.bluenoise.wrapS=vi,this.bluenoise.wrapT=vi,this.bluenoise.minFilter=Mt,this.bluenoise.magFilter=Mt,this.bluenoise.needsUpdate=!0,this.lastTime=0,this.timeRollingAverage=.99,this._r=new xe,this._c=new ze}configureHalfResTargets(){if(this.firstFrame(),this.configuration.halfRes){this.depthDownsampleTarget=new uv(this.width/2,this.height/2,2),this.depthDownsampleTarget.textures[0].format=Fs,this.depthDownsampleTarget.textures[0].type=Zt,this.depthDownsampleTarget.textures[0].minFilter=Mt,this.depthDownsampleTarget.textures[0].magFilter=Mt,this.depthDownsampleTarget.textures[0].depthBuffer=!1,this.depthDownsampleTarget.textures[1].format=It,this.depthDownsampleTarget.textures[1].type=Ct,this.depthDownsampleTarget.textures[1].minFilter=Mt,this.depthDownsampleTarget.textures[1].magFilter=Mt,this.depthDownsampleTarget.textures[1].depthBuffer=!1;const e={...av};this.configuration.depthBufferType===Lt.Reverse&&(e.fragmentShader=`#define REVERSEDEPTH
`+e.fragmentShader),this.depthDownsampleQuad=new Wi(new ft(e))}else this.depthDownsampleTarget&&(this.depthDownsampleTarget.dispose(),this.depthDownsampleTarget=null),this.depthDownsampleQuad&&(this.depthDownsampleQuad.dispose(),this.depthDownsampleQuad=null)}detectTransparency(){if(this.autoDetectTransparency){let e=!1;this.scene.traverse(t=>{t.material&&t.material.transparent&&(e=!0)}),this.configuration.transparencyAware=e}}configureTransparencyTarget(){this.configuration.transparencyAware?(this.transparencyRenderTargetDWFalse=new Tt(this.width,this.height,{minFilter:gt,magFilter:Mt,type:Ct,format:It}),this.transparencyRenderTargetDWTrue=new Tt(this.width,this.height,{minFilter:gt,magFilter:Mt,type:Ct,format:It}),this.transparencyRenderTargetDWTrue.depthTexture=new Ts(this.width,this.height,yn),this.depthCopyPass=new Wi(new ft({uniforms:{depthTexture:{value:this.depthTexture},reverseDepthBuffer:{value:this.configuration.depthBufferType===Lt.Reverse}},vertexShader:`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 1);
                        }`,fragmentShader:`
                        uniform sampler2D depthTexture;
                        uniform bool reverseDepthBuffer;
                        varying vec2 vUv;
                        void main() {
                            if (reverseDepthBuffer) {
                           float d = 1.0 - texture2D(depthTexture, vUv).r;
                       
                           d += 0.00001;
                           gl_FragDepth = 1.0 - d;
                        } else {
                            float d = texture2D(depthTexture, vUv).r;
                            d += 0.00001;
                            gl_FragDepth = d;
                        }
                           gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        }
                        `}))):(this.transparencyRenderTargetDWFalse&&(this.transparencyRenderTargetDWFalse.dispose(),this.transparencyRenderTargetDWFalse=null),this.transparencyRenderTargetDWTrue&&(this.transparencyRenderTargetDWTrue.dispose(),this.transparencyRenderTargetDWTrue=null),this.depthCopyPass&&(this.depthCopyPass.dispose(),this.depthCopyPass=null))}renderTransparency(e){const t=this.scene.background,n=e.getClearColor(new ze),i=e.getClearAlpha(),r=new Map,a=e.autoClearDepth;this.scene.traverse(o=>{r.set(o,o.visible)}),this.scene.background=null,e.autoClearDepth=!1,e.setClearColor(new ze(0,0,0),0),this.depthCopyPass.material.uniforms.depthTexture.value=this.beautyRenderTarget.depthTexture,this.depthCopyPass.material.uniforms.reverseDepthBuffer.value=this.configuration.depthBufferType===Lt.Reverse,e.setRenderTarget(this.transparencyRenderTargetDWFalse),this.scene.traverse(o=>{o.material&&(o.visible=r.get(o)&&(o.material.transparent&&!o.material.depthWrite&&!o.userData.treatAsOpaque||!!o.userData.cannotReceiveAO))}),e.clear(!0,!0,!0),this.depthCopyPass.render(e),e.render(this.scene,this.camera),e.setRenderTarget(this.transparencyRenderTargetDWTrue),this.scene.traverse(o=>{o.material&&(o.visible=r.get(o)&&o.material.transparent&&o.material.depthWrite&&!o.userData.treatAsOpaque)}),e.clear(!0,!0,!0),this.depthCopyPass.render(e),e.render(this.scene,this.camera),this.scene.traverse(o=>{o.visible=r.get(o)}),e.setClearColor(n,i),this.scene.background=t,e.autoClearDepth=a}configureSampleDependentPasses(){this.firstFrame(),this.configureAOPass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.depthBufferType,this.camera.isOrthographicCamera)}configureAOPass(e=Lt.Default,t=!1){this.firstFrame(),this.samples=this.generateHemisphereSamples(this.configuration.aoSamples);const n={...iv};n.fragmentShader=n.fragmentShader.replace("16",this.configuration.aoSamples).replace("16.0",this.configuration.aoSamples+".0"),e===Lt.Log?n.fragmentShader=`#define LOGDEPTH
`+n.fragmentShader:e===Lt.Reverse&&(n.fragmentShader=`#define REVERSEDEPTH
`+n.fragmentShader),t&&(n.fragmentShader=`#define ORTHO
`+n.fragmentShader),this.configuration.halfRes&&(n.fragmentShader=`#define HALFRES
`+n.fragmentShader),this.effectShaderQuad?(this.effectShaderQuad.material.dispose(),this.effectShaderQuad.material=new ft(n)):this.effectShaderQuad=new Wi(new ft(n))}configureDenoisePass(e=Lt.Default,t=!1){this.firstFrame(),this.samplesDenoise=this.generateDenoiseSamples(this.configuration.denoiseSamples,11);const n={...rv};n.fragmentShader=n.fragmentShader.replace("16",this.configuration.denoiseSamples),e===Lt.Log?n.fragmentShader=`#define LOGDEPTH
`+n.fragmentShader:e===Lt.Reverse&&(n.fragmentShader=`#define REVERSEDEPTH
`+n.fragmentShader),t&&(n.fragmentShader=`#define ORTHO
`+n.fragmentShader),this.poissonBlurQuad?(this.poissonBlurQuad.material.dispose(),this.poissonBlurQuad.material=new ft(n)):this.poissonBlurQuad=new Wi(new ft(n))}configureEffectCompositer(e=Lt.Default,t=!1){this.firstFrame();const n={...sv};e===Lt.Log?n.fragmentShader=`#define LOGDEPTH
`+n.fragmentShader:e===Lt.Reverse&&(n.fragmentShader=`#define REVERSEDEPTH
`+n.fragmentShader),t&&(n.fragmentShader=`#define ORTHO
`+n.fragmentShader),this.configuration.halfRes&&this.configuration.depthAwareUpsampling&&(n.fragmentShader=`#define HALFRES
`+n.fragmentShader),this.effectCompositerQuad?(this.effectCompositerQuad.material.dispose(),this.effectCompositerQuad.material=new ft(n)):this.effectCompositerQuad=new Wi(new ft(n))}generateHemisphereSamples(e){const t=[];for(let n=0;n<e;n++){const i=2.399963*n;let r=Math.sqrt(n+.5)/Math.sqrt(e);const a=r*Math.cos(i),o=r*Math.sin(i),l=Math.sqrt(1-(a*a+o*o));t.push(new I(a,o,l))}return t}generateDenoiseSamples(e,t){const n=2*Math.PI*t/e,i=1/e,r=i,a=[];let o=i,l=0;for(let c=0;c<e;c++)a.push(new xe(Math.cos(l),Math.sin(l)).multiplyScalar(Math.pow(o,.75))),o+=r,l+=n;return a}setSize(e,t){this.firstFrame(),this.width=e,this.height=t;const n=this.configuration.halfRes?.5:1;this.beautyRenderTarget.setSize(e,t),this.writeTargetInternal.setSize(e*n,t*n),this.readTargetInternal.setSize(e*n,t*n),this.accumulationRenderTarget.setSize(e*n,t*n),this.configuration.halfRes&&this.depthDownsampleTarget.setSize(e*n,t*n),this.configuration.transparencyAware&&(this.transparencyRenderTargetDWFalse.setSize(e,t),this.transparencyRenderTargetDWTrue.setSize(e,t))}firstFrame(){this.needsFrame=!0}render(e,t,n,i,r){(e.capabilities.logarithmicDepthBuffer&&this.configuration.depthBufferType!==Lt.Log||e.capabilities.reverseDepthBuffer&&this.configuration.depthBufferType!==Lt.Reverse)&&(this.configuration.depthBufferType=e.capabilities.logarithmicDepthBuffer?Lt.Log:e.capabilities.reverseDepthBuffer?Lt.Reverse:Lt.Default,this.configureAOPass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.configureDenoisePass(this.configuration.depthBufferType,this.camera.isOrthographicCamera),this.configureEffectCompositer(this.configuration.depthBufferType,this.camera.isOrthographicCamera)),this.detectTransparency(),this.camera.updateMatrixWorld(),this.lastViewMatrix.equals(this.camera.matrixWorldInverse)&&this.lastProjectionMatrix.equals(this.camera.projectionMatrix)&&this.configuration.accumulate&&!this.needsFrame?this.frame++:(this.configuration.accumulate&&(e.setRenderTarget(this.accumulationRenderTarget),e.clear(!0,!0,!0)),this.frame=0,this.needsFrame=!1),this.lastViewMatrix.copy(this.camera.matrixWorldInverse),this.lastProjectionMatrix.copy(this.camera.projectionMatrix);let a,o,l;this.debugMode&&(a=e.getContext(),o=a.getExtension("EXT_disjoint_timer_query_webgl2"),o===null&&(console.error("EXT_disjoint_timer_query_webgl2 not available, disabling debug mode."),this.debugMode=!1)),this.configuration.autoRenderBeauty&&(e.setRenderTarget(this.beautyRenderTarget),e.render(this.scene,this.camera),this.configuration.transparencyAware&&this.renderTransparency(e)),this.debugMode&&(l=a.createQuery(),a.beginQuery(o.TIME_ELAPSED_EXT,l));const c=e.xr.enabled;e.xr.enabled=!1,this._r.set(this.width,this.height);let h=this.configuration.aoRadius;if(this.configuration.halfRes&&this.configuration.screenSpaceRadius&&(h*=.5),this.frame<1024/this.configuration.aoSamples){this.configuration.halfRes&&(e.setRenderTarget(this.depthDownsampleTarget),this.depthDownsampleQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.depthDownsampleQuad.material.uniforms.resolution.value=this._r,this.depthDownsampleQuad.material.uniforms.near.value=this.camera.near,this.depthDownsampleQuad.material.uniforms.far.value=this.camera.far,this.depthDownsampleQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.depthDownsampleQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.depthDownsampleQuad.material.uniforms.logDepth.value=this.configuration.depthBufferType===Lt.Log,this.depthDownsampleQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.depthDownsampleQuad.render(e)),this.effectShaderQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectShaderQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectShaderQuad.material.uniforms.sceneNormal.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[1]:null,this.effectShaderQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.effectShaderQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.effectShaderQuad.material.uniforms.projViewMat.value=this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse.clone()),this.effectShaderQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectShaderQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectShaderQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new I),this.effectShaderQuad.material.uniforms.biasAdjustment.value=new xe(this.configuration.biasOffset,this.configuration.biasMultiplier),this.effectShaderQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.effectShaderQuad.material.uniforms.time.value=performance.now()/1e3,this.effectShaderQuad.material.uniforms.samples.value=this.samples,this.effectShaderQuad.material.uniforms.bluenoise.value=this.bluenoise,this.effectShaderQuad.material.uniforms.radius.value=h,this.effectShaderQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectShaderQuad.material.uniforms.near.value=this.camera.near,this.effectShaderQuad.material.uniforms.far.value=this.camera.far,this.effectShaderQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectShaderQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectShaderQuad.material.uniforms.frame.value=this.frame,e.setRenderTarget(this.writeTargetInternal),this.effectShaderQuad.render(e);for(let d=0;d<this.configuration.denoiseIterations;d++)[this.writeTargetInternal,this.readTargetInternal]=[this.readTargetInternal,this.writeTargetInternal],this.poissonBlurQuad.material.uniforms.tDiffuse.value=this.readTargetInternal.texture,this.poissonBlurQuad.material.uniforms.sceneDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.poissonBlurQuad.material.uniforms.projMat.value=this.camera.projectionMatrix,this.poissonBlurQuad.material.uniforms.viewMat.value=this.camera.matrixWorldInverse,this.poissonBlurQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.poissonBlurQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.poissonBlurQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new I),this.poissonBlurQuad.material.uniforms.resolution.value=this.configuration.halfRes?this._r.clone().multiplyScalar(.5).floor():this._r,this.poissonBlurQuad.material.uniforms.time.value=performance.now()/1e3,this.poissonBlurQuad.material.uniforms.blueNoise.value=this.bluenoise,this.poissonBlurQuad.material.uniforms.radius.value=this.configuration.denoiseRadius*(this.configuration.halfRes?.5:1),this.poissonBlurQuad.material.uniforms.worldRadius.value=h,this.poissonBlurQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.poissonBlurQuad.material.uniforms.index.value=d,this.poissonBlurQuad.material.uniforms.poissonDisk.value=this.samplesDenoise,this.poissonBlurQuad.material.uniforms.near.value=this.camera.near,this.poissonBlurQuad.material.uniforms.far.value=this.camera.far,this.poissonBlurQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,e.setRenderTarget(this.writeTargetInternal),this.poissonBlurQuad.render(e);e.setRenderTarget(this.accumulationRenderTarget);const u=e.autoClear;e.autoClear=!1,this.accumulationQuad.material.uniforms.tDiffuse.value=this.writeTargetInternal.texture,this.accumulationQuad.material.uniforms.frame.value=this.frame,this.accumulationQuad.render(e),e.autoClear=u}this.configuration.transparencyAware&&(this.effectCompositerQuad.material.uniforms.transparencyDWFalse.value=this.transparencyRenderTargetDWFalse.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrue.value=this.transparencyRenderTargetDWTrue.texture,this.effectCompositerQuad.material.uniforms.transparencyDWTrueDepth.value=this.transparencyRenderTargetDWTrue.depthTexture,this.effectCompositerQuad.material.uniforms.transparencyAware.value=!0),this.effectCompositerQuad.material.uniforms.sceneDiffuse.value=this.beautyRenderTarget.texture,this.effectCompositerQuad.material.uniforms.sceneDepth.value=this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.aoTones.value=this.configuration.aoTones,this.effectCompositerQuad.material.uniforms.near.value=this.camera.near,this.effectCompositerQuad.material.uniforms.far.value=this.camera.far,this.effectCompositerQuad.material.uniforms.projectionMatrixInv.value=this.camera.projectionMatrixInverse,this.effectCompositerQuad.material.uniforms.viewMatrixInv.value=this.camera.matrixWorld,this.effectCompositerQuad.material.uniforms.ortho.value=this.camera.isOrthographicCamera,this.effectCompositerQuad.material.uniforms.downsampledDepth.value=this.configuration.halfRes?this.depthDownsampleTarget.textures[0]:this.beautyRenderTarget.depthTexture,this.effectCompositerQuad.material.uniforms.resolution.value=this._r,this.effectCompositerQuad.material.uniforms.blueNoise.value=this.bluenoise,this.effectCompositerQuad.material.uniforms.intensity.value=this.configuration.intensity,this.effectCompositerQuad.material.uniforms.renderMode.value=this.configuration.renderMode,this.effectCompositerQuad.material.uniforms.screenSpaceRadius.value=this.configuration.screenSpaceRadius,this.effectCompositerQuad.material.uniforms.radius.value=h,this.effectCompositerQuad.material.uniforms.distanceFalloff.value=this.configuration.distanceFalloff,this.effectCompositerQuad.material.uniforms.gammaCorrection.value=this.configuration.gammaCorrection,this.effectCompositerQuad.material.uniforms.tDiffuse.value=this.accumulationRenderTarget.texture,this.effectCompositerQuad.material.uniforms.color.value=this._c.copy(this.configuration.color).convertSRGBToLinear(),this.effectCompositerQuad.material.uniforms.colorMultiply.value=this.configuration.colorMultiply,this.effectCompositerQuad.material.uniforms.cameraPos.value=this.camera.getWorldPosition(new I),this.effectCompositerQuad.material.uniforms.fog.value=!!this.scene.fog,this.scene.fog&&(this.scene.fog.isFog?(this.effectCompositerQuad.material.uniforms.fogExp.value=!1,this.effectCompositerQuad.material.uniforms.fogNear.value=this.scene.fog.near,this.effectCompositerQuad.material.uniforms.fogFar.value=this.scene.fog.far):this.scene.fog.isFogExp2?(this.effectCompositerQuad.material.uniforms.fogExp.value=!0,this.effectCompositerQuad.material.uniforms.fogDensity.value=this.scene.fog.density):console.error(`Unsupported fog type ${this.scene.fog.constructor.name} in SSAOPass.`)),e.setRenderTarget(this.renderToScreen?null:t),this.effectCompositerQuad.render(e),this.debugMode&&(a.endQuery(o.TIME_ELAPSED_EXT),th(l,a,this)),e.xr.enabled=c}enableDebugMode(){this.debugMode=!0}disableDebugMode(){this.debugMode=!1}setDisplayMode(e){this.configuration.renderMode=["Combined","AO","No AO","Split","Split AO"].indexOf(e)}setQualityMode(e){e==="Performance"?(this.configuration.aoSamples=8,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):e==="Low"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=4,this.configuration.denoiseRadius=12):e==="Medium"?(this.configuration.aoSamples=16,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=12):e==="High"?(this.configuration.aoSamples=64,this.configuration.denoiseSamples=8,this.configuration.denoiseRadius=6):e==="Ultra"&&(this.configuration.aoSamples=64,this.configuration.denoiseSamples=16,this.configuration.denoiseRadius=6)}}const fv={uniforms:{tDiffuse:{value:null},uBlurStrength:{value:0},uCenter:{value:new xe(.5,.56)},uCarMaskCenter:{value:new xe(.5,.34)},uCarMaskRadii:{value:new xe(.24,.22)},uSunScreenPos:{value:new xe(.5,.6)},uSunFlareStrength:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uBlurStrength;
    uniform vec2 uCenter;
    uniform vec2 uCarMaskCenter;
    uniform vec2 uCarMaskRadii;
    uniform vec2 uSunScreenPos;
    uniform float uSunFlareStrength;
    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      vec3 col = base.rgb;

      if (uBlurStrength > 0.001) {
        // Elliptical protection mask around player hero car so car paint, rims & decals stay 100% razor sharp!
        vec2 carDelta = (vUv - uCarMaskCenter) / uCarMaskRadii;
        float carProtect = smoothstep(0.75, 1.35, dot(carDelta, carDelta));

        vec2 dir = vUv - uCenter;
        float distEdge = length(dir);
        float radialMask = smoothstep(0.14, 0.72, distEdge) * carProtect;
        float strength = uBlurStrength * radialMask;

        if (strength > 0.0005) {
          vec3 acc = col * 0.28;
          float wSum = 0.28;
          vec2 stepVec = dir * strength * 0.042;
          for (int i = 1; i <= 6; i++) {
            float fi = float(i) / 6.0;
            float w = 1.0 - fi * 0.72;
            vec2 sUv = clamp(vUv - stepVec * fi, vec2(0.001), vec2(0.999));
            acc += texture2D(tDiffuse, sUv).rgb * w;
            wSum += w;
          }
          col = acc / wSum;
        }
      }

      // Subtle golden-hour directional sun anamorphic glare & warm halo (tasteful, never blinding!)
      if (uSunFlareStrength > 0.001) {
        vec2 sd = vUv - uSunScreenPos;
        sd.x *= 1.777;
        float r = length(sd);
        float halo = exp(-r * 5.2) * 0.11 * uSunFlareStrength;
        float streak = exp(-abs(sd.y) * 40.0) * exp(-abs(sd.x) * 2.8) * 0.08 * uSunFlareStrength;
        col += vec3(1.0, 0.74, 0.42) * (halo + streak);
      }

      gl_FragColor = vec4(col, base.a);
    }
  `};class pv{constructor(e,t){B(this,"renderer");B(this,"scene");B(this,"camera");B(this,"csm");B(this,"composer");B(this,"renderTarget");B(this,"renderPass");B(this,"n8aoPass");B(this,"bloomPass");B(this,"motionBlurPass");B(this,"outputPass");B(this,"smaaPass");B(this,"quality","high");B(this,"lighting","golden_hour");B(this,"cameraMode","chase");B(this,"camCurrentPos",new I(0,6,20));B(this,"camCurrentLook",new I(0,3,0));B(this,"camInitialized",!1);B(this,"sunDirWorld",new I(-.46,.16,-.87).normalize());B(this,"tmpVec",new I);B(this,"tmpFwd",new I);B(this,"tmpUp",new I);B(this,"tmpTargetPos",new I);B(this,"tmpLook",new I);B(this,"tmpHit",{hit:!0,y:0,normal:new I(0,1,0),surface:"asphalt"});this.scene=t,this.camera=new Qt(62,window.innerWidth/window.innerHeight,.15,4200),this.renderer=new dg({canvas:e,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1}),this.renderer.setSize(window.innerWidth,window.innerHeight,!1),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ac,this.renderer.toneMapping=_r,this.renderer.toneMappingExposure=1.02,this.renderer.outputColorSpace=Vt,this.renderer.info.autoReset=!1,this.initCSM("high"),this.initComposer("high")}initCSM(e){this.csm&&(this.csm.remove(),this.csm.dispose());const t=e==="high";this.csm=new Vg({maxFar:t?255:150,cascades:t?3:2,mode:"custom",customSplitsCallback:(n,i,r,a)=>{n===3?a.push(22/r,85/r,1):a.push(32/r,1)},parent:this.scene,shadowMapSize:t?2048:1024,lightDirection:this.sunDirWorld.clone().negate(),camera:this.camera,lightIntensity:2.8,shadowBias:-25e-5}),this.csm.fade=!0;for(const n of this.csm.lights)n.shadow.normalBias=.035,n.shadow.bias=-22e-5,n.shadow.radius=2.2;this.applyLightingToCSM(this.lighting,this.sunDirWorld)}initComposer(e){var a,o;this.composer&&((a=this.n8aoPass)==null||a.dispose(),(o=this.renderTarget)==null||o.dispose());const t=e==="high",n=t?Math.min(window.devicePixelRatio||1,1.5):.78;this.renderer.setPixelRatio(n);const i=Math.max(1,Math.floor(window.innerWidth*n)),r=Math.max(1,Math.floor(window.innerHeight*n));this.renderTarget=new Tt(i,r,{type:Ct,samples:t?4:0}),this.composer=new Zg(this.renderer,this.renderTarget),this.composer.setPixelRatio(n),this.composer.setSize(window.innerWidth,window.innerHeight),this.renderPass=new Kg(this.scene,this.camera),this.composer.addPass(this.renderPass),this.n8aoPass=new dv(this.scene,this.camera,i,r),this.n8aoPass.setQualityMode(t?"Medium":"Performance"),this.n8aoPass.configuration.aoRadius=2.4,this.n8aoPass.configuration.distanceFalloff=1.15,this.n8aoPass.configuration.intensity=t?2.15:0,this.n8aoPass.configuration.halfRes=!0,this.n8aoPass.configuration.depthAwareUpsampling=!0,this.n8aoPass.configuration.gammaCorrection=!1,this.n8aoPass.enabled=t,this.composer.addPass(this.n8aoPass),this.bloomPass=new is(new xe(i,r),t?.28:.14,.55,1.08),this.bloomPass.enabled=t,this.composer.addPass(this.bloomPass),this.motionBlurPass=new eh(fv),this.motionBlurPass.enabled=t,this.composer.addPass(this.motionBlurPass),this.outputPass=new Jg,this.composer.addPass(this.outputPass),this.smaaPass=new $g(i,r),this.smaaPass.enabled=t,this.composer.addPass(this.smaaPass)}registerMaterialForCSM(e){try{if(e.userData.__csmInstance===this.csm)return;if(!e.userData.__csmSavedOrig){const r=_i.prototype.onBeforeCompile;e.userData.__origOBC=e.onBeforeCompile&&e.onBeforeCompile!==r?e.onBeforeCompile:null,e.userData.__origCacheKey=e.customProgramCacheKey,e.userData.__csmSavedOrig=!0}const t=e.userData.__origOBC,n=e.userData.__origCacheKey;this.csm.setupMaterial(e);const i=e.onBeforeCompile;if(t){e.onBeforeCompile=(a,o)=>{i.call(e,a,o),t.call(e,a,o)};const r=this.csm.cascades;e.customProgramCacheKey=()=>`${n?n.call(e):"custom"}_csm${r}`}e.userData.__csmInstance=this.csm,e.needsUpdate=!0}catch{}}registerSceneMaterialsForCSM(){const e=new Set;this.scene.traverse(t=>{if(t instanceof Ee){const n=Array.isArray(t.material)?t.material:[t.material];for(const i of n)!i||e.has(i)||(e.add(i),(i instanceof Xe||i instanceof In)&&this.registerMaterialForCSM(i))}})}setQuality(e){this.quality!==e&&(this.quality=e,this.initCSM(e),this.initComposer(e),this.registerSceneMaterialsForCSM())}applyLightingToCSM(e,t){if(this.lighting=e,this.sunDirWorld.copy(t).normalize(),!this.csm)return;this.csm.lightDirection.copy(this.sunDirWorld).negate();const n=e==="night",i=n?new ze(7050456):new ze(16758888),r=n?.36:3.55;for(const a of this.csm.lights)a.color.copy(i),a.intensity=r;this.renderer.toneMappingExposure=n?.96:1.04,this.bloomPass&&(this.bloomPass.strength=this.quality==="high"?n?.26:.14:.12,this.bloomPass.threshold=n?1.28:2.1)}resize(e,t){const n=Math.max(1,e),i=Math.max(1,t);this.camera.aspect=n/i,this.camera.updateProjectionMatrix(),this.renderer.setSize(n,i,!1),this.composer.setSize(n,i),this.csm.updateFrustums()}resetCameraSnap(){this.camInitialized=!1}updateGameplayCamera(e,t,n,i,r){const a=t.telemetry.speedKmh,o=t.telemetry.nitroActive?1:0;if(this.cameraMode==="cockpit"){n.setCockpitVisible(!0),n.root.updateMatrixWorld(!0),n.cockpitCameraAnchor.getWorldPosition(this.tmpTargetPos);const _=Math.sin(r*36)*.0025*Ge(a/120,0,1),C=Ge(-t.telemetry.lateralG*.024,-.04,.04);this.tmpFwd.set(0,0,-1).applyQuaternion(n.root.quaternion);const M=new I(1,0,0).applyQuaternion(n.root.quaternion),S=new I(0,1,0).applyQuaternion(n.root.quaternion);this.camera.position.copy(this.tmpTargetPos).addScaledVector(M,C).addScaledVector(S,_),this.tmpLook.copy(this.camera.position).addScaledVector(this.tmpFwd,40).addScaledVector(S,-1.05),this.camera.up.copy(S),this.camera.lookAt(this.tmpLook);const D=64+Ge(a/180,0,1)*7+o*4;this.camera.fov=St(this.camera.fov,D,Math.min(1,8*e)),this.camera.updateProjectionMatrix(),this.motionBlurPass.uniforms.uBlurStrength.value=0;return}n.setCockpitVisible(!1),this.camera.up.set(0,1,0);const l=Math.sin(t.yaw),c=Math.cos(t.yaw),h=-l,u=-c,d=c,f=-l,g=Ge(a/160,0,1),v=5.85+g*.55+o*.45,p=1.85+g*.1,m=Ge(t.telemetry.steerVisualNorm*.38,-.45,.45);this.tmpTargetPos.set(n.root.position.x-h*v+d*m,n.root.position.y+p,n.root.position.z-u*v+f*m);const y=i.raycastDown(this.tmpTargetPos.x,this.tmpTargetPos.y+8,this.tmpTargetPos.z,this.tmpHit).y+.85;this.tmpTargetPos.y<y&&(this.tmpTargetPos.y=y);const x=i.resolveHorizontalCollision(this.tmpTargetPos.x,this.tmpTargetPos.y,this.tmpTargetPos.z,.75);if(x.hit&&(this.tmpTargetPos.x+=x.pushX*1.1,this.tmpTargetPos.z+=x.pushZ*1.1),this.tmpLook.set(n.root.position.x+h*14,n.root.position.y+1.32,n.root.position.z+u*14),!this.camInitialized)this.camCurrentPos.copy(this.tmpTargetPos),this.camCurrentLook.copy(this.tmpLook),this.camInitialized=!0;else{const _=1-Math.exp(-10.5*e),C=1-Math.exp(-14*e);this.camCurrentPos.lerp(this.tmpTargetPos,_),this.camCurrentLook.lerp(this.tmpLook,C);const M=i.raycastDown(this.camCurrentPos.x,this.camCurrentPos.y+8,this.camCurrentPos.z,this.tmpHit);this.camCurrentPos.y<M.y+.75&&(this.camCurrentPos.y=M.y+.75)}this.camera.position.copy(this.camCurrentPos),this.camera.lookAt(this.camCurrentLook);const b=60+g*10.5+o*4.5;this.camera.fov=St(this.camera.fov,b,Math.min(1,7*e)),this.camera.updateProjectionMatrix();const E=this.quality==="high"?Ge((a-55)/105,0,1)*.5+o*.24:0;this.motionBlurPass.uniforms.uBlurStrength.value=E}setStaticBlurZero(){this.motionBlurPass.uniforms.uBlurStrength.value=0}updateSunFlareUniform(){if(this.lighting==="night"||this.quality==="low"){this.motionBlurPass.uniforms.uSunFlareStrength.value=0;return}this.tmpVec.copy(this.camera.position).addScaledVector(this.sunDirWorld,2e3),this.tmpVec.project(this.camera);const t=this.camera.getWorldDirection(this.tmpFwd).dot(this.sunDirWorld);if(t>.25&&this.tmpVec.z<1){const n=this.tmpVec.x*.5+.5,i=this.tmpVec.y*.5+.5;this.motionBlurPass.uniforms.uSunScreenPos.value.set(n,i);const r=Ge(1-Math.max(Math.abs(n-.5),Math.abs(i-.5))*1.1,0,1);this.motionBlurPass.uniforms.uSunFlareStrength.value=mv(t)*r}else this.motionBlurPass.uniforms.uSunFlareStrength.value=0}render(){this.renderer.info.reset(),this.csm.update(),this.updateSunFlareUniform(),this.composer.render()}async precompileShaders(){this.csm.update(),typeof this.renderer.compileAsync=="function"?await this.renderer.compileAsync(this.scene,this.camera):this.renderer.compile(this.scene,this.camera)}getAuditInfo(){var t,n,i,r,a,o,l,c;const e=this.quality==="high";return{quality:this.quality,csmActive:!!this.csm&&this.csm.cascades>=2,csmCascades:((t=this.csm)==null?void 0:t.cascades)??0,csmShadowMapSize:((n=this.csm)==null?void 0:n.shadowMapSize)??0,aoActive:!!((i=this.n8aoPass)!=null&&i.enabled),aoMethod:(r=this.n8aoPass)!=null&&r.enabled?"N8AO (GTAO/HBAO)":"disabled (Low preset)",toneMapping:this.renderer.toneMapping===_r?"AgX":"ACES",antiAliasing:e?"WebGL2 MSAA 4x + SMAA":"Native WebGL AA",msaaSamples:((a=this.renderTarget)==null?void 0:a.samples)??0,smaaActive:!!((o=this.smaaPass)!=null&&o.enabled),bloomActive:!!((l=this.bloomPass)!=null&&l.enabled),backgroundMotionBlurActive:!!((c=this.motionBlurPass)!=null&&c.enabled)}}}function mv(s){return Ge((s-.25)/.72,0,1)}class gv{constructor(){B(this,"ctx",null);B(this,"buffers",new Map);B(this,"loadingPromise",null);B(this,"loaded",!1);B(this,"masterGain");B(this,"playerBus");B(this,"aiBus");B(this,"sfxBus");B(this,"ambienceBus");B(this,"uiBus");B(this,"musicBus");B(this,"limiterComp");B(this,"brickwallShaper");B(this,"mediaDest",null);B(this,"meterAnalyser");B(this,"meterBuf",new Float32Array(2048));B(this,"activeSources",new Set);B(this,"playerBands",[]);B(this,"playerFilter");B(this,"playerLoadGain");B(this,"playerShiftGain");B(this,"currentEngineType","gt");B(this,"screechGain");B(this,"screechSrc",null);B(this,"asphaltGain");B(this,"asphaltFilter");B(this,"gravelGain");B(this,"windGain");B(this,"scrapeGain");B(this,"nitroGain");B(this,"nitroSrc",null);B(this,"ambOceanGain");B(this,"ambVillageGain");B(this,"ambForestGain");B(this,"ambNightGain");B(this,"bellTimer",12);B(this,"aiVoices",[]);B(this,"pcmRecording",!1);B(this,"pcmLeftChunks",[]);B(this,"pcmRightChunks",[]);B(this,"pcmProcessor",null);B(this,"pcmPeakLinear",0);B(this,"raceStarted",!1);B(this,"paused",!1);B(this,"maxSimultaneousVoices",0);B(this,"masterPeakLinear",1e-4);B(this,"volumes",{master:.85,sfx:.9,music:.45});B(this,"events",[]);B(this,"lastEventTimes",new Map);B(this,"prevOnBridge",!1);B(this,"wasNitroActive",!1);B(this,"AUDIO_FILES",{engine_gt_0:"./assets/audio/engine_gt_0.wav",engine_gt_1:"./assets/audio/engine_gt_1.wav",engine_gt_2:"./assets/audio/engine_gt_2.wav",engine_gt_3:"./assets/audio/engine_gt_3.wav",engine_gt_4:"./assets/audio/engine_gt_4.wav",engine_gt_5:"./assets/audio/engine_gt_5.wav",engine_corsa_0:"./assets/audio/engine_corsa_0.mp3",engine_corsa_1:"./assets/audio/engine_corsa_1.mp3",engine_corsa_2:"./assets/audio/engine_corsa_2.mp3",engine_corsa_3:"./assets/audio/engine_corsa_3.mp3",engine_corsa_in_low:"./assets/audio/engine_corsa_in_low.mp3",engine_corsa_in_high:"./assets/audio/engine_corsa_in_high.mp3",tire_screech:"./assets/audio/tire_screech.mp3",roll_asphalt:"./assets/audio/roll_asphalt.mp3",roll_gravel:"./assets/audio/roll_gravel.mp3",wind_coast:"./assets/audio/wind_coast.mp3",impact_crash:"./assets/audio/impact_crash.mp3",metal_scrape:"./assets/audio/metal_scrape.mp3",exhaust_pop:"./assets/audio/exhaust_pop.mp3",nitro_whoosh:"./assets/audio/nitro_whoosh.mp3",amb_ocean_gulls:"./assets/audio/amb_ocean_gulls.mp3",amb_village:"./assets/audio/amb_village.mp3",amb_church_bell:"./assets/audio/amb_church_bell.mp3",amb_forest_birds:"./assets/audio/amb_forest_birds.mp3",amb_cicadas_day:"./assets/audio/amb_cicadas_day.mp3",amb_crickets_night:"./assets/audio/amb_crickets_night.mp3"})}makeSeamlessLoop(e){if(!this.ctx)return e;const t=e.sampleRate;e.getChannelData(0);const n=e.length,i=Math.min(Math.floor(t*.12),Math.floor(n*.15)),r=Math.min(Math.floor(t*.12),Math.floor(n*.15)),a=n-i-r;if(a<t*.3)return e;const o=Math.min(Math.floor(t*.045),Math.floor(a*.15)),l=a-o;if(l<=128)return e;const c=this.ctx.createBuffer(e.numberOfChannels,l,t);for(let h=0;h<e.numberOfChannels;h++){const u=e.getChannelData(h),d=c.getChannelData(h);for(let f=0;f<l;f++)d[f]=u[i+f];for(let f=0;f<o;f++){const g=f/o,v=Math.sin(g*Math.PI*.5),p=Math.cos(g*Math.PI*.5);d[f]=d[f]*v+u[i+l+f]*p}}return c}async unlock(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;try{this.ctx=new e({sampleRate:48e3})}catch{this.ctx=new e}this.setupMixingGraph()}this.ctx.state==="suspended"&&await this.ctx.resume(),this.loadingPromise||(this.loadingPromise=this.loadAllAudioBuffers()),await this.loadingPromise}setupMixingGraph(){const e=this.ctx;this.playerBus=e.createGain(),this.aiBus=e.createGain(),this.sfxBus=e.createGain(),this.ambienceBus=e.createGain(),this.uiBus=e.createGain(),this.musicBus=e.createGain(),this.masterGain=e.createGain(),this.limiterComp=e.createDynamicsCompressor(),this.limiterComp.threshold.value=-7,this.limiterComp.knee.value=6,this.limiterComp.ratio.value=18,this.limiterComp.attack.value=.002,this.limiterComp.release.value=.08,this.brickwallShaper=e.createWaveShaper();const t=4096,n=new Float32Array(t),i=.86;for(let r=0;r<t;r++){const a=r/(t-1)*2-1;n[r]=i*Math.tanh(a/i)}this.brickwallShaper.curve=n,this.brickwallShaper.oversample="2x",this.meterAnalyser=e.createAnalyser(),this.meterAnalyser.fftSize=2048,this.playerBus.connect(this.masterGain),this.aiBus.connect(this.masterGain),this.sfxBus.connect(this.masterGain),this.ambienceBus.connect(this.masterGain),this.uiBus.connect(this.masterGain),this.musicBus.connect(this.masterGain),this.masterGain.connect(this.limiterComp),this.limiterComp.connect(this.brickwallShaper),this.brickwallShaper.connect(this.meterAnalyser),this.meterAnalyser.connect(e.destination),typeof e.createMediaStreamDestination=="function"&&(this.mediaDest=e.createMediaStreamDestination(),this.brickwallShaper.connect(this.mediaDest)),this.applyVolumeSettings()}async loadAllAudioBuffers(){if(!this.ctx)return;const e=Object.entries(this.AUDIO_FILES),t=new Set(["engine_gt_0","engine_gt_1","engine_gt_2","engine_gt_3","engine_gt_4","engine_gt_5","engine_corsa_0","engine_corsa_1","engine_corsa_2","engine_corsa_3","engine_corsa_in_low","engine_corsa_in_high","tire_screech","roll_asphalt","roll_gravel","wind_coast","metal_scrape","nitro_whoosh","amb_ocean_gulls","amb_village","amb_forest_birds","amb_cicadas_day","amb_crickets_night"]);await Promise.all(e.map(async([n,i])=>{try{const r=await fetch(i);if(!r.ok)return;const a=await r.arrayBuffer(),o=await this.ctx.decodeAudioData(a);this.buffers.set(n,t.has(n)?this.makeSeamlessLoop(o):o)}catch{}})),this.loaded=!0}setVolumes(e){this.volumes={...e},this.applyVolumeSettings()}applyVolumeSettings(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime,t=this.paused?0:Ge(this.volumes.master,0,1);this.masterGain.gain.setTargetAtTime(t*.85,e,.04),this.playerBus.gain.setTargetAtTime(this.volumes.sfx*.78,e,.04),this.aiBus.gain.setTargetAtTime(this.volumes.sfx*.42,e,.04),this.sfxBus.gain.setTargetAtTime(this.volumes.sfx*.72,e,.04),this.ambienceBus.gain.setTargetAtTime(this.volumes.sfx*.34,e,.04),this.uiBus.gain.setTargetAtTime(this.volumes.sfx*.55,e,.04),this.musicBus.gain.setTargetAtTime(this.volumes.music*.35,e,.04)}setPaused(e){this.paused=e,this.applyVolumeSettings()}createTrackedLoop(e,t,n=0){if(!this.ctx)return null;const i=this.buffers.get(e);if(!i)return null;const r=this.ctx.createBufferSource();r.buffer=i,r.loop=!0;const a=this.ctx.createGain();return a.gain.value=n,r.connect(a),a.connect(t),r.start(0),this.activeSources.add(r),r.onended=()=>this.activeSources.delete(r),this.activeSources.size>this.maxSimultaneousVoices&&(this.maxSimultaneousVoices=this.activeSources.size),{src:r,gain:a}}stopRaceAudio(){for(const e of Array.from(this.activeSources)){try{e.stop(),e.disconnect()}catch{}this.activeSources.delete(e)}this.playerBands=[],this.aiVoices=[],this.screechSrc=null,this.nitroSrc=null,this.raceStarted=!1}startRaceAudio(e,t){var d,f,g,v;if(!this.ctx||!this.loaded)return;this.stopRaceAudio(),this.currentEngineType=e,this.events=[],this.lastEventTimes.clear(),this.prevOnBridge=!1,this.wasNitroActive=!1,this.paused=!1,this.applyVolumeSettings();const n=this.ctx;this.playerFilter=n.createBiquadFilter(),this.playerFilter.type="lowpass",this.playerFilter.frequency.value=3200,this.playerFilter.Q.value=1.1,this.playerLoadGain=n.createGain(),this.playerLoadGain.gain.value=.65,this.playerShiftGain=n.createGain(),this.playerShiftGain.gain.value=1,this.playerFilter.connect(this.playerLoadGain),this.playerLoadGain.connect(this.playerShiftGain),this.playerShiftGain.connect(this.playerBus);const i=e==="gt"?[{key:"engine_gt_0",rpm:1100},{key:"engine_gt_1",rpm:2300},{key:"engine_gt_2",rpm:3700},{key:"engine_gt_3",rpm:5300},{key:"engine_gt_4",rpm:6900},{key:"engine_gt_5",rpm:8400}]:[{key:"engine_corsa_0",rpm:1e3},{key:"engine_corsa_1",rpm:2400},{key:"engine_corsa_2",rpm:4600},{key:"engine_corsa_3",rpm:7e3},{key:"engine_corsa_in_low",rpm:3e3},{key:"engine_corsa_in_high",rpm:6200}];for(const p of i){const m=this.createTrackedLoop(p.key,this.playerFilter,0);m&&this.playerBands.push({source:m.src,gain:m.gain,centerRpm:p.rpm})}const r=this.createTrackedLoop("tire_screech",this.sfxBus,0);this.screechGain=r?r.gain:n.createGain(),this.screechSrc=r?r.src:null,this.asphaltFilter=n.createBiquadFilter(),this.asphaltFilter.type="bandpass",this.asphaltFilter.frequency.value=480,this.asphaltFilter.Q.value=.6,this.asphaltFilter.connect(this.sfxBus);const a=this.createTrackedLoop("roll_asphalt",this.asphaltFilter,0);this.asphaltGain=a?a.gain:n.createGain();const o=this.createTrackedLoop("roll_gravel",this.sfxBus,0);this.gravelGain=o?o.gain:n.createGain();const l=this.createTrackedLoop("wind_coast",this.sfxBus,0);this.windGain=l?l.gain:n.createGain();const c=this.createTrackedLoop("metal_scrape",this.sfxBus,0);this.scrapeGain=c?c.gain:n.createGain();const h=this.createTrackedLoop("nitro_whoosh",this.sfxBus,0);this.nitroGain=h?h.gain:n.createGain(),this.nitroSrc=h?h.src:null,this.ambOceanGain=((d=this.createTrackedLoop("amb_ocean_gulls",this.ambienceBus,0))==null?void 0:d.gain)??n.createGain(),this.ambVillageGain=((f=this.createTrackedLoop("amb_village",this.ambienceBus,0))==null?void 0:f.gain)??n.createGain(),this.ambForestGain=((g=this.createTrackedLoop("amb_forest_birds",this.ambienceBus,0))==null?void 0:g.gain)??n.createGain(),this.ambNightGain=((v=this.createTrackedLoop("amb_crickets_night",this.ambienceBus,0))==null?void 0:v.gain)??n.createGain();const u=Math.min(5,t);for(let p=0;p<u;p++){const m=p%2===0?"engine_gt_2":"engine_corsa_2",w=this.buffers.get(m)??this.buffers.get("engine_gt_1");if(!w)continue;const y=n.createBufferSource();y.buffer=w,y.loop=!0;const x=n.createGain();x.gain.value=0;const b=n.createPanner();b.panningModel="equalpower",b.distanceModel="inverse",b.refDistance=9,b.maxDistance=135,b.rolloffFactor=1.45,y.connect(x),x.connect(b),b.connect(this.aiBus),y.start(0),this.activeSources.add(y),y.onended=()=>this.activeSources.delete(y),this.aiVoices.push({source:y,gain:x,panner:b,prevDist:40})}this.activeSources.size>this.maxSimultaneousVoices&&(this.maxSimultaneousVoices=this.activeSources.size),this.raceStarted=!0}playOneShot(e,t,n,i=1,r=0,a){if(!this.ctx||!this.loaded)return;const o=this.buffers.get(e);if(!o)return;const l=this.ctx.createBufferSource();l.buffer=o,l.playbackRate.value=i;const c=this.ctx.createGain();c.gain.value=n,l.connect(c),c.connect(t),this.activeSources.add(l),l.onended=()=>{this.activeSources.delete(l);try{l.disconnect(),c.disconnect()}catch{}},a?l.start(0,Math.min(r,Math.max(0,o.duration-.1)),a):l.start(0,r)}recordEvent(e,t,n,i){const r=this.lastEventTimes.get(e)??-99;t-r>=n&&(this.lastEventTimes.set(e,t),this.events.push({timeSec:Math.round(t*100)/100,type:e,detail:i}))}update(e,t,n,i,r,a,o,l){if(!this.ctx||!this.raceStarted||this.paused)return;const c=this.ctx.currentTime,h=n.telemetry,u=Ge(h.rpm,850,n.spec.maxRpm),d=this.currentEngineType==="gt"?1750:2100;for(let _=0;_<this.playerBands.length;_++){const C=this.playerBands[_],M=Math.abs(u-C.centerRpm),S=Math.max(0,1-M/d),D=Math.sin(S*Math.PI*.5)*.42,z=Ge(u/C.centerRpm,.58,1.75);C.gain.gain.setTargetAtTime(D,c,.025),C.source.playbackRate.setTargetAtTime(z,c,.02)}const f=.52+h.throttle*.48+(h.nitroActive?.16:0),g=(l?1700:2400)+h.throttle*3400+u/n.spec.maxRpm*1800;this.playerLoadGain.gain.setTargetAtTime(f,c,.04),this.playerFilter.frequency.setTargetAtTime(g,c,.04),h.justShifted&&(this.playerShiftGain.gain.cancelScheduledValues(c),this.playerShiftGain.gain.setValueAtTime(.32,c),this.playerShiftGain.gain.linearRampToValueAtTime(1,c+.095),this.playOneShot("exhaust_pop",this.sfxBus,.36,.9+Math.random()*.25,.05,.35),this.recordEvent("gear_shift",t,1.2,`gear ${h.gear}`)),h.nitroActive&&!this.wasNitroActive&&(this.playOneShot("exhaust_pop",this.sfxBus,.42,1.15,.05,.4),this.recordEvent("nitro_boost",t,2)),this.wasNitroActive=h.nitroActive,this.nitroGain.gain.setTargetAtTime(h.nitroActive?.42:0,c,.06),this.nitroSrc&&this.nitroSrc.playbackRate.setTargetAtTime(.95+h.speedKmh/200*.45,c,.08);const v=Ge(h.speedKmh/160,0,1.2),p=h.speedKmh>18?Ge((h.tireSlip-.16)*1.4,0,1)*.38:0;this.screechGain.gain.setTargetAtTime(p,c,.04),this.screechSrc&&this.screechSrc.playbackRate.setTargetAtTime(.88+h.tireSlip*.35,c,.05),p>.12&&this.recordEvent("tire_slip",t,2.5);const m=h.surface==="asphalt"||h.surface==="curb"||h.surface==="bridge",w=h.surface==="sand"||h.surface==="gravel"||h.surface==="grass";this.asphaltGain.gain.setTargetAtTime(m?v*(h.onBridge?.36:.24):0,c,.06),this.asphaltFilter.frequency.setTargetAtTime(h.onBridge?240:h.surface==="curb"?320:560,c,.08),this.asphaltFilter.Q.setTargetAtTime(h.onBridge?3.2:.65,c,.08),h.onBridge&&!this.prevOnBridge&&this.recordEvent("bridge_transition",t,5),this.prevOnBridge=h.onBridge,this.gravelGain.gain.setTargetAtTime(w?v*.45:0,c,.06),this.windGain.gain.setTargetAtTime(Math.pow(Ge(h.speedKmh/170,0,1),1.7)*(a==="Z2"?.36:.22),c,.08),h.impactStrength>.12&&(this.playOneShot("impact_crash",this.sfxBus,Ge(h.impactStrength*.65,.12,.55),.85+Math.random()*.3,.02,.65),this.recordEvent("impact",t,1.5,`strength=${h.impactStrength.toFixed(2)}`)),this.scrapeGain.gain.setTargetAtTime(h.scrapeIntensity*.35,c,.04);const y=o==="night";this.ambOceanGain.gain.setTargetAtTime(a==="Z1"?.48:a==="Z2"?.22:0,c,.45),this.ambVillageGain.gain.setTargetAtTime(a==="Z3"?y?.18:.34:0,c,.45),this.ambForestGain.gain.setTargetAtTime(a==="Z4"&&!y?.42:0,c,.45),this.ambNightGain.gain.setTargetAtTime((a==="Z4"||a==="Z3")&&y?.36:0,c,.45),a==="Z3"&&(this.bellTimer-=e,this.bellTimer<=0&&(this.bellTimer=18,this.playOneShot("amb_church_bell",this.ambienceBus,.24,1,0,3.5)));const x=this.ctx.listener,b=r.position,E=new I;r.getWorldDirection(E),x.positionX&&(x.positionX.setTargetAtTime(b.x,c,.02),x.positionY.setTargetAtTime(b.y,c,.02),x.positionZ.setTargetAtTime(b.z,c,.02),x.forwardX.setTargetAtTime(E.x,c,.02),x.forwardY.setTargetAtTime(E.y,c,.02),x.forwardZ.setTargetAtTime(E.z,c,.02));for(let _=0;_<this.aiVoices.length&&_<i.length;_++){const C=this.aiVoices[_],M=i[_],S=b.distanceTo(M.pos);C.panner.positionX&&(C.panner.positionX.setTargetAtTime(M.pos.x,c,.025),C.panner.positionY.setTargetAtTime(M.pos.y+.6,c,.025),C.panner.positionZ.setTargetAtTime(M.pos.z,c,.025));const D=Ge((S-C.prevDist)/Math.max(e,.005),-45,45);C.prevDist=S;const z=Ge(1-D/340,.86,1.16),U=Ge(M.rpm/3800,.55,1.75);C.source.playbackRate.setTargetAtTime(U*z,c,.04);const H=S>125?0:Ge(1-S/125,0,1)*.44;C.gain.gain.setTargetAtTime(H,c,.04),S<16&&Math.abs(D)>4&&this.recordEvent("ai_passby",t,4,`ai=${M.id} dist=${S.toFixed(1)}m`)}this.meterAnalyser.getFloatTimeDomainData(this.meterBuf);for(let _=0;_<this.meterBuf.length;_++){const C=Math.abs(this.meterBuf[_]);C>this.masterPeakLinear&&(this.masterPeakLinear=C)}}playUISound(e){if(!this.ctx)return;const t=this.ctx.currentTime,n=this.ctx.createOscillator(),i=this.ctx.createGain();n.connect(i),i.connect(this.uiBus),e==="nav"?(n.type="triangle",n.frequency.setValueAtTime(520,t),i.gain.setValueAtTime(.14,t),i.gain.exponentialRampToValueAtTime(.001,t+.055),n.start(t),n.stop(t+.06)):e==="confirm"?(n.type="sine",n.frequency.setValueAtTime(660,t),n.frequency.exponentialRampToValueAtTime(880,t+.09),i.gain.setValueAtTime(.18,t),i.gain.exponentialRampToValueAtTime(.001,t+.12),n.start(t),n.stop(t+.13)):e==="count"?(n.type="sine",n.frequency.setValueAtTime(440,t),i.gain.setValueAtTime(.28,t),i.gain.exponentialRampToValueAtTime(.001,t+.24),n.start(t),n.stop(t+.26)):e==="go"?(n.type="triangle",n.frequency.setValueAtTime(880,t),i.gain.setValueAtTime(.34,t),i.gain.exponentialRampToValueAtTime(.001,t+.45),n.start(t),n.stop(t+.47)):e==="finish"&&(n.type="triangle",n.frequency.setValueAtTime(523.25,t),n.frequency.setValueAtTime(659.25,t+.12),n.frequency.setValueAtTime(783.99,t+.24),n.frequency.setValueAtTime(1046.5,t+.36),i.gain.setValueAtTime(.28,t),i.gain.exponentialRampToValueAtTime(.001,t+.85),n.start(t),n.stop(t+.88))}getMediaStream(){return this.mediaDest?this.mediaDest.stream:null}startMasterPCMCapture(){if(!this.ctx||!this.brickwallShaper)return;this.stopMasterPCMCapture(),this.pcmLeftChunks=[],this.pcmRightChunks=[],this.pcmPeakLinear=0,this.events=[],this.lastEventTimes.clear(),this.pcmRecording=!0;const e=this.ctx.createScriptProcessor(4096,2,2),t=this.ctx.createGain();t.gain.value=0,e.onaudioprocess=n=>{if(!this.pcmRecording)return;const i=n.inputBuffer.getChannelData(0),r=n.inputBuffer.numberOfChannels>1?n.inputBuffer.getChannelData(1):i,a=new Float32Array(i.length),o=new Float32Array(r.length);for(let l=0;l<i.length;l++){const c=i[l],h=r[l];a[l]=c,o[l]=h;const u=Math.max(Math.abs(c),Math.abs(h));u>this.pcmPeakLinear&&(this.pcmPeakLinear=u),u>this.masterPeakLinear&&(this.masterPeakLinear=u)}this.pcmLeftChunks.push(a),this.pcmRightChunks.push(o)},this.brickwallShaper.connect(e),e.connect(t),t.connect(this.ctx.destination),this.pcmProcessor=e}stopMasterPCMCapture(){var f;if(!this.pcmRecording)return null;if(this.pcmRecording=!1,this.pcmProcessor){try{this.brickwallShaper.disconnect(this.pcmProcessor),this.pcmProcessor.disconnect()}catch{}this.pcmProcessor=null}const e=((f=this.ctx)==null?void 0:f.sampleRate)??48e3;let t=0;for(const g of this.pcmLeftChunks)t+=g.length;if(t===0)return null;const n=2,i=t*n*2,r=new ArrayBuffer(44+i),a=new DataView(r),o=(g,v)=>{for(let p=0;p<v.length;p++)a.setUint8(g+p,v.charCodeAt(p))};o(0,"RIFF"),a.setUint32(4,36+i,!0),o(8,"WAVE"),o(12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,n,!0),a.setUint32(24,e,!0),a.setUint32(28,e*n*2,!0),a.setUint16(32,n*2,!0),a.setUint16(34,16,!0),o(36,"data"),a.setUint32(40,i,!0);let l=44;for(let g=0;g<this.pcmLeftChunks.length;g++){const v=this.pcmLeftChunks[g],p=this.pcmRightChunks[g];for(let m=0;m<v.length;m++){const w=Math.max(-1,Math.min(1,v[m])),y=Math.max(-1,Math.min(1,p[m]));a.setInt16(l,w<0?w*32768:w*32767,!0),l+=2,a.setInt16(l,y<0?y*32768:y*32767,!0),l+=2}}const c=new Uint8Array(r);let h="";const u=32768;for(let g=0;g<c.length;g+=u)h+=String.fromCharCode(...c.subarray(g,g+u));const d=20*Math.log10(Math.max(1e-5,this.pcmPeakLinear));return{wavBase64:btoa(h),sampleRate:e,durationSec:Math.round(t/e*100)/100,peakDbfs:Math.round(d*100)/100}}getAuditReport(){const e=20*Math.log10(Math.max(1e-5,this.masterPeakLinear)),t=["engine_gt_0","engine_gt_1","engine_gt_2","engine_gt_3","engine_gt_4","engine_gt_5"].filter(i=>this.buffers.has(i)).length,n=["engine_corsa_0","engine_corsa_1","engine_corsa_2","engine_corsa_3"].filter(i=>this.buffers.has(i)).length;return{unlocked:!!this.ctx&&this.ctx.state==="running",playerEngineBandsGT:t,playerEngineBandsCorsa:n,usesRealAudioBuffers:t>=4&&n>=4,activeVoicesNow:this.activeSources.size,maxSimultaneousVoices:this.maxSimultaneousVoices,masterPeakDbfs:Math.round(e*100)/100,events:[...this.events]}}}function Lr(s){if(!Number.isFinite(s)||s<0)return"--:--.--";const e=Math.floor(s/60),t=Math.floor(s%60),n=Math.floor(s*100%100);return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}.${String(n).padStart(2,"0")}`}const vv={Z1:"Z1 · WATERFRONT PROMENADE",Z2:"Z2 · LIMESTONE CLIFFSIDE",Z3:"Z3 · SAN MARCO VILLAGE",Z4:"Z4 · PINE WOODS & VIADUCT"};class xv{constructor(e,t){B(this,"root");B(this,"layer");B(this,"posNumEl");B(this,"lapValEl");B(this,"curTimeEl");B(this,"bestTimeEl");B(this,"zoneNameEl");B(this,"camHintEl");B(this,"centerBannerEl");B(this,"rpmArcEl");B(this,"rpmNeedleEl");B(this,"speedTextEl");B(this,"gearTextEl");B(this,"nitroArcEl");B(this,"nitroLabelEl");B(this,"mapMinX",0);B(this,"mapMinZ",0);B(this,"mapScale",1);B(this,"mapOffX",0);B(this,"mapOffY",0);B(this,"aiDots",[]);B(this,"playerArrow");this.root=e,this.layer=document.createElement("div"),this.layer.className="hud-layer hidden",this.root.innerHTML="",this.root.appendChild(this.layer),this.buildDOM(t)}buildDOM(e){let t=1/0,n=-1/0,i=1/0,r=-1/0;for(let E=0;E<e.samples.length;E+=6){const _=e.samples[E].pos;_.x<t&&(t=_.x),_.x>n&&(n=_.x),_.z<i&&(i=_.z),_.z>r&&(r=_.z)}const a=22,o=Math.max(1,n-t),l=Math.max(1,r-i),c=200;this.mapScale=(c-a*2)/Math.max(o,l),this.mapMinX=t,this.mapMinZ=i,this.mapOffX=(c-o*this.mapScale)*.5,this.mapOffY=(c-l*this.mapScale)*.5;const h=(E,_)=>[this.mapOffX+(E-this.mapMinX)*this.mapScale,this.mapOffY+(_-this.mapMinZ)*this.mapScale],u=[];for(let E=0;E<e.samples.length;E+=6){const _=e.samples[E].pos,[C,M]=h(_.x,_.z);u.push(`${C.toFixed(1)},${M.toFixed(1)}`)}const d=e.sampleAtS(e.spec.startFinishS),[f,g]=h(d.pos.x,d.pos.z),v=Ss(166,134,96,-132,108),p=Ss(166,134,96,62,108),m=Ss(166,134,114,-126,46);let w="";for(let E=0;E<=8;E++){const C=(-132+E/8*240-90)*Math.PI/180,M=166+Math.cos(C)*82,S=134+Math.sin(C)*82,D=166+Math.cos(C)*92,z=134+Math.sin(C)*92,U=166+Math.cos(C)*68,H=134+Math.sin(C)*68+4,ee=E>=7?"#ef3340":"#cbd5e1";w+=`<line x1="${M.toFixed(1)}" y1="${S.toFixed(1)}" x2="${D.toFixed(1)}" y2="${z.toFixed(1)}" stroke="${ee}" stroke-width="2.2" />`,w+=`<text x="${U.toFixed(1)}" y="${H.toFixed(1)}" fill="${ee}" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="11" font-weight="700" text-anchor="middle">${E}</text>`}this.layer.innerHTML=`
      <div class="hud-top">
        <div class="hud-race-strip">
          <div class="hud-pos-block">
            <div class="hud-pos-inner">
              <div>
                <span class="hud-pos-label">POS</span>
                <span class="hud-pos-num" id="hud-pos-num">1</span>
              </div>
              <span class="hud-pos-total">/ 6</span>
            </div>
          </div>
          <div class="hud-meta-block">
            <div class="hud-meta-inner">
              <div class="hud-stat">
                <span class="hud-stat-label">LAP</span>
                <span class="hud-stat-val accent" id="hud-lap-val">1 / 3</span>
              </div>
              <div class="hud-stat">
                <span class="hud-stat-label">CURRENT</span>
                <span class="hud-stat-val" id="hud-cur-time">00:00.00</span>
              </div>
              <div class="hud-stat">
                <span class="hud-stat-label">BEST LAP</span>
                <span class="hud-stat-val" id="hud-best-time">--:--.--</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hud-zone-pill">
          <div>
            <div class="hud-zone-name" id="hud-zone-name">Z1 · WATERFRONT PROMENADE</div>
            <div class="hud-cam-hint" id="hud-cam-hint">CHASE CAM · [C] COCKPIT · [SHIFT] NITRO</div>
          </div>
        </div>
      </div>

      <div class="hud-center-banner" id="hud-center-banner"></div>

      <div class="hud-bottom">
        <div class="hud-minimap-wrap">
          <svg class="hud-minimap-svg" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(8,14,24,0.68)"/>
                <stop offset="88%" stop-color="rgba(8,14,24,0.44)"/>
                <stop offset="100%" stop-color="rgba(8,14,24,0.0)"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#mapBg)" stroke="rgba(255,255,255,0.14)" stroke-width="1.2"/>
            <polygon points="${u.join(" ")}" fill="none" stroke="rgba(10,14,22,0.88)" stroke-width="9" stroke-linejoin="round"/>
            <polygon points="${u.join(" ")}" fill="none" stroke="rgba(226,232,240,0.88)" stroke-width="4.2" stroke-linejoin="round"/>
            <rect x="${(f-5).toFixed(1)}" y="${(g-2).toFixed(1)}" width="10" height="4" fill="#f5b952" stroke="#080c14" stroke-width="0.8"/>
            <g id="minimap-cars"></g>
          </svg>
        </div>

        <div class="hud-tach-wrap">
          <svg class="hud-tach-svg" viewBox="0 0 320 230">
            <defs>
              <linearGradient id="rpmGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#22d3ee"/>
                <stop offset="68%" stop-color="#f5b952"/>
                <stop offset="100%" stop-color="#ef3340"/>
              </linearGradient>
              <linearGradient id="nitroGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#67e8f9"/>
              </linearGradient>
              <radialGradient id="dialBg" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="rgba(10,16,28,0.86)"/>
                <stop offset="82%" stop-color="rgba(10,16,28,0.68)"/>
                <stop offset="100%" stop-color="rgba(10,16,28,0.0)"/>
              </radialGradient>
            </defs>
            <circle cx="166" cy="134" r="106" fill="url(#dialBg)"/>
            <!-- Outer Curved Mini-Nitro Gauge -->
            <path d="${m}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="7.5" stroke-linecap="round"/>
            <path id="hud-nitro-arc" d="${m}" fill="none" stroke="url(#nitroGrad)" stroke-width="7.5" stroke-linecap="round"/>
            <text id="hud-nitro-label" x="62" y="212" fill="#22d3ee" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="11" font-weight="800" letter-spacing="2">NITRO</text>

            <!-- Main Curved Tachometer Arc -->
            <path d="${v}" fill="none" stroke="rgba(255,255,255,0.13)" stroke-width="11" stroke-linecap="butt"/>
            <path d="${p}" fill="none" stroke="rgba(239,51,64,0.34)" stroke-width="11"/>
            <path id="hud-rpm-arc" d="${v}" fill="none" stroke="url(#rpmGrad)" stroke-width="11" stroke-linecap="butt"/>
            ${w}

            <!-- Animated Tachometer Needle -->
            <line id="hud-rpm-needle" x1="166" y1="134" x2="166" y2="48" stroke="#f5b952" stroke-width="3" stroke-linecap="round"/>
            <circle cx="166" cy="134" r="7" fill="#0f172a" stroke="#f5b952" stroke-width="2.2"/>

            <!-- Digital Speed & Gear Readout -->
            <rect x="206" y="138" width="46" height="46" rx="4" fill="rgba(245,185,82,0.18)" stroke="#f5b952" stroke-width="1.8"/>
            <text id="hud-gear-text" x="229" y="172" fill="#ffffff" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="32" font-weight="900" font-style="italic" text-anchor="middle">1</text>

            <text id="hud-speed-text" x="195" y="176" fill="#ffffff" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="52" font-weight="900" font-style="italic" text-anchor="end">0</text>
            <text x="195" y="195" fill="#9fb0c7" font-family="Bahnschrift,Segoe UI,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" text-anchor="end">KM/H</text>
          </svg>
        </div>
      </div>
    `,this.posNumEl=this.layer.querySelector("#hud-pos-num"),this.lapValEl=this.layer.querySelector("#hud-lap-val"),this.curTimeEl=this.layer.querySelector("#hud-cur-time"),this.bestTimeEl=this.layer.querySelector("#hud-best-time"),this.zoneNameEl=this.layer.querySelector("#hud-zone-name"),this.camHintEl=this.layer.querySelector("#hud-cam-hint"),this.centerBannerEl=this.layer.querySelector("#hud-center-banner"),this.rpmArcEl=this.layer.querySelector("#hud-rpm-arc"),this.rpmNeedleEl=this.layer.querySelector("#hud-rpm-needle"),this.speedTextEl=this.layer.querySelector("#hud-speed-text"),this.gearTextEl=this.layer.querySelector("#hud-gear-text"),this.nitroArcEl=this.layer.querySelector("#hud-nitro-arc"),this.nitroLabelEl=this.layer.querySelector("#hud-nitro-label");const y=this.layer.querySelector("#minimap-cars"),x="http://www.w3.org/2000/svg";this.aiDots=[];for(let E=0;E<5;E++){const _=document.createElementNS(x,"circle");_.setAttribute("r","4.2"),_.setAttribute("fill","#e2e8f0"),_.setAttribute("stroke","#080c14"),_.setAttribute("stroke-width","1.4"),y.appendChild(_),this.aiDots.push(_)}const b=document.createElementNS(x,"polygon");b.setAttribute("points","0,-7.5 5.5,6 0,3 -5.5,6"),b.setAttribute("fill","#f5b952"),b.setAttribute("stroke","#080c14"),b.setAttribute("stroke-width","1.2"),y.appendChild(b),this.playerArrow=b}setVisible(e){this.layer.classList.toggle("hidden",!e)}setCenterBanner(e){this.centerBannerEl.innerHTML=e}update(e,t,n,i,r,a){const o=e.telemetry;this.posNumEl.textContent=String(n),this.lapValEl.textContent=`${Math.min(e.lap,i)} / ${i}`,this.curTimeEl.textContent=Lr(e.currentLapTime),this.bestTimeEl.textContent=Lr(e.bestLapTime),this.zoneNameEl.textContent=vv[r],this.camHintEl.textContent=a==="cockpit"?"COCKPIT VIEW · [C] CHASE · [SHIFT] NITRO":"CHASE CAM · [C] COCKPIT · [SHIFT] NITRO";const l=Ge(o.rpm/e.spec.maxRpm,0,1),c=-132+Math.max(.01,l)*240;this.rpmArcEl.setAttribute("d",Ss(166,134,96,-132,c));const h=(c-90)*Math.PI/180;this.rpmNeedleEl.setAttribute("x2",(166+Math.cos(h)*86).toFixed(1)),this.rpmNeedleEl.setAttribute("y2",(134+Math.sin(h)*86).toFixed(1)),this.speedTextEl.textContent=String(Math.round(o.speedKmh)),this.gearTextEl.textContent=o.gear===0?"R":String(o.gear);const u=Ge(o.nitro,0,1),d=-126+Math.max(.01,u)*172;this.nitroArcEl.setAttribute("d",Ss(166,134,114,-126,d)),this.nitroArcEl.setAttribute("stroke",o.nitroActive?"#ff9d2e":"url(#nitroGrad)"),this.nitroLabelEl.textContent=o.nitroActive?"BOOST!":"NITRO",this.nitroLabelEl.setAttribute("fill",o.nitroActive?"#ff9d2e":"#22d3ee");for(let p=0;p<this.aiDots.length&&p<t.length;p++){const m=t[p],w=this.mapOffX+(m.pos.x-this.mapMinX)*this.mapScale,y=this.mapOffY+(m.pos.z-this.mapMinZ)*this.mapScale;this.aiDots[p].setAttribute("cx",w.toFixed(1)),this.aiDots[p].setAttribute("cy",y.toFixed(1))}const f=this.mapOffX+(e.pos.x-this.mapMinX)*this.mapScale,g=this.mapOffY+(e.pos.z-this.mapMinZ)*this.mapScale,v=-e.yaw*180/Math.PI;this.playerArrow.setAttribute("transform",`translate(${f.toFixed(1)},${g.toFixed(1)}) rotate(${v.toFixed(1)})`)}}function sc(s,e,t,n){const i=(n-90)*Math.PI/180;return[s+t*Math.cos(i),e+t*Math.sin(i)]}function Ss(s,e,t,n,i){const[r,a]=sc(s,e,t,i),[o,l]=sc(s,e,t,n),c=i-n<=180?"0":"1";return`M ${r.toFixed(1)} ${a.toFixed(1)} A ${t} ${t} 0 ${c} 0 ${o.toFixed(1)} ${l.toFixed(1)}`}class Sv{constructor(e,t){B(this,"root");B(this,"cb");this.root=e,this.cb=t}showLoading(e,t){let n=this.root.querySelector(".loading-wrap");n||(this.root.innerHTML=`
        <div class="loading-wrap">
          <div class="brand-kicker">MEDITERRANEAN COASTAL CIRCUIT</div>
          <div class="brand-title">COSTA DORADA GP</div>
          <div class="loading-bar-outer"><div class="loading-bar-inner" id="load-fill"></div></div>
          <div class="loading-status" id="load-status">Initializing...</div>
        </div>
      `,n=this.root.querySelector(".loading-wrap"));const i=this.root.querySelector("#load-fill"),r=this.root.querySelector("#load-status");i&&(i.style.width=`${Math.round(e*100)}%`),r&&(r.textContent=`${Math.round(e*100)}% · ${t}`)}clear(){this.root.innerHTML=""}render(e,t,n,i){if(e==="racing"||e==="grid_intro"||e==="countdown"){this.clear();return}if(e==="menu"){this.root.innerHTML=`
        <div class="menu-screen">
          <div>
            <div class="brand-kicker">MEDITERRANEAN GRAND PRIX · 3.28 KM COASTAL CIRCUIT</div>
            <div class="brand-title">COSTA<br/>DORADA GP</div>
            <div class="brand-sub">6-Car Coastal Circuit Racing · Golden Hour &amp; Moonlit Night · Chase &amp; Cockpit View</div>
            <div class="menu-nav">
              <button class="btn-gp primary" id="btn-play"><span>RACE SETUP</span><span>›</span></button>
              <button class="btn-gp" id="btn-garage"><span>GARAGE &amp; LIVERIES</span><span>›</span></button>
              <button class="btn-gp" id="btn-quick"><span>QUICK RACE</span><span>›</span></button>
            </div>
          </div>
          <div class="menu-footer">
            <span>WASD / ARROWS DRIVE</span>
            <span>SHIFT MINI-NITRO</span>
            <span>C CHASE / COCKPIT</span>
            <span>ESC PAUSE</span>
          </div>
        </div>
      `,this.bind("#btn-play","confirm",()=>this.cb.onNavigate("setup")),this.bind("#btn-garage","nav",()=>this.cb.onNavigate("garage")),this.bind("#btn-quick","confirm",()=>this.cb.onStartRace());return}if(e==="garage"){const r=fi[t.carModel],a=pi[t.liveryIndex],o=pi.map((l,c)=>`<button class="swatch-btn ${c===t.liveryIndex?"active":""}" data-liv="${c}" style="background:#${l.primaryHex.toString(16).padStart(6,"0")}">${l.number}</button>`).join("");this.root.innerHTML=`
        <div class="menu-screen garage-mode">
          <div>
            <div class="brand-kicker">GARAGE SHOWCASE</div>
            <div class="panel-card">
              <div class="panel-heading">${r.name}</div>
              <div style="font-size:13px;color:#9fb0c7;margin:-10px 0 18px;">${r.subtitle}</div>

              <div class="option-row">
                <span class="option-label">SELECT CAR MODEL</span>
                <div class="seg-group">
                  <button class="seg-btn ${t.carModel==="aurelia_gtr"?"active":""}" data-car="aurelia_gtr">Aurelia GT-R</button>
                  <button class="seg-btn ${t.carModel==="solara_corsa"?"active":""}" data-car="solara_corsa">Solara Corsa WB</button>
                </div>
              </div>

              <div class="option-row">
                <span class="option-label">LIVERY &amp; NUMBER · ${a.name.toUpperCase()} #${a.number}</span>
                <div class="swatch-grid">${o}</div>
              </div>

              <div class="option-row">
                <span class="option-label">SHOWCASE LIGHTING</span>
                <div class="seg-group">
                  <button class="seg-btn ${t.lighting==="golden_hour"?"active":""}" data-tod="golden_hour">Golden Hour</button>
                  <button class="seg-btn ${t.lighting==="night"?"active":""}" data-tod="night">Night</button>
                </div>
              </div>

              <div style="margin-top:16px;">
                <div class="spec-bar-row"><span>TOP SPEED</span><div class="spec-track"><div class="spec-fill" style="width:${r.stats.speed}%"></div></div><span>${r.stats.speed}</span></div>
                <div class="spec-bar-row"><span>HANDLING</span><div class="spec-track"><div class="spec-fill" style="width:${r.stats.handling}%"></div></div><span>${r.stats.handling}</span></div>
                <div class="spec-bar-row"><span>ACCEL</span><div class="spec-track"><div class="spec-fill" style="width:${r.stats.accel}%"></div></div><span>${r.stats.accel}</span></div>
              </div>

              <div class="actions-row">
                <button class="btn-gp" id="btn-back-menu"><span>BACK</span></button>
                <button class="btn-gp primary" id="btn-to-setup"><span>RACE SETUP ›</span></button>
              </div>
            </div>
          </div>
          <div class="menu-footer"><span>ROTATING 3D SHOWCASE · 100% PROCEDURAL BODYWORK &amp; COCKPIT</span></div>
        </div>
      `,this.root.querySelectorAll("[data-car]").forEach(l=>{l.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({carModel:l.dataset.car})}}),this.root.querySelectorAll("[data-liv]").forEach(l=>{l.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({liveryIndex:Number(l.dataset.liv)})}}),this.root.querySelectorAll("[data-tod]").forEach(l=>{l.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({lighting:l.dataset.tod})}}),this.bind("#btn-back-menu","nav",()=>this.cb.onNavigate("menu")),this.bind("#btn-to-setup","confirm",()=>this.cb.onNavigate("setup"));return}if(e==="setup"){const r=fi[t.carModel],a=pi[t.liveryIndex];this.root.innerHTML=`
        <div class="menu-screen centered">
          <div class="panel-card">
            <div class="brand-kicker">COSTA DORADA GP · 6 CARS</div>
            <div class="panel-heading">RACE SETUP</div>
            <div style="font-size:13px;color:#cbd5e1;margin:-10px 0 18px;">Car: <strong>${r.name}</strong> · ${a.name} #${a.number}</div>

            <div class="option-row">
              <span class="option-label">RACE DISTANCE (LAPS)</span>
              <div class="seg-group">
                <button class="seg-btn ${t.laps===3?"active":""}" data-laps="3">3 Laps</button>
                <button class="seg-btn ${t.laps===6?"active":""}" data-laps="6">6 Laps</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">AI DIFFICULTY</span>
              <div class="seg-group">
                <button class="seg-btn ${t.difficulty==="easy"?"active":""}" data-diff="easy">Easy</button>
                <button class="seg-btn ${t.difficulty==="normal"?"active":""}" data-diff="normal">Normal</button>
                <button class="seg-btn ${t.difficulty==="hard"?"active":""}" data-diff="hard">Hard</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">TIME OF DAY</span>
              <div class="seg-group">
                <button class="seg-btn ${t.lighting==="golden_hour"?"active":""}" data-tod="golden_hour">Golden Hour</button>
                <button class="seg-btn ${t.lighting==="night"?"active":""}" data-tod="night">Night</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">GRAPHICS QUALITY</span>
              <div class="seg-group">
                <button class="seg-btn ${t.quality==="high"?"active":""}" data-qual="high">High (CSM + AO + AA)</button>
                <button class="seg-btn ${t.quality==="low"?"active":""}" data-qual="low">Low (60+ FPS iGPU)</button>
              </div>
            </div>

            <div class="actions-row">
              <button class="btn-gp" id="btn-setup-garage"><span>GARAGE</span></button>
              <button class="btn-gp primary" id="btn-start-race"><span>START RACE ›</span></button>
            </div>
          </div>
        </div>
      `,this.root.querySelectorAll("[data-laps]").forEach(o=>{o.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({laps:Number(o.dataset.laps)})}}),this.root.querySelectorAll("[data-diff]").forEach(o=>{o.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({difficulty:o.dataset.diff})}}),this.root.querySelectorAll("[data-tod]").forEach(o=>{o.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({lighting:o.dataset.tod})}}),this.root.querySelectorAll("[data-qual]").forEach(o=>{o.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({quality:o.dataset.qual})}}),this.bind("#btn-setup-garage","nav",()=>this.cb.onNavigate("garage")),this.bind("#btn-start-race","confirm",()=>this.cb.onStartRace());return}if(e==="paused"){this.root.innerHTML=`
        <div class="menu-screen centered">
          <div class="panel-card">
            <div class="brand-kicker">RACE PAUSED</div>
            <div class="panel-heading">SETTINGS &amp; CONTROLS</div>

            <div class="option-row">
              <span class="option-label">QUALITY PRESET</span>
              <div class="seg-group">
                <button class="seg-btn ${t.quality==="high"?"active":""}" data-qual="high">High</button>
                <button class="seg-btn ${t.quality==="low"?"active":""}" data-qual="low">Low</button>
              </div>
            </div>

            <div class="option-row">
              <span class="option-label">AUDIO VOLUMES</span>
              <div class="slider-row"><span>Master</span><input id="vol-master" type="range" min="0" max="100" value="${Math.round(n.master*100)}"/><span>${Math.round(n.master*100)}%</span></div>
              <div class="slider-row"><span>SFX / Engine</span><input id="vol-sfx" type="range" min="0" max="100" value="${Math.round(n.sfx*100)}"/><span>${Math.round(n.sfx*100)}%</span></div>
              <div class="slider-row"><span>Music</span><input id="vol-music" type="range" min="0" max="100" value="${Math.round(n.music*100)}"/><span>${Math.round(n.music*100)}%</span></div>
            </div>

            <div class="controls-grid">
              <div><span class="kbd">W / ↑</span>Accelerate</div>
              <div><span class="kbd">S / ↓</span>Brake / Reverse</div>
              <div><span class="kbd">A / D</span>Steer Left / Right</div>
              <div><span class="kbd">SHIFT</span>Mini-Nitro Boost</div>
              <div><span class="kbd">C</span>Chase / Cockpit</div>
              <div><span class="kbd">ESC</span>Pause / Resume</div>
            </div>

            <div class="actions-row" style="margin-top:20px;">
              <button class="btn-gp primary" id="btn-resume"><span>RESUME</span></button>
              <button class="btn-gp" id="btn-restart"><span>RESTART</span></button>
              <button class="btn-gp" id="btn-quit"><span>MENU</span></button>
            </div>
          </div>
        </div>
      `,this.root.querySelectorAll("[data-qual]").forEach(a=>{a.onclick=()=>{this.cb.onUIClick("nav"),this.cb.onConfigChange({quality:a.dataset.qual})}});const r=(a,o)=>{const l=this.root.querySelector(a);l&&(l.oninput=()=>{const c={...n,[o]:Number(l.value)/100};n[o]=c[o],l.nextElementSibling&&(l.nextElementSibling.textContent=`${l.value}%`),this.cb.onVolumeChange(c)})};r("#vol-master","master"),r("#vol-sfx","sfx"),r("#vol-music","music"),this.bind("#btn-resume","confirm",()=>this.cb.onResume()),this.bind("#btn-restart","confirm",()=>this.cb.onRestart()),this.bind("#btn-quit","nav",()=>this.cb.onNavigate("menu"));return}if(e==="results"){const r=(i??[]).map(o=>`
          <tr class="${o.isPlayer?"player-row":""}">
            <td>#${o.position}</td>
            <td>${o.name} ${o.isPlayer?"(YOU)":""}</td>
            <td>${o.carName} #${o.number}</td>
            <td>${o.projected?"≈ ":""}${Lr(o.totalTimeSec)}</td>
            <td>${Lr(o.bestLapSec)}</td>
          </tr>
        `).join(""),a=(i??[]).find(o=>o.isPlayer);this.root.innerHTML=`
        <div class="menu-screen centered">
          <div class="panel-card wide">
            <div class="brand-kicker">CHECKERED FLAG · COSTA DORADA GP</div>
            <div class="panel-heading">${a?`FINISHED P${a.position}`:"RACE COMPLETE"}</div>
            <table class="results-table">
              <thead>
                <tr><th>POS</th><th>DRIVER</th><th>CAR</th><th>TOTAL TIME</th><th>BEST LAP</th></tr>
              </thead>
              <tbody>${r}</tbody>
            </table>
            <div class="actions-row">
              <button class="btn-gp primary" id="btn-race-again"><span>RACE AGAIN ›</span></button>
              <button class="btn-gp" id="btn-res-menu"><span>MAIN MENU</span></button>
            </div>
          </div>
        </div>
      `,this.bind("#btn-race-again","confirm",()=>this.cb.onStartRace()),this.bind("#btn-res-menu","nav",()=>this.cb.onNavigate("menu"))}}bind(e,t,n){const i=this.root.querySelector(e);i&&(i.onclick=()=>{this.cb.onUIClick(t),n()})}}class Mv{constructor(e,t,n){B(this,"scene",new Ru);B(this,"pipeline");B(this,"audio",new gv);B(this,"menus");B(this,"hud");B(this,"track");B(this,"terrain");B(this,"road");B(this,"physicsWorld");B(this,"waterSky");B(this,"village");B(this,"flora");B(this,"propsBridge");B(this,"particles");B(this,"assets");B(this,"validationReport");B(this,"garageRig",null);B(this,"garageCarModel",null);B(this,"garageLiveryIdx",-1);B(this,"garageTurntableAngle",.65);B(this,"racers",[]);B(this,"allObstacles",[]);B(this,"carModelAudit",{aurelia_gtr:{triangles:0,materials:0,hasParentedWheels:!1,hasCockpit:!1,hasSteeringWheel:!1},solara_corsa:{triangles:0,materials:0,hasParentedWheels:!1,hasCockpit:!1,hasSteeringWheel:!1}});B(this,"screen","loading");B(this,"config",{carModel:"aurelia_gtr",liveryIndex:0,laps:3,difficulty:"normal",lighting:"golden_hour",quality:"high"});B(this,"volumes",{master:.85,sfx:.9,music:.45});B(this,"raceElapsed",0);B(this,"gridIntroTimer",0);B(this,"countdownTimer",0);B(this,"lastCountdownInt",4);B(this,"goBannerTimer",0);B(this,"globalTime",0);B(this,"physAccum",0);B(this,"fixedDt",1/120);B(this,"lastFrameMs",0);B(this,"rafId",0);B(this,"aiOvertakesCount",0);B(this,"aiOvertakeLog",[]);B(this,"aiMaxStuckSeconds",0);B(this,"cameraClipViolations",0);B(this,"staticCameraOverride",null);B(this,"testAutopilot",!1);B(this,"testAutopilotAllowNitro",!0);B(this,"testAutopilotPace",1.02);B(this,"testInputOverride",null);B(this,"mediaRecorder",null);B(this,"videoChunks",[]);B(this,"videoStopResolve",null);B(this,"keys",new Set);B(this,"prevGamepadCam",!1);B(this,"prevGamepadPause",!1);B(this,"frameDeltasMs",[]);B(this,"loop",e=>{this.rafId=requestAnimationFrame(this.loop);const t=e-this.lastFrameMs;this.lastFrameMs=e;const n=Math.min(t/1e3,.05);this.globalTime+=n,t>.5&&t<500&&(this.frameDeltasMs.push(t),this.frameDeltasMs.length>300&&this.frameDeltasMs.shift());const i=this.waterSky.getSunDirection(this.config.lighting);if(this.waterSky.update(this.globalTime,this.pipeline.camera.position),this.propsBridge.update(this.globalTime),this.flora.update(this.globalTime,i,this.config.lighting==="night"),this.staticCameraOverride)this.pipeline.camera.position.copy(this.staticCameraOverride.pos),this.pipeline.camera.up.set(0,1,0),this.pipeline.camera.lookAt(this.staticCameraOverride.look),this.staticCameraOverride.fov&&(this.pipeline.camera.fov=this.staticCameraOverride.fov,this.pipeline.camera.updateProjectionMatrix()),this.pipeline.setStaticBlurZero();else if(this.screen==="menu"||this.screen==="setup"){const r=this.track.wrapS(this.track.spec.startFinishS-45+Math.sin(this.globalTime*.11)*140),a=this.track.sampleAtS(r),o=a.pos.clone().addScaledVector(a.flatRight,-11.5).add(new I(0,6.2,0)),l=this.track.sampleAtS(r+58);this.pipeline.camera.position.copy(o),this.pipeline.camera.lookAt(l.pos.x,l.pos.y+1.8,l.pos.z),this.pipeline.camera.fov=58,this.pipeline.camera.updateProjectionMatrix(),this.pipeline.setStaticBlurZero()}else if(this.screen==="garage"){if(this.garageTurntableAngle+=n*.32,this.garageRig){const r=this.garageRig.root.position,a=5.4,o=r.x+Math.sin(this.garageTurntableAngle)*a,l=r.z+Math.cos(this.garageTurntableAngle)*a;this.pipeline.camera.position.set(o,r.y+1.48,l),this.pipeline.camera.lookAt(r.x-.85,r.y+.72,r.z),this.pipeline.camera.fov=46,this.pipeline.camera.updateProjectionMatrix(),this.pipeline.setStaticBlurZero()}}else if(this.screen==="grid_intro"||this.screen==="countdown"||this.screen==="racing"){this.physAccum+=n;let r=0;for(;this.physAccum>=this.fixedDt&&r<8;)this.stepFixedPhysics(this.fixedDt),this.physAccum-=this.fixedDt,r++;const a=Ge(this.physAccum/this.fixedDt,0,1);for(const h of this.racers)h.rig.updateFromPhysics(h.physics,a,this.globalTime),this.particles.emitForVehicle(h.physics,n);this.particles.update(n);const o=this.racers[0];if(this.screen==="grid_intro"){this.gridIntroTimer-=n;const h=Ge(1-this.gridIntroTimer/4.8,0,1),d=this.track.spec.startFinishS-48+h*44,f=this.track.sampleAtS(d),g=Math.sin(h*Math.PI)*5.2-3.6;this.pipeline.camera.position.set(f.pos.x+f.flatRight.x*g,f.pos.y+2.4+(1-h)*2.2,f.pos.z+f.flatRight.z*g);const v=o.rig.root.position;this.pipeline.camera.lookAt(v.x,v.y+.9,v.z),this.pipeline.setStaticBlurZero(),this.gridIntroTimer<=0&&(this.screen="countdown",this.pipeline.resetCameraSnap())}else if(this.screen==="countdown"){this.countdownTimer-=n;const h=Math.ceil(this.countdownTimer);h<this.lastCountdownInt&&h>=1&&(this.lastCountdownInt=h,this.hud.setCenterBanner(`<div class="countdown-num">${h}</div>`),this.audio.playUISound("count")),this.pipeline.updateGameplayCamera(n,o.physics,o.rig,this.physicsWorld,this.globalTime),this.countdownTimer<=0&&(this.screen="racing",this.goBannerTimer=1.1,this.hud.setCenterBanner('<div class="countdown-num go">GO!</div>'),this.audio.playUISound("go"))}else this.goBannerTimer>0&&(this.goBannerTimer-=n,this.goBannerTimer<=0&&this.hud.setCenterBanner("")),this.pipeline.updateGameplayCamera(n,o.physics,o.rig,this.physicsWorld,this.globalTime);const l=this.terrain.getHeight(this.pipeline.camera.position.x,this.pipeline.camera.position.z);this.pipeline.camera.position.y<l-.1&&this.cameraClipViolations++;const c=this.track.getZoneForS(o.physics.splineS);this.audio.update(n,this.raceElapsed,o.physics,this.racers.slice(1).map(h=>h.physics),this.pipeline.camera,c,this.config.lighting,this.pipeline.cameraMode==="cockpit"),this.hud.update(o.physics,this.racers.slice(1).map(h=>h.physics),o.lastOrderRank,this.config.laps,c,this.pipeline.cameraMode)}this.pipeline.render()});this.canvas=e,this.hudRoot=t,this.uiRoot=n,this.pipeline=new pv(e,this.scene),this.menus=new Sv(n,{onNavigate:i=>this.navigateTo(i),onConfigChange:i=>this.updateConfig(i),onVolumeChange:i=>{this.volumes=i,this.audio.setVolumes(i)},onStartRace:()=>this.startRace(),onResume:()=>this.setPaused(!1),onRestart:()=>this.startRace(),onUIClick:i=>{this.audio.unlock().then(()=>this.audio.playUISound(i))}}),this.setupEventListeners()}async init(){this.menus.showLoading(.03,"Loading track.json single source of truth...");const e=await(await fetch("./track.json")).json();this.menus.showLoading(.08,"Building spline, road mesh & terrain heightfield..."),this.track=new pg(e,1500),this.terrain=new mg(this.track),this.road=gg(this.track),this.physicsWorld=new Sg(this.track,this.terrain,this.road.colliderData),this.physicsWorld.buildSplineBarriers(),this.assets=await bg(this.pipeline.renderer,(t,n)=>{this.menus.showLoading(.1+t*.56,n)}),this.menus.showLoading(.68,"Applying scanned PBR, 16x anisotropy & Triplanar cliffs..."),this.terrain.applyPBRTextures({sand:this.assets.textures.sand_beach,grass:this.assets.textures.grass_med,forest:this.assets.textures.forest_floor,gravel:this.assets.textures.gravel_verge,cliff:this.assets.textures.cliff_rock}),vg(this.road,this.track,{asphaltMain:this.assets.textures.asphalt_main,asphaltWorn:this.assets.textures.asphalt_worn,sand:this.assets.textures.sand_beach,gravel:this.assets.textures.gravel_verge,sidewalk:this.assets.textures.sidewalk_stone}),this.scene.add(this.terrain.mesh),this.scene.add(this.road.group),this.menus.showLoading(.73,"Constructing Mediterranean ocean, cliffs, village & bridge..."),this.waterSky=Tg(this.track,this.terrain),this.scene.add(this.waterSky.group),this.village=Eg(this.track,this.terrain,this.assets),this.scene.add(this.village.group),this.propsBridge=Ng(this.track,this.terrain,this.assets),this.scene.add(this.propsBridge.group),this.waterSky.setCoastalRocks(this.propsBridge.coastalRocks),this.menus.showLoading(.8,"Modeling 4 Mediterranean tree species & multi-strata flora..."),this.flora=Ug(this.track,this.terrain,this.assets,[...this.village.obstacles,...this.propsBridge.obstacles]),this.scene.add(this.flora.group),this.particles=new Fg,this.scene.add(this.particles.group),this.allObstacles=[...this.village.obstacles,...this.propsBridge.obstacles,...this.flora.obstacles];for(const t of this.allObstacles)this.physicsWorld.addObstacle(t);this.validationReport=Mg(this.track,this.terrain,this.allObstacles),this.validationReport.ok?console.log("[validateWorld] PASSED cleanly:",this.validationReport.metrics):console.error("[validateWorld] STRUCTURAL INVARIANT ERRORS:",this.validationReport.errors),this.menus.showLoading(.86,"Auditing procedural hero cars & cockpits...");for(const t of["aurelia_gtr","solara_corsa"]){const n=Aa(fi[t],pi[0],this.assets.textures.tire_rubber,!1),i=n.wheelMounts.every(r=>r.parent===n.chassisGroup);this.carModelAudit[t]={triangles:n.triangleCount,materials:n.materialCount,hasParentedWheels:i,hasCockpit:!!n.cockpitGroup&&n.cockpitGroup.children.length>5,hasSteeringWheel:!!n.steeringWheelPivot&&n.steeringWheelPivot.children.length>3}}this.hud=new xv(this.hudRoot,this.track),this.applyLightingAndQuality(),this.ensureGarageShowcaseCar(),this.pipeline.registerSceneMaterialsForCSM(),this.menus.showLoading(.94,"Pre-compiling WebGL2 shaders..."),await this.pipeline.precompileShaders(),this.menus.showLoading(1,"Ready!"),this.installVerificationAPI(),this.navigateTo("menu"),this.lastFrameMs=performance.now(),this.loop(this.lastFrameMs)}setupEventListeners(){window.addEventListener("resize",()=>{this.pipeline.resize(window.innerWidth,window.innerHeight)}),window.addEventListener("keydown",e=>{this.keys.add(e.code),e.code==="KeyC"&&(this.screen==="racing"||this.screen==="countdown")?this.toggleCameraMode():e.code==="Escape"&&(this.screen==="racing"||this.screen==="countdown"||this.screen==="grid_intro"?this.setPaused(!0):this.screen==="paused"&&this.setPaused(!1)),(e.code==="KeyW"||e.code==="ArrowUp"||e.code==="Space"||e.code==="Enter")&&this.audio.unlock()}),window.addEventListener("keyup",e=>{this.keys.delete(e.code)}),window.addEventListener("pointerdown",()=>{this.audio.unlock()},{passive:!0})}toggleCameraMode(){this.pipeline.cameraMode=this.pipeline.cameraMode==="chase"?"cockpit":"chase",this.pipeline.resetCameraSnap(),this.audio.playUISound("nav")}setCameraMode(e){this.pipeline.cameraMode=e,this.pipeline.resetCameraSnap()}applyLightingAndQuality(){const e=this.config.lighting==="night",t=this.config.quality==="high";this.pipeline.setQuality(this.config.quality),this.waterSky.setLightingMode(this.config.lighting,this.scene,this.assets);const n=this.waterSky.getSunDirection(this.config.lighting);this.pipeline.applyLightingToCSM(this.config.lighting,n),this.village.setNightMode(e,t),this.propsBridge.setNightMode(e),this.flora.setQuality(this.config.quality),this.flora.update(this.globalTime,n,e);for(let i=0;i<this.racers.length;i++){const r=i===0||(t?i<=3:i<=1);this.racers[i].rig.setNightLights(e,r)}this.garageRig&&this.garageRig.setNightLights(e,!0)}updateConfig(e){this.config={...this.config,...e},this.applyLightingAndQuality(),this.screen==="garage"&&this.ensureGarageShowcaseCar(),this.menus.render(this.screen,this.config,this.volumes)}navigateTo(e){this.staticCameraOverride=null,(e==="menu"||e==="garage"||e==="setup")&&(this.audio.stopRaceAudio(),this.clearRaceRacers(),this.hud.setVisible(!1),this.hud.setCenterBanner(""),this.ensureGarageShowcaseCar(),this.garageRig&&(this.garageRig.root.visible=e==="garage"||e==="menu")),this.screen=e,this.menus.render(e,this.config,this.volumes)}ensureGarageShowcaseCar(){if(this.garageRig&&this.garageCarModel===this.config.carModel&&this.garageLiveryIdx===this.config.liveryIndex){this.garageRig.setNightLights(this.config.lighting==="night",!0);return}this.garageRig&&(this.scene.remove(this.garageRig.root),this.garageRig=null);const e=fi[this.config.carModel],t=pi[this.config.liveryIndex],n=Aa(e,t,this.assets.textures.tire_rubber,!0),i=this.track.spec.startFinishS-12,r=this.track.sampleAtS(i),a=this.physicsWorld.raycastDown(r.pos.x,r.pos.y+4,r.pos.z);n.root.position.set(r.pos.x,a.y,r.pos.z),n.root.rotation.y=Math.atan2(-r.tangent.x,-r.tangent.z),n.setNightLights(this.config.lighting==="night",!0),this.scene.add(n.root),this.pipeline.registerSceneMaterialsForCSM(),this.garageRig=n,this.garageCarModel=this.config.carModel,this.garageLiveryIdx=this.config.liveryIndex}clearRaceRacers(){for(const e of this.racers)this.scene.remove(e.rig.root),e.rig.dispose();this.racers=[]}startRace(e=!1){this.staticCameraOverride=null,this.audio.stopRaceAudio(),this.clearRaceRacers(),this.garageRig&&(this.garageRig.root.visible=!1),this.raceElapsed=0,this.physAccum=0,this.aiOvertakesCount=0,this.aiOvertakeLog=[],this.aiMaxStuckSeconds=0,this.cameraClipViolations=0,this.pipeline.cameraMode="chase",this.pipeline.resetCameraSnap();const t=[0,1,2,3,4,5].filter(c=>c!==this.config.liveryIndex),n=this.track.spec.startFinishS,i=this.config.lighting==="night",r=this.config.quality==="high",a=[{s:n-10,lat:-2.2},{s:n-16,lat:2.2},{s:n-22,lat:-2.2},{s:n-28,lat:2.2},{s:n-34,lat:-2.2},{s:n-40,lat:2.2}],o=[{id:"player",name:"Driver",isPlayer:!0,carModel:this.config.carModel,liveryIdx:this.config.liveryIndex,slotIdx:3,aiIdx:-1},...$l.map((c,h)=>({id:`ai_${h+1}`,name:c.name,isPlayer:!1,carModel:h%2===0?"aurelia_gtr":"solara_corsa",liveryIdx:t[h],slotIdx:h<3?h:h+1,aiIdx:h}))];for(let c=0;c<o.length;c++){const h=o[c],u=fi[h.carModel],d=pi[h.liveryIdx],f=new Jl(h.id,u,h.isPlayer),g=a[h.slotIdx];f.spawnAtSpline(this.physicsWorld,g.s,g.lat),f.lap=1,f.nextCheckpoint=1,f.checkpointsPassed=0,f.totalProgress=-((n-g.s+this.track.length)%this.track.length);const v=h.isPlayer||r&&c<=1,p=Aa(u,d,this.assets.textures.tire_rubber,v);p.setNightLights(i,v),p.updateFromPhysics(f,1,this.globalTime),this.scene.add(p.root),this.racers.push({id:h.id,name:h.name,isPlayer:h.isPlayer,carModel:h.carModel,liveryIndex:h.liveryIdx,physics:f,rig:p,ai:h.aiIdx>=0?new Jc($l[h.aiIdx]):null,lastOrderRank:h.slotIdx+1})}this.pipeline.registerSceneMaterialsForCSM(),this.applyLightingAndQuality();const l=fi[this.config.carModel];this.audio.unlock().then(()=>{this.audio.startRaceAudio(l.engineType,5)}),this.menus.clear(),this.hud.setVisible(!0),e?(this.screen="racing",this.hud.setCenterBanner(""),this.gridIntroTimer=0,this.countdownTimer=0):(this.screen="grid_intro",this.gridIntroTimer=4.8,this.countdownTimer=3.2,this.lastCountdownInt=4,this.hud.setCenterBanner(`<div class="intro-title">COSTA DORADA GP</div><div class="intro-sub">${this.config.laps} LAPS · ${this.config.lighting==="night"?"MOONLIT NIGHT":"GOLDEN HOUR"} · ${this.config.difficulty.toUpperCase()}</div>`))}setPaused(e){e&&(this.screen==="racing"||this.screen==="countdown"||this.screen==="grid_intro")?(this.screen="paused",this.audio.setPaused(!0),this.menus.render("paused",this.config,this.volumes)):!e&&this.screen==="paused"&&(this.screen=this.gridIntroTimer>0?"grid_intro":this.countdownTimer>0?"countdown":"racing",this.audio.setPaused(!1),this.menus.clear(),this.lastFrameMs=performance.now())}readPlayerInput(){var o,l,c,h,u,d,f;if(this.testInputOverride)return{throttle:this.testInputOverride.throttle??0,brake:this.testInputOverride.brake??0,steer:this.testInputOverride.steer??0,nitro:this.testInputOverride.nitro??!1};if(this.testAutopilot&&this.racers.length>0)return Hg(this.racers[0].physics,this.racers.map(g=>g.physics),this.track,{allowNitro:this.testAutopilotAllowNitro,paceMultiplier:this.testAutopilotPace});let e=this.keys.has("KeyW")||this.keys.has("ArrowUp")?1:0,t=this.keys.has("KeyS")||this.keys.has("ArrowDown")?1:0,n=0;(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&(n-=1),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&(n+=1);let i=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight");const a=(navigator.getGamepads?navigator.getGamepads():[])[0];if(a){const g=((o=a.buttons[7])==null?void 0:o.value)??0,v=((l=a.buttons[6])==null?void 0:l.value)??0;g>.08&&(e=Math.max(e,g)),v>.08&&(t=Math.max(t,v));const p=a.axes[0]??0;Math.abs(p)>.12&&(n=Ge(p,-1,1)),((c=a.buttons[0])!=null&&c.pressed||(h=a.buttons[2])!=null&&h.pressed||(u=a.buttons[5])!=null&&u.pressed)&&(i=!0);const m=!!((d=a.buttons[3])!=null&&d.pressed);m&&!this.prevGamepadCam&&this.screen==="racing"&&this.toggleCameraMode(),this.prevGamepadCam=m;const w=!!((f=a.buttons[9])!=null&&f.pressed);w&&!this.prevGamepadPause&&this.setPaused(this.screen!=="paused"),this.prevGamepadPause=w}return{throttle:e,brake:t,steer:n,nitro:i}}updateRaceProgress(e){const t=this.track.checkpoints,n=t.length,i=this.track.spec.startFinishS;for(const a of this.racers){const o=a.physics;if(o.finished)continue;o.currentLapTime=Math.max(0,this.raceElapsed-o.lapStartTime);const l=t[o.nextCheckpoint],c=Math.hypot(o.pos.x-l.pos.x,o.pos.z-l.pos.z),h=l.width*.5+4.5;if(c<l.width*.85+6.5&&Math.abs(o.splineLateral)<=h){if(o.checkpointsPassed++,o.nextCheckpoint===0&&o.checkpointsPassed>=n){const f=this.raceElapsed-o.lapStartTime;if(f<o.bestLapTime&&f>15&&(o.bestLapTime=f),o.lapStartTime=this.raceElapsed,o.currentLapTime=0,o.lap>=this.config.laps){if(o.finished=!0,o.finishTime=this.raceElapsed,a.isPlayer){this.finishRace();return}}else o.lap++}o.nextCheckpoint=(o.nextCheckpoint+1)%n}const u=this.track.wrapS(o.splineS-i),d=o.checkpointsPassed===0&&u>this.track.length*.5?u-this.track.length:u;o.totalProgress=(o.lap-1)*this.track.length+d,!a.isPlayer&&o.stuckTimer>this.aiMaxStuckSeconds&&(this.aiMaxStuckSeconds=o.stuckTimer)}const r=[...this.racers].sort((a,o)=>a.physics.finished&&o.physics.finished?a.physics.finishTime-o.physics.finishTime:a.physics.finished?-1:o.physics.finished?1:o.physics.totalProgress-a.physics.totalProgress);for(let a=0;a<r.length;a++){const o=r[a],l=a+1;if(!o.isPlayer&&l<o.lastOrderRank&&this.raceElapsed>4){const c=r[a+1];c&&!c.isPlayer&&(this.aiOvertakesCount++,this.aiOvertakeLog.push({time:Math.round(this.raceElapsed*100)/100,passer:o.name,passed:c.name,s:Math.round(o.physics.splineS)}))}o.lastOrderRank=l}}finishRace(){this.screen="results",this.hud.setVisible(!1),this.hud.setCenterBanner(""),this.audio.playUISound("finish");const e=this.config.laps*this.track.length,n=[...this.racers].sort((i,r)=>i.physics.finished&&r.physics.finished?i.physics.finishTime-r.physics.finishTime:i.physics.finished?-1:r.physics.finished?1:r.physics.totalProgress-i.physics.totalProgress).map((i,r)=>{const a=i.physics;let o=a.finishTime,l=!1;if(!a.finished){l=!0;const c=Math.max(10,e-a.totalProgress),h=Math.max(18,a.totalProgress/Math.max(1,this.raceElapsed));o=this.raceElapsed+c/h}return{position:r+1,name:i.name,carName:fi[i.carModel].name,number:pi[i.liveryIndex].number,isPlayer:i.isPlayer,totalTimeSec:o,projected:l,bestLapSec:a.bestLapTime}});this.menus.render("results",this.config,this.volumes,n)}stepFixedPhysics(e){const t=this.screen==="racing",n=this.readPlayerInput(),i=this.racers.map(r=>r.physics);for(let r=0;r<this.racers.length;r++){const a=this.racers[r],o=a.isPlayer?n:t&&a.ai?a.ai.computeInput(a.physics,i,this.track,this.config.difficulty,e):{throttle:0,brake:1,steer:0,nitro:!1};a.physics.step(e,o,this.physicsWorld,this.raceElapsed,t)}for(let r=0;r<this.racers.length;r++)for(let a=r+1;a<this.racers.length;a++)Jl.resolveCarPair(this.racers[r].physics,this.racers[a].physics);t&&(this.raceElapsed+=e,this.updateRaceProgress(e))}collectLiveSceneStats(){var c,h;const e=((c=this.road.asphaltMaterial.map)==null?void 0:c.anisotropy)??0,t=(h=this.road.asphaltMaterial.map)==null?void 0:h.image;let n=0,i=0,r=0;const a=new Set;this.scene.traverse(u=>{var f;if(!(u instanceof Ee))return;const d=Array.isArray(u.material)?u.material:[u.material];for(const g of d)if(!(!g||a.has(g))&&(a.add(g),(g instanceof Xe||g instanceof In)&&g.map)){r++;const v=((f=g.map.userData)==null?void 0:f.sourceUrl)||"";(g.map instanceof Nr||g.map instanceof zs)&&!u.name.includes("cockpit")&&!u.name.includes("contact_shadow")&&n++;const m=g.map.image;v&&m&&((m.width??0)<1024||(m.height??0)<1024)&&i++}});const o=this.pipeline.getAuditInfo(),l=this.audio.getAuditReport();return{generatedAt:new Date().toISOString(),renderer:{calls:this.pipeline.renderer.info.render.calls,triangles:this.pipeline.renderer.info.render.triangles,geometries:this.pipeline.renderer.info.memory.geometries,textures:this.pipeline.renderer.info.memory.textures,maxAnisotropy:this.assets.maxAnisotropy},worldValidation:this.validationReport,cars:this.carModelAudit,pipeline:{...o,roadAnisotropy:e,roadAsphaltResolution:[(t==null?void 0:t.width)??0,(t==null?void 0:t.height)??0],triplanarCliffActive:this.terrain.triplanarActive,foliageTranslucencyActive:this.flora.foliageTranslucencyActive},materials:{totalPrimaryTexturedMats:r,syntheticNoisePrimaryMaps:n,materialsBelowMinRes:i},villageZ3:{unitCount:this.village.unitCount,archetypes:this.village.archetypes,archetypeCount:this.village.archetypes.length,tierCounts:this.village.tierCounts,hasMultiLayerDepth:this.village.tierCounts.tier2>=15&&this.village.tierCounts.tier3>=10,alleyCount:this.village.alleyCount},woodsZ4:{treeSpecies:this.flora.speciesNames,treeSpeciesCount:this.flora.speciesNames.length,hasTrees:this.flora.hasTrees,hasShrubs:this.flora.hasShrubs,hasGroundcover:this.flora.hasGroundcover,totalTrees:this.flora.totalTreeCount,totalShrubs:this.flora.totalShrubCount,totalGrassTufts:this.flora.totalGrassCount},props:{totalProps:this.propsBridge.propCountTotal,propsPer100m:this.propsBridge.propsPer100m},audio:l}}poseForShot(e){this.staticCameraOverride=null,this.waterSky.setFogDensityOverride(null,this.scene);const t=(n,i,r,a,o,l,c="chase",h=0,u=!1)=>{(this.config.lighting!==a||this.config.quality!==o)&&(this.config.lighting=a,this.config.quality=o,this.applyLightingAndQuality()),(this.racers.length===0||this.screen!=="racing")&&this.startRace(!0),this.screen="racing",this.menus.clear(),this.hud.setVisible(l),this.hud.setCenterBanner(""),this.setCameraMode(c);const d=this.racers[0].physics;d.spawnAtSpline(this.physicsWorld,n,i);const f=d.getForwardVector();d.vel.copy(f).multiplyScalar(r/3.6),d.telemetry.speedKmh=r,d.telemetry.rpm=5400+r/150*2400,d.telemetry.gear=r>125?5:r>95?4:r>65?3:2,d.telemetry.steerVisualNorm=h,d.steerSmoothed=h,Math.abs(h)>.05&&(d.wheels[0].steerYaw=-h*.34,d.wheels[1].steerYaw=-h*.38),this.racers[0].rig.updateFromPhysics(d,1,this.globalTime);const g=u?[{ds:4.5,lat:-2.5},{ds:7.2,lat:2.3},{ds:13.5,lat:-.6},{ds:19,lat:2},{ds:-9,lat:-1.8}]:[{ds:18,lat:-2},{ds:34,lat:1.9},{ds:56,lat:-1.2},{ds:-20,lat:1.6},{ds:88,lat:.4}];for(let p=1;p<this.racers.length;p++){const m=g[p-1],w=this.racers[p].physics;w.spawnAtSpline(this.physicsWorld,n+m.ds,m.lat);const y=w.getForwardVector();w.vel.copy(y).multiplyScalar(r*.96/3.6),this.racers[p].rig.updateFromPhysics(w,1,this.globalTime)}this.pipeline.resetCameraSnap(),this.pipeline.updateGameplayCamera(.016,d,this.racers[0].rig,this.physicsWorld,this.globalTime);const v=this.track.getZoneForS(d.splineS);this.hud.update(d,this.racers.slice(1).map(p=>p.physics),u?3:2,this.config.laps,v,c)};switch(e){case"s1":{t(265,1,146,"golden_hour","high",!0,"chase",0,!1);break}case"s2":{t(this.track.spec.startFinishS-18,0,0,"golden_hour","high",!1,"chase",.28,!1);const n=this.racers[0].rig.root.position,i=this.racers[0].physics.getForwardVector(),r=this.racers[0].physics.getRightVector();this.staticCameraOverride={pos:n.clone().addScaledVector(i,3.85).addScaledVector(r,-2.55).add(new I(0,1.02,0)),look:n.clone().addScaledVector(i,-.15).add(new I(0,.64,0)),fov:42};break}case"s3":{t(290,0,118,"golden_hour","high",!1,"chase"),this.track.sampleAtS(295);const n=this.propsBridge.coastalRocks[6]??{x:-55,z:40};this.staticCameraOverride={pos:new I(n.x+15.5,2.55,n.z+18),look:new I(n.x-4,.55,n.z-14),fov:52};break}case"s4":{t(985,-.6,98,"golden_hour","high",!0,"chase",.22,!1);break}case"s5":{t(this.track.spec.plaza.s-66,.9,86,"golden_hour","high",!0,"chase",.08,!1);break}case"s6":{t(2770,0,112,"golden_hour","high",!0,"chase",-.15,!1);break}case"s7":{t(this.track.spec.bridge.startS+44,.2,118,"golden_hour","high",!0,"chase",0,!1);const n=this.track.sampleAtS(this.track.spec.bridge.startS+28),i=this.track.sampleAtS(this.track.spec.bridge.startS+78),r=n.pos.clone().addScaledVector(n.flatRight,-18.5),a=this.terrain.getHeight(r.x,r.z);r.y=Math.max(a+3.2,n.pos.y-3),this.staticCameraOverride={pos:r,look:i.pos.clone().add(new I(0,-3.5,0)),fov:54};break}case"s8":{t(2030,.6,98,"golden_hour","high",!0,"chase",.15,!0);break}case"s9":{t(860,-2,96,"golden_hour","high",!0,"chase");const n=this.track.sampleAtS(865);this.staticCameraOverride={pos:n.pos.clone().addScaledVector(n.flatRight,-3.1).add(new I(0,.96,0)),look:n.pos.clone().addScaledVector(n.tangent,24).addScaledVector(n.flatRight,-4.6).add(new I(0,.35,0)),fov:48};break}case"s10":{t(this.track.spec.plaza.s-66,.9,86,"golden_hour","low",!0,"chase",.08,!1);break}case"s11":{const n=this.village.scaleProofAnchor;t(n.carParkS,n.carParkLateral,0,"golden_hour","high",!1,"chase");const i=this.racers[0].rig.root.position,r=n.doorPos,a=i.clone().lerp(r,.45),o=this.track.sampleAtS(n.carParkS).tangent;this.staticCameraOverride={pos:a.clone().addScaledVector(o,-7.8).addScaledVector(n.facingDir,3.6).add(new I(0,1.35,0)),look:a.clone().add(new I(0,.85,0)),fov:46};break}case"s12":{t(200,0,0,"golden_hour","high",!1,"chase"),this.waterSky.setFogDensityOverride(3e-5,this.scene),this.staticCameraOverride={pos:new I(295,1180,15),look:new I(295,0,14),fov:54};break}case"s13":{t(920,-.5,108,"night","high",!0,"chase",.14,!1);break}case"s14":{t(this.track.spec.plaza.s-56,.5,84,"night","high",!0,"chase",.08,!0);break}case"s15":{t(975,-.5,96,"golden_hour","high",!0,"cockpit",.58,!1);break}}this.pipeline.render()}poseSweepAtS(e,t){this.staticCameraOverride=null,this.waterSky.setFogDensityOverride(null,this.scene),(this.config.quality!==t||this.config.lighting!=="golden_hour")&&(this.config.quality=t,this.config.lighting="golden_hour",this.applyLightingAndQuality()),(this.racers.length===0||this.screen!=="racing")&&this.startRace(!0),this.screen="racing",this.menus.clear(),this.hud.setVisible(!1),this.setCameraMode("chase");const n=this.racers[0].physics;n.spawnAtSpline(this.physicsWorld,e,0),n.vel.copy(n.getForwardVector()).multiplyScalar(22),this.racers[0].rig.updateFromPhysics(n,1,this.globalTime),this.pipeline.resetCameraSnap(),this.pipeline.updateGameplayCamera(.016,n,this.racers[0].rig,this.physicsWorld,this.globalTime),this.pipeline.setStaticBlurZero(),this.pipeline.render()}installVerificationAPI(){window.__RACING_API__={getScreen:()=>this.screen,getTrackLength:()=>this.track.length,getValidationReport:()=>this.validationReport,getSceneStats:()=>this.collectLiveSceneStats(),setConfig:e=>this.updateConfig(e),navigateTo:e=>this.navigateTo(e),startRace:(e=!1)=>this.startRace(e),setPaused:e=>this.setPaused(e),setCameraMode:e=>this.setCameraMode(e),setAutopilot:(e,t)=>{this.testAutopilot=e,this.testAutopilotAllowNitro=(t==null?void 0:t.allowNitro)??!0,this.testAutopilotPace=(t==null?void 0:t.pace)??1.02},setInputOverride:e=>{this.testInputOverride=e},poseForShot:e=>this.poseForShot(e),poseSweepAtS:(e,t="high")=>this.poseSweepAtS(e,t),unlockAudio:()=>this.audio.unlock(),startAudioCapture:()=>this.audio.startMasterPCMCapture(),stopAudioCapture:()=>this.audio.stopMasterPCMCapture(),getAudioAudit:()=>this.audio.getAuditReport(),startVideoCapture:()=>{const e=this.canvas.captureStream(30),t=this.audio.getMediaStream(),n=[...e.getVideoTracks(),...t?t.getAudioTracks():[]],i=new MediaStream(n),r=MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm";this.videoChunks=[],this.mediaRecorder=new MediaRecorder(i,{mimeType:r,videoBitsPerSecond:45e5}),this.mediaRecorder.ondataavailable=a=>{a.data.size>0&&this.videoChunks.push(a.data)},this.mediaRecorder.onstop=()=>{var o;const a=new Blob(this.videoChunks,{type:r});(o=this.videoStopResolve)==null||o.call(this,a),this.videoStopResolve=null},this.mediaRecorder.start(500)},stopVideoCapture:async()=>{if(!this.mediaRecorder)return"";const e=await new Promise(r=>{this.videoStopResolve=r,this.mediaRecorder.stop()});this.mediaRecorder=null;const t=new Uint8Array(await e.arrayBuffer());let n="";const i=32768;for(let r=0;r<t.length;r+=i)n+=String.fromCharCode(...t.subarray(r,r+i));return btoa(n)},advancePhysicsSteps:e=>{for(let t=0;t<e&&(this.stepFixedPhysics(this.fixedDt),this.screen!=="results");t++);for(const t of this.racers)t.rig.updateFromPhysics(t.physics,1,this.globalTime)},placePlayerAt:(e,t)=>{this.racers.length!==0&&(this.racers[0].physics.spawnAtSpline(this.physicsWorld,e,t),this.racers[0].rig.updateFromPhysics(this.racers[0].physics,1,this.globalTime),this.pipeline.resetCameraSnap())},getRaceTelemetry:()=>{var t;const e=(t=this.racers[0])==null?void 0:t.physics;return{screen:this.screen,raceElapsed:this.raceElapsed,player:e?{x:e.pos.x,y:e.pos.y,z:e.pos.z,yaw:e.yaw,s:e.splineS,lateral:e.splineLateral,speedKmh:e.telemetry.speedKmh,gear:e.telemetry.gear,rpm:e.telemetry.rpm,nitro:e.nitro,nitroActive:e.nitroActive,lap:e.lap,checkpointsPassed:e.checkpointsPassed,nextCheckpoint:e.nextCheckpoint,finished:e.finished,bestLapTime:e.bestLapTime,safetyResetCount:e.safetyResetCount,underTerrainResets:e.underTerrainResets,outOfWorldResets:e.outOfWorldResets,maxWheelAirGap:e.maxWheelAirGap}:null,aiOvertakesCount:this.aiOvertakesCount,aiOvertakeLog:this.aiOvertakeLog,aiMaxStuckSeconds:this.aiMaxStuckSeconds,totalResetsAllCars:this.racers.reduce((n,i)=>n+i.physics.safetyResetCount,0),totalUnderTerrainResetsAllCars:this.racers.reduce((n,i)=>n+i.physics.underTerrainResets,0),cameraClipViolations:this.cameraClipViolations}},resetFPSWindow:()=>{this.frameDeltasMs=[]},getFPSStats:()=>{if(this.frameDeltasMs.length===0)return{avgFps:0,low1PctFps:0,samples:0};const e=[...this.frameDeltasMs].sort((r,a)=>r-a),t=e.reduce((r,a)=>r+a,0)/e.length,n=Math.min(e.length-1,Math.floor(e.length*.99)),i=e[n];return{avgFps:Math.round(1e3/t*10)/10,low1PctFps:Math.round(1e3/i*10)/10,samples:e.length}}}}}async function yv(){const s=document.getElementById("game-canvas"),e=document.getElementById("hud-root"),t=document.getElementById("ui-root"),n=new Mv(s,e,t);try{await n.init()}catch(i){console.error("[CostaDoradaGP] Fatal startup error:",i),t.innerHTML=`<div class="loading-wrap"><div class="brand-title" style="font-size:32px;">INITIALIZATION ERROR</div><pre style="margin-top:16px;color:#f87171;max-width:720px;white-space:pre-wrap;">${String(i)}</pre></div>`}}yv();
