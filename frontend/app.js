const API = "";
const LANG_CODE = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", mr: "mr-IN" };
const OFFLINE_CACHEABLE = new Set(["/api/doctors", "/api/medicines", "/api/crops"]);

const state = {
  lang: localStorage.getItem("lang") || "en",
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  page: location.hash.replace("#", "") || "home",
};

function t(k) {
  return (I18N[state.lang] && I18N[state.lang][k]) || I18N.en[k] || k;
}

function pick(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  const selected = obj[state.lang];
  return selected && !/^[?\s]+$/.test(selected) ? selected : obj.en || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateConnectivity() {
  const banner = document.getElementById("offlineBanner");
  if (!banner) return;
  const offline = !navigator.onLine;
  banner.hidden = !offline;
  banner.textContent = offline
    ? "Offline mode: saved guidance, doctors, medicines and crops are available. Booking, orders, live chat and AI analysis reconnect when online."
    : "";
}

async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (state.token) headers.Authorization = "Bearer " + state.token;
  const method = (opts.method || "GET").toUpperCase();
  try {
    const res = await fetch(API + path, { ...opts, headers });
    if (res.status === 401) throw new Error("auth");
    if (!res.ok) {
      const raw = await res.text();
      let message = raw || "Request failed";
      try { message = JSON.parse(raw).detail || message; } catch (_) { /* plain-text error */ }
      throw new Error(message);
    }
    const data = await res.json();
    if (method === "GET" && OFFLINE_CACHEABLE.has(path)) {
      localStorage.setItem("agrishield-cache:" + path, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    const saved = method === "GET" && OFFLINE_CACHEABLE.has(path) && localStorage.getItem("agrishield-cache:" + path);
    if (saved) return JSON.parse(saved);
    if (!navigator.onLine) throw new Error("This action needs an internet connection.");
    throw error;
  }
}

function formBody(obj) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  return fd;
}

function setUser(token, user) {
  state.token = token;
  state.user = user;
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  render();
}

function nav() {
  const farmer = [
    ["farm-dashboard", t("myFarm")],
    ["outbreaks", t("outbreaks")],
    ["community-map", t("communityMap")],
    ["weather-risk", t("weatherRisk")],
    ["detect", t("detect")],
    ["doctors", t("doctors")],
    ["chat", t("chat")],
    ["shop", t("shop")],
    ["seeds", t("seeds")],
    ["orders", t("orders")],
    ["plants", t("plants")],
    ["dash", t("dash")],
    ["risk", t("risk")],
    ["symptoms", t("symptoms")],
    ["advisor", t("advisor")],
    ["farm-tools", t("farmTools")],
    ["schemes", t("schemes")],
    ["data-catalog", t("dataCatalog")],
    ["algorithms", t("algorithms")],
    ["feedback", t("feedback")],
  ];
  const doctor = [
    ["dash", t("dash")],
    ["outbreaks", t("outbreaks")],
    ["community-map", t("communityMap")],
    ["chat", t("chat")],
    ["algorithms", t("algorithms")],
    ["feedback", t("feedback")],
  ];
  const links = state.user && state.user.role === "doctor" ? doctor : farmer;
  document.getElementById("nav").innerHTML = links
    .map(([id, label]) => `<a href="#${id}" class="${state.page === id ? "active" : ""}">${label}</a>`)
    .join("");
  document.getElementById("authBtn").textContent = state.user ? t("logout") : t("login");
  renderMobileNavigation(links);
  const lang = document.getElementById("lang");
  lang.innerHTML = [
    ["en", "English"],
    ["hi", "हिन्दी"],
    ["ta", "தமிழ்"],
    ["mr", "मराठी"],
  ]
    .map(([v, l]) => `<option value="${v}" ${state.lang === v ? "selected" : ""}>${l}</option>`)
    .join("");
}

const NAV_ICON = {
  "farm-dashboard": "potted_plant",
  outbreaks: "crisis_alert",
  "community-map": "map",
  "weather-risk": "thermostat",
  detect: "document_scanner",
  doctors: "support_agent",
  chat: "forum",
  shop: "storefront",
  seeds: "spa",
  orders: "local_shipping",
  plants: "grid_view",
  dash: "dashboard",
  risk: "warning",
  symptoms: "search",
  advisor: "recommend",
  "farm-tools": "construction",
  schemes: "account_balance",
  "data-catalog": "database",
  algorithms: "neurology",
  feedback: "rate_review",
};

function renderMobileNavigation(links) {
  const mobile = document.getElementById("mobileNav");
  const bottom = document.getElementById("bottomNav");
  if (!mobile || !bottom) return;
  mobile.classList.remove("open");
  mobile.innerHTML = `<div class="mobile-nav__inner"><p class="eyebrow">AgriShield Suite</p>${links
    .map(([id, label]) => `<a href="#${id}" class="${state.page === id ? "active" : ""}" onclick="toggleMobileNav(false)"><span class="material-symbols-outlined">${NAV_ICON[id] || "apps"}</span>${label}</a>`)
    .join("")}</div>`;
  const primary = state.user && state.user.role === "doctor"
    ? [["dash", "Dashboard"], ["detect", "Scan"], ["chat", "Consult"], ["shop", "Store"], ["farm-tools", "Tools"]]
    : [["farm-dashboard", "My Farm"], ["detect", "AI Scan"], ["doctors", "Consult"], ["shop", "Store"], ["farm-tools", "Tools"]];
  bottom.innerHTML = primary
    .map(([id, label]) => `<a href="#${id}" class="${state.page === id ? "active" : ""}"><span class="material-symbols-outlined">${NAV_ICON[id] || "apps"}</span><span>${label}</span></a>`)
    .join("");
}

function toggleMobileNav(force) {
  const mobile = document.getElementById("mobileNav");
  if (!mobile) return;
  mobile.classList.toggle("open", typeof force === "boolean" ? force : undefined);
}

const INVALID_LEAF_MESSAGE = "Invalid Image. Please upload a clear crop/plant leaf image for disease detection.";

function setLeafPreview(file) {
  const preview = document.getElementById("prev");
  if (!preview || !file) return;
  if (window._leafPreviewUrl) URL.revokeObjectURL(window._leafPreviewUrl);
  window._leafPreviewUrl = URL.createObjectURL(file);
  window._leafPreviewFile = file;
  preview.src = window._leafPreviewUrl;
  preview.hidden = false;
}

function showInvalidLeafMessage() {
  const output = document.getElementById("detectOut");
  if (!output) return;
  output.innerHTML = `<div class="card" style="margin-top:14px;border-color:var(--danger)">
    <p style="color:var(--danger);margin:0 0 8px"><b>${INVALID_LEAF_MESSAGE}</b></p>
    <p class="muted" style="margin:0">Disease detection was not run. Use a clear daylight photo of one crop leaf.</p>
  </div>`;
}

async function validateUploadFile(file) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/bmp"]);
  const allowedExtensions = /\.(jpe?g|png|webp|bmp)$/i;
  if (!file || !file.size || file.size > 6 * 1024 * 1024) return false;
  if (!allowedTypes.has(file.type) && !allowedExtensions.test(file.name || "")) return false;

  const url = URL.createObjectURL(file);
  try {
    const dimensions = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("Image could not be decoded"));
      image.src = url;
    });
    return dimensions.width >= 48 && dimensions.height >= 48;
  } catch (_) {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function previewLeaf(event) {
  const file = event.target.files && event.target.files[0];
  const hint = document.getElementById("uploadHint");
  if (!file) return;
  setLeafPreview(file);
  if (hint) hint.textContent = `${file.name} ready for analysis`;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG_CODE[state.lang] || "en-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function listen(onText) {
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) {
    alert("Voice input requires a browser with Web Speech support (Chrome/Edge).");
    return;
  }
  const r = new Rec();
  r.lang = LANG_CODE[state.lang];
  r.interimResults = false;
  r.onresult = (e) => onText(e.results[0][0].transcript);
  r.start();
  return r;
}

function home() {
  return `
    <section class="scan-hero">
      <div class="scan-hero__top">
        <span class="eyebrow inverse"><span class="material-symbols-outlined" style="font-size:16px">eco</span> AgriShield Agritech</span>
        <button class="text-button" style="color:#d5f6dd" onclick="speak('${escapeHtml(t("heroTitle"))}')"><span class="material-symbols-outlined" style="font-size:16px">volume_up</span> Audio</button>
      </div>
      <h2>${t("heroTitle")}</h2>
      <p>${t("heroBody")}</p>
      <div class="scan-actions">
        <a class="btn light" href="#detect"><span class="material-symbols-outlined">photo_camera</span> ${t("detect")}</a>
        <a class="secondary-inverse" href="#doctors">${t("doctors")}</a>
      </div>
      <div class="card" style="margin-top:20px;background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);color:#fff">
        <h3 style="color:#fff;margin:0 0 6px">Quick Demo Accounts</h3>
        <p style="margin:0 0 12px;opacity:0.9;font-size:0.88rem">Farmer: farmer@agrishield.in / Farmer@123 · Doctor: ananya.patil@agrishield.in / Doctor@123</p>
        <div class="row">
          <button class="btn light" onclick="demoLogin('farmer')">${t("demoFarmer")}</button>
          <button class="ghost" style="background:#fff;color:var(--moss)" onclick="demoLogin('doctor')">${t("demoDoctor")}</button>
        </div>
      </div>
    </section>
    <div class="grid">
      <div class="card"><p class="eyebrow">1. Edge AI</p><h3>AI Leaf Diagnosis</h3><p class="muted">Instant leaf disease classification with trained CNN models.</p></div>
      <div class="card"><p class="eyebrow">2. Treatments</p><h3>Agri-Input Store</h3><p class="muted">Matched medicines with organic bio-fungicide options.</p></div>
      <div class="card"><p class="eyebrow">3. Tele-Agronomy</p><h3>Plant Doctor Consultation</h3><p class="muted">Verified agricultural scientists with video, notes & voice.</p></div>
      <div class="card"><p class="eyebrow">4. Telemetry</p><h3>Soil & Sensor Suite</h3><p class="muted">BLE probe telemetry, NPK status, and plot comparison.</p></div>
    </div>
  `;
}

async function smartFarmDashboardPage() {
  if (!state.user) return loginPage();
  if (state.user.role !== "farmer") return dashPage();
  const data = await api("/api/dashboard");
  let outbreaks = [];
  try {
    outbreaks = await api("/api/outbreaks/nearby?lat=16.8524&lon=74.5815&crop=&radius_km=35");
  } catch (_) {}
  const topOutbreak = outbreaks && outbreaks.length ? outbreaks[0] : null;

  const outbreakAlertHtml = topOutbreak ? `
    <section class="outbreak-banner ${topOutbreak.in_quarantine_radius ? 'quarantine-active' : ''}">
      <div class="outbreak-banner__left">
        <div class="pulse-indicator ${topOutbreak.in_quarantine_radius ? 'critical' : 'warning'}">
          <span class="material-symbols-outlined">${topOutbreak.in_quarantine_radius ? 'crisis_alert' : 'warning'}</span>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span class="badge ${topOutbreak.in_quarantine_radius ? 'badge-danger' : 'badge-amber'}">
              ${topOutbreak.in_quarantine_radius ? '⚠️ QUARANTINE PERIMETER ACTIVE' : '🚨 NEARBY OUTBREAK DETECTED'}
            </span>
            <span class="distance-badge">${topOutbreak.distance_km} km away · ${escapeHtml(topOutbreak.location_name)}</span>
            <span class="badge ${topOutbreak.severity === 'Critical' ? 'badge-danger' : 'badge-amber'}">${topOutbreak.severity}</span>
          </div>
          <h3 style="margin:4px 0 2px">${escapeHtml(topOutbreak.crop.toUpperCase())}: ${escapeHtml(topOutbreak.disease_name)}</h3>
          <p class="subtle" style="margin:0;font-size:0.86rem"><b>Immediate Advisory:</b> ${escapeHtml(topOutbreak.advisory)}</p>
        </div>
      </div>
      <div class="outbreak-banner__actions">
        <a href="#outbreaks" class="btn ${topOutbreak.in_quarantine_radius ? 'btn-danger' : ''}">Barrier Protocol</a>
        <a href="#community-map" class="ghost">Live Map</a>
      </div>
    </section>
  ` : '';

  const scans = data.recent_scans.length
    ? data.recent_scans.slice(0, 4).map((scan) => `<li><span class="status-dot ${scan.risk === "High" ? "danger" : ""}"></span><div><b>${escapeHtml(scan.crop)} · ${escapeHtml(scan.disease_key.replaceAll("_", " "))}</b><small>${Math.round(scan.confidence * 100)}% confidence · ${escapeHtml(scan.risk)} risk</small></div><a href="#detect" class="material-symbols-outlined" style="color:var(--leaf);text-decoration:none">chevron_right</a></li>`).join("")
    : `<li class="empty-state"><span class="material-symbols-outlined" style="font-size:32px;color:var(--leaf)">document_scanner</span><div><b>Your first scan starts here</b><small>Take a clear photo of one leaf in daylight.</small></div></li>`;
  const appointment = data.appointments.length
    ? `${escapeHtml(data.appointments[0].date)} · ${escapeHtml(data.appointments[0].doctor)}`
    : "No upcoming plant-doctor session booked";
  return `
    <section class="farm-welcome">
      <div>
        <p class="eyebrow"><span class="online-dot"></span>My Farm Dashboard</p>
        <h1>Namaste, ${escapeHtml(state.user.name)}!<span class="verified-icon material-symbols-outlined" title="Verified Producer">verified</span></h1>
        <p class="farm-meta">Kharif Season · ${data.counts.plants || 4} Plots · Sangli, Maharashtra</p>
        <a class="voice-prompt" href="#chat">
          <div class="voice-icon-box"><span class="material-symbols-outlined">mic</span></div>
          <span>Ask by voice: “Spray schedule for paddy blight”...</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
      <div class="weather-tile">
        <div class="weather-tile__top">
          <div class="weather-tile__temp">
            <span class="material-symbols-outlined">partly_cloudy_day</span>
            <div><b>29°C</b><small class="muted" style="display:block">Partly Cloudy</small></div>
          </div>
          <div class="weather-tile__stats">
            <span><span class="material-symbols-outlined" style="font-size:16px;color:var(--leaf)">humidity_mid</span> 74%</span>
            <span><span class="material-symbols-outlined" style="font-size:16px;color:var(--leaf)">water_drop</span> 20%</span>
          </div>
        </div>
        <div class="weather-tile__advisory">
          <span class="material-symbols-outlined" style="font-size:16px">check_circle</span>
          <span><b>3-Day Advisory:</b> Optimal spray window today before 4 PM.</span>
        </div>
      </div>
    </section>
    ${outbreakAlertHtml}
    <section class="scan-hero">
      <div class="scan-hero__top">
        <span class="eyebrow inverse"><span class="material-symbols-outlined" style="font-size:16px">offline_bolt</span> Edge AI · 100% Offline Ready</span>
        <button class="text-button" style="color:#d5f6dd" onclick="speak('Scan your crop leaf for instant diagnosis. Detect rice blast, blight or brown spot in seconds.')"><span class="material-symbols-outlined" style="font-size:16px">volume_up</span> Audio Guide</button>
      </div>
      <h2>Scan Leaf for Instant Diagnosis</h2>
      <p>Detect Rice Blast, Bacterial Blight, or Brown Spot in 3 seconds with trained deep-learning models.</p>
      <div class="scanner-illustration">
        <span class="reticle-corner reticle-tl"></span>
        <span class="reticle-corner reticle-tr"></span>
        <span class="reticle-corner reticle-bl"></span>
        <span class="reticle-corner reticle-br"></span>
        <div class="reticle-dot"></div>
        <span class="material-symbols-outlined">center_focus_strong</span>
        <span>Keep affected leaf area inside viewfinder guide</span>
      </div>
      <div class="scan-actions">
        <a class="btn light" href="#detect"><span class="material-symbols-outlined">photo_camera</span> Open Camera Scanner</a>
        <a class="secondary-inverse" href="#symptoms">Describe symptoms instead</a>
      </div>
    </section>
    <div class="section-heading">
      <div><p class="eyebrow">At a glance</p><h2>Field Telemetry</h2></div>
      <a href="#plants">Manage plots <span class="material-symbols-outlined">arrow_forward</span></a>
    </div>
    <section class="metric-grid">
      <a href="#plants" class="metric-card"><span class="metric-icon material-symbols-outlined">agriculture</span><b>${data.counts.plants}</b><small>Monitored Plots</small></a>
      <a href="#outbreaks" class="metric-card"><span class="metric-icon ${topOutbreak && topOutbreak.in_quarantine_radius ? 'danger' : 'amber'} material-symbols-outlined">crisis_alert</span><b>${outbreaks.length}</b><small>Nearby Outbreaks</small></a>
      <a href="#weather-risk" class="metric-card"><span class="metric-icon blue material-symbols-outlined">thermostat</span><b>Risk Radar</b><small>Weather Engine</small></a>
      <a href="#detect" class="metric-card"><span class="metric-icon amber material-symbols-outlined">document_scanner</span><b>${data.counts.scans}</b><small>Leaf Scans</small></a>
      <a href="#dash" class="metric-card"><span class="metric-icon material-symbols-outlined">calendar_month</span><b>${data.counts.appointments}</b><small>Consultations</small></a>
      <a href="#orders" class="metric-card"><span class="metric-icon blue material-symbols-outlined">local_shipping</span><b>${data.counts.orders}</b><small>Active Orders</small></a>
    </section>
    <section class="card" style="margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:16px">
        <div class="radial-gauge-container">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e6ede4" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1b6c3b" stroke-width="8" stroke-dasharray="181 251.3" stroke-linecap="round"></circle>
          </svg>
          <div class="radial-gauge-score"><b>72</b><small>/ 100</small></div>
        </div>
        <div>
          <p class="eyebrow"><span class="material-symbols-outlined" style="font-size:14px">sensors</span> Live BLE Probe #04</p>
          <h3 style="margin:2px 0 4px">Soil Health Index: Moderately Fertile</h3>
          <p class="subtle" style="margin:0;font-size:0.85rem">Nitrogen shortage detected. High microbial activity. Tillering stage.</p>
        </div>
      </div>
      <a href="#farm-tools" class="btn"><span class="material-symbols-outlined">analytics</span> View Soil Telemetry</a>
    </section>
    <section class="card dashboard-list">
      <div class="card-heading">
        <div><p class="eyebrow">Crop health</p><h3>Recent Leaf Scans</h3></div>
        <a href="#detect">New scan</a>
      </div>
      <ul>${scans}</ul>
    </section>
    <section class="appointment-banner">
      <span class="material-symbols-outlined">support_agent</span>
      <div><b>Plant Doctor Consultation</b><small>${appointment}</small></div>
      <a href="#doctors" class="ghost">Book</a>
    </section>
    <div class="quick-links">
      <a href="#outbreaks"><span class="material-symbols-outlined">crisis_alert</span> Outbreak Alerts (${outbreaks.length})</a>
      <a href="#community-map"><span class="material-symbols-outlined">map</span> Disease Intelligence Map</a>
      <a href="#weather-risk"><span class="material-symbols-outlined">thermostat</span> Weather Risk Simulator</a>
      <a href="#farm-tools"><span class="material-symbols-outlined">construction</span> Farm Tools Suite</a>
      <a href="#shop"><span class="material-symbols-outlined">storefront</span> Crop Input Store</a>
      <a href="#chat"><span class="material-symbols-outlined">forum</span> Voice Advisory Assistant</a>
    </div>
  `;
}

