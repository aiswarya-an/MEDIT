const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const {
  uploadPrescription,
  getPrescriptions,
  downloadPrescription,
} = require("../controllers/prescriptionController");

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------------- Routes ----------------

// Upload prescription
router.post("/upload", upload.single("file"), uploadPrescription);

// Download a prescription
router.get("/download/:id", downloadPrescription);

// Get prescriptions for a patient
router.get("/:patientId", getPrescriptions);

module.exports = router;
