const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not valid Login again !!");
    }
    const decodeData = await jwt.verify(token, "Akshay$1209");
    const user = await User.findById(decodeData._id);
    if (!user) {
      throw new Error("User not valid Login again !!");
    }
    req.user = user;
    next(); //*
  } catch (err) {
    res.status(400).send(err.message);
  }
};
module.exports = { auth };
