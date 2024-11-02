const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId } = req.body;

  if (firstName.length === 0) {
    throw new Error("Enter valid first name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("lenght of first name should be 4-50 characters");
  } else if (lastName.length === 0) {
    throw new Error("Enter valid first name");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("lenght of first name should be 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter valid email id");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isValidEdit = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  if (!isValidEdit) {
    throw new Error("Invalid edit1 !!");
  }
  if (req?.body?.skills?.size > 15) {
    throw new Error("Skills must be less than 15");
  }
  if (req?.body?.about?.size > 100) {
    throw new Error("about must be less than 100 chars");
  }
  return isValidEdit;
};

module.exports = { validateSignUpData, validateProfileEditData };
