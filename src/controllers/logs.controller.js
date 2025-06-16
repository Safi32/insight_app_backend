const User = require("../models/user.model");
const UserLogs = require("../models/userLogs.model");
const { setStatus } = require("../utils/status.utils");
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
    return statusCodeTemplate(res, 200, "Status updated successfully.");
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
    const logs = await UserLogs.find({
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
