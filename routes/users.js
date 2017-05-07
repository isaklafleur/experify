const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  const idUser = req.params.id;
  User.findOne({ _id: idUser }, (err, result) => {
    res.render('users/show', { result });
  });
});

// Display Edit form
router.get('/:id/edit', (req, res, next) => {
  const idUser = req.params.id;
  User.findOne({ _id: idUser }, (err, result) => {
    res.render('users/edit.ejs', { result });
  });
});

// UPDATE user profile
router.post('/:id', (req, res, next) => {
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
    profileImg: req.body.profileImg,
    about: req.body.about,
  };

  User.findOneAndUpdate({ _id: idexp }, updateUser, (err, result) => {
    if (err) {
      return res.render(`/${idexp}/edit`, { errors: updateUser.errors });
    }
    return res.redirect(`/users/${idexp}`);
  });
});



module.exports = router;
