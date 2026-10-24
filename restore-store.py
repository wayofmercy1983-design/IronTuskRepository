from pathlib import Path
import hashlib, io, subprocess, sys, zipfile
root=Path(__file__).resolve().parent
data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="e3c8158a45ba478c1bbefee7660727e94517d3ff5b403dd99719e2bf33b3871c", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:archive.extractall(root/"restored-store")
for name in ["recover_assets.py","build.py"]:
 subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True)
