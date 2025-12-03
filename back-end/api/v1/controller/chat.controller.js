const { Chat, User, Sequelize, sequelize } = require("../models");
const { Op } = Sequelize;

module.exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.user_id; 
    const { receiver_id, message } = req.body;

    if (!receiver_id) {
      return res.json({
        code: 400,
        message: "thiếu thông tin người nhận"
      });
    }

    const newMessage = await Chat.create({
      sender_id: senderId,
      receiver_id,
      message
    });

    return res.json({
      code: 200,
      message: "Gửi tin nhắn thành công",
      data: newMessage
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi",
      error: error.message
    });
  }
};
module.exports.getMessages = async (req, res) => {
  try {
    const senderId = parseInt(req.user.user_id);
    const receiverId = parseInt(req.params.receiverId);

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id: senderId, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: senderId }
        ]
      },
      order: [["sent_at", "ASC"]],
      include: [
        { model: User, as: "sender", attributes: ["user_id", "full_name"] },
        { model: User, as: "receiver", attributes: ["user_id", "full_name"] }
      ]
    });

    return res.json({
      code: 200,
      message: "Lấy tin nhắn thành công",
      data: messages
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi",
      error: error.message
    });
  }
};
