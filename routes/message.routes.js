const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.get("/:roomId", authController.protect, messageController.getGrpMessage);

router
  .route("/")
  .get(authController.protect, messageController.getAllMessages)
  .post(authController.protect, messageController.createMessage);

router
  .route("/:id")
  .get(authController.protect, messageController.getMessage)
  .patch(authController.protect, messageController.updateMessage)
  .delete(authController.protect, messageController.deleteMessage);

module.exports = router;
