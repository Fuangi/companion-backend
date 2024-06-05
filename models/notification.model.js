const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  schedule: String,
  active: Boolean, //to store it will be true if uer has it on or false otherwise
  lastSent: Date,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
