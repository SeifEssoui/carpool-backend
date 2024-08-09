const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const isAuth = require("../middleware/auth.middleware");

router.get("/", scheduleController.getAllSchedule);
router.get("/:userID", isAuth, scheduleController.getScheduleByUser);
router.post("/getNearest", isAuth, scheduleController.getNearest);
router.post("/add", isAuth, scheduleController.createSchedule);
router.put("/:id", isAuth, scheduleController.updateScheduleByID);

router.delete("/deleteScheduleByID/:id",  scheduleController.deleteScheduleByID);
router.get(
  "/schedules-with-date/:date/:userID",
  isAuth,
  scheduleController.getSchedulesWithReservations
);

module.exports = router;
