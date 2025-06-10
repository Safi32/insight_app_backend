const express = require("express");
const departmentController = require("../controllers/department.controller");
const { verifyToken, verifyRole } = require("../middlewares/verification.middleware");
const router = express.Router();

router.post("/add-department", verifyToken, departmentController.addDepartment);

module.exports = router;