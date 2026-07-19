"""
Phase 1, stage 1 (runs in the BACKEND venv).

Produces exactly the mesh Tier-1 fits onto the body (`math_verts`, native SMPL
scale, pose 0) for one representative body + size, plus the collision body and a
pin-weight array, and saves everything to a single .npz that the bpy bake script
(separate venv) consumes.

Why a file hand-off: the backend venv (py3.14, torch/smplx/trimesh) and the bpy
venv (py3.11, Blender) can't share a process, so all Pipeline-2 offline stages
communicate through .npz files.
"""
import sys, os
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = os.path.join(os.path.dirname(__file__), "bake_input.npz")

# Representative male body + a mid size (M). Chosen so there is some looseness to
# actually drape (a dead-tight fit would show almost no folds either way).
SEX = "male"
H, W, CH, WA, HI = 175, 78, 96, 85, 98
GARMENT_CHEST_CM = 50.0      # size M flat chest width (from PRODUCT_CATALOG tshirt-001)

# --- Solve body shape and produce the native-scale, pose-0 body -------------
model, rings = main._load_smpl_model(SEX)
betas = main.solve_betas(model, rings, H, W, CH, WA, HI, num_iters=40)
with torch.no_grad():
    out = model(betas=betas, global_orient=torch.zeros(1, 3),
                body_pose=torch.zeros(1, 69), return_verts=True)
body_verts = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
body_faces = np.asarray(model.faces, dtype=np.int64)

# --- Reproduce Tier-1's fitting chain up to (but not including) the GLB build.
# This `garment` array is precisely the runtime `math_verts` a delta is added to.
template = G.load_garment_template(SEX)
ref_body = G.get_reference_body(model, SEX)
binding = G.bind_garment(template["vertices"], ref_body, body_faces, SEX)
garment = G.deform_garment(binding, body_verts, body_faces)
lbs = model.lbs_weights.detach().cpu().numpy()
garment = G.apply_size_looseness(garment, binding, body_verts, body_faces, lbs,
                                 GARMENT_CHEST_CM, CH, ref_body)
garment = G.smooth_garment(garment, template["faces"])
garment, n_pushed = G.resolve_interpenetration(garment, body_verts, body_faces)
garment_faces = np.asarray(template["faces"], dtype=np.int64)

# --- Pin weights: the shirt must hang from the shoulders/collar, else gravity
# drags the whole thing to the floor. Pin the top Y-band (shoulder/collar shelf)
# with a short falloff; everything below is free to drape. t=0 hem, t=1 top.
gy = garment[:, 1]
t = (gy - gy.min()) / max(gy.max() - gy.min(), 1e-9)
PIN_START, PIN_FULL = 0.86, 0.93   # fade in from 86% height, fully pinned by 93%
pin_weights = np.clip((t - PIN_START) / (PIN_FULL - PIN_START), 0.0, 1.0)

np.savez(
    OUT,
    garment_verts=garment.astype(np.float32),
    garment_faces=garment_faces,
    body_verts=body_verts.astype(np.float32),
    body_faces=body_faces,
    pin_weights=pin_weights.astype(np.float32),
    meta=np.array([SEX, str(H), str(W), str(CH), str(WA), str(HI), str(GARMENT_CHEST_CM)]),
)
print(f"Wrote {OUT}")
print(f"  garment: {len(garment)} verts, {len(garment_faces)} faces  (n_pushed={n_pushed})")
print(f"  body:    {len(body_verts)} verts, {len(body_faces)} faces")
print(f"  pinned verts (weight>0.5): {(pin_weights>0.5).sum()} / {len(pin_weights)}")
print(f"  garment Y-range: [{gy.min():.3f}, {gy.max():.3f}]  body Y-range: "
      f"[{body_verts[:,1].min():.3f}, {body_verts[:,1].max():.3f}]")
