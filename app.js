/**
 * KKPD Prize Selection App - Ranked Choice Priority Allocation Engine with 4-Digit PIN Security
 */

// ==========================================
// 1. DATA DEFINITIONS
// ==========================================

const PARTICIPANTS = [
  { id: 1, name: "[kkpd]sakkarin dowlie", rank: 1 },
  { id: 2, name: "[KKPD] Kimmy Siriphapa", rank: 2 },
  { id: 3, name: "[KKPD] KHUNKHAI Eisenwall", rank: 3 },
  { id: 4, name: "[KKPD] Seua Osi", rank: 4 },
  { id: 5, name: "[KKPD] Kair Osi", rank: 5 },
  { id: 6, name: "[KKPD] Chalam Noi", rank: 6 },
  { id: 7, name: "[KKPD] Kkr Kaliona", rank: 7 },
  { id: 8, name: "[KKPD] Tarik Monique", rank: 8 },
  { id: 9, name: "[KKPD] ASGARD DEEJINGJING", rank: 9 },
  { id: 10, name: "[KKPD] Chanom Howzler", rank: 10 },
  { id: 11, name: "[KKPD] Song Marzano", rank: 11 },
  { id: 12, name: "[KKPD] John Doe", rank: 12 },
  { id: 13, name: "[KKPD]Dillan Bragg", rank: 13 },
  { id: 14, name: "[KKPD] Milo Emilian Marquez", rank: 14 },
  { id: 15, name: "[KKPD] Thoshilo Bakery", rank: 15 },
  { id: 16, name: "[KKPD] Pucca Kor IGjaOcRoi", rank: 16 },
  { id: 17, name: "[KKPD] Akki Autsawapatcharakul", rank: 17 },
  { id: 18, name: "[KKPD] LAZER DIM", rank: 18 },
  { id: 19, name: "[KKPD] Gaiar OsiMarzanoJingjing", rank: 19 },
  { id: 20, name: "[KKPD] Khana Fahwabwab", rank: 20 }
];

const DEFAULT_PINS = {
  1: "2824",
  2: "1409",
  3: "5506",
  4: "5012",
  5: "4657",
  6: "3286",
  7: "2679",
  8: "9935",
  9: "2424",
  10: "7912",
  11: "1520",
  12: "1488",
  13: "2535",
  14: "4582",
  15: "4811",
  16: "9279",
  17: "1434",
  18: "4257",
  19: "9928",
  20: "7873"
};

function generateRandom4DigitPin(excludeSet = new Set()) {
  let pin;
  do {
    pin = Math.floor(1000 + Math.random() * 9000).toString();
  } while (excludeSet.has(pin) || ["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1234", "4321"].includes(pin));
  return pin;
}

const MASTER_ADMIN_PIN = "9936";

const CARS = {
  banshee: {
    id: "banshee",
    name: "Banshee",
    quota: 5,
    tag: "Super Sport",
    desc: "โควตา 5 คัน • ตำนานสปอร์ตคาร์ขุมพลังดุดัน",
    icon: "fa-car-burst",
    color: "#00f0ff"
  },
  corsita: {
    id: "corsita",
    name: "Corsita",
    quota: 3,
    tag: "Supercar",
    desc: "โควตา 3 คัน • ซูเปอร์คาร์อิตาลีดีไซน์หรูหรา",
    icon: "fa-car-side",
    color: "#f59e0b"
  },
  r32: {
    id: "r32",
    name: "R32",
    quota: 3,
    tag: "Tuner Legend",
    desc: "โควตา 3 คัน • ตำนานก็อดซิลล่าแห่งท้องถนน",
    icon: "fa-gauge-high",
    color: "#10b981"
  },
  t20: {
    id: "t20",
    name: "T20",
    quota: 3,
    tag: "Hypercar",
    desc: "โควตา 3 คัน • ไฮเปอร์คาร์ความเร็วสูงระดับแนวหน้า",
    icon: "fa-bolt",
    color: "#f43f5e"
  },
  c8: {
    id: "c8",
    name: "C8",
    quota: 3,
    tag: "Super Sport",
    desc: "โควตา 3 คัน • มิดเอนจินทรงพลังสไตล์อเมริกัน",
    icon: "fa-shield-halved",
    color: "#8b5cf6"
  },
  furia: {
    id: "furia",
    name: "Furia",
    quota: 3,
    tag: "Exotic Hypercar",
    desc: "โควตา 3 คัน • ไฮเปอร์คาร์เอ็กโซติกรูปทรงล้ำยุค",
    icon: "fa-fire",
    color: "#ec4899"
  }
};

const DEFAULT_CAR_KEYS = Object.keys(CARS); // ["banshee", "corsita", "r32", "t20", "c8", "furia"]

// ==========================================
// 2. STATE MANAGEMENT, STORAGE & CLOUD SYNC
// ==========================================

const STORAGE_KEY = "kkpd_prize_selection_v3";
const CLOUD_SYNC_URL = "https://kvdb.io/NoTM4bJXjrCUgQWLBcgR3F/kkpd_event_state";

let state = {
  preferences: {}, // { [playerId]: ["banshee", "r32", ...] }
  submissions: {}, // { [playerId]: timestamp }
  pins: { ...DEFAULT_PINS }, // { [playerId]: "1001" }
  lastUpdated: 0,
  authenticatedPlayerId: null,
  isAdminAuthenticated: false,
  soundEnabled: true,
  selectedPlayerId: null,
  currentFormOrder: [...DEFAULT_CAR_KEYS],
  adminEditingPlayerId: null,
  adminFormOrder: [...DEFAULT_CAR_KEYS]
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state.preferences = parsed.preferences || {};
      state.submissions = parsed.submissions || {};
      state.pins = { ...DEFAULT_PINS, ...(parsed.pins || {}) };
      state.lastUpdated = parsed.lastUpdated || 0;
      if (typeof parsed.soundEnabled === "boolean") state.soundEnabled = parsed.soundEnabled;
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      preferences: state.preferences,
      submissions: state.submissions,
      pins: state.pins,
      lastUpdated: state.lastUpdated,
      soundEnabled: state.soundEnabled
    }));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

const CloudSync = {
  isSyncing: false,
  async fetchLatest(silent = false) {
    if (this.isSyncing) return;
    this.isSyncing = true;
    if (!silent) this.updateIndicator('syncing');

    try {
      const res = await fetch(CLOUD_SYNC_URL + '?_t=' + Date.now(), {
        cache: 'no-store'
      });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && typeof cloudData === 'object') {
          // Merge preferences and submissions safely
          state.preferences = { ...state.preferences, ...(cloudData.preferences || {}) };
          state.submissions = { ...state.submissions, ...(cloudData.submissions || {}) };
          if (cloudData.pins) state.pins = { ...DEFAULT_PINS, ...state.pins, ...cloudData.pins };
          state.lastUpdated = Math.max(state.lastUpdated || 0, cloudData.lastUpdated || 0);

          saveState();
          renderFullState();
          initUI();
          this.updateIndicator('online');
          if (!silent) {
            AudioEngine.play('success');
            showToast("🔄 ซิงค์ข้อมูลกับ Cloud สำเร็จ! (ข้อมูลอัปเดตตรงกันแล้ว)", "success");
          }
          return true;
        }
      }
      this.updateIndicator('online');
      if (!silent) showToast("🔄 ข้อมูลเป็นปัจจุบันแล้ว", "info");
    } catch (err) {
      console.warn("Cloud Sync fetch issue:", err);
      this.updateIndicator('offline');
      if (!silent) showToast("⚠️ ไม่สามารถติดต่อ Cloud ได้ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      this.isSyncing = false;
    }
  },

  async pushUpdate() {
    this.updateIndicator('syncing');
    state.lastUpdated = Date.now();
    saveState();

    try {
      // First fetch latest remote data to merge other players' picks
      try {
        const checkRes = await fetch(CLOUD_SYNC_URL + '?_t=' + Date.now(), { cache: 'no-store' });
        if (checkRes.ok) {
          const remote = await checkRes.json();
          if (remote && remote.preferences) {
            state.preferences = { ...remote.preferences, ...state.preferences };
            state.submissions = { ...remote.submissions, ...state.submissions };
          }
        }
      } catch (e) {
        // ignore fetch error on pre-check
      }

      const payload = {
        version: 2,
        lastUpdated: Date.now(),
        preferences: state.preferences,
        submissions: state.submissions,
        pins: state.pins
      };

      const res = await fetch(CLOUD_SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.updateIndicator('online');
      } else {
        console.warn("Cloud push response not ok:", res.status);
      }
    } catch (err) {
      console.error("Cloud push failed:", err);
      this.updateIndicator('offline');
    }
  },

  updateIndicator(status) {
    if (!DOM.cloudStatusText || !DOM.cloudIcon) return;
    const statIcon = document.querySelector(".stat-icon.cloud-stat");

    if (status === 'syncing') {
      DOM.cloudStatusText.textContent = "กำลังซิงค์...";
      DOM.cloudStatusText.className = "stat-value cloud-status-text syncing";
      if (statIcon) statIcon.className = "stat-icon cloud-stat syncing";
      DOM.cloudIcon.className = "fa-solid fa-arrows-rotate fa-spin";
    } else if (status === 'online') {
      DOM.cloudStatusText.textContent = "ออนไลน์ ✓";
      DOM.cloudStatusText.className = "stat-value cloud-status-text";
      if (statIcon) statIcon.className = "stat-icon cloud-stat";
      DOM.cloudIcon.className = "fa-solid fa-cloud-arrow-up";
    } else if (status === 'offline') {
      DOM.cloudStatusText.textContent = "ออฟไลน์";
      DOM.cloudStatusText.className = "stat-value cloud-status-text offline";
      if (statIcon) statIcon.className = "stat-icon cloud-stat offline";
      DOM.cloudIcon.className = "fa-solid fa-cloud-slash";
    }
  }
};

// ==========================================
// 3. WEB AUDIO SYNTHESIZER
// ==========================================

const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  play(type) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'move') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord
        freqs.forEach((f, i) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, now + i * 0.06);
          g.gain.setValueAtTime(0.06, now + i * 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
          o.connect(g);
          g.connect(this.ctx.destination);
          o.start(now + i * 0.06);
          o.stop(now + i * 0.06 + 0.35);
        });
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'alloc') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (err) {
      console.warn("Audio play issue:", err);
    }
  }
};

// ==========================================
// 4. PRIORITY ALLOCATION ALGORITHM
// ==========================================

