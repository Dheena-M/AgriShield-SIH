/**
 * AgriShield AI — Mobile App UI/UX Concept & Interactive Prototype
 * Production-Quality Indian AgriTech Logic & Screen Flow
 */

const STATE = {
  currentScreen: 'screen-splash',
  currentLang: 'en', // 'en' or 'ta'
  isPhoneFrame: true,
  isSpeaking: false,
  onboardSlide: 1,
  showingLesionMask: false,
  higgsfieldDay: 0,
  dosageAcreage: 1.5,
  farmerProfile: {
    name: 'Murugan K.',
    crop: 'Rice / Paddy',
    location: 'Thanjavur, Tamil Nadu',
    size: '1.5 Acres',
    stage: 'Tillering',
    lang: 'ta'
  }
};

// Comprehensive Bilingual Dictionaries (English / தமிழ்)
const I18N = {
  en: {
    appTitle: 'AgriShield AI',
    appTagline: 'Protecting crops with intelligent early detection',
    techBadge: 'AI • MCP • Computer Vision • Smart Agriculture',
    enterApp: 'Get Started →',
    skip: 'Skip',
    continue: 'Continue',
    saveAndContinue: 'Save & Continue',
    allowLocation: 'Allow Location Access',
    enterManualLoc: 'Enter Location Manually',
    scanMyCrop: 'SCAN MY CROP',
    askAi: 'Ask AgriShield',
    myCrops: 'My Crops',
    history: 'History',
    schemes: 'Govt Schemes',
    profile: 'Profile',
    detect: 'Detect',
    home: 'Home',
    readAloud: 'Read Aloud',
    listening: 'Playing...',
    listenTamil: '🔊 தமிழ் ஒலி (Audio)',
    listenEnglish: '🔊 Listen (English)',
    
    // Onboarding
    onboard1Title: 'Detect Crop Problems Early',
    onboard1Desc: 'Identify diseases and pests from a single leaf photo with instant field validation.',
    onboard2Title: 'Understand What To Do',
    onboard2Desc: 'Get simple, personalized agricultural guidance with clear dosages and safety warnings.',
    onboard3Title: 'See. Act. Protect.',
    onboard3Desc: 'Visual progression timeline, weather context and verified government resources.',

    // Profile Setup
    profileTitle: 'Farmer Profile Setup',
    profileDesc: 'Personalize disease alerts and advice for your field.',
    farmerName: 'Farmer Name',
    mainCrop: 'Main Crop',
    location: 'Location',
    farmSize: 'Farm Size',
    farmingStage: 'Crop Growth Stage',
    prefLang: 'Preferred Language',

    // Permission
    permTitle: 'Know Your Field',
    permDesc: 'Allow location access to provide relevant weather and agricultural information.',
    permLocationTeaser: 'Thanjavur, Tamil Nadu (Cauvery Delta)',
    permWeatherTeaser: 'Partly Cloudy • High Fungal Infection Risk',

    // Dashboard
    goodMorning: 'Good morning',
    farmerGreeting: 'Murugan 👋',
    weatherAlert: '⚠️ High Humidity (72%): High risk of Brown Spot and Blast spore spread.',
    myCropTitle: 'My Crop',
    recentDiagTitle: 'Recent Diagnosis',
    rescanDue: 'Re-scan in 2 days',
    smartTipTitle: 'Smart Farming Tip',
    smartTipText: 'Avoid excess nitrogenous urea top-dressing during cloudy, humid weather to prevent leaf blast and brown spot proliferation.',

    // Scanner
    scanTitle: 'Scan Your Crop',
    scanOverlay: 'Place the affected leaf inside the frame',
    analyzeBtn: 'Analyze Crop',
    voiceSymptom: '🎙 Describe the problem (Tap to speak)',
    privacyNote: 'Your image is used for crop pathology. Validation gate rejects non-leaf photos.',

    // Analysis
    analyzingTitle: 'AgriShield AI is analyzing your crop...',
    step1: 'Image received & lighting verified',
    step2: 'Leaf safety gate: Plant leaf validated',
    step3: 'Crop species identified: Rice (Oryza sativa)',
    step4: 'Lesion pattern segmented',
    step5: 'SES severity rating calculated',
    step6: 'Hyperlocal weather context aggregated (MCP)',
    step7: 'Agronomic action plan synthesized',

    // Diagnosis
    diagnosisTitle: 'AI Diagnosis Result',
    diseaseName: 'Brown Spot',
    latinName: 'Bipolaris oryzae (Helminthosporium oryzae)',
    confBadge: '94.8% High Confidence',
    firstIndication: 'AI First Indication',
    severityTitle: 'SES Severity Scale: 3 (Moderate)',
    leafAreaAffected: '~12% leaf surface affected',
    toggleMaskOn: 'Show Lesion Colour Map',
    toggleMaskOff: 'Show Original Photo',
    symptomsTitle: 'Key Identified Symptoms',
    sym1: 'Dark brown oval, sesame-shaped spots with yellow chlorotic halos',
    sym2: 'Grey/white necrotic center indicating active mycelial sporulation',
    sym3: 'Spreading upward from lower tillers due to humid leaf wetness',

    // MCP
    mcpTitle: 'MCP Field & Weather Context',
    mcpDesc: 'Autonomous multi-layer context aggregated via Model Context Protocol',
    mcpWeatherTitle: 'Hyperlocal Microclimate Layer',
    mcpWeatherDesc: '72% Relative Humidity + 29°C temp. Spore germination envelope is active.',
    mcpPhenoTitle: 'Crop Phenology Layer',
    mcpPhenoDesc: 'Active Tillering (Day 38). Dense leaf canopy restricts air circulation.',
    mcpRadarTitle: 'District Outbreak Radar',
    mcpRadarDesc: '42 neighboring farms reported Brown Spot in Thanjavur this week.',

    // AI Explanation
    explTitle: 'AI Agronomic Explanation',
    whyHappened: 'Why did this happen now?',
    whyDesc: 'Unseasonal showers followed by high humidity (72%) provided the 8 hours of leaf wetness required for Bipolaris fungal conidia to penetrate stomata.',
    riskDesc: 'If left untreated, spores will splash upward to developing panicles during heading, causing chaffy grain and up to 35% harvest loss.',

    // Higgsfield
    higgsfieldTitle: 'Higgsfield Visual Guide',
    higgsfieldDesc: 'Visual disease progression simulation (Untreated vs Timely Management)',
    day0: 'Day 0 (Current)',
    day3: 'Day 3 (Untreated)',
    day7Bad: 'Day 7 (Untreated)',
    day7Good: 'Day 7 (Treated)',
    day14: 'Day 14 (Harvest)',

    // Action Plan
    actionTitle: 'Action Plan & Treatment Protocol',
    tier1: 'Tier 1: Cultural Practices (Immediate)',
    tier1Desc: 'Drain standing water to 2-3 cm. Apply 25 kg MOP (Muriate of Potash) per acre to harden epidermal walls.',
    tier2: 'Tier 2: Biological Control (Eco-Friendly)',
    tier2Desc: 'Foliar spray of Pseudomonas fluorescens @ 2.5 ml/L during cool evening hours.',
    tier3: 'Tier 3: CIB&RC Approved Chemical (If >15% severity)',
    tier3Desc: 'Mancozeb 75% WP @ 2.0 g/L or Tricyclazole 75% WP @ 0.6 g/L. Always observe 14-day pre-harvest interval.',
    calcTitle: 'Smart Dosage Calculator',
    calcWater: 'Water Volume',
    calcChemical: 'Chemical Required',
    calcTanks: 'Knapsack Tanks (16L)',
    calcCost: 'Est. Input Cost',
    doctorEscalate: '👨‍⚕️ Request Verified Plant Doctor Call',

    // Resources
    resourcesTitle: 'Resources, Schemes & Agri Stores',
    nearbyShops: 'Nearby Agri-Input Retailers',
    shop1: 'Cauvery Farmers Agro Service (1.4 km)',
    shop1Stock: 'Bio-fungicides & Mancozeb in stock',
    govSchemes: 'Government Schemes Support',
    pmfby: 'PM Fasal Bima Yojana (PMFBY)',
    pmfbyDesc: 'Generate geolocated crop damage intimation report in 1 tap.',
    kvkSupport: 'Krishi Vigyan Kendra (KVK) Thanjavur',

    // Follow-up
    followupTitle: 'Follow-up & Re-Scan Schedule',
    followupDesc: 'Scheduled re-scan reminder for Day 5 (Thursday).',
    beforeAfterTitle: 'Before & After Recovery Tracker',
    day0Photo: 'Day 0: Initial Scan (SES 3)',
    day5Slot: 'Day 5 Re-Scan (Pending)',
    setReminderBtn: 'Set Reminder & Save Follow-up',

    // History
    historyTitle: 'Crop History & Farm Timeline',
    plotA: 'Plot A: Rice (ADT 43)',
    plotB: 'Plot B: Cotton (RCH 659)',
    downloadCard: '📄 Download AgriShield Crop Health Card (PDF)'
  },

  ta: {
    appTitle: 'அக்ரிஷீல்ட் AI',
    appTagline: 'அறிவார்ந்த முன்கூட்டிய கண்டறிதல் மூலம் பயிர்களை பாதுகாத்தல்',
    techBadge: 'AI • MCP • கணினி பார்வை • ஸ்மார்ட் விவசாயம்',
    enterApp: 'தொடங்கவும் →',
    skip: 'தவிர்',
    continue: 'தொடர்க',
    saveAndContinue: 'சேமித்து தொடர்க',
    allowLocation: 'இருப்பிட அனுமதியை வழங்கவும்',
    enterManualLoc: 'இருப்பிடத்தை கைமுறையாக உள்ளிடவும்',
    scanMyCrop: 'என் பயிரை ஸ்கேன் செய்',
    askAi: 'அக்ரிஷீல்டிடம் கேள்',
    myCrops: 'என் பயிர்கள்',
    history: 'வரலாறு',
    schemes: 'அரசு திட்டங்கள்',
    profile: 'சுயவிவரம்',
    detect: 'கண்டறி',
    home: 'முகப்பு',
    readAloud: 'கேளுங்கள்',
    listening: 'ஒலிக்கிறது...',
    listenTamil: '🔊 தமிழில் கேட்க',
    listenEnglish: '🔊 Listen (English)',

    // Onboarding
    onboard1Title: 'பயிர் நோய்களை முன்கூட்டியே கண்டறியுங்கள்',
    onboard1Desc: 'ஒரு இலை புகைப்படத்திலிருந்து நோய்கள் மற்றும் பூச்சிகளை உடனடியாக கண்டறியுங்கள்.',
    onboard2Title: 'என்ன செய்ய வேண்டும் என்பதை அறியுங்கள்',
    onboard2Desc: 'துல்லியமான அளவு மற்றும் பாதுகாப்பு எச்சரிக்கைகளுடன் எளிய வழிகாட்டுதலைப் பெறுங்கள்.',
    onboard3Title: 'பார். செயல்படு. பாதுகா.',
    onboard3Desc: 'காட்சி வளர்ச்சி மாதிரி, வானிலை சூழல் மற்றும் சரிபார்க்கப்பட்ட வேளாண் ஆதரவு.',

    // Profile Setup
    profileTitle: 'விவசாயி சுயவிவரம்',
    profileDesc: 'உங்கள் வயலுக்கேற்ற நோய் எச்சரிக்கைகள் மற்றும் ஆலோசனைகளைப் பெறுங்கள்.',
    farmerName: 'விவசாயி பெயர்',
    mainCrop: 'முக்கிய பயிர்',
    location: 'இருப்பிடம்',
    farmSize: 'நில அளவு',
    farmingStage: 'பயிர் வளர்ச்சி நிலை',
    prefLang: 'விருப்ப மொழி',

    // Permission
    permTitle: 'உங்கள் வயலை அறிந்து கொள்ளுங்கள்',
    permDesc: 'சரியான வானிலை மற்றும் விவசாய தகவல்களை வழங்க இருப்பிட அணுகலை அனுமதிக்கவும்.',
    permLocationTeaser: 'தஞ்சாவூர், தமிழ்நாடு (காவிரி டெல்டா)',
    permWeatherTeaser: 'பகுதி மேகமூட்டம் • பூஞ்சை தொற்றுக்கான அதிக வாய்ப்பு',

    // Dashboard
    goodMorning: 'காலை வணக்கம்',
    farmerGreeting: 'முருகன் 👋',
    weatherAlert: '⚠️ அதிக ஈரப்பதம் (72%): இலைப்புள்ளி மற்றும் குலை நோய் பரவும் அபாயம் அதிகம்.',
    myCropTitle: 'என் பயிர்',
    recentDiagTitle: 'சமீபத்திய பரிசோதனை',
    rescanDue: '2 நாட்களில் மறு ஸ்கேன்',
    smartTipTitle: 'ஸ்மார்ட் விவசாயக் குறிப்பு',
    smartTipText: 'மேகமூட்டம் மற்றும் ஈரப்பதம் உள்ள நாட்களில் அதிக யூரியா இடுவதைத் தவிர்க்கவும்.',

    // Scanner
    scanTitle: 'பயிரை ஸ்கேன் செய்யவும்',
    scanOverlay: 'பாதிக்கப்பட்ட இலையை கட்டத்திற்குள் வைக்கவும்',
    analyzeBtn: 'பயிரை ஆய்வு செய்',
    voiceSymptom: '🎙 அறிகுறிகளை பேசுங்கள் (தட்டவும்)',
    privacyNote: 'பயிர் நோயியல் பகுப்பாய்வுக்கு மட்டுமே படம் பயன்படுத்தப்படுகிறது.',

    // Analysis
    analyzingTitle: 'அக்ரிஷீல்ட் AI உங்கள் பயிரை ஆய்வு செய்கிறது...',
    step1: 'படம் பெறப்பட்டு வெளிச்சம் சரிபார்க்கப்பட்டது',
    step2: 'பாதுகாப்பு சோதனை: தாவர இலை உறுதிப்படுத்தப்பட்டது',
    step3: 'பயிர் இனம் கண்டறியப்பட்டது: நெல் (Oryza sativa)',
    step4: 'புள்ளி பகுப்பாய்வு நிறைவுற்றது',
    step5: 'SES தீவிரத்தன்மை கணக்கிடப்பட்டது',
    step6: 'நுண்ணிய வானிலை சூழல் திரட்டப்பட்டது (MCP)',
    step7: 'செயல்திட்டம் உருவாக்கப்பட்டது',

    // Diagnosis
    diagnosisTitle: 'AI நோய் கண்டறிதல் முடிவு',
    diseaseName: 'பழுப்பு இலைப்புள்ளி நோய் (Brown Spot)',
    latinName: 'பைபோலாரிஸ் ஒரைசே (Bipolaris oryzae)',
    confBadge: '94.8% அதிக நம்பிக்கை',
    firstIndication: 'AI முதற்கட்ட அறிக்கை',
    severityTitle: 'SES தீவிரத்தன்மை: நிலை 3 (மிதமானது)',
    leafAreaAffected: '~12% இலைப்பரப்பு பாதிக்கப்பட்டுள்ளது',
    toggleMaskOn: 'புள்ளி வரைபடத்தைக் காட்டு',
    toggleMaskOff: 'அசல் புகைப்படத்தைக் காட்டு',
    symptomsTitle: 'முக்கிய அறிகுறிகள்',
    sym1: 'மஞ்சள் வளையத்துடன் கூடிய அடர் பழுப்பு நிற எள் போன்ற புள்ளிகள்',
    sym2: 'சாம்பல் நிற மையம் - பூஞ்சை வளர்ச்சியை குறிக்கிறது',
    sym3: 'ஈரப்பதத்தால் கீழ் தூர்களில் இருந்து மேலே பரவும் தன்மை',

    // MCP
    mcpTitle: 'MCP வயல் மற்றும் வானிலை சூழல்',
    mcpDesc: 'Model Context Protocol மூலம் தானாக திரட்டப்பட்ட விவசாய சூழல்',
    mcpWeatherTitle: 'நுண்ணிய வானிலை அடுக்கு',
    mcpWeatherDesc: '72% ஈரப்பதம் + 29°C வெப்பம். பூஞ்சை வித்துக்கள் முளைக்க சாதகமானது.',
    mcpPhenoTitle: 'பயிர் வளர்ச்சி அடுக்கு',
    mcpPhenoDesc: 'தூர்க்கட்டும் பருவம் (38 நாட்கள்). அடர்ந்த இலைகள் ஈரப்பதத்தை தேக்குகின்றன.',
    mcpRadarTitle: 'மாவட்ட நோய் எச்சரிக்கை ரேடார்',
    mcpRadarDesc: 'இந்த வாரம் தஞ்சாவூர் மாவட்டத்தில் 42 வயல்களில் இந்நோய் பதிவாகியுள்ளது.',

    // AI Explanation
    explTitle: 'AI வேளாண்மை விளக்கம்',
    whyHappened: 'இது இப்போது ஏன் ஏற்பட்டது?',
    whyDesc: 'பருவம் தவறிய மழை மற்றும் 72% ஈரப்பதம் காரணமாக இலைகளில் 8 மணி நேரம் நீர் தங்கியதால் பூஞ்சை வித்துக்கள் இலைத்துளை வழியாக உள்நுழைந்தன.',
    riskDesc: 'கவனிக்காவிட்டால், கதிர் வரும்போது மணிகளில் கருப்பு புள்ளிகள் தோன்றி 35% வரை மகசூல் இழப்பு ஏற்படும்.',

    // Higgsfield
    higgsfieldTitle: 'ஹிக்ஸ்ஃபீல்ட் காட்சி வழிகாட்டி',
    higgsfieldDesc: 'நோய் வளர்ச்சி உருவகப்படுத்துதல் (சிகிச்சை செய்யாதது vs சரியான மேலாண்மை)',
    day0: 'நாள் 0 (இன்று)',
    day3: 'நாள் 3 (சிகிச்சையின்றி)',
    day7Bad: 'நாள் 7 (சிகிச்சையின்றி)',
    day7Good: 'நாள் 7 (சிகிச்சையுடன்)',
    day14: 'நாள் 14 (அறுவடை)',

    // Action Plan
    actionTitle: 'செயல்திட்டம் & மேலாண்மை முறை',
    tier1: 'நிலை 1: உழவியல் முறைகள் (உடனடி நடவடிக்கை)',
    tier1Desc: 'வயலில் தேங்கியுள்ள நீரை வடித்து 2-3 செ.மீ வைக்கவும். ஏக்கருக்கு 25 கிலோ பொட்டாஷ் உரமிட்டு இலை வலிமையை கூட்டவும்.',
    tier2: 'நிலை 2: இயற்கை மற்றும் உயிர் கட்டுப்பாடு',
    tier2Desc: 'சூடோமோனாஸ் ஃப்ளோரசன்ஸ் 2.5 மி.லி/லிட்டர் தண்ணீரில் கலந்து மாலையில் தெளிக்கவும்.',
    tier3: 'நிலை 3: CIB&RC பரிந்துரைத்த பூஞ்சாணக்கொல்லி',
    tier3Desc: 'மேன்கோசெப் 75% WP 2 கிராம்/லிட்டர் அல்லது ட்ரைசைக்ளசோல் 75% WP 0.6 கிராம்/லிட்டர். 14 நாட்கள் இடைவெளி காக்கவும்.',
    calcTitle: 'மருந்து அளவு கால்குலேட்டர்',
    calcWater: 'தேவையான தண்ணீர்',
    calcChemical: 'தேவையான மருந்து',
    calcTanks: 'தெளிப்பான் தொட்டிகள் (16L)',
    calcCost: 'தோராய செலவு',
    doctorEscalate: '👨‍⚕️ வேளாண் விஞ்ஞானி / மருத்துவரை அழைக்க',

    // Resources
    resourcesTitle: 'வளங்கள், அரசு திட்டங்கள் & கடைகள்',
    nearbyShops: 'அருகிலுள்ள உரம் & மருந்து கடைகள்',
    shop1: 'காவிரி உழவர் அக்ரோ சர்வீஸ் (1.4 கி.மீ)',
    shop1Stock: 'உயிர் உரங்கள் & மேன்கோசெப் கையிருப்பில் உள்ளது',
    govSchemes: 'அரசு மானியங்கள் & திட்டங்கள்',
    pmfby: 'பிரதமர் பயிர் காப்பீட்டுத் திட்டம் (PMFBY)',
    pmfbyDesc: 'ஒரு தட்டலில் ஜிபிஎஸ் இருப்பிடத்துடன் கூடிய பயிர் இழப்பு அறிக்கை பெறலாம்.',
    kvkSupport: 'வேளாண் அறிவியல் நிலையம் (KVK) தஞ்சாவூர்',

    // Follow-up
    followupTitle: 'மறு பரிசோதனை நினைவூட்டல்',
    followupDesc: '5-வது நாளில் (வியாழன்) மறு ஸ்கேன் செய்ய நினைவூட்டல் அமைக்கப்பட்டது.',
    beforeAfterTitle: 'முன் & பின் குணமடைதல் கண்காணிப்பு',
    day0Photo: 'நாள் 0: முதல் ஸ்கேன் (SES 3)',
    day5Slot: 'நாள் 5 மறு ஸ்கேன் (நிலுவை)',
    setReminderBtn: 'நினைவூட்டலை சேமிக்கவும்',

    // History
    historyTitle: 'பயிர் வரலாறு & காலவரிசை',
    plotA: 'வயல் A: நெல் (ADT 43)',
    plotB: 'வயல் B: பருத்தி (RCH 659)',
    downloadCard: '📄 பயிர் சுகாதார அட்டை (PDF) பதிவிறக்கு'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupOnboarding();
  setupScanner();
  setupDosageCalculator();
  setupHiggsfieldSlider();
  setupLanguageToggle();
  setupFrameToggle();
  applyTranslations();
  updateTimeInStatusBar();
});

