# Drape bake tooling (Pipeline 2, offline)

Offline scripts that produce the physics-drape **delta library** consumed at
runtime by [`backend/physics_drape.py`](../../physics_drape.py). None of this
runs on a user request — it is the one-time bake pipeline. See
[`docs/physics-drape-pipeline.md`](../../../docs/physics-drape-pipeline.md) for
the full method and validation.

## Environment

The cloth simulation runs in Blender's `bpy`, which needs its own virtual
environment (`bpy_venv/`, git-ignored, ~1 GB). The authoring/fitting/QC scripts
run in the backend venv (trimesh, torch, smplx).

```
bpy_venv/bin/python  bake_one.py <input.npz> <output.npz>   # cloth sim (bpy)
../../venv/bin/python phase4_grid.py                        # everything else
```

## Pipeline order

| Script | Role |
|---|---|
| `extract_relaxed_tee.py` | Author the tee region in the relaxed pose + boxify (BACKEND). |
| `bake_one.py` | Blender cloth sim for one point. `SELF_COLLISION=0` env toggles self-collision (BPY). |
| `phase4_grid.py` | Generate the 125 grid bake inputs (BACKEND). |
| `pilot_grid.py` / `pilot_qc.py` | Small validation rehearsal + QC before the full grid. |
| `gen_holdouts.py` | Off-grid interpolation holdouts. |
| `gen_clean_xl.py` / `densify_qc.py` | Grid-density test. |
| `render_*.py` | QC / gallery renderers. |

Intermediate `.npz` bake caches are git-ignored; the final assets are committed
under `backend/models/garments/tshirt_physics/`. Some scripts reference local
scratch paths under `~/Downloads/` used during development.
