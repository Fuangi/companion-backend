const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

// Routes handlers
const userRouter = require("./routes/user.routes");
const groupRouter = require("./routes/group.routes");
const plannerRouter = require("./routes/planner.routes");
const goalRouter = require("./routes/goal.routes");
const notifRouter = require("./routes/notification.routes");
const messageRouter = require("./routes/message.routes");
const timetableRouter = require("./routes/timetable.routes");

// Utilities
const AppError = require("./utils/appError");

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://student-companion-theta.vercel.app",
    // origin: "https://student-companion-theta.vercel.app",
    // method: ["POST",  "PATCH",  "GET", "DELETE"],
    methods: ["POST", "PATCH", "GET", "DELETE"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/plans", plannerRouter);
app.use("/api/v1/goals", goalRouter);
app.use("/api/v1/notifications", notifRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/timetable", timetableRouter);

// Handline unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Companion API",
  });
});

module.exports = app;
