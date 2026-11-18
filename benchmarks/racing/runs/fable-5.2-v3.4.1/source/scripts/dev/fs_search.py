# Dev tool: search Freesound (CC0 only) and list the results; with --info <id> show a sound page summary.
#   python scripts/dev/fs_search.py "engine idle loop" [pages]
#   python scripts/dev/fs_search.py --info 123456 [more ids]
import re, sys, urllib.parse, urllib.request, html

UA = {'User-Agent': 'Mozilla/5.0 (asset research)'}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode('utf-8', 'replace')

def search(q, pages=1):
    out = []
    for p in range(1, pages + 1):
        url = 'https://freesound.org/search/?q=' + urllib.parse.quote(q) + '&f=license:%22Creative%20Commons%200%22&page=' + str(p)
        h = get(url)
        for m in re.finditer(r'href="/people/([^/"]+)/sounds/(\d+)/"[^>]*title="([^"]*)"', h):
            user, sid, title = m.group(1), m.group(2), html.unescape(m.group(3))
            if not any(o[1] == sid for o in out): out.append((user, sid, title))
    return out

def info(sid):
    h = get('https://freesound.org/s/%s/' % sid)
    title = re.search(r'<title>([^<]*)', h)
    lic = re.search(r'creativecommons\.org/(publicdomain/zero|licenses/[a-z-]+)/[0-9.]+', h)
    dur = re.search(r'data-duration="([0-9.]+)"', h)
    mp3 = re.search(r'data-mp3="([^"]+)"', h)
    ogg = re.search(r'data-ogg="([^"]+)"', h)
    desc = re.search(r'<meta name="description" content="([^"]*)"', h)
    return {'id': sid, 'title': html.unescape(title.group(1)) if title else '', 'license': lic.group(0) if lic else '?', 'duration': dur.group(1) if dur else '?',
            'mp3': mp3.group(1) if mp3 else '', 'ogg': ogg.group(1) if ogg else '', 'desc': html.unescape(desc.group(1))[:160] if desc else ''}

if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--info':
        for sid in a[1:]:
            i = info(sid); print(i['id'], '|', i['title'], '|', i['license'], '|', i['duration'], 's |', i['mp3'], '|', i['desc'])
    else:
        for user, sid, title in search(a[0], int(a[1]) if len(a) > 1 else 1):
            print(sid, '|', user, '|', title)
