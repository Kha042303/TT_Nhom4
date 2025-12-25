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
    published_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    seller_note: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    image_url: {
      type: DataTypes.TEXT("long"),
    },
    status: {
      type: DataTypes.STRING(20),
    },
    deleted: {
      type: DataTypes.ENUM("true", "false"),
      allowNull: false,
      defaultValue: "false",
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = books;
