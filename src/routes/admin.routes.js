const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

// Admin only routes (require admin role)
router.post("/add-user", verifyToken, verifyRole(["admin"]), adminController.addUser);
router.get("/get-all-users", verifyToken, verifyRole(["admin"]), adminController.getAllUsers);
router.get("/get-user/:userId", verifyToken, verifyRole(["admin"]), adminController.getUserById);
router.put("/update-user/:userId", verifyToken, verifyRole(["admin"]), adminController.updateUser);
router.delete("/delete-user/:userId", verifyToken, verifyRole(["admin"]), adminController.deleteUser);

module.exports = router; 