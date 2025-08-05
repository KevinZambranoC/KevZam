const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  file: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("message", messageSchema);