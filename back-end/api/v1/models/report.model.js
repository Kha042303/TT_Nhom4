import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Report = sequelize.define(
  "Report",
  {
    repost_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    repost_type: {
      type: DataTypes.ENUM("post", "user", "book", "chat"),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    tableName: "reports",
    timestamps: false
  }
);

export default Report;
