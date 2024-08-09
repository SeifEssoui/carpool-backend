const express = require("express");
const router = express.Router();
const routeController = require("../controllers/route.controller");
const isAuth = require("../middleware/auth.middleware");

router.post("/", isAuth, routeController.createRoute);
router.get("/", isAuth, routeController.getAllRoutes);
router.get("/nearest", isAuth, routeController.getNearestRoutes);
router.get("/getByUser/:userID", isAuth, routeController.getRouteByUser);
router.put("/:id", isAuth, routeController.updateRouteByID);
router.delete("/:id", isAuth, routeController.deleteRouteByID);

module.exports = router;
