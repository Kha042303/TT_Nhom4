const express = require("express");
const router = express.Router();

const chatController = require("../controller/chat.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const uploadChatImages = require("../middlewares/chat.upload.middleware.js");

router.post("/send",authMiddleware,uploadChatImages.array("images", 10),chatController.sendMessage);
router.get("/:receiverId", authMiddleware, chatController.getMessages);

module.exports = router;
