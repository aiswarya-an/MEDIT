const BASE_URL = "http://localhost:5000/api/patient";
const patientId = localStorage.getItem("user_id");

// ================= SEND LINK REQUEST =================
document.getElementById("linkForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const caregiverId = document.getElementById("caregiverId").value;

  try {
    const response = await fetch(`${BASE_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        caregiverId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to send request");
      return;
    }

    alert(data.message);
    document.getElementById("linkForm").reset();
    loadLinkStatus();
  } catch (error) {
    console.error("Error sending link request:", error);
    alert("Network error");
  }
});

// ================= FETCH LINK STATUS =================
async function loadLinkStatus() {
  try {
    const response = await fetch(`${BASE_URL}/status/${patientId}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching link status:", data);
      return;
    }

    renderLinkStatus(data);
  } catch (error) {
    console.error("Network error:", error);
  }
}

// ================= RENDER LINK STATUS =================
function renderLinkStatus(links) {
  const container = document.getElementById("linkStatusContainer");
  container.innerHTML = "";

  if (!links || links.length === 0) {
    container.innerHTML = "<p>No link requests found.</p>";
    return;
  }

  links.forEach((link) => {
    const div = document.createElement("div");
    div.classList.add("link-item");

    div.innerHTML = `
      <p><strong>Caregiver:</strong> ${link.caregiver_name} (ID: ${link.caregiver_id})</p>
      <p><strong>Status:</strong> ${link.link_status}</p>
      <button class="delete-btn" onclick="deleteLink(${link.link_id})">
        Delete Link
      </button>
    `;

    container.appendChild(div);
  });
}

// ================= DELETE LINK =================
async function deleteLink(linkId) {
  if (!confirm("Are you sure you want to delete this link request?")) return;

  try {
    const response = await fetch(`${BASE_URL}/delete-link`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link_id: linkId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Delete failed");
      return;
    }

    alert(data.message);
    loadLinkStatus();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Network error");
  }
}

// ================= LOAD ON PAGE =================
document.addEventListener("DOMContentLoaded", loadLinkStatus);
