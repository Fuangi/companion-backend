const express = require("express");
const goalController = require("../controllers/goalController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, goalController.getAllGoals)
  .post(authController.protect, goalController.createGoal);

router
  .route("/:id")
  .get(authController.protect, goalController.getGoal)
  .patch(authController.protect, goalController.updateGoal)
  .delete(authController.protect, goalController.deleteGoal);

module.exports = router;
