const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "You can't send an empty message"],
  },
  sender: {
    type: String,
  },
  sentTime: String,
});
