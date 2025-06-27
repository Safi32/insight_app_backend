const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const profileController = require("../controllers/profile.controller");
const router = express.Router();

router.get("/get-profile/:id", verifyToken, profileController.getProfile);
router.put("/update-profile", verifyToken, profileController.updateProfile);

module.exports = router;