const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect
    //process.env.
    ();
};
module.exports = connectDB;
