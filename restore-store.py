from pathlib import Path
import hashlib, io, os, subprocess, sys, zipfile
root=Path(__file__).resolve().parent

data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="0703ca5cea4c4abfcfa409fb45eaa9b947603c06aa92cf820d7e6293534e8499", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:
 archive.extractall(root/"restored-store")
if "--extract-only" not in sys.argv:
 env={**os.environ, "PYTHONUTF8":"1"}
 for name in ["recover_assets.py","build.py"]:
  subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True,env=env)
 subprocess.run(["node",str(root/"update-store-visuals.mjs")],check=True,env=env)
 subprocess.run(["node",str(root/"improve-storefront.mjs")],check=True,env=env)
