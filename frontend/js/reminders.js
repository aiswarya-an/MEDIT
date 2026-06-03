const BASE_URL = "http://localhost:5000/api/reminders";
const patientId = localStorage.getItem("user_id");

// ======================
// Request Notification Permission
// ======================
if (
  Notification.permission !== "granted" &&
  Notification.permission !== "denied"
) {
  Notification.requestPermission();
}

// ======================
// Show Notification
// ======================
function showNotification(reminder) {
  if (Notification.permission === "granted") {
    const notification = new Notification("💊 Medication Time!", {
      body: `It is time to take: ${reminder.medicine_name}`,
      icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png",
      requireInteraction: true, // stays until user clicks
    });

    notification.onclick = () => {
      window.focus();
      location.href = "reminders.html";
    };

    // Mark as sent in DB so it doesn't repeat
    markAsSent(reminder.reminder_id);
  }
}

// ======================
// Mark Reminder as Sent
// ======================
async function markAsSent(reminderId) {
  try {
    await fetch(`${BASE_URL}/mark-sent/${reminderId}`, { method: "PUT" });
  } catch (err) {
    console.error("Error marking reminder as sent:", err);
  }
}

// ======================
// Load Reminders & Schedule Notifications
// ======================
async function loadReminders() {
  if (!patientId) return;

  try {
    const res = await fetch(`${BASE_URL}/${patientId}`);
    const reminders = await res.json();

    const tableBody = document.getElementById("reminderTableBody");
    tableBody.innerHTML = "";

    if (!reminders.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:20px">
            No upcoming reminders
          </td>
        </tr>
      `;
      return;
    }

    reminders.forEach((reminder) => {
      // ---------------- Table Row ----------------
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${reminder.medicine_name}</td>
        <td>${new Date(reminder.reminder_time).toLocaleString()}</td>
        <td>${reminder.dose_status}</td>
        <td>${reminder.dose_id}</td>
        <td>
          <button onclick="markDose(${reminder.dose_id}, 'taken')">Taken</button>
          <button onclick="markDose(${reminder.dose_id}, 'missed')">Missed</button>
          <button onclick="snooze(${reminder.reminder_id})">Snooze</button>
        </td>
      `;
      tableBody.appendChild(row);

      // ---------------- Schedule Notification ----------------
      const timeDiff = new Date(reminder.reminder_time) - new Date();
      if (timeDiff > 0 && Notification.permission === "granted") {
        setTimeout(() => showNotification(reminder), timeDiff);
      }
    });
  } catch (err) {
    console.error("Error loading reminders:", err);
  }
}

// ======================
// Mark Dose Taken / Missed
// ======================
async function markDose(doseId, status) {
  try {
    await fetch(`${BASE_URL}/mark-dose`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dose_id: doseId,
        status: status,
        marked_by: patientId,
      }),
    });
    loadReminders();
  } catch (err) {
    console.error("Error marking dose:", err);
  }
}

// ======================
// Snooze Reminder
// ======================
async function snooze(reminderId) {
  try {
    await fetch(`${BASE_URL}/snooze/${reminderId}`, { method: "PUT" });
    loadReminders();
  } catch (err) {
    console.error("Error snoozing reminder:", err);
  }
}

// ======================
// Run on Page Load
// ======================
document.addEventListener("DOMContentLoaded", () => {
  loadReminders();

  // Polling as backup (optional)
  setInterval(loadReminders, 30000);
});
