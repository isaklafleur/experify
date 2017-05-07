const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/search/', (req, res, next) => {
  res.render('search');
});

router.post('/search/', (req, res, next) => {
  res.render('search');
});


module.exports = router;
