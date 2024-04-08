const express = require("express");
const morgan = require("morgan");
const path = require("path");

// Routes handlers
const userRouter = require("./routes/user.routes");
const resourceRouter = require("./routes/resource.routes");
const forumRouter = require("./routes/forum.routes");
const plannerRouter = require("./routes/planner.routes");

// Utilities
const AppError = require("./utils/appError");

const app = express();

// MIDDLEWARES
app.use(express.json());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/forums", forumRouter);
app.use("/api/v1/plans", plannerRouter);
app.use("/api/v1/resources", resourceRouter);

// Handline unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
