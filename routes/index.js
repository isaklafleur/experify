// =================
// INDEX ROUTES
// =================

const express = require('express');

const router = express.Router();

const Experience = require('../models/experience');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// SEARCH
router.get('/search/:format?', (req, res, next) => {
  // console.log(req.query);
  if (req.query.long == null || req.query.long == null) {
    Experience.find({}, (err, result) => {
      res.render('experiences/index', { result });
    });
  } else {
    Experience.where('location')
    .near({ center: { coordinates: [req.query.long, req.query.lat], type: 'Point' }, maxDistance: 20000 })
    .find((err, result) => {
      if (err) {
        return next(err);
      }
      res.render('experiences/index', { result });
    });
  }
});

module.exports = router;
