const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

// User model
const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Please enter a username and password!',
    });
    return;
  }

  User.findOne({ username },
    'username',
    (err, user) => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists',
        });
        return;
      }
      // Bcrypt to encrypt passwords
      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        name,
        username,
        password: hashPass,
      });

      newUser.save((err) => {
        if (err) {
          res.render('auth/signup', {
            errorMessage: 'Something went wrong',
          });
        } else {
          res.redirect('/login');
        }
      });
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/experiences',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/passport/facebook', passport.authenticate('facebook'));
router.get('/passport/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
}));

module.exports = router;
