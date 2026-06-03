const express = require("express");
const router = express.Router();
const controller = require("../controllers/reminderController");

// ✅ Specific routes FIRST
router.get("/notifications/:patientId", controller.getDueNotifications);
router.put("/mark-dose", controller.markDose);
router.put("/snooze/:reminderId", controller.snoozeReminder);
router.put("/mark-sent/:reminderId", controller.markReminderAsSeen);

// ✅ Dynamic route LAST
router.get("/:patientId", controller.getReminders);

module.exports = router;
