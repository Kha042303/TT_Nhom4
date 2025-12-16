const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const books = sequelize.define(
  "books",
  {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
    },
    publisher: {
      type: DataTypes.STRING(100),
    },
    price: {
      type: DataTypes.FLOAT,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT("long"),
    },
    category: {
      type: DataTypes.STRING(100),
    },
    image_url: {
      type: DataTypes.TEXT("long"),
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    deleted: {
      type: DataTypes.ENUM("true", "false"),
      allowNull: false,
      defaultValue: "false"
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = books;
