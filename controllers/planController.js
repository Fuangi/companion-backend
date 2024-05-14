const catchAsync = require("../utils/catchAsync");
const Planner = require("../models/planner.model");
const factory = require("./handlerFactory");

exports.createPlan = factory.createOne(Planner);

exports.getAllPlans = factory.getAll(Planner);

exports.getPlan = factory.getOne(Planner);

exports.updatePlan = factory.updateOne(Planner);

exports.deletePlan = factory.deleteOne(Planner);
