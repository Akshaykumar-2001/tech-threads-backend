const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/userModel");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body); // new instance of user from User model
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
