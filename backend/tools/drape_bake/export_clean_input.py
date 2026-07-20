"""
Prepare bake_input.npz for the clean SMPL-derived quad tee (BACKEND venv).
The tee was extracted from the beta=0 body, so it is already aligned to it —
no scale/position fitting needed. Light push-out + shoulder pin, then save in
the format bake_one.py consumes.
"""
import sys, os
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

HERE = os.path.dirname(__file__)
tee = np.load("/home/hashim/Downloads/manikan_clean_tee/quad_tee.npz")
tv = tee["verts"].astype(np.float64)
tf = tee["faces_tri"].astype(np.int64)

# beta=0 male body (the tee was derived from this exact body)
model, rings = main._load_smpl_model("male")
with torch.no_grad():
    out = model(betas=torch.zeros(1, 10), global_orient=torch.zeros(1, 3),
                body_pose=torch.zeros(1, 69), return_verts=True)
body = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
body_f = np.asarray(model.faces, dtype=np.int64)

tv, n_pushed = G.resolve_interpenetration(tv, body, body_f, margin=0.006, iters=3)
print(f"pushed out {n_pushed} verts")

t = (tv[:, 1] - tv[:, 1].min()) / max(tv[:, 1].max() - tv[:, 1].min(), 1e-9)
pin = np.clip((t - 0.86) / (0.94 - 0.86), 0.0, 1.0)
print(f"pinned verts (>0.5): {(pin>0.5).sum()} / {len(tv)}")

np.savez(os.path.join(HERE, "bake_input.npz"),
         garment_verts=tv.astype(np.float32), garment_faces=tf,
         body_verts=body.astype(np.float32), body_faces=body_f,
         pin_weights=pin.astype(np.float32), meta=np.array(["male", "clean_quad_tee"]))
print(f"wrote bake_input.npz ({len(tv)} garment verts)")
