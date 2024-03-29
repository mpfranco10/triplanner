require("dotenv").config()

global.mongoUrl = process.env.MONGODB_CONNECTION_STRING;
// mongodb://localhost:27017/tripsDB

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
var greetingsRouter = require('./routes/greetings');

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//app.use('/', indexRouter);
app.use('/api/v1/countries', usersRouter);
app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/places', placesRouter);
app.use('/api/v1/hotels', hotelsRouter);
app.use('/api/v1/matrix', matrixRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/shoppingLists', shoppingListsRouter);
app.use('/api/v1/budgets', budgetsRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/userTrips', userTripsRouter);
app.use('/api/v1/widgets', widgetsRouter);
app.use('/api/v1/greetings', greetingsRouter);

if (process.env.NODE_ENV === 'production') {
  // Step 1:
  app.use(express.static(path.resolve(__dirname, "./trip-planner/build")));
  // Step 2:
  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./trip-planner/build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


module.exports = app;
