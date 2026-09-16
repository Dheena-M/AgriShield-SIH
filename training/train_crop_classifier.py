"""Train the crop identifier from one folder per crop.

Example:
  python training/train_crop_classifier.py --data dataset/crop_leaf_identification
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="dataset/crop_leaf_identification")
    parser.add_argument("--output", default="models/crop_leaf_classifier.keras")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--image-size", type=int, default=224)
    args = parser.parse_args()
    data = Path(args.data)
    output = Path(args.output)
    labels = sorted(path.name.lower() for path in data.iterdir() if path.is_dir())
    if len(labels) < 2:
        raise SystemExit("Create at least two crop folders containing labelled images.")

    train_ds = tf.keras.utils.image_dataset_from_directory(
        data, validation_split=0.2, subset="training", seed=42,
        image_size=(args.image_size, args.image_size), batch_size=32,
        class_names=labels,
    )
    valid_ds = tf.keras.utils.image_dataset_from_directory(
        data, validation_split=0.2, subset="validation", seed=42,
        image_size=(args.image_size, args.image_size), batch_size=32,
        class_names=labels,
    )
    model = tf.keras.Sequential([
        tf.keras.layers.Input((args.image_size, args.image_size, 3)),
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.08),
        tf.keras.layers.Rescaling(1 / 127.5, offset=-1),
        tf.keras.applications.MobileNetV2(
            input_shape=(args.image_size, args.image_size, 3),
            include_top=False, weights="imagenet", trainable=False,
        ),
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Dense(len(labels), activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(train_ds, validation_data=valid_ds, epochs=args.epochs)
    actual, predicted = [], []
    for images, targets in valid_ds:
        actual.extend(targets.numpy().tolist())
        predicted.extend(np.argmax(model.predict(images, verbose=0), axis=1).tolist())
    report = classification_report(actual, predicted, labels=list(range(len(labels))),
                                   target_names=labels, output_dict=True, zero_division=0)
    output.parent.mkdir(parents=True, exist_ok=True)
    model.save(output)
    output.with_suffix(".labels.json").write_text(json.dumps(labels, indent=2), encoding="utf-8")
    output.with_suffix(".metrics.json").write_text(json.dumps({
        "classes": labels,
        "validation_images": len(actual),
        "accuracy": round(float(report["accuracy"]), 4),
        "macro_f1": round(float(report["macro avg"]["f1-score"]), 4),
        "confusion_matrix": confusion_matrix(actual, predicted, labels=list(range(len(labels)))).tolist(),
        "note": "Validation metrics only; verify with independent field images before deployment.",
    }, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
