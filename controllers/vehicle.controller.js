const vehServices = require("../services/vehicle.services");

exports.getAllVehicles = async (req, res) => {
  try {
    res.json(await vehServices.getAllVehicles());
  } catch (e) {
    console.log("[VEHICLE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getVehicleByUser = async (req, res) => {
  try {
    const vehicle = await vehServices.getVehicleByUser(req.params.userID);
    if (!vehicle)
      return res
        .status(500)
        .json({ error: "No vehicle was found with that ID" });
    res.json(vehicle);
  } catch (e) {
    console.log("[VEHICLE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteVehicleByID = async (req, res) => {
  try {
    const deletedVehicle = await vehServices.deleteVehicleByID(req.params.id);
    if (!deletedVehicle)
      return res
        .status(500)
        .json({ error: "No vehicle was found with that ID to be deleted" });
    res.json({ status: "Deleted", vehicle: deletedVehicle });
  } catch (e) {
    console.log("[VEHICLE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.updateVehicleByID = async (req, res) => {
  try {
    const updatedVehicle = await vehServices.updateVehicleByID(
      req.params.id,
      req.body
    );
    if (!updatedVehicle)
      return res
        .status(500)
        .json({ error: "No vehicle was found with that ID to be updated" });
    res.json({ status: "Updated", vehicle: updatedVehicle });
  } catch (e) {
    console.log("[VEHICLES]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const newVehicle = await vehServices.createVehicle(req.body);
    if (!newVehicle)
      return res.status(500).json({ error: "Could not create a new vehicle" });
    res.json({ status: "Created", vehicle: newVehicle });
  } catch (e) {
    console.log("[VEHICLES]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
