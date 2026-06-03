document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Get the ID using both common naming styles
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patientId") || urlParams.get("patient_id");

  const path = window.location.pathname.toLowerCase();

  // 1. Caregiver specific pages
  if (path.includes("caregiver") && role !== "caregiver") {
    window.location.href = "login.html";
    return;
  }

  // 2. Patient specific pages (Dashboard, Medicines, Reports, etc.)
  // We check for "patient" in the filename
  if (path.includes("patient")) {
    // CASE: Caregiver is here but didn't pick a patient
    if (role === "caregiver" && !patientId) {
      console.warn("Caregiver must select a patient first.");
      window.location.href = "select_patient.html"; // Send them to selection, not login!
      return;
    }

    // CASE: A patient is trying to use a patientId in the URL to see someone else
    if (role === "patient" && patientId) {
      const myId = localStorage.getItem("user_id");
      if (patientId !== myId) {
        window.location.href = "login.html";
        return;
      }
    }
  }
});
