const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this is used to reference the User model, act as a foreign key and links the two models
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", async function (next) {
  const existingRequest = this;
  if (existingRequest.fromUserId.equals(existingRequest.toUserId)) {
    throw new Error("You cannot send request to yourself");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
