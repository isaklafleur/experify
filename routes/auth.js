// =================
// AUTH ROUTES
// =================

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();

// User model
const User = require("../models/user");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/signup", { error: "Please indicate a email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (err) {
      next(err);
    } else {
      if (user !== null) {
        res.render("auth/signup", { error: "This email already exists in our database :-(" });
        return;
      }
      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = User({ name, email, password: hashPass });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { error: `Something went wrong: ${err}` });
        } else {
          passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to Experify ${newUser.name} :-)`);
            res.redirect("/profile");
          });
        }
      });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}), (req, res) => {
  req.flash("success", `Welcome back to Experify ${req.user.name} :-)`);
  res.redirect("/profile");
});

router.get("/logout", (req, res) => {
  req.logout();
  // delete currentUser and passport properties
  // becasuse when we calling req.logout() is leaving an empty object inside both properties.
  delete res.locals.currentUser;
  delete req.session.passport;
  req.flash("success", "Sad to see you leaving. Come back soon! :-)");
  res.redirect("/");
});

router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}));

module.exports = router;
