// @ts-nocheck
const jwt = require("jsonwebtoken");

// Middleware xác thực Access Token
module.exports = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header)
      return res.status(401).json({ message: "Thiếu access token" });
    // Lấy token sau "Bearer "
    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token không hợp lệ" });
    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Token hết hạn hoặc sai" });
      req.user = decoded; // { user_id, role }
      next();
    });

  } catch (error) {
    return res.status(500).json({
      message: "Lỗi xác thực token",
      error: error.message
    });
  }
};
