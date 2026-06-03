const DASHBOARD_URL = "http://localhost:5000/api/caregiver";

// Load pending link requests
async function loadPendingRequests() {
  try {
    const caregiverId = localStorage.getItem("user_id");
    const res = await fetch(`${DASHBOARD_URL}/patients/${caregiverId}`);
    const requests = await res.json();

    const container = document.getElementById("linkRequestsContainer");
    container.innerHTML = "";

    const pending = requests.filter((r) => r.link_status === "pending");

    if (pending.length === 0) {
      container.innerHTML = "<p>No pending requests</p>";
      return;
    }

    pending.forEach((req) => {
      const div = document.createElement("div");
      div.classList.add("link-request");
      div.innerHTML = `
        <p><strong>Patient:</strong> ${req.patient_name}</p>
        <button class="accept" onclick="respond(${req.link_id}, 'accepted')">Accept</button>
        <button class="reject" onclick="respond(${req.link_id}, 'rejected')">Reject</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// Respond to link request
async function respond(linkId, action) {
  try {
    const res = await fetch(`${DASHBOARD_URL}/respond`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link_id: linkId, action }),
    });
    const data = await res.json();
    alert(data.message);
    loadPendingRequests();
  } catch (err) {
    console.error(err);
  }
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadPendingRequests();
});
