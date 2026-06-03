const express = require("express");
const router = express.Router();
const caregiverController = require("../controllers/caregiverController");

// respond to link request
router.put("/respond", caregiverController.respondLinkRequest);

// get linked patients
router.get("/patients/:caregiverId", caregiverController.getLinkedPatients);

module.exports = router;
