const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

// Creating the user schema with name, email, tel, address, password and passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please prove your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "A password should have atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: ["Please confirm your password"],
    // This only works on CREATE OR SAVE - so in update we'll have to use save to check if both provided passwords match
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The two passwords must match",
    },
  },
  passwordChangedAt: Date, // to store the last time the person changed their password
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// MIDDLEWARES - this keyword in the functions points to the current query or doc
// In the case of password update - changing the password changed at
userSchema.pre("save", function (next) {
  // if the current document's password was modified or the document is new (was just created)
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  // in the case of any find - anything that contains find
  this.find({ active: { $ne: false } }); // only find those that are active
});

const User = mongoose.model("User", userSchema);

module.exports = User;
