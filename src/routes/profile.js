const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const profileRouter = express.Router();
const { validateProfileUpdate } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  // validate the token

  //token will be replaced after new user login
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdate(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}'s profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = req.user;
    const isMatch = await bcrypt.compare(password, user.password);
    // or const isMatch = await user.validatePassword(password); bcoz this fn already made for user schema

    if (!isMatch) {
      throw new Error("Incorrect Password, Try again!!!");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    res.send("Password Updated Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
