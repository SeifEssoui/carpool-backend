const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    pickupTime: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    date: {
      type: Date,
      required: true,
    },
    routeDirection: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reservationSchema.index(
  { user: 1, date: 1, routeDirection: 1 },
  { unique: true, background: true }
);

reservationSchema.plugin(require("mongoose-autopopulate"));
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
