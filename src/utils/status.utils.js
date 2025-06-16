const User = require("../models/user.model");
const UserLogs = require("../models/userLogs.model");
const { getMissingFields, statusCodeTemplate } = require("./api.utils");

const setStatus = async (userId, status) => {
  if (getMissingFields(["userId", "status"], { userId, status })) return;

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
