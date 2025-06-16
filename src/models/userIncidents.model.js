const mongoose = require("mongoose");

const userIncidentsSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  incident: {
    required: true,
    type: String,
  },
  timeStamp: Date,
});

module.exports = mongoose.model(
  "UserIncidents",
  userIncidentsSchema,
  "user_incidents"
);
