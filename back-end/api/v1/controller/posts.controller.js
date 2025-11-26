const { Op } = require("sequelize");
const Post = require("../models/posts.model.js");
const paginationHelper = require("../../../helpers/pagination.js");
const searchHelper = require("../../../helpers/Search.js");

// GET /api/v1/post
module.exports.index = async (req, res) => {
  try {
    const find = {
      where: { deleted: "false" },
      order: [["create_at", "DESC"]]
    };

    // Filter status
    if (req.query.status) {
      find.where.status = req.query.status;
    }

    // Filter theo user_id (nếu cần)
    if (req.query.user_id) {
      find.where.user_id = req.query.user_id;
    }

    // Search theo keyword (title / content)
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
      find.where[Op.or] = [
        { title: { [Op.regexp]: objectSearch.keyword } },
        { content: { [Op.regexp]: objectSearch.keyword } }
      ];
    }

    // Pagination init
    let initPagination = {
      currentPage: 1,
      limitItems: 8
    };

    const totalPosts = await Post.count({ where: find.where });

    const pagination = paginationHelper(
      initPagination,
      req.query,
      totalPosts
    );

    find.limit = pagination.limitItems;
    find.offset = pagination.skip;

    const posts = await Post.findAll(find);

    // Parse ảnh
    const data = posts.map(item => ({
      ...item.dataValues,
      images: item.images ? JSON.parse(item.images) : []
    }));

    res.json({
      code: 200,
      message: "Lấy danh sách bài viết thành công!",
      data,
      pagination
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// GET /api/v1/post/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findOne({
      where: {
        post_id: id,
        deleted: "false"
      }
    });

    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết!"
      });
    }

    res.json({
      code: 200,
      data: {
        ...post.dataValues,
        images: post.images ? JSON.parse(post.images) : []
      }
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// PATCH /api/v1/post/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const allowedStatus = ["visible", "hidden"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ! Chỉ được: visible, hidden"
      });
    }

    const [affectedRows] = await Post.update(
      { status },
      {
        where: {
          post_id: id,
          deleted: "false"
        }
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết hoặc đã bị xóa!"
      });
    }

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// POST /api/v1/post/create
module.exports.create = async (req, res) => {
  try {
    const body = req.body;

    // user_id lấy từ token, không cho client gửi
    const userId = req.user.user_id;

    // Kiểm tra title
    if (!body.title) {
      return res.status(400).json({
        code: 400,
        message: "title là bắt buộc!"
      });
    }

    // Upload ảnh
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/images/posts/${file.filename}`);
      body.images = JSON.stringify(imagePaths);
    }

    const allowedStatus = ["visible", "hidden"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ!"
      });
    }

    const data = await Post.create({
      user_id: userId,
      title: body.title,
      content: body.content || null,
      image_url: body.images || null,
      is_violation: body.is_violation ?? 0,
      status: body.status || "visible"
    });

    return res.json({
      code: 200,
      message: "Tạo bài viết thành công!",
      data
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// PATCH /api/v1/post/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const userId = req.user.user_id; // từ token

    const post = await Post.findOne({
      where: {
        post_id: id,
        deleted: "false"
      }
    });

    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết!"
      });
    }

    // Upload ảnh mới
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/posts/${file.filename}`);
      body.images = JSON.stringify(imagePaths);
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền sửa bài viết này!"
      });
    }

    const allowedStatus = ["visible", "hidden"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ!"
      });
    }

    const updateData = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.is_violation !== undefined) updateData.is_violation = body.is_violation;
    if (body.status !== undefined) updateData.status = body.status;

    await Post.update(updateData, {
      where: {
        post_id: id
      }
    });

    const updatedPost = await Post.findOne({
      where: {
        post_id: id,
        deleted: "false"
      }
    });

    res.json({
      code: 200,
      message: "Cập nhật bài viết thành công!",
      data: {
        ...updatedPost.dataValues,
        images: updatedPost.images ? JSON.parse(updatedPost.images) : []
      }
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// DELETE /api/v1/post/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.user_id;

    const post = await Post.findOne({
      where: { post_id: id, deleted: "false" }
    });

    if (!post) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết!"
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa bài viết này!"
      });
    }

    await Post.update(
      { deleted: "true" },
      { where: { post_id: id } }
    );

    res.json({
      code: 200,
      message: "Xóa bài viết thành công!"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// GET /api/v1/post/my-posts
module.exports.myPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const posts = await Post.findAll({
      where: {
        user_id: userId,
        deleted: "false"
      },
      order: [["create_at", "DESC"]]
    });

    return res.json({
      code: 200,
      message: "Lấy danh sách bài viết của bạn thành công!",
      data: posts.map(item => ({
        ...item.dataValues,
        images: item.images ? JSON.parse(item.images) : []
      }))
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};
