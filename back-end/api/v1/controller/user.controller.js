const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../../../helpers/sendMail.js");
const User = require("../models/user.model.js");
const Session = require("../models/sesion.model.js");
const db = require("../models");
const Role = db.Role;
const UserRole = db.UserRole;
const { Op } = require("sequelize");
const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
module.exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body;
    if (!full_name || !email || !password)
      return res.json({ code: 400, message: "Thiếu thông tin" });

    const existUser = await User.findOne({
      where: { email, deleted: "false" }
    });

    if (existUser)
      return res.json({ code: 400, message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone: phone || null,
      address: address || null,
      status: "active"
    });

    const buyerRole = await Role.findOne({ where: { role_name: "buyer" } });

    await UserRole.create({
      user_id: newUser.user_id,
      role_id: buyerRole.role_id
    });

    return res.json({ code: 200, message: "Đăng ký thành công" });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ code: 400, message: "Thiếu email hoặc password" });
    }
    let user = await User.findOne({
      where: { email, deleted: "false" },
      include: [
        {
          model: UserRole,
          as: "user_roles",
          required: false,
          where: { is_active: true },
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["role_id", "role_name"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.json({ code: 400, message: "Email không tồn tại" });
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return res.json({ code: 400, message: "Mật khẩu sai" });
    }
    if (user.status === "banned") {
      return res.json({
        code: 403,
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    if (user.status === "inactive") {
      return res.json({
        code: 403,
        message: "Tài khoản đang bị tạm ngưng.",
      });
    }
    const now = new Date();
    const activeRole = user.user_roles?.[0]; 
    if (
      activeRole &&
      activeRole.role_id === 2 && 
      activeRole.expire_at &&
      new Date(activeRole.expire_at) < now
    ) {
      await UserRole.update(
        {
          role_id: 1,       
          start_at: now,
          expire_at: null,
          is_active: true,
        },
        { where: { id: activeRole.id } }
      );
      user = await User.findOne({
        where: { email, deleted: "false" },
        include: [
          {
            model: UserRole,
            as: "user_roles",
            required: false,
            where: { is_active: true },
            include: [
              {
                model: Role,
                as: "role",
                attributes: ["role_id", "role_name"],
              },
            ],
          },
        ],
      });
    }
    const accessToken = jwt.sign(
      { user_id: user.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await Session.create({
      user_id: user.user_id,
      refresh_token: hashedRT,
      expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    return res.json({
      code: 200,
      message: "Đăng nhập thành công",
      accessToken,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        user_roles: (user.user_roles || []).map((ur) => ({
          id: ur.id,
          role_id: ur.role_id,
          is_active: ur.is_active,
          start_at: ur.start_at,
          expire_at: ur.expire_at,
          role: ur.role
            ? {
                role_id: ur.role.role_id,
                role_name: ur.role.role_name,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
//logout
module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const sessions = await Session.findAll();

      for (const s of sessions) {
        const match = await bcrypt.compare(token, s.refresh_token);

        if (match) {
          await Session.destroy({ where: { session_id: s.session_id } });
        }
      }
      res.clearCookie("refreshToken");
    }
    return res.json({ code: 200, message: "Đăng xuất thành công" });

  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
//refresh token
module.exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.json({ message: "Không có token" });
    const sessions = await Session.findAll();
    let dbSession = null;
    for (const s of sessions) {
      const match = await bcrypt.compare(token, s.refresh_token);
      if (match) {
        dbSession = s;
        break;
      }
    }
    if (!dbSession)
      return res.json({ message: "Token sai" });
    if (dbSession.expires_at < new Date())
      return res.json({ message: "Token hết hạn" });
    const accessToken = jwt.sign(
      { user_id: dbSession.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    return res.json({ accessToken });
  } catch (error) {
    console.log("REFRESH TOKEN ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
//get profile
module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findOne({
      where: { user_id: userId, deleted: "false" },
      include: [
        {
          model: UserRole,
          as: "user_roles",
          required: false,
          where: { is_active: true },
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["role_id", "role_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      code: 200,
      message: "Thành công",
      data: user
    });

  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
//forgot password
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 
    if (!email) return res.json({ code: 400, message: "Thiếu email" });
    const user = await User.findOne({
      where: { email, deleted: "false" },
    });
    if (!user) return res.json({ code: 400, message: "Email không tồn tại" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    await User.update(
      {
        password_reset_token: hashedToken,
        password_reset_expires: expires,
      },
      { where: { user_id: user.user_id } }
    );
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const link = `${clientUrl}/reset-password?token=${resetToken}`;
    const html = `
      <p>Xin vui lòng chọn vào đặt lại mật khẩu để thay đổi mật khẩu.</p>
      <p>sau <b>15 phút</b> đặt lại mật khẩu sẽ vô hiệu hóa.</p>
      <a href="${link}">Đặt lại mật khẩu </a>
    `;
    const rs = await sendMail({ email, html });

    return res.json({
      code: 200,
      message: "Đã gửi email đặt lại mật khẩu",
      data: rs,
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
// reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!password || !token)
      return res.json({ code: 400, message: "Thiếu password hoặc token" });
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      where: {
        deleted: "false",
        password_reset_token: hashedToken,
        password_reset_expires: { [Op.gt]: new Date() },
      },
    });
    if (!user) return res.json({ code: 400, message: "Token không hợp lệ hoặc đã hết hạn" });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();
    return res.json({ code: 200, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
// get profile by id
module.exports.getProfileById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({
      where: { user_id: id, deleted: "false" },
      attributes: { 
        exclude: ["password", "password_reset_token", "password_reset_expires", "refresh_token"] 
      },
      include: [
        {
          model: UserRole,
          as: "user_roles",
          required: false,
          where: { is_active: true },
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["role_id", "role_name"],
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.json({ code: 404, message: "Người dùng không tồn tại" });
    }

    return res.json({
      code: 200,
      message: "Thành công",
      data: user
    });
  } catch (error) {
    console.log("GET PROFILE BY ID ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
// get all users (except admin and self)
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_id: { [Op.ne]: req.user.user_id },
        deleted: "false"
      },
      include: [
        {
          model: UserRole,
          as: "user_roles",
          where: { is_active: true },
          include: [
            {
              model: Role,
              as: "role",
              where: {
                role_name: { [Op.ne]: "admin" }   
              }
            }
          ]
        }
      ]
    });

    return res.json({
      code: 200,
      message: "Thành công",
      data: users
    });
  } catch (error) {
    console.log("GET ALL USERS ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
// edit profile
module.exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, address, phone } = req.body;
    await User.update(
      { full_name, address, phone },
      { where: { user_id: userId } }
    );
    return res.json({
      code: 200,
      message: "Sửa thành công"
    });
  } catch (error) {
    console.log("EDIT PROFILE ERROR:", error);
    return res.json({ code: 500, message: "Lỗi server" });
  }
};
