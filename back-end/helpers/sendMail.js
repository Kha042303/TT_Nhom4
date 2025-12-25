const nodemailer = require("nodemailer");

const sendMail = async ({ email, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env");
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,          
      pass: process.env.EMAIL_APP_PASSWORD, 
    },
  });

  const info = await transporter.sendMail({
    from: `"Cửa hàng sách cũ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu - Cửa hàng sách cũ",
    html,
  });

  return info;
};

module.exports = sendMail;
