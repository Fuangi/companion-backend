const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A plan must have a name!"],
  },
  description: {
    type: String,
    required: [true, "A plan must have a description"],
  },
  eventType: {
    type: String,
    enum: ["class", "study", "assignment", "rest", "other"],
  },
  eventStart: {
    type: Date,
    default: Date.now().toLocaleString(),
    required: [true, "You must provide a start time for the event"],
  },
  eventEnd: {
    type: Date,
    required: [true, "You must provide an time for the event"],
  },
});

const Planner = mongoose.model("Planner", plannerSchema);

module.exports = Planner;
