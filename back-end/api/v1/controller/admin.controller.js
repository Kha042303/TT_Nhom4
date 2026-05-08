const db = require("../models");
const User = db.User;

const Post = require("../models/posts.model.js");
const Book = require("../models/books.model.js");
const Report = require("../models/report.model.js");
const Payment = require("../models/payment.model");

const { UserRole, Role } = require("../models");
const { Op } = require("sequelize");
const includeNonAdmin = [
  {
    model: UserRole,
    as: "user_roles",
    where: { is_active: true }, 
    include: [
      {
        model: Role,
        as: "role",
        where: { role_name: { [Op.ne]: "admin" } },
      },
    ],
  },
];

// GET /api/v1/admin/dashboard/stats
module.exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, bookCount, postCount, reportCount, revenueData] =
      await Promise.all([
        User.count({
          where: { deleted: "false" },
          include: includeNonAdmin,
          distinct: true,
          col: "user_id",
        }),
        Book.count({ where: { deleted: "false" } }),
        Post.count({ where: { deleted: "false" } }),
        Report.count(),
        Payment.sum("amount", { where: { status: "success" } }),
      ]);

    return res.json({
      code: 200,
      data: {
        users: userCount,
        books: bookCount,
        posts: postCount,
        reports: reportCount,
        revenue: revenueData || 0,
      },
    });
  } catch (error) {
    console.log("GET DASHBOARD STATS ERROR:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy dữ liệu Dashboard",
      error: error.message,
    });
  }
};
// GET /admin/users?page=&limit=
module.exports.getAdminUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;
    const rows = await User.findAll({
      where: { deleted: "false" },
      attributes: { exclude: ["password"] },
      include: includeNonAdmin,
      order: [["created_at", "DESC"]],
      limit,
      offset,
      subQuery: false, 
      distinct: true,
    });

    const count = await User.count({
      where: { deleted: "false" },
      include: includeNonAdmin,
      distinct: true,
      col: "user_id",
    });
    return res.json({
      code: 200,
      data: rows,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(count / limit) || 1,
        total_records: count,
      },
    });
  } catch (error) {
    console.log("GET ADMIN USERS ERROR:", error);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// PATCH /admin/users/:id/block
module.exports.toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["active", "inactive", "banned"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ code: 400, message: "Status không hợp lệ" });
    }
    const user = await User.findOne({ where: { user_id: id, deleted: "false" } });
    if (!user) return res.status(404).json({ code: 404, message: "User không tồn tại" });

    await user.update({ status });

    return res.json({
      code: 200,
      message: status === "banned" ? "Đã khóa tài khoản" : "Đã cập nhật trạng thái tài khoản",
    });
  } catch (error) {
    console.log("TOGGLE USER STATUS ERROR:", error);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// DELETE /admin/users/:id
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { user_id: id, deleted: "false" } });
    if (!user) return res.status(404).json({ code: 404, message: "User không tồn tại" });

    await user.update({ deleted: "true" });
    return res.json({ code: 200, message: "Đã xóa user" });
  } catch (error) {
    console.log("DELETE USER ERROR:", error);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};
