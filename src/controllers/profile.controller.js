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
      user: {
        ...user.toObject(),
        id: user._id,
      },
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

const updateProfile = async (req, res) => {
  const { name, displayName, email, phoneNumber, bio, profilePicture } = req.body;
  const userId = req.params.userId; // From URL parameter

  // Validate user ID
  if (!userId || userId.length < 24 || !objectIdRegex.test(userId)) {
    return statusCodeTemplate(res, 400, "Invalid user ID.");
  }

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return statusCodeTemplate(res, 404, "User not found.");
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return statusCodeTemplate(res, 400, "Email already exists.");
      }
    }

    // Check if phone number is being changed and if it's already taken
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser) {
        return statusCodeTemplate(res, 400, "Phone number already exists.");
      }
    }

    // Validate bio length
    if (bio && bio.length > 500) {
      return statusCodeTemplate(res, 400, "Bio cannot exceed 500 characters.");
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (displayName) updateData.displayName = displayName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
      // Mark as custom when user updates their profile picture
      updateData.profilePictureSource = 'custom';
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        department: updatedUser.department,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    return catchTemplate(res, error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
