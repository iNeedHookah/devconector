const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load profile model
const Profile = require("../../models/Profile");
// Load user profile
const User = require("../../models/User");

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile working" });
});

// @route  GET api/profile
// @desc   Get current users profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;

    const errors = {};

    await Profile.findOne({ user: user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((err) =>
        res.status(500).json({
          msg: "Colud not get profile!",
          error: err,
        })
      );
  }
);

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public

router.get("/handle/:handle", async (req, res) => {
  const errors = {};

  await Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user!";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Could not get profile by handle",
        error: err,
      });
    });
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by id
// @access Public

router.get("/user/:user_id", async (req, res) => {
  const errors = {};

  await Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user!";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Could not get profile by id",
        error: err,
      });
    });
});

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get("/all", async (req, res) => {
  const errors = {};
  await Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles!";
        return res.status(404).json(errors);
      }

      return res.json(profiles);
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Could not get all profiles",
        error: err,
      });
    });
});

// @route  POST api/profile
// @desc   Create  or Edit user profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      //  Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    const {
      handle,
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      facebook,
      linkedin,
    } = req.body;

    const { user } = req;

    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Skills = split into array
    if (typeof skills !== "undefined") {
      profileFields.skills = skills.split(",");
    }

    // Social
    profileFields.socials = {};
    if (youtube) profileFields.socials.youtube = youtube;
    if (twitter) profileFields.socials.twitter = twitter;
    if (facebook) profileFields.socials.facebook = facebook;
    if (instagram) profileFields.socials.instagram = instagram;
    if (linkedin) profileFields.socials.linkedin = linkedin;

    await Profile.findOne({ user: user.id })
      .then(async (profile) => {
        console.log(profile);
        if (profile) {
          // Update
          return await updateProfile(user, profileFields, res);
        } else {
          // Create
          return await createProfile(profileFields, res);
        }
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not find profile!",
          error: err,
        });
      });
  }
);

const updateProfile = async (user, profileFields, res) => {
  await Profile.findOneAndUpdate(
    { user: user.id },
    { $set: profileFields },
    { new: true }
  )
    .then((profile) => {
      return res.json(profile);
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Could not update profile!",
        error: err,
      });
    });
};

const createProfile = async (profileFields, res) => {
  // Check if handle exists
  const errors = {};

  Profile.findOne({ handle: profileFields.handle }).then(async (profile) => {
    if (profile) {
      errors.handle = "That handle already exists";
      return res.status(400).json(errors);
    }

    // Save profile
    await new Profile(profileFields)
      .save()
      .then((profile) => {
        return res.json(profile);
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not create profile!",
          error: err,
        });
      });
  });
};

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { user } = req;
    const { title, company, location, from, to, current, description } =
      req.body;

    await Profile.findOne({ user: user.id }).then(async (profile) => {
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      await profile
        .save()
        .then((profile) => {
          return res.json(profile);
        })
        .catch((err) => {
          return res.status(500).json({
            msg: "Could not save experience!",
            error: err,
          });
        });
    });
  }
);

// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { school, degree, from, to, current, description, fieldofstudy } =
      req.body;
    const { user } = req;

    await Profile.findOne({ user: user.id })
      .then(async (profile) => {
        const newEdu = {
          school,
          degree,
          from,
          to,
          description,
          current,
          fieldofstudy,
        };

        profile.education.unshift(newEdu);
        await profile
          .save()
          .then((profile) => {
            return res.json(profile);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not save education!",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Colud not find profile for education",
          error: err,
        });
      });
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;

    await Profile.findOne({ user: user.id })
      .then(async (profile) => {
        // Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        if (removeIndex !== "undefined") {
          // Splice out of array
          profile.experience.splice(removeIndex, 1);
        } else {
          return res.status(404).json({
            msg: "Could not find experience with given id",
          });
        }

        // Save profile
        await profile
          .save()
          .then((profile) => {
            return res.json(profile);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not delete experience",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get profile for deleting experience",
          error: err,
        });
      });
  }
);

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from profile
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;

    await Profile.findOne({ user: user.id })
      .then(async (profile) => {
        // Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        if (removeIndex !== "undefined") {
          // Splice the array
          profile.education.splice(removeIndex, 1);
        } else {
          return res.status(404).json({
            msg: "Could not find education with given id",
          });
        }

        await profile
          .save()
          .then((profile) => {
            return res.json(profile);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Colud not delete education",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get profile for deleting education",
          error: err,
        });
      });
  }
);

// @route  DELETE api/profile
// @desc   Delete user and profile
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;
    await Profile.findOneAndRemove({ user: user.id }).then(async () => {
      await User.findOneAndRemove({ _id: user.id })
        .then(() => {
          return res
            .json({
              success: true,
            })
            .catch((err) => {
              return res.status(500).json({
                msg: "Could not delete user",
                error: err,
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            msg: "Could not delete profile",
            error: err,
          });
        });
    });
  }
);

module.exports = router;
