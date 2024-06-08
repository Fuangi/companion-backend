const express = require("express");
const authController = require("../controllers/authController");
const groupController = require("../controllers/groupController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, groupController.getAllGroups)
  .post(authController.protect, groupController.createGroup);

router
  .route("/:id")
  .get(authController.protect, groupController.getGroup)
  .patch(authController.protect, groupController.updateGroup)
  .delete(authController.protect, groupController.deleteGroup);

module.exports = router;

module.exports = router;
