const validator = require("validator");
const User = require("../models/User");

const validationSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Please enter all fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter valid password");
  }
};

const validateProfileUpdate = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];

  // validate the data like photoUrl is url or not, about length and skills length 10

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isUpdateAllowed;
};

// https://mega.nz/folder/KMt2HBBC#qvYeDpq3SpsJa1EcaPYzsA

// https://mega.nz/folder/4z8V1bSC#mLrxxAWpxn-jLwx6TCpS_Q

// https://mega.nz/folder/uMl0FRIQ#wrFlnS0FYn2cgE35_3Y75w

// https://mega.nz/folder/ogg2CTTK#SAqXknE3EfbRpYD74Go6TQ

module.exports = { validationSignup, validateProfileUpdate };
