# Dev-time helpers for Radiance .hdr files (numpy only). Not used by the game or by `npm run verify`.
import numpy as np
import sys, os, math


def read_hdr(path):
    with open(path, 'rb') as f:
        data = f.read()
    pos = 0
    # header
    while True:
        end = data.index(b'\n', pos)
        line = data[pos:end]
        pos = end + 1
        if line == b'':
            break
    end = data.index(b'\n', pos)
    res = data[pos:end].decode().split()
    pos = end + 1
    h, w = int(res[1]), int(res[3])
    img = np.zeros((h, w, 4), dtype=np.uint8)
    buf = np.frombuffer(data, dtype=np.uint8)
    for y in range(h):
        if buf[pos] != 2 or buf[pos + 1] != 2:
            raise ValueError('only new-style RLE supported')
        pos += 4
        for c in range(4):
            x = 0
            while x < w:
                n = int(buf[pos]); pos += 1
                if n > 128:
                    n -= 128
                    img[y, x:x + n, c] = buf[pos]; pos += 1
                else:
                    img[y, x:x + n, c] = buf[pos:pos + n]; pos += n
                x += n
    e = img[..., 3].astype(np.float32)
    scale = np.where(e > 0, np.ldexp(1.0, (e - 136).astype(np.int32)), 0).astype(np.float32)
    return img[..., :3].astype(np.float32) * scale[..., None]


def sun_info(rgb):
    h, w, _ = rgb.shape
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    # weight by solid angle
    v = (np.arange(h) + 0.5) / h
    el = (0.5 - v) * math.pi
    sa = np.cos(el)[:, None] * (math.pi / h) * (2 * math.pi / w)
    peak = lum.max()
    mask = lum > peak * 0.2
    ys, xs = np.nonzero(mask)
    wgt = lum[mask] * sa.repeat(w, axis=1)[mask]
    # circular mean in x
    ang = xs / w * 2 * math.pi
    cx = math.atan2((np.sin(ang) * wgt).sum(), (np.cos(ang) * wgt).sum()) % (2 * math.pi)
    cy = (ys * wgt).sum() / wgt.sum()
    u = cx / (2 * math.pi)
    elev = (0.5 - (cy + 0.5) / h) * 180
    col = (rgb[mask] * (lum[mask] * 0 + 1)[:, None]).mean(axis=0)
    # sky irradiance on a horizontal plane (upper hemisphere), sun included and excluded
    up = np.clip(np.sin(el), 0, None)[:, None]
    E_all = (rgb * (sa * up)[..., None]).sum(axis=(0, 1))
    E_nosun = (np.where(mask[..., None], 0, rgb) * (sa * up)[..., None]).sum(axis=(0, 1))
    return dict(u=u, elev=elev, peak=float(peak), sunColor=col.tolist(), E_all=E_all.tolist(), E_sky=E_nosun.tolist(), sunPixels=int(mask.sum()))


def tonemap(rgb, exposure=1.0):
    x = rgb * exposure
    x = x / (1 + x)
    return (np.clip(x, 0, 1) ** (1 / 2.2) * 255).astype(np.uint8)


if __name__ == '__main__':
    from PIL import Image
    folder = sys.argv[1]
    out = sys.argv[2]
    files = sorted(f for f in os.listdir(folder) if f.endswith('.hdr'))
    tiles = []
    for f in files:
        rgb = read_hdr(os.path.join(folder, f))
        info = sun_info(rgb)
        sky = rgb[: rgb.shape[0] // 2]
        exp = 0.35 / max(1e-6, float(np.median(sky @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))))
        im = Image.fromarray(tonemap(rgb, exp)).resize((640, 320))
        # roll so the sun is centred
        arr = np.roll(np.asarray(im), int((0.5 - info['u']) * 640), axis=1)
        tiles.append((f, info, arr))
        e = info['E_all']; s = info['E_sky']
        print(f"{f[:-7]:36s} sun u={info['u']:.3f} elev={info['elev']:5.1f} peak={info['peak']:9.0f} px={info['sunPixels']:4d} E={sum(e)/3:6.2f} Esky={sum(s)/3:5.2f} sunRGB=({info['sunColor'][0]:.0f},{info['sunColor'][1]:.0f},{info['sunColor'][2]:.0f})")
    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    sheet = np.zeros((rows * 200, cols * 640, 3), dtype=np.uint8)
    for i, (f, info, arr) in enumerate(tiles):
        r, c = divmod(i, cols)
        sheet[r * 200:(r + 1) * 200, c * 640:(c + 1) * 640] = arr[0:200]
    Image.fromarray(sheet).save(out)
    print('wrote', out, 'order:', ' | '.join(f[:-7] for f, _, _ in tiles))
