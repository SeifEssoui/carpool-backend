require("dotenv").config();
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var path = require("path");

const express = require("express");
const session = require("express-session");

const shell = require("shelljs");
const nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");



const routeRouter = require("./routes/route.route");
const scheduleRouter = require("./routes/schedule.route");
const historyRouter = require("./routes/history.route");
const notificationRouter = require("./routes/notification.route");
const reservationRouter = require("./routes/reservation.route");


const vehicleRouter = require("./routes/vehicle.route");
const userRouter = require("./routes/user.route");

var app = express();
app.use(logger("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/history", historyRouter);
app.use("/api/routes", routeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/vehicles", vehicleRouter);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
var options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  // setHeaders: function (res, path, stat) {
  //   res.set("x-timestamp", Date.now());
  // },
};
// app.use(express.static(path.join(__dirname, "public"), options));
app.use(
  express.static(path.join(__dirname, "public"), { extensions: ["htm"] })
);
function skipLog(req, res) {
  var url = req.url;
  console.log("req.url", req.url);
  if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"));
  if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/gi)) {
    return true;
  }
  return false;
}
const corsOptions = {
  // origin: [
  //   "https://3sg.work-point.tech",
  //   "https://backend.3sg.work-point.tech",
  // ],
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    //  [
    //   "https://3sg.work-point.tech",
    //   "https://backend.3sg.work-point.tech",
    // ]
    "Access-Control-Allow-Headers",
    "Content-Type: application/json"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type: application/json"
  // );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(function (req, res, next) {
  // next(createError(404));
  // var result = skipLog(req, res);
  // console.log("result", result);
  // if (!result) {
  //   res.status(500).send("You can't pass this file!");
  // }

  res.status(404).send("Sorry can't find that!");
  res.status(500).send("Sorry can't find that!");
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 5030;

mongoose
  .connect(process.env.DB_KEY)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
  module.exports = app;