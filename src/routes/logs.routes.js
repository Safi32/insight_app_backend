const express = require("express");
const logsController = require("../controllers/logs.controller");
const { verifyToken } = require("../middlewares/verification.middleware");
const router = express.Router();

router.post("/set-status", verifyToken, logsController.setUserStatus);
router.post("/get-status", verifyToken, logsController.getUserStatus);

router.post("/set-incident", verifyToken, logsController.setUserIncident);
router.post("/get-incident", verifyToken, logsController.getUserIncident);

router.post("/set-behaviour", verifyToken, logsController.setUserBehaviour);
router.post("/get-behaviour", verifyToken, logsController.getUserBehaviour);

module.exports = router;