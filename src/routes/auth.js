const express = require("express");
const bcrypt = require("bcrypt");
const { validationSignup } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../models/User");

// sending data to database
authRouter.post("/signup", async (req, res) => {
  try {
    validationSignup(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Unable to post data " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await user.validatePassword(password);

    if (isMatch) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

//logout cleaning APIs
authRouter.post("/logout", async (req, res) => {
  res
    /* .cookie("token", null, { expires: new Date(Date.now()) }) */
    .clearCookie("token")
    .send(" logged out successfully");
});

module.exports = authRouter;
