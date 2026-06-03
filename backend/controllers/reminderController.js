const db = require("../db");

// ===============================
// Get Upcoming Reminders
// ===============================
exports.getReminders = (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT r.reminder_id, r.reminder_time, r.reminder_status,
           d.dose_id, d.status AS dose_status,
           m.medicine_name
    FROM reminders r
    JOIN dose_records d ON r.dose_id = d.dose_id
    JOIN medicines m ON d.medicine_id = m.medicine_id
    WHERE d.patient_id = ?
      AND r.reminder_time >= NOW()
    ORDER BY r.reminder_time ASC
  `;

  db.query(sql, [patientId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ===============================
// Mark Dose Taken / Missed
// ===============================
exports.markDose = (req, res) => {
  const { dose_id, status, marked_by } = req.body;

  const sql = `
    UPDATE dose_records
    SET status = ?, marked_by = ?, marked_time = NOW()
    WHERE dose_id = ?
  `;

  db.query(sql, [status, marked_by, dose_id], (err) => {
    if (err) return res.status(500).json(err);

    // also update reminder
    db.query(
      "UPDATE reminders SET reminder_status = 'delivered' WHERE dose_id = ?",
      [dose_id],
    );

    res.json({ message: "Dose updated successfully" });
  });
};

// ===============================
// Snooze Reminder (10 min)
// ===============================
exports.snoozeReminder = (req, res) => {
  const { reminderId } = req.params;
  const snoozeMinutes = 5; // change if needed

  const query = `
    UPDATE reminders
    SET reminder_status = 'snoozed',
        reminder_time = DATE_ADD(NOW(), INTERVAL ? MINUTE)
    WHERE reminder_id = ?
  `;

  db.query(query, [snoozeMinutes, reminderId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Reminder snoozed successfully" });
  });
};

exports.markReminderAsSeen = (req, res) => {
  const { reminderId } = req.params;

  const query = `
    UPDATE reminders
    SET reminder_status = 'delivered'
    WHERE reminder_id = ?
  `;

  db.query(query, [reminderId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Reminder marked as delivered" });
  });
};

exports.getDueNotifications = (req, res) => {
  const { patientId } = req.params;

  const sql = `
    SELECT r.reminder_id, m.medicine_name, r.reminder_time
    FROM reminders r
    JOIN dose_records d ON r.dose_id = d.dose_id
    JOIN medicines m ON d.medicine_id = m.medicine_id
    WHERE d.patient_id = ?
      AND r.reminder_status = 'scheduled'
      AND d.status = 'pending'
      AND r.reminder_time <= NOW()
  `;

  db.query(sql, [patientId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
