// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./db");

const app = express();

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Replace your existing static and root route lines with these 3 lines:
const frontendPath = path.join(__dirname, "..", "frontend");

app.use(express.static(frontendPath));
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// ==================== Routes ====================
// Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Medicines CRUD
const medicineRoutes = require("./routes/medicineRoutes");
app.use("/api/medicines", medicineRoutes);

// Caregiver routes
const caregiverRoutes = require("./routes/caregiverRoutes");
app.use("/api/caregiver", caregiverRoutes);

// Patient routes
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);

// Reminders
const reminderRoutes = require("./routes/reminderRoutes");
app.use("/api/reminders", reminderRoutes);

// Reports
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Prescriptions
const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// ==================== Scheduler ====================
require("./scheduler");

// ==================== Start Server ====================
console.log(
  "Checking frontend path:",
  path.resolve(__dirname, "..", "frontend"),
);
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
