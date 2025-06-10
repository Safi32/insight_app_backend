const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
});

module.exports = mongoose.model("Deparment", departmentSchema);