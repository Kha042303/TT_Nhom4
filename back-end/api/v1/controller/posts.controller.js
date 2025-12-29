const { Op } = require("sequelize");
const Post = require("../models/posts.model.js");
const User = require("../models/user.model.js");
const UserRole = require("../models/user_roles.model.js");
const Role = require("../models/roles.model.js");
const paginationHelper = require("../../../helpers/pagination.js");
const searchHelper = require("../../../helpers/Search.js");

const isAdmin = (user) =>
  user?.user_roles?.some(
    (ur) => ur.is_active && ur.role?.role_name === "admin"
  );

module.exports.index = async (req, res) => {
  try {
    const find = {
      where: { deleted: "false" },
      order: [["post_id", "DESC"]],
    };
    if (req.query.user_id) {
      find.where.user_id = req.query.user_id;
    }

    if (req.query.status) {
      find.where.status = req.query.status;
    }
    if (req.query.keyword) {
      const s = searchHelper(req.query);
      find.where[Op.or] = [
        { title: { [Op.regexp]: s.keyword } },
        { content: { [Op.regexp]: s.keyword } },
      ];
    }
    const initPagination = { currentPage: 1, limitItems: 8 };
    const total = await Post.count({ where: find.where });
    const pagination = paginationHelper(initPagination, req.query, total);
    find.limit = pagination.limitItems;
    find.offset = pagination.skip;
    const posts = await Post.findAll(find);
    return res.json({
      code: 200,
      data: posts.map((p) => ({
        ...p.dataValues,
        images: p.images ? JSON.parse(p.images) : [],
      })),
      pagination,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy danh sách bài viết",
      error: err.message,
    });
  }
};
module.exports.detail = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { post_id: req.params.id, deleted: "false" },
    });

    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
      });
    }

    return res.json({
      code: 200,
      data: {
        ...post.dataValues,
        images: post.images ? JSON.parse(post.images) : [],
      },
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy chi tiết bài viết",
      error: err.message,
    });
  }
};
module.exports.create = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const body = req.body;

    if (!body.title) {
      return res.status(400).json({
        code: 400,
        message: "title là bắt buộc",
      });
    }

    if (req.files?.length) {
      body.images = JSON.stringify(
        req.files.map((f) => `/images/posts/${f.filename}`)
      );
    }

    const post = await Post.create({
      user_id: userId,
      title: body.title,
      content: body.content || null,
      images: body.images || null,
      status: body.status || "visible",
      is_violation: body.is_violation ?? 0,
    });
    return res.json({
      code: 200,
      message: "Tạo bài viết thành công",
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi tạo bài viết",
      error: err.message,
    });
  }
};
module.exports.edit = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { post_id: req.params.id, deleted: "false" },
    });
    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
      });
    }
    const user = await User.findByPk(req.user.user_id, {
      include: [
        {
          model: UserRole,
          as: "user_roles",
          where: { is_active: true },
          required: false,
          include: [{ model: Role, as: "role" }],
        },
      ],
    });
    if (!isAdmin(user) && post.user_id !== user.user_id) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền sửa bài viết này",
      });
    }

    const updateData = {};
    ["title", "content", "status", "is_violation"].forEach((k) => {
      if (req.body[k] !== undefined) updateData[k] = req.body[k];
    });

    if (req.files?.length) {
      updateData.images = JSON.stringify(
        req.files.map((f) => `/images/posts/${f.filename}`)
      );
    }

    await Post.update(updateData, {
      where: { post_id: post.post_id },
    });

    const updated = await Post.findByPk(post.post_id);

    return res.json({
      code: 200,
      message: "Cập nhật bài viết thành công",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi cập nhật bài viết",
      error: err.message,
    });
  }
};
module.exports.changeStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      include: [
        {
          model: UserRole,
          as: "user_roles",
          where: { is_active: true },
          required: false,
          include: [{ model: Role, as: "role" }],
        },
      ],
    });

    if (!isAdmin(user)) {
      return res.status(403).json({
        code: 403,
        message: "Chỉ admin mới được đổi trạng thái bài viết",
      });
    }
    const { status } = req.body;
    if (!["visible", "hidden"].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ",
      });
    }
    const [affected] = await Post.update(
      { status },
      { where: { post_id: req.params.id, deleted: "false" } }
    );
    if (!affected) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
      });
    }
    return res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi cập nhật trạng thái",
      error: err.message,
    });
  }
};
module.exports.delete = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { post_id: req.params.id, deleted: "false" },
    });

    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết",
      });
    }

    const user = await User.findByPk(req.user.user_id, {
      include: [
        {
          model: UserRole,
          as: "user_roles",
          where: { is_active: true },
          required: false,
          include: [{ model: Role, as: "role" }],
        },
      ],
    });

    if (!isAdmin(user) && post.user_id !== user.user_id) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa bài viết này",
      });
    }

    await Post.update(
      { deleted: "true" },
      { where: { post_id: post.post_id } }
    );

    return res.json({
      code: 200,
      message: "Xóa bài viết thành công",
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi xóa bài viết",
      error: err.message,
    });
  }
};
module.exports.myPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        user_id: req.user.user_id,
        deleted: "false",
      },
      order: [["post_id", "DESC"]],
    });

    return res.json({
      code: 200,
      data: posts.map((p) => ({
        ...p.dataValues,
        images: p.images ? JSON.parse(p.images) : [],
      })),
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy bài viết của bạn",
      error: err.message,
    });
  }
};
