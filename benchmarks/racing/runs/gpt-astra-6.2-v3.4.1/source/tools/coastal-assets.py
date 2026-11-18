"""Reduce CC0 photogrammetry to compact indexed meshes and package its PBR maps."""
from pathlib import Path
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
import hashlib,json,urllib.request
from importlib.util import spec_from_file_location, module_from_spec
spec=spec_from_file_location('asset_tools',Path(__file__).with_name('fetch-surfaces.py'))
base=module_from_spec(spec);spec.loader.exec_module(base)
out=base.root/'assets'/'geometry';out.mkdir(parents=True,exist_ok=True)
samples={'reef':'coast_rocks_03','cliff':'coastal_cliff_02','shrub':'shrub_02','grass':'grass_medium_02'}
component={5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1'}
dims={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def model(pair):
 name,source=pair;data=base.metadata(source);record=data['gltf']['1k']['gltf']
 g=json.loads(base.read(record['url'])); ref=record['include'][g['buffers'][0]['uri']];blob=base.read(ref['url'])
 assert not ref.get('md5') or hashlib.md5(blob).hexdigest()==ref['md5']
 def values(idx):
    ac=g['accessors'][idx];v=g['bufferViews'][ac['bufferView']];tp=component[ac['componentType']];dim=dims[ac['type']]
    stride=v.get('byteStride',np.dtype(tp).itemsize*dim)
    return np.ndarray((ac['count'],dim),dtype=tp,buffer=blob,offset=v.get('byteOffset',0)+ac.get('byteOffset',0),strides=(stride,np.dtype(tp).itemsize)).copy()
 mesh=min(g['meshes'],key=lambda m:g['accessors'][m['primitives'][0]['indices']]['count'])
 p=mesh['primitives'][0]
 vs=values(p['attributes']['POSITION']);ns=values(p['attributes']['NORMAL']);uv=values(p['attributes']['TEXCOORD_0']);faces=values(p['indices']).reshape(-1,3)
 size=vs.max(axis=0)-vs.min(axis=0);center=(vs.max(axis=0)+vs.min(axis=0))/2;center[1]=vs.min(axis=0)[1]
 vs=(vs-center)/max(size)
 if len(faces)>18000:
    keys=np.column_stack((np.floor(vs*38),np.floor(uv*10))).astype('int32')
    _,selection,inverse=np.unique(keys,axis=0,return_index=True,return_inverse=True)
    vs,ns,uv=vs[selection],ns[selection],uv[selection]
    faces=inverse[faces];faces=faces[(faces[:,0]!=faces[:,1])&(faces[:,1]!=faces[:,2])&(faces[:,2]!=faces[:,0])]
 uv[:,1]=1-uv[:,1]
 vdata=np.column_stack((vs,ns,uv)).astype('<f4');indices=faces.astype('<u4')
 (out/(name+'.bin')).write_bytes(vdata.tobytes()+indices.tobytes())
 (out/(name+'.json')).write_text(json.dumps({'vertices':len(vs),'indices':indices.size,'size':(size/max(size)).tolist()}))
 for key,slot in [('Diffuse','color'),('nor_gl','normal'),('arm','rough')]:
    item=data[key]['1k']['jpg'];raw=base.read(item['url'])
    if item.get('md5'): assert hashlib.md5(raw).hexdigest()==item['md5']
    (base.dest/(name+'-'+slot+'.jpg')).write_bytes(raw)
 if 'Alpha' in data:
    image=Image.open(BytesIO(base.read(data['Alpha']['1k']['jpg']['url']))).convert('L')
    image.save(base.dest/(name+'-alpha.jpg'),quality=95)
 return {'asset':source,'source':record['url'],'mesh':mesh['name'],'triangles':len(faces)}
def foliage(entry):
 name,src,diff,alpha,norm,rough=entry
 data=base.metadata(src)
 for slot,key in [('color',diff),('alpha',alpha),('normal',norm),('rough',rough)]:
    rec=data[key]['1k']['jpg'];(base.dest/(name+'-'+slot+'.jpg')).write_bytes(base.read(rec['url']))
 return {'asset':src,'parts':[diff,alpha,norm,rough]}
with ThreadPoolExecutor(max_workers=4) as pool:
 report=list(pool.map(model,samples.items()))
 report+=list(pool.map(foliage,[('needles','pine_tree_01','twig_diff','twig_alpha','twig_nor_gl','twig_rough'),('leaves','jacaranda_tree','leaves_diff','leaves_alpha','leaves_nor_gl','leaves_rough')]))
 report+=list(pool.map(base.surface,[('bark','palm_bark','1k'),('pavers','seaworn_sandstone_brick','1k')]))
(base.root/'tools'/'coast-sources.json').write_text(json.dumps(report,indent=2))
print(report[:6])
