const express = require("express");
const planController = require("../controllers/planController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, planController.getAllPlans)
  .post(authController.protect, planController.createPlan);

router
  .route("/:id")
  .get(authController.protect, planController.getPlan)
  .patch(authController.protect, planController.updatePlan)
  .delete(authController.protect, planController.deletePlan);

module.exports = router;
