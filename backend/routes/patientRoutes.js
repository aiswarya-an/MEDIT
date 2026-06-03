const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

// Send link requests
router.post("/request", patientController.sendLinkRequest);

// get patient link status
router.get("/status/:patientId", patientController.getPatientLinkStatus);

// Get patient profile
router.delete("/delete-link", patientController.deleteLinkRequest);

module.exports = router;
