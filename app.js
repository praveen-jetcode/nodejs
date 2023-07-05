var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var rateLimit = require("express-rate-limit");
var mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean');
var helmet = require('helmet');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var driversRouter = require("./routes/Drivers");
var busRouter = require("./routes/Bus");
const AppError = require("./utils/AppError");
const GlobalErrorHandling = require("./controller/ErrorController");
const review = require("./routes/Reviews");
var app = express();
require("./lib/DataBase");
app.use(helmet());
// app.use(mongoSanitize());
// app.use(xss());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// const limiter = rateLimit({
//   max: 3,
//   windowMs: 15000,
//   message: "something is wrong! try again  later ",
// });

// app.use("/users/signin",limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// route
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/drivers", driversRouter);
app.use("/bus" , busRouter);
app.use("/reviews",review);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`));
});
// error handler
app.use(GlobalErrorHandling);
module.exports = app;
