const { Op } = require("sequelize");
const Report = require("../models/report.model.js");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/Search");

const ALLOWED_TYPES = ["post", "user", "book", "chat"];

// GET /api/v1/report?report_type=&user_id=&target_id=&keyword=&page=&limit=
module.exports.index = async (req, res) => {
  try {
    const where = {};
    if (req.query.report_type) {
      if (!ALLOWED_TYPES.includes(req.query.report_type)) {
        return res.status(400).json({
          code: 400,
          message: "report_type chỉ được: post, user, book, chat",
        });
      }
      where.report_type = req.query.report_type;
    }
    if (req.query.user_id) {
      const uid = parseInt(req.query.user_id, 10);
      if (!Number.isFinite(uid)) {
        return res.status(400).json({ code: 400, message: "user_id không hợp lệ" });
      }
      where.user_id = uid;
    }

    if (req.query.target_id) {
      const tid = parseInt(req.query.target_id, 10);
      if (!Number.isFinite(tid)) {
        return res.status(400).json({ code: 400, message: "target_id không hợp lệ" });
      }
      where.target_id = tid;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
      const kw = objectSearch.keyword.trim();
      where[Op.or] = [
        { content: { [Op.like]: `%${kw}%` } },
        { notes: { [Op.like]: `%${kw}%` } },
      ];
    }
    const initPagination = { currentPage: 1, limitItems: 10 };
    const totalItems = await Report.count({ where });
    const pagination = paginationHelper(initPagination, req.query, totalItems);

    const data = await Report.findAll({
      where,
      order: [["generated_at", "DESC"]],
      limit: pagination.limitItems,
      offset: pagination.skip,
    });

    return res.json({
      code: 200,
      data,
      pagination: {
        current_page: pagination.currentPage,
        limit: pagination.limitItems,
        total_items: totalItems,
        total_pages: pagination.totalPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// GET /api/v1/report/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ code: 400, message: "id không hợp lệ" });
    }

    const report = await Report.findOne({ where: { report_id: id } });
    if (!report) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy báo cáo" });
    }

    return res.json({ code: 200, data: report });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// POST /api/v1/report/create (AUTH)
module.exports.create = async (req, res) => {
  try {
    const { report_type, target_id, content = null, notes = null } = req.body;

    if (!report_type || !ALLOWED_TYPES.includes(report_type)) {
      return res.status(400).json({
        code: 400,
        message: "report_type là bắt buộc và chỉ được: post, user, book, chat",
      });
    }

    const tid = parseInt(target_id, 10);
    if (!Number.isFinite(tid)) {
      return res.status(400).json({ code: 400, message: "target_id là bắt buộc và phải là số" });
    }
    const userId = req.user.user_id;
    const created = await Report.create({
      user_id: userId,
      report_type,
      target_id: tid,
      content,
      notes,
    });

    return res.json({
      code: 200,
      message: "Tạo báo cáo thành công",
      data: created,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// PATCH /api/v1/report/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ code: 400, message: "id không hợp lệ" });
    }
    const body = { ...req.body };
    delete body.user_id;
    delete body.report_id;

    if (body.report_type && !ALLOWED_TYPES.includes(body.report_type)) {
      return res.status(400).json({
        code: 400,
        message: "report_type chỉ được: post, user, book, chat",
      });
    }

    if (body.target_id !== undefined) {
      const tid = parseInt(body.target_id, 10);
      if (!Number.isFinite(tid)) {
        return res.status(400).json({ code: 400, message: "target_id không hợp lệ" });
      }
      body.target_id = tid;
    }

    const [affectedRows] = await Report.update(body, { where: { report_id: id } });
    if (affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy báo cáo" });
    }

    const updated = await Report.findOne({ where: { report_id: id } });
    return res.json({ code: 200, message: "Cập nhật báo cáo thành công", data: updated });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// DELETE /api/v1/report/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ code: 400, message: "id không hợp lệ" });
    }
    const deleted = await Report.destroy({ where: { report_id: id } });
    if (!deleted) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy báo cáo" });
    }
    return res.json({ code: 200, message: "Xóa báo cáo thành công" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};

// GET /api/v1/report/my-reports (AUTH)
module.exports.myReports = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const reports = await Report.findAll({
      where: { user_id: userId },
      order: [["generated_at", "DESC"]],
    });
    return res.json({ code: 200, data: reports });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
  }
};
