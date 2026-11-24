from pathlib import Path
import hashlib, io, os, subprocess, sys, zipfile
root=Path(__file__).resolve().parent

data=(root/"iron-tusk-store-source.zip").read_bytes()
assert hashlib.sha256(data).hexdigest()=="e44788d5bee37fba3e021be9bf07ff728de2fbeb70ff3d4798e12ba010124612", "Source checksum mismatch"
with zipfile.ZipFile(io.BytesIO(data)) as archive:
 archive.extractall(root/"restored-store")
(root/"restored-store/source/december-offers.mjs").write_bytes((root/"store-offers.mjs").read_bytes())
if "--extract-only" not in sys.argv:
 env={**os.environ, "PYTHONUTF8":"1"}
 for name in ["recover_assets.py","build.py"]:
  subprocess.run([sys.executable,str(root/"restored-store"/name)],check=True,env=env)
 with zipfile.ZipFile(root/"product-photos.zip") as photos:
  photos.extractall(root/"restored-store/product-photos")
 subprocess.run(["node",str(root/"update-store-visuals.mjs")],check=True,env=env)
 subprocess.run(["node",str(root/"improve-storefront.mjs")],check=True,env=env)

 # Route the Snot Rockets CD to the corrected inner-sleeve edition.
 import json, re
 old_cd, new_cd = "PX00V4KEMX", "PX00PCADEY"
 retired_cds = [old_cd, "PX00ZUDROB", "PX00ZUDR0B"]
 catalog_path = root/"restored-store/source/catalog.json"
 catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
 matches = [p for p in catalog if p["id"] == old_cd]
 assert len(matches) == 1 and matches[0]["artist"] == "The Snot Rockets"
 assert matches[0]["format"].startswith("CD") and matches[0]["price"] == 8
 matches[0]["id"] = new_cd
 catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
 dist = root/"restored-store/dist"
 index = (dist/"index.html").read_text(encoding="utf-8")
 bundle_name = re.search(r'src="/assets/(store-[a-f0-9]+\.js)"', index).group(1)
 bundle = (dist/"assets"/bundle_name).read_text(encoding="utf-8")
 assert old_cd in bundle
 bundle = bundle.replace(old_cd, new_cd)
 photo = dist/"product-photos"/(old_cd+".webp")
 if photo.exists():
  photo.rename(photo.with_name(new_cd+".webp"))
 alias_marker = "const replacements = {"
 assert bundle.count(alias_marker) == 1
 bundle = bundle.replace(alias_marker, alias_marker + json.dumps(old_cd)+":"+json.dumps(new_cd)+"," + json.dumps("PX00ZUDR0B")+":"+json.dumps(new_cd)+",")
 new_name = "store-"+hashlib.sha256(bundle.encode()).hexdigest()[:12]+".js"
 (dist/"assets"/new_name).write_text(bundle, encoding="utf-8")
 for page in dist.rglob("*.html"):
  content = page.read_text(encoding="utf-8")
  if bundle_name in content:
   page.write_text(content.replace(bundle_name, new_name), encoding="utf-8")
 store_path = root/"restored-store/functions/lib/store.mjs"
 backend = store_path.read_text(encoding="utf-8")
 marker = " const seen=new Set(),result=cart.map(({id,quantity})=>{"
 assert backend.count(marker) == 1
 aliases = json.dumps(retired_cds)
 backend = backend.replace(marker, marker+"\n  if("+aliases+".includes(id))id="+json.dumps(new_cd)+";")
 marker = "export const productXML=cart=>cart.map(p=>({ProductId:p.id,Quantity:p.quantity}));"
 assert backend.count(marker) == 1
 backend = backend.replace(marker, "export const productXML=cart=>cart.map(p=>({ProductId:"+aliases+".includes(p.id)?"+json.dumps(new_cd)+":p.id,Quantity:p.quantity}));")
 # Preserve lookup compatibility for checkout sessions saved before this release.
 marker = "export const hash=value=>"
 assert backend.count(marker) == 1
 backend = backend.replace(marker, "for(const id of "+aliases+")products.set(id,products.get("+json.dumps(new_cd)+"));\n"+marker)
 marker = "if(!discount)return"
 assert backend.count(marker) == 1
 backend = backend.replace(marker, "if(discount?.offer==='black-friday')return [stripeLine(product,quantity,product.cents-discount.unitDiscount,discount)];\n  "+marker)
 marker = "const description=discount?"
 assert backend.count(marker) == 1
 backend = backend.replace(marker, "const description=discount?.offer==='black-friday'?'Black Friday: 10% off CDs before shipping':discount?")
 store_path.write_text(backend, encoding="utf-8")
 print("Snot Rockets CD ordering updated to "+new_cd)
