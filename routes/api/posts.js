const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validatePostInput = require("../../validation/post");
const validateCommentInput = require("../../validation/comments");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Posts working",
  });
});

// @route  POST api/post/
// @desc   Create a new post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { text, name, avatar } = req.body;
    const { user } = req;

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text,
      name,
      avatar,
      user: user.id,
    });

    await newPost
      .save()
      .then((post) => {
        return res.json(post);
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not save post",
          error: err,
        });
      });
  }
);

// @route  GET api/posts/
// @desc   Get all posts
// @access Public
router.get("/", async (req, res) => {
  await Post.find()
    .sort({ date: -1 })
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({
          nopostsfound: "No posts were found",
        });
      }
      return res.json(posts);
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Could not get posts",
        error: err,
      });
    });
});

// @route  GET api/posts/post_id
// @desc   Get a post by id
// @access Public
router.get("/:post_id", async (req, res) => {
  await Post.findById(req.params.post_id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          nopostsfound: "No posts found with given ID",
        });
      }
      return res.json(post);
    })
    .catch((err) => {
      return res.status(500).json({
        msg: "Could not get post",
        error: err,
      });
    });
});

// @route  DELETE api/posts/post_id
// @desc   Delete a post by id
// @access Private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;
    await Profile.findOne({ user: user.id })
      .then(async () => {
        await Post.findById(req.params.post_id)
          .then((post) => {
            if (!post) {
              return res.status(404).json({
                msg: "Could not find post to delete",
                error: err,
              });
            }

            // Check for post owner
            if (post.user.toString() !== user.id) {
              return res.status(401).json({
                notauthorized: "User not authorized",
              });
            }

            //Delete
            post
              .remove()
              .then(() => {
                res.json({ success: true });
              })
              .catch((err) => {
                res.status(500).json({
                  msg: "Could not delete post",
                  error: err,
                });
              });
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not get post to delete",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get user when trying to delete post",
          error: err,
        });
      });
  }
);

// @route  POST api/posts/like/:post_id
// @desc   Like a post
// @access Private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;

    await Post.findById(req.params.post_id)
      .then(async (post) => {
        if (!post) {
          return res.status(404).json({
            nopostsfound: "Could not find post to like",
          });
        }

        // Check if user already liked post
        if (
          post.likes.filter((like) => like.user.toString() === user.id).length >
          0
        ) {
          return res.status(400).json({
            alreadyliked: "User already liked this post",
          });
        }

        // Add the user id to likes array
        post.likes.unshift({ user: user.id });

        await post
          .save()
          .then((post) => {
            return res.json(post);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not like post",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get post to like",
          error: err,
        });
      });
  }
);

// @route  POST api/posts/unlike/:post_id
// @desc   Unlike a post
// @access Private
router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req;

    await Post.findById(req.params.post_id)
      .then(async (post) => {
        if (!post) {
          return res.status(404).json({
            nopostsfound: "Could not find post to unlike",
          });
        }

        if (
          post.likes.filter((like) => like.user.toString() === user.id)
            .length === 0
        ) {
          return res.status(400).json({
            notliked: "You have not liked this post yet",
          });
        }

        // Get remove index
        const removeIndex = post.likes
          .map((item) => item.user.toString())
          .indexOf(user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        await post
          .save()
          .then((post) => {
            return res.json(post);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not unlike post",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get post to unlike",
          error: err,
        });
      });
  }
);

// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { text, name, avatar } = req.body;
    const { user } = req;

    const { errors, isValid } = validateCommentInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    await Post.findById(req.params.id)
      .then(async (post) => {
        if (!post) {
          return res.status(404).json({
            postnotfound: "No post found to add comment",
          });
        }

        const newComment = {
          text,
          name,
          avatar,
          user: user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        await post
          .save()
          .then((post) => {
            return res.json(post);
          })
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not save comment",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get post to comment on",
          error: err,
        });
      });
  }
);

// @route  DELETE api/comment/:id/:comment_id
// @desc   Delete a comment from post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Post.findById(req.params.id)
      .then(async (post) => {
        if (!post) {
          return res.status(404).json({
            postnotfound: "No post found to add comment",
          });
        }

        // Check to see if comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({
            commentnotfound: "Comment not found",
          });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        await post
          .save()
          .then((post) => res.json(post))
          .catch((err) => {
            return res.status(500).json({
              msg: "Could not delete comment",
              error: err,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          msg: "Could not get post to comment on",
          error: err,
        });
      });
  }
);

module.exports = router;
