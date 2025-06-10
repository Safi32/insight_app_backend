const express = require("express");
const departmentController = require("../controllers/department.controller");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const router = express.Router();

router.get("/get-departments", verifyToken, departmentController.getAllDepartments);
router.get("/get-department/:id", verifyToken, departmentController.getDepartment);
router.get("/get-user-department/:id", verifyToken, departmentController.getUserDepartment);
router.post("/add-department", verifyToken, departmentController.addDepartment);
router.patch("/update-department", verifyToken, departmentController.updateUserDepartment);

module.exports = router;