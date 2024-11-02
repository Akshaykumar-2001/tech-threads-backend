const express = require("express");
const profileRouter = express.Router();
const User = require("../models/userModel");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  const userName = req.body.firstName;
  console.log(userName);
  try {
    const user = await User.find({ firstName: userName });
    if (!user === 0) {
      res.send("user Not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

module.exports = profileRouter;
