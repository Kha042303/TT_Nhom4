const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expire_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "user_roles",
    timestamps: false,
  }
);

UserRole.associate = (models) => {
  UserRole.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  UserRole.belongsTo(models.Role, {
    foreignKey: "role_id",
    as: "role",
  });
};

module.exports = UserRole;
