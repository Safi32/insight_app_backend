const express = require("express");
const logsController = require("../controllers/logs.controller");
const { verifyToken } = require("../middlewares/verification.middleware");
const router = express.Router();

router.post("/set-status", verifyToken, logsController.setUserStatus);

module.exports = router;