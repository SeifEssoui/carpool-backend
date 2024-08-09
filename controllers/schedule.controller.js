const Schedulservices = require("../services/schedule.services");

exports.getAllSchedule = async (req, res) => {
  try {
    res.json(await Schedulservices.getAllSchedule());
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getScheduleByUser = async (req, res) => {
  try {
    const schedule = await Schedulservices.getScheduleByUser(req.params.userID);

    res.json(schedule);
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteScheduleByID = async (req, res) => {
  try {
    const deletedSchedule = await Schedulservices.deleteScheduleByID(
      req.params.id
    );
    
    if (!deletedSchedule)
      return res
        .status(500)
        .json({ error: "No schedule was found with that ID to be deleted" });
    res.json({ status: "Deleted", schedule: deletedSchedule });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getSchedulesWithReservationsByDate = async (req, res) => {
  try {
    const schedules = await Schedulservices.getSchedulesWithReservationsByDate(
      req.params.date,
      req.params.userID
    );
    res.json({ schedule: schedules });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.updateScheduleByID = async (req, res) => {
  try {
    const updatedSchedule = await Schedulservices.updateScheduleByID(
      req.params.id,
      req.body
    );
    if (!updatedSchedule)
      return res
        .status(500)
        .json({ error: "No schedule was found with that ID to be updated" });
    res.json({ status: "Updated", schedule: updatedSchedule });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = await Schedulservices.createSchedule(req.body);
    if (!newSchedule)
      return res.status(500).json({ error: "Could not create a new schedule" });
    res.json({ status: "Created", schedule: newSchedule });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
exports.getNearest = async (req, res) => {
  try {
    const newSchedule = await Schedulservices.findNearestPolyline(req.body);

    res.json({ status: "Created", schedule: newSchedule });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
exports.getSchedulesWithReservations = async (req, res) => {
  try {
    const newSchedule =
      await Schedulservices.getSchedulesWithReservationsByDate(
        req.params.date,
        req.params.userID
      );

    res.json({ status: "Created", schedule: newSchedule });
  } catch (e) {
    console.log("[Schedule]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
