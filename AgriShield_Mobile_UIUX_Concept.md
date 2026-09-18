# AgriShield AI — Mobile App UI/UX Concept & Specification

**Intelligent Crop Disease & Pest Management Platform**  
*Optimized for Indian Agricultural Realities & Tamil Nadu Cauvery Delta Context*

---

## 1. Executive Summary & Product Vision

**AgriShield AI** is an intelligent, farmer-centric mobile platform designed for **early detection, responsible diagnosis, and actionable management of crop diseases and pest infestations**. 

Unlike generic "AI concepts" that present black-box machine learning predictions with artificial certainty, AgriShield AI is engineered around **agronomic honesty, responsible AI safety gates, multi-agent contextual intelligence (via Model Context Protocol - MCP), and multi-lingual voice accessibility**.

### Core Product Workflow
```
[01 SPLASH] ──► [02 ONBOARDING] ──► [03 FARM PROFILE] ──► [04 LOCATION / WEATHER]
                                                                      │
                                                                      ▼
[08 AI DIAGNOSIS] ◄── [07 AI ANALYSIS] ◄── [06 CROP SCANNER] ◄── [05 HOME DASHBOARD]
       │
       ▼
[09 MCP CONTEXT] ──► [10 AI EXPLANATION] ──► [11 HIGGSFIELD VISUAL GUIDE]
                                                           │
                                                           ▼
[15 CROP HISTORY] ◄── [14 FOLLOW-UP] ◄── [13 RESOURCES] ◄── [12 ACTION PLAN]
```

---

## 2. Indian AgriTech Design System & Tokens

### 2.1 Color Palette & Outdoor Sunlight Readability
Indian farmers operate under intense tropical sunlight (ambient illuminance exceeding 80,000–100,000 lux). Low-contrast interfaces or pastel designs cause severe eye strain and operational errors. AgriShield AI employs an **Earth-Ground Canopy Palette** with WCAG AAA contrast ratios (≥ 7:1) for all critical diagnostic data:

| Token Name | Hex Code | Purpose & Semantic Role | Contrast vs Surface |
| :--- | :--- | :--- | :--- |
| **Canopy Deep (Primary 900)** | `#0D261A` | Dark anchors, status bars, primary titles | 14.8:1 (AAA) |
| **Kharif Green (Primary 700)** | `#1A563D` | Brand identity, active buttons, card badges | 8.2:1 (AAA) |
| **Sprout Emerald (Accent 400)** | `#4ADE80` | Live viewfinder reticle, healthy status indicators | Vibrant in dark frames |
| **Solar Loam (Warning 500)** | `#F59E0B` | Humidity alerts, moderate severity warning (SES 3–5) | 4.8:1 (AA UI) |
| **Blight Crimson (Alert 600)** | `#EF4444` | High disease risk, fungal blast alerts, severe SES (7–9) | High noticeability |
| **Sun-Bleached Field (Surface)** | `#F8FAF6` | Clean, glare-resistant card backgrounds | Neutral light base |
| **Charcoal Slate (Text High)** | `#0F172A` | Core diagnostic copy, dosages, chemical names | 17.1:1 (AAA) |

### 2.2 Typography Stack
- **Headlines & Display:** **Fraunces** & **Outfit** — Warm, authoritative, dignified modern AgriTech serif and sans-serif blend.
- **Data & Body:** **Plus Jakarta Sans** / **Inter** — Tabular figures for temperature (°C), humidity (%), chemical dosages (g/L), and acreage values.
- **Regional Language Font:** **Noto Sans Tamil** — Hand-tuned with +20% line-height to accommodate tall Dravidian ascenders/descenders without clipping.

