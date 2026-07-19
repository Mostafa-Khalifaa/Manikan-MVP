"""
Author the crisp tee DIRECTLY in the relaxed pose (arms lowered), so the
armholes/sleeves are shaped for arms-down and never get crushed. Runs in
BACKEND venv. Also saves the relaxed beta=0 reference body for binding.
"""
import sys, os
import numpy as np
import torch
import trimesh
from trimesh import graph

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = "/home/hashim/Downloads/manikan_relaxed_tee"; os.makedirs(OUT, exist_ok=True)
SHOULDER_ANGLE = 0.65   # relaxed pose lower amount
# boxify strength override for the isolation sweep (default = current recipe value)
BOX_STRENGTH_OVERRIDE = float(os.environ.get("BOX_STRENGTH", "0.65"))
REGION_TAG = os.environ.get("REGION_TAG", "")   # suffix for sweep outputs

TSHIRT_JOINT_IDS = [0, 3, 6, 9, 13, 14, 16, 17, 18, 19]
TORSO_JOINTS = [0, 3, 6, 9]                    # for boxify (spine only, not shoulders/sleeves)
SLEEVE_LEN_M = 0.22
GARMENT_LEN_M = 0.64
OFFSET_M = 0.025
BOX_A, BOX_B, BOX_N = 0.220, 0.140, 4.0        # moderate boxy (less excess than before)
BOX_STRENGTH = BOX_STRENGTH_OVERRIDE

model, rings = main._load_smpl_model("male")
# relaxed beta=0 body
bp = torch.zeros(1, 69)
bp[0, (16 - 1) * 3:(16 - 1) * 3 + 3] = torch.tensor([0., 0., -SHOULDER_ANGLE])
bp[0, (17 - 1) * 3:(17 - 1) * 3 + 3] = torch.tensor([0., 0., +SHOULDER_ANGLE])
with torch.no_grad():
    out = model(betas=torch.zeros(1, 10), global_orient=torch.zeros(1, 3),
                body_pose=bp, return_verts=True)
V = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
F = np.asarray(model.faces, dtype=np.int64)
joints = out.joints.squeeze(0).cpu().numpy()
dom = np.argmax(model.lbs_weights.detach().cpu().numpy(), axis=1)

# save relaxed reference body (for binding at fit time)
np.savez(f"{OUT}/relaxed_ref_body.npz", verts=V.astype(np.float32), faces=F)

mask = np.isin(dom, TSHIRT_JOINT_IDS)
shoulder = np.isin(dom, [13, 14, 16, 17]); top_y = V[shoulder, 1].max()
hem_y = top_y - GARMENT_LEN_M
mask &= V[:, 1] > hem_y
arm = np.isin(dom, [16, 18]) | np.isin(dom, [17, 19])
too_far = arm & (np.minimum(np.linalg.norm(V - joints[16], axis=1),
                            np.linalg.norm(V - joints[17], axis=1)) > SLEEVE_LEN_M)
mask &= ~too_far

face_in = mask[F].all(axis=1); Fs = F[face_in]
used = np.unique(Fs); remap = -np.ones(len(V), np.int64); remap[used] = np.arange(len(used))
Vk = V[used]; Fk = remap[Fs]; dom_k = dom[used]
mk = trimesh.Trimesh(Vk, Fk, process=False)
comps = sorted(graph.connected_components(mk.face_adjacency, nodes=np.arange(len(Fk))), key=len, reverse=True)
Fk = Fk[comps[0]]; u2 = np.unique(Fk); r2 = -np.ones(len(Vk), np.int64); r2[u2] = np.arange(len(u2))
Vk = Vk[u2]; Fk = r2[Fk]; dom_k = dom_k[u2]

tb = (V[:, 1] > hem_y) & (V[:, 1] < top_y) & (np.abs(V[:, 0]) < 0.20); cz = V[tb, 2].mean()

# normal offset
mk = trimesh.Trimesh(Vk, Fk, process=False)
Vk = Vk + mk.vertex_normals * OFFSET_M

# boxify torso (identified by spine dominant joints, NOT by |x| -> robust in relaxed pose)
tt = (Vk[:, 1] - Vk[:, 1].min()) / max(Vk[:, 1].max() - Vk[:, 1].min(), 1e-9)
is_torso = np.isin(dom_k, TORSO_JOINTS)
fade = np.clip((0.82 - tt) / 0.15, 0.0, 1.0) * np.clip(tt / 0.08, 0.0, 1.0)
dx = Vk[:, 0]; dz = Vk[:, 2] - cz
tval = np.clip((np.abs(dx / BOX_A) ** BOX_N + np.abs(dz / BOX_B) ** BOX_N) ** (1.0 / BOX_N), 1e-6, None)
w = BOX_STRENGTH * fade * is_torso
Vk[:, 0] = dx * (1 - w) + (dx / tval) * w
Vk[:, 2] = cz + dz * (1 - w) + (dz / tval) * w

# heavy boundary-preserving smoothing
Vk = G.smooth_garment(Vk, Fk, iterations=8, lamb=0.5)

mk = trimesh.Trimesh(Vk, Fk, process=False)
e = np.sort(mk.edges_sorted, axis=1); _, cnt = np.unique(e, axis=0, return_counts=True)
print(f"relaxed crisp tee (box={BOX_STRENGTH}): {len(Vk)} verts, {len(Fk)} faces, "
      f"boundary={int((cnt==1).sum())}, bbox={np.round(Vk.max(0)-Vk.min(0),3)}")
fn = f"{OUT}/relaxed_region{REGION_TAG}.npz"
np.savez(fn, verts=Vk.astype(np.float32), faces=Fk)
print(f"saved {fn}")