function computeAllocation() {
  const currentStock = {};
  for (const key in CARS) {
    currentStock[key] = CARS[key].quota;
  }

  const results = [];
  const rosterByCar = {};
  for (const key in CARS) {
    rosterByCar[key] = [];
  }

  let allocatedCount = 0;

  // Resolve sequentially by rank (1 to 20)
  for (let i = 0; i < PARTICIPANTS.length; i++) {
    const participant = PARTICIPANTS[i];
    const userPrefs = state.preferences[participant.id];
    const hasSubmitted = !!userPrefs;

    const resultItem = {
      participant,
      hasSubmitted,
      submissionTime: state.submissions[participant.id] || null,
      allocatedCarKey: null,
      allocatedCar: null,
      choiceIndex: null,
      resolutionSteps: []
    };

    if (hasSubmitted) {
      for (let c = 0; c < userPrefs.length; c++) {
        const carKey = userPrefs[c];
        const carObj = CARS[carKey];

        if (currentStock[carKey] > 0) {
          currentStock[carKey]--;
          resultItem.allocatedCarKey = carKey;
          resultItem.allocatedCar = carObj;
          resultItem.choiceIndex = c + 1;
          resultItem.resolutionSteps.push({
            carKey,
            carName: carObj.name,
            choiceIndex: c + 1,
            status: "granted"
          });

          rosterByCar[carKey].push({
            participant,
            choiceIndex: c + 1
          });
          allocatedCount++;
          break;
        } else {
          resultItem.resolutionSteps.push({
            carKey,
            carName: carObj.name,
            choiceIndex: c + 1,
            status: "skipped",
            reason: "โควตาเต็มแล้ว"
          });
        }
      }
    }

    results.push(resultItem);
  }

  return {
    results,
    currentStock,
    allocatedCount,
    rosterByCar
  };
}

// ==========================================
// 5. DOM ELEMENTS & INITIALIZATION
// ==========================================

const DOM = {
  tabBtns: document.querySelectorAll(".tab-btn"),
  tabContents: document.querySelectorAll(".tab-content"),
  submittedCount: document.getElementById("submittedCount"),
  cloudStatusText: document.getElementById("cloudStatusText"),
  cloudIcon: document.getElementById("cloudIcon"),
  btnManualCloudSync: document.getElementById("btnManualCloudSync"),
  playerSelect: document.getElementById("playerSelect"),
  rosterChipsGrid: document.getElementById("rosterChipsGrid"),
  legendDoneCount: document.getElementById("legendDoneCount"),
  legendPendingCount: document.getElementById("legendPendingCount"),
  pinSecurityBox: document.getElementById("pinSecurityBox"),
  playerPinInput: document.getElementById("playerPinInput"),
  btnVerifyPin: document.getElementById("btnVerifyPin"),
  pinErrorMessage: document.getElementById("pinErrorMessage"),
  playerInfoBanner: document.getElementById("playerInfoBanner"),
  bannerRankNum: document.getElementById("bannerRankNum"),
  bannerPlayerName: document.getElementById("bannerPlayerName"),
  bannerStatusTag: document.getElementById("bannerStatusTag"),
  bannerAuthBadge: document.getElementById("bannerAuthBadge"),
  stockChipsGrid: document.getElementById("stockChipsGrid"),
  rankingList: document.getElementById("rankingList"),
  btnSubmitPreference: document.getElementById("btnSubmitPreference"),
  btnResetMyChoices: document.getElementById("btnResetMyChoices"),
  receiptModal: document.getElementById("receiptModal"),
  receiptPlayerDesc: document.getElementById("receiptPlayerDesc"),
  receiptSummaryBox: document.getElementById("receiptSummaryBox"),
  btnCloseReceipt: document.getElementById("btnCloseReceipt"),
  btnEditReceipt: document.getElementById("btnEditReceipt"),
  stockStatusTag: document.getElementById("stockStatusTag"),
  stockCardsGrid: document.getElementById("stockCardsGrid"),
  allocationTimeline: document.getElementById("allocationTimeline"),
  carRosterList: document.getElementById("carRosterList"),
  btnSimulateAnim: document.getElementById("btnSimulateAnim"),
  btnQuickCopyDiscord: document.getElementById("btnQuickCopyDiscord"),
  adminLockScreen: document.getElementById("adminLockScreen"),
  adminDashboardContent: document.getElementById("adminDashboardContent"),
  adminPasswordInput: document.getElementById("adminPasswordInput"),
  btnUnlockAdmin: document.getElementById("btnUnlockAdmin"),
  adminPasswordError: document.getElementById("adminPasswordError"),
  btnLogoutAdmin: document.getElementById("btnLogoutAdmin"),
  adminTableBody: document.getElementById("adminTableBody"),
  btnRegeneratePins: document.getElementById("btnRegeneratePins"),
  btnCopyAllPins: document.getElementById("btnCopyAllPins"),
  btnGenerateDemo: document.getElementById("btnGenerateDemo"),
  btnCopyAnnouncement: document.getElementById("btnCopyAnnouncement"),
  btnExportJSON: document.getElementById("btnExportJSON"),
  btnResetAll: document.getElementById("btnResetAll"),
  announcementText: document.getElementById("announcementText"),
  btnCopyPreviewText: document.getElementById("btnCopyPreviewText"),
  btnSoundToggle: document.getElementById("btnSoundToggle"),
  soundIcon: document.getElementById("soundIcon"),
  toastContainer: document.getElementById("toastContainer"),
  adminEditModal: document.getElementById("adminEditModal"),
  adminModalTitle: document.getElementById("adminModalTitle"),
  adminEditPinInput: document.getElementById("adminEditPinInput"),
  adminRankingList: document.getElementById("adminRankingList"),
  btnCloseAdminModal: document.getElementById("btnCloseAdminModal"),
  btnSaveAdminEdit: document.getElementById("btnSaveAdminEdit"),
  btnCancelAdminEdit: document.getElementById("btnCancelAdminEdit")
};

function initUI() {
  DOM.playerSelect.innerHTML = `<option value="" disabled selected>-- กรุณาเลือกชื่อของคุณจาก 20 ลำดับ --</option>`;
  PARTICIPANTS.forEach(p => {
    const isSubmitted = !!state.preferences[p.id];
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `อันดับ ${p.rank}: ${p.name} ${isSubmitted ? '✓' : ''}`;
    DOM.playerSelect.appendChild(opt);
  });

  renderMiniStockChips();
  renderRankingList(DOM.rankingList, state.currentFormOrder, 'form');
  renderFullState();
}

function renderMiniStockChips() {
  DOM.stockChipsGrid.innerHTML = "";
  for (const key in CARS) {
    const car = CARS[key];
    const chip = document.createElement("div");
    chip.className = "stock-chip";
    chip.innerHTML = `
      <span class="chip-name">${car.name}</span>
      <span class="chip-count">${car.quota} คัน</span>
    `;
    DOM.stockChipsGrid.appendChild(chip);
  }
}

function renderRankingList(container, orderArray, context = 'form') {
  container.innerHTML = "";
  
  orderArray.forEach((carKey, idx) => {
    const car = CARS[carKey];
    const rankNum = idx + 1;
    const isFirst = rankNum === 1;

    const card = document.createElement("div");
    card.className = `ranked-card ${isFirst ? 'top-choice' : ''}`;
    card.setAttribute("draggable", "true");
    card.dataset.carKey = carKey;
    card.dataset.order = rankNum;
    card.dataset.index = idx;

    card.innerHTML = `
      <div class="choice-rank-badge">
        <span class="choice-num">${rankNum}</span>
        <span class="choice-lbl">${isFirst ? '1st' : `${rankNum}th`}</span>
      </div>

      <div class="card-car-visual" style="border-color: ${car.color}33;">
        <i class="fa-solid ${car.icon}" style="color: ${car.color};"></i>
      </div>

      <div class="card-car-details">
        <div class="card-car-title">
          <span class="card-car-name">${car.name}</span>
          <span class="card-car-tag">${car.tag}</span>
        </div>
        <div class="card-car-desc">${car.desc}</div>
      </div>

      <div class="card-actions-reorder">
        <button class="btn-move btn-move-up" title="เลื่อนขึ้น" ${idx === 0 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-up"></i>
        </button>
        <button class="btn-move btn-move-down" title="เลื่อนลง" ${idx === orderArray.length - 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>

      <div class="drag-handle" title="คลิกลากสลับตำแหน่ง">
        <i class="fa-solid fa-grip-vertical"></i>
      </div>
    `;

    const btnUp = card.querySelector(".btn-move-up");
    const btnDown = card.querySelector(".btn-move-down");

    btnUp.addEventListener("click", (e) => {
      e.stopPropagation();
      moveItem(orderArray, idx, idx - 1, context);
    });

    btnDown.addEventListener("click", (e) => {
      e.stopPropagation();
      moveItem(orderArray, idx, idx + 1, context);
    });

    setupDragAndDrop(card, container, orderArray, context);
    container.appendChild(card);
  });
}

function moveItem(array, fromIndex, toIndex, context) {
  if (toIndex < 0 || toIndex >= array.length) return;
  const item = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, item);
  AudioEngine.play('move');

  if (context === 'form') {
    state.currentFormOrder = array;
    renderRankingList(DOM.rankingList, state.currentFormOrder, 'form');
  } else if (context === 'admin') {
    state.adminFormOrder = array;
    renderRankingList(DOM.adminRankingList, state.adminFormOrder, 'admin');
  }
}

function setupDragAndDrop(card, container, orderArray, context) {
  card.addEventListener("dragstart", (e) => {
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.dataset.index);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    document.querySelectorAll(".ranked-card").forEach(c => c.classList.remove("drag-over"));
  });

  card.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    card.classList.add("drag-over");
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over");
  });

  card.addEventListener("drop", (e) => {
    e.preventDefault();
    card.classList.remove("drag-over");
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const toIndex = parseInt(card.dataset.index, 10);
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      moveItem(orderArray, fromIndex, toIndex, context);
    }
  });
}

// ==========================================
// 6. ALLOCATION RESULTS & TABLES
// ==========================================

