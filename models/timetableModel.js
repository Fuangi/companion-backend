const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  days: {
    type: [String],
    required: [true, "Please provide the days you'll like to study on"],
  },
  timeSlots: {
    type: [String],
    required: [true, "Please provide the timeslots you' like to study during"],
  },
  subjects: {
    type: [String],
    required: [true, "Please provide the subjects you'll want to study"],
  },
  break: String,
});

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
