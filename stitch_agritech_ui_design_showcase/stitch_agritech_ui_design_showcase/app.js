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
    ["data-catalog", t("dataCatalog")],
    ["algorithms", t("algorithms")],
    ["feedback", t("feedback")],
  ];
  const doctor = [
    ["dash", t("dash")],
    ["chat", t("chat")],
    ["algorithms", t("algorithms")],
    ["feedback", t("feedback")],
  ];
  const links = state.user && state.user.role === "doctor" ? doctor : farmer;
  document.getElementById("nav").innerHTML = links
    .map(([id, label]) => `<a href="#${id}" class="${state.page === id ? "active" : ""}">${label}</a>`)
    .join("");
  document.getElementById("authBtn").textContent = state.user ? t("logout") : t("login");
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
    alert("Voice input needs Chrome/Edge.");
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
    <section class="hero">
      <div>
        <h1>${t("heroTitle")}</h1>
        <p>${t("heroBody")}</p>
        <div class="pills">
          <span class="pill">CNN-style leaf analysis</span>
          <span class="pill">Random Forest risk</span>
          <span class="pill">Doctor booking</span>
          <span class="pill">Medicine orders</span>
          <span class="pill">EN · HI · TA · MR</span>
        </div>
        <div class="row" style="margin-top:18px">
          <a class="btn" href="#detect">${t("detect")}</a>
          <a class="ghost" href="#doctors">${t("doctors")}</a>
        </div>
      </div>
      <div class="hero-card">
        <h3>Demo login</h3>
        <p class="muted">Farmer: farmer@agrishield.in / Farmer@123<br/>Doctor: ananya.patil@agrishield.in / Doctor@123</p>
        <div class="row" style="margin-top:10px">
          <button class="btn" onclick="demoLogin('farmer')">${t("demoFarmer")}</button>
          <button class="ghost" onclick="demoLogin('doctor')">${t("demoDoctor")}</button>
        </div>
      </div>
    </section>
    <div class="grid">
      <div class="card"><h3>1. Detect</h3><p class="muted">Upload a leaf. Get disease class, confidence and next action.</p></div>
      <div class="card"><h3>2. Medicines</h3><p class="muted">Matched agri-inputs with organic-first options.</p></div>
      <div class="card"><h3>3. Order</h3><p class="muted">Cart, village address, tracked order status.</p></div>
      <div class="card"><h3>4. Consult</h3><p class="muted">Book a plant doctor, then text/voice chat after acceptance.</p></div>
    </div>
  `;
}

async function farmerDashboardPage() {
  if (!state.user) return loginPage();
  if (state.user.role !== "farmer") return dashPage();
  const data = await api("/api/dashboard");
  const scanRows = data.recent_scans.length ? data.recent_scans.map((scan) => `<tr><td>${escapeHtml(scan.crop)}</td><td>${escapeHtml(scan.disease_key.replaceAll("_", " "))}</td><td>${Math.round(scan.confidence * 100)}%</td><td><span class="badge ${scan.risk === "High" ? "high" : scan.risk === "Medium" ? "med" : ""}">${escapeHtml(scan.risk)}</span></td></tr>`).join("") : "<tr><td colspan=\"4\">No scans yet. Upload a leaf photo to start your history.</td></tr>";
  return `<section class="hero"><div><h1>My farm dashboard</h1><p>See your recent plant-health scans, consultation activity, and orders in one place.</p><div class="row"><a class="btn" href="#detect">Analyse a leaf</a><a class="ghost" href="#farm-tools">Farm tools</a></div></div><div class="hero-card"><h3>Your farm</h3><p>${data.counts.plants} plants · ${data.counts.scans} scans<br>${data.counts.appointments} appointments · ${data.counts.orders} orders</p></div></section><div class="grid"><section class="card"><h3>Latest leaf scans</h3><table class="table"><tr><th>Crop</th><th>Indication</th><th>Confidence</th><th>Risk</th></tr>${scanRows}</table></section><section class="card"><h3>Appointments</h3>${data.appointments.length ? data.appointments.map((a) => `<p><b>${escapeHtml(a.date)} ${escapeHtml(a.time)}</b><br>${escapeHtml(a.doctor)} · <span class="badge">${escapeHtml(a.status)}</span></p>`).join("") : "<p class=\"muted\">No appointments yet.</p>"}</section><section class="card"><h3>Recent orders</h3>${data.orders.length ? data.orders.map((order) => `<p>Order #${order.id} · ₹${order.total} · <span class="badge">${escapeHtml(order.status)}</span></p>`).join("") : "<p class=\"muted\">No orders yet.</p>"}</section></div>`;
}

function detectPage() {
  return `
    <div class="card">
      <h3>${t("detect")}</h3>
      <p class="muted">${t("heroBody")} For the trained CNN, choose rice; other crops use the advisory fallback.</p>
      <label>Crop</label>
      <select id="crop" class="field"></select>
      <label>${t("upload")}</label>
      <input type="file" id="leaf" accept="image/*" capture="environment" />
      <div class="row" style="margin-top:10px"><button class="ghost" onclick="startCamera()">Open camera</button><button class="ghost" onclick="captureCameraPhoto()">Take photo</button><button class="ghost" onclick="stopCamera()">Close camera</button></div>
      <video id="cameraPreview" class="preview" autoplay playsinline hidden></video>
      <label>Or choose a short leaf video</label><input type="file" id="leafVideo" accept="video/*" />
      <button class="ghost" onclick="analyzeVideoFrame()">Analyse middle video frame</button>
      <img id="prev" class="preview" hidden />
      <div class="row" style="margin-top:12px">
        <button class="btn" onclick="runDetect()">${t("analyze")}</button>
      </div>
      <div id="detectOut"></div>
    </div>
  `;
}

async function runDetect(fileOverride) {
  const file = fileOverride || document.getElementById("leaf").files[0];
  if (!file) return alert("Choose an image");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("crop", document.getElementById("crop").value);
  const data = await api("/api/predict", { method: "POST", body: fd });
  const meds = data.medicines || [];
  const low = data.action === "low_confidence";
  document.getElementById("detectOut").innerHTML = `
    <div class="card" style="margin-top:14px">
      <h3>${pick(data.name)}</h3>
      <p>Confidence: <b>${Math.round(data.confidence * 100)}%</b>
        · Risk: <span class="badge ${data.risk === "High" ? "high" : data.risk === "Medium" ? "med" : ""}">${data.risk}</span>
      </p>
      ${data.model_label ? `<p><b>CNN class:</b> ${escapeHtml(data.model_label)}</p>` : ""}
      ${data.model ? `<p class="muted"><b>Model:</b> ${escapeHtml(data.model.name)}${data.model.note ? ` - ${escapeHtml(data.model.note)}` : ""}</p>` : ""}
      ${data.severity ? `<p><b>Visual severity:</b> <span class="badge ${data.severity.label === "High" ? "high" : data.severity.label === "Moderate" ? "med" : ""}">${escapeHtml(data.severity.label)}</span> - estimated affected area ${escapeHtml(data.severity.affected_area_percent)}%<br><span class="muted">${escapeHtml(data.severity.basis)}</span></p>` : ""}
      <p>${pick(data.advice)}</p>
      <p class="muted">${pick(data.disclaimer)}</p>
      ${low ? `<p><b>Low confidence.</b> Please book a plant doctor.</p>` : ""}
      <div class="row">
        ${meds.map((id) => `<button class="btn" onclick="addCart('${id}')">${t("cart")}: ${id}</button>`).join("")}
        <a class="ghost" href="#doctors">${t("book")}</a>
      </div>
    </div>`;
  speak(`${pick(data.name)}. ${pick(data.advice)}`);
}

async function startCamera() {
  const preview = document.getElementById("cameraPreview");
  if (!navigator.mediaDevices?.getUserMedia) return alert("Camera access is not supported by this browser.");
  try { window._cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }); preview.srcObject = window._cameraStream; preview.hidden = false; }
  catch (e) { alert("Camera permission is needed: " + e.message); }
}
function stopCamera() { if (window._cameraStream) window._cameraStream.getTracks().forEach((track) => track.stop()); window._cameraStream = null; const preview = document.getElementById("cameraPreview"); if (preview) { preview.srcObject = null; preview.hidden = true; } }
function captureCameraPhoto() { const video = document.getElementById("cameraPreview"); if (!video?.srcObject || !video.videoWidth) return alert("Open the camera first, then take a photo."); const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (blob) { stopCamera(); runDetect(new File([blob], "camera-leaf.jpg", { type: "image/jpeg" })); } }, "image/jpeg", 0.9); }
function analyzeVideoFrame() { const file = document.getElementById("leafVideo").files[0]; if (!file) return alert("Choose a short leaf video first."); const video = document.createElement("video"); video.muted = true; video.src = URL.createObjectURL(file); video.onloadedmetadata = () => { video.currentTime = Math.min(video.duration / 2, Math.max(0, video.duration - 0.1)); }; video.onseeked = () => { const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { URL.revokeObjectURL(video.src); if (blob) runDetect(new File([blob], "video-leaf-frame.jpg", { type: "image/jpeg" })); }, "image/jpeg", 0.9); }; }

async function fillCrops() {
  const crops = await api("/api/crops");
  const el = document.getElementById("crop");
  if (el) el.innerHTML = crops.map((c) => `<option>${c}</option>`).join("");
  const leaf = document.getElementById("leaf");
  if (leaf)
    leaf.onchange = () => {
      const f = leaf.files[0];
      if (!f) return;
      const img = document.getElementById("prev");
      img.src = URL.createObjectURL(f);
      img.hidden = false;
    };
}

async function doctorsPage() {
  const docs = await api("/api/doctors");
  return `
    <div class="card"><h3>${t("doctors")}</h3>
    <input id="dq" placeholder="Search specialization" oninput="filterDocs()" /></div>
    <div class="grid" id="docGrid">
      ${docs
        .map(
          (d) => `
        <div class="card doc" data-blob="${(d.name + d.specialization).toLowerCase()}">
          <h3>${d.name}</h3>
          <p class="muted">${d.qualification} · ${d.experience} yrs</p>
          <p>${d.specialization}</p>
          <p class="muted">${d.bio}</p>
          <p>₹${d.fee} · ${d.languages}</p>
          <label>Date</label>
          <input type="date" id="date-${d.id}" min="${new Date().toISOString().slice(0, 10)}" onchange="loadSlots(${d.id})" />
          <label>Time</label>
          <select class="field" id="slot-${d.id}"><option value="">Choose a date first</option></select>
          <label>Reason</label>
          <input id="why-${d.id}" placeholder="Leaf spots / pest…" />
          <button class="btn" style="margin-top:8px" onclick="bookDoc(${d.id})">${t("book")}</button>
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
  if (!date || !startTime) return alert("Choose an available date and time.");
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
    alert("Request sent. Wait for doctor acceptance.");
    location.hash = "dash";
  } catch (e) {
    alert(e.message);
  }
}

function chatPage() {
  return `
    <div class="chatbox">
      <div class="msgs" id="msgs">
        <div class="bubble bot">${t("placeholder")}</div>
      </div>
      <div class="row">
        <input id="chatIn" placeholder="${t("placeholder")}" style="flex:1" />
        <button class="voice" id="mic">${t("speak")[0] || "🎤"}</button>
        <button class="btn" onclick="sendChat()">${t("send")}</button>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="ghost" id="voiceConversationBtn" onclick="toggleVoiceConversation()">Start voice conversation</button>
        <span class="muted">Speak, hear the answer, then continue hands-free. Headphones help avoid feedback.</span>
      </div>
    </div>`;
}

async function sendChat(preset, continueVoice = false) {
  const input = document.getElementById("chatIn");
  const text = preset || (input && input.value);
  if (!text) return;
  if (input) input.value = "";
  const box = document.getElementById("msgs");
  box.innerHTML += `<div class="bubble me">${escapeHtml(text)}</div>`;
  try {
    const data = await api("/api/chat", { method: "POST", body: formBody({ message: text, language: state.lang }) });
    box.innerHTML += `<div class="bubble bot">${escapeHtml(data.answer)}</div>`;
    box.scrollTop = box.scrollHeight;
    if (continueVoice && state.voiceConversation && window.speechSynthesis) {
      const reply = new SpeechSynthesisUtterance(data.answer);
      reply.lang = LANG_CODE[state.lang] || "en-IN";
      reply.onend = () => setTimeout(startVoiceTurn, 250);
      speechSynthesis.cancel();
      speechSynthesis.speak(reply);
    } else speak(data.answer);
  } catch (e) {
    box.innerHTML += `<div class="bubble bot">${escapeHtml(e.message)}</div>`;
  }
}

function startVoiceTurn() {
  if (!state.voiceConversation) return;
  const mic = document.getElementById("mic");
  if (mic) mic.classList.add("live");
  const recognition = listen((txt) => {
    if (mic) mic.classList.remove("live");
    sendChat(txt, true);
  });
  if (recognition) recognition.onerror = () => { if (mic) mic.classList.remove("live"); };
}

function toggleVoiceConversation() {
  state.voiceConversation = !state.voiceConversation;
  const button = document.getElementById("voiceConversationBtn");
  if (button) button.textContent = state.voiceConversation ? "Stop voice conversation" : "Start voice conversation";
  if (state.voiceConversation) startVoiceTurn();
  else speechSynthesis.cancel();
}

function bindMic() {
  const mic = document.getElementById("mic");
  if (!mic) return;
  mic.onclick = () => {
    mic.classList.add("live");
    listen((txt) => {
      mic.classList.remove("live");
      document.getElementById("chatIn").value = txt;
      sendChat(txt);
    });
  };
}

async function cartPanel() {
  if (!state.user) return "";
  const cart = await api("/api/cart");
  return `<div class="card"><h3>Cart · ₹${cart.total}</h3>${cart.items.length ? cart.items.map((i) => `<p>${pick(i.name)} × ${i.qty} — ₹${i.line} <button class="ghost" onclick="delCart(${i.id})">✕</button></p>`).join("") : "<p class=\"muted\">Your cart is empty.</p>"}<label>Address</label><textarea id="addr"></textarea><label>Phone</label><input id="ph" /><button class="btn" onclick="checkout()">${t("checkout")}</button></div>`;
}

async function marketPage(type) {
  const isSeeds = type === "seeds";
  const products = await api(isSeeds ? "/api/seeds" : "/api/medicines");
  const cards = Object.entries(products).map(([id, product]) => `<div class="card"><h3>${pick(product.name)}</h3><p class="muted">${escapeHtml(product.kind)} · ${escapeHtml(product.unit)}${product.crop ? ` · ${escapeHtml(product.crop)}` : ""}</p><p>${pick(product.use)}</p><p class="price">₹${product.price}</p><button class="btn" onclick="addCart('${id}')">${t("cart")}</button></div>`).join("");
  return `<div class="card"><h3>${isSeeds ? "Seeds marketplace" : "Agri-input marketplace"}</h3><p class="muted">${isSeeds ? "Choose seed varieties only after checking local season and district recommendations." : "Organic-first and targeted agri-input options."}</p></div><div class="grid">${cards}</div>${await cartPanel()}`;
}

async function shopPage() { return marketPage("medicines"); }
async function seedsPage() { return marketPage("seeds"); }
async function addCart(id) {
  if (!state.user) return alert(t("needLogin"));
  await api("/api/cart", { method: "POST", body: formBody({ medicine_id: id, qty: 1 }) });
  alert("Added");
  if (state.page === "shop" || state.page === "seeds") render();
}

async function delCart(id) {
  await fetch("/api/cart/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + state.token } });
  render();
}

async function checkout() {
  await api("/api/orders", {
    method: "POST",
    body: formBody({ address: document.getElementById("addr").value, phone: document.getElementById("ph").value }),
  });
  alert("Order placed");
  location.hash = "orders";
}

async function ordersPage() {
  if (!state.user) return `<div class="card">${t("needLogin")}</div>`;
  const rows = await api("/api/orders");
  return `<div class="card"><h3>${t("orders")}</h3>
    <table class="table"><tr><th>ID</th><th>Total</th><th>Status</th><th>Items</th></tr>
    ${rows
      .map(
        (o) =>
          `<tr><td>#${o.id}</td><td>₹${o.total}</td><td><span class="badge">${o.status}</span></td><td>${o.items
            .map((i) => pick(i.name) + "×" + i.qty)
            .join(", ")}</td></tr>`
      )
      .join("")}
    </table></div>`;
}

async function plantsPage() {
  if (!state.user) return `<div class="card">${t("needLogin")}</div>`;
  const rows = await api("/api/plants");
  return `
    <div class="card">
      <h3>${t("plants")}</h3>
      <label>Name</label><input id="pn" />
      <label>Crop</label><input id="pc" value="tomato" />
      <label>Location</label><input id="pl" />
      <label>Notes</label><input id="pnotes" />
      <label>Leaf photo (optional)</label><input id="pimage" type="file" accept="image/*" />
      <button class="btn" onclick="savePlant()">Save</button>
    </div>
    <div class="grid">${rows.map((p) => `<div class="card"><h3>${escapeHtml(p.plant_name)}</h3><p>${escapeHtml(p.crop_type)} · ${escapeHtml(p.location)}</p><p class="muted">${escapeHtml(p.notes)}</p>${p.has_image ? '<p class="muted">Leaf photo saved securely.</p>' : ""}</div>`).join("")}</div>`;
}

async function savePlant() {
  await api("/api/plants", {
    method: "POST",
    body: formBody({
      plant_name: document.getElementById("pn").value,
      crop_type: document.getElementById("pc").value,
      location: document.getElementById("pl").value,
      notes: document.getElementById("pnotes").value,
      image: document.getElementById("pimage").files[0],
    }),
  });
  render();
}

function symptomsPage() {
  return `<div class="card">
    <h3>Symptom check — no image needed</h3>
    <p class="muted">Describe what you can see. This gives a possible risk only; a clear leaf photo remains more reliable.</p>
    <label>Crop</label><input id="scCrop" placeholder="e.g. rice, tomato" value="rice" />
    <label>Visible symptoms</label><textarea id="scSymptoms" placeholder="e.g. Brown circular spots and yellow edges on older leaves"></textarea>
    <button class="voice" onclick="symptomListen()" title="Speak symptoms">🎤</button><button class="btn" onclick="runSymptomCheck()">Check symptoms</button>
    <a class="ghost" style="margin-left:8px" href="#detect">Use leaf photo instead</a>
    <div id="symptomOut" style="margin-top:12px"></div>
  </div>`;
}

function symptomListen() {
  const field = document.getElementById("scSymptoms");
  listen((text) => { field.value = text; field.focus(); });
}

async function runSymptomCheck() {
  const output = document.getElementById("symptomOut");
  try {
    const data = await api("/api/symptom-check", { method: "POST", body: formBody({ crop: document.getElementById("scCrop").value.trim(), symptoms: document.getElementById("scSymptoms").value.trim() }) });
    output.innerHTML = `<div class="card"><p><b>Possible match:</b> ${escapeHtml(data.match)}</p><p><b>Confidence:</b> ${escapeHtml(data.confidence)}</p><p>${escapeHtml(data.advice)}</p><p class="muted">${escapeHtml(data.disclaimer)}</p></div>`;
    speak("Possible match: " + data.match + ". " + data.disclaimer);
  } catch (e) { output.textContent = e.message; }
}

function feedbackPage() {
  return `<div class="card" style="max-width:680px"><h3>Feedback</h3><p class="muted">Tell us what works well or needs improvement. Do not include passwords or private medical information.</p><label>Rating</label><select id="fbRating" class="field"><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Okay</option><option value="2">2 - Needs improvement</option><option value="1">1 - Poor</option></select><label>Area</label><select id="fbCategory" class="field"><option value="general">General</option><option value="disease_detection">Disease detection</option><option value="doctor_service">Doctor service</option><option value="shop">Shop and seeds</option><option value="app">App experience</option></select><label>Your feedback</label><textarea id="fbMessage" placeholder="Write at least 5 characters"></textarea><button class="btn" style="margin-top:12px" onclick="sendFeedback()">Send feedback</button><div id="feedbackOut" class="muted"></div></div>`;
}

async function sendFeedback() {
  const output = document.getElementById("feedbackOut");
  try {
    const data = await api("/api/feedback", { method: "POST", body: formBody({ rating: document.getElementById("fbRating").value, category: document.getElementById("fbCategory").value, message: document.getElementById("fbMessage").value.trim() }) });
    output.textContent = data.message;
    document.getElementById("fbMessage").value = "";
  } catch (e) { output.textContent = e.message; }
}

async function algorithmsPage() {
  const status = await api("/api/model-status");
  const cnn = status.cnn;
  return `<div class="card"><h3>Algorithms used in AgriShield</h3><p><b>MobileNetV2 CNN:</b> rice leaf classification for ${cnn.classes.map(escapeHtml).join(", ")}. Status: <span class="badge ${cnn.loaded ? "" : "med"}">${cnn.loaded ? "loaded" : "not loaded"}</span></p><p><b>Visual feature fallback:</b> green, yellow, brown, dark and texture cues for other crops or when the rice CNN is unavailable.</p><p><b>Random Forest:</b> Low / Medium / High environmental disease risk from crop, month, rainfall, temperature, humidity and past outbreak.</p><p><b>Rule-based tools:</b> symptom matching, soil health, crop suitability, yield estimate, irrigation, fertilizer gap and sowing-plan calculations.</p><p><b>YOLO:</b> ${status.yolo.active ? "active" : escapeHtml(status.yolo.reason)}</p><p class="muted">All outputs are agricultural decision support, not a confirmed laboratory diagnosis.</p></div>`;
}

function riskPage() {
  return `<div class="card">
    <h3>${t("risk")}</h3>
    <label>Crop</label><input id="rc" value="rice" />
    <label>Month (1-12)</label><input id="rm" type="number" value="7" />
    <label>Rainfall mm</label><input id="rr" type="number" value="160" />
    <label>Temp °C</label><input id="rt" type="number" value="29" />
    <label>Humidity %</label><input id="rh" type="number" value="82" />
    <label>Previous outbreak (0/1)</label><input id="ro" type="number" value="0" />
    <button class="btn" onclick="runRisk()">Estimate</button>
    <div id="riskOut"></div>
  </div>`;
}

async function runRisk() {
  const data = await api("/api/risk", {
    method: "POST",
    body: formBody({
      crop: document.getElementById("rc").value,
      month: document.getElementById("rm").value,
      rain: document.getElementById("rr").value,
      temp: document.getElementById("rt").value,
      humidity: document.getElementById("rh").value,
      outbreak: document.getElementById("ro").value,
    }),
  });
  document.getElementById("riskOut").innerHTML = `<p>Risk: <span class="badge ${data.risk === "High" ? "high" : ""}">${data.risk}</span> (${Math.round(data.confidence * 100)}%)</p>`;
  speak("Risk is " + data.risk);
}

function advisorPage() {
  return `<div class="card">
    <h3>${t("advisor")}</h3>
    <label>N</label><input id="n" type="number" value="40" />
    <label>P</label><input id="p" type="number" value="25" />
    <label>K</label><input id="k" type="number" value="25" />
    <label>Rain mm</label><input id="sr" type="number" value="110" />
    <label>Temp</label><input id="st" type="number" value="28" />
    <button class="btn" onclick="runSim()">Simulate</button>
    <div id="simOut"></div>
  </div>`;
}

function farmToolsPage() {
  return `<div class="grid">
    <section class="card">
      <h3>Soil health & fertilizer guidance</h3>
      <p class="muted">Use laboratory soil-test readings where possible.</p>
      <label>Nitrogen (N)</label><input id="ftn" type="number" value="40" min="0" />
      <label>Phosphorus (P)</label><input id="ftp" type="number" value="25" min="0" />
      <label>Potassium (K)</label><input id="ftk" type="number" value="30" min="0" />
      <label>Soil pH</label><input id="ftph" type="number" value="6.5" min="3" max="11" step="0.1" />
      <button class="btn" onclick="runSoilAnalysis()">Analyse soil</button>
      <div id="soilOut"></div>
    </section>
    <section class="card">
      <h3>Crop recommendation</h3>
      <p class="muted">Ranks crop profiles using your soil and season inputs.</p>
      <label>Temperature °C</label><input id="fttemp" type="number" value="28" />
      <label>Humidity %</label><input id="fthum" type="number" value="70" />
      <label>Seasonal rainfall (mm)</label><input id="ftrain" type="number" value="700" />
      <label>Soil type</label><select id="ftsoil" class="field"><option>Loamy</option><option>Clay</option><option>Sandy</option><option>Black</option><option>Silty</option></select>
      <button class="btn" onclick="runCropRecommendation()">Recommend crops</button>
      <div id="cropOut"></div>
    </section>
    <section class="card">
      <h3>Yield & risk estimate</h3>
      <p class="muted">An indicative production scenario, not a yield guarantee.</p>
      <label>Crop</label><select id="ftcrop" class="field"><option>maize</option><option>rice</option><option>tomato</option><option>groundnut</option><option>millet</option><option>cotton</option></select>
      <label>Farm area (hectares)</label><input id="ftarea" type="number" value="1" min="0.1" step="0.1" />
      <button class="btn" onclick="runYieldEstimate()">Estimate yield</button>
      <div id="yieldOut"></div>
    </section>
    <section class="card">
      <h3>Live weather</h3><p class="muted">OpenWeather data uses your device location only after you choose to share it.</p>
      <div class="row"><button class="btn" onclick="loadLiveWeather()">Use my location</button><button class="ghost" onclick="loadWeatherForecast()">5-day forecast</button></div><div id="weatherOut"></div>
    </section>
    <section class="card"><h3>Irrigation planner</h3><p class="muted">Quick water estimate; adjust using local soil and irrigation-system advice.</p><label>Crop</label><select id="irCrop" class="field"><option>rice</option><option>tomato</option><option>maize</option><option>groundnut</option><option>millet</option><option>cotton</option></select><label>Area (hectares)</label><input id="irArea" type="number" value="1" min="0.1" step="0.1" /><label>Rain received this week (mm)</label><input id="irRain" type="number" value="10" min="0" /><button class="btn" onclick="runIrrigationPlan()">Plan irrigation</button><div id="irrigationOut"></div></section>
    <section class="card"><h3>Fertilizer calculator</h3><p class="muted">Uses the NPK values entered in Soil health. Confirm dosage with soil-test and local expert advice.</p><label>Farm area (hectares)</label><input id="fertArea" type="number" value="1" min="0.1" step="0.1" /><button class="btn" onclick="runFertilizerCalculator()">Calculate nutrient gap</button><div id="fertilizerOut"></div></section><section class="card"><h3>Sowing planner</h3><p class="muted">Estimate seed quantity and check a broad sowing-window reference.</p><label>Crop</label><select id="sowCrop" class="field"><option>rice</option><option>maize</option><option>tomato</option><option>groundnut</option><option>millet</option><option>cotton</option></select><label>Area (hectares)</label><input id="sowArea" type="number" value="1" min="0.1" step="0.1" /><label>Month (1-12)</label><input id="sowMonth" type="number" value="6" min="1" max="12" /><button class="btn" onclick="runSowingPlan()">Plan sowing</button><div id="sowingOut"></div></section>
  </div>`;
}

function runIrrigationPlan() { const crop = document.getElementById("irCrop").value, area = Math.max(0.1, Number(document.getElementById("irArea").value) || 1), rain = Math.max(0, Number(document.getElementById("irRain").value) || 0); const weeklyNeed = { rice: 55, tomato: 32, maize: 35, groundnut: 28, millet: 22, cotton: 30 }[crop] || 30, requiredMm = Math.max(0, weeklyNeed - rain), litres = Math.round(requiredMm * area * 10000); document.getElementById("irrigationOut").innerHTML = `<div class="card" style="margin-top:12px"><p><b>${requiredMm} mm</b> additional water this week (about <b>${litres.toLocaleString()} litres</b> for ${area} ha).</p><p class="muted">Reduce irrigation after rain and check soil moisture first. This is a planning estimate.</p></div>`; }
function runFertilizerCalculator() { const area = Math.max(0.1, Number(document.getElementById("fertArea").value) || 1), n = Number(document.getElementById("ftn").value) || 0, p = Number(document.getElementById("ftp").value) || 0, k = Number(document.getElementById("ftk").value) || 0; const gaps = { N: Math.max(0, 50 - n), P: Math.max(0, 30 - p), K: Math.max(0, 40 - k) }; document.getElementById("fertilizerOut").innerHTML = `<div class="card" style="margin-top:12px"><p>Estimated nutrient gap for ${area} ha:</p><ul><li>N: <b>${Math.round(gaps.N * area)} kg</b></li><li>P: <b>${Math.round(gaps.P * area)} kg</b></li><li>K: <b>${Math.round(gaps.K * area)} kg</b></li></ul><p class="muted">Elemental nutrient gaps, not product quantities. Fertilizer dose depends on grade, crop stage, soil test and local guidance.</p></div>`; }

async function runSowingPlan() {
  const output = document.getElementById("sowingOut");
  try {
    const data = await api("/api/sowing-plan", { method: "POST", body: formBody({ crop: document.getElementById("sowCrop").value, area: document.getElementById("sowArea").value, month: document.getElementById("sowMonth").value, soil_type: document.getElementById("ftsoil").value }) });
    output.innerHTML = `<div class="card" style="margin-top:12px"><p><b>${data.suitable_now ? "Suitable reference window" : "Outside the usual reference window"}</b></p><p>Seed rate: ${data.seed_rate_per_hectare_kg} kg/ha · Estimated seed: <b>${data.estimated_seed_kg} kg</b></p><p>${escapeHtml(data.advice)}</p><p class="muted">${escapeHtml(data.disclaimer)}</p></div>`;
  } catch (e) { output.textContent = e.message; }
}

async function dataCatalogPage() {
  const catalog = await api("/api/metadata/features");
  return `<div class="card"><h3>Data & model metadata</h3><p class="muted">Transparent information about the data, model, inputs, outputs, and limitations of every AgriShield feature.</p></div>
    <div class="grid">${catalog.features.map((feature) => `<section class="card">
      <h3>${escapeHtml(feature.name)}</h3><p><span class="badge">${escapeHtml(feature.category)}</span></p>
      <p><b>Data:</b> ${escapeHtml(feature.data_source)}</p><p><b>Dataset:</b> ${escapeHtml(feature.dataset_type)}</p>
      <p><b>Model:</b> ${escapeHtml(feature.model)}</p>
      <p class="muted"><b>Inputs:</b> ${feature.inputs.map(escapeHtml).join(", ")}<br><b>Outputs:</b> ${feature.outputs.map(escapeHtml).join(", ")}<br><b>Limit:</b> ${escapeHtml(feature.limitations)}</p>
    </section>`).join("")}</div>`;
}

function loadLiveWeather() {
  const output = document.getElementById("weatherOut");
  if (!navigator.geolocation) { output.textContent = "Location is not supported by this browser."; return; }
  output.textContent = "Getting your location…";
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const data = await api(`/api/weather?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
      output.innerHTML = `<div class="card" style="margin-top:12px"><b>${escapeHtml(data.location)}</b><p>${escapeHtml(data.condition)} · ${data.temperature_c}°C (feels ${data.feels_like_c}°C)</p><p>Humidity: ${data.humidity}% · Wind: ${data.wind_mps} m/s${data.cached ? " · cached" : ""}</p></div>`;
    } catch (e) { output.textContent = e.message; }
  }, () => { output.textContent = "Location permission is needed to load local weather."; }, { enableHighAccuracy: false, timeout: 10000 });
}

