import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

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
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
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
    }
  },
  {
    tableName: "posts",
    timestamps: false
  }
);

// HOOK: cập nhật updated_at trước khi UPDATE
Post.beforeUpdate((post) => {
  post.setDataValue("updated_at", new Date());
});

export default Post;