// Update Simulated System Time in Status Bar
function updateTimeInStatusBar() {
  const timeEl = document.getElementById('statusTime');
  if (!timeEl) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  timeEl.textContent = `${hours}:${minutes}`;
}

// Language Switching
function setupLanguageToggle() {
  const langBtns = document.querySelectorAll('.lang-toggle-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.currentLang = STATE.currentLang === 'en' ? 'ta' : 'en';
      langBtns.forEach(b => {
        b.textContent = STATE.currentLang === 'en' ? 'தமிழ்' : 'English';
      });
      applyTranslations();
    });
  });
}

function applyTranslations() {
  const lang = STATE.currentLang;
  const dict = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Dynamic Audio Label updates
  const audioChip = document.getElementById('audioNarrationChip');
  if (audioChip && !STATE.isSpeaking) {
    audioChip.textContent = lang === 'en' ? dict.listenEnglish : dict.listenTamil;
  }
}

// Navigation & Screen Management
function setupNavigation() {
  // Screen chip selector in showcase top bar
  const screenChips = document.querySelectorAll('.screen-chip');
  screenChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const targetScreen = chip.getAttribute('data-screen');
      navigateToScreen(targetScreen);
    });
  });

  // Bottom Navigation tabs
  const navTabs = document.querySelectorAll('.nav-tab-item');
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-nav-target');
      if (target) {
        navigateToScreen(target);
      }
    });
  });
}

