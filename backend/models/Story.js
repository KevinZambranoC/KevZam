const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    data: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      maxlength: 200,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    seen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("story", StorySchema);
