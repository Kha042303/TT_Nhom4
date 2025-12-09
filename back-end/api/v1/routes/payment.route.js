const express = require("express");
const router = express.Router();

const controller = require("../controller/payment.controller.js");
const auth = require("../middlewares/auth.middleware");

// Tạo thanh toán 
router.post("/create", auth, controller.create);
// Callback từ MoMo 
router.get("/momo-callback", controller.momoCallback);
// ADMIN: Lấy danh sách tất cả thanh toán
router.get("/", auth, controller.index);
// ADMIN: Chi tiết thanh toán
router.get("/detail/:id", auth, controller.detail);
// ADMIN: Cập nhật trạng thái
router.patch("/update/:id", auth, controller.update);
module.exports = router;
