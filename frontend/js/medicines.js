const BASE_URL = "http://localhost:5000/api/medicines";
// Use query param if present, otherwise fallback to logged-in user
function getPatientIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("patient_id");
}

const urlParams = new URLSearchParams(window.location.search);
let patientId = urlParams.get("patientId");

if (!patientId) {
  // No patientId in URL → assume logged-in patient
  patientId = localStorage.getItem("user_id");
}

// Now use patientId for all API calls
let editMode = false;
let editMedicineId = null;

// ================= LOAD MEDICINES =================
async function loadMedicines() {
  try {
    const res = await fetch(`${BASE_URL}/${patientId}`);
    const medicines = await res.json();

    const tableBody = document.getElementById("medicineTableBody");
    tableBody.innerHTML = "";

    medicines.forEach((med) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${med.medicine_name}</td>
        <td>${med.dosage}</td>
        <td>${med.frequency}</td>
        <td>${med.stock_quantity}</td>
        <td>
          <button onclick="editMedicine(${med.medicine_id})">Edit</button>
          <button onclick="deleteMedicine(${med.medicine_id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading medicines:", err);
  }
}

// ================= LOAD LOW STOCK =================
async function loadLowStock() {
  try {
    const res = await fetch(`${BASE_URL}/low-stock/${patientId}`);
    const medicines = await res.json();

    const lowStockDiv = document.getElementById("lowStockList");
    lowStockDiv.innerHTML = "";

    if (medicines.length === 0) {
      lowStockDiv.innerHTML = "<p>No low stock medicines ✅</p>";
      return;
    }

    medicines.forEach((med) => {
      lowStockDiv.innerHTML += `
        <p style="color:red;">
          ${med.medicine_name} - Stock: ${med.stock_quantity}
        </p>
      `;
    });
  } catch (err) {
    console.error("Error loading low stock:", err);
  }
}
async function loadRefillAlerts() {
  try {
    const response = await fetch(`${BASE_URL}/refill-alerts/${patientId}`);
    const alerts = await response.json();

    const container = document.getElementById("refillAlerts");
    container.innerHTML = "";

    if (!alerts || alerts.length === 0) {
      container.innerHTML = "<p>No low-stock medicines.</p>";
      return;
    }

    alerts.forEach((med) => {
      const div = document.createElement("div");
      div.textContent = `⚠ ${med.medicine_name} is low (Stock: ${med.stock_quantity})`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading refill alerts:", err);
  }
}
function addTimeField() {
  const container = document.getElementById("timeContainer");

  const input = document.createElement("input");
  input.type = "time";
  input.className = "reminder-time";
  input.required = true;

  container.appendChild(input);
}
// Call on page load
document.addEventListener("DOMContentLoaded", loadRefillAlerts);
// ================= ADD / UPDATE MEDICINE =================
document
  .getElementById("medicineForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const timeInputs = document.querySelectorAll(".reminder-time");
    const times = [];

    timeInputs.forEach((input) => {
      if (input.value) {
        times.push(input.value);
      }
    });
    const medicine = {
      patient_id: patientId,
      medicine_name: document.getElementById("medicine_name").value,
      dosage: document.getElementById("dosage").value,
      frequency: document.getElementById("frequency").value,
      start_date: document.getElementById("start_date").value,
      end_date: document.getElementById("end_date").value,
      stock_quantity: document.getElementById("stock_quantity").value,
      refill_threshold: document.getElementById("refill_threshold").value,
      times: times, // Include reminder times in the payload
    };

    try {
      if (editMode) {
        await fetch(`${BASE_URL}/${editMedicineId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicine),
        });

        editMode = false;
        editMedicineId = null;
      } else {
        await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicine),
        });
      }

      document.getElementById("medicineForm").reset();
      loadMedicines();
      loadLowStock();
    } catch (err) {
      console.error("Error saving medicine:", err);
    }
  });

// ================= DELETE =================
async function deleteMedicine(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    loadMedicines();
    loadLowStock();
  } catch (err) {
    console.error("Error deleting:", err);
  }
}

// ================= EDIT =================
let currentEditId = null;

// OPEN MODAL
async function editMedicine(id) {
  try {
    const res = await fetch(`${BASE_URL}/${patientId}`);
    const medicines = await res.json();
    const med = medicines.find((m) => m.medicine_id == id);
    if (!med) return;

    currentEditId = id;

    document.getElementById("edit_medicine_name").value = med.medicine_name;
    document.getElementById("edit_dosage").value = med.dosage;
    document.getElementById("edit_frequency").value = med.frequency;
    document.getElementById("edit_start_date").value =
      med.start_date.split("T")[0];
    document.getElementById("edit_end_date").value = med.end_date.split("T")[0];
    document.getElementById("edit_stock_quantity").value = med.stock_quantity;
    document.getElementById("edit_refill_threshold").value =
      med.refill_threshold;

    document.getElementById("editModal").style.display = "block";
  } catch (err) {
    console.error("Edit error:", err);
  }
}

// UPDATE MEDICINE
async function updateMedicine() {
  const updatedData = {
    medicine_name: document.getElementById("edit_medicine_name").value,
    dosage: document.getElementById("edit_dosage").value,
    frequency: document.getElementById("edit_frequency").value,
    start_date: document.getElementById("edit_start_date").value,
    end_date: document.getElementById("edit_end_date").value,
    stock_quantity: document.getElementById("edit_stock_quantity").value,
    refill_threshold: document.getElementById("edit_refill_threshold").value,
  };

  try {
    await fetch(`${BASE_URL}/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    closeModal();
    loadMedicines();
    loadLowStock();
  } catch (err) {
    console.error("Update error:", err);
  }
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Initial Load
loadMedicines();
loadLowStock();
