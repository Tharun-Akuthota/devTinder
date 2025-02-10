const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decodeObj = await jwt.verify(token, "Dev@Tinder$143");
    const { _id } = decodeObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // setting user obj in request for next step
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};

module.exports = { userAuth };
