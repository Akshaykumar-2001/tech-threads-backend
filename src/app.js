const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/userModel");
const { validateSignUpData } = require("./utils/validators");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { auth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    const jwtToken = await jwt.sign({ _id: user._id }, "Akshay$1209");
    console.log(jwtToken);
    res.cookie("token", jwtToken);
    res.send("login successfully !");
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userName = req.body.firstName;
  console.log(userName);
  try {
    const user = await User.find({ firstName: userName });
    if (user.length === 0) {
      res.send("user Not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR - " + err.message);
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000, () => {
      console.log("server of listening to 3000 port");
    });
  })
  .catch((err) => {
    console.log("DB not connected successfully");
  });
