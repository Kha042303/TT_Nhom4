// back-end/api/v1/models/posts.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const Post = sequelize.define(
  "Post",
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_violation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM("visible", "hidden"),
      allowNull: true,
      defaultValue: "visible"
    },
    deleted: {
      type: DataTypes.ENUM("true", "false"),
      allowNull: false,
      defaultValue: "false"
    },
    image_url: {
  type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    tableName: "posts",
    timestamps: false
  }
);

Post.beforeUpdate((post) => {
  post.setDataValue("updated_at", new Date());
});

module.exports = Post;
