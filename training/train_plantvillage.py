"""Train and evaluate the optional AgriShield rice/PlantVillage image classifier.

The dataset directory must have one folder per disease class. This trainer makes a
stratified 70% train / 15% validation / 15% test split and saves reproducible metrics.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import tensorflow as tf

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def collect_records(data_dir: Path):
    labels = sorted(path.name for path in data_dir.iterdir() if path.is_dir())
    paths, targets = [], []
    for index, label in enumerate(labels):
        images = sorted(path for path in (data_dir / label).rglob("*") if path.suffix.lower() in IMAGE_EXTENSIONS)
        if len(images) < 7:
            raise SystemExit(f"Class '{label}' needs at least 7 images for a 70/15/15 split; found {len(images)}")
        paths.extend(str(path) for path in images)
        targets.extend([index] * len(images))
    if len(labels) < 2 or not paths:
        raise SystemExit("Dataset needs at least two class folders containing images")
    return labels, np.asarray(paths), np.asarray(targets, dtype=np.int32)


def make_dataset(paths, targets, image_size: int, training: bool):
    ds = tf.data.Dataset.from_tensor_slices((paths, targets))
    if training:
        ds = ds.shuffle(len(paths), seed=42, reshuffle_each_iteration=True)

    def decode(path, label):
        image = tf.io.decode_image(tf.io.read_file(path), channels=3, expand_animations=False)
        image.set_shape([None, None, 3])
        image = tf.image.resize(image, (image_size, image_size))
        return image, label

    return ds.map(decode, num_parallel_calls=tf.data.AUTOTUNE).batch(32).prefetch(tf.data.AUTOTUNE)


def metric_summary(actual, predicted, labels):
    report = classification_report(actual, predicted, labels=list(range(len(labels))), target_names=labels, output_dict=True, zero_division=0)
    per_class = {label: {metric: round(float(value), 4) for metric, value in report[label].items() if metric in ("precision", "recall", "f1-score", "support")} for label in labels}
    return {
        "accuracy": round(float(np.mean(actual == predicted)), 4),
        "per_class": per_class,
        "macro_avg": {metric: round(float(value), 4) for metric, value in report["macro avg"].items() if metric in ("precision", "recall", "f1-score")},
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="dataset/PlantVillage-Dataset/raw/color")
    parser.add_argument("--output", default="models/plant_disease.keras")
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--image-size", type=int, default=224)
    args = parser.parse_args()
    data_dir, output = Path(args.data), Path(args.output)
    if not data_dir.is_dir():
        raise SystemExit(f"Dataset directory not found: {data_dir}")

    labels, paths, targets = collect_records(data_dir)
    train_paths, holdout_paths, train_targets, holdout_targets = train_test_split(paths, targets, test_size=0.30, random_state=42, stratify=targets)
    valid_paths, test_paths, valid_targets, test_targets = train_test_split(holdout_paths, holdout_targets, test_size=0.50, random_state=42, stratify=holdout_targets)
    train_ds = make_dataset(train_paths, train_targets, args.image_size, training=True)
    valid_ds = make_dataset(valid_paths, valid_targets, args.image_size, training=False)
    test_ds = make_dataset(test_paths, test_targets, args.image_size, training=False)

    augment = tf.keras.Sequential([tf.keras.layers.RandomFlip("horizontal"), tf.keras.layers.RandomRotation(0.08), tf.keras.layers.RandomZoom(0.1)])
    base = tf.keras.applications.MobileNetV2(input_shape=(args.image_size, args.image_size, 3), include_top=False, weights="imagenet")
    base.trainable = False
    model = tf.keras.Sequential([tf.keras.layers.Input((args.image_size, args.image_size, 3)), augment, tf.keras.layers.Rescaling(1.0 / 127.5, offset=-1), base, tf.keras.layers.GlobalAveragePooling2D(), tf.keras.layers.Dropout(0.25), tf.keras.layers.Dense(len(labels), activation="softmax")])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=[tf.keras.metrics.SparseCategoricalAccuracy(name="accuracy")])
    history = model.fit(train_ds, validation_data=valid_ds, epochs=args.epochs, callbacks=[tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)])

    probabilities = model.predict(test_ds, verbose=0)
    predicted = np.argmax(probabilities, axis=1)
    evaluation = metric_summary(test_targets, predicted, labels)
    matrix = confusion_matrix(test_targets, predicted, labels=list(range(len(labels)))).tolist()
    output.parent.mkdir(parents=True, exist_ok=True)
    model.save(output)
    output.with_suffix(".labels.json").write_text(json.dumps(labels, indent=2), encoding="utf-8")
    history_metrics = {key: round(float(values[-1]), 4) for key, values in history.history.items() if values}
    metrics = {
        "epochs_requested": args.epochs,
        "epochs_completed": len(history.history.get("loss", [])),
        "classes": len(labels),
        "split": {"train": int(len(train_paths)), "validation": int(len(valid_paths)), "test": int(len(test_paths)), "method": "stratified 70/15/15"},
        "training_metrics": history_metrics,
        "test": evaluation,
        "confusion_matrix": {"labels": labels, "matrix": matrix},
        "note": "Metrics are from the held-out test split. Small datasets still require more field images before deployment.",
    }
    output.with_suffix(".metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps({"model": str(output), **metrics}, indent=2))

if __name__ == "__main__":
    main()