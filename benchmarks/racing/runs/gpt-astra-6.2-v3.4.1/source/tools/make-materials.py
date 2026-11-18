"""Original tileable surface finishes and relief, in metres-scaled UV space."""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
out=Path(__file__).resolve().parents[1]/'assets'/'surfaces'
out.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(408392)
size=1024
y,x=np.mgrid[0:size,0:size]
def fb(n):
    tile=rng.uniform(0,255,(n,n)).astype('uint8')
    return np.asarray(Image.fromarray(tile).resize((size,size),Image.Resampling.BICUBIC),dtype=float)/255-.5
grain=rng.normal(0,1,(size,size))
base=fb(8)*.4+fb(34)*.22+fb(155)*.12+grain*.04
for name in ['finish','grain','plaster','timber','tiles','stone','rubber']:
    if name=='finish': field=grain*.018+fb(80)*.025;level=247;contrast=52
    elif name=='grain': field=base;level=198;contrast=74
    elif name=='plaster': field=base*.75+fb(3)*.23;level=226;contrast=89
    elif name=='timber': field=base*.4+.12*np.sin(x*.14+.9*np.sin(y*.016)+fb(5)*7)+.13*fb(32);level=189;contrast=133
    elif name=='tiles':
        row=np.floor(y/128); xx=(x+row*28)%96; yy=(y+1)%128
        field=.33*np.cos(xx/96*2*np.pi)+np.where(yy<6,-.65,.04)+base*.28
        level=201;contrast=99
    elif name=='stone':
        row=np.floor(y/140);xx=(x+row*121+12*fb(8))%252;yy=(y+ris if False else y+10*fb(12))%140
        field=base+np.where((xx<8)|(yy<7),-.45,.04);level=192;contrast=90
    else:
        field=grain*.10+np.where(((x+np.abs((y%160)-80)*.6)%70)<5,-.55,0);level=187;contrast=63
    raw=np.clip(level+field*contrast,8,255).astype('uint8')
    im=Image.fromarray(raw).convert('RGB');im.save(out/(name+'-color.jpg'),quality=89)
    h=field; dx=(np.roll(h,1,axis=1)-np.roll(h,-1,axis=1));dy=(np.roll(h,1,axis=0)-np.roll(h,-1,axis=0))
    normal=np.stack([128+dx*68,128+dy*68,np.full_like(h,251)],axis=2)
    Image.fromarray(np.clip(normal,0,255).astype('uint8')).save(out/(name+'-normal.jpg'),quality=87)
    Image.fromarray(np.clip(196+field*64,40,253).astype('uint8')).save(out/(name+'-rough.jpg'),quality=86)
