var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var usersDB = require('./db/users')

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.auth = {
    isAuthenticated: false,
    user: {}
  }
  usersDB.getUserById(1).then(user => {
    req.auth.isAuthenticated = true
    req.auth.user = user
    next()
  })
})

app.use('/api/v1/houses', require('./routes/houses'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roommates', require('./routes/roommates'));
app.use('/api/v1/bills', require('./routes/bills'));
app.use('/api/v1/payments', require('./routes/payments'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
