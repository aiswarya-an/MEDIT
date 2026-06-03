const db = require("../db");

// ================= REGISTER =================
exports.registerUser = (req, res) => {
  const { name, email, password, phone_number, role } = req.body;

  const userQuery =
    "INSERT INTO user(name, email, password, phone_number) VALUES (?, ?, ?, ?)";

  db.query(userQuery, [name, email, password, phone_number], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const userId = result.insertId;

    if (role === "patient") {
      db.query(
        "INSERT INTO patients (patient_id) VALUES (?)",
        [userId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          return res.json({
            message: "Patient registered successfully",
            user_id: userId,
            role: "patient",
          });
        },
      );
    } else if (role === "caregiver") {
      db.query(
        "INSERT INTO caregivers (caregiver_id) VALUES (?)",
        [userId],
        (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });

          return res.json({
            message: "Caregiver registered successfully",
            user_id: userId,
            role: "caregiver",
          });
        },
      );
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  });
};

// ================= LOGIN =================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM user WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = results[0];
    const userId = user.user_id;

    // Check role
    db.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [userId],
      (err2, patientResults) => {
        if (err2) return res.status(500).json({ error: err2.message });
        if (patientResults.length > 0)
          return res.json({
            message: "Login successful",
            user_id: userId,
            role: "patient",
          });

        db.query(
          "SELECT * FROM caregivers WHERE caregiver_id = ?",
          [userId],
          (err3, caregiverResults) => {
            if (err3) return res.status(500).json({ error: err3.message });
            if (caregiverResults.length > 0)
              return res.json({
                message: "Login successful",
                user_id: userId,
                role: "caregiver",
              });

            return res.status(400).json({ message: "User role not found" });
          },
        );
      },
    );
  });
};

// ================= PROFILE SETUP =================
// ================= PROFILE SETUP =================
exports.profileSetup = (req, res) => {
  const { user_id, role, date_of_birth, gender, experience, availability } =
    req.body;

  if (!user_id || !role) {
    return res.status(400).json({ message: "user_id and role are required" });
  }

  if (role === "patient") {
    // Ensure patient exists first
    db.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [user_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(404).json({ message: "Patient not found" });

        // Update patient profile
        db.query(
          "UPDATE patients SET date_of_birth = ?, gender = ? WHERE patient_id = ?",
          [date_of_birth, gender, user_id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Patient profile updated" });
          },
        );
      },
    );
  } else if (role === "caregiver") {
    // Ensure caregiver exists first
    db.query(
      "SELECT * FROM caregivers WHERE caregiver_id = ?",
      [user_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(404).json({ message: "Caregiver not found" });

        // Update caregiver profile
        db.query(
          "UPDATE caregivers SET ExperienceYears = ?, AvailabilityStatus = ? WHERE caregiver_id = ?",
          [experience, availability, user_id],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Caregiver profile updated" });
          },
        );
      },
    );
  } else {
    res.status(400).json({ message: "Invalid role" });
  }
};

// ================= GET PROFILE =================
exports.getProfile = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT u.user_id, u.name, u.email, u.phone_number,
           p.date_of_birth, p.gender,
           c.ExperienceYears, c.AvailabilityStatus
    FROM user u
    LEFT JOIN patients p ON u.user_id = p.patient_id
    LEFT JOIN caregivers c ON u.user_id = c.caregiver_id
    WHERE u.user_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  });
};
