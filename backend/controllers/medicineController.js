const db = require("../db");

// ================= GET MEDICINES =================
exports.getMedicines = (req, res) => {
  const patientId = req.params.patientId;

  db.query(
    "SELECT * FROM medicines WHERE patient_id = ?",
    [patientId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    },
  );
};

// ================= ADD MEDICINE + GENERATE FLOW =================
// exports.addMedicine = async (req, res) => {
//   const {
//     patient_id,
//     medicine_name,
//     dosage,
//     frequency,
//     start_date,
//     end_date,
//     stock_quantity,
//     refill_threshold,
//   } = req.body;

//   try {
//     // 1. Insert medicine
//     const [result] = await db.promise().query(
//       `INSERT INTO medicines
//        (patient_id, medicine_name, dosage, frequency, start_date, end_date, stock_quantity, refill_threshold)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         patient_id,
//         medicine_name,
//         dosage,
//         frequency,
//         start_date,
//         end_date,
//         stock_quantity,
//         refill_threshold,
//       ],
//     );

//     const medicineId = result.insertId;

//     // 2. Decide times
//     let times = [];
//     if (frequency === "Once a day") times = ["08:00:00"];
//     else if (frequency === "Twice a day") times = ["08:00:00", "20:00:00"];
//     else if (frequency === "Three times a day")
//       times = ["08:00:00", "14:00:00", "20:00:00"];

//     let currentDate = new Date(start_date);
//     const endDateObj = new Date(end_date);

//     // 3. LOOP PROPERLY
//     while (currentDate <= endDateObj) {
//       const dateStr = currentDate.toISOString().split("T")[0];

//       for (const time of times) {
//         const dateTime = `${dateStr} ${time}`;

//         // ✅ WAIT for each query
//         await db
//           .promise()
//           .query(
//             "INSERT INTO reminders (medicine_id, reminder_time) VALUES (?, ?)",
//             [medicineId, dateTime],
//           );

//         await db.promise().query(
//           `INSERT INTO dose_records
//            (medicine_id, patient_id, scheduled_time, status)
//            VALUES (?, ?, ?, 'pending')`,
//           [medicineId, patient_id, dateTime],
//         );
//       }

//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     res.json({ message: "All data inserted correctly ✅" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.createMedicineSchedule = async (req, res) => {
  const {
    patient_id,
    medicine_name,
    dosage,
    frequency,
    start_date,
    end_date,
    times,
    stock_quantity,
    refill_threshold,
  } = req.body;

  try {
    // 1️⃣ Insert into medicines (Added stock fields)
    // Use .promise() if your db connection isn't already promisified
    const [medicineResult] = await db.promise().query(
      `INSERT INTO medicines 
      (patient_id, medicine_name, dosage, frequency, start_date, end_date, stock_quantity, refill_threshold)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        medicine_name,
        dosage,
        frequency,
        start_date,
        end_date,
        stock_quantity,
        refill_threshold,
      ],
    );
    const medicineId = medicineResult.insertId;

    // 2️⃣ Generate dates between start and end
    let currentDate = new Date(start_date);
    const lastDate = new Date(end_date);

    while (currentDate <= lastDate) {
      for (let time of times) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const scheduledDateTime = dateStr + " " + time; // string 'YYYY-MM-DD HH:MM:SS'

        // 3️⃣ Insert into dose_records
        const [doseResult] = await db.promise().query(
          `INSERT INTO dose_records 
          (medicine_id, patient_id, scheduled_time, status)
          VALUES (?, ?, ?, 'pending')`,
          [medicineId, patient_id, scheduledDateTime],
        );

        const doseId = doseResult.insertId;

        // 4️⃣ Insert into reminders
        await db.promise().query(
          `INSERT INTO reminders
          (medicine_id, dose_id, reminder_time, reminder_status)
          VALUES (?, ?, ?, 'scheduled')`,
          [medicineId, doseId, scheduledDateTime],
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({ message: "Medicine schedule created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create schedule" });
  }
};

// ================= UPDATE MEDICINE =================
exports.updateMedicine = (req, res) => {
  const { id } = req.params;

  const {
    medicine_name,
    dosage,
    frequency,
    start_date,
    end_date,
    stock_quantity,
    refill_threshold,
  } = req.body;

  const query = `
    UPDATE medicines
    SET medicine_name = ?, dosage = ?, frequency = ?, 
        start_date = ?, end_date = ?, 
        stock_quantity = ?, refill_threshold = ?
    WHERE medicine_id = ?
  `;

  db.query(
    query,
    [
      medicine_name,
      dosage,
      frequency,
      start_date,
      end_date,
      stock_quantity,
      refill_threshold,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Medicine updated successfully" });
    },
  );
};

// ================= DELETE MEDICINE =================
exports.deleteMedicine = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM medicines WHERE medicine_id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Medicine deleted successfully" });
  });
};

// ================= LOW STOCK =================
exports.getLowStock = (req, res) => {
  const patientId = req.params.patientId;

  const query = `
    SELECT * FROM medicines
    WHERE patient_id = ? AND stock_quantity <= refill_threshold
  `;

  db.query(query, [patientId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Get refill alerts for a patient
exports.getRefillAlerts = (req, res) => {
  const { patientId } = req.params;

  const query = `
    SELECT medicine_name, stock_quantity, refill_threshold
    FROM medicines
    WHERE patient_id = ? AND stock_quantity <= refill_threshold
  `;

  db.query(query, [patientId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results); // send list of low-stock medicines
  });
};
