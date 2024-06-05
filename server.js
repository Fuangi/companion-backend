const dotenv = require("dotenv");
const mongoose = require("mongoose");
const notifController = require("./controllers/notificationController");

dotenv.config({ path: "./.config.env" });
const app = require("./app");

// Connecting to the database
const DB = "mongodb://127.0.0.1:27017/companion";

mongoose.connect(DB).then((con) => {
  console.log("Database connection successful");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("App running on port " + port);
  notifController.scheduleNotifications();
});

// handling unhandled rejected promises - from asynchronous code
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔴 Shutting down...");

  console.log(err.name, err.message);
  // server.close(() => {
  process.exit(1);
  // });
});
