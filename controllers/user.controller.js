const userService = require("../services/user.services");

exports.getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userService.getUser(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("[USER] : %s\n%s", error, error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    if (!newUser)
      return res.status(500).json({ error: "Could not create new user" });
    return res.json({ status: "Created", user: newUser });
  } catch (error) {
    console.log("[USER]: %s\n%s", error, error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    res.json(await userService.loginUser(req.body));
  } catch (error) {
    console.log("[USER]: %s\n%s", error, error.stack);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedMember = await userService.updateUser(
      req.params.email,
      req.body
    );
    if (!updatedMember)
      return res
        .status(404)
        .json({ error: "No user was found with that email" });
    return res.json({ status: "Updated", user: updatedUser });
  } catch (error) {
    console.log("[USER]: %s\n%s", error, error.stack);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.body);
    if (!deletedUser)
      return res
        .status(404)
        .json({ error: "No user was found with that email" });
    return res.json({ status: "Deleted", user: deletedUser });
  } catch (error) {
    console.log("[USER]: %s\n%s", error, error.stack);
    res.status(400).json({ error: error.message });
  }
};
