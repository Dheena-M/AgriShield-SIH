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

## Inspected Kaggle disease dataset

The Kaggle dataset `vipoooool/new-plant-diseases-dataset` was downloaded to
the local Kaggle cache and inspected on 16 September 2026:

- 87,900 JPG images
- 38 disease/healthy classes
- 70,295 training images
- 17,572 validation images
- 33 test images
- 0 corrupt images found by Pillow verification

Its labels combine crop and disease, for example
`Tomato___Early_blight`. It does not contain a rice class and is therefore not
wired into the current rice disease model or treated as a crop-identification
dataset. The 33-image test split is also too small for a credible independent
test score. Keep the source and license information with any future training
run, and evaluate on a separate field-image set.
