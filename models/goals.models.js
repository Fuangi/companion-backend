const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: [true, "You must provide the goal you want to create"],
  },
  category: {
    type: String,
    enum: ["life", "educational", "career", "other"],
    required: [
      true,
      "You must provide the category you want the goal to be in",
    ],
  },
  userId: mongoose.Schema.Types.ObjectId,
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
