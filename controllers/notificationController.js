const Notification = require("../models/notification.model");
const factory = require("./handlerFactory");
const cron = require("node-cron");

exports.createNotification = async (req, res) => {
  const { message, schedule } = req.body;
  const notification = await Notification.create({
    message,
    schedule,
    active: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      data: notification,
    },
  });
};

exports.updateNotification = factory.updateOne(Notification);

exports.scheduleNotifications = async () => {
  const notifications = await Notification.find({ active: true });

  notifications.forEach((notification) => {
    if (cron.validate(notification.schedule)) {
      cron.schedule(notification.schedule, () => {
        sendNotification(notification);
      });
    }
  });
};

const sendNotification = async (notification) => {
  // Logic to send the notification
  console.log(`Sending notification ${notification.message}`);

  // update lastSent field
  notification.lastSent = new Date();
  await notification.save();
};
