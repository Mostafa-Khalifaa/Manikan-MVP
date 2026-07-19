"""
Generate corrected interpolation-holdout points (BACKEND venv), consistent with
the LOCKED discrete-size design: size = exact slab index (integer b), only
build (a) and height (c) are fractional. Off-0.5 on build/height so the bilinear
blend is exercised at non-degenerate fractions (not the 0.5 midpoint where a
symmetric bug would hide). Spans all three size slabs, incl. the XL slab that
sits near the max-excess corner.
"""
import sys, os, json
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = "/home/hashim/Downloads/manikan_pilot"; SH = 0.65
d = np.load("/home/hashim/Downloads/manikan_boxsweep/region_box065.npz")
tee_v = d["verts"].astype(np.float64); tee_f = d["faces"].astype(np.int64)
rb = np.load("/home/hashim/Downloads/manikan_relaxed_tee/relaxed_ref_body.npz")
ref_v = rb["verts"].astype(np.float64); faces = rb["faces"].astype(np.int64)
model, rings = main._load_smpl_model("male")
lbs = model.lbs_weights.detach().cpu().numpy()
binding = G.bind_garment(tee_v, ref_v, faces, "hold")

BUILD = [(58, 88, 74, 88), (80, 100, 88, 100), (106, 116, 108, 112)]
SIZE_CHEST = [46.0, 52.0, 62.0]
HEIGHT = [165, 175, 185]

def lerp(tbl, x):
    x = float(np.clip(x, 0, len(tbl)-1)); i = int(np.floor(x)); f = x-i
    lo = np.array(tbl[i], float); hi = np.array(tbl[min(i+1, len(tbl)-1)], float)
    return lo*(1-f)+hi*f

def fit_point(a, b, c):
    wt, chest, waist, hip = lerp(BUILD, a)
    gchest = float(lerp([[s] for s in SIZE_CHEST], b)[0])
    h = float(lerp([[v] for v in HEIGHT], c)[0])
    betas = main.solve_betas(model, rings, h, wt, chest, waist, hip, num_iters=40)
    bp = torch.zeros(1, 69)
    bp[0, (16-1)*3:(16-1)*3+3] = torch.tensor([0., 0., -SH])
    bp[0, (17-1)*3:(17-1)*3+3] = torch.tensor([0., 0., +SH])
    with torch.no_grad():
        out = model(betas=betas, global_orient=torch.zeros(1, 3), body_pose=bp, return_verts=True)
    body = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
    fitted = G.deform_garment(binding, body, faces)
    try:
        fitted = G.apply_size_looseness(fitted, binding, body, faces, lbs,
                                        garment_chest_cm=gchest, body_chest_cm=chest, ref_body_verts=ref_v)
    except ValueError:
        pass
    fitted, _ = G.resolve_interpenetration(fitted, body, faces, margin=0.006, iters=3)
    t = (fitted[:, 1]-fitted[:, 1].min())/max(fitted[:, 1].max()-fitted[:, 1].min(), 1e-9)
    pin = np.clip((t-0.86)/(0.94-0.86), 0.0, 1.0)
    return body, fitted, pin, dict(chest=chest, gchest=gchest, height=h)

# exact size slab (integer b), fractional off-0.5 build/height
HOLD = [("h_M_bh",  (0.3, 1, 0.7)),   # M slab, build .3 / height .7
        ("h_XL_bh", (0.3, 2, 0.7)),   # XL slab (near excess corner), build .3 / height .7
        ("h_S_bh",  (0.7, 0, 0.3))]   # S slab (tight), build .7 / height .3

records = []
for name, (a, b, c) in HOLD:
    body, fit, pin, params = fit_point(a, b, c)
    np.savez(f"{OUT}/bake_input_{name}.npz",
             garment_verts=fit.astype(np.float32), garment_faces=tee_f,
             body_verts=body.astype(np.float32), body_faces=faces,
             pin_weights=pin.astype(np.float32))
    records.append(dict(name=name, coord=[a, b, c], size_idx=b, **params))
    print(f"{name}: build_frac={a} size_slab={b} height_frac={c}  chest={params['chest']:.0f} h={params['height']:.0f}")

json.dump(records, open(f"{OUT}/holdouts_discrete.json", "w"), indent=1)
print(f"Wrote {len(records)} discrete-size holdouts")
