// =================
// EXPERIENCE ROUTES
// =================

const express = require('express');

const router = express.Router();
const auth = require('../helpers/auth.js');
const Experience = require('../models/experience');
const User = require('../models/user');

// INDEX all experiences
router.get('/', (req, res, next) => {
  Experience.find({}, (err, result) => {
    if (err) {
      next(err);
    }
    res.render('experiences/index', { result });
  });
});

// Display NEW form to create new experience
router.get('/new', auth.checkLoggedIn('You must be login', '/login'), (req, res) => {
  res.render('experiences/new');
});

// Save experience to database
router.post('/', (req, res, next) => {
  const newExperience = {
    name: req.body.name,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    duration: req.body.duration,
    availability: req.body.availability,
    user: req.session.passport.user._id,
    address: req.body.address,
    category: req.body.category,
    location: {
      type: 'Point',
      coordinates: [req.body.long, req.body.lat],
    },
  };

  const exp = new Experience(newExperience);

  exp.save((err) => {
    if (err) {
      return res.render('/new', { errors: exp.errors });
    }
    User.findByIdAndUpdate({ _id: req.session.passport.user._id }, { $push: { experiences: exp._id } }, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash('success', `${newExperience.name} - was successfully added to Experify! It now available to book for other Experifiers! :-)`);
        return res.redirect('/profile');
      }
    });
  });
});

// SHOW one experience
router.get('/:id', (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOne({ _id: idexp })
  .populate('user')
  .exec((err, result) => {
    if (err) {
      next(err);
    } else {
      res.render('experiences/show', { result });
    }
  });
});

// Display EDIT form
router.get('/:id/edit', auth.checkLoggedIn('You must be login', '/login'), (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOne({ _id: idexp }, (err, result) => {
    res.render('experiences/edit', { result });
  });
});

// Update experience to database
router.post('/:id', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res) => {
  const idexp = req.params.id;

  const newExperience = {
    name: req.body.name,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    duration: req.body.duration,
    availability: req.body.availability,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: [req.body.long, req.body.lat],
    },
    category: req.body.category,
  };

  Experience.findOneAndUpdate({ _id: idexp }, newExperience, (err, result) => {
    if (err) {
      return res.render('experiences/edit', { errors: newExperience.errors });
    }
    req.flash('success', `${newExperience.name} - was successfully updated! :-)`);
    return res.redirect(`/experiences/${idexp}`);
  });
});

// DELETE a experience
router.get('/:id/delete', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res) => {
  const idexp = req.params.id;
  Experience.findOneAndRemove({ _id: idexp }, (err, result) => {
    if (err) throw err;
    User.findOneAndUpdate({ _id: req.user }, { $pull: { experiences: idexp } }, (err, result) => {
      if (err) throw err;
      req.flash('success', `${result.name} - was successfully deleted!`);
      res.redirect('/profile');
    });
  });
});

module.exports = router;
