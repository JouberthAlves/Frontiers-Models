"""Development-time download of the selected CC0 originals. The game reads local files."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib, json, urllib.request
from PIL import Image
from io import BytesIO
root=Path(__file__).resolve().parents[1]
dest=root/'assets'/'surfaces'
dest.mkdir(parents=True,exist_ok=True)
def read(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Estreito Racing / local offline asset build'})
    with urllib.request.urlopen(req,timeout=40) as r: return r.read()
def metadata(asset):
    return json.loads(read('https://api.polyhaven.com/files/'+asset))
def surface(entry):
    name,asset,res=entry
    spec=metadata(asset)
    result=[]
    for slot,key in [('color','Diffuse'),('normal','nor_gl'),('rough','Rough')]:
        ref=spec[key][res]['jpg']
        data=read(ref['url'])
        if ref.get('md5') and hashlib.md5(data).hexdigest()!=ref['md5']: raise ValueError(ref['url'])
        (dest/(name+'-'+slot+'.jpg')).write_bytes(data)
        result.append({'name':name+'-'+slot,'asset':asset,'url':ref['url'],'md5':hashlib.md5(data).hexdigest(),'size':Image.open(BytesIO(data)).size})
    return result
if __name__=='__main__':
    jobs=[('road','asphalt_04','2k'),('sand','coast_sand_01','1k'),('earth','brown_mud_dry','1k'),('rock','coast_sand_rocks_02','1k')]
    with ThreadPoolExecutor(max_workers=4) as pool: report=[item for batch in pool.map(surface,jobs) for item in batch]
    asset='kloppenheim_06_puresky'
    spec=metadata(asset)
    ref=spec['hdri']['2k']['hdr']
    data=read(ref['url'])
    if ref.get('md5') and hashlib.md5(data).hexdigest()!=ref['md5']: raise ValueError(ref['url'])
    (dest/'coastal-sky.hdr').write_bytes(data)
    report.append({'name':'coastal-sky','asset':asset,'url':ref['url'],'md5':hashlib.md5(data).hexdigest()})
    (root/'tools'/'surface-sources.json').write_text(json.dumps(report,indent=2))
    print([(item['name'],item.get('size')) for item in report])
