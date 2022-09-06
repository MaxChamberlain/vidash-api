var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const { connectDB } = require('./config/db');
const { verify } = require('./utils/generateToken');
const scheduleReports = require('./utils/scheduleReports');
connectDB()

var startConnector = require('./utils/getDataFunction');
startConnector();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var companyRouter = require('./routes/company');
var pickDataRouter = require('./routes/pickData');
var packDataRouter = require('./routes/packData');
var packageDataRouter = require('./routes/packageData');
var testEmailRouter = require('./routes/sendTestEmail');

// schedule end of day reports

scheduleReports();

// create app

var app = express();

// setup cors to allow all origins
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//set up cors to allow all origins

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/company', companyRouter);
app.use('/pickdata', verify, pickDataRouter);
app.use('/packdata', verify, packDataRouter);
app.use('/packagedata', verify, packageDataRouter);
app.use('/sendtestemail', testEmailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
