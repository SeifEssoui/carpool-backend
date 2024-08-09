const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authMiddleware = async (req, res, next) => {
  try {
    // test token
    const token = req.headers["authorization"];
    console.log(token);
    // if the token is undefined =>
    if (!token) {
      return res.status(400).send({ errors: [{ msg: "Unauthorized1" }] });
    }
    // get the id from the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // search the user
    const user = await User.findById(decoded.id).select("-password");

    // send not authorisation IF NOT USER
    if (!user) {
      return res.status(400).send({ errors: [{ msg: "Unauthorized2" }] });
    }

    // if user exist
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: [{ msg: "Unauthorized123" }] });
  }
};

module.exports = authMiddleware;
