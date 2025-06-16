const mongoose = require("mongoose");

const userStatusSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    required: true,
    type: String,
  },
  timeStamp: Date,
});

module.exports = mongoose.model("UserStatus", userStatusSchema, "user_status");
