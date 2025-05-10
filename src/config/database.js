const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION);
};

module.exports = {
  connectDB,
};

// connectDB().then(() => {
//     console.log("Database connected successfully!!!");
// }).catch(err => {
//     console.log("BOOM ERROR");
// })
