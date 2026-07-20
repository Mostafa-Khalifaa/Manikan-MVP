"""
Clean-template XL densification set + M-centre (BACKEND venv).
Uses the HEM-FIXED template (region_box065_clean). Generates:
  - a 3x3 fine XL-slab grid over build{0,0.5,1} x height{0,0.5,1}
  - the XL holdout at (0.3, XL, 0.7)  (ground truth for interp error)
  - one M-centre (avg build, M, avg height) to confirm the clean hem survives physics
"""
import sys, os, json
import numpy as np
import torch
sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main, garment as G

OUT = "/home/hashim/Downloads/manikan_pilot_clean"; os.makedirs(OUT, exist_ok=True)
SH = 0.65
d = np.load("/home/hashim/Downloads/manikan_boxsweep/region_box065_clean.npz")
tee_v = d["verts"].astype(np.float64); tee_f = d["faces"].astype(np.int64)
rb = np.load("/home/hashim/Downloads/manikan_relaxed_tee/relaxed_ref_body.npz")
ref_v = rb["verts"].astype(np.float64); faces = rb["faces"].astype(np.int64)
model, rings = main._load_smpl_model("male"); lbs = model.lbs_weights.detach().cpu().numpy()
binding = G.bind_garment(tee_v, ref_v, faces, "clean")

BUILD = [(58, 88, 74, 88), (80, 100, 88, 100), (106, 116, 108, 112)]
SIZE_CHEST = [46.0, 52.0, 62.0]; HEIGHT = [165, 175, 185]
def lerp(t, x):
    x = float(np.clip(x, 0, len(t)-1)); i = int(np.floor(x)); f = x-i
    return np.array(t[i], float)*(1-f)+np.array(t[min(i+1, len(t)-1)], float)*f
def fit(a, b, c):
    wt, ch, wa, hp = lerp(BUILD, a); gch = float(lerp([[s] for s in SIZE_CHEST], b)[0]); h = float(lerp([[v] for v in HEIGHT], c)[0])
    betas = main.solve_betas(model, rings, h, wt, ch, wa, hp, num_iters=40)
    bp = torch.zeros(1, 69); bp[0, 45:48] = torch.tensor([0., 0., -SH]); bp[0, 48:51] = torch.tensor([0., 0., SH])
    with torch.no_grad():
        out = model(betas=betas, global_orient=torch.zeros(1, 3), body_pose=bp, return_verts=True)
    body = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
    fitted = G.deform_garment(binding, body, faces)
    try: fitted = G.apply_size_looseness(fitted, binding, body, faces, lbs, garment_chest_cm=gch, body_chest_cm=ch, ref_body_verts=ref_v)
    except ValueError: pass
    fitted, _ = G.resolve_interpenetration(fitted, body, faces, margin=0.006, iters=3)
    t = (fitted[:, 1]-fitted[:, 1].min())/max(fitted[:, 1].max()-fitted[:, 1].min(), 1e-9)
    pin = np.clip((t-0.86)/(0.94-0.86), 0.0, 1.0)
    return body, fitted, pin

pts = {}
for bi in [0.0, 0.5, 1.0]:
    for hi in [0.0, 0.5, 1.0]:
        pts[f"xf_{bi}_{hi}"] = (bi, 2, hi)
pts["xf_hold"] = (0.3, 2, 0.7)
pts["m_center"] = (1.0, 1, 1.0)
meta = {}
for name, (a, b, c) in pts.items():
    body, fitted, pin = fit(a, b, c)
    np.savez(f"{OUT}/bake_input_{name}.npz", garment_verts=fitted.astype(np.float32), garment_faces=tee_f,
             body_verts=body.astype(np.float32), body_faces=faces, pin_weights=pin.astype(np.float32))
    meta[name] = [a, b, c]; print(f"{name}: {a},{b},{c}")
json.dump(meta, open(f"{OUT}/meta.json", "w"))
print(f"wrote {len(pts)} clean-template inputs")
