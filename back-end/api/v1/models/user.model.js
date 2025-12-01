const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");
const generateHelpers = require("../../../helpers/generate.js");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: true,
      defaultValue: "user",
    },

    create_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "banned"),
      allowNull: true,
      defaultValue: "active",
    },

    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    deleted: {
      type: DataTypes.ENUM("true", "false"),
      allowNull: false,
      defaultValue: "false",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.associate = (models) => {
  // Post relationship
  // User.hasMany(models.Post, {
  //   foreignKey: "user_id",
  //   as: "posts",
  // });
 User.hasMany(models.Chat, {
    foreignKey: "sender_id",
    as: "sender",   // phải trùng với alias trong Chat.belongsTo
  });

  User.hasMany(models.Chat, {
    foreignKey: "receiver_id",
    as: "receiver",  // phải trùng với alias trong Chat.belongsTo
  });
};

module.exports = User;
