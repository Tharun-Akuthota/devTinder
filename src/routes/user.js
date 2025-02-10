const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/User");

const USER_SAFE_DATA = "firstName lastName photoUrl age about skills";

// get all the connection requests sent by the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // populate is used to get the details of the user who sent the request
    // the second argument is used to select the fields that we want to get from the user
    // this can also be used .populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Connection requests fetched successfully",
      connectionRequests: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Total connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Pagination means that we will only fetch a limited number of records at a time

    const page = parseInt(req.query.page) || 1; // if page is not provided, then default to 1
    let limit = parseInt(req.query.limit) || 10; // if limit is not provided, then default to 10
    limit = limit > 50 ? 50 : limit; // limit the number of records that can be fetched at a time
    const skip = (page - 1) * limit;

    // Find all the connection requests (sent + received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId status");

    const hiddenUsers = new Set(); // set is used to store unique values and return them in an array

    connectionRequests.forEach((row) => {
      hiddenUsers.add(row.fromUserId.toString());
      hiddenUsers.add(row.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // skip and limit are used for pageination, here we skip the first (page-1)*limit records and fetch the next limit records

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;
