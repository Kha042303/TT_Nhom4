const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const Report = sequelize.define(
  "Report",
  {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    // người tạo report
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    report_type: {
      type: DataTypes.ENUM("post", "user", "book", "chat"),
      allowNull: false,
    },

    // id đối tượng bị report (post_id / user_id / book_id / chat_id tùy report_type)
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // tương đương CURRENT_TIMESTAMP
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "reports",
    timestamps: false,
  }
);

module.exports = Report;
