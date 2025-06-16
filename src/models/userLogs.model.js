const mongoose = require("mongoose");

const userLogsSchema = new mongoose.Schema({
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

module.exports = mongoose.model("UserLogs", userLogsSchema);
