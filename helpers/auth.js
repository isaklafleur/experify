module.exports = {
  setCurrentUser(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      res.locals.isUserLoggedIn = true;
    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },
  checkLoggedIn: redirectPath => (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    }
    res.redirect(redirectPath);
  },
  // using passportJS to verify if user is logged in
  // and also if it has the correct role to access the page
  checkCredentials: (role, redirectPath) => (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    req.flash('error', 'You do not have access to the page.');
    return res.redirect(redirectPath);
  },
};
