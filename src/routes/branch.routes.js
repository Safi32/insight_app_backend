const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const branchController = require("../controllers/branch.controller");
const router = express.Router();

// Admin only routes (require admin role)
router.post("/add-branch", verifyToken, verifyRole(["admin"]), branchController.addBranch);
router.put("/update-branch/:branchId", verifyToken, verifyRole(["admin"]), branchController.updateBranch);
router.delete("/delete-branch/:branchId", verifyToken, verifyRole(["admin"]), branchController.deleteBranch);

// Public routes (no authentication required)
router.get("/get-all-branches", branchController.getAllBranches);
router.get("/get-branch/:branchId", branchController.getBranchById);

module.exports = router; 