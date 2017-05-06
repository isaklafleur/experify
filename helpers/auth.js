module.exports = {
  setCurrentUser(req, res, next) {
    if (req.session.passport) {
      res.locals.currentUser = req.passport;
      res.locals.isUserLoggedIn = true;
    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },
  checkLoggedIn: (message, route) => (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', message);
    return res.redirect(route);
  },
  // using passportJS to verify if user is logged in
  // and also if it has the correct role to access the page
  checkCredentials: (role, message, route) => (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    req.flash('error', message);
    return res.redirect(route);
  },
};
