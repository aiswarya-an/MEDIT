const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");

// Low stock alert
router.get("/low-stock/:patientId", medicineController.getLowStock);

router.get("/refill-alerts/:patientId", medicineController.getRefillAlerts);

// List all medicines
router.get("/:patientId", medicineController.getMedicines);

// Add new medicine
//router.post("/", medicineController.addMedicine);

router.post("/", medicineController.createMedicineSchedule);

// Update medicine
router.put("/:id", medicineController.updateMedicine);

// Delete medicine
router.delete("/:id", medicineController.deleteMedicine);

module.exports = router;
