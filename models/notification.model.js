const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  active: Boolean, //to store it will be true if uer has it on or false otherwise
  lastSent: Date,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
