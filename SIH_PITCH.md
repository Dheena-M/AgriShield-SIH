# AgriShield SIH Pitch

## Slide 1 — The farmer problem

- Rice disease identification is delayed when a farmer cannot reach a plant pathologist.
- A random or unclear photo can trigger unsafe confidence in an AI system.
- Farmers need a fast first indication, local-language guidance, and a safe escalation path.

**One-line problem statement:** How can a rice farmer receive a responsible first disease indication from a phone photo without mistaking a non-leaf image or an uncertain prediction for expert advice?

## Slide 2 — The focused solution

1. Upload or capture one rice leaf.
2. Validate that the file is a clear plant leaf before inference.
3. Run the rice disease model only when the validated model is available.
4. Show disease, confidence, SES-style severity, and a lesion colour map.
5. Escalate low-confidence or severe cases to a verified plant doctor.

Invalid images never receive a disease name or confidence score.

## Slide 3 — Technical architecture

- Frontend: responsive PWA with camera capture and validation loading state.
- Backend: FastAPI, SQLite demo database, role-based farmer/doctor workflows.
- Safety gate: format, decode, size, brightness, sharpness, skin/person, and leaf-visual checks.
- Model boundary: rice-only disease model; missing weights produce a model-unavailable response.
- Risk note: the current agronomic risk baseline uses generated rule labels and is explicitly prototype-labelled.
- Explainability note: the output is a lesion colour map, not Grad-CAM.
- Field-learning loop: farmers confirm or flag scan results, and verified doctors can review corrections with timestamps before any future retraining.
- Dataset honesty: the inspected Kaggle disease dataset has 38 combined crop/disease classes but no rice class, so it is not presented as the active rice model or as field-validated crop identification.

## Slide 4 — Evidence and honesty

Show these live or on the slide only when measured:

- Dataset source, license, image count, and class balance.
- Train/validation/test split.
- Per-class precision, recall, F1, confusion matrix, and inference time.
- Leaf-gate rejection rate for faces, people, animals, objects, and corrupt files.
- Number of cases referred to a doctor instead of receiving a confident treatment indication.

Do not claim metrics, field validation, or CNN availability until the artifacts are shipped and reproducible.

## Slide 5 — Impact and scale

- Start with one rice-growing taluk and a KVK/FPO-assisted pilot.
- Support Marathi, Hindi, Tamil, and English guidance.
- Keep uncertain cases in the doctor workflow instead of forcing a chemical recommendation.
- Roadmap: real field-labelled data, validated epidemiological risk data, PostgreSQL deployment, and on-device inference.

## Three-minute demo order

1. Open the Scan page and state the farmer problem.
2. Upload a human-face or random-object image; show rejection and prove no diagnosis appears.
3. Upload a clear rice leaf; show validation loading and the model result.
4. Point out confidence, SES-style severity, lesion colour map, and chemical-safety disclaimer.
5. Show low-confidence escalation to a verified doctor.
6. Briefly show the blocked double-booking response.

## Jury answers to memorize

- **What happens when the image is not a leaf?** The validation gate rejects it before the disease model runs.
- **What happens when the model is unavailable?** No disease name or confidence is invented; the user is told to retry or consult a doctor.
- **Is the colour map Grad-CAM?** No. It is an honest lesion colour map based on image segmentation.
- **Is the risk model field-trained?** Not yet; it is labelled as a prototype baseline until real outbreak data is added.
- **Are chemicals a prescription?** No. They are indication-only guidance and uncertain or severe cases are escalated.
