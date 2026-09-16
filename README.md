AgriShield
==========

SIH farmer-support platform from the problem statement, technology guide, and Plant Doctor consultation PDF.

What it does
------------
- AI leaf analysis (CNN-style colour/texture features) with confidence and disclaimer
- Random Forest pest/disease risk from crop, weather and outbreak history
- Crop advisor using NPK + climate simulation
- Multilingual chatbot with browser **voice in/out**: English, Hindi, Tamil and Marathi
- Plant-doctor search, date-aware slot booking, accept/reject, consultation notes and protected voice/text chat
- Medicine suggestions and **place order** (cart + village address)
- Installable offline-first web app (PWA): the app shell, guidance, doctor directory, medicines and crop list are cached

Run
---
Double-click `run.bat`, or run:

```bat
run.bat
```

Open http://127.0.0.1:8000

Open from another device on the same Wi-Fi
-------------------------------------------
`run.bat` listens on the local network. Find this PC's IPv4 address with `ipconfig`, then open `http://YOUR_IPV4_ADDRESS:8000` on the other phone or computer. For example, if the PC shows `192.168.1.25`, open `http://192.168.1.25:8000`. Allow Python through Windows Firewall if Windows asks. Do not expose this demo directly to the public internet.

Demo accounts
-------------
| Role   | Email                        | Password    |
|--------|------------------------------|-------------|
| Farmer | farmer@agrishield.in         | Farmer@123  |
| Doctor | ananya.patil@agrishield.in   | Doctor@123  |

Voice chat needs Chrome or Edge (Web Speech API).

Offline use
-----------
Once the site has been opened online, install it from Chrome/Edge's **Install app** prompt or browser menu. It will reopen without a connection with the saved app shell, doctor directory, medicine catalogue and crop list. AI image analysis, booking, orders, notifications and live consultation chat require a connection; no crop model is claimed to run on-device in this demo.

Implementation notes
--------------------
- Slot availability is checked on the backend and active doctor slots have a database-level uniqueness rule to prevent double booking.
- Only the assigned doctor can accept an appointment or write notes. Only the appointment farmer or doctor can access an accepted consultation chat.
- Doctor profiles must be verified before a farmer can book them. Uploaded plant photos are size/type checked and stored outside the public static files.

Honest SIH note
---------------
Leaf analysis is a lightweight convolutional feature pipeline for the demo, not a fully trained PlantVillage TensorFlow CNN. Risk uses a Random Forest trained on synthetic but realistic monsoon/humidity patterns. Production would retrain on verified field images and outbreak records.

Farm decision-support tools
---------------------------
AgriShield includes explainable soil-health/fertilizer guidance, crop suitability recommendations, and yield-and-risk estimates in the **Farm tools** navigation section. These are local planning estimates; use laboratory soil tests and local agricultural advice for planting and fertilizer decisions.

The crop recommender reads the bundled six-record demonstration dataset at `backend/data/crop_profiles.json`. It is not a disease-image training dataset.

Recent feature updates
----------------------
- **Voice and language:** voice input/output works with the selected English, Hindi, Tamil or Marathi browser language.
- **Scanning:** upload a leaf photo, use the camera, analyse a video frame, or use symptom text when no photo is available. Text symptoms are an estimate, not image confirmation.
- **App conversion:** the installable PWA caches the application shell for offline reopening; online services reconnect when a network is available.
- **Doctor verification:** newly registered doctors submit a registration/licence number and remain hidden from farmers until reviewed. An administrator can approve/reject with `PATCH /api/admin/doctor-verification/{id}` using the `X-Admin-Key` header and the private `ADMIN_VERIFICATION_KEY` environment variable.
- **Farm tools:** soil health, soil analysis, irrigation, fertilizer-gap, crop suitability, yield, risk and sowing/seed-rate calculators are under **Farm tools**.
- **Seeds and feedback:** the navigation includes a seeds marketplace and authenticated feedback form. Seed guidance must be checked against local district and seasonal recommendations.
- **Algorithms page:** the app explains the active MobileNetV2 CNN, advisory visual-feature fallback, Random Forest risk model, rules-based calculators, and the current YOLO availability.


