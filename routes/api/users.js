const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route  GET api/users/test
// @desc   Tests user route
// @access Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Users Working",
  });
});

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;
  await User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(email, {
          s: "200", // Size
          r: "pg", // Rating,
          d: "mm", // Default
        });
        const newUser = new User({
          name,
          email,
          password,
          avatar,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            await newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Could not register user!",
        error: err,
      });
    });
});

// @route  POST api/users/login
// @desc   Login user / Returning the JWT token
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  await User.findOne({ email })
    .then(async (user) => {
      // Check for user
      if (!user) {
        errors.credentials = "Invalid credentials!";
        return res.status(404).json(errors);
      }
      // Check password
      await bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          const payload = {
            id: user._id,
            name: user.name,
            avatar: user.avatar,
          }; // Create JWT payload

          // Sign token
          jwt.sign(
            payload,
            process.env.JWTSecret,
            { expiresIn: "1h" },
            (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`,
              });
            }
          );
        } else {
          errors.credentials = "Invalid credentials!";
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Could not log in user!",
        error: err,
      });
    });
});

// @route  GET api/users/current
// @desc   Return the current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req);
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  }
);

module.exports = router;
