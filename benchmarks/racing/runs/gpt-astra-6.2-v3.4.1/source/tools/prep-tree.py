from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib,json,urllib.request
root=Path(__file__).resolve().parents[1]
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Estreito, local CC0 foliage rendering'}),timeout=60).read()
for asset in ['island_tree_02','island_tree_01']:
    d=json.loads(get('https://api.polyhaven.com/files/'+asset))
    rec=d['gltf']['1k']['gltf'];target=root/'tools'/'staging'/asset;target.mkdir(parents=True,exist_ok=True)
    (target/'tree.gltf').write_bytes(get(rec['url']))
    def item(kv):
        k,v=kv;p=target/k;p.parent.mkdir(parents=True,exist_ok=True);raw=get(v['url'])
        assert not v.get('md5') or hashlib.md5(raw).hexdigest()==v['md5']
        p.write_bytes(raw)
    with ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(item,rec['include'].items()))
    a=d['leaves_alpha']['1k']['jpg'];(target/'alpha.jpg').write_bytes(get(a['url']))
    print(asset)
