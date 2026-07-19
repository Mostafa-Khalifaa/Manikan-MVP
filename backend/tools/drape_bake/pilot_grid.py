"""
Pilot grid generator (BACKEND venv). Builds a 3x3x3 = 27-point grid over
  A = body build (slim / average / large)
  B = garment size (S / M / XL)
  C = height       (short / avg / tall)
plus 2 held-out cell-interior points for interpolation validation.

The grid deliberately spans the full corners (min/mid/max on every axis) so the
two stress corners are included:
  - (slim build, XL size, short height)  -> smallest body + largest size = MAX excess
  - (large build, S size, tall height)   -> largest body + smallest size = tightest

For each point we build the RELAXED-pose body, kinematically fit the LOCKED tee
(q4000 + boxify 0.65), apply size looseness, and write a bake_input. We record
the pre-physics kinematic fit so the delta = physics - kinematic can be extracted
after baking. Garment topology is fixed (bound once, deformed per body) so every
point shares vertex correspondence -> deltas are directly interpolable.
"""
import sys, os, json
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = "/home/hashim/Downloads/manikan_pilot"; os.makedirs(OUT, exist_ok=True)
SH = 0.65  # relaxed shoulder angle (locked)

# --- locked template region (q4000, boxify 0.65) ----------------------------
d = np.load("/home/hashim/Downloads/manikan_boxsweep/region_box065.npz")
tee_v = d["verts"].astype(np.float64); tee_f = d["faces"].astype(np.int64)
rb = np.load("/home/hashim/Downloads/manikan_relaxed_tee/relaxed_ref_body.npz")
ref_v = rb["verts"].astype(np.float64); faces = rb["faces"].astype(np.int64)

model, rings = main._load_smpl_model("male")
lbs = model.lbs_weights.detach().cpu().numpy()
binding = G.bind_garment(tee_v, ref_v, faces, "pilot")

# --- axis level definitions (index 0,1,2) -----------------------------------
# build: (weight, chest, waist, hip)  — measurements in cm/kg
BUILD = [(58, 88, 74, 88),      # 0 slim
         (80, 100, 88, 100),    # 1 average
         (106, 116, 108, 112)]  # 2 large
SIZE_CHEST = [46.0, 52.0, 62.0]  # 0 S, 1 M, 2 XL  (flat garment chest cm)
HEIGHT = [165, 175, 185]         # 0 short, 1 avg, 2 tall

def make_body(hi_cm, wt, chest, waist, hip):
    betas = main.solve_betas(model, rings, hi_cm, wt, chest, waist, hip, num_iters=40)
    bp = torch.zeros(1, 69)
    bp[0, (16-1)*3:(16-1)*3+3] = torch.tensor([0., 0., -SH])
    bp[0, (17-1)*3:(17-1)*3+3] = torch.tensor([0., 0., +SH])
    with torch.no_grad():
        out = model(betas=betas, global_orient=torch.zeros(1, 3), body_pose=bp, return_verts=True)
    return out.vertices.squeeze(0).cpu().numpy().astype(np.float64)

def fit_point(a, b, c):
    """a,b,c are fractional axis coords (0..2). Returns (body, kinematic_fit, pin)."""
    def lerp(tbl, x):
        x = float(np.clip(x, 0, len(tbl)-1)); i = int(np.floor(x)); f = x-i
        lo = np.array(tbl[i], float); h2 = np.array(tbl[min(i+1, len(tbl)-1)], float)
        return lo*(1-f)+h2*f
    wt, chest, waist, hip = lerp(BUILD, a)
    gchest = float(lerp([[s] for s in SIZE_CHEST], b)[0])
    h = float(lerp([[v] for v in HEIGHT], c)[0])
    body = make_body(h, wt, chest, waist, hip)
    fitted = G.deform_garment(binding, body, faces)
    try:
        fitted = G.apply_size_looseness(fitted, binding, body, faces, lbs,
                                        garment_chest_cm=gchest, body_chest_cm=chest, ref_body_verts=ref_v)
    except ValueError:
        pass  # TOO_SMALL: garment tighter than body -> keep plain fit (tightest corner)
    fitted, _ = G.resolve_interpenetration(fitted, body, faces, margin=0.006, iters=3)
    t = (fitted[:, 1]-fitted[:, 1].min())/max(fitted[:, 1].max()-fitted[:, 1].min(), 1e-9)
    pin = np.clip((t-0.86)/(0.94-0.86), 0.0, 1.0)
    return body, fitted, pin, dict(weight=wt, chest=chest, waist=waist, hip=hip, gchest=gchest, height=h)

manifest = {"tee_faces_shape": list(tee_f.shape), "grid": [], "holdout": []}

# --- 27 grid points ----------------------------------------------------------
for ia in range(3):
    for ib in range(3):
        for ic in range(3):
            name = f"g{ia}{ib}{ic}"
            body, fit, pin, params = fit_point(ia, ib, ic)
            np.savez(f"{OUT}/bake_input_{name}.npz",
                     garment_verts=fit.astype(np.float32), garment_faces=tee_f,
                     body_verts=body.astype(np.float32), body_faces=faces,
                     pin_weights=pin.astype(np.float32))
            manifest["grid"].append(dict(name=name, idx=[ia, ib, ic], coord=[ia, ib, ic], **params))
            print(f"{name}: chest={params['chest']:.0f} gchest={params['gchest']:.0f} h={params['height']:.0f}")

# --- held-out interpolation test points (cell interiors) ---------------------
HOLD = [("h_lowexcess", (0.5, 0.5, 0.5)),   # centre of slim..avg / S..M / short..avg cell
        ("h_hiexcess",  (0.5, 1.5, 0.5))]   # near the excess side (M..XL)
for name, (a, b, c) in HOLD:
    body, fit, pin, params = fit_point(a, b, c)
    np.savez(f"{OUT}/bake_input_{name}.npz",
             garment_verts=fit.astype(np.float32), garment_faces=tee_f,
             body_verts=body.astype(np.float32), body_faces=faces,
             pin_weights=pin.astype(np.float32))
    manifest["holdout"].append(dict(name=name, coord=[a, b, c], **params))
    print(f"{name}: coord={a},{b},{c}")

json.dump(manifest, open(f"{OUT}/manifest.json", "w"), indent=1)
print(f"\nWrote {len(manifest['grid'])} grid + {len(manifest['holdout'])} holdout inputs to {OUT}")
