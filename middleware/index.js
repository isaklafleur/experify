// ====================
// MIDDLEWARE
// ====================
const Experience = require('../models/experience');

const middlewareObj = {};

middlewareObj.checkExperienceOwnership = (req, res, next) => {
  // is logged in?
  if (req.isAuthenticated()) {
    Experience.findById(req.params.id, (err, foundExperience) => {
      if (err) {
        req.flash('error', 'Experience not found');
        res.redirect('back');
      } else if (foundExperience.user.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.send('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is logged in?
  if (req.isAuthenticated()) {
    Review.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.send('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};

module.exports = middlewareObj;
