const express = require("express");
const getuserRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

getuserRouter.get("/getuser", userAuth, async (req, res) => {
  try {
    const { token } = req.cookies;
    const userId = await jwt.verify(token, "Akshay$1209");
    if (!userId) {
      throw new Error("Something went wrong");
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = getuserRouter;
