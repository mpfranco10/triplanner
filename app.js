var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripsRouter = require("./routes/trips");
var placesRouter = require("./routes/places");
var hotelsRouter = require("./routes/hotels");
var matrixRouter = require('./routes/distanceMatrix');
var eventsRouter = require('./routes/events');
var shoppingListsRouter = require('./routes/shoppingLists');
var budgetsRouter = require('./routes/budgets');
var notesRouter = require('./routes/notes');
var userTripsRouter = require('./routes/userTrips');
var widgetsRouter = require('./routes/widget');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });


app.use('/', indexRouter);
app.use('/countries', usersRouter);
app.use('/trips', tripsRouter);
app.use('/places', placesRouter);
app.use('/hotels', hotelsRouter);
app.use('/matrix', matrixRouter);
app.use('/events', eventsRouter);
app.use('/shoppingLists', shoppingListsRouter);
app.use('/budgets', budgetsRouter);
app.use('/notes', notesRouter);
app.use('/userTrips', userTripsRouter);
app.use('/widgets', widgetsRouter);

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

app.listen(5000);

module.exports = app;
