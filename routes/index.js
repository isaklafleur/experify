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


// route to show a list of experiences on the search page


router.get('/search/:format?', (req, res, next) => {
  console.log(req.query);
  
function locateUsers(location, resCallback){
  Experience.where('location')
    .near({ center: { coordinates: [location.lng, location.lat], type: 'Point' }, maxDistance: 2000 })
    .find((err, takers) => {
    if (err) {
      return next(err);
    }
    resCallback(takers)
  });
}

    if(req.params.format === "json"){
      //send params through ajax call
      let location = req.query
      locateUsers(location, function(takers){res.json(takers)});
    } else {
        let location = {
          lat: req.param('lat'),
          lng: req.param('long')
        };
        locateUsers(location, function(takers){
          console.log(takers);
          console.log(location);
          res.render('search', {takers:takers, location: location});})
    }
});
module.exports = router;
