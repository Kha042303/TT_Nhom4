const nodemailer = require("nodemailer");

const sendMail = async ({ email, html }) => {
  // check env để khỏi lỗi PLAIN
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS STARTTLS
    auth: {
      user: process.env.EMAIL_USER,          // ✅ dùng EMAIL_USER
      pass: process.env.EMAIL_APP_PASSWORD,  // ✅ app password 16 ký tự
    },
  });

  const info = await transporter.sendMail({
    from: `"Cửa hàng sách cũ" <${process.env.EMAIL_USER}>`, // ✅ from đúng gmail gửi
    to: email,
    subject: "Đặt lại mật khẩu - Cửa hàng sách cũ",
    html,
  });

  return info;
};

module.exports = sendMail;
