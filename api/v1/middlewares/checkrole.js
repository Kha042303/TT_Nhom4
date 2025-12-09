const db = require("../models");
const UserRole = db.UserRole;
const Role = db.Role;

module.exports = function checkRoles(role = []) {
  return async (req, res, next) => {
    try {
      const userId = req.user.user_id;
      const userRole = await UserRole.findOne({
        where: { user_id: userId, is_active: true },
        include: [{ model: Role, as: "role" }]
      });
      if (!userRole) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện"
        });
      }
      const now = new Date();
      if (userRole.expire_at !== null && now > userRole.expire_at) {
  return res.status(403).json({
    message: "Quyền của bạn đã hết hạn."
  });
      }
      const namerole = userRole.role.role_name;
        const allowedRoles = Array.isArray(role) ? role : [role];
      if (!allowedRoles.includes(namerole)) {
        return res.status(403).json({
          message: "bạn không có quyền thực hiện"
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi phân quyền" });
    }
  };
};


