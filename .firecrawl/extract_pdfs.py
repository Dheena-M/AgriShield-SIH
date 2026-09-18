from pathlib import Path
from pypdf import PdfReader

files = [
    Path(r"C:\Users\Dinesh Kumar\Desktop\AgriShield_Crop_Scan_Upgrade_Report.pdf"),
    Path(r"C:\Users\Dinesh Kumar\Desktop\AgriShield_SIH_Feature_Report.pdf"),
    Path(r"C:\Users\Dinesh Kumar\Desktop\Early_Detection_of_Chili_Leaf_Diseases_Using_Convo.pdf"),
    Path(r"C:\Users\Dinesh Kumar\Desktop\fpls-15-1355941.pdf"),
    Path(r"C:\Users\Dinesh Kumar\Desktop\Utilization_of_the_Convolutional_Neural_Network_Me.pdf"),
    Path(r"C:\Users\Dinesh Kumar\Desktop\Plant_Leaf_Disease_Classification_Using_Convolutio.pdf"),
]
out = Path(r"C:\Users\Dinesh Kumar\Desktop\AgriShield-SIH-main\AgriShield-SIH-main\.firecrawl")
out.mkdir(parents=True, exist_ok=True)

for f in files:
    reader = PdfReader(str(f))
    n = len(reader.pages)
    texts = []
    for i, page in enumerate(reader.pages[:16]):
        t = page.extract_text() or ""
        texts.append(f"--- page {i+1} ---\n{t}")
    dest = out / (f.stem[:80] + ".md")
    dest.write_text(f"# {f.name}\n\nPages: {n}\n\n" + "\n\n".join(texts), encoding="utf-8")
    print(f.name, "pages", n, "chars", dest.stat().st_size)
