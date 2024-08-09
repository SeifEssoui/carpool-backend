const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth.middleware");
const reservationController = require("../controllers/reservation.controller");
const app = require("express")();

router.get("/", reservationController.getAllReservations);
router.get("/:userID", reservationController.getReservationByUser);
router.get(
  "/reservation-by-date/:userID/:date",
  reservationController.getReservationByDate
);
router.post("/add", reservationController.createReservation);
router.put("/:id", isAuth, reservationController.updateReservationByID);
router.delete("/deleteReservationByID/:id", reservationController.deleteReservationByID);

module.exports = router;
