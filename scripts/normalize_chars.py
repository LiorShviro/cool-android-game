from PIL import Image
import pathlib

PAD = 8
chars_dir = pathlib.Path("docs/assets/characters")
for path in sorted(chars_dir.glob("*.png")):
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()   # (left, top, right, bottom) of non-transparent pixels
    if bbox is None:
        continue
    l, t, r, b = bbox
    l = max(0, l - PAD); t = max(0, t - PAD)
    r = min(img.width, r + PAD); b = min(img.height, b + PAD)
    cropped = img.crop((l, t, r, b))
    cropped.save(path)
    print(f"{path.name}: {img.size} → {cropped.size}")
