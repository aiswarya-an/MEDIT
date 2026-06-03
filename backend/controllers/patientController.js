const db = require("../db");

exports.sendLinkRequest = (req, res) => {
  const { patientId, caregiverId } = req.body;

  if (!patientId || !caregiverId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = `
    INSERT INTO caregiver_patient_link (patient_id, caregiver_id, link_status)
    VALUES (?, ?, 'pending')
  `;

  db.query(query, [patientId, caregiverId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Link request sent successfully" });
  });
};

exports.getPatientLinkStatus = (req, res) => {
  const { patientId } = req.params;

  const query = `
    SELECT cpl.link_id,
           u.user_id AS caregiver_id,
           u.name AS caregiver_name,
           cpl.link_status
    FROM caregiver_patient_link cpl
    JOIN user u ON cpl.caregiver_id = u.user_id
    WHERE cpl.patient_id = ?
  `;

  db.query(query, [patientId], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
};

exports.deleteLinkRequest = (req, res) => {
  const { link_id } = req.body; // get from body

  if (!link_id) return res.status(400).json({ message: "Missing link_id" });

  const query = `DELETE FROM caregiver_patient_link WHERE link_id = ?`;

  db.query(query, [link_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No link request found with this ID" });
    }
    res.json({ message: "Link request deleted successfully" });
  });
};
