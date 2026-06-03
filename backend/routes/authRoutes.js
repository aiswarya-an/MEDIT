const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register & Login
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Profile setup
router.put("/profile-setup", authController.profileSetup);

// Get profile info
router.get("/profile/:userId", authController.getProfile);

module.exports = router;
