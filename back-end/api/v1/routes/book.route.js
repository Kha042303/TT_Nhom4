const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const bookController = require("../controller/book.controller.js");
const uploadBook = require("../middlewares/book.upload.middleware.js");
// GET danh sách sách + lọc + phân trang
router.get("/", bookController.index);
// GET chi tiết sách
router.get("/detail/:id", bookController.detail);
// Tạo sách
router.post("/create", auth, uploadBook, bookController.create);
// Sửa sách
router.patch("/edit/:id", auth, uploadBook, bookController.edit);
// Đổi trạng thái sách
router.patch("/change-status/:id", auth, bookController.changeStatus);
// Xóa sách
router.delete("/delete/:id", auth, bookController.delete);
//lấy danh sách sách của người dung hiện tại
router.get("/my-books", auth, bookController.myBooks);
module.exports = router;
