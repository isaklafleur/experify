const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

const app = express();

// Require the Routes
const index = require('./routes/index');
const profile = require('./routes/profile');
const authentication = require('./routes/auth');
const experiences = require('./routes/experiences');

// Require Helper files
const auth = require('./helpers/auth');
const passport = require('./helpers/passport');

// database connection
require('./configs/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

// Favicon
app.use(favicon(path.join(__dirname, 'public/images', 'rocketicon.png')));

// enable sessions here
app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.setCurrentUser);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*// adding our own middleware so all pages can access currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});*/

// Routes
app.use('/', index);
app.use('/profile', profile);
app.use('/', authentication);
app.use('/experiences', experiences);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
