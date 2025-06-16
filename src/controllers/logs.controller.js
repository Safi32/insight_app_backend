const User = require("../models/user.model");
const UserStatus = require("../models/userStatus.model");
const UserIncidents = require("../models/userIncidents.model");
const UserBehaviours = require("../models/userBehaviours.model");
const { setStatus, setIncident, setBehaviour } = require("../utils/status.utils");
const {
  getMissingFields,
  statusCodeTemplate,
  catchTemplate,
} = require("../utils/api.utils");

exports.setUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    if (getMissingFields(["userId", "status"], req.body, res)) return;

    const user = await User.findById(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    await setStatus(userId, status);
    return statusCodeTemplate(res, 200, "Status added successfully.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.getUserStatus = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length < 1) {
    return statusCodeTemplate(
      res,
      400,
      "userIds array is required. Minimum one userId is required."
    );
  }

  try {
    // fetch all logs for the given id
    const logs = await UserStatus.find({
      userId: {
        $in: userIds.map((id) => (id)),
      },
    }).sort({
      timeStamp: -1,
    });

    // group logs by userId
    const groupedLogs = {};
    logs.forEach((log) => {
      const uid = log.userId.toString();
      if (!groupedLogs[uid]) {
        groupedLogs[uid] = [];
      }
      groupedLogs[uid].push({
        status: log.status,
        timeStamp: log.timeStamp,
      });
    });

    return res.status(200).json({
      logs: groupedLogs,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.setUserIncident = async (req, res) => {
  const { userId, incident } = req.body;

  try {
    if (getMissingFields(["userId", "incident"], req.body, res)) return;

    const user = await User.findById(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    await setIncident(userId, incident);
    return statusCodeTemplate(res, 200, "Incident added successfully.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.getUserIncident = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length < 1) {
    return statusCodeTemplate(
      res,
      400,
      "userIds array is required. Minimum one userId is required."
    );
  }

  try {
    // fetch all logs for the given id
    const logs = await UserIncidents.find({
      userId: {
        $in: userIds.map((id) => (id)),
      },
    }).sort({
      timeStamp: -1,
    });

    // group logs by userId
    const groupedLogs = {};
    logs.forEach((log) => {
      const uid = log.userId.toString();
      if (!groupedLogs[uid]) {
        groupedLogs[uid] = [];
      }
      groupedLogs[uid].push({
        incident: log.incident,
        timeStamp: log.timeStamp,
      });
    });

    return res.status(200).json({
      logs: groupedLogs,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.setUserBehaviour = async (req, res) => {
  const { userId, behaviour } = req.body;

  try {
    if (getMissingFields(["userId", "behaviour"], req.body, res)) return;

    const user = await User.findById(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    await setBehaviour(userId, behaviour);
    return statusCodeTemplate(res, 200, "Behaviour added successfully.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.getUserBehaviour = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length < 1) {
    return statusCodeTemplate(
      res,
      400,
      "userIds array is required. Minimum one userId is required."
    );
  }

  try {
    // fetch all logs for the given id
    const logs = await UserBehaviours.find({
      userId: {
        $in: userIds.map((id) => (id)),
      },
    }).sort({
      timeStamp: -1,
    });

    // group logs by userId
    const groupedLogs = {};
    logs.forEach((log) => {
      const uid = log.userId.toString();
      if (!groupedLogs[uid]) {
        groupedLogs[uid] = [];
      }
      groupedLogs[uid].push({
        behaviour: log.behaviour,
        timeStamp: log.timeStamp,
      });
    });

    return res.status(200).json({
      logs: groupedLogs,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};