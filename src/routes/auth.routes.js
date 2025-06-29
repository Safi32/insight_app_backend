const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/verification.middleware");

router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/verify-otp-and-register", authController.verifyOTPAndRegister);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;