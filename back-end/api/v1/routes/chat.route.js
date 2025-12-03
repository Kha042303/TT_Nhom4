const express = require("express");
const router = express.Router();

const chatController = require("../controller/chat.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

// gửi tin nhắn
router.post("/send", authMiddleware, chatController.sendMessage);

// lấy tin nhắn giữa người dùng hiện tại và người dùng khác
router.get("/:receiverId", authMiddleware, chatController.getMessages);

module.exports = router;
