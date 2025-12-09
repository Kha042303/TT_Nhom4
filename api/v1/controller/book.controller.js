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
    if (req.query.status) {
      find.where.status = req.query.status;
    }
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
      find.where.title = { [Op.regexp]: objectSearch.keyword }; 
      find.where.author = { [Op.regexp]: objectSearch.keyword };

    }
    let initPagination = {
      currentPage: 1,
      limitItems: 8,
    };
    const countBooks = await books.count({ where: find.where });
    const pagination = paginationHelper(initPagination, req.query, countBooks);
    const Book = await books.findAll({
      ...find,
      limit: pagination.limitItems,
      offset: pagination.skip
    });
 if (req.query.sortKey && req.query.sortValue) {
      find.order.push([req.query.sortKey, req.query.sortValue]);
    }
    const data = Book.map(item => {
  return {
    ...item.dataValues,
    image_url: item.image_url ? JSON.parse(item.image_url) : []
  };
});

res.json({ data });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
// GET /api/v1/book/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await books.findOne({
      where: {
        book_id: id,
        deleted: "false" 
      }
    });

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "không tìm thấy"
      });
    }

    res.json({
  code: 200,
  data: {
    ...book.dataValues,
    image_url: book.image_url ? JSON.parse(book.image_url) : []
  }
});


  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "lỗi",
      error: error.message
    });
  }
};
// PATCH /api/v1/book/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status; 

    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        code: 400,
        message: " Chỉ được dùngactive, inactive"
      });
    }

    const result = await books.update(
      { status: status },
      { where: { book_id: id } }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        code: 400,
        message: "Không tìm thấy sách"
      });
    }
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi ",
      error: error.message
    });
  }
};
// [POST] /api/v1/book/create
module.exports.create = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.user_id;
    const allowedStatus = ["active", "inactive"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status Chỉ được: active, inactive"
      });
    }
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/images/books/${file.filename}`);
      body.image_url = JSON.stringify(imagePaths);
    }
    body.user_id = userId;
    const data = await books.create(body);

    return res.json({
      code: 200,
      message: "Tạo thành công",
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi ",
      error: error.message
    });
  }
};
// PATCH /api/v1/book/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;      
    const body = req.body;         
    const allowedStatus = ["active", "inactive"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return res.status(400).json({
        code: 400,
        message: "Status chỉ được active, inactive"
      });
    }
      if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/images/books/${file.filename}`);
      body.image_url = JSON.stringify(imagePaths);
    }
    const [affectedRows] = await books.update(body, {
      where: { book_id: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách "
      });
    }
   
    res.json({
      code: 200,
      message: "Cập nhật thành công"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi ",
      error: error.message
    });
  }
};
// DELETE /api/v1/book/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const [affectedRows] = await books.update(
      {
        deleted: "true",     
        deletedAt: new Date() 
      },
      {
        where: { book_id: id }
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách "
      });
    }

    res.json({
      code: 200,
      message: "Xóa thành công"
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi",
      error: error.message
    });
  }
};
// GET /api/v1/book/my-books
module.exports.myBooks = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const userBooks = await books.findAll({
      where: {
        user_id: userId,
        deleted: "false"   
      }
    });

    if (userBooks.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "Người dùng không có sách nào"
      });
    }

    res.json({
      code: 200,
      message: "Lấy sách của người dùng thành công",
      data: userBooks
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi",
      error: error.message
    });
  }
};

