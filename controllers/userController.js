const User = require("../models/user.model");
const factory = require("./handlerFactory");

// exports.createPlan = factory.createOne(Planner);

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
