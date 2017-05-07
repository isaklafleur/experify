const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const FbStrategy = require('passport-facebook').Strategy;

// Require the Mongoose Model
const User = require('../models/user');

// require('dotenv').config();
// const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
// const FACEBOOK_CLIENTSECRET = process.env.FACEBOOK_CLIENTSECRET;

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((id, cb) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findOne({
      _id: id,
    }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  } else {
    cb(null, id);
  }
});


passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: 'password',
}, (req, email, password, next) => {
  User.findOne({
    email,
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, {
        message: 'Incorrect email',
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {
        message: 'Incorrect password',
      });
    }
    return next(null, user);
  });
}));

passport.use(new FbStrategy({
  clientID: '1479326355452671',
  clientSecret: '2231e9c27a40d4b6546a65ec27f80eba',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email'],
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({
    facebookId: profile.id,
  }, (err, user) => {
    if (err) {
      console.log(err); // handle errors!
    }
    if (!err && user !== null) {
      done(null, user);
    } else {
      console.log(profile);
      user = new User({
        facebookId: profile.id,
        name: profile.displayName,
        profileImg: profile.photos[0].value,
      });
      user.save((err) => {
        if (err) {
          console.log(err); // handle errors!
        } else {
          done(null, user);
        }
      });
    }
  });
  done(null, profile);
}));

module.exports = passport;
