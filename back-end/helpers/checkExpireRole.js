// helpers/checkExpireRole.js
const UserRole = require("../models/user_roles.model");

module.exports.checkExpireRole = async (user_id) => {
  const userRole = await UserRole.findOne({ where: { user_id } });
  if (!userRole) return;
  if (userRole.role_id === 3) return;
  if (
    userRole.role_id === 2 &&
    userRole.expire_at &&
    new Date(userRole.expire_at) < new Date()
  ) {
    await userRole.update({
      role_id: 1,      
      expire_at: null,
      is_active: true
    });
  }
};
