const validator = require("validator");
const User = require("../models/User");

const validationSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Please enter all fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter Strong password");
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

module.exports = { validationSignup, validateProfileUpdate };