function renderFullState() {
  const { results, currentStock, allocatedCount, rosterByCar } = computeAllocation();
  const submittedTotal = Object.keys(state.preferences).length;
  const pendingTotal = PARTICIPANTS.length - submittedTotal;

  DOM.submittedCount.textContent = submittedTotal;
  DOM.stockStatusTag.textContent = `จัดสรรแล้ว ${allocatedCount} / 20 คัน`;

  // 0. Tab 1: 20 Participants Roster Submission Status (Green / Red indicator)
  if (DOM.rosterChipsGrid) {
    DOM.legendDoneCount.textContent = submittedTotal;
    DOM.legendPendingCount.textContent = pendingTotal;
    DOM.rosterChipsGrid.innerHTML = "";

    PARTICIPANTS.forEach(p => {
      const isSubmitted = !!state.preferences[p.id];
      const isCurrentlySelected = state.selectedPlayerId === p.id;
      const displayName = p.name.replace(/^\[kkpd\]\s*/i, '').trim();
      const chip = document.createElement("div");
      chip.className = `roster-status-chip ${isCurrentlySelected ? 'active-selected' : ''}`;
      chip.dataset.playerId = p.id;
      chip.title = `คลิกเพื่อเลือก ${p.name}`;

      chip.innerHTML = `
        <div class="chip-player-left">
          <span class="chip-rank-badge">#${p.rank}</span>
          <span class="chip-player-name">${displayName}</span>
        </div>
        <div class="chip-status-badge ${isSubmitted ? 'submitted' : 'pending'}">
          <span class="status-dot ${isSubmitted ? 'dot-green' : 'dot-red'}"></span>
          <span>${isSubmitted ? 'เลือกแล้ว' : 'ยังไม่เลือก'}</span>
        </div>
      `;

      chip.addEventListener("click", () => {
        DOM.playerSelect.value = p.id;
        DOM.playerSelect.dispatchEvent(new Event("change"));
        DOM.playerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      DOM.rosterChipsGrid.appendChild(chip);
    });
  }

  // Stock Overview Cards
  DOM.stockCardsGrid.innerHTML = "";
  for (const key in CARS) {
    const car = CARS[key];
    const remaining = currentStock[key];
    const used = car.quota - remaining;
    const pct = (used / car.quota) * 100;
    const isDepleted = remaining === 0;

    const card = document.createElement("div");
    card.className = `stock-card-live ${isDepleted ? 'depleted' : ''}`;
    card.innerHTML = `
      <div class="stock-card-top">
        <span class="stock-car-title">${car.name}</span>
        <span class="stock-car-quota">${remaining} <small style="font-size:0.8rem;color:var(--text-muted)">/${car.quota}</small></span>
      </div>
      <div class="stock-progress-bar">
        <div class="stock-progress-fill" style="width: ${100 - pct}%;"></div>
      </div>
      <div class="stock-card-footer">
        <span>${isDepleted ? '🔴 เต็มแล้ว' : `🟢 เหลือ ${remaining} คัน`}</span>
        <span>จ่ายแล้ว ${used} คัน</span>
      </div>
    `;
    DOM.stockCardsGrid.appendChild(card);
  }

  // Allocation Timeline
  DOM.allocationTimeline.innerHTML = "";
  results.forEach(res => {
    const p = res.participant;
    const isTop3 = p.rank <= 3;
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.id = `timeline-player-${p.id}`;

    let resolutionHtml = "";
    if (res.hasSubmitted) {
      const pathSteps = res.resolutionSteps.map(step => {
        if (step.status === 'granted') {
          return `<span class="path-step granted"><i class="fa-solid fa-check"></i> ${step.choiceIndex}. ${step.carName}</span>`;
        } else {
          return `<span class="path-step skipped" title="${step.reason}"><i class="fa-solid fa-xmark"></i> ${step.choiceIndex}. ${step.carName}</span><i class="fa-solid fa-chevron-right path-arrow"></i>`;
        }
      }).join(" ");
      resolutionHtml = `<div class="timeline-resolution">${pathSteps}</div>`;
    } else {
      resolutionHtml = `<div class="timeline-resolution"><span class="path-step" style="color:var(--text-muted)">ยังไม่ได้ส่งข้อมูลลำดับความชอบ</span></div>`;
    }

    let allocatedBadgeHtml = "";
    if (res.allocatedCar) {
      const isFirstChoice = res.choiceIndex === 1;
      allocatedBadgeHtml = `
        <div class="timeline-allocated ${isFirstChoice ? 'choice-1' : ''}">
          <i class="fa-solid fa-car"></i>
          <span>${res.allocatedCar.name}</span>
          <span style="font-size:0.75rem;opacity:0.85;">(ตัวเลือกอันดับ ${res.choiceIndex})</span>
        </div>
      `;
    } else {
      allocatedBadgeHtml = `
        <div class="timeline-allocated waiting">
          <i class="fa-regular fa-clock"></i>
          <span>รอส่งข้อมูล</span>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="timeline-rank ${isTop3 ? 'top-3' : ''}">
        <span class="t-rank-num">#${p.rank}</span>
        <span class="t-rank-lbl">ลำดับ</span>
      </div>

      <div class="timeline-player-info">
        <div class="timeline-player-name">${p.name}</div>
        <div class="timeline-player-status">
          ${res.hasSubmitted ? '🟢 ส่งข้อมูลแล้ว' : '⚪ ยังไม่ส่ง'}
        </div>
      </div>

      ${resolutionHtml}
      ${allocatedBadgeHtml}
    `;

    DOM.allocationTimeline.appendChild(item);
  });

  // Car Roster Sidebar
  DOM.carRosterList.innerHTML = "";
  for (const key in CARS) {
    const car = CARS[key];
    const winners = rosterByCar[key];
    const card = document.createElement("div");
    card.className = "roster-card";

    let membersListHtml = "";
    if (winners.length > 0) {
      membersListHtml = winners.map(w => `
        <div class="roster-member-item">
          <span><strong class="roster-member-rank">#${w.participant.rank}</strong> ${w.participant.name}</span>
          <span class="roster-choice-tag">ตัวเลือกอันดับ ${w.choiceIndex}</span>
        </div>
      `).join("");
    } else {
      membersListHtml = `<div style="font-size:0.8rem;color:var(--text-muted);padding:4px 0;">ยังไม่มีผู้ได้รับ</div>`;
    }

    card.innerHTML = `
      <div class="roster-header">
        <span class="roster-car-name">${car.name}</span>
        <span class="roster-count">${winners.length} / ${car.quota} คัน</span>
      </div>
      <div class="roster-members">
        ${membersListHtml}
      </div>
    `;
    DOM.carRosterList.appendChild(card);
  }

  // Admin Table (with PIN column)
  DOM.adminTableBody.innerHTML = "";
  results.forEach(res => {
    const p = res.participant;
    const tr = document.createElement("tr");
    const pin = state.pins[p.id] || "1000";

    let pillsHtml = "";
    if (res.hasSubmitted) {
      const prefs = state.preferences[p.id];
      pillsHtml = `<div class="preference-pills">` + prefs.map((k, i) => `
        <span class="pref-mini-pill ${i === 0 ? 'rank-1' : ''}">${i+1}.${CARS[k].name}</span>
      `).join("") + `</div>`;
    } else {
      pillsHtml = `<span style="color:var(--text-muted);font-size:0.8rem;">-</span>`;
    }

    tr.innerHTML = `
      <td><strong style="color:var(--accent-amber)">#${p.rank}</strong></td>
      <td><strong>${p.name}</strong></td>
      <td>
        <span style="font-family:var(--font-heading);font-weight:700;letter-spacing:1px;background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:4px;color:#fff;">
          <i class="fa-solid fa-key" style="font-size:0.7rem;color:var(--accent-amber);margin-right:3px;"></i>${pin}
        </span>
      </td>
      <td>
        <span class="status-pill ${res.hasSubmitted ? 'done' : 'pending'}">
          <i class="fa-solid ${res.hasSubmitted ? 'fa-check' : 'fa-clock'}"></i>
          ${res.hasSubmitted ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}
        </span>
      </td>
      <td>${pillsHtml}</td>
      <td>
        ${res.allocatedCar 
          ? `<strong style="color:var(--accent-cyan)"><i class="fa-solid fa-car"></i> ${res.allocatedCar.name}</strong> <small style="color:var(--text-muted)">(ตัวเลือกอันดับ ${res.choiceIndex})</small>` 
          : '<span style="color:var(--text-muted)">-</span>'}
      </td>
      <td style="text-align: center;">
        <div style="display:flex;gap:6px;justify-content:center;">
          <button class="btn-sm btn-secondary btn-edit-player" data-player-id="${p.id}" title="แก้ไขอันดับ & PIN">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-sm btn-secondary btn-copy-player-link" data-player-id="${p.id}" title="คัดลอกลิงก์ส่งให้สมาชิกคนนี้">
            <i class="fa-solid fa-link"></i>
          </button>
        </div>
      </td>
    `;
    DOM.adminTableBody.appendChild(tr);
  });

  // Attach event handlers to dynamic table buttons
  document.querySelectorAll(".btn-edit-player").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = parseInt(btn.dataset.playerId, 10);
      openAdminEditModal(pId);
    });
  });

  document.querySelectorAll(".btn-copy-player-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const pId = parseInt(btn.dataset.playerId, 10);
      const p = PARTICIPANTS.find(x => x.id === pId);
      const pin = state.pins[pId];
      
      let baseOrigin = window.location.origin + window.location.pathname;
      if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        baseOrigin = 'https://nuttathusch.github.io/kkpd-prize-selection/';
      }
      const url = new URL(baseOrigin);
      url.searchParams.set("player", pId);
      url.searchParams.set("pin", pin);
      
      const copyText = `🏎️ **ลิงก์เลือกของรางวัลสำหรับ:** ${p.name}\n🔗 ลิงก์ตรง: ${url.toString()}\n🔑 รหัส PIN: **${pin}**`;
      
      navigator.clipboard.writeText(copyText).then(() => {
        AudioEngine.play('success');
        showToast(`คัดลอกลิงก์พร้อมรหัส PIN สำหรับ ${p.name} เรียบร้อยแล้ว!`, "success");
      });
    });
  });

  updateAnnouncementText(results);
}

