var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session  = require("express-session");
var home = require('./routes/home');
var signIn = require('./routes/signIn');
var account = require('./routes/account');
var app = express();


app.use(session({

  cookieName: 'session',
  secret: 'twitter',
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: true
}

));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/signIn', signIn.login);
app.post('/checklogin', signIn.checklogin);
app.post('/register', signIn.registerUser);
app.get('/logout', signIn.logout);



app.get('/accountManagement', account.showAccount);
app.get('/mySellItems', account.mySellItems);
app.post('/getAccountDetails', account.getAccountDetails);
app.post('/changeAccountDetails', account.changeAccountDetails);
app.get('/sellItemPage', account.getSellItemPage);

app.get('/', home.homepage);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
