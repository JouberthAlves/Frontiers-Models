import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { randomFrom } from './course.js';

const Y = new T.Vector3(0,1,0);

export function block(width,height,depth,x=0,y=0,z=0) {
  return new T.BoxGeometry(width,height,depth).translate(x,y,z);
}

export function branch(a,b,from,to,sides=8) {
  const root = new T.Vector3(...a), tip = new T.Vector3(...b);
  const direction = tip.clone().sub(root);
  const mesh = new T.CylinderGeometry(to,from,direction.length(),sides,1,true);
  mesh.applyMatrix4(new T.Matrix4().compose(root.lerp(tip,.5),new T.Quaternion().setFromUnitVectors(Y,direction.normalize()),new T.Vector3(1,1,1)));
  return mesh;
}

export function boulder(seed, scale, detail=1) {
  const rng = randomFrom(seed);
  const g = new T.IcosahedronGeometry(1,detail);
  const vertex = g.attributes.position;
  const uv = g.getAttribute('uv');
  const freq = 1.9 + rng()*2.2;
  for (let i=0;i<vertex.count;i++) {
    const x=vertex.getX(i), y=vertex.getY(i), z=vertex.getZ(i);
    const shape = 1 + .19*Math.sin(4.6*x+1.6*z)*Math.cos(y*freq+z*2.6) + .11*Math.sin(6.3*z+2.5*y);
    vertex.setXYZ(i,x*scale[0]*shape, (y*shape + Math.abs(x)*.145 + z*.13)*scale[1], z*scale[2]*shape);
    uv.setXY(i,(x*Math.cos(z) + z*.53)*scale[0]*.57, (y + z*.19)*scale[1]*.61);
  }
  g.computeVertexNormals();
  return g;
}

export function textSurface(label, color, background = null, font='700 68px Segoe UI', width=760, height=118) {
  const image = document.createElement('canvas');
  image.width=width;
  image.height=height;
  const ctx=image.getContext('2d');
  if (background) {
    ctx.fillStyle=background;
    ctx.fillRect(0,0,width,height);
  }
  ctx.fillStyle=color;
  ctx.font=font;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(label,width/2,height*.51,width*.965);
  const tex=new T.CanvasTexture(image);
  tex.colorSpace=T.SRGBColorSpace;
  tex.anisotropy=8;
  return tex;
}

export class SceneryBatch {
  constructor(name) {
    this.root=new T.Group();
    this.root.name=name;
    this.chunks=new Map();
  }

  static yaw(x,y,z,yaw=0) {
    return new T.Matrix4().makeRotationY(yaw).setPosition(x,y,z);
  }

  add(geometry,material,matrix=null,shadow=true) {
    if (matrix) geometry.applyMatrix4(matrix);
    if (!geometry.index) geometry.setIndex(Array.from({length:geometry.attributes.position.count},(_,i)=>i));
    geometry.computeBoundingBox();
    const center=geometry.boundingBox.getCenter(new T.Vector3());
    const chunk=`${Math.floor(center.x/76)}/${Math.floor(center.z/76)}/${material.id}/${Number(shadow)}`;
    if (!this.chunks.has(chunk)) this.chunks.set(chunk,{ material,shadow,geometries:[] });
    this.chunks.get(chunk).geometries.push(geometry);
  }

  finish() {
    for (const {material,shadow,geometries} of this.chunks.values()) {
      const combined=mergeGeometries(geometries);
      if (!combined) throw new Error('Incompatible shared scenery geometry for ' + material.name);
      const mesh=new T.Mesh(combined,material);
      mesh.castShadow=shadow;
      mesh.receiveShadow=true;
      mesh.name=material.name;
      this.root.add(mesh);
      geometries.forEach(g=>g.dispose());
    }
    this.chunks.clear();
    return this.root;
  }
}

export function groundProp(course,s,offset,radius=0,extra={}) {
  const p=course.at(s,offset);
  const surface=course.surface(p.x,p.z);
  if (!surface) return null;
  if (radius>0) {
    const near=course.nearest(p.x,p.z);
    if (near.distance-radius < course.at(near.s).half+3.03) return null;
  }
  const prop={ ...p,y:surface.y,radius,...extra };
  if (radius>0) course.obstacles.push(prop);
  return prop;
}

export function makeProps(bank) {
  const stone = bank.surface('stone',{ name:'Sea-cut sandstone', color:0xc5baa9,roughness:.92 });
  const rock = bank.surface('limestone',{ name:'Weathered limestone', color:0xc9bba4,roughness:.95 });
  const darkMetal = bank.surface('metal',{ name:'Galvanized track hardware', color:0x848e91,roughness:.77,metalness:.48 });
  const wood = bank.surface('wood',{ name:'Weathered wood', color:0x887766 });
  const painting = new T.MeshStandardMaterial({ color:0xcac6b2, roughness:.77, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-3, name:'Flush road paint' });
  const ochre = new T.MeshStandardMaterial({ color:0xca9151, roughness:.78, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-3, name:'Flush amber road paint' });
  const lamp = new T.MeshStandardMaterial({ name:'Sodium lamp lenses', color:0xbb9570, emissive:0xff902c, emissiveIntensity:.11, roughness:.53 });
  for (const mat of [stone,rock,darkMetal,wood]) mat.userData.primary=mat.name;
  return { stone,rock,darkMetal,wood,painting,ochre,lamp };
}
