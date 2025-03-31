const express = require("express");
const app = express();
const User = require("./models/User");
const { connectDB } = require("./config/database");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const initSocket = require("./utils/socket");

initSocket(server); // pass the server to the socket function

require("dotenv").config();

let corsOptions = {
  origin: ["http://localhost:7777", "http://localhost:5173"], // add alternative origin here origin
  credentials: true,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}; // this will allow the request from the specified origin and cookies will be sent
// if the origin is not specified, then the request will be blocked by the browser, and cookies will not be sent

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// app.use(cors());
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
    server.listen(process.env.PORT, () => {
      console.log(`Server listening to ${process.env.PORT}....`);
    });
  })
  .catch((err) => {
    console.log("BOOOM ERROR!!!" + err.message);
  });

// hifemov976@rabitex.com
