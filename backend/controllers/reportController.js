const db = require("../db");

// ---------------- WEEKLY REPORT ----------------

// // Weekly adherence report
// exports.getWeeklyReport = async (req, res) => {
//   const patientId = req.params.patientId;

//   try {
//     const [rows] = await db.promise().query(
//       `
//       SELECT
//         m.name AS medicine_name,
//         COUNT(d.dose_id) AS total_doses,
//         SUM(CASE WHEN d.status = 'taken' THEN 1 ELSE 0 END) AS taken_doses
//       FROM medicines m
//       LEFT JOIN dose_record d
//         ON m.medicine_id = d.medicine_id
//         AND YEARWEEK(d.taken_at, 1) = YEARWEEK(CURDATE(), 1)
//       WHERE m.patient_id = ?
//       GROUP BY m.medicine_id
//     `,
//       [patientId],
//     );

//     const report = rows.map((row) => ({
//       medicine: row.medicine_name,
//       total: row.total_doses,
//       taken: row.taken_doses,
//       adherence_percentage:
//         row.total_doses > 0
//           ? ((row.taken_doses / row.total_doses) * 100).toFixed(2)
//           : 0,
//     }));

//     res.json(report);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Weekly Report
exports.getWeeklyReport = (req, res) => {
  const { patientId } = req.params;

  const query = `
    SELECT 
      DATE(scheduled_time) AS date,
      COUNT(*) AS total_doses,
      SUM(CASE WHEN status = 'taken' THEN 1 ELSE 0 END) AS taken_doses,
      ROUND(
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE (SUM(CASE WHEN status = 'taken' THEN 1 ELSE 0 END) / COUNT(*)) * 100
        END,
        2
      ) AS adherence_percentage
    FROM dose_records
    WHERE patient_id = ?
      AND scheduled_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(scheduled_time)
    ORDER BY date
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// Monthly Report
exports.getMonthlyReport = (req, res) => {
  const { patientId } = req.params;

  const query = `
    SELECT 
      DATE_FORMAT(scheduled_time, '%Y-%m-%d') AS date,
      COUNT(*) AS total_doses,
      SUM(CASE WHEN status = 'taken' THEN 1 ELSE 0 END) AS taken_doses,
      ROUND(
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE (SUM(CASE WHEN status = 'taken' THEN 1 ELSE 0 END) / COUNT(*)) * 100
        END,
        2
      ) AS adherence_percentage
    FROM dose_records
    WHERE patient_id = ?
      AND MONTH(scheduled_time) = MONTH(CURDATE())
      AND YEAR(scheduled_time) = YEAR(CURDATE())
    GROUP BY DATE(scheduled_time)
    ORDER BY date
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// ---------------- EXPORT REPORT ----------------
exports.exportReport = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM dose_records WHERE patient_id = ?", [patientId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
