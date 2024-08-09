const routeService = require("../services/route.services");

exports.getAllRoutes = async (req, res) => {
  try {
    return res.json(await routeService.getAllRoutes());
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
exports.getNearestRoutes = async (req, res) => {
  try {
    return res.json(await routeService.getNearestRoutes(req.params.body));
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e);
    res.status(500).json({ error: e.message });
  }
};

exports.getRouteByUser = async (req, res) => {
  try {
    const route = await routeService.getRouteByUser(req.params.userID);
    console.log("route", route);
    if (!route)
      return res.status(500).json({ error: "No route was found with that ID" });
    res.json(route);
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const newRoute = await routeService.createRoute(req.body);
    if (!newRoute)
      return res.status(500).json({ error: "Could not create new route" });
    res.json({ status: "Created", route: newRoute });
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.updateRouteByID = async (req, res) => {
  try {
    const updatedRoute = await routeService.updateRouteByID(
      req.params.id,
      req.body
    );
    if (!updatedRoute)
      return res.status(500).json({ error: "No route was found with that ID" });
    res.json({ status: "Updated", route: updatedRoute });
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};

exports.deleteRouteByID = async (req, res) => {
  try {
    const deletedRoute = await routeService.deleteRouteByID(req.params.id);
    if (!deletedRoute)
      return res.status(500).json({ error: "No route was found with that ID" });
    res.json({ status: "Deleted", route: deletedRoute });
  } catch (e) {
    console.log("[ROUTE]: %s \n %s", e, e.stack);
    res.status(500).json({ error: e.message });
  }
};
