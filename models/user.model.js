const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Creating the user schema with name, email, tel, address, password and passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
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
  address: {
    type: String,
    required: [true, "Please provide your address"],
  },
  problem: {
    type: String,
    enum: ["life", "time", "distraction", "health", "motivation", "other"],
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

userSchema.pre("save", async function (next) {
  // run this only if the password was modified
  if (!this.isModified("password")) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

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
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // converting the time the user changed their password to a timestamp in seconds (/1000) and converting it to an int in base 10
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // false here means not vhanged
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
