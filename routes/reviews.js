// =================
// REVIEW ROUTES
// =================

const express = require('express');

const router = express.Router({ mergeParams: true });
const Experience = require('../models/experience');
const Review = require('../models/review');
// const middleware = require('../middleware');


// REVIEW NEW
router.get('/new', /* middleware.isLoggedIn, */ (req, res) => {
  // find campground by id
  // console.log(req.params.id);
  Experience.findById(req.params.id, (err, experience) => {
    if (err) {
      console.log(err);
    } else {
      res.render('reviews/new', {
        experience,
      });
    }
  });
});

// REVIEW CREATE
router.post('/', /* middleware.isLoggedIn,*/ (req, res) => {
  // lookup campground using id
  Experience.findById(req.params.id, (err, experience) => {
    if (err) {
      console.log(err);
      res.redirect('/experiences');
    } else {
      Review.create(req.body.comment, (err, review) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          // add user and id to comment
          review.author.id = req.user._id;
          review.author.username = req.user.username;

          // save comment
          review.save();
          experience.reviews.push(review);
          experience.save();
          req.flash('success', 'Successfully added comment');
          res.redirect(`/experiences/${experience._id}`);
        }
      });
    }
  });
});

// REVIEW EDIT
router.get('/:review_id/edit', /* middleware.checkCommentOwnership,*/ (req, res) => {
  Review.findById(req.params.review_id, (err, foundReview) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('reviews/edit', {
        experience_id: req.params.id,
        review: foundReview,
      });
    }
  });
});

// REVIEW UPDATE
router.put('/:review_id', /* middleware.checkCommentOwnership,*/ (req, res) => {
  Review.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/experiences/${req.params.id}`);
    }
  });
});

// REVIEW DELETE
router.delete('/:review_id', /* middleware.checkCommentOwnership, */ (req, res) => {
  // res.send("This is the destroy comments route!");
  Review.findByIdAndRemove(req.params.review_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Review deleted');
      res.redirect(`/experiences/${req.params.id}`);
    }
  });
});

module.exports = router;
