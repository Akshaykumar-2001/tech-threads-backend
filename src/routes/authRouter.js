const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validators");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Email/password is incorrect");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email/password is incorrect");
    }
    const jwtToken = await jwt.sign({ _id: user._id }, "Akshay$1209", {
      expiresIn: "1d",
    });
    console.log(jwtToken);
    res.cookie("token", jwtToken);
    res.send("login successfully !");
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

module.exports = authRouter;
