const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const FbStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");

require("dotenv").config();

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENTSECRET = process.env.FACEBOOK_CLIENTSECRET;
const FACEBOOK_CALLBACKURL = process.env.FACEBOOK_CALLBACKURL;

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  if (mongoose.Types.ObjectId.isValid(user._id)) {
    User.findOne({
      _id: user._id
    }, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  } else {
    const providerIdField = "";
    if (user.provider === "facebook") {
      User.findOne({
        facebookId: user.id
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
  usernameField: "email",
  passwordField: "password"
}, (req, email, password, next) => {
  User.findOne({
    email
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, {
        message: "Incorrect email"
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {
        message: "Incorrect password"
      });
    }

    return next(null, user);
  });
}));

passport.use(new FbStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENTSECRET,
  // callbackURL: FACEBOOK_CALLBACKURL,
  callbackURL: FACEBOOK_CALLBACKURL,
  profileFields: ["id", "displayName", "photos", "email", "gender", "name"]
}, (accessToken, refreshToken, profile, done) => {
  // console.log('profile', JSON.stringify(profile, null, 2));
  User.findOne({
    email: profile.emails[0].value
  }, (err, user) => {
    if (err) {
      console.error(err); // handle errors!
    }
    // console.log('user: ', user);
    if (!err && user !== null) {
      const updateuser = {
        facebookId: profile.id,
        name: profile.displayName,
        avatar: profile.photos[0].value ? profile.photos[0].value : "/images/userProfileIcon.jpg"
      };
      User.findOneAndUpdate({ email: profile.emails[0].value }, updateuser, (err, result) => {
        if (err) {
          throw err;
        }
      });
    } else {
      const newuser = new User({
        facebookId: profile.id,
        name: profile.displayName,
        avatar: profile.photos[0].value ? profile.photos[0].value : "/images/userProfileIcon.jpg",
        email: profile.emails[0].value
      });
      newuser.save((err) => {
        if (err) {
          console.error(err); // handle errors!
        } else {
          done(null, user);
        }
      });
    }
  });
  done(null, profile);
}));

module.exports = passport;
