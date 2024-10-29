const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/userModel");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // new instance of user from User model
  console.log(user);
  try {
    await user.save();
    res.send("saved to DB");
  } catch (err) {
    res.status(400).send(err);
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
    res.send(err);
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
