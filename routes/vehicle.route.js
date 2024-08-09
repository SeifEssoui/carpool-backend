const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const isAuth = require("../middleware/auth.middleware");

router.get("/", isAuth, vehicleController.getAllVehicles);
router.get("/:userID", isAuth, vehicleController.getVehicleByUser);
router.post("/", isAuth, vehicleController.createVehicle);
router.put("/:id", isAuth, vehicleController.updateVehicleByID);
router.delete("/:id", isAuth, vehicleController.deleteVehicleByID);

module.exports = router;