function updateAnnouncementText(results) {
  const submittedTotal = Object.keys(state.preferences).length;
  let text = `📢 **สรุปผลการจัดสรรของรางวัล KKPD SPECIAL EVENT ครั้งที่ 8 (รถ 20 คัน)** 🏎️✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👥 ผู้เข้าร่วมส่งข้อมูลแล้ว: ${submittedTotal}/20 คน\n\n`;

  results.forEach(res => {
    const p = res.participant;
    if (res.allocatedCar) {
      const choiceNote = res.choiceIndex === 1 ? `🥇 (ตัวเลือกอันดับ 1)` : `🎯 (ตัวเลือกอันดับ ${res.choiceIndex})`;
      text += `อันดับ ${p.rank.toString().padStart(2, ' ')}. ${p.name} ➡️ **${res.allocatedCar.name}** ${choiceNote}\n`;
    } else {
      text += `อันดับ ${p.rank.toString().padStart(2, ' ')}. ${p.name} ➡️ ⏳ *ยังไม่ได้ส่งข้อมูล*\n`;
    }
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 **สรุปจำนวนรถแต่ละรุ่น:**\n`;
  for (const key in CARS) {
    const car = CARS[key];
    const winners = results.filter(r => r.allocatedCarKey === key).length;
    text += `• ${car.name}: ${winners}/${car.quota} คัน\n`;
  }

  DOM.announcementText.textContent = text;
}

// ==========================================
// 7. TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'success') {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
    <span>${message}</span>
  `;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// 8. PIN AUTHENTICATION & FORM EVENTS
// ==========================================

function verifyPIN(pId, enteredPin) {
  const correctPin = state.pins[pId];
  if (enteredPin === correctPin || enteredPin === MASTER_ADMIN_PIN) {
    return true;
  }
  return false;
}

function unlockPlayer(pId) {
  state.authenticatedPlayerId = pId;
  const p = PARTICIPANTS.find(x => x.id === pId);
  if (!p) return;

  AudioEngine.play('success');

  // Hide PIN Box and error
  DOM.pinSecurityBox.classList.add("hidden");
  DOM.pinErrorMessage.classList.add("hidden");
  DOM.playerPinInput.value = "";

  // Show Player Info Banner with Auth Badge
  DOM.playerInfoBanner.classList.remove("hidden");
  DOM.bannerRankNum.textContent = `#${p.rank}`;
  DOM.bannerPlayerName.textContent = p.name;
  DOM.btnSubmitPreference.disabled = false;

  // Load existing submission if any
  if (state.preferences[p.id]) {
    DOM.bannerStatusTag.className = "banner-status-tag submitted";
    DOM.bannerStatusTag.innerHTML = `<i class="fa-solid fa-check"></i> ส่งข้อมูลแล้ว (แก้ไขได้)`;
    state.currentFormOrder = [...state.preferences[p.id]];
  } else {
    DOM.bannerStatusTag.className = "banner-status-tag";
    DOM.bannerStatusTag.innerHTML = `<i class="fa-regular fa-clock"></i> ยังไม่ได้ส่งข้อมูล`;
    state.currentFormOrder = [...DEFAULT_CAR_KEYS];
  }

  renderRankingList(DOM.rankingList, state.currentFormOrder, 'form');
  showToast(`🔒 ยืนยันตัวตนสำเร็จ: ยินดีต้อนรับ ${p.name}`, "success");
}

function lockPlayerSelection() {
  state.authenticatedPlayerId = null;
  DOM.playerInfoBanner.classList.add("hidden");
  DOM.btnSubmitPreference.disabled = true;
}

// Player Selection Change
DOM.playerSelect.addEventListener("change", (e) => {
  const pId = parseInt(e.target.value, 10);
  state.selectedPlayerId = pId;
  lockPlayerSelection();

  AudioEngine.play('click');
  DOM.pinSecurityBox.classList.remove("hidden");
  DOM.pinErrorMessage.classList.add("hidden");
  DOM.playerPinInput.value = "";
  DOM.playerPinInput.focus();
});

// Verify PIN Button Click
DOM.btnVerifyPin.addEventListener("click", () => {
  handlePinVerification();
});

// Verify PIN on Enter Key
DOM.playerPinInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handlePinVerification();
  }
});

function handlePinVerification() {
  const pId = state.selectedPlayerId;
  if (!pId) {
    showToast("กรุณาเลือกชื่อของคุณก่อน", "info");
    return;
  }

  const enteredPin = DOM.playerPinInput.value.trim();
  if (!enteredPin) {
    DOM.pinErrorMessage.classList.remove("hidden");
    DOM.pinErrorMessage.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> กรุณากรอกรหัส PIN 4 หลัก`;
    AudioEngine.play('error');
    return;
  }

  if (verifyPIN(pId, enteredPin)) {
    unlockPlayer(pId);
  } else {
    AudioEngine.play('error');
    DOM.pinErrorMessage.classList.remove("hidden");
    DOM.pinErrorMessage.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง`;
    DOM.playerPinInput.classList.add("shake-input");
    setTimeout(() => DOM.playerPinInput.classList.remove("shake-input"), 400);
  }
}

// ==========================================
// 9. EVENT LISTENERS
// ==========================================

// Tab Switching
DOM.tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    AudioEngine.play('click');
    const targetTab = btn.dataset.tab;
    
    DOM.tabBtns.forEach(b => b.classList.remove("active"));
    DOM.tabContents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(targetTab).classList.add("active");

    // Check Admin Tab Protection
    if (targetTab === "tab-admin") {
      if (state.isAdminAuthenticated) {
        DOM.adminLockScreen.classList.add("hidden");
        DOM.adminDashboardContent.classList.remove("hidden");
      } else {
        DOM.adminLockScreen.classList.remove("hidden");
        DOM.adminDashboardContent.classList.add("hidden");
        DOM.adminPasswordError.classList.add("hidden");
        DOM.adminPasswordInput.value = "";
        DOM.adminPasswordInput.focus();
      }
    }
  });
});

// Admin Authentication Handlers
function handleAdminLogin() {
  const enteredPass = DOM.adminPasswordInput.value.trim();
  if (enteredPass === MASTER_ADMIN_PIN) {
    state.isAdminAuthenticated = true;
    DOM.adminLockScreen.classList.add("hidden");
    DOM.adminDashboardContent.classList.remove("hidden");
    DOM.adminPasswordError.classList.add("hidden");
    DOM.adminPasswordInput.value = "";
    AudioEngine.play('success');
    showToast("🔓 เข้าสู่ระบบผู้ดูแล (Admin) สำเร็จแล้ว!", "success");
  } else {
    AudioEngine.play('error');
    DOM.adminPasswordError.classList.remove("hidden");
    DOM.adminPasswordInput.classList.add("shake-input");
    setTimeout(() => DOM.adminPasswordInput.classList.remove("shake-input"), 400);
  }
}

DOM.btnUnlockAdmin.addEventListener("click", () => handleAdminLogin());
DOM.adminPasswordInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") handleAdminLogin();
});

// Admin Logout
DOM.btnLogoutAdmin.addEventListener("click", () => {
  state.isAdminAuthenticated = false;
  DOM.adminLockScreen.classList.add("hidden");
  DOM.adminDashboardContent.classList.add("hidden");
  AudioEngine.play('click');
  showToast("ออกจากระบบผู้ดูแล (Admin) เรียบร้อยแล้ว", "info");
});

// Reset My Choices
DOM.btnResetMyChoices.addEventListener("click", () => {
  AudioEngine.play('click');
  state.currentFormOrder = [...DEFAULT_CAR_KEYS];
  renderRankingList(DOM.rankingList, state.currentFormOrder, 'form');
  showToast("รีเซ็ตลำดับรถเป็นค่าเริ่มต้นแล้ว", "info");
});

// Submit Preference
DOM.btnSubmitPreference.addEventListener("click", () => {
  if (!state.selectedPlayerId || state.authenticatedPlayerId !== state.selectedPlayerId) {
    showToast("กรุณายืนยันรหัส PIN 4 หลักก่อนส่งข้อมูล", "info");
    return;
  }

  const p = PARTICIPANTS.find(x => x.id === state.selectedPlayerId);
  if (!p) return;

  AudioEngine.play('success');

  state.preferences[p.id] = [...state.currentFormOrder];
  state.submissions[p.id] = new Date().toISOString();
  saveState();
  CloudSync.pushUpdate();

  renderFullState();
  initUI(); // refresh select checkmarks

  // Show Receipt Modal
  DOM.receiptPlayerDesc.textContent = `ผู้เข้าร่วม: อันดับ #${p.rank} - ${p.name}`;
  DOM.receiptSummaryBox.innerHTML = state.currentFormOrder.map((key, idx) => `
    <div class="receipt-item">
      <span class="receipt-item-label">ตัวเลือกอันดับ ${idx + 1}:</span>
      <span class="receipt-item-val" style="color:${CARS[key].color}">${CARS[key].name}</span>
    </div>
  `).join("");

  DOM.receiptModal.classList.remove("hidden");
});

DOM.btnCloseReceipt.addEventListener("click", () => {
  AudioEngine.play('click');
  DOM.receiptModal.classList.add("hidden");
  document.getElementById("tabBtnResults").click();
});

DOM.btnEditReceipt.addEventListener("click", () => {
  AudioEngine.play('click');
  DOM.receiptModal.classList.add("hidden");
});

// Sound Toggle
DOM.btnSoundToggle.addEventListener("click", () => {
  state.soundEnabled = !state.soundEnabled;
  saveState();
  if (state.soundEnabled) {
    DOM.soundIcon.className = "fa-solid fa-volume-high";
    AudioEngine.play('click');
    showToast("เปิดเสียงเอฟเฟกต์แล้ว", "info");
  } else {
    DOM.soundIcon.className = "fa-solid fa-volume-xmark";
    showToast("ปิดเสียงแล้ว", "info");
  }
});

// Regenerate All Random PINs
DOM.btnRegeneratePins.addEventListener("click", () => {
  if (confirm("🎲 ต้องการสุ่มรหัส PIN 4 หลักใหม่ทั้งหมดสำหรับผู้เล่นทั้ง 20 คนหรือไม่?")) {
    const used = new Set();
    PARTICIPANTS.forEach(p => {
      const newPin = generateRandom4DigitPin(used);
      used.add(newPin);
      state.pins[p.id] = newPin;
    });

    saveState();
    CloudSync.pushUpdate();
    renderFullState();
    AudioEngine.play('success');
    showToast("สุ่มรหัส PIN 4 หลักใหม่ครบ 20 คนเรียบร้อยแล้ว!", "success");
  }
});

// Copy All PINs for Admin
DOM.btnCopyAllPins.addEventListener("click", () => {
  let pinListText = `🔑 **รายชื่อผู้เข้าร่วม 20 คน พร้อมรหัส PIN 4 หลัก** 🏎️\n`;
  pinListText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  PARTICIPANTS.forEach(p => {
    const pin = state.pins[p.id] || (1000 + p.rank).toString();
    pinListText += `อันดับ ${p.rank.toString().padStart(2, ' ')}. ${p.name} ➡️ รหัส PIN: **${pin}**\n`;
  });
  pinListText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  pinListText += `*(Master Admin PIN: 9936)*`;

  navigator.clipboard.writeText(pinListText).then(() => {
    AudioEngine.play('success');
    showToast("คัดลอกรายชื่อและ PIN ทั้ง 20 คนแล้ว!", "success");
  });
});

// Quick Copy Discord
DOM.btnQuickCopyDiscord.addEventListener("click", () => copyAnnouncement());
DOM.btnCopyAnnouncement.addEventListener("click", () => copyAnnouncement());
DOM.btnCopyPreviewText.addEventListener("click", () => copyAnnouncement());

function copyAnnouncement() {
  const text = DOM.announcementText.textContent;
  navigator.clipboard.writeText(text).then(() => {
    AudioEngine.play('success');
    showToast("คัดลอกข้อความสรุปสำหรับ Discord เรียบร้อยแล้ว!", "success");
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
    showToast("ไม่สามารถคัดลอกได้อัตโนมัติ กรุณากดก็อปปี้เอง", "info");
  });
}

// Generate Demo Data
DOM.btnGenerateDemo.addEventListener("click", () => {
  if (confirm("สร้างข้อมูลจำลองการส่งความต้องการของผู้เข้าร่วมทั้ง 20 คนใช่หรือไม่?")) {
    AudioEngine.play('success');
    
    PARTICIPANTS.forEach(p => {
      const shuffled = [...DEFAULT_CAR_KEYS].sort(() => Math.random() - 0.5);
      state.preferences[p.id] = shuffled;
      state.submissions[p.id] = new Date().toISOString();
    });

    saveState();
    CloudSync.pushUpdate();
    renderFullState();
    initUI();
    showToast("สุ่มข้อมูลตัวอย่างครบ 20 คนสำเร็จแล้ว!", "success");
  }
});

