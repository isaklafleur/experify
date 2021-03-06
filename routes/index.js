// =================
// INDEX ROUTES
// =================

const express = require("express");

const router = express.Router();

const Experience = require("../models/experience");

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index");
});

// SEARCH
router.get("/search/:format?", (req, res, next) => {
  if (req.query.long == null || req.query.lat == null) {
    Experience.find({}, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.render("experiences/index", { result });
      }
    });
  } else {
    Experience.where("location")
      .near({ center: { coordinates: [req.query.long, req.query.lat], type: "Point" }, maxDistance: 100000 })
      .find((err, result) => {
        if (err) {
          next(err);
        }
        res.render("experiences/index", { result });
      });
  }
});

module.exports = router;
