const UserModel = require("../models/user.model");
const userService = require("../services/user.services");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.getUser = async (email) => {
  return await UserModel.findOne({ email });
};
// User login
exports.loginUser = async (params) => {
  if (!params.email || !params.password) {
    throw Error("The request is missing the email or the password");
  }
  const user = await UserModel.findOne({ email: params.email });
  if (!user) {
    throw Error("No account was found with this email");
  }
  const isMatch = await bcrypt.compare(params.password, user.password);
  if (!isMatch) {
    throw Error("Invalid password or email");
  }
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );
  const refresh_token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken: token, refreshToken: refresh_token };
};

// User register
exports.registerUser = async (params) => {
  if (
    !params.firstName ||
    !params.lastName ||
    !params.email ||
    !params.phoneNumber ||
    !params.password
  )
    throw Error("The request is missing one or more fields");

  const userAlreadyExists = await UserModel.findOne({ email: params.email });

  if (userAlreadyExists) throw Error("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(params.password, salt);

  const newUser = new UserModel({
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    phoneNumer: params.phoneNumber,
    password: hashedPassword,
  });
  return await newUser.save();
};

// Updating existing user
exports.updateUser = async (email, updates) => {
  if (!email || !updates) throw Error("Missing parameters");
  return await UserModel.findOneAndUpdate({ email }, updates);
};

// Deleting existing user
exports.deleteUser = async (email) => {
  if (!email) throw Error("Invalid email entered");
  return await UserModel.findOneAndDelete({ email });
};

// Get user
exports.getUser = async (email) => {
  return await UserModel.findOne({ email });
};
