const vehModel = require("../models/vehicle.model");

exports.getAllVehicles = async () => {
  return vehModel.find();
};

exports.getVehicleByUser = async (userID) => {
  if (!userID || userID.length != 24) throw Error("Invalid Id was sent");
  return await vehModel.findOne({ userId: userID });
};

exports.createVehicle = async (params) => {
  if (
    !params.userId ||
    !params.model ||
    !params.brand ||
    !params.type ||
    !params.fuelType ||
    !params.maxNbPlaces
  )
    throw Error("Request was sent with missing paramms");
  const newVeh = new vehModel(params);
  return await newVeh.save();
};

exports.updateVehicleByID = async (id, updates) => {
  if (!id || id.length != 24 || !updates)
    Error("Request was sent with missing params");
  return await vehModel.findByIdAndUpdate(id, updates);
};

exports.deleteVehicleByID = async (id) => {
  if (!id || id.length != 24) Error("Request was sent with missing params");
  return await vehModel.findByIdAndDelete(id);
};
