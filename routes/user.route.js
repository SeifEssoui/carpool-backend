const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const isAuth = require("../middleware/auth.middleware");

router.post("/register", isAuth, UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/:email", isAuth, UserController.getUser);
router.put("/:email", isAuth, UserController.updateUser);
router.delete("/:email", isAuth, UserController.deleteUser);

module.exports = router;
