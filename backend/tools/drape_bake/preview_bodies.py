"""
Preview: fit the locked clean tee to several body shapes (kinematic fit via
bind+deform on the template's fixed 2880-vert topology) and export a bake input
per body. Runs in BACKEND venv. bake_one.py then bakes each; render step follows.
"""
import sys, os
import numpy as np
import torch

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

HERE = os.path.dirname(__file__)
tpl = np.load("/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend/models/garments/tshirt_smpl_clean/tee_cage.npz")
tee_v = tpl["verts"].astype(np.float64)
tee_f = tpl["faces"].astype(np.int64)

# bodies: name, sex, h, w, chest, waist, hip
BODIES = [
    ("slim",    "male",   178, 62,  90,  74,  88),
    ("average", "male",   175, 78,  96,  85,  98),
    ("large",   "male",   178, 105, 112, 108, 112),
    ("female",  "female", 165, 60,  88,  70,  96),
]

# bind the template once against the MALE beta=0 reference (the space it lives in)
male_model, _ = main._load_smpl_model("male")
ref_body = G.get_reference_body(male_model, "male")
faces = np.asarray(male_model.faces, dtype=np.int64)
binding = G.bind_garment(tee_v, ref_body, faces, "clean_tee")

for name, sex, h, w, ch, wa, hi in BODIES:
    model, rings = main._load_smpl_model(sex)
    betas = main.solve_betas(model, rings, h, w, ch, wa, hi, num_iters=40)
    with torch.no_grad():
        out = model(betas=betas, global_orient=torch.zeros(1, 3),
                    body_pose=torch.zeros(1, 69), return_verts=True)
    body = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)

    fitted = G.deform_garment(binding, body, faces)              # kinematic fit
    fitted, npush = G.resolve_interpenetration(fitted, body, faces, margin=0.006, iters=3)

    t = (fitted[:, 1] - fitted[:, 1].min()) / max(fitted[:, 1].max() - fitted[:, 1].min(), 1e-9)
    pin = np.clip((t - 0.86) / (0.94 - 0.86), 0.0, 1.0)

    np.savez(os.path.join(HERE, f"bake_input_{name}.npz"),
             garment_verts=fitted.astype(np.float32), garment_faces=tee_f,
             body_verts=body.astype(np.float32), body_faces=faces,
             pin_weights=pin.astype(np.float32), meta=np.array([sex, name]))
    print(f"{name:<8} ({sex}): pushed={npush}, pinned={(pin>0.5).sum()} -> bake_input_{name}.npz")
