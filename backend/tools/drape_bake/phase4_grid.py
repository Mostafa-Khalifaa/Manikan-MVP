"""
Phase 4: full grid generator (BACKEND venv). MALE only (female is a separate
follow-up pass with its own delta library per the locked plan).

Locked recipe: q4000 mesh, boxify 0.65, HEM-RESAMPLED template
(region_box065_clean), self-collision OFF at bake time, relaxed pose.

Discrete size design: 5 catalog size slabs (S, M, L, XL, XXL), each with its
own 5x5 build x height sub-grid (densification-validated: fine sampling
measurably cuts interpolation error at the loose/XL end). Total 5x5x5 = 125.
"""
import sys, os, json
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = "/home/hashim/Downloads/manikan_phase4"; os.makedirs(OUT, exist_ok=True)
SH = 0.65

d = np.load("/home/hashim/Downloads/manikan_boxsweep/region_box065_clean.npz")
tee_v = d["verts"].astype(np.float64); tee_f = d["faces"].astype(np.int64)
rb = np.load("/home/hashim/Downloads/manikan_relaxed_tee/relaxed_ref_body.npz")
ref_v = rb["verts"].astype(np.float64); faces = rb["faces"].astype(np.int64)

model, rings = main._load_smpl_model("male")
lbs = model.lbs_weights.detach().cpu().numpy()
binding = G.bind_garment(tee_v, ref_v, faces, "phase4")

# 5-level axes: build (weight,chest,waist,hip), size (flat garment chest cm), height
BUILD5 = [(56, 84, 70, 84), (68, 92, 79, 91), (80, 100, 88, 100), (93, 108, 98, 106), (106, 116, 108, 112)]
SIZE5 = ["S", "M", "L", "XL", "XXL"]
SIZE5_CHEST = [44.0, 50.0, 56.0, 62.0, 68.0]
HEIGHT5 = [162, 169, 175, 181, 188]

def make_body(h_cm, wt, chest, waist, hip):
    betas = main.solve_betas(model, rings, h_cm, wt, chest, waist, hip, num_iters=40)
    bp = torch.zeros(1, 69)
    bp[0, 45:48] = torch.tensor([0., 0., -SH]); bp[0, 48:51] = torch.tensor([0., 0., SH])
    with torch.no_grad():
        out = model(betas=betas, global_orient=torch.zeros(1, 3), body_pose=bp, return_verts=True)
    return out.vertices.squeeze(0).cpu().numpy().astype(np.float64)

manifest = []
n = 0
for si, size_name in enumerate(SIZE5):
    gchest = SIZE5_CHEST[si]
    for bi, (wt, chest, waist, hip) in enumerate(BUILD5):
        for hi, h in enumerate(HEIGHT5):
            name = f"s{si}_b{bi}_h{hi}"
            body = make_body(h, wt, chest, waist, hip)
            fitted = G.deform_garment(binding, body, faces)
            try:
                fitted = G.apply_size_looseness(fitted, binding, body, faces, lbs,
                                                garment_chest_cm=gchest, body_chest_cm=chest, ref_body_verts=ref_v)
            except ValueError:
                pass  # size tighter than body -> keep plain kinematic fit
            fitted, npush = G.resolve_interpenetration(fitted, body, faces, margin=0.006, iters=3)
            t = (fitted[:, 1]-fitted[:, 1].min())/max(fitted[:, 1].max()-fitted[:, 1].min(), 1e-9)
            pin = np.clip((t-0.86)/(0.94-0.86), 0.0, 1.0)
            np.savez(f"{OUT}/bake_input_{name}.npz",
                     garment_verts=fitted.astype(np.float32), garment_faces=tee_f,
                     body_verts=body.astype(np.float32), body_faces=faces,
                     pin_weights=pin.astype(np.float32))
            manifest.append(dict(name=name, size=size_name, size_idx=si, build_idx=bi, height_idx=hi,
                                  weight=wt, chest=chest, gchest=gchest, height=h))
            n += 1
print(f"wrote {n} bake inputs to {OUT}")
json.dump(dict(sizes=SIZE5, grid=manifest), open(f"{OUT}/manifest.json", "w"), indent=1)
