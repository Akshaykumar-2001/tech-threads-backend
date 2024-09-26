const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Akshay:Akshay%40321@cluster0.uysi3.mongodb.net/techTreads"
  );
};
module.exports = connectDB;
