const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://tharunakuthota:HpYTcegEQoYyUorx@cluser0.ijruy.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};

// connectDB().then(() => {
//     console.log("Database connected successfully!!!");
// }).catch(err => {
//     console.log("BOOM ERROR");
// })
