const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    routes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    availablePlaces: {
      type: Number,
      required: true,
    },
    routeDirection: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

scheduleSchema.index(
  { user: 1, scheduledDate: 1, routeDirection :1 },
  { unique: true, background: true }
);

scheduleSchema.plugin(require("mongoose-autopopulate"));
const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
