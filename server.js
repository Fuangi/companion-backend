const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io"); //get the socket.io server

// Database Models
const User = require("./models/user.model");
const Group = require("./models/groupModel");
const Message = require("./models/message.model");

dotenv.config({ path: "./.config.env" });
const app = require("./app");

const server = http.createServer(app); //create http server

// Connecting to the database
const DB = "mongodb://127.0.0.1:27017/companion";

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log("Database connection successful");
});

// Connecting to socket.io
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://student-companion-theta.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected to socket.io", socket.id);

  // When a user joins a group, we emit this event
  socket.on("joinGroup", async ({ groupId, userId }) => {
    console.log(groupId, userId);
    socket.join(groupId);
    io.to(groupId).emit("userJoined", userId);

    // Update the group's members array in the database
    const newUser = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } } // $addToSet ensures no duplicates
    );
  });

  // When a user leaves a group, we emit this event
  socket.on("leaveGroup", ({ groupId, userId }) => {
    socket.leave(groupId);
    io.to(groupId).emit("userLeft", userId);
  });

  // when a user sends a message
  socket.on("sendMessage", async ({ groupId, userId, message }) => {
    const newMsg = await Message.create({
      groupId,
      userId,
      message,
      timeStamp: new Date(),
    });
    io.to(groupId).emit("receiveMessage", newMsg);
    console.log("sent");
  });

  // When a user is typing a message
  socket.on("typing", ({ groupId, userId }) => {
    io.to(groupId).emit("typing", userId);
  });

  // When a user stops typing
  socket.on("stopTyping", ({ groupId, userId }) => {
    io.to(groupId).emit("stopTyping", userId);
  });

  // when a user disconnects - is offline
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("App running on port " + port);
});

// handling unhandled rejected promises - from asynchronous code
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔴 Shutting down...");

  console.log(err.name, err.message);
  // server.close(() => {
  process.exit(1);
  // });
});
