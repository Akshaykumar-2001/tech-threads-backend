const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect
    //env update **
    ();
};
module.exports = connectDB;
