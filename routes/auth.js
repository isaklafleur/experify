const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

// User model
const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { message: req.flash('error') });
});

router.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    req.flash('error', 'Please indicate a username and password');
    res.render('auth/signup', { message: req.flash('error') });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      req.flash('error', 'The username already exists');
      res.render('auth/signup', { message: req.flash('error') });
      return;
    }
    const bcryptSalt = 10;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({ name, username, password: hashPass });

    newUser.save((err) => {
      if (err) {
        req.flash('error', 'The username already exists');
        res.render('auth/signup', { message: req.flash('error') });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/experiences');
        });
      }
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/experiences',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  // delete currentUser and passport properties
  // becasuse when we calling req.logout() is leaving an empty object inside both properties.
  delete res.locals.currentUser;
  delete req.session.passport;
  res.redirect('/');
});

router.get('/passport/facebook', passport.authenticate('facebook'));
router.get('/passport/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/experiences',
  failureRedirect: '/login',
}));

module.exports = router;
