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
    }
    ,
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.LONGTEXT,
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
    }
  },
  {
    tableName: "posts",
    timestamps: false
  }
);

// cập nhật updated_at trước khi UPDATE
Post.beforeUpdate((post) => {
  post.setDataValue("updated_at", new Date());
});

export default Post;