### 2.3 Physical Affordances for Field Operations
- **Target Sizes:** All interactive touch targets are strictly **≥ 48×48 dp** to support calloused hands or single-handed thumb operation in muddy field conditions.
- **Dual-Modality (Text + Voice):** Every clinical finding, weather alert, and action protocol includes a prominent **`🔊 Listen in தமிழ் / English`** audio read-aloud button.
- **One-Thumb Zone Layout:** Primary scan triggers, re-scan actions, and bottom navigation remain within the natural lower 35% screen arc of modern smartphones.

---

## 3. Screen-by-Screen User Journey Specification

### SCREEN 01 — SPLASH SCREEN
- **Brand Mark:** Interlocking leaf + protective shield symbol illuminated by an ambient green aura.
- **Headline:** **AgriShield AI**
- **Tagline:** *“Protecting crops with intelligent early detection”*
- **Technical Sub-Badge:** `AI • MCP • Computer Vision • Smart Agriculture`
- **Visual Backdrop:** Cinematic Indian paddy terrace bathed in soft morning golden hour sunlight with gentle mist.
- **UX Intent:** Establishes instant trust, national pride, and startup-grade product maturity. Auto-transitions or allows direct tap to enter.

### SCREEN 02 — WELCOME / ONBOARDING (3 Story Cards)
- **Card 1: Detect Crop Problems Early**  
  *“Identify diseases and pests from a single leaf photo with instant field validation.”*  
  Visual: Authentic diseased rice leaf scan with active diagnosis bounding box.
- **Card 2: Understand What To Do**  
  *“Get simple, personalized agricultural guidance with clear dosages and safety warnings.”*  
  Visual: Warm Indian farmer portrait backed by biological and cultural management steps.
- **Card 3: See. Act. Protect.**  
  *“Visual progression timeline, weather context and verified government resources.”*  
  Visual: Generative progression preview, weather radar, and KVK extension link.
- **Navigation Controls:** Slide pagination dots (1/3, 2/3, 3/3), **Get Started** button, **Skip** option.

### SCREEN 03 — FARMER PROFILE SETUP
- **Form Design:** Low cognitive load, icon-assisted single screen:
  - 👤 **Farmer Name:** Text input (e.g. *Murugan K.*)
  - 🌾 **Main Crop:** Selectable chips (*Rice / Paddy, Cotton, Sugarcane, Maize*)
  - 📍 **Location:** District / Taluk input (*Thanjavur, Tamil Nadu — Cauvery Delta Zone*)
  - 📐 **Farm Size:** Quick chips (*0.5–1.0 Acre, 1.5 Acres, 3.0 Acres, 5+ Acres*)
  - 🌱 **Crop Growth Stage:** Agronomic phenology chips (*Nursery, Active Tillering, Panicle Heading, Flowering, Maturity*)
  - 🌐 **Preferred Language:** Selectable chips (*தமிழ், English, हिंदी, मराठी*)
- **Primary CTA:** **Save & Continue →**

### SCREEN 04 — LOCATION & HYPERLOCAL WEATHER PERMISSION
- **Title:** **Know Your Field**
- **Transparent Rationale:** *“Allow location access to provide relevant weather and agricultural information.”*  
  *Note: Explains clearly why microclimate data improves disease prediction (relative humidity and temperature govern fungal spore sporulation and leaf wetness).*
- **Microclimate Teaser Preview Card:**
  - 📍 *Thanjavur, Tamil Nadu*
  - ⛅ *Partly Cloudy • High Fungal Infection Risk*
  - ☀️ *29°C* | 💧 *Humidity: 72%* | 🌧 *Rain in 48h: 30%* | 💨 *Wind: 11 km/h ENE*
- **Actions:** **Allow Location Access** (Primary), **Enter Location Manually** (Secondary non-blocking option).

### SCREEN 05 — HOME DASHBOARD
- **Top Greeting Bar:** *Good morning, Murugan 👋* with farmer avatar and location pill (*Thanjavur, TN*).
- **Audio Readout Chip:** Floating `🔊 தமிழ் ஒலி` button for instant audio briefing.
- **Weather Alert Card:** Deep forest gradient banner featuring temperature, humidity, and active microclimate alert:  
  *⚠️ High Humidity (72%): High risk of Brown Spot and Blast spore spread.*
