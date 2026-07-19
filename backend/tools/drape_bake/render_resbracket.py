"""
Resolution-bracket comparison (BACKEND venv). Renders RAW physics drape for each
resolution q4000/q6000/q9000 side by side (boxify held constant) so we can
isolate whether mesh resolution is what drives the crumpling.
"""
import os, glob
import numpy as np
import trimesh
from PIL import Image, ImageDraw

DST = "/home/hashim/Downloads/manikan_resbracket"

def rotY(v, d):
    a = np.radians(d); c, s = np.cos(a), np.sin(a)
    return v @ np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]]).T

def render(body_v, body_f, gv, gf, deg, fname, W=460, H=680, pad=25):
    L = np.array([0.4, 0.55, 0.75]); L /= np.linalg.norm(L)
    parts = [(body_v, body_f, np.array([205, 170, 145])),
             (gv, gf, np.array([90, 120, 190]))]
    rv = [rotY(p[0], deg) for p in parts]
    allv = np.vstack(rv)
    lo = allv[:, :2].min(0); hi = allv[:, :2].max(0); sp = hi - lo; sp[sp == 0] = 1
    s = min((W - 2*pad)/sp[0], (H - 2*pad)/sp[1])
    tris = []
    for (verts, faces, rgb), vv in zip(parts, rv):
        tv = vv[faces]
        n = np.cross(tv[:, 1]-tv[:, 0], tv[:, 2]-tv[:, 0])
        nl = np.linalg.norm(n, axis=1, keepdims=True); nl[nl == 0] = 1; n /= nl
        sh = np.clip(0.30 + 0.70*(n @ L), 0.15, 1.0)
        cen = tv.mean(1)
        for i in np.where(n[:, 2] > 0.01)[0]:
            tris.append((cen[i, 2], tv[i], rgb * sh[i]))
    tris.sort(key=lambda t: t[0])
    canvas = Image.new("RGB", (W, H), (245, 245, 248))
    draw = ImageDraw.Draw(canvas)
    for _, tv, col in tris:
        pts = [(pad + (x-lo[0])*s, H - pad - (y-lo[1])*s) for x, y, _ in tv]
        draw.polygon(pts, fill=tuple(int(c) for c in col))
    canvas.save(os.path.join(DST, fname))

rows = []
for tgt in [4000, 6000, 9000]:
    op = f"{DST}/bake_output_q{tgt}.npz"
    ip = f"{DST}/bake_input_q{tgt}.npz"
    if not os.path.exists(op):
        rows.append((tgt, None)); continue
    inp = np.load(ip, allow_pickle=True); outp = np.load(op, allow_pickle=True)
    body_v = inp["body_verts"].astype(np.float64); body_f = inp["body_faces"]
    gf = inp["garment_faces"]; math_v = inp["garment_verts"].astype(np.float64)
    phys_v = outp["draped_verts"].astype(np.float64)
    disp = np.linalg.norm(phys_v - math_v, axis=1)
    for deg, tag in [(0, "front"), (35, "34")]:
        render(body_v, body_f, phys_v, gf, deg, f"q{tgt}_{tag}.png")
    rows.append((tgt, dict(nv=len(phys_v), mean=disp.mean()*1000, mx=disp.max()*1000)))
    print(f"q{tgt}: {len(phys_v)} verts, disp mean {disp.mean()*1000:.1f}mm max {disp.max()*1000:.1f}mm")

html = ['<!doctype html><meta charset=utf-8><title>Resolution bracket</title>',
        '<style>body{background:#0d0d12;color:#ddd;font-family:system-ui;margin:0}',
        'h1{font-size:17px;padding:14px 20px;border-bottom:1px solid #262630;margin:0}',
        '.col{display:inline-block;vertical-align:top;text-align:center;padding:14px}',
        'h2{font-size:14px;margin:6px}p{color:#9aa;font-size:12px;margin:2px}',
        'img{background:#fff;border-radius:8px;width:300px;display:block;margin:6px 0}</style>',
        '<h1>Resolution bracket — RAW physics, boxify held constant (higher res &rarr; right)</h1>']
for tgt, info in rows:
    html.append('<div class=col>')
    if info is None:
        html.append(f'<h2>q{tgt}</h2><p>(bake not finished)</p>')
    else:
        html.append(f'<h2>q{tgt} — {info["nv"]} verts</h2>')
        html.append(f'<p>drape disp mean {info["mean"]:.1f}mm / max {info["mx"]:.1f}mm</p>')
        html.append(f'<img src="q{tgt}_front.png"><img src="q{tgt}_34.png">')
    html.append('</div>')
open(f"{DST}/index.html", "w").write("\n".join(html))
print("Gallery:", f"{DST}/index.html")