// Reset All Data
DOM.btnResetAll.addEventListener("click", () => {
  if (confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลการเลือกทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
    state.preferences = {};
    state.submissions = {};
    saveState();
    CloudSync.pushUpdate();
    renderFullState();
    initUI();
    showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว", "info");
  }
});

// Manual Cloud Sync Button
if (DOM.btnManualCloudSync) {
  DOM.btnManualCloudSync.addEventListener("click", () => {
    AudioEngine.play('click');
    CloudSync.fetchLatest(false);
  });
}

// Export JSON
DOM.btnExportJSON.addEventListener("click", () => {
  AudioEngine.play('click');
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `kkpd_prize_allocation_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("ส่งออกไฟล์ JSON สำเร็จแล้ว", "success");
});

// Animation Simulation
DOM.btnSimulateAnim.addEventListener("click", () => {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  AudioEngine.play('click');
  let delay = 0;
  items.forEach((item) => {
    setTimeout(() => {
      item.classList.add("active-anim");
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      AudioEngine.play('alloc');

      setTimeout(() => {
        item.classList.remove("active-anim");
      }, 500);
    }, delay);
    delay += 250;
  });
});

// ==========================================
// 10. ADMIN EDIT MODAL
// ==========================================

function openAdminEditModal(playerId) {
  const p = PARTICIPANTS.find(x => x.id === playerId);
  if (!p) return;

  AudioEngine.play('click');
  state.adminEditingPlayerId = playerId;
  DOM.adminModalTitle.textContent = `แก้ไขข้อมูล: อันดับ #${p.rank} - ${p.name}`;
  DOM.adminEditPinInput.value = state.pins[playerId] || (1000 + p.rank).toString();

  if (state.preferences[playerId]) {
    state.adminFormOrder = [...state.preferences[playerId]];
  } else {
    state.adminFormOrder = [...DEFAULT_CAR_KEYS];
  }

  renderRankingList(DOM.adminRankingList, state.adminFormOrder, 'admin');
  DOM.adminEditModal.classList.remove("hidden");
}

DOM.btnCloseAdminModal.addEventListener("click", () => {
  DOM.adminEditModal.classList.add("hidden");
});

DOM.btnCancelAdminEdit.addEventListener("click", () => {
  DOM.adminEditModal.classList.add("hidden");
});

DOM.btnSaveAdminEdit.addEventListener("click", () => {
  if (!state.adminEditingPlayerId) return;
  AudioEngine.play('success');

  const newPin = DOM.adminEditPinInput.value.trim();
  if (newPin && newPin.length === 4) {
    state.pins[state.adminEditingPlayerId] = newPin;
  }

  state.preferences[state.adminEditingPlayerId] = [...state.adminFormOrder];
  state.submissions[state.adminEditingPlayerId] = new Date().toISOString();
  saveState();
  CloudSync.pushUpdate();

  DOM.adminEditModal.classList.add("hidden");
  renderFullState();
  initUI();
  showToast("บันทึกการแก้ไขข้อมูลและรหัส PIN เรียบร้อยแล้ว", "success");
});

// ==========================================
// 11. INITIALIZATION & URL QUERY PARAMS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initUI();
  if (!state.soundEnabled) {
    DOM.soundIcon.className = "fa-solid fa-volume-xmark";
  }

  // Check URL parameters for direct player link (e.g. ?player=1&pin=1001)
  const urlParams = new URLSearchParams(window.location.search);
  const paramPlayerId = urlParams.get("player") || urlParams.get("p") || urlParams.get("id");
  const paramPin = urlParams.get("pin");

  if (paramPlayerId) {
    const pId = parseInt(paramPlayerId, 10);
    if (PARTICIPANTS.some(x => x.id === pId)) {
      DOM.playerSelect.value = pId;
      state.selectedPlayerId = pId;

      if (paramPin && verifyPIN(pId, paramPin)) {
        unlockPlayer(pId);
      } else {
        DOM.playerSelect.dispatchEvent(new Event("change"));
        if (paramPin) {
          DOM.playerPinInput.value = paramPin;
          DOM.btnVerifyPin.click();
        }
      }
    }
  }

  // Click handler on header Cloud Sync badge
  const cloudCard = document.getElementById("cloudSyncStatusCard");
  if (cloudCard) {
    cloudCard.style.cursor = "pointer";
    cloudCard.addEventListener("click", () => {
      AudioEngine.play('click');
      CloudSync.fetchLatest(false);
    });
  }

  // Initial fetch from central Cloud Database
  CloudSync.fetchLatest(true);

  // Auto-sync polling every 3 seconds for real-time updates across all players
  setInterval(() => {
    CloudSync.fetchLatest(true);
  }, 3000);

  window.addEventListener("focus", () => {
    CloudSync.fetchLatest(true);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      CloudSync.fetchLatest(true);
    }
  });

  // Check Admin URL parameter (e.g. ?admin=9936)
  const paramAdmin = urlParams.get("admin");
  if (paramAdmin && paramAdmin === MASTER_ADMIN_PIN) {
    state.isAdminAuthenticated = true;
    showToast("🔑 ปลดล็อกสิทธิ์ Admin อัตโนมัติแล้ว", "info");
  }

  // Initialize Tab 4 Master Data
  initMasterData();
});

// ==========================================
// ==========================================
// 12. TAB 4: MASTER VEHICLE OWNERSHIP DATABASE
// ==========================================

const ALL_MODELS_CONFIG = {
  Sugoi: { name: "Sugoi", icon: "fa-car-side", color: "#38bdf8" },
  Visione: { name: "Visione", icon: "fa-bolt", color: "#e879f9" },
  R32: { name: "Elegy R32", icon: "fa-flag-checkered", color: "#34d399" },
  Banshee: { name: "Banshee 900R", icon: "fa-gauge-high", color: "#f87171" },
  T20: { name: "Progen T20", icon: "fa-fire", color: "#fb923c" },
  C8: { name: "Corvette C8", icon: "fa-car-side", color: "#facc15" },
  Corsita: { name: "Corsita", icon: "fa-gem", color: "#a78bfa" },
  Furia: { name: "Grotti Furia", icon: "fa-shield-halved", color: "#f43f5e" },
  I8: { name: "BMW i8", icon: "fa-cloud", color: "#60a5fa" },
  Turismo3: { name: "Turismo 3", icon: "fa-road", color: "#fb923c" },
  Kuruma: { name: "Kuruma", icon: "fa-shield-cat", color: "#4ade80" },
  Thrax: { name: "Trufade Thrax", icon: "fa-crown", color: "#c084fc" },
  Mustang: { name: "Mustang", icon: "fa-horse", color: "#fb7185" },
  ADMTour: { name: "ADM Tour Bus", icon: "fa-van-shuttle", color: "#94a3b8" },
  Other: { name: "อื่นๆ / ไม่ระบุ", icon: "fa-car", color: "#64748b" }
};

