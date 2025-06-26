const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/verify-otp-and-register", authController.verifyOTPAndRegister);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

module.exports = router;