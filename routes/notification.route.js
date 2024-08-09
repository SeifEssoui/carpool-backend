const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth.middleware");
const notificationController = require("../controllers/notification.controller");

router.post("/", isAuth, notificationController.createNotification);
router.get("/getByUser/:userID",  notificationController.getNotificationByUser);
router.get("/", isAuth, notificationController.getAllNotifications);
router.delete("/:id", isAuth, notificationController.deleteNotificationByID);

module.exports = router;
