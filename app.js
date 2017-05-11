const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('morgan');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

// database connection
require('./configs/database');

// Socket.io
const io = socketIO();
app.io = io;

// Socket.io Events
const users = {};

io.on('connection', (socket) => {
  function updateNicknames() {
    io.emit('username', Object.keys(users));
  }
  socket.on('new user', (data, callback) => {
    if (data in users) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNicknames();
    }
  });
  socket.on('send message', (data, callback) => {
    let msg = data.trim();
    if (msg.substr(0, 3) === '/w ') {
      msg = msg.substr(3);
      const index = msg.indexOf(' ');
      if (index !== -1) {
        const name = msg.substr(0, index);
        msg = msg.substr(index + 1);
        if (name in users) {
          users[name].emit('whisper', { msg, nick: socket.nickname });
        } else {
          callback('Error: enter a valid user');
        }
      } else {
        callback('Error: Please enter a message for your whipser.');
      }
    } else {
      io.emit('new message', { msg, nick: socket.nickname });
    }
  });
  socket.on('disconnect', (data) => {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});

// Require the Routes
const indexRoutes = require('./routes/index');
const profileRoutes = require('./routes/profile');
const authenticationRoutes = require('./routes/auth');
const experienceRoutes = require('./routes/experiences');
const apiRoutes = require('./routes/api');
const ChatRoutes = require('./routes/chat');

// Require Helper files
const auth = require('./helpers/auth');
const passport = require('./helpers/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adding our own middleware so all pages can access currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/profile', profileRoutes);
app.use('/', authenticationRoutes);
app.use('/experiences', experienceRoutes);
app.use('/conversation/', ChatRoutes);
app.use('/api', apiRoutes);

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
