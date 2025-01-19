const express = require("express");
const bcrypt = require("bcrypt");
const { validationSignup } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../models/User");

// sending data to database
authRouter.post("/signup", async (req, res) => {
  /*
  const userObj = {
      firstName: "Vishnu",
      lastName: "Akuthota",
      emailId: "vishnu@gmail.com",
      password: "tharun@123",
  };

  console.log(req.body);

  created an instance of User
  */

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

    await user.save();
    res.send("User created successfully");
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
      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.send("User logged in successfully");
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
