const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const Role = sequelize.define(
  "Role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

Role.associate = (models) => {
  Role.hasMany(models.UserRole, {
    foreignKey: "role_id",
    as: "user_roles",
  });
};

module.exports = Role;
