const notifServices = require("../services/notification.services");

exports.getAllNotifications = async (req, res) => {
  try {
    res.json(await notifServices.getAllNotifications());
  } catch (e) {
    console.log("[NOTIFICATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getNotificationByUser = async (req, res) => {
  try {
    const notification = await notifServices.getNotificationByUser(
      req.params.userID
    );
    
    res.json(notification);
  } catch (e) {
    console.log("[NOTIFICATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const newNotif = await notifServices.createNotification(req.body);
    if (!newNotif)
      return res
        .status(500)
        .json({ error: "Could not create new notification" });
    res.json({ status: "Created", notification: newNotif });
  } catch (e) {
    console.log("[NOTIFICATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteNotificationByID = async (req, res) => {
  try {
    const deletedNotif = await notifServices.deleteNotificationByID(
      req.params.id
    );
    if (!deletedNotif)
      return res.status(500).json({
        error: "No notification with that ID was found to be deleted",
      });
    res.json({ status: "Deleted", notification: deletedNotif });
  } catch (e) {
    console.log("[NOTIFICATION]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
