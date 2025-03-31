const socket = require("socket.io");

const initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    // Handle the chat event

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("Joining room: ", roomId);

      socket.join(roomId);
      // this will join the socket to the room with the uniqueId
    });

    socket.on("sendMessage", ({ firstName, text, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      io.to(rooId).emit("messageReceived", {
        firstName,
        text,
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initSocket;
