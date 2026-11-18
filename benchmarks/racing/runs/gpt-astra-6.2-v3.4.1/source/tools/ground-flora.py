from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
import random,math
r=random.Random(8815);out=Path(__file__).resolve().parents[1]/'assets'/'surfaces'
im=Image.new('RGBA',(1024,1024));p=ImageDraw.Draw(im)
for i in range(1150):
    group=i%7
    base=145+group*122+r.gauss(0,64)
    yy=932+r.gauss(0,37)
    h=r.uniform(90,440)*(1.0+.21*math.sin(group*1.4))
    lean=r.gauss(0,122)+(base-512)*.22
    width=r.uniform(2.1,6.2)
    x1=base+lean*.22;y1=yy-h*.57
    x2=base+lean;y2=yy-h
    brightness=r.uniform(.60,1.27)
    raw=(103+r.random()*35,123+r.random()*39,56+r.random()*31)
    col=tuple(min(255,round(n*brightness)) for n in raw)+(255,)
    p.polygon([(base-width,yy),(x1-width*.54,y1),(x2,y2),(x1+width*.6,y1),(base+width,yy)],fill=col)
    if i%12==0:
        p.line((x1,y1,x2,y2),fill=(158,144,85,255),width=2)
        for k in range(5):
            xx=x2+(x1-x2)*k*.075;yy2=y2+(y1-y2)*k*.075
            p.line((xx,yy2,xx-7,yy2-13),fill=(188,169,109,255),width=3)
im.save(out/'wild-grass.webp',quality=93)
grove=Image.open(out/'grove0.webp').convert('RGBA')
bush=Image.new('RGBA',(1024,1024))
for i in range(50):
    tile=i%3
    crown=grove.crop((tile*1024+105,170,tile*1024+914,552))
    ww=r.randint(183,352);hh=r.randint(116,241)
    crown=crown.resize((ww,hh),Image.Resampling.LANCZOS)
    if i%2:crown=crown.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    a=np.asarray(crown).astype(float);yy,xx=np.mgrid[0:hh,0:ww]
    fade=np.clip((1-((xx-ww*.5)/(ww*.5))**2-((yy-hh*.5)/(hh*.54))**2)*3,0,1)
    a[:,:,3]*=fade;a[:,:,:3]*=np.array([1.12,1.32,1.02])*(.85+r.random()*.38)
    theta=r.random()*math.pi*2;rad=r.random()**.5
    centerX=510+math.cos(theta)*rad*352;centerY=565+math.sin(theta)*rad*237
    bush.alpha_composite(Image.fromarray(np.clip(a,0,255).astype('uint8')),(round(centerX-ww/2),round(centerY-hh/2)))
bush.save(out/'lentisco.webp',quality=93)