function loadWeatherForecast() {
  const output = document.getElementById("weatherOut");
  if (!navigator.geolocation) { output.textContent = "Location is not supported by this browser."; return; }
  output.textContent = "Loading 5-day forecast…";
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const data = await api(`/api/weather/forecast?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
      const rows = data.days.map((day) => `<tr><td>${escapeHtml(day.date)}</td><td>${day.temp_min_c}–${day.temp_max_c}°C</td><td>${day.humidity_max}%</td><td>${day.rain_mm} mm</td></tr>`).join("");
      output.innerHTML = `<div class="card" style="margin-top:12px"><b>${escapeHtml(data.location)} · 5-day forecast</b><table class="table"><tr><th>Date</th><th>Temperature</th><th>Max humidity</th><th>Rain</th></tr>${rows}</table>${data.alerts.map((alert) => `<p class="muted">${escapeHtml(alert)}</p>`).join("") || "<p class=\"muted\">No weather-risk alerts in the available forecast.</p>"}</div>`;
    } catch (e) { output.textContent = e.message; }
  }, () => { output.textContent = "Location permission is needed to load a local forecast."; }, { enableHighAccuracy: false, timeout: 10000 });
}

function farmToolInputs() {
  return {
    n: document.getElementById("ftn").value, p: document.getElementById("ftp").value,
    k: document.getElementById("ftk").value, ph: document.getElementById("ftph").value,
    temp: document.getElementById("fttemp").value, humidity: document.getElementById("fthum").value,
    rainfall: document.getElementById("ftrain").value, soil_type: document.getElementById("ftsoil").value,
  };
}

async function runSoilAnalysis() {
  try {
    const v = farmToolInputs();
    const data = await api("/api/soil-analysis", { method: "POST", body: formBody(v) });
    document.getElementById("soilOut").innerHTML = `<div class="card" style="margin-top:12px"><b>${data.status}: ${data.score}/100</b><ul>${data.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul></div>`;
  } catch (e) { document.getElementById("soilOut").textContent = e.message; }
}

async function runCropRecommendation() {
  try {
    const data = await api("/api/crop-recommendations", { method: "POST", body: formBody(farmToolInputs()) });
    document.getElementById("cropOut").innerHTML = `<div class="card" style="margin-top:12px">${data.recommendations.map((r) => `<p><b>${escapeHtml(r.crop)}</b> · ${r.suitability}%<br><span class="muted">${escapeHtml(r.reason)}</span></p>`).join("")}<p class="muted">${escapeHtml(data.disclaimer)}</p></div>`;
  } catch (e) { document.getElementById("cropOut").textContent = e.message; }
}

async function runYieldEstimate() {
  try {
    const v = farmToolInputs();
    v.crop = document.getElementById("ftcrop").value;
    v.area = document.getElementById("ftarea").value;
    const data = await api("/api/yield-estimate", { method: "POST", body: formBody(v) });
    document.getElementById("yieldOut").innerHTML = `<div class="card" style="margin-top:12px"><p><b>${data.per_hectare_tonnes} tonnes/hectare</b> · ${data.total_tonnes} tonnes total</p><p>Risk: <span class="badge ${data.risk === "High" ? "high" : data.risk === "Medium" ? "med" : ""}">${data.risk}</span> (${data.risk_score}/100)</p><p class="muted">${escapeHtml(data.disclaimer)}</p></div>`;
  } catch (e) { document.getElementById("yieldOut").textContent = e.message; }
}

async function runSim() {
  const data = await api("/api/simulate", {
    method: "POST",
    body: formBody({
      n: document.getElementById("n").value,
      p: document.getElementById("p").value,
      k: document.getElementById("k").value,
      rain: document.getElementById("sr").value,
      temp: document.getElementById("st").value,
    }),
  });
  document.getElementById("simOut").innerHTML = `<p>Yield index: <b>${data.yield_index}</b></p>
    <p>Crops: ${data.suggested_crops.join(", ")}</p><p class="muted">${pick(data.note)}</p>`;
}

async function dashPage() {
  if (!state.user) return loginPage();
  const rows = await api("/api/appointments/my");
  const isDoc = state.user.role === "doctor";
  const profile = isDoc ? await api("/api/doctor-profile/me") : null;
  const verification = isDoc ? await api("/api/doctor-verification/me") : null;
  const profileCard = isDoc ? `<div class="card">
    <h3>My doctor profile</h3>
    <p>Verification: <span class="badge ${verification.verified ? "" : "med"}">${escapeHtml(verification.status)}</span></p>
    ${verification.verified ? "<p class=\"muted\">Your profile is visible in the verified doctor directory.</p>" : `<label>Registration / licence number</label><input id="verificationNumber" value="${escapeHtml(verification.registration_number)}" placeholder="Enter your professional registration number" /><button class="ghost" style="margin-top:8px" onclick="submitDoctorVerification()">Submit for verification</button><p class="muted">Pending profiles are hidden from farmer booking until approved.</p>`}
    <div class="grid2">
      <div><label>Qualification</label><input id="dpQualification" value="${escapeHtml(profile.qualification)}" /></div>
      <div><label>Specialization</label><input id="dpSpecialization" value="${escapeHtml(profile.specialization)}" /></div>
      <div><label>Experience (years)</label><input id="dpExperience" type="number" min="0" max="70" value="${escapeHtml(profile.experience)}" /></div>
      <div><label>Consultation fee (₹)</label><input id="dpFee" type="number" min="0" max="10000" value="${escapeHtml(profile.fee)}" /></div>
    </div>
    <label>Languages (comma-separated)</label><input id="dpLanguages" value="${escapeHtml(profile.languages)}" />
    <label>Available days (comma-separated)</label><input id="dpDays" value="${escapeHtml(profile.days)}" />
    <label>Available time slots (comma-separated, e.g. 10:00,15:00)</label><input id="dpSlots" value="${escapeHtml(profile.slots)}" />
    <label>About you</label><textarea id="dpBio">${escapeHtml(profile.bio)}</textarea>
    <button class="btn" style="margin-top:12px" onclick="saveDoctorProfile()">Save doctor profile</button>
  </div>` : "";
  return `${profileCard}<div class="card">
    <h3>${t("dash")} — ${escapeHtml(state.user.name)}</h3>
    <table class="table">
      <tr><th>When</th><th>With</th><th>Status</th><th></th></tr>
      ${rows
        .map((a) => {
          const other = isDoc ? a.owner_name : a.doctor_name;
          const actions =
            isDoc && a.status === "pending"
              ? `<button class="btn" onclick="setAppt(${a.id},'confirmed')">Accept</button>
                 <button class="danger" onclick="setAppt(${a.id},'rejected')">Reject</button>`
              : a.status === "confirmed"
                ? `<button class="ghost" onclick="openRoom(${a.id})">Voice / text room</button>`
                : "";
          const extra =
            isDoc && a.status === "confirmed"
              ? `<button class="ghost" onclick="completeAppt(${a.id})">Notes + complete</button>`
              : "";
          const reason = isDoc && a.reason ? `<br><span class="muted">Reason: ${escapeHtml(a.reason)}</span>` : "";
          return `<tr><td>${escapeHtml(a.date)} ${escapeHtml(a.start_time)}</td><td>${escapeHtml(other)}${reason}</td><td><span class="badge">${escapeHtml(a.status)}</span></td><td>${actions} ${extra}</td></tr>`;
        })
        .join("")}
    </table>
    <div id="room"></div>
  </div>`;
}

async function saveDoctorProfile() {
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
  alert("Doctor profile saved.");
  render();
}

async function submitDoctorVerification() {
  const number = document.getElementById("verificationNumber").value.trim();
  if (!number) return alert("Enter your registration or licence number.");
  try {
    const data = await api("/api/doctor-verification", { method: "POST", body: formBody({ registration_number: number }) });
    alert(data.message);
    render();
  } catch (e) { alert(e.message); }
}

async function setAppt(id, status) {
  await api(`/api/appointments/${id}/status`, { method: "PATCH", body: formBody({ status }) });
  render();
}

async function completeAppt(id) {
  const diagnosis = prompt("Diagnosis / observed issue");
  const advice = prompt("Advice / medicines");
  if (advice == null) return;
  await api(`/api/appointments/${id}/notes`, { method: "POST", body: formBody({ diagnosis, advice }) });
  await setAppt(id, "completed");
}

async function openRoom(id) {
  window._room = id;
  const notes = await api(`/api/appointments/${id}/notes`);
  document.getElementById("room").innerHTML = `
    <div class="chatbox" style="margin-top:12px">
      <p class="muted">Consultation #${id} · text + voice (browser mic)</p>
      ${notes.map((n) => `<p>Notes: ${escapeHtml(n.diagnosis)} — ${escapeHtml(n.advice)}</p>`).join("")}
      <div class="msgs" id="rms"></div>
      <div class="row">
        <input id="rmIn" style="flex:1" />
        <button class="voice" onclick="roomListen()">🎤</button>
        <button class="btn" onclick="roomSend()">Send</button>
      </div>
    </div>`;
  pollRoom();
}

async function pollRoom() {
  if (!window._room) return;
  const msgs = await api(`/api/appointments/${window._room}/messages`);
  const box = document.getElementById("rms");
  if (!box) return;
  box.innerHTML = msgs
    .map((m) => `<div class="bubble ${m.sender_id === state.user.id ? "me" : "bot"}">${escapeHtml(m.message)}</div>`)
    .join("");
  box.scrollTop = box.scrollHeight;
  setTimeout(pollRoom, 2500);
}

async function roomSend(text) {
  const v = text || document.getElementById("rmIn").value;
  if (!v) return;
  document.getElementById("rmIn").value = "";
  await api(`/api/appointments/${window._room}/messages`, { method: "POST", body: formBody({ message: v }) });
}

function roomListen() {
  listen((txt) => roomSend(txt));
}

function loginPage() {
  return `<div class="card" style="max-width:420px;margin:auto">
    <h3>${t("login")}</h3>
    <p class="muted">Use your registered account or the demo buttons below.</p>
    <label>Email</label><input id="em" type="email" autocomplete="email" placeholder="farmer@agrishield.in" />
    <label>Password</label><input id="pw" type="password" autocomplete="current-password" placeholder="Your password" />
    <label>Register as</label>
    <select id="role" class="field"><option value="farmer">Farmer</option><option value="doctor">Plant doctor</option></select>
    <label>Name (register)</label><input id="nm" autocomplete="name" />
    <div class="row" style="margin-top:12px">
      <button class="btn" onclick="doLogin()">Login</button>
      <button class="ghost" onclick="doRegister()">Register</button>
    </div>
    <div class="row" style="margin-top:10px">
      <button class="ghost" onclick="demoLogin('farmer')">Demo farmer</button>
      <button class="ghost" onclick="demoLogin('doctor')">Demo doctor</button>
      <button class="ghost" onclick="resetAgriShieldApp()">Reset app</button>
    </div>
    <p id="loginOut" class="muted" role="status"></p>
  </div>`;
}

async function doLogin() {
  const output = document.getElementById("loginOut");
  const email = document.getElementById("em").value.trim();
  const password = document.getElementById("pw").value;
  if (!email || !password) { output.textContent = "Enter your email and password."; return; }
  output.textContent = "Signing in…";
  try {
    const data = await api("/api/auth/login", { method: "POST", body: formBody({ email, password }) });
    setUser(data.token, data.user);
    location.hash = data.user.role === "doctor" ? "dash" : "farm-dashboard";
  } catch (e) {
    output.textContent = e.message === "auth" ? "Email or password is incorrect." : `Login failed: ${e.message}`;
  }
}

async function doRegister() {
  const output = document.getElementById("loginOut");
  const name = document.getElementById("nm").value.trim();
  const email = document.getElementById("em").value.trim();
  const password = document.getElementById("pw").value;
  const role = document.getElementById("role").value;
  if (!name) { output.textContent = "Enter your name to register."; return; }
  if (!email.includes("@")) { output.textContent = "Enter a valid email address."; return; }
  if (password.length < 8) { output.textContent = "Password must contain at least 8 characters."; return; }
  output.textContent = "Creating your account…";
  try {
    const data = await api("/api/auth/register", { method: "POST", body: formBody({ name, email, password, role, language: state.lang }) });
    setUser(data.token, data.user);
    location.hash = data.user.role === "doctor" ? "dash" : "farm-dashboard";
  } catch (e) {
    output.textContent = `Registration failed: ${e.message}`;
  }
}
async function demoLogin(kind) {
  const output = document.getElementById("loginOut");
  const email = kind === "doctor" ? "ananya.patil@agrishield.in" : "farmer@agrishield.in";
  const password = kind === "doctor" ? "Doctor@123" : "Farmer@123";
  if (output) output.textContent = `Signing in as demo ${kind}…`;
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
  Object.keys(localStorage).filter((key) => key.startsWith("agrishield-cache:")).forEach((key) => localStorage.removeItem(key));
  if ("caches" in window) await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  location.replace(`${location.origin}/#login`);
}

async function render() {
  state.page = location.hash.replace("#", "") || "home";
  if (!state.user && state.page !== "login") {
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
    home: loginPage,
    "farm-dashboard": farmerDashboardPage,
    detect: detectPage,
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
    "data-catalog": dataCatalogPage,
    algorithms: algorithmsPage,
    feedback: feedbackPage,
    dash: dashPage,
    login: loginPage,
  };
  const fn = pages[state.page] || loginPage;
  try {
    app.innerHTML = await fn();
    app.classList.remove("page-enter");
    requestAnimationFrame(() => app.classList.add("page-enter"));
    if (state.page === "detect") fillCrops();
    if (state.page === "chat") bindMic();
  } catch (e) {
    app.innerHTML = `<div class="card"><h3>Unable to load this screen</h3><p class="muted">${escapeHtml(e.message)}</p><a class="btn" href="#home">Go home</a></div>`;
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
  } else location.hash = "login";
};
document.getElementById("bellBtn").onclick = async () => {
  const box = document.getElementById("alerts");
  if (!state.user) return;
  box.hidden = !box.hidden;
  if (!box.hidden) {
    const rows = await api("/api/notifications");
    box.innerHTML = rows.map((n) => `<p class="muted">${n.text}</p>`).join("") || "<p>No alerts</p>";
  }
};
window.addEventListener("hashchange", render);
window.addEventListener("online", updateConnectivity);
window.addEventListener("offline", updateConnectivity);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js", { scope: "/" }));
}
updateConnectivity();
render();
