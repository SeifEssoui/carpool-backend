const historyService = require("../services/history.services");

exports.createHistory = async (req, res) => {
  try {
    const newHistory = await historyService.createHistory(req.body);
    if (!newHistory)
      return res.status(500).json({ error: "Could not create history" });
    res.json({ status: "Created", history: newHistory });
  } catch (e) {
    console.log("[HISTORY]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getAllHistories = async (req, res) => {
  try {
    const histories = await historyService.getAllHistories();
    res.json(histories);
  } catch (e) {
    console.log("[HISTORY]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.getHistoryByUser = async (req, res) => {
  try {
    const history = await historyService.getHistoryByUser(req.params.userID);
    if (!history)
      return res
        .status(404)
        .json({ message: "No history was found with that ID" });
    res.json(history);
  } catch (e) {
    console.log("[HISTORY]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.updateHistoryByID = async (req, res) => {
  try {
    const updatedHistory = await historyService.updateHistoryByID(
      req.params.id,
      req.body
    );
    if (!updatedHistory)
      return res
        .status(500)
        .json({ error: "History was not found to be updated" });
    res.json({ status: "Updated", history: updatedHistory });
  } catch (e) {
    console.log("[HISTORY]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteHistoryByID = async (req, res) => {
  try {
    const deletedHistory = await historyService.deleteHistoryByID(
      req.params.id
    );
    if (!deletedHistory)
      return res
        .status(500)
        .json({ error: "History was not found to be deleted" });
    res.json({ status: "Deleted", history: deletedHistory });
  } catch (e) {
    console.log("[HISTORY]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
