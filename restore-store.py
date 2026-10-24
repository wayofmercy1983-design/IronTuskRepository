from pathlib import Path
import hashlib, io, subprocess, sys, zipfile
root=Path(__file__).resolve().parent
data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="17688b4d4d8993dd7f994fed35dbff1c843bf895f5dcd775b0357997708dc08a", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:archive.extractall(root/"restored-store")
for name in ["recover_assets.py","build.py"]:
 subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True)
