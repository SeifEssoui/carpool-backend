const historyModel = require("../models/history.model");

exports.getAllHistories = async () => {
  return await historyModel.find();
};

exports.getHistoryByUser = async (userID) => {
  return await historyModel
    .find({ user: userID })
    .populate("user")
    .populate("schedule")
    .populate("reservation");
};

exports.createHistory = async (params) => {
  const newHistory = new historyModel(params);
  return await newHistory.save();
};

exports.updateHistoryByID = async (id, updates) => {
  return await historyModel.findByIdAndUpdate(id, updates);
};

exports.deleteHistoryByID = async (id) => {
  return await historyModel.findByIdAndDelete(id);
};
