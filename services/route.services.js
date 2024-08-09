const routeModel = require("../models/route.model");
async function createRoute(params) {
  if (
    !params.user ||
    !params.startPoint ||
    !params.endPoint ||
    !params.startTime ||
    !params.daysOfWeek ||
    !params.duration ||
    !params.distance ||
    !params.type ||
    !params.polyline
  )
    throw Error("Request sent with missing params");
  const newRoute = new routeModel(params);
  return await newRoute.save();
}

async function getAllRoutes() {
  return await routeModel.find().populate("user");
}

async function getRouteByUser(userID) {
  if (!userID || userID.length != 24) throw Error("Invalid ID was sent");
  return await routeModel.find({ user: userID });
}

async function updateRouteByID(id, updates) {
  if (!id || !updates) throw Error("Request was sent with missing params");
  return await routeModel.findByIdAndUpdate(id, updates);
}

async function deleteRouteByID(id) {
  if (!id || id.length != 24) throw Error("Invalid ID was sent");
  return await routeModel.findByIdAndDelete(id);
}

async function getNearestRoutes(body) {
  try {
    const { userId, latitude, longitude, date } = body;

    const nearestDriverRoute = await Route.findOne({
      startPoint: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          // $maxDistance: 10000,
          $minDistance: 1000, //en metres
        },
      },
      user: userId,
    }).populate("user");

    if (!nearestDriverRoute) {
      throw Error("No nearest driver route found");
    }

    return nearestDriverRoute;
  } catch (error) {
    throw Error("getNearestRoutes error", error);
  }
}

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteByUser,
  updateRouteByID,
  deleteRouteByID,
  getNearestRoutes,
};
