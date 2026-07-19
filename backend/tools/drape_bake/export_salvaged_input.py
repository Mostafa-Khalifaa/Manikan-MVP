"""
Phase-1 retest with the salvaged clean tee (runs in BACKEND venv).

Aligns the standalone salvaged tee onto the test body's torso, pushes out any
interpenetration (so the cloth starts cleanly OUTSIDE the body, boxy shape
intact — NOT shrink-wrapped), computes pin weights, and writes bake_input.npz
in the same format bake_one.py already consumes. Also renders the aligned
pre-physics state so alignment can be sanity-checked before spending a bake.
"""
import sys, os
import numpy as np
import torch
import trimesh
from PIL import Image, ImageDraw

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

HERE = os.path.dirname(__file__)
DST = "/home/hashim/Downloads/manikan_salvaged_tee"
tee = np.load("/home/hashim/Downloads/manikan_salvaged_tee/salvaged_tee.npz")
tv = tee["verts"].astype(np.float64)
tf = tee["faces"].astype(np.int64)

# --- test body (same as Phase 1: male 175/78) -------------------------------
SEX, H, W, CH, WA, HI = "male", 175, 78, 96, 85, 98
model, rings = main._load_smpl_model(SEX)
betas = main.solve_betas(model, rings, H, W, CH, WA, HI, num_iters=40)
with torch.no_grad():
    out = model(betas=betas, global_orient=torch.zeros(1, 3),
                body_pose=torch.zeros(1, 69), return_verts=True)
body = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
body_f = np.asarray(model.faces, dtype=np.int64)

# --- align tee onto torso (NON-UNIFORM fit to torso bbox + looseness) --------
# The tee is proportionally tall-and-flat; the torso is shorter-and-deeper, so
# a single uniform scale can't fit both without the tee's panels starting
# inside the body. Fit each axis to the torso's own extent, with margins that
# make the tee sit LOOSE (boxy) rather than shrink-wrapped.
by = body[:, 1]
COLLAR_Y = 0.40                   # collar/neck-base height
HEM_Y = -0.14                     # hem at hip

torso = (by > HEM_Y) & (by < COLLAR_Y) & (np.abs(body[:, 0]) < 0.25)
tmin, tmax = body[torso].min(0), body[torso].max(0)
torso_bbox = tmax - tmin
torso_ctr = (tmin + tmax) / 2.0

MARGIN = np.array([1.28, 1.02, 1.55])   # X loose, Y ~exact, Z extra loose (flat tee)
target = torso_bbox * MARGIN

tv = tv.copy()
tv -= tv.min(0)                                 # to origin corner
sc = target / (tv.max(0) - tv.min(0))           # per-axis scale to torso+margin
tv *= sc
# centre X/Z on torso centre; hem to HEM_Y
tv[:, 0] += torso_ctr[0] - (tv[:, 0].min() + tv[:, 0].max()) / 2.0
tv[:, 2] += torso_ctr[2] - (tv[:, 2].min() + tv[:, 2].max()) / 2.0
tv[:, 1] += HEM_Y - tv[:, 1].min()
print(f"torso bbox={np.round(torso_bbox,3)}  scale={np.round(sc,3)}")
print(f"aligned tee: bbox={np.round(tv.max(0)-tv.min(0),3)}, Y[{tv[:,1].min():.3f},{tv[:,1].max():.3f}]")

# --- push out any verts inside the body (keep boxy shape, no shrink-wrap) ----
tv, n_pushed = G.resolve_interpenetration(tv, body, body_f, margin=0.006, iters=4)
print(f"pushed out {n_pushed} interpenetrating verts")

# --- pin the collar/shoulder band -------------------------------------------
t = (tv[:, 1] - tv[:, 1].min()) / max(tv[:, 1].max() - tv[:, 1].min(), 1e-9)
pin = np.clip((t - 0.85) / (0.93 - 0.85), 0.0, 1.0)
print(f"pinned verts (>0.5): {(pin>0.5).sum()} / {len(tv)}")

np.savez(os.path.join(HERE, "bake_input.npz"),
         garment_verts=tv.astype(np.float32), garment_faces=tf,
         body_verts=body.astype(np.float32), body_faces=body_f,
         pin_weights=pin.astype(np.float32),
         meta=np.array([SEX, "salvaged_tee"]))
print("wrote bake_input.npz")

# --- sanity render of the ALIGNED starting state (pre-physics) ---------------
def rotY(v, d):
    a = np.radians(d); c, s = np.cos(a), np.sin(a)
    return v @ np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]]).T
def render(deg, fname, W=440, H=650, pad=25):
    L = np.array([0.4, 0.55, 0.75]); L /= np.linalg.norm(L)
    parts = [(body, body_f, np.array([205, 170, 145])), (tv, tf, np.array([90, 120, 190]))]
    rv = [rotY(p[0], deg) for p in parts]; allv = np.vstack(rv)
    lo = allv[:, :2].min(0); hi = allv[:, :2].max(0); sp = hi-lo; sp[sp == 0] = 1
    s = min((W-2*pad)/sp[0], (H-2*pad)/sp[1]); tris = []
    for (vs, fs, rgb), vv in zip(parts, rv):
        tvv = vv[fs]; n = np.cross(tvv[:, 1]-tvv[:, 0], tvv[:, 2]-tvv[:, 0])
        nl = np.linalg.norm(n, axis=1, keepdims=True); nl[nl == 0] = 1; n /= nl
        sh = np.clip(0.30+0.70*(n@L), 0.15, 1.0); cen = tvv.mean(1)
        for i in np.where(n[:, 2] > 0.01)[0]: tris.append((cen[i, 2], tvv[i], rgb*sh[i]))
    tris.sort(key=lambda z: z[0])
    canvas = Image.new("RGB", (W, H), (245, 245, 248)); d = ImageDraw.Draw(canvas)
    for _, tvv, col in tris:
        d.polygon([(pad+(x-lo[0])*s, H-pad-(y-lo[1])*s) for x, y, _ in tvv], fill=tuple(int(c) for c in col))
    canvas.save(os.path.join(DST, fname))
for deg, tag in [(0, "front"), (35, "34")]:
    render(deg, f"aligned_{tag}.png")
print("aligned sanity render:", os.path.join(DST, "aligned_front.png"))
