const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FbStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({
  passReqToCallback: true,
}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }

    return next(null, user);
  });
}));

passport.use(new FbStrategy({
  clientID: '1479326355452671',
  clientSecret: '2231e9c27a40d4b6546a65ec27f80eba',
  callbackURL: 'http://localhost:3000/passport/facebook/callback',
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = passport;
