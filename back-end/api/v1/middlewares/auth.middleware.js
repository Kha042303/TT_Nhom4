const User = require("../models/user.model.js");

module.exports = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Bạn phải đăng nhập trước!"
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
        message: "Token không hợp lệ!"
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
