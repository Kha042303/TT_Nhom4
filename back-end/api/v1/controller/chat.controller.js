import Chat from "../../models/chat.model.js";
import { Op } from "sequelize";

// GET /chat/
export const index = async (req, res) => {
  try {
    // ⚠️ Thay 10 bằng ID người dùng thực (vd: req.user.id)
    const currentUserId = 10;

    // Lấy dữ liệu chat
    const chatRecords = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId },
          { receiver_id: currentUserId }
        ]
      },
      order: [["send_at", "ASC"]],
      raw: true
    });

    // Chuyển send_at thành kiểu Date (nếu hợp lệ)
    const messages = chatRecords.map((msg) => {
      const safeMsg = { ...msg };
      if (safeMsg.send_at) {
        const dateObject = new Date(safeMsg.send_at);
        if (!isNaN(dateObject.getTime())) {
          safeMsg.send_at = dateObject;
        }
      }
      return safeMsg;
    });

    // Render giao diện
    res.render("client/pages/chat/index", {
      messages,
      currentUserId
    });

  } catch (err) {
    console.error("ERROR loading chat:", err);
    res.status(500).send("Lỗi Server khi tải dữ liệu chat.");
  }
};
