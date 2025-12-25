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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    report_type: {
      type: DataTypes.ENUM("post", "user", "book", "chat"),
      allowNull: false,
    },
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
      defaultValue: DataTypes.NOW, 
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
