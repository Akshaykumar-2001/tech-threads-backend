const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/userModel");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Akshay",
    lastName: "Kanugula",
    age: 22,
    gender: "male",
  };
  const user = new User(userObj);
  await user.save();
  res.send("saved to DB");
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
