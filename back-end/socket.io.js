const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const { Chat } = require("./api/v1/models");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function saveBase64ImageToChatFolder(base64Str) {
  const match = String(base64Str).match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;

  const mime = match[1];         
  const data = match[2];           
  const ext = mime.split("/")[1]; 

  const chatDir = path.join(process.cwd(), "images", "chat");
  ensureDir(chatDir);

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filepath = path.join(chatDir, filename);

  fs.writeFileSync(filepath, Buffer.from(data, "base64"));
  return `/images/chat/${filename}`;
}

module.exports = function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
   
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (user_id) => {
     
      onlineUsers.set(String(user_id), socket.id);
      console.log("ONLINE USERS:", onlineUsers);
    });

    socket.on("sendMessage", async ({ sender_id, receiver_id, message, images }, ack) => {
      try {
        const msg = (message || "").trim();
        const imgs = Array.isArray(images) ? images : [];

        if (!receiver_id) {
          return ack?.({ ok: false, error: "thiếu thông tin người nhận" });
        }
        if (!msg && imgs.length === 0) {
          return ack?.({ ok: false, error: "Vui lòng nhập tin nhắn hoặc chọn ảnh" });
        }

        const imageUrls = imgs
          .map((item) => {
            if (typeof item !== "string") return null;
            if (item.startsWith("data:image/")) return saveBase64ImageToChatFolder(item);
            return item; 
          })
          .filter(Boolean);

       
        const saved = await Chat.create({
          sender_id,
          receiver_id,
          message: msg || null,
          images: imageUrls,
        });
        const receiverSocket = onlineUsers.get(String(receiver_id));
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiverMessage", {
            sender_id,
            receiver_id,
            message: saved.message,
            images: saved.images,
            sent_at: saved.sent_at,
            chat_id: saved.chat_id,
          });
        }
        ack?.({ ok: true, data: saved });
      } catch (e) {
        console.error(e);
        ack?.({ ok: false, error: e.message });
      }
    });

    socket.on("disconnect", () => {
      for (let [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return server;
};