Data and model metadata
------------------------
The **Data & models** page documents the data source, dataset type, inputs, outputs, model approach, and limitations for every AgriShield feature. It deliberately exposes only non-sensitive metadata; farmer records, consultations, uploads, addresses, and account data remain private.

Reference artifacts
-------------------
The supplied AgriVision presentation/report generator sources and montage are stored in `reference-artifacts/agrivision/` as historical reference material. See that folder's README before reusing their model-performance claims.

Live weather (OpenWeather)
--------------------------
Create an OpenWeather API key, then copy `.env.example` to a private `.env` file in the project folder and set `OPENWEATHER_API_KEY=your_key_here`. AgriShield reads `.env` when it starts; do not commit `.env` or place keys in `.env.example`.

You can also set it only for the current PowerShell window before launching:

```powershell
$env:OPENWEATHER_API_KEY = "your_key_here"
run.bat
```

The **Farm tools** page can then request device-location permission and show current local conditions. The key stays on the server; AgriShield caches a location's response for 10 minutes to limit API calls.

The same key enables OpenWeather's five-day, three-hour forecast feed. AgriShield summarizes daily temperature, humidity, and rainfall and raises practical rain/humidity alerts. This is decision support, not an official weather warning service.

Real disease-model training
---------------------------
The included training pipeline is in `training/`. It trains a MobileNetV2-based classifier from a locally supplied PlantVillage directory, saving the model, labels, and validation metrics under `models/`. See `training/README.md`; no trained model is bundled or claimed until you provide the dataset and run the training.

The project now also includes the user-provided rice leaf dataset under `dataset/rice_leaf_diseases/`: 120 labelled images across Bacterial leaf blight, Brown spot, and Leaf smut. Its usage and limitations are documented in `dataset/rice_leaf_diseases/DATASET.md`.

CNN live prediction
-------------------
The trained MobileNetV2 model supports only the three included rice disease classes. To run the app with this model, install both the normal server and ML dependencies once, then use `run_cnn.bat`:

```powershell
.\.venv-ml\Scripts\python.exe -m pip install -r requirements-ml-server.txt
.\run_cnn.bat
```

Open `http://127.0.0.1:8000/#detect`, choose **rice**, then upload or capture a rice leaf. Other crop types intentionally continue to use the lightweight advisory fallback. Re-run training after collecting more images:

```powershell
.\.venv-ml\Scripts\python.exe training\train_plantvillage.py --data dataset\rice_leaf_diseases --output models\rice_leaf_disease.keras --epochs 12
```

The trainer now uses a stratified 70/15/15 train/validation/test split and writes complete per-class metrics plus a 3 x 3 confusion matrix.
MongoDB scan storage
--------------------
MongoDB is an optional document store for flexible prediction and model-event history. SQLite remains the primary transactional database for accounts, appointments, carts and orders, so existing local data is preserved.

1. Install Docker Desktop, then start the local database:

```powershell
cd "D:\SIH agri"
docker compose up -d mongodb
```

2. Copy `.env.example` to `.env`, change the development password, and set the same `MONGODB_URI` in the PowerShell session before launching the app:

```powershell
$env:MONGODB_URI = "mongodb://agrishield:your_password@127.0.0.1:27017/agrishield?authSource=admin"
$env:MONGODB_DATABASE = "agrishield"
.\run_cnn.bat
```

When connected, each leaf scan is also stored as a MongoDB document in `agrishield.predictions`. The image binary is not copied to MongoDB; it remains in the existing local upload folder. Check `/api/health` to see MongoDB connection status.

If you use MongoDB Atlas instead of Docker, set `MONGODB_URI` to the Atlas connection string and leave Docker out.