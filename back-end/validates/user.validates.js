module.exports.registerPost = (req, res, next) => {

  if (!req.body.full_name?.trim()) {
    return res.status(400).json({ message: "Họ tên không được để trống!" });
  }

  if (!req.body.email?.trim()) {
    return res.status(400).json({ message: "Email không được để trống!" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải từ 6 ký tự!" });
  }

  next();
};
