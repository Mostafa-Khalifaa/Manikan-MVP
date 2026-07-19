"""
Densification test (BACKEND venv). On the CLEAN template, compare interpolation
error at the XL holdout (0.3, 0.7) using:
  COARSE grid: integer corners  build{0,1} x height{0,1}   (cell size 1.0)
  FINE   grid: half-step corners build{0,0.5} x height{0.5,1} (cell size 0.5)
If fine error < coarse error, denser sampling genuinely helps at XL.
"""
import numpy as np, json
OUT = "/home/hashim/Downloads/manikan_pilot_clean"
meta = json.load(open(f"{OUT}/meta.json"))

def delta(name):
    inp = np.load(f"{OUT}/bake_input_{name}.npz", allow_pickle=True)
    out = np.load(f"{OUT}/bake_output_{name}.npz", allow_pickle=True)
    return (out["draped_verts"].astype(np.float32) - inp["garment_verts"].astype(np.float32)), inp

def bilin(corners, wa, wc):
    # corners: dict {(0/1 build-side, 0/1 height-side): delta}; weights for side-1
    (d00, d10, d01, d11) = corners
    return ((1-wa)*(1-wc)*d00 + wa*(1-wc)*d10 + (1-wa)*wc*d01 + wa*wc*d11)

# ground truth holdout
dh, inph = delta("xf_hold")
kh = inph["garment_verts"].astype(np.float32)
actual = kh + dh
base_err = np.linalg.norm(actual - kh, axis=1)  # no-delta baseline

# COARSE: corners (b0,h0)(b1,h0)(b0,h1)(b1,h1); holdout b=0.3 h=0.7
dc = [delta(f"xf_{b}_{h}")[0] for (b, h) in [(0.0, 0.0), (1.0, 0.0), (0.0, 1.0), (1.0, 1.0)]]
coarse = kh + bilin(dc, 0.3, 0.7)

# FINE: cell build[0,0.5] height[0.5,1]; corners (0,0.5)(0.5,0.5)(0,1)(0.5,1)
df = [delta(f"xf_{b}_{h}")[0] for (b, h) in [(0.0, 0.5), (0.5, 0.5), (0.0, 1.0), (0.5, 1.0)]]
fine = kh + bilin(df, (0.3-0.0)/0.5, (0.7-0.5)/0.5)

ce = np.linalg.norm(actual - coarse, axis=1)*1000
fe = np.linalg.norm(actual - fine, axis=1)*1000
print("XL holdout (0.3, 0.7) on CLEAN template:")
print(f"  no-delta baseline : mean {base_err.mean()*1000:5.1f} mm")
print(f"  COARSE (cell 1.0) : mean {ce.mean():5.1f} mm   p90 {np.percentile(ce,90):5.1f}   max {ce.max():5.1f}")
print(f"  FINE   (cell 0.5) : mean {fe.mean():5.1f} mm   p90 {np.percentile(fe,90):5.1f}   max {fe.max():5.1f}")
print(f"  -> densification changes mean error by {(fe.mean()-ce.mean()):+.1f} mm "
      f"({(1-fe.mean()/max(ce.mean(),1e-9))*100:+.0f}%), max by {(fe.max()-ce.max()):+.1f} mm")
