import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const Chat = sequelize.define(
  "Chat",
  {
    chat_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT("long"),
      allowNull: false
    },
    send_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "chats",
    timestamps: false
  }
);

export default Chat;
