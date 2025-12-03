const http = require("http");
const { Server } = require("socket.io");

module.exports = function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (user_id) => {
      onlineUsers.set(user_id, socket.id);
      console.log("ONLINE USERS:", onlineUsers);
    });
    socket.on("sendMessage", ({ sender_id, receiver_id, message }) => {
      const receiverSocket = onlineUsers.get(receiver_id);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiverMessage", {
          sender_id,
          receiver_id,
          message,
        });
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
