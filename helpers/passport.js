const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const FbStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  if (mongoose.Types.ObjectId.isValid(user._id)) {
    User.findOne({
      _id: user._id,
    }, (err, user) => {
      if (err) {
        return cb(err);
      }

      cb(null, user);
    });
  } else {
    const providerIdField = '';
    if (user.provider === 'facebook') {
      User.findOne({
        facebookId: user.id,
      }, (err, dbUser) => {
        if (err) {
          return cb(err);
        }
        cb(null, dbUser);
      });
    }
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
  profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name', 'about', 'hometown'],
}, (accessToken, refreshToken, profile, done) => {
  console.log('profile', JSON.stringify(profile, null, 2));
  User.findOne({
    email: profile.emails[0].value,
  }, (err, user) => {
    if (err) {
      console.log(err); // handle errors!
    }
    console.log('user: ', user);
    if (!err && user !== null) {
      console.log("hello!");
      const updateuser = {
        facebookId: profile.id,
        name: profile.displayName,
        pic_path: profile.photos[0].value ? profile.photos[0].value : '/images/userProfileIcon.jpg',
      };
      User.findOneAndUpdate({ email: profile.emails[0].value }, updateuser, (err, result) => {
        // console.log("result ", result);
      });
      // done(null, user);
    } else {
      console.log('profile', JSON.stringify(profile, null, 2));
      const newuser = new User({
        facebookId: profile.id,
        name: profile.displayName,
        pic_path: profile.photos[0].value ? profile.photos[0].value : '/images/userProfileIcon.jpg',
        email: profile.emails[0].value,
      });
      // console.log('user', user);
      newuser.save((err) => {
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
