const express = require("express");
const router = express.Router();

const controller = require("../controller/posts.controller");
const auth = require("../middlewares/auth.middleware");
const uploadPost = require("../middlewares/posts.upload.middleware");

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.post("/create", auth, uploadPost, controller.create);
router.patch("/change-status/:id", auth, controller.changeStatus);
router.patch("/edit/:id", auth, uploadPost, controller.edit);
router.delete("/delete/:id", auth, controller.delete);
router.get("/my-posts", auth, controller.myPosts);

module.exports = router;