- **Hero Primary Action:** Large, tactile **`📷 SCAN MY CROP`** button with pulsating radar ring.
- **Quick Actions Grid:**
  - 💬 *Ask AgriShield (Voice Chat)*
  - 🌾 *My Crops*
  - 📜 *Disease History*
- **Active Crop Card:** *Rice (ADT 43, Plot A, 38 Days After Sowing, Active Tillering Stage)*.
- **Recent Diagnosis Alert:** *Brown Spot — SES 3 Moderate (Stabilizing) • Re-scan due in 2 days*.
- **Government Schemes Integration:** *PM Fasal Bima Yojana (PMFBY)* active claim assistance.
- **Daily Smart Farming Tip:** *“Avoid excess nitrogenous urea top-dressing during cloudy, humid weather to prevent leaf blast and brown spot proliferation.”*
- **Bottom Navigation Bar:** `Home` | `History` | `📷 Detect (Center Circle)` | `Schemes` | `Profile`.

### SCREEN 06 — CROP SCANNER (Camera-First Interface)
- **Viewfinder:** High-definition rice leaf framing reticle with corner brackets, alignment crosshairs, and a sweeping laser scan line.
- **Overlay Prompt:** *“Place the affected leaf inside the frame under even daylight”*.
- **Camera Controls:** Flash toggle (⚡), Gallery photo picker (🖼️), Shutter trigger button with haptic press ring.
- **Multimodal Voice Input:** *“🎙 Describe the problem (Tap to speak)”* (e.g. *“Small brown spots appeared 2 days after heavy rain”*).
- **Safety & Honesty Footnote:** *“Your image is used for crop pathology. Leaf validation gate rejects non-leaf photos.”*

### SCREEN 07 — IMAGE ANALYSIS & SAFETY GATE EXECUTION
- **AI Processing View:** Displays captured leaf image with laser scanning beam.
- **Progressive Milestone Steps:**
  1. [✓] Image received & lighting verified
  2. [✓] Safety gate: Plant leaf validated (Non-leaf/face rejected)
  3. [✓] Crop species identified: *Rice (Oryza sativa)*
  4. [✓] Lesion pattern segmented
  5. [✓] SES severity rating calculated
  6. [✓] Hyperlocal weather context aggregated (MCP)
  7. [✓] Agronomic action plan synthesized
- **Status Copy:** *“AgriShield AI is analyzing your crop...”* (zero ML jargon, high clarity).

### SCREEN 08 — AI DIAGNOSIS RESULT
- **Identified Condition:** **Brown Spot** (*Bipolaris oryzae / Helminthosporium oryzae*)
- **Confidence Badge:** **94.8% High Confidence** (labeled transparently as *AI First Indication*).
- **Severity Index:** **SES Scale 3 — Moderate (~12% leaf surface affected)** with colored severity progress track.
- **Interactive Lesion Segmentation Visualizer:**
  - One-tap toggle: **`Show Lesion Colour Map`** vs **`Show Original Photo`**.
  - Dynamic overlay highlighting necrotic fungal cores in crimson (`#B91C1C`) and chlorotic halos in solar ochre (`#F59E0B`).
- **Key Symptoms Checklist:**
  - Oval, sesame-seed shaped brown spots with yellow margins.
  - Greyish necrotic center indicating active sporulation.
  - Disease climbing upward from lower tillers due to microhumidity.
- **Voice Summary:** Instant audio readout in chosen language (`🔊 Listen in தமிழ்`).
- **Next Step CTA:** **View Weather & Field Context (MCP) →**

