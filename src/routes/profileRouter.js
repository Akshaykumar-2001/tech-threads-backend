const express = require("express");
const profileRouter = express.Router();
const User = require("../models/userModel");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validators");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const userName = req.user.firstName;
  // console.log(userName);
  try {
    const user = await User.find({ firstName: userName });
    if (!user === 0) {
      res.json("user Not found");
    }
    res.json({ message: "user sent!", user });
  } catch (err) {
    res.status(400).json("ERROR - " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invali edit2 !!");
    }
    const newData = req.body;
    const user = req.user;
    Object.keys(newData).forEach((key) => {
      user[key] = newData[key];
    });
    const newUser = await user.save();
    res.json({ message: "edit successful !! ", user: newUser });
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    //re entering password
    const { newPassword, oldPassword } = req.body;
    const user = req.user;
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("incorrect password !");
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save();
    res.send("password updated");
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

module.exports = profileRouter;
