const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Total medicines
router.get(
  "/total-medicines/:patientId",
  dashboardController.getTotalMedicines,
);

// Today's reminders
router.get(
  "/today-reminders/:patientId",
  dashboardController.getTodayReminders,
);

// Weekly adherence report
router.get(
  "/adherence-report/:patientId",
  dashboardController.getAdherenceReport,
);

module.exports = router;
