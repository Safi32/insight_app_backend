const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const { objectIdRegex } = require("../utils/model.utils");
const User = require("../models/user.model");

const getProfile = async (req, res) => {
  const id = req.params.id;

  if(getMissingFields(["id"], req.params, res)) return;

  if (id.length < 24 || !objectIdRegex.test(id))
    return statusCodeTemplate(res, 404, "Invalid user id.");

  try {
    const user = await User.findById(id);
    if (!user) return statusCodeTemplate(res, 404, "user not found.");

    res.status(200).json({
      user,
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const updateProfile = async (req, res) => {
  const { userId, update } = req.body;
  
};

module.exports = {
  getProfile,
};
