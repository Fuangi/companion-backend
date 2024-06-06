const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const notifController = require("./controllers/notificationController");
const { Server } = require("socket.io"); //get the socket.io server

dotenv.config({ path: "./.config.env" });
const app = require("./app");

const server = http.createServer(app); //create pour http server

// Create the socket io server
io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// Connecting to the database
const DB = "mongodb://127.0.0.1:27017/companion";

mongoose.connect(DB).then((con) => {
  console.log("Database connection successful");
});

const port = process.env.PORT || 4000;

// Listening to events from the clients
io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  // To create rooms - like group chats where we specify the value (id)
  // of the group
  socket.on("join_room", (data) => {
    socket.join(data); //the room name, or id pr whatever
  });

  socket.on("send_message", (data) => {
    // Sending to everyone connected to this server - broadcast send to all except u
    console.log(data);
    socket.broadcast.emit("receive_message", data.message);
    // Sending now to a particular person or a particular room
    // socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
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
