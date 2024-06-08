const Group = require("../models/groupModel");
const factory = require("./handlerFactory");

exports.createGroup = factory.createOne(Group);

exports.getAllGroups = factory.getAll(Group);

exports.getGroup = factory.getOne(Group, { path: "members", select: "name" });

exports.updateGroup = factory.updateOne(Group);

exports.deleteGroup = factory.deleteOne(Group);
