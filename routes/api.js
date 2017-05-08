const express = require('express');

const router = express.Router();
const Experience = require('../models/experience');

router.route('/')
.get((req, res) => {
  Experience.find((error, experiences) => {
    if (error) {
      res.status(500).json({ message: error });
    } else {
      res.status(200).json(experiences);
    }
  });
});

router.route('/search')
.get((req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const maxDistance = req.query.dis;
  Experience.where('location')
  .near({ center: { coordinates: [longitude, latitude], type: 'Point' }, maxDistance })
  .find((error, experiences) => {
    if (error) {
      res.status(500).json({ message: error });
    } else {
      res.status(200).json(experiences);
    }
  });
});

router.route('/:experience_id')
.get((req, res) => {
  Experience.findById(req.params.experience_id, (error, experience) => {
    if (error) {
      res.status(500).json({ message: error });
    } else {
      res.status(200).json(experience);
    }
  });
});

module.exports = router;