function navigateToScreen(screenId) {
  STATE.currentScreen = screenId;
  
  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    // Scroll screen to top
    const screenWrapper = document.getElementById('deviceScreen');
    if (screenWrapper) screenWrapper.scrollTop = 0;
  }

  // Update top selector bar chips
  document.querySelectorAll('.screen-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-screen') === screenId);
  });

  // Update bottom nav state
  updateBottomNavState(screenId);

  // Status bar dark/light mode toggle
  const statusBar = document.getElementById('statusBar');
  if (statusBar) {
    const isDarkScreen = ['screen-splash', 'screen-scanner', 'screen-analysis'].includes(screenId);
    statusBar.classList.toggle('dark-mode', isDarkScreen);
  }

  // If entering analysis screen, trigger simulated progress
  if (screenId === 'screen-analysis') {
    runAnalysisSimulation();
  }
}

function updateBottomNavState(screenId) {
  const navTabs = document.querySelectorAll('.nav-tab-item');
  navTabs.forEach(tab => tab.classList.remove('active'));

  if (screenId === 'screen-home') {
    document.getElementById('navTabHome')?.classList.add('active');
  } else if (screenId === 'screen-scanner' || screenId === 'screen-diagnosis') {
    document.getElementById('navTabDetect')?.classList.add('active');
  } else if (screenId === 'screen-history' || screenId === 'screen-followup') {
    document.getElementById('navTabHistory')?.classList.add('active');
  } else if (screenId === 'screen-resources') {
    document.getElementById('navTabSchemes')?.classList.add('active');
  } else if (screenId === 'screen-profile') {
    document.getElementById('navTabProfile')?.classList.add('active');
  }

  // Hide bottom nav on splash, onboard, permissions, scanner, and analysis
  const bottomNav = document.getElementById('bottomNavBar');
  if (bottomNav) {
    const noNavScreens = ['screen-splash', 'screen-onboard', 'screen-profile-setup', 'screen-permission', 'screen-scanner', 'screen-analysis'];
    bottomNav.style.display = noNavScreens.includes(screenId) ? 'none' : 'flex';
  }
}

