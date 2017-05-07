const express = require('express');
const ensureLogin = require('connect-ensure-login');

const router = express.Router();
const auth = require('../helpers/auth.js');

const Experience = require('../models/experience');

// INDEX all experiences
router.get('/', (req, res, next) => {
  Experience.find({}, (err, result) => {
    if (err) {
      next(err);
    }
    console.log(result);
    res.render('experiences/index', { result });
  });
});

// Display NEW form to create new experience
router.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('experiences/new');
});

// Save experience to database
router.post('/', (req, res) => {
  const newExperience = {
    name: req.body.name,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    duration: req.body.duration,
    availability: req.body.availability,
    user: req.session.passport.user._id,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: [req.body.long, req.body.lat],
    },
    category: req.body.category,
  };

  const exp = new Experience(newExperience);

  exp.save((err) => {
    if (err) {
      return res.render('/new', { errors: exp.errors });
    }
    return res.redirect('/profile');
  });
});

// SHOW one experience
router.get('/:id', (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOne({ _id: idexp }, (err, result) => {
    res.render('experiences/show', { result });
  });
});

// Display EDIT form
router.get('/:id/edit', (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOne({ _id: idexp }, (err, result) => {
    res.render('experiences/edit', { result });
  });
});

// Update experience to database
router.post('/:id', (req, res, next) => {
  const idexp = req.params.id;

  const newExperience = {
    name: req.body.name,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    duration: req.body.duration,
    availability: req.body.availability,
    user: req.user._id,
    location: {
      city: req.body.city,
      street: req.body.street,
    },
    categories: req.body.categories,
  };

  Experience.findOneAndUpdate({ _id: idexp }, newExperience, (err, result) => {
    if (err) {
      return res.render(`/${idexp}/edit`, { errors: newExperience.errors });
    }
    return res.redirect(`/experiences/${idexp}`);
  });
});

// DELETE a experience
router.get('/:id/delete', (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOneAndRemove({ _id: idexp }, (err, result) => {
    res.redirect('/experiences');
  });
});

module.exports = router;
