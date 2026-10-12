/**
 * InternCertify - Certificate Verification Script
 * Manages exactly the 3 candidate records, URL query parameter parsing,
 * DOM injection, mobile drawer navigation, and copy/share utilities.
 */

// -----------------------------------------------------------------------------
// 1. Candidate Records (Exactly 3 Supported Candidate Records)
// -----------------------------------------------------------------------------
const CANDIDATE_RECORDS = [
  {
    code: "trh82nc",
    rollNo: "721223205042",
    name: "Rahul M",
    course: "Front end Development",
    duration: "19-05-2026 to 17-06-2026",
    college: "Karpagam Institute of Technology",
    issueDate: "17-06-2026",
    status: "Verified & Active"
  },
  {
    code: "fyi73gt",
    rollNo: "721223205053",
    name: "Sherin Fathima A",
    course: "Front end Development",
    duration: "19-05-2026 to 17-06-2026",
    college: "Karpagam Institute of Technology",
    issueDate: "17-06-2026",
    status: "Verified & Active"
  },
  {
    code: "bal12kit",
    rollNo: "721223205012",
    name: "Balasundari S",
    course: "Front end Development",
    duration: "19-05-2026 to 17-06-2026",
    college: "Karpagam Institute of Technology",
    issueDate: "17-06-2026",
    status: "Verified & Active"
  }
];

// Default Candidate Record: Rahul M
const DEFAULT_CANDIDATE = CANDIDATE_RECORDS[0];

// Current Active Candidate
let currentStudent = DEFAULT_CANDIDATE;

// -----------------------------------------------------------------------------
// 2. URL Parameter Extraction & Data Lookup
// -----------------------------------------------------------------------------

/**
 * Searches for a matching candidate based on Roll No, Certificate ID/Code, or Name
 * @param {string} query 
 * @returns {object} Matching candidate record or DEFAULT_CANDIDATE
 */
function findCandidate(query) {
  if (!query) return DEFAULT_CANDIDATE;
  const q = String(query).trim().toLowerCase();

  const match = CANDIDATE_RECORDS.find(c => 
    c.rollNo.toLowerCase() === q ||
    c.code.toLowerCase() === q ||
    c.name.toLowerCase() === q
  );

  return match || DEFAULT_CANDIDATE;
}

/**
 * Reads the ?id= parameter from URL search params and looks up candidate
 * @returns {object} Candidate record
 */
function getRequestedCandidate() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id") || urlParams.get("rollNo") || urlParams.get("roll");

  if (!idParam) {
    return DEFAULT_CANDIDATE;
  }

  const match = findCandidate(idParam);
  if (!match || (match === DEFAULT_CANDIDATE && idParam.trim().toLowerCase() !== DEFAULT_CANDIDATE.rollNo.toLowerCase() && idParam.trim().toLowerCase() !== DEFAULT_CANDIDATE.code.toLowerCase())) {
    console.warn(`No record found matching "${idParam}". Defaulting to Rahul M.`);
    setTimeout(() => {
      showToast(`Record "${idParam}" not found. Displaying Rahul M.`);
    }, 500);
  }

  return match;
}

/**
 * Injects candidate details into the DOM
 * @param {object} record 
 */
