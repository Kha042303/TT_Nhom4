const express = require("express");
const router = express.Router();
const controller = require("../controller/report.controller.js");
const auth = require("../middlewares/auth.middleware");
// GET danh sách report + lọc + phân trang
router.get("/", controller.index);
// GET chi tiết report
router.get("/detail/:id", controller.detail);
// Tạo report
router.post("/create", auth, controller.create);
// Sửa report
router.patch("/edit/:id", auth, controller.edit);
// Xóa report
router.delete("/delete/:id", auth, controller.delete);
// Lấy report của người dùng hiện tại
router.get("/my-reports", auth, controller.myReports);
module.exports = router;
