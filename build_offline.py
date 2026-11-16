"""Gera um HTML portátil a partir dos arquivos editáveis. Python 3, sem dependências."""
from pathlib import Path
import base64, json, mimetypes, re

root = Path(__file__).resolve().parent
html = (root/'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>'+(root/'styles.css').read_text(encoding='utf-8')+'</style>')
html = html.replace('<script src="script.js" defer></script>', '<script>'+(root/'script.js').read_text(encoding='utf-8')+'</script>')
assets = {p.name:{'type':mimetypes.guess_type(p.name)[0] or 'application/octet-stream','data':base64.b64encode(p.read_bytes()).decode()} for p in (root/'assets').iterdir() if p.is_file()}
html = re.sub(r'assets/([^\s\"\x27)<>]+)',lambda m:'OFFLINE_ASSET_'+m[1]+'_END',html)
payload = json.dumps({'assets':assets,'html':html},ensure_ascii=False).replace('<','\\u003c')
loader = """const bundle=JSON.parse(document.getElementById('data').textContent);const urls={};for(const [name,asset] of Object.entries(bundle.assets)){urls[name]=URL.createObjectURL(new Blob([Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0))],{type:asset.type}));}let html=bundle.html.replace(/OFFLINE_ASSET_(.*?)_END/g,(_,name)=>urls[name]);html=html.replace('<head>','<head><script>window.offlineAssets='+JSON.stringify(urls)+';<'+ '/script>');document.getElementById('site').srcdoc=html;"""
out = root/'dist'
out.mkdir(exist_ok=True)
(out/'Grupo-Lopes-offline.html').write_text('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grupo Lopes — offline</title><style>html,body{margin:0;height:100%;overflow:hidden}iframe{width:100%;height:100%;border:0}</style><iframe id="site" title="Grupo Lopes"></iframe><script id="data" type="application/json">'+payload+'</script><script>'+loader+'</script></html>',encoding='utf-8')
print(out/'Grupo-Lopes-offline.html')
