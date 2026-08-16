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

const MASTER_ADMIN_PIN = "9999";

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
// 2. STATE MANAGEMENT & STORAGE
// ==========================================

const STORAGE_KEY = "kkpd_prize_selection_v2";

let state = {
  preferences: {}, // { [playerId]: ["banshee", "r32", ...] }
  submissions: {}, // { [playerId]: timestamp }
  pins: { ...DEFAULT_PINS }, // { [playerId]: "1001" }
  authenticatedPlayerId: null,
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
      soundEnabled: state.soundEnabled
    }));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

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
  playerSelect: document.getElementById("playerSelect"),
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

  DOM.submittedCount.textContent = submittedTotal;
  DOM.stockStatusTag.textContent = `จัดสรรแล้ว ${allocatedCount} / 20 คัน`;

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
      const url = new URL(window.location.href);
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
  let text = `📢 **สรุปผลการจัดสรรของรางวัล (รถ 20 คัน)** 🏎️✨\n`;
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
  });
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
    const pin = state.pins[p.id];
    pinListText += `อันดับ ${p.rank.toString().padStart(2, ' ')}. ${p.name} ➡️ รหัส PIN: **${pin}**\n`;
  });
  pinListText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  pinListText += `*(Master Admin PIN: 9999)*`;

  navigator.clipboard.writeText(pinListText).then(() => {
    AudioEngine.play('success');
    showToast("คัดลอกรายชื่อและรหัส PIN ทั้งหมดเรียบร้อยแล้ว!", "success");
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
  if (confirm("ต้องการสุ่มข้อมูลความต้องการของผู้เล่นทั้ง 20 คน เพื่อทดสอบระบบหรือไม่?")) {
    AudioEngine.play('success');
    
    PARTICIPANTS.forEach(p => {
      const shuffled = [...DEFAULT_CAR_KEYS].sort(() => Math.random() - 0.5);
      state.preferences[p.id] = shuffled;
      state.submissions[p.id] = new Date().toISOString();
    });

    saveState();
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
    renderFullState();
    initUI();
    showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว", "info");
  }
});

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
});
