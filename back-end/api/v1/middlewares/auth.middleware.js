const User = require("../models/user.model.js");

module.exports = async (req, res, next) => {
  try {
   const token =req.cookies?.token ||req.headers["auth-token"] ||
    req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "bạn chưa đăng nhập"
      });
    }
    const user = await User.findOne({
      where: {
        token: token,
        deleted: "false"
      }
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Token không hợp lệ"
      });
    }
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
