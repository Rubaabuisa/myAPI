const express = require("express");
const router = express.Router();
const data = require("./mongo");
const { body } = require("express-validator/check");

router.get("/posts", data.getPosts);
router.get("/post/:id", data.getPostbyID);

router.post(
  "/add",
  [
    body("title").trim().isLength({ min: 3 }),
    body("coverImage").trim(),
    body("excerpt").trim(),
    body("content").trim(),
    body("tags").trim(),
  ],
  data.createPost
);
router.patch(
  "/edit/:id",
  [
    body("title").trim().isLength({ min: 3 }),
    body("coverImage").trim(),
    body("excerpt").trim(),
    body("content").trim(),
    body("tags").trim(),
  ],
  data.updatePost
);
router.delete("/delete/:id", data.deletePost)

module.exports = router;