const MASTER_ALL_VEHICLES = [
  {
    "plate": "KKPD 00",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Txrbo",
    "old_plate": "HEKG 874",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 01",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Txrbo",
    "old_plate": "ZTTX 331",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 02",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Txrbo",
    "old_plate": "LBNJ 852",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 03",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sakkarin",
    "old_plate": "OFKH 751",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 04",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Sakkarin",
    "old_plate": "TSAK 963",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 05",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "JaJa",
    "old_plate": "TBDN 000",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 06",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "JaJa",
    "old_plate": "POCC 838",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 07",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Suwit",
    "old_plate": "NOWT 707",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 08",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Suwit",
    "old_plate": "GWZH 707",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 09",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Akki",
    "old_plate": "UEQL 016",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 10",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Akki",
    "old_plate": "FBXE 610",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 11",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thoshilo",
    "old_plate": "EPMF 589",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 12",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Thoshilo",
    "old_plate": "FYTW 755",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 13",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "MiLO",
    "old_plate": "YRBR 888",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 14",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "MiLO",
    "old_plate": "ONDZ 333",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 15",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sumoil",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 16",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Sumoil",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 17",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Scandally",
    "old_plate": "VUNN 830",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 18",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Scandally",
    "old_plate": "AGQS 916",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 19",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Georgie",
    "old_plate": "BSUS 595",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 20",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Georgie",
    "old_plate": "SOZZ 824",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 21",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dark",
    "old_plate": "WWIA 638",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 22",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Dark",
    "old_plate": "TYDV 701",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 23",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tatto",
    "old_plate": "XCGX 555",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 24",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Tatto",
    "old_plate": "TAOM 710",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 25",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chanchai",
    "old_plate": "UPAR 457",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 26",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Chanchai",
    "old_plate": "VEXP 197",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 27",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Eric",
    "old_plate": "GBSR 555",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 28",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Eric",
    "old_plate": "RRMU 730",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 29",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tom",
    "old_plate": "TQMS 313",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 30",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Tom",
    "old_plate": "NCHE 001",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 31",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jame",
    "old_plate": "MHBH 007",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 32",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Jame",
    "old_plate": "YYII 009",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 33",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khummuen",
    "old_plate": "KCGN 874",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 34",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Khummuen",
    "old_plate": "JGIW 394",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 35",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Freddy",
    "old_plate": "FEXB 624",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 36",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Freddy",
    "old_plate": "CRWI 666",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 37",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jack",
    "old_plate": "BZCN 797",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 38",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "jack",
    "old_plate": "ZLYX 001",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 39",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mateo",
    "old_plate": "IVNO 110",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 40",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Mateo",
    "old_plate": "CBPP 006",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 41",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Alex",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 42",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dew",
    "old_plate": "DEEW 574",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 43",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Home",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 44",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "phet",
    "old_plate": "HDYA 519",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 45",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "smoky",
    "old_plate": "TVOY 747",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 46",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chucky",
    "old_plate": "IHRO 240",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 47",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "zendo",
    "old_plate": "IDHY 872",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 48",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "pluto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 49",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ronin",
    "old_plate": "BBIL000",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 50",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Copper",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 51",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baygon",
    "old_plate": "OWIV 116",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 52",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mini",
    "old_plate": "MBQR 017",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 53",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yoare",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 54",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Burapha",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 55",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Borsalino",
    "old_plate": "LJLM778",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 56",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snape",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 57",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 58",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "WHY",
    "old_plate": "VRKX 520",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 59",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Winter",
    "old_plate": "EBDT 801",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 60",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "khoompaa",
    "old_plate": "WOVE 315",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 61",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yam",
    "old_plate": "LSDW 444",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 62",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khaijeow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 63",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "alice",
    "old_plate": "PSXR 439",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 64",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Punrums",
    "old_plate": "UCCE 277",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 65",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Honey",
    "old_plate": "ROKP 631",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 66",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bel",
    "old_plate": "QFQO 452",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 67",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jinjun",
    "old_plate": "CRTD 343",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 68",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Palaloy",
    "old_plate": "BTIK 888",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 69",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lpa",
    "old_plate": "JEAA 712",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 70",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Root",
    "old_plate": "MWFX 404",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 71",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Giraffe",
    "old_plate": "JCBK 754",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 72",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sakda",
    "old_plate": "HCYU 106",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 73",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Cinrata",
    "old_plate": "KIJZ 890",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 74",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kluay",
    "old_plate": "QNSL818",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 75",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kluay",
    "old_plate": "VAAN464",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 76",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Doy",
    "old_plate": "ITJM 881",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 77",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Harper Harp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 78",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 79",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chanom Kaimook",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 80",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khaijiao Motalino",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 81",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kung Nahmungsri",
    "old_plate": "FONP 895",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 82",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Padungpol Somsom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 83",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Photo mini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 84",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Rachada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 85",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jud Jang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 86",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Dew",
    "old_plate": "MPLL 008",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 87",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CJ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 88",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "CJ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 89",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Darren",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 90",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nitro J kiss",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 91",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Jaman",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 92",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Krating",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 93",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kai Yoi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 94",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doom Dam",
    "old_plate": "AQIM 725",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 95",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chalong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 96",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DEMO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 97",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khun Na Bangkok",
    "old_plate": "WDLM 954",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 98",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 99",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Yam",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 100",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Chucky",
    "old_plate": "TCBA448",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 101",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Norun Theejingjai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 102",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SongG Cassano",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 103",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tod",
    "old_plate": "OVDJ 346",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 104",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thongdee",
    "old_plate": "URAN 764",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 105",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tony",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 106",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Numnung",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 107",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "MiLo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 108",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 109",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Suwit.S",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 110",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "James Norrington",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 111",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 112",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mini chabuu",
    "old_plate": "AMNB 837",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 113",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "John Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 114",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Tatto Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 115",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Sakkarin Dowlie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 116",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 117",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 118",
    "model": "Kuruma",
    "raw_model": "Kurumapd",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 119",
    "model": "Kuruma",
    "raw_model": "Kurumapd",
    "name": "Harper Harp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 120",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "smoky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 121",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Chayen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 122",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Somtui",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 123",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "LiLKKRIRK",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 124",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "MilLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 125",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Somtui",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 126",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Brave",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 127",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Oil Ler",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 128",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snim Croft",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 129",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 130",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 131",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Chucky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 132",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 133",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 134",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 135",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 136",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Luke",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 137",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 138",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Mini chabuu",
    "old_plate": "BIRZ 801",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 139",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 140",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 141",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 142",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Baron Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 143",
    "model": "Mustang",
    "raw_model": "Mustang",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 144",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CYen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 145",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Recker",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 146",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doktone",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 147",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ไม่ระบุชื่อ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 148",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kaoraw",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 149",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lukso",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 150",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mheewai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 151",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mhee Naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 152",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 153",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tag",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 154",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ailap",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 155",
    "model": "R32",
    "raw_model": "R32",
    "name": "Snim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 156",
    "model": "R32",
    "raw_model": "R32",
    "name": "Cyan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 157",
    "model": "R32",
    "raw_model": "R32",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 158",
    "model": "R32",
    "raw_model": "R32",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 159",
    "model": "R32",
    "raw_model": "R32",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 160",
    "model": "R32",
    "raw_model": "R32",
    "name": "John",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 161",
    "model": "R32",
    "raw_model": "R32",
    "name": "Chucky",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 162",
    "model": "R32",
    "raw_model": "R32",
    "name": "Brave",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 163",
    "model": "R32",
    "raw_model": "R32",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 164",
    "model": "R32",
    "raw_model": "R32",
    "name": "Lukso",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 165",
    "model": "R32",
    "raw_model": "R32",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 166",
    "model": "R32",
    "raw_model": "R32",
    "name": "DOOM",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 167",
    "model": "R32",
    "raw_model": "R32",
    "name": "Key",
    "old_plate": "",
    "source": "existing",
    "note": "ออก"
  },
  {
    "plate": "KKPD 168",
    "model": "R32",
    "raw_model": "R32",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 169",
    "model": "R32",
    "raw_model": "R32",
    "name": "Jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 170",
    "model": "R32",
    "raw_model": "R32",
    "name": "Dew",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 171",
    "model": "R32",
    "raw_model": "R32",
    "name": "Suwit.S",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 172",
    "model": "R32",
    "raw_model": "R32",
    "name": "Jaja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 173",
    "model": "R32",
    "raw_model": "R32",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 174",
    "model": "R32",
    "raw_model": "R32",
    "name": "luke",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 175",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Niran",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 176",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Roo Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 177",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Menz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 178",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Hinata",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 179",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jinny",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 180",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ploy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 181",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bacon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 182",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "RPure",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 183",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 184",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jawbong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 185",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 186",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 187",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 188",
    "model": "R32",
    "raw_model": "R32",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 189",
    "model": "T20",
    "raw_model": "T20",
    "name": "ไม่ระบุชื่อ",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 190",
    "model": "T20",
    "raw_model": "T20",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 191",
    "model": "T20",
    "raw_model": "T20",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 192",
    "model": "T20",
    "raw_model": "T20",
    "name": "Minichabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 193",
    "model": "T20",
    "raw_model": "T20",
    "name": "Dew",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 194",
    "model": "T20",
    "raw_model": "T20",
    "name": "Roo Ratchada",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 195",
    "model": "T20",
    "raw_model": "T20",
    "name": "THoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 196",
    "model": "T20",
    "raw_model": "T20",
    "name": "Lpa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 197",
    "model": "T20",
    "raw_model": "T20",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 198",
    "model": "T20",
    "raw_model": "T20",
    "name": "jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 199",
    "model": "T20",
    "raw_model": "T20",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 200",
    "model": "T20",
    "raw_model": "T20",
    "name": "JaJa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 201",
    "model": "T20",
    "raw_model": "T20",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 202",
    "model": "T20",
    "raw_model": "T20",
    "name": "Root Kim Mein",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 203",
    "model": "T20",
    "raw_model": "T20",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 204",
    "model": "T20",
    "raw_model": "T20",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 205",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 206",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Shai Spenser",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 207",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 208",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 209",
    "model": "Thrax",
    "raw_model": "Thrax",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 210",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 211",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Anwar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 212",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Anwar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 213",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 214",
    "model": "Turismo3",
    "raw_model": "Turismo3pd",
    "name": "Shai Spenser",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 215",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Samuel Hiclass",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 216",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SEA Diswxrd",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 217",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Rai Ford",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 218",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Enzo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 219",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "JR. Exces",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 220",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tow cola",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 221",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Higheak Jayce",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 222",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Chanom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 223",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mano Yawnan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 224",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "John R",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 225",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Leo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 226",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Black TalkAlot",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 227",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Paulita Stephen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 228",
    "model": "I8",
    "raw_model": "I8",
    "name": "Samuel Hiclass",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 229",
    "model": "I8",
    "raw_model": "I8",
    "name": "Ares Pipe Targaryenx",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 230",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kush cake",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 231",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "wasan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 232",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "VARI SNOW",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 233",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Thoy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 234",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Koe Burapha",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 235",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Doom Dam",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 236",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 237",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "NYXARIA",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 238",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Karl",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 239",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 240",
    "model": "Thrax",
    "raw_model": "Thrax",
    "name": "jaja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 241",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Higheak Jayce",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 242",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Raijin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 243",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CIGAR",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 244",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Shadow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 245",
    "model": "Visione",
    "raw_model": "Vision",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 246",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Angelica Eve",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 247",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Ukalyp Tus",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 248",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 249",
    "model": "Corsita",
    "raw_model": "Corsitapd",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 250",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Leo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 251",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 252",
    "model": "R32",
    "raw_model": "R32",
    "name": "jinjun",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 253",
    "model": "R32",
    "raw_model": "R32",
    "name": "moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 254",
    "model": "R32",
    "raw_model": "R32",
    "name": "lpa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 255",
    "model": "T20",
    "raw_model": "T20",
    "name": "Black",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 256",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Babe",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 257",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kylie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 258",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mmauut",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 259",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Naruto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 260",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "REX",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 261",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Thomas",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 262",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Pleak Somsom",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 263",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "BARon kennedy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 264",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tony Lohittawan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 265",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SI LINDA",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 266",
    "model": "C8",
    "raw_model": "c8",
    "name": "Ainz",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 267",
    "model": "C8",
    "raw_model": "c8",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 268",
    "model": "C8",
    "raw_model": "c8",
    "name": "Karl Heisenerg",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 269",
    "model": "C8",
    "raw_model": "c8",
    "name": "Jawbong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 270",
    "model": "C8",
    "raw_model": "c8",
    "name": "Jack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 271",
    "model": "C8",
    "raw_model": "c8",
    "name": "Tawanchai",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 272",
    "model": "C8",
    "raw_model": "c8",
    "name": "Baron",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 273",
    "model": "C8",
    "raw_model": "c8",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 274",
    "model": "C8",
    "raw_model": "c8",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 275",
    "model": "C8",
    "raw_model": "c8",
    "name": "Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 276",
    "model": "C8",
    "raw_model": "c8",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 277",
    "model": "C8",
    "raw_model": "c8",
    "name": "Hmee naja",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 278",
    "model": "C8",
    "raw_model": "c8",
    "name": "Winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 279",
    "model": "C8",
    "raw_model": "c8",
    "name": "WHY",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 280",
    "model": "C8",
    "raw_model": "c8",
    "name": "JaJa",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 281",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Din",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 282",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PGOlf",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 283",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "KOiiJi koji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 284",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nueaynai Sosleep",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 285",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "YIFan",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 286",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Rice Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 287",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bravo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 288",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Wendy",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 289",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jin Jin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 290",
    "model": "I8",
    "raw_model": "I8",
    "name": "Milo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 291",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "White Waikonloei",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 292",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 293",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mello",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 294",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "winter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 295",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Snim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 296",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "song",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 297",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "LAZER Dim",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 298",
    "model": "ADMTour",
    "raw_model": "ADMTour",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 299",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Ainz D. Camillos",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 300",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "JaJa Osi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 301",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 302",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 303",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "WHY WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 304",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Jack Barrett",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 305",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Lpa PaLong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 306",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mateo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 307",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mello",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 308",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Mini chabuu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 309",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "MOJI WANG JEXNG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 310",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 311",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Tatto",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 312",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "WHITE Waikonloei",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 313",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "MiLO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 314",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tiger Chaps",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 315",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Summer",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 316",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "ROOT Kim Mein",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 317",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ahngoon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 318",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Margie",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 319",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Bel Grindel",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 320",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FabioJin Vincenzo",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 321",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "GET",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 322",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "XANO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 323",
    "model": "I8",
    "raw_model": "I8",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 324",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "Na-mhee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 325",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kimmy Qiis",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 326",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Brave Starter",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 327",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "NamNungs",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 328",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Lpa PaLong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 329",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "TSUSHIMA KOJI",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 330",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Phakhawin KTWOB",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 331",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Marn Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 332",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Owen Sunshine",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 333",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mikeiyw tomyum",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 334",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Yasen",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 335",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Reggie Mesnack",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 336",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ITO Vindecia",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 337",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DINO CAVALLONE",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 338",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Willeam Stxxrmborn",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 339",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Misterchai madhu",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 340",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jeff Forger",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 341",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "KaiR Raku",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 342",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mendi Kolalov",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 343",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sink SR",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 344",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "SUXSON W LESOO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 345",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Seua Sakphong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 346",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Cedric Diff",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 347",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Penguin Penguin",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 348",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "ERIKA CLAUS",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 349",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kenta Agela",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 350",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Supakorn Zaewang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 351",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Light Room",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 352",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "BRA Code",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 353",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FilM KUB",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 354",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Blackb winterstar",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 355",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jame Roland",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 356",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Claren Ratana",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 357",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Sky Blue",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 358",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Toshiuya Moji",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 359",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Marcus Punpoon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 360",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PEAYIM MUSAP",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 361",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Zeen Zable",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 362",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jackie Phanakorn",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 363",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "CHALAM NOI",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 364",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jay Horizon",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 365",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khunkhai Inoue",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 366",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Ball Money",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 367",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Mooping XVVV",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 368",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Nxme Dukduk",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 369",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Qiling Zhang",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 370",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jaturong Horsepower",
    "old_plate": "",
    "source": "existing",
    "note": "รอเปลี่ยน"
  },
  {
    "plate": "KKPD 371",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "John Doe",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 372",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Asgard Deejingjing",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 373",
    "model": "Visione",
    "raw_model": "Visione",
    "name": "Ukalyp",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 374",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "khai yoi",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 375",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "mon thong",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 376",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "six oliver",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 377",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jojo never",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 378",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Dos padriw",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 379",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "jonathan sawagkata",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 380",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Crane Field",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 381",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Win uppercat",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 382",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Lux Xhuries",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 383",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Pucca Heart",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 384",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "PP Marshmellow",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 385",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "First Uppercat",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 386",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Zubie Foust",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 387",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Peti Vidyard",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 388",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Khana Fahwabwab",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 389",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "DILLAN BRAGG",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 390",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "FRANKY GAVITO",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 391",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Tapra Ruck",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 392",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jigsaw Bellini",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 393",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Phak Bandoleros",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 394",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Eclair Jphnsmith",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 395",
    "model": "Other",
    "raw_model": "",
    "name": "Milo",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 396",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Gaiar Marzano",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 397",
    "model": "Other",
    "raw_model": "",
    "name": "Brown Nie",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 398",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Alone Leet",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 399",
    "model": "Other",
    "raw_model": "",
    "name": "Alone Leet",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 400",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Bualoy Suwanphakdee",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 401",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Aurora Mars",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 402",
    "model": "Other",
    "raw_model": "",
    "name": "King",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 403",
    "model": "Other",
    "raw_model": "",
    "name": "Resoa",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 404",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Jungji xers",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 405",
    "model": "Sugoi",
    "raw_model": "Sugoi",
    "name": "Kkr Kaliona",
    "old_plate": "",
    "source": "existing",
    "note": "ข้อมูลเดิม"
  },
  {
    "plate": "KKPD 406",
    "model": "I8",
    "raw_model": "I8",
    "name": "NoeyWhan Bakery",
    "old_plate": "",
    "source": "existing",
    "note": "*Tebex"
  },
  {
    "plate": "KKPD 407",
    "model": "C8",
    "raw_model": "C8",
    "name": "[kkpd]sakkarin dowlie",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 1)"
  },
  {
    "plate": "KKPD 408",
    "model": "C8",
    "raw_model": "C8",
    "name": "[KKPD] Kimmy Siriphapa",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 2)"
  },
  {
    "plate": "KKPD 409",
    "model": "C8",
    "raw_model": "C8",
    "name": "[KKPD] KHUNKHAI Eisenwall",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 3)"
  },
  {
    "plate": "KKPD 410",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Seua Osi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 4)"
  },
  {
    "plate": "KKPD 411",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Kair Osi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 5)"
  },
  {
    "plate": "KKPD 412",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Chalam Noi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 6)"
  },
  {
    "plate": "KKPD 413",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Kkr Kaliona",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 7)"
  },
  {
    "plate": "KKPD 414",
    "model": "Banshee",
    "raw_model": "Banshee",
    "name": "[KKPD] Tarik Monique",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 8)"
  },
  {
    "plate": "KKPD 415",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD] ASGARD DEEJINGJING",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 9)"
  },
  {
    "plate": "KKPD 416",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD] Chanom Howzler",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 10)"
  },
  {
    "plate": "KKPD 417",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Song Marzano",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 11)"
  },
  {
    "plate": "KKPD 418",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] John Doe",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 12)"
  },
  {
    "plate": "KKPD 419",
    "model": "T20",
    "raw_model": "T20",
    "name": "[KKPD]Dillan Bragg",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 13)"
  },
  {
    "plate": "KKPD 420",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Milo Emilian Marquez",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 14)"
  },
  {
    "plate": "KKPD 421",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Thoshilo Bakery",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 15)"
  },
  {
    "plate": "KKPD 422",
    "model": "Corsita",
    "raw_model": "Corsita",
    "name": "[KKPD] Pucca Kor IGjaOcRoi",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 16)"
  },
  {
    "plate": "KKPD 423",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Akki Autsawapatcharakul",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 17)"
  },
  {
    "plate": "KKPD 424",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] LAZER DIM",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 18)"
  },
  {
    "plate": "KKPD 425",
    "model": "R32",
    "raw_model": "R32",
    "name": "[KKPD] Gaiar OsiMarzanoJingjing",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 19)"
  },
  {
    "plate": "KKPD 426",
    "model": "Furia",
    "raw_model": "Furia",
    "name": "[KKPD] Khana Fahwabwab",
    "old_plate": "",
    "source": "event8",
    "note": "🌟 Event 8 (อันดับ 20)"
  }
];

