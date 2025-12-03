const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const Chat = sequelize.define(
  "Chat",
  {
    chat_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "chats",
    timestamps: false,
  }
);

Chat.associate = (models) => {
  Chat.belongsTo(models.User, {
    foreignKey: "sender_id",
    as: "sender",
  });

  Chat.belongsTo(models.User, {
    foreignKey: "receiver_id",
    as: "receiver",
  });
};
module.exports = Chat;
