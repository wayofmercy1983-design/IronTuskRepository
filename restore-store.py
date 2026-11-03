from pathlib import Path
import hashlib, io, os, subprocess, sys, zipfile
root=Path(__file__).resolve().parent

data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="6d011d1ac8756886825d0d72d8df2613e39b7fb66bb141bbad6f594762808d0f", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:
 archive.extractall(root/"restored-store")
if "--extract-only" not in sys.argv:
 env={**os.environ, "PYTHONUTF8":"1"}
 for name in ["recover_assets.py","build.py"]:
  subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True,env=env)
 subprocess.run(["node",str(root/"update-store-visuals.mjs")],check=True,env=env)
