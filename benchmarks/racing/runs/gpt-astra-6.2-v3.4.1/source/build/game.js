var ou=0,wl=1,au=2;var Tl=1,ya=2,Wn=3,ii=0,Ye=1,re=2,li=0,Gi=1,Al=2,El=3,Cl=4,cu=5,Mi=100,lu=101,hu=102,uu=103,du=104,fu=200,pu=201,mu=202,gu=203,Ho=204,Wo=205,_u=206,xu=207,vu=208,yu=209,Mu=210,bu=211,Su=212,wu=213,Tu=214,Ma=0,ba=1,Sa=2,Hi=3,wa=4,Ta=5,Aa=6,Ea=7,Rl=0,Au=1,Eu=2,hi=0,Cu=1,Ru=2,Iu=3,Ca=4,Pu=5,Du=6,Lu=7;var Il=300,Ki=301,ji=302,ks=303,Ra=304,qr=306,ws=1e3,kn=1001,Xo=1002,cn=1003,Uu=1004;var Yr=1005;var Be=1006,Ia=1007;var ui=1008;var Dn=1009,Pl=1010,Dl=1011,Vs=1012,Pa=1013,Xn=1014,sn=1015,yn=1016,Da=1017,La=1018,Gs=1020,Ll=35902,Ul=35899,Nl=1021,Fl=1022,En=1023,Ts=1026,Hs=1027,Ua=1028,Na=1029,Bl=1030,Fa=1031;var Ba=1033,Zr=33776,Jr=33777,$r=33778,Kr=33779,Oa=35840,za=35841,ka=35842,Va=35843,Ga=36196,Ha=37492,Wa=37496,Xa=37808,qa=37809,Ya=37810,Za=37811,Ja=37812,$a=37813,Ka=37814,ja=37815,Qa=37816,tc=37817,ec=37818,nc=37819,ic=37820,sc=37821,rc=36492,oc=36494,ac=36495,cc=36283,lc=36284,hc=36285,uc=36286;var fr=2300,qo=2301,Go=2302,dl=2400,fl=2401,pl=2402;var Nu=3200,Fu=3201;var Ol=0,Bu=1,Ln="",Re="srgb",si="srgb-linear",pr="linear",me="srgb";var ki=7680;var ml=519,Ou=512,zu=513,ku=514,zl=515,Vu=516,Gu=517,Hu=518,Wu=519,Yo=35044;var kl="300 es",Pn=2e3,mr=2001;var ri=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var zc=Math.PI/180,Zo=180/Math.PI;function ei(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Je[i&255]+Je[i>>8&255]+Je[i>>16&255]+Je[i>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function Sf(i,t){return(i%t+t)%t}function kc(i,t,e){return(1-e)*i+e*t}function zn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function xe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ct=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},gn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3],d=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(h!==x||c!==d||l!==p||u!==g){let m=1-a,f=c*d+l*p+u*g+h*x,v=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){let T=Math.sqrt(M),S=Math.atan2(T,f*v);m=Math.sin(m*S)/T,a=Math.sin(a*S)/T}let _=a*v;if(c=c*m+d*_,l=l*m+p*_,u=u*m+g*_,h=h*m+x*_,m===1-a){let T=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=T,l*=T,u*=T,h*=T}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+u*h+c*p-l*d,t[e+1]=c*g+u*d+l*h-a*p,t[e+2]=l*g+u*p+a*d-c*h,t[e+3]=u*g-a*h-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),h=a(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*u*h+l*p*g,this._y=l*p*h-d*u*g,this._z=l*u*g+d*p*h,this._w=l*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+l*p*g,this._y=l*p*h-d*u*g,this._z=l*u*g-d*p*h,this._w=l*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-l*p*g,this._y=l*p*h+d*u*g,this._z=l*u*g+d*p*h,this._w=l*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-l*p*g,this._y=l*p*h+d*u*g,this._z=l*u*g-d*p*h,this._w=l*u*h+d*p*g;break;case"YZX":this._x=d*u*h+l*p*g,this._y=l*p*h+d*u*g,this._z=l*u*g-d*p*h,this._w=l*u*h-d*p*g;break;case"XZY":this._x=d*u*h-l*p*g,this._y=l*p*h-d*u*g,this._z=l*u*g+d*p*h,this._w=l*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>h){let p=2*Math.sqrt(1+n-a-h);this._w=(u-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>h){let p=2*Math.sqrt(1+a-n-h);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+h-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-e)*u)/l,d=Math.sin(e*u)/l;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+c*l+o*h-a*u,this.y=n+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Vc.copy(this).projectOnVector(t),this.sub(Vc)}reflect(t){return this.sub(Vc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Vc=new O,Lh=new gn,jt=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],p=n[5],g=n[8],x=s[0],m=s[3],f=s[6],v=s[1],M=s[4],_=s[7],T=s[2],S=s[5],C=s[8];return r[0]=o*x+a*v+c*T,r[3]=o*m+a*M+c*S,r[6]=o*f+a*_+c*C,r[1]=l*x+u*v+h*T,r[4]=l*m+u*M+h*S,r[7]=l*f+u*_+h*C,r[2]=d*x+p*v+g*T,r[5]=d*m+p*M+g*S,r[8]=d*f+p*_+g*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,d=a*c-u*r,p=l*r-o*c,g=e*h+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=h*x,t[1]=(s*l-u*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(u*e-s*c)*x,t[5]=(s*r-a*e)*x,t[6]=p*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Gc.makeScale(t,e)),this}rotate(t){return this.premultiply(Gc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Gc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Gc=new jt;function Vl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function As(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xu(){let i=As("canvas");return i.style.display="block",i}var Uh={};function Es(i){i in Uh||(Uh[i]=!0,console.warn(i))}function qu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Nh=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fh=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wf(){let i={enabled:!0,workingColorSpace:si,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===me&&(s.r=ni(s.r),s.g=ni(s.g),s.b=ni(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===me&&(s.r=bs(s.r),s.g=bs(s.g),s.b=bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ln?pr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Es("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Es("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[si]:{primaries:t,whitePoint:n,transfer:pr,toXYZ:Nh,fromXYZ:Fh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:n,transfer:me,toXYZ:Nh,fromXYZ:Fh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),i}var ae=wf();function ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var cs,Jo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{cs===void 0&&(cs=As("canvas")),cs.width=t.width,cs.height=t.height;let s=cs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=cs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=As("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ni(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ni(e[n]/255)*255):e[n]=ni(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Tf=0,Cs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=ei(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Hc(s[o].image)):r.push(Hc(s[o]))}else r=Hc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Hc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Af=0,Wc=new O,je=class i extends ri{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=kn,s=kn,r=Be,o=ui,a=En,c=Dn,l=i.DEFAULT_ANISOTROPY,u=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=ei(),this.name="",this.source=new Cs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ct(0,0),this.repeat=new ct(1,1),this.center=new ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Wc).x}get height(){return this.source.getSize(Wc).y}get depth(){return this.source.getSize(Wc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Il)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ws:t.x=t.x-Math.floor(t.x);break;case kn:t.x=t.x<0?0:1;break;case Xo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ws:t.y=t.y-Math.floor(t.y);break;case kn:t.y=t.y<0?0:1;break;case Xo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=Il;je.DEFAULT_ANISOTROPY=1;var Ae=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],p=c[5],g=c[9],x=c[2],m=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(l+1)/2,_=(p+1)/2,T=(f+1)/2,S=(u+d)/4,C=(h+x)/4,w=(g+m)/4;return M>_&&M>T?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=S/n,r=C/n):_>T?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=w/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=w/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(h-x)/v,this.z=(d-u)/v,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$o=class extends ri{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Be,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new je(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Be,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Cs(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ln=class extends $o{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},gr=class extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ko=class extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Vn=class{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Cn):Cn.fromBufferAttribute(r,o),Cn.applyMatrix4(t.matrixWorld),this.expandByPoint(Cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xo.copy(n.boundingBox)),xo.applyMatrix4(t.matrixWorld),this.union(xo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Cn),Cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(sr),vo.subVectors(this.max,sr),ls.subVectors(t.a,sr),hs.subVectors(t.b,sr),us.subVectors(t.c,sr),pi.subVectors(hs,ls),mi.subVectors(us,hs),Fi.subVectors(ls,us);let e=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Fi.z,Fi.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Fi.z,0,-Fi.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Fi.y,Fi.x,0];return!Xc(e,ls,hs,us,vo)||(e=[1,0,0,0,1,0,0,0,1],!Xc(e,ls,hs,us,vo))?!1:(yo.crossVectors(pi,mi),e=[yo.x,yo.y,yo.z],Xc(e,ls,hs,us,vo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Zn=[new O,new O,new O,new O,new O,new O,new O,new O],Cn=new O,xo=new Vn,ls=new O,hs=new O,us=new O,pi=new O,mi=new O,Fi=new O,sr=new O,vo=new O,yo=new O,Bi=new O;function Xc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Bi.fromArray(i,r);let a=s.x*Math.abs(Bi.x)+s.y*Math.abs(Bi.y)+s.z*Math.abs(Bi.z),c=t.dot(Bi),l=e.dot(Bi),u=n.dot(Bi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}var Ef=new Vn,rr=new O,qc=new O,oi=class{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Ef.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rr.subVectors(t,this.center);let e=rr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(rr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(qc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rr.copy(t.center).add(qc)),this.expandByPoint(rr.copy(t.center).sub(qc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Jn=new O,Yc=new O,Mo=new O,gi=new O,Zc=new O,bo=new O,Jc=new O,_r=class{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Jn.copy(this.origin).addScaledVector(this.direction,e),Jn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Yc.copy(t).add(e).multiplyScalar(.5),Mo.copy(e).sub(t).normalize(),gi.copy(this.origin).sub(Yc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Mo),a=gi.dot(this.direction),c=-gi.dot(Mo),l=gi.lengthSq(),u=Math.abs(1-o*o),h,d,p,g;if(u>0)if(h=o*c-a,d=o*a-c,g=r*u,h>=0)if(d>=-g)if(d<=g){let x=1/u;h*=x,d*=x,p=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-c),r),p=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-c),r),p=-h*h+d*(d+2*c)+l);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Yc).addScaledVector(Mo,d),p}intersectSphere(t,e){Jn.subVectors(t.center,this.origin);let n=Jn.dot(this.direction),s=Jn.dot(Jn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Jn)!==null}intersectTriangle(t,e,n,s,r){Zc.subVectors(e,t),bo.subVectors(n,t),Jc.crossVectors(Zc,bo);let o=this.direction.dot(Jc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;gi.subVectors(this.origin,t);let c=a*this.direction.dot(bo.crossVectors(gi,bo));if(c<0)return null;let l=a*this.direction.dot(Zc.cross(gi));if(l<0||c+l>o)return null;let u=-a*gi.dot(Jc);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},se=class i{constructor(t,e,n,s,r,o,a,c,l,u,h,d,p,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,u,h,d,p,g,x,m)}set(t,e,n,s,r,o,a,c,l,u,h,d,p,g,x,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=x,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ds.setFromMatrixColumn(t,0).length(),r=1/ds.setFromMatrixColumn(t,1).length(),o=1/ds.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let d=o*u,p=o*h,g=a*u,x=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=p+g*l,e[5]=d-x*l,e[9]=-a*c,e[2]=x-d*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){let d=c*u,p=c*h,g=l*u,x=l*h;e[0]=d+x*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-g,e[6]=x+d*a,e[10]=o*c}else if(t.order==="ZXY"){let d=c*u,p=c*h,g=l*u,x=l*h;e[0]=d-x*a,e[4]=-o*h,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*u,e[9]=x-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let d=o*u,p=o*h,g=a*u,x=a*h;e[0]=c*u,e[4]=g*l-p,e[8]=d*l+x,e[1]=c*h,e[5]=x*l+d,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let d=o*c,p=o*l,g=a*c,x=a*l;e[0]=c*u,e[4]=x-d*h,e[8]=g*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=p*h+g,e[10]=d-x*h}else if(t.order==="XZY"){let d=o*c,p=o*l,g=a*c,x=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+x,e[5]=o*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=a*u,e[10]=x*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Cf,t,Rf)}lookAt(t,e,n){let s=this.elements;return pn.subVectors(t,e),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),_i.crossVectors(n,pn),_i.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),_i.crossVectors(n,pn)),_i.normalize(),So.crossVectors(pn,_i),s[0]=_i.x,s[4]=So.x,s[8]=pn.x,s[1]=_i.y,s[5]=So.y,s[9]=pn.y,s[2]=_i.z,s[6]=So.z,s[10]=pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],p=n[13],g=n[2],x=n[6],m=n[10],f=n[14],v=n[3],M=n[7],_=n[11],T=n[15],S=s[0],C=s[4],w=s[8],y=s[12],b=s[1],E=s[5],I=s[9],D=s[13],N=s[2],F=s[6],L=s[10],Y=s[14],G=s[3],z=s[7],et=s[11],rt=s[15];return r[0]=o*S+a*b+c*N+l*G,r[4]=o*C+a*E+c*F+l*z,r[8]=o*w+a*I+c*L+l*et,r[12]=o*y+a*D+c*Y+l*rt,r[1]=u*S+h*b+d*N+p*G,r[5]=u*C+h*E+d*F+p*z,r[9]=u*w+h*I+d*L+p*et,r[13]=u*y+h*D+d*Y+p*rt,r[2]=g*S+x*b+m*N+f*G,r[6]=g*C+x*E+m*F+f*z,r[10]=g*w+x*I+m*L+f*et,r[14]=g*y+x*D+m*Y+f*rt,r[3]=v*S+M*b+_*N+T*G,r[7]=v*C+M*E+_*F+T*z,r[11]=v*w+M*I+_*L+T*et,r[15]=v*y+M*D+_*Y+T*rt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],p=t[14],g=t[3],x=t[7],m=t[11],f=t[15];return g*(+r*c*h-s*l*h-r*a*d+n*l*d+s*a*p-n*c*p)+x*(+e*c*p-e*l*d+r*o*d-s*o*p+s*l*u-r*c*u)+m*(+e*l*h-e*a*p-r*o*h+n*o*p+r*a*u-n*l*u)+f*(-s*a*u-e*c*h+e*a*d+s*o*h-n*o*d+n*c*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],p=t[11],g=t[12],x=t[13],m=t[14],f=t[15],v=h*m*l-x*d*l+x*c*p-a*m*p-h*c*f+a*d*f,M=g*d*l-u*m*l-g*c*p+o*m*p+u*c*f-o*d*f,_=u*x*l-g*h*l+g*a*p-o*x*p-u*a*f+o*h*f,T=g*h*c-u*x*c-g*a*d+o*x*d+u*a*m-o*h*m,S=e*v+n*M+s*_+r*T;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/S;return t[0]=v*C,t[1]=(x*d*r-h*m*r-x*s*p+n*m*p+h*s*f-n*d*f)*C,t[2]=(a*m*r-x*c*r+x*s*l-n*m*l-a*s*f+n*c*f)*C,t[3]=(h*c*r-a*d*r-h*s*l+n*d*l+a*s*p-n*c*p)*C,t[4]=M*C,t[5]=(u*m*r-g*d*r+g*s*p-e*m*p-u*s*f+e*d*f)*C,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*f-e*c*f)*C,t[7]=(o*d*r-u*c*r+u*s*l-e*d*l-o*s*p+e*c*p)*C,t[8]=_*C,t[9]=(g*h*r-u*x*r-g*n*p+e*x*p+u*n*f-e*h*f)*C,t[10]=(o*x*r-g*a*r+g*n*l-e*x*l-o*n*f+e*a*f)*C,t[11]=(u*a*r-o*h*r-u*n*l+e*h*l+o*n*p-e*a*p)*C,t[12]=T*C,t[13]=(u*x*s-g*h*s+g*n*d-e*x*d-u*n*m+e*h*m)*C,t[14]=(g*a*s-o*x*s-g*n*c+e*x*c+o*n*m-e*a*m)*C,t[15]=(o*h*s-u*a*s+u*n*c-e*h*c-o*n*d+e*a*d)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,h=a+a,d=r*l,p=r*u,g=r*h,x=o*u,m=o*h,f=a*h,v=c*l,M=c*u,_=c*h,T=n.x,S=n.y,C=n.z;return s[0]=(1-(x+f))*T,s[1]=(p+_)*T,s[2]=(g-M)*T,s[3]=0,s[4]=(p-_)*S,s[5]=(1-(d+f))*S,s[6]=(m+v)*S,s[7]=0,s[8]=(g+M)*C,s[9]=(m-v)*C,s[10]=(1-(d+x))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ds.set(s[0],s[1],s[2]).length(),o=ds.set(s[4],s[5],s[6]).length(),a=ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Rn.copy(this);let l=1/r,u=1/o,h=1/a;return Rn.elements[0]*=l,Rn.elements[1]*=l,Rn.elements[2]*=l,Rn.elements[4]*=u,Rn.elements[5]*=u,Rn.elements[6]*=u,Rn.elements[8]*=h,Rn.elements[9]*=h,Rn.elements[10]*=h,e.setFromRotationMatrix(Rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Pn,c=!1){let l=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s),g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===Pn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===mr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Pn,c=!1){let l=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),p=-(n+s)/(n-s),g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===Pn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===mr)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ds=new O,Rn=new se,Cf=new O(0,0,0),Rf=new O(1,1,1),_i=new O,So=new O,pn=new O,Bh=new se,Oh=new gn,_n=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Bh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Bh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Oh.setFromEuler(this),this.setFromQuaternion(Oh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};_n.DEFAULT_ORDER="XYZ";var xr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},If=0,zh=new O,fs=new gn,$n=new se,wo=new O,or=new O,Pf=new O,Df=new gn,kh=new O(1,0,0),Vh=new O(0,1,0),Gh=new O(0,0,1),Hh={type:"added"},Lf={type:"removed"},ps={type:"childadded",child:null},$c={type:"childremoved",child:null},Xe=class i extends ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new O,e=new _n,n=new gn,s=new O(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new jt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.multiply(fs),this}rotateOnWorldAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.premultiply(fs),this}rotateX(t){return this.rotateOnAxis(kh,t)}rotateY(t){return this.rotateOnAxis(Vh,t)}rotateZ(t){return this.rotateOnAxis(Gh,t)}translateOnAxis(t,e){return zh.copy(t).applyQuaternion(this.quaternion),this.position.add(zh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(kh,t)}translateY(t){return this.translateOnAxis(Vh,t)}translateZ(t){return this.translateOnAxis(Gh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4($n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?wo.copy(t):wo.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$n.lookAt(or,wo,this.up):$n.lookAt(wo,or,this.up),this.quaternion.setFromRotationMatrix($n),s&&($n.extractRotation(s.matrixWorld),fs.setFromRotationMatrix($n),this.quaternion.premultiply(fs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Hh),ps.child=t,this.dispatchEvent(ps),ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Lf),$c.child=t,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),$n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),$n.multiply(t.parent.matrixWorld)),t.applyMatrix4($n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Hh),ps.child=t,this.dispatchEvent(ps),ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,t,Pf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,Df,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Xe.DEFAULT_UP=new O(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var In=new O,Kn=new O,Kc=new O,jn=new O,ms=new O,gs=new O,Wh=new O,jc=new O,Qc=new O,tl=new O,el=new Ae,nl=new Ae,il=new Ae,yi=class i{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),In.subVectors(t,e),s.cross(In);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){In.subVectors(s,e),Kn.subVectors(n,e),Kc.subVectors(t,e);let o=In.dot(In),a=In.dot(Kn),c=In.dot(Kc),l=Kn.dot(Kn),u=Kn.dot(Kc),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,p=(l*c-a*u)*d,g=(o*u-a*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(o,jn.y),c.addScaledVector(a,jn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return el.setScalar(0),nl.setScalar(0),il.setScalar(0),el.fromBufferAttribute(t,e),nl.fromBufferAttribute(t,n),il.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(el,r.x),o.addScaledVector(nl,r.y),o.addScaledVector(il,r.z),o}static isFrontFacing(t,e,n,s){return In.subVectors(n,e),Kn.subVectors(t,e),In.cross(Kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),Kn.subVectors(this.a,this.b),In.cross(Kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;ms.subVectors(s,n),gs.subVectors(r,n),jc.subVectors(t,n);let c=ms.dot(jc),l=gs.dot(jc);if(c<=0&&l<=0)return e.copy(n);Qc.subVectors(t,s);let u=ms.dot(Qc),h=gs.dot(Qc);if(u>=0&&h<=u)return e.copy(s);let d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(n).addScaledVector(ms,o);tl.subVectors(t,r);let p=ms.dot(tl),g=gs.dot(tl);if(g>=0&&p<=g)return e.copy(r);let x=p*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(gs,a);let m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Wh.subVectors(r,s),a=(h-u)/(h-u+(p-g)),e.copy(s).addScaledVector(Wh,a);let f=1/(m+x+d);return o=x*f,a=d*f,e.copy(n).addScaledVector(ms,o).addScaledVector(gs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Yu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xi={h:0,s:0,l:0},To={h:0,s:0,l:0};function sl(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Zt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Re){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=Sf(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=sl(o,r,t+1/3),this.g=sl(o,r,t),this.b=sl(o,r,t-1/3)}return ae.colorSpaceToWorking(this,s),this}setStyle(t,e=Re){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Re){let n=Yu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ni(t.r),this.g=ni(t.g),this.b=ni(t.b),this}copyLinearToSRGB(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Re){return ae.workingToColorSpace($e.copy(this),t),Math.round(te($e.r*255,0,255))*65536+Math.round(te($e.g*255,0,255))*256+Math.round(te($e.b*255,0,255))}getHexString(t=Re){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace($e.copy(this),e);let n=$e.r,s=$e.g,r=$e.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,u=(a+o)/2;if(a===o)c=0,l=0;else{let h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=Re){ae.workingToColorSpace($e.copy(this),t);let e=$e.r,n=$e.g,s=$e.b;return t!==Re?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(xi),this.setHSL(xi.h+t,xi.s+e,xi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(xi),t.getHSL(To);let n=kc(xi.h,To.h,e),s=kc(xi.s,To.s,e),r=kc(xi.l,To.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},$e=new Zt;Zt.NAMES=Yu;var Uf=0,ai=class extends ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=Gi,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ho,this.blendDst=Wo,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ho&&(n.blendSrc=this.blendSrc),this.blendDst!==Wo&&(n.blendDst=this.blendDst),this.blendEquation!==Mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Wi=class extends ai{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Rl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},ti=Nf();function Nf(){let i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(n[c]=0,n[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,s[c]=24,s[c|256]=24):(n[c]=31744,n[c|256]=64512,s[c]=13,s[c|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,u=0;for(;(l&8388608)===0;)l<<=1,u-=8388608;l&=-8388609,u+=947912704,r[c]=l|u}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)o[c]=c<<23;o[31]=1199570944,o[32]=2147483648;for(let c=33;c<63;++c)o[c]=2147483648+(c-32<<23);o[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(a[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Ff(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=te(i,-65504,65504),ti.floatView[0]=i;let t=ti.uint32View[0],e=t>>23&511;return ti.baseTable[e]+((t&8388607)>>ti.shiftTable[e])}function Bf(i){let t=i>>10;return ti.uint32View[0]=ti.mantissaTable[ti.offsetTable[t]+(i&1023)]+ti.exponentTable[t],ti.floatView[0]}var bi=class{static toHalfFloat(t){return Ff(t)}static fromHalfFloat(t){return Bf(t)}},Fe=new O,Ao=new ct,Of=0,Pe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Of++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Yo,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ao.fromBufferAttribute(this,e),Ao.applyMatrix3(t),this.setXY(e,Ao.x,Ao.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=zn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zn(e,this.array)),e}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zn(e,this.array)),e}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zn(e,this.array)),e}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array),r=xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Yo&&(t.usage=this.usage),t}};var vr=class extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var yr=class extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var kt=class extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}},zf=0,An=new se,rl=new Xe,_s=new O,mn=new Vn,ar=new Vn,Ge=new O,ue=class i extends ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vl(t)?yr:vr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return An.makeRotationFromQuaternion(t),this.applyMatrix4(An),this}rotateX(t){return An.makeRotationX(t),this.applyMatrix4(An),this}rotateY(t){return An.makeRotationY(t),this.applyMatrix4(An),this}rotateZ(t){return An.makeRotationZ(t),this.applyMatrix4(An),this}translate(t,e,n){return An.makeTranslation(t,e,n),this.applyMatrix4(An),this}scale(t,e,n){return An.makeScale(t,e,n),this.applyMatrix4(An),this}lookAt(t){return rl.lookAt(t),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new kt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new oi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){let n=this.boundingSphere.center;if(mn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];ar.setFromBufferAttribute(a),this.morphTargetsRelative?(Ge.addVectors(mn.min,ar.min),mn.expandByPoint(Ge),Ge.addVectors(mn.max,ar.max),mn.expandByPoint(Ge)):(mn.expandByPoint(ar.min),mn.expandByPoint(ar.max))}mn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ge));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Ge.fromBufferAttribute(a,l),c&&(_s.fromBufferAttribute(t,l),Ge.add(_s)),s=Math.max(s,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let w=0;w<n.count;w++)a[w]=new O,c[w]=new O;let l=new O,u=new O,h=new O,d=new ct,p=new ct,g=new ct,x=new O,m=new O;function f(w,y,b){l.fromBufferAttribute(n,w),u.fromBufferAttribute(n,y),h.fromBufferAttribute(n,b),d.fromBufferAttribute(r,w),p.fromBufferAttribute(r,y),g.fromBufferAttribute(r,b),u.sub(l),h.sub(l),p.sub(d),g.sub(d);let E=1/(p.x*g.y-g.x*p.y);isFinite(E)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(E),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(E),a[w].add(x),a[y].add(x),a[b].add(x),c[w].add(m),c[y].add(m),c[b].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let w=0,y=v.length;w<y;++w){let b=v[w],E=b.start,I=b.count;for(let D=E,N=E+I;D<N;D+=3)f(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let M=new O,_=new O,T=new O,S=new O;function C(w){T.fromBufferAttribute(s,w),S.copy(T);let y=a[w];M.copy(y),M.sub(T.multiplyScalar(T.dot(y))).normalize(),_.crossVectors(S,y);let E=_.dot(c[w])<0?-1:1;o.setXYZW(w,M.x,M.y,M.z,E)}for(let w=0,y=v.length;w<y;++w){let b=v[w],E=b.start,I=b.count;for(let D=E,N=E+I;D<N;D+=3)C(t.getX(D+0)),C(t.getX(D+1)),C(t.getX(D+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new O,r=new O,o=new O,a=new O,c=new O,l=new O,u=new O,h=new O;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(a,c){let l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u),p=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?p=c[x]*a.data.stride+a.offset:p=c[x]*u;for(let f=0;f<u;f++)d[g++]=l[p++]}return new Pe(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){let d=l[u],p=t(d,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){let p=l[h];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],h=r[l];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,u=o.length;l<u;l++){let h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xh=new se,Oi=new _r,Eo=new oi,qh=new O,Co=new O,Ro=new O,Io=new O,ol=new O,Po=new O,Yh=new O,Do=new O,Me=class extends Xe{constructor(t=new ue,e=new Wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Po.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=a[c],h=r[c];u!==0&&(ol.fromBufferAttribute(h,t),o?Po.addScaledVector(ol,u):Po.addScaledVector(ol.sub(e),u))}e.add(Po)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Eo.copy(n.boundingSphere),Eo.applyMatrix4(r),Oi.copy(t.ray).recast(t.near),!(Eo.containsPoint(Oi.origin)===!1&&(Oi.intersectSphere(Eo,qh)===null||Oi.origin.distanceToSquared(qh)>(t.far-t.near)**2))&&(Xh.copy(r).invert(),Oi.copy(t.ray).applyMatrix4(Xh),!(n.boundingBox!==null&&Oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Oi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),M=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=v,T=M;_<T;_+=3){let S=a.getX(_),C=a.getX(_+1),w=a.getX(_+2);s=Lo(this,f,t,n,l,u,h,S,C,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){let v=a.getX(m),M=a.getX(m+1),_=a.getX(m+2);s=Lo(this,o,t,n,l,u,h,v,M,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),M=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=v,T=M;_<T;_+=3){let S=_,C=_+1,w=_+2;s=Lo(this,f,t,n,l,u,h,S,C,w),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){let v=m,M=m+1,_=m+2;s=Lo(this,o,t,n,l,u,h,v,M,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function kf(i,t,e,n,s,r,o,a){let c;if(t.side===Ye?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===ii,a),c===null)return null;Do.copy(a),Do.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Do);return l<e.near||l>e.far?null:{distance:l,point:Do.clone(),object:i}}function Lo(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Co),i.getVertexPosition(c,Ro),i.getVertexPosition(l,Io);let u=kf(i,t,e,n,Co,Ro,Io,Yh);if(u){let h=new O;yi.getBarycoord(Yh,Co,Ro,Io,h),s&&(u.uv=yi.getInterpolatedAttribute(s,a,c,l,h,new ct)),r&&(u.uv1=yi.getInterpolatedAttribute(r,a,c,l,h,new ct)),o&&(u.normal=yi.getInterpolatedAttribute(o,a,c,l,h,new O),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new O,materialIndex:0};yi.getNormal(Co,Ro,Io,d.normal),u.face=d,u.barycoord=h}return u}var Gn=class i extends ue{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],u=[],h=[],d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new kt(l,3)),this.setAttribute("normal",new kt(u,3)),this.setAttribute("uv",new kt(h,2));function g(x,m,f,v,M,_,T,S,C,w,y){let b=_/C,E=T/w,I=_/2,D=T/2,N=S/2,F=C+1,L=w+1,Y=0,G=0,z=new O;for(let et=0;et<L;et++){let rt=et*E-D;for(let Mt=0;Mt<F;Mt++){let _t=Mt*b-I;z[x]=_t*v,z[m]=rt*M,z[f]=N,l.push(z.x,z.y,z.z),z[x]=0,z[m]=0,z[f]=S>0?1:-1,u.push(z.x,z.y,z.z),h.push(Mt/C),h.push(1-et/w),Y+=1}}for(let et=0;et<w;et++)for(let rt=0;rt<C;rt++){let Mt=d+rt+F*et,_t=d+rt+F*(et+1),Gt=d+(rt+1)+F*(et+1),Ht=d+(rt+1)+F*et;c.push(Mt,_t,Ht),c.push(_t,Gt,Ht),G+=6}a.addGroup(p,G,y),p+=G,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Qi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Qe(i){let t={};for(let e=0;e<i.length;e++){let n=Qi(i[e]);for(let s in n)t[s]=n[s]}return t}function Vf(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Gl(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}var Zu={clone:Qi,merge:Qe},Gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ze=class extends ai{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gf,this.fragmentShader=Hf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Qi(t.uniforms),this.uniformsGroups=Vf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Xi=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Pn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},vi=new O,Zh=new ct,Jh=new ct,Ke=class extends Xi{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Zo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(zc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Zo*2*Math.atan(Math.tan(zc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(vi.x,vi.y).multiplyScalar(-t/vi.z),vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(vi.x,vi.y).multiplyScalar(-t/vi.z)}getViewSize(t,e){return this.getViewBounds(t,Zh,Jh),e.subVectors(Jh,Zh)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(zc*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},xs=-90,vs=1,jo=class extends Xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ke(xs,vs,t,e);s.layers=this.layers,this.add(s);let r=new Ke(xs,vs,t,e);r.layers=this.layers,this.add(r);let o=new Ke(xs,vs,t,e);o.layers=this.layers,this.add(o);let a=new Ke(xs,vs,t,e);a.layers=this.layers,this.add(a);let c=new Ke(xs,vs,t,e);c.layers=this.layers,this.add(c);let l=new Ke(xs,vs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===mr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Mr=class extends je{constructor(t=[],e=Ki,n,s,r,o,a,c,l,u){super(t,e,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Qo=class extends ln{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Mr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gn(5,5,5),r=new ze({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:li});r.uniforms.tEquirect.value=e;let o=new Me(s,r),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=Be),new jo(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},ne=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wf={type:"move"},Rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,n),f=this._getHandJoint(l,x);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Wf)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ne;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var br=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Zt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},qi=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Is=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Yo,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},nn=new O,Ps=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)nn.fromBufferAttribute(this,e),nn.applyMatrix4(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)nn.fromBufferAttribute(this,e),nn.applyNormalMatrix(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)nn.fromBufferAttribute(this,e),nn.transformDirection(t),this.setXYZ(e,nn.x,nn.y,nn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=zn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=zn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=zn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=zn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=zn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array),r=xe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Sr=class extends je{constructor(t=null,e=1,n=1,s,r,o,a,c,l=cn,u=cn,h,d){super(null,o,a,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ds=class extends Pe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ys=new se,$h=new se,Uo=[],Kh=new Vn,Xf=new se,cr=new Me,lr=new oi,wr=class extends Me{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ds(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Xf)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ys),Kh.copy(t.boundingBox).applyMatrix4(ys),this.boundingBox.union(Kh)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new oi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ys),lr.copy(t.boundingSphere).applyMatrix4(ys),this.boundingSphere.union(lr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(cr.geometry=this.geometry,cr.material=this.material,cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lr.copy(this.boundingSphere),lr.applyMatrix4(n),t.ray.intersectsSphere(lr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ys),$h.multiplyMatrices(n,ys),cr.matrixWorld=$h,cr.raycast(t,Uo);for(let o=0,a=Uo.length;o<a;o++){let c=Uo[o];c.instanceId=r,c.object=this,e.push(c)}Uo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ds(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Sr(new Float32Array(s*this.count),s,this.count,Ua,sn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},al=new O,qf=new O,Yf=new jt,On=class{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=al.subVectors(n,e).cross(qf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(al),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Yf.getNormalMatrix(t),s=this.coplanarPoint(al).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},zi=new oi,Zf=new ct(.5,.5),No=new O,Ls=class{constructor(t=new On,e=new On,n=new On,s=new On,r=new On,o=new On){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Pn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],h=r[5],d=r[6],p=r[7],g=r[8],x=r[9],m=r[10],f=r[11],v=r[12],M=r[13],_=r[14],T=r[15];if(s[0].setComponents(l-o,p-u,f-g,T-v).normalize(),s[1].setComponents(l+o,p+u,f+g,T+v).normalize(),s[2].setComponents(l+a,p+h,f+x,T+M).normalize(),s[3].setComponents(l-a,p-h,f-x,T-M).normalize(),n)s[4].setComponents(c,d,m,_).normalize(),s[5].setComponents(l-c,p-d,f-m,T-_).normalize();else if(s[4].setComponents(l-c,p-d,f-m,T-_).normalize(),e===Pn)s[5].setComponents(l+c,p+d,f+m,T+_).normalize();else if(e===mr)s[5].setComponents(c,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),zi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),zi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(zi)}intersectsSprite(t){zi.center.set(0,0,0);let e=Zf.distanceTo(t.center);return zi.radius=.7071067811865476+e,zi.applyMatrix4(t.matrixWorld),this.intersectsSphere(zi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(No.x=s.normal.x>0?t.max.x:t.min.x,No.y=s.normal.y>0?t.max.y:t.min.y,No.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(No)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ta=class extends ai{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},jh=new se,gl=new _r,Fo=new oi,Bo=new O,Tr=class extends Xe{constructor(t=new ue,e=new ta){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(s),Fo.radius+=r,t.ray.intersectsSphere(Fo)===!1)return;jh.copy(s).invert(),gl.copy(t.ray).applyMatrix4(jh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,h=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,x=p;g<x;g++){let m=l.getX(g);Bo.fromBufferAttribute(h,m),Qh(Bo,m,c,s,t,e,this)}}else{let d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=d,x=p;g<x;g++)Bo.fromBufferAttribute(h,g),Qh(Bo,g,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Qh(i,t,e,n,s,r,o){let a=gl.distanceSqToPoint(i);if(a<e){let c=new O;gl.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Si=class extends je{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Yi=class extends je{constructor(t,e,n=Xn,s,r,o,a=cn,c=cn,l,u=Ts,h=1){if(u!==Ts&&u!==Hs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:h};super(d,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Cs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Ar=class extends je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Us=class i extends ue{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new O,u=new ct;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){let p=n+h/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),o.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new kt(o,3)),this.setAttribute("normal",new kt(a,3)),this.setAttribute("uv",new kt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},hn=class i extends ue{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],p=[],g=0,x=[],m=n/2,f=0;v(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new kt(h,3)),this.setAttribute("normal",new kt(d,3)),this.setAttribute("uv",new kt(p,2));function v(){let _=new O,T=new O,S=0,C=(e-t)/n;for(let w=0;w<=r;w++){let y=[],b=w/r,E=b*(e-t)+t;for(let I=0;I<=s;I++){let D=I/s,N=D*c+a,F=Math.sin(N),L=Math.cos(N);T.x=E*F,T.y=-b*n+m,T.z=E*L,h.push(T.x,T.y,T.z),_.set(F,C,L).normalize(),d.push(_.x,_.y,_.z),p.push(D,1-b),y.push(g++)}x.push(y)}for(let w=0;w<s;w++)for(let y=0;y<r;y++){let b=x[y][w],E=x[y+1][w],I=x[y+1][w+1],D=x[y][w+1];(t>0||y!==0)&&(u.push(b,E,D),S+=3),(e>0||y!==r-1)&&(u.push(E,I,D),S+=3)}l.addGroup(f,S,0),f+=S}function M(_){let T=g,S=new ct,C=new O,w=0,y=_===!0?t:e,b=_===!0?1:-1;for(let I=1;I<=s;I++)h.push(0,m*b,0),d.push(0,b,0),p.push(.5,.5),g++;let E=g;for(let I=0;I<=s;I++){let N=I/s*c+a,F=Math.cos(N),L=Math.sin(N);C.x=y*L,C.y=m*b,C.z=y*F,h.push(C.x,C.y,C.z),d.push(0,b,0),S.x=F*.5+.5,S.y=L*.5*b+.5,p.push(S.x,S.y),g++}for(let I=0;I<s;I++){let D=T+I,N=E+I;_===!0?u.push(N,N+1,D):u.push(N+1,N,D),w+=3}l.addGroup(f,w,_===!0?1:2),f+=w}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Er=class i extends hn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ea=class i extends ue{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),l(n),u(),this.setAttribute("position",new kt(r,3)),this.setAttribute("normal",new kt(r.slice(),3)),this.setAttribute("uv",new kt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let M=new O,_=new O,T=new O;for(let S=0;S<e.length;S+=3)p(e[S+0],M),p(e[S+1],_),p(e[S+2],T),c(M,_,T,v)}function c(v,M,_,T){let S=T+1,C=[];for(let w=0;w<=S;w++){C[w]=[];let y=v.clone().lerp(_,w/S),b=M.clone().lerp(_,w/S),E=S-w;for(let I=0;I<=E;I++)I===0&&w===S?C[w][I]=y:C[w][I]=y.clone().lerp(b,I/E)}for(let w=0;w<S;w++)for(let y=0;y<2*(S-w)-1;y++){let b=Math.floor(y/2);y%2===0?(d(C[w][b+1]),d(C[w+1][b]),d(C[w][b])):(d(C[w][b+1]),d(C[w+1][b+1]),d(C[w+1][b]))}}function l(v){let M=new O;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(v),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function u(){let v=new O;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];let _=m(v)/2/Math.PI+.5,T=f(v)/Math.PI+.5;o.push(_,1-T)}g(),h()}function h(){for(let v=0;v<o.length;v+=6){let M=o[v+0],_=o[v+2],T=o[v+4],S=Math.max(M,_,T),C=Math.min(M,_,T);S>.9&&C<.1&&(M<.2&&(o[v+0]+=1),_<.2&&(o[v+2]+=1),T<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function p(v,M){let _=v*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function g(){let v=new O,M=new O,_=new O,T=new O,S=new ct,C=new ct,w=new ct;for(let y=0,b=0;y<r.length;y+=9,b+=6){v.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),S.set(o[b+0],o[b+1]),C.set(o[b+2],o[b+3]),w.set(o[b+4],o[b+5]),T.copy(v).add(M).add(_).divideScalar(3);let E=m(T);x(S,b+0,v,E),x(C,b+2,M,E),x(w,b+4,_,E)}}function x(v,M,_,T){T<0&&v.x===1&&(o[M]=v.x-1),_.x===0&&_.z===0&&(o[M]=T/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function f(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let u=n[s],d=n[s+1]-u,p=(o-u)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ct:new O);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new O,s=[],r=[],o=[],a=new O,c=new se;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new O)}r[0]=new O,o[0]=new O;let l=Number.MAX_VALUE,u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(te(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(te(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Ns=class extends xn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new ct){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*u-p*h+this.aX,l=d*h+p*u+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},na=class extends Ns{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Hl(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,h){let d=(o-r)/l-(a-r)/(l+u)+(a-o)/u,p=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,p*=u,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var Oo=new O,cl=new Hl,ll=new Hl,hl=new Hl,Hn=class extends xn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new O){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(Oo.subVectors(s[0],s[1]).add(s[0]),l=Oo);let h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Oo.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Oo),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(h),p),x=Math.pow(h.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),cl.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,x,m),ll.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,x,m),hl.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,x,m)}else this.curveType==="catmullrom"&&(cl.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),ll.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),hl.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return n.set(cl.calc(c),ll.calc(c),hl.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new O().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function tu(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Jf(i,t){let e=1-i;return e*e*t}function $f(i,t){return 2*(1-i)*i*t}function Kf(i,t){return i*i*t}function ur(i,t,e,n){return Jf(i,t)+$f(i,e)+Kf(i,n)}function jf(i,t){let e=1-i;return e*e*e*t}function Qf(i,t){let e=1-i;return 3*e*e*i*t}function tp(i,t){return 3*(1-i)*i*i*t}function ep(i,t){return i*i*i*t}function dr(i,t,e,n,s){return jf(i,t)+Qf(i,e)+tp(i,n)+ep(i,s)}var Cr=class extends xn{constructor(t=new ct,e=new ct,n=new ct,s=new ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ct){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(dr(t,s.x,r.x,o.x,a.x),dr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ia=class extends xn{constructor(t=new O,e=new O,n=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new O){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(dr(t,s.x,r.x,o.x,a.x),dr(t,s.y,r.y,o.y,a.y),dr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Rr=class extends xn{constructor(t=new ct,e=new ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ct){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sa=class extends xn{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ir=class extends xn{constructor(t=new ct,e=new ct,n=new ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ct){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ur(t,s.x,r.x,o.x),ur(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Pr=class extends xn{constructor(t=new O,e=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new O){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ur(t,s.x,r.x,o.x),ur(t,s.y,r.y,o.y),ur(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Dr=class extends xn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ct){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(tu(a,c.x,l.x,u.x,h.x),tu(a,c.y,l.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new ct().fromArray(s))}return this}},ra=Object.freeze({__proto__:null,ArcCurve:na,CatmullRomCurve3:Hn,CubicBezierCurve:Cr,CubicBezierCurve3:ia,EllipseCurve:Ns,LineCurve:Rr,LineCurve3:sa,QuadraticBezierCurve:Ir,QuadraticBezierCurve3:Pr,SplineCurve:Dr}),oa=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ra[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let u=c[l];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new ra[s.type]().fromJSON(s))}return this}},Lr=class extends oa{constructor(t){super(),this.type="Path",this.currentPoint=new ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Rr(this.currentPoint.clone(),new ct(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Ir(this.currentPoint.clone(),new ct(t,e),new ct(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Cr(this.currentPoint.clone(),new ct(t,e),new ct(n,s),new ct(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Dr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){let l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){let l=new Ns(t,e,n,s,r,o,a,c);if(this.curves.length>0){let h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);let u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ci=class extends Lr{constructor(t){super(t),this.uuid=ei(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Lr().fromJSON(s))}return this}};function np(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Ju(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=ap(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let u=-1/0,h=-1/0;for(let d=e;d<s;d+=e){let p=i[d],g=i[d+1];p<a&&(a=p),g<c&&(c=g),p>u&&(u=p),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return Ur(r,o,e,a,c,l,0),o}function Ju(i,t,e,n,s){let r;if(s===xp(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=eu(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=eu(o/n|0,i[o],i[o+1],r);return r&&Fs(r,r.next)&&(Fr(r),r=r.next),r}function Zi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Fs(e,e.next)||Ie(e.prev,e,e.next)===0)){if(Fr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ur(i,t,e,n,s,r,o){if(!i)return;!o&&r&&dp(i,n,s,r);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?sp(i,n,s,r):ip(i)){t.push(c.i,i.i,l.i),Fr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=rp(Zi(i),t),Ur(i,t,e,n,s,r,2)):o===2&&op(i,t,e,n,s,r):Ur(Zi(i),t,e,n,s,r,1);break}}}function ip(i){let t=i.prev,e=i,n=i.next;if(Ie(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,u=Math.min(s,r,o),h=Math.min(a,c,l),d=Math.max(s,r,o),p=Math.max(a,c,l),g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=p&&hr(s,a,r,c,o,l,g.x,g.y)&&Ie(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function sp(i,t,e,n){let s=i.prev,r=i,o=i.next;if(Ie(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,u=s.y,h=r.y,d=o.y,p=Math.min(a,c,l),g=Math.min(u,h,d),x=Math.max(a,c,l),m=Math.max(u,h,d),f=_l(p,g,t,e,n),v=_l(x,m,t,e,n),M=i.prevZ,_=i.nextZ;for(;M&&M.z>=f&&_&&_.z<=v;){if(M.x>=p&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&hr(a,u,c,h,l,d,M.x,M.y)&&Ie(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=p&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&hr(a,u,c,h,l,d,_.x,_.y)&&Ie(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=f;){if(M.x>=p&&M.x<=x&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&hr(a,u,c,h,l,d,M.x,M.y)&&Ie(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=v;){if(_.x>=p&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&hr(a,u,c,h,l,d,_.x,_.y)&&Ie(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function rp(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Fs(n,s)&&Ku(n,e,e.next,s)&&Nr(n,s)&&Nr(s,n)&&(t.push(n.i,e.i,s.i),Fr(e),Fr(e.next),e=i=s),e=e.next}while(e!==i);return Zi(e)}function op(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&mp(o,a)){let c=ju(o,a);o=Zi(o,o.next),c=Zi(c,c.next),Ur(o,t,e,n,s,r,0),Ur(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ap(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Ju(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(pp(l))}s.sort(cp);for(let r=0;r<s.length;r++)e=lp(s[r],e);return e}function cp(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function lp(i,t){let e=hp(i,t);if(!e)return t;let n=ju(e,i);return Zi(n,n.next),Zi(e,e.next)}function hp(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(Fs(i,e))return e;do{if(Fs(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>r&&(r=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,c=o.x,l=o.y,u=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&$u(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){let h=Math.abs(s-e.y)/(n-e.x);Nr(e,i)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&up(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function up(i,t){return Ie(i.prev,i,t.prev)<0&&Ie(t.next,i,i.next)<0}function dp(i,t,e,n){let s=i;do s.z===0&&(s.z=_l(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,fp(s)}function fp(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function _l(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function pp(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function $u(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function hr(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&$u(i,t,e,n,s,r,o,a)}function mp(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!gp(i,t)&&(Nr(i,t)&&Nr(t,i)&&_p(i,t)&&(Ie(i.prev,i,t.prev)||Ie(i,t.prev,t))||Fs(i,t)&&Ie(i.prev,i,i.next)>0&&Ie(t.prev,t,t.next)>0)}function Ie(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Fs(i,t){return i.x===t.x&&i.y===t.y}function Ku(i,t,e,n){let s=ko(Ie(i,t,e)),r=ko(Ie(i,t,n)),o=ko(Ie(e,n,i)),a=ko(Ie(e,n,t));return!!(s!==r&&o!==a||s===0&&zo(i,e,t)||r===0&&zo(i,n,t)||o===0&&zo(e,i,n)||a===0&&zo(e,t,n))}function zo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ko(i){return i>0?1:i<0?-1:0}function gp(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ku(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Nr(i,t){return Ie(i.prev,i,i.next)<0?Ie(i,t,i.next)>=0&&Ie(i,i.prev,t)>=0:Ie(i,t,i.prev)<0||Ie(i,i.next,t)<0}function _p(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function ju(i,t){let e=xl(i.i,i.x,i.y),n=xl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function eu(i,t,e,n){let s=xl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Fr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function xl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function xp(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var vl=class{static triangulate(t,e,n=2){return np(t,e,n)}},Vi=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];nu(t),iu(n,t);let o=t.length;e.forEach(nu);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,iu(n,e[c]);let a=vl.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function nu(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function iu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var wi=class i extends ue{constructor(t=new ci([new ct(.5,.5),new ct(-.5,.5),new ct(-.5,-.5),new ct(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new kt(s,3)),this.setAttribute("uv",new kt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:vp,M,_=!1,T,S,C,w;f&&(M=f.getSpacedPoints(u),_=!0,d=!1,T=f.computeFrenetFrames(u,!1),S=new O,C=new O,w=new O),d||(m=0,p=0,g=0,x=0);let y=a.extractPoints(l),b=y.shape,E=y.holes;if(!Vi.isClockWise(b)){b=b.reverse();for(let B=0,V=E.length;B<V;B++){let H=E[B];Vi.isClockWise(H)&&(E[B]=H.reverse())}}function D(B){let H=10000000000000001e-36,Z=B[0];for(let it=1;it<=B.length;it++){let J=it%B.length,nt=B[J],Ct=nt.x-Z.x,mt=nt.y-Z.y,P=Ct*Ct+mt*mt,A=Math.max(Math.abs(nt.x),Math.abs(nt.y),Math.abs(Z.x),Math.abs(Z.y)),X=H*A*A;if(P<=X){B.splice(J,1),it--;continue}Z=nt}}D(b),E.forEach(D);let N=E.length,F=b;for(let B=0;B<N;B++){let V=E[B];b=b.concat(V)}function L(B,V,H){return V||console.error("THREE.ExtrudeGeometry: vec does not exist"),B.clone().addScaledVector(V,H)}let Y=b.length;function G(B,V,H){let Z,it,J,nt=B.x-V.x,Ct=B.y-V.y,mt=H.x-B.x,P=H.y-B.y,A=nt*nt+Ct*Ct,X=nt*P-Ct*mt;if(Math.abs(X)>Number.EPSILON){let j=Math.sqrt(A),lt=Math.sqrt(mt*mt+P*P),tt=V.x-Ct/j,Ft=V.y+nt/j,gt=H.x-P/lt,Lt=H.y+mt/lt,Ut=((gt-tt)*P-(Lt-Ft)*mt)/(nt*P-Ct*mt);Z=tt+nt*Ut-B.x,it=Ft+Ct*Ut-B.y;let ut=Z*Z+it*it;if(ut<=2)return new ct(Z,it);J=Math.sqrt(ut/2)}else{let j=!1;nt>Number.EPSILON?mt>Number.EPSILON&&(j=!0):nt<-Number.EPSILON?mt<-Number.EPSILON&&(j=!0):Math.sign(Ct)===Math.sign(P)&&(j=!0),j?(Z=-Ct,it=nt,J=Math.sqrt(A)):(Z=nt,it=Ct,J=Math.sqrt(A/2))}return new ct(Z/J,it/J)}let z=[];for(let B=0,V=F.length,H=V-1,Z=B+1;B<V;B++,H++,Z++)H===V&&(H=0),Z===V&&(Z=0),z[B]=G(F[B],F[H],F[Z]);let et=[],rt,Mt=z.concat();for(let B=0,V=N;B<V;B++){let H=E[B];rt=[];for(let Z=0,it=H.length,J=it-1,nt=Z+1;Z<it;Z++,J++,nt++)J===it&&(J=0),nt===it&&(nt=0),rt[Z]=G(H[Z],H[J],H[nt]);et.push(rt),Mt=Mt.concat(rt)}let _t;if(m===0)_t=Vi.triangulateShape(F,E);else{let B=[],V=[];for(let H=0;H<m;H++){let Z=H/m,it=p*Math.cos(Z*Math.PI/2),J=g*Math.sin(Z*Math.PI/2)+x;for(let nt=0,Ct=F.length;nt<Ct;nt++){let mt=L(F[nt],z[nt],J);Et(mt.x,mt.y,-it),Z===0&&B.push(mt)}for(let nt=0,Ct=N;nt<Ct;nt++){let mt=E[nt];rt=et[nt];let P=[];for(let A=0,X=mt.length;A<X;A++){let j=L(mt[A],rt[A],J);Et(j.x,j.y,-it),Z===0&&P.push(j)}Z===0&&V.push(P)}}_t=Vi.triangulateShape(B,V)}let Gt=_t.length,Ht=g+x;for(let B=0;B<Y;B++){let V=d?L(b[B],Mt[B],Ht):b[B];_?(C.copy(T.normals[0]).multiplyScalar(V.x),S.copy(T.binormals[0]).multiplyScalar(V.y),w.copy(M[0]).add(C).add(S),Et(w.x,w.y,w.z)):Et(V.x,V.y,0)}for(let B=1;B<=u;B++)for(let V=0;V<Y;V++){let H=d?L(b[V],Mt[V],Ht):b[V];_?(C.copy(T.normals[B]).multiplyScalar(H.x),S.copy(T.binormals[B]).multiplyScalar(H.y),w.copy(M[B]).add(C).add(S),Et(w.x,w.y,w.z)):Et(H.x,H.y,h/u*B)}for(let B=m-1;B>=0;B--){let V=B/m,H=p*Math.cos(V*Math.PI/2),Z=g*Math.sin(V*Math.PI/2)+x;for(let it=0,J=F.length;it<J;it++){let nt=L(F[it],z[it],Z);Et(nt.x,nt.y,h+H)}for(let it=0,J=E.length;it<J;it++){let nt=E[it];rt=et[it];for(let Ct=0,mt=nt.length;Ct<mt;Ct++){let P=L(nt[Ct],rt[Ct],Z);_?Et(P.x,P.y+M[u-1].y,M[u-1].x+H):Et(P.x,P.y,h+H)}}}Q(),ot();function Q(){let B=s.length/3;if(d){let V=0,H=Y*V;for(let Z=0;Z<Gt;Z++){let it=_t[Z];Tt(it[2]+H,it[1]+H,it[0]+H)}V=u+m*2,H=Y*V;for(let Z=0;Z<Gt;Z++){let it=_t[Z];Tt(it[0]+H,it[1]+H,it[2]+H)}}else{for(let V=0;V<Gt;V++){let H=_t[V];Tt(H[2],H[1],H[0])}for(let V=0;V<Gt;V++){let H=_t[V];Tt(H[0]+Y*u,H[1]+Y*u,H[2]+Y*u)}}n.addGroup(B,s.length/3-B,0)}function ot(){let B=s.length/3,V=0;xt(F,V),V+=F.length;for(let H=0,Z=E.length;H<Z;H++){let it=E[H];xt(it,V),V+=it.length}n.addGroup(B,s.length/3-B,1)}function xt(B,V){let H=B.length;for(;--H>=0;){let Z=H,it=H-1;it<0&&(it=B.length-1);for(let J=0,nt=u+m*2;J<nt;J++){let Ct=Y*J,mt=Y*(J+1),P=V+Z+Ct,A=V+it+Ct,X=V+it+mt,j=V+Z+mt;Xt(P,A,X,j)}}}function Et(B,V,H){c.push(B),c.push(V),c.push(H)}function Tt(B,V,H){ge(B),ge(V),ge(H);let Z=s.length/3,it=v.generateTopUV(n,s,Z-3,Z-2,Z-1);U(it[0]),U(it[1]),U(it[2])}function Xt(B,V,H,Z){ge(B),ge(V),ge(Z),ge(V),ge(H),ge(Z);let it=s.length/3,J=v.generateSideWallUV(n,s,it-6,it-3,it-2,it-1);U(J[0]),U(J[1]),U(J[3]),U(J[1]),U(J[2]),U(J[3])}function ge(B){s.push(c[B*3+0]),s.push(c[B*3+1]),s.push(c[B*3+2])}function U(B){r.push(B.x),r.push(B.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return yp(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ra[s.type]().fromJSON(s)),new i(n,t.options)}},vp={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],u=t[s*3+1];return[new ct(r,o),new ct(a,c),new ct(l,u)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],u=t[n*3+1],h=t[n*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new ct(o,1-c),new ct(l,1-h),new ct(d,1-g),new ct(x,1-f)]:[new ct(a,1-c),new ct(u,1-h),new ct(p,1-g),new ct(m,1-f)]}};function yp(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Br=class i extends ea{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}},Ji=class i extends ue{constructor(t=[new ct(0,-.5),new ct(.5,0),new ct(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=te(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],u=1/e,h=new O,d=new ct,p=new O,g=new O,x=new O,m=0,f=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,f=t[v+1].y-t[v].y,p.x=f*1,p.y=-m,p.z=f*0,x.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:m=t[v+1].x-t[v].x,f=t[v+1].y-t[v].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),c.push(p.x,p.y,p.z),x.copy(g)}for(let v=0;v<=e;v++){let M=n+v*u*s,_=Math.sin(M),T=Math.cos(M);for(let S=0;S<=t.length-1;S++){h.x=t[S].x*_,h.y=t[S].y,h.z=t[S].x*T,o.push(h.x,h.y,h.z),d.x=v/e,d.y=S/(t.length-1),a.push(d.x,d.y);let C=c[3*S+0]*_,w=c[3*S+1],y=c[3*S+0]*T;l.push(C,w,y)}}for(let v=0;v<e;v++)for(let M=0;M<t.length-1;M++){let _=M+v*t.length,T=_,S=_+t.length,C=_+t.length+1,w=_+1;r.push(T,S,w),r.push(C,w,S)}this.setIndex(r),this.setAttribute("position",new kt(o,3)),this.setAttribute("uv",new kt(a,2)),this.setAttribute("normal",new kt(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var He=class i extends ue{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,h=t/a,d=e/c,p=[],g=[],x=[],m=[];for(let f=0;f<u;f++){let v=f*d-o;for(let M=0;M<l;M++){let _=M*h-r;g.push(_,-v,0),x.push(0,0,1),m.push(M/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let v=0;v<a;v++){let M=v+l*f,_=v+l*(f+1),T=v+1+l*(f+1),S=v+1+l*f;p.push(M,_,S),p.push(_,T,S)}this.setIndex(p),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(x,3)),this.setAttribute("uv",new kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Bs=class i extends ue{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,u=[],h=new O,d=new O,p=[],g=[],x=[],m=[];for(let f=0;f<=n;f++){let v=[],M=f/n,_=0;f===0&&o===0?_=.5/e:f===n&&c===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){let S=T/e;h.x=-t*Math.cos(s+S*r)*Math.sin(o+M*a),h.y=t*Math.cos(o+M*a),h.z=t*Math.sin(s+S*r)*Math.sin(o+M*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),m.push(S+_,1-M),v.push(l++)}u.push(v)}for(let f=0;f<n;f++)for(let v=0;v<e;v++){let M=u[f][v+1],_=u[f][v],T=u[f+1][v],S=u[f+1][v+1];(f!==0||o>0)&&p.push(M,_,S),(f!==n-1||c<Math.PI)&&p.push(_,T,S)}this.setIndex(p),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(x,3)),this.setAttribute("uv",new kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Os=class i extends ue{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],u=new O,h=new O,d=new O;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){let x=g/s*r,m=p/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(x),h.y=(t+e*Math.cos(m))*Math.sin(x),h.z=e*Math.sin(m),a.push(h.x,h.y,h.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){let x=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,v=(s+1)*p+g;o.push(x,m,v),o.push(m,f,v)}this.setIndex(o),this.setAttribute("position",new kt(a,3)),this.setAttribute("normal",new kt(c,3)),this.setAttribute("uv",new kt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Or=class i extends ue{constructor(t=new Pr(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new O,c=new O,l=new ct,u=new O,h=[],d=[],p=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new kt(h,3)),this.setAttribute("normal",new kt(d,3)),this.setAttribute("uv",new kt(p,2));function x(){for(let M=0;M<e;M++)m(M);m(r===!1?e:0),v(),f()}function m(M){u=t.getPointAt(M/e,u);let _=o.normals[M],T=o.binormals[M];for(let S=0;S<=s;S++){let C=S/s*Math.PI*2,w=Math.sin(C),y=-Math.cos(C);c.x=y*_.x+w*T.x,c.y=y*_.y+w*T.y,c.z=y*_.z+w*T.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=u.x+n*c.x,a.y=u.y+n*c.y,a.z=u.z+n*c.z,h.push(a.x,a.y,a.z)}}function f(){for(let M=1;M<=e;M++)for(let _=1;_<=s;_++){let T=(s+1)*(M-1)+(_-1),S=(s+1)*M+(_-1),C=(s+1)*M+_,w=(s+1)*(M-1)+_;g.push(T,S,w),g.push(S,C,w)}}function v(){for(let M=0;M<=e;M++)for(let _=0;_<=s;_++)l.x=M/e,l.y=_/s,p.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new ra[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var qe=class extends ai{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ol,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},zs=class extends qe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return te(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Zt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Zt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Zt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var aa=class extends ai{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},ca=class extends ai{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Vo(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Mp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var $i=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},la=class extends $i{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dl,endingEnd:dl}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case fl:r=t,a=2*e-n;break;case pl:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case fl:o=t,c=2*n-e;break;case pl:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,u=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),x=g*g,m=x*g,f=-d*m+2*d*x-d*g,v=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,M=(-1-p)*m+(1.5+p)*x+.5*g,_=p*m-p*x;for(let T=0;T!==a;++T)r[T]=f*o[u+T]+v*o[l+T]+M*o[c+T]+_*o[h+T];return r}},ha=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,u=(n-e)/(s-e),h=1-u;for(let d=0;d!==a;++d)r[d]=o[l+d]*h+o[c+d]*u;return r}},ua=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},vn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Vo(e,this.TimeBufferType),this.values=Vo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Vo(t.times,Array),values:Vo(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ua(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ha(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new la(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case fr:e=this.InterpolantFactoryMethodDiscrete;break;case qo:e=this.InterpolantFactoryMethodLinear;break;case Go:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return fr;case this.InterpolantFactoryMethodLinear:return qo;case this.InterpolantFactoryMethodSmooth:return Go}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Mp(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Go,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],u=t[a+1];if(l!==u&&(a!==1||l!==t[0]))if(s)c=!0;else{let h=a*n,d=h-n,p=h+n;for(let g=0;g!==n;++g){let x=e[h+g];if(x!==e[d+g]||x!==e[p+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let h=a*n,d=o*n;for(let p=0;p!==n;++p)e[d+p]=e[h+p]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};vn.prototype.ValueTypeName="";vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=qo;var Ti=class extends vn{constructor(t,e,n){super(t,e,n)}};Ti.prototype.ValueTypeName="bool";Ti.prototype.ValueBufferType=Array;Ti.prototype.DefaultInterpolation=fr;Ti.prototype.InterpolantFactoryMethodLinear=void 0;Ti.prototype.InterpolantFactoryMethodSmooth=void 0;var da=class extends vn{constructor(t,e,n,s){super(t,e,n,s)}};da.prototype.ValueTypeName="color";var fa=class extends vn{constructor(t,e,n,s){super(t,e,n,s)}};fa.prototype.ValueTypeName="number";var pa=class extends $i{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let u=l+a;l!==u;l+=4)gn.slerpFlat(r,0,o,l-a,o,l,c);return r}},zr=class extends vn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new pa(this.times,this.values,this.getValueSize(),t)}};zr.prototype.ValueTypeName="quaternion";zr.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends vn{constructor(t,e,n){super(t,e,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=fr;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var ma=class extends vn{constructor(t,e,n,s){super(t,e,n,s)}};ma.prototype.ValueTypeName="vector";var Ss={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},ga=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=l.length;h<d;h+=2){let p=l[h],g=l[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Qu=new ga,Ei=class{constructor(t){this.manager=t!==void 0?t:Qu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ei.DEFAULT_MATERIAL_NAME="__DEFAULT";var Qn={},yl=class extends Error{constructor(t,e){super(t),this.response=e}},_a=class extends Ei{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Ss.get(`file:${t}`);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Qn[t]!==void 0){Qn[t].push({onLoad:e,onProgress:n,onError:s});return}Qn[t]=[],Qn[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=Qn[t],h=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0,x=0,m=new ReadableStream({start(f){v();function v(){h.read().then(({done:M,value:_})=>{if(M)f.close();else{x+=_.byteLength;let T=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:p});for(let S=0,C=u.length;S<C;S++){let w=u[S];w.onProgress&&w.onProgress(T)}f.enqueue(_),v()}},M=>{f.error(M)})}}});return new Response(m)}else throw new yl(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,p=new TextDecoder(d);return l.arrayBuffer().then(g=>p.decode(g))}}}).then(l=>{Ss.add(`file:${t}`,l);let u=Qn[t];delete Qn[t];for(let h=0,d=u.length;h<d;h++){let p=u[h];p.onLoad&&p.onLoad(l)}}).catch(l=>{let u=Qn[t];if(u===void 0)throw this.manager.itemError(t),l;delete Qn[t];for(let h=0,d=u.length;h<d;h++){let p=u[h];p.onError&&p.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ms=new WeakMap,xa=class extends Ei{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Ss.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let h=Ms.get(o);h===void 0&&(h=[],Ms.set(o,h)),h.push({onLoad:e,onError:s})}return o}let a=As("img");function c(){u(),e&&e(this);let h=Ms.get(this)||[];for(let d=0;d<h.length;d++){let p=h[d];p.onLoad&&p.onLoad(this)}Ms.delete(this),r.manager.itemEnd(t)}function l(h){u(),s&&s(h),Ss.remove(`image:${t}`);let d=Ms.get(this)||[];for(let p=0;p<d.length;p++){let g=d[p];g.onError&&g.onError(h)}Ms.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Ss.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var kr=class extends Ei{constructor(t){super(t)}load(t,e,n,s){let r=this,o=new Sr,a=new _a(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(c){let l;try{l=r.parse(c)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}l.image!==void 0?o.image=l.image:l.data!==void 0&&(o.image.width=l.width,o.image.height=l.height,o.image.data=l.data),o.wrapS=l.wrapS!==void 0?l.wrapS:kn,o.wrapT=l.wrapT!==void 0?l.wrapT:kn,o.magFilter=l.magFilter!==void 0?l.magFilter:Be,o.minFilter=l.minFilter!==void 0?l.minFilter:Be,o.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(o.colorSpace=l.colorSpace),l.flipY!==void 0&&(o.flipY=l.flipY),l.format!==void 0&&(o.format=l.format),l.type!==void 0&&(o.type=l.type),l.mipmaps!==void 0&&(o.mipmaps=l.mipmaps,o.minFilter=ui),l.mipmapCount===1&&(o.minFilter=Be),l.generateMipmaps!==void 0&&(o.generateMipmaps=l.generateMipmaps),o.needsUpdate=!0,e&&e(o,l)},n,s),o}},Vr=class extends Ei{constructor(t){super(t)}load(t,e,n,s){let r=new je,o=new xa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Gr=class extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Hr=class extends Gr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ul=new se,su=new O,ru=new O,Ml=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ct(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ls,this._frameExtents=new ct(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;su.setFromMatrixPosition(t.matrixWorld),e.position.copy(su),ru.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ru),e.updateMatrixWorld(),ul.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ul,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ul)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Wr=class extends Xi{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},bl=class extends Ml{constructor(){super(new Wr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Xr=class extends Gr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new bl}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var va=class extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Wl="\\[\\]\\.:\\/",bp=new RegExp("["+Wl+"]","g"),Xl="[^"+Wl+"]",Sp="[^"+Wl.replace("\\.","")+"]",wp=/((?:WC+[\/:])*)/.source.replace("WC",Xl),Tp=/(WCOD+)?/.source.replace("WCOD",Sp),Ap=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Xl),Ep=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Xl),Cp=new RegExp("^"+wp+Tp+Ap+Ep+"$"),Rp=["material","materials","bones","map"],Sl=class{constructor(t,e,n){let s=n||Te.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Te=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(bp,"")}static parseTrackName(t){let e=Cp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Rp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Te.Composite=Sl;Te.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Te.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Te.prototype.GetterByBindingType=[Te.prototype._getValue_direct,Te.prototype._getValue_array,Te.prototype._getValue_arrayElement,Te.prototype._getValue_toArray];Te.prototype.SetterByBindingTypeAndVersioning=[[Te.prototype._setValue_direct,Te.prototype._setValue_direct_setNeedsUpdate,Te.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_array,Te.prototype._setValue_array_setNeedsUpdate,Te.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_arrayElement,Te.prototype._setValue_arrayElement_setNeedsUpdate,Te.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_fromArray,Te.prototype._setValue_fromArray_setNeedsUpdate,Te.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var zx=new Float32Array(1);function ql(i,t,e,n){let s=Ip(n);switch(e){case Nl:return i*t;case Ua:return i*t/s.components*s.byteLength;case Na:return i*t/s.components*s.byteLength;case Bl:return i*t*2/s.components*s.byteLength;case Fa:return i*t*2/s.components*s.byteLength;case Fl:return i*t*3/s.components*s.byteLength;case En:return i*t*4/s.components*s.byteLength;case Ba:return i*t*4/s.components*s.byteLength;case Zr:case Jr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case $r:case Kr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case za:case Va:return Math.max(i,16)*Math.max(t,8)/4;case Oa:case ka:return Math.max(i,8)*Math.max(t,8)/2;case Ga:case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ya:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Za:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ja:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ja:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case tc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ec:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case nc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ic:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case sc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case rc:case oc:case ac:return Math.ceil(i/4)*Math.ceil(t/4)*16;case cc:case lc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case hc:case uc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ip(i){switch(i){case Dn:case Pl:return{byteLength:1,components:1};case Vs:case Dl:case yn:return{byteLength:2,components:1};case Da:case La:return{byteLength:2,components:4};case Xn:case Pa:case sn:return{byteLength:4,components:1};case Ll:case Ul:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Sd(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Np(i){let t=new WeakMap;function e(a,c){let l=a.array,u=a.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){let u=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){let g=h[d],x=h[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,h[d]=x)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){let x=h[p];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Fp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bp=`#ifdef USE_ALPHAHASH
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
#endif`,Op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gp=`#ifdef USE_AOMAP
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
#endif`,Hp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wp=`#ifdef USE_BATCHING
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
#endif`,Xp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jp=`#ifdef USE_IRIDESCENCE
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
#endif`,$p=`#ifdef USE_BUMPMAP
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
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,sm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,rm=`#define PI 3.141592653589793
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
} // validated`,om=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,am=`vec3 transformedNormal = objectNormal;
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
#endif`,cm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,um=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dm="gl_FragColor = linearToOutputTexel( gl_FragColor );",fm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pm=`#ifdef USE_ENVMAP
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
#endif`,mm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gm=`#ifdef USE_ENVMAP
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
#endif`,_m=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xm=`#ifdef USE_ENVMAP
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
#endif`,vm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ym=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sm=`#ifdef USE_GRADIENTMAP
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
}`,wm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Em=`uniform bool receiveShadow;
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
#endif`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lm=`PhysicalMaterial material;
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
#endif`,Um=`struct PhysicalMaterial {
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
}`,Nm=`
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
#endif`,Fm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Bm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Om=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Hm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Wm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xm=`#if defined( USE_POINTS_UV )
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
#endif`,qm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ym=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$m=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Km=`#ifdef USE_MORPHTARGETS
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
#endif`,jm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,tg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ng=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ig=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sg=`#ifdef USE_NORMALMAP
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
#endif`,rg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,og=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ag=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ug=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,fg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,mg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,xg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,yg=`float getShadowMask() {
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
}`,Mg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bg=`#ifdef USE_SKINNING
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
#endif`,Sg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,wg=`#ifdef USE_SKINNING
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
#endif`,Tg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ag=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Eg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Rg=`#ifdef USE_TRANSMISSION
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
#endif`,Ig=`#ifdef USE_TRANSMISSION
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
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ug=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ng=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fg=`uniform sampler2D t2D;
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
}`,Bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Og=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vg=`#include <common>
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
}`,Gg=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Hg=`#define DISTANCE
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
}`,Wg=`#define DISTANCE
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
}`,Xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`uniform float scale;
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
}`,Zg=`uniform vec3 diffuse;
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
}`,Jg=`#include <common>
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
}`,$g=`uniform vec3 diffuse;
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
}`,Kg=`#define LAMBERT
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
}`,jg=`#define LAMBERT
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
}`,Qg=`#define MATCAP
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
}`,t0=`#define MATCAP
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
}`,e0=`#define NORMAL
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
}`,n0=`#define NORMAL
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
}`,i0=`#define PHONG
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
}`,s0=`#define PHONG
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
}`,r0=`#define STANDARD
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
}`,o0=`#define STANDARD
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
}`,a0=`#define TOON
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
}`,c0=`#define TOON
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
}`,l0=`uniform float size;
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
}`,h0=`uniform vec3 diffuse;
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
}`,u0=`#include <common>
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
}`,d0=`uniform vec3 color;
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
}`,f0=`uniform float rotation;
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
}`,p0=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:Fp,alphahash_pars_fragment:Bp,alphamap_fragment:Op,alphamap_pars_fragment:zp,alphatest_fragment:kp,alphatest_pars_fragment:Vp,aomap_fragment:Gp,aomap_pars_fragment:Hp,batching_pars_vertex:Wp,batching_vertex:Xp,begin_vertex:qp,beginnormal_vertex:Yp,bsdfs:Zp,iridescence_fragment:Jp,bumpmap_pars_fragment:$p,clipping_planes_fragment:Kp,clipping_planes_pars_fragment:jp,clipping_planes_pars_vertex:Qp,clipping_planes_vertex:tm,color_fragment:em,color_pars_fragment:nm,color_pars_vertex:im,color_vertex:sm,common:rm,cube_uv_reflection_fragment:om,defaultnormal_vertex:am,displacementmap_pars_vertex:cm,displacementmap_vertex:lm,emissivemap_fragment:hm,emissivemap_pars_fragment:um,colorspace_fragment:dm,colorspace_pars_fragment:fm,envmap_fragment:pm,envmap_common_pars_fragment:mm,envmap_pars_fragment:gm,envmap_pars_vertex:_m,envmap_physical_pars_fragment:Cm,envmap_vertex:xm,fog_vertex:vm,fog_pars_vertex:ym,fog_fragment:Mm,fog_pars_fragment:bm,gradientmap_pars_fragment:Sm,lightmap_pars_fragment:wm,lights_lambert_fragment:Tm,lights_lambert_pars_fragment:Am,lights_pars_begin:Em,lights_toon_fragment:Rm,lights_toon_pars_fragment:Im,lights_phong_fragment:Pm,lights_phong_pars_fragment:Dm,lights_physical_fragment:Lm,lights_physical_pars_fragment:Um,lights_fragment_begin:Nm,lights_fragment_maps:Fm,lights_fragment_end:Bm,logdepthbuf_fragment:Om,logdepthbuf_pars_fragment:zm,logdepthbuf_pars_vertex:km,logdepthbuf_vertex:Vm,map_fragment:Gm,map_pars_fragment:Hm,map_particle_fragment:Wm,map_particle_pars_fragment:Xm,metalnessmap_fragment:qm,metalnessmap_pars_fragment:Ym,morphinstance_vertex:Zm,morphcolor_vertex:Jm,morphnormal_vertex:$m,morphtarget_pars_vertex:Km,morphtarget_vertex:jm,normal_fragment_begin:Qm,normal_fragment_maps:tg,normal_pars_fragment:eg,normal_pars_vertex:ng,normal_vertex:ig,normalmap_pars_fragment:sg,clearcoat_normal_fragment_begin:rg,clearcoat_normal_fragment_maps:og,clearcoat_pars_fragment:ag,iridescence_pars_fragment:cg,opaque_fragment:lg,packing:hg,premultiplied_alpha_fragment:ug,project_vertex:dg,dithering_fragment:fg,dithering_pars_fragment:pg,roughnessmap_fragment:mg,roughnessmap_pars_fragment:gg,shadowmap_pars_fragment:_g,shadowmap_pars_vertex:xg,shadowmap_vertex:vg,shadowmask_pars_fragment:yg,skinbase_vertex:Mg,skinning_pars_vertex:bg,skinning_vertex:Sg,skinnormal_vertex:wg,specularmap_fragment:Tg,specularmap_pars_fragment:Ag,tonemapping_fragment:Eg,tonemapping_pars_fragment:Cg,transmission_fragment:Rg,transmission_pars_fragment:Ig,uv_pars_fragment:Pg,uv_pars_vertex:Dg,uv_vertex:Lg,worldpos_vertex:Ug,background_vert:Ng,background_frag:Fg,backgroundCube_vert:Bg,backgroundCube_frag:Og,cube_vert:zg,cube_frag:kg,depth_vert:Vg,depth_frag:Gg,distanceRGBA_vert:Hg,distanceRGBA_frag:Wg,equirect_vert:Xg,equirect_frag:qg,linedashed_vert:Yg,linedashed_frag:Zg,meshbasic_vert:Jg,meshbasic_frag:$g,meshlambert_vert:Kg,meshlambert_frag:jg,meshmatcap_vert:Qg,meshmatcap_frag:t0,meshnormal_vert:e0,meshnormal_frag:n0,meshphong_vert:i0,meshphong_frag:s0,meshphysical_vert:r0,meshphysical_frag:o0,meshtoon_vert:a0,meshtoon_frag:c0,points_vert:l0,points_frag:h0,shadow_vert:u0,shadow_frag:d0,sprite_vert:f0,sprite_frag:p0},bt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},qn={basic:{uniforms:Qe([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Qe([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Qe([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Qe([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Qe([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Qe([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Qe([bt.points,bt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Qe([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Qe([bt.common,bt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Qe([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Qe([bt.sprite,bt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Qe([bt.common,bt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Qe([bt.lights,bt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};qn.physical={uniforms:Qe([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};var dc={r:0,b:0,g:0},ts=new _n,m0=new se;function g0(i,t,e,n,s,r,o){let a=new Zt(0),c=r===!0?0:1,l,u,h=null,d=0,p=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function x(M){let _=!1,T=g(M);T===null?f(a,c):T&&T.isColor&&(f(T,1),_=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){let T=g(_);T&&(T.isCubeTexture||T.mapping===qr)?(u===void 0&&(u=new Me(new Gn(1,1,1),new ze({name:"BackgroundCubeMaterial",uniforms:Qi(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,C,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ts.copy(_.backgroundRotation),ts.x*=-1,ts.y*=-1,ts.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(m0.makeRotationFromEuler(ts)),u.material.toneMapped=ae.getTransfer(T.colorSpace)!==me,(h!==T||d!==T.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=T,d=T.version,p=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Me(new He(2,2),new ze({name:"BackgroundMaterial",uniforms:Qi(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=ae.getTransfer(T.colorSpace)!==me,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||d!==T.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,h=T,d=T.version,p=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function f(M,_){M.getRGB(dc,Gl(i)),n.buffers.color.setClear(dc.r,dc.g,dc.b,_,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),c=_,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,f(a,c)},render:x,addToRenderList:m,dispose:v}}function _0(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(b,E,I,D,N){let F=!1,L=h(D,I,E);r!==L&&(r=L,l(r.object)),F=p(b,D,I,N),F&&g(b,D,I,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,_(b,E,I,D),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function u(b){return i.deleteVertexArray(b)}function h(b,E,I){let D=I.wireframe===!0,N=n[b.id];N===void 0&&(N={},n[b.id]=N);let F=N[E.id];F===void 0&&(F={},N[E.id]=F);let L=F[D];return L===void 0&&(L=d(c()),F[D]=L),L}function d(b){let E=[],I=[],D=[];for(let N=0;N<e;N++)E[N]=0,I[N]=0,D[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:I,attributeDivisors:D,object:b,attributes:{},index:null}}function p(b,E,I,D){let N=r.attributes,F=E.attributes,L=0,Y=I.getAttributes();for(let G in Y)if(Y[G].location>=0){let et=N[G],rt=F[G];if(rt===void 0&&(G==="instanceMatrix"&&b.instanceMatrix&&(rt=b.instanceMatrix),G==="instanceColor"&&b.instanceColor&&(rt=b.instanceColor)),et===void 0||et.attribute!==rt||rt&&et.data!==rt.data)return!0;L++}return r.attributesNum!==L||r.index!==D}function g(b,E,I,D){let N={},F=E.attributes,L=0,Y=I.getAttributes();for(let G in Y)if(Y[G].location>=0){let et=F[G];et===void 0&&(G==="instanceMatrix"&&b.instanceMatrix&&(et=b.instanceMatrix),G==="instanceColor"&&b.instanceColor&&(et=b.instanceColor));let rt={};rt.attribute=et,et&&et.data&&(rt.data=et.data),N[G]=rt,L++}r.attributes=N,r.attributesNum=L,r.index=D}function x(){let b=r.newAttributes;for(let E=0,I=b.length;E<I;E++)b[E]=0}function m(b){f(b,0)}function f(b,E){let I=r.newAttributes,D=r.enabledAttributes,N=r.attributeDivisors;I[b]=1,D[b]===0&&(i.enableVertexAttribArray(b),D[b]=1),N[b]!==E&&(i.vertexAttribDivisor(b,E),N[b]=E)}function v(){let b=r.newAttributes,E=r.enabledAttributes;for(let I=0,D=E.length;I<D;I++)E[I]!==b[I]&&(i.disableVertexAttribArray(I),E[I]=0)}function M(b,E,I,D,N,F,L){L===!0?i.vertexAttribIPointer(b,E,I,N,F):i.vertexAttribPointer(b,E,I,D,N,F)}function _(b,E,I,D){x();let N=D.attributes,F=I.getAttributes(),L=E.defaultAttributeValues;for(let Y in F){let G=F[Y];if(G.location>=0){let z=N[Y];if(z===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(z=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(z=b.instanceColor)),z!==void 0){let et=z.normalized,rt=z.itemSize,Mt=t.get(z);if(Mt===void 0)continue;let _t=Mt.buffer,Gt=Mt.type,Ht=Mt.bytesPerElement,Q=Gt===i.INT||Gt===i.UNSIGNED_INT||z.gpuType===Pa;if(z.isInterleavedBufferAttribute){let ot=z.data,xt=ot.stride,Et=z.offset;if(ot.isInstancedInterleavedBuffer){for(let Tt=0;Tt<G.locationSize;Tt++)f(G.location+Tt,ot.meshPerAttribute);b.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Tt=0;Tt<G.locationSize;Tt++)m(G.location+Tt);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let Tt=0;Tt<G.locationSize;Tt++)M(G.location+Tt,rt/G.locationSize,Gt,et,xt*Ht,(Et+rt/G.locationSize*Tt)*Ht,Q)}else{if(z.isInstancedBufferAttribute){for(let ot=0;ot<G.locationSize;ot++)f(G.location+ot,z.meshPerAttribute);b.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let ot=0;ot<G.locationSize;ot++)m(G.location+ot);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let ot=0;ot<G.locationSize;ot++)M(G.location+ot,rt/G.locationSize,Gt,et,rt*Ht,rt/G.locationSize*ot*Ht,Q)}}else if(L!==void 0){let et=L[Y];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(G.location,et);break;case 3:i.vertexAttrib3fv(G.location,et);break;case 4:i.vertexAttrib4fv(G.location,et);break;default:i.vertexAttrib1fv(G.location,et)}}}}v()}function T(){w();for(let b in n){let E=n[b];for(let I in E){let D=E[I];for(let N in D)u(D[N].object),delete D[N];delete E[I]}delete n[b]}}function S(b){if(n[b.id]===void 0)return;let E=n[b.id];for(let I in E){let D=E[I];for(let N in D)u(D[N].object),delete D[N];delete E[I]}delete n[b.id]}function C(b){for(let E in n){let I=n[E];if(I[b.id]===void 0)continue;let D=I[b.id];for(let N in D)u(D[N].object),delete D[N];delete I[b.id]}}function w(){y(),o=!0,r!==s&&(r=s,l(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:w,resetDefaultState:y,dispose:T,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function x0(i,t,e){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function o(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),e.update(u,n,h))}function a(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,n,1)}function c(l,u,h,d){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let g=0;for(let x=0;x<h;x++)g+=u[x]*d[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function v0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==En&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let w=C===yn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Dn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==sn&&!w)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:T,maxSamples:S}}function y0(i){let t=this,e=null,n=0,s=!1,r=!1,o=new On,a=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||n!==0||s;return s=d,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){let g=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{let v=r?0:n,M=v*4,_=f.clippingState||null;c.value=_,_=u(g,d,M,p);for(let T=0;T!==M;++T)_[T]=e[T];f.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,p,g){let x=h!==null?h.length:0,m=null;if(x!==0){if(m=c.value,g!==!0||m===null){let f=p+x*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,_=p;M!==x;++M,_+=4)o.copy(h[M]).applyMatrix4(v,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function M0(i){let t=new WeakMap;function e(o,a){return a===ks?o.mapping=Ki:a===Ra&&(o.mapping=ji),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ks||a===Ra)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new Qo(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Xs=4,td=[.125,.215,.35,.446,.526,.582],is=20,Yl=new Wr,ed=new Zt,Zl=null,Jl=0,$l=0,Kl=!1,ns=(1+Math.sqrt(5))/2,Ws=1/ns,nd=[new O(-ns,Ws,0),new O(ns,Ws,0),new O(-Ws,0,ns),new O(Ws,0,ns),new O(0,ns,-Ws),new O(0,ns,Ws),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],b0=new O,mc=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=b0}=r;Zl=this._renderer.getRenderTarget(),Jl=this._renderer.getActiveCubeFace(),$l=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Zl,Jl,$l),this._renderer.xr.enabled=Kl,t.scissorTest=!1,fc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ki||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Zl=this._renderer.getRenderTarget(),Jl=this._renderer.getActiveCubeFace(),$l=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Be,minFilter:Be,generateMipmaps:!1,type:yn,format:En,colorSpace:si,depthBuffer:!1},s=id(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=id(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=S0(r)),this._blurMaterial=w0(r,t,e)}return s}_compileMaterial(t){let e=new Me(this._lodPlanes[0],t);this._renderer.compile(e,Yl)}_sceneToCubeUV(t,e,n,s,r){let c=new Ke(90,1,e,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(ed),h.toneMapping=hi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let x=new Wi({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),m=new Me(new Gn,x),f=!1,v=t.background;v?v.isColor&&(x.color.copy(v),t.background=null,f=!0):(x.color.copy(ed),f=!0);for(let M=0;M<6;M++){let _=M%3;_===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[M],r.y,r.z)):_===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[M]));let T=this._cubeSize;fc(s,_*T,M>2?T:0,T,T),h.setRenderTarget(s),f&&h.render(m,c),h.render(t,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=d,t.background=v}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ki||t.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sd());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Me(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;fc(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Yl)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=nd[(s-r-1)%nd.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new Me(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*is-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):is;m>is&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${is}`);let f=[],v=0;for(let C=0;C<is;++C){let w=C/x,y=Math.exp(-w*w/2);f.push(y),C===0?v+=y:C<m&&(v+=2*y)}for(let C=0;C<f.length;C++)f[C]=f[C]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;let _=this._sizeLods[s],T=3*_*(s>M-Xs?s-M+Xs:0),S=4*(this._cubeSize-_);fc(e,T,S,3*_,2*_),c.setRenderTarget(e),c.render(h,Yl)}};function S0(i){let t=[],e=[],n=[],s=i,r=i-Xs+1+td.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Xs?c=td[o-i+Xs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,x=3,m=2,f=1,v=new Float32Array(x*g*p),M=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let S=0;S<p;S++){let C=S%3*2/3-1,w=S>2?0:-1,y=[C,w,0,C+2/3,w,0,C+2/3,w+1,0,C,w,0,C+2/3,w+1,0,C,w+1,0];v.set(y,x*g*S),M.set(d,m*g*S);let b=[S,S,S,S,S,S];_.set(b,f*g*S)}let T=new ue;T.setAttribute("position",new Pe(v,x)),T.setAttribute("uv",new Pe(M,m)),T.setAttribute("faceIndex",new Pe(_,f)),t.push(T),s>Xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function id(i,t,e){let n=new ln(i,t,e);return n.texture.mapping=qr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fc(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function w0(i,t,e){let n=new Float32Array(is),s=new O(0,1,0);return new ze({name:"SphericalGaussianBlur",defines:{n:is,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ah(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function sd(){return new ze({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ah(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function rd(){return new ze({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ah(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function ah(){return`

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
	`}function T0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ks||c===Ra,u=c===Ki||c===ji;if(l||u){let h=t.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new mc(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{let p=a.image;return l&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new mc(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let c=0,l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function A0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Es("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function E0(i,t,e,n){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(h){let d=h.attributes;for(let p in d)t.update(d[p],i.ARRAY_BUFFER)}function l(h){let d=[],p=h.index,g=h.attributes.position,x=0;if(p!==null){let v=p.array;x=p.version;for(let M=0,_=v.length;M<_;M+=3){let T=v[M+0],S=v[M+1],C=v[M+2];d.push(T,S,S,C,C,T)}}else if(g!==void 0){let v=g.array;x=g.version;for(let M=0,_=v.length/3-1;M<_;M+=3){let T=M+0,S=M+1,C=M+2;d.push(T,S,S,C,C,T)}}else return;let m=new(Vl(d)?yr:vr)(d,1);m.version=x;let f=r.get(h);f&&t.remove(f),r.set(h,m)}function u(h){let d=r.get(h);if(d){let p=h.index;p!==null&&d.version<p.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function C0(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,p){i.drawElements(n,p,r,d*o),e.update(p,n,1)}function l(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),e.update(p,n,g))}function u(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function h(d,p,g,x){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/o,p[f],x[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,x,0,g);let f=0;for(let v=0;v<g;v++)f+=p[v]*x[v];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function R0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function I0(i,t,e){let n=new WeakMap,s=new Ae;function r(o,a,c){let l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==h){let y=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],M=0;p===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let _=a.attributes.position.count*M,T=1;_>t.maxTextureSize&&(T=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);let S=new Float32Array(_*T*4*h),C=new gr(S,_,T,h);C.type=sn,C.needsUpdate=!0;let w=M*4;for(let b=0;b<h;b++){let E=m[b],I=f[b],D=v[b],N=_*T*4*b;for(let F=0;F<E.count;F++){let L=F*w;p===!0&&(s.fromBufferAttribute(E,F),S[N+L+0]=s.x,S[N+L+1]=s.y,S[N+L+2]=s.z,S[N+L+3]=0),g===!0&&(s.fromBufferAttribute(I,F),S[N+L+4]=s.x,S[N+L+5]=s.y,S[N+L+6]=s.z,S[N+L+7]=0),x===!0&&(s.fromBufferAttribute(D,F),S[N+L+8]=s.x,S[N+L+9]=s.y,S[N+L+10]=s.z,S[N+L+11]=D.itemSize===4?s.w:1)}}d={count:h,texture:C,size:new ct(_,T)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let x=0;x<l.length;x++)p+=l[x];let g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function P0(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var wd=new je,od=new Yi(1,1),Td=new gr,Ad=new Ko,Ed=new Mr,ad=[],cd=[],ld=new Float32Array(16),hd=new Float32Array(9),ud=new Float32Array(4);function Ys(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=ad[s];if(r===void 0&&(r=new Float32Array(s),ad[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function ke(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function _c(i,t){let e=cd[t];e===void 0&&(e=new Int32Array(t),cd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function D0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function L0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function U0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function N0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function F0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;ud.set(n),i.uniformMatrix2fv(this.addr,!1,ud),Ve(e,n)}}function B0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;hd.set(n),i.uniformMatrix3fv(this.addr,!1,hd),Ve(e,n)}}function O0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;ld.set(n),i.uniformMatrix4fv(this.addr,!1,ld),Ve(e,n)}}function z0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function k0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function V0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function G0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function H0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function W0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function X0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function q0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function Y0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(od.compareFunction=zl,r=od):r=wd,e.setTexture2D(t||r,s)}function Z0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Ad,s)}function J0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ed,s)}function $0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Td,s)}function K0(i){switch(i){case 5126:return D0;case 35664:return L0;case 35665:return U0;case 35666:return N0;case 35674:return F0;case 35675:return B0;case 35676:return O0;case 5124:case 35670:return z0;case 35667:case 35671:return k0;case 35668:case 35672:return V0;case 35669:case 35673:return G0;case 5125:return H0;case 36294:return W0;case 36295:return X0;case 36296:return q0;case 35678:case 36198:case 36298:case 36306:case 35682:return Y0;case 35679:case 36299:case 36307:return Z0;case 35680:case 36300:case 36308:case 36293:return J0;case 36289:case 36303:case 36311:case 36292:return $0}}function j0(i,t){i.uniform1fv(this.addr,t)}function Q0(i,t){let e=Ys(t,this.size,2);i.uniform2fv(this.addr,e)}function t_(i,t){let e=Ys(t,this.size,3);i.uniform3fv(this.addr,e)}function e_(i,t){let e=Ys(t,this.size,4);i.uniform4fv(this.addr,e)}function n_(i,t){let e=Ys(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function i_(i,t){let e=Ys(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function s_(i,t){let e=Ys(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function r_(i,t){i.uniform1iv(this.addr,t)}function o_(i,t){i.uniform2iv(this.addr,t)}function a_(i,t){i.uniform3iv(this.addr,t)}function c_(i,t){i.uniform4iv(this.addr,t)}function l_(i,t){i.uniform1uiv(this.addr,t)}function h_(i,t){i.uniform2uiv(this.addr,t)}function u_(i,t){i.uniform3uiv(this.addr,t)}function d_(i,t){i.uniform4uiv(this.addr,t)}function f_(i,t,e){let n=this.cache,s=t.length,r=_c(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||wd,r[o])}function p_(i,t,e){let n=this.cache,s=t.length,r=_c(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Ad,r[o])}function m_(i,t,e){let n=this.cache,s=t.length,r=_c(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ed,r[o])}function g_(i,t,e){let n=this.cache,s=t.length,r=_c(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Td,r[o])}function __(i){switch(i){case 5126:return j0;case 35664:return Q0;case 35665:return t_;case 35666:return e_;case 35674:return n_;case 35675:return i_;case 35676:return s_;case 5124:case 35670:return r_;case 35667:case 35671:return o_;case 35668:case 35672:return a_;case 35669:case 35673:return c_;case 5125:return l_;case 36294:return h_;case 36295:return u_;case 36296:return d_;case 35678:case 36198:case 36298:case 36306:case 35682:return f_;case 35679:case 36299:case 36307:return p_;case 35680:case 36300:case 36308:case 36293:return m_;case 36289:case 36303:case 36311:case 36292:return g_}}var Ql=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=K0(e.type)}},th=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=__(e.type)}},eh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},jl=/(\w+)(\])?(\[|\.)?/g;function dd(i,t){i.seq.push(t),i.map[t.id]=t}function x_(i,t,e){let n=i.name,s=n.length;for(jl.lastIndex=0;;){let r=jl.exec(n),o=jl.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){dd(e,l===void 0?new Ql(a,i,t):new th(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new eh(a),dd(e,h)),e=h}}}var qs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);x_(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function fd(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var v_=37297,y_=0;function M_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var pd=new jt;function b_(i){ae._getMatrix(pd,ae.workingColorSpace,i);let t=`mat3( ${pd.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(i)){case pr:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function md(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+M_(i.getShaderSource(t),a)}else return r}function S_(i,t){let e=b_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function w_(i,t){let e;switch(t){case Cu:e="Linear";break;case Ru:e="Reinhard";break;case Iu:e="Cineon";break;case Ca:e="ACESFilmic";break;case Du:e="AgX";break;case Lu:e="Neutral";break;case Pu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var pc=new O;function T_(){ae.getLuminanceCoefficients(pc);let i=pc.x.toFixed(4),t=pc.y.toFixed(4),e=pc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function A_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(jr).join(`
`)}function E_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function C_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function jr(i){return i!==""}function gd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function _d(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var R_=/^[ \t]*#include +<([\w\d./]+)>/gm;function nh(i){return i.replace(R_,P_)}var I_=new Map;function P_(i,t){let e=Kt[t];if(e===void 0){let n=I_.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return nh(e)}var D_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xd(i){return i.replace(D_,L_)}function L_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function vd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function U_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Tl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ya?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function N_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ki:case ji:t="ENVMAP_TYPE_CUBE";break;case qr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function F_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ji:t="ENVMAP_MODE_REFRACTION";break}return t}function B_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Rl:t="ENVMAP_BLENDING_MULTIPLY";break;case Au:t="ENVMAP_BLENDING_MIX";break;case Eu:t="ENVMAP_BLENDING_ADD";break}return t}function O_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function z_(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=U_(e),l=N_(e),u=F_(e),h=B_(e),d=O_(e),p=A_(e),g=E_(r),x=s.createProgram(),m,f,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(jr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(jr).join(`
`),f.length>0&&(f+=`
`)):(m=[vd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jr).join(`
`),f=[vd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?Kt.tonemapping_pars_fragment:"",e.toneMapping!==hi?w_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,S_("linearToOutputTexel",e.outputColorSpace),T_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(jr).join(`
`)),o=nh(o),o=gd(o,e),o=_d(o,e),a=nh(a),a=gd(a,e),a=_d(a,e),o=xd(o),a=xd(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let M=v+m+o,_=v+f+a,T=fd(s,s.VERTEX_SHADER,M),S=fd(s,s.FRAGMENT_SHADER,_);s.attachShader(x,T),s.attachShader(x,S),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(E){if(i.debug.checkShaderErrors){let I=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(T)||"",N=s.getShaderInfoLog(S)||"",F=I.trim(),L=D.trim(),Y=N.trim(),G=!0,z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,T,S);else{let et=md(s,T,"vertex"),rt=md(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+F+`
`+et+`
`+rt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(L===""||Y==="")&&(z=!1);z&&(E.diagnostics={runnable:G,programLog:F,vertexShader:{log:L,prefix:m},fragmentShader:{log:Y,prefix:f}})}s.deleteShader(T),s.deleteShader(S),w=new qs(s,x),y=C_(s,x)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,v_)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=y_++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=S,this}var k_=0,ih=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new sh(t),e.set(t,n)),n}},sh=class{constructor(t){this.id=k_++,this.code=t,this.usedTimes=0}};function V_(i,t,e,n,s,r,o){let a=new xr,c=new ih,l=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,b,E,I,D){let N=I.fog,F=D.geometry,L=y.isMeshStandardMaterial?I.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||L),G=Y&&Y.mapping===qr?Y.image.height:null,z=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let et=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,rt=et!==void 0?et.length:0,Mt=0;F.morphAttributes.position!==void 0&&(Mt=1),F.morphAttributes.normal!==void 0&&(Mt=2),F.morphAttributes.color!==void 0&&(Mt=3);let _t,Gt,Ht,Q;if(z){let de=qn[z];_t=de.vertexShader,Gt=de.fragmentShader}else _t=y.vertexShader,Gt=y.fragmentShader,c.update(y),Ht=c.getVertexShaderID(y),Q=c.getFragmentShaderID(y);let ot=i.getRenderTarget(),xt=i.state.buffers.depth.getReversed(),Et=D.isInstancedMesh===!0,Tt=D.isBatchedMesh===!0,Xt=!!y.map,ge=!!y.matcap,U=!!Y,B=!!y.aoMap,V=!!y.lightMap,H=!!y.bumpMap,Z=!!y.normalMap,it=!!y.displacementMap,J=!!y.emissiveMap,nt=!!y.metalnessMap,Ct=!!y.roughnessMap,mt=y.anisotropy>0,P=y.clearcoat>0,A=y.dispersion>0,X=y.iridescence>0,j=y.sheen>0,lt=y.transmission>0,tt=mt&&!!y.anisotropyMap,Ft=P&&!!y.clearcoatMap,gt=P&&!!y.clearcoatNormalMap,Lt=P&&!!y.clearcoatRoughnessMap,Ut=X&&!!y.iridescenceMap,ut=X&&!!y.iridescenceThicknessMap,At=j&&!!y.sheenColorMap,Yt=j&&!!y.sheenRoughnessMap,Bt=!!y.specularMap,St=!!y.specularColorMap,Qt=!!y.specularIntensityMap,k=lt&&!!y.transmissionMap,pt=lt&&!!y.thicknessMap,vt=!!y.gradientMap,It=!!y.alphaMap,dt=y.alphaTest>0,at=!!y.alphaHash,Nt=!!y.extensions,$t=hi;y.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&($t=i.toneMapping);let ye={shaderID:z,shaderType:y.type,shaderName:y.name,vertexShader:_t,fragmentShader:Gt,defines:y.defines,customVertexShaderID:Ht,customFragmentShaderID:Q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Tt,batchingColor:Tt&&D._colorsTexture!==null,instancing:Et,instancingColor:Et&&D.instanceColor!==null,instancingMorph:Et&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:si,alphaToCoverage:!!y.alphaToCoverage,map:Xt,matcap:ge,envMap:U,envMapMode:U&&Y.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:V,bumpMap:H,normalMap:Z,displacementMap:d&&it,emissiveMap:J,normalMapObjectSpace:Z&&y.normalMapType===Bu,normalMapTangentSpace:Z&&y.normalMapType===Ol,metalnessMap:nt,roughnessMap:Ct,anisotropy:mt,anisotropyMap:tt,clearcoat:P,clearcoatMap:Ft,clearcoatNormalMap:gt,clearcoatRoughnessMap:Lt,dispersion:A,iridescence:X,iridescenceMap:Ut,iridescenceThicknessMap:ut,sheen:j,sheenColorMap:At,sheenRoughnessMap:Yt,specularMap:Bt,specularColorMap:St,specularIntensityMap:Qt,transmission:lt,transmissionMap:k,thicknessMap:pt,gradientMap:vt,opaque:y.transparent===!1&&y.blending===Gi&&y.alphaToCoverage===!1,alphaMap:It,alphaTest:dt,alphaHash:at,combine:y.combine,mapUv:Xt&&x(y.map.channel),aoMapUv:B&&x(y.aoMap.channel),lightMapUv:V&&x(y.lightMap.channel),bumpMapUv:H&&x(y.bumpMap.channel),normalMapUv:Z&&x(y.normalMap.channel),displacementMapUv:it&&x(y.displacementMap.channel),emissiveMapUv:J&&x(y.emissiveMap.channel),metalnessMapUv:nt&&x(y.metalnessMap.channel),roughnessMapUv:Ct&&x(y.roughnessMap.channel),anisotropyMapUv:tt&&x(y.anisotropyMap.channel),clearcoatMapUv:Ft&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:gt&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:ut&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:At&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&x(y.sheenRoughnessMap.channel),specularMapUv:Bt&&x(y.specularMap.channel),specularColorMapUv:St&&x(y.specularColorMap.channel),specularIntensityMapUv:Qt&&x(y.specularIntensityMap.channel),transmissionMapUv:k&&x(y.transmissionMap.channel),thicknessMapUv:pt&&x(y.thicknessMap.channel),alphaMapUv:It&&x(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Z||mt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!F.attributes.uv&&(Xt||It),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:xt,skinning:D.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:Mt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:Xt&&y.map.isVideoTexture===!0&&ae.getTransfer(y.map.colorSpace)===me,decodeVideoTextureEmissive:J&&y.emissiveMap.isVideoTexture===!0&&ae.getTransfer(y.emissiveMap.colorSpace)===me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===re,flipSided:y.side===Ye,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Nt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Nt&&y.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ye.vertexUv1s=l.has(1),ye.vertexUv2s=l.has(2),ye.vertexUv3s=l.has(3),l.clear(),ye}function f(y){let b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(let E in y.defines)b.push(E),b.push(y.defines[E]);return y.isRawShaderMaterial===!1&&(v(b,y),M(b,y),b.push(i.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function v(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function M(y,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),y.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),y.push(a.mask)}function _(y){let b=g[y.type],E;if(b){let I=qn[b];E=Zu.clone(I.uniforms)}else E=y.uniforms;return E}function T(y,b){let E;for(let I=0,D=u.length;I<D;I++){let N=u[I];if(N.cacheKey===b){E=N,++E.usedTimes;break}}return E===void 0&&(E=new z_(i,b,y,r),u.push(E)),E}function S(y){if(--y.usedTimes===0){let b=u.indexOf(y);u[b]=u[u.length-1],u.pop(),y.destroy()}}function C(y){c.remove(y)}function w(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:T,releaseProgram:S,releaseShaderCache:C,programs:u,dispose:w}}function G_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function H_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function yd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Md(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,p,g,x,m){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:x,group:m},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=x,f.group=m),t++,f}function a(h,d,p,g,x,m){let f=o(h,d,p,g,x,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(h,d,p,g,x,m){let f=o(h,d,p,g,x,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(h,d){e.length>1&&e.sort(h||H_),n.length>1&&n.sort(d||yd),s.length>1&&s.sort(d||yd)}function u(){for(let h=t,d=i.length;h<d;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function W_(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Md,i.set(n,[o])):s>=r.length?(o=new Md,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function X_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Zt};break;case"SpotLight":e={position:new O,direction:new O,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function q_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Y_=0;function Z_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function J_(i){let t=new X_,e=q_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);let s=new O,r=new se,o=new se;function a(l){let u=0,h=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let p=0,g=0,x=0,m=0,f=0,v=0,M=0,_=0,T=0,S=0,C=0;l.sort(Z_);for(let y=0,b=l.length;y<b;y++){let E=l[y],I=E.color,D=E.intensity,N=E.distance,F=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=I.r*D,h+=I.g*D,d+=I.b*D;else if(E.isLightProbe){for(let L=0;L<9;L++)n.probe[L].addScaledVector(E.sh.coefficients[L],D);C++}else if(E.isDirectionalLight){let L=t.get(E);if(L.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){let Y=E.shadow,G=e.get(E);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=F,n.directionalShadowMatrix[p]=E.shadow.matrix,v++}n.directional[p]=L,p++}else if(E.isSpotLight){let L=t.get(E);L.position.setFromMatrixPosition(E.matrixWorld),L.color.copy(I).multiplyScalar(D),L.distance=N,L.coneCos=Math.cos(E.angle),L.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),L.decay=E.decay,n.spot[x]=L;let Y=E.shadow;if(E.map&&(n.spotLightMap[T]=E.map,T++,Y.updateMatrices(E),E.castShadow&&S++),n.spotLightMatrix[x]=Y.matrix,E.castShadow){let G=e.get(E);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,n.spotShadow[x]=G,n.spotShadowMap[x]=F,_++}x++}else if(E.isRectAreaLight){let L=t.get(E);L.color.copy(I).multiplyScalar(D),L.halfWidth.set(E.width*.5,0,0),L.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=L,m++}else if(E.isPointLight){let L=t.get(E);if(L.color.copy(E.color).multiplyScalar(E.intensity),L.distance=E.distance,L.decay=E.decay,E.castShadow){let Y=E.shadow,G=e.get(E);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,G.shadowCameraNear=Y.camera.near,G.shadowCameraFar=Y.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=E.shadow.matrix,M++}n.point[g]=L,g++}else if(E.isHemisphereLight){let L=t.get(E);L.skyColor.copy(E.color).multiplyScalar(D),L.groundColor.copy(E.groundColor).multiplyScalar(D),n.hemi[f]=L,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=bt.LTC_FLOAT_1,n.rectAreaLTC2=bt.LTC_FLOAT_2):(n.rectAreaLTC1=bt.LTC_HALF_1,n.rectAreaLTC2=bt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let w=n.hash;(w.directionalLength!==p||w.pointLength!==g||w.spotLength!==x||w.rectAreaLength!==m||w.hemiLength!==f||w.numDirectionalShadows!==v||w.numPointShadows!==M||w.numSpotShadows!==_||w.numSpotMaps!==T||w.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+T-S,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=C,w.directionalLength=p,w.pointLength=g,w.spotLength=x,w.rectAreaLength=m,w.hemiLength=f,w.numDirectionalShadows=v,w.numPointShadows=M,w.numSpotShadows=_,w.numSpotMaps=T,w.numLightProbes=C,n.version=Y_++)}function c(l,u){let h=0,d=0,p=0,g=0,x=0,m=u.matrixWorldInverse;for(let f=0,v=l.length;f<v;f++){let M=l[f];if(M.isDirectionalLight){let _=n.directional[h];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),h++}else if(M.isSpotLight){let _=n.spot[p];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),p++}else if(M.isRectAreaLight){let _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:n}}function bd(i){let t=new J_(i),e=[],n=[];function s(u){l.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function $_(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new bd(i),t.set(s,[a])):r>=o.length?(a=new bd(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var K_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,j_=`uniform sampler2D shadow_pass;
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
}`;function Q_(i,t,e){let n=new Ls,s=new ct,r=new ct,o=new Ae,a=new aa({depthPacking:Fu}),c=new ca,l={},u=e.maxTextureSize,h={[ii]:Ye,[Ye]:ii,[re]:re},d=new ze({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ct},radius:{value:4}},vertexShader:K_,fragmentShader:j_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ue;g.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Me(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tl;let f=this.type;this.render=function(S,C,w){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;let y=i.getRenderTarget(),b=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),I=i.state;I.setBlending(li),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let D=f!==Wn&&this.type===Wn,N=f===Wn&&this.type!==Wn;for(let F=0,L=S.length;F<L;F++){let Y=S[F],G=Y.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let z=G.getFrameExtents();if(s.multiply(z),r.copy(G.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/z.x),s.x=r.x*z.x,G.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/z.y),s.y=r.y*z.y,G.mapSize.y=r.y)),G.map===null||D===!0||N===!0){let rt=this.type!==Wn?{minFilter:cn,magFilter:cn}:{};G.map!==null&&G.map.dispose(),G.map=new ln(s.x,s.y,rt),G.map.texture.name=Y.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let et=G.getViewportCount();for(let rt=0;rt<et;rt++){let Mt=G.getViewport(rt);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),I.viewport(o),G.updateMatrices(Y,rt),n=G.getFrustum(),_(C,w,G.camera,Y,this.type)}G.isPointLightShadow!==!0&&this.type===Wn&&v(G,w),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(y,b,E)};function v(S,C){let w=t.update(x);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new ln(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(C,null,w,d,x,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(C,null,w,p,x,null)}function M(S,C,w,y){let b=null,E=w.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(E!==void 0)b=E;else if(b=w.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let I=b.uuid,D=C.uuid,N=l[I];N===void 0&&(N={},l[I]=N);let F=N[D];F===void 0&&(F=b.clone(),N[D]=F,C.addEventListener("dispose",T)),b=F}if(b.visible=C.visible,b.wireframe=C.wireframe,y===Wn?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:h[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,w.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let I=i.properties.get(b);I.light=w}return b}function _(S,C,w,y,b){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===Wn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,S.matrixWorld);let D=t.update(S),N=S.material;if(Array.isArray(N)){let F=D.groups;for(let L=0,Y=F.length;L<Y;L++){let G=F[L],z=N[G.materialIndex];if(z&&z.visible){let et=M(S,z,y,b);S.onBeforeShadow(i,S,C,w,D,et,G),i.renderBufferDirect(w,null,D,et,S,G),S.onAfterShadow(i,S,C,w,D,et,G)}}}else if(N.visible){let F=M(S,N,y,b);S.onBeforeShadow(i,S,C,w,D,F,null),i.renderBufferDirect(w,null,D,F,S,null),S.onAfterShadow(i,S,C,w,D,F,null)}}let I=S.children;for(let D=0,N=I.length;D<N;D++)_(I[D],C,w,y,b)}function T(S){S.target.removeEventListener("dispose",T);for(let w in l){let y=l[w],b=S.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}var tx={[Ma]:ba,[Sa]:Aa,[wa]:Ea,[Hi]:Ta,[ba]:Ma,[Aa]:Sa,[Ea]:wa,[Ta]:Hi};function ex(i,t){function e(){let k=!1,pt=new Ae,vt=null,It=new Ae(0,0,0,0);return{setMask:function(dt){vt!==dt&&!k&&(i.colorMask(dt,dt,dt,dt),vt=dt)},setLocked:function(dt){k=dt},setClear:function(dt,at,Nt,$t,ye){ye===!0&&(dt*=$t,at*=$t,Nt*=$t),pt.set(dt,at,Nt,$t),It.equals(pt)===!1&&(i.clearColor(dt,at,Nt,$t),It.copy(pt))},reset:function(){k=!1,vt=null,It.set(-1,0,0,0)}}}function n(){let k=!1,pt=!1,vt=null,It=null,dt=null;return{setReversed:function(at){if(pt!==at){let Nt=t.get("EXT_clip_control");at?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),pt=at;let $t=dt;dt=null,this.setClear($t)}},getReversed:function(){return pt},setTest:function(at){at?ot(i.DEPTH_TEST):xt(i.DEPTH_TEST)},setMask:function(at){vt!==at&&!k&&(i.depthMask(at),vt=at)},setFunc:function(at){if(pt&&(at=tx[at]),It!==at){switch(at){case Ma:i.depthFunc(i.NEVER);break;case ba:i.depthFunc(i.ALWAYS);break;case Sa:i.depthFunc(i.LESS);break;case Hi:i.depthFunc(i.LEQUAL);break;case wa:i.depthFunc(i.EQUAL);break;case Ta:i.depthFunc(i.GEQUAL);break;case Aa:i.depthFunc(i.GREATER);break;case Ea:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}It=at}},setLocked:function(at){k=at},setClear:function(at){dt!==at&&(pt&&(at=1-at),i.clearDepth(at),dt=at)},reset:function(){k=!1,vt=null,It=null,dt=null,pt=!1}}}function s(){let k=!1,pt=null,vt=null,It=null,dt=null,at=null,Nt=null,$t=null,ye=null;return{setTest:function(de){k||(de?ot(i.STENCIL_TEST):xt(i.STENCIL_TEST))},setMask:function(de){pt!==de&&!k&&(i.stencilMask(de),pt=de)},setFunc:function(de,Yn,Bn){(vt!==de||It!==Yn||dt!==Bn)&&(i.stencilFunc(de,Yn,Bn),vt=de,It=Yn,dt=Bn)},setOp:function(de,Yn,Bn){(at!==de||Nt!==Yn||$t!==Bn)&&(i.stencilOp(de,Yn,Bn),at=de,Nt=Yn,$t=Bn)},setLocked:function(de){k=de},setClear:function(de){ye!==de&&(i.clearStencil(de),ye=de)},reset:function(){k=!1,pt=null,vt=null,It=null,dt=null,at=null,Nt=null,$t=null,ye=null}}}let r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap,u={},h={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,v=null,M=null,_=null,T=null,S=null,C=new Zt(0,0,0),w=0,y=!1,b=null,E=null,I=null,D=null,N=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),L=!1,Y=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(G)[1]),L=Y>=1):G.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),L=Y>=2);let z=null,et={},rt=i.getParameter(i.SCISSOR_BOX),Mt=i.getParameter(i.VIEWPORT),_t=new Ae().fromArray(rt),Gt=new Ae().fromArray(Mt);function Ht(k,pt,vt,It){let dt=new Uint8Array(4),at=i.createTexture();i.bindTexture(k,at),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Nt=0;Nt<vt;Nt++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(pt+Nt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return at}let Q={};Q[i.TEXTURE_2D]=Ht(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=Ht(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=Ht(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=Ht(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(Hi),H(!1),Z(wl),ot(i.CULL_FACE),B(li);function ot(k){u[k]!==!0&&(i.enable(k),u[k]=!0)}function xt(k){u[k]!==!1&&(i.disable(k),u[k]=!1)}function Et(k,pt){return h[k]!==pt?(i.bindFramebuffer(k,pt),h[k]=pt,k===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pt),k===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function Tt(k,pt){let vt=p,It=!1;if(k){vt=d.get(pt),vt===void 0&&(vt=[],d.set(pt,vt));let dt=k.textures;if(vt.length!==dt.length||vt[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Nt=dt.length;at<Nt;at++)vt[at]=i.COLOR_ATTACHMENT0+at;vt.length=dt.length,It=!0}}else vt[0]!==i.BACK&&(vt[0]=i.BACK,It=!0);It&&i.drawBuffers(vt)}function Xt(k){return g!==k?(i.useProgram(k),g=k,!0):!1}let ge={[Mi]:i.FUNC_ADD,[lu]:i.FUNC_SUBTRACT,[hu]:i.FUNC_REVERSE_SUBTRACT};ge[uu]=i.MIN,ge[du]=i.MAX;let U={[fu]:i.ZERO,[pu]:i.ONE,[mu]:i.SRC_COLOR,[Ho]:i.SRC_ALPHA,[Mu]:i.SRC_ALPHA_SATURATE,[vu]:i.DST_COLOR,[_u]:i.DST_ALPHA,[gu]:i.ONE_MINUS_SRC_COLOR,[Wo]:i.ONE_MINUS_SRC_ALPHA,[yu]:i.ONE_MINUS_DST_COLOR,[xu]:i.ONE_MINUS_DST_ALPHA,[bu]:i.CONSTANT_COLOR,[Su]:i.ONE_MINUS_CONSTANT_COLOR,[wu]:i.CONSTANT_ALPHA,[Tu]:i.ONE_MINUS_CONSTANT_ALPHA};function B(k,pt,vt,It,dt,at,Nt,$t,ye,de){if(k===li){x===!0&&(xt(i.BLEND),x=!1);return}if(x===!1&&(ot(i.BLEND),x=!0),k!==cu){if(k!==m||de!==y){if((f!==Mi||_!==Mi)&&(i.blendEquation(i.FUNC_ADD),f=Mi,_=Mi),de)switch(k){case Gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Al:i.blendFunc(i.ONE,i.ONE);break;case El:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Cl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Al:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case El:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Cl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}v=null,M=null,T=null,S=null,C.set(0,0,0),w=0,m=k,y=de}return}dt=dt||pt,at=at||vt,Nt=Nt||It,(pt!==f||dt!==_)&&(i.blendEquationSeparate(ge[pt],ge[dt]),f=pt,_=dt),(vt!==v||It!==M||at!==T||Nt!==S)&&(i.blendFuncSeparate(U[vt],U[It],U[at],U[Nt]),v=vt,M=It,T=at,S=Nt),($t.equals(C)===!1||ye!==w)&&(i.blendColor($t.r,$t.g,$t.b,ye),C.copy($t),w=ye),m=k,y=!1}function V(k,pt){k.side===re?xt(i.CULL_FACE):ot(i.CULL_FACE);let vt=k.side===Ye;pt&&(vt=!vt),H(vt),k.blending===Gi&&k.transparent===!1?B(li):B(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),o.setFunc(k.depthFunc),o.setTest(k.depthTest),o.setMask(k.depthWrite),r.setMask(k.colorWrite);let It=k.stencilWrite;a.setTest(It),It&&(a.setMask(k.stencilWriteMask),a.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),a.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),J(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):xt(i.SAMPLE_ALPHA_TO_COVERAGE)}function H(k){b!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),b=k)}function Z(k){k!==ou?(ot(i.CULL_FACE),k!==E&&(k===wl?i.cullFace(i.BACK):k===au?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xt(i.CULL_FACE),E=k}function it(k){k!==I&&(L&&i.lineWidth(k),I=k)}function J(k,pt,vt){k?(ot(i.POLYGON_OFFSET_FILL),(D!==pt||N!==vt)&&(i.polygonOffset(pt,vt),D=pt,N=vt)):xt(i.POLYGON_OFFSET_FILL)}function nt(k){k?ot(i.SCISSOR_TEST):xt(i.SCISSOR_TEST)}function Ct(k){k===void 0&&(k=i.TEXTURE0+F-1),z!==k&&(i.activeTexture(k),z=k)}function mt(k,pt,vt){vt===void 0&&(z===null?vt=i.TEXTURE0+F-1:vt=z);let It=et[vt];It===void 0&&(It={type:void 0,texture:void 0},et[vt]=It),(It.type!==k||It.texture!==pt)&&(z!==vt&&(i.activeTexture(vt),z=vt),i.bindTexture(k,pt||Q[k]),It.type=k,It.texture=pt)}function P(){let k=et[z];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function X(){try{i.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function j(){try{i.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function lt(){try{i.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function tt(){try{i.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ft(){try{i.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function gt(){try{i.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Lt(){try{i.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ut(){try{i.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ut(){try{i.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function At(k){_t.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),_t.copy(k))}function Yt(k){Gt.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),Gt.copy(k))}function Bt(k,pt){let vt=l.get(pt);vt===void 0&&(vt=new WeakMap,l.set(pt,vt));let It=vt.get(k);It===void 0&&(It=i.getUniformBlockIndex(pt,k.name),vt.set(k,It))}function St(k,pt){let It=l.get(pt).get(k);c.get(pt)!==It&&(i.uniformBlockBinding(pt,It,k.__bindingPointIndex),c.set(pt,It))}function Qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},z=null,et={},h={},d=new WeakMap,p=[],g=null,x=!1,m=null,f=null,v=null,M=null,_=null,T=null,S=null,C=new Zt(0,0,0),w=0,y=!1,b=null,E=null,I=null,D=null,N=null,_t.set(0,0,i.canvas.width,i.canvas.height),Gt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:xt,bindFramebuffer:Et,drawBuffers:Tt,useProgram:Xt,setBlending:B,setMaterial:V,setFlipSided:H,setCullFace:Z,setLineWidth:it,setPolygonOffset:J,setScissorTest:nt,activeTexture:Ct,bindTexture:mt,unbindTexture:P,compressedTexImage2D:A,compressedTexImage3D:X,texImage2D:Ut,texImage3D:ut,updateUBOMapping:Bt,uniformBlockBinding:St,texStorage2D:gt,texStorage3D:Lt,texSubImage2D:j,texSubImage3D:lt,compressedTexSubImage2D:tt,compressedTexSubImage3D:Ft,scissor:At,viewport:Yt,reset:Qt}}function nx(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ct,u=new WeakMap,h,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,A){return p?new OffscreenCanvas(P,A):As("canvas")}function x(P,A,X){let j=1,lt=mt(P);if((lt.width>X||lt.height>X)&&(j=X/Math.max(lt.width,lt.height)),j<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let tt=Math.floor(j*lt.width),Ft=Math.floor(j*lt.height);h===void 0&&(h=g(tt,Ft));let gt=A?g(tt,Ft):h;return gt.width=tt,gt.height=Ft,gt.getContext("2d").drawImage(P,0,0,tt,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+tt+"x"+Ft+")."),gt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),P;return P}function m(P){return P.generateMipmaps}function f(P){i.generateMipmap(P)}function v(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(P,A,X,j,lt=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let tt=A;if(A===i.RED&&(X===i.FLOAT&&(tt=i.R32F),X===i.HALF_FLOAT&&(tt=i.R16F),X===i.UNSIGNED_BYTE&&(tt=i.R8)),A===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(tt=i.R8UI),X===i.UNSIGNED_SHORT&&(tt=i.R16UI),X===i.UNSIGNED_INT&&(tt=i.R32UI),X===i.BYTE&&(tt=i.R8I),X===i.SHORT&&(tt=i.R16I),X===i.INT&&(tt=i.R32I)),A===i.RG&&(X===i.FLOAT&&(tt=i.RG32F),X===i.HALF_FLOAT&&(tt=i.RG16F),X===i.UNSIGNED_BYTE&&(tt=i.RG8)),A===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(tt=i.RG8UI),X===i.UNSIGNED_SHORT&&(tt=i.RG16UI),X===i.UNSIGNED_INT&&(tt=i.RG32UI),X===i.BYTE&&(tt=i.RG8I),X===i.SHORT&&(tt=i.RG16I),X===i.INT&&(tt=i.RG32I)),A===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),X===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),X===i.UNSIGNED_INT&&(tt=i.RGB32UI),X===i.BYTE&&(tt=i.RGB8I),X===i.SHORT&&(tt=i.RGB16I),X===i.INT&&(tt=i.RGB32I)),A===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),X===i.UNSIGNED_INT&&(tt=i.RGBA32UI),X===i.BYTE&&(tt=i.RGBA8I),X===i.SHORT&&(tt=i.RGBA16I),X===i.INT&&(tt=i.RGBA32I)),A===i.RGB&&(X===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(tt=i.R11F_G11F_B10F)),A===i.RGBA){let Ft=lt?pr:ae.getTransfer(j);X===i.FLOAT&&(tt=i.RGBA32F),X===i.HALF_FLOAT&&(tt=i.RGBA16F),X===i.UNSIGNED_BYTE&&(tt=Ft===me?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function _(P,A){let X;return P?A===null||A===Xn||A===Gs?X=i.DEPTH24_STENCIL8:A===sn?X=i.DEPTH32F_STENCIL8:A===Vs&&(X=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Xn||A===Gs?X=i.DEPTH_COMPONENT24:A===sn?X=i.DEPTH_COMPONENT32F:A===Vs&&(X=i.DEPTH_COMPONENT16),X}function T(P,A){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==cn&&P.minFilter!==Be?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function S(P){let A=P.target;A.removeEventListener("dispose",S),w(A),A.isVideoTexture&&u.delete(A)}function C(P){let A=P.target;A.removeEventListener("dispose",C),b(A)}function w(P){let A=n.get(P);if(A.__webglInit===void 0)return;let X=P.source,j=d.get(X);if(j){let lt=j[A.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&y(P),Object.keys(j).length===0&&d.delete(X)}n.remove(P)}function y(P){let A=n.get(P);i.deleteTexture(A.__webglTexture);let X=P.source,j=d.get(X);delete j[A.__cacheKey],o.memory.textures--}function b(P){let A=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(A.__webglFramebuffer[j]))for(let lt=0;lt<A.__webglFramebuffer[j].length;lt++)i.deleteFramebuffer(A.__webglFramebuffer[j][lt]);else i.deleteFramebuffer(A.__webglFramebuffer[j]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[j])}else{if(Array.isArray(A.__webglFramebuffer))for(let j=0;j<A.__webglFramebuffer.length;j++)i.deleteFramebuffer(A.__webglFramebuffer[j]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let j=0;j<A.__webglColorRenderbuffer.length;j++)A.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[j]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let X=P.textures;for(let j=0,lt=X.length;j<lt;j++){let tt=n.get(X[j]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),o.memory.textures--),n.remove(X[j])}n.remove(P)}let E=0;function I(){E=0}function D(){let P=E;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),E+=1,P}function N(P){let A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function F(P,A){let X=n.get(P);if(P.isVideoTexture&&nt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&X.__version!==P.version){let j=P.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(X,P,A);return}}else P.isExternalTexture&&(X.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+A)}function L(P,A){let X=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&X.__version!==P.version){Q(X,P,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+A)}function Y(P,A){let X=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&X.__version!==P.version){Q(X,P,A);return}e.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+A)}function G(P,A){let X=n.get(P);if(P.version>0&&X.__version!==P.version){ot(X,P,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+A)}let z={[ws]:i.REPEAT,[kn]:i.CLAMP_TO_EDGE,[Xo]:i.MIRRORED_REPEAT},et={[cn]:i.NEAREST,[Uu]:i.NEAREST_MIPMAP_NEAREST,[Yr]:i.NEAREST_MIPMAP_LINEAR,[Be]:i.LINEAR,[Ia]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},rt={[Ou]:i.NEVER,[Wu]:i.ALWAYS,[zu]:i.LESS,[zl]:i.LEQUAL,[ku]:i.EQUAL,[Hu]:i.GEQUAL,[Vu]:i.GREATER,[Gu]:i.NOTEQUAL};function Mt(P,A){if(A.type===sn&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===Be||A.magFilter===Ia||A.magFilter===Yr||A.magFilter===ui||A.minFilter===Be||A.minFilter===Ia||A.minFilter===Yr||A.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,z[A.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,z[A.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,z[A.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,et[A.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,et[A.minFilter]),A.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,rt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===cn||A.minFilter!==Yr&&A.minFilter!==ui||A.type===sn&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let X=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function _t(P,A){let X=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",S));let j=A.source,lt=d.get(j);lt===void 0&&(lt={},d.set(j,lt));let tt=N(A);if(tt!==P.__cacheKey){lt[tt]===void 0&&(lt[tt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,X=!0),lt[tt].usedTimes++;let Ft=lt[P.__cacheKey];Ft!==void 0&&(lt[P.__cacheKey].usedTimes--,Ft.usedTimes===0&&y(A)),P.__cacheKey=tt,P.__webglTexture=lt[tt].texture}return X}function Gt(P,A,X){return Math.floor(Math.floor(P/X)/A)}function Ht(P,A,X,j){let tt=P.updateRanges;if(tt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,X,j,A.data);else{tt.sort((ut,At)=>ut.start-At.start);let Ft=0;for(let ut=1;ut<tt.length;ut++){let At=tt[Ft],Yt=tt[ut],Bt=At.start+At.count,St=Gt(Yt.start,A.width,4),Qt=Gt(At.start,A.width,4);Yt.start<=Bt+1&&St===Qt&&Gt(Yt.start+Yt.count-1,A.width,4)===St?At.count=Math.max(At.count,Yt.start+Yt.count-At.start):(++Ft,tt[Ft]=Yt)}tt.length=Ft+1;let gt=i.getParameter(i.UNPACK_ROW_LENGTH),Lt=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let ut=0,At=tt.length;ut<At;ut++){let Yt=tt[ut],Bt=Math.floor(Yt.start/4),St=Math.ceil(Yt.count/4),Qt=Bt%A.width,k=Math.floor(Bt/A.width),pt=St,vt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),e.texSubImage2D(i.TEXTURE_2D,0,Qt,k,pt,vt,X,j,A.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,gt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function Q(P,A,X){let j=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(j=i.TEXTURE_3D);let lt=_t(P,A),tt=A.source;e.bindTexture(j,P.__webglTexture,i.TEXTURE0+X);let Ft=n.get(tt);if(tt.version!==Ft.__version||lt===!0){e.activeTexture(i.TEXTURE0+X);let gt=ae.getPrimaries(ae.workingColorSpace),Lt=A.colorSpace===Ln?null:ae.getPrimaries(A.colorSpace),Ut=A.colorSpace===Ln||gt===Lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let ut=x(A.image,!1,s.maxTextureSize);ut=Ct(A,ut);let At=r.convert(A.format,A.colorSpace),Yt=r.convert(A.type),Bt=M(A.internalFormat,At,Yt,A.colorSpace,A.isVideoTexture);Mt(j,A);let St,Qt=A.mipmaps,k=A.isVideoTexture!==!0,pt=Ft.__version===void 0||lt===!0,vt=tt.dataReady,It=T(A,ut);if(A.isDepthTexture)Bt=_(A.format===Hs,A.type),pt&&(k?e.texStorage2D(i.TEXTURE_2D,1,Bt,ut.width,ut.height):e.texImage2D(i.TEXTURE_2D,0,Bt,ut.width,ut.height,0,At,Yt,null));else if(A.isDataTexture)if(Qt.length>0){k&&pt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,Qt[0].width,Qt[0].height);for(let dt=0,at=Qt.length;dt<at;dt++)St=Qt[dt],k?vt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,St.width,St.height,At,Yt,St.data):e.texImage2D(i.TEXTURE_2D,dt,Bt,St.width,St.height,0,At,Yt,St.data);A.generateMipmaps=!1}else k?(pt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,ut.width,ut.height),vt&&Ht(A,ut,At,Yt)):e.texImage2D(i.TEXTURE_2D,0,Bt,ut.width,ut.height,0,At,Yt,ut.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){k&&pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,Qt[0].width,Qt[0].height,ut.depth);for(let dt=0,at=Qt.length;dt<at;dt++)if(St=Qt[dt],A.format!==En)if(At!==null)if(k){if(vt)if(A.layerUpdates.size>0){let Nt=ql(St.width,St.height,A.format,A.type);for(let $t of A.layerUpdates){let ye=St.data.subarray($t*Nt/St.data.BYTES_PER_ELEMENT,($t+1)*Nt/St.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,$t,St.width,St.height,1,At,ye)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,St.width,St.height,ut.depth,At,St.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,Bt,St.width,St.height,ut.depth,0,St.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?vt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,St.width,St.height,ut.depth,At,Yt,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,Bt,St.width,St.height,ut.depth,0,At,Yt,St.data)}else{k&&pt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,Qt[0].width,Qt[0].height);for(let dt=0,at=Qt.length;dt<at;dt++)St=Qt[dt],A.format!==En?At!==null?k?vt&&e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,St.width,St.height,At,St.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,Bt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?vt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,St.width,St.height,At,Yt,St.data):e.texImage2D(i.TEXTURE_2D,dt,Bt,St.width,St.height,0,At,Yt,St.data)}else if(A.isDataArrayTexture)if(k){if(pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,ut.width,ut.height,ut.depth),vt)if(A.layerUpdates.size>0){let dt=ql(ut.width,ut.height,A.format,A.type);for(let at of A.layerUpdates){let Nt=ut.data.subarray(at*dt/ut.data.BYTES_PER_ELEMENT,(at+1)*dt/ut.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,ut.width,ut.height,1,At,Yt,Nt)}A.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ut.width,ut.height,ut.depth,At,Yt,ut.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Bt,ut.width,ut.height,ut.depth,0,At,Yt,ut.data);else if(A.isData3DTexture)k?(pt&&e.texStorage3D(i.TEXTURE_3D,It,Bt,ut.width,ut.height,ut.depth),vt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ut.width,ut.height,ut.depth,At,Yt,ut.data)):e.texImage3D(i.TEXTURE_3D,0,Bt,ut.width,ut.height,ut.depth,0,At,Yt,ut.data);else if(A.isFramebufferTexture){if(pt)if(k)e.texStorage2D(i.TEXTURE_2D,It,Bt,ut.width,ut.height);else{let dt=ut.width,at=ut.height;for(let Nt=0;Nt<It;Nt++)e.texImage2D(i.TEXTURE_2D,Nt,Bt,dt,at,0,At,Yt,null),dt>>=1,at>>=1}}else if(Qt.length>0){if(k&&pt){let dt=mt(Qt[0]);e.texStorage2D(i.TEXTURE_2D,It,Bt,dt.width,dt.height)}for(let dt=0,at=Qt.length;dt<at;dt++)St=Qt[dt],k?vt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,At,Yt,St):e.texImage2D(i.TEXTURE_2D,dt,Bt,At,Yt,St);A.generateMipmaps=!1}else if(k){if(pt){let dt=mt(ut);e.texStorage2D(i.TEXTURE_2D,It,Bt,dt.width,dt.height)}vt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Yt,ut)}else e.texImage2D(i.TEXTURE_2D,0,Bt,At,Yt,ut);m(A)&&f(j),Ft.__version=tt.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function ot(P,A,X){if(A.image.length!==6)return;let j=_t(P,A),lt=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+X);let tt=n.get(lt);if(lt.version!==tt.__version||j===!0){e.activeTexture(i.TEXTURE0+X);let Ft=ae.getPrimaries(ae.workingColorSpace),gt=A.colorSpace===Ln?null:ae.getPrimaries(A.colorSpace),Lt=A.colorSpace===Ln||Ft===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let Ut=A.isCompressedTexture||A.image[0].isCompressedTexture,ut=A.image[0]&&A.image[0].isDataTexture,At=[];for(let at=0;at<6;at++)!Ut&&!ut?At[at]=x(A.image[at],!0,s.maxCubemapSize):At[at]=ut?A.image[at].image:A.image[at],At[at]=Ct(A,At[at]);let Yt=At[0],Bt=r.convert(A.format,A.colorSpace),St=r.convert(A.type),Qt=M(A.internalFormat,Bt,St,A.colorSpace),k=A.isVideoTexture!==!0,pt=tt.__version===void 0||j===!0,vt=lt.dataReady,It=T(A,Yt);Mt(i.TEXTURE_CUBE_MAP,A);let dt;if(Ut){k&&pt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Qt,Yt.width,Yt.height);for(let at=0;at<6;at++){dt=At[at].mipmaps;for(let Nt=0;Nt<dt.length;Nt++){let $t=dt[Nt];A.format!==En?Bt!==null?k?vt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,$t.width,$t.height,Bt,$t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,Qt,$t.width,$t.height,0,$t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,$t.width,$t.height,Bt,St,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,Qt,$t.width,$t.height,0,Bt,St,$t.data)}}}else{if(dt=A.mipmaps,k&&pt){dt.length>0&&It++;let at=mt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Qt,at.width,at.height)}for(let at=0;at<6;at++)if(ut){k?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,At[at].width,At[at].height,Bt,St,At[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Qt,At[at].width,At[at].height,0,Bt,St,At[at].data);for(let Nt=0;Nt<dt.length;Nt++){let ye=dt[Nt].image[at].image;k?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,ye.width,ye.height,Bt,St,ye.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,Qt,ye.width,ye.height,0,Bt,St,ye.data)}}else{k?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Bt,St,At[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Qt,Bt,St,At[at]);for(let Nt=0;Nt<dt.length;Nt++){let $t=dt[Nt];k?vt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,Bt,St,$t.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,Qt,Bt,St,$t.image[at])}}}m(A)&&f(i.TEXTURE_CUBE_MAP),tt.__version=lt.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function xt(P,A,X,j,lt,tt){let Ft=r.convert(X.format,X.colorSpace),gt=r.convert(X.type),Lt=M(X.internalFormat,Ft,gt,X.colorSpace),Ut=n.get(A),ut=n.get(X);if(ut.__renderTarget=A,!Ut.__hasExternalTextures){let At=Math.max(1,A.width>>tt),Yt=Math.max(1,A.height>>tt);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,tt,Lt,At,Yt,A.depth,0,Ft,gt,null):e.texImage2D(lt,tt,Lt,At,Yt,0,Ft,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),J(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,lt,ut.__webglTexture,0,it(A)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,lt,ut.__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(P,A,X){if(i.bindRenderbuffer(i.RENDERBUFFER,P),A.depthBuffer){let j=A.depthTexture,lt=j&&j.isDepthTexture?j.type:null,tt=_(A.stencilBuffer,lt),Ft=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=it(A);J(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,tt,A.width,A.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,tt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,tt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,P)}else{let j=A.textures;for(let lt=0;lt<j.length;lt++){let tt=j[lt],Ft=r.convert(tt.format,tt.colorSpace),gt=r.convert(tt.type),Lt=M(tt.internalFormat,Ft,gt,tt.colorSpace),Ut=it(A);X&&J(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,Lt,A.width,A.height):J(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,Lt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Lt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let j=n.get(A.depthTexture);j.__renderTarget=A,(!j.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),F(A.depthTexture,0);let lt=j.__webglTexture,tt=it(A);if(A.depthTexture.format===Ts)J(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(A.depthTexture.format===Hs)J(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Xt(P){let A=n.get(P),X=P.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==P.depthTexture){let j=P.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),j){let lt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,j.removeEventListener("dispose",lt)};j.addEventListener("dispose",lt),A.__depthDisposeCallback=lt}A.__boundDepthTexture=j}if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");let j=P.texture.mipmaps;j&&j.length>0?Tt(A.__webglFramebuffer[0],P):Tt(A.__webglFramebuffer,P)}else if(X){A.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[j]),A.__webglDepthbuffer[j]===void 0)A.__webglDepthbuffer[j]=i.createRenderbuffer(),Et(A.__webglDepthbuffer[j],P,!1);else{let lt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=A.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,tt)}}else{let j=P.texture.mipmaps;if(j&&j.length>0?e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Et(A.__webglDepthbuffer,P,!1);else{let lt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,tt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ge(P,A,X){let j=n.get(P);A!==void 0&&xt(j.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&Xt(P)}function U(P){let A=P.texture,X=n.get(P),j=n.get(A);P.addEventListener("dispose",C);let lt=P.textures,tt=P.isWebGLCubeRenderTarget===!0,Ft=lt.length>1;if(Ft||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=A.version,o.memory.textures++),tt){X.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0){X.__webglFramebuffer[gt]=[];for(let Lt=0;Lt<A.mipmaps.length;Lt++)X.__webglFramebuffer[gt][Lt]=i.createFramebuffer()}else X.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){X.__webglFramebuffer=[];for(let gt=0;gt<A.mipmaps.length;gt++)X.__webglFramebuffer[gt]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let gt=0,Lt=lt.length;gt<Lt;gt++){let Ut=n.get(lt[gt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&J(P)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let gt=0;gt<lt.length;gt++){let Lt=lt[gt];X.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[gt]);let Ut=r.convert(Lt.format,Lt.colorSpace),ut=r.convert(Lt.type),At=M(Lt.internalFormat,Ut,ut,Lt.colorSpace,P.isXRRenderTarget===!0),Yt=it(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,At,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,X.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),Et(X.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Mt(i.TEXTURE_CUBE_MAP,A);for(let gt=0;gt<6;gt++)if(A.mipmaps&&A.mipmaps.length>0)for(let Lt=0;Lt<A.mipmaps.length;Lt++)xt(X.__webglFramebuffer[gt][Lt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Lt);else xt(X.__webglFramebuffer[gt],P,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);m(A)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let gt=0,Lt=lt.length;gt<Lt;gt++){let Ut=lt[gt],ut=n.get(Ut),At=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(At=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,ut.__webglTexture),Mt(At,Ut),xt(X.__webglFramebuffer,P,Ut,i.COLOR_ATTACHMENT0+gt,At,0),m(Ut)&&f(At)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(gt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,j.__webglTexture),Mt(gt,A),A.mipmaps&&A.mipmaps.length>0)for(let Lt=0;Lt<A.mipmaps.length;Lt++)xt(X.__webglFramebuffer[Lt],P,A,i.COLOR_ATTACHMENT0,gt,Lt);else xt(X.__webglFramebuffer,P,A,i.COLOR_ATTACHMENT0,gt,0);m(A)&&f(gt),e.unbindTexture()}P.depthBuffer&&Xt(P)}function B(P){let A=P.textures;for(let X=0,j=A.length;X<j;X++){let lt=A[X];if(m(lt)){let tt=v(P),Ft=n.get(lt).__webglTexture;e.bindTexture(tt,Ft),f(tt),e.unbindTexture()}}}let V=[],H=[];function Z(P){if(P.samples>0){if(J(P)===!1){let A=P.textures,X=P.width,j=P.height,lt=i.COLOR_BUFFER_BIT,tt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(P),gt=A.length>1;if(gt)for(let Ut=0;Ut<A.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);let Lt=P.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let Ut=0;Ut<A.length;Ut++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),gt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Ut]);let ut=n.get(A[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ut,0)}i.blitFramebuffer(0,0,X,j,0,0,X,j,lt,i.NEAREST),c===!0&&(V.length=0,H.length=0,V.push(i.COLOR_ATTACHMENT0+Ut),P.depthBuffer&&P.resolveDepthBuffer===!1&&(V.push(tt),H.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,H)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,V))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let Ut=0;Ut<A.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Ut]);let ut=n.get(A[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,ut,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){let A=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function it(P){return Math.min(s.maxSamples,P.samples)}function J(P){let A=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function nt(P){let A=o.render.frame;u.get(P)!==A&&(u.set(P,A),P.update())}function Ct(P,A){let X=P.colorSpace,j=P.format,lt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||X!==si&&X!==Ln&&(ae.getTransfer(X)===me?(j!==En||lt!==Dn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),A}function mt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=I,this.setTexture2D=F,this.setTexture2DArray=L,this.setTexture3D=Y,this.setTextureCube=G,this.rebindTextures=ge,this.setupRenderTarget=U,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=J}function ix(i,t){function e(n,s=Ln){let r,o=ae.getTransfer(s);if(n===Dn)return i.UNSIGNED_BYTE;if(n===Da)return i.UNSIGNED_SHORT_4_4_4_4;if(n===La)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ll)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ul)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Pl)return i.BYTE;if(n===Dl)return i.SHORT;if(n===Vs)return i.UNSIGNED_SHORT;if(n===Pa)return i.INT;if(n===Xn)return i.UNSIGNED_INT;if(n===sn)return i.FLOAT;if(n===yn)return i.HALF_FLOAT;if(n===Nl)return i.ALPHA;if(n===Fl)return i.RGB;if(n===En)return i.RGBA;if(n===Ts)return i.DEPTH_COMPONENT;if(n===Hs)return i.DEPTH_STENCIL;if(n===Ua)return i.RED;if(n===Na)return i.RED_INTEGER;if(n===Bl)return i.RG;if(n===Fa)return i.RG_INTEGER;if(n===Ba)return i.RGBA_INTEGER;if(n===Zr||n===Jr||n===$r||n===Kr)if(o===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Kr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Oa||n===za||n===ka||n===Va)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Oa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Va)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ga||n===Ha||n===Wa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ga||n===Ha)return o===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xa||n===qa||n===Ya||n===Za||n===Ja||n===$a||n===Ka||n===ja||n===Qa||n===tc||n===ec||n===nc||n===ic||n===sc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ya)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Za)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ja)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ka)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qa)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===tc)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ec)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nc)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ic)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sc)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rc||n===oc||n===ac)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===rc)return o===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ac)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===cc||n===lc||n===hc||n===uc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===cc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===lc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===hc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===uc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Gs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var sx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rx=`
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

}`,rh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Ar(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new ze({vertexShader:sx,fragmentShader:rx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Me(new He(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},oh=class extends ri{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,p=null,g=null,x=typeof XRWebGLBinding<"u",m=new rh,f={},v=e.getContextAttributes(),M=null,_=null,T=[],S=[],C=new ct,w=null,y=new Ke;y.viewport=new Ae;let b=new Ke;b.viewport=new Ae;let E=[y,b],I=new va,D=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ot=T[Q];return ot===void 0&&(ot=new Rs,T[Q]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(Q){let ot=T[Q];return ot===void 0&&(ot=new Rs,T[Q]=ot),ot.getGripSpace()},this.getHand=function(Q){let ot=T[Q];return ot===void 0&&(ot=new Rs,T[Q]=ot),ot.getHandSpace()};function F(Q){let ot=S.indexOf(Q.inputSource);if(ot===-1)return;let xt=T[ot];xt!==void 0&&(xt.update(Q.inputSource,Q.frame,l||o),xt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function L(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",L),s.removeEventListener("inputsourceschange",Y);for(let Q=0;Q<T.length;Q++){let ot=S[Q];ot!==null&&(S[Q]=null,T[Q].disconnect(ot))}D=null,N=null,m.reset();for(let Q in f)delete f[Q];t.setRenderTarget(M),p=null,d=null,h=null,s=null,_=null,Ht.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",L),s.addEventListener("inputsourceschange",Y),v.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let xt=null,Et=null,Tt=null;v.depth&&(Tt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,xt=v.stencil?Hs:Ts,Et=v.stencil?Gs:Xn);let Xt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Xt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new ln(d.textureWidth,d.textureHeight,{format:En,type:Dn,depthTexture:new Yi(d.textureWidth,d.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,xt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let xt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,xt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new ln(p.framebufferWidth,p.framebufferHeight,{format:En,type:Dn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ht.setContext(s),Ht.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Y(Q){for(let ot=0;ot<Q.removed.length;ot++){let xt=Q.removed[ot],Et=S.indexOf(xt);Et>=0&&(S[Et]=null,T[Et].disconnect(xt))}for(let ot=0;ot<Q.added.length;ot++){let xt=Q.added[ot],Et=S.indexOf(xt);if(Et===-1){for(let Xt=0;Xt<T.length;Xt++)if(Xt>=S.length){S.push(xt),Et=Xt;break}else if(S[Xt]===null){S[Xt]=xt,Et=Xt;break}if(Et===-1)break}let Tt=T[Et];Tt&&Tt.connect(xt)}}let G=new O,z=new O;function et(Q,ot,xt){G.setFromMatrixPosition(ot.matrixWorld),z.setFromMatrixPosition(xt.matrixWorld);let Et=G.distanceTo(z),Tt=ot.projectionMatrix.elements,Xt=xt.projectionMatrix.elements,ge=Tt[14]/(Tt[10]-1),U=Tt[14]/(Tt[10]+1),B=(Tt[9]+1)/Tt[5],V=(Tt[9]-1)/Tt[5],H=(Tt[8]-1)/Tt[0],Z=(Xt[8]+1)/Xt[0],it=ge*H,J=ge*Z,nt=Et/(-H+Z),Ct=nt*-H;if(ot.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ct),Q.translateZ(nt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Tt[10]===-1)Q.projectionMatrix.copy(ot.projectionMatrix),Q.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{let mt=ge+nt,P=U+nt,A=it-Ct,X=J+(Et-Ct),j=B*U/P*mt,lt=V*U/P*mt;Q.projectionMatrix.makePerspective(A,X,j,lt,mt,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function rt(Q,ot){ot===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ot.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let ot=Q.near,xt=Q.far;m.texture!==null&&(m.depthNear>0&&(ot=m.depthNear),m.depthFar>0&&(xt=m.depthFar)),I.near=b.near=y.near=ot,I.far=b.far=y.far=xt,(D!==I.near||N!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),D=I.near,N=I.far),I.layers.mask=Q.layers.mask|6,y.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;let Et=Q.parent,Tt=I.cameras;rt(I,Et);for(let Xt=0;Xt<Tt.length;Xt++)rt(Tt[Xt],Et);Tt.length===2?et(I,y,b):I.projectionMatrix.copy(y.projectionMatrix),Mt(Q,I,Et)};function Mt(Q,ot,xt){xt===null?Q.matrix.copy(ot.matrixWorld):(Q.matrix.copy(xt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ot.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ot.projectionMatrix),Q.projectionMatrixInverse.copy(ot.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Zo*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(Q){c=Q,d!==null&&(d.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Q){return f[Q]};let _t=null;function Gt(Q,ot){if(u=ot.getViewerPose(l||o),g=ot,u!==null){let xt=u.views;p!==null&&(t.setRenderTargetFramebuffer(_,p.framebuffer),t.setRenderTarget(_));let Et=!1;xt.length!==I.cameras.length&&(I.cameras.length=0,Et=!0);for(let U=0;U<xt.length;U++){let B=xt[U],V=null;if(p!==null)V=p.getViewport(B);else{let Z=h.getViewSubImage(d,B);V=Z.viewport,U===0&&(t.setRenderTargetTextures(_,Z.colorTexture,Z.depthStencilTexture),t.setRenderTarget(_))}let H=E[U];H===void 0&&(H=new Ke,H.layers.enable(U),H.viewport=new Ae,E[U]=H),H.matrix.fromArray(B.transform.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale),H.projectionMatrix.fromArray(B.projectionMatrix),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),H.viewport.set(V.x,V.y,V.width,V.height),U===0&&(I.matrix.copy(H.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Et===!0&&I.cameras.push(H)}let Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let U=h.getDepthInformation(xt[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Tt&&Tt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let U=0;U<xt.length;U++){let B=xt[U].camera;if(B){let V=f[B];V||(V=new Ar,f[B]=V);let H=h.getCameraImage(B);V.sourceTexture=H}}}}for(let xt=0;xt<T.length;xt++){let Et=S[xt],Tt=T[xt];Et!==null&&Tt!==void 0&&Tt.update(Et,ot,l||o)}_t&&_t(Q,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}let Ht=new Sd;Ht.setAnimationLoop(Gt),this.setAnimationLoop=function(Q){_t=Q},this.dispose=function(){}}},es=new _n,ox=new se;function ax(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Gl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,v,M,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),x(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,v,M):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ye&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ye&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let v=t.get(f),M=v.envMap,_=v.envMapRotation;M&&(m.envMap.value=M,es.copy(_),es.x*=-1,es.y*=-1,es.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),m.envMapRotation.value.setFromMatrix4(ox.makeRotationFromEuler(es)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,v,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*v,m.scale.value=M*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,v){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ye&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function x(m,f){let v=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function cx(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,M){let _=M.program;n.uniformBlockBinding(v,_)}function l(v,M){let _=s[v.id];_===void 0&&(g(v),_=u(v),s[v.id]=_,v.addEventListener("dispose",m));let T=M.program;n.updateUBOMapping(v,T);let S=t.render.frame;r[v.id]!==S&&(d(v),r[v.id]=S)}function u(v){let M=h();v.__bindingPointIndex=M;let _=i.createBuffer(),T=v.__size,S=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,T,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function h(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let M=s[v.id],_=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let S=0,C=_.length;S<C;S++){let w=Array.isArray(_[S])?_[S]:[_[S]];for(let y=0,b=w.length;y<b;y++){let E=w[y];if(p(E,S,y,T)===!0){let I=E.__offset,D=Array.isArray(E.value)?E.value:[E.value],N=0;for(let F=0;F<D.length;F++){let L=D[F],Y=x(L);typeof L=="number"||typeof L=="boolean"?(E.__data[0]=L,i.bufferSubData(i.UNIFORM_BUFFER,I+N,E.__data)):L.isMatrix3?(E.__data[0]=L.elements[0],E.__data[1]=L.elements[1],E.__data[2]=L.elements[2],E.__data[3]=0,E.__data[4]=L.elements[3],E.__data[5]=L.elements[4],E.__data[6]=L.elements[5],E.__data[7]=0,E.__data[8]=L.elements[6],E.__data[9]=L.elements[7],E.__data[10]=L.elements[8],E.__data[11]=0):(L.toArray(E.__data,N),N+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,M,_,T){let S=v.value,C=M+"_"+_;if(T[C]===void 0)return typeof S=="number"||typeof S=="boolean"?T[C]=S:T[C]=S.clone(),!0;{let w=T[C];if(typeof S=="number"||typeof S=="boolean"){if(w!==S)return T[C]=S,!0}else if(w.equals(S)===!1)return w.copy(S),!0}return!1}function g(v){let M=v.uniforms,_=0,T=16;for(let C=0,w=M.length;C<w;C++){let y=Array.isArray(M[C])?M[C]:[M[C]];for(let b=0,E=y.length;b<E;b++){let I=y[b],D=Array.isArray(I.value)?I.value:[I.value];for(let N=0,F=D.length;N<F;N++){let L=D[N],Y=x(L),G=_%T,z=G%Y.boundary,et=G+z;_+=z,et!==0&&T-et<Y.storage&&(_+=T-et),I.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=_,_+=Y.storage}}}let S=_%T;return S>0&&(_+=T-S),v.__size=_,v.__cache={},this}function x(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function m(v){let M=v.target;M.removeEventListener("dispose",m);let _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}var gc=class{constructor(t={}){let{canvas:e=Xu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,f=null,v=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let _=this,T=!1;this._outputColorSpace=Re;let S=0,C=0,w=null,y=-1,b=null,E=new Ae,I=new Ae,D=null,N=new Zt(0),F=0,L=e.width,Y=e.height,G=1,z=null,et=null,rt=new Ae(0,0,L,Y),Mt=new Ae(0,0,L,Y),_t=!1,Gt=new Ls,Ht=!1,Q=!1,ot=new se,xt=new O,Et=new Ae,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xt=!1;function ge(){return w===null?G:1}let U=n;function B(R,W){return e.getContext(R,W)}try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",vt,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",dt,!1),U===null){let W="webgl2";if(U=B(W,R),U===null)throw B(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let V,H,Z,it,J,nt,Ct,mt,P,A,X,j,lt,tt,Ft,gt,Lt,Ut,ut,At,Yt,Bt,St,Qt;function k(){V=new A0(U),V.init(),Bt=new ix(U,V),H=new v0(U,V,t,Bt),Z=new ex(U,V),H.reversedDepthBuffer&&d&&Z.buffers.depth.setReversed(!0),it=new R0(U),J=new G_,nt=new nx(U,V,Z,J,H,Bt,it),Ct=new M0(_),mt=new T0(_),P=new Np(U),St=new _0(U,P),A=new E0(U,P,it,St),X=new P0(U,A,P,it),ut=new I0(U,H,nt),gt=new y0(J),j=new V_(_,Ct,mt,V,H,St,gt),lt=new ax(_,J),tt=new W_,Ft=new $_(V),Ut=new g0(_,Ct,mt,Z,X,p,c),Lt=new Q_(_,X,H),Qt=new cx(U,it,H,Z),At=new x0(U,V,it),Yt=new C0(U,V,it),it.programs=j.programs,_.capabilities=H,_.extensions=V,_.properties=J,_.renderLists=tt,_.shadowMap=Lt,_.state=Z,_.info=it}k();let pt=new oh(_,U);this.xr=pt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let R=V.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=V.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(R){R!==void 0&&(G=R,this.setSize(L,Y,!1))},this.getSize=function(R){return R.set(L,Y)},this.setSize=function(R,W,$=!0){if(pt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}L=R,Y=W,e.width=Math.floor(R*G),e.height=Math.floor(W*G),$===!0&&(e.style.width=R+"px",e.style.height=W+"px"),this.setViewport(0,0,R,W)},this.getDrawingBufferSize=function(R){return R.set(L*G,Y*G).floor()},this.setDrawingBufferSize=function(R,W,$){L=R,Y=W,G=$,e.width=Math.floor(R*$),e.height=Math.floor(W*$),this.setViewport(0,0,R,W)},this.getCurrentViewport=function(R){return R.copy(E)},this.getViewport=function(R){return R.copy(rt)},this.setViewport=function(R,W,$,K){R.isVector4?rt.set(R.x,R.y,R.z,R.w):rt.set(R,W,$,K),Z.viewport(E.copy(rt).multiplyScalar(G).round())},this.getScissor=function(R){return R.copy(Mt)},this.setScissor=function(R,W,$,K){R.isVector4?Mt.set(R.x,R.y,R.z,R.w):Mt.set(R,W,$,K),Z.scissor(I.copy(Mt).multiplyScalar(G).round())},this.getScissorTest=function(){return _t},this.setScissorTest=function(R){Z.setScissorTest(_t=R)},this.setOpaqueSort=function(R){z=R},this.setTransparentSort=function(R){et=R},this.getClearColor=function(R){return R.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(R=!0,W=!0,$=!0){let K=0;if(R){let q=!1;if(w!==null){let ft=w.texture.format;q=ft===Ba||ft===Fa||ft===Na}if(q){let ft=w.texture.type,wt=ft===Dn||ft===Xn||ft===Vs||ft===Gs||ft===Da||ft===La,Dt=Ut.getClearColor(),Rt=Ut.getClearAlpha(),qt=Dt.r,Jt=Dt.g,zt=Dt.b;wt?(g[0]=qt,g[1]=Jt,g[2]=zt,g[3]=Rt,U.clearBufferuiv(U.COLOR,0,g)):(x[0]=qt,x[1]=Jt,x[2]=zt,x[3]=Rt,U.clearBufferiv(U.COLOR,0,x))}else K|=U.COLOR_BUFFER_BIT}W&&(K|=U.DEPTH_BUFFER_BIT),$&&(K|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",vt,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Ut.dispose(),tt.dispose(),Ft.dispose(),J.dispose(),Ct.dispose(),mt.dispose(),X.dispose(),St.dispose(),Qt.dispose(),j.dispose(),pt.dispose(),pt.removeEventListener("sessionstart",Bn),pt.removeEventListener("sessionend",Eh),Ui.stop()};function vt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let R=it.autoReset,W=Lt.enabled,$=Lt.autoUpdate,K=Lt.needsUpdate,q=Lt.type;k(),it.autoReset=R,Lt.enabled=W,Lt.autoUpdate=$,Lt.needsUpdate=K,Lt.type=q}function dt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function at(R){let W=R.target;W.removeEventListener("dispose",at),Nt(W)}function Nt(R){$t(R),J.remove(R)}function $t(R){let W=J.get(R).programs;W!==void 0&&(W.forEach(function($){j.releaseProgram($)}),R.isShaderMaterial&&j.releaseShaderCache(R))}this.renderBufferDirect=function(R,W,$,K,q,ft){W===null&&(W=Tt);let wt=q.isMesh&&q.matrixWorld.determinant()<0,Dt=_f(R,W,$,K,q);Z.setMaterial(K,wt);let Rt=$.index,qt=1;if(K.wireframe===!0){if(Rt=A.getWireframeAttribute($),Rt===void 0)return;qt=2}let Jt=$.drawRange,zt=$.attributes.position,ie=Jt.start*qt,_e=(Jt.start+Jt.count)*qt;ft!==null&&(ie=Math.max(ie,ft.start*qt),_e=Math.min(_e,(ft.start+ft.count)*qt)),Rt!==null?(ie=Math.max(ie,0),_e=Math.min(_e,Rt.count)):zt!=null&&(ie=Math.max(ie,0),_e=Math.min(_e,zt.count));let De=_e-ie;if(De<0||De===1/0)return;St.setup(q,K,Dt,$,Rt);let we,ve=At;if(Rt!==null&&(we=P.get(Rt),ve=Yt,ve.setIndex(we)),q.isMesh)K.wireframe===!0?(Z.setLineWidth(K.wireframeLinewidth*ge()),ve.setMode(U.LINES)):ve.setMode(U.TRIANGLES);else if(q.isLine){let Vt=K.linewidth;Vt===void 0&&(Vt=1),Z.setLineWidth(Vt*ge()),q.isLineSegments?ve.setMode(U.LINES):q.isLineLoop?ve.setMode(U.LINE_LOOP):ve.setMode(U.LINE_STRIP)}else q.isPoints?ve.setMode(U.POINTS):q.isSprite&&ve.setMode(U.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)Es("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ve.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(V.get("WEBGL_multi_draw"))ve.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let Vt=q._multiDrawStarts,Ee=q._multiDrawCounts,ce=q._multiDrawCount,dn=Rt?P.get(Rt).bytesPerElement:1,as=J.get(K).currentProgram.getUniforms();for(let fn=0;fn<ce;fn++)as.setValue(U,"_gl_DrawID",fn),ve.render(Vt[fn]/dn,Ee[fn])}else if(q.isInstancedMesh)ve.renderInstances(ie,De,q.count);else if($.isInstancedBufferGeometry){let Vt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ee=Math.min($.instanceCount,Vt);ve.renderInstances(ie,De,Ee)}else ve.render(ie,De)};function ye(R,W,$){R.transparent===!0&&R.side===re&&R.forceSinglePass===!1?(R.side=Ye,R.needsUpdate=!0,_o(R,W,$),R.side=ii,R.needsUpdate=!0,_o(R,W,$),R.side=re):_o(R,W,$)}this.compile=function(R,W,$=null){$===null&&($=R),f=Ft.get($),f.init(W),M.push(f),$.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(f.pushLight(q),q.castShadow&&f.pushShadow(q))}),R!==$&&R.traverseVisible(function(q){q.isLight&&q.layers.test(W.layers)&&(f.pushLight(q),q.castShadow&&f.pushShadow(q))}),f.setupLights();let K=new Set;return R.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let ft=q.material;if(ft)if(Array.isArray(ft))for(let wt=0;wt<ft.length;wt++){let Dt=ft[wt];ye(Dt,$,q),K.add(Dt)}else ye(ft,$,q),K.add(ft)}),f=M.pop(),K},this.compileAsync=function(R,W,$=null){let K=this.compile(R,W,$);return new Promise(q=>{function ft(){if(K.forEach(function(wt){J.get(wt).currentProgram.isReady()&&K.delete(wt)}),K.size===0){q(R);return}setTimeout(ft,10)}V.get("KHR_parallel_shader_compile")!==null?ft():setTimeout(ft,10)})};let de=null;function Yn(R){de&&de(R)}function Bn(){Ui.stop()}function Eh(){Ui.start()}let Ui=new Sd;Ui.setAnimationLoop(Yn),typeof self<"u"&&Ui.setContext(self),this.setAnimationLoop=function(R){de=R,pt.setAnimationLoop(R),R===null?Ui.stop():Ui.start()},pt.addEventListener("sessionstart",Bn),pt.addEventListener("sessionend",Eh),this.render=function(R,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),pt.enabled===!0&&pt.isPresenting===!0&&(pt.cameraAutoUpdate===!0&&pt.updateCamera(W),W=pt.getCamera()),R.isScene===!0&&R.onBeforeRender(_,R,W,w),f=Ft.get(R,M.length),f.init(W),M.push(f),ot.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),Gt.setFromProjectionMatrix(ot,Pn,W.reversedDepth),Q=this.localClippingEnabled,Ht=gt.init(this.clippingPlanes,Q),m=tt.get(R,v.length),m.init(),v.push(m),pt.enabled===!0&&pt.isPresenting===!0){let ft=_.xr.getDepthSensingMesh();ft!==null&&Bc(ft,W,-1/0,_.sortObjects)}Bc(R,W,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(z,et),Xt=pt.enabled===!1||pt.isPresenting===!1||pt.hasDepthSensing()===!1,Xt&&Ut.addToRenderList(m,R),this.info.render.frame++,Ht===!0&&gt.beginShadows();let $=f.state.shadowsArray;Lt.render($,R,W),Ht===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();let K=m.opaque,q=m.transmissive;if(f.setupLights(),W.isArrayCamera){let ft=W.cameras;if(q.length>0)for(let wt=0,Dt=ft.length;wt<Dt;wt++){let Rt=ft[wt];Rh(K,q,R,Rt)}Xt&&Ut.render(R);for(let wt=0,Dt=ft.length;wt<Dt;wt++){let Rt=ft[wt];Ch(m,R,Rt,Rt.viewport)}}else q.length>0&&Rh(K,q,R,W),Xt&&Ut.render(R),Ch(m,R,W);w!==null&&C===0&&(nt.updateMultisampleRenderTarget(w),nt.updateRenderTargetMipmap(w)),R.isScene===!0&&R.onAfterRender(_,R,W),St.resetDefaultState(),y=-1,b=null,M.pop(),M.length>0?(f=M[M.length-1],Ht===!0&&gt.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Bc(R,W,$,K){if(R.visible===!1)return;if(R.layers.test(W.layers)){if(R.isGroup)$=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(W);else if(R.isLight)f.pushLight(R),R.castShadow&&f.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Gt.intersectsSprite(R)){K&&Et.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ot);let wt=X.update(R),Dt=R.material;Dt.visible&&m.push(R,wt,Dt,$,Et.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Gt.intersectsObject(R))){let wt=X.update(R),Dt=R.material;if(K&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Et.copy(R.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Et.copy(wt.boundingSphere.center)),Et.applyMatrix4(R.matrixWorld).applyMatrix4(ot)),Array.isArray(Dt)){let Rt=wt.groups;for(let qt=0,Jt=Rt.length;qt<Jt;qt++){let zt=Rt[qt],ie=Dt[zt.materialIndex];ie&&ie.visible&&m.push(R,wt,ie,$,Et.z,zt)}}else Dt.visible&&m.push(R,wt,Dt,$,Et.z,null)}}let ft=R.children;for(let wt=0,Dt=ft.length;wt<Dt;wt++)Bc(ft[wt],W,$,K)}function Ch(R,W,$,K){let q=R.opaque,ft=R.transmissive,wt=R.transparent;f.setupLightsView($),Ht===!0&&gt.setGlobalState(_.clippingPlanes,$),K&&Z.viewport(E.copy(K)),q.length>0&&go(q,W,$),ft.length>0&&go(ft,W,$),wt.length>0&&go(wt,W,$),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Rh(R,W,$,K){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[K.id]===void 0&&(f.state.transmissionRenderTarget[K.id]=new ln(1,1,{generateMipmaps:!0,type:V.has("EXT_color_buffer_half_float")||V.has("EXT_color_buffer_float")?yn:Dn,minFilter:ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ae.workingColorSpace}));let ft=f.state.transmissionRenderTarget[K.id],wt=K.viewport||E;ft.setSize(wt.z*_.transmissionResolutionScale,wt.w*_.transmissionResolutionScale);let Dt=_.getRenderTarget(),Rt=_.getActiveCubeFace(),qt=_.getActiveMipmapLevel();_.setRenderTarget(ft),_.getClearColor(N),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),Xt&&Ut.render($);let Jt=_.toneMapping;_.toneMapping=hi;let zt=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),f.setupLightsView(K),Ht===!0&&gt.setGlobalState(_.clippingPlanes,K),go(R,$,K),nt.updateMultisampleRenderTarget(ft),nt.updateRenderTargetMipmap(ft),V.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let _e=0,De=W.length;_e<De;_e++){let we=W[_e],ve=we.object,Vt=we.geometry,Ee=we.material,ce=we.group;if(Ee.side===re&&ve.layers.test(K.layers)){let dn=Ee.side;Ee.side=Ye,Ee.needsUpdate=!0,Ih(ve,$,K,Vt,Ee,ce),Ee.side=dn,Ee.needsUpdate=!0,ie=!0}}ie===!0&&(nt.updateMultisampleRenderTarget(ft),nt.updateRenderTargetMipmap(ft))}_.setRenderTarget(Dt,Rt,qt),_.setClearColor(N,F),zt!==void 0&&(K.viewport=zt),_.toneMapping=Jt}function go(R,W,$){let K=W.isScene===!0?W.overrideMaterial:null;for(let q=0,ft=R.length;q<ft;q++){let wt=R[q],Dt=wt.object,Rt=wt.geometry,qt=wt.group,Jt=wt.material;Jt.allowOverride===!0&&K!==null&&(Jt=K),Dt.layers.test($.layers)&&Ih(Dt,W,$,Rt,Jt,qt)}}function Ih(R,W,$,K,q,ft){R.onBeforeRender(_,W,$,K,q,ft),R.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),q.onBeforeRender(_,W,$,K,R,ft),q.transparent===!0&&q.side===re&&q.forceSinglePass===!1?(q.side=Ye,q.needsUpdate=!0,_.renderBufferDirect($,W,K,q,R,ft),q.side=ii,q.needsUpdate=!0,_.renderBufferDirect($,W,K,q,R,ft),q.side=re):_.renderBufferDirect($,W,K,q,R,ft),R.onAfterRender(_,W,$,K,q,ft)}function _o(R,W,$){W.isScene!==!0&&(W=Tt);let K=J.get(R),q=f.state.lights,ft=f.state.shadowsArray,wt=q.state.version,Dt=j.getParameters(R,q.state,ft,W,$),Rt=j.getProgramCacheKey(Dt),qt=K.programs;K.environment=R.isMeshStandardMaterial?W.environment:null,K.fog=W.fog,K.envMap=(R.isMeshStandardMaterial?mt:Ct).get(R.envMap||K.environment),K.envMapRotation=K.environment!==null&&R.envMap===null?W.environmentRotation:R.envMapRotation,qt===void 0&&(R.addEventListener("dispose",at),qt=new Map,K.programs=qt);let Jt=qt.get(Rt);if(Jt!==void 0){if(K.currentProgram===Jt&&K.lightsStateVersion===wt)return Dh(R,Dt),Jt}else Dt.uniforms=j.getUniforms(R),R.onBeforeCompile(Dt,_),Jt=j.acquireProgram(Dt,Rt),qt.set(Rt,Jt),K.uniforms=Dt.uniforms;let zt=K.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(zt.clippingPlanes=gt.uniform),Dh(R,Dt),K.needsLights=vf(R),K.lightsStateVersion=wt,K.needsLights&&(zt.ambientLightColor.value=q.state.ambient,zt.lightProbe.value=q.state.probe,zt.directionalLights.value=q.state.directional,zt.directionalLightShadows.value=q.state.directionalShadow,zt.spotLights.value=q.state.spot,zt.spotLightShadows.value=q.state.spotShadow,zt.rectAreaLights.value=q.state.rectArea,zt.ltc_1.value=q.state.rectAreaLTC1,zt.ltc_2.value=q.state.rectAreaLTC2,zt.pointLights.value=q.state.point,zt.pointLightShadows.value=q.state.pointShadow,zt.hemisphereLights.value=q.state.hemi,zt.directionalShadowMap.value=q.state.directionalShadowMap,zt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,zt.spotShadowMap.value=q.state.spotShadowMap,zt.spotLightMatrix.value=q.state.spotLightMatrix,zt.spotLightMap.value=q.state.spotLightMap,zt.pointShadowMap.value=q.state.pointShadowMap,zt.pointShadowMatrix.value=q.state.pointShadowMatrix),K.currentProgram=Jt,K.uniformsList=null,Jt}function Ph(R){if(R.uniformsList===null){let W=R.currentProgram.getUniforms();R.uniformsList=qs.seqWithValue(W.seq,R.uniforms)}return R.uniformsList}function Dh(R,W){let $=J.get(R);$.outputColorSpace=W.outputColorSpace,$.batching=W.batching,$.batchingColor=W.batchingColor,$.instancing=W.instancing,$.instancingColor=W.instancingColor,$.instancingMorph=W.instancingMorph,$.skinning=W.skinning,$.morphTargets=W.morphTargets,$.morphNormals=W.morphNormals,$.morphColors=W.morphColors,$.morphTargetsCount=W.morphTargetsCount,$.numClippingPlanes=W.numClippingPlanes,$.numIntersection=W.numClipIntersection,$.vertexAlphas=W.vertexAlphas,$.vertexTangents=W.vertexTangents,$.toneMapping=W.toneMapping}function _f(R,W,$,K,q){W.isScene!==!0&&(W=Tt),nt.resetTextureUnits();let ft=W.fog,wt=K.isMeshStandardMaterial?W.environment:null,Dt=w===null?_.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:si,Rt=(K.isMeshStandardMaterial?mt:Ct).get(K.envMap||wt),qt=K.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Jt=!!$.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),zt=!!$.morphAttributes.position,ie=!!$.morphAttributes.normal,_e=!!$.morphAttributes.color,De=hi;K.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(De=_.toneMapping);let we=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,ve=we!==void 0?we.length:0,Vt=J.get(K),Ee=f.state.lights;if(Ht===!0&&(Q===!0||R!==b)){let en=R===b&&K.id===y;gt.setState(K,R,en)}let ce=!1;K.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==Ee.state.version||Vt.outputColorSpace!==Dt||q.isBatchedMesh&&Vt.batching===!1||!q.isBatchedMesh&&Vt.batching===!0||q.isBatchedMesh&&Vt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Vt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Vt.instancing===!1||!q.isInstancedMesh&&Vt.instancing===!0||q.isSkinnedMesh&&Vt.skinning===!1||!q.isSkinnedMesh&&Vt.skinning===!0||q.isInstancedMesh&&Vt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Vt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Vt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Vt.instancingMorph===!1&&q.morphTexture!==null||Vt.envMap!==Rt||K.fog===!0&&Vt.fog!==ft||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==gt.numPlanes||Vt.numIntersection!==gt.numIntersection)||Vt.vertexAlphas!==qt||Vt.vertexTangents!==Jt||Vt.morphTargets!==zt||Vt.morphNormals!==ie||Vt.morphColors!==_e||Vt.toneMapping!==De||Vt.morphTargetsCount!==ve)&&(ce=!0):(ce=!0,Vt.__version=K.version);let dn=Vt.currentProgram;ce===!0&&(dn=_o(K,W,q));let as=!1,fn=!1,ir=!1,Ce=dn.getUniforms(),wn=Vt.uniforms;if(Z.useProgram(dn.program)&&(as=!0,fn=!0,ir=!0),K.id!==y&&(y=K.id,fn=!0),as||b!==R){Z.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ce.setValue(U,"projectionMatrix",R.projectionMatrix),Ce.setValue(U,"viewMatrix",R.matrixWorldInverse);let an=Ce.map.cameraPosition;an!==void 0&&an.setValue(U,xt.setFromMatrixPosition(R.matrixWorld)),H.logarithmicDepthBuffer&&Ce.setValue(U,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Ce.setValue(U,"isOrthographic",R.isOrthographicCamera===!0),b!==R&&(b=R,fn=!0,ir=!0)}if(q.isSkinnedMesh){Ce.setOptional(U,q,"bindMatrix"),Ce.setOptional(U,q,"bindMatrixInverse");let en=q.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),Ce.setValue(U,"boneTexture",en.boneTexture,nt))}q.isBatchedMesh&&(Ce.setOptional(U,q,"batchingTexture"),Ce.setValue(U,"batchingTexture",q._matricesTexture,nt),Ce.setOptional(U,q,"batchingIdTexture"),Ce.setValue(U,"batchingIdTexture",q._indirectTexture,nt),Ce.setOptional(U,q,"batchingColorTexture"),q._colorsTexture!==null&&Ce.setValue(U,"batchingColorTexture",q._colorsTexture,nt));let Tn=$.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&ut.update(q,$,dn),(fn||Vt.receiveShadow!==q.receiveShadow)&&(Vt.receiveShadow=q.receiveShadow,Ce.setValue(U,"receiveShadow",q.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(wn.envMap.value=Rt,wn.flipEnvMap.value=Rt.isCubeTexture&&Rt.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&W.environment!==null&&(wn.envMapIntensity.value=W.environmentIntensity),fn&&(Ce.setValue(U,"toneMappingExposure",_.toneMappingExposure),Vt.needsLights&&xf(wn,ir),ft&&K.fog===!0&&lt.refreshFogUniforms(wn,ft),lt.refreshMaterialUniforms(wn,K,G,Y,f.state.transmissionRenderTarget[R.id]),qs.upload(U,Ph(Vt),wn,nt)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(qs.upload(U,Ph(Vt),wn,nt),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Ce.setValue(U,"center",q.center),Ce.setValue(U,"modelViewMatrix",q.modelViewMatrix),Ce.setValue(U,"normalMatrix",q.normalMatrix),Ce.setValue(U,"modelMatrix",q.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let en=K.uniformsGroups;for(let an=0,Oc=en.length;an<Oc;an++){let Ni=en[an];Qt.update(Ni,dn),Qt.bind(Ni,dn)}}return dn}function xf(R,W){R.ambientLightColor.needsUpdate=W,R.lightProbe.needsUpdate=W,R.directionalLights.needsUpdate=W,R.directionalLightShadows.needsUpdate=W,R.pointLights.needsUpdate=W,R.pointLightShadows.needsUpdate=W,R.spotLights.needsUpdate=W,R.spotLightShadows.needsUpdate=W,R.rectAreaLights.needsUpdate=W,R.hemisphereLights.needsUpdate=W}function vf(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(R,W,$){let K=J.get(R);K.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),J.get(R.texture).__webglTexture=W,J.get(R.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:$,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,W){let $=J.get(R);$.__webglFramebuffer=W,$.__useDefaultFramebuffer=W===void 0};let yf=U.createFramebuffer();this.setRenderTarget=function(R,W=0,$=0){w=R,S=W,C=$;let K=!0,q=null,ft=!1,wt=!1;if(R){let Rt=J.get(R);if(Rt.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(U.FRAMEBUFFER,null),K=!1;else if(Rt.__webglFramebuffer===void 0)nt.setupRenderTarget(R);else if(Rt.__hasExternalTextures)nt.rebindTextures(R,J.get(R.texture).__webglTexture,J.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let zt=R.depthTexture;if(Rt.__boundDepthTexture!==zt){if(zt!==null&&J.has(zt)&&(R.width!==zt.image.width||R.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");nt.setupDepthRenderbuffer(R)}}let qt=R.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(wt=!0);let Jt=J.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Jt[W])?q=Jt[W][$]:q=Jt[W],ft=!0):R.samples>0&&nt.useMultisampledRTT(R)===!1?q=J.get(R).__webglMultisampledFramebuffer:Array.isArray(Jt)?q=Jt[$]:q=Jt,E.copy(R.viewport),I.copy(R.scissor),D=R.scissorTest}else E.copy(rt).multiplyScalar(G).floor(),I.copy(Mt).multiplyScalar(G).floor(),D=_t;if($!==0&&(q=yf),Z.bindFramebuffer(U.FRAMEBUFFER,q)&&K&&Z.drawBuffers(R,q),Z.viewport(E),Z.scissor(I),Z.setScissorTest(D),ft){let Rt=J.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+W,Rt.__webglTexture,$)}else if(wt){let Rt=W;for(let qt=0;qt<R.textures.length;qt++){let Jt=J.get(R.textures[qt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+qt,Jt.__webglTexture,$,Rt)}}else if(R!==null&&$!==0){let Rt=J.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Rt.__webglTexture,$)}y=-1},this.readRenderTargetPixels=function(R,W,$,K,q,ft,wt,Dt=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Rt=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&wt!==void 0&&(Rt=Rt[wt]),Rt){Z.bindFramebuffer(U.FRAMEBUFFER,Rt);try{let qt=R.textures[Dt],Jt=qt.format,zt=qt.type;if(!H.textureFormatReadable(Jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!H.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=R.width-K&&$>=0&&$<=R.height-q&&(R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Dt),U.readPixels(W,$,K,q,Bt.convert(Jt),Bt.convert(zt),ft))}finally{let qt=w!==null?J.get(w).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(R,W,$,K,q,ft,wt,Dt=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Rt=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&wt!==void 0&&(Rt=Rt[wt]),Rt)if(W>=0&&W<=R.width-K&&$>=0&&$<=R.height-q){Z.bindFramebuffer(U.FRAMEBUFFER,Rt);let qt=R.textures[Dt],Jt=qt.format,zt=qt.type;if(!H.textureFormatReadable(Jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!H.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ie=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,ie),U.bufferData(U.PIXEL_PACK_BUFFER,ft.byteLength,U.STREAM_READ),R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Dt),U.readPixels(W,$,K,q,Bt.convert(Jt),Bt.convert(zt),0);let _e=w!==null?J.get(w).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,_e);let De=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await qu(U,De,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,ie),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ft),U.deleteBuffer(ie),U.deleteSync(De),ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,W=null,$=0){let K=Math.pow(2,-$),q=Math.floor(R.image.width*K),ft=Math.floor(R.image.height*K),wt=W!==null?W.x:0,Dt=W!==null?W.y:0;nt.setTexture2D(R,0),U.copyTexSubImage2D(U.TEXTURE_2D,$,0,0,wt,Dt,q,ft),Z.unbindTexture()};let Mf=U.createFramebuffer(),bf=U.createFramebuffer();this.copyTextureToTexture=function(R,W,$=null,K=null,q=0,ft=null){ft===null&&(q!==0?(Es("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ft=q,q=0):ft=0);let wt,Dt,Rt,qt,Jt,zt,ie,_e,De,we=R.isCompressedTexture?R.mipmaps[ft]:R.image;if($!==null)wt=$.max.x-$.min.x,Dt=$.max.y-$.min.y,Rt=$.isBox3?$.max.z-$.min.z:1,qt=$.min.x,Jt=$.min.y,zt=$.isBox3?$.min.z:0;else{let Tn=Math.pow(2,-q);wt=Math.floor(we.width*Tn),Dt=Math.floor(we.height*Tn),R.isDataArrayTexture?Rt=we.depth:R.isData3DTexture?Rt=Math.floor(we.depth*Tn):Rt=1,qt=0,Jt=0,zt=0}K!==null?(ie=K.x,_e=K.y,De=K.z):(ie=0,_e=0,De=0);let ve=Bt.convert(W.format),Vt=Bt.convert(W.type),Ee;W.isData3DTexture?(nt.setTexture3D(W,0),Ee=U.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(nt.setTexture2DArray(W,0),Ee=U.TEXTURE_2D_ARRAY):(nt.setTexture2D(W,0),Ee=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,W.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,W.unpackAlignment);let ce=U.getParameter(U.UNPACK_ROW_LENGTH),dn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),as=U.getParameter(U.UNPACK_SKIP_PIXELS),fn=U.getParameter(U.UNPACK_SKIP_ROWS),ir=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,we.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,we.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,qt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Jt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,zt);let Ce=R.isDataArrayTexture||R.isData3DTexture,wn=W.isDataArrayTexture||W.isData3DTexture;if(R.isDepthTexture){let Tn=J.get(R),en=J.get(W),an=J.get(Tn.__renderTarget),Oc=J.get(en.__renderTarget);Z.bindFramebuffer(U.READ_FRAMEBUFFER,an.__webglFramebuffer),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,Oc.__webglFramebuffer);for(let Ni=0;Ni<Rt;Ni++)Ce&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(R).__webglTexture,q,zt+Ni),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(W).__webglTexture,ft,De+Ni)),U.blitFramebuffer(qt,Jt,wt,Dt,ie,_e,wt,Dt,U.DEPTH_BUFFER_BIT,U.NEAREST);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(q!==0||R.isRenderTargetTexture||J.has(R)){let Tn=J.get(R),en=J.get(W);Z.bindFramebuffer(U.READ_FRAMEBUFFER,Mf),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,bf);for(let an=0;an<Rt;an++)Ce?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Tn.__webglTexture,q,zt+an):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Tn.__webglTexture,q),wn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,en.__webglTexture,ft,De+an):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,en.__webglTexture,ft),q!==0?U.blitFramebuffer(qt,Jt,wt,Dt,ie,_e,wt,Dt,U.COLOR_BUFFER_BIT,U.NEAREST):wn?U.copyTexSubImage3D(Ee,ft,ie,_e,De+an,qt,Jt,wt,Dt):U.copyTexSubImage2D(Ee,ft,ie,_e,qt,Jt,wt,Dt);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else wn?R.isDataTexture||R.isData3DTexture?U.texSubImage3D(Ee,ft,ie,_e,De,wt,Dt,Rt,ve,Vt,we.data):W.isCompressedArrayTexture?U.compressedTexSubImage3D(Ee,ft,ie,_e,De,wt,Dt,Rt,ve,we.data):U.texSubImage3D(Ee,ft,ie,_e,De,wt,Dt,Rt,ve,Vt,we):R.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ft,ie,_e,wt,Dt,ve,Vt,we.data):R.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ft,ie,_e,we.width,we.height,ve,we.data):U.texSubImage2D(U.TEXTURE_2D,ft,ie,_e,wt,Dt,ve,Vt,we);U.pixelStorei(U.UNPACK_ROW_LENGTH,ce),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,as),U.pixelStorei(U.UNPACK_SKIP_ROWS,fn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ir),ft===0&&W.generateMipmaps&&U.generateMipmap(Ee),Z.unbindTexture()},this.initRenderTarget=function(R){J.get(R).__webglFramebuffer===void 0&&nt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?nt.setTextureCube(R,0):R.isData3DTexture?nt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?nt.setTexture2DArray(R,0):nt.setTexture2D(R,0),Z.unbindTexture()},this.resetState=function(){S=0,C=0,w=null,Z.reset(),St.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}};var oe=11102230246251565e-32,Oe=134217729,Qr=(3+8*oe)*oe;function ss(i,t,e,n,s){let r,o,a,c,l=t[0],u=n[0],h=0,d=0;u>l==u>-l?(r=l,l=t[++h]):(r=u,u=n[++d]);let p=0;if(h<i&&d<e)for(u>l==u>-l?(o=l+r,a=r-(o-l),l=t[++h]):(o=u+r,a=r-(o-u),u=n[++d]),r=o,a!==0&&(s[p++]=a);h<i&&d<e;)u>l==u>-l?(o=r+l,c=o-r,a=r-(o-c)+(l-c),l=t[++h]):(o=r+u,c=o-r,a=r-(o-c)+(u-c),u=n[++d]),r=o,a!==0&&(s[p++]=a);for(;h<i;)o=r+l,c=o-r,a=r-(o-c)+(l-c),l=t[++h],r=o,a!==0&&(s[p++]=a);for(;d<e;)o=r+u,c=o-r,a=r-(o-c)+(u-c),u=n[++d],r=o,a!==0&&(s[p++]=a);return(r!==0||p===0)&&(s[p++]=r),p}function to(i,t){let e=t[0];for(let n=1;n<i;n++)e+=t[n];return e}function ht(i){return new Float64Array(i)}var lx=(3+16*oe)*oe,hx=(2+12*oe)*oe,ux=(9+64*oe)*oe*oe,Zs=ht(4),Cd=ht(8),Rd=ht(12),Id=ht(16),rn=ht(4);function dx(i,t,e,n,s,r,o){let a,c,l,u,h,d,p,g,x,m,f,v,M,_,T,S,C,w,y=i-s,b=e-s,E=t-r,I=n-r;_=y*I,d=Oe*y,p=d-(d-y),g=y-p,d=Oe*I,x=d-(d-I),m=I-x,T=g*m-(_-p*x-g*x-p*m),S=E*b,d=Oe*E,p=d-(d-E),g=E-p,d=Oe*b,x=d-(d-b),m=b-x,C=g*m-(S-p*x-g*x-p*m),f=T-C,h=T-f,Zs[0]=T-(f+h)+(h-C),v=_+f,h=v-_,M=_-(v-h)+(f-h),f=M-S,h=M-f,Zs[1]=M-(f+h)+(h-S),w=v+f,h=w-v,Zs[2]=v-(w-h)+(f-h),Zs[3]=w;let D=to(4,Zs),N=hx*o;if(D>=N||-D>=N||(h=i-y,a=i-(y+h)+(h-s),h=e-b,l=e-(b+h)+(h-s),h=t-E,c=t-(E+h)+(h-r),h=n-I,u=n-(I+h)+(h-r),a===0&&c===0&&l===0&&u===0)||(N=ux*o+Qr*Math.abs(D),D+=y*u+I*a-(E*l+b*c),D>=N||-D>=N))return D;_=a*I,d=Oe*a,p=d-(d-a),g=a-p,d=Oe*I,x=d-(d-I),m=I-x,T=g*m-(_-p*x-g*x-p*m),S=c*b,d=Oe*c,p=d-(d-c),g=c-p,d=Oe*b,x=d-(d-b),m=b-x,C=g*m-(S-p*x-g*x-p*m),f=T-C,h=T-f,rn[0]=T-(f+h)+(h-C),v=_+f,h=v-_,M=_-(v-h)+(f-h),f=M-S,h=M-f,rn[1]=M-(f+h)+(h-S),w=v+f,h=w-v,rn[2]=v-(w-h)+(f-h),rn[3]=w;let F=ss(4,Zs,4,rn,Cd);_=y*u,d=Oe*y,p=d-(d-y),g=y-p,d=Oe*u,x=d-(d-u),m=u-x,T=g*m-(_-p*x-g*x-p*m),S=E*l,d=Oe*E,p=d-(d-E),g=E-p,d=Oe*l,x=d-(d-l),m=l-x,C=g*m-(S-p*x-g*x-p*m),f=T-C,h=T-f,rn[0]=T-(f+h)+(h-C),v=_+f,h=v-_,M=_-(v-h)+(f-h),f=M-S,h=M-f,rn[1]=M-(f+h)+(h-S),w=v+f,h=w-v,rn[2]=v-(w-h)+(f-h),rn[3]=w;let L=ss(F,Cd,4,rn,Rd);_=a*u,d=Oe*a,p=d-(d-a),g=a-p,d=Oe*u,x=d-(d-u),m=u-x,T=g*m-(_-p*x-g*x-p*m),S=c*l,d=Oe*c,p=d-(d-c),g=c-p,d=Oe*l,x=d-(d-l),m=l-x,C=g*m-(S-p*x-g*x-p*m),f=T-C,h=T-f,rn[0]=T-(f+h)+(h-C),v=_+f,h=v-_,M=_-(v-h)+(f-h),f=M-S,h=M-f,rn[1]=M-(f+h)+(h-S),w=v+f,h=w-v,rn[2]=v-(w-h)+(f-h),rn[3]=w;let Y=ss(L,Rd,4,rn,Id);return Id[Y-1]}function Js(i,t,e,n,s,r){let o=(t-r)*(e-s),a=(i-s)*(n-r),c=o-a,l=Math.abs(o+a);return Math.abs(c)>=lx*l?c:-dx(i,t,e,n,s,r,l)}var PM=(7+56*oe)*oe,DM=(3+28*oe)*oe,LM=(26+288*oe)*oe*oe,UM=ht(4),NM=ht(4),FM=ht(4),BM=ht(4),OM=ht(4),zM=ht(4),kM=ht(4),VM=ht(4),GM=ht(4),HM=ht(8),WM=ht(8),XM=ht(8),qM=ht(4),YM=ht(8),ZM=ht(8),JM=ht(16),$M=ht(12),KM=ht(192),jM=ht(192);var e1=(10+96*oe)*oe,n1=(4+48*oe)*oe,i1=(44+576*oe)*oe*oe,s1=ht(4),r1=ht(4),o1=ht(4),a1=ht(4),c1=ht(4),l1=ht(4),h1=ht(4),u1=ht(4),d1=ht(8),f1=ht(8),p1=ht(8),m1=ht(8),g1=ht(8),_1=ht(8),x1=ht(8),v1=ht(8),y1=ht(8),M1=ht(4),b1=ht(4),S1=ht(4),w1=ht(8),T1=ht(16),A1=ht(16),E1=ht(16),C1=ht(32),R1=ht(32),I1=ht(48),P1=ht(64),D1=ht(1152),L1=ht(1152);var B1=(16+224*oe)*oe,O1=(5+72*oe)*oe,z1=(71+1408*oe)*oe*oe,k1=ht(4),V1=ht(4),G1=ht(4),H1=ht(4),W1=ht(4),X1=ht(4),q1=ht(4),Y1=ht(4),Z1=ht(4),J1=ht(4),$1=ht(24),K1=ht(24),j1=ht(24),Q1=ht(24),tb=ht(24),eb=ht(24),nb=ht(24),ib=ht(24),sb=ht(24),rb=ht(24),ob=ht(1152),ab=ht(1152),cb=ht(1152),lb=ht(1152),hb=ht(1152),ub=ht(2304),db=ht(2304),fb=ht(3456),pb=ht(5760),mb=ht(8),gb=ht(8),_b=ht(8),xb=ht(16),vb=ht(24),yb=ht(48),Mb=ht(48),bb=ht(96),Sb=ht(192),wb=ht(384),Tb=ht(384),Ab=ht(384),Eb=ht(768);var Cb=ht(96),Rb=ht(96),Ib=ht(96),Pb=ht(1152);var Dd=Math.pow(2,-52),xc=new Uint32Array(512),no=class i{static from(t,e=xx,n=vx){let s=t.length,r=new Float64Array(s*2);for(let o=0;o<s;o++){let a=t[o];r[2*o]=e(a),r[2*o+1]=n(a)}return new i(r)}constructor(t){let e=t.length>>1;if(e>0&&typeof t[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=t;let n=Math.max(2*e-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(e)),this._hullPrev=new Uint32Array(e),this._hullNext=new Uint32Array(e),this._hullTri=new Uint32Array(e),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(e),this._dists=new Float64Array(e),this.update()}update(){let{coords:t,_hullPrev:e,_hullNext:n,_hullTri:s,_hullHash:r}=this,o=t.length>>1,a=1/0,c=1/0,l=-1/0,u=-1/0;for(let y=0;y<o;y++){let b=t[2*y],E=t[2*y+1];b<a&&(a=b),E<c&&(c=E),b>l&&(l=b),E>u&&(u=E),this._ids[y]=y}let h=(a+l)/2,d=(c+u)/2,p,g,x;for(let y=0,b=1/0;y<o;y++){let E=ch(h,d,t[2*y],t[2*y+1]);E<b&&(p=y,b=E)}let m=t[2*p],f=t[2*p+1];for(let y=0,b=1/0;y<o;y++){if(y===p)continue;let E=ch(m,f,t[2*y],t[2*y+1]);E<b&&E>0&&(g=y,b=E)}let v=t[2*g],M=t[2*g+1],_=1/0;for(let y=0;y<o;y++){if(y===p||y===g)continue;let b=gx(m,f,v,M,t[2*y],t[2*y+1]);b<_&&(x=y,_=b)}let T=t[2*x],S=t[2*x+1];if(_===1/0){for(let E=0;E<o;E++)this._dists[E]=t[2*E]-t[0]||t[2*E+1]-t[1];$s(this._ids,this._dists,0,o-1);let y=new Uint32Array(o),b=0;for(let E=0,I=-1/0;E<o;E++){let D=this._ids[E],N=this._dists[D];N>I&&(y[b++]=D,I=N)}this.hull=y.subarray(0,b),this.triangles=new Uint32Array(0),this.halfedges=new Uint32Array(0);return}if(Js(m,f,v,M,T,S)<0){let y=g,b=v,E=M;g=x,v=T,M=S,x=y,T=b,S=E}let C=_x(m,f,v,M,T,S);this._cx=C.x,this._cy=C.y;for(let y=0;y<o;y++)this._dists[y]=ch(t[2*y],t[2*y+1],C.x,C.y);$s(this._ids,this._dists,0,o-1),this._hullStart=p;let w=3;n[p]=e[x]=g,n[g]=e[p]=x,n[x]=e[g]=p,s[p]=0,s[g]=1,s[x]=2,r.fill(-1),r[this._hashKey(m,f)]=p,r[this._hashKey(v,M)]=g,r[this._hashKey(T,S)]=x,this.trianglesLen=0,this._addTriangle(p,g,x,-1,-1,-1);for(let y=0,b,E;y<this._ids.length;y++){let I=this._ids[y],D=t[2*I],N=t[2*I+1];if(y>0&&Math.abs(D-b)<=Dd&&Math.abs(N-E)<=Dd||(b=D,E=N,I===p||I===g||I===x))continue;let F=0;for(let et=0,rt=this._hashKey(D,N);et<this._hashSize&&(F=r[(rt+et)%this._hashSize],!(F!==-1&&F!==n[F]));et++);F=e[F];let L=F,Y;for(;Y=n[L],Js(D,N,t[2*L],t[2*L+1],t[2*Y],t[2*Y+1])>=0;)if(L=Y,L===F){L=-1;break}if(L===-1)continue;let G=this._addTriangle(L,I,n[L],-1,-1,s[L]);s[I]=this._legalize(G+2),s[L]=G,w++;let z=n[L];for(;Y=n[z],Js(D,N,t[2*z],t[2*z+1],t[2*Y],t[2*Y+1])<0;)G=this._addTriangle(z,I,Y,s[I],-1,s[z]),s[I]=this._legalize(G+2),n[z]=z,w--,z=Y;if(L===F)for(;Y=e[L],Js(D,N,t[2*Y],t[2*Y+1],t[2*L],t[2*L+1])<0;)G=this._addTriangle(Y,I,L,-1,s[L],s[Y]),this._legalize(G+2),s[Y]=G,n[L]=L,w--,L=Y;this._hullStart=e[I]=L,n[L]=e[z]=I,n[I]=z,r[this._hashKey(D,N)]=I,r[this._hashKey(t[2*L],t[2*L+1])]=L}this.hull=new Uint32Array(w);for(let y=0,b=this._hullStart;y<w;y++)this.hull[y]=b,b=n[b];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,e){return Math.floor(px(t-this._cx,e-this._cy)*this._hashSize)%this._hashSize}_legalize(t){let{_triangles:e,_halfedges:n,coords:s}=this,r=0,o=0;for(;;){let a=n[t],c=t-t%3;if(o=c+(t+2)%3,a===-1){if(r===0)break;t=xc[--r];continue}let l=a-a%3,u=c+(t+1)%3,h=l+(a+2)%3,d=e[o],p=e[t],g=e[u],x=e[h];if(mx(s[2*d],s[2*d+1],s[2*p],s[2*p+1],s[2*g],s[2*g+1],s[2*x],s[2*x+1])){e[t]=x,e[a]=d;let f=n[h];if(f===-1){let M=this._hullStart;do{if(this._hullTri[M]===h){this._hullTri[M]=t;break}M=this._hullPrev[M]}while(M!==this._hullStart)}this._link(t,f),this._link(a,n[o]),this._link(o,h);let v=l+(a+1)%3;r<xc.length&&(xc[r++]=v)}else{if(r===0)break;t=xc[--r]}}return o}_link(t,e){this._halfedges[t]=e,e!==-1&&(this._halfedges[e]=t)}_addTriangle(t,e,n,s,r,o){let a=this.trianglesLen;return this._triangles[a]=t,this._triangles[a+1]=e,this._triangles[a+2]=n,this._link(a,s),this._link(a+1,r),this._link(a+2,o),this.trianglesLen+=3,a}};function px(i,t){let e=i/(Math.abs(i)+Math.abs(t));return(t>0?3-e:1+e)/4}function ch(i,t,e,n){let s=i-e,r=t-n;return s*s+r*r}function mx(i,t,e,n,s,r,o,a){let c=i-o,l=t-a,u=e-o,h=n-a,d=s-o,p=r-a,g=c*c+l*l,x=u*u+h*h,m=d*d+p*p;return c*(h*m-x*p)-l*(u*m-x*d)+g*(u*p-h*d)<0}function gx(i,t,e,n,s,r){let o=e-i,a=n-t,c=s-i,l=r-t,u=o*o+a*a,h=c*c+l*l,d=.5/(o*l-a*c),p=(l*u-a*h)*d,g=(o*h-c*u)*d;return p*p+g*g}function _x(i,t,e,n,s,r){let o=e-i,a=n-t,c=s-i,l=r-t,u=o*o+a*a,h=c*c+l*l,d=.5/(o*l-a*c),p=i+(l*u-a*h)*d,g=t+(o*h-c*u)*d;return{x:p,y:g}}function $s(i,t,e,n){if(n-e<=20)for(let s=e+1;s<=n;s++){let r=i[s],o=t[r],a=s-1;for(;a>=e&&t[i[a]]>o;)i[a+1]=i[a--];i[a+1]=r}else{let s=e+n>>1,r=e+1,o=n;eo(i,s,r),t[i[e]]>t[i[n]]&&eo(i,e,n),t[i[r]]>t[i[n]]&&eo(i,r,n),t[i[e]]>t[i[r]]&&eo(i,e,r);let a=i[r],c=t[a];for(;;){do r++;while(t[i[r]]<c);do o--;while(t[i[o]]>c);if(o<r)break;eo(i,r,o)}i[e+1]=i[o],i[o]=a,n-r+1>=o-e?($s(i,t,r,n),$s(i,t,e,o-1)):($s(i,t,e,o-1),$s(i,t,r,n))}}function eo(i,t,e){let n=i[t];i[t]=i[e],i[e]=n}function xx(i){return i[0]}function vx(i){return i[1]}var le=(i,t,e)=>Math.min(e,Math.max(t,i)),Ot=(i,t,e)=>i+(t-i)*e,Ue=(i,t)=>(i%t+t)%t,vc=i=>Math.atan2(Math.sin(i),Math.cos(i));function fe(i,t,e){let n=le((e-i)/(t-i),0,1);return n*n*(3-2*n)}function di(i){return()=>(i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296)}var Zb=new O(0,1,0),yc=class{constructor(t){this.data=t;let e=t.points.map(o=>new O(o[0],o[1],o[2])),n=new Hn(e,!0,"centripetal");n.arcLengthDivisions=e.length*180;let s=n.getLengths(n.arcLengthDivisions);this.length=s.at(-1),this.controlS=e.map((o,a)=>s[a*180]),this.n=Math.ceil(this.length/t.stationSpacing),this.step=this.length/this.n,this.stations=Array.from({length:this.n},(o,a)=>{let c=a*this.step,l=n.getUtoTmapping(a/this.n),u=n.getPoint(l),h=n.getTangent(l),d=Math.min(e.length-1,Math.floor(l*e.length)),p=l*e.length-d,g=t.points[d],x=t.points[(d+1)%e.length],m=Math.hypot(h.x,h.z),f=h.x/m,v=h.z/m;return{s:c,x:u.x,y:u.y,z:u.z,tx:f,tz:v,rx:-v,rz:f,heading:Math.atan2(f,-v),width:Ot(g[3],x[3],p),bank:Math.tan(Ot(g[4],x[4],p)*Math.PI/180),grade:h.y/m}}),this.stations.forEach((o,a)=>{o.curve=vc(this.stations[(a+1)%this.n].heading-this.stations[Ue(a-1,this.n)].heading)/(2*this.step)}),this.zones=t.zones.map((o,a)=>({...o,s:this.controlS[o.start],end:a+1<t.zones.length?this.controlS[t.zones[a+1].start]:this.length}));let r=this.controlS[t.bridge.fromControl]+t.bridge.offset;this.bridge={start:r,end:r+t.bridge.length},this.checkpoints=Array.from({length:t.checkpointCount},(o,a)=>({id:a,s:this.length*a/t.checkpointCount,l:0})),this.objects=[],this.terrain=this.makeTerrain()}zone(t){return t=Ue(t,this.length),this.zones.find(e=>t>=e.s&&t<e.end)||this.zones[0]}onBridge(t){return t>=this.bridge.start&&t<=this.bridge.end}frame(t){let e=Ue(t,this.length)/this.step,n=Math.floor(e),s=this.stations[n%this.n],r=this.stations[(n+1)%this.n],o=e-n,a=s.heading+vc(r.heading-s.heading)*o,c=Math.sin(a),l=-Math.cos(a);return{s:Ue(t,this.length),x:Ot(s.x,r.x,o),z:Ot(s.z,r.z,o),y:Ot(s.y,r.y,o),tx:c,tz:l,rx:-l,rz:c,heading:a,width:Ot(s.width,r.width,o),grade:Ot(s.grade,r.grade,o),curve:Ot(s.curve,r.curve,o),bank:Ot(s.bank,r.bank,o)}}point(t,e=0,n=0){let s=this.frame(t);return new O(s.x+s.rx*e,s.y+s.bank*e+n,s.z+s.rz*e)}nearest(t,e){let n=1/0,s=0,r=this.stations,o=this.n;for(let u=0;u<o;u+=10){let h=r[u],d=(t-h.x)**2+(e-h.z)**2;d<n&&(n=d,s=u)}let a=0;n=1/0;for(let u=-11;u<=11;u++){let h=Ue(s+u,o),d=r[h],p=r[(h+1)%o],g=p.x-d.x,x=p.z-d.z,m=le(((t-d.x)*g+(e-d.z)*x)/(g*g+x*x),0,1),f=(t-d.x-m*g)**2+(e-d.z-m*x)**2;f<n&&(n=f,a=(h+m)*this.step)}let c=this.frame(a),l=(t-c.x)*c.rx+(e-c.z)*c.rz;return{f:c,s:c.s,l,d:Math.sqrt(n)}}shoreX(t){let e=this.stations[0],n=this.data.points[this.zones[1].start];return e.x-36+7*Math.sin((t-e.z)*.016)+4*Math.sin((t+67)*.034)+fe(n[2]+14,n[2]-225,t)*78+fe(n[2]-150,n[2]-630,t)*160}earth(t,e,n=this.nearest(t,e)){let{f:s,l:r,d:o}=n,a=o-s.width/2,c=s.y+r*s.bank-.035,l=t-this.shoreX(e),u=Math.sin(t*.023+e*.012)*Math.cos(e*.02-t*.008)+.42*Math.sin(t*.063-e*.033),h=l*.123+u*.19*fe(1,18,Math.abs(l)),d=fe(-360,-530,e),p=0,g=0;for(let b of this.data.points){let E=1/((t-b[0])**2+(e-b[2])**2+1100)**1.65;p+=E,g+=E*b[1]}let m=Ot(s.y,g/p,fe(15,78,o))-1.3+Math.min(58,o*.17)*(.45+u*.4)+u*2.1+Math.min(45,o*.13)*fe(500,740,t),f=Ot(h,m,fe(9,54+d*13,l));f-=fe(-580,-765,e)*48,f-=fe(530,960,e)*16;let v=this.bridge;if(s.s>v.start-28&&s.s<v.end+28){let b=fe(v.start-28,v.start+4,s.s)*(1-fe(v.end-4,v.end+28,s.s));f-=b*13}let M=this.data.points[11],_=this.stations[0].x,T=(b,E,I,D,N,F)=>{let L=((t-b)/I)**2+((e-E)/D)**2;return N*(1-L)+Math.min(1,Math.max(0,1.4-L))*(9*Math.sin(t*.02+F)+6*Math.cos(e*.039+t*.009)+4*Math.sin(t*.058-e*.037))},S=Math.max(T(_-104,M[2]-265,393,115,83,1.8),T(_-367,M[2]-463,488,126,112,3.2),T(_-906,M[2]+256,115,309,53,.7)),C=9.6*fe(v.start,v.start+5,s.s)*(1-fe(v.end-5,v.end,s.s)),w=this.zones[2],y=fe(w.s-19,w.s+12,s.s)*(1-fe(w.end-8,w.end+22,s.s));return Ot(c,Math.max(f,S),fe(0,13,a)*Ot(1,fe(17,41,a),y))-C*(1-fe(4,18,a))}makeTerrain(){let t=[],e=[],n=[],s=[],r=new Set,o=(f,v,M,_)=>{let T=Math.round(f*256)+","+Math.round(v*256);if(r.has(T))return;r.add(T);let S=_||this.nearest(f,v),C=M??this.earth(f,v,S);s.push([f,v]),t.push(f,C,v),n.push(f/5.8,v/5.8);let w=f-this.shoreX(v),y=fe(-370,-530,v)*fe(10,34,w),b=fe(12,78,w)*(1-.82*y),E=.5+.24*Math.sin(f*.1+v*.075)+.16*Math.sin(f*.24-v*.11),I=new Zt().setRGB(Ot(.69,.18,b)+E*.054,Ot(.49,.235,b)+E*.05,Ot(.29,.099,b)+E*.035);I.lerp(new Zt(.34,.27,.205),y*.77);let D=1-fe(0,8,Math.abs(w));I.multiplyScalar(1-.38*D),e.push(I.r,I.g,I.b)};for(let f=0;f<this.n;f++){let v=this.stations[f];for(let M of[-14,-9,-v.width/2,0,v.width/2,9,14]){let _=v.x+v.rx*M,T=v.z+v.rz*M,S={f:v,l:M,d:Math.abs(M)};o(_,T,this.earth(_,T,S),S)}}let a=(f,v,M)=>{for(let _=f[2];_<=f[3];_+=v)for(let T=f[0];T<=f[1];T+=v){if(M?.(T,_))continue;let S=this.nearest(T,_);S.d>16&&o(T,_,void 0,S)}};a([-120,630,-690,600],9),a([-950,1570,-1790,1590],40,(f,v)=>f>=-120&&f<=630&&v>=-690&&v<=600);let c=no.from(s).triangles,l=new ue;l.setAttribute("position",new kt(t,3)),l.setAttribute("color",new kt(e,3)),l.setAttribute("uv",new kt(n,2));let u=Array.from(c),h=u[0]*3,d=u[1]*3,p=u[2]*3;if((t[d+2]-t[h+2])*(t[p]-t[h])-(t[d]-t[h])*(t[p+2]-t[h+2])<0)for(let f=0;f<u.length;f+=3)[u[f+1],u[f+2]]=[u[f+2],u[f+1]];l.setIndex(u),l.computeVertexNormals();let g=new Map,x=24;for(let f=0;f<u.length;f+=3){let v=u[f]*3,M=u[f+1]*3,_=u[f+2]*3,T=[t[v],t[M],t[_]],S=[t[v+2],t[M+2],t[_+2]];for(let C=Math.floor(Math.min(...S)/x);C<=Math.floor(Math.max(...S)/x);C++)for(let w=Math.floor(Math.min(...T)/x);w<=Math.floor(Math.max(...T)/x);w++){let y=w+","+C;g.has(y)||g.set(y,[]),g.get(y).push(f)}}return{geometry:l,cast:(f,v)=>{let M=g.get(Math.floor(f/x)+","+Math.floor(v/x))||[];for(let _ of M){let T=u[_]*3,S=u[_+1]*3,C=u[_+2]*3,w=t[T],y=t[T+2],b=t[S],E=t[S+2],I=t[C],D=t[C+2],N=(E-D)*(w-I)+(I-b)*(y-D);if(Math.abs(N)<1e-12)continue;let F=((E-D)*(f-I)+(I-b)*(v-D))/N,L=((D-y)*(f-I)+(w-I)*(v-D))/N;if(F>=-1e-5&&L>=-1e-5&&F+L<=1.00001)return F*t[T+1]+L*t[S+1]+(1-F-L)*t[C+1]}return NaN}}}surface(t,e=0){let n=this.frame(t);return Math.abs(e)<=n.width/2+(this.onBridge(n.s)?.98:0)?n.y+n.bank*e:this.terrain.cast(n.x+n.rx*e,n.z+n.rz*e)}roadGeometry(t,e,n=0,s=0,r=this.length,o=this.step){let a=[],c=[],l=[],u=Math.ceil((r-s)/o);for(let d=0;d<=u;d++){let p=Ot(s,r,d/u),g=this.frame(p);for(let x of[t,e]){let m=typeof x=="function"?x(g):x;a.push(g.x+g.rx*m,g.y+g.bank*m+n,g.z+g.rz*m),c.push(m/6,p/6)}if(d<u){let x=d*2;l.push(x,x+1,x+2,x+1,x+3,x+2)}}let h=new ue;return h.setAttribute("position",new kt(a,3)),h.setAttribute("uv",new kt(c,2)),h.setIndex(l),h.computeVertexNormals(),h}quaternion(t){let e=this.frame(t),n=new O(e.tx,e.grade,e.tz).normalize(),s=new O(e.rx,e.bank,e.rz).normalize(),r=new O().crossVectors(s,n).normalize();return s.crossVectors(n,r).normalize(),new gn().setFromRotationMatrix(new se().makeBasis(s,r,n.negate()))}validateWorld(){let t=[],e=l=>{t.length<24&&t.push(l)},n=-1/0,s=0,r=1/0,o=0,a=0;for(let l of this.stations){a=Math.max(a,Math.abs(Math.atan(l.bank)*180/Math.PI)),o=Math.max(o,Math.abs(l.grade)),r=Math.min(r,1/Math.max(1e-6,Math.abs(l.curve)));for(let u of[-1,-.5,0,.5,1]){let h=u*l.width/2,d=l.x+l.rx*h,p=l.z+l.rz*h,g=this.terrain.cast(d,p),x=g-(l.y+l.bank*h);Number.isFinite(g)||e("Missing terrain at "+l.s),n=Math.max(n,x),Math.abs(u)===1&&(s=Math.max(s,this.onBridge(l.s)?Math.abs(this.surface(l.s,h)-(l.y+l.bank*h)):Math.abs(x)))}}(n>.02||s>.15)&&e("Road seam outside tolerance"),(r<25||o>.14||a>12)&&e("Undrivable curve or slope"),this.checkpoints.some((l,u)=>l.id!==u||l.s<0||Math.abs(l.l)>this.frame(l.s).width/2||u&&l.s<=this.checkpoints[u-1].s)&&e("Invalid checkpoint sequence");let c=[];for(let l of this.objects){let u=this.nearest(l.x,l.z);u.d-l.radius<u.f.width/2+3-.02&&e(l.id+" intrudes on verge");let h=this.terrain.cast(l.x,l.z);if((!Number.isFinite(h)||l.kind!=="rock"&&Math.abs(l.y-h)>.3)&&e(l.id+" base height"),l.kind==="house"){for(let d of c)yx(l,d)&&e(l.id+" overlaps "+d.id);c.push(l)}}return{ok:!t.length,errors:t,length:this.length,stations:this.n,minRadius:r,maxGrade:o,maxBank:a,maxTerrainAboveRoad:n,maxEdgeGap:s,objects:this.objects.length}}};function yx(i,t){if(Math.hypot(i.x-t.x,i.z-t.z)>i.radius+t.radius)return!1;let e=o=>[[Math.cos(o.yaw),-Math.sin(o.yaw)],[Math.sin(o.yaw),Math.cos(o.yaw)]],n=e(i),s=e(t),r=(o,a)=>o[0]*a[0]+o[1]*a[1];for(let o of[...n,...s]){let a=(c,l)=>Math.abs(r(o,l[0]))*c.w/2+Math.abs(r(o,l[1]))*c.d/2;if(Math.abs(r(o,[i.x-t.x,i.z-t.z]))>=a(i,n)+a(t,s))return!1}return!0}var Un=1/120;function Ci(i,t=0,e=0){return{s:Ue(t,i.length),distance:t,l:e,angle:0,speed:0,latSpeed:0,steer:0,roll:0,pitch:0,slip:0,tyrePhase:0,y:i.surface(t,e),throttle:0,brake:0,gear:1,rpm:1100,shift:0,stalled:0,off:0,wall:0,lastSafe:{s:Ue(t,i.length),l:e},events:[],maxWheelGap:0,minClearance:1/0,driver:0}}function Ks(i,t,e=0,n=1,s=60){let r=Math.max(12,t.speed*1.7),o=i.frame(t.s),a=i.frame(t.s+r),c=i.frame(t.s+r*1.85),l=Math.max(Math.abs(o.curve)*.87,Math.abs(a.curve),Math.abs(c.curve)*.8,9e-4),u=Math.min(s,31.5,Math.sqrt(9.3/l))*n,h=o.curve*t.speed/Math.max(.2,Ld(t.speed)),d=le((e-t.l)*.11,-.27,.27);return{gas:le((u-t.speed)*.85+.2,0,1),brake:le((t.speed-u-.4)*.31,0,1),steer:le(h+vc(d-t.angle)*2.75,-1,1)}}function Ld(i){return Math.min(1.95,Math.abs(i)*.21)/(1+Math.abs(i)*.025)}function Mc(i,t,e,n,s=!1){let r=i.frame(t.s),o=t.speed;t.throttle=le(e.gas||0,0,1),t.brake=le(e.brake||0,0,1),t.steer=Ot(t.steer,le(e.steer||0,-1,1),1-Math.exp(-n*7));let a=Math.abs(t.l)>r.width/2-.3,c=t.throttle*(8.15-4.15*le(t.speed/55,0,1))*(t.shift>0?.36:1)-t.brake*13.5-.3-t.speed*t.speed*.00255-r.grade*5.5-(a?2.8:0);t.speed=le(t.speed+c*n,0,59);let l=t.steer*Ld(t.speed),u=t.speed*Math.cos(t.angle)/Math.max(.69,1-r.curve*t.l)*n;t.angle=le(t.angle+l*n-r.curve*u,-.97,.97);let h=Math.sin(t.angle)*t.speed;t.latSpeed=Ot(t.latSpeed,h,1-Math.exp(-n*(a?4:7.3))),t.l+=t.latSpeed*n,t.distance+=u,t.s=Ue(t.s+u,i.length);let d=r.s>=i.zones[1].s&&r.s<i.zones[1].end,g=i.onBridge(r.s)||d&&Math.sign(t.l)===(r.curve>0?-1:1)?r.width/2+.62-.91:41;if(a&&i.collisionBins){let v=Math.floor(t.s/25),M=i.collisionBins.get(v)||[];for(let _ of M){if(Math.sign(_.l)!==Math.sign(t.l))continue;Math.min(Ue(_.s-t.s,i.length),Ue(t.s-_.s,i.length))<(_.kind==="house"?_.w/2:_.radius)+1.9&&(g=Math.min(g,Math.abs(_.l)-(_.kind==="house"?_.d/2:Math.min(.46,_.radius))-.92))}}if(t.wall=0,Math.abs(t.l)>g){let v=Math.abs(t.latSpeed),M=Math.sign(t.l);v>2&&t.events.push({type:"barrier",s:t.s,strength:v}),t.l=M*g,t.wall=le(v/3+.08,0,1),t.speed=Math.max(0,t.speed-v*.12-.65*n),t.angle=-M*Math.min(.085,v*.015),t.latSpeed=-M*v*.12}t.slip=Math.abs(h-t.latSpeed)*.15+Math.max(0,Math.abs(l*t.speed)-7)*.1,t.roll=Ot(t.roll,le(l*t.speed*.008,-.065,.065),1-Math.exp(-n*6)),t.pitch=Ot(t.pitch,le((t.speed-o)*.008/n,-.05,.055),1-Math.exp(-n*5)),t.tyrePhase+=t.speed*n/.334,t.shift=Math.max(0,t.shift-n);let x=[0,34,55,82,114,151,205],m=t.speed*3.6;t.gear<6&&m>x[t.gear]*.985&&t.shift===0&&(t.gear++,t.shift=.14,t.events.push({type:"gear",s:t.s})),t.gear>1&&m<x[t.gear-1]*.74&&t.shift===0&&(t.gear--,t.shift=.1,t.events.push({type:"gear",s:t.s})),t.rpm=le(1020+m/x[t.gear]*5660+t.throttle*180,1e3,6950),t.y=i.surface(t.s,t.l);let f=!Number.isFinite(t.y);if(s&&!f){let v=i.terrain,M=i.point(t.s,t.l),_=i.frame(t.s),T=v.cast(M.x,M.z);t.minClearance=Math.min(t.minClearance,t.y+.18-T),t.y+.18<T-.02&&(f=!0);for(let S of[-1.34,1.34])for(let C of[-.81,.81]){let w=S*Math.cos(t.angle)-C*Math.sin(t.angle),y=S*Math.sin(t.angle)+C*Math.cos(t.angle),b=t.y+w*_.grade+y*_.bank,E=i.surface(t.s+w,t.l+y),I=Math.abs(b-E);t.maxWheelGap=Math.max(t.maxWheelGap,I),(!Number.isFinite(E)||I>1.5)&&(f=!0)}}f?(t.events.push({type:"integrity-reset",s:t.s}),t.s=t.lastSafe.s,t.l=t.lastSafe.l,t.speed=0,t.angle=0,t.latSpeed=0,t.y=i.surface(t.s,t.l)):(t.lastSafe.s=t.s,t.lastSafe.l=t.l),t.off=a?t.off+n:0,t.stalled=t.speed<.18?t.stalled+n:0}function Ud(i,t){let e=!0,n=new O,s=new O,r=new O;function o(a,c,l=!1){let u=Math.max(3,Math.ceil(a.distanceTo(c)/1)),h=(i.solids||[]).filter(d=>Math.abs(d.x-a.x)<d.radius+10&&Math.abs(d.z-a.z)<d.radius+10);for(let d=1;d<=u;d++){let p=d/u,g=new O().lerpVectors(a,c,p),x=i.terrain.cast(g.x,g.z);if(g.y<x+.21)return l?!1:(c.lerpVectors(a,c,Math.max(0,(d-1)/u)),!0);for(let m of h){if(g.y>m.y+m.h+.15||g.y<m.y-.15||Math.abs(g.x-m.x)>m.radius+.18||Math.abs(g.z-m.z)>m.radius+.18)continue;let f=g.x-m.x,v=g.z-m.z,M=Math.cos(m.yaw),_=Math.sin(m.yaw);if(Math.abs(M*f-_*v)<m.w*.5+.18&&Math.abs(_*f+M*v)<m.d*.5+.18)return l?!1:(c.lerpVectors(a,c,Math.max(0,(d-1)/u)),!0)}}return!!l}return{reset(){e=!0},chase(a,c,l=!1,u=!1){let h=i.point(a.s,a.l);h.y=a.y;let d=i.frame(a.s),p=d.heading+a.angle*.64,g=Math.sin(p),x=-Math.cos(p);if(n.set(h.x+g*13,h.y+1+d.grade*13,h.z+x*13),r.set(h.x,h.y+1.05,h.z),l)s.set(r.x+g*.48,h.y+1.04,r.z+x*.48),n.y=h.y+1.02+d.grade*13;else{let f=6.1+a.speed*.021;s.set(h.x-g*f,h.y+2.1-d.grade*f,h.z-x*f),n.y=h.y+.96+d.grade*13}o(r,s),t.position.lerp(s,e||u||l?1:1-Math.exp(-c*10)),o(r,t.position),t.up.set(0,1,0),t.lookAt(n),e=!1;let m=l?68:60+le(a.speed/47,0,1)*12;Math.abs(t.fov-m)>.02&&(t.fov=m,t.updateProjectionMatrix())},clear:o}}var io=class extends kr{constructor(t){super(t),this.type=yn}parse(t){let o=function(w,y){switch(w){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(y||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(y||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(y||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(y||""))}},h=function(w,y,b){y=y||1024;let I=w.pos,D=-1,N=0,F="",L=String.fromCharCode.apply(null,new Uint16Array(w.subarray(I,I+128)));for(;0>(D=L.indexOf(`
`))&&N<y&&I<w.byteLength;)F+=L,N+=L.length,I+=128,L+=String.fromCharCode.apply(null,new Uint16Array(w.subarray(I,I+128)));return-1<D?(b!==!1&&(w.pos+=N+D+1),F+L.slice(0,D)):!1},d=function(w){let y=/^#\?(\S+)/,b=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,E=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*FORMAT=(\S+)\s*$/,D=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,N={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},F,L;for((w.pos>=w.byteLength||!(F=h(w)))&&o(1,"no header found"),(L=F.match(y))||o(3,"bad initial token"),N.valid|=1,N.programtype=L[1],N.string+=F+`
`;F=h(w),F!==!1;){if(N.string+=F+`
`,F.charAt(0)==="#"){N.comments+=F+`
`;continue}if((L=F.match(b))&&(N.gamma=parseFloat(L[1])),(L=F.match(E))&&(N.exposure=parseFloat(L[1])),(L=F.match(I))&&(N.valid|=2,N.format=L[1]),(L=F.match(D))&&(N.valid|=4,N.height=parseInt(L[1],10),N.width=parseInt(L[2],10)),N.valid&2&&N.valid&4)break}return N.valid&2||o(3,"missing format specifier"),N.valid&4||o(3,"missing image size specifier"),N},p=function(w,y,b){let E=y;if(E<8||E>32767||w[0]!==2||w[1]!==2||w[2]&128)return new Uint8Array(w);E!==(w[2]<<8|w[3])&&o(3,"wrong scanline width");let I=new Uint8Array(4*y*b);I.length||o(4,"unable to allocate buffer space");let D=0,N=0,F=4*E,L=new Uint8Array(4),Y=new Uint8Array(F),G=b;for(;G>0&&N<w.byteLength;){N+4>w.byteLength&&o(1),L[0]=w[N++],L[1]=w[N++],L[2]=w[N++],L[3]=w[N++],(L[0]!=2||L[1]!=2||(L[2]<<8|L[3])!=E)&&o(3,"bad rgbe scanline format");let z=0,et;for(;z<F&&N<w.byteLength;){et=w[N++];let Mt=et>128;if(Mt&&(et-=128),(et===0||z+et>F)&&o(3,"bad scanline data"),Mt){let _t=w[N++];for(let Gt=0;Gt<et;Gt++)Y[z++]=_t}else Y.set(w.subarray(N,N+et),z),z+=et,N+=et}let rt=E;for(let Mt=0;Mt<rt;Mt++){let _t=0;I[D]=Y[Mt+_t],_t+=E,I[D+1]=Y[Mt+_t],_t+=E,I[D+2]=Y[Mt+_t],_t+=E,I[D+3]=Y[Mt+_t],D+=4}G--}return I},g=function(w,y,b,E){let I=w[y+3],D=Math.pow(2,I-128)/255;b[E+0]=w[y+0]*D,b[E+1]=w[y+1]*D,b[E+2]=w[y+2]*D,b[E+3]=1},x=function(w,y,b,E){let I=w[y+3],D=Math.pow(2,I-128)/255;b[E+0]=bi.toHalfFloat(Math.min(w[y+0]*D,65504)),b[E+1]=bi.toHalfFloat(Math.min(w[y+1]*D,65504)),b[E+2]=bi.toHalfFloat(Math.min(w[y+2]*D,65504)),b[E+3]=bi.toHalfFloat(1)},m=new Uint8Array(t);m.pos=0;let f=d(m),v=f.width,M=f.height,_=p(m.subarray(m.pos),v,M),T,S,C;switch(this.type){case sn:C=_.length/4;let w=new Float32Array(C*4);for(let b=0;b<C;b++)g(_,b*4,w,b*4);T=w,S=sn;break;case yn:C=_.length/4;let y=new Uint16Array(C*4);for(let b=0;b<C;b++)x(_,b*4,y,b*4);T=y,S=yn;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:v,height:M,data:T,header:f.string,gamma:f.gamma,exposure:f.exposure,type:S}}setDataType(t){return this.type=t,this}load(t,e,n,s){function r(o,a){switch(o.type){case sn:case yn:o.colorSpace=si,o.minFilter=Be,o.magFilter=Be,o.generateMipmaps=!1,o.flipY=!0;break}e&&e(o,a)}return super.load(t,r,n,s)}};function Fd(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new ue,l=0;for(let u=0;u<i.length;++u){let h=i[u],d=0;if(e!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in h.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(h.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in h.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(h.morphAttributes[p])}if(t){let p;if(e)p=h.index.count;else if(h.attributes.position!==void 0)p=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(e){let u=0,h=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let g=0;g<p.count;++g)h.push(p.getX(g)+u);u+=i[d].attributes.position.count}c.setIndex(h)}for(let u in r){let h=Nd(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(let u in o){let h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){let p=[];for(let x=0;x<o[u].length;++x)p.push(o[u][x][d]);let g=Nd(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function Nd(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){let u=i[l];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*e}let o=new t(r),a=new Pe(o,e,n),c=0;for(let l=0;l<i.length;++l){let u=i[l];if(u.isInterleavedBufferAttribute){let h=c/e;for(let d=0,p=u.count;d<p;d++)for(let g=0;g<e;g++){let x=u.getComponent(d,g);a.setComponent(d+h,g,x)}}else o.set(u.array,c);c+=u.count*e}return s!==void 0&&(a.gpuType=s),a}var st=(i=0,t=0,e=0)=>new O(i,t,e);function he(i,t,e,n=!1){let s=[],r=[],o=[];for(let c=0;c<=t;c++)for(let l=0;l<=i;l++){let u=e(l/i,c/t);if(s.push(u.x,u.y,u.z),r.push(l/i,c/t),l<i&&c<t){let h=c*(i+1)+l,d=h+1,p=h+i+1,g=p+1;n?o.push(h,d,p,d,g,p):o.push(h,p,d,d,p,g)}}let a=new ue;return a.setAttribute("position",new kt(s,3)),a.setAttribute("uv",new kt(r,2)),a.setIndex(o),a.computeVertexNormals(),a}function Pt(i,t,e,n=0,s=0,r=0){let o=new Me(t,e);return o.position.set(n,s,r),o.castShadow=!0,o.receiveShadow=!0,i.add(o),o}function be(i,t,e,n,s,r=8,o=n){let a=e.clone().sub(t),c=new hn(o,n,a.length(),r),l=Pt(i,c,s);return l.position.addVectors(t,e).multiplyScalar(.5),l.quaternion.setFromUnitVectors(st(0,1,0),a.normalize()),l}function Ne(i,t,e,n,s=6){let r=new Hn(t);return Pt(i,new Or(r,Math.max(8,t.length*5),e,s,!1),n)}function un(i,t,e,n,s,r,o,a,c=20){let l=new Bs(1,c,Math.max(8,c/2));return l.scale(s,r,o),Pt(i,l,a,t,e,n)}function We(i){i.updateWorldMatrix(!0,!0);let t=i.matrixWorld.clone().invert(),e=new Map;i.traverse(n=>{if(!n.isMesh||n.isInstancedMesh)return;let s=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();for(let r of Object.keys(s.attributes))["position","normal","uv"].includes(r)||s.deleteAttribute(r);s.attributes.uv||s.setAttribute("uv",new kt(new Float32Array(s.attributes.position.count*2),2)),s.applyMatrix4(t.clone().multiply(n.matrixWorld)),e.has(n.material)||e.set(n.material,[]),e.get(n.material).push(s)}),i.clear();for(let[n,s]of e){let r=Fd(s,!1);r.computeBoundingSphere(),Pt(i,r,n);for(let o of s)o.dispose()}return i}async function Bd(i=()=>{}){let t=["road","sand","earth","meadow","rock","finish","grain","plaster","timber","tiles","stone","rubber","reef","cliff","shrub","grass","needles","leaves","bark","pavers"],e={},n=["shrub","grass","needles","leaves"],s=["reef","cliff","shrub","grass"],r={},o=[],a,c,l,u=0,h=t.length*3+2+n.length+s.length+5,d=new Vr,p=[];for(let _ of t){e[_]={};for(let[T,S]of[["map","color"],["normalMap","normal"],["roughnessMap","rough"]])p.push(d.loadAsync("./assets/surfaces/"+_+"-"+S+".jpg").then(C=>{C.colorSpace=T==="map"?Re:Ln,C.wrapS=C.wrapT=ws,C.anisotropy=8,C.name=_+" "+S,e[_][T]=C,i(++u/h)}))}for(let _ of n)p.push(d.loadAsync("./assets/surfaces/"+_+"-alpha.jpg").then(T=>{T.name=_+" alpha",e[_].alphaMap=T,i(++u/h)}));for(let _=0;_<2;_++)p.push(d.loadAsync("./assets/surfaces/grove"+_+".webp").then(T=>{T.colorSpace=Re,T.anisotropy=4,o[_]=T,i(++u/h)}));p.push(d.loadAsync("./assets/surfaces/wild-grass.webp").then(_=>{_.colorSpace=Re,c=_,i(++u/h)})),p.push(d.loadAsync("./assets/surfaces/lentisco.webp").then(_=>{_.colorSpace=Re,l=_,i(++u/h)})),p.push(fetch("./assets/geometry/grove.json").then(_=>_.json()).then(_=>{a=_,i(++u/h)}));for(let _ of s)p.push((async()=>{let[T,S]=await Promise.all([fetch("./assets/geometry/"+_+".json").then(y=>y.json()),fetch("./assets/geometry/"+_+".bin").then(y=>y.arrayBuffer())]),C=new Is(new Float32Array(S,0,T.vertices*8),8),w=new ue;for(let[y,b,E]of[["position",3,0],["normal",3,3],["uv",2,6]])w.setAttribute(y,new Ps(C,b,E));w.setIndex(new Pe(new Uint32Array(S,T.vertices*32,T.indices),1)),w.computeBoundingSphere(),r[_]=w,i(++u/h)})());let g=new io().loadAsync("./assets/surfaces/coastal-sky.hdr").then(_=>(i(++u/h),_)),x=new io().loadAsync("./assets/surfaces/coastal-light.hdr").then(_=>(i(++u/h),_));await Promise.all(p);let[m,f]=await Promise.all([g,x]),v=new Map;function M(_,T=16777215,S=.78,C=0){let w=[_,T,S,C].join("/");if(!v.has(w)){let y=new qe({...e[_],color:T,metalness:C,roughness:S,normalScale:new ct(.4,.4)});n.includes(_)&&(y.side=re,y.alphaTest=.43,y.forceSinglePass=!0),y.name=w,v.set(w,y)}return v.get(w)}return{textures:e,sky:m,environment:f,material:M,scans:r,groveMaps:o,groveShapes:a,wildGrass:c,bushMap:l}}function js(i){return i.onBeforeCompile=t=>{t.fragmentShader=t.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal=normalize(mat3(viewMatrix)*vec3(.11,.96,.19)+normal*.18);totalEmissiveRadiance+=diffuseColor.rgb*.48;`)},i}var Ri=st(-.32,.127,-.94).normalize();function Od(i,t,e){t.outputColorSpace=Re,t.toneMapping=Ca,t.toneMappingExposure=1.05,t.shadowMap.enabled=!0,t.shadowMap.type=ya;let n=Math.atan2(Ri.z,Ri.x),s=(1255/2048-.5)*Math.PI*2-n,r=new ze({side:Ye,depthWrite:!1,uniforms:{tSky:{value:e.sky},sunDir:{value:Ri},angle:{value:s}},vertexShader:"varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}",fragmentShader:`
      varying vec3 vDir; uniform sampler2D tSky; uniform vec3 sunDir; uniform float angle;
      void main(){vec3 d=normalize(vDir);
        vec2 uv=vec2(fract((atan(d.z,d.x)+angle)/6.2831853+.5),asin(clamp(d.y-.039,-1.,1.))/3.14159265+.5);
        vec3 hdr=texture2D(tSky,uv).rgb;
        float horizon=exp(-max(d.y,0.)*7.);
        vec3 sky=hdr*mix(vec3(.56,.83,1.10),vec3(1.67,.82,.47),horizon)*.69;
        float beam=max(dot(d,sunDir),0.);
        sky+=vec3(1.15,.48,.13)*pow(beam,21.)*.39+vec3(8.,5.2,1.8)*smoothstep(.99978,.99996,beam);
        sky=mix(sky,vec3(.6,.45,.34),smoothstep(.025,-.045,d.y));
        gl_FragColor=vec4(sky,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),o=new Me(new Bs(1800,64,32),r);o.renderOrder=-100,o.frustumCulled=!1,i.add(o),e.environment.mapping=ks,i.environment=e.environment,i.environmentRotation.y=s,i.environmentIntensity=.7,i.fog=new br(14268578,160,1350);let a=new Xr(16765346,3.5);return a.castShadow=!0,a.shadow.mapSize.set(2048,2048),Object.assign(a.shadow.camera,{near:1,far:315,left:-45,right:45,top:42,bottom:-42}),a.shadow.camera.updateProjectionMatrix(),a.shadow.normalBias=.014,a.shadow.bias=-18e-5,i.add(a,a.target,new Hr(12113124,8809815,.46)),{light:a,dome:o,update(c,l){o.position.copy(c.position);let u=Math.round(l.x*6)/6,h=Math.round(l.z*6)/6;a.target.position.set(u,l.y,h),a.position.copy(a.target.position).addScaledVector(Ri,160)}}}var Sc=[{name:"Vermelho brasa",hex:12134169},{name:"Marfim",hex:15327167},{name:"Azul mar\xE9",hex:2520973},{name:"Verde pinhal",hex:3564110},{name:"Ouro solar",hex:14787384},{name:"Azul noite",hex:3426144}],lh=["27","08","61","34","72","19"],wc=[{name:"Vela GT",type:"Cup\xEA gran turismo"},{name:"Bruma RS",type:"Hatch esportivo"}];function bc(i,t){if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){let n=i[e-1],s=i[e],r=i[Math.max(0,e-2)],o=i[Math.min(i.length-1,e+1)],a=(t-n[0])/(s[0]-n[0]),c=(s[1]-r[1])/Math.max(.01,s[0]-r[0])*(s[0]-n[0]),l=(o[1]-n[1])/Math.max(.01,o[0]-n[0])*(s[0]-n[0]);return(2*a*a*a-3*a*a+1)*n[1]+(a*a*a-2*a*a+a)*c+(-2*a*a*a+3*a*a)*s[1]+(a*a*a-a*a)*l}return i.at(-1)[1]}function zd(i,t=!1){let e=document.createElement("canvas");e.width=e.height=1024;let n=e.getContext("2d");t&&(n.fillStyle="#171d20",n.fillRect(0,270,1024,480),n.strokeStyle="#a59e86",n.lineWidth=13,n.strokeRect(25,294,974,430)),n.fillStyle=t?"#e0d8bc":"#eee8d5",n.textAlign="center",n.textBaseline="middle",n.font=t?"bold 220px Arial":"italic 900 590px Arial",n.fillText(i,505,525),t||(n.fillRect(174,790,676,10),n.font="bold 64px Arial",n.fillText("E S T R E I T O",500,860));let s=new Si(e);return s.colorSpace=Re,s.anisotropy=8,new qe({map:s,transparent:!0,alphaTest:.17,roughness:.52,metalness:.15,side:re,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})}function Mx(i,t,e){let n=new ne,s=new ne;n.add(s);let r=i.material,o=r("rubber",3420977,.92),a=r("finish",12105647,.28,.91),c=r("finish",e?5593425:6973538,.3,.86),l=r("grain",9144707,.54,.76),u=r("rubber",1579805,.83),h=r("finish",14636592,.32,.45),d=(f,v,M,_)=>{let T=new hn(f,f,v,60);return T.rotateZ(Math.PI/2),Pt(s,T,_,M,0,0)},p=[[.214,-.115],[.273,-.128],[.313,-.119],[.334,-.09],[.337,-.058],[.337,.065],[.33,.105],[.313,.123],[.275,.134],[.232,.135],[.217,.118],[.217,-.115]],g=new Ji(p.map(([f,v])=>new ct(f,v)),72);g.rotateZ(-Math.PI/2),Pt(s,g,o);let x=.119*t,m=(f,v,M,_)=>{let T=new Os(f,v,8,64);return T.rotateY(Math.PI/2),Pt(s,T,_,M)};m(.311,.0028,t*.124,u),m(.285,.002,t*.133,o),m(.233,.013,x,a),m(.212,.008,x-.011*t,c),d(.185,.013,t*.056,l),d(.092,.047,t*.075,c),d(.05,.039,x,a);for(let f=0;f<7;f++){let v=f/7*Math.PI*2+.1;for(let M of[-1,1]){let T=[[.048,v+.05],[.12,v+M*.095],[.224,v+M*.2+.09],[.224,v+M*.2-.015],[.098,v-.1],[.043,v-.15]].map(([w,y])=>new ct(Math.cos(y)*w,Math.sin(y)*w)),S=new ci(T),C=new wi(S,{depth:.012,bevelEnabled:!0,bevelSize:.004,bevelThickness:.003,bevelSegments:1,curveSegments:2});C.rotateY(t*Math.PI/2),Pt(s,C,c,x-t*.009)}for(let M=0;M<3;M++){let _=.135+M*.013,T=v+M*.1,S=new Us(.004,6);S.rotateY(t*Math.PI/2),Pt(s,S,u,t*.064,Math.cos(T)*_,Math.sin(T)*_)}}for(let f=0;f<5;f++){let v=f*2*Math.PI/5;un(s,t*.146,.031*Math.cos(v),.031*Math.sin(v),.007,.009,.009,u,10)}return We(s),un(n,t*.072,.018,.152,.037,.088,.042,h,16),{wheel:n,rolling:s}}function kd(i,t=0,e=0,n=lh[e]){let s=new ne,r=new ne,o=new ne,a=[];s.name=wc[t].name,s.userData.kind="car",s.add(r),r.add(o);let c=i.material,l=new zs({...i.textures.finish,color:Sc[e].hex,metalness:.58,roughness:.3,clearcoat:1,clearcoatRoughness:.075,envMapIntensity:1.36,normalScale:new ct(.055,.055),side:re});l.name="Carroceria perolizada";let u=new zs({color:2571848,metalness:.33,roughness:.105,clearcoat:1,clearcoatRoughness:.055,envMapIntensity:1.5,transparent:!0,opacity:.92,side:re});u.name="Vidro fum\xEA";let h=c("rubber",2237993,.75,.15),d=c("finish",1778213,.28,.39),p=c("finish",11774624,.29,.85),g=c("finish",e===1?3157289:14865845,.43,.38),x=c("rubber",4078390,.95),m=new qe({color:16773332,emissive:16771520,emissiveIntensity:1.75});m.name="Farol";let f=new qe({color:10225424,emissive:16455205,emissiveIntensity:.78});f.name="Lanterna";let v=t?-2.04:-2.25,M=t?2.01:2.23,_=t?-1.21:-1.36,T=t?1.22:1.36,S=[[v,.72],[v+.17,.87],[_,.974],[-.5,.913],[.4,.922],[T,.987],[M-.22,.947],[M,.835]],C=t?[[v,.57],[-1.65,.7],[-.9,.85],[-.5,.87],[.7,.89],[1.41,.91],[M,.87]]:[[v,.54],[-1.91,.64],[-1.48,.694],[-.8,.76],[-.31,.784],[.76,.77],[1.42,.78],[1.9,.86],[M,.785]],w=B=>bc(S,B),y=(B,V)=>{let H=Math.abs(B),Z=w(V),it=bc(C,V),nt=(.064+.087*Math.exp(-((V-_)**2)/.37)+.105*Math.exp(-((V-T)**2)/.53))*Math.exp(-((H-.82)**2)/.025)-Math.pow(H,8)*.05+.022*(1-H*H),Ct=H*H*(.215*(1-fe(v,v+.62,V))-.13*fe(M-.5,M,V));return st(B*Z,it+nt,V+Ct)},b=B=>{let V=Math.min(Math.abs(B-_),Math.abs(B-T)),H=.375;return V<H?.338+Math.sqrt(Math.max(0,H*H-V*V)):.172},E=(B,V,H)=>{let Z=y(B,V),it=w(V),J=b(Z.z),nt=.021*Math.sin(Math.PI*H)-.087*Math.pow(H,3),Ct=.037*Math.sin(Math.PI*H)*Math.exp(-((V-.35)**2)/.5);return st(B*(it+nt-Ct),Ot(Z.y,J,H),Z.z)};Pt(o,he(44,116,(B,V)=>y(B*2-1,Ot(v,M,V))),l);for(let B of[-1,1]){Pt(o,he(108,14,(mt,P)=>E(B,Ot(v,M,mt),P),B===1),l);for(let mt of[_,T]){let P=[];for(let X=0;X<=26;X++){let j=Math.PI*X/26,lt=mt+Math.cos(j)*.377;P.push(st(B*(w(lt)+.008),.338+Math.sin(j)*.377,lt))}Ne(o,P,.0135,l);let A=new Os(.349,.027,8,56,Math.PI);A.rotateY(Math.PI/2),Pt(o,A,h,B*.883,.333,mt)}let V=[st(B*.878,.18,_+.34),st(B*.943,.154,-.55),st(B*.96,.163,.48),st(B*.938,.207,T-.32)];Ne(o,V,.043,d,8);let H=[[-.73,.08],[-.65,.42],[-.52,.76],[.32,.78],[.68,.63],[.76,.27],[.71,.045]].map(([mt,P])=>E(B,mt,P).add(st(B*.002,0,0)));Ne(o,H,.0034,h,5);let Z=E(B,.56,.15);un(o,Z.x+B*.008,Z.y,Z.z,.013,.012,.073,d,16);let it=zd(n),J=he(16,8,(mt,P)=>{let A=E(B,Ot(B===1?.32:-.38,B===1?-.38:.32,mt),Ot(.15,.74,1-P));return A.x+=B*.008,A.y+=.009,A});Pt(o,J,it);let nt=st(B*.77,.846,t?-.67:-.39);be(o,nt,nt.clone().add(st(B*.176,.11,-.05)),.02,h,8);let Ct=un(o,B*.999,.97,nt.z-.037,.123,.052,.122,l,26);Ct.rotation.z=-B*.12,un(o,B*1.008,.966,nt.z+.038,.097,.038,.043,p,16)}function I(B,V,H){let Z=B?v:M,it=y(V,Z),J=E(1,Z,1-H),nt=Ot(.165,.172,V*V),Ct=.063*Math.sin(H*Math.PI)-.033*Math.exp(-((H-.39)**2)/.016);return st(V*J.x,Ot(nt,it.y,H),it.z+(B?-1:1)*Ct*(1-V*V))}function D(B,V){Pt(o,he(60,24,(H,Z)=>I(V,H*2-1,Z),!V),l)}D(v,!0),D(M,!1);let N=t?-1.14:-.88,F=t?-.54:-.21,L=t?.74:.47,Y=t?1.69:1.53,G=t?1.45:1.245,z=B=>bc([[N,t?.83:.751],[F-.17,G-.075],[F,G-.018],[(F+L)/2,G],[L,G-.025],[Y-.16,t?1.07:.845],[Y,t?.89:.78]],B),et=B=>(t?.838:.768)+.035*Math.sin((B-N)/(Y-N)*Math.PI),rt=B=>bc([[N,.76],[F,.625],[L,.634],[Y,.78]],B),Mt=(B,V)=>st(B*rt(V),z(V)-.045*Math.pow(Math.abs(B),2),V+.049*(B*B)*Math.sign(V));for(let[B,V,H]of[[N,F,u],[F,L,l],[L,Y,u]])Pt(o,he(32,26,(Z,it)=>Mt(2*Z-1,Ot(B,V,it))),H);for(let B of[-1,1]){let V=(it,J)=>{let nt=Mt(B,it);return st(Ot(B*(w(it)*.91),nt.x,J),Ot(et(it),nt.y,J),Ot(it,nt.z,J))};Pt(o,he(54,14,(it,J)=>V(Ot(N,Y,it),J),B===1),u);for(let it of[F,t?.22:.25,L+.045]){let J=[V(it+(it===F?-.38:.1),0),V(it+(it===F?-.2:.04),.5),V(it,1)];Ne(o,J,it===F?.032:.025,it===F?l:d,8)}let H=[],Z=[];for(let it=0;it<=18;it++){let J=Ot(N,Y,it/18);H.push(V(J,0)),Z.push(V(J,1))}Ne(o,H,.014,p),Ne(o,Z,.019,l,8),un(o,B*.385,.826,.28,.256,.293,.173,x,20)}for(let B of[N,Y])Ne(o,Array.from({length:15},(V,H)=>Mt(H/7-1,B)),.013,h);let _t=(B,V,H,Z,it,J,nt=.004)=>Pt(o,he(8,42,(Ct,mt)=>{let P=J(Ot(B,V,Ct),Ot(Z,it,mt));return P.y+=nt,P}),H);for(let[B,V]of[[-.455,-.404],[-.386,-.369]])_t(B,V,g,v+.06,N-.04,y),_t(B,V,g,F+.02,L-.02,Mt),_t(B,V,g,Y+.05,M-.06,y);let Gt=(B,V,H,Z,it,J)=>{let nt=(mt,P)=>{let A=V+(mt*2-1)*H*(1+J*(P-.5)),X=1-.24*Math.pow(Math.abs(mt*2-1),5);return I(B,A,Z+it*X*P).add(st(0,0,B?-.01:.01))};Pt(o,he(30,12,nt,!B),h);let Ct=[...Array.from({length:15},(mt,P)=>nt(P/14,0)),...Array.from({length:15},(mt,P)=>nt(1-P/14,1)),nt(0,0)];for(let mt=1;mt<Ct.length;mt++)be(o,Ct[mt-1],Ct[mt],.0085,d,6);for(let mt=0;mt<5;mt++)Ne(o,Array.from({length:10},(P,A)=>nt(.035+A/9*.93,.105+mt*.18).add(st(0,0,B?-.008:.008))),.0056,d,5);for(let mt=0;mt<11;mt++)be(o,nt(.04+mt*.092,.07),nt(.065+mt*.092,.93),.0026,h,4)};Gt(!0,0,.51,.098,.49,-.24),Gt(!0,-.776,.149,.153,.412,.39),Gt(!0,.776,.149,.153,.412,.39);for(let B of[-1,1]){let V=(J,nt)=>{let Ct=Ot(.45,.958,J),mt=.025+.13*Math.sin(J*Math.PI)**.63,P=Ot(v+.053,v+.51,J*J)+(nt-.32)*mt;return y(B*Ct,P).add(st(0,.01,0))};Pt(o,he(32,10,(J,nt)=>V(J,nt),B===-1),d),Ne(o,Array.from({length:16},(J,nt)=>V(nt/15,.13).add(st(0,.009,0))),.009,m);for(let J=0;J<3;J++){let nt=V(.29+J*.18,.65);un(o,nt.x,nt.y+.008,nt.z,.026,.009,.017,p,12)}for(let J=0;J<3;J++){let nt=Array.from({length:7},(Ct,mt)=>y(B*(.43+mt*.027),-.99+J*.051+mt*.009).add(st(0,.004,0)));Ne(o,nt,.009,d,5)}let H=Array.from({length:14},(J,nt)=>{let Ct=(.33+nt/13*.65)*B,mt=y(Ct,M);return st(mt.x,mt.y-.092+.012*Math.sin(nt*.3),mt.z+.045)});Ne(o,H,.046,d,10),Ne(o,H.map(J=>J.clone().add(st(0,.011,.046))),.0125,f,8),Ne(o,H.slice(3).map(J=>J.clone().add(st(0,-.016,.044))),.007,f);let Z=new hn(.06,.072,.13,28,1,!0);Z.rotateX(Math.PI/2),Pt(o,Z,p,B*.587,.242,M+.013);let it=new Us(.05,24);Pt(o,it,h,B*.587,.242,M+.084)}Gt(!1,0,.85,.07,.27,.33);for(let B of[-.48,-.28,0,.28,.48]){let V=new Gn(.015,.106,.28);Pt(o,V,h,B,.183,M-.033)}let Ht=zd(t?"B R S":"V E L A",!0);Pt(o,he(8,5,(B,V)=>st((B-.5)*.52,.432+V*.16,M+.059),!0),Ht);for(let B of[!0,!1]){let V=B?v:M,H=Array.from({length:23},(Z,it)=>{let J=y((it/11-1)*1.01,V);return J.z+=B?-.02:.015,J.y=.174,J});Ne(o,H,.031,d,8)}let Q=t?Y-.03:M-.23,ot=t?G-.13:1.03;for(let B of[-1,1])be(o,st(B*.54,t?1.06:.82,Q-.02),st(B*.56,ot,Q+.043),.025,d,6);Pt(o,he(34,8,(B,V)=>{let H=(B-.5)*(t?1.47:1.91);return st(H,ot+.025*H*H+.019*Math.sin(V*Math.PI),Q+(V-.5)*.198+.05*H*H)}),t?l:d);let xt=t?1.47:1.91;Pt(o,he(36,15,(B,V)=>{let H=(B-.5)*xt,Z=V*Math.PI*2;return st(H,ot+.022*H*H-.01+.022*Math.sin(Z),Q+.099*Math.cos(Z)+.05*H*H)}),t?l:d);for(let B of[-1,1]){let V=new ci([new ct(-.13,-.025),new ct(.13,-.018),new ct(.116,.072),new ct(-.074,.055)]),H=new wi(V,{depth:.012,bevelEnabled:!0,bevelSize:.007,bevelThickness:.004,bevelSegments:2});H.rotateY(Math.PI/2),Pt(o,H,d,B*xt*.5,ot+.008,Q+.044)}for(let B of[_,T])for(let V of[-1,1]){let{wheel:H,rolling:Z}=Mx(i,V,t);H.position.set(V*.852,.337,B),s.add(H),a.push({wheel:H,rolling:Z,steers:B===_})}We(o);let Et=document.createElement("canvas");Et.width=Et.height=1024;let Tt=Et.getContext("2d"),Xt=Tt.createRadialGradient(512,512,90,512,512,504);Xt.addColorStop(0,"rgba(18,12,8,.64)"),Xt.addColorStop(.65,"rgba(18,12,8,.53)"),Xt.addColorStop(1,"rgba(18,12,8,0)"),Tt.fillStyle=Xt,Tt.fillRect(0,0,1024,1024);let ge=new Wi({map:new Si(Et),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),U=new Me(new He(2.8,5.3).rotateX(-Math.PI/2),ge);return U.position.y=.014,s.add(U),{root:s,shell:r,wheels:a,paint:l,tail:f,style:t,color:e,update(B,V){s.position.copy(V.point(B.s,B.l)),s.position.y=B.y,s.quaternion.copy(V.quaternion(B.s)),s.rotateY(-B.angle),r.rotation.z=-B.roll,r.rotation.x=B.pitch*.48,r.position.y=.006*Math.sin(B.tyrePhase*.42)*Math.min(B.speed/35,1);let H=V.frame(B.s);for(let Z of a){let it=Z.wheel.position.x,J=-Z.wheel.position.z,nt=J*Math.cos(B.angle)-it*Math.sin(B.angle),Ct=J*Math.sin(B.angle)+it*Math.cos(B.angle),mt=V.surface(B.s+nt,B.l+Ct);Z.wheel.position.y=.337+le(mt-B.y-nt*H.grade-Ct*H.bank,-.1,.1),Z.wheel.rotation.y=Z.steers?-B.steer*.42:0,Z.rolling.rotation.x=-B.tyrePhase}f.emissiveIntensity=B.brake>.14?3.5:.72}}}function Vd(i,t,e){let n=i.terrain.geometry,s=n.attributes.position,r=[];for(let d=0;d<s.count;d++){let p=s.getX(d),g=s.getZ(d),x=p-i.shoreX(g),m=fe(-365,-530,g)*fe(8,39,x),f=fe(11,49,x);r.push(f,m,1-fe(0,10,Math.abs(x)))}n.setAttribute("layer",new kt(r,3));let o=e.material("earth",16777215,.97).clone();o.vertexColors=!0,o.onBeforeCompile=d=>{d.uniforms.meadowMap={value:e.textures.meadow.map};for(let p of["sand","rock"])for(let[g,x]of[["Color","map"],["Normal","normalMap"],["Rough","roughnessMap"]])d.uniforms[p+g]={value:e.textures[p][x]};d.vertexShader=`attribute vec3 layer; varying vec3 strata;
`+d.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
strata=layer;`),d.fragmentShader=`varying vec3 strata; uniform sampler2D sandColor, rockColor, sandNormal, rockNormal, sandRough, rockRough, meadowMap;
`+d.fragmentShader,d.fragmentShader=d.fragmentShader.replace("#include <map_fragment>",`
      vec2 uv=vMapUv;
      vec3 e=texture2D(map,uv*1.25).rgb, s=texture2D(sandColor,uv*.85).rgb, r=texture2D(rockColor,uv*.72).rgb;
      float macro=.86+.19*sin(uv.x*.58+sin(uv.y*.35))+.08*sin(uv.y*.23+uv.x*.11);
      vec3 earth=mix(e,texture2D(map,uv*.42+vec2(.15,.3)).rgb,.29)*vec3(1.25,1.62,.87);
      earth=mix(earth,texture2D(meadowMap,uv*.91).rgb*vec3(1.06,1.04,.84),clamp(.67+.21*sin(uv.x*.48+sin(uv.y*.38)),.23,.93));
      vec3 sand=s*vec3(1.30,1.12,.88)*(1.-strata.z*.39);
      diffuseColor.rgb*=mix(mix(sand,earth,strata.x),r*1.35,strata.y)*macro;
    `).replace("#include <color_fragment>","diffuseColor.rgb *= mix(vec3(1.), vColor, .31);"),d.fragmentShader=d.fragmentShader.replace("#include <normal_fragment_maps>",Kt.normal_fragment_maps.replace("texture2D( normalMap, vNormalMapUv ).xyz","mix(mix(texture2D(sandNormal,vNormalMapUv*.85).xyz,texture2D(normalMap,vNormalMapUv*1.25).xyz,strata.x),texture2D(rockNormal,vNormalMapUv*.72).xyz,strata.y)")),d.fragmentShader=d.fragmentShader.replace("#include <roughnessmap_fragment>",Kt.roughnessmap_fragment.replace("texelRoughness.g","mix(mix(texture2D(sandRough,vRoughnessMapUv*.85).g,texelRoughness.g,strata.x),texture2D(rockRough,vRoughnessMapUv*.72).g,strata.y)"))};let a=new Me(n,o);a.receiveShadow=!0,a.name="Terreno triangulado",t.add(a);let c=e.material("road",16777215,.95).clone();c.normalScale.set(.65,.65);let l=i.roadGeometry(d=>-d.width/2,d=>d.width/2),u=[];for(let d=0;d<=i.n;d++)u.push(-1,1);l.setAttribute("lateral",new kt(u,1)),c.onBeforeCompile=d=>{d.vertexShader=`attribute float lateral; varying float crossRoad;
`+d.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
crossRoad=lateral;`),d.fragmentShader=`varying float crossRoad;
`+d.fragmentShader.replace("#include <map_fragment>",`
      vec2 q=vMapUv; float m=q.y*6.;float x=q.x*6.;
      vec3 t=texture2D(map,q*1.42).rgb; vec3 coarse=texture2D(map,q*.343+vec2(.35,.16)).rgb;
      float grain=clamp(dot(t,vec3(.28,.55,.17))*5.8,.28,1.);
      float rubber=exp(-pow((abs(x)-2.1-.32*sin(m*.033))/.83,2.));
      vec3 asphalt=mix(t,coarse,.235)*vec3(.80,.86,.96)*(.81+.13*sin(m*.057+2.*sin(m*.019))-.26*rubber);
      float wear=smoothstep(.88,1.,abs(crossRoad));
      asphalt=mix(asphalt,coarse*vec3(1.28,1.12,.96),wear*.49);
      float aa=max(fwidth(x),.010);float edge=1.-smoothstep(.046,.046+aa,abs((1.-abs(crossRoad))*5.65-.29));
      float dashstep=mod(m+1.5,10.);float center=(1.-smoothstep(.075,.075+aa,abs(x)))*smoothstep(.03,.11,dashstep)*(1.-smoothstep(3.20,3.28,dashstep));
      float finish=step(.15,m)*step(m,1.31);float check=mod(floor((x+6.)/.57)+floor((m-.15)/.58),2.);
      float grid=0.;
      for(int i=0;i<6;i++){float row=float(i/2)*8.+8.;float lane=mod(float(i),2.)*4.-2.;
        float start=2969.2548-row-mod(float(i),2.)*2.;float zz=m-start;
        float side=1.-smoothstep(.045,.045+aa,abs(abs(x-lane)-1.11));
        float end=1.-smoothstep(.050,.050+aa,abs(zz));
        grid=max(grid,max(side*step(-1.4,zz)*step(zz,0.),end*step(abs(x-lane),1.15)));
      }
      vec3 painted=mix(asphalt,vec3(.65,.62,.53)*(.50+.50*grain),max(max(edge,center),grid)*.86);
      diffuseColor.rgb*=mix(painted,mix(vec3(.027),vec3(.74,.72,.64)*(.6+.4*grain),check),finish*.92);
    `.replace("2969.2548",i.length.toFixed(4)))};let h=new Me(l,c);return h.name="Asfalto",h.receiveShadow=!0,t.add(h),{road:h,terrain:a}}function Se(i,t,e,n,s,r,o,a){return Pt(i,new Gn(s,r,o),a,t,e,n)}function Ac(i,t,e,n={}){let s=document.createElement("canvas");s.width=2048,s.height=1024;let r=s.getContext("2d");if(r.fillStyle=t,r.fillRect(0,0,2048,1024),n.pattern){r.fillStyle=n.pattern;for(let a=-3;a<13;a++)r.beginPath(),r.moveTo(140*a,0),r.lineTo(140*a+80,0),r.lineTo(140*a-150,1024),r.lineTo(140*a-230,1024),r.fill()}r.fillStyle=e,r.textAlign="center",r.textBaseline="middle",r.font="italic 900 "+(n.size||235)+"px Arial",r.save(),r.translate(1024,512),r.scale(1,n.stretch||1),r.fillText(i,0,0,1850),r.restore();let o=new Si(s);return o.name=i,o.colorSpace=Re,o.anisotropy=8,new qe({map:o,roughness:.71,side:re})}var Tc=class{constructor(t,e,n){this.scene=t,this.track=e,this.art=n,this.batch=new Map,this.chunks=[],this.serial=0,this.rng=di(e.data.seed),this.templates={}}scan(t,e=16777215){let n=new ne;return Pt(n,this.art.scans[t],this.art.material(t,e,.93)),n}add(t,e,n,s={}){let r=this.track.frame(e),o=r.x+r.rx*n,a=r.z+r.rz*n,c=this.track.terrain.cast(o,a),l=s.scale||1,u=Array.isArray(l)?st(...l):st(l,l,l),h=s.yaw??-r.heading,d=st(o,c+(s.sink||0),a),p=new se().compose(d,new gn().setFromEuler(new _n(s.tilt||0,h,s.roll||0,"YXZ")),u),g=this.track.nearest(o,a),x={id:(s.kind||"structure")+"-"+ ++this.serial,kind:s.kind||"structure",species:s.species,variant:s.variant,x:o,z:a,y:d.y,s:g.s,l:g.l,radius:s.radius??.28,w:s.w||.5,d:s.d||.5,h:s.h||1,yaw:h,solid:!!s.solid,urban:s.urban||!1,zone:this.track.zone(g.s).id,infrastructure:!!s.infrastructure};return x.infrastructure||this.track.objects.push(x),this.instance(t,p,x,s),x}instance(t,e,n,s={}){t.updateMatrixWorld(!0);let r=Math.floor(n.x/90)+","+Math.floor(n.z/90);t.traverse(o=>{if(!o.isMesh)return;let a=r+"|"+o.geometry.uuid+o.material.uuid+"|"+(s.range||850);this.batch.has(a)||this.batch.set(a,{tile:r,geo:o.geometry,material:o.material,mats:[],ids:[],tints:[],range:s.range||850,cast:s.cast!==!1});let c=this.batch.get(a);c.mats.push(new se().multiplyMatrices(e,o.matrixWorld)),c.ids.push(n),c.tints.push(s.tint??16777215)})}flush(){for(let t of this.batch.values()){let e=new wr(t.geo,t.material,t.mats.length);for(let n=0;n<t.mats.length;n++)e.setMatrixAt(n,t.mats[n]),e.setColorAt(n,new Zt(t.tints[n]));e.castShadow=t.cast,e.receiveShadow=!0,e.computeBoundingSphere(),e.userData.entities=t.ids,e.userData.range=t.range,this.scene.add(e),this.chunks.push(e)}this.batch.clear()}cull(t,e=!1,n=!1){for(let s of this.chunks){let r=s.boundingSphere,o=s.userData.range*(e?.64:1)+r.radius;s.visible=n||t.position.distanceToSquared(r.center)<o*o}}};function Ec(i,t=0){let e=new ne,n=di(6341+t*351),s=7.2+t*.61,r=.5+n()*.48,o=i.material,a=o("bark",10719606,.95),c=o("grain",5465399,.89);c.side=re;let l=new Hn([st(0,0,0),st(.04,s*.32,0),st(r*.36,s*.74,.12),st(r,s,.24)]),u=he(15,44,(v,M)=>{let _=l.getPoint(M),T=v*Math.PI*2,S=(.255*(1-M)+.13*M)*(1+.075*Math.sin(M*125));return _.add(st(S*Math.cos(T),0,S*Math.sin(T)))},!1);Pt(e,u,a);let h=l.getPoint(1),d=[],p=[],g=[],x=[],m=(v,M,_,T)=>{let S=st(Math.cos(v),0,Math.sin(v)),C=st(-Math.sin(v),0,Math.cos(v)),w=b=>h.clone().addScaledVector(S,M*b).add(st(0,Math.sin(b*Math.PI)*_-b*b*T,0)),y=Array.from({length:8},(b,E)=>w(E/7));Ne(e,y,.02,o("timber",8420416,.91),5);for(let b=0;b<28;b++)for(let E of[-1,1]){let I=.045+b/30,D=w(I),N=(.19+.61*Math.pow(Math.sin(I*Math.PI),.65))*(1+.18*n()),F=D.clone().addScaledVector(C,E*N*.52).addScaledVector(S,.14),L=D.clone().addScaledVector(C,E*N).addScaledVector(S,.3+.19*I).add(st(0,-N*(.26+.35*I),0)),Y=d.length/3,G=.046+.026*(1-I),z=[D.clone().addScaledVector(S,-G),D.clone().addScaledVector(S,G),F.clone().addScaledVector(S,-G*.78),F.clone().addScaledVector(S,G*.78),L],et=.71+n()*.29;for(let rt of z)d.push(rt.x,rt.y,rt.z),x.push(et,.86+et*.13,.73+et*.2);g.push(0,0,1,0,0,.55,1,.55,.5,1),p.push(Y,Y+1,Y+2,Y+2,Y+1,Y+3,Y+2,Y+3,Y+4)}};for(let v=0;v<19;v++){let M=v*2.39996+n()*.25,_=v/19;m(M,2.2+n()*.94-_*.7,.6+n()*.47+_*1.1,1.2-_*2.3+n()*.51)}let f=new ue;f.setAttribute("position",new kt(d,3)),f.setAttribute("color",new kt(x,3)),f.setAttribute("uv",new kt(g,2)),f.setIndex(p),f.computeVertexNormals(),Pt(e,f,c);for(let v=0;v<7;v++)un(e,h.x+Math.cos(v)*.17,h.y-.15-v%3*.09,h.z+Math.sin(v)*.17,.125,.19,.12,o("bark",7823673,.9),10);return We(e)}function hh(i,t){let e=new ne,n=i.groveShapes[t],s=new qe({map:i.groveMaps[t],normalMap:i.textures.finish.normalMap,roughnessMap:i.textures.finish.roughnessMap,normalScale:new ct(.035,.035),color:13818537,side:re,roughness:.92,alphaTest:.28});s.name="Copa e ramos costeiros "+t,js(s);for(let r=0;r<2;r++)for(let o=0;o<3;o++){let a=(1-o)*((r?n.x:n.z)/3),c=new He(1,1,4,4),l=c.attributes.uv,u=c.attributes.position,h=c.attributes.normal;for(let d=0;d<l.count;d++){l.setXY(d,(l.getX(d)+o)/3,(l.getY(d)+(r?0:1))/2);let p=u.getX(d),g=u.getY(d);h.setXYZ(d,p*.7,.89+Math.max(0,g)*.6,.3)}r?(c.rotateY(Math.PI/2),c.translate(a,n.y/2,0)):c.translate(0,n.y/2,a),Pt(e,c,s)}return We(e)}function Gd(i){let t=i.material,e=t("finish",5594457,.45,.67),n=t("pavers",14798e3,.92),s=t("timber",10254675,.96),r=t("plaster",15064779,.8),o=t("finish",10827300,.62),a=new ne;Pt(a,new hn(.074,.11,.82,12),r,0,.41),Pt(a,new hn(.081,.085,.115,12),o,0,.66),Pt(a,new hn(.082,.09,.037,12),e,0,.817);let c=new ne;for(let v of[-1.55,1.55]){let M=Se(c,0,.61,v,.11,1.22,.13,s);M.rotation.z=.028*Math.sign(v)}for(let v of[.41,.86])be(c,st(0,v,-1.55),st(0,v,1.55),.036,s,5);let l=new ne;be(l,st(0,0,0),st(0,5.9,0),.094,e,10,.052),Ne(l,[st(0,5.73,0),st(0,6.05,.07),st(0,6.15,.41),st(0,6.09,.68)],.052,e),un(l,0,6.06,.67,.13,.082,.28,e,14),un(l,0,6.016,.68,.109,.041,.249,r,12),Pt(l,new hn(.14,.21,.34,12),n,0,.17);let u=new ne,h=Ac("ESTREITO","#a92e20","#f5e9cf",{size:232});be(u,st(0,0,0),st(0,4.9,0),.047,e,10,.031);let d=he(12,8,(v,M)=>st(Math.sin(v*3+M*1.1)*v*.12,1.5+M*3.35-.23*v*v,-v*.92));Pt(u,d,h);let p=new ne;for(let v of[-.62,.62])Se(p,0,.22,v,.41,.44,.16,n);for(let v=0;v<4;v++)Se(p,-.17+v*.11,.47,0,.09,.079,1.86,s);for(let v=0;v<2;v++)Se(p,.24,.7+v*.16,0,.07,.12,1.8,s);let g=new ne;be(g,st(),st(.03,2.36,0),.037,s);let x=t("plaster",15324845,.89),m=t("plaster",11229495,.89);for(let v=0;v<12;v++){let M=he(4,5,(T,S)=>{let C=(v+T)*Math.PI/6,w=.016+S*1.22;return st(Math.cos(C)*w,2.38-S*.51-.07*Math.sin(T*Math.PI)*S,Math.sin(C)*w)}),_=v%2?x:m;_.side=re,Pt(g,M,_)}let f=new ne;for(let v of[-1.8,1.8])Se(f,0,.48,v,.11,.96,.16,e),Se(f,.057,.74,v,.028,.16,.08,r);return Pt(f,he(8,2,(v,M)=>st(.1+.048*Math.cos(v*4*Math.PI),.55+v*.37,(M-.5)*4),!0),e),Object.fromEntries(Object.entries({post:a,fence:c,lamp:l,flag:u,bench:p,parasol:g,rail:f}).map(([v,M])=>[v,We(M)]))}function Hd(i){let t=new ne,e=i.material,n=e("finish",3161148,.46,.63),s=e("finish",11809313,.45,.36),r=e("plaster",14340028,.88);for(let a of[-7.13,7.13]){Se(t,a,.28,0,.82,.56,1.29,r);for(let c of[-.36,.36])be(t,st(a,.5,c),st(a,5.18,c),.11,n,8);for(let c=0;c<5;c++)be(t,st(a,.6+c*.9,-.36),st(a,1.5+c*.9,.36),.042,s,6)}for(let a of[-.33,.33])for(let c of[5.1,5.96])be(t,st(-7.22,c,a),st(7.22,c,a),.063,n);for(let a=0;a<15;a++)be(t,st(-7+a,5.12,-.33),st(-6+a,5.95,-.33),.039,r,6);let o=Ac("C O S T A   D O U R A D A","#203533","#f1e6c9",{size:160,stretch:3.5});Se(t,0,5.55,.02,13.9,.94,.56,n);for(let a of[-.282,.319]){let c=Pt(t,new He(13.85,.87),o,0,5.55,a);a<0&&(c.rotation.y=Math.PI)}for(let a of[-5.75,5.75])for(let c=0;c<4;c++){let l=Se(t,a+c*.2,5.55,.333,.09,.7,.028,c%2?r:s);l.rotation.z=-.34}return We(t)}function Wd(i,t,e){let n=new Tc(t,i,e),s=Gd(e),r=n.rng,o=[],a=[Ec(e,0),Ec(e,1),Ec(e,2)],c=new ne,l=n.scan("cliff"),u=n.scan("grass",11577723),h=n.scan("shrub",10791548);for(let w=0;w<3;w++){let y=new Br(1,5),b=y.attributes.position,E=y.attributes.uv;for(let I=0;I<b.count;I++){let D=b.getX(I),N=b.getY(I),F=b.getZ(I),L=.89+.13*Math.sin(D*5+F*3+w)*Math.cos(N*4-F*4)+.065*Math.cos(D*13+N*8);b.setXYZ(I,D*L*(.31-w*.045)+.16*w-.12,Math.max(-.12,N*L*.19+.06)-w*.017,F*L*(.34-w*.04)+.14*Math.sin(w*2.31)),E.setXY(I,E.getX(I)*1.7,E.getY(I)*1.35)}y.computeVertexNormals(),Pt(c,y,e.material("rock",w%2?9800573:11314331,.76))}let d=[hh(e,0),hh(e,1)],p=i.frame(0),g=-155,x=i.zones[0].end;for(let w=g;w<x;w+=6.8){let y=i.frame(w),b=(i.shoreX(y.z)-y.x)/y.rx;if(r()<.78&&n.add(s.fence,w,b+9.2+r()*1.3,{kind:"prop",radius:1.59,yaw:-y.heading+.14*(r()-.5),range:245}),n.add(s.post,w,9.4+Math.sin(w*.039)*.27,{kind:"prop",radius:.12,range:225}),r()<.46&&n.add(s.fence,w,13+r()*1.7,{kind:"prop",radius:1.58,range:190}),r()<.47){let E=b+2-r()*7,I=2.9+r()*4.9,D=r()*6.28,N=n.add(c,w,E,{kind:"rock",radius:I*.48,scale:[I,1.16*I,I*.87],yaw:D,sink:-.13,range:410});o.push({x:N.x,z:N.z,r:I*.51})}for(let E of[-1,1])for(let I=0;I<3;I++){let D=E<0?13+r()*Math.max(4,Math.abs(b)-19):12+r()*45,N=w+r()*7,F=E*D,L=r()<.36&&E>0,Y=(L?1.5:1.1)+r()*(L?1.9:1.5);n.add(L?h:u,N,F,{kind:L?"shrub":"cover",species:L?"lentisco":"capim-das-dunas",radius:.53*Y,scale:[Y,Y*(L?1.17:.95),Y],yaw:r()*6.28,range:L?150:100})}}for(let w=g;w<x;w+=11+r()*8){let y=2+Math.floor(r()*4);for(let b=0;b<y;b++){let E=w+r()*17,I=19+r()*63,D=5.2+r()*8.2,N=Math.floor(r()*2);n.add(d[N],E,I,{kind:"tree",species:"\xE1rvore costeira",radius:D*.49,scale:[D,D*(.79+r()*.22),D],yaw:r()*6.28,range:730,tint:r()<.45?14935487:16777215})}}let m=i.frame(154),f=(i.shoreX(m.z)-m.x)/m.rx;for(let w=0;w<9;w++){let y=w===0?6.1:1.7+r()*4,b=w===0?0:r()*11-5.5,E=n.add(c,154+b,f-1.9+(w===0?0:r()*7-3.5),{kind:"rock",radius:y*.49,scale:[y,y*.98,y*.89],yaw:r()*6.28,sink:-.14,range:360});o.unshift({x:E.x,z:E.z,r:y*.42})}for(let w=-116;w<x;w+=19+r()*18){let y=r()<.48?-1:1,b=y*(12.7+r()*6);n.add(a[Math.floor(r()*3)],w,b,{kind:"tree",species:"palmeira",radius:3.5,scale:.84+r()*.43,yaw:r()*6.28,range:490}),r()<.5&&n.add(a[Math.floor(r()*3)],w+4+r()*4,b+y*3.4,{kind:"tree",species:"palmeira",radius:3.35,scale:.64+r()*.37,yaw:r()*6.28,range:490})}for(let w=-130;w<x;w+=30){n.add(s.lamp,w,10.4,{kind:"prop",radius:.72,range:460}),(w<140||w>445)&&n.add(s.flag,w+8,-9.9,{kind:"prop",radius:.97,range:320,yaw:-i.frame(w).heading+1.13}),w>-40&&w<355&&n.add(s.bench,w+12,-12.2,{kind:"prop",radius:1.03,range:190});let y=i.frame(w),b=(i.shoreX(y.z)-y.x)/y.rx;r()<.42&&w>30&&n.add(s.parasol,w+4,b+7.2,{kind:"prop",radius:1.3,scale:.86+r()*.2,yaw:r()*6,range:260})}let v=Hd(e),M={id:"gantry",kind:"structure",x:p.x,z:p.z};n.instance(v,new se().compose(i.point(0),i.quaternion(0),st(1,1,1)),M);let _=he(3,Math.ceil((x-g)/3),(w,y)=>{let b=i.frame(Ot(g,x,y)),E=-b.width/2-.18-w*3.45,I=b.x+E*b.rx,D=b.z+E*b.rz;return st(I,i.terrain.cast(I,D)+.041,D)}),T=_.attributes.uv;for(let w=0;w<T.count;w++)T.setXY(w,T.getX(w)*.8,T.getY(w)*(x-g)/4);let S=Pt(t,_,e.material("pavers",11772300,.9));S.castShadow=!1;let C=bx(i,t,e,o);return n.flush(),{sets:n,items:s,palms:a,reef:c,cliff:l,grass:u,shrub:h,groves:d,rocks:o,ocean:C}}function bx(i,t,e,n){let s=i.stations[0],r=i.data.points[i.zones[1].start][2],o={value:0},a=32,c=n.slice().sort((d,p)=>Math.abs(d.z-i.frame(154).z)-Math.abs(p.z-i.frame(154).z)).slice(0,a),l=Array.from({length:a},(d,p)=>{let g=c[p];return g?st(g.x,g.z,g.r):st(1e5,1e5,1)}),u=new ze({transparent:!0,depthWrite:!1,uniforms:{clock:o,sunDir:{value:Ri},skyTex:{value:e.sky},rockCenters:{value:l},origin:{value:new ct(s.x,s.z)},cliffZ:{value:r}},vertexShader:`varying vec3 pt;uniform float clock;
 void main(){pt=(modelMatrix*vec4(position,1.)).xyz;pt.y+=.047*sin(pt.z*.67+clock*1.1+pt.x*.25)+.061*sin(pt.x*.41+pt.z*.14-clock*.96);gl_Position=projectionMatrix*viewMatrix*vec4(pt,1.);}`,fragmentShader:`
 varying vec3 pt; uniform float clock,cliffZ;uniform vec2 origin;uniform vec3 sunDir,rockCenters[32];uniform sampler2D skyTex;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.13,311.77)))*43758.5453);}
 float noise(vec2 p){vec2 f=fract(p);f=f*f*(3.-2.*f);vec2 i=floor(p);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 float wave(vec2 p){float off=noise(p*.24+clock*.085)*2.4;return .064*sin(p.x*.63+p.y*.18+clock*1.16+off)+.039*sin(p.x*1.22-p.y*.49-clock*1.55+.85*sin(p.y*.34)+off)+.021*sin(p.x*2.94+p.y*1.62+clock*2.12+off*1.2)+.016*sin(p.x*4.65-p.y*2.71-clock*1.73)+.029*noise(p*2.6+clock*.31);}
 void main(){vec2 p=pt.xz;float sx=origin.x-36.+7.*sin((p.y-origin.y)*.016)+4.*sin((p.y+67.)*.034)+smoothstep(0.,1.,(cliffZ+14.-p.y)/239.)*78.+smoothstep(0.,1.,(cliffZ-150.-p.y)/480.)*160.;
 float dist=sx-p.x, depth=max(0.,dist*.123);vec3 view=normalize(cameraPosition-pt);float h=wave(p);
 float lod=1.-smoothstep(70.,260.,distance(cameraPosition,pt));vec3 n=normalize(vec3((h-wave(p+vec2(.13,0)))/.13,.85,(h-wave(p+vec2(0,.13)))/.13)*vec3(.37+lod*.63,1.,.37+lod*.63));
 vec3 r=reflect(-view,n);
 float f=.025+.75*pow(1.-max(0.,dot(view,n)),4.4);vec3 sky=mix(vec3(.71,.49,.34),vec3(.20,.38,.50),smoothstep(.035,.65,r.y));
 float gold=pow(max(0.,dot(r,sunDir)),mix(92.,305.,lod));
 vec3 water=mix(vec3(.080,.38,.30),vec3(.017,.13,.17),smoothstep(.1,3.9,depth));
 water*=.87+.18*noise(p*.095)+.035*sin(p.x*2.4+sin(p.y)+clock);
 vec3 col=mix(water,sky,f)+vec3(3.4,1.77,.70)*gold;
 float shore=dist+1.1*sin(p.y*.29+clock*.9)+.72*sin(p.y*.87-clock*.75)+.42*noise(p*.87);
 float foam=exp(-pow((shore-1.2)/1.4,2.))+.69*exp(-pow((shore-4.0-.9*sin(clock+p.y*.23))/.54,2.));
 if(depth<3.4 && lod>.0){for(int i=0;i<32;i++){vec3 rock=rockCenters[i];float rim=length((p-rock.xy)*vec2(1.,.90))-rock.z*.76+.18*sin(clock*1.3+p.y*2.2);foam=max(foam,exp(-abs(rim)*2.2));}}
 float fray=noise(p*4.3+vec2(clock*.39,0))*.36+noise(p*1.31-vec2(clock*.33,.0))*.36+noise(p*12.7+clock*.19)*.28;
 foam=smoothstep(.33,.92,foam*(.18+fray*1.33));col=mix(col,vec3(.98,.94,.82),foam*.82);
 col=mix(col,vec3(.60,.44,.34),smoothstep(200.,1750.,distance(cameraPosition,pt))*.69);
 gl_FragColor=vec4(col,clamp(.45+depth*.27+f*.6+foam*.52,.46,1.));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`}),h=new Me(new He(12500,9e3,200,150).rotateX(-Math.PI/2),u);return h.position.set(-2300,i.data.seaLevel+.026,-220),h.renderOrder=1,t.add(h),{update(d){o.value=d},mesh:h}}var Sx=[15124892,15114623,13948855,13097168,15916982,12297358,14463628,15454108],wx=[4741968,5203556,5465963,5786683,6254945,3558992,7823437,4876662],Tx=["Casa do Cais","Mercearia","Caf\xE9 Mar\xE9","Pens\xE3o Lume","Padaria","Oficina","Livraria","Mercado"];function Xd(i,t){let e=new ne,n=di(7e3+t*529),s=i.material,r=6.5+t%4*.69,o=5.6+t%3*.77,a=t===3||t===6?3:2,c=a*2.88+.35,l=o*.5,u=s(t===5?"stone":"plaster",Sx[t],.94),h=s("plaster",15851454,.85),d=s("stone",10655872,.95),p=s("tiles",t%2?11761236:10576199,.91),g=s("timber",wx[t],.83),x=s("timber",5719095,.85),m=s("finish",4344646,.57,.52),f=s("finish",4744039,.27,.39),v=s("plaster",3750710,.94),M=(y,b,E,I,D=u,N=l,F=.22)=>Se(e,y,b,N,E,I,F,D);Se(e,0,c/2-.6,-.14,r,c+1.2,o-.31,u),M(0,-.16,r+.2,.53,d,l+.03,.35);let _=t===0||t===5?2:3,T=r/_,S=1.07;for(let y=0;y<a;y++){let b=y*2.88+.14,E=b+2.31;for(let I=0;I<_;I++){let D=-r/2+T*(I+.5),N=y===0&&I===(t%2?_-1:0),F=N?b:b+.85,L=N?1.1:S,Y=E;for(let G of[-1,1])M(D+G*(T+L)/4,b+1.45,(T-L)/2+.012,2.9);M(D,(Y+b+2.9)/2,L+.012,b+2.9-Y),N||M(D,(b+F)/2,L+.012,F-b),M(D,(Y+F)/2,L,Y-F,N?x:f,l+.004,.05);for(let G of[-1,1])if(M(D+G*(L/2+.037),(Y+F)/2,.082,Y-F+.15,h,l+.13,.1),!N){M(D+G*(L*.5+.235),(Y+F)/2,.33,Y-F+.035,g,l+.113,.107);for(let z=0;z<4;z++)M(D+G*(L*.5+.235),F+.23+z*.27,.276,.025,x,l+.174,.035)}if(M(D,Y+.047,L+.23,.12,h,l+.16,.16),M(D,F-.003,L+.29,.109,h,l+.175,.26),N){for(let G=0;G<3;G++)M(D,F+.44+G*.54,.77,.37,x,l+.066,.046);un(e,D+.34,F+1.04,l+.127,.045,.039,.045,m,10);for(let G=0;G<2;G++)Se(e,D,.03+G*.078,l+.33-G*.13,1.43-G*.12,.106,.49-G*.09,d)}else if(M(D,(Y+F)/2,.041,Y-F,g,l+.075,.044),M(D,Y-.31,L,.042,g,l+.075,.044),y===1&&(I+t)%2===0){let G=l+.6;Se(e,D,F-.04,G,1.6,.17,.85,h);for(let z=0;z<7;z++)be(e,st(D-.73+z*.245,F,G+.37),st(D-.73+z*.245,F+.72,G+.37),.016,m,5);be(e,st(D-.78,F+.74,G+.37),st(D+.78,F+.74,G+.37),.028,m,6);for(let z of[-1,1])be(e,st(D+z*.76,F+.73,G+.37),st(D+z*.76,F+.73,l+.12),.024,m,6)}}M(0,b+2.78,r+.13,.1,h,l+.08,.33)}for(let y of[-1,1])for(let b=0;b<2;b++)for(let E=0;E<a;E++){let I=y*(r/2+.018),D=.2+1.55+E*2.88,N=-o*.25+b*o*.48;Se(e,I,D,N,.095,1.4,1.02,h),Se(e,I+y*.055,D,N,.035,1.2,.86,f),Se(e,I+y*.075,D-.1,N,.039,.039,.86,g)}let C=1.02+t%3*.27,w=.35;for(let y of[-1,1]){let b=he(40,12,(D,N)=>{let F=(D-.5)*(r+2*w),L=y*(l+w)*N;return st(F,c+C*(1-N)+.044*Math.cos(D*2*Math.PI*24),L)},y<0),E=b.attributes.uv;for(let D=0;D<E.count;D++)E.setXY(D,E.getX(D)*2.6,E.getY(D)*1.4);let I=p;I.side=re,Pt(e,b,I),Se(e,0,c-.015,y*(l+w-.02),r+w*2,.137,.12,x)}for(let y of[-1,1]){let b=he(2,8,(E,I)=>st(y*r/2,c+C*(1-Math.abs(2*E-1))*I,(E-.5)*o),y<0);u.side=re,Pt(e,b,u)}if(be(e,st(-r*.5-w,c+C,0),st(r*.5+w,c+C,0),.105,p,10),Se(e,r*.27,c+C*.83,-o*.21,.53,1.04,.51,d),Se(e,r*.27,c+C*.83+.54,-o*.21,.68,.13,.65,h),t%3!==0){let y=s("plaster",t%2?10445638:6454900,.85),b=r*.71;for(let I=0;I<8;I++){let D=(I-3.5)*b/8,N=he(2,5,(L,Y)=>st(D+(L-.5)*b/8,2.81-.29*Y-.08*Y*Y,l+.11+.9*Y)),F=I%2?y:h;F.side=re,Pt(e,N,F),Se(e,D,2.34,l+.99,b/8,.19,.025,F)}let E=Ac(Tx[t],"#324b46","#f0dfbc",{size:228,stretch:1.5});Pt(e,new He(r*.66,.48),E,0,3.22,l+.156)}return We(e),{root:e,w:r,d:o,h:c+C}}function qd(i){let t=new ne,e=i.material,n=e("plaster",15848356,.92),s=e("stone",14338214,.95),r=e("tiles",11889991,.86),o=e("finish",6903612,.65,.69);Se(t,-3,4,-3,9.5,9,12,s);for(let l of[-1,1]){let u=he(6,3,(h,d)=>st(-3+l*h*5.12,10.28-h*2.03,-9.5+d*13),l===-1);r.side=re,Pt(t,u,r)}Se(t,3.4,7.5,0,3.95,15.8,4,n);for(let l of[1.1,8,13.8,15.2])Se(t,3.4,l,0,4.25,.27,4.3,s);for(let l of[1.84,4.96])for(let u of[-1.56,1.56])Se(t,l,17.02,u,.81,3.69,.82,s);for(let l of[-1.9,1.9]){let u=new ci;u.absarc(0,0,1.48,0,Math.PI,!1),u.lineTo(-1.08,0),u.absarc(0,0,1.08,Math.PI,0,!0),u.closePath();let h=new wi(u,{depth:.31,bevelEnabled:!1,curveSegments:18});Pt(t,h,n,3.4,17.12,l)}let a=new Ji([[.24,.62],[.39,.43],[.48,-.04],[.67,-.4],[.7,-.49],[.59,-.49]].map(([l,u])=>new ct(l,u)),30);Pt(t,a,o,3.4,17,0),be(t,st(3.4,17.5,0),st(3.4,18.64,0),.082,o),Se(t,3.4,18.84,0,4.54,.36,4.52,s);let c=new Er(3.03,3.23,4);return c.rotateY(Math.PI/4),Pt(t,c,r,3.4,20.6),be(t,st(3.4,22.18,0),st(3.4,23.55,0),.057,o),be(t,st(3.01,23.12,0),st(3.79,23.12,0),.049,o),We(t)}function Yd(i,t,e){let n=new ne,s=i.material,r=di(1234+t.length*741+e*81),o=s("bark",t==="oliveira"?11840658:10257514,.96),a=t==="cipreste",c=t==="pinheiro-manso",l=a?9:c?9.7:5.1,u=i.groveMaps[(e+1)%2],h=new qe({map:u,normalMap:i.textures.finish.normalMap,roughnessMap:i.textures.finish.roughnessMap,color:c?12110745:a?9809545:14540982,alphaTest:.26,side:re,roughness:.96,normalScale:new ct(.035,.035)});js(h);let d=(x,m,f,v)=>be(n,x,m,f,o,9,v),p=st(.18+.31*r(),l*(c?.57:a?.71:.39),.12);d(st(0,-.14,0),p,c?.32:.23,.14);let g=a?5:c?6:5;for(let x=0;x<g;x++){let m=x*2.4+r()*.48,f=x/(g-1),v=a?.29:(c?2.31:1.56)*(.57+.49*r()),M=st(Math.cos(m)*v,a?l*(.27+.65*f):l*(.66+.13*f),Math.sin(m)*v),_=st(Ot(p.x,M.x,.49),Ot(p.y,M.y,.64),Ot(p.z,M.z,.55));d(p,_,.12,.08),d(_,M,.085,.025);let T=a?1.8-f*.96:(c?4.2:3.3)*(.78+r()*.37),S=a?2.9-f*.65:(c?2.1:2.4)*(.83+.27*r());for(let C=0;C<3;C++){let w=new He(T,S,3,3),y=w.attributes.uv,b=w.attributes.normal;for(let E=0;E<y.count;E++){let I=y.getX(E),D=y.getY(E);y.setXY(E,(I*.89+.055+(x+C)%3)/3,(.38+D*.6+(C+x)%2)/2),b.setXYZ(E,(I-.5)*.6,.94,.29)}w.rotateY(C*Math.PI/3+m),w.translate(M.x,M.y+S*.23,M.z),Pt(n,w,h)}}return We(n)}function Cc(i,t,e,n,s,r,o,a=.045){let c=he(4,Math.max(3,Math.ceil((n-e)/2)),(h,d)=>{let p=Ot(e,n,d),g=t.frame(p),x=Ot(s,r,h),m=g.x+g.rx*x,f=g.z+g.rz*x;return st(m,t.terrain.cast(m,f)+a,f)}),l=c.attributes.uv;for(let h=0;h<l.count;h++)l.setXY(h,l.getX(h)*(r-s)/3,l.getY(h)*(n-e)/3);o.side=re;let u=Pt(i,c,o);return u.castShadow=!1,u}function Ax(i,t,e){let n=t.bridge,s=e.material,r=s("stone",13613467,.94),o=s("pavers",14537141,.89),a=s("finish",7108464,.61,.58),c=t.frame(n.start).width/2+.98,l=3,u=(n.end-n.start)/l,h=g=>-8.2+6.45*Math.pow(Math.max(0,Math.sin(g*Math.PI)),.66);function d(g){let x=g.attributes.uv,m=g.attributes.position;for(let f=0;f<x.count;f++)x.setXY(f,(m.getX(f)*.59+m.getZ(f)*.81)/3.1,m.getY(f)/3.1);return r.side=re,Pt(i,g,r)}for(let g=0;g<=l;g++){let x=n.start+u*g,m=g===0||g===l?1.15:.87;for(let f of[-c,c]){let v=he(4,8,(M,_)=>{let T=x+(M-.5)*m*2,S=t.point(T,f),C=Math.min(t.terrain.cast(S.x,S.z)-.36,S.y-8.55);return S.y=Ot(C,S.y-.16,_),S});d(v)}for(let f of[-1,1]){let v=he(12,8,(M,_)=>{let T=t.point(x+f*m,Ot(-c,c,M)),S=Math.min(t.terrain.cast(T.x,T.z)-.36,T.y-8.55);return T.y=Ot(S,T.y-7.63,_),T});d(v)}}for(let g=0;g<l;g++){let x=n.start+g*u,m=he(24,4,(f,v)=>t.point(x+u*f,Ot(-c,c,v),h(f)));d(m)}for(let g of[-1,1]){let x=g*c;for(let f=0;f<l;f++){let v=n.start+u*f;for(let M of[-.28,.28]){let _=he(22,3,(T,S)=>t.point(v+T*u,x+M,Ot(h(T),-.12,S)),g===1);d(_)}}let m=[];for(let f=n.start-1;f<=n.end+1;f+=2.3){let v=t.point(f,x,.03),M=t.point(f,x,1.01);be(i,v,M,.059,a,8),m.push(M)}Ne(i,m,.073,o,8),Ne(i,m.map(f=>f.clone().add(st(0,-.44,0))),.04,a,6)}let p=t.roadGeometry(-c,c,-.14,n.start-.5,n.end+.5,1.4);Pt(i,p,r)}function Zd(i,t,e,n){let{sets:s,items:r,grass:o,shrub:a,groves:c,cliff:l,reef:u}=n,h=s.rng,d=e.material,p=i.zones[1],g=i.zones[2],x=i.zones[3],m=["pinheiro-manso","oliveira","cipreste"],f=Object.fromEntries(m.map(z=>[z,[Yd(e,z,0),Yd(e,z,1)]])),v=Array.from({length:8},(z,et)=>Xd(e,et)),M=d("pavers",13154724,.91),_=new ne,T=new ne,S=d("finish",9016203,.49,.67),C=d("finish",5792865,.65,.55);S.side=re;let w=new ne,y=new ne,b=js(new qe({map:e.bushMap,normalMap:e.textures.finish.normalMap,roughnessMap:e.textures.finish.roughnessMap,side:re,roughness:.95,alphaTest:.22,color:15855561})),E=js(new qe({map:e.wildGrass,normalMap:e.textures.grain.normalMap,roughnessMap:e.textures.grain.roughnessMap,side:re,alphaTest:.27,color:14735017}));for(let z=0;z<7;z++){let et=new He(1.35,1.08,2,2);et.rotateY(z*2.4),et.translate(Math.sin(z*2.4)*.15,.32,Math.cos(z*2.4)*.14),Pt(w,et,b);let rt=new He(1.85,1.19);rt.rotateY(z*1.97),rt.translate(Math.cos(z)*.36,.48,Math.sin(z)*.36),Pt(y,rt,E)}We(w),We(y);let I=(z,et,rt="shrub")=>{let Mt=rt==="cover"?.88+h()*1.17:1.96+h()*2.6;s.add(rt==="cover"?y:w,z,et,{kind:rt,species:rt==="cover"?"gram\xEDnea":"lentisco",radius:Mt*.72,scale:[Mt,Mt*(rt==="shrub"?.87:.81),Mt],yaw:h()*6.28,range:rt==="cover"?105:185,tint:h()<.4?13813413:16777215})};for(let z=p.s+2;z<p.end;z+=5.4){let et=i.frame(z),rt=et.curve>0?-1:1,Mt=z-2.7,_t=Math.min(p.end,z+2.7),Gt=rt*(et.width/2+.61),Ht=he(4,8,(xt,Et)=>i.point(Ot(Mt,_t,xt),Gt+rt*.061*Math.cos(Et*4*Math.PI),.55+Et*.32));Pt(T,Ht,S);let Q=i.point(z,Gt+rt*.12,.86),ot=i.terrain.cast(Q.x,Q.z);if(be(T,st(Q.x,ot-.09,Q.z),Q,.065,C,7),Math.floor((z-p.s)/5.4)%2===0&&s.add(r.post,z+1,rt*(9.5+h()),{kind:"prop",radius:.12,range:190}),h()<.39){let xt=7+h()*9,Et=-rt*(17+xt*.5+h()*6);s.add(l,z,Et,{kind:"rock",radius:xt*.51,scale:[xt,xt*(1.45+h()),xt*.9],yaw:Math.PI*.5-et.heading+(h()-.5)*.74,sink:-.64,range:640})}if(I(z+(h()-.5)*3,rt*(12+h()*20),h()<.55?"cover":"shrub"),h()<.66){let xt=h()<.5?-1:1;s.add(c[Math.floor(h()*2)],z+2,xt*(17+h()*40),{kind:"tree",species:"\xE1rvore costeira",radius:4.4,scale:5+h()*5.6,yaw:h()*6.28,range:550})}}We(T),t.add(T);for(let z=p.s+8;z<p.end;z+=20)s.add(r.fence,z,i.frame(z).curve>0?-12:12,{kind:"prop",radius:1.59,range:205});for(let z of[-1,1])Cc(t,i,g.s-8,g.end+7,z*5.46,z*10.5,M,.094);let D=13.05,N=Math.ceil((g.end-g.s)/D),F=g.s+164;for(let z of[-1,1])for(let et=0;et<N;et++){let rt=g.s+4+et*D+(z===-1?3.2:0)+(h()-.5)*1.2;if(rt>=g.end-1)continue;let Mt=(et*3+(z===1?2:5)+Math.floor(h()*3))%8,_t=v[Mt],Gt=z===1&&Math.abs(rt-F)<23?24:15.5+h()*2.3,Ht=i.frame(rt),Q=Math.atan2(-z*Ht.rx,-z*Ht.rz);s.add(_t.root,rt,z*Gt,{kind:"house",urban:!0,variant:Mt,solid:!0,w:_t.w+.49,d:_t.d+1.1,h:_t.h,radius:Math.hypot(_t.w+.49,_t.d+1.1)/2,yaw:Q,range:680});let ot=Mt===0||Mt===5?2:3,xt=Mt%2?ot-1:0,Et=-_t.w/2+(xt+.5)*_t.w/ot,Tt=rt-z*Et;if(Cc(_,i,Tt-.79,Tt+.79,z*10.1,z*(Gt-_t.d/2+.1),M,.093),et%6===2){let Xt=rt+D*.51;Cc(t,i,Xt-1.8,Xt+1.8,z*6.05,z*31,M,.145)}if(et%3===0?s.add(r.lamp,rt+2.2,z*9.8,{kind:"prop",radius:.73,range:330}):s.add(r.bench,rt+3.4,z*10.18,{kind:"prop",radius:.97,range:150}),et%3===1||et%6===0){let Xt=z*(26+h()*4);s.add(f.cipreste[et%2],rt+4.7,Xt,{kind:"tree",species:"cipreste",radius:2.2,scale:.77+h()*.29,yaw:h()*6.28,range:450})}et%4===0&&I(rt+4.9,z*12.1)}Cc(t,i,F-14.4,F+14.4,6.3,21.6,M,.15);let L=i.frame(F);s.add(qd(e),F,36.3,{kind:"landmark",solid:!0,radius:7.8,w:12.8,d:11.2,h:23.55,yaw:Math.atan2(-L.rx,-L.rz),range:1400});for(let z=0;z<3;z++)s.add(r.bench,F-9+z*8,18,{kind:"prop",radius:1,range:180,yaw:-L.heading-.5}),s.add(c[z%2],F-10+z*10,20.3,{kind:"tree",species:"\xE1rvore costeira",radius:2.9,scale:4.8,yaw:h()*6.28,range:450});for(let z=g.s+1;z<g.end;z+=11.1)s.add(r.post,z,(Math.floor(z)%2?1:-1)*9.3,{kind:"prop",radius:.12,range:110});We(_),t.add(_),Ax(t,i,e);for(let z=x.s;z<x.end;z+=100){let et=Math.min(x.end,z+100),rt=[];for(let _t=z+.65;_t<et-.35;_t+=1)i.onBridge(_t)||rt.push(_t);if(!rt.length)continue;let Mt=(_t,Gt)=>rt[Math.min(rt.length-1,Math.floor((_t+.12+.75*h())/Gt*rt.length))];for(let _t of["tree","shrub","cover"]){let Gt=Math.ceil({tree:62,shrub:100,cover:155}[_t]*rt.length/100);for(let Ht=0;Ht<Gt;Ht++){let Q=Mt(Ht,Gt),ot=(Ht+Math.floor((z-x.s)/100))%2?-1:1,xt=(_t==="tree"?15.1:12.1)+h()*(_t==="tree"?22.2:22.9);if(_t==="tree"){let Et=h(),Tt=Et<.49?m[0]:Et<.78?m[1]:m[2],Xt=.73+h()*.61;s.add(f[Tt][Math.floor(h()*2)],Q,ot*xt,{kind:_t,species:Tt,radius:(Tt===m[0]?4.2:3.2)*Xt,scale:Xt,yaw:h()*6.28,range:520,tint:h()<.28?14277051:16777215})}else I(Q,ot*xt,_t)}}for(let _t=0;_t<rt.length*.38;_t++){let Gt=_t%2?1:-1,Ht=8+h()*8;s.add(c[_t%2],Mt(_t,Math.ceil(rt.length*.38)),Gt*(35+h()*96),{kind:"tree",species:"\xE1rvore costeira",radius:Ht*.48,scale:[Ht,Ht*(.95+h()*.2),Ht],yaw:h()*6.28,range:720})}}for(let z=x.s;z<x.end;z+=6.5){let et=Math.floor(z/6.5)%2?1:-1;i.onBridge(z)||(s.add(r.post,z,et*9.4,{kind:"prop",radius:.13,range:140}),!i.onBridge(z)&&h()<.56&&s.add(r.fence,z,et*(12.7+h()*3),{kind:"prop",radius:1.58,range:170}))}for(let z of[i.bridge.start-13,i.bridge.start-4,i.bridge.end+4,i.bridge.end+13])for(let et of[-1,1])s.add(z===i.bridge.start-4||z===i.bridge.end+4?r.lamp:r.flag,z,et*10.6,{kind:"prop",radius:.98,range:350});let Y=[d("plaster",14865588,.87),d("plaster",9978414,.88)],G=new ne;for(let z of i.stations)if(!(Math.abs(z.curve)<.0068))for(let et of[-1,1]){let rt=z.width*.5*et,Mt=i.roadGeometry(rt-et*.34,rt,.028,z.s,z.s+i.step,i.step),_t=Pt(G,Mt,Y[Math.floor(z.s/i.step)%2]);_t.material.side=re,_t.castShadow=!1}return We(G),t.add(G),s.flush(),{plaza:F,homes:v,trees:f}}function Jd(i,t,e){let n=new Map,s=new Set,r=[],o=new Map;i.traverse(m=>{if(m.isMesh){for(let f of Array.isArray(m.material)?m.material:[m.material])s.add(f);for(let f of m.userData.entities||[])f.infrastructure||f.s===void 0||(n.set(f.id,f),o.has(f.id)||o.set(f.id,new Set),o.get(f.id).add(m.geometry.uuid))}});let a=[...n.values()],c=[],l=[],u=[],h=(m,f)=>m.filter(v=>v.kind===f).length,d=a.filter(m=>m.kind==="house"&&m.zone==="vila"&&Math.abs(m.l)<30),p=[...new Set(a.filter(m=>m.kind==="tree").map(m=>m.species))];for(let m of t.zones.slice(2))for(let f=m.s;f<m.end;f+=100){let v=Math.min(m.end,f+100),M=v-f,_=M>99.999,T=m.id==="bosque",S=Math.max(f,t.bridge.start),C=Math.min(v,t.bridge.end),w=T?Math.max(0,C-S):0,y=M-w,b=a.filter(I=>I.s>=f&&I.s<v&&Math.abs(I.l)<=(T?40:30)),E={zone:m.id,start:f,end:v,complete:_,eligibleMetres:y,L:y,f:y/100,excluded:w?[{geometry:"bridge deck, track.json",start:S,end:C}]:[],fronts:b.filter(I=>I.urban&&I.kind==="house").length,trees:h(b,"tree"),shrubs:h(b,"shrub"),cover:h(b,"cover"),species:[...new Set(b.filter(I=>I.species).map(I=>I.species))],uniqueInstances:b.map(I=>I.id),quota:T?{trees:Math.ceil(16*y/100-1e-8),shrubs:Math.ceil(10*y/100-1e-8),cover:Math.ceil(12*y/100-1e-8)}:{fronts:12}};if(_)for(let[I,D]of Object.entries(E.quota))E[I]<D&&u.push(m.id+" "+Math.round(f)+" "+I+" = "+E[I]+" / "+D);c.push(E)}for(let m=0;m<t.length;m+=100){let f=Math.min(m+100,t.length),v=a.filter(M=>M.s>=m&&M.s<f&&M.kind==="prop");l.push({from:m,to:f,count:v.length}),f-m>99.9&&v.length<12&&u.push("Props at "+m+" = "+v.length)}(d.length<60||new Set(d.map(m=>m.variant)).size<5||p.length<4)&&u.push("Insufficient buildings or species");for(let m of d)(o.get(m.id)?.size||0)<2&&r.push(m.id);let g=e.map(m=>{let f=0,v=0,M=new Set;return m.root.traverse(_=>{!_.isMesh||_===m.root||(v++,f+=(_.geometry.index?.count??_.geometry.attributes.position.count)/3,M.add(_.material.uuid))}),{name:m.root.name,lod0Triangles:f,materials:M.size,meshes:v}});g.some(m=>m.lod0Triangles<15e3||m.materials<6||m.meshes<2)&&u.push("Car mesh/material audit");let x=[];for(let m of s)if(!(m.isShaderMaterial||m.emissiveIntensity>0&&m.emissive?.getHex()>0||m.name==="Vidro fum\xEA")){!m.map&&!m.normalMap&&x.push("Flat material "+m.name);for(let f of[m.map,m.normalMap,m.roughnessMap,m.alphaMap].filter(Boolean)){let v=f.image;v&&Math.min(v.width,v.height)<1024&&x.push("Small texture "+f.name)}}return(r.length||x.length)&&u.push(...r,...new Set(x)),{length:t.length,zones:t.zones,bridge:t.bridge,units:d.length,architecturalVariants:new Set(d.map(m=>m.variant)).size,treeSpecies:p,objects:a.length,cars:g,windows:c,props:l,issues:u,instances:a.map(({id:m,kind:f,s:v,l:M,species:_,variant:T,x:S,y:C,z:w})=>({id:m,kind:f,s:v,l:M,species:_,variant:T,x:S,y:C,z:w}))}}function $d(i,t,e,n,s){let a=new ln(256,144),c=new Uint8Array(256*144*4),l=t.background,u=i.getRenderTarget(),h=i.getClearColor(new Zt),d=i.getClearAlpha();n.visible=!1,t.background=new Zt(16711935),i.setRenderTarget(a),i.render(t,e),i.readRenderTargetPixels(a,0,0,256,144,c);let p=document.createElement("canvas");p.width=256,p.height=144;let g=p.getContext("2d");g.drawImage(s,0,0,256,144);let x=g.getImageData(0,0,256,144).data,m=0;for(let f=0;f<144;f++)for(let v=0;v<256;v++){let M=4*(f*256+v);c[M]>251&&c[M+1]<4&&c[M+2]>251&&(m+=1-x[4*((143-f)*256+v)+3]/255)}return i.setRenderTarget(u),t.background=l,n.visible=!0,i.setClearColor(h,d),a.dispose(),m/(256*144)}var Kd=["Voc\xEA","Lia Neri","Tom Vidal","Noa Reis","Ivo Mar","Luz Serra"];function ro(i,t,e,n,s){let r=t.progress;if(r.finished||n<=e||n-e>1.2)return!1;let o=i.checkpoints[r.next],a=Ue(o.s-Ue(e,i.length),i.length);return a>n-e+1e-7||a<1e-9?!1:(r.next===0&&(r.started&&(r.times.push(s-r.lapStart),r.laps++,r.best=Math.min(r.best,r.times.at(-1))),r.started=!0,r.lapStart=s),r.next=(r.next+1)%i.checkpoints.length,!0)}var so=class{constructor(t,e={}){this.track=t,this.reset(e)}reset(t=this.opts){this.opts={laps:3,difficulty:"normal",...t},this.time=0,this.intro=0,this.phase="grid",this.log=[],this.passes=0,this.contactCooldown=0,this.pairOrder=new Map;let e=[[-17,-2],[-3,-2],[-6,2],[-10,-2],[-13,2],[-21,2]];this.cars=e.map(([n,s],r)=>{let o=Ci(this.track,n,s);return o.driver=r,o.homeLane=s,o.targetLane=s,o.laneHold=0,o.maxIdle=0,o.maxOff=0,o.lastTrack={s:o.s,l:s,distance:n},o.progress={next:0,laps:0,started:!1,lapStart:0,best:1/0,times:[],finished:0},o}),this.eventsSeen=new Array(6).fill(0),this.lastSlip=!1,this.inBridge=!1,this.maxCameraIntrusions=0}event(t,e,n={}){this.log.push({t:this.time,type:t,driver:e.driver,s:e.s,...n})}order(){return[...this.cars].sort((t,e)=>e.distance-t.distance)}position(t=this.cars[0]){return this.order().indexOf(t)+1}pilot(t){let e={facil:.88,normal:.99,dificil:1.075}[this.opts.difficulty]??1,n=[1,.918,.948,1.015,.987,1.048][t.driver],s=48,r=t.targetLane,o=this.track.frame(t.s),a=this.cars.filter(c=>c!==t&&c.distance>t.distance&&c.distance-t.distance<27&&Math.abs(c.l-t.l)<2.35).sort((c,l)=>c.distance-l.distance)[0];if(t.laneHold=Math.max(0,t.laneHold-Un),a&&t.laneHold<=0){let l=[-3.27,0,3.27].filter(u=>Math.abs(a.l-u)>2.16).filter(u=>!this.cars.some(h=>h!==t&&Math.abs(h.distance-t.distance)<9.2&&Math.abs(h.l-u)<1.92));l.sort((u,h)=>Math.abs(u-t.l)-Math.abs(h-t.l)),l.length?(r=l[0],t.laneHold=2.3+t.driver%3*.33):s=Math.max(7,a.speed-.3)}else!a&&t.laneHold<=0&&(r=le(t.homeLane+Math.sin(t.s*.014+t.driver)*.48+o.curve*42,-3.35,3.35));return t.targetLane=r,Ks(this.track,t,r,e*n,s)}testPilot(){let t=this.cars[0],e=t.s<110?1.7:Math.sin(t.s*.009)*2.2,n=this.cars.slice(1).filter(s=>s.distance>t.distance&&s.distance-t.distance<17&&Math.abs(s.l-e)<1.8).sort((s,r)=>s.distance-r.distance)[0];return n&&(e=n.l>0?-2.65:2.65),Ks(this.track,t,e,1.011)}step(t,e=!1){if(this.phase==="paused"||this.phase==="results")return;if(this.phase==="grid"||this.phase==="countdown"){this.intro+=Un,this.phase=this.intro<4.9?"grid":this.intro<7.9?"countdown":"race";return}this.time+=Un,this.contactCooldown=Math.max(0,this.contactCooldown-Un);for(let o of this.cars){let a=o.distance,c=o.driver?this.pilot(o):t;Mc(this.track,o,c,Un,e),o.maxIdle=Math.max(o.maxIdle,o.stalled),o.maxOff=Math.max(o.maxOff,o.off),Math.abs(o.l)<this.track.frame(o.s).width/2-.75&&o.speed>.5&&(o.lastTrack.s=o.s,o.lastTrack.l=o.l,o.lastTrack.distance=o.distance),(o.off>3||o.stalled>3)&&(o.s=o.lastTrack.s,o.distance=o.lastTrack.distance,o.l=le(o.lastTrack.l,-2.4,2.4),o.y=this.track.surface(o.s,o.l),o.angle=0,o.latSpeed=0,o.speed=0,o.off=0,o.stalled=0,this.event("recovery",o));for(let l=this.eventsSeen[o.driver];l<o.events.length;l++){let u=o.events[l];this.event(u.type,o,{strength:u.strength})}this.eventsSeen[o.driver]=o.events.length,ro(this.track,o,a,o.distance,this.time)&&o.progress.laps>=this.opts.laps&&!o.progress.finished&&(o.progress.finished=this.time)}for(let o=0;o<this.cars.length;o++)for(let a=o+1;a<this.cars.length;a++){let c=this.cars[o],l=this.cars[a],u=l.distance-c.distance,h=l.l-c.l,d=Math.sign(u)||1,p=o+"-"+a;if(this.pairOrder.has(p)&&this.pairOrder.get(p)!==d&&(o>0?this.passes++:this.event("pass",c,{other:a})),this.pairOrder.set(p,d),Math.abs(u)>=4.19||Math.abs(h)>=1.85)continue;let g=Math.sign(h)||1,x=1.85-Math.abs(h),m=4.19-Math.abs(u),f=Math.max(.36,Math.abs(c.speed-l.speed),Math.abs(c.latSpeed-l.latSpeed));if(x<m)c.l-=g*x*.5,l.l+=g*x*.5,c.latSpeed-=g*f*.16,l.latSpeed+=g*f*.16;else{let v=u>0?c:l,M=u>0?l:c,_=Math.max(0,v.speed-M.speed);v.speed=Math.max(0,v.speed-.64*_),M.speed+=_*.32,c.distance-=d*m*.5,l.distance+=d*m*.5,c.s=Ue(c.distance,this.track.length),l.s=Ue(l.distance,this.track.length)}this.contactCooldown===0&&(this.event("collision",c,{other:l.driver,strength:f}),this.contactCooldown=.43)}let n=this.cars[0],s=n.slip>.15;s&&!this.lastSlip&&this.event("skid",n),this.lastSlip=s;let r=this.track.onBridge(n.s);r&&!this.inBridge&&this.event("bridge",n),this.inBridge=r,n.progress.finished&&(this.phase="results")}pause(){["race","grid","countdown"].includes(this.phase)&&(this.beforePause=this.phase,this.phase="paused")}resume(){this.phase==="paused"&&(this.phase=this.beforePause)}results(){return this.order().map(t=>({driver:t.driver,time:t.progress.finished||this.time+Math.max(0,this.opts.laps*this.track.length-t.distance)/Math.max(10,t.distance/Math.max(1,this.time)),projected:!t.progress.finished})).sort((t,e)=>t.time-e.time)}};var uh=["ext-idle","ext-low","ext-mid","ext-high","int-idle","int-low","int-mid","int-high","tyre","gravel","impact","surf","town","forest"];async function jd(i=()=>{}){let t={},e=uh.length,n=0;return await Promise.all(uh.map(async s=>{let r=await fetch("./assets/audio/"+s+".mp3");if(!r.ok)throw Error("\xC1udio "+s);t[s]=await r.arrayBuffer(),i(++n/e)})),t}function Ex(i,t,e){let n=e.startsWith("ext-")||e.startsWith("int-"),s=["surf","forest","town"].includes(e),r=t.sampleRate,o=Math.min(Math.floor(t.length*.025),Math.floor(r*(s?1.2:.12))),a=Math.min(t.length-o,Math.floor(r*(n?4:s?23:e==="impact"?1.15:5.5))),c=Math.min(Math.floor(a*.095),Math.round(r*(s?.38:.055))),l=a-c,u=i.createBuffer(1,l,r),h=u.getChannelData(0),d=new Float32Array(a);for(let m=0;m<t.numberOfChannels;m++){let f=t.getChannelData(m);for(let v=0;v<a;v++)d[v]+=f[o+v]/t.numberOfChannels}let p=0,g=0;for(let m=0;m<l;m++)h[m]=m<c?Ot(d[l+m],d[m],m/c):d[m],p+=h[m]*h[m],g=Math.max(g,Math.abs(h[m]));let x=Math.min((n?.245:s?.15:.18)/Math.max(.003,Math.sqrt(p/l)),.95/Math.max(.01,g));for(let m=0;m<l;m++)h[m]*=x;return u}var Rc=class{constructor(t){this.raw=t,this.ctx=null,this.buffers={},this.nodes=[],this.transients=new Set,this.masterVolume=.78,this.effectsVolume=.87,this.musicVolume=.3,this.muted=!1,this.maxVoices=0,this.activeAI=0,this.maxAI=0,this.logIndex=0}async unlock(){return this.ready?(await this.ctx.resume(),this.ready):(this.ctx=new AudioContext({sampleRate:48e3,latencyHint:"interactive"}),this.ready=this.ctx.resume().then(()=>this.initialize()),this.ready)}async initialize(){let t=this.ctx;this.bus={};let e=t.createGain(),n=t.createDynamicsCompressor(),s=t.createWaveShaper(),r=t.createGain();n.threshold.value=-8,n.knee.value=3,n.ratio.value=18,n.attack.value=.003,n.release.value=.1;let o=new Float32Array(4097);for(let d=0;d<o.length;d++){let p=d/2048-1;o[d]=.867*Math.tanh(1.35*p)}s.curve=o;for(let d of["player","ai","effects","ambient","ui","music"]){let p=t.createGain();this.bus[d]=p,p.connect(e)}this.master=r,e.connect(r).connect(n).connect(s),this.post=s,s.connect(t.destination),this.media=t.createMediaStreamDestination(),s.connect(this.media),await t.audioWorklet.addModule("./assets/audio/pcm-worklet.js"),this.tap=new AudioWorkletNode(t,"master-pcm",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2]});let a=t.createGain();a.gain.value=0,s.connect(this.tap).connect(a).connect(t.destination),this.tap.port.onmessage=d=>{d.data.pcm&&this.pcm?.push(d.data.pcm),d.data.end&&this.finishPCM?.(d.data.peak)},await Promise.all(uh.map(async d=>{this.buffers[d]=Ex(t,await t.decodeAudioData(this.raw[d].slice(0)),d)}));let c=t.createBuffer(1,96e3,t.sampleRate),l=c.getChannelData(0),u=0,h=19321;for(let d=0;d<l.length;d++)h=1664525*h+1013904223>>>0,u=(u+.11*(h/2147483648-1))*.94,l[d]=u*.97;this.buffers.wind=c,this.setVolumes(),this.prepared=!0}setVolumes(){if(!this.master)return;let t=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.muted?0:this.masterVolume,t,.025),this.bus.effects.gain.setTargetAtTime(this.effectsVolume,t,.05),this.bus.music.gain.setTargetAtTime(this.musicVolume,t,.05)}loop(t,e,n=!1,s="lowpass"){let r=this.ctx,o=r.createBufferSource(),a=r.createGain(),c=r.createBiquadFilter();o.buffer=this.buffers[t],o.loop=!0,a.gain.value=0,c.type=s,c.frequency.value=15e3,c.Q.value=.52,o.connect(c).connect(a);let l;n?(l=r.createPanner(),l.panningModel="equalpower",l.distanceModel="inverse",l.refDistance=7,l.maxDistance=95,l.rolloffFactor=1,a.connect(l).connect(this.bus[e])):a.connect(this.bus[e]),o.start();let u={src:o,gain:a,filter:c,pan:l,key:t};return this.nodes.push(u),u}start(t=0){if(!this.prepared)return;this.stop(),this.style=t,this.logIndex=0,this.maxVoices=0,this.maxAI=0,this.lastStage="",this.lastBell=-40;let e=t?"int-":"ext-",n=t?"ext-":"int-";this.layers=["idle","low","mid","high"].map(s=>[this.loop(e+s,"player"),this.loop(n+s,"player")]),this.ai=Array.from({length:5},(s,r)=>this.loop(r%2?"int-mid":"ext-mid","ai",!0)),this.roll=this.loop("gravel","effects"),this.skid=this.loop("tyre","effects"),this.scrape=this.loop("impact","effects"),this.air=this.loop("wind","ambient"),this.zones=[this.loop("surf","ambient"),this.loop("wind","ambient"),this.loop("town","ambient"),this.loop("forest","ambient")],this.initialVoices=this.nodes.length}stop(){for(let t of this.nodes)t.src.stop(),t.src.disconnect(),t.filter.disconnect(),t.gain.disconnect(),t.pan?.disconnect();for(let t of this.transients)t.stop(),t.disconnect();this.transients.clear(),this.nodes=[],this.activeAI=0}tone(t,e=.1,n=.1,s="ui"){if(!this.prepared)return;let r=this.ctx,o=r.currentTime,a=r.createOscillator(),c=r.createGain();a.type="sine",a.frequency.value=t,c.gain.setValueAtTime(1e-4,o),c.gain.exponentialRampToValueAtTime(n,o+.009),c.gain.exponentialRampToValueAtTime(1e-4,o+e),a.connect(c).connect(this.bus[s]),this.transients.add(a),a.start(o),a.stop(o+e+.01),a.onended=()=>{a.disconnect(),c.disconnect(),this.transients.delete(a)}}hit(t){let e=this.ctx,n=e.createGain(),s=e.createBufferSource();s.buffer=this.buffers.impact,s.playbackRate.value=.77+Math.min(t,9)*.045,n.gain.value=le(.09+t*.045,.1,.62),s.connect(n).connect(this.bus.effects),s.start(e.currentTime,.025,.47),this.transients.add(s),s.onended=()=>{s.disconnect(),n.disconnect(),this.transients.delete(s)}}update(t){if(!this.prepared||!this.nodes.length)return;let e=t.cars[0],n=this.ctx.currentTime,s=t.track,r=!["paused","results"].includes(t.phase);for(let S of["player","ai","ambient"])this.bus[S].gain.setTargetAtTime(r?1:.012,n,.07);this.bus.effects.gain.setTargetAtTime(r?this.effectsVolume:.008,n,.04);let o=(S,C,w=1,y=15e3)=>{S.gain.gain.setTargetAtTime(C,n,.055),S.src.playbackRate.setTargetAtTime(le(w,.35,2.45),n,.032),S.filter.frequency.setTargetAtTime(y,n,.047)},a=e.rpm,c=[1050,2400,4100,6300],l=0;for(;l<2&&a>c[l+1];)l++;let u=le((a-c[l])/(c[l+1]-c[l]),0,1);for(let S=0;S<4;S++){let C=S===l?Math.cos(u*Math.PI/2):S===l+1?Math.sin(u*Math.PI/2):0,w=(this.style?.94:1.02)*a/c[S],y=e.shift>.035?.41:1;o(this.layers[S][0],C*(.58+.45*e.throttle)*y,w,3200+7500*e.throttle),o(this.layers[S][1],C*(.18+.39*(1-e.throttle))*y,w*.99,2400+2300*(1-e.throttle))}let h=s.frame(e.s),d=s.point(e.s,e.l),p=this.ctx.listener;for(let[S,C]of[["positionX",d.x],["positionY",e.y+1],["positionZ",d.z],["forwardX",h.tx],["forwardY",0],["forwardZ",h.tz],["upX",0],["upY",1],["upZ",0]])p[S]&&p[S].setTargetAtTime(C,n,.027);this.activeAI=0;for(let S=0;S<5;S++){let C=t.cars[S+1],w=s.point(C.s,C.l),y=this.ai[S],b=w.distanceTo(d),E=b>87?0:.29*(1-Cx(53,88,b));E>.002&&this.activeAI++,y.pan.positionX.setTargetAtTime(w.x,n,.033),y.pan.positionY.setTargetAtTime(C.y+.62,n,.033),y.pan.positionZ.setTargetAtTime(w.z,n,.033),o(y,E,C.rpm/4100*(1+le((C.speed-e.speed)/340,-.075,.075)*Math.sign(e.distance-C.distance)),5800)}this.maxAI=Math.max(this.maxAI,this.activeAI);let g=Math.abs(e.l)>h.width/2-.45,x=s.onBridge(e.s),m=Math.abs(h.curve)>.0068&&Math.abs(e.l)>h.width/2-.85;o(this.roll,le(e.speed/36,0,1)*(g?.23:x?.19:m?.14:.061),g?.77:x?1.33:1.02,g?4700:x?1450:m?2200:710),o(this.skid,Math.min(.52,e.slip*.48),.81+Math.min(.53,e.slip*.28),6400),o(this.scrape,e.wall*.19,.62,2200),o(this.air,.027+e.speed*.0024,1+e.speed*.008,540+e.speed*26);let f=s.zone(e.s),v=s.zones.indexOf(f),M=e.s-f.s,_=le(M/28,0,1);for(let S=0;S<4;S++){let C=S===v?_:S===(v+3)%4?1-_:0;o(this.zones[S],C*(S===2?.26:.34),1,S===2?1900:11500)}if(v===2&&t.time-this.lastBell>16&&r){for(let[S,C]of[[392,.075],[783,.035],[1078,.02]])this.tone(S,1.08,C,"ambient");this.lastBell=t.time}for(let S=this.logIndex;S<t.log.length;S++){let C=t.log[S];(C.type==="collision"&&(C.driver===0||C.other===0)||C.type==="barrier"&&C.driver===0)&&this.hit(C.strength||1)}this.logIndex=t.log.length;let T=t.phase==="countdown"?String(Math.max(1,Math.ceil(7.9-t.intro))):t.phase;T!==this.lastStage&&(["1","2","3","race","results"].includes(T)&&this.tone(T==="race"?940:T==="results"?1174:510,T==="race"?.29:.13,.16),this.lastStage=T),this.maxVoices=Math.max(this.maxVoices,this.nodes.length+this.transients.size)}beginPCM(){this.pcm=[],this.tap.port.postMessage("start")}endPCM(){return new Promise(t=>{this.finishPCM=e=>{let n=this.pcm.reduce((l,u)=>l+u.length,0),s=new ArrayBuffer(44+n*2),r=new DataView(s),o=(l,u)=>{for(let h=0;h<u.length;h++)r.setUint8(l+h,u.charCodeAt(h))};o(0,"RIFF"),r.setUint32(4,36+n*2,!0),o(8,"WAVE"),o(12,"fmt "),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,2,!0),r.setUint32(24,this.ctx.sampleRate,!0),r.setUint32(28,this.ctx.sampleRate*4,!0),r.setUint16(32,4,!0),r.setUint16(34,16,!0),o(36,"data"),r.setUint32(40,n*2,!0);let a=new Int16Array(s,44),c=0;for(let l of this.pcm)a.set(l,c),c+=l.length;this.pcm=null,t({blob:new Blob([s],{type:"audio/wav"}),seconds:n/(2*this.ctx.sampleRate),peakDB:20*Math.log10(Math.max(e,1e-12)),sampleRate:this.ctx.sampleRate})},this.tap.port.postMessage("stop")})}};function Cx(i,t,e){let n=le((e-i)/(t-i),0,1);return n*n*(3-2*n)}var dh=(i,t=!0)=>{if(!Number.isFinite(i))return"\u2014:\u2013\u2013";let e=Math.floor(i%60);return Math.floor(i/60)+":"+String(e).padStart(2,"0")+(t?"."+String(Math.floor(i%1*1e3)).padStart(3,"0"):"")},Rx={arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',back:'<path d="m14 5-7 7 7 7"/>',gear:'<path d="m10 3-1 3-3 1-2-1-2 4 3 2v2l-2 2 2 4 3-1 2 1 1 2h4l1-3 2-1 3 1 2-4-3-2v-2l2-2-2-4-3 1-2-1-1-2Z"/><circle cx="12" cy="12" r="3"/>',sound:'<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',mute:'<path d="m3 9 4 0 5-4v14l-5-4H3zm13 1 5 5m0-5-5 5"/>',pause:'<path d="M8 5v14m8-14v14"/>',flag:'<path d="M5 21V4m1 1c5-5 8 5 15 0l-2 9c-5 4-8-5-13-1"/>',mountain:'<path d="m2 18 8-13 4 6 2-3 6 10zM7 10l3 2 2-3"/>',track:'<path d="M6 18C0 15 5 5 9 6s2 5 6 4 8-2 6 3-6 0-8 3-5 6-7 2Z"/>',pin:'<path d="M18 10c0 4-6 10-6 10S6 14 6 10a6 6 0 1 1 12 0Z"/><circle cx="12" cy="10" r="2"/>',car:'<path d="m3 15 1-6 3-1 2-3h6l3 4 3 1v5z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>',game:'<path d="M7 6h10c3 0 6 10 3 12-2 1-4-3-6-3h-4c-3 0-4 4-6 3C1 16 4 6 7 6Z"/><path d="M8 9v5m-2-2h5m5-1h.1m2 2h.1"/>',close:'<path d="m5 5 14 14m0-14L5 19"/>'},Qs=i=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+Rx[i]+"</svg>",Ix='<div class="brand"><span class="brandmark"><i></i><i></i><i></i></span><b>ESTREITO</b><small>RACING</small></div>',Nn=(i,t,e="",n="")=>'<button data-act="'+i+'" class="'+e+'">'+(n?Qs(n):"")+t+"</button>";function Qd(i){let t=i.stations.filter((c,l)=>l%7===0),e=t.map(c=>c.x),n=t.map(c=>c.z),s=Math.min(...e),r=Math.min(...n),o=Math.max(...e)-s,a=Math.max(...n)-r;return{xy:c=>[12+(c.x-s)/a*116,12+(c.z-r)/a*116],pts:t,w:24+116*o/a,h:140}}function Px(i){let t=Qd(i),e=t.pts.map(r=>t.xy(r).map(o=>o.toFixed(1)).join(",")).join(" "),[n,s]=t.xy(t.pts[0]);return'<svg class="course" viewBox="0 0 '+t.w+' 140" aria-label="Tra\xE7ado da Costa Dourada"><polygon points="'+e+'" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><circle cx="'+n+'" cy="'+s+'" r="3.9" fill="#ff7542"/></svg>'}function tf(i,t,e,n,s){let r="",o="",a="",c="",l=!1,u=_=>s(_,M);i.addEventListener("click",_=>{let T=_.target.closest("button[data-act]");if(!T)return;let S=T.dataset.act;if(S!=="mute"&&n.tone(560,.055,.065),S==="settings"||S==="controls"){c=r,a=S,v();return}if(S==="close"){a="",v();return}if(S==="mute"){n.muted=!n.muted,n.setVolumes(),v();return}if(S.startsWith("choose:")){let[,C,w]=S.split(":");e[C]=["car","color","laps"].includes(C)?Number(w):w,u("change-"+C),v();return}u(S)}),i.addEventListener("input",_=>{let T=_.target.dataset.volume;T&&(n[T]=Number(_.target.value)/100,n.setVolumes(),_.target.nextElementSibling.textContent=_.target.value+"%",u("volume"))});let h=()=>"<header>"+Ix+'<div class="top-actions">'+Nn("mute",'<span class="sr">Som</span>',"icon-btn",n.muted?"mute":"sound")+Nn("settings",'<span class="sr">Configura\xE7\xF5es</span>',"icon-btn","gear")+"</div></header>",d=()=>"<footer><span>"+Qs("pin")+" Santa Lume <i></i> Litoral mediterr\xE2neo</span>"+Nn("controls",Qs("game")+" Controles","foot-control")+"</footer>",p=(_,T)=>Nn(_,"<span>"+T+"</span>"+Qs("arrow"),"primary"),g=(_="menu")=>Nn(_,"Voltar","back","back"),x=(_,T)=>'<div class="kicker"><i></i>'+_+'</div><h1 class="sub-title">'+T+"</h1>",m=(_,T)=>'<div class="choices">'+T.map(([S,C])=>'<button data-act="choose:'+_+":"+S+'" aria-pressed="'+(e[_]===S)+'" class="'+(e[_]===S?"selected":"")+'">'+C+"</button>").join("")+"</div>";function f(){return'<dl class="bindings"><div><dt>Acelerar</dt><dd>\u2191 / W <em>RT</em></dd></div><div><dt>Frear</dt><dd>\u2193 / S <em>LT</em></dd></div><div><dt>Ester\xE7ar</dt><dd>\u2190 \u2192 / A D <em>Anal\xF3gico E</em></dd></div><div><dt>Alternar c\xE2mera</dt><dd>C <em>Y</em></dd></div><div><dt>Pausar</dt><dd>Esc / P <em>Menu</em></dd></div></dl>'}function v(){i.className=r+(a?" with-dialog":""),i.dataset.screen=r;let _="";if(r==="menu")_=h()+'<section class="menu-copy"><div class="kicker"><i></i> Grande pr\xEAmio costeiro</div><h1 class="event-title">Costa<br><em>Dourada</em></h1><div class="event-info"><span>'+Qs("track")+" 2,97 km</span><i></i><span>"+Qs("car")+" 6 pilotos</span></div>"+p("garage","Entrar na garagem")+'</section><aside class="route-card">'+Px(t)+"<div><small>Circuito</small><strong>Santa Lume</strong><span>Asfalto \xB7 P\xF4r do sol</span></div></aside>"+d();else if(r==="garage"){let T=wc[e.car];_=h()+'<section class="side-panel">'+g()+x("Garagem","Seu carro")+'<div class="car-select">'+wc.map((S,C)=>'<button class="'+(C===e.car?"chosen":"")+'" data-act="choose:car:'+C+'"><small>'+S.type+"</small><b>"+S.name+"</b></button>").join("")+'</div><div class="label">Pintura <span>'+Sc[e.color].name+'</span></div><div class="swatches">'+Sc.map((S,C)=>'<button data-act="choose:color:'+C+'" class="'+(C===e.color?"active":"")+'" style="--paint:#'+S.hex.toString(16).padStart(6,"0")+'" aria-label="'+S.name+'" aria-pressed="'+(C===e.color)+'"></button>').join("")+"</div>"+p("setup","Configurar corrida")+"</section>"+d()}else if(r==="setup")_=h()+'<section class="side-panel">'+g("garage")+x("Costa Dourada","Configurar corrida")+'<div class="label">Voltas</div>'+m("laps",[[3,"3 voltas"],[6,"6 voltas"]])+'<div class="label">Dificuldade</div>'+m("difficulty",[["facil","F\xE1cil"],["normal","Normal"],["dificil","Dif\xEDcil"]])+'<div class="label">Qualidade gr\xE1fica</div>'+m("quality",[["low","Baixa"],["high","Alta"]])+p("start","Ir para o grid")+"</section>"+d();else if(r==="race")_='<div class="race-tools">'+Nn("pause",'<span class="sr">Pausar corrida</span>',"icon-btn","pause")+"</div>";else if(r==="paused")_=h()+'<section class="side-panel">'+x("Costa Dourada","Corrida pausada")+p("resume","Continuar")+Nn("restart","Reiniciar corrida","secondary")+Nn("menu","Voltar ao menu","secondary")+"</section>";else if(r==="results"){let T=M.race;_=h()+'<section class="results-panel">'+x("Bandeirada final","Resultados")+'<div class="result-meta">Costa Dourada \xB7 '+e.laps+' voltas</div><ol class="classification">'+T.results().map((S,C)=>'<li class="'+(S.driver?"":"is-player")+'"><b>'+String(C+1).padStart(2,"0")+"</b><span>"+Kd[S.driver]+"</span><time>"+(S.projected?"\u2248 ":"")+dh(S.time)+"</time></li>").join("")+"</ol>"+p("restart","Correr de novo")+Nn("menu","Voltar ao menu","secondary")+"</section>"}a&&(_+='<div class="veil"><section class="dialog" role="dialog" aria-modal="true" aria-label="'+(a==="settings"?"Configura\xE7\xF5es":"Controles")+'">'+Nn("close",'<span class="sr">Fechar</span>',"icon-btn x","close")+x("Estreito Racing",a==="settings"?"Configura\xE7\xF5es":"Controles"),a==="settings"?_+='<div class="label">Qualidade gr\xE1fica</div>'+m("quality",[["low","Baixa"],["high","Alta"]])+'<div class="sliders">'+[["masterVolume","Geral"],["effectsVolume","Efeitos"],["musicVolume","M\xFAsica"]].map(([T,S])=>"<label>"+S+'<input type="range" min="0" max="100" data-volume="'+T+'" value="'+Math.round(n[T]*100)+'"><output>'+Math.round(n[T]*100)+"%</output></label>").join("")+"</div>"+Nn("controls","Ver controles","secondary"):_+=f(),_+="</section></div>"),i.innerHTML=_}let M={get page(){return r},get panel(){return a},race:null,show(_){r=_,a="",v()},render:v,escape(){a?(a="",v()):r==="race"?u("pause"):r==="paused"?u("resume"):r==="setup"?u("garage"):r==="garage"&&u("menu")},confirm(){let _=a?i.querySelector(".dialog"):i;document.activeElement?.matches("button")&&_.contains(document.activeElement)?document.activeElement.click():(_.querySelector(".primary")||_.querySelector("button"))?.click()},move(_){let T=[...(a?i.querySelector(".dialog"):i).querySelectorAll("button,input")];if(!T.length)return;let S=T.indexOf(document.activeElement);T[(S+_+T.length)%T.length].focus()}};return M}function ef(i,t){let e=i.getContext("2d"),n=Qd(t),s=new Path2D;return n.pts.forEach((r,o)=>{let[a,c]=n.xy(r);o?s.lineTo(a,c):s.moveTo(a,c)}),s.closePath(),(r,o=!0)=>{let a=i.width,c=i.height;if(e.clearRect(0,0,a,c),!o)return;let l=Math.max(.62,Math.min(c/860,a/1400)),u=a/l,h=c/l;e.save(),e.scale(l,l);let d=r.cars[0],p=d.progress,g=(m,f,v,M=15,_="#f8f4e9",T=600,S="left")=>{e.textAlign=S,e.fillStyle=_,e.font=T+" "+M+'px "Bahnschrift","Arial Narrow",Arial',e.fillText(m,f,v)},x=(m,f,v,M)=>{let _=e.createLinearGradient(m,f,m+v,f);_.addColorStop(0,"rgba(13,21,24,.88)"),_.addColorStop(1,"rgba(20,30,34,.50)"),e.fillStyle=_,e.fillRect(m,f,v,M)};if(r.phase==="grid"){g("GRID DE LARGADA",27,h-64,12,"#ffab75",750),g("Costa Dourada",26,h-29,33),e.restore();return}x(24,24,169,83),e.fillStyle="#ff7749",e.fillRect(24,24,4,83),g("POSI\xC7\xC3O",39,47,11,"#d2d2ca",700),g(String(r.position()).padStart(2,"0"),38,88,40,"#fff8ed",800),g("/ 06",96,86,18,"#bdc4bc"),g("VOLTA",139,47,11,"#d2d2ca",700),g(Math.min(r.opts.laps,p.laps+1)+"/"+r.opts.laps,139,80,22),x(u-249,24,190,66),g("VOLTA ATUAL",u-235,48,10,"#d4d0c5"),g(dh(r.time-p.lapStart),u-70,48,16,"#fff9e8",650,"right"),g("MELHOR",u-235,74,10,"#d4d0c5"),g(dh(p.best),u-70,75,16,"#ffc494",650,"right"),e.save(),e.translate(43,h-157),e.lineCap="round",e.lineJoin="round",e.lineWidth=6.8,e.strokeStyle="rgba(15,23,24,.66)",e.stroke(s),e.lineWidth=2.4,e.strokeStyle="#e6e1ce",e.stroke(s);for(let m of[...r.cars.slice(1),d]){let[f,v]=n.xy(t.frame(m.s));e.beginPath(),e.arc(f,v,m===d?4.7:2.8,0,Math.PI*2),e.fillStyle=m===d?"#ff6b38":"#f5eac4",e.fill()}if(e.restore(),x(u-211,h-110,184,83),g(Math.round(d.speed*3.6).toString().padStart(3,"0"),u-201,h-52,46,"#fff7ea",800),g("KM/H",u-198,h-35,10,"#d5cec1",650),g("MARCHA",u-73,h-81,9,"#dfd5c9",600,"center"),g(d.gear,u-73,h-45,32,"#ff9060",750,"center"),e.fillStyle="#575b55",e.fillRect(u-210,h-114,184,4),e.fillStyle=d.rpm>6070?"#ff542b":"#ffa15b",e.fillRect(u-210,h-114,184*d.rpm/7e3,4),r.phase==="countdown"||r.phase==="race"&&r.time<.85){let m=r.phase==="countdown"?String(Math.max(1,Math.ceil(7.9-r.intro))):"VAI";e.shadowColor="rgba(0,0,0,.6)",e.shadowBlur=16,g(m,u/2,h*.4,91,"#ffefe2",850,"center")}e.restore()}}function nf(i,t){let n=new Float32Array(288),s=new Float32Array(96),r=new Float32Array(288),o=new Float32Array(96),a=di(731),c=new ue;c.setAttribute("position",new Pe(n,3)),c.setAttribute("pSize",new Pe(s,1)),c.setAttribute("color",new Pe(r,3));let l=new ze({vertexColors:!0,transparent:!0,depthWrite:!1,vertexShader:"attribute float pSize;varying vec3 tint;void main(){tint=color;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=pSize*410./max(.1,-p.z);}",fragmentShader:"varying vec3 tint;void main(){vec2 q=gl_PointCoord-.5;float d=dot(q,q);float a=.19*smoothstep(.25,.015,d);if(a<.006)discard;gl_FragColor=vec4(tint,a);}"}),u=new Tr(c,l);u.frustumCulled=!1,i.add(u);let h=0,d=0;return{clear(){o.fill(0),s.fill(0),u.visible=!1},update(p,g){if(u.visible=!0,d+=g*27,d>=1){d%=1;for(let x of p){let m=Math.abs(x.l)>t.frame(x.s).width/2-.4;if(x.speed<6||!m&&x.slip<.2)continue;let f=h++%96,v=t.point(x.s-1.4,x.l+(a()<.5?-.8:.8),.21);n.set(v.toArray(),f*3),o[f]=1,r.set(m?[.55,.43,.3]:[.55,.56,.56],f*3)}}for(let x=0;x<96;x++)o[x]>0?(o[x]-=g*.94,n[x*3]+=.22*g,n[x*3+1]+=.65*g,s[x]=Math.max(0,.11+(1-o[x])*.78)*Math.min(1,Math.max(0,o[x])*4)):s[x]=0;c.attributes.position.needsUpdate=c.attributes.pSize.needsUpdate=c.attributes.color.needsUpdate=!0}}}function sf(i,t){let e=document.createElement("a"),n=URL.createObjectURL(i);e.href=n,e.download=t,e.click(),setTimeout(()=>URL.revokeObjectURL(n),1e4)}function rf(i,t,e){let n=document.createElement("canvas");n.width=1920,n.height=1080;let s=n.getContext("2d",{alpha:!1}),r=n.captureStream(30);for(let u of e.media.stream.getAudioTracks())r.addTrack(u);let o=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"].find(u=>MediaRecorder.isTypeSupported(u)),a=new MediaRecorder(r,{mimeType:o,videoBitsPerSecond:64e5,audioBitsPerSecond:128e3}),c=[];a.ondataavailable=u=>{u.data.size&&c.push(u.data)};let l=()=>{s.drawImage(i,0,0,1920,1080),s.drawImage(t,0,0,1920,1080)};return l(),e.beginPCM(),a.start(1e3),{draw:l,async finish(){let u=new Promise(p=>a.onstop=p);a.stop();let h=await e.endPCM();return await u,r.getVideoTracks().forEach(p=>p.stop()),{video:new Blob(c,{type:"video/webm"}),audio:h.blob,seconds:h.seconds,peakDB:h.peakDB,sampleRate:h.sampleRate,videoType:a.mimeType,maxVoices:e.maxVoices,maxAI:e.maxAI}}}}function of(i){let t=new ln(8,8,{type:yn,minFilter:Be,magFilter:Be});t.depthTexture=new Yi(8,8,Xn);let e={colorBuffer:{value:t.texture},depth:{value:t.depthTexture},inverseP:{value:new se},projection:{value:new se},travel:{value:st()},bodies:{value:Array.from({length:6},()=>new Ae)},sunUV:{value:new ct},texel:{value:new ct}},n=new ze({uniforms:e,depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 at;void main(){at=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`varying vec2 at;uniform sampler2D colorBuffer,depth;uniform mat4 inverseP,projection;uniform vec3 travel;uniform vec4 bodies[6];uniform vec2 sunUV,texel;
  void main(){
    vec3 c=texture2D(colorBuffer,at).rgb;float z=texture2D(depth,at).r;
    vec4 vp=inverseP*vec4(at*2.-1.,z*2.-1.,1.);vec4 old=projection*vec4(vp.xyz/vp.w+travel,1.);
    vec2 motion=clamp(at-(old.xy/old.w*.5+.5),vec2(-.011),vec2(.011));
    float mask=0.;for(int i=0;i<6;i++){vec4 body=bodies[i];mask=max(mask,step(body.x,at.x)*step(at.x,body.z)*step(body.y,at.y)*step(at.y,body.w));}
    vec3 blur=(texture2D(colorBuffer,at-motion*.33).rgb+texture2D(colorBuffer,at-motion*.72).rgb)*.5;
    c=mix(c,blur,(1.-mask)*.61*step(z,.9997));
    vec3 bright=max(texture2D(colorBuffer,at+texel*2.5).rgb-vec3(1.4),0.)+max(texture2D(colorBuffer,at-texel*2.5).rgb-vec3(1.4),0.);
    c+=bright*.012;
    if(sunUV.x>0.&&sunUV.x<1.&&sunUV.y>0.&&sunUV.y<1.&&texture2D(depth,sunUV).r>.9998){
      vec2 q=(at-sunUV)*vec2(1.76,1.);float haze=exp(-dot(q,q)*90.);
      vec2 g=(at-(.5+(.5-sunUV)*.53))*vec2(1.76,1.);float ghost=exp(-dot(g,g)*620.);
      c+=vec3(.066,.032,.012)*haze+vec3(.010,.013,.011)*ghost;
    }
    gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`}),s=new qi,r=new ue;r.setAttribute("position",new kt([-1,-1,0,3,-1,0,-1,3,0],3));let o=new Me(r,n);o.frustumCulled=!1,s.add(o);let a=new Xi,c=new ct,l=[];for(let u of[-1.09,1.09])for(let h of[-.04,1.57])for(let d of[-2.39,2.39])l.push(st(u,h,d));return(u,h,d,p,g,x)=>{i.getDrawingBufferSize(c),(t.width!==c.x||t.height!==c.y)&&(t.setSize(c.x,c.y),e.texel.value.set(1/c.x,1/c.y)),h.updateMatrixWorld(),e.inverseP.value.copy(h.projectionMatrixInverse),e.projection.value.copy(h.projectionMatrix),e.travel.value.set(g.tx,g.grade,g.tz).transformDirection(h.matrixWorldInverse).multiplyScalar(p.speed*.0105);for(let f=0;f<d.length;f++){let v=e.bodies.value[f],M=d[f].root;if(v.set(1,1,0,0),!!M.visible){M.updateWorldMatrix(!0,!1);for(let _ of l){let T=_.clone().applyMatrix4(M.matrixWorld).project(h);if(T.z>=1||T.z<-1)continue;let S=T.x*.5+.5,C=T.y*.5+.5;v.x=Math.min(v.x,S-.002),v.z=Math.max(v.z,S+.002),v.y=Math.min(v.y,C-.002),v.w=Math.max(v.w,C+.002)}}}x&&e.bodies.value[0].set(0,0,1,.34);let m=h.position.clone().addScaledVector(Ri,950).project(h);e.sunUV.value.set(m.x*.5+.5,m.z<=1?m.y*.5+.5:-1),i.setRenderTarget(t),i.render(u,h),i.setRenderTarget(null),i.render(s,a)}}var os=new URLSearchParams(location.search).has("verify"),bh=os||["localhost","127.0.0.1"].includes(location.hostname),Sh=document.querySelector("#scene"),Ii=document.querySelector("#instruments"),Pi=document.querySelector("#ui");Pi.innerHTML='<div class="loader"><div class="brand"><span class="brandmark"><i></i><i></i><i></i></span><b>ESTREITO</b><small>RACING</small></div><progress max="1" value="0"></progress><span>Preparando Costa Dourada</span></div>';var wh=Pi.querySelector("progress"),lf=0,hf=0,af=()=>{wh.value=.05+.66*lf+.13*hf},[Dx,mo,Lx]=await Promise.all([fetch("./track.json").then(i=>i.json()),Bd(i=>{lf=i,af()}),jd(i=>{hf=i,af()})]),yt=new yc(Dx),Le=new Rc(Lx),on={car:0,color:0,laps:3,difficulty:"normal",quality:"high"};try{if(!os){let i=JSON.parse(localStorage.getItem("estreito-settings")||"{}");Object.assign(on,i.options||{});for(let t of["masterVolume","effectsVolume","musicVolume","muted"])t in i&&(Le[t]=i[t])}}catch{}var Di=new gc({canvas:Sh,antialias:!0,preserveDrawingBuffer:os,powerPreference:"high-performance"}),tn=new qi,pe=new Ke(62,innerWidth/innerHeight,.19,4500),tr=Od(tn,Di,mo),xw=Vd(yt,tn,mo),_h=Wd(yt,tn,mo),Ux=Zd(yt,tn,mo,_h),Uc=nf(tn,yt),fh=tn.fog,uf=of(Di);yt.solids=yt.objects.filter(i=>i.solid);yt.collisionBins=new Map;for(let i of yt.objects.filter(t=>t.solid||t.kind==="tree"))for(let t of[-17,0,17]){let e=Math.floor(Ue(i.s+t,yt.length)/25);yt.collisionBins.has(e)||yt.collisionBins.set(e,[]),yt.collisionBins.get(e).push(i)}var ph=bh?yt.validateWorld():null;if(ph&&!ph.ok)throw Error(JSON.stringify(ph));var Fn=Ud(yt,pe),ho=ef(Ii,yt),Wt=new so(yt,on),bn=new Set,Pc=new Map,Ze=[],oo=null,df=null,Li=!1,co=!1,Dc=!1,Sn=0,ao=null,xh=!1,lo=null,po=performance.now(),uo=0,rs=0,er=st();var cf=[],vh=Ci(yt,-9,-1.97),mh=[],fo=null,Th=0,gh=!1,Nx=(i,t)=>{let e=i+"-"+t;if(!Pc.has(e)){let n=kd(mo,i,t,lh[t]);n.root.visible=!1,Pc.set(e,n),tn.add(n.root)}return Pc.get(e)};function Nc(){for(let t of Pc.values())t.root.visible=!1;Ze=[on.color,...Array.from({length:6},(t,e)=>e).filter(t=>t!==on.color)].map((t,e)=>Nx(e===0?on.car:e%2,t))}Nc();wh.value=.91;var ee=tf(Pi,yt,on,Le,ff);ee.race=Wt;var Fx=()=>{if(!os)try{localStorage.setItem("estreito-settings",JSON.stringify({options:on,masterVolume:Le.masterVolume,effectsVolume:Le.effectsVolume,musicVolume:Le.musicVolume,muted:Le.muted}))}catch{}};function Fc(){let i=on.quality==="low";Di.setPixelRatio(i?.7:Math.min(devicePixelRatio,1.25)),Di.setSize(innerWidth,innerHeight,!1),Ii.width=innerWidth,Ii.height=innerHeight,pe.aspect=innerWidth/innerHeight,pe.updateProjectionMatrix();let t=i?1024:2048;tr.light.shadow.mapSize.x!==t&&(tr.light.shadow.mapSize.set(t,t),tr.light.shadow.map?.dispose(),tr.light.shadow.map=null)}onresize=Fc;Fc();async function yh(){try{await Le.unlock()}catch(i){throw console.error("Falha no \xE1udio",i),i}}Pi.addEventListener("pointerdown",()=>{Le.ready||yh()},{once:!0});async function ff(i){if(i==="volume"||i.startsWith("change-")){i==="change-quality"&&Fc(),(i==="change-car"||i==="change-color")&&Nc(),Fx();return}if(i==="garage"||i==="setup"){ee.show(i),rs=0,yh();return}if(i==="start"||i==="restart"){if(gh)return;gh=!0;try{let t=yh();navigator.userActivation?.hasBeenActive&&await t,Sn=0,Wt.reset(on),Nc(),Le.prepared?Le.start(on.car):t.then(()=>{ee.page==="race"&&Le.start(on.car)}),Uc.clear(),Fn.reset(),ee.show("race"),Li=!1,uo=0,rs=0,Th=0,po=performance.now()}finally{gh=!1}return}if(i==="pause"&&ee.page==="race"){Wt.pause(),ee.show("paused"),Le.update(Wt),bn.clear();return}if(i==="resume"&&ee.page==="paused"){Wt.resume(),ee.show("race"),uo=0,po=performance.now();return}if(i==="menu"){Le.stop(),Uc.clear(),bn.clear(),Sn=0,ee.show("menu"),rs=0,Fn.reset();return}}addEventListener("keydown",i=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),bn.add(i.code),!i.repeat){if(i.code==="Escape"||i.code==="KeyP"){ee.escape();return}if(i.code==="KeyC"&&ee.page==="race"){Li=!Li,Fn.reset();return}ee.page!=="race"&&(i.code==="Enter"&&!i.target.closest?.("button")&&(i.preventDefault(),ee.confirm()),(i.code==="ArrowDown"||i.code==="ArrowRight")&&ee.move(1),(i.code==="ArrowUp"||i.code==="ArrowLeft")&&ee.move(-1))}});addEventListener("keyup",i=>bn.delete(i.code));addEventListener("blur",()=>{bn.clear(),ee.page==="race"&&!os&&ff("pause")});function Bx(){let i=Array.from(navigator.getGamepads?.()||[]).find(Boolean),t=+(bn.has("ArrowRight")||bn.has("KeyD"))-+(bn.has("ArrowLeft")||bn.has("KeyA")),e=+(bn.has("ArrowUp")||bn.has("KeyW")),n=+(bn.has("ArrowDown")||bn.has("KeyS"));if(i){let s=i.buttons.map(o=>o.pressed),r=o=>s[o]&&!cf[o];r(9)&&ee.escape(),r(3)&&ee.page==="race"&&(Li=!Li,Fn.reset()),ee.page!=="race"&&(r(0)&&ee.confirm(),r(1)&&ee.escape(),(r(12)||r(14))&&ee.move(-1),(r(13)||r(15))&&ee.move(1)),cf=s,Math.abs(i.axes[0]||0)>.09&&(t=i.axes[0]),e=Math.max(e,i.buttons[7]?.value||0),n=Math.max(n,i.buttons[6]?.value||0)}return{gas:e,brake:n,steer:t}}function pf(i,t=.19){(pe.fov!==i||pe.near!==t)&&(pe.fov=i,pe.near=t,pe.updateProjectionMatrix())}function fi(i,t,e=42){pe.position.copy(i);let n=yt.terrain.cast(i.x,i.z);Number.isFinite(n)&&(pe.position.y=Math.max(pe.position.y,n+.23)),pe.up.set(0,1,0),pe.lookAt(t),pf(e)}function Ah(){let i=vh,t=ee.page==="menu",e=ee.page==="garage",n=yt.point(i.s,i.l);n.y=i.y,Ze.forEach((l,u)=>l.root.visible=u===0),Ze[0].update(i,yt);let s=e?1+rs*.135:t?.92+Math.sin(rs*.055)*.042:-.83,r=t?6.6:e?6.25:7.05,o=st(Math.sin(s)*r,t?1.25:1.48,Math.cos(s)*r),a=st(Math.cos(s),0,-Math.sin(s)),c=n.clone().addScaledVector(a,-(t?1.37:1.59));c.y+=t?.76:.71,fi(n.clone().add(o),c,t?34:36),er.copy(n)}function Lc(i){let t=i[0];for(let e=0;e<Ze.length;e++){let n=i[e],s=Ze[e];s.root.visible=e===0||Math.min(Ue(n.s-t.s,yt.length),Ue(t.s-n.s,yt.length))<285,s.root.visible&&s.update(n,yt)}er.copy(Ze[0].root.position)}function Ox(){let i=Wt.cars[0],t=yt.point(i.s,i.l),e=.82-.54*(Wt.intro/4.9),n=yt.frame(i.s),s=t.clone().addScaledVector(st(n.rx,0,n.rz),-Math.cos(e)*5.25).addScaledVector(st(n.tx,0,n.tz),Math.sin(e)*5.25);s.y+=1.08+Wt.intro*.062,fi(s,t.clone().add(st(0,.6,0)),40)}function Mh(i,t=!1){let e=Wt.cars[0];if(Wt.phase==="grid")Ox();else if(Fn.chase(e,i,Li),t){let n=yt.point(e.s,e.l,1.05),s=pe.position;(s.y<yt.terrain.cast(s.x,s.z)+.1||!Fn.clear(n,s,!0))&&Th++}}function mf(i,t,e=!1){for(uo+=i;uo>=Un;)Wt.step(Dc&&os?Wt.testPilot():t,bh),uo-=Un;Wt.phase==="results"&&ee.page==="race"&&(ee.show("results"),Le.update(Wt),Le.tone(880,.25,.13))}function Ic(i){on.quality=i?"low":"high",Fc()}function nr(i=on.quality==="low"){_h.sets.cull(pe,i,Sn===12),tr.update(pe,er),_h.ocean.update(Sn?19:ee.page==="race"?Wt.time:rs);let t=Sn?[1,5,6,8,9].includes(Sn)?df:null:ee.page==="race"&&Wt.phase==="race"?Wt:null;if(!i&&t&&t.cars[0].speed>4){let e=t.cars[0];uf(tn,pe,Ze,e,yt.frame(e.s),Li&&!Sn)}else Di.render(tn,pe)}function gf(i){let t=Math.max(1e-4,(i-po)/1e3);po=i,mh.push(t),mh.length>120&&mh.shift(),fo&&fo.push(t);let e=Math.min(.125,t),n=Bx();if(rs+=e,Sn)Sn>0&&nr();else if(["menu","garage","setup"].includes(ee.page)?(Ah(),ho(Wt,!1)):(ee.page==="race"&&!co&&mf(e,n),Lc(Wt.cars),ee.page==="race"&&(Mh(e,bh),Uc.update(Wt.cars,e)),Le.update(Wt),ho(Wt,ee.page==="race")),nr(),xh&&Wt.phase==="race"&&Wt.cars[0].progress.started&&(xh=!1,ao=rf(Sh,Ii,Le),oo={start:Wt.time,startLog:Wt.log.length,startLap:Wt.cars[0].progress.laps}),ao&&(ao.draw(),Wt.cars[0].progress.laps>oo.startLap)){let s=ao;ao=null;let r=Wt.time-oo.start,o=Wt.log.slice(oo.startLog).map(a=>({...a,recordTime:a.t-oo.start}));s.finish().then(a=>{lo={...a,events:o,lapTime:r}})}requestAnimationFrame(gf)}Nc();for(let i of Ze)i.root.visible=!0;for(let i of Wt.cars)Ze[i.driver].update(i,yt);Ah();for(let i of Ze)i.root.visible=!0;await Di.compileAsync(tn,pe);uf(tn,pe,Ze,vh,yt.frame(vh.s),!1);wh.value=1;ee.show("menu");Ah();nr();po=performance.now();requestAnimationFrame(gf);if(os){let t=function(c){let l=c===1?74:c===2?-17:c===3?154:c===4?yt.zones[1].s+452:c===5||c===10?Ux.plaza-66:c===6?yt.zones[3].s+713:c===7?yt.bridge.start-13:c===9?yt.zones[1].s+154:0,u=c===8?"duel":l;if(i.has(u))return i.get(u);let h=new so(yt,{...on,laps:3,difficulty:"normal"});h.phase="race";for(let d=0;d<25e3;d++){let p=h.cars[0];if(c===8){let g=h.cars.slice(1).filter(x=>Math.abs(x.distance-p.distance)<1.75);if(p.distance>600&&g.some(x=>x.l<p.l-1.65)&&g.some(x=>x.l>p.l+1.65))break}else if(p.distance>=l)break;h.step(c===8?Ks(yt,p,0,.91):h.testPilot(),!0)}return i.set(u,h),h},e=function(c){Sn=c,Ic(c===10),Uc.clear(),Pi.style.visibility="hidden",Fn.reset(),pe.near=.19,pe.up.set(0,1,0),pe.updateProjectionMatrix(),tn.fog=c===12?null:fh;let l=t(c),u=l.cars[0];df=l,Lc(l.cars);let h=yt.point(u.s,u.l);if(c===12)pe.position.set(240,1370,-37),pe.up.set(0,0,-1),pe.lookAt(240,0,-37),pf(52,500);else if(c===2){let d=yt.frame(u.s),p=h.clone().addScaledVector(st(d.rx,0,d.rz),-3.55).addScaledVector(st(d.tx,0,d.tz),4.23).add(st(0,.96,0));fi(p,h.clone().add(st(0,.55,0)),38)}else if(c===3){let d=yt.frame(154),p=yt.shoreX(d.z);fi(st(p+6.9,1.72,d.z+5.7),st(p-3.6,.43,d.z-3.8),61),er.set(p,0,d.z)}else if(c===4)fi(h.clone().add(st(13.2,7.6,7.5)),h.clone().add(st(-7,-.44,-2.9)),54);else if(c===7){let d=yt.point(yt.bridge.start-5.5,18.7,.83),p=yt.point(yt.bridge.start+4.7,0,-.75);fi(d,p,66)}else if(c===8){let d=yt.point(u.s+8.55,u.l+2.1,1.12);fi(d,h.clone().add(st(0,.69,0)),53)}else if(c===9){let d=yt.frame(u.s),p=Math.sign(d.curve)||1,g=yt.point(u.s-3.2,p*(d.width/2-.55),.4),x=yt.point(u.s+5.5,p*(d.width/2-.8),.18);fi(g,x,62)}else if(c===11){let d=yt.objects.find(f=>f.kind==="house"&&f.l>0&&f.variant===0),p=Ci(yt,d.s,d.l-d.d/2-1.57);Ze.forEach((f,v)=>f.root.visible=v===0),Ze[0].update(p,yt);let g=yt.frame(d.s),x=yt.point(p.s,p.l);x.y=p.y;let m=x.clone().addScaledVector(st(g.rx,0,g.rz),-7.8).addScaledVector(st(g.tx,0,g.tz),-2.3).add(st(0,1.46,0));fi(m,x.clone().addScaledVector(st(g.rx,0,g.rz),1.9).add(st(0,1.08,0)),43),er.copy(x)}else Fn.chase(u,0,!1,!0);return nr(),ho(l,![2,11,12].includes(c)),c===12&&n(),{time:l.time,distance:u.distance,positions:l.cars.map(d=>({s:d.s,l:d.l})),low:c===10}},n=function(){let c=Ii.getContext("2d"),l=Ii.width,u=Ii.height,h=p=>yt.point(p.s,0,.1).project(pe),d=["#f6c274","#d78053","#ede0bf","#99cbae"];for(let[p,g]of yt.zones.entries()){c.beginPath();for(let x=g.s;x<g.end+2.3;x+=2.3){let m=h({s:Math.min(x,g.end)}),f=(m.x+1)*l/2,v=(1-m.y)*u/2;x===g.s?c.moveTo(f,v):c.lineTo(f,v)}c.strokeStyle=d[p],c.lineWidth=3.5,c.stroke()}c.fillStyle="rgba(20,32,30,.82)",c.fillRect(38,u-183,246,145),c.fillStyle="#f2e8d4",c.font="bold 22px Arial",c.fillText("Costa Dourada",55,u-148),yt.zones.forEach((p,g)=>{c.fillStyle=d[g],c.fillRect(55,u-129+g*21,16,3),c.fillStyle="#efe8d5",c.font="14px Arial",c.fillText(p.name,82,u-124+g*21)})},s=function(c,l){Sn=101,tn.fog=fh,Pi.style.visibility="hidden",ho(Wt,!1);let u=Ci(yt,c,0);return Ze.forEach((h,d)=>h.root.visible=d===0),Ze[0].update(u,yt),er.copy(Ze[0].root.position),pe.near=.19,pe.updateProjectionMatrix(),Fn.chase(u,0,!1,!0),nr(l),Sh.toDataURL("image/jpeg",.91)},r=function(){Sn=0,tn.fog=fh,Pi.style.visibility="",Ic(!1),Fn.reset(),ee.show("menu")},o=function(c){co=!0;let l=Math.min(c,900),u=0;for(let h=0;h<l&&ee.page==="race";h+=1/30)mf(1/30,Wt.testPilot(),!0),Mh(1/30,!0),u++;return Lc(Wt.cars),ho(Wt,ee.page==="race"),nr(),Le.update(Wt),{steps:u,phase:Wt.phase}},a=function(){return{phase:Wt.phase,time:Wt.time,position:Wt.position(),passes:Wt.passes,camHits:Th,laps:Wt.cars[0].progress.laps,vehicles:Wt.cars.map(c=>({driver:c.driver,laps:c.progress.laps,lapTimes:c.progress.times,maxIdle:c.maxIdle,maxOff:c.maxOff,wheelGap:c.maxWheelGap,bodyClearance:c.minClearance})),events:Wt.log,voices:Le.nodes.length,initialVoices:Le.initialVoices,maxAI:Le.maxAI,results:Wt.results()}},i=new Map;window.bench={validate:()=>yt.validateWorld(),stats:()=>({...Jd(tn,yt,Ze),engineAudioBuffers:Le.layers?.flat().filter(c=>c.src.buffer instanceof AudioBuffer).map(c=>({key:c.key,duration:c.src.buffer.duration}))||[]}),view:e,map:()=>e(12),sweep:s,sky:()=>$d(Di,tn,pe,tr.dome,Ii),resetView:r,quality:Ic,perf:c=>{Sn=0,co=!1,Dc=!0,Ic(c),Pi.style.visibility="",Wt.reset(on),Wt.phase="race";for(let l of Wt.cars)l.distance+=yt.zones[2].s+104,l.s=Ue(l.distance,yt.length),l.speed=26,l.y=yt.surface(l.s,l.l);ee.show("race"),Fn.reset(),Lc(Wt.cars),Mh(0)},manual:c=>{co=c,Dc=c},advance:o,summary:a,controls:()=>({hood:Li,phase:Wt.phase,screen:ee.page}),record:()=>{xh=!0,lo=null,Dc=!0,co=!1},recordReady:()=>!!lo,recordMeta:()=>{let{audio:c,video:l,...u}=lo;return{...u,videoBytes:l.size,audioBytes:c.size}},download:c=>sf(lo[c],c==="audio"?"audio-volta.wav":"volta.webm"),gpu:()=>{let c=Di.getContext(),l=c.getExtension("WEBGL_debug_renderer_info");return l?c.getParameter(l.UNMASKED_RENDERER_WEBGL):c.getParameter(c.RENDERER)},measure:async(c=40)=>{fo=[];for(let u=0;u<c+1;u++)await new Promise(requestAnimationFrame);let l=fo.slice(1);return fo=null,l},cut:()=>{let c=Ci(yt,0);c.progress={next:0,laps:0,started:!1,lapStart:0,best:1/0,times:[]};let l=ro(yt,c,-.12,.18,.1),u=ro(yt,c,1,yt.length+.18,1),h=ro(yt,c,yt.length-.12,yt.length+.18,2);return{first:l,jump:u,lap:h,laps:c.progress.laps,expected:c.progress.next}},driveLap:()=>{let c=Ci(yt),l=0;for(;c.distance<yt.length&&l<240;)Mc(yt,c,Ks(yt,c),Un,!0),l+=Un;return{elapsed:l,distance:c.distance,length:yt.length,events:c.events.filter(u=>u.type!=="gear"),wheelGap:c.maxWheelGap,bodyClearance:c.minClearance}}}}
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
