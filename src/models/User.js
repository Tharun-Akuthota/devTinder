const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Created a new schema for the user with all the fields
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true /* for faster search and sorting, unique is not required when using index
       here i cannot add unique because it will not allow me to add multiple users with same name
       so we can use index instead of unique */,

      // compound index means index on multiple fields
      minlength: 3,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true, // remove spacesS
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not valid`,
      },
      // here validation is optional, enum already does the validation
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender type");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL" + value);
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using devTinder.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 }); // compound index to search by first name and last name faster

// DONT CREATE UNNECESSARY INDEXES, IT WILL SLOW DOWN THE WRITE OPERATION

// always use function instead of arrow function because arrow function does not bind "this"
// this will also helpful in testing and reusable anywhere
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInput, passwordHash);
  return isPasswordValid;
};

// Created a model for the user and userSchema
const User = mongoose.model("User", userSchema);

module.exports = User;

// https://adlinkfly.in/I7qyzjsT
// https://adlinkfly.in/joFo8

//https://adlinkfly.in/I5NYbfIP
