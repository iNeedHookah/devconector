const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { name, email, password } = req.body;
  await User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          email: "Email already exists",
        });
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

// @route  GET api/users/login
// @desc   Login user / Returning the JWT token
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email })
    .then(async (user) => {
      // Check for user
      if (!user) {
        return res.status(404).json({
          msg: "Invalid credentials!",
        });
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
          return res.status(400).json({
            msg: "Invalid credentials!",
          });
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

module.exports = router;
