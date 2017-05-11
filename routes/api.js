// =================
// API ROUTES
// =================

const express = require('express');

const router = express.Router();
const Experience = require('../models/experience');

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
