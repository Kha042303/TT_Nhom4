const db = require("../models");
const User = db.User;

// Thêm các model cần thiết vào phần require ở đầu file nếu chưa có
const Post = require("../models/posts.model.js");
const Book = require("../models/books.model.js");
const Report = require("../models/report.model.js");
const Payment = require("../models/payment.model");

// GET /api/v1/admin/dashboard/stats
module.exports.getDashboardStats = async (req, res) => {
  try {
    // Chạy song song các câu lệnh đếm để tối ưu thời gian phản hồi
    const [userCount, bookCount, postCount, reportCount, revenueData] = await Promise.all([
      User.count({ where: { deleted: "false" } }),
      Book.count({ where: { deleted: "false" } }),
      Post.count({ where: { deleted: "false" } }),
      Report.count(),
      Payment.sum('amount', { where: { status: 'success' } })
    ]);

    return res.json({
      code: 200,
      data: {
        users: userCount,
        books: bookCount,
        posts: postCount,
        reports: reportCount,
        revenue: revenueData || 0
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy dữ liệu Dashboard",
      error: error.message
    });
  }
};
// GET /admin/users?page=&limit=
module.exports.getAdminUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where: { deleted: "false" },
      attributes: ["user_id", "full_name", "email", "created_at", "status"],
      order: [["created_at", "DESC"]],
      limit,
      offset,
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
    return res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// PATCH /admin/users/:id/block  body: { status: 'active'|'inactive'|'banned' }
module.exports.toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["active", "inactive", "banned"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ code: 400, message: "Status không hợp lệ" });
    }

    const user = await User.findOne({
      where: { user_id: id, deleted: "false" },
    });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User không tồn tại" });
    }

    await user.update({ status });

    return res.json({
      code: 200,
      message:
        status === "banned"
          ? "Đã khóa tài khoản"
          : "Đã cập nhật trạng thái tài khoản",
    });
  } catch (error) {
    console.log("TOGGLE USER STATUS ERROR:", error);
    return res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// DELETE /admin/users/:id  (soft delete)
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { user_id: id, deleted: "false" },
    });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User không tồn tại" });
    }

    await user.update({ deleted: "true" });

    return res.json({ code: 200, message: "Đã xóa user" });
  } catch (error) {
    console.log("DELETE USER ERROR:", error);
    return res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};
