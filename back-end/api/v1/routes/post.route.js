const express = require("express");
const router = express.Router();

const controller = require("../controller/posts.controller");
const auth = require("../middlewares/auth.middleware");
const uploadPost = require("../middlewares/posts.upload.middleware");
// GET danh sách bài viết + lọc + phân trang
router.get("/", controller.index);
// GET chi tiết bài viết
router.get("/detail/:id", controller.detail);
// Tạo bài viết
router.post("/create", auth, uploadPost, controller.create);
// Đổi trạng thái bài viết
router.patch("/change-status/:id", auth, controller.changeStatus);
// Sửa bài viết
router.patch("/edit/:id", auth, uploadPost, controller.edit);
// Xóa bài viết
router.delete("/delete/:id", auth, controller.delete);
// Lấy bài viết của người dùng hiện tại
router.get("/my-posts", auth, controller.myPosts);
module.exports = router;