function renderStudentDetails(record) {
  currentStudent = record;

  // 1. Update Title: "InternCertify Verified Certificate - [Student Name]"
  const titleNameEl = document.getElementById("title-student-name");
  if (titleNameEl) {
    titleNameEl.textContent = record.name;
  }

  // Update browser tab title
  document.title = `InternCertify Verified Certificate - ${record.name}`;

  // 2. Update Registry Badge
  const registryBadge = document.getElementById("cert-registry-badge");
  if (registryBadge) {
    registryBadge.textContent = `CERT-ID: IC-${record.rollNo}`;
  }

  // 3. Update Certificate Data List
  // Learner Full Name
  const valNameEl = document.getElementById("val-student-name");
  if (valNameEl) valNameEl.textContent = record.name;

  // Internship Course
  const valCourseEl = document.getElementById("val-course-name");
  if (valCourseEl) valCourseEl.textContent = record.course;

  // Duration
  const valDurationEl = document.getElementById("val-duration");
  if (valDurationEl) valDurationEl.textContent = record.duration;

  // Roll No
  const valRollEl = document.getElementById("val-roll-no");
  if (valRollEl) valRollEl.textContent = record.rollNo;

  // College
  const valCollegeEl = document.getElementById("val-college");
  if (valCollegeEl) valCollegeEl.textContent = record.college;

  // 4. Update QR Code Meta
  const valIssueDateEl = document.getElementById("val-issue-date");
  if (valIssueDateEl) {
    valIssueDateEl.textContent = `Issued: ${record.issueDate}`;
  }

  // 5. Update timestamp
  const timestampEl = document.getElementById("verified-timestamp");
  if (timestampEl) {
    const now = new Date();
    timestampEl.textContent = `Checked: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // 6. Update active UI states
  updateActivePills(record.rollNo);
}

/**
 * Switches student and updates browser URL without reloading
 * @param {string} rollNo 
 */
function selectCandidate(rollNo) {
  const match = CANDIDATE_RECORDS.find(c => c.rollNo === rollNo);
  if (!match) return;

  // Update URL search parameter
  const url = new URL(window.location);
  url.searchParams.set("id", match.rollNo);
  window.history.pushState({ id: match.rollNo }, "", url);

  // Re-render
  renderStudentDetails(match);

  // Close drawer if open
  closeDrawer();

  showToast(`Loaded certificate for ${match.name}`);
}

// -----------------------------------------------------------------------------
// 3. UI Switcher Components (Pills & Drawer List)
// -----------------------------------------------------------------------------

function setupStudentSwitchers() {
  const pillTrack = document.getElementById("pill-switcher");
  const drawerList = document.getElementById("drawer-student-list");

  // Populate Pill Tracker (Horizontal Scroll on top)
  if (pillTrack) {
    pillTrack.innerHTML = "";
    CANDIDATE_RECORDS.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = `student-pill ${c.rollNo === currentStudent.rollNo ? "active" : ""}`;
      btn.dataset.id = c.rollNo;
      btn.textContent = `${c.name} (${c.rollNo.slice(-4)})`;
      btn.title = `Switch to ${c.name} - ${c.rollNo}`;
      btn.addEventListener("click", () => selectCandidate(c.rollNo));
      pillTrack.appendChild(btn);
    });
  }

  // Populate Drawer List
  if (drawerList) {
    drawerList.innerHTML = "";
    CANDIDATE_RECORDS.forEach((c) => {
      const card = document.createElement("button");
      card.className = `quick-student-card ${c.rollNo === currentStudent.rollNo ? "active" : ""}`;
      card.dataset.id = c.rollNo;
      card.innerHTML = `
        <strong>${c.name}</strong>
        <span>Roll No: <code>${c.rollNo}</code> &bull; ID: ${c.code}</span>
        <small style="color:#64748b; font-size: 0.72rem;">${c.college}</small>
      `;
      card.addEventListener("click", () => selectCandidate(c.rollNo));
      drawerList.appendChild(card);
    });
  }
}

function updateActivePills(activeRollNo) {
  document.querySelectorAll(".student-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.id === activeRollNo);
  });
  document.querySelectorAll(".quick-student-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === activeRollNo);
  });
}

// -----------------------------------------------------------------------------
// 4. Drawer & Navigation Logic
// -----------------------------------------------------------------------------

const menuBtn = document.getElementById("menu-btn");
const drawerOverlay = document.getElementById("drawer-overlay");
const drawerCloseBtn = document.getElementById("drawer-close");

function toggleDrawer() {
  const isOpen = drawerOverlay.classList.contains("open");
  if (isOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

function openDrawer() {
  drawerOverlay.classList.add("open");
  menuBtn.classList.add("active");
  menuBtn.setAttribute("aria-expanded", "true");
  drawerOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawerOverlay.classList.remove("open");
  menuBtn.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
  drawerOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// -----------------------------------------------------------------------------
// 5. Copy & Share Utilities
// -----------------------------------------------------------------------------

/**
 * Copies roll number to clipboard
 */
function setupCopyRollNumber() {
  const copyBtn = document.getElementById("copy-roll-btn");
  const tooltip = document.getElementById("copy-tooltip");

  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    if (!currentStudent) return;
    try {
      await navigator.clipboard.writeText(currentStudent.rollNo);
      if (tooltip) {
        tooltip.classList.add("show");
        setTimeout(() => tooltip.classList.remove("show"), 1800);
      }
      showToast(`Copied Roll No: ${currentStudent.rollNo}`);
    } catch (err) {
      fallbackCopyText(currentStudent.rollNo);
    }
  });
}

/**
 * Copies direct verification link
 */
function setupShareActions() {
  const shareBtn = document.getElementById("share-link-btn");
  const actionShareBtn = document.getElementById("action-share-btn");

  const handleShare = async () => {
    if (!currentStudent) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${currentStudent.rollNo}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `InternCertify - ${currentStudent.name}`,
          text: `Verified Certificate for ${currentStudent.name} (${currentStudent.course})`,
          url: shareUrl
        });
        return;
      } catch (e) {
        // user cancelled or share failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast(`Verification link (?id=${currentStudent.rollNo}) copied!`);
    } catch (e) {
      fallbackCopyText(shareUrl);
    }
  };

  if (shareBtn) shareBtn.addEventListener("click", handleShare);
  if (actionShareBtn) actionShareBtn.addEventListener("click", handleShare);
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showToast("Copied to clipboard!");
  } catch (err) {
    showToast("Failed to copy automatically.");
  }
  document.body.removeChild(textArea);
}

/**
 * Display toast notification
 * @param {string} message 
 */
function showToast(message) {
  const container = document.getElementById("toast-box");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 260);
  }, 2600);
}

// -----------------------------------------------------------------------------
// 6. Auxiliary Actions
// -----------------------------------------------------------------------------
function openPrivacyModal() {
  showToast("Privacy policy: Student record hashes are strictly immutable.");
}

function openVerificationGuide() {
  showToast("To verify: Scan QR code or check ID against official registrar.");
}

function showStudentSwitcherModal() {
  openDrawer();
}

// -----------------------------------------------------------------------------
// 7. Initialization & Event Listeners
// -----------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Determine candidate from URL parameters
  const candidate = getRequestedCandidate();

  // Render candidate details in DOM
  renderStudentDetails(candidate);

  // Setup Switchers
  setupStudentSwitchers();

  // Setup Drawer Listeners
  if (menuBtn) menuBtn.addEventListener("click", toggleDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  // Setup copy & share handlers
  setupCopyRollNumber();
  setupShareActions();

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const active = getRequestedCandidate();
    renderStudentDetails(active);
  });
});
