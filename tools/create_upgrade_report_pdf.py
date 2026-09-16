from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "AgriShield_Crop_Scan_Upgrade_Report.pdf"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="TitleCenter", parent=styles["Title"], alignment=TA_CENTER,
    textColor=colors.HexColor("#1f5c3a"), fontSize=23, leading=28, spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="SubtitleCenter", parent=styles["Normal"], alignment=TA_CENTER,
    textColor=colors.HexColor("#53665a"), fontSize=11, leading=16, spaceAfter=20,
))
styles.add(ParagraphStyle(
    name="Section", parent=styles["Heading2"], textColor=colors.HexColor("#1f5c3a"),
    fontSize=15, leading=19, spaceBefore=12, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="BodySmall", parent=styles["BodyText"], fontSize=9.5, leading=14,
    spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="CodeSmall", parent=styles["Code"], fontSize=8.5, leading=12,
    backColor=colors.HexColor("#f2f6f3"), borderPadding=6, spaceAfter=8,
))


def p(text, style="BodySmall"):
    return Paragraph(text, styles[style])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#d5e2d8"))
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#68756c"))
    canvas.drawString(18 * mm, 8 * mm, "AgriShield AI - Crop Scan Upgrade")
    canvas.drawRightString(192 * mm, 8 * mm, f"Page {doc.page}")
    canvas.restoreState()


story = [
    Spacer(1, 28 * mm),
    p("AgriShield AI", "TitleCenter"),
    p("Crop and Leaf Scan Upgrade Report", "SubtitleCenter"),
    p("Implementation summary - 16 September 2026", "SubtitleCenter"),
    p(
        "This report documents the new safety-first image pipeline added to the "
        "existing AgriShield application. The system now validates the image, "
        "identifies the crop using a separately trained model, and only then "
        "runs disease prediction.",
        "BodySmall",
    ),
    Spacer(1, 10 * mm),
    p("New processing flow", "Section"),
    p("Upload image  ->  Leaf validation  ->  Crop identification  ->  Disease model  ->  Result", "CodeSmall"),
    p(
        "Non-leaf images, corrupt files, unsupported files, dark images, blurry "
        "images, and uncertain crop predictions are rejected before disease "
        "prediction. The backend never trusts the crop selected in the browser "
        "as the authoritative crop.",
        "BodySmall",
    ),
    PageBreak(),
    p("What was added", "Section"),
]

rows = [
    [p("<b>File</b>"), p("<b>Purpose</b>")],
    [p("backend/crop_classifier.py"), p("Loads the optional crop model, applies the 70% confidence threshold, and returns safe unavailable/uncertain errors.")],
    [p("training/train_crop_classifier.py"), p("Trains a MobileNetV2 crop classifier and saves model, labels, and validation metrics.")],
    [p("dataset/crop_leaf_identification/DATASET.md"), p("Documents the real labelled dataset folder structure.")],
    [p("backend/app.py"), p("Runs crop identification after leaf validation and before disease inference; exposes model status.")],
    [p("frontend/app.js"), p("Shows automatic crop identification and confidence in the existing scanner result UI.")],
    [p("backend/test_technical_policy.py"), p("Verifies that the system does not guess a crop when classifier weights are missing.")],
    [p("README.md and training/README.md"), p("Documents the new workflow, training command, and safe limitations.")],
]
table = Table(rows, colWidths=[62 * mm, 112 * mm], repeatRows=1)
table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dcefe1")),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c5d5c9")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.append(table)
story.extend([
    p("Successful response", "Section"),
    p(
        '{"crop_identification": {"crop": "rice", "confidence": 0.94, '
        '"accepted": true, "threshold": 0.70}}',
        "CodeSmall",
    ),
    p(
        "The frontend displays: Leaf detected: Yes, Crop identified: Rice, and "
        "the crop confidence percentage.",
        "BodySmall",
    ),
    PageBreak(),
    p("How to train the crop model", "Section"),
    p("1. Add real, licensed and labelled leaf photographs:", "BodySmall"),
    p(
        "dataset/crop_leaf_identification/rice/<images><br/>"
        "dataset/crop_leaf_identification/wheat/<images><br/>"
        "dataset/crop_leaf_identification/maize/<images><br/>"
        "dataset/crop_leaf_identification/tomato/<images>",
        "CodeSmall",
    ),
    p("2. Add more crop folders only when you have enough representative images for each class.", "BodySmall"),
    p("3. Run the training script from the project root:", "BodySmall"),
    p(
        "python training/train_crop_classifier.py "
        "--data dataset/crop_leaf_identification --epochs 15",
        "CodeSmall",
    ),
    p("4. The script writes:", "BodySmall"),
    p(
        "models/crop_leaf_classifier.keras<br/>"
        "models/crop_leaf_classifier.labels.json<br/>"
        "models/crop_leaf_classifier.metrics.json",
        "CodeSmall",
    ),
    p(
        "Do not claim production accuracy from the training split alone. Keep "
        "independent field photographs for evaluation, and record the dataset "
        "source, license, class counts, and capture conditions.",
        "BodySmall",
    ),
    p("Current limitation", "Section"),
    p(
        "The application code is ready, but no crop-classifier weights were "
        "fabricated or bundled. Until real weights and labels are installed, "
        "the API safely returns a model-unavailable response. The existing "
        "disease model currently supports rice only; other crops need their own "
        "validated disease models before disease results can be shown.",
        "BodySmall",
    ),
    PageBreak(),
    p("Verification completed", "Section"),
])

verification = [
    [p("<b>Check</b>"), p("<b>Result</b>")],
    [p("Backend test suite"), p("11 tests passed")],
    [p("Python compilation"), p("Passed for new and modified Python files")],
    [p("Frontend syntax"), p("Passed with Node.js syntax check")],
    [p("Editor diagnostics"), p("No errors reported in changed files")],
    [p("Missing crop model behavior"), p("Rejected safely; no guessed crop or disease result")],
]
vtable = Table(verification, colWidths=[75 * mm, 99 * mm], repeatRows=1)
vtable.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dcefe1")),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c5d5c9")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.append(vtable)
story.extend([
    Spacer(1, 12 * mm),
    p("Safety principle", "Section"),
    p(
        "When the system is uncertain, it rejects the scan and asks for a clearer "
        "leaf image or plant-doctor consultation. It does not invent a crop, "
        "disease name, or confidence score.",
        "BodySmall",
    ),
])

doc = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
    topMargin=17 * mm, bottomMargin=18 * mm,
    title="AgriShield AI Crop Scan Upgrade Report",
    author="AgriShield AI",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
