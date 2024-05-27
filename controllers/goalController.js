const Goal = require("../models/goals.models");
const factory = require("./handlerFactory");

exports.createGoal = factory.createOne(Goal);

exports.getAllGoals = factory.getAll(Goal);

exports.getGoal = factory.getOne(Goal);

exports.updateGoal = factory.updateOne(Goal);

exports.deleteGoal = factory.deleteOne(Goal);
