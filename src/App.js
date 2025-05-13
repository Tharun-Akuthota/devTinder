const express = require("express");
const app = express();
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
const chatRouter = require("./routes/chat");

initSocket(server); // pass the server to the socket function

require("dotenv").config();

let corsOptions = {
  origin: [
    "http://localhost:7777",
    "http://localhost:5173",
    process.env.BASE_URL,
  ], // add alternative origin here origin
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
app.use("/", chatRouter);

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