### SCREEN 09 — MCP (MODEL CONTEXT PROTOCOL) FIELD CONTEXT ENGINE
- **Purpose:** Connects the isolated leaf image with environmental and epidemiological context:
  - **Hyperlocal Microclimate Layer:** 72% relative humidity + 29°C ambient temperature. Matches optimal incubation envelope for Bipolaris conidia.
  - **Crop Phenology Layer:** Day 38 (Active Tillering). Dense foliar canopy creates stagnant humid microclimate at water surface.
  - **District Outbreak Radar:** 42 confirmed Brown Spot reports in Thanjavur district this week (regional spore cluster alert).
  - **Soil Health Telemetry:** Low potassium (K) levels documented in farmer's Soil Health Card, reducing epidermal cell wall resistance.
- **Next Step CTA:** **See AI Agronomic Explanation →**

### SCREEN 10 — AI EXPLANATION & ROOT CAUSE ANALYSIS
- **Conversational Breakdown:**
  - *Why did this happen now?*  
    *"Unseasonal showers followed by high relative humidity (72%) provided the 8 hours of continuous leaf wetness required for airborne Bipolaris fungal spores to germinate and enter stomatal openings."*
  - *What is at risk if delayed?*  
    *"If left untreated, spores will splash upward to developing panicles during heading, causing 'chaffy' discolored grain and up to 35% yield reduction."*
- **Interactive Audio Narration Player:** Scrubbable timeline, Play/Pause control, and 1.0x playback speed.
- **Next Step CTA:** **View Visual Progression (Higgsfield) →**

### SCREEN 11 — HIGGSFIELD VISUAL GUIDE (Progression Timeline Simulator)
- **Interactive Time-Scrubber:**
  - **Day 0 (Current):** Isolated brown spots on blade (~12% leaf area).
  - **Day 3 (If Untreated):** Lesions multiply and coalesce into large necrotic blights (~28% area).
  - **Day 7 (If Untreated):** Blight spreads to leaf sheath and emerging panicle branches (>55% yield loss).
  - **Day 7 (With AgriShield Treatment):** Lesions dry to light brown, sporulation arrested, new green tillers emerge (>92% recovery).
  - **Day 14 (Harvest Outcome):** Full grain filling restored vs. 35% crop penalty.
- **Dynamic Leaf Image Filter:** Renders real-time visual degradation vs. healing green restoration as farmer scrubs days.
- **Next Step CTA:** **Generate Action Plan & Treatment →**

### SCREEN 12 — ACTION PLAN & TREATMENT PROTOCOL
- **3-Tier Intervention Strategy:**
  - **Tier 1: Immediate Cultural Practices (Zero-Cost):**  
    Drain standing water to 2–3 cm depth. Apply 25 kg MOP (Muriate of Potash) per acre to reinforce leaf tissue.
  - **Tier 2: Biological & Eco-Friendly Option:**  
    Foliar spray of *Pseudomonas fluorescens* (liquid formulation) @ 2.5 ml/L during cool morning or evening hours.
  - **Tier 3: CIB&RC Approved Chemical Control (If disease exceeds 15%):**  
    Mancozeb 75% WP @ 2.0 g/L or Tricyclazole 75% WP @ 0.6 g/L. Always observe 14-day Pre-Harvest Interval (PHI).
- **Interactive Smart Dosage Calculator:**
  - Slider: Farmer adjusts acreage (0.5 to 5.0 acres).
  - Dynamic Real-Time Math:
    - *Water Required:* 300 Litres (for 1.5 acres)
    - *Chemical Needed:* 600 grams Mancozeb 75% WP
    - *Knapsack Sprayer Tanks:* 19 tanks (16L capacity)
    - *Estimated Input Cost:* ₹330
- **PPE Safety Checklist:** Visual icons for Rubber Gloves 🧤, Nose Mask 😷, Rubber Boots 🥾, 14-day PHI ⏳.
- **Doctor Escalation CTA:** **`👨‍⚕️ Request Verified Plant Doctor Call`** (Connects directly to Dr. Priyadarshini at TNAU/KVK).

