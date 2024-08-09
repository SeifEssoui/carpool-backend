const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller");
const isAuth = require("../middleware/auth.middleware");

router.get("/", isAuth, historyController.getAllHistories);
router.get("/:userID", historyController.getHistoryByUser);
router.get('/getByUser/:userID', historyController.getHistoryByUser);
router.post("/", historyController.createHistory);
router.put("/:id", isAuth, historyController.updateHistoryByID);
router.delete("/:id", historyController.deleteHistoryByID);

module.exports = router;
