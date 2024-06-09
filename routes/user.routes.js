const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use(authController.isLoggedIn);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post();

router
  .route("/:id")
  .get(authController.protect, userController.getAllUsers)
  .patch()
  .delete();

module.exports = router;
