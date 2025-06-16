const User = require("../models/user.model");
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
