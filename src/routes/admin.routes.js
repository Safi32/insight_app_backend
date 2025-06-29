const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

// Admin routes (temporarily allowing all authenticated users for testing)
router.post("/add-user", verifyToken, adminController.addUser);
router.get("/get-all-users", verifyToken, adminController.getAllUsers);
router.get("/get-user/:userId", verifyToken, adminController.getUserById);
router.put("/update-user/:userId", verifyToken, adminController.updateUser);
router.delete("/delete-user/:userId", verifyToken, adminController.deleteUser);

module.exports = router; 