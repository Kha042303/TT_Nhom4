const User = require("../models/user.model.js");

module.exports = async (req, res, next) => {
  try {
    // Lấy token từ cookie trước
    let token = req.cookies.token;

    // Nếu không có trong cookie thì lấy từ header Authorization
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Bạn phải đăng nhập trước!"
      });
    }

    // Kiểm tra token trong bảng users
    const user = await User.findOne({
      where: {
        token: token,
        deleted: "false"
      }
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Token không hợp lệ!"
      });
    }

    // Lưu user vào req để controller dùng
    req.user = user;

    next();

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi xác thực token",
      error: error.message
    });
  }
};
