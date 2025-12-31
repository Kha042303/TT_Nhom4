module.exports.registerPost = (req, res, next) => {
  const full_name = req.body.full_name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;

  // optional
  const phone = req.body.phone?.trim();
  const address = req.body.address?.trim();

  if (!full_name) {
    return res.status(400).json({ message: "Họ tên không được để trống!" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email không được để trống!" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải từ 6 ký tự!" });
  }

  //  validate phone (optional): chỉ check nếu có nhập
  // (cho phép người dùng bỏ trống)
  if (phone && !/^(0|\+84)\d{9,10}$/.test(phone)) {
    return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
  }

  // address optional: nếu nhập thì phải >= 3 ký tự (tuỳ bạn)
  if (address && address.length < 3) {
    return res.status(400).json({ message: "Địa chỉ quá ngắn!" });
  }

  // (không bắt buộc) chuẩn hoá lại body để controller dùng luôn
  req.body.full_name = full_name;
  req.body.email = email;
  if (phone !== undefined) req.body.phone = phone;
  if (address !== undefined) req.body.address = address;

  next();
};
