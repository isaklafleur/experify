// =================
// PROFILE ROUTES
// =================

const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../helpers/auth');

const router = express.Router();

const User = require('../models/user');

/* router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log('req.user', req.user);
  // console.log('req.session', req.session.passport.user._id);
  // console.log(req.session);
  User.findById(req.session.passport.user._id, (err, user) => {
    res.render('profile/show', {
      user,
    });
  });
});*/

router.get('/', auth.checkLoggedIn('You must be login', '/login'), (req, res, next) => {
  console.log('user id: ', req.user._id);
  User
    .findOne({
      _id: req.user._id,
    })
    .populate('experiences')
    .exec((err, user) => {
      if (err) {
        next(err);
      } else {
        // console.log('user: ', user);
        res.render('profile/show', {
          user,
        });
      }
    });
});

router.get('/:id', (req, res) => {
  const idusr = req.params.id;
  User
    .findOne({ _id: idusr })
      .populate('experiences')
      .exec((err, user) => {
        if (err) {
          next(err);
        } else {
          res.render('profile/show', {
            user,
          });
        }
      });
});

// Display Edit form
router.get('/:id/edit', auth.checkLoggedIn('You must be login', '/login'), (req, res) => {
  const idUser = req.params.id;
  User.findOne({
    _id: idUser,
  }, (err, result) => {
    res.render('profile/edit', {
      result,
    });
  });
});

// UPDATE user profile
router.post('/:id', (req, res) => {
  const idexp = req.params.id;
  const password = req.body.password;
  // Bcrypt to encrypt passwords
  const bcryptSalt = 10;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const updateUser = {
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
    pic_path: req.body.pic_path,
    about: req.body.about,
    location: {
      city: req.body.city,
      country: req.body.country,
    },
  };

  User.findOneAndUpdate({
    _id: idexp,
  }, updateUser, (err, result) => {
    if (err) {
      return res.render('profile/edit', {
        user: result,
      });
    }
    return res.redirect('/profile');
  });
});

module.exports = router;
