const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
});

// const User = mongoose.model("User", userSchema);
// module.exports=User;
module.exports = mongoose.model("User", userSchema);
