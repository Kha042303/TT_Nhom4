const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

// ✅ chỉnh lại đúng đường dẫn models của bạn
// ví dụ có thể là: const { Chat } = require("./api/v1/models");
const { Chat } = require("./api/v1/models");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function saveBase64ImageToChatFolder(base64Str) {
  // base64Str dạng: "data:image/png;base64,AAAA..."
  const match = String(base64Str).match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;

  const mime = match[1];           // image/png
  const data = match[2];           // base64 payload
  const ext = mime.split("/")[1];  // png

  const chatDir = path.join(process.cwd(), "images", "chat");
  ensureDir(chatDir);

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filepath = path.join(chatDir, filename);

  fs.writeFileSync(filepath, Buffer.from(data, "base64"));

  // server đã public /images -> images/ :contentReference[oaicite:2]{index=2}
  return `/images/chat/${filename}`;
}

module.exports = function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
    // nếu bạn gửi base64 ảnh, đôi khi cần tăng buffer:
    // maxHttpBufferSize: 5e6, // 5MB (tùy bạn)
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (user_id) => {
      // ✅ ép String để tránh lệch kiểu key
      onlineUsers.set(String(user_id), socket.id);
      console.log("ONLINE USERS:", onlineUsers);
    });

    // ✅ flow cũ: client emit sendMessage
    // payload mới: { sender_id, receiver_id, message, images }
    // images: có thể là mảng base64 hoặc mảng URL (nếu bạn tự upload kiểu khác)
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

        // ✅ convert base64 -> file url, còn nếu là url thì giữ nguyên
        const imageUrls = imgs
          .map((item) => {
            if (typeof item !== "string") return null;
            if (item.startsWith("data:image/")) return saveBase64ImageToChatFolder(item);
            return item; // assume URL/path
          })
          .filter(Boolean);

        // ✅ lưu DB ngay trong socket (đúng flow cũ)
        const saved = await Chat.create({
          sender_id,
          receiver_id,
          message: msg || null,
          images: imageUrls,
        });

        // ✅ emit realtime cho receiver
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

        // trả ACK cho sender (để FE update UI ngay)
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
