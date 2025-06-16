const User = require("../models/user.model");
const UserLogs = require("../models/userLogs.model");
const { getMissingFields, statusCodeTemplate } = require("./api.utils");

const setStatus = async (userId, status) => {
  getMissingFields(["userId", "status"], { userId, status });

  const newLog = new UserLogs({
    timeStamp: Date.now(),
    userId: userId,
    status: status,
  });
  await newLog.save();
};

module.exports = {
  setStatus,
};
