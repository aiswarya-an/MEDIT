const API_BASE = "http://localhost:5000/api";

// Get patient ID from URL query parameters
function getPatientIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("patient_id");
}
// ================= FETCH FUNCTIONS =================

async function getTotalMedicines(patientId) {
  const res = await fetch(`${API_BASE}/dashboard/total-medicines/${patientId}`);
  return res.json();
}

async function getTodayReminders(patientId) {
  const res = await fetch(`${API_BASE}/dashboard/today-reminders/${patientId}`);
  return res.json();
}

async function getAdherenceReport(patientId) {
  const res = await fetch(
    `${API_BASE}/dashboard/adherence-report/${patientId}`,
  );
  return res.json();
}

// ================= LOAD DASHBOARD =================

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let patientId = urlParams.get("patientId");

  if (!patientId) {
    // No patientId in URL → assume logged-in patient
    patientId = localStorage.getItem("user_id");
  }

  // Now use patientId for all API calls
  loadDashboard(patientId);
});

async function loadDashboard(patientId) {
  // Total Medicines
  const totalMed = await getTotalMedicines(patientId);
  document.getElementById("totalMedicines").textContent = totalMed.total ?? "0";

  // Today's Reminders
  const reminders = await getTodayReminders(patientId);
  const remindersContainer = document.getElementById("todayReminders");
  remindersContainer.innerHTML = "";

  reminders.forEach((dose) => {
    const li = document.createElement("li");
    li.textContent = `Medicine ID: ${dose.medicine_id}, Time: ${dose.scheduled_time}, Status: ${dose.status}`;
    remindersContainer.appendChild(li);
  });

  // Weekly Adherence
  const adherence = await getAdherenceReport(patientId);
  const adherenceContainer = document.getElementById("weeklyAdherence");
  adherenceContainer.innerHTML = "";

  adherence.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `Status: ${item.status}, Count: ${item.count}`;
    adherenceContainer.appendChild(li);
  });
}

// ================= NAVIGATION =================

// function loadSection(section) {
//   if (section === "dashboard") {
//     location.reload();
//   }

//   if (section === "medicines") {
//     window.location.href = "medicines.html";
//   }

//   if (section === "reminders") {
//     window.location.href = "reminders.html";
//   }

//   if (section === "doctors") {
//     window.location.href = "doctors.html";
//   }

//   if (section === "prescriptions") {
//     window.location.href = "prescriptions.html";
//   }

//   if (section === "reports") {
//     window.location.href = "reports.html";
//   }

//   if (section === "linkCaregiver") {
//     window.location.href = "link_caregiver.html";
//   }
// }

// ================= NAVIGATION =================

function loadSection(section) {
  // 1. Get the current patientId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patientId");

  // 2. Create the base filename
  let page = "";
  if (section === "dashboard") page = "patient_dashboard.html";
  else if (section === "medicines") page = "medicines.html";
  else if (section === "reminders") page = "reminders.html";
  else if (section === "prescriptions") page = "prescriptions.html";
  else if (section === "reports") page = "reports.html";
  else if (section === "linkCaregiver") page = "linkCaregiver.html";
  else if (section === "profile") page = "profile.html";

  // 3. If there's a patientId (Caregiver mode), attach it to the link
  if (patientId) {
    window.location.href = `${page}?patientId=${patientId}`;
  } else {
    // Patient mode (uses localStorage on the next page)
    window.location.href = page;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
