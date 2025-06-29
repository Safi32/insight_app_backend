const {
  statusCodeTemplate,
  catchTemplate,
  getMissingFields,
} = require("../utils/api.utils");
const { allowedRoles } = require("../utils/model.utils");
const User = require("../models/user.model");

// Add new user (Admin only)
exports.addUser = async (req, res) => {
  const { fullName, email, phoneNumber, role, password, confirmPassword } = req.body;

  // Validate required fields
  if (getMissingFields(["fullName", "email", "phoneNumber", "role", "password", "confirmPassword"], req.body, res)) return;

  // Validate password confirmation
  if (password !== confirmPassword) {
    return statusCodeTemplate(res, 400, "Password and confirm password do not match.");
  }

  // Validate password length
  if (password.length < 6) {
    return statusCodeTemplate(res, 400, "Password must be at least 6 characters long.");
  }

  // Validate role
  if (!allowedRoles.includes(role.toLowerCase())) {
    return statusCodeTemplate(res, 400, "Invalid user role.");
  }

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return statusCodeTemplate(res, 400, "Email already exists.");
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return statusCodeTemplate(res, 400, "Phone number already exists.");
    }

    const user = new User({
      name: fullName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      role: role.toLowerCase(),
      department: ""
    });

    await user.save();

    res.status(201).json({
      message: "User added successfully.",
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
        bio: user.bio,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return statusCodeTemplate(res, 400, "User ID is required.");
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, phoneNumber, role, password, confirmPassword } = req.body;

  if (!userId) {
    return statusCodeTemplate(res, 400, "User ID is required.");
  }

  try {
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    const updateData = {};

    // Update name if provided
    if (fullName) updateData.name = fullName;

    // Update email if provided
    if (email && email !== existingUser.email) {
      const duplicateEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (duplicateEmail) {
        return statusCodeTemplate(res, 400, "Email already exists.");
      }
      updateData.email = email;
    }

    // Update phone number if provided
    if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
      const duplicatePhone = await User.findOne({ phoneNumber, _id: { $ne: userId } });
      if (duplicatePhone) {
        return statusCodeTemplate(res, 400, "Phone number already exists.");
      }
      updateData.phoneNumber = phoneNumber;
    }

    // Update role if provided
    if (role) {
      if (!allowedRoles.includes(role.toLowerCase())) {
        return statusCodeTemplate(res, 400, "Invalid user role.");
      }
      updateData.role = role.toLowerCase();
    }

    // Update password if provided
    if (password) {
      if (!confirmPassword) {
        return statusCodeTemplate(res, 400, "Confirm password is required when updating password.");
      }
      if (password !== confirmPassword) {
        return statusCodeTemplate(res, 400, "Password and confirm password do not match.");
      }
      if (password.length < 6) {
        return statusCodeTemplate(res, 400, "Password must be at least 6 characters long.");
      }
      updateData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: "User updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        department: updatedUser.department,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return statusCodeTemplate(res, 400, "User ID is required.");
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    res.status(200).json({
      message: "User deleted successfully."
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
}; 