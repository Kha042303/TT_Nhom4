const md5 = require("md5");
const User = require("../models/user.model.js");
const  generateHelpers = require("../../../helpers/generate.js");
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

    return res.json({
      code: 200,
      message: "Đăng ký thành công",
      token: newUser.token
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};
// POST /api/v1/user/login
module.exports.login = async (req, res) => {
 const email = req.body.email;
 const password=req.body.password;

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
    token: user.token
  });
};
// POST /api/v1/user/password/forgot
// module.exports.forgotPassword = async (req, res) => {
//   const email = req.body.email;
//    const user = await User.findOne({
//     where: {
//       email: email,
//       deleted: "false"
//     }
//   });
//   if( !user ){
//    res.json({
//     code:400,
//     message:"Email không tồn tại"
//    });
//    return;
//   }
// };
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
        "create_at",
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
      message: "Lỗi server",
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
        "create_at",
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
      message: "Lỗi server",
      error: error.message
    });
  }
};

module.exports.editProfile = async (req, res) => {
const id = req.params.id;

};
module.exports.changePassword = async (req, res) => {
  res.send("changePassword API chưa viết");
};
