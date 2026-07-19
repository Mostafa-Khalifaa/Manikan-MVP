"""
Phase 1, stage 2 (runs in the BPY venv).

Loads bake_input.npz (Tier-1 fitted garment + collision body + pin weights),
runs a Blender cloth simulation letting the shirt drape/wrinkle under gravity
while the shoulder/collar band stays pinned, and writes the settled garment
vertex positions to bake_output.npz — in the SAME vertex order as the input
(direct mesh construction + evaluated-depsgraph readback, no file re-import,
so correspondence is exact).

Run:  ./bpy_venv/bin/python bake_one.py
"""
import os
import sys
import functools
import numpy as np
import bpy

print = functools.partial(print, flush=True)  # unbuffered progress for bg monitoring

HERE = os.path.dirname(__file__)
# optional CLI args: bake_one.py [input.npz] [output.npz]
IN = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "bake_input.npz")
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "bake_output.npz")

# --- Cloth/sim parameters: HEAVY STRUCTURED COTTON -------------------------
# Target = broad, smooth, structured folds that hold shape (reference look),
# not flimsy wet-silk micro-wrinkles. Key levers:
#   - high bending_stiffness  -> broad smooth folds (vs many tight chaotic ones)
#   - high structural (tension/compression/shear) -> resists stretch & the
#     armpit-compression bunching; holds the boxy shape
#   - larger collision margin -> hem drops cleanly, doesn't snag/ride up
# Minimal step from the KNOWN-STABLE config (mass .4/tens 30/shear 15/bend 12/
# quality 12 — which converged to ~1mm and looked like a real drape). Only
# bending + shear are raised (broader folds, less diagonal chaos); everything
# else is held at the stable values so the solver stays stable.
# Heavy structured cotton — now safe to push because the starting geometry is
# authored in the relaxed pose (no crushed armpit) + pre-physics smoothed.
N_FRAMES = 60
CLOTH = dict(
    mass=0.70,                  # heavy cotton -> broad sweeping folds, hem drops
    tension_stiffness=45.0,
    compression_stiffness=45.0,
    shear_stiffness=45.0,
    bending_stiffness=50.0,     # structured broad folds (clean start -> stays stable)
    quality=22,                 # substeps for stability at higher stiffness
    pin_stiffness=1.0,
)
COLLISION = dict(
    distance_min=0.010,         # 10mm — hem drops cleanly, no snag/curl
    # self-collision is the dominant sim cost at grid scale; allow an env override
    # (SELF_COLLISION=0) to A/B its effect on the drape. Default stays ON.
    self_collision=(os.environ.get("SELF_COLLISION", "1") != "0"),
    self_distance_min=0.008,
    collision_quality=5,
)

data = np.load(IN, allow_pickle=True)
gv = data["garment_verts"].astype(np.float64)
gf = data["garment_faces"]
bv = data["body_verts"].astype(np.float64)
bf = data["body_faces"]
pin = data["pin_weights"].astype(np.float64)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
# Our meshes are Y-up; Blender gravity defaults to -Z. Point it along -Y so the
# shirt falls DOWN the body, not sideways off it.
scene.gravity = (0.0, -9.81, 0.0)
scene.frame_start = 1
scene.frame_end = N_FRAMES

def make_object(name, verts, faces):
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(verts.tolist(), [], faces.tolist())
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    return obj

# --- Collision body ----------------------------------------------------------
body = make_object("body", bv, bf)
body_mod = body.modifiers.new(name="Collision", type='COLLISION')
body.collision.thickness_outer = 0.005

# --- Cloth garment -----------------------------------------------------------
garment = make_object("garment", gv, gf)

# pin vertex group
vg = garment.vertex_groups.new(name="pin")
for i, w in enumerate(pin):
    if w > 0.0:
        vg.add([i], float(w), 'REPLACE')

cloth_mod = garment.modifiers.new(name="Cloth", type='CLOTH')
s = cloth_mod.settings
s.mass = CLOTH["mass"]
s.tension_stiffness = CLOTH["tension_stiffness"]
s.compression_stiffness = CLOTH["compression_stiffness"]
s.shear_stiffness = CLOTH["shear_stiffness"]
s.bending_stiffness = CLOTH["bending_stiffness"]
s.quality = CLOTH["quality"]
s.vertex_group_mass = "pin"          # this is Blender's "Pin Group"
s.pin_stiffness = CLOTH["pin_stiffness"]

cs = cloth_mod.collision_settings
cs.distance_min = COLLISION["distance_min"]
cs.use_self_collision = COLLISION["self_collision"]
cs.self_distance_min = COLLISION["self_distance_min"]
cs.collision_quality = COLLISION["collision_quality"]

print(f"Simulating {N_FRAMES} frames  (garment {len(gv)} verts, body {len(bv)} verts, "
      f"{int((pin>0.5).sum())} pinned)...")

# --- Run the simulation ------------------------------------------------------
prev = None
for f in range(1, N_FRAMES + 1):
    scene.frame_set(f)
    deps = bpy.context.evaluated_depsgraph_get()
    me = garment.evaluated_get(deps).to_mesh()
    cur = np.array([list(v.co) for v in me.vertices], dtype=np.float64)
    if prev is not None:
        movement = np.linalg.norm(cur - prev, axis=1).mean() * 1000  # mm
        if f % 5 == 0 or f == N_FRAMES:
            print(f"  frame {f:2d}: mean movement vs prev = {movement:.3f} mm")
    prev = cur

draped = prev

# --- Sanity + save -----------------------------------------------------------
if not np.isfinite(draped).all():
    raise RuntimeError("Simulation produced non-finite vertices (blow-up).")
bbox = draped.max(0) - draped.min(0)
print(f"draped bbox (m): {np.round(bbox,3)}  (input bbox: {np.round(gv.max(0)-gv.min(0),3)})")

np.savez(OUT, draped_verts=draped.astype(np.float32),
         garment_faces=gf, input_verts=gv.astype(np.float32))
print(f"Wrote {OUT}")