function scannerPage() {
  return `
    <section class="scanner-page">
      <div class="scanner-intro">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <a class="text-button" href="#farm-dashboard"><span class="material-symbols-outlined">arrow_back</span> Back to Farm</a>
          <div class="online-badge"><span class="online-dot"></span><span>Edge AI Active (Offline Ready)</span></div>
        </div>
        <p class="eyebrow">AI Leaf Diagnosis</p>
        <h1>Scan Your Crop Leaf</h1>
        <p class="subtle">Photograph one affected leaf in clear daylight. For Rice, AgriShield uses trained CNN deep-learning models.</p>
      </div>
      <section class="scanner-stage">
        <div class="scan-crop-row">
          <label for="crop">Crop (identified automatically)</label>
          <select id="crop" class="field"></select>
          <div class="hud-controls-bar" style="margin-left:auto">
            <div class="zoom-pills">
              <button class="zoom-btn active" type="button" onclick="setScannerZoom(1, this)">1x</button>
              <button class="zoom-btn" type="button" onclick="setScannerZoom(2, this)">2x Macro</button>
              <button class="zoom-btn" type="button" onclick="setScannerZoom(4, this)">4x</button>
            </div>
            <button class="icon-btn" type="button" title="Toggle Torch" onclick="toggleTorch()"><span class="material-symbols-outlined" style="font-size:20px">flashlight_on</span></button>
            <button class="icon-btn" type="button" title="Audio Guide" onclick="speak('Align one affected leaf inside the center reticle and take a steady photo.')"><span class="material-symbols-outlined" style="font-size:20px">volume_up</span></button>
          </div>
        </div>
        <div class="viewfinder" id="scannerViewfinder">
          <span class="reticle-corner reticle-tl"></span>
          <span class="reticle-corner reticle-tr"></span>
          <span class="reticle-corner reticle-bl"></span>
          <span class="reticle-corner reticle-br"></span>
          <div class="reticle-center"><div class="reticle-dot"></div></div>
          <video id="cameraPreview" class="preview" autoplay playsinline hidden></video>
          <img id="prev" class="preview" alt="Selected leaf preview" hidden />
          <div class="viewfinder__empty">
            <span class="material-symbols-outlined">center_focus_strong</span>
            <span>Center the affected leaf inside the reticle</span>
            <small style="opacity:0.75;font-weight:400">Target locked: Field #2</small>
          </div>
        </div>
        <label class="upload-drop">
          <span class="material-symbols-outlined">add_a_photo</span>
          <strong>Choose or capture a leaf photo</strong>
          <small id="uploadHint">JPG, PNG or WEBP · Clear daylight photo works best</small>
          <input type="file" id="leaf" accept="image/*" capture="environment" onchange="previewLeaf(event)" />
        </label>
        <div class="scanner-buttons">
          <button class="ghost" type="button" onclick="startCamera()"><span class="material-symbols-outlined">photo_camera</span> Open Camera</button>
          <button class="ghost" type="button" onclick="captureCameraPhoto()"><span class="material-symbols-outlined">camera</span> Capture Photo</button>
          <button class="icon-btn" type="button" onclick="stopCamera()" title="Close Camera" aria-label="Close camera"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="video-option">
          <label>Or analyse a short video clip<input type="file" id="leafVideo" accept="video/*" /></label>
          <button class="text-button" type="button" onclick="analyzeVideoFrame()">Extract Middle Frame</button>
        </div>
        <button class="btn scanner-submit" type="button" onclick="runDetect()"><span class="material-symbols-outlined">document_scanner</span> Analyse Leaf with AgriShield AI</button>
      </section>
      <div id="detectOut"></div>
      <p class="disclaimer muted" style="text-align:center;margin-top:14px;font-size:0.8rem">
        Decision support indication only. Laboratory confirmation recommended for widespread epidemics.
      </p>
    </section>
  `;
}

function setScannerZoom(z, el) {
  document.querySelectorAll(".zoom-btn").forEach((b) => b.classList.remove("active"));
  if (el) el.classList.add("active");
  const prev = document.getElementById("prev");
  const vid = document.getElementById("cameraPreview");
  const scale = z === 4 ? "scale(1.5)" : z === 2 ? "scale(1.25)" : "scale(1)";
  if (prev) prev.style.transform = scale;
  if (vid) vid.style.transform = scale;
}

async function toggleTorch() {
  if (!window._cameraStream) return alert("Open camera first to use flashlight.");
  const track = window._cameraStream.getVideoTracks()[0];
  if (!track) return;
  try {
    const caps = track.getCapabilities ? track.getCapabilities() : {};
    if (!caps.torch) return alert("Flashlight/torch not supported on this device camera.");
    window._torchOn = !window._torchOn;
    await track.applyConstraints({ advanced: [{ torch: window._torchOn }] });
  } catch (e) {
    alert("Flashlight toggle notice: " + e.message);
  }
}

