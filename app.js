var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// required mongoo here for mongodb compass
const mongoose = require('mongoose');

// required for express passport session 
var expressSession= require('express-session');
const passport= require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// i added for mongo connection 
const mongoURI = 'mongodb://localhost:27017/pustakalay';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// used for user autentication 
/*Express Session stores session data (like user login state) across requests,
 while Passport uses this session to maintain user authentication. 
 Passport serializes the user into the session and deserializes it on subsequent requests
 to authenticate the user, enabling persistent login without re-authenticating on every request.*/
app.use(expressSession({
  resave:false,
  saveUninitialized: false,
  secret: "meow meow"
}))
app.use(passport.initialize());
app.use(passport.session());


// Define serializeUser and deserializeUser within your app.js
passport.serializeUser(function(user, done) {
  done(null, user.id); // Save the user's ID in the session
});

passport.deserializeUser(function(id, done) {
  // Replace with the actual logic to retrieve the user by ID from your database
  User.findById(id, function(err, user) {
    done(err, user); // Retrieve the user from DB
  });
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
