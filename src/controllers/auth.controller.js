const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const { allowedRoles } = require("../utils/model.utils");
const { setStatus } = require("../utils/status.utils");

const login = async (email, password, res, authType = "login") => {
  const jwtSecret = process.env.JWT_SECRET;
  const user = await User.findOne({ email });
  if (!user) return statusCodeTemplate(res, 404, "Invalid credentials.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) statusCodeTemplate(res, 401, "Invalid credentials.");

  const userId = user._id;

  const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "12h" });

  await setStatus(userId, "Active");
  if (authType === "login") {
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  }

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    message: "User registered successfully.",
  });
};

exports.register = async (req, res) => {
  const { role, email, password } = req.body;
  console.log("Register api called");

  getMissingFields(["role", "email", "password"], req.body, res);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return statusCodeTemplate(
        res,
        400,
        "A user with this email already exists."
      );

    if (!allowedRoles.includes(role.toLowerCase())) {
      return statusCodeTemplate(res, 400, "Invalid user role.");
    }

    const user = new User({
      email: email,
      password: password,
      role: role,
      department: "",
    });
    await user.save();

    await login(email, password, res, (authType = "register"));
    // return statusCodeTemplate(res, 201, "User successfully registered.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login api called");

  getMissingFields(["email", "password"], req.body, res);

  try {
    await login(email, password, res);
  } catch (error) {
    return catchTemplate(res, error);
  }
};
