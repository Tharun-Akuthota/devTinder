const express = require("express");
const app = express();
const PORT = 7777;
const User = require("./models/User");
const { connectDB } = require("./config/database");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
// middleware to send JSON to database
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Get user data
app.get("/signup", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail }); // returns an array of objects
    if (users.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Get all users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update the user data using PATCH API
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    const ALLOWED_FIELDS = [
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
      "lastName",
      "firstName",
    ];
    const isAllowedUpdates = Object.keys(data).every((k) =>
      ALLOWED_FIELDS.includes(k)
    );

    if (!isAllowedUpdates) {
      throw new Error("Invalid updates");
    }
    const userData = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true, // these are options, used to return the updated data
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED... " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server listening to ${PORT}....`);
    });
  })
  .catch((err) => {
    console.log("BOOOM ERROR!!!");
  });

// hifemov976@rabitex.com
