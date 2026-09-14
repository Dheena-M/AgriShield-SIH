from pathlib import Path
import random
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "dataset" / "rice_leaf_diseases"
DEST = ROOT / "dataset" / "rice_split"

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

random.seed(42)

classes = [
    "Bacterial leaf blight",
    "Brown spot",
    "Leaf smut"
]

if not SOURCE.exists():
    raise FileNotFoundError(f"Dataset not found: {SOURCE}")

for split in ["train", "validation", "test"]:
    for class_name in classes:
        (DEST / split / class_name).mkdir(
            parents=True,
            exist_ok=True
        )

for class_name in classes:
    class_folder = SOURCE / class_name

    images = [
        f for f in class_folder.iterdir()
        if f.is_file()
        and f.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]
    ]

    random.shuffle(images)

    total = len(images)

    train_count = int(total * TRAIN_RATIO)
    val_count = int(total * VAL_RATIO)

    train_images = images[:train_count]
    val_images = images[train_count:train_count + val_count]
    test_images = images[train_count + val_count:]

    print(f"\n{class_name}")
    print(f"Total      : {total}")
    print(f"Train      : {len(train_images)}")
    print(f"Validation : {len(val_images)}")
    print(f"Test       : {len(test_images)}")

    for image in train_images:
        shutil.copy2(
            image,
            DEST / "train" / class_name / image.name
        )

    for image in val_images:
        shutil.copy2(
            image,
            DEST / "validation" / class_name / image.name
        )

    for image in test_images:
        shutil.copy2(
            image,
            DEST / "test" / class_name / image.name
        )

print("\nDataset split completed successfully.")
print(f"Output: {DEST}")