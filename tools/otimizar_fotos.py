"""Converte as fotos originais da pasta ../fotos em WebP leve dentro de assets/.

Uso (a partir da pasta site):  python tools/otimizar_fotos.py [pasta_de_entrada]

- Lado maior limitado a 1600 px, qualidade 80.
- O nome vira minúsculo, sem acentos e com hífens: "Equipe CD 2026.jpg" -> assets/equipe-cd-2026.webp
- Só reconverte quando a foto original for mais nova que o WebP.
Requer Pillow (pip install pillow).
"""
import re, sys, unicodedata
from pathlib import Path
from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parent.parent
ENTRADA = Path(sys.argv[1]) if len(sys.argv) > 1 else SITE.parent / 'fotos'
SAIDA = SITE / 'assets'
MAX_LADO, QUALIDADE = 1600, 80
EXTENSOES = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff'}

def slug(nome):
    s = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

fotos = sorted(p for p in ENTRADA.rglob('*') if p.suffix.lower() in EXTENSOES)
if not fotos:
    sys.exit(f'Nenhuma foto encontrada em {ENTRADA}')
for src in fotos:
    dst = SAIDA / (slug(src.stem) + '.webp')
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        print(f'  já atualizada  {dst.name}')
        continue
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
    im.thumbnail((MAX_LADO, MAX_LADO), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=QUALIDADE, method=6)
    print(f'  {src.name}  {src.stat().st_size//1024} KB -> {dst.name}  {dst.stat().st_size//1024} KB')
