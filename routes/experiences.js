const express = require('express');

const router = express.Router();

const auth = require('../helpers/auth.js');

const Experience = require('../models/experience');

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
router.get('/new', (req, res, next) => {
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
    user: req.user._id,
    location: {
      city: req.body.city,
      street: req.body.street,
    },
    categories: req.body.categories,
  };

  const exp = new Experience(newExperience);

  exp.save((err) => {
    if (err) {
      return res.render(res.render('/new', { errors: exp.errors }));
    }
    return res.redirect('/experiences');
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

/*
app.get('/random', (req, res, next) => {

  client.getRandomJoke()
    .then((response) => {
      console.log(response);
      res.render('joke-by-category', {joke: response});
    }).catch((err) => {
      // handle error
    });
});

app.get('/categories', (req, res, next) => {
  if (req.query.cat === undefined){
    client.getJokeCategories()
    .then((response)=>  {
      res.render('categories', {categories: response})
    })
    .catch((err)=> {
      // handle error
    });

  } else {
    client.getRandomJoke(req.query.cat)
    .then((response) => {
      console.log(response);
      res.render('joke-by-category', {joke: response})
    }).catch((err) => {
      // handle error
    });
  }
});


app.get('/search', (req, res, next) => {
  res.render('search');
});


app.post('/search', (req, res, next)=> {

  client.search(req.body.name)

  .then(function (response) {
      console.log(response);
    res.render('foundjokes', {jokes: response.items});
  }).catch(function (err) {
    // handle error
  });
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
*/

module.exports = router;
