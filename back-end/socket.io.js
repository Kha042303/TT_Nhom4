const http = require("http");
const { Server } = require("socket.io");

module.exports = function setupSocket(app) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiverMessage", {
          senderId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      for (let [id, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) onlineUsers.delete(id);
      }
    });
  });

  return server;
};