// Onboarding Carousel
function setupOnboarding() {
  const dots = document.querySelectorAll('.onboard-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideNum = parseInt(dot.getAttribute('data-slide'));
      showOnboardSlide(slideNum);
    });
  });
}

function showOnboardSlide(num) {
  STATE.onboardSlide = num;
  document.querySelectorAll('.onboard-slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.getElementById(`onboardSlide${num}`)?.classList.add('active');

  document.querySelectorAll('.onboard-dot').forEach(dot => {
    dot.classList.toggle('active', parseInt(dot.getAttribute('data-slide')) === num);
  });
}

function nextOnboardSlide() {
  if (STATE.onboardSlide < 3) {
    showOnboardSlide(STATE.onboardSlide + 1);
  } else {
    navigateToScreen('screen-profile-setup');
  }
}

// Scanner Interactions & Analysis Simulation
function setupScanner() {
  const shutterBtn = document.getElementById('shutterBtn');
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      // Trigger camera shutter flash animation
      const flashEl = document.getElementById('scannerFlash');
      if (flashEl) {
        flashEl.style.opacity = '1';
        setTimeout(() => { flashEl.style.opacity = '0'; }, 150);
      }
      setTimeout(() => {
        navigateToScreen('screen-analysis');
      }, 350);
    });
  }

  // Voice symptom recording simulation
  const voiceBtn = document.getElementById('voiceSymptomBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      voiceBtn.classList.toggle('active');
      const isRec = voiceBtn.classList.contains('active');
      voiceBtn.style.background = isRec ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.12)';
      voiceBtn.innerHTML = isRec ? '🔴 <span>Recording symptoms... (Tap to stop)</span>' : '🎙 <span>Describe the problem (Tap to speak)</span>';
    });
  }
}

