const mongoose = require("mongoose");

const userBehavioursSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  behaviour: {
    required: true,
    type: String,
  },
  timeStamp: Date,
});

module.exports = mongoose.model(
  "UserBehaviours",
  userBehavioursSchema,
  "user_behaviours"
);
