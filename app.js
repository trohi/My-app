var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library';
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var Article = require('./models/article');
var controller = require('./models/controller')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var PORT = process.env.PORT || 3001

mongoose.connect(CONNECTION_URI, {useNewUrlParser: true})
require('./config/passport');

mongoose.set("useFindAndModify", false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: 'mysecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  next()
});

app.use(function(req, res, next){
  res.locals.user = req.user;
  next()
})

app.use(function(req, res, next){
  res.locals.date = new Date();
  next()
})



app.use('/user', usersRouter);
app.use('/', indexRouter);

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

app.listen(PORT,()=>{
  console.log(`Server is listening on port ${PORT}`)
})

module.exports = app;
