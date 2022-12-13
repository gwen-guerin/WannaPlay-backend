var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
require("../models/connection");
const User = require("../models/users");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

//route pour retrouver le user pour la page profile
router.get("/profile/:username", function (req, res) {
  User.findOne({ username: req.params.username }).then((data) => {
    // console.log(data)
    if (data) {
      res.json({ result: true, userList: data });
    } else {
      res.json({ result: false, error: "user not existing" });
    }
  });
});

router.post("/signup", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  // Check if the user has not already been registered
  if (username && password) {
    User.findOne({ username: username }).then((data) => {
      if (data === null) {
        const newUser = new User({
          firstname,
          lastname,
          username,
          email,
          password: hash,
          token: uid2(32),
        });

        newUser.save().then((newUser) => {
          res.json({ result: true, user: newUser });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: "User already exists" });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

router.post("/signin", (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (username && password) {
    User.findOne({ username: username }).then((data) => {
      if (data === null) {
        res.json({ result: false, error: "User not found" });
      } else {
        res.json({ result: true, user: data });
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

router.get("/allUsers", (req, res) => {
  const usernames = [];
  User.find().then((data) => {
    data.map((user) => {
      usernames.push(user.username);
    });
    res.json({ result: true, usernames: usernames });
  });
});

module.exports = router;
