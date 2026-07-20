"""
Build a clean t-shirt CAGE from the SMPL body's own (clean, manifold) topology.

Selects the torso + upper-arm region via SMPL skinning weights + geometric
cuts (crew neckline, short sleeves, hip hem), extracts it as a submesh (which
inherits SMPL's clean manifold topology and gives natural openings at
neck/armholes/hem), keeps the largest connected component, and offsets it
outward for a looser fit. Runs in the BACKEND venv; saves a .npz for the bpy
QuadriFlow step.
"""
import sys, os
import numpy as np
import torch
import trimesh
from trimesh import graph

sys.path.insert(0, "/home/hashim/Documents/Coding/manikan-mvp/Manikan-MVP/backend")
import main

OUT = "/home/hashim/Downloads/manikan_clean_tee"
os.makedirs(OUT, exist_ok=True)

TSHIRT_JOINT_IDS = [0, 3, 6, 9, 13, 14, 16, 17, 18, 19]   # torso + collars + shoulders + upper arms
SLEEVE_LEN_M = 0.23      # short sleeve, a touch longer for armpit slack
GARMENT_LEN_M = 0.66     # hem drop from shoulder (longer -> more drape at waist)
OFFSET_M = 0.035         # 3.5cm outward normal offset (looser)
BOXY_M = 0.040           # extra horizontal push on the torso -> boxy, straighter silhouette

SEX = "male"
model, rings = main._load_smpl_model(SEX)
with torch.no_grad():
    out = model(betas=torch.zeros(1, 10), global_orient=torch.zeros(1, 3),
                body_pose=torch.zeros(1, 69), return_verts=True)
V = out.vertices.squeeze(0).cpu().numpy().astype(np.float64)
F = np.asarray(model.faces, dtype=np.int64)
joints = out.joints.squeeze(0).cpu().numpy()

lbs = model.lbs_weights.detach().cpu().numpy()
dom = np.argmax(lbs, axis=1)

# base region: torso + shoulders + upper arms
mask = np.isin(dom, TSHIRT_JOINT_IDS)

# hem cut: keep above hip line (shoulder top minus garment length)
shoulder_verts = np.isin(dom, [13, 14, 16, 17])
top_y = V[shoulder_verts, 1].max()
hem_y = top_y - GARMENT_LEN_M
mask &= V[:, 1] > hem_y

# short-sleeve cut: arm verts kept only near the shoulder joint
l_sh, r_sh = joints[16], joints[17]
arm = np.isin(dom, [16, 18]) | np.isin(dom, [17, 19])
dist_l = np.linalg.norm(V - l_sh, axis=1)
dist_r = np.linalg.norm(V - r_sh, axis=1)
too_far_arm = arm & (np.minimum(dist_l, dist_r) > SLEEVE_LEN_M)
mask &= ~too_far_arm

# extract faces fully inside the mask -> clean submesh with natural openings
face_in = mask[F].all(axis=1)
Fsub = F[face_in]
used = np.unique(Fsub)
remap = -np.ones(len(V), np.int64); remap[used] = np.arange(len(used))
Vsub = V[used]; Fsub = remap[Fsub]

# keep the largest connected component (drop stray islands)
m = trimesh.Trimesh(Vsub, Fsub, process=False)
comps = graph.connected_components(m.face_adjacency, nodes=np.arange(len(Fsub)))
comps = sorted(comps, key=len, reverse=True)
keep = comps[0]
Fk = Fsub[keep]; usedk = np.unique(Fk)
remapk = -np.ones(len(Vsub), np.int64); remapk[usedk] = np.arange(len(usedk))
Vk = Vsub[usedk]; Fk = remapk[Fk]

# body torso centre in Z (for the horizontal boxy push direction)
tb = (V[:, 1] > hem_y) & (V[:, 1] < top_y) & (np.abs(V[:, 0]) < 0.20)
cz = V[tb, 2].mean()

# (1) uniform normal offset -> loosen all around
mk = trimesh.Trimesh(Vk, Fk, process=False)
Vk = Vk + mk.vertex_normals * OFFSET_M

# (2) boxy horizontal push on the torso -> straighter, wider silhouette with
# real slack for gravity folds. Faded out near the collar so the neck doesn't
# balloon, and applied only to torso (not the sleeves).
tt = (Vk[:, 1] - Vk[:, 1].min()) / max(Vk[:, 1].max() - Vk[:, 1].min(), 1e-9)
is_torso = np.abs(Vk[:, 0]) < 0.22
horiz = np.stack([Vk[:, 0], Vk[:, 2] - cz], axis=1)
hn = np.linalg.norm(horiz, axis=1, keepdims=True); hn[hn == 0] = 1
horiz /= hn
fade = np.clip((0.80 - tt) / 0.15, 0.0, 1.0)        # full below t=0.65 -> 0 by t=0.80 (collar)
push = BOXY_M * fade * is_torso
Vk[:, 0] += horiz[:, 0] * push
Vk[:, 2] += horiz[:, 1] * push

mk = trimesh.Trimesh(Vk, Fk, process=False)
e = np.sort(mk.edges_sorted, axis=1); _, cnt = np.unique(e, axis=0, return_counts=True)
comps2 = graph.connected_components(mk.face_adjacency, nodes=np.arange(len(Fk)))
print(f"clean tee region: {len(Vk)} verts, {len(Fk)} faces")
print(f"  connected components: {len(comps2)}  boundary edges: {int((cnt==1).sum())}")
print(f"  bbox: {np.round(Vk.max(0)-Vk.min(0),3)}  Y[{Vk[:,1].min():.3f},{Vk[:,1].max():.3f}]")

np.savez(f"{OUT}/clean_tee_region.npz", verts=Vk.astype(np.float32), faces=Fk)
mk.export(f"{OUT}/clean_tee_region.obj")
print(f"saved {OUT}/clean_tee_region.npz")
