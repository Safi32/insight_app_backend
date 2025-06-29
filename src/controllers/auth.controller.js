const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const { allowedRoles } = require("../utils/model.utils");
const { setStatus } = require("../utils/status.utils");
const EmailUtils = require("../utils/email.utils").default;

const login = async (email, password, role, res, authType = "login") => {
  const jwtSecret = process.env.JWT_SECRET;
  const user = await User.findOne({ email, role });
  if (!user) return statusCodeTemplate(res, 404, "Invalid credentials.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return statusCodeTemplate(res, 401, "Invalid credentials.");

  const userId = user._id;

  const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "12h" });

  // Update last login time
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() });

  await setStatus(userId, "Active");
  if (authType === "login") {
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
      },
    });
  }

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      department: user.department,
    },
    message: "User registered successfully.",
  });
};

const otpStore = {};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (getMissingFields(["email"], req.body, res)) return;
  try {
    const otp = EmailUtils.generateOTP();
    otpStore[email] = { otp, createdAt: Date.now() };
    await EmailUtils.sendOTPEmail({ to: email, otp });
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (getMissingFields(["email", "otp"], req.body, res)) return;
  const record = otpStore[email];
  if (!record) {
    return statusCodeTemplate(res, 400, "No OTP sent to this email or OTP expired.");
  }
  
  const isExpired = Date.now() - record.createdAt > 5 * 60 * 1000;
  if (isExpired) {
    delete otpStore[email];
    return statusCodeTemplate(res, 400, "OTP expired. Please request a new one.");
  }
  if (record.otp !== otp) {
    return statusCodeTemplate(res, 400, "Invalid OTP.");
  }
  delete otpStore[email];  
  return res.status(200).json({ message: "OTP verified successfully." });
};

exports.verifyOTPAndRegister = async (req, res) => {
  const { email, otp, name, password, role, phoneNumber } = req.body;
  if (getMissingFields(["email", "otp", "name", "password", "role", "phoneNumber"], req.body, res)) return;

  const record = otpStore[email];
  if (!record) {
    return statusCodeTemplate(res, 400, "No OTP sent to this email or OTP expired.");
  }

  const isExpired = Date.now() - record.createdAt > 5 * 60 * 1000;
  if (isExpired) {
    delete otpStore[email];
    return statusCodeTemplate(res, 400, "OTP expired. Please request a new one.");
  }

  if (record.otp !== otp) {
    return statusCodeTemplate(res, 400, "Invalid OTP.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return statusCodeTemplate(
        res,
        400,
        "A user with this email already exists."
      );

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone)
      return statusCodeTemplate(
        res,
        400,
        "A user with this phone number already exists."
      );

    if (!allowedRoles.includes(role.toLowerCase())) {
      return statusCodeTemplate(res, 400, "Invalid user role.");
    }

    const user = new User({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      role: role,
      department: "",
    });
    await user.save();

    delete otpStore[email];
    await login(email, password, role, res, (authType = "register"));
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (getMissingFields(["email", "password"], req.body, res)) return;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    user.password = password;
    await user.save();

    return statusCodeTemplate(res, 200, "Password updated successfully.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // From JWT token

  if (getMissingFields(["currentPassword", "newPassword"], req.body, res)) return;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return statusCodeTemplate(res, 401, "Current password is incorrect.");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return statusCodeTemplate(res, 200, "Password changed successfully.");
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("Login api called");

  if (getMissingFields(["email", "password", "role"], req.body, res)) return;

  try {
    await login(email, password, role, res);
  } catch (error) {
    return catchTemplate(res, error);
  }
};
