const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  schedule: {
    type: Date,
    required: true,
  },
  frequency: {
    String,
    enum: ["daily", "weekly", "monthly"],
  },
  userId: mongoose.Schema.Types.ObjectId,
  lastSent: Date,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
