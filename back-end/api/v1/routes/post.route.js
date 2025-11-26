const express = require("express");
const router = express.Router();

const controller = require("../controller/posts.controller");
const auth = require("../middlewares/auth.middleware");
const uploadPost = require("../middlewares/posts.upload.middleware");

// LIST
router.get("/", controller.index);

// DETAIL
router.get("/detail/:id", controller.detail);

// CREATE (có upload ảnh)
router.post("/create", auth, uploadPost, controller.create);

// EDIT (có upload ảnh)
router.patch("/edit/:id", auth, uploadPost, controller.edit);

// DELETE
router.delete("/delete/:id", auth, controller.delete);

// MY POSTS
router.get("/my-posts", auth, controller.myPosts);

module.exports = router;
