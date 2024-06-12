const Group = require("../models/groupModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.createGroup = factory.createOne(Group);

// exports.getAllGroups = factory.getAll(Group);
exports.getAllGroups = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(
    // Model.find({ userId: req.user._id }),
    Group.find(),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;
  // const docs = await features.query.explain();
  // docs.sort().select().skip().limit();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.getGroup = factory.getOne(Group, { path: "members", select: "name" });

exports.updateGroup = factory.updateOne(Group);

exports.deleteGroup = factory.deleteOne(Group);
