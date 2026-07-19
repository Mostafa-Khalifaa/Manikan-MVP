"""
Build a CRISP, modern, boxy tee (no physics) from the SMPL body's clean topology.
Extract the t-shirt region, offset, then BOXIFY the torso to a superellipse
cross-section (straight sides + flat modern front, like the reference), and
heavily smooth for a crisp look. Runs in BACKEND venv.
"""
import sys, os
import numpy as np
import torch
import trimesh
from trimesh import graph

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main
import garment as G

OUT = "/home/hashim/Downloads/manikan_crisp_tee"; os.makedirs(OUT, exist_ok=True)

TSHIRT_JOINT_IDS = [0, 3, 6, 9, 13, 14, 16, 17, 18, 19]
SLEEVE_LEN_M = 0.22
GARMENT_LEN_M = 0.64
OFFSET_M = 0.025
# boxy superellipse target cross-section (constant over torso height -> straight sides)
BOX_A, BOX_B, BOX_N = 0.235, 0.150, 4.0   # half-width, half-depth, exponent (4 = boxy)
BOX_STRENGTH = 0.85                        # blend toward the boxy shell

model, rings = main._load_smpl_model("male")
with torch.no_grad():
    out = model(betas=torch.zeros(1, 10), global_orient=torch.zeros(1, 3),
                body_pose=torch.zeros(1, 69), return_verts=True)
V = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
F = np.asarray(model.faces, dtype=np.int64)
joints = out.joints.squeeze(0).cpu().numpy()
dom = np.argmax(model.lbs_weights.detach().cpu().numpy(), axis=1)

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
Vk = V[used]; Fk = remap[Fs]
mk = trimesh.Trimesh(Vk, Fk, process=False)
comps = sorted(graph.connected_components(mk.face_adjacency, nodes=np.arange(len(Fk))), key=len, reverse=True)
Fk = Fk[comps[0]]; u2 = np.unique(Fk); r2 = -np.ones(len(Vk), np.int64); r2[u2] = np.arange(len(u2))
Vk = Vk[u2]; Fk = r2[Fk]

# torso centre Z
tb = (V[:, 1] > hem_y) & (V[:, 1] < top_y) & (np.abs(V[:, 0]) < 0.20); cz = V[tb, 2].mean()

# (1) normal offset
mk = trimesh.Trimesh(Vk, Fk, process=False)
Vk = Vk + mk.vertex_normals * OFFSET_M

# (2) BOXIFY torso to a superellipse cross-section (crisp straight sides, flat front)
tt = (Vk[:, 1] - Vk[:, 1].min()) / max(Vk[:, 1].max() - Vk[:, 1].min(), 1e-9)
is_torso = np.abs(Vk[:, 0]) < 0.24
# fade near collar (top) so neck isn't boxified, and slight fade at hem
fade = np.clip((0.82 - tt) / 0.15, 0.0, 1.0) * np.clip(tt / 0.08, 0.0, 1.0)
dx = Vk[:, 0]; dz = Vk[:, 2] - cz
tval = (np.abs(dx / BOX_A) ** BOX_N + np.abs(dz / BOX_B) ** BOX_N) ** (1.0 / BOX_N)
tval = np.clip(tval, 1e-6, None)
tgt_dx = dx / tval; tgt_dz = dz / tval          # projection onto boxy shell
w = BOX_STRENGTH * fade * is_torso
Vk[:, 0] = dx * (1 - w) + tgt_dx * w
Vk[:, 2] = cz + dz * (1 - w) + tgt_dz * w

# (3) heavy boundary-preserving smoothing -> crisp surface
Vk = G.smooth_garment(Vk, Fk, iterations=8, lamb=0.5)

mk = trimesh.Trimesh(Vk, Fk, process=False)
e = np.sort(mk.edges_sorted, axis=1); _, cnt = np.unique(e, axis=0, return_counts=True)
print(f"crisp tee: {len(Vk)} verts, {len(Fk)} faces, boundary={int((cnt==1).sum())}, "
      f"bbox={np.round(Vk.max(0)-Vk.min(0),3)}")
np.savez(f"{OUT}/crisp_tee_region.npz", verts=Vk.astype(np.float32), faces=Fk)
print(f"saved {OUT}/crisp_tee_region.npz")
