const BASE_URL = "http://localhost:5000/api/reports";
const urlParams = new URLSearchParams(window.location.search);
let patientId = urlParams.get("patientId");

if (!patientId) {
  // No patientId in URL → assume logged-in patient
  patientId = localStorage.getItem("user_id");
}

// Now use patientId for all API calls

// ================= GENERIC FETCH =================
async function fetchReport(type) {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${patientId}`);
    const data = await response.json();

    if (!response.ok) {
      alert("Error fetching report");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error");
    return [];
  }
}

// ================= RENDER TABLE =================
function renderTable(data) {
  const container = document.getElementById("reportContainer");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No report data available.</p>";
    return;
  }

  let table = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total Doses</th>
          <th>Taken Doses</th>
          <th>Adherence %</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((row) => {
    table += `
      <tr>
        <td>${row.date}</td>
        <td>${row.total_doses}</td>
        <td>${row.taken_doses}</td>
        <td>${row.adherence_percentage}%</td>
      </tr>
    `;
  });

  table += "</tbody></table>";

  container.innerHTML = table;
}

// ================= WEEKLY =================
async function loadWeekly() {
  const data = await fetchReport("weekly");
  renderTable(data);
}

// ================= MONTHLY =================
// async function loadMonthly() {
//   const data = await fetchReport("monthly");
//   renderTable(data);
// }

// ================= EXPORT CSV =================
async function exportReport() {
  try {
    const response = await fetch(`${BASE_URL}/export/${patientId}`);
    const data = await response.json();

    if (!response.ok) {
      alert("Export failed");
      return;
    }

    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Convert JSON to CSV
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csvContent = headers + "\n" + rows;

    // Create downloadable file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dose_records.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);
    alert("Network error");
  }
}

// ================= BUTTON EVENTS =================
document.getElementById("weeklyBtn").addEventListener("click", loadWeekly);
//document.getElementById("monthlyBtn").addEventListener("click", loadMonthly);
document.getElementById("exportBtn").addEventListener("click", exportReport);
