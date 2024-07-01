const Message = require("../models/message.model");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// Single Message
exports.createMessage = factory.createOne(Message);

// exports.getAllMessages = factory.getAll(Message);
exports.getAllMessages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    // Model.find({ userId: req.user._id }),
    Message.find({ groupId: req.roomId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;
});

exports.getMessage = factory.getOne(Message);

exports.updateMessage = factory.updateOne(Message);

exports.deleteMessage = factory.deleteOne(Message);

exports.getGrpMessage = factory.getOne(Message, {
  path: "userId",
  select: "name",
});
