const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/model.utils");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    picture: mongoose.Schema.Types.Mixed,
    department: {
      type: mongoose.Schema.Types.Mixed, ref: "Department"
    },
  },
  { timestamps: true }
);

// hash the password before saving
userSchema.pre("save", hashPassword);

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
