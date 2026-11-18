from pathlib import Path
import json,re,urllib.request,urllib.error,time,hashlib,html
base=Path(__file__).resolve().parents[1];out=base/'assets'/'audio';out.mkdir(parents=True,exist_ok=True)
samples=[('ext-idle','GiocoSound',401552),('ext-low','GiocoSound',401556),('ext-mid','GiocoSound',401555),('ext-high','GiocoSound',401551),
 ('int-idle','GiocoSound',401550),('int-low','GiocoSound',401548),('int-mid','GiocoSound',401547),('int-high','GiocoSound',401549),
 ('tyre','audible-edge',71736),('gravel','seth-m',341069),('impact','newagesoup',337833),('surf','bassimat',861755),('town','Vital_Sounds',534479),('forest','SamuelGremaud',543957)]
def read(url):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 Estreito Racing local CC0 asset build'})
 try:return urllib.request.urlopen(req,timeout=40).read()
 except urllib.error.HTTPError as e:
    if e.code!=429:raise
    time.sleep(min(60,max(7,int(e.headers.get('Retry-After','18')))))
    return urllib.request.urlopen(req,timeout=40).read()
f=base/'tools'/'audio-sources.json';report=json.loads(f.read_text()) if f.exists() else []
for name,user,sid in samples:
 if any(o['name']==name for o in report) and (out/(name+'.mp3')).exists():continue
 url='https://freesound.org/people/'+user+'/sounds/'+str(sid)+'/'
 page=read(url).decode()
 if 'Creative Commons 0' not in page:raise ValueError('CC0 unavailable for '+url)
 pattern=r'https://cdn\.freesound\.org/previews/\d+/\d+_\d+-hq\.mp3'
 preview=re.search(pattern,page).group(0);raw=read(preview)
 (out/(name+'.mp3')).write_bytes(raw)
 report.append({'name':name,'author':user,'id':sid,'page':url,'license':'CC0','preview':preview,'sha256':hashlib.sha256(raw).hexdigest()})
 f.write_text(json.dumps(report,indent=2));print(name,len(raw),flush=True);time.sleep(2)
