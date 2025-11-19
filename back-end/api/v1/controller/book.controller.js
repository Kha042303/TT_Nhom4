const { Op } = require("sequelize");
const books = require("../models/books.model.js");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/Search");

// GET /api/v1/book
module.exports.index = async (req, res) => {
  try {
    const find = {
      where: { deleted: "false" },
      order: []
    };

    // Filter status
    if (req.query.status) {
      find.where.status = req.query.status;
    }

    // Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
      find.where.title = { [Op.regexp]: objectSearch.keyword }; 
    }

    // Pagination init
    let initPagination = {
      currentPage: 1,
      limitItems: 2,
    };

    const countBooks = await books.count({ where: find.where });

    const pagination = paginationHelper(initPagination, req.query, countBooks);

    if (req.query.sortKey && req.query.sortValue) {
      find.order.push([req.query.sortKey, req.query.sortValue]);
    }

    const Book = await books.findAll({
      ...find,
      limit: pagination.limitItems,
      offset: pagination.skip
    });

    res.json({ data: Book });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/v1/book/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status; 

    // ===========================
    // ✔ CHECK ENUM
    // ===========================
    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ! Chỉ được: active, inactive"
      });
    }

    // ===========================
    // ✔ UPDATE DATABASE
    // ===========================
    const result = await books.update(
      { status: status },
      { where: { book_id: id } }
    );

    // Nếu không update được (ID không tồn tại)
    if (result[0] === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách để cập nhật!"
      });
    }

    // Thành công
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

// [POST] /api/v1/book/create
module.exports.create = async (req, res) => {
  try {
    const body = req.body;

    // ===========================
    // 1) CHECK ENUM status
    // ===========================
    const allowedStatus = ["active", "inactive"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ! Chỉ được: active, inactive"
      });
    }

    // ===========================
    // 2) TẠO BOOK TRONG MYSQL (SEQUELIZE)
    // ===========================
    const data = await books.create(body);
    return res.json({
      code: 200,
      message: "Tạo sách thành công!",
      data: data
    });

  } catch (error) {
    
    return res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};

// PATCH /api/v1/book/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;      // book_id
    const body = req.body;         // dữ liệu cần update

    // ===========================
    // 1) CHECK ENUM status (nếu có gửi lên)
    // ===========================
    const allowedStatus = ["active", "inactive"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status không hợp lệ! Chỉ được: active, inactive"
      });
    }

    // ===========================
    // 2) UPDATE TRONG DB
    // ===========================
    const [affectedRows] = await books.update(body, {
      where: { book_id: id }
    });

    // affectedRows = 0 => không có bản ghi nào được update
    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách để cập nhật!"
      });
    }

    // ===========================
    // 3) TRẢ KẾT QUẢ THÀNH CÔNG
    // ===========================
    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });

  } catch (error) {
    // ===========================
    // 4) LỖI SERVER
    // ===========================
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};
// DELETE /api/v1/book/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // ===========================
    // 1) UPDATE deleted = "true"
    // ===========================
    const [affectedRows] = await books.update(
      {
        deleted: "true",       // vì bạn đang dùng ENUM("true","false")
        deletedAt: new Date()  // nếu bạn có cột này
      },
      {
        where: { book_id: id }
      }
    );

    // Nếu không tìm thấy sách
    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách để xóa!"
      });
    }

    // Thành công
    res.json({
      code: 200,
      message: "Xóa thành công!"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server!",
      error: error.message
    });
  }
};
