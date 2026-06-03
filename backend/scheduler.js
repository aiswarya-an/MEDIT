const cron = require("node-cron");
const db = require("./db");

cron.schedule("* * * * *", () => {
  console.log("Running scheduler...");

  // ✅ STEP 1 — Send reminders FIRST
  // STEP 1 — Send reminders (scheduled OR snoozed)
  const sendNotifications = `
    UPDATE reminders r
    JOIN dose_records d ON r.dose_id = d.dose_id
    SET r.reminder_status = 'sent'
    WHERE r.reminder_time <= NOW()
      AND r.reminder_status IN ('scheduled','snoozed')
      AND d.status = 'pending'
  `;

  db.query(sendNotifications, (err, result) => {
    if (err) {
      console.error("Notification error:", err);
    } else {
      console.log("Reminders sent:", result.affectedRows);
    }
  });

  // ✅ STEP 2 — Mark missed doses AFTER sending reminder
  const autoMarkMissedDoses = `
    UPDATE dose_records
    SET status = 'missed'
    WHERE scheduled_time <= NOW()
      AND status = 'pending'
  `;

  db.query(autoMarkMissedDoses, (err, result) => {
    if (err) {
      console.log("Auto Mark Missed Error:", err);
    } else {
      console.log("Missed doses updated:", result.affectedRows);
    }
  });

  // ✅ STEP 3 — Reduce stock only for newly taken doses
  const reduceStock = `
    UPDATE medicines m
    JOIN dose_records d ON m.medicine_id = d.medicine_id
    SET m.stock_quantity = m.stock_quantity - 1
    WHERE d.status = 'taken'
      AND d.marked_time >= NOW() - INTERVAL 1 MINUTE
  `;

  db.query(reduceStock, (err) => {
    if (err) console.error("Stock update error:", err);
    else console.log("Stock updated");
  });

  // ✅ STEP 4 — Refill alert
  const refillCheck = `
    SELECT medicine_name, stock_quantity, refill_threshold
    FROM medicines
    WHERE stock_quantity <= refill_threshold
  `;

  db.query(refillCheck, (err, result) => {
    if (err) {
      console.error("Refill check error:", err);
      return;
    }

    result.forEach((med) => {
      console.log(
        `⚠ Refill Alert: ${med.medicine_name} is low (Stock: ${med.stock_quantity})`,
      );
    });
  });
});

console.log("Scheduler started...");
