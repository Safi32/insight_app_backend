const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { allowedRoles } = require("../utils/model.utils");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: function() {
        return this.name;
      }
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true // This allows multiple null/undefined values while maintaining uniqueness for non-null values
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      required: true,
      enum: allowedRoles,
    },
    profilePicture: {
      type: String,
      default: null
    },
    profilePictureSource: {
      type: String,
      enum: ['google', 'custom', 'default'],
      default: 'default'
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ""
    },
    department: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Department",
    },
    lastLogin: {
      type: Date,
      default: null
    },
    firebaseUid: {
      type: String,
      default: null,
      sparse: true // This allows multiple null/undefined values while maintaining uniqueness for non-null values
    },
  },
  { timestamps: true }
);

 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