function runAnalysisSimulation() {
  const steps = [
    'stepImageReceived',
    'stepLeafGate',
    'stepCropIdentified',
    'stepLesionSegmented',
    'stepSeverityCalculated',
    'stepMcpContext',
    'stepActionGenerated'
  ];

  // Reset steps
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('done');
      const icon = el.querySelector('.step-icon-state');
      if (icon) icon.textContent = '○';
    }
  });

  // Sequentially animate checkmarks
  let delay = 350;
  steps.forEach((id, index) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('done');
        const icon = el.querySelector('.step-icon-state');
        if (icon) icon.textContent = '✓';
      }
      // On last step, navigate to diagnosis
      if (index === steps.length - 1) {
        setTimeout(() => {
          navigateToScreen('screen-diagnosis');
        }, 600);
      }
    }, delay);
    delay += 400;
  });
}

// Lesion Segmentation Toggle
function toggleLesionMask() {
  const box = document.getElementById('interactiveLeafBox');
  const btn = document.getElementById('lesionToggleBtn');
  if (!box || !btn) return;

  STATE.showingLesionMask = !STATE.showingLesionMask;
  box.classList.toggle('showing-mask', STATE.showingLesionMask);

  const lang = STATE.currentLang;
  btn.innerHTML = STATE.showingLesionMask 
    ? `<span>🗺️</span> <span>${I18N[lang].toggleMaskOff}</span>`
    : `<span>🔍</span> <span>${I18N[lang].toggleMaskOn}</span>`;
}