async function fillCrops() {
  try {
    const crops = await api("/api/crops");
    const el = document.getElementById("crop");
    if (el) el.innerHTML = crops.map((c) => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join("");
  } catch (_) {}
}

window.toggleXaiView = function(mode) {
  const origImg = document.getElementById("xaiOrigImg");
  const heatImg = document.getElementById("xaiHeatImg");
  const tabOrig = document.getElementById("xaiTabOrig");
  const tabHeat = document.getElementById("xaiTabHeat");
  if (!origImg || !heatImg) return;
  if (mode === "heat") {
    origImg.style.display = "none";
    heatImg.style.display = "block";
    if (tabOrig) tabOrig.classList.remove("active");
    if (tabHeat) tabHeat.classList.add("active");
  } else {
    origImg.style.display = "block";
    heatImg.style.display = "none";
    if (tabOrig) tabOrig.classList.add("active");
    if (tabHeat) tabHeat.classList.remove("active");
  }
};

async function runDetect(fileOverride) {
  const leafInput = document.getElementById("leaf");
  const file = fileOverride || (leafInput && leafInput.files[0]);
  if (!file) return alert("Please select or capture a leaf photo first.");
  const cropEl = document.getElementById("crop");
  const crop = cropEl ? cropEl.value : "rice";
  const output = document.getElementById("detectOut");
  if (output) {
    output.innerHTML = `<div class="card" style="margin-top:16px">
      <p class="muted" id="detectStatusLine">
        <span class="material-symbols-outlined" style="vertical-align:middle;animation:pulse-dot 1s infinite">sync</span>
        Validating image (leaf vs non-leaf)&hellip;
      </p>
    </div>`;
  }
  if (window._leafPreviewFile !== file) setLeafPreview(file);
  if (!(await validateUploadFile(file))) {
    showInvalidLeafMessage();
    return;
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("crop", crop);
  try {
    const data = await api("/api/predict", { method: "POST", body: fd });
    if (!data || data.accepted === false || !data.disease_key) {
      throw new Error(INVALID_LEAF_MESSAGE);
    }
    const meds = data.medicines || [];
    const cropIdentification = data.crop_identification || {};
    const confPct = Math.round((data.confidence || 0.85) * 100);
    const sev = data.severity || {};
    const sesGrade = sev.ses_grade !== undefined ? sev.ses_grade : 3;
    const topProbs = data.top_probabilities || [];
    const rec3 = data.recommendations_3tier || {};
    const aiPrescription = data.ai_prescription || {};
    const escalation = data.escalation || {};
    const origUrl = window._leafPreviewUrl || "";
    const heatB64 = sev.heatmap_base64 || "";

    if (output) output.innerHTML = `
      <div class="diagnosis-card card">
        <div class="diagnosis-overline">
          <span class="eyebrow"><span class="material-symbols-outlined">verified</span> AI Diagnosis Verified</span>
          <div style="display:flex;align-items:center;gap:6px">
            <button class="text-button" type="button" onclick="speak('${escapeHtml(pick(data.name)).replace(/'/g, "\\'")}')"><span class="material-symbols-outlined">volume_up</span> Audio</button>
            <a href="/api/download-report" download="AgriShield_SIH_Feature_Report.pdf" class="text-button" style="color:var(--leaf);text-decoration:none"><span class="material-symbols-outlined">picture_as_pdf</span> PDF</a>
          </div>
        </div>

        <h2 style="margin:6px 0 10px;font-size:1.45rem;color:var(--moss)">${escapeHtml(pick(data.name))}</h2>
        <p class="muted" style="margin:0 0 12px">Leaf detected: <b>Yes</b> · Crop identified: <b>${escapeHtml(cropIdentification.crop || data.crop || "Unknown")}</b> (${Math.round((cropIdentification.confidence || 0) * 100)}% confidence)</p>
        
        <div class="confidence-meter">
          <div class="confidence-bar">
            <div class="confidence-fill" style="width:${confPct}%"></div>
          </div>
          <span style="font-weight:700;font-size:0.9rem;color:var(--moss)">${confPct}% Confidence</span>
          <span class="badge ${data.risk === "High" ? "high" : data.risk === "Medium" ? "med" : "low"}">${escapeHtml(data.risk)} Outbreak Risk</span>
        </div>

        ${data.model_label ? `<p style="margin:6px 0;font-size:0.88rem"><b>Classified Botanical Disease:</b> <code>${escapeHtml(data.model_label)}</code></p>` : ""}

        <!-- ICAR / IRRI Standard Evaluation System (SES) Grade -->
        <div class="ses-grade-card">
          <div>
            <span class="eyebrow" style="font-size:0.7rem;text-transform:uppercase">ICAR / IRRI Standard Evaluation System</span>
            <h4 style="margin:2px 0 4px;font-size:1rem;color:var(--ink)">${escapeHtml(sev.description || `SES Grade ${sesGrade}: ${sev.label || 'Moderate'}`)}</h4>
            <span style="font-size:0.8rem;color:var(--muted)">Resistance Category: <b>${escapeHtml(sev.resistance_category || 'Susceptible')}</b> · Damaged foliage: <b>${escapeHtml(sev.affected_area_percent || 0)}%</b></span>
          </div>
          <span class="ses-grade-badge ses-grade-${sesGrade}">Grade ${sesGrade}</span>
        </div>

        <!-- Lesion colour map; this is not a Grad-CAM explanation -->
        ${heatB64 ? `
          <div class="xai-card-wrapper">
            <div class="xai-tabs-bar">
              <button type="button" class="xai-tab-button active" id="xaiTabHeat" onclick="toggleXaiView('heat')"><span class="material-symbols-outlined" style="font-size:17px">local_fire_department</span> Lesion Colour Map</button>
              <button type="button" class="xai-tab-button" id="xaiTabOrig" onclick="toggleXaiView('orig')"><span class="material-symbols-outlined" style="font-size:17px">photo</span> Original Leaf Photo</button>
            </div>
            <div class="xai-view-container">
              <img id="xaiHeatImg" src="${heatB64}" alt="Lesion colour map overlay" />
              <img id="xaiOrigImg" src="${origUrl || heatB64}" alt="Original Leaf" style="display:none" />
              <div class="xai-heatmap-overlay-badge">
                <span class="material-symbols-outlined" style="font-size:15px;color:#f87171">biotech</span>
                <span>ExG/ExR lesion colour map (${sev.affected_area_percent || 0}% affected)</span>
              </div>
            </div>
          </div>
        ` : ""}

        <!-- Multi-Class Probability Distribution -->
        ${topProbs.length > 0 ? `
          <div class="multi-prob-container">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span class="eyebrow" style="font-size:0.7rem"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle">bar_chart</span> Multi-Class Probability Calibration</span>
              <small class="muted">Softmax Distribution</small>
            </div>
            ${topProbs.map(p => `
              <div class="multi-prob-row">
                <span class="multi-prob-name" title="${escapeHtml(p.label)}">${escapeHtml(p.label)}</span>
                <div class="multi-prob-track">
                  <div class="multi-prob-fill" style="width:${p.percentage}%"></div>
                </div>
                <span class="multi-prob-val">${p.percentage}%</span>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Real-time AI Agronomist Prescription (Local Qwen2.5 3B) -->
        ${aiPrescription.text ? `
          <div class="prescription-container">
            <div class="prescription-header">
              <div class="prescription-title">
                <span class="material-symbols-outlined">psychology</span>
                <span>AI Agronomist Field Prescription</span>
              </div>
              <span class="chat-ai-source-badge badge-qwen"><span class="online-dot"></span> ${escapeHtml(aiPrescription.model || "Qwen2.5 3B Edge AI")}</span>
            </div>
            <p class="prescription-text">${escapeHtml(aiPrescription.text)}</p>
          </div>
        ` : ""}

        <!-- 3-Tier Recommendation Engine (Cultural, Biological, Chemical) -->
        <div style="margin:16px 0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="material-symbols-outlined" style="color:var(--leaf)">shield</span>
            <h4 style="margin:0;font-size:0.95rem;color:var(--moss)">3-Tier Integrated Pest & Disease Management (IPDM)</h4>
          </div>
          <div class="tier-protocols-grid">
            <div class="tier-protocol-card">
              <div class="tier-protocol-header">
                <span class="tier-badge cultural">Tier 1</span>
                <span>🌾 Cultural / Agronomic</span>
              </div>
              <ul class="tier-steps-list">
                ${(rec3.cultural || ["Scout field transects regularly", "Ensure optimal plant spacing"]).map(step => `<li>${escapeHtml(step)}</li>`).join("")}
              </ul>
            </div>
            <div class="tier-protocol-card">
              <div class="tier-protocol-header">
                <span class="tier-badge biological">Tier 2</span>
                <span>🌿 Biological / Organic</span>
              </div>
              <ul class="tier-steps-list">
                ${(rec3.biological || ["Apply neem oil 3000 ppm @ 3 ml/L", "Prophylactic bio-fungicide"]).map(step => `<li>${escapeHtml(step)}</li>`).join("")}
              </ul>
            </div>
            <div class="tier-protocol-card">
              <div class="tier-protocol-header">
                <span class="tier-badge chemical">Tier 3</span>
                <span>🧪 CIBRC Chemical Spray</span>
              </div>
              <ul class="tier-steps-list">
                ${(rec3.chemical || ["Apply recommended CIBRC fungicide as per label"]).map(step => `<li>${escapeHtml(step)}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>

        <!-- KVK / ICAR Expert Escalation Alert -->
        ${escalation.recommended ? `
          <div class="escalation-alert-card">
            <div class="escalation-header">
              <span class="material-symbols-outlined" style="color:#e11d48">warning</span>
              <span>${escalation.severity_level === "CRITICAL" ? "🚨 Critical Crop Alert — Immediate Escalation" : "⚠️ Expert Review Recommended"}</span>
            </div>
            <p class="escalation-desc">${escapeHtml(escalation.reason)}</p>
            <div class="escalation-actions">
              <a class="btn sm" href="#doctors" style="background:#be123c;color:#fff;text-decoration:none"><span class="material-symbols-outlined">support_agent</span> Book ICAR Plant Doctor</a>
              <a class="btn light sm" href="tel:18001801551" style="text-decoration:none"><span class="material-symbols-outlined">call</span> Kisan Call Centre (1800-180-1551)</a>
            </div>
          </div>
        ` : ""}

        <div style="margin:14px 0;padding:12px;border-radius:var(--radius-md);background:var(--surface-low);border:1px solid var(--line)">
          <b style="color:var(--moss)">Field Observations & Next Steps:</b>
          <p style="margin:6px 0 0">${escapeHtml(pick(data.advice))}</p>
        </div>

        <p class="muted" style="font-size:0.8rem">${escapeHtml(pick(data.disclaimer))}</p>

        <!-- Action Row -->
        <div class="row" style="margin-top:16px;flex-wrap:wrap;gap:8px">
          ${meds.map((id) => `<button class="btn" type="button" onclick="addCart('${id}')"><span class="material-symbols-outlined">add_shopping_cart</span> Order ${escapeHtml(id)}</button>`).join("")}
          <a class="ghost" href="#doctors"><span class="material-symbols-outlined">support_agent</span> Consult Doctor</a>
          <button class="btn light" type="button" onclick="previewRecoveryPlan('${data.disease_key || 'fungal_blight'}', '${crop}')"><span class="material-symbols-outlined">timeline</span> ${t("viewTimeline")}</button>
          <a href="/api/download-report" download="AgriShield_SIH_Feature_Report.pdf" class="btn light" style="text-decoration:none"><span class="material-symbols-outlined">picture_as_pdf</span> Feature PDF Report</a>
        </div>
      </div>
    `;
    speak(`${pick(data.name)}. ${pick(data.advice)}`);
  } catch (err) {
    const invalid = /invalid image/i.test(err.message || "");
    const cropUnavailable = /crop identification is unavailable/i.test(err.message || "");
    const message = invalid
      ? INVALID_LEAF_MESSAGE
      : err.message;
    if (output) {
      const unavailable = cropUnavailable || /model is unavailable/i.test(err.message || "");
      output.innerHTML = invalid
        ? `<div class="card" style="margin-top:14px;border-color:var(--danger)">
            <p style="color:var(--danger);margin:0 0 8px"><b>${escapeHtml(message)}</b></p>
            <p class="muted" style="margin:0">Disease detection was not run. Use a daylight photo of one crop leaf, filling most of the frame.</p>
          </div>`
        : unavailable
        ? `<div class="card" style="margin-top:14px;border-color:var(--warning,#d97706)">
            <p style="color:var(--warning,#d97706);margin:0 0 8px"><b>${cropUnavailable ? "Crop identification is temporarily unavailable." : escapeHtml(err.message)}</b></p>
            <p class="muted" style="margin:0">No disease name or confidence score was generated. Please try again later or consult a plant doctor.</p>
          </div>`
        : `<div class="card" style="margin-top:14px;border-color:var(--danger)"><p style="color:var(--danger)"><b>Analysis error:</b> ${escapeHtml(err.message)}</p><p class="muted">Please ensure the uploaded file is a valid image (JPG, PNG, WEBP).</p></div>`;
    }
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    window._cameraStream = stream;
    const preview = document.getElementById("cameraPreview");
    if (preview) {
      preview.srcObject = stream;
      preview.hidden = false;
    }
  } catch (e) {
    alert("Camera access failed: " + e.message);
  }
}

function stopCamera() {
  if (window._cameraStream) {
    window._cameraStream.getTracks().forEach((track) => track.stop());
    window._cameraStream = null;
  }
  const preview = document.getElementById("cameraPreview");
  if (preview) {
    preview.srcObject = null;
    preview.hidden = true;
  }
}

function captureCameraPhoto() {
  const preview = document.getElementById("cameraPreview");
  if (!preview || !preview.srcObject) return alert("Open camera first.");
  const canvas = document.createElement("canvas");
  canvas.width = preview.videoWidth || 640;
  canvas.height = preview.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (!blob) return alert("Could not capture photo.");
    const file = new File([blob], "leaf-camera-capture.jpg", { type: "image/jpeg" });
    const container = new DataTransfer();
    container.items.add(file);
    const leaf = document.getElementById("leaf");
    if (leaf) leaf.files = container.files;
    const imgPrev = document.getElementById("prev");
    if (imgPrev) {
      setLeafPreview(file);
    }
    const hint = document.getElementById("uploadHint");
    if (hint) hint.textContent = "Camera snapshot ready for analysis";
    stopCamera();
  }, "image/jpeg", 0.9);
}

function analyzeVideoFrame() {
  const input = document.getElementById("leafVideo");
  const file = input && input.files && input.files[0];
  if (!file) return alert("Select a video file first.");
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  video.muted = true;
  video.playsInline = true;
  video.onloadedmetadata = () => {
    video.currentTime = Math.max(0, video.duration / 2 || 0);
  };
  video.onseeked = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return alert("Could not extract frame.");
      const frameFile = new File([blob], "leaf-video-frame.jpg", { type: "image/jpeg" });
      const imgPrev = document.getElementById("prev");
      if (imgPrev) {
        setLeafPreview(frameFile);
      }
      runDetect(frameFile);
    }, "image/jpeg", 0.9);
  };
  video.onerror = () => alert("Could not read video format.");
}

async function doctorsPage() {
  const docs = await api("/api/doctors");
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">support_agent</span> Expert Agronomists</p>
      <h3>${t("doctors")}</h3>
      <p class="subtle">Schedule a consultation with verified agricultural scientists and plant pathologists.</p>
      <input id="dq" placeholder="Search by name, specialization, or crop..." oninput="filterDocs()" />
    </div>
    <div class="grid" id="docGrid">
      ${docs
        .map(
          (d) => `
        <div class="card doc" data-blob="${(d.name + d.specialization).toLowerCase()}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span class="badge ok">ICAR Verified</span>
            <span class="price">₹${d.fee}</span>
          </div>
          <h3>${escapeHtml(d.name)}</h3>
          <p class="muted" style="margin:2px 0">${escapeHtml(d.qualification)} · <b>${d.experience} yrs exp</b></p>
          <p style="margin:6px 0;font-weight:600;color:var(--leaf)">${escapeHtml(d.specialization)}</p>
          <p class="muted" style="font-size:0.85rem">${escapeHtml(d.bio)}</p>
          <p style="font-size:0.8rem;color:var(--moss)"><b>Languages:</b> ${escapeHtml(d.languages)}</p>
          <label>Date</label>
          <input type="date" id="date-${d.id}" min="${new Date().toISOString().slice(0, 10)}" onchange="loadSlots(${d.id})" />
          <label>Time Slot</label>
          <select class="field" id="slot-${d.id}"><option value="">Choose a date first</option></select>
          <label>Reason / Crop Issue</label>
          <input id="why-${d.id}" placeholder="e.g. Leaf spots, yellowing, pest..." />
          <button class="btn" style="margin-top:12px;width:100%" onclick="bookDoc(${d.id})">${t("book")}</button>
        </div>`
        )
        .join("")}
    </div>`;
}

async function loadSlots(id) {
  const date = document.getElementById("date-" + id).value;
  const slot = document.getElementById("slot-" + id);
  if (!date) return;
  try {
    const data = await api(`/api/doctors/${id}/slots?date=${encodeURIComponent(date)}`);
    slot.innerHTML = data.slots.length
      ? data.slots.map((time) => `<option value="${time}">${time}</option>`).join("")
      : '<option value="">No slots available</option>';
  } catch (e) {
    slot.innerHTML = '<option value="">Could not load slots</option>';
  }
}

function filterDocs() {
  const q = (document.getElementById("dq").value || "").toLowerCase();
  document.querySelectorAll(".doc").forEach((el) => {
    el.style.display = el.dataset.blob.includes(q) ? "" : "none";
  });
}

async function bookDoc(id) {
  if (!state.user) return alert(t("needLogin"));
  const date = document.getElementById("date-" + id).value;
  const startTime = document.getElementById("slot-" + id).value;
  if (!date || !startTime) return alert("Please choose an available date and time slot.");
  try {
    await api("/api/appointments", {
      method: "POST",
      body: formBody({
        doctor_id: id,
        date,
        start_time: startTime,
        reason: document.getElementById("why-" + id).value,
      }),
    });
    alert("Consultation request submitted! Awaiting doctor confirmation.");
    location.hash = "dash";
  } catch (e) {
    alert(e.message);
  }
}

function chatPage() {
  return `
    <div class="card" style="margin-bottom:14px; background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color:#ffffff; border:none;">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px">
        <div>
          <p class="eyebrow" style="color:var(--lime);"><span class="material-symbols-outlined">psychology</span> Real-Time Agronomic Intelligence</p>
          <h3 style="margin:0; color:#ffffff; font-family:var(--font-serif); font-size:1.6rem">Ask AgriShield AI</h3>
          <p style="margin:4px 0 0; color:#d1fae5; font-size:0.9rem">Powered by local Qwen2.5 3B LLM & curated SIH knowledge. Speaks in English, Hindi, Tamil, and Marathi.</p>
        </div>
        <div style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); border-radius:var(--radius-full); padding:6px 14px; display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:700;">
          <span style="width:8px; height:8px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399"></span>
          <span>Qwen2.5 3B LLM Active</span>
        </div>
      </div>

      <div style="margin-top:14px; display:flex; flex-wrap:wrap; gap:6px;">
        <button type="button" class="scheme-filter-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.25); font-size:0.8rem; padding:4px 10px;" onclick="sendChat('What should I spray for brown spot on rice leaves?')">🌾 Rice Brown Spot</button>
        <button type="button" class="scheme-filter-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.25); font-size:0.8rem; padding:4px 10px;" onclick="sendChat('How to control tomato leaf curl and blight?')">🍅 Tomato Blight</button>
        <button type="button" class="scheme-filter-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.25); font-size:0.8rem; padding:4px 10px;" onclick="sendChat('What is the recommended dose of cold pressed neem oil?')">🌿 Neem Oil Dose</button>
        <button type="button" class="scheme-filter-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.25); font-size:0.8rem; padding:4px 10px;" onclick="sendChat('How can I register for PM-KISAN ₹6,000 benefit?')">🏛️ PM-KISAN</button>
        <button type="button" class="scheme-filter-btn" style="background:rgba(255,255,255,0.12); color:#ffffff; border-color:rgba(255,255,255,0.25); font-size:0.8rem; padding:4px 10px;" onclick="sendChat('What is PMFBY crop insurance claim procedure?')">🛡️ Crop Insurance</button>
      </div>
    </div>
    <div class="chatbox">
      <div class="msgs" id="msgs">
        <div class="bubble bot">
          <div class="chat-ai-source-badge badge-qwen">
            <span class="material-symbols-outlined" style="font-size:14px">psychology</span>
            ${t("qwenModel")}
          </div>
          <div>${t("placeholder")}</div>
        </div>
      </div>
      <div class="row">
        <input id="chatIn" style="flex:1" placeholder="Ask about crop disease, dosages, spray schedule, govt subsidies..." onkeydown="if(event.key==='Enter')sendChat()" />
        <button class="voice" id="micBtn" type="button" onclick="toggleVoiceConversation()">🎤</button>
        <button class="btn" type="button" onclick="sendChat()">${t("send")}</button>
      </div>
    </div>
  `;
}

async function sendChat(preset, continueVoice = false) {
  const input = document.getElementById("chatIn");
  const q = preset || (input && input.value.trim());
  if (!q) return;
  if (input) input.value = "";
  const msgs = document.getElementById("msgs");
  if (msgs) {
    msgs.innerHTML += `<div class="bubble me">${escapeHtml(q)}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }
  try {
    const data = await api("/api/chat", {
      method: "POST",
      body: formBody({ message: q, question: q, language: state.lang }),
    });
    const reply = data.answer || pick(data.reply) || "No response received";
    const isQwen = data.source === "ollama_qwen";
    if (msgs) {
      msgs.innerHTML += `
        <div class="bubble bot">
          <div class="chat-ai-source-badge ${isQwen ? 'badge-qwen' : 'badge-kb'}">
            <span class="material-symbols-outlined" style="font-size:14px">${isQwen ? 'psychology' : 'menu_book'}</span>
            ${isQwen ? t("qwenModel") + " (Local Engine)" : t("knowledgeSource")}
          </div>
          <div style="line-height:1.5">${escapeHtml(reply)}</div>
        </div>`;
      msgs.scrollTop = msgs.scrollHeight;
    }
    speak(reply);
  } catch (err) {
    if (msgs) {
      msgs.innerHTML += `<div class="bubble bot" style="color:var(--danger)">Error: ${escapeHtml(err.message)}</div>`;
      msgs.scrollTop = msgs.scrollHeight;
    }
  }
}

function startVoiceTurn() {
  const btn = document.getElementById("micBtn");
  if (btn) btn.classList.add("live");
  listen((txt) => {
    if (btn) btn.classList.remove("live");
    sendChat(txt, false);
  });
}

function toggleVoiceConversation() {
  startVoiceTurn();
}

function bindMic() {}

async function marketPage(type) {
  const items = await api(`/api/${type}`);
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">${type === "seeds" ? "spa" : "storefront"}</span> Agri Input Store</p>
      <h3>${type === "seeds" ? "Certified Hybrid Seeds" : "Crop Medicines & Agri-Inputs"}</h3>
      <p class="subtle">Direct delivery to your farm cluster. Organic and chemical formulations.</p>
    </div>
    <div class="grid">
      ${items
        .map(
          (item) => `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span class="badge ${item.organic ? "ok" : ""}">${item.organic ? "Organic" : "Standard"}</span>
            <span class="price">₹${item.price}</span>
          </div>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="muted" style="margin:4px 0">${escapeHtml(item.crop_or_type || item.type || "")}</p>
          <p class="subtle" style="font-size:0.85rem">${escapeHtml(item.description || "")}</p>
          <button class="btn" style="width:100%;margin-top:12px" onclick="addCart('${item.id}')"><span class="material-symbols-outlined">add_shopping_cart</span> Add to Cart</button>
        </div>`
        )
        .join("")}
    </div>
    <div id="cartArea" style="margin-top:20px">${await cartPanel()}</div>
  `;
}

async function shopPage() { return marketPage("medicines"); }
async function seedsPage() { return marketPage("seeds"); }

async function cartPanel() {
  if (!state.user) return `<div class="card"><p class="muted">${t("needLogin")}</p></div>`;
  try {
    const data = await api("/api/cart");
    const items = data.items || [];
    if (!items.length) return `<div class="card"><p class="muted">Your shopping cart is empty.</p></div>`;
    return `
      <div class="card">
        <h3>Shopping Cart (${items.length} items)</h3>
        <table class="table">
          <tr><th>Item</th><th>Qty</th><th>Price</th><th>Action</th></tr>
          ${items.map((i) => `<tr><td>${escapeHtml(i.name)}</td><td>${i.quantity}</td><td>₹${i.price * i.quantity}</td><td><button class="ghost" style="color:var(--danger)" onclick="delCart(${i.id})">Remove</button></td></tr>`).join("")}
        </table>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px">
          <span class="price" style="font-size:1.2rem">Total: ₹${data.total}</span>
          <button class="btn" onclick="checkout()">${t("checkout")}</button>
        </div>
      </div>
    `;
  } catch (_) {
    return "";
  }
}

async function addCart(id) {
  if (!state.user) return alert(t("needLogin"));
  try {
    await api("/api/cart", { method: "POST", body: formBody({ item_id: id, quantity: 1 }) });
    alert("Added to cart!");
    const cartEl = document.getElementById("cartArea");
    if (cartEl) cartEl.innerHTML = await cartPanel();
  } catch (e) {
    alert(e.message);
  }
}

async function delCart(id) {
  try {
    await api("/api/cart/" + id, { method: "DELETE" });
    const cartEl = document.getElementById("cartArea");
    if (cartEl) cartEl.innerHTML = await cartPanel();
  } catch (e) {
    alert(e.message);
  }
}

async function checkout() {
  const address = prompt("Delivery address / Village cluster name:");
  if (!address) return;
  try {
    await api("/api/orders", { method: "POST", body: formBody({ delivery_address: address.trim() }) });
    alert("Order placed successfully! Delivery tracking initiated.");
    location.hash = "orders";
  } catch (e) {
    alert("Order failed: " + e.message);
  }
}

async function ordersPage() {
  if (!state.user) return `<div class="card">${t("needLogin")}</div>`;
  const rows = await api("/api/orders");
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">local_shipping</span> Orders</p>
      <h3>Order History & Tracking</h3>
    </div>
    <div class="card" style="margin-top:14px">
      ${rows.length ? `
        <table class="table">
          <tr><th>Order #</th><th>Date</th><th>Delivery Address</th><th>Total</th><th>Status</th></tr>
          ${rows.map((o) => `<tr><td>#${o.id}</td><td>${escapeHtml(o.created_at || "Recent")}</td><td>${escapeHtml(o.delivery_address || "")}</td><td>₹${o.total}</td><td><span class="badge ok">${escapeHtml(o.status)}</span></td></tr>`).join("")}
        </table>` : `<p class="muted">No orders placed yet.</p>`}
    </div>`;
}

async function plantsPage() {
  if (!state.user) return `<div class="card">${t("needLogin")}</div>`;
  const rows = await api("/api/plants");
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">agriculture</span> Field Plots</p>
      <h3>Monitored Crops & Plots</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:12px">
        <div><label>Plot / Crop Name</label><input id="pn" placeholder="e.g. North Acre Rice" /></div>
        <div><label>Crop Type</label><input id="pc" value="rice" /></div>
        <div><label>Location / Field No.</label><input id="pl" placeholder="e.g. Plot 4A" /></div>
        <div><label>Notes</label><input id="pnotes" placeholder="e.g. Tillering stage, day 28" /></div>
      </div>
      <label style="margin-top:10px">Leaf photo reference (optional)</label>
      <input id="pimage" type="file" accept="image/*" />
      <button class="btn" style="margin-top:14px" onclick="savePlant()"><span class="material-symbols-outlined">add</span> Register Plot</button>
    </div>
    <div class="grid">
      ${rows.map((p) => `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span class="badge ok">${escapeHtml(p.crop_type)}</span>
            <small class="muted">${escapeHtml(p.location || "Main Field")}</small>
          </div>
          <h3 style="margin:8px 0 4px">${escapeHtml(p.plant_name)}</h3>
          <p class="subtle" style="font-size:0.88rem;margin:0 0 8px">${escapeHtml(p.notes || "No notes")}</p>
          ${p.image_url ? `<img src="${p.image_url}" class="preview" style="max-height:140px;margin-top:8px" alt="Plot photo" />` : (p.has_image ? '<p class="muted">Leaf photo saved securely.</p>' : "")}
          <button class="btn ghost sm" style="margin-top:12px; width:100%; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="openPlantTimeline(${p.id})">
            <span class="material-symbols-outlined" style="font-size:16px">timeline</span> ${t("timeline")}
          </button>
        </div>`).join("")}
    </div>`;
}

async function openPlantTimeline(plantId) {
  try {
    const data = await api(`/api/plants/${plantId}/timeline`);
    showRecoveryTimelineModal(data);
  } catch (err) {
    alert("Could not load timeline: " + err.message);
  }
}

async function previewRecoveryPlan(diseaseKey = "fungal_blight", crop = "rice") {
  try {
    const data = await api(`/api/recovery-plan?disease=${diseaseKey}&crop=${crop}`);
    showRecoveryTimelineModal(data);
  } catch (err) {
    alert("Could not load recovery plan: " + err.message);
  }
}

function showRecoveryTimelineModal(data) {
  let existing = document.getElementById("timelineModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "timelineModal";
  modal.className = "modal-overlay";
  modal.style.display = "flex";

  const stagesHtml = (data.stages || []).map(st => `
    <div class="timeline-step-card">
      <div class="timeline-node-pin">D${st.day}</div>
      <div class="timeline-card-header">
        <h4 class="timeline-day-title">Day ${st.day}: ${escapeHtml(st.stage_name)}</h4>
        <span class="timeline-phase-badge">${escapeHtml(st.badge)}</span>
      </div>
      <ul class="timeline-actions-list">
        ${(st.actions || []).map(a => `<li>${escapeHtml(a)}</li>`).join("")}
      </ul>
      ${st.spray_advice ? `
        <div class="timeline-spray-box">
          <span class="material-symbols-outlined" style="font-size:18px; color:#f59e0b">science</span>
          <div><strong>Spray / Timing:</strong> ${escapeHtml(st.spray_advice)}</div>
        </div>` : ""}
      ${st.expected_outcome ? `
        <div class="timeline-outcome-box">
          ✓ Expected outcome: ${escapeHtml(st.expected_outcome)}
        </div>` : ""}
    </div>
  `).join("");

  modal.innerHTML = `
    <div class="modal-box" style="max-width:640px">
      <div class="modal-header">
        <div>
          <h3 style="margin:0">${escapeHtml(data.protocol_title || "14-Day Treatment & Recovery Plan")}</h3>
          <p class="subtle" style="margin:4px 0 0">Crop: <strong>${escapeHtml(data.crop_type || data.crop || "All Crops")}</strong> | Target: <strong>${escapeHtml(data.target_disease || "Plant Disease")}</strong></p>
        </div>
        <button type="button" class="btn ghost sm" onclick="document.getElementById('timelineModal').remove()"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="timeline-tracker">
        ${stagesHtml}
      </div>
      <div style="text-align:right; margin-top:16px;">
        <button class="btn" type="button" onclick="document.getElementById('timelineModal').remove()">Close Recovery Tracker</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}


async function savePlant() {
  const name = document.getElementById("pn") ? document.getElementById("pn").value.trim() : "";
  const crop = document.getElementById("pc") ? document.getElementById("pc").value.trim() : "";
  if (!name || !crop) return alert("Plot name and crop type are required.");
  try {
    await api("/api/plants", {
      method: "POST",
      body: formBody({
        plant_name: name,
        crop_type: crop,
        location: document.getElementById("pl")?.value.trim() || "",
        notes: document.getElementById("pnotes")?.value.trim() || "",
        image: document.getElementById("pimage")?.files[0],
      }),
    });
    alert("Plot saved successfully!");
    render();
  } catch (e) {
    alert("Failed to save plant: " + e.message);
  }
}

function symptomsPage() {
  return `
    <div class="card" style="max-width:720px;margin:auto">
      <p class="eyebrow"><span class="material-symbols-outlined">search</span> Symptom Checker</p>
      <h3>Check Symptoms by Description</h3>
      <p class="subtle">Describe leaf yellowing, spots, insect chew marks, or stem rot.</p>
      <label>Crop</label>
      <input id="symCrop" value="rice" />
      <label>Symptoms</label>
      <textarea id="symText" placeholder="e.g. Brown oval spots on leaf blades with gray centers and yellow halos..."></textarea>
      <div class="row" style="margin-top:12px">
        <button class="btn" onclick="runSymptomCheck()">${t("analyze")}</button>
        <button class="ghost" onclick="symptomListen()">🎤 Speak symptoms</button>
      </div>
      <div id="symOut"></div>
    </div>`;
}

function symptomListen() {
  listen((txt) => {
    const el = document.getElementById("symText");
    if (el) el.value = txt;
  });
}

async function runSymptomCheck() {
  const crop = document.getElementById("symCrop").value.trim();
  const symptoms = document.getElementById("symText").value.trim();
  if (!symptoms) return alert("Please enter symptoms.");
  const out = document.getElementById("symOut");
  out.innerHTML = `<p class="muted">Matching symptoms with knowledge base...</p>`;
  try {
    const data = await api("/api/symptoms/check", { method: "POST", body: formBody({ crop, symptoms, language: state.lang }) });
    out.innerHTML = `
      <div class="card" style="margin-top:14px;border-top:4px solid var(--leaf)">
        <p class="eyebrow">Probable Condition</p>
        <h3>${escapeHtml(pick(data.disease_name))}</h3>
        <p><b>Confidence:</b> ${Math.round(data.confidence * 100)}% · <span class="badge ${data.risk === "High" ? "high" : "med"}">${escapeHtml(data.risk)} Risk</span></p>
        <p>${escapeHtml(pick(data.treatment))}</p>
        <div class="row">
          <a class="btn" href="#detect">Scan with Camera</a>
          <a class="ghost" href="#doctors">Consult Doctor</a>
        </div>
      </div>`;
  } catch (e) {
    out.innerHTML = `<p style="color:var(--danger)">Error: ${escapeHtml(e.message)}</p>`;
  }
}

function feedbackPage() {
  return `
    <div class="card" style="max-width:600px;margin:auto">
      <p class="eyebrow"><span class="material-symbols-outlined">rate_review</span> Feedback</p>
      <h3>Field Feedback</h3>
      <label>Rating (1-5)</label>
      <input id="fbrate" type="number" min="1" max="5" value="5" />
      <label>Comments</label>
      <textarea id="fbtext" placeholder="Share your experience with diagnosis accuracy, doctors, or delivery..."></textarea>
      <button class="btn" style="margin-top:12px" onclick="sendFeedback()">Submit Feedback</button>
      <p id="fbOut" class="muted" style="margin-top:10px"></p>
    </div>`;
}

async function sendFeedback() {
  const rating = document.getElementById("fbrate").value;
  const comments = document.getElementById("fbtext").value.trim();
  try {
    await api("/api/feedback", { method: "POST", body: formBody({ rating, comments }) });
    document.getElementById("fbOut").textContent = "Thank you! Your feedback helps train more resilient agronomic models.";
  } catch (e) {
    alert(e.message);
  }
}

async function algorithmsPage() {
  const data = await api("/api/algorithms");
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">neurology</span> AI Architecture</p>
      <h3>Machine Learning Models & Pipeline</h3>
      <p class="subtle">Multi-stage pipeline: CNN for computer vision, Random Forest for climate risk, and Cosine similarity for multilingual retrieval.</p>
    </div>
    <div class="grid">
      ${(data.models || [])
        .map(
          (m) => `
        <div class="card">
          <span class="badge ok">${escapeHtml(m.type || "Model")}</span>
          <h3 style="margin:8px 0 4px">${escapeHtml(m.name)}</h3>
          <p class="subtle" style="font-size:0.88rem">${escapeHtml(m.purpose || "")}</p>
          <p style="font-size:0.8rem"><b>Input:</b> ${escapeHtml(m.input || "")}<br><b>Output:</b> ${escapeHtml(m.output || "")}</p>
        </div>`
        )
        .join("")}
    </div>`;
}

function riskPage() {
  return `
    <div class="card" style="max-width:700px;margin:auto">
      <p class="eyebrow"><span class="material-symbols-outlined">warning</span> Predictive Risk Radar</p>
      <h3>Field Disease Risk Assessment</h3>
      <p class="subtle">Calculates disease vulnerability using microclimate weather and crop growth stage.</p>
      <label>Crop</label>
      <input id="rcrop" value="rice" />
      <label>Humidity %</label>
      <input id="rhum" type="number" value="78" />
      <label>Rainfall (mm/week)</label>
      <input id="rrain" type="number" value="95" />
      <label>Temperature (°C)</label>
      <input id="rtemp" type="number" value="28" />
      <button class="btn" style="margin-top:14px" onclick="runRisk()">Calculate Risk Index</button>
      <div id="riskOut"></div>
    </div>`;
}

async function runRisk() {
  const crop = document.getElementById("rcrop").value;
  const humidity = document.getElementById("rhum").value;
  const rain = document.getElementById("rrain").value;
  const temp = document.getElementById("rtemp").value;
  const out = document.getElementById("riskOut");
  out.innerHTML = `<p class="muted">Evaluating climate conditions...</p>`;
  try {
    const data = await api("/api/risk", { method: "POST", body: formBody({ crop, humidity, rain, temp }) });
    out.innerHTML = `
      <div class="card" style="margin-top:14px;border-top:4px solid var(--leaf)">
        <h3>Predicted Risk Level: <span class="badge ${data.level === "High" ? "high" : data.level === "Medium" ? "med" : "low"}">${escapeHtml(data.level)}</span></h3>
        <p>${escapeHtml(data.summary || data.advice || "")}</p>
        <p class="muted">Risk factors evaluated: High relative humidity and temperature window favorable for fungal spore germination.</p>
      </div>`;
  } catch (e) {
    out.innerHTML = `<p style="color:var(--danger)">${escapeHtml(e.message)}</p>`;
  }
}

/* ==========================================================================
   🚨 1. Nearby Disease Outbreak Alert System
   ========================================================================== */

let _allOutbreaks = [];

async function outbreaksPage() {
  let outbreaks = [];
  try {
    const res = await api("/api/outbreaks/nearby?lat=16.8524&lon=74.5815&crop=&max_km=100");
    outbreaks = res.alerts || (Array.isArray(res) ? res : []);
    _allOutbreaks = outbreaks;
  } catch (e) {
    _allOutbreaks = [];
  }

  const quarantineCount = _allOutbreaks.filter((o) => o.in_quarantine_radius).length;
  const criticalCount = _allOutbreaks.filter((o) => o.severity === "Critical").length;

  return `
    <div class="card" style="margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <p class="eyebrow"><span class="material-symbols-outlined" style="font-size:16px">crisis_alert</span> Early Warning Defense</p>
          <h2>🚨 Nearby Crop Disease Outbreak Alerts</h2>
          <p class="subtle" style="margin:0">Real-time epidemiological containment radar anchored to your farm at <b>Sangli, Maharashtra</b> (16.8524° N, 74.5815° E).</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="openReportModal()"><span class="material-symbols-outlined">add_alert</span> ${t("reportOutbreak")}</button>
          <a href="#community-map" class="ghost"><span class="material-symbols-outlined">map</span> ${t("communityMap")}</a>
        </div>
      </div>
    </div>

    <div class="map-telemetry-bar">
      <div class="map-stat-card ${quarantineCount > 0 ? "danger" : ""}">
        <span class="material-symbols-outlined">${quarantineCount > 0 ? "emergency_home" : "verified_user"}</span>
        <div>
          <b>${quarantineCount > 0 ? "QUARANTINE ACTIVE" : "SAFE ZONE"}</b>
          <small>${quarantineCount} Quarantine Perimeter(s)</small>
        </div>
      </div>
      <div class="map-stat-card">
        <span class="material-symbols-outlined">radar</span>
        <div>
          <b>${_allOutbreaks.length} Active Hotspots</b>
          <small>Within 100 km Radius</small>
        </div>
      </div>
      <div class="map-stat-card danger">
        <span class="material-symbols-outlined">warning</span>
        <div>
          <b>${criticalCount} Critical Alerts</b>
          <small>Immediate Barrier Action</small>
        </div>
      </div>
      <div class="map-stat-card">
        <span class="material-symbols-outlined">health_and_safety</span>
        <div>
          <b>Prophylactic Advisory</b>
          <small>Verified Agronomy Protocols</small>
        </div>
      </div>
    </div>

    <div class="map-controls-bar">
      <div class="map-filters">
        <label style="margin:0;font-weight:600;font-size:0.85rem">Filter Crop:</label>
        <select id="outbreakCropFilter" class="field" style="padding:4px 8px" onchange="filterOutbreakList()">
          <option value="">All Crops</option>
          <option value="rice">Rice (Paddy)</option>
          <option value="tomato">Tomato</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
          <option value="maize">Maize</option>
          <option value="wheat">Wheat</option>
        </select>
        <label style="margin:0 0 0 10px;font-weight:600;font-size:0.85rem">Severity:</label>
        <select id="outbreakSeverityFilter" class="field" style="padding:4px 8px" onchange="filterOutbreakList()">
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
        </select>
      </div>
      <span class="subtle" id="outbreakResultCount" style="font-size:0.85rem">Showing ${_allOutbreaks.length} verified outbreaks</span>
    </div>

    <div class="outbreak-grid" id="outbreakCardsGrid">
      ${renderOutbreakCards(_allOutbreaks)}
    </div>

    <div id="reportModalContainer"></div>
  `;
}

function renderOutbreakCards(list) {
  if (!list.length) {
    return `<div class="card" style="grid-column:1/-1;text-align:center;padding:32px"><span class="material-symbols-outlined" style="font-size:40px;color:var(--ok)">verified</span><h3>No Disease Outbreaks Found</h3><p class="muted">Your area has zero active reported epidemics matching this filter.</p></div>`;
  }
  return list
    .map(
      (o) => `
    <div class="outbreak-card ${o.in_quarantine_radius ? "is-quarantine" : ""}">
      <div>
        <div class="outbreak-card__header">
          <div>
            <span class="badge ${o.severity === "Critical" ? "badge-danger" : o.severity === "High" ? "badge-amber" : "badge-green"}">${escapeHtml(o.severity)} Outbreak</span>
            <span class="distance-badge"><span class="material-symbols-outlined" style="font-size:14px">near_me</span> ${o.distance_km} km away</span>
          </div>
          <span class="badge ${o.in_quarantine_radius ? "badge-danger" : "badge-green"}">${o.in_quarantine_radius ? "Quarantine Zone" : "Outside Buffer"}</span>
        </div>
        <h3 style="margin:8px 0 2px">${escapeHtml(o.crop.toUpperCase())}: ${escapeHtml(o.disease_name)}</h3>
        <p class="subtle" style="font-size:0.85rem;margin:0 0 8px">
          <span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px">location_on</span>
          ${escapeHtml(o.location_name)} · <b>${o.cases_count} verified plots affected</b>
        </p>
        <div class="outbreak-protocol-box ${o.in_quarantine_radius ? "urgent" : ""}">
          <b>${o.in_quarantine_radius ? "🚨 Quarantine Protocol:" : "🛡️ Prophylactic Protocol:"}</b>
          <p style="margin:4px 0 0">${escapeHtml(o.quarantine_protocol || o.advisory)}</p>
        </div>
        <p style="font-size:0.8rem;color:var(--subtle);margin:4px 0">
          <b>Barrier Advisory:</b> ${escapeHtml(o.advisory)}
        </p>
        <p style="font-size:0.75rem;color:var(--muted);margin-top:6px">
          Perimeter radius: ${o.radius_km} km · Reported by: ${escapeHtml(o.reporter_name || "AgriShield Epidemiological Cell")}
        </p>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)">
        <a href="#shop" class="btn" style="flex:1;text-align:center"><span class="material-symbols-outlined" style="font-size:16px">vaccines</span> Order Barrier Spray</a>
        <a href="#doctors" class="ghost" style="flex:1;text-align:center"><span class="material-symbols-outlined" style="font-size:16px">support_agent</span> Consult Pathologist</a>
      </div>
    </div>
  `
    )
    .join("");
}

function filterOutbreakList() {
  const crop = (document.getElementById("outbreakCropFilter")?.value || "").toLowerCase();
  const severity = document.getElementById("outbreakSeverityFilter")?.value || "";
  const filtered = _allOutbreaks.filter((o) => {
    if (crop && o.crop.toLowerCase() !== crop) return false;
    if (severity && o.severity !== severity) return false;
    return true;
  });
  const container = document.getElementById("outbreakCardsGrid");
  const countLabel = document.getElementById("outbreakResultCount");
  if (container) container.innerHTML = renderOutbreakCards(filtered);
  if (countLabel) countLabel.textContent = `Showing ${filtered.length} verified outbreaks`;
}

function openReportModal() {
  const container = document.getElementById("reportModalContainer");
  if (!container) return;
  container.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target === this) closeReportModal()">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <p class="eyebrow" style="margin:0"><span class="material-symbols-outlined" style="font-size:16px">crisis_alert</span> Community Intelligence</p>
            <h3 style="margin:2px 0 0">Report Disease Outbreak</h3>
          </div>
          <button class="icon-btn" onclick="closeReportModal()"><span class="material-symbols-outlined">close</span></button>
        </div>
        <p class="subtle" style="font-size:0.85rem">Alert neighboring farmers and agronomists to arrest pathogen vectors early.</p>
        <form id="outbreakReportForm" onsubmit="submitOutbreakReport(event)">
          <label>Target Crop *</label>
          <select class="field" id="modalReportCrop" required>
            <option value="rice">Rice (Paddy)</option>
            <option value="tomato">Tomato</option>
            <option value="cotton">Cotton</option>
            <option value="sugarcane">Sugarcane</option>
            <option value="maize">Maize</option>
            <option value="wheat">Wheat</option>
          </select>
          <label>Disease Name / Symptoms *</label>
          <input class="field" id="modalReportDisease" placeholder="e.g. Rice Blast, Early Blight, Stem Borer" required />
          <label>Location / Village / District *</label>
          <input class="field" id="modalReportLocation" placeholder="e.g. Ashta Village, Sangli" value="Sangli District, Maharashtra" required />
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div>
              <label>Severity *</label>
              <select class="field" id="modalReportSeverity" required>
                <option value="Moderate">Moderate</option>
                <option value="High" selected>High (Spreading)</option>
                <option value="Critical">Critical (Epidemic)</option>
              </select>
            </div>
            <div>
              <label>Affected Plots Count *</label>
              <input type="number" class="field" id="modalReportCases" value="3" min="1" required />
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div>
              <label>Estimated Radius (km)</label>
              <input type="number" class="field" id="modalReportRadius" value="10" min="1" max="100" />
            </div>
            <div>
              <label>Your Name / Contact</label>
              <input class="field" id="modalReportName" value="${escapeHtml((state.user && state.user.name) || "Progressive Farmer")}" />
            </div>
          </div>
          <label>Recommended Immediate Advisory / Protective Action</label>
          <textarea class="field" id="modalReportAdvisory" rows="2" placeholder="e.g. Apply prophylactic copper spray and cease movement of contaminated tools.">Prophylactic fungicide spray and quarantine infected zone.</textarea>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
            <button type="button" class="ghost" onclick="closeReportModal()">Cancel</button>
            <button type="submit" class="btn" id="modalReportSubmitBtn"><span class="material-symbols-outlined">send</span> Broadcast Outbreak Alert</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function closeReportModal() {
  const container = document.getElementById("reportModalContainer");
  if (container) container.innerHTML = "";
}

async function submitOutbreakReport(e) {
  e.preventDefault();
  const btn = document.getElementById("modalReportSubmitBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Broadcasting...";
  }
  try {
    const cropVal = document.getElementById("modalReportCrop").value;
    const diseaseVal = document.getElementById("modalReportDisease").value;
    const locVal = document.getElementById("modalReportLocation").value;
    const payload = {
      title: `${diseaseVal} outbreak in ${locVal}`,
      crop: cropVal,
      disease_name: diseaseVal,
      location_name: locVal,
      latitude: (16.8524 + (Math.random() - 0.5) * 0.12).toFixed(4),
      longitude: (74.5815 + (Math.random() - 0.5) * 0.12).toFixed(4),
      severity: document.getElementById("modalReportSeverity").value,
      radius_km: parseFloat(document.getElementById("modalReportRadius").value) || 10,
      cases_count: parseInt(document.getElementById("modalReportCases").value, 10) || 1,
      advisory: document.getElementById("modalReportAdvisory").value,
      quarantine_protocol: "Establish a buffer boundary spray and sanitize machinery before plot transit.",
      reporter_name: document.getElementById("modalReportName").value,
    };
    await api("/api/outbreaks/report", {
      method: "POST",
      body: formBody(payload),
    });
    alert("Outbreak report broadcasted! Community alerts and geospatial risk maps have been updated.");
    closeReportModal();
    if (state.page === "outbreaks") render();
    if (state.page === "community-map") initCommunityMap();
  } catch (err) {
    alert("Submission error: " + err.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Broadcast Outbreak Alert";
    }
  }
}

/* ==========================================================================
   🗺️ 2. Community Crop Disease Intelligence Map
   ========================================================================== */

let _leafletMapInstance = null;
let _mapMarkersLayer = null;
let _mapCirclesLayer = null;
let _cachedMapData = null;

async function communityMapPage() {
  return `
    <div class="map-page-header">
      <div>
        <p class="eyebrow"><span class="material-symbols-outlined" style="font-size:16px">map</span> Geospatial Surveillance</p>
        <h2>🗺️ Community Crop Disease Intelligence Map</h2>
        <p class="subtle" style="margin:0">Live epidemiological cluster map showing verified disease vectors and quarantine perimeters.</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="openReportModal()"><span class="material-symbols-outlined">add_alert</span> ${t("reportOutbreak")}</button>
        <a href="#outbreaks" class="ghost"><span class="material-symbols-outlined">crisis_alert</span> View Alert List</a>
      </div>
    </div>

    <div class="map-telemetry-bar">
      <div class="map-stat-card">
        <span class="material-symbols-outlined">radar</span>
        <div>
          <b id="mapStatHotspots">—</b>
          <small>Active Hotspots</small>
        </div>
      </div>
      <div class="map-stat-card danger">
        <span class="material-symbols-outlined">emergency</span>
        <div>
          <b id="mapStatCritical">—</b>
          <small>Critical Quarantine Zones</small>
        </div>
      </div>
      <div class="map-stat-card">
        <span class="material-symbols-outlined">near_me</span>
        <div>
          <b id="mapStatNearest">—</b>
          <small>Nearest Outbreak</small>
        </div>
      </div>
      <div class="map-stat-card">
        <span class="material-symbols-outlined">verified</span>
        <div>
          <b id="mapStatReports">—</b>
          <small>Verified Plots Affected</small>
        </div>
      </div>
    </div>

    <div class="map-controls-bar">
      <div class="map-filters">
        <label style="margin:0;font-weight:600;font-size:0.85rem">Filter Crop:</label>
        <select id="mapCropFilter" class="field" style="padding:4px 8px" onchange="renderMapLayers()">
          <option value="">All Crops</option>
          <option value="rice">Rice (Paddy)</option>
          <option value="tomato">Tomato</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
          <option value="maize">Maize</option>
          <option value="wheat">Wheat</option>
        </select>
        <label style="margin:0 0 0 10px;font-weight:600;font-size:0.85rem">Severity:</label>
        <select id="mapSeverityFilter" class="field" style="padding:4px 8px" onchange="renderMapLayers()">
          <option value="">All Severities</option>
          <option value="Critical">Critical Only</option>
          <option value="High">High & Critical</option>
        </select>
        <label style="margin:0 0 0 10px;display:inline-flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer">
          <input type="checkbox" id="mapToggleCircles" checked onchange="renderMapLayers()" />
          <span>Show Quarantine Spread Radii</span>
        </label>
      </div>
      <button class="ghost" style="padding:4px 10px;font-size:0.85rem" onclick="initCommunityMap()"><span class="material-symbols-outlined" style="font-size:16px">refresh</span> Refresh Map</button>
    </div>

    <div id="diseaseMap"></div>

    <div class="map-legend-box">
      <span><b>Legend:</b></span>
      <span><span class="legend-dot" style="background:#1b6c3b"></span> Your Farm (Sangli Base)</span>
      <span><span class="legend-dot" style="background:#ba1a1a"></span> Critical Outbreak (Quarantine Active)</span>
      <span><span class="legend-dot" style="background:#eab308"></span> High Threat Vector</span>
      <span><span class="legend-dot" style="background:#3b82f6"></span> Moderate Incident</span>
    </div>

    <div id="reportModalContainer"></div>
  `;
}

async function initCommunityMap() {
  const mapEl = document.getElementById("diseaseMap");
  if (!mapEl || typeof L === "undefined") return;

  if (_leafletMapInstance) {
    try {
      _leafletMapInstance.remove();
    } catch (_) {}
    _leafletMapInstance = null;
  }

  const userLat = 16.8524;
  const userLon = 74.5815;

  _leafletMapInstance = L.map("diseaseMap").setView([userLat, userLon], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AgriShield SIH',
  }).addTo(_leafletMapInstance);

  const userIcon = L.divIcon({
    className: "custom-farm-pin",
    html: `<div style="background:#1b6c3b;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px rgba(27,108,59,0.25);border:2px solid #fff;"><span class="material-symbols-outlined" style="font-size:20px">agriculture</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  L.marker([userLat, userLon], { icon: userIcon })
    .addTo(_leafletMapInstance)
    .bindPopup(`
      <div style="font-family:var(--font-sans);padding:4px">
        <span class="map-popup-badge" style="background:#dff4df;color:#042716">🏡 Your Monitored Farm Base</span>
        <h4 style="margin:2px 0 4px">Sangli Farm Station</h4>
        <p style="margin:0;font-size:0.85rem;color:var(--muted)">Lat: ${userLat.toFixed(4)}, Lon: ${userLon.toFixed(4)}</p>
        <p style="margin:4px 0 0;font-size:0.85rem">Active Plots: 4 · Kharif Season</p>
      </div>
    `);

  _mapMarkersLayer = L.layerGroup().addTo(_leafletMapInstance);
  _mapCirclesLayer = L.layerGroup().addTo(_leafletMapInstance);

  try {
    const data = await api("/api/outbreaks/map?crop=");
    _cachedMapData = data;
    renderMapLayers();
  } catch (err) {
    console.error("Map load error:", err);
  }
}

function renderMapLayers() {
  if (!_leafletMapInstance || !_cachedMapData) return;

  _mapMarkersLayer.clearLayers();
  _mapCirclesLayer.clearLayers();

  const cropFilter = (document.getElementById("mapCropFilter")?.value || "").toLowerCase();
  const severityFilter = document.getElementById("mapSeverityFilter")?.value || "";
  const showCircles = document.getElementById("mapToggleCircles")?.checked ?? true;

  const points = _cachedMapData.points || [];
  let matchingCount = 0;
  let criticalCount = 0;
  let totalCases = 0;

  points.forEach((p) => {
    if (cropFilter && p.crop.toLowerCase() !== cropFilter) return;
    if (severityFilter === "Critical" && p.severity !== "Critical") return;
    if (severityFilter === "High" && p.severity !== "Critical" && p.severity !== "High") return;

    matchingCount++;
    if (p.severity === "Critical") criticalCount++;
    totalCases += p.cases_count;

    const lat = p.latitude;
    const lon = p.longitude;
    const color = p.severity === "Critical" ? "#ba1a1a" : p.severity === "High" ? "#f59e0b" : "#3b82f6";

    if (showCircles && p.radius_km) {
      const circle = L.circle([lat, lon], {
        color: color,
        fillColor: color,
        fillOpacity: p.severity === "Critical" ? 0.22 : 0.12,
        radius: p.radius_km * 1000,
        weight: 1.5,
      });
      circle.addTo(_mapCirclesLayer);
    }

    const pinIcon = L.divIcon({
      className: "outbreak-map-marker",
      html: `<div style="background:${color};color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;font-weight:700;font-size:12px;">${p.cases_count}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = L.marker([lat, lon], { icon: pinIcon });
    marker.bindPopup(`
      <div style="font-family:var(--font-sans);min-width:210px">
        <span class="map-popup-badge" style="background:${color};color:#fff">${escapeHtml(p.severity)} Outbreak</span>
        <h3 style="margin:2px 0 4px;font-size:1.05rem">${escapeHtml(p.crop.toUpperCase())}: ${escapeHtml(p.disease_name)}</h3>
        <p style="margin:2px 0;font-size:0.85rem;color:var(--muted)"><b>Location:</b> ${escapeHtml(p.location_name)}</p>
        <p style="margin:2px 0;font-size:0.85rem;color:var(--muted)"><b>Active Plots:</b> ${p.cases_count} plots affected</p>
        <p style="margin:2px 0;font-size:0.85rem;color:var(--muted)"><b>Perimeter:</b> ${p.radius_km} km spread zone</p>
        <div style="background:var(--surface-low);border-left:3px solid ${color};padding:6px 8px;border-radius:4px;font-size:0.8rem;margin:8px 0">
          <b>Advisory:</b> ${escapeHtml(p.advisory)}
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <a href="#shop" class="btn" style="padding:4px 8px;font-size:0.78rem">Order Medicine</a>
          <a href="#outbreaks" class="ghost" style="padding:4px 8px;font-size:0.78rem">View Protocol</a>
        </div>
      </div>
    `);
    marker.addTo(_mapMarkersLayer);
  });

  const elHotspots = document.getElementById("mapStatHotspots");
  const elCritical = document.getElementById("mapStatCritical");
  const elReports = document.getElementById("mapStatReports");
  const elNearest = document.getElementById("mapStatNearest");
  if (elHotspots) elHotspots.textContent = matchingCount;
  if (elCritical) elCritical.textContent = criticalCount;
  if (elReports) elReports.textContent = totalCases;
  if (elNearest) elNearest.textContent = _cachedMapData.containment_status || "78% Contained";
}

/* ==========================================================================
   🔮 3. Weather-Based Disease Risk Prediction System
   ========================================================================== */

let _weatherRiskDebounce = null;

async function weatherRiskPage() {
  return `
    <div class="card" style="margin-bottom:18px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <p class="eyebrow"><span class="material-symbols-outlined" style="font-size:16px">thermostat</span> Microclimate Epidemiology</p>
          <h2>🔮 Weather-Based Disease Risk Prediction</h2>
          <p class="subtle" style="margin:0">Simulates fungal spore germination windows, canopy humidity condensation, and proactive spray schedules.</p>
        </div>
        <a href="#community-map" class="ghost"><span class="material-symbols-outlined">map</span> View Community Map</a>
      </div>
    </div>

    <div class="weather-risk-stage">
      <div class="card">
        <h3 style="margin:0 0 16px;display:flex;align-items:center;gap:8px">
          <span class="material-symbols-outlined" style="color:var(--leaf)">tune</span>
          Microclimate Parameters
        </h3>

        <div class="slider-group">
          <label style="font-weight:600;font-size:0.9rem">Target Crop</label>
          <select id="wCrop" class="field" onchange="recalcWeatherRisk()">
            <option value="rice" selected>Rice (Paddy) — Blast / Blight model</option>
            <option value="tomato">Tomato — Early & Late Blight model</option>
            <option value="cotton">Cotton — Bollworm & Wilt model</option>
            <option value="wheat">Wheat — Rust & Powdery Mildew model</option>
            <option value="maize">Maize — Leaf Blight model</option>
            <option value="sugarcane">Sugarcane — Red Rot model</option>
          </select>
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span>Ambient Temperature</span>
            <span class="slider-value-pill" id="wTempVal">28°C</span>
          </div>
          <input type="range" class="range-input" id="wTemp" min="15" max="42" value="28" oninput="document.getElementById('wTempVal').textContent = this.value + '°C'; recalcWeatherRisk()" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span>Relative Humidity (RH)</span>
            <span class="slider-value-pill" id="wHumVal">82%</span>
          </div>
          <input type="range" class="range-input" id="wHum" min="30" max="100" value="82" oninput="document.getElementById('wHumVal').textContent = this.value + '%'; recalcWeatherRisk()" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span>Cumulative Rainfall (7-Day)</span>
            <span class="slider-value-pill" id="wRainVal">65 mm</span>
          </div>
          <input type="range" class="range-input" id="wRain" min="0" max="150" value="65" step="5" oninput="document.getElementById('wRainVal').textContent = this.value + ' mm'; recalcWeatherRisk()" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span>Canopy Leaf Wetness Duration</span>
            <span class="slider-value-pill" id="wWetVal">9.0 hrs/day</span>
          </div>
          <input type="range" class="range-input" id="wWet" min="0" max="24" value="9" step="0.5" oninput="document.getElementById('wWetVal').textContent = this.value + ' hrs/day'; recalcWeatherRisk()" />
        </div>

        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="ghost" type="button" onclick="setWeatherPreset('monsoon')">🌧️ Heavy Monsoon Preset</button>
          <button class="ghost" type="button" onclick="setWeatherPreset('dry')">☀️ Dry Sunny Preset</button>
        </div>
      </div>

      <div class="card" id="weatherRiskOutputCard">
        <div style="text-align:center;padding:40px">
          <span class="material-symbols-outlined" style="font-size:36px;animation:spin 1s infinite">sync</span>
          <p class="muted">Calculating epidemiological model...</p>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px" id="weatherTrajectoryContainer">
      <h3 style="margin:0 0 12px;display:flex;align-items:center;gap:8px">
        <span class="material-symbols-outlined" style="color:var(--leaf)">timeline</span>
        5-Day Meteorological Disease Risk Trajectory
      </h3>
      <p class="subtle" style="margin:0 0 16px">Forecasted risk index based on incoming pressure front and diurnal dew point windows.</p>
      <div class="trajectory-grid" id="trajectoryGrid"></div>
    </div>
  `;
}

function setWeatherPreset(type) {
  if (type === "monsoon") {
    document.getElementById("wTemp").value = 26;
    document.getElementById("wHum").value = 92;
    document.getElementById("wRain").value = 110;
    document.getElementById("wWet").value = 14;
  } else {
    document.getElementById("wTemp").value = 34;
    document.getElementById("wHum").value = 45;
    document.getElementById("wRain").value = 5;
    document.getElementById("wWet").value = 2;
  }
  document.getElementById("wTempVal").textContent = document.getElementById("wTemp").value + "°C";
  document.getElementById("wHumVal").textContent = document.getElementById("wHum").value + "%";
  document.getElementById("wRainVal").textContent = document.getElementById("wRain").value + " mm";
  document.getElementById("wWetVal").textContent = document.getElementById("wWet").value + " hrs/day";
  recalcWeatherRisk();
}

function initWeatherRisk() {
  recalcWeatherRisk();
}

function recalcWeatherRisk() {
  clearTimeout(_weatherRiskDebounce);
  _weatherRiskDebounce = setTimeout(async () => {
    const crop = document.getElementById("wCrop")?.value || "rice";
    const temperature = parseFloat(document.getElementById("wTemp")?.value || 28);
    const humidity = parseFloat(document.getElementById("wHum")?.value || 82);
    const rainfall_mm = parseFloat(document.getElementById("wRain")?.value || 65);
    const leaf_wetness_hours = parseFloat(document.getElementById("wWet")?.value || 9);

    const outCard = document.getElementById("weatherRiskOutputCard");
    const trajGrid = document.getElementById("trajectoryGrid");
    if (!outCard) return;

    try {
      const res = await api("/api/risk/weather-forecast", {
        method: "POST",
        body: formBody({
          crop,
          temp: temperature,
          humidity,
          rain: rainfall_mm,
          leaf_wetness_hours,
          consecutive_wet_days: 2,
        }),
      });

      const score = res.overall_risk_score ?? res.risk_score ?? 50;
      const levelClass = res.risk_level === "Extreme" || res.risk_level === "Critical" || res.risk_level === "High" ? "danger" : res.risk_level === "Medium" ? "amber" : "green";
      const scoreColor = score >= 70 ? "var(--danger)" : score >= 40 ? "var(--gold)" : "var(--ok)";

      outCard.innerHTML = `
        <div class="risk-meter-display">
          <p class="eyebrow" style="margin:0"><span class="material-symbols-outlined" style="font-size:16px">model_training</span> Microclimate Index</p>
          <div class="risk-meter-score" style="color:${scoreColor}">${score}<small style="font-size:1.5rem;color:var(--muted)">/100</small></div>
          <span class="badge ${levelClass === "danger" ? "badge-danger" : levelClass === "amber" ? "badge-amber" : "badge-green"}" style="font-size:0.95rem;padding:4px 12px">
            ${escapeHtml(res.risk_level)} Disease Vulnerability
          </span>
          <p style="margin:8px 0 0;font-size:0.9rem;color:var(--ink)"><b>Crop Target:</b> ${escapeHtml(res.crop.toUpperCase())}</p>
        </div>

        <div class="spore-window-grid">
          <div class="spore-stat-box">
            <span class="material-symbols-outlined" style="color:var(--leaf);font-size:20px">biotechnology</span>
            <b style="display:block;margin-top:4px">${escapeHtml(res.spore_germination_window?.vulnerability_status || "Active")}</b>
            <small class="muted">${escapeHtml(res.spore_germination_window?.wetness_threshold || "")}</small>
          </div>
          <div class="spore-stat-box">
            <span class="material-symbols-outlined" style="color:var(--leaf);font-size:20px">bedtime</span>
            <b style="display:block;margin-top:4px">${escapeHtml(res.spore_germination_window?.window || "Night Condensation Window")}</b>
            <small class="muted">Dew Point Window</small>
          </div>
        </div>

        <div class="outbreak-protocol-box ${score >= 65 ? "urgent" : ""}">
          <b>Epidemiological Assessment:</b>
          <p style="margin:4px 0 0">${escapeHtml(res.advisory)}</p>
        </div>

        <div class="spray-card">
          <h4 style="margin:0 0 6px;color:#14532d;display:flex;align-items:center;gap:6px">
            <span class="material-symbols-outlined" style="font-size:20px">shower</span>
            Proactive Spray Recommendation: ${escapeHtml(res.spray_schedule?.status || "Optimal Window")}
          </h4>
          <p style="margin:0 0 8px;font-size:0.9rem;font-weight:600;color:#166534">
            ${escapeHtml(res.spray_schedule?.recommended_chemistry || "")}
          </p>
          <p style="margin:0;font-size:0.85rem;color:#15803d">
            ⏰ <b>Optimal Spray Window:</b> ${escapeHtml(res.spray_schedule?.best_hours || "")}
          </p>
          <p style="margin:4px 0 0;font-size:0.78rem;color:var(--muted)">
            ${escapeHtml(res.spray_schedule?.withhold_recommendation || "")}
          </p>
          <div style="margin-top:12px">
            <a href="#shop" class="btn" style="font-size:0.85rem;padding:6px 12px">Order Spray Medicine in Store</a>
          </div>
        </div>
      `;

      if (trajGrid && res.trajectory_5_day) {
        trajGrid.innerHTML = res.trajectory_5_day
          .map((d) => {
            const cardClass = d.risk_level === "High" ? "danger" : d.risk_level === "Medium" ? "amber" : "green";
            return `
            <div class="trajectory-card ${cardClass}">
              <p style="margin:0;font-weight:700;font-size:0.9rem">${escapeHtml(d.day)}</p>
              <b style="font-size:1.4rem;display:block;margin:4px 0">${d.risk_score}</b>
              <span class="badge ${cardClass === "danger" ? "badge-danger" : cardClass === "amber" ? "badge-amber" : "badge-green"}" style="font-size:0.75rem">
                ${escapeHtml(d.risk_level)}
              </span>
              <p style="margin:8px 0 2px;font-size:0.78rem;color:var(--muted)">${escapeHtml(d.trigger)}</p>
            </div>
          `;
          })
          .join("");
      }
    } catch (err) {
      outCard.innerHTML = `<div class="card" style="border-color:var(--danger)"><p style="color:var(--danger)">Simulation error: ${escapeHtml(err.message)}</p></div>`;
    }
  }, 120);
}

function advisorPage() {
  return `
    <div class="card" style="max-width:700px;margin:auto">
      <p class="eyebrow"><span class="material-symbols-outlined">recommend</span> Crop Advisor</p>
      <h3>Microclimate Crop Advisor</h3>
      <label>Region / District</label>
      <input id="adreg" value="Sangli, Maharashtra" />
      <label>Soil Type</label>
      <select id="adsoil" class="field"><option>Clay Loam</option><option>Black Soil</option><option>Alluvial</option><option>Red Sandy</option></select>
      <label>Current Season</label>
      <select id="adseason" class="field"><option>Kharif (Monsoon)</option><option>Rabi (Winter)</option><option>Zaid (Summer)</option></select>
      <button class="btn" style="margin-top:14px" onclick="alert('Based on Clay Loam in Sangli during Kharif: Recommended crops are Basmati/IR-64 Rice, Soybean, and Turmeric. Water availability is favorable.')">Generate Advisory</button>
    </div>`;
}

function farmToolsPage() {
  return `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <p class="eyebrow"><span class="material-symbols-outlined">construction</span> Agronomic Suite</p>
          <h2 style="margin:0;font-family:var(--font-serif);color:var(--moss)">Farm Tools & Soil Telemetry</h2>
        </div>
        <button class="btn light" type="button" onclick="speak('Soil Health Index is 72 out of 100. Moderately fertile with nitrogen shortage. Plot A and Plot B comparison available.')"><span class="material-symbols-outlined">volume_up</span> Audio Guide</button>
      </div>
      <p class="subtle" style="margin:6px 0 0">Real-time IoT BLE probe telemetry, Soil Health Card lab analysis, and side-by-side plot comparison.</p>
    </div>

    <!-- 1. Live Soil Health & NPK Sensor Analyzer -->
    <section class="card" style="margin-top:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge ok"><span class="online-dot"></span> BLE Probe #04</span>
          <small class="muted">Calibrated: 15cm Depth · 84% Battery</small>
        </div>
        <small class="muted">Sync: Today, 8:15 AM</small>
      </div>
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div class="radial-gauge-container">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e6ede4" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1b6c3b" stroke-width="8" stroke-dasharray="181 251.3" stroke-linecap="round"></circle>
          </svg>
          <div class="radial-gauge-score"><b>72</b><small>/ 100</small></div>
        </div>
        <div style="flex:1;min-width:240px">
          <h3 style="margin:0">Soil Health: Moderately Fertile</h3>
          <p class="subtle" style="margin:4px 0 8px;font-size:0.9rem">Nutrient uptake is constrained by immediate nitrogen shortage. High microbial activity detected in topsoil.</p>
          <span class="badge med">Action needed within 48 hrs</span>
        </div>
      </div>
      <div class="npk-pills-row">
        <div class="npk-pill"><small>Nitrogen (N)</small><b style="color:var(--danger)">Deficient (40 kg)</b></div>
        <div class="npk-pill"><small>Phosphorus (P)</small><b style="color:var(--ok)">Optimal (25 kg)</b></div>
        <div class="npk-pill"><small>Potassium (K)</small><b style="color:var(--ok)">Adequate (30 kg)</b></div>
      </div>
      <div class="npk-pills-row" style="margin-top:8px">
        <div class="npk-pill"><small>Soil pH</small><b>6.5 (Neutral)</b></div>
        <div class="npk-pill"><small>Moisture</small><b>38% (Optimal)</b></div>
        <div class="npk-pill"><small>Elect. Cond.</small><b>1.4 dS/m</b></div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:14px">
        <input id="fertArea" type="number" value="1" min="0.1" step="0.1" style="max-width:140px" />
        <span style="font-size:0.85rem;color:var(--moss);font-weight:600">Hectares</span>
        <button class="btn" style="margin-left:auto" onclick="runFertilizerCalculator()"><span class="material-symbols-outlined">calculate</span> Calculate Nutrient Gap</button>
      </div>
      <div id="fertilizerOut"></div>
    </section>

    <!-- 2. Plot Comparison (Plot A vs Plot B) -->
    <section class="card" style="margin-top:16px">
      <p class="eyebrow"><span class="material-symbols-outlined">compare</span> Multi-Field Analytics</p>
      <h3>Side-by-Side Plot Comparison</h3>
      <p class="subtle">Compare agronomic vigor, moisture retention and projected yield across your plots.</p>
      <div class="grid" style="margin-top:12px">
        <div class="card" style="background:var(--surface-low);border-color:#bcd6b9">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <b style="color:var(--moss)">Plot A — Basmati Rice</b>
            <span class="badge ok">Stage: Tillering</span>
          </div>
          <p class="muted" style="margin:4px 0 10px;font-size:0.85rem">2.0 Hectares · Clay Loam</p>
          <div style="display:grid;gap:6px;font-size:0.88rem">
            <div>Soil Health Score: <b>72 / 100</b></div>
            <div>Estimated Yield: <b>4.8 t/ha</b></div>
            <div>Moisture Level: <b>74%</b></div>
            <div>Fungicide Window: <b>Today, 4 PM</b></div>
          </div>
        </div>
        <div class="card" style="background:var(--surface-low);border-color:#bcd6b9">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <b style="color:var(--moss)">Plot B — IR-64 Paddy</b>
            <span class="badge med">Stage: Vegetative</span>
          </div>
          <p class="muted" style="margin:4px 0 10px;font-size:0.85rem">2.5 Hectares · Black Loam</p>
          <div style="display:grid;gap:6px;font-size:0.88rem">
            <div>Soil Health Score: <b>68 / 100</b></div>
            <div>Estimated Yield: <b>5.4 t/ha</b></div>
            <div>Moisture Level: <b>65%</b></div>
            <div>Fungicide Window: <b>Tomorrow morning</b></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Irrigation & Sowing Planners -->
    <div class="grid">
      <section class="card">
        <p class="eyebrow"><span class="material-symbols-outlined">water_drop</span> Water Management</p>
        <h3>Irrigation Planner</h3>
        <label>Crop</label>
        <select id="irCrop" class="field"><option>rice</option><option>tomato</option><option>maize</option><option>groundnut</option><option>millet</option><option>cotton</option></select>
        <label>Area (hectares)</label>
        <input id="irArea" type="number" value="1" min="0.1" step="0.1" />
        <label>Weekly Rainfall Received (mm)</label>
        <input id="irRain" type="number" value="10" min="0" />
        <button class="btn" style="width:100%;margin-top:12px" onclick="runIrrigationPlan()">Plan Irrigation</button>
        <div id="irrigationOut"></div>
      </section>
      <section class="card">
        <p class="eyebrow"><span class="material-symbols-outlined">spa</span> Sowing Calendar</p>
        <h3>Seed & Sowing Planner</h3>
        <label>Crop</label>
        <select id="sowCrop" class="field"><option>rice</option><option>maize</option><option>tomato</option><option>groundnut</option><option>millet</option><option>cotton</option></select>
        <label>Area (hectares)</label>
        <input id="sowArea" type="number" value="1" min="0.1" step="0.1" />
        <label>Target Sowing Month</label>
        <select id="sowMonth" class="field"><option value="6">June (Monsoon)</option><option value="7">July (Monsoon)</option><option value="10">October (Rabi)</option><option value="11">November (Rabi)</option></select>
        <button class="btn" style="width:100%;margin-top:12px" onclick="runSowingPlan()">Calculate Sowing Window</button>
        <div id="sowingOut"></div>
      </section>
    </div>
  `;
}

function runIrrigationPlan() {
  const crop = document.getElementById("irCrop").value;
  const area = Math.max(0.1, Number(document.getElementById("irArea").value) || 1);
  const rain = Math.max(0, Number(document.getElementById("irRain").value) || 0);
  const weeklyNeed = { rice: 55, tomato: 32, maize: 35, groundnut: 28, millet: 22, cotton: 30 }[crop] || 30;
  const requiredMm = Math.max(0, weeklyNeed - rain);
  const litres = Math.round(requiredMm * area * 10000);
  document.getElementById("irrigationOut").innerHTML = `
    <div class="card" style="margin-top:12px;background:var(--surface-low)">
      <p style="margin:0 0 6px"><b>${requiredMm} mm</b> additional water required this week (approx <b>${litres.toLocaleString()} litres</b> for ${area} ha).</p>
      <p class="muted" style="margin:0;font-size:0.8rem">Adjust for recent showers and soil moisture saturation.</p>
    </div>`;
}

function runFertilizerCalculator() {
  const area = Math.max(0.1, Number(document.getElementById("fertArea").value) || 1);
  const gaps = { N: Math.max(0, 50 - 40), P: Math.max(0, 30 - 25), K: Math.max(0, 40 - 30) };
  document.getElementById("fertilizerOut").innerHTML = `
    <div class="card" style="margin-top:14px;background:var(--surface-low)">
      <p style="margin:0 0 6px"><b>Estimated Nutrient Gap for ${area} Hectares:</b></p>
      <ul style="margin:4px 0 8px;padding-left:20px;font-size:0.9rem">
        <li>Nitrogen (N): <b>${Math.round(gaps.N * area)} kg</b></li>
        <li>Phosphorus (P): <b>${Math.round(gaps.P * area)} kg</b></li>
        <li>Potassium (K): <b>${Math.round(gaps.K * area)} kg</b></li>
      </ul>
      <p class="muted" style="margin:0;font-size:0.78rem">Elemental nutrient requirements. Confirm specific fertilizer formulation (Urea, DAP, MOP) with soil test recommendations.</p>
    </div>`;
}

async function runSowingPlan() {
  const crop = document.getElementById("sowCrop").value;
  const area = Math.max(0.1, Number(document.getElementById("sowArea").value) || 1);
  const rates = { rice: 40, maize: 20, tomato: 0.15, groundnut: 100, millet: 8, cotton: 3 };
  const needed = Math.round((rates[crop] || 25) * area * 10) / 10;
  document.getElementById("sowingOut").innerHTML = `
    <div class="card" style="margin-top:12px;background:var(--surface-low)">
      <p style="margin:0 0 6px">Recommended seed quantity for ${area} ha: <b>${needed} kg</b></p>
      <p class="muted" style="margin:0;font-size:0.8rem">Seed treatment with Trichoderma or Pseudomonas recommended 24 hours prior to sowing.</p>
    </div>`;
}

async function dataCatalogPage() {
  const data = await api("/api/data-catalog");
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">database</span> Open Data & Catalogs</p>
      <h3>Datasets & Knowledge Repositories</h3>
      <p class="subtle">Aggregated from ICAR, PlantVillage, and national soil testing laboratories.</p>
    </div>
    <div class="grid">
      ${(data.datasets || [])
        .map(
          (d) => `
        <div class="card">
          <span class="badge ok">${escapeHtml(d.category || "Dataset")}</span>
          <h3 style="margin:8px 0 4px">${escapeHtml(d.title || d.name)}</h3>
          <p class="subtle" style="font-size:0.85rem">${escapeHtml(d.description || "")}</p>
          <p class="muted" style="font-size:0.8rem"><b>Samples:</b> ${escapeHtml(d.samples || "10,000+")} · <b>Format:</b> ${escapeHtml(d.format || "CSV / Images")}</p>
        </div>`
        )
        .join("")}
    </div>`;
}

let currentSchemeCategory = "all";
let currentSchemeSearch = "";

async function schemesPage() {
  return `
    <div class="card" style="margin-bottom:20px; background: linear-gradient(135deg, #0d3b24 0%, #175234 100%); color:#ffffff; border:none;">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px">
        <div>
          <p class="eyebrow" style="color:var(--lime);"><span class="material-symbols-outlined">account_balance</span> ${t("schemes")}</p>
          <h2 style="margin:0; color:#ffffff; font-family:var(--font-serif); font-size:1.8rem">Indian Government Agricultural Schemes & Subsidies</h2>
          <p style="margin:6px 0 0; color:#d1e8d6; font-size:0.95rem">Direct Benefit Transfers (DBT), crop insurance subsidies, mechanization grants, and subsidized credit for Indian farmers.</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <a href="https://agricoop.nic.in" target="_blank" rel="noopener noreferrer" class="scheme-filter-btn" style="background:rgba(255,255,255,0.15); color:#ffffff; border:1px solid rgba(255,255,255,0.3)">
            <span class="material-symbols-outlined" style="font-size:16px">open_in_new</span> Ministry Portal
          </a>
        </div>
      </div>
    </div>

    <div class="schemes-header">
      <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
        <div class="schemes-filter-bar" id="schemesCategories">
          <button class="scheme-filter-btn active" data-cat="all" onclick="filterSchemesCategory('all')">All Schemes</button>
          <button class="scheme-filter-btn" data-cat="finance" onclick="filterSchemesCategory('finance')"><span class="material-symbols-outlined" style="font-size:16px">payments</span> Cash & Credit</button>
          <button class="scheme-filter-btn" data-cat="insurance" onclick="filterSchemesCategory('insurance')"><span class="material-symbols-outlined" style="font-size:16px">verified_user</span> Crop Insurance</button>
          <button class="scheme-filter-btn" data-cat="equipment" onclick="filterSchemesCategory('equipment')"><span class="material-symbols-outlined" style="font-size:16px">precision_manufacturing</span> Farm Machinery</button>
          <button class="scheme-filter-btn" data-cat="irrigation" onclick="filterSchemesCategory('irrigation')"><span class="material-symbols-outlined" style="font-size:16px">water_drop</span> Micro-Irrigation</button>
          <button class="scheme-filter-btn" data-cat="solar" onclick="filterSchemesCategory('solar')"><span class="material-symbols-outlined" style="font-size:16px">solar_power</span> Solar Pumps</button>
          <button class="scheme-filter-btn" data-cat="soil" onclick="filterSchemesCategory('soil')"><span class="material-symbols-outlined" style="font-size:16px">eco</span> Soil Health</button>
        </div>
        <div style="min-width:240px; flex:1; max-width:360px;">
          <input id="schemeSearchIn" type="search" placeholder="Search by scheme or keyword..." oninput="searchSchemes(this.value)" style="width:100%; border-radius:var(--radius-full); padding:8px 16px; border:1px solid var(--line);" />
        </div>
      </div>
    </div>

    <div id="schemesListContainer" class="schemes-grid">
      <div style="grid-column: 1/-1; text-align:center; padding:40px 0; color:var(--text-muted)">
        <span class="material-symbols-outlined" style="font-size:36px; animation:spin 1s linear infinite">sync</span>
        <p>Loading government schemes & subsidy guidelines...</p>
      </div>
    </div>
  `;
}

async function initSchemesPage() {
  await loadSchemesList();
}

async function filterSchemesCategory(cat) {
  currentSchemeCategory = cat;
  document.querySelectorAll("#schemesCategories .scheme-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === cat);
  });
  await loadSchemesList();
}

let searchDebounceTimer = null;
function searchSchemes(val) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentSchemeSearch = val.trim();
    loadSchemesList();
  }, 300);
}

async function loadSchemesList() {
  const container = document.getElementById("schemesListContainer");
  if (!container) return;

  try {
    const qParam = currentSchemeSearch ? `&q=${encodeURIComponent(currentSchemeSearch)}` : "";
    const catParam = currentSchemeCategory && currentSchemeCategory !== "all" ? `&category=${currentSchemeCategory}` : "";
    const data = await api(`/api/schemes?language=${state.lang}${catParam}${qParam}`);

    if (!data.schemes || !data.schemes.length) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:48px 20px; background:var(--paper); border-radius:var(--radius-lg); border:1px dashed var(--line);">
          <span class="material-symbols-outlined" style="font-size:48px; color:var(--text-muted)">search_off</span>
          <h3 style="margin:12px 0 6px">No Government Schemes Found</h3>
          <p class="muted" style="margin:0">Try changing your category filter or search keywords.</p>
        </div>`;
      return;
    }

    container.innerHTML = data.schemes.map(s => `
      <div class="scheme-card">
        <div>
          <div class="scheme-top">
            <div class="scheme-icon-box">
              <span class="material-symbols-outlined" style="font-size:24px">${s.icon || 'account_balance'}</span>
            </div>
            <div class="scheme-title-box">
              <span class="scheme-ministry">${escapeHtml(s.ministry)}</span>
              <h3>${escapeHtml(s.name)}</h3>
            </div>
          </div>

          <div class="scheme-subsidy-badge">
            <span class="material-symbols-outlined" style="font-size:16px">payments</span>
            <span>${escapeHtml(s.subsidy)}</span>
          </div>

          <p class="scheme-desc">${escapeHtml(s.benefit)}</p>

          <div class="scheme-section">
            <div class="scheme-section-title">
              <span class="material-symbols-outlined" style="font-size:14px">check_circle</span>
              ${t("eligibility")}
            </div>
            <div class="scheme-section-body">${escapeHtml(s.eligibility)}</div>
          </div>

          ${s.documents && s.documents.length ? `
            <div class="scheme-section" style="background:#fff">
              <div class="scheme-section-title">
                <span class="material-symbols-outlined" style="font-size:14px">description</span>
                Required Documents
              </div>
              <div class="scheme-docs-list">
                ${s.documents.map(d => `<span class="scheme-doc-tag">${escapeHtml(d)}</span>`).join("")}
              </div>
            </div>` : ""}
        </div>

        <div class="scheme-actions">
          ${s.helpline ? `
            <a href="tel:${s.helpline.split('/')[0].trim()}" class="scheme-helpline">
              <span class="material-symbols-outlined" style="font-size:16px">call</span>
              <span>${escapeHtml(s.helpline)}</span>
            </a>` : `<span></span>`}
          <a href="${s.portal}" target="_blank" rel="noopener noreferrer" class="scheme-apply-btn">
            <span>${t("applyNow")}</span>
            <span class="material-symbols-outlined" style="font-size:16px">arrow_outward</span>
          </a>
        </div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px 0; color:var(--danger)">
        <p>Failed to load government schemes: ${escapeHtml(err.message)}</p>
        <button class="btn" onclick="loadSchemesList()">Retry</button>
      </div>`;
  }
}

async function dashPage() {
  if (!state.user) return loginPage();
  const isDoc = state.user.role === "doctor";
  const appts = await api("/api/appointments");
  let profileHtml = "";
  if (isDoc) {
    try {
      const p = await api("/api/doctor-profile/me");
      profileHtml = `
        <div class="card" style="margin-top:14px">
          <p class="eyebrow"><span class="material-symbols-outlined">badge</span> ICAR Doctor Credentials</p>
          <h3>Your Clinical Profile</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">
            <div><label>Qualification</label><input id="dpQualification" value="${escapeHtml(p.qualification)}" /></div>
            <div><label>Specialization</label><input id="dpSpecialization" value="${escapeHtml(p.specialization)}" /></div>
            <div><label>Experience (years)</label><input id="dpExperience" type="number" value="${p.experience}" /></div>
            <div><label>Consultation Fee (₹)</label><input id="dpFee" type="number" value="${p.fee}" /></div>
            <div><label>Languages</label><input id="dpLanguages" value="${escapeHtml(p.languages)}" /></div>
            <div><label>Available Days</label><input id="dpDays" value="${escapeHtml(p.days)}" /></div>
            <div><label>Available Slots</label><input id="dpSlots" value="${escapeHtml(p.slots)}" /></div>
          </div>
          <label>Bio & Clinical Experience</label>
          <textarea id="dpBio">${escapeHtml(p.bio)}</textarea>
          <button class="btn" style="margin-top:12px" onclick="saveDoctorProfile()">Save Profile</button>
        </div>`;
    } catch (_) {}
  }
  return `
    <div class="card">
      <p class="eyebrow"><span class="material-symbols-outlined">calendar_month</span> Consultations</p>
      <h3>${isDoc ? "Doctor Patient Sessions" : "My Consultations"}</h3>
      <p class="subtle">${isDoc ? "Accept appointments, provide diagnoses, and prescribe medicines." : "Connect directly with verified agricultural doctors."}</p>
    </div>
    ${profileHtml}
    <div class="card" style="margin-top:16px">
      <h3>Scheduled Sessions</h3>
      ${appts.length ? `
        <table class="table">
          <tr><th>Date & Time</th><th>${isDoc ? "Farmer" : "Doctor"}</th><th>Status</th><th>Actions</th></tr>
          ${appts.map((a) => {
            const other = isDoc ? a.farmer_name || a.farmer_email : a.doctor_name || "Doctor";
            const actions = isDoc && a.status === "pending"
              ? `<button class="btn" onclick="setAppt(${a.id},'confirmed')">Accept</button> <button class="ghost" onclick="setAppt(${a.id},'cancelled')">Decline</button>`
              : a.status === "confirmed"
                ? `<button class="btn" onclick="openRoom(${a.id})"><span class="material-symbols-outlined">video_call</span> Join Call</button>`
                : "";
            const cancelBtn = !isDoc && (a.status === "pending" || a.status === "confirmed")
              ? `<button class="ghost" style="color:var(--danger)" onclick="setAppt(${a.id},'cancelled')">Cancel</button>`
              : "";
            const extra = isDoc && a.status === "confirmed"
              ? `<button class="ghost" onclick="completeAppt(${a.id})">Add Notes</button>`
              : "";
            const reason = a.reason ? `<br><small class="muted">Issue: ${escapeHtml(a.reason)}</small>` : "";
            return `<tr><td><b>${escapeHtml(a.date)}</b><br><small>${escapeHtml(a.start_time)}</small></td><td><b>${escapeHtml(other)}</b>${reason}</td><td><span class="badge ${a.status === "confirmed" ? "ok" : a.status === "cancelled" ? "high" : "med"}">${escapeHtml(a.status)}</span></td><td>${actions} ${cancelBtn} ${extra}</td></tr>`;
          }).join("")}
        </table>` : `<p class="muted">No consultation sessions booked yet.</p>`}
    </div>
    <div id="room" style="margin-top:20px"></div>
  `;
}

async function saveDoctorProfile() {
  try {
    await api("/api/doctor-profile/me", {
      method: "PUT",
      body: formBody({
        qualification: document.getElementById("dpQualification").value.trim(),
        specialization: document.getElementById("dpSpecialization").value.trim(),
        experience: document.getElementById("dpExperience").value,
        fee: document.getElementById("dpFee").value,
        languages: document.getElementById("dpLanguages").value.trim(),
        days: document.getElementById("dpDays").value.trim(),
        slots: document.getElementById("dpSlots").value.trim(),
        bio: document.getElementById("dpBio").value.trim(),
      }),
    });
    alert("Doctor profile saved successfully.");
    render();
  } catch (e) {
    alert("Failed to save profile: " + e.message);
  }
}

async function setAppt(id, status) {
  try {
    await api(`/api/appointments/${id}/status`, { method: "PATCH", body: formBody({ status }) });
    render();
  } catch (e) {
    alert("Could not update appointment: " + e.message);
  }
}

async function completeAppt(id) {
  const diagnosis = prompt("Observed Disease / Diagnosis:");
  if (diagnosis === null) return;
  const advice = prompt("Treatment Advice & Medicines:");
  if (advice === null) return;
  try {
    await api(`/api/appointments/${id}/notes`, { method: "POST", body: formBody({ diagnosis: diagnosis.trim(), advice: advice.trim() }) });
    await setAppt(id, "completed");
  } catch (e) {
    alert("Could not complete appointment: " + e.message);
  }
}

async function openRoom(id) {
  if (window._roomTimer) clearTimeout(window._roomTimer);
  window._room = id;
  try {
    const notes = await api(`/api/appointments/${id}/notes`);
    const roomEl = document.getElementById("room");
    if (!roomEl) return;
    roomEl.innerHTML = `
      <div class="tele-room-container">
        <div class="tele-status-bar">
          <div class="tele-rec-badge"><span class="tele-rec-dot"></span><span>LIVE SESSION #0${id}</span></div>
          <div><span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;color:var(--leaf)">signal_cellular_alt</span> HD 4G · KVK Agronomy Center</div>
          <div><span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;color:var(--gold)">translate</span> AI Audio Sync (98%)</div>
        </div>
        <div class="tele-stage">
          <img class="tele-doctor-video" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkY3Zn_KTFVE1gbMq8OMU-Oqbweb6ymkkTqUxVl2xrHEGIrIfDsAJjYuRwrIU_aUkykwMJFPSmWpVUt5Iij2v0D9_aYoc2BApMj_YUrDtHDOC0tNG1lP0ylKotNzM6s3luh_IGY8hg29p_sQdTYjbgj7V6MBcq6xSEshKhp4plU391ovhgaWN5WPdeckOQTUvUMExBVK-EQ0GjAdNqbHHd7y65gOWbMg8hoR2uOrp33mAQfYHN3o9DoA" alt="Doctor Video Stream" />
          <div class="tele-overlay-top">
            <div class="tele-doctor-badge">
              <span class="material-symbols-outlined" style="color:var(--lime)">verified</span>
              <div><b>Dr. Ananya Patil</b><br><small style="opacity:0.85">M.Sc. Plant Pathology · ICAR KVK</small></div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;background:rgba(0,0,0,0.6);padding:6px 12px;border-radius:20px;color:#fff">
              <span class="online-dot" style="background:#ff4d4d"></span><span style="font-size:0.75rem;font-weight:700" id="callDuration">04:18</span>
            </div>
          </div>
          <div class="tele-pip">
            <img src="https://lh3.googleusercontent.com/aida/AEtjO1UiVFd0bJKh8OhCfH_sEuS_HvOpLSVw-dtf-TbFaND6oeQGJPd2HEDejOeg3k-kbdwwokfuvW0TO7HaPSCPjEgXLJ62awsvwaIkCnkZrc3Eri5mp8IwZGaFD14bSSYVLggN9a2mf5OLsuJ6s3jIQxzKWROJEXj6G7tfTd7grv7dmeutoY0Dy8vfr4IstZM_UwGQVcq7WXxmeQhMaRiAefZ0JM73UvQAC7KYpBG8nbdTemuvLk4B1u7bWyE" alt="Farmer Field Leaf" />
            <div style="position:absolute;top:4px;left:4px;background:rgba(0,0,0,0.6);color:#fff;padding:2px 6px;border-radius:4px;font-size:9px">Field 4A</div>
          </div>
        </div>
        <div class="tele-controls">
          <button class="tele-control-btn" type="button" title="Mute/Unmute Mic" onclick="this.classList.toggle('end')"><span class="material-symbols-outlined">mic</span></button>
          <button class="tele-control-btn" type="button" title="Flip Camera"><span class="material-symbols-outlined">flip_camera_ios</span></button>
          <button class="tele-control-btn end" type="button" title="End Consultation" onclick="document.getElementById('room').innerHTML=''"><span class="material-symbols-outlined">call_end</span></button>
        </div>
        <div class="card" style="margin-top:8px">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <h4 style="margin:0"><span class="material-symbols-outlined" style="vertical-align:middle;color:var(--leaf)">prescriptions</span> Agronomist Clinical Notes</h4>
            <span class="badge ok">Verified Advice</span>
          </div>
          ${notes.length ? notes.map((n) => `<p style="margin:8px 0"><b>Diagnosis:</b> ${escapeHtml(n.diagnosis)}<br><b>Treatment Advice:</b> ${escapeHtml(n.advice)}</p>`).join("") : `<p class="muted" style="margin:8px 0 0">Doctor is examining your leaf sample. Clinical recommendations will stream here.</p>`}
        </div>
        <div class="chatbox" style="margin-top:8px">
          <p class="muted" style="margin:0 0 8px;font-size:0.8rem">Consultation Chat #${id} · Text & Voice Input</p>
          <div class="msgs" id="rms"></div>
          <div class="row">
            <input id="rmIn" style="flex:1" placeholder="Type a message to Dr. Patil..." onkeydown="if(event.key==='Enter')roomSend()" />
            <button class="voice" type="button" onclick="roomListen()">🎤</button>
            <button class="btn" type="button" onclick="roomSend()">Send</button>
          </div>
        </div>
      </div>`;
    await pollRoom();
  } catch (e) {
    alert("Could not open consultation room: " + e.message);
  }
}

async function pollRoom() {
  const box = document.getElementById("rms");
  if (!box || !window._room) {
    window._room = null;
    return;
  }
  try {
    const msgs = await api(`/api/appointments/${window._room}/messages`);
    if (document.getElementById("rms")) {
      box.innerHTML = msgs
        .map((m) => `<div class="bubble ${m.sender_id === state.user.id ? "me" : "bot"}">${escapeHtml(m.message)}</div>`)
        .join("");
      box.scrollTop = box.scrollHeight;
    }
  } catch (_) {}
  if (window._room && document.getElementById("rms")) {
    clearTimeout(window._roomTimer);
    window._roomTimer = setTimeout(pollRoom, 2500);
  }
}

async function roomSend(text) {
  const input = document.getElementById("rmIn");
  const v = text || (input && input.value.trim());
  if (!v || !window._room) return;
  if (input) input.value = "";
  try {
    await api(`/api/appointments/${window._room}/messages`, { method: "POST", body: formBody({ message: v }) });
    await pollRoom();
  } catch (e) {
    alert("Could not send message: " + e.message);
  }
}

function roomListen() {
  listen((txt) => roomSend(txt));
}

function loginPage() {
  return `
    <div class="card" style="max-width:440px;margin:30px auto;box-shadow:var(--shadow-xl)">
      <div style="text-align:center;margin-bottom:16px">
        <span class="brand-mark material-symbols-outlined" style="margin:0 auto 10px;width:48px;height:48px;font-size:28px">eco</span>
        <h2 style="font-family:var(--font-serif);margin:0;color:var(--moss)">Welcome to AgriShield</h2>
        <p class="subtle" style="margin:4px 0 0">Smart Agriculture & Crop Doctor Platform</p>
      </div>
      <label>Email Address</label>
      <input id="em" type="email" autocomplete="email" placeholder="farmer@agrishield.in" />
      <label>Password</label>
      <input id="pw" type="password" autocomplete="current-password" placeholder="••••••••" />
      <label>Account Type (Registering)</label>
      <select id="role" class="field"><option value="farmer">Farmer</option><option value="doctor">Agricultural Scientist / Doctor</option></select>
      <label>Full Name (Registering)</label>
      <input id="nm" autocomplete="name" placeholder="e.g. Ramesh Patil" />
      <div class="row" style="margin-top:16px">
        <button class="btn" style="flex:1" onclick="doLogin()">Sign In</button>
        <button class="ghost" style="flex:1" onclick="doRegister()">Register</button>
      </div>
      <div style="margin:16px 0 10px;padding:12px;border-radius:var(--radius-md);background:var(--surface-low);border:1px solid var(--line)">
        <small class="eyebrow">Instant Demo Access</small>
        <div class="row" style="margin-top:6px">
          <button class="ghost" style="flex:1" onclick="demoLogin('farmer')">Demo Farmer</button>
          <button class="ghost" style="flex:1" onclick="demoLogin('doctor')">Demo Doctor</button>
        </div>
      </div>
      <p id="loginOut" class="muted" style="text-align:center;margin:8px 0 0" role="status"></p>
    </div>
  `;
}

async function doLogin() {
  const output = document.getElementById("loginOut");
  const email = document.getElementById("em").value.trim();
  const password = document.getElementById("pw").value;
  if (!email || !password) {
    if (output) output.textContent = "Please enter your email and password.";
    return;
  }
  if (output) output.textContent = "Signing in...";
  try {
    const data = await api("/api/auth/login", { method: "POST", body: formBody({ email, password }) });
    setUser(data.token, data.user);
    location.hash = data.user.role === "doctor" ? "dash" : "farm-dashboard";
  } catch (e) {
    if (output) output.textContent = e.message === "auth" ? "Email or password is incorrect." : `Login failed: ${e.message}`;
  }
}

async function doRegister() {
  const output = document.getElementById("loginOut");
  const name = document.getElementById("nm").value.trim();
  const email = document.getElementById("em").value.trim();
  const password = document.getElementById("pw").value;
  const role = document.getElementById("role").value;
  if (!name) { if (output) output.textContent = "Enter your full name to register."; return; }
  if (!email.includes("@")) { if (output) output.textContent = "Enter a valid email address."; return; }
  if (password.length < 8) { if (output) output.textContent = "Password must be at least 8 characters."; return; }
  if (output) output.textContent = "Creating account...";
  try {
    const data = await api("/api/auth/register", { method: "POST", body: formBody({ name, email, password, role, language: state.lang }) });
    setUser(data.token, data.user);
    location.hash = data.user.role === "doctor" ? "dash" : "farm-dashboard";
  } catch (e) {
    if (output) output.textContent = `Registration failed: ${e.message}`;
  }
}

async function demoLogin(kind) {
  const output = document.getElementById("loginOut");
  const email = kind === "doctor" ? "ananya.patil@agrishield.in" : "farmer@agrishield.in";
  const password = kind === "doctor" ? "Doctor@123" : "Farmer@123";
  if (output) output.textContent = `Signing in as demo ${kind}...`;
  try {
    const data = await api("/api/auth/login", { method: "POST", body: formBody({ email, password }) });
    setUser(data.token, data.user);
    location.hash = data.user.role === "doctor" ? "dash" : "farm-dashboard";
  } catch (e) {
    if (output) output.textContent = `Demo login failed: ${e.message}`;
  }
}

async function resetAgriShieldApp() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  Object.keys(localStorage).filter((k) => k.startsWith("agrishield-cache:")).forEach((k) => localStorage.removeItem(k));
  if ("caches" in window) await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }
  location.replace(`${location.origin}/#login`);
}

async function render() {
  state.page = location.hash.replace("#", "") || "home";
  if (!state.user && state.page !== "login" && state.page !== "home") {
    location.hash = "login";
    return;
  }
  if (state.user && (state.page === "home" || state.page === "login")) {
    location.hash = state.user.role === "doctor" ? "dash" : "farm-dashboard";
    return;
  }
  nav();
  const app = document.getElementById("app");
  const pages = {
    home: home,
    "farm-dashboard": smartFarmDashboardPage,
    outbreaks: outbreaksPage,
    "community-map": communityMapPage,
    "weather-risk": weatherRiskPage,
    detect: scannerPage,
    doctors: doctorsPage,
    chat: chatPage,
    shop: shopPage,
    seeds: seedsPage,
    orders: ordersPage,
    plants: plantsPage,
    risk: riskPage,
    symptoms: symptomsPage,
    advisor: advisorPage,
    "farm-tools": farmToolsPage,
    schemes: schemesPage,
    "data-catalog": dataCatalogPage,
    algorithms: algorithmsPage,
    feedback: feedbackPage,
    dash: dashPage,
    login: loginPage,
  };
  const fn = pages[state.page] || home;
  try {
    app.innerHTML = await fn();
    app.classList.remove("page-enter");
    requestAnimationFrame(() => app.classList.add("page-enter"));
    if (state.page === "detect") fillCrops();
    if (state.page === "chat") bindMic();
    if (state.page === "community-map") initCommunityMap();
    if (state.page === "weather-risk") initWeatherRisk();
    if (state.page === "schemes") initSchemesPage();
  } catch (e) {
    app.innerHTML = `<div class="card"><h3>Unable to load screen</h3><p class="muted">${escapeHtml(e.message)}</p><a class="btn" href="#farm-dashboard">Go to Dashboard</a></div>`;
  }
}

document.getElementById("lang").addEventListener("change", (e) => {
  state.lang = e.target.value;
  localStorage.setItem("lang", state.lang);
  render();
});

document.getElementById("authBtn").onclick = () => {
  if (state.user) {
    setUser("", null);
    location.hash = "home";
  } else {
    location.hash = "login";
  }
};

document.getElementById("bellBtn").onclick = async () => {
  const box = document.getElementById("alerts");
  if (!state.user) return;
  box.hidden = !box.hidden;
  if (!box.hidden) {
    try {
      const rows = await api("/api/notifications");
      box.innerHTML = `<h4>Field Alerts</h4>` + (rows.map((n) => `<p class="subtle" style="margin:6px 0;border-bottom:1px solid #edf1ea;padding-bottom:4px">${escapeHtml(n.text)}</p>`).join("") || "<p class=\"muted\">No active alerts for your field.</p>");
    } catch (_) {
      box.innerHTML = `<h4>Field Alerts</h4><p class="muted">No alerts at this moment.</p>`;
    }
  }
};

window.addEventListener("hashchange", render);
window.addEventListener("online", updateConnectivity);
window.addEventListener("offline", updateConnectivity);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js", { scope: "/" }));
}

let deferredPWAInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPWAInstallPrompt = e;
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.style.display = "inline-flex";
});

async function installPWA() {
  if (!deferredPWAInstallPrompt) {
    alert("To install AgriShield on your device:\n\n1. In Chrome/Edge: tap the 3 dots menu\n2. Select 'Install app' or 'Add to Home Screen'");
    return;
  }
  deferredPWAInstallPrompt.prompt();
  const choice = await deferredPWAInstallPrompt.userChoice;
  if (choice.outcome === "accepted") {
    const btn = document.getElementById("installAppBtn");
    if (btn) btn.style.display = "none";
  }
  deferredPWAInstallPrompt = null;
}

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.style.display = "none";
  deferredPWAInstallPrompt = null;
});

updateConnectivity();
render();
