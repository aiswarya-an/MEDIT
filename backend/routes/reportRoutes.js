const express = require("express");
const router = express.Router();

const {
  getWeeklyReport,
  getMonthlyReport,
  exportReport,
} = require("../controllers/reportController");

// Weekly adherence report
router.get("/weekly/:patientId", getWeeklyReport);

// Monthly adherence report
router.get("/monthly/:patientId", getMonthlyReport);

// Export full dose records
router.get("/export/:patientId", exportReport);

module.exports = router;
