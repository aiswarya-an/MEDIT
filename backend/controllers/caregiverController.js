const db = require("../db");

exports.respondLinkRequest = (req, res) => {
  const { link_id, action } = req.body;

  // Validate input
  if (!link_id || !["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // Prepare query
  let query, params;

  if (action === "accepted") {
    // Set linked_date when accepted
    query = `
      UPDATE caregiver_patient_link
      SET link_status = ?, linked_date = NOW()
      WHERE link_id = ?
    `;
    params = [action, link_id];
  } else {
    // Only update status if rejected
    query = `
      UPDATE caregiver_patient_link
      SET link_status = ?
      WHERE link_id = ?
    `;
    params = [action, link_id];
  }

  // Execute query
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: `Request ${action}` });
  });
};

// Linked patients
exports.getLinkedPatients = (req, res) => {
  const { caregiverId } = req.params;
  db.query(
    `
    SELECT u.user_id, u.name, u.email
    FROM caregiver_patient_link cpl
    JOIN user u ON cpl.patient_id = u.user_id
    WHERE cpl.caregiver_id = ? AND cpl.link_status='accepted'
  `,
    [caregiverId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    },
  );
};
