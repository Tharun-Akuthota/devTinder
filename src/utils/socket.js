const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    // Handle the chat event

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      // this will join the socket to the room with the uniqueId
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, text, userId, targetUserId }) => {
        // for creating room we can also use crypto library to create a unique id
        // const roomId = [userId, targetUserId].sort().join("_");
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // check if userId and targetUserId are friends

          const existingConnection = await ConnectionRequestModel.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId },
            ],
            status: "accepted",
          });

          if (!existingConnection){
            throw new Error(" You must be connected to chat.");
            
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });

          await chat.save(); // save the chat to the database

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initSocket;
