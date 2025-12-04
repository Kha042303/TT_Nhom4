const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const Validate = require("../../../validates/user.validates.js");
const auth = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkrole.js");
// Đăng ký tài khoản
router.post("/register", Validate.registerPost, userController.register);
// Đăng nhập tài khoản
router.post("/login", userController.login);
// Đăng xuất tài khoản
router.post("/logout", userController.logout);
// Lấy thông tin người dùng hiện tại
router.get("/profile", userController.getProfile);
// Lấy thông tin người dùng theo ID
router.get("/profileid/:id",auth ,userController.getProfileid);
// Sửa thông tin người dùng hiện tại
router.patch("/profile/editmyprofile", auth, userController.editProfile);
// Lấy danh sách tất cả người dùng
router.get("/list",auth,userController.getAllUsers);
module.exports = router;




