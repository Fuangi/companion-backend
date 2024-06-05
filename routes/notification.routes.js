const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.post("/", notificationController.createNotification);

router.patch("/:id", notificationController.updateNotification);

module.exports = router;