// Higgsfield Visual Progression Slider
function setupHiggsfieldSlider() {
  const dayButtons = document.querySelectorAll('.day-step-btn');
  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'));
      setHiggsfieldDay(day);
    });
  });
}

function setHiggsfieldDay(day) {
  STATE.higgsfieldDay = day;
  document.querySelectorAll('.day-step-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-day')) === day);
  });

  const previewImg = document.getElementById('higgsfieldPreviewImg');
  const floatingTag = document.getElementById('higgsfieldFloatingTag');
  const floatingStatus = document.getElementById('higgsfieldFloatingStatus');

  if (!previewImg || !floatingTag || !floatingStatus) return;

  if (day === 0) {
    floatingTag.textContent = 'Day 0 (Current State)';
    floatingStatus.textContent = 'Isolated brown spots on upper blade. Healthy tillers intact (~12% affected).';
    previewImg.style.filter = 'contrast(1) sepia(0.05)';
  } else if (day === 3) {
    floatingTag.textContent = 'Day 3 (If Untreated)';
    floatingStatus.textContent = 'Lesions coalesce and enlarge. Leaf tips turn yellow-chlorotic (~28% affected).';
    previewImg.style.filter = 'contrast(1.2) sepia(0.35) hue-rotate(-20deg)';
  } else if (day === 7) {
    floatingTag.textContent = 'Day 7 (If Untreated)';
    floatingStatus.textContent = 'Severe blight. Spreads to leaf sheath and emerging panicles (>55% yield loss).';
    previewImg.style.filter = 'contrast(1.4) sepia(0.7) hue-rotate(-40deg) brightness(0.85)';
  } else if (day === 8) { // 8 represents Day 7 with Treatment
    floatingTag.textContent = 'Day 7 (With AgriShield Protocol)';
    floatingStatus.textContent = 'Sporulation arrested. Lesions dried up. Fresh emerald tillers emerging (>92% recovery).';
    previewImg.style.filter = 'contrast(1.05) saturate(1.2) brightness(1.05)';
  } else if (day === 14) {
    floatingTag.textContent = 'Day 14 (Harvest Outcome)';
    floatingStatus.textContent = 'Normal grain filling restored. Panicles robust with clean golden grains.';
    previewImg.style.filter = 'contrast(1.1) saturate(1.3) brightness(1.1)';
  }
}

