const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validators");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // 1. validation
    validateSignUpData(req);
    //2. encrypt data
    const passwordHash = await bcrypt.hash(password, 10);
    //3. create new instance of user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // new instance of user from User model
    await user.save();
    res.send("saved to DB");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // checking weather user is there or not
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User dose not exist. Sign In ");
    }
    // checking pass
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email/password is incorrect");
    }
    // verifying and getting data from token
    const jwtToken = await jwt.sign({ _id: user._id }, "Akshay$1209", {
      expiresIn: "1h",
    });
    // console.log(jwtToken);
    // attacking token to cookies in (name , value) pairs
    res.cookie("token", jwtToken);
    res.json({ message: "login successfully !", user });
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("loged out !!");
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

module.exports = authRouter;
