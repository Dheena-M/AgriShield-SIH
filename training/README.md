# Real disease-model training

1. Obtain PlantVillage images under `dataset/PlantVillage-Dataset/raw/color/`, with one folder per disease class.
2. Create a dedicated Python 3.11/3.12 environment and install `requirements-training.txt`.
3. Run `python training/train_plantvillage.py --epochs 12`.
4. Review `models/plant_disease.metrics.json`, validate it with local field images, and only then deploy the model.

Keep farmer images consented, de-identified where possible, and split train/validation data by farm or capture session to avoid inflated scores from near-duplicate images.

## Crop identification

Use real leaf images arranged as `dataset/crop_leaf_identification/<crop>/`.
If the model includes an `unknown` class, it should contain unrelated plant
leaves and uncertain crop examples; non-leaf rejection remains the
responsibility of the leaf-validation gate.
Train with:

```bat
python training/train_crop_classifier.py --data dataset/crop_leaf_identification --epochs 15
```

This writes `models/crop_leaf_classifier.keras`, labels, and validation
metrics. The API uses a 70% confidence threshold and rejects uncertain crops.
The crop classifier must be trained before `/api/predict` will run disease
prediction; the API never substitutes a color heuristic or the user-selected
crop.

## Included rice dataset

`dataset/rice_leaf_diseases/` contains 120 labelled images from the user-provided archive: 40 each for Bacterial leaf blight, Brown spot, and Leaf smut. It can be used with `--data dataset/rice_leaf_diseases`, but is a small training set and requires independent evaluation before deployment.
