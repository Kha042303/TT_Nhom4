const { Op } = require("sequelize");
const Report = require("../models/report.model.js");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/Search");

// GET /api/v1/report
module.exports.index = async (req, res) => {
  try {
    const find = {
      where: {},
      order: [["generated_at", "DESC"]]
    };

    // Lọc theo loại report
    if (req.query.report_type) {
      find.where.report_type = req.query.report_type;
    }

    // Lọc theo user báo cáo
    if (req.query.user_id) {
      find.where.user_id = req.query.user_id;
    }

    // Tìm kiếm nội dung
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find.where.content = { [Op.regexp]: objectSearch.keyword };
    }

    // Phân trang
    let initPagination = {
      currentPage: 1,
      limitItems: 10
    };

    const countReports = await Report.count({ where: find.where });
    const pagination = paginationHelper(initPagination, req.query, countReports);

    const listReport = await Report.findAll({
      ...find,
      limit: pagination.limitItems,
      offset: pagination.skip
    });

    return res.json({
      code: 200,
      data: listReport,
      pagination
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};
// GET /api/v1/report/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const report = await Report.findOne({
      where: { report_id: id }
    });

    if (!report) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy báo cáo"
      });
    }

    return res.json({
      code: 200,
      data: report
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};
// POST /api/v1/report/create
module.exports.create = async (req, res) => {
  try {
    const body = req.body;

    const allowedType = ["post", "user", "book", "chat"];
    if (!allowedType.includes(body.report_type)) {
      return res.status(400).json({
        code: 400,
        message: "report_type chỉ được: post, user, book, chat"
      });
    }

    const report = await Report.create(body);

    return res.json({
      code: 200,
      message: "Tạo báo cáo thành công",
      data: report
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};
// PATCH /api/v1/report/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const allowedType = ["post", "user", "book", "chat"];
    if (body.report_type && !allowedType.includes(body.report_type)) {
      return res.status(400).json({
        code: 400,
        message: "report_type chỉ được: post, user, book, chat"
      });
    }

    const [affectedRows] = await Report.update(body, {
      where: { report_id: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy báo cáo"
      });
    }

    return res.json({
      code: 200,
      message: "Cập nhật báo cáo thành công"
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// DELETE /api/v1/report/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Report.destroy({
      where: { report_id: id }
    });

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy báo cáo"
      });
    }

    return res.json({
      code: 200,
      message: "Xóa báo cáo thành công"
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message
    });
  }
};
// GET /api/v1/report/my-reports
module.exports.myReports = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const reports = await Report.findAll({
      where: { user_id: userId },
      order: [["generated_at", "DESC"]]
    });
    return res.json({
        code: 200,
        data: reports
    });
    } catch (error) {
    return res.status(500).json({
        code: 500,
        message: "Lỗi server",
        error: error.message
    });
  }
};