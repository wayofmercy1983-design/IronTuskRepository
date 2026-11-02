from pathlib import Path
import hashlib, io, os, subprocess, sys, zipfile
root=Path(__file__).resolve().parent

data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="45fda755732169f9c8fa1a52efa11415035007bb549d2758ba44315972ff1ee3", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:
 archive.extractall(root/"restored-store")
if "--extract-only" not in sys.argv:
 env={**os.environ, "PYTHONUTF8":"1"}
 for name in ["recover_assets.py","build.py"]:
  subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True,env=env)
