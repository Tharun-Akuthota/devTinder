const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    // Handle the chat event

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining room: ", roomId);

      socket.join(roomId);
      // this will join the socket to the room with the uniqueId
    });

    socket.on("sendMessage", ({ firstName, text, userId, targetUserId }) => {
      // for creating room we can also use crypto library to create a unique id
      // const roomId = [userId, targetUserId].sort().join("_");

      const roomId = getSecretRoomId(userId, targetUserId);

      io.to(roomId).emit("messageReceived", {
        firstName,
        text,
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initSocket;