### SCREEN 13 — RESOURCES, SCHEMES & NEARBY AGRI SHOPS
- **Nearby Agri-Input Retailers:**
  - *Cauvery Farmers Agro Service (1.4 km)* — Bio-fungicides & Mancozeb verified in stock (One-tap phone & map route).
  - *Thanjavur FPO Cooperative (3.2 km)* — Subsidized bio-fertilizers.
- **Government Support Integration:**
  - **PM Fasal Bima Yojana (PMFBY):** One-tap generation of geolocated crop damage intimation report for insurance survey.
  - **Kisan Call Center:** Toll-free `1800-180-1551` direct dial button.
  - **Krishi Vigyan Kendra (KVK) Thanjavur:** Extension clinic contact.
- **Next Step CTA:** **Set Follow-Up Re-Scan →**

### SCREEN 14 — FOLLOW-UP & RE-SCAN SCHEDULE
- **Automated Check-in Reminder:** Re-scan scheduled for **Day 5 (Thursday)** with SMS and WhatsApp push alert.
- **Before vs After Photo Recovery Tracker:**
  - *Slot 1 (Day 0):* Baseline scan (SES 3, 12% affected).
  - *Slot 2 (Day 5):* Placeholder ready for re-scan camera trigger.
- **Expected Recovery Signals Checklist:**
  - Spot centers dry up into pale brown crusts without yellow margins.
  - New third tiller leaf emerges clean and vibrant green.
- **Primary Action:** **Save Reminder & Go to History →**

### SCREEN 15 — CROP HISTORY & FARM TIMELINE
- **Field Diary Timeline:**
  - *Plot A (Rice ADT 43, 1.5 Acres):* 16-Sep (Brown Spot SES 3 — Treated), 02-Sep (Healthy Tillering).
  - *Plot B (Cotton RCH 659, 2.0 Acres):* 28-Aug (Healthy Boll Formation).
- **Export Certificate:** **`📄 Download AgriShield Crop Health Card (PDF)`** for Kisan Credit Card (KCC) renewal & PMFBY insurance claims.

---

## 4. Multi-Lingual & Voice UX Architecture

AgriShield AI provides complete, uncompromising feature parity between **English** and **தமிழ் (Tamil)**:
1. **Instant Language Switcher:** One-tap toggle (`🌐 தமிழ் / English`) instantly translates all screen headings, clinical findings, chemical recommendations, and unit labels.
2. **Audio Readout Player:** Embedded `speechSynthesis` engine tuned for Indian English (`en-IN`) and Tamil (`ta-IN`) with audible speed controls (0.8x, 1.0x).
3. **Voice Symptom Dictation:** Allows farmers who prefer spoken communication to speak their observations directly into the app during camera scanning.

---

## 5. Technical Implementation & Live Interactive Prototype

The accompanying interactive prototype is built directly into the codebase:
- **Mockup Shell:** Realistic smartphone titanium frame with dynamic island, camera notch, and 5G status bar.
- **Fullscreen Mode:** One-tap toggle between "📱 Phone Frame" and "🖥 Fullscreen Mobile View" for responsive testing on desktop, tablet, and mobile browsers.
- **Prototype Files:**
  - HTML: `frontend/mobile_app_concept/index.html`
  - CSS: `frontend/mobile_app_concept/styles.css`
  - JS: `frontend/mobile_app_concept/app.js`
  - Authentic Assets: `frontend/mobile_app_concept/assets/`
- **Access Routes:**
  - Backend Endpoint: `http://127.0.0.1:8000/mobile-concept`
  - Direct File Access: `file:///c:/Users/Dinesh Kumar/Desktop/AgriShield-SIH-main/AgriShield-SIH-main/frontend/mobile_app_concept/index.html`
  - Web App Header Link: Quick button added to `frontend/index.html` top navigation bar.
