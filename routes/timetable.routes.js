const express = require("express");
const {
  createTimetable,
  getAllTimetables,
  getTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

const router = express.Router();

// router.route('/').get(getAllStaff).post(uploadStaffPic, createStaff);
router.route("/").get(getAllTimetables).post(createTimetable);

router
  .route("/:id")
  .get(getTimetable)
  .patch(updateTimetable)
  .delete(deleteTimetable);

module.exports = router;
