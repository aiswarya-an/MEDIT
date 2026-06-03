const db = require("../db");

// Total medicines
exports.getTotalMedicines = (req, res) => {
  const { patientId } = req.params;
  db.query(
    "SELECT COUNT(*) AS total FROM medicines WHERE patient_id = ?",
    [patientId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    },
  );
};

// Today's reminders
exports.getTodayReminders = (req, res) => {
  const { patientId } = req.params;
  db.query(
    "SELECT * FROM dose_records WHERE patient_id = ? AND DATE(scheduled_time) = CURDATE()",
    [patientId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
};

// Weekly adherence
exports.getAdherenceReport = (req, res) => {
  const { patientId } = req.params;
  db.query(
    `
    SELECT status, COUNT(*) AS count
    FROM dose_records
    WHERE patient_id = ? AND scheduled_time >= CURDATE() - INTERVAL 7 DAY
    GROUP BY status
  `,
    [patientId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
};
