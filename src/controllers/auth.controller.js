const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { statusCodeTemplate, catchTemplate } = require("../utils/api.utils");

exports.register = async (req, res) => {
  const { role, email, password } = req.body;
  console.log("Register api called");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return statusCodeTemplate(res, 400, "A user with this email already exists.");

    const user = new User({
      email: email,
      password: password,
      role: role,
    });
    await user.save();

    return statusCodeTemplate(res, 201, "User successfully registered.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.login = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  const { email, password } = req.body;
  console.log("Login api called");

  try {
    const user = await User.findOne({ email });
    if (!user)
      return statusCodeTemplate(res, 404, "A user with this email doesn't exist.");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) statusCodeTemplate(res, 401, "Incorrect password.");

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "12h" });
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};
