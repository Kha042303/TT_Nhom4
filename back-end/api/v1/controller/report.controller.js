import Report from "../../models/report.model.js";

// GET /report
export const index = async (req, res) => {
  try {
    const Reports = await Report.findAll({
      raw: true
    });

    res.render("client/pages/report/index", {
      reports: Reports
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.send(err);
  }
};
