const { statusCodeTemplate, catchTemplate, getMissingFields } = require("../utils/api.utils");
const { objectIdRegex } = require("../utils/model.utils");
const User = require("../models/user.model");

const getProfile = async (req, res) => {
  const id = req.params.id;

  const missingFields = getMissingFields(["id"], req.params);
  if (missingFields.length > 0) {
    return statusCodeTemplate(
      res,
      400,
      `Missing required field(s): ${missingFields.join(", ")}`
    );
  }

    if (id.length < 24 || !objectIdRegex.test(id))
      return statusCodeTemplate(res, 404, "Invalid user id.");

  try {
    const user = await User.findById(id);
    if (!user) 
        return statusCodeTemplate(res, 404, "user not found.");

    res.status(200).json({
        user
    });

  } catch (error) {
    return catchTemplate(res, error);
  }
};

module.exports = {
  getProfile,
};
