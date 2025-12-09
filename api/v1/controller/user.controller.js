const md5 = require("md5");
const User = require("../models/user.model.js");
const db = require("../models");
const  generateHelpers = require("../../../helpers/generate.js");
const { Op } = require("sequelize");
const Role = db.Role;
const UserRole = db.UserRole;
// POST /api/v1/user/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);

    const existUser = await User.findOne({
      where: {
        email: req.body.email,
        deleted: "false"
      }
    });

    if (existUser) {
      return res.json({
        code: 400,
        message: "Email đã tồn tại"
      });
    }

    const newUser = await User.create({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
      token: generateHelpers.generateRandomString(30),
    });
    const buyerRole = await Role.findOne({ where: { role_name: "buyer" } });
    await UserRole.create({
      user_id: newUser.user_id,
      role_id: buyerRole.role_id,
      start_at: new Date(),
      expire_at: null,
      is_active: true
    });

    return res.json({
      code: 200,
      message: "Đăng ký thành công",
      token: newUser.token
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi đăng ký",
      error: error.message
    });
  }
};
// POST /api/v1/user/login
module.exports.login = async (req, res) => {
 const email = req.body.email;
 const password=req.body.password;

 if( !email || !password ){
   res.json({
    code:400,
    message:"Thiếu email hoặc password"
   });
   return;
 }
 const user = await User.findOne({
    where: {
      email: email,
      deleted: "false"
    }
  });
  if( !user ){
   res.json({
    code:400,
    message:"Email không tồn tại"
   });
   return;
  }
  if( user.password !== md5(password) ){
   res.json({
    code:400,
    message:"Mật khẩu không đúng"
   });
   return;
  }
const token = user.token;
res.cookie("token", token );

  res.json({
  code: 200,
  message: "Đăng nhập thành công",
  token: user.token,
 user: {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    address: user.address,
    phone: user.phone,
    role: user.role,
    status: user.status
  }
});

};
// PUT /api/v1/user/logout
module.exports.logout = async (req, res) => {

  try {
    const token = req.cookies?.refreshToken;
    res.clearCookie("token");
    res.json({
      code: 200,
      message: "Đăng xuất thành công"
    });
  }
  catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi đăng xuất",
      error: error.message
    });
  }
};
// GET /api/v1/user/profile
module.exports.getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(400).json({
        code: 400,
        message: "Không tìm thấy token trong cookie"
      });
    }
    const user = await User.findOne({
      where: {
        token: token,
        deleted: "false"
      },
      attributes: [
        "user_id",
        "full_name",
        "email",
        "address",
        "phone",
        "role",
        "created_at",
        "status"
      ]
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy user với token này"
      });
    }

    return res.json({
      code: 200,
      message: "Lấy thông tin user thành công",
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy thông tin user",
      error: error.message
    });
  }
};
// GET /api/v1/user/profileid/:id
module.exports.getProfileid = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      where: {
        user_id: id,
        deleted: "false"
      },
      attributes: [
        "user_id",  
        "full_name",
        "email",
        "address",
        "phone",
        "role",
        "created_at",
        "status"
      ]
    });
    if (!user) {
     res.status(404).json({
      code:404,
      message:"Không tìm thấy user với id này"
     });
     return;
    }

    return res.json({
      code: 200,
      message: "Lấy thông tin user thành công",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy thông tin user",
      error: error.message
    });
  }
};
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_id: { [Op.ne]: req.user.user_id },
        role: { [Op.ne]: "admin" },
        deleted: "false"
      },
      attributes: [
        "user_id",  
        "full_name",
        "email",
        "address",
        "phone",
        "role",
        "created_at",
        "status"
      ]
    }); 
    return res.json({
      code: 200,
      message: "Lấy danh sách người dùng thành công",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message
    });
  }
};
// PATCH /api/v1/user/profile/editmyprofile
module.exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, address, phone } = req.body;
    await User.update(
      {
        full_name: full_name,
        address: address,
        phone: phone
      },
      {
        where: { user_id: userId }
      }
    );
    const updatedUser = await User.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "full_name",
        "email",
        "address",
        "phone",
        "role",
        "created_at",
        "status"
      ]
    });
    return res.json({
      code: 200,
      message: "Cập nhật thông tin cá nhân thành công",
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi cập nhật thông tin cá nhân",
      error: error.message
    });
  }
};

