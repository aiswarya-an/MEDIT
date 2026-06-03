// Get role
const role = localStorage.getItem("role");

// Get patientId
const urlParams = new URLSearchParams(window.location.search);
let patientId = urlParams.get("patientId"); // from caregiver redirect

if (!patientId) {
  if (role === "caregiver") {
    // Caregiver hasn't selected patient yet
    alert("Please select a patient first.");
    window.location.href = "select_patient.html";
  } else {
    // Patient login → use their own ID
    patientId = localStorage.getItem("user_id");
  }
}

const uploadedBy = localStorage.getItem("user_id"); // Who is uploading
async function loadPrescriptions() {
  if (!patientId) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/prescriptions/${patientId}`,
    );

    const prescriptions = await res.json();
    const tableBody = document.getElementById("prescriptionTableBody");

    tableBody.innerHTML = "";

    prescriptions.forEach((p) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.prescription_id}</td>
        <td>${p.uploaded_by_name}</td>
        <td>${new Date(p.upload_date).toLocaleDateString()}</td>
        <td>
          <button onclick="downloadPrescription(${p.prescription_id})">
            Download
          </button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading prescriptions:", err);
  }
}

function downloadPrescription(id) {
  window.open(`http://localhost:5000/prescriptions/download/${id}`, "_blank");
}

document.addEventListener("DOMContentLoaded", loadPrescriptions);