// Smart Dosage & Knapsack Tank Calculator
function setupDosageCalculator() {
  const slider = document.getElementById('acreageSlider');
  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const acres = parseFloat(e.target.value);
    updateDosageCalculations(acres);
  });
}

function updateDosageCalculations(acres) {
  STATE.dosageAcreage = acres;
  const acreageValEl = document.getElementById('acreageValueDisplay');
  if (acreageValEl) acreageValEl.textContent = `${acres.toFixed(1)} Acres`;

  // Standard Rice Foliar Spray Math (200L water per acre, 2.0g Mancozeb per L)
  const waterL = Math.round(acres * 200);
  const tanks = Math.ceil(waterL / 16); // 16L standard knapsack tank
  const chemicalGrams = Math.round(waterL * 2.0);
  const estCost = Math.round(chemicalGrams * 0.55); // approx ₹0.55 per gram

  document.getElementById('calcWaterLitres').textContent = `${waterL} L`;
  document.getElementById('calcChemicalGrams').textContent = `${chemicalGrams} g`;
  document.getElementById('calcTankCount').textContent = `${tanks} Tanks`;
  document.getElementById('calcEstCost').textContent = `₹${estCost}`;
}

// Simulated Speech Audio Narration
function toggleAudioNarration() {
  const chip = document.getElementById('audioNarrationChip');
  const lang = STATE.currentLang;
  const dict = I18N[lang];

  if (STATE.isSpeaking) {
    window.speechSynthesis?.cancel();
    STATE.isSpeaking = false;
    if (chip) {
      chip.classList.remove('speaking');
      chip.textContent = lang === 'en' ? dict.listenEnglish : dict.listenTamil;
    }
  } else {
    STATE.isSpeaking = true;
    if (chip) {
      chip.classList.add('speaking');
      chip.textContent = `🔊 ${dict.listening}`;
    }

    const narrationText = lang === 'en'
      ? 'AgriShield AI diagnosis: Brown Spot identified with 94.8% confidence. SES severity scale 3 moderate. Caused by Bipolaris oryzae due to high humidity of 72%. Drain excess water and apply Pseudomonas fluorescens.'
      : 'அக்ரிஷீல்ட் AI அறிக்கை: பழுப்பு இலைப்புள்ளி நோய் 94.8 சதவிகித துல்லியத்துடன் கண்டறியப்பட்டுள்ளது. தீவிரத்தன்மை நிலை 3. 72 சதவிகித ஈரப்பதம் காரணமாக பைபோலாரிஸ் பூஞ்சையால் ஏற்பட்டது. வயல் நீரை வடித்து சூடோமோனாஸ் தெளிக்கவும்.';

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 0.95;
      utterance.lang = lang === 'en' ? 'en-IN' : 'ta-IN';
      utterance.onend = () => {
        STATE.isSpeaking = false;
        if (chip) {
          chip.classList.remove('speaking');
          chip.textContent = lang === 'en' ? dict.listenEnglish : dict.listenTamil;
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer if speech synthesis is not supported in current browser
      setTimeout(() => {
        STATE.isSpeaking = false;
        if (chip) {
          chip.classList.remove('speaking');
          chip.textContent = lang === 'en' ? dict.listenEnglish : dict.listenTamil;
        }
      }, 5000);
    }
  }
}

// Modal Popups (Doctor Call & Crop Health Card)
function openDoctorCallModal() {
  const modal = document.getElementById('doctorCallModal');
  if (modal) modal.classList.add('active');
}

function closeDoctorCallModal() {
  const modal = document.getElementById('doctorCallModal');
  if (modal) modal.classList.remove('active');
}

function openHealthCardModal() {
  const modal = document.getElementById('healthCardModal');
  if (modal) modal.classList.add('active');
}

function closeHealthCardModal() {
  const modal = document.getElementById('healthCardModal');
  if (modal) modal.classList.remove('active');
}

// Toggle Phone Frame vs Fullscreen view
function setupFrameToggle() {
  const frameBtn = document.getElementById('toggleFrameBtn');
  const phoneDevice = document.getElementById('phoneDevice');
  if (frameBtn && phoneDevice) {
    frameBtn.addEventListener('click', () => {
      STATE.isPhoneFrame = !STATE.isPhoneFrame;
      phoneDevice.classList.toggle('full-mode', !STATE.isPhoneFrame);
      frameBtn.textContent = STATE.isPhoneFrame ? '📱 Phone Frame' : '🖥 Fullscreen View';
      frameBtn.classList.toggle('active', !STATE.isPhoneFrame);
    });
  }
}

// Mobile Screen Drawer
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobileDrawerModal');
  if (drawer) {
    drawer.classList.toggle('active');
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawerModal');
  if (drawer) {
    drawer.classList.remove('active');
  }
}

