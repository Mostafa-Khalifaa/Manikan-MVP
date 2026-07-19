"""
Phase 1, stage 3 (runs in the BACKEND venv — has trimesh + PIL).

Renders Tier-1 (kinematic) vs physics-draped garment side by side on the body,
shaded so folds/wrinkles are visible, plus numeric diagnostics (how much physics
changed the mesh, and whether it introduced any body interpenetration).
"""
import os
import numpy as np
import trimesh
from PIL import Image, ImageDraw

HERE = os.path.dirname(__file__)
inp = np.load(os.path.join(HERE, "bake_input.npz"), allow_pickle=True)
outp = np.load(os.path.join(HERE, "bake_output.npz"), allow_pickle=True)
DST = "/home/hashim/Downloads/manikan_phase1_drape"
os.makedirs(DST, exist_ok=True)

body_v = inp["body_verts"].astype(np.float64)
body_f = inp["body_faces"]
gf = inp["garment_faces"]
math_v = inp["garment_verts"].astype(np.float64)   # Tier-1
phys_v = outp["draped_verts"].astype(np.float64)   # physics

# --- diagnostics -------------------------------------------------------------
disp = np.linalg.norm(phys_v - math_v, axis=1)
print(f"physics vs Tier-1 displacement:  mean={disp.mean()*1000:.1f}mm  "
      f"max={disp.max()*1000:.1f}mm  p95={np.percentile(disp,95)*1000:.1f}mm")

bmesh = trimesh.Trimesh(body_v, body_f, process=False)
closest, dist, tri = trimesh.proximity.closest_point(bmesh, phys_v)
signed = np.einsum("nk,nk->n", phys_v - closest, bmesh.face_normals[tri])
inside = int((signed < -0.001).sum())
print(f"physics garment verts inside body (>1mm): {inside} / {len(phys_v)}")

# --- shaded raster renderer --------------------------------------------------
def rotY(v, d):
    a = np.radians(d); c, s = np.cos(a), np.sin(a)
    return v @ np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]]).T

def render(gverts, deg, fname, W=460, H=680, pad=25):
    L = np.array([0.4, 0.55, 0.75]); L /= np.linalg.norm(L)
    parts = [(body_v, body_f, np.array([205, 170, 145])),
             (gverts, gf, np.array([90, 120, 190]))]
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

for deg, tag in [(0, "front"), (35, "34"), (90, "side")]:
    render(math_v, deg, f"tier1_{tag}.png")
    render(phys_v, deg, f"physics_{tag}.png")

html = ['<!doctype html><meta charset=utf-8><title>Phase 1: physics drape vs Tier-1</title>',
        '<style>body{background:#111;color:#ddd;font-family:system-ui;margin:0}',
        'h1{font-size:17px;padding:14px 20px;border-bottom:1px solid #333;margin:0}',
        'p{padding:6px 20px;color:#9aa;font-size:13px;margin:0}',
        '.row{display:flex;gap:16px;padding:16px;align-items:flex-start;flex-wrap:wrap}',
        '.col{text-align:center}.col h2{font-size:13px;margin:6px}',
        'img{background:#fff;border-radius:8px;width:300px}</style>',
        '<h1>Phase 1 — Physics-baked drape vs Tier-1 kinematic fit (male, 175/78, size M)</h1>',
        f'<p>Displacement mean {disp.mean()*1000:.1f}mm / max {disp.max()*1000:.1f}mm &nbsp;·&nbsp; '
        f'interpenetration: {inside} verts inside body</p>']
for tag in ["front", "34", "side"]:
    html.append('<div class=row>')
    html.append(f'<div class=col><h2>Tier-1 ({tag})</h2><img src="tier1_{tag}.png"></div>')
    html.append(f'<div class=col><h2>Physics ({tag})</h2><img src="physics_{tag}.png"></div>')
    html.append('</div>')
open(os.path.join(DST, "index.html"), "w").write("\n".join(html))
print("Gallery:", os.path.join(DST, "index.html"))
