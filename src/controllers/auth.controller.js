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
        phoneNumber: user.phoneNumber || null,
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
      phoneNumber: user.phoneNumber || null,
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
  if (getMissingFields(["email", "otp", "name", "password", "role"], req.body, res)) return;

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

    // Only check for existing phone number if phoneNumber is provided
    if (phoneNumber && phoneNumber.trim() !== "") {
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone)
        return statusCodeTemplate(
          res,
          400,
          "A user with this phone number already exists."
        );
    }

    if (!allowedRoles.includes(role.toLowerCase())) {
      return statusCodeTemplate(res, 400, "Invalid user role.");
    }

    const userData = {
      name: name,
      email: email,
      password: password,
      role: role,
      department: "",
    };
    
    // Only include phoneNumber if it's provided and not empty
    // For signup without phone number, we don't include the field at all
    if (phoneNumber && phoneNumber.trim() !== "") {
      userData.phoneNumber = phoneNumber;
    }
    // Note: phoneNumber field is completely omitted if not provided
    
    const user = new User(userData);
    await user.save();

    delete otpStore[email];
    
    // Return success message instead of auto-login
    return res.status(201).json({
      message: "User registered successfully. Please log in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
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

exports.googleSignIn = async (req, res) => {
  const { firebaseUid, email, name, role, photoURL } = req.body;
  console.log("Google Sign-In API called");

  if (getMissingFields(["firebaseUid", "email", "name", "role"], req.body, res)) return;

  try {
    // First, try to find user by email and role
    let user = await User.findOne({ email, role });
    
    // If not found by email and role, try to find by firebaseUid
    if (!user) {
      user = await User.findOne({ firebaseUid });
    }
    
    // If still not found, check if user exists with this email but different role
    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return statusCodeTemplate(res, 400, `Account exists with email but different role. Your account role is: ${existingUser.role}`);
      }
      return statusCodeTemplate(res, 404, "No account found. Please sign up first.");
    }

    // Update user with Firebase UID and profile picture if provided
    const updateData = { firebaseUid };
    
    // Only update profile picture if user doesn't have a custom one
    console.log(`User profile picture info:`, {
      currentPicture: user.profilePicture,
      currentSource: user.profilePictureSource,
      googlePhotoURL: photoURL
    });
    
    if (photoURL && (!user.profilePicture || user.profilePictureSource !== 'custom')) {
      updateData.profilePicture = photoURL;
      updateData.profilePictureSource = 'google';
      console.log(`Updating profile picture to Google photo`);
    } else {
      console.log(`Keeping existing profile picture (custom or no Google photo)`);
    }
    
    // If user was found but role doesn't match, update the role if it's empty or update user info
    if (user.role !== role.toLowerCase()) {
      return statusCodeTemplate(res, 400, `Account exists with different role. Your account role is: ${user.role}`);
    }
    
    await User.findByIdAndUpdate(user._id, updateData);

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "12h" });

    // Update last login time
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    await setStatus(user._id, "Active");

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture, // Always use the user's current profile picture
      },
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.googleSignUp = async (req, res) => {
  const { firebaseUid, email, name, role, photoURL } = req.body;
  console.log("Google Sign-Up API called");

  if (getMissingFields(["firebaseUid", "email", "name", "role"], req.body, res)) return;

  try {
    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return statusCodeTemplate(res, 400, `An account with this email already exists with role: ${existingUser.role}. Please try logging in instead.`);
    }

    // Check if user exists with this Firebase UID (edge case)
    const existingFirebaseUser = await User.findOne({ firebaseUid });
    if (existingFirebaseUser) {
      return statusCodeTemplate(res, 400, "This Google account is already linked to another user. Please try logging in instead.");
    }

    // Validate role
    if (!allowedRoles.includes(role.toLowerCase())) {
      return statusCodeTemplate(res, 400, "Invalid user role.");
    }

    // Create new user with Google data
    const userData = {
      name: name,
      email: email,
      password: firebaseUid, // Use Firebase UID as password for Google users
      role: role.toLowerCase(),
      department: "",
      firebaseUid: firebaseUid,
      profilePicture: photoURL || null,
      profilePictureSource: photoURL ? 'google' : 'default',
    };

    const user = new User(userData);
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "12h" });

    // Update last login time and set status
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    await setStatus(user._id, "Active");

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
      },
      message: "User registered successfully with Google.",
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

exports.syncFirebaseUser = async (req, res) => {
  const { firebaseUid, email, name, role, photoURL } = req.body;
  console.log("Sync Firebase User API called");

  if (getMissingFields(["firebaseUid", "email", "name", "role"], req.body, res)) return;

  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ 
      $or: [
        { email: email },
        { firebaseUid: firebaseUid }
      ]
    });

    if (existingUser) {
      // Update existing user with Firebase UID if missing
      const updateData = {};
      if (!existingUser.firebaseUid) {
        updateData.firebaseUid = firebaseUid;
      }
      
      // Only update profile picture if user doesn't have a custom one
      if (photoURL && (!existingUser.profilePicture || existingUser.profilePictureSource !== 'custom')) {
        updateData.profilePicture = photoURL;
        updateData.profilePictureSource = 'google';
      }

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(existingUser._id, updateData);
      }

      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign({ id: existingUser._id }, jwtSecret, { expiresIn: "12h" });

      await User.findByIdAndUpdate(existingUser._id, { lastLogin: new Date() });
      await setStatus(existingUser._id, "Active");

      return res.status(200).json({
        token,
        user: {
          id: existingUser._id,
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phoneNumber: existingUser.phoneNumber || null,
          role: existingUser.role,
          department: existingUser.department,
          profilePicture: existingUser.profilePicture, // Always use the user's current profile picture
        },
        message: "User synced successfully.",
      });
    }

    // Validate role
    if (!allowedRoles.includes(role.toLowerCase())) {
      return statusCodeTemplate(res, 400, "Invalid user role.");
    }

    // Create new user (this handles orphaned Firebase users)
    const userData = {
      name: name,
      email: email,
      password: firebaseUid, // Use Firebase UID as password for Google users
      role: role.toLowerCase(),
      department: "",
      firebaseUid: firebaseUid,
      profilePicture: photoURL || null,
      profilePictureSource: photoURL ? 'google' : 'default',
    };

    const user = new User(userData);
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "12h" });

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    await setStatus(user._id, "Active");

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
      },
      message: "User created and synced successfully.",
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};
