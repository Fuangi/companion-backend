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
    type: Number,
    required: [true, "You must provide a start time for the event"],
  },
  eventEnd: {
    type: Number,
    required: [true, "You must provide an end time for the event"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updatedAt: Date,
  isCompleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

// Middlewares
// to check if the document has been modified and save the date and time it was changed
plannerSchema.pre("save", function (next) {
  if (!this.isModified || this.isNew) return next();
  // check and skip if the document is just created or has not been modified

  //save the date and time now if it has been modified
  this.updatedAt = Date.now() - 1000;

  next();
});

const Planner = mongoose.model("Planner", plannerSchema);

module.exports = Planner;
