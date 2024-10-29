const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId } = req.body;
  console.log(emailId, firstName);
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

module.exports = { validateSignUpData };
