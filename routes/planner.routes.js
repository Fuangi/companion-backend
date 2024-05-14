const express = require("express");
const planController = require("../controllers/planController");

const router = express.Router();

router
  .route("/")
  .get(planController.getAllPlans)
  .post(planController.createPlan);

router
  .route("/:id")
  .get(planController.getPlan)
  .patch(planController.updatePlan)
  .delete(planController.deletePlan);

module.exports = router;
