const Notification = require("../models/notification.model");
const factory = require("./handlerFactory");
const cron = require("node-cron");

/* exports.createNotification = async (req, res) => {
  const {title, schedule, frequency, userId, description} = req.body

  const notification = await Notification.create({
    title,
    schedule,
    description,
    userId,
    frequency
  });

  res.status(201).json({
    status: "success",
    data: {
      data: notification,
    },
  });
}; */

exports.createNotification = factory.createOne(Notification);
exports.updateNotification = factory.updateOne(Notification);

const scheduleNotifications = async () => {
  const notifications = await Notification.find();

  notifications.forEach((notification) => {
    const { schedule, frequency, _id, title, description, userId } =
      notification;
    const cronTime = getCronTime(schedule, frequency);

    cron.schedule(
      cronTime,
      () => {
        sendNotification(userId, title, description);
      },
      { scheduled: true, timezone: "UTC" }
    );
  });
};

function getCronTime(schedule, frequency) {
  const date = new Date(schedule);
  const minutes = date.getUTCMinutes();
  const hour = date.getUTCHours();
  const day = date.getUTCDay();
  const month = date.getUTCMonth() + 1; //they are 0-based in JS Date
  const dayOfWeek = date.getUTCDay();

  switch (frequency) {
    case "daily":
      return `${minutes} ${hour} * * *`;
    case "weekly":
      return `${minutes} ${hour} * * ${dayOfWeek}`;
    case "monthly":
      return `${minutes} ${hour} ${day} * *`;
    default:
      return `${minutes} ${hour} * * *`; // Default to daily
  }
}

const sendNotification = async (notification) => {
  // Logic to send the notification
  console.log(
    `Sending notification ${(notification.title, notification.description)}`
  );

  // update lastSent field
  notification.lastSent = new Date();
  await notification.save();
};
