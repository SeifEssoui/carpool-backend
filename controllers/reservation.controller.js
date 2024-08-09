const resServices = require("../services/reservation.services");

exports.getAllReservations = async (req, res) => {
  try {
    res.json(await resServices.getAllReservations());
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getReservationByUser = async (req, res) => {
  try {
    const reservation = await resServices.getReservationByUser(
      req.params.userID
    );

    res.json(reservation);
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getReservationByDate = async (req, res) => {
  try {
    const reservations = await resServices.getReservationsByDate(
      req.params.userID,
      req.params.date
    );
    res.json(reservations);
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const newRes = await resServices.createReservation(req.body);
    if (!newRes)
      return res
        .status(500)
        .json({ error: "Could not create new reservation" });
    res.json({ status: "Created", reservation: newRes });
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteReservationByID = async (req, res) => {
  try {
    const deletedRes = await resServices.deleteReservationByID(req.params.id);
    if (!deletedRes)
      return res
        .status(500)
        .json({ error: "No reservation was found with that ID to delete" });
    res.json({ status: "Deleted", reservation: deletedRes });
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.updateReservationByID = async (req, res) => {
  try {
    const updatedRes = await resServices.updateReservationByID(
      req.params.id,
      req.body
    );
    if (!updatedRes)
      return res
        .status(500)
        .json({ error: "No reservation was found with that ID to update" });
    res.json({ status: "Updated", reservation: updatedRes });
  } catch (e) {
    console.log("[RESERVATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
