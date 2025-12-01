const express = require("express");
const router = express.Router();

const chatController = require("../controller/chat.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

// POST /api/v1/chat/send
router.post("/send", authMiddleware, chatController.sendMessage);

// GET /api/v1/chat/:receiverId
router.get("/:receiverId", authMiddleware, chatController.getMessages);

module.exports = router;
