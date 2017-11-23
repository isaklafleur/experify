// =================
// PROFILE ROUTES
// =================

const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../helpers/auth");
const multer = require("multer");

// upload image
const upload = multer({
  dest: "./public/uploads/",
  fileSize: 4000000,
  files: 1
});

const router = express.Router();

const User = require("../models/user");

// Display SHOW page
router.get("/", auth.checkLoggedIn("You must be login", "/login"), (req, res, next) => {
  User
    .findOne({
      _id: req.user._id
    })
    .populate("experiences")
    .exec((err, user) => {
      if (err) {
        next(err);
      } else {
        res.render("profile/show", {
          user
        });
      }
    });
});

router.get("/:id", (req, res, next) => {
  const idusr = req.params.id;
  User
    .findOne({ _id: idusr })
    .populate("experiences")
    .exec((err, user) => {
      if (err) {
        next(err);
      } else {
        res.render("profile/show", {
          user
        });
      }
    });
});

// Display Edit form
router.get("/:id/edit", auth.checkLoggedIn("You must be login", "/login"), (req, res, next) => {
  const idUser = req.params.id;
  User.findOne({
    _id: idUser
  }, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("profile/edit", {
      result
    });
  });
});

// UPDATE user profile
router.post("/:id", upload.single("avatar"), auth.checkLoggedIn("You must be login", "/login"), (req, res) => {
  const idexp = req.params.id;
  const password = req.body.password;
  const bcryptSalt = 10;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const str = req.body.avatartemp;
  const afterslash = str.substr(str.indexOf("/") + 1);
  if (req.file === undefined) {
    // console.log('test');
    req.file = {
      fieldname: "images",
      originalname: "sddsdsd",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "./public/uploads/",
      filename: afterslash,
      path: `public/${req.body.avatartemp}`
    };
    // console.log(req.file);
  }

  const updateUser = {
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
    avatar: `uploads/${req.file.filename}`,
    about: req.body.about,
    location: {
      city: req.body.city,
      country: req.body.country
    }
  };

  User.findOneAndUpdate({
    _id: idexp
  }, updateUser, (err, result) => {
    if (err) {
      return res.render("profile/edit", {
        user: result
      });
    }
    return res.redirect("/profile");
  });
});

module.exports = router;
