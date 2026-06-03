const db = require("../db");
const path = require("path");
const fs = require("fs");

// Upload prescription
exports.uploadPrescription = (req, res) => {
  // 1. Check file exists
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 2. ✅ CHECK FILE TYPE (IMPORTANT)
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
      error: "Only PDF files are allowed",
    });
  }

  // 3. (Optional) CHECK FILE SIZE (e.g., 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (req.file.size > maxSize) {
    return res.status(400).json({
      error: "File size should be less than 5MB",
    });
  }

  // 4. Continue normal flow
  const { patient_id, uploaded_by } = req.body;
  const file_path = req.file.filename;

  const query = `
    INSERT INTO prescriptions (patient_id, file_path, uploaded_by)
    VALUES (?, ?, ?)
  `;

  db.query(query, [patient_id, file_path, uploaded_by], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Prescription uploaded successfully" });
  });
};

// Get prescriptions for a patient
exports.getPrescriptions = (req, res) => {
  const patientId = req.params.patientId;

  const query = `
    SELECT p.prescription_id, p.file_path, p.upload_date, u.name AS uploaded_by_name
    FROM prescriptions p
    JOIN user u ON p.uploaded_by = u.user_id
    WHERE p.patient_id = ?
    ORDER BY p.upload_date DESC
  `;

  db.query(query, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
};

// Download prescription
exports.downloadPrescription = (req, res) => {
  const prescriptionId = req.params.id;

  const query = `SELECT file_path FROM prescriptions WHERE prescription_id = ?`;

  db.query(query, [prescriptionId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length)
      return res.status(404).json({ error: "File not found" });

    const filePath = path.join(__dirname, "../uploads", result[0].file_path);
    res.download(filePath);
  });
};