let masterState = {
  search: "",
  filter: "all",
  view: "vehicles" // 'vehicles' | 'members' | 'model'
};

function initMasterData() {
  renderMasterBadges();
  renderMasterFilterChips();
  renderMasterView();

  const searchInput = document.getElementById("masterSearchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  const btnViewVehicles = document.getElementById("btnViewVehicles");
  const btnViewMembers = document.getElementById("btnViewMembers");
  const btnViewModel = document.getElementById("btnViewModel");
  const btnCopyMasterDiscord = document.getElementById("btnCopyMasterDiscord");
  const btnExportMasterCSV = document.getElementById("btnExportMasterCSV");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      masterState.search = e.target.value.trim().toLowerCase();
      if (masterState.search) {
        btnClearSearch.classList.remove("hidden");
      } else {
        btnClearSearch.classList.add("hidden");
      }
      renderMasterView();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      searchInput.value = "";
      masterState.search = "";
      btnClearSearch.classList.add("hidden");
      renderMasterView();
      searchInput.focus();
    });
  }

  if (btnViewVehicles && btnViewMembers && btnViewModel) {
    btnViewVehicles.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewVehicles.classList.add("active");
      btnViewMembers.classList.remove("active");
      btnViewModel.classList.remove("active");
      document.getElementById("masterVehiclesView").classList.remove("hidden");
      document.getElementById("masterMembersView").classList.add("hidden");
      document.getElementById("masterModelView").classList.add("hidden");
      masterState.view = "vehicles";
    });

    btnViewMembers.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewMembers.classList.add("active");
      btnViewVehicles.classList.remove("active");
      btnViewModel.classList.remove("active");
      document.getElementById("masterMembersView").classList.remove("hidden");
      document.getElementById("masterVehiclesView").classList.add("hidden");
      document.getElementById("masterModelView").classList.add("hidden");
      masterState.view = "members";
    });

    btnViewModel.addEventListener("click", () => {
      AudioEngine.play('click');
      btnViewModel.classList.add("active");
      btnViewVehicles.classList.remove("active");
      btnViewMembers.classList.remove("active");
      document.getElementById("masterModelView").classList.remove("hidden");
      document.getElementById("masterVehiclesView").classList.add("hidden");
      document.getElementById("masterMembersView").classList.add("hidden");
      masterState.view = "model";
    });
  }

  if (btnCopyMasterDiscord) {
    btnCopyMasterDiscord.addEventListener("click", () => {
      AudioEngine.play('success');
      copyMasterDataDiscord();
    });
  }

  if (btnExportMasterCSV) {
    btnExportMasterCSV.addEventListener("click", () => {
      AudioEngine.play('success');
      exportMasterDataCSV();
    });
  }
}

function renderMasterBadges() {
  const container = document.getElementById("masterCarBadgesRow");
  if (!container) return;

  const counts = {};
  MASTER_ALL_VEHICLES.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
  });

  // Update Stats Cards
  const statTotalCars = document.getElementById("statTotalCars");
  const statTotalMembers = document.getElementById("statTotalMembers");
  const statMultiCarMembers = document.getElementById("statMultiCarMembers");

  const memberSet = new Set();
  const memberCounts = {};
  MASTER_ALL_VEHICLES.forEach(v => {
    memberSet.add(v.name);
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });
  const multiCount = Object.values(memberCounts).filter(c => c >= 2).length;

  if (statTotalCars) statTotalCars.innerHTML = `${MASTER_ALL_VEHICLES.length} <small>คัน</small>`;
  if (statTotalMembers) statTotalMembers.innerHTML = `${memberSet.size} <small>คน</small>`;
  if (statMultiCarMembers) statMultiCarMembers.innerHTML = `${multiCount} <small>คน</small>`;

  container.innerHTML = "";
  const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));

  sortedModels.forEach(key => {
    const conf = ALL_MODELS_CONFIG[key] || { name: key, icon: "fa-car", color: "#38bdf8" };
    const badge = document.createElement("div");
    badge.className = "master-car-badge";
    badge.style.setProperty("--car-color", conf.color);
    badge.innerHTML = `
      <span class="master-car-badge-name"><i class="fa-solid ${conf.icon}"></i> ${conf.name}</span>
      <span class="master-car-badge-count">${counts[key] || 0} คัน</span>
    `;

    badge.addEventListener("click", () => {
      const chip = document.querySelector(`#masterFilterChips .filter-chip[data-filter="${key}"]`);
      if (chip) chip.click();
    });

    container.appendChild(badge);
  });
}

