"""
Pilot QC (BACKEND venv). Runs the back half of the loop:
  delta -> interpolate -> QC.

1. delta   : for each grid point, delta = physics - kinematic_fit (same vertex
             order everywhere). Stored as a float16 library.
2. interp  : for each held-out cell-interior point, trilinear-interpolate the
             delta from its 8 surrounding grid corners, predict
             physics ~= kinematic_holdout + interp_delta, and compare to the
             actual baked physics at that point.
3. QC      : per-point self-intersection (layer stack + non-adjacent overlap),
             bake convergence, and interpolation error vs the no-delta baseline.

The interpolation test is the crux: it decides whether a 5x5x5 grid can be
blended cheaply at runtime, or whether the drape delta varies too sharply.
"""
import os, json
import numpy as np
from scipy.spatial import cKDTree
from scipy.sparse.csgraph import shortest_path
from scipy.sparse import csr_matrix

OUT = "/home/hashim/Downloads/manikan_pilot"
man = json.load(open(f"{OUT}/manifest.json"))

def load(name, kind):
    return np.load(f"{OUT}/bake_{kind}_{name}.npz", allow_pickle=True)

# --- 1. extract delta library ------------------------------------------------
grid = {g["name"]: g for g in man["grid"]}
faces = None
delta = {}   # name -> (V,3)
kin = {}
for name, g in grid.items():
    inp = load(name, "input"); out = load(name, "output")
    k = inp["garment_verts"].astype(np.float32)
    p = out["draped_verts"].astype(np.float32)
    delta[name] = (p - k).astype(np.float16)
    kin[name] = k
    faces = inp["garment_faces"]
V = faces.max() + 1
lib = np.stack([delta[f"g{i}{j}{k}"].astype(np.float32)
                for i in range(3) for j in range(3) for k in range(3)]).reshape(3, 3, 3, -1, 3)
np.savez(f"{OUT}/delta_library.npz", delta=lib.astype(np.float16), faces=faces)
mean_delta = np.mean([np.linalg.norm(delta[n].astype(np.float32), axis=1).mean() for n in grid]) * 1000
print(f"[delta] library {lib.shape} float16 (~{lib.astype(np.float16).nbytes/1024:.0f} KB total, "
      f"{lib.astype(np.float16).nbytes/1024/27:.1f} KB/point). mean |delta| = {mean_delta:.1f} mm")

# --- 2. interpolation validation on held-out points --------------------------
# LOCKED discrete-size design: size (axis b) selects an EXACT slab index — no
# cross-size blending. Only build (a) and height (c) are bilinearly interpolated
# within the chosen slab.
def bilerp_slab(a, b_idx, c):
    i0, k0 = int(np.floor(a)), int(np.floor(c))
    fa, fc = a-i0, c-k0
    acc = np.zeros_like(lib[0, 0, 0])
    for di, wa in [(0, 1-fa), (1, fa)]:
        for dk, wc in [(0, 1-fc), (1, fc)]:
            w = wa*wc
            if w == 0: continue
            acc += w * lib[min(i0+di, 2), b_idx, min(k0+dk, 2)].astype(np.float32)
    return acc

holdouts = json.load(open(f"{OUT}/holdouts_discrete.json"))
print("\n[interp] held-out points — bilinear build x height WITHIN exact size slab, vs actual bake:")
print(f"  {'point':<10} {'slab':>5} {'no-delta err':>13} {'interp err':>11} {'captured':>9} {'max err':>9}")
for h in holdouts:
    name = h["name"]; b_idx = int(h["size_idx"]); a, _, c = h["coord"]
    inp = load(name, "input"); out = load(name, "output")
    kh = inp["garment_verts"].astype(np.float32)
    ph = out["draped_verts"].astype(np.float32)
    interp_d = bilerp_slab(a, b_idx, c)
    pred = kh + interp_d
    base_err = np.linalg.norm(ph - kh, axis=1)          # no delta (kinematic only)
    interp_err = np.linalg.norm(ph - pred, axis=1)      # kinematic + interpolated delta
    captured = 100*(1 - interp_err.mean()/max(base_err.mean(), 1e-9))
    slab = ["S", "M", "XL"][b_idx]
    print(f"  {name:<10} {slab:>5} {base_err.mean()*1000:>10.1f}mm {interp_err.mean()*1000:>8.1f}mm "
          f"{captured:>7.0f}% {interp_err.max()*1000:>7.1f}mm")

# --- 3. per-point QC: self-intersection --------------------------------------
def overlap(Vv, F, thr=0.005):
    n = len(Vv); e = np.vstack([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])
    A = csr_matrix((np.ones(2*len(e)), (np.concatenate([e[:, 0], e[:, 1]]),
                    np.concatenate([e[:, 1], e[:, 0]]))), shape=(n, n))
    pairs = cKDTree(Vv).query_pairs(thr, output_type='ndarray')
    if len(pairs) == 0: return 0
    u = np.unique(pairs); d = shortest_path(A, method='D', unweighted=True, indices=u)
    idx = {v: i for i, v in enumerate(u)}
    return int(sum(d[idx[i], j] > 3 for i, j in pairs))

worst = []
for name, g in grid.items():
    out = load(name, "output"); p = out["draped_verts"].astype(np.float64)
    ov = overlap(p, faces.astype(np.int64))
    worst.append((ov, name, g))
worst.sort(reverse=True)
print("\n[QC] self-intersection (non-adjacent verts <5mm) — worst 5 grid points:")
for ov, name, g in worst[:5]:
    print(f"  {name}  chest={g['chest']:.0f} gchest={g['gchest']:.0f} h={g['height']:.0f}:  overlap={ov}")
print(f"  ... {sum(1 for o,_,_ in worst if o==0)}/27 points have ZERO self-overlap")