function renderMasterFilterChips() {
  const container = document.getElementById("masterFilterChips");
  if (!container) return;

  const counts = {};
  let event8Count = 0;
  MASTER_ALL_VEHICLES.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
    if (v.source === "event8") event8Count++;
  });

  const memberCounts = {};
  MASTER_ALL_VEHICLES.forEach(v => {
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });
  const multiCount = Object.values(memberCounts).filter(c => c >= 2).length;

  const chips = [
    { key: "all", label: `ทั้งหมด (${MASTER_ALL_VEHICLES.length})` },
    { key: "event8", label: `🌟 จาก Event 8 (${event8Count})` },
    { key: "multi", label: `⚡ มี 2+ คัน (${multiCount})` }
  ];

  const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
  sortedModels.forEach(m => {
    chips.push({ key: m, label: `${ALL_MODELS_CONFIG[m]?.name || m} (${counts[m]})` });
  });

  container.innerHTML = chips.map((c) => `
    <button class="filter-chip ${c.key === masterState.filter ? 'active' : ''}" data-filter="${c.key}">${c.label}</button>
  `).join("");

  container.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      AudioEngine.play('click');
      container.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      chip.classList.add("active");
      masterState.filter = chip.dataset.filter;
      renderMasterView();
    });
  });
}

function getFilteredVehicles() {
  const memberCounts = {};
  MASTER_ALL_VEHICLES.forEach(v => {
    memberCounts[v.name] = (memberCounts[v.name] || 0) + 1;
  });

  return MASTER_ALL_VEHICLES.filter(item => {
    // Search match
    if (masterState.search) {
      const q = masterState.search;
      const nameMatch = item.name.toLowerCase().includes(q);
      const plateMatch = item.plate.toLowerCase().includes(q);
      const oldPlateMatch = item.old_plate.toLowerCase().includes(q);
      const modelMatch = item.model.toLowerCase().includes(q) || (ALL_MODELS_CONFIG[item.model]?.name || "").toLowerCase().includes(q);
      const noteMatch = item.note.toLowerCase().includes(q);
      if (!nameMatch && !plateMatch && !oldPlateMatch && !modelMatch && !noteMatch) return false;
    }

    // Filter match
    if (masterState.filter === "all") return true;
    if (masterState.filter === "event8") return item.source === "event8";
    if (masterState.filter === "multi") return (memberCounts[item.name] || 0) >= 2;
    return item.model === masterState.filter;
  });
}

function renderMasterView() {
  const filteredVehicles = getFilteredVehicles();
  renderMasterVehiclesTable(filteredVehicles);
  renderMasterMembersTable(filteredVehicles);
  renderMasterModelRosters(filteredVehicles);
}

function renderMasterVehiclesTable(list) {
  const tbody = document.getElementById("masterVehiclesTableBody");
  const countEl = document.getElementById("countViewVehicles");
  if (countEl) countEl.innerText = list.length;
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--text-muted); font-size:0.95rem;">🔍 ไม่พบข้อมูลทะเบียนรถที่ตรงกับเงื่อนไขการค้นหา</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((item, idx) => {
    const conf = ALL_MODELS_CONFIG[item.model] || { name: item.model, icon: "fa-car", color: "#38bdf8" };
    const isEvent8 = item.source === "event8";

    let sourceClass = "existing";
    let sourceLabel = item.note || "ข้อมูลเดิม";
    if (isEvent8) {
      sourceClass = "event8";
      sourceLabel = item.note;
    }

    return `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-family: var(--font-heading); font-weight:700;">${idx + 1}</td>
        <td style="text-align: center;">
          <div class="plate-pill ${isEvent8 ? 'event8' : ''}">
            <i class="fa-solid fa-id-card"></i> ${item.plate}
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid ${conf.icon}" style="color:${conf.color}; font-size:0.9rem;"></i>
            <span style="font-weight:600; color:#fff;">${conf.name}</span>
          </div>
        </td>
        <td style="font-weight: 600; color: var(--text-primary);">${item.name}</td>
        <td style="text-align: center; color: var(--text-secondary); font-family: var(--font-heading); font-size:0.85rem;">${item.old_plate || '-'}</td>
        <td>
          <span class="source-badge ${sourceClass}">${sourceLabel}</span>
        </td>
      </tr>
    `;
  }).join("");
}

function renderMasterMembersTable(list) {
  const tbody = document.getElementById("masterMembersTableBody");
  const countEl = document.getElementById("countViewMembers");
  if (!tbody) return;

  // Group by member
  const map = new Map();
  list.forEach(v => {
    if (!map.has(v.name)) {
      map.set(v.name, []);
    }
    map.get(v.name).push(v);
  });

  const memberList = Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  if (countEl) countEl.innerText = memberList.length;

  if (!memberList.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:36px; color:var(--text-muted); font-size:0.95rem;">🔍 ไม่พบรายชื่อสมาชิกที่ตรงกับเงื่อนไขการค้นหา</td></tr>`;
    return;
  }

  tbody.innerHTML = memberList.map(([memberName, cars], idx) => {
    const hasEvent8 = cars.some(c => c.source === "event8");
    const hasExisting = cars.some(c => c.source === "existing");
    let sourceBadge = `<span class="source-badge existing">เดิม</span>`;
    if (hasEvent8 && hasExisting) {
      sourceBadge = `<span class="source-badge both">เดิม + Event 8</span>`;
    } else if (hasEvent8) {
      sourceBadge = `<span class="source-badge event8">Event 8</span>`;
    }

    const carPills = cars.map(c => {
      const conf = ALL_MODELS_CONFIG[c.model] || { name: c.model, color: "#38bdf8" };
      return `
        <div style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-surface); padding:4px 10px; border-radius:6px; border:1px solid var(--border-subtle); margin:2px 4px;">
          <span style="font-size:0.8rem; font-weight:700; color:${conf.color};">${conf.name}</span>
          <div class="plate-pill ${c.source === 'event8' ? 'event8' : ''}" style="padding:1px 6px; font-size:0.68rem;"><i class="fa-solid fa-id-card"></i> ${c.plate}</div>
        </div>
      `;
    }).join("");

    return `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-family: var(--font-heading); font-weight:700;">${idx + 1}</td>
        <td style="font-weight: 700; color: #fff; font-size:0.95rem;">${memberName}</td>
        <td style="text-align: center;">
          <span class="badge-total-cars ${cars.length >= 2 ? 'multi' : 'single'}">${cars.length} คัน</span>
        </td>
        <td>
          <div style="display:flex; flex-wrap:wrap; gap:4px;">${carPills}</div>
        </td>
        <td>${sourceBadge}</td>
      </tr>
    `;
  }).join("");
}

function renderMasterModelRosters(list) {
  const container = document.getElementById("modelRosterGrid");
  const countEl = document.getElementById("countViewModel");
  if (!container) return;

  const modelMap = {};
  list.forEach(v => {
    if (!modelMap[v.model]) modelMap[v.model] = [];
    modelMap[v.model].push(v);
  });

  const activeModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (modelMap[m] && modelMap[m].length > 0) || masterState.filter === m);
  if (countEl) countEl.innerText = activeModels.length;

  container.innerHTML = "";
  if (!activeModels.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">🔍 ไม่พบรุ่นรถที่ตรงกับเงื่อนไข</div>`;
    return;
  }

  activeModels.forEach(modelKey => {
    const conf = ALL_MODELS_CONFIG[modelKey] || { name: modelKey, icon: "fa-car", color: "#38bdf8" };
    const owners = modelMap[modelKey] || [];

    const card = document.createElement("div");
    card.className = "model-roster-card";
    card.style.setProperty("--car-color", conf.color);

    card.innerHTML = `
      <div class="model-roster-header">
        <div class="model-roster-title">
          <i class="fa-solid ${conf.icon}" style="color:${conf.color}"></i>
          <span>${conf.name}</span>
        </div>
        <span class="model-roster-count">${owners.length} คัน</span>
      </div>
      <div class="model-roster-owners-list">
        ${owners.length ? owners.map((o, i) => `
          <div class="model-owner-item">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--text-muted); font-size:0.75rem; min-width:20px;">${i + 1}.</span>
              <span class="model-owner-name">${o.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <div class="plate-pill ${o.source === 'event8' ? 'event8' : ''}"><i class="fa-solid fa-id-card"></i> ${o.plate}</div>
              <span class="source-badge ${o.source === 'event8' ? 'event8' : 'existing'}">${o.source === 'event8' ? 'Event 8' : 'เดิม'}</span>
            </div>
          </div>
        `).join("") : `<div style="color:var(--text-muted); text-align:center; padding:20px 0;">ไม่มีรายชื่อที่ตรงกับเงื่อนไข</div>`}
      </div>
    `;

    container.appendChild(card);
  });
}

function copyMasterDataDiscord() {
  let text = `📊 **สรุปฐานข้อมูลทะเบียนรถ KKPD Master Vehicle Database (รวม ${MASTER_ALL_VEHICLES.length} คัน / 306 สมาชิก)** 🏎️✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const counts = {};
  MASTER_ALL_VEHICLES.forEach(v => {
    counts[v.model] = (counts[v.model] || 0) + 1;
  });

  const sortedModels = Object.keys(ALL_MODELS_CONFIG).filter(m => (counts[m] || 0) > 0).sort((a, b) => (counts[b] || 0) - (counts[a] || 0));

  sortedModels.forEach(modelKey => {
    const conf = ALL_MODELS_CONFIG[modelKey] || { name: modelKey };
    const vehiclesInModel = MASTER_ALL_VEHICLES.filter(v => v.model === modelKey);
    text += `🏎️ **${conf.name}** (${vehiclesInModel.length} คัน):\n`;
    vehiclesInModel.forEach((v, i) => {
      const tag = v.source === 'event8' ? ' *(Event 8)*' : '';
      text += `  ${(i + 1).toString().padStart(2, ' ')}. \`[${v.plate}]\` ${v.name}${tag}\n`;
    });
    text += `\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👥 รวมรถทั้งหมด: ${MASTER_ALL_VEHICLES.length} คัน • สมาชิกผู้ถือครอง: 306 คน`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("คัดลอกสรุปพร้อมป้ายทะเบียนสำหรับ Discord เรียบร้อยแล้ว!", "success");
  });
}

function exportMasterDataCSV() {
  let csv = "\uFEFFลำดับ,ป้ายทะเบียน,รุ่นรถ,ชื่อผู้ครอบครอง,ทะเบียนเดิม,ที่มา,หมายเหตุ\n";
  MASTER_ALL_VEHICLES.forEach((v, i) => {
    const conf = ALL_MODELS_CONFIG[v.model] || { name: v.model };
    csv += `"${i + 1}","${v.plate}","${conf.name}","${v.name}","${v.old_plate || ''}","${v.source === 'event8' ? 'Event 8' : 'ข้อมูลเดิม'}","${v.note}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `kkpd_master_all_vehicles_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("ส่งออกไฟล์ CSV ฐานข้อมูลรถครบ 427 คัน สำเร็จแล้ว", "success");
}
